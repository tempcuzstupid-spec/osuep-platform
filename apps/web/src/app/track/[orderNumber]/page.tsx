'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type TrackResult = {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    expectedAt: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
  };
  shipment: {
    carrier: string | null;
    trackingNumber: string | null;
    status: string;
    shippedAt: string | null;
    estimatedAt: string | null;
    deliveredAt: string | null;
  } | null;
  events: Array<{
    id: string;
    status: string;
    occurredAt: string;
    note: string | null;
  }>;
};

function statusTone(s: string) {
  if (['delivered'].includes(s)) return 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30';
  if (['pending_approval', 'in_production', 'ready_to_ship', 'shipped', 'in_transit'].includes(s)) return 'bg-amber-600/15 text-amber-300 border-amber-500/30';
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30';
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function TrackOrderPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [data, setData] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<TrackResult>(`/api/track/${encodeURIComponent(orderNumber)}`);
        setData(r);
      } catch (e) {
        if (e instanceof ApiException && e.status === 404) setError('Order not found');
        else setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [orderNumber]);

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/track" className="text-gold-300 hover:text-gold-200">← Track another</Link>
          <Link href="/" className="text-chrome-200 hover:text-white">Home</Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {loading ? (
          <p className="text-chrome-200 text-center py-12">Looking up order…</p>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-8 text-center">
            <p className="text-rose-200">{error}</p>
            <Link href="/track" className="mt-4 inline-block text-sm text-gold-300 hover:text-gold-200">
              Try another order number →
            </Link>
          </div>
        ) : data ? (
          <>
            <header className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Order</p>
              <h1 className="mt-1 text-3xl font-bold text-white font-mono">{data.order.orderNumber}</h1>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className={`rounded-full border px-3 py-1 text-sm font-mono uppercase ${statusTone(data.order.status)}`}>
                  {data.order.status.replace(/_/g, ' ')}
                </span>
                {data.order.shippedAt && (
                  <span className="text-xs text-chrome-300">
                    Shipped {fmtDate(data.order.shippedAt)}
                  </span>
                )}
                {data.order.expectedAt && data.order.status !== 'delivered' && (
                  <span className="text-xs text-chrome-300">
                    Expected {fmtDate(data.order.expectedAt)}
                  </span>
                )}
              </div>
            </header>

            {data.shipment && (
              <section className="mb-6 rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
                <h2 className="font-semibold text-white">Shipment</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-chrome-300">Carrier</p>
                    <p className="mt-1 text-white">{data.shipment.carrier ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-chrome-300">Tracking</p>
                    <p className="mt-1 font-mono text-gold-300">{data.shipment.trackingNumber ?? '—'}</p>
                  </div>
                </div>
                {data.shipment.trackingNumber && (
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(`${data.shipment.carrier ?? ''} tracking ${data.shipment.trackingNumber}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block text-sm text-gold-300 hover:text-gold-200"
                  >
                    Track with carrier →
                  </a>
                )}
              </section>
            )}

            <section className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
              <h2 className="font-semibold text-white">Activity</h2>
              <ol className="mt-4 space-y-4">
                {data.events.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-gold-400 flex-shrink-0" />
                    <div className="flex-1">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase ${statusTone(e.status)}`}>
                        {e.status.replace(/_/g, ' ')}
                      </span>
                      {e.note && <p className="mt-1 text-sm text-chrome-200">{e.note}</p>}
                      <p className="mt-1 text-[10px] text-chrome-400 font-mono uppercase">{fmtDate(e.occurredAt)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
