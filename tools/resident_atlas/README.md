# KFB Resident Atlas · scene composition lane

Status: IMPLEMENTATION / mobile live viewer / candidate composition.

Intended permanent product URL: `https://kayfabizarro.pages.dev/resident-atlas/`

Source viewer: `tools/resident_atlas/`  
Stable route alias: `resident-atlas/` → `/tools/resident_atlas/`

## Owner boundary

This viewer is **not** a successor to `tools/resident_atlas_s6/`. It is a small scene-composition consumer/preview lane.

- asset identity/provenance → Asset Registry / exact GitHub source;
- resident recipes, rig facts, tested KayKit pose/attachment evidence → `tools/resident_atlas_s6/` as donor evidence;
- scene composition, camera, habitat/prop placement for this viewer → `tools/resident_atlas/`;
- shared production sync → `skills/chat/START_HERE.md` + `skills/chat/SYNC_PROTOCOL.md`;
- final motion/attachment compatibility must not be promoted beyond the evidence of the receiving owner. The central router currently marks the generic Animation Lab implementation as `UNVERIFIED`;
- Travel, Town, Race and other consumer runtimes keep their own movement/world/persistence contracts.

See `SCENE_STAGING_CONTRACT.md`.

## Current scene · Caveman · Cave Camp

The scene uses whole authored KayKit assets only. No floor/stair/rock is silently reinterpreted as a different prop or building element.

### DECISION

A resident is posed **before** it is grounded. Ground contact is a property of the posed actor, not of the bind/T-pose bounding box.

### IMPLEMENTATION

- Caveman recipe is bound to the current Resident Atlas S6 Caveman donor entry.
- Rig family: `Rig_Medium`.
- Display clip: `Melee_Unarmed_Idle`, the same Caveman choice recorded in the current S6 atlas after `Sit_Floor_Idle` proved to be a reclining pose.
- Animation source: shared KayKit Character Animations 1.1, pinned at `aa16a777a970f23d3f11fb3c23dc40718b04fa88`.
- Scene assets are pinned at `891eadf01e218f5fc21387e64cea1fec8332c5b6`.
- The viewer evaluates the pose first, then uses `Box3.setFromObject(actor, true)` for precise posed bounds and moves the lowest rendered point to scene ground `y=0`.
- For a running idle, the actor is re-grounded after mixer updates so animation cannot leave the resident hovering above or sinking through the stage.
- The Caveman props remain exact standalone KayKit props at their authored identities; this pass does not invent new hand attachments or scene semantics.

### TESTED RESULT

- Earlier viewer mechanism: Georg visually confirmed the old public mobile build loaded `14/14` models on 2026-09-16.
- Current posed/grounded revision: **STATIC TESTED RESULT** — scene JSON parses, the module script parses, 11 scene assets are declared, `Melee_Unarmed_Idle` + ground lock + both source pins are present, and mixer-update-before-ground-lock ordering was checked on the branch. Public/mobile visual QA remains open.

### GEORG ACCEPTANCE

- Viewer mechanism: accepted.
- KayKit-only direction and enlarged props: accepted in chat.
- New posed/grounded Caveman scene: visual acceptance pending.

## Scene recipe

Scene selection lives in `scenes/index.json`. Each scene is declarative and may bind a resident donor, an exact animation clip and an explicit ground contract while keeping habitat/prop placement scene-local.

Do not copy the whole S6 resident implementation into this viewer. Reuse the minimum proven contract and keep the source path/revision visible.

## NPC-LIFE-01 · living encounter seam

Draft PR #210 adds a thin social-life consumer seam under `tools/resident_atlas/life/`.

The semantic vocabulary is `approach → greet → offer → react → accept/decline → leave`. The receiving host retains movement, legality, participant busy state and relationship context. Motion, ChatterBox text and offer resolution are separate consumers; the proof does not create a second Resident runtime, dialogue tree, memory database or reward database.

Contract test: **21/21 PASS**. Review route after verified publication: `https://kayfabizarro.pages.dev/kfb-hub/stage/resident/npc-life-01/`.
