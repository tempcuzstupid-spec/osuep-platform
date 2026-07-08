import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
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
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
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
              <Link href="#platform" className="btn btn-ghost px-7 py-3 text-base">
                Explore the platform
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl border border-chrome-700/60 bg-chrome-700/40 overflow-hidden">
              {[
                { k: 'Volumes Approved', v: '8 of 8' },
                { k: 'Sectors Served', v: '13+' },
                { k: 'Decoration Methods', v: '9' },
                { k: 'Uptime Target', v: '99.9%' },
              ].map((s) => (
                <div key={s.k} className="bg-midnight-900/60 p-5">
                  <div className="text-2xl font-semibold chrome-text">{s.v}</div>
                  <div className="text-xs uppercase tracking-wider text-chrome-400 mt-1">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="border-b border-chrome-700/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-300 mb-3">The Platform</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold chrome-text max-w-3xl text-balance">
            Eight volumes. One operating system for enterprise uniform procurement.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { t: 'Foundation & Governance', d: 'The constitutional layer — values, rules, and the AI Development Charter that every contributor inherits.' },
              { t: 'Customer Experience', d: 'Multi-tenant org accounts, private company stores, approval workflows, communications.' },
              { t: 'Administration & Operations', d: 'Executive dashboards, customer/product admin, order management, reporting, security & audit.' },
              { t: 'Product & Supplier', d: 'Canonical catalog, supplier abstraction, pricing engine, inventory, and fulfillment orchestration.' },
              { t: 'Embroidery & Production', d: 'Decoration services, artwork library, production workflow, QA, and decorator dashboard.' },
              { t: 'Technical Architecture', d: 'Modular, API-first, secure by default, observable, and built for decades of growth.' },
              { t: 'Marketing, AI & Growth', d: 'Digital marketing, AI-powered discovery, CRM, analytics, and future-channel strategy.' },
              { t: 'AI Master Directive', d: 'The governing instruction set — build software worthy of enterprise customers.' },
            ].map((c, i) => (
              <article key={c.t} className="card card-hover group">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-display text-sm font-semibold text-ink-300">Vol. {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i]}</span>
                  <span className="chip">Approved</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-white group-hover:text-ink-200 transition-colors">{c.t}</h3>
                <p className="mt-2 text-sm text-chrome-300">{c.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="border-b border-chrome-700/40 py-24 bg-midnight-800/30">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-300 mb-3">Industries Served</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold chrome-text max-w-3xl text-balance">
            Built for the organizations that move the world forward.
          </h2>
          <div className="mt-10 flex flex-wrap gap-2">
            {['Schools & Universities', 'Hospitals', 'Medical Practices', 'Hotels & Restaurants', 'Government Agencies', 'Construction Firms', 'Manufacturers', 'Security Companies', 'Churches', 'Sports Organizations', 'Municipalities', 'Fortune 500', 'Small Businesses'].map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="border-b border-chrome-700/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-300 mb-3">Security by Default</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold chrome-text max-w-3xl text-balance">
            Three rules, no exceptions.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {[
              { n: '01', t: 'Customers buy from One Stop Uniforms.', d: 'Supplier identities remain confidential. The brand customers trust is the only brand they see.' },
              { n: '02', t: 'Every public product has an internal SKU, ID, URL, pricing, and metadata.', d: 'Vendor identifiers remain internal. Our catalog is the canonical source of truth.' },
              { n: '03', t: 'The customer database is one of our most valuable assets.', d: 'Every feature strengthens customer retention. Long-term relationships outrank short-term wins.' },
            ].map((r) => (
              <div key={r.n} className="card relative overflow-hidden">
                <span className="absolute -top-3 -left-3 font-display text-6xl font-bold text-ink-500/20">{r.n}</span>
                <h3 className="font-display text-lg font-semibold text-white mt-2">{r.t}</h3>
                <p className="mt-2 text-sm text-chrome-300">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="card p-12 text-center bg-gradient-luxe border-ink-500/30">
            <h2 className="font-display text-3xl md:text-5xl font-semibold chrome-text">Ready to begin?</h2>
            <p className="mt-4 text-chrome-200 max-w-xl mx-auto">
              Create your organization in under a minute. Add your team, your locations,
              and your departments. Then bring your suppliers in through our abstraction layer.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/register" className="btn btn-gold px-7 py-3 text-base">Create your organization</Link>
              <Link href="/login" className="btn btn-ghost px-7 py-3 text-base">Sign in</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-chrome-700/40 py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-chrome-300">
          <p>© {new Date().getFullYear()} One Stop Uniforms. All rights reserved.</p>
          <p className="text-xs uppercase tracking-wider">OSUEP · Confidential — Internal Use Only</p>
        </div>
      </footer>
    </main>
  );
}
