# RETURN · SKY1 · Skydome + Environment (E0–E4)

Rückgabe an KFB Production Control. Claude Design hat nichts nach GitHub geschrieben und keine Stage promotet.
`/kfb-hub/stage/modules/spindle-sky-v1/` bleibt **PLANNED · NOT DEPLOYED · NOT LIVE**.

## Quellen (gelesen, gepinnt)

- SSOT: `KFB_SKYDOME_ENVIRONMENT_SSOT_WIP.md`, `KFB_CLAYMATION_STYLE_SSOT.md`, `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md` — Draft PR #301 (`refs/pull/301/head`), nicht auf `main`.
- Travel-Globe `8614282aab2c`, `travel/globe-v13/`: `sky-presets` 04dd730 · `day-night` f5386ac · `sky-atmosphere` 1fae8d4 · `lens-flare` c3d9d14 · `rain-overlay` 679defc · `starfield` e29272e · `weltstimmungen` 2747a52 — byte-gleich kopiert. Nicht eingebunden: `sun-shadow`, `light-budget` (siehe NOT_TESTED).
- Travel Skydome `919ed27bb4ab` (`travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js`), byte-gleich.
- Combat-Arena `735b5449bf09`: `himmel.v4.js`, `spindel.v4.js`, `skydome-shader.v4.js`, `SKY_01_SPINDLE_MODULE.md` — byte-gleich, keine Zeile geändert.
- Donor: `media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb`, Git-Blob `acd9d653f31f249d0bcf11a8b6311594a9d6e153`, 201 576 B. Per SHA-1 im Browser gegen den Pin geprüft (Projektkopie und RAW @main), Abweichung → `SOURCE_REQUIRED`.
- Nicht übernommen: `tinyskies`-TS-Quellen (die gepinnten Travel-Module sind deren Port).

## Dateien (neu, alles Weitere unberührt)

- `lab-sky/env-host.v1.js` — EnvironmentHost
- `lab-sky/cloud-family.v1.js` — Donor-Loader, Lappen-Analyse, Clay-Familie, Instancing-Feld
- `lab-sky/spindle-sky.v1.js` — `kfb.environment.spindle-sky/0.1-candidate`
- `lab-sky/sky-gates.v1.js` + `KFB Skydome Gates SKY1.dc.html` — E0–E3
- `lab-hex/hex-island.v5.js` + `KFB Hex-Kosmos HX1 Sky.dc.html` — E4 (Kopie von HX1 v2 mit sechs Haken; v2 und `KFB Hex-Kosmos HX1.dc.html` unverändert)
- Bilder: `screenshots/sky1/`

## Befund am Donor (gemessen)

1 Node, 1 Mesh, 1 Primitive, 1 Material (`mat21`), 7 476 Vertices, 3 452 △, Attribute nur `position`, `normal`. Nach Positions-Verschweißung **18 getrennte Schalen** (16 × 192 △, 2 × 190 △), je ein gestauchtes Ellipsoid, überlappend. Sie bilden **drei Wolken** (6, 7 und 5 Lappen; die dritte ist klein und tief). Die Schalen sind die Lappen der Familie.

## Wolkenfamilie `kfb.sky.cloud-family/1`

- V0–V2 = die drei Donor-Wolken (Identität, zentriert, Breite 1). V3–V5 = Rekombination: eine Donor-Wolke, 0–2 Lappen weniger, 1–2 geliehene Lappen einer anderen Donor-Wolke, Lappen-Versatz ≤ 22 % Radius, Squash/Stretch 0,82–1,3, Spiegelung. Überlappung (≥ 15 %) und Unterseite werden geprüft.
- LOD: near = Donor-Dreiecke, K1-Vorstufe `clay-soften.v1` (eine Stufe), 4,6–5,4 k △ je Variante · mid = ein Ellipsoid je Lappen, aus den umgesetzten Lappen gefittet (0,8–1,3 k △) · far = die 8 größten Lappen (0,3–0,5 k △).
- Material: `clay-material.v10`, Profil `cloud`, Toolmix `cloud`, QUIET wie HX1; eigene Uniformen im Wolkenmaß (Hand 0,16 / Tile 0,55 / Print 1,4 im Objektraum ≈ 1 Wolkenbreite). Kontakt-AO als Vertexfarbe zwischen den Lappen und an der Unterseite (AO an/aus schaltbar).
- Instancing: 6 Varianten × 3 LOD = 18 geteilte Geometrien, Variation über Saat und Instanzmatrix, LOD nach Entfernung/Wolkenbreite, stabile Saat.
- Status laut SSOT: **TUNE** bis Georg das erste Bild abnimmt. Kein Golden-Anspruch.

## Gates

- **E0 MATCH-fähig, Abnahme offen**: TinySkies-Stack (Gradient, Sterne, Aurora, God Rays, Flare, Regen) und unveränderter Donor in Front, Seite, 3/4, Oben, Unten; Inventar im Panel; Drahtgitter und Lappenfärbung (Klon, Donor bleibt unverändert).
- **E1**: Travel Skydome prozedural S/A/Space und statisch (Aquarell, Nacht). Der Dom folgt der Kamera (`followsCamera` wahr). Die Nahtprobe misst Spaltensprünge am Horizont (Knopf im Gate); Werte stehen nicht in diesem Return, weil der Lauf nicht abgeschlossen wurde.
- **E2**: Combat-Spindel aus den echten Donoren: sechs echte KFB-Karten (Deck `forget_utopia`, Karten 1–6, Seite 2–3, Viertel Q0–Q3/Q0–Q1, per `card-art-2d`-Vertrag aus dem Deck-PDF), Trichter unten, Kuppel oben, See Wirbel/Lava. Boden C29: 30 Strahlen, 0 fehl oben, 0 fehl unten, 0 jenseits far 120, max 79,9 u. Keine Rekonstruktion.
- **E3**: Lebenszyklus ×10: C29 in allen Zyklen bestanden, Δ Objekte 0, Materialien 0, Geometrien 0, GPU-Geometrien 0, GPU-Texturen 0. Schalen-Leak ×10 (TinySkies → Travel → Spindel → TinySkies): Δ alles 0.
- **E4** (HX1 Sky): Hot-Switch TinySkies → Travel → Spindel → TinySkies; Day/Evening/Night/Auto (Auto: Phase 0,18 → 0,303 in 4 s bei 0,2 min je Tag); Clear/Rain (Regen aus `rain-overlay`, Aurora ×(1 − 0,8·Regen), God Rays ×(1 − 0,85·Regen)); Aurora nachts, God Rays tags; Lens Flare aus der Host-Sonne (Deckung 0,25 bei Blick zur Sonne); 12 Wolken in der Insel-/Track-Szene.
  - Leak ×10 in HX1: Δ Objekte/Materialien/Geometrien/Lichter/GPU = 0. Shader-Programme +11 im ersten Lauf (einmaliges Kompilieren der Schalen), im zweiten Lauf 0.

## Messwerte E4 (Vorschau, nicht Georgs Gerät; ganze HX1-Szene mit AO, gleiche Kamera `Kosmos`)

Median aus 3 Läufen, Reihenfolge rotiert.

- 0 Wolken: 5 390 549 △ · 710 Calls · 98 Materialien · 46 ms
- 4 Wolken: 5 395 797 △ · 716 Calls · 99 Mat. · 41 ms · Wolkenanteil 2 624 △ / 3 Calls · LOD 0/1/3
- 12 Wolken: 5 402 197 △ · 722 Calls · 99 Mat. · 77 ms · Wolkenanteil 5 824 △ / 6 Calls · LOD 0/1/11
- 24 Wolken: 5 416 869 △ · 730 Calls · 99 Mat. · 59 ms · Wolkenanteil 13 160 △ / 10 Calls · LOD 0/5/19

Standalone (E3, nur Himmel und Wolken): 0 → 66 △/5 Calls · 4 → 3 314/8 · 12 → 6 514/12 · 24 → 13 978/15; 0,3–2,6 ms je Bild. Ein Gate-Lauf mit 24 Wolken ausschließlich in LOD near ist in der Bank eingebaut (Knopf `0/4/12/24 messen`, letzte Zeile), dessen Zahl liegt nicht im Return.

## Defekte und offene Punkte

1. **Frame-Zeit bei 12 Wolken**: 77 ms gegen 46 ms ohne Wolken, bei nur +5,8 k △. Mit unsichtbarer Wolkengruppe (gleicher Zustand) fällt die Zeit auf 44 ms zurück — es sind also die gezeichneten Wolken, nicht der Zustand. Ursache nicht isoliert (Verdacht: Füllrate der großen Wolke am Bildrand im Clay-Material, dazu die zweite Zeichnung im GTAO-Pass). Ein Ersatzmaterial-Test blieb unvollständig. 24 Wolken sind schneller als 12: der Wert hängt an der Bildabdeckung, nicht an der Anzahl.
2. **Day ≠ HX1-Stand**: Presets liefern Sonnenfarbe `#fff0d0` (HX1 `#fff4e6`), Hemisphäre `#80ccdd/#66aa44` (HX1 `#eef4fa/#9a8a78`) und den Nebel `#60ccde` (vorher Weltfarbe). Intensitäten sind auf HX1 skaliert (2,9 / 1,05 / 0,6). Die Weltfarbe `WORLDS.*.sky` schreibt nicht mehr in Himmel und Nebel.
3. **Nacht**: ohne Umgebungslicht fielen Inseln und Wolken auf schwarze Scherenschnitte. Ein echtes Ambient-Licht aus der Preset-Zeile `amb` (Faktor 3,2 · (1 − Tagesgewicht)) macht sie lesbar; Day bleibt unverändert. Der Faktor ist gesetzt, nicht gemessen.
4. **Sonne bewegt sich nicht**: `day-night` ändert Farbe und Intensität, nicht die Richtung. Abend und Nacht haben dieselbe Sonnenrichtung wie der Tag.
5. **Sterne**: die Punktgröße im Starfield-Shader (`aSize·300/Entfernung`) wurde zur Laufzeit mit dem Hostmaßstab k multipliziert, sonst unter einem Pixel. Aurora und God Rays: nur Gruppenskalierung.
6. **Spindel im Host**: der Donor misst in Weltkoordinaten; die Hülle normalisiert die Gruppe für die Messung und schaltet die interne Zwei-Sekunden-Messung ab (`_messZeit`, privates Feld des Donors).
7. **Kartenbild** kommt zur Laufzeit aus dem PDF via pdf.js (CDN) und `media/kfb/index.json`; offline gibt es `SOURCE_REQUIRED`, kein Ersatzbild.
8. **Nicht getestet (NOT_TESTED)**: `sun-shadow` (HX1 behält seinen Schatten), `light-budget` (nicht eingebunden), Nahtprobe E1 (Knopf vorhanden, Lauf offen), Messung in Georgs Browser, Mobil.
9. `resource_error: SCRIPT failed to load` steht einmal in der Konsole; die Gates laufen. Quelle nicht ermittelt.

## EnvironmentHost · Signale

Eingang: `update(dt)` aus genau einer Schleife des Wirts. `setTime(day|evening|night|auto)`, `setWeather(clear|rain)`, `setShell(tiny|travel|spindle)`, `setMood(verdant|molten|frost|bone)`.
Ausgang (`probe()`): `clock`, `night`, `day`, `weather`, `rain`, `shell`, `opaqueShells` (soll ≤ 1), `fog {near, far, color}`, `sun {intensity, color, dir}`, `aurora`, `godrays` (+ Spitze), `flare` (Deckung, Ort), `rainStreaks`, `footprint()` (Objekte, Materialien, Geometrien, Lichter, GPU, Programme), `leakTest(n)`.
Schreiber: Hintergrund, Nebel, Lichter, Sterne — nur `day-night`; Aurora, God Rays, Flare, Regen — nur der Host aus `nachtGewicht`/`tagGewicht`.

## Schalen-Lebenszyklus

`mount(parent, {cards, scale})` · `setPreset({see, oben, groesse})` · `setPalette({heiss, glut})` · `follow(camera)` · `update(dt, {brightness})` · `probe()` · `dispose()`. Der Test oben dispost 10 ×, ohne Leck.

## Nachtrag SKY2 (01.10., Georgs Rückmeldung: Wolken zu eckig, Knete fehlt · Planeten · UI · Spindel-Spitzen)

Neue Fassungen daneben, v1-Dateien und HX1 unverändert: `lab-sky/cloud-family.v2.js`, `planets.v1.js`, `spindle-sky.v2.js`, `env-host.v2.js`, `sky-gates.v2.js`, `KFB Skydome Gates SKY2.dc.html`. Bilder: `screenshots/sky1/sky2-*`.

- **Wolken v2 `kfb.sky.cloud-family/2-clay` (TUNE)**. Befund v1: near = 18 getrennte 192-△-Hüllen, Vorstufe mit maxEdge 0,001 rundete kaum, Material lief mit QUIET (Abdruck 0,3, Druckstelle 0). v2: dieselben 18 Donor-Lappen (Spec aus v1) als ein geschlossenes Stück: Abstandsfeld je Ellipsoid → smin k 0,022 (Kehle) → flache Unterseite → Beulen → Surface Nets → Newton-Projektion, Normale = Feldgradient. Kehlen-AO aus dem Feld. Profil `cloud` ungedämpft, Hand 0,2 / Kachel 0,64 / Abdruck 1,8 je Wolkenbreite (Golden-Verhältnis 0,5 : 1,6 : 4,5). E0 zeigt Donor | Kandidat bei gleicher Kamera. Erster Lauf mit k 0,055 las als Kartoffel (Lappen verschmolzen) → k 0,022.
- **Messung Standalone (Vorschau, gl.finish, gleiche Kamera)**: 24 Wolken gemischte LOD v1 5,7 ms / 14 k △ · v2 6,7 ms / 24 k △. Alle near: v1 11,8 ms / 118 k △ · v2 17,8 ms / 323 k △. v2 ist **teurer**, nicht billiger; die Vermutung »weniger Überzeichnung« hat sich nicht bestätigt. LOD v2: 56 / 24 / 12 Zellen je Breite = 10–20 k / 1,8–3,5 k / 0,4–0,8 k △. Der 77-ms-Befund in HX1 ist mit v2 nicht neu gemessen.
- **Planeten**: Quaternius Ultimate Space Kit, `Environment/GLTF/Planet_1–11.gltf` (CC0, in der Registry geführt, Ordneransicht zeigt sie nicht; per Bytes geprüft, Git-Blob je Datei im Panel). Schicht `sky-planets` gehört dem Host, folgt der Kamera, kein eigenes Licht. Modi Aus/Original/Knete, 3 oder 6 Planeten auf festen Himmelsplätzen (Setzung). Gate `P` zeigt alle 11 Original über Knete.
- **Spindel-Spitzen**: Polkappe je Spitze auf derselben Ellipsoidfläche, planar abgebildet (polfrei): Rosette aus den sechs Motiven, Tuschringe, Okulus oben, Kragen am See unten, Tuschrahmen am Rand. Opaker Durchgang, renderOrder −799, wie die Donoren ohne Tiefentest. A/B-Schalter im Gate. Lebenszyklus ×10 und Schalen-Leak ×4 mit Kappen: Δ alles 0, C29 bestanden.
- **UI**: Kopfleiste scrollt waagerecht, rechts Symbole für Paletten (Stimmung, Wolken, Planeten, Polkappen), Messwerte, Details und Nur Ansicht (Escape). Alles standardmäßig aus; Details schwebt als Inspektor rechts (Resident-Atlas-Muster), Werkzeugleiste unten scrollt.
- Offen: Himmelswolken sind nachts fast unsichtbar (Farbe aus dem Host); Knete der Planeten ist schwach sichtbar; HX1 Sky nutzt weiter v1.

## Nachtrag SKY3 (01.10., Georg 13:07)

Neu daneben: `lab-sky/cloud-family.v3.js`, `spindle-sky.v5.js` (Vertrag 0.3-candidate), `env-host.v3.js`, `sky-gates.v3.js`, `KFB Skydome Gates SKY3.dc.html`. SKY2 bleibt als Stand mit den Polkappen (**FAIL**, Georg).

- **Clay-SSOT, ehrlich:** gelesen und für die Familie »Clouds« befolgt (Donor zuerst unverändert zeigen, Familie nur aus der Donor-Anatomie, keine generischen Kugelhaufen, ein EnvironmentHost). **Nicht** befolgt: Golden-A/B. Es gibt kein Wolken-Golden-Sample; die Form läuft über das eigene Abstandsfeld statt über die K1-Vorstufe (`softenGeometry` + `seedGeometry`), das Material ist `clay-material.v10` ohne Nachweis gegen v8. Laut SSOT damit **TUNE**, bis ein Golden-Vergleich oder Georgs Abnahme vorliegt.
- **»Kantig«:** das Bild 13.07.18 zeigt den unveränderten Donor (Low-Poly, 192 △ je Lappen). Er bleibt als Quelle stehen und ist in E0/E3 jetzt beschriftet. Alle Knetwolken teilen ein Material, eine Feldlogik und dieselbe Rundung über alle LOD.
- **Familie v3 `kfb.sky.cloud-family/3-archetypes`:** 13 Varianten, 6 Archetypen als Regeln über die Donor-Lappen: Donor ×3, Kumulus, Stratus, Puff, Turm (Blumenkohl, kein Stapel), Kette, je ×2. Bake 1,6 s. Kehlen-AO 0,32 (v2 0,5 las schmutzig).
- **Spindel 0.3:** Mantel `himmel.v4` unverändert, sein Halbkugel-Abschluss unsichtbar, `spindel.v4` nicht mehr gebaut. Je Ende ein auslaufender Trichter (stetige Tangente an der Mantelkante, läuft als Röhre r = 0,16 R aus, L = 1,15 R, 0,4 u Überlapp in den Mantel), Karten werden winkeltreu kleiner und laufen in die Nebelfarbe der End-Palette. Am Ende klein: Grund-Shader unten (Lava, Säure-See, Bubblegum, Wirbel), Himmels-Shader oben (Himmel, Bubblegum, Aurora, Abendrot). Paletten: Vorgabe je Shader, Welt-Rollen Canyon/Bucht/O-Town (wörtlich aus `vendor-j15/lab-track/track-look.v5.js` WORLDS) oder Deck-Mittelwert; Saat 1–4 dreht den Farbton um höchstens ±9°.
- **Prüfungen (Vorschau):** eigene Deckungsprobe 360 Strahlen · 0 fehl · 0 jenseits far 120 · max 99,7 u (erster Lauf: 3 Fehlstrahlen auf der Fuge Mantel/Trichter → Überlapp). Lebenszyklus ×10: Δ 0, Probe in allen Zyklen bestanden. Schalen-Leak ×4: Δ 0.
- **Feld (gleiche Kamera, gl.finish):** 24 Wolken gemischt v1 6,3 ms / 14 k △ · v3 7,2 ms / 23 k △; alle near v1 15,0 ms / 118 k △ · v3 19,0 ms / 282 k △.
- Korrektur unterwegs: die End-Shader schrieben ohne Farbraum-Umrechnung (zu dunkel, harte Scheibenkante) — behoben.

## Genau ein nächstes Gate

**Georg nimmt das Bild der Clay-Wolken ab (E0-Donor neben E3-Familie, near/mid/far, Tag/Abend/Nacht) und entscheidet über den Frame-Zeit-Befund bei 12 Wolken; danach integriert der Receiving-Owner in WorldBuilder.** Kein GitHub-, Stage- oder Promote-Schritt in diesem Pass.
