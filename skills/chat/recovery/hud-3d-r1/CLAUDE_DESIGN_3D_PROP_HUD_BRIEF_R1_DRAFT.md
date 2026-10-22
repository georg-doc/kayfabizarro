# Claude Design · KFB HUD 3D Object Compositor · R1 · DRAFT FOR WS0 REVIEW
**NOT CLEARED TO EXECUTE. WS0 must first issue a GitHub source/owner/rights ACK. Georg alone approves the visuals.**
**Intended executor:** the **existing Claude Design HUD workspace**, retaining its useful layout/composition history. No new standalone Claude app, Blender production pipeline, runtime or UI replacement project. **Product:** authentic, economical 3D Claymation HUD visual study (not game code). **References:** GitHub only.

## 0. Mandatory GitHub preflight (no Dropbox)

1. Read `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
2. Read `skills/chat/recovery/hud-3d-r1/WS0_HUD_3D_CLAUDE_DESIGN_INTAKE_R1.md` and require WS0 `READY_FOR_DESIGN` or explicitly scoped `READY_WITH_NAMED_SOURCE_GAPS` with actual checked source paths + isolation outputs. Without that: **STOP AT SOURCE REQUIRED**, do not invent.
3. Use `skills/chat/recovery/hud-3d-r1/HUD_SOURCE_DONOR_INVENTORY_R1.md` for **each original source model**, GitHub path, provenance, and current READBACK/ISOLATION status.
4. Historical layout refs on `docs/kfb-decisions-register-2026-10-11`: `HUD_R4_DESIGN/BRIEF_CLAUDE_DESIGN_HUD_R4.md`, `HUD_R4_DESIGN/ref/` (8 images), `HUD_LAYOUT_R3.md`, `HUD_UX_STATES_R1.md`; full exact prefix and blobs in Inventory. They document design history, **not** authority to reuse woodboard, rectangular filler, 2D compass or fixed R3 placements.
5. The full, additive original conversation contract is kept at `skills/chat/recovery/KFB_DIEGETIC_CLAY_HUD_CONCEPT_R0_2026-10-22.md` §§1–10 for traceability. Use later corrections first (especially §§7–10). **Do not paste 50k historical prose into one unconstrained design prompt.**

## 1. Visual goal (no alternate interpretation)

A responsive *arrangement of genuine small 3D objects*, all clearly crafted from the same KFB clay world: recognizable original geometry, softly handmade material under the actual K1/H0 Clay Golden, subtly asymmetrically weighted dark KFB outline (bottom right stronger), purposeful warm halo for state, unobtrusive deformation. The existing wooden 2D HUD may inform **relative layout weight**, not be retained as board/panel background or generic chrome. No flat icon sheet, SVG substitute, fake 3D or replacement branding.

**Permanent L0 objects:** 6 canonical Fluff orbs **at the top**, ghost-grey 0 when absent, small rounded clay numerals on the balls; a separately legible total score **only when a real authoritative score exists**; **free-floating fully 3D target arrow** without compass dial, base, backing or permanent minimap; original-landscape KFB Almanac card stack/fan (top-left preference, unapproved final layout); key Radio/cassette with play toggle, next, sound and compact source-title ticker; 3D animated chest or verified Bag; up to 6 physical weapon/ability props and distinct contextual interaction prop. Speed gauge is a **separate mode-dependent small clay bar + number**, not a dial forced into arrow/compass.

**L2 flyouts:** map/real goal+POI selector and later recognizable rest-stone teleport affordance from arrow; playlists/song queue and audio bus settings from Radio; recent cards from Almanac. Flyouts expand inward and obey safe areas; close other L2 on open. **L3** same usable responsive clay presentation for near-full Bag 20 slots, Settings, full Almanac/PDF cards. There is no new data owner or audio mix engine.

**Shared state grammar:** Idle outlined, Hover subtle lift/glow, Click squash, Active warm quiet glow, Context Hint gentle pulse, Cooldown desaturated with original colour **restoring bottom-to-top over the actual silhouette**, Ready microhop/flash, New receipt arrival. Selected/equipped and cooldown/hint are concurrent independent states, not contradictory colours. Subtle physics-responsive object tilt/lag; hit targets and labels remain stable; reduced-motion option.

## 2. Layout variants, not reinvented UI

Compose with **the same verified actual donor objects and lighting**:
- **A Story-first:** Almanac top-left, 3D goal arrow top-right peripheral, six Fluff across top, chest bottom-left, action props bottom centre, Radio lower-right at comparable **visual importance** to Almanac/navigation. Adjust small positions for flyouts and visible avatar.
- **B Original-Fluff-priority:** different spacing/weighting of the *still-top six orbs* while preserving full Radio/Almanac prominence and free arrow.
- **C Grouped-collection:** Almanac/Fluff collection concept composition (Fluff still top, not lower-left), readable total score and separate chest.

**NO new wood panel**; no "layout" proposal via simplistic flat SVG. Actual captured 3D object render with original sources is required. At desktop 16:9 plus phone landscape and portrait, test: resting HUD, map+target selector open, Radio queue open, card fan open, large Bag/Settings overlay, drive/flight, combat with Primary/Secondary selected/cooldown. Do not auto-select A; Georg decides `A/B/C/TUNE/FAIL`.

## 3. Three essential motion proofs, NOT disconnected easing fragments

**Fluff:** show a **source-backed real yellow Fluff orb** picked up while camera/character moves → uninterrupted track into the **yellow top-row HUD orb** → squashed elastic contact → visible numeral **2 → 3**, with original ball identity/colour. The gameplay transaction is already owned elsewhere; VFX only acknowledges receipt.

**Card:** original *unmodified landscape KFB PDF/card face* granted/picked up → one uninterrupted 3D/screen-projected movement into the original-art Almanac stack → contact, insertion and settle. Read Travel `card-flight.js` camera-space spring postmortem as **donor**, not licence to string 3–4 sequential animations.

**Item/music:** original source prop to actual opening `Chest.gltf` mini, closing and count bounce; tape/song carrier to Radio with source-title ticker/playlist receipt. The Radio does not restart music merely because HUD is touched; it delegates to Audio owner. No instant teleport at the HUD edge and no ersatz confetti replacing the source object.

## 4. Outputs and gates — visual, not theoretical

Deliver **only after donor objects are visually isolated**:
1. **Identity contact sheet**: untouched original donor rendered alone vs KFB Clay/outline version, same camera/light/true icon screen size, file/pack identity visible; at least arrow, six Fluff, actual Card, radio/cassette, opening chest, one blaster + grenade + boot. Test yaw/pitch for arrow and open/close for chest. Do not show source URL load as proof.
2. **2–3 actual spatial HUD composition boards**: same in-game source background, same actual donor-set, desktop 16:9 and mobile comparisons, L0 + L2/L3 occupancy. Match source layout history without reproducing wooden UI.
3. **One state board** for the *same selected actual source prop*: Idle/Hover/Click/Selected/Hint/Cooldown 0/25/50/75/100/Ready. Include 2 concurrent states and reduced motion.
4. **Three short continuous animation captures**, not montages cut to hide bad transitions: arrow yaw+up/down, yellow Fluff acquisition 2→3, authentic Card acquisition. Optional chest and tape if time/asset quality allows; every frame source-backed.
5. **A short decision sheet:** `KEEP / TUNE / REJECT` per donor and per composition, names of missing sources (not imaginary replacements), note performance assumptions as **UNKNOWN unless actually measured**.

Success means Georg can choose an authentic overall **look, layout and motion grammar** without implementation guesswork. Failure means preserve the exact smallest failing source/candidate for WS0; do not silently swap in flat placeholders. After two non-improving repair passes on one seam, export it and let parent outcome continue unless Production Guard proves critical.

## 5. Boundaries

**No** gameplay crafting/teleport/score-rule implementation, invented six-Fluff-spend economy, unauthorized UI role changes, new HTTP asset delivery path, second renderer/audio/store owner, paid Mystery asset public publication, auto-merge, live promotion, or unsupported "ready/live" claims. **Blender MCP only on demand for one missing real source object after explicit Georg approval.** 3D source-identity before any integrated art.

**Delivery surface:** reuse current existing Claude Design workspace and project acceptance route. Deliver saved source and proof into the existing GitHub HUD owner/PR for recovery. No new Site/Cloudflare route without a separate authorized acceptance reason. Handoff GitHub exact branch/head/files, actual source-isolation visuals, real test counts and one gate: **Georg visual PASS/TUNE/FAIL → only then WS1 runtime integration**.

**NOTE:** This brief is a **DRAFT** for WS0 to reconcile; it does not certify source completeness, model licences, any visual proof or readiness to execute.
