# Konzeptblatt · Quaternius Sci-Fi · Alien-Außenposten · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-565/V-566 · **Szene:** `scifi-pack-01` (`ra_scifi_01`)

**Quelle 1:1:** Resident Atlas S17 `data/scifi-pack-01.json` + `lib/scifi-pack.js` (Tempi aus `lib/modefamily.js` MEASURED), live unter `#__scifi`.
- Besetzung, Theta-Plätze, Rundgang-Ellipse, Orbit, alle 38 Platzierungen (x/z, ry), Planeten, Modi und Clips werden **nicht verändert**.
- Neu ist nur die **Einpassung ins Terrain** (Kanon Gebiet 15): Geländeform, Einsinken, Farbflächen, Kontakt-Geometrie.
- Maße der Teile: gemessen im B50-Bau (`50_BLENDER/B50/scifi/data/diorama.json`), nicht geschätzt.

**Gegenbeispiel (FAIL 19.10., V-561, B50 r1):**
- „Modelle planlos auf eine Bühne geworfen“;
- Scheibe r 30 u in Konverter-Grau `#9fb8a0` als Boden, alle Teile auf y 0 obendrauf;
- Kit-Farben roh („Atlas-Farben je Fläche“), Tageslicht aus der Konverter-Vorgabe statt aus der Quelle.

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt einen Außenposten auf einem violetten Alienplaneten, vor dem vier Astronauten zum Empfang stehen, weil vier Familien ihr Zuhause auf den trockenen Geländerücken gebaut haben, und der Spieler soll zuerst die orange Kuppel oben auf dem Rücken sehen.**

## Geschichte (`story`)
Auf einem fremden violetten Planeten haben vier Familien ihren Außenposten auf den trockenen Rücken des Geländes gebaut: Halle, Röhre und Kuppel oben, das Radar-Modul an der West-, das Funk-Modul an der Ostflanke. Rundherum stehen Alienbäume und alte Felsen, am Himmel drei Planeten.
- Barbara, Fernando, Finn und Rae stehen vorn am Rundgang, mit dem Rücken zur Station, und schauen hinaus;
- auf Knopfdruck gehen sie ihre Runde, steigen in den Mech oder heben im Raumschiff ab.

**Man soll fühlen:** Hier draußen wohnt jemand, und die vier empfangen dich vor ihrem Haus.

## Bildidee (`image_idea`)
**Die orange Kuppel sitzt oben auf dem violetten Rücken. Davor stehen die vier Astronauten auf ihrem hellen Trampelpfad wie zum Empfang, und über allem hängen drei blasse Planeten im Nachthimmel.**

## Fokus und Leserichtung (`focal`)
1. **GeodesicDome (Kuppel):** Landmarke und höchstes Element, nach der Einpassung (siehe unten) Scheitel ≈ 7,4 u.
2. **Die vier Astronauten** vorn am Rundgang (Theta 117/99/81/63, Blick nach außen, Quelle).
3. **Halle und Röhre** links an der Kuppel, der Solar-Dreier rechts davor.
4. **Flanken:** Radar-Modul links, Funk-Modul mit Antenne rechts rahmen.
5. **Außenring:** Alienbäume und Felsen, oben die Planeten.

**Landmarken-Regel, gemessen:** Auf flachem Boden wäre die Kuppel (5,28 u) nicht das höchste Element. Höher wären die Antenne (7,61 u), Rock_Large_2 (7,98 u), Tree_Swirl_1 (7,35 u) und das Radar (6,78 u). Die Regel wird nur mit Terrain-Arbeit erfüllt:
- Die Station steht auf einem flachen Geländerücken, **+2,4 u** über dem Rundgang-Niveau. Die Kuppel sinkt 5 % ein, ihr Scheitel liegt dann bei ≈ 7,42 u.
- Die Außenmodule stehen unten an den Flanken und sinken 10–15 % ein (Gebäude 0–15 %), die Antenne endet damit bei ≤ 7,18 u.
- Bäume sinken 5–10 % ein, Felsen 25–45 % (Kanon-Tabelle). Rock_Large_2 endet damit bei ≤ 6,16 u, Tree_Swirl_1 bei ≤ 6,98 u.
- Halle (7,12 u) und Röhre bleiben unter der Kuppel.

## Raumkonzept (`space`)
- **Vordergrund (Spielkamera-Seite):**
  - das Vorfeld vor dem Rundgang (z 4–12): drei Felsen, zwei Pflanzen, vier Gras-Büschel am Wegrand (Quelle);
  - dazwischen eine dunklere Tonfläche (`tiers2`), damit der helle Pfad und die Figuren davor stehen.
- **Mittelgrund:**
  - der Rücken mit der Station;
  - der Rundgang als heller Trampelpfad auf der unteren Flanke (Ellipse 13 × 10 u um 0/−6, Quelle);
  - die vier Astronauten vorn auf dem Pfad.
- **Hintergrund:**
  - Solarfeld-Gestell, Rock_Large_1/2, die hinteren Bäume;
  - das Gelände fällt hinter dem Rücken flach ab, ohne Mauer oder Kante;
  - Nachthimmel mit drei Planeten.
- **Negativraum (≥ 30 %):** die offene violette Ebene zwischen Rücken und Außenring, links und rechts der Station, dazu der Himmel. Das ist der Platz, den die Schiffe im Orbit überfliegen (r 16–22,6 u, Höhe 6,5–14,9 u, Quelle).
- **Hell-Dunkel:**
  - hell: Kuppel, Pfad, Felsen, Planeten;
  - mittel: violetter Boden, Station;
  - dunkel: Vordergrund-Tonfläche, Außenring, Himmel.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): violette Ebene, Tonflächen und Himmel, großflächig und kontrastarm;
  - Struktur (20 %): Halle, Röhre, Radar- und Funk-Modul, Solar, Bäume, Felsen, Pfad;
  - Bedeutung (10 %): Kuppel und die vier Astronauten. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Palettenrollen (`palette_roles`)
Quelle: **Claybound-Canyon** aus dem Farbdrehbuch (`kfb-colorscript.r1`, Welt A), Stimmung V-564.
**Warum Canyon:** Der violette Tisch ist schon der fremde Planet, den die Quelle mit ihrem violetten Hintergrund `#1b1430` meint. Die orangen Tafeltürme des Canyons werden hier die Station.

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#8b68c7` | Terrain ringsum, ~60 % |
| tiers | `#a582d9` | helle Farbflächen (organisch, unabhängig von der Höhe), lila Gras-Büschel |
| tiers2 | `#7b5bb8` | dunkle Vordergrund-Tonfläche, Moos in Fugen, Bush_1/2, Plant_1/3, Solar-Bodenpanele |
| path | `#e9d8c0` | Trampelpfad des Rundgangs, Vorplatz, Sprenkel nach außen |
| rock | `#e2d0bc` | Felsen, Steinbänder, Kontakt-Steinchen, Planeten |
| structures | `#ef5a22` | Halle, Röhre, Radar- und Funk-Modul, Dach-Instrumente, Solar-Gestell |
| structures2 | `#e8743a` | Kuppel (hellerer Ton, fängt den Key) |
| accent | `#1f7a3e` | die 14 Alienbäume (Kugel- und Spiralbäume wie im Canyon), ≤ 10 % |
| sky | `#96bede` | Himmel (nachts über skyL 0,28 abgedunkelt) |

- Umfärben nach Helligkeit, die Struktur der Kit-Textur bleibt (Farbdrehbuch-Regel).
- Alle Töne Chroma ≤ 0,195 (Grenze V-565; `#ef5a22` liegt genau auf 0,195).
- 60/30/10: violett / orange Station + creme Pfad und Fels / grüne Bäume. Der nächste Akzent ist Tree_Lava_3 am Fuß der Station und führt den Blick hinein.
- Figuren behalten ihre eigenen Farben und werden nie umgetönt.

## Licht
- **Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA night**: indigo-violette Nacht, Mond-Key `#93a6ee`, warmes Figurenlicht (figI 1,7). Keine weiteren Lampen.
- **Warum Nacht:** Das ist die einzige Licht-Aussage der Quelle: `attach()` setzt den Hintergrund auf `#1b1430`, und die Planeten stehen sichtbar am Himmel.
- **Keine Praktikals:** Die Quelle hat keine Lichter. Tree_Light ist keine Lampe, der B50-Bau hat bei allen Teilen „Emission: keine“ geprüft.
- **Schatten:** echte Schatten aus dem einen Key, nach Empfänger-Palette getönt (V-564). Keine Blob-Schatten, auch nicht unter den Schiffen.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | fremde, ruhige Nacht, bewohnt und einladend: Hier draußen wohnt jemand |
| Terrain | Violett #8b68c7 (~60 %), helle Farbflächen #a582d9, dunkle Vordergrund-Tonfläche #7b5bb8; ruhig |
| Sekundär | Station und Module #ef5a22, Pfad #e9d8c0, Fels und Planeten #e2d0bc, Alienbäume #1f7a3e als kontrastarme Silhouetten im Außenring |
| Akzent (nur mit Bedeutung) | Kuppel #e8743a (hellerer Ton, fängt den Key): Landmarke und Erzählkern. Dazu die vier Astronauten in Figurenfarben auf dem hellsten Pfad: Figur. Die grüne Rolle accent der Bäume trägt nach V-566 keine Akzent-Bedeutung; die Bäume laufen als Sekundär und bekommen im Gate keine Akzent-Rolle ohne Bedeutung (M4). Tree_Lava_3 am Stationsfuß führt nur als Linie, nie heller als die Kuppel. |
| Verboten | Konverter-Grau #9fb8a0; rohe Kit-Farben; Grün oder Orange an Deko heller als die Kuppel; Leuchtfarbe an Tree_Light; Chroma > 0,195; Figuren umtönen |
| Licht | ein Rig kfb-stage-light.v1.1, MESA night (Mond-Key #93a6ee, Figurenlicht 1,7); keine Praktikals (Quelle); echte Schatten nach Empfänger getönt, auch unter den Schiffen kein Blob |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | flacher runder Geländerücken in der Ebene · abgeflachte Kugeln (Kuppel, Kugelkronen, Gras-Polster, Findlinge) · weiche Keile (Erdkeile an Halle, Kuppel und Modulen; Flanken ≤ 25°) |
| Sekundärformen (2) | gerundete Röhren- und Kastenkörper (Halle, Röhre, Module nach kfb_clay_bpy.apply) · Spiral- und Tropfenkronen der Alienbäume |
| Verbotene Formfamilie | scharfe Prismen: Landeplattform, Plattenrand, Stufe am Rücken (House_Cylinder bleibt Quellform, aber mit Knet-Kanten, nie glatte CAD-Fläche) |
| Kantenrundung | Station und Module über kfb_clay_bpy.apply rund; Felsen als runde Findlinge; Flanken ohne Stufe |
| Unregelmäßigkeit | kontrolliert: Außenring lückig, kein geschlossener Kranz; Bröckel hinten und westlich mehr; Tree_Swirl_2 links, Tree_Spikes_1 Ost (Quelle, nicht gespiegelt) |

**Lebensanker (`life_anchor`)**
- die drei Planeten drehen sich langsam (0,08 rad/s, Quelle)
- lila Gras-Büschel wiegen in Wind-Gruppen, der Deformer biegt stark (Kit §5/§6)
- Baumkronen wippen schwach, ein Baum je Gruppe (Kit §5)
- **Glaubwürdig macht es:** Wind im Gras und in den Kronen plus der langsame Himmel zeigen, dass der Planet lebt, während die Station still steht.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | Kuppel, Pfad, Felsen, Planeten |
| mittel | violetter Boden, Station |
| dunkel | Vordergrund-Tonfläche, Außenring, Nachthimmel |
| **stärkster Kontrast** | helle Kuppel gegen den dunklen Nachthimmel und die vier Astronauten auf dem hellen Pfad vor der dunklen Tonfläche, also auf dem Fokus. Prüfpunkt Value-Pass: Fels #e2d0bc ist im Wert heller als die Kuppel; die Felsen bleiben deshalb tief eingesunken im Außenring, und die Kuppel gewinnt über Höhe, Isolation und Himmelskontrast (≥ 2 Mittel). |
| ruhig | violette Ebene, Tonflächen und Himmel; Bäume als kontrastarme Silhouetten |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | Vorfeld: drei Felsen, zwei Pflanzen, Gras am Wegrand in der dunklen Tonfläche; wenige große, dunklere Formen rahmen |
| Mittelgrund | trägt die Handlung | Rücken mit Station, heller Rundgang-Pfad, die vier Astronauten: höchste Klarheit, stärkster Kontrast |
| Hintergrund | vereinfacht | Solar-Gestell, Rock_Large_1/2, hintere Bäume, flach abfallendes Gelände, Nachthimmel mit Planeten |
- **Das Terrain ist nie die lauteste Fläche:** die violette Ebene bleibt unter dem Wert von Kuppel und Pfad.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | violette Ebene, Tonflächen und Himmel |
| 20 % Struktur | Halle, Röhre, Radar- und Funk-Modul, Solar, Bäume, Felsen, Pfad |
| 10 % Bedeutung | Kuppel und die vier Astronauten; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Kuppel (Hero, Landmarke) | Farbverlust an der Wetterseite oben | Wind und Staub auf dem offenen, trockenen Rücken |
| Kuppel (Hero, Landmarke) | violetter Staubfleck am Fuß, Moos in der Fuge | Fleck: Staub vom Rundgang; Moos im Schatten am Stationsfuß |
| Halle (Gebäude) | Knete am Fuß abgerieben und staubig, Erdkeil | Abnutzung: täglicher Rundgang an der Halle vorbei |
| Radar-Modul (Echo) | Farbverlust an der Westseite, Erdkeil mit Steinchen | Westseite verwittert stärker (Biografie Schicht 3) |
| Funk-Modul (Echo) | Staubfleck am Fuß, Moos in der Fuge | steht unten an der Flanke, wo der Staub liegen bleibt |

## Materialcodes (`material_codes`, höchstens 3)
1. **Violetter Knet-Boden mit lila Gras:**
   - Form und Verteilung: Büschel in Dreier- bis Fünfergruppen am äußeren Rand des Rundgangs und am Fuß jedes Felsens und Baums (Kit §8: 3–8 je Objekt), dicht in Mulden; frei auf Pfad und Vorplatz.
   - Bewegung: Sie wiegen in Wind-Gruppen (Kit §6), der Deformer biegt Gras stark (§5).
2. **Stations-Knete:**
   - Form: Kit-Formen von Station, Modulen und Solar. Vor dem Bau durch die Eingangsprüfung (`kfb_clay_bpy.apply`), runde Kanten, Rollenton.
   - Verteilung: der Kern oben auf dem Rücken, die Module unten an den Flanken.
   - Bewegung: Die Station bleibt statisch. Nur die Planeten drehen sich langsam (0,08 rad/s, Quelle).
3. **Alien-Flora und Fels:**
   - Form und Verteilung: Quaternius-Bäume im Außenring mit Lücken, kein geschlossener Kranz. Die Felsen stecken als Grundgestein 25–45 % im Boden.
   - Bewegung: Die Kronen wippen schwach (Deformer Wobble und Biegen, Kit §5) in Wind-Gruppen, ein Baum je Gruppe. Die Felsen bleiben statisch.

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Ein flacher, trockener Geländerücken in der violetten Ebene. Darauf steht die Station, an seinen Flanken die Module, ringsum ragt altes Grundgestein heraus | Rücken +2,4 u, oben flach genug für 0–15 % Einsinken; Flanken ≤ 25°, ohne Stufe; Felsen 25–45 % eingegraben |
| 2 Nutzen | Die vier gehen jeden Tag ihre Runde. Der Pfad ist hell getreten, vorn am Empfang am hellsten; die vier Startplätze sind die hellsten Flecken, dort landen auch die Schiffe (Quelle) | Pfad-Ton-Kern auf der Ellipse → Sprenkelband 1–3 u (V-403) → Violett; Erdkeil an Halle, Kuppel und Modulen. **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Kuppel (Hero, Landmarke): Farbverlust an der Wetterseite oben (Wind und Staub auf dem offenen, trockenen Rücken); Kuppel (Hero, Landmarke): violetter Staubfleck am Fuß, Moos in der Fuge (Fleck: Staub vom Rundgang; Moos im Schatten am Stationsfuß); Halle (Gebäude): Knete am Fuß abgerieben und staubig, Erdkeil (Abnutzung: täglicher Rundgang an der Halle vorbei); Radar-Modul (Echo): Farbverlust an der Westseite, Erdkeil mit Steinchen (Westseite verwittert stärker (Biografie Schicht 3)); Funk-Modul (Echo): Staubfleck am Fuß, Moos in der Fuge (steht unten an der Flanke, wo der Staub liegen bleibt) |
| 3 Vergehen | Die Flanken des Rückens bröckeln in creme Steinchen, hinten und an der Westseite mehr | Steinbänder Grammatik §4 (Band 0–2), `nest_ok`, ungerade Gruppen |
| 4 Bewachsen | In den Fugen am Stationsfuß Moos, am Pfadrand und um die Felsen lila Gras. Auf dem Pfad und am Empfang wächst nichts | Fugen-Sprenkel `tiers2`, Gras 0–2 u vom Pfadrand, Gruppen 3/5/7 |

**Kontakt-Geometrie (V-565):** Jede Fuge wird gebrochen (`kfb_env.contact`):
- Halle, Kuppel und Röhrenstützen: Erdkeil plus Steinchen-Dreier, jeweils bergab;
- Radar- und Funk-Modul: Erdkeil plus Steinchen-Dreier zur Ebene hin;
- Solar-Bodenpanele und Solar-Gestell: Gras-Büschel an den Füßen;
- Bäume: 3–5 Gras-Büschel am Stamm;
- Felsen: Moos in der Fuge plus ein Steinchen bergab;
- Figuren stehen direkt auf dem Pfad (Bodenkontakt je Bild wie in der Quelle).

**Signatur:** Hero = Kuppel. Echos = Radar-Modul und Funk-Modul: Sie wiederholen den orangen Stationsrumpf und horchen wie die Kuppel in den Himmel. Nichts Drittes, Bäume sind keine Signatur.

## Gruppen (`groups`)
Alle aus einem Kit (Quaternius). Das Dach-Instrument sitzt auf seinem Modul und zählt mit. Kontakt-Teile zählen nicht.
- **g1 Rücken (9):** Kuppel (Anker); Halle und Röhre (Stützen); Solar-Dreier, Tree_Lava_3 (Akzente); hinten Solar-Gestell und Tree_Blob_2. Ortsgrund: Landmarke auf dem trockenen Rücken, die Panele am vorderen Hang.
- **g2 Westflanke (7):** House_Single + Roof_Radar (Anker), Tree_Floating_1, Tree_Lava_1, Tree_Blob_1, Bush_1, Rock_Large_2. Ortsgrund: Fuß der Westflanke mit freier Sicht über die Ebene; hinten das große Grundgestein.
- **g3 Ostflanke (9):** House_Cylinder + Roof_Antenna (Anker), Tree_Floating_2, Tree_Spikes_1, Tree_Swirl_1, Tree_Spiral_2, Tree_Lava_2, Bush_2, Rock_Large_1. Ortsgrund: Fuß der Ostflanke, Funkmast am Rand der Ebene.
- **g4 Vorfeld (13):** Rock_2/3/4 (Anker Rock_3), Plant_1/3, Grass_1 (2×), Grass_2, Grass_3, Tree_Spiral_1, Tree_Light_1, Tree_Light_2, Tree_Swirl_2. Ortsgrund: Außenrand des Rundgangs vor dem Empfang. Die Gras-Büschel stehen 1,8–3,8 u außerhalb des Pfads (gemessen an der Ellipse).
- Bewusst nicht symmetrisch: Tree_Swirl_2 steht im Vorfeld links, Tree_Spikes_1 an der Ostflanke (Quelle).

## Story-Beat (`story_beat`)
**Eingefrorener Moment = „Aufstellen“ (Quelle `home()`):** Alle vier stehen im Modus Astronaut auf Idle an ihren Theta-Plätzen und schauen nach außen.

Spielbar bleibt alles aus der Quelle:
- **Rundgang** gegen den Uhrzeigersinn, im gemessenen Tempo (Walk 2,167 u/s, Run 3,112 u/s, Mech 8,31/12,40 u/s);
- **Aktionen:** Winken, Jubeln, Tanzen, Springen, Kopfschütteln, Schlag;
- **Modus Mech:** je Figur 0,18 s versetzt, Wechsel mit Squash (0,2 + 0,42 s);
- **Modus Raumschiff:** Steigen über 2,4 s in den Orbit, Querneigung 0,32;
- **Rückkehr:** erst landen die Schiffe, dann wird getauscht.

## Besetzung (`cast`)
Quelle, Plätze unverändert:

| Slot | Figur | cast-ID | Varianten |
|---|---|---|---|
| S1 | Barbara the Bee | `astronaut_barbarathebee` | Astronaut ready · Mech, Schiff offen |
| S2 | Fernando the Flamingo | `astronaut_fernandotheflamingo` | Astronaut ready · Mech, Schiff offen |
| S3 | Finn the Frog | `astronaut_finnthefrog` | Astronaut ready · Mech, Schiff offen |
| S4 | Rae the Red Panda | `astronaut_raetheredpanda` | Astronaut ready · Mech, Schiff offen |

- Jede Figur hat KFB-Augen und E2-Lider, **an jeder Variante**.
- Die Astronauten sind abgenommen (B50, G1 PASS). Mech- und Schiff-Modus gehen erst in die Szene, wenn auch diese Varianten KFB-Augen haben (siehe Offene Punkte).
- Figuren nie skalieren (V-060): Quaternius-Originalgröße. Die Welt bleibt im Pack-Maßstab 1, damit alle Verhältnisse 1:1 bleiben.

## Kameras (`cameras`)
1. 45° schräg von oben über Rücken und Rundgang.
2. Augenhöhe (1 H) vom Empfang vorn (zwischen Fernando und Finn) auf die Kuppel.
3. Fuß nah: Kuppel und Röhre im Rücken (Erdkeil, Steinband, Solar-Dreier).
4. Seite Ost: Silhouette Funk-Modul mit Antenne gegen die Kuppel (Probe der Landmarken-Regel).
5. Gesicht nah: Fernando und Finn (`near_face`); Mech-Variante, sobald sie Augen hat.
6. Spielkamera (Bühnen-Orbit V-257), Standard-Blick wie RA-Key (Richtung 0,35 · 0,5 · 1), im Schiff-Modus (0,3 · 0,42 · 1).

## Referenz (`reference`)
- RA S17 `#__scifi`, Key-Ansicht und Draufsicht: Plätze, Rundgang, Orbit 1:1.
- Joyride A Claybound-Canyon: Farbwelt.
- Terrain-Design 19.10. (#439): Farbflächen, dunklere Vordergrund-Tonfläche, getönte Schatten.

## Verbote für diese Szene
- Scheibe, Platte, Bühne oder eigener Boden; Konverter-Grau `#9fb8a0`.
- Kit-Farben roh lassen; eigene Texturen; eingebackenes Licht.
- Neue Requisiten, Wege, Zäune oder Landeplatz-Markierungen.
- Plätze oder Drehungen „verschönern“; Teile skalieren.
- Lampen, Leuchtbäume als Lichtquelle, Schiffs-Scheinwerfer.
- Blob-Schatten.
- Die Begrüßung aus B50 r1 (winkt 1 s, nickt 2,5 s, schüttelt 4,5 s): Sie steht nicht in der Quelle.

## Ablauf
- **WS1:** Einpassung im Spielterrain (Rücken, Farbflächen, Pfad-Sprenkel).
- **WSB:** Eingangsprüfung (`kfb_clay_bpy.apply`) für alle 38 Teile auf die Rollen oben; Augen für die Mech-Varianten.
- **Prüfung:** Gate mit `concept.json` daneben, dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.

## Offene Punkte (Quelle lückenhaft oder widersprüchlich, nicht erfunden)
1. **Landmarke:** Die Kuppel ist auf flachem Boden nicht das höchste Element (Maße oben). Das Blatt löst es mit dem Rücken +2,4 u und Kanon-Einsinken. Soll der Boden flach bleiben wie in der RA (alle y 0), dann ist das Funk-Modul die Landmarke, und Fokus und Landmarke fallen auseinander.
2. **Maßstab:** Die RA skaliert die ganze Welt mit ×0,85 (Astronaut 2,7056 → figureH 2,3). Das widerspricht V-060. B50 baut in Originalgröße. Die Verhältnisse sind in beiden Fällen gleich. Wie Quaternius-Maß zu K2 (H = 3,64) steht, entscheidet WS1.
3. **Raumschiff-Asset:** `scifi-pack-01.json` nennt je Familie `Vehicles/GLTF/Spaceship_<Familie>.gltf`; `modefamily.js` sagt, es gibt nur einen Rumpf („Spaceship A“, Netz `Spaceship_BarbaraTheBee`) für alle vier. Der Bodenkontakt des Schiffs ist nicht gemessen (nur bbox-Lift 2,1816).
4. **Mech- und Schiff-Varianten:** Sie stehen nicht in `cast.r1.json` und haben keine KFB-Augen. Der Mech hat keine Arme im Skelett. Barbara, Finn und Rae sind in `modefamily.js` nicht gemessen. Bis zur Lieferung sind die Modi Mech und Raumschiff gesperrt. Ob im Schiff ein Gesicht sichtbar ist, ist offen.
5. **FrizzleBob-Kopf-Graft:** nicht angewendet. Beim Astronauten verdeckt der Helm das Gesicht, ein Graft ändert die Fiktion; das entscheidet Georg. Beim Mech ist der Kopf zu klein (gemessen). Nicht Teil dieser Szene.
6. **Handoff:** Umgebung, Bäume und Planeten stehen nicht im Handoff (12), die Namen kommen aus dem Git-Baum. Für die Register-Übernahme fehlt ein Handoff-Export von Environment/GLTF.
7. **Planeten:** Ob sie im Spiel als Himmels-Requisiten im Himmel des Spiels sitzen oder in der Szene bleiben, ist offen (Scenelet-todo).


## WS0-Entscheide (20.10., Art Direction)
Diese Entscheide schließen die offenen Punkte oben; was dort noch offen steht, ist hiermit beantwortet.
- Der Grat +2,4 u unter der Station ist angenommen: Terrain-Arbeit, und die Kuppel wird Landmarke.
- Maßstab: Figuren in Originalgröße (V-060). Die Umgebung behält den RA-Faktor ×0,85, damit die Verhältnisse 1:1 bleiben.
- Raumschiff: Es gelten die Daten (ein Schiff je Familie); der Kommentar in `modefamily.js` ist nachrangig. Den Bodenkontakt misst WS1.
- Mech- und Schiff-Varianten bleiben gesperrt, bis Karten und KFB-Augen vorhanden sind.
- Der FrizzleBob-Kopf-Aufsatz bleibt aus (Quelle `applied: false`).
- Fehlende Umgebungsdateien holt WS1 über die Commit-Pins aus dem Repo.
- Die Planeten kommen in R1 nicht in den Spielhimmel; es gibt einen Himmel (Skydome). Wieder offen erst mit einem Himmelskonzept.
