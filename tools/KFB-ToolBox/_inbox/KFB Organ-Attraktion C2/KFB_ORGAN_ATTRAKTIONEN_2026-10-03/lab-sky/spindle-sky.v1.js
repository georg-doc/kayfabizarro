/* KFB · SKY1 · kfb.environment.spindle-sky/0.1-candidate
 * Hülle um die UNVERÄNDERTEN Combat-Donoren (KFB-Combat-Arena@735b5449bf09, branch wsa/ca2-kaykit-prep-2026-09-20):
 *   _handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/{himmel.v4.js (Zylinder, 6 Kartenmotive, Trichter unten, Dunst), spindel.v4.js (Kuppel oben, See, Glut, Deckungsmessung C29)}
 * Beide Dateien liegen byte-gleich im Projekt (github_copy_files), keine Zeile geändert, keine Rekonstruktion.
 * Lifecycle (SKY_01): mount(parent, ctx) · setPreset · setPalette · update(dt, signals) · probe() · dispose().
 * Das Modul besitzt nur seine Meshes/Materialien. Host: Scene, Kamera, Renderer, Uhr, Nebel, Licht. `farbeLesen` bekommt KEINE Scene (der Donor würde sonst `scene.fog` schreiben = zweiter Fog-Writer).
 * Donor-Eigenheit: spindel.v4 misst die Deckung in Weltkoordinaten von der Spielpose (0, 5,9, 0). Die Hülle skaliert/verschiebt die Gruppe mit der Kamera, darum misst probe() mit normalisierter Gruppe und einer
 *   Pose-Kamera (46°, far 120) wie in der Combat-Arena; die interne Zwei-Sekunden-Messung des Donors wird abgeschaltet (`_messZeit`), weil sie in der skalierten Gruppe falsch messen würde. */
const base = import.meta.url;
const HIMMEL = new URL('../_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/himmel.v4.js', base).href;
const SPINDEL = new URL('../_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/spindel.v4.js', base).href;
export const CONTRACT = 'kfb.environment.spindle-sky/0.1-candidate';
export const SOURCES = { himmel: 'himmel.v4.js (blob 5f5253ac7e20)', spindel: 'spindel.v4.js (blob 01612b2653ad)', repo: 'georg-doc/KFB-Combat-Arena@735b5449bf09' };

const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + p.split('/').map(encodeURIComponent).join('/');
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs', PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';
const pageCache = new Map();
/* Kartenbild nach dem Vertrag card-art-2d.js (quarter-page): Seite rendern, Himmel schneidet das Viertel q selbst. Kein Ersatzbild. */
export async function loadCards({ packId = 'forget_utopia', ns = [1, 2, 3, 4, 5, 6], onNote = () => {} } = {}) {
  const reg = await (await fetch(RAW('media/kfb/index.json'))).json(), deck = (reg.decks || []).find(d => d.packId === packId);
  if (!deck || !deck.pdf) throw new Error('SOURCE_REQUIRED: Deck ' + packId + ' nicht in media/kfb/index.json');
  const lib = await import(/* @vite-ignore */ PDFJS);
  if (!loadCards._w) loadCards._w = URL.createObjectURL(new Blob([await (await fetch(PDFJS_WORKER)).text()], { type: 'text/javascript' }));
  lib.GlobalWorkerOptions.workerSrc = loadCards._w;
  const doc = await lib.getDocument({ url: reg.baseUrl + '/' + encodeURIComponent(deck.pdf) }).promise, off = deck.coverOffset != null ? deck.coverOffset : 1, out = [];
  for (const n of ns) {
    const num = off + 1 + Math.floor((n - 1) / 4), q = (n - 1) % 4, key = packId + '#' + num;
    if (!pageCache.has(key)) { onNote('Karte ' + n + ' · Seite ' + num); const page = await doc.getPage(num), vp0 = page.getViewport({ scale: 1 }), vp = page.getViewport({ scale: 1400 / vp0.width }), cv = document.createElement('canvas');
      cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height); await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise; pageCache.set(key, cv); }
    out.push({ n, q, page: num, canvas: pageCache.get(key), packId, title: deck.title });
  }
  return out;
}

export function createSpindleSky({ THREE }) {
  let hi = null, sp = null, group = null, ctx = null, poseCam = null, cards = [], last = null, tMeas = 0, mounted = false;
  const normalised = fn => { const s = group.scale.x, p = group.position.clone(); group.scale.setScalar(1); group.position.set(0, 0, 0); group.updateMatrixWorld(true);
    try { return fn(); } finally { group.scale.setScalar(s); group.position.copy(p); group.updateMatrixWorld(true); } };
  const self = {
    contract: CONTRACT, get mounted() { return mounted; }, get group() { return group; },
    async mount(parent, c) {
      ctx = c; cards = c.cards || [];
      if (cards.length !== 6) throw new Error('SOURCE_REQUIRED: sechs echte Kartenmotive nötig, ' + cards.length + ' geliefert');
      const [{ default: Himmel }, { default: Spindel }] = await Promise.all([import(HIMMEL), import(SPINDEL)]);
      group = new THREE.Group(); group.name = 'spindle-sky'; group.scale.setScalar(c.scale || 1); parent.add(group);
      hi = new Himmel({ THREE, an: true, log: () => {} }); hi.mount(group);
      cards.forEach((k, i) => hi.fuellen(i, k.canvas, k.q));
      hi.farbeLesen(null, null);
      poseCam = new THREE.PerspectiveCamera(46, 16 / 9, 0.05, 120); poseCam.position.set(0, 5.9, 0); poseCam.rotation.order = 'YXZ'; poseCam.rotation.x = -37 * Math.PI / 180; poseCam.updateMatrixWorld(true); poseCam.updateProjectionMatrix();
      hi._kam = poseCam;
      sp = new Spindel({ THREE, camera: poseCam, see: c.see || 'wirbel', oben: c.oben || 'aus', log: () => {} });
      if (!sp.bauen(hi)) throw new Error('Spindel.bauen(): Himmel unvollständig');
      sp._messZeit = 1e9;
      mounted = true; return group;
    },
    setPreset(p = {}) { if (p.see != null) sp.setSee('unten', p.see); if (p.oben != null) sp.setSee('oben', p.oben); if (p.groesse != null) sp.setGroesse(p.groesse); },
    setPalette(p = {}) { for (const m of [sp.seeM, sp.seeOben]) if (m && m.material.uniforms) { if (p.heiss) m.material.uniforms.uHeiss.value.set(p.heiss); if (p.glut) m.material.uniforms.uGlut.value.set(p.glut); } },
    pinned: false,
    follow(camera) { if (group && !self.pinned) group.position.set(camera.position.x, camera.position.y - 5.9 * group.scale.x, camera.position.z); },
    update(dt, sig = {}) {
      if (!mounted) return; sp.update(dt); hi.update(dt);
      const k = sig.brightness != null ? sig.brightness : 1; hi.mat.color.setRGB(k, k, k); if (hi.matTrichter) hi.matTrichter.color.setRGB(k, k, k);
      if ((tMeas += dt) > 2) { tMeas = 0; self.measure(); }
    },
    measure() { return last = normalised(() => { sp.camera = poseCam; sp._messZeit = -99; sp._deckungMessen(); sp._messZeit = 1e9; return sp.tor(); }); },
    probe() {
      if (!mounted) return { contract: CONTRACT, mounted: false };
      const m = self.measure(), meshes = []; group.traverse(o => { if (o.isMesh) meshes.push(o); });
      const tris = meshes.reduce((a, o) => a + (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3, 0);
      const mats = new Set(meshes.map(o => o.material)), himmel = normalised(() => hi.probe()), spi = sp.probe();
      return { contract: CONTRACT, mounted: true, meshes: meshes.map(o => o.name), tris: Math.round(tris), materials: mats.size, tor: m, himmel: { belegt: himmel.belegt, motive: himmel.motive, atlas: himmel.atlas, abweichung: himmel.abweichung, radius: himmel.radius, hoehe: himmel.hoehe, reihen: himmel.reihen, deckung: himmel.deckung },
        spindel: { kuppel: spi.kuppel, kuppelTiefe: spi.kuppelTiefe, seeUnten: spi.seeUnten, seeOben: spi.seeOben, glut: spi.glut, deckung: spi.deckung }, cards: cards.map(k => ({ n: k.n, page: k.page, quadrant: k.q, deck: k.packId })) };
    },
    dispose() {
      if (!mounted) return; mounted = false;
      sp.aus(); hi.dispose(); group.removeFromParent(); group = null; hi = null; sp = null; poseCam = null;
    }
  };
  return self;
}
