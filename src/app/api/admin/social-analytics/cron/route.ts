import { NextResponse } from "next/server";
import { SOCIAL_PROVIDERS } from "@/features/social-analytics/social-analytics";
import { refreshProvider } from "@/features/social-analytics/providers";

export async function POST(request: Request) {
  const expected = process.env.SOCIAL_ANALYTICS_CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied || supplied !== expected) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const results = [];
  for (const provider of SOCIAL_PROVIDERS) {
    try {
      await refreshProvider(provider);
      results.push({ provider, ok: true });
    } catch {
      results.push({ provider, ok: false });
    }
  }
  return NextResponse.json({ results });
}
