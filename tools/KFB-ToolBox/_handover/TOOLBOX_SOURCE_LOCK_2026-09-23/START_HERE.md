# ToolBox Source Lock · Recovery after Claude Round 1 · 2026-09-23

Status: **CURRENT CORRECTION · CLAUDE ROUND 1 = REJECTED FOUNDATION · NO FURTHER REPAIR ON THAT FILE**

Owner remains:
`georg-doc/kayfabizarro/tools/KFB-ToolBox/`

## What went wrong

The first Stage-First Claude round reused the desired UI shape, but loaded the wrong character truth.

Visible failure from Georg's review:
- old Cube Bunny presented as `FrizzleBob (bunny)`;
- current FrizzleBob Driver Graft was not used;
- saved Cube-Pet tuning/configuration was not preserved;
- the actor list did not represent the current FrankenStein/FrankenSteining Studio population.

Do not repair this candidate in place. Preserve/export it only as failed evidence.

## Proven source split

### A · Legacy Cube-Pets

These are valid actors, but they are not the current FrizzleBob Driver Graft.

Current Stage-First bundle contains:
`stage-first/src/petstudio-v9/studio-v3/kfb-pets.json`
- schema: `kfb.pets/1`
- version: **1.2.7**
- size: **36,419 B**

Current GitHub canonical:
`media/3D_Assets/kfb-pets.json`
- version: **1.2.8**

Later user-saved Dropbox state:
`/Mac/Downloads/kfb-pets (7).json`
- version: **1.2.9**
- updated: **2026-09-12**
- size: **48,511 B**

The later saved state contains data not present in the Stage-First 1.2.7 copy. Example: Bunny has measured body/pad/ground data in 1.2.9 that is absent in 1.2.7. Penguin also differs in eye/mouth/body tuning.

Therefore the Stage-First bundled pet file is not sufficient evidence for the user's saved Cube-Pet state.

### B · Current FrizzleBob

Current KFB ToolBox truth is **FrizzleBob · Driver Graft**, not the raw Cube Bunny.

Use:
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`
- `mountGraft()`

Existing ToolBox documentation already states:
**no raw Driver and no old Cube-Pet donor as FrizzleBob substitute.**

### C · Studio source / roster

Functional Studio sources remain source material, not prose to recreate:
- current Dropbox v18:
  `/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/stage-first/src/KFB FrankenStein Studio v18.dc.html`
- accepted Studio v17 information architecture / full-roster rule:
  `tools/KFB-ToolBox/_handover/UI_CRITIQUE_REWORK_WS0_2026-09-15/RUN_NEXT_CORRECTED_2026-09-15.md`

Do not hardcode a new actor list from a mockup.

## Next gate · SOURCE REVIEW ONLY

Before another ToolBox integration round, produce one cheap review artifact that shows sources **in isolation**:

1. current FrizzleBob Driver Graft alone;
2. Cube Bunny from the later saved `kfb.pets/1.2.9` state alone;
3. several other Cube-Pets from that same saved state;
4. the actual current Studio actor roster / categories.

No new ToolBox UI work in this gate.
No re-styling.
No Cloudflare.
No Work.

Georg first confirms:
- this is the right FrizzleBob;
- saved Cube-Pets look like their saved versions;
- the actor population is the right one.

Only after that source gate passes may the Stage-First shell be connected to those sources.

## One next gate

**TB-SOURCE-LOCK-01 · isolated source review before any further consolidation.**
