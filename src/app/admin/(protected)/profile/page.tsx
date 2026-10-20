import { AdminProfileForm } from "@/components/admin/admin-profile-form";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProfilePage() {
  const account = await requireAdmin();
  return (
    <div className="space-y-6">
      <header>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">Account</p>
        <h1 className="mb-0 text-3xl font-extrabold">My Profile</h1>
      </header>
      <AdminProfileForm initialAccount={account} />
    </div>
  );
}
