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
      if (!response.ok) throw new Error(result.error ?? "Unable to sign in.");
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-gray-200">
          Administrator email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          className="min-h-12 w-full rounded-lg border border-white/15 bg-[#090909] px-4 text-white outline-none transition focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/20"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-gray-200">
          Password
        </label>
        <div className="flex min-h-12 overflow-hidden rounded-lg border border-white/15 bg-[#090909] focus-within:border-[#ffd43b] focus-within:ring-2 focus-within:ring-[#ffd43b]/20">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={128}
            className="min-w-0 flex-1 bg-transparent px-4 text-white outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="px-4 text-sm font-semibold text-[#ffd43b] hover:text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ffd43b]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="mb-0 rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary min-h-12 w-full disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
