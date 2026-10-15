# WS0 concept intake · KFB Metatheatre / Pop-Up / Cut-Up Diorama R1
Date: 2026-10-15 · Status: GEORG CREATIVE INTENT + RESEARCH PROPOSAL, not a WS0 decision/V-number, no runtime.
Companion: existing WS0 lighting intake [Issue #404](https://github.com/georg-doc/kayfabizarro/issues/404).
Owner: WS0 steering; actual scene and lighting construction remains with the single WS1 R3F host on `ws1/r3f-frame`.

## Core idea
KFB can deliberately combine a sourced clay/Meshy diorama, complete original KFB Card, KKit/KayKit performers, paper/cork/wooden facades, BoardGame Bits, miniature cities, painted shadows, cut-up collages and bizarre but authored props. A Western town can be a real playable front facade with plainly visible supporting braces behind it. A character can behave naturally in an absurd set, allowing viewers to complete the fiction despite visible mismatched materials and production methods.

**Coherence is governed by staged relations, one light/palette response, physical contact, camera behavior, real Card readability and meaningful cast reactions — not identical meshes or uniform asset style.** Mismatching is allowed when intentional and motivated by scene/story, not random substitute assets. Revealing a support frame or fake background can be an authored Brechtian moment, not an accidental missing world.

## Research anchors — distinct traditions
- **Das Cabinet des Dr. Caligari (1920)**: Hermann Warm, Walter Reimann and Walter Röhrig combined warped painted scenery, painted shadows and theatrical performers. [Deutsche Kinemathek](https://www.deutsche-kinemathek.de/en/visit/exhibitions/be-caligari-virtual-cabinet); [Oxford](https://academic.oup.com/mq/article-abstract/88/1/63/1078102). KFB technique: layered painted shadow-cards plus real contact shadow.
- **Fritz Lang: Metropolis (1927)**: designed model city, monumental set pieces and Schüfftan compositing gave apparent architectural scale. [BFI](https://www.bfi.org.uk/film/bda6ff8a-ed7e-5942-980d-c2910c0120ec/metropolis); [Cineteca Bologna](https://cinetecadibologna.it/distribuzione/film/metropolis/). KFB technique: real close-up scenery plus forced-perspective miniatures, skyline flat planes and shaped light beams.
- **Bela Lugosi: Dracula (1931)**: early *sound* cinema, Gothic theatrical staging, not literally a silent Bauhaus set. [BFI](https://www.bfi.org.uk/features/where-begin-universal-horror-cycle). KFB technique: arch, staircase, entrance silhouette and a single dominating practical light.
- **Brecht epic theatre**: visible machinery, exposed sets and theatrical convention; historically distinct from those films. [UNT Brecht theatre excerpt](https://digital.library.unt.edu/ark:/67531/metadc331941/m1/121/ocr/). KFB technique: optionally turn the scene outward and reveal painted flats, cardboard hinges, ropes and braces.
- **Multiplane animation**: independently spaced layers create parallax without all elements being volumetric. [Disney D23](https://d23.com/a-to-z/multiplane-camera/). KFB technique: source-backed 2.5D foreground wing, side flats and rear painted panorama in one scene.

Do not collapse Bauhaus, Expressionism, Gothic Dracula and Brecht into one purported movement. Reuse construction principles, not historical branding.

## A stage grammar for the existing WS1 scene (proposal, not new schema)
1. **PLAYABLE_3D:** genuine Meshy/clay stage, actor floor, steps and collisions where approved.
2. **NEAR_THEATRE:** proscenium, real curtain wings, storefront facade, window and prop practical lights; real local shadow and contact.
3. **POPUP_2_5D:** two to four shallow, spatially separated scenic flats/cutouts, printed shadows and paper hinges; test parallax and intentional side/back appearance.
4. **DISTANT_SCENERY:** small source-built city silhouettes/miniatures, atmospheric horizon, perhaps one active sky shell.
5. **CARD_PERFORMANCE:** responsive Clay01 r2 plain billboard, exact full landscape quarter Card, projected existing ChatterBox plain bubble and existing characters; do not modify print pixels.
6. **META_REVEAL:** an authored camera/event transition shows rear braces, projection equipment or a theatrical construction; not automatic in every encounter.

These are *presentation roles*, not six cameras, six renderers, separate light writers or mandatory asset classes. The R3F host and StageOrbitCam retain exclusive camera/scene ownership. Full orbit is supported by intentional backside construction or authored reveal; a flat plane that disappears from the side is a bug unless deliberately staged.

## Real KFB donors to inspect in isolation
- Current SSOT: `ARCHITECTURE_R1.md` (V-228), `DECISIONS.md`, `replies/BILLBOARD_STANDARD_R2.md`, `replies/WS0_TO_WS1.md`, `WS1_STATUS.md` §§40–42 on branch `ws1/r3f-frame`.
- `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js`: V-305 single approved palette; stable card/story/biome seed and role colors. V-286 Meshy source texture receives only 18% tint. Do not fabricate new palette owner.
- `replies/WSA_LIGHT_STUDY_C_R1.md` and `replies/light-presets.json`: already measured J17 Day, KayKit Creator, Quaternius, current Lab rig; E50 evening stays **unapproved comparison estimate**. Avoid repeating research.
- KFB Clay Stage + Curtain R2 `HANDOVER.md`: `clay-look.js` and original physical curtain as bounded donor after source isolation. Its `curtain/host.js` and billboard `stage.js` are demo-only; never mount their extra renderer/camera/lights into WS1.
- KFB StoryMap SMA1 `START_HERE.md`: flat/table/flyover/pop-up and stand-up/slide/flip motion ideas; water visibility bug OPEN, not a visually approved runtime donor.
- `tools/2D Animation Studio/shared/renderers/three2p5d/cutout-svg-plane-stack.v0.1.js`: existing transparent source-SVG texture-plane helper, **prototype**, not proof of accepted KFB stage.
- CardStack v1 original card reveal/pose and Draft PR #402 interactive motion recipes are source/method references; R2 motion research is NOT an integrated game runtime and must not alter deck order.
- WS0 original Meshy scene GLBs plus `*.slot.json`: Bank, Prison, Library, UFO, Atlantis, Utopia, Arcade, Verdant Ruins, Alien Workshop. Source objects and slot/scale must be shown **in isolation** before integration; current multi-stage rollout stays after MVP-0 unless WS0 changes it. The suggested cat-in-beer-glass remains user-described until an exact asset is identified.

## Lighting as unifier
One real host rig: warm/cool key + hemi/fill, shadow contact, fog and sky. A few budgeted **motivated practicals** (torch, saloon window, arcade sign, spaceship screen, glowing planet), emissive fixtures and intentional painted shadow surfaces. Emission alone does not throw light on neighboring meshes. Same V-305 role palette carries through backdrop/prop/window hue; never apply a full-scene glow that destroys matte clay relief, faces or original Card readability. Backs of flats and stage mechanics can remain intentionally visible under the same lights.

## Bounded next proof requested to WS0
Within Issue #404's **same existing two-performer Card/Billboard light comparison**, test exactly one **authentic layered scenic flat or physical curtain/false facade**:
- G0 original source objects isolated (Card, performers, Billboard, stage, scenic donor).
- G1 a single source-first adapter proposal, no new global light/camera or world/state owner.
- G2 fixed front, ±60° orbit and side/back shots at 16:9 and 9:16; daylight and one story-night; authentic printed card, eyes/bubble and foot contact must remain legible.
- G3 real browser/source screenshot showing depth/parallax and, when intentionally activated, backstage supports; check alpha edges/z-fighting, scene geometry vs collision and measured light/shadow draw-cost.
- G4 short diff and existing smoke tests per V-312, not another full-code critic round. A concept diagram, loaded model URL or successful asset fetch does not establish visual PASS.

Do not automatically make all locations paper facades or start a new 2.5D engine. No extra human gate until there is a genuine WS1 render to judge.

**Exactly one next gate: WS0_LIGHTING_AND_METATHEATRE_SLICE_ASSIGNMENT.** WS0 registers/assigns this as a proposed extension to Issue #404, chooses one source-backed pilot and milestone, grants any V-number in its canonical decision ledger, and instructs WS1 only after reconciling the current MVP/M2 sequence. No new deployment, runtime or merge by this research chat.
