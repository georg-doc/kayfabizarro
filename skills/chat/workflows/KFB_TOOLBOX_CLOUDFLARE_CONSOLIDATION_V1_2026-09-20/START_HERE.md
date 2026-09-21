# KFB ToolBox · Cloudflare consolidation briefing

Status: READY FOR INVENTORY + ROUTER SLICE
Date: 2026-09-20
Owner: ToolBox / Hub integration
Public candidate root: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

## Problem

Useful authoring tools currently exist across Claude Design WIP folders, source folders and several Stage routes. That is fine for exploration but not for reliable reuse. The goal is one compact ToolBox home under KFB Cloudflare that routes to the existing tools; it does not rebuild them or turn the Hub into a giant dashboard.

## Sources to respect

- `tools/KFB-ToolBox/START_HERE.md`
- `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json`
- `tools/KFB-ToolBox/eye-rig-batch/`
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/`
- current Motion Lab Stage
- Asset Librarian: https://kayfabizarro.pages.dev/tools/asset_registry/librarian/
- Resident Atlas, Environment Atlas, Dungeon and Babel/Platformer handoffs.

## Target

A lightweight ToolBox landing page with no explanatory hero wall. Each card has:
- name and one-sentence purpose;
- exact state: ready / review / WIP / blocked / archive;
- direct Cloudflare URL when it exists;
- owner and source/return link;
- the one next human action.

First cards:
1. EyeRig Batch Atlas;
2. KayKit Motion Lab;
3. Asset Librarian;
4. Resident Atlas;
5. Environment Atlas;
6. Dungeon Generator;
7. Babel / Hex Platformer;
8. 3D in-scene editor (when its adapter gate exists).

Claude Design WIPs are listed as **design inputs**, never as the operational tool URL. GitHub source is SSOT; Cloudflare Stage is the test surface.

## Work plan

1. Read the manifest and make a current inventory: source, owner, stage route, state, last proof, missing condition.
2. Repair only routing/metadata first. Never copy a tool to make it “look central”.
3. Give every tool one direct route under `/kfb-hub/stage/toolbox/` or an explicit external direct route. A missing route is marked blocked, not linked to a githack/local file.
4. Add a small status manifest that the KFB Hub reads. Invalid data must fail visibly with a “direct ways” fallback, never a blank Hub.
5. Establish a promotion rule: Stage proof → Georg review → return/changelog → deliberately listed as Live.
6. Keep asset browsing as a consuming tool; Asset Librarian remains the library owner.

## Never-empty contract

The Hub and ToolBox router must:
- render a static direct-route fallback before dynamic cards run;
- show a visible error/state when metadata fails;
- test the page script before publication;
- verify the exact public Cloudflare revision after deploy;
- keep the old working public deployment until the new one is publicly verified.

## Acceptance

A mobile user can open the ToolBox, reach each available tool in one tap, understand whether it is safe to use, and return to the Hub. No local file, GitHub raw URL or Claude WIP page is required for a normal tool run.
