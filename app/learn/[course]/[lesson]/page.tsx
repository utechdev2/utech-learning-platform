import Link from "next/link";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import { notFound } from "next/navigation";
import { getCourseFromDb, getLabs } from "@/lib/courses";
import CourseLessonList from "@/components/course/CourseLessonList";
import LessonCheckpoint from "@/components/lesson/LessonCheckpoint";
import LessonContent from "@/components/lesson/LessonContent";\nimport LessonSlides from "@/components/lesson/LessonSlides";

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

  return <main className="min-h-screen bg-[#f8fafc]"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3a]"><ArrowLeft size={16}/> Course overview</Link><div className="hidden items-center gap-2 text-sm font-bold text-slate-500 md:flex"><Menu size={17}/> Lesson {index+1} of {course.lessons.length}</div></div></header>
  <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]"><aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6 lg:h-fit"><p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Course lessons</p><CourseLessonList courseSlug={course.slug} lessons={course.lessons} currentSlug={lesson.slug}/></aside>
  <article className="min-h-[650px] rounded-2xl border border-slate-200 bg-white p-7 md:p-12"><div className="flex items-center justify-between gap-4"><span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Lesson {index+1}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{Math.round(((index+1)/course.lessons.length)*100)}% through course</span></div><h1 className="mt-4 text-4xl font-black tracking-tight text-[#0b1f3a] md:text-5xl">{lesson.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{lesson.summary}</p>
  <section className="mt-10 rounded-2xl border border-blue-100 bg-[#f5f8fc] p-6"><h2 className="text-lg font-extrabold text-[#0b1f3a]">Key concepts</h2><ul className="mt-4 space-y-3">{lesson.points.map(point=><li key={point} className="flex gap-3 leading-7 text-slate-600"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#155eef]"/>{point}</li>)}</ul></section>{lesson.content?.trim()&&<><LessonSlides content={lesson.content} /><details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-extrabold text-[#0b1f3a]">Quick notes / text view</summary><div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 md:p-8"><LessonContent content={lesson.content} /></div></details></>}
  {lessonLabs.length > 0 && <section className="mt-8 rounded-2xl border border-blue-100 bg-[#f5f8fc] p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Hands-on practical</p><h2 className="mt-2 text-xl font-black text-[#0b1f3a]">Open the lab</h2><p className="mt-2 text-sm leading-6 text-slate-600">Leave the lesson notes and practise the skill in a real browser-based workspace.</p></div></div><div className="mt-5 grid gap-3">{lessonLabs.map(lab=><Link key={lab.id} href={`/labs/${course.slug}/${lab.slug}`} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-200"><div><div className="font-bold text-[#0b1f3a]">{lab.title}</div><div className="mt-1 text-xs font-semibold text-slate-500">{lab.difficulty} · {lab.estimatedMinutes} min · {lab.accessTier === "premium" ? "Premium" : "Free"}</div></div><ArrowRight size={18} className="text-[#155eef]" /></Link>)}</div></section>}
  <LessonCheckpoint courseSlug={course.slug} lessonSlug={lesson.slug} question={lesson.quiz.question} options={lesson.quiz.options} answer={lesson.quiz.answer} nextHref={nextHref} />
  <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6"><Link href={previousHref} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:border-blue-200 hover:text-[#155eef]"><ArrowLeft size={16}/> {previousLesson ? "Previous lesson" : "Course overview"}</Link><Link href={nextHref} className="inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">{nextLesson ? "Next lesson" : "Finish course"} <ArrowRight size={16}/></Link></div>
  </article></div></main>;
}
