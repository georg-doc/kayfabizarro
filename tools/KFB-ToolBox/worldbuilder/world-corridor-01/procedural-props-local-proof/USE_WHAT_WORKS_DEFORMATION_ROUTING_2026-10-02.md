# USE WHAT WORKS · PROCEDURAL ENVIRONMENT DEFORMATION ROUTING · 2026-10-02

Status: **BINDING DESIGN ROUTING · DONOR-FIRST · NO SHRINK-FORM REGRESSION**
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/wc1-procedural-props-local-proof-2026-10-01`
Draft PR: #313

## Why this correction exists

The recent P0B procedural-prop proof intentionally used a reduced soft-form grammar because it was proving asset-light generation under a narrow technical constraint.

That P0B deformation is **not** the authoritative starting point for procedural KFB buildings.

KFB already has stronger proven building/landmark deformation work. The project motto applies:

> **Use what works.**

Do not regress the next procedural environment/building language behind earlier accepted architecture merely because the latest proof was simpler.

## Authoritative deformation lineage

### 1 · Elastic Grotesque Clay V2 · primary building geometry donor

Source:
- `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`
- pinned: `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`

Retain its actual construction logic:
- rounded source footprint;
- vertical segmentation before deformation;
- object-normalized deformation;
- anchored base;
- belly / soft inflation;
- taper;
- twist;
- lean;
- bend;
- block pull / contextual pull;
- height-dependent slope;
- roof generated from the same deformed shell;
- façade details mapped through the same deformation field.

The current source defaults include soft elastic behavior such as belly/taper/twist, but exact numeric settings are donor evidence, not universal final style constants.

### 2 · City Cartoon / Grotesque · primary skewed-cartoon massing donor

Source:
- `tools/osm-city-lab/src/style/cartoon-city.js`
- current blob: `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- `tools/osm-city-lab/styles/kfb-city-v0.json`
- blob: `f129cca3041b55b84de26048dad7aef8fac8b292`

Retain:
- stable identity seed;
- bend + lean + taper + height-dependent twist;
- optional vertical stack offsets;
- deformation normalized to object height;
- base anchored;
- presentation geometry separate from undeformed collision/export truth.

The current historical `grotesque` preset is evidence:
- verticalSteps 8
- bend 0.105
- lean 0.09
- taper 0.22
- twistDeg 11
- stackSteps 7
- stackShift 0.065

These values are **not** promoted as universal building defaults. They define the proven deformation family and useful envelope.

### 3 · Skewed cartoon perspective is geometry + lens, not geometry alone

The earlier City Grotesque read did not come only from bent meshes.

The proven review grammar also used a skewed/wide camera amplifier:
- wide 76° FOV;
- filmOffset 10.5;
- mildly tilted up-vector;
- low oblique staging.

Therefore future building design must evaluate two independent layers:
1. deformation field;
2. skewed-perspective presentation/camera.

Do not bake camera-specific distortion into geometry merely to recreate the look.

### 4 · LandmarkElastic · proven stronger hero deformation

Recovered Cologne World Shell:
- `wd1-landmark.js`
- landmarks deliberately reuse the **same city deformation language** so landmark and neighbours speak one visual grammar.

Proven principles:
- towers use `cartoon-city.js deformPoint` at stronger Grotesque magnitude;
- bodies use `deformElasticXZ/deformElasticY`, the same formulas as the city;
- geometry is tessellated in Y before elastic deformation when needed;
- source identity stays recognizable;
- no generic replacement landmark;
- no fake base plates.

The Cologne Cathedral proof used stronger tower splay/bend/torsion while keeping the nave/body treatment more restrained. This role separation is reusable.

### 5 · LOOK-TORSION · architecture pass that must survive

Current shared router classifies LOOK-TORSION as **ARCHITECTURE PASS ONLY**.

Retain:
- cumulative height-dependent torsion;
- anchored base;
- one shared final deformation field for roof and body;
- role/height-dependent magnitude family.

Do not retain:
- one universal torsion angle;
- isolated proxy materials/light/shadow as style truth;
- a second independent deformer.

### 6 · FACADE_RULE v1 · already-proven anti-generic façade grammar

Normal OSM buildings already have a deterministic semantic façade rule.

Current historical parameters include:
- floor rhythm;
- edge eligibility;
- spacing ranges;
- skip probability;
- row shift;
- horizontal/vertical jitter;
- road-facing context.

Binding principles:
- party walls remain blank;
- windows/doors follow the deformed shell;
- semantic street-facing logic beats decorative random stamping;
- roof/body/windows/doors/support move coherently;
- source-native kit details remain protected.

This is the correct base for irregular cartoon façade rhythm. Do not invent a second freehand façade system.

## Current new donors and their role

### P0B procedural trees / props

Human result 2026-10-02:
- **PROCEED**;
- trees specifically positive;
- geometry/form language worth pursuing.

Role:
- donor for scalable procedural environmental family generation;
- proof that soft rounded generated geometry can read well.

Not its role:
- authoritative building deformation grammar.

The P0B forms are a recent reduced proof, not a replacement for Elastic Grotesque / LandmarkElastic.

### Hivebound / Reddit formulation

Preserve the donor wording as a constraint:

> cozy, cute, relaxing  
> smooth stylized 3D  
> soft rounded “cushion” forms  
> pastel palette  
> warm light  
> not low-poly and not pixel art

Use this to **soften and round the already-proven KFB cartoon deformation lineage**.

Do not use it to erase KFB/KayKit/K-Kid identity or create generic cozy-game architecture.

### KayKit / K-Kid identity

Use existing K-Kid/KayKit cartoon assets as source-identity and proportion donors.

Goal:
- preserve recognisable cartoon construction logic;
- amplify with KFB elastic/grotesque deformation;
- do not replace them with unrelated generic procedural boxes.

## Design source priority for future procedural buildings

When a future Claude/design slice creates building families, resolve in this order:

1. **actual deformed Golden Samples / accepted WorldBuilder & OSM examples**;
2. **Elastic Grotesque Clay V2**;
3. **City Grotesque / Cartoon-Verbieger**;
4. **LandmarkElastic / accepted landmark examples**;
5. **LOOK-TORSION architecture semantics**;
6. **FACADE_RULE v1**;
7. **KayKit/K-Kid source identity**;
8. **approved P0B trees/props** for soft procedural family-generation method;
9. **Hivebound cozy/soft-rounded wording** as an amplifier/constraint;
10. only then optional external cartoon references, decomposed into specific traits.

A later Nickelodeon / Rocko reference may be used only after exact source traits are named. It is never sufficient as a freehand prompt.

## Golden-sample rule

Before Claude gets a building-generation brief:
- show the actual strongest deformed samples;
- identify which deformation components are present;
- identify the exact source object / family;
- record what Georg accepted or rejected;
- use those samples as the visual grading line.

Do not ask Claude to invent a “KFB procedural city style” from prose alone.

## Next work split

### Current thread
- recover and rank proven shape/deformation donors;
- expand environment prop families;
- derive building grammar from the Golden deformation lineage;
- prepare source-grounded Claude Design brief only after donor extraction.

### Parallel Clay thread
- Clay002 / Derek / surface material comparison;
- texture repetition/mapping;
- final surface treatment.

Do not merge these gates prematurely.

## Exactly one next gate

**GOLDEN DEFORMATION DONOR EXTRACTION**

Build one compact donor sheet from real existing sources:
- one normal Elastic Grotesque OSM building;
- one strong City Grotesque building;
- one accepted LandmarkElastic / Cologne landmark sample;
- LOOK-TORSION architecture semantics;
- current approved P0B tree family.

For each donor record:
- source pin/path;
- silhouette behavior;
- deformation components;
- amount/range only where actually proven;
- what survives into procedural props/buildings;
- what is explicitly excluded.

Only after this donor sheet is complete should a Claude procedural-building brief be written.
