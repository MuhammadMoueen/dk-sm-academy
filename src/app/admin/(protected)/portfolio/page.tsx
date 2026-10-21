import Link from "next/link";
import { AdminContentList } from "@/components/admin/admin-content-list";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminPortfolioPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader badge="Content management" actions={<Link href="/admin/portfolio/new" className="btn-primary min-h-11 w-fit">
          Add Review
        </Link>}>
        <span className="text-white">Portfolio / Client </span><span className="text-[#ffd43b]">Reviews</span>
      </AdminPageHeader>
      <AdminContentList kind="portfolio" />
    </div>
  );
}
