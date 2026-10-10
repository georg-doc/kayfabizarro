# KFB KayKit Platformer / Prototype Bits / Block Bits · Island-Making Donor Review v1
Date: 2026-10-11 · Status: GEORG AUTHOR POST-MVP CONCEPT + GITHUB/PUBLISHER SOURCE AUDIT; NO RUNTIME, NO VISUAL SOURCE-ISOLATION ACCEPTANCE.
Owner: existing KFB Island Worldbuilder / Minigame-Fluff / Town and source asset consumers; branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`.
Router: `skills/chat/KFB_ISLAND_RESIDENT_DESIGN_ROUTER_CLAUDE_CODE_BRIEF_2026-10-11.md`.
Current authority: `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` and `skills/chat/CLAUDE_DESIGN_FOUR_ISLAND_STORY_VISION_R1_2026-10-08.md` on main. R4 STOP/NO MVP; current visual-only A/B/FAIL.

## 1 · Georg's artistic opportunity
Three existing KayKit asset families offer different **spatial and playable roles** for individual island/venue concepts:
- **Platformer** = movement, readable hazards and obstacle structures; useful for small elective stage challenges and elevated maker circulation.
- **Prototype Bits** = studio/workshop/factory/target props, physically legible processes, cargo/production staging, reusable greybox material.
- **Block Bits** = deliberately assembled, toy/Minecraft-like block construction; potentially in Maker Space, Protopia, selected Utopia storage/industrial scenes and other playful architecture.
These are **distinct donors**, not a mandate that all islands use a common block-grid skin, instant terrain editor, factory engine or universal platformer gameplay.
Source appearance and source-kit construction must be demonstrated **in isolation** before composition or any visual KEEP/ADAPT judgement. Registered GLTF means source present, not measured acceptance.

## 2 · Publisher evidence, license and tiers
Publisher links supplied by Georg:
- `https://kaylousberg.itch.io/kaykit-platformer`: **KayKit Platformer Pack**, 120+ unique FREE pieces and 170+ with EXTRA; floors, ramps, pipes, barriers, goals, switches, pick-ups, obstacles. **Conveyor belts, hammer/spike traps, sawblades, bumpers and cannon are EXTRAs**, not assumed FREE models. CC0 and GLTF/FBX/OBJ per publisher.
- `https://kaylousberg.itch.io/prototype-bits`: 64+ unique FREE models; EXTRA adds 12 assets and an animated character; current compatible character set per publisher. CC0.
- `https://www.patreon.com/kaylousberg/posts/block-bits-124209731?collection=1383029` is Georg's Patreon source reference, but that deep page was not reliably retrievable in this audit. Independent official `https://kaylousberg.itch.io/block-bits` confirms **32+ FREE modular voxel/block props**, 16+ EXTRA pieces, CC0. An island idea named 'Unity' does **not** imply moving KFB to the Unity game engine: these 3D kits are engine-agnostic.
**DO NOT BUY**, upgrade or import a paid tier based on a screenshot alone. First audit genuine FREE/owned sources and confirm the visual/functional gap; purchase is a separate user decision.

## 3 · Precise current repository source status (not pre-2026-10-10 stale inventory)
### Block Bits: OWNED/INDEXED
`registry/assets/v1/packs/kaykit-blockbits-1-0-free.json`, root `media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/`. **40 real model-3D names**, including:
`wood`, `metal`, `glass`, `stone`, `stone_with_copper`, `stone_with_gold`, `stone_with_silver`, `bricks_A`, `bricks_B`, `dirt`, `grass`, `water`, `lava`, `tree`, `prototype`, `colored_block_blue/red/green/yellow`, `striped_block_*`.
Existing KFB WorldBuilder/Travel donor already references `grass.gltf` in `travel/wip/travel_globe_wsa/world-builder/wb0.js`. **No proof these instances implement destructible voxels, manufacturing automation or stateful placed-world persistence**.

### Prototype Bits: OWNED SOURCE / NOT INDEPENDENT REGISTRY ROOT
Exact actual owned path: `media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/`, **85 GLTF mesh files** in GitHub. Source bundle `media/3D_Assets/KayKit_Bits_Bundle1_1.1/README.md` confirms package provenance and warns textures for v1.1 should not be blindly combined with the v1.0 source.
Useful exact donor names:
`Workbench.gltf`, `Workbench_Decorated.gltf`, `Pallet_Large.gltf`, `Pallet_Small.gltf`, `Box_A.gltf`, `Box_B.gltf`, `Box_C.gltf`, `Locker.gltf`, `Barrel_A.gltf`, `Primitive_Cube.gltf`, `Primitive_Beam.gltf`, `Primitive_Wall.gltf`, `Primitive_Stairs.gltf`, `Primitive_Slope.gltf`, `Primitive_Floor_Hole.gltf`, `Door_A.gltf`, `Wall_Target.gltf`, `target_stand_A.gltf`.
Also physically present: `Character/Dummy.glb` and `Animations/gltf/Rig_Medium/` in that package.
**Important:** Prototype pack's Dummy is a separate source from KFB native `Rig_Medium/Rig_Large` mannequin families used in Combat Arena ideas; do NOT conflate counts, rig compatibility, animation acceptance or characters. Production/conveyor behavior is NOT built into a workbench mesh. There is no verified moving `conveyor_belt` asset in this FREE/owned Prototype directory.
If these donor props are reused, the Asset Librarian should first reconcile the **existing bundle path** rather than invent a second 85-asset Registry catalog/runtime or use unrelated Kenney Prototype as replacement. Older September 2026 coverage notes listing Prototype Bits 'missing' are superseded by this later real GitHub bundle listing.

### Platformer Pack 2025: OFFICIAL CONFIRMED, IDENTITY/OWNERSHIP UNRESOLVED
The KFB Registry currently has **`platformer-game-kit-dec-2021`**, actual root `media/3D_Assets/Platformer Game Kit - Dec 2021/`, plus an unrelated `glb-platformer` alien mini-pack and `kenney-platformer-kit`. **Do not call these the 2025 official KayKit Platformer Pack** without provenance comparison. Existing `tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/KAYKIT_PACK_COVERAGE_MATRIX.md` explicitly marks this `UNRESOLVED IDENTITY`. 
There is already a source-oriented reconstruction method for the **2021** pack in `skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/PLATFORMER_KIT_MENTAL_MODEL.md`; `Preview.jpg` and `Preview2.jpg` show authentic older source design. This does NOT establish ownership of the newer advertised 2025 set.
**Next source review:** confirm if actual newer pack ZIP is in Georg's connected/source holdings; if not, preserve as future acquisition/alternate design donor, not as available runtime geometry. Only then compare visual pack sample, measured module sizes, seams, support corners, colliders and asset-tier features.

## 4 · Design-fit matrix: same parts, different cultural meaning
| Current or future scene | Preferred donor play | How to read the place, not a generic tileset |
| --- | --- | --- |
| **Utopia** (one of CURRENT Four-Island A/B worlds) | Prototype workbench/pallet/crates, clean BlockBits material accents, eventual Platformer switch/production-showroom objects if source/tiers available | **Engineered prosperity and over-controlled backstage labor.** Monstrosity CEO/showroom stands against real Robot A/B maintenance, packaging, queues and Terms/Conditions. Production needs an input → action → output and on-shift worker; avoid empty sci-fi factory plaza. |
| **Protopia / Maker Space** (CURRENT world + possible Town-linked workshop role) | Actual Workbench, wood/stone/metal blocks, repair stacks, returned tools and visibly hand-made support seams | **Improvised making, learning, repair, Fluff craftsmanship and neighbor help.** Unlike Utopia's synchronized assembly, relationships/imperfections and iterative additions are the point. The same source block is reinterpreted through different acts, not recolored to claim new canon. |
| **Town XL work district** (CURRENT Town visual scene only where accepted) | Workshop/pallet/door props as source building accents; BlockBits in select civic/stage/repair areas | Actual craft/mine/market supply links and walking residents. Do not turn KFB Town into a single giant industrial park or a board-game checkerboard. |
| **Combat-Arena / zombie-prepper camp** (POST-MVP) | Prototype target stand/base, `Dummy.glb`, lockers, pallets/crates/wall targets; BlockBits as destructible-looking cover, optional source Platformer obstacles | Survivalist vs Action Figure, cartoon living Dummy and training/derby story. Destructibility, shooting, vehicle-driving reuse and scoring require existing Combat/Vehicle owners and later tests, not asset appearance. |
| **Optional jumping/mini-island micro-levels** (POST-MVP) | Authenticated Platformer FREE ramps/goal, buttons, trap props where genuinely present | Mini-story/reward route with **one readable action consequence**, not mandatory jump courses on all islands. |
| **Future Fluff fabrication / satirical conveyor** (LATER IDEA) | Static pallet/boxes/workbench first; animate sequential transfer through existing World/Actor/Motion/Interaction owner and genuine EXTRA Platformer conveyor donor only if acquired | Utopia produces approved-identical outputs at high speed; Maker Space happily rebuilds the flawed item by hand. **Visual staged conveyor != working mechanical simulation**. |

## 5 · Two strong contrasting stage sketches, later optional
**Utopia / 'Factory of Perfect Outcomes':** Robot A feeds plain cubes from a genuine stock of pallets. Robot B inspects identical products against an ever-changing Terms & Conditions sheet. Monstrosity CEO's pristine showroom stays gleaming while a side wall reveals repairs and abandoned stock. A visiting player finds every item labeled 'perfect' but cannot find a free piece of material to fix the one broken stool. **Factory is story/labor composition**, not a wall of animated stock props.
**Protopia / 'Fluff Repair Bench':** Farmer duo, visiting Alchemist or other existing proper Resident collaborates by carrying different source materials to a Workbench, arguing over a crooked bridge and actually strengthening it. One BlockBits stone/copper block tells a mining story; a cutout stage frame exposes workers' expressions. The player can later add Fluff if World/Inventory owner authorizes. Do not imply freeform voxel world edits now.
**Optional Combat Arena intersection:** an Action Figure celebrates a cinematic victory over pop-up Prototype targets while a smiling living Dummy wanders across the obstacle markings. Source mannequin/dummy visual identity and chosen rig family are an isolation/owner task.

## 6 · Brief for existing Claude Code / current visual planner
**Do now in source-led VISUAL PLANNING ONLY:**
1. Preserve current Four-Island A/B story: Town XL (natural terrain, market/social/Caveman/farm), Dystopia, Utopia (Monstrosity + Robot A/B), Protopia (Farmer duo/workshop). This document should inform **Utopia/Protopia boards in the existing A/B executor**. It does not create an R5 or a fifth world.
2. Ask Asset Librarian/ToolBox to **show original BlockBits material/blocks and actual Prototype Workbench/Pallet/Primitive** isolated against their authentic pack previews and verify the precise bundle 1.1 texture source; then compose one small test scene for Utopia and one for Protopia at actual actor scale. No loaded-URL-as-design-proof.
3. Mark official 2025 Platformer Pack as `SOURCE NOT VERIFIED IN OWNED REPO` (different from 2021 source). Do not import paid EXTRA conveyors/traps on expectation or treat game physics as part of prop mesh.
4. Visual acceptance question: **Can a blind observer distinguish Utopia as automation/authority and Protopia as communal making/repair through real actions, materials and machine/worker relationships, even without labels or dialogue?** A/B options remain same story and await Georg **A/B/FAIL**.
5. If current A/B visual owner is not ready to use this donor, park as **non-blocking later/source** suggestion; do not delay active gate. Confirm external pack license/tier separately when integration is actually authorized.

No current World/Track/Vehicle/Combat/Animation/Fluff/Deck/Almanac/Audio/Camera runtime owner is transferred. No deployment, Stage route, public host, PR/merge or purchased pack; evidence so far is **publisher text + GitHub registry/directory + source file names only, not runtime tests or rendered donor contact sheets**.
Deferred existing parent gate `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` remains; current active Four-Island Story Vision R1 → Georg A/B/FAIL.
