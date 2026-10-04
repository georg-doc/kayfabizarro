---
name: "session-zip"
description: >
  Vollständiger, recovery-tauglicher Claude-Design Session Cut + ZIP. Funktioniert sowohl als
  registrierter Shortcut `/session-zip` als auch manuell: Wenn diese Datei bzw. ihr Inhalt in
  Claude Design eingefügt und ein Export verlangt wird, ist das selbst der Trigger und die
  ausdrückliche Exportfreigabe. Kein zweites Bestätigungsfenster.
version: "1.1"
status: "CURRENT_REFERENCE"
---

# KFB `/session-zip` · vollständiger Claude Design Session Cut + ZIP v1.1

## WICHTIG · kein Shortcut nötig

Dieser Skill ist **vollständig selbständig**.

Falls `/session-zip` in Claude Design nicht als Shortcut registriert oder nicht sichtbar ist:

- diese Datei vollständig in den Design-Chat einfügen oder verlinken und ihren Inhalt lesen lassen;
- ein Auftrag wie **„führe session_ZIP_v1 jetzt aus“**, **„Session Cut ZIP“**, **„vollständiger Session Export“** oder das Einfügen dieser Datei zusammen mit einem Exportwunsch gilt als Trigger;
- dann die folgenden Regeln direkt ausführen;
- **nicht** versuchen, zuerst einen nicht verfügbaren Claude-Project-Skill zu laden;
- **nicht** noch einmal nach Bestätigung fragen.

Der Aufruf ist bereits die Exportfreigabe. Löschen, Verschieben oder irreversible Bereinigung bleibt trotzdem bestätigungspflichtig.

---

## 1 · Zweck

Erzeuge einen vollständigen, recovery-tauglichen Snapshot des **tatsächlich aktuellen Claude-Design-Arbeitsstands**, damit ein neuer Chat, ChatGPT Web/GitHub Bridge oder anderer Executor ohne Rekonstruktion des Gesprächs weiterarbeiten kann.

Der Export ist **nicht** nur das Session-Delta. Er enthält die geschlossene aktuelle Code-/Datenbasis des Kandidaten, soweit sie für Replay und Weiterarbeit benötigt wird.

Er ersetzt nicht den schlanken `skills/session-export_v1.md`, der nur Session-Deltas exportiert.

Nach zwei fehlgeschlagenen Reparaturpässen am selben Gate gilt zusätzlich die Failure-Recovery-Regel unten.

---

## 2 · Snapshot-Regel

Exportiere den aktuellen Kandidaten **so wie er jetzt ist**.

Vor dem Export kein:

- Redesign;
- Cleanup-Refactor;
- „noch schnell schöner machen“;
- Ersatz fehlender Donoren;
- Architektur-Umbau;
- neuer Runtime-Owner;
- stilles Entfernen gescheiterter, aber relevanter Pfade;
- Fix nur damit der Export sauberer aussieht.

Workspace/aktueller Design-State ist die Wahrheit. Unklarheiten werden dokumentiert, nicht wegretuschiert.

---

## 3 · Voice-Input- und Namensregel

Georg verwendet häufig Voice Input. Eigennamen, Pfade, Ortsnamen, Versionen und technische Begriffe können falsch transkribiert sein.

Deshalb:

- tatsächliche Datei-/Asset-/Repo-/Branch-/Actor-/Modulnamen aus Workspace, Source oder GitHub auflösen;
- keine ähnlich klingende Quelle still substituieren;
- keine Orts-/Assetnamen aus Lautschrift erfinden;
- ungelöste Begriffe als `VOICE_INPUT_UNCERTAIN` dokumentieren;
- tatsächlich verwendeten Source-Pfad/Pin daneben nennen;
- fehlende Quelle als `SOURCE_REQUIRED` markieren.

Beispiel:

`VOICE_INPUT_UNCERTAIN: "Transformer Max" — exact source family not pinned; no substitute used.`

---

## 4 · Exportumfang · geschlossene aktuelle Candidate-Basis

Vom tatsächlichen Entry Point aus Closure bilden und alles aufnehmen, was lokal zum aktuellen Kandidaten gehört:

- Entry-HTML / App-Einstieg;
- importierte lokale JS/TS/CSS/Shader/Module;
- lokale Configs, JSON, Recipes, Contracts, Registries;
- kleine notwendige lokale Assets;
- aktive Dokumentation;
- aktuelle Save-/Profile-/State-Dateien soweit exportierbar;
- relevante Evidence.

Nicht automatisch aufnehmen:

- superseded historische Versionen;
- komplettes Projektarchiv;
- `node_modules`;
- Browser-Caches;
- unrelated Inbox-/Download-Verzeichnisse;
- bereits sauber gepinnte schwere Remote-Assets;
- private Tokens, Cookies, Secrets oder signierte URLs.

Eine Datei darf nicht fehlen, nur weil sie in dieser Session nicht geändert wurde, wenn der aktuelle Candidate sie zum Start braucht.

---

## 5 · Größenregel

**Keine einzelne Datei > 2 MB im ZIP.**

Schwere GLBs, PDFs, Texturen, Skydomes, Audio-/Video-Dateien usw. werden bevorzugt als gepinnte externe Source-Referenz dokumentiert.

Wenn eine notwendige lokale Datei > 2 MB noch nicht gepinnt ist:

- nicht still weglassen;
- Originalpfad, Größe, SHA-256 und Rolle in `external/NOT_EXPORTED.md` festhalten;
- Status `LOCAL_NOT_EXPORTED` setzen;
- falls der Candidate ohne sie nicht replaybar ist zusätzlich `REPLAY_DEPENDENCY_MISSING` setzen.

Keine scheinbar „lauffähige“ ZIP behaupten, wenn eine solche Abhängigkeit fehlt.

---

## 6 · Pflichtstruktur

Bestehende funktionierende Ordnerstruktur erhalten; nichts umsortieren, wenn dadurch Pfade brechen.

Mindestens müssen im ZIP vorhanden sein oder von den Root-Dokumenten eindeutig auf ihre reale Lage gemappt werden:

- `START_HERE.md`
- `RETURN.md`
- `HANDOVER.md`
- `CURRENT_STATE.md`
- `CHANGELOG.md`
- `HOUSEKEEPING.md`
- `SOURCE.json`
- `EXPORT_MANIFEST.json`
- `TEST_REPORT.md`
- `CHECKSUMS.sha256`
- `NEXT_CHAT.md`
- `zipcheck.py`
- `code/` bzw. aktuelle Source-Struktur
- `data/` soweit relevant
- `docs/` soweit relevant
- `evidence/`
- `external/ASSET_REFS.md`
- `external/NOT_EXPORTED.md`

Empfohlener Root-Name:

`<PROJECT>_CLAUDE_DESIGN_SESSION_CUT_<YYYY-MM-DD>_r<N>/`

---

## 7 · START_HERE.md

Kurz und operational:

1. Projekt / Slice / Datum.
2. Status: z. B. `CANDIDATE`, `WIP`, `PROCEED_PASS`, `HUMAN_PASS`, `TUNE`, `REJECTED`.
3. Tatsächlicher Entry Point.
4. Wie der Candidate geöffnet/gestartet wird.
5. Welche Dateien zuerst gelesen werden.
6. Aktueller Owner / Receiving Owner.
7. Was dieser Export ausdrücklich **nicht** besitzt oder ersetzt.
8. Genau ein Next Gate.

---

## 8 · HANDOVER.md · wichtigste Datei

Pflichtabschnitte:

### A · User intent
Was wollte Georg produktseitig wirklich erreichen?

### B · Current result
Was existiert jetzt sichtbar/funktional?

### C · What changed this session
Nur tatsächliche Änderungen.

### D · Source / owners / donors
Für wichtige Quellen: Name, Rolle, Repo/Pfad, Branch/Commit/Pin, `USED` / `DONOR_ONLY` / `NOT_USED`.

Ein geladenes Asset beweist nicht, dass sein Design tatsächlich benutzt wurde.

### E · Protected boundaries
Was darf der nächste Chat nicht neu bauen/übernehmen? Beispielsweise Movement, Camera, Terrain Truth, Actor/Face/Eye/Mouth, Motion Library, OSM Geography, Race Physics, Persistence.

### F · Current controls / workflow
Tabs, Hotkeys, Modes, Save/Reload, besondere Bedienung.

### G · Working / tested
Nur tatsächlich beobachtete oder ausgeführte Resultate.

### H · Open / tune / blocked
Verwende: `OPEN` · `TUNE` · `BLOCKED` · `SOURCE_REQUIRED` · `VOICE_INPUT_UNCERTAIN` · `DEFERRED`.

### I · Rejected / superseded directions
Damit der nächste Chat denselben Fehler nicht wiederholt.

### J · Next gate
Genau ein nächster Gate.

---

## 9 · CURRENT_STATE.md

Dokumentiere den aktuellen Arbeitszustand:

- sichtbare Szene / Modus;
- aktuelle Auswahl;
- aktive Tabs/Tools;
- gespeicherte Parameter;
- Browser-/localStorage-/Session-Schlüssel soweit relevant;
- Recipe/Seed/Preset;
- Werte, die nur im RAM liegen;
- ungespeicherte Änderungen.

Wenn Runtime-State nicht serialisierbar ist: `RUNTIME_STATE_NOT_SERIALIZED` plus relevante Werte.

---

## 10 · CHANGELOG.md

Das tatsächlich aktive Changelog mitnehmen und **append-only** fortführen.

- alte Einträge nicht umschreiben;
- neue Session-Deltas mit Datum/Version;
- User-Entscheidungen markieren;
- rejected/superseded Zustände sichtbar lassen;
- bei mehreren Changelogs das aktive Root-Changelog bestimmen und die Auswahl im Manifest erklären.

---

## 11 · HOUSEKEEPING.md

Mindestens diese Stati verwenden:

`AKTIV` · `SHARED` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET` · `CANDIDATE`

Für relevante Artefakte dokumentieren:

- Rolle;
- aktueller Importer/Nutzer;
- Source Owner oder Exportkopie;
- shared ja/nein;
- Cleanup-Kandidat ja/nein.

Nichts löschen.

---

## 12 · SOURCE.json

Maschinenlesbare Source-/Owner-Wahrheit, Schema:

`kfb.claude-design-session-cut/1`

Mindestens:

- project
- slice
- exportedAt
- status
- entrypoints[]
- owner { name, repo, branch, head }
- sources[]
- donors[]
- contracts[]
- assetRefs[]
- runtimeOwners[]
- protectedBoundaries[]
- voiceInputUncertain[]
- missing[]
- nextGate

Unbekannt = `null` oder explizit `missing`. Nicht raten.

---

## 13 · Asset-/Dependency-Inventar

Jeden verwendeten Asset-/Dependency-Pfad klassifizieren als:

- `EXPORTED` / `LOCAL_INCLUDED`
- `PINNED_REMOTE`
- `UNPINNED_REMOTE`
- `CDN_EXTERNAL`
- `LOCAL_NOT_EXPORTED`
- `REPLAY_DEPENDENCY_MISSING`
- `RELATIVE_PATH_RISK`
- `MISSING`

Bevorzugt gepinnte GitHub/raw/jsDelivr Revisionen.

`raw@main` oder andere bewegliche Quellen ausdrücklich als `UNPINNED_REMOTE` markieren.

Relative `./assets/...`-Pfade nur akzeptieren, wenn die referenzierte Datei wirklich im ZIP liegt.

---

## 14 · Secret-Scan

Vor Staging/ZIP nach offensichtlichen Secrets suchen:

- Tokens/API keys;
- Cookies;
- private signierte URLs;
- Credentials;
- lokale persönliche Pfade, wenn sie nicht für Recovery nötig sind.

Keine Secrets exportieren. Entfernen/Maskieren dokumentieren, ohne den Candidate-Code heimlich funktional umzubauen.

---

## 15 · EXPORT_MANIFEST.json

Für jede exportierte Datei soweit möglich:

- exportPath
- role
- size
- sha256
- status
- origin
- changedThisSession
- requiredToStart

Zusätzlich:

- entryPoints
- fileCount
- totalZipSize
- externalDependencies
- notExported
- missing
- evidence
- sourceRevision

Manifest **vor** Checksums finalisieren.

---

## 16 · TEST_REPORT.md

Keine erfundenen Tests.

Trenne:

### Static / source
z. B. JSON parse, Importpfade, Manifest/Closure.

### Runtime / browser
nur tatsächlich ausgeführt.

### Visual / human
nur tatsächliche Georg-Rückmeldung.

### Not tested
explizit aufführen.

Regeln:

- Source Load ≠ Visual PASS.
- Screenshot ≠ Gameplay PASS.
- Claude-Preview ≠ Integration PASS.
- Exporterstellung ≠ Candidate PASS.
- Nicht gelaufen = `NOT_RUN`, nicht PASS.

---

## 17 · Evidence

Nur relevante aktuelle Evidence aufnehmen, typischerweise:

- 1–5 Screenshots;
- Logs;
- Messberichte;
- Browser-/Preview-Report;
- Donor-/Source-Vergleich.

Keine ungefilterten Bildhalden.

---

## 18 · NEXT_CHAT.md

Paste-ready Cold Start für den nächsten Chat:

1. `START_HERE.md` lesen.
2. `HANDOVER.md` lesen.
3. `SOURCE.json` lesen.
4. aktives `CHANGELOG.md` lesen.
5. GitHub-/Owner-Wahrheit schlägt diesen Export, falls neuer.
6. Candidate zuerst reproduzieren.
7. Kein neuer Owner / kein Redesign vor Parity.
8. Nur den einen genannten Next Gate bearbeiten.

Wenn eine aktuelle KFB-Architektur/SSOT existiert, deren Pfad/PR/Head explizit nennen.

---

## 19 · CHECKSUMS.sha256

Nach finalem Manifest für alle exportierten Dateien SHA-256 erzeugen.

`CHECKSUMS.sha256` selbst darf ausgelassen werden, wenn das Prüfschema dies verlangt; im Manifest dokumentieren.

Keine Checksums aus einer älteren Staging-Version übernehmen.

---

## 20 · `zipcheck.py` · im Export erzeugen und ausführen

Erzeuge im Exportroot folgendes Prüfscript sinngleich. Es prüft Pflichtdateien, >2-MB-Dateien, Manifest-JSON und SHA-256-Dateiformat. Bei projektspezifisch abweichender Struktur darfst du es erweitern, aber nicht lockern, ohne die Abweichung zu dokumentieren.

    #!/usr/bin/env python3
    from pathlib import Path
    import json, sys

    ROOT = Path(__file__).resolve().parent
    REQUIRED = [
        "START_HERE.md", "RETURN.md", "HANDOVER.md", "CURRENT_STATE.md",
        "CHANGELOG.md", "HOUSEKEEPING.md", "SOURCE.json",
        "EXPORT_MANIFEST.json", "TEST_REPORT.md", "CHECKSUMS.sha256",
        "NEXT_CHAT.md",
    ]
    errors = []

    for name in REQUIRED:
        if not (ROOT / name).exists():
            errors.append(f"missing required file: {name}")

    for p in ROOT.rglob("*"):
        if p.is_file() and p.name != "zipcheck.py" and p.stat().st_size > 2 * 1024 * 1024:
            errors.append(f"file >2MB: {p.relative_to(ROOT)} ({p.stat().st_size} bytes)")

    try:
        manifest = json.loads((ROOT / "EXPORT_MANIFEST.json").read_text(encoding="utf-8"))
        if not isinstance(manifest, dict):
            errors.append("EXPORT_MANIFEST.json is not an object")
    except Exception as exc:
        errors.append(f"bad EXPORT_MANIFEST.json: {exc}")

    try:
        source = json.loads((ROOT / "SOURCE.json").read_text(encoding="utf-8"))
        if source.get("schema") != "kfb.claude-design-session-cut/1":
            errors.append("SOURCE.json schema mismatch")
    except Exception as exc:
        errors.append(f"bad SOURCE.json: {exc}")

    if errors:
        print("ZIPCHECK FAIL")
        for e in errors:
            print("-", e)
        sys.exit(1)

    print("ZIPCHECK PASS")

Ausführen:

`python3 zipcheck.py`

Wenn Python in der Umgebung nicht verfügbar ist: `ZIPCHECK_NOT_RUN` mit Grund dokumentieren und dieselben Prüfungen manuell durchführen.

---

## 21 · Clean-Run

Vor finalem ZIP:

1. Staging-Ordner als frischen Kontext behandeln.
2. Entry Point aus dem Staging öffnen/starten, wenn technisch möglich.
3. Lokale Imports auf Existenz prüfen.
4. JSON/Configs parsen.
5. relative Assetpfade gegen Paketinhalt prüfen.
6. Remote-Pins und fehlende Dependencies gegen Manifest prüfen.
7. `zipcheck.py` ausführen.
8. Checksums gegen den finalen Staging-Stand erzeugen.
9. ZIP bauen.
10. ZIP wieder entpacken bzw. dessen Inhalt prüfen.
11. Wenn möglich Candidate aus dem entpackten ZIP erneut starten.

Wenn Clean Run nicht möglich:

`CLEAN_RUN_NOT_EXECUTED` + Grund.

Nicht zu PASS umdeuten.

---

## 22 · ZIP-Name

`<PROJECT>_CLAUDE_DESIGN_SESSION_CUT_<YYYY-MM-DD>_r<N>.zip`

Kein kryptischer Auto-Name, wenn die Umgebung einen sinnvollen Dateinamen erlaubt.

---

## 23 · Failure Recovery

Wenn bereits **zwei fokussierte Reparaturversuche am selben Gate** ohne Fortschritt fehlgeschlagen sind:

- STOP;
- nicht noch einen dritten Reparaturversuch starten;
- aktuellen Candidate erhalten;
- Status `ARCHIVED_FAILED_CANDIDATE`;
- `POSTMORTEM.md` + Salvage Map hinzufügen;
- `skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` anwenden, wenn verfügbar;
- der Session Cut bleibt trotzdem vollständig exportiert.

---

## 24 · Abschlussantwort

Kein langes Preamble.

Kompakt zurückgeben:

- ZIP-Link;
- Dateiname;
- Dateizahl;
- ZIP-Größe;
- Entry Point;
- Status;
- `zipcheck.py`: PASS / NOT_RUN;
- Clean Run: PASS / NOT_RUN / FAIL;
- tatsächlich ausgeführte Tests;
- externe/fehlende Dependencies;
- offene/TUNE/BLOCKED-Punkte;
- genau ein Next Gate.

Wenn kein ZIP technisch erzeugt werden kann:

- nicht behaupten, dass es existiert;
- `EXPORT_BLOCKED` setzen;
- Ursache nennen;
- soweit möglich die Einzeldateien/den Staging-Ordner exportieren;
- HANDOVER/NEXT_CHAT trotzdem erzeugen.

---

## Paste-ready Fallback-Prompt · wenn der Shortcut fehlt

> Führe jetzt `skills/session_ZIP_v1.md` vollständig aus.
>
> Falls `/session-zip` in dieser Claude-Design-Umgebung nicht als Shortcut verfügbar ist, ist **dieser Prompt selbst der Trigger und die ausdrückliche Exportfreigabe**. Nicht nach einem Skill-Shortcut suchen und nicht erneut nach Bestätigung fragen.
>
> Erzeuge einen vollständigen KFB Claude Design Session Cut + ZIP des tatsächlich aktuellen Workspace-Stands. Kein Redesign, kein Refactor, keine Fixes vor dem Export, nichts löschen.
>
> Nutze die vollständigen Regeln aus `session_ZIP_v1.md`: geschlossene aktuelle Candidate-Codebasis, Pflichtdokumente, Source-/Owner-/Donor-Pins, Voice-Input-Unklarheiten, Asset-/Dependency-Inventar, Secret-Scan, Manifest, Checksums, `zipcheck.py`, Clean Run und genau einen Next Gate.
>
> Nur tatsächlich ausgeführte Tests dürfen PASS heißen. Fehlende Quellen/Assets ehrlich als `SOURCE_REQUIRED`, `VOICE_INPUT_UNCERTAIN`, `LOCAL_NOT_EXPORTED` oder `REPLAY_DEPENDENCY_MISSING` dokumentieren.
>
> Exportname: `<PROJECT>_CLAUDE_DESIGN_SESSION_CUT_<YYYY-MM-DD>_r<N>.zip`.
>
> Am Ende nur kompakt zurückgeben: ZIP-Link, Dateiname, Dateizahl, Größe, Entry Point, zipcheck/Clean-Run/Teststatus, fehlende/externe Abhängigkeiten, offene Punkte und den einen Next Gate.

---

## Versionshinweis v1.1

v1.1 macht die GitHub-Datei zur vollständigen Quelle der Wahrheit. Die frühere Abhängigkeit von `claude/session-zip-SKILL.md` ist entfernt. Ein registrierter Design-Shortcut ist optional, nicht erforderlich.
