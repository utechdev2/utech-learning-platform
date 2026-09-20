"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, PlayCircle, Trophy, FlaskConical } from "lucide-react";
import type { Course } from "@/data/courses";

type ProgressRow = { course_slug: string; lesson_slug: string; completed_at?: string };
type LabRow = { lab_id: string; lab_slug: string; lab_title: string; course_slug: string; score: number; completed_at?: string | null; updated_at?: string | null };
type QuizRow = { course_slug: string; lesson_slug: string; score: number; attempted_at?: string };

function readLocalProgress(courseList: Course[]) {
  const result: ProgressRow[] = [];
  for (const course of courseList) {
    const saved = JSON.parse(localStorage.getItem(`utech-progress:${course.slug}`) || "[]") as string[];
    result.push(...saved.map(lesson_slug => ({ course_slug: course.slug, lesson_slug })));
  }
  return result;
}

function dateKey(value: string | Date) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function calculateStreak(rows: ProgressRow[], labs: LabRow[]) {
  const days = new Set([
    ...rows.map(row => row.completed_at ? dateKey(row.completed_at) : ""),
    ...labs.map(row => row.completed_at ? dateKey(row.completed_at) : ""),
  ].filter(Boolean));
  if (!days.size) return 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  let key = dateKey(cursor);
  if (!days.has(key)) {
    cursor.setDate(cursor.getDate() - 1);
    key = dateKey(cursor);
    if (!days.has(key)) return 0;
  }
  let streak = 0;
  while (days.has(key)) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
    key = dateKey(cursor);
  }
  return streak;
}

export default function DashboardStats({ initialCourses }: { initialCourses: Course[] }) {
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [labs, setLabs] = useState<LabRow[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [progressResponse, quizResponse] = await Promise.all([
          fetch("/api/progress", { cache: "no-store" }),
          fetch("/api/quiz", { cache: "no-store" }),
        ]);
        const progressData = await progressResponse.json();
        const quizData = await quizResponse.json();
        if (active && progressData.authenticated && Array.isArray(progressData.progress)) {
          setAuthenticated(true);
          setProgress(progressData.progress);
          setLabs(Array.isArray(progressData.labAttempts) ? progressData.labAttempts : []);
          setQuizzes(Array.isArray(quizData.attempts) ? quizData.attempts : []);
          setLoading(false);
          return;
        }
      } catch {}
      if (active) {
        setProgress(readLocalProgress(initialCourses));
        setLabs([]);
        setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [initialCourses]);

  const completedKeys = useMemo(() => new Set(progress.map(item => `${item.course_slug}/${item.lesson_slug}`)), [progress]);
  const completed = completedKeys.size;
  const totalLessons = initialCourses.reduce((sum, course) => sum + course.lessons.length, 0);
  const passedLabs = labs.length;
  const overallProgress = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
  const streak = authenticated ? calculateStreak(progress, labs) : 0;
  const averageQuiz = quizzes.length ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length) : 0;

  const nextLesson = useMemo(() => {
    for (const course of initialCourses) {
      const lesson = course.lessons.find(item => !completedKeys.has(`${course.slug}/${item.slug}`));
      if (lesson) return { course, lesson };
    }
    return null;
  }, [completedKeys, initialCourses]);

  const recent = useMemo(
    () => [
      ...progress
        .filter(item => item.completed_at)
        .map(item => ({ kind: "lesson" as const, key: `${item.course_slug}/${item.lesson_slug}`, course_slug: item.course_slug, title: initialCourses.find(c => c.slug === item.course_slug)?.lessons.find(l => l.slug === item.lesson_slug)?.title ?? item.lesson_slug, completed_at: item.completed_at! })),
      ...labs
        .filter(item => item.completed_at)
        .map(item => ({ kind: "lab" as const, key: item.lab_id, course_slug: item.course_slug, title: item.lab_title, completed_at: item.completed_at! })),
    ]
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
      .slice(0, 6),
    [initialCourses, labs, progress]
  );

  const stats = [
    ["Courses", String(initialCourses.length), BookOpen],
    ["Lessons", String(completed), CheckCircle2],
    ["Labs passed", String(passedLabs), FlaskConical],
    ["Day streak", String(streak), Flame],
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Icon className="text-[#155eef]" size={21} />
            <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-black text-[#0b1f3a]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Overall progress</p><h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">Keep the momentum.</h2></div>
            <span className="font-black text-[#155eef]">{overallProgress}%</span>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#155eef] transition-all" style={{ width: `${overallProgress}%` }} /></div>
          <p className="mt-4 text-sm text-slate-500">{loading ? "Loading your learning progress…" : `${completed} of ${totalLessons} lessons completed · ${passedLabs} lab${passedLabs === 1 ? "" : "s"} passed.`}</p>
          {nextLesson ? <Link href={`/learn/${nextLesson.course.slug}/${nextLesson.lesson.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0b1f3a] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#155eef]"><PlayCircle size={17}/> Continue learning <ArrowRight size={16}/></Link> : <Link href="/courses" className="mt-6 inline-flex items-center gap-2 font-bold text-[#155eef]">Browse courses <ArrowRight size={16}/></Link>}
        </div>
        <div className="rounded-2xl bg-[#0b1f3a] p-7 text-white">
          <p className="text-sm font-bold text-blue-200">Learning performance</p>
          <h2 className="mt-2 text-4xl font-black">{quizzes.length ? `${averageQuiz}%` : "—"}</h2>
          <p className="mt-2 text-sm text-slate-300">{quizzes.length ? `Average across ${quizzes.length} quiz attempt${quizzes.length === 1 ? "" : "s"}.` : "Complete a checkpoint quiz to start tracking performance."}</p>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold"><Trophy size={17} className="text-blue-200"/> Quiz performance</div>
        </div>
      </div>

      {recent.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Recent activity</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">Your latest learning wins</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {recent.map(item => (
              <Link key={`${item.kind}-${item.key}`} href={item.kind === "lab" ? `/labs/${item.course_slug}/${labs.find(l => l.lab_id === item.key)?.lab_slug ?? ""}` : `/learn/${item.course_slug}/${item.key.split("/").slice(1).join("/")}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-blue-100 hover:bg-blue-50/40">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#155eef]">{item.kind === "lab" ? <FlaskConical size={13}/> : <CheckCircle2 size={13}/>} {item.kind === "lab" ? "Lab passed" : "Lesson completed"}</p>
                <p className="mt-1 font-extrabold text-[#0b1f3a]">{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{new Date(item.completed_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Your courses</p><h2 className="mt-1 text-2xl font-black text-[#0b1f3a]">Learning paths</h2></div><Link href="/courses" className="hidden text-sm font-extrabold text-[#155eef] sm:block">View all courses</Link></div>
        <div className="grid gap-4 md:grid-cols-2">
          {initialCourses.map(course => {
            const done = course.lessons.filter(lesson => completedKeys.has(`${course.slug}/${lesson.slug}`)).length;
            const courseLabs = labs.filter(lab => lab.course_slug === course.slug);
            const percent = course.lessons.length ? Math.round((done / course.lessons.length) * 100) : 0;
            const firstIncomplete = course.lessons.find(lesson => !completedKeys.has(`${course.slug}/${lesson.slug}`)) ?? course.lessons[0];
            return <article key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-widest text-[#155eef]">{course.level}</p><h3 className="mt-2 text-xl font-black text-[#0b1f3a]">{course.title}</h3></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{done}/{course.lessons.length}</span></div><p className="mt-3 text-sm leading-6 text-slate-500">{course.description}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#155eef]" style={{ width: `${percent}%` }} /></div><div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs font-bold text-slate-400">{percent}% lessons complete · {courseLabs.length} lab{courseLabs.length === 1 ? "" : "s"} passed</span>{firstIncomplete ? <Link href={`/learn/${course.slug}/${firstIncomplete.slug}`} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#155eef]">{done === course.lessons.length ? "Review" : "Continue"} <ArrowRight size={15}/></Link> : null}</div></article>;
          })}
        </div>
      </section>
    </div>
  );
}