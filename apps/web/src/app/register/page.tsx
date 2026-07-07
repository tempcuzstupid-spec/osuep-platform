'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiException } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    orgName: '',
    orgType: 'company',
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api('/api/auth/register', { json: form });
      router.push('/portal');
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="flex items-center gap-3 mb-8 justify-center">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-purple shadow-glow-purple">
            <span className="font-display text-lg font-bold text-gold-400">O</span>
          </span>
          <span className="font-display text-lg font-semibold text-white">One Stop Uniforms</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display text-2xl font-semibold text-white">Create your organization</h1>
          <p className="mt-1 text-sm text-chrome-300">You'll be the org admin. Invite your team after.</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">Organization name</label>
              <input required className="input" value={form.orgName} onChange={(e) => update('orgName', e.target.value)} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.orgType} onChange={(e) => update('orgType', e.target.value)}>
                <option value="company">Company</option>
                <option value="school">School / University</option>
                <option value="hospital">Hospital / Medical</option>
                <option value="hotel">Hotel / Restaurant</option>
                <option value="government">Government</option>
                <option value="enterprise">Enterprise</option>
                <option value="small_business">Small Business</option>
              </select>
            </div>
            <div className="divider" />
            <div>
              <label className="label">Your full name</label>
              <input required className="input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Password (min 10 chars)</label>
              <input type="password" required minLength={10} className="input" value={form.password} onChange={(e) => update('password', e.target.value)} />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn btn-gold w-full py-3 text-base">
              {loading ? 'Creating…' : 'Create organization'}
            </button>
            <p className="text-xs text-chrome-400 text-center">
              By creating an organization, you agree to the OSUEP Master Specification,
              including the AI Development Charter and Fundamental Rules.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-chrome-300">
            Already have an account?{' '}
            <Link href="/login" className="text-ink-300 hover:text-ink-200 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
