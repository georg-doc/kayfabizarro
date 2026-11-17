# Für WSA Patch · Infinite Rooms: Bruch-Ruckler weg, dann Übergabe zum Einbau · 17.11.2026 (WS0, V-1882)

**Stand:** Der Blaster-Prüfstand mit echter Geometrie, Kollision, Bruchstücken und FPS/TPS-Treffern (280 Tests) ist gut, danke. Vor dem Spieleinbau bleibt ein harter Punkt.

1. **Bruch-Aussetzer von 150–300 ms beheben.** Im Spiel ist das ein sichtbarer Ruckler. Ziel: Kein Bild ist beim Bruch länger als 33 ms. Das wird gemessen, über 20 Treffer in Folge, mit Blaster und Gatling.
   - Wege: den Bruch-Graphen beim Raum-Aufbau vorberechnen, die Arbeit je Bild mit einem Zeitbudget verteilen (wie das Gelände mit 2,5 ms) oder einen Worker nutzen.
   - Der Schnitt bleibt beim vorhandenen Bruch-Graphen der Kartengebäude (V-1289).
2. **Figuren- und FPS-Pose baust du nicht.** Haltungen gehören seit heute WS1 (Waffenkammer: KayKit-Clips `Ranged_1H/2H`, Hüfte). Nutze, was dort entsteht.
3. **Übergabe zum Einbau**, wenn Punkt 1 erfüllt ist:
   - ein Kandidat auf dem aktuellen Stamm-Stand;
   - eine `combatTargets`-Quelle;
   - Rezept und Waffenprofile als Daten.
   - **Keine Kopien von Stamm-Dateien** im Paket (`native/…`). Das Modul importiert die Originale.
   - RETURN mit Messung (längstes Bild beim Bruch, Mittel, 95 %).

Weiter privat, kein Merge. Den Einbau macht WS0.
