# KFB Combat Platformer Benchmark 01 · 2026-10-04

Status: **PLANNING READY · EXECUTION NOT STARTED**
Execution mode when started: **ONE_SHOT**
Runtime owner: **georg-doc/KFB-Combat-Arena**
Central coordination/source router: **georg-doc/kayfabizarro**
Human Stage root reserved: **https://kayfabizarro.pages.dev/kfb-hub/stage/combat/platformer-benchmark/**
Live: **UNCHANGED**

## 1 · Product outcome

Build one compact but real KFB **vertical combat-platformer** POC that combines:

- the existing Combat Arena gameplay/runtime owner;
- giant KFB Card surfaces as readable combat arenas / level anchors;
- measured KayKit Hex geometry as connecting traversal islands, steps, ledges and elevated routes;
- the proven Babel Chill & Fun traversal mechanism;
- current Rig_Medium locomotion/jump presentation;
- the Resident Atlas S17 gunfight-duel combat language;
- Blender-authored ranged poses/sockets when BLENDER-DUEL-01 returns;
- existing KFB clay VFX/contact consequences;
- current KFB audio/Jukebox/SFX ownership.

The goal is not another isolated movement lab. The player must **move, climb, jump, shoot, land, clear an encounter and reach a destination** in one continuous loop.

## 2 · Why this is a useful benchmark

This task stresses a different capability mix from the WB2 World One-Shot:

- real-time gameplay state;
- movement + collision + vertical traversal;
- animation state/warping;
- combat aiming/projectiles/hit consequences;
- level design and spatial readability;
- VFX/SFX/audio;
- multiple proven donor systems with strict owner boundaries;
- browser performance;
- integrated product judgment.

It is therefore a strong controlled comparison for Sol / Astra / Claude-family production workflows.

## 3 · Current exact source anchors

### Combat runtime owner

Repo:
`georg-doc/KFB-Combat-Arena`

Current main checked 2026-10-04:
`f6a59ad15b9ffcf3164b0ab013f223962b63f61f`

Combat main remains the runtime SSOT. Do not turn kayfabizarro donors into a second Combat engine.

Useful current Combat donor branches remain candidates, not silently merged truth:

- PR #12 · `fb40fac9d108b4719d06d47af394731edd233620` · native KayKit 1H source/contact architecture;
- PR #14 · `b795ce0ecb9d4253edac6c334d882c0c4974be12` · corrected real visible contact;
- PR #16 · `8670e39e518f833f15af70fb05dbc3c13e6ddf14` · integrated clay impact on native Jump Chop;
- PR #17 · `e391536fb8307a11ccd09dd6f0b04a7e2110542d` · ordinary Brickfish Bonk consumer proving exact 1 damage / 1 VFX / 1 SFX and deterministic miss.

These prove useful contact/consequence architecture. They do not automatically become the new benchmark base.

### Ranged-combat presentation donor

Current source:
`tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-10-04_r2/`

Read:
- `docs/RESIDENT_GUNFIGHT_DUEL_01.md`
- `docs/HANDOVER_GUNFIGHT_DUEL_01.md`
- `docs/RESIDENT_GUNFIGHT_DUEL_01/BLENDER_MCP_BRIEF.md`
- `lib/gunfight-duel-01.js`
- `data/gunfight-duel-01.json`

Georg result:
**good basis for the Combat Slice including hit effects.**

Current demonstrated language:
- Rig_Medium KayKit actors;
- blaster / rifle / minigun roles;
- muzzle flash;
- projectile;
- clay puff;
- hitstop;
- squash;
- recoil;
- dodge / hit / death choreography.

Known issue:
Blaster pose is not visually accepted.

### BLENDER-DUEL-01 · incoming

The current Blender brief requests:
- `kfb_action_aim_blaster_a`
- `kfb_action_shoot_blaster_a`
- `kfb_action_aim_rifle_a`
- `kfb_action_shoot_rifle_a`
- `kfb_action_hold_minigun_a`
- `kfb_action_fire_minigun_a`
- weapon `socket_grip_r`, `socket_grip_l`, `socket_muzzle`
- front-hit reactions.

**Do not freeze the benchmark source manifest until the Blender Return exists.**
Until then these are requested outputs, not available clips.

### Babel traversal mechanism donor

Source:
`tools/KFB-ToolBox/_inbox/KFB_HEX_ATLAS_FAILURE_HANDOFF_2026-09-20/code/KFB_Babel_Hex_Generator_v1/`

The donor already proves a useful traversal mechanism:

- measured Hex geometry;
- direct / double / far jump classes;
- target selection by facing;
- calculated assisted arc;
- automatic second impulse at apex for a planned double jump;
- bounded near-target landing magnet;
- edge protection in Chill & Fun;
- rescue to last verified safe platform.

Recorded technical result:
- 20/20 fixed seeds without unreachable steps;
- 20/20 simulated Chill & Fun start → target;
- Play fall/rescue proof.

**Typed donor scope:**
- MECHANISM = candidate KEEP;
- old generated tower composition = not a visual/content SSOT;
- old CapsuleCarl placeholder/presentation = do not import.

### Hex content/source families

Current Environment Atlas / Registry direction includes three KayKit Hex-capable families:

1. `kaykit-medieval-hexagon-pack-1-0-free`
2. `kaykit-medieval-builder-pack-1-0`
3. `media/3D_Assets/Kaykit_Medieval Snow Biome/`

The current Environment Atlas Site preparation also routes S11 / S12 / S13.2 / S14+ project lineage.

Use actual measured source pieces. Do not replace them with generic cubes or a visually similar kit.

### Cards

Combat Arena already owns its Card field/level presentation and Card Builder lineage.

For this POC:
**Cards are large stable anchor arenas. Hex geometry creates traversal topology around and between them.**

Do not create a second Card renderer/database.

### Audio

Current Audio source lane:
PR #352, current source intake branch.

Useful human-positive musical directions currently include:
- Cartoon Chase / Capers Bed;
- Cinematic / Epic-but-Playable Bed;
- current broader KFB musical palette.

Audio owner remains the shared KFB Audio/Jukebox architecture.

Do not infer that source-only stems or unreviewed SFX are production-approved.
At execution start, freeze exact current audio sources and statuses.

## 4 · Level grammar

The level has three vertical layers.

### Layer A · CARD ARENAS

Large Card surfaces are:
- spawn / teaching ground;
- readable ranged-combat spaces;
- encounter anchors;
- checkpoints / rewards.

Cards remain recognizably Cards rather than being covered by a generic floor.

### Layer B · HEX TRAVERSAL

Measured Hex assemblies form:
- steps;
- side islands;
- ramps;
- narrow bridges;
- ledges;
- elevated firing positions;
- alternate flank routes.

Use the three current KayKit Hex families deliberately.

The Hex path is not decoration around the Card. It is real navigable level geometry.

### Layer C · HIGH ROUTE / LATER FLIGHT SEAM

The first benchmark ends with a high destination Card / platform.

This provides a future seam to Card Surf / Flight, but **Flight is not required for this benchmark**.

The design should make the future continuation obvious:
Ground/Card → Hex climb → high Card → later Card Surf/Flight.

## 5 · Golden gameplay loop

A fresh run must support this continuous fixture:

1. spawn on **Card A**;
2. walk/run and acquire/ready the first ranged profile;
3. hit simple targets to prove aim/fire/projectile/VFX/SFX;
4. leave Card A through a measured Hex route;
5. perform normal jump;
6. perform one assisted long jump;
7. perform one direct or planned double-jump transition where the geometry requires it;
8. land with visible anticipation/contact/recovery presentation;
9. fight an enemy from uneven/elevated geometry;
10. reach an elevated Hex combat nest;
11. clear a compact multi-enemy ranged encounter;
12. traverse to **Card B**;
13. complete one final duel / objective;
14. receive clear completion feedback and preserve last safe platform/checkpoint.

This is the benchmark acceptance journey.

## 6 · Chill & Fun versus Game

Reuse the proven Babel concept without making it autoplay.

### CHILL & FUN

Allowed:
- coyote time;
- jump buffering;
- subtle valid-target highlight;
- bounded takeoff heading correction;
- calculated target arc when the player intentionally jumps toward a valid platform;
- bounded air steering;
- automatic second impulse only for an already planned double-jump path;
- near-contact landing magnet;
- safe rescue to the last verified platform.

Not allowed:
- teleport across a failed jump;
- invisible bridge;
- hard mid-flight snap;
- landing before actual support/contact;
- aim assist that turns combat into autoplay.

### GAME

Same authoritative geometry and movement values:
- less or no jump targeting help;
- no automatic planned second jump unless explicitly selected by design;
- fall/rescue remains as accessibility/restart policy;
- combat rules unchanged.

## 7 · Traversal animation family

Runtime movement/physics owns the trajectory and contact.
Animation owns presentation.

First consume actual current KayKit/approved clips where they fit:
- Jump_Start / TAKEOFF;
- Jump_Idle / AIRBORNE;
- Jump_Land / LAND.

For the long-jump/high-platform feel, evaluate a presentation family:

- ANTICIPATE;
- TAKEOFF_LONG;
- AIRBORNE_STRETCH / AIRBORNE_LOOP;
- LAND_SOFT;
- LAND_HARD;
- RECOVERY.

Do **not** author all of these merely because the names are useful.

First run the current source clips through the real calculated arcs.
Only visually proven gaps go back to Blender.

If Blender authors long-jump clips:
- in-place unless explicitly marked presentation travel;
- runtime remains trajectory authority;
- takeoff and contact markers exported;
- distance/time warping may adapt presentation within bounded limits;
- no clip becomes a second collision/root-motion solver.

## 8 · Combat scope

Benchmark actor:
**one Rig_Medium source-clean actor**, selected when the final source manifest freezes.

Required player combat:
- aim;
- fire;
- projectile truth;
- muzzle truth;
- hit/miss;
- damage;
- hit reaction;
- death/defeat where applicable;
- VFX;
- SFX;
- recoil;
- movement → aim → fire → movement recovery.

Preferred weapon proof order after BLENDER-DUEL-01:
1. blaster;
2. rifle;
3. minigun only if scope/performance remains healthy.

The benchmark may ship with one fully polished player weapon plus enemy weapon diversity.
It does not need three complete player weapon classes to PASS.

## 9 · Enemy / encounter scope

Use a compact readable encounter, not a horde benchmark.

Target:
- 3–5 active enemies maximum in the core proof;
- at least two ranged behaviors/weapon roles if source-clean;
- one elevated enemy;
- one dodge/hit/defeat chain;
- one encounter whose layout makes the player use the Hex traversal rather than camp on Card A.

No new global AI architecture.

## 10 · VFX / SFX / music

Reuse exact accepted/proven consequences.

Visual language may consume:
- Resident Duel muzzle/projectile/clay-puff/hitstop/squash/recoil;
- Combat semantic clay response/contact systems where compatible;
- existing pooled VFX limits.

Audio:
- one audio owner/transport;
- exact gunshot/hit/jump/land SFX only from verified current sources;
- one human-positive musical bed may score the POC;
- action intensity may layer or transition using current Audio architecture;
- source-only stems do not silently become semantic production layers.

## 11 · Performance target

This is a compact browser game, not a cinematic render.

Freeze the exact budget when the execution base is chosen.

At minimum measure:
- FPS / frame time;
- draw calls;
- active animation mixers;
- active projectiles;
- pooled VFX;
- enemy count;
- visible platform/Hex count;
- console/page/network errors.

A visually strong candidate that collapses during the multi-enemy jump/shoot encounter does not PASS.

## 12 · External Critic

Use the same independent-critic discipline now binding the WB2 One-Shot.

Critic writes no production code.

Score 0–10:

1. SOURCE_FIDELITY
2. PLATFORM_GRAMMAR / HEX_ASSEMBLY
3. TRAVERSAL_FEEL
4. JUMP_ANIMATION / CONTACT
5. COMBAT_FEEL / AIM / RESPONSE
6. VFX / SFX / AUDIO COHERENCE
7. LEVEL_READABILITY / VERTICALITY
8. KFB_VISUAL_IDENTITY
9. TECHNICAL_HEALTH / PERFORMANCE
10. ONE-SHOT_COMPLETENESS / PROCESS_DISCIPLINE

Important benchmark-specific score:
**AUTONOMOUS_CONTINUATION**
Did the executor continue through internal checkpoints, or fall back into baby-step handoffs?

## 13 · Fair model comparison

Do not compare models on different repos, donors, prompts or acceptance tests.

### Freeze before comparison

After BLENDER-DUEL-01 returns, create one frozen benchmark packet:

- exact Combat base commit;
- exact ranged animation/weapon sources;
- exact Babel mechanism donor pin;
- exact Hex family source pins;
- exact Card source;
- exact VFX/SFX/audio source statuses;
- same Golden fixture;
- same performance budget;
- same External Critic scorecard;
- same repair budget;
- same Stage/publication requirement.

Each implementation candidate starts from that same packet.

Do not let candidate B read candidate A's implementation before independent scoring.

### Suggested candidates

**A · Sol / current Work path**
- full runtime/integration One-Shot;
- measures repo synthesis, implementation, QA, critic loop and delivery.

**B · Astra**
- same frozen full One-Shot;
- strongest direct comparison to Sol for autonomous multi-system integration.

**C · Claude Coworker · optional**
- same frozen runtime outcome if repository/tool capabilities permit;
- useful third datapoint for implementation/source-discipline.

**D · Claude Design Level 5 · specialist benchmark**
Do **not** score it as if it were the same repo-integrator product.

Give it the same frozen level/content sources and ask for:
- Card + three-Hex-family vertical level composition;
- encounter staging;
- source-faithful platform assembly;
- traversal readability;
- KFB visual design;
- complete editable Session Cut.

Then rehome/integrate its accepted composition through the real Combat owner.

This specifically tests whether Claude Design can now avoid the historical platform-kit composition failure when source isolation and measured grammar are explicit.

## 14 · Benchmark branches and Stage routes · proposal

Do not create these until the source packet is frozen.

Suggested Combat branches:

- `benchmark/combat-platformer-sol-2026-10-04`
- `benchmark/combat-platformer-astra-2026-10-04`
- `benchmark/combat-platformer-coworker-2026-10-04`

Claude Design remains an exported donor/session candidate unless its environment supports the same repository contract cleanly.

Reserved Stage root:

`https://kayfabizarro.pages.dev/kfb-hub/stage/combat/platformer-benchmark/`

Candidate routes:
- `.../sol/`
- `.../astra/`
- `.../coworker/`

Only PUBLIC_VERIFIED routes count as human comparison surfaces.

## 15 · Comparison report

After independent candidate runs, create one blind review table.

Compare:
- product completeness;
- source violations;
- regressions;
- critic scores;
- repair count;
- implementation churn;
- tests/evidence quality;
- performance;
- visual/gameplay quality;
- autonomous continuation;
- unresolved blockers;
- amount of human steering required.

Do not rank a model by lines of code, number of commits or self-reported confidence.

## 16 · Current stop / start gate

**Execution does not start yet.**

Wait only for inputs that materially affect the frozen benchmark:

1. current WB2/Sol run may continue independently; it is not a dependency;
2. BLENDER-DUEL-01 Return is the important ranged-animation source gate;
3. current Environment Atlas Site may improve Hex discoverability but the known source families already exist.

When BLENDER-DUEL-01 returns:
- reconcile exact clips/sockets;
- freeze the benchmark source packet;
- choose first two executors;
- then run the full Combat Platformer One-Shot comparison.

No auto-merge. No Live promotion.
