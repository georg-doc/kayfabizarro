# FB-EARS-FLOPPY-01 · Floppy ears: idle bob, flop when bending over, wind when travelling, clean ear deformation (r2)

Status: **BUILD INSTRUCTION FOR KFB TOOLBOX STUDIO (Claude Design) and the ear owner `ear-dangle.v1.js` (Animation Lab, PR #214) · physics simulated on real Motion Library clips, ear skin re-weighted and audited in Blender**
Date: 2026-09-30 · r2
r2 changes (Georg's review of r1: "unclean states" at the ears):
- new ear skin weights in `FB_TEMPLATE_LOOK_v5b.glb`;
- gravity sag is root-heavy (`sagShare`);
- asymmetric per-bone limits;
- the preset values, the numbers in §3 and all renders are updated.

Code read:
- `tools/KFB-ToolBox/ear-rig/ear-dangle.v1.js` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1` (`DangleChain.update`)
- ToolBox Production-06: `_applyEars()`, `_earRows()`, the live tick (`rt.ears.update(dt, {})`) and the sequence driver

Model: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` (bones `head`, `ear.l.1–3`, `ear.r.1–3`)

New model: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb`

Pet entry: `frizzlebob-earrig-v5` (Georg's export 2026-09-30), `ears`:
- dangle 1.5, stiff 1, damp 0.8, elastic 0.8;
- gravity unset (= 0);
- out 10.5°, back −6°, twist −14.5°, sink 0.3, fwd −0.03.

Georg 30.09:
- The ears are not floppy enough yet.
- They should bob a little in idle.
- They should flop forward when he bends over.
- They should flutter backward in the travel wind.
- And (review of r1): some ear states look unclean.

Georg judges the look. Every number below is a starting value.

## 1 · What is wrong today

The simulation is a line-by-line Python port of `DangleChain.update()`. It is driven by the head bone of the real clips at 60 fps with 1/120 s substeps. The ear tip angle is the sum of the three bone pitches; + = tip forward.

1. **The ears never get wind.**
   - The ToolBox calls `rt.ears.update(dt, {})`, both in the live tick and in the sequence driver. The "Wind + flutter" slider has no effect anywhere.
   - With the wind fed, Georg's current values would already lean the tips back by a mean of −22° at 12 m/s.
2. **The ears do not hang when he bends over.**
   - `gravity` is 0, so the bent head carries the ears along rigidly.
   - In `kfb_action_lifting_a` (head 97° forward), the tips swing back by −45° during the bend and point straight ahead at full bend (−21°). They swing forward (+58°) only 0.6 s later, when the head comes back up.
3. **Idle has almost no motion source.** In `kfb_idle_idle_b`, the head acceleration stays below 0.5 m/s², so the ear tip moves ±2°.
4. **Raising `gravity` alone does not work.** Many clips hold the head 20–25° forward in idle. With Georg's values plus gravity 0.4 (0.8), the ears sag forward permanently by a mean of +36° (+71°).
5. **The ear deforms badly at larger angles** (Georg's review; `renders/ear_states_before_after.png`, top two rows). There are three causes:
   - **Knuckles.** In the v5 skin, each ear segment follows its own bone almost rigidly, with short blend zones (about 8 cm, where the ear is 87 cm long). The ear therefore bends like three hinges, not like an arc.
   - **Tip-heavy curl.** All forces, gravity included, are scaled per bone by `g = 1, 1.6, 2.2` (root → tip). The tip curls most, and a cupped ear that curls toward its cup folds and creases like a taco. That is the hook with the inner face showing, from about 60–70° forward.
   - **Limits that allow folding.** `maxDeg` 40 / 65 / 80° per bone lets the tip reach up to 185°, and the r1 renders reached 135–148°.

## 2 · Changes

All new fields default to today's behaviour. With the defaults, the output is identical to today.

### 2.1 `ear-dangle.v1.js` (owner: Animation Lab, PR #214)

**a · `sagFrom` (degrees, default 0): a dead zone for gravity.** Sag starts only when the head leans more than `sagFrom`.

**b · `sagShare` (array of 3, default unset = today's `g`): gravity distributed root-heavy.** The ear swings at the root and stays straight instead of curling. Replace the gravity line with:

```js
const s0 = Math.sin(P.sagFrom * Math.PI / 180), dz = (v) => Math.sign(v) * Math.max(0, Math.abs(v) - s0) / (1 - s0);
const gs = P.sagShare ? 4.8 * P.sagShare[i] : g;   // 4.8 = sum of g over three bones -> same total sag
if (P.gravity) { tx += dz(downL.z) * P.gravity * 0.8 * gs; tz += -dz(downL.x) * P.gravity * 0.8 * M * gs; }
```

Proposed `sagShare` = `[0.65, 0.25, 0.10]`. Inertia, spin, wind and flutter keep `g` (tip-heavy), because they only produce small angles.

**c · Asymmetric per-bone limits `maxFwd`, `maxBack`, `maxRoll`** (arrays of 3, degrees; default unset = today's symmetric `maxDeg`). Replace the clamp with:

```js
if (P.maxFwd) { s.x = clamp(s.x, -P.maxBack[i] * D2R, P.maxFwd[i] * D2R); s.z = clamp(s.z, -P.maxRoll[i] * D2R, P.maxRoll[i] * D2R); }
else { /* today: ±maxDeg[i] */ }
```

Proposed values: `maxFwd` [72, 30, 25], `maxBack` [40, 25, 25], `maxRoll` [30, 15, 10]. This keeps every state inside the clean deformation envelope measured in §3.

**d · `bob` (tip amplitude in degrees, default 0) and `bobHz` (default 0.6): a gentle idle bob.** It is added to the pitch target of each bone inside the substep loop:

```js
if (P.bob) tx += (P.bob / 4.8) * (Math.PI / 180) * g * (Math.sin(2 * Math.PI * P.bobHz * this._t + (M < 0 ? 0.9 : 0)) + 0.35 * Math.sin(2 * Math.PI * P.bobHz * 2.37 * this._t + 1.3));
```

**e · Wind input contract** (file header, no code change):
- `update(dt, { wind })`: `wind` is the air velocity relative to the character, world space, m/s.
- `wind = sceneWind − characterWorldVelocity`.
- A host that moves the character must pass it.

### 2.2 New ear skin: `FB_TEMPLATE_LOOK_v5b.glb`

- **Only the `JOINTS_0` / `WEIGHTS_0` accessors of the two ear meshes changed** (accessors 72, 73, 77, 78). Every other byte of the file is identical to v5: mesh positions, normals, UVs, bones, rest pose, materials, the head and the body. The ear rest shape is therefore unchanged.
- **Rule:**
  - Each ear vertex gets a smooth tent weight between neighbouring bone midpoints along the rest chain: head → ear.1 → ear.2 → ear.3.
  - The head holds the vertices more than about 6 cm below the ear root.
  - Each joint's rotation spreads over a whole segment, so the ear bends as an arc.
  - At most 2 joints per vertex, weights sum to 1.
  - Script: `source/reweight.py`.
- **ToolBox:** point `EAR.fig` to `glb/FB_TEMPLATE_LOOK_v5b.glb`. v5b is on branch `georg-doc-patch-3` at commit `23615cffb515d03d2b6a0164b896dd08e3bc1bed`. The current `EAR.pin` (`19088b14`, PR #214) does not contain it, so load the figure from that commit, or copy v5b into the PR #214 lane. v5 stays at its pin for comparison.
- **Note:** the smoother weights only look clean together with the root-heavy sag (§2.1 b). With v5b and today's tip-heavy sag, the ear still folds at large angles. With v5 and root-heavy sag, the ear root stretches up to 2–4× (`AUDIT.json`).

### 2.3 ToolBox (Rigging › Ears and Animation Lab › Ears)

1. **Feed the wind every tick:**
   - `v` = actor root world velocity: finite difference of the root position, low-passed with factor 0.2.
   - `wind = −v + travelWind`, where `travelWind` = the test slider below, pointing along the actor's −forward.
   - The same goes for the sequence driver.
2. **New sliders:**
   - "Travel wind · test (m/s)", 0 … 20, session only, not exported;
   - "Gravity starts at (°)" = `sagFrom`, 0 … 60;
   - "Idle bob (°)" = `bob`, 0 … 12;
   - "Bob speed (Hz)" = `bobHz`, 0.2 … 1.5.

   `sagShare` and the limits are preset values, not sliders.
3. **Presets:** replace the four presets with three, and keep the old four under "Legacy".
   - All three share `sagFrom` 25, `sagShare` [0.65, 0.25, 0.10], `maxFwd` [72, 30, 25], `maxBack` [40, 25, 25] and `maxRoll` [30, 15, 10].

   | Preset | dangle | damp | gravity | inertia | spin | bob | wind |
   |---|---|---|---|---|---|---|---|
   | **Perky** (upright, alive) | 1.0 | 1.1 | 0.25 | 1.0 | 1.0 | 3 | 1.0 |
   | **Floppy** (proposed for FrizzleBob) | 1.4 | 1.1 | 0.4 | 1.2 | 1.0 | 5 | 1.5 |
   | **Rag** (very loose) | 1.8 | 0.95 | 0.5 | 1.4 | 1.2 | 7 | 2.0 |

   `stiff` and `elastic` stay as set. Placement and base rotation are not touched by a preset.
4. **Georg's saved entry stays as it is.** One button, "Try preset", applies a preset in the session only, until he saves.
5. **Export** writes `sagFrom`, `sagShare`, `maxFwd`, `maxBack`, `maxRoll`, `bob` and `bobHz` into `ears` (`kfb.ear-rig.v0#tuning`), only when they are set.

## 3 · Results (`SIM.json`, `AUDIT.json`, `renders/`)

### 3.1 Motion (ear tip pitch in degrees, + = forward, after 0.5 s settle)

"Today" = v5 skin and today's values. The presets use v5b and §2.

| Scenario | Today | Perky | Floppy | Rag |
|---|---|---|---|---|
| Idle `idle_b`, peak to peak | 3.6 | 10.3 | 14.1 | 16.0 |
| Idle `idle_b`, mean (the dead zone works) | 0.0 | 0.0 | 0.0 | +0.2 |
| Bend `lifting_a`, at full bend (head 97°) | **−21** | +50 | +58 | +50 |
| Bend, peak forward while rising | +58 | +91 | +113 | +127 (limit) |
| Walk 1.4 m/s (wind fed), mean | +0.3 (no wind) | −2.6 | −3.9 | −5.1 |
| Racer 12 m/s (wind fed), mean | **0 (no wind)** | −22 | −32 | −43 |
| Jump + landing (`jump_a`), peak forward | +29 | +73 | +64 | +56 |

At full bend, most of the angle now sits in bone 1 (Floppy: 51° / 14° / −7°). The ear hangs as a straight lobe instead of curling.

### 3.2 Deformation envelope (left ear, grid of tip pitch × side roll)

| Setup | Clean range (no self-intersection, blade not inside the head) | Fails at |
|---|---|---|
| v5 + tip-heavy (today) | no self-intersection, but knuckles and a folded cup from about 60° forward (visual) | edge strain 1.0–1.7 at 90–160° |
| **v5b + root-heavy (proposed)** | **tip −60° … +110°, roll ±45°** (at most 2 touching rim triangles) | back −90° (the ear enters the head); +130° with roll 45° |

The limits in §2.1 c keep the ear inside this range. The corner combinations were checked directly (bones at their limits, with and without roll): at most 4 touching rim triangles, never inside the head.

### 3.3 Renders

- `renders/ear_states_before_after.png`: the ear alone.
  - Top: today (v5, tip-heavy). Bottom: v5b, root-heavy.
  - Columns: back 45°, forward 45°, 90°, 110°, 90° + side 30°, side 30°.
- `renders/ears_side.png` and `renders/ears_threequarter.png`: FrizzleBob in the clips.
  - Rows: today, Perky, Floppy, Rag.
  - Columns: idle bob extreme, bent over, rising, racer 12 m/s.
- `renders/ear_curves.png`: tip pitch over time.
- **Remaining limit (model, Georg's call):**
  - The ear root is a thin stalk. At 90° and more, the bend concentrates there and the stalk narrows visibly.
  - A slightly thicker root would soften that. That is a change to the model, not to the rig, and not part of this slice.
- **Caveats about the renders:**
  - The ear angles are applied about the Blender ear-bone axes (close to, not guaranteed identical with, the three.js frames).
  - Georg's base rotation (out, back, twist) is not applied.
  - The body is retargeted from Rig_Medium by rotation deltas.

## 4 · Acceptance (ToolBox, on `frizzlebob-earrig-v5` with v5b)

1. **Defaults unchanged:** with the new fields unset and no wind, the ear bone quaternions over 10 s of `idle_b` equal today's, bit for bit (on v5 and on v5b).
2. **v5b is a weight-only change:** at rest, every ear vertex position equals v5 within 1e-6 m; weights sum to 1 ± 1e-5; at most 2 joints per ear vertex.
3. **Wind wired:** preset Floppy, `idle_b`, travel wind 12 m/s gives a mean tip pitch of −32° ± 8°. Without wind: 0 ± 3°.
4. **Idle bob:** preset Floppy, `idle_b`, no wind gives a tip pitch of 14° ± 5° peak to peak and a mean of 0 ± 3°.
5. **Bend:**
   - Preset Floppy, `kfb_action_lifting_a`: at 1.75 s the tip pitch is ≥ +40°, and bone 1 carries at least 60 % of it.
   - The peak stays within the limits (≤ 127°).
6. **Clean shape:** with any preset, no ear bone exceeds `maxFwd` / `maxBack` / `maxRoll` at any frame, at 30, 60 and 144 fps. No NaN.
7. **Untouched:** the eyes, lids, mouth, brows and ear placement do not change. The chain physics still works for any root → tip chain (the planned eye stalks of Lord Hunky).

The ToolBox plays the clips on the FB rig through its own retarget. Its head motion can differ slightly from Rig_Medium, hence the tolerances.

## 5 · Source

- `source/sim.py`: the Python port of `DangleChain.update()` with the proposed terms.
- `source/cfg.py`: the preset values.
- `source/run.py`: the scenarios, curves and `SIM.json`.
- `source/reweight.py`: the byte patch v5 → v5b.
- `source/audit.py`: the deformation envelope in `AUDIT.json`.
- `source/render.py`: the renders.

## Exactly one next gate

**Animation Lab: add `sagFrom`, `sagShare`, the per-bone limits and `bob` to `ear-dangle.v1.js` (§2.1). ToolBox: switch to v5b, feed the wind, add the presets and sliders (§2.2–2.3), run acceptance 1–7, then Georg picks the preset on FrizzleBob.**
