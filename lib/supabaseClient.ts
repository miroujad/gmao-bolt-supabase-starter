// lib/supabaseClient.ts — DEMO MODE complet (aucun backend requis)
type Row = Record<string, any>;

let seq = { di: 1, ot: 1, mi: 1 };

const demoData = {
  work_requests: [
    { id: 1, code: 'DI-2025-000001', asset_id: 1, title: 'Fuite hydraulique', description: 'Vérifier flexible', priority: 3, status: 'OPEN' },
  ],
  work_orders: [
    { id: 1, code: 'OT-2025-000001', source_request_id: null, asset_id: 1, type: 'PREVENTIVE', status: 'PLANNED', created_at: new Date().toISOString() },
  ],
  inventory_items: [
    { id: 1, sku: 'SKF-6205', name: 'Roulement 6205', stock_qty: 25, avg_cost: 120 },
    { id: 2, sku: 'V-BELT-SPB', name: 'Courroie SPB', stock_qty: 50, avg_cost: 35 },
  ],
  material_issues: [] as Row[],
};

function ok(data: any) { return Promise.resolve({ data, error: null }); }
function ko(msg: string)  { return Promise.resolve({ data: null, error: { message: msg } }); }

function genCode(prefix: 'DI'|'OT', n: number) {
  return `${prefix}-${new Date().getFullYear()}-${String(n).padStart(6,'0')}`;
}

export const supabase = {
  auth: { getUser: async () => ({ data: { user: { id: 'demo-user' } }, error: null }) },
  from: (table: keyof typeof demoData) => ({
    // SELECT
    select: async (_cols?: string) => {
      if (table === 'material_issues') return ok([...demoData.material_issues]);
      // compute simple views here if needed later
      return ok(JSON.parse(JSON.stringify(demoData[table])));
    },
    // WHERE eq(...).single()
    eq: (field: string, val: any) => ({
      single: async () => {
        const row = (demoData[table] as Row[]).find(r => r[field] === val) || null;
        return ok(row);
      }
    }),
    // INSERT
    insert: async (row: Row | Row[]) => {
      const arr = Array.isArray(row) ? row : [row];
      const tgt = demoData[table] as Row[];
      for (const r of arr) {
        if (!r.id) r.id = (tgt.length ? Math.max(...tgt.map(x => x.id||0)) + 1 : 1);
        if (table === 'work_requests' && !r.code) r.code = genCode('DI', ++seq.di);
        if (table === 'work_orders'   && !r.code) r.code = genCode('OT', ++seq.ot);
        tgt.push(r);
        // side effects demo
        if (table === 'material_issues') {
          const item = demoData.inventory_items.find(i=>i.id===r.item_id);
          if (item) item.stock_qty = Number(item.stock_qty) - Number(r.qty || 0);
        }
      }
      return ok(arr);
    },
    // UPDATE (very simple by id)
    update: async (patch: Row) => {
      const tgt = demoData[table] as Row[];
      if (!patch.id) return ko('update in demo requires {id}');
      const i = tgt.findIndex(r=>r.id===patch.id);
      if (i<0) return ko('not found');
      tgt[i] = { ...tgt[i], ...patch };
      return ok(tgt[i]);
    }
  }),
};

// Petites “vues” pour le dashboard (calculées à la volée)
export async function getKpiWO() {
  const total = demoData.work_orders.length;
  const completed = demoData.work_orders.filter(w=>w.status==='COMPLETED').length;
  return [{ mois: new Date().toISOString(), ot_total: total, ot_completed: completed, completion_rate: total? Math.round(1000*completed/total)/10 : 0 }];
}
export async function getKpiPM() {
  const pm = demoData.work_orders.filter(w=>w.type==='PREVENTIVE');
  const done = pm.filter(w=>w.status==='COMPLETED');
  return [{ mois: new Date().toISOString(), pm_due: pm.length, pm_done: done.length, pm_compliance: pm.length? Math.round(1000*done.length/pm.length)/10 : 0 }];
}
export async function getCostsByAsset() {
  // faux calcul
  return [{ asset_code: 'MN-PNVH-1994', cost: 12500 }, { asset_code: 'P-44965', cost: 8200 }];
}
