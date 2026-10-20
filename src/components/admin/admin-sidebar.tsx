import Link from "next/link";
import { AdminNavigation } from "@/components/admin/admin-navigation";

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#ffd43b]/15 bg-[#0b0b0b] px-4 py-6 lg:block">
      <Link href="/admin/dashboard" className="mb-9 inline-flex flex-col px-3">
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
