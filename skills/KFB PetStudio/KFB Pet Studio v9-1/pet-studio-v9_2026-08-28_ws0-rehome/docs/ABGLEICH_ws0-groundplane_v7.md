# Abgleich — WS0-Export »Groundplane + Bubbles« (25.8.) gegen Pet Studio v7

Georgs Befund: *»hier hat WS0 das Konzept endlich verstanden und recht gut umgesetzt«.* Stimmt — und
der Abgleich zeigt, dass die Fahrtrichtung inzwischen **umgekehrt** ist. Der Boden kam von WS0 und
ist hier eingebaut; drei Dateien sind hier weitergewachsen und müssen zurück.

Gemessen wurde Datei gegen Datei (Zeilen mit Inhalt, Reihenfolge ignoriert), nicht nach Augenmaß.

---

## 1 · Der Boden: übernommen, unverändert, plus eine Funktion

| | WS0-Export | v7 |
|---|---|---|
| `ground-plane.v1.js` | 303 Zeilen | 330 Zeilen |
| inhaltlich abweichende Zeilen | 1 (die Rückgabeliste) | 23 (eine neue Funktion) |

**Das Konzept ist unverändert übernommen:** der Schatten als Stempel der echten Form, von oben
abgenommen, aufs Feld gelegt, mit der Höhe schwächer und größer. Keine Rückwand, keine Maske, kein
Beschneiden. Ebenso `plant()` als **letzter** Schreiber, `seesPlane()` und `autoTilt()`. Nichts
davon wurde umgeschrieben — es hat funktioniert.

**Dazugekommen ist `screenTile(cam, cvW, cvH, edge, atWorld)`.** Das ist Georgs Ansage vom 25.8.
(»Referenz ist die ground plane des Pet«) als Code, und sie gehört dem **Boden**, nicht dem Aufrufer.
Zwei Gründe, warum eine Messung außerhalb falsch war:

- sie lag auf **Brusthöhe** des Tiers statt auf der Platte. Unter Perspektive sind das zwei
  verschiedene Größen, und die Kachel liegt nun einmal am Boden;
- sie nahm die **Kamera-Achse**. Eine Kachel ist ein Ding *in* der Fläche; ihre Kanten sind `axR` und
  `axF`. Genommen wird die weiter erscheinende der beiden, sonst schrumpft das Maß beim Umkreisen,
  wenn eine Kante gerade auf den Betrachter zeigt.

Auf der gekippten Platte (Flipper) stimmt es weiter: gemessen wird *in* der Fläche, der Punkt wird
vorher entlang der Normale auf sie gelegt.

**→ WS0 nimmt die v7-Fassung.** Sie ist ein Superset; es gibt keinen Grund, zwei zu führen.

## 2 · Die Vertragsfelder: identisch

`pet-metrics.v1.js` — 442 Zeilen hier, 442 dort, **null** abweichende Zeilen. `body.cubeH` ist der
Maßstab, `body.radius` die Trefferfläche, `body.facePitch`/`faceDir` die Blickachse; 1-%-Toleranz beim
Schreiben. Nichts zu tun, nichts zu entscheiden.

## 3 · Die Blasen: hier weiter, und WS0s Anleitung ist überholt

**a) `bubble-shaper.v2.js` → `bubble-shaper.v3.js`** (858 → 887 Zeilen). Zwei Fehler in derselben
Stelle — der Zipfelerkennung:

- **Eine Lücke ist nur ein Zipfel, wenn sie eine Minderheit abtrennt.** v2 nahm die erste y-Lücke
  über 0,12 als Zipfelbasis. Bei `free` (Erzählerkasten, **vier** Punkte, kein Zipfel) sind die
  sortierten y-Werte `[1 · 0,944 · −0,958 · −1]`; die Lücke zwischen 0,944 und −0,958 ist 1,90 — also
  galten die zwei **oberen** Punkte als ganzer Körper, Körperhöhe 0,042, und `ky` sprang auf ~1013:
  eine Blase von **78 × 1922 px** auf einer 540 px hohen Bühne. v3 verlangt zwei Bedingungen: die
  Gruppe unter der Lücke ist höchstens ein Drittel der Punkte, **und** sie liegt in der unteren Hälfte.
- **Der Rückfallwert ist eine Entscheidung, keine Restmenge.** Qualifiziert keine Lücke, heißt das
  *kein Zipfel* — `bodyY` auf das Maximum. v2 stand auf dem Minimum, also »alles ist Zipfel«: bei
  `free` wurden **drei von vier** Punkten seitlich geschoben, Ring x von −10,7 bis 53,8 statt 0 bis
  64,6, während `inner` beim ungeschobenen Mittelpunkt zurückblieb — der Satz saß 10,5 px rechts der
  Formmitte, das Ausrufezeichen kreuzte die Kontur.

**b) Neu hier, WS0 unbekannt:** `bubble-kiss.v1.js` (die Blasenschicht, `kss-v1.0`),
`edge-treatment.v1.js` (Randbehandlung: Wolke aus Kreisen, Schrei aus Zacken),
`pet-session.v1.js` (Entwürfe je Pet, Export/Import, *der reichere Stand gewinnt*).

**c) `INTEGRATION.md` §2 aus dem WS0-Export ist jetzt falsch** und sollte dort ersetzt werden. Der
Absatz sagt:

```js
const h = projectedHeight(box, cam, stageH);       // Pet-Hoehe in Bildschirmpixeln
return Math.max(11, Math.min(46, h * 0.085));      // Comic-Konvention: ~8,5 %
```

Das ist **genau der v6-Fehler**, und er kostet in zwei Stufen:

1. *Jedes Bild neu messen heißt jedes Bild neu zeichnen.* Die Schriftgröße wandert mit der Kamera,
   die Form wird daraus neu gebaut, die Tusche neu gelegt — jede Stufe ein sichtbarer Sprung. Über
   einen Kameraweg von 21 Schritten (Kachel 325 → 150 px) gemessen: v6 hatte **3** Größen und einen
   größten Sprung von **25,0 %**, v7 hat 15 stetige Größen und 8,6 % (= die Kamerabewegung selbst).
2. *Die Figur ist die falsche Referenz.* Die Hüllkastenhöhe enthält Ohren, Schopf und Flügel — der
   Hase bekäme eine andere Blase als der Pinguin, obwohl beide auf derselben Kachel gleich groß
   stehen. v7 rechnet über die **Kachel**: Letteringhöhe ≈ 0,085 × Figurenhöhe, Figurenhöhe
   ≈ 0,71 × Kachel (gemessen: Pinguin 230 px bei Kachel 322 px) → **0,061 × Kachel**. Daraus die
   Kachelbreite, bei der `k = 1` gilt: 34 / 0,061 = **557 px**.

Ersatz für §2 steht in `SPEC_bubble_kiss_v7.md` §3 — als Codeblock, kopierbar.

---

## 4 · Was wohin geht

**Von hier nach WS0 / ins Repo:**

1. `studio-v7/ground-plane.v1.js` (mit `screenTile`) — **zuerst**, die Blasengröße hängt daran.
2. `studio-v7/bubble-shaper.v3.js` — sonst holt der nächste Fork die 78 × 1922-Blase zurück.
3. `studio-v7/bubble-kiss.v1.js` + `edge-treatment.v1.js` — neue Schicht, ersetzt WS0s §2-Rezept.
4. `studio-v3/kfb-pets.json` v1.2.7 + Skalierungs-Fix in `studio-v3/pet-library.v6.js` — Altschuld
   aus v5. Solange sie hier liegt, holt jeder Fork den Datenverlust und den Mess-Bug zurück.

**Von WS0 nach hier: nichts offen.** Boden und Vertragsfelder sind eingebaut, `pet-metrics` ist
identisch, das Abnahmeblatt aus `INTEGRATION.md` läuft im Ground-Tab als Knopfreihe *Measure (WS0
checks)*.

**Was WS0 an sich selbst ändern sollte:** `INTEGRATION.md` §2 ersetzen, `bubble-shaper.v2.js` aus dem
Export nehmen (v3 ist der Stand), und `deps/bubbles.v4.js`/`v5.js` als *Vorgänger, wird nachgezogen*
kennzeichnen — sie sind Abhängigkeit, nicht Empfehlung.

---

## 5 · Was wir jetzt von WS0 brauchen

Drei Fragen, jede mit einer Zahl beantwortbar. Sie stehen so auch im HANDOVER §3.

1. **Boden in einer Zone mit eigenem Untergrund:** `setPlane({mode:'invisible'})` ist hier der
   Standard, weil das Studio seinen eigenen Boden hat. Läuft der Stempel in WS0s Zone ohne zweite
   Platte? Abnahme: `Box3.min.y`-Spanne über acht Bilder bei laufender Animation = **0,000**.
2. **`screenTile` gegen WS0s Zonenkachel:** ergibt die Funktion auf deren Boden dieselbe Zahl wie
   deren eigene Kachelrechnung? Abweichung in Prozent, bei Zoom nah **und** fern.
3. **Blasengröße im Spielmaßstab:** `letterShare 0.061` ist an der Studiobühne kalibriert (Entwurf
   557 px Kachel, Standardblase 153 × 105 px). Wie sieht dieselbe Zahl in der Zone aus, in der die
   Pets **klein** stehen — und ist `Balloon scale` dort der richtige Griff oder braucht es einen
   zweiten `letterShare` je Kontext?
