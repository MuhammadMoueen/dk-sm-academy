import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { requireApiAdmin, jsonError, validationError } from "@/lib/admin-api";
import { getDb } from "@/lib/db";
import { passwordChangeSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = passwordChangeSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);

  try {
    const db = getDb();
    const { rows } = await db.query<{ password_hash: string }>(
      "SELECT password_hash FROM admin_accounts WHERE id = $1",
      [auth.account.id],
    );
    const account = rows[0];
    if (
      !account ||
      !(await bcrypt.compare(parsed.data.currentPassword, account.password_hash))
    ) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );
    }
    const hash = await bcrypt.hash(parsed.data.newPassword, 12);
    await db.query(
      "UPDATE admin_accounts SET password_hash = $2, updated_at = NOW() WHERE id = $1",
      [auth.account.id, hash],
    );
    await db.query("DELETE FROM admin_sessions WHERE admin_id = $1", [
      auth.account.id,
    ]);
    const response = NextResponse.json({ ok: true, signInAgain: true });
    response.cookies.delete(
      process.env.NODE_ENV === "production"
        ? "__Host-admin_session"
        : "admin_session",
    );
    return response;
  } catch (error) {
    return jsonError(error, "Password could not be changed.");
  }
}
