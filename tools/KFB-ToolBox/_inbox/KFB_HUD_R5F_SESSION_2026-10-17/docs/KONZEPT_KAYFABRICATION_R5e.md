# KFB · Kayfabrication & HUD-Konzepte aus der R5-Session (Claude Design → WS0, 17.10.2026)

Session-Export. Design only (V-228). Sammelt Wording und alle Konzept-Ideen aus dem Chat, damit WS0 die Spielmechanik daraus ableiten kann. Bauteile: `hud-r5/r5e-hud.js`, Tafel `KFB HUD R5e Board.dc.html`.

## 1 · Wording

| Wort | Art | Bedeutung |
|---|---|---|
| **kayfabricate** (EN) / **kayfabrizieren** (DE) | Verb | aus Fluff etwas Absurdes herstellen; zuerst: eine noch nicht gesammelte KFB-Karte |
| **Kayfabrication** / **Kayfabrikation** | Nomen | der Vorgang, auch das Fenster im HUD |
| **Kayfabricator** | Nomen | die Maschine bzw. der Kessel, in den der Fluff gefüllt wird |
| **kayfabriziert** | Partizip | Status einer hergestellten Karte („Starter-Deck · kayfabriziert“) |
| **Kayfabricate bereit!** | HUD-Hinweis | erscheint, sobald jede der sechs Fluff-Sorten mindestens einmal da ist |
| **Kayfabricate…** | Taste | im Fluff-Korb, öffnet das Fenster |

Verwandt: **kayfabulieren** (erzählen, Story drehen). Kayfabricate ist die handfeste Seite davon: nicht erzählen, sondern bauen.
Mögliche Erweiterungen: Kayfabricate als Ort (Utopia, Maker Space), als Werkbank für Items, als Minispiel-Rahmen.

## 2 · Fluff-Kreislauf

1. **Einsammeln**: Spieler läuft über eine Fluff-Kugel. Die Kugel hüpft aus der Welt (Squash beim Abheben, Stretch im Flug), fliegt im Bogen zu ihrem Slot in der Fluff-Leiste, schrumpft auf Slot-Größe, rastet mit Squash & Stretch ein. Zahl im Slot und Gesamtzahl zählen animiert hoch. Leerer Slot bekommt beim ersten Mal seine Kugel.
2. **Komplett**: Sobald von allen sechs Story-Mode-Sorten mindestens 1 Kugel da ist: Kugeln hüpfen als Welle, Funken in den sechs Farben, Marke „Kayfabricate bereit!“ unter der Leiste (antippen öffnet den Korb), danach dauerhaft eine pulsierende Funken-Marke an der Leiste.
3. **Fluff-Korb** (Klick auf die Leiste): Bestand je Sorte. Unten „Kayfabricate…“: aktiv, wenn jede Sorte ≥ 1; sonst ausgegraut mit „Fehlt: …“.
4. **Kayfabrication** (Fenster wie Einstellungen):
   1. *Karte wählen*: bekannte Decks (mindestens eine Karte im Almanach). Gesammelte Karten farbig mit Haken, fehlende grau und wählbar.
   2. *Fluff einfüllen*: Preis je Sorte, Bestand daneben. Kugeln fallen in die Fassungen auf dem Ring des Kayfabricators.
   3. *Kayfabrizieren*: Ring dreht ein und zieht sich zusammen, Kern wechselt durch die sechs Farben, Kessel wackelt, Blitz.
   4. *Karte*: Karte springt aus dem Kessel, Funken, „In den Almanach“ oder „Noch eine“.
   Preis (Platzhalter): je Sorte 1, in der Story-Mode-Farbe der Karte 3.

Offen für WS0: Preis-Balancing, ob Duplikate möglich sind, ob auch Items/Kostüme kayfabriziert werden, Minispiel statt Automatik in Schritt 3, Ort in der Welt (Utopia / Maker Space).

## 3 · Aktionsleiste (unten Mitte)

`[Waffen-Paar] [Fortbewegungs-Paar] [Kontext-Platz] [Interagieren]`, auf dem Telefon alle sichtbar.

- **Paar** = zwei gleich große Tasten auf einem Sockel in der Familienfarbe. Primär leicht getönt, Spezial eine Stufe satter. Das Paar richtet sich nach dem ausgerüsteten Item.
  - Faust: Schlag · Wrestling-Spezial
  - Schwert: Schwerthieb · Klingen-Wirbel (Melee-Spezial)
  - Blaster: Schuss · Rakete (Ranged-Spezial)
  - Magie: Zauber · Magie-Spezial
- **Fortbewegung** (grün): Sprint (Umschalt) beim Gehen bzw. Turbo beim Fahren/Fliegen · Modus-Taste mit dem aktuellen Modus. Modus antippen öffnet: Gehen, Fahren, Fliegen | Teleport (öffnet taktische Karte / 3D-Galaxie mit allen Welten, Card-Decks, bekannten Portalen), Ruhestein (zurück nach KFB-Town).
- **Kontext-Platz**: nur kontextuell befüllt: Heiltrank, Cartoon-Bombe, Kostüm, Pilz, Bonbon. Leer = Mulde. Auslöser je Item: offen.
- **Interagieren** „i“ (Taste I): immer in der Leiste, ohne Ziel ausgegraut.
- Waffenwechsel: Paar klappt weg und springt in der neuen Farbe auf.

## 4 · Rucksack (unten links)

Taste mit Belegung („13/20“). Fenster: 20 Fächer links, rechts das gewählte Item als großes 3D-Bild mit Name, Art, Text und einer Aktion (Ausrüsten / In den Kontext-Platz / Benutzen). Ausgerüstete Waffe mit Haken. 3D-Bilder über `hud-flight/kfb-backpack.js` (Prop-Bibliothek + ein Renderer); Modelle vorhanden für Taxi-Schlüssel, Kassettenradio, Donut, Karte. Waffen und Kontext-Items brauchen Modelle.

## 5 · Ecke rechts unten (aus R5d)

Ton · „?“ · Einstellungen übereinander.
- **Ton**: antippen = alles aus/an; Hover bzw. langes Drücken = Fenster Musik/Effekte. Vorschlag: Ton aus + Radio abspielen → nur Musik an, Effekte bleiben aus; Musik aus → Radio pausiert.
- **Info „?“**: Spiel und Decks nach AIDA mit Taste zum Gumroad-Shop (https://georgvw.gumroad.com/?section=V4n4XYemvn1-_RTR-Oew8A==#V4n4XYemvn1-_RTR-Oew8A==), darunter Credits.
- **WS0-Auftrag Credits**: Liste aller genutzten Assets mit Creator, Link zu Shop/Hub und je einem humorvollen FrizzleBob-Meta-Kommentar (Kudos / Hat Tip). Format: `CREDITS` in `r5d-hud.js` plus Feld `tip`.
- **Einstellungen**: ohne Regie-Bereich und ohne Erklärtexte, Sprache Standard English. Ort für God-Mode / Start / Weltbild: offen.

## 6 · Weitere Punkte aus R5d

Tacho oben an der Karte · Zielwahl-Taste in Pfeilfarbe · Almanach-Stapel 2×, Fächer nach unten, Almanach-Ansicht als Buch · Radio: Playlist klappt unter der Tafel auf, Winkel schwarz · Telefon: Fluff ganz oben, Stapel darunter · Schließen = schwarzes X auf Holz.
