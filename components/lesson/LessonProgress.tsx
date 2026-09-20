"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function LessonProgress({ course, lesson, nextHref }: { course: string; lesson: string; nextHref: string }) {
  const key = `utech-progress:${course}`;
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    setComplete(saved.includes(lesson));
  }, [key, lesson]);

  function toggle() {
    const saved = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    const next = saved.includes(lesson) ? saved.filter(item => item !== lesson) : [...saved, lesson];
    localStorage.setItem(key, JSON.stringify(next));
    setComplete(next.includes(lesson));
  }

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
      <button onClick={toggle} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${complete ? "border-blue-200 bg-blue-50 text-[#155eef]" : "border-slate-200 text-slate-600 hover:border-blue-200 hover:text-[#155eef]}"}>
        <CheckCircle2 size={18} /> {complete ? "Lesson completed" : "Mark lesson complete"}
      </button>
      <a href={nextHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155eef] px-6 py-3 font-bold text-white hover:bg-blue-700">Continue →</a>
    </div>
  );
}
