"use client";

import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import NextImage from "next/image";

const MAX_BYTES = 8 * 1024 * 1024;

export function ProfileImageEditor({
  onSaved,
}: {
  onSaved: (url: string) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);

  useEffect(() => () => {
    if (source) URL.revokeObjectURL(source);
  }, [source]);

  function choose(next: File | undefined) {
    if (!next) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(next.type) || next.size > MAX_BYTES) {
      setError("Choose a PNG, JPEG, or WebP image smaller than 8 MB.");
      return;
    }

    setError("");
    setStatus("");
    setFile(next);
    setSource(URL.createObjectURL(next));
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
  }

  function clampOffset(value: number, zoomValue: number) {
    const limit = 128 * Math.max(0, zoomValue - 1);
    return Math.max(-limit, Math.min(limit, value));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      pinchRef.current = {
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        zoom,
      };
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointersRef.current.get(event.pointerId);
    if (!previous) return;
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [first, second] = Array.from(pointersRef.current.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const nextZoom = Math.max(1, Math.min(3, pinchRef.current.zoom * (distance / pinchRef.current.distance)));
      setZoom(nextZoom);
      setOffsetX((value) => clampOffset(value, nextZoom));
      setOffsetY((value) => clampOffset(value, nextZoom));
      return;
    }
    setOffsetX((value) => clampOffset(value + event.clientX - previous.x, zoom));
    setOffsetY((value) => clampOffset(value + event.clientY - previous.y, zoom));
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(event.pointerId);
    pinchRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const nextZoom = Math.max(1, Math.min(3, zoom - event.deltaY * 0.002));
    setZoom(nextZoom);
    setOffsetX((value) => clampOffset(value, nextZoom));
    setOffsetY((value) => clampOffset(value, nextZoom));
  }

  async function apply() {
    if (!file || !source || saving) return;
    setSaving(true);
    setError("");
    setStatus("Preparing image…");
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const loaded = new Image();
        loaded.onload = () => resolve(loaded);
        loaded.onerror = () => reject(new Error("The image could not be read."));
        loaded.src = source;
      });
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image editing is unavailable in this browser.");
      context.fillStyle = "#090909";
      context.fillRect(0, 0, size, size);
      context.translate(size / 2 + offsetX * 2, size / 2 + offsetY * 2);
      context.rotate((rotation * Math.PI) / 180);
      const scale = Math.max(size / image.naturalWidth, size / image.naturalHeight) * zoom;
      context.drawImage(
        image,
        -(image.naturalWidth * scale) / 2,
        -(image.naturalHeight * scale) / 2,
        image.naturalWidth * scale,
        image.naturalHeight * scale,
      );
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("The edited image could not be created.");
      const body = new FormData();
      body.append("kind", "avatar");
      body.append("file", new File([blob], `${file.name.replace(/\.[^.]+$/, "")}-avatar.jpg`, { type: "image/jpeg" }));
      const response = await fetch("/api/admin/uploads", { method: "POST", body });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Avatar upload failed.");
      await onSaved(result.url);
      setStatus("Profile image updated.");
      setFile(null);
      setSource("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Avatar update failed.");
      setStatus("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor="admin-avatar-file" className="mb-1.5 block text-sm font-semibold text-gray-200">Profile picture</label>
      <input
        ref={inputRef}
        id="admin-avatar-file"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => choose(event.target.files?.[0])}
        className="block min-h-11 w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#ffd43b]/15 file:px-3 file:py-2 file:font-semibold file:text-[#ffd43b]"
      />
      {file && (
        <div role="dialog" aria-modal="true" aria-labelledby="profile-image-editor-title" className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-xl border border-[#ffd43b]/35 bg-[#090909] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.8)] sm:p-6">
          <p id="profile-image-editor-title" className="mb-3 text-sm font-semibold text-white">Edit profile image</p>
          <div
            className="mx-auto grid h-64 w-64 touch-none select-none place-items-center overflow-hidden rounded-full border-2 border-[#ffd43b] bg-black cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onWheel={handleWheel}
            aria-label="Drag image to reposition. Use the wheel or pinch to zoom."
          >
            <NextImage
              src={source}
              alt="Profile crop preview"
              width={512}
              height={512}
              unoptimized
              draggable={false}
              className="pointer-events-none h-full w-full object-cover"
              style={{ transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom}) rotate(${rotation}deg)` }}
            />
          </div>
          <label className="mt-4 block text-xs text-gray-300">Zoom
            <input aria-label="Zoom" type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => {
              const nextZoom = Number(event.target.value);
              setZoom(nextZoom);
              setOffsetX((value) => clampOffset(value, nextZoom));
              setOffsetY((value) => clampOffset(value, nextZoom));
            }} className="mt-2 w-full accent-[#ffd43b]" />
          </label>
          <p className="mb-0 mt-2 text-center text-xs text-gray-500">Drag to reposition · Scroll or pinch to zoom</p>
          <label className="mt-3 block text-xs text-gray-300">Rotate
            <input aria-label="Rotation" type="range" min="-180" max="180" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} className="mt-2 w-full accent-[#ffd43b]" />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="min-h-10 rounded-lg border border-white/20 px-3 text-sm font-semibold text-gray-200 hover:border-[#ffd43b]">Choose different</button>
            <button type="button" onClick={() => { setFile(null); setSource(""); if (inputRef.current) inputRef.current.value = ""; }} className="min-h-10 rounded-lg border border-white/20 px-3 text-sm font-semibold text-gray-200 hover:border-[#ffd43b]">Cancel</button>
            <button type="button" disabled={saving} onClick={() => void apply()} className="btn-primary min-h-10 disabled:opacity-50">{saving ? "Saving…" : "Apply image"}</button>
          </div>
          </div>
        </div>
      )}
      {status && <p role="status" className="text-xs text-green-300">{status}</p>}
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
