# SLICE 1 · Wasser KISS — gebaut (WS0, 2026-08-12)

Fassung: `KFB Overworld v12.dc.html` + `overworld-v12/` (75 Module). Fork-Basis ist v11 (§4u);
der Runner wurde an **drei** Stellen angefaßt, sie stehen unten als Diff.

Entschieden am 11.8. (`docs/overworld-v11/HANDOVER_WS0_2026-08-11.md` §A, Punkt 1), gebaut hier.

---

## §1 Was gebaut wurde

**`overworld-v12/water-kiss.js` (`OW_WATER`, water-v1.0)** — eigenständig, hängt an nichts.
Drei Regeln, eine Zahl:

1. **Eine Streufarbe je Fluid-KÖRPER.** Bis v11 glitzerte **jedes** Fluid weiß
   (`d[i]=d[i+1]=d[i+2]=255` in `terrain-paint.js`) — Öl, Kaugummi und Säure warfen dasselbe Licht
   zurück wie Meerwasser. Jetzt: `wasser #e6f6ff` · `bubblegum #ffe4f2` · `oel #9fb4d2` ·
   `saeure #dcff87`. Der Säure-See ist **ein** Giftgrün, nicht Wasser mit grünem Anstrich.
2. **Flach und tief kommen aus der Tiefe, nicht aus einer zweiten Farbe.** Der Schelf am Ufer ist
   dieselbe Streufarbe, nur mehr davon: zwei weiche Striche auf **derselben** Küstenkontur, aus der
   Fläche und Feder entstehen (eine Kontur, mehrere Leser — Muster von `reach.js`).
3. **Gradienten statt Höhenfeld.** Das Glitzern sitzt auf der **Neigung**: ein Kamm ist waagerecht
   und wirft nichts zurück, die Flanke tut es. Die Ableitung kommt aus der Summenformel, nicht aus
   der Differenz zweier Nachbarpixel (die wäre bei 256 Punkten je Kachel selbst eine Abtastung).

**Die geführte Zahl.** `OW_WATER.probe()` gibt die RMS-Neigung in Grad.
Gemessen (analytisch, beim Laden in der Konsole): **4,00° — Ziel 4,0°**.
Die absolute Wellenhöhe folgt aus der Zielneigung, nicht umgekehrt: wer die Zahl dreht, dreht die
Zahl — die Wellen bleiben, wie sie sind.

**Und die zweite Zahl, die es braucht: was in der Kachel wirklich steht.** `OW_WATER.messung(f)`
scannt die gebaute Kachel. Gemessen: **maxAlpha 230 von 255 · Deckung 32,8 %** der Pixel über
Alpha 12 · P98 der Neigung **6,89°** · Spitze des Feldes **8,11°** (die obere Schranke aus der
Summenformel liegt bei 10,95° — sie ist **nicht** die Spitze, siehe Naht 71). Auf dem Bild landet
die grobe Lage mit Deckung 0,30, also rund **69 von 255** in der hellsten Flanke. Zum Vergleich der
erste Anlauf: maxAlpha 30, Deckung 0,5 %, auf dem Bild **5 von 255**.

**Die vier Wellen** (Wellenzahlvektoren, Kachel 256):

| k | Länge | Wellenlänge | Winkel | Amplitude |
|---|---|---|---|---|
| (3, 1) | √10 = 3,162 | 81,0 px | 18,4° | 1,00 |
| (−2, 5) | √29 = 5,385 | 47,5 px | 111,8° | 0,62 |
| (7, −4) | √65 = 8,062 | 31,8 px | −29,7° | 0,34 |
| (1, 9) | √82 = 9,055 | 28,3 px | 83,7° | 0,20 |

Ganzzahlig, damit die Kachel sich exakt schließt; die Längen stehen in irrationalen Verhältnissen
und keine zwei Richtungen sind parallel. **Es gibt keinen Streifenabstand, den man messen könnte.**

---

## §2 Diff am Runner (geht an WS1 zurück, kein stiller Fork)

`overworld-game-v10.js` — zwei Stellen:

1. **`paintOpt` trägt `fluid` und `nah`.** Das Glitzern nimmt seine Farbe aus dem Fluid; `nah`
   (Zoomschwelle 0,7) steht mit in den Zeichenoptionen, damit die Schwelle **eine Zahl an einem
   Ort** bleibt — der Wasserzweig liest sie unten wieder, statt sie nachzurechnen.
2. **Der Aufruf von `drawWater` ist gewandert** — von vor der Bodenschicht nach **hinter** die
   Fluid-Schicht des Waber-Shaders. Siehe Naht (67).

`terrain-paint.js` (tp-v4.6) — `drawWater` delegiert an `OW_WATER` und behält nur Clip und
Ausschnitt. Fällt das Modul aus, zeichnet der alte Rauschweg weiter (weiß, ohne Schelf): das Spiel
läuft mit schlechterem Wasser weiter statt gar nicht.

---

## §3 Die Nähte (Fortsetzung der Zählung)

**(67) Eine Schicht, die zugedeckt wird, ist keine Schicht — sie ist eine Rechnung.** Das Glitzern
wurde **vor** dem Land gezeichnet; die Fluid-Schicht des Waber-Shaders legt sich danach mit Deckung
**0,82** auf dasselbe Wasser. Von jeder Glanzstelle blieben **18 %**. Das Wasser wirkte deshalb wie
ein reines Wabern — nicht weil das Muster zu schwach war, sondern weil es unter seinem Material lag.
*Wer eine Schicht verstärken will, prüft zuerst, was nach ihr kommt.*

**(68) Weiß ist keine Farbe des Körpers.** Streulicht trägt die Farbe dessen, woran es streut. Vier
Fluide teilten sich eine weiße Glanzkachel — der Fehler fällt nur dort auf, wo der Körper weit vom
Weiß weg ist (Öl), und sieht überall sonst wie Absicht aus.

**(69) Kachelbar und inkommensurabel schließen sich nicht aus.** Der Cord-Befund (§418 in
`terrain-paint.js`) wurde damals dem Sinus angelastet — er lag an **zwei Wellen mit kommensurablen
Perioden**. Ganzzahlige Wellenzahlvektoren halten die Kachel nahtlos, ihre Längen dürfen trotzdem
irrationale Verhältnisse haben. *Nicht die Bauart war falsch, die Auswahl war es.*

**(70) Eine Neigung, die niemand führt, wandert.** Der alte Weg hatte keine Steigungszahl, nur eine
Alpha-Rampe — »sieht gut aus« als einzige Abnahme. Die Zahl steht jetzt im Modul, wird beim Laden
gemeldet und ist **analytisch**, nicht am Bild gemessen: im gedrosselten Vorschaufenster kommt kein
Frame (Naht 66), eine Bildmessung wäre dort wertlos.

**(71) ⚠ Eine Schranke ist keine Verteilung.** Die Rampe teilte zuerst durch `GMAX` = **Summe** der
vier Einzelbeträge — eine obere Schranke, die nur erreicht wäre, wenn alle vier Wellen an derselben
Stelle gleichzeitig ihren Scheitel hätten **und** parallel stünden. Das kommt nicht vor: die
tatsächliche Spitze liegt bei einem knappen Drittel davon, die Rampe (0,58) traf also fast nichts.
Gemessen kamen **maxAlpha 30 von 255 und 0,5 % Deckung** heraus — auf dem Bild 5 von 255, exakt die
Zahl, vor der `terrain-paint.js` §449 seit v10 warnt, und **derselbe Fehler ein zweites Mal**.
Jetzt teilt die Rampe durch das **P98 des wirklich gerechneten Feldes**, und `messung()` gibt beide
Zahlen zurück, statt sie zu behaupten. *Wer normiert, muss die Verteilung kennen, nicht die Grenze.*

**(72) Ein Slice, der nur im Boot-Log abgenommen wird, ist nicht abgenommen.** Die Wasserschicht
hängt an `nah` (`zoomEff()/dpr ≥ 0,7`). In der Standardansicht ist `zoomEff()` 1 bei `dpr` 2, also
**0,5 — der ganze Zweig läuft nicht.** Eine Abnahme aus Ladezeilen hätte das nie bemerkt.

---

## §4 Abnahme 2026-08-12 (Konsole, echter Bedienweg)

`[water] water-v1.0 — vier inkommensurable Wellen · RMS-Neigung 4° · Kachel maxAlpha 230/255,
Deckung 32,8 %` · Module **39/39** · **keine Fehlerzeile** · Audio 26 Ereignisse, Ansager 12/12 ·
Relief 7 von 9, 412 ms kalt · Boden 13/13 Blätter · Welt 240×180, 6 Zonen, 23 Mobs + 8 Wegelagerer ·
Rückseiten-Satz kfb 1 Blatt, Zonen 6/6 · `[rail-v9b] Kartenspalte steht`.

**Der Wasserzweig, getrennt abgenommen** — und das ist die Abnahme, die zählt:
· **Bedingung genannt:** gezeichnet wird nur bei `paintOpt.nah`, also `zoomEff()/dpr ≥ 0,7`.
  In der **Standardansicht** ist das 1/2 = **0,5 → der Zweig läuft nicht** (Bestand seit v10-S1f,
  keine Regression). Gemessen wurde deshalb mit erhöhtem Zoom.
· **Aufrufzählung:** `OW_TERRAIN.drawWater` **20 Aufrufe in 800 ms** mit
  `{fluid:'wasser', nah:true}`.
· **Kachel gescannt:** hellste Farbe je Fluid richtig — Wasser [238,246,255] · Säure [221,255,136] ·
  Öl [161,187,212]; maxAlpha 230/255, Deckung 32,8 %.

**Bild-Abnahme entfällt** — im gedrosselten Vorschaufenster kommt kein Frame (Naht 66).

---

## §5 Nachtrag 12.8. — die Sperre, die alles unsichtbar hielt (v12-W1c)

Georgs Befund nach der ersten Runde: »Wasser sieht aus wie zuvor«. Es war nicht das Muster.
Der ganze Wasserzweig hängt seit v10-S1f an `nah` (`zoomEff()/dpr ≥ 0,7`) — auf einem Gerät mit
**dpr 2** ist die Standardansicht **0,5**. Das Wasser hat also **nie** geglitzert, in keiner Sitzung;
es gab nichts zu verbessern, weil nichts gezeichnet wurde.

Der Grund für die Sperre war echt: eine Kachel, hart verkleinert, greift je Zeile andere Quellpixel
und wird streifig. Die Antwort darauf ist aber, die Kachel **nicht** zu verkleinern, statt den Zweig
abzuschalten. `OW_WATER.glitzer` gibt dem Maßstab eine Untergrenze: ein Quellpixel fällt nie unter
**0,6 Gerätepixel**. Weiter weg wird das Muster größer und ruhiger, statt zu verschwinden.

**(73) Eine Sperre gegen ein Bildfehler-Risiko ist auch ein Ausschalter.** `nah` sollte Streifen
verhindern und hat stattdessen das Merkmal entfernt — auf jedem Retina-Gerät dauerhaft. *Wer ein
Risiko wegschaltet statt es zu behandeln, hat die Funktion weggeschaltet.*

---

## §6 HUD-Runde 12.8. (vier Befunde von Georg)

**(74) ⚠ `document.activeElement` hört an der Schattengrenze auf.** »R« öffnete das Roster,
während man den Namen tippt — obwohl die Tastenzeile `tippt()` fragt. Die Abfrage war da, sie hat
nur nie etwas gesehen: bei einem Shadow-Root gibt `document.activeElement` **den Wirt** zurück
(das Spiel-Element), und das ist weder editierbar noch ein `input`. Jetzt steigt sie durch jede
Schattenwurzel hinab. Nebenbefund: betroffen sind **nur Tasten mit `capture`** — das Feld schluckt
seine Tastendrücke, aber eine capture-Zeile am Fenster läuft davor. *Wer capture nimmt, muss selbst
fragen, ob getippt wird.* (Runner und `hud-v7.js` hören ohne capture und waren nie betroffen.)

**(75) Ein Dreieck von 9×6 px ist kein Ziel.** Die Zeichnung bleibt klein, die Trefferfläche wächst
auf 31×28 px (unsichtbares Kind). *Zeichen und Ziel sind zwei Dinge.*

**(76) Eine feste Zahl kann nicht ausweichen — und eine spätere feste Zahl schlägt sie.** Das
Statblatt stand auf 446 px fest und schob bei schmalem Fenster die Reihe Ton/Einstellungen aus dem
Bild. Vier Variablen führen die Größe jetzt in drei Stufen (1280 / 1060 / 900 px) — aber der erste
Anlauf wirkte an **einer von vier** Stellen, und das war der lehrreiche Teil:
· `.r9stat.slim .sheet{width:434px}` ist **spezifischer** als die neue Grundregel, und `slim` ist der
  Normalzustand — die Stufe war ein Vorschlag, den niemand las. Jetzt
  `calc(var(--r9sheet) - 12px)`: der zugeklappte Stand ist eine **Differenz**, keine zweite Breite.
· Der Avatar bekam seine Kantenlänge **inline aus dem JS** (`avCv.style.width = AV_SIZE`), und eine
  Inline-Zeile schlägt jede Regel. Die Zahl steht jetzt nur noch im CSS; `sheetH()` **misst** sie,
  statt sie anzunehmen.
· Der Fluff-Balken hat nur im ausgefahrenen Stand eine eigene Breite — zugeklappt ist er `flex:1`
  und folgt dem Blatt. Er brauchte also gar keine eigene Stufe; er brauchte ein schmaleres Blatt.
**Nicht per `transform`** — das Blatt trägt eine Canvas-Kante, und eine gedehnte Tuschefeder weicht
auf (§4h Naht 7); die Kante wird bei der neuen Breite neu gezogen.
*Merksatz: eine Variable wirkt erst, wenn sie die spezifischste Zahl im Bild ist — Kaskade und
Inline-Stil sind beide stärker als eine gute Absicht.*

**(77) Selbstkorrektur: die Diagnose war falsch, der Griff daneben harmlos.** Hier stand, das
Logbuch sei `pointer-events:none` und seine `:hover`-Zeile deshalb tot. **Gemessen am lebenden
Element: `pointerEvents` ist `auto`**, und `elementFromPoint` in seiner Mitte trifft sein eigenes
Kind — die Hover-Zeile feuert also. Ich habe den CSS-Kommentar daneben gelesen statt das Element
gemessen; er beschreibt einen Stand, den die Datei nicht mehr hat. Dieselbe Klasse wie §4q:
*ein Dokument, das Zahlen abschreibt, wird still falsch.*
Was bleibt: ein Saum von 22 px um das Rechteck, damit man das Logbuch nicht auf den Pixel treffen
muss — nützlich, aber nicht die Ursache.
**Offen und ausdrücklich ungeklärt:** warum Georg nichts sah. Als Nächstes zu messen, ob im
fraglichen Moment überhaupt Zeilen im Logbuch standen (ein leeres Blatt blendet nichts ein) — und
ob ein Ding, das unsichtbar ist, bis man es berührt, gefunden werden kann. Die Entscheidung
»aus heißt AUS, nicht gedämpft« (Georg, 9.8.) bleibt bis dahin unangetastet.

**(78) ⚠ Siebter Backtick-Treffer — und diesmal im Kommentar, der genau das erklärt.** Der
CSS-Block von `card-rail-v9b.js` ist ein Template-Literal; ein Backtick darin beendet es, und der
Rest der Datei ist kein String mehr. Wirkung wie in §4h (8)/(12) und §4o (35): `SyntaxError`,
**das Rail fällt komplett aus, und das HUD sieht dabei heil aus** — Boot-Log unauffällig, 39/39
Module, `[water]` sauber. Der einzige Unterschied im Log ist eine **fehlende** Zeile.
**Abnahme dieses Moduls ist deshalb `[rail-v9b] Kartenspalte steht`, nicht der Boot-Log.**
Eine fehlende Zeile sieht man nur, wenn man sie vorher benannt hat.

## §8 water-v2.0 — die Formfrage (12.8., nach Georgs Bild)

Georgs Befund: »ovale Fische und weichgezeichnete Aale« · »das Moving-Layers-Konzept funktioniert
gut« · »es passt nicht zum Cartoon-Stil, die Wellen sehen billig aus« · »die weißen Wellen des
alten Waber-Shaders waren überzeugender«.

**(79) Der Betrag eines Gradientenfeldes ist ein Höhenzug — also Aale.** v1 zeichnete |∇h| als
weiche Rampe: das Feld bildet geschlossene, lange Schlingen, und weich abgeblendet werden daraus
genau die Aale. Dazu: **eine weiche Kante ist Airbrush**, und Airbrush ist das Gegenteil dieses
Bildes — jede andere Fläche hier trägt eine Tuschekante. Das war das »billig«; die alte
Waber-Schicht hatte harte weiße Formen, und genau das hat Georg vermisst.

**v2.0 macht vier Dinge anders:** harte Kante statt Rampe (Übergang 3,5 % ≈ ein Pixel) ·
Schwelle wird von grobem Rauschen moduliert, damit die Formen sich in Größe **unterscheiden** und
manche ganz ausfallen · **gestuftes Morphen** statt nur Drift (je Bild eigene Phase je Welle;
gestuft, weil eine Zwischenblende zweier harter Formen wieder eine weiche Kante ist) · zwei
verschieden lange Folgen (7 und 9 Bilder, gemeinsame Rückkehr erst nach 63 Schritten ≈ 24 s).

**(80) Ab hier war es keine Ingenieursfrage mehr — und ich habe es trotzdem wie eine behandelt.**
Vier Runden am Wellenzahl-Satz gedreht, und jede tauschte ein Artefakt gegen ein anderes: runde
Kleckse → senkrechte Streifen → lange Schlieren → ein Perlenband (das war wieder ein Cord).
Das ist eine Bildentscheidung, und die gehört Georg. Sie steht jetzt als **Schalter** da:

| Familie | Richtung der k | gemessene Deckung | Wandel je Bild |
|---|---|---|---|
| `kleckse` (Vorgabe) | gekreuzt | 9,9 % | 12,7 % |
| `striche` | 11–19°, fast parallel | 7,6 % | 10,8 % |
| `schlieren` | 71–101°, fast parallel | 4,8 % | 7,3 % |

Umschalten: Tweak **waterForm** am DC, oder `OW_WATER.form('striche')` in der Konsole.
**Die Richtung ist umgekehrt zur Anschauung:** der Kamm steht senkrecht auf k — fast parallele k
geben lange Formen quer dazu, gekreuzte k geben runde Inseln.

**(81) Eine Vorzugsrichtung ist kein Cord, ein messbarer Abstand schon.** Der Cord-Befund (§418)
war ein STREIFENABSTAND aus zwei kommensurablen Perioden. Alle drei Familien halten irrationale
Längenverhältnisse, und die Schwellenkarte lässt jede zweite Form ganz aus. Die verworfene
fünfte Runde (ein Schneider quer zum Kamm) hat den Cord zurückgeholt — sichtbar als Perlenband,
und deshalb ist sie nicht im Schalter.

## §10 Nachtrag 12.8., spät — Glitzern steht auf AUS

Georg: »es ruckeln Konfetti über den Screen, das sieht nach Performance-Problemen aus«.

**(82) Zwei Bewegungen, die sich widersprechen, liest man als Ruckeln.** Die Lage DRIFTET stetig,
die Form SPRINGT alle 0,38 s. Cartoon-Wasser ist gestuft **oder** es gleitet — beides zugleich
ergibt harte Kanten, die zucken, und harte Kanten, die zucken, sind Konfetti. Der Fehler steckte
nicht in den Wellenzahlen, an denen ich vier Runden gedreht habe; er steckte in der Kombination,
die ich in derselben Fassung als Lösung eingeführt hatte.

**(83) Wo mir das mentale Modell fehlt, gehört kein Entwurf hin.** Ich habe keine belegbare
Vorstellung davon, was Cartoon-Wasser lesbar macht — ich habe Effekte gebaut und danach beurteilt.
Deshalb steht das Glitzern jetzt auf **`aus`**: die Fluid-Schicht des Waber-Shaders zeichnet allein,
wie vor v12. Die drei Formfamilien und der Schelf bleiben erreichbar (`waterForm`), das Gerüst
bleibt stehen, aber nichts davon läuft ungefragt im Bild.
**Georgs Angebot (Shader-Recherche mit klarem Vorbild) ist angenommen** — was gebraucht wird, sind
zwei bis drei Referenzbilder oder -shader, an denen man das ZIEL messen kann.

Geschlossen dabei: die POP-account-Zeile im ausgefahrenen Blatt ist **raus** (Georg: Ballast, sobald
man es einmal verstanden hat). Der Weg zurück ist eine Zeile — `ACCT_ZEILE` in `card-rail-v9b.js`.
Und der Fluff-Balken läuft wieder bis an seine Zahl (die neue `--r9fluff`-Regel hatte der
slim-Regel ihr `flex:1` abgenommen; jetzt `:not(.slim)`), Avatar-Polster +14 px.

## §12 Karten-Zone und Kamera (12.8., dritte Runde)

**(84) Wer eine Kamera an eine Uhr hängt, hat eine Kamera, die sich selbst bewegt.** Auf dem
Leseblatt blendete die Kamera **zeitgesteuert** zwischen Held und Blattmitte über (Schmitt-Trigger
auf die Ruhe, 0,5 s Verweildauer). Georgs Bild: der Held bleibt am Eintrittsrand stehen, das Ziel
wandert von selbst weg — und weil die Dämpfung darunter mit derselben Zeitkonstante läuft, sind es
**zwei ineinander geschachtelte Glättungen**. Das ist das Schwimmen.
Der Anlass war echt und gemessen (V9-B3b: wer auf der unteren Kartenreihe steht, schiebt die
Oberkante aus dem Bild) — aber das ist eine **Geometrie**-Frage, keine Zeitfrage. Jetzt eine
Klammer: solange der Held auf dem Blatt steht, darf die Kamera nur soweit wandern, wie das ganze
Blatt im Bild bleibt; passt es nicht, steht sie auf seiner Mitte. Keine Uhr, kein Anteil.
`CAM_STILL_IN/OUT` und `CAM_DWELL` sind mitgegangen — eine Konstante ohne Leser ist die nächste
falsche Fundstelle.

**(85) Ein Moduswechsel, den der Spieler nicht ausgelöst hat, liest sich als Defekt.** Das Betreten
des Blattes setzte `minimal=true` (V9-B3b) — damals richtig, weil das HUD von 2026-08 die obere
Kartenreihe zudeckte. Seit dem Rail-Umbau steht links ein kleines Blatt und rechts eine schmale
Spalte, das Leseblatt liegt zwischen beiden. **Der Grund war weg, der Griff geblieben.** Raus; was
das Blatt im Bild hält, ist jetzt die Kamera-Klammer. TAB gehört weiter dem Spieler.

**(86) Requisiten dürfen überlappen, Einheiten nicht.** Ein Busch am Blattrand verdeckt keine Zeile;
eine Einheit steht mitten drauf und verdeckt genau das, wofür das Objekt existiert (Georgs Bild:
der Bär auf »The Missing Receipt«). `aufBlatt()` ist die eine Abfrage, drei Säher lesen sie
(Zonenwächter über `spawnPoints`, Kreaturen, Übungsgegner). Gemessen nach dem Fix: **42 Mobs, 0 auf
dem Blatt.**

## §14 Die Fluff-Zeile, sauber gelegt (12.8., vierte Runde)

Georgs Befund: »Balken, Wert und FLUFF-Label sind keine Einheit · POP steht in einer leeren Zeile ·
der Titel ist für längere Texte nicht geeignet« — samt Vorschlag, der jetzt gebaut ist:
**Name und Titel bekommen die obere Zeile ganz**, darunter **Balken + Zahl + FLUFF als eine
Gruppe**, dahinter leicht abgesetzt **x Pop**.

**(87) Ein Element, das nur wegen seiner Stabilität irgendwo sitzt, bezahlt die anderen dafür.**
POP saß seit v11-H5 in der Namenszeile, damit es beim Aufklappen nicht springt — ein guter Grund,
aber der Preis stand woanders: der Titel bekam den Rest der Zeile und half sich mit einer Ellipse,
und im schmalen Blatt stand POP allein auf einer sonst leeren Zeile. Jetzt steht es am Ende der
Wertzeile, wo es hingehört (beides sind Zahlen über den Stand), und die Namenszeile gehört dem
Namen. Das feste Raster in `.hp` (40/42) ist durch eine **Mindestbreite an der Zahl** ersetzt:
sie hält das Etikett genauso still und lässt die Gruppe zusammen.
Die Verzögerung beim Ausfahren war kein Zustandsfehler, sondern Summe: 260 ms Verweilen + 500 ms
Blende. Jetzt 90 + 220.

**(88) ⚠ Achter Backtick-Treffer — im Kommentar, der die Regel dieses Blocks erklärt, zwei Zeilen
unter der Warnung davor.** Diesmal **zwei** Backticks, das Literal schloss und öffnete wieder: aus
dem Text dazwischen wurde Code, und die Klammer dahinter machte daraus einen Aufruf —
`TypeError`, kein `SyntaxError`, aber dieselbe Wirkung: kein Rail, das HUD sieht heil aus.
*Die Regel steht seit Monaten im Kopf des Blocks; sie zu kennen reicht nicht, man muss danach
suchen.* Prüfschritt bleibt: nach jeder Änderung am CSS-Block null Backticks zählen und
`[rail-v9b] Kartenspalte steht` in der Konsole lesen.

## §16 Slice J1 · Die Journey speichert die Einheit (12.8.)

Georgs Auftrag: »ich würde gerne den gewählten Unit-Avatar behalten (Session speichern), Mob-Fights
→ POP-Progress testen und meine Journey als POC speichern sowie importieren/exportieren können.«

**Was fehlte, war eine Zeile im Schema.** Speicher, Autosave, Export und Import stehen seit V2-S4
(`journey.js`, Kanon: *die Welt wird nie gespeichert, nur Seeds und Fakten*). POP und Stats liegen
längst drin. **Die Einheit lag nicht drin** — also würfelte jeder Start neu, und mit der Einheit
waren Körpermaß, Tempo und Reichweite weg.

Schema **2.3.0 → 2.4.0**: `hero.unit`. Alte Stände bekommen `null` — das heißt ausdrücklich
»nie gewählt« und würfelt weiter wie bisher; eine Einheit zu erfinden, die der Spieler nie gewählt
hat, wäre schlimmer als zu würfeln.

**(94) Ein Spielstand, der die Wahl nicht kennt, macht die Wahl zur Dekoration.** Dreissig
unterscheidbare Einheiten (v11-U1) waren genau eine Sitzung lang unterscheidbar.

**(95) Zwei Kennungen für dieselbe Einheit — und nur eine passt ins Attribut.** Der Loader stellt
spielbaren Einheiten ein `hero_` voran (`hero_bear`), Katalog und Attribut führen sie ohne
(`bear`). Wer die Loader-Kennung speichert, schreibt beim Laden ein Attribut, das der Katalog nicht
kennt — und bekommt **still** wieder eine gewürfelte Einheit. Gespeichert wird der Katalogschlüssel.

**Abnahme 12.8. (im laufenden Spiel):** `journeyVersion 2.4.0` · Held `hero_gnoll` → im Save
`unit: "gnoll"` · geschrieben und zurückgelesen: **gleich**, 6 Zonen im Speicher · POP/POP-gesamt
im Save · Export (`download`) und Import (`pickFile`) vorhanden, erreichbar über das Tagebuch (J).

**Brücke (v12-B1), gleiche Runde:** sie war **ein** Feld lang — so breit wie der Graben — und endete
damit genau auf den zwei Tuschelinien, die auf seinen Kanten liegen; darunter kam Gras zum Vorschein,
weil der Zeichner ein Loch in den Graben schnitt. Jetzt **zwei Felder** (zwei Kopien derselben
Zelle, keine gedehnte Zeichnung), und das Loch ist weg: das Wasser läuft durch, die Planke liegt
darüber. Das ist dieselbe Regel wie im Ink-Slice — *eine schwarze Linie wird nie unterbrochen, nur
überdeckt; die Holzbrücke ist die Tür.*

---

## §17 Offen (Reihenfolge unverändert)

**Für v13 vorgemerkt (Georg 12.8.): die Sprechblasen sind komplett falsch gebaut.** Befund steht,
Ursache nicht gemessen — nicht in v12 anfassen. Betrifft `bubble-ts.js` (Blasenkörper aus dem
Tiny-Swords-Baukasten) und `chatter-2d.js` (wer wann was sagt); Slice 5 der v11-Liste
(»Sprechblasen mit Level über den Köpfen«) fällt damit mit einem Neubau zusammen, nicht mit einer
Ergänzung. **Erst messen, was falsch ist, dann bauen** — sonst wird der Neubau ein zweiter Anlauf
auf dieselbe Annahme.

(2) Ink-Outline als System · (3) Gummiband greift zu früh — **vor dem Bauen messen** ·
(4) Linienstärken (fällt mit 2 zusammen) · (5) Sprechblasen mit Level · (6) sieben Einheiten ohne
Porträt (kein Sprite-Kopf als Ersatz).

**Wartet auf Sign-off, nicht gelöscht:** die alten `scraps/`-Prüfbilder aus §4k/§4l und die tote
`.no`-Regel in `roster-sheet.js:48` (Etikett »Wurf (noch Nahkampf)« ist seit Naht 65 weg, die
Formatregel steht noch).
