import Link from "next/link";
import { ArrowLeft, ArrowRight, Menu, FlaskConical, LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";
import { getCourseFromDb, getLabs } from "@/lib/courses";
import CourseLessonList from "@/components/course/CourseLessonList";
import LessonCheckpoint from "@/components/lesson/LessonCheckpoint";
import LessonContent from "@/components/lesson/LessonContent";
import LessonSlides from "@/components/lesson/LessonSlides";

export default async function LessonPage({params}:{params:Promise<{course:string;lesson:string}>}) {
  const {course:courseSlug, lesson:lessonSlug}=await params;
  const course=await getCourseFromDb(courseSlug);
  const lesson=course?.lessons.find(item=>item.slug===lessonSlug);
  if(!course || !lesson) notFound();
  const labs = await getLabs(courseSlug);
  const lessonLabs = labs.filter(lab => lab.lessonSlug === lesson.slug);

  const index=course.lessons.findIndex(item=>item.slug===lesson.slug);
  const previousLesson=course.lessons[index-1];
  const nextLesson=course.lessons[index+1];
  const previousHref=previousLesson ? `/learn/${course.slug}/${previousLesson.slug}` : `/courses/${course.slug}`;
  const nextHref=nextLesson ? `/learn/${course.slug}/${nextLesson.slug}` : `/courses/${course.slug}`;

  return <main className="min-h-screen bg-[#f8fafc]">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3a]"><ArrowLeft size={16}/> Course overview</Link>
        <div className="hidden items-center gap-2 text-sm font-bold text-slate-500 md:flex"><Menu size={17}/> Lesson {index+1} of {course.lessons.length}</div>
      </div>
    </header>

    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6 lg:h-fit">
        <p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Course lessons</p>
        <CourseLessonList courseSlug={course.slug} lessons={course.lessons} currentSlug={lesson.slug}/>
      </aside>

      <article className="min-h-[650px] rounded-2xl border border-slate-200 bg-white p-7 md:p-12">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Lesson {index+1}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{Math.round(((index+1)/course.lessons.length)*100)}% through course</span>
        </div>

        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0b1f3a] md:text-5xl">{lesson.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{lesson.summary}</p>

        <section className="mt-10 rounded-2xl border border-blue-100 bg-[#f5f8fc] p-6">
          <h2 className="text-lg font-extrabold text-[#0b1f3a]">Key concepts</h2>
          <ul className="mt-4 space-y-3">{lesson.points.map(point=><li key={point} className="flex gap-3 leading-7 text-slate-600"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#155eef]"/>{point}</li>)}</ul>
        </section>

        {lesson.content?.trim() && <>
          <LessonSlides content={lesson.content} />
          <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-extrabold text-[#0b1f3a]">Quick notes / text view</summary>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 md:p-8"><LessonContent content={lesson.content} /></div>
          </details>
        </>}

        {lessonLabs.length > 0 && (
          <section className="mt-10 overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-sm">
            <div className="border-b border-blue-100 bg-gradient-to-r from-[#0b1f3a] to-[#123b68] px-6 py-6 text-white md:px-8">
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10"><FlaskConical size={24}/></div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-200">Hands-on practical</p>
                    <h2 className="mt-1 text-2xl font-black">Now build it yourself</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">Leave the lesson slides and practise the skill in a real browser-based workspace.</p>
                  </div>
                </div>
                <span className="hidden rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-extrabold text-emerald-200 sm:inline-flex">PRACTICAL</span>
              </div>
            </div>

            <div className="grid gap-4 p-5 md:p-7 md:grid-cols-2">
              {lessonLabs.map(lab => (
                <Link key={lab.id} href={`/labs/${course.slug}/${lab.slug}`} className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-[#0b1f3a] group-hover:text-[#155eef]">{lab.title}</h3>
                      {lab.accessTier === "premium" ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-extrabold text-violet-700"><LockKeyhole size={11}/> Premium</span> : <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">Free</span>}
                    </div>
                    <p className="mt-2 text-xs font-bold text-slate-400">{lab.difficulty} · {lab.estimatedMinutes} min</p>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{lab.summary}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-sm font-extrabold text-[#155eef]">{lab.status === "coming_soon" ? "Coming soon" : "Open lab"}</span>
                    <ArrowRight size={18} className="text-[#155eef] transition group-hover:translate-x-1"/>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <LessonCheckpoint courseSlug={course.slug} lessonSlug={lesson.slug} question={lesson.quiz.question} options={lesson.quiz.options} answer={lesson.quiz.answer} nextHref={nextHref} />

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <Link href={previousHref} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:border-blue-200 hover:text-[#155eef]"><ArrowLeft size={16}/> {previousLesson ? "Previous lesson" : "Course overview"}</Link>
          <Link href={nextHref} className="inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">{nextLesson ? "Next lesson" : "Finish course"} <ArrowRight size={16}/></Link>
        </div>
      </article>
    </div>
  </main>;
}
