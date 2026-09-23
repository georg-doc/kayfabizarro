# KFB Production Flow v2 · Coherent Artifact First · 2026-09-23

Status: **CURRENT CONSOLIDATION CANDIDATE**
Owner: KFB production routing
Applies to: Web Lead, Claude Coworker, Claude Design, WSA/Work

## Für Georg

Ziel: weniger technische Einzelabnahmen und weniger verlorene Chats.

Standard wird:

**funktionierende Quellen sichern → vorhandene Messungen sammeln → ein geschlossenes Produktionspaket bauen → damit in Claude/Coworker produktiv arbeiten → ein zusammenhängendes Artefakt direkt im Chat abnehmen**

Nicht mehr:
zehn kleine HTMLs, zehn einzelne Freigaben und danach trotzdem noch einmal alles neu zusammensetzen.

## 1 · One front door

For active KFB production, read:

1. current project Return / PR;
2. this Production Flow;
3. Design Donor Lock when a working donor exists;
4. only the provider-specific instructions for the selected executor.

Do not reconstruct production state from chat history.

## 2 · Role split

### Web Lead

Owns:
- current GitHub truth;
- donor/source recovery;
- owner boundaries;
- current-lane reconciliation;
- assembling the Production Packet;
- deciding which executor fits;
- final reconciliation after external work.

Web should not become the long-lived visual authoring studio.

### Claude Coworker

Best for:
- code review;
- integration planning;
- bounded implementation;
- adapters between already-existing modules;
- tests;
- export/save/load contracts;
- review artifact generation;
- Hub/current-state maintenance.

Coworker may iterate productively when the slice is closed and source-pinned.

### Claude Design

Best for:
- coherent visual authoring;
- 3D composition;
- material/look/environment work;
- UI/presentation;
- motion/choreography refinement;
- long-lived editable Session Cuts.

Claude Design receives a **closed Production Packet**.
It does not rediscover donors or rebuild accepted systems.

### WSA / Work

Use only when a real capability gap remains:
- simultaneous local/private multi-repo integration;
- binary/file movement unavailable elsewhere;
- local packaging/build seam;
- OS/browser automation;
- final cross-repo smoke/release assembly.

WSA is not the default development environment.

## 3 · Mandatory Donor Lock

When a working donor exists, apply:

`skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`

Order:

`D0 donor unchanged → D1 evidence/measurements → D2 seam → D3 requested delta → D4 side-by-side → D5 human decision`

Important change for Flow v2:

D0–D4 are normally **internal production checks**, not four separate Georg approvals.

Ask Georg at D0 only when:
- donor identity is disputed;
- two sources conflict;
- the exact source cannot be reproduced.

Otherwise carry the verified donor forward into the coherent production artifact.

## 4 · Production Packet

Before productive Claude/Coworker work, prepare one small packet.

Use:
`PRODUCTION_PACKET_TEMPLATE.md`

It contains:
- exact target outcome;
- exact donors;
- source-object proof;
- measurement evidence;
- accepted existing components;
- protected owners;
- one seam;
- one requested delta family;
- review questions;
- stop condition.

No open archaeology inside Claude/WSA.

## 5 · Micro-gate reduction

Georg should normally see **one coherent milestone**, not every implementation transition.

### No Georg micro-gate needed for

- exact donor copied unchanged and source identity is already proven;
- known measurements replayed;
- internal adapter wiring;
- static/unit/integration tests;
- reversible implementation details;
- source-isolation checks already covered by accepted evidence.

### Georg gate required for

- disputed source identity;
- visible product/design choice;
- irreversible/destructive change;
- motion/timing/feel preference;
- final coherent artifact milestone;
- any result where automated evidence cannot answer the product question.

Default maximum:
**one human gate per coherent production milestone.**

## 6 · Coherent artifact milestone

A milestone should be useful enough to continue working from.

Examples:

### ToolBox milestone
Not:
- one eye page;
- one prop page;
- one transform page.

Instead:
- current Stage-First shell;
- real roster;
- accepted shared editor;
- one real resident set;
- one attachment example;
- save/reload;
- coherent Review/Session Cut.

### WorldBuilder milestone
- continuous terrain;
- shared inline editor;
- real resident/prop;
- save/reload;
- accepted shadow/presentation baseline.

### Racer milestone
- complete track-body/tunnel presentation candidate;
- not one renderer artifact per gate.

### Travel milestone
- Ground → Flight transition as one usable mobility handoff;
- visual rider relation inherited from accepted TMB-1E.

## 7 · Provider selection

Choose executor by task shape.

### Coworker-first

Use when most work is:
- code integration;
- ownership seam;
- persistence;
- tests;
- source-safe consolidation;
- review packaging.

### Claude Design-first

Use when the stable functional base already exists and the main work is:
- composition;
- look;
- shape;
- material;
- UX/presentation;
- choreography.

### Web-only

Use for:
- source recovery;
- small repair;
- status reconciliation;
- branch/PR hygiene.

### WSA

Only after the Production Packet names the missing capability.

## 8 · Review delivery

If Georg must review something:

**the same chat message must contain the direct clickable artifact.**

Do not send Georg to:
- a PR tree;
- the Hub;
- a handover folder;
- a path string.

Say in plain language:
1. what to open;
2. what 1–3 things to judge;
3. what happens after his answer.

GitHub evidence follows second.

## 9 · Claude productive session rule

Once the packet is closed, prefer keeping related visual work in one Claude session/project rather than issuing many unrelated micro briefs.

A Claude session should receive:
- exact donor files/refs;
- measurement packet;
- accepted functional source;
- requested coherent outcome;
- forbidden rebuild list.

Claude returns:
- complete editable Session Cut/export;
- actual source/donor lineage;
- changed files;
- one coherent review artifact;
- unresolved items.

Web/Coworker rehomes/reconciles the result.

## 10 · Coworker productive integration rule

Coworker may implement directly when given a bounded Slice Card:

- one owner repo;
- exact base/head;
- closed file roster;
- named donor/modules;
- one outcome;
- tests;
- review artifact;
- stop condition.

This is the preferred lane for integrations that are too substantial for Web but do not require WSA.

## 11 · WSA rule

WSA receives only:
- WEB_ALIGNED Production Packet;
- already reviewed/accepted inputs;
- exact heads;
- one WSA-only capability;
- one smoke gate.

If Web/Coworker can reasonably do it:
**do not spend WSA.**

## 12 · Failure rule

If a design/build silently replaces the donor:
- archive it;
- do not repair the substitute;
- return to donor.

After two failed passes on the same gate:
- stop;
- preserve the candidate;
- create failure recovery.

## 13 · Current first consolidation target

Do not launch a new broad Claude Design build yet.

First:
1. align Coworker to this Production Flow;
2. refresh active lane status;
3. create one coherent Production Packet for the next real artifact;
4. then choose Coworker or Claude Design.

Likely first productive candidates:
- ToolBox coherent Stage-First integration after current source/editor state is reconciled;
- WorldBuilder visual/presentation refinement on the accepted functional editor base;
- Curtain only after exact v1 donor D0 is restored;
- Travel TMB-2 and Racer R3c remain their own current human gates and should not be folded into a mega-build.

## Done when

KFB production can move from one accepted functional source to a coherent editable artifact without:
- donor reconstruction;
- repeated source archaeology;
- dozens of Georg micro-gates;
- unnecessary WSA;
- losing state when a chat ends.
