import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BrandLoader } from "@/components/layout/brand-loader";
import { getAdminSession } from "@/lib/auth";

async function AdminLoginContent() {
  await connection();
  if (await getAdminSession()) redirect("/admin/dashboard");

  return (
    <main className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#080704] px-4 py-8 text-white sm:px-6">
      <Image
        src="/images/admin-login-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-black/25"
      />
      <section
        aria-labelledby="admin-login-heading"
        className="admin-login-card w-full max-w-[440px] rounded-[24px] border border-[#ffd43b]/25 px-6 py-7 shadow-[0_24px_90px_rgba(0,0,0,0.72)] sm:px-10 sm:py-9"
      >
        <header className="mb-7 text-center">
          <Image
            src="/icon.png"
            alt=""
            width={64}
            height={64}
            priority
            className="mx-auto mb-2 h-14 w-14 object-contain drop-shadow-[0_0_14px_rgba(255,212,59,0.38)]"
          />
          <p className="mb-0 font-serif text-2xl font-bold leading-tight text-white">
            DK <span className="text-[#ffd43b]">&amp;</span> SM
          </p>
          <p className="mb-5 mt-1 text-[9px] font-bold tracking-[0.38em] text-[#ffd43b]">
            ACADEMY
          </p>
          <h1
            id="admin-login-heading"
            className="mb-2 text-4xl font-extrabold leading-none tracking-tight text-white sm:text-[2.75rem]"
          >
            Admin
            <span className="mt-1 block text-[#ffd43b]">Sign In</span>
          </h1>
          <p className="mx-auto mb-0 max-w-xs text-sm leading-relaxed text-gray-300">
            Sign in to manage Academy articles and portfolio reviews.
          </p>
        </header>
        <AdminLoginForm />
      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <AdminLoginContent />
    </Suspense>
  );
}
