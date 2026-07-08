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

type Industry = {
  slug: string;
  name: string;
  blurb: string;
  heroCopy: string;
  benefits: Array<{ title: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
};

const INDUSTRIES: Record<string, Industry> = {
  schools: {
    slug: 'schools',
    name: 'Schools & Universities',
    blurb: 'From kindergarten to campus, outfit every grade, team, and department.',
    heroCopy: 'Branding for every student, staff, and athletic program — with approval chains built for institutional purchasing.',
    benefits: [
      { title: 'Department stores', body: 'Each campus, grade, or team gets its own curated store with approved items, sizes, and pricing.' },
      { title: 'Budget controls', body: 'Per-department spending limits, purchase orders, and approval workflows match how schools actually buy.' },
      { title: 'Athletic uniforms', body: 'Coordinated team kits with custom embroidery, size runs, and recurring seasonal reorders.' },
      { title: 'Quick reorder', body: 'Last year\'s graduation gowns? Same marching band uniform? Reorder in two clicks.' },
    ],
    faqs: [
      { q: 'Can parents order from your store?', a: 'Yes — set up a public store URL that parents can use directly, with size guides and the school logo pre-loaded.' },
      { q: 'How do purchase orders work?', a: 'Buyers can attach a school PO number to any order. Approval chains route to the right administrator based on amount and department.' },
    ],
  },
  hospitals: {
    slug: 'hospitals',
    name: 'Hospitals & Medical',
    blurb: 'Scrubs, lab coats, and patient-facing apparel for entire health systems.',
    heroCopy: 'Standardize your clinical apparel across facilities while keeping each department\'s identity distinct.',
    benefits: [
      { title: 'Compliance', body: 'Antimicrobial finishes, fluid-resistant lab coats, and traceable laundering tags.' },
      { title: 'Role-based branding', body: 'Different embroidery for nurses vs. techs vs. physicians — all in one curated catalog.' },
      { title: 'Per-facility stores', body: 'Each hospital or clinic gets its own storefront with approved items and budget tracking.' },
      { title: 'Bulk sizing', body: 'Tall, petite, and specialty sizing handled at the variant level, not as a custom order.' },
    ],
    faqs: [
      { q: 'Do you handle laundering?', a: 'Not directly, but we can coordinate with your laundering vendor and route orders to their address.' },
      { q: 'What about ID badges and name tags?', a: 'Add custom embroidery for name, role, and credentials at checkout — included in the unit price.' },
    ],
  },
  hotels: {
    slug: 'hotels',
    name: 'Hotels & Hospitality',
    blurb: 'Front desk to housekeeping — your brand, our platform.',
    heroCopy: 'Property-by-property stores with brand-locked catalogs, embroidery included, and seasonal refresh built in.',
    benefits: [
      { title: 'Property-level stores', body: 'Each property gets a dedicated storefront with that location\'s approved items.' },
      { title: 'Brand consistency', body: 'Lock down approved logos, thread colors, and placements per property to protect brand integrity.' },
      { title: 'Housekeeping & F&B', body: 'Aprons, polos, oxfords, and outerwear — every role covered in one cart.' },
      { title: 'Reorder automation', body: 'When you onboard 10 new servers, pull last quarter\'s PO and reorder with one click.' },
    ],
    faqs: [
      { q: 'Can you handle seasonal refreshes?', a: 'Yes — set up scheduled reorders aligned to your property\'s high/low season calendar.' },
      { q: 'How do you handle multi-brand portfolios?', a: 'Each brand gets its own sub-catalog within your org account, with its own pricing.' },
    ],
  },
  government: {
    slug: 'government',
    name: 'Government & Public Sector',
    blurb: 'Municipal, state, and federal agencies — built for procurement compliance.',
    heroCopy: 'A platform that speaks the language of public procurement: contracts, RFQs, and audit trails.',
    benefits: [
      { title: 'Contract pricing', body: 'Locked-in pricing per contract period, with usage tracking and renewal alerts.' },
      { title: 'Audit-ready', body: 'Every action logged: who, what, when, from where. Reports in formats auditors actually use.' },
      { title: 'Multi-org hierarchy', body: 'Department → Division → Office → Employee. Each level gets its own budget and approval chain.' },
      { title: 'Vendor compliance', body: 'Source from approved suppliers only. Track Made in USA, minority-owned, and small business certifications.' },
    ],
    faqs: [
      { q: 'Do you support SAM.gov registration?', a: 'Yes — One Stop Uniforms is registered and can provide CAGE codes, UEI, and capability statements.' },
      { q: 'What about GSA schedules?', a: 'We can quote on GSA schedules for federal buyers — contact our team to set up.' },
    ],
  },
  restaurants: {
    slug: 'restaurants',
    name: 'Restaurants & Food Service',
    blurb: 'Front of house, back of house, and everything between.',
    heroCopy: 'Aprons, chef coats, server polos — get your whole team looking sharp across every location.',
    benefits: [
      { title: 'Per-location stores', body: 'Each restaurant gets its own store with location-specific branding and items.' },
      { title: 'Heat-resistant fabrics', body: 'Chef coats, kitchen towels, and aprons built for high-heat environments.' },
      { title: 'Bulk value pricing', body: 'The more you order, the better the pricing — auto-applied at checkout.' },
      { title: 'Quick onboarding', body: 'New hire starts tomorrow? Send them a one-time link to order their starter kit.' },
    ],
    faqs: [
      { q: 'What\'s the turnaround time?', a: 'Most decorated orders ship within 7 business days. Rush options available at checkout.' },
      { q: 'Can employees order and have it shipped to their home?', a: 'Yes — employee-direct shipping with company-billed options available.' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES).map((slug) => ({ industry: slug }));
}

export async function generateMetadata({ params }: { params: { industry: string } }) {
  const ind = INDUSTRIES[params.industry];
  if (!ind) return { title: 'Not found' };
  return {
    title: `${ind.name} — One Stop Uniforms`,
    description: ind.blurb,
  };
}

async function fetchProducts(): Promise<Product[]> {
  const h = headers();
  const host = h.get('host') ?? 'osuep-web.onrender.com';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? `http://${host.replace('web', 'api')}`;
  try {
    const res = await fetch(`${apiBase}/api/catalog/products?limit=6`, {
      cache: 'no-store',
      headers: { origin: `${proto}://${host}` },
    });
    if (!res.ok) return [];
    const d = await res.json();
    return d.products ?? [];
  } catch {
    return [];
  }
}

export default async function IndustryPage({ params }: { params: { industry: string } }) {
  const ind = INDUSTRIES[params.industry];
  if (!ind) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-midnight-950 text-chrome-200">
        Industry not found.
      </main>
    );
  }
  const products = await fetchProducts();

  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-gold-300 hover:text-gold-200">← OSUEP</Link>
          <span className="font-mono text-chrome-200">For {ind.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-chrome-700/40">
        <div className="absolute inset-0 bg-gradient-luxe" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">For {ind.name.toLowerCase()}</p>
          <h1 className="mt-2 max-w-3xl text-5xl md:text-6xl font-bold text-white text-balance">
            {ind.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-chrome-200 text-balance">
            {ind.heroCopy}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/register" className="rounded-lg bg-gradient-purple px-7 py-3 text-base font-semibold text-white shadow-glow-purple">
              Start a free org
            </Link>
            <Link href="/catalog" className="rounded-lg border border-chrome-700/40 bg-midnight-900/60 px-7 py-3 text-base text-white">
              Browse the catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ind.benefits.map((b, i) => (
            <div key={i} className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-6">
              <p className="text-xs uppercase tracking-wider text-gold-400">0{i + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{b.title}</h3>
              <p className="mt-2 text-chrome-200">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products preview */}
      {products.length > 0 && (
        <section className="border-y border-chrome-700/40 bg-midnight-900/40">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Sample catalog</p>
                <h2 className="mt-1 text-3xl font-bold text-white">A few of what we offer</h2>
              </div>
              <Link href="/catalog" className="text-sm text-gold-300 hover:text-gold-200">View all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  href={`/catalog/${p.sku}`}
                  className="group rounded-xl border border-chrome-700/40 bg-midnight-900 overflow-hidden hover:border-gold-500/60"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-midnight-800 to-midnight-950 flex items-center justify-center">
                    <span className="font-mono text-xs text-chrome-300">{p.sku}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-white line-clamp-2">{p.name}</p>
                    <p className="mt-1 text-sm font-bold text-gold-300">${parseFloat(p.listPrice).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-400 text-center">FAQ</p>
        <h2 className="mt-2 text-3xl font-bold text-white text-center">Common questions</h2>
        <div className="mt-10 space-y-4">
          {ind.faqs.map((f, i) => (
            <details key={i} className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5 group">
              <summary className="cursor-pointer text-sm font-semibold text-white list-none flex items-center justify-between">
                {f.q}
                <span className="text-gold-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-chrome-200">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-chrome-700/40 bg-midnight-900/60">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white text-balance">Ready to outfit your {ind.name.toLowerCase()}?</h2>
          <p className="mt-3 text-chrome-200">Set up a free organization account in under 5 minutes.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="rounded-lg bg-gradient-purple px-6 py-3 text-base font-semibold text-white shadow-glow-purple">
              Start free
            </Link>
            <Link href="/contact" className="text-sm text-gold-300 hover:text-gold-200">
              Talk to sales →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
