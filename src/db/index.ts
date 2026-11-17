import dns from "node:dns";
import net from "node:net";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Avoid Node 22's 250ms Happy Eyeballs timeout failing high-RTT cloud Postgres connections
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamilyAttemptTimeout(5000);

declare global {
  var __edenPgPool: Pool | undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);
}

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.__edenPgPool) {
    const needsSsl =
      connectionString.includes("sslmode=require") ||
      connectionString.includes(".neon.tech") ||
      connectionString.includes(".supabase.co") ||
      process.env.PGSSLMODE === "require";

    globalThis.__edenPgPool = new Pool({
      connectionString,
      max: 10,
      connectionTimeoutMillis: 4000,
      ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    });
  }

  return globalThis.__edenPgPool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}
