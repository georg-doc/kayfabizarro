# Decision · Landmark colour = KFB seed (2026-09-24)

**Decided by:** Georg, 2026-09-24, after the Kölner Dom v2 colour sheet.
**Status:** canon. This supersedes the grey identity look from `LANDMARK_WORLD_STYLE_V1` (2026-09-19).

## Decision
1. **All landmarks are colourful by the active KFB seed.** "Grey by canon" was wrong.
2. **The identity palette no longer sets the look.** It only anchors each zone's lightness, so the landmark keeps its own light/dark structure (for example dark spires over light buttresses, glowing glass). It is still the fallback for `landmarkColourMode: "identity"`.

## Rule (`landmark-style-profiles.v1.json` → `worldStyleRules`, `kfbSeed`)
- **Per zone:** take the lightness (OKLCH L) from the identity palette, and the hue and chroma from the active `cologne-palette.v1` seed role.
- **Out of gamut:** reduce chroma only. This is the same rule as `cologne-palette.v1.js`.
- **Zone → seed role:**

  | Zone | Seed role |
  |---|---|
  | structure | `roles.structure` |
  | secondary | `roles.shoulder` |
  | upper | `roofs[0]` |
  | accent | `roles.gold` |
  | glazing | `roles.deep` |
  | base | `roles.shoulderLo` |

- **Default seed:** "Gemessen · Tafel 01/02" (`makePalette(0)`), embedded as `kfbSeed.defaultSeedPalette`. Pass another seed through `ctx.seedPalette`.
- **World mood (Travel):** rotates the hue by `moodDelta × worldCoupling`, in OKLCH. Lightness is kept.
- **Accent:** identity hits only (finials, crocket bands, crossing spire, clock/crown details). Never every pinnacle tip.

## Flags changed
| Flag | Before | Now |
|---|---|---|
| `landmarkIdentityPaletteRemainsLocal` | `true` | `false` |
| `preserveLandmarkSaturationAndLightness` | `true` | `false` |
| `landmarkColourMode` (new) | — | `"kfb-seed"` |
| `preserveLandmarkLightness` (new) | — | `true` |

## Code
- **`styles/landmark-world-style.mjs`:**
  - New: `kfbSeedZoneColours(id, profiles, seedPalette)`, `hexToOklch`, `oklchToHex`.
  - `resolveLandmarkColours` uses the KFB seed by default. The call signature is unchanged, so the pilot-06 viewer, the TinySkies stage and the StoryMap animator become colourful without edits.
- **Tests:**
  - `tests/check_landmark_colour_kfb_seed_v1.mjs` is new: 89/89 pass. It checks exact parity of the Dom default with the Blender Dom v2 (`dom2_lib.palette_kfb`).
  - `tests/check_landmark_world_style_v1.mjs`: the old "saturation + lightness preserved" assertions are replaced by "OKLCH lightness preserved": 768/768 pass.
  - The same file also had a pre-existing `viewer.syntax` failure on main: multi-line imports were not stripped. That is fixed here.

## Consumers that still hard-code the grey identity (follow-up for their owners)
- `KFB-Stunt-Car-Race` · `KFB Cologne Race Option C-3/lab-v9/cologne-world.v1.js` `buildDom()`: the materials are `0x7c7770 / 0x9b958b / 0x57534e / 0xd0aa56 / 0x3f6275`. This must switch to the rule above with the world's active seed.
- The same code in the inbox copy `tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-world.v1.js` (history, reference only).
- The Blender landmark `koelner_dom_kfb_v2.glb` (Dropbox `_kfb_modell`) already follows this rule.
