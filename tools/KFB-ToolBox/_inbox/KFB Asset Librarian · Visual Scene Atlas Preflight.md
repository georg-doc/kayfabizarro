# KFB Asset Librarian · KayKit Visual Scene Atlas Preflight

## Aufgabe

Bereite die vollständige strukturelle Vorarbeit für ein späteres Claude-Design-Projekt vor:

**`KFB Visual Scene Atlas · KayKit Reference Lab`**

Das spätere Design-Projekt soll KayKit-Demos, Pack-Overviews, Setups und Szenen visuell analysieren, ihre Geometrie und Kompositionslogik verstehen, sie mit tatsächlich vorhandenen KFB/KayKit-Assets rekonstruieren und daraus modulare Scene Recipes für:

- KFB World Builder;
- KFB Stage / Scene Designer;
- KFB ToolBox / Resource Picker;
- Actor / Pose / Motion / Prop Contact Workflows

ableiten.

**Dieser Asset-Librarian-Pass soll sämtliche Arbeiten vorziehen, für die kein teures visuelles Claude-Design-Reasoning erforderlich ist.**

Do not perform visual guesswork.

---

# 0 · Owner boundary

The existing Asset Librarian remains:

`READ-ONLY DISCOVERY / PROVENANCE / REFERENCE`

It does NOT become owner of:

- rig compatibility;
- motion compatibility;
- attachment transforms;
- scene-runtime compatibility;
- lighting/runtime implementation;
- World Builder implementation;
- ToolBox implementation.

The future Claude Design project is likewise NOT a new Registry or compatibility owner.

GitHub state overrides chat recollection.

Always distinguish:

`SOURCE FACT`
`OBSERVED DEMO`
`FILENAME / GEORG NOTE`
`INFERENCE`
`PROPOSAL`
`TESTED RESULT`
`UNRESOLVED`

Never turn an inference into an observed demo fact.

---

# 1 · Source corpus

Primary visual-reference corpus:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

Treat this as reference/source material, not Stunt implementation truth.

Current Atlas foundation:

`georg-doc/kayfabizarro/tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

Read and reuse at minimum:

- `KAYKIT_REFERENCE_ATLAS_v1.md`
- `KAYKIT_PACK_COVERAGE_MATRIX.md`
- `KAYKIT_MISSING_PAID_BONUS_GAPS.md`
- `KAYKIT_DEMO_SCENE_LEARNINGS.md`
- `KAYKIT_TOOLBOX_RESOURCE_PICKER_MAPPING.md`
- `BIRTHDAY_STARTER_BUNDLE_REVIEW_2026-09-15.md`

Do not duplicate conclusions already established there.

---

# 2 · Canonical visual-review priority

Preserve the existing Atlas queue:

1. Ultra Turbo Hero Man weapon / grip / pose reference
2. Goth Girl demo/reference
3. Demon Lord demo/reference
4. Orc Brute
5. Lorekeeper
6. remaining Series 6 monthly demos in chronological order

After that:

- Block Bits annotated/sample references;
- Board Game Bits overview;
- Resource Bits overview;
- Holiday overview;
- remaining monthly-character references;
- cryptic host-named images last.

Do not silently reorder this canonical queue.

## Consumer fast lane

Maintain a separate:

`WORLD_NOW_FAST_LANE`

This may temporarily surface references needed by current production without rewriting the canonical Atlas priority.

Current likely candidates:

- Medieval Village + Forest Nature;
- environment/terrain/world pack overviews;
- GothGirl stage/prop combinations;
- Block Bits stage/event composition where useful.

Fast-lane items remain explicitly marked as consumer-driven insertions.

---

# 3 · Exhaustive corpus index

Create:

`REFERENCE_CORPUS_INDEX`

For every relevant reference file record, where recoverable:

- immutable GitHub path;
- blob SHA;
- filename;
- file type;
- likely source page / saved HTML relationship;
- KayKit pack;
- series / month / character where applicable;
- reference type:
  - promo;
  - demo;
  - pack overview;
  - contents sheet;
  - animation reference;
  - scene/set reference;
  - source webpage;
  - unknown;
- current ownership state;
- Registry / source asset relationship;
- Atlas relation(s);
- priority;
- downstream relevance:
  - World;
  - Stage;
  - ToolBox;
  - Actor;
  - Motion;
  - Stunt;
  - Combat;
- current evidence status.

For opaque filenames, inspect recoverable HTML/source relationships, captions, filenames, source folders and neighboring evidence.

Do NOT invent image content when the pixels have not actually been inspected.

---

# 4 · Deduplication / grouping

Group the corpus before Claude Design sees it.

Identify:

- exact duplicates by hash;
- same-source-page media;
- different resolutions/exports of the same identified reference where source evidence proves this;
- image sequences / GIF-related references;
- overview + detail pairs;
- character + same-collection-prop sets.

Do not claim perceptual duplicates solely from similar filenames.

Goal:

Claude Design should receive a **small coherent reference packet**, not twenty copies or an entire source-page dump.

---

# 5 · Source asset mapping

For each priority reference, pre-compute the best available candidate mapping to actual KFB-owned source assets.

Use existing Registry / Atlas / source paths.

Record:

`visible/reference concept → exact candidate source asset(s) → relationship → evidence → confidence`

Relationship vocabulary should reuse:

- `same_collection`
- `official_companion_pack`
- `official_motion_companion`
- `reference_demo`
- `tested_kfb_preview`
- `filename_note`

Add no new relation vocabulary unless genuinely needed.

Important:

`relationship ≠ compatibility`

Keep compatibility owned by the receiving consumer.

---

# 6 · Known-facts packet per visual job

For every priority item create one compact:

`VISUAL_JOB_PACKET`

The packet must contain everything Claude Design can know **before looking at the image**.

Structure:

## Identity

- Job ID
- Priority
- Pack / series / character
- Reference files
- relevant source webpage
- exact asset candidates

## SOURCE FACTS

Only verified facts.

## EXISTING KFB TESTED RESULTS

Only exact applicable test evidence.

## KNOWN RELATIONS

Same collection / companion packs / related motion etc.

## KNOWN LIMITATIONS

Missing dependencies, unverified parity, unresolved source identity etc.

## QUESTIONS FOR VISUAL ANALYSIS

Questions Claude Design must answer from the actual visual reference.

## FORBIDDEN ASSUMPTIONS

Facts Claude Design must not infer merely because they would be convenient.

## DOWNSTREAM CONSUMERS

Which output pieces matter to:

- World Builder
- Stage
- ToolBox
- Actor/Pose
- Stunt
- Combat

---

# 7 · Questions Claude Design should answer

Pre-author a useful question set rather than paying Claude Design to decide what to inspect.

For every scene/set reference ask as applicable:

### Geometry

- What appears to be separate geometry?
- What are the major primitive/form families?
- Which objects appear duplicated or instanced?
- What objects touch, overlap, attach or sit on one another?
- Which elements define the silhouette?
- Which geometry is structural versus dressing?
- What appears deliberately asymmetric?

### Scale

- What are useful relative scale ratios?
- Character-to-prop?
- Building-to-tree?
- Path-to-building?
- Hero-object-to-support-object?

Avoid pretending pixel measurements equal exact world units.

### Composition

- Foreground / midground / background?
- Main visual anchor?
- Supporting clusters?
- Negative space?
- Paths / approach?
- Repetition rhythm?
- Cluster density?
- Camera height and azimuth?
- Perspective versus orthographic-like staging?
- What makes the scene readable at thumbnail scale?

### Materials / light

- Material families?
- Rough versus glossy?
- Emissive elements?
- Dominant key/fill relationship?
- Contact shadow language?
- Atmospheric depth?
- Is colour coming from material, light or both?

### Asset matching

For each visible object:

`CONFIRMED MATCH`
`LIKELY MATCH`
`POSSIBLE MATCH`
`NO MATCH`

Never silently promote `LIKELY` to `CONFIRMED`.

### Design grammar

Most important:

**What reusable rule makes this combination work?**

Examples:

- central anchor + two smaller flanking clusters;
- building edges define path corridor;
- vegetation breaks repeated architecture;
- repeated prop family varies in scale/rotation;
- one emissive landmark terminates view axis.

We want recipes, not screenshots copied slavishly.

---

# 8 · Silent Q&A / critic loop for Claude Design

Prepare this exact internal review sequence for every expensive visual job:

1. **Source Guard**
   - What is actually source-backed?
   - What am I accidentally assuming?

2. **Geometry Analyst**
   - What physical parts / volumes / contacts define the scene?

3. **Composition Analyst**
   - Why does the arrangement read?

4. **Asset Matcher**
   - Which exact owned KFB assets correspond to visible elements?
   - Which matches remain uncertain?

5. **Consumer Critic**
   - What information would World Builder / Stage / ToolBox actually need to reproduce or remix this?

6. **Evidence Auditor**
   - Which statements are OBSERVED?
   - Which are INFERRED?
   - Which have actually been TESTED in KFB?

Then permit one focused repair pass.

Do not run endless self-critique loops.

---

# 9 · Proposed Scene Recipe model

Prepare a lightweight **PROPOSAL**, not yet a canonical schema:

`kfb.scene-recipe.v0`

The first 3–5 Claude Design jobs should prove or modify it before any v1 contract is declared.

Suggested fields:

- recipe id;
- source reference;
- status;
- consumer targets;
- asset refs;
- role per asset:
  - anchor
  - support
  - connector
  - dressing
  - light/emissive
  - interaction candidate
- relative transform / placement;
- relative scale;
- parent/contact relationship;
- grouping / cluster;
- camera;
- environment/light notes;
- composition rules;
- optional variants;
- source relations;
- confidence;
- missing elements;
- placeholders;
- screenshot evidence;
- observed / inferred / tested separation.

Important:

Do not make exact transforms a compatibility claim.

A recipe may preserve useful authored composition before a downstream consumer has validated runtime placement.

---

# 10 · Recipe maturity levels

Use a simple progression:

### L0 · Reference indexed
Source identified; no visual claim.

### L1 · Visual annotation
Actual visual reference inspected and annotated.

### L2 · Asset-matched
Visible elements mapped to concrete source candidates with confidence.

### L3 · Static reconstruction
Actual owned assets assembled into a visually comparable scene and evidenced with screenshots.

### L4 · Reusable scene recipe
Composition represented as reusable data/rules rather than only a screenshot.

### L5 · Consumer-tested
A real downstream World Builder / Stage / ToolBox consumer has loaded or used the recipe successfully.

Only the receiving consumer may promote a recipe to L5.

---

# 11 · Important first-job facts already known

Do not rediscover these expensively.

## Ultra Turbo Hero Man

Known source family:
`Rig_Medium`

Known same-collection props include:
- Blaster
- Sword

The reference filename explicitly flags:
`BLASTER · GRIP · POSE`

Visual job must determine the actual demonstrated grip/pose relationship.

Do not invent a grip transform from the filename.

## Goth Girl

Known exact source family:
`Rig_Medium`

Known same-collection props:
- Microphone
- Mic Stand
- Speaker
- Stool

Existing KFB binding evidence already exists.

Goth Girl is currently the strongest reference-to-tested-KFB bridge.

Do not spend visual-analysis credits re-proving track binding.

Spend them on:
- intended staging;
- prop relationship;
- contact;
- scale;
- pose;
- performance composition.

## Demon Lord

Known source family:
`Rig_Large`

Known sibling props:
- DemonHeart
- SummoningCircle

Visual job should determine how these are actually staged in the reference.

## Forest Nature ↔ Medieval Village

Official source material explicitly demonstrates Forest Nature trees/rocks inside the Village environment direction.

Treat this as:

`official_companion_pack`

This is strong input for modular World Builder combination recipes.

---

# 12 · What the Asset Chat must finish before Claude Design starts

Produce an additive prep package with:

1. `REFERENCE_CORPUS_INDEX`
2. `VISUAL_REVIEW_QUEUE`
3. `WORLD_NOW_FAST_LANE`
4. `VISUAL_JOB_PACKETS/`
5. `SOURCE_ASSET_MATCH_MATRIX`
6. `SCENE_RECIPE_v0_PROPOSAL`
7. `CLAUDE_DESIGN_START_HERE`
8. `RETURN_ASSETCHAT_PREP`

Prefer links/reference identities over copying heavy files.

The Design project should be able to begin Job 01 without performing:

- Registry searches;
- provenance research;
- licence research;
- pack identification;
- source-page archaeology;
- ownership checks;
- known motion-binding research;
- broad candidate discovery.

Those costs belong here.

---

# 13 · Claude Design credit rule

Claude Design time is reserved for:

- actual image/GIF interpretation;
- spatial/geometric reasoning;
- visual asset matching where text evidence cannot decide;
- real scene assembly;
- camera/light/material reconstruction;
- silent visual critics;
- screenshot comparison;
- recipe refinement.

Do not make Claude Design re-index the corpus.

Do not ask it to explore hundreds of references in one session.

Feed jobs in small batches, preferably one reference problem at a time.

---

# 14 · Bigger-picture consumer model

Target pipeline:

`Asset Registry / Librarian`
→ `Visual Job Packet`
→ `Claude Design visual analysis`
→ `Scene Recipe`
→ `World Builder / Stage / ToolBox consumer validation`

The Visual Scene Atlas becomes the shared design-knowledge layer between raw assets and authored worlds.

It must preserve both:

**exact source identity**

and

**the reusable reason why assets work together.**

That second half is the main goal.

---

# Stop condition

Do not start visual reconstruction during this Asset-Librarian pass.

Stop when:

- the corpus is indexed;
- priority jobs are packetized;
- source candidates are pre-mapped;
- visual questions are prepared;
- the first Claude Design batch can begin without further source archaeology.

Return the exact recommended first 3 Claude Design jobs and why they are worth the visual-analysis cost.