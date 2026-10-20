# Konzeptblatt · Resident Disco · Straßenparty · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-566 · **Szene:** `resident-disco-01`

**Quelle 1:1:** Resident Atlas S17 `data/resident-disco-01.json` + `disco-ball-core-01.json`, live unter `#__disco`.
- Besetzung, Plätze, Requisiten, Kugel, Phrase und Cues werden **nicht verändert**.
- Neu ist nur die **Einpassung ins Terrain** (Kanon Gebiet 15).

**Gegenbeispiel (FAIL 19.10., V-561):**
- Kugel an Pfeilern;
- Figuren und Requisiten auf einer Bühnenscheibe;
- eigene Farben, eigenes Licht.

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt eine Straßenparty auf dem O-Town-Platz, weil hier jeden lauen Abend das ganze Viertel unter der frei schwebenden Disco-Kugel tanzt, und der Spieler soll zuerst die Disco-Kugel über dem hellen Tanzkreis sehen.**

## Geschichte (`story`)
In O-Town weitet sich die Straße zu einem kleinen Platz. Jeden lauen Abend wird hier Party gemacht:
- FrizzleBob legt hinter der halb versunkenen Drum Machine auf;
- links dröhnt das Radio;
- zwei Boxen hüpfen im Bass.

Über allem schwebt die Disco-Kugel, ohne Halterung, als gehörte sie zum Himmel. Das ganze Viertel tanzt, jeder auf seine Art: der Soldat steif, die Hexe fließend, der Schwarze Ritter schwer. **Man soll fühlen:** Hier ist immer Party, und du darfst mittanzen.

## Bildidee (`image_idea`)
**Die Kugel schwebt frei über einem hellen, abgetanzten Kreis im Petrol-Boden. Ihre Lichtkegel landen auf den Tänzern, und der Boden ringsum wird nach außen dunkler und wilder.**

## Fokus und Leserichtung (`focal`)
1. **Disco-Kugel:** Landmarke und höchstes Element, schwebt 7,6 m über der Platzmitte (Quelle).
2. **Lichtkegel und Lichtpfützen** auf dem Tanzkreis.
3. **Der Tanzkreis**, die 8 Tänzer im Ring.
4. **Das MC-Pult hinten** (Drum Machine 1,9 m im Boden, FrizzleBob dahinter).
5. **Ränder:** die Boxen links und rechts rahmen.

## Raumkonzept (`space`)
- **Vordergrund (Spielkamera-Seite):**
  - offen, die Tanzfläche öffnet sich zum Spieler hin, Negativraum ≥ 30 %;
  - hier liegt die dunklere Tonfläche des Terrains (#439), damit der helle Kreis leuchtet.
- **Mittelgrund:** der Tanzring nach Quelle (Kreis ×1,35); Avian, Teen, Hexe und Soldat vorne bzw. seitlich, Minion links am Radio.
- **Hintergrund:**
  - Schwarzer Ritter hinten links und Demon Lord hinten rechts (schwere Anker);
  - dazwischen das MC-Pult;
  - dahinter steigt das Gelände sanft an und schließt den Platz, ohne Mauer.
- **Rechts frei:** Die Band-Zone (x 9,8–15,6) bleibt reserviert und leer (Quelle). Das ist bewusster Negativraum für die Ork-Band.
- **Hell-Dunkel:**
  - hell: Mitte (Pflaster + Lichtpfützen);
  - mittel: Petrol-Boden;
  - dunkel: Ränder und Vordergrund-Tonfläche, dazu die dunklen Boxen als Rahmen.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): Petrol-Boden ringsum und Vordergrund-Tonfläche, großflächig, Textur erlaubt, keine Konkurrenz, großflächig und kontrastarm;
  - Struktur (20 %): Pflasterkern mit Sprenkelband, die drei Gruppen (Box A + Radio, Pult, Box B), Steinbänder, Grasrand;
  - Bedeutung (10 %): Disco-Kugel, Lichtpfützen und die 8 Tänzer. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Palettenrollen (`palette_roles`)
Quelle: O-Town aus dem Farbdrehbuch V-406 (Joyride C), Stimmung V-564.

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#3aa596` Petrol | Terrain ringsum, ~60 % |
| path | `#f3e6c8` | abgetanzter Platz bzw. Pflaster-Kern, läuft als Sprenkel in den Boden aus |
| stone | `#e0679f` | Rand-Bröckel und Steinbänder (O-Town-Fels ist magenta) |
| tiers | `#2f8f83` | Gras-Büschel am Platzrand, Boxen leicht dorthin getönt (dunkle Rahmung) |
| frame | `#e9b53b` | Drum Machine (leicht getönt, V-286) |
| accent | `#f08a2c` | Radio, ≤ 10 % |
| sky | `#a8d8b9` | Himmel |

- Figuren behalten ihre eigenen Farben und werden nie umgetönt.
- Die Kugel-Lichter behalten die Quell-Palette (#ff5fa8 #4fd6ff #ffd24f #9a6bff #5cff9a), weil sie echtes Licht sind.

## Licht
- **Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA gold**: lauer Abend, tiefe orange Sonne, violette Füllung, glow 0,4. Keine weiteren Lampen.
- **Die Kugel ist das einzige Praktikal:** Modus DISCO aus der Quelle, 10 Strahlen, 3 echte Spots auf den Strahlen.
- **Schatten:** echte Schatten aus der Sonne, nach Empfänger-Palette getönt (V-564). Keine Blob-Schatten.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | lauer Partyabend, warm und einladend: Hier ist immer Party, du darfst mittanzen |
| Terrain | Petrol #3aa596 ringsum (~60 %), vorn die dunklere Tonfläche (#439), Grasrand #2f8f83; großflächig und kontrastarm |
| Sekundär | Pfad-Ton #f3e6c8 im abgetanzten Kern, Magenta-Stein #e0679f an der Pflasterkante, Drum Machine #e9b53b (leicht getönt), Boxen zum Grasrand-Ton getönt |
| Akzent (nur mit Bedeutung) | Die Kugel-Lichter (#ff5fa8 #4fd6ff #ffd24f #9a6bff #5cff9a) nur als echte Lichtpfützen auf dem Tanzkreis: Erzählkern und Fokus. Orange #f08a2c nur am Radio (Interaktion: Musikquelle, Minion springt dort), ≤ 10 %. Nie an Gras, Steinen, Boxen oder Pflaster. |
| Verboten | Disco-Farbe auf dem Boden außer den echten Lichtpfützen; Orange an Deko; Töne außerhalb der O-Town-Rollen; Figuren umtönen |
| Licht | ein Rig kfb-stage-light.v1.1, MESA gold (tiefe orange Sonne, violette Füllung, glow 0,4); einziges Praktikal ist die Kugel (DISCO, 10 Strahlen, 3 Spots); echte Schatten nach Empfänger getönt |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | flache runde Terrasse mit sanft steigendem Hangrücken dahinter · abgeflachte Kugeln (Gras-Polster, Rand-Bröckel) · weiche Keile (Erdkeil an der Drum Machine, Schürze am Platzrand) |
| Sekundärformen (2) | abgerundete Knet-Platten (gestampftes Pflaster) · gerundete Kistenkörper (Boxen, Radio, Drum Machine nach Eingangsprüfung) |
| Verbotene Formfamilie | scharfe Prismen: Bühnenkante, Podest, Stufen, Pfeiler und Gerüst unter der Kugel |
| Kantenrundung | alle Knet-Kanten weich wie das Terrain; Kit-Kanten der Musik-Geräte über kfb_clay_bpy.apply gerundet; Platzrand ohne Linie, nur Sprenkel |
| Unregelmäßigkeit | kontrolliert: Platten in der Mitte dicht und glatt, nach außen loser und ungleicher; Bröckel hangseitig mehr; Gruppen ungerade, Abstände ≥ 30 % verschieden |

**Lebensanker (`life_anchor`)**
- Gras-Büschel am Platzrand wiegen in Wind-Gruppen und im Bass mit (Kit §6/§7)
- Boxen, Radio und Drum Machine pulsieren im Takt (Quelle)
- Kugel-Impuls in Takt 9, die Lichtkegel wandern über die Tänzer (Quelle)
- **Glaubwürdig macht es:** Der Bass bewegt Gerät und Gras im selben Takt, in dem das Viertel tanzt.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | Tanzkreis-Kern (Pfad-Ton) mit den Lichtpfützen, die Kugel |
| mittel | Petrol-Boden |
| dunkel | Ränder, Vordergrund-Tonfläche, die dunklen Boxen als Rahmen |
| **stärkster Kontrast** | Kugel und Lichtpfützen gegen den dunkleren Petrol-Rand, also auf dem Fokus |
| ruhig | Petrol-Fläche und Vordergrund-Tonfläche |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | offene, dunklere Tonfläche zum Spieler hin; die Boxen links und rechts rahmen als große, dunkle Formen |
| Mittelgrund | trägt die Handlung | Tanzring mit Kugel, Lichtpfützen und Tänzern: höchste Klarheit, stärkster Kontrast |
| Hintergrund | vereinfacht | Ritter, Demon Lord und Pult vor dem sanft steigenden Gelände; Grasrand kontrastarm, weniger Detail |
- **Das Terrain ist nie die lauteste Fläche:** Petrol bleibt unter dem Wert des Tanzkreises; keine Disco-Farbe im Boden.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | Petrol-Boden ringsum und Vordergrund-Tonfläche, großflächig, Textur erlaubt, keine Konkurrenz |
| 20 % Struktur | Pflasterkern mit Sprenkelband, die drei Gruppen (Box A + Radio, Pult, Box B), Steinbänder, Grasrand |
| 10 % Bedeutung | Disco-Kugel, Lichtpfützen und die 8 Tänzer; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Disco-Kugel (Hero, Landmarke) | Spiegelfacetten oben blasser | Farbverlust: Sie hängt jeden Abend unter freiem Himmel |
| Disco-Kugel (Hero, Landmarke) | feiner Staubfilm in den unteren Facettenfugen | Fleck: Staub, den das Tanzen Abend für Abend aufwirbelt |
| Drum Machine (Pult) | Knet-Oberfläche an den Tasten heller abgegriffen | Abnutzung durch FrizzleBobs Hände |
| Drum Machine (Pult) | Erdspritzer und Moos am eingesunkenen Fuß | steht seit Jahren 1,9 m im Boden |
| Boxen (Echos) | Kanten matt abgerieben, Steinchen bergab | Abnutzung vom Hüpfen im Bass |

## Materialcodes (`material_codes`, höchstens 3)
1. **Petrol-Knete-Boden:** Gras-Büschel in Dreier- bis Fünfergruppen am Platzrand, dichter nach außen; sie wiegen in Wind-Gruppen (Environment-Kit §6) und im Bass mit (§7 Musik-Visualizer).
2. **Gestampftes Pflaster:** Knet-Platten in Pfad-Ton, abgerundet. In der Mitte dicht und glatt getanzt, zum Rand lose Platten, dann Sprenkel; keine glatte Fläche.
3. **Musik-Gerät:** Boxen, Radio und Drum Machine, Kit-Formen. Vor dem Bau durch die Eingangsprüfung (`kfb_clay_bpy.apply`), danach Knete und Rollenton. Pulsieren im Takt (Quelle).

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Eine flache Terrasse im Petrol-Gelände, wo die Straße breiter wird; hinten steigt das Gelände sanft an | Terrain-Form, keine Stufen, kein Sockel |
| 2 Nutzen | Der Platz ist vom Tanzen abgetreten: in der Mitte am hellsten und glattesten, nach außen loser. Die Drum Machine steckt tief im Boden, als stünde sie seit Jahren dort | Pfad-Ton-Kern → Sprenkelband 3–8 m (V-403) → Petrol; Erdkeil an der Drum Machine. **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Disco-Kugel (Hero, Landmarke): Spiegelfacetten oben blasser (Farbverlust: Sie hängt jeden Abend unter freiem Himmel); Disco-Kugel (Hero, Landmarke): feiner Staubfilm in den unteren Facettenfugen (Fleck: Staub, den das Tanzen Abend für Abend aufwirbelt); Drum Machine (Pult): Knet-Oberfläche an den Tasten heller abgegriffen (Abnutzung durch FrizzleBobs Hände); Drum Machine (Pult): Erdspritzer und Moos am eingesunkenen Fuß (steht seit Jahren 1,9 m im Boden); Boxen (Echos): Kanten matt abgerieben, Steinchen bergab (Abnutzung vom Hüpfen im Bass) |
| 3 Vergehen | Die Pflasterkante bröckelt nach außen in magentafarbene Steinchen, an der Hangseite mehr | Steinbänder Grammatik §4 (Band 0–2), `nest_ok`, ungerade Gruppen |
| 4 Bewachsen | In den Fugen am Platzrand Moos, außen Gras-Büschel in Dreiergruppen. In der Tanzfläche wächst nichts | Fugen-Sprenkel, Gras 0–2 m vom Rand, Gruppen 3/5/7 |

**Kontakt-Geometrie (V-565):** Jede Fuge wird gebrochen (`kfb_env.contact`):
- an jeder Box ein Steinchen-Dreier bergab;
- am Radio Gras-Büschel;
- an der Drum Machine der Erdkeil plus Bröckel;
- Figuren stehen direkt auf dem Pflaster.

**Signatur:** Hero = Disco-Kugel; Echos = die zwei Boxen (pulsieren im selben Takt). Nichts Drittes.

## Gruppen (`groups`)
- **g1 Ecke links:** Box A (Anker) + Radio (Stütze) + Rand-Steinnest. Ortsgrund: Lärmecke am Platzeingang. Minion tanzt daneben (Quelle).
- **g2 Pult hinten:** Drum Machine (Anker, 1,9 m eingesunken) + Erdkeil + Gras-Dreier hinter dem Pult. Ortsgrund: hinten am Hang, wo das Gelände den Platz schließt.
- **g3 Rand rechts:** Box B (Anker) + Steinnest an der Hangseite. Ortsgrund: Rand zur freien Band-Zone.
- Steine aus der Schürze zählen in die Gruppen; jede Gruppe ungerade (Gate G1).

## Story-Beat (`story_beat`)
16-Takt-Phrase aus der Quelle, Rubbish Groove als Beweis-Uhr, danach Rotation über 8 Titel.
- **Takt 9 (HIT 1):** alle Chicken Dance in gleicher Phase, Kugel-Impuls.
- **Takt 15 (HIT 2):** Avian, Soldat, Ritter und MC in Happy Idle, die anderen tanzen durch (Call and Response).

## Besetzung (`cast`)
Quelle, Plätze unverändert:

| Slot | Figur | Rolle |
|---|---|---|
| D1 | Skeleton Minion | am Radio, springt |
| D2 | Avian Swordsman | |
| D3 | Teen | |
| D4 | Toy Soldier | **erst nach Augen-Fix V-562** |
| D5 | Hexe | |
| D6 | Schwarzer Ritter | Alternative Monstrosity |
| D7 | Demon Lord | |
| D8 | FrizzleBob | MC |

- Jede Figur hat KFB-Augen und E2-Lider, an jeder Variante.
- Kollision RESIDENT-COLLIDE-01 aus der Quelle.

## Kameras (`cameras`)
1. 45° schräg von oben über den Tanzkreis.
2. Augenhöhe (1 H) vom Platzeingang links auf die Kugel.
3. Fuß nah: Drum Machine im Boden (Erdkeil, Sprenkel).
4. Seite: Platzrand rechts mit Steinband und freier Band-Zone.
5. Gesicht nah: Hexe und Soldat.
6. Spielkamera (Bühnen-Orbit V-257).

## Referenz (`reference`)
- RA S17 `#__disco`, Ensemble-Ansicht: Plätze und Kugel 1:1.
- Joyride C O-Town: Farbwelt.
- Terrain-Design 19.10. (#439): Farbflächen, dunklere Vordergrund-Tonfläche, getönte Schatten.

## Verbote für diese Szene
- Kugel an Pfeilern, Kette oder Gerüst.
- Bühnenscheibe, Platte oder eigener Boden.
- Neue Requisiten oder Wege.
- Plätze „verschönern“.
- Disco-Farbe auf dem Boden außer den echten Lichtpfützen.
- Eigene Lampen.

## Ablauf
- **WS1 (Paket E):** Einpassung im Spielterrain.
- **WSB (K1):** liefert Knete und Palette für Boxen, Radio und Drum Machine.
- **Prüfung:** Gate mit `concept.json` daneben, dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.
