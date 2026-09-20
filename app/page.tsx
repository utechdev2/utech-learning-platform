import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Network, ShieldCheck, Terminal, Sparkles } from "lucide-react";

const courses = [
  { title: "Python Programming", slug: "python-programming", description: "Build your programming foundation from the ground up.", icon: Code2, level: "Beginner" },
  { title: "Computer Networking", slug: "computer-networking", description: "Understand networks, protocols, topologies and real infrastructure.", icon: Network, level: "Beginner → Intermediate" },
  { title: "Cybersecurity", slug: "cybersecurity-foundations", description: "Learn practical security concepts and defensive thinking.", icon: ShieldCheck, level: "Beginner" },
  { title: "Linux Essentials", slug: "linux-essentials", description: "Master the command line, filesystems, permissions and core tools.", icon: Terminal, level: "Beginner" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1f3a] text-sm font-black text-white">U</div>
            <div>
              <p className="text-base font-extrabold tracking-tight text-[#0b1f3a]">UTECH</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Learning Hub</p>
            </div>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/courses" className="hover:text-[#155eef]">Courses</Link>
            <a href="#about" className="hover:text-[#155eef]">How it works</a>
            <Link href="/auth/sign-in" className="rounded-lg bg-[#0b1f3a] px-5 py-2.5 text-white hover:bg-[#122d52]">Sign in</Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[#0b1f3a]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <Sparkles size={15} /> Welcome to Utech Learning Hub
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl">
              Learn. Build. <span className="text-blue-300">Grow.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              A modern learning platform for people who want to understand technology, build real skills, and turn knowledge into practical projects.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/courses" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-[#0b1f3a] shadow-lg hover:bg-slate-100">
                Explore courses <ArrowRight size={18} />
              </Link>
              <a href="#about" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 font-bold text-white hover:bg-white/10">
                See how it works
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-sm">
            <div className="rounded-2xl bg-white p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Your learning</p>
                  <h2 className="mt-1 text-xl font-extrabold text-[#0b1f3a]">Continue learning</h2>
                </div>
                <BookOpen className="text-[#155eef]" />
              </div>
              <div className="mt-6 rounded-2xl bg-[#f5f8fc] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#0b1f3a]">Linux Essentials</p>
                  <span className="text-sm font-bold text-[#155eef]">35%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[35%] rounded-full bg-[#155eef]" />
                </div>
                <p className="mt-3 text-sm text-slate-500">Keep going — your next lesson is waiting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#155eef]">Start learning</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b1f3a] md:text-4xl">Build skills that matter.</h2>
            <p className="mt-3 max-w-2xl text-slate-500">Structured courses designed around practical technology skills.</p>
          </div>
          <Link href="/courses" className="inline-flex items-center gap-2 font-bold text-[#155eef]">View all courses <ArrowRight size={17} /></Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {courses.map(({ title, slug, description, icon: Icon, level }) => (
            <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#155eef]">
                <Icon size={23} />
              </div>
              <span className="mt-6 inline-block text-xs font-bold uppercase tracking-wider text-slate-400">{level}</span>
              <h3 className="mt-2 text-xl font-extrabold text-[#0b1f3a]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
              <Link href={`/courses/${slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#155eef]">View course <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="border-y border-slate-200 bg-[#f5f8fc]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-3">
          {[
            ["01", "Learn at your pace", "Follow structured lessons and build understanding one concept at a time."],
            ["02", "Practice by doing", "Turn lessons into practical exercises, quizzes and projects."],
            ["03", "Track your growth", "Your dashboard will keep your courses, progress and achievements in one place."],
          ].map(([num, title, text]) => (
            <div key={num}>
              <p className="text-sm font-black text-[#155eef]">{num}</p>
              <h3 className="mt-3 text-xl font-extrabold text-[#0b1f3a]">{title}</h3>
              <p className="mt-2 leading-7 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#07172b] px-6 py-10 text-center text-sm text-slate-400">
        <p className="font-bold text-white">UTECH Learning Hub</p>
        <p className="mt-2">Learn. Build. Grow.</p>
      </footer>
    </main>
  );
}