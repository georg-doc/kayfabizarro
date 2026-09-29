# PLAYCANVAS × T4 RECEIVER LOCK · PC-T4-01

**Date:** 2026-09-29  
**Status:** CURRENT SOURCE LOCK · DESIGN RECOVERY · NO RUNTIME CHANGE · NO STAGE  
**Owner:** `georg-doc/kayfabizarro` · `game-container/turbo-kfb/design/`  
**Branch:** `chatgpt-web/kfb-handmade-joyride-style-01-2026-09-29`  
**Planned Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-t4-pc01/` · **NOT DEPLOYED**

## Goal

Recover the current Joyride/Open-World exploration from the failed freeform Design pass without inventing another track, physics stack or world owner.

The next candidate is a **receiver proof**, not a full Open World:

`unchanged PlayCanvas vehicle donor → isolated real T4-derived road segment → one tiny island / platform connection`

Georg explicitly allows the minimum viable world to be as small as a Platformer / island network. A city is not required for this gate.

## Source A · PlayCanvas driving donor · LOCKED

User-owned fork:
- PlayCanvas project: `KFB Joyride 01`
- project id: `1609943`
- forked from official Vehicle Physics project `643289`
- Dropbox export: `/CLAUDE/KFB Joyride 01_2026_9_29-15_8_46/`

The export was inspected directly. It contains the original donor, not a KFB world conversion.

Exact reusable source:
- `vehicle.mjs` — Ammo `btRaycastVehicle`
- `vehicle-graphics.mjs`
- `follow-camera.mjs`
- `action-physics-reset.mjs`
- `events-keyboard.mjs`
- Ammo JS/WASM
- original Buggy graphics
- original Desert terrain/template

Initial vehicle parameters must remain untouched for donor-parity proof:
- `maxEngineForce = 2000`
- `maxBrakingForce = 100`
- `maxSteering = 0.3`
- wheel radius `0.4`
- suspension stiffness `10`
- suspension damping `2.3`
- suspension compression `4.4`
- suspension rest length `0.2`
- roll influence `0.2`
- friction slip `1000`
- gravity `[0,-9.8,0]`

The donor already has WASD / arrow control, four-wheel raycast suspension, follow camera and R-key rigidbody reset.

**Do not retune this before donor parity is demonstrated.**

## Source B · T4 road / track donor · LOCKED

Current T4 session cut exists separately from the PlayCanvas export:
- `/CLAUDE/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1.zip`

Current World-Core donor carries the exact stream and transition data:
- `/CLAUDE/KFB World Core R0A · Clay World Donor/WORLD_CORE_MOBILITY_R0A_2026-09-29/lab-track/data/td03.stream.json`
  - inspected size: **3,784,081 bytes**
- `transition-atlas.v1.js`
- `road-markings.m1.js`
- `road-markings.m2.js`
- `road-markings.m2.json`

### Important source discrepancy

R0A `DONORS.md` says `lab-track/track-look.v5.js` is part of that package. It is **not actually present** in the inspected R0A `lab-track/` folder.

The located copy is:
`/CLAUDE/KFB Knet-Strecke T3 v3/KFB_KNET_STRASSE_S1_FAIL_2026-09-28/src/lab-track/track-look.v5.js`

That file is usable only as **technical donor evidence** for:
- reading `td03.stream.json`;
- mapping stream frames `p / T / U / R / slots`;
- bending geometry in `(s,u)` / stream space;
- building the T4 strand and road surface from the stream.

Its T3-v3 city-road / marking look is **not accepted visual truth**. The accompanying postmortem records the S1 street variants and T3-v3 marking principle as failed, with floating markings, wrong kerb/street mental model and recurring shadow/clipping defects.

Therefore:
- **TD03 geometry/data identity = retain**
- **stream-frame construction technique = retain**
- **failed S1/T3-v3 street dressing = do not promote**

## Design failure recovered

The current freeform Design attempt is **USER REJECTED as an integration candidate** because the real T4 track was not carried into the result.

The later `WORLD_CORE_R1_ISLANDS_CONCEPT.md` records the same root error explicitly:
- R0C used an **own sweep / stand-in tube** instead of Track Core;
- roads ended at island edges;
- the next concept says the connection must be a TD03-format stream rendered by the existing T4 strand.

R1 is useful **concept input only**. It is not a built or accepted world.

## Hard receiver rules

1. **No replacement track.**  
   No invented spline tube, generic road, handmade substitute or visually similar approximation may stand in for T4.

2. **Show donors in isolation first.**  
   Before integration:
   - launch the untouched PlayCanvas vehicle donor;
   - render one source-derived T4 / TD03 segment alone.

3. **A loaded URL is not donor proof.**  
   The T4 road must visibly follow the real TD03 stream geometry / frames.

4. **One physics writer.**  
   PC-T4-01 consumes the PlayCanvas donor physics for this probe. It does not modify Turbo/Kart, Race v0.8 or Free-Roam physics.

5. **One tiny world is enough.**  
   The first integrated composition may be:
   - 2–4 simple handmade islands / platforms;
   - one real T4-derived connecting road or stunt segment;
   - one jump / gap / loop invitation;
   - reset/recovery.
   No city, Residents, Cards, Lean Memory or Walk↔Drive is required yet.

6. **No Design-side locomotion or physics.**  
   World dressing is declarative input only. Runtime motion remains with its receiver.

## Smallest valid proof · PC-T4-01

### Step A · PlayCanvas donor parity
Run the fork with its original Buggy / Desert source and verify:
- drive;
- steering;
- reverse;
- suspension;
- camera;
- reset.

No KFB tuning.

### Step B · T4 isolation
Render one bounded segment generated from the actual `td03.stream.json`.

Evidence must make the source relationship visible:
- chosen `s` range;
- source sample/frame count;
- road width / slot values from the source;
- screenshot of the isolated segment.

### Step C · one integration
Replace only enough Desert geometry to make one small traversal:
- start platform / island;
- the real T4 segment;
- landing / destination platform or island.

The original PlayCanvas vehicle physics remains unchanged for this first integrated proof.

## PASS criteria

PC-T4-01 passes only if:
1. the unchanged PlayCanvas donor still drives as the source demo;
2. the shown road segment is demonstrably generated from the real TD03/T4 source;
3. no custom replacement road is used;
4. the vehicle can traverse or meaningfully attempt the single source-derived segment;
5. source and receiver remain separable/reversible.

No clay styling, NPC interaction, Cards, Open-World scale or performance polish is needed for this gate.

## Deferred

- KFB vehicle graphics swap;
- K2 / clay / handmade material pass;
- four-island R1 world;
- BoardGameBits / Storytelling Map world;
- Resident / Signature Deck / Lean Memory;
- Walk↔Drive;
- Race mode;
- audio / music;
- Cloudflare Stage.

## Exactly one next gate

**PC-T4-01 · DONOR PARITY + ONE REAL T4 SEGMENT.**

Do not ask Georg to review another invented world composition before this source-lock gate is proven.
