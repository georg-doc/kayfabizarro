# FB-EARS-FLOPPY-01 · Floppy ears: idle bob, flop when bending over, wind when travelling

Status: **BUILD INSTRUCTION FOR KFB TOOLBOX STUDIO (Claude Design) and the ear owner `ear-dangle.v1.js` (Animation Lab, PR #214) · physics simulated on real Motion Library clips, reference renders on FB Ear Rig v5**
Date: 2026-09-30
Code read:
- `tools/KFB-ToolBox/ear-rig/ear-dangle.v1.js` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1` (`DangleChain.update`)
- ToolBox Production-06: `_applyEars()`, `_earRows()`, the live tick (`rt.ears.update(dt, {})`) and the sequence driver
Model: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` (bones `head`, `ear.l.1–3`, `ear.r.1–3`)
Pet entry: `frizzlebob-earrig-v5` (Georg's export 2026-09-30), `ears`:
- dangle 1.5, stiff 1, damp 0.8, elastic 0.8;
- gravity unset (= 0);
- out 10.5°, back −6°, twist −14.5°, sink 0.3, fwd −0.03.

Georg 30.09:
- The ears are not floppy enough yet.
- They should bob a little in idle.
- They should flop forward when he bends over.
- They should flutter backward in the travel wind.

Georg judges the look. Every number below is a starting value.

## 1 · What is wrong today (read in the code, simulated on the clips)

The simulation is a line-by-line Python port of `DangleChain.update()`. It is driven by the head bone of the real clips at 60 fps with the same 1/120 s substeps. The ear tip angle is the sum of the three bone pitches; + = tip forward.

1. **The ears never get wind.**
   - The ToolBox calls `rt.ears.update(dt, {})`, both in the live tick and in the sequence driver. The `wind` field is never filled, so the "Wind + flutter" slider has no effect anywhere.
   - With the wind fed, Georg's current values already lean the tips back by a mean of −22° at 12 m/s. Today they get 0°.
2. **The ears do not hang when he bends over.**
   - `gravity` is 0 ("cartoon stiff"). The spring target lives in head space, so a bent head carries the ears along rigidly.
   - What moves today is only the head-turn throw (`spin`). In `kfb_action_lifting_a` (head 97° forward), the tips swing **back** by −45° during the bend, point straight ahead at full bend (−21°), and only swing forward (+58°) 0.6 s later, as the head comes back up.
3. **Idle has almost no motion source.**
   - In `kfb_idle_idle_b`, the head acceleration stays below 0.5 m/s² (95th percentile).
   - The ear tip moves ±2° (3.6° peak to peak). That is invisible.
4. **Raising `gravity` alone does not work.**
   - The sag term uses the head's absolute tilt. Many clips hold the head 20–25° forward even in idle (`idle_b`: 21–24°).
   - Measured with Georg's values plus gravity 0.4 (0.8), the ears sag forward permanently in idle by a mean of +36° (+71°).

## 2 · Changes

All new fields default to today's behaviour. With the defaults, the output is identical to today.

### 2.1 `ear-dangle.v1.js` (owner: Animation Lab, PR #214)

**a · `sagFrom` (degrees, default 0): a dead zone for gravity.**
The sag starts only when the head leans more than `sagFrom`. In `update()`, replace the gravity line with:

```js
const s0 = Math.sin(P.sagFrom * Math.PI / 180), dz = (v) => Math.sign(v) * Math.max(0, Math.abs(v) - s0) / (1 - s0);
if (P.gravity) { tx += dz(downL.z) * P.gravity * 0.8 * g; tz += -dz(downL.x) * P.gravity * 0.8 * M * g; }
```

With `sagFrom` 25°, an idle head at 21–24° gives no sag, and a head bent 97° gives almost the full sag.

**b · `bob` (tip amplitude in degrees, default 0) and `bobHz` (default 0.6): a gentle idle bob.**
It is added to the pitch target of each bone, inside the substep loop, next to the flutter:

```js
if (P.bob) tx += (P.bob / 4.8) * (Math.PI / 180) * g * (Math.sin(2 * Math.PI * P.bobHz * this._t + (M < 0 ? 0.9 : 0)) + 0.35 * Math.sin(2 * Math.PI * P.bobHz * 2.37 * this._t + 1.3));
```

- 4.8 is the sum of the bone gains `g` (1 + 1.6 + 2.2), so `bob` is the tip amplitude of the target.
- The spring shapes it into a soft, lagging bob.
- The right ear is phase-shifted by 0.9 rad, so the two ears do not move in lockstep.

**c · Wind input contract** (documentation in the file header, no code change):
- `update(dt, { wind })`: `wind` is the air velocity relative to the character, in world space, m/s.
- `wind = sceneWind − characterWorldVelocity`.
- A host that moves the character (racer, travel-globe card, walking with root motion) must pass it. A host that passes nothing gets no wind.

### 2.2 ToolBox (Rigging › Ears and Animation Lab › Ears)

1. **Feed the wind every tick.**
   - `v` = actor root world velocity: finite difference of the root position, low-passed with factor 0.2.
   - `wind = −v + travelWind`, where `travelWind` = the test slider below, pointing along the actor's −forward.
   - The same goes for the sequence driver.
2. **New sliders:**
   - "Travel wind · test (m/s)", 0 … 20, session only, not exported;
   - "Gravity starts at (°)" = `sagFrom`, 0 … 60;
   - "Idle bob (°)" = `bob`, 0 … 12;
   - "Bob speed (Hz)" = `bobHz`, 0.2 … 1.5.
3. **Presets:** replace the four presets with three, and keep the old four under "Legacy":

   | Preset | dangle | damp | gravity | sagFrom | inertia | spin | bob | wind | limit |
   |---|---|---|---|---|---|---|---|---|---|
   | **Perky** (upright, alive) | 1.0 | 1.1 | 0.25 | 25 | 1.0 | 1.0 | 3 | 1.0 | 1 |
   | **Floppy** (proposed for FrizzleBob) | 1.4 | 1.1 | 0.4 | 25 | 1.2 | 1.0 | 5 | 1.5 | 1 |
   | **Rag** (very loose) | 1.8 | 0.95 | 0.5 | 25 | 1.4 | 1.2 | 7 | 2.0 | 0.8 |

   `stiff` and `elastic` stay as set. Placement and base rotation (spread, fwd, rise, sink, out, back, twist) are not touched by a preset.
4. **Georg's saved entry stays as it is.** Offer one button, "Try preset", that applies a preset in the session only, until he saves.
5. **Export** writes `sagFrom`, `bob` and `bobHz` into `ears` (`kfb.ear-rig.v0#tuning`), only when they are not 0.

## 3 · Simulated result (`SIM.json`, `renders/ear_curves.png`)

Ear tip pitch in degrees, + = forward, after 0.5 s settle:

| Scenario | Today | Perky | Floppy | Rag |
|---|---|---|---|---|
| Idle `idle_b`, peak to peak | 3.6 | 10.3 | 14.1 | 16.0 |
| Idle `idle_b`, mean (the dead zone works) | 0.0 | 0.0 | 0.0 | +0.2 |
| Bend `lifting_a`, at full bend (head 97°) | **−21** | +52 | +53 | +39 |
| Bend, peak forward during the rise (follow-through) | +58 | +97 | +136 | +148 (limit) |
| Walk 1.4 m/s (wind fed), mean | +0.3 (no wind) | −2.6 | −3.9 | −5.1 |
| Racer 12 m/s (wind fed), mean | **0 (no wind)** | −22 | −32 | −43 |
| Jump + landing (`jump_a`), peak forward | +29 | +74 | +61 | +56 |

`renders/ears_side.png` shows FrizzleBob from the side.
- Rows: today, Perky, Floppy, Rag.
- Columns: idle bob extreme, bent over (head 97°), rising (follow-through), racer 12 m/s.
- Today, the bent-over ears point straight ahead along the head; with the presets they hang.
- **Caveats about the renders:**
  - The ear angles are applied about each ear bone's local axes in Blender. That is close to, but not guaranteed identical with, the three.js bone frames.
  - Georg's base rotation (out, back, twist) is not applied, so the ears look more parallel than in the ToolBox.
  - The body is retargeted from Rig_Medium by rotation deltas.

## 4 · Acceptance (ToolBox, on `frizzlebob-earrig-v5`)

1. **Defaults unchanged:** with `sagFrom` 0, `bob` 0 and no wind, the ear bone quaternions over 10 s of `idle_b` equal today's, bit for bit.
2. **Wind wired:** preset Floppy, `idle_b`, travel wind 12 m/s gives a mean tip pitch of −32° ± 8°. Without wind, it gives 0 ± 3°.
3. **Idle bob:** preset Floppy, `idle_b`, no wind gives a tip pitch of 14° ± 5° peak to peak and a mean of 0 ± 3°.
4. **Bend:** preset Floppy, `kfb_action_lifting_a`: at 1.75 s the tip pitch is ≥ +35°, and the peak stays ≤ 150°.
5. **Stable:** no NaN, and bone offsets stay within `maxDeg × limit` at every frame, at 30, 60 and 144 fps.
6. **Untouched:** the eyes, lids, mouth, brows and ear placement do not change. The same chain physics keeps working for any root → tip chain (the planned eye stalks of Lord Hunky).

The ToolBox plays the clips on the FB rig through its own retarget. Its head motion can differ slightly from Rig_Medium, hence the tolerances.

## 5 · Source

- `source/sim.py`: the Python port of `DangleChain.update()` plus the proposed `sagFrom` and `bob` terms.
- `source/run.py`: the scenarios, curves and `SIM.json`.
- `source/cfg.py`: the preset values.
- `source/render.py`: the side-view renders on FB Ear Rig v5.

## Exactly one next gate

**Animation Lab: add `sagFrom` and `bob` to `ear-dangle.v1.js` (§2.1). ToolBox: feed the wind and add the presets and sliders (§2.2), run acceptance 1–6, then Georg picks the preset on FrizzleBob.**
