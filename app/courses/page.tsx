import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Network, ShieldCheck, Terminal } from "lucide-react";

const courses = [
  { slug:"python-programming", title:"Python Programming", description:"Learn Python from fundamentals to practical applications.", icon:Code2, level:"Beginner", lessons:24, duration:"8h" },
  { slug:"computer-networking", title:"Computer Networking", description:"Understand networks, protocols, topologies and infrastructure.", icon:Network, level:"Beginner → Intermediate", lessons:28, duration:"10h" },
  { slug:"cybersecurity", title:"Cybersecurity Foundations", description:"Build practical security knowledge and defensive thinking.", icon:ShieldCheck, level:"Beginner", lessons:22, duration:"7h" },
  { slug:"linux-essentials", title:"Linux Essentials", description:"Master the terminal, filesystem, permissions and core tools.", icon:Terminal, level:"Beginner", lessons:20, duration:"6h" },
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="bg-[#0b1f3a] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Link href="/" className="text-sm font-bold text-blue-200 hover:text-white">← UTECH Learning Hub</Link>
          <p className="mt-10 text-sm font-extrabold uppercase tracking-[0.2em] text-blue-300">Course catalogue</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Choose what you want to learn.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Structured technology courses designed to move you from concepts to practical skills.</p>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map(({slug,title,description,icon:Icon,level,lessons,duration}) => (
            <article key={slug} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-13 w-13 items-center justify-center rounded-xl bg-blue-50 text-[#155eef]"><Icon size={25}/></div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{level}</span>
              </div>
              <h2 className="mt-7 text-2xl font-black text-[#0b1f3a]">{title}</h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-500">{description}</p>
              <div className="mt-6 flex gap-5 text-sm font-semibold text-slate-500"><span>{lessons} lessons</span><span>•</span><span>{duration}</span></div>
              <Link href={`/courses/${slug}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0b1f3a] px-5 py-3 font-bold text-white hover:bg-[#122d52]">View course <ArrowRight size={17}/></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}