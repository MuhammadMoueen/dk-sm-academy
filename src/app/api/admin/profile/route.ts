import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireApiAdmin, jsonError, validationError } from "@/lib/admin-api";
import { getDb } from "@/lib/db";
import { profileSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json({ account: auth.account });
}

export async function PUT(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);
  try {
    const { rows } = await getDb().query<{
      id: number;
      email: string;
      display_name: string;
      avatar_url: string;
    }>(
      `UPDATE admin_accounts
       SET display_name = $2, avatar_url = $3, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, display_name, avatar_url`,
      [auth.account.id, parsed.data.displayName, parsed.data.avatarUrl],
    );
    const account = rows[0];
    if (!account) {
      return NextResponse.json({ error: "Admin account not found." }, { status: 404 });
    }
    revalidatePath("/admin", "layout");
    return NextResponse.json({
      account: {
        id: account.id,
        email: account.email,
        displayName: account.display_name,
        avatarUrl: account.avatar_url,
      },
    });
  } catch (error) {
    return jsonError(error, "Profile could not be updated.");
  }
}
