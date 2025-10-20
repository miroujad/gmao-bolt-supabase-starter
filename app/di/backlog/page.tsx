'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const colorFor = (status:string) => ({
  'APPROVED':'#e6ffed',
  'OPEN':'#fffbe6',
  'REJECTED':'#ffe6e6',
  'CONVERTED':'#e6f0ff'
}[status] || '#f7f7f7');

export default function BacklogDI(){
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => { supabase.from('work_requests').select('*').then(({data})=> setRows(data||[])); }, []);

  const filtered = rows.filter(r =>
    !q || (r.code?.toLowerCase().includes(q.toLowerCase()) || r.title?.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div style={{maxWidth:1000, margin:'0 auto'}}>
      <h1 style={{fontSize:24, fontWeight:700, marginBottom:10}}>Backlog DI</h1>
      <input className="border p-2" placeholder="Rechercher par code/titre" value={q} onChange={e=>setQ(e.target.value)} />
      <div style={{marginTop:10, display:'grid', gap:8}}>
        {filtered.map(di => (
          <div key={di.id} style={{background: colorFor(di.status), padding:12, borderRadius:10, border:'1px solid #eee', display:'grid', gap:6}}>
            <div><b>{di.code}</b> — {di.title}</div>
            <div>Site {di.site_id} · Unité {di.unit_id} · Équipement {di.asset_id} · Priorité {di.priority}</div>
            <div>Statut: <b>{di.status}</b></div>
            <div style={{display:'flex', gap:8}}>
              <a href={`/di/${di.id}/approve`} style={{padding:'6px 10px', borderRadius:8, background:'#111', color:'#fff'}}>Valider / Transformer en OT</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
