import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";\nimport { getCourseFromDb } from "@/lib/courses";

export async function GET() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ authenticated: false, attempts: [] });
  const { data, error } = await supabase.from("quiz_attempts").select("course_slug, lesson_slug, score, attempted_at").eq("user_id", userId).order("attempted_at", { ascending: false });
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
    typeof body.score !== "number" ||
    body.score < 0 ||
    body.score > 100
  ) {
    return NextResponse.json({ error: "courseSlug, lessonSlug and a selected answer are required." }, { status: 400 });
  }

  const course = await getCourseFromDb(body.courseSlug);\n  const lesson = course?.lessons.find(item => item.slug === body.lessonSlug);\n  if (!lesson || body.selectedAnswer >= lesson.quiz.options.length) {\n    return NextResponse.json({ error: "Valid lesson and answer are required." }, { status: 400 });\n  }\n\n  const score = body.selectedAnswer === lesson.quiz.answer ? 100 : 0;\n  const { error } = await supabase.from("quiz_attempts").insert({
    user_id: userId,
    course_slug: body.courseSlug,
    lesson_slug: body.lessonSlug,
    score,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
