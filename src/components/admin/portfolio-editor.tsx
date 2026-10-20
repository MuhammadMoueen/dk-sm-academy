"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import type { PortfolioItem } from "@/types/portfolio";

type PortfolioFormData = {
  clientName: string;
  clientImage: string;
  transactionImage: string;
  review: string;
  rating: number;
  isVerified: boolean;
  status: "draft" | "published";
};

const emptyForm: PortfolioFormData = {
  clientName: "",
  clientImage: "",
  transactionImage: "",
  review: "",
  rating: 5,
  isVerified: false,
  status: "draft",
};

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/15 bg-[#090909] px-3 text-white outline-none focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/15";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-200";

export function PortfolioEditor({ reviewId }: { reviewId?: string }) {
  const [form, setForm] = useState<PortfolioFormData>(emptyForm);
  const [loading, setLoading] = useState(Boolean(reviewId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const endpoint = reviewId
    ? `/api/admin/portfolio/${reviewId}`
    : "/api/admin/portfolio";

  useEffect(() => {
    if (!reviewId) return;
    let mounted = true;
    void (async () => {
      try {
        const response = await fetch(endpoint, { cache: "no-store" });
        const result = (await response.json()) as {
          review?: Record<string, unknown>;
          error?: string;
        };
        if (!response.ok || !result.review) {
          throw new Error(result.error ?? "Review could not be loaded.");
        }
        if (!mounted) return;
        const review = result.review;
        setForm({
          clientName: String(review.clientName ?? ""),
          clientImage: String(review.clientImage ?? ""),
          transactionImage: String(review.transactionImage ?? ""),
          review: String(review.review ?? ""),
          rating: Number(review.rating ?? 5),
          isVerified: review.isVerified === true,
          status: review.status === "published" ? "published" : "draft",
        });
      } catch (caught) {
        if (mounted) {
          setError(caught instanceof Error ? caught.message : "Review could not be loaded.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [endpoint, reviewId]);

  function change<K extends keyof PortfolioFormData>(
    key: K,
    value: PortfolioFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [String(key)]: "" }));
    setError("");
  }

  async function save(status: "draft" | "published") {
    if (!formRef.current?.reportValidity() || saving) return;
    if (status === "published" && (!form.clientImage || !form.transactionImage)) {
      setFieldErrors({
        clientImage: form.clientImage ? "" : "A client photo is required to publish.",
        transactionImage: form.transactionImage
          ? ""
          : "A transaction image is required to publish.",
      });
      setError("Add both image references before publishing this review.");
      return;
    }
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const response = await fetch(endpoint, {
        method: reviewId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });
      const result = (await response.json()) as {
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        setFieldErrors(result.fields ?? {});
        throw new Error(result.error ?? "Review could not be saved.");
      }
      router.push("/admin/portfolio");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Review could not be saved.");
      setSaving(false);
    }
  }

  if (loading) {
    return <p role="status" className="py-12 text-center text-gray-400">Loading review…</p>;
  }

  if (error && reviewId && !form.clientName) {
    return <p role="alert" className="rounded-lg border border-red-400/25 bg-red-500/10 p-4 text-red-200">{error}</p>;
  }

  const previewItem: PortfolioItem = {
    id: reviewId ?? "preview",
    ...form,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className={`grid min-w-0 gap-6 ${preview ? "xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)]" : ""}`}>
      <form ref={formRef} className="min-w-0 space-y-5" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void save(form.status); }}>
        <section className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-bold">Client review details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="client-name" className={labelClass}>Client name *</label>
              <input id="client-name" required maxLength={120} value={form.clientName} onChange={(event) => change("clientName", event.target.value)} className={inputClass} />
              {fieldErrors.clientName && <p className="mb-0 mt-1 text-sm text-red-300">{fieldErrors.clientName}</p>}
            </div>
            <div>
              <label htmlFor="review-text" className={labelClass}>Review *</label>
              <textarea id="review-text" required maxLength={3000} rows={5} value={form.review} onChange={(event) => change("review", event.target.value)} className={`${inputClass} py-2`} />
              {fieldErrors.review && <p className="mb-0 mt-1 text-sm text-red-300">{fieldErrors.review}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="review-rating" className={labelClass}>Rating *</label>
                <select id="review-rating" required value={form.rating} onChange={(event) => change("rating", Number(event.target.value))} className={inputClass}>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => <option key={rating} value={rating}>{rating.toFixed(1)} / 5</option>)}
                </select>
                {fieldErrors.rating && <p className="mb-0 mt-1 text-sm text-red-300">{fieldErrors.rating}</p>}
              </div>
              <label className="flex min-h-11 items-center gap-3 self-end rounded-lg border border-white/10 bg-[#090909] px-3 text-sm text-gray-200">
                <input type="checkbox" checked={form.isVerified} onChange={(event) => change("isVerified", event.target.checked)} className="h-4 w-4 accent-[#ffd43b]" />
                Verified client (optional)
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-2 text-lg font-bold">Images</h2>
          <p className="mb-4 text-sm text-amber-200">
            Image uploads are unavailable until a storage provider is configured. Use existing same-site image paths.
          </p>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="client-image-file" className={labelClass}>Upload client photo</label>
              <input id="client-image-file" type="file" accept="image/png,image/jpeg,image/webp" disabled className="block min-h-11 w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-gray-400 disabled:cursor-not-allowed" />
              <label htmlFor="client-image" className={`${labelClass} mt-3`}>Existing client photo path *</label>
              <input id="client-image" placeholder="/images/client.png" value={form.clientImage} onChange={(event) => change("clientImage", event.target.value)} className={inputClass} />
              {fieldErrors.clientImage && <p className="mb-0 mt-1 text-sm text-red-300">{fieldErrors.clientImage}</p>}
            </div>
            <div>
              <label htmlFor="transaction-image-file" className={labelClass}>Upload transaction image</label>
              <input id="transaction-image-file" type="file" accept="image/png,image/jpeg,image/webp" disabled className="block min-h-11 w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-gray-400 disabled:cursor-not-allowed" />
              <label htmlFor="transaction-image" className={`${labelClass} mt-3`}>Existing transaction image path *</label>
              <input id="transaction-image" placeholder="/images/transaction.png" value={form.transactionImage} onChange={(event) => change("transactionImage", event.target.value)} className={inputClass} />
              {fieldErrors.transactionImage && <p className="mb-0 mt-1 text-sm text-red-300">{fieldErrors.transactionImage}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {form.clientImage && <div><p className="mb-2 text-xs text-gray-400">Client photo preview</p><div className="relative aspect-square max-w-48 overflow-hidden rounded-full border border-[#ffd43b]/30"><Image src={form.clientImage} alt={`${form.clientName || "Client"} preview`} fill sizes="192px" className="object-cover" /></div></div>}
            {form.transactionImage && <div><p className="mb-2 text-xs text-gray-400">Transaction image preview</p><div className="relative aspect-[16/9] max-w-lg overflow-hidden rounded-lg border border-[#ffd43b]/30"><Image src={form.transactionImage} alt="Transaction screenshot preview" fill sizes="600px" className="object-cover" /></div></div>}
          </div>
        </section>

        {error && <p role="alert" className="rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/portfolio" className="min-h-11 self-center text-sm text-gray-300 underline underline-offset-4 hover:text-white">Cancel</Link>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setPreview((visible) => !visible)} className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-[#ffd43b]/40">{preview ? "Close Preview" : "Preview"}</button>
            <button type="button" disabled={saving} onClick={() => void save("draft")} className="min-h-11 rounded-lg border border-[#ffd43b]/40 px-4 text-sm font-semibold text-[#ffd43b] disabled:opacity-50">Save Draft</button>
            <button type="button" disabled={saving} onClick={() => void save("published")} className="btn-primary min-h-11 disabled:opacity-50">{saving ? "Saving…" : "Publish"}</button>
          </div>
        </div>
      </form>
      {preview && (
        <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#ffd43b]">Unsaved preview</p>
          <PortfolioCard item={previewItem} preview />
        </aside>
      )}
    </div>
  );
}
