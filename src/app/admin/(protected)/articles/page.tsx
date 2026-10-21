import Link from "next/link";
import { AdminContentList } from "@/components/admin/admin-content-list";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminArticlesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader badge="Content management" actions={<Link href="/admin/articles/new" className="btn-primary min-h-11 w-fit">
          Add New Article
        </Link>}>
        <span className="text-white">Article</span><span className="text-[#ffd43b]">s</span>
      </AdminPageHeader>
      <AdminContentList kind="articles" />
    </div>
  );
}
