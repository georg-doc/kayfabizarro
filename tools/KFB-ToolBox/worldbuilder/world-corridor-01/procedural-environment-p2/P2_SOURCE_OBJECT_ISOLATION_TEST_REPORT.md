# TEST REPORT · ENVIRONMENT FAMILY P2 · EXACT SOURCE OBJECT ISOLATION

Status: **PASS · 13/13 EXACT AUTHORED DONORS PROVEN IN ISOLATION**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/wc1-procedural-environment-p2-2026-10-02`
Draft PR: #316

## Scope

This gate proves the actual authored donor objects before any procedural replacement is derived.

No:
- KFB deformation;
- KFB material adaptation;
- fallback geometry;
- building work;
- WorldBuilder integration;
- Stage.

## Exact source pin

All donor assets are loaded from:

`georg-doc/kayfabizarro@a5fefb273b274e40b3a1e642788c87113fa6ea27`

The viewer uses pinned jsDelivr paths only as transport to those exact repo objects.

## Tested surface

`tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-environment-p2/source-object-isolation.html`

QA:
`.../qa/source-object-isolation.mjs`

## Result

GitHub Actions:
- run: `36960716414`
- job: `110693565332`
- conclusion: **SUCCESS**
- tested workflow head: `3a6d25bdb53311c77ae1bcfcfa8f2cd0993d8388`

Evidence artifact:
- id: `11207717976`
- files: **14** = 13 isolated donor screenshots + `state.json`
- size: 1,395,274 bytes
- digest: `sha256:9a430ac22b91bdcc66b04b8dcfe10089de66088b617734bb65b457dfa4c8dd17`

QA problems:
**0**

## 13 exact donors

### Logs
1. `log` — long low separator
2. `log_large` — heavy single log
3. `log_stack` — authored grouped logs

### Stumps
4. `stump_old` — forest remnant
5. `stump_round` — rounded baseline
6. `stump_roundDetailed` — rounded detailed baseline
7. `stump_oldTall` — **explicit outlier / negative control**

### Mushrooms
8. `mushroom_red` — normal single
9. `mushroom_redTall` — tall/narrow single
10. `mushroom_redGroup` — precomposed group
11. `mushroom_tanGroup` — second cap/color group

### Grass
12. `Grass_1_A_Color1` — KayKit grass family 1
13. `Grass_2_A_Color1` — KayKit grass family 2

## Verified assertions for every donor

- exact source pin = `a5fefb273b274e40b3a1e642788c87113fa6ea27`;
- source object loaded successfully;
- `fallbackUsed === false`;
- `originalMaterials === true`;
- `deformed === false`;
- `materialAdapted === false`;
- raw loaded bounds are finite and positive;
- where catalog dimensions were supplied, loaded bounds match within the bounded tolerance;
- no page errors;
- no unexpected console errors.

The negative control retained its explicit classification:
`stump_oldTall.family === "stump-negative"`.

## Example measured source parity

`log`:
- catalog: 0.234 × 0.173 × 0.710
- loaded: 0.233961 × 0.173205 × 0.710

`stump_round`:
- catalog: 0.321 × 0.206 × 0.371
- loaded: 0.321295 × 0.206500 × 0.371

`mushroom_redGroup`:
- catalog: 0.270 × 0.250 × 0.254
- loaded: 0.269631 × 0.250488 × 0.254197

The source viewer uses a uniform display-only scale after measuring the raw source bounds. That display scale is not part of donor geometry or production sizing.

## Source-truth corrections retained

From the existing Travel/KFB evidence:
- KayKit Forest FREE does **not** contain stumps, mushrooms or flowers;
- those families come from Kenney Nature Kit through the existing kit-scale bridge;
- `stump_oldTall` is not a normal stump-family baseline;
- small flora belongs to ground detail and grouping logic, not skyline hierarchy.

## Classification

**EXACT_SOURCE_OBJECTS_PASS**

This closes the requirement:
> show the real source object in isolation before adapting it.

No procedural replacement has yet been accepted or implemented from these donors.

## Exactly one next gate

**ENVIRONMENT FAMILY P2 · PROCEDURAL TRANSFER SPEC**

Extract only the minimum reusable form grammar supported by these proven objects:
- log roles: separator / heavy single / stack;
- stump roles: old / rounded / rounded-detailed, with oldTall excluded;
- mushroom roles: normal / tall / grouped;
- grass: KayKit family silhouettes + existing cluster/height-band lessons.

No material decision.
No freehand new family.
No building implementation.
