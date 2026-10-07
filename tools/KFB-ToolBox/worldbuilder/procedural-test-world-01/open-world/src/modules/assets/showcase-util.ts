// Small helpers shared by the assets showcases (verification-only visuals; never used in the game build).
import * as THREE from 'three';
import { ChunkBuilder } from '../../core/chunks';
import type { CoreContext } from '../../core/types';

/** Merged static batch (same merging as chunks: one mesh per material). */
export function makeBatch(ctx: CoreContext) {
  const b = new ChunkBuilder({ cx: 0, cz: 0, cells: [] }, ctx.assets);
  return {
    add(id: string, m: THREE.Matrix4): boolean {
      return b.add(id, m);
    },
    finish(): THREE.Group {
      return b.finish();
    },
  };
}

export function trs(x: number, y: number, z: number, rotY = 0, s = 1): THREE.Matrix4 {
  return new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY), new THREE.Vector3(s, s, s));
}

/** Text label as a flat quad lying on the ground (readable from a top-down camera, −Z = screen up). */
export function groundLabel(text: string, x: number, y: number, z: number, width = 12, color = '#ffffff', bg = 'rgba(20,24,32,0.78)'): THREE.Mesh {
  const c = document.createElement('canvas');
  const H = 64;
  const ctx2 = c.getContext('2d')!;
  ctx2.font = 'bold 40px system-ui, sans-serif';
  const w = Math.ceil(ctx2.measureText(text).width) + 24;
  c.width = w;
  c.height = H;
  ctx2.fillStyle = bg;
  ctx2.fillRect(0, 0, w, H);
  ctx2.font = 'bold 40px system-ui, sans-serif';
  ctx2.fillStyle = color;
  ctx2.textBaseline = 'middle';
  ctx2.fillText(text, 12, H / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const h = (width * H) / w;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(width, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true }));
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  return m;
}

/** Instanced marker pillars, one InstancedMesh per colour. */
export function makeMarkers() {
  const geo = new THREE.CylinderGeometry(0.9, 0.9, 1, 12);
  geo.translate(0, 0.5, 0);
  const sets = new Map<string, THREE.Matrix4[]>();
  return {
    add(color: string, x: number, y: number, z: number, h = 2.5, r = 1) {
      let s = sets.get(color);
      if (!s) sets.set(color, (s = []));
      s.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(r, h, r)));
    },
    finish(): THREE.Group {
      const g = new THREE.Group();
      for (const [color, ms] of sets) {
        const mat = new THREE.MeshBasicMaterial({ color, toneMapped: false });
        const im = new THREE.InstancedMesh(geo, mat, ms.length);
        ms.forEach((m, i) => im.setMatrixAt(i, m));
        im.instanceMatrix.needsUpdate = true;
        im.computeBoundingSphere();
        g.add(im);
      }
      return g;
    },
  };
}
