// ============================================================================
// carpet-mesh.js — Der Teppich als Mesh, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/CarpetMesh.ts (gelesen 27.8.2026).
// Lokal +Z vorwärts, +Y oben. Flacher Körper, Goldborte, Stoffwelle im Vertex-Shader über ein
// geteiltes Zeit-Uniform. Alle Maße und Unterteilungen unverändert (s = 0.025).
//
// **Der Passagier ist bei uns nicht das Capybara.** Im Original lädt hier `/3D/capybara.glb`; in
// KFB sitzt an dieser Stelle das Pet, und die Fläche des Teppichs trägt eine Kartentextur. Der
// Ladeort heißt deshalb `passenger` statt `capybara` — Georgs nächster Schritt („pet & karte als
// flug avatar") hängt genau dort ein. Sonst ist nichts geändert.
// ============================================================================

import { initRimLight, addRimLight } from './rim-light.js';

const WOBBLE_GLSL = `
  vec3 gp = position + uOffset;
  float dx = sin(gp.x * 60.0 + uTime * 5.0) * 0.4
           + sin(gp.z * 40.0 + uTime * 3.5) * 0.6;
  float edge = smoothstep(0.0, 1.0, length(gp.xz) / 0.06);
  transformed.y += dx * 0.012 * (0.35 + 0.65 * edge);
`;

/** Dieselbe Welle auf der CPU — für Dinge, die AUF dem Teppich sitzen (Quasten, Pet). */
export function carpetWobbleY(x, z, time) {
  const dx = Math.sin(x * 60 + time * 5) * 0.4 + Math.sin(z * 40 + time * 3.5) * 0.6;
  const len = Math.sqrt(x * x + z * z);
  const edge = Math.min(1, Math.max(0, len / 0.06));
  return dx * 0.012 * (0.35 + 0.65 * edge);
}

function addWobble(mat, timeUniform, offset) {
  const uOffset = { value: offset };
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, renderer) => {
    if (prev) prev(shader, renderer);      // den Rim-Patch nicht überschreiben
    shader.uniforms.uTime = timeUniform;
    shader.uniforms.uOffset = uOffset;
    shader.vertexShader = 'uniform float uTime;\nuniform vec3 uOffset;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\n' + WOBBLE_GLSL);
  };
}

export function createCarpetMesh(THREE, baseColor) {
  initRimLight(THREE);
  const color = baseColor != null ? baseColor : 0x6b1d6e;
  const carpet = new THREE.Group();
  const s = 0.025;

  const timeUniform = { value: 0 };
  carpet.userData.timeUniform = timeUniform;

  function makeTrimMat(offset) {
    const m = new THREE.MeshPhongMaterial({ color: 0xd4a830, flatShading: true, shininess: 60 });
    addRimLight(m, 0xffe888, 0.35, 2.5);
    addWobble(m, timeUniform, offset);
    return m;
  }

  const bodyMat = new THREE.MeshPhongMaterial({ color, flatShading: true, shininess: 45 });
  addRimLight(bodyMat, 0xeeccff, 0.45, 2.5);
  addWobble(bodyMat, timeUniform, [0, 0, 0]);

  const patternMat = new THREE.MeshPhongMaterial({ color: 0x8b2252, flatShading: true, shininess: 40 });
  addRimLight(patternMat, 0xffaacc, 0.35, 2.5);
  addWobble(patternMat, timeUniform, [0, 0.001, 0]);

  const bodyW = s * 2.8, bodyH = s * 0.06, bodyLen = s * 3.6;
  const body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, bodyLen, 10, 1, 14), bodyMat);
  carpet.add(body);

  const inner = new THREE.Mesh(new THREE.BoxGeometry(s * 1.6, bodyH + 0.001, s * 2.0, 6, 1, 8), patternMat);
  inner.position.set(0, 0.001, 0);
  carpet.add(inner);

  const trimThick = s * 0.18;
  for (const side of [-1, 1]) {
    const sx = side * (bodyW * 0.5 - trimThick * 0.3);
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(trimThick, bodyH + 0.001, bodyLen + s * 0.1, 1, 1, 12), makeTrimMat([sx, 0.001, 0]));
    strip.position.set(sx, 0.001, 0);
    strip.name = side < 0 ? 'trimLeft' : 'trimRight';
    carpet.add(strip);
  }
  for (const end of [-1, 1]) {
    const sz = end * (bodyLen * 0.5 - trimThick * 0.3);
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(bodyW + s * 0.1, bodyH + 0.001, trimThick, 8, 1, 1), makeTrimMat([0, 0.001, sz]));
    strip.position.set(0, 0.001, sz);
    carpet.add(strip);
  }

  // Passagier-Platz: im Original das Capybara-GLB, hier der Anker für das KFB-Pet.
  const passenger = new THREE.Group();
  passenger.name = 'passenger';
  passenger.position.set(0, bodyH * 0.5, -s * 0.4);
  carpet.add(passenger);

  carpet.traverse((child) => { child.castShadow = true; });
  carpet.userData.hullMaterial = bodyMat;
  return carpet;
}
