# Aqua · HUD-Reparaturplan R1 (24.11.2026, Stand Artefakt v99)

**Kurz:** Prüfagent und Georgs Bilder ergeben 14 Stellen. Die meisten Probleme liegen auf kleinen Handys und in offenen Zuständen (Karte offen, Radio-Liste, Game Over). Das neue Kit löst die meisten über passende Formate statt Quetschen.
**Grundlage:** Prüflauf in sechs Größen (Desktop 1440, Laptop 1280, Tablet 768, Handy hoch 390, Handy quer 844, kleines Handy 360) und Georgs Bilder vom 24.11.
**Prüfskript:** Es hat alle Stellen als „grün“ gemeldet. Überlappungen zwischen Tafeln, Logo und Bildrand sieht es nicht. Erweiterung siehe Punkt W1.

## Neues Kit (Dropbox: KFB HUD Skins + UI)

**Tafeln (KFB Aqua HUD), alle mit Alpha:**

| Kennung | Bild | Format | Status |
|---|---|---|---|
| P1 | breite Tafel mit Bullauge oben | 1600×751 | |
| P2 | breite Tafel mit Lampe oben | 1578×757 | |
| P3 | Leiste | 1874×429 | |
| P4 | Querformat | 1310×795 | eingebaut als panel_wide2 |
| P5 | quadratisch | 1150×1128 | eingebaut als panel_square |
| P6 | Hochformat | 871×1501 | |

**Knöpfe und Ornamente (KFB Aqua Buttons + Ornamente):** fünf Bögen, je ein Bild mit vielen Teilen, die noch ausgeschnitten werden müssen.
- K1 leere Pillen-Rahmen
- K2 Füllungen (Glas, dunkel, Gold)
- K3 fertige Knöpfe mit Zuständen, Schalter, lange Leiste
- K4 runde Knöpfe, Ringe, Kippschalter, Regler
- K5 Ornamente: Wellen, Ecken, Nieten, Trenner, kleine Lampen und Symbole

## Liste (wichtig zuerst)

| # | Wo | Problem | Reparatur | Kit |
|---|---|---|---|---|
| H1 | kleines Handy, Game Over | Rap Sheet und Most Wanted laufen über den Bildrand, die Knöpfe liegen auf den Rahmen. | Beide Tafeln werden eine Tafel mit zwei Spalten, ohne Überlappung über dem Knopfplatz. | P1 |
| H2 | kleines Handy, Radio-Liste und Mixer | Die Liste liegt über der Fischkarte, Karteninhalt guckt heraus. | Ist Liste oder Mixer offen, blendet die Karte aus. | – |
| H3 | Desktop, offene Karte (lange Texte, z. B. Bullion) | Die Geschichte läuft in „Less“. | Offene Karte am Desktop in hoher Tafel. „Less“ und „Character sheet“ fest unten, Text darüber mit Rollbalken. | P6 |
| H4 | Desktop, Karte | Die Stärke-Zeile („Every fourth shell pays double.“) wird rechts abgeschnitten. | Zeile darf umbrechen, Stärke unter dem Etikett statt daneben. | – |
| M1 | Handy hoch und kleines Handy, offene Karte | „Character sheet →“ liegt unter der Goldecke unten rechts. | Mehr Abstand unten rechts (Eckwinkel der quadratischen Tafel), Link etwas nach links. | P5 |
| M2 | kleines Handy, offene Karte | Die Karte deckt das Logo ab („AQUA“ abgeschnitten). | Offene Karte in die Bildmitte, Logo bleibt frei, oder Logo blendet bei offener Karte aus. | – |
| M3 | Tablet, Startbild | Das Radio oben überdeckt Logo und Beta-Stempel. | Logo und Stempel unter das Radio setzen (gleiche Regel wie am Handy). | – |
| M4 | Handy hoch, Radio-Liste | Die Liste deckt das Logo ab. | Wie H2, Logo bleibt frei oder Liste in die Bildmitte. | – |
| M5 | Handy quer, Radio-Liste und Mixer | Die Tafel ist zu klein (171×220), Text unten abgeschnitten. | Quer eine breite Tafel mit zwei Spalten. | P4 |
| M6 | Auswahl, alle Größen | Die Punkte zwischen den Pfeilen lesen sich nicht als Auswahl (Georg). | Kleine Lampen aus dem Kit: aktiver Fisch leuchtet türkis, die anderen sind dunkle Messingnieten. Die Reihe sitzt in einer schmalen Leiste zwischen den Pfeilen. | K5 Lampen, P3 oder K3 Leiste |
| M7 | Handys mit hoher Pixeldichte | Die Spiel-Knöpfe sind nur ca. 133 px breit, weil das Knopfbild nur 399 px breit ist (Regel: nie über Bildgröße). | Knopfbild in höherer Auflösung (ca. 1200 px) beschaffen. Die Knöpfe auf den Bögen sind kleiner als heute, helfen hier also nicht. | Bildauftrag nötig |
| L1 | Laptop und Handy quer, Karte | Kartentext nur 10–11 px. | Karte etwas größer oder weniger Text in geschlossener Karte. | – |
| L2 | Tablet, offene Karte | Die quadratische Karte hat unten viel Leerraum. | Tablet bekommt das Querformat statt des Quadrats. | P4 |
| L3 | Radio-Liste | Die letzte Zeile verblasst und wirkt abgeschnitten. | Ausblendung kürzer, unten etwas Luft. | – |

## Werkzeug
- **W1:** Das Prüfskript lernt Überlappungen: Tafel über Tafel, Tafel über Logo, Tafel oder Knopf über dem Bildrand, Text abgeschnitten in Rolllisten. Es prüft alle neun Fischkarten statt nur DocFish (lange Texte wie Bullion).

## Nicht HUD, aber offen
- **A21:** ECHO im Spiel auf schwarzen 3D-Flächen statt auf Monitoren.
- Im Becken steht ECHO in der einen Welt schon auf der HyperNorm-Wand, im Meer noch auf den Monitoren.

## Vorschlag Reihenfolge
1. H1–H4 und M1 (lesbar und überlappungsfrei)
2. M6 Auswahl-Lampen
3. M2–M5, L1–L3
4. W1 parallel, damit es nicht wiederkommt
5. M7 braucht einen Bildauftrag für den großen Knopf.
