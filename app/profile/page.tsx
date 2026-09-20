import Link from "next/link";
import { UserCircle } from "lucide-react";
import StudentNav from "@/components/layout/StudentNav";
import ProfileForm from "@/components/profile/ProfileForm";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const email = typeof claimsData?.claims?.email === "string" ? claimsData.claims.email : "Student";
  const userId = typeof claimsData?.claims?.sub === "string" ? claimsData.claims.sub : null;
  let fullName = "";
  if (userId) {
    const { data } = await supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle();
    fullName = data?.full_name ?? "";
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1f3a] font-black text-white">U</span><span className="font-black text-[#0b1f3a]">UTECH Learning Hub</span></Link>
          <span className="hidden text-sm text-slate-400 md:block">{email}</span>
        </div>
      </header>
      <StudentNav />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#155eef]">Student profile</p>
        <h1 className="mt-2 text-4xl font-black text-[#0b1f3a]">Your UTECH account.</h1>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-[#155eef]"><UserCircle size={42}/></div>
            <div><p className="text-2xl font-black text-[#0b1f3a]">{fullName || "UTECH Student"}</p><p className="mt-1 text-slate-500">{email}</p></div>
          </div>
          <ProfileForm initialName={fullName} />
          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-sm font-bold text-slate-500">Account status</p>
            <p className="mt-2 font-extrabold text-emerald-600">Authenticated student</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Your lesson completion and quiz attempts are associated with your account when the platform is connected to Supabase.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
