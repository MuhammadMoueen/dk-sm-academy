"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import type { ArticleContentBlock } from "@/types/article";
import { ImageUploadField } from "@/components/admin/image-upload-field";

type ArticleFormData = {
  title: string;
  slug: string;
  excerpt: string;
  hashtags: string[];
  content: ArticleContentBlock[];
  thumbnailUrl: string;
  category: string;
  displayOrder: number | null;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
};

const emptyArticle: ArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  hashtags: [],
  content: [],
  thumbnailUrl: "",
  category: "",
  displayOrder: null,
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

function FieldError({ children }: { children?: string }) {
  return children ? (
    <p className="mb-0 mt-1 text-sm text-red-300">{children}</p>
  ) : null;
}

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/15 bg-[#090909] px-3 text-white outline-none focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/15";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-200";

export function ArticleEditor({ articleId }: { articleId?: string }) {
  const [form, setForm] = useState<ArticleFormData>(emptyArticle);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(Boolean(articleId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(articleId));
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const endpoint = articleId
    ? `/api/admin/articles/${articleId}`
    : "/api/admin/articles";

  useEffect(() => {
    if (!articleId) return;
    let mounted = true;
    void (async () => {
      try {
        const response = await fetch(endpoint, { cache: "no-store" });
        const result = (await response.json()) as {
          article?: Record<string, unknown>;
          error?: string;
        };
        if (!response.ok || !result.article) {
          throw new Error(result.error ?? "Article could not be loaded.");
        }
        if (!mounted) return;
        const article = result.article;
        setForm({
          title: String(article.title ?? ""),
          slug: String(article.slug ?? ""),
          excerpt: String(article.excerpt ?? ""),
          hashtags: Array.isArray(article.hashtags) ? article.hashtags.map(String) : [],
          content: Array.isArray(article.content)
            ? (article.content as ArticleContentBlock[])
            : [],
          thumbnailUrl: String(article.thumbnailUrl ?? ""),
          category: String(article.category ?? ""),
          displayOrder:
            typeof article.displayOrder === "number"
              ? article.displayOrder
              : null,
          status: article.status === "published" ? "published" : "draft",
          seoTitle: String(article.seoTitle ?? ""),
          seoDescription: String(article.seoDescription ?? ""),
        });
        setDirty(false);
      } catch (caught) {
        if (mounted) {
          setMessage(
            caught instanceof Error ? caught.message : "Article could not be loaded.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [articleId, endpoint]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function change<K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "title" && !slugEdited
        ? { slug: slugify(String(value)) }
        : {}),
    }));
    setDirty(true);
    setErrors((current) => ({ ...current, [String(key)]: "" }));
    setMessage("");
  }

  function addBlock(type: ArticleContentBlock["type"]) {
    const block: ArticleContentBlock =
      type === "heading"
        ? { type, level: 2, text: "" }
        : type === "list"
          ? { type, items: [""] }
          : type === "link"
            ? { type, text: "", href: "" }
            : type === "image"
              ? { type, src: "", alt: "" }
              : { type, text: "" };
    change("content", [...form.content, block]);
  }

  function updateBlock(index: number, block: ArticleContentBlock) {
    change(
      "content",
      form.content.map((item, itemIndex) =>
        itemIndex === index ? block : item,
      ),
    );
  }

  function removeBlock(index: number) {
    change(
      "content",
      form.content.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  async function submit(status: "draft" | "published") {
    if (saving || !formRef.current?.reportValidity()) return;
    setSaving(true);
    setErrors({});
    setMessage("");
    const payload = { ...form, status };
    try {
      const response = await fetch(endpoint, {
        method: articleId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        id?: string;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok) {
        setErrors(result.fields ?? {});
        throw new Error(result.error ?? "Article could not be saved.");
      }
      setDirty(false);
      router.push("/admin/articles");
      router.refresh();
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Article could not be saved.");
      setSaving(false);
    }
  }

  if (loading) {
    return <p role="status" className="py-12 text-center text-gray-400">Loading article…</p>;
  }

  if (message && articleId && !form.title) {
    return <p role="alert" className="rounded-lg border border-red-400/25 bg-red-500/10 p-4 text-red-200">{message}</p>;
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
      <form ref={formRef} className="min-w-0 space-y-5" onSubmit={(event) => { event.preventDefault(); void submit(form.status); }}>
        <div className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-bold">Article details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="article-title" className={labelClass}>Article title *</label>
              <input id="article-title" value={form.title} required maxLength={180} onChange={(event) => change("title", event.target.value)} className={inputClass} />
              <FieldError>{errors.title}</FieldError>
            </div>
            <div>
              <label htmlFor="article-slug" className={labelClass}>URL slug *</label>
              <input id="article-slug" value={form.slug} required maxLength={180} onChange={(event) => { setSlugEdited(true); change("slug", slugify(event.target.value)); }} className={inputClass} />
              <FieldError>{errors.slug}</FieldError>
            </div>
            <div>
              <label htmlFor="article-excerpt" className={labelClass}>Short description *</label>
              <textarea id="article-excerpt" value={form.excerpt} required maxLength={500} rows={3} onChange={(event) => change("excerpt", event.target.value)} className={`${inputClass} py-2`} />
              <FieldError>{errors.excerpt}</FieldError>
            </div>
            <div>
              <label htmlFor="article-hashtags" className={labelClass}>Hashtags</label>
              <input
                id="article-hashtags"
                value={form.hashtags.join(" ")}
                placeholder="#trading #crypto"
                onChange={(event) =>
                  change(
                    "hashtags",
                    event.target.value
                      .split(/[\s,]+/)
                      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
                      .filter((tag) => tag !== "#"),
                  )
                }
                className={inputClass}
              />
              <p className="mb-0 mt-1 text-xs text-gray-500">Use up to 10 tags, separated by spaces.</p>
              <FieldError>{errors.hashtags}</FieldError>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="article-category" className={labelClass}>Category</label>
                <input id="article-category" value={form.category} maxLength={80} onChange={(event) => change("category", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="article-order" className={labelClass}>Homepage display order</label>
                <input id="article-order" type="number" min={0} step={1} value={form.displayOrder ?? ""} onChange={(event) => change("displayOrder", event.target.value === "" ? null : Number(event.target.value))} className={inputClass} />
                <p className="mb-0 mt-1 text-xs text-gray-500">Optional; lower numbers appear first.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-2 text-lg font-bold">Thumbnail</h2>
          <p className="mb-4 text-sm text-gray-400">PNG, JPEG, and WebP images up to 8 MB.</p>
          <ImageUploadField id="article-file" label="Upload thumbnail" kind="article-thumbnail" onUploaded={(url) => change("thumbnailUrl", url)} />
          <label htmlFor="article-thumbnail" className={`${labelClass} mt-4`}>Existing image path</label>
          <input id="article-thumbnail" value={form.thumbnailUrl} placeholder="/images/example.png" onChange={(event) => change("thumbnailUrl", event.target.value)} className={inputClass} />
          <FieldError>{errors.thumbnailUrl}</FieldError>
          {form.thumbnailUrl && (
            <div className="relative mt-4 aspect-[16/10] max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#080808]">
              <Image src={form.thumbnailUrl} alt="Article thumbnail preview" fill sizes="400px" className="object-cover" />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="mb-1 text-lg font-bold">Article content *</h2>
              <p className="mb-0 text-sm text-gray-400">Add safe structured headings, paragraphs, lists, links, and image references.</p>
            </div>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {(["heading", "paragraph", "list", "link", "image"] as const).map((type) => (
              <button key={type} type="button" onClick={() => addBlock(type)} className="min-h-10 rounded-lg border border-[#ffd43b]/30 px-3 text-sm text-[#ffd43b] hover:bg-[#ffd43b]/5">
                + {type === "heading" ? "Heading" : type === "paragraph" ? "Paragraph" : type === "list" ? "List" : type === "link" ? "Link" : "Image"}
              </button>
            ))}
          </div>
          {errors.content && <FieldError>{errors.content}</FieldError>}
          {form.content.length === 0 && (
            <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-gray-500">No content blocks yet. Add a paragraph or heading to begin.</p>
          )}
          <div className="space-y-3">
            {form.content.map((block, index) => (
              <div key={`${block.type}-${index}`} className="rounded-lg border border-white/10 bg-[#090909] p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ffd43b]">{block.type}</span>
                  <button type="button" onClick={() => removeBlock(index)} className="text-xs text-red-300 hover:text-red-200">Remove block</button>
                </div>
                {block.type === "heading" && (
                  <>
                    <label className="mb-2 block text-xs text-gray-400">Heading level</label>
                    <select value={block.level} onChange={(event) => updateBlock(index, { ...block, level: Number(event.target.value) as 2 | 3 })} className={`${inputClass} mb-3`}>
                      <option value={2}>Heading 2</option>
                      <option value={3}>Heading 3</option>
                    </select>
                    <textarea aria-label="Heading text" value={block.text} rows={2} onChange={(event) => updateBlock(index, { ...block, text: event.target.value })} className={`${inputClass} py-2`} />
                  </>
                )}
                {block.type === "paragraph" && (
                  <textarea aria-label="Paragraph text" value={block.text} rows={4} onChange={(event) => updateBlock(index, { ...block, text: event.target.value })} className={`${inputClass} py-2`} />
                )}
                {block.type === "list" && (
                  <>
                    <label className="mb-2 block text-xs text-gray-400">One item per line</label>
                    <textarea aria-label="List items" value={block.items.join("\n")} rows={4} onChange={(event) => updateBlock(index, { ...block, items: event.target.value.split("\n") })} className={`${inputClass} py-2`} />
                    <label className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                      <input type="checkbox" checked={block.ordered ?? false} onChange={(event) => updateBlock(index, { ...block, ordered: event.target.checked })} className="accent-[#ffd43b]" />
                      Numbered list
                    </label>
                  </>
                )}
                {block.type === "link" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input aria-label="Link text" placeholder="Link text" value={block.text} onChange={(event) => updateBlock(index, { ...block, text: event.target.value })} className={inputClass} />
                    <input aria-label="Link URL" placeholder="https://… or /path" value={block.href} onChange={(event) => updateBlock(index, { ...block, href: event.target.value })} className={inputClass} />
                  </div>
                )}
                {block.type === "image" && (
                  <div className="space-y-3">
                    <p className="mb-0 text-xs text-amber-200">Images must already be available on this site; uploads are disabled.</p>
                    <input aria-label="Image path" placeholder="/images/example.png" value={block.src} onChange={(event) => updateBlock(index, { ...block, src: event.target.value })} className={inputClass} />
                    <input aria-label="Image alternative text" placeholder="Alternative text" value={block.alt} onChange={(event) => updateBlock(index, { ...block, alt: event.target.value })} className={inputClass} />
                    <input aria-label="Image caption" placeholder="Optional caption" value={block.caption ?? ""} onChange={(event) => updateBlock(index, { ...block, caption: event.target.value })} className={inputClass} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">SEO metadata</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="article-seo-title" className={labelClass}>SEO title</label>
              <input id="article-seo-title" value={form.seoTitle} maxLength={180} onChange={(event) => change("seoTitle", event.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="article-seo-description" className={labelClass}>Meta description</label>
              <textarea id="article-seo-description" value={form.seoDescription} rows={3} maxLength={500} onChange={(event) => change("seoDescription", event.target.value)} className={`${inputClass} py-2`} />
            </div>
          </div>
        </div>

        {message && <p role="alert" className="rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{message}</p>}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/admin/articles" className="min-h-11 self-center text-sm text-gray-300 underline underline-offset-4 hover:text-white">Cancel</Link>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setShowPreview((visible) => !visible)} className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-[#ffd43b]/40">
              {showPreview ? "Close Preview" : "Preview"}
            </button>
            <button type="button" disabled={saving} onClick={() => void submit("draft")} className="min-h-11 rounded-lg border border-[#ffd43b]/40 px-4 text-sm font-semibold text-[#ffd43b] disabled:opacity-50">
              Save Draft
            </button>
            <button type="button" disabled={saving} onClick={() => void submit("published")} className="btn-primary min-h-11 disabled:opacity-50">
              {saving ? "Saving…" : articleId && form.status === "published" ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </div>
      </form>

      {showPreview && (
        <aside className="min-w-0 rounded-xl border border-[#ffd43b]/20 bg-[#111] p-4 sm:p-6 xl:sticky xl:top-24 xl:self-start">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#ffd43b]">Unsaved preview</p>
          <h2 className="mb-2 break-words text-2xl font-extrabold">{form.title || "Article title"}</h2>
          <p className="mb-5 text-sm text-gray-300">{form.excerpt || "Article short description"}</p>
          {form.thumbnailUrl && (
            <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-lg">
              <Image src={form.thumbnailUrl} alt="" fill sizes="500px" className="object-cover" />
            </div>
          )}
          <ArticleContent blocks={form.content} />
        </aside>
      )}
    </div>
  );
}
