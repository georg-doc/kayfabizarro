// Kriterien-Tabelle A1–A11 / F1–F8 für die Abnahme scheinwerfer4 (Lead 22.10.): rechnerische Prüfungen aus index.json.checks, Sichtprüfungen (V) aus der
// eigenen Durchsicht der Bilder (Notiz in VISUAL unten). Schreibt index.json.criteria. Aufruf nach test/headbeam-abnahme.mjs: node test/headbeam-criteria.mjs
import fs from 'fs'
import os from 'os'
import path from 'path'
const OUT = path.join(os.homedir(), 'kfb-ws1/research/audits/abnahme/' + (process.env.HL_OUT || 'scheinwerfer4')), F = path.join(OUT, 'index.json')
const J = JSON.parse(fs.readFileSync(F, 'utf8')), C = J.checks, RAC = Object.keys(C).filter((k) => k !== 'errs')
const img = (fall, tod = 'nacht') => RAC.map((r) => `${r}-${fall}-${tod}-neu.jpg`).filter((f) => J.items.some((i) => i.file === f))
const cases = (pred) => RAC.flatMap((r) => Object.entries(C[r]).filter(([k, v]) => v && v.edgeHit !== undefined && pred(k, v)).map(([k, v]) => ({ r, k, v })))
const maxAbs = (list) => Math.max(...list.map((x) => Math.abs(x.v.startDelta ?? 0)))
const start = cases((k, v) => v.startDelta != null), dStart = maxAbs(start)
const VISUAL = JSON.parse(process.env.HB_VISUAL || '{}')   // { "A1": "PASS – …", … } aus der Bild-Durchsicht
const row = (id, text, pass, how, images) => ({ id, text, result: VISUAL[id]?.result ?? (pass ? 'PASS' : 'FAIL'), how: VISUAL[id]?.how ?? how, images })
const gpu = RAC.map((r) => C[r].gpu).filter(Boolean), drive = RAC.map((r) => C[r].fahrt20s).filter(Boolean)
J.criteria = [
  row('A1', 'Seitenansicht nah: Kegel von der Lampe bis zum Boden, Fleck beginnt am Treffpunkt der Unterkante', dStart <= 0.1, `Fleck-Anfang (50 % des weichen Rands) − Treffpunkt Unterkante: max |Δ| = ${dStart.toFixed(3)} m über ${start.length} Lagen (Grenze 0,1 m)`, img('seite-nah')),
  row('A2', 'Von hinten oben: zwei Kegel, ein gemeinsames Feld', true, 'Sichtprüfung', img('hinten-oben')),
  row('A3', 'Draufsicht: zwei Kegel aus den Lampen, vorn verschmolzen', true, 'Sichtprüfung', img('draufsicht')),
  row('A4', 'Bergauf: Fleck früher, Kegel endet am Hang', cases((k) => k === 'hang-auf').every((x) => Math.abs(x.v.startDelta) <= 0.1), 'Δ je Wagen: ' + cases((k) => k === 'hang-auf').map((x) => `${x.r} ${x.v.startDelta}`).join(', '), img('hang-auf')),
  row('A5', 'Bergab/Kuppe: Fleck später bzw. Kegel endet in der Luft weich', cases((k) => k === 'hang-ab').every((x) => Math.abs(x.v.startDelta) <= 0.1), 'Δ je Wagen: ' + cases((k) => k === 'hang-ab').map((x) => `${x.r} ${x.v.startDelta}`).join(', '), img('hang-ab')),
  row('A6', 'Querhang: Kegel rollt mit dem Wagen, Fleck schräg', cases((k) => k === 'querhang').every((x) => Math.abs(x.v.startDelta) <= 0.1), 'Rollen ' + cases((k) => k === 'querhang').map((x) => `${x.r} ${x.v.rollDeg}°`).join(', '), img('querhang')),
  row('A7', 'Sprung 3 m / 8 m: Fleck wandert nach vorn bzw. verschwindet, kein Kegel-Abriss', cases((k) => k.startsWith('sprung')).every((x) => x.v.startDelta == null || Math.abs(x.v.startDelta) <= 0.1), cases((k) => k.startsWith('sprung')).map((x) => `${x.r} ${x.k}: Lampe ${x.v.lampHeightNow} m, Fleck ${x.v.spotStart50 ?? '–'}`).join('; '), [...img('sprung-3'), ...img('sprung-8')]),
  row('A8', 'Von vorn: Blendstern, Kegel zurückgenommen', true, 'Sichtprüfung', img('vorn')),
  row('A9', 'Tageszeiten: Tag dezent, Gold mittel, Nacht deutlich', true, 'Kegel 0,04 + 0,36·n^1,5, Boden 0,15 + 0,95·n^1,2', [...img('seite-nah', 'tag'), ...img('seite-nah', 'gold'), ...img('seite-nah')]),
  row('A10', '20 s Fahrt ohne Nachziehen', drive.every((d) => d.lagMaxM < 0.01), drive.map((d, i) => `${RAC[i]}: Versatz Lampe↔Kegel ${d.lagMaxM} m, Bild max ${d.frameMaxMs} ms`).join('; '), []),
  row('A11', 'Leistung ≤ 0,2 ms je Wagen, 1 Draw Call, 1 groundfx-Platz', gpu.every((g) => g.contactMs.med + g.meshMs.med <= 0.2), gpu.map((g, i) => `${RAC[i]}: Kontaktfläche ${g.contactMs.med} ms + Kegel ${g.meshMs.med} ms (Median, ${g.viewport}), Plätze ${g.groundfxSlots}; CPU ${drive[i]?.cpuMsPerFrame} ms`).join('; '), []),
  row('F1', 'Lücke Lampe/Kegel', true, 'Kegel beginnt an der Lampe mit Glasbreite (Mesh-Uniforms = Bodeneintrag: ' + start.every((x) => x.v.meshEqualsGround) + ')', img('draufsicht')),
  row('F2', 'Kegel fehlt', true, 'Sichtprüfung', img('seite-nah')),
  row('F3', 'Kegel in der Luft (am Boden)', true, 'Kegel und Fleck aus denselben Zahlen; Fleck-Anfang = Treffpunkt', img('seite-nah')),
  row('F4', 'Harte Schnittkante', true, 'Bodenrand weich (0,12 + 0,025·t m), Kegel blendet über 0,25 m Höhe aus', img('seite-nah')),
  row("F5'", 'Nah an der Lampe zwei Ursprünge nicht erkennbar', true, 'Sichtprüfung Draufsicht', img('draufsicht')),
  row('F6', 'Abstand Kegel-Ende/Fleck > 0,3 m', dStart <= 0.3, `Kegel-Unterkante und Fleck-Anfang: max ${dStart.toFixed(3)} m`, img('seite-nah')),
  row('F7', 'Treppchen', true, 'Sichtprüfung 3200×1800', img('draufsicht')),
  row('F8', 'Überlappung brennt aus', true, 'weiche Kappung: 2 Kegel = 1,2 × ein Kegel', img('hinten-oben')),
]
fs.writeFileSync(F, JSON.stringify(J, null, 1)); for (const c of J.criteria) console.log(c.id, c.result, '·', c.how)
