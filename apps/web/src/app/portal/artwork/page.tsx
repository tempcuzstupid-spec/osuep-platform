'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Artwork = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  currentVersion: number;
  approvedAt: string | null;
  approvedByUserId: string | null;
  createdAt: string;
};

const STATUS_TONE: Record<string, string> = {
  draft: 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30',
  pending_review: 'bg-amber-600/15 text-amber-300 border-amber-500/30',
  approved: 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-rose-600/15 text-rose-300 border-rose-500/30',
  archived: 'bg-zinc-700/30 text-zinc-400 border-zinc-600/30',
};

export default function ArtworkPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ artworks: Artwork[] }>('/api/artworks');
        setArtworks(r.artworks);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function createArtwork(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setMsg(null);
    try {
      const r = await api<{ artwork: Artwork }>('/api/artworks', {
        method: 'POST',
        json: { name, description: desc || undefined },
      });
      setArtworks([r.artwork, ...artworks]);
      setName('');
      setDesc('');
      setMsg(`Created "${r.artwork.name}" — upload a file via the artwork detail page.`);
    } catch (e) {
      setMsg(String(e));
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Artwork library</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Production</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Artwork library</h1>
          <p className="mt-1 text-chrome-200">Manage logos, embroidery files, and decoration assets.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-chrome-200">Loading…</div>
              ) : artworks.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-chrome-200">No artwork yet.</p>
                  <p className="mt-1 text-sm text-chrome-300">Add logos, embroidery files, or print-ready artwork.</p>
                </div>
              ) : (
                <div className="divide-y divide-chrome-700/30">
                  {artworks.map((a) => (
                    <div key={a.id} className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{a.name}</p>
                        {a.description && <p className="mt-0.5 text-xs text-chrome-300 line-clamp-1">{a.description}</p>}
                        <p className="mt-1 text-[10px] text-chrome-400 font-mono uppercase">
                          v{a.currentVersion} · {a.approvedAt ? `approved ${new Date(a.approvedAt).toLocaleDateString()}` : 'pending approval'}
                        </p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${STATUS_TONE[a.status]}`}>
                        {a.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
              <h2 className="font-semibold text-white">New artwork</h2>
              <form onSubmit={createArtwork} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-chrome-300">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                    placeholder="Acme Corp Primary Logo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-chrome-300">Description (optional)</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                    placeholder="Notes about this artwork (color profile, usage rights, etc.)"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
                {msg && (
                  <div className="rounded-lg border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-xs text-chrome-200">
                    {msg}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-lg bg-gradient-purple px-4 py-2.5 text-sm font-semibold text-white shadow-glow-purple hover:opacity-90 disabled:opacity-50"
                >
                  {creating ? 'Creating…' : 'Create artwork'}
                </button>
              </form>

              <div className="mt-6 border-t border-chrome-700/30 pt-4 text-xs text-chrome-300 space-y-2">
                <p><strong className="text-chrome-100">Supported formats:</strong> SVG, PNG, PDF, EPS, AI, DST (embroidery)</p>
                <p><strong className="text-chrome-100">Max file size:</strong> 25 MB</p>
                <p><strong className="text-chrome-100">Approval:</strong> All artwork requires review before production use.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
