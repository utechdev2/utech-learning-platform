import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-red-600">Authentication error</p>
        <h1 className="mt-2 text-3xl font-black text-[#0b1f3a]">That sign-in link is no longer valid.</h1>
        <p className="mt-4 text-sm leading-6 text-slate-500">
          The confirmation link may have expired or already been used. Start the authentication flow again.
        </p>
        <Link href="/auth/sign-in" className="mt-7 inline-flex rounded-xl bg-[#0b1f3a] px-5 py-3 font-bold text-white">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
