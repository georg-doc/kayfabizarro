# Claude Coworker Alignment · KFB Production Flow v2

Status: **WEB-ALIGNED OPERATING ADDENDUM**

## Für Georg

Coworker soll künftig nicht nur Reviews schreiben.

Er darf:
- bestehende Module sauber zusammenbauen;
- kleine Integrationen produktiv einchecken;
- Tests und Review-HTML erzeugen;
- mit deinem Feedback ein oder zwei kleine Reparaturrunden machen.

Er darf nicht:
- funktionierende Quellen neu erfinden;
- neue Owner einführen;
- aus einem kleinen Integrationsauftrag eine neue Architektur machen;
- ohne klaren Auftrag in WSA-/Deployment-Arbeit wechseln.

## 1 · Default modes

### REVIEW
Cheap, diff-first, no write.

### INTEGRATION
Preferred productive mode for:
- adapters;
- shared modules;
- save/reload seams;
- existing UI/runtime composition;
- tests;
- review artifacts.

Requires a Production Packet.

### AUTHORING SUPPORT
Coworker may prepare exact source/measurement packets for Claude Design and rehome/reconcile Claude Session Cuts.

### WSA PREP
Coworker prepares WSA only when a specific missing capability is proven.

## 2 · Mandatory Donor Lock

Before integrating a donor-based feature:

Read:
`../KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`

Coworker verifies:
- exact donor;
- source head/blob;
- donor behavior;
- measurement packet;
- seam;
- forbidden rebuild list.

If incomplete:
return the missing fields.
Do not invent replacements.

## 3 · No unnecessary human micro-gates

Coworker performs internal:
- D0 donor verification;
- measurement replay;
- adapter wiring;
- static/unit/integration checks;
- source isolation.

Do not ask Georg to reapprove an unchanged donor that is already proven.

Ask Georg only when:
- source identity conflicts;
- a visible product choice exists;
- the coherent milestone is ready;
- a feel/timing choice cannot be automated.

## 4 · Productive Slice Card

A Coworker productive slice must name:

- receiving owner;
- exact base/head;
- branch;
- Production Packet;
- closed file roster;
- one coherent outcome;
- tests;
- review artifact;
- stop condition.

Normal maximum repair loop:
two passes on the same gate.

## 5 · Review delivery

When Georg must review:
- deliver the direct clickable HTML/artifact in the same chat;
- explain 1–3 questions in plain German;
- do not send him hunting through the Hub or PR tree.

## 6 · Claude Design seam

Coworker is the preferred technical bridge around Claude Design.

### Before Claude
Coworker/Web prepares:
- donor lock;
- measurement evidence;
- functional base;
- exact files;
- protected owners;
- coherent desired outcome.

### After Claude
Coworker/Web:
- checks donor lineage;
- rejects substitute runtimes;
- rehomes Session Cut;
- reconnects current owners;
- runs tests;
- makes one coherent Review artifact.

Claude Design is not asked to rediscover GitHub architecture.

## 7 · Integration examples

Good Coworker work:
- shared inline editor → ToolBox host;
- Resident set → WorldBuilder scene adapter;
- accepted actor/prop source → Stage-First shell;
- persistence/save schema adapter;
- current Hub cleanup from actual Returns;
- review artifact packaging.

Bad Coworker work:
- recreate Theatre Curtain from screenshots;
- replace EyeRig with cleaner custom rig;
- invent a new Resident loader because one path is awkward;
- redesign a product while supposedly integrating it.

## 8 · WSA boundary

Use WSA only for a named capability Coworker cannot reasonably do, such as:
- local private multi-repo assembly;
- binary movement/packaging;
- OS/browser integration;
- release packaging;
- final cross-repo local smoke.

If no such capability exists:
Coworker completes the integration.

## 9 · Communication

User-facing answer starts with:

**Für Georg**
- what now works;
- what to look at;
- what happens next.

Technical statuses follow only if useful.

## 10 · First production trial

Do not use another review-only test.

The next suitable Coworker trial should be one real bounded integration with an already accepted functional base.

Candidate:
ToolBox shared-editor / source-safe Stage-First integration after current WorldBuilder/ToolBox truth is reconciled.

Do not start it from stale PR #187 assumptions.
Refresh current heads and create a new Production Packet first.
