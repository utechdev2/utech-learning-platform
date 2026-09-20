import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";

const data: Record<string,{title:string;description:string;level:string;lessons:number;duration:string;modules:string[]}> = {
  "python-programming": {title:"Python Programming",description:"A practical foundation in Python programming, from variables and conditions to functions, collections and small projects.",level:"Beginner",lessons:24,duration:"8 hours",modules:["Python fundamentals","Conditions and loops","Functions and modules","Lists, dictionaries and sets","Files and error handling","Mini projects"]},
  "computer-networking": {title:"Computer Networking",description:"Understand how devices communicate and how modern networks are designed, configured and secured.",level:"Beginner → Intermediate",lessons:28,duration:"10 hours",modules:["Network foundations","OSI and TCP/IP models","IP addressing and subnetting","Network topologies","Routing and switching","Network troubleshooting"]},
  "cybersecurity": {title:"Cybersecurity Foundations",description:"Learn the principles, terminology and defensive habits behind practical cybersecurity.",level:"Beginner",lessons:22,duration:"7 hours",modules:["Security fundamentals","Threats and vulnerabilities","Authentication and access control","Network security","Secure systems","Security assessments"]},
  "linux-essentials": {title:"Linux Essentials",description:"Build confidence with Linux through the terminal, filesystem, permissions, processes and essential administration tasks.",level:"Beginner",lessons:20,duration:"6 hours",modules:["Terminal fundamentals","Files and directories","Permissions and ownership","Processes and services","Package management","Shell productivity"]},
};

export default async function CoursePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const course=data[slug];
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
            <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold text-slate-300"><span className="inline-flex items-center gap-2"><PlayCircle size={16}/> {course.lessons} lessons</span><span className="inline-flex items-center gap-2"><Clock3 size={16}/> {course.duration}</span></div>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Course roadmap</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b1f3a]">What you will learn</h2>
          <div className="mt-7 grid gap-3">
            {course.modules.map((module,index)=><div key={module} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-[#155eef]">{index+1}</div><div className="flex-1 font-bold text-[#0b1f3a]">{module}</div><CheckCircle2 size={18} className="text-slate-300"/></div>)}
          </div>
          <Link href={`/learn/${slug}/lesson-1`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#155eef] px-6 py-3.5 font-bold text-white hover:bg-blue-700">Start course <ArrowRight size={18}/></Link>
        </div>
      </section>
    </main>
  );
}