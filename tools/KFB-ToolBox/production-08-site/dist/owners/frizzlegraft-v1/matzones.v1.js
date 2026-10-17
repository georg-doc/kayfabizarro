/* FrizzleGraft v1 · matzones.v1 — DIE MATERIALZONEN EINES KAYKIT-WIRTS.  13.09.2026
 *
 * WOFÜR (Georg 13.09.): »die einzelnen Materialzonen — Jacke, Kopffarbe, Gesichtsfarbe — alle mit
 * Farbpicker wählen können, und die Jacke in Schwarz wie eine Lederjacke gestalten.«
 *
 * ⚠ WARUM DIE ALTE ROLLENTABELLE DAS NICHT KONNTE, GEMESSEN STATT VERMUTET (13.09.):
 * der Driver hat EIN Material (`driver_texture`) und sieben Netze. Eine Regel über Material- oder
 * Mesh-Namen kann Jacke, Hose und Schuh deshalb gar nicht trennen — sie stecken alle drei im selben
 * Netz-Satz. Was sie trennt, ist die TEXTUR: `driver_texture` ist kein gemaltes Kleidungsstück,
 * sondern ein **Farbfeld-Atlas**, 1024 × 1024, gemessen 8 Spalten × 4 Zeilen à 128 × 256 Punkte.
 * Jedes Feld ist ein Farbverlauf, und jedes Dreieck der Figur zeigt in genau EIN Feld.
 *
 * GEMESSEN am Driver (UV-Schwerpunkt je Dreieck → Feld):
 *   Feld r0c0  Haut          Kopf 488 · Arm links 136 · Arm rechts 136   (die HÄNDE)
 *   Feld r0c1  Wirtskopf     Kopf 336                                    (verdeckt, unser Kopf sitzt darauf)
 *   Feld r0c2  Schwarz       Kopf 132 · Brillenglas 26
 *   Feld r1c1  JACKE         Körper 384 · Arm links 304 · Arm rechts 304
 *   Feld r1c7  HOSE          Körper 104 · Bein links 136 · Bein rechts 136
 *   Feld r2c3  SCHUH dunkel  Bein links 148 · Bein rechts 148
 *   Feld r2c4  SCHUH hell    Bein links 68 · Bein rechts 68
 *   Feld r2c6  BRILLE        Brille 364
 *   Feld r3c5  SHIRT         Körper 78   (darin liegt das kleine Brustlogo GO GO GO)
 *   Feld r3c6/7 RÜCKEN       Körper 36 + 36  (darin liegt das große GO GO GO — das Feld für die Wortmarke)
 *
 * DER WEG, und warum er ohne Geometrieschnitt auskommt: Farbe und Oberfläche werden in DREI
 * Leinwänden im Atlas-Raster abgelegt — Farbe, Rauheit, Metall. Ein Feld umfärben heißt: sein
 * Rechteck in der Farbleinwand neu malen (Leuchtdichte des Verlaufs bleibt, der Farbton wird
 * ersetzt). Ein Feld zu Leder machen heißt: sein Rechteck in der Rauheitsleinwand füllen.
 * **Kein `setIndex`, keine Zeichengruppen** — damit gibt es keinen zweiten Eigentümer für die
 * Netz-Indizes neben dem Hautschnitt (`graft-biped._tintHost`), die Fehlerklasse, die diese
 * Baustelle schon zweimal bezahlt hat.
 *
 * EIGENTUM: dieses Modul besitzt die drei Leinwände und die Materialfelder `map`/`roughnessMap`/
 * `metalnessMap` der WIRTS-Materialien. Der Hautschnitt besitzt weiterhin die Indizes und das
 * Material `kfb-skin`; der Kopf gehört `headgraft`/`applyZones`. `dispose()` gibt alles zurück.
 */

export const SCHEMA = 'kfb.matzones/0.1';

/* Oberflächen. Zahlen sind Rauheit/Metall, wie sie als Bildpunkt in die beiden Karten gehen.
   `grain` = feine Streuung in der Rauheit (Lederkorn), 0 = glatt. */
export const FINISHES = {
  stoff: { label: 'Stoff',  rough: 0.94, metal: 0.00, grain: 0.05 },
  matt:  { label: 'Matt',   rough: 0.82, metal: 0.00, grain: 0.00 },
  leder: { label: 'Leder',  rough: 0.44, metal: 0.06, grain: 0.13 },
  lack:  { label: 'Lack',   rough: 0.16, metal: 0.10, grain: 0.00 },
  metall:{ label: 'Metall', rough: 0.30, metal: 0.85, grain: 0.03 },
};
export const FINISH_DEFAULT = 'matt';

/* Die gemessenen Namen je Wirt. Was hier NICHT steht, bekommt einen Namen aus den Netzen, die das
   Feld benutzen — eine Behauptung wäre schlimmer als »Zone r1c1 · Körper, Arme«. */
export const ZONE_NAMES = {
  driver: {
    'r0c0': { label: 'Haut · Hände',      skin: true },
    'r0c1': { label: 'Wirtskopf · verdeckt', hidden: true },
    'r0c2': { label: 'Schwarz · Brillenglas' },
    'r1c1': { label: 'Jacke' },
    'r1c7': { label: 'Hose' },
    'r2c3': { label: 'Schuh · dunkel' },
    'r2c4': { label: 'Schuh · hell' },
    'r2c6': { label: 'Brille · Gestell' },
    'r3c5': { label: 'Shirt · Brustlogo' },
    'r3c6': { label: 'Rücken · Feld links' },
    'r3c7': { label: 'Rücken · Feld rechts' },
  },
};

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const hex6 = (h) => '#' + (h >>> 0).toString(16).padStart(6, '0');

/** Baut die Zonen eines Wirts. Gibt IMMER einen Bericht zurück, nie eine Behauptung. */
export function buildMatZones({ THREE, figure, headRoot = null, hostKey = null, log = () => {} }) {
  const underHead = (o) => { for (let q = o; q; q = q.parent) if (q === headRoot) return true; return false; };

  /* 1 · Die Netze des WIRTS und ihr gemeinsames Bild. Regel wie in `graft-biped._hostParts`:
     geskinnt, benannt, nicht unser Zeug, nicht unter dem Kopf. */
  const meshes = [];
  figure.traverse((m) => {
    if (!(m.isMesh || m.isSkinnedMesh) || m.userData.noMeasure) return;
    if (!m.name || /^kfb/i.test(m.name) || (headRoot && underHead(m))) return;
    const mats = [].concat(m.material).filter((x) => x && x.map && x.map.image);
    if (!mats.length || !m.geometry || !m.geometry.attributes.uv) return;
    meshes.push({ mesh: m, mats });
  });
  if (!meshes.length) return { status: 'KEIN_ATLAS', reason: 'kein Wirtsnetz mit Bildtafel und UV' };

  const img = meshes[0].mats[0].map.image;
  const W = img.width | 0, H = img.height | 0;
  if (!W || !H) return { status: 'KEIN_ATLAS', reason: 'Bildtafel ohne Maße' };

  const src = document.createElement('canvas'); src.width = W; src.height = H;
  const sx = src.getContext('2d', { willReadFrequently: true });
  sx.drawImage(img, 0, 0);
  let SRC;
  try { SRC = sx.getImageData(0, 0, W, H); } catch (e) { return { status: 'KEIN_ATLAS', reason: 'Bildtafel nicht lesbar: ' + e.message }; }
  const S = SRC.data;

  /* 2 · DAS RASTER WIRD GEMESSEN, NICHT ANGENOMMEN. Eine Spaltenkante ist eine x-Stelle, an der sich
     die Farbe über die MEHRHEIT der Zeilen sprunghaft ändert. Beim Driver fallen so genau die
     sieben inneren Kanten bei 128 … 896 heraus; ein Atlas mit anderem Raster liefert seine eigenen. */
  const px = (x, y) => { const o = (y * W + x) * 4; return [S[o], S[o + 1], S[o + 2]]; };
  const jump = (a, b) => { const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2]; return dr * dr + dg * dg + db * db > 40 * 40; };
  const edges = (n, m, at) => {
    const out = [0];
    for (let i = 1; i < n; i++) {
      let hit = 0;
      for (let j = 0; j < m; j += 4) if (at(i, j)) hit++;
      if (hit / Math.ceil(m / 4) > 0.5) out.push(i);
    }
    out.push(n);
    return out.filter((v, i, a) => i === 0 || v - a[i - 1] > 8);   // Doppelkanten (Antialiasing) zusammenfassen
  };
  const colE = edges(W, H, (x, y) => jump(px(x, y), px(x - 1, y)));
  const rowE = edges(H, W, (y, x) => jump(px(x, y), px(x, y - 1)));
  if (colE.length < 3 || rowE.length < 3) return { status: 'KEIN_ATLAS', reason: 'kein Raster erkennbar (' + (colE.length - 1) + ' × ' + (rowE.length - 1) + ')' };

  const cellOf = (u, v) => {
    const x = clamp(Math.floor(u * W), 0, W - 1), y = clamp(Math.floor(v * H), 0, H - 1);
    let c = 0; while (c + 2 < colE.length && x >= colE[c + 1]) c++;
    let r = 0; while (r + 2 < rowE.length && y >= rowE[r + 1]) r++;
    return r * (colE.length - 1) + c;
  };

  /* 3 · Welches Dreieck zeigt in welches Feld. Der UV-Schwerpunkt ist die Probe — dieselbe, mit der
     `graft-biped` den Hautton mißt, und aus demselben Grund: eine Ecke kann auf der Kante liegen. */
  const used = new Map();
  for (const { mesh } of meshes) {
    const g = mesh.geometry, uv = g.attributes.uv, ix = g.index;
    const n = ix ? ix.count / 3 : uv.count / 3;
    for (let t = 0; t < n; t++) {
      const a = ix ? ix.getX(t * 3) : t * 3, b = ix ? ix.getX(t * 3 + 1) : t * 3 + 1, c = ix ? ix.getX(t * 3 + 2) : t * 3 + 2;
      const u = (uv.getX(a) + uv.getX(b) + uv.getX(c)) / 3, v = (uv.getY(a) + uv.getY(b) + uv.getY(c)) / 3;
      const k = cellOf(u, v);
      let e = used.get(k);
      if (!e) { e = { tris: 0, meshes: new Map() }; used.set(k, e); }
      e.tris++; e.meshes.set(mesh.name, (e.meshes.get(mesh.name) || 0) + 1);
    }
  }

  /* 4 · Jedes benutzte Feld wird eine Zone. Mittlere Farbe und Leuchtdichte GEMESSEN — sie sind der
     Bezug, an dem das Umfärben den Verlauf erhält. */
  const names = ZONE_NAMES[hostKey] || {};
  const zones = [];
  const NC = colE.length - 1;
  for (const [k, e] of [...used.entries()].sort((a, b) => b[1].tris - a[1].tris)) {
    const c = k % NC, r = (k - c) / NC;
    const x0 = colE[c], x1 = colE[c + 1], y0 = rowE[r], y1 = rowE[r + 1];
    let sr = 0, sg = 0, sb = 0, sl = 0, n = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
      const o = (y * W + x) * 4;
      sr += S[o]; sg += S[o + 1]; sb += S[o + 2];
      sl += 0.299 * S[o] + 0.587 * S[o + 1] + 0.114 * S[o + 2];
      n++;
    }
    const id = 'r' + r + 'c' + c;
    const meshList = [...e.meshes.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m);
    const known = names[id] || null;
    zones.push({
      id, cell: k, rect: [x0, y0, x1, y1], tris: e.tris, meshes: meshList,
      label: known ? known.label : ('Zone ' + id + ' · ' + meshList.slice(0, 2).map((m) => m.replace(/^[^_]*_/, '')).join(' · ')),
      known: !!known, skin: !!(known && known.skin), hidden: !!(known && known.hidden),
      baseHex: (Math.round(sr / n) << 16) | (Math.round(sg / n) << 8) | Math.round(sb / n),
      baseLum: Math.max(1, sl / n),
    });
  }

  const T = THREE;
  const mk = (fill) => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const cx = cv.getContext('2d', { willReadFrequently: true }); cx.fillStyle = fill; cx.fillRect(0, 0, W, H); return { cv, cx }; };
  const col = mk('#000'); col.cx.putImageData(SRC, 0, 0);
  const rgh = mk('#d1d1d1');   // 0,82 = »Matt«, die Vorgabe
  const met = mk('#000');

  const texOf = (cv, srgb) => {
    const tx = new T.CanvasTexture(cv);
    const m0 = meshes[0].mats[0].map;
    tx.flipY = m0.flipY; tx.wrapS = m0.wrapS; tx.wrapT = m0.wrapT;
    tx.magFilter = m0.magFilter; tx.minFilter = m0.minFilter; tx.anisotropy = m0.anisotropy;
    if (srgb) tx.colorSpace = m0.colorSpace;
    tx.needsUpdate = true;
    return tx;
  };
  const texC = texOf(col.cv, true), texR = texOf(rgh.cv, false), texM = texOf(met.cv, false);

  /* 5 · Die Materialien des Wirts bekommen die drei Karten. In PLACE, mit Rückgabe — ein Klon je Netz
     wäre hier falsch: alle Netze teilen dasselbe Material, und genau das ist erwünscht (eine Leinwand
     für die ganze Figur). */
  const undo = [];
  const mats = new Set();
  meshes.forEach(({ mats: ms }) => ms.forEach((m) => mats.add(m)));
  for (const m of mats) {
    const o = { map: m.map, roughnessMap: m.roughnessMap, metalnessMap: m.metalnessMap, roughness: m.roughness, metalness: m.metalness };
    undo.push(() => { Object.assign(m, o); m.needsUpdate = true; });
    m.map = texC; m.roughnessMap = texR; m.metalnessMap = texM;
    m.roughness = 1; m.metalness = 1;   // die Karten sind Faktoren — 1 heißt »die Karte gilt«
    m.needsUpdate = true;
  }

  const state = {};   // zoneId → { hex|null, finish }
  const stamps = new Map();   // id → { zones:Set, draw(cx,W,H), last }

  /* Stempel laufen NACH dem Anstrich: die Wortmarke füllt ihre beiden Kästen mit der Farbe, die in
     der Leinwand NEBEN ihnen steht — also mit der neuen, wenn die Jacke gerade umgefärbt wurde.
     Liefe sie davor, käme das alte Orange zurück. */
  const runStamps = (zoneId) => {
    let n = 0;
    stamps.forEach((s, id) => {
      if (zoneId && s.zones && s.zones.size && !s.zones.has(zoneId)) return;
      try { s.last = s.draw(col.cx, W, H); n++; } catch (e) { s.last = { status: 'FEHLER', reason: e && e.message }; }
    });
    if (n) texC.needsUpdate = true;
    return n;
  };

  const paintColor = (z) => {
    const [x0, y0, x1, y1] = z.rect;
    const d = col.cx.getImageData(x0, y0, x1 - x0, y1 - y0), a = d.data;
    const st = state[z.id] || {};
    if (st.hex == null) {
      // Zurück auf das Original — Punkt für Punkt aus der gemessenen Quelle.
      for (let y = 0; y < y1 - y0; y++) for (let x = 0; x < x1 - x0; x++) {
        const o = (y * (x1 - x0) + x) * 4, so = ((y + y0) * W + (x + x0)) * 4;
        a[o] = S[so]; a[o + 1] = S[so + 1]; a[o + 2] = S[so + 2]; a[o + 3] = S[so + 3];
      }
    } else {
      const tr = (st.hex >> 16) & 255, tg = (st.hex >> 8) & 255, tb = st.hex & 255;
      for (let y = 0; y < y1 - y0; y++) for (let x = 0; x < x1 - x0; x++) {
        const o = (y * (x1 - x0) + x) * 4, so = ((y + y0) * W + (x + x0)) * 4;
        /* Der VERLAUF bleibt: jeder Punkt behält sein Verhältnis zur mittleren Leuchtdichte des
           Feldes, nur der Farbton wird ersetzt. Ein flaches Überstreichen hätte Naht, Falte und
           Logo mitgenommen — gemessen sind das im Rückenfeld 36 Dreiecke Zeichnung. */
        const l = (0.299 * S[so] + 0.587 * S[so + 1] + 0.114 * S[so + 2]) / z.baseLum;
        a[o] = clamp(Math.round(tr * l), 0, 255);
        a[o + 1] = clamp(Math.round(tg * l), 0, 255);
        a[o + 2] = clamp(Math.round(tb * l), 0, 255);
        a[o + 3] = S[so + 3];
      }
    }
    col.cx.putImageData(d, x0, y0);
  };

  const paintFinish = (z) => {
    const [x0, y0, x1, y1] = z.rect, w = x1 - x0, h = y1 - y0;
    const f = FINISHES[(state[z.id] || {}).finish] || FINISHES[FINISH_DEFAULT];
    const r = Math.round(f.rough * 255), mv = Math.round(f.metal * 255);
    rgh.cx.fillStyle = 'rgb(' + r + ',' + r + ',' + r + ')'; rgh.cx.fillRect(x0, y0, w, h);
    met.cx.fillStyle = 'rgb(' + mv + ',' + mv + ',' + mv + ')'; met.cx.fillRect(x0, y0, w, h);
    if (f.grain > 0) {
      /* Lederkorn: feine Streuung in der RAUHEIT, nicht in der Farbe. Deterministisch (kein
         `Math.random`), damit zwei Ladungen dasselbe Bild ergeben — Hausregel, dreimal bezahlt. */
      const d = rgh.cx.getImageData(x0, y0, w, h), a = d.data, amp = f.grain * 255;
      for (let i = 0, p = 0; i < a.length; i += 4, p++) {
        const n = ((p * 1103515245 + 12345) >>> 16) & 255;
        const v = clamp(r + (n / 255 - 0.5) * 2 * amp, 0, 255);
        a[i] = a[i + 1] = a[i + 2] = v;
      }
      rgh.cx.putImageData(d, x0, y0);
    }
  };

  const api = {
    status: 'OK', schema: SCHEMA, zones, hostKey,
    grid: { cols: colE.length - 1, rows: rowE.length - 1, w: W, h: H },
    canvas: { color: col, rough: rgh, metal: met, src: SRC },
    textures: { color: texC, rough: texR, metal: texM },
    zone: (id) => zones.find((z) => z.id === id) || null,
    get state() { return state; },

    /** Farbe eines Feldes. `null` = zurück auf das Original. */
    setColor(id, hex) {
      const z = api.zone(id); if (!z) return null;
      state[id] = { ...(state[id] || {}), hex: hex == null ? null : (hex >>> 0) };
      paintColor(z); runStamps(id); texC.needsUpdate = true;
      return state[id];
    },
    /** Oberfläche eines Feldes (`FINISHES`). */
    setFinish(id, key) {
      const z = api.zone(id); if (!z) return null;
      state[id] = { ...(state[id] || {}), finish: FINISHES[key] ? key : FINISH_DEFAULT };
      paintFinish(z); texR.needsUpdate = true; texM.needsUpdate = true;
      return state[id];
    },
    /** Ein ganzer Stand auf einmal: `{ 'r1c1': { hex:0x1a1a1a, finish:'leder' }, … }`. */
    apply(doc) {
      for (const z of zones) {
        const d = (doc || {})[z.id];
        state[z.id] = { hex: d && d.hex != null ? (typeof d.hex === 'string' ? parseInt(d.hex.replace('#', ''), 16) : d.hex) : null,
                        finish: d && d.finish ? d.finish : FINISH_DEFAULT };
        paintColor(z); paintFinish(z);
      }
      texC.needsUpdate = true; texR.needsUpdate = true; texM.needsUpdate = true;
      runStamps(null);
      return api.export();
    },
    /** Ein Stempel malt NACH dem Anstrich in dieselbe Leinwand (Wortmarke, Aufnäher, Nummer). */
    setStamp(id, o) { stamps.set(id, { zones: new Set(o && o.zones ? o.zones : []), draw: o.draw, last: null }); runStamps(null); return stamps.get(id).last; },
    clearStamp(id) { stamps.delete(id); for (const z of zones) paintColor(z); runStamps(null); texC.needsUpdate = true; },
    stampReport(id) { const s = stamps.get(id); return s ? s.last : null; },
    /** Was in den Eintrag geschrieben wird — nur, was vom Original abweicht. */
    export() {
      const out = {};
      for (const z of zones) {
        const st = state[z.id] || {};
        if (st.hex == null && (!st.finish || st.finish === FINISH_DEFAULT)) continue;
        out[z.id] = {};
        if (st.hex != null) out[z.id].hex = hex6(st.hex);
        if (st.finish && st.finish !== FINISH_DEFAULT) out[z.id].finish = st.finish;
      }
      return out;
    },
    /** Die drei Karten wieder anhängen. Nötig, wenn jemand nach uns am Material war — der Hautschnitt
        (`_tintHost`) und die Rollen legen Materialien um, und »ganze Figur« tauscht `map` aus. */
    reassert() {
      let n = 0;
      for (const m of mats) {
        if (m.map === texC && m.roughnessMap === texR) continue;
        m.map = texC; m.roughnessMap = texR; m.metalnessMap = texM;
        m.roughness = 1; m.metalness = 1; m.needsUpdate = true; n++;
      }
      return n;
    },
    report() {
      return {
        status: 'OK', host: hostKey, grid: api.grid,
        zones: zones.map((z) => ({ id: z.id, label: z.label, tris: z.tris, base: hex6(z.baseHex),
          hex: (state[z.id] || {}).hex != null ? hex6(state[z.id].hex) : null, skin: !!z.skin, hidden: !!z.hidden,
          finish: (state[z.id] || {}).finish || FINISH_DEFAULT, meshes: z.meshes })),
      };
    },
    dispose() {
      undo.slice().reverse().forEach((f) => { try { f(); } catch (e) {} });
      [texC, texR, texM].forEach((t) => { try { t.dispose(); } catch (e) {} });
    },
  };

  for (const z of zones) { state[z.id] = { hex: null, finish: FINISH_DEFAULT }; paintFinish(z); }
  texR.needsUpdate = true; texM.needsUpdate = true;

  log('Materialzonen · Raster ' + api.grid.cols + ' × ' + api.grid.rows + ' gemessen · '
    + zones.length + ' Felder benutzt · ' + zones.map((z) => z.id + ' ' + z.tris).join(' · '));
  return api;
}

export default { SCHEMA, FINISHES, FINISH_DEFAULT, ZONE_NAMES, buildMatZones };
