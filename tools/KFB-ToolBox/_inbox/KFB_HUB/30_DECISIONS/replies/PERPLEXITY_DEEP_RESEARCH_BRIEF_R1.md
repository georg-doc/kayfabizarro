# Perplexity Deep Research · KFB blind spots · R1 · 30.10.2026
Run each block as its own query, with the shared context on top. Save each answer as Markdown.

## Shared context (paste first)
I build a stylized open-world browser game: three.js r180, React Three Fiber, Rapier physics, WebGL2, procedural terrain in 192–256 m cells, wave-function-collapse placement, KayKit/Quaternius/Kenney low-poly kits, claymation look, one light rig, third-person camera, target a recent Mac in the browser at 60 fps. The player collects cards and talks to NPCs; buildings are card containers that can be shot open and healed; destruction is chill and fun, not realistic. Work is done by AI coding agents without an artist on staff.
Do not give generic advice. For every finding give: the primary source link (talk, repo, paper, official docs), date, license if code or assets, whether it runs in three.js/WebGL2 today, rough effort, and one sentence on what exactly to adopt. Prefer shipped games, GDC/SIGGRAPH talks, working repos and live demos. Mark anything you could not verify. End with a ranked top 5 and a list of what to avoid and why.

## 1 · Stylized building destruction in real time
How do shipped stylized games make walls break convincingly at low cost? Compare shader hole masks with burnt edges, decals, pre-fractured chunks, cell/voxel approaches and runtime mesh cutting. Cover staged damage (scratches, dents, holes, exposed structure), wall thickness on simple boxes, hit-direction debris, vehicle ramming versus projectile versus area damage. Include three.js or WebGL demos and repos.

## 2 · Stylized VFX for weapons, explosions and smoke
Production pipelines for cartoon or hand-drawn looking effects in games: flipbooks, mesh-based stylized smoke, shader-driven flames, anticipation and timing, effect budgets. Include talks from Riot, Blizzard or similar, three.js particle libraries (for example three.quarks) with benchmarks, and how to make 2D cel sprites sit in a clay/3D scene. Also: how to budget and prioritize smoke by gameplay state.

## 3 · Mass collectibles and debris in the browser
Showing hundreds or thousands of balls that spill, roll and settle on uneven terrain at 60 fps: hybrid of a few physics bodies plus instanced or GPU particles, height-field collision in shaders, flow fields downhill, sleeping and merging into piles. Include repos, benchmarks and Rapier limits in WASM.

## 4 · Procedural stylized city blocks on terrain
Turning OpenStreetMap footprints into simplified blocks, and placing sidewalks, curbs, stairs and ramps with socket-based WFC without overlaps at narrow spots. One continuous world-space shader surface across many buildings without repetition. Streaming, LOD and draw-call limits for this in the browser. Include repos, papers and demos.

## 5 · Secondary motion and locomotion across many rigs
Runtime capes, ears and cloth as spring-bone chains (for example VRM spring bones) in three.js, stretch at high speed, flight poses, banking from physics rather than clips, board or surf riding. Reusing clips across rig families, retargeting, and detecting missing clips automatically. Attaching weapons to characters with no hands. Include repos and demos.

## 6 · Contextual HUD for action-adventure games
Information architecture for a small HUD with few fixed zones whose contents change by mode (walk, fly, drive, talk), primary/secondary weapon with radial or fan selection, always-on music controls. Case studies from shipped games, readability over busy colorful worlds, and tactile clay or toy-like UI examples.

## 7 · Game design: cards as knowledge, NPCs that disagree
Games where collecting or carrying information changes NPC talk and relationships: gossip and rumor systems, watch-or-intervene encounters, emergent social comedy without a moral score. Look at Crusader Kings, Citizen Sleeper, Disco Elysium, Shadows of Doubt, Wildermyth, Monkey Island dialogue, and others you find. What is cheap to build with data and short written lines, and what fails?

## 8 · Keeping AI-built visuals on target
How do small teams or AI-agent pipelines keep art direction consistent without an artist: automated visual regression in three.js, screenshot gates, critic models and their failure modes, style-reference retrieval, reference-first workflows. What measurably worked, what is hype? Include tools, repos and written case studies.
