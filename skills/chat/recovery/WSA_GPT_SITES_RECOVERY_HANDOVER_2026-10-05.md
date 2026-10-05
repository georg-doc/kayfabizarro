# WSA Handover · KFB GPT-Sites-Recovery nach Codex-Fehlversuch

**Datum:** 2026-10-05  
**Adressat:** WSA / ChatGPT Web Lead  
**Status:** RECOVERY REQUIRED · keine weitere Veröffentlichung ohne Human Gate  
**Begleitendes Postmortem:** `recovery/CODEX_GPT_SITES_FAILURE_POSTMORTEM_2026-10-05.md`

## 1. Auftrag an WSA

Stelle die freigegebenen KFB-/Claude-Oberflächen und ihre vorhandenen Funktionen quelltreu wieder her. Übernimm keine der von Codex in diesem Task erfundenen beziehungsweise abgeleiteten Designentscheidungen.

Games sind aus diesem Recovery-Scope ausgenommen.

Priorität:

1. Schaden eindämmen und aktuelle Daten schützen.
2. Exakte freigegebene Designquellen identifizieren.
3. Eine Oberfläche nach der anderen als isolierten Kandidaten beweisen.
4. Erst nach Georgs sichtbarem Gate veröffentlichen.

## 2. Sofortiger Start

Vor jeder Änderung aktuelle GitHub-Versionen lesen:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `tools/KFB-ToolBox/START_HERE.md`
5. `skills/chat/KFB_ACTIVE_WORK_MAP_2026-10-04.md`
6. aktuelle SSOTs, Returns und PR-Stände der jeweiligen Site
7. das beigefügte Fehlversuchs-Postmortem

GitHub-Zustand gewinnt. Chat- und Site-Commits aus diesem Fehlversuch sind nur Recovery-Evidence.

## 3. Aktuell betroffene Live-Sites

| Oberfläche | URL | Aktuelle fehlerhafte Version |
|---|---|---|
| Production Hub | https://kfb-production-hub.frizzlebob.chatgpt.site | Version 6 |
| Production Control | https://kfb-production-control.frizzlebob.chatgpt.site | Version 79 |
| ToolBox | https://kfb-toolbox.frizzlebob.chatgpt.site | Version 2 |
| FrankenStein Composer | https://kfb-frankenstein-composer.frizzlebob.chatgpt.site | Version 3 |

Exakte Projekt-, Versions- und Commit-IDs stehen im Postmortem.

## 4. Containment-Entscheidung

Die vorherigen Site-Versionen sind weiterhin deploybar. Ein Rollback ist technisch möglich und entfernt die Codex-Änderungen, löst jedoch nicht den ursprünglichen Designfehler.

WSA soll zuerst transparent entscheiden:

- **Rollback zur Eindämmung:** vorherige Version wieder deployen, dann Recovery isoliert aufbauen.
- **Freeze:** aktuelle Version unverändert lassen, aber keine weitere Live-Mutation; Recovery nur als nicht veröffentlichter Kandidat.

Kein stilles Weiterbauen auf Codex Composer V3.

## 5. Recovery-Matrix, die vor Code vollständig sein muss

Für jede Nicht-Game-Site eine Zeile mit:

- kanonischer Owner;
- Repository, Branch/PR und exakter HEAD;
- exakter freigegebener Design-Donor;
- exakter Runtime-/Daten-Owner;
- erforderliche Funktionen;
- lokale Persistenz versus serverpersistente Daten;
- Theme-Vertrag;
- Desktop-/Split-/Mobile-Referenz;
- aktueller Live-Stand;
- bekannte Abweichungen;
- geplanter Rollback- oder Recovery-Punkt.

Keine Umsetzung beginnen, solange „freigegebener Design-Donor“ nur durch einen Screenshot oder eine ähnliche Oberfläche beschrieben ist.

## 6. Production Hub

### Bekannte freigegebene Designquelle

`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`

Wichtige Dateien:

- `HANDOVER.md`
- `code/KFB Hub UX Recovery v2.dc.html`
- `code/support.js`
- `code/hub-recovery/resident-overlay.v1.js`
- `code/hub-recovery/embedded-registry-2026-09-25.js`

### Muss erhalten bleiben

- Paper/Dark;
- Heute, Briefings, Projekte, Entscheidungen, Archiv;
- ToolBox- und WorldBuilder-Launch;
- Resident-Steuerung;
- Freshness-Anzeige und Reload;
- Suche;
- Pocket Inbox;
- Decision Queue und Sync-Paket;
- kompakte, lesbare Papieroberfläche ohne generisches Karten-Dashboard.

### Kritischer Fehler der aktuellen Version 6

Der Designkandidat fällt auf den eingebetteten Registry-Stand vom 25.09.2026 zurück. Der veröffentlichte Screenshot zeigte am 05.10.2026 „vor 10 Tagen“. Das Design darf bleiben, aber die Daten müssen aus dem aktuellen kanonischen Hub-/Production-Control-Owner kommen.

### Gate

Vor Veröffentlichung Screenshot mit:

- aktuellem Datum/Freshness;
- aktueller Today-Liste;
- funktionierender Theme-Umschaltung;
- sichtbarer Pocket Inbox;
- aktueller Decision Queue.

## 7. FrankenStein Composer

### Nicht verwenden

- Codex Composer Version 2;
- Codex Composer Version 3;
- die dort hinzugefügten abgeleiteten EyeRig-Farben und CSS-Strukturen;
- die Annahme, dass visuelle Nähe zum EyeRig die freigegebene Composer-Vorlage ersetzt.

### Ausgangspunkte

- PR #355;
- Branch `planning/frankenstein-composer-gpt-site-2026-10-04`;
- Planungs-HEAD `38d489ff0436f4102640647184f97ff5d7564ffb`;
- ursprüngliche Site-Version 1, Source-Commit `97a9eaa6374a65dc132154eaf47bfb7bd38ba80f`;
- Nutzerreferenzen: bereitgestellte Composer-Screenshots und die freigegebene ToolBox-/Claude-Vorlage;
- EyeRig ist nur dann visueller Donor, wenn der aktuelle GitHub-SSOT dies ausdrücklich bestätigt.

### Funktionaler Ablauf

Der sichtbare Ablauf muss sofort verständlich sein:

1. Körper/Quelle wählen;
2. Original isoliert ansehen;
3. Kopf/Gesicht über bestehende Owner montieren;
4. Bewegung prüfen;
5. reversibles Rezept speichern/exportieren.

### Muss erhalten bleiben

- echte Donor-Isolation;
- GothGirl, Black Knight, FrizzleBob EarRig v5 und Pencil;
- Eraser bleibt `SOURCE_REQUIRED`;
- vorhandene GLB-/Three.js- und Rezeptlogik;
- keine Ersatzgeometrie;
- kein neuer Rigging-Owner.

### Visuelles Gate

Vor Veröffentlichung drei Beweise liefern:

1. Desktop in der vom Nutzer gezeigten großen Auflösung;
2. Split-Screen-Breite wie im Nutzer-Screenshot;
3. schmale/mobile Ansicht.

Der Actor muss vollständig gerahmt sein. Quellenliste und Inspector dürfen die Bühne nicht verdrängen. Farben, Buttons, Tabs, Radien, Typografie und Abstände werden gegen den exakten freigegebenen Donor geprüft, nicht nach Augenmaß.

## 8. Production Control

Bekannter Funktionsbestand im Source-Repository:

- D1-Records und Historie;
- `public/persistent-inbox.js`;
- serverpersistente Intake-/Upload-/Export-Endpunkte;
- Runtime-Route `/runtime/hub-approved/`;
- bestehende Hub-Adapter.

Die Codex-Version 79 band die Inbox wieder ein, legte aber erneut eine abgeleitete Designschicht über die aktuelle Shell. WSA soll:

1. den exakten freigegebenen Control-/Hub-Designowner bestimmen;
2. die persistente Inbox im echten Template verbinden;
3. D1 und Auth unverändert lassen;
4. Theme-Umschaltung nur aus dem freigegebenen Vertrag übernehmen;
5. Upload, Reload und Handoff-Export real testen.

## 9. ToolBox

Die Codex-Version 2 ist ebenfalls eine CSS-Neuinterpretation und kein freigegebener Donor.

Erforderlich:

- eine kanonische ToolBox-Frontdoor;
- aktuelle Daten aus `toolbox.json` beziehungsweise aktuellem GitHub-Owner;
- keine große generische Hero-Fläche;
- kein zweites Produktdesign;
- Spezialwerkzeuge behalten ihre Owner;
- alte Oberflächen bleiben als History klassifiziert;
- exakte freigegebene ToolBox-Templatequelle vor Umsetzung bestimmen.

## 10. Andere Nicht-Game-Sites

Nicht pauschal redesignen:

- EyeRig Workbench: bestehende Workbench laut Dokumentation ohne Redesign veröffentlichen; produktiv und human accepted.
- KFB Audio: bestehende Site erhalten; Active Work Map fordert ausdrücklich keine Komplettneuschreibung.
- Asset Librarian: Phase A, 8/8 WSA QA PASS; zuerst aktuellen PR/Return prüfen.
- Hypernormalisation Curator: aktiver Daten-/Curator-Owner; zuerst PR #354 und Designquelle prüfen.

Erst wenn bei einer dieser Sites ein konkreter Bruch gegen ihren eigenen freigegebenen Donor bewiesen ist, eine separate Recovery-Slice öffnen.

## 11. Verbindliche Gates

### Gate A · Source identity

- Exakter Design-Donor isoliert sichtbar.
- Exakter Commit/Blob dokumentiert.
- Keine Behauptung nur aufgrund eines geladenen URLs oder ähnlicher Farben.

### Gate B · Feature parity

- Theme;
- Dropzone/Upload;
- Persistenz;
- Import/Export;
- Suche/Filter;
- aktuelle Daten;
- alle site-spezifischen Kernfunktionen.

### Gate C · Visual evidence

- Referenz und Kandidat bei denselben Viewportgrößen;
- Desktop, Split-Screen, Mobile;
- keine Veröffentlichung bei ungeprüfter Abweichung.

### Gate D · Human decision

Georg erhält einen direkten prüfbaren Kandidaten und entscheidet PASS / TUNE / FAIL. Erst PASS erlaubt das Ersetzen der produktiven Site.

### Gate E · Return

Return muss enthalten:

- Repo/Branch/PR/HEAD;
- Site-Projekt und Saved-Version;
- geänderte Dateien;
- tatsächliche Tests;
- Screenshot-Evidence;
- Daten-Freshness;
- ungelöste Punkte;
- genau ein nächstes Gate.

## 12. Lokale Fehlversuchs-Checkouts

Nur als Evidence und Diff-Quelle verwenden:

- `site-audit/hub`
- `site-audit/control-source`
- `site-audit/toolbox`
- `site-audit/composer`
- `site-audit/eyerig`
- `site-audit/audio`
- `site-audit/hyper`

Die letzten Commits in den ersten vier Verzeichnissen sind von Codex erzeugte Site-Source-Commits. Sie sind keine freigegebenen Design-Owner.

## 13. Abschlussbedingung

Die Recovery ist erst abgeschlossen, wenn:

- keine erfundene Designschicht mehr aktiv ist;
- Hub-Daten aktuell sind;
- der Composer das exakte freigegebene UI-System und den verständlichen Produktionsablauf verwendet;
- Theme und Dropzone dort funktionieren, wo sie zum bestätigten Vertrag gehören;
- alle geänderten Oberflächen vor der Live-Veröffentlichung sichtbar von Georg akzeptiert wurden.


## 14. GEORG PRIORITY OVERRIDE · 2026-10-05 · INTEGRATION FIRST

This section supersedes the broad four-Site recovery sequence above where the two conflict.

### Immediate outcome

Do **not** spend another Work / WSA design pass restoring visual consistency across all affected Sites now.

The immediate production requirement is only:

1. **Production Hub shows current work/status instead of the 2026-09-25 fallback snapshot.**
2. **Production Control contains and exposes the current durable records/decisions.**
3. Once those two are current enough to navigate production, **stop Surface Recovery and return to product integration.**

### Explicitly deferred

Until a later separately authorized design slice:

- no ToolBox redesign/recovery;
- no FrankenStein redesign/recovery;
- no cross-Site visual unification project;
- no rollback merely to obtain an older inconsistent design;
- no new dashboard, shell, theme system or replacement runtime.

ToolBox and FrankenStein remain frozen as known imperfect surfaces; their product/source owners are preserved.

### Cost firewall

Current-state repair is **DATA / PUBLISH_ONLY**, not a premium reasoning task.

Normal Web Chat may:
- update Production Control CURRENT records;
- update the canonical Hub board/status artifact;
- correct deterministic copies/sync inputs;
- prepare an exact Site-ready packet.

If the existing Hub host requires a version refresh to consume that already-prepared current data, use only the **lowest-cost Sites-capable PUBLISH_ONLY executor**. Do not spend Work/WSA credits on design reasoning, reconstruction or multi-Site recovery.

### Hub acceptance for this containment pass

PASS requires only:
- no visible 2026-09-25 stale fallback presented as current;
- current GitHub Issues/job state is represented;
- Hub links to the current products/issues/Control;
- freshness is truthful;
- existing useful Hub functions are not intentionally removed.

Visual consistency is **not** an acceptance target for this pass.

### Production Control acceptance for this containment pass

PASS requires only:
- current durable records are present;
- the latest Georg decision is visible/retrievable;
- Returns/history remain intact;
- no data loss or second datastore is introduced.

Visual consistency is **not** an acceptance target for this pass.

### Current job source

GitHub Issues remain the active job list:
- #360 World Studio · P0 · waiting-human;
- #361 Card-Hex Combat · P0 · waiting-human;
- #362 Triplet Stage · parallel · current TUNE pass.

### Stop condition

As soon as Hub + Production Control are current and usable, **stop this recovery lane**.

Next productive gate:
**RETURN_TO_PRODUCT_INTEGRATION**.


## 15. HUMAN FAIL · WRONG DESIGN · 2026-10-05

Georg visually rejected the current WSA recovery candidate immediately:

**HUMAN FAIL: WRONG DESIGN.**

Production Guard classification:
- failure type: `SOURCE_FIDELITY / DESIGN_IDENTITY`;
- impact: acceptance-blocking for the affected Site candidate;
- scope: freeze/quarantine **this candidate/design-repair seam only**;
- do **not** promote this into a stop of unrelated KFB product integration;
- do **not** spend another pass making the current candidate merely "closer";
- do **not** publish/overwrite a productive Site from this candidate.

Required next action before any further Site styling:
1. identify the exact approved design donor/source object;
2. show that donor in isolation;
3. record its exact source/commit/blob;
4. compare candidate structure/components against that donor;
5. only then may Builder perform one bounded implementation pass.

Builder may not self-classify the repaired result as accepted.
Independent Critic must compare exact donor vs candidate.
Production Guard alone may authorize CONTINUE / REPAIR / QUARANTINE / HUMAN_DECISION / STOP.

If the exact approved donor cannot be established, STOP **this Site-recovery seam** and preserve the current product data/state. Do not invent another design.

This HUMAN FAIL does not alter Georg's prior priority:
**Hub + Production Control current enough for use, then return to product integration.**


## 16. CORRECTION · REPAIR NOW, DO NOT FREEZE THE RECOVERY

The word "freeze/quarantine" in §15 applies only to the **wrong candidate bytes**. It does **not** pause the recovery assignment.

Current Guard route is:

**REPAIR NOW.**

Required behavior:
- discard the wrong visual candidate as an implementation source;
- continue the active WSA recovery immediately;
- do not wait for another Georg authorization merely to resume;
- do not iterate the wrong design toward similarity;
- rebuild from the exact approved Hub donor already present in GitHub.

### Exact Hub design source

Approved Hub UX recovery package:
`tools/KFB-ToolBox/_inbox/KFB HUB Design v2/KFB_HUB_UX_RECOVERY_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/`

Primary candidate entry:
`code/KFB Hub UX Recovery v2.dc.html`
SHA-256:
`cf43f9847615711af1fa28dcb41054664c5c8422df51679e80ff6bc2c6dad7d1`

Frozen donor proof:
`code/Hub Donor Proof v2.dc.html`
SHA-256:
`04bf574d1144ac449ff0863d5abf8bfa57d542068578d4e4bbd196fa2898a49b`

Byte-copy visual donor:
`code/hub-recovery/donor/kfb-hub-v2-dfaafac.html`
source pin:
`dfaafac070747f9543b5eb5a635e2aaa74e57b83`
SHA-256:
`ac89e153d396b94e6c00aae6aabc2652f732dd48c1c896e387207fe29c0e1078`

Current-data requirement:
- preserve the approved Hub UI/UX language from that package;
- **do not use** `embedded-registry-2026-09-25.js` as CURRENT;
- wire/consume the current Production Control / current-board state instead.

### Immediate acceptance route

Builder:
- implements exact donor design + current data only.

Independent Critic:
- compares donor proof / approved v2 candidate against the recovered Hub at matching viewports.

Production Guard:
- routes REPAIR until source/design fidelity is proven;
- may not classify the recovery as complete merely because it builds/deploys.

Human gate:
- Georg sees the recovered real design with current data.

This correction supersedes any reading of §15 that would stop or defer the active recovery.
