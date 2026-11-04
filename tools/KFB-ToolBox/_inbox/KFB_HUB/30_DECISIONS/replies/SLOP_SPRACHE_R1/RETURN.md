# RETURN · Slop-Sprache, Treffer-Codes, Zerfall · R1 (WS-Flight → WS0, 04.11.2026)

Konzept-Probe auf Auftrag von WS0 (03.11.). Nichts davon ist im Spiel.





## Slop-Tod R6 · Platzen in einem Zug (Georg TUNE und Blind-Kritik R2, 04.11.)
- Nur noch ein Slop-Tod: Goo ist Standard für alle Ink-Slops; keine Explosion, keine Kisten, kein Rauch mehr.
- Platzen: Aufblähen mit Zittern und Wabbeln. Dann zerreißt der Blob in unregelmäßige 3D-Papierschnipsel mit seinem eigenen Bild (Rückseite Papier), dazu viele kleine Goo-Tropfen und D-förmige Tusche- und Papierschnipsel. Danach kommt eine niedrige Goo-Krone. Pfütze, Schnipsel und Tropfen liegen und sickern ein, der nasse Fleck trocknet.
- Goo knetig-matt, ohne Blaustich und Silber; gefärbte Varianten mit gedämpftem Glanz.
- Größen gleich (1,5 m × skala), Atlas-Seite 2 (Politik) im Spiel geprüft.
- Belege: `SLOP_GOO_R6_SPIEL.mp4`, `SLOP_GOO_R6_NAH.mp4`, `SLOP_GOO_R6_SEITE.mp4` (mit Ton), `SLOP_GOO_R6_UMKREISEN.mp4`, `SLOP_GOO_R6_JEDES_BILD.png`, `SLOP_GOO_R6_FARBEN.png`.
- Kritiker über die Runden: 5 · 5 · 6 · 5,5 · 6 · 5 · 6 · 6 (Endstand). Offen: Der Riss-Moment springt im Beleg in einem Bild (der Prüflauf läuft unter 30 fps; im Spiel sind 0,1 s Anreißen mehrere Bilder), die Krone ist noch zu spitz und glänzend, einzelne Schnipsel zeigen sich als Kante, aus 9 m wirkt der Tod klein.
- Kontroll-Eskalation K0–K3 (hinter kontrolle=1): `KONTROLLE_R1_K0_K3.mp4`. Abschüsse zählen, Unruhe, Nachschub springt von der Hausstelle, die Streife kommt und spricht, Bingo senkt den Zähler.

## Slops bildparallel (2,5D wie HD-2D) · R1 (04.11., Schalter slopbewegung=1 bzw. slopgoo=1)
Georg: „das habt ihr immer noch nicht drauf“ – Tafeln drehten sich schräg. Jetzt richtet sich jede Slop-Tafel im Shader nach der Kamera, die gerade rendert: rechts = Kamera-Rechte waagrecht, oben = Welt-Oben, parallel zur Bildebene (nicht zum Kamera-Ort gedreht, kein Schwenk mehr). Schaut die Kamera steil von oben, lehnt die Tafel sich höchstens 20° zurück. Richtung nur per Spiegeln mit kurzem Squash-Flip (nie schmaler als gut die Hälfte, erst wenn die neue Laufrichtung kurz anhält). Gilt für Blob, Treffer, Schreck, Tod, Goo-Hügel, Krone und fliegende Tropfen; Pfütze und Perlen liegen flach.
- Recherche (Paper Mario, Octopath/HD-2D, Don't Starve, Cult of the Lamb): alle richten nach der Blickrichtung der Kamera aus, spiegeln statt zu drehen und begrenzen zusätzlich die Kamera-Neigung; Kontaktschatten unter dem Fuß.
- Beleg: `SLOP_BILDPARALLEL_R1_UMKREISEN.mp4` (Kamera 180° um die Gruppe mit Treffer und Goo-Tod, dann vorbei), `SLOP_BILDPARALLEL_R1_UEBERSICHT.png`.
- Kritiker: keine Tafel schräg, als Kante oder als Karte; Kreisfahrt 9, Vorbeifahrt 9, Treffer und Krone 8, gesamt 8/10. Hinweis: im Sprung schwebt der Blob sichtbar über seinem Schatten.

## Slop-Tod Goo · R4 nach Georgs Urteil (04.11., Schalter slopgoo=1)
Georg: „klappt so noch nicht“ – Blobs drehten sich als flache Figuren, der Übergang zum Spritzer fehlte, Wechsel flackerten. Jetzt:
- **Ausrichtung:** Blobs stehen immer zur Kamera und schwenken beim Hüpfen und Laufen höchstens etwa 20° in die Laufrichtung; kein Spiegeln mehr.
- **Blob wird zum Goo:** Er bläht sich auf und zittert, sackt zum Boden, staucht sich und dunkelt zur Goo-Farbe. Dann wächst an derselben Stelle ein Goo-Hügel aus seiner Mitte über ihn, und er wird hineingesaugt. Aus dem Hügel wächst die Krone, die Krone sackt in die Pfütze.
- **Weich:** Jeder Bildwechsel wächst aus der dicksten Stelle bzw. zieht sich dorthin zurück (keine Überblendung, keine Transparenz, kein harter Tausch); Clips steigen weich ein und aus; Atlas vorgewärmt.
- **Dazu:** Eigener nasser Fleck, der den Boden abdunkelt und vom Rand her trocknet; dunkle Randkante und aufgehellte dunkle Farben für jeden Boden; Tropfen in die Tiefe gestreut; die schwarzen Landeflecken vom Hüpfen sind jetzt dieselben Goo-Perlen.
- Belege: `SLOP_GOO_R4_SPIEL.mp4`, `SLOP_GOO_R4_NAH.mp4` (mit Ton), `SLOP_GOO_R4_JEDES_BILD.png` (jedes Bild 3,5–4,8 s), `SLOP_GOO_R4_FARBEN.png`.
- Flacker-Suche Bild für Bild (scripts/fx/flacker_suche.py): Spielkamera ohne Fund; Nahkamera nur Stellen, an denen die Kamera dem hüpfenden Blob folgt.
- Kritiker (Frage „liest sich der Blob nie als flache Karte, und ist jeder Übergang weich?“): R5 5, R6 5, R7 5, R8 6, **R9 7/10** (Ausrichtung 8, wird zum Goo 7, weich 6, Pfütze und Fleck 8, Look 7). Offen laut Kritiker: Kronen-Zusammensacken noch etwas schnell, der Hügel wird beim letzten Blob-Rest kurz schmaler, gefärbte Pfützen mit leichtem Schattenrand, Lila auf lila Boden bleibt schwach.

## Slop-Tod aus Georgs Goo-Splash · R2 (04.11., Schalter slopgoo=1)
Der Blob bläht sich kurz auf und platzt in einen von Georgs gemalten Spritz-Abläufen. Die Krone sackt in die Pfütze, die Pfütze läuft breit aus und liegt flach auf dem Gelände. Die Tropfen fliegen im Bogen und bleiben als Perlen liegen. Die Pfütze sickert ein, ein nasser Fleck bleibt und trocknet. Ton wie im Spiel: Tod-Glissando ab dem Treffer, nasser Klatsch beim Platzen.
Umfärben im Code: Helligkeit und Glanz bleiben, die Farbe wechselt (sechs Story-Farben aus dem HUD).
- `SLOP_GOO_R2_SPIEL.mp4` (11 s, Spielkamera, Blob 9 m vor der Kamera, Treffer bei 3,5 s), `SLOP_GOO_R2_NAH.mp4` (11 s, Nahkamera).
- `SLOP_GOO_R2_FARBEN_krone.png`, `SLOP_GOO_R2_FARBEN_pfuetze.png`: vier Blobs in comic, absurd, heroic, mystical.
- Kritiker R1 5/10 (Platzen wirkte wie Bildtausch, harter Sprung in die Pfütze, Einsickern nur Ausblenden), R2 nach Zusammensacken, Auslaufen und nassem Fleck: **7/10**. Offen laut Kritiker: Der nasse Fleck trocknet zu einem hellen Lila-Grau statt dunkel vom Rand her, Lila auf lila Boden geht unter, die Flugtropfen liegen alle in einer Bildebene.
- Code: fx/slop-r1 (src/npc/slopGoo.js, scripts/fx/goo_atlas.py), Bilder privat: assets/slop-goo-r1.

## Belege (dieser Ordner)
- **Ton** (Standbild des 3er-Mobs, Blasentext am Sprecher, −16 LUFS):
  - `SLOP_R1_1_PLAUDERN.mp4` (12 s): Die drei ergänzen sich zu einer Melodie, zweimal mit Schluss im Dreiklang.
  - `SLOP_R1_2_GETROFFEN.mp4` (11 s): Mitte wird mitten im Satz getroffen. Bass und Oben regen sich auf, höher, schneller und dichter, und sprechen am Ende zusammen.
  - `SLOP_R1_3_TOD.mp4` (15 s): drei Tod-Glissandi nacheinander (Oben, Mitte, Bass).
  - `SLOP_R1_4_TREFFERCODES.mp4` (12 s): Gebäude, Slop ungepanzert und Slop gepanzert, je zweimal.
- **Zerfall:**
  - `SLOP_R1_Storyboard_1.jpg` und `SLOP_R1_Storyboard_2.jpg` (2 Folien mit je 2 Bildern).
  - `SLOP_R1_ZERFALL_VORN.mp4` und `SLOP_R1_ZERFALL_SEITE.mp4` (je 10 s, mit Ton): echtes Spiel, ein Treffer, Kamera von vorn bzw. von der Seite.
- `KONZEPTBLATT_SLOP_R1.md`: eine Seite dazu, wie Ton und Bild zusammenspielen.

## Code (Branch `fx/slop-r1`, aufbauend auf `game/inkblobs-r1`)
- `src/audio/slopVoice.js`: Stimme, rein und Node-fest.
  - Planer aus probe_r10 (Modus A);
  - Blasen-Synthese (Minnaert, van den Doel);
  - Mob-Satz mit Halteton und Dreiklang, Aufregung, Tod-Glissando, Ducken.
- `scripts/audio/slop-probe.mjs`, `slop-clips.py`, `slop-zerfall-ton.mjs`: Hörproben und Clips.
- `src/npc/slopZerfall.js`: der Zerfall-Effekt, ein InstancedMesh.
  - Die Schnitte werden im Shader ausgewertet, gerade und kreisförmig.
  - Die Papier-Physik rechnet die CPU.
  - Tropfen kommen aus dem vorhandenen Pool, die Pfütze aus der vorhandenen Spur.
- `src/npc/mobs2d.js`: hinter `slopzerfall=1`.
  - Der Zerfall ersetzt das Platzen.
  - Der tödliche Treffer zerreißt sofort, ohne Umfallen.
  - Die Waffen-Explosion hat dann die Größe „puff“.
  - Prüf-Haken `wound(i, hp)`.
- `test/inkblobs.mjs zerfall`: PASS. 18–20 Schnipsel je Blob, alle liegen am Ende, keine Fehler. Die Kamera folgt dem Blob.
- ElevenLabs-Basisschicht: `40_AUDIO/elevenlabs_r1/slop_treffer_r1/`, 8 Clips, etwa 550 Credits.

## Ehrlich
- Den Ton habe ich nicht gehört. Geprüft sind Spektrum, Lautheit und Ablauf.
- Gefunden und behoben: tiefes Brummen durch Differenztöne bei Sättigung auf dem ganzen Bus, dazu klickende Plopps.
- Bild-Schwächen stehen im Konzeptblatt:
  - Die Rückseite wirkt noch flach.
  - Auf der Pfütze haben die liegenden Schnipsel wenig Kontrast.
  - Von der Seite ist der Blob nur ein Strich.
- Für den Zerfall-Beleg steht ein einzelner Blob auf der Fläche, damit nichts verdeckt.
- Bildzeit ist nicht gemessen; der Aufwand ist klein (bis 384 Schnipsel als ein Zeichenaufruf).

## Runde 2 (04.11.): Georgs Ton-Urteil und WS0-Rückgabe zum Zerfall
**Ton** (Georg: „noch ein bisschen dumpfer und blubbriger, Richtung gut“): `SLOP_R2_1_PLAUDERN` … `SLOP_R2_4_TREFFERCODES`, gleich aufgebaut.
- Klang:
  - Tiefpass von 1500 auf 900 Hz, Chirp langsamer (0,08 → 0,045), Blasen klingen länger;
  - weniger Obertöne, weichere Plopps;
  - 1,5-mal mehr Blasen je Silbe, jede zweite mit einer großen, zähen Blase eine Oktave tiefer;
  - zähes Nachblubbern (4 sinkende Blasen) am Ende jeder Phrase.
  - Harmonie und Ensemble bleiben unverändert.
- Messung: Energie über 300 Hz von 2,0 % auf 0,9 %. Gehört habe ich es nicht.
- Standbild neu: drei etwa gleich große Blobs (±5 %) nebeneinander, ohne Laufspur.
- Keine Sprechblasen mehr; nur die Treffer-Codes in Clip 4 sind beschriftet.

**Zerfall:** `SLOP_R2_Storyboard_1/2.jpg`, `SLOP_R2_ZERFALL_VORN.mp4`, `SLOP_R2_ZERFALL_SCHRAEG.mp4` (30° seitlich, mit Ton).
1. Kein Puff mehr, keine Explosion beim Slop-Tod. Der Akzent ist der Riss selbst, dazu Tinte aus den Schnitten.
2. Bögen dominieren:
   - zwei große, sich schneidende Kreise und zwei Bisse am Rand;
   - nur zwei Geraden, fast rechtwinklig und versetzt;
   - dünne Splitter (Füllgrad unter 30 %) fallen weg.
3. Rückseite in warmem, hellerem Weiß mit Papierfaser, Druck scheint nur leicht durch. Die Vorderseite hat einen hellen Papierrand an der Schnittkante.
4. Die Pfütze entsteht erst aus dem Zerfall: 1,2 s liegen, dann 3,5 s einsickern, kleiner und blasser. Die Laufspur ist im Beleg abgeschaltet.
5. Kamera vorn und 30° seitlich, sie folgt dem Blob. Kein Strich mehr.
6. Klonk-Funke: wartet auf Georgs Ton-Urteil.

**Ehrlich:**
- Die liegenden Schnipsel sind am Ende klein und blass, auf Folie 2 rechts kaum zu sehen.
- Die kleinen Schnipsel fliegen teils noch oben aus dem Bild.
- Code: `fx/slop-r1`; Prüf-Haken `inkClean`, `sizes`, `pose`; Testmodus `mobbild`.

## Runde 3 (04.11.): Zerfall als „Papier reißt“ (WS0-Rückgabe), ein Kritiker auf dem Endstand
Belege: `SLOP_R3_Storyboard_1/2.jpg`, `SLOP_R3_ZERFALL_VORN.mp4`, `SLOP_R3_ZERFALL_SCHRAEG.mp4` (mit Ton).
- Umgesetzt:
  - wenige große Stücke: ein großer Bogen und ein gerader Riss am Gesicht vorbei, zwei Bisse am Rand;
  - Drehung um eine waagrechte Achse, damit die helle Rückseite zeigt;
  - 4 statt 14 Tropfen, kein Treffer-Spritzer beim tödlichen Treffer;
  - die Stücke liegen 5 s auf dem Hang (meist Papierseite oben) und verblassen dann;
  - Kamera 5 m weg, 1 m höher.
- **Kritiker** (ein Durchlauf, blind auf Bildfolgen und Folien): „liest sich als Papier“ **3/10**, „ein Effekt“ **4/10**. Die Kernpunkte stimmen mit meiner eigenen Prüfung überein:
  1. Das große Stück wirkt wie ein Brett: gerade Kante, kein heller Rissrand.
  2. Es fällt zu schnell (in unter 0,5 s flach), Kippen und Flattern sind kaum sichtbar.
  3. Am Ende liegt eine helle Fläche ohne Gesicht, die Pfütze liest sich als Schatten.
  4. Splitter und ein naher Tropfen (schwarzer Ring) wirken wie eigene Effekte.
- **Vorschlag R4** (gleiche eine Operation):
  - große Stücke langsam (Endtempo etwa 1,2 m/s, 1–1,5 s in der Luft), dabei sichtbar 1–2 Umdrehungen;
  - beide großen Risse als Bögen, dazu ein breiter heller Rissrand;
  - das Gesichtsstück landet mit der Druckseite oben;
  - keine Splitter, die weit wegfliegen;
  - Tropfen nur nach unten;
  - Pfütze kleiner, nur unter den Stücken.

## Runde 4–5 Zerfall im Spiel und B: Bewegungs-Bibliothek R1 (04.11.)
**Zerfall im Spiel (R4, R5):**
- Kritiker R4: 5/10 und 4/10, R5: 3/10 und 4/10. Belege `SLOP_R5_*`.
- Ursache: Das Reißen dauerte null Bilder. Deshalb wird der Tod jetzt in Remotion als Teil von B gebaut (WS0 einverstanden).

**B · Bewegungs-Bibliothek R1:**
- Belege:
  - `SLOP_BEWEGUNG_R1.mp4` (18,5 s mit Ton);
  - `SLOP_BEWEGUNG_R1_Schluesselbilder.jpg`, `SLOP_BEWEGUNG_R1_Tod_Folge.jpg`;
  - `KONZEPTBLATT_SLOP_BEWEGUNG_R1.md`.
- Kurven-Datei `60_VIDEO/remotion/src/slop-anim/slopKurven.ts` (eine Quelle für Bild, Ton und Spiel), Komposition `Slop-Bewegung`, Ton-Skript `remotion/scripts/slop-bewegung-ton.mjs`.
- Schreck-Ton (A) in `slopVoice.js` (`schreck()`), fx/slop-r1 @83e74ead.
- Kritiker (ein Lauf, Runde 2 von B): Bewegung **6/10**, „liest sich als Papier“ **6/10**, „ein Effekt“ **4/10**. Runde 1 lag bei 4, 5 und 4.
- Was trägt:
  - Ducken vor dem Schreck, gestreckter Schrei in der Luft, Landung, maßvolle Verzerrung;
  - Panik-Zickzack;
  - Risslinie und Aufblitzen der hellen Rückseite.
- Was fehlt (Liste für Runde 2):
  1. Totes Standbild von etwa 3 s nach dem Liegen. Die Pfütze erscheint gleich in voller Größe.
  2. Das Ende schrumpft schwebend, statt in eine bleibende kleine Pfütze einzusickern.
  3. Zu wenig „zwei Hälften“: Es löst sich nur ein schmaler Streifen. Umkippen ist eine starre Drehung, ohne Biegen.
  4. Die Rückseite wirkt als konturlose Fläche wie ein Loch.
  5. Nachzittern und Treffer sind in den Proben kaum zu sehen.
  6. Gesicht und Ausdruck können sich nicht ändern, das ist ein festes Bild. Dafür bräuchte es ein „erschrocken“-Bild je Blob.

## B · Runde 2 (04.11.): Hüpfen, Schreck, Treffer, Tod
- Belege: `SLOP_BEWEGUNG_R2.mp4` (9,4 s mit Ton), `SLOP_BEWEGUNG_R2_Tod_Folge.jpg`, `SLOP_BEWEGUNG_R2_Huepfen_Schreck_Treffer.jpg`.
- Umgesetzt:
  - Riss unter dem Gesicht: zwei echte Hälften, Kopf und Körper.
  - Gemeinsamer Treffer-Stoß, kein Spalt mehr zwischen den Stücken.
  - Fortlaufendes Hinlegen im Fall.
  - Die Tinte kriecht quer über das liegende Blatt, die Pfütze kommt danach, die Stücke schmelzen hinein, und eine kleine Pfütze bleibt liegen.
  - Rückseite mit Tintenkontur.
  - Treffer mit weniger Scherung, Landungen schwingen sichtbarer nach, Nachzittern 5 Hz (Ton gleich, fx/slop-r1 @e13c68cb).
- Kritiker, je ein Lauf, Noten in der Reihenfolge Bewegung / Papier / ein Effekt:
  - Runde 1: 4 / 5 / 4.
  - Runde 1b: 6 / 6 / 4.
  - Runde 2a: 6 / 6 / 5.
  - Runde 2c: 5 / 6 / 6.
  - Die Noten schwanken je Lauf um etwa einen Punkt. 7 ist nicht erreicht.
- Grundsätzliche Grenze in 2D:
  1. Flachlegen per Höhen-Stauchung liest sich immer als Squash. Echtes Hinlegen braucht perspektivische Verkürzung.
  2. Die runde Blob-Silhouette der Rückseite wirkt wie eine Wolke.
  3. Ohne Ausdrucks-Bild bleibt der Schreck schwach. Auch die Erholung (Hold) ist zu lang.
- **Häufigkeit der Familien** (aus der Platz-Logik):
  - Teen, Magie, Alien, Bau, RPG und Nerd sind gleich häufig; ohne Biom am Platz auch Kultur, dann je etwa 13 % der Blobs.
  - In ihren 6 Biomen (Wüste, Mesa, Canyon, Schnee, Moos, Pastell) stellt Kultur etwa 47 % der Blobs, jede andere Familie etwa 9 %.
  - Anführer (Mütze, König) sind zusammen etwa 8 % der Blobs, stehen aber in jeder vierten Gruppe vorn.

## Tod R6 im Spiel (04.11., Weg a)
- Belege: `SLOP_R6_ZERFALL_VORN.mp4`, `SLOP_R6_ZERFALL_SCHRAEG.mp4` (10 s mit Ton), `SLOP_R6_Storyboard_1/2.jpg`.
- Code fx/slop-r1 @8d6e928e:
  - `src/npc/slopPhasen.js` übernimmt die Phasen 1:1 aus `slopKurven.ts`; das Ton-Skript liest dieselben Marken.
  - `slopZerfall.js` R6 macht daraus zwei Stücke, ohne Splitter:
    1. Reißverschluss unter dem Gesicht.
    2. Kopf und Körper ziehen auseinander, der Körper dreht halb durch.
    3. Der Kopf kippt nach hinten um seine Unterkante und liegt mit dem Gesicht oben (echte Perspektive).
    4. Die Tinte kriecht, die Pfütze breitet sich aus, die Stücke schmelzen.
  - Die Druckseite leuchtet im eigenen Licht, damit sie beim Reißen nicht schwarz wird.
- Schreck-Erholung in `slopKurven.ts` gekürzt (36 statt 44 Bilder).
- Kritiker (ein Lauf): Papier **4/10**, ein Effekt **6/10**. Die Einheit ist die beste aller Spiel-Runden, die Lesbarkeit in Spiel-Entfernung schwach:
  1. Der Riss ist nur ein dünner Strich.
  2. Der flach liegende Kopf wird aus flacher Kamera zur Kante, das Gesicht ist nur in der Nahaufnahme lesbar.
  3. Die Rückseite und das liegende Körperstück wirken als glatte Flächen (leere Karte, Planke).
  4. Das Blatt wird kurz zur Kante (dünner Strich).

## Tod R7 im Spiel (04.11., letzte Runde nach WS0)
- Belege:
  - `SLOP_R7_ZERFALL_SPIEL.mp4`: echte Spielkamera hinter der Figur, Blob 9 m entfernt;
  - `SLOP_R7_ZERFALL_NAH.mp4`: Nahaufnahme;
  - `SLOP_R7_Storyboard_1/2.jpg`.
- Code fx/slop-r1 @9be361e2: Rissrand 2,4-mal breiter, Stücke weiter auseinander, Kopf gewölbt bei 55°, Körper knickt nur ab (32°) und behält den Druck zur Kamera.
- Kritiker (ein Lauf): Spielkamera **3/10**, Nahaufnahme **5/10**, ein Effekt **4/10**. Damit unter der Schwelle von 6. Nicht an Georg.
- Mängel:
  1. Der breite Rissrand wirkt mit seinen regelmäßigen Zacken wie Säge, Gebiss oder Spitze, nicht wie Papierfaser.
  2. Der Kopf wirkt nach dem Kippen wieder wie eine stehende Silhouette.
  3. Der Körper bleibt ein dunkler Laib mit Volumen.
  4. Die Tinte macht das Papier pauschal schwarz; die Pfütze ist eine zweite Ebene.
- Gesamtbild aller Runden:
  - Im Spiel lag „Papier“ bei 3–5, im 2D-Clip bei 5–6.
  - Die Einheit stieg bis 6 (R6), R7 fiel wieder auf 4.
  - Der Ansatz „Blob-Bild wird zu Papier“ trägt aus Spiel-Entfernung nicht: Ein dunkles, plastisch gemaltes Clay-Bild liest sich nicht als dünnes Blatt.
