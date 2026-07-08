'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Me = {
  user: { id: string; email: string; fullName: string | null; mfaEnabled: boolean };
  session: { id: string; state: string; activeOrgId: string | null };
  memberships: Array<{
    membershipId: string;
    orgId: string;
    role: string;
    orgName: string;
    orgSlug: string;
  }>;
};

type Org = {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  website: string | null;
  phone: string | null;
  taxId: string | null;
};

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const m = await api<Me>('/api/auth/me');
        setMe(m);
        setFullName(m.user.fullName ?? '');
        const o = await api<{ org: Org }>('/api/orgs/current');
        setOrg(o.org);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center bg-midnight-950 text-chrome-200">Loading…</main>;
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Settings</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Account</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Settings</h1>
        </header>

        {msg && (
          <div className="rounded-lg border border-chrome-700/40 bg-midnight-900 px-4 py-3 text-sm text-chrome-200">
            {msg}
          </div>
        )}

        <section className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
          <h2 className="font-semibold text-white">Your profile</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-chrome-300">Email</label>
              <input
                type="email"
                disabled
                value={me?.user.email ?? ''}
                className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800/50 px-3 py-2 text-sm text-chrome-300"
              />
            </div>
            <div>
              <label className="text-xs text-chrome-300">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
              />
            </div>
            <div>
              <label className="text-xs text-chrome-300">Two-factor authentication</label>
              <div className="mt-1 flex items-center justify-between rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2">
                <span className="text-sm text-white">
                  {me?.user.mfaEnabled ? 'Enabled' : 'Not enabled'}
                </span>
                <button
                  type="button"
                  className="text-xs text-gold-300 hover:text-gold-200"
                  onClick={() => setMsg('MFA enrollment — coming soon')}
                >
                  {me?.user.mfaEnabled ? 'Manage' : 'Enable'} →
                </button>
              </div>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => setMsg('Profile saved (demo)')}
              className="rounded-lg bg-gradient-purple px-4 py-2.5 text-sm font-semibold text-white shadow-glow-purple hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </section>

        {org && (
          <section className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
            <h2 className="font-semibold text-white">Organization</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Field label="Name" value={org.name} />
              <Field label="Slug" value={org.slug} mono />
              <Field label="Type" value={org.type} />
              <Field label="Status" value={org.status} />
              <Field label="Tax ID" value={org.taxId ?? '—'} mono />
              <Field label="Website" value={org.website ?? '—'} />
            </div>
            <p className="mt-4 text-xs text-chrome-300">
              To update organization details, contact your account manager.
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-rose-500/30 bg-rose-900/10 p-5">
          <h2 className="font-semibold text-rose-200">Danger zone</h2>
          <p className="mt-2 text-sm text-chrome-200">
            Permanently close this organization. All members lose access immediately.
            Active orders continue to ship per contract.
          </p>
          <button
            type="button"
            className="mt-3 rounded border border-rose-500/40 px-4 py-2 text-sm text-rose-200 hover:bg-rose-500/20"
            onClick={() => setMsg('Account closure — contact your account manager to proceed.')}
          >
            Request account closure
          </button>
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-chrome-300">{label}</p>
      <p className={`mt-1 text-chrome-100 ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  );
}
