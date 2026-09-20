import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, PlayCircle, FlaskConical, LockKeyhole, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { getCourseFromDb, getLabs } from "@/lib/courses";
import CourseProgress from "@/components/course/CourseProgress";
import CertificateCard from "@/components/course/CertificateCard";

export default async function CoursePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const course=await getCourseFromDb(slug);
  if(!course) notFound();
  const labs = await getLabs(slug);
  const comingSoon = course.status === "coming_soon";
  const premium = course.accessTier === "premium";

  return <main className="min-h-screen bg-[#f8fafc]">
    <header className="bg-[#0b1f3a] text-white"><div className="mx-auto max-w-5xl px-6 py-14">
      <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-blue-200 hover:text-white"><ArrowLeft size={16}/> All courses</Link>
      <div className="mt-10 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-200">{course.level}</span>
          {comingSoon && <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-200">Coming soon</span>}
          {premium && <span className="inline-flex items-center gap-1 rounded-full bg-violet-400/15 px-3 py-1 text-xs font-bold text-violet-200"><LockKeyhole size={12}/> Premium</span>}
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{course.title}</h1><p className="mt-5 text-lg leading-8 text-slate-300">{course.description}</p>
        <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold text-slate-300"><span className="inline-flex items-center gap-2"><PlayCircle size={16}/> {course.lessons.length} lessons</span><span className="inline-flex items-center gap-2"><Clock3 size={16}/> {course.duration}</span></div>
      </div>
    </div></header>

    <section className="mx-auto max-w-5xl px-6 py-12">
      {comingSoon ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
        <div className="flex items-start gap-4"><Sparkles className="mt-1 text-amber-600" size={24}/><div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-amber-700">Coming soon</p><h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">This learning path is being prepared.</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">The curriculum, quizzes and practical work are being built before release. Check back as UTECH expands the Learning Hub.</p></div></div>
      </div> : <div className="rounded-2xl border border-slate-200 bg-white p-7">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Course roadmap</p><h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">What you will learn</h2>
        <div className="mt-7 grid gap-3">{course.lessons.map((lesson,index)=><Link href={`/learn/${course.slug}/${lesson.slug}`} key={lesson.slug} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-blue-100 hover:bg-blue-50/40"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[#155eef]">{index+1}</div><div className="flex-1"><div className="font-bold text-[#0b1f3a]">{lesson.title}</div>{lesson.accessTier === "premium" && <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-violet-600"><LockKeyhole size={11}/> Premium lesson</span>}</div><CheckCircle2 size={18} className="text-slate-300"/></Link>)}</div>
        <CourseProgress courseSlug={course.slug} lessonCount={course.lessons.length} firstLesson={course.lessons[0]?.slug ?? ""}/><CertificateCard courseSlug={course.slug} lessonCount={course.lessons.length}/>
      </div>}

      {labs.length > 0 && <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Hands-on practice</p><h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">Practical labs</h2></div><FlaskConical className="text-[#155eef]" size={24}/></div>
        <p className="mt-3 text-sm leading-6 text-slate-500">Turn the concepts into practical work. Some advanced labs require the premium tier.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {labs.map(lab => <Link href={`/labs/${course.slug}/${lab.slug}`} key={lab.id} className="block rounded-xl border border-slate-100 bg-slate-50 p-5 hover:border-blue-200 hover:bg-blue-50/30">
            <div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-[#0b1f3a]">{lab.title}</h3><p className="mt-1 text-xs font-bold text-slate-400">{lab.difficulty} · {lab.estimatedMinutes} min</p></div>{lab.accessTier === "premium" ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-extrabold text-violet-700"><LockKeyhole size={11}/> Premium</span> : <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">Free</span>}</div>
            <p className="mt-3 text-sm leading-6 text-slate-500">{lab.summary}</p>
            <div className="mt-4">{lab.status === "coming_soon" ? <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700"><Sparkles size={15}/> Coming soon</span> : <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155eef]"><FlaskConical size={15}/> Guided lab ready</span>}</div>
          </Link>)}
        </div>
      </section>}
    </section>
  </main>;
}
