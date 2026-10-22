# KFB · Diegetic Claymation Prop HUD R0 · 2026-10-22

**Status:** GEORG DESIGN DISCUSSION / PROPOSAL ONLY — no build authorization, no changed runtime, no human visual PASS, no Stage/Live. Intended as an **after-current-MVP HUD skin/interaction experiment**, not an expansion of blocked Island MVP R4.

**One receiving owner:** Existing KFB HUD/Flight line (R3 `hud-flight/kfb-hud.js`, `kfb-backpack.js`); reconcile with **K7 Knet-HUD** `lab-clay/clay-hud.v1.js` before modifying any HUD implementation. Current game/world, character, inventory, audio, card and input owners remain authoritative. WB2 R4 / PR #348 stays STOPPED, NO MVP; do not perform world/runtime fan-out.

## 1. Product intent

Replace the visually mismatched wooden-board HUD aesthetic with a **diegetic / object-based Claymation interface**: the player sees small recognizable objects from the same KFB world instead of generic rectangles or buttons. Must feel deliberately crafted and remain readable, unobtrusive and mechanically reliable in walking, driving, flight and combat.

The HUD objects behave like small tactile props with short, controlled motion reacting to game state; **not** a permanently tumbling interface and **not** an interactive 3D scene or a second game renderer.

## 2. Proposed constituent parts

| Component | R0 appearance & interaction | Source/ownership guard |
| --- | --- | --- |
| Six Fluff colours | Six small sphere objects, each matched to the authoritative world Fluff visual and actual canonical palette, each with readable numeric amount; absent colour = restrained semi-transparent/desaturated sphere, count 0; intake bounce only on collection, never arbitrary colour changes | Read real Fluff six-mode state and V-292 palette, do not reimplement player inventory/health/currency semantics. No assumptions about whether the 6 channels are HP, collectible ledger, currency, story modes. Distinct labels/shape/focus affordance for non-colour recognition. |
| Compass / speed / minimap | Closed: tactile KayKit/KKIT compass if verified, small legible speed readout on one face in Drive/Flight; walking shows bearing, no extraneous speed. Open: compass lid becomes map frame showing **real current player and world position**, not a baked illustration; orientation and fold animation remain physically plausible | Search exact compass source and inspect isolated mesh/texture/scale/rights before adoption. Real map/telemetry from existing world/locomotion owners, not independent navigation. If no suitable model, source-required; no invented replacement donor. |
| Fractal Almanac | Current authoritative KFB card art/text/ratios, presented as gently rounded thin clay-backed **3D cards**, with visible thickness and a stack; card fronts must not be stretched, redrawn, recoloured or replaced by generic tiles. Click/drag top card to open established viewer/reading interaction; stack never obscures card text | Original card/Deck/PDF viewer, single card-state owner, preserve readable proportions and source-backed art. Prefer flat textured planes or cached views; no high-poly geometry per card. |
| Action controls | Existing selected Primary / Secondary / pickup / active ability shown as source-backed 3D mini-props: e.g. blaster, boot for sprint, consumable; clear selection/state/cooldown and keyboard/gamepad/touch equivalence; unavailable greys/ghosts without being confused with enabled props | Item/equipment/action owners still decide slot assignment and use; no invented abilities or fantasy weapon models. Source objects must be shown isolated. |
| Bag / inventory | Existing KayKit Hoarder_Backpack mini (already in HUD Flight R3) **or** verified source-backed sack-like model if Georg prefers a loose coin-sack silhouette; clear item count on or anchored to prop; click opens the existing **20 slots** (5 × 4), optionally Clay-framed but not a replacement inventory | Reuse `kfb-backpack.js` bag overlay and real item list / save, not a second inventory. Current Hoarder_Backpack is a backpack, **not verified as the sack Georg describes**. Assess model rights before public build. |
| Radio / altitude / flight | Retain current R3 interaction model and Audio owner; surface only when mode-relevant. Condensed into the object language as appropriate; no additional console/dashboard chrome | Do not spawn a new audio mixer or change the existing event contract. |

## 3. Layout and motion grammar (candidate, not locked)

Top peripheral line: six Fluff spheres as a light-weight group; upper side: Almanac closed stack. Lower peripheral corners: hinged compass/speed/map and sack inventory; action mini-props near relevant thumb / click reach. Centre/play field/character remain unobstructed; mobile collapses secondary controls by mode rather than scaling everything to illegibility.

**Diegetic response to physics:** derive a **filtered visual-only signal** from existing velocity, turn-rate, acceleration and impact events, never directly feed HUD motion back into gameplay. Low amplitude, camera-independent object tilt/lag/spring: e.g. ±2–4 degrees and a few screen pixels (proposed bounds for test, not preapproved). Stronger reaction for braking/impact; no constant wobble, no nausea-inducing oscillation. Return promptly to rest. Distinguish interaction hover/press from vehicle shake: hit targets and text must stay fixed/stable; moving visible art does not move input hit areas. Reduced-motion option = static props. Never animate every numeric counter each frame; update on state events.

**Interactions:** object visual is only presentation; semantic DOM/hit layer supports keyboard focus, pointer/touch, gamepad, screen-reader labels, consistent click area. Need zero-state, loading-state and low-end fallback. No forced opacity reduction that makes numeric labels unreadable.

## 4. Performance architecture & hypotheses

**Preferred MVP A/B:** hybrid HUD. Keep six sphere graphics and numeric DOM/Canvas labels cheap; genuine 3D models limited to compass opening, bag, and occasionally active weapon/ability. Static props can be pre-rendered **from verified source models** into atlased/cached views with DOM/CSS transforms; use genuine animated 3D for opened or high-value objects only. Card front artwork stays flat texture with lightweight thickness/stack geometry. Reuse current render/context wherever technically possible.

**Known donor caveat:** R3 `kfb-backpack.js` already creates a **separate THREE.WebGLRenderer for the prop view**, renders a miniature and copies `r.domElement` onto 2D target canvases; `mountBackpackMini.tick(dt)` redraws continuously. One shared donor prop-renderer is preferable to a renderer **per object**, but even a single second WebGL context and repeated copying can cost GPU memory, CPU work, compositing and mobile robustness. Inventory opened with 20 independent animated GLTF previews would be a likely frame-time problem. Profile before deciding to keep/replace that donor strategy.

**Alternative:** one additional HUD scene/camera pass using the game's existing WebGLRenderer (not a second runtime owner), composited in defined viewport regions, only if it passes isolation and integration tests; watch WebGL state cleanup, depth/occlusion, transparent overdraw, resize, input and scene lighting. Otherwise use cached static thumbnails and only animate transforms.

**Target budgets, not measurements or promises:** aim for <1 ms additional HUD frame cost on representative focused desktop GPU, review mobile against a <2 ms incremental target where feasible, 60 fps frame budget 16.7 ms; avoid a significant memory rise and texture churn. Record before/after FPS **and** p95 CPU frame time, GPU timing if supported, draw calls, texture allocations, number of contexts, long tasks, battery/thermal effects on a real phone. Compare 0 props, cached thumbnails, continuous 3D and hybrid. Disable idle renders/event-driven redraws where practical. Per-profile fallbacks and low-motion mode required. No runtime metrics currently available, classify performance **UNKNOWN**.

## 5. Mandatory sources and visual gates

1. Read existing HUD R3 `docs/LIVING_HUD_FLIGHT.md`, `docs/SPRINT_R4_PLAN.md` plus K7 actual source; run **side-by-side HUD owner arbitration** first. No two HUD implementations.
2. Read shared Clay SSOT `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md` and Golden Matrix from branch `work/clay-style-ssot-2026-10-01` (and check current authority on intake). Verify source objects **in isolation** before integrated screenshots. Asset URL loading alone is not object-identity proof.
3. Inspect actual KayKit compass candidate, bags/sacks, weapon and boot props (paths, licensing and origin, model geometry/textures). Existing Hoarder_Backpack is verified in repo; exact compass / sack are **not yet verified**. Paid KayKit Mystery assets may not be copied to public repos/CDN by default; check rights and private/public delivery.
4. Read six Fluff types/palette and authoritative state, canonical Almanac cards/Viewer/PDF, bag state/input/action slots, locomotion telemetry; a missing source remains SOURCE_REQUIRED, not a new placeholder.
5. Isolated Golden montage per object (unmodified donor → Clay interpretation → compact HUD render), then one single integrated HUD screenshot per mode (Walk / Drive / Flight), desktop + mobile; confirm card ratio and legibility.
6. Instrument continuous Drive + turns + braking + Fluff pickups + 20-slot open/closed while profiling performance and input reliability; check reduced motion and fallback; independent design critic / integrator acceptance.
7. Georg chooses **KEEP / TUNE / FAIL** on the smallest proof before any wider integration.

## 6. Bounded next gate

**WS0 HUD owner and donor intake R0.** Decide whether this is a post-MVP visual skin candidate in the current HUD Flight/K7 owner, and identify the exact producer/consumer code, verified compass/sack props, six-Fluff state API and target reference device. If approved later, WSA/Claude Code can build exactly **one isolated Fluff+Bag+Compass comparison** in the existing HUD Lab, not touch WB2 R4 or promote Live.

**Evidence as of proposal:** inspected current main at `7e1c4ab0f143b2f1c0f33017eb473574f20190c9`, R3 HUD source and donor handover, K7 references, Clay SSOT branch source, current WB2 PR #348 STOP status, WS1 branch head `effefbd98b4611ba9b7b746d8d5fa272e9a3b468`. Source read **only**: 0 original visual isolation, 0 new runtime render/test, 0 performance benchmarks, 0 published Site/Stage.

---

## 7. 2026-10-22 · Layout recovery and interaction-state correction (SUPERSEDES any perceived R3 layout lock)

**Georg's correction:** WS0's Dropbox `HUD_LAYOUT_R3.md` was composed without the full previous design alternatives. It is **one source proposal, not a locked layout or comprehensive latest design SSOT**. The Fractal Almanac is central collection / progression and Georg specifically sees **top-left as promising**. Do not transfer an unreviewed R3 element position into Claude Design as a binding design decision. Preserve competing layout options until a real side-by-side Georg design gate.

**Source inventory confirmed read from public Dropbox share `/CLAUDE/KFB Hud + UI` (17 immediate items on 2026-10-22):** `HUD_LAYOUT_R3.md` (WS0 V-681), `HUD_UX_STATES_R1.md` (V-673/V-674), images `N34_r2_1_layout.png`, `N34_r2_2_teile.png`, `r2_hud_1_otown_1080p.png`, annotated compass reference, HUD R3 Walk/Drive/Bag-open, J17 minimap, and six latest time-stamped screenshots. Linked images were preview-indexed, **not full-resolution compositional pixel-audited** in this chat. R3 refers to earlier `HUD_R4_DESIGN/BRIEF_CLAUDE_DESIGN_HUD_R4.md` §§3.1/3.4/3.4b, J17 and V-043, V-333/334/340: those exact referenced design sources are **not yet recovered/verified here** and must not be silently replaced by R3's paraphrase.

### Candidate alternatives to evaluate at 16:9 and narrow/mobile size — none yet accepted

| Candidate | Top-left | Top-right | Lower-left | Bottom-center | Lower-right | Main benefit / risk |
| --- | --- | --- | --- | --- | --- | --- |
| **A · Story-first diagonal (initial design preference to prove, NOT PASS)** | **Fractal Almanac** original landscape cards as compact 3D stack/fan, expansion downward/inward on explicit open; goal/island as slim separate readout, not covering cards | Hinged physical compass / speed ring and open minimap | Six original 3D Fluff coloured orbs/counters + collectible bag/chest as source-backed objects | Up to six 3D action props, dedicated interaction prop adjacent, not slot 6 | Radio / settings grouped lightly by mode | Strong separation: story, navigation, collection, action, sound; check upper-left card reach and lower-left pile-up |
| **B · Original upper Fluff row** | Fluff collection cluster / six orbs in the upper-left or compact upper strip, retaining Georg's earliest top-Bar replacement gesture | Compass/minimap | Bag or chest + collection feedback | Actions + separate interaction | Almanac stack at upper-right edge or independent side position, radio subordinate | Highly visible six Fluff; risks burying Almanac and crowding navigation |
| **C · Collection paired with Almanac** | Almanac top-left with collectible spheres aligned directly below / beside it, *not* drawn as a full horizontal bar | Compass/minimap and map state | Sack/chest as collection intake | Actions + interaction | Radio/settings | Strong thematic grouping of collectibles, but may overload one corner or interfere with card fan |

For each alternative: draw **actual existing source-backed 3D silhouettes and real 16:9 screenshot bounding boxes**, not flat wireframe substitutes masquerading as finished aesthetics; demonstrate card fan open, minimap open, walk/drive/combat, and phone landscape/portrait. Use exactly the same set and scale of donor props / original cards to compare **composition only**. No final geography decided until Georg A/B/C/TUNE/FAIL. The previous R0's "top peripheral line of six spheres" is an earlier design idea, not a frozen rule; R3 lower-left Fluff likewise not frozen.

### Functional and interaction truth: source-defined, but spatially independent

- **All visible controls must originate from real 3D props / clay objects and match KFB clay/style SSOT; no wooden boards, faux-wood slots or generic UI icon replacements.** Cached source-derived renders are an allowed performance **presentation strategy**, not permission to replace the asset identity/design with ordinary flat UI.
- Shared state grammar per Dropbox `HUD_UX_STATES_R1.md`: **idle** consistent clean outline; **hover/focus** low glow and ~1.08 short lift/tilt; **pressed** 80ms squash/overshoot; **selected active** steady warm glow; **contextual hint** independently subtle pulse (e.g. Primary/Secondary available in combat); **cooldown** grayscale/desaturation with original colour *reappearing bottom-to-top over the object's visible silhouette* as time passes; **ready** brief flash and tiny jump; **new collectible** arrival hop. State timings and scale are candidates requiring full-size screenshot/animation review.
- **KFB outline:** dark `#130e16`, not hand-wobbly, lower-right optically heavier than upper-left, nominal candidate ~2 px upper-left and 3–4 px lower-right at gameplay scale. Reproduce source Golden before adopting. Luminous halo is a soft layer **behind** the actual prop, not a glossy edge pasted over the model. Do not mutate original source colour/textures to create the selected state.
- **Cooldown shader / render strategy:** mask/recover colour by normalized **screen-vertical height of the projected object silhouette**, with a narrow moving boundary; avoid wrong-direction recovery when a boot/blaster rotates. Do not rely only on hue for state; selected indicator and cooldown readability remain distinguishable. Test partial recharge and accessible reduced-motion state.
- **Separate concurrent channels:** functional availability/cooldown; selection/equipped; pointer/focus/press; contextual hint; pickup/event animation. A selected primary still can cool down; combat can hint both Primary and Secondary only if actually usable without overwriting their selection identity. Visual precedence and intensity must be tested, not improvised per component.
- **Interaction:** dedicated prop immediately next to action strip, not sixth action slot, per V-674. Existing KFB bubble-source must be used for any 2D bubble backing, not a new generic button; 3D contextual prop may extend beyond bubble. Fluff auto-collects.
- Preserve 20-slot inventory, authentic Almanac PDF/deck/card artwork proportions, compass lid semantics and target information as options pending exact earlier-reference recovery. Preserve readable text/counts and fixed hit areas when props deform.
- **Next gate is now preimplementation visual composition**, not ready-for-Claude-Design integration: read earlier R4 §3.1/3.4/3.4b and image donors, verify source props in isolation, produce true-to-source A/B/C comparison of **composition first**, then a separate single-state sheet covering Hover / Active / Click / Hint / Cooldown before handoff.

**Checks here:** textual Dropbox spec intake and 17-entry directory listing only; **0 isolated rendered donor objects, 0 full-resolution reference visual adjudications, 0 3D browser tests, 0 actual performance measurements, 0 site/stage publish.** Continue on existing PR #444 / same HUD owner; WB2 R4 STOP remains untouched.


---

## 8. 2026-10-22 · Flyout / overlay / target-navigation / travel-mode architecture R0.2

**Status:** interaction architecture and layout evaluation **proposal**, not Claude Design build approval. Georg requests to reconsider *states and hierarchy before object form*. No position from the WS0 HUD_LAYOUT_R3 is locked. Annotations from §7 supersede preliminary positioning in §2/3. The radio is a **core equal-weight entry point** beside navigation and Almanac, not a tiny settings accessory.

### 8.1 New recovered provenance and precedence

Read original Dropbox `/CLAUDE/KFB_HUB/30_DECISIONS/replies/HUD_R4_DESIGN/BRIEF_CLAUDE_DESIGN_HUD_R4.md` (16 October, 10,256 bytes) as well as Dropbox `/CLAUDE/KFB Hud + UI/HUD_LAYOUT_R3.md` and `HUD_UX_STATES_R1.md`.

- Original R4 §3.1: *world-mounted* arrow above player/vehicle + distant destination ring, mellow ~0.3s heading smoothing, upward/downward flight tilt, goal/distance, proximity moves toward green; actual source-backed candidate arrow D Kenney rounded and A Quaternius Arrow. Current Georg steering: move the persistent direction arrow **into the HUD navigation area**, not centre-of-world/above head; keep destination ring as a possible world-side arrival aid. Do not reintroduce old arrow placement merely because R4 had it.
- Original R4 §3.4: six fixed story-mode Fluff pips and canonical colours, genuine unchanged card art; §3.4b suggested minimap top-right + seven-card fan directly below. Georg explicitly reopens this composition and sees Almanac **top-left as compelling**.
- Original R4 allowed incidental wood/cardboard accents as one style variant; **current Georg update rejects the wooden-board look altogether**. Use source identity in original 3D props and accepted clay materials; do not resurrect wood as a UI substrate.
- Current HUD Flight R3, K7, earlier J17 and HUD Rig are donors, not alternative system owners. In main, `kfb-hub/stage/stunt-world/hud-rig-v1/hud-rig-lab.mjs` provides historical lab `setNavigation({ active,type,bearing,distance })` (bearing/distance), but this is **not evidence** that the current WS1 game exposes authoritative vertical delta, goal priority or flight targeting. Integration must source those from the existing quest/POI/game-state owners rather than invent a parallel navigator.

### 8.2 Interaction depth — one hierarchy across all props

| Layer | Content | Opening / dismissal | Spatial treatment |
| --- | --- | --- | --- |
| L0 persistent tiny object | Active destination arrow + distance/up-down cue; Fluff stock; Almanac unopened mini-stack; Radio mini with Play/Stop/Pause toggle, Next and Sound quick control; available primary/secondary quick props; contextual hints | Remains while navigating, with mode-driven compactness. Keyboard/focus equivalent for every object. | Peripheral anchors, centre/character clear. No big translucent HUD background. |
| L1 contextual state | Combat availability, cooldown, interaction, pickup, mode-specific speed/boost/altitude, new card notification | Appears only when its event/state exists; automatically reduces noise again | Overlay on or next to *the existing prop*, not a new panel system |
| L2 flyout / expansion | Navigation **minimap + quest/POI target selection**, Radio **track + playlists + audio-bus controls**, Almanac **recent-card browse**, optional compact quick settings | Explicit click/tap/key; Esc/back/click-outside closes; default one L2 at a time, preserve local selection. Radio playback persists when its flyout closes. | Expansion constrained to calculated safe area and screen edge; expands **inward**; no clipping or collision with other anchors. A non-modal flyout leaves movement intact but should not steal keybinds unexpectedly. |
| L3 common large overlay shell | Settings, existing 20-slot Bag, full Almanac/Deck/PDF viewer, full card moments when already part of game | Explicit entry, consistent close/back and focus return. Opening L3 closes L2; game input policy from existing runtime, no shadow-owner. | Same responsive usable size/safe bounds as existing Bag/Settings, near-full viewport with clay relief and correct source artwork. **One shared presentation family, not wood boards; no second inventory/cards/settings logic.** |

**Rule:** small prop L0 is the entry point, large panel L3 is content. A real 3D object does not imply that a 20-slot inventory, a playlist catalogue or a readable PDF must be folded onto an impossible 3D surface. Use a clay material frame and authentic elements, preserve fixed targets and type legibility.

### 8.3 Navigation split into three independent instruments

**A · Persistent GOAL POINTER (primary)** — compact clay 3D arrow embedded in or adjacent to navigational object/housing, **always meaningful if objective exists**, orientation relative to current player's facing / camera with a documented frame choice. Numeric target distance and short title can be small adjacent labels. **Vertical relation**: arrow model visibly pitches upwards/downwards *and* adjacent ↑ / ↓ + optional signed height separation while flying or when vertical routing matters; don't use colour alone. Bearing smoothing / dead zone according to source R4 until user tests; near arrival cue and optional real-world target ring as own/world-side marker. Unavailable target: neutral navigator, not fictional quest.

**Goal selection/priority truth:** current active quest/delivery destination from quest owner first; user-chosen POI or waypoint only when explicitly selected; contextual recommended POI fallback only if game owners define it. Manual change persists according to existing state; changing target updates pointer + minimap coherently. Distinguish direct-line distance from path distance; until path route exists show direct-line distance, never claim route distance.

**Proximity colour**: movement toward target may shift from more urgent warm / contrasting far to green close following existing V-292/colour-source and current biome contrast; distances for bands are design candidates, not new quests. Keep numeric distance even when colour moves. Flight vertical delta is not encoded by distance tint; direction arrow and elevation cue are separate.

**B · MINIMAP (secondary, open as needed)** — opened compass/map prop is an optional *spatial reveal* experiment, not mandatory layout coupling. Displays terrain/known navigation features, player, active destination, and select-target list/selector. Have a state for zero landmarks and large-map accessibility. Use existing world marker/goal APIs and J17 clay minimap stylistic donor. Map open may coexist with pointer, but pointer/target still readable on return; selection accessible on touch and keyboard.

**C · SPEED/TRAVEL READOUT (situational, do not force round tachometer)** — independently sourced speed telemetry. Test thin clay vertical speed bar with small numeric speed below, versus a broad modest arc/ring attached to navigator. Use one semantics across drive/flight; mode supplies units, scaling, boost and bounds. Walk usually shows no speed gauge; drive shows speed and boost; fly shows speed and altitude/climb (+ energy/thrust only if gameplay truth requires); combat modifies action affordance, not travel physics. No fake readings. If compact pointer + speed ring compete, keep pointer clear and separate speed bar. The KayKit `compass_base` is a **candidate housing object**, not proof of optimal speed/map function.

### 8.4 Cross-mode matrix (functional)

| State | Persistent | Context / extra | L2/L3 remains accessible |
| --- | --- | --- | --- |
| Walk / explore | Goal arrow and distance, Almanac entry, six Fluff, Radio mini, collection/inventory, equipment if available | POI hint, context interaction, quest arrival | Mini-map + goal select; radio playlists/audio; Almanac; Bag/Settings |
| Drive | Same anchors, plus **speed bar/numeric speed**; objective points in steering-relative direction | Boost/drift/impact response, arrival, usable equipment as current game allows | Same menus; safe driving-input and pointer interaction policy |
| Fly | Same anchors, speed plus height/climb or vertical delta where meaningful | Altitude energy/thrust (only real systems), upward/downward destination cue | Same map and target selector; no center-screen HUD arrow |
| Combat or encounter | Normal travel/navigation stays visible but visually secondary to actual usable Primary/Secondary, selection and cooldown states | Short hint pulse only on genuinely available weapon actions; no indiscriminate glow | Equipment, Bag/Settings optionally restricted by existing game logic; audio always accessible |
| No objective / arrival | No fabricated bearing/colour/distance; neutral compass or last-known context if correctly labelled | Soft arrival confirmation and destination ring | Target chooser offers actual selectable targets |

### 8.5 Physical flyout collision tests before designing shell

Evaluate three layout alternatives from §7 on **all panel-open states**, at desktop 16:9 and mobile landscape/portrait, using true bounds for clickable areas and panel size:

- Almanac top-left → expand **down/right**; leaves exact card ratio intact; full viewer uses L3.
- Navigation top-right → open **left/down** (unless insufficient room); pointer remains readable while map/select is expanded; test hinge and an alternate non-hinged fold. Map-target list must not cover currently selected target nor primary click target.
- Radio lower-right → flyout **up/left**; mini shows Play/Stop/Pause, Next, Sound button, compact title/track ticker; flyout adds queue, next tracks, playlist selection and volume/bus controls, all wired only to existing audio owner. Closed does not stop music. Track metadata is title-first; no mandatory artist for own productions. Sound control must govern **music, environment/ambience and character speech melody/voice separately** where routed; ChatterBox dialogue bubbles still work muted, audio mix/ducking authoritative elsewhere; distinguish game-owned dialogue concept from external TTS model. Avoid changing playlist/source automatically on travel-mode switching unless current owner says so.
- Bag/Settings/full cards → one consistent near-full safe viewport L3 template with clay-shaped backing, reused 20 inventory slots, zero wooden panel textures, stable close button and scroll; cards preserve original illustration and landscape ratio; no duplicate data store.
- Opening L3 dismisses existing flyout; moving between L2 entries dismisses prior L2, unless user explicitly chooses a pinned exception after demonstration. Loading/error states need nonblocking close. Flyouts respect notch/safe areas, scale, pointer/touch, contrast, reduced motion, keyboard/gamepad and popup focus rules.

### 8.6 Visual candidate set to compare (not canonical layout)

Produce same-source **three 16:9 composition keyframes** with L0 only, then **four overlay-pressure frames** (map target select, Radio expanded, Almanac browse, full Bag/Settings) for chosen candidates. A/B/C remain from §7; for each show horizontal action strip and separate interaction prop; don't invent fixed radio bottom-right if another composition tests better. Include one Drive+combat frame with cooldown/active/hint concurrently, plus Fly vertical navigation and speed gauge alternative bar vs round dial. On phone use responsive rearrangement rather than shrinking all 3D hit targets.

Do **not** begin final Clay form/style/Claude Design until **layout × menu geometry × travel-mode matrix** is judged and Georg can select or tune. No test-only placeholder models masquerading as KFB donors. Actual 3D donor isolation, layout frames and physics/browser profiling still **NOT DONE** in this proposal.

**One next gate:** recover authentic donor visuals (R4 reference folder + J17 + original action/radio/bag/compass), then produce an **A/B/C L0+L2/L3 reachability/occlusion comparison** with a proposed default navigation solution (persistent 3D target arrow, optional map, separate vertical speed bar), for Georg **A / B / C / TUNE / FAIL** before Claude Design.


---

## 9. 2026-10-22 · GEORG CORRECTION · FREE-FLOATING 3D TARGET ARROW · NO COMPASS BASE

**Status: binding visual concept correction for next design study, not visual PASS, no implementation.** This section **supersedes any conflicting default nav depiction throughout §§2, 3, 7 and 8**, including the earlier "hinged physical compass", "arrow embedded in/adjacent to housing", "opened compass/map prop", "speed ring attached to navigator", "neutral compass" and the flat 2D diagram shown in chat. The example pictures of a flat compass and in-housing minimap are explicitly **REJECTED AS DESIGN DIRECTION**. R4 world-mounted arrow above avatar also stays historical, not current placement.

### The actual visible L0 navigation object

- A **freestanding genuine 3D target arrow** in a screen-peripheral navigation anchor, not a compass graphic, ring, panel, plaque, wooden board, housing, socket, surface, backing or fake 3D extrusion of a 2D symbol. The arrow itself is the HUD prop.
- Must turn **through 360° yaw** toward the active target and **pitch up/down in real 3D** when the target is above/below the player, especially in flight. Avoid a permanently billboard-facing arrow / flat needle that would hide vertical movement. Test front, side and elevated views, full target orbit, over-under transitions and camera changes, while the anchor remains screen-peripheral. Rotation should be smooth/damped and truthful relative to the existing camera/player frame, not arbitrarily oscillating or locked to North. If vertical cues need a short ↑/↓ beside the arrow for legibility, that is supplementary and not a substitute for actual pitch.
- Lightweight recognizable *original* KFB/CC0 arrow-source silhouette with subtle clay material only after K1/H0/K2 style-source comparison; preserve readable arrowhead and clean direction. Stronger KFB dark outline optically to lower-right (following shared outline SSOT) plus subtle halo on hover/hint/activation; no underlay required for outline/glow. Original material colours should not be destroyed by state shader.
- Small floating readable **objective name/distance**, with optional numeric signed height if useful, anchored near arrow but **without a badge/wooden plaque, miniature dial or box**. Text may use its own minimal contrast treatment for legibility but must not become another UI housing. In no-target state, do not display a fake arrow or destination.
- The object remains clickable/focusable as the access point to L2 **MINIMAP + GOAL/POI PICKER**, which appears as **separate flyout content**, not inside the arrow, not behind a swinging lid and not permanently visible. Navigation arrow remains meaningful when flyout closes. Existing real quest/POI/world owners provide bearing, distance, target priorities, elevation and map markers; no parallel GPS source.
- Drive/Fly **speed indicator is a separate, mode-gated lightweight 3D clay bar with numeric reading** (vertical candidate), not a tachometer forced into a compass ring. The bar may be spatially grouped near arrow while preserving distinct silhouettes and no backing. A round speed indicator is not the default in this iteration. Walk hides speed when irrelevant.
- **Composition A/B/C remains open** (where to anchor the arrow relative to Radio/Almanac/Action/Fluff); this correction is about actual **3D object identity and no base**, not an approval of a fixed corner or size.

### Donors and evidence gate

The original Dropbox HUD R4 brief named preferred free arrow candidate **D: Kenney Factory Kit 3.0 / arrow-rounded.glb**, second **A: Quaternius Platformer Game Kit 2021 / Arrow.gltf**. GitHub main search located the exact Kenney file in registry at `media/3D_Assets/kenney_factory-kit_3.0/Models/GLB format/arrow-rounded.glb`; fetching its binary with the text-only GitHub file reader returned UTF-8 decode error, so **no mesh or shape verification has been completed**. The optional KayKit `compass_base.gltf` **does exist** but is **NOT the desired L0 navigation object**. Do not replace arrow with compass, even if compass loads successfully. The selected arrow donor must first render **alone in isolation** with an unmodified identity view, then clay/outline comparison and yaw/pitch validation, then integrate into candidate HUD layouts.

**Acceptance (before Claude Design implementation):** a real-source object turns left/right/behind and points **up and down** when targets change, without any base. L0 screenshot shows **only the standalone 3D arrow** plus minimal destination text; L2 screenshot shows a separate opened minimap+goal list. No permanent map, wooden interface plate, round gauge or faux compass needle. Side-by-side source-isolated artifact and real 16:9/mobile reading proof required. No owner/runtime changes, no PR merge or Site/Stage in this correction.

**Single next gate remains:** isolated free-source **3D arrow** with yaw/pitch/camera-direction frames, then A/B/C compact HUD and opened-flyout composition frames for Georg's **A/B/C/TUNE/FAIL**, before Claude Design or WS1 runtime integration.


---

## 10. 2026-10-22 · GEORG COLLECTIBLE FEEDBACK CORRECTION R0.4 · six orbs top, one flight grammar, cards/songs/chest, future fabrication

**Status:** Georg's current HUD composition/interaction direction with *explicitly provisional* economy mechanics. This section **supersedes conflicting spatial assumptions** in §§2–9 (especially R3/§7 placing six Fluff pips lower-left), without silently canonizing recipe costs, score semantics, teleport permissions, or a new save owner. No runtime build or Claude Design acceptance.

### 10.1 Six colour-specific Fluff collectors are a permanent TOP-OF-HUD family

- **Six individually source-backed 3D clay Fluff balls are grouped in the TOP area of the screen** at stable, collision-tested positions. This spatial fact now outranks R3 lower-left Fluff and the free-placement alternatives in §7. The exact horizontal spacing / total-score alignment still awaits layout review. Preserve the six original Story Mode families and source palette, not an invented six-colour progression UI.
- Each orb has its **own curved/rounded clay-textured 3D-looking numeric count** visually sitting on/in front of its spherical silhouette, always legible even as the orb reacts. Avoid flat wooden labels or a separate six-cell bar. Implement with source-consistent 3D text/surface or camera-oriented glyph layers if actual curved mesh text hurts fidelity/performance; no stretched unreadable text on the far side of a spinning sphere.
- If that colour has **no stock yet**, retain the identical source sphere shape as a **desaturated/greyed ghost**, with a readable `0`; do not remove the slot, assign a random colour, or imply the item is locked rather than presently absent. First acquisition restores its canonical colour and animates the integer up to 1.
- Pickup feedback is colour-specific: genuine world pickup/gift/reward of yellow Absurd Fluff → yellow flying ball → **yellow orb only** → elastic squash/stretch catch → that orb's number increments, e.g. **2 → 3**. No central proxy counter that masks which of the six resources changed.
- Different collection origins **all** use the same intake grammar: walking/riding/flying over a real Fluff object, resident gift, quest/encounter reward, optionally later source-backed harvesting/crafting. Source event identifies mode and amount; visual never invents reward or chooses a different colour from aesthetics.
- Older v0.3 concept supports six D6 Story Mode families × HIGH/LOW subtypes (12 stackable resources); the **current WS1 world/fluff.js and kfb.save/1 expose six kind counters**, not a proven deployed 12-counter inventory. Six visual HUD orbs stay six; the High/Low eventual sub-state must be reconciled with authoritative resource identity and visible only if implemented. Do not add twelve pips or create another wallet.

### 10.2 ONE continuous world → HUD trajectory, shared for all acquisitions

**Critical failure recovery:** Georg rejected previous collect/card animations fragmented into three or four disconnected transitions. Existing Travel Globe `globe-v13/card-flight.js` already explicitly documents the failure: separate easings / per-phase velocity reset / arbitrary holds make motion stop between stages, especially under moving camera. It uses one continuous spring state with evolving targets, where position AND velocity remain continuous and the camera-space mapping is controlled; it is a **technical donor to inspect**, not an automatically approved current-game renderer.

**Presentation grammar, one event and one moving visual identity:**

1. **SOURCE:** source-backed world object at its last verified world transform, or a real screen position at reveal/gift; real game state awards stock/card/item exactly once. The moving visual may be a temporary clone/projection of the genuine art, not a generic particle that obscures the real collectible.
2. **TRANSFER:** launch from source and animate a **single continuous, visually trackable arc/trajectory** toward the actual destination HUD object's **current projected/screen anchor**; orientation/scale may continuously change, without stopping, teleporting, swapping into unrelated sprites, or starting a second disconnected animator halfway through. Travel speed/easing is authored at event level, not cobbled from several timelines. Maintain continuity even while camera and vehicle move; screen-space/camera-space convergence is mandatory where 3D world → 2D HUD coordinates cross.
3. **CONTACT:** source visual arrives *at the visible receiving prop*, collides/readably seats there; one shared collision beat and miniature squash/compression, brief overshoot/rebound of destination prop. The token does **not** disappear 50px from the target, reappear as a different flash, or stop before impact.
4. **SETTLE:** destination returns to rest and the **associated amount/count** pops/reforms with a small clay deformation. For Fluff, per-colour counter; for cards, Almanac count/new top card; for songs, radio library/ticker; for props, chest item count. Gameplay truth was already committed; this is an exactly-once presentation acknowledgment, not a second reward.
5. **ACCESSIBLE / FALLBACK:** reduced-motion keeps the same source/outcome legible with brief target emphasis + instant authoritative count; targets off-screen or open L3 overlay must resolve to visible appropriate current anchor or a controlled abbreviated arrival, never freeze or steal the reward.

**Production rules:** one acquisition receipt ID and one owner of presentation flight per event; event type/colour/item/cardRef/amount/sourceTransform/screenAnchor/sequence. Animation reads state; cannot deduct/add inventory itself. Multiple simultaneous acquisitions of same colour may be batched into a clearly labelled +N packet with still-correct destination and eventually correct count; mixed colours route to distinct orbs. Large pickup bursts must not schedule infinite independent WebGL renders. Resizing, mobile, active flyouts, camera cuts, interruption, drop/reload and HUD anchor motion need correct final visual state without duplicate increment. SFX/voice feedback routes to existing Audio owner.

### 10.3 Card, song and prop arrivals use the SAME cinematic grammar

| Outcome | Genuine flying identity and receiving object | Visible feedback | Data rule |
| --- | --- | --- | --- |
| **Fluff** | Real colour-specific 3D ball → matching top orb | One flowing arc, 3D squash/seat, number +1 or +N, optional total score reacts | Existing `kfb.save/1` Fluff source/readers; no VFX-led grant |
| **Card** | Exact authentic **landscape KFB card art** → current Almanac physical 3D stack/fan (location from selected layout, top-left preferred option) | Card flies intact and legible, slips between / onto existing cards with one continuous easing and light spread/spring; counter updates and stack settles | Same `deckId + cardNumber` canonical Card/Almanac acquisition; no duplicate 20-slot Bag Card. Original PDF/card surface unchanged |
| **Song / tape** | Actual authored **cassette/tape/song carrier** → Radio (or verified tape/collection intake as ownership directs) | Carrier arrives at radio, brief cassette/reel reaction, title ticker/playlist count confirms unlocked track; don't interrupt playing audio unless current source policy requests it | Track library/playlist unlock from existing Audio/Jukebox owner; no arbitrary artist metadata or second playlist database |
| **Physical item** | Genuine source 3D prop → chest/bag-of-holding object | Lid anticipates/opens, received miniature disappears **inside** at contact, compact spring shut, inventory count bounces | Existing 20-slot inventory authority; capacity/full cases handled before grant or with explicit overflow, no invented infinite storage implementation |
| **Total score** | No invented seventh-colour Fluff token | Independent modestly larger curved Clay **3D score numeral near (but visually distinct from) the six top orbs**, juicy digit increments in response to genuine score event | Explicitly distinguish **current six resource stocks**, **cumulative Fluff earned / total score**, and historical **HP Fluff / POP**; NEVER infer score from an arbitrary sum if the owner has a different formula |

**Avoid accidental progression coupling:** old Overworld glossary defined `fluff` as *derived HP* and POP as a separate progression wallet; WS1's current `world/save.js` instead stores six Fluff kind counts. Therefore, a separate "gesamt Fluff" 3D score display is an **authored desired visual** whose actual source, accumulation rule, value persistence and crafting consumption semantics still require one WS0/WS1 owner decision. Score should not get silently deducted when spending resource stock unless the score model explicitly says so.

### 10.4 Source-backed chest candidate, NOT an additional inventory

Georg prefers testing an animated **3D chest / box-of-holding** as the permanent HUD collector for props, potentially replacing the R3 Hoarder Backpack miniature; the **20-slot inventory overlay remains the same**. The chest physically reads as containing more than its small size. It must react to item arrivals and open on click to the shared L3 inventory. A gentle pop-lid recoil and cartoon compression are preferred to giant scenery occlusion.

**Actual relevant donor identified and source-read:** `media/3D_Assets/Platformer Game Kit - Dec 2021/Level and Mechanics/glTF/Chest.gltf` (Quaternius/Platformer Game Kit); glTF has separate `Chest_Top`/`Chest_Bottom` nodes and **`Chest_Open` and `Chest_Close` animations** (four channels each), so this is a promising technical donor. This is metadata/structure inspection, **not rendered visual proof, proportion acceptance or rights/publication confirmation**. Show unchanged 3D donor source object and clips in isolation, then KFB clay+outline candidate at true on-screen size. Compare to actual R3 Hoarder_Backpack; no unverified 'bag of holding' infinite-capacity mechanic implied.

### 10.5 Kayfabrizieren / Witch alchemy — PROPOSAL, not current gameplay truth

Georg's current **working hypothesis**: after acquiring "six" Fluff, the player may invoke **Kayfabrizieren** and synthesize **an arbitrary missing existing Card from a Deck in which the player already holds at least one Card**. Later recipe expansion could produce source-backed consumables, other props or a new weapon, possibly with the Witch in a separate optional Alchemy mini-game.

**Do not codify a spend rule yet:** "six" could mean 6 total resource units, 6 distinct colours, one each of the six types, or a particular recipe-defined combination. Threshold, resource deduction, HIGH/LOW role, what "arbitrary" means within permitted Deck/Card identity, repeats, guarantees, recipe availability, Witch context and balance are **TO DESIGN / WS0 OWNER DECISION**, not agreed canon. In particular, do not equate "score reaches 6" with "spend six coloured wallets" silently. The UI may suggest a provisional small recipe-ready response **only once an authoritative eligibility result exists** (not merely a guessed threshold). Interaction could begin from one discoverable 3D prop/action adjacent to the six orbs or from an existing Crafting/Almanac flyout; no huge permanent seventh indicator.

Reuse recovered actual planning source `skills/chat/KFB_FLUFF_CRAFTING_ALMANAC_LAYER_CONCEPT_V0_3_2026-10-09.md` on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09` (blob `950f11df2178045fb7351f0470b2441d8a24773e`): existing six-modes/High-Low resource identity, real Card registry, existing PlayerSave/Almanac provenance, exact-once crafting receipt, destination-capacity check, optional Witch/workbench settings and no mandatory grind. **New six-Fluff shortcut is a candidate addition to reconcile with that older recipe-authored model**, not a replacement economy. Synthesis card → SAME Card flight into Almanac, synthesized prop → SAME chest flight, song unlock → SAME Radio flight, not custom silo UI.

### 10.6 Travel/goal-selector teleport affordance — later mechanism, visible discovery

Existing L0 free-floating 3D target pointer remains independent of teleport. Its L2 goal/POI selection flyout must allocate a **recognizable, directly discoverable 'Return / Rest Stone / Teleport' entry** (or a small related separate 3D quick prop if the layout proves that clearer), not bury fast return deep in Settings, Bag or an inaccessible map submenu.

Target selection and actual teleport are distinct actions: destination is a real eligible unlocked rest/anchor point, preview/selection visibly separate from teleport command, only existing owning player/world travel mechanism is allowed to change location and save. Never claim any location is unlocked, safe, or reachable without actual game-state owner. Charging/cooldown/permission, transition style, save and interaction details remain open. No brand-new travel mechanic is authorized by this concept; show teleport affordance as a layout slot and source-check before implementation.

### 10.7 Layout and motion preflight acceptance — explicitly NOT achieved yet

- **First acceptance seam:** isolated donor object and one **single-shot visual source-to-HUD pickup**: yellow real Fluff ball projected from moving world/camera into top yellow 3D orb, catch/squash, counter 2→3; verify frame continuity, velocity continuity and exact target anchoring.
- **Second:** one real Card source flying intact, without break/pause/camera-space jump into actual Almanac source art/stack; explicitly fail disconnected 3–4-animation stitched sequence. Donor study: Travel `card-flight.js` source, then current HUD/card owner. Test gift, world pickup and crafted receipt using same movement and separate source origins.
- **Third:** one cassette/song unlock into Radio and one prop into source-isolated animated `Chest.gltf` with correct opening animation and the existing Bag-20 L3 overlay.
- **Fourth:** six top orbs (including grey/zero states and curved numerals), total score 3D number distinct from spendable stock, layout A/B/C under flyouts. One full pickup-burst scene tests multiple mixed colours and partial animations without FPS/input collapse.
- **Fifth:** inspect and decide recipe eligibility ("six" meaning and Deck access), score semantics and teleport discovery with authoritative owners; only then expose claimed READY or teleport ENABLED.
- Motion QA: film/show a continuous complete screen capture (start object / midair / contact / settle) plus 4–6 **chronological** frames; use precise camera/goal anchor while turning/moving, test under resize/overlay open, no frame cuts, no double-awards. Reduced-motion and mobile alternative with identical semantic result. Render and profile only with selected actual objects and existing one renderer owner.

**Actual evidence this chat:** GitHub source reads of Travel `card-flight.js`, `collect-hud.js`, current WS1 `world/fluff.js`, `world/save.js`, old Fluff/alchemy v0.3 and Quaternius `Chest.gltf` node/clip metadata. **No original asset shown in isolation, no new animation, screenshots, runtime test, performance benchmark, Stage/Site or gameplay approval.**

**Next single gate:** **source-isolated collection-motion visual proof** (real yellow Fluff source → top yellow orb; real canonical Card → Almanac in one uninterrupted movement), alongside the A/B/C placement/flyout study. Georg grades **PASS / TUNE / FAIL** before Claude Design handoff. Later recipe/teleport logic remains conceptual.


---

## 11. 2026-10-22 · PRODUCTION HANDOFF FREEZE / GitHub-only WS0→Claude Design route

**Georg approved the operating approach, not the current visuals:** keep the entire preceding §1–10 historical/additive concept intact; **stop iterative conceptual rewrites and stop drawing speculative flat SVG/2D HUDs**. Next task is actual source-backed visual composition inside the **existing Claude Design HUD workspace**, using the already-developed layout history. Blender MCP is a **single-source specialist only if needed and explicitly approved**, not the paid bulk asset-prep default. WS1/Claude Code remains the subsequent runtime integrator **after Georg visual acceptance**, not the concept designer.

**The current user-facing actionable documentation now lives next to this full Recovery record, on the same branch and PR #444:**
- `skills/chat/recovery/hud-3d-r1/HUD_SOURCE_DONOR_INVENTORY_R1.md` — actual GitHub asset paths, verified GLTF sources vs registry-only binary GLBs, texture/rights caveats, historical GitHub R4 refs and unimported newer N34 image gap.
- `skills/chat/recovery/hud-3d-r1/WS0_HUD_3D_CLAUDE_DESIGN_INTAKE_R1.md` — **FIRST EXECUTOR, WS0**, verifies one HUD owner, actual source images/models/licences/current game API and whether GitHub-only inputs are sufficient; declares SOURCE_REQUIRED instead of allowing substitutes.
- `skills/chat/recovery/hud-3d-r1/CLAUDE_DESIGN_3D_PROP_HUD_BRIEF_R1_DRAFT.md` — short curatorial visual design prompt **ON HOLD until WS0 explicit source ACK**, no 3D ownership claims without isolation.
- `skills/chat/recovery/hud-3d-r1/HUD_DESIGN_HANDOFF_RETURN_R1.md` — Return, additive handoff/changelog and acceptance proof status.

**Current visual invariants:** six coloured 3D Fluff collectors + individual clay number **at top**, 0-grey absence; uninterrupted source→receiver cinematic contact (Fluff / original Cards / songs / chest props); independent 3D total score only when source decides score math; full 3D free yaw/pitch target arrow **without** background/compass; map+POI+provisional teleport in **separate flyout**; independent mode-gated speed bar; important 3D radio/cassette and playlist/audio flyout; original-card Almanac fan with top-left candidate (layout A/B/C still open); animated 3D chest compared to Bag, same 20-slot overlay; 3D Primary/Secondary/boot, lower-right reinforced outline, selected/hover/active/hint and bottom-to-top colour cooldown, accessible lightweight motion; consistent clay L3 settings/Bag/card overlays. `Kayfabrizieren` six-Fluff threshold, High/Low split, Witch recipes, score/teleport mechanisms remain **hypotheses**; no gameplay system expansion approved.

**Visual no-go:** woodboard replication, flat compass/minimap permanently visible, invented SVG icon stand-ins, author-created model substituted for checked donor, broken 3–4-phase collection flight, screenshots/URLs used as fake source-isolation evidence, public paid Mystery binary uploads.

**Release decision now:** project state `WS0_SOURCE_AUDIT_PENDING`, **NOT** `CLAUDE_DESIGN_READY`. **Single next gate**: WS0 confirms a GitHub-only, isolated-model/authoritative-consumer set (or named source gaps) and reconciles newer Dropbox N34 references. Then unlock compact Claude Design draft for real 3D composition and Georg A/B/C/TUNE/FAIL. This is planning only — no UI implementation, visual PASS or Stage/Live.
