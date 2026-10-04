# RETURN · World Core R2D · S0 Quellen (Schritt 1 + 2) · 2026-10-02

Brief: `skills/chat/workflows/KFB_WORLD_CORE_R2D_2026-10-02/BRIEF_CLAUDE_DESIGN_R2C_TO_CONTINUOUS_ISLANDS.md` @ `14a1c55bbf2748d67cfd673d5d0df73bf3f7b082` (Draft PR #328).
Seite: `KFB World Core R2D S0 Quellen.dc.html` · Code: `KFB_R2D_S0/bench.js` · Bilder: `KFB_R2D_S0/evidence/`.

Status: **Schritt 1 und 2 geliefert. R2D-Gestaltung (Schritt 3–5) nicht begonnen.** Kein Push, kein Stage.

## Ziel · Eigentümer · Quelle · Grenze · Fertig, wenn
- Ziel: gepinnte Quellen sichtbar nebeneinander, einschließlich clay_floor_001 am echten KayKit-Spender.
- Eigentümer: World Core (R2C-Atlas). Diese Seite ist Beleg, kein Runtime-Owner.
- Quelle: GitHub, Pins unten.
- Geschützte Grenze: R2C, Track Core, B2-Fassaden-Owner, Clay-Module bleiben unverändert und werden nur geladen.
- Fertig, wenn: jede Quelle am Pin erreichbar, jede allein sichtbar, vier Materialwege gleiche Kamera.

## Pins
| Quelle | Commit |
|---|---|
| Brief | 14a1c55bbf2748d67cfd673d5d0df73bf3f7b082 |
| R2C, K1/H0-Paket, Register textures.json | 927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f |
| Clay-SSOT + Golden Matrix | 589fa4fe6a3d5a950cf8a82bcf480b8e6326e711 |
| KayKit Hexagon Pack + clay_floor_001 | 378b209355b13304e3cff656ec0806ca5b89df28 |
| Track Core (BUILDER_2026-09-27) | 64d8597c3dad1dc9814c794d4a566d589e1e1a25 |
| B2 Recovery/Router | 69c9c7f54cb1c048105f5aa822593c8976727959 |

## SOURCE · Befunde
1. **clay_floor_001 ist nicht R2Cs Bodenmaterial.** Alle 32 von R2C geladenen KayKit-Teile tragen das Material `hexagons_medieval` mit `hexagons_medieval.png` (gelesen @ 378b209 und hex_grass zusätzlich @ main). In acht R2C-Dateien @ 927a1b4, darunter `docs/RETURN.md`, kommt `clay_floor` nicht vor. Die im Brief zitierte Nennung ist an diesem Pin nicht belegbar.
2. Die vier Bilddateien liegen @ 378b209, Bytegrößen gleich den Briefangaben (115.628 · 72.654 · 121.553 · 66.066), Register-Einträge mit `rawPinned` @ 378b209.
3. R2C lädt KayKit über jsDelivr **@main**, nicht gepinnt.
4. `track-core.mjs` (kfb.track-core/0.8.1) und `stream-to-three.mjs` liegen @ 64d8597, werden von der Baumliste aber nicht gezeigt (.mjs).
5. P2-Props (PR #316) werden nicht verwendet (TUNE).

## DECISION
- Spender hex_grass, umschaltbar hex_grass_sloped_high; Maßstab R2C-AP 8,66 in die Geometrie eingerechnet.
- K1-Vorstufe (softenGeometry Standardwerte) auf dieser Weltgeometrie; v8 `terrainFg`.
- R2C-Weg: bakeKay-Farbumlegung mit Palette »burg«, v10 Parität, wie hex-archipel.r2c.js.
- clay_floor_001: Kastenprojektion in Weltmetern, 1/2/4 m je Wiederholung, weil die KayKit-UVs in den Atlas zeigen.

## TESTED RESULT (Claude-Vorschau, Software-Rendering)
- 31/31 Dateien 200. 12/12 Module über jsDelivr am Pin.
- Vier Bühnen × vier Ansichten × zwei Spender gerendert, ein Renderer. Bildmaß gegen Golden (compare() aus facade-ab-01.js), Ansicht nah, hex_grass: Quelle Δ 16 / Detail 0,19 · R2C Δ 23,3 / 1,33 · clay_floor_001 Δ 51,6 / 0,7. Zahl, kein Urteil.
- Track Core: sandbox-Stücke 1–2, 369 Abtastpunkte, 11/11 Prüfungen bestanden, 11.922 △.
- R2C live über boot() @ 927a1b4: läuft, 29,6 s bis bereit (`evidence/r2c-live.jpg`).

## NOT_TESTED
GPU-Messung auf Georgs Gerät · R2C live mit derselben Kamera wie die Bank · Schritt 3–5.

## OPEN · eine Prüffrage
Wo steht die Nennung »clay_floor_001 als gemeinsames Modellmaterial des Hexagon-Packs«? An R2C @ 927a1b4 ist sie nicht auffindbar.
