/* KFB Pet Studio v9 — DAS PAD ALS VERTRAGSBLOCK.  pad-v1.0
 *
 * GEORGS DEFINITION (27.8., im Chat): ein PAD ist alles mit einer Bodenfläche — Pet, Requisite,
 * Klo-Rolli. Das ganze Bauteil: Modell + Base + Emotes + Mund + Bubble + Klang = EIN Modul, das
 * woanders (SpinballCast) eingehängt wird. Deshalb heisst der Block `pad` und NICHT `pet.pad`:
 * die Rolle ist kein Pet. Eine Form, zwei Bewohner — `pad.kind` sagt, welcher.
 *
 * WAS DIESER BLOCK IST UND WAS NICHT:
 *   FELDER, KEIN MOTOR. Wie `behavior` in `pet-metrics.v1.js`. Gear, Interaktionen und das Spiel
 *   LESEN die Anker; dieses Modul stellt sie bereit und misst sie. Wer hier Verhalten einbaut, baut
 *   die zweite Wahrheit, die im Post Mortem re-home steht.
 *
 * DIE ANKER (Georgs Ansage 27.8.: »pets haben keine hände → hüft & hand-entsprechungen für gear«):
 * Cartoon-Anatomie ohne Gelenke. Sieben Punkte, alle GEMESSEN, keiner getippt:
 *
 *   foot    Fussmitte — der Nullpunkt. [0,0,0] per Definition, nicht per Messung.
 *   hip     Höhe der breitesten Stelle in der unteren Hälfte. Da sitzt der Gürtel.
 *   handL   seitlich auf der Silhouette, auf Schulterhöhe, plus Luft.
 *   handR   dito, andere Seite.
 *   head    Scheitel.
 *   mouth   Punkt auf der BLICKSEITE bei 0,62 der Bauhöhe — für Requisiten (Zigarre, Strohhalm),
 *           NICHT für das Mund-Mesh. Das hat seinen eigenen Block `pet.mouth`, und zwei Rechnungen
 *           für eine Zahl sind ein Rechenfehler (Hausregel aus V3-S11).
 *   bubble  über dem Scheitel. Die Bubble hängt hier, sie klebt nicht am Kopf.
 *
 * MASSEINHEIT IST DIE GRUNDFORM, nicht die Welt. Alle Anker stehen in cubeH-Einheiten mit dem
 * Ursprung in der Fussmitte. Damit wandert kein Anker, wenn die Bühne skaliert — genau der Fehler,
 * an dem die Score-Rolle in V3-S13 dreimal geschoben wurde (das Objekt vergrössern statt das
 * Verhältnis, Hausregel R10).
 *
 * ⚠ ERBSCHAFT AUS v8, BEWUSST NICHT WIEDERHOLT: `ground-contract.v1.js` LIEST `body.cubeH`.
 * Dieses Modul liest es auch, aber es MISST die Bauhöhe selbst und meldet beide Zahlen samt
 * Abweichung (`cubeCheck`). Eine gemessene Kante schlägt ein gepflegtes Feld — solange die Messung
 * aus `byCube` nicht in der Messschicht steht, ist die Abweichung wenigstens SICHTBAR statt still.
 */

export const version = 'pad-v1.0';

/* Die Klangbank ist die vorhandene: `kfb-pinball-sfx.json`, 37 Ereignisse, gemessen am 27.8.
   Kein zweites Manifest — dieselbe Hausregel wie im Overworld-Masterplan §4.4c. */
export const AUDIO_DEF = {
  click: 'pop',            // Klick auf das Pad: der Grundton
  land: 'banner.land',     // Aufsetzen auf der Base
  emote: 'fluff',          // Emote ausgelöst
  select: 'ui.select',     // Auswahl im Studio — UI-Ton, KEIN Pet-Ton
};

/* Die Base. `ao` und `ink` sind Anteile der Kachelkante, nicht Pixel: die Base wird skaliert.
   ⚠ `ao` STEHT AUF 0 — Georgs Einwand 27.8. am Bild: der Kontaktsaum sah neben dem echten 3D-Schatten
   wie ein ZWEITER Schatten aus (»das könnte uns in Teufels Küche bringen, wenn das irgendeine andere
   KI oder ein anderer Nutzer anschaut und für einen REGULÄREN SCHATTEN hält«). Er ist ein Werkzeug,
   das man EINSCHALTET, kein Bestandteil des Standardbildes: ein unerklärtes Ding im Default wird
   nachgebaut, nicht hinterfragt. */
export const BASE_DEF = {
  tint: '#efe6d3',   // Papier. Wie ground-plane DEF.plane.tint — eine Zahl, ein Ort.
  ao: 0,             // Deckung des Kontaktsaums am Fuss — AUS, siehe Notiz oben
  aoWidth: 0.55,     // Breite des Saums als Anteil des Fussradius
  ink: true,         // Randbehandlung in Tusche (Kante der Kachel)
  inkPen: 2.6,       // Federbreite in px der Entwurfsgrösse der Kachel-Textur
  ring: 0.42,        // Deckung des Klick-Rings
};

export const ANCHOR_IDS = ['foot', 'hip', 'handL', 'handR', 'head', 'mouth', 'bubble'];
export const FIELD_DEF = {
  bands: 28,        // Höhenbänder für die Messung
  handClear: 1.06,  // Hand liegt 6 % ausserhalb der Silhouette — sonst steckt das Gear im Körper
  mouthAt: 0.62,    // Höhe des Requisiten-Punkts am Gesicht, Anteil der Bauhöhe
  bubbleGap: 0.30,  // Luft über dem Scheitel in Grundform-Höhen
};

const num = (v, d) => (v == null || !isFinite(v) ? null : +(+v).toFixed(d == null ? 4 : d));

/* ── Die Messung ─────────────────────────────────────────────────────────────────────────────── */
/**
 * BÄNDER STATT HÜLLKISTE. Eine Kiste ist keine Form (Lehre aus SpinballCast v1: die Scherenhälften
 * liegen diagonal, also taugt die Kiste nicht als Achse). Für die Hüfte brauchen wir die HÖHE, auf
 * der das Ding am breitesten ist — das steht in keiner Kiste, das steht in den Dreiecken.
 *
 * GELESEN über getX/getY/getZ (Regel 7): selbst adressierte Puffer haben schon NaN-Geometrie
 * erzeugt, weil `position` und `normal` interleaved im selben Puffer lagen.
 * GEMESSEN an der RUHENDEN Geometrie: der Ruhe-Clip hebt die Hülle je Tier verschieden weit, ein
 * Anker daran ist ein Pendel (Falle 3 im v7-Handover).
 */
export function measureAnchors(THREE, root, opts) {
  const o = { ...FIELD_DEF, ...(opts || {}) };
  if (!root) return null;
  root.updateWorldMatrix(true, true);
  const k = (root.scale && root.scale.x) || 1;
  const box = new THREE.Box3().setFromObject(root);
  if (!isFinite(box.min.y) || !isFinite(box.max.y)) return null;
  const H = box.max.y - box.min.y;
  if (!(H > 0)) return null;
  const c = box.getCenter(new THREE.Vector3());
  const N = Math.max(6, o.bands | 0);
  const rad = new Array(N).fill(0), cnt = new Array(N).fill(0);
  const xMax = new Array(N).fill(-Infinity), xMin = new Array(N).fill(Infinity);
  const v = new THREE.Vector3();
  let meshes = 0, samples = 0;
  root.traverse((m) => {
    if (!m.isMesh || !m.geometry) return;
    if (m.userData && m.userData.petOverlay) return;   // Mund und Augen liegen AUF, sie bauen nicht
    const pos = m.geometry.getAttribute && m.geometry.getAttribute('position');
    if (!pos) return;
    meshes++;
    m.updateWorldMatrix(true, false);
    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(m.matrixWorld);
      let b = Math.floor((v.y - box.min.y) / H * N);
      if (b < 0) b = 0; if (b >= N) b = N - 1;
      const d = Math.hypot(v.x - c.x, v.z - c.z);
      if (d > rad[b]) rad[b] = d;
      if (v.x - c.x > xMax[b]) xMax[b] = v.x - c.x;
      if (v.x - c.x < xMin[b]) xMin[b] = v.x - c.x;
      cnt[b]++; samples++;
    }
  });
  if (!samples) return null;
  /* Hüfte = breiteste Stelle UNTEN, Schulter = breiteste Stelle OBEN. Bei einem Cube-Pet ist der
     Radius über den Würfel fast konstant — dann landet die Hüfte an der Würfel-Unterkante und die
     Schulter an der Oberkante. Das ist keine Schwäche der Messung, das ist die richtige Antwort:
     ein Würfel hat seine Gürtellinie unten und seine Schultern oben. */
  const pick = (lo, hi) => {
    let bi = lo, br = -1;
    for (let i = lo; i <= hi; i++) { if (!cnt[i]) continue; if (rad[i] > br) { br = rad[i]; bi = i; } }
    return { band: bi, r: br < 0 ? 0 : br, y: (bi + 0.5) / N * H };
  };
  const half = Math.floor(N * 0.55);
  const hip = pick(0, Math.max(0, half - 1));
  const sh = pick(Math.min(N - 1, N - half), N - 1);
  return {
    height: num(H / k), heightWorld: num(H), k: num(k, 3), bands: N, samples, meshes,
    hip: { y: num(hip.y / k), r: num(hip.r / k), band: hip.band },
    shoulder: { y: num(sh.y / k), r: num(sh.r / k), band: sh.band },
    xSpan: num((Math.max.apply(null, xMax.filter(isFinite)) - Math.min.apply(null, xMin.filter(isFinite))) / k),
  };
}

/**
 * Aus der Messung werden die sieben Punkte. Einheit: Grundform-Höhen (cubeH), Ursprung Fussmitte,
 * +z ist die Blickrichtung. `faceDir` kommt aus dem Vertrag, wenn er sie hat (`body.faceDir`) —
 * sonst +z. Eine Blickachse zu RATEN ist genau die Falle aus dem Travel-Cut (»Gesicht ist −Z«).
 */
export function anchorsFrom(m, cubeH, opts) {
  if (!m) return null;
  const o = { ...FIELD_DEF, ...(opts || {}) };
  const h = cubeH && cubeH > 0 ? cubeH : m.height;
  if (!(h > 0)) return null;
  const u = (x) => num(x / h);                     // Weltmass -> Grundform-Einheiten
  const H = u(m.height);
  const hx = num(m.shoulder.r * o.handClear / h);
  return {
    foot: [0, 0, 0],
    hip: [0, u(m.hip.y), 0],
    handL: [-hx, u(m.shoulder.y), 0],
    handR: [hx, u(m.shoulder.y), 0],
    head: [0, H, 0],
    mouth: [0, num(m.height * o.mouthAt / h), num(m.shoulder.r / h)],
    bubble: [0, num(H + o.bubbleGap), 0],
  };
}

/* ── Der Block ───────────────────────────────────────────────────────────────────────────────── */
/** Additiv. Felder werden NIE entfernt — die Regel, die v1.2.6 gekostet hat. */
export function ensurePad(pet, kind) {
  if (!pet) return null;
  if (!pet.pad) pet.pad = {};
  const p = pet.pad;
  if (!p.kind) p.kind = kind || 'pet';
  if (!p.anchors) p.anchors = null;              // null = noch nicht gemessen, NICHT »leer«
  if (!p.base) p.base = { ...BASE_DEF };
  else for (const key of Object.keys(BASE_DEF)) if (p.base[key] === undefined) p.base[key] = BASE_DEF[key];
  if (!p.audio) p.audio = { ...AUDIO_DEF };
  else for (const key of Object.keys(AUDIO_DEF)) if (p.audio[key] === undefined) p.audio[key] = AUDIO_DEF[key];
  return p;
}

/** 1-%-Toleranz wie `pet-metrics.writeBody` — sonst ist jedes Laden eine Änderung und die
 *  Entwurfsmarkierung wertlos (Lehre aus V5-S3). */
export function writeAnchors(pet, anchors, meta) {
  if (!pet || !anchors) return { changed: false };
  const p = ensurePad(pet);
  const tol = 0.01;
  const same = (a, b) => a && b && a.length === b.length
    && a.every((v, i) => Math.abs(v - b[i]) <= Math.max(0.002, Math.abs(b[i] || 1) * tol));
  let changed = false;
  const next = { ...(p.anchors || {}) };
  for (const id of ANCHOR_IDS) {
    if (!anchors[id]) continue;
    if (!same(anchors[id], next[id])) { next[id] = anchors[id]; changed = true; }
  }
  if (!changed) return { changed: false, anchors: p.anchors };
  p.anchors = next;
  p.measured = {
    by: 'KFB Pet Studio v9 · ' + version,
    at: new Date().toISOString().slice(0, 10),
    unit: 'Grundform-Hoehen (cubeH), Ursprung Fussmitte, +z = Blickrichtung',
    ...(meta || {}),
  };
  return { changed: true, anchors: next };
}

/**
 * Messen und schreiben in einem Griff, plus DIE LAUTE ZEILE (Regel 6): wer dieses Modul übernimmt,
 * muss BELEGEN können, dass es läuft und nicht nachgebaut wurde.
 * `cubeCheck` ist der Vergleich zwischen gepflegtem Feld und gemessener Bauhöhe — die offene
 * v9-Frage aus dem CLAUDE.md-Kopf, hier wenigstens sichtbar gemacht.
 */
export function apply(THREE, pet, root, opts) {
  const o = opts || {};
  const m = measureAnchors(THREE, root, o);
  const cubeH = (pet && pet.body && pet.body.cubeH) || null;
  const a = anchorsFrom(m, cubeH, o);
  const w = writeAnchors(pet, a, { bands: m && m.bands, samples: m && m.samples });
  let check = null;
  if (m && cubeH) {
    const d = (m.height - cubeH) / cubeH;
    check = { cubeH: num(cubeH), measuredHeight: m.height, delta: num(d, 4),
      note: Math.abs(d) > 0.02 ? 'Vertragsfeld und gemessene Bauhoehe weichen um mehr als 2 % ab — die Messung gehoert in die Messschicht (byCube), nicht hierher' : 'im Rahmen' };
  }
  const line = '[PAD] ' + ((pet && pet.id) || '—') + ' · ' + ((pet && pet.pad && pet.pad.kind) || 'pet')
    + ' · Bauhoehe ' + (m ? m.height.toFixed(4) : '—') + ' (cubeH ' + (cubeH ? cubeH.toFixed(4) : '—') + ')'
    + ' · Huefte y ' + (a ? a.hip[1].toFixed(3) : '—')
    + ' · Schulter y ' + (a ? a.handL[1].toFixed(3) : '—') + ' x ±' + (a ? Math.abs(a.handL[0]).toFixed(3) : '—')
    + ' · Scheitel ' + (a ? a.head[1].toFixed(3) : '—')
    + ' · ' + (m ? m.samples : 0) + ' Punkte aus ' + (m ? m.meshes : 0) + ' Netzen in ' + (m ? m.bands : 0) + ' Baendern'
    + (w.changed ? ' · GESCHRIEBEN' : ' · unveraendert')
    + (check && Math.abs(check.delta) > 0.02 ? ' ⚠ cubeH-Abweichung ' + (check.delta * 100).toFixed(1) + ' %' : '');
  if (o.quiet !== true) console.log(line);
  return { measure: m, anchors: a, changed: w.changed, cubeCheck: check, line };
}

/** Ein Anker in Weltkoordinaten. `cubeH` ist der Maßstab, `footWorld` der Nullpunkt (Fussmitte),
 *  `facing` die Blickrichtung als Winkel um y in Radiant. */
export function anchorWorld(THREE, pad, id, footWorld, cubeH, facing) {
  const a = pad && pad.anchors && pad.anchors[id];
  if (!a) return null;
  const h = cubeH || 1;
  const v = new THREE.Vector3(a[0] * h, a[1] * h, a[2] * h);
  if (facing) v.applyAxisAngle(new THREE.Vector3(0, 1, 0), facing);
  return v.add(footWorld || new THREE.Vector3());
}

/** Der Export-Zähler für die Abnahme: wie viele Pets haben einen vollständigen Pad-Block? */
export function coverage(pets) {
  const rows = (pets || []).map((p) => ({
    id: p.id,
    kind: (p.pad && p.pad.kind) || null,
    anchors: p.pad && p.pad.anchors ? Object.keys(p.pad.anchors).length : 0,
    base: !!(p.pad && p.pad.base),
    audio: p.pad && p.pad.audio ? Object.keys(p.pad.audio).length : 0,
  }));
  return { rows, full: rows.filter((r) => r.anchors >= ANCHOR_IDS.length).length, total: rows.length };
}
