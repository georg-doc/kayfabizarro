# Konzeptblatt · Fight Sandbox 02 · Cartoon-Kontakt · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-565/V-566 · **Szene:** `resident-fight-sandbox-02`

**Quelle 1:1:** Resident Atlas S17 `data/fight-sandbox-02.json` + `media/3D_Assets/Animations/KFB_Motion_Library/fight/KFB_Fight_Cartoon_Contact.json` (0.2) + `lib/fight-sandbox-02.js`, live unter `#__fight`.
- **Bleibt unverändert:**
  - Besetzung, vier Paarungen und 6 Proof-Posten;
  - 17 Angriffe × 9 Reaktionen (68 Tabelleneinträge);
  - Clownhammer an `handslot.r`;
  - FX-Werte und Ring-Maße.
- **Neu** ist nur die **Einpassung ins Terrain** (Kanon Gebiet 15).
- **Verbindlich von Georg:**
  - 30.09.: Befunde F1–F6, alle offen;
  - 01.10.: „später feintunen, weitere Animationen“;
  - 04.10.: Der Ring ist eine **Stage-Instanz je Szene**, die Größe folgt der Besetzung, die Seile sind **Gummibänder**;
  - V-560: Brawl-Wolke nach V-499.
- **Figuren und Aktion** sind abgenommen (B50 Wrestling PASS). Dieses Blatt betrifft nur die Umgebung.

**Gegenbeispiel (FAIL):**
- Platzhalter-Ring auf neutralem Atlas-Boden.
- Ring als Podest mit Matte, Schürze und Stufen, aufs Gelände gestellt (B50-Fassung).
- Staubwolke als Kugelstapel (V-560).
- Eigene Farben, eigenes Licht.

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt eine Cartoon-Rauferei zweier Orks im Ring der Ork-Band, weil Raider und Brute hier nach Cartoon-Regel kämpfen, bei der niemand den anderen berührt, und der Spieler soll zuerst den hellen Knet-Puff am Kontaktpunkt sehen.**

## Geschichte (`story`)
Am Rand von O-Town hat die Ork-Band ihren Ring in den Boden geschlagen. Laut Besetzungsliste sind Raider und Brute ihr Gitarrist und ihr Drummer, und ihre Band-Zone liegt in O-Town (Disco-Blatt). Hier wird gerauft, nach Cartoon-Regel: Niemand berührt den anderen. Hit-Stop, Squash, Knet-Puff und Rückstoß verkaufen jeden Treffer. Wenn es richtig losgeht, verschwinden beide in einer Staubwolke. **Man soll fühlen:** Raufen ist ein Spaß, und am Ende steht jeder wieder auf.

## Bildidee (`image_idea`)
**Mitten im Ring, auf festgetretenem Petrol-Boden mit hellen Scharrspuren, platzt zwischen zwei Orks ein heller Knet-Puff. Es ist der Treffer, der nie berührt. Die goldenen Gummiseile rahmen ihn, und der Boden wird nach außen ruhiger, mit Gras-Büscheln.**

## Fokus und Leserichtung (`focal`)
**Landmarken-Regel:**
- Landmarke ist der Ring mit 4 Pfosten von 1,9 m (Quelle), das höchste gebaute Element.
- Figuren zählen nicht als Landmarke; der Brute ist größer.
- Der Ring rahmt den Fokus, so führt die Landmarke zum Fokus.

Leserichtung:
1. **Kontaktpunkt / Knet-Puff** in der Ringmitte, der hellste Wert im Bild (bei der Keilerei die Staubwolke).
2. **Die zwei Kämpfer** in Box-Stellung bzw. Aktion.
3. **Gummiseile und Eckpfosten**, die goldene Rahmung.
4. **Rand:** die Steinnester an den Ecken hinten rechts und vorn links.
5. **Hinten** steigt das Gelände an.

## Raumkonzept (`space`)
- **Vordergrund (Spielkamera-Seite):**
  - offen;
  - die Ecke vorn rechts bleibt kahl (Negativraum);
  - dunklere Tonfläche des Terrains (#439), damit der Puff leuchtet.
- **Mittelgrund:** Ring nach Quelle. Der Kampf-Anker liegt in der Ringmitte. Das Ringinnere bleibt bis auf die zwei Kämpfer frei (Negativraum ≥ 30 %, Platz für Rückstoß und Wolken-Drift von 2 m).
- **Hintergrund:** Das Gelände steigt hinter dem Ring sanft an und schließt den Platz, ohne Mauer und ohne Zuschauer.
- **Hell-Dunkel:**
  - hell: Puff bzw. Wolke, Scharrspuren in der Mitte;
  - mittel: Petrol-Boden;
  - dunkel: Gras-Büschel außen, Vordergrund-Tonfläche, die Schatten der Pfosten.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): Petrol-Boden um den Ring und die Vordergrund-Tonfläche, großflächig und kontrastarm;
  - Struktur (20 %): Pfosten und Seile, Scharrspuren, die Eck-Steinnester, Gras-Gruppen;
  - Bedeutung (10 %): Knet-Puff bzw. Staubwolke, die zwei Kämpfer, der Clownhammer. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Palettenrollen (`palette_roles`)
**Welt: O-Town** aus dem Farbdrehbuch V-406 (Joyride C). **Warum:** Raider und Brute sind Mitglieder der Ork-Band, deren Zone in O-Town liegt. Auf Petrol (L 0,66) bleibt der creme Puff klar heller als der Ringboden, genau das verlangt die Quelle („Heller als der Ringboden, sonst verschwindet der Puff“).

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#3aa596` Petrol | Terrain ringsum und Ringboden, ~60 % |
| path | `#f3e6c8` | Scharrspuren im Ring (Sprenkel, Mitte dicht); Knet-Puff und Staubwolke (statt Quelle #f0e6d2, fast gleich) |
| stone | `#e0679f` | Rand-Bröckel, Eck-Steinnester |
| tiers | `#2f8f83` | Gras-Büschel außerhalb der Seile |
| frame | `#e9b53b` | Ring: Pfosten und Gummiseile (statt Quelle #8a7a66 / #c9b89a) |
| accent | `#f08a2c` | Clownhammer, leicht getönt (V-286), ≤ 10 %, führt beim Prop-Treffer zum Fokus |
| sky | `#a8d8b9` | Himmel |

- Figuren behalten ihre eigenen Farben und werden nie umgetönt.
- Der Puff verliert das Quell-Emissive (0x2a2218), weil VFX ohne Emission arbeitet (Kanon §11).

## Licht
- **Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA day**: Mittags-Rauferei, hohe Sonne, kurze Schatten unter den Kämpfern. So erdet der Kontaktschatten jede Landung und jeden Sturz.
- **Figurenlicht nach Regel 11 (V-386):** warm und schattenlos für die Kämpfer-Gruppe, tagsüber kaum sichtbar.
- **Keine Praktikals:** Die Quelle hat keine Lampe, keinen Strahler, keine Fackel.
- **Schatten:** echte Schatten aus der Sonne, nach Empfänger-Palette getönt (V-564). Keine Blob-Schatten.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | Mittags-Rauferei, Spaß ohne Schmerz: Am Ende steht jeder wieder auf |
| Terrain | Petrol #3aa596 ringsum und als Ringboden (~60 %), Gras #2f8f83 außerhalb der Seile, vorn die dunklere Tonfläche (#439); ruhig |
| Sekundär | Pfosten und Gummiseile #e9b53b (goldene Rahmung), Eck-Steinnester #e0679f, Scharrspuren #f3e6c8 |
| Akzent (nur mit Bedeutung) | (1) Knet-Puff und Staubwolke im Pfad-Ton #f3e6c8 als hellster Wert: Erzählkern und Fokus. (2) Orange #f08a2c nur am Clownhammer (Interaktion, Prop-Treffer), ≤ 10 %. |
| Verboten | Emission an Puff und Wolke; Orange an Deko; rot-blaue Matte oder Schürze; Quell-Grau der Pfosten #8a7a66; Figuren umtönen |
| Licht | ein Rig kfb-stage-light.v1.1, MESA day (hohe Sonne, kurze Schatten), Figurenlicht nach Regel 11; keine Praktikals; echte Schatten nach Empfänger getönt |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | flacher runder Platz mit sanft steigendem Hang dahinter · abgeflachte Kugeln (Puff und Wolke als eine Masse mit Beulen, Gras-Polster, Bröckel) · weiche Keile (Erdkeile an den Pfosten, Hangschürze) |
| Sekundärformen (2) | gerundete Pfosten, tief eingegraben · weich durchhängende Gummiseile |
| Verbotene Formfamilie | scharfe Prismen: Matte, Podest, Ringboden-Platte, Schürze, Stufen |
| Kantenrundung | Pfosten mit Knet-Kanten (Eingangsprüfung); Ringboden ohne Kante, Scharrspuren laufen als Sprenkel aus |
| Unregelmäßigkeit | kontrolliert: Ecke vorn rechts kahl, größtes Nest hinten rechts, kleines vorn links; Gras 3/5/7 |

**Lebensanker (`life_anchor`)**
- Gummiseile federn und schicken die Kämpfer zurück in den Ring (Georg 04.10.)
- Puff und Staubwolke steigen aus dem Bodenton auf, die Wolke driftet 2 m in 2–3 s (Quelle)
- Gras-Büschel wiegen in Wind-Gruppen; eine Seil-Landung stößt die nächste Gruppe an (Kit §6/§8)
- **Glaubwürdig macht es:** Jeder Treffer bewegt Seile, Staub und Gras; Hit-Stop und Squash verkaufen den Kontakt, der nie stattfindet.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | Puff bzw. Wolke, Scharrspuren in der Ringmitte |
| mittel | Petrol-Boden |
| dunkel | Gras-Büschel außen, Vordergrund-Tonfläche, Schatten der Pfosten |
| **stärkster Kontrast** | creme Puff gegen den Petrol-Ringboden in der Ringmitte (Quelle: heller als der Ringboden), also auf dem Fokus |
| ruhig | Petrol-Boden um den Ring und die Vordergrund-Tonfläche |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | offen, dunkle Tonfläche, die kahle Ecke vorn rechts |
| Mittelgrund | trägt die Handlung | Ring mit den zwei Kämpfern, Puff und Seilen: höchste Klarheit, stärkster Kontrast |
| Hintergrund | vereinfacht | sanft steigendes Gelände mit Gras, ohne Mauer und Zuschauer, weniger Detail |
- **Das Terrain ist nie die lauteste Fläche:** Petrol bleibt unter dem Wert des Puffs; Scharrspuren nur in der Mitte dicht.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | Petrol-Boden um den Ring und die Vordergrund-Tonfläche |
| 20 % Struktur | Pfosten und Seile, Scharrspuren, die Eck-Steinnester, Gras-Gruppen |
| 10 % Bedeutung | Knet-Puff bzw. Staubwolke, die zwei Kämpfer, der Clownhammer; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Ring (Hero, Landmarke) | Pfosten unten mit Erdspritzern und Erdkeil | Fleck: tief eingeschlagen, Scharren der Kämpfer |
| Ring (Hero, Landmarke) | Gummiseile in der Mitte heller abgerieben | Abnutzung: Die Kämpfer federn immer an derselben Stelle hinein |
| Ring (Hero, Landmarke) | Moos am hinteren rechten Pfosten | Moos: Hangseite, wenig begangen |
| Clownhammer (Echo) | Schlagfläche matt abgerieben | Abnutzung durch Prop-Treffer |

## Materialcodes (`material_codes`, höchstens 3)
1. **Petrol-Knete-Boden:**
   - Form: Gras-Büschel, nie Einzelhalme.
   - Verteilung: in Dreier- und Fünfergruppen außerhalb der Seile, nach außen dichter; im Ring nichts.
   - Bewegung: Die Büschel wiegen in Wind-Gruppen (Environment-Kit §6/§8). Landet ein Kämpfer in den Seilen, stößt das die nächste Gruppe an.
2. **Festgetretener Ringboden:**
   - Form: Petrol mit cremefarbenen Scharr-Sprenkeln, flach und ohne Platte.
   - Verteilung: Die Sprenkel sind in der Mitte am dichtesten (Kampf-Anker) und laufen zu den Seilen hin aus.
   - Bewegung: Puff und Wolke steigen aus genau diesem Ton auf, denn der Staub ist der Boden.
3. **Ring-Gerät:**
   - Form: Pfosten und Gummiseile aus dem Kit, vorher durch die Eingangsprüfung (`kfb_clay_bpy.apply`), dann Knete im frame-Ton; der Clownhammer im accent-Ton.
   - Verteilung: 4 Pfosten tief eingegraben.
   - Bewegung: Die Seile federn als Gummibänder (Georg 04.10.) und schicken die Kämpfer zurück in den Ring.

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Ein flacher Platz am O-Town-Rand, hinten sanft ansteigend | Terrain-Form, keine Stufen, kein Sockel, keine Matte |
| 2 Nutzen | Im Ring ist der Boden festgetreten und zerschrammt, am meisten in der Mitte. Die Pfosten stecken tief im Boden, als wären sie vor Jahren eingeschlagen worden | Scharr-Sprenkel path-Ton, Sprenkelband zu den Seilen (V-403); Erdkeil an jedem Pfosten. **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Ring (Hero, Landmarke): Pfosten unten mit Erdspritzern und Erdkeil (Fleck: tief eingeschlagen, Scharren der Kämpfer); Ring (Hero, Landmarke): Gummiseile in der Mitte heller abgerieben (Abnutzung: Die Kämpfer federn immer an derselben Stelle hinein); Ring (Hero, Landmarke): Moos am hinteren rechten Pfosten (Moos: Hangseite, wenig begangen); Clownhammer (Echo): Schlagfläche matt abgerieben (Abnutzung durch Prop-Treffer) |
| 3 Vergehen | Außerhalb der Seile bröckelt der Boden in magentafarbene Steinchen, hinten rechts an der Hangseite mehr | Steinbänder Grammatik §4 (Band 0–2), `nest_ok`, ungerade Gruppen |
| 4 Bewachsen | Gras-Büschel außerhalb der Seile, Moos in den Fugen der Steinnester. Im Ring wächst nichts | Gras 0–2 m vor den Seilen, Gruppen 3/5/7, Fugen-Sprenkel |

**Kontakt-Geometrie (V-565):** Jede Fuge wird gebrochen (`kfb_env.contact`):
- an jedem Pfosten ein Erdkeil plus ein Steinchen-Dreier bergab;
- am hinteren rechten Pfosten zusätzlich Moos;
- Figuren stehen direkt auf dem Terrain;
- liegende Figuren (F5) brauchen im Ring einen ebenen Boden ohne Steinchen.

**Signatur:** Hero = der Ring (Pfosten + Gummiseile); Echo = der Clownhammer (Prop-Treffer). Nichts Drittes.

## Gruppen (`groups`)
- **g1 Ecke hinten rechts:**
  - Pfosten (Anker) + größtes Steinnest + Erdkeil + Moos;
  - Ortsgrund: Hangseite, hier rollt Geröll vom ansteigenden Gelände heran.
- **g2 Ecke vorn links:**
  - Pfosten (Anker) + kleines Steinnest + Gras-Dreier;
  - Ortsgrund: Zugang von der Spielkamera-Seite, wo man zum Ring tritt.
- **g3 Ecke hinten links:**
  - Pfosten (Anker) + Gras-Fünfer;
  - Ortsgrund: Übergang zum Hang, weniger begangen.
- **Ecke vorn rechts:** nur Pfosten mit Kontakt-Steinchen, kahl als Negativraum. So ist der Platz bewusst asymmetrisch.
- Jede Gruppe ungerade (Gate G1). Kontakt-Steinchen zählen nicht in die Gruppenregeln.

## Story-Beat (`story_beat`)
Die 6 Proof-Posten der Quelle in Quell-Reihenfolge. Standard ist `headbutt`, Raider gegen Raider.
1. **headbutt:** Kopfstoß → Schlag einstecken → benommen.
2. **kick_knockdown:** Tritt → stehend sterben links; der Angreifer verspottet.
3. **flying_kick:** Flugtritt → Uppercut einstecken.
4. **prop_hit:** Schwertangriff mit Clownhammer → Reaktion; der Hammer trifft den Puff, nicht die Hand.
5. **dust_cloud_brawl:**
   - Anlauf, dann verbirgt eine Wolke beide;
   - Faustkampf-Loop, Hand, Fuß oder Hammer ragen heraus;
   - die Wolke wandert 2 m in 2–3 s;
   - Auswurf: einer fällt flach und steht auf, der andere bleibt benommen.
6. **shoulder_throw:** nur Brute gegen Brute, sonst gesperrt.

Für jeden Treffer gilt:
- Kontaktbild → 4 Bilder Hit-Stop;
- Squash 1,1/0,9 über 6 Bilder;
- Puff 0,25 m × Maßstab;
- Reaktion ab Impact-Bild, Rückstoß vom Angreifer weg.

Dazu der Freimodus.

## Besetzung (`cast`)
| Slot | Figur | Rig | Fassung |
|---|---|---|---|
| A / B | Orc Raider (`orc_raider`) | Rig_Medium | Variante `fight` (B50), KFB-Augen aus Band-Karte proof-r1 |
| A / B | Orc Brute (`orc_brute`) | Rig_Large | Variante `fight` (B50), KFB-Augen aus Band-Karte proof-r1 |

- Vier Paarungen aus der Quelle (Raider|Raider, Raider|Brute, Brute|Raider, Brute|Brute).
- Jede Figur hat KFB-Augen und E2-Lider, an jeder Variante, also auch an jeder künftigen Textur-B-Fassung.
- In Box-Stellung bei 0,0 s ist die Deckung offen. Bei 0,5 s verdeckt sie die Augen; das ist die Pose, kein Fehler.

## Kameras (`cameras`)
1. 45° schräg von oben über den Ring.
2. Augenhöhe (1 H) vom Zugang vorn links auf die Ringmitte.
3. Fuß nah: Pfosten hinten rechts (Erdkeil, Steinnest, Moos).
4. Seite: Ringrand rechts, Seil-Silhouette vor dem ansteigenden Gelände (quer zur Angriffsachse wie Quelle `view('side')`).
5. Gesicht nah: Raider und Brute in Box-Stellung bei 0,0 s.
6. Spielkamera (Bühnen-Orbit V-257).

## Referenz (`reference`)
- RA S17 `#__fight`, Proof-Posten 1–6: Abstände, Puff, Wolke 1:1.
- Joyride C O-Town: Farbwelt; Disco-Blatt für die Band-Zone.
- Terrain-Design 19.10. (#439): Farbflächen, dunklere Vordergrund-Tonfläche, getönte Schatten.

## Verbote für diese Szene
- Matte, Podest, Ringboden-Platte, Schürze, Stufen (nicht in der Quelle, Kanon B1).
- Zuschauer, Bänke, Fahnen oder andere neue Requisiten.
- Wolke als Kugelstapel oder mit Emission.
- Ring, der mit jedem Posten wandert, auf dem Gelände (siehe Offene Punkte).
- Kämpfer-Abstände „verschönern“.
- Eigene Lampen.

## Offene Punkte (Quelle lückenhaft oder widersprüchlich, nicht durch Erfinden gelöst)
1. **Standard-Paarung:** Der Titel sagt „Orc Raider / Orc Brute“, der Startzustand ist Raider gegen Raider (`rigA = rigB = Rig_Medium`). Zwei gleiche Raider mit derselben Textur wirken wie Klone. Textur B (V-466) steht nicht in der Quelle.
2. **Ring wandert:** `stage()` verschiebt und dreht den Ring je Posten (Mitte, Angriffsachse). Im Terrain steht der Ring fest. Vorschlag aus der Quelle: D4-Standard „Anker zur Mitte“. Georg bestätigt.
3. **Ringgröße:** Die Quelle sagt 9 m. Georg sagt am 04.10.: Größe je Instanz nach Besetzung. F3: Brutes fliegen durch die Seile. Das WSB-Maß ×1,51 für Raider gegen Brute liegt vor, ist aber nicht Quelle. Die Gummiseile sind gesetzt.
4. **B50-Ring:** Matte 0,8 u, rot-blaue Schürze und Stufen stehen nicht in der Quelle (die sagt: kein eigener Boden) und widersprechen Kanon Gebiet 15. Aus B50 werden nur die Pfosten und das Seil-Rig übernommen.
5. **Wolke und Puff:**
   - Die Quelle nutzt 22 bzw. 9 Kugeln mit Emissive.
   - Kanon §11 und V-560 verlangen eine Masse mit Beulen, ohne Emission. Die Form kommt aus WSB B51; Größe, Drift und Zeit kommen aus der Quelle.
6. **Georg-Befunde F1, F2, F4, F5 offen:**
   - F1: Rücken an Rücken;
   - F2: Hammer im Körper (Hammer-Space r1b);
   - F4: Wolken-Blickrichtung weicht um 95° ab, kein Aufprall-Moment;
   - F5: liegende Figuren im Boden.
   - Hier wird nichts davon gelöst; der Ringboden muss nur eben bleiben.
7. **Clownhammer und V-536:** Die Quelle hängt ihn an `handslot.r`. Als Hiebwaffe fällt er unter die Ausnahme q136 (V-562), Georg bestätigt.
8. **Atlas-Licht:** Die Quell-Bühne nutzt das neutrale Atlas-Licht; hier gilt nur das Welt-Rig.

## Ablauf
- **WS1 (Paket E):** Einpassung im Spielterrain O-Town, fester Ring-Anker.
- **WSB:**
  - Pfosten und Seil-Rig (B50) ohne Matte;
  - Eingangsprüfung und Knete im frame-Ton, Clownhammer im accent-Ton;
  - Wolke B51.
- **WSA:** Stage-Instanz (`kfb.resident-stage/0.1`, WSA-STAGE-01).
- **Prüfung:** Gate mit `concept.json` daneben, dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.


## WS0-Entscheide (20.10., Art Direction)
Diese Entscheide schließen die offenen Punkte oben; was dort noch offen steht, ist hiermit beantwortet.
- Paarung: Raider (A) gegen Brute (B), wie Titel und Band-Besetzung sagen. Raider gegen Raider bleibt Prüf-Option.
- Der Ring steht fest im Terrain, verankert in der Mitte (Quell-Option „anchor to centre“), Größe 9 m.
- Vom B50-Ring kommen nur die Pfosten und das Seil-Rig. Matte, Schürze und Treppe entfallen; der Ringboden ist gestampftes Terrain.
- Die Wolke ist nicht die Kugel-Wolke der Quelle, sondern die B51-Cartoon-Wolke (V-560, PASS).
- Der Clown-Hammer ist eine Hiebwaffe; die q136-Ausnahme gilt.
- Georgs Befunde F1, F2, F4 und F5 bleiben als bestehende Hub-Punkte offen.
