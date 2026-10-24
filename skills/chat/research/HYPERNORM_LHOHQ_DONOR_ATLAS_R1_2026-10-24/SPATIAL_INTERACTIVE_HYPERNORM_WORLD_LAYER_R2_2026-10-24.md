# R2 PROPOSAL · HyperNorm as spatial / interactive World Layer
Date: 2026-10-24. **Georg-supplied creative direction**, researched implementation alternatives only. Not an authorized WorldBuilder run, not KFB canon/implementation, not deployed. Use existing owners, no duplicate runtime.

## Product thesis
HyperNorm is NOT merely billboard playback. Retain **A. autonomous experimental-film/image-code/remix/generative art** as first-class; **B. documentary/semantic and card-link exploration**; **C. world-integrated spatial/interface/media portals** as equal planes. A portal can exist as film, dream, abstract perceptual curiosity, documentary wormhole, narratively motivated object or world event. No required quote/story in pure visual A.

**Spatial experience**: a porous, hovering clay-compatible *volume of moving collage* rooted in a WorldObject, with a player-facing readable face only when appropriate. Approaching shifts from film/object to navigable hotspot space; a deliberate enter action crosses an existing portal seam or opens immersive view; returning restores pose/context/timecode. Not a flat fixed billboard with an arbitrary portal sticker.

## Reuse architecture and authority
- **SOURCE ART / PLAYBACK:** Existing H13/H14-class experimental visual owner via KFB ToolBox Billboard Media Residency / PR #354. Pure visual modes need no QuotePool. Quote read-along stays on its explicit provenance/frizzleQuestion rule. Audio analysis and mixing remain KFB Audio owner.
- **SURFACE / SHOT CLOCK:** Existing BillboardScheduler/world media timeline and H13 CanvasTexture host; no extra browser RAF/WebGLRenderer/AudioContext/camera. The visual module renders reusable frames/texture, not a new world owner.
- **WORLD LOCATION & OBJECT STATE:** WB2 existing WorldBuilder / world object identity / deterministic seeded island semantics / WorldContext / procedural placement. Current island R4 is STOP / NO MVP; this doc cannot authorize resuming it. Object IDs + placement decisions reside in WB2's recipe/state owner.
- **THRESHOLD / INSTANCE TRANSITION:** Reuse existing world/portal routing (frozen F-S13 conditional Threshold Door, existing Travel sky-card pass/dissolve and Living Masterplan Infinite Canvas instance proposal as donor references; actual receiving owner chooses based on current source). Avoid second portal router. Distinguish *screen enlarges* (same world, immersive viewer) vs *enter parallel Mindscape instance* (host-owned transition, optional separate instance runtime according to named owner).
- **CARDS:** Canonical `media/kfb/index.json` and `packId + cardNumber` source IDs. Use real Card Viewer/Almanac/QuotePool links; no second Card renderer/authoritative collection.
- **MINDSCAPES:** Georg names Mindscapes as creative peers. Exact current Mindscape SSOT/source branch was **not found** by the main repository text search during this task; ownership must be identified before any adapter. Do not invent one or claim Mindscapes are already integrated.
- **INPUT:** host movement/camera/controller owner and Raycaster/pointer focus; never steal global mouse/keyboard/Space and never add a second movement controller.
- **GAMEPLAY:** player returns to exact original space and interaction state; hyperlinks cannot silently teleport the player.

## Five appearance families (as different *presentation recipes*, not new runtimes)
1. **Floating Volumetric Screen:** thin multi-plane stack (e.g. 3–7 transparent/alpha-masked layers with parallax depth) around an H13 moving primary face. Soft breathing/edge irregularity, optional curved plane; world contact/tether/silhouette art-directed. Lightweight/closest to current CanvasTexture.
2. **Portal Aperture:** shaped opening/frame possibly with translucent occlusion, receding parallax or animated inner 2.5D collage. If an actual threshold to another instance is entered, use the existing portal route; no false geometry or new physics when still only a window.
3. **World-Anchored Apparition:** a hill, cliff, cloud, ruin, tree hollow, paper façade or temporary phenomenon hosts a collaged moving surface in situ. Biome semantics influence placement and palette; don't arbitrarily glue a UI panel onto terrain.
4. **Mindscape Lens / Immersive Bubble:** physically bounded space, moving imagery on internal curved ribbons/diorama layers/splat-like volume; A film can be experienced inside it. Gaussian splatting or volumetric particles are **optional R&D mediums only**: actual donor, rights, FPS and hit testing need proof; not mandatory.
5. **Ambient Media Ecology:** distant small fragments as flora/signals/echoes in the terrain or sky, sparse and cheap until player approaches; never spawn heavy full H13 on every procedural tile. Only a selected active portal can have full-motion detailed layer budget.

### Orienting toward the player
- For **READ** state, softly yaw/pitch toward viewer within an authored angular cone, with inertia/hysteresis to avoid constant "tracking eyeball" wobble. Allow back, side, silhouette, occult reveal to remain meaningful.
- For **THRESHOLD** state, lock entrance pose and plane/collision normal: a door that rotates whenever player approaches makes walking through unreliable.
- For **SPATIAL_SCULPTURE** state, don't auto-billboard at all; artwork has form and should read obliquely.
- Provide a deliberate front-readable view or immersive-focus state even when orientation is locked; separate "legibility" from "portal transform".

## Four-stage player interaction contract
1. **DISCOVER:** distant portal classified as a KFB world object; silhouette, volume, pulse/sound cue, art direction. Far LOD static/loop thumbnail from existing source, no giant live texture farm.
2. **APPROACH:** active video texture and sparse hotspot reveals; controller reads the existing player distance/cone/focus. Nearby characters/roads stay available; no global input takeover.
3. **EXPLORE:** pointer/gaze/ray hits the physical mesh, UV is mapped into H13's canonical frame coordinate or a composited hotspot plane. Focus, hover, click or controller confirmation dispatches typed safe actions. Embedded original site HTML is NEVER run.
4. **ENTER / RETURN:** enter shifts into the current host's focus viewer/portal state; could (a) zoom to immersive same-texture surface, (b) open linked canonical card or source inspector, or (c) route into an **already owned** Mindscape/World instance. Restore player origin pose/previous world time/media playhead on return, as permitted by existing state owners.

### Hotspot action types (proposed, not deployed)
- `CARD_REF`: open verified card by `packId/cardNumber`.
- `QUOTE_SOURCE`: open curator-approved document/Brain Food, and indicate source status.
- `MOTIF_BRANCH`: local curated rabbit-hole graph to another canonical node without changing world instance.
- `VISUAL_MUTATION`: alter visual shot/recursion/effect palette of active H13, preserving the owner clock.
- `MINDSPACE_ENTRY`: route to a *resolved* current Mindscape instance owner (currently unspecified).
- `WORLD_PORTAL`: existing host threshold/portal routing only.
- `BACKTRACK`: return along visited graph path without teleportation.
- `EXIT`: same-world/focus exit and state restoration.
Each action has explicit target/rights/state; no arbitrary HTML links disguised as in-world objects, no mass crawling or PII leak.

### Site ALT versus game content model
The real LHOHQ `libor-threat.html` page was observed to carry a 21,114-char, 311-line biomedical conspiracy text in an image ALT. This shows a **second textual layer**, but does NOT establish accuracy/intended ARG function. Adapt the **layering**, not misuse the accessibility attribute or reproduce the disinformation.
- **Visible**: image/movie/card/shape in the physical portal.
- **Semantic**: short real concise `alt` describing the media meaningfully for accessibility; separate authored `longDescription`, source annotations, provenance status, date, and source-ref to the actual text.
- **Hidden/artistic**: revealable ink inscription, riddles, alternate readings, embedded source fragments. Metadata must be explicitly opted into the player's exploration; no true hidden personal addresses/secret file archives.
- **Links**: typed edges to existing KFB cards/motifs/relations and alt interpretive siblings. `WARBURG_NEIGHBOR` edges are expressive and NONCAUSAL; `DOCUMENTS` only with real evidence.
- **Interaction hit area**: hotspot object has resolved card/media coordinates, screen-space hit test via mesh UV; not rely on DOM anchors drawn inside a texture. Sequence-specific visible hotspots follow the existing timeline while pointer targeting remains stable.

## Spatial runtime data flow (CONCEPT diagram, not implementation assertion)
```
WB2 WorldObject / WorldContext / island seed / biome (authoritative)
    │
    ├── placement recipe chooses encounter anchor (owner: WorldBuilder)
    │
    └── visual context ──> HyperNorm existing Media Residency owner/H13
                                │  curated materials / own film mode
KFB Card / Quote / Research refs ─┘  optional semantic branch
KFB Audio source/music beat ───────── existing Audio consumer handoff
                                ↓
                      2D frame / texture / prepared shot assets
                                ↓
                    ONE host 3D surface / portal mesh
                                ↓
                  host-owned raycast UV → typed click actions
                                ↓
                    existing Card / Research / World portal / Mindscape owner
                                ↓
                    return/resume original world + media playhead
```

## Procedural world integration: encounters not billboards
The location recipe chooses meaning and *purpose* before coordinates. Compatible with WB2's documented refusal of objects "at random coordinates without reasons" and deterministic biome/card source references:
- **Anchor rules:** landscape topology, clear entrance/access path, nearby Resident/landmark/biome relations, silhouette/visibility from approach, safe physical clearance.
- **Graph grammar:** some surfaces are intentional dead-ends/artworks; some offer typed links across decks, disciplines or archetypal worlds; some are doors. Do not mark every choice as "quest".
- **Spawn inputs:** world seed, biome tags, candidate KFB real Card pack IDs, semantic neighborhood, rarity, cooldown, player discoveries, available source rights.
- **WFC** can help arrange compatible *asset neighborhoods*, not dictate editorial artwork, prove narrative relationships, or become a new terrain owner. Prefer a small set of authored composition recipes/biome constraints applied through existing WB2.
- **Liminal event:** player first sees moving color/shape hovering behind a tree; approaches, a thin occult/abstract volume aligns for legible reading; focusing reveals meaningful media hotspots; selecting one enters a Card-related Mindscape (only after real Mindscape owner resolved); player returns where they stood.
- Placement and link graph must reproduce on same seed, source revision and session state, not cross-bind to random CDN live URLs.

## Performance budgets are PROPOSALS not measurements
- Far: low-resolution billboard/impostor/static approved image; no full 1024×512 active film context per object.
- Mid: reduced frame cadence/resolution, cached generated frames, no expensive readbacks.
- Near/selected: one (or carefully capped number of) H13 CanvasTexture updates per host clock, frame-rate/throttling/culling and texture size measured on target GPU.
- Invisible/offscreen: suspend expensive media passes; keep deterministic playback time as pure timeline value rather than spin separate RAF loops.
- Multi-layer 3D parallax only with measured fill-rate and sorting/alpha budget; true volumetric/splat rendering only conditional after isolated benchmark.
- The actual current H13 reference and LHOHQ source must be *visually observed in isolation*, not merely loaded. No invented FPS/performance success.

## 4 distinct design proof fixtures BEFORE implementation
1. **P01 Floating Artefact**: one actual H13 visual design isolated, on a physically 3D layered hovering thin surface; 3/4 readable and backside still a spatial object. Human sees donor separately first.
2. **P02 Anchor in Biome**: same artefact placed **meaningfully** by existing owner recipe near a rock, terrain fold or landmark, real accessible route; not pasted on world.
3. **P03 Clickable Card Rabbit Hole**: one real KFB Card (registry ID actually resolved) and one sourced optional quote; at least 3 clickable hotspots map to CARD_REF, MOTIF_BRANCH and BACKTRACK, with one stable return. ALT-inspired deeper annotation visible on demand, NOT a gigantic ALT attribute.
4. **P04 Portal / Mindscape Entry**: optional after Mindscape owner identified; physical threshold fixed for entry and return; no 2nd camera, movement owner or render loop. In absence of owner, show design proposal only, not fake destination.

## Acceptance / role
- Research/design only in Draft PR #450. **Do not modify WB2 PR #348, curator PR #354, Travel or future Mindscapes automatically.**
- Builder: future existing-owner integrator after Georg visual approval. Tester: separate interaction and deterministic-replay critic. Independent visual critic checks art fidelity, filmic intensity and actual source isolation. Production Guard decides whether any failure blocks current outcome.
- Tests future: exact source identity; 2× same-seed placement/graph replay; hit test at 3/4/back and immersive view; controller fallback; 0 bogus "wrong source" status; return restores world origin and media time; exactly one host timeline/audio clock; measured p50/p95 GPU and FPS on target device.
- One next **creative** gate: source-isolate actual H13 and selected LHOHQ video/image/ALT forms, then evaluate side-by-side **three** non-placeholder compositions (hovering 3D collage; world-anchored threshold; clickable Card/Mindscape rabbit hole). Do **not** let semantic requirement replace visual experimental art or let a generic geometry proof count as donor reuse.
