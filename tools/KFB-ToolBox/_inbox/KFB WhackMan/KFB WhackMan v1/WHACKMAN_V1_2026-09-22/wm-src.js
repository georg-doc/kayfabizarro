/* KFB WhackMan v1 · Legacy-Zugang
   Nur das, was der Resident Atlas besitzt, durchgereicht. Kein eigener Lader, kein eigener
   Katalog, keine eigene Messung. Der Dungeon geht über kit-lab/dungeon-grid (siehe wm-kit.js),
   Tiny Treats über einen Eintrag in kit-lab PACKS. */

import {
  loadAsset, instance, measure, measured, legacyAssemble, LEGACY_RIG, PIN
} from './tools/resident_atlas_s6/lib/atlas.js';

export { LEGACY_RIG, measured, loadAsset, instance, measure, legacyAssemble };
export const LEGACY_PIN = PIN.legacy;

const LEG = 'media/3D_Assets/KayKit Legacy/';
export const P = {
  rig: LEGACY_RIG,
  pete: LEG + 'KayKit Character Animations 1.2 - legacy/Models/gltf/PrototypePete.gltf',
  orcA: LEG + 'Orc Warband - legacy/characters/gltf/character_orcA.gltf',
  orcB: LEG + 'Orc Warband - legacy/characters/gltf/character_orcB.gltf'
};

const n3 = (v) => Math.round(v * 1000) / 1000;

export function evidence(path, rev, extra = {}) {
  const m = measured.get(path);
  if (!m) return { path, rev, status: 'NICHT GELADEN', ...extra };
  return {
    path, rev, name: m.name,
    size: m.size.map(n3), min: m.min.map(n3), max: m.max.map(n3),
    skin: m.skin, joints: m.joints.length, jointNames: m.joints,
    clips: m.clips.length, clipNames: m.clips,
    status: 'GELADEN', ...extra
  };
}

/* 30 Clips in EINER Datei — das ist die Legacy-Architektur, gemessen in atlas.js. */
export async function legacyClips() {
  const g = await loadAsset(P.rig, PIN.legacy);
  return g.animations;
}

/* PrototypePete ist der geskinnte Referenzkörper IM Rig-File, nicht ein zweites Modell. */
export async function petePlayer() {
  const root = await instance(P.rig, PIN.legacy);
  let skinned = 0, bones = 0;
  root.traverse((o) => { if (o.isSkinnedMesh) skinned++; if (o.isBone) bones++; });
  return { root, skinned, bones };
}

/* Orc A/B sind 0-Bone-Teilfiguren. Zusammengesetzt wird ausschliesslich über den Owner. */
export async function legacyActor(partsPath, rev = PIN.legacy) {
  /* Die Figur darf auf einer anderen Revision liegen als das Rig: der Legacy-Pin ist älter als
     manche Pakete (gemessen: das Skeletons-Paket antwortet dort mit 404, auf main mit 200).
     Das Rig bleibt am Pin — es ist die Architekturquelle und darf nicht wandern. */
  const root = await legacyAssemble(partsPath, P.rig, rev);
  return { root, report: root.userData.legacy };
}

export function pickClip(clips, ...patterns) {
  for (const rx of patterns) {
    const hit = clips.find((c) => rx.test(c.name));
    if (hit) return hit;
  }
  return null;
}
