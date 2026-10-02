# ENVIRONMENT FAMILY P2 · EXISTING PROP VOCABULARY EXTRACTION

Status: **SOURCE-BACKED EXTRACTION · NO NEW PROP STYLE INVENTED**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Purpose

Recover the next small environment-prop vocabulary from already measured KFB/KayKit/Kenney sources.

This lane remains:
- form / silhouette / scale / grouping only;
- separate from the Clay/material thread;
- additive to the P1 tree / rocks / bushes geometry family.

No generic procedural stump, mushroom, log or grass shape is invented here.

## Primary sources

### Travel Flora v11

- `travel/wip/travel_globe_wsa/globe-v13/flora.js`
- blob `9942577c79e65f92fba8314e0cc701c73b26ad55`

Important measured finding:
the KayKit Forest FREE pack has **no stumps, mushrooms or flowers**.

Measured pack inventory in this source:
- Tree 17;
- Bush 22;
- Grass 20;
- Rock 46.

Therefore Travel deliberately sourced:
- stumps;
- mushrooms;
- flowers

from **Kenney Nature Kit**, scaled through the existing kit-scale bridge instead of pretending they came from KayKit.

### Travel Flora selection

- `travel/wip/travel_globe_wsa/globe-v13/flora-auswahl.json`
- blob `671d56784f97fb2c740759a5a26eb281f6ac21c8`

This file contains measured dimensions, triangle counts, family roles, composition rules and explicit rejects.

### Travel Combat v25 scatter

- `travel/KFB Travel Combat v25/terrain-v25/prop-scatter.js`
- source on current KFB history.

Useful later-world lessons:
- one lying log was promoted because it **divides a clearing instead of merely occupying it**;
- small props are treated as ground detail, not skyline;
- cluster logic uses one leader plus smaller companions;
- height bands correct footprint-only scaling mistakes.

### Asset catalog

- `media/3D_Assets/CATALOG/INDEX.md`
- blob `cef148bc76007950a53d8d58407c8462ea190b68`

Provides measured raw dimensions for Kenney Nature Kit families.

---

# P2 family A · LOGS

## Existing source vocabulary

Measured Kenney Nature Kit assets:

| Asset | Raw dimensions X × Y × Z |
|---|---|
| `log` | 0.234 × 0.173 × 0.710 |
| `log_large` | 1.000 × 0.417 × 0.549 |
| `log_stack` | 0.425 × 0.346 × 0.710 |
| `log_stackLarge` | 0.634 × 0.346 × 0.710 |

## Proven world role

Travel v25 explicitly promoted `log` as a **flat** prop because it is the only shape in that set which:

> divides a clearing instead of occupying it.

That is the design value to preserve.

## P2 interpretation

Do not generate a “cartoon log” from prose yet.

First isolate:
1. `log` · long low separator;
2. `log_large` · heavier single mass;
3. `log_stack` · grouped authored composition.

The future procedural family, if useful, should be judged against these three functional roles.

---

# P2 family B · STUMPS

## Existing selected family

Travel Flora v11 selected:

| Asset | Raw dimensions | Tris |
|---|---:|---:|
| `stump_old` | 0.357 × 0.266 × 0.371 | 120 |
| `stump_round` | 0.321 × 0.206 × 0.371 | 56 |
| `stump_roundDetailed` | 0.357 × 0.206 × 0.371 | 96 |
| `stump_square` | 0.360 × 0.300 × 0.300 | 44 |
| `stump_squareDetailed` | 0.440 × 0.200 × 0.440 | 84 |
| `stump_squareDetailedWide` | 0.640 × 0.200 × 0.640 | 84 |

Family role:
**forest remnant · single object · mushrooms as nearby detail**.

## Explicit reject

`stump_oldTall` is **not** a normal family member.

Measured:
- raw height about 0.666–0.67;
- against the 0.2–0.3 m family it is an outlier;
- Travel's family-floor experiment made it absurdly tall relative to the tree scale.

It is explicitly listed in `abgelehnt`.

Therefore:
**do not use stump_oldTall as the P2 form baseline**, even though later Travel Combat reused it as a biome prop.

## Style relevance

For the current KFB soft/rounded direction, the strongest source objects to inspect first are:
- `stump_round`;
- `stump_roundDetailed`;
- `stump_old`.

The square family remains source evidence, but not the preferred first transfer donor.

That preference is grounded in the current approved rounded P0B tree language, not an invented new stump shape.

---

# P2 family C · MUSHROOMS

## Existing selected family

Travel Flora v11 uses the Kenney family as **detail near trees/stumps**, arranged in groups of **2–4**.

Measured assets:

| Asset | Raw dimensions | Tris |
|---|---:|---:|
| `mushroom_red` | 0.174 × 0.203 × 0.201 | 48 |
| `mushroom_redGroup` | 0.270 × 0.250 × 0.254 | 144 |
| `mushroom_redTall` | 0.124 × 0.250 × 0.143 | 48 |
| `mushroom_tan` | 0.191 × 0.154 × 0.221 | 48 |
| `mushroom_tanGroup` | 0.270 × 0.250 × 0.254 | 144 |
| `mushroom_tanTall` | 0.124 × 0.250 × 0.143 | 48 |

## Source-backed family logic

The vocabulary already contains:
- normal single;
- tall/narrow single;
- precomposed group;
- two cap/color families.

This is already enough silhouette variation for a P2 source test.

Do not add fantasy mushroom anatomy before these real donor roles are inspected.

---

# P2 family D · GRASS / SMALL GROUND PLANTS

## KayKit Forest source

Travel Flora v11 already uses KayKit Forest grass as:
**ground detail · flat · clusters of 3–5**.

Example measured source:
- `Grass_1_A_Color1` = 0.339 × 0.559 × 0.152 · 44 tris;
- `Grass_1_B_Color1` = 0.505 × 0.537 × 0.556 · 132 tris.

KayKit Forest remains the primary authored grass family because it already shares the cartoon kit language used elsewhere.

## Important Travel v25 correction

The Kenney `grass_leafsLarge` source exposed a useful failure:

A single large blade:
- was mis-scaled by footprint-only fitting;
- looked like a foreign object when placed alone.

The correction was **composition + height band**, not a new mesh:
- add smaller siblings;
- use leader + companions;
- three sizes / one center of gravity.

Existing companion set:
- `grass_leafsLarge`;
- `grass_leafs`;
- `plant_flatTall`;
- `plant_bushSmall`.

This is a composition donor, not a mandate to replace KayKit grass.

---

# P2 family E · FLOWERS · OPTIONAL SMALL DETAIL

Travel Flora v11 already measured a Kenney flower family and places flowers in clusters of **3–6**.

Examples:
- `flower_purpleA/B/C`;
- `flower_redA/B/C`;
- `flower_yellowA/B/C`.

Role:
**color detail · meadow · ground scale**.

P2 does not need to proceduralize flowers yet.
They are retained as a proven authored-detail vocabulary and scale reference.

---

# Existing composition / scale rules worth preserving

## 1 · Small props do not own the skyline

Travel v25 height bands:
- `flat`: 0.5–1.8 world units;
- `bush`: 0.7–2.6;
- `small`: 0.28–0.95.

These are Travel-world scale evidence, **not WC1 universal constants**.

The reusable principle:
- logs/stumps divide or populate the ground plane;
- mushrooms/grass/flowers remain ground detail;
- tree/large-rock families own silhouette hierarchy.

## 2 · One leader + smaller companions

Travel v25 cluster grammar:
- 56% single;
- 30% leader + 1 companion;
- 14% leader + 2 companions;
- companion scale factors 0.62 and 0.44.

Again, percentages are source evidence, not new WC1 defaults.

The reusable principle:
**three sizes, one center of gravity — not three equal objects.**

## 3 · Family ratios matter

Travel Flora v11 found that applying an individual visibility floor destroyed authored size ladders.

Corrected behavior:
- scale a family coherently;
- preserve ratios;
- cap small-family height so a stump cannot become taller than a tree.

This is directly relevant to future procedural sibling generation.

## 4 · Explicit rejects are part of the donor truth

Do not silently reintroduce:
- `stump_oldTall` as normal stump baseline;
- KayKit `Bush_2_A/B/C_Color1` in the older Flora v11 rounded-bush selection, where they were rejected for a cube-like shape mismatch.

---

# P2 source-isolation set

Before any procedural version is built, isolate the real authored donors:

### Logs
- `log`;
- `log_large`;
- `log_stack`.

### Stumps
- `stump_old`;
- `stump_round`;
- `stump_roundDetailed`;
- explicit negative/outlier: `stump_oldTall`.

### Mushrooms
- `mushroom_red`;
- `mushroom_redTall`;
- `mushroom_redGroup`;
- `mushroom_tanGroup`.

### Grass
- one representative KayKit Grass_1 family;
- one KayKit Grass_2 family;
- Kenney `grass_leafsLarge` + smaller siblings only as the known composition lesson.

No material adaptation in source isolation.
Show actual donor geometry first.

---

# Relation to KFB style axis

## Rocko
Primary P2 axis:
ordinary forest leftovers and ground clutter need cartoon personality without becoming noise.

## Polly
Secondary:
composition may use designed grouping/asymmetry, but P2 small props do not need perspective deformation.

## Metropolis
Not a small-prop form driver.
Only relevant later at environment/city hierarchy scale.

---

# Result

P2 does **not** need a new invented vocabulary.

Existing KFB world history already provides:
- authored source objects;
- measured dimensions;
- source family membership;
- explicit rejects;
- scale failure lessons;
- cluster/grouping logic;
- a KayKit/Kenney compatibility bridge.

## Exactly one next gate

**ENVIRONMENT FAMILY P2 · SOURCE OBJECT ISOLATION**

Show the exact authored log/stump/mushroom/grass donors in one internal comparison surface before deriving any procedural replacements.

No material decision.
No building implementation.
No Stage.
