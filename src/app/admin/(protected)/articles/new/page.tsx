import { ArticleEditor } from "@/components/admin/article-editor";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader badge="Content management">
        <span className="text-white">Create </span><span className="text-[#ffd43b]">Article</span>
      </AdminPageHeader>
      <ArticleEditor />
    </div>
  );
}
