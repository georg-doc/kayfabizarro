/* KFB Town Resident Atlas · shared viewer + vignette builder
   Reads real repository assets by exact path. Every path in data/cast.js comes from a
   kfb.asset-handoff.v1 export or a kfb.asset-pack.v1 registry shard — nothing is inferred.
   Status of everything this module produces: candidate-only. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as skinClone } from 'three/addons/utils/SkeletonUtils.js';
import { juggleTiming, clubState, handPulse } from './juggle-math.js';

THREE.Cache.enabled = true;

export const REPO = 'georg-doc/kayfabizarro';
/* pinned source commits — evidence, not convenience */
export const PIN = {
  assets: '891eadf01e218f5fc21387e64cea1fec8332c5b6', // kfb-asset-handoff-animation-lab (2).json
  anims: 'aa16a777a970f23d3f11fb3c23dc40718b04fa88',  // registry shard kaykit-character-animations-1-1
  /* Der Legacy-Ordner existiert am S5-Pin noch nicht (404 geprüft). Eigener Pin aus dem
     späteren Handoff kfb-asset-handoff-animation-lab (5).json — gleiche Beweisklasse. */
  legacy: '10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0'
};
const raw = (commit, path) =>
  `https://raw.githubusercontent.com/${REPO}/${commit}/${path.split('/').map(encodeURIComponent).join('/')}`;

const loader = new GLTFLoader();
const cache = new Map();
export const measured = new Map(); // repo path -> facts

export async function loadAsset(path, commit = PIN.assets) {
  if (!cache.has(path)) {
    cache.set(path, loader.loadAsync(raw(commit, path)).then((g) => {
      const box = new THREE.Box3().setFromObject(g.scene);
      const s = box.getSize(new THREE.Vector3());
      const joints = new Set();
      let skin = false;
      g.scene.traverse((o) => {
        if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
        if (o.isSkinnedMesh) { skin = true; o.skeleton.bones.forEach((b) => joints.add(b.name)); }
      });
      measured.set(path, {
        path,
        name: path.split('/').pop().replace(/\.(glb|gltf)$/i, ''),
        size: [s.x, s.y, s.z],
        min: box.min.toArray(),
        max: box.max.toArray(),
        skin,
        joints: [...joints].sort(),
        clips: g.animations.map((c) => c.name),
        commit
      });
      return g;
    }));
  }
  return cache.get(path);
}

export async function instance(path, commit) {
  const g = await loadAsset(path, commit);
  return skinClone(g.scene);
}

export async function measure(path, commit) {
  await loadAsset(path, commit);
  return measured.get(path);
}

/* ---------- animation library (KayKit shared Rig_Medium / Rig_Large) ---------- */
export const ANIM_LIB = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/';
export const ANIM_SETS = ['General', 'MovementBasic', 'MovementAdvanced', 'CombatMelee', 'Simulation', 'Special', 'Tools'];

/* ---------- RIG-KLASSE 3: Rig_Legacy (gemessen, nicht angenommen) ----------
   KayKits ältere Packs laufen NICHT auf dem 23-Bone-Rig der Series-6-Figuren. Gemessen an
   `KayKit_AnimatedCharacter_v1.2.glb`: SECHS Bones — Body, Head, armLeft, handSlotLeft,
   armRight, handSlotRight — und 30 Clips, alle in EINER Datei statt in sieben Set-Dateien.
   Handslot-Namen in camelCase (`handSlotRight`), nicht `handslot.r`; `findBone()` normalisiert
   beides auf dieselbe Form und findet sie deshalb ohne Sonderfall.

   Der zweite, wichtigere Unterschied: die Legacy-FIGUREN sind gar nicht geriggt. Gemessen an
   `character_orcA.gltf`: 0 Bones, 0 Skins, und stattdessen VIER getrennte Teilgruppen
   (…Body, …Head, …ArmLeft, …ArmRight), jede in Bind-Pose-Weltlage. Eine Legacy-Figur wird
   also nicht bespielt, sondern ZUSAMMENGESETZT: Rig laden, sein Platzhalter-Mesh
   (PrototypePete) entfernen, die vier Teile an die passenden Bones hängen.

   Die Ausgleichsmatrix dafür ist nicht geschätzt: `skeleton.boneInverses[i]` IST die Inverse
   der Bind-Weltmatrix des Bones. Ein Teil in Bind-Weltlage bekommt genau diese Matrix als
   lokale Transform und sitzt damit exakt, ohne einen einzigen getippten Offset. */
export const LEGACY_ROOT = 'media/3D_Assets/KayKit Legacy/';
export const LEGACY_RIG = LEGACY_ROOT + 'KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb';
export const LEGACY_PARTS = { Body: /Body$/i, Head: /Head$/i, armLeft: /ArmLeft$/i, armRight: /ArmRight$/i };

export async function legacyAssemble(partsPath, rigPath = LEGACY_RIG, commit = PIN.legacy) {
  const root = await instance(rigPath, commit);
  const parts = await instance(partsPath, commit);
  let skel = null;
  root.traverse((o) => { if (o.isSkinnedMesh && !skel) skel = o.skeleton; });
  const placed = [], missing = [];
  root.traverse((o) => { if (o.isSkinnedMesh) o.visible = false; });

  /* Die vier Teile sind GESCHACHTELT (Head, ArmLeft, ArmRight hängen unter Body), nicht
     nebeneinander — ein Blick auf parts.children fand deshalb nur den Körper. Erst alle
     vier samt ihrer Bind-WELTmatrix sammeln, dann umhängen: beim Umhängen ändert sich die
     Elternkette, und eine danach gelesene Weltmatrix wäre die falsche. */
  parts.updateMatrixWorld(true);
  const found = {};
  parts.traverse((o) => {
    for (const [boneName, rx] of Object.entries(LEGACY_PARTS)) {
      if (!found[boneName] && rx.test(o.name)) found[boneName] = { node: o, world: o.matrixWorld.clone() };
    }
  });

  for (const [boneName] of Object.entries(LEGACY_PARTS)) {
    const bone = skel && skel.bones.find((b) => b.name === boneName);
    const hit = found[boneName];
    if (!bone || !hit) { missing.push(boneName); continue; }
    const inv = skel.boneInverses[skel.bones.indexOf(bone)];
    bone.add(hit.node);
    hit.node.matrixAutoUpdate = false;
    hit.node.matrix.copy(inv).multiply(hit.world);
    hit.node.matrixWorldNeedsUpdate = true;
    placed.push(`${hit.node.name} → ${boneName}`);
  }
  root.userData.legacy = { placed, missing, rig: rigPath, parts: partsPath };
  return root;
}

const clipCache = new Map();
/* `roots` erlaubt ZUSÄTZLICHE Bibliotheken neben der geteilten. Eintrag: String (alle Sets)
   oder { root, sets }; entdoppelt wird nach Set/Name.

   WARNUNG zur Erwartung: der erste Anlass für diesen Parameter war falsch. Ich hielt die
   pack-eigenen Rig_Medium-Sets des Ultra Turbo Hero Man für eine Erweiterung der geteilten
   Bibliothek — gemessen sind sie namensgleiche DUPLIKATE (General 15/15, MovementBasic 11/11),
   und der Mechanismus trägt dort null Clips bei. Ein pack-eigener Animations-Ordner ist kein
   Hinweis auf zusätzliche Clips; die Packs liefern die geteilten Sets unverändert mit. Der
   Parameter bleibt als Vorbereitung für einen echten Fall — wer ihn setzt, sollte vorher die
   Clipnamen beider Wurzeln vergleichen, nicht den Ordner sehen und schließen. */
export async function loadClips(rig = 'Rig_Medium', sets = ANIM_SETS, roots = [ANIM_LIB]) {
  const list = roots.map((r) => (typeof r === 'string' ? { root: r, sets } : { root: r.root, sets: r.sets || sets }));
  const key = rig + '|' + list.map((r) => r.root + ':' + r.sets.join(',')).join('|');
  if (clipCache.has(key)) return clipCache.get(key);
  /* Legacy liefert alle 30 Clips in einer Datei — kein Set-Schleifen-Pfad, eigener Zweig. */
  if (rig === 'Rig_Legacy') {
    const p = loadAsset(LEGACY_RIG, PIN.legacy)
      .then((g) => g.animations.map((c) => ({ set: 'Legacy', clip: c, name: c.name, source: LEGACY_RIG })));
    clipCache.set(key, p);
    return p;
  }
  const p = (async () => {
    const out = [];
    const seen = new Set();
    for (const r of list) {
      for (const set of r.sets) {
        const path = `${r.root}${rig}/${rig}_${set}.glb`;
        try {
          const g = await loadAsset(path, r.root === ANIM_LIB ? PIN.anims : undefined);
          for (const c of g.animations) {
            const k = set + '/' + c.name;
            if (seen.has(k)) continue;
            seen.add(k);
            out.push({ set, clip: c, name: c.name, source: path, pack: r.root !== ANIM_LIB });
          }
        } catch (e) { console.warn('anim set missing', path, e.message); }
      }
    }
    return out;
  })();
  clipCache.set(key, p);
  return p;
}

/* ---------- Farbvariante über Textur-Tausch (S28) ----------
   Mehrere Packs liefern eine zweite Textur (cleric_texture_B, animatronic_A, orcbrute_texture_B),
   die im .glb nicht verdrahtet ist — dieselbe Geometrie, andere Palette. Der Atlas hat sie
   bisher nur erwähnt. Getauscht wird auf der INSTANZ: Material klonen, damit die erste
   Instanz unberührt bleibt, Farbraum und Filter von der Originalkarte übernehmen. */
const texLoader = new THREE.TextureLoader();
const texCache = new Map();
export async function applySkin(node, path, commit = PIN.assets) {
  const url = raw(commit, path);
  if (!texCache.has(url)) texCache.set(url, texLoader.loadAsync(url));
  const tex = await texCache.get(url);
  let swapped = 0;
  node.traverse((o) => {
    if (!o.material) return;
    const mats = [].concat(o.material);
    /* Vor der Map zählen. Der Wert zählt NUR die Materialien der Figur: applySkin läuft,
       bevor Requisiten in ihre Bones geparented werden, und genau so soll es sein — ein
       Schwert bekommt keine Charakter-Textur. Wer nach dem Bau über den Figurenknoten
       traversiert, zählt die Requisiten mit und kommt auf eine höhere Zahl (Hero Man: 7
       gegen 8, das achte gehört sword_blue). */
    swapped += mats.length;
    o.material = mats.map((m) => {
      const n = m.clone();
      if (m.map) {
        tex.colorSpace = m.map.colorSpace;
        tex.flipY = m.map.flipY;
        tex.wrapS = m.map.wrapS; tex.wrapT = m.map.wrapT;
        tex.magFilter = m.map.magFilter; tex.minFilter = m.map.minFilter;
      }
      n.map = tex;
      n.needsUpdate = true;
      return n;
    });
    if (!Array.isArray(o.material)) o.material = o.material;
    else if (o.material.length === 1) o.material = o.material[0];
  });
  tex.needsUpdate = true;
  return { swapped, url, path };
}

/* ---------- Pfoten-Anker für Legacy-Teilfiguren (S28) ----------
   Beim skinned Original (PrototypePete) folgt die gezeichnete Pfote dem `handSlot`-Bone,
   weil sie per Gewichten daran hängt. Eine zusammengesetzte Legacy-Figur hat aber einen
   RIGIDEN Armklotz, der an genau EINEM Bone hängt — `armLeft`/`armRight`. Animiert ein Clip
   den `handSlot` relativ dazu (und das tun die Legacy-Clips), wandert der Bone, der Armklotz
   nicht: eine am handSlot befestigte Requisite löst sich sichtbar von der Pfote.
   Gemessen an der Orc Warband unter Idle: Schwert 0,002 von der Pfote (Zufall der Pose),
   Schild 0,513, Hammeraxt 0,548.

   Also wird bei Teilfiguren an den ARM-Bone befestigt, der den Klotz trägt, und der
   Pfotenpunkt im Klotz GEMESSEN: die Vertices mit dem größten Abstand zum Bone bilden das
   Pfotenende; ihr Mittel ist der Griffpunkt. Damit sind Requisite und gezeichnete Pfote
   rigide dasselbe Stück und bleiben in jedem Clip zusammen. */
export function pawAnchor(host, bone, partRe, frac = 0.82) {
  let part = null;
  host.traverse((o) => { if (!part && !o.isBone && partRe.test(o.name)) part = o; });
  if (!part) return null;
  bone.updateWorldMatrix(true, false);
  const inv = bone.matrixWorld.clone().invert();
  const pts = [];
  const t = new THREE.Vector3();
  part.updateWorldMatrix(true, true);
  part.traverse((m) => {
    if (!m.isMesh) return;
    const p = m.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) pts.push(t.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld).applyMatrix4(inv).clone());
  });
  if (!pts.length) return null;
  let far = 0;
  for (const p of pts) far = Math.max(far, p.length());
  const tip = pts.filter((p) => p.length() > far * frac);
  const c = new THREE.Vector3();
  for (const p of tip) c.add(p);
  c.multiplyScalar(1 / tip.length);
  return { local: c, part: part.name, verts: pts.length, tipVerts: tip.length, far };
}

/* ---------- Pose-unabhängige Ausrichtung (S27) ----------
   Eine `aim`-Ausrichtung wird gegen die WELT gerechnet und in die lokale Bone-Drehung
   umgerechnet — das Ergebnis hängt also davon ab, wie der Bone in DIESEM Moment steht.
   Gegen eine Anzeigepose gerechnet sitzt die Requisite in genau dieser Pose richtig und in
   jeder anderen irgendwo. Für Figuren, die animiert abgespielt werden sollen, muss die
   Ausrichtung deshalb gegen die BASISPOSE gerechnet werden — dann verhält sie sich wie die
   authored Identität bei Series 6: rigide mit der Hand, plausibel in allen Clips.

   Kein Mixer dafür: der würde die Bindings des laufenden Mixers mit-entwerten. Stattdessen
   werden die ersten Keyframes der Clip-Tracks direkt gesetzt und danach zurückgeschrieben. */
export function poseAtFirstKey(root, clip) {
  const saved = [];
  root.traverse((o) => { if (o.isBone) saved.push([o, o.quaternion.clone(), o.position.clone(), o.scale.clone()]); });
  let applied = 0;
  for (const t of clip.tracks) {
    const dot = t.name.lastIndexOf('.');
    const nodeName = t.name.slice(0, dot), prop = t.name.slice(dot + 1);
    const node = root.getObjectByName(nodeName);
    if (!node) continue;
    const v = t.values;
    if (prop === 'quaternion' && v.length >= 4) { node.quaternion.set(v[0], v[1], v[2], v[3]); applied++; }
    else if (prop === 'position' && v.length >= 3) { node.position.set(v[0], v[1], v[2]); applied++; }
    else if (prop === 'scale' && v.length >= 3) { node.scale.set(v[0], v[1], v[2]); applied++; }
  }
  root.updateWorldMatrix(true, true);
  return { applied, of: clip.tracks.length,
           restore: () => { for (const [b, q, p, s] of saved) { b.quaternion.copy(q); b.position.copy(p); b.scale.copy(s); } root.updateWorldMatrix(true, true); } };
}

/* how many of a clip's tracks actually resolve against this skeleton — the honest
   compatibility number. A visually plausible pose is not proof; this is measurable. */
export function bindReport(root, clip) {
  let bound = 0;
  for (const t of clip.tracks) {
    const nodeName = t.name.split('.')[0];
    if (root.getObjectByName(nodeName)) bound++;
  }
  return { bound, total: clip.tracks.length, ratio: clip.tracks.length ? bound / clip.tracks.length : 0 };
}

/* GLTFLoader sanitises node names (a dot is a reserved property separator), so the
   handoff's `handslot.r` arrives as `handslotr`. Resolve both spellings and report which. */
const normName = (s) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
export function findBone(host, name) {
  const direct = host.getObjectByName(name);
  if (direct) return { bone: direct, matched: name, sanitised: false };
  const want = normName(name);
  let hit = null;
  host.traverse((o) => { if (!hit && (o.isBone || o.type === 'Bone') && normName(o.name) === want) hit = o; });
  if (!hit) host.traverse((o) => { if (!hit && normName(o.name) === want) hit = o; });
  return hit ? { bone: hit, matched: hit.name, sanitised: true } : null;
}

/* ---------- rig introspection ----------
   No hardcoded bone names. The rig is derived from the hierarchy that is actually there,
   so the same code holds for every KayKit character in the pack. */
function ancestry(b) { const a = []; let o = b; while (o) { a.unshift(o); o = o.parent; } return a; }
function lca(list) {
  if (!list.length) return null;
  let path = ancestry(list[0]);
  for (const b of list.slice(1)) {
    const p = ancestry(b);
    let i = 0;
    while (i < path.length && i < p.length && path[i] === p[i]) i++;
    path = path.slice(0, i);
  }
  return path[path.length - 1] || null;
}
export function boneRig(actor) {
  const bones = [];
  actor.traverse((o) => { if (o.isBone || o.type === 'Bone') bones.push(o); });
  const arms = bones.filter((b) => /arm|shoulder|elbow|hand/i.test(b.name) && !/handslot/i.test(b.name));
  const legs = bones.filter((b) => /leg|thigh|shin|knee|foot|toe/i.test(b.name));
  const torso = lca(arms);           // common ancestor of both arm chains = chest
  const pelvis = lca(legs);          // common ancestor of both leg chains = hips
  const slots = bones.filter((b) => /handslot/i.test(b.name));
  return { bones, arms, legs, torso, pelvis, slots, names: bones.map((b) => b.name) };
}
export function subtreeNames(bone) {
  const s = new Set();
  if (bone) bone.traverse((o) => s.add(o.name));
  return s;
}
/* split a clip along a bone subtree: keep=true → only that subtree, false → everything else.
   Two disjoint track sets can then run as two actions on one mixer without fighting. */
export function splitClip(clip, names, keep, label) {
  const tracks = clip.tracks.filter((t) => names.has(t.name.split('.')[0]) === keep);
  return { clip: new THREE.AnimationClip(clip.name + '·' + label, clip.duration, tracks), kept: tracks.length, of: clip.tracks.length };
}

/* ---------- Arm-Nachführung (CCD) · Toolbox-Baustein ---------- */
/* Ein Clip stellt die Pfoten dorthin, wo der Clip sie haben will — nicht dorthin, wo ein
   Instrument sie braucht. Holding_B setzt die linke Pfote 0,15 weiter nach vorn als die
   rechte; eine Gitarre, die am Hals in der einen und mit der Decke unter der anderen liegt,
   ist damit unbaubar, solange nur die Gitarre gedreht wird. Also wird der ARM nachgeführt:
   iterativ (CCD), gegen ein gemessenes Ziel, und der Restfehler wird berichtet statt
   verschwiegen. Gibt null zurück, wenn Kette oder Spitze fehlen — lieber keine Pose als
   eine stillschweigend halbe. */
export function reachChain(root, chainNames, tipName, target, iters = 40) {
  const tipF = findBone(root, tipName);
  if (!tipF) return null;
  const bones = chainNames.map((c) => findBone(root, c)).filter(Boolean);
  if (!bones.length) return null;
  const tip = tipF.bone, t = target.clone();
  root.updateWorldMatrix(true, true);
  const before = tip.getWorldPosition(new THREE.Vector3()).distanceTo(t);
  const q = new THREE.Quaternion(), a = new THREE.Vector3(), b = new THREE.Vector3();
  for (let i = 0; i < iters; i++) {
    for (const f of bones) {
      const bone = f.bone;
      root.updateWorldMatrix(true, true);
      const bp = bone.getWorldPosition(new THREE.Vector3());
      a.copy(tip.getWorldPosition(new THREE.Vector3())).sub(bp);
      b.copy(t).sub(bp);
      if (a.lengthSq() < 1e-8 || b.lengthSq() < 1e-8) continue;
      q.setFromUnitVectors(a.normalize(), b.normalize());
      const pq = bone.parent.getWorldQuaternion(new THREE.Quaternion());
      bone.quaternion.premultiply(pq.clone().invert().multiply(q).multiply(pq));
    }
  }
  root.updateWorldMatrix(true, true);
  return { before, after: tip.getWorldPosition(new THREE.Vector3()).distanceTo(t),
           bones: bones.map((f) => f.matched), tip: tipF.matched };
}

/* ---------- Instrument konstruktiv halten ---------- */
/* Die Abhängigkeit ist hier UMGEKEHRT zu `hand`: nicht "Requisite hängt an der Pfote, wo
   der Clip sie hinstellt", sondern "Instrument steht im Körperraum, beide Pfoten kommen
   dorthin". Nur so lassen sich drei Dinge gleichzeitig erfüllen, die sich sonst widersprechen:
   Griffhand AM HALS, Korpus NAH AM BAUCH, Anschlagpfote ÜBER DER DECKE.

   Der Anker ist die BAUCHEBENE, nicht die Schulter (S28-Korrektur). Ein aus der Schulter
   heraus konstruierter Anschlagpunkt liegt zwar per Bau in Reichweite — aber auch gern
   mitten im Rumpf, und mein Durchdringungstest im Rasterlauf hat das nicht gesehen: er hat
   den Abstand zum nächsten Rumpf-VERTEX gemessen, und ein Punkt tief im Körper ist von jeder
   Oberfläche weit entfernt. Der Test war blind für genau den Fall, den er prüfen sollte.
   Umgekehrt herum stimmt es: Bauchfront an den posierten Mesh-Vertices messen, Korpus mit
   erklärtem Abstand DAVOR setzen, Reichweite danach PRÜFEN statt voraussetzen.

   Konstruktion, jeder Schritt aus gemessenen Zahlen, alles im Aktor-Frame:
     1. Bauchfront = größtes z der Rumpf-Vertices in Bauchhöhe (posiert, nicht Rest-Box).
     2. Längsachse u aus Elevation/Azimut, Deckennormale senkrecht dazu, um u gerollt.
     3. Der Rückenpunkt der Korpusmitte, lokal (0, bodyMid, backZ), wird auf
        (bodyX, bodyY, Bauchfront + bellyGap) gelegt — daraus folgt der Pivot C.
     4. Griffpunkt G = C + u·gripLocal, Anschlagpunkt S = C + u·strumLocal + n·(faceZ+front).
     5. Beide Arme per CCD dorthin; Restfehler und Überstreckung werden berichtet.
     6. Instrument ans Griff-Handslot hängen: lokale Matrix = inv(Slot-Welt) × Ziel. */
export function holdInstrument(actor, instr, o) {
  const strumArm = o.strumArm || 'r', gripArm = o.gripArm || 'l';
  actor.updateWorldMatrix(true, true);
  const aInv = actor.matrixWorld.clone().invert();
  const shF = findBone(actor, 'upperarm.' + strumArm);
  const shGF = findBone(actor, 'upperarm.' + gripArm);
  const slotF = findBone(actor, 'handslot.' + gripArm);
  if (!shF || !shGF || !slotF) return null;
  const chainS = o.chains?.[strumArm] || ['upperarm.' + strumArm, 'lowerarm.' + strumArm, 'wrist.' + strumArm];
  const chainG = o.chains?.[gripArm] || ['upperarm.' + gripArm, 'lowerarm.' + gripArm, 'wrist.' + gripArm];

  let bellyFront = -Infinity;
  const v = new THREE.Vector3();
  actor.traverse((ob) => {
    if (!ob.isSkinnedMesh && !ob.isMesh) return;
    const p = ob.geometry.attributes.position;
    for (let i = 0; i < p.count; i += 3) {
      v.fromBufferAttribute(p, i).applyMatrix4(ob.matrixWorld).applyMatrix4(aInv);
      if (v.y > (o.bellyBand?.[0] ?? 0.55) && v.y < (o.bellyBand?.[1] ?? 1.0) && Math.abs(v.x) < 0.3) {
        bellyFront = Math.max(bellyFront, v.z);
      }
    }
  });
  if (!isFinite(bellyFront)) return null;

  const E = THREE.MathUtils.degToRad(o.elevation), A = THREE.MathUtils.degToRad(o.azimuth || 0);
  const u = new THREE.Vector3(Math.cos(E) * Math.cos(A), Math.sin(E), Math.cos(E) * Math.sin(A)).normalize();
  let n0 = new THREE.Vector3(0, 0, 1).sub(u.clone().multiplyScalar(u.z));
  if (n0.lengthSq() < 1e-6) n0 = new THREE.Vector3(0, 1, 0).sub(u.clone().multiplyScalar(u.y));
  const nrm = n0.normalize().applyAxisAngle(u, THREE.MathUtils.degToRad(o.roll || 0));
  const w = new THREE.Vector3().crossVectors(u, nrm).normalize();

  const bodyMid = o.bodyMid ?? -0.6, backZ = o.backZ ?? -0.1;
  const anchorTarget = new THREE.Vector3(o.bodyX ?? -0.1, o.bodyY ?? 0.7, bellyFront + (o.bellyGap ?? 0.03));
  const C = anchorTarget.clone()
    .sub(u.clone().multiplyScalar(bodyMid))
    .sub(nrm.clone().multiplyScalar(backZ));
  const G = C.clone().add(u.clone().multiplyScalar(o.gripLocal));
  /* Der Anschlagpunkt darf nicht mittig vor der Decke liegen. Gemessen am gebauten Bären:
     der Handslot landete korrekt 0,053 vor der Decke, aber wrist.r und hand.r sitzen entlang
     des Arms DAHINTER — bei Gitarre-lokal z = -0,074 und -0,006, also mitten im 0,143 dicken
     Korpus. Eine 0,2 große Bärentatze lässt sich nicht mittig auf eine 0,143 dicke Gitarre
     legen, ohne sie zu durchdringen. `strumX` schiebt den Punkt deshalb entlang der Breiten-
     achse nach AUSSEN, aus der Korpus-Silhouette heraus: dann darf das Handgelenk hinter der
     Deckenebene liegen, weil es neben dem Korpus liegt statt darin. */
  const S = C.clone().add(u.clone().multiplyScalar(o.strumLocal))
    .add(w.clone().multiplyScalar(o.strumX ?? 0))
    .add(nrm.clone().multiplyScalar((o.faceZ ?? 0) + (o.front ?? 0.06)));
  const T = new THREE.Matrix4().makeBasis(w, u, nrm).setPosition(C).premultiply(actor.matrixWorld);
  const Gw = G.clone().applyMatrix4(actor.matrixWorld);
  const Sw = S.clone().applyMatrix4(actor.matrixWorld);

  const segSum = (names) => {
    let sum = 0;
    for (let i = 0; i < names.length - 1; i++) {
      const a = findBone(actor, names[i]), b = findBone(actor, names[i + 1]);
      if (a && b) sum += a.bone.getWorldPosition(new THREE.Vector3()).distanceTo(b.bone.getWorldPosition(new THREE.Vector3()));
    }
    return sum;
  };
  const reachS = segSum([...chainS, 'hand.' + strumArm, 'handslot.' + strumArm]);
  const reachG = segSum([...chainG, 'hand.' + gripArm, 'handslot.' + gripArm]);
  const needS = Sw.distanceTo(shF.bone.getWorldPosition(new THREE.Vector3()));
  const needG = Gw.distanceTo(shGF.bone.getWorldPosition(new THREE.Vector3()));

  const reachGrip = reachChain(actor, chainG, 'handslot.' + gripArm, Gw, o.iters || 40);
  const reachStrum = reachChain(actor, chainS, 'handslot.' + strumArm, Sw, o.iters || 40);

  slotF.bone.add(instr);
  slotF.bone.updateWorldMatrix(true, false);
  slotF.bone.matrixWorld.clone().invert().multiply(T)
    .decompose(instr.position, instr.quaternion, instr.scale);

  /* Anschlagrichtung: Weltsenkrechte in die Deckenebene projiziert. "Hoch/runter statt
     seitlich" ist damit eine Rechnung — übrig bleibt genau der senkrechte Anteil, der in der
     Ebene der Decke liegt, also ohne durch das Instrument zu fahren. */
  const nrmW = nrm.clone().transformDirection(actor.matrixWorld);
  const down = new THREE.Vector3(0, -1, 0);
  const dir = down.clone().sub(nrmW.clone().multiplyScalar(down.dot(nrmW))).normalize();
  const inv = T.clone().invert();
  const localOf = (bn) => {
    const f = findBone(actor, bn);
    return f ? f.bone.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv) : null;
  };

  /* Freiprüfung des Anschlagarms gegen den Korpus — das war die Lücke, die Georg im Bild
     gesehen hat und keine Zahl dieser Funktion gemeldet hatte: geprüft wurde nur, ob der
     HANDSLOT sein Ziel erreicht, nie wo Handgelenk und Pfote dabei landen.
     Kriterium pro Gelenk: entweder VOR der Deckenebene oder AUSSERHALB der Korpus-Silhouette. */
  instr.updateMatrixWorld(true);
  const gBox = new THREE.Box3();
  {
    const t = new THREE.Vector3();
    instr.traverse((ob) => {
      if (!ob.isMesh && !ob.isSkinnedMesh) return;
      const p = ob.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) gBox.expandByPoint(t.fromBufferAttribute(p, i).applyMatrix4(ob.matrixWorld).applyMatrix4(inv));
    });
  }
  const jointClear = [...new Set([...chainS, 'wrist.' + strumArm, 'hand.' + strumArm, 'handslot.' + strumArm])]
    .map((bn) => {
      const l = localOf(bn);
      if (!l) return null;
      const vorDecke = l.z - gBox.max.z;
      const ausserhalb = Math.abs(l.x) - gBox.max.x;
      return { bone: bn, local: [+l.x.toFixed(3), +l.y.toFixed(3), +l.z.toFixed(3)],
               vorDecke: +vorDecke.toFixed(3), ausserhalb: +ausserhalb.toFixed(3),
               frei: vorDecke > 0 || ausserhalb > 0 || l.y > gBox.max.y || l.y < gBox.min.y };
    }).filter(Boolean);

  /* Nachmessen statt Sollwert melden: bellyGap ist der Abstand an EINEM Ankerpunkt, die
     hinterste Korpuskante liegt woanders, weil der Korpus gegen die Bauchebene gekippt steht.
     Ebenso ist bodyY das Ziel für den Ankerpunkt, nicht die Lage der Korpusmitte nach dem Bau. */
  instr.updateWorldMatrix(true, true);
  let backEdge = Infinity;
  const pv = new THREE.Vector3();
  instr.traverse((ob) => {
    if (!ob.isMesh && !ob.isSkinnedMesh) return;
    const p = ob.geometry.attributes.position;
    for (let i = 0; i < p.count; i += 2) {
      pv.fromBufferAttribute(p, i).applyMatrix4(ob.matrixWorld).applyMatrix4(aInv);
      if (pv.y > (o.bellyBand?.[0] ?? 0.55) - 0.1 && pv.y < (o.bellyBand?.[1] ?? 1.0) + 0.1) {
        backEdge = Math.min(backEdge, pv.z);
      }
    }
  });
  const bodyMidMeasured = C.clone().add(u.clone().multiplyScalar(bodyMid));

  return {
    T, dir, C, G, S, long: u, normal: nrm, normalWorld: nrmW,
    bellyFront, bellyGap: o.bellyGap ?? 0.03, bodyYTarget: o.bodyY ?? 0.7,
    backEdge: isFinite(backEdge) ? backEdge : null,
    backEdgeGap: isFinite(backEdge) ? backEdge - bellyFront : null,
    bodyMidY: bodyMidMeasured.y,
    reachGrip, reachStrum, reachLenStrum: reachS, reachLenGrip: reachG, needStrum: needS, needGrip: needG,
    overreach: [needG > reachG * 0.96 ? `Griffarm braucht ${needG.toFixed(3)} von ${reachG.toFixed(3)}` : null,
                needS > reachS * 0.96 ? `Anschlagarm braucht ${needS.toFixed(3)} von ${reachS.toFixed(3)}` : null].filter(Boolean),
    reached: [...(reachGrip?.bones || []), ...(reachStrum?.bones || [])],
    jointClear, gBoxLocal: { min: gBox.min.toArray().map((x) => +x.toFixed(3)), max: gBox.max.toArray().map((x) => +x.toFixed(3)) },
    gripLocal: localOf('handslot.' + gripArm), strumLocal: localOf('handslot.' + strumArm)
  };
}

/* ---------- prozeduraler Anschlag-Clip · Toolbox-Baustein ---------- */
/* Die geteilte Bibliothek hat KEINEN Instrumenten-Clip — alle 119 Clips geprüft (S25).
   Statt eine Spielbewegung zu erfinden, wird sie gerechnet, und zwar ADDITIV auf die
   gemessene Haltung: die Bewegung liegt als Delta auf den lokalen Quaternionen, die der
   Basis-Clip an den Bones hinterlässt. Die geprüfte Pose bleibt damit erhalten, und was
   man sieht, ist ausschließlich das, was dazukommt.

   Die Drehachse wird nicht getippt, sondern GEMESSEN: für jeden treibenden Bone wird jede
   lokale Achse in beide Richtungen um 5° probegedreht und die Weltverschiebung der
   Anschlagpfote auf die gewünschte Anschlagrichtung projiziert. Die größte Projektion
   gewinnt, und ihr Betrag liefert gleich den Umrechnungsfaktor Grad → Weltstrecke. Deshalb
   ist die Amplitude hier eine STRECKE (`travel`), keine Gradzahl: "die Pfote legt 16 cm
   über den Saiten zurück" ist prüfbar, "18° am Ellbogen" nicht.
   Dieselbe Selbstkorrektur wie bei der Hand-Ausrichtung: bleibt richtig, wenn die Pose
   wechselt — getippte Euler-Winkel tun das nicht.

   Der Knoten muss beim Aufruf BEREITS posiert sein (Basis-Clip gespielt, mixer.update
   gelaufen), sonst liegt das Delta auf der Bind-Pose. */
export function strumClip(node, opts = {}) {
  const arm = opts.arm === 'l' ? 'l' : 'r';
  const bpm = opts.bpm ?? 96;
  const beats = opts.beats ?? 4;
  const travel = opts.travel ?? 0.16;
  const dir = new THREE.Vector3(...(opts.dir || [0, -1, 0])).normalize();
  const swayDeg = opts.sway ?? 2.5;
  const maxDeg = opts.maxDeg ?? 26;
  const minAlign = opts.minAlign ?? 0.6;
  const downFrac = opts.downFrac ?? 0.4;
  const keysPerBeat = opts.keysPerBeat ?? 12;

  const tipF = findBone(node, 'handslot.' + arm) || findBone(node, 'hand.' + arm);
  if (!tipF) return null;
  const tip = tipF.bone;
  const weights = opts.weights || { ['lowerarm.' + arm]: 0.65, ['upperarm.' + arm]: 0.2, ['wrist.' + arm]: 0.15 };

  /* welche Drehung dieses Bones bewegt die Pfote in Anschlagrichtung? Nicht suchen — rechnen.
     Für eine Drehung um die Achse a durch den Bone-Ursprung gilt für die Spitze im Abstand r:
     Bahngeschwindigkeit = a × r. Gesucht ist also a mit a × r ∥ d — und das ist genau
     a = normalize(r × d). Ein Suchlauf über x/y/z konnte nur eine der drei Hauptachsen wählen
     und hat deshalb Bahnen mit großem Seitenanteil genommen, solange deren senkrechte
     Projektion nur größer war als bei den anderen zwei (gemessen S28: die Pfote fuhr in der
     Tiefe von 0,74 auf 0,47 statt hoch/runter). Die Formel liefert die bestmögliche Richtung,
     die dieses Gelenk überhaupt fahren kann.
     `align` sagt, wie viel der Bahn wirklich in Anschlagrichtung liegt — wird berichtet,
     nicht geschluckt. */
  function axisFor(bone, probeTip, want) {
    node.updateWorldMatrix(true, true);
    const bp = bone.getWorldPosition(new THREE.Vector3());
    const r = probeTip.getWorldPosition(new THREE.Vector3()).sub(bp);
    if (r.lengthSq() < 1e-8) return null;
    const aWorld = new THREE.Vector3().crossVectors(r, want);
    if (aWorld.lengthSq() < 1e-10) return null;   // Bone zeigt genau in Anschlagrichtung
    aWorld.normalize();
    const move = new THREE.Vector3().crossVectors(aWorld, r);       // Bahnrichtung bei 1 rad
    const perDeg = move.length() * Math.PI / 180;                   // Weltstrecke pro Grad
    const align = move.clone().normalize().dot(want.clone().normalize());
    const bq = bone.getWorldQuaternion(new THREE.Quaternion());
    return { axis: aWorld.clone().applyQuaternion(bq.invert()).normalize(), perDeg, align,
             label: `Achse aus r×d (${Math.round(align * 100)} % in Richtung)` };
  }

  /* Anschlagwelle: Abschlag schnell, Rückweg träger — eine reine Sinuskurve klingt wie ein
     Metronom, nicht wie eine Hand. -1 = oben über den Saiten, +1 = unten durchgezogen. */
  const smooth = (u) => u * u * (3 - 2 * u);
  const stroke = (u) => (u < downFrac ? -1 + 2 * smooth(u / downFrac) : 1 - 2 * smooth((u - downFrac) / (1 - downFrac)));

  const dur = beats * 60 / bpm;
  const nKeys = Math.max(8, Math.round(beats * keysPerBeat));
  const times = new Float32Array(nKeys + 1);
  for (let i = 0; i <= nKeys; i++) times[i] = (i / nKeys) * dur;

  const tracks = [];
  const names = new Set();
  const drivers = [];
  const dropped = [];

  /* Erst prüfen, WELCHE Gelenke die gewünschte Bahn überhaupt fahren können, dann die
     Strecke nur unter diesen verteilen. Gemessen an diesem Rig: Ellbogen 77 % in Richtung,
     Schulter 32 %, Handgelenk 41 % — die beiden letzten drehen die Pfote also fast quer zur
     Anschlagrichtung. Sie mitlaufen zu lassen kauft Tiefenwackeln, keinen Anschlag. Der
     Ausschluss wird berichtet, damit nicht später jemand den fehlenden Schulteranteil sucht. */
  const usable = [];
  for (const [bname, w] of Object.entries(weights)) {
    const f = findBone(node, bname);
    if (!f) continue;
    const found = axisFor(f.bone, tip, dir);
    if (!found || found.perDeg < 0.0005) continue;
    if (found.align < minAlign) { dropped.push(`${f.matched} (nur ${Math.round(found.align * 100)} % der Bahn in Anschlagrichtung)`); continue; }
    usable.push({ f, w, found });
  }
  const wSum = usable.reduce((s, u) => s + u.w, 0) || 1;

  for (const { f, w, found } of usable) {
    const bone = f.bone;
    const share = w / wSum;
    /* Obergrenze pro Bone: ein Gelenk, das pro Grad kaum Strecke liefert, würde sich sonst
       verrenken, um seinen Streckenanteil zu erfüllen (gemessen: das Handgelenk brachte
       0,12 cm/° und hätte 41,6° gedreht). Gekappt wird die Strecke, nicht die Anatomie —
       und der Ausfall wird berichtet, nicht auf die anderen Bones umgelegt. */
    let deg = (travel * share) / found.perDeg;
    let capped = 0;
    if (deg > maxDeg) { capped = +(travel * share - maxDeg * found.perDeg).toFixed(4); deg = maxDeg; }
    const amp = THREE.MathUtils.degToRad(deg / 2);
    const base = bone.quaternion.clone();
    const vals = new Float32Array((nKeys + 1) * 4);
    const q = new THREE.Quaternion(), d = new THREE.Quaternion();
    for (let i = 0; i <= nKeys; i++) {
      const u = (times[i] / dur * beats) % 1; // ein Auf-und-Ab pro Schlag
      d.setFromAxisAngle(found.axis, stroke(u) * amp);
      q.copy(base).multiply(d);
      vals[i * 4] = q.x; vals[i * 4 + 1] = q.y; vals[i * 4 + 2] = q.z; vals[i * 4 + 3] = q.w;
    }
    tracks.push(new THREE.QuaternionKeyframeTrack(f.matched + '.quaternion', times, vals));
    names.add(f.matched);
    drivers.push(`${f.matched} ${found.label} (${Math.round(travel * share * 100)} cm Anteil, ${deg.toFixed(1)}° Ausschlag, ${(found.perDeg * 100).toFixed(2)} cm/°${capped ? `, bei ${maxDeg}° gekappt — ${(capped * 100).toFixed(1)} cm nicht geliefert` : ''})`);
  }
  if (!tracks.length) return null;

  /* Wippen: ein Nicken pro Schlag auf der Wirbelsäule. Nicht auf den Hüften — die tragen die
     Beine, eine Hüftdrehung würde die gepflanzten Füße verschieben. Der Kopf hängt an der
     Wirbelsäule und nickt mit; ein eigener Kopf-Track wäre ein zweiter erfundener Wert.
     Die Achse ist hier NICHT gemessen, sondern gesetzt, und zwar begründet: ein Wippen ist
     ein Nicken um die QUERACHSE des Körpers. Eine Bahnmessung wäre hier sinnlos — sie hat in
     S28 4 % Ausrichtung geliefert, weil eine Spine-Drehung den Kopf kaum senkrecht bewegt. */
  const spineF = findBone(node, 'spine');
  if (spineF && swayDeg > 0) {
    const lateralWorld = new THREE.Vector3(1, 0, 0).applyQuaternion(node.getWorldQuaternion(new THREE.Quaternion()));
    const axisLocal = lateralWorld.applyQuaternion(spineF.bone.getWorldQuaternion(new THREE.Quaternion()).invert()).normalize();
    const amp = THREE.MathUtils.degToRad(swayDeg);
    const base = spineF.bone.quaternion.clone();
    const vals = new Float32Array((nKeys + 1) * 4);
    const q = new THREE.Quaternion(), d = new THREE.Quaternion();
    for (let i = 0; i <= nKeys; i++) {
      const u = (times[i] / dur * beats) % 1;
      d.setFromAxisAngle(axisLocal, (0.5 - 0.5 * Math.cos(2 * Math.PI * u)) * amp);
      q.copy(base).multiply(d);
      vals[i * 4] = q.x; vals[i * 4 + 1] = q.y; vals[i * 4 + 2] = q.z; vals[i * 4 + 3] = q.w;
    }
    tracks.push(new THREE.QuaternionKeyframeTrack(spineF.matched + '.quaternion', times, vals));
    names.add(spineF.matched);
    drivers.push(`${spineF.matched} Querachse des Körpers (Wippen ${swayDeg}° pro Schlag, gesetzt statt gemessen)`);
  }

  const clip = new THREE.AnimationClip(opts.name || 'Guitar_Strum', dur, tracks);
  return {
    clip, names,
    report: `Anschlag-Clip gerechnet: ${bpm} BPM, ${beats} Schläge, ${dur.toFixed(2)} s Schleife, ${travel * 100} cm Pfotenweg in Richtung [${dir.toArray().map((v) => v.toFixed(2)).join(', ')}]. Achsen gerechnet, nicht getippt — ${drivers.join('; ')}.${dropped.length ? ` Nicht mitgenommen: ${dropped.join(', ')} — ihre Drehbahn läuft quer zur Anschlagrichtung, sie würden Tiefenwackeln statt Anschlag beitragen; die Strecke ist unter den brauchbaren Gelenken neu verteilt.` : ''} Abschlag ${Math.round(downFrac * 100)} % der Periode, Rückweg ${Math.round((1 - downFrac) * 100)} % (symmetrisch klingt wie ein Metronom).`
  };
}


/* ---------- Clown cascade · procedural resident activity ----------
   S33 implements only the measured 3-club proof from ATLAS_NEXT_SLICES. The trajectory owns
   the timing: apex + gravity -> flight time -> beat. Hands are measured from the frozen base
   pose, then both arm chains are CCD-reached to a small throw/catch scoop. Clubs are whole,
   authored KayKit props; only their runtime transform changes.

   6 clubs are intentionally NOT accepted here. The brief requires a trajectory-intersection
   calculation first; pretending the same loop scales to 6 would turn an OPEN point into a
   hidden guess. */
export function makeJuggleCascade(root, nodes, spec, open = [], notes = []) {
  const actor = nodes.get(spec.actor);
  const pins = (spec.props || []).map((id) => ({ id, node: nodes.get(id) })).filter((p) => p.node);
  if (!actor || pins.length !== (spec.props || []).length) {
    open.push(\`Jonglage nicht gebaut — Aktor oder Keule fehlt (\${pins.length}/\${(spec.props || []).length} Requisiten gefunden).\`);
    return null;
  }

  let timing;
  try { timing = juggleTiming({ ...spec, count: pins.length }); }
  catch (e) { open.push(\`Jonglage nicht gebaut — \${e.message}.\`); return null; }

  const hand = {
    l: findBone(actor, spec.leftHand || 'handslot.l'),
    r: findBone(actor, spec.rightHand || 'handslot.r')
  };
  if (!hand.l || !hand.r) {
    open.push('Jonglage nicht gebaut — linker oder rechter handslot fehlt.');
    return null;
  }

  const chains = {
    l: (spec.leftChain || ['upperarm.l', 'lowerarm.l', 'wrist.l']).map((n) => findBone(actor, n)).filter(Boolean),
    r: (spec.rightChain || ['upperarm.r', 'lowerarm.r', 'wrist.r']).map((n) => findBone(actor, n)).filter(Boolean)
  };
  if (!chains.l.length || !chains.r.length) {
    open.push('Jonglage nicht gebaut — eine Armkette ist unvollständig.');
    return null;
  }

  actor.updateWorldMatrix(true, true);
  const toActorLocal = (p) => actor.worldToLocal(p.clone());
  const anchors = {
    l: toActorLocal(hand.l.bone.getWorldPosition(new THREE.Vector3())),
    r: toActorLocal(hand.r.bone.getWorldPosition(new THREE.Vector3()))
  };

  /* Restore exactly the arm bones touched by CCD before every sample. Without this, iterative
     correction accumulates and the loop no longer closes even when the phase function does. */
  const baseQ = new Map();
  for (const f of [...chains.l, ...chains.r]) if (!baseQ.has(f.bone)) baseQ.set(f.bone, f.bone.quaternion.clone());

  const pinBaseQ = new Map(pins.map((p) => [p.node, p.node.quaternion.clone()]));
  const spinAxis = new THREE.Vector3(...(spec.spinAxis || [0, 0, 1])).normalize();
  const lift = spec.handLift ?? 0.12;
  const sweep = spec.handSweep ?? 0.055;
  const windowBeats = spec.handWindowBeats ?? 0.42;
  const maxResidual = spec.maxArmResidual ?? 0.1;
  let t = spec.phase ?? 0;

  const stats = {
    maxResidual: 0,
    minClubDistance: Infinity,
    samples: 0,
    timing,
    handAnchorsLocal: { l: anchors.l.toArray(), r: anchors.r.toArray() }
  };

  const restoreArms = () => {
    for (const [b, q] of baseQ) b.quaternion.copy(q);
    actor.updateWorldMatrix(true, true);
  };
  const targetFor = (side) => {
    const pulse = handPulse(t, side, timing, windowBeats);
    const p = anchors[side].clone();
    p.y += pulse * lift;
    p.x += (side === 'l' ? 1 : -1) * pulse * sweep;
    return actor.localToWorld(p);
  };
  const currentHand = (side) => hand[side].bone.getWorldPosition(new THREE.Vector3());

  const activity = {
    kind: 'juggle-cascade-v1',
    label: \`3-club cascade · \${(60 / timing.beatSec).toFixed(1)} throws/min · \${timing.cycleSec.toFixed(2)} s loop\`,
    enabled: true,
    timing,
    stats,
    reset() { t = spec.phase ?? 0; },
    update(dt = 0) {
      if (!activity.enabled) return;
      t = ((t + Math.max(0, dt)) % timing.cycleSec + timing.cycleSec) % timing.cycleSec;
      restoreArms();

      const lr = {};
      for (const side of ['l', 'r']) {
        const target = targetFor(side);
        const names = chains[side].map((f) => f.matched);
        const rr = reachChain(actor, names, hand[side].matched, target, spec.armIterations ?? 18);
        if (rr) {
          lr[side] = rr;
          stats.maxResidual = Math.max(stats.maxResidual, rr.after);
        }
      }
      actor.updateWorldMatrix(true, true);

      const h = { l: currentHand('l'), r: currentHand('r') };
      root.updateWorldMatrix(true, true);
      const positions = [];
      for (let i = 0; i < pins.length; i++) {
        const p = pins[i], st = clubState(t, i, timing);
        let world;
        if (st.airborne) {
          world = h[st.from].clone().lerp(h[st.to], st.u);
          world.y += timing.apex * st.arc;
        } else {
          world = h[st.to].clone();
        }
        const local = root.worldToLocal(world.clone());
        p.node.position.copy(local);
        const qs = new THREE.Quaternion().setFromAxisAngle(spinAxis, st.spin);
        p.node.quaternion.copy(pinBaseQ.get(p.node)).premultiply(qs);
        p.node.updateWorldMatrix(true, true);
        positions.push(world);
      }

      for (let a = 0; a < positions.length; a++) {
        for (let b = a + 1; b < positions.length; b++) {
          stats.minClubDistance = Math.min(stats.minClubDistance, positions[a].distanceTo(positions[b]));
        }
      }
      stats.samples++;
      stats.lastResidual = {
        l: lr.l ? +lr.l.after.toFixed(4) : null,
        r: lr.r ? +lr.r.after.toFixed(4) : null
      };
    }
  };

  activity.update(0);
  actor.userData.activity = activity;
  for (const p of pins) p.node.userData.activity = { kind: activity.kind, actor: spec.actor };

  notes.push(\`Jonglage gebaut: \${activity.label}. Apex \${timing.apex.toFixed(2)}, g \${timing.gravity.toFixed(2)}, Flug \${timing.flightSec.toFixed(3)} s. Timing kommt aus der Flugbahn, nicht aus getipptem BPM.\`);
  notes.push(\`Jonglage: Handanker aus der Recipe-Pose gemessen (L [\${anchors.l.toArray().map((v) => v.toFixed(3)).join(' / ')}], R [\${anchors.r.toArray().map((v) => v.toFixed(3)).join(' / ')}]); Arme werden pro Frame aus der Basispose restauriert und per CCD auf die Throw/Catch-Scoop-Ziele geführt. Initialer Restfehler L/R \${stats.lastResidual.l} / \${stats.lastResidual.r}.\`);
  notes.push(\`Jonglage: jede Keule macht \${timing.spinHalfTurns} Halbdrehungen pro Flug. Integer-Halbdrehungen + 6-Beat-Phasenfunktion schließen Lage und Orientierung konstruktiv; kein Keyframe-Drift.\`);
  if (stats.maxResidual > maxResidual) open.push(\`Jonglage Arm-Restfehler initial \${stats.maxResidual.toFixed(3)} > \${maxResidual.toFixed(3)} — visuell prüfen; Ziel nicht als abgenommen behandeln.\`);
  return activity;
}

/* dependency order: anything referenced by on / sitOn / hand must be placed first */
function orderItems(items) {
  const byId = new Map(items.map((i) => [i.id, i]));
  const out = [], seen = new Set();
  const visit = (i, stack) => {
    if (seen.has(i.id) || stack.has(i.id)) return;
    stack.add(i.id);
    for (const dep of [i.on, i.sitOn && i.sitOn.host, i.hand && i.hand.of].filter(Boolean)) {
      const d = byId.get(dep);
      if (d) visit(d, stack);
    }
    seen.add(i.id);
    out.push(i);
  };
  for (const i of items) visit(i, new Set());
  return out;
}

/* ---------- placement helpers ---------- */
const box = (n) => new THREE.Box3().setFromObject(n);
export const topOf = (n) => box(n).max.y;
function drop(node, targetY) {
  const b = box(node);
  node.position.y += targetY - b.min.y;
}

/* ---------- vignette builder ----------
   entry: { id, a:<repo path>, role, slot, p:[x,z], y:number, r:degY, s:scale,
            on:<id>            stack: sit on top of an already placed node
            float:number       hover at absolute height (balloons)
            hand:{of,bone,off:[x,y,z],rot:[x,y,z]}  parent to a rig bone (handslot.l/.r)
            pose:/regex/       actor only: apply the first matching shared clip, paused }  */
export async function buildVignette(recipe, onProgress) {
  const root = new THREE.Group();
  root.name = 'vignette:' + recipe.residentId;
  const nodes = new Map();
  const open = [...(recipe.open || [])];
  const notes = [];
  let mixerInfo = null;
  const extraMixers = [];
  const pendingStrum = [];
  const heldInfo = new Map();
  let activity = null;
  const items = orderItems([...(recipe.habitat || []), recipe.actor, ...(recipe.signatureProps || [])].filter(Boolean));
  let done = 0;

  for (const it of items) {
    try {
      const node = it.legacy
        ? await legacyAssemble(it.a, it.legacy.rig || LEGACY_RIG, it.commit || PIN.legacy)
        : await instance(it.a, it.commit);
      if (it.legacy) {
        const lg = node.userData.legacy;
        notes.push(`${it.id}: Legacy-Figur zusammengesetzt — ${lg.placed.length}/4 Teile an Bones gehängt (${lg.placed.join(', ')}), Platzhalter-Mesh ausgeblendet. Ausgleich über skeleton.boneInverses, kein getippter Offset.`);
        if (lg.missing.length) open.push(`Legacy-Teile ohne Bone-Zuordnung an ${it.id}: ${lg.missing.join(', ')}.`);
      }
      node.name = 'node:' + it.id;
      if (it.s) node.scale.setScalar(it.s);
      if (it.r) node.rotation.y = THREE.MathUtils.degToRad(it.r);
      if (it.rx) node.rotation.x = THREE.MathUtils.degToRad(it.rx);
      if (it.rz) node.rotation.z = THREE.MathUtils.degToRad(it.rz);
      node.userData.entry = it;
      node.userData.facts = measured.get(it.a);
      if (it.skin) {
        try {
          const sk = await applySkin(node, it.skin, it.commit);
          notes.push(`${it.id}: Farbvariante gesetzt — ${it.skin.split('/').pop()} auf ${sk.swapped} Materialien getauscht. Gleiche Geometrie, zweite Palette aus dem Pack; das .glb verdrahtet nur die erste.`);
        } catch (e) {
          open.push(`${it.id}: Farbvariante ${it.skin} nicht ladbar (${e.message}) — Figur läuft auf der eingebetteten Textur.`);
        }
      }

      /* actor pose from the shared animation library, before any grounding */
      if (it.pose) {
        const clips = await loadClips(it.rig || 'Rig_Medium', ANIM_SETS,
          it.animLib ? [ANIM_LIB, { root: it.animLib, sets: it.animSets || ['General', 'MovementBasic'] }] : [ANIM_LIB]);
        const hit = clips.find((c) => it.pose.test(c.name));
        if (hit) {
          const rig = boneRig(node);
          const rep = bindReport(node, hit.clip);
          const mixer = new THREE.AnimationMixer(node);
          let action, layerInfo = null;

          /* layered pose: the base clip keeps everything outside a bone subtree, a second
             clip drives the subtree. The two track sets are disjoint — no blend weights,
             no guessing which clip wins. */
          if (it.layer) {
            const lay = clips.find((c) => it.layer.from.test(c.name));
            const maskRoot = it.layer.mask === 'pelvis' ? rig.pelvis : rig.torso;
            if (lay && maskRoot) {
              const names = subtreeNames(maskRoot);
              const lower = splitClip(hit.clip, names, false, 'base');
              const upper = splitClip(lay.clip, names, true, 'layer');
              action = mixer.clipAction(lower.clip);
              action.play();
              const la = mixer.clipAction(upper.clip);
              la.play();
              layerInfo = { clip: lay.name, set: lay.set, maskRoot: maskRoot.name, action: la,
                            lower: `${lower.kept}/${lower.of}`, upper: `${upper.kept}/${upper.of}` };
              notes.push(`Pose geschichtet: "${hit.name}" liefert ${lower.kept}/${lower.of} Tracks außerhalb von "${maskRoot.name}", "${lay.name}" liefert ${upper.kept}/${upper.of} Tracks darin. Disjunkte Track-Mengen — kein Blend-Gewicht nötig.`);
            } else {
              open.push(`Schicht-Pose nicht gebaut: ${!lay ? 'kein Clip passt auf ' + it.layer.from : 'kein Masken-Bone ermittelbar'} — nur Basis-Pose aktiv.`);
            }
          }
          /* Anschlag-Schicht wird ZURÜCKGESTELLT. Reihenfolge ist hier keine Geschmacksfrage:
             der Anschlag liegt additiv auf den Bone-Werten, und die Arm-Nachführung (`hold`)
             ändert genau diese Werte — sie läuft aber später, weil das Instrument als
             Requisite nach dem Aktor gebaut wird. Würde der Clip jetzt entstehen, wäre er auf
             der ungenachführten Pose authored und die Nachführung danach wirkungslos. */
          if (it.strum) pendingStrum.push({ it, node, hit });
          if (!action) { action = mixer.clipAction(hit.clip); action.play(); }

          mixer.update(it.poseTime ?? 0);
          /* ein Anschlag, der friert, ist keiner — poseFreeze wird hier bewusst übersteuert */
          if (it.poseFreeze !== false && !it.strum) { action.paused = true; if (layerInfo) layerInfo.action.paused = true; }
          const info = { mixer, clip: hit.name, set: hit.set, source: hit.source, report: rep, action, clips, rig, layer: layerInfo };
          node.userData.poseInfo = info;
          if (it.id === recipe.actor.id) mixerInfo = info; else extraMixers.push(info);
          notes.push(`${it.id}: Pose "${hit.name}" (${hit.set}) gebunden, ${rep.bound}/${rep.total} Tracks`);
        } else {
          open.push(`Keine Pose gefunden für ${it.pose} in Rig_Medium-Bibliothek — Aktor steht neutral, Promo-Haltung nicht reproduziert.`);
        }
      }

      /* manual bone pose \u2014 for a skeleton where the shared library's named tracks bind
         (track NAMES match) but visibly collapse the mesh (track VALUES assume a different
         skeleton scale/proportions). Track-count binding is not proof of retarget safety;
         this is the escape hatch when it lies. Resets to bind pose, then rotates named bones. */
      if (it.manualPose) {
        node.traverse((o) => { if (o.isSkinnedMesh) o.skeleton.pose(); });
        for (const [boneName, deg] of Object.entries(it.manualPose)) {
          const bone = node.getObjectByName(boneName);
          if (bone) bone.rotation.set(...deg.map(THREE.MathUtils.degToRad));
          else open.push(`manualPose: Bone ${boneName} an ${it.id} nicht gefunden.`);
        }
        notes.push(`${it.id}: geteilte Bibliothek kollabiert dieses Skelett (Track-Namen passen, Track-WERTE nicht \u2014 69/69 gebunden, aber verzerrt). Bind-Pose zur\u00fcckgesetzt und ${Object.keys(it.manualPose).length} Bones manuell gedreht statt eines Clips.`);
      }

      if (it.optional) node.visible = false;

      /* hide: einzelne Teil-Meshes eines geladenen Assets abschalten. KayKit legt Wechselteile
         und Zubehör als GESCHWISTER-Meshes in EINE Datei (ActionFigure.glb trägt seinen eigenen
         Kopf, eine Zigarre und ein Stirnband; jede Kopf-Datei bringt ihr eigenes Stirnband mit).
         Ein Tausch ist deshalb eine Sichtbarkeitsfrage, nicht eine zweite Datei — und ein
         aufgesetzter Wechselkopf braucht das Abschalten des mitgelieferten Originals, sonst
         stecken zwei Köpfe im selben Bone. Regex gegen Mesh-Namen. */
      if (it.hide) {
        const hidden = [];
        node.traverse((o) => {
          if (!o.isMesh && !o.isSkinnedMesh) return;
          if (it.hide.some((rx) => rx.test(o.name))) { o.visible = false; hidden.push(o.name); }
        });
        if (hidden.length) notes.push(`${it.id}: ${hidden.length} Teil-Mesh(es) ausgeblendet (${hidden.join(', ')}). Wechselteile liegen als Geschwister im selben File — ein Tausch ist Sichtbarkeit, keine zweite Datei.`);
        else open.push(`hide an ${it.id} traf kein Mesh — die Muster [${it.hide.join(', ')}] passen auf keinen Mesh-Namen.`);
      }

      /* faceTile: der Gesichtsausdruck ist eine TEXTUR-Koordinate, keine Geometrie. Das Gesicht
         ist ein eigenes Mesh mit eigenem Material; actionfigure_faces.png ist ein 2×2-Blatt aus
         512²-Kacheln, und jede ausgelieferte Kopfvariante samplet genau EINE davon. Ein Versatz
         von map.offset um die Differenz der Kachel-Ursprunge setzt deshalb jeden Ausdruck auf
         jeden Kopf — auch die vierte Kachel, die keine Auslieferungsvariante benutzt.
         Die Ausgangskachel wird aus den eigenen UVs GEMESSEN, nicht aus einer Tabelle gelesen.
         Material und Textur werden vorher geklont: instance() teilt beide zwischen Instanzen,
         ein Versatz an der Originalreferenz würde jedes Gesicht der Szene mitziehen. */
      if (it.faceTile) {
        const [col, row] = it.faceTile;
        const applied = [];
        node.traverse((o) => {
          if (!o.isMesh && !o.isSkinnedMesh) return;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m, i) => {
            if (!m || !m.map || !/face/i.test(m.name || '')) return;
            const uv = o.geometry.attributes.uv;
            if (!uv) return;
            let u0 = Infinity, v0 = Infinity;
            for (let k = 0; k < uv.count; k++) { u0 = Math.min(u0, uv.getX(k)); v0 = Math.min(v0, uv.getY(k)); }
            const nCol = Math.floor(u0 / 0.5), nRow = Math.floor(v0 / 0.5);
            const mm = m.clone();
            mm.map = m.map.clone();
            mm.map.offset.set((col - nCol) * 0.5, (row - nRow) * 0.5);
            mm.map.needsUpdate = true;
            if (Array.isArray(o.material)) o.material[i] = mm; else o.material = mm;
            node.userData.faceFacts = { mesh: o.name, native: [nCol, nRow], target: [col, row],
                                        offset: [+mm.map.offset.x.toFixed(3), +mm.map.offset.y.toFixed(3)] };
            applied.push(`${o.name}: Kachel [${nCol}, ${nRow}] → [${col}, ${row}] über offset [${mm.map.offset.x}, ${mm.map.offset.y}]`);
          });
        });
        if (applied.length) notes.push(`${it.id}: Gesichtsausdruck über Atlas-Versatz gesetzt — ${applied.join(' · ')}. Ausgangskachel aus den UVs gemessen; Material und Textur geklont, damit kein anderes Gesicht mitwandert.`);
        else open.push(`faceTile an ${it.id} fand kein Gesichts-Material (kein Material mit "face" im Namen und gesetzter Map).`);
      }

      /* graft: Wechselgeometrie, die zur FIGUR gehört und nicht zu ihren Requisiten.
         Der ActionFigure-Pack liefert vier Kopf-Dateien. Ein aufgesetzter Kopf ist kein
         Requisit, das man wegschalten kann — ohne ihn stünde die Figur kopflos da, sobald
         die Requisiten-Ebene aus ist (der eigene Kopf ist per `hide` abgeschaltet). Deshalb
         hängt er als KIND des Aktor-Knotens am Bone und erbt dessen Sichtbarkeit. */
      if (it.graft) {
        for (const g of it.graft) {
          const f = findBone(node, g.bone);
          if (!f) { open.push(`graft: Bone ${g.bone} an ${it.id} nicht gefunden — ${g.a} nicht aufgesetzt.`); continue; }
          const gn = await instance(g.a, g.commit || it.commit);
          gn.name = 'graft:' + (g.id || g.bone);
          if (g.hide) {
            const hid = [];
            gn.traverse((o) => { if ((o.isMesh || o.isSkinnedMesh) && g.hide.some((rx) => rx.test(o.name))) { o.visible = false; hid.push(o.name); } });
            if (hid.length) notes.push(`${it.id}/${gn.name}: ${hid.join(', ')} ausgeblendet — die Figur bringt dasselbe Teil schon mit, zwei davon wären Z-Fighting.`);
          }
          f.bone.add(gn);
          gn.position.set(...(g.off || [0, 0, 0]));
          gn.userData.entry = { id: gn.name, role: g.role || 'Wechselgeometrie', a: g.a, slot: g.slot };
          gn.userData.facts = measured.get(g.a);
          gn.userData.attachedTo = it.id + '/' + f.matched;
          nodes.set(g.id || gn.name, gn);
          notes.push(`${it.id}: ${g.a.split('/').pop()} auf Bone "${f.matched}" aufgesetzt, Identität. Wechselgeometrie hängt am Aktor statt in der Requisiten-Ebene — sonst wäre die Figur bei ausgeschalteten Requisiten kopflos.`);
        }
      }

      /* hold: Instrument konstruktiv im Körperraum statt an der Pfote des Clips — siehe
         holdInstrument() oben. Läuft an der Requisite, weil sie den Aktor braucht; die
         Abhängigkeitssortierung stellt sicher, dass der Aktor schon steht. */
      if (it.hold) {
        const host = nodes.get(it.hold.of);
        const res = host && holdInstrument(host, node, it.hold);
        if (res) {
          const f = (v) => v.toArray().map((x) => +x.toFixed(3)).join(' / ');
          heldInfo.set(it.hold.of, res);
          node.userData.holdFacts = {
            gripLocal: res.gripLocal.toArray().map((x) => +x.toFixed(3)),
            strumLocal: res.strumLocal.toArray().map((x) => +x.toFixed(3)),
            normal: res.normal.toArray().map((x) => +x.toFixed(3)),
            strumDir: res.dir.toArray().map((x) => +x.toFixed(3)),
            residualGrip: +(res.reachGrip?.after ?? -1).toFixed(3),
            residualStrum: +(res.reachStrum?.after ?? -1).toFixed(3),
            jointClear: res.jointClear, gBoxLocal: res.gBoxLocal
          };
          notes.push(`${it.id} konstruktiv gehalten: Instrument im Körperraum gesetzt, dann BEIDE Arme nachgeführt — nicht umgekehrt. Nur so gehen Griffhand am Hals, Korpus am Bauch und Anschlagpfote über der Decke gleichzeitig; hängt das Instrument an der Pfote, bestimmt der Clip die Lage und zwei von drei Bedingungen fallen aus.`);
          notes.push(`${it.id} Maße: Griffpfote landet bei lokal [${f(res.gripLocal)}] (Hals reicht von -0,28 bis +0,14), Anschlagpfote bei [${f(res.strumLocal)}] (Decke bei z=+0,043, Korpus von -0,92 bis -0,28). Deckennormale [${f(res.normal)}]. GEMESSEN: Korpusmitte auf Höhe ${res.bodyMidY.toFixed(3)}, Bauchfront bei z=${res.bellyFront.toFixed(3)}, hinterste Korpuskante bei z=${res.backEdge === null ? '?' : res.backEdge.toFixed(3)} — also ${res.backEdgeGap === null ? '?' : (res.backEdgeGap * 100).toFixed(1)} cm vor dem Bauch. SOLL-PARAMETER war bellyGap ${(res.bellyGap * 100).toFixed(1)} cm an EINEM Ankerpunkt und bodyY ${res.bodyYTarget.toFixed(2)}; die Kante liegt woanders, weil der Korpus gegen die Bauchebene gekippt steht.`);
          notes.push(`${it.id} Nachführung: Griffarm ${res.reachGrip.before.toFixed(3)} → ${res.reachGrip.after.toFixed(3)} Restfehler, Anschlagarm ${res.reachStrum.before.toFixed(3)} → ${res.reachStrum.after.toFixed(3)}. Reichweiten als Summe der Segmentlängen gemessen: Griffarm ${res.reachLenGrip.toFixed(3)} (gebraucht ${res.needGrip.toFixed(3)}), Anschlagarm ${res.reachLenStrum.toFixed(3)} (gebraucht ${res.needStrum.toFixed(3)}).`);
          if (res.overreach.length) open.push(`${it.id}: Arm überstreckt — ${res.overreach.join('; ')}. Die Pose ist gebaut, aber der Arm steht am Anschlag; Instrument näher an den Körper oder tiefer setzen.`);
          {
            const steckt = res.jointClear.filter((j) => !j.frei);
            notes.push(`${it.id} Anschlagarm-Freiprüfung: ${res.jointClear.length - steckt.length}/${res.jointClear.length} Gelenke frei vom Korpus (Korpus lokal x ±${res.gBoxLocal.max[0]}, Decke z=${res.gBoxLocal.max[2]}). Kriterium je Gelenk: vor der Deckenebene ODER außerhalb der Silhouette. ${res.jointClear.map((j) => `${j.bone} [${j.local.join(' / ')}] ${j.frei ? 'frei' : 'STECKT'}`).join(', ')}.`);
            if (steckt.length) open.push(`${it.id}: ${steckt.map((j) => j.bone).join(', ')} steckt im Korpus — Anschlagpunkt weiter nach außen (strumX) oder weiter vor die Decke (front).`);
          }
          nodes.set(it.id, node);
          node.userData.attachedTo = it.hold.of + '/handslot.' + (it.hold.gripArm || 'l');
          onProgress?.(++done, items.length, it.id);
          continue;
        }
        open.push(`hold für ${it.id} nicht ausführbar (${!host ? 'Aktor ' + it.hold.of + ' fehlt' : 'Schulter- oder Handslot-Bone nicht gefunden'}) — Instrument auf den Boden gesetzt.`);
      }

      if (it.hand) {
        const host = nodes.get(it.hand.of);
        const found = host && findBone(host, it.hand.bone);
        if (found) {
          found.bone.add(node);
          node.position.set(...(it.hand.off || [0, 0, 0]));
          /* Pfoten-Anker: Requisite an den gemessenen Griffpunkt im rigiden Armklotz setzen,
             statt auf den Bone-Ursprung. Nur für zusammengesetzte Legacy-Figuren nötig. */
          if (it.hand.paw) {
            const pa = pawAnchor(host, found.bone, new RegExp(it.hand.paw + '$', 'i'));
            if (pa) {
              node.position.add(pa.local);
              notes.push(`${it.id}: Griffpunkt im Armklotz "${pa.part}" gemessen — Mittel der ${pa.tipVerts} äußersten von ${pa.verts} Vertices, lokal [${pa.local.toArray().map((x) => +x.toFixed(3)).join(' / ')}], Pfotenende ${pa.far.toFixed(3)} vom Bone "${found.matched}". An den ARM-Bone gehängt, nicht an den handSlot: der Klotz folgt nur diesem einen Bone, eine handSlot-Befestigung löst sich beim Abspielen von der gezeichneten Pfote.`);
            } else {
              open.push(`${it.id}: Armklotz "${it.hand.paw}" an ${it.hand.of} nicht gefunden — Requisite sitzt am Bone-Ursprung statt an der Pfote.`);
            }
          }
          if (it.hand.rot) node.rotation.set(...it.hand.rot.map(THREE.MathUtils.degToRad));

          /* aim: point the prop's own long axis along a WORLD direction.
             Hand-slot bones are not axis-aligned (handslotr's Z runs nearly horizontal),
             so an identity rotation lays every prop flat. Computing the local quaternion
             from the bone's measured world orientation is self-correcting — it stays right
             when the pose changes, which typed-in Euler angles do not. */
          /* standalone positional clearance without re-orienting: for props whose authored
             handslot rotation is already right but which sit too deep in the fist/body
             (Black Knight shield: gauntlet protrudes through the centre boss). */
          if (it.hand.push) {
            const axArr = it.hand.pushAxis || [0, 0, 1];
            const ax = new THREE.Vector3(...axArr).normalize();
            node.position.add(ax.multiplyScalar(it.hand.push));
            const isFist = /handslot/i.test(found.matched);
            /* Der Satz behauptete pauschal „Identität beibehalten" — falsch für jede Requisite,
               die zusätzlich `aim`/`roll` trägt (Legacy-Schild: geschoben UND ausgerichtet UND
               gerollt). Gleicher Bug wie die S21-Köcher-Notiz: fest verdrahtete Prosa, die
               eine Bedingung annimmt, statt sie zu lesen. */
            notes.push(it.hand.aim
              ? `${it.id}: ${it.hand.push} entlang der eigenen [${axArr.join(', ')}]-Achse ${isFist ? 'aus der Faust' : `vom Bone "${found.matched}"`} weg geschoben (zusätzlich zur gerechneten Ausrichtung, siehe nächste Zeile).`
              : `${it.id}: Identitäts-Drehung beibehalten, nur ${it.hand.push} entlang der eigenen [${axArr.join(', ')}]-Achse ${isFist ? 'aus der Faust' : `vom Bone "${found.matched}"`} weg geschoben.`);
          }

          /* ---------- slotAxis: Achsen-Zuordnung statt Weltrichtung (S31) ----------
             Gemessen in T-POSE, und bei Rig_Medium wie Rig_Large identisch: der handslot-Bone
             hat lokal X = außen, Y = vorn, Z = oben. „Richtig ausgerichtet“ ist damit keine
             Weltrichtung, sondern eine Zuordnung: welche EIGENE Achse der Requisite ist ihr
             Wirkende, und auf welche Slot-Achse gehört sie.

             Das ist der Unterschied zu `aim`: eine Weltrichtung gilt nur in der Pose, gegen die
             sie gerechnet wurde (S27/S29 haben das zweimal gekostet). Eine Achsen-Zuordnung ist
             eine lokale Drehung und bleibt in JEDEM Clip richtig — die Waffe zeigt immer
             dorthin, wo die Hand hinzeigt.

             Identität bleibt die Regel: sie ist der Fall from === to. */
          if (it.hand.slotAxis) {
            const from = new THREE.Vector3(...it.hand.slotAxis.from).normalize();
            const to = new THREE.Vector3(...it.hand.slotAxis.to).normalize();
            const q = new THREE.Quaternion().setFromUnitVectors(from, to);
            if (it.hand.slotRoll) q.premultiply(new THREE.Quaternion().setFromAxisAngle(to, THREE.MathUtils.degToRad(it.hand.slotRoll)));
            node.quaternion.copy(q);
            node.userData.slotAxisFacts = {
              from: it.hand.slotAxis.from, to: it.hand.slotAxis.to, roll: it.hand.slotRoll || 0,
              grad: +THREE.MathUtils.radToDeg(q.angleTo(new THREE.Quaternion())).toFixed(1)
            };
            const namen = { '0,1,0': 'vorn (Slot-Y)', '0,0,1': 'oben (Slot-Z)', '1,0,0': 'außen (Slot-X)',
                            '0,-1,0': 'hinten (-Slot-Y)', '0,0,-1': 'unten (-Slot-Z)', '-1,0,0': 'innen (-Slot-X)' };
            notes.push(`${it.id}: eigene [${it.hand.slotAxis.from.join(', ')}]-Achse auf ${namen[it.hand.slotAxis.to.join(',')] || '[' + it.hand.slotAxis.to.join(', ') + ']'} des Slots gelegt — ${node.userData.slotAxisFacts.grad}° lokale Drehung${it.hand.slotRoll ? `, dazu ${it.hand.slotRoll}° Roll um diese Achse` : ''}. Gemessen in T-Pose: der handslot-Bone hat lokal X=außen, Y=vorn, Z=oben — bei Rig_Medium und Rig_Large gleich. Posen-unabhängig, anders als eine gerechnete Weltrichtung.`);
          }

          if (it.hand.aim) {
            host.updateWorldMatrix(true, true);
            /* aimIn: gegen eine BASISPOSE rechnen statt gegen die Anzeigepose — macht die
               Ausrichtung posen-unabhängig, damit die Figur animiert abgespielt werden kann. */
            let undoPose = null;
            if (it.hand.aimIn) {
              const hi = host.userData.poseInfo;
              const base = hi && hi.clips && hi.clips.find((c) => c.name === it.hand.aimIn);
              if (base) {
                const p = poseAtFirstKey(host, base.clip);
                undoPose = p.restore;
                notes.push(`${it.id}: Ausrichtung gegen die Basispose "${it.hand.aimIn}" gerechnet (${p.applied}/${p.of} Tracks gesetzt), nicht gegen die Anzeigepose — damit bleibt sie in jedem Clip gültig.`);
              } else {
                open.push(`${it.id}: Basispose "${it.hand.aimIn}" nicht in der Bibliothek von ${it.hand.of} — Ausrichtung fällt auf die Anzeigepose zurück und gilt nur für diese.`);
              }
            }
            const bq = found.bone.getWorldQuaternion(new THREE.Quaternion());
            const axis = new THREE.Vector3(...(it.hand.axis || [0, 0, 1])).normalize();
            const wantLocal = new THREE.Vector3(...it.hand.aim).normalize()
              .applyQuaternion(bq.clone().invert());
            const q = new THREE.Quaternion().setFromUnitVectors(axis, wantLocal);
            if (it.hand.roll) q.multiply(new THREE.Quaternion().setFromAxisAngle(axis, THREE.MathUtils.degToRad(it.hand.roll)));
            node.quaternion.copy(q);
            if (it.hand.grip) node.position.add(axis.clone().applyQuaternion(q).multiplyScalar(it.hand.grip));
            const check = axis.clone().applyQuaternion(q).applyQuaternion(bq);
            node.userData.aimFacts = {
              target: it.hand.aim, achieved: check.toArray().map((x) => +x.toFixed(3)),
              boneZWorld: new THREE.Vector3(0, 0, 1).applyQuaternion(bq).toArray().map((x) => +x.toFixed(3)),
              roll: it.hand.roll || 0
            };
            notes.push(`${it.id} ausgerichtet: eigene ${(it.hand.axis || [0, 0, 1]).join('')}-Achse auf Weltrichtung [${it.hand.aim.join(', ')}] gerechnet (erreicht [${node.userData.aimFacts.achieved.join(', ')}]). Die Z-Achse von ${found.matched} liegt bei [${node.userData.aimFacts.boneZWorld.join(', ')}] — ohne Rechnung liegt die Requisite flach.`);
            if (undoPose) undoPose();
          }

          nodes.set(it.id, node);
          node.userData.attachedTo = it.hand.of + '/' + found.matched;
          /* pull: den ZWEITEN Arm an eine gemessene Kante der Requisite nachführen — für
             beidhändig gehaltene Objekte (aufgeschlagenes Buch), ohne die instrument-
             spezifische `hold`-Mechanik. Ziel ist keine getippte Weltposition, sondern eine
             Kante der eigenen Bounding-Box der Requisite. */
          if (it.hand.pull) {
            node.updateWorldMatrix(true, true);
            const bb = new THREE.Box3().setFromObject(node);
            const ctr = bb.getCenter(new THREE.Vector3());
            const e = it.hand.pull.edge || 'x+';
            const ax = { x: 0, y: 1, z: 2 }[e[0]];
            const target = ctr.clone();
            target.setComponent(ax, e[1] === '+' ? bb.max.getComponent(ax) : bb.min.getComponent(ax));
            const arm = it.hand.pull.arm === 'l' ? 'l' : 'r';
            const chain = ['upperarm.' + arm, 'lowerarm.' + arm, 'wrist.' + arm];
            const r = reachChain(host, chain, 'handslot.' + arm, target, 40);
            if (r) {
              /* Der CCD-Restfehler ist NICHT das Maß für „beidhändig“ — er sagt nur, wie weit
                 die Armspitze von einem gerechneten Punkt blieb. Was die Aussage trägt, ist der
                 Abstand BEIDER Hände zur Requisiten-Geometrie. Also wird der mitgemessen. */
              const hv = [];
              node.updateWorldMatrix(true, true);
              node.traverse((mm) => {
                if (!mm.isMesh) return;
                const pp = mm.geometry.attributes.position;
                for (let i = 0; i < pp.count; i++) hv.push(new THREE.Vector3().fromBufferAttribute(pp, i).applyMatrix4(mm.matrixWorld));
              });
              const dist = (bn) => {
                const f2 = findBone(host, bn);
                if (!f2 || !hv.length) return null;
                const p = f2.bone.getWorldPosition(new THREE.Vector3());
                let best = Infinity;
                for (const q of hv) best = Math.min(best, p.distanceToSquared(q));
                return Math.sqrt(best);
              };
              const dr = dist('handslot.r'), dl = dist('handslot.l');
              notes.push(`${it.id}: zweiter Arm (${arm}) an die gemessene ${e}-Kante der Requisite nachgeführt — Ziel [${target.toArray().map((x) => +x.toFixed(3)).join(' / ')}], CCD-Restfehler ${r.before.toFixed(3)} → ${r.after.toFixed(3)}. Belegend für „beidhändig“ ist aber der Abstand der Hände zur Requisite: rechts ${dr === null ? '?' : dr.toFixed(3)}, links ${dl === null ? '?' : dl.toFixed(3)}.`);
            }
            else open.push(`${it.id}: Nachführung des ${arm}-Arms nicht möglich — Kette oder Spitze fehlt.`);
          }
          if (found.sanitised) notes.push(`${it.id} steckt in "${found.matched}" — Handoff nennt den Bone "${it.hand.bone}"; der GLTFLoader entfernt den Punkt. Gleicher Bone, andere Schreibweise.`);
          onProgress?.(++done, items.length, it.id);
          continue;
        }
        open.push(`Bone ${it.hand.bone} an ${it.hand.of} nicht gefunden — ${it.id} auf den Boden gesetzt.`);
      }

      root.add(node);
      node.position.x = it.p ? it.p[0] : 0;
      node.position.z = it.p ? it.p[1] : 0;

      /* sitOn: align a POSED actor by its hip bone, not by its bounding box.
         Box3 ignores skinning — grounding a seated character by box min.y is wrong by
         construction, which is exactly how S5 put Goth Girl behind her stool. */
      if (it.sitOn) {
        const host = nodes.get(it.sitOn.host);
        const rig = boneRig(node);
        const hip = it.sitOn.bone ? node.getObjectByName(it.sitOn.bone) : rig.pelvis;
        if (host && hip) {
          node.updateWorldMatrix(true, true);
          const hp = hip.getWorldPosition(new THREE.Vector3());
          let seat;
          if (it.sitOn.seat) {
            /* explicit seat point in the host's own local space — for hosts whose box top is
               NOT the seat (a tractor's box top is its exhaust, not the saddle) */
            host.updateWorldMatrix(true, true);
            seat = new THREE.Vector3(...it.sitOn.seat).applyMatrix4(host.matrixWorld);
          } else {
            const hb = box(host);
            seat = new THREE.Vector3((hb.min.x + hb.max.x) / 2, hb.max.y, (hb.min.z + hb.max.z) / 2);
          }
          node.position.add(seat.clone().sub(hp));
          if (it.sitOn.off) node.position.add(new THREE.Vector3(...it.sitOn.off));
          node.userData.seatFacts = { bone: hip.name, seatY: +seat.y.toFixed(3), hipBefore: +hp.y.toFixed(3),
                                      host: it.sitOn.host, explicit: !!it.sitOn.seat };
          notes.push(it.sitOn.seat
            ? `${it.id} auf ${it.sitOn.host} gesetzt: Sitzpunkt [${it.sitOn.seat.join(', ')}] im Host-Raum → Welt y=${seat.y.toFixed(3)}, Hüft-Bone "${hip.name}" vorher y=${hp.y.toFixed(3)}. Der Host hat keinen Sitz-Knoten — der Punkt ist eine ausgewiesene Schätzung aus der gemessenen Geometrie.`
            : `Aktor über Bone "${hip.name}" auf ${it.sitOn.host} ausgerichtet: Sitzfläche y=${seat.y.toFixed(3)}, Hüft-Bone vorher y=${hp.y.toFixed(3)}. Box-Grounding wäre hier falsch — Box3 kennt die Skinning-Deformation nicht.`);
        } else {
          drop(node, 0);
          open.push(`sitOn für ${it.id} nicht ausführbar (${!host ? 'Sitzmöbel ' + it.sitOn.host + ' fehlt' : 'kein Hüft-Bone gefunden'}) — auf Boden gesetzt.`);
        }
      } else if (typeof it.float === 'number') node.position.y = it.float;
      else if (it.on) {
        const host = nodes.get(it.on);
        if (host) drop(node, topOf(host));
        else { drop(node, 0); open.push(`Stapel-Ziel ${it.on} für ${it.id} fehlt — auf Boden gesetzt.`); }
      } else drop(node, it.y || 0);
      nodes.set(it.id, node);
    } catch (e) {
      open.push(`Asset lädt nicht: ${it.a} (${e.message})`);
      console.warn('atlas load fail', it.a, e);
    }
    onProgress?.(++done, items.length, it.id);
  }

  /* ---------- zurückgestellte Anschlag-Schichten ---------- */
  /* Jetzt, nach allen Requisiten, steht die Pose endgültig — einschließlich der Arm-Nachführung
     aus `hold`. Der Anschlag wird auf DIESEN Werten authored.
     REIHENFOLGE-FALLE (S28, gemessen): `mixer.stopAllAction()` stellt in three.js die
     gecachten Ausgangswerte der gebundenen Eigenschaften wieder her — also die Bone-Werte von
     VOR der Nachführung. Der alte Mixer wird deshalb nicht gestoppt, sondern fallen gelassen;
     ein frischer Mixer bindet die nachgeführte Pose. Das war der Grund, warum der Anschlagarm
     im Bild woanders stand als im Protokoll: das Protokoll war zum Zeitpunkt der Messung
     richtig, und eine Zeile später hat das Framework die Messung zurückgedreht.
     Zwei Bone-Mengen müssen aus dem Basis-Clip heraus, sonst zieht er zurück:
       · die vom Anschlag getriebenen (sonst zwei Clips auf einem Bone),
       · die nachgeführten (sonst animiert der Clip die Arme in die Clip-Haltung zurück und
         nimmt das angehängte Instrument mit — die ganze Konstruktion wäre umsonst).
     Bones ohne Track behalten schlicht ihren Wert; das ist die ganze Mechanik. */
  for (const ps of pendingStrum) {
    const info = ps.node.userData.poseInfo;
    if (!info) continue;
    const held = heldInfo.get(ps.it.id);
    const opts = { ...ps.it.strum };
    if (!opts.dir && held) opts.dir = held.dir.toArray();
    const s = strumClip(ps.node, opts);
    if (!s) {
      open.push(`Anschlag-Clip an ${ps.it.id} nicht gebaut — Anschlagpfote oder Treiber-Bones nicht gefunden, Figur hält nur die Haltung.`);
      continue;
    }
    const frozen = new Set([...s.names, ...(held?.reached || [])]);
    const mixer = new THREE.AnimationMixer(ps.node);
    const lower = splitClip(ps.hit.clip, frozen, false, 'base');
    const base = mixer.clipAction(lower.clip); base.play();
    const sa = mixer.clipAction(s.clip); sa.play();
    mixer.update(0);
    info.mixer = mixer;
    info.action = base;
    info.layer = { clip: s.clip.name, set: 'prozedural', maskRoot: [...s.names].join(' + '), action: sa,
                   lower: `${lower.kept}/${lower.of}`, upper: `${s.clip.tracks.length}/${s.clip.tracks.length}` };
    notes.push(`${ps.it.id}: ${s.report}`);
    notes.push(`${ps.it.id}: Anschlag treibt ${s.clip.tracks.length} Tracks auf ${[...s.names].join(', ')}; "${ps.hit.name}" behält ${lower.kept}/${lower.of} Tracks — herausgenommen sind die getriebenen UND die nachgeführten Bones (${[...frozen].join(', ')}), sonst zieht der Clip die Arme samt Instrument in die Clip-Haltung zurück.`);
    if (opts.dir && held) notes.push(`${ps.it.id}: Anschlagrichtung [${held.dir.toArray().map((v) => v.toFixed(3)).join(' / ')}] nicht gesetzt, sondern aus der Deckenlage gerechnet — Weltsenkrechte in die Deckenebene projiziert, davon ${Math.round(Math.abs(held.dir.y) * 100)} % senkrechter Anteil. Hoch/runter statt seitlich ist damit eine Rechnung, keine Einstellung.`);
  }

  if (recipe.juggle) activity = makeJuggleCascade(root, nodes, recipe.juggle, open, notes);

  const b = box(root);
  const size = b.getSize(new THREE.Vector3());
  const actor = nodes.get(recipe.actor.id);
  const actorBox = actor ? box(actor) : null;
  /* skinning deformation does not enter Box3 — so also read the live head bone height,
     which does reflect the applied pose */
  let headY = null;
  if (actor) {
    const h = findBone(actor, 'head');
    if (h) { actor.updateWorldMatrix(true, true); headY = h.bone.getWorldPosition(new THREE.Vector3()).y; }
  }
  notes.push('Box-Maße stammen aus der Rest-Pose-Geometrie (Three.js Box3 berücksichtigt keine Skinning-Deformation). Der Kopf-Bone-Wert ist posenabhängig gemessen.');
  return {
    root, nodes, open, notes, mixer: mixerInfo, extraMixers, activity, headY,
    bounds: { size: size.toArray(), min: b.min.toArray(), max: b.max.toArray() },
    actorBounds: actorBox ? {
      height: actorBox.max.y - actorBox.min.y,
      footprint: [actorBox.max.x - actorBox.min.x, actorBox.max.z - actorBox.min.z],
      contact: actorBox.min.y
    } : null
  };
}

/* ensemble: all built vignettes on one shared ground, spaced by measured footprint.
   No height normalisation — scale mismatches must stay visible. */
export function arrange(built, gap = 1.2) {
  const stage = new THREE.Group();
  stage.name = 'ensemble';
  const slots = [];
  for (const v of built) {
    const g = new THREE.Group();
    g.name = 'slot:' + v.recipe.residentId;
    g.add(v.root);
    stage.add(g);
    slots.push({ group: g, vignette: v });
  }
  const width = respace(slots, gap);
  return { stage, slots, marks: slots.map((s) => ({ id: s.vignette.recipe.residentId, x: s.group.position.x })), width, respace: (g2) => respace(slots, g2 ?? gap) };
}

/* Re-space slots from what is CURRENTLY VISIBLE. Hiding scenery only helps if the figures
   also move closer together — otherwise they just sit in the same oversized gaps. */
export function respace(slots, gap = 1.2) {
  let x = 0;
  for (const s of slots) {
    s.group.position.x = 0;
    s.vignette.root.updateWorldMatrix(true, true);
    const b = visibleBox(s.vignette.root);
    if (!b) continue;
    const w = b.max.x - b.min.x;
    s.group.position.x = x - b.min.x;
    x += w + gap;
  }
  for (const s of slots) s.group.position.x -= x / 2;
  /* Report the MEASURED span, not the layout accumulator — the accumulator carries a trailing
     gap and ignores that a vignette's box can overhang its slot. Panel numbers are evidence. */
  const stage = slots[0] && slots[0].group.parent;
  if (stage) {
    stage.updateWorldMatrix(true, true);
    const b = visibleBox(stage);
    if (b) return b.max.x - b.min.x;
  }
  return Math.max(0, x - gap);
}

function visibleBox(root) {
  const b = new THREE.Box3();
  let any = false;
  root.traverse((o) => {
    if (!o.isMesh) return;
    let p = o, vis = true;
    while (p) { if (p.visible === false) { vis = false; break; } p = p.parent; }
    if (!vis) return;
    b.expandByObject(o);
    any = true;
  });
  return any ? b : null;
}

/* ---------- viewer · one shared rig for every resident page ---------- */
export function makeViewer(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.fov || 28, 1, 0.1, 4000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /* two comparable moods only — custom-lighting every resident would destroy comparability */
  const MOOD = {
    day: { bg: 0x1a1915, hemi: [0xffffff, 0x9aa5ae, 2.2], key: [0xfff6e8, 2.3, [-9, 13, 8]], fill: [0xc8dcff, 0.5, [8, 6, -7]] },
    golden: { bg: 0x241d16, hemi: [0xffe6c4, 0x6b5a48, 1.8], key: [0xffd79a, 2.6, [-11, 7, 6]], fill: [0x9fb6ff, 0.45, [7, 5, -8]] }
  };
  const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(hemi, key, fill);
  function mood(name) {
    const m = MOOD[name] || MOOD.day;
    scene.background = new THREE.Color(m.bg);
    hemi.color.setHex(m.hemi[0]); hemi.groundColor.setHex(m.hemi[1]); hemi.intensity = m.hemi[2];
    key.color.setHex(m.key[0]); key.intensity = m.key[1]; key.position.set(...m.key[2]);
    fill.color.setHex(m.fill[0]); fill.intensity = m.fill[1]; fill.position.set(...m.fill[2]);
    return name;
  }
  mood(opts.mood || 'day');

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.32 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.002;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(40, 40, 0xe8c84a, 0x3f3a28);
  grid.position.y = 0.001;
  grid.visible = false;
  scene.add(grid);

  const bounds = new THREE.Box3Helper(new THREE.Box3(), 0xe8c84a);
  bounds.visible = false;
  scene.add(bounds);

  const sel = new THREE.Box3Helper(new THREE.Box3(), 0x6fd1ff);
  sel.visible = false;
  scene.add(sel);

  const mixers = new Set();
  const post = new Set(); // runs after every mixer update, before render (hand-posed bones)
  const clock = new THREE.Clock();

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width | 0), Math.max(1, r.height | 0), false);
    camera.aspect = Math.max(1, r.width) / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function frame(object, dir = [0.35, 0.28, 1], pad = 1.15) {
    resize(); // aspect must be current: a panel toggle changes the canvas before the observer fires
    const b = new THREE.Box3().setFromObject(object);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    /* Fit BOTH axes against their own field of view. Fitting the bounding-sphere diagonal
       against the vertical FOV (the obvious-looking shortcut) ignores camera.aspect and
       over-frames anything wider than it is tall — a 53-unit-wide ensemble row then gets
       framed as if its width had to fit the vertical FOV, ~48% too far out. */
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const d = new THREE.Vector3(...dir).normalize();
    /* extent across the view plane, not along the view axis */
    const right = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 1, 0)).normalize();
    const up = new THREE.Vector3().crossVectors(right, d).normalize();
    const half = size.clone().multiplyScalar(0.5);
    const halfW = Math.abs(right.x * half.x) + Math.abs(right.y * half.y) + Math.abs(right.z * half.z);
    const halfH = Math.abs(up.x * half.x) + Math.abs(up.y * half.y) + Math.abs(up.z * half.z);
    const dist = Math.max(halfH / Math.tan(vfov / 2), halfW / Math.tan(hfov / 2)) * pad;
    camera.position.copy(center).add(d.clone().multiplyScalar(dist));
    controls.target.copy(center);
    camera.near = Math.max(0.01, dist / 200);
    camera.far = dist * 12;
    camera.updateProjectionMatrix();
    controls.update();
    const shadowSpan = Math.max(size.x, size.z) * 1.4 + 4;
    Object.assign(key.shadow.camera, { left: -shadowSpan, right: shadowSpan, top: shadowSpan, bottom: -shadowSpan, near: 0.5, far: shadowSpan * 8 });
    key.shadow.camera.updateProjectionMatrix();
    return { box: b, size, center };
  }

  function showBounds(object) {
    if (!object) { bounds.visible = false; return; }
    bounds.box.setFromObject(object);
    bounds.visible = true;
  }
  function select(object) {
    if (!object) { sel.visible = false; return; }
    sel.box.setFromObject(object);
    sel.visible = true;
  }

  function draw() {
    const dt = clock.getDelta();
    for (const m of mixers) m.update(dt);
    for (const f of post) f(dt);
    controls.update();
    renderer.render(scene, camera);
  }
  (function loop() { requestAnimationFrame(loop); draw(); })();
  setInterval(draw, 200); // safety net for frames that never get rAF

  return { renderer, scene, camera, controls, grid, bounds, sel, frame, resize, draw, mood, showBounds, select, mixers, post };
}

/* click → the object, its recipe entry and its measured facts */
export function picker(canvas, viewer, getRoot, onPick) {
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, viewer.camera);
    const root = getRoot();
    const hit = root ? ray.intersectObject(root, true)[0] : null;
    if (!hit) { viewer.select(null); onPick(null); return; }
    let o = hit.object;
    while (o && !o.userData.entry) o = o.parent;
    if (!o) { viewer.select(null); onPick(null); return; }
    viewer.select(o);
    onPick({ node: o, entry: o.userData.entry, facts: o.userData.facts, attachedTo: o.userData.attachedTo });
  });
}
