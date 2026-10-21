import "server-only";

import { getDb } from "@/lib/db";

export type AnalyticsPeriod = "month" | "year";

export type VisitorPoint = {
  label: string;
  date: string;
  visits: number;
};

export async function recordVisitorVisit(visitDate: string) {
  await getDb().query(
    `INSERT INTO visitor_daily_counts (visit_date, visit_count)
     VALUES ($1::date, 1)
     ON CONFLICT (visit_date) DO UPDATE
       SET visit_count = visitor_daily_counts.visit_count + 1,
           updated_at = NOW()`,
    [visitDate],
  );
}

export async function getVisitorGrowth({
  period,
  year,
  month,
}: {
  period: AnalyticsPeriod;
  year: number;
  month: number;
}): Promise<{ points: VisitorPoint[]; total: number }> {
  const db = getDb();

  if (period === "year") {
    const { rows } = await db.query<{
      month: string;
      visits: string;
    }>(
      `SELECT TO_CHAR(visit_date, 'YYYY-MM') AS month,
              SUM(visit_count)::text AS visits
       FROM visitor_daily_counts
       WHERE visit_date >= make_date($1, 1, 1)
         AND visit_date < make_date($1 + 1, 1, 1)
       GROUP BY month
       ORDER BY month`,
      [year],
    );
    const values = new Map(rows.map((row) => [row.month, Number(row.visits)]));
    const points = Array.from({ length: 12 }, (_, index) => {
      const date = `${year}-${String(index + 1).padStart(2, "0")}`;
      return {
        date,
        label: new Intl.DateTimeFormat("en", { month: "short" }).format(
          new Date(Date.UTC(year, index, 1)),
        ),
        visits: values.get(date) ?? 0,
      };
    });
    return { points, total: points.reduce((sum, point) => sum + point.visits, 0) };
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const { rows } = await db.query<{
    date: string;
    visits: string;
  }>(
    `SELECT visit_date::text AS date, visit_count::text AS visits
     FROM visitor_daily_counts
     WHERE visit_date >= make_date($1, $2, 1)
       AND visit_date < make_date($1, $2, 1) + INTERVAL '1 month'
     ORDER BY visit_date`,
    [year, month],
  );
  const values = new Map(rows.map((row) => [row.date, Number(row.visits)]));
  const points = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return { date, label: String(day), visits: values.get(date) ?? 0 };
  });
  return { points, total: points.reduce((sum, point) => sum + point.visits, 0) };
}
