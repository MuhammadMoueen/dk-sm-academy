import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { recordVisitorVisit } from "@/features/analytics/analytics";

const VISITOR_COOKIE = "dk_sm_visitor_day";
const DAY_SECONDS = 60 * 60 * 24;

function cookieSecret() {
  const secret = process.env.ANALYTICS_COOKIE_SECRET;
  if (!secret) throw new Error("ANALYTICS_COOKIE_SECRET is required.");
  return secret;
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function signedDay(day: string, nonce: string) {
  return `${day}.${nonce}.${createHmac("sha256", cookieSecret())
    .update(`${day}.${nonce}`)
    .digest("base64url")}`;
}

function validCookie(value: string | undefined, day: string) {
  if (!value) return false;
  const [cookieDay, nonce, signature] = value.split(".");
  if (!cookieDay || !nonce || !signature || cookieDay !== day) return false;
  const expected = createHmac("sha256", cookieSecret())
    .update(`${cookieDay}.${nonce}`)
    .digest("base64url");
  const received = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return (
    received.length === expectedBuffer.length &&
    timingSafeEqual(received, expectedBuffer)
  );
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    if (!origin || !host || new URL(origin).host !== host) {
      return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  }

  let path = "/";
  try {
    const body = (await request.json()) as { path?: unknown };
    if (typeof body.path === "string") path = body.path;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.startsWith("/admin") ||
    path.startsWith("/api")
  ) {
    return NextResponse.json({ ok: true });
  }

  const day = todayUtc();
  try {
    if (validCookie(request.headers.get("cookie")?.match(
      new RegExp(`(?:^|;\\s*)${VISITOR_COOKIE}=([^;]+)`),
    )?.[1], day)) {
      return NextResponse.json({ ok: true });
    }

    await recordVisitorVisit(day);
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: VISITOR_COOKIE,
      value: signedDay(day, randomBytes(12).toString("base64url")),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DAY_SECONDS,
    });
    return response;
  } catch (error) {
    console.error("Visitor analytics request failed.", error);
    return NextResponse.json({ error: "Visitor analytics is unavailable." }, { status: 503 });
  }
}
