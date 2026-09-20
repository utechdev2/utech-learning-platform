"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

function safeNext(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default function SignInPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await createClient().auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = safeNext(searchParams.get("next"));
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="font-black text-[#0b1f3a]">← UTECH Learning Hub</Link>
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Welcome back</p>
          <h1 className="mt-2 text-3xl font-black text-[#0b1f3a]">Sign in</h1>
          <p className="mt-3 text-sm text-slate-500">Continue your learning journey.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
            <button className="w-full rounded-xl bg-[#0b1f3a] px-5 py-3 font-bold text-white hover:bg-[#122d52]">
              Sign in
            </button>
            {message && <p className="text-sm font-semibold text-red-600">{message}</p>}
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New to UTECH?{" "}
            <Link href="/auth/sign-up" className="font-bold text-[#155eef]">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
