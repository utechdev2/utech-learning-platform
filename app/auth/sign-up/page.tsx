"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      data.session
        ? "Account created. Redirecting..."
        : "Account created. Check your email to confirm it.",
    );

    if (data.session) window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="font-black text-[#0b1f3a]">← UTECH Learning Hub</Link>
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#155eef]">Start learning</p>
          <h1 className="mt-2 text-3xl font-black text-[#0b1f3a]">Create your account</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Create an account to keep your lesson progress and quiz attempts synced.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"/>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"/>
            <input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (8+ characters)" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"/>
            <button className="w-full rounded-xl bg-[#155eef] px-5 py-3 font-bold text-white hover:bg-blue-700">Create account</button>
            {message && <p className="text-sm font-semibold text-slate-600">{message}</p>}
          </form>
          <p className="mt-6 text-sm text-slate-500">Already have an account? <Link href="/auth/sign-in" className="font-bold text-[#155eef]">Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
