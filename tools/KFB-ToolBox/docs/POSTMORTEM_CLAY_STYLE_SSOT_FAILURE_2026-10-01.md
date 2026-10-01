# Postmortem · The clay style existed, but production could not find or apply it

Date: 2026-10-01  
Classification: **LEAD / ROUTING / BRIEFING FAILURE**  
Impact: repeated design regressions, repeated user re-briefing, wasted premium-model and Claude Design budget, inconsistent buildings/terrain/props/characters

## Executive finding

Georg repeatedly asked for one Claymation SSOT and Golden Samples that every chat could use. The production system did not provide that artifact.

Instead, the truth was split across:

- K1/H0 visual Golden files in an inbox export;
- K2/v10 technical material guidance;
- an S5 building contract on a non-main branch;
- a main-branch façade router;
- a Joyride defect note containing the exact FACADE-A/B-01 camera and values;
- separate shadow/contact lessons;
- current character, vehicle and VFX consumers in later session cuts;
- Hub briefs that referred to “Claymation look” or “Golden Samples” without linking one complete read-first contract.

The result was predictable: each new chat could truthfully say that it could not find the Golden Samples, choose a different source/version and rebuild an approximation.

## What failed

### 1 · A router was mistaken for an SSOT

`CLAY_BUILDING_FACADE_ROUTER.md` correctly described source precedence, but it was a building router, not a full style contract. It did not provide one cross-family matrix for terrain, props, characters, vehicles and VFX.

### 2 · Visual truth and technical baseline were not separated clearly enough in briefs

K1/H0 v8 defined the accepted pixels. K2/v10 was the newer implementation baseline for new stages. Briefings often named only K2 or merely “the clay look”, so agents treated “newer module” as “accepted appearance”. That produced correct code against the wrong visual target.

### 3 · The exact Golden gate was buried in a defect file

The strongest reproducibility contract — `building_A`, 6 m, 30 degrees, K1 light, `maxEdge 0.18`, 3 stages, 90000 triangles, v8 house profile, Hand 0.5 / tile 1.6 / print 4.5 — lived in `FIXES_OFFEN.md`. It was not the first path in Hex/World/Resident/ToolBox briefs.

### 4 · A key ownership document lived only on a side branch

The prepared S5 building/façade adapter was pinned to `georg-doc-patch-2@3232a107...`, not main. A main-only search therefore missed the intended OSM/KayKit/Kenney ownership and deformation architecture.

### 5 · “Golden Samples” was used as an undefined phrase

Briefs told agents to use Golden Samples without giving an exact public path, source object, camera, light and pass/fail layout. That delegated discovery back to Georg and guaranteed another clarification loop.

### 6 · The style was not expanded across asset families

Buildings had the most evidence, but there was no single table distinguishing:

- accepted building and terrain Goldens;
- nature/prop support samples;
- character-safe material references;
- vehicle surface versus gameplay owners;
- candidate VFX.

Without that distinction, building deformation leaked conceptually into characters, material changes risked vehicle contracts and each consumer invented its own interpretation.

### 7 · Hub briefs did not fail closed

When an external chat could not resolve the style sources, it asked Georg what the Golden Samples were or continued with a local approximation. The correct response should have been `SOURCE_REQUIRED` with one canonical URL.

## Why this was a lead failure

The source material was already present. The user had identified the regression repeatedly. The lead responsibility was to consolidate, version and route it once. Repeatedly answering with another partial briefing, another hidden path or another chat-specific correction did not solve the production problem.

This was not caused by Claude Design “forgetting”. It was caused by giving Claude Design incomplete retrieval instructions and no single authority it could read.

## Consequences observed

- façades lost the characteristic K1/H0 deformation;
- agents implemented generic “visible deformation” instead of the accepted form language;
- H0, K2 and S5 were treated as competing choices rather than layered sources;
- terrain/island chats paused to ask for Golden files;
- premium integration runs began without an agreed visual contract;
- Georg had to reconstruct the same source chain repeatedly;
- large session exports moved around because source references were not sufficient.

## Corrective actions implemented

1. Added `KFB_CLAYMATION_STYLE_SSOT.md` as the single read-first style and precedence contract.
2. Added `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` with explicit family, source, state and gate.
3. Added `KFB_CLAY_GOLDEN_CATALOG_V2_BRIEF.md` to expand buildings, terrain, nature, props, characters, vehicles and VFX in one controlled catalogue.
4. Updated the façade router to point to the SSOT before any source resolution.
5. Added the SSOT to the central Chat Production Router.
6. Required every relevant consumer brief to include the same exact SSOT line.
7. Made missing SSOT access a `SOURCE_REQUIRED` stop instead of permission to improvise.
8. Added a small-handoff rule: canonical assets stay pinned at source; session exports target under 10 MB.

## Prevention gates

### P1 · One URL, not a scavenger hunt

Every clay-related brief links the same main-branch SSOT and matrix. Supplemental sources follow from there.

### P2 · Golden lock before implementation

No “polish”, deformation tune, material migration or world integration begins until the exact source object and fixed A/B view are named.

### P3 · Visual and technical status remain separate

`GOLDEN`, `CURRENT IMPLEMENTATION BASELINE`, `DONOR`, `CANDIDATE`, `TUNE` and `FAIL` are never collapsed into “current”.

### P4 · Cross-family expansion is centralized

New approved examples are added to the matrix, not only to a consumer Return. A consumer may propose a Golden; it cannot silently create one.

### P5 · No large duplicate packages

External tools load pinned canonical assets. Handoffs contain code, recipes, manifests and compact evidence, not another copy of every GLB/texture/video.

### P6 · Hub and repository change together

Any SSOT update also updates the Hub clay-style card and active consumer briefs in the same handoff.

## Verification

This corrective action is complete only when:

- the three new documents are reachable on GitHub main or an explicitly attached PR;
- Hex/Island, G0/Joyride, Resident, ToolBox, Combat and Billboard Hub briefs link the same SSOT;
- a fresh external chat can answer “what is the clay Golden for building_A?” without Georg providing another file;
- the next visual implementation returns the required unchanged-source/Golden/candidate sheet.

Until then the status is `CORRECTIVE ACTION IN PROGRESS`, not resolved.
