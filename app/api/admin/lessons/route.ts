import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function isStaff() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { supabase, ok: false };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return { supabase, ok: ["admin","instructor"].includes(profile?.role ?? "") };
}

export async function POST(request: Request) {
  const { supabase, ok } = await isStaff();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const { data: course } = await supabase.from("courses").select("id").eq("slug", String(body.courseSlug)).single();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  const { data, error } = await supabase.from("lessons").insert({
    course_id: course.id, slug: String(body.slug ?? "").trim().toLowerCase(), title: String(body.title ?? "").trim(),
    summary: String(body.summary ?? "").trim(), points: Array.isArray(body.points) ? body.points : [],
    quiz_question: String(body.quizQuestion ?? "").trim(), quiz_options: Array.isArray(body.quizOptions) ? body.quizOptions : [],
    quiz_answer: Number(body.quizAnswer ?? 0), position: Number(body.position ?? 1), published: Boolean(body.published),
  }).select("id,slug,title,summary,points,quiz_question,quiz_options,quiz_answer,position,published").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ lesson: data }, { status: 201 });
}
