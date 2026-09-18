# KFB img2threejs · Arbeitsbereich

**Stand:** 2026-09-18 · **Owner:** Georg / KFB  
**Aktuelle Analyse / Slice:** [Landmark Deformer Modes](docs/DEFORMER_MODES_ANALYSIS_2026-09-18.md)  
**Vorheriger WSA-Return:** [Landmark Pilot 02](docs/LANDMARK_PILOT_02_WSA_RETURN_2026-09-18.md)

## Aktuell

**Landmark Pilot 03: EXPERIMENTAL PRESENTATION MODES.** Additiv über den unveränderten Pilot-01/02-Modellen:
- Base geometry;
- **City Grotesque · exact** — nutzt die bestehenden Hürth/Ehrenfeld-Werte aus `cartoon-city.js`;
- **Soft Cubist · rounded** — dieselbe objekt-normalisierte Grammatik plus weiche Mittelzonen-Aufblähung;
- **Giza Voxel Steps** — 30 vorhandene Pyramidenkurse als Stufen-Slabs;
- **Giza Boxel Blocks** — makro-blockige / LEGO-artige Studie mit sichtbaren Fugen.

Die City-Kollisions-/Exportgeometrie bleibt unverändert. Kein OSM-Manifest, Travel-/Race-Movement-Owner oder Registry-Vertrag wurde ersetzt.

**Pilot 02 bleibt:** Pentagon, Spasskaja-Turm, Kreml-Mauerstudie sowie die unveränderten Eiffel/Giza/Stonehenge-Modelle.  
**Dom v0.2 bleibt:** GEORG VISUAL ACCEPTANCE für die cartoonige Stil-/Formrichtung; noch kein vermessener OSM-/Meterfit.

## Öffnen

- [Pilot 03 · Deformer + Voxel/Boxel modes](landmarks/pilot-03/index.html)
- [Pilot 02 · sechs Landmark-Modelle](landmarks/pilot-02/index.html)
- [Pilot 01 · Eiffel / Giza / Stonehenge](landmarks/pilot-01/index.html)
- [Dom v0.2 · akzeptierte Stilprobe](prototypes/koelner-dom/v0.2/index.html)
- [Browser-Einstieg](index.html)

GitHub zeigt HTML als Quelltext. Die modularen Viewer brauchen JavaScript/WebGL und Zugriff auf Three.js 0.160.0; der unveränderte Dom v0.2 nutzt weiterhin 0.161.0.

## Pilot 03 · Source Review

Gelesene Donoren:

- `tools/osm-city-lab/src/style/cartoon-city.js` — City-Deformer, Blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782`
- `tools/osm-city-lab/styles/kfb-city-v0.json` — aktueller `grotesque`-Preset
- `travel/wip/travel_globe_wsa/kfb-cartoon-deform.js` — geteilter Prop-Verbieger; gemeinsamer Multi-Mesh-Rahmen + Segmentierungs-Fallback
- `skills/kfb-box-material.js` — Voxel-/Box-Materialsprache
- `media/3D_Assets/KFB/edge3.jpg` — bestätigtes Kanten-Asset, Blob `1e105dce9dd2cb2321833214040442fa8027eeca`

Die Analyse steht vollständig in [DEFORMER_MODES_ANALYSIS](docs/DEFORMER_MODES_ANALYSIS_2026-09-18.md).

## Evidenz

[Pilot-03 summary](evidence/2026-09-18-landmark-pilot-03/summary.json):

- 57 Geometrie-/Mode-Checks PASS;
- 3 zusätzliche Syntax-/Referenz-Checks PASS;
- alle sechs Landmarken bleiben unter City Grotesque und Soft Cubist endlich, bodenverankert und behalten ihre Dreieckszahl;
- Giza Voxel Steps: **360 Dreiecke**, identische Gesamt-Bounding-Box zum Base-Modell;
- Giza Boxel: **15.552 Dreiecke**, bodenverankert, sichtbare echte Blockfugen;
- Voxel/Boxel auf Nicht-Giza fällt sicher auf Base zurück.

**Nicht behauptet:** Browser/WebGL-PASS, Mobile, Consumer-Integration, OSM-Bindung oder Georg-Abnahme der neuen Modi.

## Recovery

1. `skills/chat/START_HERE.md` + Registry/SOP aktuell lesen.
2. Dieses README → [Deformer Analyse](docs/DEFORMER_MODES_ANALYSIS_2026-09-18.md) → jüngste Changelog-Einträge.
3. Pilot 03 sichtbar prüfen: Spasskaja Base vs City Grotesque vs Soft Cubist; Giza Base vs Grotesque vs Voxel Steps vs Boxel.
4. Erst nach diesem Look-Gate Material-/Weathering-Layer testen: `kfb-box-material`, edge3, Papier/Karton/Ton/Stein.
5. Der Dom bleibt der bevorzugte erste echte OSM-Footprint-/Meter-/Yaw-Golden-Sample-Kandidat.

## Zuständigkeiten

Dieser Ordner ist Authoring-/Donor-Space. City Lab besitzt Geodaten, lokale Projektion, City-Style und Landmark-Override-Vertrag. Registry/Librarian besitzt Assetidentität. Travel/Free Roam besitzt Bewegung/Terrainkontakt/Persistenz. Race bleibt eigenes Implementation-SSOT.

Keine bestehenden Owner wurden ersetzt; Pilot 03 ist eine reversible Präsentationsstudie.