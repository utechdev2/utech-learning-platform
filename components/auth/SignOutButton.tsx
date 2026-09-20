"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const { error } = await createClient().auth.signOut();

    if (error) {
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-blue-200 hover:text-[#155eef] disabled:opacity-50"
    >
      <LogOut size={16} />
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
