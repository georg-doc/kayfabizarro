# Briefing für Claude Design · H15 Mindscape · Gedichtband lesbar · WS0 · 02.11.2026 (V-1252)

**Tier 0**
1. **Georg 02.11.:** Die Gedichte im Band sind oft zu stark zerschnitten, oder ein Halbsatz erscheint mehrfach. So kann man sie weder lesen noch als Gedicht erkennen. Cut-up bleibt als Stil, aber jede gezeigte Einheit muss lesbar sein.
2. **Ändern nur in `KFB_H15_Mindscape/poems.js` (`verse`, `PoemBand`), additiv in deiner H15-Datei.** Der Takt, die Schriften, die Paletten, das Soundbed und die Schalen bleiben, wie sie sind. H13 und H14 fasst du nicht an.
3. **Abgenommen wird an einem Clip mit Ton** (30–60 s, Autopilot an), daneben derselbe Ablauf vorher. Damit beide gleich sind: feste Saat und eine feste Auswahl von drei Gedichten und zwei Zitaten, nicht live von Wikisource. Georg muss jede Einheit zu Ende lesen können.

## Ursachen im Code (WS0)
- **Wiederholung:**
  - `start()` hält die letzten drei Zeilen als `ghosts` lesbar über und unter der neuen Zeile.
  - `pickItem` zieht mit Zurücklegen, dasselbe Gedicht kann sofort wiederkommen.
- **Zerschnitten:**
  - Jede Verszeile ist eine eigene Einheit; läuft der Satz über das Zeilenende, steht ein halber Satz allein.
  - `verse()` beginnt beim längsten Block statt bei der ersten Strophe.
  - Der Filter (`l.length <= 90`, `JUNK` mit „From…“, „By…“, „press“, „London“) wirft einzelne Zeilen mitten im Satz heraus.
  - Der Prosa-Rückfall setzt fremde Sätze aneinander.
- **Zu kurz lesbar:**
  - Im DROP ist `hold` 0,6.
  - Die Obergrenze `Math.min(10, …)` in `nextLine` kappt jede Einheit bei rund 5 s.
  - `TYPE` ist erst nach einem Drittel ganz da, `SCATTER` erst nach 40 %.
- **Aus dem Blick:**
  - `u` wird nur in `start()` gesetzt; im Autopilot wandert der Blick weiter, und die Einheit läuft aus dem Bild.
  - `SPREAD` macht die Zeile breiter, als die Breitenanpassung in `set()` rechnet.
  - Zitate stehen auf einer Zeile und schrumpfen dadurch sehr klein.

## Was sich ändern soll
1. **Sinneinheit statt Verszeile:**
   - Folgezeilen bis zum nächsten Satzzeichen (. ; : ! ? —) zu einer Einheit zusammenziehen.
   - Höchstens zwei Zeilen untereinander. Ist es länger, an Satzzeichen teilen, im Notfall am Komma.
   - Dafür muss `set()` mehrzeilig setzen können. Zitate genauso.
2. **Das Gedicht als Ganzes:**
   - Strophen in ihrer Reihenfolge ab der ersten.
   - Gefiltert und gekürzt wird nur strophenweise, nie eine einzelne Zeile.
   - Kein Prosa-Rückfall aus fremden Sätzen.
3. **Keine lesbaren Wiederholungen:**
   - Ghosts nur noch als unlesbare Textur oder ganz weg.
   - Gedichte und Zitate aus einem gemischten Stapel ohne Zurücklegen. Erst wenn alle einmal dran waren, wird neu gemischt.
4. **Lesezeit:**
   - Etwa 0,35 s je Wort plus 1,2 s, auch im DROP, auf ganze Schläge nach oben gerundet.
   - Die Obergrenze von 10 Schlägen entfällt oder wird entsprechend höher.
   - TYPE, SCATTER und SPREAD sind nach spätestens 20 % der Zeit fertig. Danach steht der Text ganz und still.
5. **Im Blick und groß genug:**
   - Die Einheit folgt sanft der Blickrichtung (`u` je Bild nachführen, gedämpft).
   - Die Breitenanpassung rechnet SPREAD mit ein.
   - Es gibt eine Mindestschriftgröße. Wird sie unterschritten, teilt sich die Einheit (Punkt 1), statt weiter zu schrumpfen.

## Zurück
- Clip vorher und nachher.
- Die geänderte Datei.
- Je Punkt 1–5 eine Zeile: erfüllt, oder offen und warum.

Der neue Stand kommt über WS0 in die Experience der Curator-Site.
