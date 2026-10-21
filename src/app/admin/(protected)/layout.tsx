import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { BrandLoader } from "@/components/layout/brand-loader";
import { requireAdmin } from "@/lib/auth";
import Image from "next/image";

async function ProtectedAdminContent({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();
  const account = await requireAdmin();
  if (!account) redirect("/admin/login");

  return (
    <div className="admin-shell relative isolate min-h-screen text-white lg:flex">
      <Image
        src="/images/admin-dashboard-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none fixed -z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[rgba(5,5,5,0.84)]"
      />
      <AdminSidebar account={account} />
      <div className="min-h-screen min-w-0 flex-1 lg:ml-64">
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
