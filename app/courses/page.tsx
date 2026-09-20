import Link from "next/link";
import { ArrowRight, Code2, Network, ShieldCheck, Terminal, LockKeyhole, Sparkles } from "lucide-react";
import { getCourses } from "@/lib/courses";

const icons = { "python-programming": Code2, "computer-networking": Network, cybersecurity: ShieldCheck, "linux-essentials": Terminal, "cpp-programming": Code2, "java-programming": Code2, "system-administration": Terminal };

export default async function CoursesPage() {
  const courses = await getCourses();
  return <main className="min-h-screen bg-[#f8fafc]">
    <header className="bg-[#0b1f3a] text-white"><div className="mx-auto max-w-7xl px-6 py-16">
      <Link href="/" className="text-sm font-bold text-blue-200 hover:text-white">← UTECH Learning Hub</Link>
      <p className="mt-10 text-sm font-extrabold uppercase tracking-[0.2em] text-blue-300">Course catalogue</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Choose what you want to learn.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Structured technology courses designed to move you from concepts to practical skills.</p>
    </div></header>
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <div className="flex items-start gap-3"><Sparkles className="mt-0.5 text-[#155eef]" size={20}/><div><p className="font-black text-[#0b1f3a]">The UTECH catalogue is growing.</p><p className="mt-1 text-sm leading-6 text-slate-600">New programming, systems, database, mathematics, AI and DevOps paths are being prepared. Some advanced courses and practical labs will be part of the premium learning tier.</p></div></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
      {courses.map(course => {
        const Icon = icons[course.slug as keyof typeof icons] ?? BookOpenFallback;
        const comingSoon = course.status === "coming_soon";
        const premium = course.accessTier === "premium";
        return <article key={course.slug} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-blue-50 text-[#155eef]"><Icon size={25}/></div>
            <div className="flex flex-wrap justify-end gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{course.level}</span>
              {comingSoon && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">Coming soon</span>}
              {premium && <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-700"><LockKeyhole size={12}/> Premium</span>}
            </div>
          </div>
          <h2 className="mt-7 text-2xl font-black text-[#0b1f3a]">{course.title}</h2><p className="mt-3 max-w-xl leading-7 text-slate-500">{course.description}</p>
          <div className="mt-6 flex gap-5 text-sm font-semibold text-slate-500"><span>{course.lessons.length} lessons</span><span>•</span><span>{course.duration}</span></div>
          {comingSoon ? <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 font-bold text-amber-800"><Sparkles size={17}/> Curriculum in preparation</div> : <Link href={`/courses/${course.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0b1f3a] px-5 py-3 font-bold text-white hover:bg-[#122d52]">View course <ArrowRight size={17}/></Link>}
        </article>;
      })}
      </div>
    </section>
  </main>;
}
function BookOpenFallback({size=25}:{size?:number}) { return <span style={{fontSize:size}}>▣</span>; }
