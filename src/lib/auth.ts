import crypto from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { adminUsers } from "@/db/schema";

export const ADMIN_COOKIE_NAME = "eden_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export function hashPasswordScrypt(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function isValidScryptHash(storedHash: string): boolean {
  const parts = storedHash.trim().split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hexDigest] = parts;
  return Boolean(
    salt &&
      hexDigest &&
      /^[0-9a-f]+$/i.test(salt) &&
      /^[0-9a-f]+$/i.test(hexDigest) &&
      hexDigest.length % 2 === 0 &&
      hexDigest.length >= 64
  );
}

export function verifyPasswordScrypt(password: string, storedHash: string): boolean {
  const trimmed = storedHash.trim();
  if (!isValidScryptHash(trimmed)) return false;
  const [, salt, hexDigest] = trimmed.split(":");
  const expected = Buffer.from(hexDigest, "hex");
  const actual = crypto.scryptSync(password, salt, 64);
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

export function shouldUseSecureCookie(request: Request): boolean {
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  if (forwardedProto) {
    return forwardedProto === "https";
  }
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}

function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret && secret.length >= 16) return secret;
  // Fallback safely to a deterministic session secret derived from credentials if hosting provider strips ADMIN_SESSION_SECRET
  const fallbackSource = process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD || process.env.DATABASE_URL;
  if (fallbackSource && fallbackSource.length >= 8) {
    return crypto.createHash("sha256").update(`eden_admin_session_${fallbackSource}`).digest("hex");
  }
  return null;
}

export function isAdminAuthConfigured(): {
  configured: boolean;
  reason?: string;
} {
  if (!getSessionSecret()) {
    return {
      configured: false,
      reason:
        "ADMIN_SESSION_SECRET is missing or too short (minimum 16 characters) in environment variables.",
    };
  }
  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const hasValidEnvHash = Boolean(envHash && isValidScryptHash(envHash));
  const hasEnvPassword = Boolean(process.env.ADMIN_PASSWORD?.length);

  if (envHash && !hasValidEnvHash && !hasEnvPassword && !isDatabaseConfigured()) {
    return {
      configured: false,
      reason:
        'ADMIN_PASSWORD_HASH must use scrypt format (run "npm run admin:hash -- your-password"), or clear it and set ADMIN_PASSWORD.',
    };
  }

  if (!hasValidEnvHash && !hasEnvPassword && !isDatabaseConfigured()) {
    return {
      configured: false,
      reason:
        "Set ADMIN_PASSWORD_HASH or ADMIN_PASSWORD (and DATABASE_URL) in environment variables.",
    };
  }
  return { configured: true };
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<{ ok: boolean; reason?: string }> {
  const authStatus = isAdminAuthConfigured();
  if (!authStatus.configured) {
    return { ok: false, reason: authStatus.reason };
  }

  const normalizedInput = username.trim().toLowerCase();

  // 1. Check PostgreSQL admin_users table when DB is configured
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [user] = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.username, normalizedInput))
        .limit(1);
      if (user && verifyPasswordScrypt(password, user.passwordHash)) {
        return { ok: true };
      }
    } catch {
      // Table may not be migrated yet; fall through to env credentials check
    }
  }

  // 2. Check environment-configured owner credentials
  const envUsername = (process.env.ADMIN_USERNAME?.trim() || "owner").toLowerCase();
  const usernameMatch = safeStringEqual(normalizedInput, envUsername);
  if (!usernameMatch) {
    return { ok: false, reason: "Invalid username or password." };
  }

  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (envHash && isValidScryptHash(envHash)) {
    return verifyPasswordScrypt(password, envHash)
      ? { ok: true }
      : { ok: false, reason: "Invalid username or password." };
  }

  const envPass = process.env.ADMIN_PASSWORD;
  if (envPass && envPass.length > 0 && safeStringEqual(password, envPass)) {
    return { ok: true };
  }

  if (envHash && !isValidScryptHash(envHash) && !(envPass && envPass.length > 0)) {
    return {
      ok: false,
      reason:
        'ADMIN_PASSWORD_HASH is not in scrypt format ("scrypt:..."). Generate one with `npm run admin:hash -- "your-password"` or clear it and set ADMIN_PASSWORD.',
    };
  }

  return { ok: false, reason: "Invalid username or password." };
}

function safeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function createSessionToken(username: string): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(
    JSON.stringify({ sub: username.trim().toLowerCase(), exp })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): {
  valid: boolean;
  username?: string;
} {
  if (!token) return { valid: false };
  const secret = getSessionSecret();
  if (!secret) return { valid: false };

  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };
  const [payload, sig] = parts;
  if (!payload || !sig) return { valid: false };

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  if (!safeStringEqual(sig, expectedSig)) {
    return { valid: false };
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { sub?: string; exp?: number };
    if (!parsed.sub || typeof parsed.exp !== "number") {
      return { valid: false };
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }
    return { valid: true, username: parsed.sub };
  } catch {
    return { valid: false };
  }
}

export async function getAdminSession(): Promise<{
  authenticated: boolean;
  username?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const verified = verifySessionToken(token);
  if (!verified.valid) {
    return { authenticated: false };
  }
  return { authenticated: true, username: verified.username };
}

