// ============================================================================
// globe-field.js — isLand, kleine Ergänzung zum 1:1-Port
// ----------------------------------------------------------------------------
// Im Original steht `isLand` am Ende von SimplexNoise.ts. Hier liegt es getrennt, damit
// simplex-noise.js reiner Port bleibt und carpet.js nur importiert, was es braucht.
// ============================================================================
import { sampleTerrainValue, terrainIsLand } from './simplex-noise.js';

export function isLand(seed, terrainType, nx, ny, nz) {
  return terrainIsLand(terrainType, sampleTerrainValue(seed, terrainType, nx, ny, nz));
}
