import Link from "next/link";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#ffd43b]/35 bg-black/65 px-3 py-6 shadow-[4px_0_24px_rgba(255,212,59,0.06)] backdrop-blur lg:block">
      <Link href="/admin/dashboard" className="mb-10 inline-flex flex-col px-3">
        <span className="font-serif text-2xl font-bold text-white">
          DK <span className="text-[#ffd43b]">&amp;</span> SM
        </span>
        <span className="text-[9px] font-bold tracking-[0.38em] text-[#ffd43b]">
          ACADEMY ADMIN
        </span>
      </Link>
      <AdminNavigation />
    </aside>
  );
}
