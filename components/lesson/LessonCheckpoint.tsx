"use client";

import { useState } from "react";
import Quiz from "@/components/lesson/Quiz";
import LessonProgress from "@/components/lesson/LessonProgress";

export default function LessonCheckpoint({
  courseSlug,
  lessonSlug,
  question,
  options,
  answer,
  nextHref,
}: {
  courseSlug: string;
  lessonSlug: string;
  question: string;
  options: string[];
  answer: number;
  nextHref: string;
}) {
  const [passed, setPassed] = useState(false);

  return (
    <>
      <section className="mt-8 rounded-2xl border border-slate-200 p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">Checkpoint quiz</p>
        <h2 className="mt-2 text-xl font-black text-[#0b1f3a]">{question}</h2>
        <Quiz
          courseSlug={courseSlug}
          lessonSlug={lessonSlug}
          question={question}
          options={options}
          answer={answer}
          onPassed={() => setPassed(true)}
        />
      </section>
      <div className="mt-8">
        <LessonProgress course={courseSlug} lesson={lessonSlug} nextHref={nextHref} canComplete={passed} />
      </div>
    </>
  );
}
