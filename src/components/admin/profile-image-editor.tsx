
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { useRouter } from "next/navigation";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import type { PortfolioItem } from "@/types/portfolio";

type ImageKind = "client-image" | "transaction-image";

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

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Point = { x: number; y: number };

function PortfolioImageEditor({
  kind,
  label,
  currentUrl,
  onUploaded,
}: {
  kind: ImageKind;
  label: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
}) {
  const isClient = kind === "client-image";
  const frameWidth = isClient ? 256 : 320;
  const frameHeight = isClient ? 256 : 180;
  const outputWidth = isClient ? 512 : 1280;
  const outputHeight = isClient ? 512 : 720;

  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sourceRef = useRef("");
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);

  useEffect(() => {
    return () => {
      if (sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    };
  }, []);

  function clearSource() {
    if (sourceRef.current) URL.revokeObjectURL(sourceRef.current);
    sourceRef.current = "";
    setSource("");
    setDimensions({ width: 0, height: 0 });
  }

  function choose(next?: File) {
    if (!next) return;

    if (!ALLOWED_TYPES.includes(next.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (next.size > MAX_BYTES) {
      setError("Image must be smaller than 8 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    clearSource();
    const url = URL.createObjectURL(next);
    sourceRef.current = url;
    setSource(url);
    setFile(next);
    setZoom(1);
    setX(0);
    setY(0);
    setRotation(0);
    setError("");
    setStatus("");
    pointers.current.clear();
    pinch.current = null;
  }

  const baseScale =
    dimensions.width && dimensions.height
      ? Math.max(
          frameWidth / dimensions.width,
          frameHeight / dimensions.height,
        )
      : 1;

  const imageWidth = dimensions.width * baseScale;
  const imageHeight = dimensions.height * baseScale;

  function clampPosition(nextX: number, nextY: number, nextZoom = zoom) {
    const angle = ((rotation % 180) + 180) % 180;
    const rotatedWidth = angle === 90 ? imageHeight : imageWidth;
    const rotatedHeight = angle === 90 ? imageWidth : imageHeight;
    const width = rotatedWidth * nextZoom;
    const height = rotatedHeight * nextZoom;

    return {
      x: Math.max(
        -Math.max(0, (width - frameWidth) / 2),
        Math.min(Math.max(0, (width - frameWidth) / 2), nextX),
      ),
      y: Math.max(
        -Math.max(0, (height - frameHeight) / 2),
        Math.min(Math.max(0, (height - frameHeight) / 2), nextY),
      ),
    };
  }

  function changeZoom(value: number) {
    const nextZoom = Math.max(1, Math.min(4, value));
    const next = clampPosition(x, y, nextZoom);
    setZoom(nextZoom);
    setX(next.x);
    setY(next.y);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (uploading) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = {
        distance: Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)),
        zoom,
      };
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;

    const current = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, current);

    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values());
      const distance = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      changeZoom(pinch.current.zoom * (distance / pinch.current.distance));
      return;
    }

    const next = clampPosition(
      x + current.x - previous.x,
      y + current.y - previous.y,
    );
    setX(next.x);
    setY(next.y);
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    pinch.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    changeZoom(zoom - event.deltaY * 0.003);
  }

  function cancelEditor() {
    if (uploading) return;
    setFile(null);
    clearSource();
    setZoom(1);
    setX(0);
    setY(0);
    setRotation(0);
    setError("");
    setStatus("");
    pointers.current.clear();
    pinch.current = null;
    if (inputRef.current) inputRef.current.value = "";
  }

  async function applyImage() {
    if (!file || !source || !dimensions.width || uploading) return;

    setUploading(true);
    setError("");
    setStatus("Preparing cropped image…");

    try {
      const image = imageRef.current;
      if (!image) throw new Error("Image preview is not ready.");

      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable in this browser.");

      context.fillStyle = "#090909";
      context.fillRect(0, 0, outputWidth, outputHeight);

      const scale =
        Math.max(
          outputWidth / image.naturalWidth,
          outputHeight / image.naturalHeight,
        ) * zoom;

      context.save();
      context.translate(
        outputWidth / 2 + (x * outputWidth) / frameWidth,
        outputHeight / 2 + (y * outputHeight) / frameHeight,
      );
      context.rotate((rotation * Math.PI) / 180);
      context.drawImage(
        image,
        (-image.naturalWidth * scale) / 2,
        (-image.naturalHeight * scale) / 2,
        image.naturalWidth * scale,
        image.naturalHeight * scale,
      );
      context.restore();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.92),
      );

      if (!blob) throw new Error("Could not generate the cropped image.");

      setStatus("Uploading image to Cloudinary…");

      const body = new FormData();
      body.append("kind", kind);
      body.append(
        "file",
        new File([blob], `${kind}.jpg`, { type: "image/jpeg" }),
      );

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body,
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Image upload failed.");
      }

      onUploaded(result.url);
      setStatus("Image uploaded successfully.");
      setFile(null);
      clearSource();
      setZoom(1);
      setX(0);
      setY(0);
      setRotation(0);
      if (inputRef.current) inputRef.current.value = "";
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to upload image.",
      );
      setStatus("");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-w-0 space-y-3">
      <label
        htmlFor={`${kind}-file`}
        className="block text-sm font-semibold text-gray-200"
      >
        {label}
      </label>

      {currentUrl && (
        <div className="mb-3">
          <p className="mb-2 text-xs text-gray-400">Current image</p>
          <div
            className={`relative overflow-hidden border border-[#ffd43b]/30 ${
              isClient
                ? "h-28 w-28 rounded-full"
                : "aspect-video w-full max-w-md rounded-lg"
            }`}
          >
            <Image
              src={currentUrl}
              alt={label}
              fill
              sizes={isClient ? "112px" : "(max-width: 768px) 100vw, 448px"}
              className="object-cover"
            />
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        id={`${kind}-file`}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={uploading}
        onChange={(event) => choose(event.target.files?.[0])}
        className="block min-h-11 w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#ffd43b]/15 file:px-3 file:py-2 file:font-semibold file:text-[#ffd43b] hover:file:bg-[#ffd43b]/25 disabled:opacity-50"
      />

      {file && source && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-sm sm:p-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${kind}-editor-title`}
            className="my-auto w-full max-w-md rounded-2xl border border-[#ffd43b]/35 bg-[#090909] p-4 shadow-2xl sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2
                id={`${kind}-editor-title`}
                className="text-xl font-bold text-white"
              >
                Edit <span className="text-[#ffd43b]">image</span>
              </h2>
              <button
                type="button"
                onClick={cancelEditor}
                disabled={uploading}
                aria-label="Close image editor"
                className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <p className="mb-4 text-xs text-gray-400">
              Drag the image to position it. Use the wheel or pinch to zoom.
              {isClient
                ? " The client photo will be cropped square."
                : " The transaction screenshot will be cropped to 16:9."}
            </p>

            <div
              className="mx-auto touch-none select-none overflow-hidden border-2 border-[#ffd43b] bg-black cursor-grab active:cursor-grabbing"
              style={{
                width: "min(100%, 320px)",
                aspectRatio: `${frameWidth} / ${frameHeight}`,
                borderRadius: isClient ? "50%" : "12px",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onWheel={handleWheel}
            >
              <div
                className="relative h-full w-full overflow-hidden"
                style={{ aspectRatio: `${frameWidth} / ${frameHeight}` }}
              >
                <img
                  ref={imageRef}
                  src={source}
                  alt="Image crop preview"
                  draggable={false}
                  onLoad={(event) =>
                    setDimensions({
                      width: event.currentTarget.naturalWidth,
                      height: event.currentTarget.naturalHeight,
                    })
                  }
                  className="pointer-events-none absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    width: imageWidth || "100%",
                    height: imageHeight || "100%",
                    marginLeft: -(imageWidth || frameWidth) / 2,
                    marginTop: -(imageHeight || frameHeight) / 2,
                    transform: `translate(${x}px, ${y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-300">Zoom</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeZoom(zoom - 0.25)}
                  disabled={zoom <= 1 || uploading}
                  className="h-9 w-9 rounded-lg border border-white/20 text-lg text-white disabled:opacity-40"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => changeZoom(zoom + 0.25)}
                  disabled={zoom >= 4 || uploading}
                  className="h-9 w-9 rounded-lg border border-white/20 text-lg text-white disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-300">Rotate</span>
              <button
                type="button"
                onClick={() => setRotation((value) => (value + 90) % 360)}
                disabled={uploading}
                className="min-h-10 rounded-lg border border-white/20 px-3 text-sm font-semibold text-[#ffd43b] hover:border-[#ffd43b] disabled:opacity-50"
              >
                Rotate 90°
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="min-h-11 rounded-lg border border-white/20 px-2 text-sm font-semibold text-gray-200 disabled:opacity-50"
              >
                Choose different
              </button>
              <button
                type="button"
                onClick={cancelEditor}
                disabled={uploading}
                className="min-h-11 rounded-lg border border-white/20 px-3 text-sm font-semibold text-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void applyImage()}
                disabled={uploading || !dimensions.width}
                className="btn-primary col-span-2 min-h-11 disabled:opacity-50 sm:col-span-1"
              >
                {uploading ? "Uploading…" : "Apply image"}
              </button>
            </div>

            {status && (
              <p role="status" className="mb-0 mt-3 text-xs text-[#ffd43b]">
                {status}
              </p>
            )}
            {error && (
              <p role="alert" className="mb-0 mt-3 text-xs text-red-300">
                {error}
              </p>
            )}
          </section>
        </div>
      )}

      {!file && status && (
        <p role="status" className="text-xs text-green-300">
          {status}
        </p>
      )}
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500">
        JPG, PNG, or WebP · Maximum 8 MB
      </p>
    </div>
  );
}

export function ProfileImageEditor({ reviewId }: { reviewId?: string }) {
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
          setError(
            caught instanceof Error
              ? caught.message
              : "Review could not be loaded.",
          );
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
        clientImage: form.clientImage
          ? ""
          : "Upload a client photo before publishing.",
        transactionImage: form.transactionImage
          ? ""
          : "Upload a transaction image before publishing.",
      });
      setError("Upload both images before publishing this review.");
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
      setError(
        caught instanceof Error
          ? caught.message
          : "Review could not be saved.",
      );
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p role="status" className="py-12 text-center text-gray-400">
        Loading review…
      </p>
    );
  }

  if (error && reviewId && !form.clientName) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-400/25 bg-red-500/10 p-4 text-red-200"
      >
        {error}
      </p>
    );
  }

  const previewItem: PortfolioItem = {
    id: reviewId ?? "preview",
    ...form,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div
      className={`grid min-w-0 gap-6 ${
        preview ? "xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)]" : ""
      }`}
    >
      <form
        ref={formRef}
        className="min-w-0 space-y-5"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          void save(form.status);
        }}
      >
        <section className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-5 text-lg font-bold">Client review details</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="client-name" className={labelClass}>
                Client name *
              </label>
              <input
                id="client-name"
                required
                maxLength={120}
                value={form.clientName}
                onChange={(event) => change("clientName", event.target.value)}
                className={inputClass}
              />
              {fieldErrors.clientName && (
                <p className="mb-0 mt-1 text-sm text-red-300">
                  {fieldErrors.clientName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="review-text" className={labelClass}>
                Review *
              </label>
              <textarea
                id="review-text"
                required
                maxLength={3000}
                rows={5}
                value={form.review}
                onChange={(event) => change("review", event.target.value)}
                className={`${inputClass} py-2`}
              />
              {fieldErrors.review && (
                <p className="mb-0 mt-1 text-sm text-red-300">
                  {fieldErrors.review}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="review-rating" className={labelClass}>
                  Rating *
                </label>
                <select
                  id="review-rating"
                  required
                  value={form.rating}
                  onChange={(event) =>
                    change("rating", Number(event.target.value))
                  }
                  className={inputClass}
                >
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating.toFixed(1)} / 5
                    </option>
                  ))}
                </select>
                {fieldErrors.rating && (
                  <p className="mb-0 mt-1 text-sm text-red-300">
                    {fieldErrors.rating}
                  </p>
                )}
              </div>

              <label className="flex min-h-11 items-center gap-3 self-end rounded-lg border border-white/10 bg-[#090909] px-3 text-sm text-gray-200">
                <input
                  type="checkbox"
                  checked={form.isVerified}
                  onChange={(event) =>
                    change("isVerified", event.target.checked)
                  }
                  className="h-4 w-4 accent-[#ffd43b]"
                />
                Verified client (optional)
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-2 text-lg font-bold">Images</h2>
          <p className="mb-5 text-sm text-amber-200">
            Choose each image, adjust its crop, zoom or rotation, then apply it
            to upload the edited image to Cloudinary.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="min-w-0">
              <PortfolioImageEditor
                kind="client-image"
                label="Client photo"
                currentUrl={form.clientImage}
                onUploaded={(url) => change("clientImage", url)}
              />
              {fieldErrors.clientImage && (
                <p className="mb-0 mt-2 text-sm text-red-300">
                  {fieldErrors.clientImage}
                </p>
              )}
            </div>

            <div className="min-w-0">
              <PortfolioImageEditor
                kind="transaction-image"
                label="Transaction / deal screenshot"
                currentUrl={form.transactionImage}
                onUploaded={(url) => change("transactionImage", url)}
              />
              {fieldErrors.transactionImage && (
                <p className="mb-0 mt-2 text-sm text-red-300">
                  {fieldErrors.transactionImage}
                </p>
              )}
            </div>
          </div>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/portfolio"
            className="min-h-11 self-center text-sm text-gray-300 underline underline-offset-4 hover:text-white"
          >
            Cancel
          </Link>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setPreview((visible) => !visible)}
              className="min-h-11 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-[#ffd43b]/40"
            >
              {preview ? "Close Preview" : "Preview"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => void save("draft")}
              className="min-h-11 rounded-lg border border-[#ffd43b]/40 px-4 text-sm font-semibold text-[#ffd43b] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => void save("published")}
              className="btn-primary min-h-11 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Publish"}
            </button>
          </div>
        </div>
      </form>

      {preview && (
        <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#ffd43b]">
            Unsaved preview
          </p>
          <PortfolioCard item={previewItem} preview />
        </aside>
      )}
    </div>
  );
}
