import Link from "next/link";
import { Award, CheckCircle2 } from "lucide-react";
import { getCourse } from "@/data/courses";

export default async function VerifyPage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const url = base + "/rest/v1/certificates?select=certificate_id,course_slug,issued_at&certificate_id=eq." + encodeURIComponent(certificateId);
  const response = await fetch(url, { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "" }, cache: "no-store" });
  const rows = response.ok ? await response.json() : [];
  const certificate = Array.isArray(rows) ? rows[0] : null;
  const course = certificate ? getCourse(certificate.course_slug) : null;

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#155eef]"><Award size={32}/></div>
        {certificate && course ? <>
          <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600">Certificate verified</p>
          <h1 className="mt-3 text-4xl font-black text-[#0b1f3a]">UTECH Learning Hub</h1>
          <p className="mt-4 text-slate-600">This certificate confirms completion of</p>
          <p className="mt-2 text-2xl font-black text-[#155eef]">{course.title}</p>
          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Certificate ID</p><p className="mt-1 break-all text-sm font-black text-[#0b1f3a]">{certificate.certificate_id}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Issued</p><p className="mt-1 text-sm font-black text-[#0b1f3a]">{new Date(certificate.issued_at).toLocaleDateString()}</p></div>
          </div>
          <p className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 size={17}/> Valid UTECH credential</p>
        </> : <>
          <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.2em] text-red-600">Not found</p>
          <h1 className="mt-3 text-3xl font-black text-[#0b1f3a]">Certificate could not be verified.</h1>
          <p className="mt-3 text-slate-500">Check the certificate ID and try again.</p>
        </>}
        <Link href="/" className="mt-8 inline-block font-extrabold text-[#155eef]">Back to UTECH Learning Hub</Link>
      </div>
    </main>
  );
}
