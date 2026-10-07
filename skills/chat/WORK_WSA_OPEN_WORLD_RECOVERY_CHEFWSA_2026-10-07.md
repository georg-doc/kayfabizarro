# Work / WSA · KFB Open World Recovery Lead / ChefWSA · 2026-10-07

Status: **READY · FRESH CONTEXT · READ-ONLY PRODUCT RECOVERY**
Executor: **ChatGPT Work/WSA · Recovery Lead / ChefWSA**
Mode: **RECOVERY / RESEARCH**
Product owner: **KFB Open World / WorldBuilder**
Recovery documentation branch: `recovery/open-world-master-acceptance-audit-2026-10-07`
Human owner: **Georg**

## Outcome

Produce one independently challenged recovery plan that preserves the **complete KFB Open World MVP contract** and maps every required capability to its best verified donor, receiving owner and acceptance proof.

Do **not** implement the Open World.

The product-level status is binary:

- `MVP PASS · COMPLETE ACCEPTANCE MATRIX GREEN`
- `NO MVP · ACCEPTANCE MATRIX NOT FULLY GREEN`

Anything short of every required matrix row GREEN is **NO MVP**.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/WORK_OPEN_WORLD_RECOVERY_AUDIT_2026-10-07.md`
5. `skills/chat/recovery/POSTMORTEM_OPEN_WORLD_CONTRACT_COLLAPSE_2026-10-07.md`
6. `skills/chat/KFB_OPEN_WORLD_MVP_ACCEPTANCE_RULE_2026-10-07.md`
7. `skills/chat/KFB_OPEN_WORLD_POST_FREEZE_TERRAIN_OWNERSHIP_GUARD_2026-10-07.md`
8. `skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md`
9. `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`
10. `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`
11. Issue #360
12. Draft PR #348 + current Return/Recovery/status + the binding One-Shot and integration matrix
13. Dropbox exact candidate source: `/CLAUDE/KFB Open World`, especially `RETURN.md`, `docs/ARCHITECTURE_AS_BUILT.md`, `docs/FREEZE_GAP_CHECK.md`, `docs/STATUS.json` and actual `src/`

Do not substitute chat summaries for available source.

## Authority split

This is binding:

- **Explicit Georg decisions + binding GitHub contracts define WHAT the MVP requires.**
- **Dropbox Coworker source defines only WHAT THAT CANDIDATE ACTUALLY CONTAINS.**
- Candidate specs/Returns/Freeze docs can prove presence, absence or quality, but can never delete/downgrade a product requirement.
- PR #348/WB2 and older candidates are donor/evidence lineages unless a current contract names ownership.
- Conflicts stay visible as conflicts. Do not invent a synthesis.

## First action · CONTRACT FREEZE

Before donor selection:

1. open `skills/chat/recovery/OPEN_WORLD_MVP_REQUIREMENTS_2026-10-07.json`;
2. treat its 43 rows as the binding **input ledger** and anti-feature-loss baseline;
3. independently reconstruct the complete contract from the sources above;
4. add any genuinely missing binding requirements;
5. remove/weaken a required row only for:
   - an explicit Georg product decision; or
   - a demonstrable duplicate/misread confirmed by the fresh independent critic;
6. freeze stable Requirement IDs;
7. only then populate donor/owner/proof decisions.

Candidate limitations, effort or absent code never remove a row.

## Living Doc

Interactive human-facing projection:

`https://kayfabizarro.pages.dev/kfb-hub/stage/open-world-mvp/`

Source:
- ledger: `skills/chat/recovery/OPEN_WORLD_MVP_REQUIREMENTS_2026-10-07.json`
- HTML projection: `skills/chat/recovery/OPEN_WORLD_MVP_LIVING_DOC_2026-10-07.html`

Rules:

- the **JSON ledger is canonical for this audit**;
- the HTML is read-only presentation, never a second SSOT;
- update the JSON at material audit milestones;
- the published HTML loads the recovery-branch ledger live and falls back to its published/embedded copy;
- never display “% MVP complete”, “almost MVP”, “receiving-core MVP” or equivalent;
- counts/distributions are allowed only below the binary product status.

## Matrix columns

Use:

| Requirement ID | Required capability | Binding source / decision | Product meaning | Acceptance state | Best verified donor/candidate | Donor role | KEEP / ADAPT / REJECT / MISSING | Receiving owner | Required acceptance proof | Evidence | Relative effort |

Acceptance state:
- `GREEN`
- `PARTIAL`
- `MISSING`
- `CONFLICT`
- `UNPROVEN`

Donor role:
- `MECHANISM`
- `PRESENTATION`
- `CONTENT_DATA`
- `OWNER`

Effort:
- `SMALL`
- `MEDIUM`
- `LARGE`
- `REBUILD-RISK`
- `N/A`

## Mandatory audits

You must specifically resolve:

- Continuous Terrain / Hex ownership;
- authoritative support height / Ramp / Slope ownership;
- stable WorldObjectId and batching-vs-identity;
- God Mode / direct authoring;
- Terrain Sculpt;
- Save / export / fresh reload / persistence;
- Base Recipe → Authoring Override → Dynamic State;
- Asset Librarian / source isolation;
- Ground controls + camera arbitration;
- K2 / Clay Golden path;
- Motion SSOT;
- Joyride Track Core;
- Sky/Environment;
- Resident + ChatterBox;
- Card + Almanac;
- Billboard/media;
- Audio;
- Vehicle/Drive;
- signature/transition/Curtain compatibility;
- public APIs / semantic events;
- simulation LOD;
- QA/critic/whole-product gates.

## Visual donor gate

For Joyride, Clay/K2, KayKit/Kenney/KFB assets, Residents/Atlas, Billboard/media, signature modules and Curtain:

**loaded URL/file/model ≠ source proof.**

Show/inspect the actual source object/design in isolation before classifying visual identity as KEEP/ADAPT. Record the exact source pin and evidence. Otherwise presentation/source fidelity remains `UNPROVEN`.

## Protected boundary

No writes to:
- Open World runtime/product code;
- PR #348 runtime;
- Coworker local repo;
- camera/Hex/terrain implementation;
- God Mode/Persistence implementation;
- module integration;
- product Site;
- merge/Live promotion.

Allowed writes:
- recovery/audit docs on the recovery branch;
- the recovery JSON ledger;
- factual Issue #360 status;
- Hub routing metadata only when the P0 route materially changes.

After every GitHub write, fetch the exact branch head and intended files. Timeout = `UNKNOWN`; inspect before retry.

## Independent execution

- **Recovery Lead / ChefWSA:** only audit-doc writer.
- **Evidence Auditor / Tester:** source/evidence facts only.
- **Fresh Independent Critic:** no Builder transcript, no production writes; hunts missing requirements, wrong donors, false GREENs and ownership conflicts.
- **Production Guard:** incorporates critic corrections and returns only READY or BLOCKED.

Do not self-certify.

## Required artifacts

Complete:

1. `skills/chat/recovery/OPEN_WORLD_MASTER_ACCEPTANCE_MATRIX_2026-10-07.md`
2. `skills/chat/recovery/OPEN_WORLD_DONOR_CENSUS_2026-10-07.md`
3. `skills/chat/recovery/OPEN_WORLD_ARCHITECTURE_FREEZE_AUDIT_2026-10-07.md`
4. `skills/chat/recovery/OPEN_WORLD_RECOVERY_RETURN_2026-10-07.md`
5. updated `skills/chat/recovery/OPEN_WORLD_MVP_REQUIREMENTS_2026-10-07.json`
6. Living Doc remains synchronized and usable from the Hub route.

## Georg-facing Return

Plain German only:

1. **Was ist kaputt?**
2. **Was können wir retten?**
3. **Was fehlt zwingend?**
4. **Was ist der empfohlene Recovery-Weg?**
5. **Was musst du jetzt tun?** Preferably: **nichts**, unless a real product decision exists.

Technical refs only under:

**Technischer Nachweis — nur für ausführende Chats**

## Done when

- complete numbered contract is frozen;
- every required row has an honest state;
- best donor + donor role is proven for every row;
- Hex role is classified;
- God Mode / Terrain Sculpt / Persistence path is identified;
- Freeze decisions are classified;
- independent critic corrections are incorporated;
- exactly one later implementation strategy remains;
- Living Doc represents the same matrix;
- no production implementation has begun.

Final gate only:

`RECOVERY PLAN READY · SAFE TO AUTHORIZE ONE INTEGRATOR`

or

`RECOVERY PLAN BLOCKED · <one concrete missing source/product decision>`
