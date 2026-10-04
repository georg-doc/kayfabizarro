# Claude Design · vollständiger Atlas-Export

**Datum:** 2026-09-17  
**Status:** EXPORTAUFTRAG / INTAKE-CONTRACT; kein Nachweis eines bereits gelieferten Exports.  
**Gilt getrennt für:** `KFB_Resident_Atlas_S6` und `KFB_World_Atlas_v1` (`KayKit Atlas Preflight Access`).

## Auftrag zum Einfügen in beide Claude-Design-Projekte

Sichere den tatsächlich aktuellen Projektstand als vollständiges, außerhalb von Claude lauffähiges und weiterbearbeitbares Übergabepaket. Kein Redesign, kein vereinfachter Nachbau, keine neue Architektur und kein Screenshot-Ersatz für Code. Bewahre sämtliche vorhandenen Funktionen, Szenen, Presets und Kalibrierungen. Nicht fertige Funktionen bleiben ausdrücklich als solche dokumentiert.

GitHub-Push ist derzeit in dieser Design-Umgebung laut Georg nicht nutzbar. Ein vollständiger ZIP-Download ist deshalb der verpflichtende Übergabeweg. Behaupte weder einen Push noch eine Veröffentlichung, die nicht tatsächlich stattgefunden haben. Arbeite vorhandene Dateien ab; fordere Georg nicht auf, Quellcode oder Modelle nachzubauen.

### 1. Ein Paket je Projekt

Liefere:

- `KFB_Resident_Atlas_S6_EXPORT_2026-09-17.zip`
- beziehungsweise `KFB_World_Atlas_v1_EXPORT_2026-09-17.zip`.

Verwende bei einem späteren Export dessen tatsächliches Datum und eine zusätzliche Revision, ohne ältere Exporte zu überschreiben. Beide Pakete müssen unabhängig startbar und prüfbar sein. Exportiere auch den nativen/originalen Design-Projektstand, soweit die Umgebung das unterstützt. Kennzeichne nicht verfügbare native Exportformate ehrlich.

Der ZIP enthält funktional diese Bereiche; bestehende, funktionierende Projektstrukturen müssen dafür nicht umgebaut werden:

```text
<project>/
  README.md
  START_HERE.md
  SOURCE_SNAPSHOT.md
  CHANGELOG.md
  EXPORT_MANIFEST.json
  CHECKSUMS.sha256
  source/                 vollständige editierbare Codebasis, oder bestehender Projektroot
  dist/                   tatsächlich erzeugter Browser-Build, nicht statt source/
  data/                   Kataloge, Szenen, Presets, Rezepte, Seeds, Einstellungen
  assets/                 tatsächlich benötigte lokale Abhängigkeiten
  vendor/                 lokale, versionierte Laufzeitbibliotheken, falls verwendet
  licenses/               unveränderte relevante Lizenz-/Attributionsdateien
  docs/
    ARCHITECTURE.md
    ASSET_MANIFEST.json
    RECIPE_MAPPING_A0.md
    DEPLOYMENT.md
    TEST_REPORT.md
    KNOWN_ISSUES.md
    RECOVERY.md
    FEATURE_PARITY.md
    DECISIONS.md
  evidence/               echte Screenshots und tatsächlich erzeugte Test-/Build-Logs
```

Bereiche dürfen in bestehenden Ordnern liegen, sofern `EXPORT_MANIFEST.json` sie eindeutig zuordnet. Eine Single-HTML-Anwendung darf Single-HTML bleiben. Bei Build-Projekten gehören alle Module, Styles, Worker, Shader, Konfigurationen, `package.json`, Lockfile, exakte Runtime-/Package-Manager-Version und Build-Skripte dazu. `node_modules`, Caches, Zugangsdaten und Tokens gehören nicht ins Paket. Versionsnummern oder Testergebnisse nicht erfinden.

### 2. Vollständigkeit des Codes und Zustands

Exportiere nicht nur den sichtbaren Einstiegspunkt. Einschließen: alle importierten Module, Loader, Adapter, Komponenten, Generatoren, Hilfsfunktionen, Materialien, Shader, Styles, Fonts/Icons, registrierten Szenen und verfügbaren Auswahloptionen. Falls eine Abhängigkeit nicht mitgeliefert werden darf, benenne sie und den belegten Bezugsweg; behaupte dann keinen vollständigen Offline-Export.

In React/Vite/ähnlichen Projekten sind Komponentenquellen UND der erzeugte Build erforderlich. In einer reinen HTML/JS-Site ist die tatsächlich funktionierende HTML/JS/CSS-Codebasis ausreichend; keinen Build-Prozess nur für diese Checkliste einführen.

Sichere im Browser gehaltenen Zustand ausdrücklich: `localStorage`, IndexedDB oder Speicherzustand müssen als JSON exportierbar beziehungsweise im Paket reproduzierbar enthalten sein. Aktuelle Szene, Szenenauswahl, Materialeinstellungen, Kamera-Presets, Transformwerte, Seeds und Generatorparameter dürfen nicht ausschließlich in der Claude-Sitzung verbleiben.

Entferne Claude-spezifische Startabhängigkeiten. Kein erforderliches `window.claude`, keine Artifact-Bridge, kein Zugriff auf einen Chat oder private Sitzung zum Start. Temporäre `blob:`-/Sandbox-/signierte Download-URLs sind keine dauerhaften Assets. Falls eine Bridge-Funktion nicht portierbar ist, vorhandenen Originalcode bewahren und die betroffene Funktion als `REIMPLEMENTATION_REQUIRED` oder `BLOCKED` dokumentieren, nicht still entfernen.

### 3. Assets: echte Dateien und belegte Identität

Für jedes tatsächlich verwendete Modell und jede abhängige Datei müssen reale Bytes verfügbar sein: GLB oder GLTF inklusive BIN und Texturen; vorhandene FBX-/Blend-/Originaldateien als Quellen erhalten; ebenso verwendete Animationen, Audio, Icons, Vorschaubilder, HDR-Dateien und Decoder. Keine Ersatzgeometrie, kein Neu-Modellieren anhand eines Screenshots, kein heimliches Umdeuten eines anderen KayKit-Props.

`ASSET_MANIFEST.json` enthält mindestens:

```text
assetId, displayName, sourceRepo, sourcePath, sourceRevision,
sourceBlobSha (falls verfügbar), packagePath, runtimePath,
sha256, byteSize, dependencies[], licenseEvidence,
relationship, evidenceStatus, availability
```

Nicht verfügbare Herkunfts-/Hashwerte bleiben `null` mit Erklärung. Namen sind keine Identitätsbelege. Dieselbe Datei darf in mehreren Szenen referenziert werden; nicht für jede Szene neu duplizieren. Originaldateien nicht für Farbkorrektur, Achsendrehung oder Maßstab verändern. Solche Änderungen sind explizite Instanz-/Variantenwerte.

Zentrale Asset-Quelle und Veröffentlichungsziel für geeignete Originaldateien ist `georg-doc/kayfabizarro/media/3D_Assets/`. Bereits dort vorhandene Dateien nicht erneut erfinden oder durch Namensähnlichkeiten ersetzen: exakt auf Repo/Pfad/Revision abgleichen. Das portable ZIP enthält die zur unabhängigen Ausführung benötigten Dateien; die spätere Repo-Integration kann diese wieder auf den zentralen Bestand abbilden. Git-LFS-Zeiger zählen nicht als ausgelieferte Modelldateien.

Bestehende Freigabe-/Lizenzregeln pro Pack beibehalten; aus bloßem Besitz oder einem Dateinamen keine pauschale Freigabe zur öffentlichen Rohdatenverteilung ableiten. Unklare/restringierte Dateien separat benennen, nicht ungeprüft auf den öffentlichen Mirror laden. Die Site muss fehlende Assets sichtbar melden statt durch Platzhalter scheinbar vollständig zu wirken.

### 4. Projektspezifische Deliverables

#### KFB_Resident_Atlas_S6

Liefere den vollständigen aktuellen Szenenkatalog und pro Bewohner das vorhandene Ensemble als editierbare Daten: exakte Figur, kleine Habitat-Basis, Landmarke sowie bis zu sechs Signature-Props gemäß bisherigem Atlas-Auftrag. Bewahre zusätzliche bereits vorhandene Varianten; kürze nicht rückwirkend den Bestand.

Erforderlich sind die tatsächlichen relativen Transforms mit Parent-Bezug, Einheiten, Forward-/Up-Konvention, Ursprung, Rotation und Maßstab; vorhandene Kontakt-/Bodenpunkte, Bounding-Box-Messungen und benannte Hand-/Prop-/Sitz-Slots; Material-/Tint-Overrides; sichtbare beziehungsweise ausgeblendete Teile. Werte aus dem laufenden Projekt exportieren, nicht später nach Augenmaß rekonstruieren.

Rig, Animationsquellen, Clip-Namen und bereits durchgeführte Prüfungen getrennt dokumentieren. Eine geladene Figur oder ein ähnlich benannter Clip beweist keine Animationskompatibilität. Animation/Movement Lab behält diese Zuständigkeit.

Georgs Beispiele Kleriker mit Weihbrunnen und Lawkeeper mit Schriftrollenstand sind gewünschte Ensembles, keine Behauptung, dass sie schon existieren. Der zentrale A0-Pilot heißt derzeit `Lorekeeper + lectern + staff`. `Lawkeeper` und `Lorekeeper` nicht still gleichsetzen, umbenennen oder gegeneinander austauschen; tatsächliche Asset-IDs und offene Benennung dokumentieren.

#### KFB_World_Atlas_v1 · KayKit Atlas Preflight Access

Liefere sämtliche aktuell vorhandenen Terrain-/Landmark-/Prop-Kombinationen und Pfad-Presets, inklusive Burg/Schloss/Mine, soweit implementiert. Hexagon-Basis, Gebäude, Props und Pfade müssen in den Daten unterscheidbar bleiben. Vorhandene Grammatik, Adjazenzregeln, Anschlüsse, Breiten, Höhen, Rotationen und Seeds vollständig exportieren.

Die spätere Travel-Darstellung ist bewusst noch offen:

1. sichtbare Hexagon-Basis auf dem Terrain;
2. in das Gelände eingesetzte/eingepasste Basis;
3. keine sichtbare Basis, nur Gebäude/Props/Pfade.

Dafür vorhandene Teile und Offsets exportieren. Noch nicht implementierte Varianten als `PROPOSAL` markieren; nicht während des Exports neu bauen. Material/Tint dient einer reversiblen farblichen Einbindung, nicht der Veränderung der Originalassets. Sichtbares Einsenken ist kein Beleg für echte Terrainbearbeitung oder korrekte Laufoberflächen.

Den aktuellen Dungeon-Generator vollständig als eigenen vorhandenen Modulstand mitliefern: Algorithmus, exakte Generatorversion, Seeds, Parametersätze, Modulbibliothek, real erzeugte Layouts, Tür-/Portalanschlüsse und vorhandene Validierungsregeln. GPU-Instancing und eine separate Gameplay-Instanz sind unterschiedliche Dinge; den tatsächlich gemeinten Modus benennen. Begehbare Innenräume, Wandkollision, Stockwerke und Einbau ins Travel-Gelände nur dann als implementiert ausweisen, wenn es dafür Code und konkrete Tests gibt. Die Travel-Integration bleibt nachgelagert.

### 5. A0 nutzen, keine neue Runtime erfinden

Vor dem Mapping lesen:

`georg-doc/kayfabizarro/skills/chat/masterplan/KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md`

Vorhandene Atlas-Daten erhalten. In `RECIPE_MAPPING_A0.md` auf die fünf bestehenden Konzepte abbilden: `AssetRef`, `TransformSlot`, `Surface`, `Connector`, `RecipeEnvelope`. Fehlt eine belegte Semantik, benenne die Lücke; erfinde keine Pflichtfelder und ändere nicht den zentralen Contract. Für generierte Geometrie keine fiktiven Quell-Assets anlegen.

Atlas/ToolBox besitzen Komposition, Messung und Kandidatenrezepte. Registry/Librarian besitzen Quelle/Provenienz. Travel besitzt seine Welt, Platzierung, Kontaktinterpretation, Persistenz und Runtime. Race und Combat behalten ihre eigenen Implementierungszuständigkeiten. Ein Atlas darf eine eigenständig nutzbare Preview-Site sein; sein Preview-Renderer wird deshalb nicht zum zweiten Travel-Renderer.

L0–L4 bleiben Quellen-/Autorenreife. L5 wird nur für den tatsächlich getesteten Consumer und die konkrete Revision vergeben. Export, statischer Build und ein Bild im Atlas sind keine Travel-Abnahme.

### 6. GitHub- und Cloudflare-Portierung

Resident Atlas existiert bereits unter `tools/resident_atlas/` mit Route `/resident-atlas/`. Diesen Bestand nicht überschreiben. S6 zuerst als unveränderter Intake unter `tools/resident_atlas/_inbox/KFB_Resident_Atlas_S6/<export-revision>/` ablegen. Erst nach Paritätsprüfung gezielt in die bestehende Site übernehmen.

Für World Atlas ist `tools/world_atlas/` mit späterer Route `/world-atlas/` der Integrationsvorschlag, keine bereits veröffentlichte Site. Vor Anlage aktuellen Repo-Stand prüfen. Intake unter `tools/world_atlas/_inbox/KFB_World_Atlas_v1/<export-revision>/`. Bestehende ToolBox unter `tools/KFB-ToolBox/` separat erhalten. Keine zusätzliche Top-Level-Repo-Landschaft nur für diesen Export erzeugen.

`DEPLOYMENT.md` nennt überprüfbar Einstiegspunkt, Install-/Start-/Build-Befehl, Build-Ausgabe, Base-Path, Asset-Basis, nötige Redirects/Headers und echte externe Abhängigkeiten. Bestehende Build-/Cloudflare-Konfiguration nicht pauschal ersetzen. Deep-Link, Reload und Asset-Laden müssen unter dem tatsächlichen Unterpfad funktionieren. Runtime-Code darf keine privaten GitHub-Tokens verlangen.

Trenne vollständiges Quellarchiv und schlanken Web-Deploy: keine Pack-ZIPs, Design-Quellen oder ungenutzten Modelle nur deshalb deployen, weil sie im Repo gesichert sind. Prüfe das tatsächliche Asset-/Dateibudget. Cloudflare Pages erlaubt laut am 2026-09-17 gelesener Dokumentation maximal 25 MiB je Site-Asset; größere Originale bewahren und als explizite Deployment-Aufgabe behandeln, nicht still weglassen.

### 7. Dokumentation und Tests

`SOURCE_SNAPSHOT.md`: Projektname, Originalversion, tatsächlicher Exportzeitpunkt, vorhandene Ausgangsrevision und enthaltene Featureliste. Unbekannte Git-SHAs als unbekannt ausweisen.

`FEATURE_PARITY.md`: pro ursprünglicher Funktion `PRESERVED`, `REPAIRED_FOR_PORTABILITY`, `REIMPLEMENTATION_REQUIRED`, `BLOCKED` oder `NOT_TESTED`, jeweils mit Quelle und Testnachweis. Kein positives Gesamturteil bei verschwundenen Funktionen.

`TEST_REPORT.md`: konkret ausgeführter Befehl, Umgebung/Browser, getestete Revision, Datum, Ergebnis und Log/Screenshot. Prüfen: sauberer Start aus entpacktem Paket über HTTP; Asset-Laden mit Soll-/Ist-Zahl und Fehlpfaden; Szenenwechsel; Reset; Transform-/Preset-Erhalt; Export→Import→Reload; Generator-Reproduzierbarkeit; Desktop- und mobile Bedienung soweit ausführbar; Unterpfad/Deep-Link; fehlende Modellabhängigkeiten. Netzwerk-/Konsolenfehler erfassen. Ein nicht ausgeführter Test heißt `NOT_RUN`, nicht PASS.

`RECOVERY.md`: exakter Startpunkt für einen neuen Chat/Entwickler, relevante Dateien, offene Fehler, nächste konkrete Arbeit, Owner-Grenzen und Rollback auf den Originalexport. `CHANGELOG.md` und `DECISIONS.md` additiv führen. Alte Entscheidungen und Ablehnungen nicht wegschreiben.

`EXPORT_MANIFEST.json` inventarisiert die Paketbestandteile und ihren Status. `CHECKSUMS.sha256` erfasst sämtliche Payload-Dateien einschließlich Manifest, aber nicht sich selbst. Prüfsummen tatsächlich berechnen. Keine falsche Selbst-Hash-Schleife.

### 8. Abschlussantwort von Claude Design

Liefere den real herunterladbaren ZIP und separat die wichtigsten Markdown-/JSON-Dateien. Nenne Projekt/Exportrevision, vorhandene Funktionen, Zahl der tatsächlich enthaltenen Assets, Paketvollständigkeit, ausgeführte Tests, offene Blocker und den ersten Startbefehl. Stelle danach getrennt dar:

`PROPOSAL | DECISION | IMPLEMENTATION | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | ARCHIVED HISTORY`

Wenn kein Push möglich war: `GITHUB PUSH: NOT PERFORMED`. Wenn kein Deploy möglich war: `PUBLIC DEPLOYMENT: NOT PERFORMED`. Ein Paket ist erst `PORTABLE_EXPORT_COMPLETE`, wenn Code, Daten und benötigte Abhängigkeiten tatsächlich enthalten und die Start-/Asset-Tests durchgeführt sind. Sonst `EXPORT_PARTIAL` mit präziser Fehlteileliste. Bewahre und liefere trotzdem alle tatsächlich verfügbaren Dateien.

## Quellen des Exportauftrags

- Bestehender Resident Atlas: https://github.com/georg-doc/kayfabizarro/blob/main/tools/resident_atlas/README.md
- Gemeinsamer A0-Draft: https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/masterplan/KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md
- Travel Atlas-Pipeline: https://github.com/georg-doc/KFB-Travel-Globe/blob/main/_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/BROWSER_FINDINGS_MOVEMENT_ATLAS_PIPELINE_2026-09-17.md
- Cloudflare Pages Limits, abgerufen 2026-09-17: https://developers.cloudflare.com/pages/platform/limits/
- Git-LFS-Hinweis: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage

## Additive History

2026-09-17 · Erster Exportauftrag aus dem Web-Lead-Recovery. Die beiden Claude-Projekte wurden in diesem Arbeitsschritt nicht als vollständige Code-/Asset-Exporte eingelesen. Dieser Auftrag ist keine Aussage über deren bereits erreichte Feature-Parität oder Browserabnahme.
