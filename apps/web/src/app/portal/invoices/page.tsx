'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Invoice = {
  id: string;
  invoiceNumber: string;
  orderId: string | null;
  status: string;
  subtotal: string;
  tax: string;
  total: string;
  amountPaid: string;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
};

function statusTone(s: string) {
  if (s === 'paid') return 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30';
  if (s === 'overdue') return 'bg-rose-600/15 text-rose-300 border-rose-500/30';
  if (s === 'issued') return 'bg-amber-600/15 text-amber-300 border-amber-500/30';
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30';
}

function fmtMoney(s: string) {
  return `$${parseFloat(s).toFixed(2)}`;
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ invoices: Invoice[] }>('/api/invoices');
        setInvoices(r.invoices);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalOwed = invoices
    .filter((i) => i.status === 'issued' || i.status === 'overdue')
    .reduce((s, i) => s + parseFloat(i.total) - parseFloat(i.amountPaid), 0);

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Invoices</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Billing</p>
            <h1 className="mt-1 text-3xl font-bold text-white">Invoices</h1>
            <p className="mt-1 text-chrome-200">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
          </div>
          {totalOwed > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
              <p className="text-xs text-amber-300">Outstanding</p>
              <p className="text-xl font-bold text-amber-100 tabular-nums">{fmtMoney(String(totalOwed))}</p>
            </div>
          )}
        </header>

        <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-chrome-200">Loading…</div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center text-chrome-200">No invoices yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-midnight-800/50 text-xs uppercase tracking-wider text-chrome-300">
                  <tr>
                    <th className="px-5 py-3 text-left">Invoice</th>
                    <th className="px-5 py-3 text-left">Issued</th>
                    <th className="px-5 py-3 text-left">Due</th>
                    <th className="px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chrome-700/30">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-midnight-800/40">
                      <td className="px-5 py-3 font-mono text-sm text-gold-300">{inv.invoiceNumber}</td>
                      <td className="px-5 py-3 text-sm text-chrome-200">{fmtDate(inv.issuedAt)}</td>
                      <td className="px-5 py-3 text-sm text-chrome-200">{fmtDate(inv.dueAt)}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-white text-right tabular-nums">{fmtMoney(inv.total)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${statusTone(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {inv.orderId && (
                          <Link href={`/portal/orders/${inv.orderId}`} className="text-xs text-gold-300 hover:text-gold-200">
                            Order →
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
