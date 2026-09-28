# Claude Design · RESIDENT-ANIMATION-TOOLBOX-UI-01

## Execution Card · verbindlich

- **Owner/Tool:** aktueller Claude Design Desktop Chat; kein Neustart.
- **Model:** Opus 5.5 High beziehungsweise das stärkste verfügbare Claude-Design-Modell.
- **Reasoning:** High für den zusammenhängenden UI-/Interaction-Pass; keine High-Reasoning-Zeit für reine Upload-/Sync-Arbeit.
- **Slice size:** ein zusammenhängender Session Cut mit Inline-Editor, Library/Choreography View und Clay-World-Ansicht.
- **Technischer Integrations-Fallback:** Claude Coworker Desktop (stärkstes Coding-Modell, High) oder Codex GPT-6 Sol High; Claude Design soll keine GitHub- oder Deployment-Schleife besitzen.
- **Persistence:** zuerst KFB Production Control Site / Web Push; GitHub nur für den kleinen kanonischen Source-/Return-Checkpoint. Verbindliche Regel: `../KFB_SITE_FIRST_PERSISTENCE_2026-09-29/START_HERE.md`.
- **Stop rule:** nur echter Source-/Runtime-Blocker oder zwei fehlgeschlagene Reparaturversuche; dann Recovery-Paket statt Rückfragenkette.

## Site-first Übergabe

Der Nutzer soll keine Dateien oder Statusmeldungen zwischen Chats vermitteln. Entscheidungen, JSON, Screenshots, Testnotizen und Exporte gehen zuerst über den im Hub genannten Web-Push-/Intake-Weg. Browser-localStorage allein gilt nicht als gespeichert. Ein GitHub-Timeout ist UNKNOWN: erst Ref prüfen, nur bei fehlendem Write wiederholen. Der Abschluss dieses Design-Slices aktualisiert seine Hub-/Site-Karte automatisch; das ist Teil des Jobs.





## Auftrag


Entwirf im bereits laufenden Claude-Design-Chat genau eine integrierbare Neufassung von **Resident Atlas + Animation Lab/Library** im aktuellen, freigegebenen **KFB ToolBox Design**.


Beide Bereiche nutzen dieselbe ToolBox-Shell, denselben vollständigen 3D-Inline-Editor und dieselbe Character-/Motion-Auswahl. Dies ist ein UI-/Interaction-Design-Job. Keine neue Runtime, kein neuer Atlas, kein zweites Animation Studio, kein neues ToolBox-Shell-Design und kein GitHub-Job.


**Ausführungsentscheidung:** Der bereits laufende Resident-Atlas/Claude-Design-Chat führt Job A weiter. Kein Neustart in einem frischen Chat und kein Human Gate nach einem isolierten Editor-Mikroschritt. Interne Checkpoints sind erwünscht, aber die Abgabe bleibt ein zusammenhängender Session Cut mit Editor, Library/Choreography View und Clay-World-Ansicht. Nur ein echter Source-/Runtime-Blocker oder zwei fehlgeschlagene Reparaturversuche stoppen den Durchgang.


## Eingabepaket


Lies zuerst aus dem öffentlichen GitHub-Stand:


1. `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/START_HERE.md`
2. dort `RETURN.md`, `TEST_REPORT.md`, `SOURCE.json`
3. `KFB_Resident_Atlas_S11.html#__graveyard`
4. `lib/edit-layer.js`
5. `data/graveyard-01.json` und `lib/graveyard.js`
6. den aktuellen KFB ToolBox Production-05 Session Cut als angenommene Funktions- und Designbasis;
7. PR #275 `georg-doc-patch-3@358f4eeece97587498bd898a170089d53ad3f628`;
8. dort `media/3D_Assets/Animations/KFB_Motion_Library/RETURN_INTAKE_04.md`;
9. dort `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json` mit 263 eindeutigen Clips;
10. dort `skills/chat/workflows/KFB_CHOREO_LAB_01_2026-09-29/CHOREO_LAB_01_RETURN.md`;
11. dort `scenes/*.json`, `resolved/*.resolved.json` und die sechs Storyboard-/Graft-Prüfbilder aus `renders/`.


GitHub main ist beim Briefing `51f9bc22596a0d0165f4da9e8e2ea14118466210`. Vor Beginn erneut prüfen.


Der S11-Export ist Content- und Funktionsdonor. Seine UI ist keine akzeptierte Gestaltungsvorlage.


## Clay-Look Source Lock · verbindlich, nicht neu erfinden


Der KFB-Claymation-Look **existiert bereits als Baukasten auf GitHub**. Claude Design darf in diesem Job weder einen vierten Clay-Stil noch ein isoliertes Graveyard-Materialsystem bauen. Lies und verwende die folgende Donor-Kette in dieser Reihenfolge:


1. **H0 Hirnwelt · Art Direction und Weltgrammatik**
   `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
   Zuerst: `START_HERE.md` → `HANDOVER_WSA.md` → `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md` → `docs/LIVING_CLAY.md`.
   Visuelle Referenzen: `KFB Hirnwelt H0.dc.html`, `KFB Knetwelt Look-Konzept.dc.html`, `evidence/01-h0.png` bis `04-h0.png`, `ref/claybound/web/`.
   H0 besitzt die bunt-harmonisch-weirde Diorama-/Hirnwelt-Richtung, die Fassaden-/Fensterrhythmik und die Größenstaffelung von Clay-Spuren.
2. **K2 Knet-Werkzeuge · akzeptierter Material- und Werkzeugbaukasten**
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`
   Zuerst: `START_HERE.md` → `HANDOVER_WSA.md` → `docs/LIVING_CLAY.md`.
