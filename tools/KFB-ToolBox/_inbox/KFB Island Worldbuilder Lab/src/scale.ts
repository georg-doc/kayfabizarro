// KFB scale contract: shared by spec, editor and residents (no three.js imports here).
/**
 * KFB scale contract K2 (docs/SCALE_CONTRACT_K2.md): no metres. Chain: asset → kit factor → KayKit unit (k) → × FIG_SCALE → lab unit.
 * Measures: H = Medium figure height ≈ 3.64 lab (2.27 k); MacroCell MC = 4 k = 6.4 lab = Dungeon module = one storey.
 * KayKit characters, Dungeon, Mummy props and Tiny Treats share k (kit factor 1). Never give single models their own factor.
 */
export const FIG_SCALE = 1.6;
/** MacroCell edge in lab units (4 KayKit units). */
export const MACRO = 4 * FIG_SCALE;
