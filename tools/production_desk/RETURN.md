# RETURN · KFB Production Desk v0 (PD1 + PD2) · 2026-09-23

Executor: Claude Coworker (Opus 5.5), STEP 2 of `COWORKER_OPUS55_SEQUENCE.md`.

## Built

- `tools/production_desk/config.json` — 12 lanes (4 buckets, 2 external), WSA, standards.
- `tools/production_desk/build.py` — online/fixture builder, validator, contentHash (timestamp-free).
- `tools/production_desk/render_desk.py` + `desk/desk.template.html` → `desk/KFB_PRODUCTION_DESK_V0.html`.
- `.github/workflows/production-desk.yml` — schedule/dispatch/main-push, publish to `bot/production-desk-update`.
- `registry/production/v1/*` — canonical snapshot from `snapshots/coworker-2026-09-23.json`.

## Evidence (local, sandbox)

- builder unit tests: **13/13 PASS**
- registry validate: **VALID**, problems 0
- desk behaviour (jsdom, runs the page script): **28/28 PASS** — embedded/Live/Hauptstand source selection,
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
