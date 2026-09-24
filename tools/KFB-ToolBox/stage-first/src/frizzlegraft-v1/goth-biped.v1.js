/**
 * goth-biped.v1 · GothGirl als KFB-Rig — MIT IHREM EIGENEN KOPF.
 *
 * Georg, 15.09.: »goth girl als KFB rig mit entfernten augen & mund im original-face/mesh → dafür
 * unser komplettes head-rig; colors etc von kaykit mit wimpern und female mouth«.
 *
 * Der Unterschied zu `graft-biped.v1` in einem Satz: der Graft ERSETZT den Wirtskopf durch
 * FrizzleBobs Schädel; hier bleibt der Originalkopf stehen, und nur die Teile, die unser Rig
 * selbst stellt, werden aus dem Netz genommen. Alles andere — Laden, Messen, Clips, Mixer, Boden,
 * Gesichtsrahmen, Bericht — ist geerbt. Diese Klasse überschreibt genau `_loadVariant`.
 *
 * ═══ GEMESSEN AM MODELL (15.09., `GothGirl.glb`, 323 724 B) ══════════════════════════════════
 * Sechs Netze an EINEM Material (`gothgirl`, Bildtafel 1024²), Skelett `Rig_Medium` mit 23
 * Knochen — dasselbe Skelett, das der Driver mitbringt, also spielen die acht Rig_Medium-Pakete
 * ohne Umweg. NULL eigene Clips.
 * `GothGirl_Head` (1618 Dreiecke) besteht aus **12 Inseln**. Zugeordnet über ihre LAGE, mit der
 * Messung als Prüfwert (Reihenfolge nach Dreieckszahl):
 *   1 Haare (832) · 2 Gesicht/Schädel (218) · 3 **Nase** (82, x 0, y 1,569, z 0,459 = vorderste)
 *   4/5 **Brauen** (72, x ±0,186, y 1,725 — flach: 0,198 × 0,072) · 6/7 **Augen** (69, x ±0,195,
 *   y 1,606) · 8/9 Ohren (66, x ±0,455) · 10–12 Ohrringe (24, x ±0,54).
 * Der **Mund ist aufgemalt**, nicht modelliert: er liegt in der Gesichtsinsel, die dunkelsten
 * Texel dieser Insel sitzen bei (0,03 · 1,42 · 0,44) — genau dort. Ein Netzschnitt kann ihn also
 * nicht entfernen; er wird ÜBERMALT (`texclean.paintOverRegion`, derselbe Weg wie bei Carls
 * aufgemaltem Mund), mit dem Median der übrigen Gesichtstexel als Farbe.
 *
 * ⚠ ZWEI FALLEN, hier bezahlt:
 * 1 · **Alle sechs Netze teilen EIN Material.** Wer die Bildtafel am Kopf ersetzt, ersetzt sie an
 *     Armen, Beinen und Körper mit. Darum bekommt der Kopf eine eigene Materialkopie, bevor die
 *     übermalte Tafel gesetzt wird.
 * 2 · **Die Kopfbox des Kopfknochens ist die Box der HAARE.** An `head` hängen auch die langen
 *     Strähnen: gemessen 1,187 × 1,292 × 1,091 gegen 0,903 × 0,789 × 0,850 für das Gesicht.
 *     `facehost.v1` mißt korrekt, was es zu messen bekommt — aber das Augen-Rig rechnet in halben
 *     Boxhöhen (`U`), und mit der Haarbox wären die Augen um ein Drittel zu groß und zu hoch.
 *     Also wird die Box auf die GESICHTSINSEL umgestellt: die Box des TEILS, nicht die des Ganzen.
 */
import GraftBiped from './graft-biped.v1.js';
import { SPEC as GRAFT_SPEC } from './graft-biped.v1.js';
import { buildFaceHost } from './facehost.v1.js';
import { paintOverRegion } from '../lab-v6/texclean.js';

/* ⚠ WEITERGEREICHT, nicht kopiert (dieselbe Regel wie in `graft-biped.v1`): das Studio liest
   `Mod.SPEC.eyes` fÜr die Startwerte des Augen-Rigs. Ohne diesen Export baut die Figur, und das
   Studio bricht danach mit »Cannot read properties of undefined (reading 'eyes')« ab — gemessen
   beim ersten Aufbau am 15.09. */
export const SPEC = GRAFT_SPEC;

export const SCHEMA = 'kfb.gothbiped/1';

/**
 * HARTE CONSUMER-ABHÄNGIGKEIT (16.09., WSA-Vorgabe).
 *
 * `Waving` und `Cheering` liegen in **`Rig_Medium_Simulation`**. Das geerbte `_build` lädt nur
 * `General` und `MovementBasic` (gemessen: 15 + 11 Clips) — eine Figur initialisiert also
 * erfolgreich und vermißt die beiden Clips anschließend, ohne daß irgendwo ein Fehler steht.
 * Genau dieser stille Ausfall wird hier geschlossen: die Kategorie wird MITGELADEN, und wenn sie
 * nicht erreichbar ist, sagt das Protokoll es (statt eines leeren Clip-Browsers).
 */
export const REQUIRED_ANIMATION_CATEGORIES = Object.freeze(['General', 'MovementBasic', 'Simulation']);
export const BIRTHDAY_STATE_CHAIN = Object.freeze(['Idle_A', 'Waving', 'Idle_A', 'Cheering', 'Idle_A']);

export const GOTH = Object.freeze({
  label: 'GothGirl',
  path: 'KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb',
  headRe: /head/i,
  /* Erwartung aus der Messung. Sie ENTSCHEIDET nichts — die Lage tut es —, aber sie widerspricht,
     wenn die Datei sich ändert (dieselbe Rolle wie `DONOR_CARL.expectBrow` in `facegraft.v1`). */
  expect: Object.freeze({ islands: 12, headTris: 1618, eyes: [6, 7], brows: [4, 5], nose: 3, face: 2,
    faceSize: [0.903, 0.789, 0.850], eyeAt: [0.195, 1.606], browAt: [0.186, 1.725] }),
  /* Die übermalte Region, aus den dunkelsten Gesichtstexeln abgeleitet und auf Lippenbreite
     aufgeweitet. `paintOverRegion` füllt DREIECKE in dieser Kiste, nicht ein UV-Rechteck. */
  mouthBoxLocal: Object.freeze({ min: [-0.17, 1.355, 0.30], max: [0.17, 1.475, 0.52] }),
  parts: Object.freeze({ eyes: false, brows: true, nose: true, mouth: false }),
});

/** Inseln eines Netzes: zusammenhängende Dreiecke über gemeinsame Eckpunkte (Position gerundet),
    absteigend nach Dreieckszahl. Union-Find, damit genähte und nicht-indizierte Netze gleich
    behandelt werden. Liest nur — die Geometrie bleibt unberührt. */
export function islandsOf(geo) {
  const pos = geo.attributes.position, idx = geo.index ? geo.index.array : null;
  const n = idx ? idx.length / 3 : pos.count / 3, parent = new Int32Array(n);
  const key = (i) => Math.round(pos.getX(i) * 1e4) + ',' + Math.round(pos.getY(i) * 1e4) + ',' + Math.round(pos.getZ(i) * 1e4);
  const find = (a) => { while (parent[a] !== a) a = parent[a] = parent[parent[a]]; return a; };
  for (let t = 0; t < n; t++) parent[t] = t;
  const seen = new Map();
  for (let t = 0; t < n; t++) {
    for (let k = 0; k < 3; k++) {
      const vi = idx ? idx[t * 3 + k] : t * 3 + k, kk = key(vi);
      if (seen.has(kk)) { const a = find(seen.get(kk)), b = find(t); if (a !== b) parent[b] = a; }
      else seen.set(kk, t);
    }
  }
  const groups = new Map();
  for (let t = 0; t < n; t++) { const r = find(t); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(t); }
  return [...groups.values()].sort((a, b) => b.length - a.length);
}

/** Hüllkiste und Mitte einer Insel, in Geometriekoordinaten (Bindepose). */
function islandBox(THREE, geo, tris) {
  const pos = geo.attributes.position, idx = geo.index ? geo.index.array : null;
  const box = new THREE.Box3(), v = new THREE.Vector3();
  tris.forEach((t) => { for (let k = 0; k < 3; k++) { v.fromBufferAttribute(pos, idx ? idx[t * 3 + k] : t * 3 + k); box.expandByPoint(v); } });
  return { box, size: box.getSize(new THREE.Vector3()), centre: box.getCenter(new THREE.Vector3()) };
}

/**
 * Gesichtsteile nach LAGE finden — dieselbe Regel wie `partrig.findFaceParts`, nur für ein
 * skinned Netz und ohne Namen: vorn, klein, paarweise gespiegelt. Kein Index ist fest verdrahtet.
 */
export function classifyFace(THREE, geo, islands) {
  const meta = islands.map((tris, i) => ({ i, tris: tris.length, ...islandBox(THREE, geo, tris) }));
  /* Gesicht gegen HAARE trennen: beide sind groß, beide stehen auf der Achse. Der Unterschied ist
     die Höhe — die Strähnen fallen über die Schultern (gemessen 1,292 gegen 0,789). Also von den
     zwei dreiecksstärksten Inseln die FLACHERE. Eine Regel, keine Indexliste. */
  const face = meta.slice(0, 2).sort((a, b) => a.size.y - b.size.y)[0] || meta[0];
  const front = meta.filter((m) => m.i !== 0 && m !== face && m.centre.z > 0.20 && m.tris <= 120 && Math.abs(m.centre.x) < 0.35);
  const nose = front.filter((m) => Math.abs(m.centre.x) < 0.06).sort((a, b) => b.centre.z - a.centre.z)[0] || null;
  const pairs = [];
  front.forEach((m) => {
    if (nose && m.i === nose.i) return;
    if (m.centre.x <= 0) return;
    const twin = front.find((o) => o.centre.x < 0 && Math.abs(o.centre.x + m.centre.x) < 0.03 && Math.abs(o.centre.y - m.centre.y) < 0.03);
    if (twin) pairs.push({ y: m.centre.y, flat: m.size.x > 1.8 * m.size.y, items: [m, twin] });
  });
  pairs.sort((a, b) => b.y - a.y);
  const brows = pairs.find((p) => p.flat) || pairs[0] || null;
  const eyes = pairs.find((p) => p !== brows) || null;
  const nos = (o) => (o ? o.items.map((m) => m.i) : []);
  return {
    face, meta,
    eyes: nos(eyes), brows: nos(brows), nose: nose ? [nose.i] : [],
    report: { islands: islands.length, faceIsland: face ? face.i + 1 : null,
      eyes: nos(eyes).map((i) => i + 1), brows: nos(brows).map((i) => i + 1), nose: nose ? nose.i + 1 : null,
      faceSize: face ? face.size.toArray().map((v) => +v.toFixed(3)) : null,
      eyeAt: eyes ? [+Math.abs(eyes.items[0].centre.x).toFixed(3), +eyes.items[0].centre.y.toFixed(3)] : null,
      browAt: brows ? [+Math.abs(brows.items[0].centre.x).toFixed(3), +brows.items[0].centre.y.toFixed(3)] : null },
  };
}

/**
 * Inseln zu ZEICHENGRUPPEN machen. EIN Index-Eigentümer für beides — Ausblenden UND Einfärben:
 * der Index wird einmal inselweise sortiert, jede Insel bekommt eine Gruppe und einen Platz im
 * Material-FELD. Ausblenden heißt dann: die Gruppe nicht anmelden. Einfärben heißt: an diesem
 * Platz ein eigenes Material.
 *
 * ⚠ Warum nicht zwei Wege: die erste Fassung hat zum Ausblenden die Dreiecke AUS dem Index
 * geschrieben. Für sich richtig, aber es kollidiert mit Gruppen — zwei Besitzer eines Index sind
 * einer zu viel. Gruppen können beides, also gibt es nur sie.
 * ⚠ Und: Gruppen gelten NUR bei einem Material-FELD; ein einzelnes Material übergeht sie (am Bild
 * bezahlt: »ausgeblendet« meldete OK und nichts verschwand).
 */
export function buildGroups(THREE, mesh, islands) {
  const geo = mesh.geometry;
  const src = mesh.userData._gothIndex || (geo.index ? Array.from(geo.index.array) : null);
  if (!src) return null;
  mesh.userData._gothIndex = src;
  const idx = [], groups = [];
  islands.forEach((tris, k) => {
    const start = idx.length;
    tris.forEach((t) => { idx.push(src[t * 3], src[t * 3 + 1], src[t * 3 + 2]); });
    groups.push({ island: k, start, count: idx.length - start });
  });
  geo.setIndex(idx);
  geo.computeBoundingSphere();
  return groups;
}

/**
 * Inseln ausblenden, ohne die Geometrie zu beschädigen: der INDEX wird ohne ihre Dreiecke neu
 * geschrieben. Eckpunkte, Skin-Gewichte und UV bleiben, wie sie sind — das Skinning merkt nichts.
 * `mesh.userData._gothIndex` ist der Rückweg (voller Originalindex).
 */
export function maskIslands(THREE, mesh, islands, hidden) {
  const geo = mesh.geometry;
  if (!mesh.userData._gothIndex) mesh.userData._gothIndex = geo.index ? Array.from(geo.index.array) : null;
  const src = mesh.userData._gothIndex;
  if (!src) return { status: 'UNSUPPORTED', reason: 'mesh has no index' };
  const drop = new Set();
  hidden.forEach((i) => (islands[i] || []).forEach((t) => drop.add(t)));
  const out = [];
  const n = src.length / 3;
  for (let t = 0; t < n; t++) if (!drop.has(t)) out.push(src[t * 3], src[t * 3 + 1], src[t * 3 + 2]);
  geo.setIndex(out);
  geo.computeBoundingSphere();
  return { status: 'OK', keptTris: out.length / 3, droppedTris: drop.size };
}

/**
 * Der HAUTTON der Gesichtsinsel — der Wert, mit dem der aufgemalte Mund übermalt wird.
 *
 * ⚠ BEZAHLT AM ERSTEN AUFBAU: `paintOverRegion` liest seine Füllfarbe als Median über das GANZE
 * Netz, wenn man ihr keine gibt. Ihr Kopfnetz besteht aber zu mehr als der Hälfte aus HAAREN
 * (832 von 1618 Dreiecken) — der Median war "rgb(32,42,45)", also Haarschwarz, und der Mund wurde
 * mit Haarfarbe zugemalt. Der Median muß über die GESICHTSINSEL laufen, und die Mundregion selbst
 * muß draußen bleiben, sonst zieht der Mund seinen eigenen Ton in den Median.
 */
export function faceTone(THREE, mesh, geo, tris, mouthBox) {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const src = (mesh.userData && mesh.userData.origMap) || (mat && mat.map);
  const img = src && src.image;
  const uv = geo.attributes.uv, pos = geo.attributes.position, idx = geo.index ? geo.index.array : null;
  if (!img || !img.width || !uv) return null;
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  try { cx.drawImage(img, 0, 0); } catch (e) { return null; }
  const box = new THREE.Box3(new THREE.Vector3().fromArray(mouthBox.min), new THREE.Vector3().fromArray(mouthBox.max));
  const flip = src.flipY !== false;
  const cols = [], v = new THREE.Vector3();
  tris.forEach((t) => {
    let u = 0, w = 0; const mid = new THREE.Vector3();
    for (let k = 0; k < 3; k++) {
      const vi = idx ? idx[t * 3 + k] : t * 3 + k;
      u += uv.getX(vi); w += uv.getY(vi);
      v.fromBufferAttribute(pos, vi); mid.add(v);
    }
    u /= 3; w /= 3; mid.multiplyScalar(1 / 3);
    if (box.containsPoint(mid)) return;
    const X = Math.min(img.width - 1, Math.max(0, Math.round(u * img.width)));
    const Y = Math.min(img.height - 1, Math.max(0, Math.round((flip ? 1 - w : w) * img.height)));
    let d; try { d = cx.getImageData(X, Y, 1, 1).data; } catch (e) { return; }
    if (d[3] > 8) cols.push([d[0], d[1], d[2]]);
  });
  if (!cols.length) return null;
  const lum = (c) => c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
  cols.sort((a, b) => lum(a) - lum(b));
  const m = cols[Math.floor(cols.length / 2)];
  return { css: 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')', samples: cols.length };
}

export default class GothBiped extends GraftBiped {
  static describe() { return { name: 'GothGirl', capabilities: ['three@0.160', 'assets', 'clock', 'rng'], view: '3d', determinism: 'seeded' }; }

  async init(ctx) {
    await super.init(ctx);
    this.hostKey = 'goth';
    /* KayKit-Farben bleiben (Georgs Ansage). Der Graft-Anstrich wird nicht angeworfen. */
    this.skinMode = 'off';
    this.parts = { ...GOTH.parts };
    this.log = (s) => { this.provenance.push(s); (ctx.log || console.info)('[goth-biped] ' + s); };
  }

  /** Der Aufbau des Spenders plus die Kategorie, in der Wave und Cheer wirklich liegen. */
  async _build() {
    const out = await super._build();
    for (const cat of REQUIRED_ANIMATION_CATEGORIES) {
      if (this.categories[cat]) continue;
      try { await this.loadCategory(cat); this.log('Kategorie ' + cat + ' nachgeladen (Pflicht für Waving/Cheering)'); }
      catch (e) { this.log('⚠ Kategorie ' + cat + ' nicht erreichbar: ' + (e && e.message) + ' — Waving/Cheering fehlen'); }
    }
    const have = (re) => Object.values(this.categories || {}).some((c) => c.clips.some((x) => re.test(x.name)));
    this.chainReady = have(/^Waving$/) && have(/^Cheering$/) && have(/^Idle_A$/);
    this.log('Birthday-Kette ' + (this.chainReady ? 'vollständig' : '⚠ UNVOLLSTÄNDIG') + ': ' + BIRTHDAY_STATE_CHAIN.join(' → '));
    return out;
  }

  /** Welche Originalteile sichtbar sind. `mouth: true` heißt: der aufgemalte Mund bleibt stehen. */
  /* ⚠ GEMESSEN BEIM ZWEITEN AUFBAU (15.09.): das Studio färbt jeden Zweibeiner nach dem Bau selbst
     ein — Protokoll »Wirtsfarbe · nur Haut in Kopffarbe #f2c93c: 1182 Dreiecke Haut in 3 Netzen«.
     Der Anstrich nimmt seinen Ton vom aufgesetzten FrizzleBob-Kopf, und wo keiner ist, vom
     Kanon-Gelb. GothGirl hatte damit gelbe Haut, obwohl `_loadVariant` »off« gesetzt hat.
     Georgs Ansage ist »colors etc von kaykit«, also wird der Anstrich HIER festgenagelt: die
     Bildtafel des Spenders bleibt, egal wer ihn anwirft. RÜCKWEG: diese Methode löschen. */
  _tintHost() { return super._tintHost('off'); }

  setParts(patch) {
    Object.assign(this.parts, patch || {});
    if (this._headMesh && this._islands) this._applyParts();
    return { status: 'OK', parts: { ...this.parts } };
  }
  _applyParts() {
    const hide = [];
    if (!this.parts.eyes) hide.push(...this._face.eyes);
    if (!this.parts.brows) hide.push(...this._face.brows);
    if (!this.parts.nose) hide.push(...this._face.nose);
    const geo = this._headMesh.geometry;
    geo.clearGroups();
    let shown = 0, dropped = 0;
    this._groups.forEach((g) => {
      if (hide.indexOf(g.island) >= 0) { dropped += g.count / 3; return; }
      geo.addGroup(g.start, g.count, g.island);
      shown += g.count / 3;
    });
    this._maskReport = { status: 'OK', keptTris: shown, droppedTris: dropped,
      hidden: hide.map((i) => i + 1), via: 'draw groups' };
    return this._maskReport;
  }

  /* ═══ MATERIALZONEN (Georg 16.09.: »color picker für kaykit goth girl materialzonen«) ══════════
     Zonen sind hier keine Atlas-Felder (wie beim Driver in `matzones.v1`), sondern das, was ihr
     Netz wirklich hergibt: die 12 Inseln des Kopfes, benannt aus der Lage-Zuordnung, plus je ein
     Eintrag für die fünf übrigen Netze (Körper, Arme, Beine). Eine gesetzte Farbe KLONT das
     Material dieser Zone und nimmt ihm die Bildtafel — die Nachbarzone bleibt unberührt, und
     `null` gibt das Original zurück. Die Quelldatei wird nie angefaßt. */
  zoneName(i) {
    const f = this._face;
    if (f.face && i === f.face.i) return 'Gesicht';
    if (i === 0) return 'Haare';
    if (f.eyes.indexOf(i) >= 0) return 'Auge ' + (f.eyes.indexOf(i) ? 'R' : 'L');
    if (f.brows.indexOf(i) >= 0) return 'Braue ' + (f.brows.indexOf(i) ? 'R' : 'L');
    if (f.nose.indexOf(i) >= 0) return 'Nase';
    const m = f.meta[i];
    if (m && Math.abs(m.centre.x) > 0.40) return m.tris > 40 ? 'Ohr' : 'Ohrring';
    return 'Insel ' + (i + 1);
  }
  zoneList() {
    const out = [], z = this._zones || {};
    if (this._headMesh && this._groups) {
      this._groups.forEach((g) => {
        const m = this._face.meta[g.island];
        out.push({ id: 'head:' + g.island, label: this.zoneName(g.island) + ' · Insel ' + (g.island + 1),
          tris: g.count / 3, colour: z['head:' + g.island] || null,
          hidden: this._maskReport ? this._maskReport.hidden.indexOf(g.island + 1) >= 0 : false,
          size: m ? m.size.toArray().map((v) => +v.toFixed(3)) : null });
      });
    }
    (this._otherMeshes || []).forEach((o) => {
      out.push({ id: 'mesh:' + o.name, label: o.name.replace(/^GothGirl_/, ''),
        tris: (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3,
        colour: z['mesh:' + o.name] || null, hidden: false, size: null });
    });
    return out;
  }
  setZone(id, hex) {
    this._zones = this._zones || {};
    if (String(id).indexOf('head:') === 0) {
      const k = parseInt(String(id).slice(5), 10);
      if (!this._mats || !this._mats[k]) return { status: 'UNSUPPORTED', field: id, reason: 'no such island' };
      const old = this._mats[k];
      if (hex) { const m = this._baseMat.clone(); m.map = null; m.color.set(hex); m.metalness = 0; m.roughness = 0.85; m.envMapIntensity = 0.75; this._mats[k] = m; this._zones[id] = hex; }
      else { this._mats[k] = this._baseMat; delete this._zones[id]; }
      if (old !== this._baseMat && old.dispose) old.dispose();
      this._headMesh.material = this._mats;
      return { status: 'OK', zone: id, colour: hex || null };
    }
    const name = String(id).slice(5);
    const o = (this._otherMeshes || []).find((x) => x.name === name);
    if (!o) return { status: 'UNSUPPORTED', field: id, reason: 'no such mesh' };
    if (!o.userData._gothBase) o.userData._gothBase = o.material;
    const old = o.material;
    if (hex) { const m = o.userData._gothBase.clone(); m.map = null; m.color.set(hex); m.metalness = 0; m.roughness = 0.85; m.envMapIntensity = 0.75; o.material = m; this._zones[id] = hex; }
    else { o.material = o.userData._gothBase; delete this._zones[id]; }
    if (old !== o.userData._gothBase && old.dispose) old.dispose();
    return { status: 'OK', zone: id, colour: hex || null };
  }
  applyZoneMap(map) { return Object.entries(map || {}).map(([id, hex]) => this.setZone(id, hex)); }

  async _loadVariant() {
    const T = this.THREE;
    this.hostKey = 'goth';
    const path = GOTH.path;
    const t0 = performance.now();
    const gltf = await this.loader.loadAsync(this.assets.raw(path));
    const ms = Math.round(performance.now() - t0);

    this._disposeGraft();
    this._disposeFigure();
    const fig = this.figure = gltf.scene;
    fig.name = 'figure';
    this.root.add(fig);
    fig.updateMatrixWorld(true);

    const m = this.m = this._measure(gltf, path, ms);
    m.degrayed = this.prepare(fig);
    fig.position.y -= m.box.min.y;
    fig.updateMatrixWorld(true);
    { const ly = this._lowestY(); if (ly != null) { const ry = this.root.getWorldPosition(new T.Vector3()).y; fig.position.y -= (ly - ry); fig.updateMatrixWorld(true); } }

    this.ownClips = (gltf.animations || []).map((c) => ({ name: c.name, dur: +c.duration.toFixed(2), clip: c, source: 'own', matched: c.tracks.length, total: c.tracks.length }));
    this.mixer = new T.AnimationMixer(fig);
    this.action = null;

    /* ── Kopfnetz, Inseln, Zuordnung ───────────────────────────────────────────────────────── */
    let head = null;
    fig.traverse((o) => { if (!head && o.isMesh && GOTH.headRe.test(o.name || '')) head = o; });
    if (!head) { this.log('⚠ kein Kopfnetz gefunden (' + GOTH.headRe + ') — Gesicht bleibt im Original'); }
    this._headMesh = head;
    this._otherMeshes = [];
    fig.traverse((o) => { if (o.isMesh && o !== head) this._otherMeshes.push(o); });
    if (head) {
      /* Falle 1: EIN Material für sechs Netze. Ohne eigene Kopie färbt der Mund die Beine mit. */
      if (!head.userData._gothMat) { const b = Array.isArray(head.material) ? head.material[0] : head.material; head.userData._gothBase = b.clone(); head.userData._gothMat = true; }
      this._baseMat = head.userData._gothBase;
      this._islands = islandsOf(head.geometry);
      this._face = classifyFace(T, head.geometry, this._islands);
      /* Gruppen + Material-Feld: EIN Weg für Ausblenden und Einfärben. */
      this._groups = buildGroups(T, head, this._islands);
      this._mats = this._islands.map(() => this._baseMat);
      this._zones = this._zones || {};
      head.material = this._mats;
      const e = GOTH.expect, r = this._face.report;
      const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
      this._face.report.matchesExpected = r.islands === e.islands && same(r.eyes, e.eyes) && same(r.brows, e.brows) && r.nose === e.nose;
      this._applyParts();
      if (!this.parts.mouth) {
        const mat = this._baseMat;
        const box = GOTH.mouthBoxLocal;
        const tone = faceTone(T, head, head.geometry, this._islands[this._face.face.i], box);
        const pr = paintOverRegion({ THREE: T, mesh: { geometry: head.geometry, material: mat, userData: {} },
          boxesLocal: [{ min: box.min, max: box.max }], grow: 0.12, color: tone ? tone.css : null });
        if (pr.map) { mat.map = pr.map; mat.needsUpdate = true; }
        this._mouthPaint = { ...pr.report, tone: tone ? tone.css : null, toneSamples: tone ? tone.samples : 0, toneFrom: 'face island' };
      }
      this.log('Kopf ' + head.name + ' · ' + this._islands.length + ' Inseln · Augen ' + r.eyes.join('+')
        + ' · Brauen ' + r.brows.join('+') + ' · Nase ' + r.nose
        + (this._face.report.matchesExpected ? ' · wie gemessen' : ' · ⚠ WEICHT VON DER MESSUNG AB')
        + ' · ausgeblendet ' + (this._maskReport.hidden.join('+') || '—')
        + (this._mouthPaint ? ' · Mund übermalt: ' + this._mouthPaint.status + ' (' + this._mouthPaint.triangles + ' Dreiecke, ' + this._mouthPaint.colour + ')' : ''));
    }

    /* ── Der Gesichtsrahmen: auf ihrem EIGENEN Kopf ────────────────────────────────────────── */
    const fh = this._fh = buildFaceHost({ THREE: T, figure: fig, log: (t) => this.log(t) });
    if (fh.status !== 'OK') { this.log('Kopf-Host gescheitert: ' + fh.reason); return; }
    /* Falle 2: die Box des Kopfknochens ist die Box der HAARE. Auf die Gesichtsinsel umstellen. */
    if (head && this._face && this._face.face) {
      const f = this._face.face;
      const c = f.centre.clone(); head.localToWorld(c);
      fh.head.updateMatrixWorld(true);
      fh.inner.position.copy(fh.head.worldToLocal(c));
      const s = f.size;
      fh.box.geometry.dispose();
      fh.box.geometry = new T.SphereGeometry(1, 40, 28).scale(s.x / 2, s.y / 2, s.z / 2);
      fh.box.geometry.computeBoundingBox();
      fh.size = s.clone();
      fh.report.faceBox = s.toArray().map((v) => +v.toFixed(3));
      this.log('Gesichtsrahmen auf die GESICHTSINSEL gestellt: ' + fh.report.faceBox.join('×')
        + ' statt Kopfknochen-Box ' + fh.report.headSize.join('×') + ' (die Haare hängen am Kopfknochen)');
    }
    this.faceInner = fh.inner;
    this.faceBox = fh.box;

    this._tintHost('off');
    this._buildFace();
    this.log(GOTH.label + ' · ' + path.split('/').pop() + ' · ' + ms + ' ms · Höhe ' + m.height.toFixed(3)
      + ' · Knochen ' + m.bones + ' · eigene Clips ' + this.ownClips.length + ' (Bewegungen kommen aus Rig_Medium)');
  }

  report() {
    const r = super.report();
    r.goth = { schema: SCHEMA, path: GOTH.path, parts: { ...this.parts },
      face: this._face ? this._face.report : null, mask: this._maskReport || null, mouthPaint: this._mouthPaint || null,
      zones: { ...(this._zones || {}) },
      requiredAnimationCategories: REQUIRED_ANIMATION_CATEGORIES.slice(),
      loadedCategories: Object.keys(this.categories || {}),
      chainReady: this.chainReady === true, chain: BIRTHDAY_STATE_CHAIN.slice() };
    return r;
  }
}
