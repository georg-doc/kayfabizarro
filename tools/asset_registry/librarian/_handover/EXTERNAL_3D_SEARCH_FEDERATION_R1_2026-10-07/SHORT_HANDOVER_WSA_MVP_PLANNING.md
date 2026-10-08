# SHORT HANDOVER · 3D Asset Search Pool for WSA / MVP Planning

Status: **PLANNING INPUT · CROSS-PROJECT DONOR POOL**  
Date: 2026-10-07  
Primary owner: **KFB Asset Registry / Asset Librarian**  
External donor: `arielshad/3d-asset-server@c5c408d1eb524e3bf878bb63ff47bc928980bf76`

## Use this beyond the Librarian

Treat `3d-asset-server` as a **general agent-ready external donor/search pool** for future:

- KFB One-Shots and MVPs;
- surreal diegetic worldbuilding;
- “KFB world as 3D toy” construction;
- KFB Frankensteining / kitbashing;
- props, vehicles, buildings, environments, textures/materials, HDRIs and occasional rigged/animated donor candidates.

It is **not** a new runtime owner, Registry, art director or mandatory dependency.

## Planning rule

For each One-Shot:

1. reuse proven KFB/KayKit/Kenney/current-owner donors first;
2. when a real visual/semantic gap exists — or the concept explicitly benefits from surreal juxtaposition — query the external pool;
3. shortlist concrete source objects, not generic asset categories;
4. inspect the actual chosen object in isolation before integration;
5. adapt it through the current visual owner and KFB/Claybound compatibility gate;
6. only controlled KFB intake/Registry registration turns it into a normal reusable asset.

A loaded URL, thumbnail or search hit is never proof that the donor design works.

## MVP rule

External search is a **capability multiplier, not an MVP acceptance row by itself**.

Do not add scope just because more assets are available.
Use it to:
- close proven content gaps faster;
- replace weak/generated placeholder geometry with real donor candidates;
- expand visual variety where the product outcome needs it;
- test unexpected combinations cheaply before custom modelling.

For the current Island MVP, it remains optional input behind the Frozen Matrix and existing owners. It must not bypass:
- verified-donor reuse;
- Track/Surface/World ownership;
- Claybound/KFB visual compatibility;
- source isolation;
- performance/collision checks;
- the Georg visual product gate.

## “Surreal KFB 3D toy world” direction

The strongest use is not “more realistic assets”. It is **deliberate diegetic kitbashing**:

- toy-scale everyday objects as architecture or landmarks;
- unexpected vehicles/props recontextualized as world objects;
- miniature/playset logic;
- coherent clay/material adaptation across heterogeneous source geometry;
- absurd combinations that still obey physical contact, scale logic, silhouette and world ownership.

Surrealism comes from **selection + recombination + context**, not from visual inconsistency.

## WSA instruction

When planning a future One-Shot/MVP, include an optional early step:

`DONOR GAP CHECK → INTERNAL KFB SOURCES → EXTERNAL 3D SEARCH POOL → SOURCE ISOLATION → KEEP / ADAPT / REJECT`

Do this before authoring bespoke replacement geometry.

If the external donor is useful, consume the exact asset through the current owner.
If not, reject it and continue; never let one provider or asset become a product blocker.

## Current implementation route

Librarian integration is separately prepared at:

`tools/asset_registry/librarian/_handover/EXTERNAL_3D_SEARCH_FEDERATION_R1_2026-10-07/WORK_WSA_IMPLEMENTATION_BRIEF.md`

That integration is useful but **not required** for agents to use the source pool conceptually in future planning; agents may query the external service directly where their execution environment supports it, while preserving the same source-isolation and owner rules.

## One next gate

**USE_AS_OPTIONAL_CROSS_PROJECT_DONOR_POOL_AND_IMPLEMENT_LIBRARIAN_FEDERATION_WHEN_SCHEDULED**
