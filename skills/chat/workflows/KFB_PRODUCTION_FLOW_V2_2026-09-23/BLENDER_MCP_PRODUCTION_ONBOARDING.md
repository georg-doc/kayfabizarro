# KFB · Blender MCP Production Onboarding · 2026-09-23

Status: **CURRENT HYBRID AUTHORING LANE · CONTINUE EXISTING WARBAND SESSION**

## Für Georg

Blender MCP ist ab jetzt kein bloßer Notfall-Fallback mehr.

Der Clown-Pilot zeigt: für Posing, Prop-Rigging und Animation kann Blender schneller zu einem produktionsfähigen Ergebnis kommen als unsere selbstgebauten Browser-Editoren.

Der laufende Warband-Job soll **nicht neu gestartet** werden. Dieses Briefing ist Zusatzkontext für die weitere Arbeit und die spätere Übergabe.

## Role

Blender MCP / Claude Cowork is an **authoring producer**, not a new runtime owner.

Use Blender especially for:
- skeletal posing;
- prop/hand/instrument attachment;
- authored cartoon animation;
- batch rig/pose work after one source-backed fixture passes;
- precise volumetric mesh work;
- bevels / thickness / normals / UV/material cleanup;
- geometry tasks that repeatedly produce browser-mesh artifacts.

Do not move into Blender by default:
- gameplay/input;
- movement/contact physics;
- route ownership;
- runtime persistence;
- UI;
- procedural systems that must stay live/editable in the game.

## Production chain

Default hybrid flow:

`CLOSED Production Packet → Blender authoring → editable + reproducible deliverables → Coworker/Web integration → runtime/browser test → Georg coherent visual gate`

Claude Design is used later for:
- look/composition;
- presentation;
- environment/art direction;
- coherent UX/design integration.

WSA only when a real local/multi-repo/packaging capability remains.

## Donor rule

Before editing:
- use exact source assets;
- keep source rig/bone names;
- keep proven attachment rules;
- do not rebuild a working donor from screenshots.

Apply:
`skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`

If exact source is missing or ambiguous:
STOP and report the missing source.

## Current proven Blender precedent · Clown JUG-P1

GitHub:
PR #192

Branch:
`claude/blender-mcp-animation-poc-2026-09-23`

Head at onboarding:
`b49fb6e1adde070d658e1cc21dadb3294164cb29`

Result:
- Clown · Rig_Medium;
- 3-club cascade;
- 48 frames @ 24 fps;
- reproducible Blender Python script;
- GLB export;
- Preview GIF;
- deformed-mesh clearance checks;
- Georg visual verdict: **~80 % PASS / cartoon-plausible / usable**.

Production lesson:
**80 % believable and structurally correct may be shipped to integration; minor polish can be quarantined for later.**

Do not spend a full extra authoring cycle merely to turn an accepted 80 % cartoon motion into theoretical 100 % perfection.

## Current Warband continuation

Existing scene/source brief:
`tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/START_HERE.md`

Important:
that brief remains useful for **source identity, characters, props, scenery and music**.

Its old HTML-first authoring assumption is superseded for the current experiment by this Blender authoring lane.

### Source facts to retain

Bandleader:
- exact Legacy Orc B:
  `media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf`
- source revision:
  `10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`
- black-ponytail Orc reads as bandleader.

Drummer:
- source-backed Orc Brute / Orc Raider drum setup;
- Orc Wardrum;
- WardrumStick;
- do not rebuild those props.

Scenery:
- source-backed Orc/Warband camp grammar;
- Orc banner / open camp / campfire where useful;
- no generic concert-stage replacement unless Georg asks for it.

Music:
`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3`

Do not solve gameplay or world-life runtime inside Blender.

## Warband authoring goal

Finish one **production-usable band performance candidate**, not a perfect final cinematic.

Priorities:

1. readable band silhouettes;
2. convincing instrument contact;
3. believable cartoon rhythm;
4. no severe body/prop penetration;
5. loops cleanly enough for world use;
6. source identities remain intact.

Minor imperfections may remain if Georg judges the performance usable.

## Batch rigging rule

Batching is encouraged **after one fixture proves the method**.

Good pattern:

`one source-backed actor/prop fixture → measure → script → reproduce from clean scene → parameterize → batch family`

Do not batch:
- guessed offsets;
- unverified bone names;
- screenshot-derived hand positions;
- one-off visual hacks.

For each rig family, preserve the family-specific source truth.

## Measurement rule

Prefer:
- real bones;
- deformed mesh vertices;
- prop geometry;
- actual pivots/axes.

Do not rely only on:
- bounding boxes;
- visual eyeballing;
- screenshots.

Record only measurements needed for reuse.

## Required deliverables from each productive Blender slice

Return a **small production bundle**, not only screenshots.

### Required

1. **Editable Blender file**
   - final authoring scene;
   - source objects retained/named clearly.

2. **Reproducible script**
   - Python/MCP script able to recreate the meaningful authoring step from the declared source scene where practical.

3. **Runtime export**
   - GLB/GLTF;
   - animation clip names;
   - rig/source identity preserved.

4. **Visual preview**
   - GIF or MP4;
   - useful camera angle(s);
   - enough to judge motion/contact.

5. **SOURCE / MEASUREMENT record**
   - source repo/revision/path;
   - rig family;
   - attachment bones;
   - important measured offsets/clearances/timing;
   - known compromises.

6. **RETURN**
   - what was built;
   - what is proven;
   - what is not tested;
   - Georg's visual verdict;
   - exactly one next integration gate.

### Optional

- raw preview frames;
- alternate takes;
- diagnostic screenshots;
- fine-tune backlog.

## Runtime handoff

Blender output is not automatically runtime-approved.

Coworker/Web next checks:
- GLB loads in existing three.js consumer;
- expected clips bind/play;
- scale/orientation survive;
- props/attachments still read correctly;
- no new runtime owner was introduced.

Only then promote the Blender result as a reusable production donor.

## Screenshot feedback loop

Georg may review Blender viewport renders/screenshots directly.

When he gives visual feedback:
- translate it into one bounded next authoring delta;
- preserve accepted parts;
- do not restart the whole scene;
- after two failed repair passes on the same issue, stop and export the candidate.

## Track / hard-surface use

Blender is a valid candidate for **visual geometry compilation** where browser-built mesh topology repeatedly fails.

For Racer, preserve:
- route;
- banking;
- contact/physics;
- gameplay ownership.

Possible future Blender role:
`route/profile data → Blender closed/beveled visual mesh → GLB`

Do **not** make Blender the Racer route/contact owner.

First prove on one representative section:
- hard banked curve;
- barrier/underside;
- tunnel frame.

Only expand to the full track if the A/B is visibly cleaner and runtime integration remains simple.

## Communication

Replies to Georg should start with:

**Für Georg**
- what was built;
- what still looks imperfect;
- whether it is usable;
- what he should judge next.

Technical details follow only when useful.

## Current Warband delivery target

For the session already running now:

**finish the current Warband candidate without restarting it.**

At the next meaningful visual checkpoint, return:
- preview GIF/MP4;
- editable .blend;
- reproducible script if meaningful;
- GLB export;
- source/measurement record;
- short Return.

Georg gives one coherent visual judgement.

After that:
Coworker/Web integrates the accepted candidate into the existing Resident/ToolBox/WorldBuilder runtime.

No Cloudflare required for this authoring loop.
No SVG/CSS/Canvas replacement of 3D donors.
No merge/Live promotion from Blender authoring alone.
