'use client';
import { useEffect, useState } from 'react';

export default function ApproveChooser(){
  const [list, setList] = useState<any[]>([]);
  const [sel, setSel] = useState<number>();

  useEffect(()=> {
    fetch('/di/backlog') // juste pour attendre que dev server serve; on ne lit pas la réponse
  }, []);
  useEffect(()=> {
    // on va chercher via supabase mock
    import('@/lib/supabaseClient').then(({supabase})=>{
      supabase.from('work_requests').select('*').then(({data})=>{
        setList((data||[]).filter(d=> d.status==='OPEN' || d.status==='APPROVED'));
      });
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Choisir une DI à valider</h1>
      <select className="border p-2" value={sel||''} onChange={e=>setSel(Number(e.target.value))}>
        <option value="">— choisir une DI —</option>
        {list.map(d=> <option key={d.id} value={d.id}>{d.code} — {d.title} ({d.status})</option>)}
      </select>
      {sel && <a className="ml-3 px-3 py-2 rounded" style={{background:'#111', color:'#fff'}} href={`/di/${sel}/approve`}>Continuer</a>}
    </div>
  );
}
