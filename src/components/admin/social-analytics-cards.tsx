"use client";

import { useEffect, useState } from "react";

type Provider = "facebook" | "tiktok" | "youtube" | "instagram";
type Metric = {
  provider: Provider;
  label: Provider;
  accountName: string;
  count: number;
  observedAt: string;
  previousCount?: number;
  status: "connected" | "expired" | "error" | "revoked";
  lastError?: string;
  configured: boolean;
};

const labels: Record<Provider, string> = {
  facebook: "Facebook Page Followers",
  tiktok: "TikTok Followers",
  youtube: "YouTube Subscribers",
  instagram: "Instagram Business Followers",
};

function statusText(metric: Metric) {
  if (!metric.configured) return "Setup required";
  if (metric.status === "revoked") return "Not connected";
  if (metric.status === "expired") return "Reconnect required";
  if (metric.status === "error") return "API error";
  return "Connected";
}

function growth(metric: Metric) {
  if (metric.previousCount === undefined) return null;
  const difference = metric.count - metric.previousCount;
  const percentage = metric.previousCount
    ? (difference / metric.previousCount) * 100
    : null;
  return { difference, percentage };
}

export function SocialAnalyticsCards() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/social-analytics", { cache: "no-store" });
      const body = (await response.json()) as { metrics?: Metric[]; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Social analytics could not be loaded.");
      setMetrics(body.metrics ?? []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Social analytics could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => void load());
  }, []);

  async function refresh(provider: Provider) {
    setActive(provider);
    setError("");
    try {
      const response = await fetch(`/api/admin/social-analytics?provider=${provider}`, {
        method: "POST",
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Provider refresh failed.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Provider refresh failed.");
    } finally {
      setActive(null);
    }
  }

  return (
    <section aria-labelledby="social-analytics-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="social-analytics-heading" className="mb-1 text-xl font-bold sm:text-2xl">
            Social audience
          </h2>
          <p className="mb-0 text-sm text-gray-400">
            Official follower and subscriber counts with daily history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="btn-secondary min-h-10 !rounded-lg border-[#ffd43b]/50 !text-[#ffd43b] disabled:opacity-50"
        >
          {loading ? "Loading…" : "Refresh all"}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(labels) as Provider[]).map((provider) => {
          const metric = metrics.find((item) => item.provider === provider);
          const change = metric ? growth(metric) : null;
          const isConnected = metric?.status === "connected" && metric.configured;
          const hasMetric = isConnected && Boolean(metric?.observedAt);
          return (
            <article key={provider} className="rounded-xl border border-[#ffd43b]/35 bg-[linear-gradient(140deg,rgba(24,22,15,0.96),rgba(10,10,10,0.95)_60%)] p-4 shadow-[0_0_18px_rgba(255,212,59,0.05)]">
              <div className="mb-4 flex items-start justify-between gap-2">
                <h3 className="mb-0 text-sm font-semibold text-gray-200">{labels[provider]}</h3>
                <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
                  isConnected
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    : "border-white/15 bg-white/5 text-gray-400"
                }`}>
                  {statusText(metric ?? {
                    provider, label: provider, accountName: "", count: 0,
                    observedAt: "", status: "revoked", configured: false,
                  })}
                </span>
              </div>
              <p className="mb-1 text-3xl font-extrabold tracking-tight text-white">
                {loading
                  ? "—"
                  : !isConnected
                    ? "Not connected"
                    : hasMetric
                      ? metric.count.toLocaleString()
                      : "No data yet"}
              </p>
              {change && (
                <p className={`mb-3 text-xs ${change.difference >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {change.difference >= 0 ? "+" : ""}{change.difference.toLocaleString()}
                  {change.percentage !== null ? ` (${change.percentage.toFixed(1)}%)` : ""}
                  {" "}since previous snapshot
                </p>
              )}
              <p className="mb-4 min-h-5 text-xs text-gray-500">
                {metric?.observedAt
                  ? `Updated ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(metric.observedAt))}`
                  : "No successful update yet"}
              </p>
              {metric?.configured ? (
                <div className="flex flex-wrap gap-2">
                  {!isConnected && (
                    <a href={`/api/admin/social-analytics/connect/${provider}`} className="btn-secondary min-h-9 !rounded-lg px-3 py-2 text-xs !text-[#ffd43b]">
                      {metric.status === "expired" ? "Reconnect" : "Connect"}
                    </a>
                  )}
                  {isConnected && (
                    <button type="button" onClick={() => void refresh(provider)} disabled={active === provider} className="btn-secondary min-h-9 !rounded-lg px-3 py-2 text-xs !text-[#ffd43b] disabled:opacity-50">
                      {active === provider ? "Refreshing…" : "Refresh"}
                    </button>
                  )}
                </div>
              ) : (
                <p className="mb-0 text-xs text-gray-500">Add server environment variables to enable connection.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
