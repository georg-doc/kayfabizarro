// kfb-hypernorm · Flächen-Adapter für WS1 (K4a Fassade, K7 Worker, W-007 Punkt 2 mehrere Flächen; WSV 06.11.2026)
// Dieselbe Textur-Schnittstelle wie cascade/r4/engine.js (texture, info, ring, update(dt,{reduced}), dispose, sharedEngine, Vorfüllen),
// aber ohne iframe und ohne H15-Seite: der Kern rendert direkt, geführt über Absichten (kfb.hn-intents/1) statt __kfbForce*.
// - Ein Kern je Seite (Wirt): Material, Schriften, Bild-Caches und Darsteller einmal, im Worker (K7) oder im Hauptfaden (Rückfall).
//   Darauf beliebig viele Flächen: createFlaeche({ art: 'fassade' | 'boden' | 'kuppel' | 'video', … }); createFassade = art 'fassade'.
// - Der Hauptfaden übernimmt je Bild nur ein fertiges ImageBitmap. Ohne Worker-Unterstützung oder bei einem Fehler im Worker läuft
//   derselbe Ablauf im Hauptfaden (flaeche.mjs) und lädt Bilder ebenfalls als ImageBitmap: Worker und Rückfall sind bitgleich.
// - Ring „fuehren“ (V-1500) = Absicht FASSADE_RING; Ring-Buchführung in flaeche.mjs, der Atlas (copyTextureToTexture) hier.
// - pause()/resume() statt _kfbPause; ruft niemand update, rechnet nichts (kein Intervall, kein eigener Takt).
// - three wird übergeben (kein Bare-Import): createFassade({ three: THREE, gl: renderer, quellen: [{ url: 'pd_pool/manifest.json', src: 'pd' }], … }).
import { kernInstanz, flaeche, EBENEN, FASSADE_RING, BODEN_RUHIG, ARTEN } from './flaeche.mjs';
import { loadFonts } from '../fonts/fonts.mjs';
import { loadMaterial } from '../material.mjs';
import { ladeSchriftPool, BLACKLIST } from '../schriftpool.mjs';
export { EBENEN, FASSADE_RING, BODEN_RUHIG, ARTEN, BLACKLIST };

const naechstesBild = () => new Promise(r => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(() => r()) : setTimeout(r, 0)));
const absolut = qs => qs && qs.map(q => Object.assign({}, q, { url: new URL(q.url, location.href).href }, q.mirror ? { mirror: new URL(q.mirror, location.href).href } : {}));
const kannWorker = () => typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined';

// ---------- Wirt: ein Kern für alle Flächen mit denselben Quellen ----------
const WIRTE = new Map(); let MAT_ID = 0; const MAT_IDS = new WeakMap();
function wirt({ quellen = null, erlaubt = [], material = null, worker = 'auto', schriften = true, schriftManifest = null, darsteller = true, schriftPool = null }) {
  const SPOOL = schriftPool ? Object.assign({}, schriftPool, schriftPool.url ? { url: new URL(schriftPool.url, location.href).href } : {}) : null;
  const mid = material && typeof material === 'object' ? (MAT_IDS.get(material) || (MAT_IDS.set(material, ++MAT_ID), MAT_ID)) : 0;
  const key = JSON.stringify([absolut(quellen), erlaubt, mid, worker, schriften, schriftManifest, darsteller, SPOOL]);
  if (WIRTE.has(key)) return WIRTE.get(key);
  const H = { modus: null, W: null, inst: null, pool: 0, schriften: 0, fehler: null, workerFehler: null, handler: new Map(), n: 0, key };
  const hauptStart = async () => {
    H.modus = 'haupt';
    const [m, s] = await Promise.all([material || loadMaterial(absolut(quellen) || [], { erlaubt, bitmaps: true }), schriften ? loadFonts(undefined, { manifest: schriftManifest }) : null]);
    if (!m || !m.items) throw new Error('Material fehlt (quellen oder material)');
    const sp = SPOOL ? Object.assign({}, SPOOL, { manifest: SPOOL.url ? await ladeSchriftPool(SPOOL.url) : null }) : null;
    H.inst = kernInstanz(m, { darsteller, schriftPool: sp }); H.pool = m.items.length; H.schriften = s ? s.geladen : 0;
  };
  const workerStart = () => new Promise((ok, fail) => {
    H.modus = 'worker'; const W = H.W = new Worker(new URL('./fassade.worker.mjs', import.meta.url), { type: 'module' }); let gestartet = false;
    W.onerror = e => { e.preventDefault?.(); const t = 'Worker: ' + (e.message || 'Laden fehlgeschlagen'); if (!gestartet) fail(new Error(t)); else H.fehler = t; };
    W.onmessage = ({ data: m }) => {
      if (m.typ === 'bereit') { gestartet = true; H.pool = m.pool; H.schriften = m.schriften; ok(); return; }
      if (m.typ === 'fehler' && !gestartet) { fail(new Error(m.text)); return; }
      const h = H.handler.get(m.id); if (h) h(m); else if (m.bmp) m.bmp.close();
    };
    (async () => {
      if (quellen) W.postMessage({ typ: 'init', quellen: absolut(quellen), erlaubt, schriftManifest: schriften ? schriftManifest : null, darsteller, schriftPool: SPOOL });
      else { const m = await material; const items = m.items, bitmaps = {};   // fertiges Material: Bilder einmal als ImageBitmap hinüberreichen
        await Promise.all(items.map(async p => { if (m.imgs[p.id]) bitmaps[p.id] = await createImageBitmap(m.imgs[p.id]); }));
        W.postMessage({ typ: 'init', items, bitmaps, schriftManifest: schriften ? schriftManifest : null, darsteller, schriftPool: SPOOL }, Object.values(bitmaps)); }
    })().catch(fail);
  });
  H.bereit = ((worker === true || (worker === 'auto' && kannWorker())) ? workerStart().catch(e => { H.workerFehler = String(e && e.message || e); H.W?.terminate(); H.W = null; return hauptStart(); }) : hauptStart())
    .catch(e => { H.fehler = String(e && e.message || e); });
  H.post = (m, tr) => H.W.postMessage(m, tr || []);
  H.frei = () => { if (--H.n <= 0) { H.W?.terminate(); WIRTE.delete(key); } };
  WIRTE.set(key, H); return H;
}

// ---------- Fläche ----------
// quellen: Manifeste wie loadMaterial (bevorzugt: der Worker lädt selbst) · material: fertiges kfb.hn-material/1 oder Promise darauf
// worker: 'auto' (Standard) | true | false · art: siehe ARTEN (Format, Vorgaben, Beschreibung) · aspect überschreibt das Format der Art
export function createFlaeche({ art = 'fassade', three = null, gl = null, quellen = null, erlaubt = [], material = null, worker = 'auto', palette = null, ebenen = false,
  intents, aspect, seed = 1966, ctx = 'KALEIDOSCOPE', clock = { bpm: 112 }, camera = 'calm', res = 1, budgetMs = 8, maxFps = 20, vorlaufS = 4,
  ungespiegelt, schriften = true, schriftManifest = null, darsteller = true, schriftPool = null, raum = null } = {}) {
  const A = ARTEN[art] || ARTEN.fassade, ASP = aspect || A.aspect;
  const cfg = { art, aspect: ASP, intents: intents || A.intents, palette, seed, ctx, clock, camera, res, budgetMs, maxFps, vorlaufS, ungespiegelt: ungespiegelt ?? A.ungespiegelt, ebenen, raum };
  const H = wirt({ quellen, erlaubt, material, worker, schriften, schriftManifest, darsteller, schriftPool }); H.n++; const id = 'f' + (++H.idz || (H.idz = 1));
  const RES = res === 2 ? 2 : 1, canvas = document.createElement('canvas'); canvas.width = 1024 * RES; canvas.height = Math.round(1024 * RES / ASP);
  const g = canvas.getContext('2d', { willReadFrequently: true });
  let texture = null;
  if (three) { texture = new three.CanvasTexture(canvas); texture.colorSpace = three.SRGBColorSpace; texture.generateMipmaps = false; texture.minFilter = three.LinearFilter; }
  const info = { art, ready: false, uploads: 0, owners: 1, width: canvas.width, height: canvas.height, res: RES, pool: 0, audioContexts: 0, error: null, pause: false,
    modus: null, msUpdate: 0, msBild: 0, bilder: 0, zeit: 0, shot: null, beschreibung: { art, kruemmung: A.kruemmung, blick: A.blick, aspect: ASP } };
  const ring = ebenen && three && gl ? createRing(three, gl) : null;
  let disposed = false, paused = false, zeit = 0, F = null, W = false, wartet = false, offen = null, lastPost = -1e9, vorfuellFertig = null, pruef = null;

  const zeichne = b => { g.drawImage(b, 0, 0, canvas.width, canvas.height); if (texture) texture.needsUpdate = true; info.uploads++; info.ready = true; };
  const mittel = (k, v) => { info[k] += (v - info[k]) / Math.min(info.bilder || 1, 30); };
  const nachricht = m => {
    if (disposed) { if (m.bmp) m.bmp.close(); return; }
    if (m.typ === 'fehler') { info.error = m.text; wartet = false; return; }
    if (m.typ === 'bild') { if (offen) offen.bmp.close(); offen = m; wartet = false; mittel('msBild', m.ms); return; }
    if (m.typ === 'leer') { wartet = false; return; }
    if (m.typ === 'ring') { zeichne(m.bmp); m.bmp.close(); ring?.aufnehmen(texture, m.meta); vorfuellFertig?.schritt?.(m.fortschritt); return; }
    if (m.typ === 'vorgefuellt') { zeit = m.zeit; vorfuellFertig?.ok(m.fortschritt); vorfuellFertig = null; return; }
    if (m.typ === 'bildBei') { pruef?.(m.bmp); pruef = null; }
  };
  const bereit = H.bereit.then(() => {
    if (disposed) return;
    info.modus = H.modus; info.pool = H.pool; info.schriften = H.schriften; info.workerFehler = H.workerFehler; if (H.fehler) { info.error = H.fehler; return; }
    if (H.W) { W = true; H.handler.set(id, nachricht); H.post({ typ: 'neu', id, cfg }); }
    else F = flaeche(H.inst, cfg);
  });

  function update(dt, { reduced = false } = {}) {
    if (disposed || (!F && !W) || !info.pool) return;
    const a = performance.now();
    try {
      info.pause = paused; if (paused) return;
      zeit += dt; info.zeit = zeit;
      if (W) {
        if (offen) { const m = offen; offen = null;   // das letzte Bild des alten Shots steht noch auf der Fläche: erst in den Ring, dann das neue Bild
          if (m.vor) ring?.aufnehmen(texture, m.vor); zeichne(m.bmp); m.bmp.close(); info.shot = m.sh; info.bilder++; }
        if (reduced && info.ready) return;
        if (!wartet && !vorfuellFertig && zeit - lastPost >= 1 / maxFps - 1e-6) { H.post({ typ: 'tick', id, zeit }); wartet = true; lastPost = zeit; }
        return;
      }
      if (reduced && info.ready) return;
      const r = F.tick(zeit); if (!r) return;
      if (r.vor) ring?.aufnehmen(texture, r.vor);
      zeichne(r.c); info.shot = r.sh; info.bilder++; info.msBild = F.L.stats.msMittel;
    } catch (e) { info.error = String(e && e.message || e); }
    finally { mittel('msUpdate', performance.now() - a); }
  }

  // Vorfüllen (Ladebildschirm): Ring-Bilder direkt an ihrem Zeitpunkt; danach läuft die Fläche ab dem nächsten Shot weiter
  async function vorfuellen({ onFortschritt = null, maxS = EBENEN.VORFUELL_MAX_S } = {}) {
    await bereit; if (!ring || disposed) return 1;
    if (W) return new Promise(ok => { vorfuellFertig = { ok, schritt: onFortschritt }; H.post({ typ: 'vorfuellen', id, maxS }); });
    if (!F) return 1;
    const gen = F.vorfuellen(maxS); let s = gen.next();
    while (!s.done && !disposed) { zeichne(s.value.c); ring.aufnehmen(texture, s.value.meta); onFortschritt?.(s.value.fortschritt); await naechstesBild(); s = gen.next(); }
    zeit = s.value; return F.buch.fortschritt;
  }

  return { texture, canvas, info, ring, bereit, update, vorfuellen,
    pause() { paused = true; info.pause = true; }, resume() { paused = false; info.pause = false; },
    // Zeit der Fläche setzen (z. B. Boden übernimmt die Zeit der Fassade, damit der Fluss weiterläuft)
    setZeit(t) { zeit = t; info.zeit = t; }, get zeit() { return zeit; },
    // Ereignis zur Laufzeit (Bresche, Biom, Kontext): t0/t1 und show-Zeiten in Sekunden ab jetzt
    add(it) { if (W) { H.post({ typ: 'add', id, it }); return true; } if (!F) return false; F.add(it); return true; },
    // Farbe/Heilen (W-007 Punkt 3, „Viertel wird bunt“): ab jetzt in `ueber` s zu `wert` (0 grau, 1 wie H15, 2 sehr bunt), z. B. je gesammeltem Fluff höher
    setFarbe(wert, { ueber = 1.5 } = {}) { info.farbe = wert; if (W) { H.post({ typ: 'farbe', id, wert, ueber }); return true; } if (!F) return false; F.farbe(wert, { ueber }); return true; },
    // Prüfung: Bild zur Zeit t als ImageBitmap (Worker) bzw. Canvas (Hauptfaden)
    bildBei(t) { if (W) return new Promise(ok => { pruef = ok; H.post({ typ: 'bildBei', id, zeit: t }); }); return Promise.resolve(F.render(t)); },
    get timeline() { return F ? F.timeline : null; },
    dispose() { if (disposed) return; disposed = true; if (W) { H.post({ typ: 'weg', id }); H.handler.delete(id); } offen?.bmp.close(); ring?.dispose(); texture?.dispose(); H.frei(); } };
}
export const createFassade = (opts = {}) => createFlaeche(Object.assign({}, opts, { art: 'fassade' }));

// Shot-Gedächtnis (V-1500): Atlas aus RING Ebenen (4 Spalten), Kopie per copyTextureToTexture aus der Fassaden-Fläche, kein Zurücklesen.
// Welche Shots hineindürfen, entscheidet die Ring-Buchführung in flaeche.mjs (im Worker oder im Hauptfaden).
function createRing(three, gl) {
  const R = EBENEN.RING, C = EBENEN.SPALTEN, rows = Math.ceil(R / C), atlas = new three.DataTexture(null, 1024 * C, 512 * rows);
  atlas.flipY = true; atlas.colorSpace = three.SRGBColorSpace; atlas.minFilter = atlas.magFilter = three.LinearFilter; atlas.generateMipmaps = false; atlas.needsUpdate = true;
  const t = new Float32Array(R).fill(-1e3), typ = new Array(R).fill(''), txt = new Array(R).fill(''), bld = new Array(R).fill(''), pos = new three.Vector2();
  let next = 0, filled = 0, face = null, klein = null;
  const R_ = { texture: atlas, t, typ, txt, bld, get filled() { return filled; }, get redact() { return typ.indexOf('REDACT'); }, get next() { return next; }, get fortschritt() { return filled / R; },
    aufnehmen(src, meta) {
      let q = src.image;
      if (q.width !== 1024 || q.height !== 512) { klein = klein || Object.assign(document.createElement('canvas'), { width: 1024, height: 512 }); klein.getContext('2d').drawImage(q, 0, 0, 1024, 512); q = klein; }   // Ebene bleibt 1024 × 512
      // Quelle vor jeder Kopie neu hochladen (sonst kopiert copyTextureToTexture den zuerst hochgeladenen Stand, V-1500)
      if (!face || face.image !== q) { face = new three.Texture(q); face.flipY = true; face.generateMipmaps = false; face.minFilter = three.LinearFilter; }
      face.needsUpdate = true;
      try { const i = next, c = i % C, r = Math.floor(i / C); pos.set(c * 1024, r * 512);
        gl.copyTextureToTexture(face, atlas, null, pos);
        t[i] = performance.now() / 1000; typ[i] = meta.type; txt[i] = meta.text; bld[i] = meta.plate;
        next = (next + 1) % R; filled = Math.min(R, filled + 1);
      } catch (e) { R_.error = String(e); } },
    dispose() { atlas.dispose(); face?.dispose?.(); } };
  return R_;
}

// Eine Fläche für alle Viertel (Georg q508): update je Bild nur einmal, Freigabe mit dem letzten Viertel
let SHARED = null;
export function sharedFassade(opts = {}) {
  if (!SHARED) SHARED = { e: createFassade(opts), n: 0, t: -1 };
  const S = SHARED; S.n++; let alive = true;
  return { texture: S.e.texture, canvas: S.e.canvas, info: S.e.info, ring: S.e.ring, bereit: S.e.bereit, pause: S.e.pause, resume: S.e.resume, add: S.e.add,
    update(dt, o) { const now = performance.now(); if (now - S.t < 4) return; S.t = now; S.e.update(dt, o); },
    dispose() { if (!alive) return; alive = false; if (--S.n <= 0) { S.e.dispose(); if (SHARED === S) SHARED = null; } } };
}

// Die eine früh angelegte Fläche für Ladebildschirm und erstes Viertel (wie fassadeEngine/fassadeVorfuellen in cascade/r4)
let VORRAT = null;
export const fassadeEngine = opts => VORRAT || (VORRAT = sharedFassade(Object.assign({ ebenen: true }, opts)));
export function fassadeVorfuellen(opts = {}, { onFortschritt = null } = {}) {
  fassadeEngine(opts);
  return SHARED ? SHARED.e.vorfuellen({ onFortschritt }) : Promise.resolve(1);
}

// Boden der Kartenhaus-Ruine (W-007 Punkt 2, Q-118): eigene Fläche im selben Kern. Standard: setzt den Fluss der Fassade fort
// (gleiche Absichten, Seed und Uhr; übernimmt deren Zeit), quadratisch. { ruhig: true } nimmt BODEN_RUHIG statt der Fortsetzung.
export function bodenFlaeche(fassade, opts = {}) {
  const B = createFlaeche(Object.assign({ art: 'boden' }, opts, opts.ruhig ? { intents: BODEN_RUHIG } : {}));
  if (fassade && fassade.info) B.bereit.then(() => B.setZeit(fassade.info.zeit));
  return B;
}
