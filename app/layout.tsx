// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GMAO – Demo',
  description: 'Starter CMMS avec Next.js (mode démo)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui', background: '#fafafa', color: '#111', margin: 0 }}>
        <header
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #eee',
            background: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <nav style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <b>GMAO – Demo</b>
            <a href="/">Accueil</a>
            <a href="/di/new">Nouvelle DI</a>
            <a href="/di/1/approve">Valider DI #1</a>
            <a href="/wo/1/materials">PDR OT #1</a>
            <a href="/pmp">PMP</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </header>

        <main style={{ maxWidth: 1000, margin: '20px auto', padding: '0 16px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
<a href="/di/backlog">Backlog DI</a>
