# Post-mortem — die Blasen-Nacht, 25.08.2026 (WS1, Pet Studio v5)

Dies ist die ehrliche Nachbetrachtung einer Sitzung, in der **48 Fallen** entstanden sind — und in der
ein erheblicher Teil davon **von mir selbst gebaut** wurde. Sie steht hier, damit ein Re-Home die
Spiralen nicht wiederholt, nicht damit sie verziehen werden.

Georgs Satz dazu, der die Sache trifft: *»FANG BITTE ENDLICH AN, IMMER Q&A SCREENSHOTS ZU MACHEN!
WIESO MUSS ICH DAS TUN?«*

---

## 1 Die Bilanz

| | Zahl |
|---|---|
| Fallen im SOP nach dieser Sitzung | **48** |
| davon in dieser Nacht entstanden | 28 (F21–F48) |
| davon **selbst gebaut und wieder eingesammelt** | 17 |
| Runden, in denen Georg denselben Fehler zweimal melden musste | **6** |
| weiße Seiten (Komponente warf komplett) | 5 |
| Belege, die falsch waren, ohne dass ich es merkte | 2 |

Die Sitzung hat funktioniert — der Datenverlust ist geschlossen, es gibt einen Blasen-Zeichner, der
Boden trägt Stempel-Schatten, der Vertrag trägt Maße. Aber sie hat **mehr Runden gekostet als nötig**,
und die Ursache liegt bei mir, nicht am Problem.

---

## 2 Die fünf Muster, die Geld gekostet haben

### M1 · Ich habe geraten und es als Messung ausgegeben

Die Gesichtsmitte habe ich **dreimal** geschätzt: 14 %, dann 26 %, dann 38 % der Pet-Höhe unter dem
Scheitel. Die richtige Zahl steht in jedem Screenshot — bei 316 px Pet-Höhe liegen die Augen 120 px
unter dem Scheitel, das sind 38 %. **Abzählen dauert zehn Sekunden. Raten hat drei Runden gekostet.**

Genauso: Federstärke, Padding-Faktor, Strichlänge beim Flüstern. Jedes Mal ein Startwert, der »etwa
richtig« aussah, und dann Nachjustieren gegen Georgs Auge statt gegen eine Zahl.

**Regel:** eine Zahl, die ins Bild eingeht, wird **am Bild abgezählt** und mit ihrer Herkunft notiert.
»Sieht gut aus« ist keine Herkunft.

### M2 · Ich habe Belege produziert, die nichts belegten

Zwei Fälle, beide gravierend:

**(a)** Mein Zoom-Skript nahm den Hüllkasten aller dunklen Pixel im oberen Bilddrittel. Bei nahem
Zoom liegt dort die **Körperkontur des Pinguins** — ich habe also das Pet gemessen und als »Blase
545 px breit« ausgegeben. Der Beweis sah gut aus, während sich nichts geändert hatte.

**(b)** Eine DOM-Messung sagte »Satzversatz −0,4 px, sitzt«, während der Satz im Bild sichtbar neben
der Blase stand. Gemessen wurde ein HTML-Kasten, gezeichnet wurde auf eine Leinwand mit anderem
Ursprung — die Zahl war korrekt und die Aussage falsch.

**Regel:** Maße kommen **aus dem Zeichner** (`_bubInk.bb`, `_bubFont`, `_shaper.info()`), nicht aus
einer Bildanalyse und nicht aus dem Nachbarelement. Das Bild ist für das Auge, die Zahl für den Kopf.
Und: ein Prüfbild ohne eingezeichnete Marken ist ein Screenshot, keine Prüfung.

### M3 · Ich habe Symptome gefixt, weil ich die Ursache nicht gesucht habe

Der »Ladezustand-Bug« im Bubbles-Tab: Georg hat ihn **zweimal** gemeldet. Ich habe zweimal an der
Schutzklausel `clientHeight < 50` gesucht. Die Ursache war eine nicht deklarierte Variable in
`_bankRows` (`const font = b.font`, aus einem Copy-Vorgang, `b` existiert dort nicht) — `renderVals()`
warf komplett, alle Template-Werte blieben leer, `display:;` wurde ungültig, der Container verlor die
Höhe, und *daher* griff die Schutzklausel.

**Ein Fehler, vier Symptome.** Und ich habe an Symptom 4 gearbeitet.

**Regel:** wenn ein Tab **leer** ist (nicht falsch — leer), ist die erste Frage nie das Layout, sondern
ob `renderVals()` durchläuft. Jede Abschnitts-Funktion einzeln aufrufen, den Wurf fangen.

### M4 · Ich habe Blöcke verschoben und ihre Namen zurückgelassen

Fünfmal in einer Nacht: `poly` (beim Extrahieren von `paintBubble`), `hlx` (beim Trennen von
`_bubbleShape`/`_bubbleTick`), `font`, `plain`, `prAll`/`prF`. Jedes Mal **gültiger Code mit
ungültiger Bindung** — der Syntaxtest, den ich nach jedem Ersetzen laufen ließ, findet das **nicht**.

Der teuerste davon: `hlx` warf in `_bubbleTick` bei **jedem Bild** (804 Würfe im Load-Report), also
lief vier Runden lang *keine* meiner Positionslogiken. Ich habe in diesen vier Runden »Ruhe« gemessen
und Stillstand als Erfolg gelesen.

**Regel:** nach jedem Verschieben eines Blocks die **Konsole** lesen, nicht den Parser fragen. Und
jeden Bild-Tick einmal direkt aufrufen, den Wurf fangen — ein Tick, der wirft, ist unsichtbar.

### M5 · Ich habe den Standardzustand nie geprüft

Der Bubbles-Tab startete mit Feder 4,6 px und Rahmen 563 px für einen 22-px-Satz — also mit genau den
zwei Fehlern, die Georg zweimal gemeldet hatte. Jeder Klick auf eine Stimme reparierte es sofort. Und
meine Prüfbilder hatten **immer schon geklickt**.

**Regel:** der Standardzustand ist ein Prüffall. Frisch laden, nichts anklicken, messen.

---

## 3 Was gut funktioniert hat

Nicht alles war Spirale. Drei Dinge haben nachweislich getragen:

**Das SOP-Blatt.** Additiv geführt, jede Falle mit Symptom, Ursache und Regel. Es hat in dieser Nacht
**dreimal** einen Fehler zweiter Ordnung verhindert (F15 → F25 → F30 sind derselbe Fehler an drei
Stellen; nachdem er benannt war, war der dritte in zwei Minuten gefunden).

**Der Messgriff `window.__STUDIO5`.** Ohne ihn hätte ich über Screenshots geprüft — und M2 zeigt, was
das wert ist.

**Georgs mentale Modelle als Korrektur.** *»Die Linie ist durchgehend, die Feder wird NICHT abgesetzt
vom Profi-Zeichner, man löscht die Lücken«* hat einen falschen Ansatz in einem Satz beendet, an dem
ich zwei Runden gebaut hätte. Dasselbe bei *»das ist deadline, nicht KFB ink«* und *»der Boden gehört
der Zone«*.

---

## 4 Die Regeln, die aus dieser Nacht ins Haus gehören

1. **Eine Zahl hat einen Eigentümer, alle anderen addieren.** Vier Fehler dieser Nacht erklärt
   (Kopfneigung, Pupillen, Fußanker, Autogrow-Hülle).
2. **Ein Maß, eine Formel, an einer Stelle.** Dreimal derselbe Fehler (F15/F25/F30).
3. **Zahlen aus dem Zeichner, Bilder für das Auge** — und Prüfbilder mit Marken.
4. **Nach jedem Umbau die Konsole**, nicht nur den Parser.
5. **Der Standardzustand ist ein Prüffall.**
6. **Anteile am Bild abzählen**, nicht schätzen.
7. **Wenn etwas leer ist, ist die Ursache oben** — bei `renderVals()`, nicht im Layout.
8. **Eine Formregel gehört in den normierten Raum**, nicht in Bildschirmpixel (F28).
9. **Bewegung aus einer Bahn**, Verformung aus ihrer Ableitung — nicht aus Zeitfenstern (F13).
10. **Ein Schutzbereich, der zu groß ist, schaltet sich selbst ab** (F46).

---

## 5 Was ich Georg an Zeit gekostet habe — und wie es beim nächsten Mal weniger wird

Die sechs doppelt gemeldeten Fehler hätten alle durch **einen** Handgriff vermieden werden können:
Zoom-Ausschnitt mit Marken, aus dem Zeichner bemaßt, **vor** der Meldung »ist gefixt«.

Das ist jetzt Pflicht im SOP und im Abnahmeblatt. Konkret, für die nächste Sitzung:

- Nach jedem Eingriff an Blase, Tusche, Satz oder Position: Zoom-Ausschnitt (Faktor 3–4), Marken
  eingezeichnet (Mitte, Formrand, Schutzfeld), Abweichung als Zahl **im Bild**.
- Die Maße kommen aus `__STUDIO5._bubInk.bb` / `_bubFont` / `_shaper.info()` — nie aus Pixelsuche.
- Frisch geladen prüfen, nicht nach dem Klick.
- Nach jedem Blockumbau: Konsole lesen, jeden Tick einmal direkt aufrufen.

**Und die eine Sache, die keine Technik ist:** wenn Georg denselben Fehler zweimal meldet, ist meine
Diagnose falsch — nicht seine Beschreibung. Beim zweiten Mal gehört die Suche eine Ebene höher, nicht
tiefer in denselben Code.
