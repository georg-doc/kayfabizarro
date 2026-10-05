# KFB World Kernel Lab · START HERE

Status: **RESEARCH POC · SITE-READY SOURCE · NOT A WORLD RUNTIME OWNER**
Date: 2026-10-05
Owner: **KFB ToolBox / World Kernel Lab research lane**
Receiving product owner: **WB2 / World Studio**, only after an explicit later integration gate
Execution mode: **RESEARCH + BOUNDED POC**

## Goal

Test a KFB-owned architecture for very large deterministic worlds without changing the current WB2 four-island product:

`root seed + generator version + hierarchical path → deterministic connective tissue`

with:
- LOD-stable world identity;
- more detail at finer levels without replacing the coarse world;
- browser Worker generation;
- transferable typed-array results;
- coarse result retained while a finer result is generated;
- authored edits stored separately from procedural base state;
- explicit migration warning when generator version and authored edit version differ.

## Protected boundary

This slice MUST NOT:
- modify WB2 PR #348;
- create a second WorldBuilder, terrain, Track, movement, save or Resident owner;
- replace the current four-island topology or seeds;
- import Worldspring code;
- claim Rust/WASM is required;
- publish a new Site from a non-Sites-capable executor;
- add an unverified Site link to ToolBox or Hub.

Current WB2 human gate remains independent: Georg freeplays the existing four-island candidate.

## Current POC

Open source entrypoint after Site publication: `index.html`.

First experiment:
1. keep root seed `23`;
2. move Detail Level from 0 to 5;
3. verify world fingerprint remains stable while fine terrain detail changes;
4. click the field to add authored anchors;
5. change generator version from 1 to 2;
6. verify procedural identity changes and the edit migration warning appears;
7. accept migration only deliberately.

## Source rights firewall

Worldspring is pinned as a **READ-ONLY ARCHITECTURE REFERENCE** at:
`Dun-John/worldspring@55684aa2700b9f4076fddea338d596bfb9bbf14a`.

Its README states © 2026 Dun-John, all rights reserved, with no license to copy, modify or redistribute source. Its workspace package license is `UNLICENSED`.

Therefore:
- READ architecture and behavior;
- RESEARCH cited algorithms and public literature independently;
- REIMPLEMENT KFB-owned mechanisms from first principles;
- DO NOT copy/transplant Worldspring source, constants, file bodies or distinctive implementation code.

See `WORLDSPRING_REFERENCE.md`.

## Done for this first slice when

- source POC exists on one isolated branch;
- 6 deterministic core tests pass;
- JS syntax checks pass;
- source-rights firewall is explicit;
- exact Site publish packet is frozen;
- a Sites-capable publisher can publish the exact source without redesign;
- no WB2 runtime file changes.

## Exactly one next gate

**PUBLISH_ONLY:** publish this exact POC as one private KFB specialist GPT Site, then Georg tests the six-step experiment above.
