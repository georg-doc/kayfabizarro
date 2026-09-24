// KFB Cologne Race · 3D-Countdown-Ziffern, zweiter Versuch
//
// Der erste Versuch (siehe Kommentar in cologne-stage.v1.js) scheiterte, weil
// die Low-Poly-Zahlen aus dem Platformer Game Kit als 9-m-Streckenschild aus
// der Verfolgerkamera unsauber lasen. Diesmal: klein, nah am Start, UND die
// Kanten selbst weichgezeichnet, statt das an die Entfernung zu delegieren.
//
// "Abgerundet ohne Ecken": Vertices werden verschmolzen (mergeVertices),
// die Normalen darueber neu gemittelt (computeVertexNormals) und jeder
// Punkt ein kleines Stueck entlang seiner (jetzt gemittelten) Normale nach
// aussen verschoben. An Kanten divergieren die gemittelten Normalen am
// staerksten, dort schiebt der Versatz am meisten auf einmal weit auf einmal
// wenig — genau der Kissen-/Bonbon-Effekt, den Cartoon-Ziffern brauchen.
import { RAW } from './cologne-world.v1.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const DIGIT_GLTF = n =>
  `media/3D_Assets/Platformer Game Kit - Dec 2021/Level and Mechanics/glTF/Numbers_${n}.gltf`;
const TARGET_H = 2.4; // m — Nahsicht am Start, nicht Streckenschild-Massstab

function roundify(THREE, geometry, amount) {
  const g = mergeVertices(geometry, 1e-4);
  g.computeVertexNormals();
  const pos = g.attributes.position, nor = g.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(i,
      pos.getX(i) + nor.getX(i) * amount,
      pos.getY(i) + nor.getY(i) * amount,
      pos.getZ(i) + nor.getZ(i) * amount);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

export async function createCountdown3D(THREE, GLTFLoader, parent, startPos, opts = {}) {
  const group = new THREE.Group();
  group.name = 'kfb-countdown3d';
  group.visible = false;
  group.position.set(startPos.x, startPos.y + 2.3, startPos.z);
  parent.add(group);

  const loader = new GLTFLoader();
  const digits = {};
  for (const n of [1, 2, 3]) {
    try {
      const g = await loader.loadAsync(RAW(DIGIT_GLTF(n)));
      const scene = g.scene;
      scene.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false; o.receiveShadow = false;
        o.geometry = roundify(THREE, o.geometry, 0.05);
        o.material = new THREE.MeshStandardMaterial({
          roughness: 0.4, metalness: 0.05, toneMapped: false
        });
      });
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const scale = TARGET_H / Math.max(0.001, size.y);
      scene.scale.setScalar(scale);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
      const holder = new THREE.Group();
      holder.visible = false;
      holder.add(scene);
      group.add(holder);
      digits[n] = holder;
    } catch (e) { /* Ziffer fehlt -> ueberspringen, 2D-HUD bleibt der Rueckfall */ }
  }

  let active = null;
  const built = Object.keys(digits).length;

  const api = {
    group,
    ready: built > 0,
    builtCount: built,
    get currentDigit() { return active ? active.n : null; },
    show(n, colorHex) {
      Object.values(digits).forEach(h => { h.visible = false; });
      const h = digits[n];
      if (!h) { group.visible = false; active = null; return; }
      group.visible = true;
      h.visible = true;
      active = { holder: h, n, born: performance.now() / 1000 };
      h.traverse(o => { if (o.isMesh) o.material.color.set(colorHex); });
    },
    hide() { group.visible = false; active = null; },
    // frac läuft 1 -> 0 innerhalb der laufenden Sekunde: 1 beim Aufploppen,
    // 0 kurz bevor die naechste Ziffer uebernimmt.
    update(camera, frac) {
      if (!active || !group.visible) return;
      const h = active.holder;
      const now = performance.now() / 1000;
      const born = Math.min(1, (now - active.born) * 3.2);
      const pop = born < 1 ? (1 + Math.sin(born * Math.PI) * 0.35 * (1 - born)) : 1;
      const pulse = 1 + Math.sin(now * 6.4) * 0.045;
      h.scale.setScalar(pop * pulse * (0.85 + frac * 0.15));
      h.rotation.y = (1 - frac) * Math.PI * 0.7 + Math.sin(now * 1.6) * 0.06;
      const dx = camera.position.x - group.position.x, dz = camera.position.z - group.position.z;
      group.rotation.y = Math.atan2(dx, dz);
    },
    dispose() { parent.remove(group); }
  };
  return api;
}
