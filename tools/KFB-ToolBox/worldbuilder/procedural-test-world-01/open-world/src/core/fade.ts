// Occluder fade: one shared whole-object fade for solid world objects (buildings, props) that stand between the follow
// camera and the player, or that the camera is (nearly) inside. Same idea as nature's whole-instance fade, owned by core
// so every module uses one implementation. Never a hole: one alpha per object (from its anchor sphere), resolved by
// alpha-to-coverage on the MSAA target. Shadows are unaffected (three's default depth material).
//
// Usage (module side):
//   1. per merged vertex, write attribute `aFadeAnchor` = (centre.x, centre.y, centre.z, FADE_W0 + radius) of the object
//      the vertex belongs to (world space; merged chunk meshes have an identity model matrix);
//   2. render the mesh with `occluderFadeMaterial(baseMaterial)`.
// Vertices whose anchor w < FADE_W0 (e.g. a missing attribute → WebGL default (0,0,0,1)) never fade.
import * as THREE from 'three';

export const FADE_ATTR = 'aFadeAnchor';
/** Offset added to the radius in aFadeAnchor.w so a missing attribute (w = 1) is recognisably "no anchor". */
export const FADE_W0 = 10;

/** Updated by the engine once per frame, after the camera has moved (no one-frame lag). */
export const fadeUniforms = {
  uFadeCam: { value: new THREE.Vector3() },
  uFadePlayer: { value: new THREE.Vector3() },
  uFadePlayerOn: { value: 0 },
};

const cache = new Map<THREE.Material, THREE.Material>();

/** Fill an aFadeAnchor attribute for `count` vertices with one sphere (helper for per-object geometry before merging). */
export function fadeAnchorAttribute(count: number, centre: THREE.Vector3, radius: number): THREE.BufferAttribute {
  const a = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) a.set([centre.x, centre.y, centre.z, FADE_W0 + radius], i * 4);
  return new THREE.BufferAttribute(a, 4);
}

/** Clone of `base` with the occluder fade (cached per base material). Keeps any onBeforeCompile of the base. */
export function occluderFadeMaterial(base: THREE.Material): THREE.Material {
  let m = cache.get(base);
  if (m) return m;
  const c = base.clone();
  c.name = (base.name || 'mat') + '-fade';
  c.alphaToCoverage = true;
  const prev = base.onBeforeCompile?.bind(base);
  const prevKey = base.customProgramCacheKey?.bind(base);
  c.onBeforeCompile = (sh, r) => {
    prev?.(sh, r);
    Object.assign(sh.uniforms, fadeUniforms);
    sh.vertexShader = sh.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute vec4 aFadeAnchor;
        uniform vec3 uFadeCam;
        uniform vec3 uFadePlayer;
        uniform float uFadePlayerOn;
        varying float vFadeA;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          float fade = 0.0;
          if (aFadeAnchor.w >= ${FADE_W0.toFixed(1)}) {
            vec3 A = aFadeAnchor.xyz;
            float R = aFadeAnchor.w - ${FADE_W0.toFixed(1)};
            // The anchor is a bounding sphere: generous for box-like buildings, so both tests use a tighter core
            // radius (cam_r6: houses faded while merely near the camera or behind the hero).
            float Rc = 0.7 * R;
            // camera (nearly) inside the object's core: fade it out completely
            fade = 1.0 - smoothstep(0.1, 0.8, distance(A, uFadeCam) - Rc);
            if (uFadePlayerOn > 0.5) {
              // object crossing the camera → player-chest line, with its centre clearly IN FRONT of the player
              // (an object whose centre is behind or beside the hero can never hide him)
              vec3 P = uFadePlayer + vec3(0.0, 0.95, 0.0);
              vec3 d = P - uFadeCam;
              float L = max(length(d), 0.001);
              vec3 dir = d / L;
              float t = dot(A - uFadeCam, dir);
              float dp = length(A - (uFadeCam + dir * t));
              float along = smoothstep(-Rc, 0.3, t) * (1.0 - smoothstep(L - 1.2, L - 0.4, t));
              // the line must pass near the object's middle: a box-like building that really hides the hero is crossed
              // close to its centre; one merely beside the line (sprinting past a house) is not touched
              float Rl = 0.5 * R;
              fade = max(fade, 0.85 * along * (1.0 - smoothstep(Rl, Rl + 0.4, dp)));
            }
          }
          vFadeA = 1.0 - fade;
        }`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying float vFadeA;`)
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        if (vFadeA < 0.02) discard;`,
      )
      .replace('#include <alphatest_fragment>', `diffuseColor.a *= vFadeA;\n#include <alphatest_fragment>`);
  };
  c.customProgramCacheKey = () => (prevKey ? prevKey() : '') + '|occluder-fade-v3';
  cache.set(base, c);
  return c;
}

/** Called by the engine after lateUpdate (camera final for this frame). */
export function updateFadeUniforms(camera: THREE.Camera, player: THREE.Vector3 | undefined, playerOn: boolean): void {
  camera.getWorldPosition(fadeUniforms.uFadeCam.value);
  if (player) fadeUniforms.uFadePlayer.value.copy(player);
  fadeUniforms.uFadePlayerOn.value = playerOn && player ? 1 : 0;
}
