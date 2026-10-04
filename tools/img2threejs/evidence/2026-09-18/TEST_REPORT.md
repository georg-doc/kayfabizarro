# Prüfbericht · Dom-Viewer v0.1 · 2026-09-18

**Gesamtstatus:** IMPLEMENTATION + STATIC TESTED RESULT; erfolgreicher Browserrender **UNVERIFIED**.

## Tatsächlich ausgeführt

`tests/check_static.py` lief im Arbeitscontainer mit Python 3.13 und Node.js v22.16.0. Ergebnis: **10/10 Quellprüfungen PASS**, siehe [unveränderte JSON-Ausgabe](static-checks.json).

Geprüft wurden: SHA-256-Identität des archivierten Originals; genau eine auf Three.js 0.161.0 gepinnte Import-Map vor dem Modul; Nutzung der auflösbaren Addon-Zuordnung; unveränderter Modellbau-Block; englische neue Oberfläche; Vorhandensein des Fehlerhandlers; fehlende Import-Map im Original; JavaScript-Modulsyntax von Original und v0.1.

**Was diese Prüfungen nicht tun:** Sie laden keine Three.js-Abhängigkeit, erzeugen keinen WebGL-Frame und beurteilen keine sichtbare Ähnlichkeit mit dem Dom. Die Prüfung des Fehlerhandlers ist rein statisch, kein erfolgreicher Test seines sichtbaren Laufzeitverhaltens.

## Browser- und Netzversuche

1. Der direkte Abruf der gepinnten OrbitControls-Abhängigkeit aus dem Arbeitscontainer scheiterte an DNS-Auflösung für `unpkg.com` (`Temporary failure in name resolution`). Das belegt eine Einschränkung dieser Umgebung, keinen allgemeinen Ausfall des CDN.
2. Playwrights standardmäßig erwartetes Chromium-Binary war nicht installiert. Ein vorhandenes System-Chromium ließ sich danach starten.
3. Der Aufruf der lokalen HTML-Datei im System-Chromium wurde mit `net::ERR_BLOCKED_BY_ADMINISTRATOR` bei `file://` verweigert. Der geplante Test der sichtbaren Fehlermeldung erreichte die Seite nicht. Daher weder Fehlerpfad-PASS noch Render-PASS.
4. Ein alternativer Download der unveränderten Three.js-r161-Bibliothek aus der offiziellen GitHub-Quelle kam ebenfalls nicht zustande. Keine Bibliothek wurde lokal nachgebaut oder durch einen Test-Dummy ersetzt.

Es wurde nicht versucht, Browserrichtlinien zu umgehen. Ein lokaler Policy-Block wird nicht zum Produktfehler oder zu einer erfolgreichen Prüfung umgedeututet.

## Exakte geprüfte Artefakte

| Datei | Bytes | SHA-256 |
| --- | ---: | --- |
| `archive/2026-09-18/koelner_dom_lowpoly_threejs.html` | 8759 | `7df3afec91969eaed56b42f28b7b9f04acebfad4e04dab54d165389874c70e49` |
| `prototypes/koelner-dom/v0.1/index.html` | 12793 | `87a9e77f22e7b08e7e6311f5f13afe93035474e0c2a0051664c46b641bfcb451` |

Die geprüften Quellen wurden für die GitHub-Ablage verwendet. GitHub-Transport und Readback werden beim Abschluss separat geprüft; das ersetzt ebenfalls keinen Browserlauf.

## Noch offen

| Gate | Status |
| --- | --- |
| Erfolgreicher Start mit echten Three.js-Modulen | UNVERIFIED |
| Sichtbares Modell, Kameraausschnitt und Nebel | UNVERIFIED |
| Orbit / Zoom / Reset / Wireframe im Browser | UNVERIFIED |
| Schmale Ansicht / Touch / mobile Performance | NOT_TESTED |
| Referenztreue / Grundriss / Dachformen / Proportionen | NOT_TESTED |
| GLB-Export und Import-Roundtrip | NOT_IMPLEMENTED |
| ToolBox-/World-/Race-Integration | NOT_IMPLEMENTED |
| Öffentliches Deployment und dessen Render | UNVERIFIED |
| Georgs visuelle Abnahme | NOT_OBTAINED |

## Reproduktion durch einen ausführenden Agenten

Vom Ordner `tools/img2threejs/` aus: `python3 tests/check_static.py`. Python-Standardbibliothek und Node.js werden benötigt; kein Paket-Install für diese Quellprüfungen. Diese Anweisung richtet sich an einen ausführenden Agenten, nicht an Georg als Terminalaufgabe.

Für den nächsten Browserlauf den Kandidaten über einen erlaubten statischen Host oder freigegebenen Dateipfad öffnen. Auf `window.__KFB_IMG2THREEJS__.ready === true` prüfen, dann echte Ansichten und Interaktionen testen. Dieses Flag allein ist kein visueller PASS.

Nach einer erfolgreichen neuen Prüfung einen datierten zusätzlichen Bericht und Changelog-Eintrag anlegen. Diesen historischen Bericht nicht nachträglich in einen PASS umschreiben.
