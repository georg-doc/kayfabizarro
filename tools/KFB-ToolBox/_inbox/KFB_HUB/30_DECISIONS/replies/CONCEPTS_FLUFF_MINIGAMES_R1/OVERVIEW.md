# Fluff und Minispiele · Übersicht R1

Stand 15.10.2026 · WS0 · für Georg. Gesichert aus dem Planungs-Branch `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09` (Stand `15b60028c`). Die Originale liegen 1:1 in `source/`, Herkunft und Blobs in `source/SOURCES.md`. Die Meta-Erzählung (Fluff-Genesis, Lord Hunky und Lady Dory, UFO, Academy) steht getrennt in `../META_NARRATIVE_R1.md`.

**Status aller Konzepte:** Ideen und Architektur-Vorschläge, nichts davon gebaut oder getestet. Alle Versionen sagen selbst: erst nach dem spielbaren MVP und nur mit deinem ausdrücklichen Go. Das eine dafür vorgesehene Tor heißt `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` (echte Bäume, Mine, Angel, Bombe, Rucksack und Almanac erst einzeln prüfen, dann ein kleiner Beweis).

---

## Auf einen Blick

| Version | Thema | Minispiele | bringt Fluff | bringt Karten |
|---|---|---|---|---|
| v0.3 | Fluff-Ernte, Kneten, Alchemie, Almanac | Baum/Busch/Mine anstoßen, einsammeln, Kneten im Rucksack, Werkbank, Mini-Fabrik | ja, Kern | ja, über Rezepte (nur echte Karten) |
| v0.4 | Chill/Standard/Hard, Maker, Academy | Survival-Elemente nur als Option, Blaster-Werkstatt, Friedhof | ja (Kurier, Ernte) | ja, gleiche Karten in allen Modi |
| v0.5 | Genesis-Figuren, UFO, kosmische Ziele | Hexenkessel, Traktorstrahl-Besuch, Kantine/Band, kosmische Strecke | ja (Kessel, Replikator, Bar) | ja (Lorekeeper-Zeitkapseln, Kessel) |
| v0.6 | Angeln, Farm, Dynamitfischen | ruhiges Angeln, Cartoon-Bombe im Teich, Fluff-Möhren pflanzen | ja | selten, als echte Karte oder Hinweis |
| v0.7.1 | Blast-Mining, Loot, Social Calls, lebende Props | Sprengen in der Mine mit Kaskade, Fluff-Sensor, Loot-Karte mit BINGO/BOGGLE/BONGO, Müll recyceln | ja, automatisch einsammeln | ja, wenn ein Fundort eine echte Karte hat |
| v0.8 | Gefängnis-Insel | verhaftet werden und fliehen (8 Wege), Kamera-Toter-Winkel-Spiel | nein (nur Geldstrafe über Wallet) | nein (keine neue Karte erfinden) |
| v0.9 | Gefängnis-Labyrinth | Labyrinth, das der Toy Soldier per Knopf umbaut, wachsender Turm | nein | nein |

---

## v0.3 · Fluff-Ernte, Kneten, Alchemie, fraktaler Almanac

**Was es vorschlägt:** Eine kleine, freiwillige Schleife. „Ziehen statt sperren“: Der Spieler will eine echte Karte aus einem echten Deck; Ernten und Kneten ist einer von mehreren Wegen dorthin, nie Pflicht.
1. Fluff-reichen Baum, Busch, Fels, Farm oder Mine finden (gehört zu einem Bewohner, der dort arbeitet).
2. Eine Taste oder ein Tipp: Das Objekt wackelt, 2–4 Knet-Kugeln fallen herunter, man sammelt sie durch Drüberlaufen ein. Der Baum bleibt stehen.
3. Kleiner Zähler zeigt Farbe und High/Low.
4. Kneten: im Rucksack (2–3 Klumpen in Mulden drücken), an einer Werkbank (z. B. Protopia) oder später in einer Mini-Fabrik mit sechs Trichtern und Förderband. Alle drei sind dieselbe Regel, nur anders gezeigt.
5. Ergebnis: ein echtes Requisit in den Rucksack oder eine echte Karte in den Almanac, mit kurzer Herkunfts-Erinnerung („Afterglow“: wo, wie, mit wem).

**Fluff-Arten:** sechs Story-Modes aus dem D6 (Tragic stahlblau, Comic olivgrün, Absurd gold, Heroic orange, Mystical violett, Forbidden weinrot) je in High und Low = 12 Sorten, 6 Grundfarben. High ist heller und springiger, Low dunkler und schwerer geknetet.
**Alchemie:** bewusst winzig. High + Low derselben Farbe kann eine neutrale Rohmasse ergeben; einzelne benannte Rezepte; kein 12×12-Rätsel. Unbekannte Mischung kostet nichts.
**Karten:** nur echte Karten (`deckId + cardNumber`, echtes PDF-Bild), nie Kopien im Rucksack, nie doppelt. Almanac als Fächer oben rechts.
**Analoger Rückweg:** optional ein Zwei-Seiten-Add-on (D6 + Plus/Minus-Marker), nur mit deiner Entscheidung.
**Ausdrücklich nicht:** Lebensbaum je Insel, feste Fluff-Moral je Insel, High/Low-Rechenwerk, Hunger, Tageslimits, Lootboxen.

## v0.4 · Play, Craft, Learn · optionale Schwierigkeit

**Was es vorschlägt:** Standard ist **Chill & Fun**. Standard und Hard sind spätere Regel-Profile über denselben Systemen, kein zweites Spiel.
- Hard-Beispiel: ein Vorrat wird nach ca. 30 Minuten aktivem Spiel verbraucht; Pause, Menü, Academy-Lektion zählen nicht.
- Klassische Survival-Mechaniken werden KFB-satirisch übersetzt: Baum per Faust anstupsen statt Axt, Rezepte über Bewohner und Karten statt Tech-Tree, Handel mit Bewohnern, Basenbau nur später. Abgelehnt: Echtzeit-Hunger, Grind, viele Währungen, Bezahl-Zufall.
- **Blaster-Werkstatt** als Beispiel: echtes Item ansehen, Farbe ändern, Mündungsfeuer-Effekt in der Academy lernen. Lernen kostet nie Fluff; Fluff schaltet nur optionale Projekte frei.
- **Friedhof als Erinnerung:** Ein Skelett merkt sich wiederholte Tode am selben Boss und reagiert jedes Mal anders.
- Eigene 3D-Uploads nur privat und geprüft.

## v0.5 · Genesis-Konstellation, UFO, kosmische Inseln

**Was es vorschlägt:** Fünf Figuren aus der Tiefenzeit (Lorekeeper, Hexe/Alchemistin, Caveman, Lord Hunky, Lady Dory) plus die Academy als gesichtslose Institution. Drei Anlaufstellen:
- **Lorekeeper:** Karten als Zeitkapseln, Almanac-Herkunft.
- **Hexe:** Fluff im echten KayKit-Kessel mischen (2–4 Kugeln, rühren, pressen, erhitzen) → Rohmasse, Requisit oder echte Karte. Schnell-Kneten bleibt überall möglich.
- **Lord Hunky und Lady Dory im UFO:** Traktorstrahl holt den Spieler, innen ein „Raum-Inseln“-UFO (Brücke, Hunkys Maschinenraum, Dorys Alien-Garten, Türen zu Hologramm-Szenen). Rückkehr immer an den sicheren Ausgangspunkt.

Kosmische Ziele als Option: Käsemond, Restaurant am Rand des Universums, Weltraum-Kantine mit der tourenden Orc Band, kosmische Track-Core-Straße, Schwerelos-Flug. Bar, Replikator und Kessel nutzen dasselbe Wallet und dieselben Rezepte.
Drei Beispiel-Schleifen: „Die umstrittene Genesis“ (Fundstück in der Mine → Kessel reagiert → Lorekeeper-Karte → UFO-Logbuch widerspricht), „Der unerwartete Besucher“ (Entführung, Garten vs. Papierkram, Portal zurück), „Die tourende Band“.

## v0.6 · Angeln, Farm, Cartoon-Dynamitfischen

**Was es vorschlägt:** An echten Teichen, Seen, Stränden.
- **Ruhiges Angeln** (WoW-artig): werfen, Schwimmer wippt, Biss, rechtzeitig klicken, einholen. Die sieben KayKit-Clips `Fishing_Cast` bis `Fishing_Catch` (Rig_Medium_Tools) sind vorhanden; Angel, Schwimmer, Fisch-Modelle fehlen.
- **Cartoon-Blast-Fischen:** Clown-Bombe (KayKit `clown_bomb.gltf`, nur Requisit) plumpst ins Wasser, Pause, Ring-Welle, Knet-Explosion, 2–7 Dinge fliegen organisch verteilt hoch (Fisch mit X-Augen, Gummistiefel, Fluff-Kugeln, Fluff-Fisch, „Brückfisch“ als Witz), landen, schwimmen, sinken. Eine Belohnung pro Aktion, egal wie viele Partikel. Fairness: Sprengen geht schneller, bringt auf Dauer aber nicht mehr als Angeln.
- **Farmville-lite:** echte Farmer-Beete (4 × `dirt_plot`, Möhre, Salat); Fluff-Saat pflanzen, drei Wachstumsstufen, Fluff-Möhre ziehen, zu Kugeln kneten. Keine Pflicht-Dailies, keine verwelkten Pflanzen.
- Fang-Klassen: kleiner Fisch → Fluff beim Kneten; Fluff-Fisch in D6-Farbe; Müll/Witz-Requisit; selten eine echte Karte oder ein Kartenhinweis.
- Getrennte Zähler: ausgebbares Fluff-Wallet, Fluff-Score im HUD (Lebenszeit, sinkt nie), Fluff als HP (alt), Almanac. Später optional eine satirische Hall of Fame, erst lokal.

## v0.7.1 · Blast-Mining, Kaskaden, lebendige Beute, Social Calls

**Was es vorschlägt:**
- **Blast-Mining:** Cartoon-Bombe an einer echten Fluff-Ader (z. B. Caveman-Mine). Erde reißt, 1–3 kleine Nach-Plopps, Möhren, Relikte, Knetbrocken und Fluff fliegen. Die Klangleiter aus **Boxel Blitz** (10 Stufen, Match-3-Gefühl) gibt den Rhythmus. Terrain bleibt unverändert, solange die Welt das nicht freigibt.
- **Fluff-Sensor** (später): piept bei echten Fundstellen, zeigt sie über die vorhandene Navigation.
- **Einsammeln in Stufen:** Fluff wird automatisch beim Vorbeilaufen, -fahren und -fliegen eingesammelt (ein Zähler-Toast, kein Stopp). Grauer Müll verstopft nie die 20 Rucksack-Plätze. Besondere Funde zeigen eine nicht blockierende **Loot-Karte**: **KayfaBINGO!** = behalten, **KayfaBOGGLE?** = nachfragen, **KayfaBONGO!** = liegen lassen (nur digitale Bedeutung, die analogen Regeln bleiben).
- **Die ganze Welt lebt** (deine Klarstellung vom 09.10.): Jedes Objekt darf wackeln, tanzen, reagieren, behaupten („I'm the red herring. You're looking for the wrong clue.“). Die Reaktion allein darf die Belohnung sein.
- Müll wegwerfen mit Cartoon-Platsch; Recyceln am Kessel, an der Werkbank oder im UFO-Replikator.

## v0.8 und v0.9 · Gefängnis-Insel (gleicher Strang, Minispiel-Ort)

- **v0.8:** kleine Gefängnis-Satelliteninsel. Toy Soldier und ein wiederkehrender Heel spielen Festnahme, Flucht, Wiederfestnahme. Der Spieler kann verhaftet werden und hat acht Wege raus (warten, Strafe zahlen, bestechen, überreden, ablenken, Schlüssel finden, Kulissenwand, Freikarte als lokales Item). Panopticon mit Kameras und toten Winkeln, Insassen-Gespräche.
- **v0.9:** Labyrinth in der Schüssel der Insel, der Toy Soldier baut es per Knopf um, der Wachturm wächst mit. Frost-Orc als Stamm-Insasse; der Black Knight bleibt Leibwächter.

---

## Was bringt Fluff, was bringt Karten

**Fluff kommt aus:** Bäumen und Büschen (wackeln oder Fallobst), Farm-Beeten (Fluff-Möhren), Mine (antippen, schaufeln, sprengen), Wasser (angeln, Dynamitfischen, Fluff-Fisch), Kurier-Aufträgen, Kämpfen, Bewohner-Handel und Geschenken, Recycling von Müll, später Bücher-Regal-Spiel in der Akashic Library.
**Karten kommen aus:** Kneten und Kessel (Rezept → echte Karte), Lorekeeper-Zeitkapseln, Kurier und Kampf, seltenen Funden beim Angeln und Sprengen, Bewohner-Geschenken, Entdeckung. Laut `GAME_LOOP_R1.md` auch: manche Fluffs tragen eine Karte; Sprengen legt Karten frei; ein komplettes Deck schaltet den Deck-Song frei (V-279).
**Feste Regel aller Versionen:** nur echte Karten, jede genau einmal, nie als Kopie im Rucksack; jeder Weg zu einer Karte hat mindestens eine friedliche Alternative.

## High- und Low-Vibrational Fluff (optionale Dimension)

- **Bedeutung laut Quellen:** High = das menschliche Mehr: Solidarität, Neugier, Wahrheit, Fürsorge, Mut, Reparatur, Schönheit. Low = abgezogene, ausgebeutete Aufmerksamkeit, Leid, manipuliertes Spektakel. Ausdrücklich **keine** Moral-Anzeige und keine Gut-/Böse-Insel (v0.3 §2).
- **Aussehen:** High heller, springiger, glatter; Low dichter, dunkler, schwerer geknetet, anderer Klang.
- **Spiel:** 6 Farben × 2 = 12 Sorten; Mischen High + Low kann Rohmasse ergeben.
- **Im Register:** V-051 kennt High/Low nur als leichten Story-Tint der Insel-Palette.
- **Deine Linie vom 15.10.:** Dimension vorsehen, aber zuerst vielleicht nicht nutzen. Folge: Datenfeld `polarity` freilassen bzw. nur einen Wert führen, bis du es freigibst.

---

## Was schon wo entschieden ist

**Register (`DECISIONS.md`):**
- **V-051** Insel-Thema mit Story-Tint (High/Low) über der Palette.
- **V-082 (TBD)** Fluff-Zonen im God-Mode: Baum füllen, Mine/Terrain graben, Beete, Angeln; später, nach Phase F.
- **V-083 (TBD)** Fluff abschießen/abklopfen mit Zerstörung und Nachwachsen, Action-Bar; später.
- **V-120** Protopia und Maker Space sind zwei Inseln (betrifft den Ort von Werkbank und Fluff-Reparatur).
- **V-122** Plan R1 und Register gehen dem WSA-Router auf diesem Branch vor.
- **V-181** Kulturmechaniken: u. a. Fluff ernten, formen, zerstören, Brick-Fish.
- **V-252 … V-259** UFO-Cockpit (Meshy) als Dialog-Bühne mit Monitor-Bildfläche; „kein Traktorstrahl, keine Innenräume jetzt“ (V-252).
- **V-261, V-267, V-272** Frankenstein-Probe Lord Hunky und Lady Dory (KayKit-Körper, Meshy-Köpfe, Rig_Medium wie FrizzleBob).
- **V-279 (TBD)** Deck-Song als Belohnung für ein komplettes Deck.
- **V-289 (TBD)** Weltstruktur für 130+ Decks (Zonen mit Hub, dynamisch, Mischform).
- **V-294** deine Arbeitshypothese Zone (siehe unten).
- **V-295** Namen: Lord Hunky und Lady Dory.

**Lab-Review vom 09.10.** (`KFB Island Worldbuilder Lab/docs/REVIEW_POSTMVP_CONCEPTS_ARCH_FIT_R1.md`), von dir entschieden:
- Alle Konzepte passen zur Architektur; Reihenfolge nach MVP-2: P0 Spielstand, P1 Fluff-Ernte + ein Rezept, P2 Angeln/Blast-Mining, P3 Gatekeeper/Gerüchte, P4 God-Mode/kosmische Inseln.
- Welt-Besitzer ist das Lab, nicht WB2 (heute gilt V-228: WS1 besitzt die Laufzeit).
- Alle Inseln offen, keine Sperren im MVP.
- Fluff-Farben sind Akzent-Rollen in `ENV_ROLES`, keine zweite Palette.
- Ernte-Punkte kommen aus `nodes[]` im Insel-Rezept; geerntet-Zustand nur im Spielstand.

**Lab-Plan R1 §2b (10.10.):** Baum anklicken → Fluff-Kugeln als bewusst bunte Mischung, auch außerhalb der Palette; Mine markieren (Bombe, Schäufelchen); Beete; Wasser = Fluff-Angeln.
**Im Branch selbst festgehalten:** öffentliche KFB-Site-Migration geparkt (09.10.); lebende Props erlaubt (09.10.).

---

## Widersprüche und offene Stellen

1. **Fluff-Farbe:** Erinnerung 08.10.: Fluff in der Biom-Palette der Insel. Plan §2b 10.10.: bunte Mischung, auch außerhalb. v0.3: sechs D6-Farben × High/Low. Lab-Review: D6-Farben als Akzent-Rollen. → Was gilt zuerst: bunte Mischung (Erkennbarkeit) oder D6-Farben?
2. **Woher Fluff wächst:** Lebensbaum je Insel bzw. Ur-Fluff-Baum in Town (Vorschlag 07.10.) wird in v0.3 und der Recovery ausdrücklich **nicht** kanonisiert; die Active Work Map (04.10.) sagt „Life Trees grow collectible Fluff“ als Entscheidung.
3. **High/Low-Wirkung:** Active Work Map: High/Low steuert Aufbau/Abbau. Inselvorschlag: Low = Ernte bzw. Academy-UFO-Abfluss, High = Wachstum/Bau. v0.3: Low nicht nur Abriss, High nicht nur Bau. Du am 15.10.: erst mal vielleicht gar nicht nutzen.
4. **Baum bleibt oder geht kaputt:** v0.3: Knoten überlebt fast immer. V-083: abschießen mit Zerstörung und Nachwachsen.
5. **Einsammeln:** v0.3: eine Taste, dann drüberlaufen. v0.7.1 und Erinnerung: automatisch beim Vorbeilaufen/-fahren, Fallobst springt und rollt. Kein echter Widerspruch, aber die Taste entfällt.
6. **Entführung freiwillig oder nicht:** v0.5: Traktorstrahl-Besuch optional, mit Ablehnen/Flucht/schneller Rückkehr, „not a mandatory mission“. Du am 15.10.: anfangs nicht freiwillig, sondern entführt bzw. verbunden. → v0.5 ist an dieser Stelle überholt, sobald du das festlegst.
7. **UFO-Innenräume:** v0.5 und Cantina-Konzept: TARDIS-artiger Raum-Graph. V-252: keine Innenräume jetzt. Kein Widerspruch in der Sache, aber in der Zeit: Innenräume sind später.
8. **UFO-Modell:** Kenney A–D (Prep 06.10.), Rick's UFO als V1-Spender (START_HERE), v0.5 will ein eigenes KFB-UFO, jetzt Meshy-Cockpit (V-252 ff.). → Für das Hub-UFO ist das Modell offen.
9. **Zonen-Musik:** neu „Zonen-Song sammeln“ (V-294). Plan §2g/V-128: beim Fahren läuft das Radio (Suno RoadTrip JukeBox), zu Fuß das Insel-Bett. V-279: Deck-Song erst als Belohnung. → Klären: Ist der Zonen-Song ein Radio-Titel der Zone, und wie verhält er sich zum Deck-Song?
10. **Owner-Namen in den Konzepten veraltet:** Sie nennen WB2, F-S13 oder „Island Worldbuilder Lab“ als Empfänger. Heute: WS0 steuert, WS1 baut (V-213, V-228).
11. **Black Knight:** v0.8 Gefangener-Heel; Town r022 und v0.9: Leibwächter. v0.9 korrigiert v0.8.
12. **„Academy“ doppelt belegt:** Galaktische Academy (Institution hinter Lord Hunky) und AI Game Art Academy (Lern-Lane, Maker Space). In v0.4 ist die Lern-Academy gemeint, in v0.5 beide. Siehe META_NARRATIVE_R1.
13. **Drei Fluff-Bedeutungen:** Wallet (ausgeben), Fluff-Score (HUD), Fluff-HP (alte Overworld). Die Konzepte warnen selbst davor, sie zu vermischen; ein Besitzer fehlt noch.

---

## Georgs Arbeitshypothese 15.10.

(gleichlautend im Register als V-294)

1. Eine **Zone** = Diorama plus umgebendes Land („Umland“), das man mit dem Auto in etwa **2–4 Minuten** durchquert.
2. Beim Fahren hört man den **Zonen-Song** aus dem Soundbed und sammelt ihn ein (dazu weitere Songs aus der **Playlist der Zone**).
3. **Minispiele** geben **Fluff und Karten**.
4. **Jede Ernte-Aktivität** bringt Fluff.
5. **High/Low-Dimension** wird vorgesehen, aber zuerst vielleicht nicht gebraucht.
6. Das **UFO von Lord Hunky und Lady Dory** ist ein **TARDIS-artiger Raum** und kann als **Game-Hub** dienen.
7. Der Spieler geht anfangs **nicht freiwillig** hinein, sondern wird **entführt** bzw. mit Lord Hunky und Lady Dory **verbunden**.
