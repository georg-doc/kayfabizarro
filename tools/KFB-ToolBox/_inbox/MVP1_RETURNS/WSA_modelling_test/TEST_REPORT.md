# TEST_REPORT · WSA Modelling Test R1 · KFB Town Castle Clay Stairs

Stand: 2026-10-10  
Basis: `georg-doc/kayfabizarro@3c42bf76364f8875cf1a63768fadfb570b6c3ff5`  
Lieferbranch: `wsa/kfb-modelling-test-stairs-2026-10-10`  
PR: keiner (laut Briefing)

## Ergebnis

Die Treppe ist als eigenständiges, y-up GLB mit fünf großen Knetformen umgesetzt. Die Pflichtansichten 01–05 liegen in 1600 × 1000 px vor. Vier zusätzliche QA-Ansichten dokumentieren Unterbau und Mauerenden. Der technische Selbstcheck Q1–Q9 ist abgeschlossen; der blinde externe Stilentscheid bleibt ausdrücklich bei der Steering-Session.

## Lieferumfang

- `KFB_TOWN_CASTLE_CLAY_STAIRS_R1.glb` — Runtime-Asset
- `renders/01_frontal.jpg`
- `renders/02_three_quarter_top.jpg`
- `renders/03_side.jpg`
- `renders/04_eye_1H_at_foot.jpg`
- `renders/05_connection_stair_hill.jpg`
- `renders/06_low_support.jpg` — zusätzliche QA-Ansicht
- `renders/07_left_end.jpg` — zusätzliche QA-Ansicht
- `renders/08_right_end.jpg` — zusätzliche QA-Ansicht
- `renders/09_upper_landing.jpg` — zusätzliche QA-Ansicht
- `SOURCE_FIRST.md` — Vorlagenprüfung und Neubauentscheidung
- `source_lineup.jpg`, `source_metrics.json` — isolierte Quellenprüfung
- `qcheck.json` — messbarer Q1–Q9-Nachweis
- `export_validation.json` — unabhängiger Clean-Scene-Reimport
- `build_metrics.json` — kompakte Build-Metriken
- `build_stairs.py` — reproduzierbarer Blender-Build

Die `.blend`-Arbeitsdatei ist bewusst nicht Teil der Git-Lieferung; das Runtime-GLB und der reproduzierbare Build sind die maßgeblichen Artefakte.

## Vorlage zuerst

Vor dem Neubau wurden vier bestätigte Donor-Assets isoliert geprüft: KayKit `stairs_walled.gltf` und `stairs_wide.gltf` als primäre Lesbarkeits-/Proportionsquellen; Kenney `stairs-stone.glb` und `wall-narrow-stairs.glb` als sekundäre Kontrolle. Die drei bestätigten KFB-Konzeptbilder dienten ausschließlich als Stilrichtung. Details, Pfade und Entscheidungen stehen in `SOURCE_FIRST.md`.

Übernommen wurden klare Begehbarkeit, breite Tritte, flankierende Wangen und gebaute Enden. Neu gebaut wurden eine durchgehende Treppen-/Podestform, zwei durchgehende Wangen und zwei weiche End-/Antrittskörper. Keine Kugel-/Box-Cluster, keine wiederholten Einzelsteine.

## Technische Abnahme

| Prüffeld | Ergebnis |
|---|---:|
| GLB-Dateigröße | 250.328 Byte |
| SHA-256 | `5dc83f19beb8b8ba6b20b3b7ae1d19c6a39b8b80045cda14376ae462e4729151` |
| Große Knetformen / Meshes | 5 |
| Dreiecke | 4.568 / 20.000 |
| Export-Ausrichtung | y-up (glTF/GLB) |
| Breite | 10,92 lab = 3 H |
| Steigungen | 0,59–0,68 lab (Ziel 0,55–0,73) |
| tatsächliche Mindest-Auftrittstiefe | 1,6024 lab (Minimum 1,456) |
| Podesttiefe | 4,00 lab (Minimum 3,64) |
| Wange über Stufe | 1,84 lab (Ziel ca. 1,82) |
| Pflicht-Renderauflösung | 1600 × 1000 |
| Clean-Scene-Reimport | erfolgreich |
| Kameras/Lichter im GLB | 0 / 0 |

Hinweis: Der Clean-Scene-Reimport kann durch glTF-Vertex-Splitting eine höhere Vertexzahl melden als die Blender-Quellmeshes; die Dreieckszahl bleibt mit 4.568 identisch und ist die relevante Budgetmetrik.

## Q1–Q9

- Q1 nichts schwebt: **bestanden** — maximale Support-Lücke 0 H.
- Q2 keine Mauerwerkslücken: **nicht anwendbar** — monolithische Knetformen, kein Steinverband.
- Q3 keine unbeabsichtigten sichtbaren Überschneidungen: **bestanden** — nur kontrollierte Einbettung bis 0,022 H.
- Q4 Bauteilgeometrie: **bestanden** — kontrollierte Maßabweichung 7,09 %, Mindesttritt 1,6024 lab.
- Q5 keine harten Übergangskanten: **bestanden** — weich gefaste Übergänge, keine als Fehler markierte Übergangskante.
- Q6 Anschluss: **bestanden** — Höhenversatz 0 H, Lücke 0 H.
- Q7 keine Platzhalter: **bestanden** — Export enthält nur die fünf Asset-Meshes. Render-Kontext ist ausgeschlossen.
- Q8 keine terrain-geschnittenen Einzelsteine: **nicht anwendbar** — keine Einzelsteinlage.
- Q9 gebaute Mauerenden: **bestanden** — geschlossene Geometrie; 0 offene/nicht-manifold Kanten.

## Iterationen und Stop-Regel

1. Erstbau: technisch funktionsfähig, visuell noch zu sauber/CAD-artig; zwei QA-Kameras teilweise verdeckt.
2. Reparaturrunde 1: sichtbare Handform-Abweichung, weichere Endkörper, isolierte Pflichtansichten und überarbeitete Kameras.
3. Reparaturrunde 2: größere Tritte, stärkere kontrollierte Schrägen und korrigierte Sichtbarkeit der Anschlusskamera.

Danach wurde gemäß Vorgabe gestoppt. Es gab keine dritte Reparaturrunde.

## Offene Qualitätsnotizen

- Die zusätzliche Ansicht `09_upper_landing.jpg` ist zu eng kadriert und als Übersichtsbeleg schwach. Sie bleibt als ehrliche Zusatzaufnahme enthalten; die geforderte Anschlussansicht ist `05_connection_stair_hill.jpg`.
- Der Stil ist bewusst auf wenige große, ruhige Clay-Massen reduziert. Ob die KFB-Nähe gegenüber den Konzeptreferenzen den Passwert erreicht, muss der externe Blind Critic bewerten.
- Es wird kein Gesamt-„Pass“ behauptet. Maß- und Exportchecks sind bestanden; das finale Stilurteil ist ausstehend.

## Werkzeuge und Provenienz

- Blender 5.2.2 LTS, headless, Eevee-Render und glTF-Exporter
- lokales Python-Buildskript, keine externe Asset-Generierung
- kein kostenpflichtiger Provider, kein Bild-zu-3D-Dienst
- `game-dev`-CLI war in der Umgebung nicht verfügbar; deshalb wurden Quellenprüfung, Build, Render und Clean-Scene-Reimport direkt mit Blender durchgeführt

## Externer Critic

Der Critic wird laut Update von der Steering-Session gestartet. Erwartete Scorecard: sieben Kriterien, je 0–10; Pass nur bei Mittelwert ≥ 8 und keinem Einzelwert < 6. Dieses Dokument setzt diese Bewertung nicht vorweg.
