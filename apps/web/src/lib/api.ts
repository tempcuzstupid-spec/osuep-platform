// Tiny fetch wrapper that:
// - Always sends cookies
// - Forwards JSON
// - Throws on non-2xx with structured error

export type ApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export class ApiException extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(e: ApiError) {
    super(e.message);
    this.name = 'ApiException';
    this.status = e.status;
    this.code = e.code;
    this.details = e.details;
  }
}

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type Opts = Omit<RequestInit, 'body' | 'headers'> & {
  json?: unknown;
  headers?: Record<string, string>;
};

export async function api<T = unknown>(path: string, opts: Opts = {}): Promise<T> {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  let body: BodyInit | undefined = undefined;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers['content-type'] = 'application/json';
  }
  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? (body ? 'POST' : 'GET'),
    credentials: 'include',
    headers,
    body,
    cache: 'no-store',
  });
  const text = await res.text();
  const data = text ? safeJson(text) : undefined;
  if (!res.ok) {
    const e = (data as any)?.error ?? { code: 'unknown', message: res.statusText };
    throw new ApiException({ status: res.status, ...e });
  }
  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
