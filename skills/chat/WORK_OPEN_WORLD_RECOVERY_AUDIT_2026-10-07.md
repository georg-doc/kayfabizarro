# Work / WSA · KFB Open World Recovery Audit · 2026-10-07

Status: **READY · FRESH CONTEXT · READ-ONLY PRODUCT RECOVERY AUDIT**
Executor role: **Recovery Lead / ChefWSA**
Mode: **RECOVERY / RESEARCH — NO PRODUCT RUNTIME WRITES**
Owner: **KFB Open World / WorldBuilder**
Human owner: **Georg**
Recovery documentation owner: **this audit branch only**
Recovery branch: `recovery/open-world-master-acceptance-audit-2026-10-07`
Protected read-only donor lineages: **PR #348 / WB2 runtime** and **Dropbox /CLAUDE/KFB Open World**

## 0 · Your job

Do not build the next Open World.

First reconstruct what the product was actually supposed to be and prove which existing candidate/donor should supply each required capability.

There have been multiple failed/incomplete product candidates and repeated scope drift.

Your output must prevent a fourth incomplete hybrid.

## 1 · Read first

From current GitHub state:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/recovery/POSTMORTEM_OPEN_WORLD_CONTRACT_COLLAPSE_2026-10-07.md`
5. `skills/chat/KFB_OPEN_WORLD_MVP_ACCEPTANCE_RULE_2026-10-07.md`
6. `skills/chat/KFB_OPEN_WORLD_POST_FREEZE_TERRAIN_OWNERSHIP_GUARD_2026-10-07.md`
7. Issue #360
8. Draft PR #348 and its current source/Return/Recovery/status
9. On PR #348 branch:
   - `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_ONE_SHOT_PRODUCTION_RESET_2026-10-05.md`
   - `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_EXISTING_SYSTEM_INTEGRATION_MATRIX_2026-10-05.md`
   - current `ONE_SHOT_STATUS.json` / Return / Recovery
10. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`
11. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`
12. `skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md`
13. `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`
14. `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`

Then inspect the exact current Coworker source directly from Dropbox:

`/CLAUDE/KFB Open World`

Important Coworker files:
- `RETURN.md`
- `docs/ARCHITECTURE_AS_BUILT.md`
- `docs/FREEZE_GAP_CHECK.md`
- `docs/STATUS.json`
- actual source under `src/`

Do not rely on chat summaries where the source can be inspected directly.

### 1A · Authority split — binding

Do not let a candidate redefine the product.

- **GitHub binding product contracts + explicit Georg decisions define WHAT the MVP must contain.**
- **Dropbox `/CLAUDE/KFB Open World` defines WHAT THE COWORKER CANDIDATE ACTUALLY IS.**
- Coworker `SPEC_KFB_OPEN_WORLD_01.md`, `RETURN.md`, Freeze docs and source may prove presence/absence/quality in that candidate, but they may **never remove, downgrade or postpone away** a GitHub product requirement.
- PR #348 / WB2 and older lineages are donor/evidence sources unless a current binding contract explicitly names them as owner.
- If authorities conflict, record the conflict. Do not invent a synthesis and do not silently pick the newest candidate.

## 2 · Hard restriction

**DO NOT IMPLEMENT OR MODIFY THE OPEN WORLD RUNTIME.**

Allowed writes:
- audit documents;
- recovery matrix;
- factual Return;
- routing/status documentation needed to preserve the audit;
- the read-only MVP Living Doc / Hub audit projection explicitly requested by Georg at `https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp`.

Not allowed:
- terrain rewrite;
- Hex rewrite;
- camera repair;
- God Mode integration;
- persistence integration;
- Residents / Audio / Track / Cards / Billboard / Drive integration;
- **Open World product** Site publication;
- merge / Live promotion.

The purpose of this run is to establish reliable truth before more money/time is spent.

### 2A · Write boundary — binding

All Recovery Audit writes belong only on:

`recovery/open-world-master-acceptance-audit-2026-10-07`

PR #348 / WB2 and Dropbox Coworker source are **READ-ONLY evidence/donor lineages** during this audit.

Do not write audit material into PR #348 and do not modify the Coworker local repository.
Do not merge this audit branch automatically.

After every GitHub write:
1. fetch the exact branch head;
2. fetch the intended file back;
3. record timeout as `UNKNOWN` and inspect before retrying.

### 2B · Phase 0 CONTRACT FREEZE — before donor inspection

Before selecting donors or proposing architecture:

1. reconstruct the complete MVP requirement list from explicit Georg decisions + binding contracts;
2. assign every required row a stable Requirement ID;
3. mark explicit non-blockers separately;
4. freeze that requirement ledger;
5. only then inspect candidates/donors to populate the rows.

After this freeze, a required row may leave or materially weaken only through:
- an explicit Georg product decision; or
- a factual correction accepted from the fresh independent critic because the row duplicated/misread the binding source.

Candidate limitations, implementation cost, missing donor code or a local spec **never remove a requirement**.

## 3 · Recover the complete product contract

Do not start from the latest candidate.

Start from explicit Georg decisions plus the binding product contracts.

Build a **Master Acceptance Matrix**.

Required columns:

| Requirement ID | Required capability | Binding source / decision | Product meaning | Acceptance state | Best verified donor/candidate | Donor role | KEEP / ADAPT / REJECT / MISSING | Receiving owner | Required acceptance proof | Evidence | Relative effort |

Rules:

- a capability cannot disappear because it is absent from the newest candidate;
- “later” does not mean “removed from final product”;
- a mechanism donor does not automatically own presentation/content/data;
- source bytes existing somewhere is not enough — prove the donor and exact capability;
- identify conflicting authorities explicitly rather than inventing a synthesis;
- use only these **Acceptance states**: `GREEN`, `PARTIAL`, `MISSING`, `CONFLICT`, `UNPROVEN`;
- use only these **Donor roles** where applicable: `MECHANISM`, `PRESENTATION`, `CONTENT_DATA`, `OWNER`;
- never infer presentation/content/data ownership from a working mechanism donor;
- relative effort is only `SMALL`, `MEDIUM`, `LARGE`, `REBUILD-RISK` or `N/A`.

### 3B · Visual/design donor isolation gate

For every visual/design-sensitive donor (including Joyride, K2/Clay, KayKit/Kenney/KFB assets, Residents/Atlas, Billboard/media, signature modules and Theatre Curtain):

- a filename, URL, manifest entry or successful load is **not donor proof**;
- inspect/show the actual source object/design in isolation before classifying its visual identity as KEEP/ADAPT;
- record the source pin and isolation evidence in the donor census;
- if source isolation is unavailable, the donor remains `UNPROVEN` for presentation/source-fidelity acceptance.

## 3A · Product-level MVP rule

Binding policy:
`skills/chat/KFB_OPEN_WORLD_MVP_ACCEPTANCE_RULE_2026-10-07.md`

For Open World, subsystem progress is not an MVP.

Use only these product-level statuses:
- `MVP PASS · COMPLETE ACCEPTANCE MATRIX GREEN`
- `NO MVP · ACCEPTANCE MATRIX NOT FULLY GREEN`

The historical label `Receiving Core` may describe a subsystem snapshot only. It must not be used as a product-progress substitute, near-MVP status or acceptance shorthand.

A single required matrix row that is partial, missing, conflicted, unproven or below its required acceptance proof means **NO MVP**.

Do not summarize a partly green matrix upward into an aggregate “mostly done” product status.

## 4 · Candidate / donor census

Audit all materially relevant lineages, not just the newest one.

At minimum inspect:

### A · Current Coworker Open World
Dropbox:
`/CLAUDE/KFB Open World`

Determine what is genuinely KEEP-quality:
- movement;
- collision;
- streaming;
- world generation;
- roads;
- rivers;
- bridges;
- villages/farms;
- nature;
- events/services;
- performance;
- camera evidence;
- any other reusable mechanism.

Also record what is absent or conflicting.

### B · WB2 / World Studio / PR #348 lineage
Recover proven authoring and integrated-system capabilities, including where actually evidenced:
- God Mode;
- object edit;
- Terrain Sculpt;
- Save / export / import / fresh reload;
- source isolation / Asset Librarian;
- existing KFB module seams;
- integrated Residents/ChatterBox;
- Card/Almanac;
- Joyride/Track;
- Drive;
- Billboard;
- Audio;
- signature/transition modules.

Do not assume all are still good.
Classify evidence honestly.

### C · Any earlier continuous-terrain / WorldBuilder donors required by the binding contracts
Especially inspect:
- Continuous Terrain decision;
- support-height ownership;
- World Recipe;
- authoring/persistence donors;
- shared editor donors.

Add other candidate lineages only when a binding feature actually depends on them.

## 5 · Mandatory Terrain / Hex audit

Inspect actual Coworker code.

Determine:
- what creates visible ground geometry;
- what owns authoritative support height;
- what collision samples;
- what roads sample;
- what rivers sample;
- what a chunk represents;
- whether Hex boundaries structurally dictate terrain;
- whether continuous terrain can replace/own the surface without rewriting unrelated working systems.

Return exactly one classification:

`HEX_ROLE = SPATIAL_OR_SEMANTIC_ONLY · FREEZE COMPATIBLE`

or

`HEX_ROLE = MACRO_TERRAIN_OWNER · ARCHITECTURE DRIFT`

If architecture drift is confirmed, identify the smallest migration seam.
Do not implement it.

## 6 · Mandatory God Mode / authoring audit

The Coworker Return currently states:
- no editor;
- no save/load;
- no storage;
- authoring/persistence absent.

The binding product requires:
- PLAY / BUILD / GOD or equivalent;
- real object place/edit;
- Move / Rotate / Scale;
- Place on Ground / Surface Snap;
- Terrain Raise / Lower;
- authored overrides;
- Save;
- fresh reload/import;
- persistent object identity / transform / terrain delta.

Find the best existing verified donor(s).

Do not design a new editor if an existing KFB/WB2 owner already proves the capability.

Return:
- donor;
- actual proven capability;
- missing adaptation seam;
- ownership conflicts;
- evidence.

## 7 · Architecture Freeze review

Treat the current Coworker Freeze as **as-built evidence**, not automatic canon.

For every freeze decision classify:

- ACCEPT AS SURFACE-AGNOSTIC;
- ACCEPT WITH BOUNDARY;
- HOLD — depends on terrain correction;
- REJECT — contradicts binding product decision;
- UNPROVEN.

At minimum review:
- one owner per state;
- Height / Ramp / Slope ownership;
- module public APIs;
- Event Layer;
- Persistence boundary:
  `Base Recipe → Authoring Override → Dynamic State`;
- Control / Camera arbitration;
- stable WorldObjectId;
- material owner K2;
- simulation LOD;
- render batching vs semantic identity.

## 8 · Missing-feature audit

Your matrix must explicitly account for at least:

- Continuous Terrain / Surface Truth;
- deterministic seeded world / streaming;
- player movement / collision;
- camera;
- roads / rivers / bridges;
- villages / farms / nature / semantic props;
- KFB Clay / K2;
- God Mode / Object Edit;
- Terrain Sculpt;
- Persistence / Save + fresh reload;
- Asset Librarian / source isolation;
- Sky / Environment;
- Joyride Track;
- Drive / Vehicle;
- Resident + ChatterBox;
- Card + Almanac;
- Billboard / media;
- Audio;
- signature / transition / Curtain compatibility;
- stable WorldObject identity;
- APIs / semantic events;
- control arbitration;
- simulation LOD.

Recover additional required items from the binding One-Shot contract.

Do not shrink this list for convenience.

## 9 · Cost-control rule

This audit is meant to stop further blind spending.

Do not propose a giant rewrite until you have shown:

1. which existing mechanisms can be kept;
2. which features already have verified donors;
3. which seams are genuinely missing;
4. which failures are architectural rather than cosmetic.

For each missing seam estimate only relative effort:
- SMALL;
- MEDIUM;
- LARGE;
- REBUILD-RISK.

Do not give false precision in hours or money.

## 10 · Independent challenge

After your Master Acceptance Matrix is complete:

Run or hand the matrix to a **fresh-context independent critic**.

That critic:
- does not edit production;
- receives the original product target + sources + your matrix;
- tries to find missing requirements, wrong donors, false PASSes and ownership conflicts;
- returns corrections only.

Do not self-certify the final recovery plan.

### 10A · Independent execution roles — binding

- **Recovery Lead / ChefWSA:** only writer of audit/recovery documentation on the recovery branch. No product/runtime writes.
- **Integration Tester / Evidence Auditor:** factual source/evidence checking only; does not certify the plan.
- **Independent Critic:** fresh context, no Builder transcript, no production writes, challenges completeness, donors, false GREENs and ownership conflicts.
- **Production Guard:** applies critic corrections and decides only `RECOVERY PLAN READY` vs `RECOVERY PLAN BLOCKED`.

No role may modify the production runtime during this audit.

## 11 · Required artifacts

Write documentation only:

1. `skills/chat/recovery/OPEN_WORLD_MASTER_ACCEPTANCE_MATRIX_2026-10-07.md`
2. `skills/chat/recovery/OPEN_WORLD_DONOR_CENSUS_2026-10-07.md`
3. `skills/chat/recovery/OPEN_WORLD_ARCHITECTURE_FREEZE_AUDIT_2026-10-07.md`
4. `skills/chat/recovery/OPEN_WORLD_RECOVERY_RETURN_2026-10-07.md`
5. `skills/chat/recovery/OPEN_WORLD_MVP_REQUIREMENTS_2026-10-07.json` — frozen machine-readable requirement ledger
6. `skills/chat/recovery/OPEN_WORLD_MVP_LIVING_DOC_2026-10-07.html` — interactive visual projection/reference implementation
7. `main/kfb-hub/live/open-world-mvp.json` — stable Production-Hub live-data projection

The Recovery JSON ledger, Markdown Master Acceptance Matrix and `main/kfb-hub/live/open-world-mvp.json` must remain synchronized at every material audit checkpoint. The HTML/Hub view is a **projection**, never a second product contract.

After the one-time Production Hub Site shell update, routine changes use only:
`Recovery/Chat audit → GitHub main kfb-hub/live/open-world-mvp.json → Production Hub refresh`.
No further Work/Sites publish is allowed merely to update requirement states, donors, evidence, counts or product status.

The Living Doc must always display the product-level result binarily:
- `MVP PASS · COMPLETE ACCEPTANCE MATRIX GREEN`; or
- `NO MVP · ACCEPTANCE MATRIX NOT FULLY GREEN`.

It may show distributions/counts below that, but no percentage-complete or “almost MVP” roll-up.

Update Issue #360 only with the factual recovery result.

Do not modify runtime/product files.

The Living Doc is an internal read-only view of the existing KFB Production Hub GPT Site. Publishing/updating that Hub view does not authorize product runtime publication and must never be reported as an Open World MVP candidate. **No Cloudflare route belongs to this Living Doc workflow.**

## 12 · ChefWSA communication contract — binding

Your communication to Georg is part of the acceptance criteria.

Georg is the product owner, not the Git operator.

### Primary Georg-facing Return

Write in **German**, plain language.

Maximum structure:

1. **Was ist kaputt?**
2. **Was können wir retten?**
3. **Was fehlt zwingend?**
4. **Was ist der empfohlene Recovery-Weg?**
5. **Was musst du jetzt tun?** — preferably `nichts` unless a real product decision exists.

Do **not** put these in the primary Georg-facing section:
- commit hashes;
- branch names;
- PR heads;
- run IDs;
- blob IDs;
- file-count dumps;
- long path lists;
- internal agent jargon;
- raw test counters unless one directly changes the product decision.

Do not make Georg decode repository mechanics.

### Technical appendix

Put all technical traceability under:

**Technischer Nachweis — nur für ausführende Chats**

That appendix may contain:
- repo / branch / PR / exact head;
- file paths;
- hashes;
- test IDs;
- evidence tables;
- source pins.

The appendix is for executors and recovery, not Georg's operating instructions.

## 13 · Stop condition

Stop this audit when:

- the complete product contract is reconstructed;
- every required capability has a state;
- best existing donors are mapped;
- Hex role is classified;
- God Mode / Persistence donor path is identified;
- Freeze decisions are classified;
- independent critic corrections are incorporated;
- exactly one implementation strategy can be handed to a later Integrator.

Do not begin implementation.

## 14 · Final gate

Return one of:

`RECOVERY PLAN READY · SAFE TO AUTHORIZE ONE INTEGRATOR`

or

`RECOVERY PLAN BLOCKED · <one concrete missing source/product decision>`

No other next step.
