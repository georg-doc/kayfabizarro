# Coworker (Blender MCP lane) · next sprints · Claymation × WorldBuilder × OMS × Racer · 2026-09-26

**Author:** Claude Coworker.
**Status:** PLAN, for WSA to split, tune or approve. Nothing here is dispatched. There is no auto-merge and no Stage/Live.

**Reads on top of:**
- PR #229 (WSA claymation recon);
- PR #228 (Clay Master plan and asset pipeline);
- PR #219/#222 (Track Core G0 → W0 …; Blender = oracle);
- PR #226 (SC01/SC02 scenery shells);
- PR #223 (OSM City furniture R0);
- PR #190 (WB2 sculpt).

**Principle:** Blender is the calibration and set-piece atelier. JS owners keep runtime, physics, terrain and route truth. Every sprint returns defects first and exactly one gate.

## 0 · State in one table

| Strand | Proven now | Blocked by |
|---|---|---|
| Claymation | Plan (#228), WSA route (#229), Asset 03 r2 tile-green; itch.io pack converted locally (micro normal / roughness / AO / mottle) | **Asset 01 r1 PNG bytes not in the repo** (hash `fb952516…`); Georg's look on Asset 03 r2; itch.io licence; Georg's model pick |
| WorldBuilder | WB1/WB2 exist; WB-W0 is the World-MVP candidate | ToolBox clay look PASS before any WB patch (WSA order) |
| OMS (OSM → elastic-grotesque presentation) | OSM City Lab (dom-zentrum-v0, furniture R0 #223), Option C Cologne Stage | Landmark overrides are still generic; no Blender hero landmark yet |
| Racer | SC01 bridge shells, SC02b supports (default classic), fixture checks | **W0 frame stream** (Track Core JS). Everything placed before W0 must be re-placed later |

## 1 · Sprints (Coworker lane, in order)

### C1 · CLAY-SRC · source gate (small, unblocks everything clay)

- **Do:**
  - Find the Asset 01 r1 PNG in Georg's Dropbox (Clay Asset Studio output).
  - Verify SHA-256 `fb952516…`.
  - Commit it with its 3×3 proof to the #228 asset folder.
  - If it is missing, return `SOURCE_REQUIRED`; do not reconstruct it.
- **Also:** record the itch.io pack licence once Georg names the source page. If the licence allows it, upload clay1/2/4 to `media/3D_Assets/Textures/clay_itch_v0/` as candidates for the **Asset 02 fine-grain / micro layer**. clay3 (shiny) and clay5 (hairline cracks) stay out.
- **Gate:** hash match (PASS / FAIL).

### C2 · CLAY-B0 · Clay Master scaffold (look-neutral, Sonnet-able with the #228 checklist)

- **Build:** node group `KFB_ClayMaster` with three tiers: T1 Cycles, T2 EEVEE, T3 baked GLB.
- **Valid normal stack:** a Bump chain, never stacked Normal Map nodes.
- **Test objects:**
  - a neutral evaluation rig (sphere);
  - **one static KFB object, proposed: an SC02 classic support.** It has no rig, so triplanar mapping is allowed and there is no swimming risk. It also links the clay work directly to the racer.
- **Gate:** Georg looks at the T1 / T2 / T3 side-by-side (PASS / TUNE).

### C3 · CLAY-B1 · calibration on one character asset

- **Asset:** Georg picks it (proposal: FrizzleBob v5). Work on a copy only.
- **Rules:** the material goes into the skin zones only; slots, rig and scale are unchanged.
- **Proof:** a two-pose marker decal swim test, plus a GLB with `kfb.clay-material/0.1` extras.
- **Gate:** Georg look PASS. This PASS is the WSA precondition for ToolBox T1 (Web).

### R1 · TRACK-CORE-1A · Blender oracle (starts when the W0 contract exists)

- **Build:**
  - a real Clothoid proof;
  - one frame stream;
  - the canonical slot profile;
  - the parameter-only STREET → TRACK transition;
  - the RKIT-11 acceptance fixture.
- **Output:** numbers the JS core must match. This is parity evidence, not geometry to ship.
- **Gate:** WSA parity table.

### R2 · B1 · re-place SC01/SC02 on the W0 frame stream

- **Swap:** the stand-in `scenery_route.py` is replaced by the W0 frames, and `ground(x, z)` by the single Surface-Adapter query (WSA D3).
- **Defaults:** classic by default; organic styles opt-in.
- **Open decision:** a spanning piece for long spans over crossing roads, or keep them flagged.
- **Gate:** checks PASS on the real stream, plus Georg's look.

### O1 · OMS-LM1 · one hero landmark override (Kölner Dom, elastic-grotesque)

- **Input:** the OSM footprint and height from `tools/osm-city-lab/data/dom-zentrum-v0`. OSM stays the geographic truth.
- **Build:**
  - Blender authors the cartoon override: "weird-bend" skew, lean and taper.
  - The KFB seed palette is **colourful, never grey** (#208 decision).
  - Apply the **same** Clay Master after C2, so the world reads as one sculpted piece (KlayfaBizarro). No separate grotesque material.
- **Output:** a GLB plus a socket JSON (footprint anchor, clearance), for the City Lab and Option C to consume.
- **Gate:** Georg's A/B against the current web version (is Blender better or not?).

### W1 · CLAY-B2 · static scenery for the WorldBuilder (after C3 PASS + ToolBox T1 PASS)

- **Scope:** one bounded prop set in clay, with triplanar mapping and a size budget: an SC02 classic support, an SC01 pylon, and one billboard body.
- **Delivery:** as GLBs for the WSA W1 "one static patch" slice. Not a world-wide reskin.
- **Gate:** WorldBuilder owner integration (Web), then Georg's look.

## 2 · Parallel lanes that are NOT Coworker

| Owner | Lane | When |
|---|---|---|
| Web Chat | TRACK-CORE-0/W0 census + contract → 1B runtime parity | now (G0 approved) |
| Web Chat | Clay T1 ToolBox → W1 WorldBuilder patch → R1 Race roadside (#229 brief) | after C3 PASS, strictly in order |
| Web Chat | OSM City furniture R0 CI gate (#223); later TrafficPlan hooks for the driving school | now |
| Claude Design | Clay A/B visual calibration (#229); TRACK-CORE-2 visual grammar | after C2 / after 1B |
| Georg | Asset 03 r2 look; B1 model pick; itch.io licence link | open now |

## 3 · Backlog (noted, not scheduled)

- **Support variants:** a spiral-bulge pylon; Roman/Greek columns; pedestals/plinths (`LATER_SUPPORT_VARIANTS_SPIRAL_AND_CLASSICAL.md`).
- **Short organic supports:** a new short form below ~4 m.
- **Spring pillar launch:** after W0/B4/W1.
- **Tokyo-Drift parking deck for Elisa, plus the satirical driving school at the Otto-Maigler-See.** This fits the #223 TrafficPlan hooks (signals, stop signs as authored scenarios).
- **Stop-motion stepping:** as an optional look layer only (principle from the UE sample; the UE files themselves are not usable).

## 4 · Coworker commentary (risks)

1. **Clay has a hard source gap.** Without the Asset 01 r1 bytes, C2 can only use procedural or itch.io micro detail. C1 is the cheapest unblock.
2. **Racer scenery before W0 creates re-placement debt.** No new SC families until R2, except pure look work on the existing ladder.
3. **OMS and clay must not fork the material.** One Clay Master for characters, supports, bridges and landmarks. The grotesque look comes from form (bend, lean, taper), not from a second shader.
4. **Order vs. WSA:** WSA wants ToolBox first. The proposal is compatible: C2 uses a *static* support only as a no-risk calibration object, and the ToolBox character comes in C3.

**Exactly one next gate:** C1 · Asset 01 r1 hash check (and the itch.io licence link from Georg).
