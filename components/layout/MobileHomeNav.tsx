"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileHomeNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#0b1f3a] hover:bg-slate-50"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white px-6 py-4 shadow-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link onClick={() => setOpen(false)} href="/courses" className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 hover:text-[#155eef]">
              Courses
            </Link>
            <a onClick={() => setOpen(false)} href="#about" className="rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 hover:text-[#155eef]">
              How it works
            </a>
            <Link onClick={() => setOpen(false)} href="/auth/sign-in" className="mt-1 rounded-xl bg-[#0b1f3a] px-4 py-3 text-center font-bold text-white hover:bg-[#122d52]">
              Sign in
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
