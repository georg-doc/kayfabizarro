# Claude Design · KFB Animation Library V1 · Character × Motion

## Role and outcome

You are designing one bounded KFB ToolBox module for Georg. Build a **Mixamo-like animation-library workflow** while retaining the current KFB ToolBox design language. Copy the useful information architecture—motion browsing beside a large live character preview—but do not copy Adobe branding, Mixamo chrome, colors, wording, or asset-distribution behavior.

The result must let Georg choose a real registered character, browse real registered animations as moving previews, apply one clip to the character, edit editorial metadata, assign Resident motion roles, and export/import a reversible JSON patch.

It must also design a private/local **Drop Zone** for trying newly downloaded FBX animations immediately, without making raw FBX files part of the public repository or pretending that every upload is production-ready.

This is a closed-package Claude Design prototype. It is not yet the production GPT Site.

## Current sources to read from GitHub

GitHub current state wins. Read only what is needed.

### ToolBox visual and interaction donor

`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-03/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r2/`

Required:

- `CURRENT_STATE.md`
- `docs/PROJECT_RULES.md`
- `docs/LESSONS_SHADOWS.md`
- `docs/PARITY_STUDIO_V18_TOOLBOX.md`
- `KFB ToolBox Production-03.dc.html` only as the current visual/control donor

Production-03 already has `Studio`, `Animation Studio`, and `Rigging` tabs. Extend that grammar. Do not invent a second ToolBox shell.

### Canonical runtime motion source

`media/3D_Assets/Animations/KFB_Motion_Library/`

Required:

- `RETURN.md`
- `KFB_Motion_Library.catalog.json`
- `KFB_Motion_Library_Rig_Medium.glb`
- `KFB_Motion_Library_Rig_Large.glb`
- `sheets/`
- `NOTICE.md`

The currently accepted baseline contains 33 clips on the real Rig_Medium and Rig_Large skeletons. Blender MCP is importing, converting, measuring, and registering additional clips. The prototype must therefore read a manifest/catalog dynamically; never hard-code “33” as a product limit.

Raw Mixamo FBX files remain outside GitHub. Do not ask for, embed, export, or redistribute them.

## FBX Drop Zone · three explicit lanes

Place a visible but compact `Animation ausprobieren` drop-zone near the motion browser. It accepts drag/drop and file selection. Never conflate these three states:

### A · Local Quick Preview

- load the selected FBX locally in browser memory;
- do not upload it, cache it remotely, add it to GitHub, or include it in the design export;
- inspect animation count, clip names, duration, FPS, skeleton/bone names, root motion and likely Rig_Medium/Rig_Large compatibility;
- let Georg choose one clip when an FBX contains several;
- preview on the uploaded source actor and, only when bone compatibility is actually proven, on the selected KFB actor;
- mark the result `LOCAL PREVIEW · NOT REGISTERED`.

This can use a browser FBX loader for the prototype. A successful load is not proof that the clip is safe for a production actor.

### B · Non-destructive correction patch

Provide a small `Fit & Motion` drawer for corrections that are reasonable as metadata/retarget offsets, not destructive mesh editing:

- arm spacing / shoulder abduction;
- upper-arm and forearm twist;
- wrist bend/twist correction per side;
- hand-open/relaxed pose offset when supported;
- hip/root offset and facing direction;
- in-place versus measured travel preview;
- loop start/end and trim only when the real preview engine supports it;
- playback speed for preview, separate from the immutable measured source duration;
- mirror only when explicitly implemented and testable.

All corrections are stored as an additive JSON patch. Keep `source clip` and `corrected preview` switchable A/B. Never bake over the source bytes in the UI.

### C · Promote Candidate

`Zur Library vorschlagen` does not publish automatically. It creates a small intake record containing:

- locally calculated source hash;
- original filename kept private/local;
- proposed immutable motion ID and editable display name;
- detected rig/bones and compatibility verdict;
- correction patch;
- license/source declaration;
- intended semantic roles/tags;
- validation checklist;
- requested outputs: baked runtime GLB clip, catalog entry, contact data and preview sheet.

For the closed design prototype, export this as a JSON intake receipt. Do not include raw FBX bytes.

Later production can implement a deterministic browser/worker or headless conversion for standard, already-compatible KayKit/Mixamo clips. Blender MCP remains the exception and repair lane for bone-roll mismatches, object-motion folding, root/hips conversion, contact measurement, broken tracks, complex retargeting, or failed browser export. This avoids spending Blender/LLM time on the common happy path without weakening validation.

## Technical production hypothesis to communicate honestly

- Browsers can preview FBX through a loader, but KFB runtime delivery remains GLB for predictable loading and smaller integration surface.
- A KayKit model uploaded to Mixamo often returns familiar bone names, which makes a fast preview plausible; it does not guarantee identical rest pose, bone roll, object-motion handling, contacts or clean root motion.
- Arm width and wrist corrections can usually be represented as non-destructive per-bone offsets for preview. Promotion still needs a deterministic validation/bake step.
- `99% works visually` is suitable for Local Quick Preview; it is not the admission criterion for the canonical library.

### Existing PetStudio motion donor

- `skills/KFB PetStudio/studio-v3/motion-LIBRARY.v2.json`
- `skills/KFB PetStudio/studio-v3/pet-motion.v2.js`

Use only as a behavior/data donor where compatible. Do not create a second canonical catalog from it.

### Resident consumer context

`tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/docs/HANDOVER_WSA_S40.md`

Residents should request semantic roles such as `locomotion.walk`, `talk.explain`, `react.cheer`, `dance`, or `music.drums`, rather than binding themselves to arbitrary filenames.

### Shared rendering policy

Use the current shared KFB Render R0 preset from PR #273 / branch `work/render-r0-shared-preset-2026-09-28` when it is available in the source package. It owns the fix for shadow acne/clipping, minimum roughness, texture anisotropy, and detail distance. Consume it; do not write a second renderer or a new shadow workaround.

## Ownership boundaries

- **Blender MCP owns:** FBX intake, retarget/conversion, clip validation, bone/track measurement, baked GLB creation, contact measurements, and canonical catalog registration.
- **Motion Library owns:** immutable motion IDs, source identity, rig compatibility, measurements, library GLBs, and licensing notice.
- **Animation Library UI owns:** browsing, preview, editorial display names, tags, inclusion/exclusion, semantic role assignment, notes, and reversible JSON patches.
- **Resident Atlas consumes:** approved character profiles and semantic motion-role assignments.
- **World/Combat/Racer consume:** selected compatible clips through their existing actor/runtime owners.
- **GPT Site later owns persistence:** saved editorial patches, test notes, uploads, and version history. Do not simulate a backend here.

Never silently retarget an incompatible clip, rename an immutable source ID, overwrite source catalog bytes, or claim an untested actor/clip pair is compatible.

## Core screen

Use a responsive three-region composition in the existing ToolBox design:

### 1 · Motion browser

Left side on desktop; collapsible drawer on narrow screens.

- live search across display name, immutable ID, tags, cluster, source pack, and notes;
- animated preview cards using the currently selected character where technically affordable;
- fallback to the real catalog contact sheet only when a live card is intentionally sleeping for performance;
- selected card is unmistakable but not visually noisy;
- show short, human labels first; technical identity is available behind a compact info affordance;
- virtualize/lazy-load the list; only visible cards animate;
- `prefers-reduced-motion` and a “previews pause” control are mandatory.

### 2 · Main preview

Center/right, largest area.

- selected registered character in full color and its KFB/ClayBound material;
- play/pause, scrub, speed, loop, camera reset, orbit, and ground-contact indicator;
- display actual compatibility state: `PROVEN`, `UNVERIFIED`, `INCOMPATIBLE`, or `SOURCE_REQUIRED`;
- no silent fallback character and no white/grey placeholder as the claimed final state.

Two preview modes:

1. **Studio** — neutral clay floor/backdrop, colored model, shared Render R0 contact shadows; useful for close inspection.
2. **Terrain** — a small real KFB ClayBound/Knet world strip with ground, curb/road or terrain context so walk, run, jump, climb, throw, seated and prop actions can be judged against contact and scale.

The Terrain view is a preview consumer, not a second WorldBuilder.

### 3 · Editorial inspector

Right drawer/panel on wide screens; modal sheet on narrow screens.

Always show the difference between immutable source facts and editable editorial metadata.

Editable:

- `displayName` (for example distinguish several clips currently called “Talking”);
- tags and semantic cluster;
- short description/notes;
- `exportEnabled`;
- Resident roles and signature-move assignments;
- preferred variant per role;
- preview start frame/poster frame;
- optional per-character compatibility verdict and note.
- optional local-intake correction patch for arm, wrist, root and loop preview settings.

Read-only:

- immutable motion `id`;
- GLB clip name;
- source catalog version/checksum;
- rig family;
- measured duration, frames, loop, root motion, travel and contacts;
- license/source restrictions.

Do not display unsupported sliders merely because Mixamo has them. Trim, mirror, arm spacing, retarget tuning, or root-motion editing may appear only when a real existing owner/API supports and persists them. Otherwise label them as a later production feature, not an active control.

## Character selector

Support a data-driven roster, not a hard-coded carousel.

Minimum real categories:

- KFB/FrizzleBob rigs;
- KayKit Rig_Medium actors;
- KayKit Rig_Large actors;
- other registered GLB actors with a declared rig profile;
- `UNVERIFIED` actors visible but clearly gated.

The selector shows character name, rig family, look/material profile, supported library, and validation state. Arbitrary user models are admitted only after the import/rigging owner has registered a real actor profile. “Loaded URL” is not compatibility proof.

## Filters and clusters

Provide a compact filter button that opens a multi-select panel. Initial semantic groups should be derived from the real catalog and may expand without UI redesign:

- locomotion: walk, run, backward, strafe, climb, jump/fall/land;
- idle/state: neutral, happy, sad, injured, defeat, kneel;
- talk/gesture: explain, chat, phone, point, react;
- action/combat: throw, shoot, melee, hit, defeat;
- dance/music;
- seated/vehicle/cockpit;
- prop/tool/quest;
- loop versus one-shot;
- in-place versus travel/root motion;
- Rig_Medium / Rig_Large / other registered rig;
- proven / unverified / incompatible;
- export included / excluded;
- source pack.

Filters remain understandable to Georg; detailed measurements belong in the info layer.

## Resident and runtime assignments

The prototype must include a small assignment editor demonstrating that one selected character can receive:

- default idle;
- walk/run style;
- one or more talk styles;
- reactions;
- signature moves;
- seated/cockpit behavior;
- optional role-specific fallbacks.

Assignments target semantic roles, then reference immutable motion IDs. Do not let a Resident configuration depend on the display name.

Example:

`talk.explain → kfb_talk_explain_b`, display name “Erklärt mit beiden Händen”.

If a role has no proven compatible clip, show a visible unassigned state rather than selecting a plausible clip automatically.

## Data and persistence contract

Use `ANIMATION_PROFILE_EXAMPLE.json` as the interaction contract. The prototype must demonstrate:

1. import the source catalog read-only;
2. apply a separate editorial patch;
3. export that patch as JSON;
4. re-import it;
5. prove no immutable source field changed;
6. preserve unknown/new catalog clips when Blender publishes a later manifest.

Prefer small patch records keyed by immutable IDs. Do not duplicate GLB files or the entire catalog into every character profile.

## Required interaction walkthroughs

1. Choose FrizzleBob or another proven Rig_Medium character.
2. Search `talk`; filter `talk/gesture` and `PROVEN`.
3. Select one of several similarly named talk clips and play it in Studio mode.
4. Rename only its display label and add tags without changing the motion ID.
5. Switch to Terrain and judge feet/ground/root motion.
6. Assign it to `talk.explain` for a Resident profile.
7. Mark an unwanted variant `exportEnabled: false`.
8. Switch to Rig_Large and show honest compatibility.
9. Export the patch, reset, import it, and recover the same editorial state.
10. Demonstrate narrow viewport without hiding search, character selection, playback, or save/export.
11. Drop a local FBX, show `LOCAL PREVIEW · NOT REGISTERED`, apply a wrist/arm correction A/B, and export an intake receipt without the raw FBX.

## Performance rules

- only the selected main preview may run at full quality;
- visible motion cards use reduced resolution/frame rate; offscreen cards stop rendering;
- reuse one renderer/canvas pool or contact sheets rather than one expensive WebGL context per card;
- ClayBound textures use size-based profiles and shared caching;
- Terrain mode loads on demand;
- Render R0 detail/shadow policy applies;
- provide a low-device mode: static card sheets, reduced preview FPS, simplified environment, no loss of metadata/editing.

## Visual direction

- existing ToolBox Production-03 design, not generic SaaS/dashboard chrome;
- lively KFB clay/DIY materials, readable controls, compact hierarchy;
- the working character and motion remain visually dominant;
- technical IDs, measurements and diagnostics are available but never clutter the main view;
- documentation/notes behind the existing ToolBox `Notes` affordance;
- no Adobe/Mixamo branding or near-copy.

## Required package

- one working `.dc.html` entry;
- local modules/assets used by the entry;
- real source manifest with exact GitHub paths and revisions;
- included sample editorial patch using real motion IDs;
- included sample local-intake receipt with a fake hash placeholder but no raw FBX;
- `START_HERE.md`;
- `RETURN.md` with problems first;
- `TEST_REPORT.md`;
- additive `CHANGELOG.md`;
- `NEXT_CHAT.md` for a fresh context;
- screenshots for Studio, Terrain, filter/search, Resident assignment, JSON roundtrip, and narrow viewport.

No fake PASS. If an exact model or clip cannot be loaded, mark that item `SOURCE_REQUIRED` and continue with the smallest proven actor/clip set.

## Acceptance gate

The design slice passes only if Georg can understand and perform the full flow without reading technical documentation:

**character wählen → Animation finden → ansehen → sinnvoll benennen/taggen → Resident-Rolle zuordnen → Export ein-/ausschließen → JSON sichern und wieder laden.**

And for new clips:

**FBX lokal hineinziehen → Kompatibilität sehen → Korrektur A/B testen → Intake-Beleg exportieren → erst nach Validierung in die Library aufnehmen.**

Stop after this prototype. The next separate Work slice will adopt the accepted interaction and data contract into the existing GPT Site/ToolBox runtime and persistent storage.
