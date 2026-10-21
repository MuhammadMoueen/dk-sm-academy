"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ContentStatus } from "@/types/common";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  hashtags: string[];
  status: ContentStatus;
  updatedAt: string;
};

type PortfolioRow = {
  id: string;
  clientName: string;
  clientImage: string;
  transactionImage: string;
  rating: number;
  isVerified: boolean;
  status: ContentStatus;
  updatedAt: string;
};

type ListRow = ArticleRow | PortfolioRow;

async function fetchContent(
  endpoint: string,
  query: string,
  page: number,
  status: "all" | ContentStatus,
) {
  const params = new URLSearchParams({ q: query, page: String(page) });
  if (status !== "all") params.set("status", status);
  const response = await fetch(`${endpoint}?${params}`, { cache: "no-store" });
  const result = (await response.json()) as {
    articles?: ArticleRow[];
    reviews?: PortfolioRow[];
    total?: number;
    error?: string;
  };
  if (!response.ok) throw new Error(result.error ?? "Content could not be loaded.");
  return {
    items: (result.articles ?? result.reviews ?? []) as ListRow[],
    total: result.total ?? 0,
  };
}

function isArticle(item: ListRow): item is ArticleRow {
  return "title" in item;
}

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        status === "published"
          ? "border-green-400/30 bg-green-400/10 text-green-300"
          : "border-amber-300/30 bg-amber-300/10 text-amber-200"
      }`}
    >
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

export function AdminContentList({
  kind,
}: {
  kind: "articles" | "portfolio";
}) {
  const [items, setItems] = useState<ListRow[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ContentStatus>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");
  const endpoint = kind === "articles" ? "/api/admin/articles" : "/api/admin/portfolio";
  const singular = kind === "articles" ? "article" : "review";

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchContent(endpoint, query, page, status);
      setItems(result.items);
      setTotal(result.total);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Content could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, query, status]);

  useEffect(() => {
    let active = true;
    void fetchContent(endpoint, query, page, status)
      .then((result) => {
        if (!active) return;
        setItems(result.items);
        setTotal(result.total);
        setError("");
      })
      .catch((caught: unknown) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : "Content could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [endpoint, page, query, status]);

  async function updateStatus(item: ListRow) {
    const nextStatus = item.status === "published" ? "draft" : "published";
    setWorkingId(item.id);
    setError("");
    try {
      const response = await fetch(`${endpoint}/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Status could not be changed.");
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Status could not be changed.");
    } finally {
      setWorkingId("");
    }
  }

  async function remove(item: ListRow) {
    const name = isArticle(item) ? item.title : item.clientName;
    if (!window.confirm(`Delete ${singular} “${name}”? This cannot be undone.`)) return;
    setWorkingId(item.id);
    setError("");
    try {
      const response = await fetch(`${endpoint}/${item.id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Content could not be deleted.");
      await refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Content could not be deleted.");
    } finally {
      setWorkingId("");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border border-[#ffd43b]/15 bg-[#111] p-4 sm:flex-row">
        <form
          className="flex min-w-0 flex-1 gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setQuery(search.trim());
          }}
        >
          <label htmlFor={`${kind}-search`} className="sr-only">
            Search {kind === "articles" ? "article title" : "client name"}
          </label>
          <input
            id={`${kind}-search`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={kind === "articles" ? "Search article title" : "Search client name"}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-[#090909] px-3 text-sm text-white outline-none focus:border-[#ffd43b]"
          />
          <button type="submit" className="min-h-11 rounded-lg border border-[#ffd43b]/40 px-4 text-sm font-semibold text-[#ffd43b] hover:bg-[#ffd43b]/5">
            Search
          </button>
        </form>
        <label className="flex min-h-11 items-center gap-2 text-sm text-gray-300">
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "all" | ContentStatus);
              setPage(1);
            }}
            className="min-h-11 rounded-lg border border-white/15 bg-[#090909] px-3 text-white outline-none focus:border-[#ffd43b]"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status" className="py-8 text-center text-sm text-gray-400">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#ffd43b]/25 bg-[#111] px-5 py-12 text-center">
          <h2 className="mb-2 text-lg font-bold">No {kind} found</h2>
          <p className="mb-0 text-sm text-gray-400">
            {query || status !== "all" ? "Adjust the search or status filter." : `Create your first ${singular} to get started.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const article = isArticle(item);
            const name = article ? item.title : item.clientName;
            const editHref = `/admin/${kind}/${item.id}/edit`;
            const previewHref = article
              ? `/admin/articles/${item.id}/preview`
              : `/admin/portfolio/${item.id}/preview`;
            const image = article ? item.thumbnailUrl : item.transactionImage;
            return (
              <article key={item.id} className="flex min-w-0 flex-col gap-4 rounded-xl border border-white/10 bg-[#111] p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#080808] sm:w-36">
                  {image ? (
                    <Image src={image} alt="" fill sizes="144px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-500">
                      Upload unavailable
                    </span>
                  )}
                </div>
                {!article && item.clientImage && (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#ffd43b]/25 bg-[#080808]">
                    <Image src={item.clientImage} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="mb-0 break-words text-base font-bold text-white">{name}</h2>
                    <StatusBadge status={item.status} />
                    {!article && item.isVerified && (
                      <span className="text-xs font-semibold text-[#ffd43b]">✓ Verified</span>
                    )}
                  </div>
                  <p className="mb-1 break-all text-xs text-gray-500">
                    {article ? `/${item.slug}` : `${item.rating.toFixed(1)} / 5 rating`}
                  </p>
                  {article && item.hashtags.length > 0 && (
                    <div className="mb-1 flex flex-wrap gap-2">
                      {item.hashtags.map((tag) => (
                        <span key={tag} className="text-xs font-semibold text-[#ffd43b]">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="mb-0 text-xs text-gray-500">
                    Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(item.updatedAt))}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Link href={editHref} className="min-h-10 rounded-lg border border-white/15 px-3 py-2 text-sm text-gray-200 hover:border-[#ffd43b]/50">Edit</Link>
                  <Link href={previewHref} className="min-h-10 rounded-lg border border-white/15 px-3 py-2 text-sm text-gray-200 hover:border-[#ffd43b]/50">Preview</Link>
                  <button
                    type="button"
                    disabled={workingId === item.id}
                    onClick={() => void updateStatus(item)}
                    className="min-h-10 rounded-lg border border-[#ffd43b]/35 px-3 py-2 text-sm font-semibold text-[#ffd43b] disabled:opacity-50"
                  >
                    {workingId === item.id ? "Saving…" : item.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    disabled={workingId === item.id}
                    onClick={() => void remove(item)}
                    className="min-h-10 rounded-lg border border-red-400/25 px-3 py-2 text-sm text-red-300 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {total > 25 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((value) => value - 1)}
            className="min-h-10 rounded-lg border border-white/15 px-4 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page} of {Math.ceil(total / 25)}</span>
          <button
            type="button"
            disabled={page >= Math.ceil(total / 25) || loading}
            onClick={() => setPage((value) => value + 1)}
            className="min-h-10 rounded-lg border border-white/15 px-4 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
