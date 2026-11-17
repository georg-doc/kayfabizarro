# Bodenkontakt-VFX R1 · eine Effekt-Ebene für alles, was schnell über den Boden geht (WS0, 17.11.2026, Georg)

**Georg (17.11.):** Partikel, Gaußsche Splats oder die vorhandene Rauchfahne der Dieselpunk-Wagen mit Speedlines (beim Jetpack abgeschaltet, weil falsch ausgerichtet und angebracht) sollen am Boden ansetzen. Dazu kommen wirbelnde Steinchen und Staub, abhängig vom Tempo und vom Untergrund (Straße staubt weniger als Dirt-Track). Das Ganze modular, also gleich für breite Dieselpunk-Wagen, Rennwagen, Badewanne, Jetpack in Bodennähe und die Siebenmeilenstiefel.

## Schnitt
- **Ein Modul `bodenFx`**, ein Besitzer (WS0). Quellen melden sich an mit `{ pos, vel, kontakt 0…1 (Räder bzw. Füße am Boden, beim Jetpack Abstand zum Boden), breite, spuren (Rad- bzw. Fußpunkte) }`.
- **Untergrund** aus `surfaceAt` und dem Materialcode (`src/modules/materialContact.js`), erweitert um Asphalt, Pflaster, Erde, Sand, Gras, Stoff. Je Material eine Zeile: Staubmenge, Steinchen, Farbe aus dem Boden, Spurtiefe.
- **Bausteine (Bestand):**
  - Rauchfahne der Wagen (Signale in `M2Car`);
  - Patch-Reifenspuren (`vendor/patch-car/effects.js`);
  - Speedlines (`vendor/vfx/kfb-flight-vfx.js`, `createSpeedTrails`), neu ausgerichtet: am Boden hinter der Quelle, nie vor der Kamera;
  - Steinchen über den Kiesel-Weg des Verteilers (kein zweiter Streuer);
  - Gaußsche Splats nur, wenn die Piloten (kayfabizarro #474) tragen.
- **Tempo-Stufen** steuern die Menge: unter Lauftempo nichts, Turbo mit Staubstößen pro Aufsetzer, Roadrunner mit Staubschleppe und wirbelnden Steinchen.

## Reihenfolge
1. Nach der Soldaten-Kaskade, vor „Spielbar 1“ nur, wenn Zeit ist; sonst direkt danach.
2. Zuerst die Wagen (Bestand umziehen), dann das Jetpack in Bodennähe, dann die Siebenmeilenstiefel, wenn die Laufstufen von WSB stehen.
