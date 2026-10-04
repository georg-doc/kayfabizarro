# KFB ToolBox Stage-First v1 · Complete Export Briefing

**Date:** 2026-09-17  
**Status:** EXPORT BRIEFING / INTAKE CONTRACT · no runtime implementation claimed  
**Target project:** `KFB ToolBox Stage-First v1`  
**Repository destination after review:** `georg-doc/kayfabizarro/tools/KFB-ToolBox/`

## 0 · Auftrag

Exportiere den **tatsächlich aktuellen Stand von KFB ToolBox Stage-First v1 vollständig und verlustfrei**, so dass er außerhalb von Claude Design geprüft, auf GitHub integriert und über Cloudflare veröffentlicht werden kann.

Das ist **kein Redesign-Auftrag** und **kein Neuaufbau aus Screenshots oder Dokumentation**.

Bestehende Funktionen, Module, Zustände, Presets, Szenen und WIP-Teile erhalten. Defekte oder unvollständige Funktionen nicht still entfernen oder als fertig deklarieren. Keine neue Architektur nur für den Export einführen.

### No-Terminal-Regel

Georg soll für diese Übergabe **kein Bash, Terminal, npm, git oder lokale Entwicklungsbefehle** ausführen müssen.

Die Abgabe muss deshalb direkt enthalten:

1. **ein herunterladbares vollständiges ZIP**;
2. **einen direkt im Browser nutzbaren Preview-Link**, sofern Claude Design das bereitstellen kann;
3. **den kompletten editierbaren Source-Code**;
4. **einen bereits erzeugten deploybaren Build**, falls das Projekt einen Build-Schritt benötigt;
5. alle Daten-/Manifest-/Recovery-Dateien, damit der Web Lead anschließend die GitHub-/Cloudflare-Integration übernehmen kann.

Wenn intern ein Buildtool oder lokaler HTTP-Server nötig ist, Claude Design führt die notwendigen Schritte selbst aus und dokumentiert sie für Entwickler. Georg wird nicht aufgefordert, Befehle auszuführen.

---

# 1 · Bestehende KFB-Truth, die nicht still ersetzt werden darf

## Getestete ToolBox-Quellbaseline

Aktueller belegter Quellstand:

`georg-doc/kayfabizarro/tools/KFB-ToolBox/_inbox/WS0_2026-09-15/`

Dort ist bereits belegt:

- echter entpackter Source-/Modulbaum vorhanden;
- 7/7 Authoring-Blätter im Browser kalt gestartet;
- Modulschluss geprüft;
- Paket-Prüfsummen geprüft;
- Ordnerstruktur ist Teil der Modulabhängigkeiten.

Der Stage-First-Export ist ein **neuer zu vergleichender/promotender Authoring-Stand**, aber ersetzt diesen getesteten WS0-Pin nicht rückwirkend ohne Paritäts- und Browserprüfung.

## Aktueller Studio-Promotion-Donor

`tools/KFB-ToolBox/_inbox/KFB FrankenStein Studio (7).zip`

Status im aktuellen Recovery-Stand:

`CURRENT STUDIO WIP / PROMOTION DONOR`

Keine semantische Versionsreihenfolge aus Browser-Suffixen wie `(6)` oder `(7)` ableiten.

## Aktuelle Stage-First-Produktrichtung

Persistente Authoring-Domänen:

`Actor · Face · Pose · Motion · Voice · Stage`

Bereits entschiedene Regeln:

- eine persistente Navigationszeile;
- Stage bleibt visuell dominant;
- keine permanenten Developer-/Provenance-Dashboards im normalen Authoring;
- keine Erklärungstext-Wände;
- Funktionsfülle über kontextuelle Progressive Disclosure, nicht durch Entfernen;
- Asset Librarian bleibt eigenständiges Exploration Tool;
- Stage-First konsumiert Assets über einen gemeinsamen kontextabhängigen Resource Picker / Library Drawer;
- keine zweite Asset Registry;
- Registry/Librarian entdeckt Kandidaten, empfangende ToolBox-/Rigging-/Animation-Module entscheiden Eignung und Kompatibilität.

Nicht zum verworfenen mehrzeiligen Dashboard-Design zurückkehren.

---

# 2 · Verpflichtende Abgabe

Lieferpaket:

`KFB_ToolBox_Stage-First_v1_EXPORT_2026-09-17.zip`

Bei späterem Export tatsächliches Datum plus explizite Revision verwenden; ältere Exporte nicht überschreiben.

Das ZIP enthält funktional mindestens:

```text
KFB_ToolBox_Stage-First_v1/
  README.md
  START_HERE.md
  SOURCE_SNAPSHOT.md
  FEATURE_PARITY.md
  CHANGELOG.md
  DECISIONS.md
  EXPORT_MANIFEST.json
  CHECKSUMS.sha256

  <actual editable source tree>
  <actual data/profile/preset tree>
  <actual deployable build, if applicable>

  docs/
    ARCHITECTURE.md
    MODULE_MAP.md
    ASSET_MANIFEST.json
    CONTRACT_MAPPING.md
    DEPLOYMENT.md
    TEST_REPORT.md
    KNOWN_ISSUES.md
    RECOVERY.md

  evidence/
    screenshots/
    logs/
```

Die echte Projektstruktur darf unverändert bleiben. Keine künstlichen Ordner erzeugen, wenn die Anwendung anders organisiert ist; `EXPORT_MANIFEST.json` mappt dann die realen Pfade.

---

# 3 · Vollständige Codebasis

Der Export ist nur vollständig, wenn die **editierbare Implementierung** enthalten ist.

Je nach realem Projekt einschließen:

- HTML-Einstiege;
- JavaScript-/TypeScript-Module;
- React/Vue/Svelte-Komponenten, falls verwendet;
- CSS/Styles;
- Three.js Renderer-, Stage-, Camera- und Control-Module;
- Shader;
- Worker;
- Loader;
- State Stores;
- Resource Picker / Library Drawer;
- Import-/Export-Serializer;
- Rig-/Animation-Adapter;
- Pose-/IK-Code;
- Voice-/Bubble-Integration;
- Stage-/Scene-/World-Module;
- Licht-/Umgebungssteuerung;
- Hilfsmodule;
- `package.json` und Lockfile, **nur wenn tatsächlich verwendet**;
- Buildkonfiguration, **nur wenn tatsächlich verwendet**.

Kein reiner `dist`-/minifizierter Export, wenn editierbare Sources existieren.

Fehlt ein tatsächlich benutztes Modul, nicht aus Dokumentation neu schreiben. Fehlteil konkret in `SOURCE_GAPS` dokumentieren und Export als `EXPORT_PARTIAL` klassifizieren.

---

# 4 · Funktions-Parität aufnehmen, nicht neu erfinden

`FEATURE_PARITY.md` muss den aktuellen Export gegen den tatsächlich sichtbaren/benutzten Claude-Design-Stand prüfen.

Pro Funktion nur einer dieser Stati:

- `PRESERVED`
- `REPAIRED_FOR_PORTABILITY`
- `REIMPLEMENTATION_REQUIRED`
- `BLOCKED`
- `NOT_TESTED`
- `NOT_PRESENT_IN_SOURCE`

Mindestens erfassen:

## Shell / Stage

- Top bar / Navigation;
- Renderer;
- Stage Camera;
- Views/Presets;
- Resize/Split-Screen;
- Theme;
- Save State;
- optional Diagnostics/Source Info.

## Actor

- Actor Picker und tatsächliche Roster-Quelle;
- Body / Materials;
- Accessories;
- Donor Parts;
- Scale / Root Orientation;
- Measurements / Fit;
- Profile import/export.

Keine harte Reduktion auf einen Demo-Mini-Roster.

## Face

- EyeRig;
- Pupils;
- Lids / Lashes;
- Brows;
- Nose Pool;
- Mouth Pool;
- Viseme / Talk Preview;
- Emotion;
- Secondary Motion, falls vorhanden.

Kaputte Regler bleiben als kaputt dokumentiert; UI-Präsenz ist kein Funktions-PASS.

## Pose

- Root Transform;
- Bone Manipulation;
- IK-/Kontaktziele;
- Hand/Fuß-Ziele;
- Pelvis/Head Adjustments;
- Prop-/Stool-Kontakt;
- Reset;
- Pose Save/Load.

## Motion

- Clip Search/Filter;
- Clip Families;
- Play/Pause/Scrub/Stop/Rest;
- Mixer Ownership;
- Compatibility/Binding Report;
- Performance-Kategorien, soweit real vorhanden;
- Pose-over-Motion nur falls tatsächlich implementiert.

Ein Clip im Picker ist kein Kompatibilitätsbeleg.

## Voice

- Text/Sample;
- Voice Selection;
- Speak/Stop;
- Talk/Viseme;
- Bubbles;
- Audio Adapter/Owner;
- Wechselwirkung mit Pose/Motion.

Audio nur PASS, wenn am Export tatsächlich gehört/geprüft.

## Stage

Nur tatsächlich vorhandene Funktionen erfassen:

- Actors;
- Props;
- World/Stage Assets;
- Place/Transform/Remove/Reset;
- Cameras;
- Lights;
- Environment;
- World/Background Controls;
- Curtain/Core Stage Modules;
- Scene/World Save/Load;
- Event/Interaction References.

Keine historische Birthday-/Terraformer-/Dungeon-Idee während des Exports nachbauen, wenn sie im aktuellen Projekt noch nicht implementiert ist.

---

# 5 · HARD RULE · Assets immer über GitHub, wenn vorhanden

**Wenn ein benötigtes Asset bereits auf GitHub vorhanden ist, ist ausschließlich dieser GitHub-Bestand die Source of Truth.**

Keine zusätzliche Claude-Kopie als neue Quelle anlegen.

Keine temporäre Claude-/Artifact-/Blob-URL als dauerhafte Abhängigkeit verwenden.

Keine vorhandene GitHub-Datei unter neuem Namen duplizieren, nur damit der Export autark wirkt.

Für jedes vorhandene Asset mindestens speichern:

```text
sourceRepo
sourcePath
sourceRevision
sourceBlobSha      # wenn verfügbar
rawSourceUrl       # gepinnt, wenn technisch verwendbar
intendedSitePath   # späterer same-origin GitHub/Cloudflare-Pfad
```

Bevorzugte zentrale Asset-Quelle:

`georg-doc/kayfabizarro/media/3D_Assets/`

Wenn das Asset dort oder an einem anderen verifizierten Pfad in `georg-doc/kayfabizarro` liegt, diesen exakten Pfad verwenden.

Bei Assets aus anderen KFB-Repositories ebenfalls exakten Repo/Pfad/Revision eintragen. Nicht nach Dateiname raten.

### Runtime-Regel

Für den finalen GitHub/Cloudflare-Betrieb sollen Assets möglichst über die GitHub-gepflegte Quelle beziehungsweise den daraus veröffentlichten same-origin Site-Pfad geladen werden.

Claude-Preview darf zur Vorschau einen gepinnten `raw.githubusercontent.com`-Pfad verwenden, wenn technisch nötig und zulässig. Im Manifest bleibt immer die Repo-Identität erhalten.

### Nur wenn ein benötigtes Asset noch NICHT auf GitHub existiert

Dann die echten Bytes im Export separat unter z. B.

`new-assets-for-github-review/`

mitliefern und im Manifest markieren:

`NEW_ASSET_REQUIRES_GITHUB_IMPORT`

Nicht eigenmächtig eine alternative öffentliche Asset-Quelle anlegen. Der Web Lead übernimmt nach Review die GitHub-Einordnung.

### Unzulässig

- `blob:` URLs;
- auslaufende signierte URLs;
- Screenshots statt Modelle/Audio;
- erfundene Primitive statt vorhandener KFB/KayKit-Assets;
- Git-LFS Pointer statt realer Asset-Bytes;
- Asset-Kopien ohne nachvollziehbare GitHub-Provenienz;
- Font-Binaries im Export nur aus Branding-Gründen.

---

# 6 · Asset Manifest

`docs/ASSET_MANIFEST.json` erfasst alle tatsächlich für den Export relevanten Runtime-Assets.

Mindestens:

```text
assetId
name
kind
sourceRepo
sourcePath
sourceRevision
sourceBlobSha
rawSourceUrl
intendedSitePath
runtimePath
includedInExport
packagePath
sha256
byteSize
dependencies[]
licenseEvidence
availability
evidenceStatus
```

Wenn ein Wert unbekannt ist, `null` plus Erklärung. Nichts erfinden.

`includedInExport` soll bei bereits vorhandenen GitHub-Assets standardmäßig `false` sein, sofern der Export nicht aus einem belegten technischen Grund eine lokale Laufzeitkopie benötigt. Eine solche Kopie bleibt dann Cache/Packaging, nicht neue Asset-Quelle, und muss auf den exakten GitHub-Ursprung zurückverweisen.

---

# 7 · Resource Picker / Library Drawer

Den tatsächlichen aktuellen Resource Picker vollständig exportieren und dokumentieren.

Für die real unterstützten Kontexte festhalten, z. B.:

```text
actor
rig-part
motion
prop
stage
performance
```

Dokumentieren:

- Datenquelle;
- GitHub-/Registry-Bezug;
- embedded/fetched/generated/hardcoded;
- Such-/Filterfelder;
- Actor-/Rig-Kontext;
- Preview;
- Accept / Revert;
- Compatibility State;
- Verhalten bei nicht erreichbarer Registry.

Temporäre Mock-Daten bleiben erlaubt, werden aber als `PROTOTYPE DATA` markiert und nicht als Registry-Truth ausgegeben.

Der vollständige Asset Librarian bleibt ein eigenes Tool; nicht in Stage-First hinein duplizieren.

---

# 8 · Zustände, Profile und Presets vollständig sichern

Kein relevanter Projektzustand darf nur in der Claude-Sitzung verbleiben.

Exportieren, soweit vorhanden:

- FrizzleBob-/GothGirl-/Hihi-/Carl-/weitere Actor Profiles;
- Material-/Farbwerte;
- Face-Parameter;
- Pose Presets;
- aktuelle Pose;
- Motion/Clip Selection;
- Voice/Bubble Setup;
- Scene Graph;
- Prop Transforms;
- Cameras;
- Lights;
- Environment/World Settings;
- Favourites/Recents, wenn produktrelevant;
- Scene/World Bundles;
- Generator-/Seed-Daten, falls vorhanden.

Falls Werte in `localStorage`, IndexedDB oder nur im Session Store liegen, deterministischen JSON-Export mitliefern und Restore-Pfad dokumentieren.

`localStorage.clear()` ist verboten.

Roundtrip muss `unknown`, `false`, `0`, leere Werte und `null` korrekt erhalten.

---

# 9 · Contracts / Owner nicht verschieben

## `kfb.pets/1`

Bestehender Actor/Profile Contract. Aktuelle Kompatibilität erhalten; Deltas separat benennen.

## Shared Pet Library

`media/3D_Assets/pet-LIBRARY.json`

Nicht mit Stage-First-WIP-Feldern überschreiben, nur damit ein aktueller Build funktioniert.

## Registry / Librarian

Quelle/Discovery. Keine Eignungsentscheidung für Rig/Motion/Attachment vorwegnehmen.

## Rigging / Animation

Empfangende Module besitzen reale Binding-/Kompatibilitätsprüfung.

## Travel / Combat / Stunt

ToolBox exportiert Kandidaten/Rezepte; diese Projekte behalten Runtime-/Gameplay-Ownership.

## A0 Assembly Contract

Wo sinnvoll, bestehende Actor-/Scene-/World-Daten nur **abbilden** auf:

`AssetRef · TransformSlot · Surface · Connector · RecipeEnvelope`

Interne Formate beim Export nicht unnötig umschreiben. Mapping in `CONTRACT_MAPPING.md` reicht.

---

# 10 · Build / Browser Preview

Claude Design liefert, soweit die Umgebung es zulässt:

1. den tatsächlich aktuellen Browser-Preview-Link;
2. den vollständigen editierbaren Source;
3. den dazu passenden deploybaren Build;
4. die exakte Zuordnung `SOURCE REVISION → BUILD`.

Preview und ZIP müssen denselben Exportstand repräsentieren.

Keine Aussage `DEPLOYED` nur weil eine interne Claude-Vorschau funktioniert.

GitHub-/Cloudflare-Publikation wird später separat durch den Web Lead nach Intake/Review durchgeführt.

---

# 11 · Tests, die Claude Design selbst ausführen soll

`docs/TEST_REPORT.md` dokumentiert echte Tests der konkreten Exportrevision.

Mindestens soweit ausführbar:

### Boot

- Projekt/Build frisch starten;
- Stage sichtbar;
- keine fehlenden kritischen Module.

### Asset loading

- Soll/Ist-Zahl geladener Assets;
- 404/CORS/Decoder-Probleme;
- prüfen, dass vorhandene Assets aus verifizierten GitHub-Quellen stammen.

### Navigation

- Actor → Face → Pose → Motion → Voice → Stage;
- keine zweite permanente Header-Leiste;
- Stage bleibt nutzbar.

### State

- Preset/Actor laden;
- mindestens einen Wert ändern;
- exportieren;
- neu laden/importieren;
- identischer Zustand.

### Resource Picker

- öffnen;
- suchen;
- Preview;
- Accept;
- Revert;
- normaler Stage-Zustand danach intakt.

### Actor / Face

Mindestens ein realer vorhandener Actor mit aktuellem Face-/Material-State.

### Pose

Wenn implementiert: Pose ändern → speichern → reload → gleiche sichtbare Kontakte.

### Motion

Wenn implementiert: mindestens Idle + locomotion + ein weiterer vorhandener Clip; sichtbare Bindings beurteilen.

### Voice

Wenn implementiert und Audio in Claude testbar: Speak/Stop + Talk/Viseme; sonst `NOT_TESTED`.

### Stage

Wenn implementiert: Asset platzieren → transformieren → speichern → reload → identische Position.

### Responsive

- Desktop;
- ungefähr 832 px Split-Screen;
- narrow/mobile nur soweit das aktuelle Produkt es real unterstützt.

### Console / Network

Fehler protokollieren. HTTP 200 allein ist kein PASS.

Nicht ausgeführte Tests heißen `NOT_RUN` oder `NOT_TESTED`, niemals PASS.

---

# 12 · Dokumentationspflicht

## `SOURCE_SNAPSHOT.md`

- Projektname;
- tatsächlicher Exportzeitpunkt;
- Claude-Projektstand/Revision, soweit verfügbar;
- sichtbare aktuelle Features;
- aktiver Actor/Preset/Scene State;
- Source-vs-Build-Zuordnung.

## `ARCHITECTURE.md`

Nur aus realem Code ableiten:

- Stage owner;
- Actor owner;
- Face owner;
- Mixer/Animation owner;
- Voice owner;
- State owner;
- Resource Picker;
- Asset resolver;
- Serializer;
- Build/deploy entry.

## `MODULE_MAP.md`

Jede lokale Modulabhängigkeit und Entry-Datei. Keine vermuteten Module.

## `DEPLOYMENT.md`

Für den Web Lead:

- tatsächlicher Browser entry;
- Build root;
- Base path;
- same-origin asset mapping;
- erforderliche Redirects/Headers;
- GitHub-Asset-Pfade;
- bekannte CORS-/MIME-/Decoder-Anforderungen.

Nicht als Aufforderung an Georg formulieren.

## `RECOVERY.md`

Ein neuer Chat/Entwickler muss sofort wissen:

- welches ZIP die Originalübergabe ist;
- welche Datei zuerst gelesen wird;
- welche Revision geprüft wurde;
- was funktioniert;
- was offen ist;
- welche Owner unverändert bleiben;
- wie auf den unveränderten Export zurückgerollt wird.

---

# 13 · Checksums / Manifest

`EXPORT_MANIFEST.json` inventarisiert alle gelieferten Dateien, Rollen und Stati.

`CHECKSUMS.sha256` enthält echte SHA-256-Hashes aller Payload-Dateien, aber nicht sich selbst.

Keine erfundenen Hashes.

Neue noch nicht auf GitHub vorhandene Binärassets separat identifizieren.

---

# 14 · Intake-Ziel nach Übergabe

Claude Design soll **nicht** den bestehenden ToolBox-Quellbaum überschreiben.

Der Web Lead übernimmt den Export zunächst unverändert nach:

```text
tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_STAGE_FIRST_V1/<export-revision>/
```

Danach:

`Originalexport sichern → Manifest/Hashes prüfen → gegen WS0 baseline vergleichen → Feature-Parität prüfen → browsertesten → gezielte Promotion in ToolBox → GitHub/Cloudflare veröffentlichen`.

Der geprüfte WS0-Quellstand bleibt bis dahin unangetasteter Vergleichspunkt.

---

# 15 · Abschlussantwort von Claude Design

Am Ende bitte **keine Entwickleraufgabe an Georg zurückgeben**.

Liefern:

1. **Download: vollständiges ZIP**
2. **Browser Preview:** direkter Link oder `NOT AVAILABLE`
3. **Exportstatus:** `PORTABLE_EXPORT_COMPLETE` oder `EXPORT_PARTIAL`
4. **Source completeness:** vollständig / fehlende konkrete Dateien
5. **Asset status:**
   - Anzahl GitHub-resolved assets
   - neue noch nicht auf GitHub vorhandene Assets
   - unresolved assets
6. **Feature parity summary**
7. **Tests tatsächlich ausgeführt**
8. **bekannte Blocker**
9. **START_HERE.md separat downloadbar**
10. **EXPORT_MANIFEST.json separat downloadbar**

Danach Status klar trennen:

`PROPOSAL | DECISION | IMPLEMENTATION | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | ARCHIVED HISTORY`

### Wahrheitsregeln

- interne Claude-Vorschau ≠ öffentliche GitHub/Cloudflare-Veröffentlichung;
- erzeugter Build ≠ Browserabnahme;
- sichtbarer Actor ≠ Rig-/Motion-Kompatibilität;
- gespeicherte Config ≠ Consumer-L5;
- Feature im Code ≠ sichtbarer Human PASS;
- Export ≠ Promotion in die bestehende ToolBox.

Wenn GitHub-Push aus Claude nicht möglich ist:

`GITHUB PUSH: NOT PERFORMED — expected; Web Lead will integrate the export.`

Wenn keine öffentliche Site erzeugt wurde:

`PUBLIC DEPLOYMENT: NOT PERFORMED`.

---

# 16 · Quellen / aktuelle Repo-Pins

Vor dem Export relevant:

- `tools/KFB-ToolBox/AGENTS.md`
- `tools/KFB-ToolBox/START_HERE.md`
- `tools/KFB-ToolBox/MASTERPLAN.md`
- `tools/KFB-ToolBox/TOOLBOX_MANIFEST.json`
- `tools/KFB-ToolBox/_inbox/WS0_2026-09-15/START_HERE.md`
- `tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/START_HERE.md`
- `tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/ASSET_LIBRARIAN_INTEGRATION_2026-09-15.md`
- `skills/chat/recovery/CRISIS_CHECKPOINT_2026-09-16.md`
- `skills/chat/recovery/CURRENT_PRIORITY_BOARD_2026-09-16.md`
- `skills/chat/masterplan/KFB_ASSEMBLY_CONTRACT_A0_2026-09-17.md`

## Additive History

2026-09-17 · Exportbrief für `KFB ToolBox Stage-First v1` angelegt. Er erweitert die bestehende ToolBox-Recovery um einen vollständigen No-Terminal-Handoff und die harte Regel, vorhandene Assets immer über ihre verifizierte GitHub-Quelle zu referenzieren. Keine ToolBox-Runtime wurde durch dieses Dokument verändert; keine neue Browserabnahme wurde behauptet.
