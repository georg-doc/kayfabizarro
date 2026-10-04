# CHANGELOG — KFB Travel v16
Additiv nach oben. Jede Änderung mit Zahl. Fork-Basis: `KFB Travel v15.dc.html` (Flug-Sprint F0/F1).

---

## v16-L3 · Kenney-Props statt grauer Blöcke — 2026-08-12

Neu: `terrain-v16/prop-scatter.js` (**ps-v1.1**). Geändert: `voxel-terrain.js` (Streu-Orte,
geteilte GLSL-Blöcke, geteilte Uniforms), `travel-poc.js` (Verdrahtung), `settings-schema.js`
(Abschnitt *Props (v16)*, 16 Regler + 3 Auskünfte).

**Was schon da war und deshalb nicht neu gebaut wurde.** `asset-repo.json` in der Projektwurzel:
ein aufgelöster Index mit **986 Assets** und fertiger `ghUrl` pro Eintrag, den der
`KFB Cartoon-Verbieger` bereits liest. Und `kfb-cartoon-deform.js`, die seit §1 ungenutzt lag und
die Lücke selbst notiert hatte: *„Für echtes Instanced-Scatter gehören die Werte statt in Uniforms
in Instanced-Attribute — dieselbe Mathematik, anderer Träger."* Genau das ist gebaut; die Datei
selbst bleibt unangetastet.

**Vor der ersten Zeile gemessen, nicht geraten:** der Pfad ist eine Falle. `kenney_nature-kit`
liegt im Repo unter `Models/GLTF format/` — und dieser Ordner enthält **`.glb`**-Dateien:

| URL | Antwort |
|---|---|
| `.../Models/GLTF format/tree_default.glb` | **200**, 9 428 Bytes |
| `.../Models/GLB format/tree_default.glb` | 404 |
| `.../Models/GLTF format/tree_default.gltf` | 404 |

Dann acht Modelle geladen und ausgemessen: 1–2 Meshes, 2 Materialien, 232–784 Vertices, **keine
Texturen** — und der entscheidende Befund: **19–31 verschiedene Y-Ebenen** bei den Bäumen. Der
Verbieger braucht mindestens vier, um zu BIEGEN statt zu scheren (`segmentsAlongY`, §5). Ohne diese
Messung wäre er auf Verdacht angeschlossen worden.

**Die vier Entscheidungen.** (1) **EIN InstancedMesh pro Modell-Teil, GLOBAL** — die grauen Blöcke
waren ein Streu-Mesh je Chunk, also 81 Draw-Calls; jetzt sind es **17**, unabhängig von der
Chunk-Zahl. Der Umbau macht das Bild reicher UND die Liste kürzer. (2) **Die Standorte gehören dem
Terrain** (`propSites`), nicht dem Prop-Modul: wer den Boden zweimal rechnet, hat zwei Höhen.
(3) **Biom-Logik über den Dateinamen** — der Index hat von jedem Baum `_dark` und `_fall`, also ist
„Herbstwald" ein Suffix und kein System. (4) **Die grauen Blöcke bleiben als Fallback**: ein 404
macht die Landschaft nicht leer, nur ärmer.

**L3b · Die Props machen die Bodenbewegung mit** (Georgs Befund: *„sonst versinken sie im Voxel"*).
Die Reparatur war **nicht**, die Rechnung im Prop-Shader nachzubauen — zwei Kopien derselben
Bewegung laufen auseinander, sobald eine angefasst wird. Die Bob-Rechnung steht jetzt als
**exportierter GLSL-Block** (`MOTION_GLSL`), den Terrain und Props einbinden, und die Uniforms
werden als **dieselben Objekte** geteilt (`terrain.motionUniforms`). Es gibt deshalb keine Zeile,
die etwas nachzieht. Die Phase kommt vom **Würfel** (`aKc3.xy/z`), nicht vom Prop: der Standort ist
gegen die Zellmitte versetzt, und mit der eigenen Position liefe das Prop minimal anders als der
Würfel unter ihm — genau das Versinken an den Umkehrpunkten.

**L3c · Runde Kanten und Bodenfarbe.** Runde Kanten sind zwei Regler, keine Geometrie: die Normale
wird zwischen hart (Facette) und weich (über gemeinsame Ecken gemittelt, `aSN`) gemischt — das
rundet die *Beleuchtung*, und weil Kenney-Modelle flach schattiert sind, macht das den größten Teil
des Eindrucks — und ein Aufblasen entlang der weichen Normale rundet die *Silhouette*. Eine echte
Fase wäre Geometrie, die 1400-fach zu bezahlen wäre.
Die Tönung war zuerst ein globaler Farbton aus der Palette; jetzt nimmt **jedes Prop die Farbe des
Würfels, auf dem es steht** (`kfbGroundColor`, geteilte Paletten-Uniforms samt radialer Front).
Damit färbt nicht „die Welt" ein, sondern der Boden — und ein Wald färbt **mit** der Ringwelle um,
ohne dass jemand ihn benachrichtigt.

**L3d · Squash & Stretch am Bob des Würfels.** Georgs Frage, ob ein Cartoon-Bounce aufwendig sei:
er war es nicht — er hat eine **falsche Bewegung ersetzt**. Der Squash lief an einer *eigenen* Uhr
(`sin(phase + time)`), also als zweite Bewegung neben der des Bodens. Jetzt kommt die Stauchung aus
demselben `kfbBob`: Würfel unten → Prop gestaucht und breit, Würfel oben → gestreckt und schmal,
volumenerhaltend über `1/sqrt`. Dazu ein **Nachlauf** (`squashLag` 0,09 s, gestreut ±0,06 s): die
Masse eines Baums reagiert später als der Boden unter ihm, und ein Wald atmet nicht wie ein Uhrwerk.
`update()` ist dadurch **leer geworden** — es gibt keinen eigenen Takt mehr.

**Gemessen (im laufenden Spiel):**

| | Wert |
|---|---|
| Modelle geladen | **9 von 9** in **307–453 ms** (RAW, nichts im Projekt) |
| Draw-Calls | **17** — vorher 81 (ein Streu-Mesh je Chunk) |
| Vertices über alle Modelle | **4 030** |
| Props gesetzt / Standorte | **1 376–1 427** von ebenso vielen · 0 über Budget (2 400) |
| Aufbau je Chunk-Wechsel | **20–24 ms** (vorher 26–30, siehe Naht 119) |
| Höhen-Ringe je Modell | 5–23 · Bäume und Büsche **biegen**, Fels und Pilze **neigen** |
| Attribute je Instanz | `aKc1` Bogen/Neigung · `aKc2` Verjüngung/Verdrehung/Nachlauf/Rampe · `aKc3` Würfelmitte/Bewegungs-Seed/1÷Maßstab |
| Fehlerzeilen | keine · `__bootErrors` 2 (die bekannten) |

---

## Die Nähte 119–122

**(122) ⚠ Die Bühne existierte zweimal — und war eine Runde nach dem Anlegen der Kopie schon
uneinig.** Für `index.html` (GitHub Pages) habe ich die Shell-Regeln und die Meta-Zeile aus dem DC
**kopiert** statt geteilt. Gemessen vom Verifier: die Unterzeile nannte im DC noch `… · L2d
Ringwellen`, in `index.html` schon `… · L3 Props` — L3 war dazugekommen und nur an einer der beiden
Stellen nachgezogen. Niemand sieht der Betriebsfassung an, dass sie eine andere Zeile trägt als das
Design-DC.

Die Reparatur ist nicht Synchronisation, sondern **Abschaffung der zweiten Fassung**: die Regeln
liegen in `themes/kfb-shell.css`, die beide Dateien per `<link>` einbinden, und der **Text** kommt
aus `SHELL_META` im Runner — er ist die einzige Stelle, die weiß, welche Slices wirklich laufen. Die
Markup-Elemente sind leer.

Das ist Naht 121 in der Umkehrung: dort war die richtige Antwort, Uniform-**Objekte** zu teilen statt
sie zu kopieren; hier war der Fehler, Markup zu kopieren statt es zu teilen. *Eine Kopie ist keine
Abkürzung, sondern eine Verabredung, dass jemand sie künftig pflegt — und niemand hat zugesagt.*
Verschärfend: es war **Inhalt**, nicht Code. Inhalt driftet schneller, weil er sich bei jedem Slice
ändert, und er fällt nicht auf, weil nichts kaputtgeht.


`getAttribute('aKc1')` je Standort je Teil sind bei 1 400 Standorten × 2 Teilen × 3 Attributen
**~8 400 Namenssuchen** — gemessen 26–30 ms je Aufbau, und der Aufbau läuft bei Reisetempo etwa
einmal pro Sekunde. Einmal vorher geholt: 20–24 ms. *Eine Namenssuche ist billig; 8 400 sind ein
Ruckler.*

**(120) Die zweite Uhr ist der Fehler, nicht die fehlende Bewegung.** Zweimal in diesem Slice
dasselbe Muster: der Auftrieb sollte „nachgebaut" werden (wäre eine zweite Bewegungs-Wahrheit
geworden) und der Squash lief an einer eigenen Uhr (war eine). Beide Male war die Lösung, den
**vorhandenen** Takt zu teilen — beim Auftrieb über einen exportierten GLSL-Block, beim Squash über
dieselbe Bob-Funktion. *Wenn etwas „mitmachen" soll, gib ihm nicht seinen eigenen Takt, sondern den
gleichen.*

**(121) Geteilte Uniforms brauchen keine Synchronisation — und genau deshalb sind sie richtig.**
`terrain.motionUniforms` gibt die **Objekte** heraus, nicht Kopien. Ein Schreibvorgang auf
`uEnergy` erreicht damit Terrain und Props zugleich, und es gibt keine Zeile, die etwas nachzieht.
*Jede Synchronisation ist eine Stelle, an der zwei Wahrheiten entstehen können; die beste
Synchronisation ist die, die es nicht gibt.*

---

## v16-L2d · Ringwellen (Variante A) — 2026-08-12

Georgs Bild: „Farbkreis-Flächen laufen über die Voxel, breiten sich aus und faden zur Terrainfarbe
zurück." Gebaut ist **Variante A: die Welle zieht durch, kein Gedächtnis** — danach ist alles wie
vorher. Variante B (die Welle *färbt ein*) steht als Option im Backlog, siehe
`SPRINT_travel-v16.md` §Backlog.

`voxel-terrain.js`: acht Wellen als Uniform-Array (`uRip`, `uRipC` + Tempo/Breite/Deckkraft),
Ring im Fragment-Shader, `spawnRipple(x, z, farbe, {life, alpha})`, `setRippleParams`,
`rippleReport`. `color-worlds.js`: `contrastStop()`. `travel-poc.js`: `rippleColor()` und drei
Auslöser. `settings-schema.js`: Abschnitt *Ringwellen (v16)* mit 6 Reglern, Probeknopf,
Auslöser-Tabelle und zwei Messzeilen.

**Kein Draw-Call, kein Attribut, kein Rebake.** `vWXZ` (aus `aPack2.xy`) liegt seit v3 im
Fragment-Shader — jede Säule kennt ihre Weltposition und prüft ihren Abstand selbst. Eine flache
Scheibe wäre die falsche Bauweise: sie z-fightet mit den Würfeloberseiten und schwebt über Stufen,
und **L1 hat das Gelände gerade stufiger gemacht** (Klippen 6 u). Die Welle im Shader liegt exakt
auf dem Gelände, weil sie die Oberfläche selbst ist.

**Die Auslöser sind Ereignisse, nie der Beat.** Aufsetzen (Größe aus der Wucht — ein Schritt von
einer Kiste ist nicht ein Sturz von einer Klippe), Karte durchflogen (vom Ort der KARTE, läuft dem
Spieler hinterher), Farbwelt-Wechsel (die Welle sagt »jetzt«, die Front trägt die Farbe), Atemzug
(dieselbe Welle, schwächer). Eine Welle im Takt wäre Deko statt Ursache — und die Konfetti-Falle
aus §4v/82 in dritter Auflage.

**Gemessen:**

| | Wert |
|---|---|
| Plätze | 8 · neunte Welle verdrängt die **älteste** (am weitesten draußen, am schwächsten) |
| Radius nach 2 s bei Tempo 46 u/s | **92 u** (46 × 2 ✓) |
| Lebensdauer 4 s → nach 7 s | **0 Wellen live**, Plätze frei |
| Ring-Scheitel neue Formel | **1,00** |
| Ring-Scheitel alte Formel | **0,50** → Atemzug kam auf **21 %** Beimischung (unsichtbar) |
| Beimischung Atemzug jetzt | **55 %** |
| Fläche gegen Wellenfarbe | `#f54d8c` (Lum 0,526) gegen `#66ff85` (Lum 0,766), ΔLum **+0,24** |
| Fehlerzeilen | keine · `__bootErrors` 2 (die bekannten) |

Belege: `scraps/01…04-wellen-v16.jpg` (grüner Ring läuft über rosa Gelände nach außen).

---

## Die Nähte 111–118

**(118) ⚠ Eine Beschreibung im UI hat den dritten Anlauf nicht mitbekommen.** Die Panel-Zeile
*Wellenfarbe jetzt* endete mit „Helligkeit auf die Gegenseite" — das war Anlauf **zwei**, der laut
Naht 114 als *Schatten* las und deshalb ersetzt wurde. Der Code tat längst das Richtige
(`ll = clamp(l + 0.10, 0.40, 0.70)`), sein eigener Docstring sagte es auch, nur die Zeile, die
Georg im Panel LIEST, behauptete weiter die verworfene Variante. Gefunden hat es wieder der
Verifier — durch Nachrechnen an der laufenden Fläche (`#e06c19`, L 0,488 → Welle L 0,588:
heller, nicht Gegenseite).

Das ist **Naht 99/115 ein drittes Mal**, nur eine Ebene höher: nicht eine Abnahme, die ein Umbau
entwertet, sondern eine **Erklärung**, die ihn nicht mitbekommt. Und es ist die gefährlichere Sorte,
weil eine falsche Zahl beim Nachmessen auffällt, eine falsche Begründung aber genau dann geglaubt
wird, wenn man sie am nötigsten braucht — beim nächsten Regeln.
*Wer eine Mechanik dreimal umbaut, muss dreimal auch ihre Beschreibung anfassen; die Beschreibung
steht in der Datei, die niemand beim Debuggen öffnet.*

**(115) ⚠⚠ Ein späterer Slice hat die Abnahme eines früheren still ungültig gemacht — und ich habe
es nicht gemerkt, sondern der Verifier.** L1 wurde auf einem festen Weltseed gemessen, L2a hat den
Seed gewürfelt, `reliefAt` hasht ihn. Die Zahlen in Changelog UND Housekeeping beschrieben danach
eine Welt, die es standardmäßig nicht mehr gab; eine davon (`Wandanteil 1,9 % mit und ohne`) war
sogar als „der interessanteste Meßwert" hervorgehoben — und war widerlegt. Das ist **dieselbe Klasse
wie Naht 99**, die ich eine Runde vorher selbst aufgeschrieben hatte: ein Umbau macht anderswo etwas
unmöglich oder falsch, das weiter aussieht wie vorhanden. *Wer einen gemeinsamen Eingang würfelt,
muss jede Abnahme nachmessen, die von ihm abhing — und die Liste dieser Abnahmen steht nirgends,
außer man führt sie.* Konsequenz für diesen Workspace: **eine Abnahmezahl gehört mit der Angabe
versehen, auf welchem Seed und über welche Fläche sie gilt.** Beides fehlte.

**(116) Eine Spreizung verschiebt eine Verteilung, ohne sie zu kennen.** `reliefKontrast` war das
falsche Werkzeug für ein Verteilungsproblem: auf dem Tuning-Seed traf es 6 % Klippe, auf fünf
anderen Welten 17–40 %. Richtig ist, die Verteilung **einmal je Welt zu messen** und die Schwellen
als **Flächenanteile** zu führen (Perzentilrang, 65 Quantile, 27 ms je Weltwürfel). Danach heißt
45 % auch 45 % — auf jeder Welt, und der Regler bedeutet endlich etwas, worauf Georg zielen kann.
*Ein Regler, dessen Wirkung vom Seed abhängt, ist kein Regler, sondern ein Gerücht.*

**(117) Ein Gesamtanteil kann eine Trennung nicht abnehmen — er mittelt sie weg.** „Steigungen und
Senken NEBEN hohen Klippen" heißt nicht „weniger Wände" (eine Klippe IST eine Wand). Der Wandanteil
gesamt bewegte sich kaum und sagte damit nichts; getrennt gezählt zeigt er die Sache: **8,1–12,5 %
in Klippengebieten gegen 0,9–2,8 % sonst**, eine 4- bis 9-fache Konzentration. *Wenn das Ziel eine
Trennung ist, muss die Meßzahl getrennt zählen.*

**(111) ⚠ Ein Backtick in einem GLSL-Kommentar beendet das Template-Literal — und der Fehler
erscheint bei einem Nachbarn.** Der Shader steht in `/* glsl */`…``; ein Backtick darin macht aus
GLSL wieder JavaScript, und der Browser meldet »SyntaxError: unexpected token: identifier« in einer
Zeile **weit unter** der Ursache. **Zweimal passiert am selben Tag** — beim zweiten Mal in der
Erklärung, warum der erste Anlauf falsch war. Die Warnung steht deshalb jetzt oben im Shader-Block
und nicht in einem Dokument daneben.

**(112) Ein Ring aus zwei smoothstep-Kanten erreicht im Scheitel nur die Hälfte.**
`front − back·0.72` sah richtig aus und war nachgerechnet **0,50** statt 1,0: bei `d == r` liegt
der Abstand genau auf der Mitte des ersten smoothstep. Mit der Deckkraft eines Atemzugs (0,42)
blieben **21 % Beimischung** — im Bild nichts. Richtig ist ein **Band über den Abstand zum
Radius**: `1 − smoothstep(0, w, |d − r|)`, Scheitel sauber 1,0, und mit `w = uRipWidth·(0,4 + t)`
wird es mit dem Alter breiter, ohne eine zweite Kante zu brauchen.
*Wer eine Kurve aus zwei Kanten baut, muss ihren Scheitel ausrechnen — nicht ansehen.*

**(113) ⚠ Eine Welle in der Farbe der Palette ist per Konstruktion unsichtbar.** Erster Anlauf
nahm `pal.stops[2]`, die helle Spitze der aktiven Farbwelt — sie mischt eine Farbe über eine
Fläche, die schon fast diese Farbe hat. Der Code war richtig, das Bild leer, und im Code ist der
Fehler nicht zu sehen. Eine Welle braucht **Kontrast zur Palette, nicht Mitgliedschaft in ihr**:
`contrastStop` dreht den Farbton um 155° (nicht 180° — die exakte Komplementärfarbe wirkt fremd
und nicht mehr wie dieselbe Welt) und hebt die Sättigung.

**(114) Der Kontrast muss aus FARBE kommen, nicht aus Dunkelheit — und die Stelle in der Kette
entscheidet darüber.** Zweiter Anlauf setzte die Helligkeit auf die Gegenseite der Fläche: über
rosa Gelände lief ein **graues Band** durchs Bild, sichtbar, aber als *Schatten* — das Gegenteil
von »die Welt ist farbenfroh und lebt«. Dritter Anlauf hielt die Helligkeit nahe der Fläche
(+0,10) und drehte nur Farbton und Sättigung — und war **olivgrau**, weil der Ring damals VOR dem
Streu-Kanal des Terrains lag (`uSatBase 0,72 + nRand2 · uSatRange 0,34`), der jede Farbe um 11 bis
28 % entsättigt. Die Streuung ist eine Eigenschaft des **Geländes**, nicht einer Welle darüber:
erst das Gelände fertig färben, dann die Welle. Weiterhin vor Kantentextur und Licht — eine Welle
ist eine Färbung der Fläche, keine Lampe.
*Bei einer Farbe ist nicht nur die Farbe die Entscheidung, sondern auch, an welcher Stelle der
Kette sie einsteigt.*

---

## v16-L2a/L2b · Farbwelten als Ort — 2026-08-12

Neu: `terrain-v16/color-worlds.js` (**cw-v1.0**). Geändert: `travel-poc.js` (Weltwürfel,
`applyPalette` bekommt einen dritten Anlaß, Frage im `stepFade`), `settings-schema.js`
(Abschnitt *Farbwelten (v16)*, 13 Regler + 3 Auskünfte).

**Kein Shader angefaßt — null Zeilen GLSL.** `voxel-terrain.js` hält seit v3 zwei Paletten
gleichzeitig (`uPA0..2` / `uPB0..2`) und blendet sie über eine radiale Front
(`sel = smoothstep(uFront−0.07, uFront+0.07, dist/uMaxDist)`), gefahren von
`setPalette(stops, {spread, cx, cz, maxDist, dur})`. Bis v15 lief das für genau eine Sache: den
Palettenwechsel im Panel. L2 liefert die **zwei fehlenden Entscheidungen** — wann eine Front läuft
und welche Palette sie bringt.

**L2a · Der Weltwürfel.** `travel-stage.js` hatte `WORLD_SEED = 'kfb-travel-v4-slice3'` und
`STORY = 'heroic'` als **Konstanten** — jede Sitzung dieselbe Welt. Jetzt zieht ein Wurf drei Dinge
unabhängig (Story-Modus · Weltseed · Reihenfolge der Farbwelten), alle aus **einer Zahl**, und die
Zahl steht im Panel. Das ist kein Zufall, sondern eine Adresse: dieselbe Zahl gibt dieselbe Welt.
Der Seed liegt in `localStorage` (`kfb-travel-v16-seed`), Knopf *Weltwürfel* zieht neu.

**L2b · Die Farbwelt ist ein ORT.** `regionAt(x,z)` ist eine reine Funktion des Ortes — dasselbe
Prinzip wie `stepAt` in L1 und wie die Ortsschicht in Overworld: Orte werden **gerechnet, nicht
vergeben**. Kachel 1800 u (43 s bei Reisetempo), Reihenversatz statt Rauschen (Mauerwerk, kein
Schachbrett). Beim Überfliegen einer Grenze läuft eine Front von der Spielerposition über Terrain,
**Himmel und Nebel** (die Regel vom 26.7. gilt weiter: eine Farbwelt, die am Horizont aufhört, ist
zwei Welten).

**L2c · Der Atem, als dieselbe Bewegung.** Kein zweites Animationssystem: alle `atemGap` Sekunden
läuft eine **kleinere** Front mit derselben Palette, um `atemHue` im Farbton gedreht, und nach drei
Zügen kehrt die Richtung. Wabern und Puls kommen aus Kanälen, die es schon gibt (Cube-Tanz,
`uGlowB`/`uGlowE` am Beat).

**Der Lesbarkeits-Riegel.** Die Karten sind cremefarbenes Papier mit Tusche. `guardStops` deckelt
die Helligkeit der hellen Spitze (Vorgabe 80 %) und hält den dunklen Stop unter 34 % — gedeckelt
wird die **Helligkeit**, nicht die Sättigung, weil eine entsättigte Welt grau ist und grau kein
Ersatz für dunkel.

**Gemessen (im laufenden Spiel):**

| | Wert |
|---|---|
| mittlere Weite einer Farbwelt (12 km Ost-Linie, 8 Wechsel) | **1500 u** bei Kachel 1800 |
| gleicher Ort → gleiches Ergebnis | **ja** (zweimal gerufen, identisch) |
| (0,0) · (200,−200) · (−300,300) | **dieselbe Kachel** — der Ursprung ist eine Mitte, keine Ecke |
| Ereignisse in den ersten Sekunden | **1** (`start`, ohne Front) — vorher 2, siehe Naht 107 |
| Sprung um 3000 u | genau **1** `region`-Ereignis |
| Atem | 0° → **12,6°** → **25,2°** → 12,6° → 0° — kehrt um, driftet nicht weg |
| drei Seeds, drei Welten | `11` mystical/Säuregrün · `42` forbidden/Glut · `777` heroic/Bubblegum |
| Fehlerzeilen | keine · `__bootErrors` 2 (die bekannten) |

Belege: `scraps/01-farbwelten-v16.jpg` … `03`.

---

## Die Nähte 106–110

**(106) Der Renderer konnte es die ganze Zeit — die fehlende Hälfte war eine Entscheidung.**
Zwei Paletten, eine radiale Front, Dauer und Mitte: alles seit v3 im Shader, benutzt für einen
einzigen Anlaß. L2 hat **null Zeilen GLSL** gebraucht. *Wer ein Feature baut, ohne zu prüfen, was
sein Renderer schon kann, baut ein zweites davon — und hat danach zwei.*

**(107) ⚠ Der Ursprung lag auf einer Kachelecke.** Mit `floor(z/cellSize)` startet der Spieler bei
(0,0) genau auf einer Kante; gemessen **2 Wechsel in den ersten Sekunden**, also eine Front, die
niemand ausgelöst hat — dieselbe Klasse wie §4v/85 (»ein Moduswechsel, den der Spieler nicht
ausgelöst hat, liest sich als Defekt«). Ein halbes Kachelmaß Versatz macht aus der Ecke einen Ort.
*Ein Raster, dessen Nullpunkt auf einer Grenze liegt, feuert beim ersten Schritt.*

**(108) Eine Auswahl, die sich von selbst zurücknimmt, sind zwei Wahrheiten über eine Farbe.**
Wer im Panel eine Palette wählt, hätte sie beim nächsten Grenzübertritt wieder verloren. Jetzt
schalten die Farbwelten sich ab und **melden das** — die Hand gewinnt, aber sie sagt es.

**(109) ⚠ Biom ist Farbe und Props, NIE Höhe.** `terrain.setWorldContext()` ruft `rebakeAll()`,
und `biomeShape`/`heightScale` verbiegen das Höhenfeld: eine Biomgrenze im Flug hätte die
Landschaft **unter dem Spieler neu wachsen** lassen. Regionen fassen deshalb nur Uniforms an, nie
den WorldContext. Dieselbe Disziplin wie die Wasserregel von v3 (»Farbe, niemals eine Ebene«) —
und der Grund, warum L2 keinen Rebake braucht und damit gratis ist.

**(110) Der Atem ist dieselbe Bewegung wie der Wechsel, nur kleiner.** Ein eigenes Morph-,
Waber- und Pulssystem wäre die Konfetti-Falle aus §4v Naht 82 gewesen (zwei widersprüchliche
Bewegungen liest man als Ruckeln). Ein Mechanismus auf zwei Skalen ist eine Bewegung.
*Die Welt atmet in derselben Bewegung, in der sie sich ändert.*

---

## v16-L1b · Die Stufung, nachgemessen und richtiggestellt — 2026-08-12

⚠ **Dieser Eintrag korrigiert v16-L1.** Der Verifier hat gefunden, was mir entgangen ist: **L2a hat
die Abnahme von L1 still ungültig gemacht.** L1 wurde auf dem festen Weltseed
`kfb-travel-v4-slice3` gemessen; L2a hat ihn durch einen gewürfelten ersetzt
(`worldSeed = 'kfb-v16-' + sessionSeed`), und `reliefAt` hasht genau diesen Seed. Die dokumentierten
Zahlen beschrieben damit eine Welt, **die es standardmäßig nicht mehr gibt** — und niemand hat nach
L2a nachgemessen. Das ist dieselbe Fehlerklasse wie meine eigene Naht 99, eine Runde später.

**Was falsch dokumentiert war** (gestrichen, nicht stillschweigend überschrieben):

| Behauptung in v16-L1 | tatsächlich (6 gewürfelte Welten) |
|---|---|
| Klippe **6 %** | **17–40 %** — in keiner Welt nahe 6 % |
| Terrasse **32 %** | 8–17 % |
| „Wandanteil mit und ohne Stufung **1,9 %** … es sind nicht mehr Wände geworden" | **widerlegt**: 1,8 % → 3,1–4,5 %, die Stufung hat den unkletterbaren Anteil verdoppelt |
| offene Frage „reicht 6 % Klippenfläche?" | **malformed** — Georg sollte eine Zahl beurteilen, die nicht vorkam |

**Die Ursache war nicht eine schlechte Zahl, sondern das falsche Werkzeug.** `reliefKontrast: 2.6`
spreizte die Glocke des `valueNoise`, um „0 % Klippe" zu heilen — eine Spreizung **verschiebt eine
Verteilung, ohne sie zu kennen**, und ihr Ergebnis hängt damit an jedem einzelnen Seed. Auf dem
Seed, auf dem getunt wurde, kamen 6 % heraus; auf allen anderen nicht.

**Die Reparatur: die Schwellen sind jetzt FLÄCHENANTEILE.** `buildReliefLut()` misst die Verteilung
des Reliefrauschens **einmal je Welt** (4096 Proben, 65 Quantile) und `reliefAt` gibt den
**Perzentilrang** zurück. Damit heißt `tFein: 0.45` genau das, was dort steht — 45 % der Fläche
sind Hang, auf **jeder** Welt. `reliefKontrast` ist ersatzlos entfernt, samt seinem Regler.
`setStepping` und `setWorldContext` verwerfen die Tabelle (ein Weltwürfel darf nicht die Tabelle
der vorigen Welt lesen).

**Gemessen — global, 5 Welten, je 40 000 Proben über 12 000 u (≈54 Reliefwellenlängen):**

| | Hang | Terrasse | Kiste | Klippe |
|---|---|---|---|---|
| Ziel (die Schwellen) | 45 % | 30 % | 18 % | 7 % |
| gemessen, Spanne über 5 Welten | **42–47 %** | **31–34 %** | **15–16 %** | **7–8 %** |

**Gemessen — lokal, 6 Welten, 480 u um den Ursprung:** Hang 34–69 % · Terrasse 18–56 % ·
Kiste 9–30 % · Klippe 0–3 %. **Die Streuung ist gewollt**, nicht ein Restfehler: ein 480-u-Fenster
enthält nur zwei Reliefwellenlängen, also *ist* ein Ort dort ein Ort und nicht ein Durchschnitt.
Die Perzentile garantieren die Verteilung über die **Welt**, nicht über jedes Fenster.
*Eine Abnahmezahl muss sagen, über welche Fläche sie gilt* — das fehlte in v16-L1 und ist die
halbe Ursache des Fehlers.

**Die richtige Abnahmezahl von L1 ist eine andere als die dokumentierte.** „Steigungen und Senken
NEBEN hohen Klippen" heißt **nicht** „weniger Wände" — eine Klippe IST eine Wand, das ist ihr
Zweck. Ein Gesamtanteil mittelt genau die Trennung weg, um die es geht. `stepReport` zählt den
Wandanteil deshalb jetzt **nach Reliefart getrennt**:

| | Wert (6 Welten) |
|---|---|
| Wände **in Klippengebieten** | **8,1–12,5 %** |
| Wände **überall sonst** | **0,9–2,8 %** |
| Wände gesamt, mit Stufung | 1,1–2,8 % |
| Wände gesamt, ohne Stufung (v15) | 1,8–1,9 % |
| mittlerer Nachbarsprung, mit / ohne | **0,44–0,52** / 0,55–0,60 u |
| größter Nachbarsprung | 6,00 u (= die Klippenstufe) |
| Weltwürfel inkl. Verteilungstabelle | **27 ms** |

**Der Startort, über 40 Welten geprüft** (weil die neue Messzeile ihn sichtbar gemacht hat: bei
einem Probeseed lagen lokal 36 % Klippe um den Ursprung): der Ursprung fällt in **1 von 40** Welten
in ein Klippenfeld, der lokale Klippenanteil im 480-u-Fenster hat **Median 2 %**, Minimum 0 %,
Maximum 32 %. Der Extremfall ist also ein Ausreißer und keine Regel — **nicht** stillschweigend
weggebogen, weil ein Startplatz mit Klippen dramatisch sein *kann*: das ist Georgs Entscheidung,
und der Hebel dafür wäre eine Startplatzsuche im Reliefwert, kein Eingriff in die Verteilung.

**Und eine Einschränkung, die dazugehört, weil sie gemessen ist:** die Konzentration der Wände in
den Klippengebieten funktioniert (**4- bis 9-fach** gegenüber dem Rest), aber die Fläche außerhalb
der Klippen ist mit 0,9–2,8 % **nicht messbar begehbarer als v15** (1,8–1,9 %). Der Grund: die
Reliefart „Kiste" (15–16 %) ist unverändertes v15-Verhalten, und ein steiler, auf 3 u gerasterter
Hang kann zwischen zwei Nachbarn zwei Stufen springen. Wer die Fläche wirklich begehbar will,
schiebt *… bis Terrassen* hoch und nimmt der Kiste ihren Anteil — der Regler sagt jetzt genau das.

---

## v16-L · Fork — 2026-08-12

`KFB Travel v16.dc.html` + `terrain-v16/` (56 Module), Kopie von v15. Titel und Meta-Zeile neu,
Fork-Stempel im Kopf von `travel-poc.js`. **v15 ist ab hier FROZEN.**

---

## Die Nähte 102–105

**(102) ⚠ `valueNoise` ist nicht gleichverteilt — Schwellen an einer Glocke verschieben nur, welche
Reliefart fehlt.** Erster Anlauf mit den Schwellen 0,42 / 0,68 / 0,88 ergab gemessen
**30 % / 68 % / 2 % / 0 %**: die Klippe kam überhaupt nicht vor. Der Fehler war nicht die Schwelle,
sondern die Annahme darunter — geglättetes Gitterrauschen ist eine **Glocke um 0,5**, die Enden sind
fast leer, und an den Enden liegen die interessanten Reliefarten. Jetzt wird die Karte **gespreizt,
bevor sie geschnitten wird** (`reliefKontrast`), Ergebnis 43 / 32 / 20 / 6 %.
*Wer eine Verteilung schneidet, muß sie kennen — sonst schneidet er seine Vorstellung von ihr.*

**(103) Ein Meßgitter, das gröber ist als der Gegenstand, mißt etwas anderes und meldet es unter
dessen Namen.** `stepReport` tastete 60×60 Punkte über 480 u ab, also **alle 8 u** — gemeldet wurde
damit der Sprung zwischen übernächsten Nachbarn, aber die Zahl hieß »größte Wand«. Eine Wand ist die
Kante zwischen **zwei benachbarten Zellen**; der Probenabstand ist deshalb jetzt `CELL`.

**(104) Eine feste Detailamplitude ist eine unausgesprochene Aussage über die Stufengröße.**
Das Detailrauschen stand auf ±CELL·1,1 = ±3,3 u — richtig, solange die Stufe 3,0 u war. Auf einer
0,5-u-Stufe sind das **±6,6 Stufen Zappeln pro Zelle**, also Schotter statt Hang. Die Amplitude
hängt jetzt an der örtlichen Stufe, gedeckelt bei `CELL` (ohne Deckel würde ausgerechnet die
Klippenzone am wildesten zappeln). *Jede Konstante, die mit `CELL` skaliert, ist ein Kandidat,
sobald `CELL` nicht mehr die einzige Stufe ist.*

**(105) L1 ist aus der Reiseflughöhe fast unsichtbar — und das ist eine Aussage über die
Reihenfolge, kein Defekt.** In zwei Abnahmebildern auf 46 u Höhe ist der Unterschied zwischen
Stufung an und aus mit dem Auge kaum zu finden; er trägt am Boden und im Tiefflug. **Was
Landschaften aus der Luft unterscheidbar macht, ist die Farbe (L2), nicht die Stufe.** Wer L1 an
einem Bild aus 46 u beurteilt, beurteilt das falsche Bild — die Belege sind deshalb die Zahlen und
eine Nahaufnahme (`scraps/01-stufung-v16.jpg`), nicht die Panoramen.
