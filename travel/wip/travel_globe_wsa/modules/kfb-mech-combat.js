/**
 * @kfb name        KFB Mech Combat — Roster, Waffen, Schuss-VFX, Klangbank
 * @kfb category    combat
 * @kfb capability  three@0.160
 * @kfb capability  audio
 * @kfb capability  rng
 * @kfb capability  clock
 * @kfb view        3d
 * @kfb determinism free            // ENTSCHIEDEN (Briefing 1.9.): seeded erst mit Storymap
 * @kfb since       v8 (vorbereitet 01.09.2026 aus KFB Mech Slice v2; v7 wird eingefroren)
 *
 * VORBEREITUNG, kein fertiger Port. Nach skills/session_modulvertrag.md gilt: das Modul
 * erklaert, was es braucht, der Wirt liefert genau das. Dieses Modul traegt die
 * WIRT-UNABHAENGIGEN Teile des Mech-Slice:
 *   1. den Mech-Roster (5 GLBs per RAW, Alias-Tabelle, Prep-Regeln aus der Recon),
 *   2. die Waffentabelle (v2-Werte inkl. Signatur-VFX-Parameter),
 *   3. den Tracer-Bauer (Tapering-Kegel, 2 Schichten, Grow-in/Fade — Recherche-Rezept),
 *   4. die prozedurale Klangbank (Pitch-Jitter, Distanzdaempfung).
 * NICHT hier, bewusst: Steuerung, Kamera, Terrain, Gegner-KI-Orchestrierung — die gehoeren
 * dem Wirt (globe-poc.js haelt Kamera & Boden; carpet.js-Regel: keine zweite Flugphysik).
 *
 * ENTSCHIEDEN per Briefing 1.9. (Georg, KISS aber skalierbar):
 *   1. EIN Modul jetzt. `kfb-mech-enemies` dockt spaeter an, ohne dass combat sich aendert —
 *      der Andockpunkt ist `update(dt, hitTest)`: enemies liefert dem Wirt denselben hitTest-
 *      Vertrag ({pos, radius, hurt(dmg)}), combat fragt nur, trifft nie selbst Entscheidungen.
 *   2. Mech = Fahrzeug nach `fahrzeug-vertrag.js` — siehe FAHRZEUG_ENTWUERFE unten (5 Felder
 *      + features, Masse aus der BONE-BOX der Recon, nie Box3).
 *   3. determinism: seeded erst mit Storymap. Alle Math.random-Stellen: MATH_RANDOM_STELLEN.
 *
 * WIRT-REGELN aus dem Briefing (v7-Bestand, den v8 erbt):
 *   - Klangbank als PRESET-TABELLE (SFX_PRESETS) an tiny-audio/travel-audio — KEIN zweiter
 *     AudioContext. Der ctx.audio-Zweig hier ist nur der Slice-Rueckfall.
 *   - Shake: trauma.js des Wirts, kick-Werte der Waffen als Trauma-Betraege einspeisen.
 *   - Treffer/Impacts als EREIGNIS auf fx-bus feuern, nicht selbst zeichnen.
 *   - Terrain-Hoehe: surfaceAltitudeAt hat bis 17,5 % Fehler und SENKT ein — fuer Mechs ist
 *     Raycast oder baryzentrische Lesung PFLICHT (walk-messung.js).
 *   - Erster Schnitt: nur die Signaturwaffe pro Mech (WEAPONS-Teilmenge ueber MECHS[i].sig).
 *
 * Befunde, die dieser Code kapselt (Quelle: github.md, Mech Recon 01.09.):
 * - GLBs rendern unsichtbar ohne `frustumCulled = false` (boundingSphere-Radius 0).
 * - Weltskalierung 100 + bindMatrix NICHT anfassen (detached kippt, scale=1 verzerrt Clips).
 * - Vorwaertsachse ist +Z (aus dem Walk-Cycle gemessen, nicht aus der Skelett-Heuristik).
 * - Animated Robot: eigene Clipnamen (Robot_*), keine Schuss-Clips → Alias-Tabelle.
 */

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/';

export const MECHS = [
  { id: 'flamingo', file: 'Mech by Quaternius - tLs9mFVCSU.glb', name: 'Fernando · Flamingo', sig: 'stinger' },
  { id: 'bee',      file: 'Mech by Quaternius - 4UvIHxnoSR.glb', name: 'Barbara · Bee',      sig: 'hornet' },
  { id: 'panda',    file: 'Mech by Quaternius - D5wW2jDO42.glb', name: 'Rae · Red Panda',    sig: 'railgun' },
  { id: 'frog',     file: 'Mech by Quaternius - o3Ps8z8ByP.glb', name: 'Finn · Frog',        sig: 'acid' },
  { id: 'robot',    file: 'Animated Robot by Quaternius - QCm7qe9uNJ.glb', name: 'Scrapper · Robot', sig: 'scrap' }
];

export const CLIP_ALIAS = {
  Idle: ['Idle', 'Robot_Idle'], Walk: ['Walk', 'Robot_Walking'], Run: ['Run', 'Robot_Running'],
  Jump: ['Jump', 'Robot_Jump'], Jump_Landing: ['Jump_Landing', 'Robot_WalkJump'],
  Shoot_Small: ['Shoot_Small', 'Robot_Punch'], Shoot_Big: ['Shoot_Big', 'Robot_Punch'],
  HitRecieve_1: ['HitRecieve_1', 'Robot_No'], HitRecieve_2: ['HitRecieve_2', 'Robot_No'],
  Death: ['Death', 'Robot_Death']
};

/* Waffentabelle v2. VFX-Sprache: color/glow/flash fuer den Tracer, kick fuer Kamera & Recoil,
   sfx als Schluessel in die Klangbank. rate in s, dmg pro Treffer, speed in u/s. */
export const WEAPONS = {
  stinger: { name: 'Stinger', kind: 'SIGNATUR', note: 'Schnellfeuer · Tracer', rate: 0.11, dmg: 9, speed: 78, clip: 'Shoot_Small', color: 0xffe89a, glow: true, flash: 0xfff3cf, kick: 0.028, sfx: 'pop' },
  hornet:  { name: 'Hornet Swarm', kind: 'SIGNATUR', note: '3er-Salve · Dartschwarm', rate: 0.5, burst: 3, burstGap: 0.07, dmg: 8, speed: 62, clip: 'Shoot_Small', color: 0xffd23f, glow: true, flash: 0xfff0a8, kick: 0.024, sfx: 'buzz', shape: 'dart', spreadA: 0.035 },
  railgun: { name: 'Bamboo Rail', kind: 'SIGNATUR', note: 'Einzelschuss · durchschlagend', rate: 1.15, dmg: 54, speed: 165, clip: 'Shoot_Big', color: 0x8fe6ff, glow: true, flash: 0xffffff, kick: 0.075, sfx: 'railzap', shape: 'slug', pierce: true },
  acid:    { name: 'Bog Lob', kind: 'SIGNATUR', note: 'Bogenwurf · Ätzpfütze', rate: 0.85, dmg: 30, speed: 30, clip: 'Shoot_Big', color: 0x9ad63f, flash: 0xd6ff7a, kick: 0.05, sfx: 'wetlob', shape: 'glob', arc: 0.5, splash: 3.0, rocket: true },
  scrap:   { name: 'Scrap Cannon', kind: 'SIGNATUR', note: 'Streuschuss · Schrottgarbe', rate: 0.75, pellets: 6, dmg: 11, speed: 52, clip: 'Shoot_Big', color: 0xffb35c, flash: 0xffe0a8, kick: 0.08, sfx: 'scrapboom', shape: 'scrap', spreadA: 0.1 },
  rocket:  { name: 'Nest Rocket', kind: 'WECHSEL', note: 'Rakete · Flächenschaden', rate: 1.35, dmg: 46, speed: 34, clip: 'Shoot_Big', color: 0xb8361f, kick: 0.09, sfx: 'whoosh', rocket: true, splash: 3.4 },
  mortar:  { name: 'Ink Mortar', kind: 'WECHSEL', note: 'Bogenschuss · Tuschewolke', rate: 1.8, dmg: 38, speed: 26, clip: 'Shoot_Big', color: 0x1f1a14, kick: 0.11, rocket: true, splash: 4.6, arc: 0.55, sfx: 'thump' },
  beam:    { name: 'Kayfabeam', kind: 'WECHSEL', note: 'Dauerstrahl · schmilzt Panzer', rate: 0.06, dmg: 4.5, speed: 220, clip: 'Shoot_Small', color: 0x9fe6ff, glow: true, flash: 0xffffff, kick: 0.012, sfx: 'zap' }
};

/* KayKit-Skelette als Bodengegner. Uniform 1,85 m (Referenzbild: alle vier gleich gross);
   Skalierung IMMER ueber die Idle-Pose-Bbox messen, nie Bone-Span, nie T-Pose-Bbox. */
export const SKELETONS = {
  base: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Skeletons/',
  anim: ['anim/Rig_Medium_MovementBasic.glb', 'anim/Rig_Medium_General.glb'],
  height: 1.85,
  kinds: [
    { id: 'minion', file: 'Skeleton_Minion.glb', hp: 38, weap: 'assets/gltf/Skeleton_Axe.gltf', ranged: false },
    { id: 'rogue', file: 'Skeleton_Rogue.glb', hp: 44, weap: 'assets/gltf/Skeleton_Crossbow.gltf', ranged: true },
    { id: 'mage', file: 'Skeleton_Mage.glb', hp: 40, weap: 'assets/gltf/Skeleton_Staff.gltf', ranged: true },
    { id: 'warrior', file: 'Skeleton_Warrior.glb', hp: 70, weap: 'assets/gltf/Skeleton_Blade.gltf', ranged: false }
  ],
  weaponSlot: 'handslotr',   // Rig-eigener Waffen-Slot — nie an die Hand haengen
  cloneRule: 'SkeletonUtils.clone'
};

/* Fahrzeug-Vertrag-ENTWUERFE je Mech (Briefing-Entscheidung 2). Hoehen aus der BONE-BOX der
   Recon — Box3.setFromObject luegt bei diesen Meshes (Bind-Space, Phantom-Hoehe 217).
   `sitz.hoehe: 'gelesen'` nach dem Karten-Vorbild; rumpf-Halbmasse = Bone-Box/2 als Start.
   Die endgueltigen Eintraege schreibt drueben, wer den Wirt haelt — das hier ist die Quelle. */
export const FAHRZEUG_ENTWUERFE = MECHS.map((m) => ({
  id: 'mech-' + m.id,
  name: m.name,
  mesh: 'media/3D_Assets/KFB/' + m.file + ' (RAW)',
  sitz: { vorLaengs: 0, hoehe: 'gelesen', blick: 'flugrichtung', clip: false },
  rumpf: { form: 'laeufer', hoehe: { bee: 2.71, panda: 2.92, frog: 3.11, flamingo: 3.81, robot: 5.35 }[m.id] || 3.0, quelle: 'Bone-Box (Recon 01.09.), nie Box3' },
  wakeUrsprung: 'mitte',   // benannte Naht aus fahrzeug-vertrag.js — fuer Laeufer sind es die Fuesse (FootL/R), Reparatur gehoert dem Wirt
  neigungsgrenzen: { steigungMax: 0.9, kanteAb: 0.35 },   // aus Slice v2 Terrain-Kontakt
  fx: { signatur: m.sig, tracer: 'tapering-2schicht', decal: 'kfb-ink hole 0.55u' },
  features: []
}));

/* Klangbank als Preset-Tabelle fuer tiny-audio/travel-audio (kein zweiter AudioContext).
   Grammatik: Schichten aus noise(dur,f0,f1,q,amp) und tone(dur,f0,f1,wave,amp), Pitch-Jitter
   ±6 % pro Abruf, Distanzdaempfung linear auf 15 % bei 55 u. Werte = Slice v2, gehoert. */
export const SFX_PRESETS = {
  pop:      [['noise', 0.07, 2600, 400, 3, 0.22], ['tone', 0.06, 420, 130, 'square', 0.1]],
  buzz:     [['tone', 0.1, 260, 190, 'sawtooth', 0.1], ['noise', 0.07, 3400, 900, 4, 0.13]],
  railzap:  [['tone', 0.26, 2200, 240, 'sawtooth', 0.13], ['tone', 0.22, 90, 40, 'sine', 0.22], ['noise', 0.14, 6000, 800, 7, 0.12]],
  wetlob:   [['tone', 0.16, 520, 130, 'sine', 0.16], ['noise', 0.13, 1300, 220, 2.5, 0.16]],
  scrapboom:[['noise', 0.3, 2200, 130, 1.6, 0.34], ['tone', 0.24, 150, 55, 'square', 0.16]],
  whoosh:   [['noise', 0.42, 900, 120, 1.4, 0.3], ['tone', 0.3, 150, 60, 'sawtooth', 0.12]],
  thump:    [['noise', 0.2, 500, 60, 2, 0.3], ['tone', 0.26, 110, 42, 'sine', 0.3]],
  zap:      [['tone', 0.09, 1400, 700, 'sawtooth', 0.07], ['noise', 0.08, 5200, 1800, 6, 0.08]],
  boom:     [['noise', 0.75, 1500, 55, 1.1, 0.55], ['tone', 0.6, 96, 32, 'sine', 0.45]],
  hitmetal: [['tone', 0.11, 1900, 900, 'triangle', 0.14], ['noise', 0.09, 4200, 1200, 5, 0.12]],
  hitbone:  [['tone', 0.09, 620, 240, 'triangle', 0.16], ['noise', 0.12, 1800, 500, 3, 0.14]],
  hitdirt:  [['noise', 0.14, 700, 120, 1.8, 0.2]]
};

/* determinism-Schuld, benannt (Briefing-Entscheidung 3): diese Stellen laufen auf Math.random
   und wandern bei Storymap-Anbindung auf ctx.rng — mechanisch, nichts davon aendert die API.
   Im Slice v2: _emit (spreadA-Streuung), _spark (Richtung/Tempo), _dust, _decal (Drehung),
   _spawnDrone/_spawnSkeleton (Ort, Kind, Feuertakt), _stepEnemies (Zieljitter), _sfx (Jitter).
   In diesem Modul: fireTracer nutzt KEIN random — Streuung ist Sache des Aufrufers. */
export const MATH_RANDOM_STELLEN = ['emit.spread', 'spark', 'dust', 'decal.rotation', 'spawn.position', 'spawn.kind', 'fire.timing', 'enemy.aimjitter', 'sfx.pitchjitter'];

export default class MechCombat {
  static describe() { return { seedable: false, needsPointer: false }; }

  async init(ctx) {
    // ctx enthaelt NUR das Deklarierte (Modulvertrag §2)
    this.three = ctx.three;           // die EINE three-Instanz des Wirts
    this.audio = ctx.audio || null;   // AudioContext-Fabrik des Wirts (standardmaessig aus)
    this.rng = ctx.rng || Math.random;
    this._loader = ctx.gltfLoader || null;  // Wirt liefert den Loader seiner three-Instanz
    this._group = new this.three.Group();
    this._shots = [];
    this._buildGeo();
  }

  mount(parent) { parent.add(this._group); }
  resize() {}
  dispose() {
    if (this._group.parent) this._group.parent.remove(this._group);
    this._group.traverse((o) => { if (o.material) o.material.dispose(); if (o.geometry) o.geometry.dispose(); });
  }

  _buildGeo() {
    const T = this.three;
    // Tapering-Tracer (Recherche-Rezept): Kopf vorn dick, Schwanz auf null, Ursprung am Schwanz
    this._coreGeo = new T.CylinderGeometry(0.05, 0.002, 1, 6); this._coreGeo.rotateX(Math.PI / 2); this._coreGeo.translate(0, 0, 0.5);
    this._mantGeo = new T.CylinderGeometry(0.125, 0.003, 1, 6); this._mantGeo.rotateX(Math.PI / 2); this._mantGeo.translate(0, 0, 0.5);
  }

  /** Mech laden. Kapselt die drei Recon-Fallen (Culling, 100er-Bind, Alias-Clips). */
  async loadMech(id) {
    const M = MECHS.find((m) => m.id === id) || MECHS[0];
    const g = await this._loader.loadAsync(RAW + encodeURIComponent(M.file));
    g.scene.traverse((o) => {
      if (o.isSkinnedMesh) o.frustumCulled = false;          // boundingSphere-Radius 0
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
    const clips = {}; (g.animations || []).forEach((c) => { clips[c.name.split('|').pop()] = c; });
    const pick = (key) => (CLIP_ALIAS[key] || [key]).map((n) => clips[n]).find(Boolean) || null;
    return { def: M, root: g.scene, clips, pick, weapons: { signature: WEAPONS[M.sig] } };
  }

  /** Tracer feuern: 2-Schicht-Kegel, waechst 60 ms aus der Muendung, Fade letzte 30 %. */
  fireTracer(from, dir, w) {
    const T = this.three;
    const grp = new T.Group();
    const core = new T.Mesh(this._coreGeo, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    const mant = new T.Mesh(this._mantGeo, new T.MeshBasicMaterial({ color: w.color, transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false }));
    grp.add(core, mant);
    grp.position.copy(from); grp.lookAt(from.clone().add(dir)); grp.scale.z = 0.001;
    this._group.add(grp);
    const L = 1.8;
    this._shots.push({ mesh: grp, core, mant, dir: dir.clone(), w, life: L, life0: L, grow: 0, len: 4.6 });
    return grp;
  }

  /** Ein Schritt fuer alle Modul-Schuesse. hitTest(pos) liefert der Wirt (oder null). */
  update(dt, hitTest) {
    for (let i = this._shots.length - 1; i >= 0; i--) {
      const s = this._shots[i];
      s.life -= dt; s.grow += dt;
      s.mesh.scale.z = Math.min(1, s.grow / 0.06) * s.len;
      const k = Math.max(0, Math.min(1, s.life / (s.life0 * 0.3)));
      s.core.material.opacity = k; s.mant.material.opacity = 0.95 * k;
      s.mesh.position.addScaledVector(s.dir, s.w.speed * dt);
      const hit = hitTest ? hitTest(s.mesh.position, s) : null;
      if (hit || s.life <= 0) {
        this._group.remove(s.mesh);
        s.core.material.dispose(); s.mant.material.dispose();
        this._shots.splice(i, 1);
      }
    }
  }
}
