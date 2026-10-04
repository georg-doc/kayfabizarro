# HANDOVER WS1 — Overworld v8 · Terrain, Karte, Fraktionen
**Stand 2026-08-08 · WS0 (Design-Chat) → WS1 (Asset Lab / Coworker)**

Maschinenlesbare Fassung: `docs/overworld-v8/HANDOVER_WS1_2026-08-08.json`
Menschenlesbare Fassung mit Bildern: `KFB Übergabe WS1.dc.html`

---

## 0 · In drei Sätzen

v8 ist die Basis; die Weltschicht dort ist teurer nachzubauen als unsere FX-Schicht zu portieren.
Der Boden war die offene Baustelle — **acht Bauarten sind gescheitert, die neunte trägt**, und die
Fehlerkette ist hier dokumentiert, damit sie niemand wiederholt. Karte, Mobs und Kartenzonen sind
konzipiert und als Slices mit Abnahmekriterien beschrieben, aber **noch nicht gebaut**.

---

## 1 · Messwerte

| Zahl | Was |
|---|---|
| **264 ms** | Bodenwerkstatt, vollständiger Neuaufbau des sichtbaren Ausschnitts (vorher 5146 ms) |
| **254 ms** | größte einzelne Blockade des Hauptfadens; danach durchgehend 16–19 ms |
| **427 / 615 ms** | die Tusche-Ebene kostete mehr als alle acht anderen zusammen — Hüllfläche bis 7000×7000 px je Strich |
| **149 ms** | Feldbänder-Prüfstand, Vollbild neu |
| **36 s** | Kaltstart des alten Reliefsystems — der Grund, warum es abgeschaltet wurde |

**Die Kostenregel.** Erstes Bild unter 400 ms, 60 fps beim Scrollen, keine synchrone Arbeit im
Zeichenpfad. *Ein Vorschlag ohne Kostenaussage gilt als unfertig.*

---

## 2 · Terrain-Floor-Art

### 2.1 Die Fehlerkette — der wertvollste Teil dieses Dokuments

| # | Bauart | Befund |
|---|---|---|
| 1 | Überlagerte Ovale mit Verlaufsfüllung | Tarnmuster. Ein Verlauf, der auf jeder Form gleich liegt, ist ein Muster. |
| 2 | Ovale ohne Verlauf, Wertleiter | Pillen auf einem Hintergrund. Es fehlte die Lückenlosigkeit. |
| 3 | Scharen gewellter Trennlinien | Ein Gitter. Zwei Familien paralleler Linien sind per Konstruktion eines. |
| 4 | Pinselzüge aus einer Hüllkurve | Avocados. Beide Kanten aus einer Funktion sind zwangsläufig spiegelsymmetrisch. |
| 5 | Züge aus parallelen Borsten | Kapseln. Parallele Borsten gleicher Länge mit runden Enden. |
| 6 | Anwuchs aus angelagerten Scheiben | Lesbare Kreise. Der Krümmungsradius war am ganzen Rand derselbe. |
| 7 | Anwuchs in drei Generationen | Drei erkennbare Stufen. Das ist kein Fraktal, das sind drei Maßstäbe. |
| 8 | Rückgrat aus Scheiben entlang der Bahn | Ausdehnung stimmt endlich, Kontur bleibt Scheibenvereinigung: Rechtecke statt Kreise. |
| **9** | **Band** | **TRÄGT.** |

**Die eine Einsicht darunter.** Sieben der acht Fehlschläge sind derselbe Fehler auf verschiedenen
Ebenen: *ein Grundelement erzeugen und vervielfältigen*. Oval, Gitterzelle, Zug, Scheibe, Rechteck —
sobald das Bild aus **Dingen** besteht, sieht man die Dinge, und keine Parameteränderung heilt das.

Was funktioniert: **Detail auf allen Größenstufen aus einer Regel** — als Fläche (Feld über
Weltkoordinaten, quantisiert) und als Kontur (Randabstand aus einer Summe von Wellen). Beide haben
keinen charakteristischen Maßstab, also gibt es nichts wiederzuerkennen.

### 2.2 Die Bandbauart

- **Fläche:** Wertefeld über Weltkoordinaten, quantisiert auf flache Stufen. Kein Verlauf, kein Füllen — *Schwelle*.
- **Kontur:** Randabstand aus einer Summe von fünf Wellen über der Bogenlänge. Links und rechts eigene Wellen, also nichts symmetrisch.
- **Kritisch:** die Wellenlänge läuft in **Bandbreiten**, nicht in Objektlängen. Sonst ist eine Welle bei langen Formen dreimal so lang wie die Form breit — und liest sich als Gerade.
- **Licht:** oben links. Tusche unten rechts, Lichtsaum oben links — dieselbe Sonne wie die Kontaktschatten der Sprites.
- **Kosten:** Zelle 460 px, Backauflösung 0,5, **asynchron ein Eimer je Einzelbild**, nie im Zeichenpfad.

### 2.3 Anti-Pattern — gelten als Abnahmekriterien

1. **Kein Grundelement.** Wenn ein Betrachter sagen kann „das sind alles Kreise / Blätter / Zellen / Rechtecke", ist die Bauart durchgefallen. **Der Test gilt für jede Ebene ALLEIN**, nicht nur fürs Gesamtbild — genau so sind hier fünf Bauarten durchgerutscht.
2. **Keine Symmetrie aus einer Funktion.** Eine glatte Funktion über eine Symmetrieachse ergibt zwangsläufig eine Linse.
3. **Keine Linien, die im Nichts enden.** Jeder Strich hat Aufsatz und Auslauf. Ein Band mit flachem Abschluss *ist* ein Rechteck.
4. **Keine runden Linienenden ohne Taper.** Verstößt gegen die KFB-Ink-Outline-Spec. Strichstärke muss über die Bahn um mehr als Faktor zwei wandern.
5. **Keine Linien aus Kreisen.** Eine Tuschelinie als Scheibenkette zeigt eine perlige Kante.
6. **Keine Pixelgrafik im Terrain.** Feldränder ja, Treppen nein.
7. **Kein Bevel im Bodenbild.** Bevel und Emboss gehören zur Höhen-/Ebenenlogik.
8. **Keine Verläufe als Flächenfüllung.** Ausnahmen: Wasser, Nebel, Tiefe.
9. **Kein gleichmäßiges Streuen.** Ruhe ist Pflicht.
10. **Keine Wellenlänge in Objektlängen.**

### 2.4 Die drei Schichten sauber trennen

| Schicht | Was | Plastik? |
|---|---|---|
| **Floor-Art** | die gemalte Fläche EINER Terrain-Ebene | **nein** — flach |
| **Layer / Height** | Wurfschatten und Kanten ZWISCHEN Ebenen | **ja** — hier gehört Bevel hin |
| **Feldränder** | Materialgrenzen | Tusche unten rechts, Lichtsaum oben links |

Die häufigste Vermischung in dieser Session war, Bodenkunst mit Höhenlogik zu verwechseln.

---

## 3 · Die Sternkarte

- **Zentrum:** Marktplatz mit **King Kayfabians Kastle** als Turm — die einzige Landmarke, die von jedem Punkt sichtbar bleibt. Händler, Jukebox, Tagebuch, Kartenablage. Kein Kampf.
- **Sechs Pfade, nicht sechs Linien.** Sie folgen der **Terrainlogik**: an Materialgrenzen entlang, um Fels herum, Senken an der schmalsten Stelle. Sechs gerade Speichen wären ein Rad.
- **Gleiche Laufzeit, ungleicher Weg.** Alle sechs Zonen etwa gleich weit — gemessen in Laufzeit, nicht Luftlinie. Pfad nachziehen, bis die Laufzeit im Zielband liegt.
- **Abseits des Pfades:** ein bis zwei Begegnungen, Gruppen von zwei bis drei, **nicht als Wache postiert**. Der Kampf findet zwischen den Wegen statt, nicht auf ihnen.
- **Kollision bleibt beim `land[]`-Raster.** Der Boden ist die sichtbare Schicht, nie die spielende.

---

## 4 · Kartenzone

| Teil | Regel |
|---|---|
| **Gummi-Outline** | geschlossene, elastische Kontur mit KFB-Tusche. Stärke wandert, Enden laufen aus, keine runden Kappen. Sitzt auf der Bildebene, folgt nicht dem Terrainlicht. |
| **Fluid-Gutter** | der Papierzwischenraum als fließende Fläche, mit eigener dünnerer Tusche zum Terrain. Der Übergang wird **zweimal behauptet, nie überblendet**. |
| **Holzbrücke** | Tiny-Sword-Asset, quert den Gutter. Der einzige Eingang — damit ist der Einstieg ein Ort, kein Zustand. |
| **Drei Wellen** | 1 und 2 Signatur-Mobs des Bioms, 3 der Boss. Zwischen den Wellen eine Atempause, in der die Karte sichtbar reagiert. |
| **Kayfabe-Pop** | Sieg: großer XP-Gewinn, Karte klappt zusammen, Gutter schließt sich, Zone wandert ins Tagebuch. |

---

## 5 · Sechs Fraktionen, sechs Bosse

| Zone | Gruppe | Boss | Signatur-Wellen | Wegrand | Beschäftigung |
|---|---|---|---|---|---|
| **Hof** | knights | Rosa Schwein *(Starter)* | Peasants · Hofvieh · Eber | streunende Peasants, Schafe | ernten, tragen, ausbessern |
| **Wildnis** | wilds | Troll | wilde Kämpfer · Bogenschützen · Troll | Zweier-/Dreiertrupps | Holz schlagen, Feuerstellen, Beute zerlegen |
| **Goblins** | goblins | Hex-Shaman | Goblins · TNT-Goblins · Shaman | Sprengtrupps mit Fackeln | Häuser und Türme sprengen und verbrennen |
| **Verlies** | dungeon | Minotaurus | Verlieswachen · Fernkämpfer · Minotaurus | selten, immer paarweise | patrouillieren, Fackeln wechseln |
| **Lager** | camp | Bär | Lagerwachen · Späher · Bär | Wachfeuer mit 2–3 | Vorräte stapeln, Zelte richten, Feuer hüten |
| **Wasser** | water | Paddle-Shark | Harpunen-Hai · Ruderboote · Paddle-Shark | Boote an der Halbinsel | fischen, Boote festmachen, Fracht umschlagen |

**Bossgröße ohne große Sprites.** Echte große Sprites gibt es nur für Troll, Minotaurus, Bär und
Schildkröte. Für die übrigen trägt die **Inszenierung**: 1,2–1,35× (darüber wird die Pixelkante
sichtbar), eigener größerer Kontaktschatten, Auftrittsmoment vor Welle 3, Selbstheilung als
sichtbarer Effekt. *Ein Boss ist ein Mob mit längerer Kampfsequenz, nicht ein größeres Bild.*

---

## 6 · Lebendige Biome — Neugier statt Wache

| Zustand | Was |
|---|---|
| **1 Beschäftigung** | Tätigkeit aus dem Biom, in Schleife, an einem Ort, mit Werkzeug. Kein Spielerbezug. |
| **2 Neugier** | Spieler in Reichweite: unterbrechen, drehen, schauen. Noch kein Kampf. **Der billigste Effekt im ganzen System** — und der, der aus einem Gegner ein Wesen macht. |
| **3 Absicht** | Entscheidung nach Temperament: angreifen, rufen, fliehen, weiterarbeiten. Nicht alle greifen an. |
| **4 Gruppe** | 2–3 teilen Ort und Tätigkeit. Reaktion **versetzt**, nie gleichzeitig — Gleichzeitigkeit ist das Verräterische an gescripteten Gegnern. |

**Auf- und Abbauzyklus.** Peasants bauen, Goblins sprengen und verbrennen. Der Spieler kommt nie in
dieselbe Karte zurück — nicht weil sie neu erzeugt wird, sondern weil dort inzwischen etwas passiert
ist. Kostet einen Zustandszähler je Gebäude.

---

## 7 · Kampf, Animation, Skills — der Bestand

**Steht und läuft:** Level, XP, Level-Up (Cap 8) · Karten-Drops mit fünf Seltenheitsstufen · drei
Fähigkeits-Slots auf 1–3 · sechs Effekt-Typen (freeze · distract · heal · bridge · meta · mark) ·
Journey-Speicherung. **Kampfgefühl:** Kill-Streak mit Zähler, Squash und Streak-Poke · Teilchen,
Blut, Erschütterung mit Regler 0–3 · Todesanimation, Waffen-Trail, sichtbarer Stun.

**Fehlt:** Projektile mit Standardpfeil · echte Statuseffekt-Liste (heute Einzelflags — ohne sie wird
jeder Skill ein Sonderfall) · Trophäensystem mit Galerie · Pop als Währung · Bingo/Bongo/Boggle ·
sechs Slots statt drei · Downed-State als Cut-Scene.

> ⚠ **Klang gibt es überhaupt nicht.** Null Audiodateien im Repo. Der Ansager ist verdrahtet
> (combo, multiKill, eliteDown) und **stumm**. Jede Idee, die auf Ton baut — akustische Fährten,
> Jukebox, Wegweiser per Klang — steht auf einer Schicht, die nicht existiert.

**Skill und Karte sind getrennt (entschieden 8.8.).** Die Karte hat keine Macht, sie ist der Beweis.
Karten sind Reisetagebuch. Was man *einsetzt*, sitzt in den Action-Slots. **Damit sind die Karten das
Levelsystem** — „ab X Karten öffnet sich Y" ersetzt eine Erfahrungskurve. Der Clou: wer einen
Hex-Shaman erlegt, schaltet ihn als Einheit frei *und* lernt seinen Zauber. **Die Trophäe ist der
Skill.**

*Offen:* die Schwellentabelle, drei oder sechs Slots, NewGame+ beim Deckwechsel.

---

## 8 · Slices mit Abnahme

| ID | Slice | Abnahme |
|---|---|---|
| **M1** | Boden in v8 einsetzen | erstes Bild < 400 ms, keine Blockade > 250 ms, 20 Keime ohne Grundelement |
| **M2** | Mob-Übersicht berichtigen *(teilweise erledigt)* | jede Einheit zeigt ihr eigenes Blatt, jede Zone genau einen Boss |
| **M3** | Sternkarte legen | sechs Laufzeiten innerhalb ±15 %, kein Pfad über 40 m gerade |
| **M4** | Kartenzone im Gelände | Übergang nirgends überblendet, Zone nur über die Brücke betretbar |
| **M5** | Drei Wellen und der Boss | Bosssequenz länger als eine Mobwelle, Sieg schreibt ins Tagebuch |
| **M6** | Lebendige Biome | keine Einheit ohne Tätigkeit, Gruppe reagiert versetzt, zerstörtes Gebäude im Aufbau |

---

## 9 · Asset-Befunde (gemessen, nicht vermutet)

| Einheit | Quelle | Gemessen | Befund |
|---|---|---|---|
| **troll** | Enemy Pack/Enemies/Troll/Troll_Idle.png | 4608×384, 12 Zellen à 384 | **Quelle korrekt** — grüner Troll mit Keule. Georgs Meldung „kein Troll" zeigt auf den **Zuschnitt in der Übersicht**, nicht auf das Asset. |
| **monk** | Free Pack/Units/Red Units/Monk/Idle.png | 1152×192, 6 à 192 | **Nicht** in Update 010. Noch nicht im Katalog `OW_UNITS`. |
| **lancer** | Free Pack/Units/Red Units/Lancer/Lancer_Idle.png | 3840×320, 12 à 320 | **Nicht** in Update 010. Noch nicht im Katalog `OW_UNITS`. |
| **bear** | Enemy Pack/Enemies/Caveborn/Bear/ | idle 2048×256 (8), run 1280×256 (5) | sauber; ein gemeldeter Zuschnittfehler ließ sich nicht bestätigen |

> Die Bosszuordnung in `KFB Mob Übersicht.dc.html` **überschreibt** heute nur die Anzeige. Die
> eigentliche Quelle ist der externe Katalog `OW_UNITS`; dort muss sie nachgezogen werden, sonst
> gibt es zwei Wahrheiten.

---

## 10 · Offene Entscheidungen

1. **Wie stark darf der Boden wabern?** Ein Himmel wird gestreift, ein Boden stundenlang angesehen. Amplitude deutlich unter dem Skydome — eher „Papier atmet" als „Waber". Als Zahl festschreiben und messen.
2. **Terrain-Tusche als eigenes Preset.** Karten-Preset nicht verbiegen. Eigene Federbreite, eigener Bogen, eigene Abnahmewerte.
3. **Marken von Hand.** Die einzige Ebene, die kein Verfahren erzeugen kann, ohne generisch zu werden. 12–18 gezeichnete Marken, je Biom drei, schwarz auf transparent, ~64 px. Der Code streut dann nur noch.
4. **Klangschicht.** Existiert nicht.

---

## 11 · Regeln

- Assets **immer** per GitHub-RAW, nie relativ (`./assets/…`) — der Standalone-Export hat kein `./assets/` neben sich.
- `zone-registry.json` / `zone-index.json` sind fremder Contract — hier nur lesen.
- Session-Export: Manifest → Veto-Fenster → nur Session-Dateien. **Nie Voll-Zip.**
- Jede neue Schicht nennt ihre Kosten, **bevor** sie beschrieben wird.

---

*Stay fluffy.*
