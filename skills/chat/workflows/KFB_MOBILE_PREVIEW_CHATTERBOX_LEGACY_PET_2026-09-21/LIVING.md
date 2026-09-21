# KFB Mobile Preview + ChatterBox / Legacy Web Pet · LIVING

Status vocabulary in this file:
`USER_DIRECTION` · `SOURCE_FACT` · `PROPOSAL` · `DECISION` · `IMPLEMENTED` · `TESTED` · `PUBLIC_VERIFIED` · `HUMAN_ACCEPTED`

This is the persistent ideation record for the mobile preview / Legacy Web Pet / ChatterBox consumer lane. It is additive. Later turns append; earlier entries are not rewritten to simulate certainty.

---

## 2026-09-21 · Turn 001 · lane bootstrap

### USER_DIRECTION

Georg wants this chat to be the KFB **mobile preview rendering / ideation chat** with GitHub synchronization on every substantive turn.

The lane should be useful for:
- mobile rendering and layout review;
- KFB Hub Stage previews;
- Legacy Web Pet / Legacy rig experiments;
- trying the existing ChatterBox and Triplet lineage in that context;
- later reuse by the Chrome extension without turning this chat into a second extension runtime owner.

### SOURCE_FACT · Legacy Web Pet

Current source slice:
- Draft PR #157;
- branch `chatgpt-web/legacy-web-pet-v0-2026-09-21`;
- current PR head at bootstrap: `4e26e04ab1e95e6e36001ebb14ce66be95d91570`;
- tested Web runtime head: `f41c59a8178bf77266c0f776f2e20a7948ee6223`;
- Web/Hub evidence: 15/15 static + 12/12 WebGL PASS;
- MV3 build PASS;
- arbitrary-page extension ready gate failed twice and is frozen;
- next extension gate remains `LWP-EXT-F1` observability only.

Current `main` observed at bootstrap:
`ce514192d2647a8e4882a7f3f010665a4a3964e7`.

PR #157 and main are diverged. No silent rebase or source rewrite is authorized by this chat.

### SOURCE_FACT · ChatterBox

Located current-reference routing says ChatterBox is **not** a missing monolith. Existing donors already cover:
- static faction content;
- source selection / chatter runtime;
- bubble layout;
- bubble drawing/presentation;
- identity and scheduling donors;
- a documented NIE hook that is still only a hook.

The existing role chain is:
`NIE → Performance Mask → ChatterBox → Bubble / Emote / TTS`.

The receiving host keeps movement, collision, gameplay, actor state and page interaction.

### SOURCE_FACT · concrete phrase donor

`overworld/overworld/chatter-phrases.js` contains real static source data.

Examples of existing named pools:
- `kingCourt`
- `townsfolk`
- `camp`
- `wilds`
- `cave`
- `frost`
- `shore`
- `dungeon`

It also contains:
- short `idle`, `antwort`, `frage`, `philo`, `spott`, `handel` lists;
- source-fragment templates under `ueber`;
- a faction-specific `SYNTHESE` table;
- sparse activity thoughts under `TAETIGKEIT`.

The source itself explicitly says variety should come from **source × faction × occasion**, not from hundreds of scripted lines.

### SOURCE_FACT · three-beat synthesis

The existing source describes a three-speaker pattern:
- speaker A: proposition;
- speaker B: counter;
- speaker C: synthesis/action.

The causal closure should happen in the listener rather than being explained with a literal “therefore”.

This is directly useful as a test fixture, but it is not permission to turn a single Web Pet into a constant joke machine.

### SOURCE_FACT · bubble donor

The located v13 bubble donor includes:
- measured text layout;
- five named registers in the code path (`speech`, `thought`, `shout`, `whisper`, `kayfabulate`);
- text-derived sizing;
- one interactive bubble path;
- a donor world cap of two bubbles;
- measured reveal/hold timing data.

These are donor facts, not automatic mobile defaults.

### SOURCE_FACT · Triplet terminology

Current reuse notes distinguish:
- semantic roles: `Subject / Connector / Reframe`;
- performance arc: `SHOW IT → SPIN IT → SELL IT`;
- KFB labels/IDs: `bingo / bongo / boggle`.

Known canonical v13 spellings:
**KayfaBINGO · KayfaBONGO · KayfaBOGGLE**.

The original uploaded `KFB_TOURBUS_MEDIA_TRIPLETS_FRANKENSTEINING_v2` is provenance-indexed but not available as a normal current repo file. Missing pool bytes must not be reconstructed from memory.

### DECISION · branch / owner / route

Owner remains:
**KFB ToolBox / Legacy Web Pet presentation adapter**.

This chat branch:
`chatgpt-web/mobile-preview-chatterbox-legacy-pet-2026-09-21`.

The branch is stacked on PR #157 instead of modifying the frozen source branch directly.

Primary product Stage route remains:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/`.

Possible nested preview harness:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/mobile-preview/`.

Neither is claimed PUBLIC_VERIFIED here.

### DECISION · mobile viewport

Primary acceptance viewport:
**390 × 844**.

Secondary fixtures:
- 430 × 932 portrait;
- 844 × 390 landscape.

Mobile is a first-class view, not desktop shrunk after the fact.

### PROPOSAL · interaction translation

Desktop:
- left click = action;
- right click = settings;
- camp click = home.

Mobile proposal:
- tap pet = same existing action;
- long-press pet/camp = same settings action;
- tap camp = same home action.

No visible generic settings chrome should be added to the final overlay merely because right-click is unavailable.

### PROPOSAL · first ChatterBox behavior

For the first integrated mobile experiment:
- no LLM;
- no TTS requirement;
- one bubble at a time;
- deterministic source selection for review;
- no permanent ambient chatter;
- text comes from the located static phrase donor;
- actor identity and ChatterBox content remain separate until a real voice/profile source is pinned.

Candidate first event:
**tap pet → real Legacy action → short existing ChatterBox line or thought**.

This is intentionally smaller than a full three-speaker Triplet.

### PROPOSAL · Triplet lab

A later Stage-only lab may show:
1. source/proposition;
2. counter;
3. existing `SYNTHESE` line.

It should preserve player closure and remain presentation-only.

The strongest version is likely a **three-actor rig preview** later, where each beat has a visible performer, rather than forcing all three beats through one pet. That requires a separate bounded actor-instance experiment and is not current implementation status.

### DECISION · donor-first gate

Before integrating ChatterBox bubbles with the pet, the exact selected v13 bubble donor must be rendered **in isolation at 390×844** and visually evidenced.

Only after that proof may an adapter place the same design over the Legacy Web Pet.

### PROPOSAL · useful preview-harness controls

Debug-only Stage controls may expose:
- viewport preset;
- deterministic seed;
- chosen phrase pool;
- chosen bubble register;
- pet/camp/bubble hitboxes;
- current Legacy animation;
- last ChatterBox source;
- safe-area / visualViewport bounds.

These controls are laboratory instrumentation, not product UI.

### UNRESOLVED

- extension content-script/frame boot boundary is still unknown;
- current Cloudflare Stage for Legacy Web Pet is not PUBLIC_VERIFIED;
- current PR #157 preview build has a Cloudflare build failure at its latest head;
- no mobile browser evidence exists yet;
- no ChatterBox donor isolation screenshot exists yet;
- no exact original Triplet upload bytes are present as a normal repo source.

### NEXT GATE

**MOB-0 · source-isolated ChatterBox mobile donor proof.**

Do only:
- exact chosen v13 bubble donor;
- 390×844;
- deterministic fixture strings from the existing static phrase donor;
- screenshot + source revision;
- no Legacy Web Pet runtime modification yet.


---

## 2026-09-21 · Turn 002 · Toy / Clay Form Language + first lab

### USER_DIRECTION

Georg wants a reliable KFB construction language for small props and landmarks that does not keep falling back to hard edges, thin technical parts and miniature-detail modelling.

Target character:
- Tiny Treats friendliness;
- KayKit chunkiness;
- clay / resin / toy softness;
- collectible boardgame readability;
- much more iconic than a literal miniature, but not reduced as far as Monopoly hotel pieces.

Concrete first examples:
- one rounded rectangular panel with three rounded cartoon buttons;
- Eiffel Tower as a simplified soft toy landmark;
- Cologne Cathedral as a simplified soft toy landmark.

The rules, samples and future failure/postmortem learnings must persist additively on GitHub.

### SOURCE_FACT · existing owners and donors

The existing landmark authoring owner remains `tools/img2threejs/`.

Current landmark state:
- **City Grotesque remains the accepted landmark default**;
- Soft Cubist remains an alternate/debug mode;
- Cologne Cathedral v0.2 is prior accepted cartoon-abstraction/material evidence, not a Toy/Clay implementation;
- the existing Eiffel Pilot 01 is intentionally much more detailed/lattice-like than this new direction;
- the existing Living Toy World note already provides the broader north star: “the world as a breathing, living toy.”

Tiny Treats Charming Kitchen 1.1 is an existing registered CC0 source pack. The chosen visible donor for this experiment is the real:
`media/3D_Assets/Tiny_Treats_Charming_Kitchen_1.1_FREE/Assets/gltf/toaster.gltf`.

Its source is shown in isolation before any derived procedural model.

### DECISION · no new landmark owner

The new work is a **ToolBox authoring donor**, not a replacement landmark/world runtime.

- ToolBox owns the candidate primitive grammar and authoring lab.
- `tools/img2threejs/` keeps landmark authoring ownership.
- Registry / Asset Librarian keeps asset identity.
- City Grotesque stays the default until a later explicit human decision changes it.

### DECISION · KFB Toy / Clay Form Language v0

North star:
**build the soft toy icon of the object, not a miniature engineering reconstruction.**

First-read geometry should be roughly 80–90% macro massing. A detail earns geometry only when it changes silhouette, identity or interaction.

Preferred primitive family:
- rounded slab / rounded box;
- capsule and capsule beam;
- rounded cylinder / squashed sphere;
- smooth lathed taper or spire;
- soft arch;
- large raised/inset pill.

A micro-bevel is not enough. Rounded-box default radius is approximately 14% of the smallest dimension, bounded by thickness.

Material baseline:
- metalness 0;
- roughness about 0.8–0.9;
- large clean colour blocks;
- soft shadow;
- no grime/texture pass before form acceptance.

### DECISION · hard detail budgets

v0 budgets are enforced in code:
- panel: max 4 visible authored parts;
- Eiffel: max 14;
- Cologne Cathedral: max 16.

General guidance:
- XS prop: 1–4;
- S prop: 3–6;
- M landmark: 5–10 primary, up to 16 hero parts;
- L hero landmark: 8–16 primary; extra secondary geometry requires a named reason.

### IMPLEMENTED

Implementation checkpoint:
`8825d05caed888e8bc35cc3b49d0cf01da3664da`.

Added reusable ToolBox modules:
- `tools/KFB-ToolBox/toy-clay-form-lab/lib/kfb-toy-primitives.mjs`;
- `tools/KFB-ToolBox/toy-clay-form-lab/lib/samples.mjs`.

Shared geometry primitives currently use:
- Three.js `RoundedBoxGeometry`;
- `CapsuleGeometry` for soft beams;
- `LatheGeometry` for smooth toy spires;
- `TorusGeometry` for a soft arch cue.

The authored samples deliberately contain no direct `BoxGeometry`.

Stage-source lab:
`kfb-hub/stage/toolbox/toy-clay-form-lab/`.

The viewer starts on the **exact Tiny Treats toaster source**. Only after that donor is visible can the reviewer switch to Panel / Eiffel / Cologne.

### TESTED · source / browser

GitHub Actions run:
`35555718144`.

Static contracts:
**15/15 PASS**.

Desktop + mobile WebGL:
**16/16 PASS**.

Browser viewports:
- desktop 1440 × 900;
- mobile 390 × 844.

Observed authored part counts:
- Panel: **4/4**;
- Eiffel: **13/14**;
- Cologne Cathedral: **12/16**.

Observed browser errors:
- failed resources: **0** desktop / **0** mobile;
- page/console errors: **0** desktop / **0** mobile.

Evidence artifact:
- ID `10619944311`;
- digest `sha256:7ac890e848f40b3c5456c3512bb6864580b903431fd6a529380ad029ad7aaa34`;
- 5 files, including desktop/mobile donor screenshots and desktop/mobile Cologne screenshots.

### VISUAL REVIEW · assistant inspection, not Georg acceptance

The isolated Tiny Treats toaster visibly proves the actual source object is being used.

The Cologne candidate already reads substantially more like a toy/resin icon than the prior hard low-poly architecture direction:
- broad rounded macro masses;
- low part count;
- simple colour zones;
- clear twin-tower silhouette.

Open visual issue:
- the two spires still read relatively pointed compared with the softer body masses.

This is deliberately left as an open human visual decision rather than auto-tuned after a green CI result.

### POSTMORTEM RULE · persist failures additively

New file:
`POSTMORTEMS.md`.

Current recurring failure pattern:
hard 90-degree edges + thin supports + too many literal architectural parts + surface polish before massing.

Repair order:
1. delete secondary parts;
2. enlarge macro masses;
3. increase visible corner radius;
4. thicken supports;
5. restore only one missing iconic feature;
6. material last.

Do not repair a massing failure with texture, AO, UI framing or more geometry.

### PUBLICATION STATUS

Intended review route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/toy-clay-form-lab/`.

Cloudflare Pages reported **BUILD FAILED** for PR #158 at exact implementation head `8825d05...`.

Therefore:
- source/browser candidate = tested;
- public Stage = **NOT PUBLIC_VERIFIED**;
- human acceptance = **OPEN**.

No alternate GitHub Pages / raw / githack link is substituted.

### NEXT GATE

**TOY-CLAY-PUB-1 · publication-only recovery.**

Publish the already-tested source to the exact Cloudflare Stage route and open that URL successfully. Do not change model geometry during this gate.

Only after PUBLIC_VERIFIED should Georg make the first visual decision on:
- overall softness;
- Eiffel simplification;
- Cathedral spire softness;
- whether this grammar should become a preferred KFB prop/landmark authoring option.


---

## 2026-09-21 · Turn 003 · Eye Actor Studio / EyeRigging Machine

### USER_DIRECTION

Georg wants the existing EyeRig line promoted into a broader authoring idea:

**Eye — including lids and brows — as actors.**

The Studio should eventually be the common place to:
- rig/calibrate eyes in batches;
- author eye poses and reusable facial beats;
- couple eye poses to existing body animation classes without taking over body movement;
- switch between existing EyeRig shell lids and a thicker Claymation lid family;
- debug eye/lid/brow materials and colour inheritance;
- add eye-relative 3D emanata and impact marks;
- prepare multiple host families: characters, Legacy actors, toaster/radio props, vehicles and living plants.

Requested expression examples include skeptical blink, one-eye combat aim, tired eyes, dizzy/spiral eyes, heart eyes and oversized cartoon pupils with authored catchlights.

### SOURCE_FACT · existing owners

The new Studio does not create a second eye-control grammar.

Existing owners/donors retained:
- 3D eye behavior: `pet-eye-rig.v6.js`;
- eyebrows: `brow-rig.v2.js`;
- current batch calibration/profile lane: ToolBox EyeRig Batch;
- renderer-neutral semantic vocabulary: `kfb.eye-rig.protocol/1`;
- FrankenStein/ToolBox keeps actor/face composition;
- receiving games keep body motion, combat, vehicle physics, gameplay and camera.

Existing EyeRig v6 already provides:
- two eyes and **four separate lid meshes**;
- per-eye upper/lower lid values;
- per-eye slant;
- gaze, point target, kinetics and life;
- stable `eyeFrame()` attachment seam.

Existing BrowRig v2 already provides volumetric tube brows and presets including `skeptical`.

### SOURCE_FACT · current geometric weakness

EyeRig v6's lid behavior is strong, but its source lids are thin sphere-shell caps.

That directly explains Georg's current visual concern:
- technically functional;
- visually close to a thin shell;
- less like a hand-modelled clay/cartoon actor.

The new Clay-Lid work therefore replaces **geometry only**, while reusing EyeRig v6 behavior/animation.

### DECISION · Eye Actor layer

Canonical six EyeRig expressions remain untouched.

The new **Eye Actor Pose** layer is higher-level and may combine:
- EyeRig lid arrays;
- slant;
- gaze/point target;
- pupil state;
- BrowRig preset;
- optional temporary material/shadow state;
- optional 3D emanata.

First candidate pose shelf:
- neutral;
- skeptical blink;
- combat aim left;
- combat aim right;
- tired;
- angry;
- surprised.

Consumer body animation may request these poses, but the Eye Actor system never becomes the movement/gameplay owner.

### DECISION · Clay Lids v0

Clay Lids are an optional adapter over the existing four EyeRig lid meshes.

Required grammar:
- visible outer volume;
- rounded exterior;
- harder inner eyeball-facing rim;
- upper/lower remain independent per eye;
- slant remains controlled by EyeRig;
- `curve` adds a candidate concave/convex opening shape;
- pupil remains behind the inner rim.

### DECISION · colour/material resolution

Default inheritance contract:
**face > body > main > explicit fallback**.

For real batch hosts later:
- use the same source texture/material family as the face;
- match face texel scale;
- do not invent a separate random lid texture;
- expose source, measured face colour, selected resolver source and overrides in debug mode;
- modal palette sampling is preferred for flat KayKit palette textures.

Georg's direction is to move KFB colour toward KayKit palette logic plus the current Cologne world/look work rather than older washed-out pastel defaults.

The spoken source label “Cologne Wastefax” is **not located as an exact current repo source** in this audit. No guessed palette is promoted. The later colour bridge must route through the existing World Color/Lighting Cohesion owner after the exact Cologne source is pinned.

### DECISION · eye shading

The first Studio candidate reduces the self-lit/overwhite appearance by giving sclera and pupil a more restrained PhysicalMaterial response:
- off-white sclera;
- higher roughness;
- lower clearcoat than the old default;
- normal shared scene key/fill lighting.

This is a preview profile, not yet a global EyeRig material replacement.

### DECISION · eye shadow / rings

The first proof contains an optional **under-eye shadow preview** anchored from the eye frame.

It is deliberately a preview geometry overlay. Final eye-ring/eye-bag work should become a bounded shader/material proof after the eye geometry is visually accepted.

### DECISION · 3D emanata

`eyeFrame()` becomes the proposed attachment seam for eye-relative comic marks.

First authored 3D candidates:
- one deformable-looking 3D sweat drop;
- 3–4 matte black soot dots for impact/explosion-center language.

This is presentation only. No generic tile/confetti particle system is introduced.

Future candidates may include anger vein, surprise marks or question marks only when routed through existing KFB Emanata canon.

### IMPLEMENTED · EAS-0

Implementation head:
`f6fcdfbf6ec086759b322d96c7a312dabc991c8a`.

Test-only observability repair:
`2a79d398fad090aabf56d5a5d17f37fd97fa4df7`.

New ToolBox candidate:
`tools/KFB-ToolBox/eye-actor-studio/`.

Implemented modules:
- `color-resolver.v0.mjs`;
- `clay-lid-adapter.v0.mjs`;
- `eye-materials.v0.mjs`;
- `emanata3d.v0.mjs`;
- `pose-library.v0.mjs`;
- Eye Actor Contract and README.

Stage-source lab:
`kfb-hub/stage/toolbox/eye-actor-studio/`.

The Studio defaults to the exact EyeRig v6 donor mode. Clay Lids are opt-in.

### TESTED · source and browser

First run `35557045766`:
- **20/20 static PASS**;
- **5/5 syntax PASS**;
- desktop browser path passed through Clay/Skeptical;
- mobile browser proof failed because the test read the previous published debug object one animation frame too early.

Observed failure:
`mobile four clay lids 0`.

Proven cause:
the DOM mode/ready marker was already `clay`, but `window.__KFB_EYE_ACTOR_STUDIO__` still contained the prior donor-frame debug state.

Repair:
the browser proof now waits for both DOM state **and** the published debug object to report `mode=clay` and `clayLidCount=4`.

No runtime/model geometry changed in the repair.

Authoritative run `35557143481`:
- **20/20 static PASS**;
- **5/5 syntax PASS**;
- **24/24 desktop/mobile WebGL PASS**;
- failed resources: **0**;
- page/console errors: **0**.

Browser viewports:
- desktop 1440×900;
- mobile 390×844.

Observed browser facts:
- exact EyeRig v6 donor starts first;
- donor exposes 4 lids;
- Clay mode exposes 4 Clay lids;
- measured pupil clearance = **0.00232960000991822**;
- skeptical pose produces asymmetric lid rotations;
- body and main colour fallback paths both execute;
- 3D sweat emanata state executes.

Evidence artifact:
- ID `10621181776`;
- digest `sha256:8e88d042153bcc8b9eb9a77bcb1b2a69a7e3c66bd725aad221792dc795f9795e`;
- 5 files: browser JSON plus desktop/mobile donor and Clay-Skeptical screenshots.

### VISUAL REVIEW · assistant inspection, not Georg acceptance

The screenshots establish:
- donor EyeRig v6 is visibly distinct from Clay mode;
- upper Clay lids have substantial rounded volume;
- the hard inner occlusion rim is visible;
- skeptical asymmetry reads clearly;
- the 3D sweat drop reads as a small authored cartoon object rather than confetti;
- sclera are off-white and visibly shaded by scene light.

Open visual questions:
- lower Clay lids currently read more like a strong rim/liner than a full clay pad;
- pupil clearance is technically positive but visually tight;
- BrowRig tube thickness vs much thicker Clay lids may need coordinated style tuning;
- under-eye shadow/ring has not yet received a screenshot-based visual gate.

### HOST ROADMAP · PROPOSAL

Reuse the same Studio/profile line in this order:
1. current Rig_Medium / Rig_Large batch profiles;
2. LegacyFaceHost / Legacy characters;
3. static props such as toaster and radio with measured face-plane anchors;
4. vehicles with explicit front/headlight and rear/trunk eye anchors;
5. plants / living props.

Vehicle lights and physics remain vehicle/game-owned; Eye Actor is presentation/authoring only.

### FUTURE EYE FX · PROPOSAL

After Clay Lid acceptance:
- spiral/dizzy pupil geometry;
- heart pupils/heart eyes;
- oversized SpongeBob-like pupil mode;
- authored white drawn catchlight geometry combined with lighting-driven highlights;
- final under-eye/eye-ring shader;
- reusable animation-class trigger bindings.

None of these is claimed implemented by EAS-0.

### PUBLICATION STATUS

Intended Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-actor-studio/`.

Cloudflare Pages reports **BUILD FAILED** for PR #158 at the current stacked branch.

Therefore:
- source/browser candidate = tested;
- ToolBox registration may be source/status only;
- public Stage = **NOT PUBLIC_VERIFIED**;
- human visual acceptance = **OPEN**.

### NEXT GATE

**EAS-PUB-1 · publication-only recovery.**

Publish the already browser-proven Eye Actor Studio to the exact Cloudflare route without retuning EyeRig/Clay geometry.

After PUBLIC_VERIFIED, the first human visual question is:

**Do the Clay Lids read as expressive clay/cartoon forms with real volume while preserving a clean hard occlusion edge against the eyeball?**


---

## 2026-09-21 · Turn 004 · Studio first + arbitrary Eye Cluster

### USER_DIRECTION

Georg confirms Hunky/Dory as a later Eye Actor use case, but wants to **build the Eye Actor Studio first**.

Additional core requirements:
- each eye can rotate in all 3 axes;
- strongly side-mounted frog-like eyes must be possible;
- two eyes may have different size/shape and be asymmetric;
- 3 or 4 eyes must also be representable.

### SOURCE_FACT

EyeRig v6 is explicitly pair-based:
- constructs two eyes;
- exposes `eyes[0]` and `eyes[1]`;
- `eyeFrame()` returns left/right;
- current `splay` is only mirrored Y-axis outward rotation up to 45°.

Its source comment explicitly leaves top/bottom orientation for later.

Existing `eyeoval.v1.js` already safely applies W/H/D scale and mirrored tilt without forking EyeRig, but uses one shared W/H/D for the pair.

### DECISION

Studio v1 will use a candidate **Eye Cluster / Eye Slot** authoring layer:
- eye count 1–4;
- per-eye position;
- per-eye size;
- per-eye W/H/D;
- per-eye Pitch/Yaw/Roll;
- quaternion;
- per-eye acting/material scope.

Two equal frontal eyes become a preset, not an architecture assumption.

Existing EyeRig v6 remains the exact behavior donor; no global protocol/schema promotion is authorized by this planning turn.

### BUILD BRIEF

Fresh-chat build brief:
`skills/chat/workflows/KFB_EYE_ACTOR_STUDIO_V1_2026-09-21/START_HERE.md`

Companion architecture:
`EYE_CLUSTER_CONTRACT.v0.md`

Hunky/Dory parked:
`DEFERRED_HUNKY_DORY.md`

The fresh implementation branch must be created from then-current `main`, not from this stacked ideation branch.

### REQUIRED STUDIO FIXTURES

- equal frontal pair;
- unequal asymmetric pair;
- frog-side pair;
- one eye;
- three eyes;
- four eyes.

For 3–4 eyes, acting must have explicit scope:
- all;
- selected;
- primary pair;
- custom selection.

BrowRig v2 remains pair-oriented; automatic 3/4-eye brow generation must report unsupported rather than invent a layout.

### HUNKY / DORY

Deferred until Studio v1 acceptance.

Their eventual Eye Stalk chain is proposed as:
`measured stalk root → dangle/secondary stalk → Eye Slot anchor → Eye Actor`.

Final eye count is not fixed yet.

The user-described faceless Medium template head remains `SOURCE_REQUIRED`: current repo search did not uniquely identify the intended object.

### NEXT GATE

**EAS1-A · donor reconstruction on a fresh branch from current main.**
