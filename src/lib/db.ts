import "server-only";

import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  academyPool?: Pool;
};

export function getDb() {
  if (globalForPg.academyPool) return globalForPg.academyPool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required for database-backed site content and admin access.",
    );
  }

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

  globalForPg.academyPool = pool;
  return pool;
}
