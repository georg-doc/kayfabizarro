# KFB Private Source / Public Hub v1 · 2026-09-22

Status: **ARCHITECTURE DECISION BRIEF · NON-DESTRUCTIVE MIGRATION ONLY**

## Goal

Keep active KFB source, experiments and proprietary/large working assets private by default while preserving a public, LLM-readable KFB control surface for:

- current briefings;
- TODOs;
- public contracts/status;
- accepted public previews;
- release/download links;
- selected public PDFs/media.

## Current repository reality

### Public coordination repo

`georg-doc/kayfabizarro`

GitHub-reported repository size at review: approximately **1.86 GB**.

This is now too broad to remain the default home for every source/runtime/asset lane.

### Private Race repo

`georg-doc/KFB-Stunt-Car-Race`

GitHub-reported repository size at review: approximately **881 MB**.

It is already local on Georg's Mac and remains the Race owner.

Do **not** turn it into a universal KFB monorepo merely because it is already cloned.

It may serve as:
- Race source;
- local Race/3D preview host;
- temporary local integration host when explicitly useful.

WorldBuilder/Combat/ToolBox keep their own owners.

## Recommended target architecture

### PRIVATE SOURCE LAYER

Private repositories own active implementation:

- Race → `KFB-Stunt-Car-Race`
- Combat → `KFB-Combat-Arena`
- WorldBuilder / World → dedicated private owner when implementation becomes substantial
- other large/runtime-specific tools → their named private owner

Private source repos may contain:
- active code;
- internal tests;
- editable 3D authoring source;
- proprietary/large assets;
- intermediate exports;
- recovery material not intended for public distribution.

### PUBLIC CONTROL LAYER

A slim public KFB Hub/control repository or the eventually slimmed `kayfabizarro` public surface owns only:

- KFB Hub UI;
- current public briefings;
- TODO/status manifest;
- sanitized owner/contracts;
- public Stage links;
- release/download links;
- accepted public runtime bundles;
- selected public media/PDFs;
- public LLM handoff packets.

The public Hub is a navigator/control surface, not implementation SSOT.

### PUBLIC RUNTIME / DELIVERY LAYER

Cloudflare Pages may expose accepted public previews/releases independently of whether source repos are private.

Public runtime ≠ public source.

Keep only the files required for the published experience.

## External LLM access

Do not assume every external LLM can read private GitHub repositories.

Use two paths:

### Private-capable agent

If the current GitHub/Claude connector has authorized access:
- read the private owner repo directly;
- still obey the public/current Hub routing.

### Public-only agent

Give it a public LLM packet containing:
- current task;
- owner names;
- protected boundaries;
- public schemas/contracts;
- sanitized source pins/versions;
- public screenshots/previews;
- exact expected return format.

Do not expose private source merely to make a public-only LLM convenient.

## Public LLM packet concept

Candidate public files:

`kfb-hub/data/briefings.json`
`kfb-hub/data/todos.json`
`kfb-hub/data/public-owners.json`
`kfb-hub/data/llm-packets/<slice>.md`

The current Hub still embeds much of this data directly in `index.html`; extraction to data files is a later cleanup, not required before WorldBuilder v1.

## Local disk strategy

Because Georg's local disk is constrained:

- keep existing private Race clone;
- do not clone the 1.86 GB public `kayfabizarro` repo just for previews;
- use Portable Preview Packs / GitHub Actions artifacts for most Web/Claude slices;
- delete preview packs after acceptance;
- avoid duplicate 3D asset stores and `node_modules` trees;
- consider sparse checkout only for a repo that genuinely must be local.

Do not reorganize large local directories destructively without a separate inventory/recovery gate.

## Migration strategy

No destructive move now.

### Phase A · new work

From now on:
- prefer private owner repos for new substantial runtime/source work;
- keep public Hub/status/briefing material sanitized;
- publish accepted runtime bundles only.

### Phase B · classify existing public repo

Later create a manifest with:
- PUBLIC_CONTROL
- PUBLIC_RELEASE
- PRIVATE_SOURCE_CANDIDATE
- LARGE_ASSET_CANDIDATE
- ARCHIVE
- KEEP_PUBLIC

No deletion/move during classification.

### Phase C · migrate by owner

Move only after:
- source owner confirmed;
- history/references mapped;
- public links have replacements;
- Cloudflare/public runtime remains intact.

## Stunt-Car-Race decision

Use it locally where it naturally helps Race and 3D preview.

Do not use it as the SSOT for WorldBuilder v1 or Combat simply because it is already cloned.

If a shared private KFB development home becomes desirable, create a **new slim private repo** with an explicit purpose rather than overloading the Race repo.

## One next architecture gate

After WorldBuilder v1 reaches its first meaningful implementation checkpoint, decide whether it has outgrown ToolBox/public coordination and should receive a dedicated private `KFB-WorldBuilder` / `KFB-World` implementation repo.

Until then, keep the migration additive and reversible.
