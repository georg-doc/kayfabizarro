# WS0 an WSA work · Combat VFX R2 · Reparatur Pistole und Blaster · 01.11.2026 (V-1151, V-1126, V-1135, V-1142)
Georg zum Stand @ac07947e: Das Mündungsfeuer ist „viel zu mickrig“, „das sieht man ja überhaupt nicht“. Der Ton: „Plip-Plop“, „null immersiv“, „Spielzeug-Erbsenpistole“. Ziel: „cartoonig immersiv, chill und fun“, in der Destruction-Slice „ein viszerales Sounderlebnis“; realistisch als Basis, „cartoonig abgeleitet“. Es soll „wirklich Spaß“ machen und „visuell auch überzeugen“. Die Bewegung und der neue Prüfer aus deiner Lieferung bleiben; Größe, Form, Wucht und Ton sind das Problem. Von WS0: Die Schwäche aus der Spielkamera war mir aufgefallen, ich hätte es nicht vorlegen dürfen.

**1 · Erst das Modell, eine Seite vor dem Bau.** Sieh dir an, wie gute stilisierte Shooter und Animation das lösen, zum Beispiel Ratchet & Clank, Splatoon, Overwatch, Borderlands, Hi-Fi Rush: Größe zur Figur, Formtypen je Waffe, gehaltene Frames statt Aufblitzen, Rauch danach, Kamera- und Trefferwucht. Nenne je Punkt, was du übernimmst. Das gilt genauso für Ton.

**2 · Bild.** Maßstab ist die **Spielkamera von hinten auf Figur und Waffe**, nicht das Nahbild:
- Ein Schuss ist dort auf einen Blick zu sehen, auch auf hellem Boden und wenn die Figur die Waffe teils verdeckt. Du legst die Größe selbst fest und zeigst sie an diesem Bild. Georgs frühere Kritik gilt auch: statische, komplexe Comic-Illustrationen sind kein Mündungsfeuer.
- Klare Form mit wenigen großen Zungen, heller Kern. Nicht nur ein Aufblitzen: kurz gehalten, dann Rauch oder Funken, die vergehen. V-1142 und V-1152 gelten: Spitzen laufen aus, keine Doppelkontur.
- Der Rückstoß darf deutlich größer sein, der Griff bleibt fest. Prüfe eine leichte Kamerawucht nur für den eigenen Schuss, wenn sie den Spaß hebt und ein Schalter sie abstellt.

**3 · Ton.** Schuss aus Schichten: Anschlag, Körper mit Tiefton, Ausklang. Mehrere Varianten je Waffe, damit kein Schuss gleich klingt, genau im Takt mit der Flamme. Dazu Treffer und eine Explosion, weil Georg die Wucht im Ganzen beurteilt.
- Quellen: zuerst `40_AUDIO/elevenlabs_r1/combat_av_fix_r1` bis `r3` und die Zuordnung in `src/audio/cueMap.js`, dann geeignete freie Sammlungen. Prüfe, ob die vorhandenen Dateien im Spiel überhaupt richtig ankommen, oder ob der Weg sie dünn macht.
- Alles über `kfbAudio` (V-841), kein zweiter Abspielweg.
- **ElevenLabs ist freigegeben** (Georg 01.11.). Nutze es gezielt für das, was im Bestand fehlt, und führe Prompts und Dateien im Register der Klänge.
- **Rang und Klangziel (V-1156):** Kampf- und Zerstörungssounds samt Kaskaden sind Georg „ebenso wichtig wie die Dieselpunk-Racer- und Engine-Sounds“. Sie sollen „visceral, immersiv und basslastig“ sein: „Star Wars THX, aber mit Steam-/Dieselpunk-Signatures“, also großer Tiefton und Raum, dazu Dampf, Ventile, Metall, Kolben.
- **Kaskaden:** Ein Treffer ist eine Folge: Einschlag, Bersten, Trümmer, Nachrollen im Raum. Nähe, Größe und Material ändern sie. Schichten dürfen sich überlagern, ohne zu übersteuern; Tiefton braucht ein eigenes Budget im Mix.

**4 · Selbst prüfen, bevor du abgibst.** Sieh die Videos aus der Spielkamera Bild für Bild an. Hören kannst du nicht: Prüfe beim Ton Pegel, Tiefton-Anteil, Länge und Takt zur Flamme und sag offen, dass die Hörabnahme bei Georg liegt. Ist die Wucht schon im Bild oder in den Tonwerten nicht da, gib es nicht ab.

**Rückgabe an WS0, dann Stopp:** Modell-Seite. Je Waffe ein kurzes Video mit Ton aus der Spielkamera und ein Einzelbild im hellsten Moment aus der Spielkamera. Ein Video mit Treffer und Explosion. Tests wie zuletzt. Kritiker höchstens einmal, auf dem Endstand, mit Georgs Sätzen. Gatling und Rakete warten weiter auf Georgs Urteil.
