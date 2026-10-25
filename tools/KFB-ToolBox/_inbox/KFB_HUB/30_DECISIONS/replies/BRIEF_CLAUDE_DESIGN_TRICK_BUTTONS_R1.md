# Claude Design · KFB HUD trick buttons (drive and flight) · R1 · WS0 · 2026-10-25 (V-821)

**Tier 0**
1. **Goal:** Georg's request of 25.10.: tricks are reachable as action buttons / small 3D clay icons in the HUD, not only through hidden key combos. Georg picks look, layout and states from your boards.
2. **Sources:** the HUD 3D package and boards (b187, V-694, the cassette, chest, gear and action bar decided there), the in-game pictures in this package and the KFB 3D look (clay, one light rig). Do not invent a new HUD style; the buttons join the existing HUD 3D family. If an icon object is missing, name it (V-690).
3. **Output:** boards and short motion clips for Georg's choice `A / B / C / TUNE / FAIL`. Design only, no game code. WS0 builds the runtime afterwards.

## 1 · The tricks (as they work in the game today)
| Trick | Mode | Key today | State to show |
|---|---|---|---|
| Barrel roll | drive in the air, also in flight | Space + A/D while airborne | only in the air; then cooldown (on the ground it shares one short lock with two wheels; in flight its own longer cooldown) |
| Two wheels | drive, on the ground above a minimum speed | X + A/D | cooldown shared with the barrel roll |
| Turbo / boost | drive (boost meter) and flight (boiler) | Shift | meter or boiler fills and empties |
| Drift | drive | Q / E | active while held; charges the mini-turbo |
| Take off | drive → flight | Space twice within 0.4 s in the air (or a ramp) | always possible in the air; in flight the charges are spent only on the Space climb and refill; Shift uses the boiler, not a charge |
| Air brake | flight | S | active while held |

Flight (take-off, air brake) currently runs behind the game switch `fly`; WS0 will make it standard. Design it as part of the normal HUD.

Barrel roll, turbo and take-off matter most: they are the moves Georg asked to make visible (25.10.: „action buttons/3D icons im HUD … barrel-roll“).

## 2 · What we need from you
- **One icon per trick** as a small 3D clay prop, readable at 48–64 px, same oblique view and the same light as the HUD 3D action bar. Examples of what could work, not a requirement: a curled arrow or spinning hubcap for the barrel roll, a kettle or flame for turbo, a propeller or wing for take-off.
- **Placement** in drive and flight mode: the tricks use at most the action-bar slots (up to 6, bottom, V-671/V-694). In the vehicle the walk-mode combat props (fist, blaster, bomb) leave the bar and the tricks take their place (WS0 decision); show how the bar changes when entering and leaving the vehicle. The separate interaction slot to the right of the bar stays free (V-674). The speed column stays top right under the arrow and gear (V-743); bottom right holds the cassette radio with the KnuckleBob plaque above it and the small KB mute button next to it (V-818). Layout reference is the HUD 3D board of b187; the picture `aktuell_fahrzeug_seele.jpg` only shows the plaque in the game (it was taken without the HUD 3D and with a developer banner, ignore both).
- **States:** use the fixed HUD state vocabulary (`HUD_UX_STATES_R1`, V-673/V-674): outline is the resting state; a warm halo carries the state (hover, click flash, active breathing, hint pulse, ready flash); cooldown and charging = prop grey, colour fills back in from the bottom (no ring). New for tricks: "not available right now" (e.g. barrel roll on the ground) as a dimmed resting prop. Plus the key hint (small, switchable). KFB outline even, heavier at the bottom right (V-674).
- **Click/touch:** each button triggers its trick; the keys keep working.
- **Two or three layouts (A/B/C)**, each as one board in game context (drive and flight) and a short clip of the states.

## 3 · Rules
- Clay look and the one light rig of the HUD 3D; no flat 2D icons; a warm halo only for states, no neon.
- Colours as in the HUD 3D: original model colours where an existing prop is used (V-670), the island/biome palette only for the button frame (V-653); vehicle colour only where it carries meaning (the plaque already uses it).
- No numbers or measurements for Georg to judge; the boards show it.
- English and German labels only where the HUD already has labels; otherwise icons alone.

## 4 · Package
- HUD 3D brief and boards: Hub b187 (V-694), cassette design `N34_r2_2_teile`, action bar `N32r2_aktionsleiste_final`.
- Package: private repo branch `design/hud-trick-buttons-r1`, folder `design/HUD_TRICK_BUTTONS_R1/` (this brief + the two in-game pictures). In-game pictures there: drive with the KnuckleBob plaque (`aktuell_fahrzeug_seele.jpg`), hero-run stills with barrel roll and boost (`aktuell_hero_standbilder.jpg`).
- Return: boards + clips, a short RETURN.md with the A/B/C description and the open questions.
