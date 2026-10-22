// WS-NPC · Private Körper der Bewohner (WSB K11, WS0-Abnahme 21.10.: Lorekeeper k11b, Farmer B k11), optional aus src/private (gitignored, Verweis auf
// ~/kfb-ws1/private-assets, flacher Klon von assets/private). Nichts davon gehört ins Repo (KayKit-Kauf). Fehlen die Dateien, bleibt die öffentliche
// Fassung (Original aus kayfabizarro main mit Georgs Augenprofil) – kein Fehler, nur Status „public“.
// Weg wie GothGirl (V-391 Regel 7): gleicher Darsteller (Rezept, Augenprofil aus Georgs Batch, Punktlagen gleich dem Original), Körper = K11-Datei mit
// entfernten Pillenaugen → originals.method 'baked' (keine Laufzeit-Bereinigung). Die Clips der K11-Datei (Werkzeug-, Lese-Clips) kommen dazu.
// Requisite je Clip mit EINER festen Halterung im handslot.r-Raum (T(position) · R(rotation), V-581/V-574 + WS0 Nachtrag 4), nie je Bild nachgedreht.
const FILES = import.meta.glob('../private/50_BLENDER/K11/{_privat_kauf_asset,props}/*.glb', { eager: true, query: '?url', import: 'default' })
const URL = Object.fromEntries(Object.entries(FILES).map(([k, v]) => [k.split('/').pop(), v]))

// Halterungen aus K11/RETURN.md §2/§3 bzw. K11/data/farmer_harke.npc.json (activities.*.mount)
export const PRIVATE_BODIES = Object.freeze({
  'farmer-b': { body: 'KFB_Farmer_harke.k11.glb', source: 'WSB K11 §3 (farmer_harke.npc.json)',
    prop: { id: 'pitchfork', file: 'KFB_Pitchfork.k11.glb', slot: 'handslot.r',
      mounts: { Digging: { rotation: [0, 0, 1, 0], position: [-0.0212, 0, -0.0212] }, Working_C: { rotation: [0.99619, 0, 0, 0.08716], position: [0, -0.075, 0] } } } },
  lorekeeper: { body: 'KFB_Lorekeeper.k11b.glb', source: 'WSB K11 §2 (lorekeeper.figure.json)',
    prop: { id: 'book', file: 'KFB_Book_Open.k11.glb', slot: 'handslot.r',
      mounts: { Holding_C: { rotation: [0, 0, 0, 1], position: [0, 0, 0] }, Holding_B: { rotation: [0, 0, 0, 1], position: [0, 0, 0] }, kfb_npc_read_page_turn_a: { rotation: [0, 0, 0, 1], position: [0, 0, 0] } } } },
})

// → { url, clipsUrl, prop: { url, slot, mounts } | null, source } oder null (keine private Datei da)
export function privateBody(castId) {
  const d = PRIVATE_BODIES[castId], url = d && URL[d.body]
  if (!url) return null
  const purl = d.prop && URL[d.prop.file]
  return { url, clipsUrl: url, source: d.source, prop: purl ? { id: d.prop.id, url: purl, slot: d.prop.slot, mounts: d.prop.mounts } : null }
}
// Darsteller-Optionen: öffentliche Fassung, bei vorhandener K11-Datei mit privatem Körper (gebackene Augen-Bereinigung)
export const withPrivateBody = (castId, opts) => { const p = privateBody(castId); return p ? { ...opts, url: p.url, originals: { method: 'baked' }, privateBody: p } : opts }
