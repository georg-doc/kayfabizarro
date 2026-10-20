# Konzeptblatt · Resident Friedhof · Dancing Skeletons · R1 · 2026-10-20 · WS0
**Vorlage:** `30_DECISIONS/CANON_3D/KONZEPTBLATT_R1.md` · **Kanon:** V-563/V-564/V-565/V-566 · **Szene:** `resident-graveyard-01`

**Quelle 1:1:** Resident Atlas S17 `data/graveyard-01.json` + `lib/graveyard.js`, live unter `#__graveyard`.
- Das Layout steht im Code: ein Nachbau von KayKit `sample.png` (Halloween Bits, 63 Modelle, Pin `10a2c5e2`).
- Besetzung, Startplätze, alle Platzierungen (x, z, Drehung), Tanzzone, Clips, Zerfall und Zusammensetzen, Knochenflug, Taumeln und Titel werden **nicht verändert**.
- Neu ist nur die **Einpassung ins Terrain** (Kanon Gebiet 15). Das heißt hier zusätzlich:
  - Die Bodenkacheln der Quelle (`floor_dirt`, `floor_dirt_small`, `floor_dirt_grave`) sind ein eigener Boden aus 0,53 dicken Platten. Sie entfallen.
  - Ihr Umriss wird zur Farbfläche im Terrain (Kanon 15 (1)).

**Gegenbeispiel:**
- Blender-Nachbau vom 19.10.: TUNE „zu symmetrisch“ (V-561, V-456);
- Dioramen auf Scheiben mit eigenen Farben und eigenem Licht (V-561);
- der RA-Stand selbst: Kachelboden, eigenes Mondlicht, eigener Hintergrund `#17131f`, Biom-Boden `#7d8458`.

---

## Ein Satz (`one_sentence`)
**Diese Szene zeigt Skelette, die nachts im Vorhof der Gruft tanzen, zerfallen und sich wieder zusammensetzen, weil auf diesem alten Hangfriedhof der Tod nur eine Pause im Takt ist, und der Spieler soll zuerst die hohe Gruft mit den bleichen Tänzern davor sehen.**

## Geschichte (`story`)
Ein alter, eingezäunter Friedhof am Hang, die Gruft hinten, das Bogentor vorn zum Weg. Nachts tanzen die Skelette im Vorhof der Gruft:
- acht Takte lang, jeder seinen eigenen Tanz;
- sie stolpern, prallen an Grabsteinen und aneinander ab;
- dann fallen sie auseinander, die Knochen fliegen, und zum nächsten Takt setzen sie sich wieder zusammen.

Vor dem Tor liegt ein Sarg am offenen Grab, Kürbisse leuchten. **Man soll fühlen:** Hier ist der Tod nur eine Pause im Takt.

## Bildidee (`image_idea`)
**Bleiche Skelette tanzen auf dunkler Friedhofserde vor der hohen Gruft. Der Friedhof liegt schief im Hang: links stehen dichte Kiefern auf der Höhe, rechts sackt der Boden ab und der Zaun zerfällt.**

## Fokus und Leserichtung (`focal`)
1. **Gruft:** Landmarke und höchstes Element (8,0 hoch; die Kiefern erreichen 6,9), hinten bei (10 / −16,2), Endpunkt des Wegs.
2. **Skelette im Vorhof:** Tanzzone x 3,6–16,2 · z −11,6…−4,6 (Quelle). Sie sind die hellsten Werte im Bild: Knochenweiß plus das Figurenlicht der Nacht-Stimmung.
3. **Pflasterweg Tor → Gruft:** führt das Auge zurück zum Fokus.
4. **Kürbislichter:** zwei am Tor (6,4 / 2,6 und 16,2 / 2,8) rahmen den Eingang, eins am linken Zonenrand (1,6 / −11,2), eins hinten rechts (17,6 / −18,6).
5. **Ränder:** Andachtsecke links, Sarg und Schrein rechts, Kiefernhain hinten links.

## Raumkonzept (`space`)
Quellrahmen: +x nach rechts, Tor vorn bei z = 0, Gruft hinten.
- **Vordergrund (vor dem Tor, z > 0):**
  - die Außenstreu der Quelle: Sarg, offenes Grab, zwei Laternen, Kürbisse, Kreuze, Bank;
  - der Weg franst aus;
  - die dunklere Tonfläche des Terrains (#439) liegt vorn.
- **Mittelgrund:**
  - die Einfriedung (drei Zaunläufe, hinten offen, Quelle);
  - die Tanzzone ist Negativraum ≥ 30 %, frei bis auf die Quell-Hindernisse;
  - dunkles Erdfeld.
- **Hintergrund:**
  - die Gruft auf etwas höherem Grund;
  - dahinter die große gelbe Kiefer (12,6 / −21,8) und zwei orange;
  - links der Kiefernhain auf dem Hügel;
  - keine Mauer.
- **Hell-Dunkel:**
  - hell: Skelette, Pflaster-Kern;
  - mittel: violetter Boden, Grabsteine, Gruft;
  - dunkel: Erdfeld-Ränder, Kiefernhain links, Hang rechts unten, Eisenzaun.
- **70/20/10 (V-566, ersetzt 70/30):**
  - Ruhe (70 %): violette Wiese außen, Erdfeld und Hügel, großflächig und kontrastarm;
  - Struktur (20 %): Zaun und Tor, Grabsteine, Schreine, Pflasterweg, Außenstreu, Kiefern;
  - Bedeutung (10 %): Gruft, die Skelette mit den fliegenden Knochen, die Kürbislichter. Hier liegt der stärkste Kontrast.
- **Wertstruktur und drei Tiefenebenen:** siehe „Bildanatomie (V-566)“.

## Gegen Symmetrie (V-456, TUNE 19.10.)
Die Quelle hat eine Achse: Tor (x = 10) → Weg → Gruft (x = 10). Positionen bleiben. Gebrochen wird nur über das Terrain und die Biografie:
1. **Gelände schief:**
   - steigt nach hinten links an, der Kiefernhain steht auf der Höhe;
   - fällt nach rechts zum zerfallenen Zaun-Lauf 3 ab;
   - die Tanzzone bleibt eben;
   - die Einfriedung liegt damit schief im Hang, nicht auf einem Tisch.
2. **Erdfeld ohne Rechteck:**
   - folgt dem Kachel-Umriss der Quelle: vorn ausgefranst, drei Ecken fehlen (−2 / −22, 22 / −22, 22 / 2);
   - läuft links in den Weg-Abzweig zur Andachtsecke;
   - rechts als Sprenkel in den Hang;
   - kein Raster sichtbar.
3. **Weg:** Das Pflaster der Quelle ist schon unsymmetrisch (Abzweig links zu Andachtsplatte, Grab und Schrein; außen Bogen nach links zur Laterne). Moos und Sprenkel verstärken genau diese Abzweige.
4. **Biografie ungleich:** links gepflegt (Bänke, Andachtsplatte), rechts Vergehen (Zaun-Lauf 3 kaputt, Steinbänder bröckeln, mehr Bewuchs).
5. **Zaun folgt dem Gelände:**
   - Lauf 1 steigt nach hinten, Lauf 3 fällt;
   - die Pfeiler sinken innerhalb der Einsinken-Spanne verschieden tief ein.
6. **Kameras:** nie auf der Achse Tor–Gruft (Kamera 2 steht versetzt am Abzweig).

## Palettenrollen (`palette_roles`)
**Welt:** Claybound-Canyon aus dem Farbdrehbuch V-406 (Joyride A), Stimmung V-564.
**Warum:** Das Halloween-Kit bringt Orange schon mit (Kürbisse, orange und gelbe Kiefern). Im Canyon ist Orange die Strukturrolle auf violettem Grund, und Violett unter Nachtlicht liest sich als Spuk.

| Rolle | Ton | Wo |
|---|---|---|
| ground | `#8b68c7` | Wiese außen, ~60 % mit Erdfeld und Hügel |
| earth | `#7b5bb8` (`tiers2`) | Friedhofserde innen, Umriss der Quell-Kacheln |
| hill | `#a582d9` (`tiers`) | Hügel hinten links; violette Gras-Büschel |
| path | `#e9d8c0` | Pflaster `path_A–D` (getönt) |
| stone | `#ab7de7` (Harmonie-Zeile `rock`) | Gruft, Grabsteine, Kreuze, Schreine, Tafeln, Säulen, Torbogen, Zaunpfeiler |
| iron | `#67489a` (Harmonie-Zeile `under0`) | Zaunfelder, Torflügel, Galgen-Laterne |
| wood | `#ce826b` (Harmonie-Zeile `trunk`) | kahle Bäume, Bänke, Särge |
| structures | `#ef5a22` | orange Kiefern, orange Kürbisse (`frame` = gleicher Ton) |
| pad | `#f7cd36` (Harmonie-Zeile `pad`) | gelbe Kiefern, gelbe Kürbisse |
| accent | `#1f7a3e` | Moos in Pflasterfugen und an Steinfüßen, ≤ 10 %; führt entlang des Wegs zur Gruft |
| sky | `#96bede` | Himmel (nachts über das Rig abgedunkelt) |

- Figuren und Flug-Knochen behalten ihre eigenen Farben und werden nie umgetönt.
- Die Kürbislichter behalten `#ff8a2a` aus der Quelle, weil sie echtes Licht sind.

## Licht
- **Ein Rig:** `kfb-stage-light.v1.1`, Stimmung **MESA night**: Mond `#93a6ee`, Höhe 38°, Füllung `#3b3878`, Figurenlicht 1,7, glow 1.
- **Grund:** Die Quelle ist Nacht (Mondlicht `#a9bcff`, Hintergrund `#17131f`). Quell-Mond und Quell-Hintergrund entfallen, das Rig ersetzt sie.
- **Praktikals nur aus der Quelle,** 6 Stück, das ist genau der Pool (`createPracticals`, POOL 6):
  - 4 Kürbislaternen, Licht aus dem geschnitzten Gesicht, `#ff8a2a`;
  - die Galgen-Laterne `post_lantern` (Licht bei 6,8 / 2,4 / 5,8 = Laternenarm);
  - das Licht über `bench_decorated` (15,6 / 1,6 / −5), siehe Offene Punkte.
- Kerzen (`plaque_candles`, `shrine_candles`) und `lantern_standing` bleiben dunkel wie in der Quelle.
- **Schatten:** echte Mondschatten, nach Empfänger-Palette getönt (V-564). Keine Blob-Schatten.

## Bildanatomie (V-566)
Nach Kanon Gebiet 16. Die Quelle bleibt 1:1; alles hier wirkt nur über Terrain, Knet-Oberfläche, Rollenfarbe und das eine Licht.

**Farb-Skript (`color_script`)**

| Feld | Festlegung |
|---|---|
| Stimmung | Spuk-Nacht, gruselig-komisch: Der Tod ist nur eine Pause im Takt |
| Terrain | Violett #8b68c7 (Wiese), dunkles Erdfeld #7b5bb8 mit Quell-Umriss, Hügel #a582d9; vorn die dunklere Tonfläche (#439); ruhig |
| Sekundär | Grabstein-Knete #ab7de7, Eisen #67489a, Holz #ce826b, Pflaster #e9d8c0; Kiefern und Kürbisse #ef5a22 / #f7cd36 als Strukturrolle |
| Akzent (nur mit Bedeutung) | (1) Knochenweiß der Skelette: Figur, hellster Wert im Vorhof. (2) Kürbislicht #ff8a2a nur an den 4 Kürbislaternen und der Galgen-Laterne: echte Praktikals, rahmen den Eingang und den Weg (Ziel). (3) Moos-Grün #1f7a3e in den Pflasterfugen entlang des Wegs, führt zur Gruft (Weg zum Ziel), ≤ 10 %. Moos an den übrigen Steinfüßen bleibt klein und auf der Schattenseite, im Wert unter dem Fokus. |
| Verboten | Licht in Kerzen und lantern_standing; Quell-Mond, Quell-Hintergrund #17131f, Biom-Boden #7d8458; Akzent-Grün außerhalb der Fugen; unbeleuchtete Deko-Kürbisse heller als die Strukturrolle; Figuren umtönen |
| Licht | ein Rig kfb-stage-light.v1.1, MESA night (Mond #93a6ee, 38°, Füllung #3b3878, Figurenlicht 1,7, glow 1); Praktikals nur aus der Quelle; echte Mondschatten nach Empfänger getönt |

**Form-DNA (`form_dna`)**

| Feld | Festlegung |
|---|---|
| Grundformen (3) | schiefer Hang mit runder Hügelkuppe hinten links · abgeflachte Kugeln (Kiefernkronen, Gras-Polster, Bröckel) · weiche Keile (Erdkeile an Gruft, Bänken und Särgen, Hangschürze rechts) |
| Sekundärformen (2) | rund geknetete Steinkörper (Gruft, Grabsteine, Schreine, Pfeiler aus dem Kit, gerundet) · ins Erdfeld gedrückte Pflasterplatten |
| Verbotene Formfamilie | scharfe Prismen und Raster: Kachelplatten 0,53, rechteckiges Erdfeld, sichtbares Gitter |
| Kantenrundung | Grabstein-Knete rund geknetet, Pflaster bündig gedrückt; Zaunfelder in Kit-Form, aber Knet-Kanten; Erdfeld-Rand nur als Sprenkel |
| Unregelmäßigkeit | kontrolliert über die Biografie: links gepflegt, rechts Verfall; Pfeiler sinken verschieden tief ein; Erdfeld nach Quell-Umriss ausgefranst; Gruppen 3/5/7 |

**Lebensanker (`life_anchor`)**
- Skelette tanzen, taumeln, zerfallen in Takt 9 mit Knochenflug und setzen sich in Takt 10 wieder zusammen (Quelle)
- violette Gras-Büschel wiegen in Wind-Gruppen und im Takt (Kit §6/§7)
- Kiefernkronen wobbeln leicht im Wind (§5)
- **Glaubwürdig macht es:** Der Takt treibt Tänzer und Gras gleichzeitig; der Wind in den Kronen hält die Nacht lebendig, wenn die Skelette zerfallen.

**Wertstruktur (`space`)**

| Zone | Wo |
|---|---|
| hell | Skelette (Knochenweiß + Figurenlicht der Nacht) und der Pflaster-Kern |
| mittel | violette Wiese, Grabsteine, Gruft |
| dunkel | Erdfeld-Ränder, Kiefernhain links, Hang rechts unten, Eisenzaun, Vordergrund-Tonfläche |
| **stärkster Kontrast** | bleiche Skelette auf dem dunkelsten Erdfeld direkt vor der Gruft; die Gruft gewinnt zusätzlich über Höhe und die Weglinie. Kürbislichter bleiben kleiner und nie heller als die Skelette. |
| ruhig | Wiese außen, Erdfeld, Hügel; die Außenstreu vor dem Tor in der dunklen Tonfläche |

**Drei Tiefenebenen (`space`)**

| Ebene | Aufgabe | Inhalt |
|---|---|---|
| Vordergrund | rahmt | Außenstreu vor dem Tor (Sarg, offenes Grab, Laternen, Kürbisse, Kreuze, Bank) in der dunklen Tonfläche: leise, rahmt den Eingang |
| Mittelgrund | trägt die Handlung | Einfriedung und Vorhof mit den Tänzern, Weg zur Gruft: höchste Klarheit, stärkster Kontrast; die Gruft sitzt als Endpunkt an der Grenze zum Hintergrund |
| Hintergrund | vereinfacht | Kiefern hinter der Gruft und der Kiefernhain auf dem Hügel, vereinfacht, weniger Sättigung |
- **Das Terrain ist nie die lauteste Fläche:** Wiese und Erdfeld bleiben unter dem Wert der Skelette; kein Raster, kein lauter Bodenkontrast.

**70/20/10 (`space`, ersetzt 70/30)**

| Anteil | Inhalt |
|---|---|
| 70 % Ruhe | violette Wiese außen, Erdfeld und Hügel |
| 20 % Struktur | Zaun und Tor, Grabsteine, Schreine, Pflasterweg, Außenstreu, Kiefern |
| 10 % Bedeutung | Gruft, die Skelette mit den fliegenden Knochen, die Kürbislichter; hier liegt der stärkste Kontrast |

**Gebrauchsspuren (Kanon Gebiet 3, V-566)**: RA-Quelle, daher nur über Knet-Oberfläche und Terrain; die Silhouette bleibt 1:1.

| Objekt | Spur | Ursache |
|---|---|---|
| Gruft (Hero, Landmarke) | Moos auf der Schattenseite und in den Fugen am Fuß | Moos: feuchte Nordseite am Hang |
| Gruft (Hero, Landmarke) | Knete am Eingang heller abgegriffen | Abnutzung: Hier endet der begangene Weg |
| Gruft (Hero, Landmarke) | Erdspritzer am Sockel | Fleck: Regen spritzt vom Erdfeld hoch |
| Schrein mit Kerzen (Echo) | Wachsfleck am Fuß | Fleck: Kerzen der Andachtsecke |
| Schrein (Echo) | Moos in den Fugen, Farbverlust oben | nah am feuchten Hang, offen unter dem Himmel |
| Torbogen | Pfeiler unten abgewetzt, Gras außen | Abnutzung: Zugang, jeder geht hier durch |

## Materialcodes (`material_codes`, höchstens 3)
1. **Violette Knete-Erde:** Wiese, Erdfeld und Hügel. Violette Gras-Büschel in Dreier-, Fünfer- und Siebenergruppen am Zaunfuß außen und unter den Kiefern, dichter am Hang rechts; frei auf Weg und Tanzzone. Sie wiegen in Wind-Gruppen (Environment-Kit §6) und im Takt (§7). Moos sitzt nur in Fugen, still.
2. **Grabstein-Knete:** Gruft, Grabsteine, Schreine, Tafeln, Pfeiler und das Pflaster. Rund geknetete Kanten, Pflaster ins Erdfeld gedrückt: innen dicht, außen lose, dann Sprenkel. Statisch.
3. **Holz, Eisen und Kiefern:** Zaun, Tor, Bänke, Särge, kahle Bäume und Kiefern, Kit-Formen. Vor dem Bau durch die Eingangsprüfung (`kfb_clay_bpy.apply`), danach Knete und Rollenton. Kiefernkronen wobbeln leicht im Wind (§5), kahle Bäume kaum. Die Torflügel schwenken nur auf Befehl (Quelle `setGate`).

## Ortsbiografie (`biography`)
Nur Terrain-Arbeit, keine neuen Requisiten.

| Schicht | Ein Satz | Umsetzung |
|---|---|---|
| 1 Entstehen | Ein Hang, der nach hinten links ansteigt; auf einer flacheren Stelle wurde der Friedhof angelegt, die Gruft hinten etwas höher als das Tor | Terrain-Form; die Gruft sinkt nach Objektart ein (building 0–15 %) bzw. bekommt einen Erdkeil; kein Sockel |
| 2 Nutzen | Der Weg Tor → Gruft ist begangen, die Andachtsecke links besucht, der Vorhof vom Tanzen zertreten. Vor dem Tor ein offenes Grab neben dem Sarg | Pflaster der Quelle bündig ins Erdfeld; Sprenkelband Pflaster → Erde → Wiese (V-403); Erdfeld im Vorhof am dunkelsten; offenes Grab als Mulde und Erdhügel im Terrain, Form von `floor_dirt_grave` abgenommen. **Gebrauchsspuren (V-566, nur Knet-Oberfläche/Terrain):** Gruft (Hero, Landmarke): Moos auf der Schattenseite und in den Fugen am Fuß (Moos: feuchte Nordseite am Hang); Gruft (Hero, Landmarke): Knete am Eingang heller abgegriffen (Abnutzung: Hier endet der begangene Weg); Gruft (Hero, Landmarke): Erdspritzer am Sockel (Fleck: Regen spritzt vom Erdfeld hoch); Schrein mit Kerzen (Echo): Wachsfleck am Fuß (Fleck: Kerzen der Andachtsecke); Schrein (Echo): Moos in den Fugen, Farbverlust oben (nah am feuchten Hang, offen unter dem Himmel); Torbogen: Pfeiler unten abgewetzt, Gras außen (Abnutzung: Zugang, jeder geht hier durch) |
| 3 Vergehen | Rechts sackt der Boden zum Rand ab: Der Zaun-Lauf 3 ist zerfallen, die Erde bröckelt in Steinchen, das Pflaster franst außen aus | Steinbänder nach Grammatik §4 (Band 0–2) am rechten Hangrand, `nest_ok`, ungerade Gruppen |
| 4 Bewachsen | Moos in den Pflasterfugen am Wegrand und an den Füßen von Grabsteinen, Pfeilern und Gruft auf der Schattenseite; Gras am Zaunfuß und unter den Kiefern | Fugen-Sprenkel; Gras 0–2 m vom Zaun, Gruppen 3/5/7; Tanzzone und Wegmitte ohne Bewuchs |

**Kontakt-Geometrie (V-565):** Jede Fuge wird gebrochen (`kfb_env.contact`):
- Gruft: Erdkeil plus Steinchen-Dreier bergab, Moos auf der Schattenseite;
- Grabsteine, Kreuze, Schreine, Tafeln: Steinchen-Dreier bergab, ungleiche Abstände;
- Zaunpfeiler und Torbogen: Gras-Büschel außen, Steinchen innen;
- Bäume: Gras-Büschel am Stammfuß;
- Bänke und Särge: Erdkeil an der Hangseite;
- Kürbisse: ein, zwei Gras-Büschel;
- Pflaster: Moos in den Fugen;
- Figuren stehen direkt auf dem Erdfeld.

**Signatur:** Hero = Gruft; Echos = Schrein (15,4 / −14,8) und Schrein mit Kerzen (5,4 / −12,8). Beide sind kleine Steinbauten, ungleich weit von der Gruft (rechts nah, links vorn). Nichts Drittes.

## Gruppen (`groups`)
- **g1 Gruft hinten:** Gruft (Anker) + große gelbe Kiefer, orange Kiefer mittel und klein dahinter (Stützen) + Schrein (Akzent, Echo). Ortsgrund: Landmarke am Ende des Wegs, auf dem höheren Grund.
- **g2 Andachtsecke links:** Andachtsplatte mit Kerzen (Anker) + zwei Bänke, Grab B, Schrein mit Kerzen (Echo), kahler Baum (Stützen) + Kürbislaterne mit kleinem Kürbis (Akzent). Dahinter der Kiefernhain auf dem Hügel. Ortsgrund: Weg-Abzweig am linken Zaun, die gepflegte Seite.
- **g3 Verfall rechts:** Sarg verziert (Anker) + Tafel, zwei Grabsteine, Bank verziert, kahler Baum (Stützen) + Knochen A (Akzent). Außen rechts hinten Kreuz, Kürbisse und zwei kahle Bäume. Ortsgrund: der abfallende Hang am zerfallenen Zaun-Lauf 3.
- **g4 Vor dem Tor:** Sarg und offenes Grab links (Anker) + Galgen-Laterne, Laterne, Kreuz, Schädel (Stützen) + Kürbislaternen am Tor (Akzent). Rechts Kürbisse, zwei Kreuze, Knochen B, Bank, kleine Kiefer. Ortsgrund: der Zugang, wo der Weg ankommt.
- Steine aus Schürze und Kontakt-Geometrie zählen in die Gruppen-Zahlen nach Gate-Regel; jede Gruppe ungerade (Gate G1).

## Story-Beat (`story_beat`)
Eine Phrase = 10 Takte (8 Tanz + 2 Lücke) im Tempo des Titels:
- **Takt 1–8:**
  - jedes Skelett tanzt einen anderen Tanz aus dem Roster des Titels; das Roster rotiert je Phrase (Skelett i tanzt `roster[(i + k) mod 4]`);
  - alle taumeln in der Zone (`stepWalker`): sie prallen an Requisiten und aneinander ab, die Neigung kommt aus dem Stoß.
- **Takt 9 · Zerfall:**
  - Death_A, bei Rogue und Minion Death_B;
  - versetzt um 0 / 0,5 / 0,25 / 0,75 Schläge;
  - Knochen aus dem Pack (bone_A/B/C, skull, ribcage) fliegen weg.
- **Takt 10 · Zusammensetzen:** derselbe Clip rückwärts, beschleunigt zum Taktanfang, die Knochen fliegen zurück.
- **Titel:** Bone Rattle Boogie 120, Crypt Kicker Thriller 112, Ossuary Oompah 126 BPM (gesetzt, kein Audio).
- **Optional:** Tor öffnen (Flügel 100°, Quelle).

## Besetzung (`cast`)
Quelle, Startplätze unverändert:

| Slot | Figur | cast-ID | Start · Blick |
|---|---|---|---|
| warrior | Skeleton Warrior | `skeleton_warrior` | 11,8 / −6,6 · 40° |
| rogue | Skeleton Rogue | `skeleton_rogue` | 7,2 / −7,8 · 55° |
| mage | Skeleton Mage | `skeleton_mage` | 9,6 / −10,2 · 35° |
| minion | Skeleton Minion | `skeleton_minion` | 13,8 / −9,4 · 50° · optional |

- Jede Figur hat KFB-Augen und E2-Lider, an jeder Variante, auch der `friedhof`-Variante, im Zerfall und beim Zusammensetzen.
- Figuren werden nie skaliert; Kollision über `stepWalker` aus der Quelle.

## Kameras (`cameras`)
1. 45° schräg von oben, von vorn rechts über die Einfriedung, nicht auf der Achse.
2. Augenhöhe (1 H) vom Abzweig-Pflaster (5,8 / −5,2) auf Tanzzone und Gruft.
3. Fuß nah: Gruft-Fuß mit Wegende (Erdkeil, Moos, Sprenkel).
4. Seite rechts: Silhouette des zerfallenen Zaun-Laufs 3 im abfallenden Hang.
5. Gesicht nah: Warrior und Mage (`near_face`), dazu ein Bild in Takt 9.
6. Spielkamera (Bühnen-Orbit V-257), Standard-Blick schräg wie die Quell-Ansicht `key`.

## Referenz (`reference`)
- RA S17 `#__graveyard`: Platzierungen 1:1.
- KayKit `media/3D_Assets/KayKit_HalloweenBits/sample.png`: Vorlage der Quelle.
- Joyride A Canyon: Farbwelt.
- Terrain-Design 19.10. (#439): Farbflächen, dunklere Vordergrund-Tonfläche, getönte Schatten.

## Verbote für diese Szene
- Bodenkacheln als Platte, Scheibe oder eigener Boden.
- Positionen, Drehungen oder Requisiten ändern, um die Symmetrie zu brechen. Das macht nur das Terrain.
- Neue Requisiten (Grabsteine, Zäune, Laternen, Nebel).
- Eigener Mond, Szenen-Hintergrund, Licht in Kerzen oder in `lantern_standing`.
- Ein rechteckiges Erdfeld oder ein sichtbares Raster.
- Eine Kamera auf der Achse Tor–Gruft als Standard-Blick.

## Offene Punkte
1. **Kachelboden gegen Kanon 15:** Das Blatt übersetzt die Kacheln in eine Terrain-Farbfläche mit Quell-Umriss und `floor_dirt_grave` in eine Mulde mit Erdhügel. Georg: so, oder das offene Grab als eingesunkene Kachel behalten?
2. **Symmetrie-Achse Tor–Gruft** steckt in der Quelle (`sample.png`). Das Terrain bricht sie nur teilweise. Reicht das nicht, braucht eine Positionsänderung Georgs Freigabe (V-468 verlangt „organischer als graveyard-01“, die Regel „Quelle 1:1“ verbietet es).
3. **Verhältnis zu B33** (Friedhofs-Diorama, V-468 „Anker für die Skelett-Szene“): Welcher Ort ist kanonisch, dieser RA-Nachbau oder B33?
4. **Licht:** Die Quelle ist Nacht, das Scenelet `65_SCENELETS/ra/ra_graveyard_01.scenelet.json` sagt MESA day. Das Blatt folgt der Quelle.
5. **Scenelet weicht von der RA-Quelle ab:** dort tanzen alle denselben Clip, alle haben Death_A, es gibt keine Versätze, kein Taumeln und keinen Minion. Die RA-Quelle gilt.
6. **Licht über `bench_decorated`:** Ob das Modell eine Lichtquelle hat (Kerze, Laterne), ist nicht belegt; die Datei hat ein einziges Mesh. Ohne Quelle ist es ein privates Licht und entfällt.
7. **Fliegender Schädel** (`skull` aus dem Pack) neben Skeletten mit KFB-Augen: Requisite oder Figurenteil mit Augenpflicht?
8. **Minion:** In der Quelle optional, Pfad erschlossen, nicht aus `data/cast.js`; cast.r1 führt ihn als ready.
9. **BPM, Phase und Taktform** sind gesetzt, nicht gemessen; es gibt kein Audio (Quelle).
10. **Zaun am Hang:** KayKit-Zaunfelder sind gerade. Die Hangneigung entlang Lauf 1 und 3 muss so flach bleiben, dass Felder und Pfeiler ohne Stufe anschließen (WS1 misst).

## Ablauf
- **WS1 (Paket E):** Einpassung im Spielterrain, nach Klärung der Offenen Punkte 1–3.
- **WSB:** Eingangsprüfung und Rollen-Tönung des Halloween-Kits auf die Canyon-Rollen; Augen-Prüfung der Skelette an jeder Variante.
- **Prüfung:** Gate mit `concept.json` daneben, dann der blinde Kritiker mit den Kameras 1–6.
- Georg sieht nur das Bestandene.


## WS0-Entscheide (20.10., Art Direction)
Diese Entscheide schließen die offenen Punkte oben; was dort noch offen steht, ist hiermit beantwortet.
- Bodenplatten der Quelle werden zu Farbfeld und Mulde im Terrain, das offene Grab zur echten Vertiefung. Damit ist die Platte weg (Kanon Gebiet 15).
- Die Achse Tor–Krypta bleibt in den Positionen 1:1. Die Symmetrie wird nur über Terrain, Farbfelder und die ungleiche Biografie gebrochen, und keine Kamera sitzt auf der Achse. Damit ist V-468 erfüllt, ohne die Quelle zu verschieben.
- Kanonisch ist dieser RA-Friedhof; das B33-Diorama ist Archiv.
- Nacht gilt (RA). Das Scenelet `ra_graveyard_01` wird auf Nacht und die RA-Clips zurückgeführt.
- Licht nur, wo die Quelle eines hat: Die Bank behält ihr Licht nur, wenn die Quelle dort Emission bzw. ein Licht führt (WS1 prüft); sonst entfällt es.
- Fliegender Schädel: Er ist ein Requisit (Halloween Bits) und bekommt keine Augen. Agiert er als Figur, sind Augen Pflicht.
- Der Minion bleibt draußen, weil sein Weg in der Quelle nur erschlossen wäre.
- Hangneigung: höchstens so steil, wie die geraden Zaunteile ohne Schweben tragen (WS1 misst).

### Georg-Korrektur 20.10. (gilt vor dem WS0-Entscheid zu den Bodenplatten)
- **Die Bodenkacheln bleiben** (floor_dirt, floor_dirt_small, floor_dirt_grave; Lage 1:1 laut `ra_layout_export.json`).
- **Neu ist nur der glaubwürdige Übergang zum Terrain:**
  - Die Kachelkante sinkt leicht ein bzw. das Terrain läuft an (Erdkeil).
  - Rundherum ein Übergangsband nach Kanon Gebiet 17 (4): Steinchen-Nester aus dem Steinkit, Staub bzw. Erdkrümel und Sprenkel in beide Richtungen.
  - Außenkacheln franzen zum Rand hin aus: einzelne lose bzw. gekippte Platten, Lücken, Moos in den Fugen. Nie eine gerade Plattenkante gegen den Boden.
- **Das offene Grab** bleibt `floor_dirt_grave` mit einer echten Mulde darunter.
- **Layout-Export** aus dem laufenden RA (176 Teile, Weltlage): `65_SCENELETS/graveyard/ra_layout_export.json`.
