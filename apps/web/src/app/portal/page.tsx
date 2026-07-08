'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Me = {
  user: { id: string; email: string; fullName: string | null; mfaEnabled: boolean; isPlatformAdmin: boolean };
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

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  placedAt: string | null;
  expectedAt: string | null;
  itemCount: number;
};

type CartItem = {
  id: string;
  sku: string;
  productName: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: string;
  customization: any;
};

type Cart = {
  id: string;
  status: string;
  subtotal: string;
  total: string;
  itemCount?: number;
};

type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

function statusTone(s: string): string {
  if (['shipped', 'delivered', 'approved'].includes(s)) return 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30';
  if (['pending_approval', 'in_production', 'ready_to_ship'].includes(s)) return 'bg-amber-600/15 text-amber-300 border-amber-500/30';
  if (['cancelled', 'on_hold'].includes(s)) return 'bg-rose-600/15 text-rose-300 border-rose-500/30';
  return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30';
}

function fmtMoney(s: string | number) {
  const n = typeof s === 'string' ? parseFloat(s) : s;
  return `$${n.toFixed(2)}`;
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PortalPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<{ cart: Cart; items: CartItem[] } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const meData = await api<Me>('/api/auth/me');
        setMe(meData);
        // Parallel fetch
        const [ordersData, cartData, notifData] = await Promise.all([
          api<{ orders: Order[] }>('/api/orders').catch(() => ({ orders: [] })),
          api<{ cart: Cart; items: CartItem[] }>('/api/cart').catch(() => null),
          api<{ notifications: Notification[] }>('/api/notifications').catch(() => ({ notifications: [] })),
        ]);
        setOrders(ordersData.orders);
        setCart(cartData);
        setNotifications(notifData.notifications);
        setUnreadCount(notifData.notifications.filter((n) => !n.readAt).length);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) {
          router.push('/login');
        } else {
          setError(String(e));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-midnight-950">
        <div className="text-chrome-200">Loading…</div>
      </main>
    );
  }
  if (!me) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-midnight-950">
        <div className="text-rose-400">{error ?? 'Could not load account'}</div>
      </main>
    );
  }

  const orgName = me.memberships[0]?.orgName ?? '—';
  const orgRole = me.memberships[0]?.role ?? '—';
  const activeMembership = me.memberships[0];

  // Aggregate stats
  const totalSpentYTD = orders
    .filter((o) => !['cancelled'].includes(o.status))
    .reduce((s, o) => s + parseFloat(o.total), 0);
  const openOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const pendingApproval = orders.filter((o) => o.status === 'pending_approval');
  const cartItemCount = cart?.items.length ?? 0;
  const cartTotal = cart ? parseFloat(cart.cart.total) : 0;

  return (
    <main className="min-h-screen bg-midnight-950">
      {/* Top bar */}
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-gold-400 hover:text-gold-200 font-mono uppercase tracking-wider">
            ← OSUEP
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/portal/notifications" className="relative text-chrome-200 hover:text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link href="/portal/settings" className="text-chrome-200 hover:text-white">
              {me.user.fullName ?? me.user.email}
            </Link>
            <Link href="/" onClick={async (e) => {
              e.preventDefault();
              await api('/api/auth/logout', { method: 'POST' });
              router.push('/');
            }} className="text-chrome-300 hover:text-rose-300">
              Sign out
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Customer Portal</p>
            <h1 className="mt-1 text-3xl font-bold text-white">
              Welcome, {me.user.fullName?.split(' ')[0] ?? 'there'}
            </h1>
            <p className="mt-1 text-chrome-200">
              {orgName} · <span className="text-gold-300 font-mono uppercase text-xs">{orgRole}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/portal/cart" className="btn-ghost rounded-lg px-4 py-2 text-sm">
              Cart {cartItemCount > 0 && <span className="ml-1 text-gold-300">({cartItemCount})</span>}
            </Link>
            <Link href="/catalog" className="rounded-lg bg-gradient-purple px-4 py-2 text-sm font-semibold text-white shadow-glow-purple">
              + New order
            </Link>
          </div>
        </header>

        {/* KPI grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Kpi label="Open orders" value={String(openOrders.length)} accent="purple" />
          <Kpi label="Pending approval" value={String(pendingApproval.length)} accent="amber" />
          <Kpi label="Cart subtotal" value={fmtMoney(cartTotal)} accent="gold" />
          <Kpi label="Spent YTD" value={fmtMoney(totalSpentYTD)} accent="chrome" />
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickLink href="/portal/orders" label="Orders" desc={`${orders.length} total`} />
          <QuickLink href="/portal/cart" label="Cart" desc={cartItemCount > 0 ? `${cartItemCount} items` : 'empty'} />
          <QuickLink href="/portal/artwork" label="Artwork" desc="Logo library" />
          <QuickLink href="/portal/team" label="Team" desc="Members" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
              <div className="flex items-center justify-between border-b border-chrome-700/40 px-5 py-3">
                <h2 className="font-semibold text-white">Recent orders</h2>
                <Link href="/portal/orders" className="text-xs text-gold-300 hover:text-gold-200">
                  View all →
                </Link>
              </div>
              {orders.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <p className="text-chrome-200">No orders yet.</p>
                  <Link href="/catalog" className="mt-3 inline-block text-sm text-gold-300 hover:text-gold-200">
                    Start shopping →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-chrome-700/30">
                  {orders.slice(0, 6).map((o) => (
                    <Link
                      key={o.id}
                      href={`/portal/orders/${o.id}`}
                      className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-midnight-800/60"
                    >
                      <div>
                        <p className="font-mono text-sm text-gold-300">{o.orderNumber}</p>
                        <p className="text-xs text-chrome-300 mt-0.5">
                          {fmtDate(o.placedAt)} · {o.itemCount} line item{o.itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-mono uppercase ${statusTone(o.status)}`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-semibold text-white tabular-nums">
                          {fmtMoney(o.total)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900">
              <div className="flex items-center justify-between border-b border-chrome-700/40 px-5 py-3">
                <h2 className="font-semibold text-white">Activity</h2>
                <Link href="/portal/notifications" className="text-xs text-gold-300 hover:text-gold-200">
                  All →
                </Link>
              </div>
              {notifications.length === 0 ? (
                <div className="px-5 py-12 text-center text-chrome-200 text-sm">
                  No activity yet.
                </div>
              ) : (
                <div className="divide-y divide-chrome-700/30 max-h-96 overflow-y-auto">
                  {notifications.slice(0, 8).map((n) => (
                    <Link
                      key={n.id}
                      href={n.href ?? '#'}
                      className={`block px-5 py-3 hover:bg-midnight-800/60 ${!n.readAt ? 'bg-purple-900/10' : ''}`}
                    >
                      <p className="text-sm text-white">{n.title}</p>
                      {n.body && <p className="mt-0.5 text-xs text-chrome-300 line-clamp-2">{n.body}</p>}
                      <p className="mt-1 text-[10px] text-chrome-400 font-mono uppercase">{fmtDate(n.createdAt)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Cart preview */}
        {cart && cart.items.length > 0 && (
          <section className="mt-6">
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
              <div className="flex items-center justify-between border-b border-chrome-700/40 px-5 py-3">
                <h2 className="font-semibold text-white">Cart</h2>
                <Link href="/portal/cart" className="text-xs text-gold-300 hover:text-gold-200">
                  Review →
                </Link>
              </div>
              <div className="divide-y divide-chrome-700/30">
                {cart.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div>
                      <p className="text-sm text-white">{it.productName}</p>
                      <p className="text-xs text-chrome-300 font-mono">
                        {it.sku}
                        {it.size ? ` · ${it.size}` : ''}
                        {it.color ? ` · ${it.color}` : ''}
                        {it.customization?.decorationMethod ? ` · ${it.customization.decorationMethod}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white tabular-nums">
                        {fmtMoney(parseFloat(it.unitPrice) * it.quantity)}
                      </p>
                      <p className="text-xs text-chrome-300">qty {it.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-chrome-700/40 px-5 py-3">
                <span className="text-sm text-chrome-200">Subtotal</span>
                <span className="text-lg font-bold text-gold-300 tabular-nums">
                  {fmtMoney(cartTotal)}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Sub-navigation */}
        <nav className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { href: '/portal/team', label: 'Team' },
            { href: '/portal/locations', label: 'Locations' },
            { href: '/portal/artwork', label: 'Artwork' },
            { href: '/portal/documents', label: 'Documents' },
            { href: '/portal/messages', label: 'Messages' },
            { href: '/portal/settings', label: 'Settings' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-chrome-700/40 bg-midnight-900/60 px-4 py-3 text-sm text-chrome-100 hover:border-gold-500/60 hover:text-gold-200 transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent: 'purple' | 'amber' | 'gold' | 'chrome' }) {
  const tone = {
    purple: 'from-purple-500/20 text-purple-200',
    amber: 'from-amber-500/20 text-amber-200',
    gold: 'from-yellow-500/20 text-yellow-200',
    chrome: 'from-zinc-500/20 text-zinc-200',
  }[accent];
  return (
    <div className={`rounded-2xl border border-chrome-700/40 bg-gradient-to-br ${tone} to-transparent p-5`}>
      <p className="text-xs uppercase tracking-wider text-chrome-300">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white tabular-nums">{value}</p>
    </div>
  );
}

function QuickLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-chrome-700/40 bg-midnight-900/60 p-4 hover:border-gold-500/60 transition"
    >
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-chrome-300 mt-0.5">{desc}</p>
    </Link>
  );
}
