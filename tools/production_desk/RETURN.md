# RETURN · HUB-CTRL-01 · never-empty KFB Hub · 2026-09-24

Owner: KFB Production Desk / public route `https://kayfabizarro.pages.dev/kfb-hub/`.

## Root cause

The published `cloudflare-live:kfb-hub/index.html` contained one extra closing brace inside
`#embedded-registry`. The page script itself was valid, but the embedded JSON was not. Live raw registry
sources were unavailable at the same time, so all three data attempts returned nothing and the old UI
displayed “Es konnte kein Stand geladen werden.” The underlying GitHub work was not lost.

## Fix

- The public Hub is again generated from `render_desk.py`; no hand-edited JSON assembly.
- `render_desk.py` reparses the exact embedded payload before it writes the output.
- A separate minimal recovery registry is compiled into the page script. Even malformed live and embedded
  data now leave a visible recovery card plus direct Stage, ToolBox and GitHub links.
- The current embedded snapshot has 14 lanes and includes WB-W0, current Hürth A/B/C proofs, Billboard B2a
  and the Graveyard review route. WB2 is retained as donor and no longer presented as the current world plan.
- Gate proportionality and the current World/Racer/Hub masterplan are visible under working rules.

## Evidence before publication

- Python builder/render tests: **16/16 PASS**.
- Registry validator: **VALID**, **0 problems**.
- Generated embedded JSON: **PASS**, 14 lanes; page-script syntax: **PASS**.
- Real Chrome at local HTTP route: full embedded Hub renders with 3 LOOK_AT, 6 RUNNING, 1 CAN_START,
  4 WAITING and all configured tools.
- Real Chrome with deliberately malformed embedded JSON: `Notfall-Stand`, one recovery card and two direct
  tool links render; the old blank-state message does not appear.

## Publication state

`PUBLIC_VERIFIED` at `https://kayfabizarro.pages.dev/kfb-hub/`.

- `cloudflare-live` publication head: `620c26350d3ecb2ea48b70da42fd92f689911584`.
- The exact public route was opened in real Chrome and visibly showed the current 14-lane Hub.
- Visible counts: 3 LOOK_AT · 6 RUNNING · 1 CAN_START · 4 WAITING.
- Hürth, Billboard and Graveyard review links plus WB-W0, VFX-01 and Curtain-v2 intake cards were present.
- The page rendered from the valid embedded snapshot while GitHub raw propagation was still pending; this is
  the designed fallback, not a blank state.

## One next gate

HUB-CTRL-01 is complete. Start the separate WB-W0 source-lock gate; do not add more Hub architecture.

---

# Earlier return · KFB Production Desk v0 (PD1 + PD2) · 2026-09-23

Executor: Claude Coworker (Opus 5.5), STEP 2 of `COWORKER_OPUS55_SEQUENCE.md`.

## Built

- `tools/production_desk/config.json` — 12 lanes (4 buckets, 2 external), WSA, standards.
- `tools/production_desk/build.py` — online/fixture builder, validator, contentHash (timestamp-free).
- `tools/production_desk/render_desk.py` + `desk/desk.template.html` → `desk/KFB_PRODUCTION_DESK_V0.html`.
- `.github/workflows/production-desk.yml` — schedule/dispatch/main-push, publish to `bot/production-desk-update`.
- `registry/production/v1/*` — canonical snapshot from `snapshots/coworker-2026-09-23.json`.

## Evidence (local, sandbox)

- builder unit tests: **14/14 PASS**
- registry validate: **VALID**, problems 0
- desk behaviour (jsdom, runs the page script): **30/30 PASS** — embedded/Live/Hauptstand source selection,
  poll switch without reload, real brief copy, link fallback, blocked-clipboard manual copy, stale banner,
  launcher rules, "Kein Stand" on no data, no PR/SHA on card faces, external lanes marked LAST_KNOWN.
- publish decision logic: first-publish / unchanged / content-changed / heartbeat — PASS.
- `node --check` on page script: PASS.

## Not verified (honest)

- `--online` against the real GitHub API was **not** run: sandbox has no network. First real run = Actions.
- No real-browser screenshot (no Chromium in sandbox); behaviour covered by jsdom only.
- Travel/Racer: GitHub connector returns 404 for both repos → values are LAST_KNOWN from `CURRENT_STATE.md`.
- PR `updatedAt` for #188/#189/#190/#192 not captured in snapshot (null); heads are from `list_branches`.

## Design deviations from PRODUCTION_DESK_AUTOSYNC_V1.md (intentional)

1. Triggers: added `schedule` (30 min) because lane state lives on unmerged draft branches; main-push alone goes stale.
2. No auto bot PR: the Desk reads the bot branch directly; a PR per refresh would be noise.
3. Heartbeat publish (6 h) so `checkedAt` stays meaningful even when nothing changed.
4. Georg-facing UI in plain German (LOOK_AT → „Schau dir das an“, RUNNING → „Läuft gerade“,
   CAN_START → „Kannst du parallel starten“, WAITING → „Wartet“). Technical facts only in the drawer.

## Human gate

Georg: one decision only — merge the workflow file (or the whole slice) to `main` so the Desk updates itself.
Plus: does the Desk answer „was läuft, was muss ich entscheiden, was kann ich starten“ at a glance?

## Next

STEP 3 — resume ToolBox Source-Safe Integration (state: project memory `toolbox_model_switch_checkpoint`).
