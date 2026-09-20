"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType } from "react";
import { AlertCircle, CheckCircle2, Clock3, RotateCcw, ShieldCheck } from "lucide-react";
import { assessLab, type LabAssessment, type LabRuntime } from "@/lib/labAssessment";

type Props = { runtime: LabRuntime; starterCode: string; labTitle: string; labId: string };
type HeadlessResult = { resultType?: string; stdout?: string; stderr?: string; exitCode?: number; tty?: string };
type RunnoElement = HTMLElement & {
  stop?: () => void;
  getEditorProgram?: () => Promise<string>;
  setProgram?: (syntax: string, runtime: LabRuntime, code: string) => void;
};

const RunnoRun = "runno-run" as ElementType;

export default function InteractiveLab({ runtime, starterCode, labTitle, labId }: Props) {
  const runnerRef = useRef<RunnoElement | null>(null);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [assessment, setAssessment] = useState<LabAssessment | null>(null);
  const [assessmentOutput, setAssessmentOutput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    import("@runno/runtime").then(() => setRuntimeReady(true)).catch(() => setRuntimeReady(false));
  }, []);

  async function currentCode() {
    const runner = runnerRef.current;
    if (!runner?.getEditorProgram) throw new Error("The code editor is still loading. Please wait a moment.");
    return runner.getEditorProgram();
  }

  async function execute(code: string, stdin = ""): Promise<HeadlessResult> {
    const { headlessRunCode } = await import("@runno/runtime");
    return Promise.race([
      headlessRunCode(runtime, code, stdin) as Promise<HeadlessResult>,
      new Promise<HeadlessResult>((_, reject) =>
        window.setTimeout(() => reject(new Error("Execution took too long. Check for an infinite loop or missing input.")), 15000),
      ),
    ]);
  }

  async function assessSolution() {
    setChecking(true);
    setError("");
    setAssessment(null);
    setAssessmentOutput("Running hidden checks...");
    try {
      const code = await currentCode();
      const inputs =
        labId === "python-function-lab"
          ? ["Oscar\n", "Ama\n"]
          : labId === "cpp-coding-lab"
            ? ["72\n85\n91\n64\n88\n", "101\n72\n85\n91\n64\n88\n"]
            : [""];
      const results: HeadlessResult[] = [];
      for (const input of inputs) results.push(await execute(code, input));

      const output = results.map((result, index) => {
        const label =
          labId === "python-function-lab"
            ? `Test ${index + 1} (${inputs[index].trim()})`
            : labId === "cpp-coding-lab"
              ? index === 0 ? "Test 1 (five valid scores)" : "Test 2 (invalid score followed by valid scores)"
              : "Execution";
        return `[${label}]\n${[result.stdout, result.stderr].filter(Boolean).join("\n") || "(no output)"}`;
      }).join("\n\n");

      setAssessmentOutput(output);
      setAssessment(assessLab(labId, code, results));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The automated assessment could not be completed.");
      setAssessmentOutput("");
    } finally {
      setChecking(false);
    }
  }

  async function saveAssessment() {
    if (!assessment) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/labs/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labId, passed: assessment.passed, score: assessment.score }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save your lab result.");
      setAssessmentOutput((current) => `${current}\n\n✓ Result saved to your UTECH learning record.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your result.");
    } finally {
      setSaving(false);
    }
  }

  function resetCode() {
    runnerRef.current?.stop?.();
    const syntax = runtime === "clangpp" ? "cpp" : runtime;
    runnerRef.current?.setProgram?.(syntax, runtime, starterCode);
    setAssessment(null);
    setAssessmentOutput("");
    setError("");
  }

  const runnoStyle = {
    "--runno-editor-height": "520px",
    "--runno-terminal-height": "260px",
    "--runno-terminal-min-height": "180px",
  } as CSSProperties;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07172b] shadow-xl">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-300">Interactive lab</p>
            <p className="mt-1 text-sm font-bold text-white">{labTitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${runtimeReady ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>
              {runtimeReady ? "Runtime ready" : "Loading runtime..."}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-300"><ShieldCheck size={12} /> Browser sandbox</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-300"><Clock3 size={12} /> 15s limit</span>
            <button onClick={resetCode} disabled={!runtimeReady || checking} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-300 hover:bg-white/10 disabled:opacity-50"><RotateCcw size={12} /> Reset</button>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-[#020b16] p-3 sm:p-4">
        <div className="rounded-xl border border-white/10 bg-black/20 p-2">
          {runtimeReady ? (
            <RunnoRun ref={runnerRef} runtime={runtime} editor controls code={starterCode} style={runnoStyle} />
          ) : (
            <div className="flex min-h-[520px] items-center justify-center text-sm font-semibold text-slate-500">Loading the secure code runtime...</div>
          )}
        </div>
        <p className="mt-3 px-1 text-xs leading-5 text-slate-500">
          Use <strong className="text-slate-300">Run</strong> inside the terminal controls. If your program calls <code>input()</code> or <code>cin</code>, the terminal will wait for your response and then continue.
        </p>
      </div>

      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-300">Automated assessment</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Hidden tests run separately from the interactive terminal and receive their own input.</p>
          </div>
          <button onClick={assessSolution} disabled={!runtimeReady || checking} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
            <CheckCircle2 size={15} /> {checking ? "Checking..." : "Check my solution"}
          </button>
        </div>

        {assessmentOutput && <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-5 text-slate-300">{assessmentOutput}</pre>}
        {error && <div className="mt-4 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-200"><AlertCircle className="mt-0.5 shrink-0" size={17} /><span>{error}</span></div>}

        {assessment && (
          <div className={`mt-4 rounded-2xl border p-5 ${assessment.passed ? "border-emerald-400/20 bg-emerald-400/10" : "border-amber-400/20 bg-amber-400/10"}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Assessment result</p><p className="mt-1 text-2xl font-black text-white">{assessment.score}/100</p></div>
              <p className={`text-sm font-black ${assessment.passed ? "text-emerald-300" : "text-amber-300"}`}>{assessment.passed ? "Challenge passed" : "Keep working — some checks failed"}</p>
            </div>
            <div className="mt-4 space-y-2">
              {assessment.checks.map((check) => (
                <div key={check.label} className="flex gap-3 rounded-xl bg-black/20 p-3">
                  {check.passed ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={17} /> : <AlertCircle className="mt-0.5 shrink-0 text-amber-300" size={17} />}
                  <div><p className="text-sm font-bold text-white">{check.label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{check.detail}</p></div>
                </div>
              ))}
            </div>
            <button onClick={saveAssessment} disabled={saving} className="mt-5 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#07172b] hover:bg-slate-100 disabled:opacity-50">{saving ? "Saving..." : assessment.passed ? "Save passed result" : "Save attempt"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
