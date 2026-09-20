"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame } from "lucide-react";
import { courses } from "@/data/courses";

type ProgressRow = { course_slug: string; lesson_slug: string };

function readLocalProgress() {
  const result: ProgressRow[] = [];
  for (const course of courses) {
    const saved = JSON.parse(localStorage.getItem(`utech-progress:${course.slug}`) || "[]") as string[];
    result.push(...saved.map(lesson_slug => ({ course_slug: course.slug, lesson_slug })));
  }
  return result;
}

export default function DashboardStats() {
  const [progress, setProgress] = useState<ProgressRow[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        const data = await response.json();
        if (active && data.authenticated && Array.isArray(data.progress)) {
          setProgress(data.progress);
          return;
        }
      } catch {}
      if (active) setProgress(readLocalProgress());
    }
    load();
    return () => { active = false; };
  }, []);

  const completed = progress.length;
  const linuxTotal = courses.find(c => c.slug === "linux-essentials")?.lessons.length ?? 1;
  const linuxCompleted = progress.filter(item => item.course_slug === "linux-essentials").length;
  const linuxProgress = Math.round((linuxCompleted / linuxTotal) * 100);

  const stats = [
    ["Courses", String(courses.length), BookOpen],
    ["Completed", String(completed), CheckCircle2],
    ["Learning hours", String(Math.round(completed * 0.5)), Clock3],
    ["Day streak", completed > 0 ? "1" : "0", Flame],
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6">
            <Icon className="text-[#155eef]" size={21} />
            <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-black text-[#0b1f3a]">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Continue</p>
              <h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">Linux Essentials</h2>
            </div>
            <span className="font-black text-[#155eef]">{linuxProgress}%</span>
          </div>
          <div className="mt-6 h-3 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#155eef] transition-all" style={{ width: `${linuxProgress}%` }} />
          </div>
          <p className="mt-4 text-sm text-slate-500">Your authenticated progress is synced to UTECH when your Supabase account is connected.</p>
          <Link href="/learn/linux-essentials/the-linux-terminal" className="mt-6 inline-flex items-center gap-2 font-bold text-[#155eef]">
            Continue lesson <ArrowRight size={16} />
          </Link>
        </div>
        <div className="rounded-2xl bg-[#0b1f3a] p-7 text-white">
          <p className="text-sm font-bold text-blue-200">Learning habit</p>
          <h2 className="mt-2 text-2xl font-black">Build the habit.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Finish a lesson, test yourself, then keep moving. Your progress follows your account across sessions once Supabase is configured.</p>
        </div>
      </div>
    </div>
  );
}
