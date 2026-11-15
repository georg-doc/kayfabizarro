# Rückgabe · Sprechblasen R2 · 15.11.2026 (V-1814, Brief BRIEF_WSA_SPRECHBLASEN_R2)

Kandidat für Georg. Noch kein Einbau ins Spiel, keine Hub-Karte (macht WS0).

## Was da ist
- **Formmodul:** `src/hud/bubbles/bubbleForm.r2.js` auf Zweig `ws0/blasen-r2` (KFB-Stunt-Car-Race, Commit fb985cd4, gepusht). Reines JS ohne DOM-Pflicht, für Spiel-DOM, Website und Remotion. sha256 ed0e438e2f52…
- **Test:** `node src/hud/bubbles/bubbleForm.r2.test.mjs` → 11 Prüfungen bestanden (Zipfel, Zacken, Lobes, Schweif, Antworten, Soundword, Umbruch, Seed).
- **Testseite R1 / R2:** `src/hud/bubbles/r2-test/index.html` (Server im Ordner `src/hud/bubbles`, dann `/r2-test/`). Gleiche Texte kurz/mittel/lang. Knöpfe: neue Variante, Kopf bewegen. Antworten mit Maus oder Tasten 1–4, die gewählte wird zur Spielerblase. R1 = WSA-Stand b8f016d5 (Snapshot im Ordner `r1/`), bei Erzähler-Box und Antworten der Bestand.
- **Bilder (R1 links, R2 rechts, beschriftet):** `01_sprechen` … `07_soundword` `_R1_R2.jpg`, je 0,16–0,29 MB.
- **Videos (nur R2, 1600 × 900, 30 fps, 5,5 s):** `R2_01_sprechen.mp4` … `R2_07_soundword.mp4`. Kompositionen `BlasenR2-*` in `60_VIDEO/remotion/src/blasen-r2/`, Modulkopie in `60_VIDEO/components/kfb-bubbles-r2/` (README nennt den Render-Aufruf).

## Wie die Formen entstehen
- **Papierkante (Sprechen, Flüstern, Antworten, Erzähler):** vier Ecken je Blase geseedet versetzt (≤ 0,25 Zeilenhöhe), oben leicht schmaler, Körper 1,1–2,2° gekippt, Kanten gerade, Knick nur in Kanten über 8 Zeilenhöhen. Zipfel im selben Pfad, gerades Dreieck, Fuß 22, Länge bis 30 bei 900 px, Ansatz ≥ 1 Zeilenhöhe vom Eck. Ist eine Seitenkante dafür zu kurz, wandert der Zipfel auf die nächste lange Kante zum Kopf. Bei einzeiligen Kästen (Antworten) schrumpft nur der Eckabstand.
- **Schrei:** Superellipse aus der Textbox, gleichmäßig skaliert. Zackenzahl = Umfang / (1,9 × Zeilenhöhe), verteilt nach Bogenlänge mit Abstand 0,75–1,25. Höhe 0,75–1,3 × Grundhöhe in drei Klassen (nie zweimal dieselbe nebeneinander). Hängt nur von der Zeilenhöhe ab. Täler weich, verschieden tief. Ein Zacken wird zum Zipfel.
- **Denken:** Ellipse 1,4–1,7 : 1, der Umbruch wählt die Breite, die die kleinste Ellipse ergibt. 6–8 Lobes (klein) bzw. 7–12, Rhythmus groß–klein–groß–klein–klein, klein = 0,55–0,72 von groß, füllen den Umfang genau. Schweif 3–4 Kreise, je 0,6–0,7 × des vorigen, startet am kleinen Lobe zum Kopf hin, endet vor dem Kopf.
- **Flüstern:** Papierkante, helleres Papier ohne Flächenverlauf, kursive graue Schrift (0,9), schwächerer Schatten, Zipfel in drei Stücken.
- **Erzähler-Box:** auf `caption`/`kayfabulate`: ocker getöntes Papier, kein Zipfel, Bildkanten bleiben gerade, linksbündig. Mit Reiter „Kayfabulate“ (rot) als Variante.
- **Antworten:** auf `createAnswerBubbles`: Spalte aus bis zu vier Papierkanten-Kästen, fette Ziffer, keine Farbpunkte. Aktive leicht gedreht, angehoben, 1,04. Gewählte wird mit demselben Seed zur Sprechblase der Spielfigur.
- **Soundword:** Einzelbuchstaben (Bangers) mit geseedeter Drehung ±6° um die Bogentangente, Größe 0,92–1,12 und wachsend zum Wortende, leichte Überlappung, Kontur wie PLOPP!, 8-fache Extrusion. Dahinter ein Burst aus derselben Zacken-Logik wie der Schrei. Farben aus der Kern-Bank, PLOPP! in den Spielfarben.
- **Timing:** Pop wie heute (0,82 → 1,04 → 1 in 170 ms), Schrei härter, Flüstern weich, Gedanken-Kreise vom Kopf zur Wolke, Buchstaben nacheinander (55 ms), Erzähler schiebt sich von der Bildkante herein.

## Wo es noch nicht stimmt (selbst angesehen)
- **Schrei lang:** Die obere Zackenreihe wirkt noch etwas gleichmäßig. Lange Schreie werden sehr groß, der Zipfel ist daneben klein.
- **Soundword „KA-BOOM!“:** Am linken Ende bleibt eine etwas längere Zackenflanke (viel schwächer als vorher, aber sichtbar).
- **Denken lang:** Die Wolke wird groß, die Schweifkreise wirken daneben klein.
- **Flüstern:** Der gestückelte Zipfel ist in Spielgröße klein, die Unterscheidung trägt vor allem die Schrift.
- **Antworten:** Zipfel 30/22 wirken an den kleinen Kästen groß (aber SSOT-konform, wie heute im Spiel).

## Abweichungen, Georg entscheidet
- Aktive Antwort: Gold zur Hälfte ins Papier gemischt (`#f2d48c`). Das Spiel mischt heute 20 %, die SSOT nennt Gold.
- Schrei-Zipfel: ragt bis 30 px über die Zackenlinie (vom Grundkörper gemessen also länger als 30).
- Kayfabulate-Reiter in Bangers statt Irish Grover (Schrift nicht gebündelt).
- Soundwords haben eine dunkle Kontur (wie PLOPP! im Kampf). An Blasen bleibt kein Umriss (V-204).
- R2 zeigt lange Texte ganz, R1 blättert nach fünf Zeilen. Blättern bleibt Sache des Hosts.

## Prüfsummen (sha256, erste 12 Zeichen)
0be626a0c403 01_sprechen_R1_R2.jpg · 4c22372be40a 02_denken_R1_R2.jpg · 61ca41061a88 03_schreien_R1_R2.jpg · 1017dbbbc56c 04_fluestern_R1_R2.jpg · c21990dbe176 05_erzaehler_R1_R2.jpg · 8160c38c4904 06_antworten_R1_R2.jpg · 61a950eb93a6 07_soundword_R1_R2.jpg
f9556853a44e R2_01_sprechen.mp4 · 333fc6eaf7cb R2_02_denken.mp4 · 3820859b3b76 R2_03_schreien.mp4 · c7f989116016 R2_04_fluestern.mp4 · 6c7fb1bb7648 R2_05_erzaehler.mp4 · adc31361ea49 R2_06_antworten.mp4 · 2b9f6a246d60 R2_07_soundword.mp4
