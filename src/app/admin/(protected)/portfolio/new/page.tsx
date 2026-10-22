
import { PortfolioEditor } from "@/components/admin/portfolio-editor";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function NewPortfolioItemPage() {
  return (
    <div className="space-y-6">
      <div>
        <AdminPageHeader badge="Content management">
          <span className="text-white">Create Client </span>
          <span className="text-[#ffd43b]">Review</span>
        </AdminPageHeader>
      </div>

      <PortfolioEditor />
    </div>
  );
}
