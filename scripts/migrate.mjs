import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { Pool } = require("pg");
const migrationsDirectory = fileURLToPath(
  new URL("../migrations/", import.meta.url),
);

if (!process.env.DATABASE_URL) {
  throw new Error("Set DATABASE_URL in .env.local before running migrations.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(73194102)");
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = (await readdir(migrationsDirectory))
      .filter((name) => /^\d+_[a-z0-9_-]+\.sql$/.test(name))
      .sort((first, second) => first.localeCompare(second));

    for (const name of files) {
      const { rowCount } = await client.query(
        "SELECT 1 FROM schema_migrations WHERE name = $1",
        [name],
      );
      if (rowCount) {
        console.log(`Already applied: ${name}`);
        continue;
      }

      const sql = await readFile(path.join(migrationsDirectory, name), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations(name) VALUES ($1)", [
          name,
        ]);
        await client.query("COMMIT");
        console.log(`Applied: ${name}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
    await client.query("SELECT pg_advisory_unlock(73194102)");
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
