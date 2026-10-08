# RKIT R3 · Return · Gate 1 · `RKIT_R3_VERIFIED_REUSE_CENSUS_AND_FIRST_COMPATIBLE_P1_TRANSITION_ASSEMBLY`

Datum 2026-10-08 · Produktions-Sitzung Claude Code (Blender MCP, Blender 5.2.2 LTS) · **Status: ZUR ABNAHME, nicht abgenommen. Ich stoppe hier für Georgs PASS/FAIL (Amendment G).**

## Kurz für Georg

- **Gebaut:** Track Core v0.13 mit **Profilfamilien + Spuren (1–8)** und dem fehlenden **JUNCTION-Node (T/Y/X, mehrspurig, Spurgraph)**; ein Blender-Konstruktions-Orakel, das den Stream sweept und Kreuzungen aus Node-Daten baut; drei nicht-sweepbare Teile (Ampelmast, Endkappe, Widerlager) mit Sockets; eine echte P1-Übergangs-Assembly **A1** zwischen den Inseln **otown → pyramide** im Island Worldbuilder Lab.
- **Was funktioniert, gemessen:** 329/329 alte Core-Tests unverändert (Bericht byte-identisch), 60/60 neue Core-Tests, A1 im Core 0 Fehler (3 Routen, 34 Routen-Checks, 10/10 Graph/Node-Checks), Blender-Geometrie 9/9, GLB-Re-Import 3/3, Lab-Sockets 0,26 / 0,57 mm neben den Insel-Anschlüssen.
- **Nicht gemacht (bewusst):** P2/P3, Autobahn-Rampen als Ast, Kreuzungsbauwerke, Pfeiler-Familie, Terrain-Cut/Fill, Race-Physik. Keine Merges, keine PRs, kein Live.

## 1 · Was physisch gebaut / wiederverwendet wurde

| Baustein | Herkunft | Status |
|---|---|---|
| Track Core v0.13 (Familien, Spuren, Spur-Zu/Abschlag, Familienübergang, Welt-Querneigung, JUNCTION-Node, Spurgraph, Abbiegebögen, Junction-Checks) | Erweiterung der kanonischen v0.12 (Blob `1bcf7ad3…`), Kreisverkehr-Architektur als Vorlage | **VERIFIED** (Tests) |
| Profilkatalog 12 Varianten (TOWN 1+1/2+2/0+1, DRIVING_SCHOOL 1+1/0+1, COUNTRY, MOUNTAIN, HIGHWAY 2+2/3+3/4+4, RACE, COSMIC) | Core-Daten → Blender-Proben | **VERIFIED** (Maße), Look **NEEDS_TUNE** (Platzhalter-Clay) |
| Stream-Sweep nach Rollen, Kreuzungsplatte, Bordsteinläufe, Zebras, Haltelinien, Brückengeländer | neu, `rkit_r3_lib.py` (Nachfolger von `b1_import_stream.py`) | **VERIFIED** |
| PART Ampelmast (5,6 m, Ausleger 3,8 m über die Zufahrt) | neu, prozedural | VERIFIED (Socket), Look NEEDS_TUNE |
| PART Endkappe (Halbrund, Familien-Bordstein, 3 Poller) | neu, aus dem Socket-Profil erzeugt | VERIFIED |
| PART Widerlager / Brückenkopf | neu, aus dem Socket-Profil erzeugt | VERIFIED (Socket), Look NEEDS_TUNE |
| PART Vorfahrt-Schild | neu | nur isoliert, in A1 nicht verwendet |
| Assembly A1 otown → pyramide (580 m: Brückenkopf, Rechtsschleife, **T-Kreuzung mit Stich + Endkappe**, **TOWN → COUNTRY**, Ankunft) | Core-Rezept `a1_otown_pyramide.mjs` + Lab-Anschlussdaten | **ZUR ABNAHME** |

Isolierte Donoren (vor Anpassung) und Census: siehe `CENSUS_RKIT_R3.md`. A1 verwendet **keinen** RKIT-Mesh direkt: der Brief verlangt Profile + Sockets statt fester Stücke (Amendment A); RKIT-03 Trichter/Stadtstraße sind durch Sweep ersetzt, RKIT-Joyride-Look ist Referenz für RACE.

## 2 · Repos, Branches, Dateien

- **Öffentlich** `georg-doc/kayfabizarro`, neuer Branch `blender/rkit-r3-p1-junction-profiles-2026-10-08` (Basis: Planungs-Branch `748300ad`), Ordner `tools/KFB-ToolBox/_handover/RKIT_R3_BLENDER_MCP_CONSTRUCTION_2026-10-08/production_gate1/`: Return, Census, Profil-Spec, Road-Constructor-Notizen. **Noch nicht gepusht** (warten auf den Push-Weg, siehe §8.5): Blender-Skripte, Lab-Shooter, Manifeste, Binärdateien – liegen vollständig in Dropbox `RKIT-R3/`.
- **Privat** `georg-doc/KFB-Stunt-Car-Race`, neuer Branch `trackcore/v013-junction-lanes-2026-10-08` (Basis main `df1e35b`) angelegt, **Inhalt noch nicht gepusht** (Core-Patch v0.12→v0.13 + Ziel-SHA, Prüfskript, Tests, Assembly-Rezept, Berichte, ausführlicher Census liegen bereit; volle v0.13 auch in Dropbox `RKIT-R3/trackcore/`).
- **Binärdateien** (`.blend`, `.glb`, `.png`) liegen in `~/Dropbox/CLAUDE/KFB Racetrack Blender Kit/RKIT-R3/` (wie RKIT-01…11), alle mit SHA-256 in `MANIFEST.sha256.txt`. Grund: lokales git hat keine GitHub-Credentials, der MCP schreibt nur Text.

| Datei | SHA-256 (Anfang) |
|---|---|
| `blend/KFB_RKIT_R3_A1_v1.blend` (814 KB) | `63bdbfe6fea0…` |
| `glb/rkit_r3_a1_assembly.glb` (2,3 MB) | `3ae29a1d7b4b…` |
| `glb/rkit_r3_parts_isolated.glb` | `fd4d18624470…` |
| `glb/rkit_r3_profiles.glb` | `55977c6c3159…` |
| `trackcore/track-core.v013.mjs` | `6468d5083a41…` |

## 3 · Tests (echte Zahlen)

| Ebene | Ergebnis | Beleg |
|---|---|---|
| Core v0.12-Regression | **329/329**, Bericht byte-identisch zu S13 (`aac439f8`) | `report-v012-regression.txt` |
| Core v0.13 neu | **60/60** | `report-v013.txt` |
| A1 im Core | 3 Routen · 11+11+12 Routen-Checks grün · Graph/Node 10/10 (node_fit, node_mouth, node_lanes 6 Spurverbinder, node_paths 2,0 m ≥ 1,555, node_clear, node_sockets) | `a1.checks.json` |
| Blender-Geometrie A1 | **9/9**: Mündungsnähte Route↔Bordstein ≤ 0,03 mm · Stich↔Endkappe 0 · Teile auf Track-Core-Frames 0 · Insel-Anschlüsse 0 m/0° · Ampeln auf Ankern · 0 degenerierte Flächen · geschlossene Teile manifold · Routen nur an Mündungen offen · Ampelmast ≥ 3,375 m von jeder Spur | `blender_tests_a1.json` |
| GLB-Re-Import (saubere Szene) | **3/3**: A1 29 Objekte, Teile 6, Profile 20 · Bounds-Abweichung 0 · Socket-Matrizen 0 · Extras/Materialien 0 verloren | `glb_reimport_check.json` |
| Lab-Beweis | GLB im laufenden Lab geladen (keine Lab-Code-Änderung), Sockets 0,26 mm (otown) / 0,57 mm (pyramide) neben `IslandField.connector`, 0 Seitenfehler | `lab_proof.json` |
| Donor-Census | 21/21 Donoren isoliert importiert und vermessen | `donor_census.json` |

Unterwegs gefundene und behobene Fehler (keine geschönten Werte): Abbiege-Hermite schnitt die Bordsteinecke (−1 → Bögen konzentrisch zum Bordstein); mein eigener Clearance-Check maß zeitweise nichts (Kommentar verschluckte die Schleife – gefunden, weil „Infinity“ verdächtig war); Probe ohne Biome → 4,6 m Mündungsversatz; Renn-Banking 21° an der Insel; Restneigung 1,2 mm an der Platte (Arme jetzt eben gepinnt); Endkappe aus Katalog- statt Socket-Profil (0,8 m); doppelte Bordstein-Innenwand (66 Kanten); Widerlager-Abdeckungen ragten auf die Insel.

## 4 · Bilder (Blender + Lab, in Dropbox `RKIT-R3/evidence/`)

- `lab/lab_a1_overview.png` – otown → Schleife → T-Kreuzung → pyramide im Lab
- `lab/lab_a1_junction.png` – T-Kreuzung: Radien, Zebras, Haltelinien, Ampeln, Stich mit Endkappe
- `lab/lab_a1_otown_bridgehead.png`, `lab/lab_a1_pyramide_arrival.png`, `lab/lab_a1_under_bridge.png`
- `a1_junction_3q.png` (Blender), `profiles_catalogue_sheet.png` (12 Profile mit KFB-Auto 6,0×3,11×3,17 und 1,9-m-Figur), `parts_isolated_3q.png`
- `donors/donors_isolated_sheet.png` (Quellen allein, vor Anpassung)

## 5 · Kritik (eigene, nicht unabhängig) – bekannte Mängel

1. **Look ist Platzhalter**, kein KFB-Clay: Rollenfarben, flache Workbench-Optik. Clay/Surface-Owner tauscht pro Rolle.
2. **COUNTRY auf Brückendeck** zeigt Grünstreifen auf der Brücke – Brücken brauchen eigene Rollenbelegung (Gehweg/Kappe statt Gras).
3. **Kein Geländer an der Kreuzung**, obwohl sie über dem Abgrund liegt (Geländer nur an `bridge`-Routenstücken).
4. **120-m-Freispannen ohne Pfeiler** zwischen schwebenden Inseln – für die schwebende Welt plausibel, statisch nicht.
5. Rand-Übergang Insel ↔ Fahrbahn: Insel-Boden hinter dem Anschluss liegt bis 0,5 m über der Fahrbahn (otown) – Cut/Fill gehört Surface Truth.
6. Y-Kreuzung hat Spitzkehren mit 5,2 m Radius (Warnung, unter 8 m) – realistisch für Y, aber fürs NPC-Fahren eng.
7. Unabhängiger Kritiker / Integration-Tester fehlt (Brief §11): ich habe mein eigenes Ergebnis geprüft, nicht abgenommen.

## 6 · Kreuzungs-Fähigkeit vs. Core (ehrlich)

- T / X / Y / schief / Boulevard 2+2 / Einbahn-Arm / Land-T / freistehend: **CORE_SUPPORTED in v0.13**, keine Platte, Negativzeuge: eine Straße quer über die Platte wird von `node_clear` erkannt.
- Arme mit **verschiedenem Seitenquerschnitt** an einem Node: **abgelehnt** (Familienübergang vor die Kreuzung legen).
- Kreisverkehr: v0.12 unverändert, Lab-Werte (Insel 6,6, Ring NARROW, Fillet 6, Splitter 0, Arm 18, 6 Arme à 60°) kompilieren mit NARROW-Armen, mit STANDARD-Armen abgelehnt (Lab-Befund reproduziert).
- Autobahn-Auf/Abfahrt als eigener Ast, Raute, Kleeblatt: **CORE_MISSING (P2/P3)**.

## 7 · Rechte / externe Assets

- Neue Geometrie: selbst erzeugt (Skripte).
- Kenney Racing Kit: CC0 behauptet, Lizenzdatei liegt nicht im lokalen Ordner → **CLAIM_ONLY**, nicht verwendet in A1.
- Unity BEDRILL „Modular Lowpoly Track Roads FREE“ und Dynamic Art „Low Poly Street Pack“: Unity-EULA, **nur lokal** entpackt und gerendert, nichts im Repo, nicht in A1.
- Road Constructor: nicht gekauft; nur Store-Screenshots als Verhaltensreferenz (`ROAD_CONSTRUCTOR_BEHAVIOUR_NOTES.md`).

## 8 · Entscheidungen für Georg

1. **PASS/FAIL Gate 1** anhand der Bilder.
2. Spurbreiten 3,75/4,0/4,5 m, TOWN 13,5 m gesamt, Bordstein 0,18 m.
3. Race-Maßstab (4,1-m-Autos) vs. Welt (6-m-Autos).
4. Core-Heimat: privat (jetzt Branch) oder weiter öffentlich?
5. Push-Weg für Patch, Skripte und Binärdateien: Git-Token im Schlüsselbund, Upload über GitHub-Weboberfläche in deinem Chrome, oder Dropbox als Binär-Ablage akzeptieren.

## 9 · Ein nächstes Gate

`RKIT_R3_P2_NETWORK_FAMILIES_AND_STRUCTURES` – erst nach Georgs PASS: Pfeiler-Familie (SC02/RKIT-01 → Socket-Adapter), Brücken-Rollen + Geländer an erhöhten Nodes, Familien-Kreisverkehr, Autobahn-Ausfädeln als Ast, Fahrschul-Platz, Bergstraße mit Serpentine + Tunnelportal, plus unabhängiger Kritiker-Pass.
