# GMAO (CMMS) – Bolt + Supabase Starter

Ce projet Next.js (App Router) se connecte à Supabase pour gérer :
- DIs ➜ validation ➜ OTs (correctif & PMP)
- Imputation PDRs (stock OUT + coût moyen)
- PMP (génération auto via Edge Function `pm_scheduler`)
- Dashboard KPIs (vues SQL)

## ⚡ Démarrage rapide sur Bolt
1) Importer ce dossier (ou glisser le ZIP dans Bolt).
2) Copier `.env.local.example` en `.env.local` et renseigner:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3) Lancer `npm i` puis `npm run dev`.

## 🗄️ Bootstrap base Supabase
Dans Supabase > SQL Editor, exécuter le contenu de `supabase/sql/bootstrap.sql`.

## ⏱️ Edge Function PMP
- Déployer `supabase/functions/pm_scheduler/index.ts` comme Edge Function.
- Ajouter une Cron quotidienne (06:00 Africa/Casablanca).

## Pages incluses
- `/` : accueil liens
- `/di/new` : création DI
- `/di/[id]/approve` : validation DI & création OT
- `/wo/[id]/materials` : imputation PDRs sur OT
- `/pmp` : (placeholder) forçage manuel PMP
- `/dashboard` : KPIs (utilise des vues SQL)

> NB: Le design est minimal pour se concentrer sur le flux fonctionnel. Tu peux ajouter Tailwind/shadcn ensuite.
