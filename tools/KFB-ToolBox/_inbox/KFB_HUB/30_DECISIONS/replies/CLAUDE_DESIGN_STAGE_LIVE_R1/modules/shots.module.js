// Kamera-Shots · Host-Vertrag R1.2. Rechnet die vier Shots aus den echten Objektgrenzen, gleitet weich (keine harten Sprünge außer beim Schnitt).
// two = Two-Shot · a = A nah · b = B reagiert · insert = Karten-Insert (Fläche contain im Bild, nie angeschnitten).
import * as THREE from 'three';

export const SHOTS = [['two', 'Two-Shot'], ['a', 'A nah'], ['b', 'B reagiert'], ['insert', 'Karten-Insert']];
export function create(o) {
  const cam = o.camera, A = o.A, B = o.B, bb = o.billboard, pos = new THREE.Vector3(), tgt = new THREE.Vector3(), curT = new THREE.Vector3();
  let shot = 'two', cut = true;
  const fitDist = (w, h, aspect, margin = 1.08) => { const t = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2); return Math.max(h / 2 / t, w / 2 / (t * aspect)) * margin; };
  const tmp = new THREE.PerspectiveCamera(), pv = new THREE.Vector3();
  // Kamera auf Blickrichtung dirN zum Ziel c; Abstand per Bisektion, bis alle Punkte mit Rand m im Bild liegen
  function fitPoints(pts, c, dirN, aspect, m = 0.06) {
    tmp.fov = cam.fov; tmp.aspect = aspect; tmp.near = 0.1; tmp.far = 500; tmp.updateProjectionMatrix();
    const ok = d => { tmp.position.copy(c).addScaledVector(dirN, d); tmp.lookAt(c); tmp.updateMatrixWorld(); return pts.every(p => { pv.copy(p).project(tmp); return pv.z < 1 && Math.abs(pv.x) <= 1 - m && Math.abs(pv.y) <= 1 - m; }); };
    let lo = 1, hi = 400; for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (ok(mid)) hi = mid; else lo = mid; }
    return c.clone().addScaledVector(dirN, hi);
  }
  function goal(aspect) {
    const a = A.headWorld(), b = B.headWorld(), fc = bb.object3d.localToWorld(bb.info.faceCenter.clone()), W = bb.info.W, H = bb.info.H;
    if (shot === 'insert') { const g = bb.object3d, pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => g.localToWorld(new THREE.Vector3(sx * W / 2, bb.info.faceCenter.y + sy * H / 2, 0.035))), c = g.localToWorld(bb.info.faceCenter.clone()); return [fitPoints(pts, c, new THREE.Vector3(0, 0, 1), aspect, 0.03), c]; }
    if (shot === 'two') {
      const top = bb.info.top, pts = [A, B].flatMap(x => { const p = x.object3d.position; return [new THREE.Vector3(p.x - 1.3, p.y, p.z + 0.5), new THREE.Vector3(p.x + 1.3, p.y, p.z + 0.5), x.headWorld().add(new THREE.Vector3(0, 1.1, 0))]; });
      pts.push(new THREE.Vector3(-W / 2 - 0.5, top, fc.z), new THREE.Vector3(W / 2 + 0.5, top, fc.z));
      const c = new THREE.Vector3((a.x + b.x) / 2, top * 0.46, (a.z + fc.z) / 2), dirN = new THREE.Vector3(0, 0.16, 1).normalize();
      return [fitPoints(pts, c, dirN, aspect, aspect < 1 ? 0.1 : 0.05), c];
    }
    const me = shot === 'a' ? A : B, other = shot === 'a' ? B : A, f = me.faceBox(), oh = other.headWorld();
    const side = Math.sign(oh.x - f.center.x) || 1, w = aspect < 1 ? 3.0 : 5.4, h = aspect < 1 ? 4.6 : 3.1, d = fitDist(w, h, aspect, 1.0);
    const c = f.center.clone().add(new THREE.Vector3(side * (aspect < 1 ? 0.2 : 0.9), aspect < 1 ? 0.1 : 0.3, 0));
    return [c.clone().add(new THREE.Vector3(side * d * 0.32, 0.25, d)), c];
  }
  return {
    object3d: new THREE.Group(),
    get shot() { return shot; },
    set(name) { if (name !== shot) { shot = name; cut = true; } },
    update(dt, ctx) {
      const [p, t] = goal(ctx.aspect); if (cut) { pos.copy(p); curT.copy(t); cut = false; } else { const k = 1 - Math.exp(-dt * 4); pos.lerp(p, k); curT.lerp(t, k); }
      cam.position.copy(pos); tgt.copy(curT); cam.lookAt(tgt); cam.updateMatrixWorld();
    },
    dispose() {}
  };
}
