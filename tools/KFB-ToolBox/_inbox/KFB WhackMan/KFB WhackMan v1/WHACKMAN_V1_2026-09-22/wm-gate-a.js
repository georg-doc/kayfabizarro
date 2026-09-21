/* KFB WhackMan v1 · GATE A — Spenderlage
   Georgs Korrektur vom 2026-09-20: KFB hat Katalog, Messung, Generator und Editor bereits.
   Gate A baut deshalb KEIN zweites Messlabor. Es zeigt nur noch, was kein bestehender
   Eigentümer als laufendes Objekt beweist:

     · den Legacy-SPIELER (geskinnt, 6 Bones, 30 Clips in einer Datei) in Bewegung;
     · den Legacy-VERFOLGER (0-Bone-Teilfigur) über den Owner-Weg legacyAssemble() in Bewegung;
     · den offenen MISSING_DELTA: LegacyFaceHost für den bestehenden EyeRig v6.

   Alles andere steht bei seinem Eigentümer und wird hier nur benannt, nicht nachgebaut:
     Dungeon-Katalog + Messung  → KayKit_Dungeon_Model_S13.html / HANDOFF_dungeon_S13.md
     Dungeon-Generator + Editor → KayKit_Dungeon_Generator_S13_2.html · S14/S21
     Asset-Katalog / Discovery  → registry/assets/v1 · tools/asset_registry/librarian
     Legacy-Rig-Fakten (Text)   → tools/resident_atlas_s6/tools/legacy-rig-probe.html
     EyeRig v6                  → kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js */

import * as THREE from 'three';
import { P, LEGACY_PIN, petePlayer, legacyActor, legacyClips, pickClip, evidence } from './wm-src.js';

export const OWNERS = [
  ['Dungeon-Katalog + Messung', 'tools/world_atlas/source/KayKit_Dungeon_Model_S13.html', 'konsumiert über kit-lab + dungeon-grid'],
  ['Messregel („nicht neu messen")', 'tools/world_atlas/docs/HANDOFF_dungeon_S13.md', 'befolgt'],
  ['Dungeon-Generator', 'tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html', 'Kit-Builder verbatim übernommen'],
  ['Fugenmodell / Platzierung', 'tools/world_atlas/source/lib/dungeon-grid.js', 'layout() wird aufgerufen'],
  ['Dungeon-Licht', 'tools/world_atlas/source/lib/dungeon-light.js', 'measureFlame wird aufgerufen'],
  ['Editor / Recipe-Patch', 'S14 / S21', 'unberührt · WhackMan schreibt keinen zweiten Editor'],
  ['Asset-Katalog / Discovery', 'registry/assets/v1 · tools/asset_registry/librarian', 'Tiny Treats nur als PACKS-Eintrag, bis ein AssetRef vorliegt'],
  ['Legacy-Architektur', 'tools/resident_atlas_s6/lib/atlas.js (legacyAssemble)', 'wird aufgerufen'],
  ['EyeRig v6', 'kfb-rigs-embed-v3/…/pet-eye-rig.v6.js', 'gesperrt bis LegacyFaceHost steht']
];

export const MISSING_DELTA = [
  ['LegacyFaceHost', 'OFFEN', 'Kopfteil + Kopfbone der assemblierten Legacy-Figur vermessen, damit der BESTEHENDE EyeRig v6 montierbar wird. Brief §4 / Stop-Gate 3.'],
  ['Kit-Builder', 'UMGANGEN', 'Der Block, der aus den Owner-Messfunktionen das kit-Objekt baut, liegt inline in S13.2 statt in dungeon-grid.js. Verbatim übernommen in wm-kit.js — gehört beim Owner hochgezogen.'],
  ['Modell aus Handschrift', 'NEU', 'Der Owner kennt nur generate() (Zufall) als Eingang in seine Modellform. Brief §6 verlangt eine autorierte Karte — wm-recipe.js baut den fehlenden Eingang, nach den Regeln des Owners.'],
  ['KayKit Bits Bundle 1', 'SOURCE_REQUIRED', 'PR #144 aus dieser Umgebung nicht lesbar. Nicht rekonstruiert.']
];

function plinth(w, d) {
  const g = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.16, d),
    new THREE.MeshStandardMaterial({ color: 0x2a2336, roughness: 0.95 })
  );
  g.position.y = -0.08;
  g.receiveShadow = true;
  return g;
}

function stand(node, targetH) {
  const holder = new THREE.Group();
  const b0 = new THREE.Box3().setFromObject(node);
  const s0 = b0.getSize(new THREE.Vector3());
  const k = targetH / Math.max(s0.y, 1e-4);
  node.scale.setScalar(k);
  node.updateMatrixWorld(true);
  const b1 = new THREE.Box3().setFromObject(node);
  const c1 = b1.getCenter(new THREE.Vector3());
  node.position.sub(new THREE.Vector3(c1.x, b1.min.y, c1.z));
  node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  holder.add(node);
  holder.add(plinth(2.6, 2.6));
  holder.userData.shownScale = Math.round(k * 1000) / 1000;
  holder.userData.trueHeight = Math.round(s0.y * 1000) / 1000;
  return holder;
}

export async function buildGateA({ scene, onProgress = () => {}, label = () => {} }) {
  const root = new THREE.Group();
  root.name = 'gateA';
  scene.add(root);

  const report = { gate: 'A', owners: OWNERS, delta: MISSING_DELTA, actors: [], errors: [], pin: LEGACY_PIN };
  const mixers = [];
  const views = [];
  let clips = [];

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0x1b1626, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  /* Was gerahmt werden darf. Die Bodenplatte gehört NICHT dazu — sonst rahmt „alle" 60 Einheiten
     Studioboden statt der Akteure, und die stehen als Briefmarken in der Mitte. */
  const content = new THREE.Group();
  root.add(content);

  onProgress('A · Legacy-Rig wird geladen …');
  try {
    clips = await legacyClips();
    report.legacyClips = clips.map((c) => c.name);
  } catch (e) {
    report.errors.push({ station: 'A-Rig', error: e.message });
  }
  const walk = pickClip(clips, /^Walk$/i, /walk/i, /run/i, /idle/i);

  /* ---------- A1 · Spieler ---------- */
  try {
    const pete = await petePlayer();
    const holder = stand(pete.root, 2.6);
    holder.position.x = -3.6;
    content.add(holder);
    const mx = new THREE.AnimationMixer(pete.root);
    if (walk) mx.clipAction(walk).play();
    mixers.push(mx);
    views.push({ id: 'A1', title: 'A1 · Spieler', group: holder });
    label({ kind: 'station', anchor: holder, y: 0, station: 'A1',
      title: 'A1 · PrototypePete · Rig_Legacy',
      sub: `${pete.bones} Bones · ${clips.length} Clips in EINER Datei · läuft ${walk ? walk.name : '—'}` });
    report.actors.push(evidence(P.rig, LEGACY_PIN, {
      rolle: 'Spieler', skinnedMeshes: pete.skinned, bonesInScene: pete.bones,
      playing: walk ? walk.name : null, trueHeight: holder.userData.trueHeight,
      shownScale: holder.userData.shownScale
    }));
  } catch (e) {
    report.errors.push({ station: 'A1', error: e.message });
  }

  /* ---------- A2 · Verfolger ---------- */
  try {
    const orc = await legacyActor(P.orcA);
    const holder = stand(orc.root, 2.6);
    holder.position.x = 3.6;
    content.add(holder);
    const mx = new THREE.AnimationMixer(orc.root);
    if (walk) mx.clipAction(walk).play();
    mixers.push(mx);
    views.push({ id: 'A2', title: 'A2 · Verfolger', group: holder });
    label({ kind: 'station', anchor: holder, y: 0, station: 'A2',
      title: 'A2 · character_orcA · legacyAssemble()',
      sub: `${orc.report.placed.length}/4 Teile an Bones · fehlend: ${orc.report.missing.length ? orc.report.missing.join(', ') : 'keins'}` });
    report.actors.push(evidence(P.orcA, LEGACY_PIN, {
      rolle: 'Erster Verfolger', assembled: orc.report.placed, missing: orc.report.missing,
      rig: orc.report.rig, playing: walk ? walk.name : null,
      trueHeight: holder.userData.trueHeight, shownScale: holder.userData.shownScale
    }));
  } catch (e) {
    report.errors.push({ station: 'A2', error: e.message });
  }

  /* ---------- A3 · MISSING_DELTA · bewusst LEER ---------- */
  const gap = new THREE.Group();
  gap.position.x = 10.8;
  gap.add(plinth(3.2, 3.2));
  content.add(gap);
  views.push({ id: 'A3', title: 'A3 · LegacyFaceHost', group: gap });
  label({ kind: 'station', anchor: gap, y: 0, station: 'A3',
    title: 'A3 · LegacyFaceHost · OFFEN',
    sub: 'der einzige erlaubte Neu-Messauftrag' });

  return {
    root, content, report, views,
    update(dt) { for (const m of mixers) m.update(dt); }
  };
}
