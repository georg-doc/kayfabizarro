/**
 * enemies.v1.js — Gegner aus KayKit Skeletons und Mystery Series 6.
 *
 * @kfb name        Enemies, KayKit-Figuren mit Rig_Medium-Clips
 * @kfb category    character
 * @kfb capability  three@0.160
 * @kfb capability  assets
 * @kfb capability  clock
 * @kfb capability  rng
 * @kfb view        3d
 * @kfb determinism seeded
 * @kfb since       combat-arena v1 (CA-3)
 *
 * Herkunft: `assetlab-v4/repo-fs.js` listDir Z. 42–52 (GitHub-API, 12-h-Cache) · `assetlab-v4/waves.js`
 * spawn Z. 79–110 (SkeletonUtils.clone, Höhe normieren, auf den Boden) · Skelett-Pfade aus
 * `KayKit_Skeletons/BRIEF_Graveyard_Denizens_Modul.md` §1. Clips: dieselbe Spur-Zuordnung wie
 * frizzlebob.v1.js (KayKit → KayKit ist exakt; die Zahl steht im Report).
 */
const API = 'https://api.github.com/repos/georg-doc/kayfabizarro/contents/media/3D_Assets/';
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

export const ROSTER = [
  { id: 'skel_warrior', label: 'Skeleton Warrior', pack: 'Skeletons', path: 'KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb', height: 1.75, hp: 3, ranged: false },
  { id: 'skel_minion', label: 'Skeleton Minion', pack: 'Skeletons', path: 'KayKit_Skeletons/characters/gltf/Skeleton_Minion.glb', height: 1.55, hp: 2, ranged: false },
  { id: 'skel_rogue', label: 'Skeleton Rogue', pack: 'Skeletons', path: 'KayKit_Skeletons/characters/gltf/Skeleton_Rogue.glb', height: 1.7, hp: 2, ranged: true },
  { id: 'skel_mage', label: 'Skeleton Mage', pack: 'Skeletons', path: 'KayKit_Skeletons/characters/gltf/Skeleton_Mage.glb', height: 1.7, hp: 2, ranged: true },
  { id: 'orc_brute', label: 'Orc Brute', pack: 'Mystery S6', dir: 'KayKit_Mystery_Series6/2 - August 2025 - Orc Brute', height: 2.1, hp: 4, ranged: false },
  { id: 'monstrosity', label: 'Monstrosity', pack: 'Mystery S6', dir: 'KayKit_Mystery_Series6/4 - October 2025 - Monstrosity', height: 2.2, hp: 4, ranged: false },
  { id: 'toy_soldier', label: 'Toy Soldier', pack: 'Mystery S6', dir: 'KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier', height: 1.7, hp: 3, ranged: true },
  { id: 'avian', label: 'Avian Swordsman', pack: 'Mystery S6', dir: 'KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman', height: 1.8, hp: 3, ranged: false },
];
export const CLIP_RE = {
  idle: /^Idle(_|$)|Idle_A|idle/i, walk: /^Walk|Walking_A|Walking/i, run: /^Run|Running_A/i,
  attack: /Melee_Attack|Attack|Punch|Slice|Chop|Stab/i, shoot: /Ranged|Shoot|Spellcast|Throw/i,
  hit: /^Hit|HitReact|Hit_A/i, death: /^Death|Death_A|Die/i, block: /Block/i,
};
const ANIM_DIR = 'KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_';

export default class Enemies {
  static describe() { return { name: 'Enemies', capabilities: ['three@0.160', 'assets', 'clock', 'rng'], view: '3d', determinism: 'seeded', spec: { roster: ROSTER } }; }
  async init(ctx) {
    this.THREE = ctx.three; this.assets = ctx.assets; this.loader = ctx.gltfLoader; this.rng = ctx.rng; this.prepare = ctx.prepare || (() => 0);
    this.log = (s) => (ctx.log || console.info)('[enemies] ' + s);
    this.cache = new Map(); this.animCache = new Map(); this.live = []; this.skeletonUtils = ctx.skeletonUtils || (window.__ARENA1 && window.__ARENA1.SkeletonUtils) || null;
  }
  mount(parent) { this.parent = parent; this.group = new this.THREE.Group(); this.group.name = 'enemies'; parent.add(this.group); return this.group; }

  async _resolvePath(def) {
    if (def.path) return def.path;
    if (def._resolved) return def._resolved;
    const key = 'kfb-fs:' + def.dir; let list = null;
    try { const raw = localStorage.getItem(key); if (raw) { const j = JSON.parse(raw); if (Date.now() - j.t < 12 * 3600 * 1000) list = j.v; } } catch (_) {}
    if (!list) {
      const r = await fetch(API + enc(def.dir) + '?ref=main');
      if (!r.ok) throw new Error('listing ' + r.status + ' ' + def.dir);
      list = (await r.json()).map((e) => ({ name: e.name, path: e.path.replace(/^media\/3D_Assets\//, ''), type: e.type }));
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: list })); } catch (_) {}
    }
    const glb = list.find((e) => /\.glb$/i.test(e.name));
    if (!glb) throw new Error('no glb in ' + def.dir + ' (' + list.map((e) => e.name).join(', ') + ')');
    def._resolved = glb.path; this.log(def.label + ' → ' + glb.name); return glb.path;
  }
  async _clips(cat) {
    if (this.animCache.has(cat)) return this.animCache.get(cat);
    const gltf = await this.loader.loadAsync(this.assets.raw(ANIM_DIR + cat + '.glb'));
    this.animCache.set(cat, gltf.animations || []); return gltf.animations || [];
  }
  /** Eine Figur bauen: geklont, normiert, entgraut, Clips zugeordnet. Gibt einen Fighter zurück. */
  async spawn(id, o = {}) {
    const T = this.THREE, def = ROSTER.find((r) => r.id === id) || ROSTER[0];
    const path = await this._resolvePath(def);
    const t0 = performance.now();
    let gltf = this.cache.get(path);
    if (!gltf) { gltf = await this.loader.loadAsync(this.assets.raw(path)); this.cache.set(path, gltf); }
    const ms = Math.round(performance.now() - t0);
    console.info('[repo-fs] ' + path.split('/').pop() + ' ' + ms + ' ms');
    const root = this.skeletonUtils ? this.skeletonUtils.clone(gltf.scene) : gltf.scene.clone(true);
    const shell = new T.Group(); shell.name = 'deform-shell'; shell.add(root);
    const node = new T.Group(); node.name = 'enemy:' + def.id; node.add(shell);
    this.group.add(node);
    root.updateMatrixWorld(true);
    const raw = new T.Box3().setFromObject(root), h0 = raw.max.y - raw.min.y;
    const k = h0 > 0.01 ? (o.height || def.height) / h0 : 1;
    root.scale.setScalar(k); root.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(root);
    root.position.y -= box.min.y;
    const degrayed = this.prepare(root);
    const names = new Set(); let bones = 0; root.traverse((n) => { if (n.name) names.add(n.name); if (n.isBone) bones++; });
    // Clips: eigene zuerst (Mystery S6 ist animiert), dann Rig_Medium exakt nach Namen
    const own = (gltf.animations || []).map((c) => ({ name: c.name, clip: c, source: 'own' }));
    const lib = [];
    for (const cat of ['MovementBasic', 'CombatMelee', 'CombatRanged', 'General']) {
      try {
        const anims = await this._clips(cat);
        const allN = new Set(), okN = new Set();
        anims.forEach((c) => {
          const keep = c.tracks.filter((tr) => { const n = T.PropertyBinding.parseTrackName(tr.name).nodeName; allN.add(n); const ok = names.has(n); if (ok) okN.add(n); return ok; });
          if (keep.length) lib.push({ name: c.name, clip: keep.length === c.tracks.length ? c : new T.AnimationClip(c.name, c.duration, keep), source: cat, matched: keep.length, total: c.tracks.length });
        });
        if (!lib._compat) lib._compat = {}; lib._compat[cat] = allN.size ? Math.round(100 * okN.size / allN.size) : 0;
      } catch (e) { this.log(cat + ' failed: ' + e.message); }
    }
    const clips = own.concat(lib);
    const find = (re) => clips.find((c) => re.test(c.name)) || null;
    const set = {}; Object.entries(CLIP_RE).forEach(([k, re]) => { set[k] = find(re); });
    const mixer = new T.AnimationMixer(root);
    const f = {
      id: def.id, label: def.label, def, node, shell, root, mixer, clips, set, hp: def.hp, maxHp: def.hp, height: (o.height || def.height), bones, degrayed, ms, own: own.length, compat: lib._compat || {},
      action: null, alive: true,
      play(key, opt = {}) {
        const e = typeof key === 'string' ? set[key] : key; if (!e) return null;
        const a = mixer.clipAction(e.clip);
        a.setLoop(opt.loop === false ? T.LoopOnce : T.LoopRepeat, Infinity); a.clampWhenFinished = opt.loop === false; a.timeScale = opt.timeScale || 1;
        if (f.action && f.action !== a) f.action.fadeOut(0.15);
        a.reset().fadeIn(0.12).play(); f.action = a; f.current = e.name; return a;
      },
      update(dt) { mixer.update(dt); },
    };
    this.live.push(f);
    this.log(def.label + ' · ' + path.split('/').pop() + ' · ' + ms + ' ms · ×' + k.toFixed(3) + ' → ' + f.height + ' · ' + bones + ' bones · own ' + own.length + ' · lib ' + lib.length + ' clips · idle ' + (set.idle ? set.idle.name : '—') + ' · attack ' + (set.attack ? set.attack.name : '—') + ' · hit ' + (set.hit ? set.hit.name : '—') + ' · death ' + (set.death ? set.death.name : '—'));
    return f;
  }
  despawn(f) {
    if (!f) return; f.mixer.stopAllAction();
    if (f.node.parent) f.node.parent.remove(f.node);
    const i = this.live.indexOf(f); if (i >= 0) this.live.splice(i, 1);
  }
  update(dt) { for (const f of this.live) f.update(dt); }
  dispose() { this.live.slice().forEach((f) => this.despawn(f)); if (this.group && this.group.parent) this.group.parent.remove(this.group); }
}
