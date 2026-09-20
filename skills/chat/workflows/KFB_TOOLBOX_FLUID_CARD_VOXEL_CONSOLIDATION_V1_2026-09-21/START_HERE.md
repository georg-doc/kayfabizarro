# KFB ToolBox · Fluid / Beam / Card / Seed / Voxel consolidation v1

Status: **READY BRIEF · SOURCE INTAKE VERIFIED · NO MODULE PROMOTION YET**  
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
