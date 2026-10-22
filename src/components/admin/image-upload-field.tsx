"use client";

import { useEffect, useRef, useState } from "react";

type UploadKind =
  | "article-thumbnail"
  | "article-content"
  | "client-image"
  | "transaction-image"
  | "avatar";

type ImageUploadFieldProps = {
  id: string;
  label: string;
  kind: UploadKind;
  onUploaded: (url: string) => void;
  currentUrl?: string;
};

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploadField({
  id,
  label,
  kind,
  onUploaded,
  currentUrl,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setPreview(currentUrl ?? ""));
  }, [currentUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function clearLocalPreview() {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
  }

  async function upload(file?: File) {
    if (!file || isUploading) return;

    setError("");
    setStatus("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must not exceed 8 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    clearLocalPreview();

    const localUrl = URL.createObjectURL(file);
    previewRef.current = localUrl;
    setPreview(localUrl);
    setIsUploading(true);
    setStatus("Uploading image…");

    const body = new FormData();
    body.append("kind", kind);
    body.append("file", file);

    try {
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

      clearLocalPreview();
      setPreview(result.url);
      setStatus("Image uploaded successfully.");
    } catch (caught) {
      clearLocalPreview();
      setPreview(currentUrl ?? "");
      setStatus("");
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong while uploading the image.",
      );
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-200"
      >
        {label}
      </label>

      {preview && (
        <div className="relative w-fit">
          <img
            src={preview}
            alt={`${label} preview`}
            className={
              kind === "avatar"
                ? "h-32 w-32 rounded-full border-2 border-[#ffd43b] object-cover"
                : "max-h-56 max-w-full rounded-xl border border-white/10 object-contain"
            }
          />
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={isUploading}
        onChange={(event) => void upload(event.target.files?.[0])}
        className="block min-h-11 w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#ffd43b]/15 file:px-3 file:py-2 file:font-semibold file:text-[#ffd43b] hover:file:bg-[#ffd43b]/25 disabled:cursor-not-allowed disabled:opacity-50"
      />

      {isUploading && (
        <p role="status" className="text-xs text-[#ffd43b]">
          Uploading image. Please wait…
        </p>
      )}

      {!isUploading && status && (
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
