import { NextResponse } from "next/server";
import {
  authenticateAdmin,
  clearSessionCookie,
  hasSameOrigin,
  invalidateAdminSession,
  setSessionCookie,
} from "@/lib/auth";
import { jsonError } from "@/lib/admin-api";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid login and password." },
      { status: 400 },
    );
  }

  try {
    const result = await authenticateAdmin(
      parsed.data.email,
      parsed.data.password,
      request,
    );
    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.limited
            ? "Unable to sign in right now. Try again later."
            : "Unable to sign in with those details.",
        },
        { status: result.limited ? 429 : 401 },
      );
    }

    const response = NextResponse.json({ account: result.account });
    setSessionCookie(response, result.token, result.expiresAt);
    return response;
  } catch (error) {
    return jsonError(error, "Sign-in is temporarily unavailable.");
  }
}

export async function DELETE(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "Request origin rejected." }, { status: 403 });
  }
  try {
    await invalidateAdminSession();
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    return jsonError(error, "Sign-out could not be completed.");
  }
}
