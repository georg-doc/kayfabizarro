# KFB Overworld — Living Masterplan

**Stand:** 2026-08-09 · v10-S2d · **Lead:** dieser Workspace
**Arbeitsstand:** `KFB Overworld v9.dc.html` · **Check-in:** `export/overworld-v10-S2_2026-08-09/`

> **Was dieses Dokument ist.** Die eine Wahrheit über das Spiel: was gilt, was entschieden ist, was
> offen ist, in welcher Reihenfolge. Es wird bei jedem Housekeeping fortgeschrieben.
> **Was es nicht ist.** Ein Ideenspeicher. Ideen leben in `docs/MASTERPLAN_konzepte_archiv.md`
> (37 Abschnitte, Georgs Konzepte 6.–8.8.) und im Zulauf `docs/LIVING_CONCEPT_overworld.md`.
> Was aus dem Zulauf **entschieden** wird, wandert hierher — mit Datum.
>
> Der HTML-Leser dazu ist `KFB Overworld Masterplan.dc.html`; er zeigt diese Datei an und hat keine
> eigenen Inhalte. **Eine Zahl, ein Ort** gilt auch für Dokumente.

**Status-Vokabular:** `GILT` (gebaut und gemessen) · `ENTSCHIEDEN` (Beschluss steht, nicht gebaut) ·
`OFFEN` (braucht eine Entscheidung) · `GEPARKT` (bewusst später) · `VERWORFEN` (mit Begründung).

---

## 1 · North Star

**Die Welt ist das Heft.** Ein Comic wird zerschnitten, und die Schnipsel werden zu Orten. Man läuft
über eine Insel, die aus Seiten besteht; jede Kartenzone ist ein Blatt, das verdeckt im Gras liegt,
bis man es sich verdient. Niemand gewinnt — man sammelt Beweisstücke für eine Geschichte, die man
danach laut erzählt.

Daraus folgt alles Weitere: **Karten sind keine Powers, sondern Beweisstücke.** Deshalb keine
Trefferpunkte, keine Punktestände, keine Preisschilder im Bild.

## 2 · Kanon — nicht verhandelbar

| # | Regel | Warum |
|---|---|---|
| K1 | **Keine Zahlen an der Karte.** Werte gehören dem Helden; die Karte schaltet frei. | Beweisstück, nicht Ausrüstung |
| K2 | **Namen stimmen.** Uncle FrizzleBob · King Kayfabian · Kayfabulation · **BLÖDSINN!** · Puste · Witz · Schneid · *Stay fluffy.* | Marke |
| K3 | **Story-Modi englisch:** Tragic · Comic · Absurd · Heroic · Mystical · Forbidden | gesetzt |
| K4 | **Kartenformat `CARD_AR = 1.74`** — eine Zahl, ein Ort (`cardbuilder/kfb-card-format.js`) | ein Sollformat für alle Decks |
| K5 | **Die Tusche ist der Kanon** (`kfb-ink-canon.js`, `skills/SSOT_Card_Ink_Outline_v2.md`) | eine Feder für Karte, Zone, Chip |
| K6 | **UI-Sprache EN**, Eigennamen deutsch | Georg, v2 |

**Und darüber, seit 9.8.:** *»Was funktioniert und keine Folgeprobleme verursacht, schlägt Kanon.«*
Der Kanon ist ein Werkzeug gegen Beliebigkeit, keine Fußfessel.

## 3 · Hausregeln der Arbeit — zwölf, alle bezahlt

Vollständig mit Belegen in `docs/SESSION_CUT_v10_S2.md` §2. Kurzform:

1. Zeichenzeit ohne Spülung ist keine Zeichenzeit.
2. Eine Messung ohne festen Standpunkt ist keine Messung (±6 ms Rauschen → Wechselvergleich).
3. Ein defekter Prüfaufbau liefert trotzdem Zahlen.
4. Auf »läuft« gaten, nicht auf »existiert«.
5. Versionsnummern gehören dem Runner, nicht dem Modul.
6. Wer eine Sperre in ein Feld schreibt, das jemand anders leert, hat keine Sperre.
7. Wer knapp am Speicherdeckel arbeitet, sieht den Verursacher nie im Stacktrace.
8. Eine Kachel darf misslingen, die Bildschleife nicht.
9. Ein `return` zwischen `save()` und `restore()` ist ein Leck — es äußert sich nicht dort, wo es sitzt.
10. Die Nachsicht gehört dem Anker, nicht dem Klick.
11. Wer eine Haltung setzt, räumt sie auch weg.
12. Wer einen Wert anhebt, muss das tun, bevor jemand ihn liest.

Dazu die Arbeitsweise: **ein Slice pro Runde** · **messen statt behaupten** · **über den echten
Bedienweg testen** · **Changelog additiv** (ein falscher Befund wird durch einen neuen Eintrag
korrigiert, nicht überschrieben).

---

## 4 · Das Spiel — Systeme und ihr Status

### 4.1 Welt

| System | Status | Ort |
|---|---|---|
| Insel **Utopia** nach Holbein (Ring · Lagune · Einfahrt · Anydrus) | `GILT` | Runner, `layout: utopia` |
| Welt in Reisegröße 240×180 bei Zoom 1 | `GILT` | `worldSize` |
| Boden als **gebackene Textur** (13 Blätter, 512er Kachel = 8×8 Felder), Relief aus Normal/AO/Rough | `GILT` | `ground-paint.js` `relief.js` |
| Naht: **Halbversatz mit Kreuzblende**, ohne Rücklesen, je Textur einmal gebacken | `GILT` | `ground-paint.js seamless()` |
| Küstenkontur als Vektorring (4565 + 4299 Punkte) | `GILT` | `terrain-paint.js` |
| Stadt Amaurotum: 8 Bauten solide, Wegenetz per A\*, Mindestabstand 9 | `GILT` | Runner |
| **Utopia bleibt Testboden**, bis Kern + Terrain stehen | `ENTSCHIEDEN` 9.8. | — |
| Sternwelt: Schloss in der Mitte, Graveyard, Markt, sechs Straßen | `GEPARKT` | Living Concept §3 |
| **Küstenlinien** (weiße Wellenlinien) als Federstriche in der Kachel | `GEPARKT` — Georgs »coolstes Terrain-Feature«, ausdrücklich später | Backlog |

### 4.2 Kartenzone — der Kern

| System | Status | Beleg |
|---|---|---|
| Zone im **Kartenformat 18×10**, Tusche trägt 1,74 auf Feldbruchteilen | `GILT` | Feld 1,800 · Feder 1,74 |
| **Ein Kartenteller** für Reader und Kampfzone (`drawCardPlate`) | `GILT` | V10-S2b |
| Ungeräumt = **Kartenrückseite** (1872×1045), geräumt = Viertelseite, erst bei Bedarf | `GILT` | V10-S2b |
| Sieg **deckt in der Welt auf** — Rückseite zieht sich schräg zurück, 1,4 s, kein Overlay | `GILT` | V10-S2b |
| **Graben als eigener Baustein**: Strich statt Kacheln, ein Feld breit, Tor als Loch | `GILT` | 0,09 ms/Bild, `gutter-2d.js` |
| Grabenfarbe aus `OW_SHADE.PALETTES` (wasser · bubblegum · oel · saeure) | `GILT` | später am Story-Mode |
| Bewachsene Kante + Anker aus dem Prop-Blatt | `GILT` | V10-S1b |
| **Dungeon = 1 PDF-Seite (2×2 Karten)**, wellenweise geräumt; **Raid = mehrere Seiten** | `ENTSCHIEDEN` 9.8. | — |
| Fläche mit 15 Page-Zones (1 Cover/Start/Auferstehung + 14 spielbar) | `ENTSCHIEDEN` als Zielbild | — |
| Karte fliegt nach dem Sieg in den **Fractal Almanac** (unten rechts) | `OFFEN` — Animation und Haken fehlen | — |

### 4.3 Kampf

| System | Status | Beleg |
|---|---|---|
| Mob-KI: Zustände mit Verweildauer, Lenkung, Wahrnehmung mit Anlauf, Temperamente | `GILT` | `mob-ai.js` |
| Kampfgefühl: Hitstop 70–140 ms, Rückstoß als Geschwindigkeit, Squash | `GILT` | `game-feel.js` `cartoon-motion-2d.js` |
| **Wächter droht erst** (`guard`-Clip, 0,6 s) — minotaur · skull · panda · turtle | `GILT` | V10-S2d |
| **Aggro hängt an der Tuschelinie**; dieselbe Linie hebt die Leine auf | `GILT` | V10-S2d |
| **Auferstehung aus der Asche** nach 60 s, zufälliger Punkt in der Zone | `GILT` | Bodenlinie 0,9 s, 12 Flocken |
| Zweiter Kampf: XP statt Loot, Karte bleibt aufgedeckt | `GILT` | V10-S2d |
| **Unit-Etiketten**: Farbe = Haltung, Kerbe = Wächter, `Lv` weicht der Leiste | `GILT` | V10-S2c |
| Drei Wellen je Zone, dritte mit Boss | `ENTSCHIEDEN` als Zielbild, nicht gebaut | — |
| **Skelett/Graveyard = Tutorial-Zone** (`skull` hat `guard`; `pig` hat nur idle+run) | `ENTSCHIEDEN` 9.8. | nächster Slice |
| **Schwein = neutraler Übungsgegner**, schlägt erst zurück; »What's up…?« mit Herz/Totenkopf | `ENTSCHIEDEN` 9.8. | — |
| **BLÖDSINN!**-Regie: Blinken, dann wild und zackig zum Graveyard fliegen | `ENTSCHIEDEN` 9.8., nicht gebaut | — |
| Minotaur = Endboss Deck 1 · Hex Shaman = Biom-Boss | `ENTSCHIEDEN` 9.8. | — |

### 4.4 Fortschritt

Puste · Witz · Schneid nach Spec · XP-Tabelle · Level-Up mit Slots · Kayfabe Abilities mit Rarity ·
**Ruf als zweite Währung** (sechs Fraktionen) · Journey-Save aus Seeds und Fakten · Diary ·
Re-Captioning · Wirtshaus mit Hall of Fame — alle `GILT`, Details im Archiv §4/§13/§15.

### 4.5 Darstellung

| System | Status |
|---|---|
| HUD v7 »Tisch & Hand« (Papier, schwarze Blockkante, drei Fenster) | `GILT` |
| Übersicht (M): Marken + **ein** Name am Zeiger | `GILT` seit V10-S1f |
| Kontaktschatten aus dem gemessenen Idle-Frame | `GILT` |
| Zonenschatten über `cardLift` (oben links innen = Grube) | `GILT` |
| **Signatur-Shader je Terrain-Typ** — Waber in der Kachel, nie als Screen-Composite | `OFFEN` · `docs/SSOT_Waber_Shader.md` |
| Renderskala 1 · 0,75 · 0,5 | `GILT` als Notbremse, **nicht** Standard |

---

## 5 · Entscheidungs-Log

| Datum | Entscheidung | Von |
|---|---|---|
| 6.8. | Ein XP-Track mit zwei verketteten Wegen; Ruf separat; alle Karten gleichwertig | Georg |
| 6.8. | Klassen: Doctrine · Actor Form · Sinnfeld, keine Skill Trees — die gezogene Actor Card **ist** die Doctrine | Georg |
| 6.8. | Gebäude als Mini-Dungeon: Türsteher · Tunnel · gleiche Ansicht | Georg |
| 7.8. | Biome: nichts aus fremden Blättern raten, den Boden **erzeugen** | Georg |
| 7.8. | 64 × 64 bleibt | Georg |
| 8.8. | Zwei Tuschen, zwei Aufgaben: Küste gebacken, Gummi als Arena | Georg |
| 9.8. | Utopia bleibt Testboden · Skelett/Graveyard als Tutorial · Schwein neutral · Zone 18×10 · Dungeon 2×2 / Raid n Seiten | Georg |
| 9.8. | **Was funktioniert und keine Folgeprobleme verursacht, schlägt Kanon** | Georg |
| 9.8. | Lead und SSOT liegen in diesem Workspace; Masterplan als Living Doc (.md + HTML) | Georg |
| 9.8. | Arbeitsteilung WS0 = über dem Spiel, hier = das Spiel; Sync in eine Richtung je Runde | vereinbart |

---

## 6 · Arbeitsteilung und Sync

**Hier (Lead):** Welt, Terrain, Graben, Card Zones, Kampf, Wächter, KI, Regie — plus Masterplan,
Kanon, Entscheidungen.
**WS0:** alles über dem Spiel — HUD, Fenster, Rail, Roster, Almanach, Avatare, Kataloge, Sprite-Messplatz.

**Der Vertrag, nicht die Absprache.** Der Runner stellt eine benannte Oberfläche (`game.rail`,
`game.hero`, `game.zones`, `game.hudSpendPoint` …). Was dort steht, darf UI lesen und rufen; was
nicht dort steht, ist intern. WS0s eigene Regel gilt in beide Richtungen: **kein Eingriff im Runner,
anhängen statt hineinschreiben.**

**Geteilte Dateien tragen einen Fork-Stempel** im Kopf (aus welchem Export sie stammen). Dann sieht
man Divergenz beim Lesen statt beim Debuggen. `units-catalog.js` gehört WS0 — sie messen die Blätter.

**Sync in eine Richtung je Runde.** Eine Runde = ein Export, ein Empfänger, eine Abnahme mit Zahlen.
Wer empfängt, baut nach; wer sendet, ändert in der Zeit nichts Geteiltes.
**Nächster Sync (beschlossen 9.8.):** Masterplan hier → Komplett-Export mit Masterplan und Onboarding
→ frischer Chat in WS0 auf dieser Grundlage. Der alte v9-B-Stand drüben wird ersetzt, nicht analysiert.

---

## 7 · Reihenfolge — was als Nächstes gebaut wird

1. **Living Masterplan** (dieses Dokument + Leser) — `GILT` ab 9.8.
2. **Komplett-Export für WS0** — Code, Masterplan, Onboarding, Review.
3. **BLÖDSINN!-Regie** — Blinken, zackiger Flug zum Graveyard. Kleiner Slice, große Wirkung, macht
   den Tod zu einem Ereignis statt zu einem Menü.
4. **Skelett/Graveyard als Tutorial-Zone** — die **ganze Runde** an einem Ort: Rückseite liegt →
   Wächter patrouilliert → Kampf → Sieg → Aufdecken → Almanach. Diese eine Runde übt Card Zone,
   Guard, Reveal, Almanac und POP gleichzeitig; Dungeon und Raid sind danach dieselbe Grammatik,
   nur wiederholt.
5. **Signatur-Shader je Terrain-Typ** — `docs/SSOT_Waber_Shader.md`, Faltung in `OW_SHADE`.
6. **WS0-HUD einbauen** — Reihenfolge in `docs/REVIEW_WS0_hud-v9b.md` §5.
7. **Küstenlinien** — als Federstriche, in der Kachel gebacken.

## 8 · Offene Fragen an Georg

- **Fractal Almanac:** wie kommt die Karte hinein — Flug im Bild, oder Einzug am Rand?
- **Wellen:** drei je Zone ist Zielbild — gilt das schon für die Tutorial-Zone, oder erst ab Dungeon?
- **Preise:** WS0 schlägt `SLOT_COST` und `TRAIN_COST` vor. Kosten in Zahlen sind der Anfang eines
  Punktestands (K1). Soll das Spiel Preise haben?

## 9 · Risiken

**Zwei Wahrheiten** ist die teuerste Klasse — sie hat diese Nacht viermal zugeschlagen (Kartenkunst,
Zonen-Banner, Sperre in `blocked`, Haltung in `alert`). Jede geteilte Zahl braucht einen Ort.
**Fork-Divergenz** zwischen den Workspaces (§6 ist die Antwort).
**Ideeninflation:** das Living Concept hat 68 Abschnitte, fast alles WORKING MODEL. Die Gefahr ist
nicht Ideenmangel, sondern dass nichts eine senkrechte Scheibe erzwingt — deshalb steht Punkt 4 der
Reihenfolge da, wo er steht.

---

## 10 · Karte der Dokumente

| Datei | Rolle |
|---|---|
| **`docs/MASTERPLAN_overworld.md`** | dieses Blatt — die Wahrheit |
| `KFB Overworld Masterplan.dc.html` | der Leser, zeigt dieses Blatt an |
| `docs/SESSION_CUT_v10_S2.md` | Schnitt 9.8.: Slices, zwölf Hausregeln mit Belegen |
| `docs/ONBOARDING_v10_overworld.md` | Einstieg in den Arbeitsstand, Backlog-Notizen |
| `docs/CHANGELOG_overworld.md` | additiv, neuester Eintrag oben, jede Änderung mit Zahl |
| `docs/MASTERPLAN_konzepte_archiv.md` | **die 37 Konzeptabschnitte** 6.–8.8. — Ideenreservoir |
| `docs/LIVING_CONCEPT_overworld.md` | Ideenzulauf (Georg + ChatGPT) |
| `docs/SSOT_Waber_Shader.md` | Herkunft, Pfade und Zahlen der Waber-Shader |
| `docs/REVIEW_WS0_hud-v9b.md` | Bewertung des WS0-HUD-Exports + Einbauplan |
| `skills/SSOT_Card_Ink_Outline_v2.md` | Tusche-Kanon |
| `skills/SSOT_TinySwords_Tilemap.md` | Tilemap-Regeln |
