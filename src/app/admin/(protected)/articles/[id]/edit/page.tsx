import Link from "next/link";
import { ArticleEditor } from "@/components/admin/article-editor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin/articles" className="mb-3 inline-block text-sm text-gray-400 hover:text-[#ffd43b]">← Articles</Link>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">Content management</p>
        <h1 className="mb-0 text-3xl font-extrabold">Edit article</h1>
      </header>
      <ArticleEditor articleId={id} />
    </div>
  );
}
