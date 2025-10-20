'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const colorFor = (s:string)=>({
  'PLANNED':'#fffbe6',
  'IN_PROGRESS':'#e6f0ff',
  'COMPLETED':'#e6ffed',
  'CANCELLED':'#ffe6e6'
}[s]||'#f7f7f7');

export default function BacklogWO(){
  const [rows,setRows]=useState<any[]>([]);
  useEffect(()=>{ supabase.from('work_orders').select('*').then(({data})=> setRows(data||[])); },[]);
  return (
    <div style={{maxWidth:1000, margin:'0 auto'}}>
      <h1 style={{fontSize:24, fontWeight:700, marginBottom:10}}>Backlog OT</h1>
      <div style={{display:'grid', gap:8}}>
        {rows.map(wo=>(
          <div key={wo.id} style={{background: colorFor(wo.status), padding:12, borderRadius:10, border:'1px solid #eee'}}>
            <div><b>{wo.code}</b> — Asset {wo.asset_id}</div>
            <div>Type: {wo.type} · Statut: <b>{wo.status}</b> · Durée: {wo.duration_h||0} h · Arrêt: {wo.stop_required? 'Oui':'Non'}</div>
            <div style={{display:'flex', gap:8}}>
              <a href={`/wo/${wo.id}/edit`} style={{padding:'6px 10px', borderRadius:8, background:'#111', color:'#fff'}}>Détail intervention</a>
              <a href={`/wo/${wo.id}/materials`} style={{padding:'6px 10px', borderRadius:8, background:'#555', color:'#fff'}}>Imputer PDR</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
