# KFB Eye Actor Studio v1 · RETURN

Date: 2026-09-21
Status: TECHNICAL BROWSER PASS · GPT WORKBENCH READY · PUBLIC STAGE OPEN · HUMAN VISUAL GATE OPEN
Repo: georg-doc/kayfabizarro
Branch: chatgpt-web/toolbox-eye-actor-studio-v1-2026-09-21
Base main: 66d6d96b5e8f6ef8fb06a0888baa70d822fb9a69
Tested head: cfead6b064a36075f3c360217ed42c92b065bec3

## Outcome

Eye Actor Studio v1 is now a working authoring candidate rather than only a brief.

It preserves EyeRig v6, BrowRig v2, EyeOval v1 and EyeRig Batch ownership while adding a Studio-local Eye Cluster that supports 1–4 independently authored eyes.

Per eye:
- XYZ position;
- overall size;
- Width / Height / Depth;
- Pitch / Yaw / Roll;
- quaternion export;
- local gaze;
- Clay/shell lid state.

Fixtures:
- frontal pair;
- unequal asymmetric pair;
- frog-side pair;
- single eye;
- three eyes;
- four eyes.

Acting currently supports all / selected / primary-pair scope plus neutral, skeptical, tired, angry, surprised and selected-eye aim.

## Donor proof

The Studio has an explicit exact donor mode importing current EyeRig v6, BrowRig v2 and EyeOval v1 from the repository. The donor screenshot is part of CI evidence.

## Tests

20/20 static PASS
4/4 syntax PASS
22/22 desktop/mobile WebGL PASS
0 failed resources
0 page/console errors

Artifact: 10630529454
Digest: sha256:17267649b1bf41192a6e8233c8f6d23dc5e162021fad97965b30dc98e44bcbb0

## GPT workbench

The current ChatGPT conversation has a standalone single-file workbench mirror for immediate iteration. This avoids Cloudflare delay during design work.

It is a working surface, not KFB Stage and not a PUBLIC_VERIFIED claim.

## Visual state

Positive:
- asymmetry works;
- per-eye 3-axis orientation works;
- frog eyes really move to the sides of the head;
- 3/4-eye fixtures work;
- selected-eye acting works;
- mobile layout remains usable.

Open:
- thick Clay lids become visually rim/wedge-like in extreme frog orientation;
- lower-lid mass still needs human judgment;
- material resolver face > body > main is not yet integrated into v1 cluster;
- real EyeRig Batch actor consumer is not yet mounted.

## Deferred

Hunky/Dory and their eye-stalk/dangle behavior stay behind Studio review. The blank Medium template head remains source-required.

## Stage

Intended route: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/
PUBLIC_VERIFIED: NO.

## Exactly one next gate

EAS1-VIS-1 · use the GPT workbench to judge Eye Cluster + Clay Lid behavior before any Cloudflare publication or Hunky/Dory consumer work.
