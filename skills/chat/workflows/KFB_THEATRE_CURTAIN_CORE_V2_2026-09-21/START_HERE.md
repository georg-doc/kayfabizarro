# KFB Theatre Curtain Core v2 · transition module briefing

Status: **READY BRIEF · V1 PUBLIC VERIFIED · CONSUMER INTEGRATION NOT YET ACCEPTED**  
Owner: KFB Game Dev Studio for curtain simulation and presentation.  
Donor branch: `chat/gds-theatre-curtain-v1-2026-09-20` · Draft PR #114.  
Public v1 proof: `https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/`

## Proven foundation

The existing v1 is the mandatory donor. It already provides two cloth panels, rail/rings, CPU Verlet/WebGL simulation, structural/shear/bend constraints, weighted hem, deterministic idle wind, physical opening/closing, impulse, reset, four real KFB fabric sets and the API `mount / update / setState / impulse / reset / dispose`.

Evidence: **22/22 local + 25/25 public browser PASS** at tested head `3bdfdd2e9de648871102d91c89612a5b7ee3c4ab`. Do not rebuild it as CSS, SVG, a video, a flat plane or a second cloth engine.

## Goal

Turn the accepted v1 mechanism into a small reusable transition layer for:

- cutscene entry/exit;
- loading and streaming cover;
- Race countdown/reveal;
- Travel world/portal transition;
- Combat Arena encounter/raid entry and result reveal;
- Dungeon/minigame instance entry;
- Storytelling card/map reveal later through a separate effect adapter.

## Core contract

The consumer owns renderer, camera, gameplay pause/resume, loading promise, audio, route/instance state and save state. Curtain Core owns only curtain meshes/materials/simulation and its transition state.

Proposed host API:

```js
const curtain = mountCurtain({ THREE, scene, camera, fabric, preset });
await curtain.cover({ reason, text, progress });
curtain.setProgress(0.0);       // host loading progress, optional
await curtain.reveal({ reason });
curtain.impulse({ x, y, strength });
curtain.setText({ kicker, title, detail });
curtain.dispose();
```

The module must not create a renderer, game loop, global audio context, router or persistence store.

## Textures and animation expansion

Keep the four exact v1 fabric sets. Add only source-backed, swappable presets:

- `neutral-load` — calm closed cover, minimal wind;
- `race-start` — faster gather with restrained impact accent;
- `travel-portal` — slower breathing cloth and optional world-colored light;
- `combat-raid` — heavier close, short hit/recoil, no generic HUD chrome;
- `story-card` — later adapter for card/ripple/dissolve; not part of the first consumer proof.

Text is optional, minimal and host-provided. One kicker, one title, one short detail/progress line. No explanatory panel, fake brand, loading spinner or giant button. Every letter and pixel pays rent.

## First implementation slice · CTV2-A

1. Preserve the v1 runtime byte-for-byte until its visual gate is recorded.
2. Wrap it with the host-owned loading/cutscene contract above.
3. Add deterministic `cover → covered → reveal → idle/disposed` state events.
4. Add optional accessible reduced-motion behavior without replacing the cloth look.
5. Prove the same module in two tiny host adapters only:
   - one neutral loading host;
   - one existing KFB consumer shell, preferably Travel **or** Race, selected by the WSA lock.
6. Consumer adapter may pause/resume its own runtime; Curtain Core may not reach into consumer internals.

## Later bounded slices

- CTV2-B: Race start/countdown timing and audio cue adapter.
- CTV2-C: Travel portal/instance transition with state-preserving return.
- CTV2-D: Combat raid intro/outro adapter.
- CTV2-E: card breach/ripple/dissolve research using existing Card/Fluid/Beam donors.

Do not run these in parallel against shared consumer files.

## Acceptance

- existing v1 visual/physics gate remains explicit;
- no regressions in v1 tests;
- two host adapters use the same module API;
- cover/reveal events are deterministic;
- loading failure can keep the curtain closed and show one host message;
- reduced motion works;
- zero consumer renderer/camera/gameplay ownership moved into Curtain Core;
- direct Cloudflare Stage linked from ToolBox and Hub;
- Georg judges timing, text density, fabric and whether transitions feel KFB rather than generic.

No Live consumer rollout until one adapter is human accepted.
