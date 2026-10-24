import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  completeOAuth,
  verifyOAuthState,
} from "@/features/social-analytics/oauth";
import {
  SOCIAL_PROVIDERS,
  type SocialProvider,
} from "@/features/social-analytics/social-analytics";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  const url = new URL(request.url);
  const providerParam = (await context.params).provider;

  if (
    !SOCIAL_PROVIDERS.includes(providerParam as SocialProvider)
  ) {
    return NextResponse.redirect(
      new URL("/admin/dashboard?social=invalid_provider", url.origin),
    );
  }

  const provider = providerParam as SocialProvider;
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code") ?? "";
  const state = url.searchParams.get("state") ?? "";

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/admin/dashboard?social=authorization_denied", url.origin),
    );
  }

  const cookieStore = await cookies();
  const stateCookieName = `social_oauth_state_${provider}`;
  const storedState = cookieStore.get(stateCookieName)?.value;
  const codeVerifier = cookieStore.get("social_oauth_tiktok_verifier")?.value;

  if (
    !storedState ||
    !state ||
    storedState !== state ||
    !verifyOAuthState(state, provider)
  ) {
    return NextResponse.redirect(
      new URL("/admin/dashboard?social=invalid_state", url.origin),
    );
  }

  // Require the existing admin session before saving provider credentials.
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(
      new URL("/admin/login?social=unauthorized", url.origin),
    );
  }

  try {
    await completeOAuth(provider, code, provider === "tiktok" ? codeVerifier : undefined);
    cookieStore.delete(stateCookieName);
    if (provider === "tiktok") cookieStore.delete("social_oauth_tiktok_verifier");

    return NextResponse.redirect(
      new URL("/admin/dashboard?social=connected", url.origin),
    );
  } catch (error) {
    // Keep sensitive OAuth credentials and provider error details out of URLs.
    console.error("[social-oauth] Connection failed", {
      provider,
      errorType:
        error instanceof Error ? error.name : "UnknownError",
    });

    return NextResponse.redirect(
      new URL("/admin/dashboard?social=connection_failed", url.origin),
    );
  }
}
