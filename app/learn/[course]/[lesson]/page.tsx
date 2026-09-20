import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";
import { notFound } from "next/navigation";
import { getCourseFromDb } from "@/lib/courses";
import LessonProgress from "@/components/lesson/LessonProgress";
import CourseLessonList from "@/components/course/CourseLessonList";
import Quiz from "@/components/lesson/Quiz";
import LessonContent from "@/components/lesson/LessonContent";

export default async function LessonPage({params}:{params:Promise<{course:string;lesson:string}>}) {
  const {course:courseSlug, lesson:lessonSlug}=await params; const course=await getCourseFromDb(courseSlug); const lesson=course?.lessons.find(item=>item.slug===lessonSlug);
  if(!course || !lesson) notFound();
  const index=course.lessons.findIndex(item=>item.slug===lesson.slug); const nextLesson=course.lessons[index+1];
  const nextHref=nextLesson ? `/learn/${course.slug}/${nextLesson.slug}` : `/courses/${course.slug}`;
  return <main className="min-h-screen bg-[#f8fafc]"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3a]"><ArrowLeft size={16}/> Course overview</Link><div className="hidden items-center gap-2 text-sm font-bold text-slate-500 md:flex"><Menu size={17}/> Lesson {index+1} of {course.lessons.length}</div></div></header>
  <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]"><aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6 lg:h-fit"><p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Course lessons</p><CourseLessonList courseSlug={course.slug} lessons={course.lessons} currentSlug={lesson.slug}/></aside>
  <article className="min-h-[650px] rounded-2xl border border-slate-200 bg-white p-7 md:p-12"><span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Lesson {index+1}</span><h1 className="mt-4 text-4xl font-black tracking-tight text-[#0b1f3a] md:text-5xl">{lesson.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{lesson.summary}</p>
  <section className="mt-10 rounded-2xl border border-blue-100 bg-[#f5f8fc] p-6"><h2 className="text-lg font-extrabold text-[#0b1f3a]">Key concepts</h2><ul className="mt-4 space-y-3">{lesson.points.map(point=><li key={point} className="flex gap-3 leading-7 text-slate-600"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#155eef]"/>{point}</li>)}</ul></section>{lesson.content?.trim()&&<section className="mt-8"><div className="mb-4 flex items-center gap-3"><span className="h-px flex-1 bg-slate-200"/><span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">Lesson notes</span><span className="h-px flex-1 bg-slate-200"/></div><div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8"><LessonContent content={lesson.content} /></div></section>}
  <section className="mt-8 rounded-2xl border border-slate-200 p-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">Checkpoint quiz</p><h2 className="mt-2 text-xl font-black text-[#0b1f3a]">{lesson.quiz.question}</h2><Quiz courseSlug={course.slug} lessonSlug={lesson.slug} question={lesson.quiz.question} options={lesson.quiz.options} answer={lesson.quiz.answer}/></section>
  <LessonProgress course={course.slug} lesson={lesson.slug} nextHref={nextHref}/></article></div></main>;
}
