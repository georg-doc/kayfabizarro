# KFB ToolBox · Clay Emanata v1 · START HERE

Status: **CONCEPT / CLAUDE DESIGN BRIEF READY · IMPLEMENTATION BLOCKED BY TOOLBOX RECOVERY-01**  
Date: 2026-09-27  
Owner: **KFB ToolBox**  
Human: Georg  
Branch: `chatgpt-web/toolbox-clay-emanata-v1-2026-09-27`  
Planned Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/clay-emanata-v1/`  
Stage status: **NOT DEPLOYED · RESERVED ONLY**

## Goal

Create one reusable **3D claymation Emanata + emotional acting layer** for KFB Residents.

The result is not a second emotion engine. Existing actor / game state remains authoritative. The Emanata layer **reads** semantic emotion/action events and adds short-lived 3D clay punctuation around the actor while the existing face / EyeRig / brow / mouth / body systems provide the base acting.

The visible target is: a Resident can move from neutral into a readable emotion through coordinated

`face → body punctuation → one Emanata family → recovery`

for example:

- sad face + inner brows + lowered lids → one tear forms and drops from the real eye anchor;
- affectionate face → two or three soft clay hearts pop above the head, pulse and float away;
- shock → eyes/brows/mouth react first, then a rounded 3D ray crown flashes around the head;
- anger → narrowed eyes + brows + jaw → one clay anger-knot / spike family appears near the temple;
- panic → wide eyes + mouth + body recoil → blue clay sweat droplets burst from the temple.

## Current gate

The newest checked-in ToolBox Production-02 Claude Design cut is:

`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-02-2/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r1/`

Its Return explicitly sets **RECOVERY-01 before any further Studio expansion**. Current self-test is 27/28 and Clay-Lids step 27 is still failing; Studio Viseme parity and palette/stage layout are also open.

Therefore this slice is prepared now, but Claude Design must **not modify Production-02 for Emanata until RECOVERY-01 is closed or the ToolBox owner explicitly clears the expansion gate**.

## Source locks / donors

GitHub state is authoritative.

### D1 · current 3D face / acting substrate

- current cut: `.../KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r1/`
- entry: `KFB ToolBox Production-02.dc.html`
- current face changes: `kfb-lib/face-mount.v1.js`
- current clay-lid family: `kfb-lib/clay-lids.v1.js`, schema `kfb.clay-lids/0.2`
- clay-lid donor: PR #159, `tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs`

Claude Design must first show the current Resident/FrizzleBob face + clay-lid behavior in isolation. Do not recreate eyes, lids, brows, mouth, gaze, visemes, ear motion or body shape.

### D2 · existing KFB Emanata semantic/shape donor

Repo-exact source:

`media/2D_Assets/KFB_Custom/KFB_Emanata_ChatGPT Image 12. Aug. 2026, 16_41_34.png`

- kind: `image-2d`
- asset pack: `kfb-custom`
- blob: `bfcd4780e8d31363eb2ac771909cf800911d9c35`
- source commit: `378b209355b13304e3cff656ec0806ca5b89df28`

This is a **shape/semantic donor**, not a final 3D implementation. Claude Design must display the exact source image isolated before translating any symbol into 3D.

Historical Overworld grammar also records **14 Emanata signs**, one semantic sign family per unit/state. Clay Emanata v1 retains the important constraint as: **one active Emanata family per actor by default**, even when that family contains several instances (for example three hearts or three sweat droplets).

### D3 · ClayBound visual/form donor

Current source folder:

`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/`

Use the current screenshot/reference set and the existing KFB 3D Cartoon Style rules: large clear volumes, rounded silhouettes, toy thickness, few readable details, matte/semi-matte clay, stable handmade asymmetry, no hard-surface microdetail.

Before integrating, Claude Design must show at least one exact ClayBound screenshot/reference from this folder in isolation and record its repo path/blob in the Return. Merely loading an URL is not donor proof.

## Protected boundaries

- **ToolBox owns authoring/presentation of the Emanata library.**
- Consumer projects keep gameplay / AI / emotion-state truth.
- EyeRig / Face / mouth / brow / gaze / body owners remain unchanged.
- Emanata do not write actor state, physics, movement or camera state.
- KFB Clay Asset Studio remains raster-material/decal support only; it is not a 3D Emanata runtime owner.
- Asset Librarian remains discovery/provenance; do not create a second asset registry.
- No second mixer, face rig, emotion state machine or Resident runtime.
- No generic dashboard or isolated low-fidelity acceptance page.
- No automatic Stage or Live promotion.

# 1 · Acting model

## 1.1 Four coordinated layers

A Resident emotion should be composed from four layers with clear ownership:

1. **Face** — eyes, lids, pupils, brows, mouth, gaze. Primary emotional read.
2. **Body punctuation** — head tilt, lean, recoil, squash/stretch, ear/tail/hat lag, weight shift.
3. **Clay Emanata** — external 3D symbolic punctuation. Short, selective, readable.
4. **Optional semantic SFX** — rare punctuation only; audio owner remains separate.

The face is never replaced by Emanata. Emanata amplify or clarify a beat.

## 1.2 Trigger direction

`consumer semantic state/event → acting preset → face/body channels + emanata request`

Never:

`emanata animation → gameplay state`

The decorative layer reads state; it does not create it.

## 1.3 Named emotions are presets, not new rig types

Keep the current authoring principle: high-value channels first, named emotions as compositions.

Current base expression vocabulary:

`neutral · happy · angry · confused · suspicious · shocked · sad · smug · panicked · thinking`

Clay Emanata adds reusable symbolic families that these and later presets can call.

# 2 · Clay Emanata visual language

## 2.1 Physical 3D, symbolically legible

Every Emanatum is a genuine small 3D object with volume and side profile, but its root may orient toward the active camera enough to preserve instant symbolic readability.

Target:

- hand-shaped clay / plasticine;
- soft extrusion or metaball-like volume;
- rounded edges and tips;
- slight stable asymmetry;
- visible thickness;
- no razor-thin cards or billboard PNGs;
- no per-frame random mesh deformation;
- no glossy plastic / hard-surface tech look.

## 2.2 Stable handmade imperfection

Imperfection is generated once per instance/seed and then retained.

Allowed:

- slightly uneven lobe sizes on a heart;
- subtly off-center droplet;
- different rounded spike lengths;
- tiny squash / stretch / rotation;
- material roughness variation if source-backed.

Forbidden:

- new random contour every frame;
- noisy vertex jitter;
- procedural flicker sold as clay;
- microdetail that disappears at Resident scale.

## 2.3 Material families

Start with a restrained semantic palette, not arbitrary per-character recoloring:

- tears / sweat: cool sky / cyan clay, slightly smoother than body clay;
- hearts: warm red / pink clay;
- anger / pain: red-orange clay;
- joy / idea / sparkle: warm yellow / cream clay;
- confusion / thought: purple / blue-violet clay;
- gloom: muted blue / charcoal clay;
- sleep: pale blue / lavender clay.

Exact material values remain a measured implementation choice; do not invent a second global palette SSOT.

## 2.4 Shadow rule

Emanata are read as floating symbolic props, not scene geometry.

Default candidate:
- receive scene light;
- **do not cast facial/body shadows**;
- no contact-shadow blob over the face;
- preserve depth through volume, shading and occlusion, not dirty face shadows.

This follows the current Production-02 face-overlay shadow lesson.

# 3 · Reusable 3D family catalog

The implementation should expose **primitive families**, not dozens of one-off named emotions.

| Family | Core mesh idea | Main meaning | Typical anchor / motion |
|---|---|---|---|
| `tear_bead` | rounded teardrop | sadness / moved | under real eye → detach → fall |
| `tear_burst` | 2–4 teardrops | crying / laughing hard | both eyes → outward ballistic arc |
| `heart` | chunky asymmetric extruded heart | love / affection / delight | head_top → pop → pulse → rise |
| `broken_heart` | two soft heart halves | hurt / rejection | head_top → split → drift |
| `sweat_drop` | large rounded drop | unease / awkwardness | temple → form → slide / drop |
| `panic_sweat` | 2–4 small drops | panic / frantic effort | temple/head side → burst outward |
| `anger_knot` | rounded tubular manga vein mark | irritation / anger | temple → pop → throb |
| `anger_spikes` | thick rounded zig/spike fan | rage / pain / intensity | head side/top → flare → retract |
| `shock_rays` | 4–8 tapered soft clay rays | surprise / shock | radial head crown → flash |
| `question` | thick clay question glyph | confusion | head_top/side → pop → sway |
| `exclamation` | thick clay ! glyph | sudden realization / alarm | head_top → snap up → settle |
| `confusion_spiral` | thick soft spiral/tube | bewilderment | head side → slow wobble/orbit |
| `sparkle` | rounded 4/6-point star | joy / pride / charm | head/shoulder → pop + twinkle |
| `dizzy_stars` | 2–4 chunky stars | stunned / dizzy | head ring → orbit → fall/fade |
| `unease_ticks` | 2–3 short rounded ticks | suspicion / tension | temple → tiny pulse |
| `gloom_lines` | 3–5 soft hanging bars/drops | dejection / dread | above forehead → sink |
| `steam_puff` | 2–3 rounded clay blobs | anger / exertion | head sides/nose area → puff away |
| `sleep_z` | thick clay Z forms | sleep / doze | head_top → float upward |
| `idea_spark` | small star/bulb-like clay spark | insight / eureka | head_top → quick bloom |

### Deliberate non-Emanata channels

Some manga/cartoon expression devices should stay in the face/material layer rather than become particles:

- blush / cheek warmth;
- pallor;
- forehead shadow;
- pupil/iris treatment;
- mouth drool unless deliberately authored as a detachable droplet;
- eyelid/brow deformations.

This keeps the visual read coherent and avoids turning every emotion into a cloud of props.

# 4 · Anchor contract

Minimum semantic anchors:

`head_top · head_left · head_right · temple_L · temple_R · eye_L_under · eye_R_under · mouth · actor_center`

Optional receiving actors may map these to exact bones/nodes.

Rules:

- tears must originate from the actual eye anchor, not a guessed screen coordinate;
- temple symbols follow head motion until detached;
- floating head symbols follow the actor root while active;
- after a tear/droplet detaches, its visual trajectory may continue independently, but never writes physics/gameplay position;
- anchor absence produces an explicit fallback or no effect, never a hidden second rig.

# 5 · Animation grammar

Use the current KFB cartoon choreography:

`cause → anticipation → action → impact/read → follow-through → recovery`

## 5.1 General event budget

Default per actor:

- max active Emanata families: **1**;
- a family may use multiple pooled instances;
- no unrelated simultaneous hearts + anger + question + stars;
- strong face read precedes or coincides with the Emanata beat;
- every non-looping effect has recovery and clears itself.

## 5.2 Family motion sketches

### Tears

`well → squash → detach → stretch along trajectory → drop/arc → small recovery bead → clear`

Two useful variants:
- **single emotional tear**: one bead, slower, readable;
- **cry/laugh burst**: 2–4 droplets, fast outward arcs.

### Hearts

`pop from small → overshoot → pulse 1–2× → gentle rise/orbit → shrink/settle`

Use 1 heart for a small beat, 2–3 for strong affection. Avoid infinite heart fountains.

### Shock rays

`face reacts → ray crown expands quickly → holds for the read → retracts`

Rays are chunky rounded clay spikes, not thin vector lines.

### Anger knot / ticks

`anticipation in brows/lids → symbol pops near temple → short throb → recovery`

Do not continuously vibrate the geometry. Animate root transform, scale and rotation with stable shape.

### Sweat

`bead forms → tiny hold → slides or ejects → gravity-like arc → clear`

### Dizzy stars

`impact/body settle → stars appear → one controlled orbit → lose altitude/scale → clear`

### Steam

`cheek/jaw/pose tension → soft blob expands → separates into 2–3 puffs → dissipates by scale/opacity`

# 6 · Face + body + Emanata presets

These are starting compositions, not a fixed final taxonomy.

| Preset | Face/body base | Emanata default |
|---|---|---|
| neutral | neutral channels, living micro-motion | none |
| happy | open/soft eyes, raised/relaxed brows, smile | optional `sparkle` |
| affectionate | soft eyes, smile, head lean | `heart` |
| angry | narrowed lids, brows down/in, jaw/grimace, lean | `anger_knot` or `anger_spikes` |
| confused | asymmetric brows, gaze shift, small-open/pursed mouth | `question` or `confusion_spiral` |
| suspicious | narrowed eyes, one brow, still body | optional `unease_ticks` |
| shocked | eyes wide, brows high, O/open mouth, recoil | `shock_rays` |
| sad | inner brows raised, drooped lids, mouth down, body sink | `tear_bead` |
| crying | sad face + stronger body/shoulder rhythm | `tear_burst` |
| smug | half lids, brow offset, smirk | usually none; optional single `sparkle` |
| panicked | wide eyes, high brows, open/grimace mouth, recoil | `panic_sweat` |
| thinking | gaze up/side, brow asymmetry, pursed mouth | `question` or `idea_spark` |
| dizzy | unfocused gaze, head/body settle after impact | `dizzy_stars` |
| sleepy | heavy lids, relaxed brows, head droop | `sleep_z` |
| embarrassed | gaze avoidance, brows/eyes + face blush channel | optional `sweat_drop` |
| hurt | flinch / squeeze eyes / body recoil | `anger_spikes` or `dizzy_stars` depending event |
| relieved | release of brows/jaw/shoulders | optional single `sweat_drop` exit |
| inspired | eyes brighten/open, head lift | `idea_spark` |

# 7 · Runtime/API proposal

Proposal only; receiving owner may adapt naming after Recovery.

```js
acting.setEmotion(actorId, 'sad', { intensity: 0.7 });

emanata.emit(actorId, 'tear_bead', {
  anchor: 'eye_L_under',
  intensity: 0.7,
  seed: 142,
  variant: 'single'
});
```

Or as one semantic preset:

```js
acting.play(actorId, 'affectionate', {
  intensity: 0.8,
  emanata: true,
  seed: 42
});
```

The acting preset may request Emanata, but the renderer owns only visual instances and cleanup.

Suggested proposal record:

```ts
type EmanataEvent = {
  actorId: string;
  family: EmanataFamily;
  anchor: EmanataAnchor;
  intensity: number;     // clamped 0..1
  seed: number;
  variant?: string;
  durationMs?: number;
};
```

# 8 · Instancing / pooling

The library should be designed for many Residents without spawning new geometry/materials every beat.

Preferred structure:

- one reusable mesh/geometry per family or family variant;
- shared clay material families;
- pooled instances;
- use `THREE.InstancedMesh` where family/material/animation constraints allow;
- use a small reusable Object3D pool for trajectories that need individually animated hierarchy;
- no per-frame geometry reconstruction;
- stable seeded shape variation stored per instance;
- release instance on recovery.

A “particle” is therefore a real small clay mesh instance, not a flat sprite particle by default.

# 9 · Studio UX

Do not add a new dashboard.

After RECOVERY-01, add the smallest useful authoring seam inside the existing ToolBox:

- **Face/Acting**: current facial channels / named emotion preset;
- **Emanata**: family, intensity, variant, seed, preview trigger;
- existing Stage remains the dominant visual surface;
- preview the effect directly on a real current Resident actor;
- no metrics wall, no giant explanatory cards.

The authoring control writes/references the same semantic preset data used by the runtime adapter.

# 10 · Claude Design execution order

Only after RECOVERY-01 is closed/cleared:

1. Open exact current ToolBox/Production source and run its existing tests.
2. Show D1 current 3D face/acting donor in isolation.
3. Show D2 exact 2D Emanata donor in isolation.
4. Show one exact D3 ClayBound reference in isolation and pin its repo path/blob.
5. Build **three proof families first**:
   - `tear_bead / tear_burst`;
   - `heart`;
   - `shock_rays`.
6. Bind all three to real semantic face presets on one current Resident.
7. Prove anchors, cleanup/recovery, repeat triggers and pooled reuse.
8. Expand from the same family grammar to the remaining catalog only after those three read correctly.
9. Export full editable Session Cut with SOURCE/RETURN/TEST_REPORT.
10. Web/GitHub rehomes the verified result; only then consider the reserved Cloudflare Stage route.

This is **not** three Georg micro-gates. The first three families are an internal/professional proof set. Georg's meaningful visual review should be the integrated Resident acting result, not a grey shape gallery.

# 11 · Acceptance for the first integrated candidate

The candidate is ready for a real visual review when:

- exact source donors are visibly proven;
- current face/EyeRig/Viseme owners remain intact;
- tears visibly originate from eye anchors;
- hearts visibly pulse/rise from head space;
- shock rays read as rounded 3D clay, not 2D vectors;
- at least one face/body preset coordinates with each family;
- one active-family budget is enforced;
- repeat trigger after cleanup works;
- pooled instances do not accumulate;
- Emanata do not cast dirty facial shadows;
- stable seed does not flicker;
- no second emotion/runtime owner exists;
- existing ToolBox tests are no worse than the pre-slice baseline;
- Return names actual test counts and unresolved issues.

## Reaction Choreography extension

The Clay Emanata proof is now part of a broader **Resident Reaction Choreography** contract:

- `REACTION_CHOREOGRAPHY.md`
- `reaction-choreography.v0.1.json`

A core in-game trigger should play as **one coordinated performance** across:

`animation clip → body/parts-as-actors → EyeRig/brows → mouth/viseme → ears/secondary chains → Emanata → recovery`

Key rules:

- Animation clips are a first-class reaction layer, not an afterthought.
- Use the existing actor mixer and source-backed clip libraries; no second mixer.
- Reaction root motion is consumer-owned/locked by default.
- Existing subtree clip layering may be reused for upper-body/head/arm reaction clips.
- Active Talk/Viseme keeps mouth ownership; reaction choreography layers eyes/brows/head/body/ears around it unless a high-priority interrupt cancels speech through its owner.
- Ear Dangle receives acted pose/impulses and updates after mixer + body/head motion.
- `body-shape.v1.js` remains persistent morphology and is not an emotion animator.
- Missing reaction clips fall back to source-backed procedural parts/face/ears/Emanata; they are not fabricated from guessed filenames.
- Recovery returns to the **current consumer state** (for example running after a hit while running), not blindly to idle.

First integrated reaction proof after Recovery covers:

1. `surprise` — body/clip + wide EyeRig/brows + mouth + ears + shock rays;
2. `social.positive` — positive clip/body + face + ears + heart/sparkle;
3. `damage.light` — directional recoil + blink/brows/mouth + ear impulse + optional anger spikes;
4. `speech.emphasis` while Talk is active — Viseme keeps mouth, all other acting layers coordinate;
5. `jump.land` — existing landing/contact motion + body compression + ear impulse + blink, **no emotional Emanata**.

The reaction conductor does not own gameplay state, movement, physics, animation assets, face rigs or secondary-motion physics. It only resolves one semantic event into timed calls to those existing owners.

## Exactly one next gate

**Close / clear ToolBox RECOVERY-01. Then Claude Design implements the combined Reaction Choreography + Clay Emanata proof on the real current Resident, including source-backed animation clips as the skeletal primary-motion layer.**
