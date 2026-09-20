import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";

export default function DashboardPage(){
 return <main className="min-h-screen bg-[#f8fafc]">
  <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1f3a] font-black text-white">U</span><span className="font-black text-[#0b1f3a]">UTECH Learning Hub</span></Link><span className="hidden items-center gap-2 text-sm font-bold text-slate-500 md:flex"><LayoutDashboard size={17}/> Student Dashboard</span></div></header>
  <section className="mx-auto max-w-7xl px-6 py-12"><p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#155eef]">Your learning</p><h1 className="mt-2 text-4xl font-black text-[#0b1f3a]">Keep building your skills.</h1><div className="mt-9"><DashboardStats/></div></section>
 </main>
}