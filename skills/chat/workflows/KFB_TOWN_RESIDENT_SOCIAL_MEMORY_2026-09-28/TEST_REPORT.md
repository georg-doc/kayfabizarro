# TEST REPORT · KFB Town Resident Social Memory + POI/AIDA · 2026-09-28

Status: **DOCUMENTATION / DONOR-SYNTHESIS TESTED · NO RUNTIME TEST CLAIM**

Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## Actual checks

### Source reads

**15 / 15 PASS**

Verified directly from current GitHub state:
1. `georg-doc/ai-town` main ref;
2. AI Town `ARCHITECTURE.md`;
3. AI Town `convex/agent/memory.ts`;
4. AI Town `convex/agent/schema.ts`;
5. AI Town `convex/aiTown/agent.ts`;
6. AI Town `convex/aiTown/agentOperations.ts`;
7. KFB Town `LIVING_KFB_TOWN.md`;
8. KFB ChatterBox/Tourbus reuse reference;
9. KFB Fluff-o-lect meta-narration source;
10. KFB Brick Fish Draft PR #254;
11. KFB Reaction Choreography Draft PR #256;
12. Resident Scene Modules activity backlog;
13. Overworld Living Concept resource/routine direction.
14. Resident Atlas `tools/resident_atlas_s6/data/cast.js` for exact Toy Soldier actor/props/reveal state.
15. Motion Registry `registry/resources/v1/motions.jsonl` for Rig_Medium `Walking_A`, `Walking_B` and `Running_HoldingRifle`.

The first design checkpoint initially carried one truncated/incorrect Fluff-o-lect blob SHA due to connector output truncation. It was caught by read-back and corrected before the source/evidence closure. Current exact pin:
`9ca3ed0a9987fbb11d0721f5689d6040943403d5`.

### Machine-readable source manifest

**1 / 1 PASS**

`SOURCE.json` parses as JSON and contains exactly **15** pinned source entries.

### Machine-readable AIDA / POI contract

**1 / 1 PASS**

`resident-aida-poi.v0.1.json` parses as JSON and exposes:
- schema `kfb.resident-aida-poi/0.1-proposal`;
- **7** KFB AIDA states;
- **12** POI kinds;
- four perception/search tiers;
- source-backed plus additive routine roles;
- stable motivations/current goals;
- memory write / do-not-write rules;
- explicit return/resume policy;
- first gate `RESIDENT-SOCIAL-MEMORY-01`.

### Design invariant checks

**20 / 20 PASS**

Checked against the committed design reference, source manifest and AIDA contract:

1. source manifest contains 15 donors;
2. AIDA contract parses;
3. exact AI Town donor HEAD present;
4. ChatterBox + Triplet lineage present;
5. Fluff-o-lect present;
6. `witnessed / told / inferred` knowledge provenance present;
7. bounded `ResidentSocialThread` contract present;
8. Reaction Choreography seam present;
9. Brick Fish social-interaction seam present;
10. POI query/view layer present;
11. POIs explicitly include player, Resident, Cube Pet, plant and resource;
12. perception is bounded; no whole-world scan per frame;
13. source-backed routines include hammering, fishing and resource work;
14. Georg's additive routines include patrol, explore and return-home/post;
15. personal goals/motivations are the conflict motor;
16. KFB AIDA has seven states from Attention through Return/Resume/Retarget;
17. the loop is explicitly shared by player and NPC behaviour;
18. routine resume is mandatory; no generic Idle reset after every beat;
19. AI Town remains donor-only / no second runtime;
20. Stage remains explicitly `NOT_DEPLOYED`.

## Officer Doppel-Denk profile evidence

**6 / 6 PASS**

Source/read-back checks for the first resident-specific profile overlay:

1. technical resident source remains `toy-soldier` / `Rig_Medium`;
2. exact `ToySoldier_Rifle.gltf` source is attached to `handslot.r` in the Atlas baseline;
3. `Present_Base.gltf` and `Present_UnwrappedBase.gltf` are both source-proven and the Atlas contains an anticipation → pop → overshoot → settle reveal;
4. Atlas documentation explicitly records that `Idle_B` does not supply the desired shoulder-rifle stance;
5. Motion Registry exposes `Walking_A`, `Walking_B` and `Running_HoldingRifle` for Rig_Medium;
6. the committed Officer profile keeps `Running_HoldingRifle` as an audition candidate only and requires visual attachment/shoulder/clearance proof before acceptance or Mixamo intake.

No patrol, POI reaction, ChatterBox, Lean Memory or world persistence runtime is claimed by these checks.

## Runtime / browser / Stage

- runtime code changed: **0 files**
- runtime tests: **0**
- browser tests: **0**
- screenshots: **0**
- Cloudflare Stage deployment: **0**
- Live promotion: **0**

These are intentionally not claimed because this slice is design persistence and donor synthesis only.

## Workflow shortcut

`KFB WEB PUSH/READ — <project or slice> — recover + continue`

is now documented in the branch version of `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md` and in this slice Recovery. It is a natural-language KFB project shortcut, not a product slash command.

## Result

**PASS for documentation/source synthesis + POI/AIDA contract + Officer Doppel-Denk source-backed profile.**

This is not an implementation PASS for autonomous Residents, Lean Memory, POI perception, routines, motivations, ChatterBox, Fluff-o-lect, Brick Fish or Reaction Choreography.

## Next gate

After current relevant ToolBox/WorldBuilder recovery blockers clear, implement **RESIDENT-SOCIAL-MEMORY-01** in the real receiving world:
- two source-proven Residents;
- one source-backed routine activity;
- bounded visible/local POI candidates;
- one motivation-backed Attention → Interest → Expectation choice;
- one interaction + Reaction Choreography;
- optional ChatterBox/Triplet speech;
- one context-valid Fluff-o-lect variant;
- witness-specific memory only if the outcome matters;
- one bounded social thread;
- clean return to routine/path/dialogue or retarget to a changed goal.
