# KFB Maßstab-Kontrakt K2 · Figur und MacroCell als Maß

Status: **VORSCHLAG · gemessen 2026-10-08 · von Georg zu bestätigen**
Ersetzt K1 (in K1 standen „1 Einheit = 1 m“ und eine Figurgröße in Metern; daraus entstand das Durcheinander).
Belege: `docs/SCALE_AUDIT_R1.md` und die Aufreihung `http://127.0.0.1:5192/lineup.html` (`?tt=1.6` für Tiny Treats im Kit-Faktor).
Bezug:
- `georg-doc/kayfabizarro` · `planning/kfb-cell-metric-voxel-world-grammar-2026-10-07` (MacroCell, Open Stage, Build/Destroy, Fluff);
- `main` · `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01` (Zerstörungszellen);
- `blender/rkit-r3-p1-junction-profiles-2026-10-08` (Straßenprofile).

## 1 · Grundsatz

- Es gibt **keine Meter**. Gerechnet wird in Einheiten, gemessen an zwei Maßen:
  - **H**, die Höhe der Medium-Figur;
  - **MC**, die MacroCell (= ein KayKit-Dungeon-Modul).
- Meterangaben wie „Figur 1,60 m“ sind höchstens Erzähl-Etiketten und nie Rechengrößen.
- Figuren und Animationen werden **nicht** umskaliert. Die Welt passt sich an die Figur an.

## 2 · Die Kette

`Asset-Einheit → × Kit-Faktor → KayKit-Einheit (k) → × 1,6 → Lab-Einheit`

- **k** ist die KayKit-Originaleinheit. In ihr rechnet das Zellen-Dokument (MC = 4 k).
- **× 1,6** ist der einzige globale Faktor (Lab und Resident Atlas). Er heißt im Code `FIG_SCALE` (`src/scale.ts`).
- Jedes Set bekommt **einen** gemessenen Kit-Faktor. Einzelne Modelle bekommen nie eigene Faktoren, außer begründete Kulissen-Vergrößerungen (§5).

| Größe | in k | im Lab | in H |
| --- | ---: | ---: | ---: |
| Medium-Figur (Mummy B · Farmer A) | 2,27 · 2,41 | 3,64 · 3,85 | 1 |
| Large-Figur (Demon Lord) | 4,6 | 7,4 | 2,0 |
| MacroCell = Dungeon-Modul (Boden, Wand, Stockwerk) | 4 | 6,4 | 1,76 |
| Dungeon-Tür (Bogen) | ≈ 2,75 | ≈ 4,4 | 1,2 |
| Tiny-Treats-Tür (`door_modular`) | 2,8 | 4,5 | 1,23 |
| Tiny-Treats-Wand mit Durchgang | 4 | 6,4 | 1,76 |

**H im Lab = 3,64** (Mummy B), Toleranz bis 3,85 (Farmer A).

Large ist keine feste Größe. Die Rig-Klasse sagt nichts über die Höhe: Der Demon Lord ist 2,0 H, andere Large-Figuren sind kleiner. Jede Figur wird gemessen.

## 3 · Kit-Faktoren (gemessen)

| Set | Kit-Faktor → k | Lab-Faktor | Beleg |
| --- | ---: | ---: | --- |
| KayKit Charaktere, Dungeon, Mummy-Requisiten | 1 | 1,6 | Figur passt in die Dungeon-Tür |
| **Tiny Treats** (Bakery, Homely House, Pretty Park …) | **1** | **1,6** | Tür 1,23 H, Wand = 1 MC: gleiche Einheit wie KayKit |
| KayKit City Builder (Häuser, Autos) | ≈ 5 | ≈ 8 | Tür 1,2 H; Autos sind dann so groß wie die Retro Cars |
| KayKit Medieval Hexagon, Gebäude | ≈ 9 | ≈ 12–17 | Tür ≈ 1,2 H; Brettspiel-Miniaturen |
| KayKit Medieval Builder Pack | wie Hex | wie Hex | ebenfalls Hex-Brettspiel-Set, **nicht** Figurenmaßstab |
| KayKit Medieval Snow Biome | ≈ 6 | ≈ 8–12 | Tür ≈ 1,2 H |
| Retro Cartoon Cars | Länge normiert | Länge 6 | Dachhöhe 0,74–0,87 H |
| Quaternius Ultimate Nature (FBX in cm) | – | 0,044 als Ausgang | Natur: Zielhöhen pro Rolle in H (Environment-Spec §2), nicht ein Faktor |
| Kenney Nature / andere | offen | offen | vor Nutzung in der Aufreihung messen |

## 4 · Regeln in H und MC

**Architektur**
- Tür: 1,2 H, mindestens 1,15 H.
- Stockwerk: 1 MC (1,76 H), wie die Dungeon-Wand.
- Wandmodul: 1 MC breit und hoch; halbe Module ½ MC.
- Fenster-Achse (Bay): ½ MC.
- Türen und Fenster sitzen auf Zellkanten (Zellen-Grammatik).
- Offene Bühnen (Open Stage), Teilwände und Bodenmarken liegen auf MC-Kanten.

**Möbel und Requisiten**
- Tiny Treats und KayKit-Requisiten mit Faktor 1,6, ohne Einzelanpassung.
- Prüfung: Die Figur kann sitzen, der Tisch liegt auf Bauchhöhe.

**Fahrzeuge**
- Weltautos: Länge 6 (1,65 H), Dach 0,75–0,9 H.
- Wenn Figuren einsteigen sollen: Dach ≈ 1,1 H (Autos × 1,3), separat zu entscheiden.

**Straßen** (RKIT v0.13, gemessen an der Autobreite 2,76–3,11)
- Spurbreiten bleiben 3,75 / 4,0 / 4,5: PASS.
- Gehweg mindestens 1,3 H ≈ 4,8 (heute 2,5 = 0,7 H, zu schmal).
- Bordstein ≈ 0,1 H ≈ 0,35 (heute 0,18).
- Wand und Leitplanke ≈ 0,35 H ≈ 1,3 (heute 1,0).
- Durchfahrt unter Brücken und in Tunneln mindestens 1,6 H ≈ 5,8; Fußgänger mindestens 1,3 H.
- Stadt- und Fahrschulstraßen mit Häusern auf Zellraster: Gesamtbreite auf MC-Vielfache, also 12,8 (2 MC) oder 19,2 (3 MC).
- Land, Berg und Autobahn sind frei.
- **Rennen:** Der Track Core rechnet mit 4,1 langen Rennautos, die Welt mit 6 langen.
  - Vorschlag: eine eigene Weltrennklasse mit Breiten × 1,46.
  - Die Joyride-Rennklasse bleibt unverändert.
  - Entscheidung: Georg.

**Inseln**
- Größe in MC denken. Die Testinsel aus dem Zellen-Dokument (20 × 20 MC) ist 128 breit, heute sind es 94.
- Inseln wachsen mit den Gebäuden (Entscheidung Georg: alles hochskalieren).

**Zerstörung, Bau, Fluff**
- Zerstörungszellen sind Teile einer MC: Wandzelle = 1 Stockwerk × 1 Bay = 1 MC × ½ MC; Decken und Dachplatten ebenso.
- Die rohe Fluff-Masse richtet sich nach den echten Maßen des Zielobjekts in MC.
- Kanten-Abschluss und Ruinen-Abschluss sitzen auf denselben MC-Kanten.

## 5 · Seed World Mech Destruction POC 01: Umrechnung

- Der POC rechnet in eigenen Metern. Eine Medium-Figur ist dort ≈ 2,2 hoch (`actorScale 0.9473` × ≈ 2,3 k).
- Umrechnung: **POC × 1,65 = Lab**, bzw. POC-Meter = H / 2,2.

| POC (sw-gen.js) | POC | Lab | in H | K2-Ziel |
| --- | ---: | ---: | ---: | --- |
| Tür `DONOR.door` | 2,25 × 1,25 | 3,7 × 2,1 | 1,0 H | **zu niedrig**, auf 1,2 H (POC 2,65) |
| Stockwerk `floorH` | 3,0–3,4 | 5,0–5,6 | 1,4–1,55 H | 1 MC = 1,76 H (POC 3,9) |
| Fenster-Abstand / Bay | 2,7 | 4,5 | 1,2 H | ½ MC = 3,2 (POC 1,95) oder ¾ MC; über Adapter |
| Parzelle `parcelW` | 5,5–15 | 9–25 | – | auf MC-Vielfache runden |

Der POC bleibt Donor. Bei der Übernahme kommen seine Zahlen über einen Adapter auf K2, sein Code wird nicht umgeschrieben. Die 2-Bit-Zellzustände und Trümmer-Pools bleiben, wie sie sind.

## 6 · Kulissen-Gebäude (Hex, City, Snow)

- Sie werden nach der Tür-Regel vergrößert (Faktoren §3), damit vor dem Haus dasselbe Größengefühl entsteht wie im Dungeon.
- Betreten wird keines davon. Szenen spielen in Open-Stage-Zellen mit Tiny-Treats-Möbeln.
- Folge: Die Inseln werden größer und tragen weniger, aber größere Gebäude.

## 7 · Wächter

- Die Aufreihung (`lineup.html`) und `__kfb.sizes()` im Lab sind die Prüfung.
- Neue Sets kommen erst nach Messung in den Katalog.
- Eine automatische Prüfung (Tür ≥ 1,15 H, Stockwerk ≈ 1 MC, Auto 0,75–0,9 H) kommt als nächster Schritt ins Lab.

## 8 · Verteilung

RKIT-Sitzung (Gate-1-Korrektur), Environment-Sitzung, Blender-Coworker (NPC-Activities, Fluff-Choreografie), WSA (WB2), Claude Design (Pyramide, Wasser, Unterseite), Seed-World-Nachfolgesitzung.
