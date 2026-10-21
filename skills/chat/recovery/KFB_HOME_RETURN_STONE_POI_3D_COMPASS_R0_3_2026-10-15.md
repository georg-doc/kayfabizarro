# KFB Quest Return Stone & Target-Aware 3D HUD Compass · Post-MVP R0.3

**2026-10-15 · GEORG PRODUCT DIRECTION / SOURCE-BASED CONCEPT ONLY, NOT IMPLEMENTED**  
**Existing receiving owner:** Island Worldbuilder Lab (one world/portal/nav/save/game HUD consumer).  
**Planning branch:** `recovery/kfb-minigames-fluff-source-bridge-2026-10-15`, Draft PR #400 (not main, no runtime integration).  
**Parents:** `KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md`, `KFB_DECK_HOMEBASE_COLLECTION_PROGRESSION_R0_2_2026-10-15.md`.  
**Outcome:** Short gratifying courier/Deck/POI journeys, one Player-attuned Homebase return point, a *real* three-dimensional Clay/physical compass target indicator with grounded direction/distance and optional proximity-color reaction; no second teleporter, HUD owner, Nav graph or separate World runtime.

## 0. Exact source evidence and corrections

1. **Existing current-ish KFB HUD donor (NOT a 3D compass):** `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-hud.js`, GitHub main blob `32dcfc3b0b9be305924ee36291716a6e372755a2`. Lines 323–333 implement `compass()` as **a CSS div needle/rose**, `setHeading(r)` and `setIsland(s)`; no waypoint/POI `setTarget`, distance query, 3D GLB or source-checked marker. It is displayed for **walk** in `LAYOUT`; drive and fly currently prioritize other components. Preserve current K7 clay HUD + R3 accepted parts and one HUD owner.
2. **True 2D target-direction behavior exists as a donor:** `overworld/overworld/hud-v7.js`, main blob `52f863851f19e31aeeb6eafbd1dcfc0a66391fea`, `makeCompass(game,cv,moodOf)` computes one arrow at a time toward the nearest uncleared zone, fallback tavern, from hero-target positions. This is a **2D canvas Overworld mechanic, not a tested 3D Island Lab module**; re-use the pattern `one target / pointer / fallback`, not its old 2D coordinates, movement engine or UI canvas.
3. **Pocket portal already planned by the World owner:** `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md`, `sync/lab-rkit-2026-10-09` blob `ca1f2968e15d594c5a64e1b6ba3b200d07346702`, §5: Portals between islands, WoW-style **Taschenportal im Rucksack** to known/visited places / collected Cards; §6 source `worldId`, typed stable `anchors[]` (`road|dock|portal|threshold|stair`), later `nodes[]` (`resource|water|farm|craft|stage`), and **NEVER PlayerSave data in world recipe**. This R0.3 specializes it as a *single selectable attuned Homebase*, not a competing teleport system.
4. **Road/route ownership:** `skills/chat/KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md`, main blob `4c32fd8a08a124c6015b91b951e37020e8b13c75`: Lab/World owns world graph and route intent, Track Core owns connected road sockets/RouteRecipe/physical contact; no new spline/nav terrain writer. Golden Journey/Courier and Card/Almanac/Lean Memory remain single owners.
5. **Current state unknown:** Exact latest local Claude Code Island Lab and its production acceptance **NOT inspected** by this web chat. Existing dated Lab review P0 proposed single PlayerSave + Ledger but did not prove that live Save, portal router, 3D target or navigation already exists. This is POST-MVP ideation; no current-game deployment or working GLB claimed.

## 1. Player fantasy and design rules

**"Go anywhere, always know why and how to get home."** In Chill & Fun, exploration stays optional, no artificial quest tunnel, no required navigation subscription or fake glowing arrow clone. Players can pin a real Card/POI, accept a source-authored Courier errand, use an animated KFB clay/metal compass to follow one helpful direction and, whenever eligible, return to their personally chosen Deck Homebase instead of repeating a long, already-played road.

The *world* gives real destinations and encounters; the HUD *projects* them. Navigation does NOT mint Cards, track hidden private treasure or unlock unknown islands. It consumes only currently known/authorized `POIRef` / active courier destination / authentic Card acquisition clues supplied by World/Quest/Card owners.

### Home Return Stone, distinct from ordinary map travel
- Player visits a real, author-approved Homebase/inn/Resident station/portal anchor. Choose **Set Home** via a short object/Resident action. Suggested diegetic visuals: rub, stamp or pulse a clay/stone token at the desk/door; **no invented specific branding or forced mandatory item**.
- Keep **ONE active attuned home anchor** initially. Re-attuning at a visited, eligible Homebase changes it atomically; the former Homebase remains an ordinary visited route/POI, not a new teleport menu with hundreds of locations.
- **Return Home** activates the *existing planned* portal/instance routing, ideally with tiny clay fold/twist/door/portal animation, then safely places Player at the exact validated landing/spawn anchor. Not a blind world-coordinate assignment.
- The Backpack may host the token/control; original Bag slots shouldn't be consumed by mandatory “permanent navigation equipment” or duplicate World save. **HomeRef = World/Instance/anchor stable IDs** in the one future PlayerSave. WorldRecipe defines possible home anchors/eligibility only, not player choice or cooldown/visit state.
- Chill default: forgiving return, no required Fluff payment/forced long cooldown. Optional Standard/Hard rules later may vary cooldown/eligibility, but never steal a user's home choice during play or gate basic accessibility. Avoid using real time to starve someone while teleporting.
- Return request checks **world/portal availability, landing support, collision/nav, custody, movement mode, combat state and active transition**. If driving, choose verified park/dismount behavior rather than leaving/duplicating the vehicle or teleporting it inside a room. No hijacking combat or cutscene; offer a readable reason and retry later. No material/item, Card, Quest or PlayerSave duplication on interruption/reload. Cancel or transfer atomically with an idempotent `travelEventId`; if destination fails, restore previous safe anchor/state.
- **Optional world-story design:** The Homebase Resident welcomes a returning Courier, reacts to actual delivered CardRef or recent discovery and can provide one next clue. This is optional source-backed ChatterBox, not a new all-knowing quest engine.

## 2. One active target, one actual spatial POI compass

Target selection (illustrative preference order, player can override/pin):
1. **Pinned explicit user choice**: specific known POI / missing source Card clue / reachable Homebase landmark;
2. **Current accepted Courier/Quest objective** from the existing Quest/Golden Journey owner;
3. **Player-selected next missing Card clue** from Deck/Almanac owner (only if discovery rules say known and there is a grounded POI);
4. **Known safe Homebase/inn** fallback when no task is selected;
5. **None** -> neutral north compass, no invented distance, no arbitrary nearest mission marker.

Target reference must include stable owner IDs (e.g. `worldId, instanceId?, nodeId/anchorId, CardRef? if known, current objectiveId`) and authorization. Only a target inside the same valid coordinate frame provides a direct bearing/distance. Far worlds or disconnected islands use the **first reachable valid Portal/Track/road transfer waypoint from the owner's route graph**. The HUD should then label the target meaning ("Protopia via North Portal", for example) and distinguish **next leg** from **ultimate objective**, not pretend the player can drive straight through a mountain to a hidden island.

The compass is an **actual 3D geometric object/pointer** with KFB-authentic clay/diegetic toy form (possibly a stamped compass housing and short bent needle/arrow), properly source-isolated and authored/approved as native GLB/GLTF or existing validated geometry. A visual CSS rotated polygon like current R3 does **NOT** satisfy Georg's request for a **3D file/object**. In the real game use a **screen-space viewport/overlay pass of the existing one Three.js renderer**, or another owner-accepted sharing of its 3D scene; **no second WebGL renderer/context, input owner or HUD rebuild**. If the source 3D model cannot be shown in isolation, keep the 2D donor as a labeled temporary backup, not a fake accepted 3D deliverable.

Motion/navigation:
- Rotate the 3D pointer smoothly according to the **relative bearing** `targetBearing - playerHeading` around correct world-up, using current camera/player mode conventions; old CSS `setHeading` was north-facing only. Handle 360° wrap with shortest angular path/damping to avoid full spin/oscillation.
- **FLIGHT MUST show full 3D elevation:** the actual arrow mesh tilts strongly and unambiguously **UP or DOWN** according to the vertical component toward the next reachable waypoint. It is not sufficient to rotate horizontally, add a color cue, or use a flat 2D arrow. While Walk/Drive keep a calm primarily horizontal readable view, Flight is mandatory full 3D azimuth + elevation; see binding addendum below.
- Show **one target name + relevant distance**, and optionally short `via Portal/bridge` text; no triple compass arrows or quest-marker clutter. Never show measured route length if only 3D straight-line distance is known: label `straight-line ~m` or suppress until owner route distance is available. No invented ETA. Distinguish `remaining to next waypoint` from `total trip`.
- **Proximity color**: distant = calm/cool/darker KFB Material role, approaching = more saturated/warm, reached = soft pulse/settle and an honest Arrival receipt. Example distance bands are TUNABLE by local scale and route type, not hardcoded `100/50/10 m`. Color is **an additional cue** alongside remaining distance, animation/text and shape for accessibility. Do not reuse canonical D6 story-mode hue as distance/health meanings or make Low Fluff = danger. Theme responds through owner Material Roles, avoids off-brand neon/gradient gloss. Color state can remain calm or neutral if target unavailable/unknown.
- Update in `walk/drive/fly` using the same underlying `TargetNavigationState`; adapt HUD arrangement, keep Driver road focus/visibility and reasonable scale. Current donor only displayed Compass in walk; **the route adapter intentionally extends access across modes** without cloning HUD modules.
- On arrival, handoff to the *existing* interaction/quest owner. A marked Card can still require physical pickup/delivery; simply walking close, visual sparkle or color transition cannot silently complete a quest or mint a Card.

### Flight-mode binding clarification — real pitch, not a decorative 3D arrow (Georg 2026-10-15)

**Author decision:** In `fly`, the **same actual source-verified KFB clay 3D quest arrow** MUST turn in **yaw/azimuth** AND visually incline in **pitch/elevation**. When a target or next route waypoint is above the player, the point visibly **leans up**; when below, visibly **leans down**; near directly above/below the pointer may approach a vertical pose. This is a required post-MVP flight acceptance property, no optional polish. Do not substitute a 2D North needle, a mere purple/green proximity state, a vertical text arrow alone, or a flying camera tilt for the actual 3D needle motion.

**Illustrative math/coordinate contract (not a live API):**
```text
target = World/Navigation owner resolves *next reachable waypoint*,
         not an inaccessible final Card / inside a sealed mountain
p = PlayerWorldPosition in the SAME World/Instance coordinate frame
q = targetWorldPosition in that frame
d = q - p
horizontal = hypot(d.x, d.z)
yawWorld = atan2(d.x, d.z)
pitchWorld = atan2(d.y, max(hypot(d.x, d.z), epsilon))
relativeYaw = wrapShortest(yawWorld - player/vehicle navigation heading)
HUD arrow orientation = yawAroundWorldUp(relativeYaw)
                      + pitchAroundNeedleLocalRight(pitchWorld)
                      (sign depends on the verified 3D model's forward axis)
slantRange = sqrt(d.x²+d.y²+d.z²) // only if straight-line distance is labeled
heightDelta = d.y               // Δ↑ or Δ↓, player-relative
```
- **Keep a legible miniature horizon/reference ring**: pitch zero points along it; up/down motion is evident without needing to read labels. A tiny `UP / DOWN` or `↑ / ↓` indicator and `Δ height` (from known coordinates only) complement the 3D rotation for color-blindness, touch UI, reduced motion and steep view angles. Do not force constantly spinning or giant airborne arrows.
- **Be precise about reference frames:** normalize source `WorldInstance` and player coordinates through the single World owner **before** computing a direction; avoid mixing island-local meters, global World units, camera-space pixels, or following the ship's bank/roll. Player/vehicle heading governs yaw relative to travel; the **world vertical** governs elevation so camera orbit, pitch and roll don't falsely flip arrow direction. If rendering an overlay mesh, correctly project the 3D orientation into the existing HUD owner's viewport without creating a second camera/renderer/input owner.
- **Handle flight extremes:** if horizontal distance approaches zero, retain the previous stable yaw, tilt toward ±90° as justified and signal `DIRECTLY ABOVE / BELOW` rather than jitter. If total distance tends to zero, switch to `ARRIVED` and settle; don't divide by zero. Smooth yaw through ±180° with shortest rotation and smooth pitch without hiding a real sign change. Respond to a changing altitude smoothly; don't treat flight altitude as irrelevant to distance.
- **Waypoints and truth:** when the ultimate Card is in another WorldInstance or behind a blocked threshold, show the 3D direction/height to **the route owner's next valid crossing / landing / portal / transition anchor**; name the eventual destination separately. If no valid route/coordinate transform is resolved, display `route unknown` rather than aim at an imaginary floating target. Distinguish straight-line distance, remaining route length, and vertical difference; no invented distance or ETA.
- **All movement modes share one target:** `walk` and `drive` may use lower-profile yaw-oriented pointer; `fly` activates pitch and an elevated HUD placement/contrast that remains readable at speed and during ascend/descend. Any eventual Low-G/Zero-G profile uses the same 3D geometry and navigation truth, not a new flight or nav system. HUD color warming as approach is optional and secondary to physical pointing.

**Required future source-isolated proof fixtures (not tests run here):** (1) valid waypoint far level ahead = pitch ~0°; (2) same horizontal range but 30° above = clearly nose-up; (3) 30° below = nose-down; (4) virtually straight overhead/beneath = ±near-vertical without yaw instability; (5) behind-right with camera orbit/vehicle banking = correct relative yaw and unchanged true elevation; (6) distant Card behind mountain = arrow aims at reachable portal/crest before Card; (7) ascent/descend through target altitude = continuous pitch crossing zero; (8) Walk→Drive→Flight→Walk preserves single target and no camera/Audio/PlayerSave mutation. Verify in the **actual game camera** with a source-faithful 3D object, not only unit-test angle logs or rotated CSS.

This clarification changes **only** the planned `fly` compass behavior. It does **not** update the currently-running Island Lab, its acceptance matrix, the current 2D HUD, or the existing named `CLAUDE_CODE_RECOVERY_INTAKE_CONFIRMATION` and deferred `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` gates.

### Two surfaces, one target truth
- **HUD 3D Compass** (always one active objective, optional quiet/hidden state) = small readable relative direction + distance + context.
- **Optional world-space POI beacon** near a verified target/portal = restrained 3D scene effect at a grounded anchor, with no floating through occlusion, no fake deep-link/surface coordinates and no new pathfinder. The same `TargetRef` drives both. Show only when useful, and never without a valid source World location.

## 3. Integration contract (concept-only vocabulary; APIs not implemented)

```text
World authoring (one Lab WorldRecipe):
  worldId + typed anchorId / nodeId + connectivity + allowed HomeBase/POI tags
  (all source-aware / grounded; no player inventory, quest or distance counter)

PlayerSave / Lean Event Ledger:
  homeRef = { worldId, instanceId?, anchorId }    // set and persist exactly once
  visitedRefs / knownRoutes
  selectedTargetRef = { objectiveId?, poiRef?, CardRef? } // UI preference only
  attunement/teleport receipts + source Card/Quest event references

Existing Quest/Card/World navigation owners:
  ResolveKnownTargetRef(player, source, current world)
  ResolveFirstReachableWaypoint(targetRef, movementMode, routeGraph)
  ResolveOwnerDistanceAndBearing(playerTransform, routeLeg/target) // distinguish straight-line vs path
  ValidateReturnHome(player, homeRef, live World state)
  CommitPortalTravelOnce(travelEventId, homeRef) → entry/landing/save success

Existing HUD & Audio/FX consumers only:
  update 3D Compass heading, visible route leg, named target and proximity state
  on confirmed portal transfer show native clay folding/arrival and small Resident reaction
```

Every function name above is a **DESIGN PLACEHOLDER**, not a real donor method. A sourced current Lab WorldGraph/portal/Save owner must be verified before any executor writes gameplay code. If current Live player session has only authoring `localStorage`, do **not** smuggle Game PlayerSave into world recipes or HUD module.

## 4. Concrete courier journey: Deck Homebase loop

**Example only: not claimed as current deployed Golden Journey script.**

- Start at an accepted deck Homebase (e.g. Lorekeeper/Protopia) and **attune** a hearth/return token at its genuine grounded desk or Portal.
- Receive a source-authored Courier errand/next known Card clue to a Town POI or a neighboring Diorama. Quest/Almanac owner produces `TargetRef`; HUD 3D pointer sets bearing, distance and one reachable intermediate bridge/Track/Portal leg.
- Walk/drive/flight along authentic paths. A few optional Fluff fruits, Fishing/Cartoon Blast water node, musical encounter and resident surprise are reasons to stop without mandatory grind. Target color subtly warms near destination. Short interacting/picking up authentic CardRef `deckId+cardNumber` appends one actual provenance receipt.
- The player may **Return Home** to their set Homebase (in Chill, default easy) once no active unsafe gameplay state blocks it. World owner confirms landing; no Vehicle/Audio/Camera duplicates. Homebase Resident recognizes actual source Card/Quest achievement and offers a meaningful next clue/earned themed prop/vehicle milestone; Almanac reflects what happened.
- Player can instead simply continue driving or pin a different objective; teleporting is never mandatory. The pleasure of driving/racing remains part of the game, not bypassed by enforced “fast travel”.

## 5. Minimal later proof, QA and explicit non-goals

**Do not implement during next MVP or broaden current PR #400 from docs to gameplay.** After CLAUDE_CODE_RECOVERY_INTAKE_CONFIRMATION plus accepted playable core and Georg's future authorization, first inspect actual source 3D compass donor, current K7/R3 HUD rendering owner, current Lab WorldGraph/PlayerSave/Portal, ground landing/current vehicle, courier POI and Travel Mode.

**One tiny first later demo** (could be paired with the existing three-card Homebase vertical proof, but not an extra compulsory gate):
1. Real accepted current KFB World scene has **two exact source-backed reachable POI nodes and one genuinely safe Homebase anchor**.
2. Put actual source-based **3D Compass mesh** alone in an isolated viewport and compare 3D look to current 2D donor; prove one orientation/scale/material.
3. Set one current quest TargetRef, HUD compass points correctly from both sides, bearing flips correctly when player rotates, distance is honestly labeled and changes consistently, proximity cue readable without color.
4. Reach real POI and show **Arrival != Card automatically awarded**; physical interaction grants once through existing Card/Quest owner when authorized.
5. Set Home, drive away, return via existing portal/instance owner; Player and Vehicle placement safe, no clone; checkpoint survives export/save/new load.
6. Ensure one current HUD/Audio/Camera owner, no source replacement/placeholder GLB, and no regression to actual existing Lab Drive Loop, performance or ChatterBox.

**Stage/Site acceptance:** none required for this planning slice. A real live future integration uses the owning Lab's approved GPT Site / acceptance surface only when authorized. No Cloudflare substitute, no new UI product or second narrator.

**One current next gate remains** `CLAUDE_CODE_RECOVERY_INTAKE_CONFIRMATION`: actual local Claude Code/Lab reads Draft PR #400 and verifies current SSOT/head. Future conditional `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` remains deferred; this navigation addition is an input, not a separate P0 gate.

## 6. Exact sources read in this continuation

- `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md` on main.
- Lab project `docs/PROJECT_STATE.md`, `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`, `docs/REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md` on `sync/lab-rkit-2026-10-09`.
- Current planning/return: `skills/chat/recovery/KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md`, `KFB_DECK_HOMEBASE_COLLECTION_PROGRESSION_R0_2_2026-10-15.md` and `KFB_POSTMVP_MINIGAMES_FLUFF_RECOVERY_RETURN_2026-10-15.md` in PR #400.
- Main `kfb-hud.js` source blob `32dcfc3b0b9be305924ee36291716a6e372755a2`, `overworld/overworld/hud-v7.js` blob `52f863851f19e31aeeb6eafbd1dcfc0a66391fea`; true current HUD vs old 2D Target donor.
- Lab God Mode/Travel pocket portal source blob `ca1f2968e15d594c5a64e1b6ba3b200d07346702`; Track Core owner contract blob `4c32fd8a08a124c6015b91b951e37020e8b13c75`.

**Test status:** source/contract inspection and GitHub persistence only, ZERO integrated HUD 3D-asset proof, browser trajectory/nav verification, Game World/PlayerSave/Portal transaction, physics/collision proof, runtime build, live Site/Stage or Claude Code local acknowledgement. 
