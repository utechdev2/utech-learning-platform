import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Menu } from "lucide-react";
import { notFound } from "next/navigation";

const lessons: Record<string,string[]> = {
  "python-programming":["What is Python?","Variables and data types","Input and output","Conditions","Loops","Functions"],
  "computer-networking":["What is a network?","Network types","Network topologies","OSI model","IP addressing","Routing basics"],
  "cybersecurity":["Security fundamentals","Threats and vulnerabilities","Authentication","Access control","Network security","Defensive thinking"],
  "linux-essentials":["The Linux terminal","Files and directories","Permissions","Processes","Packages","Shell productivity"],
};

export default async function LessonPage({params}:{params:Promise<{course:string;lesson:string}>}) {
  const {course,lesson}=await params;
  const list=lessons[course];
  if(!list) notFound();
  const index=Math.max(0,Math.min(list.length-1,Number(lesson.replace("lesson-",""))-1||0));
  const title=list[index];
  const next=index+1<list.length?`/learn/${course}/lesson-${index+2}`: `/courses/${course}`;
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href={`/courses/${course}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3a]"><ArrowLeft size={16}/> Course overview</Link>
          <div className="hidden items-center gap-2 text-sm font-bold text-slate-500 md:flex"><Menu size={17}/> Lesson {index+1} of {list.length}</div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6 lg:h-fit">
          <p className="px-3 pb-3 text-xs font-extrabold uppercase tracking-widest text-slate-400">Course lessons</p>
          <div className="space-y-1">{list.map((item,i)=><Link key={item} href={`/learn/${course}/lesson-${i+1}`} className={`block rounded-lg px-3 py-3 text-sm font-semibold ${i===index?"bg-blue-50 text-[#155eef]":"text-slate-600 hover:bg-slate-50"}`}><span className="mr-2 text-xs text-slate-400">{String(i+1).padStart(2,"0")}</span>{item}</Link>)}</div>
        </aside>
        <article className="min-h-[650px] rounded-2xl border border-slate-200 bg-white p-7 md:p-12">
          <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Lesson {index+1}</span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0b1f3a] md:text-5xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">This lesson is part of the UTECH Learning Hub curriculum. We will break the concept down, connect it to real technology, and finish with a practical checkpoint.</p>
          <div className="mt-10 rounded-2xl bg-[#f5f8fc] p-6"><h2 className="text-lg font-extrabold text-[#0b1f3a]">Learning checkpoint</h2><p className="mt-2 leading-7 text-slate-500">Read the lesson content, take notes, then continue when you are ready.</p></div>
          <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"><CheckCircle2 size={18}/> Mark lesson complete</div>
            <Link href={next} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155eef] px-6 py-3 font-bold text-white hover:bg-blue-700">Continue <ArrowRight size={17}/></Link>
          </div>
        </article>
      </div>
    </main>
  );
}