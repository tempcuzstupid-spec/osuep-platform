'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiException } from '@/lib/api';

type CartItem = {
  id: string;
  productId: string;
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
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ cart: Cart; items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [po, setPo] = useState('');
  const [notes, setNotes] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ cart: Cart; items: CartItem[] }>('/api/cart');
        setCart(r);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) router.push('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function updateQty(itemId: string, qty: number) {
    try {
      await api(`/api/cart/items/${itemId}`, { method: 'PATCH', json: { quantity: qty } });
      const r = await api<{ cart: Cart; items: CartItem[] }>('/api/cart');
      setCart(r);
    } catch (e) {
      setError(String(e));
    }
  }

  async function removeItem(itemId: string) {
    try {
      await api(`/api/cart/items/${itemId}`, { method: 'DELETE' });
      const r = await api<{ cart: Cart; items: CartItem[] }>('/api/cart');
      setCart(r);
    } catch (e) {
      setError(String(e));
    }
  }

  async function checkout() {
    if (!cart) return;
    setCheckingOut(true);
    setError(null);
    try {
      const r = await api<{ order: { id: string; orderNumber: string } }>('/api/orders/checkout', {
        method: 'POST',
        json: { buyerPoNumber: po || undefined, customerNotes: notes || undefined },
      });
      router.push(`/portal/orders/${r.order.id}`);
    } catch (e) {
      setError(String(e));
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center bg-midnight-950 text-chrome-200">Loading…</main>;
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Cart</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Cart</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Your cart</h1>
          <p className="mt-1 text-chrome-200">
            {cart?.items.length ?? 0} item{(cart?.items.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-12 text-center">
            <p className="text-chrome-200">Your cart is empty.</p>
            <Link href="/catalog" className="mt-4 inline-block btn-primary">
              Browse the catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
                <div className="divide-y divide-chrome-700/30">
                  {cart.items.map((it) => (
                    <div key={it.id} className="flex items-start gap-4 p-5">
                      <div className="aspect-square w-20 rounded-lg bg-gradient-to-br from-midnight-800 to-midnight-950 flex items-center justify-center flex-shrink-0">
                        <span className="font-mono text-[10px] text-chrome-300">{it.sku}</span>
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/catalog/${it.sku}`}
                          className="font-semibold text-white hover:text-gold-200"
                        >
                          {it.productName}
                        </Link>
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
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="inline-flex items-center rounded border border-chrome-700/40">
                            <button
                              type="button"
                              onClick={() => updateQty(it.id, Math.max(0, it.quantity - 1))}
                              className="px-2 py-1 text-chrome-200 hover:text-white"
                            >
                              −
                            </button>
                            <span className="px-3 text-sm tabular-nums">{it.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQty(it.id, it.quantity + 1)}
                              className="px-2 py-1 text-chrome-200 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(it.id)}
                            className="text-xs text-rose-300 hover:text-rose-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white tabular-nums">
                          ${(parseFloat(it.unitPrice) * it.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-chrome-300">${parseFloat(it.unitPrice).toFixed(2)} ea</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5 sticky top-6">
                <h2 className="font-semibold text-white">Order summary</h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-chrome-200">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${parseFloat(cart.cart.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-chrome-200">
                    <span>Tax (est.)</span>
                    <span className="tabular-nums">${(parseFloat(cart.cart.subtotal) * 0.0825).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-chrome-200">
                    <span>Shipping (est.)</span>
                    <span className="tabular-nums">${parseFloat(cart.cart.subtotal) > 500 ? '0.00' : '24.99'}</span>
                  </div>
                  <div className="border-t border-chrome-700/30 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-gold-300 tabular-nums">
                      ${(
                        parseFloat(cart.cart.subtotal) +
                        parseFloat(cart.cart.subtotal) * 0.0825 +
                        (parseFloat(cart.cart.subtotal) > 500 ? 0 : 24.99)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <label className="text-xs text-chrome-300">Buyer PO (optional)</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                      placeholder="PO-2026-001"
                      value={po}
                      onChange={(e) => setPo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-chrome-300">Notes (optional)</label>
                    <textarea
                      className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                      placeholder="Special instructions, requested ship date, etc."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={checkout}
                  disabled={checkingOut}
                  className="mt-6 w-full rounded-lg bg-gradient-purple px-4 py-3 text-sm font-semibold text-white shadow-glow-purple hover:opacity-90 disabled:opacity-50"
                >
                  {checkingOut ? 'Submitting…' : 'Submit for approval'}
                </button>
                <p className="mt-2 text-[10px] text-center text-chrome-300 font-mono uppercase">
                  Orders over $500 require org_admin approval
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
