import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

const SESSION_DURATION_SECONDS = 60 * 60 * 12;
const MAX_LOGIN_ATTEMPTS = 8;
const LOGIN_WINDOW_MINUTES = 15;
const DUMMY_PASSWORD_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export type AdminAccount = {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string;
};

function sessionCookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Host-admin_session"
    : "admin_session";
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function getSessionCookieName() {
  return sessionCookieName();
}

export async function authenticateAdmin(
  emailInput: string,
  password: string,
  request: Request,
) {
  const email = emailInput.trim().toLowerCase();
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const requestIp = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const bucketHash = sha256(`${email}\0${requestIp}`);
  const db = getDb();

  const rate = await db.query<{ attempts: number }>(
    `INSERT INTO admin_login_attempts (bucket_hash, attempts, window_started_at)
     VALUES ($1, 1, NOW())
     ON CONFLICT (bucket_hash) DO UPDATE
       SET attempts = CASE
             WHEN admin_login_attempts.window_started_at <
                  NOW() - ($2::text || ' minutes')::interval THEN 1
             ELSE admin_login_attempts.attempts + 1
           END,
           window_started_at = CASE
             WHEN admin_login_attempts.window_started_at <
                  NOW() - ($2::text || ' minutes')::interval THEN NOW()
             ELSE admin_login_attempts.window_started_at
           END
     RETURNING attempts`,
    [bucketHash, LOGIN_WINDOW_MINUTES],
  );

  if ((rate.rows[0]?.attempts ?? MAX_LOGIN_ATTEMPTS + 1) > MAX_LOGIN_ATTEMPTS) {
    return { ok: false as const, limited: true as const };
  }

  const accountResult = await db.query<{
    id: number;
    email: string;
    display_name: string;
    avatar_url: string;
    password_hash: string;
  }>(
    `SELECT id, email, display_name, avatar_url, password_hash
     FROM admin_accounts
     WHERE id = 1 AND email = $1`,
    [email],
  );
  const account = accountResult.rows[0];
  const passwordMatches = await bcrypt.compare(
    password,
    account?.password_hash ?? DUMMY_PASSWORD_HASH,
  );

  if (!account || !passwordMatches) {
    return { ok: false as const, limited: false as const };
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  await db.query(
    `INSERT INTO admin_sessions (token_hash, admin_id, expires_at)
     VALUES ($1, $2, $3)`,
    [sha256(token), account.id, expiresAt],
  );
  await db.query(
    "DELETE FROM admin_login_attempts WHERE bucket_hash = $1",
    [bucketHash],
  );

  return {
    ok: true as const,
    token,
    expiresAt,
    account: {
      id: account.id,
      email: account.email,
      displayName: account.display_name,
      avatarUrl: account.avatar_url,
    } satisfies AdminAccount,
  };
}

export async function getAdminSession(): Promise<AdminAccount | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  if (!token) return null;

  const result = await getDb().query<{
    id: number;
    email: string;
    display_name: string;
    avatar_url: string;
  }>(
    `SELECT account.id, account.email, account.display_name, account.avatar_url
     FROM admin_sessions AS session
     JOIN admin_accounts AS account ON account.id = session.admin_id
     WHERE session.token_hash = $1 AND session.expires_at > NOW()`,
    [sha256(token)],
  );
  const account = result.rows[0];
  if (!account) {
    cookieStore.delete(sessionCookieName());
    return null;
  }

  return {
    id: account.id,
    email: account.email,
    displayName: account.display_name,
    avatarUrl: account.avatar_url,
  };
}

export async function requireAdmin() {
  const account = await getAdminSession();
  if (!account) redirect("/admin/login");
  return account;
}

export async function invalidateAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  if (token) {
    await getDb().query("DELETE FROM admin_sessions WHERE token_hash = $1", [
      sha256(token),
    ]);
  }
  cookieStore.delete(sessionCookieName());
}

export function setSessionCookie(
  response: Response,
  token: string,
  expiresAt: Date,
) {
  const secure = process.env.NODE_ENV === "production";
  const name = sessionCookieName();
  const cookie = [
    `${name}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${expiresAt.toUTCString()}`,
    `Max-Age=${SESSION_DURATION_SECONDS}`,
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
  response.headers.append("Set-Cookie", cookie);
}

export function clearSessionCookie(response: Response) {
  const secure = process.env.NODE_ENV === "production";
  const cookie = [
    `${sessionCookieName()}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Max-Age=0",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
  response.headers.append("Set-Cookie", cookie);
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function recordAdminActivity({
  actorId,
  entityType,
  entityId,
  action,
  summary,
}: {
  actorId: number;
  entityType: "article" | "portfolio";
  entityId: string;
  action: "created" | "updated" | "published" | "unpublished" | "deleted";
  summary: string;
}) {
  await getDb().query(
    `INSERT INTO admin_activity (actor_id, entity_type, entity_id, action, summary)
     VALUES ($1, $2, $3, $4, $5)`,
    [actorId, entityType, entityId, action, summary.slice(0, 240)],
  );
}
