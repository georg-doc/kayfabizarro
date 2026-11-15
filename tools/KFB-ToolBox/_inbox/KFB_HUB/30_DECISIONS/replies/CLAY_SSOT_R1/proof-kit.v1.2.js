/* KFB Clay SSOT R1 · proof kit for v1.2 "Lichtkante" (NOT part of the SSOT API). Same stage as proof-kit.v1.js (re-exported unchanged),
 * plus the clay variant 'v12' = kfb-clay.v1.2.js; 'v11' and 'v1' as before. Older kits and clay files stay untouched. */
import * as K11 from './proof-kit.v1.1.js';
import { applyClay as applyClay12, CLAY_PROFILES as P12 } from './kfb-clay.v1.2.js';
export * from './proof-kit.v1.1.js';
export const CLAY_PROFILES_V12 = P12;
export async function clayVariant(variant, root, opts = {}) {
  if (variant === 'v12') {
    const { profile = 'character', seed, scaleRef, palette, pull } = opts;
    const h = applyClay12(root, K11.THREE, { profile, seed, scaleRef, palette, pull });
    return { setRelief: h.setRelief, info: { variant, ...h.info() }, handle: h };
  }
  return K11.clayVariant(variant, root, opts);
}
