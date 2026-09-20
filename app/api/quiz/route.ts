import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    score?: number;
  };

  if (
    !body.courseSlug ||
    !body.lessonSlug ||
    typeof body.score !== "number" ||
    body.score < 0 ||
    body.score > 100
  ) {
    return NextResponse.json({ error: "courseSlug, lessonSlug and a score from 0 to 100 are required." }, { status: 400 });
  }

  const { error } = await supabase.from("quiz_attempts").insert({
    user_id: userId,
    course_slug: body.courseSlug,
    lesson_slug: body.lessonSlug,
    score: Math.round(body.score),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
