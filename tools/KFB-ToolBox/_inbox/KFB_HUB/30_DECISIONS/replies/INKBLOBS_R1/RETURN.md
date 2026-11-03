# Ink-Blob-Gegner R1 · Rückgabe an WS0 (03.11.)

**Zweige:** `game/inkblobs-r1` @6e26f96e (vom Stamm @cb50ba6), privater Atlas `assets/inkblobs-r1` @e8a0e58e (Ordner `inkblobs_r1/`, gehört nach assets/private).
**Schalter:** `inkblobs=1` (schaltet mobs2d mit ein). Fehlt der private Atlas, bleiben die Platzhalter.

## Was drin ist
- **Bild:** ein Atlas, 24 Blobs aus den drei Sätzen (Teens, Magie, Mütze). Jede Gruppe ist gemischt, ohne Doppelte, der Anführer trägt Mütze. Eine InstancedMesh.
- **Licht und Farbe:** über `kfbInsert` (aus design/einfuegen-r1 unverändert übernommen, `insertMaterial`, Lichtseite wie `insertFlip` je Blob). Keine eigene Beleuchtung.
- **Hüpfen:** Vorbereitung (Stauchen), Streckung im Flug, Landestauchung mit Nachfedern, Breite gegen die Höhe (Volumen). Jeder Blob hat eigene Bodenzeiten, deshalb versetzt. Die Fortbewegung läuft nur im Sprung. Wird die Gruppe aufmerksam, springen alle hoch, versetzt nacheinander.
- **Spritzer:** schwarze, matt glänzende Tropfen als GPU-Partikel aus einem Pool (320). 4 bis 6 je Landung, 1 bis 2 beim Absprung, dazu Treffer und Zerplatzen. Sie fallen, zerplatzen flach und klein und verschwinden.
- **Spuren:** `look/inkPatch` aus dem Stamm auf dem Geländematerial (höchstens 4). Bei jeder dritten Landung einer Gruppe in Spielernähe und beim Zerplatzen; sie liegen 9 s und verblassen in 6 s.
- **Kontaktfleck** je Blob (contactBlob, instanziert), wird mit der Sprunghöhe kleiner.
- Treffer, Umkippen und Explosion S kommen unverändert aus mobs2d.

## Belege (aus dem Spiel, Testfahrt-Hash)
- `INK_1_Gruppe_vorn.jpg`: Gruppe von vorn, zwei Blobs im Sprung.
- `INK_2_Landung_Seite.jpg`: Landung von der Seite, mit Spritzern.
- `INK_3_Tintenspur.jpg`: Tintenspur am Boden, schräg von oben.
- `INK_Clip_Seite.mp4` (8 s, seitlich): Gruppe hüpft, ein Blob wird zweimal getroffen, kippt um und zerplatzt (Explosion S), Spuren bleiben.
- `bildzeit.json`: 30 Blobs plus Spritzer gegen ohne.

## Bildzeit (30 Blobs)
Im ruhigen Messpaar: Renderzeit 18,4 ms mit gegen 18,2 ms ohne, Bildzeit 24,9 gegen 24,4 ms. 3 Zeichenaufrufe mehr (Blobs, Flecken, Tropfen), Rechenzeit der Blobs 0,06 ms je Bild, etwa 150 Tropfen pro Sekunde. Die Maschine stand dabei unter Last (14 bis 20); die beiden anderen Läufe streuen stark und sagen nichts aus.

## Offen bzw. nicht geprüft
- Die Spur aus inkPatch liest im Sonnenlicht fast wie ein weicher Schatten: Tintenfarbe ohne Glanz, so wie das Modul es macht. Nichts Neues gebaut. Ob das reicht, entscheidet Georg.
- Die erste Spur hängt die inkPatch-Schicht ans Geländematerial. Das übersetzt den Gelände-Shader einmal neu, was vermutlich einen kurzen Ruckler gibt. Nicht gemessen.
- Dunst auf den Blobs gibt es nur mit `sky=r1` (die eine Luft im Nebel); sonst ohne Dunst.
- Der Clip wurde unter Last aufgenommen, mit etwa 16 Bildern pro Sekunde.
- kfbInsert ist als gleiche Datei übernommen und lässt sich ohne Konflikt mit design/einfuegen-r1 zusammenführen. Ändert WS-Design die Datei vorher noch, gilt deren Fassung.
- Heilen kommt später, wie besprochen.

## Runde 2 (03.11. abends): Alien-Satz, nasse Spur, runde Schatten
**Stand:** `game/inkblobs-r1` @77012e24, Atlas `assets/inkblobs-r1` @264498a5.
- **Aliens R6:** 8 Alien-Blobs mit im Atlas, jetzt 32 Blobs. Jede Gruppe kommt eher aus einem Satz (reihum Teens, Magier, Aliens) mit etwa einem Viertel Fremder dazwischen. Der Anführer trägt weiter Mütze. Beleg: `INK_Gruppe_vorn_Aliens_rund.jpg`.
- **Tintenspur (Georg: „mehr nach Tinte, glänzend“):** Das ist eine Erweiterung von inkPatch, die nur auf Wunsch greift (`wet`); die bisherigen Nutzer bleiben unverändert, der alte Test ist grün. Die Spur ist tiefschwarz-violett und glatt, mit Sonnenglanz, Himmelsspiegelung am flachen Blickwinkel, hellem Meniskusrand, feinen Ausläufern und Spritzern. Sie hat überall denselben Tintenton, auch auf hellen Bodenbändern. Beleg: `INK_Spur_alt_neu.jpg` (links alt, rechts neu, gleiches angehaltenes Bild).
- **Kontaktschatten:** rund statt oval, kleiner im Sprung und beim Landen mit der Stauchung kurz breiter.
- **Bildzeit mit 30 Blobs** (`bildzeit_aliens.json`), zwei Messrunden unter Last. Ruhige Paare: Runde A 19,2 und 20,2 ms Renderzeit gegen 16,8 ms ohne; Runde B 17,1 und 16,4 ms gegen 16,6 ms. Mehrkosten zwischen null und etwa 3 ms; die Last überdeckt den Unterschied. 3 Zeichenaufrufe mehr, Rechenzeit der Blobs 0,03 bis 0,06 ms.
- **Nicht gemessen:** die Kosten der nassen Spur selbst. Solange ein Fleck liegt, prüft jedes Bodenpixel einmal die Fleckmaske; Pixel ausserhalb der Flecken steigen dabei früh aus, Pixel im Fleck rechnen sie für den Rand viermal mehr.

## Runde 3 (03.11.): Verteiler-Plätze, ein Tropfen-Kern
**Stand:** `game/inkblobs-r1` @a758b193.
- **Plätze:** mobs2d nimmt `EINZEL.inkblob.add(cellKey, [{ x, z, y, n, seed, biome, zone }])` und `drop(cellKey)` an. Je Platz stellt es n Mitglieder aus dem festen Vorrat auf (`mobs2dn`, Vorgabe 50); die Mischung richtet sich nach `seed`: eher ein Satz, etwa ein Viertel Fremde, bei einem Viertel der Plätze ein Anführer mit Mütze. Die Gruppe bummelt höchstens 3 m um ihren Platz. Beim Entladen verschwindet sie und gibt den Vorrat frei. Ist ein Platz besiegt, merkt sich das Zellgedächtnis das (Art `inkblob`), und beim nächsten Laden bleibt er leer. Kommen Zellen vor dem Modulstart, puffert sie der Haken wie bei den Pop-ups. Das Streuen um den Spieler gibt es nur noch als Prüfmodus `inkstreu=1`.
- **Verteiler:** Der Aufruf `EINZEL.inkblob.add/drop` kommt vom WS-Verteiler und ist auf diesem Zweig nicht drin. Die Prüfung ruft denselben Haken direkt (`test/inkblobs.mjs plaetze`).
- **Belege:** `INK_P1_Dreiergruppe_vorn.jpg` (ein Platz mit n = 3), `INK_P2_zwei_Gruppen.jpg` (zwei Plätze in der Welt, der zweite steht etwas höher am Hang). Die Prüfung ist grün: zwei Gruppen mit je 3, nach dem Entladen 3 übrig, Platz besiegt, wieder geladen bleibt er leer.
- **Tropfen-Kern:** Die Spritzer laufen über `look/kfbTropfen.js` (von WS-Design, unverändert übernommen), `createInkSplash` ist jetzt die Art `platzen`.
- **Nicht geprüft:** das Zusammenspiel mit dem echten Verteiler-Zweig. Vorrat voll heißt: Der Platz bleibt leer und wird als `full` gezählt.
