'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type AdminOrder = {
  id: string;
  orderNumber: string;
  orgId: string;
  status: string;
  total: string;
  placedAt: string | null;
  placedByUserId: string;
};

function statusTone(s: string) {
  if (['shipped', 'delivered', 'approved'].includes(s)) return 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30';
  if (['pending_approval', 'in_production', 'ready_to_ship'].includes(s)) return 'bg-amber-600/15 text-amber-300 border-amber-500/30';
  if (['cancelled', 'on_hold'].includes(s)) return 'bg-rose-600/15 text-rose-300 border-rose-500/30';
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30';
}

function fmtMoney(s: string) {
  return `$${parseFloat(s).toFixed(2)}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ orders: AdminOrder[] }>('/api/admin/orders');
        setOrders(r.orders);
      } catch (e) {
        if (e instanceof ApiException && (e.status === 401 || e.status === 403)) {
          setDenied(true);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (denied) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-midnight-950 text-rose-300">
        Platform admin only.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/admin" className="text-gold-300 hover:text-gold-200">← Admin</Link>
          <span className="font-mono text-chrome-200">All orders</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-white">All orders</h1>
          <p className="mt-1 text-chrome-200">{orders.length} order{orders.length !== 1 ? 's' : ''} across all customers</p>
        </header>
        <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-chrome-200">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-midnight-800/50 text-xs uppercase tracking-wider text-chrome-300">
                  <tr>
                    <th className="px-5 py-3 text-left">Order</th>
                    <th className="px-5 py-3 text-left">Org</th>
                    <th className="px-5 py-3 text-left">Placed</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-chrome-700/30">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-midnight-800/40">
                      <td className="px-5 py-3 font-mono text-sm text-gold-300">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-xs text-chrome-300 font-mono">{o.orgId.slice(0, 8)}…</td>
                      <td className="px-5 py-3 text-sm text-chrome-200">{o.placedAt ? new Date(o.placedAt).toLocaleDateString() : '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${statusTone(o.status)}`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-white text-right tabular-nums">{fmtMoney(o.total)}</td>
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
