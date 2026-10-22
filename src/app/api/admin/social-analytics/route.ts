import { NextResponse } from "next/server";
import { getSocialMetrics, SOCIAL_PROVIDERS, configuredProvider, type SocialProvider } from "@/features/social-analytics/social-analytics";
import { refreshProvider } from "@/features/social-analytics/providers";
import { requireApiAdmin, jsonError } from "@/lib/admin-api";

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const metrics = await getSocialMetrics();
    return NextResponse.json({
      metrics: metrics.map((metric) => ({
        ...metric,
        label: metric.provider,
        configured: configuredProvider(metric.provider),
      })),
    });
  } catch (error) {
    return jsonError(error, "Social analytics could not be loaded.");
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const provider = new URL(request.url).searchParams.get("provider") as SocialProvider | null;
  if (!provider || !SOCIAL_PROVIDERS.includes(provider)) {
    return NextResponse.json({ error: "Invalid social provider." }, { status: 400 });
  }
  try {
    await refreshProvider(provider);
    return NextResponse.json({ metrics: await getSocialMetrics() });
  } catch (error) {
    return jsonError(error, "The provider could not be refreshed.");
  }
}
