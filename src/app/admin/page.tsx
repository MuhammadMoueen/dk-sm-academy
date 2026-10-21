import { Suspense } from "react";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { BrandLoader } from "@/components/layout/brand-loader";
import { getAdminSession } from "@/lib/auth";

async function AdminEntry(): Promise<ReactNode> {
  await connection();
  redirect((await getAdminSession()) ? "/admin/dashboard" : "/admin/login");
}

export default function AdminPage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <AdminEntry />
    </Suspense>
  );
}
