# KFB Surface Consolidation · Return · 2026-10-04

## 1 · Was ist der Stand?

Die Produktionsoberflächen sind als ein zusammenhängendes System veröffentlicht:

- **Production Hub** ist der einzige menschliche Einstieg und zeigt den aktuellen P0/P1/Parallel-Stand.
- **Production Control** ist der kanonische Daten-, Returns- und History-Owner. CURRENT ist die Standardansicht; Historie ist sekundär.
- **KFB ToolBox** existiert genau einmal als Router zu den aktuellen Spezialwerkzeugen. Alte Home-/Stage-/Standalone-Oberflächen sind sichtbar als History/Donors klassifiziert.
- World Studio und Combat bleiben Produkte, keine Dashboards.

Repo: `georg-doc/kayfabizarro`

Branch: `chatgpt-web/surface-consolidation-2026-10-04`

Implementierungs-/Architektur-Checkpoint: `67c1d4e40c828729675ce9619f2f3b9662e923da`

Kein Merge. Keine Live-Promotion. Kein Cloudflare-Ersatz.

## 2 · Wer macht jetzt was?

Georg öffnet nur den Production Hub und prüft, ob die tägliche Route verständlich ist: zwei P0-Produkte, genau eine ToolBox, Control/History sekundär.

Routine-Statusänderungen laufen künftig über Production Control und `surface-config/CURRENT_BOARD.json`; Routine-Darstellung über `surface-config/PRESENTATION.json`. Beide Pfade brauchen kein Work-Modell. Wenn eine Host-Veröffentlichung nötig ist, genügt PUBLISH_ONLY.

## 3 · Was musst du tun?

Öffne ausschließlich:

https://kfb-production-hub.frizzlebob.chatgpt.site

Prüfe kurz:

1. Sind World Studio und Combat sofort als P0 sichtbar?
2. Führt „ToolBox öffnen“ zu genau einem Werkzeug-Router?
3. Führt „Control / Historie“ zur Ledger-Ansicht statt zu einem zweiten Dashboard?

Antworte danach nur mit **PASS**, **TUNE** oder **FAIL** plus einem kurzen Satz.

## 4 · Was passiert danach?

- Bei **PASS** bleibt die Oberfläche eingefroren; normale Status- und Darstellungsupdates laufen über die dokumentierten Low-Cost-Pfade.
- Bei **TUNE** wird nur die genannte Daten- oder Präsentationseigenschaft geändert.
- Bei **FAIL** wird der konkrete Navigations-/Datenfehler repariert; keine neue Hub-, Control- oder ToolBox-Site wird angelegt.

## Technische Evidenz

### Sites

| Surface | Project | Version | Deployment | Source commit | Status |
|---|---|---|---|---|---|
| Production Hub | `appgprj_6ab7358322a8819183d2fa036b7b12f9` | `appgprj_6ab7358322a8819183d2fa036b7b12f9~appgver_61d8fd9c75d08191872e1acf9bdfd3ef` | `appgdep_6ac2be0ca3c88191b7224b910a98b786` | `0de021b625166e7ec74defba56e4a00836b9d890` | `SITE_VERIFIED` |
| Production Control | `appgprj_6ab82e3950b88191a8ead3c495e21454` | `appgprj_6ab82e3950b88191a8ead3c495e21454~appgver_855c03b14a448191b13ab7b4c2040aba` | `appgdep_6ac2bc9f55e0819183bac00466aa3e5a` | `67a680820949568001553f15d83675d7f5d6a2eb` | `SITE_VERIFIED_LIVE_READ` |
| KFB ToolBox | `appgprj_6ac2ba44282881919d1a49287a32054e` | `appgprj_6ac2ba44282881919d1a49287a32054e~appgver_bffb1a7eb0b081919f94ef702f44a79c` | `appgdep_6ac2bc4091d48191a3e127372122d34d` | `a7c327c9ea96fce9cc9cc7c8fe6b8398b890b7dd` | `SITE_VERIFIED_HTTP_200` |

### Tests

- Production Control MCP regression: **35/35 PASS**.
- Production Control framework build: **PASS**.
- Production Hub fresh-browser acceptance: **12/12 PASS**, zero fresh console errors.
- ToolBox private host: **HTTP 200**, **3/3** content checks.
- Required routine status proof: temporary checkpoint visible in Control and Hub; **PASS**.
- Required presentation proof: token-only `--accent` change visibly applied; **PASS**.
- Restoration: final CURRENT `2026-10-04.2`, original accent restored, probe absent; **PASS**.
- UI-source changes during the proof: **0**.
- Business-logic changes during the proof: **0**.

### Durable paths

- `skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/surface-config/CURRENT_BOARD.json`
- `skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/surface-config/PRESENTATION.json`
- `skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/sync-surface-data.mjs`
- `skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/sync-presentation.mjs`
- `skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/SURFACE_UPDATE_RUNBOOK.md`

Offene Core-Blocker: **keine**.

Genau ein nächstes Gate: **Georg öffnet den Production Hub und antwortet PASS / TUNE / FAIL.**

Jetzt:
- Production Hub, Control und genau eine ToolBox sind veröffentlicht und verifiziert.

Du:
- Öffne nur den Production Hub und antworte PASS / TUNE / FAIL.

Danach:
- Routine-Updates laufen ohne Work über Control + deterministischen Sync; technische Arbeit beginnt nur bei einem echten Engineering-Defekt.

## 2026-10-04 · CURRENT UPDATE · EyeRig TODO / Fluff state

Routine data update only; no UI/business-logic change.

CURRENT board:
- revision `2026-10-04.3`;
- EyeRig profile recovery added as P1 `RECOVER FIRST`;
- 15 Medium recovery/profile-tune identities listed;
- Large remaining review/tune + Legacy human-review/Skull status listed;
- EyeRig v6 recorded as integrated character presentation default;
- Fluff corrected from Blender source audition to runtime consumer proof after Part 3.

Production Control CURRENT record:
`2ebf08e1-f8d1-4d50-b4f7-c0b651589046`.

EyeRig durable TODO:
`tools/KFB-ToolBox/eye-rig-batch/docs/EYERIG_CURRENT_TODO_2026-10-04.md`.

Static Hub board publication still follows the existing low-cost `PUBLISH_ONLY` runbook. This chat changed only the deterministic data source and Control CURRENT record; it does not claim a new Site deployment.


## 2026-10-05 · SUPERSESSION · GitHub Issues are now the job list

New coordination decision supersedes the earlier assumption that Production Hub / Production Control must be refreshed between every job.

Current operating model:
- GitHub Issues = active job list;
- #360 World Studio + #361 Combat = P0 / waiting-human;
- #362 Triplet Stage = parallel / waiting-human;
- Production Hub = optional orientation;
- Production Control = private archive/history;
- ToolBox = specialist-tool router.

Hub board source is reconciled at revision `2026-10-05.1`. No new Site deployment is claimed from this chat. Future jobs do **not** require another Hub/Control round unless the issue workflow itself proves insufficient.



## 2026-10-05 · GEORG PRIORITY OVERRIDE · HUB/CONTROL CURRENT, THEN INTEGRATION

Georg explicitly rejected rollback as the recovery strategy because the earlier Sites were already visually inconsistent and a rollback would only restore another imperfect state.

Current priority is now:

1. Production Hub must show current production state and must not present the 2026-09-25 embedded fallback as current.
2. Production Control must contain the latest durable decisions/Returns/current-state records.
3. No further Work/WSA credits are to be spent on broad Site design recovery now.
4. ToolBox and FrankenStein visual recovery are deferred/frozen.
5. As soon as Hub + Control are current enough for navigation/history, Surface Recovery stops and product integration resumes.

Cost classification:
- current-state/data correction = normal Web Chat;
- host refresh, only if technically required = lowest-cost Sites-capable `PUBLISH_ONLY`;
- no premium Work/WSA reasoning for CSS/design reconstruction.

Current board source and publishable Hub copy are both synchronized at:
- revision `2026-10-05.2`;
- `skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/surface-config/CURRENT_BOARD.json`;
- `kfb-hub/current-board.json`.

Current operating jobs:
- #360 World Studio · P0 · waiting-human;
- #361 Card-Hex Combat · P0 · waiting-human;
- #362 Triplet Stage · parallel · TUNE.

Exactly one next gate:
**HUB_CONTROL_CURRENT_ONLY → RETURN_TO_PRODUCT_INTEGRATION**.

No claim is made here that the GPT Site host has already consumed revision `2026-10-05.2`; that remains a host-level verification/publish-only step.


## 2026-10-05 · FINAL WSA RETURN · SURFACE RECOVERY STOPPED

WSA returned the Hub recovery as completed and published.

Reported result:
- Production Hub: `https://kfb-production-hub.frizzlebob.chatgpt.site/?version=8&revision=2026-10-05.2`
- Site version: **8**
- Site/source commit reported by WSA: `46455295f12c1be89e46e4e4b8f4899831d5f559`
- approved donor design used;
- Paper/Dark present;
- Pocket Inbox present;
- Dropzone present;
- Decisions present;
- compact Today workflow present;
- CURRENT = `2026-10-05.2`;
- #360 / #361 / #362 present;
- embedded 2026-09-25 fallback removed from the deployment;
- ToolBox unchanged;
- FrankenStein unchanged.

Important verification boundary:
- the GitHub board source is independently verified at revision `2026-10-05.2`;
- this chat's generic web fetch cannot open the private GPT Site host, so the visible Site result is recorded as **WSA_REPORTED_PUBLISHED**, not independently re-labeled as browser-verified by this chat;
- the reported Site/source commit `46455295...` is not a commit in `georg-doc/kayfabizarro`; treat it as Site-system source identity unless/until mapped otherwise.

Decision:
**STOP SURFACE RECOVERY.**

No more Hub/Control/ToolBox/FrankenStein design recovery work is authorized from this incident.

Exactly one next gate:
**RETURN_TO_PRODUCT_INTEGRATION**.
