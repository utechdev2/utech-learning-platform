import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims?.claims?.sub) {
    return NextResponse.json({ authenticated: false, progress: [], labAttempts: [] });
  }

  const userId = claims.claims.sub;
  const course = new URL(request.url).searchParams.get("course");

  let query = supabase
    .from("lesson_progress")
    .select("course_slug, lesson_slug, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });

  if (course) query = query.eq("course_slug", course);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: attempts, error: attemptsError } = await supabase
    .from("lab_attempts")
    .select("lab_id, status, score, attempts, completed_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "passed")
    .order("updated_at", { ascending: false });

  if (attemptsError) {
    return NextResponse.json({ error: attemptsError.message }, { status: 500 });
  }

  const labIds = [...new Set((attempts ?? []).map((attempt) => attempt.lab_id))];
  let labAttempts: Array<{
    lab_id: string;
    lab_slug: string;
    lab_title: string;
    course_slug: string;
    status: string;
    score: number;
    attempts: number;
    completed_at?: string | null;
    updated_at?: string | null;
  }> = [];

  if (labIds.length) {
    const { data: labs, error: labsError } = await supabase
      .from("labs")
      .select("id, slug, title, course_id")
      .in("id", labIds);

    if (labsError) {
      return NextResponse.json({ error: labsError.message }, { status: 500 });
    }

    const courseIds = [...new Set((labs ?? []).map((lab) => lab.course_id))];
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("id, slug")
      .in("id", courseIds);

    if (coursesError) {
      return NextResponse.json({ error: coursesError.message }, { status: 500 });
    }

    const labById = new Map((labs ?? []).map((lab) => [lab.id, lab]));
    const courseById = new Map((courses ?? []).map((item) => [item.id, item]));

    labAttempts = (attempts ?? [])
      .map((attempt) => {
        const lab = labById.get(attempt.lab_id);
        const courseRecord = lab ? courseById.get(lab.course_id) : undefined;
        if (!lab || !courseRecord) return null;
        return {
          lab_id: attempt.lab_id,
          lab_slug: lab.slug,
          lab_title: lab.title,
          course_slug: courseRecord.slug,
          status: attempt.status,
          score: attempt.score,
          attempts: attempt.attempts,
          completed_at: attempt.completed_at,
          updated_at: attempt.updated_at,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .filter((item) => !course || item.course_slug === course);
  }

  return NextResponse.json({
    authenticated: true,
    progress: data ?? [],
    labAttempts,
  });
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
