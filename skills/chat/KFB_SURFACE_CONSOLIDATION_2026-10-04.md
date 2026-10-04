# KFB Surface Consolidation · 2026-10-04

Status: **CURRENT BINDING HUMAN-SURFACE CONTRACT**
Owner: Georg / KFB

## The rule for Georg

There is exactly one human production front door:

**KFB Production Hub**

`https://kfb-production-hub.frizzlebob.chatgpt.site`

Everything else is either:
- an admin/control surface;
- a specialist tool;
- a game/product surface;
- or historical/legacy.

Georg should not need to decide between multiple dashboards.

## 1 · Production Hub = ONE front door

Purpose:
- Today / NOW;
- next human gates;
- current briefings;
- current Sites/tools;
- direct launch links;
- portfolio state.

The Hub is the only surface that answers:

> **Was gilt jetzt für mich?**

The Hub does **not** own:
- runtime truth;
- workflow history;
- ToolBox internals;
- game state.

It reads/routes those owners.

## 2 · Production Control = admin ledger, not second dashboard

Site:

`https://kfb-production-control.frizzlebob.chatgpt.site/`

Purpose:
- durable decisions;
- Returns;
- failure recovery;
- workflow records;
- current machine board;
- provenance/history.

It must expose a **Current** view that shows only the latest current portfolio board and open current records.

Historical records belong under **History / Workflow detail**, not mixed into Georg's daily action list.

Production Control does not compete with the Production Hub for the role of front door.

## 3 · ToolBox = one router, many specialist tools

There must be exactly **one current KFB ToolBox front door**.

Purpose:
- browse current production tools;
- show status / owner / source;
- launch the canonical specialist Site;
- expose source-required / hold / deprecated state.

The ToolBox front door is a **router/catalog**, not another implementation runtime.

### Specialist tools remain separate canonical products

Current specialist Sites include:

- EyeRig Workbench
  `https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`
- Asset Librarian
  `https://kfb-asset-librarian.frizzlebob.chatgpt.site/`
- Audio
  `https://kfb-audio.frizzlebob.chatgpt.site`
- FrankenStein Composer
  `https://kfb-frankenstein-composer.frizzlebob.chatgpt.site`
- Hypernormalisation Curator
  `https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site`

Prepared/future:
- Environment Atlas
- ChatterBox + Comic VFX Studio
- other accepted ToolBox tools only after source/owner proof.

### Legacy ToolBox surfaces

Historical:
- old standalone Studio/Rigging/Animation HTML bundles;
- old ToolBox Home/Stage routers;
- old Cloudflare ToolBox Stage;
- old birthday/recovery routers;
- old source-only labs.

They remain donors/history.

They are **not competing current front doors**.

## 4 · Games/products are not dashboards

Current product surfaces:

### World Studio
`https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/`

Role:
game/world/editor product.

### Card-Hex Combat
`https://kayfabizarro.pages.dev/kfb-hub/stage/combat/card-hex-ascent-coworker/`

Role:
current playable Combat activity candidate.

These are launched from the Production Hub.
They do not carry portfolio truth.

## 5 · Source truth

Human surfaces do not replace GitHub truth.

Authority order:
1. explicit Georg decision;
2. current project owner SSOT / Return / Recovery;
3. GitHub current owner branch/head;
4. current Active Work Map / Site registry;
5. Production Control current records;
6. Site UI;
7. historical pages/records.

If a Site disagrees with current GitHub/router truth:
**the Site is stale and must be refreshed.**

## 6 · Canonical surface roles

| Surface | Role | Georg uses it for |
|---|---|---|
| Production Hub | ONE front door | What now? What next? Open product/tool |
| Production Control | admin ledger | Why? What happened? Exact Return/decision/history |
| ToolBox | specialist-tool router | Which production tool do I need? |
| Specialist GPT Sites | actual tools | Do the specialized job |
| World Studio | game/editor product | Build/play world |
| Combat | game activity | Play/test combat |
| GitHub | durable SSOT | Source/provenance/owner |

## 7 · Current board

### NOW / P0

1. World Studio four-island freeplay.
2. Card-Hex Combat S3 freeplay.

### NEXT / P1

- Environment Atlas corpus recovery → one Atlas Site.
- Asset Librarian review → Saved Set / WorldBuilder placement seam.
- FrankenStein real composite roundtrip.
- Fluff Worker Part 2 after Part 1 decision.

### CHEAP PARALLEL

- Quote Pool normal Web Chat.
- Audio only consumer-driven.
- Resident/EyeRig variants consumer-driven.
- ChatterBox + Comic VFX Design Studio can proceed as a design/tool lane without mutating P0 game runtimes.

### HOLD

- provider/model comparison;
- visible OSM/Hürth world reuse;
- historical ToolBox routers as current products;
- duplicate ToolBox/Site front doors.

## 8 · Publishing / cost

Site updates are `PUBLISH_ONLY` once source is frozen.

Use lowest-cost Sites-capable executor.

Do not use premium/high reasoning just to refresh:
- Hub;
- Control;
- ToolBox router;
- specialist Site host.

## 9 · Required consolidation implementation

One bounded Work assignment should:

1. update Production Hub to current portfolio + canonical surface directory;
2. update Production Control UI so **Current** is clean and historical records are secondary;
3. resolve whether a current ToolBox GPT Site/project already exists;
4. if yes, update it;
5. if no, create exactly one canonical ToolBox router Site;
6. route every specialist tool from that ToolBox;
7. mark legacy ToolBox routes as HISTORY / DONOR / SUPERSEDED;
8. link Hub → ToolBox and Hub → Control clearly;
9. keep specialist Sites unchanged unless their own product work requires changes;
10. return exact project/version/deployment IDs and screenshots/verification.

## 10 · Human acceptance

After consolidation Georg should need only one bookmark:

**KFB Production Hub**

From there:
- open current P0 game;
- open ToolBox;
- open Control/history;
- launch any specialist tool.

If Georg must remember which of several dashboards is current, the consolidation has failed.
