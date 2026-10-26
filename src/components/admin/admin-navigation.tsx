"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Overview", href: "/admin/dashboard", icon: "grid" },
  { label: "Articles", href: "/admin/articles", icon: "article" },
  { label: "Portfolio / Reviews", href: "/admin/portfolio", icon: "portfolio" },
  { label: "My Profile", href: "/admin/profile", icon: "profile" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

function NavigationIcon({ name }: { name: string }) {
  const paths = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    article: <><path d="M6 4h9l3 3v13H6z" /><path d="M14 4v4h4M9 12h6M9 16h6" /></>,
    portfolio: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M9 6V4h6v2M4 11h16M10 11v2h4v-2" /></>,
    profile: <><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    settings: <><path d="m12 3 1.2 1.9 2.2.5.5 2.2L17.8 9l-1.9 1.2.5 2.2-2.2.5L12 15l-1.9-1.2-2.2.5.5-2.2L6.2 9l1.9-1.2-.5-2.2 2.2-.5z" /><circle cx="12" cy="9" r="2" /><path d="M12 15v6M7 18h10" /></>,
  } as const;

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0">
      {paths[name as keyof typeof paths]}
    </svg>
  );
}

export function AdminNavigation({
  onNavigate,
  showIcons = false,
}: {
  onNavigate?: () => void;
  showIcons?: boolean;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] ${
              active
                ? "border-[#ffd43b]/60 bg-[#ffd43b]/15 text-[#ffd43b] shadow-[0_0_18px_rgba(255,212,59,0.12)]"
                : "border-transparent text-gray-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
            }`}
          >
            {showIcons && <NavigationIcon name={item.icon} />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
