import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { completeOAuth, verifyOAuthState } from "@/features/social-analytics/oauth";
import { SOCIAL_PROVIDERS, type SocialProvider } from "@/features/social-analytics/social-analytics";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ provider: string }> },
) {
  if (!(await getAdminSession())) {
    return NextResponse.redirect(new URL("/admin/login?social=unauthorized", request.url));
  }
  const provider = (await context.params).provider as SocialProvider;
  const url = new URL(request.url);
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  const storedState = (await cookies()).get(`social_oauth_state_${provider}`)?.value;
  if (!SOCIAL_PROVIDERS.includes(provider) || !storedState || storedState !== state || !verifyOAuthState(state, provider)) {
    return NextResponse.redirect(new URL("/admin/dashboard?social=invalid_state", request.url));
  }
  if (url.searchParams.get("error") || !code) {
    return NextResponse.redirect(new URL("/admin/dashboard?social=authorization_denied", request.url));
  }
  try {
    await completeOAuth(provider, code);
    (await cookies()).delete(`social_oauth_state_${provider}`);
    return NextResponse.redirect(new URL("/admin/dashboard?social=connected", request.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/dashboard?social=connection_failed", request.url));
  }
}
