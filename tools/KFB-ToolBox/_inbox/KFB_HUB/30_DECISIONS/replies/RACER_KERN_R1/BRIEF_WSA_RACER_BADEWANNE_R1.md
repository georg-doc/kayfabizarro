# Für WSA Racer · Folgeauftrag: Badewanne als dritter Fahrzeugtyp im Profil-Format · 17.11.2026 (Georg, V-1885)

**Georg (17.11.):** Die Badewanne soll ins Spiel, als offenes Fahrzeug für Medium- und Large-Rig. Der Fahrer auf dem Dach bleibt nur für offene Fahrzeuge (Badewanne, später Jeep oder Cabrio). Bei geschlossenen Wagen steht er wegen Rechenzeit und Optik in Frage.

**Bestand im Stamm** (`game/integration-r2`):
- `src/m2/M2Car.jsx`: `bathtub_kart` (r6e, WSB TUB_R6). Werte aus `bathtub_kart.kfb-vehicle.json`, Kasten und Schwebepunkte im GLB, Düse und Fahne über denselben Weg wie die anderen Wagen.
- `src/m2/roofDriver.js`: Vertrag `kfb.tub-driver/1`. Haltung wie der Dachfahrer, Fahr-Clip `kfb_tub_drive_ik`, Sprung hinein und heraus (`kfb_tub_enter/exit`).

**Auftrag:**
1. Ein Profil `CAR_TYPE_BADEWANNE.json` im selben Format wie Rennwagen und Dieselpunk: sichtbare Hülle, echte Physikhülle, Skalierung, Bodenfreiheit, Materialien, Effektparameter. Dazu der Sitz für Medium und Large.
2. Fahrgefühl auf dem Patch-Wagen-Kern: schwer, gutmütig, etwas schaukelnd. Anschlussprüfung wie bei den anderen beiden.
3. Für den Bodenkontakt (Staub, Steinchen, Rauchfahne, Speedlines) baut WS0 gerade eine gemeinsame VFX-Ebene für alle Fahrzeuge, das Jetpack in Bodennähe und das schnelle Laufen. Die Badewanne meldet dort Tempo, Bodenkontakt, Breite und Untergrund.

Lieferung wie bisher: Zweig, RETURN, Hub-Karte über WS0.
