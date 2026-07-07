'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, ApiException } from '@/lib/api';

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      setError('Missing token');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api('/api/auth/reset', { json: { token, password } });
      router.push('/login?reset=1');
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="label">New password (min 10 chars)</label>
        <input type="password" required minLength={10} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
      )}
      <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
        {loading ? 'Resetting…' : 'Set new password'}
      </button>
    </form>
  );
}

export default function ResetPage() {
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
          <h1 className="font-display text-2xl font-semibold text-white">Set a new password</h1>
          <p className="mt-1 text-sm text-chrome-300">Choose a strong password to finish resetting your account.</p>
          <Suspense fallback={<div className="mt-8 text-sm text-chrome-400">Loading…</div>}>
            <ResetInner />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
