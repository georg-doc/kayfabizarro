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
import { findFaceParts, PartRig } from './partrig.v1.js';
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
  if (origBrow) origBrow.set({ ...brow, enabled: brow.mod === 'block' });
  if (origNose) origNose.set({ ...nose, enabled: nose.mod === 'original' });
  if (face.browRig) face.browRig.set({ enabled: brow.mod !== 'block' });
  if (face.noseRig) face.noseRig.set({ enabled: nose.mod !== 'original' });
  if (face.moustache) face.moustache.set({ enabled: !!(pet && pet.moustache && pet.moustache.enabled) });
  if (face.mouth && pet && pet.mouth) face.mouth.setParams(pet.mouth);

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
    setVisible: (on) => { setFaceVisible(face, on); },
    update(dt) {
      if (face.eyeRig && face.eyeRig.update) face.eyeRig.update(dt);
      if (face.browRig && face.browRig.sync) face.browRig.sync();
      if (face.noseRig && face.noseRig.sync) face.noseRig.sync();
      if (face.moustache && face.moustache.sync) face.moustache.sync();
      if (face.mouth && face.mouth.update) face.mouth.update(dt);
    },
    dispose() { group.removeFromParent(); },
  };
}
