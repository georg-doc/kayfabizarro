# WS0 intake · KFB 3D Prop HUD → Claude Design · R1
**Status: WS0 REVIEW REQUEST · NOT CLEARED FOR DESIGN BUILD**
**Repo / owner:** `georg-doc/kayfabizarro` · existing HUD Flight R3/K7 convergence + WS1 gameplay/Audio/Card/Inventory consumers. **One planning PR:** [#444](https://github.com/georg-doc/kayfabizarro/pull/444), branch `planning/kfb-diegetic-clay-hud-r0-2026-10-22`. No runtime, Blender-MCP bulk job, new Stage/Site or second HUD owner approved. Do not merge.

## Decision sought from WS0

**Can Claude Design, with its existing historical HUD workspace, act as visual lead using ONLY the currently verified GitHub references and named source models?** Choose:
- `READY_FOR_DESIGN` **only after** object paths, rights, ownership, source isolation method and actual input history can be demonstrated;
- `READY_WITH_NAMED_SOURCE_GAPS` only when the missing sources are noncritical and their omission cannot lead to substitute/generic designs;
- `SOURCE_REQUIRED / NOT_READY` if any must-have prop or canonical source artwork is not reproducible at review size.

WS0 owns intake arbitration, **not** creative approval. Georg owns A/B/C/TUNE/FAIL on the eventual visible design. Do not make Georg arbitrate stale source paths when WS0 can resolve them.

## Immediate GitHub read-first (no Dropbox dependency)

1. `skills/chat/START_HERE.md`; `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`; `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
2. [Complete HUD concept](../KFB_DIEGETIC_CLAY_HUD_CONCEPT_R0_2026-10-22.md) §§1–10. **Latest §10 and §9 supersede conflicting older descriptions.** This 50k document is recovery/archive, **not** an input prompt to paste into Claude Design.
3. [GitHub source inventory](./HUD_SOURCE_DONOR_INVENTORY_R1.md), with exact repo-relative paths/blobs and candidate/gap status.
4. Original historic R4, R3 layout **nonbinding**, HUD UX R1 plus eight image refs on GitHub `docs/kfb-decisions-register-2026-10-11` @ `8eaf0b36997160aa5a368dd4ae137ab5a6d318e6`, full paths in inventory.
5. Accepted Clay Golden `KFB_CLAYMATION_STYLE_SSOT.md` + `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` on `work/clay-style-ssot-2026-10-01`, not a new smooth/gloss shader.

## Binding current creative requirements (do not re-litigate)

- **Every visible key HUD control is a real 3D source-backed prop** in subdued KFB Claymation + genuine outline with stronger lower-right silhouette and state-specific subtle luminous halo. **No wood/faux-wood board, generic flat icon/SVG proxy, fake instrument base, new logo/chrome**. A source-derived cached image is an allowed rendering optimisation **only if actual donor shape and source identity have been proven**.
- Six canonical D6 Fluff orbs **across the upper HUD**, each with rounded 3D/clay number over/in front; zero stocks ghost-grey/0. On genuine acquisition same-colour world object flies **in one uninterrupted track** to exactly its matching orb, squash/stretch/catch, count +N. Total score is a separate potential larger 3D number near orbs, **source/aggregation unresolved**.
- Navigation L0: **only a freestanding 3D arrow**, truly rotates yaw and pitch toward target, with short distance/up/down cue, **no compass, plate, 2D circle or permanent minimap**; clicking opens L2 real minimap and goal/POI/possible later rest-stone selection. Existing goal/travel owners decide actual target/teleport. Drive/Fly may show a **separate** slender clay speed bar/number, not a forced compass-tachometer.
- Authentic Fractal Almanac cards in their original natural landscape ratio; compact 3D stack/fan, **top-left is Georg's strong candidate, placement NOT visually locked**. Actual Card moves intact and continuously into fan, no 3–4 disconnected animations. PDF/card art never tinted.
- Radio/physical cassette **is a core equal-weight module** alongside Almanac and navigation; compact play/pause-or-stop toggle, next, sound control, shortened source-track ticker, **L2 flyout for playlists/queue/music/ambience/character speech-melody settings**; always delegate playback/mixing to the existing Audio owner; no second AudioContext.
- Collected items → small animated 3D chest/Bag-of-Holding entry; source candidate Quaternius `Chest.gltf` has real `Chest_Open`/`Chest_Close`; compare existing Hoarder backpack but guard paid Mystery asset rights. Opens existing **20-slot** L3 Bag, no new inventory.
- Primary/Secondary/tools and skill props are actual blaster/grenade/boot etc sources; independent Idle / Hover / Click / Selected / Context-Hint / Cooldown (colour refills bottom-to-top) / Ready / New states. Separate 3D interaction prop, not stolen action slot 6. Animation reacts subtly to vehicle momentum without moving hit regions.
- L2 one open flyout at a time (map, radio, Almanac); L3 large near-full-screen Claymation overlays share responsive visual presentation (Bag, Settings, full cards), replace wood. Show their screen-space collisions before choosing final anchor positions.
- `Kayfabrizieren` when six Fluff and a missing card from already-known Deck, crafting props with Witch later, and rest-stone teleport remain **hypotheses**. No game-logic invention: six total vs six colours/recipe unknown, High/Low resource types vs current six counters unresolved, score distinct from spendable stock, teleport gating unimplemented.

## Source QA actions WS0 must perform before giving Claude Design the brief

1. **Donor identity audit:** open actual Kenney `arrow-rounded.glb` and Quaternius `Arrow.gltf`, original Fluff ball from active WS1, original Almanac 3D/Card art, Tiny Treats `radio.gltf` vs candidate cassette GLB, Quaternius animated `Chest.gltf`, Kenney free blaster/grenade and Tiny Treats boots. Each in isolated source view before scene assembly; original/Clay/outline comparison. **A successful asset URL or catalog search does NOT count as shown source model**.
2. **Rights/source dependencies:** check licence/pack and dependent textures/buffers, especially Google Poly cassette and paid KayKit Mystery. Public-ready candidates must not expose purchased bytes; planned repo-private switch must not break asset delivery. Prefer already present repo paths; do not create asset copies or placeholder props.
3. **Owner/contract map:** K7 actual HUD implementation vs Flight R3; WS1 six `world/fluff.js` kinds + `kfb.save/1`; 3D-world pickup/receipt; exact Card/PDF/Deck crop and Almanac fan source; Audio Jukebox/voice/ambience bus; 20-slot Inventory; navigation source / return-teleport route; one render context strategy. No second runtime owner.
4. **Layout-history reconciliation:** compare genuine GitHub R4 refs, J17, R3, existing Claude Design composition; gather newer N34 images from Dropbox **into GitHub only if they contain unique accepted evidence**. Do NOT copy obsolete wood/flat images as positive 3D Golden samples. Note source-sha for anything imported; user should not have to attach Dropbox for Claude Design.
5. **Proof budget:** design first with existing source assets and light/shader, no Blender MCP batch. Only if one selected source prop cannot be isolated or minimally adapted, propose a **single named** Blender MCP request with cost/why required and obtain Georg approval. No automatic paid-token work.
6. **Provide ready-to-design intake packet**: table `role → chosen exact GitHub path/blob/pack/license/readiness → isolated image/clip → runtime owner`, up to three layout options and clear source gaps. `NOT_READY` if no source image/clip or unresolved key asset.

## What to report back (one concise WS0 ACK)

`STATUS: READY_FOR_DESIGN | READY_WITH_NAMED_SOURCE_GAPS | NOT_READY`; source/branch/head and **exact verified candidate assets**, missing assets/reference images, K7-vs-R3 owner decision, license/Cloudflare-private-switch guard, isolated donor visual proof paths, no-wood/standalone-arrow acceptance, launch condition for Claude Design. One **next gate:** Georg reviews authentic isolated hero props and A/B/C composition before any WS1 implementation.

**No new KFB runtime/P0 gate is created by this planning task.** WB2 Island MVP R4 remains STOPPED/NO MVP. The drafted Claude Design brief is adjacent, deliberately **unreleased pending WS0**.
