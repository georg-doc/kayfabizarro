# Briefing für Claude Design · H15 Mindscape · Gedichtband lesbar · WS0 · 02.11.2026 (V-1252)

**Tier 0**
1. **Georg 02.11.:** Die Gedichte im Band sind oft zu stark zerschnitten, oder ein Halbsatz erscheint mehrfach. So sind sie weder lesbar noch als Gedicht erkennbar. Cut-up bleibt als Stil, aber jede gezeigte Einheit muss sich lesen lassen.
2. **Nur `KFB_H15_Mindscape/poems.js` (PoemBand, verse) ändern, additiv in deiner H15-Datei.** Takt, Schriften, Paletten, Soundbed und Schalen bleiben unberührt. H13 und H14 werden nicht angefasst.
3. **Abnahme an einem kurzen Clip mit Ton** (30–60 s, ruhiger Blick auf das Band), daneben derselbe Ausschnitt vorher. Georg muss jede Einheit zu Ende lesen können.

## Was WS0 im Code sieht (Ursachen)
- **Wiederholung:** `start()` hebt die letzten drei Zeilen als `ghosts` auf. Sie stehen versetzt über und unter der neuen Zeile und bleiben lesbar. So erscheint derselbe Halbsatz zweimal.
- **Zerschnitten (1):** Jede Verszeile ist eine eigene Einheit. Bei Zeilensprung steht dann ein halber Satz allein.
- **Zerschnitten (2):** `verse()` beginnt beim längsten Block, oft mitten im Gedicht. Die erste Strophe fehlt.
- **Zu kurz lesbar:** Im DROP ist `hold` 0,6. `TYPE` deckt die Buchstaben erst nach und nach auf, `SCATTER` setzt sie erst nach 40 % der Zeit zusammen. Für das ruhige Lesen bleibt danach zu wenig Zeit.
- **Aus dem Bild:** Eine Zeile kann bis zu 30 % des Bands breit sein, also rund 108°. Bei Blickwechsel liegt ein Teil außerhalb des Sichtfelds oder über der Naht.

## Was sich ändern soll
1. **Sinneinheit statt Verszeile:** Folgezeilen bis zum nächsten Satzzeichen (. ; : ! ? —) zu einer Einheit zusammenziehen. Sie steht auf höchstens zwei Zeilen untereinander. Längere Sätze werden nur an Satzzeichen geteilt.
2. **Gedicht von vorn:** Strophen in ihrer Reihenfolge ab der ersten. Wird gekürzt, dann nur am Strophenende.
3. **Keine lesbaren Wiederholungen:** Ghosts nur noch als Textur (unscharf oder als bloße Formen) oder ganz weg. Dieselbe Einheit kommt im selben Durchgang nicht zweimal.
4. **Lesezeit:** etwa 0,35 s je Wort plus 1,2 s, auch im DROP. Effekte (TYPE, SCATTER, SPREAD) sind nach spätestens 20 % der Zeit fertig, danach steht der Text still und ganz da. Der Rhythmus bleibt im Takt; gerundet wird auf ganze Schläge nach oben.
5. **Im Blick:** Jede Einheit sitzt in der aktuellen Blickrichtung, höchstens etwa 60° breit, nie über der Naht.

## Zurück
Clip vorher/nachher, geänderte Datei, eine Zeile je Punkt 1–5 (erfüllt / offen und warum). Der neue Stand geht über WS0 an die Experience in der Curator-Site.
