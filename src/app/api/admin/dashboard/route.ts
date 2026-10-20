import { NextResponse } from "next/server";
import { requireApiAdmin, jsonError } from "@/lib/admin-api";
import { getArticleCounts } from "@/features/articles/articles";
import { getPortfolioCounts } from "@/features/portfolio/portfolio-data";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const [articles, portfolio, activity] = await Promise.all([
      getArticleCounts(),
      getPortfolioCounts(),
      getDb().query<{
        id: string;
        entity_type: "article" | "portfolio";
        entity_id: string;
        action: string;
        summary: string;
        created_at: Date;
      }>(
        `SELECT id, entity_type, entity_id, action, summary, created_at
         FROM admin_activity ORDER BY created_at DESC LIMIT 8`,
      ),
    ]);
    return NextResponse.json({
      articles,
      portfolio,
      activity: activity.rows.map((item) => ({
        ...item,
        createdAt: item.created_at.toISOString(),
      })),
    });
  } catch (error) {
    return jsonError(error, "Dashboard data could not be loaded.");
  }
}
