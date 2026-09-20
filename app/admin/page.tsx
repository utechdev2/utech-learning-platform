import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, BookOpen, Award, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";
import { courses } from "@/data/courses";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/auth/sign-in?next=/admin");

  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id", userId).maybeSingle();
  if (!profile || !["admin", "instructor"].includes(profile.role)) redirect("/dashboard");

  const [students, progress, quizzes, certificates] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("lesson_progress").select("id", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    ["Students", students.count ?? 0, Users],
    ["Courses", courses.length, BookOpen],
    ["Lesson completions", progress.count ?? 0, BarChart3],
    ["Certificates", certificates.count ?? 0, Award],
  ] as const;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-black text-[#0b1f3a]">UTECH Learning Hub</Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-extrabold text-[#155eef]"><ShieldCheck size={15}/> {profile.role}</span>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#155eef]">Administration</p>
        <h1 className="mt-2 text-4xl font-black text-[#0b1f3a]">Learning Hub control center.</h1>
        <p className="mt-3 text-slate-500">Monitor learners, course activity, assessments and credentials.</p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label,value,Icon]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><Icon size={21} className="text-[#155eef]"/><p className="mt-5 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-3xl font-black text-[#0b1f3a]">{value}</p></div>)}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3"><Link href="/admin/students" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200"><Users className="text-[#155eef]" size={21}/><h2 className="mt-4 font-black text-[#0b1f3a]">Learners</h2><p className="mt-1 text-sm text-slate-500">View student activity and progress.</p><ArrowRight className="mt-4 text-[#155eef]" size={17}/></Link><Link href="/admin/analytics" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200"><BarChart3 className="text-[#155eef]" size={21}/><h2 className="mt-4 font-black text-[#0b1f3a]">Quiz analytics</h2><p className="mt-1 text-sm text-slate-500">Review assessment performance.</p><ArrowRight className="mt-4 text-[#155eef]" size={17}/></Link><Link href="/courses" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200"><BookOpen className="text-[#155eef]" size={21}/><h2 className="mt-4 font-black text-[#0b1f3a]">Course catalog</h2><p className="mt-1 text-sm text-slate-500">Open the learner-facing catalog.</p><ArrowRight className="mt-4 text-[#155eef]" size={17}/></Link></div><div className="mt-8 grid gap-6 lg:grid-cols-2>
          <div className="rounded-2xl border border-slate-200 bg-white p-7"><p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Course catalog</p><h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">Current learning paths</h2><div className="mt-5 space-y-3">{courses.map(course => <div key={course.slug} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><span className="font-bold text-[#0b1f3a]">{course.title}</span><span className="text-xs font-bold text-slate-400">{course.lessons.length} lessons</span></div>)}</div></div>
          <div className="rounded-2xl bg-[#0b1f3a] p-7 text-white"><p className="text-xs font-extrabold uppercase tracking-widest text-blue-200">Management phase</p><h2 className="mt-2 text-2xl font-black">Control center foundation is live.</h2><p className="mt-4 text-sm leading-7 text-slate-300">The next admin modules can add learner search, course editing, lesson management, quiz analytics and certificate management without exposing student data to ordinary accounts.</p><Link href="/courses" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#0b1f3a]">View learning hub</Link></div>
        </div>
      </section>
    </main>
  );
}
