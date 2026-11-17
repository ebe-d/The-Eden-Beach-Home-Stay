"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AdminAuthSetupAlert({ reason }: { reason?: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/50 dark:text-amber-100">
      <div className="font-bold">Environment Setup Required</div>
      <p className="mt-1">{reason}</p>
      <p className="mt-2 font-mono text-[11px]">
        Set ADMIN_SESSION_SECRET, ADMIN_USERNAME, and ADMIN_PASSWORD_HASH (or
        ADMIN_PASSWORD) in .env.local.
      </p>
    </div>
  );
}

export function AdminLoginClient({
  authBanner,
}: {
  authBanner?: ReactNode;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("owner");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error while signing in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md rounded-[32px] p-7 sm:p-9">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-eden-muted transition hover:text-eden-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Public Website
          </Link>
          <ThemeToggle />
        </div>

        <div className="mt-6 flex items-center gap-3.5 border-b border-eden-line/60 pb-5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-[#C5A059]/40 shadow-md bg-[#070D18]">
            <Image
              src="/brand/eden-emblem.png"
              alt="The Eden Beach Homestay"
              width={48}
              height={48}
              className="h-full w-full object-contain p-1"
              priority
            />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-eden-ink">
              Owner Admin Sign In
            </h1>
            <p className="text-xs text-[#C5A059] font-medium uppercase tracking-wider">
              The Eden • Beach Home Stay
            </p>
          </div>
        </div>

        {authBanner}

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2 rounded-2xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-900 dark:border-rose-700/60 dark:bg-rose-950/50 dark:text-rose-100"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-username"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
            >
              Owner Username
            </label>
            <input
              id="admin-username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-eden-soft"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-eden-line bg-eden-input px-4 py-2.5 text-sm text-eden-ink outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/35"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-eden-btn px-5 py-3 text-sm font-semibold text-eden-btn-ink transition hover:bg-eden-btn-hover disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

