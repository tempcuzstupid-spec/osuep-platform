'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiException } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api('/api/auth/login', { json: { email, password } });
      router.push('/portal');
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-purple shadow-glow-purple">
            <span className="font-display text-lg font-bold text-gold-400">O</span>
          </span>
          <span className="font-display text-lg font-semibold text-white">One Stop Uniforms</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-chrome-300">Sign in to your organization.</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" required
                className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="password">Password</label>
                <Link href="/forgot" className="text-xs text-ink-300 hover:text-ink-200">Forgot?</Link>
              </div>
              <input id="password" type="password" autoComplete="current-password" required
                className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-chrome-300">
            Don't have an organization yet?{' '}
            <Link href="/register" className="text-ink-300 hover:text-ink-200 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
