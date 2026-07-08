'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ notifications: Notification[] }>('/api/notifications');
        setNotifs(r.notifications);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function markAllRead() {
    try {
      await api('/api/notifications/read-all', { method: 'POST' });
      setNotifs(notifs.map((n) => ({ ...n, readAt: new Date().toISOString() })));
    } catch {}
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Notifications</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Activity</p>
            <h1 className="mt-1 text-3xl font-bold text-white">Notifications</h1>
          </div>
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs text-gold-300 hover:text-gold-200"
          >
            Mark all read
          </button>
        </header>

        <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-chrome-200">Loading…</div>
          ) : notifs.length === 0 ? (
            <div className="p-12 text-center text-chrome-200">No notifications.</div>
          ) : (
            <div className="divide-y divide-chrome-700/30">
              {notifs.map((n) => (
                <Link
                  key={n.id}
                  href={n.href ?? '#'}
                  className={`block px-5 py-4 hover:bg-midnight-800/40 ${!n.readAt ? 'bg-purple-900/5' : ''}`}
                  onClick={async () => {
                    if (!n.readAt) {
                      try { await api(`/api/notifications/${n.id}/read`, { method: 'POST' }); } catch {}
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {!n.readAt && <span className="mt-1.5 h-2 w-2 rounded-full bg-gold-400 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      {n.body && <p className="mt-1 text-xs text-chrome-300">{n.body}</p>}
                      <p className="mt-1 text-[10px] text-chrome-400 font-mono uppercase">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
