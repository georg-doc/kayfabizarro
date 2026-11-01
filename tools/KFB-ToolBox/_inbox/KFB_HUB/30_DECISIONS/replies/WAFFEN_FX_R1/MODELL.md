# Mündungsfeuer und Explosion · Modell vor dem Bau · V-1184 · 01.11.2026
**Warum PR 48 flach aussieht:** Das Mündungsfeuer ist eine einzige Kit-Form (`Muzzleflash`), eine dünne Schale mit Farbverlauf ohne Licht und Volumen, dazu ein dünner Alpha-Rauch. Aus der Spielkamera liest sich das als Pappstück.

**Bewährte Lösung, die ich nehme:** das Flammen-Material der Rakete, das Georg abgenommen hat (V-1081, `kfb-flight-vfx.js`): geknetete Klumpen als Instanzen mit Farbrampe, Eigenleuchten und Auflösung über Rauschen, dazu derselbe Klumpen unbeleuchtet als Knet-Rauch. Die Flammenform ergibt sich aus Klumpen in Bewegung, nicht aus einer Fläche. Das Feuer hat dadurch echtes Volumen und bekommt Licht und Schatten der Szene.

**Aufbau je Ereignis (Etherington #783, #15, V-848):**
1. **Kern:** klein und spitz, sehr kurz (rund 60 ms). Beim Schuss sitzt er in Schussrichtung: ein Hauptstachel, zwei kurze Nebenstacheln, nie ringsum, also keine Krone und kein Stern.
2. **Feuer:** Klumpen schießen in Schussrichtung, werden stark gebremst, wachsen, kühlen über die Rampe ab.
3. **Rauch:** runde Knet-Massen, etwas später, steigen und quellen, lösen sich mit Löchern auf.
4. **Funken zuletzt:** dünn, spitz, im Bogen mit Schwerkraft.

**Je Waffe anders:**
- **Pistole, Dampf und Diesel:** kurz und fett, gelb-orange, öliger dunkler Rauch, heiße Funken.
- **Blaster, THX:** langer dünner Stachel, Plasma weiß bis blau, kaum Rauch, heller Dampf, blaue Funken.
- **Explosion:** kleiner unregelmäßiger Blitz, große Feuerklumpen, schwere dunkle Rauchsäule, Staubring am Boden, Gesteinsbrocken in drei Größen auf Wurfbahn; die Form kommt aus den Wolken.
- **Treffer:** Funken und ein kleiner Rauchball am Ort.

**Übernommen aus PR 48:** Rückstoß am Waffen-Halter, Schuss-ID und Ereigniskette, ein Spielerlicht. **Raus:** Kit-Form als Feuer, Alpha-Rauch.
**Kosten:** ein Modul, vier Instanzen-Netze, hinter `fx=r2`; ohne Schalter nichts geladen.
