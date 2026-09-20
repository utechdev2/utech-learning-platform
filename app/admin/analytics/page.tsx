import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { courses } from "@/data/courses";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/auth/sign-in?next=/admin/analytics");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", claims.claims.sub).maybeSingle();
  if (!profile || !["admin", "instructor"].includes(profile.role)) redirect("/dashboard");

  const { data: attempts } = await supabase.from("quiz_attempts").select("course_slug,lesson_slug,score,attempted_at").order("attempted_at",{ascending:false});
  const grouped = courses.map(course => {
    const rows = (attempts ?? []).filter(a => a.course_slug === course.slug);
    return { course, attempts: rows.length, average: rows.length ? Math.round(rows.reduce((s,r)=>s+r.score,0)/rows.length) : 0 };
  });

  return <main className="min-h-screen bg-[#f8fafc] px-6 py-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#155eef]"><ArrowLeft size={16}/> Admin dashboard</Link>
    <div className="mt-8"><p className="text-sm font-extrabold uppercase tracking-widest text-[#155eef]">Assessment analytics</p><h1 className="mt-2 text-4xl font-black text-[#0b1f3a]">Quiz performance</h1></div>
    <div className="mt-8 grid gap-4 md:grid-cols-2">{grouped.map(({course,attempts,average})=><article key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><BarChart3 className="text-[#155eef]" size={20}/><h2 className="font-black text-[#0b1f3a]">{course.title}</h2></div><div className="mt-7 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Attempts</p><p className="mt-1 text-3xl font-black text-[#0b1f3a]">{attempts}</p></div><div className="text-right"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Average</p><p className="mt-1 text-3xl font-black text-[#155eef]">{attempts ? average + "%" : "—"}</p></div></div></article>)}</div>
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7"><p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Recent attempts</p><div className="mt-5 space-y-3">{(attempts ?? []).slice(0,10).map((a,i)=><div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><p className="font-bold text-[#0b1f3a]">{courses.find(c=>c.slug===a.course_slug)?.title ?? a.course_slug}</p><p className="text-xs text-slate-400">{a.lesson_slug}</p></div><span className="font-black text-[#155eef]">{a.score}%</span></div>)}</div></div>
  </div></main>;
}
