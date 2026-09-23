/* FrizzleGraft v1 · headgraft.v1 — DER GANZE KOPF, nicht mehr nur das Gesicht.
 *
 * Georgs Entscheidung (11.09.): Schädel + Ohren + Gesichts-Rig aus dem FrizzleBob-Studio auf den
 * KayKit-Körper; der Wirtskopf wird ausgeblendet. Größe bestimmt der WIRT — der Kopf wird auf die
 * gemessene Kopfbox des Drivers gelegt, damit die Figur ihre Proportionen behält.
 *
 * VORBILDER, gelesen bevor eine Zeile entstand:
 *   · `ears.v2.js` — dieselbe Regel, kleineres Teil: der Spender liefert die FORM, der Wirt LAGE
 *     UND GRÖSSE. Ein Bauteil ist EIN Netz; ein Schnitt mitten durch ein nahtloses Teil macht Löcher.
 *   · `facehost.v1.js` — der Rahmen, in dem alles hängt: Mittelpunkt der gemessenen Kopfbox,
 *     Weltdrehung des Knochens herausgerechnet, +z nach vorn. Hier wird NICHT neu gemessen.
 *   · `frizzlebob.v4a.js` `_buildFaceHost()` — die unsichtbare Box heißt `body`. Der Name ist
 *     Vertrag: EyeRig und PetMouth suchen genau ihn.
 *
 * DREI DINGE, DIE DIESES MODUL ANDERS MACHT ALS `ears.v2`:
 *
 * 1 · SCHÄDEL UND OHREN SIND EIN NETZ. Zwischen Kopf und Ohransatz liegt keine Naht — ein Dreieck,
 *     das `Head` mit `Ear1` mischt, gehört beiden. Die v1 der Ohren hat genau dort geschnitten und
 *     ein Loch hinterlassen. Hier fällt die Grenze weg: wer `head` ODER `ear*` als stärksten
 *     Knochen hat, ist Kopf.
 *
 * 2 · DIE BLICKRICHTUNG DES SPENDERS WIRD GEMESSEN, nicht angenommen. Ein Kopf, der falsch herum
 *     sitzt, ist der teuerste Fehler dieser Baustelle. FrizzleBobs IK-Zielpunkte (`PoleTarget.*`)
 *     liegen per Bauart VOR den Knien — Richtung abgeleitet, nicht geraten. Rückfall: die helle
 *     Materialzone (die Schnauze) gegen den Kopfmittelpunkt. Was benutzt wurde, steht im Bericht.
 *
 * 3 · DER WIRTSKOPF WIRD AUSGEBLENDET, NICHT GELÖSCHT. Das Netz des Wirts wird in zwei
 *     Zeichengruppen geteilt (Körper · Kopf) und die Kopfgruppe bekommt ein unsichtbares Material.
 *     Kostet einen Zeichenaufruf, ist punktgenau, läuft mit jeder Bewegung mit und ist umkehrbar —
 *     ein Schnitt durch die Geometrie oder eine Klemmebene wäre beides nicht (eine Klemmebene über
 *     dem Hals nimmt auch die erhobene Hand mit).
 *
 * 4 · **ZWEI BOXEN, NICHT EINE.** Der Spender selbst sagt es in seinem Kopf (`frizzlebob.v4a`
 *     Z. 60): »**Ear1–3 L/R hängen am Head; mit ihnen wäre die Kopf-Box 2,489 × 2,334 statt Kopf
 *     allein**«. Sein eigenes Studio setzt das Gesicht deshalb auf den SCHÄDEL, nicht auf Schädel
 *     plus Ohren. Die erste Fassung hier hat die volle Box benutzt — das Gesicht saß zu hoch, und
 *     der Kopf wirkte gedrückt, weil die Ohren mit in die Wirtskopfbox gequetscht wurden.
 *     Jetzt: **der SCHÄDEL bekommt das Maß des Wirtskopfs, die Ohren ragen darüber hinaus** — und
 *     die Gesichtsbox ist die Schädelbox, genau wie im Studio. *Die Box des TEILS, nie die des
 *     ganzen Spenders — und ein Kopf mit Ohren ist für das Gesicht schon »das Ganze«.*
 *
 * EIGENTUM: dieses Modul besitzt das Kopfnetz und die Zeichengruppen, die es umgestellt hat ·
 * `facehost` besitzt den Rahmen und die Messung · die Rigs besitzen das Gesicht. Nichts hier
 * zeichnet ein Auge.
 */
export const SCHEMA = 'kfb.headgraft/0.1';
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

/* Anteile, keine Längen. Eine Zahl in Einheiten wäre für einen Kopf richtig und für die 42 anderen
   falsch. `size` ist der Anteil der GEMESSENEN Wirts-Kopfhöhe, den der Spenderkopf einnimmt. */
export const PLACE = {
  size: 1.0,     // 1,0 = genau so hoch wie der gemessene Wirtskopf
  dy: 0.0,       // Höhe über dem Kopfmittelpunkt, Anteil der Kopfhöhe
  dz: 0.0,       // vor/zurück, Anteil der Kopftiefe
  tilt: 0.0,     // Nicken (Bogenmaß, + = Kinn hoch)
  hide: 'most',  // Wirtskopf ausblenden: 'any' | 'most' | 'all' | 'off'
};

/* Georgs Abnahme vom 05.09. für FrizzleBobs eigenes Gesicht (`frizzlebob.v4a` SPEC.eyes/SPEC.mouth).
   Sie gelten für die SCHÄDEL-Box — und die ist hier jetzt dieselbe. Wer stattdessen die Werte des
   Wirts nimmt, setzt Augen, die für einen anderen Kopf abgenommen wurden. */
export const FB_FACE = {
  eyes: { anchor: { dx: 0.375, dy: -0.175, ring: 0.285, track: 0.095 }, inset: 0.39, pupilSize: 0.27,
    pupilStyle: 'matte-cute', lidFit: 0.9, gloss: 0.85, converge: 0, lidColor: 0xf2c93c },
  mouth: { size: 0.59, dy: -0.60, sx: 1.34, dx: 0, set: 'male', lift: 0.12, wrap: 1, onTop: false },
};

const HEAD_BONE = /^head$/i;
const EAR_BONE = /^ear\d*[._]?[lr]?$/i;

export async function buildHeadGraft({ THREE, loader, figure, host, place = {}, color = null, log = () => {} }) {
  const T = THREE;
  if (!host || !host.inner) return { status: 'UNSUPPORTED', reason: 'kein Kopf-Host (facehost zuerst)' };
  if (!loader) return { status: 'UNSUPPORTED', reason: 'kein Lader' };
  const P = Object.assign({}, PLACE, place);

  const src = (await donor(loader)).scene;
  src.updateMatrixWorld(true);   // die Datei steht in ihrer Ruhelage; `pose()` würde sie wegwerfen

  /* ─── 1 · Den ganzen Kopf des Spenders einsammeln. EIN Netz, keine Naht. ─────────────────── */
  const pos = [], nor = [], idx = [], map = new Map();
  const v = new T.Vector3(), n3 = new T.Vector3();
  const snout = new T.Vector3(); let snoutN = 0;
  const skullPts = [];   // nur Schädel — die Box, auf die das Gesicht gehört
  let material = null, tris = 0, headBones = new Set();
  const light = [];   // je Dreieck: 1 = helle Materialzone des Spenders (Schnauze), 0 = Rest

  src.traverse((m) => {
    if (!m.isSkinnedMesh || !m.geometry || !m.geometry.index) return;
    const g = m.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, nA = g.attributes.normal;
    if (!si || !sw) return;
    const bones = m.skeleton.bones;
    const mine = new Uint8Array(g.attributes.position.count);
    for (let i = 0; i < mine.length; i++) {
      let b = 0, bw = -1;
      for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; b = si.getComponent(i, j); } }
      const bone = bones[b]; if (!bone) continue;
      if (HEAD_BONE.test(bone.name) || EAR_BONE.test(bone.name)) { mine[i] = 1; headBones.add(bone.name); }
      if (HEAD_BONE.test(bone.name)) mine[i] = 2;   // 2 = Schädel, 1 = Ohr
    }
    /* Die helle Materialzone ist FrizzleBobs Schnauze — ihr Schwerpunkt ist der Rückfall für die
       Blickrichtung. Sie wird hier nur GEMESSEN, nicht verändert. */
    const mm = Array.isArray(m.material) ? m.material[0] : m.material;
    const isLight = mm && /light/i.test(mm.name || '');
    const ix = g.index.array;
    for (let t = 0; t < ix.length; t += 3) {
      const tri = [ix[t], ix[t + 1], ix[t + 2]];
      if (!(mine[tri[0]] || mine[tri[1]] || mine[tri[2]])) continue;
      for (const vi of tri) {        let ni = map.get(m.uuid + ':' + vi);
        if (ni === undefined) {
          ni = pos.length / 3; map.set(m.uuid + ':' + vi, ni);
          m.getVertexPosition(vi, v); m.localToWorld(v);
          pos.push(v.x, v.y, v.z);
          if (mine[vi] === 2) skullPts.push(v.x, v.y, v.z);
          if (nA) { n3.fromBufferAttribute(nA, vi).transformDirection(m.matrixWorld); nor.push(n3.x, n3.y, n3.z); }
          if (isLight && mine[vi]) { snout.add(v); snoutN++; }
        }
        idx.push(ni);
      }
      /* ⚠ DIE ZONE WURDE GEMESSEN UND DANN WEGGEWORFEN. `isLight` sagt, ob dieses Dreieck zur hellen
         Materialzone des Spenders gehört — zu FrizzleBobs Schnauze, derselben Zone, die `KFB Combat
         Arena v5b` mit den Händen gemeinsam färbt. Bisher diente sie nur als Rückfall für die
         Blickrichtung, und der verpflanzte Kopf bekam EIN flaches Material. Damit war Georgs
         Gesichtston nicht mehr möglich, obwohl die Information im Spender steht.
         Jetzt wird je Dreieck notiert, in welche Zone es gehört — zwei Zeichengruppen unten. */
      light.push(isLight ? 1 : 0);
      tris++;
      if (!material) material = mm;
    }
  });
  if (!pos.length) return { status: 'UNSUPPORTED', reason: 'kein Kopfnetz im Spender' };

  /* ─── 2 · Die Box des TEILS, nie die des ganzen Spenders (der Messfehler aus F1-S5). ─────── */
  const bb = new T.Box3();
  for (let i = 0; i < pos.length; i += 3) bb.expandByPoint(v.set(pos[i], pos[i + 1], pos[i + 2]));
  const fSize = bb.getSize(new T.Vector3());
  /* Die SCHÄDELBOX ist das Maß — sie trägt das Gesicht und sie wird auf den Wirtskopf gelegt.
     Die Ohren ragen darüber hinaus, wie an einem Hasen. */
  const sb = new T.Box3();
  for (let i = 0; i < skullPts.length; i += 3) sb.expandByPoint(v.set(skullPts[i], skullPts[i + 1], skullPts[i + 2]));
  if (skullPts.length === 0) sb.copy(bb);
  const dSize = sb.getSize(new T.Vector3()), dCtr = sb.getCenter(new T.Vector3());
  /* ⚠ Steckt der Schädel unten offen? Eine Kante, die zu genau EINEM Dreieck gehört, ist ein Rand.
     Georgs Frage: sitzt der Hals des Wirts im Loch, oder klafft es? Gemessen, nicht geraten. */
  const edge = new Map();
  for (let t = 0; t < idx.length; t += 3) {
    for (let e = 0; e < 3; e++) {
      const a = idx[t + e], b = idx[t + (e + 1) % 3], key = a < b ? a + '_' + b : b + '_' + a;
      edge.set(key, (edge.get(key) || 0) + 1);
    }
  }
  let openEdges = 0, openLowest = Infinity, openHighest = -Infinity;
  edge.forEach((n, key) => {
    if (n !== 1) return;
    openEdges++;
    const [a, b] = key.split('_').map(Number);
    const y = Math.min(pos[a * 3 + 1], pos[b * 3 + 1]), y2 = Math.max(pos[a * 3 + 1], pos[b * 3 + 1]);
    if (y < openLowest) openLowest = y;
    if (y2 > openHighest) openHighest = y2;
  });

  /* ─── 3 · Blickrichtung des SPENDERS messen. ──────────────────────────────────────────────
     IK-Zielpunkte liegen per Bauart vor den Knien. Gibt es sie nicht, entscheidet die Schnauze. */
  let fwd = new T.Vector3(0, 0, 1), fsrc = 'Rückfall +z';
  const bn = {};
  src.traverse((o) => { if (o.isBone) bn[o.name.replace(/[.\s_-]/g, '').toLowerCase()] = o; });
  const pole = [bn.poletargetl, bn.poletargetr].filter(Boolean), hips = bn.hips || bn.root || bn.body;
  if (pole.length && hips) {
    /* ⚠ EIN Zielpunkt reicht nicht: der linke liegt seitlich versetzt und lieferte 28,7° statt 0 —
       der Kopf stand schief. Beide zusammen ergeben die Mitte, und die ist die Blickrichtung. */
    const p = new T.Vector3();
    pole.forEach((o) => p.add(o.getWorldPosition(new T.Vector3())));
    p.multiplyScalar(1 / pole.length);
    const d = p.sub(hips.getWorldPosition(new T.Vector3()));
    d.y = 0; if (d.lengthSq() > 1e-6) { fwd = d.normalize(); fsrc = 'IK-Zielpunkte (' + pole.length + ')'; }
  } else if (snoutN) {
    const d = snout.multiplyScalar(1 / snoutN).sub(dCtr);
    d.y = 0; if (d.lengthSq() > 1e-6) { fwd = d.normalize(); fsrc = 'Schnauze (' + snoutN + ' Punkte)'; }
  }
  const donorYaw = Math.atan2(fwd.x, fwd.z);   // so viel muß der Kopf gedreht werden, damit er nach +z schaut

  /* ─── 4 · Der Wirt gibt das Maß. `host.size` ist bereits gemessen — hier wird nichts neu gemessen. */
  const H = host.size || new T.Vector3(1, 1, 1);
  const k = (P.size * H.y) / (dSize.y || 1);
  const fitY = H.y / (dSize.y || 1), fitX = H.x / (dSize.x || 1), fitZ = H.z / (dSize.z || 1);

  /* ─── 5 · Netz bauen: Mittelpunkt in den Ursprung, damit Drehung und Maßstab dort greifen. ── */
  const geo = new T.BufferGeometry();
  const pa = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i += 3) { pa[i] = pos[i] - dCtr.x; pa[i + 1] = pos[i + 1] - dCtr.y; pa[i + 2] = pos[i + 2] - dCtr.z; }
  geo.setAttribute('position', new T.BufferAttribute(pa, 3));
  if (nor.length === pos.length) geo.setAttribute('normal', new T.BufferAttribute(new Float32Array(nor), 3));
  else geo.computeVertexNormals();
  /* Zwei Zeichengruppen statt einer: erst die dunklen Dreiecke, dann die hellen. Dieselbe Technik,
     mit der weiter unten der Wirtskopf ausgeblendet wird — und die einzige, die die Zone des
     Spenders überlebt. Die Reihenfolge der Dreiecke ändert sich dabei, die Punkte nicht. */
  const darkIdx = [], lightIdx = [];
  for (let t = 0, q = 0; t < idx.length; t += 3, q++) {
    (light[q] ? lightIdx : darkIdx).push(idx[t], idx[t + 1], idx[t + 2]);
  }
  geo.setIndex(darkIdx.concat(lightIdx));
  geo.clearGroups();
  geo.addGroup(0, darkIdx.length, 0);
  if (lightIdx.length) geo.addGroup(darkIdx.length, lightIdx.length, 1);
  geo.computeBoundingBox();

  const baseCol = color != null ? new T.Color(color) : (material && material.color ? material.color.clone() : new T.Color(0xf2c93c));
  const mat = new T.MeshStandardMaterial({ color: baseCol.clone(), roughness: material ? material.roughness : 0.85, metalness: 0 });
  mat.name = 'Main';          // ⚠ NAMEN SIND VERTRAG: so findet `applyZones` die Zonen wieder
  const matLight = new T.MeshStandardMaterial({ color: baseCol.clone(), roughness: material ? material.roughness : 0.85, metalness: 0 });
  matLight.name = 'Main_Light';
  const mesh = new T.Mesh(geo, lightIdx.length ? [mat, matLight] : mat);
  mesh.name = 'kfb-head'; mesh.castShadow = true; mesh.userData.noMeasure = true;

  const pivot = new T.Group(); pivot.name = 'kfb-headgraft';
  pivot.add(mesh);
  host.inner.add(pivot);
  const applyPlace = () => {
    const kk = (P.size * H.y) / (dSize.y || 1);
    pivot.position.set(0, P.dy * H.y, P.dz * H.z);
    pivot.rotation.set(P.tilt, -donorYaw, 0);
    pivot.scale.setScalar(kk);
  };
  applyPlace();

  /* ─── 6 · Den Wirtskopf ausblenden: Zeichengruppen statt Schnitt. Umkehrbar. ──────────────── */
  const undo = [];
  let hidden = 0, extras = 0, hideCounts = { any: 0, most: 0, all: 0 };
  if (P.hide !== 'off') {
    const hb = host.head;
    figure.traverse((mesh) => {
      if (!mesh.isSkinnedMesh || !mesh.geometry || !mesh.geometry.index || !mesh.skeleton) return;
      if (Array.isArray(mesh.material) && mesh.material.length > 8) return;   // steht im Bericht
      const g = mesh.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, bones = mesh.skeleton.bones;
      if (!si || !sw) return;
      const isHead = new Uint8Array(g.attributes.position.count);
      for (let i = 0; i < isHead.length; i++) {
        let b = 0, bw = -1;
        for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; b = si.getComponent(i, j); } }
        if (bones[b] === hb) isHead[i] = 1;
      }
      const ix = g.index.array, keep = [], drop = [];
      for (let t = 0; t < ix.length; t += 3) {
        const c = isHead[ix[t]] + isHead[ix[t + 1]] + isHead[ix[t + 2]];
        if (c >= 1) hideCounts.any++;
        if (c >= 2) hideCounts.most++;
        if (c === 3) hideCounts.all++;
        const need = P.hide === 'any' ? 1 : P.hide === 'all' ? 3 : 2;
        (c >= need ? drop : keep).push(ix[t], ix[t + 1], ix[t + 2]);
      }
      if (!drop.length) return;
      /* Sonnenbrille und Frisur hängen als EIGENE Netze am Kopfknochen — ein Netz mit mehreren
         Materialien wurde vorher übersprungen und blieb im Bild stehen. Jetzt bekommt jedes Netz
         ein zusätzliches unsichtbares Material hinten an seiner Liste. */
      const oldIndex = g.index, oldGroups = g.groups.map((x) => Object.assign({}, x)), oldMat = mesh.material;
      const list = Array.isArray(oldMat) ? oldMat.slice() : [oldMat];
      const blank = new T.MeshBasicMaterial({ visible: false });
      const blankIx = list.length;
      list.push(blank);
      g.setIndex(keep.concat(drop));
      g.clearGroups();
      if (Array.isArray(oldMat) && oldGroups.length) {
        /* Mehrere Materialien: die behaltenen Dreiecke wurden umsortiert, ihre alte Gruppierung gilt
           nicht mehr. Alles Behaltene geht auf Material 0 — eine benannte Abweichung, kein Zufall. */
        g.addGroup(0, keep.length, 0);
      } else g.addGroup(0, keep.length, 0);
      g.addGroup(keep.length, drop.length, blankIx);
      mesh.material = list;
      /* ⚠ EIN EIGENTÜMER JE NETZ. Wer diese Zeichengruppen später noch einmal teilt (die Härbung
         der Haut tat es), hängt den unsichtbaren Anteil aus — der Wirtskopf war danach wieder im
         Bild und nur von FrizzleBobs größerem Kopf verdeckt. Unsichtbar aus Glück ist nicht
         unsichtbar. Diese Marke sagt jedem weiteren Teiler: Hände weg von diesem Netz. */
      mesh.userData.kfbHostHeadSplit = true;
      hidden += drop.length / 3;
      undo.push(() => {
        g.setIndex(oldIndex); g.clearGroups();
        oldGroups.forEach((x) => g.addGroup(x.start, x.count, x.materialIndex));
        mesh.material = oldMat; blank.dispose();
        delete mesh.userData.kfbHostHeadSplit;
      });
    });
    /* Was NICHT gehäutet ist, aber am Kopfknochen hängt (Brille, Hut, Frisur als eigenes Netz),
       wird schlicht unsichtbar geschaltet. Nur AB dem Kopfknochen abwärts — ein `traverse` von der
       Figur aus hätte auch das aufgesetzte Gesicht mitgenommen. */
    if (host.head) host.head.traverse((o) => {
      if (!o.isMesh || o.isSkinnedMesh || !o.visible) return;
      if (o.userData.noMeasure) return;   // unser eigener Host und alles, was die Rigs markiert haben
      o.visible = false; extras++;
      undo.push(() => { o.visible = true; });
    });
  }

  /* ─── 7 · Der Gesichts-Rahmen SITZT AUF DEM NEUEN KOPF. ───────────────────────────────────
     Die Rigs rechnen in den Einheiten von `host.inner`, nicht in denen des skalierten Netzes —
     darum ist die Box ein Geschwister des Kopfes, nicht sein Kind. Größe = Spenderkopf × Maßstab. */
  const fInner = new T.Group(); fInner.name = 'faceHost-graft';
  host.inner.add(fInner);
  fInner.position.copy(pivot.position);
  const fs = new T.Vector3(dSize.x * k, dSize.y * k, dSize.z * k);
  const fgeo = new T.SphereGeometry(1, 40, 28).scale(fs.x / 2, fs.y / 2, fs.z / 2);
  fgeo.computeBoundingBox();
  const fBox = new T.Mesh(fgeo, new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  fBox.name = 'body';   // ⚠ DER NAME IST VERTRAG
  fBox.castShadow = false; fBox.receiveShadow = false; fBox.userData.noMeasure = true;
  fInner.add(fBox);

  const report = {
    status: 'OK', schema: SCHEMA,
    donorBones: [...headBones].sort().join(', '),
    donorSize: [+dSize.x.toFixed(3), +dSize.y.toFixed(3), +dSize.z.toFixed(3)],
    donorFull: [+fSize.x.toFixed(3), +fSize.y.toFixed(3), +fSize.z.toFixed(3)],
    open: { edges: openEdges, lowest: openEdges ? +(openLowest - sb.min.y).toFixed(3) : null,
      belowSkull: openEdges ? +(sb.min.y - openLowest).toFixed(3) : null },
    hostSize: [+H.x.toFixed(3), +H.y.toFixed(3), +H.z.toFixed(3)],
    scale: +k.toFixed(3), fit: [+fitX.toFixed(3), +fitY.toFixed(3), +fitZ.toFixed(3)],
    graftSize: [+fs.x.toFixed(3), +fs.y.toFixed(3), +fs.z.toFixed(3)],
    facing: fsrc, donorYaw: +(donorYaw * 180 / Math.PI).toFixed(1),
    tris, hiddenTris: hidden, hiddenExtras: extras, hideCounts, hide: P.hide,
  };
  log('Kopf v13: ' + tris + ' Dreiecke aus [' + report.donorBones + '] · Schädel '
    + report.donorSize.join('×') + ' (mit Ohren ' + report.donorFull.join('×') + ') → Wirt ' + report.hostSize.join('×') + ' · Maßstab ' + report.scale
    + ' · Blick über ' + fsrc + ' (' + report.donorYaw + '°) · Wirtskopf ausgeblendet: ' + hidden
    + ' Dreiecke + ' + extras + ' eigene Netze (any ' + hideCounts.any + ' / most ' + hideCounts.most + ' / all ' + hideCounts.all + ')'
    + ' · offene Kanten am Schädel: ' + openEdges + (openEdges ? ' (unterste ' + report.open.belowSkull + ' unter der Schädelunterkante)' : ''));

  return {
    status: 'OK', schema: SCHEMA, group: pivot, inner: fInner, box: fBox, size: fs, head: host.head, report,
    faceCtx() { return { THREE: T, inner: fInner, o: {}, _squash: null, getFaceShells: () => [] }; },
    setPlace(patch) {
      Object.assign(P, patch || {});
      applyPlace();
      fInner.position.copy(pivot.position);
      const kk = (P.size * H.y) / (dSize.y || 1);
      fInner.scale.setScalar(kk / k);   // die Gesichtsbox wächst mit dem Kopf, die Rigs merken es an ihrem Rahmen
      return { size: P.size, dy: P.dy, dz: P.dz, tilt: P.tilt };
    },
    place() { return Object.assign({}, P); },
    setColor(hex) { mat.color.set(hex); matLight.color.set(hex); },
    dispose() {
      undo.forEach((f) => { try { f(); } catch (e) {} });
      geo.dispose(); mat.dispose(); matLight.dispose();
      fgeo.dispose(); fBox.material.dispose();
      if (pivot.parent) pivot.parent.remove(pivot);
      if (fInner.parent) fInner.parent.remove(fInner);
    },
  };
}
export default buildHeadGraft;
