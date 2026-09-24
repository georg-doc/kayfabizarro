# KFB Production Architecture v3 · Strand Start Briefings

Status: **COPY-READY CANDIDATE**  
Use with:
- `START_HERE.md`
- `PRODUCTION_STRANDS.md`
- `INPUT_LOCKS.json`

These messages are designed to be copied from the Hub into a fresh executor chat. They already contain the product intent. Do not run a separate planning round before starting them.

---

## TB-EYE-01 · EyeRig Production Studio

**Executor:** ChatGPT Web / ToolBox owner  
**Outcome:** one useful EyeRig authoring surface spanning current character families plus one vehicle proof.

> @GitHub
> Read KFB Production Architecture v3, `PRODUCTION_STRANDS.md` → STRAND T / T2 and the current EyeRig Batch source on PR #104.
>
> Build **TB-EYE-01 · EyeRig Production Studio** from the existing EyeRig v6 and Batch EyeRig work. Do not create another eye implementation.
>
> Product outcome:
> - actual actor roster search/select;
> - approved profile auto-mounted on load;
> - Source vs EyeRig comparison;
> - profile edit/save/reload;
> - Rig_Medium + Rig_Large useful as current accepted families;
> - Legacy shown as full characters and made practically reviewable;
> - one verified vehicle front host using the existing Vehicle FaceHost direction;
> - hierarchical selection down to EyeRig;
> - independent left/right local eye adjustment as an additive EyeRig-v6 authoring capability, not a fork.
>
> For vehicles: verify front anchors/components; never invent headlight nodes. Preserve gameplay illumination separately from visual eyes.
>
> Use direct in-chat real 3D review before any Cloudflare publication. Work through source/runtime details internally. Give me one coherent authoring artifact, not separate Medium/Large/Legacy/Vehicle micro-gates.
>
> Ask me only about visible profile quality or a genuine ambiguous source choice.

---

## TB-POSE-01 · Fractal Scene + Pose Studio

**Executor:** ChatGPT Web / Claude Design for compact UI only  
**Outcome:** hierarchical scene editing + bone posing inside ToolBox.

> @GitHub
> Read KFB Production Architecture v3, `PRODUCTION_STRANDS.md` → T3, Resident Atlas S6 `lib/studio.js`, its current CHANGELOG/ATLAS_RETURN, and the accepted shared `edit-layer.js`.
>
> Build **TB-POSE-01 · Fractal Scene + Pose Studio** by adapting existing working systems:
> - Resident Atlas object G/R/S;
> - Resident Atlas Bone selection + rotation ring + studio-patch persistence;
> - shared scene editor Move/Rotate/free Scale/Drop/World-Local/Save-Reload;
> - existing `pose-rig.v1.js` where its actor-relative pose logic applies.
>
> Do not write a new generic Three.js editor.
>
> The UI must expose a hierarchical selection path such as:
> scene → Resident/group → actor/prop → subpart → bone or owner-specific editable node.
>
> Capabilities depend on owner. A bone is not treated like a world prop; an EyeRig eye is not an arbitrary mesh transform.
>
> First practical proof: real Orc drummer/wardrum scene. Let me choose a base pose/clip, rotate the needed bones, adjust drum/sticks with scene transforms, scale/place as needed, save, reload and export a patch.
>
> Goal: static pose adjustment should no longer require Blender when the existing browser authoring tools can do it.
>
> Deliver one directly reviewable ToolBox artifact. No Cloudflare debug loop.

---

## TB-ANIM-01 · ToolBox Animation Studio

**Executor:** ChatGPT Web / Coworker + optional Claude Design presentation  
**Outcome:** one actual animation authoring/test workspace.

> @GitHub
> Read KFB Production Architecture v3, `PRODUCTION_STRANDS.md` → T4, KayKit Motion Lab PR #127, Motion Library PR #197, and KayKit creator/KCL research PR #107.
>
> Build **TB-ANIM-01 · ToolBox Animation Studio**. Do not promote the old unverified Animation Lab standalone as truth and do not rebuild its own actor/face owner.
>
> Consume:
> - real current ToolBox actors;
> - approved EyeRig profiles on by default;
> - KFB Motion Library catalogue;
> - registered KayKit motions;
> - measured MotionProfile/contact facts from PR #107/#127;
> - Resident Atlas motion audition;
> - later Blender-authored actions through the same catalogue seam.
>
> Required product surfaces:
> 1. clip library and compatibility filter;
> 2. actor preview;
> 3. continuous locomotion speed control;
> 4. Idle/Walk variants/Run variants;
> 5. phase-aware transitions;
> 6. hysteresis between speed bands;
> 7. playback-rate adjustment only inside calibrated ranges;
> 8. richer semantic state preview: direction, stance/equipment, grounded, action override;
> 9. optional contact/slip/debug information behind the visual preview.
>
> Do not implement “Shift = hard switch Walk/Run” as the motion model.
>
> Movement simulation may translate the actor to demonstrate cadence, but does not become a game movement owner.
>
> Done when I can select a real actor and visually test motion across a speed continuum and state changes in one ToolBox surface.

---

## TB-VEH-01 · Vehicle Motion + Driver Studio

**Executor:** ChatGPT Web / ToolBox authoring  
**Outcome:** one nested authoring scene for vehicle + eyes + cockpit + driver + presentation motion.

> @GitHub
> Read KFB Production Architecture v3 → STRAND T / T5, the existing Vehicle Lab / cartoon-deformer sources, Mech & Vehicle Rig sources, EyeRig vehicle-host section and current FrizzleBob driver source.
>
> Build **TB-VEH-01 · Vehicle Motion + Driver Studio** by consuming existing modules.
>
> Authoring hierarchy:
> vehicle root → visual/deformer root → Vehicle EyeRig host → cockpit → driver rig → driver face/eyes → props.
>
> I must be able to select valid levels through the Fractal editor and adjust owner-supported transforms/settings.
>
> Preview vehicle presentation responses for acceleration/brake/steer/drift/jump/landing using simulated telemetry or existing telemetry fixtures. Do not create vehicle physics.
>
> The same scene should allow fitting the current FrizzleBob/cockpit relation without rebuilding the driver.
>
> Output reusable vehicle presentation + cockpit/driver configuration. One direct real-3D review artifact; no Cloudflare loop.

---

## TB-SCENE-01 · Resident Scene Studio + Live Resource Picker

**Executor:** ChatGPT Web / ToolBox  
**Outcome:** live-search, load and author reusable scenes.

> @GitHub
> Read KFB Production Architecture v3 → T6/T7, Resident Atlas S6, Asset Librarian Integration for Stage-First, Asset Registry/Librarian, shared editor and ToolBox roster sources.
>
> Build **TB-SCENE-01 · Resident Scene Studio + Live Resource Picker**.
>
> Use one context-aware Library Drawer over existing truths. Do not create a second asset index.
>
> Search/load domains:
> - raw assets/props;
> - ToolBox actors;
> - Resident Atlas presets/modules;
> - configured scene modules;
> - billboards/media;
> - vehicle fixtures.
>
> Workflow:
> search → load/place → hierarchical edit → pose if actor → choose/test animation → EyeRig if needed → Save/Reload → export reusable scene configuration.
>
> First complete scenes should include Goth Girl, Orc Warband and Animatronic.
>
> A missing source must fail visibly, never substitute a cube/sign/generic actor.
>
> Deliver one coherent review artifact.

---

## TB-PROD-01 · ToolBox Production Milestone

**Executor:** Web/Coworker + GitHub Bridge  
**Outcome:** complete usable authoring chain.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 and all accepted/current outputs of TB-EYE-01, TB-POSE-01, TB-ANIM-01, TB-VEH-01 and TB-SCENE-01.
>
> Integrate them into the accepted Stage-First ToolBox baseline without creating new owners.
>
> The human milestone is one flow:
> search → load actor/Resident/vehicle → FrankenStein/Face/EyeRig → fractal edit → pose → animation test → place/scale props → Save → Reload → continue → export.
>
> Preserve current source roster, FrizzleBob, EyeRig v6, Resident Atlas, motion catalogue, shared editor and persistence owners.
>
> Do not send me five separate acceptance pages. Return one ToolBox artifact and a short list of any non-blocking TUNE items.

---

## AN-PERF-01 · Blender Resident Performance Batch

**Executor:** Blender MCP / Claude Code  
**Outcome:** a queue of reusable dance/acting/interaction clips.

> @GitHub @Dropbox @Blender
> Read KFB Production Architecture v3 → STRAND A and the current Motion Library / Resident Atlas sources.
>
> Run a productive **Resident Performance Batch**.
>
> Before authoring each item:
> 1. audition current same-rig/candidate motion;
> 2. use browser Pose Studio instead if the need is only static bone/prop adjustment;
> 3. author new time-based Blender motion only when necessary.
>
> For every actual animation:
> Resident source → donor audition → tune/author → contact check → Action/NLA → reusable GLB → short preview → next item.
>
> Do not ask for GitHub governance between clips.
>
> Return one compact batch index plus candidate files for the GitHub Bridge. Stop one performance after two failed repair passes; continue other independent queue items if possible.

---

## AN-PROFILE-01 · Motion Profile Enrichment

**Executor:** ChatGPT Web  
**Outcome:** reusable measured motion metadata for ToolBox and WorldBuilder.

> @GitHub
> Read PR #107 creator/KCL research, PR #127 Motion Lab and PR #197 Motion Library.
>
> Build **AN-PROFILE-01** as additive metadata, not a new animation runtime.
>
> Enrich current compatible clips with measured facts where evidence exists:
> contacts, planted intervals, reference speed, acceptable rate window, gait/state family, direction/stance tags, root/travel behavior and action markers.
>
> Unknown markers remain unknown. Do not infer contact/release from filenames.
>
> Produce one reusable profile/catalogue layer consumed by ToolBox Animation Studio and WorldBuilder.

---

## WB-AUTHOR-01 · Authorable Place

**Executor:** ChatGPT Web + Claude Design only where useful  
**Outcome:** WALK + terrain sculpt + object edit + Save/Reload in current WB-W0 place.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 → STRAND W, WB-W0 PR #203, WB2 PR #190 and shared editor PR #186.
>
> After WB-W0 foundation PASS/TUNE resolution, build the next coherent WorldBuilder capability:
> WALK → Raise/Lower sculpt → place/select real prop → Move/Rotate/Scale/Drop → Save → Reload → continue.
>
> Preserve measured WB-W0 scale/route and use existing WB2/editor owners. Do not restart world architecture.
>
> Return one directly clickable review artifact. No Cloudflare debugging.

---

## WB-PLACE-01 · Live Search + Fractal Scene Authoring

**Executor:** ChatGPT Web  
**Outcome:** place real KFB content from live source registries and edit it deeply where supported.

> @GitHub
> Read KFB Production Architecture v3 → W2/W3 and the accepted ToolBox Resource Picker / Fractal editor outputs.
>
> Add them to the current WorldBuilder as consumers.
>
> I must be able to live-search and place:
> props, buildings, characters, Resident scenes, configured scene modules, billboards/media, vehicles and later Race modules.
>
> Then select the placed result hierarchically and edit owner-supported levels without creating another editor.
>
> Store refs/recipes + transforms, not copied asset bytes.
>
> Deliver one coherent authoring review artifact.

---

## WB-MOTION-01 · World Locomotion + Animation Playground

**Executor:** ChatGPT Web  
**Outcome:** the game's intended motion logic visible in the WorldBuilder.

> @GitHub
> Read KFB Production Architecture v3 → W4 and the accepted ToolBox Animation Studio / MotionProfile outputs.
>
> Integrate **WB-MOTION-01** as a consumer, not a second animation system.
>
> For a selected real actor:
> - EyeRig on by default;
> - select compatible profile/action;
> - continuously vary desired movement speed;
> - world translation and animation cadence stay coherent;
> - gait changes use hysteresis + phase-aware transition;
> - timeScale stays inside approved range;
> - stance/direction/grounded states are exposed where supported.
>
> Remove the current hard “Walk vs Shift Run” demo as the intended final locomotion model.
>
> Deliver a playable WorldBuilder review where I can walk and vary movement speed/state directly.

---

## WB-OSM-01 · Editable Cartoon District

**Executor:** ChatGPT Web / Claude Design visual composition  
**Outcome:** one real OSM/KFB district as editable world content.

> @GitHub
> Read KFB Production Architecture v3 → W5, current OSM truth, accepted/current cartoon form-language sources and landmark modules.
>
> Bring one district into the current WorldBuilder through the same measured scale/terrain truth.
>
> OSM ids/footprints/geographic placement remain truth; visual grammar may bow/round/skew presentation.
>
> Use continuous road/building geometry and the shared KFB look. Include one real landmark and keep the zone editable through the WorldBuilder owner.
>
> No detached overlay city and no second world runtime.

---

## RACE-ANATOMY-01 · Racer Anatomy Foundation

**Executor:** Racer Web chat + optional Blender MCP A/B  
**Owner repo:** `georg-doc/KFB-Stunt-Car-Race`  
**Outcome:** clean reproducible track/barrier/support anatomy.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 → STRAND R and current Race PR #33 / Recovery.
>
> Continue from current R3d TUNE into **Racer Anatomy Foundation**.
>
> Solve the structural grammar, not another patch layer:
> one coherent track body / barrier-cap / underside / support-frame relationship with clean transitions.
>
> Preserve Race route, banking and physics ownership.
>
> If Blender MCP helps, use it only as a visual-mesh/cross-section authoring A/B for one representative hard-banked section. Blender does not own route or collision.
>
> Review the actual 3D anatomy directly in chat before wider integration.
>
> Stop if the same anatomy foundation fails after two focused repair passes.

---

## RACE-VISUAL-01 · Route-driven Track Visual Module

**Executor:** Racer Web / optional Blender-authored source pieces  
**Outcome:** accepted track anatomy driven along the calculated route.

> @GitHub
> Start only from accepted RACE-ANATOMY-01 and current Race route/banking source.
>
> Build one reusable **Race Visual Module**:
> computed route/banking/elevation → accepted track anatomy → continuous visual track.
>
> Visual sampling may be denser than physics, but topology has one owner.
>
> Export explicit route/source refs and world-placement anchors so WorldBuilder can consume the visual module later.
>
> Do not change Race movement/contact in this job.

---

## RACE-CONTACT-01 · Vehicle Grounding / Contact

**Executor:** Racer runtime owner  
**Outcome:** vehicle support follows actual accepted track truth.

> @GitHub
> Use the accepted Race anatomy/visual module and current Race contact owner.
>
> Fix actual vehicle grounding/contact against the true track support. Do not use visual shell offsets or camera tricks to hide contact errors.
>
> Keep vehicle presentation/deformer/cockpit separate from physics root.
>
> Return one drivable direct review candidate after repository-native tests.

---

## WB-RACE-01 · Race / OSM / WorldBuilder Bridge

**Executor:** ChatGPT Web  
**Outcome:** calculated Racer track becomes a placeable WorldBuilder world module.

> @GitHub
> Read KFB Production Architecture v3 → W6 / STRAND R4, current WorldBuilder and accepted Race visual module.
>
> Build a thin consumer recipe containing:
> - Race route ref;
> - visual-track ref;
> - geographic/region placement;
> - start/finish/service/landmark anchors where available;
> - world exclusion/clearance corridor.
>
> WorldBuilder may place and dress the module with OSM cartoon zones, landmarks, billboards, props and Residents.
>
> Race keeps route/banking/contact/gameplay ownership.
>
> Deliver one WorldBuilder review showing the computed track in its actual editable world context.

---

## WB-GOD-01 · God Mode Construction Site

**Executor:** ChatGPT Web + Claude Design presentation  
**Outcome:** the complete authoring loop as one world-building surface.

> @GitHub
> Read KFB Production Architecture v3 and accepted outputs of WB-AUTHOR-01, WB-PLACE-01, WB-MOTION-01, WB-OSM-01 and WB-RACE-01.
>
> Build the coherent **God Mode Construction Site**:
> Globe → region → local authoring → live search/place → fractal edit/pose → actor motion preview → OSM/landmarks → Race visual module → Save/Reload → pull back to Globe.
>
> Reuse all existing owners. Do not merge them into a mega-engine.
>
> Atmosphere/day-night may consume existing Travel/TinySkies presentation only after the core authoring loop is intact.
>
> Return one coherent review artifact rather than separate technical gates.

---

# Hub rule

The Hub may show every prepared briefing even when its status is `WAITING`.

Each card must make dependency/status obvious:
- READY NOW;
- WAITING FOR <named accepted capability>;
- REVIEW RESULT OPEN;
- DONE.

A waiting card is valuable because Georg can already see the complete production route without asking for another planning session.

---

# Combat / Actor / Travel / Town expansion

## COMBAT-ID-01 · Combat Actor Family Matrix

**Executor:** ChatGPT Web against `georg-doc/KFB-Combat-Arena`  
**Outcome:** explicit capabilities across Medium/Large/Legacy/CubePet/procedural families.

> @GitHub
> Read KFB Production Architecture v3 → STRAND C / C1, the current Combat Arena SSOT, PR #5, PR #7, PR #10 and PR #6 actor/melee planning package.
>
> Build **COMBAT-ID-01 · Combat Actor Family Matrix** without changing the Arena runtime unless a tiny adapter proof is essential.
>
> Include exact-source rows for:
> - FrizzleBob Driver Graft / Rig_Medium;
> - Goth Girl / Rig_Medium;
> - Skeleton Warrior / Rig_Medium;
> - one Rig_Large fighter such as Black Knight only where exact source/clips are verified;
> - Legacy Knight + Sword and Rogue + Crossbow from PR #10;
> - CubePet Bunny / `cube-frizzlebob` as a non-humanoid/node-animated family proof.
>
> Use semantic capabilities rather than assumed clip parity: idle, move, guard/aim, melee, ranged, block, hit, defeat, recover, eye-rig, sockets. Missing capability = HOLD/null.
>
> Do not force Medium clips onto Large/Legacy/CubePet. Return one compact compatibility matrix and the smallest reusable actor-capability contract proposal.

---

## COMBAT-MELEE-01 · Finish real melee contact path

**Executor:** Combat Web chat  
**Outcome:** one visually accepted real weapon strike with shared contact event.

> @GitHub
> Read KFB Production Architecture v3 → C3 and current Combat PR #7. Ignore the old Cloudflare-child-route failure as a product blocker; use direct real-source Chat HTML for iterative visual review.
>
> Continue from the existing Skeleton Blade + real `Melee_1H_Attack_Chop` + swept-contact/AttackLedger implementation. Do not restart the contact engine.
>
> Give me one direct 3D review showing:
> weapon mount → anticipation → blade path → contact/miss → hit reaction → recovery.
>
> A confirmed contact must remain the single source for damage decision, impact VFX and impact SFX. A miss does not damage.
>
> Once the Medium proof is visually accepted, prepare the same semantic profile seam for Legacy; do not implement every rig family in this job.

---

## COMBAT-DUEL-01 · Duel Choreography Studio

**Executor:** ToolBox Animation Studio / Web  
**Outcome:** two-fighter autonomous choreography and Hero-Shot loops.

> @GitHub
> Read KFB Production Architecture v3 → C2, current TB-ANIM-01 output, Combat melee/ranged profiles and Resident/ToolBox actor sources.
>
> Build **COMBAT-DUEL-01 · Duel Choreography Studio** as a ToolBox Animation Studio mode, not as a second combat game.
>
> Stage two actual actors on a readable side-on/3/4 versus stage. Let me choose fighters, distance/facing, semantic actions and attack/reaction chains. Support deterministic looping recipes such as:
> guard → attack → confirmed-contact marker → hit/block → counter → recover → reset/continue.
>
> Include Melee and Ranged only where current admitted profiles exist. Use actual weapons/props and one mixer/face owner per actor.
>
> It may visualize current swept-contact/profile facts, but HP/rewards remain Combat Arena ownership.
>
> Export a small choreography recipe usable for autonomous NPC matches and Hero Shots.

---

## COMBAT-MATCH-01 · Autonomous Match Director

**Executor:** ChatGPT Web / Combat+Animation adapters  
**Outcome:** deterministic NPC-vs-NPC exhibition loops.

> @GitHub
> Read KFB Production Architecture v3 → C4 plus accepted COMBAT-DUEL-01 recipes.
>
> Build a small **Match Director** that schedules already-admitted semantic actions; do not generate arbitrary skeleton poses.
>
> Modes: short Hero Shot, endless sparring, best-of-N, ambient scuffle. Keep the loop deterministic/replayable by recipe/seed and expose camera/event hints for the host.
>
> The same recipe must be able to run as a non-damaging exhibition in ToolBox and as a damaging encounter only when Combat Arena owns the event consequences.

---

## COMBAT-TOWER-01 · Card Tower Encounter Module

**Executor:** Combat + vertical-world Web integration  
**Outcome:** card-platform combat bands that can stack vertically.

> @GitHub
> Read KFB Production Architecture v3 → C6/B5, current Combat A2 Card-body sources and accepted Combat encounter profile.
>
> Build one thin **Card Encounter Platform** contract:
> support/card surface ref + encounter anchors + Combat encounter recipe + clear/reveal/next-band event + recovery anchor.
>
> Prove a tiny stack only: start card → encounter → clear → next card appears/unlocks → ascend. Chill mode recovers falls without losing cleared progress.
>
> Do not build an infinite tower in the first proof. Tower topology owns the stack; Combat owns fight state.

---

## COMBAT-WORLD-01 · Open World Encounter Adapter

**Executor:** WorldBuilder + Combat Web  
**Outcome:** same Combat encounter can run on authored terrain.

> @GitHub
> Read KFB Production Architecture v3 → C7 and the accepted WorldBuilder authoring surface + Combat encounter profile.
>
> Build one host adapter where WorldBuilder provides support frame, encounter volume, spawn/return anchors and persistence ref, while Combat Arena provides targeting, attacks, damage, defeat, rewards and event stream.
>
> First proof: one bounded two/three-combatant encounter placed in the authored world, then clean return to ordinary world locomotion.
>
> Do not implement a second open-world weapon/damage system.

---

## PET-ID-01 · Cube Pets + FrizzleBob identity lock

**Executor:** ChatGPT Web / ToolBox roster  
**Outcome:** no more FrizzleBob ambiguity; all 24 CubePets pinned.

> @GitHub
> Read KFB Production Architecture v3 → STRAND P and the canonical `media/3D_Assets/kfb-pets.js` + `kfb-pets.json`.
>
> Build a small actor-identity catalog that treats these as distinct:
> - `cube-frizzlebob` = CubePet bunny / `animal-bunny.glb`;
> - `legacy-arena-frizzlebob` = Combat `frizzlebob.v1.js` + Yellow_Gun lineage;
> - `frizzlebob-driver-graft` = current Rig_Medium Driver Graft.
>
> Register/pin all 24 canonical CubePet IDs and their current face/mouth/motion capabilities. Do not call the donor `FrizzleBob_Yellow.gltf` a fourth gameplay actor.
>
> Return machine-readable identities/aliases for ToolBox, Resident Atlas, Combat and World consumers.

---

## PET-TOOLBOX-01 · 24 Cube Pets in ToolBox

**Executor:** ChatGPT Web / ToolBox  
**Outcome:** CubePets are first-class actors in Face/Motion/Scene workflows.

> @GitHub
> Read KFB Production Architecture v3 → P1/P2 and accepted PET-ID-01.
>
> Add all 24 CubePets to the real ToolBox roster through the canonical pet stack. Preserve each pet's actual EyeRig, mouth, material, skin and node/procedural motion data.
>
> ToolBox must expose Face/Eye/Mouth editing and compatible motion preview without converting pets into Rig_Medium skeletons.
>
> Use the same search/scene/Save-Reload architecture as other actors.

---

## PET-RESIDENT-01 · CubePet Resident Modules

**Executor:** ToolBox / Resident Atlas Web  
**Outcome:** CubePets can live in Town and WorldBuilder scenes.

> @GitHub
> Read KFB Production Architecture v3 → P3, canonical CubePet stack and Resident Scene Module contract.
>
> Wrap one then all compatible CubePets as thin Resident modules referencing the canonical pet config. Include root transform, face state, motion/activity state and optional props/encounter hooks.
>
> Do not copy GLB bytes or fork PetMotion/EyeRig/PetMouth into Resident Atlas.

---

## PET-COMBAT-01 · CubePet semantic combat adapter

**Executor:** Combat/ToolBox Web  
**Outcome:** selected CubePets can participate without humanoid clips.

> @GitHub
> Read KFB Production Architecture v3 → P4 / C1 and accepted PET-ID-01.
>
> Prove one CubePet combat-capability adapter using its real node/procedural motion language: hop/lunge, squash/lean, hit recoil, spin/tip, EyeRig reaction where appropriate.
>
> Share semantic combat states, not skeletal clips. Admit only visually intentional capabilities. Arena keeps hit/damage/reward ownership.

---

## SURFACE-01 · FLAT / SPHERE / TORUS adapter

**Executor:** ChatGPT Web  
**Outcome:** same world recipe on multiple topologies.

> @GitHub
> Read KFB Production Architecture v3 → STRAND V / V1 and the current World Building Preflight.
>
> Prove one tiny semantic recipe unchanged on **FLAT, SPHERE and TORUS** using a single Surface Adapter contract.
>
> Expose only world↔surface mapping, local tangent/right/up, support/height, normal and wrap/topology semantics. Do not build three worlds or three movement engines.
>
> Show the exact same placed route/props or small authored patch on all three surfaces in one direct review artifact. World look polish is secondary.

---

## TRAVEL-MODES-01 · Movement Mode Router

**Executor:** Travel/WorldBuilder Web  
**Outcome:** one-active-writer Ground/Flight/Drive/Water architecture.

> @GitHub
> Read KFB Production Architecture v3 → V2, current private Travel main and PR #38. Preserve the human-accepted 400 ms Ground→Flight double-Space behavior as input evidence.
>
> Define and prove one atomic Travel Mode Router. A mode declares movement adapter, camera adapter/preset, support type, presentation actor/vehicle, allowed FX and enter/exit payload.
>
> First working pair: current Ground + Flight. Prepare Drive and Water slots without implementing fake movement.
>
> Exactly one movement writer may update world position in any frame.

---

## TRAVEL-DRIVE-01 · Free Drive off-track

**Executor:** WorldBuilder/Race adapter Web  
**Outcome:** vehicles can drive through authored world without a race track.

> @GitHub
> Read KFB Production Architecture v3 → V3, accepted Travel Mode Router, WorldBuilder surface support and current vehicle/Racer owners.
>
> Build a **Drive mode adapter** for ordinary terrain/world support. It may reuse vehicle/contact principles and ToolBox vehicle presentation, but it must not import Race route ownership or turn free drive into a hidden race track.
>
> Prove enter vehicle → drive across authored local terrain → stop/exit or switch mode → world state preserved.

---

## TRAVEL-BOAT-01 · Recover and adapt TinySkies Boat

**Executor:** Web source recovery first  
**Outcome:** real Water/Boat travel mode, not a memory-based clone.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 → V4 and the TinySkies inventory pinned at upstream `2659a5cc987d`.
>
> First recover/read the exact upstream `Boat.ts` and `BoatMesh.ts` behavior and pin source/license facts. The inventory already proves a boat and a geometric foam waterline; it does **not** prove the movement model has been ported.
>
> Only after source proof, adapt the useful mechanism into a KFB Water mode with one water support truth, boat motion owner and wake/foam presentation. Keep WorldBuilder/Travel mode switching outside the Boat module.
>
> Return source proof and one directly playable water-mode candidate; no reconstruction from prose.

---

## TRAVEL-AIR-01 · Plane / Freefall / Parachute path

**Executor:** Web + Blender only for authored assets/animations  
**Outcome:** future aerial modes are explicit instead of hidden inside Flight.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 → V5/V6 and TinySkies source inventory.
>
> Recover exact Plane/Biplane source behavior before adapting Plane mode. Separately define Freefall/Parachute as later actor-travel states that need real fall/landing truth and source-backed parachute/glider if used.
>
> Do not fake skydiving by moving only the camera. Prepare the mode contract first; implement only the first source-proven mode in this job.

---

## VERT-SOURCE-01 · Platformer / Babel source recovery

**Executor:** ChatGPT Web + Dropbox search  
**Outcome:** pin the good failed-source mechanics without reviving failed compositions.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 → STRAND B / B0 and current Babel/Hex recovery docs.
>
> Locate and pin the exact full S2b Babel export and the exact failed Platformer source that contained useful movement/camera/contact and any remembered auto-jump-line logic.
>
> If auto-jump source cannot be found, return `AUTO_JUMP_SOURCE_REQUIRED`; do not recreate it from memory/screenshots.
>
> Classify salvageable mechanics separately from rejected island/diorama composition.

---

## BABEL-01 · Measured vertical Hex recipe

**Executor:** ChatGPT Web  
**Outcome:** reachable small Babel tower grammar.

> @GitHub
> Read KFB Production Architecture v3 → B1/B2, accepted VERT-SOURCE-01, current Hex packs, `hex-grid.js/TILE_EDGES`, Babel brief and Card Zone v2 direction.
>
> Build measured support/connector/jump classes first, then one small 8–14-band Babel recipe. Use KayKit Hex parts and explicit reachability; no cubic placeholder platform and no giant random island.
>
> Keep generator recipe/data separate from traversal owner.

---

## VERT-WORLD-01 · Vertical WorldBuilder construction

**Executor:** WorldBuilder Web  
**Outcome:** towers/vertical paths are placeable world content.

> @GitHub
> Read KFB Production Architecture v3 → B3/B4 and accepted BABEL-01 / Surface Adapter.
>
> Add vertical structure modules to WorldBuilder as references/recipes: Hex, deliberate Voxel, Card bands and authored structural pieces. They sit on any supported surface but own their local vertical support stack.
>
> Add Chill recovery and only the source-proven assisted-jump behavior. The Cheese Moon may be a target/landmark; it is not an engine constant.

---

## NPC-LIFE-01 · Living Resident encounter bus

**Executor:** ChatGPT Web / Resident+Town adapter  
**Outcome:** Residents have lightweight autonomous social life.

> @GitHub
> Read KFB Production Architecture v3 → STRAND N, current Town Living, ChatterBox reuse reference, Resident Atlas and MotionProfile sources.
>
> Build one semantic encounter-beat bus:
> approach → greet → offer → react → accept/decline → leave.
>
> Animation chooses compatible performance independently; ChatterBox chooses text independently; gift/reward chooses offer independently. Host owns movement, relationship and encounter legality.
>
> Prove two Residents meeting/meeting player with short behavior, not a dialog tree.

---

## NPC-MEMORY-01 · Memory + ChatterBox adapter

**Executor:** ChatGPT Web  
**Outcome:** NPC recognition without a second memory system.

> @GitHub
> Read KFB Production Architecture v3 → N2/N3 and current ChatterBox/Town references.
>
> Adapt the best current ChatterBox/bubble donor to a 3D Resident host. Feed it a filtered view of existing Journey/event+context+card records: prior encounter, relevant cards, prior gifts/incidents.
>
> An NPC may greet a returner or reference something it actually knows. Do not invent a new global relationship database or long dialog tree.

---

## NPC-GIFT-01 · Gifts / collectible lines

**Executor:** ChatGPT Web  
**Outcome:** “attractions with legs” become reusable world behavior.

> @GitHub
> Read KFB Production Architecture v3 → N4 plus current card/collection owners.
>
> Build a typed Resident offer/gift hook for source-backed card, skin, item/scene unlock or collectible retort/line. A gift is an explicit reward/event and can be refused/accepted; text does not silently mutate inventory.
>
> Prove one Resident walks/approaches, offers, reacts and leaves while the host records the actual accepted/rejected event.

---

## NPC-WORLD-01 · Living Resident Scene in WorldBuilder

**Executor:** WorldBuilder Web  
**Outcome:** place an inhabited scene, not a static prefab.

> @GitHub
> Read KFB Production Architecture v3 → N5/N6 and accepted NPC-LIFE/MEMORY/GIFT plus Resident Scene Studio.
>
> Package one Living Resident Scene Module referencing actors/props/activity, encounter beats, ChatterBox profile, memory adapter and gift hooks. WorldBuilder must search/place/save it like any other scene module.
>
> Keep combat optional: a Combat Encounter adapter may temporarily take fight state, while social life remains the default context.

---

## SPINDLE-01 · Shared Spindle Sky module

**Executor:** ChatGPT Web  
**Outcome:** reusable environment module, no Combat-only fork.

> @GitHub
> Read KFB Production Architecture v3 → S1 and Combat PR #6 `SKY_01_SPINDLE_MODULE.md` plus exact `himmel/spindel/skydome-shader` donors.
>
> Extract/prove the smallest shared `kfb.environment.spindle-sky/0.1-candidate`: mount, preset/palette, update, probe, dispose. Host retains scene/camera/renderer/clock/fog/gameplay.
>
> Prove it in isolation and one consumer shell. No second world renderer.

---

## CURTAIN-02 · Theatre Curtain Core v2 refinement

**Executor:** Web / Game Dev Studio evidence optional  
**Outcome:** current cloth donor becomes reusable consumer-ready transition.

> @GitHub
> Read KFB Production Architecture v3 → S2 and Theatre Curtain Core v2 brief / PR #114.
>
> Preserve the real v1 cloth runtime. Implement Georg's already-recorded refinement: lower-third tieback/swag, preferably physical cord, and repair strong-gather crease artifacts. Do not replace it with SVG/CSS/video/flat planes.
>
> Then prove deterministic cover/covered/reveal API in one neutral host plus one selected KFB consumer adapter. Consumer keeps renderer, camera, pause/loading/audio/router/persistence.

---

## STAGE-INSTANCE-01 · Shared encounter/stage recipe

**Executor:** ChatGPT Web  
**Outcome:** Combat, Hero Shots and minigames compose existing modules instead of rebuilding stages.

> @GitHub
> Read KFB Production Architecture v3 → S3 plus accepted Spindle/Curtain/Combat/Resident modules.
>
> Define one thin Stage Recipe that references: support/surface, environment preset, actors/Resident scene, choreography/encounter recipe, Curtain transition, semantic FX/SFX maps, camera preset and return anchor.
>
> Prove the same recipe grammar with two hosts, e.g. a non-damaging ToolBox Hero Shot and Combat Arena encounter. No renderer/gameplay ownership moves into the recipe.

---

## FX-SEMANTIC-01 · Shared semantic VFX/SFX maps

**Executor:** ChatGPT Web  
**Outcome:** one event vocabulary, existing effect/audio owners.

> @GitHub
> Read KFB Production Architecture v3 → S4, existing Combat VFX/SFX modules, KFB VFX review bank and existing Pinball/Travel/Race audio sources.
>
> Consolidate a small semantic event map such as melee.swing/hit/block, ranged.fire/hit, actor.land/hit/defeat, vehicle.drift/impact, transition.cover/reveal. Map to existing source-backed recipes/cues where they exist.
>
> Do not build a second global FX or audio engine. Hosts emit events; presentation owners render/play them.

---

# Race / OSM / Look / Audio-VFX production jobs

## RACE-TRACK-RECIPE-01 · Authored Track A + Bake

**Executor:** Racer Web + Blender MCP for RKIT authored geometry  
**Outcome:** first complete reusable baked Track Module, no general track editor.

> @GitHub @Dropbox @Blender
> Read KFB Production Architecture v3, `RACE_WORLD_LOOK_AUDIO_DECISIONS_2026-09-24.md`, Race PR #34/#35 and current Race SSOT.
>
> Build **RACE-TRACK-RECIPE-01** around one authored recipe: `TRACK_A_STUNT_8`.
>
> Physics/dimensions:
> - Rapier is the airborne/contact basis: 15 m/s² downward gravity magnitude, 27 m/s speed basis, real physical ramp;
> - v0.8 steering/drift/grip remains the handling-feel donor, not a second physics owner;
> - width ladder = 10.8 / 14.4 / 18.0 / 21.6 m;
> - 28.8 m only as named special XL module if useful.
>
> Track A should be easy to understand: figure-eight / over-under with one ~12 m forgiving jump and one ~30 m Hero step-down, plus one bridge/tunnel/flap feature. Do not build a spline editor.
>
> Use RKIT's rounded profile sweep and reusable stunt modules. Blender owns visual geometry/module authoring only; Race owns route/contact/physics.
>
> Compile one reusable Track Module package: compact recipe + deterministic route + stunt zones + baked visual GLB + anchors/material roles + source/provenance + Race-owned contact metadata.
>
> Give me one directly playable/reviewable result. No Cloudflare debug loop.

---

## RACE-RKIT-03 · Blender module continuation under fixed decisions

**Executor:** Blender MCP  
**Outcome:** finish the useful RKIT-03 geometry without waiting for another WSA decision round.

> @GitHub @Dropbox @Blender
> Read the current RKIT-02 handover and KFB v3 Race/World decisions.
>
> The blocking decisions are resolved:
> - D1 = Rapier stunt-dimensioning basis;
> - D2 = 10.8 / 14.4 / 18.0 / 21.6 m canonical ladder;
> - D3 = keep ~12 m Base Jump + add ~30 m step-down Hero Jump;
> - D4 = Race/Rapier owns takeoff/air/landing;
> - D5 = moving Flap contact belongs to Race; Blender exports hinge/collision metadata.
>
> Continue only reusable geometry work:
> 1. flap-down v2 thin deck with clean swing clearance;
> 2. smooth width transition/funnel;
> 3. widened banked bowl;
> 4. city-street profile;
> 5. role-named material/palette readiness.
>
> Do not invent gameplay triggers, vehicle velocity or collision ownership. Return the reusable modules and one visual module sheet/review, not measurement-only output.

---

## WORLD-ZONE-BAKE-01 · Cologne OSM World Zone compiler

**Executor:** ChatGPT Web  
**Outcome:** fetch/normalize/build once, then reuse Cologne as a cached editable World Zone.

> @GitHub
> Read KFB Production Architecture v3 → W8, current `tools/osm-city-lab/data/dom-zentrum-v0/`, its build scripts/provenance and current WorldBuilder placement contract.
>
> Build **WORLD-ZONE-BAKE-01** around the already available Cologne source. Do not fetch live OSM at runtime.
>
> Produce one versioned World Zone package with source/query/hash/provenance, normalized metre-frame semantics, roads/buildings/anchors, baked visual mesh, support/collision representation and compiler/look revision.
>
> WorldBuilder stores a Zone ref + transform, not copied raw geometry. Landmarks remain separate searchable modules.
>
> Prove load/place/reload of the baked Cologne zone. Barcelona is explicitly the second-city portability proof, not a prerequisite for this job.

---

## WORLD-ZONE-BAKE-02 · Barcelona portability proof

**Executor:** ChatGPT Web  
**Outcome:** prove the same World Zone compiler on a second city.

> @GitHub
> Start only from accepted WORLD-ZONE-BAKE-01 compiler/package contract.
>
> Create one bounded Barcelona district extract using the same source→normalize→compile→bake pipeline. Do not change the schema because the city is different unless a real missing semantic is proven.
>
> Review one scene where Barcelona Zone is combined with an authored external Landmark Module (for example the Cologne Cathedral) to prove the separation between geographic source truth and fictional WorldBuilder composition.

---

## LOOK-TORSION-01 · Elastic Torsion architecture proof

**Executor:** ChatGPT Web / Blender MCP only if Geometry Nodes materially helps  
**Outcome:** restore the missing bent/twisted 90s-cartoon read without patching failed Hürth R2.

> @GitHub
> Read KFB Production Architecture v3 → W9, PR #194 failure recovery/research, current City GROTESQUE donor and Cologne BuildingElastic/LandmarkElastic evidence.
>
> Do **not** edit/fix the frozen Hürth R2 city block.
>
> Add a fourth isolated proof to the existing recovery research:
> - one tall source building/landmark;
> - enough vertical segmentation for smooth deformation;
> - cumulative height-dependent twist/torsion plus bend/lean/taper;
> - anchored base;
> - shared roof/body boundary driven by the same final deformation field;
> - neutral/simple lighting first.
>
> Existing City GROTESQUE twist ~11° is a donor/upper reference, not a universal default. Show at least a low building range and a stronger hero-landmark range.
>
> Camera skew may amplify the look but must not substitute for geometric torsion.
>
> Return direct A/B/C visual review: source → current Elastic idea → Elastic+Torsion.

---

## AUDIO-AUDITION-01 · Human-readable Sound Library

**Executor:** ChatGPT Web  
**Outcome:** Georg chooses sounds by meaning/listening, not filenames.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 → S5 and current Pinball, Combat, Race telemetry, RoadTrip/Jukebox audio sources.
>
> Build **AUDIO-AUDITION-01** as a source-backed audition/index surface, not a new audio engine.
>
> Auto-inventory current banks/manifests and present human categories: Vehicle, Combat, UI/Card, World/Ambience, Transition, Performance/Crowd.
>
> Each card needs Play/A-B, readable label, semantic event, loop/one-shot, duration/intensity, source/license/provenance and current consumers. No opaque filename should be the primary UI.
>
> First semantic set should cover representative events such as vehicle engine/throttle/drift/jump/land/rail, melee swing/hit/block, ranged shot/hit, card/UI select/reveal, portal/transition and applause/crowd if source-backed.
>
> Games continue to own their AudioContext/master. The library maps semantic ids to source-backed candidates/recipes.

---

## MUSIC-PERF-01 · Song + Resident Performance timeline

**Executor:** ToolBox Animation Studio / Web  
**Outcome:** songs and dance/band performances become reusable synchronized Resident scenes.

> @GitHub @Dropbox
> Read KFB Production Architecture v3 → A6 plus current Resident Scene/Animation Studio and source-backed KFB song/music assets.
>
> Build a small Music Performance lane in Animation Studio. When a song is present, show a beat/bar ruler and let a Resident scene reference: songRef, BPM, bar offset, performer ids, per-performer choreography/actions, start/loop/finish markers and Stage/Camera recipe.
>
> Do not bake audio into animation clips and do not create a second music player per Resident.
>
> First proof should use one existing source-backed band/dance performance. Return one reusable performance recipe and direct playback review.

---

## VFX-AUDITION-01 · Source-backed VFX Library

**Executor:** ChatGPT Web  
**Outcome:** choose/adapt proven effects before authoring new ones.

> @GitHub
> Read KFB Production Architecture v3 → S6, current KFB VFX review bank, Combat Ink/VFX recipes, Kenney smoke sources and indexed Brackeys VFX sources.
>
> Build **VFX-AUDITION-01** as a human-facing moving preview board. Categories: burst, loop, trail, impact, muzzle, smoke/fire, reveal, transition, environment.
>
> Each candidate records semantic role, source/license, anchor, loop/burst, lifetime, intensity/scale and cleanup behavior.
>
> First workflow is: audition existing donor → select → create a small semantic adaptation recipe. Example: if a useful fire donor is continuous, adapt emission/lifetime for a single-shot burst only if the donor supports it; do not rebuild fire from scratch.
>
> Return a representative Review Scene with several effects side-by-side and promote no effect merely because a file loads.

---

# Card Zone / Player Meta / Adaptive Interface jobs

## CZ-FLUID-01 · Exact Card Zone Fluid Surface

**Executor:** ChatGPT Web  
**Outcome:** one reusable source-faithful KFB fluid surface, proven in Card Zone and one World host.

> @GitHub
> Read KFB Production Architecture v3 → STRAND Z / Z1, the exact Card Zone Lab v2 source, StoryMap's source-locked `kfb-fluid-v2/card-zone-v2-fluid-source.js`, and the Card Zone shader post-mortem/history.
>
> Build **CZ-FLUID-01** by wrapping/reusing the exact v2 shader source. Do not reconstruct it from screenshots and do not promote old `kfb-fluid-v1` behavior over the source.
>
> Mandatory source facts:
> - `waterdudv.jpg` and `water.jpg` are real shader dependencies;
> - animated moving streaks/flow must remain visible;
> - the source's dead foam path stays dead; do not introduce a grey foam rim;
> - source-correct StoryMap integration is not by itself a visual acceptance.
>
> Deliver one direct review artifact with three views/hosts in the same result:
> 1. exact Card Zone v2 water reference;
> 2. reusable Fluid Surface wrapper under the same texture/uniform/timing contract;
> 3. one simple WorldBuilder-hosted pond/moat consumer using the same wrapper.
>
> If these do not visibly match in motion, stop at the source/wrapper mismatch. No Cloudflare loop and no new water shader.

---

## CZ-CARD-PRESENT-01 · Stack / Reveal / Beam module

**Executor:** ChatGPT Web  
**Outcome:** recover the real Card Zone presentation beat as reusable modules.

> @GitHub
> Read KFB Production Architecture v3 → Z2 and the exact Card Zone Lab v2 methods for `buildStack`, `prepReveal`, `poseCard`, `tickReveal`, `tickCard`, `setCardSide`, `buildProjection` and `updateProjection`.
>
> Build **CZ-CARD-PRESENT-01** from those behaviors, not from the old unverified extracted modules.
>
> Reuse the current KFB Card painter/renderer. Do not make another card rendering pipeline.
>
> Direct review beat:
> real 3D deck/stack → card prepares → source-backed Beam/projection → card unfolds/reveals → readable real card front → optional close/reset.
>
> Keep stack/reveal and Beam independently switchable as modules, while proving their combined product beat once. Return one usable presentation package plus a short source-parity note.

---

## CZ-CUBE-01 · Card Cube + Face Focus

**Executor:** ChatGPT Web  
**Outcome:** reusable six-face Card Cube viewer from the actual v2 source.

> @GitHub
> Read KFB Production Architecture v3 → Z3 and exact Card Zone v2 `buildCardCube`, `refreshArtFace`, `snapQuat`, `tickCube`, `faceToCamera`, `faceTexture` and Face-Focus code.
>
> Recover **CZ-CUBE-01** from the source because the old module extraction never safely promoted the Card Cube.
>
> Preserve the actual six-face viewer mental model: real card Art plus current source-backed Title/Power/Lore/Related/context-detail surfaces. Let the cube free-rotate, snap a selected face to camera and open the actual detail/PDF-card surface through Face Focus.
>
> Do not replace the six faces with a generic dashboard or fake card textures.
>
> Deliver one directly usable viewer module suitable for Card Zone, Almanac and later ToolBox/Story consumers.

---

## CZ-RECIPE-01 · Card Zone authored recipe

**Executor:** ChatGPT Web  
**Outcome:** compact reusable Card Zone prefab data.

> @GitHub
> Start from accepted/current CZ-FLUID-01, CZ-CARD-PRESENT-01 and CZ-CUBE-01 plus the original Card Zone v2 seed logic.
>
> Define one compact **Card Zone Recipe** using refs + parameters, not copied assets:
> card/deck ref, local support/zone recipe, fluid profile, story/card seed, palette/profile refs, stack/reveal/beam/cube settings, props/Residents and optional encounter/reward hooks.
>
> Preserve the historical seed vocabulary where still applicable: story mode, palette, fill, wear, texture and moat width.
>
> Prove two visually distinct zones from the same schema without creating a new world runtime.

---

## CZ-WORLD-01 · Placeable WorldBuilder Card Zone

**Executor:** WorldBuilder Web  
**Outcome:** Card Zone becomes searchable/placeable world content.

> @GitHub
> Read KFB Production Architecture v3 → Z5, current WorldBuilder authoring/resource-picker outputs and accepted CZ-RECIPE-01.
>
> Add Card Zone recipes as a Resource Picker category. WorldBuilder places the root module and stores its source ref + transform + authored overrides.
>
> Prove:
> search → place → move/rotate/scale/drop root → save/reload → walk/drive to zone → fluid runs → card presentation is interactive.
>
> Boundaries:
> WorldBuilder owns placement/support; Card Zone owns local fluid/card presentation; Player Journey will own collection/reward; Combat only enters through its existing encounter adapter.

---

## CZ-PROD-01 · Card Zone collection milestone

**Executor:** Web integration + GitHub Bridge  
**Outcome:** complete world-to-card-to-Almanac loop.

> @GitHub
> Read accepted/current CZ-WORLD-01 and Player Journey/Almanac outputs.
>
> Deliver one coherent product loop:
> approach placed Card Zone → animated moat/river → enter/cross → inspect real 3D stack → Beam/unfold reveal → inspect in Card Cube/Face Focus → collect → Player Journey records the card → Almanac fan/collection updates → save/reload preserves it.
>
> Do not send separate shader/stack/cube acceptance pages. One product review only.

---

## META-JOURNEY-01 · Cross-mode Player Journey contract

**Executor:** ChatGPT Web  
**Outcome:** one versioned durable player-meta state across Race/Walk/Combat/Travel/Town/Card Zones.

> @GitHub
> Read KFB Production Architecture v3 → STRAND M / M1, `overworld/overworld/journey.js`, the current game-design Fractal Almanac/Lean Memory concept, Travel collect HUD and current Race HUD donor.
>
> Build **META-JOURNEY-01** by adapting the existing Journey schema/migration approach rather than inventing unrelated save stores.
>
> Durable domains should cover current real needs: collected cards/decks, diary/events, quests/discoveries, reputation/NPC encounter facts, POP, inventory, songs/media unlocks, vehicle/travel unlocks, gift/reward facts and replay/cutscene refs.
>
> Keep authored WorldBuilder world saves completely separate from Player Journey state.
>
> Consumers emit typed semantic events such as `card.collect`, `pop.award`, `gift.receive`, `song.unlock`, `race.stunt.complete`, `combat.encounter.win`. The Journey owner applies versioned durable changes.
>
> Prove export → fresh reload/import → same state, plus two tiny real consumer adapters reading/writing the same object. Do not create a backend requirement.

---

## META-HUD-01 · Adaptive cross-mode HUD shell

**Executor:** ChatGPT Web + Claude Design only for bounded layout refinement  
**Outcome:** one coherent HUD mental model with mode-specific instruments and shared player meta.

> @GitHub
> Read KFB Production Architecture v3 → M7/M8, current Travel Card/Pop HUD, Race HUD v3 and current Travel-mode contracts.
>
> Design/build **META-HUD-01** as semantic slots/providers, not a single fixed Racer overlay.
>
> Persistent ordinary-gameplay meta direction:
> - Almanac card-fan affordance upper right using real landscape KFB cards;
> - compact POP;
> - Backpack affordance;
> - compact Radio/media affordance.
>
> Context providers add real data only:
> - Drive/Race: Tacho + actual-route minimap + driving Radio controls;
> - Walk/World: optional real world/zone navigation;
> - Combat: Combat-owned encounter status;
> - Flight/Boat: only real implemented instrument/navigation providers;
> - immersive Almanac: ordinary HUD hidden except minimal return.
>
> Do not invent a fake universal minimap, fake altimeter or generic HUD chrome to fill empty slots.
>
> Return one responsive interactive comparison that switches between at least WALK / DRIVE-RACE / COMBAT / ALMANAC-IMMERSIVE while reading one shared mock/adapter state contract. Use actual current visual donors where mandated.

---

## META-ALMANAC-01 · Fractal Almanac overlay + Journey import/export

**Executor:** ChatGPT Web  
**Outcome:** portable collection/Journey interface, not merely a card counter.

> @GitHub
> Read KFB Production Architecture v3 → M2, accepted META-JOURNEY-01, the current game-design Almanac concept and the historical walked-chamber Almanac briefing as experience reference.
>
> Build two connected surfaces:
> 1. quick Almanac overlay opened from the upper-right real-card fan;
> 2. deeper Fractal Almanac view for collection, Diary, quests/memory, Journey path, replay/cutscene refs, discoveries and later story editing.
>
> Import/export uses the versioned Player Journey JSON. Do not create a second Almanac save format.
>
> If the immersive walked-chamber mode is included, suppress the ordinary gameplay HUD inside it; that mode intentionally is not a dashboard/minimap experience.

---

## META-INVENTORY-01 · 20-slot Backpack

**Executor:** ChatGPT Web  
**Outcome:** compact cross-mode carry inventory tied to Player Journey.

> @GitHub
> Read KFB Production Architecture v3 → M3 and accepted META-JOURNEY-01.
>
> Georg's current product direction is **20 visible Backpack slots**. The exact historical implementation/source for the older sketch is not currently pinned; treat that as `SOURCE_REQUIRED` evidence, not as an implementation blocker or an excuse to pretend old code exists.
>
> Implement the new inventory contract under Player Journey: typed item refs, quantities only where the item allows stacking, explicit add/remove/use events and 20 visible carry slots.
>
> Cards normally belong to the Almanac collection, not one backpack slot per card. Gifts that are cards route to collection; physical/usable gifts may route to inventory.
>
> First UI is a Backpack affordance opening a readable 20-slot overlay; preserve the same state across Walk/Drive/Combat mode switches.

---

## META-POP-01 · Universal POP account

**Executor:** ChatGPT Web  
**Outcome:** one cross-mode POP balance instead of local counters.

> @GitHub
> Read KFB Production Architecture v3 → M4, accepted META-JOURNEY-01 and Travel `collect-hud.js` Pop behavior.
>
> Move durable POP ownership into Player Journey. Keep existing game-specific pop animations/anchors as presentation adapters only.
>
> Prove at least three event sources, e.g. Travel/Card pickup, Race reward/stunt and Combat or Town reward, all emitting `pop.award` into one durable balance. Export/reload must retain the same account.
>
> POP remains KFB progression/reaction currency; do not reinterpret it as a truth/plausibility score.

---

## META-RADIO-01 · Collected songs + cross-mode Radio

**Executor:** ChatGPT Web  
**Outcome:** one collected music library/media state reused across modes.

> @GitHub
> Read KFB Production Architecture v3 → M5, accepted META-JOURNEY-01, AUDIO-AUDITION-01 and current Race/Jukebox/Radio donors.
>
> Add source-backed song unlock/collection refs, active track, playback state and volume/preferences to the Player Meta/media contract. Reuse the current large-control Radio direction where it remains useful.
>
> Prove a track unlocked in one context remains available in Walk and Drive after a mode switch and after export/import.
>
> Radio owns music/media playback state only. It does not replace game SFX event/audio ownership.

---

## META-NAV-01 · Context navigation providers

**Executor:** ChatGPT Web  
**Outcome:** real minimaps/navigation only where a real provider exists.

> @GitHub
> Read KFB Production Architecture v3 → M6, current Race actual-route minimap donor and current World/Travel mode data owners.
>
> Define a thin navigation-provider contract. Prove at least:
> - Race provider = actual calculated route;
> - World/OSM provider = current real zone/world data.
>
> HUD consumes the active provider. No provider means no minimap.
>
> Do not force a minimap into the immersive Fractal Almanac chamber; its historical experience intentionally uses spatial disorientation rather than a dashboard compass.

---

## UI-GRAMMAR-01 · Authoring icon/interaction legibility

**Executor:** ChatGPT Web + bounded Claude Design visual pass  
**Outcome:** current ToolBox/WorldBuilder editor becomes recognizable without moving its functionality.

> @GitHub
> Read KFB Production Architecture v3 → M8/M9, the accepted shared `edit-layer.js` and current Resident inline object menu.
>
> Preserve all editor behavior. This job changes presentation/interaction only.
>
> Current measured donor is too small: 28×28 px buttons, 13 px glyphs, symbols `✥ ⟳ ⤢ ⬓ ⊹ ✕`. Georg reports learning position rather than recognizing meaning.
>
> Build one coherent authoring icon grammar for Move / Rotate / Scale / Drop / Axis-Space / Close with:
> - normal inline target around 40–44 px;
> - visible icon around 20–24 px;
> - strong active-mode state;
> - tooltip = action + shortcut;
> - optional labels in learning/expanded mode;
> - same semantics in ToolBox and WorldBuilder.
>
> Search/reuse existing KFB icon/source conventions first. Do not introduce a generic permanent top toolbar or generic app chrome. Keep the controls local to the selected object and out of the main field of view when idle.
>
> Directly compare current vs revised inline editor on a real selectable scene object.

---

## META-PROD-01 · Cross-mode Player Meta milestone

**Executor:** Web integration + GitHub Bridge  
**Outcome:** one player identity survives real mode changes.

> @GitHub
> Start from accepted/current META-JOURNEY-01, META-HUD-01, META-ALMANAC-01, META-INVENTORY-01, META-POP-01 and META-RADIO-01 plus real mode adapters.
>
> Deliver one coherent loop:
> import Journey → WALK shows Almanac/POP/Backpack → collect a real Card Zone card → Almanac updates → enter vehicle → DRIVE adds Tacho + real route minimap → earn POP → enter Combat → same account persists → receive NPC gift → correct collection/inventory changes → unlock/play a Radio track → export → fresh reload/import → state restored.
>
> Review whether this feels like one KFB player identity across modes. Do not split this into one human gate per HUD widget.

---

# P2 · Skills / Runtime Contracts consolidation jobs

## SKILLS-CENSUS-01 · Repository-native Skills Census

**Executor:** ChatGPT Web / GitHub agent  
**Priority:** P2 · may run in parallel  
**Outcome:** classify the current `skills/` tree without moving or deleting anything.

> @GitHub
> Read KFB Production Architecture v3 and `SKILLS_RUNTIME_CONSOLIDATION_2026-09-24.md`.
>
> Run **SKILLS-CENSUS-01** against current `georg-doc/kayfabizarro@main`.
>
> Scope:
> - all top-level files/folders under `skills/`;
> - `skills/KFB PetStudio/` only to identify live donors/current consumers, not to rewrite its history;
> - `skills/kfb-embed-bundle/` and `skills/kfb-embed-bundle v3/`;
> - current ToolBox actor/embed/runtime owners;
> - current Card/PDF/Ink owners;
> - imports/links/references from active tools/apps.
>
> Classify every relevant entry as exactly one of:
> `CURRENT_CANON · CURRENT_RUNTIME_ENTRY · CURRENT_COMPAT_ADAPTER · LEGACY_COMPAT_REQUIRED · SUPERSEDED_REDIRECT · HISTORICAL_REFERENCE · MISPLACED_ASSET · SOURCE_REQUIRED`.
>
> Produce:
> 1. `SKILLS_RUNTIME_CENSUS.json`
> 2. `SKILLS_MIGRATION_MAP.md`
> 3. `SKILLS_CONSUMER_IMPORT_SCAN.json`
>
> Required explicit comparisons:
> - old `EMBED_CUBE_PET_FULL_v2.2.md` vs current `kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md`;
> - canonical 24-CubePet stack vs FrizzleBob Driver Graft vs GothGirl/native KayKit vs CapsuleCarl/Wissens-Pilli;
> - stale `SOT_REGISTRY.md` vs current runtime owners;
> - CardBuilder/PDF SSOT vs Deck Viewer v4 / `kfb-corpus.js`;
> - Ink v1/v2/docs/runtime copies;
> - bubble/voice/viseme/material-zone donors;
> - binary GLBs currently sitting directly under `skills/`.
>
> For every entry record current owner, current replacement, known consumers/imports and `safeToMove/safeToDelete`. Both safety flags default false.
>
> **Do not edit, move, rename, archive or delete any existing skill/runtime file in this job.** This is a census only. Do not use Work or Cloudflare.

---

## SKILLS-CURRENT-01 · Current Runtime Skill Shelf

**Executor:** ChatGPT Web / GitHub Bridge  
**Priority:** P2  
**Outcome:** a small current skill shelf routes new chats to live runtime owners while old apps still work.

> @GitHub
> Start only from accepted/current SKILLS-CENSUS-01 outputs.
>
> Build **SKILLS-CURRENT-01** as routing/contracts, not as new implementations.
>
> Establish/update current entrypoints for:
> 1. KFB Actor Embed / Actor Platform with family dispatch;
> 2. PDF/Card Corpus + Viewer;
> 3. CardBuilder;
> 4. Ink Canon + adapter registry;
> 5. Talk / Viseme / Speech+Thought Bubbles;
> 6. Material Surface / zone Color+Texture;
> 7. Motion/Animation;
> 8. current production/session skills.
>
> Actor dispatch must preserve the real owners:
> - 24 CubePets → canonical CubePet stack;
> - FrizzleBob Driver → current Graft mount/profile;
> - CapsuleCarl/Wissens-Pilli → current Carl mount, texclean and red mouth set;
> - GothGirl/native Rig_Medium/Large/Legacy → current FaceHost/EyeRig/profile adapters where admitted.
>
> Do not reconstruct face/eyes/mouth in the skill docs.
>
> Reconcile or supersede the stale `skills/SOT_REGISTRY.md` with one current versioned registry.
>
> Existing paths with live legacy consumers remain byte/runtime compatible; add concise compatibility/supersession routing rather than breaking imports.

---

## SKILLS-ARCHIVE-01 · Compatibility-safe Skills Archive

**Executor:** GitHub Web / repository-native checks  
**Priority:** P2  
**Outcome:** reduce accidental legacy reuse without breaking old apps.

> @GitHub
> Read accepted SKILLS-CENSUS-01 and SKILLS-CURRENT-01.
>
> Perform **SKILLS-ARCHIVE-01** only for entries with verified consumer/import status.
>
> Rules:
> - active old consumer → leave path in place and mark/reroute for new work;
> - zero-consumer useful history → archive/move with clear replacement reference;
> - binary/misplaced asset → reconcile with Asset Librarian/media canonical path before moving;
> - deletion requires a separate explicit cleanup gate;
> - never modify an old app merely so an archive operation can succeed.
>
> Return exact moved/untouched paths and consumer evidence. No broad tree cleanup on trust.

---

## CARD-VIEWER-CORE-01 · Unified PDF / Card Viewer Runtime

**Executor:** ChatGPT Web  
**Priority:** P2 after Skills Census  
**Outcome:** one performant PDF/card content service and viewer layer for Almanac, Card Zones, Billboards and Story/CardRig consumers.

> @GitHub
> Read KFB Production Architecture v3, accepted SKILLS-CENSUS-01, current `SSOT_KFB_CardBuilder_PDF.md`, `kfb-card-builder.js`, Deck Viewer v4 and `deckviewer/kfb-corpus.js`.
>
> Do not build a new PDF renderer from scratch.
>
> Consolidate/reuse four layers:
> - PDF Corpus/cache service from the Viewer donor;
> - KFB card-grid resolver using registry metadata/default/auto-detection rather than per-consumer crop math;
> - canonical CardBuilder for card surfaces/3D cards;
> - viewer presentation modes/transitions from the productive Viewer v4 family.
>
> Required consumer API should cover at least:
> page image · card canvas · deck/contact sheet · selected card/deck metadata · current Viewer mode.
>
> Preserve productive views such as Reader / Gallery / Stack / Coverflow / Full View / Deck where they remain useful. The Fractal Almanac may wrap these with Journey/Hero-shot/replay context; that context does not enter the PDF service.
>
> Important: KFB PDFs are conceptually four cards/page but blind exact-quarter crop is not a universal truth. Resolve known per-deck layout through registry metadata and make fallback/auto-detection explicit.
>
> Prove the same underlying card/page output in at least Almanac + Card Zone or Billboard consumers. No duplicate pdf.js workers/caches per consumer.

---

## INK-3D-ADAPTER-01 · Canonical Ink → World/3D adapters

**Executor:** ChatGPT Web  
**Priority:** P2 after Skills Current Ink lock  
**Outcome:** translate one Ink canon into surface and physical 3D lines without wireframe/double-grid regressions.

> @GitHub
> Read KFB Production Architecture v3, current `SSOT_Card_Ink_Outline_v2.md`, `kfb-ink-canon.js` and accepted SKILLS-CURRENT-01 Ink entrypoint.
>
> Do not create another Ink family because Georg says “ring”. The current implementation family `band` already means the continuous closed ribbon/ring: one contour, variable feather/taper, one fill.
>
> Build thin adapters from that semantic boundary:
> 1. surface ribbon/decal for shoreline/map/road/track boundaries;
> 2. tube/rope extrusion for physical lines such as wrestling-ring ropes;
> 3. flat/extruded Card outer-silhouette adapter.
>
> The Card proof must show black outer flat edges without outlining every triangle and without doubled front/back grids.
>
> No screen-space wireframe, no per-triangle outline and no stitched independent line pieces. Compare directly against the canonical 2D card contour in the same review.


---

# Character / Resident production jobs

## RESIDENT-BAND-MODULE-01 · Baseplate-free KayfaBizarros Resident Scene

**Executor:** ChatGPT Web / Resident Atlas / ToolBox  
**Outcome:** one reusable Orc-band scene that can be dropped into Tavern, Town, street or WorldBuilder without a mandatory platform.

> @GitHub
> Read KFB Production Architecture v3, CHARACTER_RESIDENT_PRODUCTION_WORKFLOW_2026-09-24.md, current Resident Atlas S7 and current Orc Band PR #195.
>
> Build RESIDENT-BAND-MODULE-01 in the browser authoring lane.
>
> Reuse:
> - accepted Legacy Orc B leader;
> - accepted Orc Raider guitarist;
> - real Orc Brute;
> - exact Wardrum and sticks;
> - current signature song ref;
> - existing Motion Library actions.
>
> Do not rebuild the characters or bake the whole vignette into one stage GLB.
>
> The module must be baseplate-free. Store local actors/props/attachments/action refs/pose patches/songRef/BPM/phase/anchors so a host can drop it onto any real support surface.
>
> For the drummer, pause the closest current action at a useful strike frame and let Georg use the existing puppet/bone/prop controls to make the desired visual contact pose. Save that as a Studio patch/reference pose.
>
> If one constant correction remains visually acceptable through playback, keep it as the Resident patch. If it does not, flag the exact time-varying delta for POSE-TO-BLENDER-01; do not launch another automatic arm-to-drum solver.
>
> Review one coherent band scene with Play/Pause/song sync and the ability to move the entire module as one root.

---

## POSE-TO-BLENDER-01 · Browser Pose → Blender Action handoff

**Executor:** Resident Atlas / ToolBox + Blender MCP  
**Outcome:** Georg authors the desired pose in browser; Blender uses it only as a target for time-based animation work.

> @GitHub @Blender
> Read KFB Production Architecture v3 → Character/Resident workflow, Resident Atlas S7 Studio Patch behavior and Blender animation proof PR #192.
>
> Prove one complete handoff:
> 1. choose one real actor + prop;
> 2. create a visually accepted pose/contact in Resident Atlas/ToolBox;
> 3. export the Studio Patch / target-pose data;
> 4. map that target onto the same actor skeleton in Blender;
> 5. author or adjust only the necessary time-based bone curves around that target;
> 6. bake/export one reusable GLB Action;
> 7. load that Action back in the browser with the same prop/scene and compare it against the target.
>
> First preferred fixture: Orc Brute + Wardrum/sticks, unless another currently needed fixture gives a cleaner proof.
>
> Georg should not need to manipulate Blender bones manually. Blender MCP is the execution layer after the browser pose has communicated the design intent.
>
> Do not alter EyeRig/face ownership and do not turn the Resident Studio patch into a second animation format.

---

## BLENDER-ACTOR-FAMILY-01 · Frizzle-Orc Medium / Large / Legacy derivatives

**Executor:** Blender MCP  
**Outcome:** one visible identity proven across three existing KFB rig families without replacing their skeletons.

> @GitHub @Dropbox @Blender
> Read KFB Production Architecture v3 → Character/Resident workflow and current Actor Platform / family contracts.
>
> HOLD until exact sources are pinned for:
> - Frizzle-Orc 3 / Rig-Warp source;
> - chosen Rig_Medium body;
> - chosen Rig_Large body;
> - chosen Rig_Legacy/template body;
> - blank/template head;
> - requested head accessories.
>
> Once pinned, show every source object in isolation before integration.
>
> Build three derivatives while preserving destination rigs:
> - Frizzle-Orc Medium stays Rig_Medium;
> - Frizzle-Orc Large stays Rig_Large;
> - Frizzle-Orc Legacy stays Rig_Legacy.
>
> Prefer a head/identity graft onto the existing destination rig over warping one whole skeleton into another. Use rigid head attachment where sufficient; skin only what actually must deform.
>
> Do not bake eyes. Export clean FaceHost/EyeRig anchor facts for ToolBox/runtime.
>
> Return one GLB per family plus provenance, rig-family declaration, material refs, head/face anchors and compatible motion-library info. Then review all three side by side in the ToolBox.

---

## BLENDER-MOTION-02 · One named missing high-value motion

**Executor:** Blender MCP  
**Outcome:** one actually missing march/combat/performance action enters the shared Motion Library.

> @GitHub @Dropbox @Blender
> Do not start from a generic request like “more animations”.
>
> First name the concrete missing action and real consumer. Examples:
> - rifle/musket march;
> - one missing combat attack;
> - one band/performance action.
>
> Search the current 33-action Motion Library and native KayKit clips first.
>
> If the action already exists, stop and route to browser authoring/choreography.
>
> If missing, use the established Mixamo/Blender intake:
> raw FBX stays in Dropbox; exact-transfer if the KayKit skeleton is preserved; retarget only measured exceptions; bake to the correct KFB rig; export one reusable Action/catalogue entry/contact sheet.
>
> No new batch unless multiple named consumers genuinely require the same new source set.

---

## LEGACY-CUSTOM-ACTOR-01 · One custom Legacy derivative

**Executor:** Blender MCP + ToolBox  
**Outcome:** extend Legacy only where current modular assembly cannot represent the requested actor.

> @GitHub @Blender
> Read current Legacy readiness / Resident Atlas / Character workflow.
>
> Do not rerig the existing Legacy roster. Rig_Legacy and its native animations remain the owner.
>
> Start only after a concrete custom actor is selected.
>
> Prove whether the actor can be assembled in browser from current Legacy body/head/arm parts. If yes, stop and use the existing assembler.
>
> Blender is allowed only if the requested visible identity requires a new graft/mesh/weight derivative or a selected external motion cannot be represented by current Rig_Legacy clips.
>
> Export one source-backed derivative and return it to ToolBox/Resident Atlas for EyeRig, pose, prop fit and scene authoring.
