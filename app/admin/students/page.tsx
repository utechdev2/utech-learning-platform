import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminStudentsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/auth/sign-in?next=/admin/students");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", claims.claims.sub).maybeSingle();
  if (!profile || !["admin", "instructor"].includes(profile.role)) redirect("/dashboard");

  const { data: students } = await supabase.from("profiles").select("id,full_name,created_at,role").eq("role","student").order("created_at",{ascending:false});

  const ids = (students ?? []).map(s => s.id);
  const { data: progress } = ids.length ? await supabase.from("lesson_progress").select("user_id").in("user_id", ids) : { data: [] as {user_id:string}[] };
  const counts = new Map<string,number>();
  for (const row of progress ?? []) counts.set(row.user_id, (counts.get(row.user_id) ?? 0) + 1);

  return <main className="min-h-screen bg-[#f8fafc] px-6 py-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#155eef]"><ArrowLeft size={16}/> Admin dashboard</Link>
    <div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-widest text-[#155eef]">Learner management</p><h1 className="mt-2 text-4xl font-black text-[#0b1f3a]">Students</h1></div><span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm"><Users size={16} className="mr-2 inline"/> {(students ?? []).length} learners</span></div>
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-slate-100 px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-slate-400"><span>Learner</span><span>Joined</span><span>Lessons</span></div>{(students ?? []).map(student => <div key={student.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-6 py-5 last:border-0"><div><p className="font-extrabold text-[#0b1f3a]">{student.full_name || "Unnamed student"}</p><p className="mt-1 text-xs text-slate-400">{student.id}</p></div><span className="text-sm text-slate-500">{new Date(student.created_at).toLocaleDateString()}</span><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-[#155eef]">{counts.get(student.id) ?? 0}</span></div>)}</div>
  </div></main>;
}
