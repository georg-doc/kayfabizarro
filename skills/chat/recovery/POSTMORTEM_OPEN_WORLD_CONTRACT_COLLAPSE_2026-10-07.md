# Postmortem · KFB Open World Contract Collapse · 2026-10-07

Status: **PRODUCT / BRIEFING / ROUTING FAIL · RECOVERY REQUIRED · RUNTIME WORK STOPPED**
Owner: **KFB Open World / WorldBuilder**
Incident class: **contract collapse across successive candidates**
Human impact reported by Georg: **roughly one week of work, about EUR 300 spend, and about 32 hours of Coworker runtime without the intended product outcome.**

## 1 · What the product was supposed to be

The binding Open World One-Shot contract on PR #348 did not ask for a movement demo or a bare procedural terrain core.

It explicitly required one coherent product combining:

1. a world worth moving through;
2. direct authoring in that same world:
   - PLAY / BUILD / GOD;
   - Asset Librarian / source isolation;
   - place / move / rotate / scale;
   - terrain Raise / Lower;
   - Save;
   - fresh reload/import;
   - persistence of object identity, transforms and terrain deltas;
3. the existing KFB system stack through its existing owners:
   - Motion;
   - Joyride-presented Track Core;
   - Sky / Environment;
   - Billboard/media;
   - Resident + ChatterBox;
   - Card + Almanac;
   - Audio;
   - Vehicle / Drive;
   - signature/transition modules.

The same product lineage also already contained a binding earlier terrain decision:

**Continuous procedural terrain = PRIMARY macro world surface.**

**Hex = OPTIONAL spatial / semantic / local kit.**

Source:
`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`

It explicitly says not to treat visible Hex tiles as the macro world surface.

## 2 · What the latest Coworker core actually returned

The exact Dropbox source at:

`/CLAUDE/KFB Open World`

reports:

- runnable endless seeded Hex world;
- villages / farms / rivers / bridges / forests / props;
- player movement, collision, six heroes;
- streaming and performance work;
- extensive camera work.

But its own current documents also explicitly report:

### Authoring / persistence
`docs/FREEZE_GAP_CHECK.md`:

> No editor, no save/load, no storage.

`RETURN.md`:

> Authoring and persistence: none.

Therefore the current Coworker core is **not the contracted Open World authoring product**.

### Terrain
The current Return calls the result an “endless, seeded hex world” and lists visible residual Hex/tile reading as an open issue.

Until the actual code is audited, the Hex role is unresolved:

- compatible if Hex is only spatial/semantic partitioning;
- architecture drift if Hex owns visible macro terrain/support topology.

A binding post-freeze guard already records that this cannot be automatically accepted as terrain canon:

`skills/chat/KFB_OPEN_WORLD_POST_FREEZE_TERRAIN_OWNERSHIP_GUARD_2026-10-07.md`

### Existing KFB systems
The Coworker as-built report says the open-world core is the real integrated content and that Residents, Cards, dialogue, vehicles and audio are absent.

Those were allowed to remain outside the Coworker closing rounds, but they were **not removed from the final One-Shot product contract**.

## 3 · Why this is a product-process failure

The technical work is not worthless.

The failure is that successive executions repeatedly changed the de-facto product boundary.

The pattern was:

`current candidate → current subset becomes “the product” → missing original features become “later” → next candidate inherits the reduced scope`

instead of:

`frozen product contract → candidate audited against every required feature → missing feature remains visibly missing`

This created technically competent candidates that repeatedly failed the actual product outcome.

## 4 · Major failures in this incident

### Fail A · The complete product contract was not used as an immutable acceptance checklist

The One-Shot contract explicitly contained God Mode, terrain sculpt, persistence and the representative KFB integration stack.

Nevertheless a later receiving core could be worked for many hours without those requirements being continuously visible as unresolved mandatory product items.

### Fail B · A superseded terrain direction was allowed back into the active path

Continuous macro terrain had already been decided.

Hex was explicitly relegated to optional semantic/local use.

The latest core nevertheless describes itself as a Hex world, and the current freeze began before the Hex role was re-audited against that binding decision.

This is a routing/canon failure even if the later code audit proves the visible terrain can still be decoupled cheaply.

### Fail C · “Receiving core” and “product result” were not kept operationally separate enough

The router described the Coworker output as a receiving core, but the workflow still invested closing-round effort and Architecture Freeze energy into it before proving that it still matched the full product contract.

A receiving core may omit final features.
It may not silently redefine the product that will later be frozen around it.

### Fail D · Existing accepted donors were not protected by a complete donor-to-feature map

Older WB2/World Studio work already contained or proved important capabilities including:
- God Mode / object authoring;
- terrain sculpt;
- save/export/reload;
- native Studio roundtrip;
- already-integrated KFB seams.

The latest core did not consume them.

There was no single binding matrix saying:

`REQUIRED FEATURE → BEST VERIFIED DONOR → RECEIVING OWNER → ACCEPTANCE TEST`

and preventing a required feature from disappearing merely because the newest candidate lacked it.

### Fail E · Architecture Freeze was allowed to start before the candidate passed contract reconciliation

Freeze should lock a product-compatible architecture.

It must not make the newest candidate's accidental omissions or drift harder to undo.

The current freeze may still provide useful as-built analysis, but it is not automatically canonical.

### Fail F · GitHub intake was briefed as though Coworker had GitHub credentials

Coworker prepared a clean intake snapshot but could not push it.

This produced another avoidable handoff failure.

The canonical source is nevertheless recoverable from Dropbox:
`/CLAUDE/KFB Open World`

The recovery must not require Georg to become the Git/GitHub operator.

## 5 · Controls that existed but failed to prevent the incident

Existing process rules already said:
- GitHub state overrides chat memory;
- reuse verified donors;
- one owner;
- outcome first;
- no second runtime owner;
- fresh-chat recovery;
- stop after non-improving repair loops;
- authoring/persistence remained part of #360.

Those rules were insufficient because they did not create one immutable **product acceptance ledger** checked before each major execution/freeze phase.

The system had many local guards but no single global anti-feature-loss gate.

## 6 · What is still valuable and must not be thrown away

The latest Coworker core appears to contain substantial reusable work:

- deterministic seed/world generation;
- chunk streaming and budgets;
- roads;
- rivers;
- bridges;
- villages/farms/rural sites;
- nature/forest generation;
- semantic POI information;
- player locomotion;
- collision/KCC work;
- six-hero switching;
- performance evidence;
- source asset loading;
- event/service plumbing;
- camera failure evidence;
- extensive critic evidence;
- as-built architecture analysis.

Previous WB2 / PR #348 lineages may retain better donors for:

- God Mode;
- shared in-place editor;
- Terrain Sculpt;
- Save / export / import / fresh reload;
- World Studio authoring;
- existing Residents / ChatterBox;
- Card / Almanac;
- Joyride / Track;
- Drive;
- Billboard;
- Audio;
- signature modules / Curtain compatibility.

Recovery must select per capability.
No whole failed candidate is promoted merely because some of its mechanisms are good.

## 7 · Binding recovery principle

Do **not** build “Version 4” by merging three failed products ad hoc.

First reconstruct the product as a fixed matrix:

`REQUIRED FEATURE → ORIGINAL REQUIREMENT → BEST VERIFIED DONOR → CURRENT STATUS → KEEP / ADAPT / REJECT → RECEIVING OWNER → ACCEPTANCE TEST`

A required feature may only leave the matrix by an explicit Georg product decision.

“Not present in the newest candidate” is never a reason to remove it.

## 8 · Mandatory feature baseline for the audit

At minimum the Recovery Audit must account for:

- Continuous Terrain / Surface Truth;
- deterministic seeded world / streaming;
- player movement / collision;
- camera;
- roads / rivers / bridges;
- villages / farms / nature / semantic props;
- KFB Clay / K2 visual canon;
- God Mode / Object Edit;
- Terrain Sculpt;
- Persistence / Save + fresh reload;
- Asset Librarian / source isolation;
- Sky / Environment;
- representative Joyride Track seam;
- Drive / Vehicle seam;
- representative Resident + ChatterBox seam;
- representative Card + Almanac seam;
- Billboard / media seam;
- Audio owner / continuity;
- placeable signature/transition compatibility;
- stable WorldObject identity;
- public module APIs / events;
- control/camera arbitration;
- simulation LOD.

The auditor must recover any additional binding requirements from the actual source contracts rather than treating this list as exhaustive.

## 9 · New hard gates

### Gate 1 · No implementation before contract reconstruction
The next executor is read-only with respect to production runtime.

### Gate 2 · No Architecture Freeze acceptance before terrain-role audit
Return exactly one:
- `HEX_ROLE = SPATIAL_OR_SEMANTIC_ONLY · FREEZE COMPATIBLE`
- `HEX_ROLE = MACRO_TERRAIN_OWNER · ARCHITECTURE DRIFT`

### Gate 3 · No module fan-out before God Mode / persistence ownership is recovered
God Mode, terrain authoring and persistence are required product capabilities, not optional polish.

### Gate 4 · No feature may disappear silently
Every required feature must remain visible as PASS / PARTIAL / ABSENT / CONFLICT until it passes or Georg explicitly removes it.

### Gate 5 · Builder cannot certify its own reconstruction
A separate fresh-context critic reviews the Recovery Auditor's matrix before a new Integrator is authorized.

## 10 · Communication failure and correction

Georg should not have to operate from hashes, branch names, test IDs or implementation jargon.

For all subsequent Recovery Lead / ChefWSA returns:

### Georg-facing section
Use plain German and answer only:
1. Was ist kaputt?
2. Was können wir sicher retten?
3. Was fehlt zwingend noch?
4. Was passiert als Nächstes?
5. Muss Georg etwas entscheiden? If no: say **nichts**.

No commit hashes, branch names, run IDs, file-count dumps or implementation tables in the primary user-facing summary.

### Technical evidence section
Repository refs, branches, commits, paths, test IDs and detailed matrices belong under:
**“Technischer Nachweis — nur für ausführende Chats”**

They remain available for agents, not pushed onto Georg as operating instructions.

## 11 · Process lesson

The failure was not “Coworker cannot code” or “WSA cannot code”.

The failure was allowing implementation contexts to inherit a moving definition of the product.

The corrective mechanism is therefore not a fourth builder.

It is:

**independent contract recovery → independent architecture/donor audit → frozen master acceptance matrix → only then one integrator.**

## 12 · Current stop state

Until the Recovery Audit returns and is independently challenged:

- no new Open World runtime implementation;
- no camera polishing;
- no Hex polishing;
- no module fan-out;
- no Site publication;
- no merge / Live promotion.

Exact next gate:

**FRESH WORK/WSA RECOVERY AUDITOR · READ-ONLY PRODUCT CONTRACT + DONOR AUDIT**


## 13 · Binding MVP acceptance correction · Georg 2026-10-07

The historical formulation `Receiving Core` is no longer allowed as a product-progress substitute for KFB Open World.

Binding policy:
`skills/chat/KFB_OPEN_WORLD_MVP_ACCEPTANCE_RULE_2026-10-07.md`

Product status is determined by the **complete frozen Acceptance Matrix**, not by aggregate impressions of subsystem progress.

A product may be called an MVP only when every required matrix row is green at its required proof level.

If one required row is partial, missing, conflicted, unproven or below its required proof:
**the Open World is not an accepted MVP.**

Subsystems may still be valuable KEEP/PASS donors. That status remains local evidence and must not be promoted into product-level completion language.

The matrix may only be reduced by an explicit Georg product decision.
