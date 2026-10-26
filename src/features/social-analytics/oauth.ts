import "server-only";

import {
  createOAuthState,
  saveConnection,
  verifyOAuthState,
} from "./social-analytics";

const youtubeScope = "https://www.googleapis.com/auth/youtube.readonly";

export function oauthUrl(provider: "youtube", state: string) {
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (!redirectUri) throw new Error("Missing OAuth redirect URI for youtube.");
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID ?? "")}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(youtubeScope)}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;
}

async function providerJson(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) throw new Error("OAuth provider authorization failed.");
  return body ?? {};
}

export async function completeOAuth(provider: "youtube", code: string) {
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "";
  const token = await providerJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  if (typeof token.access_token !== "string") {
    throw new Error("Google authorization returned no access token.");
  }
  const channel = await providerJson(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    { headers: { Authorization: `Bearer ${token.access_token}` } },
  );
  const item = Array.isArray(channel.items)
    ? channel.items[0] as Record<string, unknown> | undefined
    : undefined;
  const snippet = item?.snippet as Record<string, unknown> | undefined;
  if (typeof item?.id !== "string") {
    throw new Error("No YouTube channel was found for this Google account.");
  }
  await saveConnection({
    provider,
    accountId: item.id,
    accountName: typeof snippet?.title === "string" ? snippet.title : "YouTube channel",
    accessToken: token.access_token,
    refreshToken: typeof token.refresh_token === "string" ? token.refresh_token : undefined,
    expiresAt: typeof token.expires_in === "number"
      ? new Date(Date.now() + token.expires_in * 1000)
      : undefined,
    scopes: [youtubeScope],
  });
}

export { createOAuthState, verifyOAuthState };
