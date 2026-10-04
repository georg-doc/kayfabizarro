/**
 * texclean.v1 · Eine GEMESSENE Region einer Bildtafel übermalen.
 *
 * Warum es das gibt: Carls `capsule_texture.png` hat einen AUFGEMALTEN Mund. Das Netz ist seit der
 * Einebnung glatt (Restabweichung 0 u), die Farbe zeigt aber weiter Zähne und Lippen — also liegen
 * zwei Münder übereinander, sobald der Decal montiert ist. Am Netz ist dagegen nichts zu holen.
 *
 * Das Verfahren ist im Projekt schon bezahlt: für `lab-v2/assets/driver_texture_kfb.png` wurden die
 * beiden GoGoGo-Aufdrucke in der Bildtafel GEMESSEN und übermalt, nicht geraten. Hier dasselbe,
 * nur zur Laufzeit und ohne die Datei anzufassen.
 *
 * Zwei Entscheidungen, die den Unterschied machen:
 *   1 · Es werden die DREIECKE der Region gefüllt, nicht ihre Hüllkiste. Eine Bildtafel ist ein
 *       Atlas: ein Rechteck in UV-Raum trifft fremde Inseln (Augen, Panzerplatten) mit.
 *   2 · Die Füllfarbe wird ABGELESEN — Median über verteilte Stichpunkte des Netzes ohne die Region.
 *       Ein Median ist gegen die aufgemalten Extreme robust, ein Mittelwert nicht.
 *
 * Wirt-Vertrag: three kommt herein, nichts wird selbst geladen, die Quelltextur bleibt unberührt.
 *   const { map, report } = paintOverRegion({ THREE, mesh, boxesLocal });
 *   if (map) mesh.material.map = map;        // mesh.userData.origMap bleibt der Rückweg
 */
export const SCHEMA = 'kfb.texclean/1';

export function paintOverRegion({ THREE, mesh, boxesLocal, grow = 0.3, color = null, samples = 400 }) {
  const report = { status: 'SKIPPED', reason: '', triangles: 0, colour: null, texture: null, sampled: 0 };
  const geo = mesh.geometry, mat = mesh.material;
  const src = (mesh.userData && mesh.userData.origMap) || mat.map;
  const uv = geo.attributes.uv, pos = geo.attributes.position, idx = geo.index;
  if (!src || !src.image) { report.reason = 'no image on the material'; return { map: null, report }; }
  if (!uv) { report.reason = 'mesh carries no uv'; return { map: null, report }; }
  if (!boxesLocal || !boxesLocal.length) { report.reason = 'no region handed in'; return { map: null, report }; }

  const boxes = boxesLocal.map((b) => {
    const box = new THREE.Box3(new THREE.Vector3().fromArray(b.min), new THREE.Vector3().fromArray(b.max));
    box.expandByVector(box.getSize(new THREE.Vector3()).multiplyScalar(grow));
    return box;
  });
  const P = pos.array, inBox = new Uint8Array(pos.count), v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
    if (boxes.some((b) => b.containsPoint(v))) inBox[i] = 1;
  }

  const img = src.image, W = img.width | 0, H = img.height | 0;
  if (!W || !H) { report.reason = 'image has no size yet'; return { map: null, report }; }
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  /* flipY der Quelle bestimmt, wo v=0 liegt — sonst wird die Region gespiegelt übermalt. */
  const flip = src.flipY !== false;
  const px = (i) => [uv.getX(i) * W, (flip ? 1 - uv.getY(i) : uv.getY(i)) * H];

  let fill = color;
  if (!fill) {
    try {
      const cols = [], step = Math.max(1, Math.floor(pos.count / samples));
      for (let i = 0; i < pos.count; i += step) {
        if (inBox[i]) continue;
        const q = px(i);
        const d = ctx.getImageData(Math.min(W - 1, Math.max(0, q[0] | 0)), Math.min(H - 1, Math.max(0, q[1] | 0)), 1, 1).data;
        if (d[3] > 8) cols.push([d[0], d[1], d[2]]);
      }
      if (cols.length) {
        const lum = (c) => c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
        cols.sort((a, b) => lum(a) - lum(b));
        const m = cols[Math.floor(cols.length / 2)];
        fill = 'rgb(' + m[0] + ',' + m[1] + ',' + m[2] + ')';
        report.sampled = cols.length;
      }
    } catch (e) { report.reason = 'pixels unreadable (' + (e && e.name) + '), constant used'; }
  }
  if (!fill) fill = '#dba15b';

  ctx.fillStyle = fill; ctx.strokeStyle = fill;
  /* Die Dreieckskanten lassen bei 1024² eine Haarlinie stehen — einmal nachziehen schließt sie. */
  ctx.lineWidth = Math.max(1.5, Math.round(Math.max(W, H) / 512));
  ctx.lineJoin = 'round';
  const I = idx ? idx.array : null, n = I ? I.length : pos.count;
  for (let t = 0; t + 2 < n; t += 3) {
    const a = I ? I[t] : t, b = I ? I[t + 1] : t + 1, c = I ? I[t + 2] : t + 2;
    if (!(inBox[a] || inBox[b] || inBox[c])) continue;
    const A = px(a), B = px(b), C = px(c);
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(C[0], C[1]); ctx.closePath();
    ctx.fill(); ctx.stroke();
    report.triangles++;
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.flipY = src.flipY; tex.wrapS = src.wrapS; tex.wrapT = src.wrapT;
  if ('colorSpace' in src) tex.colorSpace = src.colorSpace;
  tex.anisotropy = src.anisotropy || 1;
  tex.needsUpdate = true;
  report.status = report.triangles ? 'OK' : 'SKIPPED';
  if (!report.triangles && !report.reason) report.reason = 'no triangle of the mesh lies in the region';
  report.colour = fill; report.texture = W + '×' + H;
  return { map: tex, report, canvas: cv };
}
