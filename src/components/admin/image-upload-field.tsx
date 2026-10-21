"use client";

import { useState } from "react";

type UploadKind =
  | "article-thumbnail"
  | "article-content"
  | "client-image"
  | "transaction-image"
  | "avatar";

export function ImageUploadField({
  id,
  label,
  kind,
  onUploaded,
}: {
  id: string;
  label: string;
  kind: UploadKind;
  onUploaded: (url: string) => void;
}) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function upload(file: File | undefined) {
    if (!file) return;
    setStatus("Uploading…");
    setError("");
    const body = new FormData();
    body.append("kind", kind);
    body.append("file", file);
    try {
      const response = await fetch("/api/admin/uploads", { method: "POST", body });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Upload failed.");
      onUploaded(result.url);
      setStatus("Uploaded successfully.");
    } catch (caught) {
      setStatus("");
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-200">{label}</label>
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => void upload(event.target.files?.[0])}
        className="block min-h-11 w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#ffd43b]/15 file:px-3 file:py-2 file:font-semibold file:text-[#ffd43b]"
      />
      {status && <p role="status" className="mb-0 mt-1 text-xs text-green-300">{status}</p>}
      {error && <p role="alert" className="mb-0 mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}
