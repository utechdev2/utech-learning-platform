"use client";

import { useEffect, useMemo, useState } from "react";

type Runtime = "python" | "clangpp" | "sqlite";

type Props = { runtime: Runtime; starterCode: string; labTitle: string };

export default function InteractiveLab({ runtime, starterCode, labTitle }: Props) {
  const [ready, setReady] = useState(false);

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

  if (!ready || !element) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-slate-800 bg-[#07172b] p-8 text-center text-slate-300">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">UTECH Lab</div>
          <p className="mt-3 text-lg font-bold text-white">Loading {labTitle}...</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            The practical runtime is starting inside your browser. No code is sent to UTECH for execution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07172b]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-300">Interactive lab</p>
          <p className="mt-1 text-sm font-bold text-white">{labTitle}</p>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300">Runs in browser</span>
      </div>
      <div className="bg-white p-2">
        <runno-run runtime={element.runtime} editor controls className={element.className}>
          {starterCode}
        </runno-run>
      </div>
    </div>
  );
}
