# RETURN · Tileable Macro Seam Lab

Status: **PUBLIC VERIFIED · 17/17 PUBLIC PASS · HUMAN GATE OPEN**

Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-tileable-macro-seam-2026-09-22`  
Draft PR: **#173**

## Outcome

The visible wall seam had a concrete source cause: the prior RGB brush canvas was non-tileable and was merely repeated with `RepeatWrapping`.

The candidate changes only the macro generator to periodic/toroidal authoring, preserving:
- the frozen Hybrid v2 material donor;
- procedural clay/grain logic;
- original roughness behavior;
- measured head-scale factors;
- exact World Atlas Dungeon, GothGirl and FrizzleBob donors;
- all consumer/runtime owners.

## Tested result

Local browser: **17/17 PASS**.  
Public Cloudflare browser: **17/17 PASS**.  
Public marker: `5a7c57e77c81546e71e6f30404a84f02ddbf7cf5`.  
0 failed public resources; 0 public page/console errors.

Measured edge discontinuity:
- average `14.242 → 1.375`
- X `14.582 → 1.027`
- Y `13.903 → 1.723`

Public evidence:
- run `35677711287`
- job `106588167104`
- artifact `10673323485`
- digest `sha256:862e85d95cc0d3050e22cf856b5ba473b5ed34206b19d4fcb071a8880e6aad71`

Hub link proof:
- run `35678440295`
- KFB Hub PASS
- ToolBox router PASS

## Public Stage

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/tileable-macro-seam-lab/`

## Changed files

- `.github/workflows/toolbox-tileable-macro-seam.yml`
- `.github/workflows/toolbox-tileable-macro-seam-hub-link.yml`
- `kfb-hub/stage/toolbox/tileable-macro-seam-lab/index.html`
- `kfb-hub/stage/toolbox/tileable-macro-seam-lab/tileable-rgb-brush.v1.js`
- `kfb-hub/stage/toolbox/tileable-macro-seam-lab/lab.mjs`
- `kfb-hub/stage/toolbox/tileable-macro-seam-lab/proof.mjs`
- `kfb-hub/stage/toolbox/tileable-macro-seam-lab/SOURCE.json`
- KFB Hub + ToolBox router metadata
- this Recovery / Return and additive routing docs

## Unresolved

Automated continuity is green, but Georg must still judge whether the visible seam is acceptably gone. This does not unfreeze the separate Black Knight compile-census issue and does not authorize OSM/Race integration.

## One next gate

**Human seam review only:** Wall seam close-up → `Old repeat` vs `Tileable macro`.
