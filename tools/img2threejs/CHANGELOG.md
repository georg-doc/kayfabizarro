# Changelog · KFB img2threejs

Additive Historie. Neue Ereignisse ergänzen; alte Bewertungen nicht rückwirkend in Erfolge umschreiben. Einstieg: [README](README.md) · Aktueller Arbeitsstand: [Living Doc](docs/LIVING_IMG2THREEJS.md).

## 2026-09-18 · 01 · Externe Idee und KFB-Einordnung

**PROPOSAL / SOURCE REVIEW:** Georg brachte `img2threejs/img2threejs` als Tool-Idee ein. Im Chat wurden prozeduraler Nachbau aus Referenzen, stufenweise Spezifikation und Renderprüfung diskutiert. Mögliche KFB-Anwendungen: eigene Props, bewegliche Hindernisse, kontrollierte Varianten und referenzgestützte Montage vorhandener Repo-Assets.

**Abgrenzung:** Keine Installation, kein Fork, kein eigener erfolgreicher img2threejs-Lauf und keine ToolBox-Integration. Vorhandene GitHub-Assets sollen nicht automatisch neu modelliert werden.

## 2026-09-18 · 02 · Erster Dom-Entwurf im Chat

**DECISION:** Georg fragte nach einem einfachen Low-Poly-Modell des Kölner Doms und nach einer Umsetzung hier im Webchat.

**IMPLEMENTATION / danach ARCHIVED HISTORY:** `koelner_dom_lowpoly_threejs.html` wurde als einzelner handgeschriebener Three.js-Prototyp erstellt. Keine Bildmessung und kein eigener img2threejs-Generierungslauf. Die ursprüngliche Antwort enthielt nur einen Dateipfad statt eines anklickbaren Downloads.

**UNVERIFIED:** Die damalige Aussage zur Browserfähigkeit war nicht durch einen Browserlauf belegt. Die erneute Quellprüfung fand die fehlende Import-Map für den Bare-Specifier `three` in OrbitControls. Die Geometrie ist ein grober Entwurf, keine vermessene Dom-Rekonstruktion.

## 2026-09-18 · 03 · GitHub-Arbeitsbereich angelegt

**DECISION — ausdrücklicher Benutzerauftrag:** Ablage unter `georg-doc/kayfabizarro/tools/img2threejs/`, passende Unterordner, additive Fortführung und Berücksichtigung von `skills/chat/`.

**IMPLEMENTATION:** README mit Recovery-Einstieg, Living Doc, Browser-Einstieg, versionierter Prototyp, Originalarchiv, Quellprüfungen und Prüfnachweise angelegt. Ausschließlich neue Dateien in diesem Arbeitsbereich; keine Änderung an zentralem Router, Hub, Deployment, Librarian oder ToolBox-Owner. Die Race-Implementierungs-SSOT bleibt unverändert.

**ARCHIVED HISTORY:** Das ursprüngliche HTML wurde bytegetreu gesichert. Archiv-Commit: `95eafc4fdd3e9f4d1edc15fccc10eae317aa7426`; Original-SHA-256: `7df3afec91969eaed56b42f28b7b9f04acebfad4e04dab54d165389874c70e49`.

**IMPLEMENTATION — Viewer v0.1.0:** Neue separate HTML-Fassung mit gemeinsamer Three.js-/Addon-Import-Map auf 0.161.0, dynamischen Imports, sichtbarem Fehlerzustand, englischer Oberfläche, Reset-View, Wireframe-Schalter, modellbasierter Kameradistanz samt Nebelabständen und Diagnoseobjekt. Quell-Commit: `8cc32094e3575b266a77a90d8df9663766675471`.

Die Geometrie und Materialien bleiben gegenüber dem Original unverändert. v0.1 ist eine Viewer-Korrektur und kein neuer Geometrie- oder Genauigkeits-PASS.

**TESTED RESULT — Quellprüfungen:** 10/10 statische Checks bestanden, einschließlich Archiv-Identität, identischem Modellbau-Block, Import-Zuordnung und JavaScript-Syntax. [JSON-Ergebnis](evidence/2026-09-18/static-checks.json).

**UNRESOLVED — Browserprüfung:** CDN-Zugriff aus dem Arbeitscontainer scheiterte; der anschließende lokale Browser-Dateiaufruf wurde durch die Browserrichtlinie blockiert. Kein erfolgreicher Render, keine echte Screenshot-Evidenz und kein bestandener Fehlerpfadtest. [Vollständiger Prüfbericht](evidence/2026-09-18/TEST_REPORT.md).

**SOURCE CHECK — Dropbox:** Exakte Suche nach `img2threejs` ohne Treffer. Keine Dropbox-Dateien verändert und keine zweite Arbeitsablage angelegt.

**DEFERRED / OPEN:** Erfolgreicher Browserlauf; Referenzvergleich und geometrische Überarbeitung; tatsächlicher GLB-Export; ToolBox-/World-/Race-Roundtrip; öffentliches Deployment; Georgs visuelle Abnahme. Diese offenen Schritte werden nicht durch die Repo-Ablage oder einen Syntax-PASS als erledigt behandelt.
