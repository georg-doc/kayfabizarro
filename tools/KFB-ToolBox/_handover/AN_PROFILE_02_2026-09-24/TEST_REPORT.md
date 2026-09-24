# AN-PROFILE-02 · TEST REPORT

Date: 2026-09-24  
Owner: KFB ToolBox / Stage-First integration  
PR: #185  
Runtime-tested head: `93d9dd6f763c064313fe5d3bef690496487145a9`

## GitHub Actions

Workflow:
`.github/workflows/toolbox-coherent-integration-01.yml`

Run:
`36032905791`

Job:
`107745811232`

Conclusion:
**SUCCESS**

## Existing ToolBox regression checks

The pre-existing coherent milestone stays green:

- static owner/source/contract checks: **22/22 PASS**
- Chromium coherent-flow checks: **20/20 PASS**

The existing real flow still proves:
Stage-First → real roster → current Driver Graft → Goth Girl → edit/Drop/Scale → Save/Reload → Orc Warband → Animatronic.

## AN-PROFILE-02 static checks

**34/34 PASS**

Key assertions:
- immutable AN-PROFILE-01 head `032c9d50...` is pinned;
- Motion Library PR #197 remains explicit;
- catalogue/profile schemas are exact;
- source requires 33 clips;
- shared reader validates the profiles;
- catalogue/profile ids must match;
- adapter creates no mixer or renderer;
- both rig-specific library URLs are source-backed;
- semantic profile families are used;
- unknown planted/contact state is preserved;
- existing Animation Lab v3 loads the adapter;
- KFB Motion joins the existing `allClips()` pool;
- existing `selectClip()` remains playback path;
- semantic search/filter is profile-driven;
- Data exposes state/loop/travel/ref-speed/contacts/rate/markers/evidence;
- current Inventar surfaces semantic metadata;
- AnimationMixer creation count remains **3 → 3**;
- WebGLRenderer creation count remains **2 → 2**;
- no consumer-local profile JSON or KFB Motion GLB copy exists;
- modified data-dc JavaScript parses.

Independent exact-GitHub source sanity performed before CI:
**32/32 PASS**.

## AN-PROFILE-02 real Chromium checks

**25/25 PASS**

Proven in the actual current Animation Lab v3 source:
- exact AN-PROFILE-01 source head is loaded;
- PR #206 / PR #197 lineage remains explicit;
- current catalogue/profile schemas load;
- both source sets contain 33 entries;
- **Rig_Medium loads 33 real KFB Motion clips**;
- `kfb_locomotion_run_forward_a` selects through the existing clip/mixer path;
- locomotion/run, forward/travel and loop facts are source-backed;
- measured-derived Medium reference speed is available;
- Medium planted contacts are measured;
- unmeasured run action markers remain absent;
- per-clip playback rate remains unknown;
- Data panel visibly exposes Motion profile facts;
- semantic locomotion filter returns the four source-backed locomotion clips;
- semantic search finds travel clips;
- **Rig_Large loads 33 real KFB Motion clips**;
- Large feet remain `UNKNOWN_NOT_MEASURED`;
- Large uses its own measured travel distance for derived reference speed;
- hands remain `UNKNOWN_NOT_MEASURED`;
- no Large run markers are invented;
- explicit `endsOnTop` climb marker survives;
- **0 KFB Motion/profile network failures**;
- **0 page errors**.

## Runtime ownership result

PASS:
- no new AnimationMixer owner;
- no new renderer;
- no new movement/physics/gameplay state;
- no second profile database;
- no local motion-library binary copy.

The current ToolBox v3 donor remains the UI/runtime owner. AN-PROFILE-02 is a source adapter + catalogue/profile consumption layer.

## Browser / human evidence

Automated Chromium proof: **PASS**.

Human visual/usefulness review:
**OPEN**.

No Cloudflare route was published. The intended review loop is the direct Chat HTML artifact first.

## Stage

Future milestone route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/animation-studio/`

Status:
**NOT PUBLISHED · NOT PUBLIC_VERIFIED**
