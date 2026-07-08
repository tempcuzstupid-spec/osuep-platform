import Link from 'next/link';
import { headers } from 'next/headers';
import { api } from '@/lib/api';

type Product = {
  id: string;
  sku: string;
  name: string;
  shortDescription: string | null;
  brand: string | null;
  listPrice: string;
  customizable: boolean;
  categoryId: string | null;
};

type Category = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
};

type Org = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

async function fetchStoreData(slug: string): Promise<{ products: Product[]; categories: Category[] }> {
  const h = headers();
  const host = h.get('host') ?? 'osuep-web.onrender.com';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? `http://${host.replace('web', 'api')}`;

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${apiBase}/api/catalog/products?limit=50`, {
        cache: 'no-store',
        headers: { origin: `${proto}://${host}` },
      }),
      fetch(`${apiBase}/api/catalog/categories`, {
        cache: 'no-store',
        headers: { origin: `${proto}://${host}` },
      }),
    ]);
    const products: Product[] = productsRes.ok ? ((await productsRes.json()).products ?? []) : [];
    const categories: Category[] = categoriesRes.ok ? ((await categoriesRes.json()).categories ?? []) : [];
    return { products, categories };
  } catch {
    return { products: [], categories: [] };
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `${params.slug} store — One Stop Uniforms`,
    description: 'Private company store with approved catalog, contract pricing, and one-click reorders.',
  };
}

export default async function CompanyStorePage({ params }: { params: { slug: string } }) {
  const { products, categories } = await fetchStoreData(params.slug);

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-gold-300 hover:text-gold-200">← OSUEP</Link>
          <span className="font-mono text-chrome-200">Store · {params.slug}</span>
        </div>
      </div>

      {/* Store hero */}
      <section className="relative overflow-hidden border-b border-chrome-700/40">
        <div className="absolute inset-0 bg-gradient-luxe" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Company store</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-white capitalize">
            {params.slug.replace(/-/g, ' ')}
          </h1>
          <p className="mt-3 max-w-2xl text-chrome-200">
            Approved catalog for this organization. Contract pricing and embroidery pre-loaded.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="rounded-lg bg-gradient-purple px-5 py-2.5 text-sm font-semibold text-white shadow-glow-purple">
              Request access
            </Link>
            <Link href="/login" className="rounded-lg border border-chrome-700/40 bg-midnight-900/60 px-5 py-2.5 text-sm text-white">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Categories */}
        {categories.filter((c) => !c.parentId).length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.filter((c) => !c.parentId).map((c) => (
              <span
                key={c.id}
                className="rounded-full border border-chrome-700/40 bg-midnight-900 px-4 py-1.5 text-sm text-chrome-100"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/catalog/${p.sku}`}
              className="group rounded-xl border border-chrome-700/40 bg-midnight-900 overflow-hidden hover:border-gold-500/60"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-midnight-800 to-midnight-950 flex items-center justify-center">
                <span className="font-mono text-xs text-chrome-300">{p.sku}</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-chrome-300">{p.brand}</p>
                <p className="mt-1 text-sm font-medium text-white line-clamp-2 group-hover:text-gold-200">{p.name}</p>
                <p className="mt-2 text-base font-bold text-gold-300">${parseFloat(p.listPrice).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-12 text-center">
            <p className="text-chrome-200">This store is being set up. Check back soon.</p>
          </div>
        )}
      </div>
    </main>
  );
}
