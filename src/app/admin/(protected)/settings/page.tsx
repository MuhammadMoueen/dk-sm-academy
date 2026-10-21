import { AdminPasswordForm } from "@/components/admin/admin-password-form";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">
          Account
        </p>
        <h1 className="mb-0 text-3xl font-extrabold">Settings</h1>
        <p className="mb-0 mt-2 text-sm text-gray-400">
          Manage administrator sign-in security.
        </p>
      </header>
      <AdminPasswordForm />
    </div>
  );
}
