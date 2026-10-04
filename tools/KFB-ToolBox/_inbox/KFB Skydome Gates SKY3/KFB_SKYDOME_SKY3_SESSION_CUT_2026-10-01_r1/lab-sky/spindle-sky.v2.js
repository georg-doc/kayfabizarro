/* KFB · SKY1 · kfb.environment.spindle-sky/0.2-candidate — wie v1 (Hülle um die UNVERÄNDERTEN Combat-Donoren himmel.v4.js + spindel.v4.js), dazu die Spitzen.
 * Befund (Georg 01.10., Bildschirmfoto 11.41.53, Blick nach oben): Kuppel und Trichter sind Halbkugeln mit der Mantel-Textur. Zum Pol laufen alle u-Spalten auf EINEN Punkt zusammen —
 *   die Karten werden zu Strahlen verzogen, die Mitte ist ein Nadelstern. Das ist Geometrie (Kugelkoordinaten), nicht Textur: mehr Reihen oder ein Deckel verschieben nur die Grenze.
 * Lösung v2 (in der Hülle, Donoren unberührt): je Spitze ein POLKAPPE-Netz auf derselben Ellipsoidfläche (R, Stauchung 0,9, Äquator auf der Mantelkante), aber PLANAR von oben
 *   abgebildet — planare Abbildung hat am Pol keine Singularität. Ihr Bild ist eine Kartenrosette aus denselben sechs Kartenmotiven (aufrecht zum Pol gedreht), Tuschringe im
 *   Kartenkanon (#1a1614), in der Mitte ein Okulus. Am Rand ein Tuschrahmen wie die Kartenkanten (Pixelaufnahme 1: ein weicher Auslauf über der verzogenen Kuppel las als Schmierband), danach 2 % Auslauf.
 *   Unten: dieselbe Rosette, der See (Donor) liegt darüber; ein Tuschkragen sitzt am Seerand und fasst die weiche Seekante.
 *   Zeichenfolge: Kappe im OPAKEN Durchgang (transparent false + CustomBlending), renderOrder −799 nach Mantel/Kuppel (−800), ohne Tiefentest/-schreiben — wie die Donoren selbst.
 *   Die Welt zeichnet danach normal darüber; der See (transparente Warteschlange) liegt über der Kappe. */
import { loadCards, CONTRACT as CONTRACT_V1, SOURCES } from './spindle-sky.v1.js';
export { loadCards, SOURCES };
const base = import.meta.url;
const HIMMEL = new URL('../_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/himmel.v4.js', base).href;
const SPINDEL = new URL('../_handover/A2_CARDS/inputs/cards_4b/combat-arena-v4/spindel.v4.js', base).href;
export const CONTRACT = 'kfb.environment.spindle-sky/0.2-candidate';
export const CAP = { theta: 58, fadeIn: 0.915, fadeOut: 0.94, frame: 0.905, stauch: 0.9, ink: '#1a1614', mirror: true };

function capCanvas(cards, basis, which, lakeR) {
  const N = 1024, cv = document.createElement('canvas'); cv.width = cv.height = N; const g = cv.getContext('2d'), c = N / 2;
  const b = basis || [58, 48, 40], rgb = (k, a = 1) => 'rgba(' + Math.round(b[0] * k) + ',' + Math.round(b[1] * k) + ',' + Math.round(b[2] * k) + ',' + a + ')';
  g.save(); if (CAP.mirror) { g.translate(N, 0); g.scale(-1, 1); }
  const bg = g.createRadialGradient(c, c, 0, c, c, c); bg.addColorStop(0, rgb(0.7)); bg.addColorStop(0.45, rgb(1.0)); bg.addColorStop(1, rgb(1.12)); g.fillStyle = bg; g.fillRect(0, 0, N, N);
  /* Kartenrosette: sechs Motive, Oberkante zur Mitte (beim Blick in die Spitze steht die Karte so wie am Mantel darunter) */
  const ringR = which === 'top' ? 0.585 * c : 0.70 * c, cw = which === 'top' ? 0.46 * c : 0.36 * c;
  cards.forEach((k, i) => {
    const s = k.canvas, hw = Math.floor(s.width / 2), hh = Math.floor(s.height / 2), sx = (k.q % 2) * hw, sy = (k.q < 2 ? 0 : 1) * hh, ch = cw * hh / hw, a = (i / cards.length) * Math.PI * 2;
    g.save(); g.translate(c + Math.cos(a) * ringR, c + Math.sin(a) * ringR); g.rotate(a + (which === 'top' ? Math.PI / 2 : -Math.PI / 2));
    g.drawImage(s, sx, sy, hw, hh, -cw / 2, -ch / 2, cw, ch); g.lineWidth = 5; g.strokeStyle = CAP.ink; g.strokeRect(-cw / 2, -ch / 2, cw, ch); g.restore();
  });
  const ring = (r, w) => { g.beginPath(); g.arc(c, c, r, 0, Math.PI * 2); g.lineWidth = w; g.strokeStyle = CAP.ink; g.stroke(); };
  const ticks = (r0, r1, n, w) => { g.lineWidth = w; g.strokeStyle = CAP.ink; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; g.beginPath(); g.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0); g.lineTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1); g.stroke(); } };
  if (which === 'top') {
    const o = 0.24 * c, og = g.createRadialGradient(c, c, 0, c, c, o); og.addColorStop(0, rgb(0.18)); og.addColorStop(1, rgb(0.42));
    g.beginPath(); g.arc(c, c, o, 0, Math.PI * 2); g.fillStyle = og; g.fill(); ring(o, 9); ring(o + 16, 3); ticks(o + 16, o + 34, 48, 3); ticks(o + 16, o + 52, 6, 6);
  } else {
    const r = lakeR * c; ring(r * 1.03, 7); ring(r * 1.03 + 16, 3); ticks(r * 1.03 + 16, r * 1.03 + 34, 60, 3);
  }
  ring(CAP.frame * c, 8); ring(CAP.frame * c - 14, 2.5);
  g.restore();
  /* Rand: Tuschrahmen wie die Kartenkante, danach kurz auslaufen (kein Schmierband über der verzogenen Kuppel): Deckung läuft vor der Kugelverzerrung aus */
  g.globalCompositeOperation = 'destination-in'; const m = g.createRadialGradient(c, c, CAP.fadeIn * c, c, c, CAP.fadeOut * c); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(0, 0, N, N);
  return cv;
}

function makeCap(THREE, hi, which, cards, lakeF) {
  const R = hi.radius * 0.999, th = CAP.theta * Math.PI / 180, rho = hi.radius * Math.sin(th);
  const geo = which === 'top' ? new THREE.SphereGeometry(R, 96, 14, Math.PI / 2, Math.PI * 2, 0, th) : new THREE.SphereGeometry(R, 96, 14, Math.PI / 2, Math.PI * 2, Math.PI - th, th);
  geo.scale(1, CAP.stauch, 1);
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, 0.5 + p.getX(i) / (2 * rho), 0.5 + (which === 'top' ? -1 : 1) * p.getZ(i) / (2 * rho));
  uv.needsUpdate = true;
  const cv = capCanvas(cards, hi.basis, which, lakeF * hi.radius / rho), tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, toneMapped: false, fog: false, depthTest: false, depthWrite: false, transparent: false,
    blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor });
  const m = new THREE.Mesh(geo, mat); m.name = 'spindel-polkappe-' + (which === 'top' ? 'oben' : 'unten'); m.position.y = (which === 'top' ? 1 : -1) * hi.hoehe / 2; m.renderOrder = -799; m.frustumCulled = false;
  hi.mesh.add(m); return { mesh: m, tex, mat, geo, rho: +rho.toFixed(2), theta: CAP.theta };
}

export function createSpindleSky({ THREE }) {
  let hi = null, sp = null, group = null, ctx = null, poseCam = null, cards = [], last = null, tMeas = 0, mounted = false, caps = [], capsOn = true;
  const normalised = fn => { const s = group.scale.x, p = group.position.clone(); group.scale.setScalar(1); group.position.set(0, 0, 0); group.updateMatrixWorld(true);
    try { return fn(); } finally { group.scale.setScalar(s); group.position.copy(p); group.updateMatrixWorld(true); } };
  const self = {
    contract: CONTRACT, base: CONTRACT_V1, get mounted() { return mounted; }, get group() { return group; }, get caps() { return caps; },
    async mount(parent, c) {
      ctx = c; cards = c.cards || [];
      if (cards.length !== 6) throw new Error('SOURCE_REQUIRED: sechs echte Kartenmotive nötig, ' + cards.length + ' geliefert');
      const [{ default: Himmel }, { default: Spindel, SPEC }] = await Promise.all([import(HIMMEL), import(SPINDEL)]);
      group = new THREE.Group(); group.name = 'spindle-sky'; group.scale.setScalar(c.scale || 1); parent.add(group);
      hi = new Himmel({ THREE, an: true, log: () => {} }); hi.mount(group);
      cards.forEach((k, i) => hi.fuellen(i, k.canvas, k.q));
      hi.farbeLesen(null, null);
      poseCam = new THREE.PerspectiveCamera(46, 16 / 9, 0.05, 120); poseCam.position.set(0, 5.9, 0); poseCam.rotation.order = 'YXZ'; poseCam.rotation.x = -37 * Math.PI / 180; poseCam.updateMatrixWorld(true); poseCam.updateProjectionMatrix();
      hi._kam = poseCam;
      sp = new Spindel({ THREE, camera: poseCam, see: c.see || 'wirbel', oben: c.oben || 'aus', log: () => {} });
      if (!sp.bauen(hi)) throw new Error('Spindel.bauen(): Himmel unvollständig');
      sp._messZeit = 1e9;
      const f = sp.f || (SPEC && SPEC.seeF) || 0.8;
      caps = [makeCap(THREE, hi, 'top', cards, f), makeCap(THREE, hi, 'bottom', cards, f)];
      self.setCaps(c.caps !== false);
      mounted = true; return group;
    },
    setCaps(on) { capsOn = !!on; for (const k of caps) k.mesh.visible = capsOn; },
    get capsOn() { return capsOn; },
    setPreset(p = {}) { if (p.see != null) sp.setSee('unten', p.see); if (p.oben != null) sp.setSee('oben', p.oben); if (p.groesse != null) sp.setGroesse(p.groesse); },
    setPalette(p = {}) { for (const m of [sp.seeM, sp.seeOben]) if (m && m.material.uniforms) { if (p.heiss) m.material.uniforms.uHeiss.value.set(p.heiss); if (p.glut) m.material.uniforms.uGlut.value.set(p.glut); } },
    pinned: false,
    follow(camera) { if (group && !self.pinned) group.position.set(camera.position.x, camera.position.y - 5.9 * group.scale.x, camera.position.z); },
    update(dt, sig = {}) {
      if (!mounted) return; sp.update(dt); hi.update(dt);
      const k = sig.brightness != null ? sig.brightness : 1; hi.mat.color.setRGB(k, k, k); if (hi.matTrichter) hi.matTrichter.color.setRGB(k, k, k); for (const c of caps) c.mat.color.setRGB(k, k, k);
      if ((tMeas += dt) > 2) { tMeas = 0; self.measure(); }
    },
    measure() { return last = normalised(() => { sp.camera = poseCam; sp._messZeit = -99; sp._deckungMessen(); sp._messZeit = 1e9; return sp.tor(); }); },
    probe() {
      if (!mounted) return { contract: CONTRACT, mounted: false };
      const m = self.measure(), meshes = []; group.traverse(o => { if (o.isMesh) meshes.push(o); });
      const tris = meshes.reduce((a, o) => a + (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3, 0);
      const mats = new Set(meshes.map(o => o.material)), himmel = normalised(() => hi.probe()), spi = sp.probe();
      return { contract: CONTRACT, mounted: true, meshes: meshes.map(o => o.name), tris: Math.round(tris), materials: mats.size, tor: m, himmel: { belegt: himmel.belegt, motive: himmel.motive, atlas: himmel.atlas, abweichung: himmel.abweichung, radius: himmel.radius, hoehe: himmel.hoehe, reihen: himmel.reihen, deckung: himmel.deckung },
        spindel: { kuppel: spi.kuppel, kuppelTiefe: spi.kuppelTiefe, seeUnten: spi.seeUnten, seeOben: spi.seeOben, glut: spi.glut, deckung: spi.deckung }, cards: cards.map(k => ({ n: k.n, page: k.page, quadrant: k.q, deck: k.packId })),
        kappen: { an: capsOn, theta: CAP.theta, rand: CAP.fadeIn + '–' + CAP.fadeOut, rho: caps.map(c => c.rho), abbildung: 'planar (polfrei)' } };
    },
    dispose() {
      if (!mounted) return; mounted = false;
      for (const c of caps) { c.mesh.removeFromParent(); c.geo.dispose(); c.mat.dispose(); c.tex.dispose(); } caps = [];
      sp.aus(); hi.dispose(); group.removeFromParent(); group = null; hi = null; sp = null; poseCam = null;
    }
  };
  return self;
}
