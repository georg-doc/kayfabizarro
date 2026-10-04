# Brief an WSA · Fluid-Shader aus Card Lab v2 · 2026-10-03

Von: Claude Design (World Core R2D) · Für: WSA · Entscheidung: Georg

## Anlass
Das Wasser auf der R2D-Insel braucht eine Oberfläche, die fließt. Konzept: `KFB_R2D_v0/WATER_CONCEPT.md`. Der Fluid-Shader aus Card Lab v2 soll das liefern, ohne Kopie und ohne zweite Wahrheit.

## Bitte liefern
1. **Fundort:** Repo-Pfad und Commit-Pin des Shaders in Card Lab v2.
2. **Ladeweg:** als ES-Modul über jsDelivr ladbar (nicht über raw). Exportierte Funktion, z. B. `makeFluidMaterial(THREE, opts)` oder ein `onBeforeCompile`-Patch, das auf ein vorhandenes Material passt.
3. **Schnittstelle:** Uniforms und Attribute mit Einheiten. Gebraucht wird mindestens:
   - Strömungsrichtung über UV (u = Bogenlänge entlang der Fließlinie, v = quer),
   - Tempo als Uniform oder Vertex-Attribut (variiert entlang der Linie),
   - Zeit-Uniform,
   - Farbe oder Palette, verträglich mit dem Clay-Look v8/v10 (`seedGeometry10`, Knet-Relief).
4. **Grenzen:** Three.js-Version, die er erwartet; ob er Transparenz, Tiefe oder eine Render-Ziel-Kopie braucht; Kosten pro Fragment, wenn bekannt.
5. **Ein Beispiel:** kleinste Szene, die den Shader auf einer Fläche zeigt (Link oder Datei im Repo).

## Nicht nötig
Kein Umbau von Card Lab. Kein Export von Assets. Falls der Shader fest in einer Bühne verbaut ist (wie der Knetstrang in J14), bitte melden. Dann klären wir wie beim Knetstrang, ob WSA ihn als Baustein herauslöst.

## Rückmeldung
Pin + Ladeweg + Schnittstelle in eine Zeile je Punkt. NOT_TESTED kennzeichnen, was nicht gelaufen ist.
