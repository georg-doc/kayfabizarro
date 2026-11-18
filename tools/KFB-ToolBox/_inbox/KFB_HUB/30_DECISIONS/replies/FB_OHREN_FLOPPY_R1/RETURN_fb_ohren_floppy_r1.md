# FB-Ohren Floppy R1 · RETURN (WSB, 17.11.2026)

**Auftrag:** Georg q762 über WS0:
- Die Ohren biegen sich immer als ein sauberer, durchgehender Bogen, nie mit Knick oder Zickzack.
- Floppy: schwingt nach, legt sich bei Fahrtwind zurück, die Spitze folgt zuletzt.
- Auf dem Low-Poly-Stand.
- Als eigene Ohren-Fassung bzw. Profil-Daten; die Cape-Kette in `ear-dangle.v1` bleibt unverändert.

**Gültig ist Stand r1c.**

## 1 · Ursache der Knicke
- `ear-dangle.v1` gibt jedem Ohrglied eine eigene Feder (Härte 60/38/24, Dämpfung 7/5/3,5). Die drei schwingen phasenversetzt.
- Gemessen über die ganze Laufleiter:
  - benachbarte Glieder biegen in 11 % (links) bzw. 35 % (rechts) der Bilder gegeneinander, mit bis 12°;
  - die Spitze (ear3) nimmt im Lauf fast die ganze Biegung (20–30°), ear1 nur etwa 2° → Stab mit Haken.

## 2 · Lösung: `module/ear-arc.v1.js` (sha256 `faac693e…4709`)
- **Ein Biegezustand je Richtung** (Nicken und Rollen) mit einer weichen Feder (26/s², Dämpfung ≈ 0,53).
  - Verteilt auf ear1–3 mit 0,27/0,33/0,40, zur Spitze stärker.
  - Ein Nachläufer lässt die Spitze zuletzt folgen.
  - Er ist so begrenzt, dass die Krümmung entlang der Kette nie das Vorzeichen wechselt.
  - Je Gelenk höchstens 30° (kein gefaltetes Ende); zurück höchstens 80°, nach vorn höchstens 35°.
- **Kräfte wie in ear-dangle.v1:** Trägheit, Drehung, Fahrtwind (Faktor `windGain` 3,2), Flattern als eine glatte Schwingung, Schwerkraft, Wippen; dazu die Pose (droop/fold/curl).
- **Schnittstelle wie `rigEars` / DangleChain.**
  - Das Spiel kann weiter `setParams` im DangleChain-Format schreiben (`applyEars`, `fbOhrParams`); Listen werden in Bogen-Faktoren übersetzt.
  - `ch.state[i].x` liefert die Gliedwinkel (`debugEarBend`).
  - Bogen-eigene Werte lassen sich als Profil setzen: `ch.setParams({ arc: { windGain, weights, jointCap, fwdCap, backCap, stiffness, damping, lagShare } })`.
- **Am FB-Rig gilt +Nicken = Spitze zurück.**
  - Gegenprobe mit umgekehrtem Wind: Die Ohren klappen nach vorn über den Kopf (`belege_r1c/OHREN_R1C_gegenprobe_windrichtung.jpg`).
  - Der Kommentar „+ = vor“ in ear-dangle.v1 gilt für dieses Rig nicht.
- **Einbau (WS0):** In `src/modules/faceMountActor.js` nur `rigEars` aus `ear-arc.v1.js` importieren (Datei z. B. nach `src/vendor/fb/kfb-lib-p08/ear-arc.v1.js`); `DANGLE_DEFAULTS` bleibt aus ear-dangle.v1.
  - `capeDangle.js` (DangleChain) und `ear-dangle.v1.js` bleiben unverändert.
  - Den Importpfad in ear-arc.v1.js (`/src/vendor/fb/kfb-lib-p08/ear-dangle.v1.js`) beim Ablegen auf relativ setzen.
- **Skelett:** unverändert (ear?1–3). Der glatte Gewichtsverlauf ist schon im Low-Poly-Stand r1b eingebaut.

## 3 · Prüfung im Spiel (Stamm @909462d1)
- **Aufbau:** WS0s `test/_laufstufen-beleg.mjs` als ungetrackte Kopie `scripts/_wsb-ohren-beleg.mjs`, mit `BILDER=1 GERADE=1 KAMERAS=fb_kopf,fb_dreiviertel` (fester Prüftakt, jedes Bild, Stand → Sprint → Turbo → Roadrunner → Bremse).
  - FB-Low-Poly r1b und `ear-arc` nur per Browser-Routing getauscht.
  - ffmpeg über `scripts/ff.sh` (Remotion-ffmpeg), weil der Pfad im Original-Skript auf einen anderen Rechner zeigt.
- **Knick-Maß** (`scripts/knick.mjs`, je Bild die Nickwinkel der drei Glieder; `data/r1c/knick_mass_alle.txt`):

| Lauf | Vorzeichenwechsel L / R | S-Stärke max | Spitze folgt (Korrelation) |
|---|---|---|---|
| vorher (3 Federn) | 11 % / 35 % | 11,8° / 10,5° | 0,52 / 0,55 |
| r1 Bogen | 0 / 0 | 0 | 0,91 / 0,96 (7 Bilder Verzug) |
| r1c Bogen | 0 / 0 | 0 | 0,97 / 0,96 |

- **Videos** (Spiel-Look, Kampfbühne): `belege_r1c/videos/OHREN_R1C_{vorher,nachher}_gerade.mp4` und `_zeitlupe.mp4`. Vergleich: `belege_r1c/OHREN_R1C_vorher_nachher_kampfbuehne.jpg`.

## 4 · Blinder Kritiker (ein Lauf, Stand r1) und Nacharbeit
**Urteil: FAIL, knapp.**
- **Positiv:** Der Schaft ist klar besser, ein glatter Bogen statt Stab.
- **Mängel:**
  - Spitze gestaucht/gefaltet bei starker Biegung;
  - vorderes Ohr klappte zeitweise über die Braue;
  - bei Roadrunner nicht durchgehend zurück.
- **In r1c behoben:** Dämpfung höher (schaukelt nicht mehr auf), je Gelenk ≤ 30°, nach vorn ≤ 35°, Spitzen-Nachlauf schwächer, Fahrtwind verstärkt. In r1c sehe ich weder gestauchte Spitze noch Vorklappen.

## 5 · Offen
- **Zurücklegen im Fahrtwind:** In r1c ist es sichtbar, aber schwächer als beim alten Stab-mit-Haken.
  - Der Windfaktor wirkt nur begrenzt; die alte Schräglage kommt zum Teil aus der Haltung im Stand.
  - Wie stark sich die Ohren zurücklegen sollen, entscheidet am besten Georg an den Videos.
  - Danach stelle ich `windGain`, `weights` und `backCap` nach; auf Wunsch zusätzlich eine tempoabhängige Grundneigung.
- Der Biss am A11-Ohr bleibt; von der Seite liest er sich bei starker Biegung als Kerbe an der Spitze.

## Löschliste
Die Zwischenstände (r1-Bilder, Modul-Stand vor dem Kritiker, Probeläufe im Arbeitsbaum) stehen in `BLINDE_KRITIK_R1/LOESCHLISTE.md`.
