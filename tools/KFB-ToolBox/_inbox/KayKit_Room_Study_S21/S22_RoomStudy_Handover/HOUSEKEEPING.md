# Housekeeping · KayKit Atlas Preflight Access

Living document. Status je Artefakt: `AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET`.
Stand: 2026-09-20, nach S22 (Wandknoten gemessen, R07 Grosse Halle gebaut; zuvor S21 Raumstudie R02,
S20 Sample-Atlas, S19 Register-Grammatik).

## Deliverables

| Artefakt | Status | Anmerkung |
|---|---|---|
| `docs/EDITOR_LAYER.md` | **AKTIV · VERTRAG** | Editor-Schicht als Standard für alle 3D-Werkzeuge: vier Regeln, Bedienung, Fahrplan E2 (Figuren posieren) |
| `docs/MENTAL_MODEL_DIORAMA.md` | **AKTIV · VERTRAG** | sieben Bauregeln für jeden Promoraum-Nachbau. Gilt vor jedem Rezept |
| `docs/WALL_NODES_S22.md` | **AKTIV · VERTRAG** | gemessene Platzierungsregel für Endstück, T, Kreuz und Ecke. Gilt vor jedem Grundriss mit Abzweig oder freiem Ende |
| `KayKit_Room_Study_S21.html` | **AKTIV** | Raumstudie **R02** (Bild S02) und **R07 Grosse Halle** (Bild S07, S22) als 1:1-Nachbauten mit Vorlagen-Deckungsprobe. Semantische Gruppen über Schalter **und** Klick ins Objekt, WebAudio-Ton, Funken/Glut/Schockwelle. Werkbank misst zusätzlich die **Knotenteile** (Gelenk, Arme, Armweite) |
| `KayKit_Sample_Atlas_S20.html` | **AKTIV** | 13 Promobilder gegen das Register kartiert: Hülle · Boden · Requisiten nach Bedeutung · Licht · Lücken. Daten in `lib/sample-map.js` |
| `KFB_Plant_Prop_Lab_S18.html` | **AKTIV** | Plant-Prop-Werkbank: Erstbeweis (6 Kompositionen) · Werkbank · Farbtafel (4 Lichter). Kaltstart zeigt den Erstbeweis. **S19:** Bedienfeld auf die Register-Grammatik umgestellt (Biom · Leitmotiv · Register · Maßstab · Wackel · Abwechslung · Dunkler Grund), Erklärtexte hinter „i“-Popovern, Leiste schrumpffest bis 200 px, „Nur Ansicht“ blendet auch die Legende aus |
| `export/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/` | **AKTIV** | Exportrevision `2026-09-19-r2`, Umfang C (nur Plant Prop): 27 Dateien, grösste 587 KiB, 0 kopierte Modelle. Aus dem eigenen Ordner geprüft lauffähig (6 Kompositionen, Tore im Bericht) |
| `export/KFB_Plant_Prop_Lab_v1_EXPORT_2026-09-19/` | SUPERSEDED | Exportrevision `2026-09-19-r1`, 25 Dateien, 252 KiB, keine kopierten Modelle. Enthält Prüfvorlage, Backlog, S19-Vertrag |
| `export/github-checkin-2026-09-19/` | **AKTIV · OFFEN** | push-fertiger Commit für `tools/plant-prop-lab/`. **Nicht ausgeführt** — Zugang ist lesend (403). `COMMIT_MESSAGE.txt` + `PUSH_ANLEITUNG.md` liegen bei |
| `export/KFB_Plant_Prop_Lab_v0_EXPORT_2026-09-18/` | SUPERSEDED | Exportrevision `2026-09-18-r1`, vor der Sichtungsrunde S18.1 |
| `KayKit_Bits_Model_S14.html` | **AKTIV** | mentales Modell der drei neuen Packs + gemessene Kompatibilitätsmatrix; Vertragsgrundlage für S15/S16 |
| `KayKit_Space_Base_S15.html` | **AKTIV** | Space-Base-Baukasten (Gelände, Module, Röhren) |
| `KayKit_Restaurant_S16.html` | **AKTIV** | Restaurant-/Möbel-Baukasten mit Hüllen-Umschalter Restaurant ⇄ Dungeon (Crossover-Probe) |
| `KayKit_Dungeon_Generator_S13_2.html` | **AKTIV** | S13.4-Requisiten + S13.3-Licht + neue UI |
| `ref/ui-split-shell.html` | **AKTIV · REFERENZ** | Split-Screen-Schale zum Kopieren; Anleitung `docs/UI_SPLIT_EINBAU_RESIDENT_ATLAS.md` |
| `KayKit_Dungeon_Model_S13.html` | AKTIV | Modellseite, Vertragsgrundlage für den Generator |
| `KayKit_Hex_Tile_Model_S12.html` | AKTIV | Kacheltabelle, Gegenprobe zur Geometrie |
| `KayKit_Hex_Realm_S11.html` | AKTIV | — |
| `KayKit_Dungeon_Room_S1.html` | FROZEN | Erststand, von S13/S13.2 inhaltlich überholt, als Referenz behalten |
| `KayKit_City_Sample_S4.html` | FROZEN | Straßenlogik durch S5 ersetzt (dort dokumentiert) |
| `Kenney_Racing_Track_S3.html` | FROZEN | von S3b inhaltlich überholt |
| `Kenney_Racing_Setup_S3b.html`, `KayKit_Road_Network_S5.html`, `Kenney_City_Block_S2.html` | AKTIV | — |
| `KayKit_Forest_Clearing_S6.html`, `KayKit_Tools_Workshop_S7.html` | AKTIV | — |
| `KayKit_Chess_Immortal_S8.html`, `KayKit_Domino_Run_S9.html` | AKTIV | — |
| `KayKit_Cards_Hourglass_S10.html` | AKTIV, **ungeprüft** | läuft auf three 0.160.1 statt 0.184.0 |

## Module

| Modul | Status | Geteilt von |
|---|---|---|
| `lib/room-recipes.js` | **AKTIV** | S21/S22 — Raumrezepte **R02 + R07** + `buildRoom()`. Knoten (Ecke/T/Kreuz/Endstück) werden aus der Wandliste abgeleitet, nicht aufgeschrieben; die gemessene Armweite entscheidet über halbe Nachbarfugen. **Zustandsfeld heisst `zs`, nie `s`** (`buildScene` liest `s` als Skalierung → NaN). **Vorlagen-URLs: Atlas `sNN` = Packbild `Dungeon_sample(NN−1).png`** |
| `lib/dungeon-grid.js` · `nodeFrame()` | **AKTIV · GETEILT** | S22 — Knotenrahmen aus der Draufsicht (Gelenk, Arme, Armweite). Vorprobe `tools/probe-wall-nodes.html`. Nicht für Ecken benutzen (`wall_corner_small` ist damit nicht erkennbar) |
| `lib/kit-lab.js` · Grössen-Notnagel | **AKTIV · GETEILT** | seit S21.3 hält die Renderschleife die Puffergrösse gegen das Layout und ruft `onResize`. Ohne das lädt eine Seite mit 2×2-Puffer blank |
| `lib/room-fx.js` | **AKTIV** | S21 — synthetischer Ton (WebAudio) + Funken/Glut/Schockwelle. Effekt am Ereignis, nicht am Dauerzustand |
| `lib/sample-map.js` | **AKTIV** | S20 — Mapping der 13 Promobilder, Kaufliste, tote Namen |
| `lib/dungeon-grid.js` | AKTIV | S13.2 · **S21: `PROP_CANDIDATES` gegen das Register getauscht** (vorher fielen ~20 Namen still heraus); Kommentar „kein wall_end/T/Kreuz" als falsch für 1.1 markiert |
| `lib/kit-lab.js` | **AKTIV · GETEILT** | **allen 19 Seiten** — niemals als tot einstufen. S18 hängt zwei PACKS-Einträge an (`tt_plants`, `qu_env`) |
| `lib/plant-inventory.js` | AKTIV | S18 — 72 vermessene Quellteile, keine Kandidatenliste |
| `lib/plant-recipe.js` | AKTIV | S18 — PlantRecipe, Grammatik, Behältermessung, Bau |
| `lib/plant-pattern.js` | **AKTIV** | **S19 neu geschrieben** — Register-Grammatik (`composeBands()`), 10 Glyphen, 12 Paletten nach einer Rollenregel, 7 Biome, 6 Abnahmetore, Kontrastmessung. Beide Musterwege + `probeUV()` bleiben |
| `lib/plant-rig.js` | AKTIV | S18 — Transform-Proprig, STATIC/AMBIENT/AWARE |
| `lib/plant-eyes.js` | AKTIV | S18 — **Adapter** auf `pet-eye-rig.v6.js`, kein eigenes Augensystem |
| `lib/plant-light.js` | AKTIV | S18 — vier Lichtkalibrierungen |
| `lib/bits-inventory.js` | AKTIV · GETEILT | S14 (und jede Seite, die Space/Restaurant/Furniture nutzt) — gelesenes Inventar, keine Kandidatenliste |
| `lib/space-grid.js` | AKTIV | S15 |
| `lib/restaurant-grid.js` | AKTIV | S16 (nutzt `rng`/`dirRot` aus `dungeon-grid.js`) |
| `lib/dungeon-grid.js` | AKTIV | S13.2 |
| `lib/dungeon-grid.js` | AKTIV | S13.2 |
| `lib/dungeon-light.js` | AKTIV | S13.2 |
| `lib/hex-grid.js` | AKTIV · GETEILT | S11, S12 |
| `lib/road-solver.js` | AKTIV | S5 |
| `lib/track-chain.js` | AKTIV · GETEILT | S3, S3b |
| `lib/props-lab.js` | AKTIV · GETEILT | S6, S7 |
| `lib/chess-set.js`, `lib/domino-rig.js` | AKTIV | S8 / S9 |
| `scenes/*.js` (7) | AKTIV | je eine Seite |
| `tools/*.html` (19) | FROZEN | Messsonden. Haben ihre Zahlen geliefert; Bestand ist der Nachweis. Neu: `probe-wall-nodes` (Endstück/T/Kreuz: Gelenk, Arme, Armweite — Grundlage von `docs/WALL_NODES_S22.md`), `probe-plant-packs`, `measure-plant-parts` |
| `tools/registry-probe.html` | **DEAD-Kandidat** | zeigt auf Branch `bot/asset-registry-update` |

## Assets

| Bestand | Status |
|---|---|
| `media/3D_Assets/**` (11 Promo-/Kontaktbögen + 1 License.txt) | **ASSET** — Vorlagen, keine Laufzeitassets |
| Alle `.gltf`/`.glb` | **ASSET · EXTERN** — kanonische RAW-URL in `georg-doc/kayfabizarro`. Nie einbetten |
| `ref/**` (11 PNG, ~20 MB) | **ASSET** — Referenzbilder. `rtb-*`/`sp2-*` sind je 3–4,5 MB |
| `screenshots/**` (17 PNG/JPG) | ASSET — Abnahmebilder S11/S12, S18 (`s18-*`) sowie S22 (`s22-r07-halle`, `s22-r07-pruefungen`, `s22-r07-deckung`) |
| `uploads/**` | **GELÖSCHT** 2026-09-19 nach Freigabe (52 Dateien). Inhalt war in CHANGELOG/github.md eingearbeitet |
| `_inbox/**` (1 PNG) | ASSET |

## Docs

| Datei | Status |
|---|---|
| `CHANGELOG.md`, `github.md` | **AKTIV · additiv** — Entscheidungshistorie, nie überschreiben |
| `docs/HANDOFF_WSA_S18.md` | **AKTIV** — Prüfvorlage für die Abnahme durch den WSA Lead |
| `docs/BACKLOG_PLANT_PROP.md` | **AKTIV · lebend** — offene Punkte P0–P3 inkl. Asset-Lücken |
| `docs/SPRINT_19_CARTOON_DEFORMER.md` | **AKTIV** — Vertrag vor Code. Nichts davon gebaut |
| `docs/DESIGN_LINE_TOPFMUSTER.md` | **AKTIV** — die Design-Linie in vier Regeln, Farbregel, Abnahmetore, bekannte Grenzen |
| `docs/SPRINT_20_LIVING_PLANTS.md` | **AKTIV** — Vertrag vor Code: Geometriebindung · Bewegungsvorrat · Bühnen. Nichts davon gebaut |
| `docs/HANDOFF_dungeon_props_S13_3.md` | **AKTIV** — Vorlage für S13.4 |
| `docs/LIGHT_CONCEPT_S13_3.md` | AKTIV |
| `docs/HANDOFF_dungeon_S13.md` | SUPERSEDED — Inhalt in S13.2 umgesetzt |
| `docs/PACK_GAPS.md` | AKTIV |
| `export/KFB_World_Atlas_v1_EXPORT_2026-09-17/` | **AKTIV** — Exportrevision `2026-09-17-r1` |

## Clean-Run-Checkliste · S20/S21/S22

1. `KayKit_Sample_Atlas_S20.html` — 13 Karten mit Bild, „Nur Bilder mit Lücken" filtert auf 6.
2. `KayKit_Room_Study_S21.html` — R02 baut aus dem Kaltstart, Prüfungen: Bodenkontakt alle,
   0 Durchdringungen, 1× Türblatt entfernt, keine fehlenden Namen.
3. **Truhe** anklicken (Knopf oder Objekt) → `chest` weicht `chest_gold` + fünf Münzhaufen,
   Funken und Glut laufen einmal, nicht dauernd. Mit **Ton** an: Holzreiben, dann Beschlag.
4. **R07 Grosse Halle** → geschlossener Grundriss 8×5, zwei Stummelwände mit Endstück,
   Hort in der Mitte. Prüfungen: 14 stehen, **0 von 89** Durchdringungen, 0 in der Wand,
   „2 · 2 mit wall_endcap geschlossen", Blickfang 100 %, Deckung 0,671 × 0,776 gegen 0,67 × 0,76.
5. **Vorlage → darüber** in beiden Räumen: das überlagerte Promobild muss DERSELBE Raum sein
   (Atlas `sNN` = Packbild `Dungeon_sample(NN−1).png` — bis S21 war die R02-URL um eins versetzt).
6. Werkbank „Neue Bauteile" → Zeilen `wall_endcap/Tsplit/crossing · Knoten` nennen Arme, Gelenk
   und „Nachbarmodul ganz/halbieren".
7. `KayKit_Dungeon_Generator_S13_2.html` nach der Reparatur: Zeile „Katalog · nicht im FREE-Tier"
   sagt **alle Kandidaten existieren**.

## Clean-Run-Checkliste · S18

1. `KFB_Plant_Prop_Lab_S18.html` öffnen — Kaltstart baut die Erstbeweis-Reihe, sechs
   Nummernmarken über den Kompositionen, Legende unten. Konsole: nur die
   `THREE.Clock`-Deprecation-Warnung.
2. Leiste „☰“ → **Prüfungen**: Fehlschläge 0 · Musterweg zylindrisch · „UV zylindrisch? nein“ mit
   Zahl · Seed-Rundlauf beide Zeilen grün.
3. **AWARE** schalten → Augen sitzen am Topf und folgen dem Zeiger; `#eyeReport` nennt
   `mounted: true` und sechs Mienen aus dem Vertrag.
4. **Farbtafel** → vier Kacheln (Tag/Abend/Interieur/Nacht), Reihe vollständig im Bild.
5. **Rezept** → lesen · bauen · lesen: derselbe Text.
6. **S19 · Muster** → im `#patReport` stehen Registerstapel und sechs Tore, alle „ja".
   Biom auf **Wüste** → Palette springt sichtbar, der Bericht nennt „→ Palette gezogen".
   Maßstabsregler bewegt **beide** Klassen (laut und leise), nicht nur die Führung.
   Der Bericht bleibt beim Topf (Höhe 1,0), nicht beim Untersetzer (Höhe 0,3).
7. **S19 · Schale** → jeder Abschnitt mit Erklärtext trägt ein „i" rechts in der Zeile;
   Klick öffnet ein Popover, Klick daneben schliesst es. „Nur Ansicht" zeigt **keine**
   Legende unten links. Leiste auf 240 px stauchen → kein Regler steht ausserhalb.

## Clean-Run-Checkliste · S14–S16

1. `KayKit_Bits_Model_S14.html` — Status zeigt „101 Bauteile gemessen · 254 Teile im Inventar", alle Karten mit Rendering, keine leeren Regelkästen.
2. `KayKit_Space_Base_S15.html` — Leiste: Höhenprobe und Rampenprobe voll, Röhren angedockt = Röhrenzahl, Durchdringungen 0, Inseln 1.
3. `KayKit_Restaurant_S16.html` — Leiste: Arbeitsband voll, Türen begehbar = Türzahl, Durchdringungen 0.
4. In S16 auf **Hülle: Dungeon** schalten — Türblätter entfernt = Türzahl, Wandrelief 0,25, Arbeitsband bleibt voll.

## Clean-Run-Checkliste

1. `KayKit_Dungeon_Generator_S13_2.html` öffnen — Szene erscheint, keine Konsolenfehler.
2. Leiste („☰") → **Stand**: Fugen-/Zellzahlen grün, „alle Gates grün".
3. **Prüfungen**: 0 Durchdringungen, 0 freie Enden, 0 Inseln, Strahlprobe Türen = Türzahl.
4. Licht auf **Nacht** — Leseprobe muss je Raum ≥1 lesbare Zelle melden.
5. „Nur Ansicht" (Escape beendet) — keine Overlays, Licht beurteilbar.
6. Fenster auf < 1100 px — Leiste legt sich als Overlay über die Szene, staucht sie nicht.

## Cleanup-Kandidaten · nur benannt, nichts ausgeführt

Keiner dieser Schritte ist ausgeführt. Jeder braucht einzelne Freigabe.

| Kandidat | Umfang | Empfehlung |
|---|---|---|
| `ref/rtb-01..03.png`, `ref/sp2-01..02.png` | 5 Dateien, ~19 MB | **BLOCKIERT, nicht ausgeführt.** Freigabe lag vor, aber die Dateien sind **nicht im Repo**: Suche über alle 9497 Dateien in `georg-doc/kayfabizarro@ca369690` nach `rtb-0`/`sp2-0` → **0 Treffer**. Es gibt also keine RAW-URL, auf die umgestellt werden könnte. Erst hochladen (Zugang ist lesend, 403), dann lokal löschen — in dieser Reihenfolge |
| ~~`uploads/**`~~ | — | **erledigt** 2026-09-19, 52 Dateien gelöscht |
| `tools/registry-probe.html` | 1 KB | löschen, **wenn** der Branch `bot/asset-registry-update` weg ist. Vorher prüfen |
| `docs/HANDOFF_dungeon_S13.md` | 5 KB | SUPERSEDED. Behalten kostet nichts; Inhalt ist in `CHANGELOG.md` |
| `screenshots/01-*` / `02-*` Dubletten | 10 von 12 | paarweise gleiche Motive aus zwei Läufen. Eine Serie genügt |
| `screenshots/s19-*` Arbeitsbilder | 9 von 11 | Zwischenstände der S19-Sichtung (`s19-grammar-*`, `s19-zoom*`, `s19-pot-*crop*`). Abnahmewert haben nur `s19-final*` und `s19-tip` |
| `export/KFB_Plant_Prop_Lab_v0_EXPORT_2026-09-18`, `…_v1_…` | 2 Ordner | SUPERSEDED durch v2. Löschbar, sobald v2 abgenommen ist |

## Pfad-Hygiene

Geprüft: **0** relative Assetpfade. Alle Modelle laufen über
`raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/` (`lib/kit-lab.js:10`),
three.js über unpkg mit gepinnter Version. Kein `./assets/…` im Code.

**Offen:** die RAW-URL zeigt auf `main`, nicht auf einen Commit-SHA. Extern ist richtig,
unversioniert nicht.
