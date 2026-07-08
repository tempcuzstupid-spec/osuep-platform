'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Document = {
  id: string;
  type: string;
  title: string;
  fileUrl: string | null;
  relatedToType: string | null;
  relatedToId: string | null;
  createdAt: string;
};

const TYPE_TONE: Record<string, string> = {
  invoice: 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30',
  packing_slip: 'bg-zinc-700/30 text-zinc-200 border-zinc-600/30',
  proof: 'bg-purple-600/15 text-purple-300 border-purple-500/30',
  contract: 'bg-amber-600/15 text-amber-300 border-amber-500/30',
  quote: 'bg-zinc-700/30 text-zinc-200 border-zinc-600/30',
  tax_form: 'bg-rose-600/15 text-rose-300 border-rose-500/30',
  other: 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30',
};

const TYPES: Array<{ value: string; label: string }> = [
  { value: '', label: 'All' },
  { value: 'invoice', label: 'Invoices' },
  { value: 'packing_slip', label: 'Packing slips' },
  { value: 'proof', label: 'Production proofs' },
  { value: 'contract', label: 'Contracts' },
  { value: 'quote', label: 'Quotes' },
  { value: 'tax_form', label: 'Tax forms' },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const url = filter ? `/api/documents?type=${filter}` : '/api/documents';
        const r = await api<{ documents: Document[] }>(url);
        setDocs(r.documents);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, [filter]);

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Documents</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Records</p>
            <h1 className="mt-1 text-3xl font-bold text-white">Documents</h1>
            <p className="mt-1 text-chrome-200">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => { setLoading(true); setFilter(t.value); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filter === t.value
                    ? 'bg-gold-500 text-midnight-950'
                    : 'border border-chrome-700/40 text-chrome-200 hover:border-gold-500/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-chrome-200">Loading…</div>
          ) : docs.length === 0 ? (
            <div className="p-12 text-center text-chrome-200">No documents match.</div>
          ) : (
            <div className="divide-y divide-chrome-700/30">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div>
                    <p className="text-sm text-white">{d.title}</p>
                    <p className="text-xs text-chrome-300 font-mono uppercase">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${TYPE_TONE[d.type]}`}>
                      {d.type.replace(/_/g, ' ')}
                    </span>
                    {d.fileUrl && (
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gold-300 hover:text-gold-200"
                      >
                        Download →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
