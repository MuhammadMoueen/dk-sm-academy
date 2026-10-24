import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/db";

export const SOCIAL_PROVIDERS = ["facebook", "tiktok", "youtube", "instagram"] as const;
export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

export const SOCIAL_LABELS: Record<SocialProvider, string> = {
  facebook: "Facebook Page Followers",
  tiktok: "TikTok Followers",
  youtube: "YouTube Subscribers",
  instagram: "Instagram Business Followers",
};

type ConnectionRow = {
  provider: SocialProvider;
  account_id: string;
  account_name: string;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  token_type: string;
  scopes: string[];
  expires_at: Date | null;
  status: "connected" | "expired" | "error" | "revoked";
  last_error: string | null;
  metadata: Record<string, string>;
};

type MetricSnapshot = {
  provider: SocialProvider;
  accountId: string;
  accountName: string;
  count: number;
  observedAt: string;
  snapshotDate: string;
  previousCount?: number;
  status: ConnectionRow["status"];
  lastError?: string;
};

function encryptionKey() {
  const value = process.env.SOCIAL_ANALYTICS_ENCRYPTION_KEY;
  if (!value) throw new Error("SOCIAL_ANALYTICS_ENCRYPTION_KEY is required.");
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) {
    throw new Error("SOCIAL_ANALYTICS_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  }
  return key;
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptSecret(value: string) {
  const [ivValue, tagValue, encryptedValue] = value.split(".");
  if (!ivValue || !tagValue || !encryptedValue) throw new Error("Invalid encrypted social credential.");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(),
    Buffer.from(ivValue, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function configuredProvider(provider: SocialProvider) {
  const required: Record<SocialProvider, string[]> = {
    facebook: ["FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET", "FACEBOOK_OAUTH_REDIRECT_URI"],
    tiktok: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_OAUTH_REDIRECT_URI"],
    youtube: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_OAUTH_REDIRECT_URI"],
    instagram: ["INSTAGRAM_APP_ID", "INSTAGRAM_APP_SECRET", "INSTAGRAM_OAUTH_REDIRECT_URI"],
  };
  return Boolean(process.env.SOCIAL_ANALYTICS_ENCRYPTION_KEY) &&
    required[provider].every((name) => Boolean(process.env[name]));
}

function stateSecret() {
  return createHash("sha256").update(encryptionKey()).digest();
}

export function createOAuthState(provider: SocialProvider) {
  const payload = Buffer.from(JSON.stringify({
    provider,
    nonce: randomBytes(24).toString("base64url"),
    expiresAt: Date.now() + 10 * 60 * 1000,
  })).toString("base64url");
  const signature = createHash("sha256").update(`${payload}.${stateSecret().toString("base64url")}`).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyOAuthState(value: string, provider: SocialProvider) {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = createHash("sha256").update(`${payload}.${stateSecret().toString("base64url")}`).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      provider: SocialProvider;
      expiresAt: number;
    };
    return parsed.provider === provider && parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function saveConnection(connection: {
  provider: SocialProvider;
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  scopes?: string[];
  expiresAt?: Date;
  metadata?: Record<string, string>;
}) {
  await getDb().query(
    `INSERT INTO social_provider_connections
       (provider, account_id, account_name, access_token_encrypted, refresh_token_encrypted,
        token_type, scopes, expires_at, status, last_error, metadata, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'connected', NULL, $9::jsonb, NOW())
     ON CONFLICT (provider) DO UPDATE SET
       account_id = EXCLUDED.account_id,
       account_name = EXCLUDED.account_name,
       access_token_encrypted = EXCLUDED.access_token_encrypted,
       refresh_token_encrypted = EXCLUDED.refresh_token_encrypted,
       token_type = EXCLUDED.token_type,
       scopes = EXCLUDED.scopes,
       expires_at = EXCLUDED.expires_at,
       status = 'connected',
       last_error = NULL,
       metadata = EXCLUDED.metadata,
       updated_at = NOW()`,
    [
      connection.provider,
      connection.accountId,
      connection.accountName,
      encryptSecret(connection.accessToken),
      connection.refreshToken ? encryptSecret(connection.refreshToken) : null,
      connection.tokenType ?? "Bearer",
      connection.scopes ?? [],
      connection.expiresAt ?? null,
      JSON.stringify(connection.metadata ?? {}),
    ],
  );
}

export async function getConnection(provider: SocialProvider) {
  const result = await getDb().query<ConnectionRow>(
    `SELECT provider, account_id, account_name, access_token_encrypted,
            refresh_token_encrypted, token_type, scopes, expires_at, status,
            last_error, metadata
     FROM social_provider_connections WHERE provider = $1`,
    [provider],
  );
  return result.rows[0];
}

export async function deleteConnection(provider: SocialProvider) {
  await getDb().query(
    "DELETE FROM social_provider_connections WHERE provider = $1",
    [provider],
  );
}

export async function recordSocialMetric(
  provider: SocialProvider,
  accountId: string,
  count: number,
  observedAt = new Date(),
) {
  const date = observedAt.toISOString().slice(0, 10);
  await getDb().query(
    `INSERT INTO social_metric_snapshots
       (provider, account_id, metric_date, metric_count, observed_at)
     VALUES ($1, $2, $3::date, $4, $5)
     ON CONFLICT (provider, account_id, metric_date) DO UPDATE SET
       metric_count = EXCLUDED.metric_count,
       observed_at = EXCLUDED.observed_at`,
    [provider, accountId, date, count, observedAt],
  );
}

export async function getSocialMetrics(): Promise<MetricSnapshot[]> {
  const result = await getDb().query<{
    provider: SocialProvider;
    account_id: string;
    account_name: string;
    status: ConnectionRow["status"];
    last_error: string | null;
    metric_count: string | null;
    observed_at: Date | null;
    metric_date: string | null;
    previous_count: string | null;
  }>(
    `SELECT c.provider, c.account_id, c.account_name, c.status, c.last_error,
            latest.metric_count, latest.observed_at, latest.metric_date,
            previous.metric_count AS previous_count
     FROM social_provider_connections c
     LEFT JOIN LATERAL (
       SELECT metric_count, observed_at, metric_date
       FROM social_metric_snapshots
       WHERE provider = c.provider AND account_id = c.account_id
       ORDER BY metric_date DESC LIMIT 1
     ) latest ON TRUE
     LEFT JOIN LATERAL (
       SELECT metric_count
       FROM social_metric_snapshots
       WHERE provider = c.provider AND account_id = c.account_id
       ORDER BY metric_date DESC OFFSET 1 LIMIT 1
     ) previous ON TRUE
     ORDER BY c.provider`,
  );
  const byProvider = new Map(result.rows.map((row) => [row.provider, row]));
  return SOCIAL_PROVIDERS.map((provider) => {
    const row = byProvider.get(provider);
    if (!row) {
      return {
        provider,
        accountId: "",
        accountName: "",
        count: 0,
        observedAt: "",
        snapshotDate: "",
          status: "revoked" as const,
      };
    }
    return {
      provider,
      accountId: row.account_id,
      accountName: row.account_name,
      count: row.metric_count ? Number(row.metric_count) : 0,
      observedAt: row.observed_at?.toISOString() ?? "",
      snapshotDate: row.metric_date ?? "",
      previousCount: row.previous_count ? Number(row.previous_count) : undefined,
      status: row.status,
      lastError: row.last_error ?? undefined,
    };
  });
}

export async function markConnectionError(provider: SocialProvider, message: string, status: ConnectionRow["status"] = "error") {
  await getDb().query(
    `UPDATE social_provider_connections
     SET status = $2, last_error = $3, updated_at = NOW()
     WHERE provider = $1`,
    [provider, status, message.slice(0, 500)],
  );
}

export function accessToken(connection: ConnectionRow) {
  return decryptSecret(connection.access_token_encrypted);
}

export function refreshToken(connection: ConnectionRow) {
  return connection.refresh_token_encrypted
    ? decryptSecret(connection.refresh_token_encrypted)
    : undefined;
}
