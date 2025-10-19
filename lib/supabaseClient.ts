// lib/supabaseClient.ts — DEMO MODE (aucun backend requis)
type Row = Record<string, any>;
const demoData = { ping: [{ ok: true }] };
function ok(data: any) { return Promise.resolve({ data, error: null }); }
export const supabase = {
  auth: { getUser: async () => ({ data: { user: { id: 'demo-user' } }, error: null }) },
  from: (_table: keyof typeof demoData) => ({ select: async () => ok([{ ok: true }]) }),
};
