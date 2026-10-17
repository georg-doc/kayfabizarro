# KFB HUD · Konzept & Features, Stand R5f (17.10.2026)

Löst `KONZEPT_KAYFABRICATION_R5e.md` ab (dort weiterhin Wording-Herkunft und R5e-Formulierungen). Design only (V-228): beschreibt Look und Verhalten, keine Spielmechanik-Entscheidungen.

## 1 · Gestaltungsregeln (verbindlich ab R5f)

| Element | Regel |
|---|---|
| Icon-Taste | Fläche in der Farbe, Lack-Aufbau (heller Kopf, Grundton, dunkle Unterkante als Anhebung). Kein Sockel, keine Kontur, kein Badge. Radius 30 % der Kante. |
| Glyphe | Volle Silhouette in #52301A, Details ausgespart. Keine Zweitfarbe, keine Funken. ~70 % der Taste (Ecke rechts unten 58 %, #8A6644). |
| Text-Taste | Holzfläche, Text #2B1A0B. Hauptaktion (Kayfabricate…, Kayfabrizieren!, In den Almanach) Gelb #FFD21F. |
| Mulde | Leerer Platz oder „gibt es, aber gerade nicht möglich“. Blasse Glyphe = Tinte 30 %. |
| Klapp-Hinweis | Dreieck in Glyphenfarbe oben rechts in der Fläche. |
| Zähler | Nie als Plakette an einer Taste. Ausnahme Rucksack: Zahl ausgespart im Beutel. |
| Fluff-Kugel | Knete, matt, Korn, leicht unrund, kein Glanzpunkt, kein Rand. |
| Fluff-Fach | Feiner Glasrahmen in Sortenfarbe, innen vertieft. |
| Bewegung | Jede Taste federt (Hover, Drücken, Loslassen). Hover ruhig (halbe Auslenkung, ~650 ms), Drücken knackig (90 ms). `prefers-reduced-motion` und „HUD federt“ aus → keine Federung. |

## 2 · Layout (1080p · Telefon 390 × 693)
- Oben links: Almanach-Stapel.
- Oben Mitte (Telefon: ganz oben): Fluff-Leiste; antippen → Fluff-Korb.
- Oben rechts: Tafel (Karte, Zielzeile mit Pfeil und Zielwahl-Taste, Radio). Fahren: Tacho links an der Tafel.
- Unten links: Rucksack-Taste (64 / 34).
- Unten Mitte: Aktionsleiste (84 / 44 hoch).
- Rechts unten übereinander: Ton, Info „?“, Einstellungen (56 / 32), dezent.

## 3 · Aktionsleiste
`[Waffen-Paar] [Fortbewegungs-Paar] [Kontext-Platz] [Interagieren]`, auf dem Telefon alle sichtbar.

- **Waffen-Paar** nach ausgerüstetem Item:
  - Faust: Schlag · Wrestling-Spezial (Maske)
  - Schwert: Schwerthieb · Klingen-Wirbel
  - Blaster: Schuss · Rakete
  - Magie: Zauber · Magie-Spezial
  Wechsel: altes Paar klappt in 140 ms weg (scaleY 0), neues springt auf (340 ms).
- **Fortbewegungs-Paar** (grün): Sprint (Umschalt) beim Gehen bzw. Turbo beim Fahren/Fliegen · Modus-Taste mit Klapp-Dreieck. Modus öffnet: Gehen, Fahren, Fliegen | Teleport, Ruhestein. Aktueller Modus satter + fett beschriftet.
  - Teleport → taktische Karte / 3D-Galaxie mit allen Welten, Card-Decks, bekannten Portalen (hier Platzhalter-Fenster).
  - Ruhestein → zurück nach KFB-Town, Modus Gehen, kurzer Hinweis.
- **Kontext-Platz**: nur kontextuell befüllt (Heiltrank, Cartoon-Bombe, Kostüm, Pilz, Bonbon). Leer = Mulde. Item springt ein.
- **Interagieren „i“** (Taste I): immer da. Ohne Ziel Mulde mit blasser Glyphe, mit Ziel gelbe Taste.

## 4 · Rucksack
Taste: gelber Beutel wie Zielwahl-Taste, Zahl der Items mittig. Fenster 1240 × 800: 5 × 4 Fächer links (Glyphe oder 3D-Bild, Stapelzahl „×n“, Haken für ausgerüstete Waffe), rechts gewähltes Item groß mit Name, Art, Text und genau einer Aktion: Ausrüsten · In den Kontext-Platz · Benutzen. 3D-Bilder über `hud-flight/kfb-backpack.js`; Modelle vorhanden für Taxi-Schlüssel, Kassettenradio, Donut, Karte.

## 5 · Fluff & Kayfabrication
- **Einsammeln**: Kugel hüpft aus der Welt (Squash/Stretch), fliegt im Bogen zu ihrem Fach (820 ms), schrumpft auf Fachgröße, rastet ein (440 ms), Zahl und Summe zählen hoch.
- **Komplett** (alle sechs Sorten ≥ 1): Kugeln hüpfen als Welle, 16 Funken in den sechs Farben, Marke „Kayfabricate bereit!“ (4,5 s, antippen öffnet Fenster), danach pulsierende Funken-Taste an der Leiste.
- **Fluff-Korb**: Bestand je Sorte, unten „Kayfabricate…“ aktiv bzw. Mulde mit „Fehlt: …“.
- **Kayfabrication** (Fenster 1440 × 860, Schrittleiste):
  1. Karte wählen: bekannte Decks links, Karten rechts; gesammelt farbig mit Haken, fehlend grau und wählbar.
  2. Fluff einfüllen: Karte grau, Kayfabricator (Holzring mit Glasfächern, Kessel), Preis/Bestand-Tabelle. Preis (Platzhalter): je Sorte 1, in der Story-Mode-Farbe der Karte 3.
  3. Kayfabrizieren: Ring dreht 720° ein, Kern durch die sechs Farben, Kessel wackelt, Blitz.
  4. Karte springt aus dem Kessel, Funken; „In den Almanach“ / „Noch eine“.

### Wording
kayfabricate / kayfabrizieren (Verb) · Kayfabrication / Kayfabrikation (Vorgang, Fenster) · Kayfabricator (Maschine) · kayfabriziert (Status) · „Kayfabricate bereit!“ (Hinweis) · „Kayfabricate…“ (Taste). Verwandt: kayfabulieren.

## 6 · Ecke rechts unten (aus R5d, Look R5f)
- Ton: antippen alles an/aus; Hover bzw. langes Drücken → Fenster Musik/Effekte. Symbol: zwei Wellen = alles an, eine = gemischt, X = aus.
- Info „?“: Spiel und Decks (AIDA), Taste zum Gumroad-Shop, Credits.
- Einstellungen: Spiel, Grafik, Ton, Steuerung, Barrierefreiheit; Sprache Standard English.

## 7 · Offen für WS0 / Georg
1. Waffenwechsel außerhalb des Rucksacks (Taste, Rad, Schnellwahl)?
2. Auslöser je Kontext-Item (Trank bei Schaden, Bombe bei Gegnern …).
3. Kontext-Items: fünf Farben oder eine gemeinsame Kontext-Farbe (Bonbon liegt nah an Faust).
4. „Almanach-Fächer darunter“ (Notiz aus R5d-Einstellungen) noch nicht umgesetzt.
5. Kayfabrication: Preis-Balancing, Duplikate, Items/Kostüme kayfabrizierbar?, Minispiel statt Automatik in Schritt 3, Ort in der Welt (Utopia / Maker Space).
6. 3D-Modelle für Waffen und Kontext-Items.
7. Teleport: taktische Karte / Galaxie als eigenes Design-Paket.
8. Tastenbelegung (Umschalt = Sprint/Turbo, I = Interagieren, 1–6), Gamepad.
9. Credits-Liste mit FrizzleBob-Kommentaren (WS0-Auftrag aus R5d).
10. Telefon: Item-Zahl im Beutel nur ~8 px hoch – prüfen.
