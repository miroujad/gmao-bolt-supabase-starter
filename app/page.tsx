// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{display:'grid', gap:12}}>
      <h1 style={{fontSize:28, fontWeight:700}}>GMAO – Starter (demo)</h1>
      <p>Prototype CMMS avec Next.js. Supabase pas encore requis.</p>
      <ul style={{lineHeight:1.8}}>
        <li>➡️ <Link href="/">Accueil</Link></li>
      </ul>
      <p style={{fontSize:12, color:'#555'}}>Astuce: on ajoutera DI/OT/PMP après le premier run.</p>
    </div>
  );
}
