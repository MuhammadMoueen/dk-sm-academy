import Link from "next/link";
import { PortfolioEditor } from "@/components/admin/portfolio-editor";

export default async function EditPortfolioReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <header>
        <Link href="/admin/portfolio" className="mb-3 inline-block text-sm text-gray-400 hover:text-[#ffd43b]">← Portfolio / Reviews</Link>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">Content management</p>
        <h1 className="mb-0 text-3xl font-extrabold">Edit client review</h1>
      </header>
      <PortfolioEditor reviewId={id} />
    </div>
  );
}
