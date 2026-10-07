// Distant drifting clouds from the hexagon pack (cloud_big / cloud_small), high and far outside the load disc.
// Purely visual: unfogged, unlit-ish (bright standard material with emissive lift), no shadows.
// Positions wrap around the focus in a ring so they never run out; layout is seeded (mulberry32), not Math.random.
import * as THREE from 'three';
import type { AssetLibraryApi } from '../../core/types';
import { mulberry32 } from '../../core/rng';

export const CLOUD_IDS = ['hex/decoration/nature/cloud_big', 'hex/decoration/nature/cloud_small'];

interface Cloud { obj: THREE.Object3D; ox: number; oz: number; y: number; base: THREE.Vector3 }

export class Clouds {
  readonly group = new THREE.Group();
  private clouds: Cloud[] = [];
  private material: THREE.ShaderMaterial;
  readonly uniforms = {
    uTop: { value: new THREE.Color(1, 1, 1) },
    uBottom: { value: new THREE.Color(0.78, 0.85, 0.94) },
    uSun: { value: new THREE.Color(1, 0.95, 0.85) },
    uSunDir: { value: new THREE.Vector3(0, 1, 0) },
  };
  private wind = new THREE.Vector2(1, 0.35).normalize();
  /** Ring size: clouds live in a square of this half-size around the focus, wrapped. */
  private half = 900;
  speed = 3.5; // m/s

  constructor(assets: AssetLibraryApi, seed: number, count = 26) {
    this.group.name = 'environment:clouds';
    // Stylised cloud shading (not lit by the scene's hemisphere light, whose olive ground colour would tint the
    // undersides green): top/bottom gradient by world normal + a soft sun term.
    this.material = new THREE.ShaderMaterial({
      name: 'environment:clouds',
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `
        varying vec3 vN;
        void main() {
          vN = normalize( mat3( modelMatrix ) * normal );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop; uniform vec3 uBottom; uniform vec3 uSun; uniform vec3 uSunDir;
        varying vec3 vN;
        void main() {
          vec3 n = normalize( vN );
          vec3 c = mix( uBottom, uTop, smoothstep( -0.6, 0.8, n.y ) );
          c += uSun * max( dot( n, normalize( uSunDir ) ), 0.0 ) * 0.12;
          gl_FragColor = vec4( c, 1.0 );
          #include <colorspace_fragment>
        }`,
      fog: false,
    });
    const rnd = mulberry32(seed ^ 0x51c0d);
    const parts = CLOUD_IDS.map((id) => assets.get(id)?.parts ?? []);
    if (!parts[0].length && !parts[1].length) return;
    for (let i = 0; i < count; i++) {
      const pick = parts[rnd() < 0.55 ? 0 : 1];
      const p = pick.length ? pick : parts[0].length ? parts[0] : parts[1];
      if (!p.length) continue;
      const g = new THREE.Group();
      for (const part of p) {
        const m = new THREE.Mesh(part.geometry, this.material);
        m.applyMatrix4(part.matrix);
        m.castShadow = false;
        m.receiveShadow = false;
        g.add(m);
      }
      const s = 4 + rnd() * 4;
      g.scale.set(s, s * (0.8 + rnd() * 0.3), s);
      g.rotation.y = rnd() * Math.PI * 2;
      let ox = 0, oz = 0;
      // keep them outside ~330 m so they float beyond the fogged load edge
      do {
        ox = (rnd() * 2 - 1) * this.half;
        oz = (rnd() * 2 - 1) * this.half;
      } while (Math.hypot(ox, oz) < 330);
      const y = 120 + rnd() * 110;
      this.clouds.push({ obj: g, ox, oz, y, base: g.scale.clone() });
      this.group.add(g);
    }
  }

  setTint(horizon: THREE.Color, zenith: THREE.Color, sun: THREE.Color, sunDir: THREE.Vector3, day: number): void {
    // tops pick up the sun colour at dawn/dusk; undersides take a sky-blue grey; everything darkens at night
    const u = this.uniforms;
    const k = 0.2 + 0.8 * day;
    u.uTop.value.set(1, 1, 1).lerp(sun, 0.35).multiplyScalar(0.92 * k);
    u.uBottom.value.copy(horizon).lerp(zenith, 0.35).lerp(new THREE.Color(1, 1, 1), 0.25).multiplyScalar(0.82 * k);
    u.uSun.value.copy(sun).multiplyScalar(day);
    u.uSunDir.value.copy(sunDir);
  }

  update(time: number, focus: THREE.Vector3): void {
    const H = this.half, W = 2 * H;
    const dx = this.wind.x * this.speed * time, dz = this.wind.y * this.speed * time;
    for (const c of this.clouds) {
      // wrap offset relative to focus
      let x = c.ox + dx - focus.x, z = c.oz + dz - focus.z;
      x = ((((x + H) % W) + W) % W) - H;
      z = ((((z + H) % W) + W) % W) - H;
      c.obj.position.set(focus.x + x, c.y, focus.z + z);
      // shrink to nothing when wrapping through the inner zone to avoid pops overhead
      const r = Math.hypot(x, z);
      const k = THREE.MathUtils.smoothstep(r, 240, 330) * (1 - THREE.MathUtils.smoothstep(Math.max(Math.abs(x), Math.abs(z)), H - 80, H));
      c.obj.visible = k > 0.01;
      c.obj.scale.copy(c.base).multiplyScalar(Math.max(k, 0.01));
    }
  }
}
