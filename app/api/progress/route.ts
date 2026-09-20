import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims?.claims?.sub) {
    return NextResponse.json({ authenticated: false, progress: [] });
  }

  const course = new URL(request.url).searchParams.get("course");

  let query = supabase
    .from("lesson_progress")
    .select("course_slug, lesson_slug, completed_at")
    .eq("user_id", claims.claims.sub)
    .order("completed_at", { ascending: true });

  if (course) query = query.eq("course_slug", course);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ authenticated: true, progress: data ?? [] });
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
    completed?: boolean;
  };

  if (!body.courseSlug || !body.lessonSlug || typeof body.completed !== "boolean") {
    return NextResponse.json({ error: "courseSlug, lessonSlug and completed are required." }, { status: 400 });
  }

  if (body.completed) {
    const { data: mastery, error: masteryError } = await supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", userId)
      .eq("course_slug", body.courseSlug)
      .eq("lesson_slug", body.lessonSlug)
      .eq("score", 100)
      .limit(1)
      .maybeSingle();

    if (masteryError) return NextResponse.json({ error: masteryError.message }, { status: 500 });

    if (!mastery) {
      return NextResponse.json(
        { error: "Pass the lesson quiz before marking this lesson complete." },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("lesson_progress").upsert(
      {
        user_id: userId,
        course_slug: body.courseSlug,
        lesson_slug: body.lessonSlug,
      },
      { onConflict: "user_id,course_slug,lesson_slug" },
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", userId)
      .eq("course_slug", body.courseSlug)
      .eq("lesson_slug", body.lessonSlug);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
