> **2026-09-18 STATUS OVERRIDE:** This Birthday Startscreen / Travel handoff is **FAIL / OUTDATED / ARCHIVED HISTORY** and must not be executed. Retain it only for provenance and generic donor facts. Current Travel work follows the Ground=8 recovery and Atlas Pilot 01; current ToolBox work follows Stage-First v1 intake/promotion.

# KFB Town · Post-r022 · Birthday Startscreen / Travel Handoff

**Date:** 2026-09-15  
**Status:** ADDITIVE DESIGN DIRECTION + PROPOSALS. No runtime implementation or browser test.  
**Consumer:** Travel Globe planning / Astra slice preparation, Town Workbench, ToolBox/Animation Lab.  
**Base:** public Town S001 r022 plus post-r022 archetype, Birthday Radio, lighting and soundscape notes.

## 1 · Purpose

Use the Elisa / Novacyy 18th-birthday one-shot as a compact **KFB Town look, interaction, audio and actor calibration scene** rather than a disposable greeting screen. The birthday remains the immediate purpose; reusable modules are a by-product.

The existing `Rollercoaster Ride v9` pet-select screen is a user-identified interaction/staging donor. Exact source pin still needs to be recovered before implementation. Do not rebuild it from the screenshot alone.

## 2 · Opening composition

### 2.1 · Curtain threshold

Opening image: old dark-red theatre-velvet curtain with wear, holes/burn marks only where they read at camera distance. A large floating/pulsing D6-like **18** is the focal object. A large 3D arrow first reads `Enter`; after a short delay a second cue `Click` may appear.

On click/tap, the curtain opens and reveals the player-select sunset scene. The Three.js WebGPU compute-cloth example is a **technical donor candidate**, not an accepted implementation. Desired motion is lighter and more wind-driven than a heavy stage curtain, tied to beach wind/wave ambience.

The curtain can also serve a practical loading role: world/actor assets may prepare behind the closed curtain, but loading behavior must remain honest and recoverable if assets are not ready.

### 2.2 · Player selection

Replace the many-small-pets wheel presentation with two large skewed-perspective hero slots plus one smaller inactive slot:

- **FrizzleBob**: Herald / Carny Host / selectable actor.
- **Novacyy**: Elisa's Goth Girl player actor.
- **Hihi**: Cube-Pet kitten identity associated with Nadia, `Coming Soon...` for this slice.

The visual reference direction is 1990s hand-built cartoon staging: skewed boxes, asymmetric perspective, strong silhouettes, physical-looking geometry. References named by Georg include 1990s Nickelodeon staging, Invader Zim, Rocko's Modern Life, Rick and Morty, and Wallace & Gromit. These are staging/material references, not assets or styles to copy literally.

FrizzleBob briefly congratulates Elisa on her 18th birthday. Clown balloons can cross the scene. Keep the speech budget: one focused bubble normal, two soft maximum; billboards/media do not consume that budget unless they open actual NPC speech.

## 3 · Background world

The revealed scene uses **natural Travel terrain**, not the discarded cutting-mat framing:

- KFB Town / skyline silhouette;
- painterly sunset and chilled sundowner mood;
- subtle animated Tiny-Skies-derived skydome donor, exact accepted source pin required;
- water / beach;
- three different KayKit palms arranged by Rule of Three;
- the **actual Tiny Skies lighthouse donor**, if reuse is contractually/source-wise valid; do not substitute the previously criticized cheap KFB reconstruction;
- visible lighthouse beam as a scene light/VFX element.

This scene is a candidate for the shared World Color & Lighting Cohesion calibration: KayKit actor, KFB rig, vegetation, water, cloth, metal, particles and emissive/media elements appear together under one world-light logic.

## 4 · Physical KFB typography

### 4.1 · Kayfa / Bizarro wordmark

Use Irish Grover as the established KFB display family. Build `Kayfa` and `Bizarro` as two separate physical objects:

- `Kayfa`: extruded 3D letters;
- `Bizarro`: lettering associated with an old stamped/painted metal plate in worn KFB red.

Both float/hang as if suspended by invisible theatre wires and move subtly with wind/contact. Do not introduce a second loud display font.

### 4.2 · Letter-chain module

The multi-colour word/letter chain becomes a reusable **physical typography toy**. Each Irish-Grover letter/block has its own body, size and suspension. Invisible strings create a loose Newton-cradle-like chain. Clicking/dragging one letter can transfer impulse into neighbouring letters and the system settles back.

Potential later consumers: Town signage, shop names, Jumbotron labels, Roadside Media and other KFB title treatments. This is a module proposal, not a new global typography owner.

## 5 · World-as-toy interactions

Most major foreground 3D objects should be pickable and give a small physical/cartoon response. The response need not be a joke.

Examples:

- letter block swings/collides;
- disco ball receives a small spin impulse;
- balloon can be nudged;
- palm bends and settles;
- character-selection box tips/leans and returns;
- EyeRig speaker looks toward cursor/active actor;
- lighthouse may offer a bounded interaction if the real donor permits it.

**Rule:** touch produces material/physical acknowledgement. Only selected objects carry authored Lulls. Avoid generic Object Acting and avoid attaching a punchline to every prop.

## 6 · Music, light and dance

### 6.1 · Birthday Radio

Use the already imported six-track VOLE CC0 Birthday Radio package as a separate presentation component. It does not define the future permanent six-style KFB D6 music set.

### 6.2 · EyeRig speaker

A visible speaker uses the existing EyeRig as an early expressive-prop test. Audio ownership remains with the consuming scene. Speech ducking follows the separate World Audio & Soundscape Cohesion TBD.

### 6.3 · Three disco balls

Three disco balls hang on invisible strings in an asymmetric Rule-of-Three composition: dominant, medium, small/deeper. Slow base rotation; music may modulate rotation or light response. Use controlled reflection/light-cookie/VFX solutions before expensive literal multi-bounce reflections.

They may catch lighthouse beam and restrained coloured stage-light VFX. Disco feeling stays subtle in the idle state.

### 6.4 · Fireworks

Particle/bloom fireworks are a music-reactive **event**, not continuous wallpaper. Suggested hierarchy: small beat sparks, larger phrase/bar events, full burst on selected birthday/section moments. Bloom should remain selective so matte KayKit/KFB surfaces do not become globally glossy.

### 6.5 · Default dance donor set

Animation Lab / ToolBox candidate: first reusable KayKit dance set with a small common vocabulary, for example `Idle Groove`, `Step/Bounce`, `Celebration Arms`. Rig_Medium and Rig_Large remain separate validation targets. This birthday scene can be the first consumer; do not require signature dances for the whole cast before the slice works.

Future permanent D6/Suno music styles and naming convention remain a separate task. Verify the current naming contract before creating `01`, `02`, etc.; do not infer it from memory.

## 7 · Five additional high-fit ideas

### A · The first Almanac memory happens at character selection

When Novacyy is selected, create the **first birthday provenance event** for her Actor Card / birthday Card rather than only changing avatar state. The Fractal Almanac can later remember that this journey began here, on the sunset stage, on her 18th birthday. This uses the existing Card-provenance direction and gives the one-shot a durable narrative anchor without inventing a new save system.

### B · Six tracks can drive six restrained scene accents

Each Birthday-Radio D6 face may carry a small presentation profile in addition to the audio file: stage-light accent, fireworks intensity/pattern, disco-ball response and dance-clip preference. Do **not** recolour the whole world per song. World light stays coherent; these are local performance accents. This is a useful rehearsal for the later permanent D6 music-style system.

### C · Lighthouse beam can become a diegetic focus cue

Instead of adding more UI arrows after the reveal, the lighthouse beam can briefly sweep toward the currently important spatial area: Novacyy slot, speaker/radio, or Town horizon. It remains a lighthouse beam first, not a magical quest laser. This can test whether world lighting itself can guide attention.

### D · Authored reset pose for every toy interaction

Every clickable toy object gets an authored rest pose and a bounded recovery rule. Letters, boxes, balloons, disco balls and other props may be disturbed, but the start screen cannot decay into an unreadable physics pile after thirty seconds. This tiny contract is directly reusable later for Town's dominoes, props, signs and other world-as-toy objects.

### E · Birthday postcard / hero frame as the exit artifact

After actor selection or the first short interaction, the scene can compose one **birthday hero frame** from the actual 3D state: Novacyy, FrizzleBob, sunset, date/18 and optional clean KFB branding. Treat it as a Card/Almanac presentation or later share/export candidate, not as a second bespoke greeting graphic. This rehearses the existing Hero Shot / reconstructed-memory language in a harmless context.

## 8 · Plato Dungeon note

Preserve as later worldbuilding hook: **Plato's Dungeon Raid** can sit behind/under the Caveman home / goldmine instance, using the KFB philosopher RPG decks. The literal cave/Plato connection does not need an explanatory joke. This is a later instance hook, not part of the birthday-startscreen build.

## 9 · Travel / Astra handoff focus

For the next Travel planning session, treat this as a **single coherent presentation slice**, not a demand to finish every downstream module.

High-value integrated first pass:

1. sunset Travel/Tiny-Skies world donor with water, lighthouse and three palms;
2. curtain + floating `18` + reveal;
3. physical Kayfa/Bizarro wordmark and letter-chain donor;
4. FrizzleBob + Novacyy hero selection, Hihi inactive slot;
5. EyeRig speaker + one Birthday Radio track;
6. three disco balls;
7. one shared/default dance clip;
8. a few bounded world-as-toy interactions;
9. one controlled fireworks event;
10. hooks/metadata for the first Almanac birthday provenance event, without inventing a new save owner.

Later passes may add six-track sync, more dances, more cloth fidelity, extra Lulls, full fireworks choreography and broader actor coverage.

## 10 · Explicit boundaries

- No new Town runtime SSOT.
- No replacement for Travel's sky/terrain/light/audio owners.
- No automatic copying of the screenshot's v9 implementation without the real source.
- No permanent 1990s-TV style imitation; references are staging/material cues.
- No requirement that every object has a joke.
- No assumption that Tiny Skies lighthouse/skydome donors are reusable until the actual source/contract is pinned.
- No permanent D6/Suno naming convention invented here.
- No full KayKit dance library required for the birthday slice.
- No Plato Dungeon implementation in this slice.

## 11 · Status summary

**DIRECTION:** two large hero choices + Hihi inactive; sunset Town/Travel backdrop; physical KFB typography; world-as-toy interaction; subtle disco/music presentation; birthday scene as reusable calibration stage; Plato Dungeon kept as later Caveman/goldmine hook.

**PROPOSAL:** cloth donor, exact typography physics, lighthouse focus cue, six presentation profiles, first Almanac birthday event, birthday hero frame, fireworks choreography, default dance vocabulary.

**IMPLEMENTATION:** none in this document.

**TESTED RESULT:** none in this document.
