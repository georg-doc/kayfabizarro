# START HERE · KFB World Core R2D · Session 2026-10-02/03

Claude Design, Projekt »Hex Assets Worldbuilding«. Kein Push, kein Stage. Integration macht der Web Lead.
Brief: `skills/chat/workflows/KFB_WORLD_CORE_R2D_2026-10-02/BRIEF_CLAUDE_DESIGN_R2C_TO_CONTINUOUS_ISLANDS.md` @ `14a1c55` (Draft PR #328).

## Starten
Ordner über einen lokalen Webserver öffnen (`npx serve` o. Ä.), dann eine der beiden `.dc.html`. Internet nötig: alle Module, Modelle und Texturen laden gepinnt von GitHub (jsDelivr, raw). Keine Assets im Paket.

| Datei | Was |
|---|---|
| `KFB World Core R2D v0 Insel.dc.html` | **AKTUELL** · eine Knet-Insel: freier Umriss, Ober- und Unterseite aus einem Körper, Track-Core-Straße, Haus ohne Bodenplatte, Natur aus KayKit Forest, Übergänge im Joyride-Punktmuster, Teich, Bach, Schlucht mit Brücke, Wasserfall. Start auf Insel #3. |
| `KFB World Core R2D S0 Quellen.dc.html` | Schritt 1+2 des Briefs: Source Board (31/31 erreichbar), Quellen allein, clay_floor_001-Vergleich |
| `KFB_R2D_v0/island.js` | Code der Insel |
| `KFB_R2D_S0/bench.js` | Quellenprüfung, Materialbank, Pin-Loader `importPinned()` (von island.js benutzt) |

Lesereihenfolge: `KFB_R2D_v0/RETURN.md` → `KFB_R2D_v0/BRIEF_WSA_KNETSTRANG_BAUSTEIN.md` → `KFB_R2D_v0/POSTMORTEM_QUATERNIUS_PFADSTEINE_2026-10-03.md` → `KFB_R2D_S0/RETURN.md`.

## Pins
R2C, K1/H0, Joyride J14, Register @ `927a1b4` · SSOT @ `589fa4f` · KayKit/Quaternius/clay_floor_001 @ `378b209` · Track Core BUILDER 0.8.1 @ `64d8597` · building_A @ `2ff8b35`.

## Status
- PASS · keine sichtbaren Kacheln oder Säulen; Straße aus dem Track Core, Prüfungen grün; Haus ohne Bodenplatte.
- TUNE · Inselform, Übergangsdichte, Schluchtwände, Wasserfall (gerades Band), Kamera »Bach/Brücke«.
- FAIL · Quaternius-Pfadsteine (Post Mortem).
- Befund S0 · R2C nutzt `hexagons_medieval`, nicht clay_floor_001.

## Offen (für WSA und den nächsten Lauf)
1. **WSA:** Joyride-Knetstrang als Baustein `buildClayStrand(THREE, stream, …)` + Kernversion für R2D (0.8.1 oder 0.12). Brief liegt bei.
2. **Bauanleitung Quaternius-Pfad** (3 Klassen, Bilderbogen, Golden Sample) vor jedem weiteren Setzen.
3. Stützen unter der Schluchtbrücke sind PLATZHALTER nach J14-Rezept, fallen mit Punkt 1 weg.
4. Häuser über den B2-Fassaden-Owner statt KayKit building_A.
5. Figuren aus dem zentralen Register (Plätze sind geplant).
6. Kreuzung, Kreisverkehr, Tunnel, Dreiergruppe von Inseln, R2C-Vergleich mit gleicher Kamera.
7. GPU-Messung auf Georgs Gerät (alle Zahlen stammen aus der Claude-Vorschau).
