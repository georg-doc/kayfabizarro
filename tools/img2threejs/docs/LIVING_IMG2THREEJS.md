# Living Doc · KFB img2threejs

Stand: 2026-09-18 · Status: **EXPERIMENTAL**  
Einstieg / Recovery: [README](../README.md) · Historie: [CHANGELOG](../CHANGELOG.md)

> **CURRENT UPDATE:** Für die Fortsetzung zuerst §8 lesen: Georgs sichtbarer Fehlerbefund und v0.2-Geometriekandidat. Die früheren v0.1-Prüfaussagen und der damalige nächste Schritt bleiben unten als historische Arbeitsstände erhalten.

## 1. Auftrag und Abgrenzung

**DECISION — Georg, 2026-09-18:** Unter `georg-doc/kayfabizarro/tools/img2threejs/` einen Arbeitsordner mit passenden Unterordnern anlegen und die bisherige Chat-Arbeit mit additivem Changelog weiterführen. Kontext und Arbeitsregeln kommen aus `skills/chat/`.

**DECISION — vorheriger Benutzerauftrag:** Einen einfachen, stilisierten Low-Poly-Kölner-Dom als prozeduralen 3D-Prototyp erstellen.

**Nicht entschieden:** Das externe Tool installieren/forken, einen automatischen Bild-Upload-Service bauen, die ToolBox um ein produktives Modul erweitern oder einen neuen globalen Asset-Owner einführen. Diese Ablage übernimmt keine bestehenden Zuständigkeiten.

Die Race-Implementierung bleibt in `georg-doc/KFB-Stunt-Car-Race`. Dieser Ordner besitzt nur die hier erstellten experimentellen Authoring-Artefakte und ihre Dokumentation.

## 2. Herkunft der Idee

Externe Referenz: [img2threejs/img2threejs](https://github.com/img2threejs/img2threejs).

Im vorangegangenen Chat wurden insbesondere [SKILL.md](https://github.com/img2threejs/img2threejs/blob/main/SKILL.md), [Architektur](https://github.com/img2threejs/img2threejs/blob/main/docs/ARCHITECTURE.md), der Generator-Einstieg und Lab-Notizen betrachtet. Diese beweglichen Links sind Referenznavigation, keine gepinnte lokale Tool-Abhängigkeit.

Die für KFB interessante Richtung ist: Referenz analysieren, Bauteile beschreiben, stufenweise Code-Geometrie erstellen, echte Render mit der Vorlage vergleichen und Korrekturen belegbar führen. Die frühere Chat-Einschätzung ist eine **PROPOSAL / SOURCE REVIEW**, kein eigener erfolgreicher Rekonstruktionslauf.

**IMPLEMENTATION FACT:** Der Dom in diesem Ordner ist handgeschriebener Three.js-Code aus dem Chat. Kein `forge`-Lauf, kein ObjectSculptSpec, keine Referenzbildmessung, kein Referenzvergleich und kein img2threejs-Qualitätsgate wurden dafür ausgeführt. Insbesondere darf der Ordnername nicht als Herkunftsnachweis für eine externe Generierung gelesen werden.

## 3. Bewahrte KFB-Vorschläge

**PROPOSAL P01 — eigene Props:** Ein Objekt, das noch nicht als passendes Repo-Asset existiert, aus einer eigenen Zeichnung prozedural nachbauen.

**PROPOSAL P02 — bewegliche Hindernisse:** Ein klar getrenntes bewegliches Bauteil, seinen Drehpunkt und seine Befestigung in einem kleinen sichtbaren Test prüfen. Ein benannter Drehpunkt allein ist kein Animationsnachweis.

**PROPOSAL P03 — Referenzgestützte Szenenmontage:** Bildanalyse zur Identifikation und Anordnung vorhandener GitHub-Assets nutzen. Das wäre eine eigene KFB-Erweiterung, keine nachgewiesene fertige Funktion des externen Projekts.

**PROPOSAL P04 — Varianten und Export:** Erst nach akzeptierter Grundform kontrollierte Parameter und gegebenenfalls GLB-Export ergänzen. Ein HTML-Viewer ist noch kein GLB und kein ToolBox-Importvertrag.

Ein möglicher Ablauf bleibt: Referenz → Librarian-Suche → vorhandenes GitHub-Asset wiederverwenden oder fehlendes eigenes Objekt als Kandidat erstellen → reale Stage-Prüfung → speichern und unverändert wieder laden. Noch kein produktiver Integrationsauftrag.

## 4. Dom · bisherige Artefakte

### Original — ARCHIVED HISTORY

Datei: `archive/2026-09-18/koelner_dom_lowpoly_threejs.html`.

8.759 Bytes; SHA-256:

`7df3afec91969eaed56b42f28b7b9f04acebfad4e04dab54d165389874c70e49`

Enthält Grundkörper, Seitenschiffe, Querschiff, Chor, zwei Türme und stark vereinfachte Detailandeutungen. Das Original wurde unverändert übernommen. Die frühere Formulierung „browserfähiger Prototyp“ war nicht durch einen erfolgreichen Browserlauf belegt.

**Code-Befund:** Der eingebundene `OrbitControls.js` importiert `three` als Bare Specifier. Im Original fehlt dessen Import-Map. Verifizierte Gegenquelle: [Three.js r161, OrbitControls.js](https://github.com/mrdoob/three.js/blob/r161/examples/jsm/controls/OrbitControls.js), Blob `5054c746388c8908f1cb7b4846656daa2f6f090c`.

### v0.1.0 — IMPLEMENTATION / STATIC CHECKED / RENDER UNVERIFIED

Datei: `prototypes/koelner-dom/v0.1/index.html`.

Änderungen gegenüber dem Original: gemeinsame Import-Map für Three.js und Addons, unverändert auf 0.161.0 gepinnt; dynamische Imports mit sichtbarem Fehlerzustand; englische Oberfläche; Reset-View; Wireframe-Schalter; modellbasierte Kameradistanz und Nebelabstände; Diagnoseobjekt `window.__KFB_IMG2THREEJS__`.

Der Modellbau-Block inklusive Materialien, Geometrie, Transformationen, Boden und Platz bleibt textgleich zum Original. Das ist eine Viewer-Korrektur, **keine architektonisch verbesserte Dom-Version**. Die tatsächlichen visuellen Wirkungen der neuen Bedienelemente sind noch nicht belegt.

Es wurde weder ein GLB erzeugt noch eine Integration in die ToolBox oder einen World-/Race-Consumer durchgeführt.

## 5. Konkrete offene Geometriefragen

Die folgenden Punkte stammen aus Quelltextprüfung, nicht aus einem Rendervergleich:

- Die Dachkörper verwenden seitlich gedrehte Kegel/Pyramiden statt eigens gebauter durchgehender Dachprismen; Achsen, Anschlüsse und Silhouette müssen geprüft werden.
- Die Plattform ist in X/Z mit 44/22 angelegt, während mehrere Baukörper deutlich weiter in Z reichen. Keine maßstäbliche Grundrissgrundlage ist dokumentiert.
- Fenster, Portale und Strebewerk sind geometrische Andeutungen, keine vermessenen architektonischen Elemente.
- Es gibt ein gemeinsames `THREE.Group`, aber noch keine benannte modulare Bauteilstruktur oder exportierte Kollisions-/Socket-Verträge.

Diese Fragen werden nicht durch neue Farben, zusätzliche Lichter oder einen positiven Syntaxcheck gelöst.

## 6. Nächster vertikaler Arbeitsschritt

**OPEN / PROPOSED NEXT:** Den aktuellen Kandidaten über einen zulässigen Browser-/Hostpfad mit erreichbaren Abhängigkeiten öffnen. Start, Orbit, Zoom, Reset, Wireframe und schmale Ansicht prüfen; Front, Seite und Dreiviertelansicht als echte Screenshots sichern.

Dann für einen neuen Geometriekandidaten geeignete Referenzansichten beschaffen, charakteristische Proportionen festhalten und zuerst Dachlandschaft, Turm-/Langhausverhältnis und Grundriss korrigieren. Archiv und v0.1 bleiben als Vergleich erhalten. Erfolg heißt erkennbare, prüfbare Geometrie, nicht nur ein technisch startender Viewer.

Georgs visuelle Abnahme bleibt separat. Eine spätere GLB-/ToolBox-Übergabe folgt erst nach diesem kleinen sichtbaren Nachweis und unter dem bestehenden Owner-Vertrag.

## 7. Arbeitsregeln und gelesener Routerstand

Gelesen am 2026-09-18; Blob-IDs dokumentieren die konkreten Textstände, nicht einen behaupteten gemeinsamen Snapshot:

| Datei unter `skills/chat/` | Gelesener Blob |
| --- | --- |
| `START_HERE.md` | `7a4cbae9cadde5432c02645652ef10f0b2200539` |
| `REGISTRY.json` | `ce3bb6854e6024c4a5ced2b3a4da84f901aa270e` |
| `PRODUCTION_SOP.md` | `c4282db22025a93803cc3377b47908c0c47e4029` |
| `EVIDENCE_AND_STATUS.md` | `0320ee7e121be2a5a5cd3c36e803b1c8d06f0ab4` |
| `SYNC_PROTOCOL.md` | `c8af4c66b3f7ce2cd1da985fea617b578d602575` |
| `adapters/chatgpt-astra.md` | `ad08256327a871f5f4f890498a17d5972f956ca7` |

Bei Wiederaufnahme frisch lesen, nicht diese Liste als Current-Behauptung übernehmen. Shared SOPs werden verlinkt, nicht hier dupliziert. Änderungen bleiben in diesem Arbeitsbereich; zentrale Router-, Hub-, Deployment- und Consumer-Dateien wurden nicht verändert.

Neue Einträge unterscheiden `PROPOSAL`, `DECISION`, `IMPLEMENTATION`, `TESTED RESULT`, `DEFERRED`, `UNRESOLVED` und `ARCHIVED HISTORY`. Frühere Einträge nicht umschreiben, um spätere Ergebnisse vorwegzunehmen.

## 8. Zulauf 2026-09-18 · Dachfehler sichtbar / v0.2 als aktueller Kandidat

**USER EVIDENCE:** Georgs Screenshot zeigt den vorherigen Viewer mit tatsächlich sichtbarem Modell, aber stark fehlerhaften Dachpyramiden. Damit gibt es einen Benutzer-Renderbeleg für den alten Stand, keinen korrekten Geometrie-PASS. Bildherkunft und Prüfsumme sind im [neuen Bericht](../evidence/2026-09-18-v0.2/TEST_REPORT.md) dokumentiert.

**USER DIRECTION / DECISION:** Die einfache Low-Poly-Richtung erhalten und die Grundgeometrie reparieren. Georg hält sie nach Reparatur für möglicherweise passend für KFB. Keine Umdeutung in eine finale Stil-/Consumer-Abnahme und kein Auftrag zur hochauflösenden Neumodellierung.

**IMPLEMENTATION — v0.2.0:** [Separates HTML](../prototypes/koelner-dom/v0.2/index.html). Seitlich gedrehte Kegel als Dächer entfernt; geschlossene Sattel-/Pultdachprismen und ein eigenes geschlossenes Kreuzdach eingeführt. Angrenzende Dächer haben identische Anschlussquerschnitte. Wandhöhen, Choranschluss, Fundament, Auflagen kleiner Spitzen und Strebewerk korrigiert. Hauptturm-Dimensionen, achtseitige Hauptspitzen, Materialien und Beleuchtung bleiben erhalten. Bedienfeld außerhalb der 3D-Fläche; Front-/Seiten-/Rückansicht ergänzt.

Quell-Commit: `3df61d811e2bbb51af80ff8cb38d3a79b627ffe4`; Git-Blob `c0a3fd9d01b137f7819b3c90e5247a88686599aa`; SHA-256 `122960a8870f79c6c78d8b87fe01aedc73c2b469e4306e1900936528bf25c5c6`. GitHub-Readback stimmt mit dem lokal geprüften und als Download bereitgestellten HTML überein.

**TESTED RESULT — statisch/numerisch:** 53/53 Prüfungen an den echten Dach-Datenfunktionen sowie der Modulsyntax bestanden. Zehn Dächer mit zusammen 86 Dreiecken. Geschlossene konsistent orientierte Einzelkörper; vier korrekte Anschlussquerschnitte; keine numerisch entarteten Dreiecke in diesen Dachkörpern. Keine Aussage über ein global verschweißtes Gebäudemesh. [Maschinelles Ergebnis](../evidence/2026-09-18-v0.2/geometry-checks.json).

**SOURCE INVENTORY:** Schon das ursprüngliche Modell war polygonarm. Die im neuen Bericht hergeleitete Quellrechnung ergibt 1499 Indexdreiecke für v0.1 und 1142 für v0.2, jeweils ohne Boden/Platz/Kontextwürfel. Das sind keine Browser-Performance-Messungen.

**UNRESOLVED:** Die Browser-Umgebungsprobe wurde vor Seitenaufruf blockiert. Neuer WebGL-Render, Interaktion, mobile Darstellung und Georgs Abnahme sind weiterhin offen. Kein behaupteter visueller PASS aufgrund der 53 numerischen Prüfungen.

**CURRENT NEXT — ersetzt den damaligen nächsten Schritt aus §6:** v0.2 öffnen und Front/Seite/Rückseite, freie Drehung, Dachanschlüsse, Spitzenauflagen und Sichtbarkeit trotz Bedienelementen prüfen. Erst danach weitere Detaillierung oder Export entscheiden. Referenzvermessung, GLB, ToolBox-/World-/Race-Integration und öffentliches Deployment bleiben offen.

Original und v0.1 wurden nicht verändert. Nur dieser Arbeitsordner wurde ergänzt. Router und Registry wurden erneut gelesen; `START_HERE.md` lag nun als Blob `1b589b3543873ea1c380c49febdb37c68886b195` vor, die SOP blieb beim oben verzeichneten Blob. Keine neue Dropbox-Ablage, kein Wechsel von Modul-Ownern und kein img2threejs-Forge-Lauf.
