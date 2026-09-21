# KFB Overworld — Living Masterplan

**Stand:** 2026-08-09 · **v10 (Fork)** · **Lead:** dieser Workspace (WS1)
**Arbeitsstand:** `KFB Overworld v10.dc.html` · Runner `overworld/overworld-game-v10.js`
**Vorgänger eingefroren:** `KFB Overworld v9.dc.html` (Stand V10-S2d) · Check-in
`export/overworld-v10-S2_2026-08-09/`

> **Was dieses Dokument ist.** Die eine Wahrheit über das Spiel: was gilt, was entschieden ist, was
> offen ist, in welcher Reihenfolge. Es wird bei jedem Housekeeping fortgeschrieben.
> **Was es nicht ist.** Ein Ideenspeicher. Ideen leben in `docs/MASTERPLAN_konzepte_archiv.md`
> (37 Abschnitte, Georgs Konzepte 6.–8.8.) und im Zulauf `docs/LIVING_CONCEPT_overworld.md`.
> Was aus dem Zulauf **entschieden** wird, wandert hierher — mit Datum.
>
> **Eigentum:** Der Masterplan gehört WS1. WS0 und der Coworker liefern Patches, Briefings und
> Feedback; eingearbeitet wird hier, additiv, mit Datum. Es gibt keinen zweiten Masterplan.
>
> Der HTML-Leser dazu ist `KFB Overworld Masterplan.dc.html`; er zeigt diese Datei an und hat keine
> eigenen Inhalte. **Eine Zahl, ein Ort** gilt auch für Dokumente.

**Status-Vokabular** (seit 9.8., »GILT« ist raus — es wurde als »fertig und abgenommen« gelesen):

| Status | Bedeutung |
|---|---|
| `LÄUFT` | gebaut **und** über den echten Bedienweg abgenommen — **mit Beleg** (Slice-Nummer oder Zahl) |
| `GEBAUT` | existiert im Code, noch keine Abnahme über eine echte Runde |
| `ENTSCHIEDEN` | Beschluss steht, nicht gebaut |
| `OFFEN` | braucht eine Entscheidung |
| `GEPARKT` | bewusst später |
| `VERWORFEN` | mit Begründung |

Ohne Beleg ist es **GEBAUT**. Das ist keine Kosmetik: Hausregel 4 (»auf läuft gaten, nicht auf
existiert«) hat in diesem Projekt schon zweimal Geld gekostet.

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
| K1 | **Keine Zahl, mit der das Spiel wirklich rechnet.** Werte gehören dem Helden; die Karte schaltet frei. Eine Zahl darf im Bild stehen, wenn sie **die Behauptung selbst** ist (Kayfabe-Power, Prahlerei, Preisschild). | Beweisstück, nicht Ausrüstung |
| K2 | **Namen stimmen.** Uncle FrizzleBob · King Kayfabian · Kayfabulation · **BLÖDSINN!** · *Stay fluffy.* | Marke |
| K3 | **Story-Modi englisch:** Tragic · Comic · Absurd · Heroic · Mystical · Forbidden | gesetzt |
| K4 | **Kartenformat `CARD_AR = 1.74`** — eine Zahl, ein Ort (`cardbuilder/kfb-card-format.js`) | ein Sollformat für alle Decks |
| K5 | **Es gibt EINE KFB-Ink** (`kfb-ink-canon.js`) | siehe unten |
| K6 | **UI-Sprache EN**, Eigennamen deutsch | Georg, v2 |
| K7 | **Ein Wort darf zwei Ebenen haben, wenn beide benannt sind.** `Kayfabe` ist im Spiel der **Wert**; »kayfabe« bleibt intern der **Realitätsrahmen**. Allgemein: **ID = Implementierung · Label = Kanon · Short = Darstellung** — ein String macht nicht drei Jobs. | Georg, 10.8. — siehe §2.1 |
| K8 | **Eine Begriffstabelle: `docs/GLOSSAR_KFB.md`.** Drei Spalten plus **Quelle je Zeile**. Wer einen Begriff ändert, ändert ihn dort und nirgends sonst; unbelegte Zeilen tragen `NEEDS_SOURCE` und gelten nicht. | Georg, 10.8. |

**K1 geschärft (10.8., nach ChatGPT-Intake):** Wir hatten K1 zu grob zitiert und `+12% DESTROY
EVERYTHING` als Verstoß gelesen. Falsch — das ist **Kayfabe-Power**: die Zahl ist der Witz über
Power-Player, nicht eine Größe, mit der das Spiel rechnet. Derselbe Mechanismus wie Card Power im
physischen Spiel.

> **Prüffrage: Rechnet das Spiel damit, oder prahlt jemand damit?**

Verboten bleiben Trefferpunkte, Schadenszahlen und Punktestände **als Wahrheit**. Erlaubt ist jede
Zahl als Beweisstück einer Behauptung — und **Preisschilder** (WS0-Befund 10.8.: *ein Automat ohne
Preisschild ist ein Glücksspiel*). Konsequenz: **Effective Power** (Living Concept §55) ist damit
sauber begründet — die unsichtbare Rechengröße gegen die sichtbare Prahlerei.

**K5 im Wortlaut (9.8.):** Aus diesem *einen* Kanon kommen **alle** KFB-gezeichneten Outlines —
Karte, Chip, Terrain/Küste — und später **benannte Stil-Varianten** wie »bend« oder »torn«.
Verschiedene Absichten sind **benannte, gemessene Presets desselben Kanons**, nicht mehrere
Ink-Systeme. Wer eine Outline zeichnet, importiert diese eine Datei — kein Nachbau, keine zweite
Feder. »bend« und »torn« sind gewollte künftige Stile, kein Fehler; `measureInk` unterscheidet sie.
Referenz: `skills/SSOT_Card_Ink_Outline_v2.md` · `EMBED_KFB_CardBuilder_Ink_FULL.md` §10.

### 2.1 · A1-Auflösung — Begriffstabelle (10.8.)

Georgs Entscheidung, angenommen und hier Kanon:

| Ebene | `Kayfabe` bedeutet |
|---|---|
| **Player-facing** (Welt, HUD, UI, Karten, Chatter) | der **Wert**. `Kayfabe +3`, `Kayfabe Rank`, `Low Kayfabe` sind normale Spieltexte |
| **Intern** (Konzept, Masterplan-Prosa, Chat) | der **Realitätsrahmen** von KFB |

Die zweite Bedeutung wird ausdrücklich **nicht** abgeschafft. Sie ist der nützlichste Operator, den
wir gegen unsere eigene Bremse haben: auf »aber der Kanon sagt XYZ« ist *»das ist kayfabe«* die
kürzeste wahre Antwort — die Aussage ist in ihrem Rahmen richtig und deswegen noch keine
Systemgrenze. Eine künstliche Umbenennung hätte den Operator gekostet und den Konflikt nur verlegt.

**Zwei Befunde aus der Prüfung gegen den Runner (Lead, 10.8. — nachgezählt, nicht behauptet):**

**1 · `K-Fabe` existiert in unserem Kanon nicht.** Kein Treffer in `docs/MASTERPLAN_overworld.md`,
keiner im Runner. Der Begriff steht ausschließlich in Living Concept §16 (»K-Fabe = magic/ranged«) —
einer Mapping-Tabelle, die älter ist als die sechs Werte aus V10-S6. Es gibt also nichts umzubenennen:
die Zeile ist zu **streichen**, nicht zu entscheiden. Der Wert heißt `Kayfabe`; eine Angriffsart heißt
sie nicht.

**2 · Die Kurznamen kollidieren — und zwar im Code, nicht nur im Papier.**

| Quelle | Namen |
|---|---|
| Masterplan §4.4 + Runner + `hud-v7.js` | `Bingo` · `Bongo` · `Boggle`, Schlüssel `bingo/bongo/boggle` |
| Living Concept §38 · ChatterBox v12 | `KayfaBingo` · `KayfaBongo` · `KayfaBoggle` |
| Physisches Spiel (Social Calls, `kfb-table.v2.js`) | **KayfaBINGO!** · **KayfaBOGGLE?** · **KayfaBONGO!** |
| WS0 `card-rail-v9b.js` | zwei Fassungen: einmal `id:'bongo'`, einmal `id:'kayfabongo'` — **beide** mit Etikett `KayfaBongo` |

Die letzte Zeile ist ein Integrationsfehler, kein Wortstreit: greift das Rail mit `kayfabongo` in
`popSpend('stat',key)`, findet der Runner den Wert nicht und der Kauf fällt still aus.

**Vorschlag Lead, dieselbe Zwei-Ebenen-Logik wie K7:** Etikett im Bild ist **KayfaBingo · KayfaBongo ·
KayfaBoggle** (das kennt der Spieler aus dem physischen Spiel als Ruf), Kennung im Code bleibt
`bingo · bongo · boggle`. Dann stimmt beides und keiner muss migrieren.

**Georgs Beschluss 10.8. — drei Ebenen, angenommen:**

| Spalte | Rolle | Beispiel |
|---|---|---|
| **ID** | Implementierung | `bongo` |
| **Label** | Kanon / player-facing | KayfaBongo |
| **Short** | kompakte Darstellung | `Bon` |

Die vollständige Tabelle steht ab jetzt in **`docs/GLOSSAR_KFB.md`** (K8) — diese Datei trägt nur
noch die Regel, nicht die Zeilen. `K-Fabe` ist gestrichen. `Bingo/Bongo/Boggle` sind **IDs**, die
Etiketten heißen **KayfaBingo/KayfaBongo/KayfaBoggle**; WS0 normalisiert das Rail auf die IDs,
der Runner migriert nichts.

**Ein Punkt bleibt offen, weil er gebaut ist (Befund Lead 10.8.):** die vorgeschlagenen Kürzel
`BNG/BGO/BGL` kollidieren mit V10-S6f — **zurückgezogen von Georg am 10.8.**, die gebauten Kürzel
bleiben. Damit stehen alle drei Ebenen und **A1 ist geschlossen**:

| ID | Label | Short |
|---|---|---|
| `bizarro` | Bizarro | `Biz` |
| `kayfabe` | Kayfabe | `Kay` |
| `bingo` | KayfaBingo | `Bin` |
| `bongo` | KayfaBongo | `Bon` |
| `boggle` | KayfaBoggle | `Bog` |
| `bloedsinn` | BLÖDSINN! | `Blö` |

**Und ein Befund, der die Label-Entscheidung beinahe gekostet hätte:** das Kürzel war
`name.slice(0,3)` im HUD — abgeleitet, nicht gesagt. Mit den kanonischen Etiketten hätte das
**Kay · Kay · Kay** geliefert (KayfaBingo, KayfaBongo, KayfaBoggle und Kayfabe beginnen gleich):
vier identische Kürzel in einem Panel mit sechs Zahlen. `short` ist deshalb jetzt ein **eigenes Feld**
in `STAT_INFO`, das HUD liest es. *Ein Etikett zu ändern, das jemand anders zerschneidet, ist keine
Textkorrektur.* `BLÖ` war dabei nie eine Kennung — die Zeichenfolge existierte in keiner Zeile Code,
die ID heißt `bloedsinn`.

**Namensraum 10.8.:** `K1`/`K2` gehören allein den Kanon-Regeln; die Schmähruf-Stufen heißen `P1`/`P2`
(Pottymouth). Der Runner führte keine der beiden Kennungen, also betrifft es nur Papiere.

**K5-Grenze (A3, 9.8.):** Die **Tiny-Swords-UI ist ein externer Kunst-Layer** mit eigener Kante —
as-is verwenden, **nie** mit der KFB-Ink neu einfassen, **nie** einen TS-Frame nachzeichnen. K5 gilt
für KFB-*gezeichnete* Outlines. Beide koexistieren.

**Und darüber, seit 9.8.:** *»Was funktioniert und keine Folgeprobleme verursacht, schlägt Kanon.«*
Der Kanon ist ein Werkzeug gegen Beliebigkeit, keine Fußfessel. **Jede solche Ausnahme wird kurz mit
Grund notiert** (Changelog oder Entscheidungs-Log) — sonst wird »es läuft« heimlich die neue Regel.

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

**Hausregel 13 (10.8., bezahlt):** *Ein Verweis über die Workspace-Grenze ist kein Vertrag, sondern
ein Versprechen.* Das WS0-Blatt wurzelte auf einem Export, der hier lag und dort nicht — beide
Sprints standen. Ein Slice, der auf einer Datei wurzelt, die der Empfänger nicht hat, ist nicht
`OPEN`, sondern `BLOCKED`; die Lieferung ist der Slice davor.

**Hausregel 14 (10.8., bezahlt):** *Eine Zahl, die man wiederholt, ohne sie erneut zu zählen, ist
eine Behauptung.* »Sechs Stellen in `hud-v7.js`« stammte aus der Zählung vom 9.8.; gezählt sind es
dreizehn.

## 4 · Das Spiel — Systeme und ihr Status

### 4.1 Welt

| System | Status | Ort / Beleg |
|---|---|---|
| Insel **Utopia** nach Holbein (Ring · Lagune · Einfahrt · Anydrus) | `LÄUFT` | Runner, `layout: utopia` |
| Welt in Reisegröße 240×180 bei Zoom 1 | `LÄUFT` | `worldSize` |
| Boden als **gebackene Textur** (13 Blätter, 512er Kachel = 8×8 Felder), Relief aus Normal/AO/Rough | `LÄUFT` | `ground-paint.js` `relief.js` |
| Naht: **Halbversatz mit Kreuzblende**, ohne Rücklesen, je Textur einmal gebacken | `LÄUFT` | V10-S1 |
| Küstenkontur als Vektorring (4565 + 4299 Punkte), Küste **gebacken** (`coastCache`) | `LÄUFT` | `terrain-paint.js` |
| Stadt Amaurotum: 8 Bauten solide, Wegenetz per A\*, Mindestabstand 9 | `LÄUFT` | V10-S1 (Zeichenzeit gemessen) |
| **1 Deck = 56 Karten = 1 Welt** (Default). Eine Welt darf **sparse** sein oder ganz ohne Karten bestehen — das Map-Modul platziert nur, was da ist | `ENTSCHIEDEN` 9.8. | WS0-Briefing E |
| **Utopia bleibt Testboden**, bis Kern + Terrain stehen | `ENTSCHIEDEN` 9.8. | — |
| Sternwelt: Schloss in der Mitte, Graveyard, Markt, sechs Straßen | `GEPARKT` | Living Concept §3 |
| **Küstenlinien** (weiße Wellenlinien) als Federstriche in der Kachel | `GEPARKT` — Georgs »coolstes Terrain-Feature«, ausdrücklich später | Backlog |

### 4.2 Kartenzone — der Kern

| System | Status | Beleg |
|---|---|---|
| Zone im **Raster 18×10**, Tusche trägt 1,74 auf Feldbruchteilen | `LÄUFT` | Feld 1,800 · Feder 1,74 · V10-S2b |
| **Ein Kartenteller** für Reader und Kampfzone (`drawCardPlate`) | `LÄUFT` | V10-S2b |
| Ungeräumt = **Kartenrückseite** (1872×1045), geräumt = Viertelseite, erst bei Bedarf | `LÄUFT` | V10-S2b |
| Sieg **deckt in der Welt auf** — Rückseite zieht sich schräg zurück, 1,4 s, kein Overlay | `LÄUFT` | V10-S2b |
| **Graben als eigener Baustein**: Strich statt Kacheln, ein Feld breit, Tor als Loch | `LÄUFT` | 0,09 ms/Bild, `gutter-2d.js` |
| Grabenfarbe aus `OW_SHADE.PALETTES` (wasser · bubblegum · oel · saeure) | `LÄUFT` | später am Story-Mode |
| Bewachsene Kante + Anker aus dem Prop-Blatt | `LÄUFT` | V10-S1b |
| **Dungeon = 1 PDF-Seite (2×2 Karten)**, wellenweise geräumt; **Raid = mehrere Seiten** | `ENTSCHIEDEN` 9.8. | — |
| Fläche mit 15 Page-Zones (1 Cover/Start/Auferstehung + 14 spielbar) | `ENTSCHIEDEN` als Zielbild | — |
| **Card-Acquisition-Screen** — WIN → Aufdecken → Blatt mit Kontext → OK → Almanach | `LÄUFT` | V10-S4, Kette gemessen |
| Die Karte betritt `collected` **erst bei OK** — daran hängt der Einflug des HUD (`hud-v7 flyIn`) | `LÄUFT` | V10-S4 |
| WS0-Haken `game.hudCardAward({card,reason,zone,done})` — wer einen eigenen Screen liefert, bekommt den Auftrag samt Rückweg | `GEBAUT` | Vertrag §6 |
| **Content-Surfaces** (Karte · Video · Demo · HTML) — siehe unten | `ENTSCHIEDEN` 9.8. | WS0-Briefing B |
| **Erste echte Card Zone nach dem Tutorial = Anti-Rules Toolkit** (`media/kfb/Anti-Rules_Toolkit - ADD web ID.pdf` + `.json`) | `ENTSCHIEDEN` 9.8. | Georg |
| Kartenraster Anti-Rules **Seite-1-Typ** gemessen: `x .0831 · y .1339 · w .8364 · h .8533 · gapX .0335 · gapY .0127`, Zelle 623×364 = **1,712** | `LÄUFT` | V10-S7, an den Rahmenlinien gemessen |
| **Die Bildunterschrift gehört zur Karte** — mit ihr 1,712 (nah an CARD_AR), ohne sie 1,99 | `LÄUFT` | V10-S7 |
| **Seite 16 = vier Kartenrückseiten** im Vollanschnitt, glatte Viertel ohne Rand | `LÄUFT` | V10-S7 |
| **Das Deck hat mehr als ein Seitenlayout** (S7 und S15 breiter, ohne Unterschrift) | `ENTSCHIEDEN` 9.8.: `byPage` **wird gelernt** — es trägt später die Skalierung und einen DocCheck-Fork (CME-Folien als PDF). Jetzt aber **KISS**: erst wenn es weh tut | Georg |
| **Falsch beschnittene Karten sind kein Verlust** — im Almanach liegt die Karte vollständig, mit Zoom und Blättern | `ENTSCHIEDEN` 9.8. | Georg |

**Format-Klarstellung (9.8., damit es keine zwei Zahlen gibt):** `18×10` ist das **Spiel-Raster**
(Feldanzahl), **keine zweite Kartenzahl**. Die Tuschekante der Karte liegt bei **1,74 innerhalb** des
Rasters; der Unterschied (Feld 1,800 vs. Karte 1,74) ist **Gras-/Terrain-Rand, nicht weiß**. Die
Karte wird **nie gestreckt**. Kein `ZONE_GRID_AR`. Merksatz: *18×10 = Felder, 1,74 = Karte,
dazwischen ist Boden.*

**Card-Acquisition-Screen (Hearthstone-Logik) — drei Anlässe, ein Ablauf:**
1. Card-Zone geräumt · 2. Quest-Finale beim König · 3. Hidden Card / Loot-Drop.
Ablauf immer gleich: **WIN-Animation → Karte groß präsentiert, mit kurzem Text/Story-Beat/Kontext
(woher, warum) → »OK« → Karte fliegt animiert oben in den Fractal Almanac.** Die Einflug-Animation
existiert bereits für die Actor-Card beim Spielstart — **dieselbe** Animation, nur mit der
Kontext-Präsentation davor. Der Unterschied zwischen den drei Anlässen ist **nur Rahmen und Copy**
(»Beweisstück gesichert« · »der König nimmt deine Geschichte an« · »im Gras gefunden«), die Mechanik
ist identisch. **Eigentum:** Screen und Almanach-Einzug = WS0; Reveal in der Welt = Lead.

**Content-Surfaces — der Kartenteller ist eine Media-Fläche:** `MediaSurface { ar, type:
card|video|three|html, src, frame }`. `CARD_AR 1.74` ist der Default; **16:9** (YouTube-Anleitung,
three.js-Demo, HTML-Embed), **9:16** und freie AR sind erlaubt. Wie bei K4 gilt: **nie strecken** —
was nicht passt, ist Terrain- oder Frame-Rand, **nie weiß**; der Rahmen (TS-9-slice-Paper *oder*
KFB-Ink-Border) wird auf die Content-AR gebaut. Geöffnet wird über `reveal-2d.js`.
**Kayfabe-Kanon:** Die Belohnungsfläche ist **nicht immer eine Karte** — ein trollender NPC
verspricht eine super-»rare« Karte, und unter dem Staub der dritten Welle liegt ein Video
(Rickroll). Der Bruch der Erwartung **ist** die Kayfabe. K1 gilt auch im Embed-Frame: keine Zahlen.
**Erster Auftritt: schon in der Tutorial-Welt** (Georg, 9.8.) — wer das Spiel lernt, lernt auch, dass
die Belohnung lügen darf. Für die Tutorial-Runde selbst bleibt die Karte die Karte; der Rickroll
liegt als **zweiter** Fund daneben.

### 4.3 Kampf

| System | Status | Beleg |
|---|---|---|
| Mob-KI: Zustände mit Verweildauer, Lenkung, Wahrnehmung mit Anlauf, Temperamente | `LÄUFT` | `mob-ai.js`, V4-S1 |
| Kampfgefühl: Hitstop 70–140 ms, Rückstoß als Geschwindigkeit, Squash | `LÄUFT` | `game-feel.js` `cartoon-motion-2d.js` |
| **Wächter droht erst** (`guard`-Clip, 0,6 s) — minotaur · skull · panda · turtle | `LÄUFT` | V10-S2d |
| **Aggro hängt an der Tuschelinie**; dieselbe Linie hebt die Leine auf | `LÄUFT` | V10-S2d |
| **Auferstehung aus der Asche** nach 60 s, zufälliger Punkt in der Zone | `LÄUFT` | Bodenlinie 0,9 s, 12 Flocken |
| Zweiter Kampf: XP statt Loot, Karte bleibt aufgedeckt | `LÄUFT` | V10-S2d |
| **Unit-Etiketten**: Farbe = Haltung, Kerbe = Wächter, `Lv` weicht der Leiste | `LÄUFT` | V10-S2c |
| **Tutorial (Graveyard): Wächter → EIN Kampf → Reveal → Almanach.** Keine Wellen, kein Boss | `ENTSCHIEDEN` 9.8. | Patch P5 |
| **Drei Wellen erst ab normaler Card Zone** (Welle 1 → Welle 2 → Boss) | `ENTSCHIEDEN` 9.8. | Patch P5 |
| **Skelett/Graveyard = Tutorial-Zone** (`skull` hat `guard`; `pig` hat nur idle+run) | `ENTSCHIEDEN` 9.8. | nächster Slice |
| **Schwein = neutraler Übungsgegner**, schlägt erst zurück; »What's up…?« mit Herz/Totenkopf | `ENTSCHIEDEN` 9.8. | — |
| **BLÖDSINN!-Regie**: Blinken (0,6 s) → zackiger Flug (1,15 s) → Landung mit Staub (0,4 s). Kein Teleport, kein Overlay | `LÄUFT` | V10-S5, Landung auf dem Respawn-Punkt (Abstand 0 px) |
| Minotaur = Endboss Deck 1 · Hex Shaman = Biom-Boss | `ENTSCHIEDEN` 9.8. | — |
| **Tutorial-Besetzung**: ein `skull` am Tor (34 HP), ein `pig` als Übungsgegner, sonst niemand | `LÄUFT` | V10-S3a |
| **Die Tutorial-Runde ist ganz**: Wächter fällt → Zone geräumt → Aufdecken → Übergabe → OK → Almanach | `LÄUFT` | V10-S4, `collected` 0→1, Einflug beobachtet |

### 4.4 Fortschritt

**Das Modell (Georg, 9.8.) — ersetzt den alten Stand »Puste · Witz · Schneid + XP-Tabelle + Level«:**

| System | Status |
|---|---|
| **Sechs Werte (Profil):** Bizarro · Kayfabe · Bingo · Bongo · Boggle · **BLÖDSINN!** | `LÄUFT` V10-S6 |
| **Fluff = Lebenspunkte**, abgeleitet: `4 + Summe/3`. Niemand speichert sie — `fluffOf()` rechnet, `stats.fluff` ist ein nicht-aufzählbarer **Getter** | `LÄUFT` V10-S6 (Start 6 · nach zwei Käufen 7 · maxhp 120 → 140) |
| **POP = Fortschritts-Währung**, kein Level-Up-Blatt, keine Unterbrechung | `LÄUFT` V10-S6 |
| **Kein sichtbares Spieler-Level** — die eigene Anzeige zeigt Fluff und POP | `LÄUFT` V10-S6 |
| **Preisliste** (Vorschlag Lead 9.8.): Wert anheben `4 + 2 × aktueller Wert` · Action-Slot 2 = **15** · Slot 3 = **40** POP | `ENTSCHIEDEN` 9.8. — Georg hat um Zahlen gebeten, dies sind sie |
| **Alte Spielstände migrieren**: erspielter Fluff wird Bingo/Bongo, Level und XP werden POP | `LÄUFT` V10-S6 (lv 2 → 19 POP) |
| **Ruf = zweite Währung (Fraktionen) = »Ruhm«**, getrennt von POP | `LÄUFT` (`factions.js`) |
| **Action Cards** = gefunden / gelootet / erobert, getrennt vom Story-Deck im Almanach | `ENTSCHIEDEN` 9.8. |
| **Action Slots werden mit POP gekauft** — `popSpend('slot')`, Menü-Transaktion | `LÄUFT` V10-S6 |
| Vertrag nach außen: `game.popCost(kind,key)` · `game.popSpend(kind,key)` · `game.spendSkillPoint(k)` + `hero.skillPoints` als Brücke fürs v7-HUD | `LÄUFT` V10-S6b |
| **Bedienweg: das POP-Blatt auf Taste `P`** — sechs Werte, ein Slot, Preise daneben; gehört dem Runner, bis WS0 POP anzeigt | `LÄUFT` V10-S6b (über Tastendruck und Klick abgenommen: Kayfabe 2 → 3, −8 POP) |
| Kein Spieler-Level **auch im Bild**: die Level-Zeile des v7-HUD ist per Shadow-Regel verborgen | `LÄUFT` V10-S6b |
| Journey-Save aus Seeds und Fakten · Diary · Re-Captioning · Wirtshaus / Hall of Fame | `GEBAUT` — bis zur Abnahme im echten Durchlauf |
| Puste · Witz · Schneid · XP-Tabelle · Level-Up-Slots (v2) | `VERWORFEN` und **aus dem Code entfernt** (V10-S6); `levelUp()` steht einen Fork lang als warnende Hülle |

**K1-Verträglichkeit:** POP kauft Slots **im Menü**. Welt und Karten bleiben zahlenfrei — »keine
Preisschilder *im Bild*« ist gewahrt.

### 4.4b Plauderei — die Insel redet

Living Concept **§59** (RSS-Plauder-Seed) ist ab 9.8. Kanon-Kandidat und als **Anschluss** gebaut,
nicht als Leitung. Die Kette: **Quelle → Ton der Fraktion → Laune → kurzer Satz.**

| System | Status | Beleg |
|---|---|---|
| `overworld/chatter-2d.js` (`OW_CHATTER`, chatter-v1) — vier Quellen: Feed · Karte · Fraktions-Ton · Fluch | `GEBAUT` | V10-S3b |
| Plauderei ist **Satz und Antwort**: der Angesprochene antwortet 0,9–1,6 s später | `GEBAUT` | V10-S3b |
| **Pottymouth**: wer getroffen wird, flucht — einmal je Treffer-Serie, als Zeichenfolge | `GEBAUT` | V10-S3b |
| Schrift **»PottyMouth BB«** (Blambot, gekauft) — bildet **Buchstaben auf Fluchzeichen** ab, ist also **keine Textschrift**: sie bekommt nur die Flüche | `GEBAUT` | V10-S3b |
| Live-Lizenz der Schrift | `OFFEN` — Georg klärt; intern läuft sie, ohne sie fällt der Fluch auf `#$@!` zurück | — |
| **RSS-Feed als Quelle** (`OW_CHATTER.setFeed(zone|fraktion, zeilen)`) — Schnittstelle steht, **es fehlt die Leitung** (Browser liest kein fremdes RSS ohne Proxy) | `OFFEN` | §59 |
| Emote-Satz (`OW_CHATTER.EMOTE`, zehn Bedeutungen) als **semantische Vorlage** für ein späteres PNG-Set aus einem Bildmodell | `ENTSCHIEDEN` 9.8. | Georg |
| Regler `chatter` (on/off) und `bubbleFont` (potty/mono) | `GEBAUT` | Tweaks im DC |
| **Ein Emote je Blase**, nicht drei — ein Zeichen groß gesetzt ist der Ausruf | `GEBAUT` 9.8. | V10-S3b |
| **Zeichenschlüssel** der Schrift abgelesen und benannt (18 Zeichen: Totenkopf · Blitz · Wirbel · Grab · Axt …), Leser `KFB Pottymouth Key.dc.html` | `LÄUFT` | V10-S3b |
| **Blasen-Look = Pet-Studio-v4-System** (DOM/SVG-Overlay, jittriges Rechteck, getaperter Pfeil, Anker an der größten Body-Schale, Totzone + Trägheit, **immer nur EINE Blase**) — **Reuse, kein Neubau** | `ENTSCHIEDEN` 9.8. | `uploads/HANDOVER_Sprechblasen-System_ausPetStudioV4_fuerWS1.md` |
| Die Blase hat ihre **eigene** Ink (jittrige Gerade), **nicht** die Karten-Feder. Ob das später auf K5 vereinheitlicht wird, ist eine getrennte Lead-Entscheidung | `ENTSCHIEDEN` 9.8. | dito §6 |
| Heutige Blase im Overworld ist **Canvas**, das Pet-System ist **DOM/SVG** — Portierung ist ein eigener Slice | `OFFEN` | nächster Kandidat |

**Regel dazu:** die Schlagzeile ist **Rohstoff, kein Zitat** (§59: *fuel, not canon*) — sie wird auf
ein Bruchstück gekürzt und einer Figur in den Mund gelegt, die davon nichts versteht.

### 4.4c Audio — eine Ausdrucksebene, kein zweites System

Der SFX-Stand (`sfx.json` → `audio-2d.js` → diskrete Ereignisse) ist die **erste Scheibe** einer
breiteren, **seed-getriebenen Audio-Ausdrucksebene**. Die Kette ist dieselbe wie bei der Plauderei:
**Karte/Seite/Zone/Deck → Audio-Seed → Manifest → Wiedergabe.**

| System | Status | Anmerkung |
|---|---|---|
| **Eine Audio-Wahrheit** (`media/3D_Assets/Audio/sfx.json`) — auch für Soundscape, Drone, Musik | `ENTSCHIEDEN` 9.8. | kein zweites Manifest, nie |
| **Lulls sind Absicht**: nur diskrete Commits klingen | `ENTSCHIEDEN` 9.8. | gilt weiter, auch für Chatter |
| **Fraktale Audio-Ebene** (Karte = Signatur · Seite = Mikro-Dramaturgie · Zone = Umgebung · Deck = Musik · Welt = Ökologie) | `ENTSCHIEDEN` als Zielbild 9.8. | Konzept freigegeben, Produktion nicht |
| **Soundscape-Demonstrator** (1 Deck · 1 Seite · 1 Zone · 4 Karten · 1 Soundscape · 1 Drone · 1 Deck-Track · 2 Kartensignaturen) | `ENTSCHIEDEN` 9.8. | WS0, **nach** dem HUD-Paket |
| Howler.js als Wiedergabeschicht | `OFFEN` — erst wenn der Demonstrator zeigt, dass `audio-2d.js` nicht reicht | nicht vorab entscheiden |
| Voice/TTS · LLM-Dialog · Live-RSS · prozedurale Musik | `GEPARKT` | ausdrücklich **nicht** in der ersten Scheibe |

**Grenze, die dabei wichtig ist:** die **Chatter-Laufzeit gehört dem Lead** (sie sitzt im Spiel,
`OW_CHATTER` + `mob-ai.js`). WS0 liefert **Inhalt und Oberfläche**: Fraktions-Phrasenvorrat als
Daten, Emote-PNGs, Blasen-Darstellung, Audio-Assets. Wer den Vorrat schreibt, ändert keinen
Zustandsautomaten — und wer den Automaten ändert, tut es hier.

### 4.2b Die Kante der Kartenzone — das mentale Modell

**Karte als Panel mit bündiger Feder › Wasser (Graben) › dünnere Feder in Küstenstärke.**
Nach außen also: *Karte · Kartenfeder · Wasser · dünne Feder · Terrain.* Dazwischen liegt nichts.

| System | Status | Beleg |
|---|---|---|
| Kartenfeder **bündig** auf der Zonenkante (die Kontur war ~1,3 % eingerückt, dazwischen stand Zonenboden) | `LÄUFT` | V10-S8, gemessen 15 px bei 1152 px Blatt |
| **Das Wasser beginnt an der Kartenkante**, nicht am Feldrechteck — die 1,80 des Rasters und die 1,74 der Karte stoßen im Graben aneinander, nicht auf dem Boden | `LÄUFT` | V10-S8 |
| **Der Graben trägt außen eine Tuschelinie** in Küstenstärke (T·0,07 ≈ 4,5 px gegen ~10 px der Kartenfeder); die innere Uferlinie ist **weg** — dort liegt jetzt die Kartenfeder | `LÄUFT` | V10-S8 |
| **Einheiten dürfen die Feder überlappen, ihr Bodenschatten nicht**: der Kontaktschatten wird auf das Blatt geklippt | `LÄUFT` | V10-S8 |
| Etikett und Fluff-Leiste stehen über dem **gezeichneten Rahmen** (`anchorY`), nicht über dem Rumpf — 1 px Luft | `LÄUFT` | V10-S8, Georgs Befund |
| Fluff-Leiste als **TS-UI-Balken** (groß und klein) statt gezeichnetem Rechteck | `OFFEN` — WS0 liefert die Bauteile (Paket 2 läuft), gezeichnet wird hier | — |

### 4.4c-2 Die Welt als Spielzeug — Richtungsentscheidung 9.8.

**North-Star-Ergänzung (Georg):** die Welt soll sprechen, atmen, reagieren — *»Kayfabe Sims +
Super Bizarro Mario + Hitchhiker's Guide (= Fractal Almanac) + Monkey Island auf Acid«*. Immersion
und Points of Interest schlagen Kampftiefe.

| Entscheidung | Status |
|---|---|
| **Wellen sind eine Ausbaustufe**, kein Kernstück — normale Card Zones tragen erst mal ohne sie | `ENTSCHIEDEN` 9.8. |
| **Wegelagerer-Lager:** drei Gruppen à zwei bis drei Gegner **am Weg** (nicht darauf), 16 HP · 3 Schaden, kein Zonenfortschritt, kurze Leine (2,8 Felder) | `LÄUFT` V10-S11 — gemessen: 3 Lager · 8 Gegner · 8/8 am Wegenetz |
| Sie laden **nichts Nachschub**: die Gruppe nimmt Einheiten, die für die Zonen ohnehin im Speicher liegen | `LÄUFT` V10-S11 |
| **Mob-Gruppen und ihre Blätter** dokumentiert: fünf Gruppen, 20 Gegner, Ordner je Pack | `LÄUFT` · `docs/MOB_GRUPPEN_assets.md` |
| **Die Sprechblase ist bedienbar:** Linksklick auf eine Einheit öffnet ihre Blase mit sechs Knöpfen — attack · ask · taunt · philo · trade · leave | `LÄUFT` V10-S9 |
| Blasen-System **portiert** aus Pet Studio v4 (`overworld/bubble-ts.js`, DOM/SVG-Overlay): jittriges Rechteck, getaperter Pfeil, Scallop-Wolke, Totzone 44 px, Trägheit 0,10 | `LÄUFT` V10-S9 |
| Zwei Wege, zwei Aufgaben: **Umgebungs-Plauderei bleibt auf der Leinwand** (viele, kurz), das Overlay trägt die **eine bedienbare** Blase | `ENTSCHIEDEN` 9.8. |
| Schafe, NPCs und **Verbündete** entstehen aus demselben Weg (wer nicht angegriffen wird, kann mitkommen) | `ENTSCHIEDEN` 9.8. |
| **KFB-Level als Regler** (Ton, Härte, NSFW) über die Persona-Prompts von NPC/Mob — verwandt mit der Bloom-Taxonomie bei DocCheck | `ENTSCHIEDEN` 9.8. als Zielbild, Stufen offen |
| Reihenfolge der Bausteine: **Sprechblase → Phrasen-Pool → RSS-PoC → Prompts/LLM**, darunter Emotes und der TS-Baukasten | `ENTSCHIEDEN` 9.8. |

### 4.2c Die gestrichelte Feder — ein Preset, kein zweiter Zeichner (Entscheidung 9.8.)

**Das Ziel (Georg):** keine Aneinanderreihung einzelner Striche, sondern **eine durchgehende, leicht
unregelmäßige Linie mit Taper** und optional dezenter Lichtlogik — als direkte Outline einer Form
oder Maske.

**Der Weg, der das leistet:** die KFB-Ink ist ein **Band** entlang der Kontur (`inkRibbon2D`), kein
Strich. Eine Lücke entsteht deshalb **nicht durch Zerschneiden**, sondern indem die **Bandbreite
entlang der Länge auf null läuft und wieder aufmacht** — mit weichen Schultern. Damit hat jedes
Segment automatisch einen Anlauf und einen Auslauf (Taper), die Unregelmäßigkeit kommt aus demselben
Seed wie die Kontur, und die Lichtlogik (dicker auf der Schattenseite) gilt unverändert weiter.
`stroke-dasharray` kann das nicht: es schneidet ein fertiges Band in Stücke mit stumpfen Enden.

| Punkt | Status |
|---|---|
| **»dashed« wird ein benanntes Preset derselben Ink** (K5), neben »bend« und »torn« — kein zweites System | `ENTSCHIEDEN` 9.8. |
| Lücken über **Breitenmodulation mit weichen Schultern**, nie über `dasharray` | `ENTSCHIEDEN` 9.8. |
| Anwendungen: **Flüster-Blase** (heute noch `dasharray` in `bubble-ts.js`) · **Schnittlinien im Terrain** (surreale Blaupausen) · **Card-Seed-Glyphen** in der Zone | `ENTSCHIEDEN` 9.8. |
| **Die Schnittlinie ist ein Pfad, kein Bild** — die Schere aus der Website läuft später **denselben** Pfad ab, den die Feder zeichnet. Eine Linie, zwei Verbraucher | `ENTSCHIEDEN` 9.8. |
| **Das Preset ist vier Zahlen groß:** `strich` · `lücke` · `schulter` · `phase` | `ENTSCHIEDEN` 9.8. |
| `strich` und `lücke` als **Bruchteile der Konturlänge**, nie in Pixeln — sonst bekommt ein Chip dasselbe Muster wie eine 18-Felder-Zone | `ENTSCHIEDEN` 9.8. |
| `schulter` = Anteil des Strichs, über den die Breite auf null läuft. **Sie ist der Taper**; 0 gibt stumpfe Enden (also das, was `dasharray` kann und wir nicht wollen), ~0,35 den Federabsatz | `ENTSCHIEDEN` 9.8. |
| `phase` **aus dem Seed** — sonst beginnt jede Lücke an derselben Ecke und vier Zonen sehen gestempelt aus | `ENTSCHIEDEN` 9.8. |
| **Ecken-Sperre:** das Muster wird so gestreckt, dass Ecken immer Tusche tragen — eine Lücke auf der Ecke liest sich als kaputte Form, nicht als gestrichelt | `ENTSCHIEDEN` 9.8. |
| Scheren-Animation schneidet auf der Website noch falsch herum — einmal sauber bauen, dann überall | `OFFEN` |

### 4.3b Die gestrichelte Feder

| System | Status | Beleg |
|---|---|---|
| Kanon-Preset **`card-dash`** (Familie `band-dash`): dieselbe Kontur, Halbbreite und Schattenachse wie `card`, entlang der Lauflänge unterbrochen, Striche mit Taper an beiden Enden | `LÄUFT` V10-S15 | Bauchung 0,28 % und Feder 1,4 % **identisch** zur vollen Kante |
| Vier Kennzahlen: `dash` · `gap` · `shoulder` · `phase`, alle **relativ zu min(W,H)** · dazu `dashLight` (Farbe, nicht Breite) | `LÄUFT` V10-S15 | 44 Striche, Tintenanteil 62,5 % |
| Eine Rechnung, zwei Ausgaben: `dashedBands()` → `inkRibbonDashed2D()` (Canvas) · `dashedPathD()` (SVG) | `LÄUFT` V10-S15 | — |
| **Flüster-Blase** trägt die echte Feder statt `stroke-dasharray` | `LÄUFT` V10-S15 | 65 Teilstriche, Konturstrich 0 |
| Schnittlinien im Terrain (surreale Blueprints) · Scheren-Animation | `OFFEN` — das Preset trägt beides, es fehlt der Ort | — |

### 4.3c Blasen-Grammatik (ChatterBox S1)

| System | Status | Beleg |
|---|---|---|
| **Geometrie vor Streaming**: voller Text einmal messen, Kontur einfrieren, Text hineinlaufen lassen | `LÄUFT` V10-S18 | 308×139 stabil bei 9 → 59 Zeichen |
| Vier Typen: `speech · thought · whisper · shout` — **ein** Zeichner, vier Konturen | `LÄUFT` V10-S18/S18b | Schrei über `say(…,'shout')`: 32 Zacken, 0 Pixel des alten Rechtecks |
| **Der Schrei hat eine Uhr, die bedienbare Blase nicht** — er trägt keine Knöpfe, auf die man warten müsste | `LÄUFT` V10-S18b | nach 1,2 s von selbst weg |
| Schrei-Schrift **Bangers**; Irish Grover bleibt HUD und Karten | `ENTSCHIEDEN` 9.8. | eine Schrift, eine Bedeutung |
| **Denken hängt am Wesen**, nicht am Satz: Tiere immer, andere wenn sie niemanden ansprechen | `LÄUFT` V10-S18 | `pig → thought`, `snake → speech` |
| **Tätigkeitsgedanken** (`OW_PHRASES.TAETIGKEIT`): der Gedanke handelt von der Tätigkeit, nicht vom Plot; nur jeder dritte Zug | `LÄUFT` V10-S18 | vier Lagen à vier Sätze |
| **Zwei Blasenarten, zwei Uhren**: Ambient endet nach Lesezeit, die bedienbare endet mit dem Spieler | `GILT` | sie trägt Knöpfe |
| **Präsentationsbudget** (`darfSprechen()`): max **2 in der Welt**, **1 je Zone**, Sprechen verdrängt Denken | `LÄUFT` V10-S19 | Ruhe: max 2 über 28 Proben |
| **Eskalation ist begrenzt, nicht frei**: Fluch bis **4**, darüber nackter Pottymouth-Glyph ohne Blasenkörper (0,9 s, überlappend). Die Antwort darf den Zonendeckel überschreiten, nicht das Weltbudget | `LÄUFT` V10-S19b/c | Kampf: max 4 über 32 Proben, 0 darüber |
| **Snacks sprechen — mit der niedrigsten Prioritaet.** In einer leeren Zone wird der Pilz zum Point of Interest: Kichern → Pfeil → »Eat me.« → bei Ignorieren lauter bis »Eeeeat meee!« in Bangers. Die Eskalation haengt am **Ignorieren**, nicht an der Zeit | `ENTSCHIEDEN` 10.8., nicht gebaut | Georg |
| **Blasen sind Pull-Angebote**, keine Beschriftung — Ausnahmen sind benannt: Antwort, Fluch, eskalierender Streit, Schmährufe | `GILT` (Georg 9.8.) | — |
| **Name + Titel** (`overworld/identity.js`): Name beim Avatar, Titel als **Trophäe ohne Wert** (K1), Start »Newbie«, »kein Titel« gültig | `LÄUFT` V10-S20 | HUD zeigt »Georg · Scourge of Swine« |
| **Ruf-Schmähung**: ab Ruf **−3** schmäht die Fraktion mit Name und Titel, ab **−9** greift sie an — eine **Schwelle**, kein zweiter Automat | `LÄUFT` V10-S20 | −5 schmäht, 0 schweigt, −9 greift an |
| **Titel werden am Autosave vergeben** (`OW_IDENT.pruefe`), ins Logbuch gemeldet und **nicht automatisch getragen** — ein Titel ist eine Wahl | `LÄUFT` V10-S20b | drei Schweine → »Scourge of Swine« |
| **Der Schmähruf verdrängt**, wenn auch die Eskalationsgrenze voll ist — er nennt den Namen, kurz bevor zugeschlagen wird | `LÄUFT` V10-S20b | kommt bei 4 belegten Blasen durch |
| Fenster zum Namen-Ändern und Titel-Wählen | `OFFEN` — `setName`/`setTitel`/`besitz()` liegen bereit, Oberfläche gehört zu WS0s Heldenblatt | — |
| Timing-Feinschliff (15 CPS, Dwell, Antwortverzögerung), Wiseguy | `OFFEN` | ChatterBox S1 §6/§16 |

### 4.4b RSS als Plauder-Quelle — die Leitung liegt

| System | Status | Beleg |
|---|---|---|
| `overworld/rss-2d.js` (`OW_RSS`, rss-v1): Vermittler-Fetch, RSS **und** Atom, Quelle → Fraktion | `LÄUFT` V10-S13 | 5 von 6 Quellen geantwortet |
| **Der Vorrat ist der Normalfall**, das Netz überschreibt ihn nur bei Antwort — ein Export läuft offline und liefert dieselben Zeilen | `LÄUFT` V10-S13 | 8 Fraktionen mit festem Satz |
| Regler `rss` (Standard **off**) — die Insel wartet beim Start auf keinen fremden Server | `LÄUFT` V10-S13 | — |
| **Ground.news scheidet aus**: Artikel hinter Abo, keine öffentlichen Feeds mehr (geprüft 9.8.) | `ENTSCHIEDEN` | Quellen sind austauschbar |
| Der Browser kann RSS **nicht direkt** lesen (kein CORS) — ohne Vermittler geht es nicht | `GILT` | zwei Adressen, damit ein Ausfall nicht das Ende ist |

### 4.2c Mini-Story je Zone · Deck-Trophäen

| System | Status | Beleg |
|---|---|---|
| `overworld/zone-story.js` (`OW_STORY`): sechs Anlässe (`enter · guard · fight · win · reveal · leave`), ein Aufruf, Beats von außen | `LÄUFT` V10-S17 | 4 von 6 Beats angenommen, 2 mit Begründung verworfen |
| **Laufzeit hier, Inhalt aus der NIE** (ChatGPT + Coworker) — dieselbe Grenze wie bei der Plauderei | `ENTSCHIEDEN` 9.8. | Modul erfindet keinen Text |
| Ohne Beats ist eine Zone **still** — gültiger Zustand, kein Fehler | `GILT` | — |
| **Jedes gekaufte Deck schaltet einen Avatar-Skin frei — Trophäe, kein Skill.** Der Skin spielt im Deck bzw. seiner Welt eine Rolle (Meta-Narrativ, ggf. über die Zonen-Mini-Story) | `ENTSCHIEDEN` 9.8. — gehört in die Besitzschicht, **nicht** in `OW_STORY`: eine Story darf einen Skin erwähnen, nicht vergeben | Georg |
| Avatar-Mapping Deck → Skin | `OFFEN` — braucht die Deck-Liste und die Skin-Blätter | — |

### 4.2d Zulauf 10.8. (Georg) — Ideation, eingeordnet

| Idee | Status |
|---|---|
| **Sidescroller-Assets** (Treasure Hunters, Kings & Pigs — selber Autor wie Tiny Swords) **statt 3D**. 3D `DEFERRED`: nicht KISS | `OPEN` |
| **Die Schweine LAUFEN** (Georg 10.8., gegen meinen ersten Einwand): ein Profil-Sprite dreht sich nie — das ist kein Fehler, sondern die **Enthüllung, dass die Figur flach ist**. Papierfiguren auf Papiergras | `ENTSCHIEDEN` 10.8. |
| **Die Multiball-Szene**: Herde prallt gegen die Gummi-Ink-Kante, bouncet durch die Kartenzone, zerstäubt den roten Teppich → darunter der nackte Kaiser; der König wirbelt und entlarvt seine Flachheit **durch Physik**; die Krone kullert vor den Spieler: »Wanna be King?« | `OPEN` — nutzt Gummikante (v6-S12), Kartenzone und Cartoon-Physik, die alle liegen |
| **Grenze:** die Enthüllung funktioniert **einmal**. Läuft das Profil überall, ist es Textur statt Bruch | `GILT` |
| **Sidescroller-Tiles im Terrain** — nicht nur Figuren, auch Boden und Bauten aus der Seitenansicht. Alles in Collage- und Papierschnitt-Logik einer Spielzeugwelt, cartoonig animiert | `OPEN` 10.8. |

**Die Haltung dahinter** (Georg 10.8.), und sie erklärt, warum die Perspektiv-Brüche kein Fehler sind:

> *»Es ist so falsch, dass nicht einmal das Gegenteil wahr ist.«*
> *»Kognitive Dissonanz ist der Resonanzraum für KFB.«*

Wenn zwei Perspektiven nebeneinander liegen und keine gewinnt, entsteht die Frage, welche die wahre
ist — und genau die soll offen bleiben. Der Bruch ist nicht der Preis für die Collage, er ist ihr
Zweck.

### 4.2f Der Erzähler als Figur (Georg 10.8.)

`OPEN`. **»It was a dark and stormy Knight…«** — die Comic-Erzählerbox als Eröffnung, ein Ritter
erscheint aus dem Nebel auf einem nächtlichen Friedhof. Reinkarnation mit Amnesie: er weiß nicht,
wer er war, und das ist zugleich die Ausrede für jede Erklärung, die der Spieler braucht.

| Baustein | Status |
|---|---|
| **Erzählerbox** (eckig, oben, nicht am Sprecher) — vierte Blasenart neben speech/thought/whisper/shout, aber **ohne Anker** | `OPEN` — die einzige Blase, die niemandem gehört |
| **Nebel als Auftritt** (Fog-of-War-Baustein) | `OPEN` |
| **Der Erzähler wird eine Figur** — wie der Datumscomputer bei »Es war einmal… der Mensch«: erst Stimme, dann Gerät, dann Begleiter | `OPEN` |
| **Zeitmaschine = die Drei-Beat-Slot-Machine**, und die drei Walzen sind **MM · DD · YYYY** | `OPEN` — koppelt Erzähler, Orakel und Königswahl an **ein** Bild, und das Datum ist die dritte Bedeutung derselben drei Walzen |
| **Er erklärt Meta-Closure** statt Bedienung: Helferlein, später LLM-Chat | `OPEN` |
| **Roboterstimme, deadpan und trocken, Loriot-Logik** (Georg 10.8.) | `OPEN` — und die billigste gute Entscheidung im ganzen TTS-Thema |
| **Loriot als Humor-Referenz** für Erzähler **und** Hof-Fraktion: die Katastrophe entsteht aus **korrektem Verhalten** — Höflichkeit, Ordnung, das Beharren auf einem vernünftigen Standpunkt. Niemand ist dumm, niemand zwinkert | `GILT` — deckt sich mit »Kayfabe als Ernst«; *das Genaue ist komischer als das Große* |
| Sechs Erzähler zur Wahl (`media/prompts/narrator/`) | `DEFERRED` — **erst einer**: FrizzleBob, Carny-absurd |

**Warum das trägt:** ein Erzähler, der eine Figur wird, löst ein Problem, das jedes Tutorial hat —
*wer spricht da eigentlich?* Und die Amnesie macht aus Erklärung eine gemeinsame Suche. Die
Zeitmaschine-als-Slot-Machine ist der beste Teil: **ein Möbel, drei Bedeutungen** (Orakel,
Königswahl, Zeitsprung) statt dreier Möbel mit je einer.

**Warum die Roboterstimme richtig ist, und zwar aus einem technischen Grund:** Browser-TTS **klingt**
nach Maschine — das ist ihre bekannte Schwäche. Für jede Figur ist das ein Problem, für den
Datumscomputer ist es die **Rolle**. Der Erzähler ist damit die einzige Stimme, bei der die
Systemstimme nicht trotz, sondern **wegen** ihrer Künstlichkeit passt. Und weil er ohnehin keinen
Körper hat (siehe unten), fehlt ihm auch nichts.

**Deadpan und trocken** ist dabei nicht nur Geschmack, sondern der Grund, warum es funktioniert:
eine Maschine, die eine Katastrophe im selben Ton meldet wie ein Datum, ist komisch — eine, die
sich anstrengt, ist peinlich. *Der Witz gehört dem Satz, nicht der Betonung.* Das ist zugleich der
Grund, warum Browser-TTS hier trägt: sie **kann** gar nicht betonen.

Praktisch: tiefer Pitch (0,7–0,8), langsame Rate (0,85), **keine** Betonungszeichen und keine
Pausen-Tricks im Text, keine Stimmensuche — **die erstbeste
Systemstimme genügt**, denn eine Roboterstimme, die auf drei Rechnern verschieden klingt, klingt
immer noch nach Roboter. Das ist der eine Fall, in dem unsere Profil-Regel aus
`docs/KLAERUNG_TTS_STT.md` nicht gebraucht wird — und deshalb der beste **erste** TTS-Einsatz:
eine Stimme, ein Profil, kein Mapping.

**Die Falle:** der Erzähler ist die einzige Stimme ohne Körper — er umgeht damit das
Präsentationsbudget und die Sprecherwahl. Genau deshalb muss er **selten** sein. Wenn er kommentiert,
was man ohnehin sieht, ist er ein Untertitel; wenn er sagt, was man nicht sehen kann, ist er ein
Erzähler. *Und ein Erzähler, der erklärt, wie man spielt, ist ein Handbuch mit Stimme.*

### 4.2e2 Der »M«-View als 3D-Ebene

`OPEN`, keine Priorität (Georg 10.8.). **Der beste Ort für 3D im Overworld** — weil die Übersicht
ohnehin eine andere Ebene ist: man verlässt die Welt, um auf sie zu schauen, und ein
Perspektivwechsel kostet dort **nichts an Glaubwürdigkeit**. Anders als der 3D-Ball, der ein
3D-Objekt **in** die 2D-Welt gestellt und die Frage »wo steht etwas?« ein zweites Mal hätte
beantworten müssen.

Möglicher Zweck über »hübscher« hinaus: der **Meta-View** — Galaxie, Tesserakt, das fraktal
gedachte KFB-Universum in einer Nussschale. Dann ist der Wechsel ein **Maßstabssprung**
(Insel → Welt → Deck → Universum) statt Dekoration.

**Korrektur Georg 10.8.:** kein Schalter, sondern ein **sichtbares Wegklappen** — die Karte wird
ohnehin unter dem Viewport verschoben (beim Tod sichtbar, Überblendung fehlt → **To-do**). Der
Übergang stellt die Frage »wo steht etwas?« nicht neu, er **beantwortet sie endgültig**: die
2D-Welt ist eine Fläche, und das zu zeigen ist ehrlicher als es zu verstecken.

**Der Würfel-Kosmos:** ein Deck (56 Karten) verteilt auf **sechs Würfelseiten** = ein D6 · drei D6 =
eine borromäische Würfelwelt mit Attraktor-Physik · 3×3 Würfel = ein KFB-Cluster. Reise per
**Slingshot-Surf**: die 2D-Einheit fliegt auf einer Almanach-Karte im Partikelsog und dockt an einer
Würfelseite an (Vorlage: Travel v6, rollercoaster v11+). *Man reist auf dem, was man gesammelt hat.*
Offen: ist eine Würfelseite eine Karte oder ein Satz · was wird aus einem gespielten Würfel · wie
sieht ein ungespielter aus (Kartenrückseiten aus V10-S16 wären die Antwort). `OPEN`, ohne Priorität.

### 4.2e Skizze: die Welt als Würfel (Travel 14+, hier nur notiert)

Ausdrücklich **außerhalb** des Overworld-Scopes, festgehalten damit es nicht verlorengeht:

- 2D-Karten und Welten **auf einem D6 gedacht** — man segelt um Ecken und Kanten
- mehrere D6 ergeben eine **Strecke**, auf der fraktal auch eine Tiny-Swords-Einheit läuft
- **M.-C.-Escher-Architektur** aus Voxeln, zwischen den Würfelreihen ein surrealer Skydome
- die KFB-Kosmologie dazu: **Hohlwelt · flache Erde · hohler Mond** (aus Käse)

Anschluss vorhanden: die Sky-Dice aus Travel v11 (`sky-dice.js`) sind bereits drei senkrechte
Würfel als Gesetz des Spiels — King Kayfabian ist wörtlich der rotierende Richter. Ein D6 als
begehbare Welt ist dieselbe Idee eine Ebene weiter.
| **King Kayfabian** auf dem Zentralturm, schwebende Pixelkrone; **Propaganda-Schweine** als Jubelperser, bis sie ihn fressen | `OPEN` |
| **Nachfolge per Slot-Machine-Orakel**: dreimal dasselbe Symbol = Kayfabe-Jackpot = neuer König | `OPEN` — macht aus einem Möbel eine **Regel**, und die Regel ist selbst die Satire |
| **Sprache als Font** (Asterix-Logik): Mönch Fraktur, Schweine Versalien. Achtung: **Bangers gehört dem Schrei** — wer es sonst bekommt, ist permanent laut | `OPEN`, mit Vorbehalt |
| **Wiseguy = Hofnarr am Marktplatz** der Starterzone, Clown mit Googly Eyes; beleidigt Spieler und König | `OPEN` — der Ort macht ihn zur Institution statt zum Zufallsfund |
| **Googly-Eye-Rig mit vier Lidern** (Pet Studio v4 scannen, bevor WS0 baut) | `OPEN` — der Unterschied zwischen zwei Kreisen und einem Gesicht |
| **Meta-Sprites als Satz**: Pinsel · Schere · Bleistift · Radiergummi — jedes wirkt auf das **Medium**, nicht auf Figuren | `OPEN` |
| **Debatten-Modus**: 4–6 Blasen, drängeln statt ausweichen, mit Anfang und Ende. Der **Zensur-Mönch ist die Abbruchbedingung in Gestalt einer Figur** | `OPEN` |
| **Ink-Sauger** als Action Card — Radiergummi in Sci-Fi-Verkleidung; macht aus dem automatischen Aufdecken eine **Handlung** | `OPEN` |
| **Doc als Hampelmann** (DocCheck-Maskottchen, Googly Eyes) | `HOOK` — Gliedmaßen an Fäden ist dieselbe Physik wie Follow-Anchor |

**Die Frage bei jeder neuen Stimme** lautet nicht »was sagt sie?«, sondern **»wen bringt sie zum
Schweigen?«** — die Bühne ist auf zwei Blasen gedeckelt, jeder neue Sprecher ist eine Umverteilung.

### 4.4d Zulauf 9.8. (Georg) — noch nicht gebaut

| Idee | Status |
|---|---|
| **Viewer-Bedienung:** Zoom auf die Zeigerposition (nicht auf die Bildmitte) und freies Schieben — Maus, Rad, Touch. **Auf HUB-Ebene, ohne Einheiten-Interaktion**; Darstellung im TS-UI-Layer (Buch- bzw. Schriftrollen-Variante), gleicher Aufbau für Quest-Log und Almanach | `ENTSCHIEDEN` 9.8. |
| **Blättern als Spielhandlung:** der Held läuft gegen die Tuschekante, sie federt (»Gummi«) und blättert vor oder zurück; Klick rechts/links der Kante = Diashow, die Einheit läuft hin, blättert, prallt ab | `ENTSCHIEDEN` 9.8. — die Bedienung IST eine Figur, die etwas tut |
| **Kartenrückseiten-Varianten** (`overworld/card-backs.js`): Seite **16** ist **eine Fläche**, geschnitten mit dem Vorderseiten-Raster → vier Blätter à 623×364 (1,712). Wahl deterministisch aus dem Zonen-Seed | `LÄUFT` V10-S16 · MED vorgesehen, leer, fällt sichtbar auf KFB zurück |

### 4.5 Darstellung, Karte, Ton

| System | Status |
|---|---|
| HUD v7 »Tisch & Hand« (Papier, schwarze Blockkante, drei Fenster) | `LÄUFT` |
| Übersicht (M): Marken + **ein** Name am Zeiger | `LÄUFT` seit V10-S1f |
| Kontaktschatten aus dem gemessenen Idle-Frame · Zonenschatten über `cardLift` | `LÄUFT` |
| Renderskala 1 · 0,75 · 0,5 | `LÄUFT` als **Notbremse**, nicht Standard |
| **Signatur-Shader je Terrain-Typ** — Waber in der Kachel, nie als Screen-Composite | `OFFEN` · `docs/SSOT_Waber_Shader.md` |
| **Zwei Karten-Register auf `M`:** Cartography-Map (Kenney, Pergament, Icons, Pfeil-Wege, X am Schatz) als späterer Default-Look **+** die heutige Tactical-Map als Umschalter — die Tactical-Map wird **nicht** weggeworfen | `ENTSCHIEDEN` 9.8. |
| `map-render`: aus Welt-/Zonendaten automatisch eine Cartography-Karte (Icon je Zone, Pfeile je Pfad, Biom-Kacheln, X je Schatz) — jede Welt bekommt ihre Karte ohne Handlayout | `ENTSCHIEDEN` als Zielbild, WS0 |
| **Audio: eine Wahrheit** — `media/3D_Assets/Audio/sfx.json`, gelesen von `audio-2d.js`. Kein zweites Manifest | `ENTSCHIEDEN` 9.8. |
| Ansager war stumm: `drop_002.ogg` liefert Bytes, **dekodiert aber nicht** (kein Pfad-, ein Codec-Problem). Fix: UI-Töne in dieselbe `sfx.json`, Almanach-Seite auf `scroll_001`, `drop_002` umgangen | `OFFEN → behoben`, wartet auf Repo-Upload |
| **Lulls sind Absicht:** nur diskrete Commits klingen; Hover, Tippen, kontinuierliche Bewegung bleiben still (Debounce 80 ms) | `ENTSCHIEDEN` 9.8. |

**Perf-Befund zur Ink (9.8., gegen die Vermutung geprüft):** Die Ink-Outline ist **kein**
Pro-Bild-Kosten — Küste gebacken, nur sichtbare Küstenfelder gezeichnet, `ground-band.js` nie im
Zeichenpfad, Kartenkante in die Blatt-Textur gebacken. Die einzige ink-nahe Kosten ist die
**Startphase** (erstes Backen). Dort messen, nicht an der Kante.

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
| 9.8. | **Was funktioniert und keine Folgeprobleme verursacht, schlägt Kanon** — Ausnahmen werden mit Grund notiert | Georg |
| 9.8. | Lead und SSOT liegen in diesem Workspace; Masterplan als Living Doc (.md + HTML) | Georg |
| 9.8. | Progression: sechs Werte (Bizarro/Kayfabe/Bingo/Bongo/Boggle/BLÖDSINN), Fluff = HP abgeleitet, POP = XP, kein sichtbares Level | Georg |
| 9.8. | **Action Slots werden mit POP gekauft**; »Ruhm« = Ruf (Fraktionen), getrennt. Preise nur im Menü | Georg |
| 9.8. | Card-Acquisition-Screen: 3 Anlässe (Zone-Clear · König · Hidden) → WIN → Präsentation mit Kontext → OK → Einflug in den Almanach | Georg |
| 9.8. | Drei Wellen erst ab Card Zone; Tutorial nur Wächter + ein Kampf | Georg |
| 9.8. | Eine KFB-Ink für alle Outlines; »bend«/»torn« sind künftige benannte Stile desselben Kanons; TS-UI bleibt eigener Kunst-Layer | Georg |
| 9.8. | Kartenformat bleibt 1,74; 18×10 ist das Feld-Raster, kein zweiter Wert, kein weißer Rand | Georg |
| 9.8. | Status-Vokabular: »GILT« raus → `LÄUFT` (mit Beleg) / `GEBAUT` | Georg |
| 9.8. | **1 Deck = 56 Karten = 1 Welt**; Welten dürfen sparse oder kartenfrei sein | Georg |
| 9.8. | **Content-Surfaces:** Kartenteller trägt freie AR (Karte · Video · Demo · HTML); Rickroll-Kayfabe ist Kanon | Georg |
| 9.8. | **Zwei Karten-Register** (Cartography + Tactical) auf einer Taste | Georg |
| 9.8. | Erste echte Card Zone nach dem Tutorial = **Anti-Rules Toolkit** (ADD web); Raster vorher messen | Georg |
| 9.8. | Rickroll-Content-Surface liegt **schon in der Tutorial-Welt**, aber nicht in der Tutorial-Runde | Georg |
| 9.8. | POP-Kosten je Slot: **nach** dem Progression-Slice, nicht vorher | Georg |
| 9.8. | WS0-Reihenfolge freigegeben wie vorgeschlagen (sfx.json → UI-Baukasten → HUD → Sounds → Acquisition-Screen → Map) | Georg |
| 9.8. | Idle-Plauderei nach Living Concept §59 gebaut; RSS bleibt vorerst ein Anschluss ohne Leitung | Georg |
| 9.8. | »PottyMouth BB« nur für Flüche (sie ist eine Fluch-, keine Textschrift); Emote-Satz wird Vorlage fürs Bildmodell | Georg |
| 9.8. | Sprechblasen-System aus Pet Studio v4 wird übernommen (Reuse, kein Neubau); Anker wechselt vom Pet-Kopf zur Unit | Georg |
| 9.8. | Ein Emote je Blase statt drei; der Zeichenschlüssel der Fluchschrift ist zugleich das Briefing fürs PNG-Set | Georg |
| 9.8. | Die Karte wandert **erst bei OK** in den Almanach; der Screen ist Lead-Stand mit WS0-Haken | WS1 |
| 9.8. | Audio-Ausdrucksebene (Soundscape · Drone · Musik · Signatur) **als Konzept** freigegeben, Produktion nur als Demonstrator; Howler bleibt offen | Georg/WS1 |
| 9.8. | Chatter-**Laufzeit** bleibt Lead, Fraktions-Phrasen und Emote-PNGs sind WS0-Inhalt | WS1 |
| 9.8. | Progression gebaut: sechs Werte, Fluff abgeleitet, POP als Währung, kein Level. Preise: Wert = 4 + 2×Wert, Slots 15/40 | Georg (Zahlen: Lead) |
| 9.8. | Viewer bekommt Zoom-am-Zeiger und Panning; Blättern wird eine Spielhandlung an der Tuschekante | Georg |
| 9.8. | Kartenrückseiten werden ein Satz (Anti-Rules S. 15, vier BLÖDSINN!-Rückseiten), gewählt nach Kontext/Seed | Georg |
| 9.8. | **v10-Fork:** Arbeitsstand ist `KFB Overworld v10.dc.html` + `overworld-game-v10.js`; v9 eingefroren | WS1 |
| 10.8. | **A1 gelöst: `Kayfabe` ist der Wert** (player-facing); »kayfabe« bleibt intern der Realitätsrahmen. Keine Umbenennung — die zweite Ebene ist ein Werkzeug, siehe K7 und §2.1 | Georg |
| 10.8. | `K-Fabe` als Magie-/Fernkampf-Begriff wird **gestrichen**, nicht entschieden: er steht nur in Living Concept §16 und in keiner Zeile Code (Lead nachgezählt) | Lead, zur Bestätigung |
| 10.8. | **Drei Ebenen je Begriff:** ID (Code) · Label (Kanon) · Short (HUD). Etiketten sind **KayfaBingo/KayfaBongo/KayfaBoggle**, IDs bleiben `bingo/bongo/boggle`; WS0 normalisiert das Rail, der Runner migriert nicht | Georg |
| 10.8. | **Eine Begriffstabelle:** `docs/GLOSSAR_KFB.md`, drei Spalten + Quelle je Zeile. Konkurrierende Tabellen sind damit ungültig | Georg |
| 10.8. | **A1 geschlossen.** Kürzel bleiben `Biz · Kay · Bin · Bon · Bog · Blö` (`BNG/BGO/BGL` zurückgezogen); `short` ist jetzt ein eigenes Feld in `STAT_INFO`, weil `slice(0,3)` mit den neuen Etiketten Kay·Kay·Kay ergeben hätte | Georg + Lead-Befund |
| 10.8. | **Namensraum:** `K1`/`K2` = Kanon-Regeln. Schmähruf-Eskalation heißt `P1`/`P2` (Pottymouth) — Hygiene, kein Verhalten geändert | Georg |

---

## 6 · Arbeitsteilung und Sync

**WS1 (hier, Lead):** das Spiel — Welt, Terrain, Graben, Card Zones, Kampf, Wächter, KI, Regie,
Reveal in der Welt. Plus Masterplan, Kanon, Entscheidungen. **Besitzt die Wahrheit.**

**WS0-Stand 9.8.:** Paket 2 (UI-Baukasten `ui-kit-ts.js`) `LÄUFT` — 19 Blätter, 12/12 Bauteile im
Pixelvergleich ohne Abweichung, Menü **und** Welt aus demselben Code. Vier Messbefunde haben unser
Briefing korrigiert (Banner ist 9-Slice, Schriftrollen dehnbar, Bars in jeder Länge,
`paper-atlas.js` überholt) — Einzelheiten in `docs/BRIEFING_WS0_v10.md` §2a.

**WS0:** alles **über** dem Spiel, freigegeben am 9.8.:
1. **HUD / UI-Chrome** — Rail, Roster, Character-Fenster, Almanach, Kataloge, Avatare.
2. **UI-Embed-Layer** (Briefing A): der Tiny-Swords-Baukasten nach dem 64px-Gesetz — **Banner und
   Schriftrollen als 3-Slice** (Kappen nie strecken), **Paper-Frames als 9-Slice**, Bars als
   Base + Fill, Icons/Cursors/Avatars fix. Immer aus den `*_Slots.png` schneiden, nie das
   Vorschaubild strecken. Für UI-Layer **und** World-Layer (Schriftrolle über einer Zone, Banner
   am Ort).
3. **Sound** (Briefing C): eine `sfx.json`, UI-Familie unter der Welt, Signature-Ton je diskretem
   Commit, Lulls bleiben still.
4. **Map-Layer** (Briefing E): Kenney Cartography (CC0) — Kachel-Inventar, Pergamente, `map-render`
   als Modul, Cartography ↔ Tactical als Umschalter.
5. ~~Card-Acquisition-Screen~~ — am 9.8. vom Lead gebaut (V10-S4). Übernahme später über
   `game.hudCardAward`; **kein Neubau** (die Fehlerklasse »zwei Wahrheiten« beginnt hier).

**Coworker:** Fakten, Briefings, Patches, Feedback. Kein Masterplan, kein Lead.

**Der Vertrag, nicht die Absprache.** Der Runner stellt eine benannte Oberfläche (`game.rail`,
`game.hero`, `game.zones`, `game.hudSpendPoint`, `OW_AUDIO.sfx(event)` …). Ausdrücklich dazu, weil
es am 9.8. Geld gekostet hat:

| Aufruf | Regel |
|---|---|
| `game.travelPoint(x,y,label,nachsicht)` | `nachsicht` **3** (Vorgabe) für **benannte Orte** — der Klickpunkt liegt ~70 px unter dem Anker. **1** für **freie Klicks** auf die Insel-Karte: dort sind ein Pixel zwei Felder, und die Nachsicht war größer als die Genauigkeit (WS0-Befund, `card-rail-v9b.js`) |
| `game.popCost(kind,key)` | **zwei** Argumente, nicht eine Kennung: `popCost('stat','bizarro')` → Preis der **nächsten** Stufe (die aktuelle steckt im Helden, nicht im Aufruf) · `popCost('slot')` → Preis des nächsten Slots oder **`null`**, wenn alle offen sind |
| `game.popSpend(kind,key)` | führt aus und gibt **immer ein Objekt**: `{ok:true, note:'−8 POP'}` oder `{ok:false, note:'Not enough POP — 15 needed.'}`. Kein Restbetrag im Rückgabewert — der steht in `hero.pop`. Bei `ok` sind Autosave und `updateHud` schon gelaufen |
| `hero.pop` · `hero.popTotal` | `pop` = **Kontostand** (sinkt beim Kaufen), `popTotal` = **Lebenssumme** (steigt nur). `hero.lv`/`hero.xp` sind tot: eingefroren auf 1 und 0 |
| `hero.skillPoints` | **Brücke, kein Vorrat**: 1, sobald die billigste Anhebung bezahlbar ist, sonst 0. Fällt weg, wenn das HUD POP anzeigt |
| `game.spendSkillPoint(k)` | Altweg-Brücke → `popSpend('stat',k)`. `k='fluff'` wird abgelehnt (Fluff ist abgeleitet) |
| `game.hudCardAward({card,reason,zone,done})` | wer den Screen liefert, muss `done()` rufen |
| `zone._plate` | das gezeichnete Kartenblatt in Weltpixeln (seit V10-S8 die Kante der Zone) |

**Statusvokabular für Handoffs** (ChatGPT 10.8., angenommen). Ein Handoff, das Produktion auslöst,
muss den **tatsächlichen Runtime-Stand** kennen — sonst baut jemand nach, was schon läuft (am 10.8.
beinahe passiert: die »build now«-Liste enthielt fünf fertige Punkte). Jeder Punkt trägt ab sofort
einen dieser sechs Status:

`BUILT` existiert, nicht neu bauen · `PARTIAL` vorhanden mit benannter Lücke · `OPEN` Konzept steht,
Implementierung fehlt · `HOOK` vorgesehen, nicht aktiv · `DEFERRED` bewusst später ·
`REJECTED` bewusst verworfen.

**Eigennamen bleiben deutsch — auch als Titel.** `Leichenfledderer` ist kein deutsches Wort in
englischem Text, sondern ein Eigenname wie BLÖDSINN! oder Kayfabulation. Übersetzt verlöre er, was
ihn zum Titel macht.

**Zwei Regeln aus V10-S19d, die für beide Workspaces gelten:**
· **Eine Schnittstelle darf ablehnen; werfen darf sie nicht.** `OW_AI.speak()` hing an einem
  Modulzustand, den nur `step()` setzt — von außen gerufen warf sie. Jetzt degradiert sie.
· **Modulreferenzen nachschlagen, nicht einfangen.** `this.OWA=window.OW_AI` fror eine Instanz ein;
  nach einer erneuten Auswertung liefen zwei Gehirne mit zwei Zählern (0 gegen 219). Getter statt
  Zuweisung.

**Und die Export-Regel** (WS0-Befund 9.8.): ein Export zählt nicht nur die Skripte, die das DC
referenziert, sondern auch, **was die Module selbst nachladen** — `hud-slots.json` fehlte, und ein
leeres `catch` um den `fetch` machte es unsichtbar. Prüfliste: `docs/EXPORT_PRUEFLISTE.md`. Was dort steht, darf UI
lesen und rufen; was nicht dort steht, ist intern. **Kein Eingriff im Runner — anhängen statt
hineinschreiben**, in beide Richtungen. Neue Oberfläche wird hier beantragt und hier eingetragen.

**Geteilte Dateien tragen einen Fork-Stempel** im Kopf (aus welchem Export sie stammen). Dann sieht
man Divergenz beim Lesen statt beim Debuggen. `units-catalog.js` gehört WS0 — sie messen die Blätter.

**Sync-Ritual (9.8. geschärft): eine Richtung je Runde, immer ein Session-Export.**
Eine Runde = **ein Export, ein Empfänger, eine Abnahme mit Zahlen.** Jeder Export enthält:
Code + Standalone-HTML + `MASTERPLAN_overworld.md` (Stand) + Onboarding + Changelog-Kopf.
Wer empfängt, baut nach; wer sendet, ändert in der Zeit nichts Geteiltes. WS0 hat regelmäßig mehr
Session-Credits übrig — deshalb liegt die **Taktung bei WS0**, die **Reihenfolge** aber hier.

---

## 6b · Arbeitsteilung für die Spielzeug-Welt (9.8.)

Damit nicht hin und her geschrieben werden muss: **eine Grenze, zwei Listen, ein Export je Runde.**

| Gehört WS1 (hier) | Gehört WS0 |
|---|---|
| Blasen-**Laufzeit**: Anker an der Einheit, Totzone, Trägheit, eine Blase, Aktionsmenü | Blasen-**Chrome** im HUD/Almanach (TS-Papier, Banner, Schriftrolle) |
| `OW_CHATTER`: Quellen, Fraktionston, Emote-Wahl, Prompts/LLM-Aufruf | **Phrasenvorrat als Daten** (`media/chatter/faction-phrases/`), **Emote-PNGs** |
| Wegelagerer-Zonen, Mob-Verhalten, Kampf, Aktionsfolgen | Almanach-/Quest-Viewer mit Zoom und Blättern (HUB-Ebene, keine Einheiten) |
| Der Vertrag (§6) und dieser Plan | Rail, Roster, Fenster, Map-Layer, Sound-Assets |

**Sync ohne Ping-Pong:** WS1 schreibt den Vertrag **bevor** WS0 baut; WS0 baut dagegen und liefert
**einen** Export mit Zahlen; WS1 integriert und antwortet **einmal**. Keine Zwischenfragen, die
Georg weiterreichen muss — was unklar ist, wird im Export als Frage notiert und in der nächsten
Runde beantwortet.

## 7 · Reihenfolge — was als Nächstes gebaut wird

1. **v10-Fork + Masterplan-Patch** (dieses Blatt) — erledigt 9.8.
2. **Skelett/Graveyard als Tutorial-Zone** — `LÄUFT` seit V10-S4: die ganze Runde an einem Ort,
   über den echten Bedienweg abgenommen: die **ganze Runde** an einem Ort — Rückseite liegt →
   Wächter patrouilliert → **ein** Kampf → Sieg → Aufdecken → Almanach. Diese Runde übt Card Zone,
   Guard, Reveal, Almanac und POP gleichzeitig; Dungeon und Raid sind danach dieselbe Grammatik,
   nur wiederholt.
3. **Komplett-Export für WS0** — Code, Masterplan, Onboarding, Briefing, Review.
4. **BLÖDSINN!-Regie** — `LÄUFT` seit V10-S5.
5. **Sprechblasen-Portierung + Aktionsmenü** (Pet Studio v4 → Units) — der Baustein, an dem
   Chatter, Emotes, TS-UI und später die Prompts zusammenlaufen.
6. **Wegelagerer-Zonen** — `LÄUFT` seit V10-S11: Trainings-Gegner abseits der Wege.
7. **Begriffstabelle** — `GEBAUT` und **geschlossen** (10.8.): `docs/GLOSSAR_KFB.md` ist die eine
   Tabelle (K8), drei Ebenen gesetzt, `short` als Feld im Runner, `K1/K2` gegen `P1/P2` getrennt.
8. **Timing Lab** — Prüfbrett für Blasen-Timing (ChatterBox §12.1). Liefert gemessene Vorgaben
   zurück, statt die 15 CPS ungeprüft zu übernehmen. Entsperrt alle weitere Chatter-Arbeit.
9. **Wiseguy** nach ChatterBox §11.8 — elf Punkte, statischer Vorrat, kein LLM.
10. **WS0-HUD einbauen (»v10x«)** — Reihenfolge in `docs/REVIEW_WS0_hud-v9b.md` §5, Slices und
    Fork-Punkt in `docs/UPDATE_WS0_2026-08-10.md`.
11. **Hofnarr auf dem Marktplatz** — Triplet-Jokes, beleidigt König und Spieler.
12. **Signatur-Shader je Terrain-Typ** — `docs/SSOT_Waber_Shader.md`, Faltung in `OW_SHADE`.
13. **Content-Surface (MediaSurface)** — erst wenn Tutorial-Runde und Reveal stehen.
14. **Küstenlinien** — als Federstriche, in der Kachel gebacken.

## 8 · Offene Fragen an Georg

- **Erste echte Card Zone nach dem Tutorial:** welche Zone, welches Deck, welcher Boss?
- **POP-Kosten je Slot:** Zahlen erst nach dem ersten Progression-Slice — oder gleich mitentscheiden?
- **Content-Surface, erster Auftritt:** soll der Rickroll schon in der Tutorial-Welt liegen, oder
  bleibt die Tutorial-Runde sortenrein Karte?
- **TS Free Pack Lizenz:** vor einem kommerziellen Export bestätigen (Kenney Cartography ist CC0,
  unproblematisch).

## 9 · Risiken

**Zwei Wahrheiten** ist die teuerste Klasse — sie hat am 9.8. viermal zugeschlagen (Kartenkunst,
Zonen-Banner, Sperre in `blocked`, Haltung in `alert`). Jede geteilte Zahl braucht einen Ort.
**Fork-Divergenz** zwischen den Workspaces (§6 ist die Antwort) — mit WS0 an fünf Baustellen
gleichzeitig ist das ab jetzt das Hauptrisiko, nicht mehr die Performance.
**Ideeninflation:** das Living Concept hat 68 Abschnitte, fast alles WORKING MODEL. Die Gefahr ist
nicht Ideenmangel, sondern dass nichts eine senkrechte Scheibe erzwingt — deshalb steht Punkt 3 der
Reihenfolge da, wo er steht.

---

## 10 · Karte der Dokumente

| Datei | Rolle |
|---|---|
| **`docs/MASTERPLAN_overworld.md`** | dieses Blatt — die Wahrheit |
| `KFB Overworld Masterplan.dc.html` | der Leser, zeigt dieses Blatt an |
| `docs/BRIEFING_WS0_v10.md` | Freigabe und Auftrag an WS0 (HUD/UI · Sound · Banner/Schriftrollen · Map-Layer) |
| `docs/SESSION_CUT_v10_S2.md` | Schnitt 9.8.: Slices, zwölf Hausregeln mit Belegen |
| `docs/ONBOARDING_v10_overworld.md` | Einstieg in den Arbeitsstand, Backlog-Notizen |
| `docs/CHANGELOG_overworld.md` | additiv, neuester Eintrag oben, jede Änderung mit Zahl |
| `docs/MASTERPLAN_konzepte_archiv.md` | die 37 Konzeptabschnitte 6.–8.8. — Ideenreservoir |
| `docs/LIVING_CONCEPT_overworld.md` | Ideenzulauf (Georg + ChatGPT) |
| `docs/SSOT_Waber_Shader.md` | Herkunft, Pfade und Zahlen der Waber-Shader |
| `docs/REVIEW_WS0_hud-v9b.md` | Bewertung des WS0-HUD-Exports + Einbauplan |
| `docs/UPDATE_WS0_2026-08-10.md` | Stand + neun Slices für WS0, Fork-Punkt, Vertrag-Delta |
| `docs/ANTWORT_ChatGPT_2026-08-10.md` | Intake-Bescheid zum Handoff-Paket 10.8. (angenommen/geparkt/zurück) |
| `skills/SSOT_Card_Ink_Outline_v2.md` | Tusche-Kanon |
| `skills/SSOT_TinySwords_Tilemap.md` | Tilemap-Regeln |
| `uploads/…/WS0_coworker/` | Zulauf 9.8.: Redaktionspatch (eingearbeitet), UI-Briefing, Ink-Embed, `sfx.json` |
