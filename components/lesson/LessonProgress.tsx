"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function LessonProgress({ course, lesson, nextHref }: { course: string; lesson: string; nextHref: string }) {
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
    const nextComplete = !complete;
    setComplete(nextComplete);
    const saved = JSON.parse(localStorage.getItem(key) || "[]") as string[];
    const next = nextComplete ? Array.from(new Set([...saved, lesson])) : saved.filter(item => item !== lesson);
    localStorage.setItem(key, JSON.stringify(next));

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course, lessonSlug: lesson, completed: nextComplete }),
      });
    } catch {}
  }

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
      <button onClick={toggle} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${complete ? "border-blue-200 bg-blue-50 text-[#155eef]" : "border-slate-200 text-slate-600 hover:border-blue-200 hover:text-[#155eef]"}`}>
        <CheckCircle2 size={18} /> {complete ? "Lesson completed" : "Mark lesson complete"}
      </button>
      <a href={nextHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155eef] px-6 py-3 font-bold text-white hover:bg-blue-700">Continue →</a>
    </div>
  );
}
