"use client";

import { useState } from "react";

export default function Quiz({
  courseSlug, lessonSlug, question, options, answer,
}: {
  courseSlug: string; lessonSlug: string; question: string; options: string[]; answer: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = submitted && selected === answer;

  async function submitAnswer() {
    if (selected === null) return;
    setSubmitted(true);
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug, score: selected === answer ? 100 : 0 }),
      });
    } catch {}
  }

  return (
    <div className="mt-4">
      <div className="grid gap-2">
        {options.map((option, index) => {
          const chosen = selected === index;
          const isCorrect = submitted && index === answer;
          const isWrong = submitted && chosen && index !== answer;
          return (
            <button key={option} onClick={() => { setSelected(index); setSubmitted(false); }} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${isCorrect ? "border-green-300 bg-green-50 text-green-800" : isWrong ? "border-red-200 bg-red-50 text-red-700" : chosen ? "border-blue-300 bg-blue-50 text-[#155eef]" : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/40"}`}>
              {String.fromCharCode(65 + index)}. {option}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button disabled={selected === null} onClick={submitAnswer} className="rounded-xl bg-[#0b1f3a] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Check answer</button>
        {submitted && <p className={`text-sm font-bold ${correct ? "text-green-700" : "text-red-700"}`}>{correct ? "Correct — nice work." : "Not quite. Review the key concepts and try again."}</p>}
      </div>
    </div>
  );
}
