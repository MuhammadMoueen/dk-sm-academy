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
  const providerParam = (await context.params).provider;
  if (providerParam !== "youtube") {
    return NextResponse.json({ error: "This provider is not available." }, { status: 404 });
  }
  const provider: SocialProvider = "youtube";
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
  return NextResponse.redirect(authorization);
}
