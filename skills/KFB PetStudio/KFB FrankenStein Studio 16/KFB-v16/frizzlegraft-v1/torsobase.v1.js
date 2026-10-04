/* KFB · TORSO-SCHNITT UND BASIS  ·  torsobase-v1  ·  12.09.2026
 *
 * WOFÜR (Georg 12.09.): »neben der Badewanne wollen wir das Modell auch ohne Hüfte zeigen — nur den
 * Oberkörper, auf eine Basis gesetzt; Basis und Oberkörper setzen wir dann auf Fahrzeuge.«
 *
 * WARUM DAS HIER WOHNT UND NICHT IM BLATT: es ist dasselbe Werkzeug, das `headgraft` am Wirtskopf
 * benutzt — ein Netz wird an einer GEMESSENEN Linie geteilt, der eine Anteil bekommt ein
 * unsichtbares Material, nichts wird gelöscht, alles ist rücknehmbar. Ein zweites Blatt (Mech &
 * Vehicle Rig) und das Studio können denselben Schnitt fahren, ohne ihn zu kopieren.
 *
 * ⚠ ZWEI GEMESSENE GRENZEN, DAMIT NIEMAND SIE NACHZAHLT:
 *   · Der Schnitt liest die BINDELAGE der Netzpunkte (`position` × `matrixWorld`), nicht die
 *     verformte Haltung. Bei einer stehenden Figur ist das die Wahrheit; in einer Sitzhaltung
 *     liegen die Beine woanders als ihre Bindelage — deshalb wird der Schnitt vor dem Posieren
 *     gefahren und der Rest der Figur ohnehin ausgeblendet.
 *   · Die Hüftlinie kommt aus dem HÜFTKNOCHEN, wenn es einen gibt (`hip`/`pelvis`/`spine`), sonst
 *     aus einem Anteil der Figurenhöhe — und welcher Weg gegriffen hat, steht im Bericht.
 */

export const SCHEMA = 'kfb.torsobase/0.1';

/* Georgs Vorschlag für die Basis, geprüft (HTTP 200, autark, 14 KB). */
export const BASE_PATH = 'kenney_factory-kit_3.0/Models/GLB format/button-floor-round.glb';

const HIPBONE = /^(hips?|pelvis|spine)([._-]?\d+)?$/i;
/* ⚠ GEMESSEN UND BEZAHLT: der Knochen `Hips` ist bei diesem Spender die WURZEL, nicht das
   Hüftgelenk — er lag auf y 0,358 bei einer 3,600 hohen Figur (10 %), und der Schnitt nahm nur
   232 Dreiecke (die Schuhe). Die Hüftlinie ist die HÖHE DES OBERSCHENKELANSATZES; genau dort
   fängt das Bein an. Deshalb wird zuerst nach Beinknochen gesucht. */
const LEGBONE = /^(upper_?leg|thigh|leg|femur)/i;

/** Die Hüftlinie in WELTHÖHE. `share` ist der Rückfall als Anteil der Figurenhöhe. */
export function measureHipLine({ THREE, figure, share = 0.46 }) {
  figure.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(figure);
  const h = box.max.y - box.min.y;
  let bone = null;
  const legs = [];
  figure.traverse((o) => {
    if (!o.isBone) return;
    if (LEGBONE.test(o.name || '')) legs.push(o);
    if (!bone && HIPBONE.test(o.name || '')) bone = o;
  });
  if (legs.length) {
    const ys = legs.map((b) => b.getWorldPosition(new THREE.Vector3()).y);
    const y = ys.reduce((a, q) => a + q, 0) / ys.length;
    return { y, from: legs.length + ' Beinknochen (' + legs.slice(0, 2).map((b) => b.name).join(', ') + ')',
      boxY: [+box.min.y.toFixed(3), +box.max.y.toFixed(3)], height: +h.toFixed(3), share: +((y - box.min.y) / h).toFixed(3) };
  }
  if (bone) {
    const v = bone.getWorldPosition(new THREE.Vector3());
    return { y: v.y, from: 'Knochen ' + bone.name, boxY: [+box.min.y.toFixed(3), +box.max.y.toFixed(3)], height: +h.toFixed(3) };
  }
  return { y: box.min.y + h * share, from: 'Anteil ' + share + ' der Figurenhöhe (kein Hüftknochen)', boxY: [+box.min.y.toFixed(3), +box.max.y.toFixed(3)], height: +h.toFixed(3) };
}

/**
 * Schneidet ALLES unter `cutY` aus den Netzen der Figur heraus (unsichtbar, nicht gelöscht).
 * `keep` = oberer Anteil. Rückgabe trägt `undo()`.
 */
export function cutBelow({ THREE, figure, cutY, log = () => {} }) {
  const undo = [];
  let hidden = 0, kept = 0, meshes = 0, skipped = 0, jag = 0;
  const v = new THREE.Vector3();
  figure.traverse((mesh) => {
    if (!(mesh.isMesh || mesh.isSkinnedMesh) || !mesh.geometry || !mesh.geometry.index) return;
    if (mesh.userData.noMeasure || mesh.userData.kfbTorsoCut) { skipped++; return; }
    const g = mesh.geometry, pos = g.attributes.position;
    mesh.updateWorldMatrix(true, false);
    const above = new Uint8Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      if (v.y >= cutY) above[i] = 1;
    }
    const ix = g.index.array, keep = [], drop = [];
    for (let t = 0; t < ix.length; t += 3) {
      const c = above[ix[t]] + above[ix[t + 1]] + above[ix[t + 2]];
      /* Zwei von drei: ein Dreieck AUF der Linie gehört dem Oberkörper, der Saum bleibt unten —
         dieselbe Regel wie beim Hautschnitt, damit die Kante nicht zackt. */
      (c >= 2 ? keep : drop).push(ix[t], ix[t + 1], ix[t + 2]);
    }
    /* ⚠ GEORG 12.09. AM BILD: »Zacken funktionieren nicht.« Richtig — und sie sind unvermeidlich,
       solange nur der INDEX geteilt wird: das Netz hat keine Punkte auf der Schnittebene, also
       läuft die Kante über vorhandene Dreieckskanten und der Saum bekommt Spitzen. Statt ein
       aufwendiges Planschneiden zu bauen, wird die Spitzentiefe GEMESSEN — wie weit behaltene
       Geometrie unter die Linie reicht — und die Basis genau so weit höher gesetzt. Was unter der
       Sockeloberkante liegt, ist verdeckt; die Zahl steht im Bericht statt in meinem Bauchgefühl. */
    for (let t = 0; t < keep.length; t++) {
      v.fromBufferAttribute(pos, keep[t]).applyMatrix4(mesh.matrixWorld);
      if (v.y < cutY) jag = Math.max(jag, cutY - v.y);
    }
    if (!drop.length) { kept += keep.length / 3; return; }
    const oldIndex = g.index, oldGroups = g.groups.map((x) => Object.assign({}, x)), oldMat = mesh.material;
    const list = Array.isArray(oldMat) ? oldMat.slice() : [oldMat];
    const blank = new THREE.MeshBasicMaterial({ visible: false });
    blank.name = 'kfb-cut-away';
    const blankIx = list.length; list.push(blank);
    g.setIndex(keep.concat(drop));
    g.clearGroups();
    g.addGroup(0, keep.length, 0);
    g.addGroup(keep.length, drop.length, blankIx);
    mesh.material = list;
    mesh.userData.kfbTorsoCut = true;   // ein Eigentümer je Netz (Hausregel aus headgraft)
    hidden += drop.length / 3; kept += keep.length / 3; meshes++;
    undo.push(() => {
      g.setIndex(oldIndex); g.clearGroups();
      oldGroups.forEach((x) => g.addGroup(x.start, x.count, x.materialIndex));
      mesh.material = oldMat; blank.dispose();
      delete mesh.userData.kfbTorsoCut;
    });
  });
  log('Torso-Schnitt bei y ' + cutY.toFixed(3) + ': ' + Math.round(hidden) + ' Dreiecke unsichtbar, '
    + Math.round(kept) + ' bleiben, ' + meshes + ' Netze geteilt · Zackentiefe ' + jag.toFixed(3)
    + (skipped ? ' (' + skipped + ' übersprungen)' : ''));
  return {
    status: meshes ? 'OK' : 'NICHTS_GESCHNITTEN',
    cutY: +cutY.toFixed(4), hiddenTris: Math.round(hidden), keptTris: Math.round(kept), meshes, skipped,
    jag: +jag.toFixed(4),
    undo: () => { undo.slice().reverse().forEach((f) => { try { f(); } catch (e) {} }); },
  };
}

/**
 * Die Basis unter den Oberkörper. Der Maßstab kommt aus der BREITE der geschnittenen Figur
 * (gemessen, nicht gewählt), `widthK` ist die Zugabe am Regler. Die Oberkante der Basis liegt
 * auf der Schnittlinie — dort steht der Oberkörper auf.
 */
export async function buildBase({ THREE, loader, url, figure, cutY, widthK = 1.2, sink = 0, bury = 0, axis = null, log = () => {} }) {
  const gltf = await loader.loadAsync(url);
  const g = gltf.scene;
  g.name = 'kfb-base';
  g.traverse((o) => { o.userData.noMeasure = true; if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const raw = new THREE.Box3().setFromObject(g);
  const rawW = Math.max(1e-4, Math.max(raw.max.x - raw.min.x, raw.max.z - raw.min.z));
  const rawH = Math.max(1e-4, raw.max.y - raw.min.y);
  /* ⚠ DIE BREITE AM SCHNITT, NICHT DIE DES GANZEN OBERKÖRPERS. Erste Fassung nahm die Box aller
     Netze über der Linie — das sind bei dieser Figur Ohren und Arme, also 2,554 breit, und die
     Basis wurde 3,065 groß. Gemessen wird jetzt der QUERSCHNITT in einem Band direkt über dem
     Schnitt: das ist die Fläche, auf der der Oberkörper aufsitzt. */
  const fb = new THREE.Box3();
  figure.updateMatrixWorld(true);
  const figBox = new THREE.Box3().setFromObject(figure);
  const figH = Math.max(0.02, figBox.max.y - figBox.min.y);
  /* \u26a0 ZWEITER ANLAUF, GEMESSEN: ein Band von 18 % der Resth\u00f6he f\u00e4ngt bei steigender Schnittlinie\n     die ARME ein \u2014 Querschnitt sprang von 1,33 auf 3,13, die Basis auf 3,75. Also eine D\u00dcNNE\n     Scheibe (4 % der Figurenh\u00f6he) direkt \u00fcber dem Schnitt, und die Spanne als 5-bis-95-Prozent-\n     Bereich statt als \u00c4u\u00dferstes \u2014 ein einzelner Ausrei\u00dfer (Gurt, Knopf, Ohrspitze) soll den Sockel\n     nicht bestimmen. */
  const band = Math.max(0.01, figH * 0.04);
  const xs = [], zs = [];
  const v = new THREE.Vector3();
  figure.traverse((m) => {
    if (!(m.isMesh || m.isSkinnedMesh) || m.userData.noMeasure || !m.geometry) return;
    const pos = m.geometry.attributes.position; if (!pos) return;
    m.updateWorldMatrix(true, false);
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
      if (v.y >= cutY && v.y <= cutY + band) { fb.expandByPoint(v); xs.push(v.x); zs.push(v.z); }
    }
  });
  const pct = (arr, q) => { if (!arr.length) return 0; const a = arr.slice().sort((p, n) => p - n); return a[Math.min(a.length - 1, Math.max(0, Math.round(q * (a.length - 1))))]; };
  const spanX = xs.length ? pct(xs, 0.95) - pct(xs, 0.05) : 0;
  const spanZ = zs.length ? pct(zs, 0.95) - pct(zs, 0.05) : 0;
  const torsoW = fb.isEmpty() ? rawW : Math.max(0.02, Math.max(spanX, spanZ));
  const k = (torsoW * widthK) / rawW;
  /* v15 · Georg 12.09.: »die Base ist zu klein — muß ebenfalls in 3 Ebenen skalierbar sein.«
     Also drei Faktoren OBEN DRAUF auf den gemessenen Sitz: Breite, Höhe, Länge. 1/1/1 = der
     gemessene Sitz mit der Form des Spendermodells. */
  const ax = axis || {};
  const fx = ax.x == null ? 1 : ax.x, fy = ax.y == null ? 1 : ax.y, fz = ax.z == null ? 1 : ax.z;
  g.scale.set(k * fx, k * fy, k * fz);
  g.updateMatrixWorld(true);
  const scaled = new THREE.Box3().setFromObject(g);
  const topLocalOffset = scaled.max.y - g.position.y;      // Abstand Oberkante ↔ Knoten
  /* Die Oberkante liegt um `bury` ÜBER der Schnittlinie — dort verschwinden die Zacken des Saums
     (gemessen von `cutBelow` als `jag`). `sink` bleibt der Regler von Hand. */
  const topWant = cutY + bury - sink;
  g.position.y += topWant - scaled.max.y;
  g.position.x += ((fb.isEmpty() ? 0 : (fb.max.x + fb.min.x) / 2) - (scaled.max.x + scaled.min.x) / 2);
  g.position.z += ((fb.isEmpty() ? 0 : (fb.max.z + fb.min.z) / 2) - (scaled.max.z + scaled.min.z) / 2);
  g.updateMatrixWorld(true);
  const after = new THREE.Box3().setFromObject(g);
  const report = {
    schema: SCHEMA, file: String(url).split('/').pop(),
    torsoWidth: +torsoW.toFixed(3), widthK: +widthK.toFixed(2), scale: +k.toFixed(4), band: +band.toFixed(3),
    axis: [+fx.toFixed(2), +fy.toFixed(2), +fz.toFixed(2)],
    baseRaw: [+rawW.toFixed(3), +rawH.toFixed(3)],
    baseSize: [+(after.max.x - after.min.x).toFixed(3), +(after.max.y - after.min.y).toFixed(3), +(after.max.z - after.min.z).toFixed(3)],
    topY: +after.max.y.toFixed(3), bottomY: +after.min.y.toFixed(3), cutY: +cutY.toFixed(3),
    bury: +bury.toFixed(4), sink: +sink.toFixed(3),
    topOffset: +topLocalOffset.toFixed(3),
  };
  log('Basis ' + report.file + ' ×' + report.scale + ' → ' + report.baseSize.join(' × ')
    + ' · Oberkante ' + report.topY + ' auf Schnitt ' + report.cutY);
  return {
    status: 'OK', group: g, report,
    setAxis: (q) => { const a2 = q || {};
      g.scale.set(k * (a2.x == null ? fx : a2.x), k * (a2.y == null ? fy : a2.y), k * (a2.z == null ? fz : a2.z));
      g.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(g); g.position.y += topWant - b2.max.y; g.updateMatrixWorld(true);
      const b3 = new THREE.Box3().setFromObject(g);
      return [+(b3.max.x - b3.min.x).toFixed(3), +(b3.max.y - b3.min.y).toFixed(3), +(b3.max.z - b3.min.z).toFixed(3)]; },
    setWidthK: (q) => { const kk = (torsoW * q) / rawW; g.scale.setScalar(kk); g.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(g); g.position.y += topWant - b2.max.y; g.updateMatrixWorld(true); return kk; },
    dispose: () => {
      if (g.parent) g.parent.remove(g);
      g.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => m && m.dispose && m.dispose()); });
    },
  };
}

export default { SCHEMA, BASE_PATH, measureHipLine, cutBelow, buildBase };
