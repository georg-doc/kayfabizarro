# Claude Design · KFB 3D Prop HUD · R1 · WS0 · 2026-10-23 (V-694)

**Tier 0**
1. **Goal:** a HUD made of real small 3D clay props from the KFB world. Georg picks look, layout and motion from your boards.
2. **Sources:** only the models and pictures in the package „HUD 3D Paket“ (Hub) plus the GitHub docs in §6. Do not invent replacement objects. If something is missing, name it (V-690).
3. **Output:** boards and short clips for Georg's choice `A / B / C / TUNE / FAIL`. Design only, no game code. WS1 builds the runtime afterwards.

---

## 1 · What Georg wants (22.10., later corrections win)
- **Fluff, top of the HUD:** six orbs, one per kind, each with a small clay numeral. An empty orb shows a grey 0. Colours come from the game (`satt` / `dunkel`):
  - tragic `#3e6a83` / `#34576b`
  - comic `#7a8d4a` / `#5e6f33`
  - absurd (yellow) `#e9c14a` / `#b8901c`
  - heroic `#d97c3a` / `#b35e22`
  - mystical `#6b4e7d` / `#5b4470`
  - forbidden `#a64670` / `#8f3a60`

  In the game a Fluff is a clay ball (see `wood_hud_ist_*`, top row). For the numerals use `KFB_HUD_FluffDigits`. A total score is shown only if one exists.
- **Target arrow:** a free-floating 3D arrow with no compass base, ring or panel. It turns left, right and behind with a calm, damped motion and never flickers. Show the active target's name and a short distance next to it (V-333, V-335):
  - under 100 m in 5 m steps, up to 999 m in 10 m steps;
  - from 1 km one decimal, from 10 km whole km;
  - no number on arrival.

  Approach colours it toward green as a second cue. Georg's correction of 22.10. (§9) is newer than V-333 (V-694): the arrow also tilts up or down for targets above or below in every mode, not only in flight. Candidates: `kenney_arrow-rounded` (preferred), `quaternius_arrow`.
- **Speed (drive and flight only):** a small clay bar with a number, set apart from the arrow. Compare it with the KFB compass (`KFB_HUD_Compass`: lid closed = speedometer, open = minimap; layout R3, V-681). The compass is one option to show, not a requirement.
- **Almanac:** a fan of original landscape cards (`card_face_*`, natural ratio, never redrawn, recoloured or clay-tinted) (V-043):
  - it fans straight down and shows the last 7 cards plus „+N“;
  - a click opens an overlay with deck and world tabs and a grid of card quarters, then the viewer.

  V-043 places it on the right, under the compass in R3. Layout A tests top left (Georg's concept §7).
- **Radio:** the white cassette (V-680; design in `N34_r2_2_teile`; 3D source `poly_cassette`) with play/pause on one button, next and sound on/off. The title shows only briefly when the track changes (R3). The older radio `KFB_HUD_Radio` is a comparison only. Georg likes the cassette as player (24.10., `N34_r4_kassette`): sculpted buttons (cap, base, shadow, pressed in when clicked), gloss only as a thin rim, cream-white symbols with a dark outline. Button colour follows the time of day, orange by day and teal by night, and stays adjustable like the other HUD colours (`controlTheme` in `kfb/kfb_hud_readability.r1.json`) (V-707).
- **Chest:** `KFB_HUD_Chest` (open / closed). The alternative `quaternius_chest` has real open and close clips.
- **Settings:** `KFB_HUD_Gear`, bottom right next to the cassette (R3). Developer info appears only through its settings switch, never on the boards (V-655).
- **Mode plaque** (walk / drive / fly · game / God) stays at the top centre (V-040, V-681).
- **Action bar, bottom, up to 6 props:** final set V-671, all original models in original colours and the same oblique view (V-670). Original colours are the baseline. A clay version is only a readability comparison; do not recolour these props. The set is Fist (Monstrosity hand; its knuckle plates count as the knuckle duster), Blaster (K10) and Clown bomb, with Grenade as an option. See `N32r2_aktionsleiste_final`. A separate interaction slot sits next to the bar (enter vehicle, talk, pick up; V-674): a round 2D bubble (V-501) with a 3D prop inside and a hint state when in reach (R3, see `N34_r2_2_teile`: car with hint, pick-up hand, talk bubble). Candidates: 3D speech bubble (WS0 recommendation), open hand, an original from a 3D icon set. There is no 3D model for these in the package; name that as missing.
- **Boots:** sprint exists (Shift+W, V-020). `tinytreats_boots` is an optional HUD prop for it; show it as an option in one layout.
- **States** (V-673, `HUD_UX_STATES_R1.md`):
  - outline is the normal state;
  - warm halo variants for hover, click, active and context hint;
  - cartoon squash on click;
  - during cooldown the colour returns from bottom to top over the prop's silhouette;
  - small hop when ready, and a "new" arrival state.

  Selected and cooldown can show at the same time. Offer a reduced-motion variant.
- **Flyouts:**
  - level 2: map and target selector from the arrow, playlist from the radio, recent cards from the Almanac;
  - level 3: bag with 20 slots, settings, full card view.

  Flyouts open inward and stay inside safe areas.
- **One flight grammar:** Fluff, cards, items and songs fly in one uninterrupted movement from the world into their HUD prop. No jump at the screen edge and no confetti in place of the object.

## 2 · Look
- KFB clay look. Clay stays the KFB look (V-690, V-653). Use a dark outline, slightly heavier at the bottom right. Use the warm halo only for states.
- No wood board or panel. The `wood_hud_ist_*` screenshots show today's layout and the visual weight of each element, nothing more.
- No flat icon sheet, SVG stand-in or fake 3D.

## 3 · Layouts to compare
- **A · Story first:** Almanac top left, arrow top right, six Fluff orbs across the top, chest bottom left, action bar bottom centre. The radio sits lower right and is as prominent as the Almanac.
- **B · Fluff priority:** same parts, with different spacing and weight for the six top orbs.
- **C · Grouped collection:** Almanac and Fluff as one group (Fluff still at the top), chest separate.
- **Reference:** layout R3 (`N34_r2_1_layout`, `r2_hud_1_otown_*`). Formats: desktop 16:9, phone landscape and phone portrait.
- **States to show:** resting, map open, radio queue open, card fan open, bag or settings, driving or flying, combat with a cooldown running.

## 4 · Deliver
1. **Identity sheet:** each model alone, original next to the clay-and-outline version (for the action bar only as a readability comparison), at real HUD size. Show the arrow turning and tilting, and the chest open and closed.
2. **2–3 layout boards (A/B/C)** on the same in-game background (e.g. `wood_hud_ist_01`, `r2_hud_1_otown_1080p`).
3. **State board** for one prop, including two states at the same time.
4. **Three short continuous clips:** arrow turning; a yellow Fluff picked up and counted 2 → 3; a card flying into the Almanac.
5. **Decision sheet:** KEEP / TUNE / REJECT for each model and each layout. Name missing sources. Performance stays UNKNOWN unless you measured it.

Deliver in the existing Claude Design HUD workspace. Georg decides; WS1 integrates only after his PASS.

## 5 · Package „HUD 3D Paket“ (Hub)
| Folder | Content |
|---|---|
| `kfb/` | KFB clay HUD props N29 with O-Town colours: Compass (closed and open), Radio, Chest (closed and open), Gear, FluffDigits, CardFanShadow; prop map `kfb_hud_props.r1.json` (animations, anchors, colour zones); readability and button colours `kfb_hud_readability.r1.json` |
| `actionbar/` | Final action bar r2: Fist, Blaster, Bomb, Grenade (`.r2.glb`), sheet `N32r2_aktionsleiste_final.jpg`, map `kfb_hud_actionbar.r2.json` |
| `donor/` | Original candidates (self-contained GLB): `kenney_arrow-rounded`, `quaternius_arrow`, `quaternius_chest`, `poly_cassette`, `tinytreats_boots` |
| `cards/` | Original card faces `card_face_p2_*`, `card_face_p3_*` (deck 1001 Kayfabe Nights) plus the two sheets they come from |
| `ref/` | `wood_hud_ist_01–06` (today's game HUD), `N34_r4_kassette` (cassette player r4, Georg 24.10.), `N34_r2_1_layout`, `N34_r2_2_teile`, `r2_hud_1_otown_1080p*`, `hud_r3_01–04`, `j17_hud_clay_minimap`, `arrow_donors_contact_sheet`, `ws1_preview_now_*` |
| root | `models_overview.jpg` (all models rendered plainly, not the clay look), this brief |

## 6 · Docs on GitHub (public, read-only)
Register branch `docs/kfb-decisions-register-2026-10-11`, folder `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`:
- `replies/HUD_UX_STATES_R1.md`
- `replies/HUD_LAYOUT_R3.md`
- `replies/HUD_R4_DESIGN/BRIEF_CLAUDE_DESIGN_HUD_R4.md` (history: its wood panels and the world arrow above the player are superseded)
- `replies/WEBCHAT_INTENT_FIRST_SOLUTION_OPEN_R1_2026-10-23.md`
- Georg's HUD concept with his corrections of 22.10. (§7–§10): branch `planning/kfb-diegetic-clay-hud-r0-2026-10-22`, file `skills/chat/recovery/KFB_DIEGETIC_CLAY_HUD_CONCEPT_R0_2026-10-22.md`. Read §9 and §10 first.
