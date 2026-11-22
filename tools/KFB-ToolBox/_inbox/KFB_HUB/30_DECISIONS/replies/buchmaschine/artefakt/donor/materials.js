// Stellvertreter für 06-orrery/materials.ts. Das Original baut TSL-Knotenmaterialien, und die laufen nur unter WebGPU.
// Hier stehen schlichte WebGL-Materialien in den Farben und Rauheiten des Spenders. Gate (a) prüft die Mechanik, nicht den Look.
import * as THREE from "three";
export function metal({ color, roughness }) { return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.85 }) }
export const brassMaterial = () => metal({ color: "#d9b470", roughness: 0.42 });
export const darkBrassMaterial = () => metal({ color: "#bb9455", roughness: 0.46 });
export const steelMaterial = () => metal({ color: "#b4b9bd", roughness: 0.4 });
export const barMaterial = () => metal({ color: "#d8b06c", roughness: 0.4 });
export const sunMaterial = () => new THREE.MeshStandardMaterial({ color: "#ffb347", emissive: "#ff8c1a", emissiveIntensity: 1.2 });
export const earthMaterial = () => new THREE.MeshStandardMaterial({ color: "#3d6fb6", roughness: 0.5 });
export const bandedMaterial = (r, colors, b, roughness = 0.42) => new THREE.MeshStandardMaterial({ color: colors[0], roughness });
export const crateredMaterial = (r, light, dark, s, roughness = 0.5, metalness = 0.75) => new THREE.MeshStandardMaterial({ color: light, roughness, metalness: metalness * 0.3 });
