# SP13KTRA · clean-room observation note

**Date:** 2026-09-17  
**Status:** OBSERVATION-ONLY DONOR · no source reuse  
**Upstream:** `https://github.com/KilledByAPixel/SP13KTRA`

## Copyright boundary

The upstream repository states **All rights reserved** and says no rights are granted to use, copy, modify, merge, publish, distribute, sublicense, sell or create derivative works from the software, including game code, engine code and assets, without prior written permission.

Therefore KFB treats SP13KTRA only as an example that can be studied at the level of **general design and production principles**.

Do not copy or port:

- source code;
- constants/tuning values;
- circuit/corner data;
- music seeds or parameter tables;
- procedural shape implementations;
- asset geometry or art.

Any KFB implementation must be independently written from KFB requirements, existing KFB contracts and permissibly reusable KFB/third-party donors.

## What is useful to learn

### 1 · Route grammar

A compact authored route skeleton can drive many downstream products: road geometry, height/banking, navigation reference, racing line, warnings, pads and scenery placement.

**KFB application:** spline authoring should persist a small route description. A KFB route compiler can independently derive road mesh, terrain conformance, banking, AI/navigation reference and trackside hooks.

### 2 · Route is metadata, not a cage

Movement can remain genuine world-space simulation while route distance/lateral offset is derived for navigation, progress and contextual rules.

**KFB application:** cars may leave the road for stunts/grass/shortcuts and later project back to the route; the spline remains a reference rather than hard constraint.

### 3 · Correlated variation

Neighbouring structures become more coherent when size/density is driven by a slow spatial field instead of independent random draws.

**KFB application:** Farm, Forest, City, Graveyard or Area 51 can each use their own low-frequency field for density, height, vegetation and colour bias so areas read as grown districts rather than asset soup.

### 4 · Shape language per zone

A zone can have one dominant visual grammar and palette with a limited secondary grammar.

**KFB application:** use Asset-Librarian/Resident-Atlas recipes as authored shape languages: primary asset family + secondary accent family + landmark + scatter vocabulary.

### 5 · Procedural audio as glue

Small synthesized/parametric effects can keep engines, hums, impacts, UI/diegetic bleeps and ambience internally coherent without requiring a separate audio file for every event.

**KFB application:** keep hero music/Suno/signature tracks authored; add an independent KFB procedural-audio layer for glue such as wind, engine/hover hum, bumper spring, portal shimmer, machinery and alien fields.

### 6 · Seed lab + human curation

A deterministic generator becomes much more useful when it can show/listen to several candidates and let the author pin a seed.

**KFB application:** future God Mode can offer `Generate 6 variants` for vegetation/scatter/ambient seeds without changing authored roads, residents or memory state.

### 7 · Compile stable world state

A small recipe can be expanded into a heavier world once, then reused until authored inputs change.

**KFB application:** `World Recipe → compiler/bake → PLAY`; BUILD changes only affected authored state rather than asking an AI to regenerate the whole scene.

### 8 · Identity vs connective tissue

Procedural geometry is most valuable where unique authored assets are unnecessary.

**KFB application:** canonical KayKit/Kenney/Quaternius/KFB assets carry identity; independent procedural KFB systems may create supports, barriers, shoulders, bridges, simple distant architecture, paths and other connective tissue.

## Explicit non-conclusion

SP13KTRA's 13 kB constraints are not KFB requirements. KFB should not imitate size-golf architecture, global-state compression or assetlessness. The lesson is **clarity of generative rules**, not minimal byte count.
