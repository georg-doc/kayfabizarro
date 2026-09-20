# KFB Cologne Race · Option C · Stage and modular web-chat plan

Status: Stage candidate. Do not promote to Live without Georg's visual/freeplay gate.

## Outcome

Keep one playable Cologne race candidate at:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`

The stage is intentionally a thin public runtime, not a second Race repository and not a copy of the 145 MB Claude Design archive.

## Current changes to review

- CHASE camera is tethered to the current route corridor before the OSM occlusion check. The tunnel gets a narrower lateral corridor and a ceiling clamp.
- Only explicit `STRUCTURE` segments receive supports. Supports move outside the drive band and carry `kfbRole=structure-support` for inspection.
- Center dashes are yellow; outer lines are orange-yellow. The two ambiguous inner lane bands are removed.
- Three measured Option-C palette families are selected by a per-start seed. `?seed=` and `?palette=` make the result repeatable.
- The Doku icon opens compact inline onboarding plus color-map import/export. It is closed by default.

## Claude Design after reset

Open the Stage and its `ONBOARDING.md`. Take exactly one mini-sprint. First show the existing source object or behavior in isolation; then change one seam. Do not rebuild the scene, replace the Race controller, add generic HUD chrome, copy SP13KTRA code, or recolor individual meshes outside the color-map roles.

Good design-only work:

- compare three screenshots of the same seed and propose role-level palette adjustments;
- mark the exact camera failure frame and its route/tunnel context;
- inspect named `structure-support` objects and propose one measured clearance;
- storyboard one NPC Donut-Drive vehicle without race rules;
- map one existing Vehicle Lab animation to one existing vehicle state.

## Fresh external chat

Copy this:

> Work on exactly one KFB Cologne Option C mini-sprint. Read the current GitHub chat workflow, the Stage ONBOARDING and Return first. GitHub state overrides this prompt. Reuse the existing Race, OSM, TinySkies/Travel, HUD, audio and palette owners. Do not create placeholders, generic UI, replacement branding, a second controller or a second color system. Publish only to the fixed Cologne Option C Stage route, update Return/test evidence/additive changelog, and stop at one human gate. If GitHub times out, inspect the exact branch head before retrying.

## Integration order

1. Human camera/tunnel and support-clearance gate.
2. Color-map seed/import/export gate.
3. Vehicle Lab animation adapter for one vehicle.
4. Existing weather/time/audio adapter.
5. One non-player route follower with Donut-Drive VFX/SFX, no race logic.
6. Only then integrate accepted pieces into the main Race candidate.
