"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Play, RotateCcw, TerminalSquare } from "lucide-react";
import { assessLab, type LabAssessment, type LabRuntime } from "@/lib/labAssessment";

type Props = {
  runtime: LabRuntime;
  starterCode: string;
  labTitle: string;
  labId: string;
};

type RunState = "idle" | "running" | "complete" | "error";

type HeadlessResult = {
  resultType?: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  tty?: string;
};

export default function InteractiveLab({ runtime, starterCode, labTitle, labId }: Props) {
  const [code, setCode] = useState(starterCode);
  const [stdin, setStdin] = useState(runtime === "python" ? "Oscar" : "");
  const [runState, setRunState] = useState<RunState>("idle");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [assessment, setAssessment] = useState<LabAssessment | null>(null);
  const [saving, setSaving] = useState(false);
  const [runtimeReady, setRuntimeReady] = useState(false);

  useEffect(() => {
    import("@runno/runtime")
      .then(() => setRuntimeReady(true))
      .catch(() => setRuntimeReady(false));
  }, []);

  async function execute(runInput = stdin): Promise<HeadlessResult> {
    if (!runtimeReady) throw new Error("The browser runtime is still loading. Please wait a moment and try again.");

    const { headlessRunCode } = await import("@runno/runtime");
    const result = await Promise.race([
      headlessRunCode(runtime, code, runInput),
      new Promise<HeadlessResult>((_, reject) =>
        window.setTimeout(() => reject(new Error("Execution took too long. Stop the program and check for an infinite loop or missing input.")), 15000),
      ),
    ]);

    return result as HeadlessResult;
  }

  async function runCode() {
    setRunState("running");
    setError("");
    setAssessment(null);
    setOutput("");
    try {
      const result = await execute();
      const combined = [result.stdout, result.stderr].filter(Boolean).join("\n");
      setOutput(combined || "(Program finished with no output.)");
      setRunState(result.resultType === "complete" && result.exitCode === 0 ? "complete" : "error");
      if (result.resultType !== "complete" || result.exitCode !== 0) {
        setError("The program did not finish successfully. Read the output above, fix the code, and run it again.");
      }
    } catch (err) {
      setRunState("error");
      setError(err instanceof Error ? err.message : "The program could not be executed.");
    }
  }

  async function assessSolution() {
    setRunState("running");
    setError("");
    setAssessment(null);
    setOutput("Running hidden checks...");

    try {
      const inputs = labId === "python-function-lab" ? ["Oscar", "Ama"] : [stdin];
      const results: HeadlessResult[] = [];

      for (const input of inputs) {
        results.push(await execute(input));
      }

      const combined = results
        .map((result, index) => {
          const label = labId === "python-function-lab" ? `Test ${index + 1} (${inputs[index]})` : "Execution";
          return `[${label}]\n${[result.stdout, result.stderr].filter(Boolean).join("\n") || "(no output)"}`;
        })
        .join("\n\n");

      setOutput(combined);
      const result = assessLab(labId, code, results);
      setAssessment(result);
      setRunState(result.passed ? "complete" : "error");
    } catch (err) {
      setRunState("error");
      setError(err instanceof Error ? err.message : "The automated assessment could not be completed.");
      setOutput("");
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
        body: JSON.stringify({
          labId,
          passed: assessment.passed,
          score: assessment.score,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save your lab result.");

      setOutput((current) => `${current}\n\n✓ Result saved to your UTECH learning record.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your result.");
    } finally {
      setSaving(false);
    }
  }

  function resetCode() {
    setCode(starterCode);
    setAssessment(null);
    setOutput("");
    setError("");
    setRunState("idle");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#07172b] shadow-xl">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-300">Interactive lab</p>
            <p className="mt-1 text-sm font-bold text-white">{labTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${runtimeReady ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>
              {runtimeReady ? "Runtime ready" : "Loading runtime..."}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-300">
              <Clock3 size={12} /> 15s safety limit
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-300">Code editor</span>
            <button onClick={resetCode} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white">
              <RotateCcw size={13} /> Reset
            </button>
          </div>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            className="min-h-[480px] w-full resize-y border-0 bg-[#020b16] p-5 font-mono text-sm leading-6 text-slate-100 outline-none"
            aria-label={`${labTitle} code editor`}
          />
        </section>

        <section className="flex min-h-[480px] flex-col bg-[#020b16]">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300">
              <TerminalSquare size={14} /> Program input
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              If your program uses input(), enter one response per line. The lab will wait for this input before execution.
            </p>
            <textarea
              value={stdin}
              onChange={(event) => setStdin(event.target.value)}
              spellCheck={false}
              placeholder="Example: Oscar"
              className="mt-3 min-h-20 w-full resize-y rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-xs leading-5 text-slate-100 outline-none placeholder:text-slate-600 focus:border-blue-400"
              aria-label="Program input"
            />
          </div>

          <div className="flex-1 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-300">Output</span>
              {runState === "running" && <span className="text-xs font-bold text-blue-300">Running...</span>}
            </div>
            <pre className="min-h-56 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-5 text-slate-200">
              {output || "Your program output will appear here."}
            </pre>
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            onClick={runCode}
            disabled={!runtimeReady || runState === "running"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={15} /> Run code
          </button>
          <button
            onClick={assessSolution}
            disabled={!runtimeReady || runState === "running"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={15} /> Check my solution
          </button>
          <div className="flex items-center text-xs font-semibold text-slate-500">
            Code executes locally in the browser sandbox.
          </div>
        </div>

        {error && (
          <div className="mt-4 flex gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-200">
            <AlertCircle className="mt-0.5 shrink-0" size={17} />
            <span>{error}</span>
          </div>
        )}

        {assessment && (
          <div className={`mt-4 rounded-2xl border p-5 ${assessment.passed ? "border-emerald-400/20 bg-emerald-400/10" : "border-amber-400/20 bg-amber-400/10"}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Automated assessment</p>
                <p className="mt-1 text-2xl font-black text-white">{assessment.score}/100</p>
              </div>
              <p className={`text-sm font-black ${assessment.passed ? "text-emerald-300" : "text-amber-300"}`}>
                {assessment.passed ? "Challenge passed" : "Keep working — some checks failed"}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {assessment.checks.map((check) => (
                <div key={check.label} className="flex gap-3 rounded-xl bg-black/20 p-3">
                  {check.passed ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={17} /> : <AlertCircle className="mt-0.5 shrink-0 text-amber-300" size={17} />}
                  <div>
                    <p className="text-sm font-bold text-white">{check.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{check.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveAssessment}
              disabled={saving}
              className="mt-5 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#07172b] transition hover:bg-slate-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : assessment.passed ? "Save passed result" : "Save attempt"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
