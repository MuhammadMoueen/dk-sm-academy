import Link from "next/link";
import Image from "next/image";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import type { AdminAccount } from "@/lib/auth";

export function AdminSidebar({ account }: { account: AdminAccount }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-[#ffd43b]/35 bg-black/65 px-3 py-6 shadow-[4px_0_24px_rgba(255,212,59,0.06)] backdrop-blur lg:flex">
      <Link href="/admin/dashboard" className="mb-10 inline-flex flex-col px-3">
        <span className="font-serif text-2xl font-bold text-white">
          DK <span className="text-[#ffd43b]">&amp;</span> SM
        </span>
        <span className="text-[9px] font-bold tracking-[0.38em] text-[#ffd43b]">
          ACADEMY ADMIN
        </span>
      </Link>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <AdminNavigation />
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-white/10 px-3 pt-4">
        <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[#ffd43b]/70 bg-[#242015] text-sm font-bold text-[#ffd43b]">
          {account.avatarUrl ? (
            <Image src={account.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
          ) : (
            account.displayName.trim().charAt(0).toUpperCase()
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-white">{account.displayName}</span>
        </span>
      </div>
    </aside>
  );
}
