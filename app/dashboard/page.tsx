import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, LayoutDashboard } from "lucide-react";

const stats=[["Courses","12",BookOpen],["Completed","5",CheckCircle2],["Learning hours","48",Clock3],["Day streak","14",Flame]];

export default function DashboardPage(){
 return <main className="min-h-screen bg-[#f8fafc]">
  <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1f3a] font-black text-white">U</span><span className="font-black text-[#0b1f3a]">UTECH Learning Hub</span></Link><span className="hidden items-center gap-2 text-sm font-bold text-slate-500 md:flex"><LayoutDashboard size={17}/> Student Dashboard</span></div></header>
  <section className="mx-auto max-w-7xl px-6 py-12"><p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#155eef]">Your learning</p><h1 className="mt-2 text-4xl font-black text-[#0b1f3a]">Keep building your skills.</h1>
   <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label,value,Icon])=><div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-6"><Icon className="text-[#155eef]" size={21}/><p className="mt-5 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-3xl font-black text-[#0b1f3a]">{value}</p></div>)}</div>
   <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]"><div className="rounded-2xl border border-slate-200 bg-white p-7"><div className="flex items-end justify-between"><div><p className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Continue</p><h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">Linux Essentials</h2></div><span className="font-black text-[#155eef]">35%</span></div><div className="mt-6 h-3 rounded-full bg-slate-100"><div className="h-full w-[35%] rounded-full bg-[#155eef]"/></div><p className="mt-4 text-sm text-slate-500">You are making progress. Pick up where you left off.</p><Link href="/learn/linux-essentials/lesson-1" className="mt-6 inline-flex items-center gap-2 font-bold text-[#155eef]">Continue lesson <ArrowRight size={16}/></Link></div>
   <div className="rounded-2xl bg-[#0b1f3a] p-7 text-white"><p className="text-sm font-bold text-blue-200">Learning habit</p><h2 className="mt-2 text-2xl font-black">14 day streak 🔥</h2><p className="mt-3 text-sm leading-6 text-slate-300">Keep showing up. Consistency turns lessons into skills.</p></div></div>
  </section>
 </main>
}