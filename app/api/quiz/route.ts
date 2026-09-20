import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCourseFromDb } from "@/lib/courses";

export async function GET() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ authenticated: false, attempts: [] });
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("course_slug, lesson_slug, score, attempted_at")
    .eq("user_id", userId)
    .order("attempted_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ authenticated: true, attempts: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const body = (await request.json()) as {
    courseSlug?: string;
    lessonSlug?: string;
    selectedAnswer?: number;
  };

  if (
    !body.courseSlug ||
    !body.lessonSlug ||
    typeof body.selectedAnswer !== "number" ||
    !Number.isInteger(body.selectedAnswer) ||
    body.selectedAnswer < 0
  ) {
    return NextResponse.json(
      { error: "courseSlug, lessonSlug and a selected answer are required." },
      { status: 400 }
    );
  }

  const course = await getCourseFromDb(body.courseSlug);
  const lesson = course?.lessons.find((item) => item.slug === body.lessonSlug);

  const selectedAnswer = body.selectedAnswer;

  if (!lesson || selectedAnswer >= lesson.quiz.options.length) {
    return NextResponse.json(
      { error: "Valid lesson and answer are required." },
      { status: 400 }
    );
  }

  const score = selectedAnswer === lesson.quiz.answer ? 100 : 0;
  const { error } = await supabase.from("quiz_attempts").insert({
    user_id: userId,
    course_slug: body.courseSlug,
    lesson_slug: body.lessonSlug,
    score,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
