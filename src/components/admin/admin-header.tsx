"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import type { AdminAccount } from "@/lib/auth";

export function AdminHeader({ account }: { account: AdminAccount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const profileControlRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!profileOpen) return;
    profileMenuRef.current
      ?.querySelector<HTMLElement>('[role="menuitem"]')
      ?.focus();
    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !profileControlRef.current?.contains(event.target) &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileControlRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

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
    <header className="sticky top-0 z-30 border-b border-[#ffd43b]/40 bg-[#090909]/90 px-4 py-3 shadow-[0_4px_24px_rgba(255,212,59,0.05)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-h-[52px] items-center justify-between gap-3">
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
              className="absolute left-0 top-[calc(100%+10px)] z-40 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-[#ffd43b]/35 bg-[#10100f]/95 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl"
            >
              <AdminNavigation onNavigate={() => setMenuOpen(false)} />
            </div>
          )}
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="mb-0 truncate text-lg font-bold text-white">
            Welcome back, <span className="text-[#ffd43b]">{account.displayName}</span>
          </p>
          <p className="mb-0 text-xs text-gray-400">
            Here’s what’s happening with your Academy today.
          </p>
        </div>
        <div className="relative ml-auto">
          <button
            ref={profileControlRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-controls="admin-profile-menu"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex min-h-11 max-w-[min(20rem,calc(100vw-6rem))] items-center gap-3 rounded-full text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
          >
            <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-[#ffd43b] bg-[#242015] font-bold text-[#ffd43b] shadow-[0_0_16px_rgba(255,212,59,0.24)]">
              {account.avatarUrl ? (
                <Image
                  src={account.avatarUrl}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              ) : (
                account.displayName.trim().charAt(0).toUpperCase()
              )}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-semibold text-white">
                {account.displayName}
              </span>
              <span className="block text-xs text-gray-400">Administrator</span>
            </span>
          </button>
          {profileOpen && (
            <div
              ref={profileMenuRef}
              id="admin-profile-menu"
              role="menu"
              aria-label="Administrator profile"
              onKeyDown={(event) => {
                const items = Array.from(
                  profileMenuRef.current?.querySelectorAll<HTMLElement>(
                    '[role="menuitem"]',
                  ) ?? [],
                );
                const currentIndex = items.indexOf(
                  document.activeElement as HTMLElement,
                );
                let nextIndex: number | undefined;
                if (event.key === "ArrowDown") {
                  nextIndex = (currentIndex + 1) % items.length;
                } else if (event.key === "ArrowUp") {
                  nextIndex = (currentIndex - 1 + items.length) % items.length;
                } else if (event.key === "Home") {
                  nextIndex = 0;
                } else if (event.key === "End") {
                  nextIndex = items.length - 1;
                }
                if (nextIndex !== undefined && items.length > 0) {
                  event.preventDefault();
                  items[nextIndex].focus();
                }
              }}
              className="absolute right-0 top-[calc(100%+12px)] z-40 w-56 rounded-xl border border-[#ffd43b]/35 bg-[#10100f]/95 p-2 shadow-[0_16px_50px_rgba(0,0,0,0.75)] backdrop-blur-xl"
            >
              <Link
                href="/admin/profile"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 hover:text-[#ffd43b] focus:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
              >
                My Profile
              </Link>
              <Link
                href="/admin/settings"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5 hover:text-[#ffd43b] focus:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
              >
                Settings
              </Link>
              <button
                type="button"
                role="menuitem"
                disabled={loggingOut}
                onClick={() => void logout()}
                className="block min-h-10 w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-white/5 hover:text-[#ffd43b] focus:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] disabled:cursor-wait disabled:opacity-60"
              >
                {loggingOut ? "Signing out…" : "Log out"}
              </button>
            </div>
          )}
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
