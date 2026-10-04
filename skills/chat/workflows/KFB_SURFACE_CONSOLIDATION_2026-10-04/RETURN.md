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

