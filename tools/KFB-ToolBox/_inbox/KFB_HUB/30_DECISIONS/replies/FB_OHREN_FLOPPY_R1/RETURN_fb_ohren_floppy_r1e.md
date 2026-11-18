# FB-Ohren Floppy R1e · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0 18.11. (2), Georg q768 TUNE: „besser, aber beim Bremsen passend nach vorn schwingen, bei den Steps bouncen … globale Physik/Kinetik, Preston Blair, Bugs Bunny“. Das Ohr wird nicht mehr über die Rohkräfte getrieben, sondern über die Bewegung des Kopfes. Gemeinsamer Nachschwing-Kern, auch für Schwanz, Bauch usw.

## Ergebnis (Spiel-Look, Kampfbühne, gleiche Spielzeitpunkte vorher | nachher)

| Moment | r1d Bogen / Figurenraum | r1e Bogen / Figurenraum |
|---|---|---|
| Jog, Fußaufsatz | −9° / +2° (Spitze starr) | −36° / −15 bis −19°, Spitze federt bis +33° |
| Roadrunner | −87° / −49° | −80° / −45° (weicher Bogen nach hinten wie r1d) |
| Bremsen (+1,3 s) | +6° / +59° | **+51° / +69°**, Spitze schlägt vor den Kopf, pendelt zurück (−52°), ruhig nach ≈ 2 s |
| Absprung, Flug | −34 bis −65° | −54 bis −68° (Ohr klappt beim Absprung nach unten-hinten) |
| Landung | +45° | +54°, Spitze peitscht nach vorn (−44° gegen den Bogen), dann auspendeln |

- **Bounce je Schritt:** Die Spitze federt im Schritt-Takt. Jog ±12–33°, im Lauf bis +48° Abweichung vom Bogen.
- **Nachlaufen der Spitze:** Die Spitze folgt dem Ansatz mit 17–21 Bildern Verzögerung (r1d 12, erster r1e-Stand nur 2–3).
- **Knick-Maß:**
  - Beleglauf mit Standbild-Pausen: 4 % Bilder mit kurzem Gegenbogen, S höchstens 3,9°.
  - Echtzeitlauf (`daten_echtzeit_sw14`): 0,4 %, S höchstens 2,3°.
  - Der Gegenbogen tritt nur bei schnellen Umkehrungen auf (Bremsen, Landung); r1d hatte 0 %. Einstellbar über `lagShare`/`lagEps`.
- **Gesehen:**
  - Bremsen: Das Ohr schlägt vor das Gesicht und schwingt zurück.
  - Landung: Die Spitze peitscht nach vorn.
  - Lauf: wie r1d, mit sichtbarem Federn im Schritt.

## Wie (Nachschwing-Kern `module/nachschwing-kern.v1.js`)
- **Anker:** ein Punkt fest am Kopf (Ohrmitte in Ruhelage). Seine Weltbeschleunigung wirkt im Ohr als Scheinkraft F = −a; Kopfnicken und Drehen stecken darin.
- **Drehwirkung:** F · Richtung, in die sich die Spitze bei der Biegung bewegt. Daraus folgt von selbst:
  - Bremsen schlägt nach vorn.
  - Fußaufsatz wippt zur Seite, zu der das Ohr geneigt ist.
  - Absprung zieht nach unten, im Flug wird das Ohr leichter, Landung schlägt durch.
- **Cartoon-Hebel `leverMin` 0,6:** Ein fast waagrecht zurückliegendes Ohr bekäme beim Bremsen sonst nur Zug längs des Ohrs. Gemessen: ohne Hebel nur +8°.
- **Zwei Teile:**
  - Gemessen: Schritte stoßen den Kopf etwa siebenmal stärker als das Bremsen.
  - **Bogen:** langsamer Feder-Dämpfer (Steifigkeit wie r1d, im Spiel 3,9 /s², Dämpfung 2,4 /s ≈ 0,6). Er bekommt die geglättete Scheinkraft (2 × 0,07 s): Bremsen, Anlauf, Landung. Dazu die Fahrtwind-Neigung über dem Kopftempo: `windMax` 95° × tanh((v/4,5)³), Jog wenig, Roadrunner weit.
  - **Spitze:** der Nachläufer wie r1d plus eine schnellere Feder (≈ 2,3 Hz) für den schnellen Anteil (Bounce je Schritt). Begrenzt auf ±(0,6·|Bogen| + 0,2 rad).
- **Abstimmung (im Spiel gemessen, Durchläufe sw1–sw14 in `data/r1e/`):** waagrechter Anteil des Bogens `gainH` 3,5, senkrechter `gainV` 0,6, `inertiaGain` 0,5, `accelMax` 25, Spitze waagrecht `tipGainH` 1.
- **Für Schwanz, Bauch usw.:** `Anker` + `NachschwingBogen` + `scheinkraft` ohne Ohr-Besonderheiten. Der Aufrufer liefert Ankerpunkt und Ruherahmen (siehe `ear-arc.v1.js` als Beispiel).

## Einbau
- **Wie r1d:** In `faceMountActor.js` nur `rigEars` aus `ear-arc.v1.js` importieren. Neu liegt `nachschwing-kern.v1.js` daneben (relativer Import `./nachschwing-kern.v1.js`).
- Beim Ablegen den Importpfad von ear-dangle relativ machen (heute `/src/vendor/fb/kfb-lib-p08/ear-dangle.v1.js`).
- Schnittstelle unverändert: `update(dt, { wind })`, `setParams({ arc: {...} })`.
  - `env.wind` des Spiels wird nicht mehr genutzt (`envWindGain` 0, optional zuschaltbar).
  - Aus r1d entfallen `windRef` (jetzt Tempo-Bezug 4,5) und `inertiaMax` (jetzt `inertiaGain`/`accelMax`).
- **Profilwerte für WS0/Georg** (alle über `setParams({ arc })`):
  - Stärke Zurücklegen: `windMax`.
  - Überschlag beim Bremsen: `gainH`, `leverMin`.
  - Bounce: `tipGain`, `tipStiffness`.
  - Nachpendeln: `damping`.
  - Spitzen-Nachlauf: `lagStiffness`.
  - Gegenbogen: `lagShare`, `lagEps`.
- **Prüfhaken**, nur wirksam, wenn ein Prüfskript sie setzt: `__wsbEarArcDebug`, `__wsbArcTest`, `__wsbEarFreeze` (friert die Ohren für Standbilder ein).
- Das gelieferte Modul ist byte-gleich mit der geprüften Fassung (`data/r1e/*.geprueft.js`).

## Prüfung
- **Rahmen:**
  - WS0s Beleg-Skript (Kopie, Stamm @379982b6) mit Stillstand-Wächter, `buehne=r1`, `BILDER=1` (60 Bilder/s fest), FB Low-Poly r1b über Routing.
  - Ohrtausch nur per Routing von `faceMountActor.js`, Läufe Leiter mit Bremse und Sprung.
  - vorher = r1d (geliefert, 6b81da24), nachher = r1e.
- **Standbilder** nach Beleg-Standard R2 (`belegMotiv`, motiv `fb`), an gleichen Spielzeitpunkten. Gesetzt mit `belegVergleich`: `belege_r1e/FB_OHREN_R1E_<lauf>_<n>_<ansicht>.jpg`.
  - Momente: Jog, Roadrunner, Bremsen, Flug, Landung.
  - Ansichten `figur_seite` und `figur_dreiviertel`. `gesicht` lag im Lauf im Gegenlicht (FB läuft gegen die Sonne); `figur_dreiviertel` fiel ebenfalls auf `licht: 'frei'` zurück, Protokoll in `data/r1e/beleg_*.json`.
- **Videos (nur Hub):** `replies/FB_OHREN_FLOPPY_R1/videos_r1e_b/`, vorher | nachher, Leiter und Sprung, normal und Zeitlupe (¼).
- **Befunde am Beleg-Standard** (für WS0, nur in meiner Testkopie umgangen):
  1. `belegMotiv` schaltet die Bühnenkamera ab (`__kfbBuehneKam.aus()`). Danach fehlen die Bilder einer Bildfolge; ich rufe `buehneKamera` wieder auf.
  2. Im Prüftakt `replay` hält `timeScale = 0` die Uhr nicht an (M1Loop zählt im Replay je Bild einen Schritt). Ich schalte `replay` für den Halt aus.
  3. Die Ohren rechnen bei angehaltener Uhr mit der Bildzeit weiter und entspannen sich. Ich friere sie mit `__wsbEarFreeze` ein.
  4. Wegen der Halt-Pausen sind die Körperposen vorher | nachher nicht immer bildgleich (Beine im Jog leicht versetzt). Die Ohr-Aussage bleibt davon unberührt.

## Offen / für Georg
- **Gegenbogen der Spitze** bei schnellen Umkehrungen (≤ 4°): stört er, `lagShare` kleiner.
- **Jog-Rücklage** −36° Bogen (r1d −9°): Sie kommt vom Anlauf (der Kopf beschleunigt). Kleiner über `gainH`.
