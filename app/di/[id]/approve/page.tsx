'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ApproveDI({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [di, setDi] = useState<any>(null);
  const [msg, setMsg] = useState('');

  // Charger la DI à l'ouverture
  useEffect(() => {
    supabase.from('work_requests').eq('id', id).single()
      .then(({ data, error }) => {
        if (error) setMsg(`Erreur chargement DI: ${error.message}`);
        else setDi(data);
      });
  }, [id]);

  // Valider + créer OT
  const approveAndCreateOT = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    // 1) passer la DI à APPROVED
    await supabase.from('work_requests').update({
      id, status: 'APPROVED', approved_by: user?.id, approved_at: new Date().toISOString()
    });

    // 2) créer l'OT (correctif par défaut ici)
    const { error } = await supabase.from('work_orders').insert({
      source_request_id: id,
      asset_id: di?.asset_id,
      type: 'CORRECTIVE',
      status: 'PLANNED'
    });

    setMsg(error ? `Erreur: ${error.message}` : '✅ OT créé à partir de la DI');
  };

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Valider DI #{id}</h1>

      {!di && !msg && <p>Chargement…</p>}
      {msg && <p>{msg}</p>}

      {di && (
        <>
          <pre className="bg-gray-50 p-3 border" style={{whiteSpace:'pre-wrap'}}>
            {JSON.stringify(di, null, 2)}
          </pre>
          <button
            onClick={approveAndCreateOT}
            className="px-4 py-2 rounded"
            style={{ background: '#111', color: '#fff' }}
          >
            Valider & Créer OT
          </button>
        </>
      )}
    </div>
  );
}
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
