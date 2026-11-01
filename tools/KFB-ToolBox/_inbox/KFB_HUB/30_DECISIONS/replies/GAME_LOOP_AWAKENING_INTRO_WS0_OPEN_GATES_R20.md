# KFB Game Loop R20 · Awakening Intro / First Card / Diegetic Tool Discovery
2026-11-01 · Georg creative proposal + source reconciliation · CONCEPT ONLY, no runtime or canon promotion

Owner: existing KFB_HUB/30_DECISIONS/replies concept lane on Draft PR #460. Georg/WS0 decides the start experience; current KFB playable MVP / WB2, Player/Motion, Card/Almanac, HUD/Audio, Travel/Lighting and Save owners remain authoritative. **No new runtime owner, new public route, Stage/Live or main-world implementation from this document.**

## Greater intent
A short, immersive, slightly uncanny **wake-up before the open world** makes the player intuitively discover a real KFB Card, then the potential for further exploration. Start **dark or sunny by choice**. Small diegetic acquisitions (light, Card, Compass, bag, radio, later vehicle key/jetpack) expand *convenience and presentation*, not the fundamental permission to explore. The player should be able to wander, inspect, listen, and skip uninteresting characters. Avoid a quest checklist, XP/tutorial overlays, fake Card artwork or a compulsory morality/ideology lesson.

Suggested first line / configurable narrative card: **“I woke up as…”**.
- Actor: **Cartoon Rabbit / FrizzleBob** (desired default); **Skeleton Warrior** is an interesting new player-facing candidate **requiring actual Player Actor/Motion proof**, not already an accepted selector entry. Current MVP selector had FrizzleBob v5b (source pin OPEN), Mannequin_Medium as technical fallback and Black Knight / Rig_Large with limited clip coverage.
- Atmosphere: **Dark & Stormy Night** / **Sunny Afternoon**; optional **Foggy Morning** if source-owned sky/lighting/weather supports it. These are scene presets, not new world biomes or a new day-night weather runtime. Always readable, with volume/motion/contrast accessibility.
- Third choice **optional only**, possibly *Surprise Me* vs one existing source-pinned introductory location. Do not proliferate dropdowns, procedurally invent opening maps or make a three-field configuration compulsory.

### Recovered original
The older `overworld/docs/MASTERPLAN_overworld.md` §4.2f already says **“It was a dark and stormy Knight…”**, opening narration box, foggy graveyard, reincarnation/amnesia (OPEN). It is a **historical creative donor**, not proof that the graveyard or narrator intro is currently implemented. The new R20 supersedes neither its exact scene nor the current Curtain automatically.

## Candidate visual beat outline (not a fixed tutorial)
0. **Dark first frame → minimal actor-and-weather choice:** use the already named Theatre Curtain/physical loading product **if source-validated**, rather than replacing it with a generic UI. The darkness may read as a wake-up held behind/on the Curtain, or the scene may start after Curtain Enter. This relationship is unresolved; do not create two loading/start owners.
1. **Awaken** at a small navigable location, with a recognizable nearby light cue, reachable exit and actual ground collisions. Night/Fog gives atmosphere **but never requires finding a light merely to move**. Sunny start uses the same authored encounter logic without artificial darkness.
2. **First authentic Card:** an original Card is seen and can be inspected/acquired; show the actual PDF-derived image/Power/Lore if available, source `deckId:cardNumber`, first provenance receipt and new Almanac entry. The Card is not a consumable bag duplicate; discovery does not assign objective cosmic truth. **Which exact Card is the first one is WS0 OPEN** (see P0 below).
3. **First direction, optional:** compass-like source-owned diegetic clue/landmark/NPC may point toward another real Card or the Clown/Golden Journey; no fixed global GPS/wall or mandatory tracking. The player may explore in another direction.
4. **Tool discoveries:** visually discover an existing real backpack prop / minimal bag; a radio/jukebox as an authored world object or equipment; a flashlight/lantern as *optional* improved night readability. One action should demonstrate what each tool does. Tools may be found, given, equipped or preprovided by the start preset; no compulsory grind.
5. **Open-world continuity:** the established Clown/Resident, Driver/taxi key, Dystopia Orc Band courier route, future drive/fly/jetpack donors can enter naturally after the first Card moment. Car key or jetpack are later optional expansion beats, not gates to Card access or Town free roam.

**UX economy:** preferably **two selections**, one clear Enter/wake action, one meaningful Card discovery, one accessible continuation. A slow intro can be skipped or resumed without losing source-locked Card provenance. Weather choice should affect visual/sound mood, **not the difficulty of accessing first Card**.

## P0 collision with current Golden Journey: resolve explicitly
The current `GOLDEN_JOURNEY_MVP_2026-10-04.md` is the existing accepted planning/acceptance route:
- Curtain/BLÖDSINN! critical-load plaque; optional character choice; **Town reveal**.
- First observed Resident = **juggling Clown**; a short ChatterBox choice; on Golden KayfaBINGO the Clown **hands out `ignore_dystopia:1` “The Doomsday Clock”** and opens a courier task to the Dystopia Orc Band.
- Driver near the roundabout optionally gives the **Taxi Key**; lightweight bag has 20 slots, *only Taxi Key* must work in this path; all routes remain walkable without the vehicle.

Georg's new **wake → find Card** proposal can either:
A. **STAY GOLDEN:** the wake room opens directly to the existing Clown encounter, the Card is *presented/found through that character*, preserving the Clown handoff, Town spawn and current first-run proof.
B. **REVISE GOLDEN (new proposal):** the player acquires the **same canonical Card** earlier from a verified source-surface, while the Clown introduces the recipient/related claim/next route **without granting a second copy**; this would require owner-controlled update to Golden Journey and NPC/courier state, not an informal assumption.
C. **OPTIONAL PROLOGUE CARD:** the player finds a *different* authentic first source Card, while the Clown's Doomsday Clock is explicitly **first courier Card**, not first globally acquired Card; changes prior Golden first-Card criteria and requires a source-pinned Card/scene. Do not invent a filler Card or duplicate.

**WS0 must select one route.** Until then the old Golden Journey is the current verified planning authority; R20 is an alternate editorial direction, not implementation approval.

## Current real donors, and what remains unproven
- Character select: `CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md` source FrizzleBob v5b with **SOURCE_PIN_RECONCILE**, Mannequin Medium technical fallback, Black Knight Large. Skeleton Warrior has actual KayKit/Combat/Resident Atlas donor evidence but **is not proven a current controllable/player-select actor**; require source isolation + matching rig/action clips before player promotion.
- Dark opening: historical `overworld/docs/MASTERPLAN_overworld.md` §4.2f **OPEN**. Mindscape/MindSphere as starting location is **not sourced here as an approved spawn point**; clarify exact scene/owner before building.
- Lamp: `travel/wip/travel_globe_wsa/globe-v13/avatar-lamp.js` implements a warm player-following PointLight driven by **one** night-weight owner. It explicitly marks *Fog of War / lighting radius reveals Cards/world* as **NOT BUILT**; that needs one separate World visibility truth, not a second lamp owner.
- HUD: `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/.../hud-flight/kfb-hud.js` has compass, radio event emitter, backpack slot in a donor; **not** proof of current WS1 runtime integration or source-art acceptance. One active UI owner only, no generic new chrome.
- Audio: `KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/INVENTORY_AND_ARCHITECTURE.md` uses global weather bed + diegetic radio and one audio owner. Radio pickup is proposed UX, not proof of persistent equipment/playlist runtime.
- Later flight/vehicles: current Golden already has Driver/Taxi key and walkable paths. Jetpack progression is an optional future mobility donor; no gated aerial travel claim.
- World R4 is still **NO MVP** per recovery/frozen matrix; concept routing and repository presence do not prove current game start is live.

## WS0 open-concept decision register for this conversation (ordered)
**P0 · decide before first storyboard / consumer:**
1. **Intro ownership and placement:** blend new blackout awakening with the existing accepted **Theatre Curtain/Enter → Town** or replace/precede its first beat under the current start owner? Keep loading fact, one screen owner, skip.
2. **First Card provenance / Clown Golden collision:** choose A/B/C above; one exact verified Card and one idempotent first-acquisition receipt.
3. **Avatar public choices:** FrizzleBob default versus Skeleton Warrior added only after isolated player rig/motion proof; fallback Mannequin/Black Knight roles clearly declared.
4. **First playable place:** a source-backed real room, existing Town spawn/graveyard, or current approved MindSphere environment? No second world/lighting owner. A readable path under both weather settings.

**P1 · content and interaction semantics:**
5. **Two/three selections and defaults:** actor, weather/time-of-day, optional spawn/“Surprise Me”; choice persists to save, no forced creation wizard. Define night/sun/fog accessibility and animation skip.
6. **Night versus reveal:** actual illumination only, or real fog-of-war/source Card reveal logic? If the latter, World owns visibility mask and lighting is only presentation. No darkness hard gate.
7. **Tool pickup order / minimal HUD:** initial bag? compass first? radio optional? lamp optional? Which are items and which are pre-existing HUD affordances? Cards always separate from bag. Avoid deactivating fundamental world exploration to create tutorial rewards.
8. **Diegetic target finding:** compass points at **actual known Clown/POI/source Card**, no infinite omniscient Card radar; cues can come from Resident knowledge/courier receipts, freely ignored.
9. **Audio/atmosphere:** first rain/thunder sound, wind/night sound bed, first song/radio reveal, music controls and spoken captions; rights/source and reduced-motion/volume constraints under current audio owner.

**P2 · later horizon, not intro blockers:**
10. **Vehicles and progression:** maintain walkable Town and optional Taxi Key; decide whether dieselpunk car, radio key, jump/jetpack are found/gifted/earned **later** without new transportation owner or double loot.
11. **Social/narrative layer:** R15–R19 open no-philosopher-king world, Ride the Consequences, Card rumor/egregore, Conflict Is King watch/intervene. They can flavour the *next* Resident after first Card; **do not gate first-time movement or overwhelm the wake scene**.
12. **Card anomalies / Goo / HyperNorm / Plato’s Dungeon:** R8–R12 open concepts for future world beats; do not require a cave, destructible wall, censorship mechanics, full combat or Meta exposition in first minutes.
13. **Transmedia/creative consolidation:** R13–R17 global intent, song/video ↔ Deck mapping, source rights, optional FrizzleBob performance and player closure remain WS0 editorial review; no new compulsory video.
14. **Historic R9–R11 persistence:** earlier local drafts only, **not present in this GitHub PR**; reconcile source/creative intent only when needed, not as false branch history.
15. **Architecture/public acceptance:** source object in isolation before source use; current WB2, Card, Resident, Motion, HUD, Audio and Save owners unchanged; current World/Golden product gate remains separate. No Stage/Site/Public route unless formally required for playable proof.

These are **decision candidates**, not 15 parallel implementation tasks.

## Small proposed editorial acceptance fixture
One **current first-run Actor**, one visually source-approved spawn, two atmosphere presets, one canonical Card and Almanac receipt, one optional navigator/tool donor, and a clear transition back into the **existing** Golden Journey. First visible world interaction must be fun/safe/readable on desktop and mobile, even if the player refuses the suggested direction. Show source object in isolation and collect screenshots/Save+Reload only in a later owner-authorized consumer.

**Evidence now:** GitHub concept/source read; no runnable scene, browser QA, mobile proof or user playtest. Tests 0; no public URL claimed; no code changed.

**Exactly one next gate:** **WS0/Georg selects the FIRST CARD ownership route A/B/C**, which settles whether the awakening is merely an expressive prelude to the current Golden first-Card handoff or requires an owner-controlled revised Golden Journey. Then source-pin one spawn/Actor for the first visual study. No auto-merge.
