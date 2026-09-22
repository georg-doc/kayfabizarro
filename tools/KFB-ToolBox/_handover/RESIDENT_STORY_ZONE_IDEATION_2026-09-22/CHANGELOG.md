# Resident Story Zones · CHANGELOG

Additive history. Do not rewrite prior entries to erase superseded ideas.

## 2026-09-22 · Initial ideation capture

### USER DIRECTION
- Preserve an ongoing NPC/Resident + ChatterBox + World Builder brainstorming thread in GitHub so chat failure does not lose it.
- Author reusable scenes ranging from one Resident with a few props to complex animated dioramas.
- Use the existing in-scene 3D editor and live asset search.
- Support nested editing from EyeRig / face / graft / actor up through scene groups and world modules.
- Allow authored activities, paths and local interactions such as blacksmith/miner loops.
- Make these modules placeable into the larger world/Hex authoring system.

### PROPOSAL
- Introduced **Story Zone** as a working term for a reusable non-destructive scene composition.
- Proposed one hierarchical authoring grammar:
  `EyeRig → Face → Head/Graft → Resident → Activity → Scene → Story Zone → World placement`.
- Story Zone sits above existing asset/profile/activity owners and below the receiving world/runtime owner.
- Proposed local-coordinate composition plus future host Surface Adapter mount.
- Proposed Activity / Beat Graphs before any general autonomous NPC AI.
- Proposed a Zone Context Packet for situated ChatterBox calls.
- Proposed **Park Bench micro-scene** as the smallest first implementation fixture and **Forge micro-story** as the second.

### SOURCE ALIGNMENT
Confirmed this concept must reuse rather than replace:
- Resident Atlas;
- Resident Scene Module seam;
- shared `kfb.scene-patch.v1` editor;
- Asset Registry / Librarian;
- ChatterBox donors;
- current World Building / Surface Adapter preflight;
- existing Motion/Animation/EyeRig/face owners.

### IMPLEMENTATION STATUS
Documentation only. No runtime change, browser test, Stage deployment or public verification.


## 2026-09-22 · Activity Stations extension

### PROPOSAL
- Add **Activity Stations** as object/place-side affordances: bench seat, anvil work target, mine entry, pickup/dropoff, conversation and SFX/VFX anchors.
- Bind Residents through capability/activity adapters instead of scripting character-specific coordinates/clips into every scene.
- Allow Story Zones to use either a concrete cast or reusable role slots such as `role.blacksmith` / `role.miner`.
- Add semantic sockets/anchors for drag-and-drop authoring.
- Prefer breadcrumb scope navigation for nested editing so the scene remains visually dominant.


## 2026-09-22 · Lore Keeper first fixture + Kayfabe social loop

### USER DIRECTION
- **Lore Keeper** replaces Park Bench as the first concrete Story Zone proof.
- Build a portable open-air study/archive nook around the existing Lore Keeper, writing lectern, books/RPG props, optional bookshelf and backpack.
- Grow activity in stages: LK-L1 study/read/think; LK-L2 Desk ↔ Shelf; LK-L3 local book/Card POI discovery and archive loop.
- Avoid spending the first gate on pencil-scale hand alignment or a full enclosed library.
- NPC social life remains chill & fun / best-buddy by default, while permitting intense banter, provocation, arguments and optional cartoon/Kayfabe fights.
- After social combat, visible relational repair is part of the encounter: help-up, laugh, shared activity/drink, friendly boast or amicable separation.
- Destruction/rebuilding can use the same cartoon worldview where suitable: damage creates play/work and some Residents may enjoy having something to rebuild.

### PROPOSAL
- Keep **Bond / familiarity**, **temporary Kayfabe Heat**, **topic stance** and **current scene context** separate instead of one friend/enemy score.
- Add a reusable social encounter grammar:
  `MEET → BANTER → TEASE/COUNTER → optional PROVOKE/CHALLENGE → optional KAYFABE_SCRAP → REPAIR → RESUME`.
- ChatterBox may emit semantic social cues but cannot start Combat or write damage.
- A future `KAYFABE_SCRAP` mode would be a bounded, non-hostile social-combat request consumed by the existing Combat/Melee owner.
- Lean Memory stores compact social event receipts and actual knowledge paths, not full transcripts or omniscient NPC knowledge.
- Cards may become remembered social topics without turning opinions into personality/ideology scores.
- The satire should be shown through behaviour rather than explained: fierce disagreement / absurd escalation / immediate friendship repair.

### CORRECTION
- Park Bench remains a useful later regression/minimal fixture but is no longer the first Story Zone implementation candidate.

### IMPLEMENTATION STATUS
Documentation/ideation only. No NPC AI, ChatterBox runtime, Melee integration, Story Zone runtime or public Stage result was built in this checkpoint.
