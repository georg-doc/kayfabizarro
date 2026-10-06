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


## 2026-10-05 · RECOVERY REOPENED · HUB SOURCE GREEN

Georg's direct product review supersedes the earlier "Surface Recovery stopped" conclusion.

Current production reality:
- Production Hub visible result is not accepted as the operating front door;
- World Studio #360 is **TOTAL FAIL / blocked**;
- Platformer/Card-Hex Combat #361 is **HUMAN FAIL / blocked**;
- Triplet Stage #362 is HOLD to stop optional spend;
- new feature/design expansion is frozen during recovery.

Hub recovery owner:
- Issue #364;
- branch `chatgpt-web/surface-consolidation-2026-10-04`;
- accepted donor pin: `dfaafac070747f9543b5eb5a635e2aaa74e57b83 · kfb-hub/index.html`;
- recovered `kfb-hub/index.html` blob: `f2e18b7ce3ea23e34fa57251cef6211155b3ce2d`;
- CURRENT board revision: `2026-10-05.8`;
- CURRENT board blob: `e0d882d854e2cc21f0a3f63bf78e86329d68f804`;
- test evidence: `HUB_RECOVERY_364_TEST_REPORT_2026-10-05.md`;
- static/source checks: **16/16 PASS**.

Recovered Hub source:
- accepted Paper/Dark donor CSS preserved byte-identically;
- Pocket Inbox preserved;
- search/filter preserved;
- current-board no-store adapter added;
- stale September embedded registry removed from CURRENT;
- generic dark-dashboard recovery fork removed;
- current ToolBox / Control / GitHub routing used.

No claim of Site publication or browser verification is made from this chat.

Exactly one next gate:
**PUBLISH_ONLY / Sites-capable executor updates the existing Production Hub Site in place from the frozen branch source, makes no design/source changes, and visibly verifies board 2026-10-05.8 at the exact Hub URL.**


## 2026-10-06 · Coworker running / Hub publish-only

Current:
- #360 Open World: Claude Coworker long integration run is RUNNING.
- PR #348: receiving contract; Work/Astra follows only after Coworker return.
- #364 Hub: source current, Site stale, PUBLISH_ONLY.
- Audio PR #365: separate listening gate.
- Combat #361: HISTORY/HOLD.
- Triplet #362: HOLD/NOT TODAY.

Hub source:
- index commit `523b70d790d619adbe75a68dfe123bc6919d84d7`;
- index blob `5172207a1181ce85e2966cc695042ad765525b9c`;
- board `2026-10-06.1`;
- board blob `4977a32858b5b191ccab7480a787dbdac26a91e6`;
- checks: 16/16 PASS.

Old World/Combat FAIL cards are history only and no longer appear in current fallback/briefings/quick links.

Next gate: PUBLISH_ONLY the existing Production Hub Site and verify the visible Hub shows Coworker RUNNING + Work/Astra NEXT.


## 2026-10-06 · BOARD 2026-10-06.2 · COWORKER + M/N/O AUDIO ROUTING

Current operating truth:
- #360 Open World remains **RUNNING in Claude Coworker**;
- do not start a parallel Work/Astra rebuild;
- after Coworker returns, ChatGPT Work/Astra first ingests the exact Coworker result and then acts only as Anschluss-Integrator;
- Audio PR #365 is registered as additive input, not as a second World lane;
- G/D remain runtime-verified;
- M Island Life = 112 BPM, master + 10 stems;
- N Dusk/Night = 70 BPM, master + 11 stems;
- O Discovery/POI = 82 BPM, master + 9 stems;
- M/N/O source presence = **33/33 non-empty MP3 files**, but all three remain `SOURCE_PRESENT_RUNTIME_UNVERIFIED` until decode/alignment/loop/listening QA;
- family-local failures must not block unrelated families or ordinary World boot;
- Combat #361 remains HISTORY/HOLD;
- Triplet/ChatterBox #362 remains HOLD/NOT TODAY.

Hub board:
- revision `2026-10-06.2`;
- implementation checkpoint `15a3b425c66138b08fdabe8c5a9d18559bd76e62`;
- both canonical board copies read back identical;
- old FAIL cards in CURRENT = **0**;
- `kfb-hub/index.html` was not modified.

The visible GPT Site is still stale until a Sites-capable executor publishes this frozen source in place.

Exactly one next gate:
**PUBLISH_ONLY the existing Production Hub Site, with no redesign/source edits, then verify the visible Hub shows Coworker RUNNING, Work/Astra NEXT, and Audio M/N/O as QA-pending additive input.**


## 2026-10-06 · BOARD 2026-10-06.3 · STYLE REFERENCE LIBRARY PUBLISHED TOOL

Asset Librarian / Style Reference Library is no longer READY/PARKED.

Current owner/source:
- Draft PR #359;
- branch `planning/style-reference-library-r1-surface-2026-10-05`;
- current head `76211dec6b89aff969a8622f82c415f90b8b56a9`;
- PR remains unmerged.

Current project Return records:
- R1 published in place inside the existing Asset Librarian Site;
- no second Site / no second Registry;
- 13 official Etherington references;
- search + filters + URL intake;
- Reference Cards/Sets;
- notes + Construction Principles;
- curated Reference ↔ Asset relations;
- export/reload;
- restored real 3D previews;
- whole-card Inspector;
- image-overlay Plus button;
- five-icon mobile navigation;
- ToolBox route to the real Style References deep-link;
- Tester PASS;
- Critic findings resolved/retested;
- Guard GO.

Current URLs:
- `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`
- `https://kfb-toolbox.frizzlebob.chatgpt.site/`

Verification boundary:
- GitHub Return/source identity: **VERIFIED**;
- Georg/producing executor reports the GPT Sites published and clean;
- this Web Chat cannot directly fetch the private GPT Site host, so it does not relabel that publication as an independent fresh-browser verification.

Hub board:
- revision `2026-10-06.3`;
- board implementation checkpoint `f06ae3c05e0e665aeff4d621f62d8390a4bdef0e`;
- board blob `47600bffbeb743d07e4c9add9efc39071d4a484a`;
- Hub HTML blob `5172207a1181ce85e2966cc695042ad765525b9c` unchanged.

Primary routing remains unchanged:
1. #360 Coworker Open World integration RUNNING;
2. Work/Astra Anschluss-Integrator after exact Coworker return;
3. Audio #365 additive input / M-N-O QA;
4. Style Reference Library is **available tooling**, not a blocker.

Exactly one Hub gate remains:
**PUBLISH_ONLY the existing Production Hub Site from frozen source and verify visible board 2026-10-06.3.**


## 2026-10-06 · BOARD 2026-10-06.4 · CURRENT STYLE REFERENCE HEAD + CLAUDE DESIGN BRIDGE

Latest observed Asset Librarian source:
- Draft PR #359;
- branch `planning/style-reference-library-r1-surface-2026-10-05`;
- current head `c9a8ec13af8513507b13eda2efeab6664f27ce86`;
- commit purpose: Claude Design bridge return;
- PR remains draft/unmerged.

Published Site state remains unchanged from the final publication return:
- Asset Librarian R1 published in the existing owner-only Site;
- ToolBox route live;
- no second Site / no second Registry.

Additional current capability:
- portable Reference-Pack bridge for Claude Design;
- canonical transport: `Private Asset Librarian → curated Reference Set → portable Design Job Packet → public GitHub → Claude Design`;
- Clouds working example under `tools/asset_registry/librarian/reference-packs/claude-design/kfb-clouds-01/`;
- bridge validation: **8/8 PASS**;
- no remote reference image binaries embedded;
- exact source-isolation rule retained.

Hub board:
- revision `2026-10-06.4`;
- board checkpoint `582a57ee44613bc91e3d1716f039c05561e7555a`;
- board blob `4485a2a7da104cbffc016410d01643e7edbfbe7b`;
- Coworker primary preserved;
- Work/Astra next preserved;
- old FAIL cards = 0.

Exactly one Hub gate remains:
**PUBLISH_ONLY the existing Production Hub Site and verify visible board 2026-10-06.4.**


## 2026-10-06 · RESIDENT ARCHITECTURE PREP + BOARD 2026-10-06.5

Current routing milestone:
- Coworker #360 remains the only Open World runtime writer and continues its existing scope.
- No Resident runtime work starts before the exact Coworker Return and post-return Architecture Freeze.
- Resident Life planning is now a separate **PREP · NO RUNTIME WRITES** lane.
- ChatGPT Web Chat may prepare schemas/mappings/data.
- Claude Design may prepare visual emotion/choreography references from pinned sources.
- Blender MCP may inventory reusable motions/gaps only; no blind animation batch.
- ChatGPT Work/WSA becomes the Architecture Freeze / Anschluss-Integrator only after Coworker returns.

Resident prep:
`skills/chat/workflows/KFB_SURFACE_CONSOLIDATION_2026-10-04/RESIDENT_LIFE_ARCHITECTURE_PREP_2026-10-06.md`

Prepared topics:
- ResidentProfile;
- AffectState + emotion/performance mapping;
- Daily Activities / POIs / route variation;
- Resident↔Resident and Resident↔Player encounters;
- lightweight relationship/memory;
- Fluff harvest / trade / gifts / build / rebuild loops;
- Resident Performance Composer;
- simulation LOD;
- LLM-free default + optional AI escalation.

Hub board:
- revision `2026-10-06.5`;
- two canonical board copies verified identical;
- Resident prep appears as a P1 planning lane;
- no Hub HTML/CSS redesign;
- existing Hub remains PUBLISH_ONLY.

Issue #364 is updated to publish board `2026-10-06.5` in the existing Site project with a strict token firewall.

Exactly one next production gate remains:
**Coworker finishes and returns its exact Open World candidate; then Work/WSA performs Architecture Freeze before any new runtime integration.**
