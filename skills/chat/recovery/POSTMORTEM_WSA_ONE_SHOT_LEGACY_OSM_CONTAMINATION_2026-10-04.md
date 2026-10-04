# Postmortem · WSA One-Shot Legacy-OSM Donor Contamination · 2026-10-04

Status: **WSA LEAD / CHATGPT COORDINATION FAIL · HUMAN VISUAL FAIL · CURRENT LESSONS BINDING**
Failure owner: **KFB production coordination / lead routing layer**
Affected candidate: **Draft PR #348 · WB2 four-island / One-Shot receiving branch**
User-visible failure evidence: Georg screenshot, 2026-10-04 06:33 local chat context.
Runtime/branch must be preserved until the currently running WSA/Work job returns; do not destructively rewrite it mid-run.

## Executive summary

The current WSA candidate visibly shows the legacy Hürth / OSM-derived building/facade world again.

This is **not a mysterious WSA regression**.

The legacy OSM donor was deliberately wired into the new WB2/R2D world by the coordination layer during the supposedly clean four-island preflight, then incorrectly promoted from a **technical building/facade proof** to the visible **current world foundation**.

WSA then did what the brief told it to do:
integrate the Player into the already-declared PASS world and **not rebuild the world**.

The root failure therefore happened **before** the current WSA player work.

## What Georg saw

The screenshot shows:
- the WB2 four-island runtime;
- a playable/visible character;
- large stylised building/tree forms that read as the old OSM/Hürth/Grotesque world rather than the intended KFB Town / living-toy Golden Journey world.

Human result:
**FAIL.**

This screenshot overrides any implication that browser-green world tests made the visible world acceptable.

## Exact code path that caused the contamination

On current PR #348 head inspected after the screenshot, the world still contains:

### `r2d-buildings.v1.js`

It explicitly imports and renders:

- `fixtures/huerth-b1-siblings-v0.json`
- `wd1-city.js`
- `tools/osm-city-lab/src/style/cartoon-city.js`
- `tools/osm-city-lab/styles/kfb-city-v0.json`
- `elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`

It calls the existing city/facade owner in `elastic` mode.

The fixture itself identifies:
- **Hürth · Stotzheimer Straße pilot**
- OSM provenance
- hundreds of Hürth buildings/roads.

### `r2d-world.js`

The same building adapter is mounted for the R2D island nodes, including the four-island archipelago.

It therefore does not merely use Hürth data in a test.
It places that family into the visible world.

### `wb2d-app.js`

The integrated UI still exposes an **OSM presenter** diagnostic.

This is direct proof that the old OSM pipeline was still part of the active visible world stack.

## How the mistake entered the new world

During `WORLD-CONVERGENCE-BASE-01` and `WORLD-MULTI-ISLAND-CORRIDOR-01`, the coordination work had a good architectural goal:

- fresh branch from current main;
- one WB2 world owner;
- one Track-Core owner;
- R2D continuous islands;
- preserve proven building support/collision/facade mechanisms.

The bad decision was this:

> use the already-proven Hürth B1 / OSM / Elastic facade family as the visible building implementation on the new R2D islands.

That was rationalized as “reuse before rebuild.”

But the donor was proven only for:
- building/facade geometry;
- support/contact;
- facade-window/door generation;
- WB2 owner compatibility.

It was **not** accepted as:
- KFB Town art direction;
- four-world content;
- Golden Journey environment;
- Playmation living-toy visual foundation.

The reuse scope was never typed.

A **mechanism donor** was promoted into a **content/visual donor**.

## Evidence/status failure

The automated world tests checked things such as:

- four island nodes;
- three Track-Core bridges;
- building-owner count;
- `kfb-facade-rule-v1`;
- no duplicate renderer;
- no Travel host;
- no page/console errors.

Those tests were useful.

But they did **not** test:

- whether any visible source came from legacy Hürth/OSM;
- whether KFB Town looked like KFB Town;
- whether the intended KayKit/Tiny Treats/Playmation source language was present;
- whether the scene was a living KFB toy world;
- whether Georg had ever accepted the world visually.

Despite that, the coordination layer wrote:

- `WORLD-CONVERGENCE-BASE-01 = PASS`
- `WORLD-MULTI-ISLAND-CORRIDOR-01 = PASS`
- “world ready”
- “do not rebuild the world”

This converted a **technical topology/owner PASS** into an implicit **visual-foundation PASS**.

That was false.

## One-Shot lock failure

The One-Shot lock later said, in effect:

- World = PASS.
- Do not rebuild the world.
- Add Player, Residents, Golden Journey, etc. to it.

That instruction protected the wrong visible foundation.

The current WSA work therefore inherited a poisoned premise:
**preserve the world**.

This is a coordination failure, not evidence that WSA independently chose Hürth/OSM as the desired KFB world.

## Why the earlier safety rules did not prevent it

The repository already contained good rules:

- donor PASS != integration PASS;
- browser PASS != Georg acceptance;
- no low-fidelity proxy human gates;
- source-first;
- reuse before rebuild;
- do not promote visually rejected foundations.

The failure survived because those rules lacked one missing concept:

## Missing concept · REUSE SCOPE

Every donor must be classified by what may be reused:

- **MECHANISM** — math, deformation, collision, support, parser, state logic;
- **PRESENTATION** — material/look/camera/UI language;
- **CONTENT** — visible models, layouts, environment, characters;
- **DATA** — geography, seeds, recipes, metadata.

A donor PASS in one class grants **zero authority** in the others.

Hürth/OSM B1 should have been:

- MECHANISM = KEEP;
- support/facade geometry = KEEP;
- CONTENT for KFB Town = REJECT / NOT AUTHORIZED;
- PRESENTATION for Golden Journey = REJECT / NOT AUTHORIZED.

Because this classification did not exist, “reuse before rebuild” became “keep the old visible world because it already passes tests.”

## Second missing concept · VISIBLE SOURCE FIREWALL

A product candidate needs a negative source policy as well as a positive source list.

For the current KFB MVP:

Legacy Hürth/OSM sources may be used as internal geometry/support evidence, but must not appear as visible Golden-Journey environment unless Georg explicitly selects an OSM scene.

A runtime can therefore be technically green and still fail before human review if it loads banned visible source families.

This should be machine-checkable.

## Third failure · over-cautious micro-slice management, under-cautious product foundation

The process spent substantial effort proving:
- owner boundaries;
- branch convergence;
- exact test counts;
- motion source;
- small seams.

At the same time it failed to ask the simplest product question:

> **Is this actually the KFB world Georg wants to play?**

The result was paradoxical:
very cautious locally, reckless globally.

This is the same broader failure pattern Georg identified when comparing KFB work with one-shot game builds:
the workflow optimized for **proof density** rather than **playable product progress**.

## Fourth failure · false meaning of “current world”

Calling PR #348 **CURRENT WORLD** made a technical receiving harness sound like the accepted game world.

Correct classification should have been:

- WORLD TOPOLOGY / OWNER = PASS;
- TRACK GRAPH = PASS;
- ANCHORS / DECK SEEDS = PASS;
- VISUAL ENVIRONMENT FOUNDATION = UNREVIEWED;
- HÜRTH/OSM VISIBLE CONTENT = TECHNICAL DONOR ONLY.

After Georg's screenshot:

- VISUAL ENVIRONMENT FOUNDATION = **HUMAN FAIL**;
- legacy Hürth/OSM visible content = **REJECTED FOR CURRENT MVP FOUNDATION**.

## Fifth failure · user role violation

Georg asked to act as PO and to get coherent playable progress.

Instead he was repeatedly forced to:
- catch stale routing;
- explain already-finished Motion work;
- notice micro-slice drift;
- visually detect the wrong world donor after WSA had already spent more Work budget.

That is exactly what the production layer is supposed to prevent.

## Why this is worse in a One-Shot

A One-Shot amplifies bad inputs.

When the receiving world is wrong, telling WSA to “continue autonomously” does not fix the error.
It efficiently integrates more systems into the wrong foundation.

Therefore:

**autonomy requires a clean product foundation, not just green technical seams.**

The answer is not to return to dozens of micro-gates.
The answer is one strong **pre-run visual/source firewall**, then autonomous integration.

## Systemic finding · the postmortem/control-plane paradox

This incident is not only another isolated donor mistake.

The accumulated KFB process rules themselves had become a failure amplifier.

Each prior incident added another reasonable protection:
- source-first;
- one owner;
- exact branch/head;
- no visual substitution;
- bounded slice;
- gate proportionality;
- two-pass stop;
- Return/Recovery;
- fresh-chat next gate;
- Stage discipline;
- no auto-merge.

Individually these rules are good.

But without an explicit **execution-mode precedence**, a fresh agent reading all of them tends to behave defensively:

`inspect → narrow scope → prove donor → stop → hand off → open another slice`.

That is exactly the micro-slice drift Georg objected to.

The system optimized for avoiding local mistakes and accidentally made **finishing the product** harder.

### Why this matters for the current failure

The over-cautious control plane created two opposite errors at once:

1. **Too cautious about integration breadth**
   - Player, Residents, Site, Memory were repeatedly turned into separate gates.

2. **Not cautious enough about the actual visible product**
   - the Hürth/OSM technical fixture was allowed to become the visible world because its owner/tests were green.

This is the central pathology:

> **local proof substituted for global product judgment.**

### Binding correction · execution-mode precedence

Fresh chats must determine execution mode before applying process defaults:

1. explicit current product/execution lock;
2. current owner Return/Recovery;
3. global owner/source invariants;
4. generic slice protocol.

For **ONE_SHOT** mode:
- bounded-slice rules define internal checkpoints only;
- crash-safe commits/tests continue;
- human/executor handoff does not recur after every checkpoint;
- optional failures quarantine/defer;
- the agent continues until product outcome or real stop condition.

For **BOUNDED_SLICE** mode:
- the normal one-slice return model applies.

This distinction is now persisted in `FRESH_CHAT_SLICE_PROTOCOL.md`.

### Binding correction · rule budget

Do not react to every new failure by adding another independent blocking gate.

A new process rule must:
- replace/supersede an overlapping old rule where possible;
- state its precedence;
- reduce ambiguity for a fresh chat;
- not increase Georg's operational burden.

The purpose of postmortems is to make the next run **simpler**, not more ceremonious.

## Binding corrections

### 1 · Typed donor scope

Every reused donor must state:
- MECHANISM;
- PRESENTATION;
- CONTENT;
- DATA;

with each class marked:
`KEEP / ALLOWED / HOLD / REJECT / SOURCE_REQUIRED`.

No implicit inheritance across classes.

### 2 · Visible-source allowlist / denylist

Before an integrated KFB human candidate:
- list the visible source families intended for each world;
- scan runtime imports/resources for rejected legacy visible sources;
- fail the candidate if a banned visible family is loaded into the scene.

### 3 · Technical world PASS is never visual world PASS

Use separate status:
- `TOPOLOGY_PASS`
- `OWNER_PASS`
- `BROWSER_RUNTIME_PASS`
- `VISUAL_FOUNDATION_UNREVIEWED`
- `HUMAN_VISUAL_PASS / FAIL`

Never collapse them into “world ready.”

### 4 · Identity-bearing visible objects need explicit product provenance

Every visible building/landmark/character/vehicle/media family in an MVP acceptance frame must be traceable to:
- the current World Recipe;
- Asset Librarian / accepted source package;
- or an explicitly named procedural grammar.

A test fixture is not product provenance.

### 5 · Fixtures are toxic by default in product visuals

Paths under technical fixtures, historical OSM labs and legacy review worlds may feed tests/measurements.
They may not silently feed the visible Golden Journey.

### 6 · One-Shot stays One-Shot

This failure must **not** be used to justify a return to serial micro-slices.

Correct recovery after the current Work run:
- preserve the candidate;
- classify the visible OSM layer as rejected;
- run one integrated recovery/completion pass that removes/quarantines the contaminated visible donor while preserving good topology, Player/Motion and other valid work;
- continue to the same Golden Journey outcome.

### 7 · Human screenshot outranks green visual claims

When Georg shows a frame that visibly contradicts the intended product, the visual foundation is FAIL even if CI/browser is green.

Do not debate the test counters.

## Current PR #348 classification after this incident

### KEEP
- fresh-current-main branch discipline;
- one WB2 renderer/world owner;
- R2D four-island topology;
- Track-Core three-bridge graph;
- Golden-Journey anchor IDs;
- canonical deck/Card seed refs;
- Motion PR #344 contract consumption;
- current Player/Motion implementation work if it proves functional;
- support/collision mechanisms that can be detached from visible OSM content.

### HUMAN-REJECT / REMOVE FROM CURRENT MVP VISUAL FOUNDATION
- visible Hürth B1 fixture buildings;
- active OSM City Lab presentation as KFB Town/world content;
- Elastic-Hürth visible city/facade presentation;
- any “current world” claim based only on those browser-green fixtures.

### HOLD / RECONCILE
- `kfb-facade-rule-v1` as a **mechanism** may remain useful;
- it must be consumed by current KFB source families rather than smuggling Hürth content into the Golden Journey.

## Current recovery strategy

Do **not** destructively interrupt the currently running WSA/Work job merely because this postmortem is being written.

When its current return arrives:

1. preserve everything it actually built;
2. do one product-level diff;
3. keep valid Player/Motion/world-graph work;
4. strip/quarantine the visible legacy OSM/Hürth content path;
5. reconnect the building/facade mechanism to current KFB sources;
6. continue the One-Shot in one integrated recovery/completion pass;
7. do not spawn a new chain of micro-slices.

## Fresh-chat mandatory read

Any fresh chat touching:
- PR #348;
- WB2 MVP world;
- One-Shot integration;
- Town/Dystopia/Utopia/Protopia visual content;

must read this postmortem before interpreting PR #348's branch Return as product truth.

## Reißleinen

Before declaring a product foundation:

> **Welche sichtbaren Quellen sind tatsächlich im Frame?**

Before reusing a proven donor:

> **Was genau ist bewiesen: Mechanismus, Präsentation, Content oder Daten?**

Before saying “world ready”:

> **Ist nur die Topologie grün, oder hat Georg den sichtbaren Welt-Look wirklich akzeptiert?**

Before launching an autonomous One-Shot:

> **Ist der Input sauber genug, dass Autonomie nicht nur schneller in die falsche Richtung integriert?**

## Durable rule

**A technical donor may enter the product only in the dimensions for which it was accepted.**

Everything else stays quarantined until explicitly selected.
