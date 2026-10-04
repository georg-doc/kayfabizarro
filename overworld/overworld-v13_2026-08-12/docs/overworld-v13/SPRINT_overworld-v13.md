# SPRINT — KFB Overworld v13 (Fork 2026-08-12 aus v12 / HOUSEKEEPING §4v)

**Arbeitsstand:** `KFB Overworld v13.dc.html` + `overworld-v13/` (56 Module + `icons-rpg/` + 3 JSON)
**Fork-Basis:** `KFB Overworld v12.dc.html` (Stand §4v: water-v2.0, Glitzern **aus**, Statblatt-
Rücknahme (93), Journey-Schema 2.4.0) — **SUPERSEDED, nicht löschen, Vergleichsmaßstab.**
**Lead-Doku:** `docs/overworld-v10/MASTERPLAN_overworld.md` (WS1, Stand 9.8. — siehe Abgleich unten)

---

## §1 Was der Fork geändert hat — und was nicht

| Was | Zustand |
|---|---|
| 39 Skriptpfade im DC | `./overworld-v12/` → `./overworld-v13/` |
| `x-import … from=` (Runner) | auf `./overworld-v13/overworld-game-v10.js` |
| Fork-Stempel im Kopf | neu, Erbe v12/v11/Re-Home darunter erhalten |
| **Modulzeilen** | **0 geändert.** Die Module lösen ihre Nachbarn über die EIGENE Adresse auf (`document.currentScript.src`), deshalb wandert `icons-rpg/` mit dem Ordner und keine Datei kennt ihren Ordnernamen |
| Runner `overworld-game-v10.js` | **nicht angefaßt** (dieselbe Regel wie beim v11→v12-Fork) |
| Historische Prosa im Kopf | zwei Nennungen von `overworld-v12` bleiben stehen — sie beschreiben, was damals passiert ist, und werden nicht rückdatiert |

**Fork-Abnahme (vor dem ersten Slice zu fahren, echter Bedienweg, nicht Boot-Log):**
1. Module **39/39**, keine Fehlerzeile · `[asset-source] cdn · …`
2. `[rail-v9b] Kartenspalte steht` — **die** Zeile ist die Rail-Abnahme (Naht 78), nicht das Boot-Log
3. Taste **C**: Fußzeile `30 gemessen · 28 mit Hieb · 2 Rempler · 5 mit Wurf · 23 mit Porträt`
4. `[water]`-Zeile vorhanden; Glitzern steht auf **aus** (Stand 12.8. abends, Naht 82/83)
5. Journey: Held wählen → Save trägt `hero.unit` ohne `hero_`-Präfix (Schema 2.4.0), Export/Import über **J**
6. Statblatt: Papier **voll deckend** (Deckkraft 1, rgb(226,215,192)) — Naht 92 ist zweimal bezahlt

---

## §2 Die Reihenfolge (Georgs, unverändert aus v12 übernommen)

| # | Slice | Zustand | Vorbedingung |
|---|---|---|---|
| 1 | **Ink-Outline als System** — *Stärke trägt, Farbe bestätigt*; `inkOf(terrainfarbe)`, abgeleitet nie gewählt; schwarze Linie wird überdeckt, nie unterbrochen | ENTSCHIEDEN 11.8., nicht gebaut | K5: **eine** Feder (`cardbuilder/kfb-ink-canon.js`), kein zweiter Kanon |
| 2 | **Linienstärken vereinheitlichen** (Karte · Küste · Teich) | fällt mit (1) zusammen — **ein** Slice | dito |
| 3 | **Gummiband greift zu früh** | Hypothese, **nicht gemessen** | **erst messen**: Abstand der gezeichneten `rubber-coast`-Kontur zur tastenden Kollision. Muster `reach.js`: eine Kontur, zwei Leser, Toleranz = halbe Federbreite |
| 4 | **Sprechblasen mit Level über den Köpfen** | offen | Blase liegt heute auf **Canvas**, das portierte System ist DOM/SVG (`bubble-ts.js`) — Grenze vorher benennen |
| 5 | **Sieben Einheiten ohne Porträt** (FrizzleBob, rogue, knight, mage, pig, pig_rider, sheep) | offen | **kein Sprite-Kopf als Ersatz** (Georg, 11.8.); Rückweg ist eine Zeile `avatar:` im Katalog |
| — | **Cartoon-Wasser** | **wartet auf Georg** — Referenzen/Shader mit klarem Vorbild; bis dahin zeichnet der Waber-Shader allein, `waterForm` (kleckse · striche · schlieren) bleibt über `water-form` erreichbar |

## §3 Was in v13 NICHT gemacht wird

Kein Renderer-Wechsel (WebGPU ist die Rollercoaster-Linie), keine Laufzeit-3D im Overworld
(Stufe B, erst messen wenn A trägt), keine Normierung der Bestandsblätter (§12-Irrweg,
zurückgenommen), **kein zweiter Masterplan** (§6: der gehört WS1), keine neue Ink-Feder.

## §4 Abgleich mit Projekt-Doku (Kurzfassung)

Die Langfassung mit Zahlen steht in `docs/overworld-v13/ABGLEICH_briefings_2026-08-12.md`.
Drei Sätze:
1. **Der Masterplan ist drei Forks alt** (Stand 9.8., v10) — v11 und v12 haben Entscheidungen
   getroffen, die dort fehlen (Ink-Regel, Wasser-Kanon, 30 Einheiten, Journey 2.4.0, Statblatt-
   Rücknahme). Er gehört WS1: wir schicken **einen Patch**, wir schreiben ihn nicht um.
2. **Der v12-Runner-Diff ist nicht abgeschickt.** In §4v stehen drei Dateien als »Diff an WS1« —
   seit 12.8. sind Kamerazweig, `stepReader`, `spawnPoints`, `spawnCritters`, `water-form` und
   Journey 2.4.0 dazugekommen. Ein ungeschickter Diff ist die Vorstufe zu »zwei Wahrheiten«.
3. **Für die Overworld-Linie gab es bis jetzt kein Sprint-Blatt** (Travel hat eines je Fork).
   Dieses hier ist es.


---

## §5 Slice-Plan v13 (Stand 2026-08-12, nach dem Cowork-Bündel)

Eingang: `uploads/HANDOVER_Cowork_2026-08-12.md` + `kfb_overworld_living_doc.html` +
`kfb_piratebomb_bundle(1).html`. **Der Einwand des Coworkers ist angenommen:** eine Runde
Handover, dann ein **inhaltlicher** Slice — v12 war ein Housekeeping-Fork, v13 darf kein zweiter
werden. Deshalb steht hier eine halbe Runde vorweg und danach Inhalt.

### Runde 0 · H0 — das Handover-Blatt (halbe Runde, blockiert alles andere)
`docs/overworld-v13/HANDOVER_WS1_2026-08-12.md`: Datei-für-Datei-Diff v11→v12→v13, Nähte 67–103,
Masterplan-Patch als einsetzbarer Textblock (Tabelle in `ABGLEICH_briefings` §3).
**Dazu die Verschärfung des Coworkers, und sie ist richtig:** ein Plan, der neun Entscheidungen
nicht kennt, ist keine veraltete Datei, sondern eine **falsche Quelle**. Solange der Patch nicht
eingearbeitet ist, gehört **ein Vermerk in den Masterplan selbst** (»Stand 9.8., liegt hinter dem
Code, Patch liegt in §3 des Abgleichs«). Eine Zeile ist kein Umschreiben — Eigentum bleibt WS1.
*Georg entscheidet, ob wir diese Zeile setzen.*

### Runde 1 · Bubble / ChatterBox — der gesetzte v13-Slice
Die Vorarbeit ist Setzungsarbeit, also ist die Umsetzung Ausführung. Reihenfolge so, dass jeder
Schritt gegen eine **ausgerechnete** Zahl antritt und nicht gegen einen Eindruck:

| Slice | Inhalt | Abnahme |
|---|---|---|
| **C1** ✓ | `overworld-v13/bubble-layout.js` (bl-v1.0) + Messblatt `KFB Bubble-Fixtures v1.dc.html` | **abgenommen 12.8.: 12/12 · Zeilen 12/12 · Umbruch 5/5 · Zeiten 12/12 · Überlauf gemeldet.** `overflow` wird **abgewiesen**, nicht vierzeilig gezeigt |
| **C2** ✓ | `bubble-ts.js` → **bubble-ts-v2**: fünf Formen, `satz()` als eine Satz-Rechnung, Zeichenbreite **gemessen**; Messblatt `KFB Blasen-Formen v1.dc.html` | **12.8.:** Ruf neu als **Sternplatzer** (Kranz 12–18 Spitzen + Aufprall-Striche), Gedanke neu als **Lappenkranz** (Bauchung 0,74), Kasten für Kayfabulate, Flüstern mit Rückfall. Nähte 109–114 |
| **C3** | **Ablage über dem Kopf** (O5): vier Anker statt Warteschlange; Level-Etikett und Zustandsleiste weichen der Blase | Georgs offener Slice »Sprechblasen mit Level« fällt hier hinein — **ein** Slice, nicht zwei |
| **C4** | **Emanata** (O1): 14 Zeichen, **eins** je Einheit, Zuordnung zu Zustand | Blocker: Blatt A hat **kein Raster**. Bis Blatt B da ist, kommen die Zeichen aus dem Kanon (Vektor), nicht aus dem Blatt |
| **C5** | Ton je Zeichen (O4), **standardmäßig aus**, Einträge in dieselbe `sfx.json` | eine Audio-Wahrheit; Lulls bleiben still |

**Warum Emanata statt Augen-Rig:** zehn Gegnertypen bekommen nie Dialog, und ein Zeichen über dem
Kopf kostet nichts und läuft auf jedem Sprite. Googly Eyes bleiben die Signatur **einer** Figur.

### Runde 2 · Pirate Bomb — vom Bündel in die Welt
Werkzeug dafür ist **`KFB Terrain-Probe v1.dc.html`** (tp-probe-v1): Pirate Bomb neben
Tiny-Swords-Einheiten und -Requisiten auf einem lean Boden, geladen über die Kette des Spiels
(`OW_SRC` → `OW_UNITS.heroDef` → `OW_LOADER.loadUnit(refBody 91)`), Maßstab und Fußpunkt mit
**demselben** Werkzeug gemessen (`probeBox`).

Erste Messung an der Probe (2026-08-12): **Bald Pirate Körper 59 px → ×1,54 = 91 px** neben
Warrior (192er-Zelle, Körper 91 px, ×1,00) und Minotaur (Streifen, 129 px → ×1,23 = 159 px).
Die Leinwand 63×67 ist also **nicht** zu groß — die Figur füllt sie nur knapp zur Hälfte.
**Damit ist offene Entscheidung 11 des Handovers messbar statt geschätzt.**

| Slice | Inhalt | Entscheidung davor |
|---|---|---|
| **P1** | ~~Maßstab festlegen~~ **entschieden 12.8. am Blatt: HERO_REF-normiert** (Bald Pirate ×1,54 = 91 px) — »pirates passen super so« | erledigt |
| **P2** | Einbau ins Bestiarium: **entschieden 12.8. — zu Streifen backen** und als `strips` eintragen (181 Anfragen → 11), **kein** dritter Loader-Zweig. Der Streifen-Bäcker ist der Nachbar des Pixelbäckers: ein Bild je Frame rein, ein Streifen je Animation raus, Zellbreite konstant, Fußpunkt gemessen | erledigt |
| **P3** | Umgewidmete Verben verdrahten: `3-Jump Anticipation` (1 Bild) = **Anspannung vor dem Angriff**, `4-Jump` = Satz nach vorn, `5-Fall` = Rückstoß in der Luft, `6-Ground` = Aufstehen | das ist der eigentliche Fund des Bündels: ein Draufsicht-Mob bekommt ein **Vorzeichen** |
| **P4** | Richtungen: **zwei, gespiegelt** (entschieden 12.8.) | erledigt |
| **P5** | Rolle: **alle fünf** (entschieden 12.8.) — Gegner am Steg/Ufer · Card-Zone-Wächter · Bewohner/NPC · **Captain als Card-Owner** · Wegelagerer-Zone. Die Fluchtanimation ist ein **neuer Zustand** im `mob-ai` und braucht einen eigenen kleinen Slice, nicht nur einen Katalogeintrag | Slice P5 offen |

### Was NICHT in v13 hineingehört
King Kayfabon als Weltsprite (29 646 Farben, 34 % Saum → **Portrait**, nicht Unit) · Emanata-Blatt A
als Blattquelle, solange kein Raster da ist · ein zweiter Ink-Kanon für die Blasenkontur · der
Pixelbäcker selbst (eigenes Projekt, Briefing liegt).

### Nachtrag 12.8. — H0 erledigt, Reihenfolge bestätigt
`HANDOVER_WS1_2026-08-12.md` liegt; der Masterplan trägt den Vermerk am Kopf. Der gemessene Diff
ist **acht** Dateien, nicht drei (§1 des Handovers) — (105) *eine Diff-Liste aus dem Gedächtnis ist
eine Schätzung.* **Als nächstes: C1** — `bubble-layout.js` gegen die zwölf ausgerechneten Fixtures,
`overflow` muss sichtbar scheitern.
Assets nebenher, weil sie Vorlauf haben: **Emanata-Blatt B** beauftragen (7 Zeichen, einzeln
angefordert, kein Rasterblatt vom Bildmodell), **Blatt A umbenennen**, **King neu beauftragen**.

### C1 erledigt (12.8.) — was C2 vorfindet
`OW_BLAYOUT.layout(text, art, {fontPx, charPx, viewW, maxChars})` gibt Zeilen, Kasten (mit Polster
in em), Zeiten, `tail` je Art, `overflow`/`split`/`reject`. Die Zahlen für Anker, Zeiger und Ablage
liegen als `OW_BLAYOUT.PLACE` daneben (`anchorLift 6`, `tailMax 22`, `emanatumOffset 4`,
`maxBubbles 2`) — **C2/C3 sollen sie lesen, nicht neu erfinden.**
**Eine Entscheidung fehlt noch:** Flüstern-Zeilenlänge **28** (Fixtures) oder **33** (rechnerisch).
Regler im Messblatt; bei 33 wird `whisper` einzeilig.

### C2 erledigt (12.8.) — Nachtrag nach Georgs Referenzblatt
Zwei Konturen sind **zweimal** gebaut worden, und der zweite Anlauf kam aus dem Vorbild, nicht aus
der Rechnung: der **Ruf** ist ein *Kranz* (viele, fast gleich lange Spitzen, tiefe Täler,
Aufprall-Striche daneben), die **Denkwolke** ein *Kranz fetter Lappen* mit Kerben. Der erste Anlauf
war in beiden Fällen technisch sauber und formal falsch — Naht 110/112.
**Nächster Slice: C3** (Ablage über dem Kopf, vier Anker, Level-Etikett, zweite Blase).

### Nachtrag C2 (12.8. abends) — der Befund, der aus dem Messblatt kam
Das Flüstern hatte **nie** eine Kante: `fluesterKante()` rief `dashedPathD` und das Preset
`card-dash` auf — **beides gibt es im Kanon v2 nicht**. Der Rückfall auf Leerstring meldete nichts,
die Blase bekam `stroke-width 0`, und was man für eine Kante hielt, war der Schlagschatten.
Kein zweiter Federzeichner (K5); Platzhalter benannt, Bitte an WS1 im Handover §5b.
Dazu zwei Fehler derselben Klasse im Messblatt: ein `ready()`-Aufruf, dessen Guard beim Mount noch
nicht greifen konnte (Naht 116), und `ref`-Rückrufe vor `componentDidMount` (Naht 117).

### C2, dritter Anlauf (12.8. spät) + ein neues Register für C2b
Ovale Grundform für Wolke und Ruf, Denk-Kreise nach außen, Pfeilbasis 13,5, Kasten mit Feder-Jitter,
und das Flüstern gestrichelt **über Maskenlücken** statt über einen zweiten Zeichner (Georgs Weg —
Nähte 118–121).
**Neu im Backlog (C2b):** eine **wellige** Kontur »emotional bewegt« als sechstes Register, hoch und
quer, Vorlage in `uploads/` (12.8.). Sie ist ein **Preset derselben Kante** (Wellenlänge, Amplitude),
kein neuer Zeichner — dieselbe Regel wie bei der Maske.
