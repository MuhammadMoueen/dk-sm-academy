import Link from "next/link";
import { PortfolioEditor } from "@/components/admin/portfolio-editor";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function NewPortfolioItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/portfolio" className="mb-3 inline-block text-sm text-gray-400 hover:text-[#ffd43b]">← Portfolio / Reviews</Link>
        <AdminPageHeader badge="Content management">
          <span className="text-white">Create Client </span><span className="text-[#ffd43b]">Review</span>
        </AdminPageHeader>
      </div>
      <PortfolioEditor />
    </div>
  );
}
