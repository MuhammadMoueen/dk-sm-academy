
import { PortfolioEditor } from "@/components/admin/portfolio-editor";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function EditPortfolioReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <AdminPageHeader badge="Content management">
          <span className="text-white">Edit Client </span>
          <span className="text-[#ffd43b]">Review</span>
        </AdminPageHeader>
      </div>

      <PortfolioEditor reviewId={id} />
    </div>
  );
}
