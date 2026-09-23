# WB1-TERRAIN-SCENE-01 · Test report · 2026-09-23

Status: **LOCAL REVIEW CANDIDATE · NOT PUBLIC**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`  
Draft PR: **#186**

## Candidate files

- canonical source: `WB1_TERRAIN_SCENE_01_SOURCE.html`
- zero-install review copy: `WB1_TERRAIN_SCENE_01_REVIEW.html`
- verified source blob: `ff0df7f88d596526a19271a18031c1301b36afe6`
- review-copy commit before this report: `b57e7c73023396bed5184771a1b927d7f05e0450`
- review blob: `c9c4eaf433472a9f14ebb1f435d978e97c1c7306`

## Reused owners / donors

### Terrain
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` · MIT.

Bounded reuse from:
- `src/engine/terrain/noise/cpuNoise.js`
- `src/engine/terrain/noise/seedDomain.js`

The candidate reuses the deterministic value-noise / FBM / bounded seed-domain mechanism. It does not import the donor's whole product runtime or UI.

### Scene editing
Existing KFB S21/S22 interaction donor:
`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/KayKit_Room_Study_S21.html`

Reused seam:
- Three.js `TransformControls`;
- click selection;
- translation / rotation;
- snap;
- drop to ground/terrain;
- localStorage save/reload.

### Resident / animation
Resident Atlas fixture:
`tools/resident_atlas/scenes/caveman-cave-camp.json`

Exact actor:
`media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb`
@ `891eadf01e218f5fc21387e64cea1fec8332c5b6`

Exact clip:
`Melee_Unarmed_Idle` from
`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb`
@ `aa16a777a970f23d3f11fb3c23dc40718b04fa88`

Exact prop:
`media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_3_E_Color1.gltf`
@ `891eadf01e218f5fc21387e64cea1fec8332c5b6`

## Tests actually run

### Source static + deterministic logic
**21/21 PASS**

Checks include:
- exact repaired branch head/blob;
- module parse;
- source-actor/source-prop isolation gates;
- composed scene locked behind successful source loads;
- posed grounding targets the resident parent / terrain Y, not world Y=0;
- TransformControls seam;
- drop-to-terrain;
- local save + reload hooks;
- reference-only scene-document policy;
- exact actor/animation/terrain pins;
- self-test harness presence;
- deterministic seed-domain and FBM behavior;
- adjacent-seed decorrelation;
- spatial terrain variation.

### Exact binary donor path checks
**3/3 PASS**

- Caveman actor exists at the pinned asset commit.
- Boulder prop exists at the pinned asset commit.
- Rig_Medium CombatMelee animation file exists at the pinned animation commit.

### Review-copy integrity
**5/5 PASS**

- branch head advanced to the review commit;
- review blob exists;
- review module parses;
- review runtime logic is byte-equivalent to the canonical source after removing only the review title/comment;
- embedded self-test harness remains present and the file is explicitly marked local/not-public.

## Repair pass

One bounded repair pass was used before producing the review copy:
1. posed-grounding changed from implicit world-Y grounding to parent/terrain-Y grounding;
2. composed Scene Editor unlock now requires successful isolated actor and prop loads, not merely visiting the tabs.

No second repair pass was required.

## Browser / visual evidence

Automated browser runtime tests: **0**.  
Screenshots: **0**.

Reason: this gate deliberately does not publish to Cloudflare, and the current session could not materialize the connector-backed GitHub HTML through its raw-download endpoint into the local Chromium environment. The embedded `?selftest=1` browser harness therefore remains **prepared but not executed**.

No browser PASS, visual PASS, or live/public claim is made.

## Human review order

1. Open `WB1_TERRAIN_SCENE_01_REVIEW.html`.
2. Confirm **Source actor** shows the real Caveman and existing `Melee_Unarmed_Idle`.
3. Confirm **Source prop** shows the real Boulder source object.
4. Enter **Scene editor** only after both isolated sources loaded.
5. Regenerate terrain.
6. Select actor or prop; move / rotate / snap / drop to terrain.
7. Save.
8. Change a placement.
9. Reload saved.
10. Continue editing.

## Publication

Cloudflare: **HOLD · NOT PUBLISHED**.  
No Stage or Live route is claimed by this report.

## Next gate

**Georg human HTML review of WB1-TERRAIN-SCENE-01.**

Do not start Claude Design, Orc Band integration, Sphere/Torus macro terrain, a second Resident Atlas, or Animation-Lab promotion before this human gate.
