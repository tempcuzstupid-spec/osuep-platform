import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'One Stop Uniforms — Enterprise Platform',
  description: 'B2B procurement for uniforms and branded apparel. Enterprise-grade, multi-tenant, audit-ready.',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'One Stop Uniforms — Enterprise Platform',
    description: 'Enterprise B2B procurement for uniforms and branded apparel.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c3aed'/%3E%3Cstop offset='1' stop-color='%234c1d95'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='12' fill='url(%23g)'/%3E%3Ctext x='50%25' y='58%25' text-anchor='middle' font-family='Georgia,serif' font-size='34' font-weight='700' fill='%23f5b700'%3EO%3C/text%3E%3C/svg%3E"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
