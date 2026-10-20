"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdminAccount } from "@/lib/auth";

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/15 bg-[#090909] px-3 text-white outline-none focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/15";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-200";

export function AdminProfileForm({ initialAccount }: { initialAccount: AdminAccount }) {
  const [displayName, setDisplayName] = useState(initialAccount.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAccount.avatarUrl);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const response = await fetch("/api/admin/profile", { cache: "no-store" });
        const result = (await response.json()) as {
          account?: AdminAccount;
          error?: string;
        };
        if (!response.ok || !result.account) {
          throw new Error(result.error ?? "Profile could not be loaded.");
        }
        if (mounted) {
          setDisplayName(result.account.displayName);
          setAvatarUrl(result.account.avatarUrl);
        }
      } catch (caught) {
        if (mounted) {
          setProfileError(caught instanceof Error ? caught.message : "Profile could not be loaded.");
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingProfile) return;
    setSavingProfile(true);
    setProfileError("");
    setProfileNotice("");
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, avatarUrl }),
      });
      const result = (await response.json()) as {
        account?: AdminAccount;
        error?: string;
        fields?: Record<string, string>;
      };
      if (!response.ok || !result.account) {
        const details = Object.values(result.fields ?? {}).join(" ");
        throw new Error(details || result.error || "Profile could not be saved.");
      }
      setDisplayName(result.account.displayName);
      setAvatarUrl(result.account.avatarUrl);
      setProfileNotice("Profile updated.");
      router.refresh();
    } catch (caught) {
      setProfileError(caught instanceof Error ? caught.message : "Profile could not be saved.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingPassword) return;
    setSavingPassword(true);
    setPasswordError("");
    setPasswordNotice("");
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
      setPasswordNotice("Password changed. Sign in again with your new password.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (result.signInAgain) {
        window.setTimeout(() => {
          router.replace("/admin/login");
          router.refresh();
        }, 1200);
      }
    } catch (caught) {
      setPasswordError(caught instanceof Error ? caught.message : "Password could not be changed.");
      setSavingPassword(false);
    }
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-2">
      <form onSubmit={(event) => void saveProfile(event)} className="min-w-0 space-y-5 rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">Account settings</p>
          <h2 className="mb-0 text-xl font-bold">Profile details</h2>
        </div>
        <div>
          <label htmlFor="admin-email" className={labelClass}>Email address</label>
          <input id="admin-email" value={initialAccount.email} readOnly className={`${inputClass} cursor-not-allowed text-gray-400`} />
          <p className="mb-0 mt-1 text-xs text-gray-500">The login email is managed through the initial admin setup.</p>
        </div>
        <div>
          <label htmlFor="admin-display-name" className={labelClass}>Display name *</label>
          <input id="admin-display-name" required maxLength={100} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="admin-avatar-file" className={labelClass}>Upload avatar</label>
          <input id="admin-avatar-file" type="file" accept="image/png,image/jpeg,image/webp" disabled className="block min-h-11 w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-gray-400 disabled:cursor-not-allowed" />
          <p className="mb-3 mt-1 text-xs text-amber-200">Uploads are unavailable until a storage provider is configured.</p>
          <label htmlFor="admin-avatar-url" className={labelClass}>Existing same-site avatar path</label>
          <input id="admin-avatar-url" value={avatarUrl} placeholder="/images/admin-avatar.png" onChange={(event) => setAvatarUrl(event.target.value)} className={inputClass} />
        </div>
        {avatarUrl && (
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[#ffd43b]/35 bg-[#090909]">
            <Image src={avatarUrl} alt="Admin avatar preview" fill sizes="80px" className="object-cover" />
          </div>
        )}
        {profileError && <p role="alert" className="mb-0 rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{profileError}</p>}
        {profileNotice && <p role="status" className="mb-0 rounded-lg border border-green-400/20 bg-green-500/10 p-3 text-sm text-green-200">{profileNotice}</p>}
        <button type="submit" disabled={savingProfile} className="btn-primary min-h-11 disabled:opacity-50">{savingProfile ? "Saving…" : "Save Profile"}</button>
      </form>

      <form onSubmit={(event) => void changePassword(event)} className="min-w-0 space-y-5 rounded-xl border border-white/10 bg-[#111] p-4 sm:p-6">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#ffd43b]">Security</p>
          <h2 className="mb-0 text-xl font-bold">Change password</h2>
        </div>
        <p className="mb-0 text-sm leading-relaxed text-gray-400">Use a unique password with at least 12 characters. Changing it signs out all active sessions.</p>
        <div>
          <label htmlFor="current-password" className={labelClass}>Current password *</label>
          <input id="current-password" type="password" autoComplete="current-password" required maxLength={128} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="new-password" className={labelClass}>New password *</label>
          <input id="new-password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="confirm-password" className={labelClass}>Confirm new password *</label>
          <input id="confirm-password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
        </div>
        {passwordError && <p role="alert" className="mb-0 rounded-lg border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{passwordError}</p>}
        {passwordNotice && <p role="status" className="mb-0 rounded-lg border border-green-400/20 bg-green-500/10 p-3 text-sm text-green-200">{passwordNotice}</p>}
        <button type="submit" disabled={savingPassword} className="min-h-11 rounded-lg border border-[#ffd43b]/40 px-4 text-sm font-semibold text-[#ffd43b] disabled:opacity-50">{savingPassword ? "Changing…" : "Change Password"}</button>
      </form>
    </div>
  );
}
