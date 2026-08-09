import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(13,148,136,0.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.2),transparent_35%),linear-gradient(160deg,#020617,#0f172a_55%,#134e4a)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-6">
          <p className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text font-display text-4xl font-bold text-transparent">
            QA Tracker
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage bugs, releases, and QA workflows.
          </p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-slate-500">
          No account?{' '}
          <Link href="/register" className="font-medium text-teal-700 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
