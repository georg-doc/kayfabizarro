# KFB Lead Work · consolidation / architecture check-in · 2026-09-22

Status: **SUPERSEDED FOR ROUTINE CONTROL-PLANE USE · HISTORICAL HANDOFF / WORK ESCALATION REFERENCE**  
Owner: existing KFB Lead / WSA integration lead  
No new universal runtime owner.

This briefing originally routed routine cross-project coordination into Work/WSA. That default is superseded by `../KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`.

Routine lead/status/check-in work now belongs in Web/GitHub. Use Work only through an explicit Work Escalation Card when Web + Claude Design + local preview cannot finish the required action.

The recent ToolBox conversation accumulated useful architecture work, but ToolBox must not remain the accidental cross-project Work owner.

## ChatGPT 3D attachment texture rule

WSA/Work must not classify a grey/untextured model in a ChatGPT-attached HTML as an asset failure by itself. WB1 proved a valid GLB with an embedded PNG can render without that texture in the attachment host.

Use the shared human-verified review adapter first:
`fetch → Blob → createImageBitmap → THREE.Texture`, then `THREE.TextureLoader` fallback, exact donor texture pin, sRGB, glTF `flipY = false`.

This is review-host presentation only. Do not rewrite the source GLB/GLTF, Registry, Resident Atlas or consumer runtime unless a separate runtime gate proves an asset/runtime defect.

## Role split

### Fresh Web/GitHub chats

Use for:

- source census;
- license/reuse matrices;
- isolated donor extraction;
- small technical proofs;
- bounded calibration;
- one small Stage/module at a time.

They must return small GitHub packets and stop.

### Claude Design

Use for:

- visual authoring;
- interactive 3D composition;
- shape/material/environment language;
- long-lived editable authoring sessions;
- complete Session Cuts.

Claude Design is not GitHub/deployment owner.

### KFB Lead Work

Use for:

- cross-repo check-ins;
- source/status reconciliation;
- architecture decisions;
- integration locks;
- consolidation of accepted donor results;
- selection/sequencing of actual Work slices;
- hard cross-repo implementation seams once inputs are ready.

Do not spend Work on repo census or source hunting that a bounded Web slice can perform.

---

# Read first

Always read current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/LIVING_MASTERPLAN.md`
5. `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`
6. `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/CHATGPT_HTML_TEXTURE_PREVIEW_LIMITATION_2026-09-23.md` when any ChatGPT-attached 3D HTML is used.
7. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/START_HERE.md`

Then current World lane:

6. `tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/START_HERE.md`
7. `.../RETURN.md`
8. `.../WORLD_ARCHITECTURE_RED_TEAM_2026-09-22.md`
9. `.../STORYTELLING_MAP_WORLD_DONOR_2026-09-22.md`
10. `tools/KFB-ToolBox/_handover/WORLD_BUILDING_PREFLIGHT_WEBCHAT_2026-09-22/START_HERE.md`

Combat:

11. `skills/chat/tool-nodes/combat-arena.md`
12. current `georg-doc/KFB-Combat-Arena` PR #5 / #7 / #10 heads and Returns
13. [COMBAT_RANGED_MVP.md](COMBAT_RANGED_MVP.md)

Transitions:

14. `skills/chat/workflows/KFB_THEATRE_CURTAIN_CORE_V2_2026-09-21/START_HERE.md`

GitHub state overrides every head written below.

---

# Current World / Environment state

## Claude Design brief

The existing Claude Design World Authoring brief remains the design brief.

Do **not** replace it with a new long brief.

It now includes:

- Hex / Scene Patch / Source Object Inspector;
- WhackMan Dungeon Environment Profile;
- Surface Adapter Red Team;
- Storytelling/Tactical Map donor;
- Combat Spindle Sky as a reusable Environment Element.

Technical preflight should reduce uncertainty before Claude spends authoring context.

## World Building Web preflight

Prepared sequence:

- P0 · Source / reuse / license matrix;
- P1 · isolate WhackMan Environment Profile;
- P2 · same tiny recipe on FLAT / SPHERE / TORUS.

The preflight now also classifies:

- StoryMap D6/ripple/toy/wet-mask donors;
- Combat Spindle Sky donor.

Final technical output, if gates pass:

`CLAUDE_DESIGN_INPUT.md`

Claude Design then receives proven technical seams rather than replaying repository research.

## Story / Tactical Map

Decision:

Storytelling Map and Tactical Map are **representations of World Recipe data**, not new World runtimes.

Long-term:

`World Recipe → World View | Tactical View | Story View`

## Racer

Cologne Option C-2 Claude lane continues independently.

Racer may later consume accepted World Environment Elements such as Spindle Sky, but World work must not retune Race movement/contact.

---

# Current Combat state

Implementation repo:

`georg-doc/KFB-Combat-Arena`

## CA2 PR #5

Branch:

`chatgpt-web/combat-arena-integration-v2-2026-09-19`

Head at this check:

`954f2db7484dc566e468e5ce89b0d95940d97537`

Implemented:

- FrizzleBob Driver Graft as player presentation;
- Player.v2 remains movement/ground owner;
- existing Gunfight remains ranged/target/projectile/damage owner;
- graft muzzle passed into Gunfight;
- Skeleton Warrior + Skeleton Mage adapters;
- existing enemy lifecycle/rewards/run flow retained.

Evidence:

- 68/68 tests;
- portable build / re-home green.

Main blocker:

**exact KFB Cloudflare Stage packaging/browser proof**, previously blocked by binary transfer in the Web connector environment.

This is a good Work/local-cloud-computer integration task.

## CA2 PR #7

Current melee contact lane.

Head at this check:

`f773dbeb0cfa09fa7e1bd72a4323130b2c0eff06`

Contains:

- active attack window;
- swept weapon contact;
- AttackLedger;
- Sword candidate.

Evidence:

- 98/98 tests.

Public Sword proof is frozen after two publication failures.

Melee is **not required for the first ranged Combat MVP**.

## CA2 PR #10 · Legacy readiness

Branch:

`chatgpt-web/ca2-legacy-00-readiness-2026-09-22`

Head:

`663f0610eb960f322d67b078f1302d0c6178d1c2`

Evidence:

- 106/106 PASS.

Pinned Legacy source:

- 4 bodies;
- 17 heads;
- 24 weapons;
- 6-bone Rig_Legacy;
- 30 native clips.

Selected first ranged candidate:

**Rogue + rogue-default + common Crossbow + `Shoot(2h)`**

Selected first melee candidate:

**Knight + knight-default + common Sword + `Attack(1h)`**

Blocking gate before Legacy integration:

**KLR-EYE-VIS-01** human Legacy EyeRig review.

## Rig_Medium ranged calibration

Current public baseline:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-ranged-calibration-v1/`

Baseline evidence:

- 55/55 public PASS;
- FrizzleBob Driver + GothGirl share measured Rig_Medium gun/socket basis.

Important human status:

- grip/fist seating basically acceptable;
- standard Aim pitch judged too high;
- two blind Euler repairs failed;
- no third blind tuning.

Therefore:

use the public baseline as source/measurement evidence.

Do not call the current pitch final.

Do not block the first Combat MVP on a new GothGirl pitch repair unless GothGirl is explicitly selected into that MVP.

---

# Current Spindle Sky donor

Combat already contains the visual source.

Current planning seam:

`georg-doc/KFB-Combat-Arena:wsa/ca2-kaykit-prep-2026-09-20`
→ `prompts/SKY_01_SPINDLE_MODULE.md`

Donors:

- `himmel.v4.js`;
- `spindel.v4.js`;
- `skydome-shader.v4.js`.

Existing visual vocabulary:

- cylindrical sky carrying KFB card motifs;
- lower card funnel;
- upper spindle/dome;
- optional vortex/lava throat;
- independent psychedelic spiral overlay;
- palette/sky hooks.

Do not make it a Combat-only permanent owner.

Extract once as candidate:

`kfb.environment.spindle-sky/0.1-candidate`

Then Combat, World and Race may consume it through adapters after human visual proof.

It is an Environment Element, not a Surface Adapter.

---

# Recommended Work-slice discipline

The Lead Work chat should operate in explicit check-ins.

## W0 · control-plane check-in

No runtime changes.

Re-read exact heads and classify each lane:

- READY
- WAITING_HUMAN
- WAITING_CLAUDE
- BLOCKED
- HOLD

Update the integration/status board.

Select exactly one next Work implementation slice.

## W1 · World preflight review

Only after Web P0–P2 return.

Review:

- source/reuse matrix;
- Environment Profile;
- Flat/Sphere/Torus proof.

Decide whether Surface Adapter architecture is accepted enough to update `CLAUDE_DESIGN_INPUT.md`.

No large World build in Work.

## W2 · Claude Design Session Cut reconciliation

After Claude exports a coherent World Session Cut:

1. exact 1:1 rehome/parity;
2. reconcile changed files with current GitHub;
3. preserve owner boundaries;
4. publish a bounded Stage candidate if appropriate;
5. return one human gate.

Do not ask Claude to repeat technical source research already proven by Web.

## C-MVP · Combat Ranged consolidation

Use [COMBAT_RANGED_MVP.md](COMBAT_RANGED_MVP.md).

Ranged first.

Melee later.

## M0+ · Cross-project Playable MVP

Only after selected World/Combat/Curtain inputs are classified.

Use the existing Playable MVP brief rather than inventing another integration plan.

---

# Anti-token-sprawl rule

The Lead Work chat is a durable coordination/control plane.

Do not turn every check-in into a long implementation session.

For each check-in:

1. fetch current heads/Returns;
2. update one status matrix;
3. identify conflicts/gates;
4. issue at most one Work slice and any number of small delegated Web/Claude tasks;
5. persist Return/changelog;
6. stop.

If a Work slice becomes source research or visual tweaking, split it back out to Web or Claude Design.

---

# Immediate next Lead Work gate

**W0 only: reconcile current World / Racer / Combat / Curtain / Story-Tactical lanes from GitHub and issue one integration lock.**

Do not implement Combat, World or MVP in the same W0 check-in.

## WorldBuilder WB2 terrain-sculpt follow-up · 2026-09-23

Georg accepted the current WB1 scene-authoring foundation and requested a later continuous-terrain modelling layer: low hills / rises / depressions authored directly into the procedural heightfield, without voxel/hex/tile terrain.

Current proposal:
`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/WB2_TERRAIN_SCULPTING_PROPOSAL_2026-09-23.md`

WSA should treat this as future-sprint intake, not as permission to replace current owners.

Key constraints:
- procedural base remains reversible;
- sculpting is an additive Raise/Lower stroke layer;
- reuse the shared `tools/KFB-ToolBox/lib/edit-layer.js` for object editing;
- terrain sculpt mode owns only terrain ray/brush/strokes;
- no voxel/hex terrain substitution;
- no second canvas-wide picker;
- first proof is Raise/Lower + radius/strength + smooth falloff + Undo/Clear + Save/Reload.

Current WB1 R3 uniform-size review remains a separate small human gate.
