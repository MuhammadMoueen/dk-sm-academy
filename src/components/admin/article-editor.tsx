
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import type { ArticleContentBlock } from "@/types/article";
import { ProfileImageEditor } from "@/components/admin/profile-image-editor";

type ArticleFormData = {
  title: string;
  slug: string;
  excerpt: string;
  articleLink: string;
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
  articleLink: "",
  hashtags: [],
  content: [],
  thumbnailUrl: "",
  category: "",
  displayOrder: null,
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/15 bg-[#090909] px-3 text-white outline-none focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/15";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-gray-200";

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
  if (!children) return null;

  return (
    <p className="mb-0 mt-1 text-sm text-red-300" role="alert">
      {children}
    </p>
  );
}

function getFriendlyFieldName(key: string) {
  const root = key.split(".")[0];

  const names: Record<string, string> = {
    title: "Article title",
    slug: "Article URL",
    excerpt: "Short description",
    articleLink: "Article link",
    hashtags: "Hashtags",
    content: "Article content",
    thumbnailUrl: "Thumbnail image",
    category: "Category",
    displayOrder: "Display order",
    status: "Publication status",
    seoTitle: "SEO title",
    seoDescription: "SEO description",
  };

  return names[root] ?? root;
}

function getFriendlyError(key: string, message: string) {
  if (key.startsWith("hashtags.")) {
    return "Invalid hashtag. Use separate tags, for example: #trading #crypto.";
  }

  if (key === "slug") {
    return "The article URL could not be generated correctly. Check the article title and try again.";
  }

  if (key === "thumbnailUrl") {
    return "Please upload a valid thumbnail image.";
  }

  if (key === "articleLink") {
    return "Enter a valid HTTP/HTTPS link, or leave this field empty.";
  }

  if (key === "content") {
    return "Article content is invalid. Please check the description and try again.";
  }

  return message || `${getFriendlyFieldName(key)} is invalid. Please check this field.`;
}

function mapFieldKey(key: string) {
  return key === "slug" ? "title" : key;
}

function parseHashtags(value: string) {
  return value
    .replace(/,/g, " ")
    .split(/\s+/)
    .flatMap((token) => token.split(/(?=#)/g))
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
}

export function ArticleEditor({
  articleId,
}: {
  articleId?: string;
}) {
  const [form, setForm] = useState<ArticleFormData>(emptyArticle);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(Boolean(articleId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [dirty, setDirty] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const endpoint = articleId
    ? `/api/admin/articles/${articleId}`
    : "/api/admin/articles";

  useEffect(() => {
    if (!articleId) return;

    let mounted = true;

    async function loadArticle() {
      try {
        const response = await fetch(endpoint, {
          cache: "no-store",
        });

        const result = (await response.json()) as {
          article?: Record<string, unknown>;
          error?: string;
        };

        if (!response.ok || !result.article) {
          throw new Error(
            result.error ?? "Article could not be loaded.",
          );
        }

        if (!mounted) return;

        const article = result.article;

        setForm({
          title: String(article.title ?? ""),
          slug: String(article.slug ?? ""),
          excerpt: String(article.excerpt ?? ""),
          articleLink: String(article.articleLink ?? ""),
          hashtags: Array.isArray(article.hashtags)
            ? article.hashtags.map(String)
            : [],
          content: Array.isArray(article.content)
            ? (article.content as ArticleContentBlock[])
            : [],
          thumbnailUrl: String(article.thumbnailUrl ?? ""),
          category: String(article.category ?? ""),
          displayOrder:
            typeof article.displayOrder === "number"
              ? article.displayOrder
              : null,
          status:
            article.status === "published"
              ? "published"
              : "draft",
          seoTitle: String(article.seoTitle ?? ""),
          seoDescription: String(article.seoDescription ?? ""),
        });

        setDirty(false);
      } catch (error) {
        if (mounted) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Article could not be loaded.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadArticle();

    return () => {
      mounted = false;
    };
  }, [articleId, endpoint]);

  useEffect(() => {
    if (!dirty) return;

    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeaving);

    return () =>
      window.removeEventListener(
        "beforeunload",
        warnBeforeLeaving,
      );
  }, [dirty]);

  function change<K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "title"
        ? { slug: slugify(String(value)) }
        : {}),
    }));

    setDirty(true);
    setMessage("");

    setErrors((current) => {
      const next = { ...current };
      delete next[String(key)];

      if (key === "hashtags") {
        for (const errorKey of Object.keys(next)) {
          if (errorKey.startsWith("hashtags.")) {
            delete next[errorKey];
          }
        }
      }

      return next;
    });
  }

  function parseServerErrors(
    fields?: Record<string, string>,
  ) {
    const mapped: Record<string, string> = {};

    for (const [key, value] of Object.entries(fields ?? {})) {
      mapped[mapFieldKey(key)] = getFriendlyError(key, value);
    }

    return mapped;
  }

  function updateContentBlock(
    index: number,
    block: ArticleContentBlock,
  ) {
    change("content", form.content.map((current, currentIndex) =>
      currentIndex === index ? block : current,
    ));
  }

  function addContentBlock(type: ArticleContentBlock["type"]) {
    const block: ArticleContentBlock =
      type === "heading"
        ? { type, level: 2, text: "" }
        : type === "paragraph"
          ? { type, text: "" }
          : type === "list"
            ? { type, ordered: false, items: [""] }
            : type === "link"
              ? { type, text: "", href: "" }
              : { type, src: "", alt: "", caption: "" };
    change("content", [...form.content, block]);
  }

  function removeContentBlock(index: number) {
    change(
      "content",
      form.content.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  async function submit(status: "draft" | "published") {
    if (saving) return;

    const formElement = formRef.current;

    if (!formElement) return;

    setSaving(true);
    setErrors({});
    setMessage("");

    const content: ArticleContentBlock[] =
      form.content.length > 0
        ? form.content
        : [];

    const payload = {
      ...form,
      slug: slugify(form.title),
      articleLink: form.articleLink.trim(),
      hashtags: form.hashtags
        .flatMap((tag) => parseHashtags(tag)),
      content,
      status,
    };

    try {
      const response = await fetch(endpoint, {
        method: articleId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        fields?: Record<string, string>;
        issues?: Array<{
          path?: Array<string | number>;
          message?: string;
        }>;
      };

      if (!response.ok) {
        const serverFields: Record<string, string> = {
          ...(result.fields ?? {}),
        };

        // Also support APIs that return Zod issues directly.
        for (const issue of result.issues ?? []) {
          const key = (issue.path ?? []).map(String).join(".");
          if (key) {
            serverFields[key] =
              issue.message ?? "Please check this field.";
          }
        }

        const mappedErrors = parseServerErrors(serverFields);

        setErrors(mappedErrors);

        const firstField = Object.keys(mappedErrors)[0];

        if (firstField) {
          const rootField = firstField.split(".")[0];

          const fieldIds: Record<string, string> = {
            title: "article-title",
            excerpt: "article-excerpt",
            articleLink: "article-link",
            hashtags: "article-hashtags",
          };

          const fieldId = fieldIds[rootField];

          if (fieldId) {
            requestAnimationFrame(() => {
              document.getElementById(fieldId)?.focus();
            });
          }
        }

        setMessage(
          firstField
            ? "Please correct the highlighted field below."
            : result.error ?? "Article could not be saved. Please try again.",
        );

        setSaving(false);
        return;
      }

      setDirty(false);
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `Could not save article: ${error.message}`
          : "Could not save article. Please try again.",
      );

      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="py-12 text-center text-gray-400" role="status">
        Loading article…
      </p>
    );
  }

  if (message && articleId && !form.title) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-400/25 bg-red-500/10 p-4 text-red-200"
      >
        {message}
      </p>
    );
  }

  const previewContent: ArticleContentBlock[] =
    form.content;

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
      <form
        ref={formRef}
        className="min-w-0 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit(form.status);
        }}
      >
        <section className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-bold">
            Article details
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="article-title" className={labelClass}>
                Article title *
              </label>
              <input
                id="article-title"
                value={form.title}
                required
                maxLength={180}
                onChange={(event) =>
                  change("title", event.target.value)
                }
                className={inputClass}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "article-title-error" : undefined
                }
              />
              <div id="article-title-error">
                <FieldError>{errors.title}</FieldError>
              </div>
            </div>

            <div>
              <label htmlFor="article-excerpt" className={labelClass}>
                Short description *
              </label>
              <textarea
                id="article-excerpt"
                value={form.excerpt}
                required
                maxLength={500}
                rows={3}
                onChange={(event) =>
                  change("excerpt", event.target.value)
                }
                className={`${inputClass} py-2`}
                aria-invalid={Boolean(errors.excerpt)}
                aria-describedby={
                  errors.excerpt ? "article-excerpt-error" : undefined
                }
              />
              <div id="article-excerpt-error">
                <FieldError>{errors.excerpt}</FieldError>
              </div>
            </div>

            <div>
              <label htmlFor="article-link" className={labelClass}>
                Article link
              </label>
              <input
                id="article-link"
                type="text"
                inputMode="url"
                value={form.articleLink}
                placeholder="https://example.com/article"
                onChange={(event) =>
                  change("articleLink", event.target.value)
                }
                className={inputClass}
                aria-invalid={Boolean(errors.articleLink)}
              />
              <p className="mb-0 mt-1 text-xs text-gray-500">
                Optional. Enter a valid HTTP/HTTPS URL or leave blank.
              </p>
              <FieldError>{errors.articleLink}</FieldError>
            </div>

            <div>
              <label htmlFor="article-hashtags" className={labelClass}>
                Hashtags
              </label>
              <input
                id="article-hashtags"
                value={form.hashtags.join(" ")}
                placeholder="#trading #crypto"
                onChange={(event) => {
                  change("hashtags", parseHashtags(event.target.value));
                }}
                className={inputClass}
                aria-invalid={Boolean(
                  errors.hashtags ||
                    Object.keys(errors).some((key) =>
                      key.startsWith("hashtags."),
                    ),
                )}
                aria-describedby="article-hashtags-help article-hashtags-error"
              />
              <p
                id="article-hashtags-help"
                className="mb-0 mt-1 text-xs text-gray-500"
              >
                Optional. Up to 10 tags, separated by spaces or commas.
                Example: #trading #crypto
              </p>
              <div id="article-hashtags-error">
                <FieldError>
                  {errors.hashtags ??
                    Object.entries(errors).find(([key]) =>
                      key.startsWith("hashtags."),
                    )?.[1]}
                </FieldError>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="mb-1 text-lg font-bold">Article content</h2>
              <p className="mb-0 text-sm text-gray-400">
                Add as many headings, paragraphs, lists, links, and images as your article needs.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["heading", "paragraph", "list", "link", "image"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addContentBlock(type)}
                  className="min-h-9 rounded-lg border border-[#ffd43b]/40 px-3 text-xs font-semibold capitalize text-[#ffd43b] transition hover:bg-[#ffd43b]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
                >
                  Add {type}
                </button>
              ))}
            </div>
          </div>

          {form.content.length === 0 ? (
            <p className="mb-0 rounded-lg border border-dashed border-white/15 p-5 text-sm text-gray-400">
              No content blocks yet. Add a paragraph to start writing.
            </p>
          ) : (
            <div className="space-y-4">
              {form.content.map((block, index) => (
                <div
                  key={`${block.type}-${index}`}
                  className="rounded-lg border border-white/10 bg-[#090909] p-3 sm:p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#ffd43b]">
                      {block.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeContentBlock(index)}
                      className="text-xs font-semibold text-gray-400 underline underline-offset-2 transition hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
                    >
                      Remove
                    </button>
                  </div>

                  {block.type === "heading" && (
                    <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
                      <select
                        aria-label={`Heading level ${index + 1}`}
                        value={block.level}
                        onChange={(event) =>
                          updateContentBlock(index, {
                            ...block,
                            level: Number(event.target.value) as 2 | 3,
                          })
                        }
                        className={`${inputClass} sm:w-24`}
                      >
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                      </select>
                      <input
                        aria-label={`Heading text ${index + 1}`}
                        value={block.text}
                        onChange={(event) =>
                          updateContentBlock(index, { ...block, text: event.target.value })
                        }
                        placeholder="Heading text"
                        className={inputClass}
                      />
                    </div>
                  )}

                  {block.type === "paragraph" && (
                    <textarea
                      aria-label={`Paragraph ${index + 1}`}
                      value={block.text}
                      onChange={(event) =>
                        updateContentBlock(index, { ...block, text: event.target.value })
                      }
                      rows={7}
                      placeholder="Write your article paragraph here..."
                      className={`${inputClass} resize-y py-2`}
                    />
                  )}

                  {block.type === "list" && (
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={block.ordered ?? false}
                          onChange={(event) =>
                            updateContentBlock(index, {
                              ...block,
                              ordered: event.target.checked,
                            })
                          }
                          className="accent-[#ffd43b]"
                        />
                        Numbered list
                      </label>
                      <textarea
                        aria-label={`List items ${index + 1}`}
                        value={block.items.join("\n")}
                        onChange={(event) =>
                          updateContentBlock(index, {
                            ...block,
                            items: event.target.value
                              .split("\n")
                              .filter((item) => item.trim().length > 0),
                          })
                        }
                        rows={5}
                        placeholder="One list item per line"
                        className={`${inputClass} resize-y py-2`}
                      />
                    </div>
                  )}

                  {block.type === "link" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        aria-label={`Link text ${index + 1}`}
                        value={block.text}
                        onChange={(event) =>
                          updateContentBlock(index, { ...block, text: event.target.value })
                        }
                        placeholder="Link text"
                        className={inputClass}
                      />
                      <input
                        aria-label={`Link URL ${index + 1}`}
                        value={block.href}
                        onChange={(event) =>
                          updateContentBlock(index, { ...block, href: event.target.value })
                        }
                        placeholder="https://example.com"
                        className={inputClass}
                      />
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        aria-label={`Image source ${index + 1}`}
                        value={block.src}
                        onChange={(event) =>
                          updateContentBlock(index, { ...block, src: event.target.value })
                        }
                        placeholder="/images/article.png"
                        className={inputClass}
                      />
                      <input
                        aria-label={`Image alt text ${index + 1}`}
                        value={block.alt}
                        onChange={(event) =>
                          updateContentBlock(index, { ...block, alt: event.target.value })
                        }
                        placeholder="Image description"
                        className={inputClass}
                      />
                      <input
                        aria-label={`Image caption ${index + 1}`}
                        value={block.caption ?? ""}
                        onChange={(event) =>
                          updateContentBlock(index, { ...block, caption: event.target.value })
                        }
                        placeholder="Optional caption"
                        className={`${inputClass} sm:col-span-2`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <FieldError>{errors.content}</FieldError>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-2 text-lg font-bold">Thumbnail</h2>
          <p className="mb-4 text-sm text-gray-400">
            PNG, JPEG, and WebP images up to 8 MB.
          </p>

          <ProfileImageEditor
            kind="article-thumbnail"
            label="Thumbnail image"
            onSaved={async (url) => change("thumbnailUrl", url)}
          />

          <FieldError>{errors.thumbnailUrl}</FieldError>

          {form.thumbnailUrl && (
            <div className="relative mt-4 aspect-[16/9] max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#080808]">
              <Image
                src={form.thumbnailUrl}
                alt="Article thumbnail preview"
                fill
                sizes="400px"
                className="object-contain"
              />
            </div>
          )}
        </section>

        {message && (
          <p
            role="alert"
            className="rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200"
          >
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/articles"
            className="inline-flex min-h-11 items-center justify-center self-center rounded-lg border border-[#ffd43b]/70 px-4 text-sm font-semibold text-[#ffd43b] transition hover:border-[#ffd43b] hover:bg-[#ffd43b]/10"
          >
            Cancel
          </Link>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPreview((visible) => !visible)}
              className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-[#ffd43b]/40"
            >
              {showPreview ? "Close Preview" : "Preview"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => void submit("draft")}
              className="min-h-11 rounded-lg border border-[#ffd43b]/40 px-4 text-sm font-semibold text-[#ffd43b] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => void submit("published")}
              className="btn-primary min-h-11 disabled:opacity-50"
            >
              {saving
                ? "Saving…"
                : articleId && form.status === "published"
                  ? "Update & Publish"
                  : "Publish"}
            </button>
          </div>
        </div>
      </form>

      {showPreview && (
        <aside className="min-w-0 rounded-xl border border-[#ffd43b]/20 bg-[#111] p-4 sm:p-6 xl:sticky xl:top-24 xl:self-start">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#ffd43b]">
            Unsaved preview
          </p>

          <h2 className="mb-2 break-words text-2xl font-extrabold">
            {form.title || "Article title"}
          </h2>

          <p className="mb-5 text-sm text-gray-300">
            {form.excerpt || "Article short description"}
          </p>

          {form.thumbnailUrl && (
            <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg bg-[#080808]">
              <Image
                src={form.thumbnailUrl}
                alt=""
                fill
                sizes="500px"
                className="object-contain"
              />
            </div>
          )}

          <ArticleContent blocks={previewContent} />
        </aside>
      )}
    </div>
  );
}
