import {matchBellyZone,applyGunPalette,stepGunGlow} from './gun-look.v4a.js';   // v12: Nachbar im selben Ordner (4A: ../combat-arena-v4/)
/**
 * frizzlebob.v1.js — FrizzleBob als Platformer-Figur mit Pet-Studio-Gesicht.
 *
 * @kfb name        FrizzleBob, Platformer-Character mit EyeRig v5 und Bunny-Mund
 * @kfb category    character
 * @kfb capability  three@0.160
 * @kfb capability  assets
 * @kfb capability  pets
 * @kfb capability  clock
 * @kfb capability  rng
 * @kfb capability  pointer
 * @kfb view        3d
 * @kfb determinism seeded
 * @kfb since       combat-arena v1
 *
 * Herkunft, mit Zeilen:
 *   studio-v10/KloRolli.js        buildFaceHosts / eyeCtx   Z. 656–700   Host-Box `body`, opacity 0
 *   assetlab-v4/asset-lab-v4.js   getClips/categoriesFor    Z. 465–477   Rig_Medium_<Kategorie>.glb
 *   assetlab-v4/asset-lab-v4.js   playClip                  Z. 478–490   fadeOut 0,2 / fadeIn 0,15
 *   assetlab-v4/asset-lab-v4.js   lowestY / groundKeep      Z. 348–361 / 386–400
 *   studio-v3/kfb-pets.json       bunny                     Z. 579–621   Farbe, Augen, Mund
 * Eigene Arbeit (Naht): Kopf-Host an den Kopfknochen mit Weltachsen der Bindepose, Hue-Tönung der
 * Atlas-Textur, Spur-Filter für fremde Clips, der Messbericht.
 *
 * Bekannte Abweichung von `determinism: seeded`: EyeRig v5 und PetMouth v1 würfeln intern mit
 * Math.random (Blinzeln, Sprech-Shuffle). Geerbt aus Pet Studio v11 — Regel 1, Build gewinnt.
 */

export const SPEC = {
  files: {
    plain: 'Platformer Game Kit - Dec 2021/Character/glTF/Character.gltf',
    gun:   'Platformer Game Kit - Dec 2021/Character/glTF/Character_Gun.gltf',
  },
  /* 06.09.: GELB IM ASSET. Georg: »können wir das nicht auch im model/3D file ändern?« — ja. Die .gltf ist
     autark (Buffer base64, keine Textur), `Main`/`Main_Light` sind baseColorFactor-Konstanten. Gepatcht nach
     `assets/models/FrizzleBob_Yellow*.gltf` (Report daneben). Projektpfad zuerst, Kenney-RAW als Rückfall —
     dann greift der alte Tint-Weg, damit ein 404 nicht still zu Blau führt. */
  yellowFiles: { plain: '../assets/models/FrizzleBob_Yellow.gltf', gun: '../assets/models/FrizzleBob_Yellow_Gun.gltf' },   // v12: relativ zum MODUL (import.meta.url), nicht zum Dokument
  anims: { dir: 'KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/', prefix: 'Rig_Medium_',
    categories: ['MovementBasic', 'MovementAdvanced', 'CombatMelee', 'CombatRanged', 'General', 'Simulation', 'Special', 'Tools'] },
  /* Gelb des Bunny (kfb-pets.json Z. 579). Blau-Fenster im Farbton, das getönt wird. */
  /* GELB nach dem Studio, nicht nach Gefühl. Kanon: `studio-v3/pet-library.v6.js` Z. 51
     `frizzlebob: { recolor: 0xf2c93c }` (»Canon-Hase, selektiv GELB«) und `_recolorMap` Z. 463–493:
     gesättigte Pixel → Tint × (Luminanz × 1,15 + 0,18), neutrale Pixel (Sättigung < 22) bleiben.
     Hier gibt es keine Colormap, sondern sechs Flachfarben — dieselbe Formel je Material.
     GEMESSEN 05.09.: Main #0496ff (Blau) · Main_Light #e7b772 (Schnauze) · Main2 #82b0b4 (Zier) ·
     Black · White · EyeColor #132d41. `only` nennt, welche Materialien die Formel bekommen; die
     Zier (Main2) und die Iris bleiben Original. Erste Fassung (HSL-Fenster 180–270°) hat #d3a244
     direkt gesetzt — zu dunkel unter ACES, Georg: »der tint ist falsch«. */
  tint: { target: 0xf2c93c, only: ['Main', 'Main_Light'], satMin: 22, lumGain: 1.15, lumLift: 0.18, lightMix: 0.4 },
  /* Augen und Mund: GEORGS ABNAHME 05.09. (Bildschirmfotos der Regler, weil es hier keinen Import/Export
     gibt). Vorher die Bunny-Werte aus kfb-pets.json Z. 582–621. U = halbe Höhe des Kopf-Hosts. */
  eyes: { anchor: { dx: 0.375, dy: -0.175, ring: 0.285, track: 0.095 }, inset: 0.39, pupilSize: 0.27, pupilStyle: 'matte-cute', lidFit: 0.9, gloss: 0.85, converge: 0, lidColor: 0xf2c93c,
    blink: { minGap: 2.5, maxGap: 6.5, dur: 0.12 }, life: { on: true, wander: 0.45, tremor: 0.35 } },
  mouth: { size: 0.59, dy: -0.60, sx: 1.34, dx: 0, set: 'male', lift: 0.12, wrap: 1, onTop: false, rot: 0, bend: 0, tilt: 0 },
  headBoneRe: /head/i,
  /* KayKit Rig_Medium schreibt seine Knochen klein (lowerarml, head, handr); der Platformer-Character
     CamelCase (LowerArmL, Head, FistR). Zuordnung: erst exakt, dann kleingeschrieben, dann Alias. */
  headExcludeRe: /ear/i,   // GEMESSEN: Ear1–3 L/R hängen am Head; mit ihnen wäre die Kopf-Box 2,489×2,334 statt Kopf allein
  eyeMeshRe: /eye/i,       // Mesh-Name ODER Material-Name (GEMESSEN: Meshes heißen CUBezierCurve…, das Material `EyeColor`)
  /* Kopf-Host ist ein ELLIPSOID in der Kopf-Box, keine Kiste (Georgs Bild 05.09.: die Augen standen
     als Kugeln VOR dem runden Kopf, weil EyeRig/PetMouth die flache Kistenfront abtasten). Ein
     Ellipsoid gibt dem Abtaster die Wölbung, die der Kopf hat. Maße werden in die GEOMETRIE
     gebacken, weil beide Bauteile die Geometrie-Hüllkiste lesen (U = halbe Höhe). */
  hostShape: 'ellipsoid',
  boneAlias: { handl: 'FistL', handr: 'FistR', wristl: 'FistL', wristr: 'FistR', hips: 'Hips', root: 'Root' },
  faceDir: 1,   // +1: Gesicht in +z der Bindepose (GEMESSEN am Bild: richtig). Kein Regler mehr — war ein Notausgang.
  groundEvery: 0.12,
  gunMatRe: /gun/i,   // Meshes mit Gewehr-Material zählen nicht zum Boden (Character_Gun: `Gun_Grey`)
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (d < 1e-6) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return [h, s, l];
}
function hsl2rgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0]; else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c]; else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

export default class FrizzleBob {
  static describe() {
    return { name: 'FrizzleBob', capabilities: ['three@0.160', 'assets', 'pets', 'clock', 'rng', 'pointer'], view: '3d', determinism: 'seeded', spec: SPEC };
  }
  static methods() {
    return { play: { args: ['clip', 'loop'] }, setVariant: { args: ['plain|gun'] }, setTint: { args: ['on'] }, setFace: { args: ['on'] }, talk: { args: ['on'] }, loadCategory: { args: ['category'] } };
  }

  async init(ctx) {
    this.THREE = ctx.three; this.assets = ctx.assets; this.loader = ctx.gltfLoader;
    this.EyeRigMod = ctx.eyeRigModule; this.MouthMod = ctx.mouthModule;
    this.rng = ctx.rng; this.clock = ctx.clock; this.pointer = ctx.pointer; this.camera = ctx.camera;
    this.prepare = ctx.prepare || (() => 0);
    this.log = (s) => { this.provenance.push(s); (ctx.log || console.info)('[frizzlebob] ' + s); };
    this.provenance = [];
    this.variant = 'plain'; this.tintOn = false; this.faceOn = true; this.faceDir = SPEC.faceDir;   // tint aus: Gelb kommt aus der Datei
    this.eyeOpts = JSON.parse(JSON.stringify(SPEC.eyes)); this.mouthOpts = Object.assign({}, SPEC.mouth);
    this.gltfCache = new Map(); this.clipCache = new Map(); this.tintCache = new Map();
    this.categories = {}; this.current = null; this.elapsed = 0; this._gt = 0;
    if (this.pointer) this._offPointer = this.pointer.on((p) => { if (this.rig) this.rig.pointTo(p.x, p.y); });
  }

  mount(parent) {
    this.root = new this.THREE.Group(); this.root.name = 'frizzlebob';
    parent.add(this.root);
    this.ready = this._build();
    return this.root;
  }

  async _build() {
    await this._loadVariant(this.variant);
    if (!this.categories.MovementBasic) await this.loadCategory('MovementBasic').catch((e) => this.log('MovementBasic nicht erreichbar: ' + e.message));
    const idle = this.findClip(/^Idle/i) || this.findClip(/idle/i);
    if (idle) this.play(idle.name, { loop: true });
    this.built = true;
    return this.report();
  }

  /* ---------------------------------------------------------------- Laden + Messen */
  async _loadVariant(variant) {
    const T = this.THREE, path = SPEC.files[variant] || SPEC.files.plain;
    const t0 = performance.now();
    let gltf = this.gltfCache.get(variant);
    if (!gltf) {
      const local = SPEC.yellowFiles[variant] || SPEC.yellowFiles.plain;
      try { gltf = await this.loader.loadAsync(new URL(local, import.meta.url).href); gltf.userData = { source: 'yellow-asset', url: local }; }
      catch (e) { this.log('yellow asset unreachable (' + local + ') — Kenney RAW + tint instead'); gltf = await this.loader.loadAsync(this.assets.raw(path)); gltf.userData = { source: 'kenney-raw', url: path }; if (this.tintTarget == null) this.tintOn = true; }
      this.gltfCache.set(variant, gltf);
    }
    this.source = gltf.userData && gltf.userData.source;
    const ms = Math.round(performance.now() - t0);
    console.info('[repo-fs] ' + path.split('/').pop() + ' ' + ms + ' ms');   // dieselbe Zeile wie repo-fs.js Z. 97
    this._disposeFigure();
    const fig = this.figure = gltf.scene;
    fig.name = 'figure';
    this.root.add(fig);
    fig.updateMatrixWorld(true);
    const m = this.m = this._measure(gltf, path, ms);
    const degray = this.prepare(fig);
    m.degrayed = degray;
    // Bindepose auf den Boden — OHNE Gewehr: bei Character_Gun hängt es 0,695 u unter den Füßen (gemessen 06.09.), die Hüllkiste
    // hob die Figur genau so weit, und _groundKeep senkte sie dann 4 s lang ab. Also erst grob, dann mit dem Bodenmaß ohne Gewehr.
    fig.position.y -= m.box.min.y;
    fig.updateMatrixWorld(true);
    { const ly = this._lowestY(); if (ly != null) { const ry = this.root.getWorldPosition(new T.Vector3()).y; fig.position.y -= (ly - ry); fig.updateMatrixWorld(true); } }
    this.ownClips = (gltf.animations || []).map((c) => ({ name: c.name, dur: +c.duration.toFixed(2), clip: c, source: 'own', matched: c.tracks.length, total: c.tracks.length }));
    this.mixer = new T.AnimationMixer(fig);
    this.action = null;
    this._applyTint(this.tintOn);
    this._buildFaceHost();
    this._buildFace();
    this.log(variant + ' · ' + path.split('/').pop() + ' · ' + ms + ' ms · height ' + m.height.toFixed(3) + ' · bones ' + m.bones + ' · head ' + (m.head || 'MISSING') + ' · source ' + this.source + ' · Main ' + (m.materials.find((x) => x.name === 'Main') || {}).color);
  }

  _measure(gltf, path, ms) {
    const T = this.THREE, root = gltf.scene;
    const meshes = [], bones = [], nodeNames = new Set(), eyeMeshes = [];
    root.traverse((o) => {
      if (o.name) nodeNames.add(o.name);
      if (o.isBone) bones.push(o);
      if (o.isMesh || o.isSkinnedMesh) { meshes.push(o); if (SPEC.eyeMeshRe.test(o.name) || [].concat(o.material).some((mt) => mt && SPEC.eyeMeshRe.test(mt.name || ''))) eyeMeshes.push(o); }
    });
    const box = new T.Box3().setFromObject(root);
    const size = box.getSize(new T.Vector3());
    const head = bones.find((b) => SPEC.headBoneRe.test(b.name)) || null;
    let headBox = null, headVerts = 0, totalVerts = 0;
    const v = new T.Vector3();
    if (head) {
      headBox = new T.Box3();
      const set = new Set(); head.traverse((b) => { if (b === head || !SPEC.headExcludeRe.test(b.name)) set.add(b); });
      // ausgeschlossene Äste (Ohren) auch mit ihren Kindern raus
      head.traverse((b) => { if (b !== head && SPEC.headExcludeRe.test(b.name)) b.traverse((c) => set.delete(c)); });
      for (const mesh of meshes) {
        const g = mesh.geometry, pos = g.attributes.position;
        if (!pos) continue;
        totalVerts += pos.count;
        if (mesh.isSkinnedMesh && g.attributes.skinIndex && mesh.skeleton) {
          const si = g.attributes.skinIndex, sw = g.attributes.skinWeight, arr = mesh.skeleton.bones;
          for (let i = 0; i < pos.count; i++) {
            let best = 0, bw = -1;
            for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; best = si.getComponent(i, k); } }
            const b = arr[best];
            if (!b || !set.has(b)) continue;
            mesh.getVertexPosition(i, v).applyMatrix4(mesh.matrixWorld);   // Zugriffsfunktion, nie der Rohpuffer (Regel 7)
            headBox.expandByPoint(v); headVerts++;
          }
        } else {
          let p = mesh.parent, under = false;
          while (p) { if (set.has(p)) { under = true; break; } p = p.parent; }
          if (under) { headBox.union(new T.Box3().setFromObject(mesh)); headVerts += pos.count; }
        }
      }
      if (headBox.isEmpty()) headBox = null;
    }
    if (!headBox) {
      // Rückweg: oberes Viertel der Hüllkiste — ehrlich als Schätzung gemeldet
      headBox = new T.Box3(new T.Vector3(box.min.x + size.x * 0.2, box.max.y - size.y * 0.26, box.min.z + size.z * 0.15), new T.Vector3(box.max.x - size.x * 0.2, box.max.y, box.max.z - size.z * 0.15));
      this.provenance.push('Head box ESTIMATED (top quarter) — no head bone / no head vertices found');
    }
    const mats = new Map();
    meshes.forEach((mesh) => [].concat(mesh.material).forEach((mat) => { if (mat && !mats.has(mat.uuid)) mats.set(mat.uuid, mat); }));
    const matInfo = [...mats.values()].map((mat) => ({ name: mat.name || '(ohne Namen)', color: '#' + (mat.color ? mat.color.getHexString() : '------'), map: mat.map && mat.map.image ? (mat.map.image.width + '×' + mat.map.image.height) : null, metalness: mat.metalness }));
    return {
      path, file: path.split('/').pop(), ms, box, height: size.y, width: size.x, depth: size.z,
      meshes: meshes.map((mesh) => ({ name: mesh.name, skinned: !!mesh.isSkinnedMesh, verts: mesh.geometry.attributes.position ? mesh.geometry.attributes.position.count : 0 })),
      bones: bones.length, boneNames: bones.map((b) => b.name), nodeNames,
      head: head ? head.name : null, headBox, headSize: headBox.getSize(new T.Vector3()), headVerts, totalVerts,
      eyeMeshes: eyeMeshes.map((e) => e.name + ' (' + [].concat(e.material).map((mt) => mt && mt.name).join('/') + ')'), eyeMeshObjs: eyeMeshes, materials: matInfo,
      ownClips: (gltf.animations || []).map((c) => c.name),
    };
  }

  /* ---------------------------------------------------------------- Gelb statt Blau (Studio-Formel) */
  _applyTint(on) {
    const S = SPEC.tint, hex = this.tintTarget != null ? this.tintTarget : S.target;
    const tr = (hex >> 16) & 255, tg = (hex >> 8) & 255, tb = hex & 255;
    let recolored = 0, kept = 0; const rows = [];
    const seen = new Set();
    this.figure.traverse((mesh) => {
      if (!mesh.isMesh && !mesh.isSkinnedMesh) return;
      [].concat(mesh.material).forEach((mat) => {
        if (!mat || !mat.color || seen.has(mat.uuid)) return;
        seen.add(mat.uuid);
        if (mat.userData.origColor == null) mat.userData.origColor = mat.color.getHex();
        const o = mat.userData.origColor, r = (o >> 16) & 255, gg = (o >> 8) & 255, b = o & 255;
        const sat = Math.max(r, gg, b) - Math.min(r, gg, b);
        const lum = (0.299 * r + 0.587 * gg + 0.114 * b) / 255;
        const wanted = on && S.only.includes(mat.name) && sat >= S.satMin;
        if (wanted) {
          /* Studio-Formel GEMESSEN 05.09. an der Flachfarbe: Main #0496ff (lum 0,46) → #ad8f2b, ein Oliv.
             Sie gilt für COLORMAP-Pixel, deren Helligkeit die Form trägt; eine Flachfarbe trägt nichts,
             also nimmt der Körper das Kanon-Gelb voll und die helle Zone (Schnauze) dasselbe Gelb
             mit 40 % Weiß. Die Formel bleibt im Report als Vergleichszahl stehen. */
          const l2 = Math.min(1, lum * S.lumGain + S.lumLift);
          const studio = '#' + [tr, tg, tb].map((c) => Math.round(c * l2).toString(16).padStart(2, '0')).join('');
          const light = mat.name === 'Main_Light' ? S.lightMix : 0;
          mat.color.setRGB((tr + (255 - tr) * light) / 255, (tg + (255 - tg) * light) / 255, (tb + (255 - tb) * light) / 255, this.THREE.SRGBColorSpace);
          recolored++;
          rows.push(mat.name + ' #' + o.toString(16).padStart(6, '0') + ' → #' + mat.color.getHexString() + (light ? ' (+' + Math.round(light * 100) + ' % white)' : '') + ' · studio formula would give ' + studio);
        } else { mat.color.setHex(o); kept++; }
        mat.needsUpdate = true;
      });
    });
    matchBellyZone(this.figure);
    this.gunGlowMaterials=applyGunPalette(this.figure,'dice');
    this.tintReport = { on, target: '#' + hex.toString(16).padStart(6, '0'), recolored, kept, rows, formula: 'flat colours: body = canon yellow, light zone + ' + Math.round(S.lightMix * 100) + ' % white; sat ≥ ' + S.satMin };
    if (on) this.log('Tint ' + this.tintReport.target + ': ' + rows.join(' · ') + ' · ' + kept + ' kept');
  }
  setTint(on, hex) { this.tintOn = !!on; if (hex != null) this.tintTarget = hex; if (this.figure) this._applyTint(this.tintOn); if (this.rig && hex != null) this.rig.setBaseColor(hex); }

  /* ---------------------------------------------------------------- Kopf-Host + Gesicht */
  /* Wie KloRolli.buildFaceHosts (Z. 656–695): eine unsichtbare Box namens `body`, opacity 0 (nicht
     visible=false, sonst verschwindet das Gesicht als Kind mit). NEU: die Box ist Kind des
     KOPFKNOCHENS, ihre Achsen sind die Weltachsen der Bindepose — dann zeigt −z der Box nach
     hinten in den Kopf, und EyeRig/PetMouth tasten von vorn ab, egal wie der Knochen selbst liegt. */
  _buildFaceHost() {
    const T = this.THREE, m = this.m;
    const parent = this._headBoneObj() || this.figure;
    parent.updateMatrixWorld(true);
    const c = m.headBox.getCenter(new T.Vector3()), s = m.headBox.getSize(new T.Vector3());
    const inner = this.faceInner = new T.Group(); inner.name = 'faceHost';
    parent.add(inner);
    const pw = new T.Vector3(), qw = new T.Quaternion(), sw = new T.Vector3();
    parent.matrixWorld.decompose(pw, qw, sw);
    inner.quaternion.copy(qw).invert();
    inner.position.copy(parent.worldToLocal(c.clone()));
    inner.scale.set(1 / (sw.x || 1), 1 / (sw.y || 1), 1 / (sw.z || 1));
    if (this.faceDir < 0) inner.rotateY(Math.PI);
    const geo = SPEC.hostShape === 'ellipsoid' ? new T.SphereGeometry(1, 40, 28).scale(s.x / 2, s.y / 2, s.z / 2) : new T.BoxGeometry(s.x, s.y, s.z);
    geo.computeBoundingBox();
    const box = this.faceBox = new T.Mesh(geo, new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    box.name = 'body'; box.castShadow = false; box.receiveShadow = false;
    inner.add(box);
    (m.eyeMeshObjs || []).forEach((o) => { o.visible = false; });
    this.log('Head host (' + SPEC.hostShape + ') ' + s.x.toFixed(3) + '×' + s.y.toFixed(3) + '×' + s.z.toFixed(3) + ' on ' + (parent.isBone ? 'bone ' + parent.name : 'figure root') + ' · ' + m.headVerts + '/' + m.totalVerts + ' verts' + (m.eyeMeshes.length ? ' · original eyes hidden: ' + m.eyeMeshes.join(', ') : ' · no eye meshes found'));
  }
  _headBoneObj() { let b = null; if (this.m && this.m.head) this.figure.traverse((o) => { if (!b && o.isBone && o.name === this.m.head) b = o; }); return b; }
  faceCtx() { return { THREE: this.THREE, inner: this.faceInner, o: {}, _squash: null, getFaceShells: () => [] }; }

  _buildFace() {
    const T = this.THREE, E = this.eyeOpts;
    this._disposeFace();
    if (this.EyeRigMod && this.EyeRigMod.EyeRig) {
      const rig = this.rig = new this.EyeRigMod.EyeRig(this.faceCtx(), {
        anchor: Object.assign({}, E.anchor), pupilStyle: E.pupilStyle, pupilSize: E.pupilSize, inset: E.inset, lidFit: E.lidFit, gloss: E.gloss, converge: E.converge || 0,
        baseColor: this.tintTarget != null ? this.tintTarget : E.lidColor, blink: E.blink, life: E.life,
      });
      rig.build(); rig.setGazeFollow(true);
      this.log('EyeRig v5 · dx ' + E.anchor.dx + ' dy ' + E.anchor.dy + ' ring ' + E.anchor.ring + ' · ' + (rig.eyes ? rig.eyes.length : 0) + ' eyes');
    } else this.log('EyeRig module missing');
    if (this.MouthMod && this.MouthMod.PetMouth) {
      const mouth = this.mouth = new this.MouthMod.PetMouth(this.faceCtx(), { params: Object.assign({}, this.mouthOpts) });
      mouth.build(); mouth.enabled = true; mouth.setRest('neutral');
      this.log('PetMouth v1 · ' + this.mouthOpts.set + ' · size ' + this.mouthOpts.size + ' dy ' + this.mouthOpts.dy + ' sx ' + this.mouthOpts.sx + (mouth._wrapMiss ? ' · shrinkwrap missed ' + mouth._wrapMiss + ' verts' : ''));
    } else this.log('Mouth module missing');
    this.setFace(this.faceOn);
  }
  setFace(on) { this.faceOn = !!on; if (this.rig && this.rig.rig) this.rig.rig.visible = this.faceOn; if (this.mouth) this.mouth.enabled = this.faceOn; }
  setEyes(patch) {
    const p = patch || {}, a = {};
    ['dx', 'dy', 'ring', 'track'].forEach((k) => { if (p[k] != null) a[k] = this.eyeOpts.anchor[k] = p[k]; });
    const rest = {};
    ['pupilSize', 'inset', 'lidFit', 'gloss', 'converge', 'pupilStyle'].forEach((k) => { if (p[k] != null) rest[k] = this.eyeOpts[k] = p[k]; });
    if (!this.rig) return;
    if (Object.keys(rest).length) this.rig.setEye(rest);
    if (Object.keys(a).length) this.rig.setAnchor(a);
    this.rig.setGazeFollow(true);
  }
  setMouth(patch) { Object.assign(this.mouthOpts, patch || {}); if (this.mouth) this.mouth.setParams(patch || {}); }
  talk(on) { if (this.mouth) this.mouth.talk(!!on); }
  setEmote(e) { if (this.rig) this.rig.applyEmote(e); if (this.mouth && e && e.rest) this.mouth.setRest(e.rest); }

  /* ---------------------------------------------------------------- Clips */
  async loadCategory(cat) {
    if (this.categories[cat]) return this.categories[cat];
    const T = this.THREE, path = SPEC.anims.dir + SPEC.anims.prefix + cat + '.glb';
    const t0 = performance.now();
    let gltf = this.clipCache.get(cat);
    if (!gltf) { gltf = await this.loader.loadAsync(this.assets.raw(path)); this.clipCache.set(cat, gltf); }
    console.info('[repo-fs] ' + path.split('/').pop() + ' ' + Math.round(performance.now() - t0) + ' ms');
    const entry = this._filterClips(gltf.animations || [], cat);
    this.categories[cat] = entry;
    this.log('Clips ' + cat + ': ' + entry.clips.length + ' · ' + entry.matchedNodes + '/' + entry.totalNodes + ' target nodes match (' + entry.compat + ' %)' + (entry.renamed ? ' · ' + entry.renamed + ' tracks renamed (case/alias)' : ''));
    return entry;
  }
  /* Spur-Filter: nur Spuren, deren Zielknoten in der Figur existiert. Alles andere wäre eine
     Warnung je Bild — und die Zahl der passenden Knoten IST die Verträglichkeitsmessung. */
  _filterClips(anims, cat) {
    const T = this.THREE, names = this.m ? this.m.nodeNames : new Set();
    const lower = new Map(); names.forEach((n) => lower.set(n.toLowerCase(), n));
    const resolve = (n) => names.has(n) ? n : (lower.get(n.toLowerCase()) || (SPEC.boneAlias[n.toLowerCase()] && names.has(SPEC.boneAlias[n.toLowerCase()]) ? SPEC.boneAlias[n.toLowerCase()] : null));
    const allNodes = new Set(), okNodes = new Set(); let renamed = 0;
    const clips = anims.map((c) => {
      const keep = [];
      c.tracks.forEach((tr) => {
        const parsed = T.PropertyBinding.parseTrackName(tr.name), n = parsed.nodeName;
        allNodes.add(n);
        const to = resolve(n);
        if (!to) return;
        okNodes.add(n);
        /* Fremdes Rig: Proportionen stimmen nicht (Riesenkopf, kurze Beine) — Positionen und Skalen
           anderer Knochen würden die Figur dehnen. Nur die WURZEL behält ihre Lage, alle anderen nur
           die Drehung. Das ist die Naht, sie ist hier benannt. */
        const isRoot = /^(root|hips)$/i.test(n);
        if (parsed.propertyName !== 'quaternion' && !isRoot) return;
        if (to === n) { keep.push(tr); return; }
        const cl = tr.clone(); cl.name = tr.name.replace(n, to); keep.push(cl); renamed++;
      });
      return { name: c.name, dur: +c.duration.toFixed(2), source: cat, matched: keep.length, total: c.tracks.length, clip: keep.length ? new T.AnimationClip(c.name, c.duration, keep) : null };
    });
    return { cat, clips, renamed, totalNodes: allNodes.size, matchedNodes: okNodes.size, compat: allNodes.size ? Math.round(100 * okNodes.size / allNodes.size) : 0, missing: [...allNodes].filter((n) => !okNodes.has(n)) };
  }
  allClips() { const out = [...(this.ownClips || [])]; Object.values(this.categories).forEach((e) => out.push(...e.clips)); return out; }
  findClip(re) { return this.allClips().find((c) => c.clip && re.test(c.name)) || null; }
  /* playClip aus asset-lab-v4.js Z. 478–490. */
  play(name, o = {}) {
    const T = this.THREE, entry = this.allClips().find((c) => c.name === name);
    if (!entry || !entry.clip || !this.mixer) return null;
    const next = this.mixer.clipAction(entry.clip);
    next.setLoop(o.loop === false ? T.LoopOnce : T.LoopRepeat, Infinity);
    next.clampWhenFinished = o.loop === false;
    next.timeScale = o.timeScale || 1;
    const fade=o.fade ?? .15;
    if (this.action && this.action !== next) this.action.fadeOut(fade);
    next.stopFading().reset().setEffectiveWeight(1);
    if(fade>0)next.fadeIn(fade);next.play();
    this.action = next; this.current = entry;
    return next;
  }
  stop() { if (this.mixer) { this.mixer.stopAllAction(); this.action = null; this.current = null; } }

  async setVariant(v) {
    if (v === this.variant && this.figure) return;
    const was = this.current ? this.current.name : null;
    this.variant = v;
    await this._loadVariant(v);
    // Clips waren gegen die ALTE Figur gefiltert; Knotennamen könnten sich unterscheiden
    for (const cat of Object.keys(this.categories)) this.categories[cat] = this._filterClips(this.clipCache.get(cat).animations || [], cat);
    if (was) this.play(was, { loop: true }); else { const idle = this.findClip(/idle/i); if (idle) this.play(idle.name, { loop: true }); }
  }

  /* ---------------------------------------------------------------- Boden (asset-lab-v4.js Z. 348–400) */
  _lowestY() {
    const T = this.THREE, root = this.figure;
    root.updateWorldMatrix(true, true);
    const box = new T.Box3(); let any = false;
    /* GEMESSEN 06.09. (Character_Gun): das Gewehr sind VIER plain Meshes `Cube003*` (Black · Gun_Grey · White · Main) am Handknochen,
       das tiefste (Black) bei y 0,000 — die Füße (skinned) bei 0,683. Also zählt zum Boden nur GESKINNTES; ein plain Mesh ist
       Zubehör (Gewehr, Face-Host). Der Materialname allein (`Gun_Grey`) fing nur eins von vier. */
    root.traverse((n) => {
      if (n.isSkinnedMesh) { n.computeBoundingBox(); if (n.boundingBox) { box.union(n.boundingBox.clone().applyMatrix4(n.matrixWorld)); any = true; } }
      else if (false) {
        if (!n.geometry.boundingBox) n.geometry.computeBoundingBox();
        box.union(n.geometry.boundingBox.clone().applyMatrix4(n.matrixWorld)); any = true;
      }
    });
    return (any && isFinite(box.min.y)) ? box.min.y : null;
  }
  _groundKeep(dt) {
    this._gt += dt; if (this._gt < SPEC.groundEvery) return null;
    this._gt = 0;
    const y = this._lowestY(); if (y == null) return null;
    const rootY = this.root.getWorldPosition(new this.THREE.Vector3()).y;
    const d = y - rootY;
    /* GEMESSEN 06.09. (Character_Gun, Idle_Gun): figY sprang auf 0,695 und sank 0,03/Tick — das Gewehr tauchte unter die
       Füße, der volle Sprung nach oben und das Absenken danach waren Georgs »Zittern«. Also: Gewehr zählt nicht (gunMatRe),
       und beide Richtungen gehen in kleinen Schritten mit Totzone. */
    if (Math.abs(d) < 0.012) return null;
    this.figure.position.y -= Math.sign(d) * Math.min(Math.abs(d), 0.02);
    return +d.toFixed(3);
  }

  pulseGun() { this.gunGlowRemaining=.10; }
  shotExpression(){
    this._shotFace=.24;
    if(!this._restFace)this._restFace={...(this.rig?.emote||{}),rest:'neutral'};
    this.setEmote({lidUpper:.18,lidLower:.04,slant:-.20,pupil:'normal',gaze:'front',rest:'angry'});
  }
  stepShotExpression(dt){
    if(!(this._shotFace>0))return;
    this._shotFace=Math.max(0,this._shotFace-dt);
    if(!this._shotFace){this.setEmote(this._restFace||{rest:'neutral'});this._restFace=null;}
  }

  update(dt, camera) {
    this.stepShotExpression(dt);
    this.gunGlowRemaining=stepGunGlow(this.gunGlowMaterials,this.gunGlowRemaining||0,dt);
    this.elapsed += dt;
    if (this.mixer) this.mixer.update(dt);
    if (this.rig) this.rig.update(dt);
    if (this.mouth) this.mouth.update(dt, camera || this.camera);
    if (this.figure) this._groundKeep(dt);
  }

  report() {
    const m = this.m || {};
    return {
      variant: this.variant, file: m.file, source: this.source, ms: m.ms, height: m.height, width: m.width, depth: m.depth,
      meshes: m.meshes, bones: m.bones, boneNames: m.boneNames, head: m.head, headSize: m.headSize ? m.headSize.toArray().map((v) => +v.toFixed(3)) : null,
      headVerts: m.headVerts, totalVerts: m.totalVerts, eyeMeshes: m.eyeMeshes, materials: m.materials, degrayed: m.degrayed,
      ownClips: m.ownClips, tint: this.tintReport, categories: Object.fromEntries(Object.entries(this.categories).map(([k, e]) => [k, { clips: e.clips.length, compat: e.compat, matchedNodes: e.matchedNodes, totalNodes: e.totalNodes, missing: e.missing.slice(0, 12) }])),
      eyes: this.rig ? { count: this.rig.eyes ? this.rig.eyes.length : 0, R: this.rig._R ? +this.rig._R.toFixed(4) : null, anchor: Object.assign({}, this.eyeOpts.anchor), inset: this.eyeOpts.inset, z: this.rig.eyes && this.rig.eyes[0] ? +this.rig.eyes[0].position.z.toFixed(3) : null } : null,
      mouth: this.mouth ? { U: this.mouth._U ? +this.mouth._U.toFixed(4) : null, wrapMiss: this.mouth._wrapMiss, wrapSpan: this.mouth._wrapSpan != null ? +this.mouth._wrapSpan.toFixed(3) : null } : null,
      current: this.current ? this.current.name : null, provenance: this.provenance.slice(),
    };
  }

  _disposeFace() {
    if (this.rig) { try { this.rig.dispose(); } catch (e) {} this.rig = null; }
    if (this.mouth) { try { this.mouth.dispose(); } catch (e) {} this.mouth = null; }
  }
  _disposeFigure() {
    this._disposeFace();
    if (this.mixer) { this.mixer.stopAllAction(); this.mixer = null; this.action = null; this.current = null; }
    if (this.faceInner && this.faceInner.parent) this.faceInner.parent.remove(this.faceInner);
    this.faceInner = null; this.faceBox = null;
    if (this.figure && this.figure.parent) this.figure.parent.remove(this.figure);
    this.figure = null;
  }
  dispose() {
    this._disposeFigure();
    if (this._offPointer) this._offPointer();
    if (this.root && this.root.parent) this.root.parent.remove(this.root);
    this.root = null;
  }
}
