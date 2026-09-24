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
