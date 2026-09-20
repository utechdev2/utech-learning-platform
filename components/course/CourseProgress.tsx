"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CourseProgress({ courseSlug, lessonCount, firstLesson }: { courseSlug: string; lessonCount: number; firstLesson: string }) {
  const [completed, setCompleted] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/progress?course=" + encodeURIComponent(courseSlug), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && Array.isArray(data.progress)) {
          setAuthenticated(true);
          setCompleted(new Set(data.progress.map((item: { lesson_slug: string }) => item.lesson_slug)).size);
        }
      })
      .catch(() => {});
  }, [courseSlug]);

  const percent = lessonCount ? Math.round((Math.min(completed, lessonCount) / lessonCount) * 100) : 0;
  const action = completed === 0 ? "Start course" : completed >= lessonCount ? "Review course" : "Continue learning";

  return (
    <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-[#0b1f3a]">Your progress</p>
          <p className="mt-1 text-sm text-slate-500">{authenticated ? completed + " of " + lessonCount + " lessons completed" : "Sign in to save your progress"}</p>
        </div>
        {authenticated && <span className="font-black text-[#155eef]">{percent}%</span>}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-[#155eef] transition-all" style={{ width: percent + "%" }} />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {completed >= lessonCount && authenticated ? <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 size={17}/> Course completed</span> : <span className="text-xs font-semibold text-slate-500">Complete lessons to build your progress.</span>}
        <Link href={"/learn/" + courseSlug + "/" + firstLesson} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155eef] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">{action} <ArrowRight size={16}/></Link>
      </div>
    </div>
  );
}
