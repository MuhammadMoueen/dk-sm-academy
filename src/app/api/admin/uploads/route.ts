import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireApiAdmin, jsonError } from "@/lib/admin-api";
import { uploadImage } from "@/lib/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024;
const kinds = {
  "article-thumbnail": "articles/thumbnails",
  "article-content": "articles/content",
  "client-image": "portfolio/clients",
  "transaction-image": "portfolio/transactions",
  avatar: "admin/avatars",
} as const;

type UploadKind = keyof typeof kinds;

function detectedType(buffer: Buffer) {
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return "image/jpeg";
  if (buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP") return "image/webp";
  return null;
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const form = await request.formData();
    const kindValue = form.get("kind");
    const file = form.get("file");
    if (
      typeof kindValue !== "string" ||
      !(kindValue in kinds) ||
      !(file instanceof File)
    ) {
      return NextResponse.json({ error: "A valid image and upload type are required." }, { status: 400 });
    }
    if (file.size < 1 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Images must be smaller than 8 MB." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = detectedType(buffer);
    if (!type || !["image/png", "image/jpeg", "image/webp"].includes(type)) {
      return NextResponse.json({ error: "Only PNG, JPEG, and WebP images are supported." }, { status: 400 });
    }
    const kind = kindValue as UploadKind;
    const result = await uploadImage(buffer, kinds[kind], `${auth.account.id}-${randomUUID()}`);
    return NextResponse.json({ url: result.secureUrl, type });
  } catch (error) {
    return jsonError(error, "Image upload could not be completed.");
  }
}
