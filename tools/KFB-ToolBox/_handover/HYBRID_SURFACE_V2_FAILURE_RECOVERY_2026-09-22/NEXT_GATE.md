# NEXT GATE · Hybrid v2 actor material compile census

This is the **only** next gate from the frozen candidate.

## Goal

Identify the exact five decorated actor material records counted as effectively visible but not observed through `onBeforeCompile`.

## Allowed changes

Diagnostic instrumentation only:
- deterministic row per actor / mesh / material;
- object path and parent visibility chain;
- material UUID/name/type;
- geometry drawRange / groups / vertex count;
- frustum-culling flag;
- effective scene-graph visibility;
- whether the object was actually encountered by a render hook / submitted draw census;
- `onBeforeCompile` observed yes/no;
- source-isolate screenshot for each unresolved record.

## Forbidden in this gate

- no clay/grain tuning;
- no seam tuning;
- no roughness changes;
- no head-scale changes;
- no weakening/removing the compile assertion;
- no OSM/Race/environment integration;
- no public v2 publication.

## PASS

Every one of the five currently unexplained records is named and classified with evidence.

Acceptable classifications include:
- RENDERED_AND_COMPILED after corrected observation;
- INTENTIONALLY_DORMANT_VARIANT;
- NOT_SUBMITTED_BY_RENDERER with concrete reason;
- REAL_SHADER_COMPILE_FAILURE with log/program evidence.

Only after this census PASS may a new slice choose the smallest correct fix.
