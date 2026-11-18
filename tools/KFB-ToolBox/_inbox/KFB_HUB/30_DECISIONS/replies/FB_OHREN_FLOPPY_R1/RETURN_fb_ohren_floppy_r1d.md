# FB-Ohren Floppy R1d · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0, Georg q764 („Bogen so, stärker zurück im Fahrtwind“; Dangle bei Bodenkontakt usw.; Steifigkeit gleichmäßig verringern). Aufbauend auf r1c.

## Ergebnis
1. **Fahrtwind:** Bei Turbo und Roadrunner legen sich beide Ohren deutlich zurück, als glatter Bogen.
   - Gemessen im Figurenraum: Turbo −42/−41°, Roadrunner **−50/−49°**.
   - Zum Vergleich: alter Stab links −38° (rechts kippte er fast waagrecht zur Seite), r1c −24/−2°.
   - Abgestuft nach Tempo: Jog ±0°, Sprint −10°. Nach vorn bleibt es ruhig.
   - Die Ruhe-Spreizung der Ohren (±28°) bleibt erhalten.
2. **Dangle:**
   - Schritte schaukeln den Bogen sichtbar (Spitze läuft 10–18 Bilder nach).
   - Bremsen nach Roadrunner: Schwung nach vorn auf +17 bis +30°, ruhig nach etwa 2 s.
   - Sprung-Landung: Schwung von −66° auf +45° und Ausschwingen.
   - Nirgends ein Knick oder S: Knick-Maß 0 % Vorzeichenwechsel in allen Läufen, Korrelation Spitze/Wurzel 0,93–0,96.
3. **Steifigkeit:** ein einziger Wert für das ganze Ohr, `arc.stiffness` = 12 (Dämpfung `arc.damping` 2,7).
   - Mit den Spielfaktoren aus `fbOhrParams` wirken im Spiel 3,9 /s² (r1c: etwa 8,5), also etwa halb so steif.
   - Profilwerte, alle über `setParams({ arc: {...} })`:
     - Fahrtwind: `windMax` 95° (Gesamtbogen), `windGain` 1;
     - Trägheit: `inertiaMax` 35°, `inertiaGain` 1;
     - Flattern: `flutterMax` 8°;
     - Spreizungsausgleich: `splayComp` −0,5;
     - Anschläge: zurück `backCap`/`backFloor` 100°, vor `fwdCap` 45°, je Gelenk `jointCap` 38°.

## Was falsch war (Ursache, gemessen)
- **Die Rohkräfte des Spiels sind riesig.** Die Fahrtwind-Summe liegt bei Roadrunner bei ≈ −16.000° in ear-dangle-Einheiten, schon beim Jog bei ≈ −400°; Schritte bringen ±100–700°.
  - Darum standen der alte Stab, r1 und r1c fast immer am Anschlag. Bei r1c ließ das Ohr nach dem Stopp erst nach Sekunden los, weil die Geschwindigkeit am Anschlag weiterlief (Windup). Abgestuftes Dangle gab es so nicht.
- **Richtung:** Im Spiel gilt −Nicken = Spitze zurück. Das passt zu `maxBack` in `fbOhrParams`.
  - Meine Angabe in r1c „+Nicken = zurück“ (Gegenprobe-Bild r1c) war falsch.
  - Die Windrichtung in r1c stimmte trotzdem, aber die Anschläge waren vertauscht: zurück nur 35°, darum „schwächer als der alte Stab“.
- **Der r1d-Hänger** (70 min ohne Bild) war mein Fehler im Modul (Variable vor der Deklaration), behoben. Gefunden mit WS0s Stillstand-Wächter.

## Lösung in `module/ear-arc.v1.js`
- Wind, Trägheit und Flattern werden weich gesättigt (tanh) statt hart geklemmt: kleine Kräfte wirken linear, große gehen gegen das Profil-Maximum.
- Am Anschlag wird die Geschwindigkeit nach außen auf 0 gesetzt (kein Windup).
- `splayComp`: Beim Zurückbiegen dreht der Bogen so viel mit, dass die Ohren nicht aufspreizen. Gemessen: +0,5 spreizt auf, −0,9 zieht sie zusammen, −0,5 hält die Ruhe-Spreizung.
- Die Tempo-Neigung aus dem r1d-Zwischenstand ist entfernt (Standard `speedLean` 0); der Fahrtwind des Spiels trägt das Tempo bereits.
- **Prüfhaken:** `globalThis.__wsbEarArcDebug` und `__wsbArcTest` wirken nur, wenn ein Prüfskript sie setzt; im Spiel bleiben sie wirkungslos.
- **Einbau wie r1c:** In `faceMountActor.js` nur `rigEars` aus ear-arc importieren. Beim Ablegen den Importpfad von ear-dangle relativ machen (heute `/src/vendor/fb/kfb-lib-p08/ear-dangle.v1.js`). Cape und `ear-dangle.v1` bleiben unverändert.
- Das gelieferte Modul unterscheidet sich von der geprüften Fassung nur im Kopfkommentar (Code ab `import` identisch, `data/r1d/ear-arc.v1.geprueft.js`).

## Prüfung (Spiel-Look, Kampfbühne)
- **Rahmen:** WS0s Beleg-Skript @909462d1 plus Stillstand-Wächter, `buehne=r1`, `BILDER=1` (60 Bilder/s fest), `fb_kopf` | `fb_dreiviertel`, FB Low-Poly r1b. Den Tausch macht nur das Routing.
- **Läufe:** gerade (`GERADE=1`) mit Sprung und Landung (`SPRUNG=1`) sowie Leiter mit Bremse (`LEITER=1`), jeweils r1c (geliefert, faac693e) und r1d.
- **Ohrrichtung im Figurenraum** zusätzlich für alten Stab, r1c und r1d, siehe `data/r1d/messung_r1d.md`.
- **Belegbögen (Spiel-Look):**
  - `belege_r1d/FB_OHREN_R1D_gerade_vorher_nachher.b95.jpg`
  - `…_leiter_vorher_nachher.b95.jpg`
  - `…_sprung_vorher_nachher.b95.jpg`
- **Videos (nur Hub):** `replies/FB_OHREN_FLOPPY_R1/videos_r1d/` mit vorher | nachher nebeneinander, je gerade, Sprung und Leiter, normal und Zeitlupe (¼).
- **Gesehen:** Turbo und Roadrunner glatter Bogen nach hinten, kein Eintauchen in den Kopf. Beim Stopp richten sich die Ohren auf und schwingen nach; nach der Landung schwingen sie nach vorn und pendeln aus.

## Offen / für Georg
- **Stärke:** Mit `windMax` (heute 95°, sichtbar etwa −50°) lässt sich das Zurücklegen weiter stellen, mit `inertiaMax` der Dangle-Ausschlag.
- **Vorwärts-Anschlag:** Bei der Sprung-Landung erreicht das Ohr 45°. Wenn es dort weiter fallen soll, `fwdCap` erhöhen.
