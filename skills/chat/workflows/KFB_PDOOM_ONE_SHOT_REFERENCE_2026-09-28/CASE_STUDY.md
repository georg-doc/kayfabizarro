# KFB Case Study · PDoom / autonomous coded animation

**Status:** CURRENT_REFERENCE CANDIDATE · ANALYSIS, NOT CANON  
**Date:** 2026-09-28  
**Primary external implementation:** `JohnHeibel/PDoomVideo` @ `fa546a38092e75f2b079e6a86d6abc54dd525d17`  
**Generalized successor inspected:** `JohnHeibel/ClaudeAnimationBase`  
**Prompt context:** Donald Jewkes X post supplied by Georg, status ID `2102801469976248500`

---

## 1. Why this reference matters

PDoom is useful to KFB less as a visual-style donor than as a **production-system case study**.

The repository demonstrates a long coded animation that was decomposed into:
- one written visual/motion guide;
- one full storyboard;
- shared drawing/timing/camera primitives;
- isolated chapter modules;
- deterministic time-driven frames;
- fast evidence renders;
- offline final capture.

The associated public one-shot prompt demonstrates the complementary orchestration pattern: give an agent a rich destination, references, available tools, freedom, quality criteria and explicit permission to research/review/revise, then let it execute a multi-stage process internally.

### Main conclusion

**One-shot should describe the human interaction boundary, not the absence of internal iteration.**

For KFB:

`one Georg brief → autonomous research / planning / build / QA / repair / final candidate`

is a stronger target than:

`one Georg brief → one unreviewed generation pass`.

---

# 2. Evidence classes

This document keeps three classes separate.

## VERIFIED FROM REPOSITORY

Directly inspected in the current public GitHub source:
- PDoom README describes two model-generated generations and says the model authored the repository;
- the final source is divided into nine chapter files plus shared core/cast/props/lyrics/timeline code;
- `ANIMATION_GUIDE.md` is the shared production guide for parallel chapter work;
- `STORYBOARD.md` contains scene, timing and transition plans;
- frames are designed to render out of order and in parallel;
- shots are functions of absolute song time;
- seeded helpers provide deterministic object variation;
- a controlled 12 Hz line-boil is intentionally used for the 2D hand-drawn aesthetic;
- beat/timing/easing/camera helpers are centralized;
- the render tool can create contact sheets, stills, short clips, complete frame sequences and final MP4;
- final frames are rendered through headless Chrome and encoded with ffmpeg;
- the frame render is resumable;
- the successor `ClaudeAnimationBase` turns these ideas into a more general starter kit and adds a larger workflow/animation guide.

## CREATOR / POST CLAIM

The supplied public prompt/post presents the project as a one-prompt delegation and reports a long autonomous work period. The prompt itself delegates broad responsibilities including reference study, style development, asset work, composition/timing planning, external generation tools, full-video review and iteration.

These are useful process claims, but they are not independently proven by the source code and must not be turned into KFB benchmark numbers.

## KFB INFERENCE / PROPOSAL

Everything in the “KFB adoption” sections below is our translation of the observed pattern into current KFB architecture. It does not mean the external repository implemented KFB concepts.

---

# 3. Design analysis

## 3.1 One framing world beats a clip pile

The PDoom storyboard gives the whole film one theatrical framing device. The story opens in a stage context, escapes into increasingly wild worlds, then reveals and returns to the theater.

This solves a common generative-video failure: individually attractive scenes that feel unrelated.

### KFB adoption

Before scene implementation, define one **physical framing grammar** for a short:
- world / stage / book / map / board / diorama / vehicle / room;
- how scenes leave that world;
- how they return;
- what recurring physical object carries continuity.

For the Elisa film the existing physical chain already does this well:

`birthday card → paper map → SAE/snack block → treasure map → dungeon plan → dungeon → loot → car fantasy → sunset party`

That chain should be treated as the film's framing system, not merely a list of shots.

---

## 3.2 Reuse a set, then escalate it

PDoom repeatedly returns to the same stage for choruses, but each return changes the stakes and visual state.

This is more efficient and more coherent than inventing a new location for every beat:
- viewers already understand the space;
- changes are legible;
- recurring props acquire meaning;
- asset reuse becomes a narrative device.

### KFB adoption

Prefer:

`known place + meaningful transformation`

over:

`new place every 3 seconds`.

Examples:
- return to one dungeon chamber with increasingly strange loot;
- return to the same Cologne-map plane after different adventures;
- return to one performance stage with new band/crowd/weather states;
- reuse one prop whose state escalates.

---

## 3.3 Design arcs, not only scene palettes

PDoom explicitly uses colour progression and size escalation across the whole film.

Portable design arcs include:
- palette;
- scale;
- light;
- material;
- crowd density;
- camera distance;
- environmental disorder;
- costume/prop state.

### KFB adoption

A KFB storyboard should carry at least one **global visual arc** in addition to per-shot look.

For clay/paper shorts:
- tactile warm paper / soft clay can begin intimate;
- dungeon can compress light and deepen contrast;
- driving fantasy can broaden depth, speed and camera scale;
- finale can release into wide warm sunset colour.

---

## 3.4 Text should not explain an action the animation can show

PDoom's storyboard deliberately minimizes labels and uses visual acting/gags instead.

This is highly transferable to KFB and aligns with current anti-slop rules.

### KFB rule

Before adding on-screen copy, ask:

`Would the shot still communicate this if the text disappeared?`

If yes, remove or subordinate the text.

Keep text when it is itself an object or story fact:
- a real map label;
- a single unlock phrase;
- a title;
- a deliberately comic sound word;
- a necessary brand / UI identity.

---

## 3.5 Composition must reserve attention

The external prompt explicitly plans for typography and attention rather than throwing text over an already busy image. The repo guide likewise protects the karaoke band from important character action.

### KFB adoption

Every shot brief should name:
- **primary read zone**;
- face/eye protection;
- dialogue/text safe area if needed;
- transition entry/exit edge;
- foreground/background contrast;
- camera motion direction.

Do not compose the 3D scene first and “fit” text/VFX afterward.

---

## 3.6 Opening hook and ending rhyme

The external workflow treats the opening as an explicit attention problem. The generalized animation guide adds the rule that the ending should rhyme with the opening.

This is a strong general short-film pattern.

### KFB adoption

Plan:
- a clear visual event in the first 1–2 seconds;
- one opening motif;
- one changed callback to that motif at the end.

The callback can be:
- same framing, transformed;
- same prop, new meaning;
- same pose, new character state;
- same camera move in reverse.

---

# 4. Animation analysis

## 4.1 “Something happens” is a useful shot test

The PDoom storyboard's strongest simple rule is that every shot contains an event: change, break, transformation, pursuit, reveal, fall, reaction or payoff.

That maps well to KFB's current principle that motion is meaning in time.

### KFB shot test

A shot fails if its description is only:

`character stands in attractive set`.

A usable shot contains:

`state A → cause → visible action/change → readable reaction/state B`.

---

## 4.2 Viewer reads should be timed explicitly

The generalized successor turns one implicit lesson into a strong production tool: list what the viewer must understand in sequence, then assign time to each **read**.

This usefully extends KFB's current primary/secondary/tertiary-read model.

### Proposed KFB shot field

For cinematic work:

```text
SHOT
primary action:
reads:
  00.0–00.5  viewer recognizes location / actor
  00.5–01.0  actor notices object
  01.0–01.3  anticipation
  01.3–01.6  action / impact
  01.6–02.2  reaction / meaning lands
transition out:
```

This is especially valuable for agent-generated animation, because the agent already “knows” the intended meaning and otherwise tends to move on before a first-time viewer can read it.

---

## 4.3 Fast actions, held meanings

A coded animation can execute movement perfectly while still feeling rushed.

The reusable timing principle is:
- fast motion may be extremely fast;
- anticipation must direct the eye first;
- impact/meaning needs a readable hold;
- reaction needs its own beat;
- recovery should resolve the composition.

This maps directly to:

`cause → anticipation → action → impact → follow-through → recovery`.

---

## 4.4 Keyposes before interpolation

The successor guide explicitly recommends checking storytelling keyposes as stills before adding between-motion.

This is a particularly good fit for KFB's rigs.

### KFB adoption

For a new motion beat:
1. pose the important semantic frames;
2. render still evidence;
3. verify silhouette / eye direction / contact;
4. then choose source clip or procedural interpolation;
5. add secondary actors/ears/props only after the primary action reads.

This reduces “technically animated but unreadable” output.

---

## 4.5 Emotion is a transition, not a state swap

PDoom uses an explicit emotion-morph helper so eyes/faces do not snap instantly.

KFB already has body/parts-as-actors, EyeRig, mouth, ears and emanata. The same idea should become reaction choreography:

`perception → eye/head lead → body take → facial transition → emanata accent → settle`

not:

`set eyes='happy'; show hearts`.

This is directly relevant to current KFB Reaction Choreography work.

---

## 4.6 Camera is part of acting

PDoom gives almost every shot a camera job: push, pan, tilt, whip, pull-out or impact shake.

The transferable principle is **not** “camera must always move”. KFB's current rule is better:

> camera motion must have a purpose.

### KFB adoption

Name one purpose when camera moves:
- reveal;
- follow;
- transfer attention;
- increase/decrease scale;
- cross a physical transition;
- sell impact;
- expose a joke/payoff.

If no purpose exists, keep the camera still.

---

## 4.7 Transition-out belongs in the storyboard

PDoom's storyboard routinely specifies how a shot exits: mouth closes over camera, camera follows a fall, bubble fills frame and pops, door slams, flash wipes, object continues across cut.

This is one of the most useful additions for KFB.

### Proposed KFB storyboard columns

`IN | READS / ACTION | CAMERA | OUT`

The `OUT` field should be authored while storyboarding, not left to final polish.

Transition types can include:
- cut on action;
- object/character crosses lens;
- world folds/tears;
- match shape;
- continuous camera move;
- iris/keyhole/heart;
- impact flash;
- physical paper fold;
- material transformation;
- motivated smash cut.

For KFB clay/paper this is a major quality lever.

---

## 4.8 Controlled imperfection: adopt selectively

PDoom intentionally reseeds drawing jitter around 12 times per second to create boiling hand-drawn lines.

That is appropriate to its medium, but **not a global KFB rule**.

Current KFB motion/ink contracts value stable recognition and reject uncontrolled re-randomization.

### KFB translation

Use controlled stop-motion irregularity through:
- stepped pose sampling where appropriate;
- small purposeful hold variation;
- material/fingerprint microvariation;
- secondary-part lag;
- controlled camera/lighting imperfections only when motivated.

Do **not**:
- randomize source mesh geometry per frame;
- make all clay surfaces wobble;
- jitter persistent contours until silhouettes crawl;
- animate everything simply to avoid stillness.

---

## 4.9 Finale as callback machine

PDoom's finale reuses characters, props, stage mechanics and visual jokes already introduced. It does not spend the ending introducing a new system.

### KFB adoption

Reserve finales for:
- returns;
- transformations;
- payoffs;
- ensemble choreography;
- escalation of already understood motifs.

For Elisa, the Orc band / disco / rainbow should unify prior story objects rather than become a disconnected party asset dump.

---

# 5. Technical architecture analysis

## 5.1 Absolute-time deterministic frames are the enabling idea

The PDoom chapter functions receive absolute video time and are expected to render a complete frame from that time alone.

That enables:
- out-of-order frame rendering;
- parallel workers;
- reliable re-render of one exact time;
- contact-sheet generation without replaying earlier state;
- resumable full rendering;
- easier debugging.

### KFB translation for 3D

A cinematic KFB consumer should strive for the same **observability**, even when underlying Three.js animation uses mixers and clips.

For capture:
- use a deterministic film clock;
- use fixed seeds;
- evaluate actor/camera/material state reproducibly for a requested time or fixed-step frame;
- preserve one mixer per actor;
- do not let wall-clock timing or random load order decide the pose;
- separate gameplay/runtime owners from the film's read-only presentation timeline.

A KFB film need not make the entire engine mathematically stateless. It should make the **captured result reproducible**.

---

## 5.2 Shared core + isolated chapters is agent-friendly

PDoom separates:
- shared engine/timing/camera/actor helpers;
- per-chapter implementation files.

The animation guide tells parallel subagents to edit only their chapter file and not mutate shared code casually.

This is exactly the kind of architecture that makes parallel agent work safer.

### KFB adoption

For a multi-shot film:
- frozen source manifest;
- shared film clock / camera contract / asset loader / audio contract;
- shot or chapter modules with explicit ownership;
- no subagent silently changes actor, loader, audio or world core;
- shared-core bugs are reported/fixed centrally.

The isolation boundary is more important than the exact JS module format.

---

## 5.3 Style guide is executable coordination

PDoom's `ANIMATION_GUIDE.md` is not just prose taste documentation. It exposes:
- available drawing primitives;
- timing helpers;
- camera API;
- character parameters;
- palette;
- performance budgets;
- QA commands.

This turns artistic direction into an **agent-readable production interface**.

### KFB adoption

A one-shot brief should point to:
1. source truth;
2. look/material rules;
3. motion grammar;
4. actual available modules/assets;
5. camera/transition rules;
6. QA commands/evidence format.

Do not force each subagent to rediscover the toolset.

---

## 5.4 QA renderer is first-class tooling

PDoom's renderer supports multiple evidence modes rather than only “render the final movie”:
- contact sheets;
- isolated stills;
- short clips;
- complete frames;
- final encode;
- loops.

The generalized successor adds even more focused strips/crops.

### KFB adoption

For coded 3D animation, build equivalent cheap inspection commands/surfaces:

**SHOT SHEET**
- first / key / impact / last frame per shot.

**MOTION STRIP**
- dense 0.05–0.1 s samples around a throw, impact, turn, reaction or transition.

**DETAIL CROP**
- face / hand / foot contact / prop grip / eye direction / shadow contact.

**SHORT CLIP**
- transition pair or full problematic shot with audio.

**FULL CANDIDATE**
- only after local issues are cheap to inspect.

These are internal QA evidence, not new Georg approval sites.

---

## 5.5 Offline rendering changes the optimization target

PDoom explicitly accepts seconds per frame because final quality matters more than interactive frame rate.

KFB has two different cases:
- **game/runtime consumer:** must hit interactive constraints;
- **cinematic capture:** may use more expensive material/compositing/camera paths if they remain deterministic and bounded.

Do not impose game-frame budgets on an offline birthday short, and do not import offline-film costs into gameplay owners.

---

## 5.6 Separate global compositor responsibilities

PDoom centralizes some concerns globally rather than repeating them in every shot:
- paper/grain;
- global text/karaoke;
- chapter wipes;
- recurring meter;
- final compositing.

### KFB adoption

A cinematic consumer should similarly centralize:
- film clock;
- global aspect/capture;
- global grade/material finish where appropriate;
- audio master/ducking;
- subtitle/title safe areas;
- transition orchestration;
- capture metadata.

Shot modules own story staging, not transport infrastructure.

---

# 6. Prompting analysis

## 6.1 One-shot ≠ short prompt

The associated public prompt is long and production-oriented. It gives the agent a **commission**, not a single micro-instruction.

The useful anatomy is:

`Outcome + sources + taste + tools + constraints + freedom + workflow + QA + budget + stop condition`

This is the pattern KFB should copy.

---

## 6.2 Destination should be specific; implementation can stay open

The prompt strongly specifies:
- desired quality;
- audience;
- aesthetic intent;
- source/reference material;
- tools available;
- what should be avoided;
- what the finished output must accomplish.

At the same time it gives the model room to choose many scene ideas and production methods.

### KFB lesson

Be strict about:
- owner boundaries;
- source identity;
- narrative beats;
- quality bar;
- privacy/safety;
- final evidence;
- no-go aesthetics.

Be flexible about:
- exact camera path;
- exact staging;
- exact transition solution;
- which of several verified props is used;
- how an effect is implemented inside the protected owner contract.

This is better than either extreme:
- vague “make something cool”;
- micro-directing every transform before the agent sees the scene.

---

## 6.3 Give the model taste, not only requirements

The external prompt contains qualitative taste language and anti-slop direction in addition to technical requirements.

KFB already has this instinct in its anti-slop guardrails.

### Prompt fields worth keeping

```text
ARTISTIC NORTH STAR
WHAT MUST FEEL TRUE

ANTI-GOALS
WHAT WOULD MAKE THIS LOOK GENERIC / CHEAP / OFF-BRAND

REFERENCE FUNCTION
WHAT EACH REFERENCE IS FOR
  character identity
  material
  staging
  camera
  rhythm
  typography
  not-to-copy boundary
```

A reference URL without a declared function often produces superficial imitation.

---

## 6.4 Tell the agent which capabilities exist

The one-shot prompt names reference libraries and available generation/audio/video tools. PDoom's own guide names every useful code helper.

This prevents tool blindness.

### KFB lesson

A master prompt should list **capabilities, not secrets**:
- current donor registry;
- ToolBox profiles;
- animation clips;
- Asset Librarian;
- audio baseline;
- browser/capture tools;
- permitted external generation services;
- hard spend limits.

Never paste or print API keys. Credentials remain in environment/connectors.

---

## 6.5 Style sheet before scale

A strong one-shot does not mean constructing 50 shots before verifying a coherent grammar.

The associated prompt explicitly asks for style development; PDoom itself has a central guide; the successor includes model sheets.

### KFB translation

Internally, before full production, establish a compact machine-checkable **look bible**:
- hero actor source;
- material treatment;
- paper/clay relation;
- palette;
- lighting;
- camera grammar;
- transition grammar;
- text/emanata grammar.

This can be an internal preflight. It does not need to become a Georg micro-gate.

---

## 6.6 Storyboard before code, but do not stop there

PDoom's final repo has a full shot/timing/transition storyboard. Its successor explicitly tells agents to storyboard before implementation.

For KFB autonomous work:
1. storyboard internally;
2. check timing/reads/transitions;
3. continue directly to production when no human decision is needed.

This reconciles good planning with the current KFB no-pseudo-gates rule.

---

## 6.7 Prompt the review loop explicitly

The external one-shot prompt tells the agent to inspect the whole output repeatedly and use screenshots. The repo provides tools that make that instruction executable.

This is critical.

A good prompt should not just say:

`make it high quality`.

It should say what review means:

```text
Render evidence.
Inspect every transition.
Inspect dense motion strips around impacts.
Watch the whole candidate with audio.
Name failed criteria.
Repair only failures.
Re-render.
Use an independent Critic context when available.
Stop after the bounded repair limit.
```

---

## 6.8 “Use your judgment” works only after constraints are clear

The external examples show broad creative freedom can work when the agent has:
- a strong character anchor;
- a production guide;
- references;
- tools;
- quality criteria;
- review permission.

### KFB lesson

Autonomy should increase **after** source/owner boundaries are explicit.

Do not replace missing KFB sources with creative inference merely because the prompt says “be ambitious”.

---

## 6.9 Resource envelope changes behavior

The prompt tells the model that substantial compute/tool budget is available while still asking for economical use.

KFB should do the same in bounded form:
- hard monetary cap;
- token/agent budget where relevant;
- render-cost expectations;
- use existing assets before paid generation;
- spend budget on the highest-impact uncertainty.

This is better than either:
- no budget information;
- “use everything”.

---

# 7. What KFB should NOT copy

## 7.1 Do not turn “everything moves” into permanent noise

PDoom's medium benefits from constant hand-drawn life.

KFB explicitly rejects:
- permanent wobble;
- constant particles;
- indiscriminate camera drift;
- random decorative motion.

Keep KFB's semantic motion hierarchy.

## 7.2 Do not copy p5.brush as universal renderer

The architecture is portable; the renderer is not universal.

KFB 3D should keep:
- current Three.js/runtime owners;
- GLTF/GLB asset identity;
- rigs and animation mixers;
- clay material pipeline;
- source-backed OSM/world geometry.

## 7.3 Do not expose credentials in prompts

Prompts may state that a tool/service is available and define a cost cap.

They should not contain or print secrets.

## 7.4 Do not use “make no mistakes” as QA

A strong exhortation may affect model effort, but it is not evidence.

KFB requires:
- checks;
- screenshots/playback;
- source verification;
- Critic result;
- exact failed/passed criteria.

## 7.5 Do not use external visual generation to replace known KFB assets

Generated video/image material may be a reference, concept plate or background source where permitted.

It must not silently replace:
- FrizzleBob;
- GothGirl;
- verified KayKit/Kenney assets;
- current KFB branding;
- source-owned characters/props.

## 7.6 Do not confuse public source with clean reuse rights

PDoom's inspected package metadata declares ISC, but its root did not expose a LICENSE file in the inspected tree. The linked generalized successor has an explicit MIT LICENSE.

For KFB, principles are free to study; concrete code reuse still requires explicit provenance/license verification.

---

# 8. Proposed KFB autonomous coded-animation pattern

This is the reusable abstraction worth carrying forward.

## INPUT FREEZE

Record:
- project owner;
- exact GitHub head;
- source manifest;
- actor profiles;
- asset pins;
- audio/source inputs;
- privacy/no-substitute constraints.

## PRODUCTION BIBLE

One compact machine-readable/readable guide:
- visual north star;
- material rules;
- palette/light arc;
- actor/motion grammar;
- camera grammar;
- transition grammar;
- safe text/VFX rules;
- available helpers/modules.

## STORYBOARD

Each shot records:

`time | setting | reads | action | reaction | camera | OUT transition | audio`

Also record:
- recurring motif;
- global palette/scale arc;
- opening hook;
- ending callback.

## IMPLEMENTATION

Prefer:
- shared film clock;
- shared source/asset loader;
- shared compositor/audio/capture;
- isolated chapter/shot modules;
- one writer per mutable owner;
- deterministic/random-seeded presentation.

## INTERNAL QA

For each shot:
- keypose sheet;
- transition pair;
- dense motion strip around important action;
- face/contact crop when relevant;
- short playback.

For whole film:
- full candidate with audio;
- coherence/arc check;
- independent Critic.

## SILENT REPAIR

`Critic fail → named failed criteria → targeted repair → re-render → Critic`

Preserve passing work.

Current KFB stop rule remains:
- maximum two failed repair passes on the same gate/problem;
- then freeze/export recovery.

## HUMAN REVIEW

Human review is for the meaningful integrated candidate unless:
- a real artistic fork needs Georg;
- source identity is ambiguous;
- destructive promotion is involved;
- autonomous repair has hit the bounded stop.

---

# 9. Prompt skeleton for KFB one-shots

This is a structure, not a copied external prompt.

```md
# MISSION / FINAL OUTCOME
What finished artifact must exist?

# SOURCE TRUTH
Repo / branch / owners / source manifest / frozen actor profiles.

# STORY / REQUIRED MEANING
What must the audience understand and feel?

# ARTISTIC NORTH STAR
Material, staging, rhythm, camera, references and what each reference is for.

# ANTI-GOALS
Generic AI look, asset dumping, replacement branding, second owners, noisy motion, etc.

# AVAILABLE CAPABILITIES
Current KFB assets, rigs, animation clips, audio, capture, external services.
Never include credentials.

# RESOURCE ENVELOPE
Hard spend / generation / render limits.

# ARCHITECTURE BOUNDARIES
Who owns actor, world, movement, audio, materials, camera, capture.

# INTERNAL WORKFLOW
Recon → input freeze → style bible → storyboard/read timing → implementation →
evidence render → Critic → repair → final capture.

# ANIMATION / CAMERA RULES
Primary read, cause→anticipation→action→impact→follow-through→recovery,
viewer-read timing, keyposes, one purposeful camera action, designed OUT transition.

# QA
Shot sheets, motion strips, transition checks, whole-candidate watch,
runtime errors, independent Critic.

# STOP CONDITIONS
Hard blocker / budget / two failed repair passes.

# RETURN
Exact repo / branch / head / files / tests / evidence / candidate / unresolved / next gate.
```

---

# 10. Immediate relevance to Elisa 18

The case study supports the current Elisa direction and suggests four concrete refinements without reintroducing micro-gates.

## A. Keep the human one-shot / internal multi-pass model

Current Elisa contract is correct:
- G0/internal look/source proof;
- autonomous animatic;
- production;
- independent Critic;
- silent repair;
- final candidate for Georg.

Do not revert to “approve every phase”.

## B. Add explicit viewer reads

For each 55-second shot, specify what must land and how long it gets.

This is likely more useful than adding more visual detail to the prompt.

## C. Add explicit OUT transition to every shot

The existing physical-transformation spine is already strong. Make the exact handoff mechanism part of the shot table.

Examples:
- card folds into map;
- bakery paper bag becomes dungeon parchment;
- blueprint rises into real walls;
- chest glow becomes parking-garage light;
- stunt-jump sky becomes sunset performance world.

## D. QA the whole film, not just components

The final Critic should watch/inspect the complete candidate at least once for:
- pacing;
- repeated camera moves;
- visual arc;
- continuity;
- audio rhythm;
- whether the birthday emotion survives the technical spectacle.

Local source/rig passes cannot prove that.

---

# 11. Relationship to current KFB animation canon

PDoom mostly reinforces existing KFB principles:
- clear staging;
- one primary read;
- anticipation/action/impact/recovery;
- overlap/follow-through;
- meaningful camera;
- controlled VFX hierarchy;
- actual playback evidence.

Useful additions proposed by this case study:
1. **viewer reads as timed storyboard units**;
2. **explicit OUT transition per shot**;
3. **keypose-sheet before interpolation** for cinematic work;
4. **deterministic absolute-time/fixed-step capture thinking**;
5. **contact-sheet / strip / crop / clip QA ladder**;
6. **shared production guide as an agent API**, not only style prose;
7. **human one-shot / internal multi-pass** as a first-class workflow concept.

Not adopted:
- universal 12 Hz contour boil;
- “everything always moves”;
- p5.brush as KFB renderer;
- human review at storyboard stage by default.

---

# 12. Evidence inventory

## PDoom files directly inspected

| Source | Inspected identity | What it supports |
|---|---|---|
| `README.md` | blob `6218e6b7265c54e17a73bd2dee96412e2d422ef3` | provenance, two-generation account, repository structure, render workflow |
| `ANIMATION_GUIDE.md` | blob `c6bbc1232de519bf1f988a45e98848f6b6d080e2` | chapter isolation, deterministic frames, motion/style rules, QA commands |
| `STORYBOARD.md` | blob `2574e1c0108c48cd209ee4aef547f62dbf8081b6` | framing device, shot timing, motivated transitions, palette/scale arc |
| `src/core.js` | blob `613943dbf04747e674599e68650c670639f0a970` | timing helpers, deterministic jitter/seeding, camera, compositor, render-sheet hook |
| `studio.html` | blob `786d057f57b841d5e6dbd8b3faefb44aba54dcc0` | composition canvas, scrubber, shared/chapter loading |
| `render.mjs` | blob `5f8b2f17802a2a0f2996708a2e61e5cc07b81529` | headless renderer, evidence modes, resumable frames, ffmpeg encode |
| `src/ch/*` | nine current chapter modules | parallelizable scene ownership and dense per-chapter choreography |

## Successor directly inspected

`JohnHeibel/ClaudeAnimationBase`:
- README;
- expanded `ANIMATION_GUIDE.md`;
- explicit MIT `LICENSE`;
- generalized render/scene structure.

It is useful evidence that the author extracted a reusable production pattern from the original PDoom experiment.

## Prompt context

Direct X URL supplied by Georg:
https://x.com/donaldjewkes/status/2102801469976248500

Direct X retrieval was unreliable during this review, so public indexed/mirrored text was used only to analyze the prompt/process claims. Those claims remain classified separately from repository-verified facts.

---

# 13. Bottom line

The strongest KFB takeaway is not a visual effect and not a model brand.

It is this production equation:

**taste encoded as a guide**
+ **story encoded as timed reads and transitions**
+ **tools exposed as a small stable API**
+ **shots isolated for parallel work**
+ **render made deterministic and inspectable**
+ **QA made cheap**
+ **agent given permission to iterate internally**
= **a plausible autonomous one-shot production workflow**.

That is the part worth integrating into KFB.
