# Konzeptblatt · Combat Mech · weiß · Boden & Flug · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-565/V-566 · **Szene:** Resident `combat-mech`

**Quelle 1:1:** Resident Atlas S17 `data/cast.js` (Eintrag `combat-mech`, NPC_SETTINGS_01 · COMBAT-MECH-01, S16b) + `lib/atlas.js` (`hover`, `spin`), live unter `#combat-mech`.
- Die Figur, beide Instanzen (Boden und Flug), Plätze, Drehungen, Posen, Flügelwinkel, Schweben und Laufdrehung werden **nicht verändert**.
- Die Quelle hat **keine Kulisse** (`habitat: []`, „Keine Kulisse im Pack“). Neu ist nur der Ort im Terrain (Kanon Gebiet 15): Geländeform, Standplatz, Farbflächen, Kontakt-Geometrie.
- **Rang vor der Quelle:** Die Minigun sitzt nach V-536 als Verlängerung des Unterarms (Georgs Wort > RA). Das leistet das Besetzungs-Asset `combat_mech` (r2).

**Gegenbeispiel (FAIL-Muster 19./20.10., V-561):**
- Figur auf Scheibe oder Sockel;
- schwebende Figur ohne echten Schatten oder mit Blob-Schatten;
- eigene Farben, eigenes Licht, erfundene Kulisse.

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt den weißen Combat Mech zweimal, am Boden und im Flug, weil er als Wache beides kann und bereit ist, und der Spieler soll zuerst den schwebenden Flug-Mech mit seinem echten Schatten sehen.**

## Geschichte (`story`)
Der weiße Combat Mech hält Wache. Er steht breitbeinig auf festgetretenem Boden, die Minigun rechts, die Axt links. Daneben ist derselbe Mech im Flug zu sehen, die Flügel als Jetpack ausgeklappt, die Minigun im Anschlag, der Lauf dreht (Quelle: „Boden & Flug“, wie die Promo).

**Man soll fühlen:** Der kann beides, und er ist bereit.

## Bildidee (`image_idea`)
**Der weiße Mech steht auf seinem hellen, festgetretenen Fleck im violetten Gelände. Schräg dahinter schwebt sein Flug-Zwilling knapp einen Meter darüber, Flügel gespreizt, und sein echter Schatten liegt auf demselben hellen Boden.**

## Fokus und Leserichtung (`focal`)
1. **Flug-Mech (`mech_flight`):** Landmarke und höchstes Element. Unterkante 0,95 u ± 0,09, gegen den Himmel.
2. **Die drehende Minigun** am Flug-Mech.
3. **Sein Schatten** auf dem hellen Standplatz: Er zeigt die Höhe und erdet ihn.
4. **Boden-Mech (`mech_ground`)** mit Minigun und Axt.
5. **Rand:** Kante des Absatzes mit creme Steinchen.

**Landmarken-Regel:** Es gibt keine Umgebungs-Requisiten. Alle Terrain-Teile (Steinchen, Gras) bleiben unter 1,0 u, der Flug-Mech ist damit das höchste Element.

## Raumkonzept (`space`)
- **Ort in der Welt:** ein flacher Absatz im offenen Canyon-Gelände, hinten steigt das Gelände sanft an, vorn und zur Flugseite bleibt es offen. Kein Gebäude, kein Hangar.
- **Vordergrund:** offen, dunklere Tonfläche (`tiers2`), damit der helle Standplatz und die weiße Figur davor stehen.
- **Mittelgrund:** die beiden Instanzen nach Quelle: Boden bei (−1,4 / 0,35), Drehung 18°; Flug bei (1,6 / −0,3), Drehung −20°, Unterkante y 0,95.
- **Hintergrund:** sanft steigendes Gelände, keine Mauer, keine Kante; darüber Himmel.
- **Negativraum (≥ 30 %):** der Himmel über und hinter dem Flug-Mech und die offene Fläche in seine Blickrichtung. Das ist sein Flugraum.
- **Hell-Dunkel:**
  - hell: die weiße Figur zweimal, dazu der Standplatz;
  - mittel: violetter Boden;
  - dunkel: Vordergrund-Tonfläche und die Schatten.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): violetter Boden, Tonfläche und Himmel, großflächig und kontrastarm;
  - Struktur (20 %): Standplatz mit Sprenkelband, Trittmulden, Kantensteine, Gras-Gruppen;
  - Bedeutung (10 %): beide Mechs mit Minigun und Axt, der Schatten des Flug-Mechs. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Palettenrollen (`palette_roles`)
Quelle: **Claybound-Canyon** aus dem Farbdrehbuch (`kfb-colorscript.r1`, Welt A), Stimmung V-564.
**Warum Canyon:** Weiß steht maximal gegen den violetten Tisch, und die grünen Panzerteile der Figur sind genau die Akzentfarbe des Canyons. So trägt die Figur selbst den Akzent, ohne umgetönt zu werden.

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#8b68c7` | Terrain ringsum, ~60 % |
| tiers | `#a582d9` | helle Farbflächen, lila Gras-Büschel |
| tiers2 | `#7b5bb8` | dunkle Vordergrund-Tonfläche, Moos in Fugen |
| path | `#e9d8c0` | festgetretener Standplatz, Sprenkel nach außen |
| rock | `#e2d0bc` | Kantensteine, Kontakt-Steinchen |
| accent | `#1f7a3e` | keine Umgebungsfläche: Der Akzent ist das Grün an der Figur |
| sky | `#96bede` | Himmel (nahe am Promo-Blau `#3f8fd0`) |

- Alle Töne Chroma ≤ 0,195 (V-565).
- Figur und Waffen behalten ihre Textur A (weiß/grün); Figur und Waffen teilen sich das Material `combatMech`. Sie werden nie umgetönt.

## Licht
- **Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA day**: Sonne `#ffdcae`, Höhe 38°. Keine weiteren Lampen.
- **Warum Tag:**
  - Die Quelle zeigt die Figur vor hellem Promo-Blau.
  - Bei 38° Sonnenhöhe fällt der echte Schatten des Flug-Mechs ≈ 1,2 u versetzt auf den Boden (0,95 / tan 38°). Das ist die einzige Verbindung zwischen schwebender Figur und Terrain, und sie muss sichtbar sein.
- **Keine Praktikals:** Die Quelle hat weder Düsen noch Schubgeometrie noch Flammen.
- **Schatten:** echte Shadow-Map-Schatten beider Instanzen, nach Empfänger-Palette getönt (V-564). Kein Blob-Schatten unter dem Flug-Mech.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | heller Tag, wachsam und bereit: Der kann beides |
| Terrain | Violett #8b68c7 (~60 %), helle Farbflächen #a582d9, dunkle Vordergrund-Tonfläche #7b5bb8; ruhig |
| Sekundär | festgetretener Standplatz #e9d8c0, creme Kantensteine #e2d0bc |
| Akzent (nur mit Bedeutung) | Grün #1f7a3e nur an der Figur (Panzerteile, Textur A): Figur und Fokus. Keine Umgebungsfläche im Akzent. Das Weiß der Figur ist der hellste Wert im Bild. |
| Verboten | Akzent-Grün im Terrain; Düsen-, Flammen- oder Landemarken-Farben; Promo-Blau als Boden; Umtönen der Figur |
| Licht | ein Rig kfb-stage-light.v1.1, MESA day (Sonne #ffdcae, 38°); der echte Schatten des Flug-Mechs fällt ≈ 1,2 u versetzt; keine Praktikals; kein Blob |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | flacher runder Absatz mit sanft steigendem Hang dahinter · abgeflachte Kugeln (Gras-Polster, Steinchen-Nester) · weiche Keile (Absatzkante, Schürze bergab) |
| Sekundärformen (2) | flache Trittmulden unter dem Boden-Mech · runde Knet-Findlinge stone_S/M |
| Verbotene Formfamilie | scharfe Prismen: Sockel, Landeplattform, Hangar, Plattenrand |
| Kantenrundung | Absatzkante weich, ohne Stufe; Steine rund; Standplatz-Rand nur als Sprenkel |
| Unregelmäßigkeit | kontrolliert: Bröckel bergab gehäuft, Gras nach außen dichter; Gruppen 3/5 |

**Lebensanker (`life_anchor`)**
- Flug-Mech schwebt ± 0,09 u in 1,9 s und pendelt ± 3° (Quelle hover)
- Minigun-Lauf dreht 2,4 U/s (Quelle spin)
- Boden-Mech läuft Idle_B in Schleife (Quelle)
- lila Gras wiegt in Wind-Gruppen (Kit §5/§6)
- **Glaubwürdig macht es:** Der echte Schatten wandert mit dem Schweben auf dem hellen Standplatz und verbindet die Flug-Instanz mit dem Boden.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | die weiße Figur zweimal, der Standplatz |
| mittel | violetter Boden |
| dunkel | Vordergrund-Tonfläche und die Schatten |
| **stärkster Kontrast** | weißer Flug-Mech gegen violetten Boden bzw. Himmel, dazu sein dunkler Schatten auf dem hellsten Standplatz, also auf dem Fokus |
| ruhig | violetter Boden, Tonfläche, Himmel |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | offene, dunkle Tonfläche, keine Objekte |
| Mittelgrund | trägt die Handlung | beide Instanzen, Standplatz und Schatten: höchste Klarheit, stärkster Kontrast |
| Hintergrund | vereinfacht | sanft steigendes Gelände und Himmel, keine Kulisse |
- **Das Terrain ist nie die lauteste Fläche:** alle Terrain-Teile unter 1,0 u und im Wert unter der Figur.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | violetter Boden, Tonfläche und Himmel |
| 20 % Struktur | Standplatz mit Sprenkelband, Trittmulden, Kantensteine, Gras-Gruppen |
| 10 % Bedeutung | beide Mechs mit Minigun und Axt, der Schatten des Flug-Mechs; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Figur und Minigun (Hero, Landmarke) | keine Spur an der Figur: Figur und Waffen teilen das Figurenmaterial und werden nie umgetönt | Besetzungsregel (nie umtönen) |
| Standplatz (Terrain) | Trittmulden unter dem Boden-Mech | Abnutzung: Die Wache steht hier breitbeinig |
| Standplatz (Terrain) | heller, festgetretener Kern zwischen beiden Instanzen | Abnutzung: Wechsel zwischen Boden und Flug (Biografie Schicht 2) |
| Absatzkante (Terrain) | Moos in den Steinfugen, Bröckel bergab | Moos und Vergehen an der Kante |

## Materialcodes (`material_codes`, höchstens 3)
1. **Violetter Knet-Boden mit lila Gras:**
   - Form und Verteilung: Büschel in Dreiergruppen nur außerhalb des Standplatzes, nach außen dichter.
   - Bewegung: Sie wiegen in Wind-Gruppen (Kit §6), der Deformer biegt Gras stark (§5).
2. **Festgetretener Standplatz:**
   - Form: flache Knet-Flecken in Pfad-Ton, unter dem Boden-Mech zwei flache Trittmulden.
   - Verteilung: zwischen beiden Instanzen am dichtesten und hellsten, zum Rand lose Flecken, dann Sprenkel.
   - Bewegung: statisch.
3. **Creme Kantensteine:**
   - Form und Verteilung: Steinchen-Nester (stone_S/M) in ungeraden Gruppen an der Absatzkante, bergab gehäuft, Moos in den Fugen.
   - Bewegung: statisch.

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Ein flacher Absatz im violetten Canyon-Gelände; hinten steigt es sanft an, vorn ist es offen | Terrain-Form, keine Stufe, kein Sockel |
| 2 Nutzen | Hier steht die Wache und wechselt zwischen Boden und Flug. Der Platz ist festgetreten, zwischen beiden Instanzen am hellsten | Pfad-Ton-Kern → Sprenkelband 1–2 u (V-403) → Violett; Trittmulden unter dem Boden-Mech. **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Figur und Minigun (Hero, Landmarke): keine Spur an der Figur: Figur und Waffen teilen das Figurenmaterial und werden nie umgetönt (Besetzungsregel (nie umtönen)); Standplatz (Terrain): Trittmulden unter dem Boden-Mech (Abnutzung: Die Wache steht hier breitbeinig); Standplatz (Terrain): heller, festgetretener Kern zwischen beiden Instanzen (Abnutzung: Wechsel zwischen Boden und Flug (Biografie Schicht 2)); Absatzkante (Terrain): Moos in den Steinfugen, Bröckel bergab (Moos und Vergehen an der Kante) |
| 3 Vergehen | Die Kante des Absatzes bröckelt in creme Steinchen, bergab mehr | Steinband Grammatik §4 (Band 0–1), `nest_ok`, ungerade Gruppen |
| 4 Bewachsen | Außen lila Gras-Büschel, in den Steinfugen Moos. Auf dem Standplatz wächst nichts | Gras 0–2 u vom Rand, Gruppen 3/5 |

**Kontakt-Geometrie (V-565):**
- Der Boden-Mech steht in seinen Trittmulden (Figur 0–3 % eingesunken), vor jedem Fuß bergab ein Steinchen-Dreier (`kfb_env.contact`).
- Der Flug-Mech hat keinen Bodenkontakt. Sein Schatten fällt auf den Standplatz, kein Element darunter.
- Jedes Kantennest: Moos in der Fuge plus Steinchen bergab.

**Signatur (aus der Quelle):** Hero = Minigun (Slot 1, Identität). Echos = Minigun im Flug mit drehendem Lauf (Slot 5) und Axt (Slot 2). Nichts Drittes.

## Gruppen (`groups`)
- **g1 Bodenwache:** Boden-Mech (Anker), Trittmulden, Steinchen-Dreier bergab. Ortsgrund: Mitte des Absatzes, fester Stand.
- **g2 Flugplatz:** Flug-Mech (Anker, schwebt), sein Schatten auf dem hellsten Boden, Gras-Dreier am Rand. Ortsgrund: offene Seite des Absatzes zum Flugraum.
- **g3 Kante:** Steinband aus stone_M und zwei stone_S, Moos in den Fugen. Ortsgrund: Absatzkante bergab.

## Story-Beat (`story_beat`)
**Der eingefrorene Moment, Schleife nach Quelle:**
- Der Boden-Mech läuft Idle_B in Schleife (`poseFreeze: false`).
- Der Flug-Mech steht gefroren: Beine aus Jump_Idle, Oberkörper aus Running_HoldingRifle bei 0,25 s, Flügel je 38° ausgeklappt.
- Schweben ± 0,09 u in 1,9 s, Pendeln ± 3°.
- Der Minigun-Lauf dreht mit 2,4 U/s.
- Kein Wechsel zwischen Boden und Flug: Die Quelle hat keinen Start und keine Landung.

## Besetzung (`cast`)

| Slot | Figur | cast-ID | Instanzen |
|---|---|---|---|
| M1 | Combat Mech · weiß | `combat_mech` | Boden (`mech_ground`) + Flug (`mech_flight`) |

- KFB-Augen in der Visier-Nische (Besetzung r2), **an beiden Instanzen**, mit E2-Lidern.
- Figur nie skalieren (V-060): gemessen 1,957 × 2,269 × 1,487.
- Der Oliv-Zwilling `combat-mech-alt` gehört nicht in diese Szene.

## Kameras (`cameras`)
1. 45° schräg von oben über den Standplatz (beide Instanzen, Schatten).
2. Augenhöhe (1 H) von der offenen Vorderseite auf den Flug-Mech.
3. Fuß nah: Boden-Mech in den Trittmulden, Steinchen-Dreier.
4. Seite: Silhouette beider Mechs gegen den Himmel, Schwebe-Abstand und Schatten (Probe: kein Blob).
5. Gesicht nah: beide Instanzen (`near_face`, Visier-Augen).
6. Spielkamera (Bühnen-Orbit V-257), Standard-Blick wie RA-Key-Art (Richtung 0,22 · 0,2 · 1, pad 1,22).

## Referenz (`reference`)
- RA S17 `#combat-mech`: Plätze, Posen, Flügel, Schweben 1:1.
- KayKit Monthly Mystery Series 5 · Character 1 · `artwork.png` (Promo, linke Hälfte = Textur A).
- Joyride A Claybound-Canyon: Farbwelt.

## Verbote für diese Szene
- Hangar, Gebäude, Landeplattform, gemalte Landemarke.
- Scheibe, Sockel, Platte oder eigener Boden.
- Düsenflammen, Partikel, Schubgeometrie.
- Blob-Schatten oder eine Stütze unter dem Flug-Mech.
- Weitere Waffen, der Oliv-Zwilling, Umtönen der Figur.
- Eigene Lampen.

## Ablauf
- **WS1:** Ort im Spielterrain wählen und einpassen (Absatz, Standplatz, Farbflächen).
- **WSB:** Resident-Karte mit beiden Instanzen (Axt links, Flügel ±38°, `hover`, `spin`) auf dem Asset r2, Augen an beiden.
- **Prüfung:** Proof Stage G1–G7 (G6 Schattensaum mit der schwebenden Instanz), dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.

## Offene Punkte (Quelle lückenhaft oder widersprüchlich, nicht erfunden)
1. **Brief gegen Quelle:** Der Combat Mech steht in `data/cast.js` (KayKit, S16b), nicht in `lib/modefamily.js`. Dort liegt die Quaternius-Familie (Astronaut / Mech / Raumschiff, Fernando). Der FrizzleBob-Kopf-Graft gehört dorthin und betrifft diese Szene nicht.
2. **Ort in der Welt:** `townRole` sagt „Hangar-Wache in zwei Zuständen“, aber es gibt keinen Hangar (Pack und Quelle ohne Kulisse). Er wird nicht gebaut. Neben welchem Spielort der Absatz liegt, ist offen (WS1/Georg).
3. **Zwei Instanzen gleichzeitig:** Die Quelle zeigt denselben Mech zweimal, wie die Promo. Das bleibt 1:1. Wie das im Spiel logisch zu lesen ist (eine Figur an zwei Orten), ist offen.
4. **Kein Start und keine Landung:** Die Quelle hat keinen Übergang Boden ↔ Flug. Die Einpassung bei der Landung ist deshalb nur der Standplatz. Ein Lande-Beat wäre neu und ist nicht Teil dieses Blatts.
5. **Waffenhaltung:** In der RA hängt die Minigun am Handslot (Idle_B, slotAxis Z→vorn). V-536 verlangt Unterarm-Achse, und V-536 hat Vorrang. Ob das Asset r2 (Duell-Fassung, Minigun einhändig an lowerarm.r) die Bodenpose Idle_B mit Axt links und die Flugpose trägt, ist nicht belegt.
6. **Augen:** Die RA-Notiz sagt „kein Batch-Augenprofil, Visier ohne Augeninsel“, die Besetzung sagt „KFB-Augen in der Visier-Nische“ (r2). An der Flug-Instanz zu prüfen.
7. **Kein Schieß- und kein Zielclip:** Die Promo-Haltung „Waffe vor dem Bauch“ ist eine Clip-Lücke (RA open).
8. **Schatten der Schwebe-Figur:** Ein Schattenvertrag für eine schwebende Figur ist nicht festgelegt. Der echte Schatten muss bei 0,95 u Höhe gemessen werden (G6).


## WS0-Entscheide (20.10., Art Direction)
Diese Entscheide schließen die offenen Punkte oben; was dort noch offen steht, ist hiermit beantwortet.
- Ort: Es wird kein Hangar gebaut. Der Mech steht am Rand der nächsten Fahrzeug- bzw. Start-Zone des Canyons, die Stelle legt WS1 im Spielterrain fest.
- Beide Instanzen gleichzeitig wie in der Promo: bleibt so.
- Minigun auf der Unterarmachse (V-536) geht vor der Hand-Slot-Montage des RA.
- Augen in der Visier-Nische: Pflicht-Prüfung G1 an beiden Instanzen. Ohne Nachweis keine Abgabe.
- Der Schatten des schwebenden Mechs ist der echte Sonnenschatten aus dem einen Rig, getönt (V-564), kein Blob. Das ist jetzt Kanon für alle schwebenden Figuren.
- Start, Landung und Schuss-Clips fehlen in der Quelle; sie werden nicht erfunden (Backlog).
