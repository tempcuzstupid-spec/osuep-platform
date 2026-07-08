import Link from 'next/link';

const TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    blurb: 'For small teams testing the platform',
    features: [
      'Up to 5 members',
      'Up to $5,000/month in orders',
      'Public catalog access',
      'Email support',
      'Basic approval workflow',
    ],
    cta: 'Start free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 'Custom',
    period: 'per org',
    blurb: 'For growing procurement teams',
    features: [
      'Unlimited members',
      'Unlimited orders',
      'Private company stores',
      'Contract pricing engine',
      'Multi-location support',
      'Approval chains',
      'Priority support',
      'Artwork library',
    ],
    cta: 'Talk to sales',
    href: '/contact',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored',
    blurb: 'For multi-site, multi-org operations',
    features: [
      'Everything in Growth',
      'Dedicated account manager',
      'SAML SSO + SCIM',
      'Custom integrations',
      'On-site training',
      '99.9% SLA',
      'On-prem options',
      'Volume discounts',
    ],
    cta: 'Request quote',
    href: '/contact',
    highlighted: false,
  },
];

const FAQS = [
  {
    q: 'Are there transaction fees?',
    a: 'No platform fees on top of product pricing. You pay the supplier cost plus your agreed margin. Custom embroidery setup fees apply to first-time artwork only.',
  },
  {
    q: 'What about volume discounts?',
    a: 'Yes. Larger orders qualify for tiered pricing across all products. The platform auto-applies the best tier at checkout.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No setup fees on Growth or Enterprise plans. Custom integrations or on-prem deployments may have one-time fees quoted per project.',
  },
  {
    q: 'Do you offer Net 30 invoicing?',
    a: 'Yes — for verified organizations, Net 30 is standard. Larger accounts can request Net 60 with approved credit.',
  },
];

export const metadata = {
  title: 'Pricing — One Stop Uniforms',
  description: 'Simple pricing for every size of organization.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/" className="text-gold-300 hover:text-gold-200">← OSUEP</Link>
          <span className="font-mono text-chrome-200">Pricing</span>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-chrome-700/40">
        <div className="absolute inset-0 bg-gradient-luxe" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400">Pricing</p>
          <h1 className="mt-2 text-5xl font-bold text-white">Built for every size of operation</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-chrome-200">
            From a 5-person school to a 50,000-employee hospital system. Pay for what you use.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-6 ${
                t.highlighted
                  ? 'border-gold-500/60 bg-gradient-to-br from-midnight-900 to-midnight-950 shadow-glow-gold'
                  : 'border-chrome-700/40 bg-midnight-900'
              }`}
            >
              {t.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-gold-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-midnight-950">
                  Most popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-white">{t.name}</h3>
              <p className="mt-1 text-sm text-chrome-300">{t.blurb}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gold-300">{t.price}</span>
                {t.price !== 'Free' && <span className="ml-1 text-sm text-chrome-300">{t.period}</span>}
              </div>
              <ul className="mt-6 space-y-2 text-sm text-chrome-200">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-gold-400">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`mt-6 block rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                  t.highlighted
                    ? 'bg-gradient-purple text-white shadow-glow-purple'
                    : 'border border-chrome-700/40 bg-midnight-800 text-white hover:border-gold-500/60'
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-chrome-700/40 bg-midnight-900/40">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-400 text-center">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold text-white text-center">Pricing questions</h2>
          <div className="mt-10 space-y-4">
            {FAQS.map((f, i) => (
              <details key={i} className="rounded-2xl border border-chrome-700/40 bg-midnight-900 p-5 group">
                <summary className="cursor-pointer text-sm font-semibold text-white list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-gold-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-chrome-200">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
