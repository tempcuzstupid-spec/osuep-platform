'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  placedAt: string | null;
  expectedAt: string | null;
  itemCount: number;
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All' },
  { value: 'pending_approval', label: 'Pending approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_production', label: 'In production' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function statusTone(s: string): string {
  if (['shipped', 'delivered', 'approved'].includes(s)) return 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30';
  if (['pending_approval', 'in_production', 'ready_to_ship'].includes(s)) return 'bg-amber-600/15 text-amber-300 border-amber-500/30';
  if (['cancelled', 'on_hold'].includes(s)) return 'bg-rose-600/15 text-rose-300 border-rose-500/30';
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30';
}

function fmtMoney(s: string) {
  return `$${parseFloat(s).toFixed(2)}`;
}
function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const url = filter ? `/api/orders?status=${filter}` : '/api/orders';
        const r = await api<{ orders: Order[] }>(url);
        setOrders(r.orders);
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
          <Link href="/catalog" className="text-chrome-200 hover:text-white">+ New order</Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Orders</p>
            <h1 className="mt-1 text-3xl font-bold text-white">All orders</h1>
            <p className="mt-1 text-chrome-200">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setLoading(true); setFilter(f.value); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === f.value
                    ? 'bg-gold-500 text-midnight-950'
                    : 'border border-chrome-700/40 text-chrome-200 hover:border-gold-500/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-chrome-200">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-chrome-200">No orders match this filter.</p>
              <Link href="/catalog" className="mt-4 inline-block btn-primary">
                Browse catalog
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-midnight-800/50 text-xs uppercase tracking-wider text-chrome-300">
                  <tr>
                    <th className="px-5 py-3 text-left">Order</th>
                    <th className="px-5 py-3 text-left">Placed</th>
                    <th className="px-5 py-3 text-left">Items</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chrome-700/30">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-midnight-800/40">
                      <td className="px-5 py-3 font-mono text-sm text-gold-300">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-sm text-chrome-200">{fmtDate(o.placedAt)}</td>
                      <td className="px-5 py-3 text-sm text-chrome-200">{o.itemCount}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${statusTone(o.status)}`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-white text-right tabular-nums">
                        {fmtMoney(o.total)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/portal/orders/${o.id}`} className="text-xs text-gold-300 hover:text-gold-200">
                          Details →
                        </Link>
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
