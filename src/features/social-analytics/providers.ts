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
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new Error(`Provider returned an invalid ${field}.`);
  }
  return count;
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
  if (typeof body.access_token !== "string") {
    throw new Error("YouTube token refresh returned no access token.");
  }
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
  const body = await providerJson(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const item = Array.isArray(body.items)
    ? body.items[0] as Record<string, unknown> | undefined
    : undefined;
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
    const result = await fetchYouTube();
    await recordSocialMetric(provider, result.accountId, result.count);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Provider request failed.";
    await markConnectionError(
      provider,
      message,
      /expired|reconnect|unauthorized|token/i.test(message) ? "expired" : "error",
    );
    throw error;
  }
}
