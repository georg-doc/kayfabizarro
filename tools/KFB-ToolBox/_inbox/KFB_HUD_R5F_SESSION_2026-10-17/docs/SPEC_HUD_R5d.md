# KFB HUD R5d · Holz, zweiter Kritik-Durchgang (Claude Design → WS0, 17.10.2026)

Design only (V-228). Tafel `KFB HUD R5d Board.dc.html`, Bauteile `hud-r5/r5d-hud.js` (nutzt `r5-hud.js`, `hud-r4/r4-theme.js`, `hud-r4/r4-arrow3d.js`). Vorstand: `KFB HUD R5c Board.dc.html`.

## Raster (1080p · Telefon 390 × 693)
Rand 32 / 12, Abstand 12 / 6, Radius 14 / 9. Plattenhöhe 64 / 36, Aktionsleiste 84 / 44.

## Layout
- **Oben links**: Almanach-Stapel 200 × 114 / 100 × 57, allein.
- **Oben Mitte** (Telefon: ganz oben links, Stapel darunter bei top = Rand + 28 + 6): Fluff. Antippen → Fluff-Korb.
- **Oben rechts**: Tafel 264 / 112 (Karte 244 / 100, Zielzeile, Rille, Radio). Fahren: Tacho 124 / 66 links an der Tafel, oben bündig (top = Rand), 16 % Überlappung.
- **Unten Mitte**: Aktionsleiste. Gehen: Rucksack, Fluff-Alchemie, Fahrzeug. Fahren: ohne Fahrzeug.
- **Rechts unten**, übereinander (Abstand 12 / 6): Ton, Info „?“, Einstellungen, je 56 / 32. Unterste mittig zur Aktionsleisten-Höhe. Unten links frei.

## Zielzeile
Raster `[aw | 1fr | aw]`, aw = 80 / 34, Taste rechtsbündig in der rechten Spalte → Entfernung exakt auf Tafelmitte. Pfeilbild 99 / 42 mittig in der Pfeilspalte (bleibt bei jeder Drehung innerhalb der Tafel).
Klapptaste 44 / 24 in **Pfeilfarbe** (`arrowColor(T, dist)`; kein Ziel = fern; angekommen = `T.arrive`). Verlauf color-mix oklch: +26 % Weiß → Farbe → +14 % Schwarz, Kante +42 % Schwarz. Winkel hell mit Tinten-Kontur.

## Almanach
Reihenfolge = Sammelreihenfolge, letzter Eintrag = neueste Karte.
Zu: Stapel, neueste oben (z), oberste drei schief (0°, −5°, +4,5°), Hover spreizt × 1,9.
Offen: letzte sieben, neueste oben und ganz sichtbar, Schritt 92 / 50, Versatz x [0, 18, −8, 24, 4, −12, 14] (Telefon × 0,45), Drehung [−1,5, 3, −3,5, 2, −2,5, 3,5, −1]° (× 0,8), 28 ms Staffel. Kartenbreite 252 / 150. Darunter Holztaste „Alle N Karten“.
Hover offen: Karte nach vorn (z 50), +16 px, 104 %. Antippen: Almanach-Ansicht.

## Radio
Playlist-Winkel schwarz (Tinte). Antippen klappt die Playlist unter der Tafel auf (volle Tafelbreite, Holzplatte, Zeilen 40): aktuelle als Holzklotz mit Note in Heroic. Öffnen schließt die Zielwahl und umgekehrt. Telefon: keine Playlist-Taste.

## Ton
Taste Lautsprecher, Tragic-Blau. Antippen: alles aus / alles an. Hover (Maus, 220 ms) bzw. langes Drücken (Touch, 450 ms): Fenster links daneben, 240 × 124 / 128 × 74, Schalter Musik (Note) und Effekte (Stern).
Symbol: zwei Wellen = alles an, eine Welle = gemischt, X = alles aus.
Vorschlag: Ton aus + Radio abspielen → Musik an, Effekte bleiben aus. Musik aus → Radio pausiert.

## Info („?“, Fenster)
1240 × 800, Inhalt scrollt. AIDA: Kopf (Spiel, eine Zeile, Mirror-Neurons-Karte), Decks (PDF, Slides) → Taste „Get the decks on Gumroad“ (Lack Heroic) auf https://georgvw.gumroad.com/?section=V4n4XYemvn1-_RTR-Oew8A==#V4n4XYemvn1-_RTR-Oew8A==. Darunter Credits: Name, genutzte Assets, Link-Taste zu Shop/Hub, Hat-Tip-Zeile. Texte Entwurf (EN).
**WS0-Auftrag:** Liste aller genutzten Assets mit Creator, Link zu Shop/Hub und je einem humorvollen FrizzleBob-Meta-Kommentar (Kudos / Hat Tip). Format = `CREDITS` in `r5d-hud.js` plus Feld `tip`.

## Almanach-Ansicht (Fenster)
Aufgeklapptes Buch auf Holz, 1440 × 860 / volle Fläche − 24. Linke Seite (Papier, Falzschatten): Karte 700 breit, Titel, Story-Mode · n von N, Blättern ‹ ›. Rechte Seite: alle Karten, neueste zuerst, 3 Spalten, aktuelle mit Tinten-Ring. Telefon: Seiten untereinander.

## Fenster-Hülle (Einstellungen, Info, Almanach-Ansicht)
Abdunklung rgba(24,14,6,.5), Holzplatte Radius 22 / 14, Kopf: Titel 38 / 20 + Untertitel, Schließen: schwarzes X ohne Taste auf dem Holz (52 / 32 Trefferfläche), rot beim Hover. Antippen außerhalb schließt. Aufspringen 340 ms.

## Einstellungen
1240 × 800. Reiter links 280 breit: Spiel, Grafik, Ton, Steuerung, Barrierefreiheit. Keine Erklärtexte. Sprache Standard English. Inhalt in Mulde, Zeilen 72 hoch. Bausteine: Schalter (an = Comic-Grün mit Kontur), Regler (Heroic-Füllung, Holzknopf), Auswahl (aktiv = Holzklotz), Tastenkappe, Holztaste. „HUD federt“ schaltet die Federung live.

## Fluff
Cartoon-Farben (Farbton Story-Mode, heller/bunter): Tragic #3F93CF, Comic #93BE3C, Absurd #FFD21F, Heroic #F5893A, Mystical #9A62C4, Forbidden #E2508F; Schatten in Website-„dunkel“. Kugel 30 / 15, Kontur 2,2 / 1,2 Tinte, Glanzpunkt, je Kugel eine Kuhle (+8 / +4). Bestand 0 = leere Kuhle.
Fluff-Korb (Antippen): Gesamtzahl, Zeile je Story-Mode mit Kugel, Name, Bestand.

## Tastensprache (Tweak, gilt für alle Tasten)
`holz` heller Klotz, Icon farbig · `lack` Klotz in Aktionsfarbe, Icon hell · `plakette` runde Papiermarke, Ring in Aktionsfarbe, Tinten-Kontur, harter Schatten.

## Federung
Unverändert R5c.

## Offen
Kamerawinkel für Leiste unten Mitte · Ton aus + Radio („nur Musik“) bestätigen · Ort für God-Mode/Start/Weltbild · Credits-Liste (WS0) · Tastensprache wählen · Fluff-Kugeln in der Welt (3D) in Cartoon-Farben · Kartenrückseite/rechte Buchseite · Settings-Inhalte · Große Karte · Tastenbelegung.
