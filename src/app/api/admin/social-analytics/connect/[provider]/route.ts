import { NextResponse } from "next/server";
import { requireApiAdmin } from "@/lib/admin-api";
import { configuredProvider, SOCIAL_PROVIDERS, type SocialProvider } from "@/features/social-analytics/social-analytics";
import { createOAuthState, oauthUrl } from "@/features/social-analytics/oauth";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const provider = (await context.params).provider as SocialProvider;
  if (!SOCIAL_PROVIDERS.includes(provider) || !configuredProvider(provider)) {
    return NextResponse.json({ error: "This provider is not configured." }, { status: 400 });
  }
  const state = createOAuthState(provider);
  (await cookies()).set(`social_oauth_state_${provider}`, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });
  const authorization = oauthUrl(provider, state);
  if (typeof authorization === "string") {
    return NextResponse.redirect(authorization);
  }
  (await cookies()).set("social_oauth_tiktok_verifier", authorization.codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });
  return NextResponse.redirect(authorization.url);
}
