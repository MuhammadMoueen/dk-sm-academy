import Link from "next/link";
import { connection } from "next/server";
import { getArticleCounts } from "@/features/articles/articles";
import { getPortfolioCounts } from "@/features/portfolio/portfolio-data";
import { getDb } from "@/lib/db";

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#ffd43b]/15 bg-[#111] p-5">
      <p className="mb-2 text-sm text-gray-400">{label}</p>
      <p className="mb-0 text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  await connection();
  const [articles, portfolio, activity] = await Promise.all([
    getArticleCounts(),
    getPortfolioCounts(),
    getDb().query<{
      id: string;
      entity_type: string;
      action: string;
      summary: string;
      created_at: Date;
    }>(
      `SELECT id, entity_type, action, summary, created_at
       FROM admin_activity ORDER BY created_at DESC LIMIT 8`,
    ),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">
            Admin dashboard
          </p>
          <h1 className="mb-0 text-3xl font-extrabold">Overview</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/articles/new" className="btn-primary min-h-11">
            Create Article
          </Link>
          <Link
            href="/admin/portfolio/new"
            className="btn-secondary min-h-11 border-[#ffd43b]/40 !text-[#ffd43b]"
          >
            Add Portfolio Review
          </Link>
        </div>
      </header>

      <section aria-labelledby="article-summary-heading">
        <h2 id="article-summary-heading" className="mb-3 text-lg font-bold">
          Articles
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Total Articles" value={articles.total} />
          <SummaryCard label="Published Articles" value={articles.published} />
          <SummaryCard label="Draft Articles" value={articles.draft} />
        </div>
      </section>

      <section aria-labelledby="portfolio-summary-heading">
        <h2 id="portfolio-summary-heading" className="mb-3 text-lg font-bold">
          Portfolio / Client Reviews
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Total Reviews" value={portfolio.total} />
          <SummaryCard label="Published Reviews" value={portfolio.published} />
          <SummaryCard label="Unpublished Reviews" value={portfolio.draft} />
        </div>
      </section>

      <section
        aria-labelledby="activity-heading"
        className="rounded-xl border border-[#ffd43b]/15 bg-[#111] p-5 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="activity-heading" className="mb-0 text-lg font-bold">
            Recent activity
          </h2>
        </div>
        {activity.rows.length ? (
          <ul className="divide-y divide-white/5">
            {activity.rows.map((item) => (
              <li
                key={item.id}
                className="flex flex-col justify-between gap-1 py-3 text-sm sm:flex-row sm:items-center"
              >
                <span className="text-gray-200">{item.summary}</span>
                <time className="shrink-0 text-xs text-gray-500" dateTime={item.created_at.toISOString()}>
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(item.created_at)}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-0 text-sm text-gray-400">
            No content updates have been recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
