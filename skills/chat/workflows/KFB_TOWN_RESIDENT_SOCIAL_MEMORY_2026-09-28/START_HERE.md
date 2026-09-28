# KFB Town · Resident Social Memory · START HERE

Status: **DESIGN REFERENCE CANDIDATE · DOCUMENTED / TESTED · NOT IMPLEMENTED**  
Date: 2026-09-28  
Owner: **Georg / KFB Town design reference**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## Outcome

Connect the existing KFB Town Lean Memory direction with:
- `georg-doc/ai-town` as a **mechanism donor** for compact episodic memory, small top-k retrieval, cooldowns and async agent cognition;
- world-owned **Points of Interest** covering player, Residents/NPCs, Cube Pets, nature/plants, environment, resources, props/Cards and activity stations;
- source-backed **routine activities** plus current patrol/explore direction;
- small authored **personal goals/motivations** as attention and conflict drivers;
- a shared KFB **AIDA gameplay loop** for player and NPCs: Attention → Curiosity/Interest → Expectation → Interaction → Reaction → Interpret/Remember → Return/Resume/Retarget;
- existing ChatterBox / semantic Triplets / selectable retorts as the language owner;
- Fluffolekt / Fluff-o-lect as a context-dependent omission register;
- current Brick Fish social interaction candidate;
- current Resident Reaction Choreography candidate.

No second runtime, NPC database, dialogue engine, movement owner, reward owner or relationship score system is created.

## Read order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/town/START_HERE.md`
5. `skills/chat/town/SESSION_CARD.md`
6. `skills/chat/town/references/KFB_RESIDENT_SOCIAL_MEMORY_AI_TOWN_2026-09-28.md`
7. `SOURCE.json`
8. `TEST_REPORT.md`
9. `RETURN.md`

For implementation later, also read the **current heads**, not stale copies, of:
- Brick Fish / Prop Toss candidate;
- Clay Emanata / Reaction Choreography candidate;
- current WorldBuilder/Travel recovery/Return;
- current ToolBox/Resident actor recovery/Return;
- current Journey/Almanac persistence owner;
- current ChatterBox donor selected by the receiving consumer.

## Reserved Stage route

`https://kayfabizarro.pages.dev/kfb-hub/stage/town/resident-social-memory-01/`

Status: **NOT DEPLOYED**.

Do not create a standalone review page for the design contract. Use the route only when `RESIDENT-SOCIAL-MEMORY-01` exists as a meaningful integrated world milestone.

## One next gate

After relevant current recovery blockers clear, implement **RESIDENT-SOCIAL-MEMORY-01** in the real receiving world with:
- two real current Residents;
- one bounded POI perception/search loop;
- one source-backed resumable routine;
- one personal-goal/motivation-backed AIDA cycle;
- Brick Fish plus one Card/gift context;
- witness-specific event receipts;
- one bounded social thread;
- later recall;
- ChatterBox/Triplet speech;
- one context-valid Fluff-o-lect variant;
- coordinated Reaction Choreography;
- clean recovery to consumer-owned path/activity/dialogue state.


## Execution lane · Web-first / no Work by default

Binding current workflow:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`

For this Resident / POI / routine / AIDA slice:
- **ChatGPT Web + GitHub is the default production lane** for architecture, source recovery, contracts, implementation, tests, Return/changelog and owner integration;
- Claude Design is used only for visual/3D authoring where it materially helps;
- **Work / WSA is escalation-only** and needs a concrete capability gap that Web/Claude cannot perform;
- do not send routine Resident logic, memory, POI search, AIDA, ChatterBox integration, tests or metadata maintenance to Work;
- human review should happen in the real Resident/WorldBuilder receiving surface when a meaningful product decision exists, not through a proxy dashboard.

Historical delivery distinction:
- the older Astra Integration delivery contract required a native ChatGPT Site **and** KFB Cloudflare from the same source state when that specific runtime was delivered;
- a ChatGPT Site is therefore a possible private distribution/review mirror, **not a second runtime owner and not the default place where this work is authored**;
- current KFB acceptance links remain the direct `kayfabizarro.pages.dev` route when this slice reaches a meaningful integrated Stage milestone.

For the present design-only slice:
- no Work escalation;
- no ChatGPT Site deployment;
- no Cloudflare deployment;
- continue repository-native Web/GitHub persistence only.
