# RETURN · KFB UFO Tractor Beam Event Lab · V1 · 2026-10-06 · r2 2026-10-07

> **r2 (07.10.2026):** Beam überarbeitet nach Georgs Review. Kegel statt Zylinder, Emitter im Rumpf, LOCK-Ring, innerer Beam und Torus-Puff entfernt, Kenney-Beam mit einer Hülle. Details: `CHANGELOG.md`, Belege `screens/r2/`, Übergabe `HANDOVER_WSA_2026-10-07.md`, Vertrag `EVENT_CONTRACT.json`. Mit „r1“ markierte Zeilen unten sind überholt.

**ISOLIERTER BEWEIS · KEINE OPEN-WORLD-WRITES · KEINE PERSISTENZ · KEIN MERGE · KEINE LIVE-PROMOTION**

Datei: `KFB UFO Tractor Beam Event Lab.dc.html` + `ufo-event-lab/ufo-lab.js`, `ufo-event-lab/ufo-audio.js`
Gelesen: main @ `d04e0b8f2c2c34e9176f7eb75a77f19487d17698` (nur gelesen, nichts gepusht)

## 1 · Gewählte UFO-Quelle + Pin
**Rick's UFO by eeee** (Georgs Wahl, 06.10.2026)
- `media/3D_Assets/KFB/ricks ufo by eeee - q6vNUoHZXr.glb`
- commit `276728f3f82f729cd1656b61e81d278856d736bb` · blob `4e338d000ab07fd791f5f25ed348a10ec146a097`
- gemessen: 25.851 Tris · 32 Meshes · 32 Materialien · 0 Clips · 1.146 KB · Quell-BBox 0,09 × 0,05 × 0,09 (sehr kleine Quelleinheit, im Lab auf 7 m Breite normiert)
- Laufzeitladung über jsDelivr @ Pin, Fallback raw.githubusercontent @ Pin. Keine Kopie im Projekt.
- Ausrichtung Y-up passt ohne Korrektur (Kuppel oben, Öffnung unten).

## 2 · Alternativen (isoliert, umschaltbar)
Kenney Tower Defense Kit @ `378b209355b13304e3cff656ec0806ca5b89df28`, `Models/GLB format/`

| Quelle | Tris | Mesh/Mat | Rolle |
|---|---|---|---|
| enemy-ufo-a.glb | 520 | 1/1 | Alternative |
| enemy-ufo-b.glb | 472 | 1/1 | Alternative |
| enemy-ufo-c.glb | 440 | 1/1 | Alternative |
| enemy-ufo-d.glb | 584 | 1/1 | Alternative |

Kenney A–D lesen sofort als Spielzeug-Untertasse und sind sehr leicht. Rick's UFO hat mehr Charakter (Cockpit-Kuppel, Seitentriebwerke, Rumpfstreifen) und passt besser zu Hunky & Dory. Alle fünf laufen durch dieselbe Event-Grammatik: das UFO-Rig wird nur ausgetauscht (`setUfo`). Damit ist die Anforderung „später verschiedene 3D-Modelle“ schon vorbereitet.

## 3 · Beam-Donor
- `enemy-ufo-beam.glb` (56 Tris) und `enemy-ufo-beam-burst.glb` (72 Tris), isoliert gezeigt.
- Im Event als Option „Kenney-Mesh“ einsetzbar, skaliert auf Zielgröße (Screen 18). Die eigenen Materialien sind lila und deckend, deshalb nicht der Standard.
- Standard ist ein eigener Shader-Kegel: offen, Radius oben = Öffnung, Radius unten = Zielgröße, Fresnel-Rand, aufwärts laufende Bänder, leichter Drall, vorlaufende Kante beim Aufladen, vormultipliziertes Alpha statt additivem Neon.

## 4 · Visuelle Sequenz + Parameter
Das ganze Event ist eine reine Funktion der Zeit t: es lässt sich frei scrubben, ist geseedet und hat kein Zufallsflimmern pro Frame.

```
ARRIVE 2.6 s → HOVER 1.1 → LOCK 0.9 → CHARGE 1.1 → DEMAT Dd/2 → TRANSFER Dd/2 + 1.2·Ft
→ COMPLETE 1.0 → [RETURN 0.35 + 0.6 + Dd + 1.2·Ft + 0.8] → DEPART 2.4
```

| | Prop | Resident/Pet | Burg |
|---|---|---|---|
| Dematerialisierung Dd | 1.5 s | 1.9 s | 3.6 s |
| Partikel-Flugzeit Ft | 0.95 s | 1.15 s | 1.7 s |
| Partikel (Dichte 1.0) | 520 | 860 | 3.400 |
| Partikelgröße | 0.055–0.11 m | 0.065–0.13 m | 0.2–0.44 m |
| Schwebehöhe über Ziel | 4.4 m | 4.8 m | 5.5 m |
| Anheben beim Zug | 1.0 m | 0.75 m | 0.3 m |
| Drall (Umdrehungen) | 1.3 | 1.15 | 0.75 |
| Beam-Fuß (r2) | 2.5 m | 2.6 m | 16.1 m |
| Gesamtdauer (Rückgabe) | 16.1 s | 17.4 s | 22.1 s |

Feste Werte: UFO-Breite 7 m bei allen Zielen (das ist der Witz: die Burg passt hinein), Emitter-Radius 0.6 m (r1: Öffnung 1.4 m).

Grammatik:
- **Lock:** ~~r1: Zielring schrumpft von 2.4·R auf den Fußabdruck.~~ r2: Der Emitter unter dem UFO glüht auf und pulsiert. Das UFO duckt sich und staucht, das Ziel zuckt und hüpft (Prop/Pet).
- **Charge:** Die Strahlspitze wächst nach unten (ease-out), die Lichtpfütze kommt erst bei ≥ 85 % Reichweite.
- **Breakup:** Der Schwellwert pro Fragment ist `(1−Höhe)·0.6 + (1−Radius)·0.12 + Rauschen·0.28`. Die Spitze und die Ränder lösen sich zuerst. Die Kante leuchtet als Übergangsrand in Beam-Farbe. Der Schatten löst sich mit auf (eigenes Depth-Material).
- **Partikel:** Stichproben auf der echten Proxy-Oberfläche, Farbe = Teilfarbe, 16 % größere Brocken. Jedes Partikel startet, sobald die Front seinen Schwellwert passiert. Es macht einen kurzen Pop entlang der Normale und läuft dann als Trichter mit Drall in die Öffnung. Dabei dehnt es sich (Knet im Sog), schrumpft und färbt sich zur Beam-Farbe.
- ~~**Verengung** (r1): Ab 50 % Fortschritt zieht sich der Strahlfuß auf die Öffnungsbreite zusammen.~~ r2: entfernt, der Kegel bleibt.
- **Complete:** Der Strahl fährt von unten ein, das UFO „schluckt“ (gedämpfte Stauchung), ~~ein Puff-Ring läuft an der Öffnung aus~~ (r1). r2: Der Emitter blitzt kurz und schließt.
- **Return:** exakt die umgekehrte Zeitfunktion, danach ein Knet-Pop mit Überschwingen.
- **Depart:** Ducken, dann beschleunigter Abflug mit Neigung und Streckung.

## 5 · Klein / mittel / riesig
Alle drei Zielklassen durchlaufen dieselbe Grammatik mit anderen Zahlen. Die Burg (17 m hoch, Fußabdruck-Radius 12,8 m) wird sichtbar in dasselbe 7-m-UFO komprimiert (Screens 13–16). Alle Ziele sind **Proxies** aus Knet-Primitiven, keine Quell-Assets.

## 6 · Audio: Shortlist + Event-Map
Pool = genau die Shortlist (55 Dateien) @ `d04e0b8`. Die Map ist ein **Vorschlag, nicht per Gehör vorgehört.** Ich kann nicht hören. Das Lab misst deshalb jede Datei (Dauer, Peak, RMS, Tonhöhentendenz über Nulldurchgänge, Wellenform). Pro Event gibt es „gehört ✓“ und einen JSON-Export.

| Hook | Haupt | Layer | Gain (Vorschlag) |
|---|---|---|---|
| ufo.arrive | whoosh_1.wav @0.85 | — | 0.55 |
| ufo.hover | white_noise_long.wav, Loop, Tiefpass 380 Hz | — | 0.10 |
| beam.lock | lowThreeTone.ogg | — | 0.5 |
| beam.charge | phaserUp3.ogg | — | 0.5 |
| beam.transfer.start | phaseJump2.ogg | — | 0.55 |
| beam.transfer.loop | white_noise_long.wav, Loop, Bandpass 500→2400 Hz | — | 0.14 |
| beam.transfer.complete | zapTwoTone.ogg | air_burst.wav | 0.5 |
| ufo.drop | phaserDown2.ogg | elastic_twang.wav (beim Pop) | 0.5 |
| ufo.depart | phaserUp6.ogg | whoosh_2.wav | 0.45 |

Stille vor dem Strahl: Das Schwebe-Bett blendet ab 55 % von LOCK aus und kommt erst nach COMPLETE wieder.
Vorerst nicht gewählt: powerUp* (zu „Item eingesammelt“), hydraulic_* (eher Mechanik als Strahl), spaceTrash* (für das Abwerfen absurder Fracht in V2 reserviert), razor_buzz/drill_whizz (zu aggressiv als Bett).
Ein einziger AudioContext nur für die Vorschau. Kein Mixer, kein Anspruch auf Runtime-Routing.

## 7 · Belege
`ufo-event-lab/screens/`: 00 Kontaktbogen · 01 Quellen isoliert · 02–10 Pet: Anflug, Lock, Aufladen, Dematerialisieren, Transfer, Schlucken, Rückgabe, Pop, Abflug · 11–12 Prop · 13–16 Burg · 17 Kenney UFO A im selben Event · 18 Kenney-Beam-Mesh

## 8 · Geänderte Dateien
Neu: `KFB UFO Tractor Beam Event Lab.dc.html`, `ufo-event-lab/ufo-lab.js`, `ufo-event-lab/ufo-audio.js`, `ufo-event-lab/RETURN.md`, `ufo-event-lab/screens/*`
Geändert: `ufo-event-lab/BRIEF.md`, `BACKLOG.md`, `github.md`
Unberührt: Open World / PR #348, Seed World POC, `vfx-grammar/`, Registry, Runtime

## 9 · Offen
1. Audio-Map nicht per Gehör abgenommen. Georg hört vor und setzt „gehört ✓“.
2. Etherington-Portalreferenzen sind nicht gepinnt. Der Übergangsrand ist nur funktional umgesetzt (Silhouettenbruch, Rand, gerichteter Transfer), es wird keine Quelle beansprucht.
3. Der Clay-Look ist ein Stand-in (MeshStandard matt). Der K2-Owner `clay-material.v10.js` wurde nicht konsumiert, wie schon in der Seed World.
4. Die Ziele sind Proxies. Echte Resident-/Cube-Pet-/Burg-Assets kommen erst nach einem Source-Isolation-Gate.
5. Rick's UFO: 32 Materialien bedeuten 32 Draw Calls für ein einzelnes Objekt. Für Runtime-Zwecke zum Zusammenführen vormerken.
6. Rick's UFO hat keine Clips. Drehung und Schweben sind prozedural. Die Eigendrehung von 0,6 rad/s ist bei einem UFO mit Cockpit-Front Geschmackssache.
7. fps in einem sichtbaren Top-Level-Tab nicht gemessen. Die Burg erzeugt bis zu 3.400 Instanzen, 2 Draw Calls.
8. Die Lizenz bzw. Herkunft von „ricks ufo by eeee“ (Sketchfab-ID) ist im Lab nicht geprüft.
9. Kein Abwurf absurder Fracht (V2) und keine Zustände wie „Ziel nicht verfügbar“ oder „transferiert“. Die entscheidet der Architecture Freeze.

## 10 · Genau ein nächstes Gate
**Georg öffnet das Lab in einem Top-Level-Tab, spielt Pet und Burg mit Ton durch, hört die neun Events vor und antwortet: PASS / TUNE / FAIL (+ exportierte Event-Map).**
Bei PASS: Danach kommt die Coworker-RETURN-Datei → Work/WSA Architecture Freeze → ein expliziter UFO-Integrations-Slice, inklusive der Entscheidung, ob der Destruction Beam (siehe BRIEF.md · Ausblick) dieselbe Rig-/Beam-/Partikel-Schicht nutzt.
