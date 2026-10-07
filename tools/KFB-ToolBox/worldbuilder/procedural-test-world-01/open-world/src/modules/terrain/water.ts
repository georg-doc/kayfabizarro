// KayKit-style lake water: flat, clean blue with a lighter shallow band along the shore (per-vertex colour from the
// distance to the waterline) and a very calm specular shimmer. One shared material; geometry is built per chunk.
import * as THREE from 'three';
import { HEX_SIZE } from '../../core/units';
import { hexLattice } from './shore';

export const WATER_SHALLOW = new THREE.Color('#78cdf0');
export const WATER_MID = new THREE.Color('#44a3e6');
export const WATER_DEEP = new THREE.Color('#3990dc');
export const LAKE_BED = new THREE.Color('#2b5d8a');

export interface WaterMaterial {
  material: THREE.MeshStandardMaterial;
  uniforms: { uTime: { value: number } };
}

const _c = new THREE.Color();

/** Water colour for distance s (m) from the waterline. */
export function waterColour(s: number, out = _c): THREE.Color {
  if (s < 5) return out.copy(WATER_SHALLOW).lerp(WATER_MID, smooth(0.6, 5, s));
  return out.copy(WATER_MID).lerp(WATER_DEEP, smooth(5, 22, s));
}
function smooth(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function makeWaterMaterial(): WaterMaterial {
  const uniforms = { uTime: { value: 0 } };
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0, name: 'terrain-water', side: THREE.DoubleSide });
  material.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uniforms.uTime;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nuniform float uTime;')
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        {
          // calm, long ripples: only a faint moving glint, no colour blotches
          vec3 wn = normalize((vec4(normal, 0.0) * viewMatrix).xyz);
          float up = smoothstep(0.8, 0.95, wn.y);
          vec2 p = vWPos.xz;
          float t = uTime;
          float dx = 0.5 * cos(p.x * 0.21 + t * 0.8) + 0.3 * cos((p.x + p.y) * 0.15 + t * 0.55);
          float dz = 0.5 * cos(p.y * 0.18 - t * 0.65) + 0.3 * cos((p.x - p.y) * 0.13 - t * 0.5);
          vec3 pert = (viewMatrix * vec4(-dx * 0.025, 0.0, -dz * 0.025, 0.0)).xyz;
          normal = normalize(normal + pert * up);
        }`,
      );
  };
  material.customProgramCacheKey = () => 'terrain-water-v3';
  return { material, uniforms };
}

/** Accumulates water surfaces and lake beds of one chunk into one geometry. */
export class WaterMeshBuilder {
  private pos: number[] = [];
  private col: number[] = [];
  private nor: number[] = [];

  get empty(): boolean {
    return this.pos.length === 0;
  }

  /** Water hexagon at (x,y,z), subdivided; colour from s(worldX, worldZ) = distance to the waterline. Enlarged 0.3 %. */
  hexSurface(x: number, y: number, z: number, N: number, s: (wx: number, wz: number) => number): void {
    const k = 1.003;
    hexLattice(N, (ax, az, bx, bz, cx, cz) => {
      for (const [px, pz] of [[ax, az], [bx, bz], [cx, cz]]) {
        const wx = x + px * k, wz = z + pz * k;
        const c = waterColour(s(wx, wz));
        this.vert(wx, y, wz, c, 0, 1, 0);
      }
    });
  }

  /** Lake bed hexagon (seen only from below the surface). */
  hexFloor(x: number, y: number, z: number): void {
    const R = HEX_SIZE * 1.01;
    for (let i = 0; i < 6; i++) {
      const a0 = ((30 + 60 * i) * Math.PI) / 180, a1 = ((30 + 60 * (i + 1)) * Math.PI) / 180;
      this.vert(x, y, z, LAKE_BED, 0, 1, 0);
      this.vert(x + R * Math.cos(a0), y, z - R * Math.sin(a0), LAKE_BED, 0, 1, 0);
      this.vert(x + R * Math.cos(a1), y, z - R * Math.sin(a1), LAKE_BED, 0, 1, 0);
    }
  }

  private vert(x: number, y: number, z: number, c: THREE.Color, nx: number, ny: number, nz: number): void {
    this.pos.push(x, y, z);
    this.col.push(c.r, c.g, c.b);
    this.nor.push(nx, ny, nz);
  }

  build(material: THREE.Material): THREE.Mesh | null {
    if (this.empty) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, material);
    m.name = 'terrain-water';
    m.receiveShadow = true;
    m.castShadow = false;
    m.matrixAutoUpdate = false;
    return m;
  }
}
