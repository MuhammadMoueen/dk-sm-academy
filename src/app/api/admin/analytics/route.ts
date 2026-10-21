import { NextResponse } from "next/server";
import { getVisitorGrowth, type AnalyticsPeriod } from "@/features/analytics/analytics";
import { requireApiAdmin, jsonError } from "@/lib/admin-api";

function integer(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const period = url.searchParams.get("period") as AnalyticsPeriod | null;
  const now = new Date();
  const year = integer(url.searchParams.get("year"), now.getUTCFullYear());
  const month = integer(url.searchParams.get("month"), now.getUTCMonth() + 1);
  if (
    (period !== "month" && period !== "year") ||
    year < 2000 ||
    year > 2100 ||
    month < 1 ||
    month > 12
  ) {
    return NextResponse.json({ error: "Invalid analytics range." }, { status: 400 });
  }

  try {
    return NextResponse.json({
      period,
      year,
      month,
      ...(await getVisitorGrowth({ period, year, month })),
    });
  } catch (error) {
    return jsonError(error, "Visitor analytics could not be loaded.");
  }
}
