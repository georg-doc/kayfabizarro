# WSA Backlog · Resident Scene Modules / Floating Resident Islands

**Status:** additive backlog after S33.  
This file covers the Resident Scene Module → Platformer seam. It does not replace the full Resident Atlas OPEN list in `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`.

## 2026-09-19 · Georg review fail / R0 repair

- [x] Record C0 human visual rejection separately from the earlier technical/browser PASS.
- [x] Record briefing ambiguity + intent-resolution + execution failure in `POSTMORTEM_C0_BRIEFING_INTENT_EXECUTION_2026-09-19.md`.
- [x] Prepare one next owner-lane brief only: `tools/KFB-ToolBox/_handover/RESIDENT_CLOWN_ACTIVITY_REPAIR_2026-09-19/START_HERE.md`.
- [ ] Run R0 source-isolation proof before any tuning.
- [ ] Repair arm throw/catch readability without changing module ownership.
- [ ] Prove club mesh does not visibly cross head/torso in side + three-quarter review.
- [ ] Keep C0 scale/UI repair and Platformer integration deferred until R0 gets its own visual gate.

## P0 · review / evidence

- [x] Cloudflare CI opened the Resident Atlas S6 route with `?resident=clown`; HTTP 200, Clown deep-link and `juggle-cascade-v1` confirmed on merged handoff commit `ae79765c…`.
- [ ] Visual QA: three club paths read as a cascade rather than grouped throws.
- [ ] Visual QA: catches occur at the hand region without obvious teleport/pop.
- [ ] Visual QA: arm CCD does not visibly twist/elbow-flip.
- [x] Automated current-pass arm-target residual recorded: max `0.0001394517`; rerun after any tuning rather than reusing this value.
- [ ] Replace the current pivot-distance diagnostic with actual club mesh/vertex surface clearance over a full loop. Two green Cloudflare runs observed minima `0.0247257373` and `0.0007849185`; the second is effectively coincident at pivot level. Browser screenshot also shows club geometry entering the head/upper-torso silhouette. Treat trajectory/catch tuning as OPEN, not accepted.
- [ ] Narrow/mobile viewport QA for the direct Clown route.
- [ ] Keep `PUBLIC DEPLOYMENT`, `BROWSER TESTED RESULT` and `GEORG ACCEPTANCE` separate.

## P0 · first Platformer consumer proof

Do this only through the current Free Roam Platformer owner/recovery order.

- [ ] Re-read `skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/PLATFORMER_KIT_MENTAL_MODEL.md`.
- [ ] Re-read `CLAUDE_DESIGN_RECOVERY_REBRIEF.md`; the older Project Island composition is a structural/visual FAIL and must not become the integration base merely because it already boots.
- [ ] Preserve the Platformer's SOLID/VISUAL split and runtime-measured cell.
- [ ] Build one normal **4×4 grass support island** through the consumer's own module grammar.
- [ ] Mount `clown-juggling-island.module.json` at the support top-center.
- [ ] The Resident module may write only its local presentation root and activity; it must not create an invisible floor, collision box, player controller, camera or portal.
- [ ] Confirm no hover/sink: support top and actor/podium contact remain coherent.
- [ ] Confirm Platformer player collision does not treat balloons/props as the support island unless explicitly authored by the Platformer.
- [ ] Run jump/landing/orbit/rescue regression with the Resident module visible.
- [ ] Dispose/reload the module and verify no duplicate mixers / RAF owners / listeners.

## P1 · reusable Resident Activity library

Source candidates are real Rig_Medium clips from the current AnimationInventory donor; each still needs an exact resident + exact prop + exact scene proof.

Candidate activities:

- `Hammer` / `Hammering` → smith / workshop resident with exact hammer + anvil/work surface asset.
- `Chop` / `Chopping` → woodcutter / camp activity with exact axe + target asset.
- `Dig` / `Digging` → farmer / miner / archaeologist with exact shovel/tool + ground target.
- `Pickaxe` / `Pickaxing` → mine/rock activity with exact pickaxe + rock/ore target.
- `Saw` / `Sawing` → carpenter/build scene with exact saw + wood target.
- `Fishing_*` → shoreline/floating-water vignette where the consumer owns water/support.
- `Work_A/B/C` / `Working_A/B/C` → role-specific workshop activity only after prop semantics are verified.

Rules:

- [ ] never choose a clip because its name sounds right; inspect the actual motion with the prop attached;
- [ ] use authored hand slots / identity first;
- [ ] measure prop↔hand, prop↔head and prop↔ground at the actual activity pose;
- [ ] do not invent an anvil, workbench, ore, wood target or tool if an exact GitHub asset has not been selected;
- [ ] Large and Legacy rigs require their own evidence; do not assume the Medium activity layer retargets safely.

## P1 · module schema / library

- [ ] Add modules only after one working consumer proof; avoid premature schema expansion.
- [ ] Define optional activity diagnostics only from measurements actually used by consumers.
- [ ] Add module source pin / resident recipe revision / public review URL to each module.
- [ ] Add deterministic support footprint recommendation where relevant; still consumer-owned.
- [ ] Decide whether a module exports a single resident root or an explicit `resident + scenery + landmark + props` sublayer map.
- [ ] Add a compact module gallery to the existing Atlas/Hub rather than creating another standalone runtime.

## P2 · Clown expansion

- [ ] 4-club variant only after trajectory and club-clearance proof.
- [ ] 5-club variant only after trajectory and arm-speed proof.
- [ ] 6-club variant only after trajectory intersection + clearance + catch timing proof.
- [ ] If expanded, keep integer half-turn orientation closure and phase-function loop closure.
- [ ] Consider alternate activity states only after 3-club v1 is accepted; no generic random emote scheduler.

## P2 · Atlas presentation debt relevant to modules

Inherited from the S6 Atlas Return / Next Slices:

- [ ] full screenshot-based QA pass across all residents: hand↔prop, head clearance, ground clearance, binding;
- [ ] compact/responsive UI; mobile is not generally proven for S6;
- [ ] distinguish hand props versus ground props in layer controls;
- [ ] Farmer_B visibility in compressed ensemble;
- [ ] several resident habitat gaps remain source-selection work, not runtime problems;
- [ ] old S6 OPEN points remain authoritative where not superseded by later entries.

## Publication / evidence backlog

- [ ] Human-facing previews always use `kayfabizarro.pages.dev` / KFB Hub / Stage routes.
- [ ] Remove future review instructions that suggest githack/rawcdn.githack.
- [ ] Historical documents may retain old URLs as historical evidence, but new active handoffs must name the Cloudflare canonical target.
- [ ] Cross-owner cleanup for WSA/Race owner: `.github/workflows/box-stop-pinned-preview.yml` still contains a manual/historical rawcdn.githack test path. Do not use it for new proof; retire or replace it with a Cloudflare-only proof in the owning Race/BOX1 lane rather than changing Race test ownership from this Resident slice.
- [ ] A third-party CDN load success is never a KFB public-deployment PASS.
