# KFB Mauerwerk-Familie A · Modulsatz v1 · 2026-10-09

Besitzer: RKIT (Georg YES, 09.10.). Grundlage: Bauweise-Blatt v7 (PASS) und `docs/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md` (Lab). Eine cartoonige Knetstein-Familie für Bordsteine, Mauern, Treppen, das Town-Plateau mit Ton-Treppe, Steinbogen-Brücken, die Pyramide und den Brick-Fish.

## Konventionen
- **Einheiten:** K2-Lab-Einheiten (MC 6,4, H 3,64). Längen in ⅛, ¼, ½ und 1 MC.
- **Lokaler Rahmen jedes Moduls:**
  - +Y = Lauf- bzw. Längsrichtung (Track Core T);
  - +Z = oben (U);
  - +X = rechts (R = T × U);
  - Ursprung = Mitte der Unterseite.
  - Der glTF-Export ist +Y-up.
- **Farbe nicht eingebacken:**
  - Rolle `stone` mit Tonindex 0 hell / 1 mittel / 2 dunkel aus `ENV_ROLES[insel].stone`.
  - Die Rolle steht als Objekt-Extras `kfb_role`, `kfb_tone`, `kfb_module`, `kfb_family` und als Punktattribut `_ROLE_TONE` (glTF-Custom-Attribut).
  - Die Vorschau-Materialien sind nur Vorschau.
- **Sockets:** Empties `<MODUL>_SOCKET_a` / `_b` mit `kfb_socket`, Blickrichtung aus dem Stein heraus.
- **§01:** Jede freie Kante endet gerundet (Kopf-, Abschluss-, Deckstein). Rubbel wird instanziert, dichter zur Kante hin, mit festen Seeds.
- **Rundungen:** echte Bevel in Lab-Einheiten (siehe Tabelle), dazu ein leichter Knet-Jitter (fester Seed je Modul).

## Module
| ID | Einsatz | Maße X × Y × Z | Rundung | Ton | Sockets |
|---|---|---|---|---|---|
| `BORD_HOCH` | Hochbord, Stadt | 0.47 × 1.55 × 0.48 | 0.08 | 0 | SOCKET_a, SOCKET_b |
| `BORD_TIEF` | Tiefbord (befahrbar, Zufahrt, Furt, nach dem Übergang) | 0.45 × 1.54 × 0.2 | 0.07 | 0 | SOCKET_a, SOCKET_b |
| `BORD_UEBERGANG` | Übergangsstein Hochbord → Tiefbord, genau ein Stein | 0.45 × 1.55 × 0.47 | 0.07 | 0 | SOCKET_a, SOCKET_b |
| `BORD_KOPF` | Bordsteinkopf: gerundetes Bordende, sitzt im Rubbel | 0.46 × 0.81 × 0.48 | 0.22 | 0 | SOCKET_a |
| `BORD_KURVE_R12` | Kurvenstein für Radius 12 (radiale Fugen, kürzer statt gebogen) | 0.46 × 0.83 × 0.48 | 0.08 | 0 | SOCKET_a, SOCKET_b |
| `PLATTE` | Gehwegplatte ¼ MC, Läuferverband; Zuschnitt per Passstein-Generator | 1.6 × 1.6 × 0.22 | 0.07 | 1 | SOCKET_a, SOCKET_b |
| `KANTENSTEIN` | Kantenstein an jeder Schnittkante, einzeln gerundet, Rubbel davor | 0.3 × 0.7 × 0.26 | 0.12 | 1 | SOCKET_a, SOCKET_b |
| `MAUER_18` | Mauerstein 1/8 MC, Lage 0,75 | 0.82 × 0.73 × 0.72 | 0.15 | 1 | SOCKET_a, SOCKET_b |
| `MAUER_14` | Mauerstein 1/4 MC, Lage 0,75 | 0.81 × 1.53 × 0.73 | 0.15 | 1 | SOCKET_a, SOCKET_b |
| `MAUER_12` | Mauerstein 1/2 MC, Lage 0,75 | 0.8 × 3.13 × 0.74 | 0.15 | 1 | SOCKET_a, SOCKET_b |
| `ECKSTEIN` | Eckstein (L), bindet zwei Mauerläufe | 1.61 × 1.61 × 0.72 | 0.15 | 2 | SOCKET_a, SOCKET_b |
| `KOPFSTEIN` | Mauerkopf: gerundetes freies Mauerende | 0.82 × 0.8 × 0.74 | 0.36 | 1 | SOCKET_a |
| `DECKSTEIN_RUND` | runder Deckstein für Brüstung und Mauerkrone | 0.96 × 1.06 × 0.56 | 0.26 | 0 | SOCKET_a, SOCKET_b |
| `STUFE_1MC` | Treppenstufe 1 MC breit, Steigung 0,45, Auftritt ⅛ MC | 6.35 × 0.77 × 0.45 | 0.12 | 1 | SOCKET_a, SOCKET_b |
| `STUFE_12MC` | Treppenstufe ½ MC breit | 3.15 × 0.77 × 0.46 | 0.12 | 1 | SOCKET_a, SOCKET_b |
| `BOGENSTEIN_R12` | Bogenstein (Radius 12, 17 Steine, Ring 2,0), stehend; Breite entlang Y wird beim Setzen auf die Gewölbebreite skaliert | 2.55 × 1.01 × 1.99 | 0.18 | 0 | – |
| `SCHLUSSSTEIN_R12` | Schlussstein, größer und vorstehend, stehend | 2.61 × 1.02 × 2.34 | 0.2 | 2 | – |
| `ABSCHLUSS_WAND` | Abschlusskappe für Wandenden (halbe Kuppe), weicht beim Anbau | 0.8 × 0.8 × 0.74 | 0.4 | 1 | SOCKET_a |
| `ABSCHLUSS_BODEN` | Abschlusskappe für Boden- und Plattenkanten (Viertelrund) | 1.61 × 0.51 × 0.23 | 0.2 | 1 | SOCKET_a |
| `RUBBEL_KIESEL_0` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.27 × 0.21 × 0.19 | 0.12 | 0 | – |
| `RUBBEL_KIESEL_1` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.37 × 0.29 × 0.22 | 0.15 | 1 | – |
| `RUBBEL_KIESEL_2` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.46 × 0.36 × 0.29 | 0.18 | 2 | – |
| `RUBBEL_KIESEL_3` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.54 × 0.47 × 0.32 | 0.21 | 0 | – |
| `RUBBEL_KIESEL_4` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.62 × 0.49 × 0.39 | 0.24 | 1 | – |
| `RUBBEL_KIESEL_5` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.66 × 0.54 × 0.41 | 0.27 | 2 | – |
| `RUBBEL_KIESEL_6` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.7 × 0.55 × 0.49 | 0.3 | 0 | – |
| `RUBBEL_KIESEL_7` | Rubbel (Knetsteinchen), instanziert, Dichte nach Abstand zur Kante | 0.8 × 0.63 × 0.5 | 0.32999999999999996 | 1 | – |
| `RUBBEL_SCHERBE_0` | aus einer Platte gebrochenes Stück (Wegende, Ruine) | 0.58 × 0.49 × 0.19 | 0.05 | 1 | – |
| `RUBBEL_SCHERBE_1` | aus einer Platte gebrochenes Stück (Wegende, Ruine) | 0.77 × 0.68 × 0.19 | 0.05 | 2 | – |
| `RUBBEL_SCHERBE_2` | aus einer Platte gebrochenes Stück (Wegende, Ruine) | 0.81 × 0.67 × 0.19 | 0.05 | 1 | – |
| `RUBBEL_SCHERBE_3` | aus einer Platte gebrochenes Stück (Wegende, Ruine) | 0.99 × 0.9 × 0.18 | 0.05 | 2 | – |

## Dateien
- `kfb_masonry_a.blend`: Collection `KFB_MASONRY_A` (Module) und `KFB_MASONRY_A_DEMO` (Zusammenspiel: Mauer im Verband mit Eckstein, Kopf und Deckstein; Ton-Treppe; Bordfolge Hoch → Übergang → Tief → Kopf mit Rubbel; Bogen aus 17 Bogensteinen).
- `glb/<ID>.glb`: je Modul ein GLB, SHA-256 im `manifest.json`.
- `manifest.json`: Schema `kfb.masonry-family/1`.
- Bilder: `overview_row*.png`, `demo_*.png`, `demo_sheet.png`.
- Erzeuger: `blender/rkit_r3_masonry_a.py` (`build_family()`, `build_demo()`).

## Bekannt offen
- Die Rubbel-Scherben sollen sichtbar aus Platten gebrochen sein (Georgs TUNE am Wegende); Version 1 hat einfache Bruchumrisse.
- Bogensteine gibt es fest für Radius 12; andere Radien über `voussoir(R, n, t)` im Skript.
- Kurvensteine gibt es fest für Radius 12; weitere folgen mit dem Gehweg-Bau.
- Noch nicht durch den blinden Kritiker gelaufen.
