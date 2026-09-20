import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  if (!fullName || fullName.length > 80) {
    return NextResponse.json({ error: "Name must be between 1 and 80 characters." }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
  if (error) return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
