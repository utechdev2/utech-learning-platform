import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCourseFromDb } from "@/lib/courses";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { courseSlug?: string };
  if (!body.courseSlug) {
    return NextResponse.json({ error: "Valid courseSlug is required." }, { status: 400 });
  }

  const course = await getCourseFromDb(body.courseSlug);
  if (!course || course.lessons.length === 0 || !course.id) {
    return NextResponse.json({ error: "Valid published course is required." }, { status: 400 });
  }

  const { count: lessonCount, error: progressError } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("course_slug", course.slug);

  if (progressError) return NextResponse.json({ error: progressError.message }, { status: 500 });
  if (lessonCount !== course.lessons.length) {
    return NextResponse.json({ error: "Complete every lesson before requesting a certificate." }, { status: 400 });
  }

  const { data: availableLabs, error: labsError } = await supabase
    .from("labs")
    .select("id")
    .eq("course_id", course.id)
    .eq("status", "available");

  if (labsError) return NextResponse.json({ error: labsError.message }, { status: 500 });

  const labIds = (availableLabs ?? []).map((lab) => lab.id);
  if (labIds.length) {
    const { count: passedLabCount, error: labProgressError } = await supabase
      .from("lab_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "passed")
      .in("lab_id", labIds);

    if (labProgressError) return NextResponse.json({ error: labProgressError.message }, { status: 500 });
    if (passedLabCount !== labIds.length) {
      return NextResponse.json({ error: "Pass every available practical lab before requesting a certificate." }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("certificates")
    .upsert({ user_id: userId, course_slug: course.slug }, { onConflict: "user_id,course_slug" })
    .select("certificate_id, course_slug, issued_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certificate: data });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Certificate ID is required." }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("certificate_id, course_slug, issued_at")
    .eq("certificate_id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certificate: data });
}
