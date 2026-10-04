# KFB Flight Animation Family 01 — Return, gate 2 (CARD_SURF · card + Mannequin)

Executor: Coworker (cloud bpy 5.0.1) · 2026-10-04 · Brief: `CARD_SURF_GATE2_REBRIEF_2026-10-04.md` (georg-doc-patch-3).
Status: **review/fit rig, nothing merged, no Travel patch, no runtime claim.** Travel `card-carrier.js` stays the owner.

## Defects and open points first

1. **Feet are not planted per foot.** The rider stands on the averaged seat plane (Travel's 5-sample `plantSeat`). When the card bends, the surface under the front or rear foot drifts from the sole by up to **4.1 cm** (BOOST), 3.8 (BANK_LEFT), 3.3 (CLIMB/DIVE), 1.2 (CRUISE). The rider is 2.2 tall, so this is under 2 %. Per-foot IK is a later runtime step.
2. **Bank is strong.** Travel's own springs, at a review input of `bank 0.3`, give about 30° of visible bank (spring roll 20° plus a 10° root preview) and a strong cup (side edges +0.35). The input scale is not verified against Travel. → HOLD, Georg decides the amount.
3. **Rider stance is not decided.** The authored stance (A) and Quaternius `Shield_Dash` (B) are shown side by side. → HOLD, Georg decides.
4. **The 2.0× relation is an assumption.** The absolute "current" rider size lives in the private Travel repo, which is not readable. The Mannequin is used at its native Rig_Medium height (2.204) on the 3.0 card. One control: the scale of `MANNEQUIN_ROOT`.
5. **Parity with Travel main 603f2a9 is not verified.** The donor is the kayfabizarro copy `travel/wip/travel_globe_wsa/terrain-planets-v1/card-carrier.js`.

## Gate 2A (closed)

- `CARD_SURF_SOURCE_PROOF.png`: the card alone in neutral, front, 3/4, side/grazing and underside views, plus a grazing close-up.
- **Georg's decision: option B.** The 14 px paper margin outside the ink band is painted ink `#1f1a14`, so the band and the black side read as one edge.
- **Gutter rule:** no extra line between the panel and the gutter. Travel's texture (cream paper outside the ink) showed exactly such a cream strip.
- **Not chosen: moving the ink closer to the edge (option C).** It would deviate from the canon and cause follow-up problems.
- **Ink:** `skills/kfb-ink-canon.js` v2, preset `card` (BAND), seed 4242, executed unchanged. `measureInk`: ok, bow 0.30 %, feather 1.38 %.
- **Slab:** 3.0 × 1.676 × 0.055, grid 10 × 14. Top, bottom and side are one mesh. The side is `#1f1a14` with roughness 0.92.

## How the rig works

```
REVIEW_STAGE_YUP          (+90° X: Travel Y-up inside Blender Z-up)
└─ CARD_WORLD_ROOT        review proxy of the Travel world transform: root pitch, root bank, barrel roll (local Z)
   └─ CARD_VISUAL         = Travel `lean`: pitch / yaw-whip / roll springs, calm wind, lectern, hover bob
      ├─ CARD_SURFACE     one slab, shape keys
      └─ SEAT_FRAME       5-sample surface height, slerp to surface normal (dt·8)
         └─ MANNEQUIN_ROOT   yaw 180° (faces flight forward −Z), separate actor root
```

**Shape keys reproduce Travel's vertex deformation exactly.** Each of Travel's terms is linear in one coefficient, so each term becomes one key:

| Key | Travel term | Driven by |
|---|---|---|
| `TRAVEL_WAVE_S` / `_C` | the travelling ripple, split into sin and cos parts | amp·sin/cos(wavePhase) |
| `TRAVEL_GUST_S` / `_C` | the calm wind | windAmp·sin/cos(windPhase) |
| `TRAVEL_CUP` | cup | cup spring |
| `TRAVEL_TAIL` | tail | tail spring |
| `TRAVEL_BANKTIP` | bank tip | roll spring |

- **Neutral shape:** basis `SOURCE_NEUTRAL`; all key values at 0 give back the flat source.
- **One slab:** top and bottom move by the same amount, so the side wall follows and no gap opens.
- **Runtime option for WSA:** this can drop in for Travel's per-vertex loop. Each Travel input maps to one key value.

**Simulation:** `sim.py` ports Travel's `sync()` (spring constants, W constants, lectern 0.175, calm gating) at dt = 1/30. The state inputs are review values (see manifest). Root pitch and bank are previews only; Travel's flight simulation owns them.

## Rider

- KayKit Mannequin_Medium, with KayKit `Idle_A` breathing as the donor.
- Authored offsets per state: crouch, foot stagger (left foot forward), arms out, lean, chest and head, bank counter-lean (head toward world up), and a barrel-roll tuck.
- Hips are lowered so the lowest sole sits on the seat plane. No root motion, no world translation.
- The barrel roll rotates only `CARD_WORLD_ROOT`. The rider's reaction is a pose and does not repeat the rotation.
- **Clips in `KFB_CARD_SURF_RIDER_Mannequin.glb`:**
  - one per state, `CARD_SURF_{CALM_LECTERN, CRUISE, BOOST, BANK_LEFT, BANK_RIGHT, CLIMB, DIVE, BRAKE_RECOVER, BARREL_ROLL, LAND_HOVER_PREP}` (loops);
  - `CARD_SURF_REVIEW` (the whole timeline);
  - two comparison poses.
- **Stance comparison** (`CARD_SURF_STANCE_COMPARE.png`, same card frame):
  - **A:** the authored stance; faces forward, readable, less "surf".
  - **B:** Quaternius `Shield_Dash` at 45 %, retargeted and held. The body turns sideways, which reads most like surfing.
  - **C:** `NinjaJump_Idle_Loop` reads as a crouch. Not recommended.

## Verdict (recommendation — Georg decides the look)

| State | Verdict | Note |
|---|---|---|
| SOURCE_NEUTRAL | KEEP | exact flat source |
| CALM_LECTERN | KEEP | 10° lectern, mild wind |
| CRUISE | KEEP | shallow ripple |
| BOOST | KEEP | rear edge rears, front dips, cup 0.14; not a plank |
| BANK_LEFT / RIGHT | **HOLD** | amount of bank and cup (defect 2) |
| CLIMB / DIVE | KEEP | root pitch preview + tail response |
| BRAKE_RECOVER | KEEP | calm ramps in, card settles |
| BARREL_ROLL | KEEP | root only, surface untwisted (`CARD_SURF_BARREL_ROLL.png`: 0/90/180/270/360) |
| LAND_HOVER_PREP | KEEP | back to lectern |
| Rider stance | **HOLD** | A or B |

## Files

| File | Content |
|---|---|
| `CARD_SURF_DEFORM_REVIEW.mp4` | card alone, all 11 states, front / 3/4 / side, 34 s |
| `CARD_SURF_MANNEQUIN_REVIEW.mp4` | the same timeline with the rider |
| `CARD_SURF_STATES_SHEET.png` | the middle frame of each state |
| `CARD_SURF_BARREL_ROLL.png` | the barrel roll at 0 / 90 / 180 / 270 / 360° |
| `CARD_SURF_STANCE_COMPARE.png` | stances A / B / C |
| `KFB_CARD_SURF_REVIEW_RIG.blend` | full rig, keyframed, texture packed, state markers on the timeline |
| `KFB_CARD_SURF_REVIEW_RIG.glb` | optional review export; morph targets keep the key names, one animation per object |
| `KFB_CARD_SURF_RIDER_Mannequin.glb` | Mannequin with all CARD_SURF clips |
| `KFB_CARD_BACKSIDE_INK_BAND_4242_optB_edge.png` | card texture with option B |
| `KFB_CARD_SURF_GATE2_manifest.json` | sources, dimensions, axes, materials, keys, seat rule, inputs per state, verdicts, limits |
| `sim.py`, `rider.py`, `gate2b.py`, `card2a.py`, `tex.py`, `dump.mjs` | rebuild scripts |

**Review-only vs runtime candidate.**
- Review-only: root pitch/bank values, the state timeline and its input values, the calm ramp.
- Runtime candidates for WSA to decide: the shape-key mapping, the CARD_SURF rider clips, and edge option B.
- Edge option B affects the Travel texture. Travel still uses cream outside the ink and the side colour `0x2a2018`.

## Questions for Georg

1. Does the card read as the Travel flying card, not a rigid board?
2. Is the bank amount and the "taco" cup in BANK_LEFT/RIGHT right, or too strong?
3. Rider stance: A (authored, facing forward) or B (Shield_Dash, sideways surf)?
4. Is the black edge clean at grazing angles (option B)?
