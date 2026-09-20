"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, UserCircle } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function StudentNav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const cls = "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-extrabold transition " + (active ? "border-[#155eef] text-[#155eef]" : "border-transparent text-slate-500 hover:text-[#0b1f3a]");
          return <Link key={href} href={href} className={cls}><Icon size={17} /> {label}</Link>;
        })}
      </div>
    </nav>
  );
}
