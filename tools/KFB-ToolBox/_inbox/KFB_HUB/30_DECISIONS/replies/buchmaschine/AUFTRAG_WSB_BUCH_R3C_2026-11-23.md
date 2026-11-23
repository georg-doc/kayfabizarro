# Auftrag an WSB: Buch „Hilfe, ich bin ein Mensch!“ r3c (über WS0, Georg 23.11.: „Richtung stimmt, WSB-Aufträge raus“)

Grundlage: KFB_Buch_Mensch.r3b.glb (Normal-Map korrigiert, danke). Die Befunde stammen aus dem Intro-Produktfilm der Buchmaschine (Belege: replies/buchmaschine/schluesselbilder_intro_r5/, kritik_intro_r5/). Die Kamera geht sehr nah ans Buch (Makro, Streiflicht), deshalb fallen diese Punkte auf.

1. **Umschlag innen und Klappen-Innenseiten** (`Buch_Umschlag_innen`): Für den Druck gibt es keine Daten, das bleibt weißer Karton. Bitte eine feine Kartonstruktur geben (Papierkorn, leicht gebrochenes Weiß, ganz schwache Faser), damit die Fläche in der Nähe nicht wie ein grauer Platzhalter wirkt. Keine Muster, kein Raster.
2. **Seitenkanten** (`Buch_Schnitt`): Die heutige Textur zeigt schräg und aus der Nähe gestreifte, flimmernde Linien. Bitte eine ruhige Papierschichtung (feine, unregelmäßige Lagen mit leichter Tonwertschwankung) mit sauberen Mipmaps. Die UV-Richtung soll den Lagen folgen.
3. **Bund und Rücken-UV**: Im aufgeschlagenen Buch erscheint im Bund ein Streifen der Rückentextur mit den Autorennamen (UV-Überlappung, gut sichtbar bei der Mammut-Doppelseite). Bitte den Bund mit Papier statt mit Umschlag belegen.
4. **Neuer Clip `umschlag_ausfalten`**: Ausgangslage ist das geschlossene Buch, gesehen von der Rückseite.
   - Der Vorderdeckel öffnet sich um 180° nach hinten, sodass die Außenseite des ganzen Umschlags zur Kamera zeigt.
   - Danach klappen die vordere und die hintere Klappe nacheinander aus, jeweils mit leichtem Überschwingen.
   - Der Buchblock bleibt sichtbar am Rücken hängen, nicht unsichtbar dahinter.
   - Dauer etwa 2,2 s, dazu die Rückrichtung `umschlag_einfalten`.
5. **Blättern sauber**: `blaettern` für Paket p01 und Blatt b14 bitte mit natürlicher Biegung (Seite hebt sich an der Ecke, rollt über, legt sich ab), ohne Knick. Je etwa 0,9 s.

Abgabe: `KFB_Buch_Mensch.r3c.glb` in assets/private 50_BLENDER/BUCH_MENSCH_R1/out, mit Clipliste und einem Beleg je Punkt (Nahaufnahme). Die Knochennamen bleiben gleich (deckel_v, klappe_v, klappe_h, p01…, b14…), damit die Bühne ohne Umbau weiterläuft.
