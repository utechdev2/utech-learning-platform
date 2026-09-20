import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Body = {
  labId?: string;
  passed?: boolean;
  score?: number;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) return NextResponse.json({ authenticated: false }, { status: 401 });

  const body = (await request.json()) as Body;
  if (!body.labId || typeof body.passed !== "boolean") {
    return NextResponse.json({ error: "labId and passed are required." }, { status: 400 });
  }

  const score = Math.max(0, Math.min(100, Math.round(body.score ?? (body.passed ? 100 : 0))));

  const { data: existing, error: readError } = await supabase
    .from("lab_attempts")
    .select("attempts")
    .eq("user_id", userId)
    .eq("lab_id", body.labId)
    .maybeSingle();

  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 });

  const nextAttempts = (existing?.attempts ?? 0) + 1;
  const { data, error } = await supabase
    .from("lab_attempts")
    .upsert(
      {
        user_id: userId,
        lab_id: body.labId,
        status: body.passed ? "passed" : "failed",
        score,
        attempts: nextAttempts,
        completed_at: body.passed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lab_id" },
    )
    .select("id,status,score,attempts,completed_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, attempt: data });
}
