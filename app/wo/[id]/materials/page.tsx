'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function MaterialsPage({ params }: { params: { id: string } }) {
  const otId = Number(params.id);
  const [materials, setMaterials] = useState<{ ref: string; name: string; qty: number; price: number }[]>([]);
  const [ref, setRef] = useState('');
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [msg, setMsg] = useState('');

  const addMaterial = () => {
    if (!ref.trim() || !name.trim() || qty <= 0) {
      setMsg('⚠️ Veuillez remplir tous les champs.');
      return;
    }
    setMaterials([...materials, { ref, name, qty, price }]);
    setRef('');
    setName('');
    setQty(1);
    setPrice(0);
    setMsg('');
  };

  const saveToDB = async () => {
    const total = materials.reduce((acc, m) => acc + m.qty * m.price, 0);
    await supabase.from('work_order_materials').insert(
      materials.map(m => ({
        work_order_id: otId,
        ref: m.ref,
        name: m.name,
        qty: m.qty,
        price: m.price,
        amount: m.qty * m.price,
      }))
    );
    setMsg(`✅ ${materials.length} PDR imputées — total: ${total.toFixed(2)} MAD`);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gap: 12 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Imputation PDR — OT #{otId}</h1>

      <label>Référence</label>
      <input value={ref} onChange={e => setRef(e.target.value)} className="border p-2" placeholder="ex: 6204ZZ" />

      <label>Désignation</label>
      <input value={name} onChange={e => setName(e.target.value)} className="border p-2" placeholder="ex: Roulement SKF" />

      <label>Quantité</label>
      <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} className="border p-2" />

      <label>Prix unitaire (MAD)</label>
      <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="border p-2" />

      <button onClick={addMaterial} style={{ background: '#111', color: '#fff', borderRadius: 8, padding: '8px 12px' }}>
        ➕ Ajouter PDR
      </button>

      {materials.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th>Réf</th>
              <th>Désignation</th>
              <th>Qté</th>
              <th>Prix</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m, i) => (
              <tr key={i}>
                <td>{m.ref}</td>
                <td>{m.name}</td>
                <td>{m.qty}</td>
                <td>{m.price.toFixed(2)}</td>
                <td>{(m.qty * m.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {materials.length > 0 && (
        <button onClick={saveToDB} style={{ background: '#006400', color: '#fff', borderRadius: 8, padding: '8px 12px' }}>
          💾 Enregistrer les imputations
        </button>
      )}

      {msg && <p>{msg}</p>}
    </div>
  );
}
