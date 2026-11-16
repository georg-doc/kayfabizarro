# CURRENT FOLLOW-UP · modular KFB adapter delivered

The read-only intake below was followed by root implementation: adapters/parts.js exports five individual source-derived parts; adapters/vendor/kfb-cartoon-deform.js is the unchanged existing KFB kit deformer; preview/ is a runnable isolated source/bend viewer. README.md is the current consumer entry point. Nine originals remain SHA-identical. Original warehouse and its KFB-bent form were browser-rendered; crane/container/hangar source forms were also inspected. Part contracts10/10 and source hashes9/9 pass. No physical city or new high-rise generator is claimed; original source-generic materials remain source references, KFB Clay materials are supplied by the receiving design owner. HyperNorm is an approved-input adapter contract, no private media or H16 activation.

---

# Apex Drift → KFB / Claude Design · source-pinned code donor

## Verified result

Exact original: https://patch.gg/micha-ostrowski/apex-drift
Actual central mirror origin: https://git.patch.gg/micha-ostrowski/apex-drift.git
Remote fetch completed 2026-11-16; FETCH_HEAD and local main both 224734fe7a064a5483f2c8c6bf3ca8a8d0676d82.
Commit: micha-ostrowski, 2026-11-10, “Change the licence to MIT”. LICENSE is MIT copyright2026 micha-ostrowski; package.json also says MIT. Keep LICENSE and CREDITS with source. Existing recovery saying no source/license read is superseded by this positive verification. Patch page remains unreadable through web reader, but actual Git transport and exact repo patch.json identity are verified.

## Minimal untouched source closure

- original/src/scenery.js → three, three/addons GLTFLoader and BufferGeometryUtils, ./noise.js, ./track-model.js, ./spline.js, ./textures.js
- original/src/textures.js → three; code-generated canvas textures, optional stage/ image loader
- original/src/noise.js → dependency-free seeded rng/noise/fbm/smooth
- original/src/track-model.js → ./noise.js and ./spline.js; required as original constant import closure. DO NOT invoke modelTrack in KFB: Track Core remains route/geometry owner.
- original/src/spline.js → dependency-free; required for original STEP constant. DO NOT invoke layCentreline in KFB.

The five original modules are sufficient for the harbor/airfield scenery code path with host three.js0.186.1. Actual mountain rocks require public/stage/rocks.glb separately and are not in this code-only packet. Code-only source excludes audio/models/textures binaries; source CREDITS is retained as scope information, not a claim those assets shipped. Source Lock records exact blob SHA, SHA256 and bytes of every delivered original.

## What Apex actually provides

buildScenery({RAPIER, physics, track, env, quality, world}) → Promise<{group,solid,update(time),dispose()}>.

Source 'harbor' branch supplies instanced corrugated 12.2×2.6×2.44m containers, 9m lamp posts, neon signs on12m frames, 46–53m cranes, 46×12×22m warehouse boxes with lit procedural windows, and a sea plane. 'airfield' supplies cones, 60×14×34m hangars, ring-pad paint and a windsock. 'mountain' supplies corner signs and optional loaded rocks. These are genuine source objects.

NO skyscraper/cityscape generator exists in this source pin. The tall harbor structures are cranes/sign frames. Do not name KFB-created future towers “recovered Apex skyscrapers”. Grotesque high-rises, Hypernormalisation facades and KFB cityscapes remain future KFB adaptations using existing KFB owners.

## Receiving adapter (future code; not already integrated)

Use the existing KFB THREE scene/renderer, Rapier world and frame loop. Feed source buildScenery an adapter of existing Track Core frames, never a second Apex buildWorld/modelTrack runtime:

track.def.kind = 'harbor' or 'airfield'; track.def.props / zones as needed;
track.samples = shared Core samples mapped to {x,y,z,dx,dz,sx,sz,half,bend,s};
track.bounds={x0,x1,z0,z1}; track.nearest(x,z,reach) returns {dist,half};
track.heightAt(x,z)=existing authoritative Surface Truth; track.pads=[] unless actual pads exist.
RAPIER=existing runtime; physics=existing world; host schedules returned update(time) and dispose().

Original module bundles a whole scenery theme, not individually exported building factories. For a modular parts library, extract named factories into KFB adapter files with exact source line/provenance ranges and keep these original modules untouched. Recommended extraction order: warehouse → windows; hangar; container; lamp; crane. Keep original output defaults as isolation/reference mode first. Remove source Apex wording/neon/sea from KFB compositions through explicit adapter selection, not global donor source editing. Signs must consume current KFB canonical text/Hypernormalisation data when integrated; no invented replacement branding.

## Existing grotesque-deformer seam

Do not implement a second deformer. First source-pin the existing KFB building/cartoon deformer and bind the extracted building geometry to it. Source BoxGeometry has one segment per side; enough subdivisions must exist before smooth bend/twist deformation. Deform positions/normals, recompute bounds, and rebuild host colliders from the same final geometry, or explicitly use the accepted host collision simplification policy. A source InstancedMesh shares geometry: independent bends require per-instance shader attributes or separate baked geometries/batches, not modifying shared geometry and accidentally bending every building. Placement seed/id, facade program and deformation seed must survive save/reload. Original rng(77) governs placement, but canvas wear/windows use Math.random: original rendered texture appearance is not fully seed deterministic.

## Claude Design consuming instructions

1. Read SOURCE_LOCK, LICENSE, CREDITS and this handoff. Use exact donor files, not another Apex-named game.
2. Show actual source warehouse/container/crane or hangar objects alone in a cheap isolated scene before adapting. Save source and adapted screenshots separately. A URL/filename alone is not proof.
3. Extract only the requested part into an additive KFB adapter, keep original files untouched and document adaptations. Use host Track Core/Surface Truth/Hypernormalisation/deformer owners.
4. Build one grotesque building proof with readable source silhouette and existing Clay materials, deformation and exact contact. No new city runtime; no extra renderer/AudioContext.
5. Parent integration, public stage or full city construction require their owning slice; this donor packet alone is SOURCE VERIFIED / SOURCE READY, not visual acceptance or runtime adoption.

## Checks actually run

Remote fetch exact head; patch.json exact identity; LICENSE/CREDITS/package license reads; closed import graph inspected; source scenery.js/textures.js syntax checks passed. No donor browser render, geometry isolation, deformer test, performance benchmark, source game build or KFB runtime integration was performed in this donor-intake subtask.
