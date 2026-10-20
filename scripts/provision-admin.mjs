import { createInterface } from "node:readline";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

if (!process.env.DATABASE_URL) {
  throw new Error("Set DATABASE_URL in .env.local before provisioning admin.");
}

function prompt(label) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  return new Promise((resolve) =>
    readline.question(label, (answer) => {
      readline.close();
      resolve(answer.trim());
    }),
  );
}

function promptSecret(label) {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    const output = process.stdout;
    if (!input.isTTY || typeof input.setRawMode !== "function") {
      reject(new Error("Run this command from an interactive terminal."));
      return;
    }

    output.write(label);
    input.setRawMode(true);
    input.resume();
    let value = "";
    const finish = (error) => {
      input.setRawMode(false);
      input.pause();
      input.removeListener("data", onData);
      output.write("\n");
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") {
          finish(new Error("Admin provisioning cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u0008" || character === "\u007f") {
          value = value.slice(0, -1);
          continue;
        }
        value += character;
      }
    };
    input.on("data", onData);
  });
}

const email = (await prompt("Admin email: ")).toLowerCase();
const displayName = await prompt("Display name: ");
const password = await promptSecret("Initial password (input hidden): ");

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error("Enter a valid admin email address.");
}
if (displayName.length < 1 || displayName.length > 100) {
  throw new Error("Display name must contain 1–100 characters.");
}
if (password.length < 12 || password.length > 128) {
  throw new Error("Password must contain 12–128 characters.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO admin_accounts (id, email, display_name, password_hash)
     VALUES (1, $1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [email, displayName, passwordHash],
  );
  if (result.rowCount !== 1) {
    throw new Error(
      "An admin account already exists. Provisioning never overwrites it.",
    );
  }
  console.log("The single admin account was provisioned.");
} finally {
  await pool.end();
}
