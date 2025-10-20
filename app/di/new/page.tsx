'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Site = { id:number; code:string; name:string };
type Unit = { id:number; site_id:number; code:string; name:string };
type Asset = { id:number; site_id:number; unit_id:number; code:string; name:string };

export default function NewDI() {
  const [sites, setSites] = useState<Site[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [siteId, setSiteId] = useState<number>();
  const [unitId, setUnitId] = useState<number>();
  const [assetId, setAssetId] = useState<number>();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState(3);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('sites').select('*').then(({data})=> setSites(data||[]));
    supabase.from('units').select('*').then(({data})=> setUnits(data||[]));
    supabase.from('assets').select('*').then(({data})=> setAssets(data||[]));
  }, []);

  const filteredUnits = units.filter(u => !siteId || u.site_id===siteId);
  const filteredAssets = assets.filter(a =>
    (!siteId || a.site_id===siteId) && (!unitId || a.unit_id===unitId)
  );

  const submit = async () => {
    if (!siteId || !unitId || !assetId || !title.trim()) {
      setMsg('⚠️ Site, Unité, Équipement et Titre sont obligatoires.');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('work_requests').insert({
      requester: user?.id, site_id: siteId, unit_id: unitId, asset_id: assetId,
      title, description: desc, priority, status:'OPEN'
    });
    setMsg(error ? `Erreur: ${error.message}` : '✅ DI créée');
    if (!error) { setTitle(''); setDesc(''); setPriority(3); }
  };

  return (
    <div style={{maxWidth: 720, margin:'0 auto', display:'grid', gap:12}}>
      <h1 style={{fontSize:26, fontWeight:700}}>Nouvelle DI</h1>

      <label>Site</label>
      <select className="border p-2" value={siteId||''} onChange={e=>{setSiteId(Number(e.target.value)); setUnitId(undefined); setAssetId(undefined);}}>
        <option value="">— choisir —</option>
        {sites.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
      </select>

      <label>Unité</label>
      <select className="border p-2" value={unitId||''} onChange={e=>{setUnitId(Number(e.target.value)); setAssetId(undefined);}}>
        <option value="">— choisir —</option>
        {filteredUnits.map(u => <option key={u.id} value={u.id}>{u.code} — {u.name}</option>)}
      </select>

      <label>Équipement</label>
      <select className="border p-2" value={assetId||''} onChange={e=>setAssetId(Number(e.target.value))}>
        <option value="">— choisir —</option>
        {filteredAssets.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
      </select>

      <label>Titre</label>
      <input className="border p-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="ex: Fuite hydraulique"/>

      <label>Description</label>
      <textarea className="border p-2" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Détail du problème"/>

      <label>Priorité (1 urgent…5 faible)</label>
      <input type="number" min={1} max={5} className="border p-2" value={priority} onChange={e=>setPriority(Number(e.target.value))}/>

      <button onClick={submit} style={{padding:'8px 14px', borderRadius:8, background:'#111', color:'#fff'}}>Créer la DI</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
