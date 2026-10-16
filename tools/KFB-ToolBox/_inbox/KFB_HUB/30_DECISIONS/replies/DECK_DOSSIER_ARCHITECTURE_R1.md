# Deck-Dossier · Architektur R1 (V-363, Ausblick, noch nicht bauen)

Georg 16.10.: Zu jedem Kartendeck gehören auf Dauer Essay, Quellen, Song, Texte, Download. Alles soll an einem Ort liegen, strukturiert erfasst sein und über Anker-Links aufrufbar sein. Aus diesen Links kommt man auch ins Spiel. Später erscheint das im fraktalen Almanach als Deck-Ansicht.

## Grundidee: Verdichtungsstufen eines Themas
Ein Thema existiert in mehreren Verdichtungsstufen. Die Richtung kann wechseln: Manchmal wurde das Deck aus einem Essay gebaut, manchmal entsteht der Essay nach dem Deck.

| Stufe | Inhalt | Beispiel Epistemic Sabotage |
|---|---|---|
| L0 Quellen | Links, Bücher, Artikel, Brainfood zum Weiterstöbern | Seminar Erlangen 2023, Artikel „KI: Dein Feind und Helfer“ |
| L1 Essay | Langtext, mehrsprachig, Vorlese-Audio, Beigaben (z. B. Prompts) | „Let the AI Read Your Comics, Not Draw Them“ + 18 Readings |
| L2 Deck | gedrucktes PDF, Kapitel mit Slogans, Gumroad-Link/Download | 60 Karten, 15 Kapitel |
| L3 Karten | je Karte Name, Lore, Power, Triplet, Bild | registry `cards[]` |
| L4 Song/Performance | Takes, Lyrics, Style, Stems, SRT, später Choreo | Take 05, 123 BPM |
| Kanäle | Substack-Posts, Shop, Spiel | Substack-Essay + Song |

Jede Stufe nennt ihre Herkunft (`derivedFrom`), damit sichtbar bleibt, was woraus verdichtet wurde.

## Vorhandenes zuerst
- **Datenbasis:** `registry/assets/v1/decks/<deckId>.json` gibt es schon für jedes Deck, mit Karten. Das wird erweitert, kein zweites System. Neue Blöcke: `essays[]`, `sources[]`, `songs[]` (Verweis auf `kfb.deck-song.v1`), `links` (gumroad, substack, pdf), `derivedFrom`.
- **Leseseite:** `FrizzleBob/index.html` (kayfabizarro.pages.dev/FrizzleBob/#essay) hat schon Vorlesen, Sprachwahl, Tabs und Prompt-Kopieren. Sie ist der Spender für die Deck-Seite und bekommt nur den KFB-Look.
- **Songs:** `media/3D_Assets/Sounds/kfb_deck_songs/<id>/meta.json` gibt es schon (Cosmic Grift, Epistemic Take 05).

## Adressen (eine Seite pro Deck)
- `/deck/<deckId>` mit Ankern `#essay`, `#song`, `#cards`, `#card-<n>`, `#sources`, `#download`.
- Der Spiel-Einstieg ist dieselbe Adresse mit `?play`. Damit öffnet sich der Almanach auf diesem Deck bzw. dieser Karte.
- Der Gumroad-Download steht frei auf der Deck-Seite. Er hängt nicht davon ab, wie weit jemand im Spiel gesammelt hat.

## Rolle
Die Deck-Seite ist Marketing und Onboarding: Erst kommt man über Essay, Song oder Substack auf die Seite, von dort ins Spiel, und das Deck gibt es als Download.

## Offen (später, nicht jetzt)
- Look der Deck-Seite gestaltet Claude Design.
- Klickstrecke im Almanach (Deck-Ansicht im Spiel) gehört zu WS1, sobald der Almanach steht.
- Substack-Inhalte werden importiert (Liste der Posts je Deck von Georg oder per Export).
