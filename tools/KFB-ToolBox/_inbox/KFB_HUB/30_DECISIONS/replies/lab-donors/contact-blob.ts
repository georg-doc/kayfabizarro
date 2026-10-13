// V-203 (Steuerung 13.10., ground contact): the soft clay contact spot of car-hop.ts (its blob: radial canvas gradient, #2a211d, opacity .62,
// polygon offset −4, no depth write, render order 2), as one shared helper for the car, its tyres and the residents. Flat in its own XZ plane.
import * as THREE from 'three';

let TEX: THREE.Texture | null = null;
const tex = () => { if (TEX) return TEX; const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!, r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.55, 'rgba(255,255,255,0.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); TEX = new THREE.CanvasTexture(c); return TEX; };
const GEO = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
export function contactBlob(sx: number, sz = sx, opacity = 0.62) {
  const m = new THREE.Mesh(GEO, new THREE.MeshBasicMaterial({ map: tex(), color: '#2a211d', transparent: true, depthWrite: false, opacity, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
  m.scale.set(sx, 1, sz); m.renderOrder = 2; m.name = 'contact-blob'; m.castShadow = m.receiveShadow = false; m.userData.op0 = opacity; return m;
}
