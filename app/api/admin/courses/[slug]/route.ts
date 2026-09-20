import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getStaff() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { supabase, role: null };
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return { supabase, role: profile?.role };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { supabase, role } = await getStaff();
  if (!["admin","instructor"].includes(role ?? "")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { slug } = await params;
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  for (const key of ["title","description","level","duration","published"]) if (body[key] !== undefined) updates[key] = key === "published" ? Boolean(body[key]) : String(body[key]).trim();
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from("courses").update(updates).eq("slug", slug).select("id,slug,title,description,level,duration,published").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ course: data });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { supabase, role } = await getStaff();
  if (!["admin","instructor"].includes(role ?? "")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { slug } = await params;
  const { error } = await supabase.from("courses").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
