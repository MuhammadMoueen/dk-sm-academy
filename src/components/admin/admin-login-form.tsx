"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to sign in.");
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Unable to sign in."
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="admin-email"
          className="sr-only"
        >
          Administrator email
        </label>

        <div className="admin-login-field flex min-h-[54px] items-center gap-3 rounded-xl border border-[#d49f14]/75 bg-black/65 px-3.5 transition duration-200 focus-within:border-[#ffd43b] focus-within:ring-2 focus-within:ring-[#ffd43b]/25">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 shrink-0 text-[#ffd43b]"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m4 7 8 6 8-6" />
          </svg>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            maxLength={254}
            placeholder="Administrator email"
            className="min-w-0 min-h-[50px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="sr-only"
        >
          Password
        </label>

        <div className="admin-login-field flex min-h-[54px] items-center gap-3 overflow-hidden rounded-xl border border-[#d49f14]/75 bg-black/65 px-3.5 transition duration-200 focus-within:border-[#ffd43b] focus-within:ring-2 focus-within:ring-[#ffd43b]/25">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 shrink-0 text-[#ffd43b]"
          >
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3" />
          </svg>
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={128}
            placeholder="Enter your password"
            className="min-w-0 min-h-[50px] flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="min-h-11 shrink-0 px-1 text-sm font-semibold text-[#ffd43b] transition-colors hover:text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ffd43b]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-0 rounded-xl border border-red-400/25 bg-red-500/10 p-3 text-sm leading-relaxed text-red-200"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group relative inline-flex min-h-[54px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#ffd43b] px-5 py-3 font-bold text-black shadow-[0_0_22px_rgba(255,212,59,0.18)] transition duration-300 hover:bg-[#ffe16a] hover:shadow-[0_0_30px_rgba(255,212,59,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010] disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden" />
        <span className="relative">
          {pending ? "Signing in…" : "Sign in"}
        </span>
        {!pending && (
          <span aria-hidden="true" className="relative text-lg">
            →
          </span>
        )}
      </button>

      <p className="mb-0 text-center text-xs leading-relaxed text-gray-500">
        Secure administrator access · DK &amp; SM Academy
      </p>
    </form>
  );
}