# Ende-Kaskade R2 · Ablaufblatt mit festen Regeln und Prüfung (WS0, 17.11.2026, nach Georg q744 TUNE)

**Anlass (Georg q744, Chat):** In der Kaskade fehlen Choreografie, Abstimmung und Konzept.
- Der Körper schrumpft an einer anderen Stelle als die Pfütze.
- Er liegt in einer anderen Farbe als das Goo.
- Der blaue Soldat ploppt am Ende groß wieder auf.
- Daneben entsteht ein hellgrüner Fleck.
- Schatten und Kontakt stimmen nicht, kein Horizont, keine Schusseffekte im Beleg.

## Drei Grundregeln (gelten in jedem Takt)
1. **Eine Stelle:**
   - Bezugspunkt ist die Hüfte des Körpers (Soldat: Knochen `Hips`; Würfelmonster: Mitte des Körpers ohne Augen).
   - An der Hüfte wird der Körper gestreckt und zusammengesaugt, dort entstehen Goo-Krone und Pfütze, dort steigt der Fluff auf.
   - Das Gewehr und andere Requisiten zählen nicht zur Mitte und nicht zur Größe.
2. **Eine Farbe:**
   - Körper, Goo-Krone, Pfütze, Schnipsel, Spritzer und der Fluff-Überzug haben dieselbe Farbe.
   - Diese Farbe ist die **gerenderte Körperfarbe**. Beim Soldaten ist das sein Ton mal die Helligkeit der Textur, genau wie im Shader.
   - Der Körper wird nicht zusätzlich abgedunkelt. Er ist schon in der Goo-Farbe.
3. **Weg ist weg:**
   - Ab der Marke `weg` bleibt der Körper unsichtbar und klein. Keine andere Regel darf ihn wieder zeigen (Sichtweite, Planung, Respawn).

## Takte (Rezepte `src/data/choreo`)
| Takt | Soldat Kampf (`soldat_tod`) | Soldat Wagen (`soldat_umfahren`) | Regel |
|---|---|---|---|
| Treffer | Mündungs- und Trefferblitz der Waffe (Kampf), Goo-Spritzer an der Trefferstelle in Kraftrichtung | Kontakt: Blitz und Spritzer am Kontaktpunkt | Farbe = Körperfarbe |
| Reaktion | Sterbe-Clip bis zum Liegen | Puppe fliegt, Marke `liegt` wartet, bis sie still liegt | Kontaktschatten folgt dem Körper |
| Aufblähen | 0,32 s an der Hüfte: Höhe ×1,18, Breite ×1,3, Zittern | gleich, an der Hüfte der liegenden Puppe | keine Farbänderung |
| Platzen | Goo-Krone an der Hüfte in Körpergröße, Körper wird 0,12 s hineingesaugt | gleich | Krone ≥ Körper, keine Lücke |
| Pfütze | Krone fällt zur Pfütze, nasser Fleck, Perlen | gleich | Pfützenmitte = Hüfte |
| Fluff | steigt aus der Pfütze, zuerst in Körperfarbe, dann Story-Farbe | gleich | Start = Pfützenmitte |
| Einsickern | Pfütze zieht sich zusammen und sinkt ein | gleich | Körper bleibt weg |

## Prüfung vor jedem Video (Code, nicht Augenmaß)
Probe `test/_ende-gate.mjs` auf der Kampfbühne, je Figur und Ursache:
- **Mitte:** Goo-Mitte zur Hüfte beim Platzen ≤ 0,15 m.
- **Farbe:** Goo-Farbe gegen gerenderte Körperfarbe, ΔE ≤ 6 (gemessen im Bild: Pixel am Körper vor dem Platzen gegen Pixel in der Pfütze).
- **Weg:** Körper unsichtbar ab `weg` bis zum Ende der Probe, mindestens 3 s danach.
- **Größe:** Kronenhöhe ≥ Körperhöhe beim Platzen.
- **Schatten:** Kontaktfleck unter Fuß bzw. Körper vorhanden.

Erst wenn alles grün ist: Einzelbilder an jeder Marke selbst ansehen, dann **ein** Kritiker, dann das Video für Georg.

## Beleg
- Nur auf der Kampfbühne.
- Kameras in Augenhöhe mit Horizont (seite, dreiviertel, kontakt), FB schießt wirklich, mit Mündungs- und Treffereffekt.
- Soldat bzw. Würfelmonster auf Z.
- Wagen vom Anlauf.

## Bau-Reihenfolge
1. Soldaten auf die Bühne. Ein gemeinsamer Ende-Wirt (Goo, Spritzer, Fluff) für Arena und Bühne, damit es nur einen Weg gibt.
2. Die Fehler laut Grundregeln: Hüfte, gerenderte Farbe, kein Abdunkeln, `weg` sperrt die Sichtweite, Kontaktschatten.
3. Prüfung bauen und grün bekommen, zuerst Soldaten, dann Würfelmonster mit derselben Prüfung.
4. Beleg, Kritiker, dann Hub.
