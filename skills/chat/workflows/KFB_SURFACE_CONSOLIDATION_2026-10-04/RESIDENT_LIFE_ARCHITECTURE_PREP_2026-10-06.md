# KFB Resident Life · Architecture Prep · 2026-10-06

Status: **PREP · NO OPEN-WORLD RUNTIME WRITES**
Owner: **KFB Production Control / Surface Consolidation**
Receiving product later: **KFB Open World / WB2 · #360 / PR #348**
Current runtime writer: **Claude Coworker · finish existing scope first**

Purpose:
prepare the Resident/Living-World architecture far enough that the post-Coworker Architecture Freeze can make decisions once, then integrate without rebuilding or duplicating owners.

## 1 · Existing donors to consume

Do not rebuild these from zero:

- Resident Atlas: **21 Residents**, Rig_Medium / Rig_Large / Rig_Legacy, data-driven recipes, real props, habitats and activity staging.
- shared KayKit animation library: current Atlas evidence covers layered poses, hand slots, prop fitting and additive motion work.
- EyeRig v6: gaze, blink, asymmetric lids, emotes, life/wander/tremor, kinetics and public `eyeFrame()`.
- PetMouth: mouth sets, expressions, named visemes, talk/rest channels.
- ChatterBox PR #357: planning packet is **PLANNING READY · SITE NOT BUILT**. Current branch head is `886b8e58135553633dda13d0643dc5844078cb35`; its parent `fc6ad9c76adc22fed8d2876e1ad5a4e8ec742e63` contains Georg's GPT-Site-only surface correction. Evidence: planning/readiness `34/34 PASS` + surface correction `12/12 PASS`. Current GitHub routing still holds the Site build behind current issue gates; consume the packet as a donor now, do not duplicate it.
- Living KFB Town: encounter-beat separation, short passing speech, recognition/memory idea, gifts/props.
- Fluff Work Motion Pack PR #356 @ `9124366b88e5e317cbba8480412a8b90f84c9d5d`: work/build motion donor.
- current Open World integration plan:
  `OPEN_WORLD_NEXT_INTEGRATION_WAVES_2026-10-06.md`.

## 2 · Architecture target to freeze after Coworker

The Resident stack should resolve to:

```
ResidentProfile
  identity / role / home / work / relationships / preferences
        |
Resident Life Scheduler
  Activity + POI + Resource intent
        |
Encounter Resolver
  Resident↔Resident / Player / Object / Event
        |
Affect + lightweight Memory
        |
Performance Cue
        |
Resident Performance Composer
  Motion
  EyeRig
  Brows
  PetMouth / visemes
  Head / gaze
  Gesture
  ChatterBox
  Bubble
  Audio hooks
```

World owns:
- navigation/path truth;
- POIs and positions;
- time/weather/biome facts;
- world resources/objects;
- proximity and world events.

Resident Life owns:
- intent;
- routines;
- activity selection;
- social opportunity decisions;
- affect;
- lightweight relationship/memory.

Performance owns:
- visible and audible expression of the selected state.

## 3 · Work that may begin NOW

### A · ChatGPT Web Chat · RESEARCH / DATA PREP

Outcome:
one compact data/spec packet for the Architecture Freeze.

Read:
- Resident Atlas current Return + `data/cast.js`;
- EyeRig v6;
- PetMouth;
- Living KFB Town encounter sections;
- ChatterBox #357 / #362;
- PR #356 Fluff motion Return;
- current Open World integration plan.

Produce, without runtime writes:
1. `ResidentProfile` candidate schema;
2. `AffectState` candidate schema;
3. Emotion → performance mapping table;
4. ActivityDefinition / ActivityInstance schema;
5. POI / affordance schema;
6. EncounterRecord + beat grammar;
7. lightweight relationship/memory record;
8. Fluff harvest/trade/gift/build/rebuild activity recipes;
9. first 3-Resident vertical-slice fixture;
10. donor/source matrix: KEEP_OWNER / KEEP_DONOR / GAP.

Token rule:
reuse current Returns/contracts; do not recursively crawl old history unless a field is genuinely unresolved.

### B · Blender MCP · PRIMARY 3D PERFORMANCE / CHOREOGRAPHY PREP

Outcome:
prepare the actual **3D Resident emotion/reaction/body-language and encounter choreography grammar** from real pinned Residents and rigs, without touching the Open World runtime.

Blender MCP is the primary owner for:
- emotional body language;
- conversation staging/blocking;
- listening vs speaking poses;
- head/torso/hand reaction cues;
- Resident↔Resident encounter staging;
- trade / gift / Fluff exchange choreography;
- Farmer Fluff routine;
- repair/rebuild worker choreography;
- prop handoff / carry / roll / push / knead / place / patch motion;
- source-proven facial/rig attachment staging where Blender inspection is needed.

Required method:
1. isolate the real Resident/rig/prop donor first;
2. audit existing KayKit/Atlas/PR #356 motions;
3. prefer clip layering, additive motion and runtime EyeRig/PetMouth channels;
4. identify only genuine gaps;
5. create a new Blender clip only when a reusable semantic cue cannot be built safely from existing motion.

Return:
- `COVERED` / `LAYERABLE` / `NEW_CLIP_REQUIRED` matrix;
- small 3D choreography/contact-sheet or short preview set for the initial Affect vocabulary;
- semantic mappings for:
  listening, speaking, nod, shake, shrug, point, give, receive, trade, carry, roll/push, knead, place, patch, inspect, celebrate, worry, surprise, laugh/amusement, disagreement, gratitude, suspicion;
- encounter mini-scenes:
  greeting;
  gift;
  trade;
  Fluff handoff;
  Farmer harvest/transport;
  repair/rebuild;
- no hardcoded dialogue text;
- no new dialogue engine;
- no duplicated EyeRig/PetMouth owner;
- no large blind animation batch.

Binding detailed brief:
`BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md`

### C · Claude Design · PRESENTATION SUPPORT ONLY

Claude Design is secondary here.

Use it for:
- clay speech/thought bubble visual language;
- bubble tail / thought pellets / text-safe-zone behavior;
- 2D/3D bubble consistency;
- reaction readability as a presentation reference;
- UI/preview presentation for ChatterBox / Dialogue Lab.

Do **not** use Claude Design as the primary 3D body-language/choreography owner.
Do not substitute cutouts/PNGs for real 3D Residents.

### D · ChatGPT Work/WSA · AFTER COWORKER ONLY

First job:
**Architecture Freeze / Integration Readiness Review**, read-only first.

Freeze:
- one world owner;
- Resident APIs/events;
- profile/state schemas;
- arbitration between locomotion/action/dialogue/reaction/idle;
- simulation LOD;
- persistence boundary;
- World↔Resident↔Audio interfaces;
- no duplicate face/dialogue/audio owner.

Only after that review:
integrate the smallest 3-Resident Living World proof.

## 4 · First vertical slice

Do not build a whole village first.

Use:
- 3 real Residents;
- 1 home/base each;
- 3–5 semantic POIs;
- Farmer/Fluff routine;
- one leisure/curiosity routine;
- alternate route family;
- one Resident↔Resident chance encounter;
- greeting;
- gift/trade/Fluff exchange;
- player interruption;
- visible emotional reaction;
- ChatterBox only when warranted;
- Audio speech focus/mood hook;
- clean resume/replan;
- save/reload of durable state only.

## 5 · Georg · open product questions

These are decisions to refine during planning, not blockers for the current Coworker run.

1. **Emotion model:** keep the current recommended hybrid?
   - small named emotion vocabulary for authoring;
   - intensity/arousal underneath for blending.
2. **Resident memory:** lightweight recognition for all Residents, deeper episodic memory only for selected recurring characters?
3. **Daily life density:** should every visible Resident always have a purposeful routine, or may some simply idle/socialize for longer periods?
4. **Fluff economy:** is Fluff globally harvestable, primarily tied to Life Trees, or biome/role-specific sources?
5. **Trade/gifts:** should everyday NPC↔NPC exchanges affect real finite inventories, or may low-value social gifts be symbolic/cheap?
6. **Player interruption:** may the player join work routines directly (carry Fluff, help rebuild, trade) or mostly observe/trigger responses in V1?
7. **Construction autonomy:** do workers automatically rebuild damaged structures over time, or only after a world/player trigger?
8. **Social frequency:** preferred tone = sparse meaningful encounters vs busier Animal-Crossing-like constant micro-contact?
9. **Home bases:** does every Resident get a persistent personal home, or can role-based shared bases/habitats be normal?
10. **Dialogue ceiling:** keep V1 strongly LLM-free with curated/parameterized lines and only optional AI escalation? Current recommendation: yes.
11. **Population scale:** first target after proof: small village (~8–12 active near residents) or denser town with simulation LOD?
12. **Relationship visibility:** keep relationships implicit in behavior/dialogue rather than explicit heart meters? Current recommendation: yes.

## 6 · Do not do yet

- no separate Resident Site;
- no new dialogue engine;
- no new facial rig owner;
- no new Open World writer;
- no large animation batch;
- no LLM-per-NPC loop;
- no full village/town implementation before Architecture Freeze.

## 7 · Next gate

**Coworker returns exact Open World build/evidence → Work/WSA Architecture Freeze consumes this prep + current donors → only then start Resident runtime integration.**
