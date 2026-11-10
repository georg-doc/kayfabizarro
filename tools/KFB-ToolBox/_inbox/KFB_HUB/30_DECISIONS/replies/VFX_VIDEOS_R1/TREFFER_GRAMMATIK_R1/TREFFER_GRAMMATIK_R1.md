# Treffer-Grammatik R1 (Flug, 11.11.2026) · Lieferung 1 von 3, noch nichts gebaut

Grundlage: alle 37 Prefabs der drei Unity-Pakete ausgelesen (Unity-YAML, je Teilsystem Lebensdauer, Größe, Größe und Farbe über die Zeit, Bursts, Flipbook-Raster, Verzögerung, Ausrichtung, Mischung). Die Zuordnung Material → Textur stammt aus den Original-Paketen in Georgs Unity-Cache (nur gelesen), weil die entpackte Kopie keine .meta-Dateien hat. Alle 82 Texturen habe ich angesehen.

- Bilder: U1/U2 (Wallcoeur Impact, alle Flipbooks), U3 (Wallcoeur Fire), U4 (PolyOne Fire).
- Rohdaten: `rezepte/` (je Paket eine JSON mit allen Werten, `impact.txt`/`fire.txt` als Lesefassung, Parser `uparse.py`). Der Einbau liest diese JSONs, es wird nichts abgetippt.

## 1 · Was die Rezepte des Künstlers gemeinsam haben

**Wallcoeur Impact & Hit (17 Rezepte, alle einmalig):**
- Jede Schicht zündet genau einmal bei t = 0 (Burst mit 1–10 Stück). Keine Geschwindigkeit, keine Schwerkraft: nichts fliegt. Ein Treffer ist ein **Stapel gezeichneter Bildfolgen am Kontaktpunkt**, alle zur Kamera gedreht.
- Lebensdauer je Schicht 0,1–0,6 s (eine Ausnahme 1,0 s). Die Bildfolgen haben 9 Bilder (3×3) und laufen genau einmal über die Lebensdauer, also 15–30 Bilder je Sekunde.
- Fünf Rollen kehren wieder:

| Rolle | Rezeptwerte | Aufgabe |
|---|---|---|
| **Blitz** | Einzelbild (Zbam2, Flare2), 0,1–0,2 s, 2–6× so groß wie der Kern, Deckung 1 → 0 | der Kontaktmoment, 1–2 Zeichnungen |
| **Kern** | Bildfolge, 0,3–0,5 s; Größe springt in den ersten 6–25 % der Lebensdauer von 0 auf 1 und hält dann; Ausblenden erst ab 49–62 % | die Form des Treffers |
| **Echo** | dieselbe Bildfolge 2–3× größer und länger (0,5–1,0 s), zufällig gedreht | Nachhall, liest sich als Ring |
| **Dunkle Unterlage** | schwarze Kopie (Zbam2, normal gemischt), 0,2–0,3 s, unter den hellen Schichten | Kontrast auf hellem Grund (nur Classic_03, Classic_04, Blood_02) |
| **Streuung** | 5–10 kleine Kopien, zufällig gedreht, 0,2 s | Funkel-Kranz ohne Flug |

- Richtung: runde Formen sind zufällig gedreht; gerichtete Formen (ImpactValo-Spitzen, Critical) haben Drehung 0 und zeigen fest nach oben. Das Prefab selbst steht mit −90° um X, „oben“ ist also die Normale.
- Farbe: weiße Zeichnung, über die Startfarbe gefärbt (Orange #ff9100–#ffbb00, Kern weiß) oder über einen Verlauf Weiß → Orange. 74 Materialien mischen additiv, 15 normal.
- Verzögerung nutzt nur ein Rezept: ImpactCritical_Pink schickt nach 0,1 s eine zweite Welle.

**Wallcoeur Fire (14 Rezepte, alle Schleifen):** 5–15 Stück je Sekunde aus einem Punkt, Kreis oder einer Kante; Lebensdauer 0,5–1 s; Bildfolge 3×3 einmal je Leben; Startgeschwindigkeit 0–0,5; **negative Schwerkraft −0,2 bis −0,5** (steigt); zufällig gedreht. Flamme additiv, Rauch normal gemischt und erst eingeblendet (Deckung 0 → 1 bis zur Hälfte), Rauch sitzt über der Flamme (+0,23). Bodenfeuer hat zusätzlich eine flach liegende Glutschicht.

**PolyOne Fire (5 Farbvarianten, Schleifen):** weiche 6×6-Feuerfolge (36 Bilder), dazu ein pulsierender Lichtschein und die einzige **fliegende** Schicht aller drei Pakete: „dust“, 20 Funkenstriche je Sekunde, Tempo 2–10 im 32°-Kegel, Rauschen 0,7, Bremse 0,1.

## 2 · Steckbrief je Prefab

Schreibweise: Textur · Stückzahl × Größe · Lebensdauer · Besonderheit. Größen sind Unity-Einheiten; für KFB zählen die Verhältnisse zwischen den Schichten.

### Wallcoeur Impact & Hit
| Prefab | Schichten (von unten nach oben) | Gedacht für |
|---|---|---|
| **Classic_01** | ImpactCircle 2 × 1 · 0,5 s · wächst in 16 % ‖ ImpactCircle 2 × 3 · 0,6 s · wächst in 26 % (Echo) ‖ Flare2 1 × 6 · 0,2 s (Blitz) ‖ Zbam2 1 × 6 · 0,1 s · wächst und blendet aus (Blitz) | runder Treffer, mittel |
| **Classic_02** | A_ImpactCircle 1 × 1 · 0,5 s ‖ A_ImpactCircle 2 × 2 · 0,2 s ‖ Muzzle2p2 (2×2 Zackenstern) 1 × 3 · 0,2 s ‖ ImpactCircle 2 × 3 · 1,0 s (langes Echo) | harter Treffer mit Zackenstern |
| **Classic_03** | Zbam2 schwarz 1 × 2 · 0,3 s (Unterlage) ‖ Zbam3 1 × 2 · 0,6 s · wächst in 9,5 %, blendet ab 49 % ‖ Zbam2 orange 1 × 2 · 0,3 s ‖ Zbam2 weiß 5 × 1 · 0,2 s (Streuung) | **Schlag-Blitz „Zbam“**, Faust; ohne Bildfolge, nur Wachsen und Ausblenden |
| **Classic_04** | Zbam2 schwarz 1 × 2 · 0,2 s (Unterlage) ‖ NoiseHack8_Paint 3 × 2 · 0,6 s ‖ ImpactCircle weiß 10 × 2 · 0,2 s (Streuung) | gemalter Ring, der zerfällt; großer Treffer |
| **Critical_01** | ImpactValo weiß 3 × 1,5 · 0,3 s · wächst in 25 % ‖ ImpactValo orange 5 × (1 breit, 2 hoch) · 0,4 s · blendet aus ‖ ImpactValo4 orange 5 × 1 · 0,5 s · **alle ungedreht, Spitzen entlang der Normale** | schwerer, gerichteter Treffer |
| **Critical_02** | ImpactValo3 3 × 2 · 0,3 s ‖ ImpactValo4 5 × 1 · 0,5 s · ungedreht | wie Critical_01, schlanker |
| **ImpactClassic01_1.1.0** | Impact04 (feines Kreuzfunkeln) 1 × 3 · 0,6 s · wächst in 29 % ‖ Impact05 (Funkeln mit Ring) 1 × 2 · 0,4 s · blendet ab 62 % ‖ Impact01 (Strichstern) 1 × 3 · 0,2 s · wächst in 6 %, Weiß → Orange | leichter, scharfer Treffer mit Strichen: Einschuss, Metall |
| **ImpactCritical_1.1.0_Pink** | SllashV2 (Hiebstriche) violett 1 × 3 · 0,2 s ‖ Impact08 (Vierzack) pink 1 × 3 · 0,5 s ‖ **nach 0,1 s** Impact07 (schräge Tempolinien) 1 × 4 · 0,2 s ‖ Impact08 weiß 2 × 4 · 0,2–0,3 s · ungedreht, ganz oben | kritischer Treffer mit zweiter Welle und Tempolinien |
| **ImpactCross_1.1.0** | Impact06 (X) weiß 1 × 2 · 0,3 s ‖ Impact06 orange 1 × 2 · 0,6 s · **Bildfolge hält in der Mitte an** (32–64 % der Lebensdauer auf demselben Bild) ‖ Impact03 (zerbrechender Rahmen) 1 × 2 · 0,2 s | Kreuz-Treffer mit Halt: Block, Abpraller |
| **ImpactToon_1.1.0** | SllashV2 orange 1 × 3 · 0,2 s ‖ Impact09 (Toon-Stern mit Tropfen) 1 × 2 · 0,4 s | kleiner Cartoon-Treffer |
| Arcade_01–03 | Pixel-Fassungen (ImpactValoPixel, LiquidPixel, VFX_Impactv2) | Pixel-Look, passt nicht zu KFB |
| Blood_01, Blood_02 | Blood (Spritzer, normal gemischt) 0,3–0,5 s; Blood_02 mit zwei gekreuzten SlashV4-Hieben | Spritzer bzw. Schnitt; die Hieb-Schicht ist das Vorbild für Klingen |
| Poison_01 | Liquid (Flüssigkeits-Platscher, normal gemischt) 2 Schichten · 0,3 und 0,5 s | Flüssigkeit, Goo |
| Poison_02 | MuzzleV3 (4×3 Stichflamme) · 0,5 s ‖ MuzzleV7 · 0,4 s ‖ ImpactShotValo2 · 0,4 s | Mündungs- bzw. Energieflamme |

Ohne Rezept in der Light-Version liegen 48 weitere Flipbooks bei, darunter genau die bisherigen Lücken: **SlashOne, SllashV3, SplashV2, CircleImpact02/04** (Sicheln), **SlashV3/V5, Impact02/10** (Striche), **Zbam, Zbam4** (Zacken), **FP_SmkImpact** (flache Cartoon-Rauchwolke), **VFX_FP_SmokeCircleGround** (Rauchring am Boden, von oben), TrailShot (Geschoss-Spur), Triangle (Scherben). Regel für sie: Sie dürfen nur eine vorhandene Rolle mit gleichem Raster in einem Rezept besetzen (Textur tauschen, Werte bleiben). Neue Rezepte baue ich daraus nicht.

### Wallcoeur Fire
| Prefab | Schichten | Gedacht für |
|---|---|---|
| **Fire** | a_VFX_flame 10/s · Leben 0,8–1 s · Größe 0,4–0,6 · steigt ‖ A_Smoke (kantige Flächen) 10/s · 0,5–0,7 s; beide blenden ab 40 % aus | einfache Flamme |
| **Fire 1** | A_Smoke normal gemischt 10/s · Verlauf Gelb → Orange → Rot → Schwarz, schrumpft ab 37 % auf 0 ‖ A_Smoke additiv, kleiner, heller Kern | Flamme, die in einer Schicht zu Rauch wird |
| **TorchLight** | a_VFX_flame 5/s ‖ A_Smoke 10/s, wächst in 16 % ‖ schwarzer Rauch 5/s, 0,23 darüber, blendet ein | Fackel, Brandherd mit Rauch |
| **GroundFire_Circle / _Line** | Glutschicht flach am Boden 5–10/s · Größe 2 ‖ Flammen 15/s aus Kreis r 1 bzw. Kante ‖ grauer Rauch 10/s, blendet ein und aus | Brandfläche bzw. Brandlinie |
| **Smoke, BlackSmoke** | A_Smoke_2 10/s · 1 s · steigt · blendet ein | Rauchfahne |
| _Green-Varianten, GreenTorchLight | dieselben Rezepte in Grün (#00ff69) | Gift, Magie |

### PolyOne Fire
| Prefab | Schichten | Gedacht für |
|---|---|---|
| Fire Effects Red/Blue/Green/Purple/White | fire_6x6 (weich, 36 Bilder) 6/s · Leben 0,8–1,6 s · Größe 2,5 · Farbverlauf ‖ glow 1 × 5 · 2,5 s pulsierend ‖ „dust“ 20 Funken/s · Tempo 2–10 · Kegel 32° · Rauschen | weiches Feuer mit Funkenflug; realistischer als Wallcoeur |

## 3 · Übertragung nach KFB (feste Regeln)

1. **Werte 1:1 aus den JSONs:** Stückzahl, Lebensdauer, Größenverhältnisse, Größe und Farbe über die Zeit, Bildkurve, Verzögerung, Reihenfolge. Maßstab je Ereignis: eine Zahl (Kerngröße in Metern × Weltmaßstab), alle Schichten skalieren mit.
2. **Zur Kamera:** über bildparallel.js (q495).
3. **Richtung:** Gerichtete Formen zeigen im Rezept fest nach oben. In KFB drehe ich sie in der Bildebene auf die Schlagrichtung bzw. die Oberflächennormale. Runde Formen bleiben zufällig gedreht.
4. **Ort:** der echte Kontaktpunkt auf der Oberfläche; das Ziel steht in Clip-Reichweite, die Faust dringt nicht ein (schon so im Stand @ad4d8683, gemessen).
5. **Was fliegt, kommt vom Material, nicht aus dem Treffer-Stapel:** Die Impact-Rezepte enthalten keine fliegenden Teile. Splitter, Brocken und Funken liefert die vorhandene Material-Antwort (explosionShards, Material-Kontakt), in Schlagrichtung, mit Schwerkraft. Bodenstaub nur bei Bodenkontakt.
6. **Zeitfolge:** Ankündigung (Clip) → Wisch → Blitz im Kontaktbild → Hitstop → Kern und Echo → Material-Nachlauf → Erholung. Der längste Kern dauert 0,6 s; die Hauptform ist weg, bevor der nächste Angriff trifft (Faust-Clip 0,8 s).
7. **Mischung:** siehe offene Punkte 1.

## 4 · Ereignis → Rezept → Kaskade

| Ereignis | Quelle und Rezept | Schichten und Timing (ab Kontaktbild) | Material | Richtung | Kaskade danach |
|---|---|---|---|---|---|
| **Faust-Kontakt** | Rezept **Classic_03**; Kern = Georgs Trefferblitz 4×2 statt Zbam3 | Unterlage Zbam2 dunkel 0–0,3 s ‖ Blitz Zbam2 0–0,1 s, 3× Kern ‖ Kern Georgs Blatt 8 Bilder in 0,29 s, in 2–3 Bildern auf volle Größe ‖ Streuung 5 kleine Zbam2 0–0,2 s. Hitstop 48 ms liegt über dem Blitz. | Holz: 3 Späne; Knete: 2 Brocken; Metall: Funken; Papier: Fetzen (vorhandene Rezepte) | Kern und Blitz in Schlagrichtung; Späne fliegen in Schlagrichtung, fallen, liegen kurz | Ziel reagiert (vorhanden); kippt es um → Ereignis Bodenaufschlag |
| **Uppercut-Kontakt** | Rezept **Critical_01** (gerichtet) über Georgs Trefferblitz als Kern | wie Faust, dazu: ImpactValo weiß 3 × 0–0,3 s ‖ ImpactValo gestreckt 5 × 0–0,4 s ‖ ImpactValo4 5 × 0–0,5 s, alle entlang der Schlagrichtung nach oben | wie Faust, Stücke nach oben vorn | Schlagrichtung = Faustbahn im Kontaktbild (nach oben) | Ziel hebt ab; landet es → Bodenaufschlag |
| **Bodenaufschlag / schwere Landung** | Kern = Georgs Bodenausbruch 3×3; Bodenring = VFX_FP_SmokeCircleGround in der Echo-Rolle von **Classic_01** | Kern 9 Bilder in 0,41 s, Ring auf der Bodenebene ‖ Rauchring flach am Boden, 3× Kern, 0–0,6 s, wächst in 26 % ‖ Blitz Zbam2 0–0,1 s | Bodenton färbt den Rauchring; Sand und Erde: Staub ist hier erlaubt (Bodenkontakt) | Normale = oben, Ring breitet sich am Boden aus | lose Teile in der Nähe wackeln (vorhanden); kleiner Kamerastoß. Auslöser heute: Landung ab 1,8 m Fallhöhe |
| **Pistole, Treffer** | Rezept **ImpactClassic01_1.1.0** als Hauptmoment (ersetzt den Blitz „scorch“) | Impact01 Strichstern 0–0,2 s, in 1 Bild auf volle Größe, Weiß → Orange ‖ Impact05 0–0,4 s ‖ Impact04 0–0,6 s. Größe × 3 (q586) bleibt. | Einschussmarke bleibt (vorhanden); Metall: Funkenflug; Knete: Brocken; Staub nur, wenn der Treffer am Boden liegt | Striche entlang der Normale der getroffenen Fläche | Geschoss endet; Marke 6 s |
| **Blaster, Treffer** | Rezept **ImpactCritical_1.1.0_Pink** 1:1 (ist schon pink/violett) | SllashV2 0–0,2 s ‖ Impact08 0–0,5 s ‖ Impact08 weiß 2 × 0–0,3 s ‖ **zweite Welle ab 0,1 s:** Impact07 Tempolinien 0,1–0,3 s | Entladungsfunken (vorhanden), Marke | Normale | zweite Welle ist Teil des Rezepts |
| **Explosion am Boden** (Granate, Rakete, Clownbombe) | Besitzer bleibt explosionSheets (Rauch und Feuer), Splitter, Papier. Dazu als Satzzeichen: **Classic_04** und Georgs Bodenausbruch, größer | Blitz und Unterlage 0–0,2 s ‖ gemalter Ring 3 × 0–0,6 s ‖ Streuung 10 × 0–0,2 s ‖ Bodenausbruch 0–0,41 s ‖ danach vorhandener Rauch | Trümmer im Material des Ziels (vorhanden) | radial von der Bodenebene | Nachbrand: **GroundFire_Circle** 2–4 s, dann Emission aus und Auslaufen ≤ 1 s; darüber **BlackSmoke** |
| **Feuer am Gebäude** | **TorchLight** je Brandherd, **GroundFire_Line** am Wandfuß, **Fire 1** an der Wandfläche | Schleifen: Flamme 5–15/s, Leben 0,5–1 s, steigt; Rauch 0,23 darüber, blendet ein | Brennstoff bestimmt den Ort: nur an getroffenen bzw. brennbaren Flächen | wächst von der Basis nach oben, Rauch darüber | Ende: Emission aus, läuft in ≤ 1 s aus; Brandmarke bleibt (vorhanden) |

Mündung, Geschoss-Spur, Klingen und Goo sind nicht Teil dieser Tabelle. Rezepte dafür liegen bereit (Poison_02/Classic_02 für Mündung, TrailShot, Blood_02-Hiebschicht, Poison_01).

## 5 · Offene Punkte (gesammelt, bitte mit dem Go beantworten)

1. **Mischung auf hellem Grund.** Die Pakete mischen meist additiv; auf der hellen KFB-Welt wird das zu weißem Matsch. Der Künstler löst es in drei Rezepten mit der dunklen Unterlage. Vorschlag: Kern und Echo normal gemischt in der Rezeptfarbe, additiv nur der Blitz, und die dunkle Unterlage bei jedem Treffer. Das ist die einzige Stelle, an der ich von 1:1 abweiche.
2. **Farbe je Waffe.** Die Rezepte sind orange. Vorschlag: Faust und Uppercut im Gelbweiß von Georgs Blatt, Pistole Weiß → Orange wie im Rezept, Blaster pink/violett wie im Rezept. Andere Waffenfarben folgen der vorhandenen Zuordnung.
3. **Wisch.** Georgs Blatt kommt später. Bis dahin bleibt der Wisch still, oder ich zeige SllashV3 bzw. SlashOne als Kandidaten in der Hiebschicht-Rolle (0,2 s, Größe 1,5× Kern, in Schlagrichtung statt zufällig). Ich würde still bleiben.
4. **Besitz.** Explosion (explosionSheets) und Feuer am Gebäude (campfire, wall-afterburn) gehören nicht mir. Soll ich dort nur die Satzzeichen-Schichten liefern und der Besitzer hängt sie ein, oder baue ich sie hinter einem eigenen Schalter ein?
5. **Umfang von Lieferung 2.** Vorschlag: Faust, Uppercut, Bodenaufschlag, Pistole, Blaster in einem Schritt; Explosion und Feuer erst nach deiner Antwort zu Punkt 4.
6. **Ablage.** Die Texturen liegen unter src/private/unity_vfx_r1 und werden nicht committet. Für den Einbau brauche ich den Weg, auf dem sie ins private Asset-Repo kommen (läuft über dich).
7. **Nicht vorgesehen:** Pixel-Rezepte (Arcade), Blut. PolyOne-Feuer ist weich und realistisch; ich würde daraus nur den Funkenflug („dust“) für Metall und Feuer nehmen.
