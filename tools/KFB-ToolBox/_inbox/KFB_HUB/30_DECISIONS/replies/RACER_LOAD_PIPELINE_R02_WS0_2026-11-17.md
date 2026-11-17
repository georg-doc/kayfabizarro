# Für WS0 · Racer R02 Ladepfad · 17.11.2026

R02 ist gemessen und als begrenzter Kandidat getestet. **Bodensicherheit grün, globale Leistungsfreigabe offen.** Bitte auf eurer aktuellen gemeinsamen Abnahmefläche kontrolliert prüfen und nach eigenem Review aufnehmen; kein automatischer Merge/Live-Promote.

## Exakte Übergabe

- Repo: georg-doc/KFB-Stunt-Car-Race
- Branch: racer/shared-roads-main-r1
- [Draft PR139](https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/139)
- Verifizierter Dokument-/Branch-HEAD: **4c2922eada3d67ab62f6c19abf259d3f56a9fa16**
- Geprüfter Laufzeit-Code: **f4d5d8645fec54cc9e3f0139822690e0bbefcf28**
- Baseline: **44a67870ba2b0c9a9067c8e9de0ae302c0b6a13c**, Ausgangsstand f319f8a17d683d0f4e5d16f84efe4bedb2a48900.
- [Return mit Tests, Reproduktion und offenen Grenzen](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/4c2922eada3d67ab62f6c19abf259d3f56a9fa16/docs/load-pipeline-r02/RETURN.md)
- [Rohvergleich inkl. Spieltakt/allen Phasen](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/4c2922eada3d67ab62f6c19abf259d3f56a9fa16/docs/load-pipeline-r02/evidence/comparison.json)
- [Living Roadmap](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/4c2922eada3d67ab62f6c19abf259d3f56a9fa16/docs/racer-roadmap-r2/ROADMAP.json)
- [Sichtbeleg Dieselpunk](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/4c2922eada3d67ab62f6c19abf259d3f56a9fa16/docs/load-pipeline-r02/evidence/candidate-dieselpunk.jpg)

## Was geändert wurde

Opt-in loadprobe=r02 erfasst Ruf, vollständige Geometrie am Fußabdruck, gültige eingebaute eigene Kollider, tatsächliche Rapier-Abfrage, zwei stabile Bestätigungen, Physikfreigabe, Körper, Modellabruf/Vorbereitung, finale View-Anbindung, echten Hauptkamera-Draw und bestehende Szene-/Vorhangfreigabe getrennt. Der reine Modellabruf ist keine Sichtbarkeit. Vireos ursprüngliches Modell wird durch bewegliche/zusammengeführte Teile ersetzt; deshalb wird die endgültige Car-View beobachtet.

Belegter warmer Engpass: vorbereitete Car-View wartet auf Einbindung. Ein Kandidat: fertiges Modell über den **besitzenden R3F-Canvas-Reconciler** synchron einsetzen, bestehende Rig-/Vireo-View-Anbindung vor Paint. Vireo-Fernteleport Vorbereitung→View von2867,8ms/0,25Spielsekunden auf32,1ms/0Spielsekunden; die echte Bind-CPU beträgt≈32ms. Kein vorgeschobener Physikstart, kein Kunstboden, keine neue Welt/Renderer/Simulation. Ein Zwischenversuch nutzte fälschlich react-dom; separat erhalten, keine Performance-Freigabe daraus abgeleitet.

Laufzeitpfade: src/m2/M2Car.jsx, neues src/m2/loadTimeline.js, src/world/terrainSupport.js, src/world/EndlessDrive.jsx, src/m1/M1World.jsx. terrainStart.js und endlessTerrain.js unverändert. Unprofilierte Modelle behalten asynchrones setModel, ihre Rig-Anbindung läuft nun vor Paint; vollständige Abnahme aller Modelle bleibt offen.

## Tatsächliche Messung

640×480Browser/640×360Spiel, q=fast, gleicher Hash/seed20261014, vorhandener M1CLOCK; Zustandswechsel und mindestens zwei Spielsekunden plus Räderkontakt pro Fall. Keine Browser-/Assetcache-Löschung: frischer Dokumentstart, kein Kalt-Festplattentest.

| Wagen | Kalt-Ruf Basis→Kandidat s | Fernteleport s | Rückkehr s |
|---|---:|---:|---:|
| Rennwagen |25,06→19,33|6,41→2,85|1,77→1,98|
| Dieselpunk |11,54→16,70|3,54→2,88|3,82→1,16|

Kompletter Dokumentstart→User-ready im Kandidaten29,59s/25,21s. Frühe Terraininitialisierung, LoadLog und Szene-/Compilezeiten separat erhalten. Kalte Modell-/Figur-/Szenenladung bleibt wesentlich.

Spieltakte Basis→Kandidat: Rennwagen kalt0,273→0,251, fern0,205→0,345, zurück0,517→0,337; Diesel kalt0,316→0,267, fern0,367→0,329, zurück0,244→0,519. Gleichmäßige2Spielsekunden-Bodenphasen ebenfalls roh protokolliert. Rechner wurde parallel durch Grafikarbeit belastet. **Keine pauschale kausale Zeit-/FPS-Freigabe:** Vireo-Rückkehr und Diesel-Kaltstart nicht verbessert, Fernteleports nicht<2s. Der entfernte Commit-Aufschub ist innerhalb desselben Spielschritts belegt.

## Tests

- [CI44143624264](https://github.com/georg-doc/KFB-Stunt-Car-Race/actions/runs/44143624264), Job134252906103: **164/164 grün**,0bekannt rot,0Rückfall, am exakten Laufzeit-Code f4d5d864.
- Native: Timeline9/9, TerrainStart11/11, TerrainLoad7/7, Profile11/11, gemeinsame Straßen10/10.
- Finaler Browser: beide Wagen jeweils Kaltstart/Fernteleport/Rückkehr, **6/6 PASS**; ein Wagenkörper,0Bodenverletzungen/Windowfehler, am Ende jedes Falls4Räder am Boden.
- Mehrdatei-Build KFB_SPLIT=1 grün,18,13s. **Standard-Einzeldatei-Build rot:** nach3797Modulen Rust/NAPI-string-Konvertierung im Paketierer. Logs in Return; weder abgeschaltet noch als bereits bekannte Altlast ausgegeben.
- Portabler Server test/load-pipeline-r02-server.mjs: Syntax und GET-Metadaten geprüft. Browser: /test/load-pipeline-r02.html. KFB_LOAD_VARIANT bestimmt nur Ablage, niemals die geladene Implementierung.
- Optionale game-dev-CLI schon nicht vorhanden; native/realer Browser-Fallback, keine sealed-/GPU-Zertifizierung.

## Ein nächstes Gate

Kontrollierte WS0-Vorher-/Nachher-Messung auf der gemeinsamen Abnahmefläche mit gleichem Szenario, beiden Wagen und Spieltakt. Kaltstart, warmes<2s-Ziel und Einzeldatei-Paket offen halten; erst danach R03Wasser. Main wurde zum Vergleich eingefroren; zuletzt separat beobachteter Main **af9e3203ef9ec438a2c8e4873c5d7528747e9a54** hat seit1fb9f534 Lauf-/VFX- und Audioarbeit (2Commits); diese nicht in den Vergleich gemischt. M1World-Anschluss beim Aufnehmen prüfen.

Keine neue öffentliche Route erforderlich oder veröffentlicht. Private Racer-SiteVersion16 unverändert, PR134Boost/Licht separat. Kein zentraler Hub-Router/Live-Eintrag verändert.
