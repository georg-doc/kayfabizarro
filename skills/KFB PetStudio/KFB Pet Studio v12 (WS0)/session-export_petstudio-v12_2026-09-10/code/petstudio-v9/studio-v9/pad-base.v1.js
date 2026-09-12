/* KFB Pet Studio v9 — DIE BASE ALS BAUTEIL.  pbase-v1.0
 *
 * GEORGS AUFTRAG (27.8.): »jedes Pad hat eine graue Base · die Base hält den Schatten · die Base ist
 * Empfänger von AO und anderen VFX · Klick auf das Pad reagiert.«
 *
 * WAS HIER NICHT PASSIERT: ein zweiter Boden. `ground-plane.v1.js` besitzt die Platte, den Stempel
 * und die Kippung — dieses Modul SCHMÜCKT sie. Es hält keine eigene Meinung über »unten«, keine
 * zweite Schattenrechnung und keine zweite Kachelgrösse. Zwei Anlagen für dieselbe Fläche standen
 * schon einmal gegeneinander (ABGLEICH podcast-v5/studio-v7 §3), und die Nacht war teuer.
 *
 * VIER SCHICHTEN, VON UNTEN NACH OBEN, MIT IHRER renderOrder:
 *   0  Platte            — ground-plane, `plane`
 *   1  Boden-FX          — ground-plane, `addFx` (Klick-Ring, Landestaub)
 *   1  Kachelkante       — HIER: die Tusche-Umrandung der Messfläche
 *   1  Kontaktsaum (AO)  — HIER: der dunkle Saum direkt am Fuss
 *   2  Schattenstempel   — ground-plane, `shadow`
 *
 * DER SAUM IST KEIN SCHATTEN. Der Stempel sagt, welche FORM auf dem Boden liegt; der Saum sagt,
 * wo etwas den Boden BERÜHRT. Zwei Aussagen, zwei Ebenen — deshalb hängt der Saum am gemessenen
 * Fussradius (`pet.ground.foot`) und nicht an der Silhouette. Der Fuss ist nicht die Silhouette,
 * das steht seit v8 in `ground-contract.v1.js`.
 *
 * DIE KACHELKANTE IST TUSCHE, KEINE CAD-LINIE. Ein `strokeRect` hat ringsum dieselbe Breite —
 * Georgs »dead line«-Befund vom 24.8. Also moduliert über die Lage: Licht oben links, also wird die
 * Linie unten und rechts satter. Dieselbe Regel wie am Kartenrand und an der Bubble.
 */

export const version = 'pbase-v1.0';

export const DEF = {
  ao: 0, aoWidth: 0.55, ink: true, inkPen: 2.6, ring: 0.42,
  inkColor: '#1f1a14', aoColor: '#1f1a14',
  res: 256,
  seamRes: 512,   // eigene Aufloesung: 128 px hochskaliert gaben sichtbare Stufen am Rand
};

/** Radialer Saum: aussen nichts, am Innenrand satt. Weiss, weil `alphaMap` den GRÜNKANAL liest —
 *  eine schwarze Maske heisst Alpha 0, und der Saum wäre unsichtbar (am 25.8. genau so passiert).
 *
 *  ⚠ DIESE FLÄCHE IST KEIN SCHATTEN. Sie sagt, wo etwas den Boden BERÜHRT; der Schattenstempel in
 *  `ground-plane.v1.js` sagt, welche FORM auf ihm liegt. Georgs Befund vom 27.8. war, dass man den
 *  Unterschied im Bild nicht sieht — also steht er ab jetzt im NAMEN und in `userData`, damit ihn
 *  auch ein fremder Leser (Mensch oder Maschine) nicht übersieht. Dazu 512 px statt 128 und eine
 *  weiche Rampe in vier Stufen: hochskalierte 128 px gaben ausgefaserte, pixelige Ränder, und ein
 *  ausgefaserter Rand sieht aus wie ein schlecht gerechneter Schatten. */
function seamTex(width, res) {
  const R = Math.max(128, res || DEF.seamRes);
  const cv = document.createElement('canvas'); cv.width = cv.height = R;
  const g = cv.getContext('2d');
  const w = Math.max(0.06, Math.min(0.95, width == null ? DEF.aoWidth : width));
  const h = R / 2;
  const inner = 0.5 * (1 - w);           // 0,5 ist der Rand der Textur
  const grd = g.createRadialGradient(h, h, Math.max(1, inner * R), h, h, h);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.34, 'rgba(255,255,255,.72)');
  grd.addColorStop(0.62, 'rgba(255,255,255,.34)');
  grd.addColorStop(0.84, 'rgba(255,255,255,.10)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, R, R);
  return cv;
}

/**
 * Die Kante der Messfläche als Tuschband. Gezeichnet als BAND zwischen zwei Offsetkurven, nicht als
 * `stroke` — dieselbe Bauart wie `paintBubble` im Shaper, damit es EINE Feder im Haus gibt.
 * Der Radius der Ecken ist ein Anteil der Kante, keine Pixelzahl: die Kachel wird skaliert.
 */
function edgeTex(res, pen, radius, seed) {
  const R = Math.max(64, res || DEF.res);
  const cv = document.createElement('canvas'); cv.width = cv.height = R;
  const g = cv.getContext('2d');
  const m = R * 0.10, s = R - m * 2;
  const rr = Math.max(2, (radius == null ? 0.06 : radius) * s);
  const P = Math.max(1, (pen == null ? DEF.inkPen : pen) * R / 256);
  /* Ein Rechteck als Punktzug, damit die Feder es wie jede andere Silhouette behandelt. */
  const pts = [];
  const corner = (cx, cy, a0, a1) => { for (let i = 0; i <= 6; i++) { const a = a0 + (a1 - a0) * i / 6; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } };
  corner(m + rr, m + rr, Math.PI, Math.PI * 1.5);
  corner(m + s - rr, m + rr, Math.PI * 1.5, Math.PI * 2);
  corner(m + s - rr, m + s - rr, 0, Math.PI * 0.5);
  corner(m + rr, m + s - rr, Math.PI * 0.5, Math.PI);
  /* Licht oben links: die Halbbreite wächst mit der Projektion der Normale auf (LX,LY). */
  const LX = 0.62, LY = 0.78, ORIENT = 0.34;
  let rnd = (seed == null ? 7 : seed) * 9301 + 49297;
  const jit = () => { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280 - 0.5; };
  const N = pts.length;
  const half = pts.map((p, i) => {
    const a = pts[(i - 1 + N) % N], b = pts[(i + 1) % N];
    const tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1;
    const nx = ty / L, ny = -tx / L;
    return Math.max(P * 0.35, P * (1 + ORIENT * (nx * LX + ny * LY)) * (1 + jit() * 0.18));
  });
  const off = (sign) => pts.map((p, i) => {
    const a = pts[(i - 1 + N) % N], b = pts[(i + 1) % N];
    const tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty) || 1;
    return [p[0] + (ty / L) * half[i] * sign, p[1] + (-tx / L) * half[i] * sign];
  });
  const outer = off(1), inner = off(-1);
  g.fillStyle = '#fff';
  g.beginPath();
  g.moveTo(outer[0][0], outer[0][1]);
  for (let i = 1; i < N; i++) g.lineTo(outer[i][0], outer[i][1]);
  for (let i = N - 1; i >= 0; i--) g.lineTo(inner[i][0], inner[i][1]);
  g.closePath(); g.fill();
  return cv;
}

/**
 * @param {object} o THREE · scene · gnd (das Ergebnis von createGround)
 */
export function createPadBase(o) {
  const THREE = o.THREE, scene = o.scene, gnd = o.gnd;
  if (!THREE || !scene || !gnd) return null;
  const S = { ...DEF };
  let footR = 0.25, edge = 2.0;
  const at = new THREE.Vector3();

  const mk = (cv, col, op, order) => {
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.NoColorSpace;
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(col), alphaMap: tex, transparent: true,
      opacity: op, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = order;
    scene.add(mesh);
    return { mesh, mat, tex };
  };

  const seam = mk(seamTex(S.aoWidth, S.seamRes), S.aoColor, S.ao, 1);
  /* SELBSTAUSKUNFT IM SZENENGRAPH. Wer diese Fläche findet, findet mit ihr die Ansage, was sie ist
     und was sie NICHT ist — der einzige Weg, eine Verwechslung zu verhindern, die man im Bild nicht
     sehen kann. */
  seam.mesh.name = 'kfb-pad-contact-seam-NICHT-DER-SCHATTEN';
  seam.mesh.userData.kfb = {
    rolle: 'Kontaktsaum — sagt, WO etwas den Boden beruehrt',
    nichtRolle: 'kein Schatten. Der Schatten ist der Stempel `kfb-ground-shadow` in ground-plane.v1.js',
    standard: 'aus (ao 0). Wer ihn einschaltet, sieht ihn absichtlich.',
    quelle: 'Radius aus pet.ground.foot (gemessen in v8), nicht aus der Silhouette',
  };
  const ink = mk(edgeTex(S.res, S.inkPen, 0.06, 7), S.inkColor, 1, 1);
  ink.mesh.name = 'kfb-pad-edge';
  ink.mesh.userData.kfb = { rolle: 'Tuschekante der Messflaeche', hinweis: 'erscheint nur mit der Platte — ein Rand ohne Flaeche ist eine Behauptung' };

  /* Die Ebenen liegen IN der Fläche der Platte, also erben sie ihre Kippung geometrisch statt über
     eine zweite Zahl (die Regel, die den Boden in V3-S4 zwei Zeilen gekostet hat). */
  function follow() {
    const P = gnd.plane;
    P.updateMatrixWorld(true);
    const nrm = new THREE.Vector3(0, 0, 1).transformDirection(P.matrixWorld).normalize();
    for (const L of [seam, ink]) L.mesh.rotation.copy(P.rotation);
    const base = P.position;
    seam.mesh.position.copy(at).addScaledVector(nrm, 0.0026);
    ink.mesh.position.copy(base).addScaledVector(nrm, 0.0018);
    return nrm;
  }

  function update(m) {
    /* `m` ist der Bericht des Bodens (gnd.update()) plus Fussradius und Kachelkante. Dieses Modul
       MISST nichts selbst — es liest die Zahlen, die der Boden und der Vertrag schon haben. */
    if (m && m.footWorld) at.copy(m.footWorld);
    if (m && m.footR != null && m.footR > 0) footR = m.footR;
    if (m && m.edge != null && m.edge > 0) edge = m.edge;
    follow();
    const d = footR * 2 * (1 + (S.aoWidth == null ? DEF.aoWidth : S.aoWidth));
    seam.mesh.scale.set(d, d, 1);
    seam.mesh.visible = S.ao > 0.001;
    seam.mat.opacity = S.ao;
    ink.mesh.scale.set(edge * 1.25, edge * 1.25, 1);   // die Textur hat 10 % Rand je Seite
    /* DIE KANTE IST DER RAND EINER FLAECHE — ALSO GIBT ES SIE NUR, WENN ES DIE FLAECHE GIBT.
       Befund der Abnahme: die Platte stand auf `invisible` (Studio-Standard), die Tuschekante wurde
       aber gezeichnet — ein herrenloser schwarzer Rahmen auf dem Nichts, 2,98× der Fussdurchmesser,
       quer ueber die Buehne. Georg hat eine graue Base bestellt, die den Schatten haelt; gerendert
       wurde eine unsichtbare Base mit schwarzem Rahmen. Ein Rand ohne Flaeche ist eine Behauptung. */
    const planeOn = !!(gnd.plane && gnd.plane.visible) && (gnd.state.plane.mode !== 'invisible');
    ink.mesh.visible = !!S.ink && planeOn;
    return { footR: +footR.toFixed(4), edge: +edge.toFixed(3), ao: S.ao, ink: !!S.ink, planeOn,
             at: [+at.x.toFixed(3), +at.y.toFixed(3), +at.z.toFixed(3)] };
  }

  /** Der Klick-Ring. Er ist ein BODEN-FX, kein neues System: `gnd.addFx` zeichnet ihn, damit alle
   *  Ringe im Haus dieselbe Bauart haben. Farbe kommt vom Aufrufer (Pet-Farbe), nicht von hier. */
  function pulse(p) {
    const q = p || {};
    return gnd.addFx({ x: at.x, z: at.z, r: footR * (q.r == null ? 1.35 : q.r),
      color: q.color || '#ff5fd0', opacity: q.opacity == null ? S.ring : q.opacity,
      life: q.life == null ? 0.45 : q.life, ring: q.ring == null ? 0.62 : q.ring });
  }

  /** Landestaub: drei Ringe mit Versatz. Kein Partikelsystem — derselbe Zeichner, dreimal. */
  function dust(p) {
    const q = p || {};
    const ids = [];
    for (let i = 0; i < 3; i++) ids.push(gnd.addFx({ x: at.x + (i - 1) * footR * 0.42, z: at.z + (i % 2 ? footR * 0.3 : -footR * 0.22),
      r: footR * (0.55 + i * 0.22), color: q.color || '#cfc3a6', opacity: 0.34 - i * 0.07,
      life: 0.55 + i * 0.12, ring: 0.5 }));
    return ids;
  }

  function set(patch) {
    Object.assign(S, patch || {});
    if (patch && patch.tint) gnd.setPlane({ tint: patch.tint });
    if (patch && patch.aoWidth != null) { seam.tex.dispose(); seam.tex = new THREE.CanvasTexture(seamTex(S.aoWidth, S.seamRes)); seam.tex.colorSpace = THREE.NoColorSpace; seam.mat.alphaMap = seam.tex; seam.mat.needsUpdate = true; }
    if (patch && (patch.inkPen != null || patch.res != null)) { ink.tex.dispose(); ink.tex = new THREE.CanvasTexture(edgeTex(S.res, S.inkPen, 0.06, 7)); ink.tex.colorSpace = THREE.NoColorSpace; ink.mat.alphaMap = ink.tex; ink.mat.needsUpdate = true; }
    if (patch && patch.inkColor) ink.mat.color.set(S.inkColor);
    if (patch && patch.aoColor) seam.mat.color.set(S.aoColor);
    return { ...S };
  }

  return {
    version, state: S, seam: seam.mesh, ink: ink.mesh,
    update, pulse, dust, set,
    report() { return { ...S, footR: +footR.toFixed(4), edge: +edge.toFixed(3),
      planeOn: !!(gnd.plane && gnd.plane.visible) && (gnd.state.plane.mode !== 'invisible') }; },
    dispose() {
      for (const L of [seam, ink]) { scene.remove(L.mesh); L.mesh.geometry.dispose(); L.mat.dispose(); L.tex.dispose(); }
    },
  };
}
