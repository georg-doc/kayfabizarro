/* carlrig-mount.v1 · CapsuleCarl als Bewohner des Studios (`kind:'capsule'`, `module:'CarlRig'`).
 *
 * Dieselbe Reihenfolge wie in der Rigging-Werkbank, hier als EIN Aufruf für einen Wirt, der
 * bereits Szene und Renderer hat. Keine zweite Geometrie-Pipeline: `splitIslands`,
 * `flattenRecesses`, `buildFace` kommen unveraendert aus `lab-v4/carlrig.js` — dieselbe Datei,
 * die die Werkbank benutzt. Was hier neu ist, ist nur die REIHENFOLGE für EINEN Aufrufer statt
 * einer ganzen Oberfläche mit Reglern.
 *
 * `pet` ist der Vertrags-Eintrag (`kfb.pets/1`, Feld `eye`/`mouth`/`brow`/`nose`/`zones` — dieselbe
 * Form, die `carl-contract.v1.js`s `toPets1` erzeugt). Ohne Eintrag gelten Carls GEMESSENE
 * Vorgaben, dieselben wie am Anfang der Werkbank.
 */
import { splitIslands, flattenRecesses, partsInsideBoxes, buildFace, setZoneStyle, setFaceVisible } from '../lab-v4/carlrig.js';
import { auditModel } from '../lab-v2/audit.js';
import { paintOverRegion } from './texclean.js';
import { findFaceParts, PartRig, DEFAULTS as PART_FIELDS } from './partrig.v1.js';
import { nameIslands } from './zonenames.v4.js';

export const CARL_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf';
/* Startzustand der Zonen, 1:1 aus der Werkbank: die Teile IN der alten Mundhöhle, plus Carls
   eigene Pupillen (sie liegen unter dem montierten Gesicht). Nur der RÜCKFALL, wenn der Vertrag
   für eine Zone nichts sagt — ein Vertrag mit `zones` gewinnt immer. */
const HIDE_START = [5, 6, 7, 13, 14];
const EYE_DEF = { dx: 0.164, dy: 0.317, ring: 0.13, track: 0.04, pupilSize: 0.40, lidFit: 0.92, gloss: 0.90, lashLength: 0.45, lashDensity: 7, lashWidth: 1 };

export async function mountCarl({ THREE, loader, scene, mods, pet }) {
  const res = await auditModel({ THREE, loader, url: CARL_URL, label: 'CapsuleCarl', path: CARL_URL, log: () => {} });
  if (res.status === 'LOAD_FAILED') throw new Error('CapsuleCarl load failed: ' + res.error);
  const parts = splitIslands({ THREE, mesh: res.meshes[0] });
  const body = parts[0]; body.mesh.name = 'body';
  const group = new THREE.Group(); group.name = 'capsule-carl';
  parts.forEach((p) => group.add(p.mesh));
  scene.add(group);

  const heal = flattenRecesses({ THREE, part: body, minInset: 0.0015, minPoints: 4, grow: 3 });
  const inCavity = partsInsideBoxes({ THREE, parts, boxesLocal: heal.holeBoxesLocal, excludeIsland: body.island });
  const clean = paintOverRegion({ THREE, mesh: body.mesh, boxesLocal: heal.boxesLocal });
  if (clean.map) { body.mesh.material.map = clean.map; body.mesh.material.needsUpdate = true; }

  /* `eye.lashes {length,density,width}` ist die kfb.pets/1-Form (toPets1), `lashLength/…` die flache der
     Werkbank — beide gelten, die verschachtelte gewinnt (14.09.: vorher fiel sie still auf EYE_DEF). */
  const pe = (pet && pet.eye) || {}, la = pe.lashes || {};
  const eye = { ...EYE_DEF, ...pe, lashLength: la.length ?? pe.lashLength ?? EYE_DEF.lashLength, lashDensity: la.density ?? pe.lashDensity ?? EYE_DEF.lashDensity, lashWidth: la.width ?? pe.lashWidth ?? EYE_DEF.lashWidth };
  const eyeY = (heal.capsule.capCentres[0] + heal.capsule.capCentres[1]) / 2 + eye.dy;
  const faceParts = findFaceParts({ THREE, parts, eyeAnchor: { y: eyeY, ring: eye.ring }, hullR: heal.capsule.r });
  const origBrow = faceParts.brows.length ? new PartRig({ THREE, parts, islands: faceParts.brows, label: 'brow' }) : null;
  const origNose = faceParts.nose != null ? new PartRig({ THREE, parts, islands: [faceParts.nose], label: 'nose' }) : null;

  const face = buildFace({ THREE, partsGroup: group, mods, opts: {
    mouthSet: (pet && pet.mouth && pet.mouth.set) || 'red',
    eyeAnchor: { dx: eye.dx, dy: eye.dy, ring: eye.ring, track: eye.track },
    lidFit: eye.lidFit, pupilSize: eye.pupilSize, gloss: eye.gloss,
    lashes: { length: eye.lashLength, density: eye.lashDensity, width: eye.lashWidth },
  } });

  const brow = (pet && pet.brow) || {}, nose = (pet && pet.nose) || {};
  /* 14.09. · R1 aus dem ToolBox-Review, hier nachgemessen: `PartRig.set()` bricht beim ERSTEN unbekannten
     Feld ab (`{status:'UNSUPPORTED', field}`) und ruft `apply()` nicht — der alte Aufruf schickte `mod`,
     `original`, `drawn`, `graft` mit, also kam von Georgs gespeicherter Kalibrierung (Nase scale 1.34,
     lift −0.02, depth −0.066) NICHTS an; die Teile standen auf Defaults. Auch das nackte Entpacken von
     `original` reicht nicht, weil dort `islands` mitliegt. Darum: nur die erlaubten Felder übergeben und
     den Rückgabestatus AUSWERTEN. `PartRig` bleibt streng — ein falscher Aufruf darf nicht grün werden. */
  const only = (src, allowed) => { const out = {}; if (!src) return out; for (const k of Object.keys(allowed)) if (src[k] !== undefined) out[k] = src[k]; return out; };
  const applied = [], rejected = [];
  const put = (rig, patch, label) => {
    if (!rig || !rig.set) return;
    const r = rig.set(patch) || { status: 'OK' };
    if (r.status === 'OK') applied.push(label + ': ' + Object.keys(patch).join(','));
    else { rejected.push(label + ': ' + r.status + ' ' + r.field + ' (' + r.reason + ')'); console.warn('[carlrig-mount] ' + label + ' abgewiesen:', r); }
  };
  /* Eigene Teile: Kalibrierung aus `*.original`, Sichtbarkeit aus `mod` (der Mode entscheidet, nicht
     `original.enabled` — der trägt in Georgs Datei `false`, weil die Werkbank ihn getrennt schaltet). */
  put(origBrow, { ...only(brow.original, PART_FIELDS), enabled: brow.mod === 'block' }, 'origBrow');
  put(origNose, { ...only(nose.original, PART_FIELDS), enabled: nose.mod === 'original' }, 'origNose');
  /* Gezeichnete Teile: ihre Regler liegen im Eintrag FLACH (so schreibt sie `toPets1`), gefiltert gegen
     die DEFAULTS des jeweiligen Moduls — vorher kam nur `enabled` an (R2). */
  if (face.browRig) put(face.browRig, { ...only(brow, (mods.brow && mods.brow.DEFAULTS) || {}), enabled: brow.mod !== 'block' }, 'browRig');
  if (face.noseRig) put(face.noseRig, { ...only(nose, (mods.nose && mods.nose.DEFAULTS) || {}), enabled: nose.mod !== 'original' }, 'noseRig');
  if (face.moustache) { const st = (pet && pet.moustache) || {}; if (st.form && face.moustache.style) face.moustache.style(st.form); put(face.moustache, { ...only(st, (mods.stache && mods.stache.DEFAULTS) || {}), enabled: !!st.enabled }, 'moustache'); }
  if (face.mouth && pet && pet.mouth) { const r = face.mouth.setParams(pet.mouth); if (r && r.status && r.status !== 'OK') rejected.push('mouth: ' + JSON.stringify(r)); else applied.push('mouth: ' + Object.keys(pet.mouth).join(',')); }
  /* Augenfarben: der Übersetzer exportiert `eye.colors {ball,lid,lash,pupil}`, EyeRig v6 kennt nur
     `setBaseColor` (Lid-/Grundfarbe). Was ankommt, wird gesetzt; der Rest steht als NICHT ANGEWANDT im
     Bericht, statt still zu verschwinden. */
  const ec = pe.colors || {};
  if (face.eyeRig && face.eyeRig.setBaseColor && ec.lid) { face.eyeRig.setBaseColor(ec.lid); applied.push('eye.colors.lid → setBaseColor'); }
  for (const k of ['ball', 'lash', 'pupil']) if (ec[k]) rejected.push('eye.colors.' + k + ': NICHT ANGEWANDT — EyeRig v6 hat keinen Griff dafür');

  /* Zonen: ein Vertrag mit benannten Zonen (`{island, hidden, color}`, aus `toPets1`) gewinnt
     Feld für Feld; ohne Vertrag gilt der gemessene Startzustand der Werkbank. */
  const zones = (pet && pet.zones) || [];
  parts.forEach((p, i) => {
    const z = zones.find((zz) => zz.island === i + 1);
    const hidden = z ? !!z.hidden : (HIDE_START.indexOf(i) >= 0 || inCavity.indexOf(i) >= 0);
    setZoneStyle(p, { hidden, color: z ? (z.color || null) : null });
  });

  const names = nameIslands({ THREE, parts, capsule: heal.capsule, inCavity,
    brows: faceParts.brows, nose: faceParts.nose, eyeAnchor: { dx: eye.dx, y: eyeY } });

  return {
    group, parts, face, heal, clean, names, origBrow, origNose, faceParts,
    /* Was von der Datei wirklich ankam — die Feldliste, die das Review verlangt (R2). Ein Consumer loggt
       sie einmal und sieht, ob seine Einstellung gilt: `applied` gesetzt, `rejected` begründet abgewiesen. */
    report: { schema: 'kfb.carlrig-mount/1', islands: parts.length, hidden: parts.filter((p) => p.mesh.visible === false).length,
      mouthSet: (face.mouth && (face.mouth.setId || (face.mouth.p && face.mouth.p.set))) || null,
      brow: brow.mod || null, nose: nose.mod || null, applied, rejected, face: (face.report || []) },
    setVisible: (on) => { setFaceVisible(face, on); },
    update(dt) {
      if (face.eyeRig && face.eyeRig.update) face.eyeRig.update(dt);
      if (face.browRig && face.browRig.sync) face.browRig.sync();
      if (face.noseRig && face.noseRig.sync) face.noseRig.sync();
      if (face.moustache && face.moustache.sync) face.moustache.sync();
      if (face.mouth && face.mouth.update) face.mouth.update(dt);
    },
    /* 14.09. · R7: vorher nur `removeFromParent()` — bei häufigem Figurwechsel bleiben Geometrie, Material
       und die nachgezeichnete Textur im Speicher. Jetzt wird freigegeben, was dieser Bau angelegt hat;
       die Gesichtsmodule räumen selbst auf, wo sie ein `dispose` haben. */
    dispose() {
      const t = (fn) => { try { fn(); } catch (e) {} };
      for (const r of [face.eyeRig, face.browRig, face.noseRig, face.moustache, face.mouth]) if (r && r.dispose) t(() => r.dispose());
      if (clean && clean.map && clean.map.dispose) t(() => clean.map.dispose());
      group.traverse((o) => { if (!o.isMesh) return; if (o.geometry && o.geometry.dispose) t(() => o.geometry.dispose()); [].concat(o.material || []).forEach((m) => { if (m && m.dispose) t(() => m.dispose()); }); });
      group.removeFromParent();
    },
  };
}
