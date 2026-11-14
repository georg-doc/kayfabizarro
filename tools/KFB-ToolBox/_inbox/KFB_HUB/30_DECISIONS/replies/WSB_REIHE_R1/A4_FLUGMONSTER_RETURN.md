# WSB_REIHE_R1 · Auftrag 4 · Quaternius-Flugmonster · RETURN

WSB (Mac mini), 14.11.2026. Brief §4. Quellen:
- Quaternius Ultimate Monsters, Ordner `Flying/glTF` (17 Modelle, CC0)
- Pflichtquellen ANIMATIONSBIBEL_R1, CANON Gebiet 10, V-956, V-1713

Nichts ins Spiel eingebaut, nichts gepusht.

## (a) Figurenkarten mit KFB-Augen
Sieben Arten wie im Brief: Dragon, Armabee, Hywirl, Pigeon, Ghost, Squidle und Glub.

**Karten** `karten/q_flyer_<art>.figure.json`:
- EyeRig v6 mit E2-Lid, Augen R2 (augen=r2), converge 0,12, Pupille 0,42.
- Zustände befallen (eye-goo v1.1 rot) und geheilt.
- Knete kit-figure mit Paletten-Zug 0,18 zur Palette mesa ohne Wasserrolle, wie WS0 für Figuren festgelegt hat.

**Modelle:** `glb/<Art>.kfbeyes.glb`, das Original (gltf → glb unverändert) plus `eye_anchor.l/.r` an Head. Jede Art hat einen vollständigen Asset-Pass (`glb/*.asset_pass.json`).

**Original-Augen und Vorschlag** (alle sieben gleich):
- Die Kit-Augen sind graue Augäpfel mit Lidschlitz. Sie sind Geometrie im einzigen Netz; `originals.remove` geht deshalb nicht.
- Vorschlag: **überdecken** (V-664-Weg).
- KFB-Auge = 1,1 × Kit-Augapfel, Mitte auf der Kit-Augapfel-Mitte (Insel-Messung `scripts/augen4.py`), Augenachse waagrecht.
- Bei Hywirl und Ghost sitzen die Augen 0,45 R weiter vorn. Ihre schweren Kit-Lider verdeckten sonst die obere Augenhälfte.

**Lidfarbe** = Haut um das Kit-Auge nach skinLidTone:

| Art | Lidfarbe |
|---|---|
| Dragon | #87491d |
| Armabee | #1c1d1f |
| Hywirl | #7a3d8b |
| Pigeon | #533e7e |
| Ghost | #270f2d |
| Squidle | #7e3654 |
| Glub | #3a3452 |

**Mund:** Vorschlag Kit-Mund. Georg entscheidet am Nahbild.

**Gates:**
- G1 PASS bei allen sieben (seat eye-anchor, 2 Augen, 2 E2-Lidhäute). G2, G5 und G6 PASS.
- G3 meldet „schwebt“ (29–107 cm): gewollt, es sind Flugfiguren.
- G4 WARN: Kit-Inseln.

**Blätter** `blaetter/A4_<art>.png`: Gesicht nah geheilt, Augen zu, befallen, vorn, seitlich (Clip Flying_Idle).

**Clip-Zuordnung je Modell** (V-552), alle gleich:

| Zustand | Clip |
|---|---|
| Schweben | Flying_Idle (1,167 s) |
| Vorwärts | Fast_Flying (0,833 s) |
| Treffer | HitReact |
| Fallen | Death |
| Angriff | Headbutt, Punch |
| Reaktion | Yes, No |

## Liste: welche Modelle einen Flügel-Clip haben
Alle 17 haben Flying_Idle; alle außer Demon haben Fast_Flying.

| Modell | Flügelknochen Wing1–4 L/R | Flügel-Clip |
|---|---|---|
| Alpaking, Alpaking_Evolved, Armabee, Armabee_Evolved, Dragon, Glub, Glub_Evolved, Goleling, Goleling_Evolved, Pigeon | ja | ja (Fast_Flying und Flying_Idle schlagen) |
| Dragon_Evolved, Squidle | ja, plus Arme | ja |
| Demon | ja, plus Arme | nur Flying_Idle (kein Fast_Flying) |
| Ghost, Ghost_Skull, Hywirl, Tribal | nein (Arme bzw. Körperkette Body1–4) | nein: schweben, Fast_Flying bewegt Arme und Körper |

Wichtig: Alle Flügel-Modelle teilen **denselben** Fast_Flying-Clip (identische Schlüssel, `data/takt.json`).
- 2 Flügelschläge in 0,833 s, also 0,417 s je Schlag (2,4 Hz).
- Der Clip hebt den Körper schon selbst um 10,5 cm im Abschlag und senkt ihn im Aufschlag.
- Flying_Idle: 2 Schläge in 1,167 s.

## (b) Flugbewegung
**Bestand gesichtet (V-956)**, Vorbild gewählt:

| Quelle | Was | Übernahme |
|---|---|---|
| `src/m1/hoverFlight.js` (Jetpack-/Dieselpunk-Flug, Vorbild Tiny Skies) | reine Logik, exponentielle Antwort `resp 2,5`, Fassrolle | **gewählt**: Glättung (resp 2,5) und Aufbau als reine Logik |
| `src/npc/ufoEvent.js` + kfb.ufo-motion/1 | Lage und Neigung aus Lab-Formeln, fester Ablauf | nicht übernommen (Skript-Bahn, kein Takt) |
| Combat-Mech-Flug | Schwebe-Clip am Rig, kein Wirt | nur als Beleg, dass der Clip den Takt trägt |
| Voxel-World-Kampf-Slice (`KFB Mech Combat Slice v10`) | nur die Drohne „Robot Enemy Flying“; Ultimate-Monsters-Flug auf dem Mac mini nicht gefunden | – |

**Modul** `flug/flugTakt.mjs`: reine Logik ohne three, wie hoverFlight.js. WS0 kann es übernehmen.
- **Takt aus dem Clip:** Abschlag = Flügelwinkel Wing1.L fällt; 26 Schlüssel aus Fast_Flying.
- **Wirt, nur der ganze Körper** (Gliedmaßen unverändert, V-956/V-1713):
  - Vorschub-Stoß ±12 % im Abschlag.
  - Nase 3,4° nach vorn im Abschlag.
  - Querlage = atan(v·ω/g), höchstens 29°, geglättet.
  - Bremsen: Nase bis 11° hoch, Tempo fällt.
  - Unter 2 m/s Wechsel Fast_Flying → Flying_Idle, phasengleich umgerechnet.
  - Tempo-Fenster der Clips ±15 % (Kanon Gebiet 10).
  - Höhe sinkt weich auf Schwebehöhe.
- Beim Wechsel springt der Flügelwinkel um 0,105 rad (6°). Im Spiel mit `crossFadeTo` 0,15 s überblenden.

**Belege:**
- `flug/video_dragon.mp4` und `flug/video_pigeon.mp4`, seitlich, 30 Bilder/s, Bühne N35 v1.2 (Kopie mit opt-in `--flug`).
  - Geradeausflug 3 s, Kurve 4 s, Bremsen und Absinken 3,5 s.
  - Eingeblendet: Clip, Clip-Zeit, Schlagphase (Balken, rot im Abschlag), v, Höhe, Nick, Querlage.
- `flug/kurven_<gerade|kurve|landung>.png`: Flügelwinkel, Abschlag, v, Höhe, Nick, Querlage über die Zeit.
- Die Folgen selbst: `flug/<manöver>.json`.

**Lückenliste** (kein vorhandener Clip trägt es, also nicht erfunden):
1. **Gleiten:** kein Clip mit ruhig ausgebreiteten Flügeln. Die Haltephasen in Fast_Flying sind Flügel unten, kein Gleiten.
2. **Landen / Aufsetzen:** kein Lande-Clip. Die Bewegung endet im Schweben über dem Boden (Flying_Idle, 0,45 m).
3. **Abheben** vom Boden: kein Clip.
4. **Sturzflug / Steilflug:** kein Clip.
5. **Kurvenflug mit Flügelasymmetrie:** keiner. Die Kurve trägt nur die Querlage des ganzen Körpers.

## Kritiker (CRITIC_3D_R1, Figurenabnahme + Bewegungsbeleg) · **PASS in Runde 4**
| Runde | K4 | K6 | K10 | Mittel | Urteil | behoben danach |
|---|---|---|---|---|---|---|
| R1 | 8 | 7 | 5 | 6,7 | REWORK | Pupillen bei Dragon, Glub und Pigeon (converge 0 statt 0,12, Grund in der Karte); glatte Taktwelle statt Spitzen; Federn 2. Ordnung für Querlage, Nick und Höhe; erst Nase hoch, dann absinken; Kurvenbild mit Hüfthöhe aus dem Clip und Ruck-Spur; Textleiste oben |
| R2 | 8 | 7 | 7 | 7,3 | REWORK | weiche Querlagen-Grenze; Bremsen weich eingeblendet; Clip-Wechsel mit 0,15 s Überblendung (auch auf der Bühne); Start eingeschwungen; Halt im Schweben; Drachen-Augen 0,3 R weiter vorn |
| R3 | 8 | 7 | 6 | 7,0 | REWORK | **Phasenfehler:** Abschlag jetzt = Steigen der Hüfte im Clip, phasengleich per Bau, für beide Clips; Wirt hebt 3 cm im Abschlag und sinkt langsamer; weicheres Einleiten der Kurve; Hywirl angehoben; zusätzliches Video ohne Flügel (Hywirl) |
| **R4** | **8** | **8** | **8** | **8,0** | **PASS** | – |

**Gültiger Stand ist `r4/`:**
- Blätter, Proofs, `flug/flugTakt.mjs` (r4), Kurvenbilder.
- Videos `video_dragon.mp4`, `video_pigeon.mp4`, `video_hywirl.mp4` und Standbilder.
- Das Drachen-Modell r3 (`r3/glb/Dragon.kfbeyes.glb`, `r3/karten/q_flyer_dragon.figure.json`); die anderen sechs bleiben in `glb/` und `karten/` (Glub und Pigeon dort mit converge 0).

**Prüffragen (Kritiker R4):**
1. Abschlag hebt: ja. Die Hüfte steigt im Abschlag, Höchstpunkt bei Flügel unten.
2. Aufschlag sinkt leicht: er sinkt etwa so weit wie der Hub. Der Clip ist symmetrisch, der Wirt macht nur 3 cm Unterschied.
3. Kurve ohne Knick: ja.
4. Bremsen mit Nase hoch vor dem Absinken: ja, mit Überlappung.
5. Ruck: nur der regelmäßige Schlag-Ruck, keine Spitze an Kurvenein- und -ausgang.

**Restliche Hinweise des Kritikers (nicht wertungsrelevant), offen für WS0:**
- Kleiner Knick im Nicken am Abschlag-Maximum (höchstens 1,1°).
- Abschlag-Spitzen je Takt ungleich hoch: Das Clip-Tempo-Fenster tastet die Schlüssel nicht immer gleich ab.
- Kein Standbild der Bremsphase.
- Hywirl und Ghost: Hub im Takt ohne sichtbare Ursache, weil keine Flügel. Vorschlag: für flügellose Modelle `hubWirt` 0 und nur Flying_Idle.
- Graue Flügel bei Armabee und Glub aus dem Atlas (hängt an q661).
- Im Schweben bleibt die Nase bei −4,8°.

**Gate:** G1, G2, G5 und G6 PASS bei allen sieben. G3 „schwebt“ ist gewollt (Flugfiguren). G4 WARN: Kit-Inseln.

## Dateien
- `glb/`: 7 Modelle mit Augen-Ankern, Asset-Pässe, `anker4.json`
- `karten/`
- `proof/<art>/`
- `blaetter/`
- `flug/`
- `inventur/inv_uebersicht.jpg`: alle 17 Modelle
- `data/`
- `scripts/`
