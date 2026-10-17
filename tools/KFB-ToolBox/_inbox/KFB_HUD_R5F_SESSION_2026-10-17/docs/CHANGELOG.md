# CHANGELOG · KFB HUD R5d → R5f (Session 17.10.2026)

Design only (V-228). Jede Runde hat eine eigene Tafel und ein eigenes Modul; ältere Stände bleiben lauffähig.

## R5f (aktuell) · Ein Tastenstil, ein Icon-Set
Auslöser: Kritik an R5e („viel zu viele unterschiedliche Icons und Button-Styles“).

### Tasten
- Ein Tastenstil für alle Icon-Tasten: Fläche in der Farbe (Lack-Aufbau), kein Sockel, keine Kontur, kein Badge. Tweak Holz/Lack/Plakette entfernt (`KEY.style = 'lack'` fest).
- Waffen- und Fortbewegungs-Paare ohne Sockel; Zusammengehörigkeit nur über Nähe (6 px) und Farbton (Primär hell, Spezial satter). Gruppenabstand 18 px.
- Familienfarben neu in zwei Stufen, alle hell genug für dunkle Glyphen (Tabelle in SPEC_HUD_R5f.md).
- „i“ ohne Ziel: Mulde mit blasser Glyphe statt Graustufen-Filter; mit Ziel springt die gelbe Taste hinein.
- Klapp-Hinweis der Modus-Taste: kleines Dreieck in Glyphenfarbe oben rechts in der Fläche, statt runder Winkel-Marke.
- Keine Zähler-Plaketten auf Tasten (Rucksack „13/20“ entfernt).
- Rucksack-Taste: Cartoon-Beutel mit Zugband, Item-Zahl mittig ausgespart; Fläche identisch mit der Zielwahl-Taste (`ybtn`, #E8BC37).
- Ecke rechts unten (Ton, Info, Einstellungen): heller und dezenter, Fläche #F4E7CC, Glyphe #8A6644, 58 %.
- Hover-Federung ruhiger: `FEEL` in r5d-hud.js eingeführt (Standard = alte Werte), R5f setzt halbe Auslenkung, 640 ms, Icon-Drehung ±4° über 820 ms.

### Icons
- Neues Set aus einer Hand: volle Silhouette, Details als Aussparung (SVG-Maske), keine Kontur, keine Zweitfarbe, keine Funken. Glyphe ca. 70 % der Taste.
- Glyphenfarbe dunkles Holzbraun #52301A statt Schwarz.
- Neu gezeichnet (2. Durchgang): Faust (Finger + Daumen), Wrestling (Maske statt Gürtel), Schwert (breiter), Blaster (Retro-Strahler mit Kühlrippen), Fliegen (Flugzeug statt Flügel), Ruhestein (runder Stein mit Haus), Bonbon, Rucksack → Beutel.
- Creme als Glyphenfarbe wird auf Holzbraun umgelenkt, damit R5d-Tasten (Radio, Almanach-Pfeile) dieselbe Hand tragen.

### Fluff
- Kugeln aus Knete: matt, feines Korn (einmal erzeugtes PNG über CSS-Variable `--kfb-clay`), weiches Licht, leicht unrund; kein Glanzpunkt, kein Tintenrand.
- Fächer: feiner Glasrahmen in der Sortenfarbe (Verlauf hell oben links → dunkler unten rechts), innen leicht vertieft. Gilt für Leiste, Korb und Kayfabricator-Ring.
- Performance: SVG-feTurbulence als Hintergrund war zu teuer (Tafel hing) → durch PNG ersetzt.

## R5e · Aktionen, Rucksack, Kayfabrication
- Aktionsleiste neu: Waffen-Paar · Fortbewegungs-Paar · Kontext-Platz · Interagieren.
- Fünf Familien: Faust, Schwert, Blaster, Magie, Fortbewegung; je Primär + Spezial.
- Fortbewegungs-Fenster: Gehen, Fahren, Fliegen | Teleport (Platzhalter-Fenster für taktische Karte), Ruhestein (zurück nach KFB-Town).
- Kontext-Platz: Heiltrank, Cartoon-Bombe, Kostüm, Pilz, Bonbon.
- Rucksack unten links + Fenster: 20 Fächer, rechts großes Bild (3D für Taxi-Schlüssel, Radio, Donut, Karte), Text, eine Aktion; Ausrüsten tauscht das Waffen-Paar.
- Fluff: Flug in den Slot, Einrasten, Zähler; alle 6 Sorten ≥ 1 → „Kayfabricate bereit!“, Korb mit „Kayfabricate…“.
- Kayfabrication-Fenster in vier Schritten (Karte wählen, Fluff einfüllen, Kayfabrizieren, Karte).
- Fix: Farbmischung Holz/Plakette (Familienfarbe wurde von der Holzbasis verschmutzt).

## R5d · Holz, zweiter Kritik-Durchgang
Siehe SPEC_HUD_R5d.md: Almanach-Stapel und Buchansicht, Tafel mit Zielzeile und Radio, Ton/Info/Einstellungen rechts unten, Fenster-Hülle, Einstellungen, Info mit Gumroad und Credits.
