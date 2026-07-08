import Link from 'next/link';

const FEATURES = [
  {
    title: 'Organization accounts',
    body: 'Parent companies, multiple locations, departments, buyers, approvers, finance contacts, and custom catalogs.',
    icon: '◳',
  },
  {
    title: 'Customer portal',
    body: 'Dashboard, profiles, order history, invoices, saved carts, reorder center, shipment tracking, messaging, and documents.',
    icon: '◉',
  },
  {
    title: 'Private company stores',
    body: 'Dedicated stores for schools, hospitals, hotels, restaurants, government, and enterprise customers with contract pricing.',
    icon: '◰',
  },
  {
    title: 'Smart shopping',
    body: 'AI search, advanced filters, embroidery options, logo uploads, size guides, bulk ordering, quick order, quote requests.',
    icon: '◈',
  },
  {
    title: 'Approval workflow',
    body: 'Configurable approval chains with full audit history. Per-department budgets and spending limits.',
    icon: '◊',
  },
  {
    title: 'Multi-channel communications',
    body: 'Email, SMS, push notifications, shipment updates, reminders, and secure messaging — built in.',
    icon: '◐',
  },
];

const INDUSTRIES = [
  { slug: 'schools', name: 'Schools & Universities', emoji: '◳' },
  { slug: 'hospitals', name: 'Hospitals & Medical', emoji: '✚' },
  { slug: 'hotels', name: 'Hotels & Hospitality', emoji: '◉' },
  { slug: 'government', name: 'Government & Public Sector', emoji: '⚖' },
  { slug: 'restaurants', name: 'Restaurants & Food Service', emoji: '◰' },
];

const STATS = [
  { value: '1.2M+', label: 'Items in catalog' },
  { value: '8,500+', label: 'Organizations served' },
  { value: '99.97%', label: 'Order accuracy' },
  { value: '24h', label: 'Quote turnaround' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-midnight-950">
      {/* Top bar */}
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink-500/15 px-3 py-1 font-semibold text-ink-300">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-pulse" />
            OSUEP · Enterprise Platform
          </span>
          <span className="text-chrome-300">One Stop Uniforms · Confidential</span>
        </div>
      </div>

      {/* Nav */}
      <header className="border-b border-chrome-700/40">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-purple shadow-glow-purple">
              <span className="font-display text-lg font-bold text-gold-400">O</span>
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold text-white">One Stop Uniforms</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-chrome-300">Enterprise Platform</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-300">
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#industries" className="hover:text-white transition-colors">Industries</a>
            <Link href="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost">Sign in</Link>
            <Link href="/register" className="btn btn-primary">Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-chrome-700/40">
        <div className="absolute inset-0 bg-gradient-luxe" aria-hidden="true" />
        <div className="absolute inset-0 opacity-40" aria-hidden="true" style={{
          backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(167,139,250,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(245,183,0,0.10) 0%, transparent 50%)'
        }} />
        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-ink-400/30 bg-ink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-200 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-400" />
              The OSUEP Master Specification — 8 volumes approved
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight chrome-text text-balance">
              Enterprise procurement,<br />
              <span className="gold-text">refined.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-chrome-200 text-balance">
              The leading B2B procurement platform for uniforms and branded apparel.
              Built for schools, hospitals, hotels, government, and enterprise — with
              the security and scale your organization demands.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/register" className="btn btn-gold px-7 py-3 text-base">
                Start your organization
              </Link>
              <Link href="/catalog" className="btn btn-ghost px-7 py-3 text-base">
                Browse the catalog
              </Link>
              <Link href="/contact" className="btn btn-ghost px-7 py-3 text-base">
                Talk to sales
              </Link>
            </div>
            <p className="mt-4 text-xs text-chrome-400 font-mono">
              Free to start · No credit card required · Production-grade from day one
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-chrome-700/40 bg-midnight-900/50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gold-300 tabular-nums">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-chrome-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="platform" className="border-b border-chrome-700/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Platform</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-white text-balance">
              Everything an enterprise procurement team needs.
            </h2>
            <p className="mt-3 text-lg text-chrome-200 text-balance">
              From the first product browse to the final invoice, OSUEP handles the full lifecycle — with the controls your finance and IT teams require.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-chrome-700/40 bg-midnight-900 p-6 hover:border-gold-500/40 transition">
                <div className="text-3xl text-gold-400">{f.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-chrome-200">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="border-b border-chrome-700/40 bg-midnight-900/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Built for your industry</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-bold text-white text-balance">
              Tailored workflows for every vertical.
            </h2>
            <p className="mt-3 text-lg text-chrome-200 text-balance">
              We don't ship a generic B2B template. Each industry gets the terminology, compliance, and approval chains that match how they actually work.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.slug}
                href={`/for/${ind.slug}`}
                className="group rounded-2xl border border-chrome-700/40 bg-midnight-900 p-6 hover:border-gold-500/60 transition"
              >
                <div className="text-3xl text-purple-300 group-hover:text-gold-300 transition">{ind.emoji}</div>
                <h3 className="mt-3 text-base font-semibold text-white">{ind.name}</h3>
                <p className="mt-2 text-xs text-gold-300 group-hover:text-gold-200">Learn more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="security" className="border-b border-chrome-700/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Engineering</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-white">
                Built for the next 25 years.
              </h2>
              <p className="mt-3 text-chrome-200">
                Modular, API-first, auditable. Designed to scale to millions of products, customers, suppliers, and decorators — without redesign.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-chrome-200">
                {[
                  ['Modular architecture', 'API-first design with clear separation of frontend, backend, auth, integrations, and background services.'],
                  ['Normalize data models', 'Versioning, auditing, soft deletes, encrypted sensitive fields, scalable indexing.'],
                  ['REST + GraphQL-ready', 'Versioned endpoints, auth, rate limiting, logging, validation, full OpenAPI documentation.'],
                  ['Security by default', 'HTTPS, encrypted secrets, MFA, RBAC, audit logging, dependency scanning, secure SDLC.'],
                  ['CI/CD + monitoring', 'GitHub workflows, automated tests, environment separation, rollback, infrastructure monitoring.'],
                ].map(([title, body]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                    <span><strong className="text-white">{title}.</strong> {body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-6 font-mono text-xs">
              <p className="text-gold-400 uppercase tracking-wider text-[10px] mb-3">// Verified live</p>
              <pre className="text-chrome-200 whitespace-pre-wrap break-all">
{`GET /healthz         → 200 {status:"ok"}
GET /readyz          → 200 {status:"ready"}
GET /api/catalog/categories   → 200
GET /api/catalog/products     → 200
GET /api/catalog/products/OSU-1001  → 200

POST /api/auth/register  → 201
POST /api/auth/login     → 200
GET  /api/auth/me        → 200 (with session)

POST /api/cart/items     → 201
POST /api/orders/checkout → 201
GET  /api/orders         → 200

GET  /api/invoices       → 200
GET  /api/artworks       → 200
GET  /api/messages       → 200
GET  /api/notifications  → 200`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-chrome-700/40">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
            Ready when you are.
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-chrome-200">
            Spin up a free organization account in under five minutes. Or talk to our team about volume pricing and custom integrations.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="btn btn-gold px-7 py-3 text-base">
              Start your organization
            </Link>
            <Link href="/contact" className="btn btn-ghost px-7 py-3 text-base">
              Talk to sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-chrome-700/40 bg-midnight-900/60">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-purple">
                  <span className="font-display text-sm font-bold text-gold-400">O</span>
                </span>
                <span className="font-display text-base font-semibold text-white">One Stop Uniforms</span>
              </div>
              <p className="mt-3 text-xs text-chrome-300 max-w-sm">
                The leading B2B procurement platform for branded apparel and uniforms.
                Confidential — internal use only.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-400">Product</p>
              <ul className="mt-2 space-y-1 text-chrome-200">
                <li><Link href="/catalog" className="hover:text-white">Catalog</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-400">Industries</p>
              <ul className="mt-2 space-y-1 text-chrome-200">
                <li><Link href="/for/schools" className="hover:text-white">Schools</Link></li>
                <li><Link href="/for/hospitals" className="hover:text-white">Hospitals</Link></li>
                <li><Link href="/for/hotels" className="hover:text-white">Hotels</Link></li>
                <li><Link href="/for/government" className="hover:text-white">Government</Link></li>
                <li><Link href="/for/restaurants" className="hover:text-white">Restaurants</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-400">Account</p>
              <ul className="mt-2 space-y-1 text-chrome-200">
                <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
                <li><Link href="/register" className="hover:text-white">Get started</Link></li>
                <li><Link href="/portal" className="hover:text-white">Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-chrome-700/30 flex items-center justify-between text-xs text-chrome-400">
            <p>© {new Date().getFullYear()} One Stop Uniforms · OSUEP Enterprise Platform</p>
            <p className="font-mono uppercase tracking-wider">Confidential — Internal Use Only</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
