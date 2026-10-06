# Claude Design · KFB UFO Tractor Beam Event Lab · Brief · 2026-10-06

Status: **READY BRIEF · DO NOT START UNTIL GEORG CHOOSES TIMING**
Executor: **Claude Design**
Execution mode: **BOUNDED_SLICE**
Outcome: **isolated UFO / Tractor Beam / Dematerialization visual-audio proof**
Owner: **KFB World Event Presentation**
Protected product: **Open World #360 · Claude Coworker remains runtime writer**

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md`
3. `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md`
4. `skills/kfb-cartoon-animation/references/77-kfb-ink-text-placement.md`

Do not search for another planning branch.
This brief lives on `main`.

## Primary source donors

Registry:
`registry/assets/v1/packs/kenney-tower-defense-kit.json`

Pinned asset commit:
`378b209355b13304e3cff656ec0806ca5b89df28`

Compare in isolation:
- `enemy-ufo-a.glb`
- `enemy-ufo-b.glb`
- `enemy-ufo-c.glb`
- `enemy-ufo-d.glb`

Also inspect:
- `enemy-ufo-beam.glb`
- `enemy-ufo-beam-burst.glb`

Exact root:
`media/3D_Assets/kenney_tower-defense-kit/Models/GLB format/`

Show the actual UFO source objects in isolation before integrating them.

## V1 target

Do not show Hunky/Dory themselves yet.

Build one isolated event-lab scene that can run:

```
ARRIVE
→ HOVER
→ TARGET LOCK
→ BEAM CHARGE
→ DEMATERIALIZE
→ SUCTION / TRANSFER
→ COMPLETE
→ optional RETURN / DROP
→ DEPART
```

Target-size presets:
1. small prop;
2. Resident/Cube-Pet-sized proxy;
3. castle-sized proxy.

The same event grammar must handle all three.

## Visual target

- unmistakable playful saucer/UFO;
- readable hover;
- beam cone/volume with width driven by target bounds;
- Kenney beam mesh may be used as donor, not mandatory final look;
- controlled shader glow/opacity/Fresnel;
- no generic neon sci-fi UI;
- KFB clay/cartoon feeling;
- object visibly breaks into clay-like particles/chunks;
- particles/chunks move directionally into UFO;
- beam narrows toward craft;
- return reverses/reassembles or drops the object;
- giant castle into small craft must read as intentional cartoon impossibility.

Use stable seeds/controlled variation.
No per-frame random flicker.

## Portal / transition grammar

Georg has identified useful Etherington portal-transition references.

Until exact source is pinned:
- do not claim a specific tutorial as source;
- use only the general functional target:
  silhouette breakup, transition rim, directional transfer, readable material disappearance.

If exact source becomes available during the job, isolate/show it before adaptation.

## Audio

Read:
`skills/chat/UFO_EVENT_AUDIO_DONOR_SHORTLIST_2026-10-06.md`

Audition existing files first.
Candidate families:
- phaseJump;
- phaserUp / phaserDown;
- spaceTrash;
- zap;
- whoosh;
- white noise;
- hydraulic;
- air burst;
- wobble.

Return a small event map:
- arrive;
- hover;
- charge;
- lock;
- transfer start;
- transfer loop;
- complete;
- drop/return;
- depart.

Do not create a second AudioContext/mixer architecture.
For this isolated proof, simple preview playback is allowed; runtime integration must later hand semantic hooks to the KFB Audio owner.

## Future module context · do not implement in V1

The tractor-beam proof is intended to become the first member of a broader reusable Beam family:

- **Transfer / Tractor Beam** — abduct, dematerialize, return/drop;
- **Destruction Beam** — later consumes the canonical destruction mechanics/VFX, especially useful donor patterns from `KFB Seed World Mech Destruction POC 01`, for props/buildings/blocks with explosion + clay debris/dust;
- **Terraform / Creation Beam** — later uses the clay build/rebuild grammar to assemble absurd props, buildings or structures.

For this V1:
- implement only Transfer/Tractor behavior;
- keep beam width/target-bounds, particle/chunk presentation and event timing modular;
- do not hard-code assumptions that every beam result is "hidden";
- do not add destruction state, rebuilding state or terraforming now;
- no standalone destruction engine.

## Protected boundaries

- no Open World runtime edits;
- no PR #348 writes;
- no persistence implementation;
- no WorldBuilder/editor work;
- no Resident scheduler;
- no ChatterBox Site work;
- no Blender MCP invocation;
- no Hunky/Dory full-character integration;
- no replacement branding/generic sci-fi HUD.

## Return

Provide:
1. exact chosen UFO source + pin;
2. rejected/alternate UFO comparison;
3. beam donor use;
4. visual sequence and parameters;
5. small/medium/huge target proof;
6. audio shortlist + chosen event mapping;
7. screenshots/video or equivalent visible proof;
8. files changed;
9. unresolved items;
10. one next gate.

No merge. No Live promotion. No Open World integration.
