"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/15 bg-[#090909] px-3 pr-16 text-white outline-none transition focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/20";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-200";

export function AdminPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const result = (await response.json()) as {
        error?: string;
        fields?: Record<string, string>;
        signInAgain?: boolean;
      };
      if (!response.ok) {
        const details = Object.values(result.fields ?? {}).join(" ");
        throw new Error(details || result.error || "Password could not be changed.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice("Password changed. Sign in again with your new password.");
      if (result.signInAgain) {
        window.setTimeout(() => {
          router.replace("/admin/login");
          router.refresh();
        }, 1200);
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Password could not be changed.",
      );
      setSaving(false);
    }
  }

  function passwordField(
    id: string,
    label: string,
    value: string,
    setValue: (value: string) => void,
    field: keyof typeof visible,
    autoComplete: "current-password" | "new-password",
  ) {
    return (
      <div>
        <label htmlFor={id} className={labelClass}>
          {label} *
        </label>
        <div className="relative">
          <input
            id={id}
            type={visible[field] ? "text" : "password"}
            autoComplete={autoComplete}
            required
            minLength={field === "current" ? undefined : 12}
            maxLength={128}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() =>
              setVisible((current) => ({
                ...current,
                [field]: !current[field],
              }))
            }
            aria-label={`${visible[field] ? "Hide" : "Show"} ${label.toLowerCase()}`}
            className="absolute inset-y-0 right-1 my-auto min-h-10 rounded-md px-3 text-sm font-semibold text-[#ffd43b] transition-colors hover:text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
          >
            {visible[field] ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void changePassword(event)}
      className="max-w-2xl space-y-5 rounded-xl border border-[#ffd43b]/20 bg-black/65 p-4 backdrop-blur sm:p-6"
    >
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">
          Account security
        </p>
        <h2 className="mb-0 text-xl font-bold">Change password</h2>
      </div>
      <p className="mb-0 text-sm leading-relaxed text-gray-400">
        Use a unique password with at least 12 characters. Changing it signs out
        all active sessions.
      </p>
      {passwordField(
        "current-password",
        "Current password",
        currentPassword,
        setCurrentPassword,
        "current",
        "current-password",
      )}
      {passwordField(
        "new-password",
        "New password",
        newPassword,
        setNewPassword,
        "next",
        "new-password",
      )}
      {passwordField(
        "confirm-password",
        "Confirm new password",
        confirmPassword,
        setConfirmPassword,
        "confirm",
        "new-password",
      )}
      {error && (
        <p
          role="alert"
          className="mb-0 rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mb-0 rounded-lg border border-green-400/20 bg-green-500/10 p-3 text-sm text-green-200"
        >
          {notice}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="btn-primary min-h-11 disabled:cursor-wait disabled:opacity-50"
      >
        {saving ? "Changing…" : "Change Password"}
      </button>
    </form>
  );
}
