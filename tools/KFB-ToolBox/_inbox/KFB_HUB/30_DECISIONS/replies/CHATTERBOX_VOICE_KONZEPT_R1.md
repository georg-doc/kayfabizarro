# Chatterbox Voice · Konzeptpapier R1 · 2026-10-22 · WS0
**Status:** Konzept zur Diskussion mit Georg. Noch keine Erzeugung, keine Credits.
**Bezüge:**
- V-486, V-492, V-500: Fluff-o-lect als Melodie-Sprache, Dekodieren in drei Stufen;
- V-505: Blasen-Kodierung;
- V-508: ein Ton je Wort;
- V-616: Signatur-Ornament;
- V-636, V-640, V-642: Begrüßungen, Social Calls, erste Bewohner-Instrumente;
- V-292: Story-Modes und Ruf-Farben;
- V-334: Social Calls im HUD;
- V-650: Blasen auf Englisch.

## 0 · Ziel in drei Sätzen
1. Jede Figur hat eine wiedererkennbare **Stimme ohne Worte**. Die Bedeutung steht in der Blase (Englisch), Charakter und Gefühl stecken im Klang.
2. Das System skaliert auf **60+ Figuren über Daten**, nicht über immer mehr Aufnahmen. Gemurmel, Lautstärke und Mischung macht die Audio-Slice beim Ausspielen.
3. **Emotion ist die Hauptachse.** Sie folgt Musikregeln, ist für alle Figuren gleich lesbar und lässt Gruppen bis hin zu einem Orchester zusammenklingen.

## 1 · Was eine Stimme können muss
- **Sprachkontur:** Die Tonhöhe gleitet und biegt wie gesprochene Sprache (Frage steigt, Aussage fällt).
- **Emotion:** die 6 Stimmungen und 4 Calls aus §3 glaubhaft tragen.
- **Unterscheidbar:** Zwei Figuren nebeneinander sind am Klang zu unterscheiden, nicht nur an der Tonhöhe.
- **Ensemble-fähig:** Mehrere Stimmen zugleich ergeben Klang, kein Brei.

## 2 · Klangeigenschaften, nach denen sortiert wird
Sortiert wird nach Wirkung, nicht nach Bauart des Instruments. Deshalb steht etwa das Saxophon bei den nasal-hellen Stimmen, obwohl es organologisch ein Holzblasinstrument ist.

| Achse | Pole | Wozu |
|---|---|---|
| Wärme | warm ↔ kalt | sympathisch bzw. distanziert |
| Klangkern | hauchig ↔ klar ↔ nasal ↔ metallisch ↔ schräg | Charaktertyp |
| Gleitfähigkeit | stufenlos (Posaune, Theremin, Säge) ↔ gestuft (Zupfer, Tasten) | wie sprechend die Stimme wirkt |
| Register | Bass, Tenor, Alt, Sopran | Größe bzw. Gewicht der Figur, Platz im Ensemble |
| Ansprache | weich ↔ perkussiv | gemütlich bzw. zackig |

**Regel:** Für Sprech-Stimmen nur Instrumente mit Gleitfähigkeit (stufenlos oder mit Glissando bzw. Pitch-Bend-Spielweise). Gestufte Instrumente (Marimba, Spieluhr, Zupfer) nur für Spezialfälle oder als Ensemble-Rhythmus.

## 3 · Emotionen = Musiktheorie (gilt für jede Stimme gleich)
| Emotion | Skala bzw. Intervalle | Kontur, Rhythmus, Dynamik |
|---|---|---|
| froh | Dur, Sprünge aufwärts (Terz, Quinte) | staccato, schnell, Endton hoch |
| traurig | Moll, fallende Sekunden | legato, langsam, Endton tief und leiser |
| genervt | kleine Sekunden, Tonwiederholung | abgehackt, Seufzer-Glissando am Ende |
| aggressiv | Tritonus, tiefes Register | harte Akzente, kurz, laut |
| introspektiv | dorisch, Halteton | Pausen, schwebend, sehr leise |
| ängstlich bzw. staunend | Halbton-Zittern, weite Sprünge | Vibrato, unregelmäßig |

**Die vier Social Calls** (Ruf-Farben V-292) sind feste Motive, also für jede Figur dieselbe Melodiefigur in ihrer Stimme:

| Call | Bedeutung | Motiv |
|---|---|---|
| Bingo | Zustimmung | Kadenz, die sich aufwärts auflöst |
| Bongo | Ablehnung | fallende Quarte, abgebrochen |
| Boggle | Verwirrung | Frage-Steigung ohne Auflösung, ganztönig |
| Blödsinn | „so ein Quatsch“ | chromatischer Rutsch nach unten, „wah-wah“ |

## 4 · Story-Modes = Welt-Tonart (Ensemble)
| Modus | Tonalität | Wirkung |
|---|---|---|
| Tragic | äolisch, langsam | schwer |
| Comic | mixolydisch, hüpfend | leicht |
| Absurd | Ganzton bzw. chromatisch | schief |
| Heroic | lydisch, Quarten und Quinten aufwärts | strahlend |
| Mystical | Pentatonik mit Tritonus-Schimmer | rätselhaft |
| Forbidden | phrygisch, gedämpft | bedrohlich |

- Alle Stimmen laufen auf der gemeinsamen Musik-Uhr (WS-Audio) im Grundton des aktiven Story-Modes.
- Die Emotion einer Figur färbt innerhalb dieser Tonart. Eine traurige Figur im Comic-Mode singt also traurig, aber im selben Grundton.
- **Folge:** Mehrere sprechende Figuren klingen wie ein Ensemble. Inszeniert man es bewusst (Marktplatz, Disco, Ork-Band), wird es ein Orchester aus Figuren.

## 5 · Ensemble-Rollen
| Rolle | Register | Aufgabe |
|---|---|---|
| Melodie | Alt bis Sopran | Hauptfiguren im Gespräch |
| Gegenstimme | Tenor bis Alt | Antworten, Calls |
| Bass | Bass | große, schwere Figuren; trägt die Harmonie |
| Rhythmus | perkussiv bzw. gestuft | Gruppen, Bots, Menge (gestufte Instrumente gehören hierher) |

## 6 · Felder besetzen (Kandidaten, zur Diskussion)
Je Feld 1–2 Kandidaten. Bereits vergeben: FrizzleBob Posaune mit Dämpfer, Dory Okarina, Hunky Fagott bzw. Kazoo, Farmer B Akkordeon, Lorekeeper tiefe Klarinette.

| Klangkern \ Wärme | warm | kalt |
|---|---|---|
| **hauchig** | Flöte, Okarina | Panflöte, Glasflöte |
| **klar** | Klarinette, Horn | Oboe, Geige im Flageolett |
| **nasal** | Saxophon, Akkordeon, Mundharmonika | Oboe tief, gestopfte Trompete |
| **metallisch** | Posaune, Tuba | Trompete, Melodica |
| **schräg bzw. unheimlich** | Kazoo, Maultrommel | Theremin, Singende Säge |

Dazu kommt das Register als zweite Dimension: Dieselbe Familie in Bass- und Sopranlage ergibt zwei Stimmen (Fagott ↔ Oboe, Tuba ↔ Trompete, Cello ↔ Geige).

**Lücken bzw. Fragen an Georg:**
- Streicher (Geige, Cello): als eigene Familie für Ernste und Dramatische?
- Elektronik (Theremin für Aliens gesetzt): weitere „Welt“-Klänge für Fraktionen, z. B. Utopia-Bürokraten?
- Tierisches bzw. Kreaturen (Maultrommel, Didgeridoo)?

## 7 · Mapping auf Figuren (erst nach §6)
- **Familie = Identität:** Archetyp bzw. Fraktion, z. B. Aliens = Theremin-Familie, Landvolk = Akkordeon und Mundharmonika.
- **Register = Größe bzw. Gewicht der Figur.**
- **Persönlichkeit = Ausgangs-Emotion und Melodie-Stil:** Der Lorekeeper ist grundsätzlich introspektiv.
- **Signatur-Ornament** je benannter Figur (V-616).
- Quelle für die Ableitung sind die Dramatis Personae.

## 8 · Sprach-Detail in Stufen
| Stufe | Wann | Klang |
|---|---|---|
| L1 Wort-Ton | normale Zeilen | ein Ton je Wort plus Ornament (V-508) |
| L2 Silben-Motiv | Nahdialog, Hauptfiguren | Wort als kleines Motiv aus Anlaut und Vokal-Körper. **Erweiterung von V-508, Georg entscheidet** |
| Signatur | Hauptbesetzung | eigene Laute (Lachen, „Hm?“, Empörung) |
| Grundschicht | Emotion | Social Calls (w/m, V-640), zur Figur verschoben |

Gemurmel bzw. L0 wird nicht generiert. Das ergibt sich beim Ausspielen über Mischung und Lautstärke.

## 9 · Triplet und Lexikon
- **Fluff-Wort · Glyphe · Bedeutung:** Jedes Lexikon-Wort hat ein festes Motiv, abgeleitet aus dem Fluff-Wort. Es ist bei allen Figuren gleich und nur in ihrer Stimme gefärbt.
- **Dadurch wird die Sprache lernbar.** Das passt zum Dekodier-Feature (V-500).

## 10 · Fraktale Steuerung
Dieselbe Emotion wirkt auf jeder Ebene:
- **Wort:** Akzent.
- **Zeile:** Kontur.
- **Gespräch:** Ruf und Antwort.
- **Szene:** Ensemble.
- **Welt:** Story-Mode.

Spielereignisse setzen die Emotion: Heilen macht froh, ein Kampf erschreckt bzw. macht aggressiv, ein Gerücht macht neugierig.

## 11 · Visem-Ausgabe
Ein Ereignis-Strom treibt alles gleichzeitig:
- Note und Ton;
- Mund (Visem-light: zu, offen, rund, breit am `KFB_Mouth`);
- Augen, Brauen und Lider (Emotion, Augen-Rig);
- Glyphen-Enthüllung in der Blase.

## 12 · Daten und Zuständigkeit
- **Stimm-Profil je Figur** (Feld `voice` in der Besetzungsliste): Familie, Register, Grundton, Tonumfang, Tempo, Vibrato, Formant, Rauschen, Ausgangs-Emotion, Melodie-Stil, Ornament, Seed.
- **WS-Audio** baut die Engine aus der vorhandenen Melodie-Sprache aus.
- **Stimm-Casting** als Bereich im vorhandenen Sound-Studio, kein neues Tool (V-390).
- **WS0** schreibt Profile, Lexikon-Regel und Bausteinbank.
- **Writers Room** liefert die englischen Zeilen.

## 13 · Erzeugung (erst nach Freigabe dieses Papiers)
1. **Bandbreiten-Test** der in §6 freigegebenen Familien: je Familie die 6 Stimmungen und 4 Calls, je 1 Variante. Prompts ohne Leise-Wörter. Ergebnis ist eine Matrix: Welche Familie trägt welche Emotion?
2. **Ausbau der tragenden Familien:** zweite Varianten und Grundtöne.
3. **Budget gesamt:** innerhalb von 10.000 Credits (Georg 22.10.).
