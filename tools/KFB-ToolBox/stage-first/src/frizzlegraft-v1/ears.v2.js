/* FrizzleGraft v1 · ears.v2 — FrizzleBobs Ohren auf einem fremden Kopf. EIN Stück je Seite.
 *
 * WARUM EINE ZWEITE FASSUNG (Georgs Bild 11.09., 19:03): die v1 zerlegte das Ohr in drei Glieder je
 * Seite und baute aus jedem ein eigenes Netz. Zwei Fehler, die zusammengehören:
 *   · Jedes Dreieck mußte EINEM Knochen ganz gehören. Am Ohransatz mischen die Dreiecke Ear1 mit
 *     `Head`, am Übergang Ear1/Ear2 mischen sie beide Ohrglieder — jedes gemischte Dreieck fiel
 *     durch. Ergebnis: ein Loch in der Mitte und ein fehlender Fuß. Georg sah genau das.
 *   · Die Kette wurde mit den PROPORTIONEN DES SPENDERS auf einen fremden Kopf gelegt. FrizzleBobs
 *     Kopf ist flacher als ein KayKit-Schädel; derselbe Versatz landet dort im Inneren.
 *
 * DIE REGEL DIESER FASSUNG: **der Spender liefert die FORM, der Wirt bestimmt LAGE UND GRÖSSE.**
 * Ein Ohr ist EIN Netz (kein Schnitt mitten durchs Bauteil, also auch kein Loch), und wo es sitzt,
 * wird am Kopf des Wirts gemessen — nicht am Kopf des Spenders. Das Ohr tritt aus der Oberseite
 * aus, seine Länge ist ein Anteil der Kopfhöhe. Damit paßt es auf jeden der 43 Köpfe gleich gut.
 *
 * BEWEGUNG: ein Drehpunkt je Ohr am Ansatz. Keine Leerlauf-Zappelei (Prime Directive) — die Ohren
 * folgen der GEMESSENEN Bewegung des Kopfes mit Verzögerung und schwingen aus. Kopf still = Ohr still.
 * Drei Glieder je Seite waren die schönere Idee; sie kosten drei Schnitte durch ein Bauteil, das
 * keine Nähte hat. Erst soll es richtig sitzen.
 *
 * EIGENTUM: Geometrie und Federn der Ohren. Weder Figur noch Gesicht werden angefaßt.
 */
export const SCHEMA = 'kfb.ears/0.2';
/* ⚠ 18.09.2026 · ASSET-QUELLE IST GITHUB, NICHT DAS PAKET (Intake §2.2).
 * Der Export hatte diese Datei als `NEW_ASSET_REQUIRES_GITHUB_IMPORT` geführt — das war falsch. Meine
 * Repo-Suche lief über den Filter »importierbare Dateien« und hat den Treffer nicht gezeigt; der Intake
 * hat ihn belegt:
 *   tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf
 *   Blob e0a757ece30accabc4c61f1ad11751b15bd06974 · 608 342 B
 * Gepinnt auf Commit eabc87255ee3da6283f9d438390454d70e9d2e55. Die lokale Kopie unter
 * `petstudio-v9/assets/models/` bleibt vorerst liegen (Löschen braucht Freigabe), wird aber NICHT
 * mehr geladen — sie ist keine zweite Wahrheit.
 * RÜCKWEG: `new URL('../petstudio-v9/assets/models/FrizzleBob_Yellow.gltf', import.meta.url).href`. */
const FB_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/eabc87255ee3da6283f9d438390454d70e9d2e55/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf';

let _cache = null;
async function donor(loader) {
  if (!_cache) _cache = loader.loadAsync(FB_URL);
  return _cache;
}

/* Lage am Wirtskopf — Anteile, keine Längen. Eine Zahl in Einheiten wäre für einen Kopf richtig
   und für die 42 anderen falsch. Gemessen wird die Kopfbox, hier stehen nur die Verhältnisse. */
const PLACE = {
  /* Am Bild nachgezogen (Driver, 11.09.): mit 0,30 Abstand und 0,20 Neigung standen sie hinter der
     Frisur und zu weit auseinander. Enger, aufrechter, auf dem Scheitel statt dahinter. */
  spread: 0.22,     // Abstand vom Kopfmittelpunkt zur Seite, Anteil der Kopfbreite
  rise: 0.28,       // Höhe des Ansatzes über der Kopfmitte, Anteil der Kopfhöhe
  back: 0.0,        // auf dem Scheitel, nicht dahinter
  length: 0.95,     // Ohrlänge als Anteil der Kopfhöhe — Hasenohr, kein Stummel
  tiltOut: 0.10,    // nach außen gekippt (Bogenmaß)
  tiltBack: 0.08,   // nach hinten gekippt
  sink: 0.10,       // Anteil der Ohrlänge, der IM Kopf steckt, damit es gewachsen wirkt
};

export async function buildEars({ THREE, loader, host, color = null, place = {}, log = () => {} }) {
  const T = THREE;
  if (!host || !host.inner) return { status: 'UNSUPPORTED', reason: 'kein Kopf-Host' };
  if (!loader) return { status: 'UNSUPPORTED', reason: 'kein Lader' };
  const P = Object.assign({}, PLACE, place);
  const src = (await donor(loader)).scene;
  src.updateMatrixWorld(true);   // die Datei steht in ihrer Ruhelage; `pose()` würde sie wegwerfen

  /* 1 · Alles einsammeln, was zum Ohr gehört. Ein Punkt gehört zum Ohr, wenn ein Ear-Knochen sein
     STÄRKSTER ist; ein Dreieck gehört dazu, sobald EIN Punkt dazugehört — so bleibt der Ansatz dran.
     Die Seite entscheidet der Knochenname, nicht das Vorzeichen: `.L` und `.R` stehen in der Datei. */
  const side = { L: { pos: [], nor: [], idx: [], map: new Map() }, R: { pos: [], nor: [], idx: [], map: new Map() } };
  const headBox = new T.Box3();
  const v = new T.Vector3(), n3 = new T.Vector3();
  let material = null, tris = 0;

  src.traverse((m) => {
    if (!m.isSkinnedMesh || !m.geometry || !m.geometry.index) return;
    const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, nor = g.attributes.normal;
    if (!si || !sw) return;
    const bones = m.skeleton.bones;
    const sideOf = new Array(g.attributes.position.count).fill(null);
    for (let i = 0; i < sideOf.length; i++) {
      let b = 0, bw = -1;
      for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; b = si.getComponent(i, j); } }
      const bone = bones[b]; if (!bone) continue;
      const mm = /^ear\d*[._]?([lr])$/i.exec(bone.name);
      if (mm) sideOf[i] = mm[1].toUpperCase();
      else if (/^head$/i.test(bone.name)) { m.getVertexPosition(i, v); m.localToWorld(v); headBox.expandByPoint(v); }
    }
    const ix = g.index.array;
    for (let t = 0; t < ix.length; t += 3) {
      const tri = [ix[t], ix[t + 1], ix[t + 2]];
      const s = sideOf[tri[0]] || sideOf[tri[1]] || sideOf[tri[2]];
      if (!s) continue;
      const bk = side[s];
      for (const vi of tri) {
        let ni = bk.map.get(vi);
        if (ni === undefined) {
          ni = bk.pos.length / 3; bk.map.set(vi, ni);
          m.getVertexPosition(vi, v); m.localToWorld(v);
          bk.pos.push(v.x, v.y, v.z);
          if (nor) { n3.fromBufferAttribute(nor, vi).transformDirection(m.matrixWorld); bk.nor.push(n3.x, n3.y, n3.z); }
        }
        bk.idx.push(ni);
      }
      tris++;
      if (!material) material = Array.isArray(m.material) ? m.material[0] : m.material;
    }
  });
  if (!side.L.pos.length && !side.R.pos.length) return { status: 'UNSUPPORTED', reason: 'kein Ohr-Netz im Spender' };

  /* 2 · Der Wirtskopf gibt das Maß. Die Box liegt im Host-Rahmen: Mittelpunkt 0, +z nach vorn. */
  const H = host.size || new T.Vector3(1, 1, 1);
  const hx = H.x, hy = H.y, hz = H.z;

  const mat = new T.MeshStandardMaterial({
    color: color != null ? new T.Color(color) : (material && material.color ? material.color.clone() : new T.Color(0xf2c93c)),
    roughness: material ? material.roughness : 0.85, metalness: 0,
  });

  const rootG = new T.Group(); rootG.name = 'kfb-ears';
  host.inner.add(rootG);

  const pivots = [];
  const report = { sides: [], head: [+hx.toFixed(3), +hy.toFixed(3), +hz.toFixed(3)] };

  for (const s of ['L', 'R']) {
    const bk = side[s];
    if (!bk.pos.length) continue;

    /* Eigene Box des TEILS (nie die des Spenders) — daraus Länge und Fußpunkt. */
    const bb = new T.Box3();
    for (let i = 0; i < bk.pos.length; i += 3) bb.expandByPoint(v.set(bk.pos[i], bk.pos[i + 1], bk.pos[i + 2]));
    const sz = bb.getSize(new T.Vector3()), ctr = bb.getCenter(new T.Vector3());
    const len = sz.y || 1;
    const k = (P.length * hy) / len;            // Länge ist ein Anteil der Kopfhöhe — daher der Maßstab
    const foot = new T.Vector3(ctr.x, bb.min.y, ctr.z);   // Fuß = unterste Stelle des Ohrs

    const geo = new T.BufferGeometry();
    const pos = new Float32Array(bk.pos.length);
    for (let i = 0; i < bk.pos.length; i += 3) {
      pos[i] = bk.pos[i] - foot.x; pos[i + 1] = bk.pos[i + 1] - foot.y; pos[i + 2] = bk.pos[i + 2] - foot.z;
    }
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    if (bk.nor.length === bk.pos.length) geo.setAttribute('normal', new T.BufferAttribute(new Float32Array(bk.nor), 3));
    else geo.computeVertexNormals();
    geo.setIndex(bk.idx);

    const mesh = new T.Mesh(geo, mat);
    mesh.name = 'ear' + s; mesh.castShadow = true; mesh.userData.noMeasure = true;

    const piv = new T.Group(); piv.name = 'earPivot' + s;
    const dir = s === 'L' ? 1 : -1;
    piv.position.set(dir * P.spread * hx, P.rise * hy - P.sink * P.length * hy, P.back * hz);
    piv.rotation.set(-P.tiltBack, 0, -dir * P.tiltOut);
    piv.scale.setScalar(k);
    piv.add(mesh);
    rootG.add(piv);
    pivots.push({ piv, side: s, rest: piv.quaternion.clone(), vel: new T.Vector3(), ang: new T.Vector3() });
    report.sides.push({ s, scale: +k.toFixed(3), len: +(len * k).toFixed(3), tris: bk.idx.length / 3 });
  }

  const st = { prev: new T.Vector3(), inited: false };
  const tmp = new T.Vector3(), tmp2 = new T.Vector3(), q = new T.Quaternion(), e = new T.Euler();

  log('Ohren v2: ' + pivots.length + ' Stück · ' + tris + ' Dreiecke · Kopf '
    + report.head.join('×') + ' · Ohrlänge ' + (report.sides[0] ? report.sides[0].len : '?'));

  return {
    status: 'OK', schema: SCHEMA, group: rootG,
    report: Object.assign({ bones: pivots.length, links: pivots.length, tris }, report),
    update(dt) {
      if (!dt || dt > 0.1) dt = 1 / 60;
      rootG.getWorldPosition(tmp);
      if (!st.inited) { st.prev.copy(tmp); st.inited = true; return; }
      tmp2.copy(tmp).sub(st.prev).multiplyScalar(1 / dt);
      st.prev.copy(tmp);
      const local = rootG.worldToLocal(tmp2.clone().add(tmp)).sub(rootG.worldToLocal(tmp.clone()));
      for (const p of pivots) {
        const target = { x: -local.z * 0.10, z: local.x * 0.10 };
        const stiff = 42, damp = 8;
        p.vel.x += ((target.x - p.ang.x) * stiff - p.vel.x * damp) * dt;
        p.vel.z += ((target.z - p.ang.z) * stiff - p.vel.z * damp) * dt;
        p.ang.x += p.vel.x * dt; p.ang.z += p.vel.z * dt;
        const lim = 0.45;
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
