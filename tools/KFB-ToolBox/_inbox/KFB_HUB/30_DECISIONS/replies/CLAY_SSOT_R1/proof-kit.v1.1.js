/* KFB Clay SSOT R1 · proof kit for v1.1 (NOT part of the SSOT API). Same stage as proof-kit.v1.js (re-exported unchanged),
 * plus the clay variant 'v11' = kfb-clay.v1.1.js. proof-kit.v1.js and kfb-clay.v1.js stay untouched. */
import * as K1 from './proof-kit.v1.js';
import { applyClay as applyClay11, CLAY_PROFILES as P11 } from './kfb-clay.v1.1.js';
export * from './proof-kit.v1.js';
export const CLAY_PROFILES_V11 = P11;
export async function clayVariant(variant, root, opts = {}) {
  if (variant === 'v11') {
    const { profile = 'character', seed, scaleRef, palette, pull } = opts;
    const h = applyClay11(root, K1.THREE, { profile, seed, scaleRef, palette, pull });
    return { setRelief: h.setRelief, info: { variant, ...h.info() }, handle: h };
  }
  return K1.clayVariant(variant, root, opts);
}
