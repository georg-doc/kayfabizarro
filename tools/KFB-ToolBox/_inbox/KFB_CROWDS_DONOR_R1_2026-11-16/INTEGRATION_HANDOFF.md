# CURRENT DELIVERY ADDENDUM

Root also admitted the exact CC0 original mannequin GLB to original/public/models/mannequin.glb, verified Git blob a614ee67e985fd510dbfb1374b08c6309eb17acd. The initial code-only export history below is retained. All other binary art is excluded. Current Racer host Rapier is0.19.2; source crowd has no Rapier dependency. No gameplay/contact adapter or ragdoll implementation is claimed.

# Crowds and navigation → KFB / Claude Design · donor intake R1

Exact original https://patch.gg/patch/crowds (not CrowdBricks or another crowd-named library). API /repo supplied actual clone_url https://git.patch.gg/patch/crowds.git, open MIT code / CC0 art, HEAD35ca0a412c8b96024517124db6cbce7d90393ecc,1.0.5. Existing-source intake created ONE central mirror ~/.codex/mirrors/patch--crowds.git with --mirror --filter=blob:none; Patch server ignored filtering, recorded once; no fallback clone / global installation.

## Licences and source closure

Keep root LICENSE / CREDITS.txt / LICENCE-NOTES.md and third-party/LICENSE-recastnavigation.txt(zlib©2009MikkoMononen), LICENSE-recast-navigation-js.txt(MIT©2025IsaacMason). Patch wrapper / source MIT©2026Patch. Three MIT; source demo N8AO / postprocessing are not dependencies of reusable modules. No audio.

Minimal navigation closure: src/navigation.js + src/crowd.js. Both import only recast-navigation0.44.0; navigation also @recast-navigation/three0.44.0. Optional src/walker.js is dependency-free glue around host AnimationMixer. Optional src/figures.js imports three0.186.1 and BufferGeometryUtils; requires the actual source mannequinGLB. No reusablefile imports demo.js/levels.js. The latter remain source references, not a KFB replacement level/renderer. Single-threaded Recast WASM needs no special multithreaded COOP / COEP hosting, but bundle actual package WASM for offline / self-contained delivery.

Source-lock records17 original text files141249B. Codeonly packet omits binary art. REFERENCE_ASSET.json independently records actual public/models/mannequin.glb:270300B,blob a614ee67e985fd510dbfb1374b08c6309eb17acd,SHA2560edd01b2d8f6c3e071c0569aacd40e56efd643214d607604e726553f5cd3ac88. Local reference bytes prepared separately at /private/tmp/kfb-crowds-reference-mannequin.glb, not part of code-only original/. Existing central mirror retains exact object for later authorised source asset admission. No unrelated dummy substitution.

## Actual dummy identity

Patch's1.8m jointed scale / test dummy, about2800tri,rigid shells on each bone; no skin, NO physical ragdoll. Source mannequin/README.md andCC0figure.py/build.blender.py document construction. Humanoid bones Hips / Head / limbs;17 instanced draws. idle/talk/fold/walk/jog/sprint clips retargeted from Quaternius Universal Animation Library 1 / 2 CC0. Source Patch mark on left chest is original identity, not KFB branding. Source-isolate actual dummy before any KFB adaptation. Buildingkitbinary art/fonts/thumbnails excluded.

## Reusable API

await initNavigation();
nav=new Navigation(hostWalkMeshes,{agentRadius:.35,agentHeight:1.9,stepHeight:.5,maxSlope:46,cellSize:.2,cellHeight:.1,tileSize:32,maxObstacles:48});
crowd=new CrowdSystem(nav,{home:nav.closest(point),maxAgents:200,radius:.36,height:1.8,speed:3,stroll:1.05,spacing:2,wander:true,range:40});
crowd.resize(n);crowd.goTo(point,{members,hurry,spread});follow(point|null);send(member,point,hurry);scatter();setSpeed();setSpacing();stand(member);shove(position,halfwidth,halfdepth);
Host loop: nav.update();crowd.update(dt); read members{x,y,z,vx,vz,speed,state,goal,agent}. Source uses agent.position(), not interpolatedPosition, and clamps crowd step dt <= 1/20 to avoid a known agent display stall. nav.closest/randomAround/path; block(position,halfWidth,halfDepth,height,yaw)->obstacle;unblock();destroy(). CrowdSystem.destroy cleans Detour crowd.
Walker(new host AnimationMixer,{idle,walk,run},{walkSpeed,runSpeed,faceOffset}).update(member,dt) supplies yaw and clip weights; host positions model.
CrowdFigures(gltf,max) exposesmeshes,place(members),update(members,dt); no extra scene / renderer / frame loop. Its internal show position smooths by exponential lag and randomises phase / shade / size; account for contact pose / seed when adapting. Source uses Math.random, not fully deterministic.

## Same Patch Car / KFB kinetics seam · PROPOSAL, not supplied implementation

No Rapier dependency, rigid body, physical joints or contact solver exists in this donor. Detour crowd steers / avoids on a navmesh; itdoesNOT automatically receive car impulse. Do NOT label crowd avoidance as car collision physics.

A future bounded adapter must use the existing host Rapier 0.19.2 world, fixed step and contact pipeline, with ONE position writer per membership mode:

1. **WALK:** Detour plans the goal / velocity. The host actor adapter updates one near-field kinematic capsule at the correct fixed step. One canonical actor ID maps the agent, render instance and collider. Keep navigation bounded by the existing streamed world; do not rebuild the endless world every frame.
2. **IMPACT:** An actual host contact criterion transfers the actor from Detour locomotion to a dynamic root body in THE SAME Rapier world. Pause or remove its Detour agent through an explicit adapter: the donor has no per-member pause API. Neither navigation nor the renderer may snap a dynamic body back to its goal. Animation is a visual reaction; rendering follows the interpolated authoritative body. A root-body impact is NOT a jointed ragdoll. Physical limb joints require an existing KFB ragdoll owner and a separate contract.
3. **RECOVER:** Once host criteria allow, find a valid reachable ground point and explicitly transfer body state back to an agent, teleport that agent and restore walking. One owner handles lifecycle and all resources. Far crowds may remain navigation / render only; do not spawn 100 dynamic bodies by default.

Nav block / unblock handles discrete landed or stationary obstacles by rebuilding tiles. Do not recut tiles every frame for a moving car. Car proximity avoidance and actual contact require a bounded host adapter; they are not native donor features. Nav input excludes roofs, treetops and unreachable building interiors. Authoritative terrain / Track Core remain geometry and contact owners; navigation consumes their geometry.

## Claude Design / next proof

Use the actual source dummy unchanged in isolation, then apply existing KFB material / deformer policy or canonical characters when requested. Preserve clips and source identity. Generic capsule visuals do not prove original mannequin use.

First receiving proof: only 3–5 dummies walk around one existing building, share a destination, then one actual Patch Car contact transfers to impact physics and settles / recovers. Check pause / reset, one Rapier world, no extra world step and no NaNs. Measure larger groups afterwards. These are FUTURE acceptance checks, not performed results.

## Checks actually run

Original API / README / LICENSE / notices were read; exact central mirror HEAD verified; 17 original text files (141249 bytes) SHA / blob locked; all six src JS syntax checks passed; import closure inspected. No WASM initialisation, navigation build, browser render, collision coupling, ragdoll or FPS acceptance was performed. No GitHub write, production file change or publication. Donor README performance numbers are not KFB benchmarks.
