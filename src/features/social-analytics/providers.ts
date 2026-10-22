import "server-only";

import {
  accessToken,
  getConnection,
  markConnectionError,
  recordSocialMetric,
  refreshToken,
  saveConnection,
  type SocialProvider,
} from "./social-analytics";

type ProviderResult = { count: number; accountId: string; accountName: string };

async function providerJson(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) {
    const providerError = body?.error as Record<string, unknown> | undefined;
    const message = typeof body?.error_description === "string"
      ? body.error_description
      : typeof providerError?.message === "string"
        ? providerError.message
        : `Provider request failed (${response.status}).`;
    throw new Error(message);
  }
  return body ?? {};
}

function numberField(value: unknown, field: string) {
  const count = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error(`Provider returned an invalid ${field}.`);
  return count;
}

async function fetchFacebook(): Promise<ProviderResult> {
  const connection = await getConnection("facebook");
  if (!connection) throw new Error("Facebook is not connected.");
  const token = accessToken(connection);
  const page = await providerJson(
    `https://graph.facebook.com/v23.0/${encodeURIComponent(connection.account_id)}?fields=name,followers_count`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return {
    count: numberField(page.followers_count, "follower count"),
    accountId: connection.account_id,
    accountName: typeof page.name === "string" ? page.name : connection.account_name,
  };
}

async function fetchInstagram(): Promise<ProviderResult> {
  let connection = await getConnection("instagram");
  if (!connection) throw new Error("Instagram is not connected.");
  let token = accessToken(connection);
  if (connection.expires_at && connection.expires_at.getTime() < Date.now() + 7 * 24 * 60 * 60 * 1000) {
    const refreshed = await providerJson(
      "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (typeof refreshed.access_token !== "string") throw new Error("Instagram token refresh returned no access token.");
    await saveConnection({
      provider: "instagram",
      accountId: connection.account_id,
      accountName: connection.account_name,
      accessToken: refreshed.access_token,
      expiresAt: typeof refreshed.expires_in === "number"
        ? new Date(Date.now() + refreshed.expires_in * 1000)
        : undefined,
      scopes: connection.scopes,
      metadata: connection.metadata,
    });
    connection = (await getConnection("instagram"))!;
    token = accessToken(connection);
  }
  const profile = await providerJson(
    `https://graph.instagram.com/${encodeURIComponent(connection.account_id)}?fields=username,followers_count`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return {
    count: numberField(profile.followers_count, "follower count"),
    accountId: connection.account_id,
    accountName: typeof profile.username === "string" ? profile.username : connection.account_name,
  };
}

async function fetchTikTok(): Promise<ProviderResult> {
  let connection = await getConnection("tiktok");
  if (!connection) throw new Error("TikTok is not connected.");
  let token = accessToken(connection);
  if (connection.expires_at && connection.expires_at.getTime() < Date.now() + 60_000) {
    const storedRefreshToken = refreshToken(connection);
    if (!storedRefreshToken) throw new Error("TikTok authorization must be reconnected.");
    const refreshed = await providerJson("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY ?? "",
        client_secret: process.env.TIKTOK_CLIENT_SECRET ?? "",
        grant_type: "refresh_token",
        refresh_token: storedRefreshToken,
      }),
    });
    if (typeof refreshed.access_token !== "string") throw new Error("TikTok token refresh returned no access token.");
    await saveConnection({
      provider: "tiktok",
      accountId: connection.account_id,
      accountName: connection.account_name,
      accessToken: refreshed.access_token,
      refreshToken: typeof refreshed.refresh_token === "string"
        ? refreshed.refresh_token
        : storedRefreshToken,
      tokenType: typeof refreshed.token_type === "string" ? refreshed.token_type : connection.token_type,
      expiresAt: typeof refreshed.expires_in === "number"
        ? new Date(Date.now() + refreshed.expires_in * 1000)
        : undefined,
      scopes: connection.scopes,
      metadata: connection.metadata,
    });
    connection = (await getConnection("tiktok"))!;
    token = accessToken(connection);
  }
  const body = await providerJson("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,follower_count", {
    headers: { Authorization: `${connection.token_type} ${token}` },
  });
  const data = (body.data ?? {}) as Record<string, unknown>;
  return {
    count: numberField(data.user && (data.user as Record<string, unknown>).follower_count, "follower count"),
    accountId: connection.account_id,
    accountName: typeof (data.user as Record<string, unknown> | undefined)?.display_name === "string"
      ? (data.user as Record<string, string>).display_name
      : connection.account_name,
  };
}

async function refreshGoogleToken() {
  const connection = await getConnection("youtube");
  if (!connection) throw new Error("YouTube is not connected.");
  const token = refreshToken(connection);
  if (!token) throw new Error("YouTube authorization must be reconnected.");
  const body = await providerJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: token,
      grant_type: "refresh_token",
    }),
  });
  if (typeof body.access_token !== "string") throw new Error("YouTube token refresh returned no access token.");
  await saveConnection({
    provider: "youtube",
    accountId: connection.account_id,
    accountName: connection.account_name,
    accessToken: body.access_token,
    refreshToken: token,
    tokenType: typeof body.token_type === "string" ? body.token_type : "Bearer",
    expiresAt: typeof body.expires_in === "number"
      ? new Date(Date.now() + body.expires_in * 1000)
      : undefined,
    scopes: connection.scopes,
    metadata: connection.metadata,
  });
  return body.access_token;
}

async function fetchYouTube(): Promise<ProviderResult> {
  const connection = await getConnection("youtube");
  if (!connection) throw new Error("YouTube is not connected.");
  let token = accessToken(connection);
  if (connection.expires_at && connection.expires_at.getTime() < Date.now() + 60_000) {
    token = await refreshGoogleToken();
  }
  const body = await providerJson("https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const item = Array.isArray(body.items) ? body.items[0] as Record<string, unknown> | undefined : undefined;
  const statistics = item?.statistics as Record<string, unknown> | undefined;
  const snippet = item?.snippet as Record<string, unknown> | undefined;
  return {
    count: numberField(statistics?.subscriberCount, "subscriber count"),
    accountId: connection.account_id,
    accountName: typeof snippet?.title === "string" ? snippet.title : connection.account_name,
  };
}

export async function refreshProvider(provider: SocialProvider) {
  try {
    const result = provider === "facebook"
      ? await fetchFacebook()
      : provider === "instagram"
        ? await fetchInstagram()
        : provider === "tiktok"
          ? await fetchTikTok()
          : await fetchYouTube();
    await recordSocialMetric(provider, result.accountId, result.count);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provider request failed.";
    await markConnectionError(provider, message, /expired|reconnect|unauthorized|token/i.test(message) ? "expired" : "error");
    throw error;
  }
}
