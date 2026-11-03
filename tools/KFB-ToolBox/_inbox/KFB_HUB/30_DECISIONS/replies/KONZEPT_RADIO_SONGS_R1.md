# Radio und Songs sammeln · Konzept R1 · WS0 · 03.11.2026 (V-1281, baut auf V-1234 Radio-Prop, V-1231 Kartenregel, LEAN_MEMORY_R1)

Georgs Idee vom 03.11. Songs sammelt man wie Karten. Die Bausteine sind schon da: Radio-Prop, Kartenspeicher, Chronik und Musikkatalog mit Deck-Clustern.

## 1 · Wie man Songs bekommt
- **Freihören (zuerst):** Ein Song, der im Radio beim Fahren oder Fliegen bis zum Ende läuft, ist gesammelt. Das Radio leuchtet dabei kurz auf, mit Glanz und Funken wie beim Karten-Hero-Shot, aber klein und ohne Pause, dazu ein kurzer Belohnungsklang aus `card_reward_r3`.
- **Später:**
  - aus Truhen, als Kassette;
  - geschenkt von Figuren;
  - beim Zuhören an der Rockband;
  - über Fluff-Alchemie.

  Gleiche Regel wie bei den Karten: jeder Song nur einmal, keine Doppelten, wenn es vermeidbar ist. Kein Kauf, kein Echtgeld.

## 2 · Was im Radio läuft
- **Die Auswahl hängt an Zone und Biom:** Songs, deren Deck-Cluster zur Kartenzone passt (Musikkatalog, Feld `use` bzw. Cluster), kommen häufiger. Bewusst laufen aber auch unpassende dazwischen, Mischen wie in der HyperNorm-Ebene, etwa 60 zu 40.
- **Ablauf:** Am Ende eines Songs kommt der nächste, mit der vorhandenen Überblendung.
- **Pool:** Ungesammelte Songs gehören dazu, denn so hört man sie frei. Gesammelte bleiben im Pool und lassen sich zusätzlich gezielt wählen.

## 2b · Eine Themenlogik für Songs, Props und Karten (Georg 03.11., V-1291)
- Kein festes Mapping. Songs (Musikkatalog), Pop-ups (`popup_tags.json`) und Decks tragen dieselben Tags: Region bzw. Kultur, Stimmung, Element.
- Ausgewählt wird wie bei WFC: Nachbarn im Biom und in der Zone bestimmen die Gewichte. Meist passt es, manchmal ist es bewusst cartoonig-bizarr unpassend. Die Saat kommt aus dem Ort; wer dorthin zurückkehrt, findet dasselbe vor.
- Wer in anderen Biomen unterwegs ist, sammelt andere Karten, andere Songs und sieht andere Props.
- Besitzer der Logik ist der eine Verteiler (WS-Verteiler); Radio und Pop-ups lesen sie nur.

## 3 · Bedienung
- **Am Radio nur vier Knöpfe:** Play/Pause, nächster Song, Ton aus, Aufklappen.
- **Diegetisch:** Das Radio sieht aus wie ein echtes Knet-Radio mit Drehknöpfen, Skala und Lautsprechergitter, nicht wie flache Schaltflächen. Vorlagen und Elemente gestaltet Georg mit ChatGPT-Web (Hub b298), der Einbau folgt dem HUD-Prototyp.
- **Aufklappen öffnet dasselbe Overlay wie der Fraktale Almanach und die Einstellungen:** eine Liste der gesammelten Songs mit Cover, Stil und Fundort. Lieblingssongs zieht man in eine eigene Playlist; die kommt erst in der zweiten Stufe.

## 4 · Gedächtnis
Gesammelte Songs stehen im Kartenspeicher und als Chronik-Ereignis `song_gesammelt` mit Ort, Spieltag und Quelle (Freihören, Truhe, Geschenk, Band, Alchemie). So erinnern sich Figuren daran, und das Lean Memory trägt es mit.

## 5 · Später
- Kurze satirische Werbe-Jingles und Nachrichten zwischen den Songs, mit Rauschen und Senderwechsel wie bei einem Piratensender. Dazwischen auch FrizzleBob-Songs von YouTube.
- Eigene Songs der Spielenden, etwa über Spotify, ganz einfach gehalten.

## Reihenfolge
1. Nach der Fahrrunde (V-1279) und dem Deck-Moment: Freihören, Leuchten am Radio, Speicher, Zonen-Auswahl. Klein, nutzt `sammel` und den Katalog.
2. Knet-Radio aus Georgs Vorlagen und das Overlay mit Liste.
3. Danach: Playlist, Truhen, Geschenke, Band, Alchemie, Jingles, Spotify.
