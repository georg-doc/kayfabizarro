---
name: claude-design-session-export
description: >
  Standardisierter vollständiger Claude-Design Session-Cut + ZIP für KFB. Trigger auf
  /claude-export, "Claude Design Export", "zieh mir einen vollständigen Export", "Session Cut ZIP",
  "Export + Handover", "Recovery ZIP", "Design Session sichern". Ergänzt session-export_v1:
  nicht nur Session-Delta, sondern die geschlossene, tatsächlich lauffähige aktuelle Codebasis
  des Kandidaten plus Handover, aktives Changelog, Source-/Donor-Locks, Tests, Evidence und Next Chat.
  Bei wiederholtem Fehlschlag zusätzlich CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md anwenden.
---

# Claude Design · vollständiger Session-Cut + ZIP v1

## Zweck

Dieser Skill erzeugt aus einer laufenden Claude-Design-Session ein vollständiges, recovery-taugliches Übergabepaket, das ein neuer Chat, ChatGPT Web/GitHub Bridge oder ein anderer Executor ohne Rekonstruktion der Unterhaltung lesen und weiterverwenden kann.

Er ist für den normalen erfolgreichen oder noch brauchbaren WIP-Export gedacht.

Er ersetzt nicht:

- skills/session-export_v1.md für einen bewusst schlanken Session-Delta-Export;
- skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md nach zwei fehlgeschlagenen Reparaturpässen am selben Gate.

Wenn /claude-export oder ein sinngleicher expliziter Exportauftrag gegeben wurde, gilt das als Freigabe zum Erzeugen des ZIPs. Manifest und Export werden in demselben Auftrag erstellt. Nicht noch einmal um Bestätigung bitten.

Ausnahme: Löschen, Verschieben oder irreversible Bereinigung braucht weiterhin Georgs ausdrückliche Freigabe.

---

# 1 · Export-Grundregel

Exportiere den tatsächlich aktuellen Kandidaten, nicht eine nachträglich bereinigte oder vereinfachte Fassung.

Kein:

- Redesign vor dem Export;
- "schöner machen";
- Zusammenfassen mehrerer Module zu einer neuen Architektur;
- Ersatz fehlender Donoren;
- stilles Entfernen gescheiterter, aber relevanter Codepfade;
- neuer Renderer;
- neue Runtime;
- neue Owner.

Der Export ist ein Snapshot des aktuellen Arbeitsstands plus ehrliche Übergabe.

---

# 2 · Wichtige Voice-Input-Regel

Georg verwendet häufig Voice Input. Eigennamen, Pfade, Versionsnamen und technische Begriffe können dadurch im Chat falsch transkribiert worden sein.

Deshalb:

- Dateinamen, Assetnamen, Repo-/Branch-Namen, Actor-Namen und Modulnamen aus dem tatsächlichen Workspace / aktuellen Source / GitHub-Zustand auflösen, nicht aus lautmalerisch ähnlichen Chat-Wörtern erfinden;
- einen gesprochenen Namen niemals still korrigieren, wenn zwei reale Quellen passen könnten;
- ungeklärte Begriffe im Handover als VOICE_INPUT_UNCERTAIN markieren;
- den tatsächlich verwendeten Source-Pfad daneben nennen;
- keine Ersatzquelle einsetzen, nur weil sie ähnlich klingt.

Beispiel:

VOICE_INPUT_UNCERTAIN: "Transformer Max" — exact source family not pinned in this session; no substitute used.

---

# 3 · Was in das Paket gehört

Der Export enthält die geschlossene lauffähige Codebasis des aktuellen Kandidaten, nicht das gesamte historische Projekt.

"Geschlossen" bedeutet:

- Entry-HTML / App-Einstieg;
- alle aktuell importierten lokalen JS-/TS-/CSS-/Shader-/Module;
- alle lokalen Daten-/Config-/Recipe-Dateien;
- aktuell benötigte kleine lokale Assets;
- alle im Kandidaten tatsächlich benötigten Contracts;
- aktive Dokumentation und Übergabe;
- Evidence, soweit sie den aktuellen Stand belegt.

Nicht automatisch einschließen:

- superseded historische Versionen;
- komplette Upload-/Download-Verzeichnisse;
- node_modules;
- Browser-Caches;
- private Tokens/Credentials;
- große Assets, die bereits über einen gepinnten Source-URL geladen werden;
- unrelated Projektbereiche.

Wenn eine lokale Abhängigkeit für den Kandidaten nötig ist, darf sie nicht nur deshalb fehlen, weil sie "nicht in dieser Session geändert" wurde. Für diesen Skill zählt Reproduzierbarkeit vor Delta-Minimalismus.

---

# 4 · Pflichtstruktur

Bestehende sinnvolle Projektordner dürfen erhalten bleiben. Nichts künstlich umsortieren, wenn dadurch Pfade brechen.

Mindestens folgende Inhalte müssen im ZIP eindeutig vorhanden oder im Manifest auf die bestehende Lage gemappt sein:

PROJECT_CLAUDE_DESIGN_SESSION_CUT_YYYY-MM-DD_rN/
  START_HERE.md
  RETURN.md
  HANDOVER.md
  CURRENT_STATE.md
  CHANGELOG.md
  HOUSEKEEPING.md
  SOURCE.json
  EXPORT_MANIFEST.json
  TEST_REPORT.md
  CHECKSUMS.sha256
  code/
  data/
  docs/
  evidence/
    screenshots/
    logs/
    reports/
  external/
    ASSET_REFS.md
    NOT_EXPORTED.md
  NEXT_CHAT.md

Wenn der aktuelle Kandidat bereits eine andere funktionierende Struktur hat, diese nicht zerlegen. Die Root-Dokumente dürfen stattdessen auf die realen Unterordner zeigen.

---

# 5 · START_HERE.md

Kurz und operational.

Muss enthalten:

1. Projekt / Slice / Datum.
2. Status: CANDIDATE, WIP, HUMAN_PASS, TUNE, REJECTED usw.
3. Tatsächlicher Entry Point.
4. So wird der Kandidat geöffnet/gestartet.
5. Welche Dateien zuerst zu lesen sind.
6. Aktueller Owner / Receiving Owner.
7. Ein Satz: was dieser Export nicht besitzt oder ersetzt.
8. Genau ein nächster Gate.

---

# 6 · HANDOVER.md

Das ist die wichtigste Datei für einen neuen Chat.

Pflichtabschnitte:

## A · User intent

Was wollte Georg tatsächlich erreichen?

Nicht nur den letzten Prompt wiederholen; die aktuelle Produktabsicht in wenigen klaren Sätzen festhalten.

## B · Current result

Was existiert jetzt sichtbar/funktional?

## C · What changed this session

Nur echte Änderungen.

## D · Source / owners / donors

Für jeden wichtigen Owner/Donor:

- Name;
- Rolle;
- Repo/Pfad;
- Branch/Commit/Pin soweit bekannt;
- USED / DONOR_ONLY / NOT_USED;
- was ausdrücklich nicht kopiert/übernommen wurde.

Ein geladenes Asset ist kein Beleg, dass sein Design korrekt verwendet wurde.

## E · Protected boundaries

Was darf der nächste Chat nicht neu bauen oder übernehmen?

Zum Beispiel:

- movement owner;
- camera owner;
- terrain truth;
- actor/face/eye/mouth owner;
- motion library;
- OSM geography;
- Race physics;
- persistence.

## F · Current controls / workflow

Wie benutzt Georg den Stand praktisch?

Hotkeys, Tabs, Modes, Save/Reload, besondere Gesten.

## G · Working / tested

Nur tatsächlich beobachtete oder ausgeführte Resultate.

## H · Open / tune / blocked

Mit Status:

OPEN · TUNE · BLOCKED · SOURCE_REQUIRED · VOICE_INPUT_UNCERTAIN · DEFERRED.

## I · Rejected / superseded directions

Damit der nächste Chat nicht denselben Fehler wiederholt.

## J · Next gate

Genau ein nächster sinnvoller Gate.

---

# 7 · CURRENT_STATE.md

Kurze menschliche Bestandsaufnahme:

- aktueller sichtbarer Stand;
- aktiver Modus / aktive Szene;
- aktuelle Auswahl;
- relevante gespeicherte Parameter;
- lokale Browser-/Session-State-Schlüssel;
- aktuelles Recipe/Seed/Preset;
- welche Zustände nur im Arbeitsspeicher liegen.

Wenn Browserzustand exportierbar ist, zusätzlich unter data/ sichern.

Wenn nicht exportierbar:

RUNTIME_STATE_NOT_SERIALIZED plus die relevanten Werte dokumentieren.

---

# 8 · CHANGELOG.md

Das aktive Changelog des Projekts mitnehmen und fortschreiben.

Regeln:

- append-only;
- alte Einträge nicht umschreiben;
- neue Session-Deltas mit Datum/Version;
- Korrekturen als neue Einträge;
- relevante User-Entscheidungen explizit markieren;
- rejected/superseded Zustände sichtbar lassen.

Wenn im Workspace mehrere alte Changelogs existieren:

- das tatsächlich aktive bestimmen;
- nur dieses als Root-CHANGELOG.md exponieren;
- andere nur dann mitnehmen, wenn aktuelle Module sie wirklich benötigen;
- im Manifest erklären.

---

# 9 · HOUSEKEEPING.md

Mindestens folgende Statuswerte:

AKTIV · SHARED · FROZEN · SUPERSEDED · DEAD · ASSET · CANDIDATE

Für relevante Dateien/Module:

- Status;
- Rolle;
- aktueller Nutzer/Importer;
- ob sicher löschbar;
- ob geteilt;
- ob Source Owner oder nur Exportkopie.

Nichts löschen.

Cleanup-Kandidaten nur benennen.

---

# 10 · SOURCE.json

Maschinenlesbare Source-/Owner-Wahrheit.

Empfohlene Felder:

schema = kfb.claude-design-session-cut/1
project
slice
exportedAt
status
entrypoints[]
owner{name, repo, branch, head}
sources[]
donors[]
contracts[]
assetRefs[]
runtimeOwners[]
protectedBoundaries[]
voiceInputUncertain[]
missing[]
nextGate

Unbekannt bleibt null oder wird als fehlend benannt. Nicht raten.

---

# 11 · EXPORT_MANIFEST.json

Für jede enthaltene Datei soweit möglich:

- Exportpfad;
- Rolle;
- Größe;
- SHA-256;
- Status;
- Ursprung;
- geändert in dieser Session: ja/nein;
- benötigt zum Start: ja/nein.

Zusätzlich:

- Entry Points;
- File Count;
- Total ZIP Size;
- External dependencies;
- Not exported;
- Missing;
- Evidence list.

---

# 12 · Asset- und Pfad-Hygiene

Prüfe jeden aktuell verwendeten Pfad.

Klassifiziere:

- LOCAL_INCLUDED
- REMOTE_PINNED
- REMOTE_UNPINNED
- LOCAL_NOT_EXPORTED
- MISSING

Für produktive KFB-Exporte bevorzugt:

- gepinnte GitHub/raw/jsDelivr Revisionen;
- keine raw@main-Abhängigkeit, wenn ein fester Pin verfügbar ist;
- keine zufälligen relativen ./assets/...-Pfade, wenn die Dateien nicht im ZIP liegen.

Große Assets:

Default analog zu session-export_v1:
keine unnötigen schweren Binaries in den Session Cut packen.

Dateien über 2 MB bevorzugt als gepinnte externe Referenz statt Duplikat.

Wenn ein über 2-MB-Asset lokal und noch nicht gepinnt ist:

- nicht still weglassen;
- unter external/NOT_EXPORTED.md mit Originalpfad, Größe, Hash und Rolle dokumentieren;
- als LOCAL_NOT_EXPORTED markieren.

Wenn ohne dieses Asset der Kandidat nicht reproduzierbar ist, im Handover deutlich REPLAY_DEPENDENCY_MISSING nennen.

---

# 13 · TEST_REPORT.md

Keine erfundenen Tests.

Trenne:

## Static / source

Zum Beispiel JSON parse, Importpfade, Dateivollständigkeit.

## Runtime / browser

Nur tatsächlich ausgeführt.

## Visual / human

Nur tatsächliche Georg-Rückmeldungen.

## Not tested

Explizit aufführen.

Ein Source-Load ist kein Visual PASS.

Ein Screenshot ist kein Gameplay PASS.

Claude-Design-Preview ist keine automatische Integration-Abnahme.

---

# 14 · Evidence

Mitnehmen, wenn vorhanden:

- 1–5 relevante aktuelle Screenshots;
- wichtige Logs;
- Messberichte;
- Browser-/Preview-Report;
- Referenzvergleich.

Keine hunderte Bilder ungefiltert ins ZIP legen.

Jede Evidence-Datei im Manifest mit kurzer Rolle benennen.

---

# 15 · NEXT_CHAT.md

Paste-ready Cold Start für den nächsten Chat.

Muss sagen:

1. lies START_HERE.md;
2. lies HANDOVER.md;
3. lies SOURCE.json;
4. lies das aktive CHANGELOG.md;
5. aktuelle GitHub-/Owner-Wahrheit schlägt diesen Export, falls sie neuer ist;
6. reproduziere zuerst den aktuellen Kandidaten;
7. kein neuer Owner / kein Redesign vor Parity;
8. bearbeite nur den genannten nächsten Gate.

Wenn der Export in eine bereits definierte KFB-Architektur zurückkehrt, den aktuellen Masterplan/Owner explizit nennen.

---

# 16 · Clean-Run vor ZIP

Vor dem finalen Download:

1. Exportordner in einen frischen Kontext denken/prüfen.
2. Entry Point bestimmen.
3. Prüfen, dass alle benötigten lokalen Imports im Paket existieren.
4. JSON/Config syntaktisch prüfen, soweit möglich.
5. Relative Assetpfade gegen Paketinhalt prüfen.
6. Remote-Assetrefs listen und Pin-Status prüfen.
7. Keine Tokens/Credentials/private signierte URLs.
8. Manifest-Dateizahl gegen echten Paketinhalt prüfen.
9. Checksums erzeugen.
10. Wenn die Umgebung den Kandidaten aus dem Export öffnen kann: einmal Clean Run aus dem Export durchführen.

Wenn Clean Run nicht möglich ist:

CLEAN_RUN_NOT_EXECUTED mit Grund.

Nicht zu PASS umdeuten.

---

# 17 · ZIP

Dateiname:

PROJECT_CLAUDE_DESIGN_SESSION_CUT_YYYY-MM-DD_rN.zip

Keine kryptischen Auto-Namen, wenn die Umgebung einen sinnvollen Dateinamen erlaubt.

Der ZIP enthält nur den beschriebenen Session Cut, keine komplette historische Projektablage.

---

# 18 · Abschlussantwort von Claude Design

Kurz zurückgeben:

- ZIP-Link;
- ZIP-Dateiname;
- Dateizahl;
- Größe;
- Entry Point;
- Status;
- wichtigste enthaltene Docs;
- tatsächlich ausgeführte Tests;
- relevante nicht enthaltene Abhängigkeiten;
- offene Punkte;
- genau ein Next Gate.

Wenn der ZIP-Download technisch nicht erzeugt werden kann:

- nicht behaupten, er existiere;
- Ursache nennen;
- alle verfügbaren Dateien einzeln exportieren;
- EXPORT_BLOCKED im Handover setzen.

---

# 19 · Wechsel in Failure Recovery

Wenn zwei fokussierte Reparaturversuche denselben Gate nicht verbessern:

STOP.

Dann zusätzlich anwenden:

skills/chat/templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md

Der normale Session Cut bleibt nützlich, aber der Status wechselt zu:

ARCHIVED_FAILED_CANDIDATE

und braucht Postmortem + Salvage Map.

---

# Paste-ready Standardprompt für Claude Design

> /claude-export
>
> Erzeuge jetzt einen vollständigen KFB Claude Design Session Cut + ZIP des tatsächlich aktuellen Arbeitsstands. Dies ist eine ausdrückliche Exportfreigabe; nicht noch einmal nach Bestätigung fragen und nichts löschen.
>
> Verwende den aktuellen Workspace als Wahrheit. Kein Redesign, kein Cleanup-Refactor, keine Ersatzassets und keine neue Architektur vor dem Export.
>
> Das Paket muss die geschlossene lauffähige aktuelle Codebasis des Kandidaten enthalten: Entry Point, alle benötigten lokalen Module/Styles/Shader/Data/Contracts sowie die aktuelle Übergabedokumentation. Es soll nicht das komplette historische Projekt duplizieren.
>
> Pflichtdokumente: START_HERE.md, RETURN.md, HANDOVER.md, CURRENT_STATE.md, aktives CHANGELOG.md, HOUSEKEEPING.md, SOURCE.json, EXPORT_MANIFEST.json, TEST_REPORT.md, CHECKSUMS.sha256, NEXT_CHAT.md, plus relevante Evidence.
>
> Handover muss enthalten: Georgs aktuelles Ziel, tatsächlicher Stand, Änderungen dieser Session, Source/Owner/Donor-Pins, geschützte Owner-Grenzen, Bedienung/Controls, tatsächlich getestete Resultate, offene/TUNE/BLOCKED/SOURCE_REQUIRED Punkte, rejected/superseded Richtungen und genau einen Next Gate.
>
> Voice-input cave: Eigennamen, Pfade und technische Begriffe aus dem Chat können durch Spracheingabe falsch transkribiert sein. Löse sie aus dem tatsächlichen Workspace/Source/GitHub auf. Nicht raten oder ähnlich klingende Quellen substituieren. Ungeklärtes als VOICE_INPUT_UNCERTAIN dokumentieren.
>
> Assets und Abhängigkeiten vollständig inventarisieren. Große bereits gepinnte Assets nicht duplizieren. Lokale notwendige, aber nicht exportierte Dateien mit Pfad, Größe, Hash und Rolle als LOCAL_NOT_EXPORTED / REPLAY_DEPENDENCY_MISSING dokumentieren. Keine Tokens oder privaten signierten URLs exportieren.
>
> Vor dem ZIP einen Clean-Run-/Vollständigkeitscheck machen: lokale Imports vorhanden, JSON parsebar, Assetpfade klassifiziert, Manifest-Dateizahl korrekt, Checksums erzeugt. Nur tatsächlich ausgeführte Tests als PASS nennen.
>
> Exportname: PROJECT_CLAUDE_DESIGN_SESSION_CUT_YYYY-MM-DD_rN.zip
>
> Am Ende nur kompakt zurückgeben: ZIP-Link, Dateiname, Dateizahl, Größe, Entry Point, Tests, fehlende/externe Abhängigkeiten, offene Punkte und den einen Next Gate.
>
> Falls zwei Reparaturpässen am selben Gate bereits fehlgeschlagen sind, statt weiterzureparieren zusätzlich den KFB Failure-Recovery-Export/Postmortem erzeugen und den Kandidaten als ARCHIVED_FAILED_CANDIDATE erhalten.
