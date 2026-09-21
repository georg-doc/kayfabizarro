/* FrizzleGraft v1 · ears.v1 — FrizzleBobs Ohren auf einem fremden Kopf.
 *
 * WARUM EIN EIGENES MODUL: die Ohren sind in FrizzleBob ein SKINNED MESH an sechs Knochen
 * (`Ear1/2/3.L` und `.R`, gemessen in `FrizzleBob_Yellow.gltf`; `frizzlebob.v4a.js` Z. 60 schließt
 * sie aus der Kopfbox aus, weil sie sonst 2,489 statt 1,0 mäße). Ein fremdes Skelett hat diese
 * Knochen nicht. Man kann das Netz also nicht anbinden — man muß es ÜBERNEHMEN.
 *
 * DER WEG, in der Reihenfolge der Messung:
 *   1. In der BINDEPOSE werden die Punkte des Ohr-Netzes in Weltlage gerechnet (Eichung vor Messung).
 *   2. Jeder Punkt gehört dem Knochen, an dem er am STÄRKSTEN hängt — daraus entstehen sechs Inseln
 *      (drei Glieder je Seite). Die Box jeder Insel kommt aus IHREN Punkten, nie aus dem ganzen
 *      Spender (der Messfehler aus F1-S5).
 *   3. Je Glied ein Drehpunkt an der gemessenen Knochenstelle, Kette Ear1 → Ear2 → Ear3.
 *      Damit wackelt das Ohr wie eine Kette und nicht wie ein Brett.
 *   4. Die Kette hängt am Kopf-Host (`facehost.v1`), skaliert auf das Verhältnis der Kopfbreiten.
 *
 * BEWEGUNG: keine Leerlauf-Zappelei (Prime Directive). Die Glieder folgen der GEMESSENEN Bewegung
 * des Kopfes mit Verzögerung und schwingen aus — Interpunktion einer Bewegung, die es wirklich gibt.
 * Steht der Kopf still, stehen die Ohren still.
 *
 * EIGENTUM: dieses Modul besitzt Geometrie und Federn der Ohren. Es faßt weder Figur noch Gesicht an.
 */
export const SCHEMA = 'kfb.ears/0.1';
const FB_URL = new URL('../petstudio-v9/assets/models/FrizzleBob_Yellow.gltf', import.meta.url).href;

let _cache = null;
/* Einmal laden, dann teilen: das Blatt wechselt die Wirtsfigur oft, der Spender bleibt derselbe.
   Der Wirt reicht SEINEN Lader durch — zwei Lader hießen zwei Zwischenspeicher. */
async function donor(loader) {
  if (!_cache) _cache = loader.loadAsync(FB_URL);
  return _cache;
}

export async function buildEars({ THREE, loader, host, color = null, log = () => {} }) {
  const T = THREE;
  if (!host || !host.inner) return { status: 'UNSUPPORTED', reason: 'kein Kopf-Host' };
  if (!loader) return { status: 'UNSUPPORTED', reason: 'kein Lader' };
  const gltf = await donor(loader);
  const src = gltf.scene;

  /* 1 · Ruhelage — die AUTORISIERTE, nicht die Bindepose.
     ⚠ Erste Fassung rief `skeleton.pose()`, wie es beim Wirt richtig ist (der läuft ja gerade eine
     Bewegung). Beim Spender ist es falsch: die Datei wird frisch geladen und nie von einem Mixer
     angefaßt, ihr Zustand IST die vom Zeichner gesetzte Ruhelage. `pose()` wirft genau die weg und
     stellt die Bindepose her — und in der stehen FrizzleBobs Ohren waagerecht ab. Georgs Bild:
     zwei gelbe Bananen neben dem Kopf. Gemessen am Bild, nicht überlegt. */
  src.updateMatrixWorld(true);

  /* 2 · Punkte einsammeln, je stärkstem Knochen. */
  const buckets = new Map();       // Knochenname → { pos:[], idx:[], map:Map }
  const boneOf = new Map();
  const v = new T.Vector3(), n3 = new T.Vector3();
  let material = null, found = 0;
  const bones0 = new Map();
  const headBox = new T.Box3();     // Kopf OHNE Ohren — dieselbe Größe, die der Wirt von sich mißt
  src.traverse((m) => {
    if (!m.isSkinnedMesh || !m.geometry) return;
    const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, nor = g.attributes.normal;
    if (!si || !sw || !g.index) return;
    const bones = m.skeleton.bones;
    const owner = new Int32Array(g.attributes.position.count).fill(-1);
    for (let i = 0; i < owner.length; i++) {
      let b = 0, bw = -1;
      for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; b = si.getComponent(i, j); } }
      const bone = bones[b];
      if (!bone) continue;
      if (/^ear/i.test(bone.name)) { owner[i] = b; boneOf.set(bone.name, bone); }
      else if (/^head$/i.test(bone.name)) { m.getVertexPosition(i, v); m.localToWorld(v); headBox.expandByPoint(v); }
    }
    const ix = g.index.array;
    for (let t = 0; t < ix.length; t += 3) {
      const a = ix[t], b2 = ix[t + 1], c = ix[t + 2];
      /* ⚠ Erste Fassung verlangte, daß ALLE DREI Punkte denselben Ohrknochen haben. Am ANSATZ mischen
         die Dreiecke aber Ear1 mit `Head` — also fiel jedes Ear1-Dreieck durch, das Ohr begann erst
         in seiner Mitte und steckte zu 60 % im Kopf. Eine Regel, die den Übergang ausschließt,
         schneidet genau die Stelle weg, an der das Teil anwächst.
         Jetzt: ein Dreieck gehört zum Ohr, sobald MINDESTENS ein Punkt dominant an einem Ear-Knochen
         hängt; welcher Knochen es bekommt, entscheidet die Mehrheit der drei. */
      const oa = owner[a], ob = owner[b2], oc = owner[c];
      if (oa < 0 && ob < 0 && oc < 0) continue;
      let o;
      if (oa >= 0 && (oa === ob || oa === oc)) o = oa;
      else if (ob >= 0 && ob === oc) o = ob;
      else o = Math.max(oa, ob, oc) === -1 ? -1 : [oa, ob, oc].filter((x) => x >= 0).sort((x, y) => x - y)[0];
      if (o < 0) continue;
      const key = bones[o].name;
      if (!buckets.has(key)) buckets.set(key, { pos: [], nor: [], idx: [], map: new Map() });
      const bk = buckets.get(key);
      for (const vi of [a, b2, c]) {
        let ni = bk.map.get(vi);
        if (ni === undefined) {
          ni = bk.pos.length / 3; bk.map.set(vi, ni);
          m.getVertexPosition(vi, v); m.localToWorld(v);
          bk.pos.push(v.x, v.y, v.z);
          if (nor) { n3.fromBufferAttribute(nor, vi).transformDirection(m.matrixWorld); bk.nor.push(n3.x, n3.y, n3.z); }
        }
        bk.idx.push(ni);
      }
      found++;
      if (!material) material = Array.isArray(m.material) ? m.material[0] : m.material;
    }
  });
  if (!buckets.size) return { status: 'UNSUPPORTED', reason: 'kein Ohr-Netz im Spender' };

  /* 3 · Nullpunkt und Maßstab — beides aus dem KOPF, nicht aus dem Knochen.
     ⚠ Erste Fassung hängte die Kette an die Stelle des Kopf-KNOCHENS. Der sitzt bei KayKit-Figuren
     am Hals, der Host des Wirts aber in der Kopf-MITTE — die Ohren schwebten eine halbe Kopfhöhe
     über der Frisur (Georgs Bild). Beide Seiten messen jetzt dasselbe: die Box der Punkte, die am
     Kopf hängen, ohne Ohren. Auch die Kopfbreite ist damit gemessen statt als 1,0 angenommen. */
  const origin = headBox.isEmpty() ? new T.Vector3() : headBox.getCenter(new T.Vector3());
  const FB_HEAD_W = headBox.isEmpty() ? 1 : headBox.getSize(new T.Vector3()).x;
  const k = (host.size ? host.size.x : 1) / (FB_HEAD_W || 1);
  const headPos = origin;

  /* 4 · Kette bauen: je Knochen ein Drehpunkt an seiner gemessenen Stelle. */
  const mat = new T.MeshStandardMaterial({
    color: color != null ? new T.Color(color) : (material && material.color ? material.color.clone() : new T.Color(0xf2c93c)),
    roughness: material ? material.roughness : 0.85, metalness: 0,
  });
  const rootG = new T.Group(); rootG.name = 'kfb-ears';
  rootG.scale.setScalar(k);
  host.inner.add(rootG);

  const pivots = [], links = [];
  for (const side of ['L', 'R']) {
    let parent = rootG, prev = null;
    for (const lvl of [1, 2, 3]) {
      const key = [...buckets.keys()].find((n) => new RegExp('^ear' + lvl + '[._]?' + side + '$', 'i').test(n));
      const bone = [...boneOf.keys()].find((n) => new RegExp('^ear' + lvl + '[._]?' + side + '$', 'i').test(n));
      if (!key && !bone) continue;
      const bp = bone ? boneOf.get(bone).getWorldPosition(new T.Vector3()) : headPos.clone();
      const piv = new T.Group(); piv.name = 'ear' + lvl + side;
      /* Ort relativ zum ELTERN-Drehpunkt, in Spenderkoordinaten (die Skalierung sitzt an der Wurzel). */
      const local = bp.clone().sub(prev ? prev.world : headPos);
      piv.position.copy(local);
      piv.userData.world = bp.clone();
      parent.add(piv);
      if (key) {
        const bk = buckets.get(key);
        const geo = new T.BufferGeometry();
        const pos = new Float32Array(bk.pos.length);
        for (let i = 0; i < bk.pos.length; i += 3) {
          pos[i] = bk.pos[i] - bp.x; pos[i + 1] = bk.pos[i + 1] - bp.y; pos[i + 2] = bk.pos[i + 2] - bp.z;
        }
        geo.setAttribute('position', new T.BufferAttribute(pos, 3));
        if (bk.nor.length === bk.pos.length) geo.setAttribute('normal', new T.BufferAttribute(new Float32Array(bk.nor), 3));
        else geo.computeVertexNormals();
        geo.setIndex(bk.idx);
        const mesh = new T.Mesh(geo, mat);
        mesh.name = 'ear' + lvl + side + '-mesh'; mesh.castShadow = true; mesh.userData.noMeasure = true;
        piv.add(mesh);
      }
      pivots.push({ piv, side, lvl, rest: piv.quaternion.clone(), vel: new T.Vector3(), ang: new T.Vector3() });
      links.push(piv);
      prev = { world: bp.clone() }; parent = piv;
    }
  }
  /* ⚠ Erste Fassung verschob zusätzlich die Wurzel um −headPos·k — der Versatz war aber schon in den
     Drehpunkten drin (Glied 1 sitzt bei `bp − headPos`). Doppelt abgezogen standen die Ohren neben
     dem Kopf statt darauf. Der Nullpunkt der Wurzel IST die Kopfmitte des Wirts; mehr braucht es
     nicht. Gemessen an Georgs Bild, nicht überlegt. */

  const state = { prev: new T.Vector3(), inited: false };
  const tmp = new T.Vector3(), tmp2 = new T.Vector3(), q = new T.Quaternion(), e = new T.Euler();

  log('Ohren: ' + buckets.size + ' Glieder · ' + found + ' Dreiecke · Maßstab ' + k.toFixed(3)
    + ' (Spenderkopf ' + FB_HEAD_W.toFixed(3) + ' → Wirtskopf ' + (host.size ? host.size.x.toFixed(3) : '?') + ')');

  return {
    status: 'OK', schema: SCHEMA, group: rootG,
    report: { bones: pivots.length, links: buckets.size, tris: found, scale: +k.toFixed(3), names: [...buckets.keys()] },
    /* Interpunktion, kein Leerlauf: die Glieder reagieren auf die WIRKLICHE Bewegung des Kopfes. */
    update(dt) {
      if (!dt || dt > 0.1) dt = 1 / 60;
      rootG.getWorldPosition(tmp);
      if (!state.inited) { state.prev.copy(tmp); state.inited = true; return; }
      tmp2.copy(tmp).sub(state.prev).multiplyScalar(1 / dt);   // Geschwindigkeit des Kopfes
      state.prev.copy(tmp);
      const local = rootG.worldToLocal(tmp2.clone().add(tmp)).sub(rootG.worldToLocal(tmp.clone()));
      for (const p of pivots) {
        const lag = 0.55 + p.lvl * 0.35;                        // weiter außen = träger
        const target = { x: -local.z * lag * 0.10, z: local.x * lag * 0.10 };
        const stiff = 60 / (1 + p.lvl * 0.5), damp = 9;
        p.vel.x += ((target.x - p.ang.x) * stiff - p.vel.x * damp) * dt;
        p.vel.z += ((target.z - p.ang.z) * stiff - p.vel.z * damp) * dt;
        p.ang.x += p.vel.x * dt; p.ang.z += p.vel.z * dt;
        const lim = 0.5;
        p.ang.x = Math.max(-lim, Math.min(lim, p.ang.x)); p.ang.z = Math.max(-lim, Math.min(lim, p.ang.z));
        e.set(p.ang.x, 0, p.ang.z); q.setFromEuler(e);
        p.piv.quaternion.copy(p.rest).multiply(q);
      }
    },
    setColor(hex) { mat.color.set(hex); },
    dispose() {
      rootG.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
      mat.dispose();
      if (rootG.parent) rootG.parent.remove(rootG);
    },
  };
}
export default buildEars;
