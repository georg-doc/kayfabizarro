# KFB 3D-Kanon · R1 · 2026-10-20 · WS0 (V-563)

**Diese Seite ist die einzige Quelle (SSOT) für alles Gestalterische in 3D.** Sie gilt für:
- jeden 3D-Job: Blender, Laufzeit, Meshy und Asset-Übernahme;
- jedes Scenelet, jede Demo und jede Abnahme;
- jede Spielszene: Residents und Dioramen.

**Grundsätze:**
- Regeln hier sind **Pflicht, keine Tipps.**
- Was eine Lieferung bricht, ist FAIL, auch wenn alle Messwerte grün sind.
- **Rangfolge:** Georgs Wort > Register (`build_decisions.py`, V-Nummern) > diese Seite > die hier verlinkten Quellen > alles andere.

**Pfade:**
- relativ zu `KFB_HUB/30_DECISIONS/`;
- `S/` = `CANON_3D/sources/`: eingefrorene Kopien aus Lab und Spenderordnern, Herkunft und Prüfsumme in `S/MANIFEST.tsv`;
- die Originale dort zählen nicht mehr.

## 0 · Pflicht für jeden Job (Tier 0 jedes Briefs; diese drei Zeilen kopiert WS0 wörtlich in jeden 3D-Brief)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

## 1 · Fachgebiete
| # | Gebiet | Maßgebliche Quelle(n) | Kern (Auszug, Quelle gilt vollständig) | Mechanisch geprüft | Kritiker |
|---|---|---|---|---|---|
| 1 | **Weltlogik und Geschichte** | `S/QA_RULEBOOK_ENVIRONMENT_R1.md` §00 + §1; `S/ENV_ERZAEHLRASTER_R1.md`; V-015, V-561 | Pflichtfrage je Element: wer, womit, warum. Was sich nicht erzählen lässt, wird nicht gebaut. Messregeln sind die Untergrenze. Konzeptblatt vor dem Bau. | `kfb_env` K0 (Konzeptblatt), S1 (Geschichte je Objekt) | K1, K9 |
| 2 | **Komposition, Platzierung, Erdung** | `S/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` (R2-Stand); `replies/SPEC_PLACEMENT_GRAMMAR_R2.md` (Register-Fassung, die Kopie in `50_BLENDER/SPEC` ist abgelöst); `S/QA_RULEBOOK_ENVIRONMENT_R1.md` §2/§2b; `S/NOTEBOOKLM_P3_…`; `50_BLENDER/B2/R2/RESEARCH_SOURCES.md`; `S/QUATERNIUS_MEGAKIT_STUDY.md`; V-400, V-456, V-496 | Erdung: eingraben, Kontakt, überlappen, mit Ursache. **70/30-Detailbalance (V-565):** 70 % der Bildfläche sind ruhig (Terrain großflächig, wenig Kontrast), 30 % tragen Detail (Fokus, Hero, Figuren). Einsinken je Objektart. Gruppen ungerade, 1 : 3 : Rest mit Größen 1 : 0,62 : 0,38, Abstände ≥ 30 % verschieden, ≤ 2 auf einer Geraden, Konturen ≥ 15 % überlappt oder ≥ 25 % Luft, Negativraum ≥ 30 %, Landmarke am höchsten, Staffel 1 : 3 : 9, ein Kit je Gruppe, keine Klone. **Nie Props auf einer Scheibe oder Platte.** | `kfb_env` B1/B2, E1/E2, G1/G2, H3/H5/H7/H9/H11, C1 (Kontakt-Geometrie) | K3, K4, K7 |
| 3 | **Ortsbiografie und Set-Dressing** | `../50_BLENDER/SPEC/KONZEPT_ORTSBIOGRAFIE_UND_BAUSATZ_R1.md`; `S/ENV_ERZAEHLRASTER_R1.md`; V-341, V-396 | Vier Schichten: Entstehen → Nutzen → Vergehen → Bewachsen. Moos in Fugen, Gras 0–2 m, Büsche 2–6 m, Bäume ab 6 m. Ein Materialcode je Schicht. Signatur: 1 Hero + 2 Echos. Requisiten in Funktionsgruppen. | `kfb_env` S3/S4 (Schichten), S5 (Signatur) | K5, K9 |
| 4 | **Übergänge, Kanten, Sprenkel** | `S/QA_RULEBOOK_ENVIRONMENT_R1.md` §01; `S/SPEC_EDGE_RUBBLE_GRAMMAR_R1.md`; `S/QA_RULEBOOK_TRANSITIONS_R1.md`; `replies/TRANSITION_INTENT_R1.md`; `S/NOTEBOOKLM_P1_…`; V-011, V-168, V-403 | Keine harten Schnitte, keine sichtbaren Kanten. Übergänge nur als Sprenkel in beide Richtungen, nie Verlauf, Alpha oder Linie. Freie Enden runden sich über Rubbel. **Kontakt-Geometrie ist Pflicht (V-565):** Jede Fuge zwischen Objekt und Boden wird physisch gebrochen, durch kleine Knet-Elemente (Steinchen, Moos, Erdkeil, Gras-Büschel) mit Ursache. Das gilt sofort und unabhängig vom Speckle-Modul. | **Lücke:** Speckle-Modul nicht im Hub (V-403), kein Blender-Gegenstück | K4, K6 |
| 5 | **Inselkörper, Terrain, Strecke** | `S/ISLAND_ANATOMY_RULES.md`; `S/SCALE_CONTRACT_K2.md`; `replies/WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1_2026-10-19.md` (#439); `S/NOTEBOOKLM_P2_…`; V-010, V-102, V-136, V-142, V-167, V-402 | Insel = ein geschlossener Körper, Mesa: Cap → Body → Skirt. J17-Goldstandard, Fahrbahn #3d4a60, Banden #ef5a22. Rampen ohne Stufen; Farbflächen unabhängig von der Höhe. | Proof Stage G3 (Boden); Rest WS1-Tests | K6, K8 |
| 6 | **Farbe und Palette** | `replies/COLOR_CONCEPT_R1.md`; `replies/COLOR_HARMONY_R1/` (`kfb-cartoon-palette.js`); `replies/ISLAND_PALETTES_R1/`; V-286, V-292, V-305, V-396, V-402, V-406, V-441 | Eine Palette mit Rollen (`ENV_ROLES`, 3 Töne je Rolle), 60/30/10. Harmonie über das Material, nie über das Licht. Meshy nur leicht tönen. Kein Mittelgrau. **Jede Farbe ist erlaubt, auch surreal (z. B. lila Gras), wenn der Materialcode die Logik trägt (V-565).** Gras liest sich als Gras über Form, Verteilung und Bewegung: Büschel in Gruppen, Wind-Gruppen und Deformer (`S/SPEC_ENVIRONMENT_KIT_R1.md` §5–§8). Einzige Farbgrenze ist technisch: Chroma ≤ 0,195 gegen ACES-Ausbrennen (ISLAND_PALETTES). | `kfb_env` S2 (Rolle je Objekt); **Lücke:** Farbwerte gegen den Generator nicht geprüft | K2 |
| 7 | **Licht und Schatten** | `replies/LIGHT_MODEL_R2.md` (Regeln 1–11, Raster L-1…L-8); `replies/LIGHT_RESEARCH_AUDIT_R1.md`; `S/LESSONS_SHADOWS.md`; Modul `kfb-stage-light.v1.1.js`; V-385, V-386, V-387, V-392, V-429, V-440 | Ein Rig, ein Tonweg, eine Materialantwort. Keine privaten Lichter. Gegenlicht standardmäßig aus (V-392 gilt vor V-385 Regel 1). Alles wirft und empfängt vom einen Key. Keine Blob-Schatten. | Proof Stage G6 (Schattensaum); `selfTest()` | K4, K6 |
| 8 | **Material, Knete, Textur** | `replies/CLAY_SSOT_R1/` (`kfb-clay.v1.1.js`, Golden-Tests); `S/HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`; `S/KLAYBOUND_CLAYBOUND_VISUAL_BENCHMARK_2026-09-26.md`; V-053, V-346, V-355, V-429, V-431 | Ein Knet-Modul überall (Profil je Klasse). Kneten, nicht modellieren. Sonne warm-weiß (sattes Licht färbt die Knete um). Meshy-Texturen entleuchtet. Abnahmebilder immer mit Knete. | Proof Stage G2/G5; Clay-Golden G0–G5. **Lücke:** kein Blender-Knetmodul | K6 |
| 9 | **Figuren: Augen, Rig, Integrität, Maßstab** | `KFB_WORKING_RULES_R1.md`; `S/SCALE_CONTRACT_K2.md`; `replies/FIGURES_R1/`; `60_CAST/cast.r1.json`; V-060, V-061, V-090, V-214, V-348, V-391, V-420, V-422, V-518, V-541, V-562 | Keine geprüften KFB-Augen = FAIL, an **jeder** Variante. E2-Lider, keine Schalen. Kein Schielen. Figuren nie skalieren. Anker KFB_Grip/KFB_Muzzle. | Proof Stage G1 (Augen, Lider). **Lücke:** Prüfer für Figurenkarte und Besetzung | K10 |
| 10 | **Bewegung und Choreografie** | `MOTION_GUIDE_R1.md`; `S/KFB Cartoon Motion Research v1.md`; `S/RESEARCH_LOCOMOTION_PRACTICE.md`; `S/CHOREO_RESEARCH_01.md`; V-177, V-179, V-180, V-186, V-555 | Reihenfolge Augen → Kopf → Körper, Kopf 2–4 Frames hinter den Augen. Squash ≤ 8 % (Stürze stärker). Tempo-Fenster ±15–20 %, Lücken mit Clip-Stufen füllen statt mit Multiplikator. | **Lücke:** kein Bewegungs-Gate | K10 |
| 11 | **VFX** | `replies/SPEC_CARTOON_VFX_SHAPES_R1.md`; V-357, V-499, V-560 | Eine Masse mit Beulen, nie Kugelstapel. Lobes überlappen 30–60 %. Lebenszyklus. 2–3 Tonstufen aus dem einen Licht, keine Emission. 15-Punkte-Liste. | **Lücke:** Checkliste nicht mechanisiert | K6 |
| 12 | **Kamera und Inszenierung** | **Lücke:** keine 3D-Recherche, siehe `RESEARCH_BACKLOG_R1.md` R1. Bis dahin: feste Kameras aus `CRITIC_3D_R1.md`; `S/12_CAMERA_AND_STAGING.md` (2D-Shotgrammatik, nur sinngemäß); Spielkamera V-025–V-027, V-088 | Fokus, Leserichtung, Vorder-, Mittel- und Hintergrund, Hell-Dunkel-Massen werden im Konzeptblatt festgelegt. | – | K1, K3 |
| 13 | **Scenelets, Bühne, Besetzung** | `replies/SPEC_SCENELET_R2.md`; `replies/SPEC_SCENE_PACK_R1.md`; V-548–V-559 | Eine Besetzungsliste. QA (a)–(h). **Die Umgebung jedes Scenelets fällt unter die Gebiete 1–8.** | **Lücke:** Scenelet-Validator | K1–K10 |
| 15 | **Einpassung ins Terrain = ein Gesamtbild** (Georg 20.10.: „liegen alle nur auf dem Terrain rum, andere Farben, Texturen, Licht, Geometrien“) | V-341, V-396, V-402, V-403, V-429, V-564; `../50_BLENDER/SPEC/KONZEPT_ORTSBIOGRAFIE_UND_BAUSATZ_R1.md`; `replies/SPEC_PLACEMENT_GRAMMAR_R2.md` §4; `S/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` §1 | Eine Szene wird **im** Terrain gebaut, nie daraufgelegt. (1) **Boden:** kein eigener Boden, keine Platte; das Terrain läuft hinein, Sockel sinkt ein bzw. das Gelände steigt an (Schürze, Erdkeil). (2) **Farbe:** alle Töne aus derselben Biom-/Bühnenpalette mit Rollen wie das Terrain ringsum; Meshy-/Kit-Farben werden auf die Rollen umgetönt. (3) **Textur und Material:** dasselbe Knet-Material (`kfb-clay.v1.1`), keine fremden Texturen, kein eingebackenes Licht, kein eingebackenes AO. (4) **Licht:** nur das eine Rig der Welt, keine Szenen-Lampen außer echten Praktikals (V-385). (5) **Geometrie:** Maßstab K2, runde Knet-Kanten wie das Terrain, keine glatten CAD-Flächen. Ränder laufen über Rubbel bzw. Steinbänder und Sprenkel in beide Richtungen aus (V-403). (6) **Abnahme:** immer im echten Terrain mit Spielkamera; ein Bild auf neutralem Boden zählt nicht. (7) **Eingangsprüfung (V-565):** kein Meshy- bzw. Kit-Asset roh. Jedes läuft vor dem Szenenbau durch Knet-Profil + Paletten-Filter (`kfb_clay_bpy.apply`); sonst FAIL (M1/M3). | `kfb_env` B1 (Platte), B2, E1/E2 (Grund = Terrain), M1 (Material = kfb-clay), M2 (kein eingebackenes Licht), M3 (Farbe außerhalb der Palette); WS1-Export misst im Spielterrain | K2, K4, K6 |
| 14 | **Abnahme** | `replies/PROOF_STAGE_R1/README.md`; `CANON_3D/CRITIC_3D_R1.md`; `S/QA_CRITIC_PROTOCOL_R1.md`; V-431, V-520, V-561, V-563 | Erst das mechanische Gate, dann der blinde Kritiker. Phase 1: alles; Phase 2: nur Spielszenen. Stopp-Regel. Georg sieht nur Bestandenes. | `kfb_env.gate`, Proof Stage G1–G7 | – |

## 2 · Widersprüche (Stand 20.10.)
| Thema | Konflikt | Status |
|---|---|---|
| Gegenlicht | V-385 Regel 1 „immer an“ ↔ V-392 „standardmäßig aus“ | **entschieden:** V-392 / LIGHT_MODEL_R2 gilt (V-563) |
| Bodenfarbe | V-396 (größter edgePalette-Anteil) ↔ VORSCHLAG_BODENFARBE (kein sattes Grün) ↔ V-441 (aus der Stimmung) | **entschieden V-564/V-565:** Farbflächen aus der Stimmung (V-441); keine Farbsperre, der Materialcode trägt die Logik; edgePalette-Anteil nur für Schürze und Steine |
| Schatten | farbige Paletten-Schatten (Design 19.10., #439) ↔ eine Sonnenschatten-Regel (LIGHT_MODEL_R2) | **entschieden V-564:** echter Shadow-Map-Schatten aus dem einen Rig, getönt nach Empfänger-Palette |
| Style Guide | `STYLE_GUIDE_3D_R1` / `MOTION_GUIDE_R1` (11.10.) sind älter als V-305…V-561 | Diese Seite gilt vor ihnen; R2-Zusammenführung im Backlog |
| Platzierungs-Grammatik | Kopie in `50_BLENDER/SPEC` | abgelöst durch `replies/…R2` |

**Externe Prüfung:** `S/GEMINI_REVIEW_CANON_2026-10-20.md` (übernommen und nicht übernommen, mit Grund).

## 3 · Werkzeug-Lücken (Reihenfolge)
1. Blender-Knet- und Palettenmodul (`CANON_3D/lib/kfb_clay_bpy.py`): Rollenfarben aus `kfb-cartoon-palette`, Knet-Profil wie `kfb-clay.v1.1`.
2. Speckle-Modul `kfb-speckle-transition.v1` in den Hub, mit Blender-Gegenstück.
3. Validator für Scenelet, Figurenkarte und Besetzung (V-391: ohne `eyeRig` abgelehnt).
4. Bewegungs-Gate (Squash, Reihenfolge Augen → Kopf → Körper) und VFX-Checkliste als Prüfung.

## 4 · Recherche-Lücken
Siehe `CANON_3D/RESEARCH_BACKLOG_R1.md`. Fehlt Wissen, wird es recherchiert, als Regel in diese Seite gezogen und mit Gate und Kritiker-Kriterium versehen. Nichts bleibt optionaler Tipp.

## 5 · Pflege
- Nur WS0 schreibt diese Seite. Neue Regel = V-Nummer + Zeile hier + Prüfung (Gate oder Kritiker-Kriterium).
- Eine Quelle, die hier nicht steht, ist nicht verbindlich. Eine verbindliche Quelle, die hier fehlt, ist ein WS0-Fehler.
