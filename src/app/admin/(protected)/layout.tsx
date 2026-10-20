import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { BrandLoader } from "@/components/layout/brand-loader";
import { requireAdmin } from "@/lib/auth";

async function ProtectedAdminContent({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();
  const account = await requireAdmin();
  if (!account) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#090909] text-white lg:flex">
      <AdminSidebar />
      <div className="min-h-screen min-w-0 flex-1">
        <AdminHeader account={account} />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ProtectedAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense fallback={<BrandLoader />}>
      <ProtectedAdminContent>{children}</ProtectedAdminContent>
    </Suspense>
  );
}
