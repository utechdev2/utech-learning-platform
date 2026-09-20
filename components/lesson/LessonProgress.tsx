"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";

export default function LessonProgress({ course, lesson, nextHref, canComplete = false }: { course: string; lesson: string; nextHref: string; canComplete?: boolean }) {
  const key = `utech-progress:${course}`;
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch(`/api/progress?course=${encodeURIComponent(course)}`, { cache: "no-store" });
        const data = await response.json();
        if (active && data.authenticated && Array.isArray(data.progress)) {
          setComplete(data.progress.some((item: { lesson_slug: string }) => item.lesson_slug === lesson));
          return;
        }
      } catch {}
      if (active) {
        const saved = JSON.parse(localStorage.getItem(key) || "[]") as string[];
        setComplete(saved.includes(lesson));
      }
    }
    load();
    return () => { active = false; };
  }, [course, key, lesson]);

  async function toggle() {
    if (!complete && !canComplete) return;
    const nextComplete = !complete;

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course, lessonSlug: lesson, completed: nextComplete }),
      });

      if (!response.ok) return;

      setComplete(nextComplete);
      const saved = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      const next = nextComplete ? Array.from(new Set([...saved, lesson])) : saved.filter(item => item !== lesson);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }

  const locked = !complete && !canComplete;

  return (
    <div className="border-t border-slate-100 pt-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={toggle} disabled={locked} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${complete ? "border-blue-200 bg-blue-50 text-[#155eef]" : locked ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400" : "border-slate-200 text-slate-600 hover:border-blue-200 hover:text-[#155eef]"}`}>
          {complete ? <CheckCircle2 size={18} /> : locked ? <LockKeyhole size={18} /> : <CheckCircle2 size={18} />}
          {complete ? "Lesson completed" : locked ? "Pass the quiz to complete" : "Mark lesson complete"}
        </button>
        <Link href={nextHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155eef] px-6 py-3 font-bold text-white hover:bg-blue-700">
          Continue <ArrowRight size={16} />
        </Link>
      </div>
      {locked && <p className="mt-3 text-xs font-semibold text-slate-400">Answer the checkpoint quiz correctly to unlock lesson completion.</p>}
    </div>
  );
}
