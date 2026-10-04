# RETURN · KFB FrankenStein Composer GPT Site 01

Date: 2026-10-04
Status: **PLANNING/SOURCE LOCK COMPLETE · IMPLEMENTATION READY**
Repository: `georg-doc/kayfabizarro`
Branch: `planning/frankenstein-composer-gpt-site-2026-10-04`
Draft PR: **#355**
Pre-Return metadata head: `9fc6fbc8ef3717cd507d173f25263e267f88d3e8`

## Product reality

A new KFB ToolBox authoring slice is now defined for **KFB FrankenStein Composer**.

It is designed to let Georg:
- combine a KFB/FrizzleBob head/face stack with compatible KayKit Rig_Medium, Rig_Large and proven Rig_Legacy bodies;
- retain each selected body's real skeleton and compatible Motion Library;
- use Pencil as a living PropActor with EyeRig, clay eyelids and animated brows;
- save/reload a reversible Actor Recipe without inventing a second rigging/runtime stack.

This slice did **not** create or publish the GPT Site itself because the current authenticated toolset exposes GitHub/KFB Production Control but no GPT-Site authoring/publish action.

No Cloudflare Stage was created merely to simulate that outcome.

## Owner and contract

Owner remains:
**KFB ToolBox**.

Reused owners:
- FrankenStein graft / FaceHost / head graft;
- EyeRig v6;
- brow-rig v2;
- current ToolBox clay-lid candidate;
- current Studio mouth/face modules;
- EarRig line;
- Motion Library / rig-family-specific motion;
- Asset Librarian as source discovery/handoff.

Primary actor contract remains `kfb.pets/1`.

Consumer games keep movement, physics, camera and runtime ownership.

## Key design decision

Composition is a **reversible Actor Recipe**, not destructive mesh fusion and not a universal replacement skeleton.

Required review modes:
1. SOURCE — exact donor alone;
2. COMPOSITE — mounted head/face/body;
3. MOTION — same composite with a compatible rig-family clip.

A donor may not enter the composite until its real source has been shown in isolation.

## Source audit

Evidence:
`SOURCE_AUDIT.md`

Result:
**12/12 source/classification checks PASS.**

Resolved current-branch owners:
- EyeRig v6;
- brow-rig v2;
- graft-biped;
- FaceHost;
- headgraft;
- Pencil source;
- Motion Library catalogue;
- current repository-resident clay-lids candidate.

Pinned model donors:
- `FB_TEMPLATE_LOOK_v5.glb` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1`;
- `FB_TEMPLATE_LOOK_v5b.glb` @ `23615cff`.


Motion catalogue reality:
- current-main `KFB_Motion_Library.catalog.json` blob `694d797702d126e71a724eab137197bf2a8e6914` contains **33** clip records;
- later ToolBox Production history references Motion Library v3 with **204** clips at pin `4fa082714c7200f6926008a1cd0b34db8df4dbad`;
- implementation must explicitly select/pin the intended verified catalogue and must not hardcode the older 179-count planning snapshot.

Three stale current-main source-path assumptions were discovered and rejected instead of being copied into the new brief.

## Eraser

Current repository search found no real:
- `eraser.gltf`
- `eraser.glb`
- `rubber.gltf`
- `rubber.glb`

Therefore:
**Eraser = SOURCE_REQUIRED.**

The planned UI may display it disabled with that state. No substitute cube/box/generated rubber is allowed.

## Files changed in this slice

Created:
- `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/START_HERE.md`
- `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/SOURCE_AUDIT.md`
- `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/RETURN.md`

Updated:
- `tools/KFB-ToolBox/CHANGELOG.md`
- `skills/chat/START_HERE.md`
- `kfb-hub/index.html`

## Tests / evidence

GitHub source/classification:
- **12/12 PASS**

Branch-write verification:
- each file write was followed by exact branch-file read;
- each file write was checked with branch-vs-write-commit comparison;
- no timeout/write ambiguity occurred.

Not run / not claimed:
- GPT Site runtime: **NOT CREATED**
- Cloudflare Stage: **NOT CREATED**
- Three.js/browser render: **NOT RUN**
- Rig_Medium composite runtime: **NOT RUN**
- Rig_Large composite runtime: **NOT RUN**
- Pencil EyeRig/clay-lid/brow runtime: **NOT RUN**
- motion playback: **NOT RUN**
- save/import round trip: **NOT RUN**
- screenshots: **NONE**

## Hub / router

The central router now points to this bounded Composer slice.

The KFB Hub now contains a planning card:
**Build KFB FrankenStein Composer GPT Site**.

It links to the source brief, not to a fake human-test surface.

Reserved future public review route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frankenstein-composer/`

Current state:
**RESERVED · NOT CREATED · NOT LIVE**.

## Unresolved

1. Actual GPT-Site creation/publishing requires an authenticated GPT-Site authoring surface/tool not available in this chat toolset.
2. First real Rig_Large body fixture must be selected and source-isolated during implementation.
3. Eraser real 3D source must be found/imported before it can be enabled.
4. Current session-cut clay-lid candidate should be consumed/pinned deliberately rather than silently promoted to a new canonical owner.
5. Runtime save/import and rig-aware motion must be proven in the real frontend.

## Georg action

**Nothing required for this planning/source-lock handoff.**

The next executor can implement directly from `START_HERE.md`.

## Exactly one next gate

**IMPLEMENT THE KFB FRANKENSTEIN COMPOSER GPT SITE / FRONTEND**.

First visible delivery must show:
- one selected KayKit body alone;
- the FrizzleBob/KFB head donor alone;
- the integrated composite;
- Pencil alone, then Pencil with EyeRig + clay lids + animated brows.

No merge or Live promotion without Georg's review.


## 2026-10-04 · WSA / Work implementation handover

Georg authorized continuation to build the product. The implementation handover is now:
`WSA_WORK_ONE_SHOT.md`.

Executor: **ChatGPT Work / WSA**.
Same owner/branch/PR: KFB ToolBox · `planning/frankenstein-composer-gpt-site-2026-10-04` · Draft PR #355.

The handover fixes the first runtime fixtures as:
- GothGirl · Rig_Medium;
- Black Knight · Rig_Large;
- pinned FrizzleBob EarRig-v5 head donor;
- Pencil A long · PropActor;
- Eraser disabled as SOURCE_REQUIRED.

Work is instructed to continue through implementation, tests, actual GPT Site creation when available, exact Cloudflare Stage publication/verification, and final Return without stopping at intermediate green checkpoints.

Current planning/runtime status before Work starts remains: source audit **12/12 PASS**; runtime/browser/GPT Site/Stage **NOT YET BUILT**.

Exactly one next gate: **WSA/WORK BUILDS AND PUBLICLY VERIFIES THE COMPLETE COMPOSER.**
