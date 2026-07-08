'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { api, ApiException } from '@/lib/api';

type Message = {
  id: string;
  orgId: string;
  threadId: string;
  fromUserId: string | null;
  isFromOsuep: boolean;
  body: string;
  relatedToType: string | null;
  relatedToId: string | null;
  createdAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api<{ messages: Message[] }>('/api/messages');
        setMessages(r.messages);
      } catch (e) {
        if (e instanceof ApiException && e.status === 401) window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    try {
      const r = await api<{ message: Message; threadId: string }>('/api/messages', {
        method: 'POST',
        json: { body },
      });
      setMessages([r.message, ...messages]);
      setBody('');
    } catch (e) {
      // ignore
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Portal</Link>
          <span className="font-mono text-chrome-200">Messages</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Support</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-chrome-200">Direct line to your account team. Replies within 1 business hour.</p>
        </header>

        <form onSubmit={send} className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5 mb-6">
          <label className="text-xs text-chrome-300">New message</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded border border-chrome-700/40 bg-midnight-800 px-3 py-2 text-sm text-white placeholder-chrome-500"
            placeholder="Type your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="rounded-lg bg-gradient-purple px-4 py-2 text-sm font-semibold text-white shadow-glow-purple hover:opacity-90 disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-chrome-200">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-chrome-200">No messages yet.</div>
          ) : (
            <div className="divide-y divide-chrome-700/30">
              {messages.map((m) => (
                <div key={m.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-chrome-300 font-mono uppercase">
                      {m.isFromOsuep ? 'OSUEP team' : 'You'}
                    </p>
                    <p className="text-[10px] text-chrome-400 font-mono">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-chrome-100 whitespace-pre-wrap">{m.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
