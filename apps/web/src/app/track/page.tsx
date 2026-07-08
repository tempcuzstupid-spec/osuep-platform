'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

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

export default function TrackLandingPage() {
  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-gold-300 hover:text-gold-200">← OSUEP</Link>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Order tracking</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Where's my order?</h1>
        <p className="mt-2 text-chrome-200">Enter your order number to see status.</p>
        <form className="mt-8 flex max-w-md mx-auto gap-2">
          <input
            type="text"
            name="orderNumber"
            placeholder="OSU-2026-000123"
            className="input flex-1"
          />
          <button
            type="submit"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              const v = (e.currentTarget.previousElementSibling as HTMLInputElement).value;
              if (v) window.location.href = `/track/${encodeURIComponent(v)}`;
            }}
          >
            Track
          </button>
        </form>
        <p className="mt-4 text-xs text-chrome-400">
          Or paste the full URL from your order confirmation email.
        </p>
      </div>
    </main>
  );
}
