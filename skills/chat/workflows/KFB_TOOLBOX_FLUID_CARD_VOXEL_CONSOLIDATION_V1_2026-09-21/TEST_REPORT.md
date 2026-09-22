# TEST REPORT · KFB ToolBox Fluid / Card / Voxel · F1

**Date:** 2026-09-22  
**Branch:** `toolbox/fluid-card-voxel-f1-source-census-2026-09-22`  
**Scope:** source census / duplicate map only

## Result

**66/66 relevant source/owner assertions PASS**

No browser/runtime test was run because F1 changes no runtime or Stage surface.

### Group A · matrix + primary source refs

**19/19 PASS**

- schema and decision count;
- unique IDs and allowed actions;
- no premature PROMOTE;
- exact blobs for current/old Card Zone, fluid-v2, Texture Browser, Voxel S2;
- exact canonical box material and card builder/ink/format blobs.

### Group B · owners + duplicate identity

**14/14 PASS**

- Travel palette owner;
- Storytelling Maps CardRig contract;
- T2 real-card donor seam;
- biome catalogue and KFB Registry;
- three exported `kfb-box-material.js` copies = canonical blob;
- exported card builder/ink/format = canonical blobs;
- world-context copies = one blob;
- packaged `kfb-voxel-world-v1/voxel-terrain.js` = current Card Zone terrain blob.

### Group C · semantic/equivalence checks

**30/30 relevant assertions PASS**

Confirmed:

- 29 named Card Zone methods are byte-identical old → current;
- the only named changed method in the audited set is `buildCard`;
- Fluid, Beam, Card Cube, CardStack/reveal and seed methods are in the identical set;
- three water use cases are explicitly distinct;
- Card Zone uses DudV + map and dead foam;
- Voxel S2 uses map + normal map and active shoreline foam;
- all three Dropbox source sizes match GitHub intake metadata;
- action decisions preserve CardRig, Registry and visual donors.

A separate branch-behind-zero **sentinel intentionally failed** after `main` advanced during the audit. It is not counted as a source assertion.

### Drift follow-up

**3/3 PASS**

Current-main delta was limited to:

- `.github/workflows/ca2-sword01-cloudflare-qa.yml`
- `kfb-hub/stage/combat/ca2-sword-01/SOURCE.json`
- `kfb-hub/stage/combat/ca2-sword-01/failure-recovery/RECOVERY.md`

No F1 source or workflow path was touched.

## Runtime/public evidence

- runtime assertions: **0 by scope**
- WebGL/browser assertions: **0 by scope**
- new Stage publication: **none**
- Dropbox mutation: **none**

F1 is a source-truth gate, not a visual acceptance gate.
