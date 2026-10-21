"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdminAccount } from "@/lib/auth";
import { ProfileImageEditor } from "@/components/admin/profile-image-editor";

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/15 bg-[#090909] px-3 text-white outline-none focus:border-[#ffd43b] focus:ring-2 focus:ring-[#ffd43b]/15";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-200";

export function AdminProfileForm({ initialAccount }: { initialAccount: AdminAccount }) {
  const [displayName, setDisplayName] = useState(initialAccount.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAccount.avatarUrl);
  const [profileError, setProfileError] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
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

  async function saveUploadedAvatar(url: string) {
    const response = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, avatarUrl: url }),
    });
    const result = (await response.json()) as { account?: AdminAccount; error?: string };
    if (!response.ok || !result.account) {
      throw new Error(result.error ?? "Profile image could not be saved.");
    }
    setAvatarUrl(result.account.avatarUrl);
    setDisplayName(result.account.displayName);
    setProfileNotice("Profile image updated.");
    router.refresh();
  }

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

  return (
    <div className="min-w-0">
      <form onSubmit={(event) => void saveProfile(event)} className="max-w-2xl space-y-5 rounded-xl border border-[#ffd43b]/20 bg-black/65 p-4 backdrop-blur sm:p-6">
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
          <ProfileImageEditor onSaved={saveUploadedAvatar} />
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
    </div>
  );
}
