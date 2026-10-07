// Optional post pipeline (no EffectComposer; three passes we control):
//   1. scene → MSAA HalfFloat target with a depth texture (lighting, fog, sky — all linear, no tone mapping)
//   2. GTAOPass in "AO only" mode on that depth (normals reconstructed from depth → no extra scene draw),
//      at reduced resolution, Poisson-denoised
//   3. one full-screen pass: colour × AO (fades out with distance via fog-aware weight) → tone mapping
//      → output colour space → canvas
// Hooked into core through ctx.setRenderOverride(). If anything throws, core falls back to a plain render.
import * as THREE from 'three';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

export interface PostOptions {
  aoScale: number; // resolution scale of the AO buffers
  aoIntensity: number;
  aoRadius: number; // metres
  aoPower: number;
  aoThickness: number;
  aoSamples: number;
  pdSamples: number;
  pdRadius: number;
  pdRings: number; // GTAO 'scale' = exponent on the visibility term
}

export class Post {
  readonly target: THREE.WebGLRenderTarget;
  readonly gtao: GTAOPass;
  private quad: FullScreenQuad;
  private material: THREE.ShaderMaterial;
  private size = new THREE.Vector2();
  enabled = true;
  aoEnabled = true;

  constructor(private renderer: THREE.WebGLRenderer, private scene: THREE.Scene, private camera: THREE.PerspectiveCamera, readonly opt: PostOptions) {
    renderer.getDrawingBufferSize(this.size);
    const w = this.size.x, h = this.size.y;
    const depth = new THREE.DepthTexture(w, h);
    depth.type = THREE.UnsignedIntType;
    this.target = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      samples: 4,
      depthTexture: depth,
      depthBuffer: true,
    });
    this.target.texture.name = 'environment:post.color';
    const aw = Math.max(1, Math.round(w * opt.aoScale)), ah = Math.max(1, Math.round(h * opt.aoScale));
    // NB: passing { depthTexture } to the constructor crashes in r186 (normalRenderTarget is then never created
    // but still dereferenced). Construct with its own G-buffer, then switch to our depth (normals from depth).
    this.gtao = new GTAOPass(scene, camera, aw, ah);
    this.gtao.setGBuffer(depth, undefined);
    this.gtao.output = GTAOPass.OUTPUT.Off;
    for (const rt of [this.gtao.pdRenderTarget, this.gtao.gtaoRenderTarget]) {
      rt.texture.minFilter = THREE.NearestFilter;
      rt.texture.magFilter = THREE.NearestFilter;
    }
    this.gtao.updateGtaoMaterial({ radius: opt.aoRadius, distanceExponent: 1.4, thickness: opt.aoThickness, scale: opt.aoPower, samples: opt.aoSamples, distanceFallOff: 0.6 });
    this.gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: opt.pdRadius, rings: opt.pdRings, samples: opt.pdSamples });

    this.material = new THREE.ShaderMaterial({
      name: 'environment:post.output',
      uniforms: {
        tColor: { value: this.target.texture },
        tAO: { value: this.gtao.gtaoMap },
        uAO: { value: opt.aoIntensity },
        tDepth: { value: depth },
        uNear: { value: camera.near },
        uFar: { value: camera.far },
        uFade: { value: new THREE.Vector2(70, 170) },
        uDebug: { value: 0 },
        uNight: { value: 0 },
        uAOWhite: { value: 0.9 },
        uBlur: { value: 6 },
        uAOGamma: { value: 1.6 },
        uTexel: { value: new THREE.Vector2(1 / w, 1 / h) },
        uAORes: { value: new THREE.Vector2(aw, ah) },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D tColor;
        uniform sampler2D tAO;
        uniform float uAO;
        uniform sampler2D tDepth;
        uniform float uNear;
        uniform float uFar;
        uniform vec2 uFade;
        uniform float uDebug;
        uniform float uNight;
        uniform float uAOWhite;
        uniform float uBlur;
        uniform float uAOGamma;
        uniform vec2 uTexel;
        uniform vec2 uAORes;
        varying vec2 vUv;
        #include <packing>
        void main() {
          vec4 c = texture2D( tColor, vUv );
          // GTAO leaves ~3-8 % residual occlusion (and its noise) on open flat ground; stretch the top end so
          // open ground is exactly 1 and only real contact/crevice occlusion remains
          float viewZ = -perspectiveDepthToViewZ( texture2D( tDepth, vUv ).x, uNear, uFar );
          // joint-bilateral upsample + blur of the half-res AO: every tap reads ONE half-res AO texel (nearest,
          // snapped to its centre) and the full-res depth at that same centre; taps whose depth differs from this
          // pixel are rejected. No bilinear mixing across silhouettes → no light fringe / sliver at object edges.
          float aoSum = 0.0, wSum = 0.0;
          for ( int i = 0; i < 17; i ++ ) {
            float fi = float( i );
            float r = i == 0 ? 0.0 : sqrt( ( fi - 0.5 ) / 16.0 ) * uBlur;
            float a = fi * 2.39996;
            vec2 uvT = vUv + vec2( cos( a ), sin( a ) ) * r * uTexel;
            uvT = ( floor( uvT * uAORes ) + 0.5 ) / uAORes;
            float z = -perspectiveDepthToViewZ( texture2D( tDepth, uvT ).x, uNear, uFar );
            float wd = max( 0.0, 1.0 - abs( z - viewZ ) / ( 0.015 * viewZ + 0.03 ) );
            wd *= wd;
            aoSum += texture2D( tAO, uvT ).r * wd;
            wSum += wd;
          }
          if ( wSum < 1e-3 ) { aoSum = 1.0; wSum = 1.0; }
          float ao = pow( clamp( aoSum / wSum / uAOWhite, 0.0, 1.0 ), uAOGamma );
          // AO only in the near/mid field: far away it would draw hex seams through the fog
          float w = 1.0 - smoothstep( uFade.x, uFade.y, viewZ );
          c.rgb *= mix( 1.0, ao, uAO * w );
          if ( uDebug > 0.5 ) c.rgb = vec3( mix( 1.0, ao, w ) );
          // night grade: moonlight desaturates and shifts toward blue (water/grass stop glowing)
          float lum = dot( c.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
          c.rgb = mix( c.rgb, lum * vec3( 0.62, 0.74, 1.05 ), uNight * 0.6 );
          gl_FragColor = vec4( c.rgb, 1.0 );
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          // 8-bit output dither: kills banding in the wide sky / fog gradients
          gl_FragColor.rgb += ( fract( sin( dot( gl_FragCoord.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ) - 0.5 ) / 255.0;
        }`,
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new FullScreenQuad(this.material);
    this.aoStrength = opt.aoIntensity;
  }

  private resizeIfNeeded(): void {
    const s = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    if (s.x === this.size.x && s.y === this.size.y) return;
    this.size.copy(s);
    this.target.setSize(s.x, s.y);
    this.material.uniforms.uTexel.value.set(1 / s.x, 1 / s.y);
    const aw = Math.max(1, Math.round(s.x * this.opt.aoScale)), ah = Math.max(1, Math.round(s.y * this.opt.aoScale));
    this.gtao.setSize(aw, ah);
    this.material.uniforms.uAORes.value.set(aw, ah);
  }

  set aoWhite(v: number) {
    this.material.uniforms.uAOWhite.value = v;
  }

  set aoGamma(v: number) {
    this.material.uniforms.uAOGamma.value = v;
  }

  set blur(v: number) {
    this.material.uniforms.uBlur.value = v;
  }

  set night(v: number) {
    this.material.uniforms.uNight.value = v;
  }

  set debug(v: boolean) {
    this.material.uniforms.uDebug.value = v ? 1 : 0;
  }

  aoStrength = 0.9;
  set aoIntensity(v: number) {
    this.aoStrength = v;
  }

  render(): void {
    const r = this.renderer;
    this.resizeIfNeeded();
    const prev = r.getRenderTarget();
    r.setRenderTarget(this.target);
    r.render(this.scene, this.camera);
    // GTAO reads camera matrices itself; keep its projection in sync (fov/aspect may change)
    this.gtao.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix);
    if (this.aoEnabled) this.gtao.render(r, this.target, this.target, 0, false);
    this.material.uniforms.uAO.value = this.aoEnabled ? this.aoStrength : 0;
    r.setRenderTarget(null);
    this.material.uniforms.uNear.value = this.camera.near;
    this.material.uniforms.uFar.value = this.camera.far;
    this.quad.render(r);
    r.setRenderTarget(prev);
  }

  dispose(): void {
    this.target.dispose();
    this.gtao.dispose();
    this.material.dispose();
    this.quad.dispose();
  }
}
