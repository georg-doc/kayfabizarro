# InfiniteRooms · native HeroMan-Blaster proof · 2026-11-17

Private proof, no merge. Source Game `game/integration-r2` pinned at `abe7bc24f02147dfcd785bf60feaae574aa13779` (branch head checked at the start of this work). This is a playable proof host, not a completed installation into the Game.

## Connected

- Actual `combatPlayer.r2` owns release marker, muzzle, projectile, first contact and original combat effects. One `combatTargets` registration named `infiniterooms`, `sweep`/`hit`/`blast`, no `boxes` registration and no autonomous target loop.
- Existing `cascade/core.mjs` + `r4/fracture.mjs` + `impact-mask.mjs` drive all six wall/floor/ceiling planes. Their holes derive a common 12.5 cm solid field, used by both visible chunk meshes and Rapier colliders. Interior card projection preserves aspect, never tiles.
- Broken native face polygons use the unchanged `dropLaserPanel` mesh builder. Dynamics run in the proof host's single Rapier world (maximum 24 pieces, 6 new per surface commit, 4.5 s life). No second debris solver. Convex hulls approximate concave pieces.
- A real 1.81 m capsule collides with room and debris. WASD movement; safety return if falling below the room. Reset restores the graph/geometry/collision and rejects re-solidifying around the capsule.
- Exactly one native combat event consumer feeds `audio.k10` by producer sequence. Audio is optional and explicitly unlocked. One AudioContext. Native music is paused after unlock to isolate the shot. The unchanged native audio bank currently reports a missing snow footstep; this proof does not replace it.
- Original HeroMan GLB SHA256 `640924f7c85bdfa0a9428db3ff8639039c2b7f0f36553e8ac047176e212e120c`. Original FB web canon r1j SHA256 `1d13f2cd13059922d23962cb834529a4eec4ab4d226ca102845d0bbbf3c5021a`, proof only. Neither model changed. Original ranged/MB1 source clips; one actor mixer.
- FPS/TPS use the same native combat owner and world muzzle. FPS presents an original-gun clone in a depth-cleared layer of the same renderer, under the same lighting; that clone owns no hits/FX. It is a proof presentation, not the Game FPS arm rig.
- Near-wall button verifies muzzle obstruction: the host rejects firing across a wall between head and original world muzzle. Rays are supplied by the host collision callback; the response module only consumes confirmed messages.

## Reproduction

Open `/blaster-lab/`. Click **Ton einschalten** and wait for **Ton aktiv** for original audio. **FPS/TPS aufnehmen** captures six native releases in TPS, reset, six in FPS. Shots after a hole opens may legitimately leave the room without another contact. The two runs are camera comparisons, not byte-identical deterministic replays: original combat marker timing, source seeds and muzzle animation remain active. `Prüfdaten` exposes releases, contacts, accepted messages, duplicates, spawned debris, collision and CPU/rAF samples.

**Prüfkameras aufnehmen** captures side, three-quarter, wide and contact views, each from a fresh room, one real release per camera. These are explicitly versioned proof camera positions in `main.mjs`; no claim that they are WS0's canonical Game video transform presets. The definitive preset transforms still need to be supplied by WS0.

## Validation and limits

280 automated tests pass, including three new tests: all six native fracture planes/reset; real Rapier breach and reset overlap; exactly one source/message/cascade with deduplication. Build passes. Native asset/source bytes remain unchanged.

Browser proof verifies native releases, confirmed graph hits, holes, physical debris and the near-wall blocker. First measured warmed comparison: TPS/FPS six releases each, two wall contacts each (remaining shots pass through the breach), no duplicate callbacks. CPU/render-submission p95 about 3.5/3.2 ms, but fracture frames spike around 282/264 ms. This is not a 60-FPS acceptance, GPU timing or controlled hardware benchmark. Cold shader/setup frames can exceed one second. These spikes remain a clearly open performance item; no integration PASS implied.

## Open for WS0

1. Install only adapter/geometry ownership into the actual Game root/world. The `native/` snapshot is a private proof dependency, not code to overlay into the trunk. Resolve against the then-current branch head.
2. Replace proof actor adapter and FPS presentation with the real runtime FB/action/held-weapon host. Preserve actual muzzle/marker; do not use the proof GLB as a runtime replacement.
3. Use the real Game physics and frame lifecycle, canonical video preset transforms and safe-travel owner. Proof provides a capsule and fall return, not navigation/vehicle integration.
4. Optimize native fracture/raster/first-material work before combat acceptance. Dense 12.5 cm voxel edges deliberately remain coarse. This does not yet implement native fracture contour meshing through the slab.
5. Authoritative profile names and recipes stay data. Only HeroMan-Blaster has live visual proof here; Gatling/melee/bombs/drill/vehicle behavior are not claimed tested in the native host.
6. Full FX recipe texture set is incomplete in the current local proof asset snapshot, so `kaskaderezept=r1` is not enabled by default. Native blaster reference FX are used. No substitute FX were invented.
7. Game owns health, enemy receipts, sound bank packaging, save/persistence and interaction policies. This proof adds none of those owners.

No Game worktree modification, no merge, no message sent to WS0. Georg reviews the private stand first.
