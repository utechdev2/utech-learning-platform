import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function staff() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const id = claims?.claims?.sub;
  if (!id) return { supabase, ok: false };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", id).maybeSingle();
  return { supabase, ok: ["admin","instructor"].includes(profile?.role ?? "") };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, ok } = await staff();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (body.slug !== undefined) updates.slug = String(body.slug).trim().toLowerCase();
  for (const key of ["title","summary","content","quiz_question"]) if (body[key] !== undefined) updates[key] = String(body[key]).trim();
  if (body.points !== undefined) updates.points = Array.isArray(body.points) ? body.points : [];
  if (body.quiz_options !== undefined) updates.quiz_options = Array.isArray(body.quiz_options) ? body.quiz_options : [];
  if (body.quiz_answer !== undefined) updates.quiz_answer = Number(body.quiz_answer);
  if (body.position !== undefined) updates.position = Number(body.position);
  if (body.published !== undefined) updates.published = Boolean(body.published);
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from("lessons").update(updates).eq("id", id).select("id,slug,title,summary,content,points,quiz_question,quiz_options,quiz_answer,position,published").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ lesson: data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, ok } = await staff();
  if (!ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
