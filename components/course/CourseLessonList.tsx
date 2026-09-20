"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";

type Lesson = { slug: string; title: string };

export default function CourseLessonList({ courseSlug, lessons, currentSlug }: { courseSlug: string; lessons: Lesson[]; currentSlug?: string }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/progress?course=" + encodeURIComponent(courseSlug), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (active && data.authenticated && Array.isArray(data.progress)) {
          setCompleted(data.progress.map((item: { lesson_slug: string }) => item.lesson_slug));
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, [courseSlug]);

  return (
    <div className="space-y-1">
      {lessons.map((lesson, index) => {
        const done = completed.includes(lesson.slug);
        const active = currentSlug === lesson.slug;
        return (
          <Link key={lesson.slug} href={"/learn/" + courseSlug + "/" + lesson.slug}
            className={"flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold " + (active ? "bg-blue-50 text-[#155eef]" : "text-slate-600 hover:bg-slate-50")}>
            {done ? <CheckCircle2 size={17} className="shrink-0 text-emerald-500" /> : <Circle size={17} className="shrink-0 text-slate-300" />}
            <span className="min-w-0 flex-1"><span className="mr-2 text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span>{lesson.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
