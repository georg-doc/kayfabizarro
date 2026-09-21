# ONBOARDING v13 — frischer Chat (Stand 2026-09-03, abends)

**Lies zuerst:** `docs/TS-DELTA-v12.md` (Plan + offene Baustellen + Arbeitsregeln) → `docs/CHANGELOG_v12.md` → bei Bedarf `docs/CHANGELOG_v11.md` und `docs/OFFENE_SLICES_v11.md`.

## Was v13 ist
Zweig aus v12 (**FROZEN 3.9.**). `globe-v13/` = 1:1-Kopie von `globe-v12/` (88 Dateien); geändert nur die vier relativen Pfade (`portal.js` rift.png, `flora.js` + `flora-pruefstand.js` flora-auswahl.json, `komposition.js` auswahl-georg.json) und der Kopf von `globe-poc.js`. **Nichts in `globe-v12/` anfassen.**

## Erste Handlungen
1. `KFB Travel Globe v13.dc.html` öffnen, Intro abwarten, **G**, Suchwort `v12` → Coin gate · Hover (H) · Fels-Ausnahme · Sperrzonen. Alles grün = Zweig läuft wie v12.
2. `H` schweben, `W` wieder fliegen. Vulkan anfliegen: Gegner biegen außen ab.
3. Adresszeile: `?fels=1` · `?kits=1` · `?flora=0` · `?regen=0.9`.

## Der Plan (TS-DELTA §2, Reihenfolge nach Wirkung je Aufwand)
- **Stufe A** — kleine Quelldateien, sofortige Wirkung: `Contrails` (zuerst) · `FireflyCluster` · `FloatingLanterns` · `BirdFlock`. Die Nacht ist dunkel und leer. (`GodRays` ist seit v7 da — `sky-atmosphere.js`; der TS-DELTA hatte es falsch als fehlend geführt.)
- **Stufe B** — Ereignisse: `MeteorShower` · `SkyJellyfish` (passt am besten zu Kayfabizarro) · `FlagSystem` (löst die Silhouetten-Lücke mit) · `Braziers` (erste Interaktion außer Sammeln).
- **Stufe C** — Systeme, eigene Sitzung: `MoonThreat` · Campsite · EternalFlame · Fortschritt · Fahrzeuge.
- **Nicht:** Void-Welt, Quest-VFX, Netzwerk.

Quelle: `georg-doc/tinyskies@2659a5cc987d`, Branch `cursor/globefly-multiplayer-globe-flight-game`, `client/src/game/`.

## Vor dem Bau zu entscheiden (nicht vom Chat allein)
**Die atmende Welt:** bestimmt die Karte die Geografie (Kartentyp → Biom) oder färbt sie nur (Geografie bleibt Seed, Karte dreht Palette/Wetter)? Erst diese Antwort, dann `welt-partitur.js`.

## Arbeitsregeln
Erst messen, dann drehen · ein Eingriff, ein Tor · ein Tor sagt nur, was es gemessen hat · Ausnahmen mit `grund:` · 1:1 aus der Quelle, nicht sloppy neu · Screenshot-Beweis VOR dem Einbau · ein falscher Kommentar wird entfernt, nicht korrigiert · Panel-Zeilen in Sätzen.
