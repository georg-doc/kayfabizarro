// Boden-Modul · Host-Vertrag R1.2. Kompakter organischer Knet-Boden: abgeflachte Kugel (three-Grundkörper, kein Asset),
// K1-Knete Profil terrainFg. Kein Hex (V-194). Platzhalter, bis der Worldbuilder-Owner den Bühnenboden liefert (V-209, V-216).
import * as THREE from 'three';
import { k1Material, seedGeometry } from '../vendor/k1/clay-k1-adapter.js';

export function create(o) {
  const r = o.radius ?? 17, sy = o.flat ?? 0.07, col = o.color ?? '#9aab62';
  const geo = new THREE.SphereGeometry(r, 96, 32, 0, Math.PI * 2, 0, Math.PI / 2); seedGeometry(THREE, geo, 3);
  const mat = k1Material(o.K1U, col, 'terrainFg', false), m = new THREE.Mesh(geo, mat);
  m.scale.set(1, sy, o.depth ?? 0.62); m.position.y = -r * sy; m.receiveShadow = true; m.name = 'ground';
  const g = new THREE.Group(); g.name = 'ground'; g.add(m);
  return { object3d: g, heightAt: (x, z) => { const zz = z / (o.depth ?? 0.62), q = r * r - x * x - zz * zz; return q > 0 ? Math.sqrt(q) * sy - r * sy : -r * sy; }, update() {}, dispose() { geo.dispose(); mat.dispose(); } };
}
