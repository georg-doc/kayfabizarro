# Übergabe an WSA · Spender aus dem Visual Terrain Recovery Lab · 2026-10-07

Status: **DONOR MATERIAL · KEIN RUNTIME-OWNER · KEIN MERGE**
Von: Claude Code (Lab-Lauf 07.10.) · An: WSA Open-World-Integrator (PR #348) · Mensch: Georg

Der Lab ist eine isolierte lokale Kopie des Source-Runs (`~/Dropbox/CLAUDE/KFB Open World Visual Terrain Recovery Lab/`, kein Git, nichts gepusht). Er baut keinen zweiten Open-World-Owner. Die Bausteine unten sind Spender für die nächsten WSA-Schritte „Straßenkontakt, echte Kreuzungen, Brücken, Race-Profil“. Sie sollen nicht 1:1 übernommen, sondern gegen PR #348 abgeglichen werden.

Kontext: `docs/KFB_ISLAND_UNIVERSE_PROPOSAL_2026-10-07.md` (Topologie-Vorschlag, noch nicht entschieden).

## Was übertragbar ist, und wohin

| Baustein | Datei im Lab | Was es kann | Gehört in WB2 zu |
| --- | --- | --- | --- |
| Track-Core-Adapter auf dem Road-Graph | `src/modules/roads/kit.ts` (346 Z.) | pro Graph-Kante (`RoadNet.alive/pathAny`) eine Track-Core-Route über CONNECT-Wegpunkte; Kreuzungen (Grad ≥ 3) als Track-Core-ROUNDABOUT mit Arm-Sockets; Grad-2-Knoten als C1-Durchgang; Platten-Fallback, wenn der Solver verweigert; uniformer Maßstab K = 0,375 (STANDARD 14,4 → 5,4 m); Raum-Index für Straßen-Abfragen | Naht Route-Intent → Track Core (Road-Canon 07.10.) |
| Track Core v0.12 | `src/modules/roads/kit/track-core.ts` (1:1 aus `donors/joyride-j16r2/lab-track/core/track-core.v012.mjs`) | `compileGraph`, ROUNDABOUT, CONNECT, Sockets | Owner bleibt PR #219; nur als Referenzstand |
| Höhen-Fit der Straße | `kit.ts` → `fitHeights()` | Höhe pro Sample aus der Surface Truth (Makrohöhe + Dorf-Plateau + Brückenhub), gleitender Mittelwert ±9 m, an Knotenhöhen gepinnt | Surface-Truth-Beitrag der Straße (kein zweiter Höhen-Owner) |
| Surface Truth mit Fit-Layern | `src/modules/terrain/field.ts`, `ground.ts` | kontinuierliches Basisfeld (Biome, Flusstäler, Seebecken) + Dorf-Plateau + Straßen-Fit; Fluss-Kanal bleibt unter Brücken offen; Collider = Trimesh aus denselben Vertices | Vorbild für `base → planner → fit-delta → sculpt-delta` |
| Joyride-Straßenquerschnitt | `src/modules/roads/lab-roads.ts` (340 Z.) | Profil-Blend Land/Dorf/Race/Brücke mit gleicher Topologie (Kerb + Gehweg im Dorf, Sandbankett außerorts, Race-Kerbs rot/weiß, Brückenbrüstung + Deck); Kreisverkehr-Platte, Insel, Kerb-Läufe, Wartelinien; Markierungen als eigenes, nicht schattenwerfendes Mesh; ein Draw-Call pro Chunk, Farben über Paletten-Uniforms | Joyride-Präsentation auf Track-Core-Samples |
| Paletten (R2C → Joyride) | `src/modules/palette/palette.ts` | Cologne-OKLCH-Logik; R2C-Inselpaletten mit Joyride-Helligkeit und -Buntheit; `ENV_CLASS` als explizite Färbeliste; `?palette=<seed>`, `?scheme=` | Paletten-Owner / Biome |
| Dot-Übergänge | `src/modules/clay/kfb-blend.ts` + Shader in `src/modules/terrain/lab.ts` | `kfbBlend` (road-markings.m1) und `kfbLayer` (R2D v0) für Biom-, Ufer- und Bankett-Übergänge; Ausblendung 70–100 m | Terrain-Material |
| Clay lite + Fernpfad | `src/modules/clay/index.ts`, `clay-material.ts` | Terrain-Clay „lite“ (nur Texture-Taps) als Standard, `?terrainclay=full` für den vollen Pfad; Kamera-Distanz-Fernpfad (45–90 m) für Werkzeuge, Dellen, Facetten | K2-Material-Owner |
| Schattenwerte | `src/modules/environment/shadows.ts`, `index.ts` | shadow-fit.v1 Welt-Maßstab: `normalBias = 1,2 × Texel`, `bias −0,00003` | Environment |

## Befunde, die WSA Zeit sparen

- **Bézier-Sweep pro Zelle ist eine Sackgasse.** Fugen und Keile an Zellgrenzen und Faltungen in engen Kurven verschwanden erst mit durchgehenden Track-Core-Routen pro Kante. Das deckt sich mit dem Road-Canon.
- **Kreisverkehr-Solver und Hex-Winkel:** Bei 60°-Armen verweigert ROUNDABOUT mit STANDARD-Armen. Funktionierende Werte: Insel 6,6, Ring NARROW, Fillet 6, Splitter 0, Armlänge 18 (Fallback-Stufen 9 / 12). Ergebnis Seed 97: 77 Kreisverkehre, 4 Platten. Eine Einmündung bzw. T-Kreuzung fehlt im Core.
- **Maßstab:** Track Core rechnet im Auto-Maßstab. Ein Faktor im Adapter funktioniert, gehört aber als Profilfamilie in den Core.
- **Performance:** Der teure Posten ist der Clay-Fragment-Shader auf dem Terrain, nicht die Geometrie. Das eingebaute Clay-LOD greift bei Terrain-Maßstab nie. Headed-fps waren am 07.10. durch parallele GPU-Last auf dem Rechner nicht belastbar; der erste Lauf im Dorf ergab 59,9 fps im Median.
- **Schatten:** Das Figur-Rezept aus LESSONS_SHADOWS (1,5 Texel, −0,00015) erzeugt bei Open-World-Texeln helle Säume. Die Welt-Werte aus shadow-fit.v1 sind besser. Ein von Georg gemeldeter Saum an Tannen ist noch nicht eindeutig reproduziert.

## Was der Lab NICHT belegt

- Keine unabhängige Kritikrunde und kein Blind-A/B gelaufen. Die `codex`-CLI ist auf dem Rechner nicht installiert.
- Keine belastbare 60-fps-Abnahme (siehe oben).
- Keine Persistenz und kein Save/Reload. `TerrainField.delta` ist nur eine vorläufige Naht.
- Keine Spurdaten, kein Spurgraph außer im Kreisverkehr, keine Einmündung.
- Der Platten-Fallback hat einen offenen Defekt: Eine vorbeilaufende Kante kann die Platte schneiden.

## Wie man es ansieht

```bash
cd ~/Dropbox/CLAUDE/"KFB Open World Visual Terrain Recovery Lab" && . tools/env.sh && pnpm dev
```

Dann `http://127.0.0.1:5190`. Nützliche Kamera-Presets über `__kfb.setCamera('terrain.lab.<name>')`: `roundabout`, `roundabout2`, `plate`, `socket`, `street`, `race`, `bridge`, `forest`, `hill`, `transition`, `r0` … `r11` (Nahaufnahmen für die Defekt-Suche). Kit-Statistik: `__kfb.engine.services.get('terrain').ground.kit.stats`.

Early-Look-Bilder (vor dem Track-Core-Umbau): `docs/GEORG/A/`.


