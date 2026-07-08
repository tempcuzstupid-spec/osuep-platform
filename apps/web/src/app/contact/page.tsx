'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', org: '', size: '1-50', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Stub: in real life, POST to /api/contact
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-gold-300 hover:text-gold-200">← OSUEP</Link>
          <span className="font-mono text-chrome-200">Contact</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Talk to us</p>
          <h1 className="mt-1 text-4xl font-bold text-white">Let's get you set up</h1>
          <p className="mt-2 text-chrome-200">
            Tell us a bit about your organization and we'll be in touch within one business day.
          </p>
        </header>

        {done ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center">
            <p className="text-emerald-200 text-lg font-semibold">Thanks — we'll be in touch.</p>
            <p className="mt-2 text-sm text-chrome-200">
              Check your inbox for a confirmation. A real human from our team will follow up within one business day.
            </p>
            <Link href="/" className="mt-4 inline-block text-sm text-gold-300 hover:text-gold-200">
              ← Back to home
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-chrome-300">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                />
              </div>
              <div>
                <label className="text-xs text-chrome-300">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-chrome-300">Organization</label>
                <input
                  type="text"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                  className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                />
              </div>
              <div>
                <label className="text-xs text-chrome-300">Team size</label>
                <select
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white"
                >
                  <option>1-50</option>
                  <option>51-200</option>
                  <option>201-1000</option>
                  <option>1001-5000</option>
                  <option>5000+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-chrome-300">What can we help with?</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
                placeholder="Tell us about your team, current process, and what you're hoping to fix."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-purple px-4 py-3 text-sm font-semibold text-white shadow-glow-purple hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
            <p className="text-xs uppercase tracking-wider text-gold-400">Sales</p>
            <p className="mt-2 text-white">sales@osuep.com</p>
          </div>
          <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
            <p className="text-xs uppercase tracking-wider text-gold-400">Support</p>
            <p className="mt-2 text-white">support@osuep.com</p>
          </div>
          <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5">
            <p className="text-xs uppercase tracking-wider text-gold-400">Phone</p>
            <p className="mt-2 text-white">1-800-OSUEP-1</p>
          </div>
        </div>
      </div>
    </main>
  );
}
