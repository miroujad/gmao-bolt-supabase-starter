'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NewDI() {
  const [assetId, setAssetId] = useState<number>();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState(3);
  const [msg, setMsg] = useState('');

  const submit = async () => {
    if (!assetId || !title.trim()) {
      setMsg('⚠️ Asset ID et Titre sont obligatoires.');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('work_requests').insert({
      requester: user?.id,
      asset_id: assetId,
      title,
      description: desc,
      priority,
      status: 'OPEN',
    });
    setMsg(error ? `Erreur: ${error.message}` : '✅ DI créée');
    if (!error) {
      // reset simple
      setTitle(''); setDesc(''); setPriority(3);
    }
  };

  return (
    <div style={{maxWidth: 540, margin: '0 auto', display: 'grid', gap: 12}}>
      <h1 style={{fontSize: 24, fontWeight: 700}}>Nouvelle DI</h1>

      <label>Asset ID</label>
      <input
        className="border p-2"
        placeholder="ex: 1"
        onChange={e => setAssetId(Number(e.target.value))}
      />

      <label>Titre</label>
      <input
        className="border p-2"
        placeholder="ex: Fuite hydraulique"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <label>Description</label>
      <textarea
        className="border p-2"
        placeholder="Détail du problème"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />

      <label>Priorité (1=Urgent…5=Faible)</label>
      <input
        type="number" min={1} max={5}
        className="border p-2"
        value={priority}
        onChange={e => setPriority(Number(e.target.value))}
      />

      <button onClick={submit} style={{padding:'8px 14px', borderRadius:8, background:'#111', color:'#fff'}}>
        Créer la DI
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
