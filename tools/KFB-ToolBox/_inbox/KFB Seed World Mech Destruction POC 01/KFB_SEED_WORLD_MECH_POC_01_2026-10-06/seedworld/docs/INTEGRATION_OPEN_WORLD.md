# INTEGRATION · Seed World POC 01 → KFB Open World (WB2) · prepared 2026-10-06

Status: **PROPOSAL for the integration slice.** Not an execution brief and not acceptance. Written from a read of `georg-doc/kayfabizarro`:
- `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_ONE_SHOT_PRODUCTION_RESET_2026-10-05.md` (binding product contract)
- `…/OPEN_WORLD_EXISTING_SYSTEM_INTEGRATION_MATRIX_2026-10-05.md` (binding owner roster)
- `…/ONE_SHOT_STATUS.json` (2026-10-06: Coworker integration running, no parallel build)
- `…/KFB_KAYKIT_LOCO_SET_01.v1.json` (Georg-decided locomotion set)
- `travel/wip/travel_globe_wsa/world-builder/` (`support-surface.js`, `world-recipe.js`, `runtime-mode.js`, `mech-bee-profile.js`)
- `skills/chat/workflows/KFB_COMBAT_RAID_OPEN_WORLD_SPRINT_V1_2026-09-20/START_HERE.md` (portal seam)
- `tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_…/billboard.embed-spec.v1.json` (anchor model)

Branch read: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04` @ `3ea6fbd1f81c` (tree), main @ `276728f3f82f` (tree).

## 0 · Ground rules taken from the Open World contract
1. Integrate through existing owners. No second player, sky, track, editor, audio or Billboard owner.
2. One integrator writes core. Modules stay loadable alone; a broken module must not stop world boot.
3. World state is data (world recipe), not scene reconstruction. Authored edits override procedural output and survive regeneration.
4. Open World owns discovery, entry and return. Combat Arena owns weapons, damage, enemies, health.
5. Source fidelity: real KayKit/KFB assets stay recognisable. Procedural clay buildings are not KayKit source assets, so they need a role that does not compete with the KayKit village start.

## 1 · Module classes
- **ADOPT** — usable as a module under an Open World owner with an adapter, code mostly unchanged.
- **DONATE** — the pattern or numbers move into an existing owner; our file stays POC.
- **HOLD** — stays POC until the owning product (Combat Arena) asks for it.

## 2 · Mapping
| POC piece | Open World subsystem (reset §4) | Owner there | Class | Why / condition |
|---|---|---|---|---|
| `sw-gen.js` seed paths, settlement types, warped street grid, blocks, parcels, BuildingRecipe | `settlements/`, `buildings/` | WB2 world model | **ADOPT** as *seeded settlement provider* | Pure, worker-safe, deterministic (T1–T3), stable IDs per parcel/building. Buildings face streets, ridge parallel to street, entrance bay on the street side, which is what the reset asks ("buildings face/access roads"). Must read terrain height from the Open World terrain owner instead of its own bands. |
| `sw-gen.js` street graph | `roads-rivers-bridges/` | Track Core #219 + Joyride J14/T4/K2 | **DONATE** | Street centrelines can be exported as RouteRecipe input. Track Core owns geometry/contact, Joyride owns the look. Our ribbon mesh (`sw-mesh.js › roads()`) never ships as final road presentation. |
| `sw-mesh.js` LOD0–3 shells, deformation field, façade semantics | `buildings/` | WB2 building family | **ADOPT** for *far LOD + destructible stand-ins only* | KayKit buildings stay the near-field truth. Our shells are cheap distant silhouettes (LOD2/3) and a source for destructible cells. |
| `sw-mesh.js › cellsFor()` + `sw-destruct.js` | none yet (combat-owned) | Combat Arena | **HOLD** | Destruction is a combat feature. Offer it to Combat Arena as the destructible-world module for a raid instance (§5). |
| 2-bit damage persistence (`pack2/unpack2`, store/demote/recompile) | `persistence/` | WB2 recipe | **DONATE** | Fits "world state is data": `{buildingId, bits, collapsed, rubble}` per building, keyed by stable recipe IDs. Small: 25 bytes for 98 cells. |
| `sw-world.js` ring streaming, worker → blob worker → main fallback, ≤ 3 integrations/frame under 4 ms, slot recycling, stale-result drop | `world-streaming/` | WB2 renderer/world owner | **DONATE** | Proven by T9, T12 and bench D. Generic interface proposed in `MODULE_CONTRACTS.json › chunkStreamer`. |
| `clayMaterial()` (one material, triplanar clay_floor_001) | `visual-lighting/` | K2 clay owner | **DONATE then retire** | Stand-in only. Replace with K2 `clay-material.v10.js` in both products. |
| `sw-mech.js` mech actor (two sources, rig scale, mount, gun axis) | `player-motion-camera/` | WB2 player + Motion SSOT #344 | **ADOPT as actor profile** | Precedent: WB0 `mech-bee-profile.js`, `raw-mech-profile.js` (rig class 3.6×). Deliver `combatMechProfile` (body height, rig scale, mount node, clip roles), not a second controller. |
| `sw-mech.js` modes flight / walk / air + double-Space take-off | `player-motion-camera/` | WB2 player | **DONATE** | Matches WB0 `runtime-mode.js` "one active locomotion writer per mode". Ground ↔ flight transition timing should follow the accepted Travel TMB-2 400 ms. |
| Locomotion ladder (FrizzleBob consumer JSON) | `player-motion-camera/` | Motion SSOT #344 | **REPLACE** | Must consume `KFB_KAYKIT_LOCO_SET_01` (§4). Our ladder is evidence, not truth. |
| Upper-body rifle overlay (Running_HoldingRifle chest subtree, gun aligned along barrel axis) | `player-motion-camera/` (carry layer) | Motion SSOT | **DONATE** | LOCO_SET_01 lists "weapon carry" as excluded from its first slice. This is a ready proposal for that gap. |
| Chase camera: rigid in mech frame, boom shortens on occlusion, never below 70 % | `player-motion-camera/` | shared orbit camera module (MVP planning 26.09) | **DONATE** | A rule, not code: occlusion shortens the arm, it never lifts the camera. |
| Input guards (focus loss, Meta key, buttons from `e.buttons`, 250 px jump filter) | `player-motion-camera/` | WB2 input | **DONATE** | Fixes "turns forever" class of bugs. |
| Weapons + `sw-fx.js` | none (combat-owned) | Combat Arena | **HOLD** | Combat sprint 2 owns grip, muzzle, recoil, audio/VFX. FX pools (one draw call per family) are on offer. |
| Action bar 1–8 HUD | none | Combat Arena | **HOLD** | — |
| Checks T1–T13 + bench A–E | `qa/` | Open World harness | **DONATE** | Determinism checks T1–T4 and pool checks T5–T8 port directly to a module critic. |

## 3 · Proposed seams (see `MODULE_CONTRACTS.json` for shapes)
**3.1 Seeded settlement as a world-recipe zone.** `kfb.world-recipe.v0` already has `zones[]`. Proposal:
```json
{ "kind": "seeded-settlement", "id": "zone-…", "provider": "kfb.seed-world.gen/1",
  "seed": 2, "genVersion": 1, "type": "toytown", "origin": [x, y, z], "yaw": 0, "radius": 260,
  "overrides": { "suppressParcels": ["2.3.4.0.1"], "replaceBuilding": { "2.3.4.0.1": "instance-…" } },
  "damage": {} }
```
Authored instances win: a parcel listed in `suppressParcels` is not generated; `replaceBuilding` points at a placed KayKit instance in `instances[]`. This is the "authored placement overrides procedural without being regenerated away" rule, made possible by our stable parcel IDs.

**3.2 Height ownership.** Open World terrain owns height. `createGen(seed, { heightAt })` should accept an external height function; our bands become the fallback for the standalone POC only. Settlement flattening (block pads) is requested from the terrain owner as a terrain delta, not written by us.

**3.3 Support surface.** Flat roofs and promoted slab cells can register with `createSupportSurfaceResolver().registerObject(id, mesh, { kind: 'roof', roles: ['support','walkable'], recipeId })`. This closes our rooftop-walk backlog item through their resolver instead of our own.

**3.4 Street anchors for media.** `billboard.embed-spec.v1` anchors to `islandAnchor { mode: 'road', t, side, offsetFromKerb }`. Our street graph can answer `streetAnchor(streetId, t, side, offset) → {pos, yaw}` so Billboards and props can sit on generated streets.

**3.5 Raid instance via portal.** Combat sprint 5: Open World places a portal and sends `{actorId, safeReturn, challengeSeed}`; the Arena returns a result record. The Seed World fits as an Arena encounter: `challengeSeed` → `createGen(seed)`, the mech actor plays, destruction runs, the result returns `{buildingsDestroyed, cellsLost, damageBits?}`. No shared scene graph, no duplicate controls.

## 4 · Locomotion reconciliation (must happen before 3.x touches the player)
| Role | POC ladder (native m/s @ actorScale 0.9473) | LOCO_SET_01 (m/s rig units) |
|---|---|---|
| idle | Idle_A | Idle_A |
| walk | Walking_A 0.6576 | **Walking_B 0.98**, cycle 1.067 s |
| run | Running_A 3.1773 | Running_A 3.303, cycle 0.8 s |
| sprint | Running_B 3.8803 | Running_B 5.255, cycle 0.8 s |
| back / strafe | Walking_Backwards, Running_Strafe_L/R | backwards listed; strafe walk = GAP |
| jump | Jump_Start / Jump_Idle / Jump_Land | same chain |

Differences that matter: walk clip, sprint speed, and the blend method (LOCO_SET_01: one shared gait phase, sample at `(phase + leftFootDownPhase) mod 1 × cycleT`, at most two neighbouring clips, linear weights). Our mixer uses crossfades with `syncPhase`. Action: switch `LOCO.roles` and the blend to LOCO_SET_01, keep our strafe and jump handling as additions for the documented gaps, scale by mech body height (rig 3.6× class per WB0 precedent; verify against the mech's measured height).

## 5 · Order I would propose for the integration slice
1. Wait for the Coworker return on PR #348 (status file says no parallel build).
2. Port the pure generator as a zone provider behind `heightAt` injection (3.1, 3.2). Prove T1–T4 inside WB2's harness.
3. Mech actor profile + LOCO_SET_01 under the WB2 player owner (4). Flight as a second locomotion mode via the runtime-mode bridge pattern.
4. Support-surface registration for roofs (3.3), street anchors (3.4).
5. Offer destruction + weapons to Combat Arena as a raid instance (3.5). Separate product decision.

## 6 · Open questions for Georg
1. Should procedural settlements appear in the Open World at all, or only as far-field silhouettes and raid instances? The reset wants a KayKit village start and recognisable source assets.
2. Is the mech a playable Open World actor (flight + walk), or only an Arena actor reached through the portal?
3. Units: WB2 uses metres +Y-up? WB0 used a globe radius with `bodyHeight 0.022`. The adapter depends on this.
