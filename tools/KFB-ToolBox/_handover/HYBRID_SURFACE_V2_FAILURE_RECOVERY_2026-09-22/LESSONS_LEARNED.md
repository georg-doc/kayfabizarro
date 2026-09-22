# LESSONS LEARNED · Hybrid Surface v2

## 1. Named nodes can own visible geometry without being Mesh objects

**Error:** the first head measurement required `node.isMesh`, so Legacy `character_orcAHead` was missed even though the exact glTF names the head node.  
**Rule:** source identity/proxy measurement follows the named source object and may expand its descendants; it does not assume every semantic part is a Mesh node.  
**Earlier test:** enumerate matched node name + type + descendant mesh count before computing the box.

## 2. Proof telemetry must expose its own source pins

**Error:** the runtime had the RGB donor pin, but the snapshot omitted it.  
**Rule:** every automated provenance assertion must be present in the proof snapshot/marker, not only in module-local constants.  
**Earlier test:** static snapshot-schema check before browser CI.

## 3. Scene-graph visibility is not renderer submission

**Error:** the proof treated effective `visible` as equivalent to “must have compiled a shader program.”  
**Rule:** compile coverage must be measured against an observed render/draw census, or at minimum list each mesh/material record individually.  
**Earlier test:** before asserting 100% compile coverage, output `mesh name → material name/uuid → effective visibility → rendered/compiled marker`.

## 4. Do not solve an unknown census mismatch by weakening the test

**Error avoided:** after Run 4, it would be easy to change the denominator until green.  
**Rule:** when the exact missing records are unknown, identify them first. A green percentage without record identity is not stronger evidence.  
**Earlier test:** deterministic material roster diff.

## 5. Head-size scale is useful measured data, but still needs human visual acceptance

**Finding:** the measured rule yields Legacy 1.685 vs Medium median 2.322 vs Black Knight 3.678 total height while head metrics match.  
**Rule:** retain the measurement as a reproducible scale contract, but Georg still judges whether the cartoon proportion reads correctly.

## 6. Stop means stop

Runs 3 and 4 failed the same compile-census gate after one targeted repair. The candidate is frozen rather than spending a third pass on an uninstrumented assumption.
