# KFB Fishing, Farming, Cartoon Blast Fishing & Environment Harvesting · v0.6

**Date:** 2026-10-09 · **Status:** GEORG IDEATION + SOURCE-ROUTED POST-MVP CONTRACT · NOT IMPLEMENTED  
**One planning owner/branch:** KFB Fluff / Crafting / Alchemy / Fractal Almanac, `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`.  
**Receiving game owner later:** current KFB Island Worldbuilder Lab / Claude Code steering after the playable MVP and explicit Georg authorization.  
**Parents:** `KFB_FLUFF_CRAFTING_ALMANAC_LAYER_CONCEPT_V0_3_2026-10-09.md`; `KFB_PLAY_CRAFT_LEARN_OPTIONAL_SURVIVAL_PROFILES_V0_4_2026-10-09.md`; `KFB_GENESIS_CONSTELLATION_UFO_COSMIC_ISLANDS_V0_5_2026-10-09.md`.  
**Product promise:** fun, tangible, visually polished **optional** ways to harvest and discover Fluff, real KFB Cards and existing props. The game remains Chill & Fun and **Pull, don't gate**. No survival grind, hidden required rare fish, arbitrary loot drops or extra live runtime.

## 0. Source-checked donor inventory and open facts

| Piece | Actual GitHub evidence | Status / unresolved |
|---|---|---|
| Fishing animation | `registry/resources/v1/motions.jsonl` blob `1f266ab2e9e57db63f5596ba83f616872b502909`: **seven actual** `Rig_Medium_Tools` clips: `Fishing_Cast`, `Fishing_Idle`, `Fishing_Bite`, `Fishing_Tug`, `Fishing_Struggling`, `Fishing_Reeling`, `Fishing_Catch`. Pinned source `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_Tools.glb`, source blob `bc9db031f6608ce4b5e2b1c07f3cfae0c9b152a3` | Motion **SOURCE VERIFIED**, not an implemented fishing controller. Registry actorRefs: `driver-host`, `frizzlebob-driver-graft`; current playable avatar/rod socket compatibility unproven |
| Resident fishing activity | `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/BACKLOG.md` already specifies `Fishing_*` as shoreline/floating-water candidate | **Candidate only**. Real exact rig, rod, cast, water and support proof required |
| Real Clown bomb | `tools/resident_atlas_s6/data/cast.js` blob `5e918ae1521e63d121558fb7aff4fd1f8239baec` references source `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/clown_bomb.gltf` as `bomb_a/b` **promo-extra** props; actual source also in GitHub `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/assets/gltf/clown_bomb.gltf` | **Source prop, not approved throwable, fuse, explosion or rigged equipment.** The cartoon-blast gameplay/VFX are proposals, not already in Clown resident |
| Existing other bomb | `registry/assets/v1/packs/kenney-platformer-kit.json` references `media/3D_Assets/kenney_platformer-kit/Models/GLB format/bomb.glb` | Secondary candidate only, not a mandate to replace the source Clown bomb |
| Farmer crop scene | `tools/resident_atlas_s6/data/cast.js`: `Farmer_A.glb`, `Farmer_B.glb`, **four `dirt_plot.gltf` beds**, multiple `carrot.gltf` and `lettuce.gltf`, pitchfork, two wheelbarrows; `Digging` on Farmer_B | Actual candidate scene, **no implemented seed/growth/harvest**; original geometry/grounding and props must be shown separately |
| Legacy resource gameplay | `overworld/docs/LIVING_CONCEPT_overworld.md` lists boats/fishing, farming/mining/chopping resource activities | Historical contextual proposal, **not** current Island Worldbuilder runtime implementation |
| Water/fluid candidates | `tools/KFB-ToolBox/_inbox/kfb-toolbox-v1.1/tools/KFB-ToolBox/kfb-fluid-v1/index.js` mounts Three.js fluid; StoryMap `sma1-map-animator.js` has **radial ripple** but on StoryMap geometry | **No proven current Island Lab water shader ripple**. Wetmask/water surface, collision, level and ownership must be resolved before casting or exploding in ponds |
| VFX resources | `tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/RETURN_VFX_01.md` documents Brackeys VFX, FreeHitVfx, free cartoon smoke effects, Tiny Swords Explosion/Dust, explosions_smoke and Kenney smoke particles source families | Existing **visually source-inspected donor bank**; 2D sprite strips are not automatically world-space 3D Clay smoke/explosions. Exact accepted source, rights and rendering compatibility need original-isolation and QA |
| Current game HUD | Island Lab `KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` specifies a Fluff Score shown in walk/drive/flight HUD; Fluff growing on trees + Backpack in §6a **post-MVP backlog** | No proven authoritative cross-mode material/score/HP contract, no current fishing item/loot table |
| Fish/catch assets | Source review here did **not** verify a current approved fish model, rod, bobber, splash animation, fish loot manifest or rubber boot | **SOURCE_REQUIRED**. “Brückfisch” is a new Georg joke/catch candidate, NOT RKIT **Brick-Fish** masonry family |

**Scope:** written concept, not actual model validation, animation preview, gameplay, water shader integration, public Site, Stage or build test.

## 1. One underlying Resource Activity, two water-game presentations

Water is a **source-owned eligible activity node**, not any blue polygon in the scene. The World/Environment/Water owner determines whether there is a reachable ground-supported bank/jetty, a valid water-height/normal and player interaction. An underlying resource/grant/reward resolver already planned for Fluff is the only authoritative outcome layer. Fishing method determines the action spectacle and authored catch/table conditions, not a second loot/inventory/score system.

### A. Quiet Fishing: slow, relaxing and accessible
1. Reach a source-verified accessible `FISHABLE_WATER_ANCHOR`. A real source-backed Rod is owned in Backpack or offered as a casual short loan/gift; optionally craft it from basic Fluff. Do **not** gate all fishing behind grind.
2. One click/tap casts the bobber: `Fishing_Cast` actor clip, exact attached rod grip, cosmetic line arc, float lands on actual surface. `Fishing_Idle` plays; water bobber bobs subtly.
3. A short variable wait; the bobber **twitches/dips**, with readable ripple, audio and motion indicator (no color-only cue).
4. Click/tap within a forgiving **Chill** reaction window, use `Fishing_Tug`, `Fishing_Reeling` and `Fishing_Catch` as justified. A missed bite is a clean splash/recast, not loss of expensive bait or quest Card.
5. One fish / item / Fluff-Fish / unusual object / occasional legitimate Card clue is revealed. The animation need only sell the activity, not rig an anatomically accurate fish for every catch. World, Bag and Almanac receive idempotent events.

**Candidate state vocabulary, not a live API:** `IDLE → CAST → FLOAT_WAIT → BITE_WINDOW → REEL → REVEAL → IDLE`; `CANCEL/EXPIRE` cleans up bobber/motion/input. Movement/Drive/Flight, Camera, Music and Audio keep their existing owners. Input must work on touch. Zero forced stillness, no dedicated second Fishing render loop.

### B. Cartoon Blast Fishing: fast, absurd, spectacular
1. At a valid **blast-eligible water source** select the **fictional source Clown bomb** as a theatrical tool; no realistic explosives, chemistry, ignition or weapon-building instructions. Reuse its actual GLTF model if source/hand/rights pass, and a source-verified throw/gesture if available; otherwise a bounded presentation adaptor, NOT a fabricated rig fact.
2. The round cartoon prop drops into the water and makes one exaggerated clay *plop*. A short comic delay, then **synchronized water-ring/strong ripple**, elastic squashing water surface, clay explosion burst, tinted puffs, soot, steam/dust, splash. The actual explosion *does not change terrain/water/creatures* without a separate World-approved consequence. It is an event VFX, not a second damage or destruction engine. Honor low-effects setting and avoid violent flashing.
3. **Single authored catch/grant event** determines source-valid content. 2–7 illustrative object proxies or real source-backed outputs blast upward in a **seeded organic scatter**, then squash/bounce, settle, float and perhaps sink. Outputs can include source-approved fish with comic X-eyes, a rubber boot, odd prop, Fluff balls or a Fluff-Fish. Real death/body simulation is unnecessary; X-eyes are a toy visual gag, not a universal fish-rig requirement. Fish eyes must be added only where asset/rig compatible.
4. An audible and visual reward reveal briefly celebrates the nonsense. Player collects eligible outputs by proximity/short interact; an uncollected reward remains within safe node pickup policy, or goes into one recognized reward container/receipt, not lost in inaccessible water.
5. The water quickly calms, environment resets its **visual FX only**, real persistent node cooldown/eligibility applies once, and Residents may react to the disruption with a short source-backed observation. Repeating the blast should not multiply resources beyond the authored node/catch budget.

**Optional satire:** Dystopian bots might treat the same spectacle as “resource efficiency,” a Protopia Farmer might object to damage or pick up debris, Caveman may admire the absurd method, a Clown may applaud the choreography. These are **proposed motivations**, not verified resident scripts, not a compulsory moral penalty or one-line catchphrase spam. Player retains the option of peaceful fishing; an excessive explosion cannot be the unique route to any Card.

**Shared canonical loop:** `ActivityRequested(method=QUIET_FISH|CARTOON_BLAST, waterNodeId, actorRef, actionId) → eligibility/cooldown/seed/reservation → one source-authored CatchResult → World-approved award commit → one visual presentation selected by method → collection/Almanac/Score receipt`. This is **conceptual vocabulary**, not implemented API. The VFX cannot generate additional independent loot rolls, terrain damage, ammo or PlayerSave writes. If event or rendering is interrupted, rewards do not duplicate or vanish through partial state changes.

## 2. Organic explosion scatter and readable Clay VFX (presentation only)

Georg's specific image: objects + Fluff spheres erupt as a playful miniature firework, arc through space, bounce off **the real water surface**, make small localized splashes, float in a slightly absurd cloud/pattern and eventually settle or sink.

Technical presentation proposal:
- Use one deterministic `visualSeed` derived from the **already-authoritative ActivityResult/actionId**; same result, same arrangement on replay, independent of frame rate.
- Use an *annular / off-centre grouped, minimum-separation distribution* inspired by blue noise or constrained weighted sampling, with **radius, angle, size, delay, class and buoyancy biases**, rather than raw unbounded independent random points or a strict circular grid. Seeded arcs with several angle sectors and small clear gaps create an **organic composition**. This is an algorithm proposal only, not an existing `ENV_ROLES` or world scatter module verified in the current game.
- Reuse Environment placement/support constraints for *where* objects may settle; in-air coordinates are VFX presentation and not actual new World locations. Keep all visible items inside reachable eligible shoreline/float pickup volume and below sensible VFX budget. No permanent collider debris explosion, physics island, independent RNG reward resolver, second world material/water owner.
- Lightweight flight curves and size/weight-specific squash/settle can create credible comic physics without one rigidbody per puff. Floating outputs sample actual owner-provided water elevation with a short spring/bob cycle; sinking is a finite cosmetic effect after player reward is safe. An underwater/inaccessible appearance cannot silently erase a committed collectible.
- Visual grammar: 1) small drop/suspense, 2) expanding ring with local deformation, 3) Knet-gum blast with coloured chunks and smoke/soot, 4) diverse object arcs, 5) short bounce/splash/float/sink, 6) gradual environmental calm. Optional pauses and sound accents give theatrical timing. Avoid neon/glitch/placeholder particles or stock-like generic explosions.
- Water integration should prefer **an owner-provided local impulse / ripple adapter** in the current water shader rather than writing its own water deformation mesh. Historic StoryMap radial ripple is a **donor idea**, not a promise of plug-in compatibility. If no current shader accepts impulses, freeze the impulse seam and show a source-backed bounded surface FX in isolation; don't introduce a second water solver. The event remains optional until visually good.
- VFX donor banks are *candidates*: compare genuine original explosion/smoke/splash sources independently before adapting to KFB Clay. Prove the water blast visually rather than passing only code/JSON checks.
- One accepted Audio owner handles plop, cartoon boom, multiple splashes, bounce and quiet reset, not a new AudioContext in the minigame.

### Two fairness constraints
A) Cartoon Blast may grant quicker but not higher long-term Fluff extraction throughput than Quiet Fishing unless a future deliberately balanced Standard/Hard scenario explicitly changes it. Otherwise all chill players become blast farmers.  
B) No high-risk pyrotechnic realism or real-world dynamite fishing procedural guidance. The fiction is a theatrical KFB toy gag. Sound/particle intensity should have accessibility/reduced-motion controls.

## 3. Farmville-lite: source-backed Fluff carrots and player-managed plots
The real KayKit Farmer set has four `dirt_plot.gltf` beds, `carrot.gltf`, `lettuce.gltf`, Farmer_A/B, a pitchfork and wheelbarrows. These are excellent visual originals for later a very small authored farming activity. **The presence of props is not a working crop growth engine.**

First later loop: **choose one source-approved plot → choose one D6 High/Low Fluff-seed variant → plant → wait (in-game or capped elapsed real time) → gently pull real clay carrot → process into matching approved Fluff spheres or trade → replant**. Use 3 visual growth phases (small nub → sprout → grown) derived from source model/source-backed animation or approved child-scale, not fabricated mesh counted as a source proof. Source carrot is measured and visually accepted before variant tint/instancing.

Chill: planting is optional and **never** creates compulsory daily chores, disease, plant death for absences, hunger/meters or a login streak. "Tomorrow I have the two missing balls" can be a promise when a durable time source and save policy exist, but **not** from tamperable browser-local clock. Capped offline growth must avoid reload duplication and offline background work; a same-session short growth fallback is valid first. Personal-world housing plots use existing Academy WorldInstance/WorldRecipe permissions, not a second farm runtime.

Existing Residents already work fields; their animations/activity can *demonstrate* the role before player farming. Planting doesn't alter global public Terrain/World truth without an accepted Player Maker patch owner.

## 4. One shared source-backed Environmental Resource Activity map

| Environment / source | Candidate simple activity | What must be true first |
|---|---|---|
| Small pond / lake | Quiet Fishing, eligible cartoon blast, fish/Fluff or boot | actual water level, shoreline, surface impulse, player support + navigation, permitted activity node |
| Ocean beach / future marine island | shoreline fishing or shell/Fluff scavenging; optional blast only where authored | source-backed beach/sea zone, return path and unique ecology, no “fish in every blue plane” |
| Protopia/Town farm | carrots, lettuce/Fluff crop, trade | exact real Farmer scene source, plot grounding, growth/save owner |
| Caveman mine / geology | tap/scoop Fluff and Clay ore, craft | actual source mine, Fluff resource wallet and NPC activity |
| Forest/garden | knock Fluff fruit from source tree/shrub, rake/collect | actual source tree, source species and elastic VFX, no universal Life Tree assumption |
| Alien garden / cosmic pond | unusual fishing/gardening only after source-approved world instance | not a generic underwater feature of all future worlds |
| Water vs toxic/alien fluids | eligibility determined by existing source/biome context | **do not** allow fishing/dynamite in every shader fluid; real source and world semantics |
| Other environment nodes | possible recycle, mine, scavenge, cultivate | World/Environment owner, true POI and source-backed outputs |

No new mega-engine. **One owner-backed resource-node interaction family**, where each method is a **presentation strategy** plus eligible source-recipe outcome. This is an adapter vocabulary, not authorization to replace Environment ownership or invent a second World state schema.

## 5. Fish/props/Fluff-to-Almanac processing and a truthful score

**Catch classes (proposal):**
- source-approved little fish with optional X-eyes → finite Fluff when kneaded at the Witch Cauldron or Backpack;
- **Fluff-Fish** in existing canonical D6 hue + HIGH/LOW, processed once into matching Fluff spheres;
- source-verified boot or absurd debris/prop / “Brückfisch” as authored joke; *Brückfisch* is not the current RKIT **Brick-Fish** masonry artifact;
- rare canonical Card / Card clue → **real existing** `deckId+cardNumber`, PDF crop via existing Card viewer, one `CardProvenanceEvent(FISHING / CARTOON_BLAST, waterPOI, session)`, no duplicate card or circumvented Courier custody.

**Distinct ledgers, no accidental double counting:**
1. **Spendable Fluff wallet:** material stacks keyed by six story modes × High/Low polarity; caught fish/Fluff processed to finite material through existing single crafting resolver; spent material decreases current wallet.
2. **Existing Fluff Score:** existing Lab HUD shows Fluff Score. A future **lifetime earned/impact score** may track meaningful authoritative Fluff earn events and unusual accomplishments; never equal Wallet balance or HP, never decrement on crafting. This can be huge and satirical if desired but must not mint full points indefinitely for idle carrot farms or repeated unlimited blast effects.
3. **Health/Fluff-HP, POP/progression:** keep previous semantics; fish should not silently heal, charge, damage or convert these without accepted game-owner rule.
4. **Almanac/Lean Memory:** meaningful first catch, source Card provenance, unique weird finds or memorable fishing encounter, not every common fish/crop as a novel-length diary.

**Transaction outline, not live code:** `resolve once(actionId, player, worldNode, activityMethod, ruleset) → source-verified catch/resultId + seeded presentation + bag-or-wallet grant + score eligibility + Almanac receipt`. An unprocessed fish cannot grant its processed Fluff *and* remain in Bag after squeezing. Catch and processing use distinct idempotent receipts with consumption of the original item; score bonus, if any, awarded only at the correct meaningful event (not `catch → process → trade` three times for the same resource).

### Hall of Fame (LATER ONLY)
Georg's desire for a very high cumulative Fluff Score can support **satirical optional Hall of Fame**: unique catches, oddest retrieval, “largest non-sense harvest,” source-approved medals, themed rankings, world/biome exploration milestones. Start **local/private** and optionally export a player recap; no requirement for multiplayer or public accounts.

True cross-player global ranking is a substantially separate backend contract: explicit opt-in, public name privacy, source-validated signed/authoritative receipts, anti-cheat and rate limits, score categories/seasons/normalization between CHILL/STANDARD/HARD, server persistence, moderation and deletion; a player-uploaded savegame/check-in cannot be assumed tamperproof. No public/leaderboard Site or new score backend is authorized by this ideation.

## 6. Illustrative little loops
- **Pond, quiet:** obtain/borrow source rod → cast → floating bobber cues → fast click → catch an authentic little fish/boot/Fluff-Fish → craft at Witch → gain colored Fluff and one tiny honest Origin.
- **Pond, blast:** Clown source-bomb makes a theatrical plop → KFB Clay boom, ripple and smoke → five different source-approved things arc and scatter organically → capture an absurd prop, a fish with X-eyes and a few Fluff balls → score receipt once → nearby Resident reaction. Player can pick calmer fishing; do not spam or punish.
- **Farm, tomorrow:** plant one gold ABSURD HIGH Fluff carrot in a real supported dirt plot → on next valid session (or shorter fallback) retrieve the carrot → knead into two source-approved gold Fluff balls → finish a missing recipe; no daily-task obligation.
- **Water Card time capsule:** at one source-authored water node, successful Fishing/Blast produces a real existing Card clue or capsule; acquire via normal Card owner, show authentic PDF crop and actual location/method in Fractal Almanac. An alternate route to same Card remains reachable.

## 7. Boundaries and smallest later acceptance
**Out of next playable MVP**—all of fishing, blast, farming, fish material processing and public rankings. Do not amend active MVP-1/MVP-2 DoD, PR, World runtime or Academy MakerSpace branch. Keep public KFB/MED Site migration PARKED.

**Existing single next Fluff gate stays:** `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`, after playable MVP and explicit Georg go-ahead. Expand its source inventory to include seven motion clips, Clown bomb, original Farmer props, valid current water/shader donor, existing VFX-01 source families and exact rod/fish/boot source candidates, plus canonical Inventory/FluffScore/Card ownership; this is **an audit seam**, not new active production scope.

After that audit, **one** vertical proof chosen by existing owner:
- Option QUIET: one real water/shore node + proven fishing actor/rod/bobber + Bite/Catch → authentic sourced item/Fluff + origin + save/reload.
- Option BLAST: one source-bomb + existing Water/Surface impulse + isolated Clay explosion FX → seeded natural scatter + **one** authoritative reward event + safe pickup/save/readback. Must be visually impressive enough for KFB; otherwise preserve evidence and defer, don't substitute generic flashes.
- Option FARM: one original Farmer plot + planted crop → growth state → source carrot/Fluff conversion → reload/conservation proof.

Do not combine the three options as a mandatory bundle. Before integration show exact source actor/rod/bomb/water/VFX/farmer originals in isolation. A source URL alone is not evidence. Runtime ownership: World Surface Truth/water, Asset Librarian source/rights, Resident Motion, active movement/input, existing Audio, Inventory/Fluff wallet, current Score HUD owner, Card/Lean Memory owner. No second renderer, physics/terrain authority, camera/movement writer, VFX resource resolver or Album.

**Authoring evidence status:** GitHub source reads only; no scene build, fish/rod selection, in-browser VFX, shader ripple, farming state, real Card-fishing or persistent leaderboard test in this planning slice.
