// Look-Slice (V-406) · Farbdrehbuch: je Joyride-Welt (track-look.v5 WORLDS = island-palettes canyon/bucht/otown) eine Bühnenpalette mit Rollen und ≈ 6 Farben,
// dazu die V-305-Analyse (Harmonie, Abstände). Schreibt src/data/looks/kfb-colorscript.r1.json (kfb.colorscript/1). Neue Dioramen: fromColors(edgePalette, seed)
// aus kfb-cartoon-palette.js liefert eine Palette derselben Logik, die Rollen werden hier zugeordnet. node scripts/look/colorscript.mjs
import fs from 'fs'
import { PALETTES } from '../../src/vendor/palette/island-palettes.js'
import { analyse, fromColors } from '../../src/vendor/palette/kfb-cartoon-palette.js'
const NAMES = { canyon: 'A · Claybound-Canyon (Joyride-Standard)', bucht: 'B · Bikini-Bucht', otown: 'C · O-Town' }
const roles = (P) => ({ ground: P.top, structures: P.tower[0], structures2: P.tower[1], tiers: P.hill[0], tiers2: P.hill[1], stageFloor: P.sand, rock: P.rock, path: P.path, frame: P.strang, accent: P.leaf?.[0] || P.strang, sky: P.sky })
const out = { schema: 'kfb.colorscript/1', version: 'r1', date: '2026-10-17', vRef: ['V-402', 'V-406', 'V-305'],
  rule: 'Licht und Farbe getrennt (Georg 17.10.): Licht = Mesa/Krazy Kat (kfb-stage-light MOODS_MESA), Farbe = Joyride-Welten. Eine Bühnenpalette mit Rollen je Diorama; die Karte färbt nur Akzente. Umfärben nach Helligkeit (Struktur bleibt), Übergänge über das Sprenkel-Modul (V-403), steinweise Sprengsel über WSB B9 (V-406).',
  moods: 'Die Palette bleibt über Tag/Gold/Nacht gleich; Stimmung kommt nur aus dem Licht-Rig (R2 Regel 3).', worlds: {} }
for (const id of ['canyon', 'bucht', 'otown']) {
  const P = PALETTES[id], R = roles(P), six = [R.ground, R.structures, R.tiers, R.stageFloor, R.frame, R.accent]
  let harmony = null; try { harmony = analyse(fromColors(six, 1)) } catch (e) { harmony = { error: String(e.message || e) } }
  out.worlds[id] = { name: NAMES[id], note: P.note, roles: R, six, harmony }
}
fs.writeFileSync('src/data/looks/kfb-colorscript.r1.json', JSON.stringify(out, null, 1) + '\n'); console.log(Object.fromEntries(Object.entries(out.worlds).map(([k, v]) => [k, v.six])))
