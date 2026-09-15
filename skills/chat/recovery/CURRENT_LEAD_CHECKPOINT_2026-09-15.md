# KFB Lead · Current Recovery Checkpoint · 15.09.2026

Status: CURRENT RECOVERY POINTER. Kein Runtime-SSOT. Ein frischer Lead-Chat liest zuerst `skills/chat/RECOVERY_PATH.md` und überprüft danach den jeweils aktuellen GitHub-Stand.

**Human bookmark:** `https://kayfabizarro.pages.dev/kfb-hub/` — searchable navigator across the links below; never a replacement SSOT.

## Warum diese Karte existiert

Der Lead-Chat verbindet zurzeit Town, Travel, ToolBox, Asset Librarian und Stunt/Race-Donors. Bei Chat-Abbruch soll Georg keinen Transkript-Dump rekonstruieren müssen.

## Aktuelle Arbeitslinien

### KFB Town

Einstieg: `skills/chat/town/START_HERE.md`.

Dann `SESSION_CARD.md` lesen. Der aktuelle öffentliche Cursor ist S001 r022 plus das dort verlinkte `references/TOWN_S001_R017_R022_PUBLIC_DELTA.md`; §§12–13 von `LIVING_KFB_TOWN.md` sind der historische r016-Checkpoint. Aktuelle Richtung: natürliche Travel-Landschaft, Character-first Siedlung, gemeinsame Showbühne beim Turm, Makerspace/Kino, Town Workbench als Candidate-Handoff und Travel als Terrain-/Sky-Spender. Bestehende Owner bleiben unverändert.

Post-r022 TBD: `skills/chat/masterplan/WORLD_COLOR_LIGHTING_COHESION_TBD_2026-09-15.md` — gemeinsame World Lighting / Color Response über Asset-Familien; Town konsumiert später den Travel-Look-Contract, Color Grading zuletzt.

### Geburtstags-Opener

Mittwoch muss nicht die ganze Town fertig sein. Kleinster sinnvoller vorzeigbarer Stand: vorhandenen RollerCoaster/Pet-Select-Donor weiterverwenden, FrizzleBob plus den tatsächlich gewählten Geburtstags-Character zeigen, Wortmarke + `Happy Birthday Elisa`, Character-Auswahl und wenige sichtbar passende Animationszustände. Town-Silhouette/3D-Raum kann Kulisse sein; vollständiges Terrain ist keine Voraussetzung.

Animation nicht nach Menge auswählen. Für den Opener reichen Rollen wie Idle, Hover/Focus, Click/Select/Celebrate und Rückkehr in einen ruhigen Zustand. KayKit-Motions am echten Rig prüfen; FrizzleBob bleibt sein eigener Actor-/Animation-Consumer und wird nicht durch behauptete KayKit-Kompatibilität ersetzt.

### Asset Librarian

Permanent URL: `https://kayfabizarro.pages.dev/asset-librarian/`.

Postmortem: `tools/asset_registry/librarian/POSTMORTEM_CHAT_BREAK_2026-09-15.md`.

Vor diesem Dokumentationscommit lag Main bei `3f6e8dcc5d00ff642488f7e5e1c76cd6ad052f84`: v1.7 Browse/Filter-Pass gemergt; Browser-Smoke Run `34919321337` SUCCESS. Town Workbench v1.6 und On-character KayKit Motion Preview sind Teil der grünen Regression. Dokumentation/Manifest/Return hinken hinter v1.7 her und müssen vor neuer breiter Featurearbeit versöhnt werden.

### ToolBox

Input-Paket: `tools/KFB-ToolBox/_inbox/KFB FrankenStein ToolBox (WS0).zip`.

**WS0 SOURCE REPORT, 15.09.2026:** lokaler Jobordner `_inbox/WS0_2026-09-15/`; 113 entpackte Einträge; 101/101 Paket-Prüfsummen PASS; Modulschluss laut WS0 87 Dateien / 7 Einstiege / 0 unauflösbare lokale Modulreferenzen außer externen Schriftverweisen; 30/31 Embed-Dateien bytegleich, `carlrig-mount.v1.js` erwartete v3.1-Abweichung; Kaltstart 7/7. WS0 bewertet Daten erhalten = PASS, Parameter angewandt = TEILWEISE, sichtbar gleich = TEILWEISE und nennt `T1_SOURCE_CLOSURE_DELIVERED`. Diese Detailtests wurden vom Lead-Chat nicht selbst reproduziert.

**Unabhängig hier geklärt:** der GitHub-Commit, der das Original-ZIP hinzufügte, ist `a3adb84692fd381fafe75d294f9e14d5b6f12c4d` (`Add files via upload`). Der ausführliche lokale WS0-Jobordner war bei dieser Prüfung noch nicht unter `tools/KFB-ToolBox/_inbox/` auf `main` sichtbar; vor Chat-Abbruch daher Return/Delta/QA dauerhaft pushen.

Weiterhin zwei getrennte Ergebnisse: A = vollständiger kaltstartfähiger Quellstand und echtes Delta; B = ein gemeinsamer workfloworientierter UI-Pilot auf denselben Modulen. Vor B die noch teilweise Feld-/Sichtabdeckung mit einer positiven Feldmatrix schließen oder ausdrücklich als offene Abweichung klassifizieren. ToolBox-/Town-Ideen nicht als Zusatzscope in A hineinziehen.

UI-Schriften bleiben readability-first: Roboto/System-Sans für ToolBox-Bedienung; keine Schriftdateien in Übergabepakete. Artwork-Schriften bleiben getrennte, optional externe Art-Assets.

### Stunt / Vehicles · Low-effort presentation

Implementation SSOT bleibt `georg-doc/KFB-Stunt-Car-Race`. Neue User-Direction ist dort in `_handover/VEHICLE_DRIVERLESS_PRESENTATION_DIRECTION_2026-09-15.md` gesichert.

Ordinary cartoon vehicles dürfen ohne sichtbaren seated Driver / Cockpit / Tricycle-Graft fahrbar sein. Der ausgewählte Character gilt während des Fahrens narrativ als im Vehicle; Town kann bei Bedarf einen kurzen Enter/Exit-Übergang zeigen. Der bestehende Driver-Graft bleibt optionaler authored presentation layer für besondere Fahrzeuge und wird nicht gelöscht.

Die Race-Physik, Kamera und Progress-Owner bleiben unverändert. Visual acting darf auf einem Präsentations-Child aufsetzen, aber Collider/Physik nicht still verschieben. Ziel ist, den vorhandenen Cartoon-Vehicle-Pool schnell nutzbar zu machen und KayKit-/andere Characters nicht vom ToolBox-Cockpitbau abhängig zu machen.

### Travel / Town Terrain

Implementation SSOT bleibt `georg-doc/KFB-Travel-Globe`. Town liefert Gestaltung/Candidates, Travel besitzt Welt/Terrain/Sky/Movement. Für die geplante Startzone bestehende Travel-/TinySkies-Küsten-, Boden-, Sky-, Day/Night-, Aurora-/Wetter-Bausteine zuerst wiederverwenden. Kein zweiter Terrain-/Sky-Owner.

Erster Terrain-Showcase darf Plateau, Königshügel, gemeinsame Bühne, Siedlungsfläche, Fluss/Mündung und sichtbare Pirateninsel vorsehen; konkrete Geometrie folgt erst nach aktuellem Town-Candidate-Handoff und Travel-Quellenprüfung.

Danach beziehungsweise parallel als kleine Vergleichsszene: `WORLD_COLOR_LIGHTING_COHESION_TBD_2026-09-15.md`. Vorgeschlagen ist eine KFB Look Calibration Stage mit fünf bis acht repräsentativen Assets in Day, Golden Hour und Graveyard Night. Erst Material-/Lichtantwort messen; globales Color Grading/LUT erst am Ende erwägen.

## Recovery-Satz für einen frischen Lead-Chat

> Lies `skills/chat/RECOVERY_PATH.md`, dann `skills/chat/recovery/CURRENT_LEAD_CHECKPOINT_2026-09-15.md`. Verifiziere den aktuellen `georg-doc/kayfabizarro`-Main-HEAD und die jeweils genannten Projekt-SSOTs. Für Town danach `skills/chat/town/START_HERE.md` + Session Card + das dort verlinkte Public Delta; §§12–13 im Living sind der historische r016-Checkpoint. Für Travel-Look-Fragen den World-Color-/Lighting-TBD lesen. Für Asset Librarian den Postmortem lesen. Für Stunt-Vehicles den driverless-presentation Handoff im Stunt-SSOT lesen. Keine bereits gemergten Funktionen neu bauen und keine Owner still ersetzen.
