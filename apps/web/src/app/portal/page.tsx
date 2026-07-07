'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Me = {
  user: { id: string; email: string; fullName: string | null; mfaEnabled: boolean };
  session: { id: string; state: string; activeOrgId: string | null; activeMembershipId: string | null };
  memberships: Array<{
    membershipId: string;
    orgId: string;
    role: string;
    orgName: string;
    orgSlug: string;
    orgType: string;
  }>;
};

type Org = { id: string; name: string; slug: string; type: string; status: string; createdAt: string };
type Location = { id: string; name: string; code: string | null; isPrimary: boolean; city: string | null; status: string };
type Department = { id: string; name: string; code: string | null; status: string };
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

export default function PortalPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // create forms
  const [newLoc, setNewLoc] = useState({ name: '', city: '' });
  const [newDep, setNewDep] = useState({ name: '' });
  const [newInv, setNewInv] = useState({ email: '', role: 'buyer' as 'buyer' | 'org_admin' | 'approver' | 'finance' | 'employee' | 'viewer' });

  async function load() {
    try {
      const m = await api<Me>('/api/auth/me');
      setMe(m);
      if (!m.session.activeOrgId && m.memberships[0]) {
        await api('/api/session/active-org', { json: { orgId: m.memberships[0].orgId } });
        return load();
      }
      if (m.session.activeOrgId) {
        const [o, locs, deps, mems] = await Promise.all([
          api<Org>('/api/orgs/current'),
          api<Location[]>('/api/orgs/current/locations'),
          api<Department[]>('/api/orgs/current/departments'),
          api<Member[]>('/api/users'),
        ]);
        setOrg(o); setLocations(locs); setDepartments(deps); setMembers(mems);
      }
    } catch (e) {
      if (e instanceof ApiException && e.status === 401) {
        router.push('/login');
        return;
      }
      setErr(e instanceof Error ? e.message : 'Failed to load portal');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function createLocation(e: FormEvent) {
    e.preventDefault();
    if (!newLoc.name) return;
    try {
      await api('/api/orgs/current/locations', { json: newLoc });
      setNewLoc({ name: '', city: '' });
      const locs = await api<Location[]>('/api/orgs/current/locations');
      setLocations(locs);
    } catch (e) { setErr(e instanceof ApiException ? e.message : 'Create location failed'); }
  }

  async function createDepartment(e: FormEvent) {
    e.preventDefault();
    if (!newDep.name) return;
    try {
      await api('/api/orgs/current/departments', { json: newDep });
      setNewDep({ name: '' });
      const deps = await api<Department[]>('/api/orgs/current/departments');
      setDepartments(deps);
    } catch (e) { setErr(e instanceof ApiException ? e.message : 'Create department failed'); }
  }

  async function invite(e: FormEvent) {
    e.preventDefault();
    try {
      await api('/api/auth/invitations', { json: newInv });
      setNewInv({ email: '', role: 'buyer' });
      alert(`Invitation sent to ${newInv.email}`);
    } catch (e) { setErr(e instanceof ApiException ? e.message : 'Invite failed'); }
  }

  async function switchOrg(orgId: string) {
    try {
      await api('/api/session/active-org', { json: { orgId } });
      await load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Switch org failed'); }
  }

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="text-chrome-300 text-sm">Loading your organization…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-chrome-700/40 bg-midnight-900/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-purple">
              <span className="font-display text-base font-bold text-gold-400">O</span>
            </span>
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold text-white">{org?.name ?? 'OSUEP'}</div>
              <div className="text-[10px] uppercase tracking-wider text-chrome-400">{org?.type ?? 'organization'}</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {me && me.memberships.length > 1 && (
              <select
                className="input py-1.5 text-xs"
                value={me.session.activeOrgId ?? ''}
                onChange={(e) => switchOrg(e.target.value)}
              >
                {me.memberships.map((m) => (
                  <option key={m.orgId} value={m.orgId}>{m.orgName} ({m.role})</option>
                ))}
              </select>
            )}
            <span className="text-xs text-chrome-400 hidden md:block">{me?.user.email}</span>
            <button onClick={logout} className="btn btn-ghost py-1.5 text-xs">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {err && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        )}

        {/* Welcome / KPI strip */}
        <section className="grid md:grid-cols-4 gap-3 mb-10">
          {[
            { k: 'Members', v: members.length, sub: 'org users' },
            { k: 'Locations', v: locations.length, sub: 'physical sites' },
            { k: 'Departments', v: departments.length, sub: 'org units' },
            { k: 'Your role', v: me?.memberships.find((m) => m.orgId === me.session.activeOrgId)?.role ?? '—', sub: 'in this org' },
          ].map((s) => (
            <div key={s.k} className="card">
              <div className="text-3xl font-semibold chrome-text">{String(s.v)}</div>
              <div className="text-xs uppercase tracking-wider text-chrome-300 mt-1">{s.k}</div>
              <div className="text-xs text-chrome-400">{s.sub}</div>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Locations */}
          <section className="card">
            <h2 className="font-display text-lg font-semibold text-white">Locations</h2>
            <p className="text-xs text-chrome-400 mb-4">Physical sites within this organization.</p>
            <ul className="space-y-2 mb-4">
              {locations.map((l) => (
                <li key={l.id} className="flex items-center justify-between rounded-lg border border-chrome-700/60 bg-midnight-900/40 px-3 py-2">
                  <div>
                    <div className="text-sm text-white">{l.name}</div>
                    <div className="text-xs text-chrome-400">{l.city ?? '—'} {l.code ? `· ${l.code}` : ''}</div>
                  </div>
                  {l.isPrimary && <span className="chip text-ink-300 border-ink-500/30">Primary</span>}
                </li>
              ))}
              {locations.length === 0 && <li className="text-sm text-chrome-400">No locations yet.</li>}
            </ul>
            <form onSubmit={createLocation} className="space-y-2 border-t border-chrome-700/40 pt-4">
              <input className="input" placeholder="Location name" value={newLoc.name} onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })} />
              <input className="input" placeholder="City" value={newLoc.city} onChange={(e) => setNewLoc({ ...newLoc, city: e.target.value })} />
              <button className="btn btn-primary w-full py-2 text-sm">Add location</button>
            </form>
          </section>

          {/* Departments */}
          <section className="card">
            <h2 className="font-display text-lg font-semibold text-white">Departments</h2>
            <p className="text-xs text-chrome-400 mb-4">Organizational units — buyers, finance, etc.</p>
            <ul className="space-y-2 mb-4">
              {departments.map((d) => (
                <li key={d.id} className="rounded-lg border border-chrome-700/60 bg-midnight-900/40 px-3 py-2 text-sm text-white">
                  {d.name} {d.code ? <span className="text-xs text-chrome-400">· {d.code}</span> : null}
                </li>
              ))}
              {departments.length === 0 && <li className="text-sm text-chrome-400">No departments yet.</li>}
            </ul>
            <form onSubmit={createDepartment} className="space-y-2 border-t border-chrome-700/40 pt-4">
              <input className="input" placeholder="Department name" value={newDep.name} onChange={(e) => setNewDep({ name: e.target.value })} />
              <button className="btn btn-primary w-full py-2 text-sm">Add department</button>
            </form>
          </section>

          {/* Invite + Members */}
          <section className="card">
            <h2 className="font-display text-lg font-semibold text-white">Team</h2>
            <p className="text-xs text-chrome-400 mb-4">Invite users and manage roles.</p>
            <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-thin">
              {members.map((m) => (
                <li key={m.membershipId} className="rounded-lg border border-chrome-700/60 bg-midnight-900/40 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white truncate">{m.fullName ?? m.email}</span>
                    <span className="chip text-xs">{m.role}</span>
                  </div>
                  <div className="text-xs text-chrome-400 truncate">{m.email} {m.mfaEnabled ? '· MFA' : ''}</div>
                </li>
              ))}
            </ul>
            <form onSubmit={invite} className="space-y-2 border-t border-chrome-700/40 pt-4">
              <input type="email" className="input" placeholder="email@company.com" value={newInv.email} onChange={(e) => setNewInv({ ...newInv, email: e.target.value })} />
              <select className="input" value={newInv.role} onChange={(e) => setNewInv({ ...newInv, role: e.target.value as any })}>
                <option value="org_admin">Org Admin</option>
                <option value="buyer">Buyer</option>
                <option value="approver">Approver</option>
                <option value="finance">Finance</option>
                <option value="employee">Employee</option>
                <option value="viewer">Viewer</option>
              </select>
              <button className="btn btn-gold w-full py-2 text-sm">Send invitation</button>
            </form>
          </section>
        </div>

        {/* Audit hint */}
        <section className="mt-10 card bg-gradient-chrome">
          <h3 className="font-display text-base font-semibold text-white">Audit trail</h3>
          <p className="text-sm text-chrome-300 mt-1">
            Every action you take on this portal is recorded in an immutable audit log.
            Available to org admins and finance roles via <code className="text-ink-300">GET /api/audit</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
