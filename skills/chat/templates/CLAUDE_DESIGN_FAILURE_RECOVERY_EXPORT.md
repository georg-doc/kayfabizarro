# Claude Design · Failure Recovery + vollständiger Code-Export

**Status:** CURRENT REFERENCE v1.0  
**Zweck:** Wiederholte oder teure Design-/Baukasten-Fehlläufe beenden, vollständig sichern und als belastbare Lernbasis zurückgeben.  
**Gilt für:** Claude Design und vergleichbare visuelle Authoring-Umgebungen.  
**Nicht:** automatische Reparatur, Runtime-Promotion oder Georg-Abnahme.

Dieses Template wird benutzt, wenn eine visuelle Arbeit zwar Code oder eine Vorschau erzeugt, aber am Baukasten, Pack-Mentalmodell, Maßstab, Anschlussprinzip, Grounding oder an wiederholten Reparaturschleifen scheitert.

## Wann sofort auf Recovery wechseln

Recovery statt weiterem Polieren, sobald mindestens eines gilt:

- zwei aufeinanderfolgende Korrekturen verbessern denselben sichtbaren Grundfehler nicht;
- ein Generator oder eine Komposition wird gebaut, bevor Assetrollen, Maße und Anschlüsse belegt sind;
- Assets laden, aber die Szene liest sich nicht wie das Quellen-Pack;
- Lücken, Schweben, offene Seiten, falsche Maßstäbe oder unklare Laufoberflächen werden einzeln „wegjustiert“;
- die Design-Quote wird für Wiederholungen verbraucht, ohne dass ein messbarer Gate-Fortschritt entsteht;
- Code, Zustand oder Entscheidungsverlauf drohen beim Chat-/Projektende verloren zu gehen.

Ab diesem Punkt: **keine weitere Reparaturrunde im selben Fundament. Erst exportieren und auswerten.**

## Paste-ready Auftrag an Claude Design

> **STOPPE DIE AKTUELLE REPARATURSCHLEIFE.**
>
> Bewahre den derzeitigen Stand unverändert als fehlgeschlagenen, aber möglicherweise teilweise brauchbaren Kandidaten. Kein Redesign, kein vereinfachter Nachbau und keine weitere visuelle Schönheitskorrektur vor dem Export.
>
> Erzeuge jetzt einen vollständigen, außerhalb von Claude Design startbaren und editierbaren Export:
>
> `<PROJECT>_FAILURE_RECOVERY_EXPORT_<YYYY-MM-DD>_r<N>.zip`
>
> Der Export muss den tatsächlich aktuellen Code- und Datenstand enthalten, nicht nur die sichtbare HTML-Datei oder einen Screenshot. Enthalten sein müssen alle vorhandenen Module, Styles, Shader, Loader, Generatoren, Adapter, Konfigurationen, Szenenrezepte, Seeds, Presets, verwendeten lokalen Assets beziehungsweise belegten Asset-Verweise, Abhängigkeiten, Build-Dateien und gespeicherten Browserzustände.
>
> Bewahre den fehlgeschlagenen Code. Entferne oder überschreibe ihn nicht, um das Ergebnis nachträglich sauberer aussehen zu lassen. Markiere nicht verfügbare Bestandteile ehrlich als `MISSING`, `BLOCKED` oder `NOT_EXPORTED`.
>
> Liefere zusätzlich ein Post-mortem: Was war das Ziel? Welche Versuche wurden tatsächlich gemacht? Was funktioniert? Was ist sichtbar oder messbar falsch? Welche Ursache ist belegt, welche nur vermutet? Welche Teile sind wiederverwendbar? Welcher kleinste nächste Gate-Test muss bestanden werden, bevor erneut komponiert oder generiert wird?
>
> Führe während dieses Exports keine neue Architektur, keinen zweiten Renderer, keine Ersatzassets und keine neue Spiellogik ein.
>
> Testergebnisse nur als `PASS` ausweisen, wenn der Test tatsächlich ausgeführt wurde. Ein geladenes Modell ist kein Beleg für richtige Baukastenlogik. Ein Screenshot ist kein Beleg für Grounding, Anschlüsse oder Begehbarkeit.
>
> Abschlussformat:
>
> `SOURCE | ATTEMPTS | WORKING PARTS | FAILURE EVIDENCE | PROVEN CAUSES | HYPOTHESES | SALVAGE | LESSONS LEARNED | NEXT GATE | EXPORT | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`
>
> Gib einen real herunterladbaren ZIP-Link, Dateiname, Dateizahl, Gesamtgröße, Startanweisung und die Liste nicht enthaltener Abhängigkeiten zurück. Wenn das nicht möglich ist, sage exakt warum und exportiere wenigstens alle einzeln verfügbaren Quelldateien plus Manifest.

## Erwartete Paketstruktur

Bestehende funktionierende Ordner müssen nicht umgebaut werden. Das Manifest darf auf sie zeigen.

```text
<project>/
  README.md
  START_HERE.md
  SOURCE_SNAPSHOT.md
  CHANGELOG.md
  EXPORT_MANIFEST.json
  CHECKSUMS.sha256

  source/                 vollständige editierbare Codebasis
  dist/                   tatsächlich erzeugter Browser-Build, falls vorhanden
  data/                   Szenen, Kataloge, Regeln, Seeds, Presets, Zustände
  assets/                 nur benötigte lokale Dateien oder klar erklärte Verweise
  vendor/                 lokale Laufzeitbibliotheken, falls vorhanden
  licenses/               vorhandene Lizenzen/Attributionen

  docs/
    POSTMORTEM.md
    ATTEMPT_LOG.md
    ASSET_TRUTH.md
    MENTAL_MODEL.md
    FEATURE_PARITY.md
    SALVAGE_MAP.md
    LESSONS_LEARNED.md
    NEXT_GATE.md
    TEST_REPORT.md
    KNOWN_ISSUES.md
    RECOVERY.md

  evidence/
    screenshots/
    logs/
    reports/
```

Bei einer Single-HTML-Anwendung darf `source/` eine einzelne HTML-Datei plus ihre wirklichen Abhängigkeiten enthalten. Kein künstliches Buildsystem einführen.

Nicht ins Paket: Zugangsdaten, Tokens, private signierte URLs, `node_modules`, Browser-Caches oder erfundene Testergebnisse.

## Pflichtinhalt von EXPORT_MANIFEST.json

Mindestens:

```json
{
  "schema": "kfb.failure-recovery-export/1",
  "project": "<name>",
  "exportRevision": "<date-rN>",
  "status": "ARCHIVED_FAILED_CANDIDATE",
  "entrypoints": [],
  "sourceFiles": [],
  "buildOutputs": [],
  "dataFiles": [],
  "assetRefs": [],
  "externalDependencies": [],
  "browserStateExports": [],
  "evidence": [],
  "missing": [],
  "start": {
    "command": null,
    "url": null,
    "notes": null
  }
}
```

Für jede Datei beziehungsweise Asset-Referenz soweit tatsächlich bekannt:

- Paketpfad und Rolle;
- ursprünglicher Pfad/URL;
- Version oder Revision;
- SHA-256 und Dateigröße;
- Lizenz-/Herkunftshinweis;
- lokal enthalten oder extern benötigt;
- erfolgreich geladen, fehlgeschlagen oder nicht geprüft.

Unbekannte Werte bleiben `null` mit Erklärung. Dateinamen allein beweisen keine Assetidentität.

## Post-mortem-Raster

### 1. Ziel und Abnahmebild

- Was sollte sichtbar oder spielbar entstehen?
- Welche Referenzbilder, Pack-Previews oder bestehenden KFB-Donoren galten?
- Was war ausdrücklich nicht Teil des Auftrags?

### 2. Versuchsprotokoll

Pro Versuch:

| Versuch | Änderung | erwarteter Effekt | tatsächliches Ergebnis | Beleg | Entscheidung |
|---|---|---|---|---|---|
| 1 | … | … | … | Screenshot/Log | retain/reject |
| 2 | … | … | … | Screenshot/Log | retain/reject |

Keine nachträgliche Erfolgsgeschichte schreiben. Abgebrochene und wirkungslose Versuche bleiben sichtbar.

### 3. Was funktioniert

Getrennt erfassen:

- Start/Boot;
- Assetauflösung;
- Viewer/Kamera/UI;
- Messung/Katalog;
- Datenmodell;
- Komposition/Generator;
- Bewegung/Kollision;
- mobile Bedienung;
- Export/Import.

### 4. Fehlerbelege

Nur Beobachtungen:

- sichtbare Lücke/Überlappung/Schwebeeffekt;
- fehlender oder falscher Assetpfad;
- falsche Soll-/Ist-Zahl;
- Konsolen-/Netzwerkfehler;
- nicht reproduzierbarer Seed;
- Referenzvergleich verfehlt;
- Grounding/Anschluss/Collision nicht geprüft.

### 5. Ursache: belegt oder vermutet

- **PROVEN:** durch Code, Messung, Log oder reproduzierbaren Test belegt.
- **HYPOTHESIS:** plausible Erklärung, noch zu prüfen.
- **UNKNOWN:** keine belastbare Ursache.

Eine Vermutung darf nicht zur neuen Baukastenregel werden.

### 6. Salvage Map

| Teil | Status | Warum | nächster Besitzer |
|---|---|---|---|
| Viewer/Kamera | REUSE_CANDIDATE | separat lauffähig | Tool/Atlas |
| Generator | REJECTED_FOUNDATION | Regeln unbelegt | nach Mental-Model-Gate |
| Szene | ARCHIVED_FAILED | sichtbarer Befund | nur Referenz |

Zulässige Statuswerte:
`REUSE_CANDIDATE | NEEDS_ISOLATED_TEST | REJECTED_FOUNDATION | ARCHIVED_FAILED | UNKNOWN`.

### 7. Lessons Learned

Jede Lehre braucht:

- den konkreten Fehler;
- die künftig geltende Regel;
- den frühen Test, der den Fehler billiger entdeckt hätte.

Beispiel:

> Fehler: Der Generator wurde vor der Modulgrammatik gebaut.  
> Regel: Erst Asset Atlas und eine Referenzrekonstruktion.  
> Früher Test: Drei ausgewählte Module mit Maßen, Außenkanten und Anschlussprobe.

### 8. Ein einziges nächstes Gate

Kein großer Wiederaufbau. Das nächste Gate ist üblicherweise eines von:

1. vollständiger Asset Atlas;
2. eine referenzgeführte Mini-Rekonstruktion;
3. gemessene Anschluss-/Support-Tabelle;
4. reproduzierbarer Ein-Modul- oder Drei-Modul-Test;
5. unabhängiger Grounding-/Kontakt-Test.

Erst nach PASS folgt der nächste Schritt.

## Quoten-Sicherung

- Nach zwei Reparaturen ohne messbaren Gate-Fortschritt: stoppen und exportieren.
- Pro Sitzung nur ein Baukasten-Gate.
- Atlas/Katalog und Referenzrekonstruktion vor Generator oder großer Szene.
- Die letzten Arbeitsreserven gehören Tests, Dokumentation und Export – nicht einer weiteren ungeprüften Schönheitsrunde.
- Ein fehlgeschlagener Kandidat wird nicht gelöscht; er wird als `ARCHIVED_FAILED_CANDIDATE` eingefroren.
- Ein neuer Versuch beginnt aus der belegten Asset-/Mental-Model-Basis, nicht als vierte Variante derselben Komposition.

## Minimale Rückgabe für Work

- ZIP-Datei oder ehrliche Exportblockade;
- exakter Projekt-/Exportstand;
- Einstieg und Startanweisung;
- vollständiges Manifest;
- Post-mortem;
- Salvage Map;
- tatsächlich ausgeführte Tests;
- ein Screenshot des Endzustands;
- genau ein nächstes Gate.

Diese Rückgabe ist ein Intake-Paket. Sie wird erst nach Review durch den jeweiligen Owner zu einer aktuellen Implementierung.
