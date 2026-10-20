"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import type { AdminAccount } from "@/lib/auth";

export function AdminHeader({ account }: { account: AdminAccount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  async function logout() {
    setLoggingOut(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", { method: "DELETE" });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Could not sign out.");
      }
      router.replace("/admin/login");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign out.");
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#ffd43b]/15 bg-[#090909]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div className="relative lg:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="min-h-11 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white hover:border-[#ffd43b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
          >
            {menuOpen ? "Close menu" : "Menu"}
          </button>
          {menuOpen && (
            <div
              id="admin-mobile-navigation"
              className="absolute left-0 top-[calc(100%+10px)] z-40 w-64 rounded-xl border border-[#ffd43b]/25 bg-[#111] p-3 shadow-xl"
            >
              <AdminNavigation onNavigate={() => setMenuOpen(false)} />
            </div>
          )}
        </div>
        <div className="hidden text-sm text-gray-400 sm:block">
          Signed in as{" "}
          <span className="font-semibold text-white">{account.displayName}</span>
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-3">
          <span className="max-w-[45vw] truncate text-sm font-medium text-white sm:max-w-none">
            {account.email}
          </span>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="min-h-11 shrink-0 rounded-lg border border-[#ffd43b]/35 px-3 text-sm font-semibold text-[#ffd43b] transition hover:border-[#ffd43b] hover:bg-[#ffd43b]/5 disabled:cursor-wait disabled:opacity-60"
          >
            {loggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mb-0 mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </header>
  );
}
