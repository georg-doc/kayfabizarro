# KFB Open Process Census · 2026-09-22

Status: **CURRENT COORDINATION CANDIDATE · CLASSIFICATION ONLY · NO AUTO-CLOSE / NO MERGE / NO LIVE**
Owner: **KFB Production Hub / router coordination; product owners unchanged**
Repository: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/open-process-census-2026-09-22`
Source baseline: `main@bc1441eb8ff9a2df0e15e778b44b73f97eb63d76`
Prior consolidation source: PR **#113** / `orchestration/wsa-mvp-consolidation-2026-09-20`
Hub target after deliberate integration: `https://kayfabizarro.pages.dev/kfb-hub/`

## Goal

Turn the current open GitHub state into one small routing artifact so an old draft, a human gate, a frozen recovery candidate and a genuinely current lane no longer look identical.

This slice does **not** repair product code and does **not** close PRs.

## Snapshot

- open PRs across the four main KFB repos: **72**
- `CURRENT`: **22**
- `HUMAN_GATE`: **16**
- `FROZEN_RECOVERY`: **12**
- `SUPERSEDED_CLOSE_CANDIDATE`: **22**
- queued Actions across the four repos at the check: **0**
- in-progress Actions across the four repos at the check: **0**

Machine-readable source: `OPEN_PROCESS_CENSUS.json`.

## Classification contract

### CURRENT
Still an active owner, dependency, evidence lane or technical next gate. Keep it open unless its own Return says otherwise.

### HUMAN_GATE
The next meaningful decision is Georg visual/freeplay/design acceptance. Do not burn implementation passes while that decision is open.

### FROZEN_RECOVERY
The current candidate hit a documented stop/source/publication/recovery gate. Preserve it. Resume only through its recorded smaller recovery gate.

### SUPERSEDED_CLOSE_CANDIDATE
A newer branch/PR or accepted consumer has overtaken this surface. **This census does not close it.** First verify whether any unique source/Return/evidence still needs to be salvaged or referenced.

## Current high-signal routing

- **Card Zone v3:** #161 remains CURRENT. The exact v2 fluid source is locked; the remaining browser-parity proof belongs to the builder, not to Georg as a four-screenshot homework task.
- **Legacy characters:** #162 is the current EyeRig human gate. #155 retains the frozen KLR-KIT integration history; do not confuse that with the green Legacy base.
- **Combat:** #5 remains the CA2 base; #7 is the current melee/contact/SOP lane; #9 is SOURCE HOLD for weapon identity; older #8 is a close candidate after evidence salvage.
- **Travel Track/Terrain:** Travel #31 is current technical evidence. Race #29 remains frozen/rejected foundation and must not be revived as the Travel macro-world solution.
- **Cloudflare/recovery:** kayfabizarro #108, Race #24 and similar public-proof failures are publication/recovery lanes, not proof that their underlying game runtime is broken.
- **Cologne Option C:** kayfabizarro #142 is the current published Stage intake of the Claude Design build. It now has a separate repair backlog: bridge/brown-surface penetration, stray cylinders, and segmented arch wedges/seams. That is a repair slice, not a visual redesign.

## Protected boundaries

- no PR is closed by this census;
- no merge or Live promotion;
- no product runtime code is changed;
- no second Race, Travel, Combat, Resident, ToolBox or deployment owner is introduced;
- Dropbox is read-only corroboration here;
- optional Game Development Studio CLI was checked once and is unavailable, so repository-native evidence is used.

## Done when

1. all currently open PRs in kayfabizarro / Combat / Travel / Race appear in the machine-readable census;
2. counts reconcile to the actual open-PR totals;
3. GitHub Actions active queues are explicitly checked;
4. router + Hub point at this census;
5. exactly one next product gate is left in `RETURN.md`.
