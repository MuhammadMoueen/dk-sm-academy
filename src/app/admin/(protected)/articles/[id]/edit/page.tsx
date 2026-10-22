import { ArticleEditor } from "@/components/admin/article-editor";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <AdminPageHeader badge="Content management">
        <span className="text-white">Edit </span><span className="text-[#ffd43b]">Article</span>
      </AdminPageHeader>
      <ArticleEditor articleId={id} />
    </div>
  );
}
