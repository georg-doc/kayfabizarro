# HANDOVER an WS1 — Overworld v11 → v13 (2026-08-12, H0)

Eine Richtung, eine Runde, eine Abnahme mit Zahlen (Masterplan §6). Dieses Blatt schließt die
**zwei ungesendeten Runden** (§4v/§4y, Naht 102). Es enthält: den gemessenen Datei-Diff (§1), was
sich inhaltlich geändert hat (§2), die Nähte 67–104 in Kurzform (§3) und den **Masterplan-Patch als
einsetzbaren Textblock** (§4). Kein Modul dieses Exports erwartet eine Anpassung im Pfad — die
Module lösen ihre Nachbarn über die eigene Adresse auf.

**Absender:** WS0 · **Stand hier:** `KFB Overworld v13.dc.html` + `overworld-v13/` (56 Module +
`icons-rpg/` + 3 JSON) · **Fork-Kette:** v10-S22 → v11 → v12 → v13 (v13 ist reiner Pfad-Fork)

---

## §1 Der Diff, gemessen (Byte-Vergleich `overworld-v11/` gegen `overworld-v13/`)

**Acht Dateien, nicht drei.** §4v nannte drei (`water-kiss`, `terrain-paint`, `overworld-game-v10`) —
das war der Stand am Vormittag. Gemessen sind es:

| Datei | v11 → v13 (Bytes) | Was |
|---|---|---|
| `water-kiss.js` | **neu** | water-v2.0: eine Streufarbe je Fluid-Körper, harte Glanzformen, Schwelle je Ort moduliert, gestuftes Morphen (7/9), Schelf am Ufer, RMS-Neigung als geführte Zahl, drei Formfamilien als Schalter `waterForm` |
| `overworld-game-v10.js` | 300 340 → 305 428 | `paintOpt` trägt `fluid`+`nah`; `drawWater` hinter der Fluid-Schicht; **Kamera-Klammer** statt zeitgesteuertem Überblenden; `stepReader`; `spawnPoints`; `spawnCritters`; `aufBlatt()`; Tutorial-Gegner; drei gelöschte Konstanten |
| `card-rail-v9b.js` | 196 136 → 203 115 | Statblatt: v11-Fluffbox **zeichengleich zurück** (93), deckendes Papier (92), `--pad` 13…22, Trefferfläche 31×28 am Titel-Dreieck, POP-account-Zeile raus, Logbuch so hoch wie sein Inhalt, Ausfahrt 90+220 ms, Roster-Taste hört auf die Schattengrenze (74) |
| `terrain-paint.js` | 31 974 → 32 758 | tp-v4.6: `drawWater` delegiert an `OW_WATER`, behält nur Clip und Ausschnitt; alter Rauschweg bleibt als Rückfall |
| `journey.js` | 4 510 → 5 114 | **Schema 2.3.0 → 2.4.0**: `hero.unit`, Katalogschlüssel **ohne** `hero_`-Präfix, alte Stände `null` = nie gewählt |
| `card-backs.js` | 5 916 → 6 574 | Rückseiten über den CDN-Kanal statt relativ neben dem DC |
| `asset-source.js` | 2 169 → 2 550 | src-v1.0 + `ow()`: der Runner-Ordner im Repo als benannter Kanal (v12-P1). Schrift, Rückseiten, Wortmarke laufen hier durch |
| `gutter-2d.js` | 7 822 → 7 490 | Brücke v12-B1: **zwei** Felder statt einem, Tor-Loch im Graben raus — die Linie wird überdeckt, nicht unterbrochen |

**Unverändert und deshalb nicht im Paket:** `units-catalog.js`, `unit-loader.js`, `mob-ai.js`,
`game-feel.js`, `reach.js`, `shots.js`, `roster-sheet.js` und die übrigen 49 Dateien. Der
`units-catalog`-Diff aus §4h bleibt damit offen wie er war — er ist **nicht** neu.

**Am DC (Runner-Wirt):** ein Attribut `water-form` (observedAttributes + eine Zeile im Callback).
Das ist der ganze Eingriff am Wirt.

## §2 Was das inhaltlich heißt

1. **Wasser.** Der ganze Zweig hing seit v10-S1f an `nah` (`zoomEff()/dpr ≥ 0,7`) — bei dpr 2 ist
   die Standardansicht 0,5, es wurde also **nie** gezeichnet. Sperre raus, Aliasing dort behandelt,
   wo es entsteht (Kachelmaßstab hat eine Untergrenze: ein Quellpixel nie unter 0,6 Gerätepixel).
   **Stand heute: das Glitzern steht auf `aus`** — die Fluid-Schicht des Waber-Shaders zeichnet
   wieder allein; Gerüst und Formfamilien bleiben über `waterForm` erreichbar. Georg recherchiert
   Referenzen für Cartoon-Wasser; bis dahin ist das kein offener Defekt, sondern eine Parkposition.
2. **Statblatt.** Der Unit-Frame-Umbau (Werte IM Balken) hat gemessen funktioniert (168/168/168 px,
   Überlauf 0) und ist **trotzdem zurückgenommen**: eine gute Anordnung wegen eines Platzproblems
   zu ersetzen tauscht eine Stärke gegen eine Zahl. Geblieben sind die Einzelfixes.
3. **Kamera.** Zeitgesteuertes Überblenden auf die Blattmitte plus Dämpfung waren zwei
   geschachtelte Glättungen (»springt/schwimmt«). Jetzt eine **geometrische Klammer**, die das Blatt
   im Bild hält. Und: das Blatt schaltet das HUD **nicht** mehr auf `minimal`.
4. **Spielstand.** Wer die Einheitenwahl nicht speichert, macht 30 unterscheidbare Einheiten für
   genau eine Sitzung unterscheidbar. Schema 2.4.0 ist additiv, alte Stände lesen sich als `null`.

## §3 Nähte 67–104 (Kurzform, Belege in `HOUSEKEEPING.md` §4v/§4y)

67 eine Schicht, die zugedeckt wird, ist keine Schicht · 68 weiß ist keine Farbe des Körpers ·
69 kachelbar und inkommensurabel schließen sich nicht aus · 70 eine Neigung, die niemand führt,
wandert · **71 eine Schranke ist keine Verteilung** · **72 ein Slice, der nur im Boot-Log abgenommen
wird, ist nicht abgenommen** · **73 eine Sperre gegen ein Bildfehler-Risiko ist auch ein
Ausschalter** · 74 `document.activeElement` hört an der Schattengrenze auf · 75 ein Dreieck von
9×6 px ist kein Ziel · 76 eine feste Zahl kann nicht ausweichen · 77 Selbstkorrektur (Logbuch-Hover
lebt) · **78 siebter Backtick-Treffer im CSS-Literal — Rail-Abnahme ist die Zeile
`[rail-v9b] Kartenspalte steht`, nicht das Boot-Log** · 79 der Betrag eines Gradientenfeldes ist ein
Höhenzug · 80 ab da war es eine Bildentscheidung · 81 eine Vorzugsrichtung ist kein Cord ·
82 zwei Bewegungen, die sich widersprechen, liest man als Ruckeln · 83 wo das mentale Modell fehlt,
gehört kein Entwurf hin · 84 wer eine Kamera an eine Uhr hängt, hat eine Kamera, die sich selbst
bewegt · 85 ein Moduswechsel ohne Auslöser liest sich als Defekt · 86 Requisiten dürfen überlappen,
Einheiten nicht · 87 ein Element, das nur wegen seiner Stabilität irgendwo sitzt, bezahlt die
anderen dafür · 88 achter Backtick-Treffer · 89 ein Layout über Budget sieht kaputt aus ·
90 Werte IM Balken lösen es strukturell · 91 eine Mindestbreite am flexiblen Stück ist eine
Überlaufgarantie · **92 »Papier ist Papier, kein Glas« — zum ZWEITEN Mal; eine Regel, die nicht bei
ihrem Gegenstand steht, überlebt dessen nächsten Umbau nicht** · 93 wer eine gute Anordnung wegen
eines Platzproblems ersetzt, tauscht eine Stärke gegen eine Zahl · 94 ein Spielstand, der die Wahl
nicht kennt, macht die Wahl zur Dekoration · 95 zwei Kennungen für dieselbe Einheit ·
**101 ein Plan, der drei Forks alt ist, wird stillschweigend zur zweiten Wahrheit** ·
**102 zwei ungesendete Runden übereinander** · 103 der Pixelbäcker liegt fertig, aber ohne Empfänger ·
**104 Pirate Bomb ist ein drittes Blattformat** (ein Bild je Frame im Ordner, nicht `rowsheet`,
nicht `strips`).

## §4 Masterplan-Patch — einsetzbarer Textblock

Der Masterplan trägt seit heute **eine Zeile Vermerk** am Kopf (»liegt hinter dem Code«, Georgs
Entscheidung 12.8.). Eingearbeitet wird bei WS1. Was hineingehört, Abschnitt für Abschnitt:

**4.1 Welt** · `LÄUFT` **Wasser als Körperfarbe**: eine Streufarbe je Fluid-Körper (Säure-See = ein
Giftgrün), Gradient statt Höhenfeld, inkommensurable Wellen, RMS-Neigung ~4° als geführte Zahl
(`OW_WATER.probe()`). Glitzern steht auf `aus`, `waterForm` (kleckse · striche · schlieren) ist der
Schalter; Referenzen offen (Georg).

**4.2b Kante** · `ENTSCHIEDEN` 11.8. **Ink-Outline als System:** *Stärke trägt, Farbe bestätigt.*
Outline-Farbe **abgeleitet**, nie gewählt (`inkOf(terrainfarbe)`); schwarz+dick = Sperre,
farbig+dünner = passierbar; das Gummiband reagiert **nur** auf Schwarz; eine schwarze Linie wird
**nie unterbrochen, nur überdeckt** (die Holzbrücke ist die Tür). Noch nicht gebaut.
· `LÄUFT` **Fluff-Leiste:** die v11-Box bleibt (93) — der Punkt »WS0 liefert TS-Balken« ist damit
erledigt, nicht offen. · `LÄUFT` **Papier ist Papier, kein Glas** (92): Statblatt-Deckkraft 1,
rgb(226,215,192); die Regel steht jetzt im selben Block wie das Layout.

**4.3 Kampf** · `LÄUFT` **30 spielbare Einheiten, nicht 31** (gemessen `roster().length`); die 31 im
Dateikopf zählt Katalogeinträge. · `LÄUFT` **Tempo aus dem Körper** `(bodyH/91)^0,3`, gedeckelt
205…305 px/s · **Rempler** für die zwei ohne Angriffsblatt · `shots.js` mit **einer** Wurfweite 260
für Held und Gegner · `reach.js`: Reichweite aus beiden Körpern.
· `LÄUFT` **`aufBlatt()`** — Requisiten dürfen überlappen, Einheiten nicht (42 Mobs / 0 auf dem
Blatt).

**4.4 Fortschritt** · `LÄUFT` **Journey-Schema 2.4.0**: `hero.unit`, Katalogschlüssel ohne
`hero_`-Präfix, alte Stände `null`. Abnahme: Held `hero_gnoll` → Save `unit:"gnoll"`, geschrieben
und zurückgelesen gleich.

**4.5 Darstellung** · `LÄUFT` **Kamera-Klammer** (geometrisch, nicht zeitgesteuert); das Blatt
schaltet das HUD nicht mehr auf `minimal`.

**§8 Offene Fragen** · »Rickroll in der Tutorial-Welt« ist am 9.8. beantwortet (Welt ja, Runde nein)
und kann raus.

## §5 Abnahme dieses Stands (v13, echter Bedienweg)

Module **39/39**, keine Fehlerzeile · `[rail-v9b] Kartenspalte steht` · Roster-Fußzeile
`30 gemessen · 28 mit Hieb · 2 Rempler · 5 mit Wurf · 23 mit Porträt` · `[water]`-Zeile vorhanden,
Glitzern aus · Save trägt `hero.unit` · Statblatt-Papier voll deckend.
**Im gedrosselten Vorschaufenster kommt kein Bild** (Naht 66/72) — gemessen wird über Zustand und
Konsole.

## §5b Eine Bitte an den Kanon-Eigentümer (neu, 12.8. abends)

**Der Kanon v2 hat keine gestrichelte Variante.** Gemessen am geladenen Modul: `inkRibbon2D`,
`inkHalfWidth`, `measureInk`, Presets `card · chip · academy-2026-07 · sky-2026-07` — **kein
`dashedPathD`, kein Preset `card-dash`.** Genau die beiden ruft `bubble-ts.js` seit v10-S15 für das
**Flüstern** auf; der Aufruf lieferte immer `''`, die Blase wurde mit `stroke-width 0` gezeichnet,
und das Flüstern hatte deshalb **nie** eine Kante (sichtbar war nur der Schlagschatten).

Wir haben **keinen** zweiten Federzeichner gebaut — K5 sagt: eine Feder, ein Ort. Stattdessen läuft
ein benannter Platzhalter (gestrichelter Strich, einmalige Konsolenzeile).

Zwei Dinge gehören dazu entschieden, und beide gehören WS1:
1. **Eine gestrichelte Variante im Kanon** — als benanntes Preset desselben Kanons (K5-Wortlaut:
   »verschiedene Absichten sind benannte, gemessene Presets desselben Kanons«).
2. **Ausgabeform.** `inkRibbon2D` zeichnet auf einen **Canvas**-Kontext; das Blasen-Overlay ist
   DOM/SVG. Also entweder eine Canvas-Ebene im Overlay oder eine SVG-Ausgabe im Kanon. Wir setzen
   das nicht selbst — eine zweite Ausgabeform ist eine Kanon-Entscheidung.

## §6 Was WS1 von uns als Nächstes bekommt

Runde 1 ist der **Bubble/ChatterBox-Slice** (C1–C5, Sprint-Blatt §5): Layoutmodell gegen zwölf
**ausgerechnete** Fixtures, fünf Blasenformen, Ablage über dem Kopf samt Level-Etikett, Emanata,
ein Ton je Zeichen. Runde 2 ist **Pirate Bomb** (CC0, 20 fps): zu Streifen gebacken und als
`strips` eingehängt, zwei Richtungen, HERO_REF-normiert (`×1,54` beim Bald Pirate).
Der Runner-Eingriff dafür wird hier beantragt, bevor er gebaut wird.
