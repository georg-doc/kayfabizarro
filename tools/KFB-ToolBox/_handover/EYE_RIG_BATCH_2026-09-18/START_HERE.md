# KFB ToolBox · Batch EyeRig Atlas · Fresh Chat Brief

**Date:** 2026-09-18  
**Status:** CURRENT PREPARATION / IMPLEMENTATION BRIEF · RUNTIME NOT YET BUILT  
**Owner:** ToolBox / Rigging  
**Proposed source path:** `tools/KFB-ToolBox/eye-rig-batch/`  
**Proposed public candidate:** `https://kayfabizarro.pages.dev/tools/KFB-ToolBox/eye-rig-batch/`

> **CURRENT IMPLEMENTATION RETURN · 2026-09-19**  
> PR **#104** remains Draft/Open/Unmerged. Current Return/source head: `5e203568884b3f0d564a3d6fbc09be1122303ac3`; source-identity checkpoint: `949ff8037df2da88eb91ef825984ef57870b8238`; corrected Stage publication: `c6489fce74f98b2124feb184becd27d2cbe4a922`.  
> Direct analysis of the pinned current GothGirl GLB resolves **components 2 + 3 as the eyes**; 6/7/8 are lateral accessories. The historical 6+7 measured preview is diagnostic history only. Corrected static/contract evidence is **28/28 PASS**.  
> Current human gate: open `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`, use the source-measured baseline generated from 2+3, compare Source/Cleaned/EyeRig in Front/3/4/Side and motion, then approve or reject. Corrected public browser verification is still open; do not expand Medium, start Large/Legacy, merge or promote Live before that gate.

> **Additive cross-render note:** read [`2D_ALIGNMENT_ADDENDUM.md`](2D_ALIGNMENT_ADDENDUM.md) for the 2D Animation Studio bridge. It does not replace or delay the Medium-first Batch plan.

## 0 · Product goal

Build a standalone Atlas-style batch-rigging workbench that can mount and calibrate the existing KFB cartoon EyeRig on many KayKit/KFB characters quickly and reproducibly.

Priority order:

1. Rig_Medium;
2. Rig_Large;
3. Legacy characters;
4. later non-character hosts such as Living Plants.

The tool is a **ToolBox-owned authoring surface**, not a new Resident/Animation/Travel/Combat owner.

The main workflow:

```text
Registry / exact GitHub actor source
→ automatic measured FaceHost candidate
→ EyeRig v6 mount
→ standardized front / 3/4 / side evidence
→ human approve or correct
→ export/import eye-profile patch
→ batch-approved profile manifest
→ later named consumer test
```

Do not permanently modify source GLB/GLTF files.

## 1 · Read first

### Current shared EyeRig source

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Current blob at brief preparation:

`853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`

### Existing arbitrary-biped FaceHost

`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js`

Current blob:

`38ec7770f5fccf3aca93ee234f94b801d527d415`

This module already measures an arbitrary **skinned** biped in bind pose:

- finds Head/Skull bone;
- collects vertices whose strongest skin weight belongs to that head bone;
- measures the head-only bounds;
- derives facing from actual anatomy where possible;
- creates the invisible `body` FaceHost that EyeRig expects.

**Use this before inventing a new eye-centre detector.**

### Existing embed / lifecycle truth

`tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md`

### Existing batch/manual patch pattern

`tools/resident_atlas_s6/lib/studio.js`

The Resident Atlas Studio already:
- collects manual corrections;
- keeps them separate from canonical recipe data;
- exports `<resident>.studio-patch.json`.

It currently has no general patch-import path. The Batch EyeRig tool should implement explicit eye-profile import/export instead of assuming this missing feature exists.

### Existing rig/feature history

Read targeted sections of:

- `tools/KFB-ToolBox/KFB ToolBox (studio v17 - rigging v1 - animation v2)/WSA_2026-09-13/LIVING_RIGGING.md`
- `tools/KFB-ToolBox/KFB ToolBox (studio v17 - rigging v1 - animation v2)/WSA_2026-09-13/LIVING_frizzlegraft.md`
- `tools/resident_atlas_s6/docs/FEATURE_PARITY.md`
- `tools/resident_atlas_s6/CHANGELOG.md`

Do not rebuild the whole FrankenStein Studio.

## 2 · Verified EyeRig-v6 capabilities to preserve

EyeRig v6 already owns:

- eyeball geometry;
- pupil geometry / style;
- pupil size / gloss;
- eye spacing/placement through anchor;
- inset;
- lid fit;
- splay;
- upper/lower eyelids;
- blink timing + manual blink;
- pupil/gaze follow;
- explicit normalized point target;
- neutral/fixed gaze;
- asymmetric upper/lower lid values;
- lid slant;
- wide-pupil state;
- kinetic input `setKinetics({a,c,j})`;
- idle life / wander / tremor;
- public `eyeFrame()` for future brows/nose modules;
- optional lashes.

Public runtime controls include:

```text
setAnchor()
setEye()
setPupilStyle()
setBlink()
setGazeFollow()
pointTo()
applyEmote()
blinkNow()
setKinetics()
setLife()
eyeFrame()
update(dt)
```

Do not fork this API unless a measured blocker proves a shared-core change is necessary.

## 3 · v0 scope · eyes + eyelids, not the whole face

For the first batch tool:

### INCLUDE

- EyeRig v6 eyeballs;
- pupils;
- tracking/gaze;
- blink;
- upper/lower lids;
- lid slant;
- existing six eye-expression presets;
- life/wander/tremor;
- optional kinetic preview;
- splay;
- manual geometry/placement controls.

### EXCLUDE initially

- eyelashes;
- brows;
- nose;
- moustache;
- mouth;
- full Face/Puppet/Talk system.

Explicit default:

`lashes = OFF / length 0`

The public `eyeFrame()` anchor is preserved so brows/nose can be mounted later without changing the approved eye profiles.

## 4 · Stable expression vocabulary

Do not invent another expression vocabulary.

Load the existing expression source from the current KFB face contract:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`

Use the existing IDs:

```text
neutral
happy
angry
sad
surprised
thinking
```

These already map to EyeRig lidUpper / lidLower / slant / pupil / gaze values.

Store the exact contract source revision in every generated eye-profile package.

The batch tool may show these values, but should not silently fork them per actor.

Actor-specific corrections should focus first on **geometry/placement**, not redefining what “happy” means.

## 5 · Critical lifecycle bug to guard against

Existing Rigging documentation records a paid failure mode:

> EyeRig builds the geometry, but without `update(dt)` in the render loop the lids do not settle/open correctly.

Therefore “mounted successfully” is not enough.

The new adapter must guarantee:

```text
build
→ apply neutral expression
→ apply life/default gaze policy
→ update on every rendered frame
→ only then visible-ready
```

Acceptance test:

- immediately after normal application boot, eyes are visibly open in neutral;
- no user click is required to “unstick” lids;
- blink then occurs normally;
- after actor switch/reload neutral returns open.

Do not solve this by permanently disabling lids.

## 6 · New local candidate adapter

Create the adapter initially **inside this candidate tool**, not directly inside `kfb-rigs-embed-v3`.

Proposed module:

`tools/KFB-ToolBox/eye-rig-batch/lib/kaykit-eye-adapter.v1.js`

Candidate API:

```js
const eyes = await mountKayKitEyes({
  THREE,
  figure,
  sourceRef,
  profile,
  expressionContract,
  camera
});

eyes.update(dt, camera);
eyes.applyExpression('happy');
eyes.setPointer(nx, ny);
eyes.report();
eyes.dispose();
```

Internally for Rig_Medium / Rig_Large:

```text
figure
→ existing buildFaceHost()
→ existing EyeRig v6
→ profile overrides
```

Do not mount FrizzleBob’s head. This task is **our eyes on the original KayKit head**.

Only after the candidate adapter works across the required matrix should promotion into the shared `kfb-rigs-embed-v3` bundle be considered.

## 7 · Measurement model

### Primary truth

The actual GLTF/GLB geometry, skeleton and bind pose.

For every candidate record:

- repo / exact path / revision;
- actor/model id;
- source pack;
- rig class;
- bone count/signature;
- head bone name;
- head-weighted vertex count;
- measured head bounds;
- measured facing source;
- generated FaceHost size;
- resulting eye-frame coordinates;
- actor total height;
- camera evidence settings.

### Secondary visual truth

Standardized generated renders:

- FRONT;
- THREE_QUARTER_LEFT;
- THREE_QUARTER_RIGHT;
- SIDE_LEFT;
- SIDE_RIGHT;
- optional TOP close-up.

Each render can show toggles:

- source only;
- EyeRig candidate;
- head bounds;
- face host;
- eye centre;
- eye-frame line;
- head bone.

### Historical screenshot archive

The Stunt Race inbox currently contains approximately:

- 515 image files;
- 375.4 MiB total;
- two duplicate `KayKit_PACKS_References_Scenes_Demos` trees of ~118.2 MiB each.

These are useful **secondary reference / pack-art crosschecks**.

Do not copy this archive into the Batch EyeRig tool and do not use promo-camera pixels as primary geometry measurements.

If a clean mapping from actor source → promo/reference image can be established, expose that image as an optional reference panel.

## 8 · Rig_Medium batch strategy

Do not review every model from zero.

### Step M0 · inventory

Use Registry/Rigfacts and exact sources to enumerate actual Rig_Medium candidate actors.

Skeleton-signature equality is structural evidence only; still record exact source model.

### Step M1 · calibration sample

Choose a deliberately varied sample, e.g. 5–8 Medium actors with:

- normal human-like head;
- hat/headgear;
- unusual face proportions;
- beard/mask/accessory where present;
- one known Resident Atlas actor.

Run automatic `buildFaceHost()` + EyeRig v6.

### Step M2 · class seed

After Georg approves enough sample profiles, derive a **median normalized Medium eye seed** from approved geometry fields.

This is a candidate accelerator, not truth.

Apply the seed to remaining Medium actors and mark them:

`AUTO_CANDIDATE`

not approved.

### Step M3 · batch visual approval

Human reviews cards/contact sheet:

`APPROVE | ADJUST | REJECT | UNSUPPORTED`

One-click next-unreviewed.

Manual adjustment opens only the necessary eye controls.

## 9 · Rig_Large

Repeat Medium procedure separately.

Do not assume Medium numeric eye anchor simply scales to Large.

Known project evidence says Rig_Medium and Rig_Large share a modern 23-bone class structure, but visual proportions and head geometry still require measurement.

Status remains independent:

`MEDIUM_APPROVED` does not imply `LARGE_APPROVED`.

## 10 · Legacy

Legacy is a separate architecture.

Current Resident Atlas evidence:

- legacy animation donor has 6 bones;
- many legacy character source models themselves have 0 bones / 0 skins;
- character parts are assembled onto a donor rig.

Therefore the normal skinned `buildFaceHost()` may legitimately return UNSUPPORTED.

Do not call that a bug.

For Legacy:

1. use the existing Resident Atlas `legacyAssemble` / proven assembly path;
2. identify the Head part and Head bone;
3. build a **LegacyFaceHost candidate** from the assembled Head-part measured bounds;
4. mount the same EyeRig v6;
5. store Legacy-specific measurement evidence.

No guessed Medium fallback.

## 11 · Batch Eye Profile candidate schema

Use a local candidate schema, not a new global contract:

```json
{
  "schema": "kfb.eye-profile/0.1-candidate",
  "actorId": "…",
  "source": {
    "repo": "georg-doc/kayfabizarro",
    "path": "…",
    "revision": "…"
  },
  "rigClass": "Rig_Medium",
  "faceHost": {
    "status": "OK",
    "headBone": "Head",
    "headSize": [0,0,0],
    "facingSource": "…"
  },
  "eyeRigSource": {
    "path": "tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js",
    "revision": "…"
  },
  "expressionSource": {
    "path": "tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json",
    "revision": "…"
  },
  "eye": {
    "anchor": {},
    "pupilStyle": "matte-cute",
    "pupilSize": 0.5,
    "inset": 0,
    "lidFit": 0.9,
    "converge": 0,
    "splay": 0,
    "track": 0.1
  },
  "blink": {},
  "life": {},
  "status": "AUTO_CANDIDATE",
  "evidence": {}
}
```

Do not store eyelashes/brows/nose in v0 profiles.

## 12 · Workbench UI

Atlas-like, stage first.

### Left / roster

Filters:

- Rig Medium
- Rig Large
- Legacy
- pack
- approved / candidate / rejected / unsupported
- resident/not-yet-resident

Thumbnail grid/contact sheet.

### Centre stage

- selected actor;
- free orbit;
- standard camera presets;
- source-only / EyeRig compare;
- optional head/host/eye debug overlays;
- Idle + simple locomotion clip test.

### Right review panel

Compact groups:

#### Placement
- horizontal spacing / dx;
- vertical / dy;
- ring/size;
- inset;
- splay;
- lidFit.

#### Pupil / gaze
- pupil size/style;
- tracking amount;
- Follow pointer;
- front/down/away;
- explicit pointTo test.

#### Lids / expression
Buttons:
- neutral
- happy
- angry
- sad
- surprised
- thinking
- Blink now.

#### Life / Kinetics
- life on/off;
- wander;
- tremor;
- test acceleration/curve/drop values.

### Review actions

- APPROVE
- ADJUSTED + APPROVE
- REJECT
- UNSUPPORTED
- RESET TO CLASS SEED
- COPY PROFILE
- NEXT UNREVIEWED

## 13 · Motion regression

An eye profile is not approved from T-pose/front screenshot only.

For Medium/Large test at least:

- bind/T pose;
- Idle;
- Walking;
- Running;
- Jump / airborne / landing where available;
- one head-turning or expressive clip if available.

Check:

- eyes remain attached to head;
- no lag one frame behind;
- no clipping deeply into face;
- no detached float during animation;
- eyelids still work;
- gaze still works;
- actor mixer remains the only skeleton-animation owner.

For Legacy use the real supported legacy motion source.

## 14 · Patch workflow

Unlike Resident Atlas’s export-only correction path, Batch EyeRig v0 must have:

- export single profile;
- import single profile;
- export all reviewed profiles;
- import reviewed batch;
- explicit schema/version validation;
- non-destructive preview before Accept;
- Revert to last approved profile;
- localStorage namespace only for candidate review state.

Suggested key:

`kfb.toolbox.eye-rig-batch.v0`

Never call `localStorage.clear()`.

Approved profile files remain review artifacts until a named consumer uses them.

## 15 · Resident / consumer handoff

Approval in this tool means:

`EYE_PROFILE_VISUALLY_APPROVED`

not “Resident integrated”.

Next consumer proof should use:

- one Medium resident;
- one Large resident;
- one Legacy resident.

Resident Atlas may reference the approved EyeProfile by id/source.

Do not silently rewrite its 21 cast recipes.

After consumer proof, the same adapter/profile system can serve:

- Platformer actors;
- Travel residents;
- Town;
- Combat;
- later Living Plants.

## 16 · Plant extension

Plants are explicitly **later**.

The Plant Prop Lab may provide a measured `FaceHost/EyeAnchor`.

The same EyeRig v6 and profile ideas can then be reused.

Do not let plant support delay Medium/Large/Legacy v0.

## 17 · Public / tool integration

First implementation is standalone ToolBox-owned:

`tools/KFB-ToolBox/eye-rig-batch/`

Required entry:

`index.html`

Target public candidate after tests:

`https://kayfabizarro.pages.dev/tools/KFB-ToolBox/eye-rig-batch/`

Optional later:
- stable alias;
- link from ToolBox;
- link from Resident Atlas;
- link from KFB Hub.

Do not redesign the whole Stage-First ToolBox to ship this slice.

## 18 · GitHub workflow / connector reliability

Georg should not be asked to use terminal/git.

The fresh chat should use GitHub directly.

### Branch first

Create dedicated branch:

`toolbox/eye-rig-batch-2026-09-18`

Do not develop directly on `main`.

### Small checkpoints

Push at least these checkpoints:

1. docs / source audit;
2. Medium atlas/probe;
3. Medium review UI;
4. Large;
5. Legacy;
6. browser/public evidence.

### Connector failure rule

If a GitHub connector call errors or times out:

1. **do not assume the write failed**;
2. re-fetch branch HEAD / target file;
3. detect whether the commit/file already exists;
4. only then retry;
5. if high-level create/update repeatedly fails, use Git blob/tree/commit/ref operations;
6. never force-push;
7. never ask Georg to resolve it in terminal;
8. record the exact blocker in `RETURN.md`.

Before every merge:
- re-fetch `main`;
- compare branch diff;
- preserve concurrent unrelated work;
- run relevant browser/static checks;
- PR;
- merge only after green evidence.

## 19 · Tests

### Source / measurement

- exact source resolution;
- rig class reported;
- faceHost report deterministic;
- generated views deterministic.

### Eye lifecycle

- neutral visible/open after normal boot;
- blink;
- gaze follow;
- pointTo;
- all six expressions;
- life on/off;
- kinetics preview;
- actor switch/dispose.

### Batch

- filters;
- next unreviewed;
- approve/reject;
- export/import single;
- export/import batch;
- reload preservation;
- no profile silently applied to wrong actor/revision.

### Motion

- Medium sample on locomotion;
- Large sample on locomotion;
- Legacy real supported motion;
- eye/head attachment preserved.

### Browser

- desktop;
- ~832 px;
- narrow/mobile review mode if practical;
- no duplicate RAF/mixer;
- no uncaught errors.

Not run = NOT_TESTED.

## 20 · Exit gate

The first useful slice is complete when:

- Rig_Medium atlas exists;
- automatic measured EyeRig candidates exist;
- Georg can rapidly approve/adjust them in one browser tool;
- approved profiles export/import cleanly;
- at least one Medium profile is motion-tested;
- EyeRig boots visibly open and controllable;
- exact GitHub sources/revisions are recorded.

Then continue Rig_Large.

Do not wait for every Legacy actor before proving Medium.

---

## Fresh-chat start prompt

> @GitHub
>
> Du bist der Produktionschat für:
>
> # KFB ToolBox · Batch EyeRig Atlas
>
> Arbeite direkt aus GitHub. Kein Terminalauftrag an Georg.
>
> Lies zuerst vollständig:
>
> `https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`
>
> Danach die dort benannten EyeRig-/FaceHost-/Embed-/Resident-Atlas-Quellen.
>
> **Ziel:** das bestehende KFB EyeRig v6 schnell und reproduzierbar auf Rig_Medium, danach Rig_Large, danach Legacy-Character-Quellen setzen und in einem Atlas-artigen Browserwerkzeug visuell freigeben.
>
> Wichtiger Befund: `facehost.v1.js` misst bereits beliebige skinned KayKit-Zweibeiner in Bindepose und erzeugt den EyeRig-kompatiblen `body`-Host. Nicht neu erfinden.
>
> v0 umfasst Augen + Pupillen + Tracking + Blink + obere/untere Lider + Splay + die bestehenden sechs Eye-Expressions + Life/Kinetics. **Lashes, Brows, Nose, Mouth zunächst aus.**
>
> Kritische Lifecycle-Regel: EyeRig braucht `update(dt)`; ein reines `build()` kann als scheinbar geschlossene Augen erscheinen. Der neue Adapter muss neutral/open ready booten und im normalen Renderloop updaten.
>
> Baue zuerst Medium:
>
> `Inventory → measured FaceHost → auto candidate → standardized screenshots → human Approve/Adjust/Reject → eye-profile export/import → locomotion regression`.
>
> Screenshots aus dem großen Stunt-Race-KayKit-Referenzarchiv sind sekundärer visueller Crosscheck; primäre Wahrheit sind aktuelle GitHub-Modelle und standardisierte Renderings.
>
> Source path:
>
> `tools/KFB-ToolBox/eye-rig-batch/`
>
> Branch:
>
> `toolbox/eye-rig-batch-2026-09-18`
>
> Committe früh und additiv. Bei Connector-Fehlern zuerst HEAD/File neu lesen; nicht blind doppelt schreiben und Georg nicht zu git/bash schicken. Bei Bedarf Blob/Tree/Commit/Ref-Fallback nutzen.
>
> Kein Umbau der gesamten ToolBox. Keine zweite EyeRig-Implementierung. Keine stillen Änderungen am Resident Atlas. Keine globalen Contracts ohne Consumer-Beweis.
>
> Return immer:
>
> `SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN | ARCHIVED HISTORY`.


---

## 21 · Source-face cleanup · remove original KayKit eyes non-destructively

**Added:** 2026-09-18 · user requirement.

Before overlaying KFB EyeRig, detect whether the source character already contains visible eye geometry.

Preferred order:

```text
1. explicit named eye mesh/node
2. measured symmetric connected components in the head mesh
3. verified material group / draw group
4. texture cleanup / mask only when geometry separation is impossible
5. no removal if confidence is insufficient
```

### Why mesh/component removal is preferred

Do not merely recolor original black “button eyes” to skin color if they can be cleanly hidden as geometry. Recoloring can leave silhouette, shading and female eyelash-spike geometry visible.

Use non-destructive runtime visibility/index/group filtering or a derived render adapter. Canonical GLTF/GLB remains untouched.

### Existing exact precedent · GothGirl

Current project evidence in:

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json`

records:

- Rig_Medium, 23 bones;
- one head mesh with **12 connected islands**;
- **eyes = islands 6 + 7 removed from the rendered head index**;
- mouth handled separately via `texclean`;
- original brows = islands 4 + 5;
- original nose = island 3;
- ears / earrings preserved.

This is a proven source-specific pattern, not permission to assume the same island indices for other KayKit models.

### Batch detector candidate

For each actor, produce a `sourceFaceReport`:

```json
{
  "headMesh": "…",
  "connectedComponents": 0,
  "eyeCandidates": [],
  "pairConfidence": 0,
  "femaleOuterLashCandidate": null,
  "removalMode": "mesh-components | node | material-group | texture-clean | none",
  "status": "AUTO_CANDIDATE | HUMAN_REQUIRED | UNSUPPORTED"
}
```

Candidate eye-pair scoring may use:

- symmetry around measured face center;
- position in upper/front head region;
- small size relative to head;
- dark/black material or sampled source appearance only as supporting evidence;
- similar dimensions;
- frontal depth;
- reference screenshot crosscheck.

Do **not** use black color alone; hair, nostrils, accessories and masks can also be dark.

Female outer eyelash spikes must be explicitly classified:
- same connected component as eye;
- separate component;
- texture-only;
- or not present.

When source eye removal is approved, store the exact component/node/group ids in the EyeProfile so the same character reconstructs deterministically.

## 22 · Selected-character face grafts · later layer

EyeRig v0 remains eyes/lids only.

After approved eye profiles, selected characters may receive additional source-specific face cleanup/grafts.

### Mouth

GothGirl is the concrete precedent:
- original mouth appearance was handled with measured `texclean`;
- KFB mouth overlay can then own the visible mouth.

Do not globally erase mouths on the whole batch.

Candidate later status:

`MOUTH_GRAFT_CANDIDATE`

requires:
- source mouth classification;
- reversible cleanup;
- measured mouth anchor;
- selected KFB mouth source;
- visual approval.

### Nose

FrizzleBob Driver/Graft line already contains measured nose modules/graft logic anchored from `eyeFrame()`.

Do not apply a FrizzleBob nose to all KayKit residents.

Candidate later status:

`NOSE_GRAFT_CANDIDATE`

is per selected character only.

### Brows / lashes

Remain later overlays.

The important architecture is:

```text
source-face cleanup
→ approved EyeRig profile
→ public eyeFrame()
→ optional selected Brow / Nose / Mouth grafts
```

so later face work does not invalidate eye calibration.

## 23 · Vehicle EyeRig · front-light / front-face anchors

**Important future extension, separate from Rig_Medium/Large v0.**

Goal:

Mount the same KFB EyeRig-v6 expression/gaze system onto vehicles so front lights / front-face points become expressive cartoon eyes.

Potential consumers:
- BOX1 vehicle pool;
- Free Roam;
- Stunt Race;
- Game Dev Studio vehicle packages.

### Do not assume every vehicle has named headlight nodes

Current Pilot-01 Sedan evidence proves:
- source forward = +Z;
- up = +Y;
- left = +X;
- four named wheel nodes and measured dimensions.

It does **not** currently document verified headlight nodes.

Therefore anchor priority is:

```text
1. explicit source headlight/light nodes, if verified
2. explicit emissive/light meshes or symmetric front components, if verified
3. measured symmetric manual front anchors
4. unsupported
```

Never fabricate `headlight_left/right` source nodes.

### Candidate VehicleFaceProfile

```json
{
  "schema": "kfb.vehicle-eye-profile/0.1-candidate",
  "vehicleId": "car-sedan",
  "sourceRef": "…",
  "axes": {"forward":"+Z","up":"+Y","left":"+X"},
  "anchors": {
    "left": [0,0,0],
    "right": [0,0,0],
    "source": "named-node | measured-component | manual-approved"
  },
  "host": {
    "mode": "two-anchor-front-face",
    "radius": 0,
    "normal": [0,0,1]
  },
  "sourceLightPolicy": "preserve | hide-under-eyes | dim | unsupported",
  "eyeProfileRef": "…",
  "status": "AUTO_CANDIDATE"
}
```

### Vehicle FaceHost adapter

Do not use the biped Head-bone detector.

Proposed later local adapter:

`vehicle-eye-adapter.v1.js`

It creates an EyeRig-compatible front FaceHost from:
- left/right front anchors;
- vehicle forward/up axes;
- measured front-face depth/normal.

The same EyeRig v6 remains the eye implementation.

### Kinetics are especially reusable on vehicles

Vehicle runtime may feed normalized telemetry into existing:

`setKinetics({a,c,j})`

where:
- `a` = acceleration/braking;
- `c` = steering/curve/drift direction;
- `j` = hop/drop/landing vertical event.

This should remain **presentation driven by vehicle telemetry**. EyeRig never writes vehicle physics.

Potential expressive examples:
- braking → concerned lids;
- drift → outside glance / asymmetric lid;
- jump/drop → wide surprised eyes;
- idle → wander/blink;
- pointer/player interaction → gaze follow.

### Source headlight handling

Prefer preserving original lighting semantics.

If EyeRig visually replaces the front lamps:
- hide/dim only the verified source lamp geometry/material;
- keep light-emission functionality separately if the consumer needs headlights at night;
- do not remove headlight functionality merely because the mesh is hidden.

The visual eye and gameplay illumination are separate responsibilities.

## 24 · Revised expansion order

Keep implementation order:

```text
V0  Rig_Medium EyeRig + source-eye cleanup
V1  Rig_Large EyeRig + source-eye cleanup
V2  Legacy EyeRig + source-eye cleanup
V3  selected Mouth/Nose/Brow grafts
V4  Vehicle EyeRig at verified front anchors
V5  Living Plants / other Frankensteining hosts
```

This order prevents the high-value Medium batch from being blocked by vehicle or full-face complexity.
