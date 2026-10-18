
import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <PublicHeader />
      <main className="min-w-0 flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}
