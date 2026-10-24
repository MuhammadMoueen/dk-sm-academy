"use client";

import type { ReactNode } from "react";
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
type FacebookPage = { id: string; name: string };

const labels: Record<Provider, string> = {
  facebook: "Facebook Page Followers",
  tiktok: "TikTok Followers",
  youtube: "YouTube Subscribers",
  instagram: "Instagram Business Followers",
};

const icons: Record<Provider, ReactNode> = {
  facebook: (
    <path
      d="M14 8h2V5.5c-.35-.05-1.55-.15-2.85-.15-2.82 0-4.75 1.72-4.75 4.88V13H5.5v2.8h2.9V23h3.55v-7.2h2.95l.47-2.8h-3.42v-2.45c0-.81.22-1.35 1.55-1.35Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  tiktok: (
    <path
      d="M15.2 3h3.05c.2 1.62 1.1 2.85 2.75 3.7v3.05a8.7 8.7 0 0 1-2.7-.82v6.08A5.98 5.98 0 1 1 13 9.1v3.15a2.9 2.9 0 1 0 2.3 2.83V3h-.1Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  youtube: (
    <path
      d="M21.6 7.1a2.8 2.8 0 0 0-1.97-1.98C17.9 4.65 12 4.65 12 4.65s-5.9 0-7.63.47A2.8 2.8 0 0 0 2.4 7.1C1.93 8.83 1.93 12 1.93 12s0 3.17.47 4.9a2.8 2.8 0 0 0 1.97 1.98c1.73.47 7.63.47 7.63.47s5.9 0 7.63-.47a2.8 2.8 0 0 0 1.97-1.98c.47-1.73.47-4.9.47-4.9s0-3.17-.47-4.9ZM10 15.5v-7l6 3.5-6 3.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  ),
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
  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([]);
  const [selectedFacebookPage, setSelectedFacebookPage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/social-analytics", { cache: "no-store" });
      const body = (await response.json()) as { metrics?: Metric[]; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Social analytics could not be loaded.");
      setMetrics(body.metrics ?? []);
      const pagesResponse = await fetch("/api/admin/social-analytics/facebook", {
        cache: "no-store",
      });
      const pagesBody = (await pagesResponse.json()) as {
        pages?: FacebookPage[];
        error?: string;
      };
      if (!pagesResponse.ok) {
        throw new Error(pagesBody.error ?? "Facebook Pages could not be loaded.");
      }
      setFacebookPages(pagesBody.pages ?? []);
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

  async function selectFacebookPage() {
    if (!selectedFacebookPage) return;
    setActive("facebook");
    setError("");
    try {
      const response = await fetch("/api/admin/social-analytics/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: selectedFacebookPage }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Facebook Page could not be connected.");
      setFacebookPages([]);
      setSelectedFacebookPage("");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Facebook Page could not be connected.");
    } finally {
      setActive(null);
    }
  }

  async function disconnectFacebook() {
    setActive("facebook");
    setError("");
    try {
      const response = await fetch("/api/admin/social-analytics/facebook", {
        method: "DELETE",
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Facebook could not be disconnected.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Facebook could not be disconnected.");
    } finally {
      setActive(null);
    }
  }

  return (
    <section aria-labelledby="social-analytics-heading" className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2
            id="social-analytics-heading"
            className="mb-0 text-3xl font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl"
          >
            <span className="text-white">Social </span>
            <span className="text-[#ffd43b]">Audience</span>
          </h2>
          <p className="mb-0 mt-2 text-sm leading-relaxed text-gray-400">
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

      {facebookPages.length > 0 && (
        <div className="rounded-xl border border-[#ffd43b]/40 bg-black/30 p-4">
          <h3 className="mb-2 text-sm font-semibold text-white">Select a Facebook Page</h3>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedFacebookPage}
              onChange={(event) => setSelectedFacebookPage(event.target.value)}
              className="min-h-10 rounded-lg border border-white/20 bg-black px-3 text-sm text-white"
            >
              <option value="">Choose a Page</option>
              {facebookPages.map((page) => (
                <option key={page.id} value={page.id}>{page.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void selectFacebookPage()}
              disabled={!selectedFacebookPage || active === "facebook"}
              className="btn-secondary min-h-10 !rounded-lg px-3 py-2 text-xs !text-[#ffd43b] disabled:opacity-50"
            >
              {active === "facebook" ? "Connecting…" : "Use this Page"}
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(labels) as Provider[]).map((provider) => {
          const metric = metrics.find((item) => item.provider === provider);
          const change = metric ? growth(metric) : null;
          const isConnected = metric?.status === "connected" && metric.configured;
          const hasMetric = isConnected && Boolean(metric?.observedAt);
          return (
            <article
              key={provider}
              className="group relative overflow-hidden rounded-xl border border-[#ffd43b]/55 bg-[linear-gradient(140deg,rgba(24,22,15,0.96),rgba(10,10,10,0.95)_60%)] p-4 shadow-[0_0_18px_rgba(255,212,59,0.07)] transition duration-300 hover:border-[#ffd43b] hover:shadow-[0_0_24px_rgba(255,212,59,0.17)] sm:p-5"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#ffd43b]/25 bg-[#ffd43b]/10 text-[#ffd43b]">
                  <svg
                    aria-label={`${provider} icon`}
                    role="img"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                  >
                    {icons[provider]}
                  </svg>
                </span>
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
              <p className="mb-1 text-sm font-medium text-gray-400">{labels[provider]}</p>
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
                    <>
                      <button type="button" onClick={() => void refresh(provider)} disabled={active === provider} className="btn-secondary min-h-9 !rounded-lg px-3 py-2 text-xs !text-[#ffd43b] disabled:opacity-50">
                        {active === provider ? "Refreshing…" : "Refresh"}
                      </button>
                      {provider === "facebook" && (
                        <button type="button" onClick={() => void disconnectFacebook()} disabled={active === provider} className="btn-secondary min-h-9 !rounded-lg px-3 py-2 text-xs !text-red-300 disabled:opacity-50">
                          Disconnect
                        </button>
                      )}
                    </>
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
