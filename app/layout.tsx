// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'GMAO Bolt Demo', description: 'Starter CMMS' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{fontFamily:'system-ui', background:'#fafafa', color:'#111', margin:0}}>
        <header style={{padding:'12px 20px', borderBottom:'1px solid #eee', background:'#fff', position:'sticky', top:0}}>
          <b>GMAO – Demo</b>
        </header>
        <main style={{maxWidth:1000, margin:'20px auto', padding:'0 16px'}}>
          {children}
        </main>
      </body>
    </html>
  );
}
