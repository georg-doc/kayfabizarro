/* KFB WorldDesign Lab v1 · Natürliches Testgelände
   „Keine grüne Platte als Gras": das Gelände ist eine Höhenfläche mit gerundeten Hügeln, einer
   Senke und einer ausgewaschenen Rinne; die Grundfarbe folgt HANG und HÖHE (Erde in der Ebene,
   Fels an steilen Flanken, trockenere Kuppen) — gedämpft, nicht grasgrün. Die Oberfläche selbst
   bekommt denselben Look wie alle Spender (triplanar in Weltkoordinaten): genau die Stelle, an
   der Triplanar sich lohnt, weil ein Gelände keine brauchbaren UVs hat.

   Quellenlage, ehrlich: in der Registry liegen nur KACHEL-Gelände (Hex `grass-hill`/`stone-hill`,
   KayKit Medieval Builder `mountain`/`detail_hill`, Kenney `ground-hills`, Space `terrain_slope`)
   — kein organisches Höhenfeld. Dieses Gelände ist deshalb Laborgeometrie (MISSING_DELTA) und
   kein Paketasset. Unter den Spendern wird es flach genug, dass sie ruhig stehen. */

import * as THREE from 'three';

function hash(x, z, s) {
  const h = Math.sin(x * 127.1 + z * 311.7 + s * 74.7) * 43758.5453;
  return h - Math.floor(h);
}
function vnoise(x, z, s) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const fx = x - xi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(xi, zi, s), b = hash(xi + 1, zi, s), c = hash(xi, zi + 1, s), d = hash(xi + 1, zi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, z, s) {
  let f = 0, a = 0.5, q = 1;
  for (let i = 0; i < 5; i++) { f += a * vnoise(x * q, z * q, s + i * 13); a *= 0.5; q *= 2.03; }
  return f;
}

export const DEF = { seed: 7, hills: 3.2, rough: 0.6, flat: 0.8 };

/* box = Grundriss der Spender; pads = Standflächen, unter denen das Gelände beruhigt wird */
export function makeTerrain(box, pads = [], p0 = {}) {
  const p = { ...DEF, ...p0 };
  const c = box.getCenter(new THREE.Vector3());
  const s = box.getSize(new THREE.Vector3());
  const W = Math.max(24, s.x + 26), D = Math.max(24, s.z + 26);
  const hx = s.x / 2 + 2, hz = s.z / 2 + 2;

  /* Gelände-Höhe: sanfte Grundwelle überall, grosse Hügel NUR ausserhalb des Spenderfeldes,
     dazu eine gewundene Rinne, die hinten quer durchläuft. */
  function heightAt(x, z) {
    const lx = x - c.x, lz = z - c.z;
    const ex = Math.max(0, Math.abs(lx) - hx), ez = Math.max(0, Math.abs(lz) - hz);
    const out = Math.min(1, Math.sqrt(ex * ex + ez * ez) / 8);
    const base = (fbm(x * 0.09, z * 0.09, p.seed) - 0.5) * 1.1 * (1 - p.flat * 0.7);
    const hill = Math.pow(fbm(x * 0.05 + 3.1, z * 0.05 - 1.7, p.seed + 5), 1.6) * p.hills * 2.4 * out;
    const detail = (fbm(x * 0.35, z * 0.35, p.seed + 9) - 0.5) * p.rough * (0.25 + out);
    const river = lz + hz + 3.5 + Math.sin(lx * 0.22) * 2.2;
    const carve = Math.exp(-(river * river) / 3.2) * 1.4;
    let h = base + hill + detail - carve;
    for (const q of pads) {
      const dx = x - q.x, dz = z - q.z;
      const w = Math.exp(-(dx * dx + dz * dz) / (q.r * q.r));
      h = h * (1 - w) + q.h * w;
    }
    return h;
  }

  const seg = 200;
  const geo = new THREE.PlaneGeometry(W, D, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + c.x, z = pos.getZ(i) + c.z;
    pos.setXYZ(i, x, heightAt(x, z), z);
  }
  geo.computeVertexNormals();

  /* Grundfarbe nach Hang/Höhe — gedämpfte Erd-, Moos- und Felstöne, kein Rasengrün */
  const nrm = geo.attributes.normal;
  const col = new Float32Array(pos.count * 3);
  const earth = new THREE.Color(0x6b5a45), moss = new THREE.Color(0x5f6344), dry = new THREE.Color(0x8a7a5c);
  const rock = new THREE.Color(0x77716b), wet = new THREE.Color(0x3f3a33);
  const t = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const slope = 1 - nrm.getY(i);
    const n = fbm(x * 0.18, z * 0.18, p.seed + 21);
    t.copy(earth).lerp(moss, THREE.MathUtils.smoothstep(n, 0.45, 0.7) * 0.8);
    t.lerp(dry, THREE.MathUtils.smoothstep(y, 1.2, 3.6) * 0.7);
    t.lerp(rock, THREE.MathUtils.smoothstep(slope, 0.12, 0.32));
    t.lerp(wet, THREE.MathUtils.smoothstep(-y, 0.35, 1.0) * 0.8);
    col[i * 3] = t.r; col[i * 3 + 1] = t.g; col[i * 3 + 2] = t.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94, metalness: 0 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'terrain:lab';
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return { mesh, heightAt, size: [W, D] };
}
