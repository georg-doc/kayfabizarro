# ⚠ NACHTRAG 2 · 1.9.2026 · Formenfamilie statt Formentscheidung (Georg: Scheibe, Hohlwelt, Open World)

Georg, 1.9.: kleine Welt ist gut, weil schnell umrundbar und genug Platz, wenn nicht alle 56
Karten in eine Welt müssen. Dazu **flache Scheibe als Persiflage auf die Flacherde**, **Hohlwelt**,
gern auch quadratisch. Ziel: **Open World als Template**, nutzbar für mehrere Spielmodi
(Karten sammeln, erkunden, später Walk und Shooter).

## 1 · Georgs Kantenlösung beantwortet die offene Frage 5 des Handovers

Der Handover nennt als Vorbehalt: *„Flachwelt und Kuppel haben einen Rand, der Torus nicht. Ein
Rand braucht eine Antwort."* Georgs Beschreibung IST die Antwort: über die Kante hinweg auf die
**andere Seite** fahren.

**Zwei Scheiben, an der Kante verklebt, haben keinen Rand mehr.** Topologisch ist das eine
gestauchte Kugel: kein Rand, kein Sonderfall, keine Erzählentscheidung nötig. **Damit fällt der
einzige Einwand gegen die Flachwelt weg** — und die Persiflage ist genau deshalb witzig: man
fährt an den Rand der Flacherde und stürzt *nicht*, man fährt unten weiter.

## 2 · Und die Scheibe kauft den Horizont, den der Radius nicht kaufen konnte

Das war das ungelöste Problem aus §05y: Sichtweite. Gemessen im Denkmal-Maßstab (Figur 1,43 u,
Augenhöhe 1,14):

| | Sichtweite | in Kartenbreiten |
|---|---|---|
| Torus R=13/r=5,2 | 3,45 u | **0,81** |
| Scheibe, flacher Teil | **nicht krümmungsbegrenzt** | Nebel und Relief entscheiden |

**Auf dem Torus sieht man weniger als eine Kartenbreite weit.** Auf einer Scheibe ist der
Horizont keine Kugelformel mehr, sondern eine Gestaltungsentscheidung: die Kante ist von der
Mitte aus sichtbar. **Für Open World ist das der eigentliche Unterschied**, nicht die Fläche.

## 3 · Preis: die Scheibe ist die billigste Form, die wir bisher gerechnet haben

Facettenkante 0,44 u wie im Handover, Profil = Deckel + Viertelrund + Boden:

| Form | Fläche | Dreiecke | Runde über die Kante | Kantenbogen | Karten quer |
|---|---|---|---|---|---|
| Torus R=13/r=5,2 | 2 669 | 57 k | 1,6 / 0,5 min | — | — |
| Scheibe A=13 B=2 | 1 245 | **13 k** | 0,8 min | **2,2 Figuren** | 6,1 |
| Scheibe A=13 B=4 | 1 421 | **15 k** | 0,9 min | 4,4 Figuren | 6,1 |
| Scheibe A=20 B=3 | 2 936 | 30 k | 1,2 min | 3,3 Figuren | 9,3 |
| **Scheibe A=20 B=5** | **3 208** | **33 k** | **1,3 min** | **5,5 Figuren** | 9,3 |
| Scheibe A=26 B=6 | 5 334 | 55 k | 1,7 min | 6,6 Figuren | 12,1 |

**A=20 / B=5 ist die Zeile:** 20 % mehr Fläche als der Torus bei 58 % seiner Dreiecke. Flacher
Boden braucht kaum Vertices, das ist der ganze Grund.

**`B` ist der Designparameter, nicht `A`.** Der Kantenbogen muss breit genug sein, um darüber
zu GEHEN: bei B=2 sind das 2,2 Figurenhöhen, also eine Bordsteinkante, über die man fällt statt
läuft. Ab **B≈4–5 (4,4–5,5 Figuren)** ist es eine befahrbare, begehbare Rundung.
**Eine wirklich flache Scheibe kann man nicht über die Kante verlassen** — die Rundung ist
sichtbar und gehört zum Witz, nicht gegen ihn.

⚠ **Der ehrliche Nachteil:** 44–62 % der Scheibe sind flacher Boden. Georgs Wunsch, *„die
Geometrie im Gelände und in den Häusern zu merken"*, erfüllt der Torus überall und die Scheibe
**nur an der Kante**. Das ist kein Fehler, sondern die Aussage der Form: eine Flachwelt fühlt
sich flach an. Die Kante muss deshalb von weit sichtbar und schnell erreichbar sein, sonst
existiert die Pointe nicht.

## 4 · Hohlwelt kostet ein Vorzeichen

Innen auf derselben Kugel stehen heißt: gleiche Geometrie, **`up` invertiert**, Schwerkraft nach
außen, Rückseiten-Culling umgedreht. **Wenn der Mannigfaltigkeits-Vertrag existiert, ist die
Hohlwelt ein Eintrag mit einem Minuszeichen.** Ohne ihn ist sie zwölf Module.

Und sie hat eine Eigenschaft, die keine andere Form hat: **man sieht die ganze Welt auf einmal**,
weil die Sicht nicht am Horizont endet, sondern gegenüber. Für „Karten sammeln" ist das ein
anderes Spiel — kein Suchen, sondern Wählen.

## 5 · Eine Formel für alle: Superquadrik

Kugel, Linse, Scheibe, gerundeter Würfel sind **eine** Formel mit zwei Exponenten. Damit ist
Georgs „quadratische Scheibe oder andere geometrische Formen" kein Formen-Zoo, sondern ein
Parameterpaar — und **der Seed kann die Form ziehen**. Der Weltcode des Handovers
(`Welt = Deck · Seed · Modus · Form`) bekommt sein viertes Feld damit geschenkt.

**Quadrat hat vier Ecken, und Ecken sind schlimmer als Kanten:** dort dreht die Normale in zwei
Richtungen gleichzeitig. Die Superquadrik rundet sie von selbst. Nebeneffekt, der Inhalt ist:
eine quadratische Welt hat **bevorzugte Richtungen** — die Diagonale ist länger als die Achse,
und die vier Ecken sind von Natur aus Landmarken. Ein Kreis hat das nicht.

## 6 · Was aus v7 shape-agnostisch ist — und was nur für den Torus gilt

**Unser `surfaceAltitudeAt(seed, typ, x, y, z)` funktioniert auf JEDER Form**, weil es
3D-Rauschen am Flächenpunkt liest. Es hat keine Pole, keine Naht und keine
Periodizitätsbedingung. Das periodische 2D-Rauschen des Handovers ist die **schnellere
Spezialform für den Torus** und lässt sich nicht auf eine Scheibe übertragen (eine Scheibe ist
in u nicht periodisch).

**⇒ Für die Formenfamilie: unser 3D-Rauschen behalten. Für den Torus zusätzlich: Knotenpfad
(6,5) aus dem Handover.** Beides gehört in den Vertrag, keins ersetzt das andere.

## 7 · Open World und mehrere Spielmodi — zwei Warnungen

**(a) Open World heißt: nichts kann von Hand platziert werden.** Wenn der Spieler überall
hinkann, gibt es keine Regie über den Blickwinkel. Alles muss aus Seed oder Pfad folgen. Genau
deshalb gibt es im Handover den Knotenpfad — er ist keine Deko, er ist der Ersatz für
Handplatzierung.

**(b) Ein Modus darf die Form nicht anfassen.** Der Handover hat die Regel schon:
*„Eine Schicht setzt oder transformiert, nie beides."* Form und Kartenplätze werden **gesetzt**
(Deck, Seed, Form); Modus **transformiert** nur Licht, Ton, Dichte, Antwortverhalten.
Sammeln, Erkunden und Shooter wollen verschiedene Sichtweiten und Dichten — **eine Welt, die
für alle drei gleichzeitig getunt wird, ist für keinen gut.** Als Template mit Modus-Parametern
funktioniert es, als Kompromiss-Terrain nicht.

## 8 · Reihenfolge der Formen (Vorschlag, nach Ertrag pro Aufwand)

| # | Form | Aufwand | Warum in dieser Reihenfolge |
|---|---|---|---|
| 1 | **Torus** | **null** | im Handover gebaut und gemessen. Übernehmen, nicht neu erfinden |
| 2 | **Hohlwelt** | **ein Vorzeichen** | höchster Neuigkeitswert je Zeile, sobald der Vertrag steht |
| 3 | **Scheibe / Linse** | Kantenrundung, Kamera an der Kante | löst Sichtweite und Open World, billigste Dreiecksbilanz |
| 4 | **Superquadrik (Quadrat u. a.)** | Exponenten + Ecken | danach fast gratis, macht die Form seedbar |

**Das ist zugleich die Begründung für S1.** Vier Formen ohne Mannigfaltigkeits-Vertrag sind vier
Umbauten in zwölf Modulen. Mit Vertrag sind es vier Einträge. **Georgs Wunschliste ist der
Geschäftsfall für den Vertrag**, nicht eine Liste danach.

---

# ⚠ NACHTRAG 1.9.2026 · Der Torus-Handover überholt den Planungskopf unten

Georg hat `docs/HANDOVER_Torus_Welt_Design.md` + `kfb_torus_world_poc.html` aus einem anderen
Chat beigelegt. **Dort ist der Torus nicht geplant, sondern gebaut und gemessen.** Was unten
steht, bleibt als Herleitung stehen, aber diese Punkte sind überholt oder falsch:

## 1 · Meine Torus-Zahlen waren zu klein gedacht

| | mein Vorschlag | Handover (gebaut) |
|---|---|---|
| R / r | 8 / 2,5 | **13 / 5,2** |
| Dreiecke | 105 k | **57 k** (260 × 110) |
| Fläche | 790 | **2 669** |

**Der Handover ist 3,4 × meine Fläche bei der HÄLFTE der Dreiecke.** Ich hatte die
Facettenkante von 0,1227 u als unantastbar behandelt („die Facetten SIND der Look") und daraus
die Segmentzahl gerechnet. Der Handover setzt sie auf **0,44 u** und begründet den Maßstab
stattdessen über die Karte: Kamera 2,8, Kartenhöhe 2,39, also bildschirmfüllend.
**Die Facettenkante war nie die Vorgabe, sie war eine Übernahme aus v3.**

## 2 · Der eigentliche Konflikt ist nicht r, sondern was eine Karte IST

Beide Welten sind Tori. In Kartenbreiten gerechnet sind sie unvereinbar:

| | Welt in Kartenbreiten | Facette je Kartenbreite |
|---|---|---|
| Travel Globe (heute) | **419** | 1,64 |
| Torus-Handover | **26,7** | **0,103** |

**16 × Unterschied, und zwar in beide Richtungen entgegengesetzt.** Der Travel Globe ist grob
und weit: die Karte ist das **Fahrzeug**, man sitzt darauf. Der Torus ist fein und eng: die
Karte ist ein **Ort**, man fliegt an ihr vorbei und liest sie frontal als Überlagerung
(Handover §5: *„im Raum wird angeordnet, gelesen wird frontal"*).

**Das ist keine Maßstabsfrage mehr, das ist eine Produktfrage.** Und sie lässt sich rechnen —
dieselbe Torus-Geometrie, drei Annahmen darüber, wie groß eine Figur gegen eine Karte ist:

| Annahme | Figur | Facette / Figur | Runde außen | Runde durchs Rohr | Horizont |
|---|---|---|---|---|---|
| Karte = **Fahrzeug** (Figur 2 Kartenbreiten) | 8,56 | 0,05 | **16 s** | 5 s | 2,0 Karten |
| Karte = **Denkmal** (Figur ⅓ Kartenbreite) | 1,43 | **0,31** | **98 s** | 28 s | 0,8 Karten |
| Karte = **Plakatwand** (Figur ⅙) | 0,71 | 0,62 | **195 s** | 56 s | 0,6 Karten |

**⇒ „Karte als Denkmal" auf der Handover-Geometrie ist die Zeile, die alles zugleich löst.**
98 s außen und 28 s durchs Rohr sind zwei brauchbare Reisezeiten. Und: **Facette / Figur = 0,31
gegen unsere 0,82 heute** — die Bodenabweichung aus Messung 1 (17,5 %) schrumpft damit auf
grob ein Drittel, also in die Nähe der 5-%-Schwelle. **Der Walk-Slice wird auf dieser Geometrie
billiger, nicht teurer.** Das hatte ich falsch vermutet.

⚠ **Nicht gemessen:** ob 0,31 wirklich unter die Schwelle fällt. Der Zusammenhang zwischen
Facettengröße und Abweichung ist bei uns **ein** Datenpunkt. Vor dem Bau: `bodenMessung()` auf
der Torus-Geometrie laufen lassen, das Instrument steht schon.

## 3 · Zwei Korrekturen an meinen Empfehlungen

**(a) Mein RAW-URL-Ratschlag war womöglich rückwärts.** Ich habe empfohlen, `rift.png` von
`./globe-v7/rift.png` auf eine kanonische RAW-URL zu ziehen. Der Handover §8 hat gemessen:
**`raw.githubusercontent` BLOCKT im Artefakt-Betrachter**, als Bild und als `fetch`. Wenn das
auch für unser Export-Ziel gilt, hätte mein Fix den Riss dort erst kaputt gemacht.
**Offen, weil widersprüchlich:** unser `globe-v7/` lädt GLBs, Atlanten, Sounds und die
Kartenrückseite ausschließlich über RAW und läuft. Also gilt die Sperre nicht überall.
**Erst messen, welcher Betrachter was erlaubt — dann keiner von uns beiden hat geraten.**
Die Vierstufenkette des Handovers (eigene Domain → RAW → **lokale Datei** → erzeugter Ersatz)
ist die Antwort, die beide Befunde überlebt.

**(b) Mein Mannigfaltigkeits-Vertrag hatte einen Fehler.** Ich hatte `zufallsPunkt(rnd)`
als ein Feld notiert. Der Handover hat gemessen, warum das auf einem Torus nicht reicht:
Außenumfang 114,4 zu Innenumfang 49,0 = **2,33 zu 1**, also ist gleichverteiltes u,v **nicht
flächengleich** und die Innenseite läuft über. Das Feld muss flächengewichtet sein, und der
Handover hat den Ersatz gleich mitgebaut: die Karten liegen nicht zufällig, sondern an einem
**Torusknoten (6,5)** — Pfadlänge 518,6, größter Flächenabstand 2,62. *Verteilung und Strecke
in einem.*

## 4 · Was der Handover bestätigt (unabhängig entstanden, also belastbar)

Periodisches Rauschen mit **ganzzahligen** Frequenzen schließt nahtlos (Nahtabweichung
10⁻¹⁵) · Torus-Gitter ohne Pol-Sonderfall · „Regler deklarieren statt bauen" (unser
Props-/Tweaks-Muster) · „Bedienleiste verschiebt die Bühne nicht, sonst ist jede Messung
danach wertlos" (unsere Panel-Regel) · und die Normierungsfalle: **über die Amplitudensumme,
nicht über die Anzahl der Wellen** — sonst ±0,25 statt ±0,7, und der Kommentar behauptet
weiter −1…1. Das ist genau unsere Fehlerklasse „Kommentar überlebt die Zahl".

## 5 · Neue Reihenfolge

S1 **Mannigfaltigkeits-Vertrag** (nur Kugel, kein Sichteffekt) → S2 **Torus aus dem Handover
übernehmen**, nicht neu erfinden (R=13/r=5,2, Knoten (6,5), periodisches Rauschen) →
S3 **`bodenMessung()` auf dem Torus** → S4 **Produktentscheidung Fahrzeug/Denkmal/Plakatwand**
(Georg, §5.7 — die Tabelle oben ist die Grundlage) → S5 **Deck → Seed (Stufe 1)** →
S6 **E-43 Walk** auf der gewonnenen Form → S7 Deck → Generator (Stufe 2).

⚠ **Und eine Konvention aus dem Handover, falls seine Linie fortgeschrieben wird:** dort sind
Bindestriche als Satzzeichen hart verboten. Unsere Docs sind voll damit. Zwei Stile in einem
Dokument sind schlimmer als jeder einzelne — **wer welchen Stil erbt, gehört entschieden.**

---

# ⚠ PLANUNG (nicht gebaut, teils überholt — siehe Nachtrag oben) · Weltform, Maßstab, Zufallswelten, Deck-Seed
### Angelegt 1.9.2026 aus Georgs Frage. **Kein Code, keine Entscheidung — Zahlen und Reihenfolge.**

Georg, 1.9.: Welt größer · Welt zufällig erzeugbar · Seed aus den **JSON-Inhalten eines
Kartendecks** · und **Torus statt Kugel**, zusammen mit der Maßstabsentscheidung. Bau im
frischen Chat.

## 1 · Die Zahl, die die Maßstabsfrage entscheidet: **Dreiecke**

Bisher hieß „größere Welt" nur „größeres r". Ungeprüft war der Preis. Die Facettenkante
**0,1227 u IST der Look** (flatShading) — bleibt sie gleich, wächst die Segmentzahl mit r,
und die Dreiecke mit r².

| Form | Fläche u² | Dreiecke | Segmente | Runde zu Fuß | Horizont |
|---|---|---|---|---|---|
| Kugel r=5 (heute) | 314 | **131 k** | 256² | 4,3 min | 1,10 |
| Kugel r=17,6 (15-min-Ziel) | 3 893 | **1 624 k** | 901² | 15,0 min | 2,06 |
| Kugel r=66,7 (4-u-Horizont) | 55 906 | **23 324 k** | 3 415² | 56,8 min | 4,00 |
| **Torus R=6 / r=2** | 474 | **63 k** | 307×102 | 5,1 / **1,7** min | 0,69 |
| **Torus R=8 / r=2,5** | 790 | **105 k** | 410×128 | 6,8 / **2,1** min | 0,77 |
| **Torus R=12 / r=3** | 1 421 | **189 k** | 614×154 | 10,2 / **2,6** min | 0,85 |

**⇒ Die Kugel mit 4-u-Horizont ist tot.** 23 Mio Dreiecke als ein Mesh gibt es nicht; das
Ziel bräuchte Chunking und LOD, also einen eigenen großen Slice. r=17,6 wäre mit 1,6 Mio
gerade noch ein Mesh, kostet aber 12 × den Terrain-Bake.

**⇒ Der Torus ist nicht der Umweg, er ist möglicherweise die Antwort.** R=8/r=2,5 gibt
**2,5 × die Lauffläche von heute bei 20 % WENIGER Dreiecken.** Grund ist kein Trick: das
Torus-Gitter ist rechteckig, das Kugelgitter drängt Vertices an den Polen zusammen und
verschwendet sie dort.

**Und der Torus hat zwei Umfänge statt einem.** Das ist für ein Reisespiel ein Geschenk:
eine kurze Runde quer durchs Rohr (**2,1 min**) und eine lange ums Loch (**6,8 min**) — aus
einer Welt, ohne Kompromiss zwischen „schnell mal rum" und „echte Reise".

⚠ **Aber der Horizont wird KLEINER, nicht größer** (0,77 statt 1,10): die Formel √(2·r·h)
sieht nur das Rohr, und das Rohr ist dünner als die Kugel. Der Gegen-Einwand ist echt, aber
**ungemessen**: auf einem Torus sieht man *über das Loch* und die Innenkurve entlang, also
weit an einer Silhouette vorbei, die keine Kugel bietet. **Das ist eine Vermutung, keine
Zahl** — sie braucht denselben Strahlentest wie Messung 1, bevor jemand darauf baut.

## 2 · Was ein Torus wirklich kostet: der Aufwärts-Vektor

Fast jedes Modul rechnet heute `up = position.normalize()`. **Auf einem Torus ist das
falsch** — „oben" ist die Rohr-Normale, nicht die Richtung vom Mittelpunkt. Betroffen sind
~12 Module: `carpet.js` (Bewegung), `terrain-surface.js` (Verschiebungsachse), `globe.js`,
`globe-landmarks.js` (Platzierung + Ausrichtung), `camera-rig.js`, `portal.js`,
`landmark-collide.js`, `card-shadow.js`, `carpet-wake/-leaves`, `sky-dice`, `sky-cards`.

**Der Torus ist damit kein Skin, sondern ein zweites Weltmodell** — genau die Klasse
Änderung, gegen die der Fahrzeug-Vertrag gebaut wurde. Also derselbe Zug eine Ebene höher:

> **Ein Mannigfaltigkeits-Vertrag.** EIN Modul besitzt `up(p)` · `aufSetzen(p)` ·
> `gehen(p, richtung, weite)` · `rundenLaengen()` · `zufallsPunkt(rnd)` · `horizont(h)`.
> Kugel ist die erste Umsetzung, Torus die zweite. Danach FRAGEN die 12 Module statt zu
> unterstellen — und der Torus ist ein Eintrag, kein Umbau.

**Das verschiebt E-43.** Walk auf einem kugel-unterstellenden Bewegungsrechner zu bauen und
danach die Weltform zu wechseln heißt, den Walk zweimal zu bauen. Reihenfolge unten.

## 3 · Deck → Welt: das sind ZWEI Features, und sie werden ständig verwechselt

**Stufe 1 · Deck als SEED** (billig, ein Modul). Deck-JSON → stabiler Hash → `seed`.
`surfaceAltitudeAt(seed, …)` nimmt den Seed längst — es fehlt nur die Hash-Funktion.
Ergebnis: gleiches Deck ⇒ gleiche Welt, teilbar, reproduzierbar. **Aber ohne jede
Entsprechung:** die Welt sieht nicht aus wie das Deck, sie ist nur zuverlässig an es gekoppelt.
Ein Hash zerstört Bedeutung, das ist seine Aufgabe.

**Stufe 2 · Deck als GENERATOR** (das eigentlich Interessante, und das Riskante). Deckfelder
steuern Terrain-Parameter, nicht den Hash: Kartenzahl → Landmark-Dichte · dominante Farben →
Palette · Seltenheitsspanne → Berghöhen-Varianz · Kartentypen → Biom-Mischung.
**Braucht eine deklarierte Zuordnungstabelle**, wird die ersten drei Male falsch sein, und
deshalb nach Projektgewohnheit ein Instrument: eine Ablesung „warum sieht diese Welt so aus" —
welches Deckfeld welchen Parameter gezogen hat. Ohne die Ablesung ist es Magie, und Magie
kann man nicht abstimmen.

⚠ Stufe 1 zuerst, und zwar **nicht** als Vorstufe von Stufe 2 — als Rückfall. Ein Deck ohne
brauchbare Felder muss trotzdem eine Welt ergeben.

**Der Torus ist für Zufallswelten übrigens der leichtere Boden:** er ist in beiden Richtungen
periodisch, 4D-Rauschen auf zwei Kreisen gibt nahtloses Terrain ohne Polstauchung und ohne
Naht. Die Kugel braucht 3D-Rauschen und hat die Pole als Sonderfall.

## 4 · Reihenfolge (Vorschlag, jede Stufe für sich abnehmbar)

| # | Slice | Warum hier |
|---|---|---|
| S1 | **Mannigfaltigkeits-Vertrag, nur Kugel** | Kein Sichteffekt. Beweist, dass die 12 Module fragen statt zu unterstellen. Genau der Zug, der beim Fahrzeug-Vertrag funktioniert hat |
| S2 | **Torus als zweite Umsetzung** | Jetzt messbar statt behauptet: Rundenzeiten, Dreiecke, und der **Strahlentest für die Sichtweite übers Loch** |
| S3 | **Maßstabsentscheidung** | Mit Zahlen von beiden Formen statt von einer. Georgs Entscheidung (§5.7) |
| S4 | **Deck → Seed (Stufe 1)** | Billig, unabhängig von S1–S3, jederzeit einschiebbar |
| S5 | **E-43 Walk** | Auf der Form, die gewonnen hat. Plus Raycast-Bodenlesung (Messung 1: 17,5 % ⇒ Pflicht) |
| S6 | **Deck → Generator (Stufe 2)** | Zuletzt: braucht die Zuordnungstabelle und die Ablesung |

**Nicht in einem Slice:** Torus + Zufallswelt + Deck-Seed sind drei Unbekannte. Zusammen
gebaut weiß man beim ersten Fehler nicht, welche davon schuld ist.

---
> **STATUS 31.8. (v7):** Der Vertrag unten ist **gebaut** — `globe-v7/fahrzeug-vertrag.js`,
> Tor im Panel („Vehicle contract & walk prep"), zehn geprüfte Zusagen plus eine Liste
> VERBOTENER Feldnamen. Offen bleibt genau eine Naht: `wakeUrsprung` hat noch keinen Leser
> (heute `'mitte'` = `qPosition`, ein Boot braucht `'heck'`). Alles darunter bleibt als
> Begründung stehen. Messwerte und die Korrektur an §05v: LIVING §05y.

# ⚠ ENTSCHEIDUNG · Fahrzeuge · Georg, 30.8.

**„Nur Skins (erstmal, später ggf. Ausbau nach tinyskies für Boot etc.)"**

Damit ist die Frage beantwortet, die `Boat.ts` blockiert hat, und der Fahrzeug-Vertrag ist fällig,
BEVOR das zweite Fahrzeug gebaut wird — nicht danach.

## Was „nur Skins" konkret heißt

**Eine Flugphysik.** `carpet.js` bleibt der einzige Bewegungsrechner. Ein Fahrzeug liefert
Aussehen und Anfassmaße, keine eigene Bewegung. Was ein Fahrzeug NICHT darf: eigene Trägheit,
eigene Kurvenrate, eigenes Tempolimit.

## Der Vertrag · fünf Felder

Die Bauform der Quelle heißt `VehicleGameFeatures` (`docs/QUELLE_tinyskies-Inventar.md`) — eine
**Merkmalstabelle statt einer Typprüfung**. Das ist genau das Muster, das hier gebraucht wird, und
es ist unabhängig entstanden; damit ist es belegt, nicht geraten.

| Feld | was es festlegt | warum es im Vertrag steht |
|---|---|---|
| `sitz` | wo das Pet sitzt (Offset + Blickrichtung) | die Badewanne setzt es tiefer und weiter hinten als der Teppich; ohne Feld wird das eine Sonderabfrage je Fahrzeug |
| `rumpf` | Trefferkasten und halbe Breite | Karten- und Würfel-Trefferfenster rechnen mit der Avatarbreite (Slice D). Ändert sie sich stumm, verschieben sich zwei Spielmechaniken |
| `wakeUrsprung` | wo Gischt und Driftstaub entstehen | ein Boot wirft Gischt am Bug, ein Teppich an der Hinterkante |
| `neigungsgrenzen` | maximale Schräglage und Nick | ein Teppich darf kippen, eine Badewanne kentert — das ist Aussehen, nicht Physik |
| `fx` | welche Kaskaden dieses Fahrzeug auslöst | `water.enter` heißt beim Boot etwas anderes als beim Teppich |

## Was AUSDRÜCKLICH nicht im Vertrag steht

Tempo, Kurvenrate, Trägheit, Höhenband. Alles vier gehört `carpet.js`. **Ein Feld, das ein
Fahrzeug in die Physik hineinreichen lässt, ist der erste Schritt zur zweiten Flugphysik** — und
die ist nach dieser Entscheidung nicht gewollt.

## Der spätere Ausbau, und was ihn billig hält

Georgs „später ggf. Ausbau nach tinyskies für Boot etc." ist der Grund, den Vertrag JETZT zu
schreiben: solange es ein Fahrzeug gibt, ist er kostenlos. Ab dem zweiten kostet jedes fehlende
Feld eine Sonderabfrage, und Sonderabfragen verteilen sich (die Quelle zeigt es: `inCosmicVoid`
hat ~20 verstreute Abschaltabfragen, siehe Inventar).

Für das Boot liegen die Befunde schon vor, ungelesen bleibt nur `Boat.ts` selbst:
`BoatMesh.ts` · `WakeTrail.ts` — **die Schaum-Wasserlinie ist GEOMETRIE** (schmale
`BoxGeometry`-Streifen, `MeshBasicMaterial`), kein Shader. Und die Combo-Werte je Fahrzeug stehen
im Inventar (Teppich 1,22 / 1,7 s · Boot 0,58 / 3,0 s) — das sind FX- und Belohnungswerte, keine
Physik, also Vertragsfelder.

---

# ⚠ ENTSCHEIDUNG · Walk-Modus · Georg, 31.8. (E-43)

**„Der Walk-Modus ist ein SKIN: kein Vehikel, sondern das Pet mit Walk-Cycle, verbunden mit der
Fahrzeugphysik — so tun, als wäre es ein unsichtbares Fahrzeug. Schritt-Timing an die Geschwindigkeit
anpassen. Später, eigene Slice."**

Damit fällt Walk unter den Fahrzeug-Vertrag unten und erzeugt **keinen zweiten Bewegungsrechner**.
`carpet.js` bleibt der einzige; der Modus setzt `hoverHeight ≈ 0` und dreht Tempo/Kurvenrate über
`params` (seit Slice D sind 31 Werte freigelegt). Zwei Messungen gehören VOR den Bau, beide stehen
in `LIVING` §05v: die Bodenhöhe muss aus dem **Mesh** kommen (Facette 0,123 u ≈ Figurgröße, die
analytische Funktion weicht um 7–20 % der Figurhöhe ab), und der **Maßstab** ist die eigentliche
Frage (Horizont 1,2 u, Weltumrundung ~105 s zu Fuß — genauso schnell wie fliegend).

---

# Backlog · KFB Travel Globe

Gesammelte Ideen, die NICHT im laufenden Slice sind. Eine Zeile pro Sache, mit dem
Grund und dem, was daran teuer ist — sonst steht hier in zwei Wochen eine Wunschliste
ohne Preis.

## Gimmicks (Georg, 28.8.2026)

### Zahnrad als Tacho
Das Gear-Icon (`globe-v2/gear-icon.js`, lädt `media/3D_Assets/GEAR_ICON.glb`) reagiert
mit dem Cartoon-Deformer auf die Flugkinetik:

- **Drehgeschwindigkeit = aktuelles Tempo** statt der drei festen Raten (Ruhe 0,55 /
  Hover 2,6 / offen 1,2). Die Zahl liegt fertig da: `carpet.speedRatio` 0…1.
- **Deformer auf den Flug**: Schräglage, Schub, Kurvenrate — dieselben Größen, die
  `pet-kinetics.js` schon liest (`carrierState`). Das Zahnrad wird damit ein zweiter
  Leser derselben Messung, nicht eine zweite Uhr.
- **Tempo-Anzeige in der Nabe** des Zahnrads.

Preis und Fallen:
- Das Zahnrad hat einen EIGENEN Renderer und eine eigene rAF-Schleife (44 px,
  transparent). Der Flugzustand lebt im Runner. Also braucht es einen Kanal —
  `gear.setFlight({ speed01, bank, boosting })` aus `frame()`, EIN Aufruf, kein
  gemeinsamer Zustand, kein Zugriff des Knopfes auf `window.__globe`.
- Die Nabenzahl ist Text in 3D: entweder eine kleine CanvasTexture auf der Nabe (billig,
  muss bei jeder Änderung neu gemalt werden → auf 10/s drosseln) oder ein DOM-Label über
  dem Knopf (billiger, aber dreht nicht mit). Erst entscheiden, dann bauen.
- Prime Directive gilt auch hier: ein Knopf, der dauernd zappelt, ist Clutter. Das
  Gimmick lebt vom Kontrast zur Ruhe — im Stand fast still, bei Tempo lebendig.

## Karten als Vorhänge zum Durchfliegen (Georg, 29.8.) — Befund vor dem Bauen

Frage war: geht `webgpu_compute_cloth` (three.js-Beispiel) mit unserem Stack?

**Technisch ja, aber es forkt den Renderer.** Gemessen an unseren Dateien:
- Die Globe-Seite fährt `WebGLRenderer` (three 0.160 über Importmap).
- Das Beispiel braucht `WebGPURenderer` + TSL-Compute. Der Browser kann es: `Rollercoaster Ride
  v11` in DIESEM Projekt lädt bereits `three.webgpu.js` — die WebGPU-Seite ist also erprobt.
- Der Preis: **jeder Shader-Patch im Globus ist GLSL über `onBeforeCompile`** — Ozean
  (Küstenkonturen, Schaum, Glitzern), Wolken, Rim-Light-Injektion, der Verbieger, die Blätter,
  das Karten-Portal. `WebGPURenderer` nimmt diese Patches nicht. Ein Umzug wäre kein Zuschalten,
  sondern eine Neufassung aller sichtbaren Materialien.
  → Empfehlung: WebGPU-Cloth als EIGENE POC-Seite (wie `Fractal Skydome POC`), nicht im Globus.

**Was die Quelle selbst macht — und das ist die billige Antwort:** tinyskies hat KEINEN
Cloth-Solver. `FlagSystem.ts` ist eine `BoxGeometry(0.08, 0.05, 0.005, 10, 4, 1)` mit einem Sway,
der per `onBeforeCompile` in den Vertex-Shader injiziert wird; für Banner gibt es
`applyRaceBannerFabricSway` (Globe.ts 4973). Unser `card-carrier` gehört zur selben Familie
(Welle plus Federn). Der Vorhang-LOOK ist also heute in WebGL erreichbar.

**Für die Impact-Zone braucht es keinen Solver:** der Durchflug ist schon erkannt (Vorzeichen-
wechsel des Abstands zur Kartenebene plus Treffer innerhalb der halben Kanten, `sky-cards`).
Eine Verlet-Matte von 12×8 Knoten je Vorhang kostet 96 Knoten — drei Vorhänge sind 288, das
rechnet die CPU im Schlaf. Impuls am Trefferpunkt, Beule, Riss, Zurückschwingen.

**Reihenfolge, wenn es dran ist (S6b):** (1) Cartoon-Reaktion auf den bestehenden Durchflug
(Impuls + das vorhandene Portal + kurzer Tempostreifen-Stoß), (2) Verlet-Matte als Vorhang in
WebGL, (3) WebGPU-Compute-Cloth nur als separate POC-Seite, falls die Optik nicht reicht.

## HUD reagiert auf den Flug (Georg, 29.8.) — für einen späteren Slice

Idee: Wortmarke, Zahnrad, Kartenstapel und die übrigen HUD-Elemente zeigen eine gemeinsame
**Flug-Reaktion** — träges Folgen bei Schräglage, leichtes Pendeln, Nachschwingen.

Was dafür schon existiert und benutzt werden muss (statt neu zu bauen):
- **Der Zustand liegt bereit:** `carpet.state.bankAngle` (Schräglage), `turnRate`,
  `carpet.speedRatio`, `carpet.agl`. Der Runner liest sie ohnehin jedes Bild — EINE Messung,
  mehrere Leser, keine zweite Uhr.
- **Die Federn gibt es auch:** `pet-kinetics.js` fährt Federn ZWEITER Ordnung mit Überschwinger
  (genau das „träge Folgen"), und `card-carrier.js` hat dieselbe Familie für Roll/Pitch/Yaw-Whip.
  Eine Feder je HUD-Gruppe, gefüttert aus `bankAngle`, ist die KISS-Fassung — keine CSS-Animation,
  sondern ein Wert je Bild auf `transform`.
- **Ein Eigentümer.** Die Wortmarke hat seit v3j eine CSS-Schleife (Schweben). Wer sie zusätzlich
  aus JS bewegt, hat zwei Schreiber auf `transform` — Fehlerklasse 1. Lösung: die Flug-Reaktion
  schreibt eine CSS-Variable (`--kfb-bank`), die Schleife rechnet sie in ihr Keyframe ein;
  ODER die Schleife wird abgelöst und JS übernimmt beides. Vor dem Bauen entscheiden.
- **Grenze:** das HUD darf nicht mit dem Bild kippen, sonst wird aus Reaktion Seekrankheit.
  Vorschlag zum Messen: maximal ±1,5° Drehung und ±4 px Versatz bei voller Schräglage (π/4),
  Rückstellzeit ~0,6 s.

## Alternative Fahrzeuge · die Badewanne (Georg, 30.8.) — Befund vor dem Bauen

Georgs Vorschlag: `Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf` als **freispielbares**
Alternativ-Fahrzeug (fliegend/fahrend/schwimmend), Armaturen hinten als Außenborder, Pet mittig auf
Wasserhöhe mit Füßen drin. Auswahl in den Settings. Später weitere Fahrzeuge — *„erstmal alles
Skins, ggf. mit angepassten Partikeln für den Vibe"*. **Niedrige Prio.**

**Die Idee ist richtig, und „erstmal alles Skins" ist die wichtigste Zeile darin.** Sie sollte als
Entscheidung festgeschrieben werden, damit sie niemand später „verbessert": *ein Fahrzeug ist ein
MESH plus ein FX-Geschmack plus Grenzwerte — nie eine zweite Flugphysik.* In dem Moment, in dem
jemand badewannenspezifischen Bewegungscode schreibt, haben wir zwei Flugmodelle, und dieses Projekt
hat Fehlerklasse 1 („zwei Verwalter derselben Sache") schon oft genug bezahlt.

### Was daran teuer ist — und es ist nicht das GLB

Der Avatar ist heute `card-carrier.js`: eine gewellte Kartenplatte, ein Sitz, der die Fläche jedes
Bild ABLIEST, eine Clip-Ebene, dunkler Rand, Kartenrückseite. **Das Mesh und der Sitz sind
verheiratet.** Ein Wannentausch ist deshalb keine Mesh-Zuweisung, sondern die Einführung eines
**Fahrzeug-Vertrags**: EIN Satz Zusagen, den Karte und Wanne beide erfüllen.

| Zusage | Karte heute | Wanne |
|---|---|---|
| **Sitzpunkt** (wo steht das Pet) | Fläche wird je Bild abgelesen | fester Punkt im Wannenboden, Wasserlinie |
| **Rumpfmaße** (Kollision, Keep-out) | halbe Kanten der Karte | Wannen-Bounding, deutlich schmaler/höher |
| **Wake-Ursprung** | heute die Fahrzeugposition | Heck (Außenborder), nicht Mitte |
| **Neigungsgrenzen** | `MAX_BANK` π/4, Karte darf whippen | eine Wanne kippt nicht wie ein Teppich |
| **FX-Geschmack** | Blätter · Staub · Kielwasser | Seifenschaum statt Staub, Blubber statt Blätter |

**Der billige Zug, den man JETZT machen kann und der später teuer wird:** solange nur ein Fahrzeug
existiert, ist der Vertrag eine Datei mit fünf Feldern. Bei drei Fahrzeugen ist er eine Umbaustelle
in acht Modulen (`carpet-wake`, `drift-smoke`, `carpet-leaves`, `card-shadow`,
`landmark-collide`, `pet-kinetics`, `camera-rig`, `sky-dice`).
→ **Empfehlung: bei Slice G oder H beiläufig den Wake-Ursprung aus dem Fahrzeug lesen** statt aus
`carpet.worldPos()`. Eine Zeile, kein Slice — und danach ist die Wanne fast geschenkt.
*Wenn Slice F den Wake fest an die Fahrzeugmitte nagelt, spritzt die Wanne aus dem Bauch statt aus
dem Außenborder, und das repariert man dann in zwei Modulen.*

### Die tinyskies-Quelle dazu ist gelesen (30.8., beim Slice-F-Port aufgefallen)

Es gibt dort **mehr als „Boot": eine eigene Fahrzeugfamilie.** Gesichtet:
`Boat.ts` · `BoatMesh.ts` · `WakeTrail.ts`. Drei Sachen daraus sind für uns relevant:

- **`WakeTrail.ts`: „Two V-shaped foam wake trails behind a boat."** Das ist der Effekt, den ein
  Boot braucht und den `CarpetWake` NICHT ist — Kielwasser als **Band auf der Oberfläche**, nicht
  als Tropfen in der Luft. Für die Wanne ist das der richtige Baustein, und er ist portierbar
  (unser `carpet-trail.js` ist dieselbe Bauform: zwei Bänder, Breite pro Punkt zur Kamera).
- **`BoatMesh.ts`: die Schaum-Wasserlinie ist GEOMETRIE, kein Shader.** Gemessen: schmale
  `BoxGeometry`-Streifen mit `MeshBasicMaterial` entlang Rumpf, Bug, Heck und Spiegel
  (`foamSide = s·0.14`, `foamY = −s·0.18`). Billig, cartoonig, und genau die Sprache, die zu einer
  Badewanne passt. **Das ist der Trick, den man übernimmt** — er löst „Pet auf Wasserhöhe mit Füßen
  drin" optisch, ohne eine Wasserlinie im Shader zu rechnen.
- **Noch nicht gelesen:** `Boat.ts` selbst (Bewegungsmodell). ⚠ **Und das soll auch so bleiben, bis
  eine Entscheidung da ist** — wer es liest, bevor „nur Skins" festgeschrieben ist, baut das zweite
  Flugmodell aus Versehen. Erst entscheiden, dann lesen.

### Preis und Reihenfolge, wenn es dran ist

1. **Fahrzeug-Vertrag** (fünf Felder, eine Datei) + Karte erfüllt ihn. Kein Sichteffekt. Klein.
2. **Wanne als zweites Mesh** hinter dem Vertrag: GLB laden, Sitz und Rumpfmaße eintragen,
   Settings-Auswahl. Mittel — der Löwenanteil ist Ausrichtung und Maßstab, nicht Code.
3. **FX-Geschmack je Fahrzeug**: Schaum statt Staub, `WakeTrail`-Band statt Tropfen. Klein, weil
   `setTint()` und `params` seit Slice D/F an beiden Partikelsystemen hängen.
4. **Freispielen** braucht einen Fortschrittsspeicher, den es noch nicht gibt. Eigene Frage, nicht
   Teil des Fahrzeugs.

**Was NICHT passieren darf:** ein `if (fahrzeug === 'wanne')` in `carpet.js`. Die Flugphysik ist
1:1 aus der Quelle und die Bezugsgröße für Drift, Traktion und Schräglage — Fahrzeuge unterscheiden
sich in `params` (Slice D hat sie genau dafür freigelegt: 31 Werte, alle einzeln überschreibbar),
nicht in Codezweigen.
