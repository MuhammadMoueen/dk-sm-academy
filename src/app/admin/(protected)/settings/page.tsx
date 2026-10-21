import { AdminPasswordForm } from "@/components/admin/admin-password-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader badge="Account settings" description="Manage administrator sign-in security.">
        <span className="text-white">Account </span><span className="text-[#ffd43b]">Settings</span>
      </AdminPageHeader>
      <AdminPasswordForm />
    </div>
  );
}
