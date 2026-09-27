# RETURN · WORLD-ZONE-REVIEW-G3

Date: 2026-09-24  
Status: **PASS · REAL BROWSER LOAD / PLACE / RELOAD PROVEN · NO PUBLICATION**

## Exact state

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/world-zone-review-g3-2026-09-24`

Tested head:
`17433aebd896158621815f1334e3765557c91e07`

Canonical package inherited from G2:
`tools/osm-city-lab/world-zones/cologne-dom-zentrum-v0/2026-09-24.1/`

Review:
`tools/KFB-ToolBox/worldbuilder/world-zone-bake-01/WORLD_ZONE_BAKE_01_REVIEW.html`

## G3 bounded changes

No World Zone compiler/look/deformer/package behavior changed.

Review-only corrections:
1. aligned the existing Review HTML to manifest v1 field names:
   - `reportedNormalizedSha256`
   - `reportedSourceSha256`;
2. added real local-HTTP Chromium proof;
3. fixed one QA-only variable shadowing bug after first browser run.

The review composition/layout was not redesigned.

## Browser evidence

Successful GitHub Actions:
- run: `36029946915`
- job: `107735866809`
- conclusion: **SUCCESS**
- Chromium: **134.0.6998.35**
- checks: **22/22 PASS**
- page/console errors: **0**
- HTTP errors: **0**

Artifact:
- id: `10820974194`
- name: `world-zone-review-g3-browser`
- files: **5** = four screenshots + `report.json`
- compressed size: `1,485,499` bytes
- digest: `sha256:52a97f4629b86ea2a7e18672ad2bb545524814794ccfa69782605126326655b5`
- retention: through 2026-10-08.

Screenshots:
1. `01-source-isolation.png`
2. `02-baked-zone.png`
3. `03-zone-ref-transform.png`
4. `04-reload-pass.png`

## Proven review flow

### 1 · Source isolation

PASS:
- exact normalized semantic source loads before baked integration;
- visible counts: **6,351 buildings / 5,236 roads**;
- metre frame x-east / z-north visible;
- baked step remains locked until source view succeeds.

### 2 · Baked zone

PASS:
- canonical `visual.glb` loads;
- displayed byte size: **11,629,496**;
- WebGL canvas active;
- placement step unlocks.

### 3 · WorldBuilder placement

PASS:
- fixture resolves a `kind: world-zone` manifest reference;
- scene displays the manifest ref;
- transform displays `position [180,0,-120]`;
- status explicitly states **manifest ref + transform only**;
- reload step unlocks.

### 4 · Save / reload baked Zone

PASS:
- scene document saved/reloaded;
- internal status reports source recompute 0 / Overpass 0;
- review counters report manifest 1 / glb 1 and normalized/raw/Overpass 0/0/0;
- actual network capture during reload contains exactly:
  - `.../MANIFEST.json`
  - `.../visual.glb`
- no `normalized.json`;
- no `source.overpass.json`;
- no Overpass API request.

This proves the required reusable-runtime seam rather than only the static JSON contract.

## First G3 run / repair record

Run `36029627188` reached Source, Baked and Placement and produced evidence, then failed in the QA script because local constant `URL` shadowed the JavaScript `URL` constructor while parsing the reload request list.

Repair 1:
`c87cc5662afb5960050b5ffe5a6bb1878ce44b20`

The second run passed. The two-repair stop rule was not reached for G3.

## Publication state

Cloudflare: **not used**.  
Stage: **not published**.  
Live: **not promoted**.  
Human visual acceptance: **not claimed**.

## Exactly one next gate

**WORLD-ZONE-BAKE-01 HANDOFF-CLOSE · metadata + Draft PR only**

No product/runtime changes.

Update the City Lab Return/changelog, central router/changelog and KFB Hub briefing metadata to the proven state, open one Draft PR, and return the exact final head.

After that administrative close, the next product decision belongs to Georg; Barcelona remains the prepared second-city portability proof, not part of this slice.

## Handoff close · 2026-09-27

Status: **CLOSED TO DRAFT PR · TECHNICAL RESULT UNCHANGED**

Draft PR:
`#241 · WORLD-ZONE-BAKE-01 · Cologne baked World Zone · G0→G3 handoff`

PR URL:
`https://github.com/georg-doc/kayfabizarro/pull/241`

The existing G3 owner branch was reused. No second implementation branch, compiler rebuild, package rewrite or runtime owner was introduced.

At PR creation:
- base `main`: `6fb02674ea4344169778c0ae9e76b2543f1d78f9`;
- preserved G3 branch head: `3c6aa96c9c91a5478d95fb840508befbe2b0e5a5`;
- PR state: **Draft / open / not merged**;
- GitHub reports the preserved historical branch as not directly mergeable against the newer `main`.

Do **not** repair that divergence by force-updating the historical evidence branch or overwriting newer router/Hub work. Reconcile deliberately only if promotion is requested.

The earlier metadata close at `3c6aa96c9c91a5478d95fb840508befbe2b0e5a5` already updated:
- City Lab START_HERE + additive changelog;
- central `skills/chat/START_HERE.md` + additive changelog;
- KFB Hub briefing metadata.

No Cloudflare route was created because this technical job is explicitly non-publication and the architecture catalog marks Cloudflare as not required.

## Exactly one next product gate

**WB-ZONE-SEAM-01**

Consume the proven baked Cologne Zone through the current WorldBuilder seam, preserving:
- WorldBuilder as local-world host;
- OSM City Lab as geographic/semantic/bake owner;
- Zone manifest ref + transform persistence;
- separate landmark modules;
- no runtime Overpass;
- no second world/runtime owner.

Barcelona remains the later second-city portability proof, not a prerequisite for this close.
