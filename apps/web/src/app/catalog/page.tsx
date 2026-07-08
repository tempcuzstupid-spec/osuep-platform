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
};

type Category = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
};

export const metadata = {
  title: 'Catalog — One Stop Uniforms',
  description: 'Browse our curated catalog of custom-branded apparel and accessories.',
};

async function fetchCatalogData(searchParams: Record<string, string>) {
  const query = new URLSearchParams();
  if (searchParams.category) query.set('category', searchParams.category);
  if (searchParams.search) query.set('search', searchParams.search);
  query.set('limit', '24');

  const headersList = headers();
  const host = headersList.get('host') ?? 'osuep-web.onrender.com';
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? `http://${host.replace('web', 'api')}`;

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${apiBase}/api/catalog/products?${query.toString()}`, {
      cache: 'no-store',
      headers: { 'origin': `${proto}://${host}` },
    }).catch((e) => ({ ok: false, error: e }) as any),
    fetch(`${apiBase}/api/catalog/categories`, {
      cache: 'no-store',
      headers: { 'origin': `${proto}://${host}` },
    }).catch((e) => ({ ok: false, error: e }) as any),
  ]);

  const products = productsRes.ok ? (await productsRes.json()).products as Product[] : [];
  const categories = categoriesRes.ok ? (await categoriesRes.json()).categories as Category[] : [];
  return { products, categories };
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const { products, categories } = await fetchCatalogData(searchParams);
  const activeCat = searchParams.category;
  const activeSearch = searchParams.search;
  const topLevel = categories.filter((c) => !c.parentId);

  return (
    <main className="min-h-screen bg-midnight-950">
      {/* Top bar */}
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-gold-300 hover:text-gold-200">
            ← Back home
          </Link>
          <div className="flex items-center gap-2 text-chrome-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink-500/15 px-3 py-1 font-semibold text-ink-300">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulse" />
              {products.length} products
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <header className="mx-auto max-w-7xl px-6 py-12 border-b border-chrome-700/40">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Catalog</p>
        <h1 className="mt-2 text-4xl font-bold text-white">
          {activeCat
            ? topLevel.find((c) => c.slug === activeCat)?.name ?? activeCat
            : 'Curated for your team'}
        </h1>
        <p className="mt-3 max-w-2xl text-chrome-200">
          One Stop Uniforms owns the catalog. Every item is selected, quality-checked,
          and ready for custom branding via embroidery or screen print.
        </p>

        {/* Search */}
        <form className="mt-6 flex max-w-xl gap-2">
          <input
            type="search"
            name="search"
            defaultValue={activeSearch ?? ''}
            placeholder="Search polos, jackets, caps…"
            className="input flex-1"
          />
          {activeCat && <input type="hidden" name="category" value={activeCat} />}
          <button className="btn-primary">Search</button>
        </form>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <h2 className="text-xs uppercase tracking-[0.3em] text-gold-400 mb-3">
            Categories
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/catalog"
                className={`block rounded px-3 py-1.5 ${
                  !activeCat ? 'bg-gold-600/15 text-gold-200' : 'text-chrome-100 hover:bg-midnight-800'
                }`}
              >
                All products
              </Link>
            </li>
            {topLevel.map((cat) => {
              const isActive = activeCat === cat.slug;
              const children = categories.filter((c) => c.parentId === cat.id);
              return (
                <li key={cat.id}>
                  <Link
                    href={`/catalog?category=${cat.slug}`}
                    className={`block rounded px-3 py-1.5 ${
                      isActive ? 'bg-gold-600/15 text-gold-200' : 'text-chrome-100 hover:bg-midnight-800'
                    }`}
                  >
                    {cat.name}
                  </Link>
                  {isActive && children.length > 0 && (
                    <ul className="ml-3 mt-1 space-y-1 border-l border-chrome-700/40 pl-2">
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/catalog?category=${child.slug}`}
                            className={`block rounded px-2 py-1 text-xs ${
                              activeCat === child.slug
                                ? 'bg-gold-600/10 text-gold-300'
                                : 'text-chrome-200 hover:text-chrome-100'
                            }`}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Product grid */}
        <section>
          {activeSearch && (
            <p className="text-sm text-chrome-200 mb-4">
              Showing {products.length} result{products.length !== 1 ? 's' : ''} for{' '}
              <span className="text-gold-300">&ldquo;{activeSearch}&rdquo;</span>
              {' · '}
              <Link href="/catalog" className="underline hover:text-gold-200">
                clear search
              </Link>
            </p>
          )}

          {products.length === 0 ? (
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-12 text-center">
              <p className="text-chrome-100">No products match your filters yet.</p>
              <p className="mt-1 text-sm text-chrome-300">
                Catalog is being curated. Check back soon — or browse all categories.
              </p>
              <Link href="/catalog" className="mt-4 inline-block btn-primary">
                Browse all
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/catalog/${p.sku}`}
                  className="group rounded-2xl border border-chrome-700/40 bg-midnight-900 overflow-hidden hover:border-gold-500/60 transition"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-midnight-800 to-midnight-950 flex items-center justify-center">
                    <span className="text-chrome-300 text-sm">{p.sku}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-chrome-300">{p.brand}</p>
                    <h3 className="mt-1 font-semibold text-white group-hover:text-gold-200 line-clamp-2">
                      {p.name}
                    </h3>
                    {p.shortDescription && (
                      <p className="mt-2 text-sm text-chrome-200 line-clamp-2">
                        {p.shortDescription}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-gold-300">
                        ${parseFloat(p.listPrice).toFixed(2)}
                      </span>
                      {p.customizable && (
                        <span className="rounded-full bg-purple-600/20 px-2 py-0.5 text-xs font-semibold text-purple-200">
                          Customizable
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
