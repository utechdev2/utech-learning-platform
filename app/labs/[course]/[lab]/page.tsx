import Link from "next/link";
import { ArrowLeft, Clock3, FlaskConical, LockKeyhole, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getCourseFromDb, getLab } from "@/lib/courses";
import InteractiveLab from "@/components/labs/InteractiveLab";

const starters: Record<string, { runtime: "python" | "clangpp" | "sqlite"; code: string }> = {
  "python-function-lab": {
    runtime: "python",
    code: "def greet(name):\n    return f\"Hello, {name}! Welcome to UTECH.\"\n\nname = input(\"Enter your name: \")\nprint(greet(name))\n",
  },
  "cpp-coding-lab": {
    runtime: "clangpp",
    code: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> scores = {72, 85, 91, 64, 88};\n    int total = 0;\n\n    for (int score : scores) {\n        total += score;\n    }\n\n    double average = static_cast<double>(total) / scores.size();\n    cout << \"Average: \" << average << endl;\n    return 0;\n}\n",
  },
  "sql-database-lab": {
    runtime: "sqlite",
    code: "CREATE TABLE students (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  age INTEGER NOT NULL\n);\n\nINSERT INTO students (name, age) VALUES\n  ('Oscar', 19),\n  ('Ama', 20),\n  ('Kojo', 21);\n\nSELECT * FROM students ORDER BY age;\n",
  },
};

export default async function LabPage({ params }: { params: Promise<{ course: string; lab: string }> }) {
  const { course: courseSlug, lab: labSlug } = await params;
  const [course, lab] = await Promise.all([getCourseFromDb(courseSlug), getLab(courseSlug, labSlug)]);
  if (!course || !lab) notFound();

  const starter = starters[lab.slug];
  const premium = lab.accessTier === "premium";
  const backHref = lab.lessonSlug ? "/learn/" + course.slug + "/" + lab.lessonSlug : "/courses/" + course.slug;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-bold text-[#0b1f3a]"><ArrowLeft size={16} /> Back to lesson</Link>
          <span className="hidden items-center gap-2 text-xs font-bold text-slate-500 md:flex"><ShieldCheck size={15} /> UTECH sandbox</span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-[#155eef]"><FlaskConical size={13} /> Practical lab</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"><Clock3 size={13} /> {lab.estimatedMinutes} min</span>
            {premium && <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-violet-700"><LockKeyhole size={12} /> Premium</span>}
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0b1f3a] md:text-5xl">{lab.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{lab.summary}</p>
        </div>

        {premium ? (
          <section className="rounded-2xl border border-violet-200 bg-white p-8 shadow-sm">
            <LockKeyhole className="text-violet-600" size={30} />
            <h2 className="mt-4 text-2xl font-black text-[#0b1f3a]">Premium practical</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">This lab is part of UTECH Premium. The workspace is defined, but access will be opened by the subscription entitlement system.</p>
            <div className="mt-6 max-w-2xl rounded-xl bg-violet-50 p-4 text-sm font-semibold leading-6 text-violet-900">Premium execution is protected server-side. We will connect this to subscriptions before selling access.</div>
          </section>
        ) : starter ? (
          <InteractiveLab runtime={starter.runtime} starterCode={starter.code} labTitle={lab.title} />
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-8"><p className="text-slate-600">{lab.instructions}</p></section>
        )}

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-black text-[#0b1f3a]">Lab instructions</h2>
          <div className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">{lab.instructions}</div>
        </section>
      </section>
    </main>
  );
}
