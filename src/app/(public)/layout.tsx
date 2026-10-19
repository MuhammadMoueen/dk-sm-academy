
import { Suspense } from "react";
import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Suspense fallback={<div aria-hidden="true" className="h-[73px] bg-black" />}>
        <PublicHeader />
      </Suspense>
      <main className="min-w-0 flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}
