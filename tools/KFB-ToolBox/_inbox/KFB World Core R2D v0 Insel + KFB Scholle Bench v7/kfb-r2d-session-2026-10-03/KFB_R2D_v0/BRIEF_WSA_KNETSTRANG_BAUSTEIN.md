# Brief an WSA · Joyride-Knetstrang und Übergänge als Bausteine für R2D

Datum: 2026-10-03 · von: Claude Design (Projekt Hex Assets Worldbuilding) · für: WSA / Joyride-Owner
Bezug: R2D v0 Insel (`KFB World Core R2D v0 Insel.dc.html`, `KFB_R2D_v0/`), Brief R2D @ 14a1c55 (PR #328)

## Worum es geht, in einem Satz
Georg will die Inselstraßen im Joyride-Standardlook (runder Knetstrang). Dieser Look existiert, ist aber nur als ganze Joyride-Bühne aufrufbar. R2D braucht ihn als Baustein, der eine Track-Core-Strecke entgegennimmt und den Strang zurückgibt.

## Quelle (gelesen, nicht kopiert)
- `tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/track-look.v5.js` @ `927a1b4` — der Knetstrang (Hohlkehle, Randwulst, Bauch, runde Bandenköpfe, Stützen) wird **innerhalb von `boot(canvas)`** gebaut. Einziger Export: `boot`, `WORLDS`.
- `…/lab-track/core/track-core.v012.mjs` + `stream-to-three.v5.mjs` — Kern 0.12 mit Kreisverkehr-Knoten. R2D nutzt bisher BUILDER 0.8.1 @ `64d8597`.
- `…/lab-track/transition-atlas.v1.js` — exportiert bereits `patchify(material, key, cell)` und `makeAtlas({ S, N, ds, TP, GY, MR, M2 })`.
- `…/lab-track/road-markings.m1.js` — exportiert `KFB_BLEND_GLSL` (kfbBlend). **R2D nutzt das bereits** für alle Bodenübergänge.
- Entscheidung Track-Look T1 (`TRACK_LOOK_DECISION.v1.json`): A Hirnwelt als Basis + B Race-Semantik, Fahrfläche geometrisch unverändert, Knet-Verformung nur an Bande, Röhre, Bordstein und Szenerie.

## Auftrag (eine Lieferung)
1. **Knetstrang als Funktion** im Joyride-Owner, z. B. `lab-track/clay-strand.v1.js`:
   `buildClayStrand(THREE, stream, { U, profiles, palette, seed, lod }) → { group, stats }`
   - Eingabe: ein Track-Core-Stream (Single-Route und Graph), kein Canvas, kein Renderer, keine Kamera.
   - Ausgabe: Meshes für Strang, Bande, Bordstein, Stützen. Die Fahrfläche bleibt die aus dem Stream.
   - Die Logik zieht aus `track-look.v5.js` um, wird dort nicht kopiert. `track-look.v5` ruft danach selbst `buildClayStrand` auf (ein Owner).
2. **Inselvariante als Parameter**, kein eigener Code: niedrige Bande auf der Insel, hohe Brüstung am Brückenkopf, ohne Stützen, wenn Gelände darunter liegt.
3. **Kern 0.12 für R2D freigeben** oder sagen, welcher Kern gilt. R2D braucht Kreuzung und Kreisverkehr.
4. **Übergänge**: `makeAtlas` so öffnen, dass Bordstein-Knetsteine, Gehwegplatten, Böschung, Graben und Zaunsockel einzeln abrufbar sind (gleiche Form wie oben: Stream rein, Gruppe raus).

## Was R2D schon selbst kann (kein Auftrag)
- Stützen unter einer Schluchtbrücke als PLATZHALTER nach dem J14-Rezept (Elefantenfuß, Taille, Bauch, Kapitell). Sobald `buildClayStrand` Stützen liefert, fällt der Platzhalter weg.
- Bodenübergänge Gras ↔ Sand ↔ Pflaster ↔ Fels mit `kfbBlend` aus `road-markings.m1.js`, Punktflächen statt Verläufen.
- Teich mit Knet-Tröpfchen, die zum Ufer hin auslaufen (instanziert).
- Natur als eine Familie: KayKit Forest Nature Pack + Quaternius-Trittsteine @ `378b209`.

## Grenzen
Keine zweite Strecken-Engine, keine Kopie von `track-look.v5`, keine Änderung der Fahrfläche, kein neuer Renderer. Fehlt ein Teil, heißt er `SOURCE_REQUIRED`.

## Fertig, wenn
R2D ruft `buildClayStrand(THREE, P.stream, …)` am Pin auf, und die Inselstraße sieht in Fahrhöhe aus wie in J14 bei gleichem Licht. Die Prüfungen des Kerns bleiben grün.

## Offene Konzeptfragen an Georg (nachrangig, für den nächsten Designlauf)
- Entschieden 03.10.: Zwischen Inseln fährt die Strecke frei durch die Luft. Stützen nur für Schluchten und Brücken auf Inseln, im Joyride-Cartoon-Stil. Bach und Wasserfall jetzt.
