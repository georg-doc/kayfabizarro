# Work / WSA · KFB Open World Recovery Lead · Fresh Audit Brief · 2026-10-07

Status: **READY · AUDIT ONLY · NO PRODUCT RUNTIME WRITES**
Executor: **ChatGPT Work/WSA · Recovery Lead / ChefWSA**
Owner: **KFB Open World / WorldBuilder**
Recovery documentation branch: `recovery/open-world-master-acceptance-audit-2026-10-07`
Human owner: **Georg**

## Outcome

Produce one defensible recovery plan for the **complete** KFB Open World MVP before any further implementation is authorized.

Do not build, repair, publish or merge the Open World. Freeze the complete contract, map every requirement to a verified donor or mark it missing/conflicted, challenge that mapping independently, and leave exactly one safe implementation strategy for a later single Integrator.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/WORK_OPEN_WORLD_RECOVERY_AUDIT_2026-10-07.md` **from this recovery branch**
5. `skills/chat/recovery/POSTMORTEM_OPEN_WORLD_CONTRACT_COLLAPSE_2026-10-07.md`
6. `skills/chat/KFB_OPEN_WORLD_MVP_ACCEPTANCE_RULE_2026-10-07.md`
7. `skills/chat/KFB_OPEN_WORLD_POST_FREEZE_TERRAIN_OWNERSHIP_GUARD_2026-10-07.md`
8. `skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md`
9. `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`
10. `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`
11. Issue #360
12. Draft PR #348 + current Return / Recovery / ONE_SHOT_STATUS / integration matrix / One-Shot reset contract
13. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`
14. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`
15. `skills/chat/OPEN_WORLD_MVP_HUB_LIVE_DATA_CONTRACT_2026-10-07.md`
16. `skills/chat/publish/WORK_HUB_OPEN_WORLD_MVP_LIVE_VIEW_ONE_TIME_2026-10-07.md`

Then inspect exact Coworker source in Dropbox: `/CLAUDE/KFB Open World`.

At minimum: `RETURN.md`, `SPEC_KFB_OPEN_WORLD_01.md`, `docs/ARCHITECTURE_AS_BUILT.md`, `docs/FREEZE_GAP_CHECK.md`, `docs/STATUS.json`, and actual `src/`.

## Authority rule

**GitHub binding product contracts + explicit Georg decisions define WHAT the MVP is.**

**Dropbox Coworker source defines only WHAT THAT CANDIDATE IS.**

Candidate docs may prove candidate state but may never delete, downgrade or postpone away a binding MVP requirement. PR #348/WB2 and older products are donor/evidence lineages, not automatic receiving owners. Record conflicts; do not silently synthesize them.

## Protected boundary

Allowed writes: recovery/audit docs on `recovery/open-world-master-acceptance-audit-2026-10-07`, Master Matrix, Donor Census, Freeze Audit, Recovery Return, machine-readable MVP ledger, interactive Living Doc, factual Issue #360 result after audit completion.

Forbidden: Open World runtime, PR #348 runtime, Coworker source, camera/Hex/terrain repair, God Mode/Persistence implementation, KFB module integration, **Open World product Site/Stage publication**, merge or Live promotion.

Explicit control-surface exception requested by Georg: the read-only MVP Living Doc must be integrated into the **existing KFB Production Hub GPT Site** at `https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp`. No Cloudflare route is part of this workflow. This Hub view is an audit projection only; it is never product runtime, MVP acceptance, or a substitute for the final playable Site.

## Execution order

### Phase 0 · CONTRACT FREEZE
Reconstruct and number the complete requirement ledger **before donor selection**. Separate explicit NON-BLOCKERS. Candidate limitations never remove rows.

Keep synchronized:
- `skills/chat/recovery/OPEN_WORLD_MVP_REQUIREMENTS_2026-10-07.json`
- `skills/chat/recovery/OPEN_WORLD_MVP_LIVING_DOC_2026-10-07.html`

The HTML is a projection, not a second contract.

Hub/Site projection route: `https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp`.

Stable live feed: `main/kfb-hub/live/open-world-mvp.json`.

The existing Production Hub Site is the only human surface. In this same Work/WSA run, perform exactly one bounded in-place Site shell update on the existing project `appgprj_6ab7358322a8819183d2fa036b7b12f9` to add the internal `?view=open-world-mvp` view. Load the **exact current published Site source first**; do not reconstruct it from stale `kfb-hub/index.html` or an older donor. Preserve all accepted Hub v10 controls, Resident overlay, local state, live-board loader and live-CSS loader.

The new view must fetch `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/kfb-hub/live/open-world-mvp.json` using `cache: no-store` and render the same matrix/architecture/detail behavior as the prepared Living Doc HTML. Bundle a local fallback copy so the view remains usable if GitHub fetch fails.

After the one Site publish, prove the **no-more-Work path**:
1. record the exact Site version/deployment;
2. make one harmless JSON-only revision/updatedAt change in `main/kfb-hub/live/open-world-mvp.json`;
3. refresh the exact Production Hub `?view=open-world-mvp` URL;
4. visibly confirm the new revision/data appears;
5. confirm the Site version/deployment did not change;
6. restore/advance the JSON to the truthful current audit state using GitHub only.

PASS only if future routine matrix/status changes are `Web Chat → GitHub main JSON → Hub refresh` with **no Work/Sites republish**.

### Phase 1 · Donor census
For every required row record:
- acceptance: GREEN / PARTIAL / MISSING / CONFLICT / UNPROVEN;
- best donor;
- donor role: MECHANISM / PRESENTATION / CONTENT_DATA / OWNER;
- KEEP / ADAPT / REJECT / MISSING;
- receiving owner;
- evidence;
- acceptance proof;
- effort: SMALL / MEDIUM / LARGE / REBUILD-RISK / N/A.

A working mechanism donor does not inherit presentation/content/data ownership.

### Phase 2 · Source isolation
For Joyride, K2/Clay, KayKit/Kenney/KFB visible assets, Resident/Atlas, Billboard/media, signature modules and Theatre Curtain: path/URL/load is not proof. Inspect the actual source object/design in isolation before visual KEEP/ADAPT. Otherwise presentation/source fidelity stays UNPROVEN.

### Phase 3 · Architecture audits
Mandatory:
- exact Hex classification;
- authoritative support-height ownership;
- God Mode/Object Edit/Terrain Sculpt/Save/Fresh Reload/Persistence donor route;
- Coworker Freeze classification;
- stable WorldObject identity;
- single-writer/API/arbitration seams;
- preserve surface-agnostic Coworker mechanisms where valid.

Do not implement.

### Phase 4 · Independent challenge
Fresh-context critic receives original target, binding sources, frozen ledger, donor census and architecture audit. It returns corrections only: missing rows, false GREENs, wrong donors, source identity gaps, owner conflicts.

### Phase 5 · Recovery Return
Write:
1. `skills/chat/recovery/OPEN_WORLD_MASTER_ACCEPTANCE_MATRIX_2026-10-07.md`
2. `skills/chat/recovery/OPEN_WORLD_DONOR_CENSUS_2026-10-07.md`
3. `skills/chat/recovery/OPEN_WORLD_ARCHITECTURE_FREEZE_AUDIT_2026-10-07.md`
4. `skills/chat/recovery/OPEN_WORLD_RECOVERY_RETURN_2026-10-07.md`
5. synchronized JSON ledger + HTML Living Doc.

Primary Georg-facing Return, plain German:
1. Was ist kaputt?
2. Was können wir retten?
3. Was fehlt zwingend?
4. Was ist der Recovery-Weg?
5. Was musst du jetzt tun? Preferably: nichts.

Technical refs only under **Technischer Nachweis — nur für ausführende Chats**.

## Phase 6 · one-time Production Hub Site migration

In the **same Work/WSA run**, after the Living Doc/live feed is coherent enough to render truthfully, execute:

`skills/chat/publish/WORK_HUB_OPEN_WORLD_MVP_LIVE_VIEW_ONE_TIME_2026-10-07.md`

This is the only Site publication authorized by this Recovery run.

It must:
- update the existing Production Hub project in place;
- add `?view=open-world-mvp`;
- preserve the exact accepted current Hub shell and local state;
- live-load `main/kfb-hub/live/open-world-mvp.json`;
- prove a later JSON-only change appears after refresh with no second Site version/deployment;
- leave Cloudflare completely out of this workflow.

Do not end the run before the no-republish proof is either PASS or factually BLOCKED by one concrete Site limitation.

## MVP status rule

Use only:
- **MVP PASS · COMPLETE ACCEPTANCE MATRIX GREEN**
- **NO MVP · ACCEPTANCE MATRIX NOT FULLY GREEN**

Counts/distributions are allowed below that. No percentage-complete, near-MVP, mostly-done or Receiving-Core roll-up.

## Independent execution

Recovery Lead/ChefWSA = only audit-document writer. Evidence Auditor = factual checks only. Independent Critic = fresh context/read-only. Production Guard = final READY/BLOCKED classification. Georg = no debugging.

## Done when

Complete ledger frozen; every required row has a state; visual donors source-isolated or UNPROVEN; Hex classified; God Mode/Persistence route identified; Freeze decisions classified; critic corrections incorporated; JSON/HTML/Markdown agree; exactly one implementation strategy remains.

Final gate only:

`RECOVERY PLAN READY · SAFE TO AUTHORIZE ONE INTEGRATOR`

or

`RECOVERY PLAN BLOCKED · <one concrete missing source/product decision>`

Do not start implementation.
