# Landmark Pilot 02 · WSA Lead Return · 2026-09-18

**Auftrag:** Georg wünscht weitere ikonische Landmarks und einen GitHub-Check-in für den bestehenden WSA Lead.  
**Owner / Quellen:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Status:** IMPLEMENTATION + NUMERICAL / GLB TESTED RESULT · neuer Browser- und Consumer-PASS offen.

## Aktueller sichtbarer Slice

Einstieg: [`landmarks/pilot-02/index.html`](../landmarks/pilot-02/index.html).

Der separate Pilot erweitert den bisherigen Showroom um **Pentagon**, **Spasskaja-Turm** und **Kreml-Mauerstudie**. Eiffelturm, Gizeh und Stonehenge werden aus Pilot 01 unverändert importiert. Die von Georg akzeptierte Dom-v0.2-Stilprobe bleibt unverändert in ihrem eigenen Viewer.

| Kandidat | Dreiecke | Materialmeshes | Modellmaße X / Y / Z |
| --- | ---: | ---: | --- |
| Pentagon | 11.384 | 4 | 455,248 / 23,5 / 434,561 m |
| Spasskaja-Turm | 3.496 | 5 | 18,88 / 71 / 18,88 m |
| Kreml-Mauerstudie | 5.008 | 6 | 116,2 / 71 / 18,88 m |

Das Pentagon hat fünf getrennte Ringe, verbindende Baukörper, ein wirklich offenes Zentrum und einfache Fassadenfenster. Der Turm hat einen offenen Tordurchgang, vier Zifferblätter, eine offene Glockenstufe, achtseitiges Zeltdach und Stern. Die Mauerstudie benutzt denselben Turm mit zwei geraden Mauerflügeln und eingekerbten Zinnen.

**Scope:** Die Kreml-Mauerstudie ist nicht der gesamte Moskauer Kreml und nicht die Basilius-Kathedrale. Die symmetrischen Mauern sind ein Authoring-Beispiel, kein vermessener Anlageplan. Beim Pentagon sind Dachhöhe, Ringbreiten, Zwischenräume und Fassadenrhythmus Modellannahmen. Die Grundabmessung von 281 m pro Außenseite ist eine gerundete Referenz; kein OSM-Aufmaß. Beim Turm sind 71 m Gesamthöhe die Referenz, Zwischenproportionen bleiben stilisiert. Quellen und Annahmen stehen getrennt in [`sources.json`](../landmarks/pilot-02/sources.json).

## Bedienung / Materialzonen

Der Viewer übernimmt den vorhandenen Pilot-01-Host mit einer reproduzierbaren kleinen Erweiterung: sechs Modelloptionen, Same-scale lineup, Front/Side/Top/Reset, Wire/Grid, vier Palettenmodi, einzelne Zonen-Farbwähler und GLB-Export.

**Natural materials** entspricht den neuen CPU-Vorschauen. **OSM City palette** liest weiter die bestehende City-Quelle; **KFB colour study** und **Material zone IDs** bleiben lokale Alternativen. Es entsteht kein zweiter globaler City-Style.

Die sechs möglichen Zonen bleiben `structure`, `secondary`, `upper`, `accent`, `glazing`, `base`. Nur genutzte Zonen werden zu Meshes zusammengefasst. 952 Pentagon-Einzelbauteile in der Baubeschreibung werden deshalb zu vier Materialmeshes, nicht 952 Runtime-Meshes.

1 Einheit = 1 m; ein Kamera-Fit verändert die Modellskalierung nicht. Die Größenvergleichsreihe ist keine geografische Platzierung. Der Export enthält weder Showroom-Boden noch Kamera. Verwitterung, Papier/Stoff, Decals und neue Deformationen bleiben DEFERRED.

## Direkter Anschluss für WSA / OSM-Lead

Die Quellen verwenden weiterhin die Palette und `materialPalette` / `pickStable` des vorhandenen City-Lab-Owners. Die Modellfabrik erhält die THREE-Instanz des Hosts:

```js
import {buildLandmark} from '../landmarks/pilot-02/geometry.mjs';
import {zoneColours} from '../landmarks/pilot-02/presentation.mjs';
import {createLandmarkGroup} from '../landmarks/pilot-01/three-adapter.mjs';
// Importpfade relativ zum jeweiligen Consumer anpassen.
const asset = buildLandmark('kremlin-wall');
const model = createLandmarkGroup(THREE, asset, zoneColours(asset, cityStyle, 'city'));
// Der bestehende Consumer entscheidet Position, Terrainkontakt und Freigabe.
```

Die Importpfade illustrieren die drei vorhandenen Module; sie sind kein bereits eingebauter City-Loader. `geographicBinding` bleibt bei allen Kandidaten `null`; `collision` ist nicht geliefert. Kein Basisgebäude wurde ausgeblendet und kein City-Manifest verändert.

Zielvertrag bleibt [`tools/osm-city-lab/docs/LANDMARK_OVERRIDES.md`](../../osm-city-lab/docs/LANDMARK_OVERRIDES.md), gelesener Blob `f9aea1cffb447aa6ede45d47452de4b467be76a2`: echte OSM-ID/Footprint, Maßstab/Ausrichtung, gepinntes GitHub-Asset und erst nach erfolgreicher Lade-/Fit-Prüfung das Basisgebäude ausblenden. Fallback muss erhalten bleiben. Dieser Slice erklärt nicht die neuen Landmarks zu georeferenzierten Hürth-/Ehrenfeld-Gebäuden.

WSA-Recovery wurde im bestehenden Race-Repo gelesen: `_handover/WSA_LEAD_RECOVERY_2026-09-18.md`, Blob `fe3c2c19e991bf3e1a112f8c01ba3542c6127f4e`. Keine Übernahme von Race-/Travel-/Registry-/Terrain-Zuständigkeiten. Der separate WSA-Eingang ist nur ein Quellenzeiger, kein neuer Lead-Auftrag oder automatischer Runtime-Merge.

Dropbox wurde ergänzend gelesen: historische `globe-landmarks.js` aus dem Travel-Globe-v13-3-Export. Verwendbare Lehre: Terrain besitzt Bodenhöhe, vorhandene Assets bleiben quellgebunden, Farbwirkung hängt vom Kontext ab. Keine dortige alte Welthöhen-/Farbregel ersetzt den aktuellen City-Vertrag. Keine Dropbox-Datei verändert.

## Tatsächlich ausgeführte Prüfungen

**176/176 PASS**, reproduzierbar mit `node tests/check_landmarks_p02.mjs`. Der Agent prüfte alle sechs tatsächlich erzeugten Modelle, nicht vereinfachte Test-Dummies: deterministische Positionen, endliche Werte, nicht entartete Dreiecke, konsistent geschlossene Einzelbauteile, positive Volumina, Boden-/Meterbezug, begrenzte Zonenzahl, vier Paletten, GLB-Header/Geometriezahlen/Zonennamen und Unverändertheit der ersten drei Modelle. Zusätzliche Strahltests prüfen das offene Pentagon-Zentrum, freie Toröffnungen und solide Torpfeiler. Das sind geometrische Öffnungen, keine erprobten Gameplay-Durchfahrten.

**Unabhängiger GLB-Reimport:** Die drei neuen Dateien wurden mit `trimesh` wieder eingelesen. Dreiecke und 4/5/6 Materialmeshes stimmen; maximale BBox-Abweichung unter 0,000008 m. Reproduktion: `python tests/check_glb_roundtrip_p02.py` nach dem Geometrietest. Kein vollständiger Khronos-Validator- oder Consumer-Import-PASS.

**Quelle / Readback:** Die sechs Dateien unter `landmarks/pilot-02/` wurden nach dem Schreiben mit den GitHub-Blobs verglichen: byteidentisch zum lokalen Stand. [Messwerte / Quellhashes / Prüfgrenzen](../evidence/2026-09-18-landmark-pilot-02/summary.json).

**Visuelle Evidenz:** Drei CPU-Vorschauen wurden aus den identischen Produktionskoordinaten erzeugt und angesehen, keine Bildgenerierung und kein Browser-Screenshot. Getrennte Kamerafits in der Vorschautafel sind kein Maßstabsvergleich. Die Vorschauen, erzeugten GLBs und die vollständige Checkliste liegen im Chat-Downloadpaket. Es werden keine nicht vorhandenen PNG-/GLB-Pfade auf GitHub behauptet.

**Browsergrenze:** Der tatsächliche Chromium-/Playwright-Aufruf über den lokalen HTTP-Host wurde vor Seiteneinstieg mit `ERR_BLOCKED_BY_ADMINISTRATOR` blockiert. Kein neuer WebGL-Frame, kein Interaktions-/Mobile-PASS. Die Quelle und die zusammengefasste JavaScript-Datei bestehen die Syntaxprüfung. Die Grenze wurde nicht umgangen.

## Reproduktion / nächste Abnahme

Der Ausführungsagent kann im Repo `python tests/build_landmarks_p02.py <output.html>` verwenden. Das erzeugt den modularen Pilot-02-Host und eine Einzeldatei aus denselben Quellen. Die Einzeldatei enthält einen markierten Buildzeit-Snapshot der gemeinsamen City-Palette und braucht Internetzugriff auf Three.js 0.160.0. Die Repo-Quelle bleibt maßgeblich, kein verpflichtender ZIP-Transfer und keine Terminalaufgabe für Georg.

Als nächstes: tatsächlicher Browserstart, Rundumansichten, Palettenwechsel und GLB-Import in einen bestehenden Consumer. Die neuen Kandidaten warten auf Georgs Look-Abnahme. Danach gezielte Detail-/LOD-Korrekturen; beim Pentagon wären weniger volumetrische Fenster ein späterer Einsparhebel. Der Dom bleibt der konkrete nächste Kandidat für ein echtes OSM-Footprint-/Maßstabs-Golden-Sample. Keine stillschweigende Promotion aus dieser Dokumentation.
