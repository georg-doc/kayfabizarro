# Props, Fundstücke, Loot · Sammlung R1 · WS0 · 01.11.2026 (V-1234, baut auf V-1203)

**Grundsatz:** Jede Fähigkeit hängt an einem Prop. Liegt es im Rucksack, ist die Fähigkeit da. Eine Tabelle als Daten, kein Sondercode je Prop.

## 1 · Was ein Prop freischaltet
| Prop | Schaltet frei | Stand |
|---|---|---|
| Kompass | Zielpfeil im HUD | Georg |
| Radio | HUD-Radio mit Playlists; ohne nur Ton an/aus | Georg |
| Waffen (Blaster, Pistole …) | Aktions-Slots im HUD | Georg |
| Bogen | ein Slot | Georg |
| Gatling mit Granatwerfer | füllt beide Slots | Georg |
| Jetpack, Cape, Dieselpunk-Geräte | Fahr- oder Flugmodus | Georg |
| Laterne, magische Lampe | größerer Lichtkreis | Q-042 |
| Leuchtstab, Leuchtkugel | Zonen abstecken, kurz hell | Q-043 |
| Pfeife, Feder, Windglöckchen | Windstoß als Wegweiser | Q-042 |
| Teleskop, astronomische Fundstücke | gezeichnete Sternbilder, Sternkarte | V-1211 |
| Uhr, Datums-Gerät | Uhrzeit und Datum im HUD | V-1212 |
| Historiker | Dialog aus der Quellenrecherche | V-1213 |

## 2 · Waffen und Slots
- Höchstens zwei Slots, primär und sekundär.
- Wechsel im Kampf per Taste zwischen den beiden. Andere Waffen über den Rucksack, das Spiel läuft dabei weiter, der Rucksack verlangsamt nur leicht.
- Eine Waffe belegt laut Daten einen Slot oder zwei.

## 3 · Rucksack und Archiv
- Rucksack bleibt bei 20 Plätzen. Volle Tasche ist eine Entscheidung, kein Fehler.
- Archiv ohne Grenze („bodenloses Schließfach“) in der Goblin-Bank, als große KayKit-Dungeon-Truhe mit vorhandener Öffnen-Animation, Licht und VFX. Dort auch Fluff und Zorn.
- Zugriff erst nur an der Bank; später vielleicht über ein seltenes Prop auch unterwegs.

## 4 · Truhen im Gelände
- **Plätze:** Über den einen Verteiler, in zerstörten Gebäuden, unter Schnee oder Partikeln. Fester Platz aus Saat und Ort, im Zellgedächtnis, Inhalt als Chronik-Ereignis.
- **Größen, eine Tabelle:**
  | Truhe | Inhalt |
  |---|---|
  | Klein | Fluff, oft |
  | Mittel | Fluff plus Prop oder Karte |
  | Groß | seltener Fund: Song, Tanz-Clip, Skin, Hut, dazu Fluff |
- Keine Doppelten, wenn es vermeidbar ist, wie bei den Karten (V-1231). Kein Kauf und keine Echtgeld-Logik.
- Eine Karte aus der Truhe bekommt denselben Hero-Shot (V-1230).
- **Aussehen (Georg 03.11., V-1289):** Truhen im Gelände sind Knet-Pop-ups in 2D wie die neuen Pop-ups, keine 3D-Kisten.
  - Eine Serie entsteht schnell: Augen, Charakter, je Deck ein eigenes Motiv.
  - Öffnen: Bildwechsel zu-auf mit Squash, kleiner Sprenkel- oder Funkenstoß und Truhenklang aus `card_reward_r3`.
  - Größe klein, mittel, groß nach der Tabelle oben.
  - Die 3D-KayKit-Truhe mit Öffnen-Animation bleibt der Goblin-Bank vorbehalten.

## Reihenfolge
**MVP:** Tabelle als Daten und Startausrüstung mit Kompass, Radio, einer Waffe, Jetpack. Nichts ist gesperrt, ohne dass man es merkt; Kernfunktionen sind vom Start da und können später als Fund beginnen.
**Nach dem MVP:** Truhen klein bis groß, zuerst nur Fluff, Prop und Karte. Bank und Archiv. Song, Clip, Skin und Hut, sobald es dafür eine Freischalt-Liste gibt. Weitere Props je nach ihrem Slice.

## HUD
Slots, Rucksack und Radio-Anzeige hängen am HUD-Prototyp aus Claude Design (V-1035, V-1038, V-1039). Keine zweite Rucksack-Logik: Es ist zu prüfen, was im Stamm schon steht.
