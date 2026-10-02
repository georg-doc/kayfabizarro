# ENVIRONMENT FAMILY P2 · PROCEDURAL TRANSFER SPEC

Status: **SOURCE-DERIVED · EXACT DONORS PROVEN · READY FOR GEOMETRY-ONLY PROOF**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/wc1-procedural-environment-p2-2026-10-02`
Draft PR: #316

## Basis

This spec is derived only after the exact authored source objects passed isolation.

Evidence:
- run `36960716414`
- job `110693565332`
- artifact `11207717976`
- 13 donor screenshots + `state.json`
- 0 QA problems

Source pin:
`a5fefb273b274e40b3a1e642788c87113fa6ea27`

The screenshots were reviewed as morphology evidence before writing these transfer rules.

The target still inherits the existing KFB/Hivebound constraint:
- smooth stylized 3D;
- soft rounded cushion forms;
- not low-poly as the final generated reading.

Therefore we preserve **source anatomy / proportions / family roles**, but we do not preserve the authored donors' visible faceting merely because the originals are low-poly.

---

# A · LOG TRANSFER

## Source morphology actually observed

### `log`
Observed authored structure:
- long horizontal cut trunk;
- flat cut end;
- roughly polygonal/rounded trunk section;
- slight longitudinal top/bark structure;
- one small side branch nub;
- reads as a **separator**, not a standing object.

Measured envelope:
`0.234 × 0.173 × 0.710`.

### `log_large`
Measured envelope:
`1.000 × 0.417 × 0.549`.

Functional role:
heavier single mass.

### `log_stack`
Observed source composition:
- **three logs**;
- two lower logs;
- one upper log;
- triangular pile;
- visible cut ends create the main readable motif.

Measured envelope:
`0.425 × 0.346 × 0.710`.

## Procedural transfer

Create one soft log primitive, then compose roles.

### Base soft log
Carry:
- elongated cut-cylinder anatomy;
- flat/readable end faces;
- mild taper/unevenness;
- optional side branch nub;
- low horizontal posture.

Soften:
- replace coarse polygon faceting with a smooth rounded section;
- keep cut ends slightly flatter than the side wall;
- allow subtle non-perfect axial bend, but no Cartoon-Verbieger over-bend.

### Roles
- `separator` = source `log` proportions;
- `heavy` = source `log_large` envelope role;
- `stack` = source three-log triangular composition.

Do not invent a fourth log archetype in P2.

---

# B · STUMP TRANSFER

## Source morphology actually observed

### `stump_round`
Observed:
- short cut trunk;
- wide flared root/base skirt;
- hollow/recessed cut top;
- no branch clutter;
- clean radial silhouette.

Envelope:
`0.321 × 0.206 × 0.371`.

### `stump_roundDetailed`
Observed:
- same short/flared body;
- same recessed cut top;
- multiple side branch/root nubs;
- still compact and ground-bound.

Envelope:
`0.357 × 0.206 × 0.371`.

### `stump_old`
Observed:
- stronger broken/irregular upper silhouette;
- side nubs at uneven heights;
- same grounded flared base idea;
- more characterful than the clean round variant.

Envelope:
`0.357 × 0.266 × 0.371`.

### negative control · `stump_oldTall`
Observed:
- same old/broken anatomy stretched into a tall vertical trunk-remnant;
- visually a different role from the short stump family.

Envelope:
`0.357 × 0.666 × 0.371`.

It remains excluded as the default stump baseline.

## Procedural transfer

Reuse the **P0B lathed root-flare technique** as a softening mechanism, because it already produced a human-positive tree trunk.

New stump base:
- short lathed trunk;
- pronounced lower root flare;
- cut/recessed top ring;
- optional side nubs as separate soft cylinders/blobs.

Modes are source-derived:
1. `round` — no side nubs;
2. `round-detailed` — several side nubs;
3. `old` — irregular/broken top + asymmetric nubs.

Explicitly absent:
- `old-tall` normal mode.

If a future world needs a standing dead trunk, that must be a separate role/family, not a stump randomization accident.

---

# C · MUSHROOM TRANSFER

## Source morphology actually observed

### normal single · `mushroom_red`
Observed:
- short tapered stem;
- broad low cap;
- cap is wider than stem;
- source cap resembles a shallow cone/frustum with a small flat crown;
- dark underside separates cap from stem.

Envelope:
`0.174 × 0.203 × 0.201`.

### tall single · `mushroom_redTall`
Envelope:
`0.124 × 0.250 × 0.143`.

Role difference is proportion:
- narrower footprint;
- taller silhouette.

### group · `mushroom_redGroup`
Observed:
- **three mushrooms**;
- three different heights/scales;
- triangular/asymmetric footprint;
- one taller rear leader;
- two shorter foreground companions.

Envelope:
`0.270 × 0.250 × 0.254`.

`mushroom_tanGroup` proves that cap/material/color can vary independently of the same group anatomy.

## Procedural transfer

Build one smooth mushroom anatomy:
- tapered soft stem;
- rounded shallow cap;
- tiny flattened crown;
- optional underside lip.

Roles:
1. `normal`;
2. `tall`;
3. `group3` — one leader + two companions.

The group is not random scatter.
It is an authored-composition precedent:
**three sizes, one center of gravity**.

Material/color is deliberately outside this geometry lane.

---

# D · GRASS TRANSFER

## Exact KayKit donors observed

### `Grass_1_A_Color1`
Observed:
- broad paddle/leaf silhouette;
- thick lower base;
- pointed top;
- comparatively wide body.

Loaded bounds:
approximately `0.339 × 0.559 × 0.152`.

### `Grass_2_A_Color1`
Observed:
- much narrower spear/blade;
- substantially taller/slimmer ratio;
- pointed tip;
- distinct family role from Grass_1.

Loaded bounds:
approximately `0.155 × 0.919 × 0.254`.

## Existing procedural softening donor

P0B source already has a source-proven soft tuft:
- **six** tapered cylindrical blades;
- varying heights;
- varying lean;
- varying radial angle;
- quadratic bend increasing toward tip;
- merged into one family geometry.

Exact P0B blade evidence includes heights roughly:
`.62, .48, .55, .38, .46, .34`
with independent lean/width variation.

## Procedural transfer

Do not invent a new grass system.

Combine:
- KayKit's **two actual blade silhouette roles**;
- P0B's already-proven **soft bent blade construction**;
- Travel Flora's **3–5 blade cluster** rule.

Generated grass therefore has:
- broad blade role;
- narrow spear role;
- 3–5 blades per tuft;
- one dominant blade + smaller companions;
- varied yaw and lean;
- no single giant isolated blade.

This directly preserves the old Travel lesson:
a single large blade is a composition failure even if its geometry is valid.

---

# E · GROUPING RULES

Reuse existing source logic rather than inventing scatter.

## Stump + mushroom
Travel Flora already defines:
- stump = single;
- mushrooms = detail beside stump;
- 1–3 mushrooms as stump detail.

## Mushroom-only patch
Travel Flora:
- group/family size 2–4.

## Grass
Travel Flora:
- cluster 3–5.

## General small-prop composition
Travel v25 precedent:
- one leader;
- smaller companions;
- three sizes / one center of gravity;
- avoid equal-size repeated trios.

Percentages from Travel v25 are evidence, not WC1 defaults.

---

# F · WHAT THE PROCEDURAL PROOF MAY CHANGE

Allowed:
- smooth authored low-poly facets into rounded surfaces;
- add small deterministic axial/bend variation where it preserves source role;
- combine exact source roles into deterministic siblings;
- use the existing P0B soft-form construction methods.

Not allowed:
- invent new anatomy;
- add whimsical fantasy attachments;
- turn all roles into one random slider soup;
- use material/texture to hide weak silhouettes;
- reintroduce `stump_oldTall` as ordinary stump variation;
- replace the P1 tree/rock/bush families.

---

# G · P2 GEOMETRY-ONLY PROOF SET

Next implementation should create exactly:

1. `SOFT_LOG_SEPARATOR`
2. `SOFT_LOG_STACK3`
3. `SOFT_STUMP_ROUND`
4. `SOFT_STUMP_DETAILED`
5. `SOFT_MUSHROOM_NORMAL`
6. `SOFT_MUSHROOM_GROUP3`
7. `SOFT_GRASS_TUFT`

Positive context controls:
- P1/P0B tree may be shown beside them;
- no new material system.

Each generated object must carry source provenance and role.

## Exactly one next gate

**ENVIRONMENT FAMILY P2 · PROCEDURAL SOURCE-DERIVED GEOMETRY PROOF**

Implement the seven objects above in one geometry-only module and one internal source-isolation comparison.

No Stage.
No material choice.
No building implementation.
