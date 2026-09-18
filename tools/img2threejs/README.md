# KFB img2threejs · Arbeitsbereich

**Stand:** 2026-09-18 · **Owner:** Georg / KFB  
**Aktueller Return / Living Addendum:** [Landmark Pilot 01 ↔ OSM ↔ Desktop Work Lead](docs/LANDMARK_OSM_RETURN_2026-09-18.md)

## Aktuell

**Dom v0.2: GEORG VISUAL ACCEPTANCE für die cartoonige Stil-/Formrichtung.** Die noch fehlende architektonische Detailtreue, Meterkalibrierung und OSM-Integration sind davon ausgenommen. Die akzeptierte HTML-Datei bleibt unverändert.

**Landmark Pilot 01: IMPLEMENTATION + NUMERICAL / GLB TESTED RESULT.** Eiffelturm, Gizeh-Pyramiden und schematisches Stonehenge; gemeinsamer Metermaßstab, bis zu sechs Materialzonen, vorhandene OSM-City-Palette, Farbwahl, gleiche Maßstabsreihe, GLB-Export. Neue Modelle noch nicht von Georg abgenommen; kein neuer Browser-/City-/Travel-PASS.

## Öffnen

- [Browser-Einstieg mit allen erhaltenen Fassungen](index.html) — über einen statischen Webhost.
- [Landmark Pilot 01](landmarks/pilot-01/index.html) — aktueller Showroom-Kandidat; Quelle und acht kleine Module im selben Ordner.
- [Akzeptierte Dom-Stilprobe v0.2](prototypes/koelner-dom/v0.2/index.html) — unveränderte Einzeldatei.
- [Vorherige Dom-Fassung v0.1](prototypes/koelner-dom/v0.1/index.html) — bekannte Dachfehler, Vergleichshistorie.
- [Unverändertes Chat-Original](archive/2026-09-18/koelner_dom_lowpoly_threejs.html) — ARCHIVED HISTORY; bekannter Importfehler.

GitHub zeigt HTML als Quelltext, nicht als laufenden Viewer. Öffentliches Deployment ist nicht bestätigt. Der modulare Pilot wird über einen statischen Host geöffnet. Im Chat wurde zusätzlich ein abgeleiteter Einzeldatei-Download bereitgestellt. Beide benötigen Zugriff auf die gepinnten Three.js-CDN-Module; der Pilot verwendet 0.160.0 wie City Lab, Dom v0.2 behält 0.161.0.

## Dokumentation / Recovery

1. [`skills/chat/START_HERE.md`](../../skills/chat/START_HERE.md), Registry und relevante SOP-/Sync-Regeln aktuell lesen.
2. [Aktuellen Return](docs/LANDMARK_OSM_RETURN_2026-09-18.md) lesen; danach [additives Changelog](CHANGELOG.md), insbesondere Ereignis 05.
3. Für Herkunft und frühere Entscheidungen: [Living Doc](docs/LIVING_IMG2THREEJS.md). Frühere Status-Snapshots dort werden durch die datierten Addenda ergänzt, nicht rückwirkend in Erfolge umgeschrieben.
4. [Neue Messwerte / Hashes / GLB-Reimports](evidence/2026-09-18-landmark-pilot/summary.json), [Dom-v0.2-Prüfbericht](evidence/2026-09-18-v0.2/TEST_REPORT.md) und [v0.1-Historie](evidence/2026-09-18/TEST_REPORT.md) getrennt lesen.
5. Nächster sichtbarer Schritt: neue drei Modelle im echten Browser ansehen, Farben und GLB-Reimport prüfen. Für das erste echte OSM-Override anschließend den Dom separat an verifizierten Footprint/Höhe/Ausrichtung kalibrieren. Kein künstliches Einsetzen außerhalb des realen Kartenausschnitts.

## Reproduzierbare Quellen

```text
landmarks/pilot-01/
  geometry.mjs          benannte prozedurale Bauteile, Meter, sechs Zonen
  presentation.mjs      Adapter auf bestehende City-Palette
  three-adapter.mjs     Modellfabrik mit THREE-Instanz des Hosts
  glb.mjs               Export derselben Geometrie; kein Viewer-Boden
  osm-bridge.mjs        Platzierungsvorschau/Guards, kein Consumer-Mount
  viewer.mjs            Showroom, Farbzonen, Maßstabsvergleich
  index.html            Browser-Einstieg
  sources.json          Referenzmaße versus Modellannahmen
```

Für ausführende Agenten, nicht als Terminalaufgabe für Georg: `node tests/check_landmarks_p01.mjs` erzeugt vollständige Checkliste und drei GLBs aus der Repo-Quelle; `python tests/build_landmark_standalone.py <output.html>` erzeugt den portablen Viewer mit markiertem Buildzeit-Palettensnapshot. Die kanonische Palette bleibt bei City Lab. Der neu hinzugefügte Python-Roundtrip-Test kann die GLBs unabhängig prüfen.

**Prüfgrenze:** 111 Geometrie-/Export-/Guard-Checks bestanden; GLBs separat wieder eingelesen; CPU-Vorschauen aus echten Vertices erzeugt. Der Browseraufruf dieser Umgebung blieb vor Seiteneinstieg blockiert. Keine behauptete WebGL-/Mobile-/Consumer-Abnahme.

## Herkunft / Zuständigkeiten

Dieser Ordner ist kein Fork und keine Installation von `img2threejs/img2threejs`. Die Modelle sind handgeschriebener prozeduraler Code, kein Forge-Ergebnis und keine kopierten Sketchfab-Meshes.

City Lab besitzt Geodaten, lokale Meterprojektion, Stadtstyle und den bestehenden Landmark-Override-Vertrag. Registry/Librarian besitzt Assetidentität. Travel/Free Roam besitzt Bewegung, Terrainkontakt und Persistenz; Race-Implementierungs-SSOT bleibt `georg-doc/KFB-Stunt-Car-Race`.

Keine Änderung an City-Lab-Styles/Manifest, zentraler Registry, fremden Runtime-Ownern oder Deployment-Konfiguration. Dropbox-Konzeptinput wurde gelesen, nicht synchronisiert oder zur Implementierungswahrheit erklärt. Pentagon/Kreml/Dom-Detailtreue bleiben weitere angeforderte Beispiele; Verwitterung/Decals/Papier/Stoff bleiben nachgeordnet.
