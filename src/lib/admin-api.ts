import "server-only";

import { NextResponse } from "next/server";
import { getAdminSession, hasSameOrigin } from "@/lib/auth";

export async function requireApiAdmin(request: Request) {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(request.method.toUpperCase()) &&
    !hasSameOrigin(request)
  ) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Request origin rejected." }, { status: 403 }),
    };
  }

  const account = await getAdminSession();
  if (!account) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }
  return { ok: true as const, account };
}

export function jsonError(error: unknown, message = "Request could not be completed.") {
  console.error("Admin API request failed:", error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export function validationError(issues: { path: PropertyKey[]; message: string }[]) {
  return NextResponse.json(
    {
      error: "Please check the submitted fields.",
      fields: Object.fromEntries(
        issues.map((issue) => [issue.path.join(".") || "form", issue.message]),
      ),
    },
    { status: 400 },
  );
}
