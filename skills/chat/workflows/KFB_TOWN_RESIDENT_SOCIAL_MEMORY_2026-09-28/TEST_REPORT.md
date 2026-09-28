# TEST REPORT · KFB Town Resident Social Memory · 2026-09-28

Status: **DOCUMENTATION / DONOR-SYNTHESIS TESTED · NO RUNTIME TEST CLAIM**

Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## Actual checks

### Source reads

**13 / 13 PASS**

Verified directly from current GitHub state:
1. `georg-doc/ai-town` main ref;
2. AI Town `ARCHITECTURE.md`;
3. AI Town `convex/agent/memory.ts`;
4. AI Town `convex/agent/schema.ts`;
5. AI Town `convex/aiTown/agent.ts`;
6. AI Town `convex/aiTown/agentOperations.ts`;
7. KFB Town `LIVING_KFB_TOWN.md`;
8. KFB ChatterBox/Tourbus reuse reference;
9. KFB Fluff-o-lect meta-narration source;
10. KFB Brick Fish Draft PR #254;
11. KFB Reaction Choreography Draft PR #256;
12. KFB Overworld Living Concept resource/routine source;
13. Resident Scene Modules activity backlog.

The first design checkpoint initially carried one truncated/incorrect Fluff-o-lect blob SHA due to connector output truncation. It was caught by read-back and corrected before this report. Current exact pin:
`9ca3ed0a9987fbb11d0721f5689d6040943403d5`.

### Machine-readable source manifest

**1 / 1 PASS**

`SOURCE.json` parses as JSON and contains exactly **13** pinned source entries plus the explicitly separated current user directions for POIs, routines, KFB AIDA and goals/motivations.

### Design invariant checks

Final rerun: **24 / 24 PASS**

Checked against the committed design reference and source manifest:

1. source JSON parse;
2. exact AI Town donor HEAD present;
3. ChatterBox + Triplet lineage present;
4. Fluff-o-lect present;
5. `witnessed / told / inferred` knowledge provenance present;
6. bounded `ResidentSocialThread` contract present;
7. Reaction Choreography seam present;
8. Brick Fish social-interaction seam present;
9. explicit no-second-runtime / AI-Town-donor-only boundary present;
10. Stage explicitly `NOT_DEPLOYED`;
11. next gate `RESIDENT-SOCIAL-MEMORY-01` present;
12. source manifest count = 13;
13. POI kinds include player, Resident/NPC, Cube Pet, nature/plants and resources;
14. POI layer is explicitly a query/view, not a second registry;
15. staged sight/range/local-semantic-search contract present;
16. source-backed routine roles include Hammering, Fishing and Pickaxe;
17. Patrol and Explore current-user-direction roles present;
18. personal goals/motivations defined as conflict motor;
19. competing goals do not automatically become hostility/Combat;
20. KFB AIDA sequence present: Attention → Curiosity/Interest → Expectation → Interaction → Reaction → Return/Resume/Retarget;
21. return-to-routine seam covers prior activity / patrol / fishing-smithing-building;
22. perception noise is not persisted as memory;
23. whole-world-per-frame scanning is rejected;
24. AIDA grammar is shared by player and NPC loops.

First automated invariant pass reported **23/24** because the test expression expected an unformatted literal for the no-second-runtime sentence while the document contained Markdown emphasis around “not”. No product/design change was required. The harness assertion was corrected and the full rerun passed **24/24**.

## Runtime / browser / Stage

- runtime code changed: **0 files**
- runtime tests: **0**
- browser tests: **0**
- screenshots: **0**
- Cloudflare Stage deployment: **0**
- Live promotion: **0**

These are intentionally not claimed because this slice is design persistence and donor synthesis only.

## Result

**PASS for documentation/source synthesis.**

This is not an implementation PASS for autonomous Residents, POI perception, routines, AIDA, Lean Memory, ChatterBox, Fluff-o-lect, Brick Fish or Reaction Choreography.

## Next gate

After current relevant ToolBox/WorldBuilder recovery blockers clear, implement **RESIDENT-SOCIAL-MEMORY-01** in the real receiving world with:
- two source-proven Residents;
- one bounded POI search/perception loop;
- one source-backed resumable routine;
- Brick Fish + one Card/gift context;
- one motivation-backed Attention → Interest → Expectation → Interaction → Reaction cycle;
- witness-specific memory receipts;
- one bounded social thread;
- ChatterBox/Triplet speech;
- one context-valid Fluff-o-lect variant;
- coordinated Reaction Choreography;
- clean return to the consumer-owned path/activity/dialogue state.
