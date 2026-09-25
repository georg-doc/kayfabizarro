# Intake · WorldBuilder + ToolBox Session Cuts + Ear Rig · 2026-09-25

Status: **CLASSIFIED INPUT · receiving owners unchanged**

Current Inbox upload on main:
`8504afa9d14ad46855d0c590bc30eea0fc38d15d`.

This intake classifies the two Claude Design session cuts and the Blender MCP Ear Rig candidate. Inbox presence does not promote runtime ownership.

## A · session_ZIP_v1 assessment

Current GitHub entry:
`skills/session_ZIP_v1.md` @ main blob `aac63829518803442ba44a55013e1bbfa79ab690`.

Assessment:
**PRACTICALLY GOOD / PROVEN BY THE TWO CURRENT EXPORTS.**

The two uploaded WIPs demonstrate that the workflow produces the material the architecture chat actually needs:
- runnable/editable source closure;
- START/HANDOVER/RETURN/CURRENT_STATE;
- active CHANGELOG/HOUSEKEEPING;
- SOURCE + manifest + checksums;
- explicit tests / NOT_RUN distinctions;
- evidence;
- NEXT_CHAT;
- pinned/unpinned/missing dependency inventory.

One recovery caveat remains:
the GitHub file is a short router/fallback. It says the complete v1.0 skill including `zipcheck.py` lives in Claude project “Skills” at `claude/session-zip-SKILL.md`.
That full canonical body is **not currently in this GitHub repository**.

Recommendation:
keep `skills/session_ZIP_v1.md` as the short trigger, but mirror the full canonical `claude/session-zip-SKILL.md` into GitHub when available so GitHub-only recovery does not depend on a Claude-project-local source.

Do not reconstruct the missing full skill from memory.

## B · ToolBox Production-01 Session Cut

Source:
`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`
@ main upload `8504afa9d14ad46855d0c590bc30eea0fc38d15d`.

Classification:
**KEEP · STRONG INTEGRATION CANDIDATE · HUMAN REVIEW NEXT.**

Useful result:
- two main workspaces: **Studio + Animation Lab**;
- same actor/runtime survives tab switch;
- shared edit-layer reused;
- direct IK targets on stage;
- Actor / Pose / Motion profile persistence;
- Motion Library audition/scrub/semantic roles/contact corrections;
- KayKit stock animation access;
- Legacy Character Builder;
- Rig_Large Orc Brute fixture;
- Save/reload;
- real-source self-test **13/13 PASS in Claude preview**.

Important open facts:
- current `pose-rig.v1` forearm-length assumption is wrong with intermediate wrist bones; the candidate locally re-measures, but owner fix belongs in `pose-rig.v1`;
- CCD solver B/C comparison still not done;
- Rig_Large foot contacts remain unknown;
- Bubbles / Materials / Vehicle Fit / full jump-state graph are not yet in this slice;
- Georg human review is pending.

Receiving route:
1. preserve the candidate 1:1;
2. Georg reviews the current Studio → IK/Pose → Animation Lab → contact correction → Save/Return flow;
3. only after that review issue a bounded correction/integration brief;
4. do not restart ToolBox or build separate Pose/IK labs.

Exactly one current ToolBox gate:
**GEORG HUMAN REVIEW · TOOLBOX-PRODUCTION-01.**

## C · World Integration-01 Session Cut

Source:
`tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`
@ main upload `8504afa9d14ad46855d0c590bc30eea0fc38d15d`.

Classification:
**KEEP · CORRECT PRODUCT DIRECTION · REHOME + HUMAN REVIEW NEXT.**

Why this matters:
the candidate does what the architecture requested instead of building another standalone editor:
- accepted WB2 terrain/object authoring is mounted into the Hürth world;
- same terrain-height truth;
- same sculpt strokes;
- same `edit-layer.js`;
- same `kfb-worldbuilder-scene` document;
- same Save/Reload;
- Play reads the modified authored state.

Current evidence:
- World self-test **26/26 PASS in Claude Design preview**;
- WB2 sandbox boot PASS;
- WB2 34/34 regression NOT_RUN in the export;
- Georg human 11-step world gate NOT_RUN.

Locomotion finding:
- current candidate uses KayKit base motion as default and keeps KFB Motion Library selectable;
- binding rule was corrected from all 69 source tracks to rotations + root/hips position only, no scale tracks;
- Jump uses Start → Air → Land chain;
- movement remains consumer-owned;
- this is good transitional evidence, but WorldBuilder must not become the long-term locomotion-profile owner.

After human integration review:
shared locomotion state/cadence/speed/profile truth must come from ToolBox Animation Lab, not be independently evolved in WorldBuilder.

Known world gaps remain explicit:
- sculpted terrain does not yet move building support heights;
- tile edge can step;
- camera/building collision missing;
- strafe has no dedicated clip;
- some remote graft dependencies remain unpinned/main-dependent;
- Hürth is a frozen fixture, not the completed Hürth→Köln/SAE corridor.

Exactly one current World gate:
**REHOME 1:1 → run 26/26 + WB2 34/34 → GEORG HUMAN GATE WORLD-INTEGRATION-01.**

No OSM corridor expansion and no Race placement before this gate.

## D · Ear Rig / PR #214

Source:
- PR #214;
- branch `chat/fb-ear-rig-v5-2026-09-25`;
- candidate folder `tools/KFB-ToolBox/ear-rig/`.

Classification:
**KEEP · TOOLBOX CANDIDATE LANE · NO GAME RUNTIME CHANGED.**

Owner decision:
**Animation Lab / ToolBox Motion owns the single `ear-dangle.v1.js` runtime.**

Reason:
it is time-based secondary motion layered after the actor's single AnimationMixer and driven by head acceleration, wind, gravity and impulses.

FrankenStein Studio remains the authoring consumer for:
- ear source/geometry;
- attachment/placement;
- rest/acted pose;
- `kfb.ear-rig.v0` per-actor profile;
- visual head fit.

World/Travel/Race consumers may supply wind/contact/impulse facts but may not fork the spring implementation.

The PR itself now records this owner decision and registers `ear-rig/` in the ToolBox manifest/README.

First gate:
**EAR-DANGLE-01**
- current FrizzleBob;
- canonical KayKit Idle / Walk / Run / Jump Start-Air-Land;
- one accepted KFB Motion Library dance;
- same actor/mixer;
- active ears;
- landing impulse on real Jump Land/contact;
- Georg reviews wobble amount, clipping, settling, cadence stability and dance readability.

EAR-DANGLE-01 should follow the current ToolBox Production-01 human gate rather than interrupting it.

## Current lead sequence after this intake

1. Georg reviews ToolBox Production-01.
2. Web rehomes/tests World Integration-01, then Georg reviews it.
3. Fix only issues revealed by those two human gates.
4. Consolidate canonical locomotion profiles in ToolBox Animation Lab and let WorldBuilder consume them.
5. EAR-DANGLE-01 on the accepted ToolBox/Animation surface.
6. Ground ↔ animated Card Flight / Surf Pose.
7. Hürth → Köln/SAE OSM continuity.
8. Race modular proof → World handoff.

No new universal editor, motion runtime or second secondary-motion implementation.
