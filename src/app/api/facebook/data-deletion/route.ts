import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { deleteConnection } from "@/features/social-analytics/social-analytics";

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url");
}

function verifySignedRequest(value: string, appSecret: string) {
  const [encodedSignature, encodedPayload] = value.split(".");
  if (!encodedSignature || !encodedPayload) return false;

  const signature = decodeBase64Url(encodedSignature);
  const expected = createHmac("sha256", appSecret)
    .update(encodedPayload)
    .digest();
  return signature.length === expected.length && timingSafeEqual(signature, expected);
}

export async function POST(request: Request) {
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appSecret) {
    return NextResponse.json({ error: "Facebook data deletion is not configured." }, { status: 503 });
  }

  const form = await request.formData();
  const signedRequest = form.get("signed_request");
  if (typeof signedRequest !== "string" || !verifySignedRequest(signedRequest, appSecret)) {
    return NextResponse.json({ error: "Invalid data deletion request." }, { status: 400 });
  }

  const confirmationCode = randomBytes(16).toString("hex");
  try {
    await deleteConnection("facebook");
  } catch {
    return NextResponse.json({ error: "Data deletion could not be completed." }, { status: 500 });
  }

  const statusUrl = new URL("/data-deletion", request.url);
  statusUrl.searchParams.set("code", confirmationCode);
  return NextResponse.json({
    url: statusUrl.toString(),
    confirmation_code: confirmationCode,
  });
}
