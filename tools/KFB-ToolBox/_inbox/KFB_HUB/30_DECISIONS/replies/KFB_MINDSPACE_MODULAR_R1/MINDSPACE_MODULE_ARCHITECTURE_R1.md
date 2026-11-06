# KFB Mindspace · Modular scene / audio / breath / voice / portal interfaces
## Architecture option map, **not a runtime contract** · 2026-10-24

**Status:** DESIGN ONLY; all interface names are suggestions **not verified functions or existing schemas**.  
**Bounded product outcome:** Enable the same user-authored Mindspace experience to run (a) as a personally useful standalone web encounter and (b) eventually as **a POI/instance/inner location** reached from WS1's procedural world. Do not make the procedural Terrain author own breath, music or dialogue systems.
**Ownership:** One authoritative receiving world/scene owner (WS1 current R3F branch at build time), existing KFB Audio for mixed sound, visual H13 owner for authored collage grammar, existing voice transport/dialogue owner where available. Research creates no second SceneState, AudioContext, Quest, Portal, WorldObject, Card, Almanac or persistent knowledge source.

## 1. Capability map (not mandatory modules)

```text
         KFB World / WS1 optional later                   Standalone web earlier
         biome / POI / Genii Loci recipe                  visitor opens source product
                      \                                     /
                       \-- {entranceRef + recipeRef} ------/
                                          |
                                          v
                             [Mindspace Session Shell]
                              one bounded local experience
    ┌───────────────────────┬───────────────────────┬─────────────────────────┐
    │ existing Breath donor │ existing Audio/mixer  │ Visual Composer Adapter │
    │ Lovable code UNPINNED │ soundbed + binaural   │ H13 SOURCE PINNED       │
    │ guides/clock/modes    │ true stereo optional  │ actual image NOT SHOWN  │
    └───────────────────────┴───────────────────────┴─────────────────────────┘
                  │                      │                     │
                  └──────────────────────┴────────┬────────────┘
                                                  │
                             optional Counselor (type / voice)
                             constrained intent not raw rendering
                                                  │
                                                  v
                [local user-controlled pause/exit/reset and optional note]
                                                  │
               +----------------------------------+----------------+
               |                                                   |
          return to web                                      WS1 World Owner
          previous view                                      exact return transform
                                                              optional real Almanac
```

**Core principle:** Mindspace is a bounded **experience/module**, not a second world simulator. It may have **local session progression** for image/audio/breath *within the room* while external player progression/Quest/Inventory stays authoritative in its existing owners.

## 2. The minimal receiving/hosting seam

A future host may supply:

```ts
// PROPOSAL-ONLY pseudotype. Not an existing KFB API.
// Exact prop names and runtime type MUST be reconciled with WS1 / Audio owners.
type MindspaceEntryProposal = {
  experienceRecipeRef: string;       // real asset/recipe registry pin, not invented content
  encounterRef?: string;             // current host POI if game-origin
  returnContext?: unknown;           // opaque host-owned state, never duplicated
  optionalCardRefs?: string[];       // genuine registry refs only
  sessionOptions?: {
    audioEnabled?: boolean;
    voiceEnabled?: boolean;
    breathingGuideEnabled?: boolean;
    reducedMotion?: boolean;
  };
};
type MindspaceCompletionProposal = {
  exitReason: "leave" | "finish" | "interrupt";
  selectedExperienceRef: string;     // what was actually experienced
  userApprovedNote?: string;         // only if explicitly chosen by user
};
// Important: these are EXAMPLES ONLY, not a stable schema or implemented binding.
```

The world must own `enter/exited` transitions, `returnContext`, camera, coordinate transform, host physics/collision and navigation identity. Inside the instance, render/animation timing for its local visuals can belong to the **single active rendering owner**. A separate canvas/H13 2D texture may be rendered by the owner/adapter but must not spin up a parallel active world RAF/physics loop under WS1.

**The actual WS1 terrain/source:** `ws1/terrain-439/WS1_STATUS.md` (read §145 dated 22.10), R3F/Three/Rapier per WFC plan; this is a **source snapshot**, not an authorization to modify those branches.

## 3. Reusable visual boundary: Garden first, Splat optional

**Pocket Garden** is a good first 3D image: one small enclosed reachable region (meshes for floor/plants/seats/stream), an atmospheric backdrop and a visible way out. The enclosing sphere is a **visual conceit**, not a second terrain heightfield.

**Stage 0 – inexpensive/robust:** Static or slowly moving environment, pre-baked lighting, actual 3D walkable mesh inside a separate little zone; H13-style imagery on a validated screen, canopy, distant sky/ceiling or portal surface. One camera/scene owner.

**Stage 1 – refraction / caustic threshold:** Small portal opening or shell uses shader/RTT, distortion/caustic-like highlight, depth mask/parallax or a pre-rendered view. Determine visually which technique makes the **actual source-authentic** room look appealing; no one “correct caustic splat” shader is assumed.

**Stage 2 – authored splat window (optional):** If actual source-isolated, licensed Gaussian splat scene is demonstrably better for a view-dependent exotic environment, use it as **scenic donor** on an isolated layer. Collision/floor/interactions remain meshes owned by WS1/scene. A splat cloud is not a portal shader, a route, or a physics body.

**Stage 3 – Tesseract/Gutter infinity illusion (optional):** Perspective/projection tricks, scene stitching, authored corridor and frame-overlap can imply a larger space inside. Ensure player can orient and leave. This is a narrative/visual metaphor of 4D geometry; do not assert true extra-dimensional math is solved by the renderer.

**Performance and fidelity:** bake and cache expensive graphics once; dynamic objects only where meaningful; near/mid/far view and dormant pocket if outside range; crossfade preload only after measured need; avoid simultaneous active WS1 and Pocket worlds if not required. Performance budgets must be measured in the **actual** user hardware/camera/resolution, not invented in this brief. If a user never enters the scene, it should cost little in world rendering.

**Source isolation:** Before any H13 migration, show **H13 original unmodified authored visual** in isolation. Then compare **calm variant** side by side. The old Collage Engine v0 is a failed candidate; don't resurrect it because it looks vaguely psychedelic.

## 4. Sensory/creative session seam

**Audio owner responsibilities:** existing KFB Audio if game-integrated; only one AudioContext/mixer. Keep soundbed volume ducking during Voice, stereo carrier separation if binaural, mute/pause/exit, no autoplay. In standalone first POC, reuse actual Lovable audio implementation if its code is verified, not another invented audio engine. `Binaural difference` is only the stimulus design variable; `brain state` is not inferred.

**Breathing donor responsibilities:** user chooses flow/timer/style, breathing guide can be disabled. True Lovable code/provenance not yet located in GitHub. Treat app as **USER-REPORTED WORKING**, source required before extracting API or assuming a particular visual style. Prior app could be the product shell once examined; do not mandate rebuilding it as a brand-new host. No mandatory breath pattern or duration.

**Visual responsibilities:** H13 adapter maps `sceneMode`, `paletteIntent`, `motionCharacter`, `motifReferences` and `musicEnvelope` to **curated source-fidelitous** compositing, not arbitrary AI-generated replacement art. Adapt H13's Intro/Verse/Drop grammar to `Arrival / Dwell / Open / Reframe / Return` where meaningful, but preserve free non-linear interruption.

**Counselor responsibilities (optional):** opt-in voice/text, warm thoughtful questions, no claims of actually perceiving user's private inner images. Input may change *bounded visual scene choices*. Avoid treating a Rorschach-like open association as personality diagnosis or official clinical Rorschach test. Silence is a valid answer; counselor may stay off. Voice transport through appropriate real session backend, not presumed native just because a Site is published. Never create an independent KFB ChatterBox owner; specialist audio/voice distinctions held apart.

**Session rhythm proposal:** 
`Approach → breathe/observe (optional) → image/music fragment → user describes or notices → visual relation changes → optional artwork/note → exit`.
The user may skip *any* non-spatial phase. The application should enable non-verbal, undirected use because an intrusive „meditation instructor“ would spoil some of the aesthetic.

## 5. Mindspace World placement as a source-backed Genii-Loci POI

**Authored locality first:** a Mindspace entrance is an authored `POI/scene recipe` with allowed contexts, entry/return, soundscape/visual theme, narrative affordance and explicit source ID. It is NOT `WFC rolls surreal garden into every biome`.

**World-owned questions:**
- Which biomes and residents can plausibly host the place: forest alcove, greenhouse, island observatory, Gothic arch, Academy artifact, Cave/Gutter crack?
- Can player approach/leave? Is there ground/surface truth near entrance, safe enough camera and navigation before/after transition, and meaningful discovery?
- If hidden in water, does the player SEE a distinct world from the banks before stepping in? `Drive-by/drive-over first` remains an acceptable visual proof in the prior Splat Masterplan; don't require instant physical transition.
- For world growth, composition may choose Mindspace as rare `content module`, but **continuous terrain owns the macro-height/collision support**, WFC (if any) is only local arrangement constraint.
- If a Mindspace is attached to an actual KFB card, **existing Card/Deck/Almanac** owns provenance and memory. Pocket-room exit is not a new quest win or consciousness-level promotion.

**World lifecycle proposal:**
```text
WORLD ACTIVE → encounter/proximity (cheap shell) → source-backed enter action
 → confirm entry & host return coordinates → prepare small pocket content
 → hide/suspend unnecessary exterior expensive effects (host choice)
 → immersive local visuals + audio + optional breathing/counselor
 → LEAVE/ESC → release/hibernate pocket → host returns camera/player
 → external world remains exactly authoritative
```

**Alternative architecture options (not yet decided):**
A. Single THREE/R3F scene + portal/room mask, if rendering/camera costs permit.
B. Separate pocket-scene instance loaded under the **same** game owner and same renderer, with state handoff.
C. Visually seamless baked video/2.5D prelude plus conventional interactive local mesh, useful on weaker devices.
D. Actual licensed splat portal only if its output demonstrably matters.
**No technical candidate is mandatory before source/visual proof.**

## 6. Verification model for first receiving implementation

| Check | Evidence required | Claim that CANNOT pass without it |
|---|---|---|
| Lovable app donor | source export or runnable original, screen/feature list, audio/breath control/ownership | existing breathing component integrated |
| H13 donor | live source-isolated image/short video showing actual original H13 with source asset refs | actual HyperNormalisation visual style reused |
| Standalone composition | in-browser user can enter, run sound silent/off, change mood, pause/leave, repeat same seed; visible screenshot + UI | personal Mindspace accessible |
| Audio technical | original mixer source and L/R channels validated, mute/pause and level, no duplicate context | binaural/soundbed functioning |
| Voice | microphone consent and text fallback, real roundtrip, video/visual change only via allowed intents, audio ducking | Counselor actually converses |
| Pocket world | entry in current terrain scene, camera/physics same owner, exact return state, frame/memory comparison | walkable KFB Mini-Dreamscape |
| Performance | desktop/mobile actual fps, GPU/time/memory/initial load, off-screen dormancy | cheap enough for procedural host |
| Visual human acceptance | Georg sees true garden/vision scene and approves aesthetic | intended look accepted |

**No proof has been executed by this R1.**

## 7. No second runtime owner / no premature Stage

- No new **global Mindspace Manager** with own world coordinates, main renderer, physics or Quest state.
- No fresh **Hypernormalisation Engine v2** that silently discards H13, no copy of its failed v0 random collage.
- No independent second **KFB Audio** mixer, separate full-duplex ChatterBox owner or secret speech-state logger.
- No new dedicated GPT Site until an explicit product selection proves no existing owner Site can host the experience. GPT Sites first if Site-capable; no Cloudflare route unless formally required. This document makes **no publication request**.
- The first operational gate is **authentic visual/source isolation of Lovable app and H13**, then a deliberately small existing-owner preview. World integration is **later and optional**, not a blocker for personally useful standalone creative space.

**Single next gate for WS0:** Inventory/preview the real **Lovable breathing-app source** and **H13 output in isolation** and confirm receiving product/Audio owner. WS1 consumes the resulting lightweight Mindspace entry/exit brief **after** that proof, not before.
