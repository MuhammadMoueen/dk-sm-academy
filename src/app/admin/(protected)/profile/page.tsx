import { AdminProfileForm } from "@/components/admin/admin-profile-form";
import { requireAdmin } from "@/lib/auth";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function AdminProfilePage() {
  const account = await requireAdmin();
  return (
    <div className="space-y-6">
      <AdminPageHeader badge="Account settings">
        <span className="text-white">My </span><span className="text-[#ffd43b]">Profile</span>
      </AdminPageHeader>
      <AdminProfileForm initialAccount={account} />
    </div>
  );
}
