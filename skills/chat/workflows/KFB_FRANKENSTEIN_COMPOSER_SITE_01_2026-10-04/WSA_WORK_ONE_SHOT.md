# WSA / WORK ONE-SHOT · KFB FrankenStein Composer GPT Site

Status: **AUTHORIZED IMPLEMENTATION HANDOVER**
Date: 2026-10-04
Executor: **ChatGPT Work / WSA**
Owner: **KFB ToolBox**
Repository: `georg-doc/kayfabizarro`
Branch: `planning/frankenstein-composer-gpt-site-2026-10-04`
Draft PR: **#355**
Start head: `4d40a2c25dd7d1dd79cd61a2b2188bcf7b16cf31`
Outcome: **one usable KFB FrankenStein Composer frontend + GPT Site, source-faithful and reversible**
Acceptance route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frankenstein-composer/`
Live promotion: **FORBIDDEN**
Merge: **FORBIDDEN until Georg review**

## Read first

Read current GitHub state, not chat memory:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `tools/KFB-ToolBox/docs/CONTRACTS.md`
5. `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/START_HERE.md`
6. `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/SOURCE_AUDIT.md`
7. `skills/chat/workflows/KFB_FRANKENSTEIN_COMPOSER_SITE_01_2026-10-04/RETURN.md`
8. current PR #355 ref/head immediately before the first write.

If any older document conflicts with the current branch, current branch wins.

## This is a ONE-SHOT

Do not return after a source bench, a Medium fixture, a Large fixture, a Pencil fixture, a save test, or a Site shell.

Internal checkpoints are:
1. frontend/runtime implementation;
2. tests/evidence;
3. Site + Stage publication;
4. Return/changelog/router/Hub.

Persist and verify each checkpoint, then continue automatically.

Return to Georg only when:
- the integrated product is ready for human review; or
- a real core blocker prevents completion.

A failure in one test harness or optional donor does not freeze the whole product. After two non-improving repairs of the same method/gate, preserve that method/candidate and either use a source-faithful alternate route or stop only if the exact product acceptance target is genuinely blocked.

## Product to build

Build **KFB FrankenStein Composer** as a compact visual authoring frontend.

It must let Georg:

1. pick a verified KayKit body;
2. view that body alone;
3. pick/view the KFB/FrizzleBob head donor alone;
4. mount the existing KFB head/face stack onto the compatible body;
5. audition compatible motion for that exact rig family;
6. change pose/fit/face controls using existing ToolBox owners;
7. save/export the reversible actor composition;
8. clear/reload/import and reconstruct the same actor;
9. create a living Pencil prop character using existing eye/face semantics;
10. later admit Eraser only after a real source exists.

Do **not** build a new character renderer, universal skeleton, asset registry, EyeRig, brow system, motion system, body physics system or game runtime.

## Architecture invariant

The saved composition is a **reversible Actor Recipe**:

`body source + body skeleton + head source/graft + face profile + ear profile + material/surface profile + rig-family motion refs + authoring transforms`

The exact source paths/refs remain visible in the recipe.

Primary actor format remains `kfb.pets/1`.
If additional provenance is required, use a companion candidate manifest rather than silently inventing a replacement canonical actor schema.

One animated skeleton = one mixer.
One face stack = one existing face owner chain.
No consumer movement controller belongs in this tool.

## UI

Use current ToolBox/Studio visual language. Do not create a generic admin dashboard.

Required layout:

- **left rail:** Source · Body · Head · Face · Prop
- **center:** large clean 3D stage
- **right inspector:** compatibility · fit · rig · motion · pose · selected face-part controls
- **bottom dock:** SOURCE / COMPOSITE / MOTION · play/stop · save · export · import · reset

The actor must remain unobstructed. No giant diagnostics, floating palettes or modal overlays over the model during review.

Required mode switch:
- `SOURCE`
- `COMPOSITE`
- `MOTION`

## Source-first rule — non-negotiable

A loaded URL is not proof of donor use.

For every fixture:
1. show the exact donor object in isolation;
2. record source path/ref/blob;
3. capture screenshot;
4. only then integrate it;
5. capture the integrated result.

Do not use substitute geometry.

## Fixed first fixtures

### A · Rig_Medium

Use **GothGirl** as the neutral Medium source fixture:

`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb`

Classification:
`Rig_Medium · VERIFIED_SOURCE`

The Composer must show:
1. GothGirl alone;
2. FB head donor alone;
3. FB head/face stack mounted on the compatible Medium body;
4. a real compatible Medium idle/walk motion.

The existing Driver graft may additionally be kept as a regression fixture, but do not make a Driver-specific special case the Composer architecture.

### B · Rig_Large

Use **Black Knight** as the required Large fixture:

`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb`

Verified classification:
`Rig_Large · 23 joints`

Known source record:
blob `ce20440309951a9d85d246b6ff6b0fa399f6c9d8`
revision `986699c81340dc3b266bf921441f93bf18127f6b`.

Show Black Knight alone before integration.
Use Rig_Large motion only. Do not bind Medium clips to prove success.

The FB head fit is head/bone based. Do not resize the whole Large body to make the head fit.

### C · KFB / FrizzleBob head

Primary exact donor:
`tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb`
@ `19088b142c6a7e7626f27fba8e80caf6ab2437c1`
blob `131d7c3862591708bbd4ad50af39093605b56b92`.

Optional comparison:
`FB_TEMPLATE_LOOK_v5b.glb` @ `23615cff`
blob `24134a51793fef0dd8cab59bbf50b6b7c5960a45`.

Do not pretend these files exist at current-main path if they do not; fetch/use the pinned GitHub source.

Reuse:
- `graft-biped.v1.js`
- `facehost.v1.js`
- `headgraft.v1.js`
- current face-mount path
- existing ear owner.

### D · Face

Reuse, do not clone:

Eye:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Brows:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js`

Clay lids:
`tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/kfb-lib/clay-lids.v1.js`
blob `d7cea2ae7be416f32d634190b335f1a40b29c7b2`.

Preserve its eyeball-bound fit and current hinge/slide semantics.
Do not silently promote the old missing Eye Actor Studio paths as current-main files.

Also reuse current mouth/rest/viseme and EarRig/ear-dangle owners when available in the chosen ToolBox closure.

### E · Pencil PropActor

Exact source:
`media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_long.gltf`
blob `0b634a084bbbf6459b26292d11da8a0d39396549`.

Required behavior:
- Pencil donor alone;
- measured bounds/front/up;
- EyeRig eyes/pupils;
- gaze/follow;
- blink;
- clay upper/lower lids;
- animated brows;
- at least neutral + one clear emote;
- body wobble/tilt may be semantic/procedural, but do not bind a humanoid skeleton or humanoid motion clips.

Mouth is optional only if a real existing source/mount produces a good result. Do not block the Pencil acceptance on a mouth.

### F · Eraser

Display a disabled row:
`SOURCE_REQUIRED`.

Current source audit found no real `eraser.gltf/.glb` or `rubber.gltf/.glb`.

Do not generate or substitute a rounded box.
Do not block the rest of the product on Eraser.

## Motion source

Do not hardcode historical clip counts.

Current-main:
`media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`
blob `694d797702d126e71a724eab137197bf2a8e6914`
= 33 catalog records.

Later ToolBox history references Motion Library v3:
pin `4fa082714c7200f6926008a1cd0b34db8df4dbad`
= 204 clips.

At implementation start:
- inspect both source states;
- choose the most complete verified catalogue that cleanly serves Medium + Large without mixing incompatible generations;
- pin the chosen catalogue in source metadata;
- preserve unsupported actions as unsupported instead of fabricating coverage.

## Asset Librarian seam

Do not build a new catalogue.

Use existing Asset Librarian facts/handoffs to populate future bodies/props after the fixed fixtures prove the architecture.

The initial Site must already be data-driven enough that adding another compatible KayKit body is a source/recipe entry rather than a new hardcoded UI feature.

## Save / round trip

Minimum acceptance:

1. load Medium source;
2. compose FB head/face;
3. change at least one fit/face parameter;
4. choose compatible motion;
5. Save;
6. Export;
7. clear application state / fresh browser context;
8. Import;
9. reconstruct;
10. compare source IDs, rig family, transforms, face profile and motion refs.

Repeat the identity/provenance round-trip for Pencil.

Unknown/unmodified `kfb.pets/1` fields must survive.

## GPT Site + Stage

The requested product is a **GPT Site**.

Use Work's authenticated Site-authoring capability if available and create the actual KFB FrankenStein Composer Site from this single frontend/source owner.

Do not create a second implementation just for Cloudflare.

The same frontend revision must also be exposed at the KFB review route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frankenstein-composer/`

That direct Cloudflare URL is the human acceptance surface and must be linked from the KFB Hub.

If GPT-Site authoring is unavailable in the Work environment:
- do not claim it was created;
- still finish the repository-owned frontend and exact Cloudflare Stage if possible;
- record `GPT_SITE_TOOL_UNAVAILABLE` as the single external publishing blocker;
- do not replace it with a fake branded clone.

## Test minimum

Static/source tests:
- all selectable enabled donors resolve;
- exact donor ref/path/blob recorded;
- Eraser disabled;
- no fallback geometry;
- no duplicate EyeRig/brow/motion implementation;
- rig classifier correct.

Browser tests:
- source isolation Medium;
- source isolation Large;
- source isolation FB head;
- source isolation Pencil;
- Medium composite;
- Large composite;
- Pencil face stack;
- Medium motion;
- Large motion;
- SOURCE ↔ COMPOSITE identity stability;
- save/export/import fresh reload;
- no console exceptions;
- no failed required resources.

Visual evidence:
- Medium donor alone + composite front + 3/4;
- Large donor alone + composite front + 3/4;
- FB head alone;
- Pencil alone + face neutral + blink/emote/brow state;
- one motion pose for Medium and Large;
- screenshots saved with source revision metadata.

## Acceptance bar

Do not call the product ready merely because:
- model URLs load;
- the UI renders;
- a head appears approximately near a body;
- motion buttons exist;
- JSON exports.

Ready means:
- source identity is proven;
- actual donor designs are visibly used;
- Medium and Large composites are visually coherent;
- Pencil clearly reads as the real pencil source with a working face;
- the round trip works;
- the exact Stage revision is publicly visible.

## Publication / Hub

After implementation + evidence:
1. update this workflow Return;
2. append ToolBox changelog;
3. update central `skills/chat/START_HERE.md`;
4. update KFB Hub card from planning → real review;
5. publish the exact frontend revision to the reserved Stage route;
6. open the exact pages.dev URL;
7. visibly confirm the expected revision marker and actor fixtures;
8. only then mark `PUBLIC_VERIFIED`.

Do not put a GitHub preview, raw URL, local file or unrelated GPT-Site URL in the Hub as the human acceptance link.

## Required final Return

Return:
- repo;
- branch;
- PR;
- exact final head;
- exact GPT Site URL/status;
- changed files;
- retained owners;
- chosen Motion catalogue/ref;
- actual test counts;
- screenshots/evidence paths;
- direct Cloudflare Stage URL;
- PUBLIC_VERIFIED proof;
- unresolved/deferred items;
- exactly one next gate.

Georg should have one action only:
**open the Stage and freeplay/review the Composer**.

No merge.
No Live promotion.

## Exactly one next gate

**BUILD AND PUBLICLY VERIFY THE COMPLETE KFB FRANKENSTEIN COMPOSER.**
