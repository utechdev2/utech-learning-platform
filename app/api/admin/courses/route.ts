import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function staff() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { supabase, userId: null };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return { supabase, userId, role: profile?.role };
}

export async function POST(request: Request) {
  const { supabase, userId, role } = await staff();
  if (!userId || !["admin","instructor"].includes(role ?? "")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const { data, error } = await supabase.from("courses").insert({
    slug: String(body.slug ?? "").trim().toLowerCase(),
    title: String(body.title ?? "").trim(),
    description: String(body.description ?? "").trim(),
    level: String(body.level ?? "Beginner").trim(),
    duration: String(body.duration ?? "").trim(),
    published: Boolean(body.published),
    created_by: userId,
  }).select("id,slug,title,description,level,duration,published").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ course: data }, { status: 201 });
}

export async function GET() {
  const { supabase, userId, role } = await staff();
  if (!userId || !["admin","instructor"].includes(role ?? "")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { data, error } = await supabase.from("courses").select("id,slug,title,description,level,duration,published,lessons(id,slug,title,summary,content,points,quiz_question,quiz_options,quiz_answer,position,published)").order("slug");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ courses: data });
}
