import Link from "next/link";
import { AdminContentList } from "@/components/admin/admin-content-list";

export default function AdminPortfolioPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">Content management</p>
          <h1 className="mb-0 text-3xl font-extrabold">Portfolio / Client Reviews</h1>
        </div>
        <Link href="/admin/portfolio/new" className="btn-primary min-h-11 w-fit">
          Add Review
        </Link>
      </header>
      <AdminContentList kind="portfolio" />
    </div>
  );
}
