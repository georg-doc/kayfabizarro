# RKIT R3 · Wiederverwendungs-Census (verifiziert) · 2026-10-08

Gelesen aus den echten Quellen: privates Repo `georg-doc/KFB-Stunt-Car-Race` (über GitHub-MCP, nur lesend), lokaler Kit-Ordner `~/Dropbox/CLAUDE/KFB Racetrack Blender Kit/`, öffentliches `georg-doc/kayfabizarro`. Keine RKIT-Quelle als `PRIVATE_SOURCE_UNAVAILABLE` markiert, alle waren lesbar. Die ausführliche Fassung mit Blob-SHAs aller Dateien liegt im **privaten** Branch (`track-core/v0.13/CENSUS_PRIVATE_RKIT_01_11.md`), hier die Klassifizierung.

## 0 · Wichtigster Befund: wo der Track Core wirklich lebt

- **Im privaten Race-Repo gibt es keinen Track Core**, auf keinem Branch (main + alle RKIT-Branches per Verzeichnisliste geprüft; Code-Suche indiziert das Repo nicht).
- Kanonische Linie = **v0.12**, byte-identisch an drei Stellen: öffentlicher Donor `kayfabizarro/tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_…/lab-track/core/track-core.v012.mjs` (Blob `1bcf7ad3…`), öffentlicher Slice-Branch `georg-doc-patch-2` (`skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S13_V012_2026-09-28/`), lokal `TRACK-CORE/S13_V012_2026-09-28/track-core.mjs`.
- Die lokale Testsuite S13 läuft wieder: **329/329 PASS**, Bericht **byte-identisch** zum archivierten S13-Bericht (Fingerprint `aac439f8`).
- `b1_import_stream.py` (historischer Blender-Importer) existiert nur lokal (`TRACK-CORE/S*/blender/`), Stand Core v0.8, ohne Tunnel/Nodes. R3 nutzt einen neuen Importer (`rkit_r3_lib.py`), der den v0.13-Stream inkl. Kreuzungs-Nodes liest.
- Nach Amendment D liegt v0.13 auf einem **neuen Branch im privaten Race-Repo** (`trackcore/v013-junction-lanes-2026-10-08`; Inhalt als Patch gegen die öffentliche v0.12, Rundlauf-SHA geprüft, Push wartet auf den Push-Weg). Entscheidung für Georg: soll die Core-Linie dauerhaft dort leben oder weiter öffentlich?

## 1 · RKIT-01 … 11 (alle PRs #34–#42 offen, nichts gemergt, nichts im Race gefahren)

| Modul | Branch @ Head · PR | Inhalt | LOGIC (Core v0.13) | ASSET | RIGHTS |
|---|---|---|---|---|---|
| RKIT-01 | `chat/rkit-01-track-kit-2026-09-24` @ f368dd0 · #34 (Zwilling `claude/rkit-01` @ b294bb4 mit .blend) | Rennkörper 12-Punkt-R3d, Stützen, Bogen, Böschung | Straße CORE_SUPPORTED · Stütze/Bogen/Böschung CORE_MISSING | Straße NEEDS_ADAPT (12 statt 14 Slots) · Bogen NEEDS_FIX (0,39 m Überstand) · Stütze NEEDS_ADAPT · Böschung NEEDS_FIX | VERIFIED (selbst) |
| RKIT-02 | `chat/rkit-02-stunt-modules` @ 37047b5 · #35 | Sprung, Klappe hoch/runter | Sprung SUPPORTED · Klappe/Gelenk MISSING | Sprung REJECTED (alte Physik) · Klappe hoch NEEDS_ADAPT · runter NEEDS_FIX | VERIFIED |
| RKIT-03 | `chat/rkit-03-track-recipe` @ ac4a57c · #36 Draft | Rapier-Sprünge, Pfeiler v2, Trichter, Sandbank, Stadtstraße, Tunnel, TRACK_A | Trichter/Tunnel SUPPORTED · Stadtstraße UNVERIFIED → jetzt v0.13 TOWN | Trichter/Stadtstraße = **feste Teile, durch Sweep ersetzt** (Amendment A) · Pfeiler NEEDS_ADAPT | VERIFIED |
| RKIT-04 | `chat/rkit-04-switch-pit` @ 3c00223 · #37 Draft | Y-Weiche, Boxengasse | SUPPORTED (SPLIT/MERGE, PIT) | ersetzt durch RKIT-07 | VERIFIED |
| RKIT-05 | `chat/rkit-05-flap-return` @ 98bc486 · #38 | Klappen-Abkürzung, Merge-Loch-Fix | Klappe MISSING | NEEDS_FIX | VERIFIED |
| RKIT-06 | `chat/rkit-06-trankgasse` @ 53219c9 · #39 | Trankgasse auf OSM-Linie, Naht-Fix, Kit-Guide | OSM-Polylinie UNVERIFIED | NEEDS_ADAPT | VERIFIED + OSM ODbL (Attribution erfasst) |
| RKIT-07 | `chat/rkit-07-gc-canyon` @ f70cf48 · #40 (Basis main) | Weichen-Nahtfix (neueste `switch_y.glb`), GC-01/02 Canyon | Weiche SUPPORTED · Canyon-Felsen MISSING | Weiche VERIFIED_KEEP als Referenz · Canyon NEEDS_ADAPT | VERIFIED |
| RKIT-08/09 | `chat/rkit-08-09-stunts` @ 22c3b2e · #41 | Loops, Mag-Kaskade, Skyramp, Wolken-Bounce | Loop SUPPORTED · Bounce MISSING | **alle Loops 17–52 m < `LOOP_MIN_H` 60 → würden `loop_scale` reißen** · NEEDS_ADAPT | VERIFIED |
| RKIT-10 | kein Branch/PR | Mülheimer Brücke v1 (nur lokal `RKIT-11/scripts/build_rkit10.py`) | – | ersetzt durch RKIT-11 | VERIFIED |
| RKIT-11 | `chat/rkit-11-rhein-run` @ bcc422b · #42 | Mülheimer Brücke + Pylon-Loop (eingefrorene Abnahme-Fixture) | Brücke als Bauwerk MISSING | Referenz-Fixture KEEP | selbst + OSM-Ausschnitt zurückgehalten |
| SC01 / SC02 | lokal | Brückenschalen, Stützenleitern | MISSING | NEEDS_ADAPT (Pfeiler-Familie P2) | VERIFIED |

## 2 · Isolierte Donor-Ansichten (vor jeder Anpassung, native Maße)

Bild: `evidence/donors/donors_isolated_sheet.png` (17 öffentliche Donoren). Daten: `donor_census.json` (SHA-256, Bounds, Dreiecke, Materialien). Beides liegt in Dropbox `KFB Racetrack Blender Kit/RKIT-R3/`.

| Donor | Familie | Größe (m, Blender x×y×z) | Dreiecke | Rechte | Entscheidung |
|---|---|---|---|---|---|
| RKIT01 track_straight_16m | Rennkörper | 26,6 × 16 × 3,5 | 4 736 | selbst | Joyride-Look-Referenz für RACE; Geometrie durch Sweep ersetzt |
| RKIT01 track_curve_R40_45 | Rennkurve | 34,5 × 37,7 × 13,4 | 9 324 | selbst | dito |
| RKIT01 support_bank00 | Stütze | 5,9 × 5,9 × 12,9 | 640 | selbst | Pfeiler-Familie P2 |
| RKIT01 arch_standard | Tunnelbogen | 26,9 × 1,9 × 12,0 | 1 984 | selbst | NEEDS_FIX |
| RKIT01 ground_skirt | Böschung | 49,5 × 42,1 × 10,7 | 2 772 | selbst | → Surface Truth |
| RKIT03 funnel_wide_std | Breitenübergang (fest) | 26,6 × 36 × 3,5 | 10 656 | selbst | ersetzt durch `WIDTH_STEP` |
| RKIT03 street_city_narrow | Stadtstraße (fest) | 55,8 × 109,3 × 0,75 | 16 864 | selbst | ersetzt durch TOWN-Familie |
| RKIT03 tunnel_60 | Tunnel | 30 × 60 × 9,7 | 28 848 | selbst | P2 Portal-Teile |
| RKIT03 support_styles | Stützen | 57,4 × 68,9 × 19,2 | 56 844 | selbst | P2 |
| RKIT07 switch_y | Weiche | 108 × 301 × 8,7 | 125 124 | selbst | Referenz |
| RKIT11 muelheimer_bruecke | Brücken-Fixture | 42 × 714 × 71 | 60 278 | selbst, OSM zurückgehalten | Abnahme-Referenz |
| SC01 bridge_shell_narrow | Brückenschale | 36,7 × 352,8 × 58,3 | 39 280 | selbst | P2 |
| SC02 supports_classic | Stützenleiter | 97,2 × 257,5 × 13,9 | 57 896 | selbst | P2 Pfeiler |
| Kenney lightPostModern | Laterne | 0,05 × 0,18 × 0,78 (Kachel-Einheiten!) | 198 | CC0 (Behauptung, Lizenzdatei fehlt im Ordner) | NEEDS_ADAPT (× ~8) für P2-Möbel |
| Kenney rail | Leitplanke | 1 × 0,05 × 0,16 | 68 | CC0 (Behauptung) | NEEDS_ADAPT |
| Kenney barrierRed | Barrierenblock | 0,25 × 0,12 × 0,13 | 28 | CC0 (Behauptung) | NEEDS_ADAPT |
| Kenney roadCrossing | X-Kachel (fest) | 2 × 2 × 0,02 | 266 | CC0 (Behauptung) | REJECTED als Kreuzung (Platte); Optik-Referenz |
| Unity BEDRILL Modular Lowpoly Track (Zaunblock, Start/Ziel) | Rennmöbel | 0,4 × 1,5 × 1,2 / 15 × 15 | 18 / 202 | Unity-EULA, **nur lokal** | Optik-Referenz Rennen |
| Unity Low Poly Street Pack (RoadMarks, LampPosts) | Markierungs-Decals, Laternen | 64,8 × 47,1 / 8,4 × 13,7 × 9,9 | 35 / 1 942 | Unity-EULA, **nur lokal** | Optik-Referenz Decals (P2) |

Unity-Pakete: SHA-256 der `.unitypackage` (Lowpoly Track) `c9be9be3…`; entpackt nur unter `~/Developer/rkit-r3/donors/`, Renders in `RKIT-R3/evidence/donors_local_only_unity_eula/` (nicht im Repo).

## 3 · Lücken (sortiert, mit Zahlen)

1. **T/Y/X-Kreuzung** fehlte im Core → **jetzt v0.13 `JUNCTION`** (60/60 Tests).
2. **Spuren/Familien** fehlten (nur eine Breite pro Route) → **v0.13** (1–8 Spuren, 7 Familien).
3. **Weltstraßen-Querneigung** war Renn-Banking (21° an der Insel) → **v0.13** max. 4°.
4. Stützen/Pfeiler, Bögen, Böschung, Brückenbauwerk: Core kennt sie nicht (CORE_MISSING) → Blender-Teile mit Sockets, Pfeiler-Familie aus SC02/RKIT-01 ist P2.
5. Kreisverkehr nutzt noch den Renn-Bordstein (4,32 m), nicht die Familie → P2.
6. Mittelstreifen-Barriere Autobahn, Auf-/Abfahrten (Verzögerungsstreifen gibt es, Ausfädeln als Ast noch nicht), Kleeblatt/Raute → P2/P3.
7. Alle RKIT-Loops unter `LOOP_MIN_H` → Konflikt Core-Regel vs. RKIT-Bestand, Georg entscheidet.
