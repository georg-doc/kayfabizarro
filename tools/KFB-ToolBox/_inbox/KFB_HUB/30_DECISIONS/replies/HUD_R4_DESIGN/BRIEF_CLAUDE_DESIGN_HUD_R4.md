# Claude Design · KFB HUD R4 · handmade diorama interface, target arrow, social-call radial

WS0 → Claude Design · 16.10.2026 · V-334/V-335 (builds on V-040, V-204, V-292, V-305, V-333).
**Mode: DESIGN ONLY (V-228).** You deliver look, specs, values and a clickable look sandbox. WS1 builds the runtime later. No game code, no second renderer.

## 0. Read first (GitHub `georg-doc/kayfabizarro`)
Register branch `docs/kfb-decisions-register-2026-10-11`, folder `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`:
- `DECISIONS.md` (V-040, V-204, V-292, V-305, V-333, V-334), `STYLE_GUIDE_3D_R1.md`.
- `replies/HUD_R4_DESIGN/ref/`:
  - `hud_r3_01_hud_walk.jpg` … `hud_r3_04_god_mode.jpg` = **approved clay HUD R3** (V-040). This is the direction: soft clay pills, few elements.
  - `ws1_preview_now_01_deal.jpg`, `ws1_preview_now_02_intro_ritual.jpg` = **current MVP state**: smooth dark panels, big text boxes. This is what R4 replaces.
- `ref/j17_hud_clay_minimap.jpg` = Joyride J17 clay HUD (gold standard look, V-010) with minimap, tacho, radio; `ref/arrow_donors_contact_sheet.jpg` = 3D arrow donors in the repo.
- `replies/COLOR_HARMONY_R1/` (README + `kfb-cartoon-palette.js`): the palette generator. Its roles tint the HUD per stage/deck.
- `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/vendor/chatterbox/chatterbox-core.js`: the plain speech bubble (V-204).
- `replies/WEBCHAT_UPDATES_R1.md` §R0.3/R0.4: background on the 3D compass and the pickup/social-call ideas (concepts only).
Main branch: `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-hud.js` + `kfb-backpack.js` = HUD R3 source (plaques, radio, backpack, game/God switch).

## 1. Look (Georg 16.10.)
- **Handmade, do-it-yourself, diorama character.** Clay first. Small wooden panels, cardboard, felt or tape are allowed where they help, but Georg expects that the clay look needs **few extra elements**. Everything from one mould, so the interface never disturbs the scene.
- No glossy gradients, no neon, no glass, no dark sci-fi panels.
- Legibility beats charm: text and icons readable at 9:16 phone size.
- Speech bubbles stay **plain** (V-204): one shape, one tail, soft shadow, no ink outline.

## 2. Colour
- HUD surfaces take their tint from the palette generator roles (`fromStoryMode` / `fromHue` of the current stage or deck), so the HUD belongs to each diorama. Propose which role tints what (base plaque, accent, text).
- Fixed colours from V-292: story-mode colours and the **call colours** Bingo #4f6029, Bongo #8a6f3e, Boggle #5a6b76, Blödsinn #b8361f.
- **The printed card is never recoloured** (no tint, no grading on card art).
- Colour is never the only cue: every state also has a shape, icon or text.

## 3. Elements to design

### 3.1 Target arrow + destination ring (V-333, Undermine reference)
Georg's model is the taxi/delivery driving in WoW *Undermine*: a 3D arrow floats **above the player character** (on foot and in the car) and points to the next objective; the destination is marked by a ring.
- **World arrow:** a clay 3D arrow hovering over FrizzleBob / over the vehicle. Turns relative to the view. In flight it tilts visibly up or down toward the target.
- **Destination ring:** a clay or felt ring/marker at the drop-off or point of interest, readable from far away.
- **HUD label:** target name + distance (“~120 m” straight-line until a route length exists). Flight adds ↑/↓, height difference, and a small horizon ring.
- **Behaviour (Georg 16.10.):** the arrow turns **sluggishly and calmly**, never flickers, but always shows the direction dynamically (damped turn, about 0.3 s settle, small dead zone). On approach it changes **colour toward green**; check how that green works with the palette (green ground stages need enough contrast, so shape/pulse supports the colour). Arrival: soft pulse, then the arrow settles or fades.
- **Distance display, short like in RPGs, no number clutter.** Proposal: under 100 m in 5 m steps (“85 m”), 100–999 m in 10 m steps (“350 m”), from 1 km with one decimal (“1,2 km”), from 10 km whole numbers (“12 km”); near arrival no number, just the arrival cue. You may propose a more compact game style (e.g. “1,2k”) if it reads better. Show two placements: (a) a small clay tag hanging on the 3D arrow (moves with it), (b) next to the target marker on the minimap.
- **Arrow donors in the repo** (CC0, see `ref/arrow_donors_contact_sheet.jpg`): A = Quaternius `Platformer Game Kit - Dec 2021/Level and Mechanics/glTF/Arrow.gltf` (flat, rounded – WS0's favourite base), B/C = its signpost variants, D/E = Kenney factory arrows, G = KayKit RPG Tools Bits `compass_base` (housing idea). Your spec says which base and how to clay it (thicker, softer edges, thumb-print texture, colour roles); WS0 builds the GLB.
- Arrow and ring are 3D objects: deliver modelling specs (shape, proportions, size relative to FrizzleBob, pivot, material colour roles) plus look frames. WS0 builds the GLB from your spec.

### 3.2 Social-call radial menu (replaces the answer meta-bubble)
Today, answer options sit in a large extra bubble. Georg wants them on the interface level as a **discreet radial menu**:
- **Trigger:** a clay knob/button in the HUD (plus a key and long-press on touch) opens the radial.
- **Segments:** the four social calls **KayfaBINGO, KayfaBONGO, KayfaBOGGLE, Blödsinn!** in their call colours, each with icon + short label. Plus one segment **“Eigener Text”** (own text). Leave room for 1–2 context actions (e.g. take/ask for a prop) without crowding.
- **After the choice, the player's own character speaks it** in their own plain bubble (“KayfaBINGO!” or the chosen line). Own text typed into a small clay text field also appears in the player's bubble (later spoken via text-to-speech).
- Long dialogue lines: the radial shows short labels only; the full line appears in the player's bubble after choosing (optional preview on hover).
- **The meanings of the calls are data, not design.** Today's meanings: `Kayfabizarro_Freestyle_Rules_v18-4.md` on main, lines 137–140 (BINGO = that landed; BONGO = retell a mechanic as story; BOGGLE = one concrete question; Blödsinn! = a rule was broken). A web-chat draft redefines BONGO/Blödsinn; Georg has not decided yet, so tooltips read their text from data.
- NPC replies stay in the NPC bubble as today.

### 3.3 First contact for new players
The calls must not feel cryptic. Design a light first-time help: one-line tooltip per segment on hover/long-press, and a short first-use hint. Show it in one frame.

### 3.4 Existing HUD R3 parts, restyled in one family
- mode plaque (walk / drive / fly; game ↔ God mode);
- island/target plaque (replaces the static compass pill at top left);
- radio;
- backpack (open state);
- fluff counter, collection count, discard pile (“Sammlung”, “Ablagestapel”).

### 3.4b Screen layout (Georg 16.10.)
- **Minimap top right.** Donor: the Joyride J17 clay HUD (`ref/j17_hud_clay_minimap.jpg`, minimap there sits bottom right) – keep its clay track-line style, move it to the top right. It also shows the active target marker.
- **Fractal almanac fan directly below the minimap**, fanning **straight down**, not into the picture (V-043): last 7 cards + “+N”; click opens the overlay with deck/world tabs → viewer. No scrolling inside the fan.
- Mode plaque top centre, radio and speed/tacho from the J17 layout where they don't collide; show where the social-call knob sits so it never covers the fan or the bubble.

### 3.5 Card moments
The card deal (choose one of three) and the card reveal (“win → card → OK → almanac”): replace the dark panels with the same handmade family. The card is always shown complete, landscape quarter page, unchanged (V-220, V-327).

## 4. Deliverables
1. **Style board:** two variants side by side, A “pure clay” and B “clay + wood/cardboard accents”. Same layout, so Georg can pick by one look.
2. **Key frames, 16:9 and 9:16:** walk with target arrow; drive with arrow + ring in sight and minimap + almanac fan on the right; flight with arrow tilted up and down; radial open; player bubble after a choice; own-text input; card deal; backpack open.
3. **Look sandbox** (single HTML page, no build step) where the radial can be opened and a segment chosen, and the arrow turns/tilts with sliders. Artifact link, so Georg only clicks.
4. **Spec sheet:** colour role mapping, radii, shadows, font choice (Google Fonts or licence-free only), icon set for the four calls + own text, sizes in px at 1080p and phone, motion notes (open/close timing, squash and stretch).

## 5. Acceptance grid (measure yourself before delivering)
- G1 one material family across all elements; nothing glossy, neon or dark sci-fi.
- G2 9:16: all labels readable, radial reachable with one thumb, card fully visible.
- G3 the four calls distinguishable without colour (icon + shape + label).
- G4 HUD in walk mode covers less than about 12 % of the screen.
- G5 card art never tinted; bubbles plain (V-204).
- G6 flight arrow: up/down readable at a glance at ±30°.
- G7 a newcomer understands what each segment does from the first-use help.

Report in German, one open question at most. Save files under `replies/HUD_R4_DESIGN/` on a new branch, no merge.
