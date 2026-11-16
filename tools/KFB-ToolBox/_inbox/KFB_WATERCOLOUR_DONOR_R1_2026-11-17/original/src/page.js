// The page: what turns the painted scene into a watercolour on a sheet of rough paper.
// The scene is drawn as what the paint (or, before it, the pencil) leaves of the paper's white, with its depth, and
// with a mark on everything that is a touch of the brush and has no outline. Then:
//   1. it is decided where the paper was wet when the paint went on. Far things were painted wet, all of them: the
//      hills, the far wood, the far side of the meadow. Nearer, the paper was wet in patches, which stay where they
//      are in the world; and right in front of the eye it was dry. Only paint is ever wet, never the pencil;
//   2. the paint is let run a little everywhere (it is taken from slightly beside where it lies, so that it doesn't
//      keep inside the pencil's lines), and where the paper was wet it spreads: each place takes its colour from
//      around it, but only from what lies about as far off as itself. So the leaves inside a crown run together
//      into one soft mass while the crown's edge against the sky stays crisp, and far off everything runs into
//      everything. Where a wet damp dried against a dry one there is the thin dark crinkled line that pigment
//      leaves there, and the damp itself is a little paler;
//   3. the underdrawing's outlines are drawn, in pencil, found from depth alone. They are lost where the paint is wet;
//   4. it is put on paper: a cream sheet with a grain.
import * as THREE from 'three';

const QUAD = /* glsl */ `out vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export function createPage(renderer) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  // (it keeps smaller copies of itself, which is what the wet passages are gathered from)
  const scene = new THREE.WebGLRenderTarget(size.x, size.y, { samples: 4, type: THREE.HalfFloatType, depthBuffer: true, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter });
  scene.depthTexture = new THREE.DepthTexture(size.x, size.y, THREE.UnsignedIntType);
  const print = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3, depthTest: false, depthWrite: false,
    uniforms: {
      tDrawn: { value: scene.texture }, tDepth: { value: scene.depthTexture }, uSize: { value: size.clone() }, uInverse: { value: new THREE.Matrix4() }, uCamWorld: { value: new THREE.Matrix4() },
      uPixel: { value: 1 }, uScale: { value: 1 }, uNear: { value: 0.3 }, uFar: { value: 4000 }, uWet: { value: 1 },
    },
    vertexShader: QUAD,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D tDrawn; uniform sampler2D tDepth; uniform vec2 uSize; uniform mat4 uInverse; uniform mat4 uCamWorld; uniform float uPixel; uniform float uScale; uniform float uNear; uniform float uFar; uniform float uWet;
      in vec2 vUv;
      layout(location = 0) out vec4 outC;
      vec3 seen(vec2 uv) { vec4 p = uInverse * vec4(uv * 2.0 - 1.0, texture(tDepth, uv).r * 2.0 - 1.0, 1.0); return p.xyz / p.w; }
      // how far off along the eye's line, counted no further than the last range of hills: the sky is no further than that
      float deep(vec2 uv) { return min(uNear * uFar / (uFar - texture(tDepth, uv).r * (uFar - uNear)), 800.0); }
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float soft(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float soft3(vec3 p) {
        vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x), mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
                   mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x), mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
      }
      void main() {
        vec2 px = gl_FragCoord.xy, t = 1.0 / uSize;
        // the paper's grain, where this pixel is on the sheet
        float tooth = soft(px * 0.5 / uScale) * 0.55 + soft(px * 1.2 / uScale + 9.0) * 0.45;

        // --- where the paper was wet ---
        vec3 P = seen(vUv);
        float dist = length(P);
        // (what is far is given the grain of a thing sixty metres off, or its grain would be finer than the page's)
        vec3 wp = (uCamWorld * vec4(P / dist * min(dist, 60.0), 1.0)).xyz;
        float damp = soft3(wp * 0.21 + 5.0) * 0.62 + soft3(wp * 0.55 + 11.0) * 0.38 + (soft3(wp * 2.3 + 3.0) - 0.5) * 0.05 + (soft3(wp * 7.0 + 9.0) - 0.5) * 0.02;
        float near = smoothstep(9.0, 17.0, dist), wetPatch = smoothstep(0.5, 0.66, damp) * near, wetFar = smoothstep(20.0, 85.0, dist);
        // (only paint is wet: where the page about here is still pencil, nothing runs)
        vec3 about = textureLod(tDrawn, vUv, 5.0).rgb;
        float painted = smoothstep(0.03, 0.09, max(about.r, max(about.g, about.b)) - min(about.r, min(about.g, about.b)));
        float W = clamp(max(wetPatch * 0.72, wetFar), 0.0, 1.0) * painted * uWet;

        // --- the paint, run and softened ---
        vec2 run = (vec2(soft(px * 0.012 / uScale + 31.0), soft(px * 0.012 / uScale + 77.0)) - 0.5) * 7.0 + (vec2(soft(px * 0.05 / uScale + 5.0), soft(px * 0.05 / uScale + 53.0)) - 0.5) * 3.0;
        vec2 at = vUv + run * (1.0 + 1.4 * W) * uScale * t;
        float s = 1.7 * uScale;
        vec3 c0 = textureLod(tDrawn, at, 0.0).rgb;
        vec3 cL = textureLod(tDrawn, at - vec2(t.x * s, 0.0), 0.0).rgb, cR = textureLod(tDrawn, at + vec2(t.x * s, 0.0), 0.0).rgb, cD = textureLod(tDrawn, at - vec2(0.0, t.y * s), 0.0).rgb, cU = textureLod(tDrawn, at + vec2(0.0, t.y * s), 0.0).rgb;
        vec3 left = mix(c0, (cL + cR + cD + cU) * 0.25, 0.55);
        // darker where washes meet, when they met dry
        float meet = length(cR - cL) + length(cU - cD);
        left *= 1.0 - clamp(meet * 0.55, 0.0, 0.26) * (0.6 + 0.6 * tooth) * (1.0 - W);
        // where it was wet, it spreads
        float r = W * 13.0 * uScale;
        if (r > 0.75) {
          float dc = deep(at), k = mix(0.2, 0.6, smoothstep(12.0, 60.0, dc)), lod = max(0.0, log2(r) - 2.0), turn = hash(px) * 6.2832;
          vec3 sum = left * 0.6; float all = 0.6;
          for (int i = 0; i < 14; i++) {
            float fi = float(i) + 0.5, a = fi * 2.39996 + turn;
            vec2 o = vec2(cos(a), sin(a)) * sqrt(fi / 14.0) * r * t;
            float w = 1.0 - smoothstep(k * 0.6, k, abs(log(deep(at + o) / dc)));
            sum += textureLod(tDrawn, at + o, lod).rgb * w; all += w;
          }
          left = mix(left, sum / all, smoothstep(0.75, 2.5, r));
        }
        // (wet paint is never even: its pigment settles into the grain of the paper, and gathers in soft clouds)
        left = pow(max(left, vec3(0.001)), vec3(1.0 + W * (0.42 * (tooth - 0.5) + (1.0 - 0.8 * wetFar) * (0.5 * (soft3(wp * 1.7 + 21.0) - 0.5) + 0.3 * (soft3(wp * 5.0 + 2.0) - 0.5)))));
        // a wet damp dries paler, with a thin dark crinkled line where it stopped
        float bloom = (1.0 - smoothstep(0.0, 0.007, abs(damp - 0.5))) * near * (1.0 - wetFar) * painted * uWet;
        left = mix(left, vec3(1.0), 0.05 * wetPatch * painted * uWet);
        left *= 1.0 - 0.11 * bloom * (0.5 + tooth);

        // --- the pencil's outline ---
        float w = uScale * 0.85;
        vec3 L = seen(vUv - vec2(t.x * w, 0.0)), R = seen(vUv + vec2(t.x * w, 0.0)), D = seen(vUv - vec2(0.0, t.y * w)), U = seen(vUv + vec2(0.0, t.y * w));
        vec3 ax = abs(R.z - P.z) < abs(P.z - L.z) ? R - P : P - L, ay = abs(U.z - P.z) < abs(P.z - D.z) ? U - P : P - D;
        vec3 N = normalize(cross(ax, ay));
        float off = max(max(abs(dot(N, L - P)), abs(dot(N, R - P))), max(abs(dot(N, D - P)), abs(dot(N, U - P)))) / (min(min(-L.z, -R.z), min(-D.z, min(-U.z, -P.z))) * uPixel * w);
        float rough = 5.0 * -P.z / (uNear * 16777216.0 * uPixel);
        // (a touch of the brush has no outline, nor has anything seen against one)
        float drawn = min(textureLod(tDrawn, vUv, 0.0).a, min(min(textureLod(tDrawn, vUv - vec2(t.x * w, 0.0), 0.0).a, textureLod(tDrawn, vUv + vec2(t.x * w, 0.0), 0.0).a), min(textureLod(tDrawn, vUv - vec2(0.0, t.y * w), 0.0).a, textureLod(tDrawn, vUv + vec2(0.0, t.y * w), 0.0).a)));
        float line = smoothstep(0.34 + rough, 0.7 + rough * 1.5, off) * (0.4 + 0.6 * soft(px * 0.035 / uScale + 4.0)) * (0.55 + 0.55 * tooth) * mix(1.0, 0.35, smoothstep(30.0, 300.0, -P.z)) * drawn * (1.0 - 0.9 * W);
        left *= mix(vec3(1.0), vec3(0.3, 0.28, 0.33), clamp(line * 0.62, 0.0, 1.0));

        // --- the page ---
        vec3 col = pow(clamp(left, 0.0, 1.0), vec3(1.0 / 2.2));
        // where a dry brush skipped the grain, a sparkle of paper
        float bare = smoothstep(0.7, 0.93, 1.0 - tooth) * (0.1 + 0.3 * dot(col, vec3(0.333))) * (1.0 - 0.6 * W);
        col = mix(col, vec3(1.0), bare);
        vec3 paper = vec3(0.98, 0.962, 0.925) * (0.955 + 0.06 * tooth) * (1.0 - 0.03 * soft(px * 0.006 / uScale + 3.0));
        outC = vec4(col * paper, 1.0);
      }`,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), print);
  quad.frustumCulled = false;
  const stage = new THREE.Scene();
  stage.add(quad);
  const flat = new THREE.Camera();
  return {
    depth: scene.depthTexture,
    /** How wet the paper is: 1 as painted, 0 for everything crisp. */
    wet: print.uniforms.uWet,
    resize() {
      renderer.getDrawingBufferSize(size);
      scene.setSize(size.x, size.y);
      print.uniforms.uSize.value.copy(size);
    },
    render(world, camera) {
      print.uniforms.uInverse.value.copy(camera.projectionMatrixInverse);
      print.uniforms.uCamWorld.value.copy(camera.matrixWorld);
      print.uniforms.uPixel.value = 2 / (camera.projectionMatrix.elements[5] * size.y);
      print.uniforms.uScale.value = size.y / 1080;
      print.uniforms.uNear.value = camera.near;
      print.uniforms.uFar.value = camera.far;
      renderer.setRenderTarget(scene);
      renderer.setClearColor(0xffffff, 1);
      renderer.clear();
      renderer.render(world, camera);
      renderer.setRenderTarget(null);
      renderer.render(stage, flat);
    },
  };
}
