# KFB img2threejs · Arbeitsbereich

**Stand:** 2026-09-18 · **Owner:** Georg / KFB  
**Aktueller Return:** [Landmark Pilot 02 · WSA Lead](docs/LANDMARK_PILOT_02_WSA_RETURN_2026-09-18.md)  
**Vorheriger Return:** [Pilot 01 ↔ OSM ↔ Desktop Work Lead](docs/LANDMARK_OSM_RETURN_2026-09-18.md)

## Aktuell

**Landmark Pilot 02: IMPLEMENTATION + NUMERICAL / GLB TESTED RESULT.** Neue Kandidaten: Pentagon, Spasskaja-Turm und Turm mit zwei Kreml-Mauerflügeln. Eiffelturm, Gizeh und Stonehenge werden unverändert aus Pilot 01 importiert. Sechs Modelloptionen, gemeinsamer Metermaßstab, bestehende City-Farben, Materialzonen, Größenvergleich und GLB-Export. 176 Geometrie-/Export-/Öffnungsprüfungen bestanden; drei neue GLBs unabhängig wieder eingelesen. Neuer Browser-/Consumer-PASS und Georgs Abnahme offen.

**Dom v0.2: GEORG VISUAL ACCEPTANCE für die cartoonige Stil-/Formrichtung.** Die noch fehlende architektonische Detailtreue, Meterkalibrierung und OSM-Integration sind davon ausgenommen. Die akzeptierte HTML-Datei bleibt unverändert.

## Öffnen

- [Browser-Einstieg mit allen erhaltenen Fassungen](index.html) — über einen statischen Webhost.
- [Landmark Pilot 02](landmarks/pilot-02/index.html) — aktueller Showroom mit sechs Modelloptionen.
- [Landmark Pilot 01](landmarks/pilot-01/index.html) — unveränderte erste Dreierprobe.
- [Akzeptierte Dom-Stilprobe v0.2](prototypes/koelner-dom/v0.2/index.html) — unveränderte Einzeldatei.
- [Vorherige Dom-Fassung v0.1](prototypes/koelner-dom/v0.1/index.html) — bekannte Dachfehler, Vergleichshistorie.
- [Unverändertes Chat-Original](archive/2026-09-18/koelner_dom_lowpoly_threejs.html) — ARCHIVED HISTORY; bekannter Importfehler.

GitHub zeigt HTML als Quelltext, nicht als laufenden Viewer. Öffentliches Deployment bleibt unbestätigt. Die modularen Piloten werden über einen statischen Host geöffnet; im Chat gibt es zusätzlich abgeleitete Einzeldatei-Downloads. Die Laufzeit benötigt die gepinnten Three.js-CDN-Module. Pilot 01/02 verwenden 0.160.0 wie City Lab, der unveränderte Dom 0.161.0.

## Recovery

1. [`skills/chat/START_HERE.md`](../../skills/chat/START_HERE.md), Registry und relevante SOP-/Sync-Regeln aktuell lesen.
2. [Pilot-02-Return](docs/LANDMARK_PILOT_02_WSA_RETURN_2026-09-18.md), danach [Changelog](CHANGELOG.md), Ereignis 06.
3. Frühere Entscheidungen bleiben im [Living Doc](docs/LIVING_IMG2THREEJS.md) und den datierten Returns erhalten. Der neue Return ergänzt sie, ohne historische Prüfstände umzuschreiben.
4. [Pilot-02-Messwerte](evidence/2026-09-18-landmark-pilot-02/summary.json), [Pilot-01-Messwerte](evidence/2026-09-18-landmark-pilot/summary.json) und [Dom-v0.2-Bericht](evidence/2026-09-18-v0.2/TEST_REPORT.md) getrennt lesen.
5. Nächster Gate: Browseransichten, Farbumschaltung und GLB-Import im bestehenden Consumer. Anschließend Detail-/LOD-Arbeit und der separate Dom-OSM-Footprint-/Maßstabsnachweis.

## Quellen / Reproduktion

`landmarks/pilot-02/` enthält `builder.mjs`, `geometry.mjs`, `presentation.mjs`, `viewer.mjs`, `index.html` und `sources.json`. Der erzeugte Viewer erweitert den vorhandenen Pilot-01-Host; THREE-Fabrik und GLB-Exporter kommen unverändert aus Pilot 01. Die gemeinsame City-Palette bleibt beim City-Lab-Owner.

Für ausführende Agenten, nicht als Terminalaufgabe für Georg:

```text
node tests/check_landmarks_p02.mjs
python tests/check_glb_roundtrip_p02.py
python tests/build_landmarks_p02.py <output.html>
```

Der erste Test erzeugt vollständige Checkliste und GLBs aus der tatsächlichen Geometrie. Der zweite prüft die drei neuen GLBs unabhängig mit trimesh. Der dritte erzeugt den portablen Viewer mit markiertem City-Palettensnapshot. CPU-Vorschauen und GLBs sind abgeleitete Downloadartefakte; keine nicht vorhandenen Binärpfade auf GitHub werden behauptet.

**Prüfgrenze:** Der lokale Chromium-Seitenaufruf wurde vor Einstieg blockiert. Numerische Öffnungsprüfung bedeutet keine bestandene Gameplay-Durchfahrt; geschlossene Einzelteile bedeuten kein global verschweißtes Kollisionsmodell.

## Herkunft / Zuständigkeiten

Kein Fork oder installierter `img2threejs`-Forge-Lauf; die Modelle sind handgeschriebener prozeduraler Code, keine kopierten Sketchfab-Meshes. Referenzwerte und Modellannahmen stehen in `sources.json`. Das Kremlin-Beispiel ist ein schematischer Mauerabschnitt mit Turm, nicht der ganze Kreml.

City Lab besitzt Geodaten, lokale Projektion, Stadtstyle und Landmark-Override-Vertrag. Registry/Librarian besitzt Assetidentität. Travel/Free Roam besitzt Bewegung, Terrainkontakt und Persistenz; Race-Implementierungs-SSOT bleibt `georg-doc/KFB-Stunt-Car-Race`.

Für WSA wird lediglich ein dedizierter Quellenzeiger im bestehenden Race-`_handover` ergänzt. Keine neue WSA-Zuständigkeit, keine City-Manifest-/Style-/Registry-/Runtime-/Deployment-Änderung. Dropbox wurde als historische Referenz gelesen, nicht verändert. Alle geografischen Bindungen sind noch offen. Verwitterung, Papier/Stoff und Decals bleiben nachgeordnet.
