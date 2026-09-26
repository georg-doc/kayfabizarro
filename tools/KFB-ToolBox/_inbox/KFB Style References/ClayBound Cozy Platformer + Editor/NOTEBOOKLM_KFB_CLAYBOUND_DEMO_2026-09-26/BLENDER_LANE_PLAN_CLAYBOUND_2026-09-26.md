# KFB × ClayBound · Blender lane plan (draft) · 2026-09-26

**Author:** Claude Coworker (Blender MCP lane).
**Status:** DRAFT for planning. Nothing is built yet.
**Inputs:** `NOTEBOOKLM_KFB_CLAYBOUND_DEMO_2026-09-26/` (README, source text, prompts A/B, `RESEARCH_ROUND_01_REVIEW.md`), `ClayBound_Research_NotebooLM_01.md`, `KFB ClayBound-Perplexity v1/` (three.js Clay Lab), `KFB KlayBound POC 01.zip`.
**Look authority:** Georg. NotebookLM is design input; Blender proves and calibrates. It does not decide the look.

## 1 · What Blender is for in this strand

The review of Research Round 01 already names the gap: the research is useful, but it is **not an executable recipe**. Some wiring is invalid (a Normal Map node has no Normal input), some features are Cycles-only (Bevel shader, Random Walk SSS), and the numbers are seeds, not facts.

The Blender lane closes that gap with **one calibrated, portable Clay Master** that is proven on a real KFB asset and exports to the web runtime without losing the look.

## 2 · Three material tiers, kept separate from day one

| Tier | Use | Allowed | Not allowed |
|---|---|---|---|
| **T1 · Cycles look-dev** | stills, deck images, bake source | Bevel shader node, Random Walk SSS, full procedural stack | shipping it as the runtime material |
| **T2 · EEVEE approximation** | fast previews, turntables | procedural macro/meso/micro, Bump chain | Random Walk, SSS IOR/anisotropy (not supported) |
| **T3 · Runtime / GLB** | three.js / KFB Stage | Principled only, **baked** BaseColor, ORM (occlusion, roughness, metal) and tangent-space Normal, plus per-asset `seed`/`relief` as glTF extras for the Clay Lab shader | procedural nodes (not exported), Bevel node, SSS |

**Parity rule:** T3 in Blender and the three.js Clay Lab (`onBeforeCompile` layer) must match on the same asset, lights and camera. This is checked with a side-by-side screenshot, not by eye memory.

**Version note:** Georg's Blender is **5.2**; the review cites the 4.5 manual. Every node and socket is verified against 5.2 before use.

## 3 · Sprints

### CLAY-B0 · Clay Master scaffold (technical, look-neutral)

- One node group `KFB_ClayMaster` with inputs for colour, macro/meso/micro amounts, `seed`, `scale_m` and roughness range.
- A **valid normal stack**: a Bump chain (Bump has a Normal input), or a baked combined normal for T3. Normal Map nodes are never stacked.
- A **seamless texture bake**: four 2k tiles (micro normal, meso height, roughness variation, low-frequency mottle) baked from the procedural stack.
- A neutral **material-evaluation rig**: fixed camera and three soft lights, versioned so it can be used for regression renders.

**Checks:**
- **Seamless:** the tiles are seamless (half-offset test, seam delta below a threshold).
- **Scale:** texel density in m/texel is stated.
- **Hygiene:** no baked lighting (flat-lit variance test); the node group loads in 5.2 with no warnings.

**Could Sonnet do it?** Yes, with this checklist; I would review the result.

### CLAY-B1 · Calibration on ONE KFB asset

- **Asset:** Georg picks one (proposal: FrizzleBob `FB_TEMPLATE_LOOK_v5.glb`). Work on a **new copy file only**. No apply-transforms or modifier changes on the production rig.
- **Material slots:** keep the existing slots (eyes, mouth, hair, props). `KFB_ClayMaster` goes **inside** the body/skin materials only, never as one material for everything.
- **Values:** start from the review's calibration seeds (roughness 0.65–0.85 and so on), labelled CALIBRATION START.

**Checks:**
- **Animation safety:** render two poses; a marker decal must stay on the same surface point (no texture swimming).
- **Budget:** tri count and slot count are unchanged unless bevel geometry is explicitly approved.
- **Parity:** T1/T2/T3 renders on the same camera, plus the T3 ↔ three.js parity screenshot.

**Gate:** Georg · look PASS / TUNE / REJECT on the side-by-side.

### CLAY-B2 · World and scenery (KlayfaBizarro environments)

- The same node group on static scenery: SC01 bridge shells, SC02 supports, billboards, and later terrain.
- Static objects may use **object-space/triplanar** mapping (no deformation, so no swimming).
- Per-object `seed` so repeated pillars do not share one pattern phase. This matches the Clay Lab principle.

**Check:** the export size budget per GLB is stated; no visible tiling at gameplay camera distance.

### Explicitly out of scope until Georg asks

- **Rig conversion:** no batch clay conversion of all KFB GLBs.
- **Stop-motion jitter:** no stepped material noise. The baseline is a stable material; the stop-motion feel comes from the acting.
- **Fingerprint overlays:** none, of any kind.

## 4 · Dependencies and order

1. NotebookLM **Production Deck** (running) → gives texture families, zone map and look targets.
2. **CLAY-B0** can start **now in parallel**, because it is look-neutral scaffolding.
3. **CLAY-B1** starts after Georg picks the asset and the deck result is in.
4. **CLAY-B2** starts after B1 PASS.

## 5 · Exactly one next gate

**Georg:** pick the calibration asset for CLAY-B1 (proposal: FrizzleBob v5), and say whether CLAY-B0 may start now.
