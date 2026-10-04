/* KFB Plant Prop Lab · LivingProp-Adapter auf den BESTEHENDEN KFB EyeRig v6
   Kein zweites Augensystem. Dieses Modul baut nur den Wirt, den v6 erwartet, und übersetzt
   Pflanzenmaße in seine Ankerwerte.

   Gelesen aus pet-eye-rig.v6.js (Spender, jsDelivr, nicht kopiert):
   · EyeRig(ch, opts) erwartet `ch.THREE` und `ch.inner`;
   · build() nimmt aus ch.inner das Netz mit dem Namen `body` (sonst das erste),
   · liest dessen GEOMETRIE-Box, setzt U = Höhe/2, R = U · anchor.ring,
   · und TASTET die Oberfläche ab: Strahl von +z lokal nach −z, Auge sitzt auf dem Treffer
     minus R·(0,24 + inset·1,15).
   · Das Rig hängt sich als Kind AN das body-Netz.

   Daraus folgen drei Dinge, die hier zu tun sind und sonst nirgends stehen:
   1) Der Wirt braucht eine abtastbare Oberfläche. Ein Pflanzennetz ist keine (Blätter mit
      Löchern, Ranken, Stämme) — deshalb ein gemessenes Ellipsoid als FaceHost.
   2) Der Wirt darf NICHT `visible = false` sein: das Rig ist sein Kind und würde mit
      verschwinden. Unsichtbar wird er über `opacity 0` + `depthWrite false`.
   3) `castShadow = false` am Wirt — ein unsichtbares Ellipsoid wirft sonst einen sichtbaren
      Schatten (derselbe Fehler wie die Kontaktschatten-Scheibe in S13.3).
   Vor `build()` muss die Weltmatrix stehen, sonst tastet der Strahl ins Leere. */
import * as THREE from 'three';

const BASE = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/tools/KFB-ToolBox/kfb-rigs-embed-v3/';
export const EYE_RIG_URL = BASE + 'petstudio-v9/studio-v12/pet-eye-rig.v6.js';
export const CONTRACT_URL = BASE + 'contracts/kfb-pet-graft-driver.v4.json';

let _mod = null, _emotes = null;
export async function loadEyeRig() {
  if (!_mod) _mod = await import(/* @vite-ignore */ EYE_RIG_URL);
  return _mod;
}
/* Mienen werden GELESEN, nicht erfunden: sie stehen im Vertrag unter face.emotes. */
export async function loadEmotes() {
  if (_emotes) return _emotes;
  try {
    const j = await (await fetch(CONTRACT_URL)).json();
    _emotes = (j.face && j.face.emotes) || null;
  } catch (e) { _emotes = null; }
  return _emotes;
}

export const PLACEMENTS = {
  pot: { label: 'Augen am Topf', note: 'Wirt = gemessenes Ellipsoid des oberen Topfdrittels' },
  crown: { label: 'Augen im Schopf', note: 'Wirt = gemessene Krone der Pflanze' },
  float: { label: 'Augen vorgesetzt', note: 'Wirt schwebt vor dem Schopf (Overlay)' }
};

/* Radius der TRAGENDEN WAND auf einer Höhe — gemessen an den Vertices, nicht aus der Box.
   Grund (Befund S18): die Box eines Topfes mit Untersetzer ist am Untersetzer am breitesten.
   Ein Wirt aus dieser Breite ragt vor die Topfwand, und die Augen schweben davor. Gemessen
   wird das 90-%-Quantil der Radien im Höhenband — die Aussenwand, nicht die Innenwand. */
function wallRadiusAt(node, toParent, y0, y1) {
  if (!node) return null;
  node.updateMatrixWorld(true);
  const v = new THREE.Vector3(), m = new THREE.Matrix4(), rs = [];
  node.traverse((o) => {
    if (!o.isMesh || !o.geometry.attributes.position) return;
    m.multiplyMatrices(toParent, o.matrixWorld);
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m);
      if (v.y >= y0 && v.y <= y1) rs.push(Math.hypot(v.x - 0, v.z - 0));
    }
  });
  if (rs.length < 8) return null;
  rs.sort((a, b) => a - b);
  return { r: rs[Math.floor(rs.length * 0.90)], samples: rs.length };
}

/* Wirt aus gemessenen Maßen. `box` ist die Box des Trägers (Topf oder Krone) in der
   Elternschaft, in der der Wirt hängt. */
function makeFaceHost(box, placement, opts) {
  const size = box.getSize(new THREE.Vector3());
  const c = box.getCenter(new THREE.Vector3());
  let rx, ry, rz, px, py, pz;
  let measured = null;
  if (placement === 'pot') {
    /* Der Wirt liegt IN der Topfwand. Mitte auf 0,56 der Topfhöhe; der Radius kommt aus der
       MESSUNG im Band um diese Höhe, sonst — nur als Rückfall — aus der Box. Die Augen
       tasten die Vorderseite dieses Ellipsoids ab und sitzen damit AUF der Wand; `inset`
       zieht sie anschliessend in die Wand hinein statt sie davorzusetzen. */
    py = box.min.y + size.y * 0.56;
    measured = wallRadiusAt(opts.node, opts.toParent || new THREE.Matrix4(), py - size.y * 0.13, py + size.y * 0.13);
    const r = measured ? measured.r : Math.max(size.x, size.z) * 0.42;
    rx = r; rz = r;
    ry = size.y * 0.46;
    px = c.x; pz = c.z;
  } else if (placement === 'crown') {
    /* Laub ist keine Fläche: ein Wirt in der Kronenmitte liefert Augen ZWISCHEN den Blättern.
       Also ein kleineres Ellipsoid, nach vorn an die Kronenkante gerückt. */
    rx = size.x * 0.26; ry = size.y * 0.22; rz = size.z * 0.22;
    px = c.x; py = c.y + size.y * 0.06; pz = c.z + size.z * 0.22;
  } else {
    const r = Math.min(size.x, size.z) * 0.22;
    rx = r; ry = r * 0.92; rz = r * 0.72;
    px = c.x; py = c.y + size.y * 0.22; pz = c.z + Math.max(size.z * 0.5, r * 1.8);
  }
  const s = opts.hostScale ?? 1;
  rx *= s; ry *= s; rz *= s;
  const hostNote = measured ? `Wandradius gemessen (${measured.samples} Vertices im Band)` : 'Rückfall: Boxbreite';
  const g = new THREE.SphereGeometry(1, 24, 18);
  g.scale(Math.max(rx, 1e-3), Math.max(ry, 1e-3), Math.max(rz, 1e-3));
  g.computeBoundingBox();
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: opts.showHost ? 0.16 : 0,
    depthWrite: false
  });
  const body = new THREE.Mesh(g, mat);
  body.name = 'body';                      // v6 sucht genau diesen Namen
  body.castShadow = false; body.receiveShadow = false;
  body.frustumCulled = false;
  const inner = new THREE.Group();
  inner.name = 'kfb-facehost';
  inner.add(body);
  inner.position.set(px, py, pz);
  if (opts.yaw) inner.rotation.y = opts.yaw;
  return { inner, body, radii: [rx, ry, rz], anchorPos: [px, py, pz], note: hostNote };
}

/* Ankerwerte je Sitz. Der v6 leitet Augengrösse aus R = U·ring ab, U = halbe Wirtshöhe —
   auf einem flachen Topf ist das wenig, deshalb steht `ring` hier deutlich höher als die
   Tier-Voreinstellung 0,22 (Befund: Augen zu klein). `inset` versenkt sie in der Wand. */
const PLACEMENT_DEFAULTS = {
  pot:   { ring: 0.50, dx: 0.40, dy: 0.05, inset: 0.10, splay: 0.26, pupilSize: 0.50, track: 0.11 },
  crown: { ring: 0.46, dx: 0.46, dy: 0.00, inset: 0.10, splay: 0.32, pupilSize: 0.48, track: 0.12 },
  float: { ring: 0.44, dx: 0.44, dy: 0.00, inset: 0.02, splay: 0.35, pupilSize: 0.46, track: 0.12 }
};

export async function mountEyes({ parent, box, placement = 'crown', opts = {} }) {
  const mod = await loadEyeRig();
  const emotes = await loadEmotes();
  const host = makeFaceHost(box, placement, opts);
  parent.add(host.inner);
  parent.updateMatrixWorld(true);                 // Pflicht: build() tastet in Weltkoordinaten

  const ch = {
    THREE, inner: host.inner,
    o: { makeMat: (o) => new THREE.MeshStandardMaterial({ color: o.color, roughness: o.roughness ?? 0.95 }) }
  };
  const D = PLACEMENT_DEFAULTS[placement] || PLACEMENT_DEFAULTS.float;
  const rig = new mod.EyeRig(ch, {
    anchor: { dx: opts.dx ?? D.dx, dy: opts.dy ?? D.dy, ring: opts.ring ?? D.ring, track: opts.track ?? D.track },
    pupilStyle: opts.pupilStyle || 'glossy-googly',
    pupilSize: opts.pupilSize ?? D.pupilSize,
    splay: opts.splay ?? D.splay,
    inset: opts.inset ?? D.inset,
    gloss: opts.gloss ?? 0.9,
    baseColor: opts.baseColor ?? 0x9fd08a,
    blink: { minGap: 2.2, maxGap: 6.0, dur: 0.11 },
    life: { on: true, wander: 0.5, tremor: 0.3 }
  });
  rig.build();
  rig.setGazeFollow(true);
  const frame = rig.eyeFrame();

  const api = {
    host, rig, placement, emotes,
    mounted: !!frame,
    setPointer(nx, ny) { rig.pointTo(nx, ny); },
    setFollow(on) { rig.setGazeFollow(on); },
    blink() { rig.blinkNow(); },
    emote(name) {
      if (emotes && emotes[name]) { rig.applyEmote(emotes[name]); return name; }
      rig.applyEmote({ lidUpper: 0, lidLower: 0, slant: 0, pupil: 'normal', gaze: 'front' });
      return emotes ? 'neutral' : 'kein Vertrag geladen';
    },
    setHostVisible(on) { host.body.material.opacity = on ? 0.16 : 0; },
    update(dt) { rig.update(dt); },
    dispose() { rig.dispose(); host.inner.parent && host.inner.parent.remove(host.inner); },
    report: () => ({
      source: 'pet-eye-rig.v6.js (jsDelivr, nicht kopiert)',
      placement, mounted: !!frame, host: host.note,
      ring: opts.ring ?? D.ring, inset: opts.inset ?? D.inset,
      hostRadii: host.radii.map((v) => +v.toFixed(3)),
      anchor: host.anchorPos.map((v) => +v.toFixed(3)),
      eyeRadius: frame ? +frame.radius.toFixed(3) : null,
      eyes: frame ? [frame.left.toArray().map((v) => +v.toFixed(3)), frame.right.toArray().map((v) => +v.toFixed(3))] : null,
      gen: frame ? frame.gen : 0,
      emotesFromContract: emotes ? Object.keys(emotes) : []
    })
  };
  return api;
}
