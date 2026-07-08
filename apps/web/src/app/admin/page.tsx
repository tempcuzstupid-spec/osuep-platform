import Link from 'next/link';

const ADMIN_SECTIONS = [
  { href: '/admin/orders', label: 'Orders', desc: 'Process and dispatch all orders' },
  { href: '/admin/products', label: 'Products', desc: 'Catalog management' },
  { href: '/admin/suppliers', label: 'Suppliers', desc: 'Supplier feed imports' },
  { href: '/admin/customers', label: 'Customers', desc: 'Organization accounts' },
  { href: '/admin/reports', label: 'Reports', desc: 'Operational analytics' },
  { href: '/admin/audit', label: 'Audit log', desc: 'Immutable activity history' },
  { href: '/admin/team', label: 'Team', desc: 'OSUEP staff accounts' },
];

export const metadata = {
  title: 'OSUEP Admin',
  description: 'Internal platform administration',
};

export default function AdminLandingPage() {
  return (
    <main className="min-h-screen bg-midnight-950">
      <div className="border-b border-chrome-700/40 bg-midnight-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-xs">
          <Link href="/portal" className="text-gold-300 hover:text-gold-200">← Customer portal</Link>
          <span className="font-mono text-chrome-200">OSUEP Admin</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-300">Internal</p>
          <h1 className="mt-1 text-4xl font-bold text-white">OSUEP administration</h1>
          <p className="mt-2 text-chrome-200">
            Platform-level access. All actions are logged to the immutable audit trail.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-2xl border border-chrome-700/40 bg-midnight-900 p-6 hover:border-rose-500/40 transition"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-rose-200">{s.label}</h3>
              <p className="mt-2 text-sm text-chrome-300">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
