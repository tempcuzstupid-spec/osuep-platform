'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Location = {
  id: string;
  name: string;
  code: string | null;
  isPrimary: boolean;
  city: string | null;
  state: string | null;
  country: string | null;
  status: string;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ locations: Location[] }>('/api/orgs/current/locations');
        setLocations(r.locations);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const r = await api<unknown>('/api/orgs/current/locations', {
        method: 'POST',
        json: { name, code: code || undefined },
      });
      setLocations([(r as any).location, ...locations]);
      setName('');
      setCode('');
    } catch {} finally { setCreating(false); }
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Locations</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Organization</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Locations</h1>
          <p className="mt-1 text-chrome-200">Ship-to and bill-to addresses for orders.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-chrome-200">Loading…</div>
              ) : locations.length === 0 ? (
                <div className="p-12 text-center text-chrome-200">No locations yet.</div>
              ) : (
                <div className="divide-y divide-chrome-700/30">
                  {locations.map((l) => (
                    <div key={l.id} className="px-5 py-4 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{l.name}</p>
                          {l.isPrimary && (
                            <span className="rounded bg-gold-500/20 px-2 py-0.5 text-[10px] uppercase font-mono text-gold-300">
                              Primary
                            </span>
                          )}
                        </div>
                        {l.code && <p className="mt-1 text-xs text-chrome-300 font-mono">Code: {l.code}</p>}
                        {(l.city || l.state) && (
                          <p className="mt-1 text-xs text-chrome-300">
                            {[l.city, l.state].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-chrome-400">{l.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
              <h2 className="font-semibold text-white">New location</h2>
              <form onSubmit={create} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-chrome-300">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                    placeholder="North Campus"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-chrome-300">Code (optional)</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                    placeholder="NORTH"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-lg bg-gradient-purple px-4 py-2.5 text-sm font-semibold text-white shadow-glow-purple hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? 'Adding…' : 'Add location'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
