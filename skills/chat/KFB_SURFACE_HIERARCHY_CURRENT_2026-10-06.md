# KFB Surface Hierarchy · CURRENT · 2026-10-06

Status: **BINDING HUMAN NAVIGATION CONTRACT**
Owner: **Georg / KFB**

## One sentence

**Production Hub = overview. ToolBox = tools. GitHub = truth. Production Control = archive/ledger. Everything else is a specialist tool, product surface, optional scratchpad, or legacy mirror.**

## 1 · Production Hub · canonical human front door

`https://kfb-production-hub.frizzlebob.chatgpt.site/`

Role:
- one human-facing overview;
- current P0 / Next / Parallel lanes;
- current briefings;
- open product questions;
- links to canonical tools/products.

It is not the project SSOT, implementation runtime, Issue tracker, or historical ledger.

Coordination data:
`main/kfb-hub/current-board.json`

The accepted Paper/Dark design is canonical.
A stale Work preview/cached embedded preview may never override the direct Site.
After the one-time live-board migration, routine content changes require no Site publication.

## 2 · GitHub · canonical truth

Role:
- project/product SSOT;
- Issues = active job list;
- branches/PRs = implementation owners;
- Returns/Recovery = durable current/history state.

If Hub, Production Control, Cloudflare, Project Tracker or an old Site disagrees with GitHub:
**GitHub wins.**

## 3 · ToolBox · exactly one tool router

There must be exactly one canonical KFB ToolBox front door.

Role:
- route specialist tools;
- do not duplicate their runtimes;
- do not duplicate portfolio/project status.

Current specialist tools include Asset Librarian, EyeRig, Audio, FrankenStein and Hypernormalisation Curator; later promoted tools may be added.

Legacy ToolBox Home/Stage/standalone pages are HISTORY/DONOR only.

The exact current GPT Site ToolBox project/URL needs one explicit verification pass if its identity is uncertain. Do not create another competing ToolBox.

## 4 · Specialist tools

### Asset Librarian · canonical
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/`

Style References:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Old Cloudflare Librarian:
`https://kayfabizarro.pages.dev/tools/asset_registry/librarian/`

Status:
**LEGACY / STALE MIRROR · DO NOT USE AS CURRENT TOOL**

### Audio
`https://kfb-audio.frizzlebob.chatgpt.site`

### EyeRig
`https://kfb-eyerig-workbench.frizzlebob.chatgpt.site/`

### FrankenStein
`https://kfb-frankenstein-composer.frizzlebob.chatgpt.site`

### Hypernormalisation Curator
`https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site`

Specialist Sites are tools, not dashboards.

## 5 · Production Control · ledger only

`https://kfb-production-control.frizzlebob.chatgpt.site/`

Role:
**durable decisions / Returns / recovery history / audit ledger**.

It is not a second Hub.
Georg should not need it for everyday orientation.

Rule:
- retain for audit/recovery;
- demote from daily primary navigation;
- stale visual design is non-blocking while records remain readable/current;
- do not spend design effort on it unless ledger usability blocks recovery.

## 6 · Cloudflare · never the default front door

`https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/`
= legacy Hub Stage/design donor.

Old Cloudflare Asset Librarian
= stale mirror.

Other pages.dev routes are evidence/review only when explicitly named by a current product contract.

Never infer CURRENT from a Cloudflare URL.
GPT Site is primary for Site-capable products.

## 7 · Project Tracker Page · optional only

The ChatGPT `Projekt-Tracker` Page is an **OPTIONAL PERSONAL WORKSPACE**.

It is not:
- SSOT;
- Hub replacement;
- active-job database;
- required recovery surface.

Keep only if Georg finds it useful for personal notes.
Otherwise retire it from KFB production routing.
No mandatory synchronization with Hub/GitHub.

## 8 · Product Sites

World Studio, Combat, ChatterBox and similar Sites are product/review surfaces.

They never become:
- portfolio dashboards;
- ToolBox routers;
- Production Control.

Historical/failed product candidates remain evidence only.

## 9 · Fractal Site rule

No new Site merely because a slice exists.

A Site is justified only as:
1. a real product/review surface;
2. a real specialist authoring tool;
3. the one Production Hub;
4. the one ToolBox router.

Everything else should remain GitHub doc/data, Issue/PR, internal evidence, or donor/history.

## 10 · Daily operating model

Georg should normally need only:

1. **Production Hub** — what matters now?
2. **ToolBox** — which specialist tool do I need?
3. **one current product Site** — when reviewing/using a product.

GitHub is the underlying truth.

Production Control, Cloudflare, old Stage pages and Project Tracker are not required for ordinary orientation.

## 11 · Immediate cleanup

1. finish one-time Production Hub live-board migration;
2. verify direct Hub Site preserves accepted Paper/Dark design;
3. treat stale Work preview as non-authoritative;
4. hide/demote Production Control from daily navigation;
5. remove legacy Cloudflare Hub/Librarian routes from current navigation;
6. verify exactly one ToolBox GPT Site front door;
7. route specialist GPT Sites through Hub/ToolBox;
8. retire Project Tracker from canonical routing unless Georg explicitly keeps it.

## Recovery shorthand

**Overview? → Production Hub.**
**Tool? → ToolBox.**
**Truth? → GitHub.**
**History/decisions? → Production Control.**
**Cloudflare? → only when explicitly required.**
