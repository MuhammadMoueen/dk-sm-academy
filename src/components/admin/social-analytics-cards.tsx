"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const youtubeChannelUrl = siteConfig.communityPlatforms.find((platform) => platform.name === "YouTube")?.href;
const whatsappChannelUrl = siteConfig.communityPlatforms.find((platform) => platform.name === "WhatsApp")?.href;

type Metric = {
  provider: "youtube";
  accountName: string;
  count: number;
  observedAt: string;
  previousCount?: number;
  status: "connected" | "expired" | "error" | "revoked";
  configured: boolean;
};

function growth(metric: Metric) {
  if (metric.previousCount === undefined) return null;
  const difference = metric.count - metric.previousCount;
  const percentage = metric.previousCount
    ? (difference / metric.previousCount) * 100
    : null;
  return { difference, percentage };
}

function YouTubeIcon() {
  return (
    <path
      d="M21.6 7.1a2.8 2.8 0 0 0-1.97-1.98C17.9 4.65 12 4.65 12 4.65s-5.9 0-7.63.47A2.8 2.8 0 0 0 2.4 7.1C1.93 8.83 1.93 12 1.93 12s0 3.17.47 4.9a2.8 2.8 0 0 0 1.97 1.98c1.73.47 7.63.47 7.63.47s5.9 0 7.63-.47a2.8 2.8 0 0 0 1.97-1.98c.47-1.73.47-4.9.47-4.9s0-3.17-.47-4.9ZM10 15.5v-7l6 3.5-6 3.5Z"
      fill="currentColor"
      stroke="none"
    />
  );
}

function WhatsAppIcon() {
  return (
    <path
      d="M12 3.5a8.5 8.5 0 0 0-7.3 12.86L3.5 20.5l4.3-1.12A8.5 8.5 0 1 0 12 3.5Zm4.7 11.97c-.2.56-1.16 1.08-1.6 1.12-.42.04-.96.2-3.23-.67-2.7-1.04-4.43-3.8-4.56-3.98-.13-.18-1.1-1.46-1.1-2.78s.7-1.97.95-2.24c.25-.27.54-.34.72-.34h.52c.16 0 .38-.06.6.45l.8 1.94c.07.16.11.3.02.48l-.34.55-.5.57c-.16.16-.33.34-.14.66.2.33.87 1.43 1.87 2.32 1.3 1.16 2.4 1.52 2.74 1.69.34.17.54.15.74-.09.2-.24.85-.99 1.08-1.33.23-.34.45-.28.76-.17l1.8.85c.31.15.52.22.6.34.08.12.08.65-.12 1.2Z"
      fill="currentColor"
      stroke="none"
    />
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-xl border border-[#ffd43b]/55 bg-[linear-gradient(140deg,rgba(24,22,15,0.96),rgba(10,10,10,0.95)_60%)] p-5 shadow-[0_0_18px_rgba(255,212,59,0.07)] transition duration-300 hover:border-[#ffd43b] hover:shadow-[0_0_24px_rgba(255,212,59,0.17)] sm:p-7">
      {children}
    </article>
  );
}

export function SocialAnalyticsCards() {
  const [metric, setMetric] = useState<Metric | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/social-analytics", { cache: "no-store" });
      const body = await response.json() as { metrics?: Metric[]; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Social analytics could not be loaded.");
      setMetric(body.metrics?.find((item) => item.provider === "youtube") ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Social analytics could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => void load());
  }, []);

  async function refresh() {
    setRefreshing(true);
    setError("");
    try {
      const response = await fetch("/api/admin/social-analytics?provider=youtube", { method: "POST" });
      const body = await response.json() as { metrics?: Metric[]; error?: string };
      if (!response.ok) throw new Error(body.error ?? "YouTube refresh failed.");
      setMetric(body.metrics?.find((item) => item.provider === "youtube") ?? null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "YouTube refresh failed.");
    } finally {
      setRefreshing(false);
    }
  }

  const connected = metric?.status === "connected" && metric.configured;
  const change = metric ? growth(metric) : null;

  return (
    <section aria-labelledby="social-analytics-heading" className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 id="social-analytics-heading" className="mb-0 text-3xl font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl">
            <span className="text-white">Social </span>
            <span className="text-[#ffd43b]">Audience</span>
          </h2>
          <p className="mb-0 mt-2 text-sm leading-relaxed text-gray-400">
            Official audience counts and channel information.
          </p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="btn-secondary min-h-10 !rounded-lg border-[#ffd43b]/50 !text-[#ffd43b] disabled:opacity-50">
          {loading ? "Loading…" : "Refresh all"}
        </button>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <CardShell>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-[#ffd43b]/25 bg-[#ffd43b]/10 text-[#ffd43b]">
                <svg aria-label="YouTube icon" role="img" viewBox="0 0 24 24" className="h-6 w-6">{YouTubeIcon()}</svg>
              </span>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-400">YouTube</p>
                <h3 className="mb-0 text-xl font-bold text-white">Subscribers</h3>
              </div>
            </div>
            <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${connected ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/15 bg-white/5 text-gray-400"}`}>
              {connected ? "Connected" : metric?.status === "expired" ? "Reconnect required" : "Not connected"}
            </span>
          </div>
          <p className="mb-1 mt-8 text-4xl font-extrabold tracking-tight text-white">
            {loading ? "—" : connected && metric?.observedAt ? metric.count.toLocaleString() : "No data yet"}
          </p>
          {change && <p className={`mb-3 text-sm ${change.difference >= 0 ? "text-emerald-300" : "text-red-300"}`}>{change.difference >= 0 ? "+" : ""}{change.difference.toLocaleString()} subscribers since previous snapshot{change.percentage !== null ? ` (${change.percentage.toFixed(1)}%)` : ""}</p>}
          <p className="mb-5 min-h-5 text-xs text-gray-500">{metric?.observedAt ? `Updated ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(metric.observedAt))}` : "No successful update yet"}</p>
          <div className="flex flex-wrap gap-2">
            {connected ? (
              <button type="button" onClick={() => void refresh()} disabled={refreshing} className="btn-secondary min-h-10 !rounded-lg px-4 py-2 text-xs !text-[#ffd43b] disabled:opacity-50">
                {refreshing ? "Refreshing…" : "Refresh YouTube"}
              </button>
            ) : metric?.configured ? (
              <Link href="/api/admin/social-analytics/connect/youtube" className="btn-secondary inline-flex min-h-10 items-center !rounded-lg px-4 py-2 text-xs !text-[#ffd43b]">{metric.status === "expired" ? "Reconnect YouTube" : "Connect YouTube"}</Link>
            ) : <p className="mb-0 text-xs text-gray-500">Add the Google server environment variables to enable YouTube.</p>}
            {youtubeChannelUrl && <a href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex min-h-10 items-center !rounded-lg px-4 py-2 text-xs !text-[#ffd43b]">Open YouTube Channel</a>}
          </div>
        </CardShell>

        <CardShell>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-[#ffd43b]/25 bg-[#ffd43b]/10 text-[#ffd43b]">
                <svg aria-label="WhatsApp icon" role="img" viewBox="0 0 24 24" className="h-6 w-6">{WhatsAppIcon()}</svg>
              </span>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-400">WhatsApp Channel</p>
                <h3 className="mb-0 text-xl font-bold text-white">Channel information</h3>
              </div>
            </div>
          </div>
          {whatsappChannelUrl && <a href={whatsappChannelUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-8 inline-flex min-h-10 items-center !rounded-lg px-4 py-2 text-xs !text-[#ffd43b]">
            Open WhatsApp Channel
          </a>}
        </CardShell>
      </div>
    </section>
  );
}
