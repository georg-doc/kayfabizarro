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


---

## R1.1 · Georg addendum 15.10.2026: Herriman, Sterrett and playable pop-up standees
**GEORG CREATIVE DIRECTION / RESEARCH-BACKED PROPOSAL — NOT AN IMPLEMENTED FEATURE, WS0 V-NUMBER OR PREAPPROVED WS1 SCOPE.** This extends the *same* WS0 lighting/metatheatre pilot and does not create an independent graphics engine.

### Two precise comics references
1. **George Herriman — `Krazy Kat`** (Sunday pages from 1916). The SCHIRN Kunsthalle research source explicitly documents changing landscapes and props, even day→night, from panel to panel during *continuous foreground action*. The characters need not treat the change as an exception or stop the story. Source: https://www.schirn.de/wp-content/uploads/2025/01/04_Schirn_Press_Comic_Wall_Panels.pdf . Additional visual/archive reference: https://www.loc.gov/pictures/item/2016684821/ . KFB translation: **WORLD-BACKDROP CHANGE AS NORMAL FICTION** — narrative or Card/biome trigger can swap light/sky/scenic planes or painted silhouettes on a chosen beat while the same performers, card, props, physical world coordinates and gameplay timeline continue. The change may be abrupt like a panel boundary; a dissolve is optional, NOT a forced fade. Do not automatically script startled NPC reactions or self-referential dialogue.
2. **Cliff Sterrett — `Polly and Her Pals`** (Polly, **Paw**/Sam'l Perkins, family; commonly misheard as “Polly und Herr Pells”). His best-known 1920s–1930s Sunday strips integrated fractured Cubist/modernist architecture, animated visual geometry and surreal stage-like rooms around everyday domestic situations. The US Library of Congress explicitly documents the Cubist influence and 1920s shift: https://www.loc.gov/exhibitions/comic-art/about-this-exhibition/early-years-1890s-to-1920s/cubist-influence-on-comic-art/ ; Schirn analysis: https://www.schirn.de/en/schirnmag/schirn-comic-cliff-sterret-polly-context-en/ ; Syracuse archive: https://library.syracuse.edu/digital/guides/s/sterrett_c.htm . KFB translation: **WORLD FORM FLEX** — let façades, stair-space, painted windows, stage flats and receding panels transform by bounded hinges, shear/perspective and swaps while body rigs/card identity and physical traversal remain stable. The room can change without turning it into a portal or a technical glitch.

Historical accuracy: Sterrett's mature compositions relate to avant-garde Cubism and Surrealism, but **do not claim he chronologically preceded Picasso's Cubism** (Picasso/Cubism was established earlier). Also do not treat original panel scans as automatically license-free game art; research/reference is not clearance for redistribution. Recreate methods using owned KFB source, never silently import copyrighted page imagery.

### KFB executable design direction: POP-UP STANDEE as a first-class SCENIC PROP, not a new model class
A `pop-up standee` is an **authorable stage asset** in the existing Asset Librarian/WS1 scene workflow:
- **Source:** authentic user-provided/registered 2D Card art, source cutout illustration, paper/façade texture, BoardGame Bits model, or original approved property. Same source ID and stable instance ID; no fake generated asset to fill the gap.
- **Physical assembly:** foreground inked or painted raster/SVG on a finite plane, optional irregular cut silhouette, thin visible paper/cardboard edge, backing/brace/hinge and world-space pivot; supports `stand-up`, `fold`, `flip`, `slide`, `tilt` or intentionally impossible paper perspective as pre-authored presentation transforms. A fully volumetric Meshy GLB is **not required** for this class.
- **Layering:** 2–4 authored depth planes can form a proper pop-up/book-theatre scene under real perspective. Distinguish immutable printed texture from geometry and avoid billboard-facing-camera behavior when a physically propped object is intended. Optional backside deliberately exposes cut paper/stage braces from free StageOrbitCam.
- **Lighting:** receive the SAME WS1 host day/dusk/night, V-305 role palette and real soft ground/contact shadows as the 3D diorama. Graphic printed shading can coexist with dynamic shadows but must not be falsely treated as a movable shadow. Matte, paper/filz/cork/clay microstructure is appropriate; do not over-light to plastic. Source Card print remains literal, full and uncropped under BILLBOARD_STANDARD_R2, not used as a replaceable texture for a fake Card.
- **Interactivity:** the stage/World owner decides true collision/support, raycast/select, trigger or purely decorative. A 2D flat has no magical 3D support by default. The God-Mode object transforms, serialization and existing camera controls remain canonical; do not create another editor, stage graph or physics writer.
- **Surreal objects:** real BoardGame Bits, dominoes, chess figures, landmark fragments, anomalous “cat in beer glass” (reported by Georg, **source ID currently unknown**) can be juxtaposed and scaled intentionally with a shared shadow/contact anchor and response logic. **The characters often simply accept the impossible as ordinary**; do not impose mandatory dialogue about the visual mismatch or repetitive fourth-wall jokes.

### Storyboard tests to translate comic grammar to real-time without disrupting MVP
**A — Herriman continuity:** the real duo continues its same 3-beat Card/ChatterBox performance and animation seek(t). At the beat boundary, a backstage skyline changes from day to moonlight or paper mountain to another source-authored shape. Props/background and single owned global host lighting switch consistently; actor state, current Card identity, dialogue and walkable contacts do **not** reset. No mandatory commentary; abrupt cut allowed. Render both before/after frames.
**B — Sterrett perspective:** start on a real foreground actor, Card and one paper doorway. A three-layer façade unfolds/leans as the existing camera circles ±60°, exposing bounded side-edge, hinge and back struts. Eyelines/card readability and 16:9/9:16 safe framing remain valid; contact shadows are real while painted graphic shadows remain intentionally static artwork.
**C — Surreal found-object:** one exact source-owned incongruous prop (a real game token/chess piece or Georg's eventual cat-in-glass if the original is pinned) is placed as a meaningful part of the scene. Compare without vs with under the same day/night preset, no random scatter or replacement donor. Resident interaction is plausible and authored, including a deadpan lack of reaction.

### Owner and cost gates
- Existing **WS1 R3F host** remains exclusive Scene/Camera/Light/Clock writer, real Card and bubble remain unchanged; reuse current `StageOrbitCam`, source-accurate Meshy `*.slot.json`, existing 2D Studio cutout-plane proof, KFB StoryMap pop-up concepts and Card Motion R2 *as donors only*.
- One short WS0-approved staged source test before broadening: original sources isolated → actual 3D/2.5D composite screenshot → timed background swap with actor/dialogue continuity → orbital back-view and portrait/landscape QA → light/contact/frame-cost measurement. Diff/smoke testing per V-312, not a new 280k-token critic loop.
- **No new mandatory MVP feature or extra blocking human approval.** The historical and visual findings are a response to Georg's concept idea, not proof that WS1 implemented them.

**Single next gate remains `WS0_LIGHTING_AND_METATHEATRE_SLICE_ASSIGNMENT`**, now with Herriman/Sterrett comic-world continuity and a source-backed playable pop-up standee as optional pilot ingredients. WS0 chooses exactly one donor and scheduling inside the existing issue #404 work, assigns a V-number only if it decides to canonize the direction.


---

## Global Intent companion · Georg 15.10.2026 · Role-conscious residents
The stage's falseness and the actor's capacity to **knowingly enact or question a character mask** are one narrative design, not two separate effects. Source-backed global statement and existing KFB reuse map:
\`replies/WS0_GLOBAL_INTENT_ROLE_CONSCIOUS_RESIDENTS_R1_2026-10-15.md\`.
Current global reference pointer on this WS0 branch:
\`skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md\` (additive intent; old text preserved).

A comic backdrop shift can reframe the same Resident's social duty, tragicomic habit and relationship without resetting Card, actor identity, memory or scripted beat. An NPC who knowingly continues a role should not automatically become a breaking-the-fourth-wall joke or self-help narrator. **Production criterion:** source-correct character keeps acting; stage/neighbor/Card changes the audience's understanding; any counter-role choice remains authored, optional and consequential.

**Single next gate unchanged:** \`WS0_LIGHTING_AND_METATHEATRE_SLICE_ASSIGNMENT\`. WS0 owns whether any role-aware example is useful in the selected current pilot and does not thereby open a second Resident runtime milestone.
