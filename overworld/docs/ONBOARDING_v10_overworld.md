# Onboarding v10 — Overworld (Stand: v9, 2026-08-09)

Weitergearbeitet wird an **`KFB Overworld v9.dc.html`**. Kein Fork nötig, bis v10-S1 steht.
Reihenfolge zum Einlesen: **diese Datei** → `docs/CHANGELOG_overworld.md` (neuester Eintrag oben) →
`docs/MASTERPLAN_overworld.md` §3.2 (Kartenzone) und §3.3 (Stadt als Hub).

## Die vier Hausregeln, die in v9 Geld gekostet haben

1. **Eine Messung ohne festen Standpunkt ist keine Messung.** Die Bildrate schwankt zwischen 18 fps
   (Stadtmitte) und 52 fps (freies Feld). Fünf meiner Messungen waren wertlos, weil der Held
   dazwischen woanders stand. Erst Position setzen, dann zählen, dieselbe Position für alle Varianten.
2. **Kartengrenzen sind Weißraum, nicht Tinte.** Drei Rastermessungen scheiterten, weil sie dunkle
   Linien verfolgten und dabei Illustrationsrahmen und Textkästen für Kartenkanten nahmen. Der Test
   auf durchgehend LEERE Zeilen hat genau eine Lösung. Danach immer prüfen: ist Titel UND LORE im Bild?
3. **Nichts pro Bild rechnen, was pro Kachel gilt.** Der Naht-Fix hat das dreimal verletzt.
4a. **Zeichenzeit ohne Spülung ist keine Zeichenzeit** (9.8.). `performance.now()` um `draw()` misst
   nur das Abgeben der Canvas-Befehle — 1 ms an jedem Standpunkt, während das Bild 24 ms braucht.
   `OW_SPOT` spült mit `getImageData(0,0,1,1)`; nur diese Zahl enthält die Rasterung.
4b. **Eine einzelne Messung ist keine Messung.** Rauschen ±6 ms. Varianten im Wechsel messen
   (`OW_SPOT.vergleich`), Spannen vergleichen, »im Rauschen« als Ergebnis akzeptieren.
5. **Ein Screenshot, der einen Fehler zeigt, hat recht** — auch wenn die eigene Messung schöner ist.
   Ich habe einen korrekten Screenshot als »unzuverlässigen Kanal« abgetan und danach zwei Anläufe
   in die falsche Richtung gebaut.

## Wo v9 steht

**Terrain-Karten-Viewer (fertig, Georgs Kern-Feature).** Eine Karte liegt als **Viertelseite** im
Terrain (`OW_ART.quarter()` halbiert die PDF-Seite und nimmt die Ecke — eine Halbierung kann nicht
falsch sitzen). Feld 9×5 Felder = 1,80 gegen 1,795 der Viertelseite. Kanon-Tusche als Rand,
Kartenrückseite (`overworld/card-backside.png`) als Fallback. **Der Charakter ist der Cursor:** auf dem
Blatt weicht das HUD, die Kamera rastet auf die Blattmitte. Zonenschatten über `cardLift`
(oben links innen = tief, unten rechts außen = hoch). Seiten-Blättern ist **geparkt**
(`mode:'page'` zeichnet weiter das ganze 2×2 mit Trittsteinen — für den Mini-Dungeon).
Titelstreifen geparkt (`R.showLabel`).

**Sechs Biome** (camp · wilds · cave · frost · shore · dungeon), eins pro Zone über den Zonenindex,
11 Mob-Typen gleichzeitig. **Deckwahl:** nur Decks mit gemessenem Raster, in der Utopia-Welt
`forget_utopia` (§3.4).

**Kampf/Steuerung repariert:** Blickrichtung kommt aus dem normierten Richtungsvektor (vorher prüfte
die Hysterese `|dx|>6`, die Tastatur liefert ±1 — drei Symptome, ein Fehler). `breakFlow` greift nicht
mehr, während eine Laufrichtung gedrückt ist. Gebäude sperren ihre **gezeichnete** Fläche (vorher ein
1×2-Stummel) und prallen über `OW_FEEL.knock` ab.

**Detailstufe am Zoom** (V9-B6): unter Zoom 0,7 fallen Küstenrelief und Bodentextur weg — 40 → 56 fps.

## Was als nächstes dran ist, in dieser Reihenfolge

### v10-S1 · ERLEDIGT (9.8.) — und die Vermutung war falsch
Messgerät: `overworld/spot-probe.js` (`OW_SPOT`) + Schichtschalter `dbg` und Abschnittsuhr `dbgT`
im Runner. `OW_SPOT.stellen()` · `messen('stadt')` · `orte()` · `schichten('feld')` ·
`vergleich('feld',{a,b})` · `frei()`.

Zeichenzeit mit Spülung: Turm 18 · Blatt 19 · Marktplatz 22 · **Spawn 22** · Küste 29 ·
**freies Feld 30 ms**. Die Stadt ist NICHT die Bremse; Wegenetz, Bauten und Mobs liegen im Rauschen.
Teuer sind Boden (−12 ms), Deko (−5) und Kontaktschatten (−4). Und der Boden kostet durch **Fläche**,
nicht durch Pfade: Kurzweg ohne Clip/Schatten/Bevel −1 ms, `drawImage`-Raster statt `createPattern`
0 ms — beide wieder ausgebaut. Details und Tabellen: Changelog V10-S1.

### v10-S1a · ERLEDIGT (9.8.) — Renderskala gemessen
Regler `renderScale` (1 · 0,75 · 0,5) in `resize()`. Gemessen im Wechsel: freies Feld 19 → 16 → 15 ms,
Stadt 14 → 13 → 12. **Ein Viertel der Pixel spart ein Fünftel der Zeit** — unter der Fläche liegt ein
Sockel von ~12 ms, der nicht aus Pixeln besteht. Der Regler bleibt Notbremse, nicht Standard.
**Offene Performance-Frage für später:** woraus besteht der Sockel? Er ist ortsunabhängig.

### v10-S1e · Naht ERLEDIGT (9.8., zweiter Anlauf)
`seamless()` in `ground-paint.js`: Halbversatz mit Kreuzblende in einem 12-%-Band an den Kanten
(vier versetzte Kopien, Gewichte f(x)·f(y)). Im Backvorgang, nicht in der Zeichenkette.
**Die Spiegelkachel davor ist raus** — mathematisch nahtlos, aber eine Rorschach-Figur mit zwei
Achsen. Nahtlos heißt nicht musterfrei; das Bild entscheidet.

### v10-S1b · Die Karte ins Terrain integrieren (Konzept, Georg 9.8.)

**Befund am Screenshot:** die Karte ist ein perfektes Rechteck mit einer Fotokante auf gleichmäßigem
Grün — und die Kanon-Tusche sieht man **nicht**; was man sieht, ist der dünne Rahmen aus dem PDF.
Sie ist ein Foto auf Rasen, kein gezeichnetes Ding in einer gezeichneten Welt. Der Schatten (V9-B7)
stimmt, reicht aber nicht: das Problem ist die **saubere Kante**, nicht die Schattenstärke.

**Erster Slice — drei billige Mittel zusammen, weil sie sich gegenseitig tragen:**
- **I · Die Tusche muss man sehen.** Kräftige Kanon-Feder außen um die Karte, mit Schwellung und
  Auslauf. Sie ist der Grund, warum Terrain und Karte aus einem Guss wirken können (§31.1: eine
  Outline für alles). Solange der PDF-Rahmen gewinnt, gewinnt das Foto.
- **F · Die Kante gehört dem Terrain, nicht der Karte.** Grasbüschel, Erdlippe, drei Halme **über**
  der Tuschelinie. Aktuell endet das Grün sauber am Rechteck; was über der Karte liegt, legt sie
  darunter. Verdeckung ist der stärkste Tiefenhinweis, den es gibt — stärker als jeder Schatten.
- **C · Das Anker-Sprite überlappt.** Turm, Stein, Baum oder Pilz so setzen, dass der Fuß **auf** der
  Karte steht. Ein Frame, und die Karte ist ein Ort. Billigste starke Wirkung im ganzen Paket.

**Zweiter Slice — B · Gutter mit Zugängen (das ist Grundriss, keine Kosmetik, §3.2):**
Immer ein Gutter um die Card-Zone — Wassergraben · Mauer · Zaun · Erdwall, je Biome — dazu **1–4**
Brücken, Planken oder Stege aus dem Tiny-Swords-Bestand. Löst drei Dinge auf einmal: Raum,
Spielregel (wo geht man rein) und Dramaturgie (der Owner bewacht den Zugang). Hängt direkt an
v10-S2, weil der Wächter am Steg steht.

**Dritter — D (im Kampf, siehe v10-S2):** der Sand überdeckt die Kante, der Übergang wird ein Verlauf
statt eines Schnitts. Löst die Integration mit, ohne ein zweites System.

**Danach — E:** Schatten härter und dunkler, plus **ausgefranster Grubenrand mit Erdlippe**. Eine echte
Grube hat keine gerade Kante.

**Verworfen — A (farbiger Pixelsaum außen um die Outline):** liest sich als Effekt, nicht als Raum,
und wäre ein zweites Partikelsystem für dieselbe Aufgabe wie D. Geht in D auf.

**Experiment — G (die Karte liegt 2–4° schief, wie hingelegt):** erst versuchen, wenn I+F+C nicht
reichen. **Nur im Bild drehen, nie in der Physik** (§17) — Kollision und Quadranten bleiben
rechtwinklig, sonst zahlt man die Drehung in der Trefferabfrage.

**Behalten — H:** der Papierstreifen links (»NOTHING TO SEE HERE« samt Kreaturen) verrät, dass da ein
ausgeschnittenes Stück Heft liegt. Kein Fehler, sondern die Pointe des Formats.

### v10-S2 · Card-Zone als Kampf (Georgs Dramaturgie, dreimal gebrieft — nicht neu erfragen)
1. **Ein Card-Owner:** das Schwein am Bauernhof, rechteckiges Zonenfeld.
2. **Trigger:** `E` **oder** das Überschreiten der Ink-Outline zieht **100 % Aggro**.
3. **Sand als Verschluss:** Partikel bedecken die Karte vor dem Kampf fast vollständig und werden
   durch den Kampf mit plausibler Kinetik zerstäubt — die Karte wird durch Kämpfen sichtbar.
   Partikel tragen **Textur und Palette des Zonenbodens, leicht abgedunkelt** (nicht generischer Sand).
   Dynamik nach `three.js/examples/webgpu_compute_particles.html` (siehe `github.md`):
   `gravity −0,00098` · `bounce 0,8` · `friction 0,99` · Boden-Friction 0,9 je Achse ·
   Stoß = `normalize(pos − treffer) · (radius − dist) · 0,01`, je Partikel gestreut `hash·1,5 + 0,5`.
   **WebGPU/TSL läuft hier nicht** — die Zahlen sind der Vertrag, die Umsetzung ist 2D-Canvas.
4. **Win:** juicy Animation nach dem Besiegen des Owners.
5. **Lose:** BLÖDSINN!-Animation wenn der Held down und gefreezt ist, Knopf »Stay fluffy« →
   Revive am Friedhof.
6. **Später:** Mob-Wellen als Aufskalierung; ein Gebäude/Anker (Turm, Truhe, Stein, Busch) mit der
   Kartenrückseite irregulär schräg darunter.

### v10-S3 · Lean Waber-Shader (Georgs Wunsch, mit Vorgabe)
Ziel: ein **dezenter** globaler Puls/Morph für alle Festland-Böden, ein **fließender** für Wasser.
**Die Falle ist bekannt und benannt:** `skyshade-2d.js` kostete 90 ms, weil es
`globalCompositeOperation` über bildschirmgroße Flächen **je Bild** benutzte. Also:
- **Keine Composite-Operation über bildschirmgroße Flächen je Bild.** Nie.
- Der Waber gehört in die **Kachel**, nicht auf den Bildschirm: beim Backen mehrere Phasen erzeugen
  und je Bild zwischen ihnen wechseln, oder den Pattern-Ursprung mit einem Sinus verschieben
  (`ctx.translate` vor `fillRect`) — das kostet nichts.
- Wasser darf teurer sein als Land: die Wasserfläche ist kleiner und hat keine Sprites darüber.
- Erst mit festem Standpunkt messen, dann behalten.

### Offen, nicht geraten
- »nach dem kampf werde ich erratisch auf eine andere karte bewegt« — nicht reproduziert. Verdacht:
  ein `attackTarget`/`path`, das den Tod des Ziels überlebt, oder der Respawn. Georg nach dem
  Reproschritt fragen (welche Zone, gewonnen oder verloren).
- ~~Nahtstellen der Texturen~~ — erledigt (v10-S1d, Spiegelkachel in `seamless()`).
- **Weniger Pixel:** Renderskala/dpr ist der einzige unausprobierte große Hebel (siehe v10-S1).
- `ignore_dystopia` und `embrace_protopia` stehen in `card-grids.json` noch auf der 26.7.-Messung,
  die bei `forget_utopia` dreimal falsch war. Mit dem Weißraum-Verfahren nachmessen.

## Sprache und Kanon
Spiel-Sprache **EN**, Eigennamen deutsch (Puste · Witz · Schneid · **BLÖDSINN!**). Uncle FrizzleBob ·
King Kayfabian · Kayfabulation · Grußformel **Stay fluffy.** **Karten sind keine Powers, sie sind
Beweisstücke** — keine Zahlenwerte im UI. Antworten auf Deutsch, Code-Kommentare auf Deutsch.


---

## Backlog aus dem Chat vom 9.8. (Georgs Aufträge, nicht meine Ideen)

### BLÖDSINN! braucht eine Regie (Tod des Helden)
Nicht »Game Over«, sondern **BLÖDSINN!** — und man muß SEHEN, was passiert ist. Vereinbarte Folge:
kurzes Blinken (der Treffer, der zu viel war) → dann fliegt der Held **wild und zackig über die
Karte** zum Graveyard. Keine Blende, kein Schnitt: die Strecke ist die Erzählung. Der Graveyard ist
damit ein Ort auf der Insel, kein Menü.

### Fight-Module aus WS0: **nicht eingebaut, weil nicht geliefert**
`docs/BRIEFING_fight-sprint_WS0.md` specct `overworld/fx-2d.js` (`OW_FX`, ein Ringpuffer über 2000
Teilchen, zwei Rezeptbücher). **Die Datei existiert in diesem Projekt nicht** — der Ordner
`overworld/` hat 45 Module, keines davon heißt `fx-2d.js`. Was an Kampfgefühl läuft, ist älter:
Hitstop + Rückstoß (`game-feel.js`), Squash (`cartoon-motion-2d.js`), Schadenszahlen als
`floaters` im Runner, Ansager (`audio-2d.js`). **Zahlen erscheinen nur beim Treffer** — wer nicht
schlägt, sieht keine.

### Card Zones sind noch keine Karten (offener Widerspruch, Georg 9.8.)
Heute gilt: **eine** Karte liegt als PDF im Terrain (`reader`, 9×5 Felder, Kanon-Tusche, seit S1b mit
bewachsener Kante) — die **sechs Kampfzonen** dagegen sind Rechtecke mit anderer Bodentextur und dem
**Titel** ihrer Karte, ohne Bild. Daher der Eindruck »die Zone zeigt einfach eine andere Textur«.
Georgs Vorgabe für die Auflösung: die Kampfzone soll **die Karte zeigen** (bis die Sand-/Partikel-
Abdeckung da ist), im **Kartenformat** statt quadratisch, und das **Biom ist das umgebende Terrain**,
nicht das Rechteck. Das ist der Inhalt von v10-S2.


### Backlog · Küstenlinie (Georg 9.8., ausdrücklich »später«)
> »die küsten/wellenlinien (weiß) der tiny sword tiles waren das coolste terrain-feature«

Bedingung von ihm mitgeliefert: **nicht wieder so lieblos gehackt wie die Floor-Regresse.** Der Schaum
ist heute aus (V6, »lieblos über die Landschaft geworfen«) und liegt als `foamTiles` bereit
(1405 Felder). Der Weg dorthin ist derselbe wie beim Graben: **die Küste ist ein Strich, keine
Kachelfläche** — die Kontur aus `masks()` existiert schon (6150 Punkte), sie braucht drei bis vier
versetzte Federstriche mit abnehmender Deckkraft, in der Kachel gebacken statt je Bild gezeichnet.

### Signatur-Shader je Terrain-Typ (Georgs Frage vom 9.8., noch nicht gebaut)
Sechs Terrain-Typen, je **ein** dezent bewegtes Eigenmuster, das unter Farbtönung funktioniert.
Nicht-Wiederholung kommt **nicht** aus mehr Pixeln, sondern aus Überlagerung: zwei bis drei gebackene
Schichten, je mit eigener Drift-Richtung, eigenem Tempo und einem aus der Feldposition gesäten
Phasenversatz. Zwei gegenläufig rotierende Spiralen ergeben ein Schwebungsmuster, dessen Periode
praktisch nie erreicht wird — Georgs »fraktales Spiral/Oval mit dezentem Morphing«, und es kostet
zwei `drawImage` je Schicht. Der Waber gehört in die Kachel (die 90-ms-Falle: kein Composite über
bildschirmgroße Flächen). Offene Spannung: ein Fluß, dem man mit den Augen folgen will, konkurriert
im Kampf mit dem Skelett, das auf einen zuläuft — deshalb voller Fluß im Ruhezustand, gedämpft bei
Aggro. Das ist derselbe Regler wie Georgs Shader-Drossel, nur mit einem Grund statt einer Ausrede.


### Unit-Lesbarkeit im Kampf (Georg 9.8., Spec für v10-S2c)
Mini-Fluff-Bars über den Einheiten, **farbcodiert nach Haltung** (aggro · neutral · ally) und
**nur wenn sie etwas sagen**: voll und unbeteiligt heißt keine Leiste. Dazu die Stufe als Zahl
(`Lv 5`) am Gegner — sie **weicht der Leiste**, sobald gekämpft oder verwundet wird. Georgs Formel:
»wird zu Fluff Bar im Kampf bzw. wenn die Unit verwundet ist«.

Zwei Dinge, die dabei nicht verhandelbar sind:
- **Zahlen sind keine Beweisstücke.** Der Kanon verbietet Trefferpunkte im Bild; `Lv 5` ist eine
  Einschätzung, kein Punktestand, und die Leiste ist ein Zustand, keine Zahl. Es darf also **keine**
  Ziffer neben der Leiste stehen.
- **Eine Leiste je Einheit, ein Ort.** Die Schadenszahlen (`floaters`) und die Sprechblasen weichen
  einander schon aus (`OW_AI.drawBubbles`); die Leiste muss in dieselbe Ablage, sonst stapeln sich
  drei Dinge über demselben Kopf.

### Waber-Shader: Herkunft persistiert
`docs/SSOT_Waber_Shader.md` — Pfad (`terrain-v12/skydome-shader.js`), beide Verfahren (`S` Nebel,
`A` Waber mit drei Faltungen), alle Frequenzen, die `MODE_FEEL`-Tabelle je Story-Mode, und was
`OW_SHADE` davon heute schon kann (alles außer der Faltung).
