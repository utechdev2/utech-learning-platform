"use client";

import { createElement, useEffect, useMemo, useState } from "react";

type Runtime = "python" | "clangpp" | "sqlite";

type Props = {
  runtime: Runtime;
  starterCode: string;
  labTitle: string;
  labId: string;
};

export default function InteractiveLab({ runtime, starterCode, labTitle, labId }: Props) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "passed" | "failed">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    import("@runno/runtime").then(() => {
      if (mounted) setReady(true);
    }).catch(() => {
      if (mounted) setReady(false);
    });
    return () => { mounted = false; };
  }, []);

  const element = useMemo(() => {
    if (!ready) return null;
    return { runtime, className: "block min-h-[520px] w-full overflow-hidden rounded-2xl" };
  }, [ready, runtime]);

  async function recordAssessment(passed: boolean) {
    setStatus("saving");
    setMessage("Saving your lab result...");
    try {
      const response = await fetch("/api/labs/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labId, passed, score: passed ? 100 : 0 }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save your result.");
      setStatus(passed ? "passed" : "failed");
      setMessage(passed ? "Lab passed — your practical result is saved." : "Attempt recorded. Fix your solution and try again.");
    } catch (error) {
      setStatus("failed");
      setMessage(error instanceof Error ? error.message : "Could not save your result.");
    }
  }

  if (!ready || !element) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-slate-800 bg-[#07172b] p-8 text-center text-slate-300">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">UTECH Lab</div>
          <p className="mt-3 text-lg font-bold text-white">Loading {labTitle}...</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">The practical runtime is starting inside your browser. No code is sent to UTECH for execution.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07172b]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-300">Interactive lab</p>
          <p className="mt-1 text-sm font-bold text-white">{labTitle}</p>
        </div>
        <span className="w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300">Runs in browser</span>
      </div>

      <div className="bg-white p-2">
        {createElement("runno-run", {
          runtime: element.runtime,
          editor: true,
          controls: true,
          className: element.className,
        }, starterCode)}
      </div>

      <div className="border-t border-white/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black text-white">Finished the challenge?</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Run your solution, verify the success criteria, then submit your practical result.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => recordAssessment(false)} disabled={status === "saving"} className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-extrabold text-slate-300 transition hover:bg-white/5 disabled:opacity-50">Record failed attempt</button>
            <button onClick={() => recordAssessment(true)} disabled={status === "saving"} className="rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-blue-400 disabled:opacity-50">Submit as passed</button>
          </div>
        </div>
        {message && (
          <div className={`mt-4 rounded-xl p-3 text-sm font-semibold ${status === "passed" ? "bg-emerald-400/10 text-emerald-300" : "bg-white/5 text-slate-300"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
