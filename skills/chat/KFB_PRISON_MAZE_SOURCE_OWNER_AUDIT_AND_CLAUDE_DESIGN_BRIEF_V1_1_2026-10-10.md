# KFB Prison Maze · Bounded source/owner audit + Claude Design brief v1.1
Date 2026-10-10 · Status: POST-MVP PLANNING / DOCUMENT-ONLY AUDIT. No implementation or new MVP gate.
Owner: existing Island Worldbuilder Lab / Minigame-Fluff planning branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`.
Parent: KFB_PRISON_MAZE_TOWER_DONOR_PRIORITY_V1_0_2026-10-10.md; KFB_PRISON_MAZE_FLOATING_ISLAND_TERRAIN_TOWER_V0_9_2026-10-10.md; Prison v0.8 historical.
Georg's latest decisions supersede historical Black Knight-prisoner proposal. **Black Knight is King Kayfabian's bodyguard**, not default inmate. Current default is Medium Frost Orc, Large Frost Orc is possible brother/escalation, Survivalist alternative.

## Audit scope and evidence classification
This is the **prison-focused subsection** of future MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT, conducted now at documentation/source-reference level by Georg's request. It does NOT close the full, deferred global Fluff audit nor declare source-isolated 3D, playable Maze or an actual visual gate PASS.

| Seam | Source / observed status | Classification | Later proof needed |
|---|---|---|---|
| Kenney Tower Defense | `registry/assets/v1/packs/kenney-tower-defense-kit.json` main blob `9ac07880baf32b0ec3e0f9a540e8dc48547def52`: confirmed round/square base, bottom, middle, build, top, roof groups; `weapon-cannon.glb`, `weapon-catapult.glb` | PRIMARY SOURCE-REGISTERED · NOT 3D-ISOLATED | Show actual each module alone, measure stack pivots and socket/contact, silhouette, draw/collision |
| Kenney Pirate | `media/3D_Assets/GLB_pirate/`; documented 72-model asset family in `travel/travel-v16/docs/HANDOVER_assets_chatgpt.md` | SECONDARY SOURCE-FAMILY · EXACT TOWER PARTS OPEN | inventory then isolated 3D lookout/rail/platform, real connection geometry |
| KayKit Medieval Hexagon | `tools/world_atlas/docs/PACK_GAPS.md` §6 validates `building_tower_A/B` in blue/green/red/yellow; free vs extra gap explicit | TERTIARY CONFIRMED CANDIDATE · NOT PRISON-PROVEN | isolation, compare real tower contours and size; don't equate catalog image with available asset |
| Maze topo / walls | Incompetech CC0 graph-carving source candidate; S13.2 graph/fuge donor; existing World/Surface owner | SOURCE DONOR + ADAPT LATER | inspect downloadable source, round/rect path graphs, source-authoritative World support, rising/descending wall animation, save/reload |
| Toy Soldier | Existing KayKit Mystery `ToySoldier.glb`, Rig_Medium candidate in Resident Atlas; musket is a source accessory/pose check, not assured working prison animation | EXISTING ACTOR · RECOLOR/PERFORMANCE PROPOSAL | isolated original plus dark-but-not-too-dark **cobalt-blue** uniform, white hat plume, hat front numeric decal/mesh; confirm true hat surface, musket grip, idle, walk and console button reach |
| Frost Orc Medium/Large | Georg's authored cast preference; source and rig must be separately pinned | CAST INTENT · SOURCE ISOLATION PENDING | identify exact both glbs, rig/motion, height, distinguish brother roles |
| Gatekeeper | existing KFB Gatekeeper / entrance/exit semantics need current owning project source read before consumption | CONCEPTUAL INTEGRATION CANDIDATE | entrances, exits, prisoner vs visitor entry, authority and release routing; no competing progress lock |
| Tiny Skies searchlight | `_handoff/KFB_TinySkies_Transfer_v8.md` transfer note exists; exact lighthouse beam source/behavior not isolated | VISUAL/BEHAVIOR DONOR ONLY | source-identify lighthouse/beam, render actual cone, measure sweep/occlusion, avoid duplicating scene light/VFX writer |
| KFB Audio | `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/RETURN.md` confirms AUDIO-CAL-01 Georg human PASS (historical) | EXISTING AUDIO/MIX OWNER · KEEP | compose/curate prison-specific soundtrack as soundbed and mix with FX, voice, footsteps, alarm; duck and mute via existing KFB Audio |
| Memory/save | existing World/Instance, Resident Relationship Memory, Card/Almanac, Inventory, Score owners | KEEP SEPARATE | stable layout seed/state, custody, visits and actor recovery; not new prison save subsystem |

## Toy Soldier Guard Corps — Georg-specific design
Uniform: **medium cobalt blue**, not overly dark; **white plume** on the existing high musketier-style hat. Put a clearly legible **number on the front of the hat** without large mesh rebuild. Identity belongs to instance data, not clone files. `No. 1` is the superior / chief warden and central Panopticon tower button operator. `No. 2+` gatekeepers, entry/exit officers, patrol guards and backstage workers. No need to mandate exactly four; instance count may vary. One source rig/mesh with bounded color/material, number and small prop changes. Side-by-side isolated proofs needed for No.1, No.2 and No.3 from consistent camera/light before assembly.
The existing high hat face and white plume must remain visually readable. Gewehrhaltung: prove actual source prop + hand attachment + idle/guard/walk/aim only with compatible rigs; don't make up animation names or force a combat system.
No. 1 workstation: readable elevated desk/control console, **large red reconfigure button**, theatrical button press and immediate visible maze morphing. Visitors arriving should be able to sightline the operator, console or tower crown; from prisoner ground-level the light/searchlight can dominate. Operator should not be lost when the bowl sinks. Gatekeeper is normally a lower-ranked numbered soldier, but exact number/role is data-driven, not a fixed law.

## Gatekeeper and player routes (design)
Separate **visitor entry** (optional spectate or voluntary WhackMan/Maze minigame), **custody intake** (arrest or voluntary surrender), **authorized exit** (release, bribe/fine/negotiation/escape) and **guard service** (tower/switch). Gatekeeper offers legible options in world, no forced global moral judgment or new police heat owner. The player can explore without being automatically condemned to unwinnable endless rescrambles. The Toy Soldier's maze button can sadistically reset NPC routes near escape, but player mode needs clear control/fairness and opt-in puzzle consequences.

## Sound + searchlight — integrated theatrical score
- A distinct **Prison Planet / Prison Maze Island soundtrack** is requested as authored/curated local soundbed: tense, darkly comic, clockwork/march undertones, unsettling repetition, pauses for absurdity. NOT generic copyright music, not a new music player.
- Separate KFB Audio-owned event layers: button thunk, servo/earthen wall lift, clay tremor and settle, footsteps, bars/gate, searchlight mechanical sweep, tower creak/extension, alarm/siren, patrol musket handling, prisoner groan/bickering and optional voice/ChatterBox. Duck music during intelligible voice, respect mute, mix, existing polyphony and reduced stimulation.
- Tiny Skies lighthouse-style moving light cone is a specific design donor: lighthouse sweep visible from arrival/rim and within bowl, sometimes catches the wrong guard; actual shader/geometry/lighting mechanics cannot be marked verified until code and isolated runtime proof. Keep KFB VFX/Light owner.
- Potential playful synchronization: No.1 button hit → soundtrack stinger and music briefly drops → wall-morph mechanical crescendo → inmate stumbles → motif resumes in a slightly rearranged way. Diegetic siren optional; no harsh forced audio level.

## Claude Design Auftrag (future visual-only; not launched)
Goal: produce source-isolated object contact board and THREE prison-world spatial variants using **same cast and story**: orthogonal bowl, radial deep bowl, inverse mound/hybrid. Compare THREE tower composites T1 = TD only, T2 = TD shaft + Pirate observation platform (if source-proven), T3 = KayKit tower alternative only if actual usable asset. Do not fabricate exact source geometry. Include:
1. one outside floating-wedge/island silhouette with variable rim/center thickness, readable tower/beam;
2. overhead maze paths and 3D terraced walls grown from same earth material;
3. prisoner low-view of bowl/tower and arrival-view of chief at red button;
4. No.1 cobalt blue/white plume/large hat number; No.2 gatekeeper at visitor/custody entry; No.3 patrol with real rifle/animations if source-compatible;
5. Medium Frost Orc inmate, Large Frost Orc brother and optional Survivalist as source-isolated candidate;
6. before/button/after dynamic maze triptych including safe cartoon displacement;
7. audio mood strip: score, click, earth-rise FX, beam sweep, return music.
First show each source object alone. Then assemble. Label `SOURCE_PRESENT`, `ISOLATED`, `VISUAL_DESIGN`, `UNTESTED`, not pass-by-load.
Georg later decides spatial/design direction; do not preempt active Four-Island Story Vision R1 A/B/FAIL or execute new geometry. No publication required for planning document.

## Exact proof status / next gate
Source-level static audit only; **0** new donor-isolated 3D renders, **0** animation tests, **0** in-browser sound/searchlight tests, **0** runtime save tests, **0** Site/Stage, **0** Claude Design execution. Kenney TD registration and KFB Audio historical acceptance are not proof of a Prison Island implementation. New prisoner cast, gatekeeper, numbered uniform, red button and score are **concept direction**.
Keep single deferred parent gate `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` for future implementation only after playable MVP, notwithstanding this bounded pre-audit. Any broken seam after two non-improving repairs must be exported/quarantined under current Production Guard policy.
Recovery order: main START_HERE → CHAT_GITHUB_KFB_STAGE_WORKFLOW → FRESH_CHAT_SLICE_PROTOCOL → Prison v0.8 + Terrain v0.9 + Tower v1.0 → this audit → current Return, four-island Recovery/active gate → current Lab state. Do not auto-merge or promote Live.
