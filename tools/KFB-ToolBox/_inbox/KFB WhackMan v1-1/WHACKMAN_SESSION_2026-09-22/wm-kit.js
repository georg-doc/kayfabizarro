/* KFB WhackMan v1 · Kit-Adapter
   Dies ist KEIN zweites Messlabor. Gemessen wird ausschliesslich mit den Funktionen des
   Dungeon-Owners:

     tools/world_atlas/source/lib/kit-lab.js      loadAsset · measure · PACKS
     tools/world_atlas/source/lib/dungeon-grid.js collectTris · planScan · wallFrame ·
                                                  cornerFrame · stairFrame · openingScan
     tools/world_atlas/source/lib/dungeon-light.js measureFlame

   MISSING_DELTA · KIT-BUILDER
   Der Block, der aus diesen Funktionen das \`kit\` {MOD, HUB, WALL_H, WALL_THICK, box, frame}
   zusammensetzt, liegt beim Owner NICHT in einer Bibliothek, sondern inline im Seitenkörper von
   \`KayKit_Dungeon_Generator_S13_2.html\` (Zeilen 220–290). Er ist hier WORTGLEICH übernommen,
   nicht neu erfunden — Inventarliste, Ladebreite, Rahmenwahl, MOD/WALL_H/WALL_THICK/HUB und die
   Öffnungsmessung stehen genau so in S13.2.

   Bitte beim Dungeon-Owner nach \`dungeon-grid.js\` hochziehen (\`export async function buildKit()\`),
   dann kann dieser Adapter ersatzlos entfallen. Solange er existiert, ist er eine Kopie mit
   Quellenangabe und keine zweite Wahrheit. */

import { PACKS, loadAsset, measure } from './tools/world_atlas/source/lib/kit-lab.js';
import { collectTris, planScan, wallFrame, cornerFrame, stairFrame, openingScan }
  from './tools/world_atlas/source/lib/dungeon-grid.js';
import { measureFlame } from './tools/world_atlas/source/lib/dungeon-light.js';

/* Tiny Treats hat im Pack-Register des Dungeon-Owners keinen Eintrag. Statt einen zweiten Lader
   zu bauen, wird SEIN Register erweitert — ein Eintrag, dieselbe Ladefunktion, derselbe Cache.
   Katalog-Owner bleibt \`registry/assets/v1\` + \`tools/asset_registry/librarian/\`; sobald von
   dort ein AssetRef mit Commit-Pin vorliegt, ersetzt er diese Zeile.
   Revision: Branch \`main\` — unter dem Dungeon-Pin 8948a06b liegt das Pack noch nicht. */
export const TREATS_REV = 'main';
const TT = (pack) => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + TREATS_REV +
  '/media/3D_Assets/' + pack + '/Assets/gltf/';
if (!PACKS.treats) PACKS.treats = { base: TT('Tiny_Treats_Baked_Goods_1.0_FREE'), ext: '.gltf' };
if (!PACKS.park) PACKS.park = { base: TT('Tiny_Treats_Pretty_Park_1.0_FREE'), ext: '.gltf' };

/* ---------- VERBATIM aus S13.2, Zeilen 221–228 ---------- */
const FLOORS = ['floor_tile_large', 'floor_wood_large', 'floor_dirt_large'];
const WALLS = ['wall', 'wall_half', 'wall_cracked', 'wall_broken', 'wall_doorway', 'wall_gated', 'wall_shelves',
  'wall_scaffold', 'wall_window_closed', 'wall_window_open', 'wall_pillar', 'wall_corner'];
const TWINS = { candle_lit: 'candle', candle_thin_lit: 'candle_thin', torch_lit: 'torch' };
const REST = ['stairs_wood', 'stairs', 'torch_mounted', 'barrier',
  ...Object.keys(TWINS), ...Object.values(TWINS)];
/* Eine benannte Erweiterung des Inventars, kein zweiter Katalog: S13 war ausdrücklich
   „Architektur zuerst, keine Requisiten, zwei Ebenen" — eine Decke brauchte der Generator dort
   nie. WhackMan schaut von oben auf ein Spielfeld und braucht sie. Gemessen über dieselbe
   Owner-Funktion: ceiling_tile 4,00 × 0,35 × 4,00, also exakt ein Modul. */
export const EXTRA = ['ceiling_tile'];
export const CAND = [...FLOORS, ...WALLS, ...REST, ...EXTRA];
export { FLOORS, WALLS, TWINS };

/* ---------- VERBATIM aus S13.2, Zeilen 231–290 ---------- */
export async function buildKit(onProgress = () => {}) {
  /* Vier Ladeversuche parallel: sequenziell blockiert minutenlang, alle gleichzeitig sättigen den
     Hauptthread (GLTF-Parse und Texturdekodierung laufen dort) und die Seite bleibt weiss. */
  const box = {};
  let done = 0, next = 0;
  async function worker() {
    while (next < CAND.length) {
      const name = CAND[next++];
      try { const m = await measure('dungeon', name); box[name] = { min: m.min, max: m.max, size: m.size }; }
      catch (e) { /* nicht im FREE-Tier */ }
      onProgress(++done, CAND.length);
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);
  const parts = new Set(Object.keys(box));

  const frame = {};
  for (const name of [...WALLS, 'barrier', 'stairs_wood', 'stairs'].filter((n) => parts.has(n))) {
    const node = await loadAsset('dungeon', name);
    const tris = collectTris(node);
    const scan = planScan(tris, 72);
    frame[name] = /corner/.test(name) ? cornerFrame(scan)
      : /stairs/.test(name) ? stairFrame(scan, tris)
        : wallFrame(scan);
    if (/^wall/.test(name) && frame[name].runAxis) {
      frame[name].opening = openingScan(collectTris(node, /_door$/), frame[name].runAxis);
    }
    frame[name].scan = { min: scan.min, max: scan.max, size: scan.size };
    frame[name].meshes = [];
    node.traverse((o) => { if (o.isMesh) frame[name].meshes.push(o.name); });
  }

  const MOD = box.floor_tile_large ? Math.max(box.floor_tile_large.size[0], box.floor_tile_large.size[2]) : 4;
  const WALL_H = box.wall ? box.wall.size[1] : 4;
  const WALL_THICK = box.wall ? frame.wall.plateThick : 1;
  const STAIR = parts.has('stairs_wood') ? 'stairs_wood' : (parts.has('stairs') ? 'stairs' : null);
  const HUB = STAIR ? frame[STAIR].hub : WALL_H;
  const kit = { MOD, HUB, WALL_H, WALL_THICK, box, frame };

  /* Flammenpunkt gemessen (dungeon-light.measureFlame) — die Boxmitte wäre der Griff. */
  const FLAME = {};
  for (const n of ['torch_mounted', ...Object.keys(TWINS)]) {
    if (!parts.has(n)) continue;
    FLAME[n] = measureFlame(collectTris(await loadAsset('dungeon', n)));
  }

  return {
    kit, parts, box, frame, FLAME, STAIR,
    facts: {
      MOD: +MOD.toFixed(3), WALL_H: +WALL_H.toFixed(3), WALL_THICK: +WALL_THICK.toFixed(3),
      HUB: +HUB.toFixed(3), bestaetigt: parts.size + '/' + CAND.length
    }
  };
}
