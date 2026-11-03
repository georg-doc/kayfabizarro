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
