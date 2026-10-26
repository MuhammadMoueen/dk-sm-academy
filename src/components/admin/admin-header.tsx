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
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const wasMenuOpenRef = useRef(false);
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

  useEffect(() => {
    if (menuOpen) {
      mobileMenuCloseRef.current?.focus();
    } else if (wasMenuOpenRef.current) {
      mobileMenuButtonRef.current?.focus();
    }
    wasMenuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

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
        <div className="lg:hidden">
          <button
            ref={mobileMenuButtonRef}
            type="button"
            aria-label={menuOpen ? "Close admin navigation" : "Open admin navigation"}
            aria-expanded={menuOpen}
            aria-controls="admin-mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-[#ffd43b]/40 bg-[#15130b] text-[#ffd43b] shadow-[0_0_16px_rgba(255,212,59,0.08)] transition hover:border-[#ffd43b] hover:bg-[#211d0d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090909]"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
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
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] lg:hidden"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMenuOpen(false);
          }}
        >
          <aside
            ref={mobileMenuRef}
            id="admin-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-mobile-navigation-title"
            className="h-full w-[min(20rem,88vw)] border-r border-[#ffd43b]/35 bg-[#0b0b0a] p-5 shadow-[12px_0_40px_rgba(0,0,0,0.65)]"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p id="admin-mobile-navigation-title" className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd43b]">
                  Admin navigation
                </p>
                <p className="mb-0 truncate text-lg font-bold text-white">{account.displayName}</p>
              </div>
              <button
                ref={mobileMenuCloseRef}
                type="button"
                aria-label="Close admin navigation"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/15 text-gray-300 transition hover:border-[#ffd43b] hover:text-[#ffd43b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <AdminNavigation showIcons onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}
      {error && (
        <p role="alert" className="mb-0 mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </header>
  );
}
