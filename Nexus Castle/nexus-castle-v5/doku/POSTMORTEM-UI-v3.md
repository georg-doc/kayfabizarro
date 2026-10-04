# Postmortem — das TS-UI in v3 (vier Runden, kein Ergebnis)

Datum: 2026-08-14 · Betroffen: HUD von `Nexus Village v3.dc.html` · Ausgang: TS-Slice-HUD verworfen,
v3 bekommt ein eigenes minimales UI; das kanonische TS-UI wird in v4 von der Bau-Logik aus gebaut.

## Was passiert ist
Vier Abnahmen hintereinander "needs_work", jedes Mal am selben Gegenstand: die HUD-Flächen sollten
aus den Tiny-Swords-Slice-Blättern gebaut werden. Zwischenstände: CSS `border-image` (Ecken
skaliert), dann das Canvas-Kit ohne Aufruf, dann mit falschem Ref, dann mit leerem `PARTS`, dann
nackte Tafeln, dann eine Parchment-Fläche über der halben Karte, dann beschnittene Knöpfe.

## Der eigentliche Fehler (Georgs Befund)
**Ich habe immer nur die Ecken des großen Button-Blatts genommen, statt zuerst die Bau-Logik zu
verstehen.** Ein 9-Slice-Blatt ist keine Textur, die man an eine Box hängt — es ist eine
Konstruktionsvorschrift: das Blatt gibt die Zellgröße vor (hier 64), damit die **Mindestgröße** des
Bauteils (2 Ecken + 1 Kachel), und es gibt für kleine Chrome-Elemente ein **anderes** Blatt
(`*_3Slides`, eine Zeile, Kappen links/rechts, Mitte gekachelt). Wer ein 30-px-Knöpfchen auf ein
9-Slice mit 64er Zellen zieht, hat zwei Möglichkeiten: skalieren (verboten) oder beschneiden
(kaputt) — beide habe ich durchprobiert, statt die dritte zu nehmen: **das Element an das Blatt
anpassen oder das passende Blatt wählen.**

## Vier Folgefehler, die daraus wuchsen
1. **Wirkung vor Verständnis.** Ich habe das Aussehen kopiert (dicke Ecke = "sieht kanonisch aus"),
   nicht die Regel gelesen, die im Paket steht.
2. **Den funktionierenden Zustand zerstört, bevor der neue stand.** `border-image` wurde
   abgeschaltet, ehe ein Canvas vorlag → nackte Tafeln über dem Dorf.
3. **Patch-Anker nicht geprüft.** `initKit()` stand im File, wurde nie aufgerufen; drei Runden lief
   es scheinbar "grün" weiter.
4. **Quittung ohne Messung.** "Kanon erfüllt" stand in der Doku, während `[data-ts-key]` = 0 war.
   Ein Screenshot, auf dem der Rahmen dicker aussieht, ist kein Beweis.

## Was daraus verbindlich wird
- **Erst die Bau-Logik, dann der Pinsel.** Für jedes UI-Teil vorher notieren: welches Blatt, welche
  Zellgröße, 3-Slice oder 9-Slice, welche Mindestgröße folgt daraus. Erst danach Code.
- **Das Blatt bestimmt die Box.** UI-Maße werden aus der Zellgröße abgeleitet (Knopfhöhe = eine
  Zeile), nicht umgekehrt.
- **Nie den alten Zustand abschalten, bevor der neue gemessen ist.**
- **Jede Zusage braucht eine Probe im laufenden Bild** (DOM-Zähler, Beschnitt = 0), nicht ein Bild.
- **Nach jedem Skript-Patch prüfen, ob der Anker getroffen hat.**

## Entscheidung für v3 (jetzt umgesetzt)
Eigenes, zurückhaltendes UI statt halbgarer TS-Optik: dunkle Glasflächen (`rgba(20,25,19,.88)`,
1-px-Kante, 6-px-Radius), Shantell Sans, **drei** Fenster — Alarm, Konsole (Reiter *Log* /
*Settings*), Detail — plus ein kleines Banner oben links und ein Steuer-Cluster unten rechts.
**Tab** blendet alles außer Banner und Steuerung aus (`Escape` schließt Fenster). Die Party-Leiste
ist weg: Helden wählt man im Dorf an. Damit deckt das UI nie mehr als eine Ecke des Dorfs ab.

## Für v4 (TS-UI, sauber)
1. Blatt-Inventar mit Zellgröße und Rolle je Element (3-Slice für einzeilige Knöpfe/Reiter,
   9-Slice nur für Flächen ab 2×2 Zellen).
2. UI-Raster aus der Zellgröße ableiten (Knopf = 1 Zeile hoch, Fenster = n×m Zellen).
3. Canvas-Renderer (`ui-kit-ts.js`) als **einziger** Zeichenweg, DOM nur für Text und Klickfläche.
4. Abnahme: Beschnitt 0, kein CSS-`border-image`, Ecken pixelgleich zum Blatt (`cornerProof`).
