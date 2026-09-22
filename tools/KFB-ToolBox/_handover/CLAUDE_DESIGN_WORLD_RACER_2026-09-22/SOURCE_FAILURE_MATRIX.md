# Source + Failure Matrix · Claude World/Racer · 2026-09-22

Status: **CURRENT HANDOFF SUPPORT DOC**

This document classifies the current inputs. It prevents an inbox export, failed study or visual reference from silently becoming implementation truth.

## 1 · Cologne Race Option C-2

Path:

`tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/`

Central repo intake commit:

`930c97ca50434d579764e2219739b908816cd21a`

Race-repo mirror:

`georg-doc/KFB-Stunt-Car-Race@cc62767161d9e1b7e0c98d924b1ad72b335e0b30`

Core files were checked blob-identical between the central repo and Race mirror, including the Design Component, START_HIER, Return/Postmortem and the play/stage/track/world/landmark modules.

Classification:

**CURRENT CLAUDE RACER AUTHORING INTAKE · NOT THE OLDER PUBLIC STAGE · NOT LIVE**

Protected current facts:

- one Race movement owner;
- S / ArrowDown brakes and then reverses;
- `reverseAccel: 10.5`;
- `maxReverse: 9`;
- current chase camera uses route-based `railClamp()`;
- old camera-through-buildings repair must not be replaced by the rejected obstacle-ray approach;
- the previously reported brown/tunnel object was diagnosed as a sightline issue rather than road collision;
- visible structural curves use continuous curve geometry rather than wedge chains;
- current export reports zero route intrusions after its audit.

## 2 · KFB Style References

Path:

`tools/KFB-ToolBox/_inbox/KFB Style References/`

Classification:

**REFERENCE_ONLY · NON_CANON**

The folder mixes current KFB outputs, Georg-authored visual exploration and external visual reference.

Use it to compare shape language, materiality, grain, colour rhythm and exaggeration.

Do not copy a single reference literally and do not declare it KFB canon.

## 3 · Hex Worldbuilder corpus

Path:

`tools/KFB-ToolBox/_inbox/KFB Hex Assets Worldbuilding (WIP Exporte WS1)/kfb-hex-worldbuilder-corpus_2026-09-22/`

Classification:

**WIP DONOR CORPUS · NOT WORLD OWNER · NOT PROMOTED**

Useful current content includes:

- 32 indexed code files;
- 11,487 lines;
- 389 indexed methods;
- 19 evidence images;
- KayKit Hex Baukasten S0;
- Hex Edge Atlas S1;
- Babel Hex Generator v1;
- `hexrealm` shared history/library;
- two main KayKit packs with 447 indexed parts.

Babel already contains:

- seeded generation;
- Editor / Chill & Fun / Play;
- calculated jump reach;
- double jump;
- rescue;
- JSON recipe export.

Current Babel climb is a linear chain. Branching, endless ascent and moon/sky targets are future gameplay, not current implementation truth.

Important structural directions already present in the corpus:

- baked tile profiles;
- explicit symmetry/rotation metadata;
- one placement solver;
- persisted `kfb.hex-world/1`;
- undo/redo and deterministic roundtrip;
- explicit missing-part handling.

## 4 · WhackMan Session Cut

Path:

`tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/`

Classification:

**WIP SESSION CUT · WORLD-BUILDING DONOR EVIDENCE · NOT WORLD OWNER**

Useful pattern:

`recipe → Dungeon model → existing Dungeon layout() → scene`

WhackMan deliberately does not recalculate final Dungeon placement in `wm-recipe.js`.

Useful architectural lessons:

- MazeGraph keeps logical walkability/topology separate from rendered meshes.
- `wm-collide.js` keeps canonical movement state separate from additive cartoon bounce offsets.
- presentation offsets must not overwrite saved canonical world positions.
- static current maze != future endless procedural room system.

Known warning:

Gate B adds a separate generated garden/decor placement layer. Its own session backlog reports unreliable grounding for some decoration. This supports moving authored props to the shared in-scene editor rather than adding more coordinate heuristics.

Status caveat:

`WHACKMAN_BACKLOG_2026-09-22.md` is partly older than the final Session Cut. Prefer:

- `SESSION_CUT_2026-09-22.md`
- `POSTMORTEM_CHANGELOG.md`

for later status.

## 5 · S22 Room Study failure/recovery

Path:

`tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/`

Classification:

**FAILURE-RECOVERY / AUTHORING DONOR EVIDENCE · NOT DUNGEON CANON**

End-of-session status:

- R02 accepted;
- R07 accepted;
- R09 accepted;
- R08 aborted;
- R03 not accepted; its two-level mechanism survives, its railing/stair composition does not.

Root failure pattern across four failures:

**new 3D parts were positioned/rotated from names, docs or screenshot composition before the actual source object was shown in isolation.**

Hard rule derived from this:

**R4 — no new part enters a recipe/world before the actual source object has been viewed in isolation.**

This is stronger than rotation or grounding heuristics. A wrong object cannot be fixed by finding a better rotation.

### S21/S22 inline editor donor

The Room Study already contains working authoring interactions:

- TransformControls;
- click selection;
- move / rotate;
- individual vs semantic group;
- position snap around 0.1;
- rotation snap around 15°;
- drop-to-ground;
- collision-free adjustment;
- per-room patch storage;
- raw JSON patch export/import;
- recipe-code export / `Patch kopieren`.

This is a real donor for World Authoring.

Do not copy it page-by-page. Extract/reuse the interaction model through the shared authoring seam.

### Fixed vs movable

R03 proved that structural architecture and movable props cannot share the same relaxation rule.

The later `fest` distinction is evidence for first-class object classes such as:

- STRUCTURAL_FIXED
- STRUCTURAL_EDITABLE
- PROP_MOVABLE
- RESIDENT
- LANDMARK
- DECORATIVE

A collision resolver must not move fixed architecture just to make an overlap counter green.

## 6 · Scene Patch v1

Current open draft PR:

`georg-doc/kayfabizarro#168`

Head checked for this handoff:

`51f3d21cef6946adcc90820eaf100d2e42cb5391`

Status:

**SHARED EDIT/PERSISTENCE DONOR · DRAFT · NOT MERGED**

Existing evidence reports use in Resident and Dungeon hosts.

Use its architecture for shared patch/history behavior rather than creating a third generic editor.

Because the PR is not on main, Claude Design should not silently assume it can import it from the default branch. Treat it as architecture/provenance unless the exact branch is available in the authoring environment.

## 7 · 3D style / surface direction

Current open draft PR:

`georg-doc/kayfabizarro#165`

Head checked for this handoff:

`b73b4393d1f0b78740671a50261c581a31cfe040`

Status:

**ART-DIRECTION DONOR · DRAFT · NOT MERGED**

Current intended shape language:

- rounded / bowed silhouettes;
- bend / lean / taper / twist;
- broad readable masses;
- softened joins;
- fewer tiny hard facets;
- continuous arches/supports;
- controlled asymmetry;
- silhouette first.

The Racer lane is currently the first interactive human gate for this language.

World Authoring should remain visually flexible until Georg accepts that Racer direction.

## 8 · Card Zone + tileable surface donors

Current source-stage PR #172:

`cc1efb55e8d549905c70c8a4cf66552c57755224`

Current Tileable Macro Seam Lab PR #173:

`d770f68992c1b36703960cdb501c330b5185d3b8`

These are useful visual/material references only.

They do not become the World terrain/material owner automatically.

## 9 · Cross-cutting rules

### Source before composition

Show the actual source object alone before integrating it.

### Topology before presentation

Keep Hex/Dungeon/OSM logical truth separate from visual transforms.

### Editor before coordinate guessing

For asymmetric authored objects:

**inspect → place in scene → ground/contact check → save patch → export recipe**

not:

**guess coordinates → screenshot → tweak numbers → repeat**

### Camera before invented geometry

A visual mismatch may be FOV, height, orientation, occlusion or sightline.

Check viewpoint before adding geometry.

### No silent asset substitution

Missing/unidentified source assets remain explicit gaps.

### Two-pass stop

After two failed repairs on the same visible gate, stop and export failure recovery.
