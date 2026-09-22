# KFB ToolBox · Fluid / Beam / Card / Seed / Voxel consolidation v1

Status: **F1 COMPLETE · SOURCE MATRIX VERIFIED · NO MODULE PROMOTION**  
Owner: KFB ToolBox for module packaging; receiving games keep their existing runtime owners.  
Source intake: `tools/KFB-ToolBox/_inbox/KFB ToolBox Bench v1 - KFB Voxel Card Zone Lab 2 - Hex Assets Worldbuilding/kfb-toolbox-v1/`  
Pinned intake commit: `georg-doc/kayfabizarro@2dbc965fbe8149318a502fde250ecb1acec65f10`

## Why this slice exists

The old Card Zone Lab contains useful systems for KFB fluids, card reveals, sky-card beams, deterministic card-to-world seeds and deliberately voxel-based worlds. The 2026-09-21 export separates these systems into candidate modules. This slice decides what can become canonical ToolBox modules without creating a second terrain, card or world owner.

## Verified input

The local Dropbox export and the GitHub intake contain the same **23 files with matching SHA-256 hashes**.

| Candidate | Intake claim | Consolidation gate |
|---|---|---|
| `kfb-fluid-v1` | tested in the supplied Bench | reproduce the measured wet-cell/quad/water-level invariants in a normal browser host |
| `kfb-beam-v1` | tested in the supplied Bench | prove one real CardRig/Sky-Card target, not the synthetic plane only |
| `kfb-seeds-v1` | tested with a synthetic card pool | prove one real KFB card/deck input and JSON import/export |
| `kfb-cardstack-v1` | **NOT_TESTED as a module** | run the real deck/reveal/Sky-Card sequence before promotion |
| `kfb-voxel-world-v1` | source mirror of `terrain-v10` | locate/pin the canonical terrain owner and adapt to it; do not promote the mirror as a second world runtime |

## Target ToolBox experience

One compact Stage bench under the existing ToolBox router with four focused views:

1. **Fluid** — water, acid and slag; trench/river controls; bubbles; measured waterline and quad count.
2. **Card + Beam** — real KFB CardRig or current card-deck donor; deck reveal, Sky-Card pose and beam.
3. **Seed + Palette** — real card input to stable biome, palette and zone JSON; explicit import/export.
4. **Voxel Zone** — deliberate block-world preview using the existing canonical terrain code, with biome/palette controls. This is not the default Travel/OSM surface.

Progressive disclosure applies: the canvas is primary; advanced measurements and JSON stay behind one compact panel.

## Required source reconciliation

Before moving files out of `_inbox`:

1. locate the current canonical `terrain-v10` / voxel-world source and compare blobs;
2. locate the current Card Zone Lab v2 implementation owner and pin its exact ref;
3. locate the current responsive CardRig/Card Viewer owner for real card geometry and content;
4. compare TinySkies/Travel water, coastline, foam, sparkle, fog and lighting donors with `kfb-fluid-v1`;
5. choose one palette/biome JSON owner compatible with later Track/zone editing;
6. record every accepted module in `TOOLBOX_MANIFEST.json` with source, status and consumer contract.

## Hard boundaries

- Do not copy the complete inbox tree into canonical ToolBox paths by assumption.
- Do not keep both the Lab-inline implementation and a promoted module as independently edited truths.
- Do not promote `kfb-cardstack-v1` until it runs with a real card source.
- Do not let `kfb-voxel-world-v1` replace Travel/TinySkies, OSM or Dungeon terrain owners.
- Do not let ToolBox own consumer camera, movement, combat, loading, audio or persistence.
- Do not replace the current ToolBox Home UI.

## Small Web-chat slices

### F1 · Source census and duplicate map

Read the intake docs and current repo. Produce `SOURCE_MATRIX.json` containing exact canonical candidates, blob/hash comparison, owner and one action per candidate: `PROMOTE`, `ADAPT`, `KEEP_INTAKE`, or `REJECT_DUPLICATE`. No runtime edits.

### F2 · Fluid + TinySkies comparison

Mount the exact `kfb-fluid-v1` candidate in an isolated ordinary browser page beside the current TinySkies/Travel water donor. Compare use cases rather than forcing one shader everywhere: channels/moats/voxel zones versus oceans/coasts/world atmosphere. Preserve both when their jobs differ.

### F3 · CardStack + Sky-Card proof

Use the current real CardRig/Card Viewer source. Prove deck, reveal, Sky-Card pose and `kfb-beam-v1`. No synthetic rectangle, placeholder card or rebuilt KFB branding. Measure pivot, rounded surface, reveal curve and beam corner mapping.

### F4 · Seed / biome / palette contract

Feed actual KFB cards into `kfb-seeds-v1`. Export one small JSON contract containing card identity, story mode, palette, biome/zone signature and deterministic seed. Prove same card + seed gives the same output after reload.

### F5 · Canonical ToolBox bench

Only after F1–F4: promote accepted modules, replace the Lab-inline copies with imports where feasible, publish one direct Cloudflare Stage route, update ToolBox Home and record actual browser evidence.

## Required return

- exact repo/branch/PR/head;
- `SOURCE_MATRIX.json` and duplicate decisions;
- retained owners and protected paths;
- actual static/browser test counts;
- desktop + mobile screenshots;
- direct `kayfabizarro.pages.dev` Stage route;
- `RETURN.md`, `SOURCE.json`, `TEST_REPORT.md`, additive changelog;
- exactly one next gate.

No automatic Live promotion. A source URL loading is not proof that the donor design is actually used.


## 2026-09-22 · F1 completion checkpoint

F1 is complete on `toolbox/fluid-card-voxel-f1-source-census-2026-09-22`.

Read next:
- [SOURCE_MATRIX.json](SOURCE_MATRIX.json) — 28 source/owner decisions;
- [TEST_REPORT.md](TEST_REPORT.md) — 66/66 relevant source assertions PASS;
- [RETURN.md](RETURN.md) — owner boundaries and next gate;
- [SOURCE.json](SOURCE.json) — exact refs/blobs and read-only Dropbox cross-check.

### F1 corrections to the original 2026-09-21 assumptions

- current Card Zone donor truth is the full 1:1 2026-09-22 export, not the extracted Bench modules;
- `kfb-fluid-v1` / v1.1 are rejected as current promotion candidates;
- StoryMap `kfb-fluid-v2/card-zone-v2-fluid-source.js` is the preferred source-locked seam for later F2 comparison;
- current physical card geometry belongs to Storytelling Maps `CARD_RIG_V1.md`; Card Zone owns stack/reveal/beam behavior only for this reconciliation;
- `skills/kfb-box-material.js` and the canonical card builder/ink/format files already exist and their export copies are exact duplicates;
- Voxel Zone S2 is a separate 1:1 visual donor and carries a different shoreline-water treatment from the Card Zone DudV/flow shader.

### Inserted gate before the original F2

**F1.5 · Card Zone source-isolation proof**

Before comparing/adapting extracted modules, publish the unmodified 2026-09-22 Card Zone full source in one isolated ToolBox Stage candidate and prove the source object itself: DudV fluid path, CardStack/reveal, Sky Card/beam and Card Cube/HTML-canvas face source.

After F1.5, continue the original F2–F5 sequence using the corrected owner/source matrix.

## 2026-09-22 · F1.5 source Stage

F1.5 is implemented on Draft PR #172. The isolated Stage is a byte-identical publication of the full 26-file 2026-09-22 source export; no module was extracted and no runtime owner changed.

Technical evidence: **32/32 public Chromium/WebGL PASS** for DudV + water map with source foam off, CardStack/reveal, Sky Card + both beam sources, and six Card Cube CanvasTexture faces plus the existing HTML focus face.

Direct human gate: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/card-zone-lab-v2-source/`

Separate later proposal: [HEX_WORLD_GOD_MODE_ARCHITECTURE_OUTLOOK.md](HEX_WORLD_GOD_MODE_ARCHITECTURE_OUTLOOK.md). It is not F1.5 implementation scope.
