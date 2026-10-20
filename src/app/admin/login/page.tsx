import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  await connection();
  if (await getAdminSession()) redirect("/admin/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090909] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-[#ffd43b]/20 bg-[#111] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="mb-7">
          <p className="mb-1 font-serif text-3xl font-bold">
            DK <span className="text-[#ffd43b]">&amp;</span> SM
          </p>
          <p className="mb-6 text-[10px] font-bold tracking-[0.4em] text-[#ffd43b]">
            ACADEMY
          </p>
          <h1 className="mb-2 text-2xl font-extrabold">Admin sign in</h1>
          <p className="mb-0 text-sm leading-relaxed text-gray-400">
            Sign in to manage Academy articles and portfolio reviews.
          </p>
        </div>
        <AdminLoginForm />
      </section>
    </main>
  );
}
