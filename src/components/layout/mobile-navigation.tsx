
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-panel"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-2xl text-white transition hover:border-[#ffd43b] hover:text-[#ffd43b]"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation-panel"
          className="absolute right-0 top-[calc(100%+14px)] max-h-[calc(100dvh-100px)] w-[min(88vw,340px)] overflow-y-auto rounded-xl border border-[#ffd43b]/25 bg-[#0d0d0d] p-3 shadow-2xl shadow-black/60"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {siteConfig.navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#ffd43b] text-black"
                      : "text-gray-200 hover:bg-white/5 hover:text-[#ffd43b]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href={siteConfig.communityUrl}
              onClick={() => setIsOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Join Community <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
