# ABGLEICH — Bubble-Handover des Coworkers gegen den gebauten Stand (2026-08-12, v13-C1/C2)

Quelle: `uploads/HANDOVER_Bubbles_Design.md` (Coworker, eigenständige Bauanleitung).
Gebaut: `overworld-v13/bubble-layout.js` (bl-v1.0, C1) + `overworld-v13/bubble-ts.js` (bubble-ts-v2, C2),
Messblätter `KFB Bubble-Fixtures v1.dc.html` und `KFB Blasen-Formen v1.dc.html`.

**Kurz:** die Bauanleitung und der Bau sind sich in **allem einig, was zählbar ist** — und sie
widersprechen sich an **einer Stelle grundsätzlich** (die Zackenblase), an der Georgs Auge bereits
entschieden hat. Der Rest sind sechs saubere Lücken, alle in C3/C4 einsortierbar.

---

## §1 Deckungsgleich (nichts zu tun)

| Regel | Beleg im Bau |
|---|---|
| Textblock zuerst, Kontur danach | `bubble-layout.js` kennt keine Blasengröße als Eingabe |
| Ausgeglichener Umbruch, kein Trennen, keine Ein-Wort-Restzeile | DP über Quadratsummen; Gegenprobe `wrapFill` im Messblatt |
| Zwölf Fixtures, Zeilenzahl **und** Zeiten | **12/12 · Umbruch 5/5 · Zeiten 12/12** |
| `overflow` scheitert sichtbar, keine Teilung ohne Satzgrenze | abgewiesen, mit Grund |
| 28/21/34 Zeichen · 3 Zeilen (Kayfabulate 4) · Zeilenabstand 1,25 | `KINDS` im Layout-Modul |
| Zeiten 34 Zchn/s · 800+42·n · Deckel 5000 · Abgang 220 · min 1200 | `TIME`, gegen die Tabelle geprüft |
| Kein Postprocessing, **keine zweite Tusche** | Kante kommt aus `kfb-ink-canon.js` über eine Canvas-Ebene |
| Farbe `#1f1a14` | `INK` |
| Lesbarkeitsboden 11 px, Polster in em | `LIMITS.floorPx`, em-Polster **plus** Mindestmaß 11/8 px (Naht 125) |

---

## §2 Der eine echte Widerspruch: die Zackenblase

**Bauanleitung §5.5:** *»Acht bis sechzehn **unregelmässige** Zacken, verschiedene Längen und Winkel.
**Kein gleichmässiger Sternburst.** Gleiche Winkelabstände sind das Erkennungszeichen der billigen
Variante. Einzelne Zacken dürfen nach innen kippen.«*

**Gebaut ist das Gegenteil:** ein **Kranz** aus 12–18 fast gleich langen Zacken mit nur ±7 %
Winkelstreuung — und zwar auf Georgs Ansage hin (»der Ruf war ein Rechteck mit Zähnen«, dann sein
Referenzblatt, dann »finde ich schon super«). Der erste Anlauf hatte genau die Unregelmäßigkeit, die
die Bauanleitung verlangt: 7–11 stark gestreute Zacken. **Georg hat sie als Klecks mit Hörnern
verworfen.**

Beide Seiten haben recht, aber über verschiedene Dinge: die Bauanleitung warnt vor dem **Stern-Clipart**
(gleiche Länge *und* gleiche Winkel *und* spitzer Winkel = Sheriffstern), das Bild zeigt einen
**Kranz** (viele Zacken, tiefe Täler, leichte Streuung). *Regelmäßigkeit im Winkel ist billig,
Regelmäßigkeit in der Zahl ist Comic.*

**Vorschlag, nicht gebaut:** ein Mittelweg von zwei Zeilen — je Blase **ein bis zwei** Zacken deutlich
länger (×1,45) und **eine** nach innen gekippt, Winkel bleiben ruhig. Das erfüllt »unregelmäßig«,
ohne den Kranz zu zerstören. **Georg entscheidet am Bild, nicht am Text.**

---

## §3 Sechs Lücken, alle einsortierbar

| # | Bauanleitung | Stand | Wohin |
|---|---|---|---|
| 1 | **Rede: weich gerundet, leicht asymmetrisch, breiter als hoch, keine perfekte Ellipse** | **jittriges Rechteck** (Erbe Pet Studio v4, Kanon seit v10-S9) | **Entscheidung Georg:** Hausform Rechteck behalten oder auf Rundform wechseln. Das ist eine Stilfrage, keine Lücke — und es betrifft jede Blase im Spiel |
| 2 | Gedankenpfad: **2–3 Kreise, Durchmesser 0,35/0,55/0,8 der Wolke, versetzt, nicht auf einer Geraden** | 2 Kreise, feste Radien 5/3,2 px, **auf der Achse** | C3, zwei Zeilen: Radien aus der Wolkengröße ableiten, Querversatz einbauen |
| 3 | Tail: **Ansatz im unteren Drittel**, Ziel **Gesichts-Anker** (gesetzt, nicht geraten), Länge ~halbe Strecke, **Deckel 22 px** | Ansatz im mittleren Band (32–68 %), Ziel = Kopfpunkt (`y − bodyH`), Deckel **34 px** | C3. Der Gesichts-Anker gehört in `units-catalog.js` als Datum je Einheit — sonst wird er geraten |
| 4 | Gedanke **kursiv**, Flüstern **geringerer Kontrast** | beide in Grundschrift, voller Kontrast | C2-Nachzug, eine Zeile je Register |
| 5 | Wolke: 6–8 Lappen, **höchstens zwei deutlich größer**, **1–2 bewusst gebrochene Stellen** | 7–12 Lappen, gleichmäßig gestreut, keine Bruchstellen | C2-Nachzug, wenn Georg die Wolke nachschärfen will |
| 6 | **Debug-Schalter** (Textrechteck, Umriss, Anker, Tail-Ziel, Kollisionsrechtecke) | nur in den Messblättern | C3 — im Spiel fehlt er, und genau dort wird er gebraucht |

Nicht als Lücke gezählt, weil ausdrücklich C3/C4: Ablage mit vier Ankern, Ausweichen am Bildrand,
zwei Blasen gleichzeitig, Bewegungsmuster je Art (Pop · Aufprall · Abgang), Zoom-Rücksetzung.

---

## §4 Zwei Stellen, an denen die Bauanleitung veralteten Kanon trägt

Beides gehört korrigiert, **bevor** jemand danach baut — es ist dieselbe Fehlerklasse wie ein
veralteter Masterplan.

1. **§11: »Puste, Witz, Schneid«.** Diese Progression ist am 9.8. **verworfen und aus dem Code
   entfernt** worden (Masterplan §4.4). Es gilt: sechs Werte (Bizarro · Kayfabe · KayfaBINGO ·
   KayfaBONGO · KayfaBOGGLE · BLÖDSINN!), **Fluff = abgeleitete Lebenspunkte**, **POP = Währung**,
   kein sichtbares Level.
2. **§11: »BLÖDSINN! ist der Tod-und-Revive-Zustand, nicht irgendein Ausruf.«** Halb richtig: es ist
   **beides** — der sechste Wert *und* die Todes-Regie (V10-S5, Blinken → zackiger Flug → Landung).
   Als Blasentext ist es der Ausruf; als Zustand die Regie. Zwei Bedeutungen, ein Wort — und genau
   deshalb muss es dastehen.

Dazu die Schreibweise, seit heute Kanon: **KayfaBINGO · KayfaBONGO · KayfaBOGGLE** (zweiter Teil
groß). Die Fixture-Tabelle des Handovers schreibt `KAYFABINGO!`.

---

## §5 Was der Bau hat, das die Bauanleitung nicht kennt

Kein Widerspruch, aber es gehört zurückgemeldet — sonst baut der Coworker es ein zweites Mal:

- **Die Kante kommt aus dem Kanon, auf einer Canvas-Ebene** (`kanonFeder`, Preset `card`): Fläche und
  Maske bleiben SVG, die Feder zeichnet über dieselbe Punktkette. Damit ist »keine zweite
  Tusche-Schleife« nicht nur eingehalten, sondern **belegt** (Tuschepixel je Register gemessen).
- **Gestrichelt = Lücken über einer durchgängigen Kante** (Georgs Weg): der Kanon v2 hat **keine**
  gestrichelte Variante (kein `dashedPathD`, kein Preset `card-dash`) — der alte Aufruf griff seit
  v10-S15 ins Leere, das Flüstern hatte **nie** eine Kante. Jetzt Maske bzw. `destination-out`.
- **Superellipse (n = 3)** als Grundform für Wolke und Ruf, weil die Ellipse durch die Ecken bei
  breiten Zeilen seitlich 41 % abstellt und oben 14 % (Naht 126).
- **Mindestpolster 11/8 px** neben dem em-Polster: 0,60 em fallen beim Flüstern auf 8 px (Naht 125).
- **`satz()`** als eine Rechnung für Umbruch, Schriftgröße und **gemessene** Zeichenbreite —
  `charPx = font·0,60` stimmt nur für Courier (Naht 109).
- **Schrift-Variante** für den Lesbarkeitsvergleich: `courier` · **Special Elite** · **Shantell Sans**.

---

## §6 Perplexity — was hier fehlt

Im Workspace liegen zwei Perplexity-Blätter, **beide über Tiny Swords**
(`uploads/handover-perplexity-tinyswords.pdf`, `uploads/Perplexity - SampleTinySwords - Tipps +
Reeferences.pdf`). **Zu Sprechblasen liegt nichts vor.** Ein Abgleich »gegen Perplexity« ist damit
heute nicht möglich, ohne ihn zu erfinden.

Sinnvoll wären genau drei Fragen, weil sie die drei offenen Formentscheidungen treffen:
1. Wann liest eine Zackenblase als **Kranz** und wann als billiger Stern? (Winkel- gegen
   Längenstreuung — §2 dieses Blattes.)
2. Ist die **rechteckige** Sprechblase mit Tuschekante eine tragfähige Hausform, oder erwartet das
   Auge im Comic die Rundform? (§3 Punkt 1.)
3. Übliche Maße für **Gedankenpfad** und **Tail-Deckel** in Pixelspielen mit 64er Kachel.

---

## §7 Empfehlung für den Check-in

**Einchecken wie gebaut.** C1 und C2 sind gegen ausgerechnete Zahlen abgenommen, die Kante kommt aus
dem Kanon, und die offenen Punkte sind benannt statt verhandelt. Drei Dinge gehören in denselben
Export:
1. dieses Blatt,
2. die Bitte an WS1 (Kanon braucht eine gestrichelte Variante und eine SVG- oder Canvas-Ausgabe,
   Handover §5b),
3. die Rückmeldung an den Coworker: §2 (Zacken), §4 (veralteter Kanon), §5 (was schon da ist).
