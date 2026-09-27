# RETURN · S4 v2 Phase A · Produktionspass AB · 2026-09-27

Von: Claude Design (KFB Animation Lab) · An: Claude Coworker (Track Core) · Entscheidet: Georg
Review-Einstieg: **`KFB Knet-Strecke T2.dc.html`** (Szenen TD03, TN02 · Portal, Kanten-Atlas). T1 bleibt als Options-Stand.

## Rand-Konzept »Ein Guss« (Georg 27.09., ersetzt Kerb + Schulter + Fuge + Wand + Kappe)

Fahrbahn und Rand sind **ein geformter Knetkörper** wie eine Spielzeugbahn. Zwei Farben je Welt: Fahrbahn und Körper.
- **Hohlkehle:** die Fahrbahn biegt über Schulter und Fuge in einem großen Radius in den Rand hoch. Innen in Kurven (R < 60 m) rot/creme bemalt, sonst Körperfarbe.
- **Randwulst:** ein runder Wulst über die ganze Wandbreite, gleiche Farbe wie der Körper. Keine helle Kappe.
- **Außenwand und Unterseite:** glatt und gerade, Kanten gerundet. Keine Beulen, kein Bauch. Der Stärke-Regler wirkt nur noch als sanfte Welle auf die Wulst-Oberkante (±6 cm), keine Dellen.
- **Warnung:** große Tafel (2,4 × 1,3 m) auf dem Wulst, nur außen in engen Kurven (R < 35 m), alle 8 m.
- **Stützen:** ein dicker Knetpfeiler je 16 m unter hochliegender Fahrbahn (breiter Fuß, schlanke Taille, Kragen), Körperfarbe. Nicht im Parkhaus, im Looping und an Kicker/Luft/Landung.
- **Knetspuren im Streckenmaß:** Fahrflächen glatt gestrichen (keine Abdrücke, keine Druckstellen), Wände, Wulst und Röhre ohne Druckstellen, Abdrücke schwach in Handgröße (Kachel 0,55 m), Fels nur Facetten (`clayDetail` im Skin-Satz). Tunnel, Fels und Kragen verteilen die Körnung in Metern statt nach Punktindex. Berg und Böschung einfarbig (Gras), Fels nur an Stirnwand und Schnittflächen, keine Mosaik-Körnung. Wulst: feste Punktzahl je Sample (vorher Schlitze durch verdrehte Vierecke).
- Geometrie aus den Stream-Slots (road, barrier_in_top, barrier_out_top, under), Fahrbahn unverändert. Der Atlas zeigt die alten Einzelzustände weiter als Vergleich; Zeilen 15–17 zeigen »Ein Guss« in drei Knetstärken.

## Probleme zuerst

0. **TN02-Berg ist noch ein Tonnengewölbe.** Die Hülle folgt dem Portalring als Ellipse (48 × 24 m) über die ganze Röhrenlänge; sie liest als lange grüne Tonne, nicht als Berg. Einschnitt und Stirnwand treffen den Berg jetzt ohne Vorhang (Einschnitt aus dem Bergprofil selbst). Ein echter Berg braucht Gelände vom World-Owner oder eine eigene Bergform, die sich vom Röhrenrahmen löst.

1. **Schulter auf der Bahn ist 0,59–0,69 m breit, nicht 1,98 m.** Der Core skaliert die Seite mit `sideL/sideR` 0,30–0,35 (gemessen: i 1300 0,69 m bei 0,35; Plaza-Kehre 0,59 m bei 0,30). Der Kerb (1,0 m) belegt damit fast die ganze Schulter; ein Kies- oder Sandbett ist auf TD03 nur ein Streifen. Auf TD03 wird es im Ist-Zustand gezeigt (Kehre innen: Kies, Driftring außen: Sand).
   **Core-Wunsch:** Auslaufzonen als Profilzustand `sideL/sideR 1,0` + `shoulderW 6,0` (im Atlas, Zeilen 9–11 und 18, gezeigt).
2. **Kappe am Kicker 0,30 m** (i 2864, s 1437, `barrierT` 0,30, `barrierVis` 0,22). Nicht verbreitert, im Ist-Zustand gezeigt (TD03 · »Kappe 0,30 m«). Der Knetwulst ist dort auf 0,09 m begrenzt und liest als Kante.
   **Core-Wunsch:** `capMin` 0,9 m an offenen Enden (Lippe, Landung), Absenkung weiter über `barrierVis`; alternativ eine eigene Slot-Breite für die Kappe, getrennt von `barrierT`.
3. **FS01: SOURCE_REQUIRED.** Es gibt nur die Layoutquelle `S8_TUNNELS_2026-09-27/track-core/layout/fs01.mjs`, keinen kompilierten Stream. Pads und Buoy-Hops sind nicht gezeigt.
4. **Nahtschatten an Ereigniswechseln:** Wo zwei Übergänge aneinanderstoßen, wird eine Querschnittsreihe doppelt angelegt, damit keine Farbe über ein Viereck verwischt. Die doppelte Reihe hat eigene Normalen; bei streifendem Licht kann eine feine Linie sichtbar sein.
5. **Knetflecken liegen im Material, nicht in der Geometrie.** Die Platten haben einen dunklen Rand, aber keine Dicke. Relief der Flecken wäre ein nächster Schritt (Normalen aus dem Fleckenfeld).
6. **Tunnelinneres ist dunkel:** Sonne mit Schatten und ein Himmelslicht, keine Tunnel-Lichtquelle. Die Lichtbänder sind leuchtende Knetplatten, sie beleuchten nichts.
7. **Nachrechnung des Profils ist nicht vollständig:** Der Seitenfaktor wirkt im Core auch auf `shoulderDrop` (erste Fassung übersah das, Schulter im Atlas lag 18 cm zu tief; behoben). Wie der Core `barrierVis` < 1 auf die Wandhöhen anwendet, ist nicht abgelesen (gemessen am Kicker: Wandoberkante 0,024 m statt 1,35 m bei vis 0,22). Bitte die Formel nennen.
8. Leitplanke (Zeile 7) und Fangzaun (Zeile 8) sind Stützen und Bänder auf Ankern, die ich selbst setze (2 m bzw. 3 m). Der Core gibt diese Anker noch nicht aus.

## Was gebaut ist

- **Richtung AB** in `lab-track/track-skins.v0.1.json` (`production: "AB"`): Farben, Knettyp und Maßstab aus A. **Eine Bande je Stelle** (Georg 27.09.: doppelte Bande verworfen): rot-weißer Kerb nur innen in Kurven mit Radius < 60 m, rot-creme Warnblöcke nur außen in Kurven mit Radius < 35 m, beides aus der Stream-Krümmung (`raceZones`), Wechsel als Knetflecken. Gerade: ruhiger Kerb, ruhige Wand, Blockfugen nur als Form, Kerb je Skin (Straße Wulst 0,16 m, Bahn flach 0,08 m, Magnet Wulst 0,08 m, Tunnel Servicestreifen 0,30 m). C bleibt als Preset im Satz.
- **Knetflecken statt Farbverlauf:** Fleck erscheint, wenn h·0,75 + 0,35·r < 1,1·t (h Zufall je Zelle, r Abstand zum Zellkern, t Übergangsfortschritt über s). Zellen je Rolle 0,7–1,8 m, Rand 28 % dunkler. Deterministisch aus (s, u). »Nahtansicht« zeigt die Flecken binär und die Fugen rot.
- **Vier Übergänge**, je Eintritt / Mitte / gesetzt (+ Draufsicht):
  1. Straße → Renn (TD03, s 605,6)
  2. Renn → Kies/Sand (TD03 Ist-Zustand; Atlas Zeile 18 mit Vorschlag)
  3. Straße/Bahn → Kicker → Luft → Landung (TD03, s 1407–1469)
  4. offen → Einschnitt → Portal → Röhre (TN02, Gotthard, s 80,5)
- **TN02 Gotthard:** Innenwand aus `tunnelRings`, Knetbeule nach innen ≤ 0,70 m, 8 m vor dem Portal ausgeblendet. Kragen folgt dem Ring über Grund (1,8 m breit, 1,2 m vor der Stirnwand), Stirnwand, Berg, Einschnitt, Lichtplatten alle 18 m. Die 7-m-Hülle wird gegen die verformte Wand gemessen; das Panel zeigt den kleinsten Abstand.
- **Kanten-Atlas TD03** (18 Zeilen): bündig · Wulst-Kerb · Bordstein + Gehweg · Renn-Kerb flach · Wurst-Kerb · Wandblöcke · Leitplanke · Fangzaun · Gras · Kies · Sand · Graben + Erdwall · Brüstung · Tunnel-Servicestreifen · Knetstärke 0,15 / 0,5 / 1,0 · Übergang Renn → Kies → Renn. Profil aus `prm` nachgerechnet und gegen die Stream-Slots geprüft: 120 TD03-Samples mit voller Wand, max. 0,02 cm. Samples mit `barrierVis` < 1 (Kicker, Landung; 3 von 123) sind **nicht** nachgebildet, Abweichung dort bis 133 cm; der Atlas nutzt keine solchen Zustände.
- **Ansichten:** Übersicht, Nah, Mitfahren 25 m/s, Graustufen, Nahtansicht mit Fugen.
- **Regeln eingehalten:** Fahrbahn road_L..road_R unverformt (0 cm). Verformung nur an Wand, Kappe, Unterseite, Röhre und Gelände. Keine Kenney-/KayKit-Straßengeometrie, keine Neonoptik.

- **Knet-Material überall:** jedes Mesh aller Szenen läuft über clay-material v8 (Panel zählt: Meshes mit Knet-Material / alle). Tunnel-Lichtplatten ebenfalls (knetbar, leuchtend). Detail trägt weiter (`uClayLodK` 0,6, Handspuren 0,7).

## Profilzahlen, die der Core übernehmen könnte

| Zustand | Zahlen |
|---|---|
| Auslauf Kies/Sand/Gras | `sideL/R` 1,0 · `shoulderW` 6,0 |
| Graben + Erdwall | `sideL/R` 1,0 · `shoulderW` 4,0 · neue Größe `ditchDepth` 0,6 · Kappenwulst 0,7 |
| Leitplanke | `barrierH` 0,40 · `barrierOuterTop` 0,35 · `barrierT` 0,50 · Anker Stütze alle 2 m, Band 0,62–0,98 m |
| Fangzaun | Anker außen (+0,35 m), alle 3 m, 4,5 m hoch, 8° nach außen |
| Brüstung schlank | `barrierT` 0,45 · `barrierH` 1,10 · `barrierOuterTop` 1,10 |
| Kerb / Servicestreifen | neue Rolle `kerb` auf der Schulter ab road_L/R: Breite 1,0 (Tunnel 1,2), Höhe je Skin |
| Kappe | `capMin` 0,9 an offenen Enden |

## Verwendete Quellen

- Brief-ZIP `uploads/KFB_TRACK_LOOK_BRIEF_S4_v2_2026-09-27/`: `data/td03.stream.json` (core v0.8.1), `kit/stream-to-three.mjs`, `notes/CLAY_GEOMETRY_NOTE`, Shots b01–b15, r01–r07, t02/t04/t10.
- kayfabizarro @`georg-doc-patch-2`: `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S9_RESPONSIVE_2026-09-27/tn02.graph.stream.json.gz` (core v0.8, Graph v0.2).
- Projekt: `lab-clay/clay-material.v8.js`, `clay-relief.v2.js`, `clay-profiles.v2.js`, `ref/clay-joebinns/Fingerprints01_3K.png` (CC0).

## Geänderte und neue Dateien

- neu: `KFB Knet-Strecke T2.dc.html`, `lab-track/track-look.v2.js`, `lab-track/track-kit.v2.js`, `lab-track/data/tn02.graph.stream.json.gz`
- geändert: `lab-track/track-skins.v0.1.json` (AB, Oberflächen, Flecken, Tunnel mountain, Stagger tunnel/zone), `lab-track/RETURN_S4_PHASE_A.md`, `LIVING_CLAY.md`, `CHANGELOG.md`, `github.md`
- unverändert: T1 (`KFB Knet-Strecke T1.dc.html`, `track-look.v1.js`), K7, alle Vendor-Dateien

## Außerhalb dieses Passes

b11 · FS01-Stream · S4B (reaktive Schicht) · S5 (Fassaden) · weitere Tunnelfamilien (bunker, alien, toy, hangar, Hallen) · Biom-POCs · Billboards · Material-Mix-Requisiten.
