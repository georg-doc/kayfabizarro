# Aqua-Ride R1 · Konzept und Shot-Liste (WS0 22.11.)

**Georg 22.11.:**
- Luke → Einsaugen (Effekseer „Phantasm“).
- Glasröhre als Achterbahn durch die Kelpwelt, synchron zu „Cartoon Chase“.
- Staccato-Ringe, Bullet-Time, träge Steuerung auf fester Route; die Figur schwebt in der Mitte.
- Exit-Knopf jederzeit (wie „Escape Now“, im Takt animiert), dann spuckt die Röhre den Fisch mit Blasen und Glassplittern aus.
- Wer den ganzen Song bleibt, landet in der HyperNorm-Röhre (Infinite Room) mit Typo und KFB-Karten, geschnitten wie ein Musikvideo.
- Wiederverwendbares Modul für KFB.

## Ein Modell

**Die Röhre ist ein Musikinstrument, das man befährt.** Der Song ist die Uhr: Jeder Takt hat einen festen Ort auf der Strecke. Die Fahrt dauert so lang wie der Song, die Geschwindigkeit folgt der Energie des Abschnitts. Die Strecke wird um den Song gebaut, nicht der Song über die Strecke gelegt.

- **Strecke:** feste Spline, ein Punkt pro Takt (106 Takte). Vorlage ist die Joyride-J17-Schiene (echte Schiene mit Looping, Bestand `JOYRIDE_BESTAND_R1`). Die Röhre ist ein gläserner Querschnitt auf dieser Schiene.
- **Figur:** schwebt in der Mitte der Röhre, mit der Schwebe-Pose aus dem Portal (gestreckt, reaktiv). Die Steuerung verschiebt sie träge im Querschnitt, bis zu zwei Drittel des Radius, mit Feder zurück zur Mitte. Vorwärts steuert niemand.
- **Ringe:** stehen auf Taktschlägen. Treffer erklingen als Akzent im Takt (Stem-Schlag), Fehlschüsse bleiben stumm. Kein Scheitern im Ride, nur Punkte.
- **Bullet-Time:** nur in den beiden Atempausen des Songs, nie auf Knopfdruck.
- **Kamera:** drei feste Einstellungen (hinter der Figur, Gesicht von vorn, seitlich außen an der Röhre). Geschnitten wird nur auf Taktgrenzen, an Abschnittswechseln.
- **Ein Rezept:** `src/data/choreo/aqua_ride.r1.json` im vorhandenen Rezept-Format (Phasen, Marken, Spuren). Marken = Taktnummern.

## Songkarte „Cartoon Chase“

127,2 BPM, Takt 1,887 s, 106 Takte, 3:22. Gemessen aus den Stems pro Takt (`cartoon_chase_takte.json`).

| Takte | Zeit | Musik | Abschnitt |
|---|---|---|---|
| 1–8 | 0:00–0:15 | ohne Drums, Holzbläser, Synth, schwebend | A Einsaugen |
| 9–17 | 0:15–0:32 | Drums und Percussion setzen ein | B1 Start |
| 18–20 | 0:32–0:38 | nur Riff und Drums | B1 Gerade |
| 21–22 | 0:38–0:42 | Bläser-Stoß | B1 erstes Tor |
| 23–28 | 0:42–0:53 | Riff, ab 27 dünn | B2, **Atempause 1** (27–28) |
| 29–39 | 0:53–1:14 | volle Fahrt, Bläser-Stöße 37–38 | B2 Looping |
| 40–58 | 1:14–1:50 | langes Riff, gleichmäßig | B3 Staccato-Ringe |
| 59–60 | 1:50–1:53 | Percussion- und Synth-Ausbruch | Übergang C |
| 61–70 | 1:53–2:12 | Keyboard und Synth tragen | C Glaskugel und Warp |
| 71–72 | 2:12–2:16 | Bass allein, Drums weg | **Atempause 2** |
| 73–90 | 2:16–2:50 | Schlussjagd, Drums voll | B4 Jagd |
| 91–94 | 2:50–2:57 | alles auf einmal, Höhepunkt | B4 Höhepunkt |
| 95–102 | 2:57–3:12 | abklingend | B4 Auslauf |
| 103–104 | 3:12–3:16 | Drums weg | Anlauf D |
| 105–106 | 3:16–3:22 | Schlussschlag, alle Instrumente | D HyperNorm-Röhre |

## Shot-Liste

| Takte | Bild | Ton | Kamera |
|---|---|---|---|
| A 1–8 | Code 4711 stimmt. „Phantasm“ dreht im Rund der Luke, Sog zieht Wasser und Fisch hinein, das Aquarium schrumpft nach hinten weg | Intro des Songs. Das Aquarium-Bett wird abgedämpft, wie hinter Glas | Gesicht von vorn, dann hinter der Figur |
| B1 9–22 | Glasröhre im Kelpwald, Licht flackert durch die Halme. Erste Ringe auf jedem Drum-Schlag. Tor bei 21 = Glasbogen platzt in Blasen | Drums setzen ein. Ring-Treffer = Percussion-Schlag | hinter der Figur |
| B2 23–28 | Röhre taucht in eine Kelpschlucht. **Bullet-Time**: Fische und Blasen stehen fast still, die Figur dreht sich in Zeitlupe | Song dünnt aus, Tiefpass, Herzschlag | seitlich außen |
| B2 29–39 | Looping um einen Felsbogen, Bläser-Tore 37–38 | volle Fahrt | hinter der Figur, beim Looping von vorn |
| B3 40–58 | Staccato-Ringe in Reihen auf Achteln, Kelp wird dichter, Riff-Gerade | Riff. Treffer = Gitarren-Akzent | hinter der Figur |
| C 59–70 | Röhre öffnet sich in eine Glaskugel, die Plasma-Blase aus dem Portal um die Figur, Warp-Linien. Fluff-Farben | Synth- und Keyboard-Teil | Gesicht von vorn |
| 71–72 | **Bullet-Time 2**: Stillstand in der Kugel, Blick auf die Kelpwelt von oben | nur Bass | seitlich außen, weit |
| B4 73–102 | Schlussjagd: Röhre fällt steil, Ringe dicht. Höhepunkt 91–94: alle Ringe glühen, Glas vibriert, Kamera ruckt auf jedem Schlag | Schlussjagd, Höhepunkt | Wechsel auf jeder Abschnittsgrenze |
| 103–104 | Röhre wird durchsichtig, die Welt verschwindet ins Weiß | Drums weg | hinter der Figur |
| D 105– | Schlussschlag = Schnitt in die HyperNorm-Röhre: Infinite Room, Typo-Zeilen und KFB-Karten fliegen vorbei, Schnitte im Takt. Danach endlos, bis man den Exit drückt | Schlussschlag, dann der neue Titeltrack „Grand Theft Aqua“ | Musikvideo-Schnitt |

## Röhrenringe und Linien (Georg 22.11., Nachtrag)

- **Ringe:** Georg baut sechs eigene Ringe (2D).
  - Sie bekommen Volumen (aus der Kontur extrudiert, gerundete Kante) und behalten ihren Glow, der um den 3D-Ring gelegt wird.
  - Am äußeren Rand sitzt der Geometry-Painter-Effekt (patch.gg, MIT), z. B. „Glowing reef“. Welcher Modus und wie stark, hängt ab von Level, Spielmodus und Zahl der durchschwommenen Ringe.
  - Die Ringe machen den Verlauf der Röhre lesbar und sind die Staccato-Schläge.
  - Dieselben Ringe sind später die Durchschwimm-Ringe im Spiel.
- **Zwischen den Ringen:**
  - wahlweise die Unterwasserwelt;
  - oder die strahlförmigen Hyperraum-Linien aus dem Portal, für Wasser angepasst (weicher, Blasenschlieren). Ihre Farbe changiert leicht und wechselt auf den Abschnittsgrenzen, ihr Tempo folgt dem Takt.
- **Georgs 12 Ringe (22.11.):** `KFB Claymation Reference/KFB CheckPoint Portal Rings/` (PNG 1254² mit Alpha). 1–6 überwiegend blau, 7–12 überwiegend gold. Ein Ringtyp wiederholt sich, bis der nächste kommt; die Farbe läuft dramaturgisch von Blau nach Gold, das Ende ist golden.
  - Zuordnung zur Songkarte:
    - Kelp-Röhre: 1, ab dem ersten Tor 2;
    - Zeitlupe: 3;
    - Looping: 4;
    - Ringe: 5, ab der Mitte 6;
    - Glaskugel: 7, der erste goldene, ist das Tor in die Kugel;
    - Jagd: 8, 9, 10, je ein Drittel;
    - Höhepunkt und Auslauf: 11;
    - Schlussschlag: 12 als goldenes Tor in die HyperNorm-Röhre.
  - Bauweise: Die Vorderseite ist Georgs Bild mit eigenem Licht (nicht neu beleuchtet), der Körper wird aus der Alpha-Kontur extrudiert, die Seitenwand nimmt die Randfarbe. Glow als Hülle. Die Ränder außen, wenn es flüssig läuft auch innen, bekommen den Geometry-Painter-Effekt.
- **Technik:** Der Geometry Painter läuft nur mit WebGPU. Spiel, Aqua und Effekseer zeichnen mit WebGL, deshalb portiert WS0 die Modi Reef, Molten cracks und Aurora silk als ein WebGL-Modul mit „Malen per Code“.
- **Offen:** der Effekt aus den ersten HyperNorm-Destruction-Slices (Brandlöcher, Energieblitze). Georg sucht ihn heraus.

## HyperNorm-Engine in der Röhre (Georg 22.11.)

Dieselbe HyperNorm-Engine wie auf den Echo-Monitoren (`engine/hypernorm`, live, musikreaktiv, Palette aus Biom und Seed), hier auf der Röhrenwand:
- **Abschnitt D (HyperNorm-Röhre):** Die Engine füllt die ganze Wand als Endlos-Raum, auf „Cartoon Chase“ bzw. danach den Titeltrack gekoppelt. Die Typo-Zeilen und KFB-Karten fliegen davor vorbei.
- **Abschnitte B und C:** nur als dezente Schicht im Glas, z. B. in den Ringen oder als Schimmer, damit der Kelp lesbar bleibt.
- **Skalierung für den besten Effekt:** Die Kachelgröße des Motivs wird an Röhrenumfang und Fahrtempo gekoppelt, sodass ein Motiv-Zyklus etwa einem Takt Fahrstrecke entspricht. Dann rollen die Muster im Takt auf den Spieler zu, statt zu flimmern. Am Rand gibt es keine sichtbaren Kachelnähte (Lehre aus q601: ein durchgehendes Bild).
- Eine Engine-Instanz rendert in eine Textur, die Röhre und Monitore teilen.

## Exit jederzeit

- Knopf oben mittig, Form und Typo wie „Escape Now“. Er pulsiert auf jedem Viertel, auf jedem Takt-Eins stärker.
- Druck auf den Knopf: Die Röhre bricht vor der Figur auf (Glasriss, eigene Riss-Phase, dann Splitter), die Figur wird mit Blasen und Glassplittern ausgespuckt und landet im Kelp beim Spieleinstieg. Danach „Feather burst“ in den Fischfarben (Polish-Chat).
- Der Song blendet nicht aus, sondern endet auf einem Stem-Schlag (Becken plus Bass-Stopp).

## Wiederverwendung für KFB

- Modul `src/ride/` mit Strecke, Röhre, Ringe, Takt-Uhr und Exit. Song, Strecke und Welt sind Eingaben.
- KFB nutzt es später für Rollercoaster, Badewanne und Jetpack (V-1108).
- Die Plasma-Kugel in C ist dieselbe wie im Portal (`plasmaKugel.js`).
- Effekte über `effekseerSchicht.js` (Phantasm, Feather).

## Andockpunkt im Aqua-Build (Polish-Chat 22.11., r32)

- Schleuse 1 nach Georgs Vorgabe: I an der Luke → Kamera-Zoom → Ziffernblock 4711 (Maus oder Tastatur) → Energie-Barriere fällt → Effekseer „phantasm“ → `tank.open()` → Sog → bisherige Rohrfahrt.
- Der Ride dockt in `openHatch()` in `index.html` an (nach `barrier.collapse` und FX). Abschnitt A (Einsaugen) beginnt dort; der Code-Teil aus der Shot-Liste ist damit schon gebaut.
- Der alte Ring in dcTank ist per `alteLuke:false` aus (DC-Marke, kein Stammcode). Am Stamm ändert der Polish-Chat nichts.

## Was ich von Georg brauche

Eine Hub-Frage: Stimmt die Songkarte mit den Abschnitten A bis D und die Lage der zwei Bullet-Time-Pausen? Danach baue ich den Ride als Modul und zeige zuerst Abschnitt B1 als Video.
