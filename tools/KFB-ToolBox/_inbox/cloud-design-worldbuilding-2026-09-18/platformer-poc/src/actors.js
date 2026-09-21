/* Aktor-Adapter. Ein Aktor liefert PRÄSENTATION zu einem Zustand, den er nicht besitzt.
   Keiner dieser Adapter schreibt Position — das tut allein physics.js.

   Vier Klassen, weil sie sich wirklich unterscheiden:
     platformer  eigene eingebettete Clips (Referenz-Kontrolle)
     kaykit      geteilte KayKit-Bibliothek, Bindung GEMESSEN statt angenommen
     graft       FrizzleBob über den öffentlichen Leser, animation:'host'
     carl        0 Knochen → prozedurale Präsentation, keine geliehenen Clips

   Was hier ausdrücklich NICHT steht: eine Geschwindigkeitsleiter
   Walking_A → Walking_B → Running_A → Running_B. Das ist ein offenes Experiment, kein
   Ergebnis (Briefing §7). Der Adapter nimmt den ersten Clip, der wirklich da ist, und sagt
   im LAB, welcher das war. */
import * as THREE from 'three';
import { instance, loadGltf, measureNode, disposeTree } from './loader.js';
import { EMBED_BASE, raw } from './sources.js';
import { gltfLoader } from './loader.js';

/* Kandidatenlisten. Reihenfolge = Vorzug, nicht Behauptung über Geschwindigkeit. */
const WANT = {
  IDLE: ['Idle_A', 'Idle_B', 'Idle', 'Idle_Neutral'],
  WALK: ['Walking_A', 'Walking_B', 'Walk', 'Walking'],
  RUN: ['Running_A', 'Running_B', 'Run', 'Running', 'Running_Strafe_Right'],
  DUCK: ['Crouching_Idle', 'Crouch_Idle', 'Duck', 'Crouching', 'Sit_Floor_Idle'],
  JUMP_START: ['Jump_Start', 'Jump_Full_Short', 'Jump_Full_Long', 'Jump', 'Jumping'],
  AIRBORNE: ['Jump_Idle', 'Jump_Mid', 'Falling', 'Jump_Full_Long', 'Jump'],
  LAND: ['Jump_Land', 'Landing', 'Jump_Full_Short', 'Idle_A'],
  HIT: ['Hit_A', 'Hit_B', 'HitReact', 'Hit'],
  /* EMOTE: die geteilte Rig_Medium-Bibliothek hat in den drei geladenen Sets KEIN Winken
     (geprüft: MovementBasic 11, MovementAdvanced 13, General 15 Clips — kein Waving).
     `Interact` ist die nächstliegende echte Geste; wenn auch die fehlt, bleibt EMOTE leer
     und der Adapter fällt sichtbar auf IDLE zurück, statt etwas zu erfinden. */
  EMOTE: ['Waving_A', 'Waving_B', 'Waving', 'Wave', 'Cheering', 'Yes', 'Interact']
};

const LOOPING = new Set(['IDLE', 'WALK', 'RUN', 'DUCK', 'AIRBORNE']);

function bindRatio(root, clip) {
  let bound = 0;
  for (const t of clip.tracks) if (root.getObjectByName(t.name.split('.')[0])) bound++;
  return clip.tracks.length ? bound / clip.tracks.length : 0;
}

/* Gemeinsame Mixer-Mechanik für alles, was Clips hat. */
class ClipPresenter {
  constructor(root, clips) {
    this.root = root;
    this.mixer = new THREE.AnimationMixer(root);
    this.clips = clips;                       // [{ name, clip, set }]
    this.map = {};
    this.current = null;
    this.manual = null;
    this.actions = new Map();
    this.rate = 1;
  }
  resolve() {
    const byName = new Map(this.clips.map((c) => [c.name, c]));
    const report = {};
    for (const [state, list] of Object.entries(WANT)) {
      const hit = list.map((n) => byName.get(n)).find(Boolean);
      this.map[state] = hit || null;
      report[state] = hit ? { clip: hit.name, set: hit.set, bound: +bindRatio(this.root, hit.clip).toFixed(2) } : null;
    }
    return report;
  }
  action(entry) {
    if (!entry) return null;
    if (!this.actions.has(entry.name)) {
      const a = this.mixer.clipAction(entry.clip);
      this.actions.set(entry.name, a);
    }
    return this.actions.get(entry.name);
  }
  play(entry, { loop = true, fade = 0.16, speed = 1 } = {}) {
    const a = this.action(entry);
    if (!a || a === this.current) { if (a) a.timeScale = speed; return; }
    a.reset();
    a.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    a.clampWhenFinished = !loop;
    a.timeScale = speed;
    a.enabled = true;
    a.setEffectiveWeight(1);
    if (this.current) a.crossFadeFrom(this.current, fade, false);
    a.play();
    this.current = a;
  }
  setManual(name) {
    this.manual = name || null;
    if (!name) return;
    const e = this.clips.find((c) => c.name === name);
    if (e) this.play(e, { loop: true, fade: 0.12 });
  }
  update(dt) { this.mixer.update(dt * this.rate); }
  dispose() { this.mixer.stopAllAction(); this.mixer.uncacheRoot(this.root); }
}

class BaseActor {
  constructor(def, holder) { this.def = def; this.holder = holder; this.notes = []; }
  place(player) {
    this.holder.position.set(player.pos.x, player.pos.y, player.pos.z);
    this.holder.rotation.y = player.yaw;
  }
  fitHeight(node, targetHeight) {
    const m = measureNode(node);
    const h = m.size.y || 1;
    const s = targetHeight / h;
    node.scale.multiplyScalar(s);
    node.position.y -= m.min.y * s;
    return { measured: +h.toFixed(3), scale: +s.toFixed(3) };
  }
  dispose() { disposeTree(this.holder); }
}

/* ---------- 1 · Platformer Default Character ---------- */
class PlatformerActor extends BaseActor {
  static async mount(def, ctx) {
    const holder = new THREE.Group();
    holder.name = 'actor:' + def.id;
    ctx.scene.add(holder);
    const a = new PlatformerActor(def, holder);
    const g = await loadGltf(def.path, ctx.pins[def.pin]);
    const node = (await instance(def.path, ctx.pins[def.pin]));
    a.fit = a.fitHeight(node, ctx.height);
    holder.add(node);
    a.node = node;
    a.pres = new ClipPresenter(node, g.animations.map((c) => ({ name: c.name, clip: c, set: 'embedded' })));
    a.clipReport = a.pres.resolve();
    a.notes.push(`${g.animations.length} eingebettete Clips: ${g.animations.map((c) => c.name).join(', ')}`);
    return a;
  }
  get clipNames() { return this.pres.clips.map((c) => c.name); }
  setManual(n) { this.pres.setManual(n); }
  apply(player, ctx) {
    if (this.pres.manual) return;
    const s = player.state;
    const e = this.pres.map[s] || this.pres.map.IDLE;
    const speed = s === 'WALK' || s === 'RUN'
      ? THREE.MathUtils.clamp(player.speed / (s === 'RUN' ? player.t.run : player.t.walk), 0.6, 1.6) : 1;
    this.pres.play(e, { loop: LOOPING.has(s), fade: s === 'JUMP_START' ? 0.05 : 0.15, speed });
  }
  update(dt, ctx, player) { this.place(player); this.pres.update(dt); }
  info() { return { mode: 'embedded clips', clip: this.pres.manual || this.pres.current?.getClip().name || '—', fit: this.fit }; }
  dispose() { this.pres.dispose(); super.dispose(); }
}

/* ---------- 2 · KayKit / Resident-Biped ---------- */
async function loadRigClips(rig, ctx, sets) {
  if (rig === 'Rig_Legacy') {
    const path = 'media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb';
    const g = await loadGltf(path, ctx.pins.legacy);
    return g.animations.map((c) => ({ name: c.name, clip: c, set: 'Legacy' }));
  }
  const out = [];
  const seen = new Set();
  for (const set of sets) {
    const path = `${ctx.animLib.root}${rig}/${rig}_${set}.glb`;
    try {
      const g = await loadGltf(path, ctx.pins[ctx.animLib.pin]);
      for (const c of g.animations) {
        if (seen.has(set + '/' + c.name)) continue;
        seen.add(set + '/' + c.name);
        out.push({ name: c.name, clip: c, set });
      }
    } catch (e) { console.warn('Clip-Set fehlt', path, e.message); }
  }
  return out;
}

class KayKitActor extends BaseActor {
  static async mount(def, ctx) {
    const holder = new THREE.Group();
    holder.name = 'actor:' + def.id;
    ctx.scene.add(holder);
    const a = new KayKitActor(def, holder);
    const node = await instance(def.path, ctx.pins[def.pin]);
    a.fit = a.fitHeight(node, ctx.height * (def.rig === 'Rig_Large' ? 1.12 : 1));
    holder.add(node);
    a.node = node;

    let bones = 0;
    node.traverse((o) => { if (o.isBone) bones++; });
    const clips = await loadRigClips(def.rig || 'Rig_Medium', ctx, ctx.sets);
    a.pres = new ClipPresenter(node, clips);
    a.clipReport = a.pres.resolve();
    a.bones = bones;
    a.notes.push(`${bones} Bones gemessen · ${clips.length} Clips aus ${def.rig || 'Rig_Medium'} (${ctx.sets.join(', ')})`);
    if (!bones) a.notes.push('KEINE Bones: diese Figur ist nicht geriggt (Legacy-Bauweise, vier Teilgruppen). Clips binden nicht — die Figur steht. Der Zusammenbau aus dem Resident Atlas ist in diesem POC nicht enthalten.');
    const avg = Object.values(a.clipReport).filter(Boolean).map((r) => r.bound);
    a.bound = avg.length ? +(avg.reduce((s, v) => s + v, 0) / avg.length).toFixed(2) : 0;
    return a;
  }
  get clipNames() { return this.pres.clips.map((c) => c.name); }
  setManual(n) { this.pres.setManual(n); }
  apply(player) {
    if (this.pres.manual) return;
    const s = player.state;
    const e = this.pres.map[s] || this.pres.map.IDLE;
    const speed = s === 'WALK' || s === 'RUN'
      ? THREE.MathUtils.clamp(player.speed / (s === 'RUN' ? player.t.run : player.t.walk), 0.6, 1.6) : 1;
    this.pres.play(e, { loop: LOOPING.has(s), fade: s === 'JUMP_START' ? 0.05 : 0.15, speed });
  }
  update(dt, ctx, player) { this.place(player); this.pres.update(dt); }
  info() {
    return { mode: `${this.def.rig || 'Rig_Medium'} · shared library`, clip: this.pres.manual || this.pres.current?.getClip().name || '—',
      bound: this.bound, bones: this.bones, fit: this.fit };
  }
  dispose() { this.pres.dispose(); super.dispose(); }
}

/* ---------- 3 · FrizzleBob · Graft (öffentlicher Leser, animation:'host') ---------- */
class GraftActor extends BaseActor {
  static async mount(def, ctx) {
    const holder = new THREE.Group();
    holder.name = 'actor:' + def.id;
    ctx.scene.add(holder);
    const a = new GraftActor(def, holder);
    const mod = await import(EMBED_BASE + def.reader);
    const contract = await (await fetch(EMBED_BASE + def.contract)).json();
    const pet = mod.pickGraftPet(contract);
    const graft = await mod.mountGraft({
      THREE, loader: gltfLoader, parent: holder, pet, lib: contract,
      camera: ctx.camera, animation: 'host'          // der Platformer besitzt den einen Mixer
    });
    a.graft = graft;
    a.fit = a.fitHeight(graft.root, ctx.height);
    const clips = await loadRigClips(def.rig || 'Rig_Medium', ctx, ctx.sets);
    a.pres = new ClipPresenter(graft.root, clips);
    a.clipReport = a.pres.resolve();
    const avg = Object.values(a.clipReport).filter(Boolean).map((r) => r.bound);
    a.bound = avg.length ? +(avg.reduce((s, v) => s + v, 0) / avg.length).toFixed(2) : 0;
    a.notes.push('Leser: ' + def.reader + ' → mountGraft(), animation:\'host\'. Gesicht, EyeRig und Mund kommen vom Leser, nicht aus diesem POC.');
    if (graft.report?.notes?.length) a.notes.push('Graft-Bericht: ' + graft.report.notes.join(' · '));
    return a;
  }
  get clipNames() { return this.pres.clips.map((c) => c.name); }
  setManual(n) { this.pres.setManual(n); }
  apply(player) {
    if (this.pres.manual) return;
    const s = player.state;
    this.pres.play(this.pres.map[s] || this.pres.map.IDLE, { loop: LOOPING.has(s), fade: 0.15 });
    if (s === 'EMOTE') this.graft.mouth?.talkBurst?.(1.2);
  }
  /* Reihenfolge ist Pflicht (EMBED_KFB_RIGS_v3 §5): erst Mixer, dann graft.update. */
  update(dt, ctx, player) { this.place(player); this.pres.update(dt); this.graft.update?.(dt, ctx.camera); }
  info() { return { mode: 'Graft · animation:host', clip: this.pres.manual || this.pres.current?.getClip().name || '—', bound: this.bound, fit: this.fit }; }
  dispose() { this.pres.dispose(); this.graft.dispose?.(); super.dispose(); }
}

/* ---------- 4 · CapsuleCarl · prozedurale Präsentation ----------
   Carl hat 0 Knochen. Statt KayKit-Clips auf etwas zu binden, das keine Knochen hat, wird
   das Platformer-Acting GERECHNET: Anticipation, Absprung-Squash, Airborne-Tilt, Impact,
   Recovery, Atmen. Dieselben semantischen Zustände, andere Sprache. */
class CarlActor extends BaseActor {
  static async mount(def, ctx) {
    const holder = new THREE.Group();
    holder.name = 'actor:' + def.id;
    ctx.scene.add(holder);
    const a = new CarlActor(def, holder);
    const carlMod = await import(EMBED_BASE + def.reader);
    const graftMod = await import(EMBED_BASE + 'frizzlegraft-v1/graft-mount.v1.js');
    const contractMod = await import(EMBED_BASE + 'lab-v6/carl-contract.v1.js');
    const rig6 = await (await fetch(EMBED_BASE + def.contract)).json();
    const pet = contractMod.toPets1(rig6).pets[0];
    const carl = await carlMod.mountCarl({ THREE, loader: gltfLoader, scene: holder, mods: await graftMod.faceMods(), pet });
    a.carl = carl;
    a.body = carl.group || carl.root;
    a.fit = a.fitHeight(a.body, ctx.height);
    a.base = { y: a.body.position.y, sx: a.body.scale.x, sy: a.body.scale.y };
    a.t = 0;
    a.squash = 0; a.tilt = 0; a.hop = 0;
    a.notes.push('Leser: ' + def.reader + ' → mountCarl(). 0 Knochen — keine KayKit-Clips gebunden, Bewegung prozedural.');
    return a;
  }
  get clipNames() { return []; }
  setManual() { /* kein Clip-Dropdown: es gibt keine Clips. Das LAB sagt das auch so. */ }
  apply() {}
  update(dt, ctx, player) {
    this.place(player);
    this.t += dt;
    const c = ctx.cell;
    const s = player.state;
    const b = this.body;
    /* Zielwerte je Zustand; alles läuft gedämpft dorthin, nichts springt. */
    let wantSquash = 0, wantTilt = 0, wantHop = 0;
    if (s === 'JUMP_START') wantSquash = 0.30;                       // Anticipation: tief gehen
    else if (s === 'AIRBORNE') { wantSquash = -0.16; wantTilt = THREE.MathUtils.clamp(-player.vel.y / (player.t.jumpSpeed * 1.6), -0.35, 0.35); }
    else if (s === 'LAND') wantSquash = 0.34;                        // Impact
    else if (s === 'DUCK') wantSquash = 0.42;
    else if (s === 'HIT') { wantSquash = 0.2; wantTilt = 0.5; }
    if (s === 'WALK' || s === 'RUN') {
      const f = s === 'RUN' ? 9.5 : 6.0;
      wantHop = Math.abs(Math.sin(this.t * f)) * (s === 'RUN' ? 0.22 : 0.12);
      wantSquash = -Math.sin(this.t * f * 2) * 0.05;
      wantTilt = -0.12 * (player.speed / player.t.run);              // Vorlage in Laufrichtung
    }
    if (s === 'IDLE') wantSquash = Math.sin(this.t * 1.8) * 0.025;   // Atmen
    const k = 1 - Math.pow(0.0005, dt);
    this.squash += (wantSquash - this.squash) * k;
    this.tilt += (wantTilt - this.tilt) * (1 - Math.pow(0.003, dt));
    this.hop += (wantHop - this.hop) * k;
    b.scale.set(this.base.sx * (1 + this.squash * 0.55), this.base.sy * (1 - this.squash), this.base.sx * (1 + this.squash * 0.55));
    b.position.y = this.base.y + this.hop * c;
    b.rotation.x = this.tilt;
    this.carl.update?.(dt);
  }
  info() { return { mode: 'prozedural (0 Bones)', clip: `squash ${this.squash.toFixed(2)} · tilt ${this.tilt.toFixed(2)}`, fit: this.fit }; }
  dispose() { this.carl.dispose?.(); super.dispose(); }
}

const ADAPTERS = { platformer: PlatformerActor, kaykit: KayKitActor, graft: GraftActor, carl: CarlActor };

/* Lazy und entsorgend: genau EIN Spieler-Aktor lebt. */
export async function mountActor(def, ctx) {
  const A = ADAPTERS[def.adapter];
  if (!A) throw new Error('kein Adapter: ' + def.adapter);
  return A.mount(def, ctx);
}

export function flatRoster(roster) {
  const out = [];
  for (const g of roster.groups) for (const a of g.actors) out.push({ ...a, group: g.label, groupId: g.id });
  return out;
}
