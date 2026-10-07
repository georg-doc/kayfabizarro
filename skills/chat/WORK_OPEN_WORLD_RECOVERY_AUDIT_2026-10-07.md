# Work / WSA · KFB Open World Recovery Audit · 2026-10-07

Status: **READY · FRESH CONTEXT · READ-ONLY PRODUCT RECOVERY AUDIT**
Executor role: **Recovery Lead / ChefWSA**
Mode: **RECOVERY / RESEARCH — NO PRODUCT RUNTIME WRITES**
Owner: **KFB Open World / WorldBuilder**
Human owner: **Georg**

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
5. `skills/chat/KFB_OPEN_WORLD_POST_FREEZE_TERRAIN_OWNERSHIP_GUARD_2026-10-07.md`
6. Issue #360
7. Draft PR #348 and its current source/Return/Recovery/status
8. On PR #348 branch:
   - `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_ONE_SHOT_PRODUCTION_RESET_2026-10-05.md`
   - `tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_EXISTING_SYSTEM_INTEGRATION_MATRIX_2026-10-05.md`
   - current `ONE_SHOT_STATUS.json` / Return / Recovery
9. `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`
10. `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`

Then inspect the exact current Coworker source directly from Dropbox:

`/CLAUDE/KFB Open World`

Important Coworker files:
- `RETURN.md`
- `docs/ARCHITECTURE_AS_BUILT.md`
- `docs/FREEZE_GAP_CHECK.md`
- `docs/STATUS.json`
- actual source under `src/`

Do not rely on chat summaries where the source can be inspected directly.

## 2 · Hard restriction

**DO NOT IMPLEMENT OR MODIFY THE OPEN WORLD RUNTIME.**

Allowed writes:
- audit documents;
- recovery matrix;
- factual Return;
- routing/status documentation needed to preserve the audit.

Not allowed:
- terrain rewrite;
- Hex rewrite;
- camera repair;
- God Mode integration;
- persistence integration;
- Residents / Audio / Track / Cards / Billboard / Drive integration;
- Site publication;
- merge / Live promotion.

The purpose of this run is to establish reliable truth before more money/time is spent.

## 3 · Recover the complete product contract

Do not start from the latest candidate.

Start from explicit Georg decisions plus the binding product contracts.

Build a **Master Acceptance Matrix**.

Required columns:

| Required capability | Binding source / decision | Product meaning | Best verified donor/candidate | Current state | KEEP / ADAPT / REJECT / MISSING | Receiving owner | Required acceptance proof |

Rules:

- a capability cannot disappear because it is absent from the newest candidate;
- “later” does not mean “removed from final product”;
- a mechanism donor does not automatically own presentation/content/data;
- source bytes existing somewhere is not enough — prove the donor and exact capability;
- identify conflicting authorities explicitly rather than inventing a synthesis.

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

## 11 · Required artifacts

Write documentation only:

1. `skills/chat/recovery/OPEN_WORLD_MASTER_ACCEPTANCE_MATRIX_2026-10-07.md`
2. `skills/chat/recovery/OPEN_WORLD_DONOR_CENSUS_2026-10-07.md`
3. `skills/chat/recovery/OPEN_WORLD_ARCHITECTURE_FREEZE_AUDIT_2026-10-07.md`
4. `skills/chat/recovery/OPEN_WORLD_RECOVERY_RETURN_2026-10-07.md`

Update Issue #360 only with the factual recovery result.

Do not modify runtime/product files.

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
