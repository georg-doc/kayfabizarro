# KFB Game Loop R27 · Shared Claymation EyeRig Expression Library
2026-11-01 · Georg creative steering · ADDITIVE CONCEPT / NO SECOND RIG / NO RUNTIME CODE

**Owner:** existing KFB_HUB/30_DECISIONS/replies concept lane on `planning/kfb-game-loop-fluff-economy-r2-2026-10-29` (Draft PR #460). Creative authority Georg/WS0. **Technical recipients only if later authorized:** canonical ToolBox 3D EyeRig-v6 / existing EyeRig profile & Face Modifier/FrankenStein Studio owner, 2D/3D EyeRig protocol adapters, Scenelet/Resident/ChatterBox, MIB Tower Orb/Eye and other source-owned scene hosts, Sky/Environment, Combat, Dark-Fluffer Goo, HyperNorm material owner. This document creates **no new eye runtime, FX layer owner, screenshot or product route**.

## 1 · Georg's requested design
The **same recognisable KFB claymation eyeball construct** should travel across all 3D Characters, NPCs, Monsters, the R24 Mannequin Crowd, dioramas, small Scenelets, the **Men in Black tower orb/eye** and giant Black-Fluff sky eyes. Preserve the real **pair of eyeballs / eyelids / pupil sizes / gaze tracking / blinking / sheen / source material**. Add an expressive reusable repertoire, not a different set of cheap generic emoji/sprites for every effect:
- **X / crossed-out eyes** for cartoon defeat, fainting, knock-out or death as appropriate to the *actual* owning state.
- **Spiral pupils** for confusion, hypnosis, dizziness, reality glitches, dissonance.
- **Stars / sparkles** for dazed, excited, impact, reward, absurd revelation, or a temporary star-pupil effect.
- **Tiny pooled tears** hugging the **lower eyelid**, with optional small tear-droplet overflow, not arbitrary floating streams across the face.
- **Cute oversize glossy/googly pupils** with **2–3 readable glints**, soft large eye silhouette and KFB clay eyelid design. “SpongeBob-like” is an editorial description of **exaggerated cute pupil/readability**, not permission to clone copyrighted character eye artwork.
- **Heart eyes / heart-shaped pupil/overlay** for infatuation, exaggerated sympathy, delight or satirical marketing seduction.
- Preserve R26 **off-white eyeballs / black pupils → Goo-dark eyeball/red emissive pupil/aggro → healed white/black** as an independently controlled **appearance/status family**, not a replacement for these expressions.

**Critical separation:** these are **eye performances / visual modifiers**. They do not diagnose the NPC, determine what is true, make a character hostile, kill/heal an actor, or assign political belief. Those belong to the current Resident Life/Affect, Combat/Gunfight and Goo/Healing owners. A character may feign death with X eyes, be play-acting hypnosis or exaggerating tears. Persistent source truth remains unchanged.

## 2 · Existing source audit and status
**Canonical 3D EyeRig v6:** `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js` (blob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`). Verified from GitHub source:
- separate off-white eyeball and near-black pupil meshes, distinct upper/lower clay lids;
- public `eyeFrame()` (two eye positions, radius, parent/rig/gen/unit), `setGazeFollow`, `pointTo`, `applyEmote` (lids/slant/pupil/gaze), blink and Life/Kinetics;
- `pupilSize`, `gloss`, `lidFit`, `converge`, `splay`, asymmetric left/right lid controls;
- `PUPIL_STYLES=['matte-cute','glossy-googly']`. `applyEmote.pupil` currently uses **normal/wide CAP geometry**, not custom spiral/heart shape. Its `setPupilStyle` triggers a **rebuild**, so should not be used as per-frame expression switching.
- Existing glassy pupils use native reflectance and sharp glint; earlier `tools/kfb-graveyard/pet-eye-rig.v4.js` deliberately avoids an **extra physical highlight mesh** and forward-scaling the pupil because these caused clipping/protrusion. **2–3 glints must be explored as source-safe material/reflection/highlight treatment, not asserted as already supported or implemented by adding floating dots.**

**Existing look metadata:** `media/3D_Assets/pet-LIBRARY.json` names `fx: ['none','spiral','heart']`. Older `pet-eye-rig.v4.js` clearly says **“FX-Slot (spiral/heart) vorgesehen (this.fx) = Backlog”**. The current v6 constructor also accepts `opts.fx`, **but its presence alone is NOT an implementation of spiral or heart visuals**. No R27 source proof of working spiral/heart rendering.

**Cross-render semantic owner:** `tools/2D Animation Studio/shared/eye-rig/eye-rig-protocol.v1.json` (`kfb.eye-rig.protocol/1`) documents baseline semantic commands and no modifier/shape/effect channel. `tools/2D Animation Studio/shared/eye-rig/FACE_MODIFIER_ATLAS.md` and `modifier-atlas/MODIFIER_MANIFEST.v0.1.json` are **PREPARATION / SOURCE INVENTORY INCOMPLETE** with `eyeFrame` attachments, not a shipped library of X/stars/tears. Existing `eye-clips.v1.json` has neutral/blink/look/surprised/thinking; prior cross-render proof has **STATIC SANITY PASS, BROWSER QA PENDING**, not evidence of complete 2D/3D parity.

**World adapters:** EyeRig v6's `build()` still ray-fits a head/Body mesh. A giant Skydome eye, MIB tower orb/eye, orbital camera lens, scene prop or flat diorama face requires its **existing host's thin world-local anchor/scale/eye-gaze transform**, not a second EyeRig. The **specific live MIB Tower Orb source object, 3D mesh and current owner were not verified in this audit**; do not pretend that loading a guessed URL demonstrates original donor use.

## 3 · Lean compositional architecture, not a second character engine
`Source host head/prop/sky anchor → canonical EyeRig v6 (geometry + gaze + lids + blink) → ONE optional eye-relative modifier slot per effect family → character/scene presentation`.

**Three orthogonal axes** (proposal labels only, NOT current exported API):
1. **Appearance / status:** `normal`, `goo_idle`, `goo_aggro`, `cured` — from R26. Black/white sclera and pupil emissive values; authoritative infection/heal/aggro state lives elsewhere.
2. **Expression / shape:** `neutral`, `googly-big`, `spiral`, `heart`, `star`, `x`. Eye/eyelid animation remains source v6; special silhouettes may overlay/hide/swap the **existing pupil cap** in one stable owner-controlled slot.
3. **Secondary micro-FX:** `none`, `tear-pool`, `small-droplet`, `glint-boost`, `short-sparkle`, small optical glitch; bounded short-lived effects not automatically interpreted as gameplay stats.

**Priority/cancellation:** physical identity (alive/defeated), Goo/Heal authoritative status and source default take priority over transient funny expressions. Example precedence: verified KO/death X overrides gaze pupil (but eyelid can hold a comic pose); cure resets Goo palette but does **not** force a happy emote; spiral has a time limit and fades to available gaze; a heart is a temporary exaggeration while the NPC can disagree or be cynical. Strong conflicting patterns should not stack: no X+spiral+heart on the same pupil simultaneously. Tiny tears can coexist with angry lids, but not auto-spawn after every hit.

**No brittle child indexing:** `eyeFrame()` is the public modifier anchor, and any new stable `pupil/lowerLid` attachment surface must be added by the **canonical owner** if needed. Current v6 internally has mesh handles for pupil, lower lid and glints, but another Scenelet must not crawl `eyes[0].children[n]` or mutate private meshes. On a `build()`/host replacement the owner rebinds modifier state using `gen` and disposes/reuses resources correctly.

## 4 · Expression-specific proposals / performance details
- **X eyes:** two flat or slightly curved clay/ink strokes per eyeball, projected onto the eye surface or shaped cap; do not permanently paint the source atlas. The player may distinguish *comedic knockout* from death via actual owner-provided Combat status; X does not issue a kill event.
- **Hypnosis/confusion spiral:** procedural curved low-poly spiral or bounded local eye-surface material, anchored to the actual pupil pivot and clipped by the eyelid. Spin **optional**, slow and reduced-motion-safe; can be shown static with sound/caption alternative. No misleading claim that a spinner itself alters Resident behavior.
- **Star pupils / twinkles:** simple stylized five-point/star contours or two light sparkle accents, with scale and palette consistent with the source eyes; single short peak on event, no permanent overdraw.
- **Tear puddle:** a small crescent of glossy translucent color **at the inside of the lower lid** and one bounded corner tear if appropriate. Moves with blink/lid/character; avoid simulated fluid, secondary gravity or particles for the MVP. Requires actual lower-lid attachment/occlusion proof.
- **Big cute googly:** first reuse `glossy-googly`, `pupilSize`, `wide` pupil cap, `gloss` and modest `converge`; material/reflection may fake 2–3 glints within the black surface. Respect the old known anti-pattern: external highlight balls and pupil forward scaling protruded/clipped through lids.
- **Hearts:** heart-shaped cap/eye-local overlay on the source pupil pivot or inside the eyeball; the `fx:'heart'` Pet Library label is a **wish**, not source-proof of active heart pupils. No flat emoji projected as generic second face replacement.

**Materials/HyperNorm:** the authentic eyeball assembly can be exempted from **character-body-only** HyperNorm material variants, as in R26. For a **screen-space postprocess** do not claim `petOverlay` automatically excludes eyes: requires existing renderer-owner selective masking/second pass with actual source proof. Glow, emissive pupils and sparkle stay small and controllable on mobile. Existing KFB clay source quality, physical occlusion and actual shapes trump decorative chrome.

## 5 · Specific reuse cases
- **R24 Mannequin crowd:** large pupil panic, tiny tears while asking for help, X only after Combat/animation owner confirms KO, spiral for a short post-collapse comic dizziness; retains same body palette/rig.
- **MIB tower orb/eye / surveillance camera / Diorama:** material/expression/eyeFrame features with a **prop anchor**, not a fake imported character rig or a new face controller. A watching iris could use gaze; its true camera/beam state stays with prop/world owner.
- **Skydome eyes:** same pupil/lid/glow semantics through a sky host; eye looks may be ominous or absurd, but eye appearance itself never establishes a universal global AI's belief about the player.
- **ChatterBox Scenelets / Newsreels:** short eye reaction beats timed to already existing dialogue/presentation events, not a per-character LLM or a second animation timeline.
- **2D future:** protocol-level semantics may be mirrored by existing 2D adapter, but the renderer uses its *own approved source-local Illustrator geometry*, not a visual copy/paste of the 3D EyeRig and not a replacement for native DocCheck assets.

## 6 · The smallest honest acceptance fixture
After WS0 and source-owner approval:
1. **SHOW SOURCE FIRST:** original v6 3D googly eyes on one exact accepted rig head with natural source materials in isolation; compare original `matte-cute`, `glossy-googly`, real eyelid blink, pupil travel and clipping envelope. Verify original actor/eye geometry is truly rendered, not a URL load indicator.
2. **Add one variant at a time**, not all at once: `x`, `spiral`, `star`, `heart`, `tear-pool`, `multi-glint` via canonical EyeRig-owned modifier slot. Record each exact source/tested shape, occlusion, head turns, blink, off-screen/distance aliasing and return-to-neutral.
3. **Rebuild/save state**: EyeRig rebuild does not leak/dispose shared materials incorrectly or leave tears stuck; on clean state restore normal eyes, old source profile intact.
4. **Only then** show one existing Scenelet/diorama **source object in isolation** with the actual EyeRig behavior and at most one source-pinned MIB tower-orb or Skydome consumer. If none is source-verified, do not fabricate a “MIB tower” to call the gate green.
5. Device/glow: desktop/mobile low-motion, high-contrast/low-light variants; no all-screen strobe, no extra simulated tear physics.

**R27 performed now:** GitHub text/document source inspection only; actual runtime/visual/audio/mobile/gameplay tests **0**, built variants **0**, approved scene hosts **0**. Prior R26 Goo/Heal contract unchanged; R9–R11 are older local-only drafts not in this branch. No code, image exports, shaders, Hub/SSOT/Stage/Site/Live, no merge, World R4 NO MVP unchanged.

**Exactly one next gate:** **Georg/WS0 accepts “one canonical EyeRig-v6 plus additive expression/material/FX modifiers” as the shared visual grammar**; then authorize existing ToolBox EyeRig owner to isolate and prove **one** new effect (recommend spiral or X) on actual source eyes before expanding the variant catalog.
