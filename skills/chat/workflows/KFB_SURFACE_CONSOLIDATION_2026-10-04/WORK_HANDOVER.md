# Work Handover · KFB Surface Consolidation · 2026-10-04

Status: **READY FOR ONE CONSOLIDATION RUN**
Execution mode: **RECOVERY / CONSOLIDATION**
Owner: **KFB production surfaces**
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/surface-consolidation-2026-10-04`
Start head: `39f998de3c97a19850da2f71a21a5ae325d41982`

## Outcome

After this run Georg should need **one bookmark**:

`https://kfb-production-hub.frizzlebob.chatgpt.site`

From there he can:
- see what matters now;
- open World Studio / Combat;
- open one canonical ToolBox front door;
- open Production Control/history;
- launch current specialist tools.

If Georg still has to remember which of several dashboards/ToolBox pages is current, the run failed.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/KFB_SURFACE_CONSOLIDATION_2026-10-04.md`
3. `skills/chat/KFB_ACTIVE_WORK_MAP_2026-10-04.md`
4. `skills/chat/KFB_SITE_SURFACE_REGISTRY_2026-10-04.json`
5. `skills/chat/KFB_SITES_FIRST_DELIVERY_POLICY_2026-10-04.md`
6. `skills/chat/SITES_PUBLISH_ONLY_CONTRACT_2026-10-04.md`
7. `tools/KFB-ToolBox/START_HERE.md`
8. `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json`

## Canonical human hierarchy

### 1 · KFB Production Hub = only human production front door

Existing Site:
`https://kfb-production-hub.frizzlebob.chatgpt.site`

Existing project:
`appgprj_6ab7358322a8819183d2fa036b7b12f9`

Do not create a new Production Hub Site.

The Hub answers:
**Was gilt jetzt für mich?**

### 2 · KFB Production Control = admin ledger / history / Returns

Existing Site:
`https://kfb-production-control.frizzlebob.chatgpt.site/`

Do not use it as a competing daily dashboard.

Its default human view must make:
- CURRENT board/open records prominent;
- History / workflow records secondary/collapsed/searchable.

Preserve all durable records and connector-backed history.

### 3 · KFB ToolBox = exactly one canonical tool front door

Before writing:
- use Sites tooling to discover whether a current KFB ToolBox GPT Site/project already exists;
- inspect candidate ToolBox projects/sites and identify the one that actually belongs to current KFB ToolBox ownership.

If exactly one valid ToolBox Site exists:
**update it in place**.

If no valid GPT Site exists:
create **exactly one** new KFB ToolBox router Site.

If multiple old ToolBox Sites exist:
- do not delete them;
- choose the current owner candidate;
- mark the others legacy/superseded in GitHub/site registry/Hub routing;
- never leave more than one presented as current.

Do not invent/claim a final ToolBox URL before Sites returns it.

## ToolBox front-door function

ToolBox is a router/catalog, not another runtime.

It must show current specialist tools and their status, with direct links:

### CURRENT specialist tools

EyeRig Workbench  
`https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`

Asset Librarian  
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

Audio  
`https://kfb-audio.frizzlebob.chatgpt.site`

FrankenStein Composer  
`https://kfb-frankenstein-composer.frizzlebob.chatgpt.site`

Hypernormalisation Curator  
`https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site`

### PREPARED / NEXT

Environment Atlas  
status: SOURCE/CORPUS RECOVERY BEFORE SITE

ChatterBox + Comic VFX Studio  
status: DESIGN / TOOL SITE PLANNED

### LEGACY / DONOR

Old ToolBox Home/Stage routers, old birthday/recovery ToolBox pages, standalone Studio/Rigging/Animation bundles and historical Cloudflare ToolBox routes remain provenance/donors only.

They may be linked under History/Legacy if useful, but never as current front doors.

## Current portfolio board for Hub

### NOW / P0

1. World Studio four-island freeplay  
   `https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/`

2. Card-Hex Combat S3 freeplay  
   `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/card-hex-ascent-coworker/`

### NEXT / P1

- Environment Atlas corpus recovery → Site
- Asset Librarian review → placement seam
- FrankenStein real composite roundtrip
- Fluff Work Motion Part 2 after current Blender decision

### CHEAP PARALLEL

- Quote Pool normal Web Chat
- Audio consumer-driven
- Resident/EyeRig variants consumer-driven
- ChatterBox + Comic VFX Design Studio as design/tool lane

### HOLD

- Sol/Astra/provider comparison
- OSM/Hürth visible-world reuse
- duplicate Site/front-door work
- historical ToolBox routers as current products

## Binding operating rule after this consolidation · NO WORK FOR ROUTINE CURRENT-STATE UPDATES

This run must not merely repaint today's status into three static Sites.

It must establish a durable current-state path so that future routine updates to:
- current briefings;
- P0/P1/P2 status;
- TODOs / human gates;
- specialist-tool status;
- current next actions;
- HOLD / BLOCKED / DONE state

can be written from normal Web Chat / KFB Production Control without requiring another Work engineering run or GPT Site republish.

### Required ownership

**KFB Production Control remains the durable current-state/data owner.**

The Hub is a human-facing read/router surface over that current state.

ToolBox owns its current tool catalog/status data.

Do not create a second parallel status database just for the Hub.

### Required implementation behavior

Work must inspect the existing Site/runtime capabilities and implement the simplest durable data-driven path available.

Preferred result:
1. normal Web Chat writes/updates current records through KFB Production Control;
2. Production Control Current view reflects them directly;
3. Production Hub reads the same canonical current board/feed and renders it without a Site code republish;
4. ToolBox current tool status is likewise data/manifest-driven rather than hard-coded into each release;
5. historical records remain durable but do not leak into the default Current view.

If direct runtime reading from the existing Control data source is not technically available to the Hub, implement the nearest equivalent low-cost refresh path that does **not** require Work reasoning:
- one canonical machine-readable current-board artifact/feed owned by Production Control;
- deterministic lightweight sync/publish action callable from normal Web Chat or the lowest-cost Sites-capable executor;
- no product/design reasoning;
- no manual rewriting of the Hub UI for every status change.

### Acceptance criterion

After this consolidation, changing a routine TODO/status/briefing must **not** require:
- opening Work;
- editing Site UI code;
- rebuilding the Hub;
- creating a new deployment architecture.

Work is only required again when the **surface itself** changes: layout, navigation, schema, capability, new tool class, or real engineering defect.

The Return must explicitly document:
- canonical live data owner;
- how normal Web Chat updates current state;
- how Hub receives/reads it;
- whether refresh is immediate or deterministic-sync;
- exact command/action/tool used for a routine update;
- proof by changing one test TODO/status after publication and showing it in the Current UI **without another Work implementation pass**.

## Required Work sequence

### Phase A · Resolve ToolBox first

1. inspect current GPT Sites/projects;
2. resolve current ToolBox Site identity or prove none exists;
3. update/create exactly one canonical ToolBox router;
4. load only current specialist links/statuses;
5. verify desktop/mobile;
6. persist exact Site project/version/deployment/URL.

### Phase B · Production Control

Update the existing Production Control Site UI only.

Default/first view:
- current portfolio board;
- open P0/P1/parallel current records;
- current Sites summary.

Secondary views:
- workflow history;
- Returns;
- failure recovery;
- archived/older decisions.

Do not delete durable records.

Do not create a second Control data store.

Use the existing Production Control connector/data source.

### Phase C · Production Hub

Update the existing Production Hub Site in place.

The first viewport must answer:
- What do I do now?
- What can I open?

Required primary links:
- World Studio
- Combat S3
- ToolBox
- Production Control

Secondary tool directory:
- EyeRig
- Asset Librarian
- Audio
- FrankenStein
- Hypernormalisation
- Environment Atlas status
- ChatterBox/Comic VFX status

No stale ToolBox/Cloudflare router should appear as the current ToolBox.

### Phase D · GitHub reconciliation

Update the same branch with:
- exact ToolBox Site identity;
- Production Hub Site version/deployment;
- Production Control Site version/deployment;
- current surface registry;
- ToolBox manifest/front-door URL/status;
- Active Work Map;
- Return;
- additive changelog.

No merge.

## UX rule

There are three top-level production concepts only:

**PRODUCTION**
→ Hub

**CONTROL**
→ Production Control

**TOOLS**
→ ToolBox

Games and specialist tools are destinations below those concepts.

Do not create another top-level dashboard.

## Technical/site acceptance

### Production Hub

- exact existing URL opens;
- first screen shows current P0 actions;
- ToolBox and Control links go to canonical current Sites;
- no stale old-current ToolBox links;
- mobile usable.

### Production Control

- exact existing URL opens;
- Current view does not force Georg through historical records;
- durable history remains available;
- current board agrees with GitHub Active Work Map.

### ToolBox

- exactly one current GPT Site;
- current specialist tools visible;
- no specialist runtime duplicated;
- legacy routers clearly marked legacy/history;
- responsive/mobile;
- direct launch works.

## Cost rule

This is a consolidation/UX/navigation task.

Use normal Work reasoning necessary to reconcile Sites.

After source/UI is frozen, any host-only republish is `PUBLISH_ONLY`.

Do not create another expensive reasoning round only for final deploy.

## Forbidden

- no new World/Combat runtime;
- no changes to specialist tool internals;
- no new asset registry;
- no new dialogue runtime;
- no Cloudflare-first fallback;
- no auto merge;
- no Live promotion;
- no deleting old Sites merely to clean the list;
- no duplicate ToolBox front door.

## Return

Return exactly:

### Canonical human surfaces
- Production Hub URL + project/version/deployment
- Production Control URL + project/version/deployment
- ToolBox URL + project/version/deployment

### Current specialist Sites
list + status

### Legacy/superseded surfaces
list + disposition

### GitHub
repo / branch / exact head / changed files

### Verification
desktop/mobile checks and direct-link checks

### Exactly one human gate
Georg opens **Production Hub only** and confirms:
- current board is obvious;
- ToolBox opens one current tool router;
- Control is clearly history/admin, not a competing dashboard.

No merge.
