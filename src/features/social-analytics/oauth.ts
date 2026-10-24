import "server-only";

import {
  createOAuthState,
  saveConnection,
  type SocialProvider,
  verifyOAuthState,
} from "./social-analytics";
import { createHash, randomBytes } from "node:crypto";

const scopes = {
  facebook: "pages_show_list,pages_read_engagement",
  instagram: "instagram_business_basic",
  tiktok: "user.info.basic,user.info.stats",
  youtube: "https://www.googleapis.com/auth/youtube.readonly",
} satisfies Record<SocialProvider, string>;

function isTikTokWebRedirect(redirectUri: string) {
  return redirectUri.startsWith("https://");
}

export function oauthUrl(provider: SocialProvider, state: string) {
  const redirectUri = process.env[`${provider === "youtube" ? "GOOGLE" : provider.toUpperCase()}_OAUTH_REDIRECT_URI`];
  if (!redirectUri) throw new Error(`Missing OAuth redirect URI for ${provider}.`);
  if (provider === "facebook") {
    return `https://www.facebook.com/v23.0/dialog/oauth?client_id=${encodeURIComponent(process.env.FACEBOOK_APP_ID ?? "")}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.facebook)}&response_type=code&state=${encodeURIComponent(state)}`;
  }
  if (provider === "instagram") {
    return `https://www.instagram.com/oauth/authorize?client_id=${encodeURIComponent(process.env.INSTAGRAM_APP_ID ?? "")}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.instagram)}&response_type=code&state=${encodeURIComponent(state)}`;
  }
  if (provider === "tiktok") {
    const clientKey = encodeURIComponent(process.env.TIKTOK_CLIENT_KEY ?? "");
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const encodedScope = encodeURIComponent(scopes.tiktok);
    const baseUrl =
      `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}` +
      `&redirect_uri=${encodedRedirectUri}&scope=${encodedScope}` +
      `&response_type=code&state=${encodeURIComponent(state)}`;

    if (isTikTokWebRedirect(redirectUri)) return baseUrl;

    const codeVerifier = randomBytes(32).toString("base64url");
    const codeChallenge = createHash("sha256")
      .update(codeVerifier)
      .digest("hex");
    return {
      url: `${baseUrl}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`,
      codeVerifier,
    };
  }
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(process.env.GOOGLE_CLIENT_ID ?? "")}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes.youtube)}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;
}

async function providerJson(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) throw new Error("OAuth provider authorization failed.");
  return body ?? {};
}

export async function completeOAuth(
  provider: SocialProvider,
  code: string,
  codeVerifier?: string,
) {
  const redirectUri = process.env[`${provider === "youtube" ? "GOOGLE" : provider.toUpperCase()}_OAUTH_REDIRECT_URI`] ?? "";
  if (provider === "facebook") {
    const token = await providerJson("https://graph.facebook.com/v23.0/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID ?? "",
        client_secret: process.env.FACEBOOK_APP_SECRET ?? "",
        redirect_uri: redirectUri,
        code,
      }),
    });
    const accessToken = String(token.access_token ?? "");
    const pages = await providerJson("https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!accessToken) throw new Error("Facebook authorization returned no user access token.");
    if (!Array.isArray(pages.data) || pages.data.length === 0) {
      throw new Error("No Facebook Pages are available for this account.");
    }
    return { provider: "facebook" as const, userAccessToken: accessToken };
  }
  if (provider === "instagram") {
    const token = await providerJson("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID ?? "",
        client_secret: process.env.INSTAGRAM_APP_SECRET ?? "",
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });
    if (typeof token.access_token !== "string" || typeof token.user_id !== "string") {
      throw new Error("Instagram authorization returned incomplete account data.");
    }
    const longLived = await providerJson(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(process.env.INSTAGRAM_APP_SECRET ?? "")}&access_token=${encodeURIComponent(token.access_token)}`,
    );
    await saveConnection({
      provider,
      accountId: token.user_id,
      accountName: typeof token.user_id === "string" ? token.user_id : "Instagram Business",
      accessToken: typeof longLived.access_token === "string" ? longLived.access_token : token.access_token,
      expiresAt: typeof longLived.expires_in === "number"
        ? new Date(Date.now() + longLived.expires_in * 1000)
        : undefined,
      scopes: [scopes.instagram],
    });
    return;
  }
  if (provider === "tiktok") {
    const body = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY ?? "",
      client_secret: process.env.TIKTOK_CLIENT_SECRET ?? "",
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });
    if (!isTikTokWebRedirect(redirectUri)) {
      if (!codeVerifier) {
        throw new Error("TikTok authorization did not return a valid PKCE verifier.");
      }
      body.set("code_verifier", codeVerifier);
    }
    const token = await providerJson("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (typeof token.access_token !== "string" || typeof token.open_id !== "string") {
      throw new Error("TikTok authorization returned incomplete account data.");
    }
    await saveConnection({
      provider,
      accountId: token.open_id,
      accountName: token.open_id,
      accessToken: token.access_token,
      refreshToken: typeof token.refresh_token === "string" ? token.refresh_token : undefined,
      expiresAt: typeof token.expires_in === "number" ? new Date(Date.now() + token.expires_in * 1000) : undefined,
      scopes: scopes.tiktok.split(","),
    });
    return;
  }
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
  if (typeof token.access_token !== "string") throw new Error("Google authorization returned no access token.");
  const channel = await providerJson("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  const item = Array.isArray(channel.items) ? channel.items[0] as Record<string, unknown> | undefined : undefined;
  const snippet = item?.snippet as Record<string, unknown> | undefined;
  if (typeof item?.id !== "string") throw new Error("No YouTube channel was found for this Google account.");
  await saveConnection({
    provider,
    accountId: item.id,
    accountName: typeof snippet?.title === "string" ? snippet.title : "YouTube channel",
    accessToken: token.access_token,
    refreshToken: typeof token.refresh_token === "string" ? token.refresh_token : undefined,
    expiresAt: typeof token.expires_in === "number" ? new Date(Date.now() + token.expires_in * 1000) : undefined,
    scopes: [scopes.youtube],
  });
}

export { createOAuthState, verifyOAuthState };
