import type { ReactNode } from "react";

export function AdminPageHeader({
  badge,
  children,
  description,
  actions,
}: {
  badge: string;
  children: ReactNode;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <span className="section-eyebrow mb-3">
          <span aria-hidden="true">✦</span>
          {badge}
        </span>
        <h1 className="mb-0 text-3xl font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl">
          {children}
        </h1>
        {description && <p className="mb-0 mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
