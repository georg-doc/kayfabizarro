# Konzept Wetter als Ereignis, Wolken mit Tiefe, Karten-Himmel (V-1154, V-1155) · R1 · 01.11.2026

Von WS-Himmel an WS0. Nichts gebaut, nichts gepusht. Probe und Messung liefen am Stamm @b56fa199.
Gelesen und gemessen ist als solches genannt. Kosten sind Schätzungen, gemessen wird erst beim Bau (Readback-Tor).

## Das Wichtigste vorweg

1. **P9Himmel: Weder Schwelle noch Kamera sind falsch, sondern die Stichprobe.** Details in Teil 7.
2. **Die Fahrkamera zeigt nur den Himmel bis rund 9° über dem Horizont** (gemessen: Neigung 18,3–18,5°, Blickwinkel 55°).
   - Ein großer frei stehender Planet (Mitte 15–31° hoch) liegt in der Fahrkamera fast ganz außerhalb des Bildes.
   - Unsere bisherigen Himmelsbilder sind mit gehobenem Blick entstanden. Das habe ich in R2 nicht so deutlich gesagt.
   - Das gilt für alles Folgende: Front, Blitz und Wolken müssen unter 9° lesbar sein. Georg muss das entscheiden (Frage 1).
3. **Reihenfolge:** Zuerst die Wolken als Objekte. Eine sichtbare Front besteht aus diesen Wolken, ohne sie gibt es nichts, was heranzieht.

---

## Teil 1 · Wetter als Ereignis

**Modell.** Wetter ist kein Zustand der Welt, sondern Dinge, die durch die Welt ziehen. Eine Front hat Ort, Richtung, Größe und Art. Was man am Wagen erlebt, ergibt sich daraus, wo die Front gerade steht.

**Was andere machen**
- **TinySkies** (Quelltext gelesen, `DayNightCycle.ts`, `RainOverlay.ts`, `Game.ts`):
  - Ein Tag dauert 195 Sekunden: drei Farbsätze mit kurzen Überblendungen.
  - Regen ist eine einzige Zahl aus zwei Sinuskurven über Zeit und Welt-Saat, rund 46 % der Zeit nass (nachgerechnet). Alle Spieler sehen dasselbe Wetter.
  - Der Donner kommt nach 0,3–0,9 s Zufall, unabhängig von einer Entfernung. Fronten gibt es dort nicht.
  - Stimmung entsteht dort aus dem schnellen, starken Farbwechsel. Das Wetter selbst ist einfach. Daraus übernehme ich die Saat-Logik, nicht das globale Wetter.
- **OpenMW:** Blitzhäufigkeit als Einstellwert, vier Donner-Stufen von nah bis fern. **Thunderhead (Minecraft):** eine enge Sturmfront an einem Ort statt Blitze über den ganzen Himmel. **Roblox-Wettersystem:** keine Blitze in der ersten Hälfte des Einblendens. Alle drei nur als Suchauszug gelesen.
- Zu Horizon, RDR2 und BotW habe ich nichts Belastbares zur Wetter-Regie gefunden und führe sie deshalb nicht als Beleg.

**Vorschlag**
- `planWeather(seed, x, z, t)` neben `planSky`, rein und ohne Zustand: gleiche Saat und gleiche Zeit ergeben gleiches Wetter. Tabelle als Daten je Thema (`kfb-weather-r1.json`), ein Lauf durch den einen Löser.
- **Fronten:** Je Zeitfenster würfelt die Saat Arten und Bahnen. Die Windrichtung ist je Region aus der Saat fest (mit WS-Verteiler abgestimmt, damit Lee und Schneefall nicht gegeneinander laufen).
- **Naht zum Bestand:** Der Regisseur schreibt nur die vorhandenen Werte `W` in `driveAtmos` (`cover`, `rain`, `fog`, `wind`, `sunK`). Rig, Nebel und Himmel bleiben unverändert (V-385). Die fünf Lagen und Presets bleiben; `gewitter`, `schnee` und `hagel` kommen als Lagen dazu.
- **Ablauf Gewitter:**
  1. Fern: dunkle Wolkengruppe am Horizont, stummes Wetterleuchten.
  2. Näher: Wind dreht auf, Licht wird flacher, Donner mit echter Verzögerung.
  3. Kern: Regen, Blitze am Boden.
  4. Abzug: letzte Tropfen, selten ein Regenbogen.
- **Donner:** Blitzort und -zeit kommen aus der Saat, die Entfernung ist echt. `thunderDelay` (Entfernung ÷ 343) und `ambienceLightning({distanceM, azimuth})` gibt es schon. Heute würfelt `driveAtmos` die Entfernung, das fällt weg.
- **Kosten:** rechnerisch fast nichts (wenige Fronten je Bild, Plan-Rechnung wie `planSky`).
- **Verdrahtung über den Tag bleibt bei WS1.** Der Regisseur braucht von dort nur die laufende Uhr.

---

## Teil 2 · Wolken mit Tiefe, Nebelschwaden

**Was im Spiel läuft (gelesen)**
- Ohne Schalter: `sky-drive.js` Zeile 97–100, bis zu drei Ebenen aus Rauschen auf der Kuppel.
- Mit `sky=r1`: meine zwei gemalten Ebenen, fern und `NEAR`.

**Warum beides keine Tiefe gibt.** Das betrifft auch meine eigene Ebene aus R2.
- Beide rechnen nur aus der Blickrichtung, nichts steht wirklich im Raum. Bei `NEAR` verschiebt 1 km Fahrt die Kachel um 0,3 %, also praktisch nicht.
- Keine Wolke kann vor einen Hügel ziehen oder nah vorbeikommen.
- Die Projektion wird zum Horizont hin flach. Genau dort, unter 9°, sieht die Fahrkamera sie.
- `WS1_WOLKEN_R1_RECHERCHE` kam schon zum selben Schluss: Nahe Wolken sind in den Stil-Spielen Einzelobjekte (Sea of Thieves, Genshin, BotW).

**Vorschlag von WS0 geprüft: passt, mit drei Festlegungen**
- **Drei Ebenen mit einem Wind:** Nah sind Schwaden über Tälern (flache Massen, wenige hundert Meter entfernt). Mitte sind Wolken-Objekte in echter Höhe und Entfernung (etwa 150 m hoch in rund 1 km, damit sie unter 9° im Bild sind). Fern bleibt die heutige gemalte Kuppel. Das Feld wird um den Spieler gewickelt, Ausblenden nahe der Kamera per Muster statt Transparenz.
- **Festlegung 1, Objekte statt Karten:** Echte Modelle, undurchsichtig, ein Aufruf über `BatchedMesh` (läuft schon in `placeVeg` und `endlessVeg`). Pixel sind unsere Grenze (V-1090), und undurchsichtige Modelle zeichnen keine Pixel doppelt. Dazu fliegen wir (UFO, Rakete); Karten verraten sich von unten.
- **Festlegung 2, Form aus dem Donor:** `cloud-family.v3` (6 Archetypen, 13 Varianten, aus den 18 Lappen der Jarlan-Wolke). Code und Modell gelesen, altes Bild `evidence/sky3-e3-familie-13.jpg` angesehen. Formen und Gewichte als Daten in `kfb-sky-r1.json`. Die Modelle backt WSB (V-1065), Lappen mit gemeinsamem Schattenverlauf nach `SPEC_CARTOON_VFX_SHAPES_R1`.
- **Festlegung 3, Look von heute:** Georg findet die Wolken „ganz cool“. Darum kein Knet-Material wie im Donor-Bild (das liest sich schnell als Schneeball-Haufen), sondern dieselben Töne wie heute: Lichtseite, Schattenseite in Palettenfarbe, harte Stufe.
- **Wolkenschatten am Boden:** eine weltfeste Textur aus derselben Wolkenliste, ein Zugriff im Gelände-Shader. Stärkste Wirkung je Kosten laut Recherche (Genshin).
- **Nebelschwaden:** Zwei Dinge zusammen. Tal-Dunst als Rechnung in der einen Luftfunktion, gespeist aus der Senke. Dazu einzelne flache Massen, die der Wind schiebt. Bei Nebel-Wetter werden sie mehr und dichter.
- **Planeten:** `skyLayerHint` steht im Register heute bei allen 28 Einträgen auf „fern“, trägt also keine Information. Planeten bleiben in der Kuppel, Wolken-Objekte ziehen von selbst davor. Die Regel „große Wolken überstimmen keine Planeten“ wird Regie: Der Plan hält große Wolken beim Start aus der Richtung des Planeten, kurzes Vorbeiziehen ist erlaubt und gewollt.

**Kosten (Schätzung):** 20–40 Wolken à rund 1 k Dreiecke, 1 Aufruf. Der alte Gate-Lauf nennt 0,3–2,6 ms für Himmel plus 24 Wolken, ohne Spiel. Schatten: 1 Texturzugriff je Geländepixel.

**Gaussian Splats:** Ich sehe keinen konkreten Grund dafür. Einziger Fall wäre weiches Durchfliegen ganz nah. Das löst das Ausblenden billiger, und der Knet-Look spricht dagegen (V-731, V-646). Eine Probe wäre eine Sitzung: fremde Bibliothek, eigener Zeichendurchgang, eine Wolke gegen die Tiefe der Knet-Welt. Ich rate davon ab.

---

## Teil 3 · Knet-Niederschlag und Boden

**Modell.** Was fällt, ist Kugel. Was liegt, ist erst Kugel und dann Fläche. Einzelne Kugeln gibt es nur nah am Spieler, die Decke trägt den Rest der Landschaft.

**Bewährt**
- **Lagarde (Remember Me, gelesen):**
  - Nass heißt dunkler je nach Porosität plus glatter; kaum Zusatzkosten.
  - Pfützen über Höhe oder Vertexfarbe platziert, flache Normale.
  - Trocknen ungleichmäßig über rund eine Minute, Pfützen langsamer.
  - Regen-Abdeckung per Tiefenkarte von oben kostete 0,2–0,3 ms auf PS3/Xbox 360.
- **Schneekappe per Normale nach oben** mit Bruchmaske (UE4-Anleitung, Godot, als Suchauszug gelesen). Batman: Arkham Origins und Tomb Raider sind Quellen für Spuren im Schnee, Inhalt nicht gelesen, erst später relevant.

**Vorschlag**
- **Fallen:** Regen bleibt Streifen (`driveWeather`, ein Aufruf). Schnee und Hagel werden ein neuer Emitter `fall` im einen `ballCore`, in einem Kasten um die Kamera: Abprall am Boden über dessen Boden-Textur, kurz liegen, schrumpfen. Der Ringpuffer begrenzt die Menge. Hagel springt höher und schmilzt schneller.
- **Liegen:** Decke und Nässe sind ein Rechenwert im Gelände-Shader: `Wettermenge × Ruheort`. Die Decke hebt die Oberfläche nur optisch, der Rand läuft über das eine Sprenkel-Modul (V-403). Ohne Verlauf, ohne Linie.
- **Pfützen:** nur wo der Ruheort hoch ist; flacher glänzender Deckel, gespiegelt wird `kfbAir(Reflexion)`, kein zweiter Renderdurchgang. Uferlinien erst mit N-024.

**Abstimmung WS-Verteiler (Antwort liegt vor)**
- Ein fertiges Feld gibt es nicht. Rohwerte liefert `sampleTile` auf `world/verteiler-r1` @3331e98b, noch nicht im Stamm: Hang, Senke, Abwärtsrichtung, Wasserabstand, Sperre (128-m-Kacheln, 4-m-Raster).
- „Ruheort“ wird eine eigene reine Funktion daraus plus Lee gegen die feste Regionsrichtung. Gelesen wird `sampleTile`, nicht die Kaskade, sonst hinge das Wetter am Schalter `place=r3`.
- **Offen:** Sollen Schneekugeln, die dauerhaft liegen, eigene Tabellenzeilen werden? Ich schlage nein vor: Fallende sind Wetter, die Decke ist Rechnung. WS-Verteiler baut in dieser Runde nichts dafür, N-024 gilt.

**Kosten (Schätzung)**
- Kugeln: Rechnen auf 128² ist klein. Teuer sind die Pixel, und die vervierfachen sich bei dpr 2. Startwert ≤ 8 000 Kugeln, abhängig von dpr, 1–2 ms. Ohne Niederschlag ≈ 0.
- Decke und Nässe: ein Attribut je Geländepunkt im Worker, wenige Shader-Zeilen.

**Regeln:** V-797 (Zonen statt Krümel): Die Decke trägt das Bild, nicht die Kugeln. V-1142: Jede Kugel hat eine Ursache, sie fällt.

---

## Teil 4 · Blitze

**Modell.** Ein Blitz ist ein Energiepfad von der Wolke zum Boden: dünner Vorläufer, Einschlag, Aufleuchten, Vergehen von den Spitzen her.

**Vorschlag: kein zweites Modul, nur `src/modules/kfb-stroke/index.mjs`**
- `strokeTree` mit `BOLT_TABLE`, `strokeLife` für den Ablauf, `strokeRibbon` als Band. Der Zeichen-Code steht in `cascade/r4/sky-field.js` (WS-Design); den Shader übernehme ich von dort, statt ihn neu zu schreiben. Beides liegt noch auf `design/kartengebaeude-r1`, nicht im Stamm.
- **V-1152:** heller Kern ohne Kontur, eine farbige Schattenkante unten rechts (`STROKE_SHADOW`). Beurteilung nur bewegt.
- **Ort:** Start an der Unterseite der Wolken-Objekte, Ziel am Boden aus dem Plan. Im Bild etwa 150 m hoch bei 1 km Abstand, damit er unter 9° bleibt. Nahe Blitze laufen aus dem Bild heraus, das ist gewollt.
- **Licht:** nur der vorhandene Stoß (`uFlash` plus Hemisphäre des Rigs), kein neues Licht (V-385). Neu ist ein zweites kurzes Aufflackern wie in TinySkies.
- **Einschlag nah (später):** `ballCore`-Emitter `impact` und Krater-Logik.
- **Kosten:** einige Bänder für wenige Zehntelsekunden, schreibt keine Tiefe.
- **Abhängigkeit:** Reparatur V-1152 bei WS-Design läuft. Ich baue auf deren Endstand.

---

## Teil 5 · Schneebedeckte Assets

**Bestand und Suche**
- `assets/nature-packs-r1`, `quaternius_ultimate_nature`: 46 Schnee-Modelle (Birke, Eiche, Kiefer, Weide, Busch, Fels, Stumpf, Stamm). Geprüft: `PineTree_Snow_1` hat dieselbe Dreieckszahl wie die grüne Fassung (1920) und ein eigenes Material „Snow“. Rund 3,4 MB gesamt.
- 3D-Asset-Suche: nichts Besseres im Stil. Kenney Holiday Kit ist weihnachtlich; die `threedassets`-Treffer sind KI-Modelle in anderem Look; itch.io-Packs nicht direkt ladbar. Im Stamm liegt nichts mit Schnee.

**Entscheidung: Schneekappe im Shader, keine Modelle tauschen**
- Andockstelle `applyGroundAlbedo` in `groundAlbedo.js` (Hinweis WS-Verteiler). Wächst und schmilzt mit dem Wetter und gilt für alles, auch Kit-Modelle, die unverändert bleiben (V-574).
- Wetter ändert sich mit der Zeit, die Löser-Tabelle nach Saat und Ort. Modelle per WFC tauschen hieße bei jedem Schneefall neu lösen. Deshalb passt die Kappe, wo Georg „per WFC“ sagte: Der Löser bleibt für den Bewuchs zuständig, die Kappe folgt dem Wetter.
- Die Quaternius-Schneemodelle kommen nur als feste Modellwahl für dauerhaft verschneite Themen infrage, eine Zeile in `modelle`. Das entscheidet WS0.

---

## Teil 6 · Ton: Lückenliste

Vorrang Feldaufnahmen (V-857). ElevenLabs nur nach Georgs Ja über WS0.

**Liegt bereit:** `rain-1…5`, `thunder`, `thunder-2`, `A03_thunder_dry`, `W04` Regen-Einsatz, `W05` weicher Donner a–c, `W06` Regen-Schleife, `snow-day/night`, `storm-gusts`, `wind-1…3`, Körnchen (Tropfen, Böen, Laub), Dämpfung bei Schnee. Die Verdrahtung ist noch offen (`atmo.weather` steht in `cueMap` als Lücke).

| Lücke | Feldaufnahmen als Kandidaten (Freesound, nicht angehört) |
|---|---|
| Naher Donnerschlag | TRP 616992, 567945, 717907; loganzsound 840628 |
| Langes Rollen fern, mehrere | TRP 717888; Rest noch zu suchen |
| Hagel auf Boden und Blech | Suche offen (Seite antwortete mit 429) |
| Regen auf dem Wagendach, von innen | Suche offen (429) |
| Schnee-Schritte (`STEP_SURFACES` hat keinen Schnee) | Nox_Sound 613849, cabled_mess 384424, Nimlos 432285 |
| Reifen auf Schnee, Reifen durch Pfütze | noch zu suchen |
| Knet-Kügelchen schlägt auf | keine Feldaufnahme denkbar; weicher Plopp, **einziger Kandidat für ElevenLabs** |

Entfernung beim Donner: nah `crack`, fern `rumble`, dazwischen Tiefpass nach Entfernung. Kein neues Audio-Modul, alles im einen Audio-Besitzer.

---

## Teil 7 · Roter Test P9Himmel (Q-031)

**Urteil: Die Kamera ist richtig, die Schwelle von 10 % passt, die Stichprobe ist falsch.**
- **Kamera:** Der Test nimmt 18,3° Neigung, die echte Folgekamera misst 18,5°. Auf flachem Land wären das 18,2 % Himmel. Die Obergrenze 35 % erreicht diese Kamera nur beim Blick bergab.
- **Ursache der Rotwerte:** Der Test misst je Thema an einer einzigen Stelle in einer Richtung. Beide Rotwerte sind ein Hang im Blick:
  - An Stelle (−183, −353) liefert derselbe Punkt bergauf 0,036 und bergab 0,34. Im Himmel-Branch lag dort noch Thema „schnee“ mit 0,015.
  - Bei „pastell“ dasselbe: 0,063 gegen 0,182.
- **Warum es vorher grün war:** Im Stamm hat sich die Themenkarte verschoben, der Test landet also an anderen Stellen. An den Planeten liegt es nicht.
- **Messung am Stamm**, 6 Themen, je 3 Stellen, je 4 Richtungen:

| Thema | Mittelwert (Median) | ≥ 10 % |
|---|---|---|
| canyon | 15,3 % | 11 von 12 |
| pastell | 16,2 % | 10 von 12 |
| wüste | 14,7 % | 12 von 12 |
| schnee | 11,7 % | 8 von 12 |
| moos | 11,1 % | 7 von 12 |
| mesa | 10,8 % | 10 von 12 |

- **Grenzen:** Ein Lauf, unter Last. Der Test zählt vernebeltes Gelände als Himmel, nicht wörtlich „Tiefe = Kuppel“.
- **Änderung:** Median je Thema über 3 Stellen und 4 Richtungen ≥ 0,10, Einzelwerte nur als Auskunft. Damit wären alle sechs grün. Ich ändere `skyR1` beim nächsten Merge; bis dahin führt WS1 P9Himmel als bekannt rot.

---

## Teil 8 · Karten-Spindel (Probe, kein Einbau)

**Donor gelesen:** `spindle-sky.v5.js`, `himmel.v4.js`. `spindel.v4.js` baut v5 nicht mehr. Der Mantel ist ein Zylinder im Backsteinverband, sechs Motive, ein Aufruf. Trichter und See entfallen, wie WS0 vermutet. Übernehmenswert sind Verband, „kein Motiv über sich selbst“ und der Atlas-Mittelwert als Horizontfarbe.

**Probe:** am Stamm zur Laufzeit in den Kuppel-Shader gehängt, zwölf Motive aus `forget_utopia`, nur Motiv, ohne Text. Ein Atlas, 0 neue Aufrufe. Weil die Kuppel Körper und Wolken danach zeichnet, stehen sie davor. Nur Tag geprüft, keine Bewegung, keine Kosten gemessen.

**Auflösung gerechnet**, Blickwinkel 55°:

| Motive je Kreis | Reihe reicht bis | Bildbreite je Motiv, Mac 1728×1117, dpr 1 / 2 | Zelle | Speicher (12 bzw. 6 Motive, mit Mips) |
|---|---|---|---|---|
| 6 | 31° | 1239 / 2478 px | 1366 | 34 MB, und nur 6 Motive |
| 12 | 17° | 575 / 1150 px | 1024 | 39 MB |
| 24 | 8,6° | 282 / 565 px | 512 | 10 MB |

**Was die Bilder zeigen**
- **Bei 6** sieht man die Vergrößerung, und in der Fahrkamera nur ein Stück unterer Rand einer Karte.
- **Bei 12** ist die Fahrkamera schon abgeschnitten (Köpfe fehlen).
- **Bei 24** passt in der Fahrkamera gerade eine Reihe, Titel und Figuren sind lesbar; es ist die einzige Fassung, die dort funktioniert.
- **Im Blick nach oben** liest sich jede Fassung, 24 als Comic-Wand, 12 am ruhigsten.
- Planet und Wolken stehen sauber davor. Der Horizont läuft in die Luft aus.

**Urteil**
- Empfehlung **24 Motive je Kreis, 512er Zellen, 10 MB**. Nur laden, solange dieser Himmel aktiv ist.
- WS0-Einschätzung passt: besonderer Himmel, nicht Standard. Blick nach oben ist bildstark, aber sehr unruhig, die Welt muss sich gegen eine zweite Bildebene behaupten.
- Einsatz als seltene Himmelsart über `surreal` oder `outlier`, in der Kartenzone oder bei einem Ereignis. Bilder aus dem Deck-Paket (V-1147), dort Ausgabe „Himmels-Atlas“ ergänzen.
- **Vor dem Bau zu klären:** Probe-Kanten zwischen den Reihen sind zackig (nur Probe), Nacht, Bewegung, Kosten.

---

## Beifund
Eine nahe Wolke im Bild (rechts, `spindel_blick_oben_*`) ist durchscheinend, obwohl dort kein Körper zu sehen ist. Vermutlich die Dämpfung `1−0,85·gBodyA` aus dem Stamm-Einbau, nicht geklärt. Auch im Vergleichsbild ohne Karten zu erkennen. Prüfe ich in der Wolken-Runde.

## Was ich zuerst bauen würde
1. **Wolken-Objekte, Schwaden, Wolkenschatten** hinter `clouds=r1`: unabhängig von Verteil-Fassung und Uhr, Georgs direkter Wunsch, Grundlage für alles Weitere.
2. **Regisseur, Front aus diesen Wolken, Blitz, Donner** hinter `weather=r1`: nutzt vorhandene Lagen und Töne, braucht die laufende Uhr von WS1 und `kfb-stroke` im Stamm.
3. **Nass und Pfützen, Schneedecke, Kappe:** braucht `sampleTile` aus dem Verteiler.
4. **Kugeln `fall`** zuletzt: Sie wirken erst, wenn der Boden antwortet.
5. **Karten-Himmel** unabhängig, sobald das Deck-Paket steht.

**Vor dem Bau:** Nach V-740 braucht jeder Schritt freigegebene Bilder. Für Wetter, Wolken-Objekte und Schnee habe ich noch kein Zielbild; das Donor-Bild zeigt nur die Formen, nicht den Look. Ein Bildpaket wäre Schritt 0.

## Bilder (`replies/WETTER_KONZEPT_R1/`)
Einzelbilder in voller Größe, 2560×1600 (die drei gehobenen Kartenfassungen in dieser Größe, dazu ein Vergleich ohne Karten):
- `spindel_spielkamera_N24.jpg`, `spindel_spielkamera_N12.jpg`: Fahrkamera-Höhe, Blick auf den Wagen von vorn, Neigung wie im Spiel
- `spindel_blick_oben_N24.jpg`, `_N12.jpg`, `_N6.jpg`: gehobener Blick
- `spindel_blick_oben_vorher.jpg`: dieselbe Stelle ohne Karten

## Was Georg entscheiden muss, in einfachen Worten
1. **Fahrkamera:** Heute sieht man beim Fahren nur einen schmalen Streifen Himmel. Große Planeten sind dann kaum im Bild. Soll die Kamera beim Fahren flacher schauen, damit mehr Himmel zu sehen ist, oder bleibt sie, und Planeten und Wolken rücken tiefer an den Horizont?
2. **Wie oft Wetter?** Meist schön mit gelegentlichem Ereignis, oder fast immer zieht irgendwo etwas durch?
3. **Trifft das Gewitter dich?** Zieht es von selbst durch die Welt, und man kann davonfahren, oder sorgt die Regie dafür, dass man ab und zu hineingerät?
4. **Schnee wo?** Nur im Schneeland, oder selten auch als Überraschung in der Wüste?
5. **Karten-Himmel:** Bild ansehen: viele kleine Karten oder wenige große? Und: nur bei besonderen Anlässen, wie WS0 vorschlägt?
6. **Tageslänge** (Teil von WS1): Soll ein Tag schnell vergehen wie bei TinySkies, gut drei Minuten, oder deutlich länger?

## Quellen
- TinySkies, lokaler Quelltext `KFB VoxelWorld/tinyskies-…/client/src/game/`
- Lagarde: [Dynamic rain and its effects](https://seblagarde.wordpress.com/2012/12/27/water-drop-2a-dynamic-rain-and-its-effects/), [Physically based wet surfaces](https://seblagarde.wordpress.com/2013/04/14/water-drop-3b-physically-based-wet-surfaces/)
- Tatarchuk, [Artist-Directable Real-Time Rain Rendering](https://advances.realtimerendering.com/s2006/Chapter3-Artist-Directable_Real-Time_Rain_Rendering_in_City_Environments.pdf), nur als Überblick: Blitz, Pfützen, Tropfen im selben Demo
- OpenMW-Wetter [Commit](https://git.cijber.net/mirror/openmw/commit/29d74f024910c36ad6a474dbca4ccffe7db2e073.diff), [Thunderhead](https://www.curseforge.com/minecraft/mc-mods/thunderhead), [Roblox-Wettersystem](https://builtbybit.com/resources/weather-system-storms-rain-snow.107475/), nur Suchauszug
- Schnee-Maske: [UE4-Shader-Guide](https://80.lv/articles/shader-guide-for-ue4), [Godot Snow-Covered Surface](https://godotshaders.com/shader/snow-covered-surface/); [Batman Arkham Origins, GDC 2014](https://gdcvault.com/play/1020177/Deformable-Snow-Rendering-in-Batman), Inhalt nicht gelesen
- Wolken: `CANON_3D/sources/WS1_WOLKEN_R1_RECHERCHE.md`, Quellen dort, nicht neu geprüft
- Donor: `KFB Organ-Inseln + race track v4+/lab-sky/`, `docs/RETURN_SKY1.md`
