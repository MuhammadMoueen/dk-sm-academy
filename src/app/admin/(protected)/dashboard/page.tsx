import Link from "next/link";
import { connection } from "next/server";
import { getArticleCounts } from "@/features/articles/articles";
import { getPortfolioCounts } from "@/features/portfolio/portfolio-data";
import { getDb } from "@/lib/db";
import { UserGrowthChart } from "@/components/admin/user-growth-chart";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SocialAnalyticsCards } from "@/components/admin/social-analytics-cards";

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: "articles" | "published" | "draft" | "portfolio";
}) {
  const icons = {
    articles: (
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h7M9 17h7" />
      </>
    ),
    published: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    draft: (
      <>
        <path d="M5 3h14v14H9l-4 4z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ),
    portfolio: (
      <>
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
      </>
    ),
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#ffd43b]/55 bg-[linear-gradient(140deg,rgba(24,22,15,0.96),rgba(10,10,10,0.95)_60%)] p-4 shadow-[0_0_18px_rgba(255,212,59,0.07)] transition duration-300 hover:border-[#ffd43b] hover:shadow-[0_0_24px_rgba(255,212,59,0.17)] sm:p-5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#ffd43b]/25 bg-[#ffd43b]/10 text-[#ffd43b]">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            {icons[icon]}
          </svg>
        </span>
        <span aria-hidden="true" className="text-gray-400">···</span>
      </div>
      <p className="mb-1 text-sm font-medium text-gray-400">{label}</p>
      <p className="mb-0 text-3xl font-extrabold tracking-tight text-white">{value}</p>
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
    <div className="space-y-6 sm:space-y-7">
      <AdminPageHeader
        badge="Dashboard overview"
        actions={
          <>
            <Link href="/admin/articles/new" className="btn-primary min-h-11 !rounded-lg">
              <span aria-hidden="true" className="mr-2 text-lg">+</span>
              Create Article
            </Link>
            <Link
              href="/admin/portfolio/new"
              className="btn-secondary min-h-11 !rounded-lg border-[#ffd43b]/60 !text-[#ffd43b]"
            >
              <span aria-hidden="true" className="mr-2 text-lg">+</span>
              Add Portfolio Review
            </Link>
          </>
        }
      >
        Dashboard <span className="text-[#ffd43b]">Overview</span>
      </AdminPageHeader>

      <section aria-label="Content statistics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon="articles" label="Total Articles" value={articles.total} />
        <SummaryCard icon="published" label="Published Articles" value={articles.published} />
        <SummaryCard icon="draft" label="Draft Articles" value={articles.draft} />
        <SummaryCard icon="portfolio" label="Portfolio Reviews" value={portfolio.total} />
      </section>

      <SocialAnalyticsCards />

      <section
        aria-labelledby="user-growth-heading"
        className="overflow-hidden rounded-xl border border-[#ffd43b]/45 bg-[linear-gradient(145deg,rgba(16,16,15,0.97),rgba(8,8,8,0.96))] shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      >
        <div className="border-b border-white/5 p-4 sm:p-6">
          <div>
            <h2 id="user-growth-heading" className="mb-1 text-xl font-bold sm:text-2xl">
              User Growth
            </h2>
            <p className="mb-0 text-sm text-gray-400">
              Monthly and yearly overview of Academy visitors
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <UserGrowthChart />
        </div>
      </section>

      <section
        aria-labelledby="activity-heading"
        className="rounded-xl border border-[#ffd43b]/20 bg-black/65 p-5 backdrop-blur sm:p-6"
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
