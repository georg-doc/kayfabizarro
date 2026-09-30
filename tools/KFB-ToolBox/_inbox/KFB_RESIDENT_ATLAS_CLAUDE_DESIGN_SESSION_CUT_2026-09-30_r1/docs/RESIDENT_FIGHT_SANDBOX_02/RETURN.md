# RETURN · RESIDENT-FIGHT-SANDBOX-02 · Cartoon contact · Claude Design (Resident Atlas) · 2026-09-30

Scope: the existing Fight Sandbox, switched to cartoon contact. It ships as `KFB_Resident_Atlas_S15.html`, a copy of S14 in which only the fight part was replaced. S14 stays unchanged as the baseline for the open clay/M1 measurement. S13 and `lib/fight-sandbox.js` (01) are unchanged too.

## Problems first

1. **Acceptance 3 failed in the first pass: 0 of 16.** In the raw clips, the defender's hips first step toward the attacker in the frames right after the hit-stop, then travel away.
   - Largest step back, Raider defender / Brute defender: headbutt → taking_punch 14 / 37 mm, kick → standing_death_left 25 / 63 mm, flying kick → receiving_an_uppercut 16 / 41 mm, prop → reaction_a 8 / 20 mm.
   - `taking_punch` nets toward the attacker over the 15 frames: −27 mm for the Raider, −69 mm for the Brute. Its knockback direction is measured on the head recoil ("in place"), and the hips move the opposite way.
   - **Repair (the one allowed pass): knockback lock.** For 15 frames after the hit-stop, any hip movement toward the attacker along the attack axis is caught as an offset on the defender's anchor, like a ratchet. After that the offset holds, so nothing jumps. The clip itself is untouched: no retiming, no IK.
   - Offset used, Raider / Brute defender: 52 / 134 mm (headbutt), 39 / 99 (kick), 28 / 72 (flying kick), 15 / 39 (prop).
   - Result: 16/16. You can switch it off with the "Rückstoß-Sperre" button (off = raw data).
2. **Shoulder throw vs the separation rule.** Brute vs Brute, root-aligned: the torso capsules overlap by up to 9.4 cm, which is more than 5 cm × 2.568. With separation on (rule 3), the victim gets pushed **3.53 m** away over the throw, so the grab no longer reads as a grab. Acceptance 2 still passes, because the push is working as specified. To see the throw as authored, switch "Trennung" off (view only). This conflict between rule 3 and proof item 6 is for Georg to decide.
3. **The Racer's clay dust was not found.** I searched the repo (`clay dust`, `puff`, `Staub` under `kfb-hub/stage`, Racer handover folders); the scan was bounded. The only dust module I found is `travel/…/impact-dust.js`, which makes pebble points, not a clay puff. So the puff and the dust cloud are **new clay blobs made in this session**: one material, 9 blobs for the puff and 22 for the cloud, one lighter clay tone. If the Racer asset exists, it should replace them.
4. **Puff size is read as a radius.** A puff 0.25 m across disappeared completely between two 1-m Raider heads with 5 cm of air between them. `puff = 0.25 m × defender scale` is now the radius of the puff cloud. Even so, in the Raider-vs-Raider side view the puff sits partly behind the heads (see the screenshot). The slider goes up to 0.6.
5. **Distance to the attacker can still shrink even though the defender is knocked away.** In two runs, the attacker moves forward after contact: flying kick Brute→Raider 1.64 → 1.39 m, prop Brute vs Brute 3.65 → 3.33 m. Acceptance 3 is measured along the attack axis, from the defender's hips at the end of the hit-stop.
6. **Separation pushes during strikes** (largest push per run): up to 0.43 m (flying kick Brute→Raider), 0.39 m (kick Raider→Brute), 0.35 m (prop Raider vs Raider). The push happens after contact, when the attacker's follow-through moves into the defender.
7. **fps not measured on the M1.** This preview renders in software.
8. **Pinned by branch, not by sha.** Clip GLBs and fight data come from `georg-doc-patch-3`; the commit was not resolved.

## Known limits (visible in the panel, not hidden)

- **Brute attacks Raider:** high attacks read as a miss. Flying kick visualGap 0.74 m, kick 0.64 m, prop 0.44 m; all are marked red in the panel. The headbutt at 0.14 m reads.
- **Getting up after a face-up knock-down:** skipped. After `standing_death_left` in proof item 2, B stays lying and A taunts. In the dust cloud, `getting_up` follows `fall_flat` (face down), and that fits.
- **"From behind" reactions** are marked in the panel ("liest sich wie Sucker-Punch").
- **Estimated, not measured:** `reaction_a` (proof item 4) was judged by eye, and `standing_react_small_from_right` was read from the clip name. Georg confirms both.
- **Simple collision shapes:** the head sphere ignores the hair crest, and the body capsule ignores the arms.
- `hurricane_kick_a` stays excluded.

## Checks the data passed (no fix needed)

- **Frame convention:** attacker hips at `contactFrame` match `hipsAtContact` to ≤ 1 mm, and the limb bone matches `limbAtContact` to ≤ 1 mm (16/16). Time = frame / 30, as measured in S13, also holds for the 0.2 data.
- **Head sphere offset:** read in Blender bone axes as given, the offset lands at the stance height exactly (Raider 1.429 / 1.429 m, Brute 2.945 / 2.945 m). The glTF-swizzled reading was the alternative, and it was not needed.
- **Placement:** the defender's hips sit at `hipsDistanceM` along the axis at the contact frame, exactly (16/16, before any push).
- Rig-node tracks stripped: 0. Rig node offset found: none.
- Hammer prop: Raider `handslotr` world scale 1 → ×1. Brute world scale 1 → ×2.568.

## Acceptance 1–6 (measured in the scene: Details → Fight Sandbox → "Abnahme 1–6 messen")

| # | Result |
|---|---|
| 1 | ✓ 17 attacks · 9 reactions · 68 table entries · 6 proof items |
| 2 | ✓ 21/21 runs (4 pairings × items 1–5, plus item 6 Brute vs Brute) with no head/body overlap beyond 1 cm × scale. Closest: 0.050 m. The separation floor is 5 cm × smaller scale. |
| 3 | ✓ 16/16 after the repair (items 1–4 × 4 pairings). Step back ≤ 5 mm × scale. Raw first pass: 0/16, see problem 1. |
| 4 | ✓ 16/16. Puff at `impactPuffAt` at the contact frame, error 0.000 m (tolerance 2 cm × scale). |
| 5 | ✓ Hit-stop 4 → 8 frames holds the attacker on `contactFrame` · squash 1.3 / 0.75 applied exactly · puff 0.2 → 0.4 doubles the blob size · debug shows 9 shapes (2 × head sphere, capsule, 2 ends, plus the puff point) |
| 6 | ✓ Export `kfb.fight-sandbox-verdicts/0.2` (localStorage key `…verdicts.v2`, separate from 01) · scene list 5/5 + 27 residents · S14/S13 files unchanged |

Screenshots of proof item 1 (headbutt) during the hit-stop, with debug shapes on: `screenshots/s15_fight02/s15_hitstop_headbutt_{1_Raider-vs-Raider,2_Raider-attacks-Brute,3_Brute-attacks-Raider,4_Brute-vs-Brute}.png`. Sheet: `s15_hitstop_sheet_v2.png`.

## Built

- `lib/fight-sandbox-02.js`. Staging and impact exactly as `runtimeRules`:
  - the attacker stands at the origin;
  - the defender stands in `boxing_a` at frame 1 at the moment of contact, rotated by `defenderStanceYawDeg`;
  - hit-stop, squash about the hips, and the puff at `impactPuffAt`;
  - the reaction starts at `impactFrame` and is rotated about the hips to `attackAxisYawDeg − knockbackYawInClipDeg`;
  - follow-up clips chain at the hips, with no jump back.
- **Separation, every frame:** head–head, head–capsule and capsule–capsule, the only collision check. The push is simulated in 1/30-s steps; jumping backward in time re-simulates.
- **Dust-cloud brawl:** a 0.9 s run-in, then a 2.6 s cloud with fist-fight / taking-punch loops inside. The pair sways ±35°, so limbs poke out. The cloud drifts 2 m, then B is ejected (fall_flat → getting_up) while A stays dizzy, and the cloud dissolves.
- **Shoulder throw:** Brute vs Brute only. For other pairings the panel points to the dust cloud.
- **Panel:**
  - pairing; proof set or free pick (02 table and 02 rules);
  - visualGap with a readability colour; staging, impact and hit-from notes;
  - sliders for hit-stop, squash width/height/duration and puff size;
  - camera nudge, debug shapes, knockback lock, separation;
  - live gap, push and lock read-out;
  - verdict keep/rework/drop plus a note, JSON export, acceptance.
- `data/fight-sandbox-02.json`: figures, ring, clip → GLB for 33 clips (plus `facingYawDeg`, used by the dust cloud only), and the hammer prop. **No fight values.**
- Fight data: an unchanged copy of `fight/KFB_Fight_Cartoon_Contact.json` and `proof_cartoon_contact.png`. `KFB_Fight_Combos.json` is not read.
- Not built: mesh collision, physics or ragdoll, timeline editor, IK, clip retiming.

## Exactly one next gate

**Georg plays the proof set in S15 and exports his verdicts.** He also decides problem 2: whether the throw keeps separation or is exempt. Only then decide which moves get new clips and which combos go to the Blender MCP chat.
