'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Order = {
  id: string;
  orderNumber: string;
  orgId: string;
  placedByUserId: string;
  status: string;
  buyerPoNumber: string | null;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  shipToAddress: any;
  billToAddress: any;
  customerNotes: string | null;
  internalNotes: string | null;
  placedAt: string | null;
  expectedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
};

type OrderItem = {
  id: string;
  sku: string;
  productName: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  customization: any;
  productionStatus: string;
  assignedToName: string | null;
};

type OrderEvent = {
  id: string;
  status: string;
  occurredAt: string;
  actorUserId: string | null;
  note: string | null;
};

type Shipment = {
  id: string;
  carrier: string | null;
  trackingNumber: string | null;
  status: string;
  shippedAt: string | null;
  estimatedAt: string | null;
  deliveredAt: string | null;
};

type Approval = {
  id: string;
  approverUserId: string;
  status: string;
  level?: number;
  decidedAt: string | null;
  note: string | null;
  requiredBecause: string | null;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  total: string;
  issuedAt: string | null;
  dueAt: string | null;
};

function fmtMoney(s: string) {
  return `$${parseFloat(s).toFixed(2)}`;
}
function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}
function statusTone(s: string) {
  if (['shipped', 'delivered', 'approved'].includes(s)) return 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30';
  if (['pending_approval', 'in_production', 'ready_to_ship'].includes(s)) return 'bg-amber-600/15 text-amber-300 border-amber-500/30';
  if (['cancelled', 'on_hold'].includes(s)) return 'bg-rose-600/15 text-rose-300 border-rose-500/30';
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30';
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ order: Order; items: OrderItem[]; events: OrderEvent[]; shipments: Shipment[]; approvals: Approval[]; invoices: Invoice[] }>(`/api/orders/${id}`);
        setOrder(r.order);
        setItems(r.items);
        setEvents(r.events);
        setShipments(r.shipments);
        setApprovals(r.approvals);
        setInvoices(r.invoices);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) router.push('/login');
        else setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center bg-midnight-950 text-chrome-200">Loading…</main>;
  }
  if (error || !order) {
    return <main className="min-h-screen flex items-center justify-center bg-midnight-950 text-rose-400">{error ?? 'Order not found'}</main>;
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal/orders" className="text-gold-300 hover:text-gold-200">← All orders</Link>
          <span className="font-mono text-gold-300">{order.orderNumber}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Order</p>
            <h1 className="mt-1 text-3xl font-bold text-white font-mono">{order.orderNumber}</h1>
            <p className="mt-1 text-chrome-200">
              Placed {fmtDate(order.placedAt)} · {items.length} line item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-sm font-mono uppercase ${statusTone(order.status)}`}>
            {order.status.replace(/_/g, ' ')}
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line items */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
              <div className="border-b border-chrome-700/40 px-5 py-3">
                <h2 className="font-semibold text-white">Items</h2>
              </div>
              <div className="divide-y divide-chrome-700/30">
                {items.map((it) => (
                  <div key={it.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{it.productName}</p>
                        <p className="mt-1 text-xs text-chrome-300 font-mono">
                          {it.sku}
                          {it.size ? ` · ${it.size}` : ''}
                          {it.color ? ` · ${it.color}` : ''}
                        </p>
                        {it.customization && Object.keys(it.customization).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {it.customization.decorationMethod && (
                              <span className="rounded bg-purple-600/20 px-2 py-0.5 text-[10px] uppercase font-mono text-purple-200">
                                {it.customization.decorationMethod}
                              </span>
                            )}
                            {it.customization.decorationLocation && (
                              <span className="rounded bg-chrome-700/40 px-2 py-0.5 text-[10px] uppercase font-mono text-chrome-200">
                                {it.customization.decorationLocation.replace(/_/g, ' ')}
                              </span>
                            )}
                            {it.customization.rushRequested && (
                              <span className="rounded bg-amber-600/20 px-2 py-0.5 text-[10px] uppercase font-mono text-amber-200">
                                Rush
                              </span>
                            )}
                          </div>
                        )}
                        {it.assignedToName && (
                          <p className="mt-1 text-xs text-chrome-300">For: {it.assignedToName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white tabular-nums">{fmtMoney(it.lineTotal)}</p>
                        <p className="text-xs text-chrome-300">qty {it.quantity} @ {fmtMoney(it.unitPrice)}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-chrome-300">
                      <span>Production:</span>
                      <span className={`rounded-full border px-2 py-0.5 font-mono uppercase ${statusTone(it.productionStatus)}`}>
                        {it.productionStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-chrome-700/40 px-5 py-3 space-y-1 text-sm">
                <Row label="Subtotal" value={fmtMoney(order.subtotal)} />
                <Row label="Tax" value={fmtMoney(order.tax)} />
                <Row label="Shipping" value={fmtMoney(order.shipping)} />
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-chrome-700/30 text-base">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-gold-300 tabular-nums">{fmtMoney(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipments */}
            {shipments.length > 0 && (
              <div className="mt-6 rounded-2xl border border-chrome-700/40 bg-midnight-900">
                <div className="border-b border-chrome-700/40 px-5 py-3">
                  <h2 className="font-semibold text-white">Shipments</h2>
                </div>
                {shipments.map((s) => (
                  <div key={s.id} className="border-b border-chrome-700/30 px-5 py-4 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-white">
                        {s.carrier ?? 'Carrier TBD'}
                        {s.trackingNumber && (
                          <span className="ml-2 font-mono text-xs text-gold-300">{s.trackingNumber}</span>
                        )}
                      </p>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${statusTone(s.status)}`}>
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-chrome-300">
                      Shipped {fmtDate(s.shippedAt)} · Estimated {fmtDate(s.estimatedAt)}
                    </p>
                    {s.trackingNumber && (
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`${s.carrier ?? ''} tracking ${s.trackingNumber}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-gold-300 hover:text-gold-200"
                      >
                        Track externally →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Invoices */}
            {invoices.length > 0 && (
              <div className="mt-6 rounded-2xl border border-chrome-700/40 bg-midnight-900">
                <div className="border-b border-chrome-700/40 px-5 py-3">
                  <h2 className="font-semibold text-white">Invoices</h2>
                </div>
                {invoices.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/portal/invoices`}
                    className="flex items-center justify-between border-b border-chrome-700/30 px-5 py-3 last:border-0 hover:bg-midnight-800/40"
                  >
                    <div>
                      <p className="font-mono text-sm text-gold-300">{inv.invoiceNumber}</p>
                      <p className="text-xs text-chrome-300">Issued {fmtDate(inv.issuedAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{fmtMoney(inv.total)}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase ${statusTone(inv.status)}`}>
                        {inv.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <section>
            {/* Timeline */}
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900">
              <div className="border-b border-chrome-700/40 px-5 py-3">
                <h2 className="font-semibold text-white">Timeline</h2>
              </div>
              <ol className="px-5 py-3 space-y-3">
                {events.map((e) => (
                  <li key={e.id} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-gold-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase mr-2 ${statusTone(e.status)}`}>
                          {e.status.replace(/_/g, ' ')}
                        </span>
                      </p>
                      {e.note && <p className="mt-1 text-xs text-chrome-200">{e.note}</p>}
                      <p className="mt-1 text-[10px] text-chrome-400 font-mono uppercase">{fmtDate(e.occurredAt)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Approvals */}
            {approvals.length > 0 && (
              <div className="mt-6 rounded-2xl border border-chrome-700/40 bg-midnight-900">
                <div className="border-b border-chrome-700/40 px-5 py-3">
                  <h2 className="font-semibold text-white">Approvals</h2>
                </div>
                <div className="divide-y divide-chrome-700/30">
                  {approvals.map((a) => (
                    <div key={a.id} className="px-5 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-chrome-100">Level {a.level}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${statusTone(a.status)}`}>
                          {a.status}
                        </span>
                      </div>
                      {a.requiredBecause && <p className="mt-1 text-xs text-chrome-300">{a.requiredBecause}</p>}
                      {a.note && <p className="mt-1 text-xs text-chrome-200">{a.note}</p>}
                      {a.decidedAt && <p className="mt-1 text-[10px] text-chrome-400 font-mono uppercase">Decided {fmtDate(a.decidedAt)}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.customerNotes && (
              <div className="mt-6 rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
                <h2 className="font-semibold text-white">Notes</h2>
                <p className="mt-2 text-sm text-chrome-200">{order.customerNotes}</p>
              </div>
            )}

            {order.buyerPoNumber && (
              <div className="mt-6 rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
                <h2 className="font-semibold text-white">Buyer PO</h2>
                <p className="mt-2 text-sm font-mono text-gold-300">{order.buyerPoNumber}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-chrome-300">{label}</span>
      <span className="text-chrome-100 tabular-nums">{value}</span>
    </div>
  );
}
