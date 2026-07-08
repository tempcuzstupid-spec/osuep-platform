'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Member = {
  userId: string;
  email: string;
  fullName: string | null;
  jobTitle: string | null;
  status: string;
  role: string;
  membershipId: string;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
};

const ROLES = [
  { value: 'org_admin', label: 'Org admin' },
  { value: 'finance', label: 'Finance' },
  { value: 'approver', label: 'Approver' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'employee', label: 'Employee' },
  { value: 'viewer', label: 'Viewer' },
];

function roleTone(role: string) {
  if (role === 'org_admin') return 'bg-purple-600/20 text-purple-200 border-purple-500/40';
  if (role === 'finance' || role === 'approver') return 'bg-amber-600/20 text-amber-200 border-amber-500/40';
  if (role === 'buyer') return 'bg-emerald-600/20 text-emerald-200 border-emerald-500/40';
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30';
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('buyer');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<unknown>('/api/users') as any;
        // Response could be { users: [...] } or [...] depending on the version
        const list = Array.isArray(r) ? r : r.users ?? [];
        setMembers(list);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function invite(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    try {
      const r = await api<unknown>('/api/auth/invitations', { method: 'POST', json: { email, role } });
      setMsg({ type: 'ok', text: `Invitation sent to ${email}. Share this link: ${(r as any).inviteUrl ?? '(link generated)'}` });
      setEmail('');
    } catch (e) {
      setMsg({ type: 'err', text: String(e) });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Team</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Team</p>
            <h1 className="mt-1 text-3xl font-bold text-white">Members</h1>
            <p className="mt-1 text-chrome-200">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-chrome-200">Loading…</div>
              ) : members.length === 0 ? (
                <div className="p-12 text-center text-chrome-200">No members yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-midnight-800/50 text-xs uppercase tracking-wider text-chrome-300">
                      <tr>
                        <th className="px-5 py-3 text-left">Member</th>
                        <th className="px-5 py-3 text-left">Role</th>
                        <th className="px-5 py-3 text-left">MFA</th>
                        <th className="px-5 py-3 text-left">Last login</th>
                        <th className="px-5 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-chrome-700/30">
                      {members.map((m) => (
                        <tr key={m.membershipId} className="hover:bg-midnight-800/40">
                          <td className="px-5 py-3">
                            <p className="text-sm text-white">{m.fullName ?? '—'}</p>
                            <p className="text-xs text-chrome-300 font-mono">{m.email}</p>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${roleTone(m.role)}`}>
                              {m.role.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm">
                            {m.mfaEnabled ? (
                              <span className="text-emerald-300">✓ Enabled</span>
                            ) : (
                              <span className="text-chrome-400">Off</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-xs text-chrome-300 font-mono">
                            {m.lastLoginAt ? new Date(m.lastLoginAt).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs text-chrome-200">{m.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
              <h2 className="font-semibold text-white">Invite member</h2>
              <form onSubmit={invite} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-chrome-300">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-chrome-300">Role</label>
                  <select
                    className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                {msg && (
                  <div
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      msg.type === 'ok'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-lg bg-gradient-purple px-4 py-2.5 text-sm font-semibold text-white shadow-glow-purple hover:opacity-90 disabled:opacity-50"
                >
                  {sending ? 'Sending…' : 'Send invitation'}
                </button>
              </form>

              <div className="mt-6 border-t border-chrome-700/30 pt-4 text-xs text-chrome-300 space-y-1.5">
                <p><strong className="text-chrome-100">org_admin</strong> — full org control, manage members, see invoices</p>
                <p><strong className="text-chrome-100">finance</strong> — view invoices, approve payments</p>
                <p><strong className="text-chrome-100">approver</strong> — approve orders</p>
                <p><strong className="text-chrome-100">buyer</strong> — place orders, manage cart</p>
                <p><strong className="text-chrome-100">employee</strong> — view their own assignments</p>
                <p><strong className="text-chrome-100">viewer</strong> — read-only access</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
