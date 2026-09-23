/* FrizzleGraft v1 · facehost.v1 — unser Gesicht auf einen FREMDEN Kopf.
 *
 * VORBILD (gefunden, bevor eine Zeile entstand): `petstudio-v9/studio-v12/frizzlebob.v4a.js`
 * `_buildFaceHost()` Z. 266–286 und `faceCtx()` Z. 288. Dort hängt eine unsichtbare Box namens `body`
 * am Kopfknochen, mit der WELTDREHUNG DER BINDEPOSE herausgerechnet — dann zeigt −z der Box in den
 * Kopf hinein und EyeRig/PetMouth tasten von vorn ab, egal wie der Knochen selbst liegt. Genau
 * diese Konstruktion wird hier für beliebige Figuren nachgebaut; die Rigs merken keinen Unterschied,
 * weil sie denselben `faceCtx()` bekommen.
 *
 * WAS NEU IST (und warum es überhaupt ein Modul braucht): FrizzleBob bringt seine Kopfmaße mit
 * (`m.headBox`). Eine fremde Figur nicht. Also wird hier GEMESSEN statt übernommen:
 *   · der Kopfknochen per Namen, mit Verwandtensuche (head · skull),
 *   · die Kopfbox aus den Punkten, deren STÄRKSTE Bindung dieser Knochen ist — die Box des TEILS,
 *     niemals die des ganzen Spenders (der Messfehler aus F1-S5, der jede Insel falsch skaliert hat),
 *   · die Blickrichtung aus den ZEHEN (`toes` liegt vor `foot`) — eine Richtung, die man ableiten
 *     kann, wird nicht geraten. Ohne Zehen: Nase/Kopf-Schwerpunkt, und das steht dann im Bericht.
 *
 * EICHUNG VOR MESSUNG: gemessen wird in der BINDEPOSE (`Skeleton.pose()`), nicht mitten im Idle —
 * sonst wandert die Kopfbox mit dem Bild, in dem gerade geladen wurde (»kein Ausdruck ohne
 * Reifezeugnis«). Danach übernimmt wieder, wer vorher gerechnet hat: der Mixer.
 *
 * EIGENTUM: der Wirt besitzt Figur und Clips · dieses Modul besitzt NUR den Host und seine Messung ·
 * die Rigs besitzen das Gesicht. Nichts hier zeichnet ein Auge.
 */
export const SCHEMA = 'kfb.facehost/0.1';
const norm = (s) => String(s || '').replace(/[.\s_-]/g, '').toLowerCase();

export function buildFaceHost({ THREE, figure, shape = 'ellipsoid', shrink = 1, log = () => {} }) {
  const T = THREE;
  const out = { schema: SCHEMA, status: 'INIT' };
  if (!figure) return { status: 'UNSUPPORTED', reason: 'keine Figur' };

  /* 1 · Knochen einsammeln, Kopf finden. */
  const bones = {}, list = [];
  figure.traverse((n) => { if (n.isBone) { list.push(n); if (!bones[norm(n.name)]) bones[norm(n.name)] = n; } });
  const head = bones.head || bones.skull || list.find((b) => /head|skull/i.test(b.name));
  if (!head) return { status: 'UNSUPPORTED', reason: 'kein Kopfknochen' };

  /* 2 · Bindepose herstellen und merken, was danach wieder gelten soll. */
  const skels = new Set();
  figure.traverse((n) => { if (n.isSkinnedMesh && n.skeleton) skels.add(n.skeleton); });
  const saved = list.map((b) => b.quaternion.clone());
  skels.forEach((sk) => { try { sk.pose(); } catch (e) {} });
  figure.updateMatrixWorld(true);

  /* 3 · Blickrichtung MESSEN. Zehen liegen vor dem Fuß — das ist die Nase der Figur, nur unten. */
  const wp = (o) => o.getWorldPosition(new T.Vector3());
  let fwd = new T.Vector3(0, 0, 1), fsrc = 'Rückfall +z';
  const toe = bones.toesl || bones.toel || bones.toes, foot = bones.footl || bones.foot;
  if (toe && foot) { const d = wp(toe).sub(wp(foot)); d.y = 0; if (d.lengthSq() > 1e-6) { fwd = d.normalize(); fsrc = 'Zehen'; } }
  const figQ = figure.getWorldQuaternion(new T.Quaternion());

  /* 4 · Die Kopfbox aus den Punkten dieses Knochens. Box des TEILS, nicht des Ganzen. */
  const box = new T.Box3(); box.makeEmpty();
  const v = new T.Vector3();
  const mats = {};
  let verts = 0, total = 0;
  figure.traverse((m) => {
    if (!m.isSkinnedMesh || !m.geometry || !m.skeleton) return;
    const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, arr = m.skeleton.bones;
    if (!si || !sw) return;
    for (let i = 0; i < g.attributes.position.count; i++) {
      total++;
      let best = 0, bw = -1;
      for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; best = si.getComponent(i, j); } }
      if (arr[best] !== head) continue;
      verts++;
      m.getVertexPosition(i, v); m.localToWorld(v); box.expandByPoint(v);
      const mn = (Array.isArray(m.material) ? m.material[0] : m.material);
      const key = (mn && mn.name) || m.name || 'ohne Namen';
      mats[key] = (mats[key] || 0) + 1;
    }
  });
  if (verts === 0) { saved.forEach((q, i) => list[i].quaternion.copy(q)); return { status: 'UNSUPPORTED', reason: 'keine Punkte am Kopfknochen' }; }

  const c = box.getCenter(new T.Vector3()), s = box.getSize(new T.Vector3());
  if (shrink !== 1) s.multiplyScalar(shrink);

  /* 5 · Der Host — Aufbau wörtlich wie in frizzlebob.v4a: Weltdrehung des Elternknochens
     herausgerechnet, Mittelpunkt in seinen Koordinaten, Skalierung invertiert. */
  head.updateMatrixWorld(true);
  const inner = new T.Group(); inner.name = 'faceHost';
  head.add(inner);
  const pw = new T.Vector3(), qw = new T.Quaternion(), sw2 = new T.Vector3();
  head.matrixWorld.decompose(pw, qw, sw2);
  inner.quaternion.copy(qw).invert();
  inner.position.copy(head.worldToLocal(c.clone()));
  inner.scale.set(1 / (sw2.x || 1), 1 / (sw2.y || 1), 1 / (sw2.z || 1));
  /* Der Host schaut per Bauart nach +z der WELT. Schaut die Figur woandershin, wird er gedreht —
     um den gemessenen Winkel, nicht um ein halbes Pi auf Verdacht. */
  const localFwd = fwd.clone().applyQuaternion(figQ.clone().invert()).setY(0).normalize();
  const yaw = Math.atan2(localFwd.x, localFwd.z);
  inner.rotateY(yaw);

  const geo = shape === 'box' ? new T.BoxGeometry(s.x, s.y, s.z)
    : new T.SphereGeometry(1, 40, 28).scale(s.x / 2, s.y / 2, s.z / 2);
  geo.computeBoundingBox();
  const hostBox = new T.Mesh(geo, new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hostBox.name = 'body';   // ⚠ DER NAME IST VERTRAG: EyeRig und PetMouth suchen `body`, nicht irgendeine Box.
  hostBox.castShadow = false; hostBox.receiveShadow = false; hostBox.userData.noMeasure = true;
  inner.add(hostBox);

  saved.forEach((q, i) => list[i].quaternion.copy(q));
  figure.updateMatrixWorld(true);

  const report = {
    status: 'OK', schema: SCHEMA, head: head.name, facing: fsrc, yaw: +(yaw * 180 / Math.PI).toFixed(1),
    headSize: [+s.x.toFixed(3), +s.y.toFixed(3), +s.z.toFixed(3)],
    headVerts: verts, totalVerts: total,
    materials: Object.entries(mats).sort((a, b) => b[1] - a[1]).map(([n, k]) => n + ' (' + k + ')'),
  };
  log('faceHost auf ' + head.name + ' · ' + report.headSize.join('×') + ' · Blick ' + fsrc
    + ' (' + report.yaw + '°) · ' + verts + '/' + total + ' Punkte · ' + report.materials.join(', '));

  return {
    status: 'OK', inner, box: hostBox, head, report, size: s,
    faceCtx() { return { THREE: T, inner, o: {}, _squash: null, getFaceShells: () => [] }; },
    dispose() {
      if (inner.parent) inner.parent.remove(inner);
      hostBox.geometry.dispose(); hostBox.material.dispose();
    },
  };
}
export default buildFaceHost;
