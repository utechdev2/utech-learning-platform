"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, Lightbulb } from "lucide-react";
import LessonContent from "@/components/lesson/LessonContent";

function splitSlides(content: string) {
  return content
    .split(/\n\s*---\s*\n/g)
    .map(slide => slide.trim())
    .filter(Boolean);
}

export default function LessonSlides({ content }: { content: string }) {
  const slides = useMemo(() => splitSlides(content), [content]);
  const [current, setCurrent] = useState(0);

  useEffect(() => setCurrent(0), [content]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setCurrent(value => Math.min(value + 1, slides.length - 1));
      if (event.key === "ArrowLeft") setCurrent(value => Math.max(value - 1, 0));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length]);

  if (!slides.length) return null;

  const progress = ((current + 1) / slides.length) * 100;
  const firstLine = slides[current].split("\n").find(line => line.trim().startsWith("#"))?.replace(/^#+\s*/, "") ?? "Lesson slide";

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-[#0b1f3a] px-5 py-4 text-white md:px-7">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-200">Interactive lesson</p>
            <p className="mt-1 truncate text-sm font-bold">{firstLine}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs font-extrabold">
            Slide {current + 1} of {slides.length}
          </span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-blue-300 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-slate-50 p-4 lg:block">
          <p className="px-2 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Lesson map</p>
          <div className="space-y-1.5">
            {slides.map((slide, index) => {
              const title = slide.split("\n").find(line => line.trim().startsWith("#"))?.replace(/^#+\s*/, "") ?? `Slide ${index + 1}`;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-xs font-bold transition ${index === current ? "bg-white text-[#155eef] shadow-sm ring-1 ring-blue-100" : "text-slate-500 hover:bg-white hover:text-[#0b1f3a]"}`}
                >
                  <span className="mr-2 text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                  {title}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="min-h-[460px] px-6 py-8 md:px-10 md:py-10">
            <LessonContent content={slides[current]} />
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setCurrent(value => Math.max(value - 1, 0))}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:border-blue-200 hover:text-[#155eef]"
            >
              <ArrowLeft size={16} /> Previous
            </button>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
              {current === slides.length - 1 ? <CheckCircle2 size={16} className="text-emerald-500" /> : <CircleHelp size={16} />}
              <span>{current === slides.length - 1 ? "Lesson section complete" : "Use ← → to navigate"}</span>
            </div>

            <button
              type="button"
              disabled={current === slides.length - 1}
              onClick={() => setCurrent(value => Math.min(value + 1, slides.length - 1))}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155eef] px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-blue-700"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
