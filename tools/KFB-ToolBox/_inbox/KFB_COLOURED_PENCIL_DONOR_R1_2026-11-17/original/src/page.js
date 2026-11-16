// The page: what turns the drawn scene into a drawing in a sketchbook.
// The scene is drawn as what each thing's pencils leave of the paper's white, with its depth. Then:
//   1. the outlines are drawn. Wherever one thing ends against another, or a surface turns a sharp corner, there
//      is a soft dark line, as from a pencil held lightly: found from depth alone, by asking of each point whether
//      the points beside it lie on one flat with it;
//   2. it is put on paper: a warm white sheet with a tooth, which shows through the colour as flecks of white;
//      and toward the edges of the page the drawing isn't finished, and gives way to bare paper.
import * as THREE from 'three';

const QUAD = /* glsl */ `out vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export function createPage(renderer) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const scene = new THREE.WebGLRenderTarget(size.x, size.y, { samples: 4, type: THREE.HalfFloatType, depthBuffer: true, generateMipmaps: false });
  scene.depthTexture = new THREE.DepthTexture(size.x, size.y, THREE.UnsignedIntType);
  const print = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3, depthTest: false, depthWrite: false,
    uniforms: { tDrawn: { value: scene.texture }, tDepth: { value: scene.depthTexture }, uSize: { value: size.clone() }, uInverse: { value: new THREE.Matrix4() }, uPixel: { value: 1 }, uScale: { value: 1 }, uNear: { value: 0.3 } },
    vertexShader: QUAD,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D tDrawn; uniform sampler2D tDepth; uniform vec2 uSize; uniform mat4 uInverse; uniform float uPixel; uniform float uScale; uniform float uNear;
      in vec2 vUv;
      layout(location = 0) out vec4 outC;
      vec3 seen(vec2 uv) { vec4 p = uInverse * vec4(uv * 2.0 - 1.0, texture(tDepth, uv).r * 2.0 - 1.0, 1.0); return p.xyz / p.w; }
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float soft(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      void main() {
        vec2 px = gl_FragCoord.xy, t = 1.0 / uSize;
        // the paper's tooth, where this pixel is on the sheet
        float tooth = soft(px * 0.55 / uScale) * 0.6 + soft(px * 1.3 / uScale + 9.0) * 0.4;
        // --- the outline ---
        float w = uScale * 0.85;
        vec3 P = seen(vUv), L = seen(vUv - vec2(t.x * w, 0.0)), R = seen(vUv + vec2(t.x * w, 0.0)), D = seen(vUv - vec2(0.0, t.y * w)), U = seen(vUv + vec2(0.0, t.y * w));
        vec3 ax = abs(R.z - P.z) < abs(P.z - L.z) ? R - P : P - L, ay = abs(U.z - P.z) < abs(P.z - D.z) ? U - P : P - D;
        vec3 N = normalize(cross(ax, ay));
        float off = max(max(abs(dot(N, L - P)), abs(dot(N, R - P))), max(abs(dot(N, D - P)), abs(dot(N, U - P)))) / (min(min(-L.z, -R.z), min(-D.z, min(-U.z, -P.z))) * uPixel * w);
        float rough = 5.0 * -P.z / (uNear * 16777216.0 * uPixel);
        // (pressed unevenly, and fainter far off)
        float line = smoothstep(0.34 + rough, 0.7 + rough * 1.5, off) * (0.45 + 0.55 * soft(px * 0.035 / uScale + 4.0)) * (0.6 + 0.5 * tooth) * mix(1.0, 0.45, smoothstep(40.0, 400.0, -P.z));
        vec3 left = texture(tDrawn, vUv).rgb * mix(vec3(1.0), vec3(0.2, 0.17, 0.22), clamp(line * 0.8, 0.0, 1.0));

        // --- the page ---
        vec3 col = pow(clamp(left, 0.0, 1.0), vec3(1.0 / 2.2));
        // flecks of bare paper, where the wax skipped a valley: more of them where the colour is light
        float bare = smoothstep(0.62, 0.9, 1.0 - tooth) * (0.25 + 0.5 * dot(col, vec3(0.333)));
        col = mix(col, vec3(1.0), bare);
        // unfinished toward the edges of the sheet
        vec2 q = min(vUv, 1.0 - vUv) * vec2(uSize.x / uSize.y, 1.0);
        float edge = min(q.x, q.y) + 0.035 * (soft(px * 0.012 / uScale) - 0.5) + 0.02 * (soft(px * 0.05 / uScale) - 0.5);
        col = mix(vec3(1.0), col, smoothstep(0.012, 0.075, edge));
        vec3 paper = vec3(0.975, 0.955, 0.915) * (0.97 + 0.045 * soft(px * 0.3 / uScale)) * (1.0 - 0.035 * soft(px * 0.006 / uScale + 3.0));
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
    resize() {
      renderer.getDrawingBufferSize(size);
      scene.setSize(size.x, size.y);
      print.uniforms.uSize.value.copy(size);
    },
    render(world, camera) {
      print.uniforms.uInverse.value.copy(camera.projectionMatrixInverse);
      print.uniforms.uPixel.value = 2 / (camera.projectionMatrix.elements[5] * size.y);
      print.uniforms.uScale.value = size.y / 1080;
      print.uniforms.uNear.value = camera.near;
      renderer.setRenderTarget(scene);
      renderer.setClearColor(0xffffff, 1);
      renderer.clear();
      renderer.render(world, camera);
      renderer.setRenderTarget(null);
      renderer.render(stage, flat);
    },
  };
}
