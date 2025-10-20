'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function WOEdit({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [wo, setWo] = useState<any | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('work_orders').eq('id', id).single().then(({ data, error }) => {
      if (error) setMsg(`Erreur chargement OT: ${error.message}`);
      else setWo(data);
    });
  }, [id]);

  const save = async () => {
    if (!wo) return;
    const { error } = await supabase.from('work_orders').update({
      id,
      type: wo.type,
      duration_h: Number(wo.duration_h || 0),
      downtime_min: Number(wo.downtime_min || 0),
      stop_required: !!wo.stop_required,
      remarks: wo.remarks || '',
      status: wo.status,
    });
    setMsg(error ? `Erreur: ${error.message}` : '✅ OT mis à jour');
  };

  const close = async () => {
    const { error } = await supabase.from('work_orders').update({ id, status: 'COMPLETED' });
    setMsg(error ? `Erreur: ${error.message}` : '✅ OT clôturé');
  };

  if (!wo) return <div className="p-6">Chargement… {msg && <span>{msg}</span>}</div>;

  return (
    <div className="p-6 space-y-3" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 className="text-xl font-semibold">OT {wo.code}</h1>

      <label>Type</label>
      <select className="border p-2" value={wo.type} onChange={(e) => setWo({ ...wo, type: e.target.value })}>
        <option value="CORRECTIVE">Correctif</option>
        <option value="PREVENTIVE">Préventif</option>
        <option value="INSPECTION">Inspection</option>
      </select>

      <label>Durée (heures)</label>
      <input
        type="number"
        className="border p-2"
        value={wo.duration_h || 0}
        onChange={(e) => setWo({ ...wo, duration_h: Number(e.target.value) })}
      />

      <label>Arrêt (minutes)</label>
      <input
        type="number"
        className="border p-2"
        value={wo.downtime_min || 0}
        onChange={(e) => setWo({ ...wo, downtime_min: Number(e.target.value) })}
      />

      <label>Intervention avec arrêt ?</label>
      <input
        type="checkbox"
        checked={!!wo.stop_required}
        onChange={(e) => setWo({ ...wo, stop_required: e.target.checked })}
      />

      <label>Commentaire</label>
      <textarea
        className="border p-2"
        value={wo.remarks || ''}
        onChange={(e) => setWo({ ...wo, remarks: e.target.value })}
      />

      <label>Statut</label>
      <select className="border p-2" value={wo.status} onChange={(e) => setWo({ ...wo, status: e.target.value })}>
        <option value="PLANNED">Planifié</option>
        <option value="IN_PROGRESS">En cours</option>
        <option value="ON_HOLD">En attente</option>
        <option value="COMPLETED">Clôturé</option>
        <option value="CANCELLED">Annulé</option>
      </select>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={save} className="px-4 py-2 rounded" style={{ background: '#111', color: '#fff' }}>
          💾 Enregistrer
        </button>
        <button onClick={close} className="px-4 py-2 rounded" style={{ background: '#006400', color: '#fff' }}>
          ✅ Clôturer
        </button>
        <a href={`/wo/${id}/materials`} className="px-4 py-2 rounded" style={{ background: '#555', color: '#fff' }}>
          PDR
        </a>
      </div>

      {msg && <p>{msg}</p>}
    </div>
  );
}
