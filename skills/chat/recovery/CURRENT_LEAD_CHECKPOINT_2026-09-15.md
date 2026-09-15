# KFB Lead · Current Recovery Checkpoint · 15.09.2026

Status: CURRENT RECOVERY POINTER. Kein Runtime-SSOT. Ein frischer Lead-Chat liest zuerst `skills/chat/RECOVERY_PATH.md` und überprüft danach den jeweils aktuellen GitHub-Stand.

**Human bookmark:** `https://kayfabizarro.pages.dev/kfb-hub/` — searchable navigator across the links below; never a replacement SSOT.

## Warum diese Karte existiert

Der Lead-Chat verbindet zurzeit Town, Travel, ToolBox und Asset Librarian. Bei Chat-Abbruch soll Georg keinen Transkript-Dump rekonstruieren müssen.

## Aktuelle Arbeitslinien

### KFB Town

Einstieg: `skills/chat/town/START_HERE.md`.

Dann `SESSION_CARD.md` und §§12–13 von `LIVING_KFB_TOWN.md` lesen. Aktuelle Richtung: Character-first Siedlung, gemeinsame Showbühne beim Turm, Makerspace/Kino, Town Workbench als Candidate-Handoff und Travel als Terrain-/Sky-Spender. Bestehende Owner bleiben unverändert.

### Geburtstags-Opener

Mittwoch muss nicht die ganze Town fertig sein. Kleinster sinnvoller vorzeigbarer Stand: vorhandenen RollerCoaster/Pet-Select-Donor weiterverwenden, FrizzleBob plus den tatsächlich gewählten Geburtstags-Character zeigen, Wortmarke + `Happy Birthday Elisa`, Character-Auswahl und wenige sichtbar passende Animationszustände. Town-Silhouette/3D-Raum kann Kulisse sein; vollständiges Terrain ist keine Voraussetzung.

Animation nicht nach Menge auswählen. Für den Opener reichen Rollen wie Idle, Hover/Focus, Click/Select/Celebrate und Rückkehr in einen ruhigen Zustand. KayKit-Motions am echten Rig prüfen; FrizzleBob bleibt sein eigener Actor-/Animation-Consumer und wird nicht durch behauptete KayKit-Kompatibilität ersetzt.

### Asset Librarian

Permanent URL: `https://kayfabizarro.pages.dev/asset-librarian/`.

Postmortem: `tools/asset_registry/librarian/POSTMORTEM_CHAT_BREAK_2026-09-15.md`.

Vor diesem Dokumentationscommit lag Main bei `3f6e8dcc5d00ff642488f7e5e1c76cd6ad052f84`: v1.7 Browse/Filter-Pass gemergt; Browser-Smoke Run `34919321337` SUCCESS. Town Workbench v1.6 und On-character KayKit Motion Preview sind Teil der grünen Regression. Dokumentation/Manifest/Return hinken hinter v1.7 her und müssen vor neuer breiter Featurearbeit versöhnt werden.

### ToolBox

Input-Paket: `tools/KFB-ToolBox/_inbox/KFB FrankenStein ToolBox (WS0).zip`.

Weiterhin zwei getrennte Ergebnisse: A = vollständiger kaltstartfähiger Quellstand und echtes Delta; B = ein gemeinsamer workfloworientierter UI-Pilot auf denselben Modulen. ToolBox-/Town-Ideen nicht als Zusatzscope in A hineinziehen.

### Travel / Town Terrain

Implementation SSOT bleibt `georg-doc/KFB-Travel-Globe`. Town liefert Gestaltung/Candidates, Travel besitzt Welt/Terrain/Sky/Movement. Für die geplante Startzone bestehende Travel-/TinySkies-Küsten-, Boden-, Sky-, Day/Night-, Aurora-/Wetter-Bausteine zuerst wiederverwenden. Kein zweiter Terrain-/Sky-Owner.

Erster Terrain-Showcase darf Plateau, Königshügel, gemeinsame Bühne, Siedlungsfläche, Fluss/Mündung und sichtbare Pirateninsel vorsehen; konkrete Geometrie folgt erst nach aktuellem Town-Candidate-Handoff und Travel-Quellenprüfung.

## Recovery-Satz für einen frischen Lead-Chat

> Lies `skills/chat/RECOVERY_PATH.md`, dann `skills/chat/recovery/CURRENT_LEAD_CHECKPOINT_2026-09-15.md`. Verifiziere den aktuellen `georg-doc/kayfabizarro`-Main-HEAD und die jeweils genannten Projekt-SSOTs. Für Town danach `skills/chat/town/START_HERE.md` + Session Card + §§12–13. Für Asset Librarian den Postmortem lesen. Keine bereits gemergten v1.6/v1.7-Funktionen neu bauen und keine Owner still ersetzen.
