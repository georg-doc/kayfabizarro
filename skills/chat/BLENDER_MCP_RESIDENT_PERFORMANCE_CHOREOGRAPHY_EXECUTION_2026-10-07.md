# Blender MCP · Resident Performance + Character Choreography · EXECUTION · 2026-10-07

Status: **READY NOW · PARALLEL SOURCE-ISOLATED BLENDER JOB · BEFORE SHIELD FIT #367**
Executor: **Blender MCP**
Issue: **#369**
Owner: **KFB Resident Performance / Motion Prep**
Receiving product later: **KFB Open World / WB2 · Issue #360 / PR #348**
Execution mode: **BOUNDED_SLICE**
Future work branch: `blender/resident-performance-choreography-2026-10-07`

## 0 · Current routing override

Georg explicitly prioritizes **world-impacting Character/Resident choreography before the Medium/Large shield correction**.

This Blender job may run **now**, in parallel with Coworker code review / Architecture Freeze work, because it is source-isolated preparation.

The older wording “wait until after Coworker” is superseded only for this isolated Blender preparation.

Still forbidden until the receiving Architecture Freeze explicitly opens the seam:
- Open World / WB2 runtime writes;
- PR #348 code changes;
- runtime Resident Performance Composer integration;
- navigation/pathfinding integration;
- dialogue/runtime state ownership changes.

**#367 Shield Fit follows this job** unless a new blocker makes the shield itself outcome-critical.

## 1 · Read first · exact order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this file
5. `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md`
6. `skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md`
7. `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md`
8. `skills/chat/RESIDENT_AFFECT_EMANATA_MAP_PREP_2026-10-06.json`
9. `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md`
10. `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.json`
11. `skills/chat/RESIDENT_LIFE_VERTICAL_SLICE_FIXTURE_01_2026-10-06.json`
12. `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md`

Do not replace these contracts with chat memory.

## 2 · Source / donor pins

### Resident Atlas · current source owner
- `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`
- `tools/resident_atlas_s6/data/cast.js`
- current inventory includes 21 Residents across Rig_Medium / Rig_Large / Rig_Legacy.

### Motion SSOT
PR #344 · `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`
Verified current head:
`dfb6b8a15b3f04c52f49825252fcaf60f45df51c`

Rule:
**KayKit-native clips first.** Mixamo/other libraries only for an explicitly proven native gap.

### Fluff Work Motion donor
PR #356 · `planning/fluff-blender-slice-01-2026-10-04`
Verified head:
`9124366b88e5e317cbba8480412a8b90f84c9d5d`

Known coverage:
- Rig_Medium 17 clips;
- Rig_Large 13 clips;
- push/steer;
- growing-ball variants;
- 2/3-worker Large-ball push;
- surf/balance/dance/foot-roll;
- contact-event reuse;
- 6→1 merge;
- prior slice found **NEW CLIP REQUIRED: none**.

Reuse before authoring.

### ChatterBox semantic donor
PR #357 · `planning/chatterbox-triplet-curator-site-2026-10-04`
Verified head:
`886b8e58135553633dda13d0643dc5844078cb35`

Use only semantic speaking/listening/reaction/choreography needs.
Do not build a second dialogue product.

### Face owners
EyeRig v6:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

PetMouth:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v3/pet-mouth.v1.js`

Do not bake competing eye/mouth/lip-sync systems into body clips.

## 3 · Product outcome

Build a **reusable performance vocabulary** that makes KFB Residents read as characters in the world rather than animated props.

Prioritize what has the largest visible world impact:

1. **Base Pose**
   - open / closed;
   - attentive;
   - proud;
   - tired;
   - worried / guarded;
   - suspicious;
   - relaxed.

2. **Proximity / relational staging**
   - orient toward / away;
   - step-in / step-out;
   - social distance;
   - lean toward / away;
   - partner/object presentation angles.

3. **Gesture + micro-motion**
   - nod / shake / shrug;
   - point / wave;
   - listen / speak accent;
   - recoil / settle;
   - head tilt/cock;
   - shoulder/hand anticipation.

4. **Resident↔Resident / Resident↔Player encounters**
   - notice;
   - greet;
   - listen;
   - answer/react;
   - interrupt;
   - disagree;
   - reconcile/resume.

5. **Shop / trade / gift / market choreography**
   - orient;
   - present item;
   - offer/request;
   - give/receive;
   - inspect;
   - pleased/doubt reaction;
   - resume.

6. **Fluff / work / daily-life choreography**
   - collect;
   - carry;
   - roll/push;
   - knead/press;
   - place;
   - flatten;
   - patch;
   - team push;
   - deposit;
   - work interruption + resume.

7. **Repair / rebuild**
   - inspect damage;
   - fetch/receive material;
   - carry/place/patch;
   - inspect result;
   - relief/pride/celebrate;
   - resume next task.

This is a vocabulary/grammar, not bespoke scene animation.

## 4 · Mandatory method

For every requested behavior:

1. show the actual Resident/rig/prop source in isolation;
2. record exact path + rig family;
3. inspect existing clips/additive solutions;
4. classify:
   - `COVERED`
   - `LAYERABLE`
   - `NEW_CLIP_REQUIRED`
5. author a new clip only when reusable layering cannot safely solve the gap;
6. prove new clips on at least one representative real Resident and the required rig family;
7. preserve foot/contact safety and face-channel compatibility.

A loaded asset URL is not source proof.
A pretty preview is not proof of the correct donor.

## 5 · Required coverage matrix

At minimum classify:

- neutral/calm;
- curious;
- attentive;
- joyful/pleased;
- amused;
- grateful/affectionate;
- proud;
- surprised;
- worried/anxious;
- sad/disappointed;
- annoyed;
- angry;
- embarrassed;
- suspicious;
- tired/bored;
- listening;
- speaking accent;
- nod;
- shake;
- shrug;
- point;
- wave;
- give;
- receive;
- trade;
- inspect;
- carry;
- roll/push;
- knead;
- place;
- flatten;
- patch;
- celebrate;
- disagreement.

For every `NEW_CLIP_REQUIRED`:
- name the failed existing donors;
- explain why layering is insufficient;
- name the rig family/families;
- state whether one reusable clip can cover several states/beats.

## 6 · Representative proof set

Use a small real cast, not placeholders.

Minimum:
- one Rig_Medium Resident;
- one Rig_Large Resident;
- one Resident with a prop/activity interaction;
- one two-Resident encounter;
- one shop/trade/gift beat;
- one Fluff/work or repair/rebuild beat.

Where the existing 3-Resident vertical fixture provides suitable cases, reuse it rather than inventing another semantic fixture.

## 7 · Style / readability

Read:
`skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md`

Use the Open World Styleguide / broad references only for:
- silhouette;
- readable posing at gameplay distance;
- appealing asymmetry;
- staging/composition;
- clay/KFB presentation benchmark.

They do not override:
- real rig dimensions;
- native clip facts;
- Resident Atlas attachment facts;
- current Motion SSOT.

## 8 · Protected boundaries

Do not:
- edit Open World / PR #348;
- create a second animation runtime;
- create a second EyeRig/PetMouth/dialogue owner;
- hard-code dialogue text into clips;
- bake world coordinates into animation;
- solve every emotion with a bespoke full-body clip;
- rebuild already-proven Fluff motion;
- start Shield Fit #367 inside this job;
- publish a Site;
- touch Hub shell/CSS;
- merge or promote Live.

If two non-improving passes hit one motion seam:
preserve that seam, mark it `UNRESOLVED`, and continue the rest of the coverage matrix unless the seam blocks the named outcome.

## 9 · Output packet

Return one coherent packet on the Blender branch:

- `SOURCE_ISOLATION.md`
- `MOTION_COVERAGE_MATRIX.md`
- `AFFECT_BODY_MAPPING.md`
- `CHOREOGRAPHY_BEATS.md`
- `PREVIEWS/`
- any genuinely required reusable Blender/GLB/action assets
- `RETURN.md`

RETURN must include:
- repo / branch / exact head;
- changed files;
- exact source pins;
- actual tests / preview counts;
- what was reused;
- what was authored;
- `COVERED / LAYERABLE / NEW_CLIP_REQUIRED` totals;
- unresolved/quarantined seams;
- one next gate.

## 10 · Done when

The later Resident integration can consume a source-proven performance vocabulary without guessing:
- what body language exists;
- what layers safely;
- what truly needed new animation;
- how social/shop/work/Fluff/repair encounters stage;
- how body performance composes with EyeRig, PetMouth, ChatterBox and the event contract.

No Open World integration is required for this PASS.

## 11 · Next gate

After this packet returns:

**Blender MCP #367 · Shield Fit · Rig_Medium + Rig_Large**

Then, separately, after the receiving Open World Architecture Freeze explicitly opens the seam:

**Work/Astra · Resident Performance Composer / runtime integration.**
