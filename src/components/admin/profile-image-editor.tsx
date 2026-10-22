"use client";

import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";

const MAX_BYTES = 8 * 1024 * 1024;
const FRAME = 256;
const OUTPUT = 512;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Point = { x: number; y: number };

export function ProfileImageEditor({
  onSaved,
}: {
  onSaved: (url: string) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

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
      return;
    }

    if (next.size > MAX_BYTES) {
      setError("Image must be smaller than 8 MB.");
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

    if (inputRef.current) inputRef.current.value = "";
  }

  const baseScale = dimensions.width && dimensions.height
    ? Math.max(FRAME / dimensions.width, FRAME / dimensions.height)
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
      x: Math.max(-Math.max(0, (width - FRAME) / 2), Math.min(Math.max(0, (width - FRAME) / 2), nextX)),
      y: Math.max(-Math.max(0, (height - FRAME) / 2), Math.min(Math.max(0, (height - FRAME) / 2), nextY)),
    };
  }

  function changeZoom(value: number) {
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
    const next = clampPosition(x, y, nextZoom);
    setZoom(nextZoom);
    setX(next.x);
    setY(next.y);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (saving) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

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

    const next = clampPosition(x + current.x - previous.x, y + current.y - previous.y);
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

  function rotateImage() {
    const nextRotation = (rotation + 90) % 360;
    setRotation(nextRotation);

    const next = clampPosition(x, y, zoom);
    setX(next.x);
    setY(next.y);
  }

  function cancel() {
    if (saving) return;
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

  async function apply() {
    if (!file || !source || !dimensions.width || saving) return;

    setSaving(true);
    setError("");
    setStatus("Preparing cropped image…");

    try {
      const image = imageRef.current;
      if (!image) throw new Error("Image preview is not ready.");

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT;
      canvas.height = OUTPUT;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable in this browser.");

      context.fillStyle = "#090909";
      context.fillRect(0, 0, OUTPUT, OUTPUT);

      const scale = Math.max(OUTPUT / image.naturalWidth, OUTPUT / image.naturalHeight) * zoom;

      context.save();
      context.translate(OUTPUT / 2 + x * OUTPUT / FRAME, OUTPUT / 2 + y * OUTPUT / FRAME);
      context.rotate((rotation * Math.PI) / 180);
      context.drawImage(
        image,
        -(image.naturalWidth * scale) / 2,
        -(image.naturalHeight * scale) / 2,
        image.naturalWidth * scale,
        image.naturalHeight * scale,
      );
      context.restore();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.92),
      );

      if (!blob) throw new Error("Could not generate the cropped image.");

      setStatus("Uploading profile picture…");

      const body = new FormData();
      body.append("kind", "avatar");
      body.append(
        "file",
        new File([blob], "profile-avatar.jpg", { type: "image/jpeg" }),
      );

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body,
      });

      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Image upload failed.");
      }

      setStatus("Saving profile picture…");
      await onSaved(result.url);

      setStatus("Profile picture updated.");
      setFile(null);
      clearSource();
      setZoom(1);
      setX(0);
      setY(0);
      setRotation(0);
      if (inputRef.current) inputRef.current.value = "";
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save image.");
      setStatus("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor="admin-avatar-file" className="block text-sm font-semibold text-gray-200">
        Profile picture
      </label>

      <input
        ref={inputRef}
        id="admin-avatar-file"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={saving}
        onChange={(event) => choose(event.target.files?.[0])}
        className="block min-h-11 w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#ffd43b]/15 file:px-3 file:py-2 file:font-semibold file:text-[#ffd43b]"
      />

      {file && source && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-image-title"
            className="w-full max-w-md rounded-2xl border border-[#ffd43b]/35 bg-[#090909] p-4 shadow-2xl sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="profile-image-title" className="text-base font-semibold text-white">
                Edit <span className="text-[#ffd43b]">profile image</span>
              </h2>
              <button type="button" onClick={cancel} disabled={saving} aria-label="Close editor" className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <p className="mb-4 text-xs text-gray-400">
              Drag the photo with your mouse or finger. Use the wheel or pinch to zoom.
            </p>

            <div
              className="mx-auto h-64 w-64 touch-none select-none overflow-hidden rounded-full border-2 border-[#ffd43b] bg-black cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onWheel={handleWheel}
            >
              <img
                ref={imageRef}
                src={source}
                alt="Profile crop preview"
                draggable={false}
                onLoad={(event) => setDimensions({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })}
                className="pointer-events-none block max-w-none"
                style={{
                  width: imageWidth || "100%",
                  height: imageHeight || "100%",
                  position: "relative",
                  left: "50%",
                  top: "50%",
                  marginLeft: -(imageWidth || FRAME) / 2,
                  marginTop: -(imageHeight || FRAME) / 2,
                  transform: `translate(${x}px, ${y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-300">Zoom</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => changeZoom(zoom - 0.25)} disabled={zoom <= MIN_ZOOM} className="h-9 w-9 rounded-lg border border-white/20 text-lg text-white disabled:opacity-40" aria-label="Zoom out">−</button>
                <button type="button" onClick={() => changeZoom(zoom + 0.25)} disabled={zoom >= MAX_ZOOM} className="h-9 w-9 rounded-lg border border-white/20 text-lg text-white disabled:opacity-40" aria-label="Zoom in">+</button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-300">Rotate</span>
              <button type="button" onClick={rotateImage} className="flex min-h-10 items-center gap-2 rounded-lg border border-white/20 px-3 text-sm font-semibold text-gray-200 hover:border-[#ffd43b] hover:text-[#ffd43b]" aria-label="Rotate image 90 degrees">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20 7v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 12a8 8 0 1 0 2 5" strokeLinecap="round" />
                </svg>
                Rotate 90°
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button type="button" onClick={() => inputRef.current?.click()} disabled={saving} className="min-h-11 rounded-lg border border-white/20 px-2 text-sm font-semibold text-gray-200 hover:border-[#ffd43b] disabled:opacity-50">
                Choose different
              </button>
              <button type="button" onClick={cancel} disabled={saving} className="min-h-11 rounded-lg border border-white/20 px-3 text-sm font-semibold text-gray-200 hover:border-[#ffd43b] disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={() => void apply()} disabled={saving || !dimensions.width} className="btn-primary col-span-2 min-h-11 disabled:opacity-50 sm:col-span-1">
                {saving ? "Saving…" : "Apply image"}
              </button>
            </div>

            {status && <p role="status" className="mb-0 mt-3 text-xs text-[#ffd43b]">{status}</p>}
            {error && <p role="alert" className="mb-0 mt-3 text-xs text-red-300">{error}</p>}
          </section>
        </div>
      )}

      {!file && status && <p role="status" className="text-xs text-green-300">{status}</p>}
      {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
      <p className="text-xs text-gray-500">JPG, PNG, or WebP · Maximum 8 MB</p>
    </div>
  );
}
