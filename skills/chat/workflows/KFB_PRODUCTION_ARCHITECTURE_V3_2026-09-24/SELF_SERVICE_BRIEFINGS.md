# KFB Production Architecture v3 · Self-Service Briefings

Status: **READY CATALOG · v3 candidate**  
Use with: `START_HERE.md` and `INPUT_LOCKS.json`

These jobs are designed so Georg can start them directly in a fresh Web/Claude/Blender chat without first paying for a planning/review round.

General rule for every job:

- recover the named owner and input lock;
- do not reopen documented product decisions;
- do not invent a replacement owner;
- work through internal technical steps without Georg check-ins;
- ask Georg only when a real product choice/source ambiguity cannot be resolved from the locked inputs;
- return **one coherent directly reviewable result**;
- no Cloudflare debug loop;
- no Work/WSA unless a concrete missing capability is named;
- successful work gets a minimal Return, not a failure-grade export;
- after two focused failed repair passes on the same gate, switch to Recovery and stop.

---

## JOB A · WEB-QUICK-3D-REVIEW

**Use when:** the question is primarily visual and small: weapon/prop angle, hand contact, eye placement, actor scale, animation pose, barrier/track silhouette, one material/geometry comparison.

**Executor:** fresh ChatGPT Web development chat.

**Execution profile:** `WEB_FAST` · ChatGPT Web · GPT-5.6 Sol · reasoning **instant** · budget **LOW**.

**Outcome:** one compact review artifact that shows the **real source object/runtime** and answers the visual question without a deployment round.

**Do not build:** a measurement lab, dashboard, new owner, Cloudflare route or long evidence pack unless the visual result itself requires it.

### Paste-ready start prompt

> @GitHub  
> Use KFB Production Architecture v3:
> `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/START_HERE.md`.
>
> This is a **WEB-QUICK-3D-REVIEW** job.
>
> Recover the named owner/current source from GitHub. Use the real donor/runtime; no proxy mesh or simplified reconstruction. Build the smallest directly clickable HTML that lets me visually judge the requested relation in 3D. Put any useful measurements in a compact secondary readout, not at the center of the experience.
>
> Do not create a new Cloudflare route or separate micro-PR just for the visual question. If source changes are actually needed, keep them on the owner's current integration branch where possible.
>
> Return one clickable review HTML in this chat and ask at most three plain-language review questions. If I PASS it, persist only the real implementation delta + minimal result note.

**Typical acceptance:** “angle/contact/scale looks right” rather than “37 measurements passed”.

---

## JOB B · TOOLBOX-COHERENT-INTEGRATION-01

**Use when:** continuing the ToolBox toward a usable Stage-First authoring tool.

**Executor:** Web/Coworker with GitHub Bridge; Claude Design only for later coherent visual refinement.

**Execution profile:** `WEB_DEEP` · ChatGPT Web · GPT-5.6 Sol · reasoning **high** · budget **HIGH** · secondary only if needed: `COWORK_STANDARD`, `GITHUB_BRIDGE`.

**Input lock:** `toolbox-coherent-integration-01`.

**Outcome:** one ToolBox candidate where Georg can:

1. open the accepted Stage-First baseline;
2. choose the real current actor roster;
3. use the current FrizzleBob source;
4. load a real Resident scene;
5. select and Move / Rotate / Scale / Drop;
6. Save;
7. Reload;
8. continue editing.

Do not stop after proving only one of these seams. Internal tests may be checkpointed without creating human micro-gates.

### Paste-ready start prompt

> @GitHub @Dropbox  
> Read:
> `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/START_HERE.md`
> and the `toolbox-coherent-integration-01` record in `INPUT_LOCKS.json`.
>
> Build **one coherent ToolBox milestone**, not another source census or mini-lab.
>
> Start from the already accepted Stage-First functional baseline and reuse the locked current roster, FrizzleBob, Resident recipes, shared edit-layer and scene-patch persistence. Do not create a second roster/editor/Resident database/EyeRig.
>
> Work through adapter/runtime issues internally. Do not ask me to approve individual blobs, axes or measurements. If a mandated source cannot be reproduced, fail closed rather than substituting it.
>
> Deliver one directly reviewable ToolBox artifact where I can run the full flow:
> Actor → Resident/Stage → select → Move/Rotate/Scale/Drop → Save → Reload → continue.
>
> Ask me only whether the resulting ToolBox feels like the right usable base and what visible defect, if any, blocks continued production. No Cloudflare publication before that coherent review.

---

## JOB C · BLENDER-RESIDENT-PERFORMANCE-BATCH-01

**Use when:** producing Resident dance moves, prop/instrument interaction, acting beats or reusable movement clips in Blender MCP.

**Executor:** Blender MCP / Claude Code authoring session.

**Execution profile:** `BLENDER_STANDARD` · Blender MCP / Claude Code · Claude Sonnet 5 · reasoning **medium** · budget **STANDARD**.

**Input lock:** `blender-resident-performance-batch-01`.

**Outcome:** a queue of reusable Resident performances can be worked through in one productive Blender session after the fixture/pipeline is proven.

### Production loop

For each queued performance:

1. load the exact Resident/rig source;
2. audition an existing Motion Library / same-rig action before authoring new motion;
3. choose the closest donor internally;
4. tune or author the motion;
5. preserve important contacts: feet/ground, hands/prop, instrument/target;
6. keep gross motion readable before adding secondary motion;
7. export Blender Action/NLA + reusable GLB clip;
8. produce a short visual preview (GIF/contact sheet or real GLB browser preview);
9. move to the next queued performance.

Do not stop the batch for non-blocking imperfections. Record them as TUNE items.

### Paste-ready start prompt

> @GitHub @Dropbox @Blender
> Read KFB Production Architecture v3 and the `blender-resident-performance-batch-01` input lock.
>
> This is a **productive Resident performance batch**, not a measurement/research slice.
>
> Use the proven Blender MCP authoring path and current KFB Motion Library. For every requested performance, audition existing same-rig/candidate actions first; author new motion only when needed. Preserve the actual Resident rig, props and attachment rules. Contact quality is judged visually first, with measurements as support.
>
> Work through the queue without asking for intermediate governance approval. Ask me only if two genuinely different performance directions require a creative choice.
>
> For each completed item return:
> - Action/NLA name + semantic id;
> - reusable GLB clip/export;
> - short preview;
> - one-line TUNE note if needed.
>
> At the end return one compact batch index. Do not require me to manually push heavy files to GitHub during the authoring loop. Leave a candidate export for the GitHub Bridge to integrate after review.
>
> Stop after two failed repair passes on the same performance/contact foundation and preserve that candidate rather than iterating endlessly.

### Default queue shape

A queue entry needs only:

```json
{
  "resident": "goth-girl",
  "intent": "dance groove",
  "prop": null,
  "durationHint": "4-8 beats",
  "review": "readable groove, grounded feet, no broken limbs"
}
```

Examples may include:
- Goth Girl dance groove;
- Orc Raider dance/guitar/war-dance;
- Orc Warband drummer after reference direction is selected;
- Animatronic guitar/strum variations;
- Clown juggling refinement;
- later Resident interaction beats.

The queue may contain multiple items. It does not require a new planning chat per clip.

---

## JOB D · WORLDBUILDER-CAPABILITY-R1

**Use when:** continuing from WB-W0 into a genuinely useful authoring tool.

**Executor:** Web + Claude Design where visual authoring is useful; Blender only for specific authored 3D assets.

**Execution profile:** `WEB_DEEP` · ChatGPT Web · GPT-5.6 Sol · reasoning **high** · budget **HIGH** · secondary only if needed: `CLAUDE_DESIGN_STANDARD`, `BLENDER_STANDARD`.

**Input lock:** `worldbuilder-capability-r1`.

**Current foundation:** WB-W0 proves measured scale/traversability; WB2 and the accepted shared edit-layer are technical donors for authoring.

**Outcome:** after Georg's WB-W0 foundation decision, build the next coherent capability rather than another proof-only slice.

### Gradient roadmap

These are **capabilities**, not mandatory separate PRs or human gates.

**R1 · Authorable place**
- keep measured WB-W0 region/route;
- bring in accepted WB2 Raise/Lower sculpt;
- bring in accepted shared object editor;
- place real house/tree/rock/lamp;
- Save/Reload terrain + object transforms;
- keep WALK usable throughout.

**R2 · Visually production-usable place**
- repair black KayKit tree/material without replacement material guessing;
- smooth Idle/Walk/Run transition and speed coupling;
- settle character-outline policy;
- keep R1 authoring intact.

**R3 · Real world content**
- introduce one OSM/world-content zone through the same scale/terrain truth;
- use continuous roads/building grammar;
- add one landmark and Resident/prop scene;
- no duplicate world runtime.

**R4 · Mobility seam**
- vehicle/track handoff on the measured world;
- retain world scale and route truth.

**R5 · Atmosphere / God Mode**
- sky/weather/day-night and broader navigation/authoring only after R1–R4 are useful.

### Paste-ready start prompt

> @GitHub @Dropbox
> Read KFB Production Architecture v3 and the `worldbuilder-capability-r1` input lock.
>
> Continue from the current WB-W0 measured foundation. Do **not** restart world architecture and do not turn this into another measurement-only proof.
>
> Build **R1 · Authorable place** as one coherent candidate:
> measured WB-W0 region/route + accepted WB2 sculpt + accepted shared object editor + real placeable props + Save/Reload, while WALK remains usable.
>
> Reuse current owners. No second picker, transform system, terrain truth or persistence schema. Do not repair unrelated visual HOLDs unless they prevent R1 from being judged.
>
> Work through internal seams without asking me for micro-approvals. Give me one directly clickable 3D review artifact in which I can:
> walk → sculpt → place/select → move/rotate/scale/drop → save → reload → continue.
>
> Ask only:
> 1. Is this now a useful authorable place?
> 2. Is anything visibly blocking R2?
>
> No Cloudflare milestone publication until this coherent review is worth sharing.

---

## Starting a new job from the Hub

A Hub briefing card should copy:
1. the matching start prompt above;
2. its job id;
3. the current input-lock revision.

Georg should not need an architecture chat between selecting a READY job and starting production.

The architecture lane updates these templates when the production model changes; individual product chats update product truth, not the architecture contract.
