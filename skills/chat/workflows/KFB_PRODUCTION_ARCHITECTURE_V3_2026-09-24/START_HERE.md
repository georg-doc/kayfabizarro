# KFB Production Architecture v3 · Self-Service First

Status: **CURRENT CANDIDATE · HUMAN ACCEPTANCE OPEN**  
Date: 2026-09-24  
Owner: Georg / KFB  
Architecture steward: **KFB Web Architecture lane**  
Branch: `chatgpt-web/production-architecture-v3-2026-09-24`

## Complete production strands

The current architecture contains **13 primary strands / 88 copy-ready jobs**:
ToolBox · Animation/Residents · WorldBuilder/God Mode · Racer→World · Quick 3D Review · Combat/Choreography · Cube Pets/Actor Identity · Travel Modes/World Surfaces · Vertical/Babel · Town/NPC Life · Shared Stage/Transitions · Card Zones/Card Objects · Player Meta/Fractal Almanac/Adaptive Interface.

Adjacent owners such as 2D/2.5D Animation, Storytelling Maps/CardRig, Dungeon, VFX/SFX, Tourbus/WaterBowser and other minigames feed these strands as modules rather than creating another universal runtime.

For the full self-service production route, read:
- `PRODUCTION_STRANDS.md` — complete 13-strand capability map, including Card Zones and Player Meta/Interface;
- `STRAND_BRIEFINGS.md` — copy-ready executor prompts for every prepared milestone, including future WAITING jobs;
- `INPUT_LOCKS.json` — current source/head locks;
- `HUB_BRIEFING_CATALOG.json` — machine-readable strands and READY/HOLD cards.
- `RACE_WORLD_LOOK_AUDIO_DECISIONS_2026-09-24.md` — binding RKIT physics/width/jump/city decisions plus Track/OSM bake, Elastic torsion and Audio/VFX production flow.
- `SKILLS_RUNTIME_CONSOLIDATION_2026-09-24.md` — P2 current/legacy Skill census, Actor/PDF/Card/Ink/Talk/Material runtime-owner routing and compatibility-first archive plan.
- `CHARACTER_RESIDENT_PRODUCTION_WORKFLOW_2026-09-24.md` — browser-first Resident/pose/scene authoring, Pose→Blender handoff, custom actor-family and missing-motion rules.
- `RESIDENT_DISCO_01_2026-09-24.md` — researched six/seven-Resident outdoor disco, current dance-library matrix, Mixamo gap shortlist, props and 32-bar choreography route.
- `MVP_FOCUS_PLAN_2026-09-24.md` — current five-product MVP ladder.
- `AI_TOWN_KFB_EVALUATION_2026-09-24.md` — AI Town mechanics-donor decision for Residents/emergent life.
- `KAYKIT_ANIMATION_RESEARCH_UPDATE_2026-09-24.md` — current KayKit State/Action taxonomy + direct FBX intake decision.
- `IK_CCD_PARITY_DECISION_2026-09-24.md` — upstream Three.js CCDIKSolver vs current KFB reachChain A/B gate.
- `EXECUTION_DISPATCH_POLICY_2026-09-24.md` — executor/model/reasoning/budget profiles for every briefing.
- `WSA_HUB_V3_MOUNT_HANDOFF_2026-09-24.md` — low-cost mount into existing HUB-CTRL #202; no Work review loop.
- `ARCHITECTURE_CHAT_HANDOFF_2026-09-24.md` — fresh-chat recovery for this architecture/planning role.
- `FLOW_DESIGN_INTAKE_TRIAGE_2026-09-24.md` — pre-sorted current Flow Design intake; three exports classified without promoting Inbox copies to owners.
- `WSA_WORK_FOCUS_HANDOFF_2026-09-24.md` — minimal WSA/Work routing note; currently no Work-only execution is justified.

A fresh architecture chat should maintain these strands instead of generating a new planning layer. Individual executor chats update product truth; architecture changes only when an owner/dependency/product direction changes.

## Current MVP focus · 2026-09-24

Five product targets now organize the active queue:
1. WorldBuilder Mobility Playground;
2. Hürth → Cologne OSM streets → Race Track;
3. ToolBox Production + direct Motion Intake + State/Action Animation Lab;
4. FrizzleBob alternative KayKit body family → Resident House Scene;
5. Living Residents KISS from AI Town mechanics donors.

Parallel READY performance fixture: RES-DISCO-01.

READY new jobs: ACTOR-FB-BODY-FAMILY-01 · MOTION-INTAKE-DIRECT-01 · TB-V17-INTEGRATION-01 · RES-DISCO-01.
Dependency-gated: WB-MOBILITY-MVP-01 · WB-HUERTH-COLOGNE-RACE-MVP-01 · NPC-AITOWN-KISS-01.

## Current recovery focus · 2026-09-24 late evening

- **Resident Disco:** `RES-DISCO-01` is now READY for Source Cast + Motion Audition. It reuses Resident Atlas + Motion Library + MUSIC-PERF rather than creating another performance runtime. Proposed cast spans Legacy/Medium/Large; new Mixamo intake waits until current actor/motion pairings are visually chosen. Planned Stage route exists only as a target and is not published.

## Previous recovery focus · 2026-09-24 evening

Current source recovery changes the practical queue:

- **WorldBuilder:** Cologne World Zone bake is technically complete through real-browser load/place/reload. The Flow Design Cologne shell is good candidate presentation input. Next integration is the small `WB-ZONE-SEAM-01` adapter; no Work session is needed for it.
- **Residents:** the Card Speculation export remains a thin Resident Scene candidate pending Georg's face/mouth review. The Band/Atlas export is useful input, but its export-local band contract must not become a second production runtime; accepted content maps onto the existing Resident Scene / `kfb.resident-performance.v1` owners.
- **ToolBox:** coherent ToolBox + real Motion Library consumer are green, and the repaired plain review transport now passes as well (20/20 coherent + 25/25 Animation Studio + 13/13 plain review in run `36055391088`). No Work escalation.
- **Audio:** AUDIO-CAL-01 is human accepted. MUSIC-PERF-01 is public-verified and waits only for Georg's review.
- **Racer:** current top RKIT geometry is PR #39. The real TRACK_A Rapier runtime/contact proof is routed to `WEB_DEEP` in the existing Race host; Work remains unnecessary unless that executor proves a capability gap.

Read `WSA_WORK_FOCUS_HANDOFF_2026-09-24.md` before assigning Work; its current decision is **do not start Work**.

## Purpose

KFB production must optimize for **usable artifacts per unit of human/agent budget**, not for maximum audit material per implementation step.

v3 keeps the existing source-provenance, owner and recovery discipline, but removes them from the normal hot loop.

The default production loop is:

```
READY BRIEF
→ executor works productively
→ one directly reviewable artifact
→ Georg PASS / TUNE / REJECT
→ GitHub bridge integrates the accepted result
→ tests
→ milestone publication only when useful
```

Not:

```
micro-slice
→ measurements
→ PR
→ Cloudflare
→ Hub update
→ Work review
→ next micro-slice
```

## 1. The unit of work is a usable capability

A normal slice is no longer one seam, measurement table, source-isolation page or adapter proof.

It is the smallest **coherent capability Georg can actually use or judge**.

Examples:

- ToolBox: choose a real actor → load a real Resident scene → transform an object → Save → Reload → continue editing.
- WorldBuilder: enter a measured region → walk → sculpt terrain → place/transform an object → Save/Reload.
- Resident performance: load a real Resident → audition or author motion → preserve contacts/props → export the reusable action/GLB → preview it.
- Racer: inspect and drive one coherent track-body candidate, not five separate geometry-measurement gates.

Internal technical checkpoints remain welcome. They are commits/tests, not separate Georg gates.

## 2. Three modes — never mix them

### PRODUCTION · default

Used while building a coherent usable result.

Required on success:
- changed source;
- tests actually run;
- one review artifact when the result is visual/interactive;
- a short result note;
- current next capability.

Not required on every successful iteration:
- full codebase duplicate;
- post-mortem;
- giant source census;
- screenshot archive;
- Cloudflare publication;
- Hub republication;
- Work/WSA consolidation.

### REVIEW · human decision

Preferred surface for browser/3D work:
- a directly clickable zero-install HTML or equivalent artifact in the same chat;
- real donor/runtime, not a simplified look-alike;
- 1–3 plain-language questions.

Cloudflare is used when a **milestone** deserves durable/shared/public review, not as the edit-refresh loop.

### RECOVERY · exception

Activate only when:
- the chat/session is about to be lost and uncommitted state matters;
- two focused repair passes fail the same gate;
- the executor cannot reproduce the protected donor/source;
- a destructive or ambiguous integration must be frozen.

Then preserve the full editable candidate, evidence and post-mortem.

**A successful slice does not need failure-grade recovery paperwork.**

## 3. One active integration PR per owner

For each active product/tool owner, default to:
- one active integration branch/PR;
- many small implementation commits inside it;
- temporary experiment branches only when isolation is technically useful.

Do not open a new PR for:
- one measurement;
- one visual pose check;
- one donor screenshot;
- one optional asset;
- one Hub metadata refresh.

After a candidate becomes SUPERSEDED / REJECTED / FROZEN and its history is safely retained, close the PR. Closed PRs remain searchable history.

Goal: GitHub is a comprehensible current-state graph, not an ever-growing queue of unresolved historical states.

## 4. GitHub Bridge pattern

Claude Design, Blender MCP and other authoring executors do **not** need GitHub write access to be productive.

Use:

```
GitHub owner state
→ small INPUT lock + workspace
→ authoring executor
→ candidate export
→ GitHub Bridge
→ diff / commit / tests / PR
```

The Bridge may be ChatGPT Web/GitHub or later an automation.

Executor responsibilities:
- use the supplied sources;
- build the requested result;
- return the candidate and review artifact;
- state unresolved product issues.

Bridge responsibilities:
- refresh the target owner head;
- compare candidate vs input;
- reject silent owner/donor replacement;
- commit only the real delta;
- run owner-native tests;
- record the minimal result.

Do not make an authoring session spend context on branch archaeology, Hub synchronization or deployment unless that is the actual task.

## 5. Small INPUT locks instead of giant prompts

A self-service job gets:
- owner repo;
- base/head or current PR;
- exact required donors/modules;
- protected owners;
- desired coherent outcome;
- acceptance actions;
- stop rule.

Detailed historical measurements stay in their existing owner docs. Load them only if implementation needs them.

Current machine-readable pins for the prepared v3 jobs live in:
`INPUT_LOCKS.json`.

## 6. Review-in-chat first

For a quick visual decision such as:
- weapon/prop angle;
- hand contact;
- actor scale;
- eye placement;
- animation pose/timing;
- track/barrier silhouette;
- simple world composition;

prefer one compact real 3D review HTML over:
- a measurement-only UI;
- a Cloudflare deploy;
- a dedicated micro-PR;
- a Work/WSA browser round.

A review HTML is allowed to be purpose-built, but it must consume the **real source object/runtime** and must not replace it with a proxy or simplified reconstruction.

Measurement data should support the visual question, not become the primary human interface.

## 7. Self-service Briefing Shelf

The KFB Hub should expose a dedicated **Briefings / Jobs** shelf.

A READY card contains:
- human title;
- what will exist when done;
- executor: Web / Claude Design / Blender MCP / other;
- expected review artifact;
- current INPUT lock;
- copy-ready start prompt.

Buckets:
- **READY** — Georg may start it himself now;
- **RUNNING** — a named session currently owns it;
- **REVIEW** — one coherent result needs Georg;
- **HOLD** — blocked or deliberately deferred;
- **DONE** — accepted and integrated, no longer shown in the default queue.

The Hub is a navigator. It must not require an expensive LLM review merely to stay current.

Prepared v3 briefing definitions live in:
`HUB_BRIEFING_CATALOG.json`.

## 8. Status facts must be typed

Never overload one `head` field.

For current-state records use, where relevant:
- `sourceHead` — product/authoring source revision;
- `prHead` — current integration PR head;
- `deployHead` — publication branch revision;
- `stageUrl` — direct `kayfabizarro.pages.dev` milestone route;
- `humanResult` — PENDING / PASS / TUNE / REJECT;
- `nextCapability` — next useful product capability.

This prevents source, integration and deployment revisions from being mistaken for one another.

## 9. Hub updates are generated/batched

Normal product work updates owner truth first.

The public Hub updates:
- automatically from small status records when automation exists; or
- in the next meaningful publication batch.

Do not spend Work/WSA or a large Coworker session on a daily dashboard refresh.

For private owner repositories, prefer:
`owner repo → compact KFB_STATUS.json / repository dispatch → kayfabizarro registry`

rather than giving the Hub broad private-repository crawl responsibility.

## 10. Cloudflare policy

Cloudflare is:
- milestone acceptance;
- cross-device/shared review;
- durable public KFB route.

Cloudflare is not:
- the default debugger;
- the default pose checker;
- the default one-parameter iteration loop.

Until a milestone is ready, chat review/local review is sufficient.

All actual public human test links remain direct:
`https://kayfabizarro.pages.dev/…`

## 11. Work / WSA budget

Use Work/WSA only when the required capability is actually unavailable in Web/authoring tools, for example:
- local/private multi-repo assembly;
- binary movement unavailable through the normal bridge;
- OS/browser automation needed for a final integration;
- final packaging/release seam.

Do not use Work/WSA for:
- Hub maintenance;
- source census;
- status summaries;
- routine GitHub writes;
- optional visual tuning;
- ordinary review HTML;
- briefing generation.

## 12. Blender / Resident production rule

Blender MCP is a productive authoring lane.

After one real fixture proves the pipeline, related Resident work may be processed as a **batch**, not as one governance cycle per clip.

Typical batch:
```
real Resident source
→ existing / candidate motion audition
→ author or tune motion
→ contact/prop check
→ Action/NLA + GLB export
→ contact sheet/GIF or browser preview
→ next queued performance
```

Human gates should be about visible performance quality, not intermediate bone tables.

Runtime gameplay remains with the consumer; Blender owns authoring/export only.

## 13. WorldBuilder production rule

WB-W0 is a measured foundation candidate, not the final product.

After Georg's foundation decision, WorldBuilder should progress as coherent usable capabilities.

Default sequence:
1. **Foundation** — scale, walkability, Globe→Region.
2. **Authoring** — accepted WB2 sculpt + shared object editor + Save/Reload.
3. **Look repair** — tree/material, animation blend, outline policy.
4. **World content** — OSM/road/building/landmark grammar.
5. **Mobility** — vehicle/track handoff.
6. **Atmosphere** — sky/weather/time only after the world is useful.
7. **God Mode** — broader authoring/navigation only after local creation works.

Each step may contain several internal technical changes. Georg gets one coherent review result per useful capability.

## 14. Architecture stewardship

The KFB Web Architecture lane owns:
- production-flow rules;
- owner/bridge boundaries;
- self-service job format;
- Hub job/status schema;
- deciding when a process step is architecture vs product work;
- reducing unnecessary integration cost.

It does **not** become:
- WorldBuilder runtime owner;
- ToolBox runtime owner;
- Resident/Animation owner;
- Racer/Travel/Combat owner;
- a second Asset Library;
- a new universal runtime.

If this chat dies, a replacement architecture chat recovers from this workflow and the branch/PR state rather than reconstructing decisions from conversation history.

## 15. Success metric

The process is improving when:
- Georg can start a READY brief without a planning review first;
- visual questions are answered in a direct artifact before deployment;
- fewer active PRs represent more usable functionality;
- authoring tools spend most of their context authoring;
- Cloudflare publishes milestones rather than debug turns;
- Recovery remains available without being paid on every successful iteration.

## Current immediate migration

Do not reorganize every historical file now.

Apply v3 prospectively:
1. new work uses v3;
2. no new micro-PRs unless independently valuable;
3. existing active lanes remain source truth;
4. superseded/frozen PR cleanup is a separate cheap hygiene operation;
5. Hub consumes the new briefing catalog after the current HUB-CTRL lane is reconciled.

No automatic merge or Live promotion is authorized by this document.
