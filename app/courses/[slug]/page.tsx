import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { getCourse } from "@/data/courses";

export default async function CoursePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const course=getCourse(slug);
  if(!course) notFound();
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="bg-[#0b1f3a] text-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-blue-200 hover:text-white"><ArrowLeft size={16}/> All courses</Link>
          <div className="mt-10 max-w-3xl">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-200">{course.level}</span>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{course.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{course.description}</p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold text-slate-300"><span className="inline-flex items-center gap-2"><PlayCircle size={16}/> {course.lessons.length} lessons</span><span className="inline-flex items-center gap-2"><Clock3 size={16}/> {course.duration}</span></div>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Course roadmap</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">What you will learn</h2>
          <div className="mt-7 grid gap-3">
            {course.lessons.map((lesson,index)=><Link href={`/learn/${course.slug}/${lesson.slug}`} key={lesson.slug} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-blue-100 hover:bg-blue-50/40"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[#155eef]">{index+1}</div><div className="flex-1 font-bold text-[#0b1f3a]">{lesson.title}</div><CheckCircle2 size={18} className="text-slate-300"/></Link>)}
          </div>
          <Link href={`/learn/${course.slug}/${course.lessons[0].slug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-6 py-3.5 font-bold text-white hover:bg-blue-700">Start course <ArrowRight size={18}/></Link>
        </div>
      </section>
    </main>
  );
}