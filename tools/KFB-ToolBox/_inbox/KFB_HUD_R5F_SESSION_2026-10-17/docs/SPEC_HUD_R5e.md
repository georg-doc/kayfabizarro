# KFB HUD R5e · Aktionen, Rucksack, Kayfabrication (Claude Design → WS0, 17.10.2026)

Design only (V-228). Tafel `KFB HUD R5e Board.dc.html`, Bauteile `hud-r5/r5e-hud.js` (erweitert `r5d-hud.js`, alles Übrige wie `SPEC_HUD_R5d.md`). Konzept und Wording: `KONZEPT_KAYFABRICATION.md`.

## Layout-Änderungen gegenüber R5d
- **Unten links**: Rucksack 64 / 34, Belegungs-Marke „n/20“ oben rechts.
- **Unten Mitte**: Leiste 84 / 44 hoch: Waffen-Paar · Fortbewegungs-Paar · Kontext-Platz · Interagieren. Abstand 10 / 4.

## Paar
Sockel: Holz-Maserung in Familienfarbe (+2 / +10 / +22 % Schwarz), Radius 20 / 11, Innenschatten, Polster 4 / 2, Tastenabstand 6 / 3. Tasten 64 / 34.
Tönung: Holz Primär 14 %, Spezial 30 % Farbe · Lack Primär c, Spezial s · Plakette Ring c bzw. s, Papier 12 / 26 %.
Familien (c / s): Faust #EE6B3B / #C94E22 · Schwert #5A93D6 / #3A6FB4 · Blaster #22B3A3 / #118A7C · Magie #B06AD9 / #8A45B8 · Fortbewegung #6FBF4A / #4C9630.
Modus-Taste mit Winkel-Marke (öffnet Fenster). Waffenwechsel: altes Paar 140 ms auf scaleY 0, neues springt auf (340 ms).

## Fortbewegungs-Fenster
Holzplatte über der Leiste, mittig. Kacheln 92 / 48 (Taste 56 / 30 + Name), aktueller Modus in Mulde und satter. Rille zwischen Fliegen und Teleport. Teleport → Fenster (Platzhalter), Ruhestein → Gehen + Hinweis.

## Kontext-Platz / Interagieren
Kontext: Mulde 72 / 38; Item springt ein. Farben: Heiltrank #E84F6A, Bombe #46506E, Kostüm #7B62C9, Pilz #D9452F, Bonbon #FFB43A.
„i“ gelb (#FFD21F); ohne Ziel 42 % Deckkraft, Graustufen, nicht bedienbar.

## Rucksack-Fenster
1240 × 800 (Hülle R5d). 5 × 4 Fächer 112 (Telefon aus Breite), Abstand 12 / 5. Auswahl: Tinten-Ring 3 / 2, −2 px. Rechts Papier: Bild 340 / 112, Name 34 / 17, Art, Text, eine Aktion.

## Fluff
Flug 820 ms: Abheben (Squash 130/70, Stretch 80/125), quadratischer Bogen über die Bildhöhe −16 %, Größe 2,4 × Slot → 1 ×, Stretch im Flug bis 22 %. Einrasten 440 ms (155/50 → 80/128 → 110/92 → 1), Fassung 120 %. Zahl hochzählen (380 ms, Pop 145 %).
Komplett: Welle (70 ms Versatz), 16 Funken in den sechs Farben, Marke „Kayfabricate bereit!“ (Lack Gelb) 4,5 s, danach Funken-Marke 30 / 16 an der Leiste, pulsiert 1,6 s.
Korb: „Kayfabricate…“ Lack Gelb aktiv; sonst Mulde mit „Fehlt: …“.

## Kayfabrication-Fenster
1440 × 860. Schrittleiste 1–4. Schritt 1: Decks links (300), Karten 4 Spalten à 236. Schritt 2: Karte grau 380, Kayfabricator 430 (Holzring, Kessel in Mulde, Fassungen auf Radius 0,4), Preis/Bestand-Tabelle. Schritt 3: Ring 1,3 s Drehung 720° auf 10 %, Kern 1,5 s durch die sechs Farben auf 340 %, Kessel wackelt, Blitz 0,7 s. Schritt 4: Karte 640 springt aus dem Kessel (760 ms), 18 Funken.

## Offen
siehe Tafel, Abschnitt 3, und KONZEPT_KAYFABRICATION.md.
