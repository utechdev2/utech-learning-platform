"use client";

import { useState } from "react";

export default function ProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState("");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name.trim() }),
    });
    const data = await response.json();
    setStatus(response.ok ? "Profile saved." : (data.error ?? "Unable to save profile."));
  }

  return (
    <form onSubmit={save} className="mt-8 border-t border-slate-100 pt-6">
      <label htmlFor="fullName" className="text-sm font-bold text-slate-600">Display name</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input id="fullName" value={name} onChange={e => setName(e.target.value)} maxLength={80} required
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0b1f3a] outline-none focus:border-[#155eef]" />
        <button type="submit" className="rounded-xl bg-[#155eef] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Save changes</button>
      </div>
      {status && <p className="mt-3 text-sm font-semibold text-slate-500">{status}</p>}
    </form>
  );
}
