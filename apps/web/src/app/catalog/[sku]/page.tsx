import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

type ProductDetail = {
  product: {
    id: string;
    sku: string;
    name: string;
    shortDescription: string | null;
    longDescription: string | null;
    brand: string | null;
    listPrice: string;
    specs: Record<string, unknown>;
    customizable: boolean;
    customizationConfig: { methods?: string[]; maxColors?: number; turnaroundDays?: number };
  };
  variants: Array<{ id: string; sku: string; size: string | null; color: string | null }>;
  images: Array<{ id: string; url: string; altText: string | null; isPrimary: boolean }>;
  category: { id: string; slug: string; name: string } | null;
};

type Props = { params: { sku: string } };

async function fetchProduct(sku: string): Promise<ProductDetail | null> {
  const headersList = headers();
  const host = headersList.get('host') ?? 'osuep-web.onrender.com';
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? `http://${host.replace('web', 'api')}`;
  try {
    const res = await fetch(`${apiBase}/api/catalog/products/${encodeURIComponent(sku)}`, {
      cache: 'no-store',
      headers: { origin: `${proto}://${host}` },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as ProductDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const data = await fetchProduct(params.sku);
  if (!data) return { title: 'Not found' };
  return {
    title: `${data.product.name} — One Stop Uniforms`,
    description: data.product.shortDescription ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const data = await fetchProduct(params.sku);
  if (!data) notFound();

  const { product, variants, images, category } = data;
  const primary = images.find((i) => i.isPrimary) ?? images[0];

  return (
    <main className="min-h-screen bg-midnight-950">
      {/* Top bar */}
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/catalog" className="text-gold-300 hover:text-gold-200">
            ← Back to catalog
          </Link>
          <span className="text-chrome-100 font-mono">SKU {product.sku}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="aspect-square rounded-3xl border border-chrome-700/40 bg-gradient-to-br from-midnight-800 to-midnight-950 flex items-center justify-center overflow-hidden">
            {primary ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primary.url} alt={primary.altText ?? product.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-chrome-300 text-sm">Image coming soon</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-xl border border-chrome-700/40 bg-midnight-900 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.altText ?? ''} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link
              href={`/catalog?category=${category.slug}`}
              className="text-xs uppercase tracking-wider text-gold-400 hover:text-gold-200"
            >
              {category.name}
            </Link>
          )}
          {product.brand && (
            <p className="mt-2 text-sm text-chrome-300">{product.brand}</p>
          )}
          <h1 className="mt-1 text-3xl font-bold text-white">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-gold-300">
            ${parseFloat(product.listPrice).toFixed(2)}
          </p>
          {product.shortDescription && (
            <p className="mt-4 text-chrome-200">{product.shortDescription}</p>
          )}
          {product.longDescription && (
            <p className="mt-2 text-sm text-chrome-300">{product.longDescription}</p>
          )}

          {variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-chrome-300">Variants</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <span
                    key={v.id}
                    className="rounded-full border border-chrome-700/40 bg-midnight-900 px-3 py-1 text-xs text-chrome-100"
                  >
                    {v.size ?? 'one-size'}
                    {v.color ? ` · ${v.color}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.customizable && (
            <div className="mt-8 rounded-2xl border border-purple-500/30 bg-purple-900/10 p-5">
              <h3 className="text-sm font-semibold text-purple-200">Custom Branding Available</h3>
              <ul className="mt-2 space-y-1 text-sm text-chrome-200">
                {product.customizationConfig.methods?.map((m) => (
                  <li key={m} className="capitalize">
                    • {m.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-chrome-300">
                Setup {product.customizationConfig.turnaroundDays ?? 7} days after artwork approval.
              </p>
              <Link
                href={{ pathname: '/portal/new-order', query: { sku: product.sku } } as any}
                className="mt-4 inline-block btn-primary"
              >
                Request a quote
              </Link>
            </div>
          )}

          {/* Specs */}
          {Object.keys(product.specs ?? {}).length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-wider text-chrome-300">Specs</h3>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-midnight-900 px-3 py-2">
                    <dt className="text-xs uppercase text-chrome-300">{k.replace(/_/g, ' ')}</dt>
                    <dd className="mt-0.5 text-chrome-100">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
