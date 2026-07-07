'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/api/auth/forgot', { json: { email } });
      setSent(true);
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
          <h1 className="font-display text-2xl font-semibold text-white">Reset your password</h1>
          <p className="mt-1 text-sm text-chrome-300">We'll email you a secure link.</p>

          {sent ? (
            <div className="mt-8 rounded-lg border border-ink-500/40 bg-ink-500/10 px-4 py-3 text-sm text-ink-200">
              If an account exists for that email, we've sent a reset link.
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="label">Email</label>
                <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-chrome-300">
            <Link href="/login" className="text-ink-300 hover:text-ink-200">Back to sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
