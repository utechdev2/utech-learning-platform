"use client";

import { useEffect, useState } from "react";
import { Award, Copy, ExternalLink } from "lucide-react";

export default function CertificateCard({ courseSlug, lessonCount, labCount }: Props) {
  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [labsComplete, setLabsComplete] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/progress?course=" + encodeURIComponent(courseSlug), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && Array.isArray(data.progress)) {
          setCompleted(new Set(data.progress.map((item: { lesson_slug: string }) => item.lesson_slug)).size >= lessonCount);
          setLabsComplete(Array.isArray(data.labAttempts) && data.labAttempts.length >= labCount);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [courseSlug, lessonCount]);

  async function issue() {
    setBusy(true); setError("");
    const response = await fetch("/api/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseSlug }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Could not issue certificate.");
    else setCertificateId(data.certificate.certificate_id);
    setBusy(false);
  }

  const eligible = completed && labsComplete;

  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600"><Award size={25}/></div>
        <div className="flex-1">
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Course certificate</p>
          <h3 className="mt-1 text-lg font-black text-[#0b1f3a]">Completed the course?</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">Generate a unique certificate ID after all lessons and available practical labs are complete.</p>
          {!certificateId ? <button onClick={issue} disabled={busy || checking || !eligible} className="mt-4 rounded-xl bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{checking ? "Checking progress…" : busy ? "Checking completion…" : eligible ? "Generate certificate" : "Complete lessons and labs first"}</button> : <div className="mt-4 flex flex-col gap-3"><div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3"><code className="flex-1 text-sm font-bold text-[#0b1f3a]">{certificateId}</code><button onClick={() => navigator.clipboard?.writeText(certificateId)} aria-label="Copy certificate ID"><Copy size={16}/></button></div><a href={"/verify/" + encodeURIComponent(certificateId)} className="inline-flex items-center gap-2 text-sm font-extrabold text-[#155eef]">Verify certificate <ExternalLink size={15}/></a></div>}
          {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
