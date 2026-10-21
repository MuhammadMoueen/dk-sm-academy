import Link from "next/link";
import { ArticleEditor } from "@/components/admin/article-editor";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/articles" className="mb-3 inline-block text-sm text-gray-400 hover:text-[#ffd43b]">← Articles</Link>
        <AdminPageHeader badge="Content management">
          <span className="text-white">Create </span><span className="text-[#ffd43b]">Article</span>
        </AdminPageHeader>
      </div>
      <ArticleEditor />
    </div>
  );
}
