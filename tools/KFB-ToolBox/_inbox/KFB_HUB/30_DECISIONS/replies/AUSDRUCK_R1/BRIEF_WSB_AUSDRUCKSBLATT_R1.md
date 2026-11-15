# Für WSB (Mac mini, Blender MCP) · Ausdrucksblatt R1: die 16 Acting-Extreme an FB und einer KayKit-Figur · 15.11. (Georg, V-1780, V-1782, V-1833, V-1835)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzept für diesen Job (WS0 bestätigt): keine Szene, sondern Posen-Blätter zweier fertiger Figuren auf der Proof-Bühne; an Stelle des Konzeptblatts steht der Acting-Katalog (unten), den WS0 geschrieben hat. Standbilder genügen hier, weil Georg Posen wählt; die Clips in Schritt 3 kommen als Video.

**Kern (3 Zeilen):**
1. Georg will cartoonige Emotionen und Takes für Figuren-Choreografien (Spiel, Website-Erklären, Leerlauf). Schritt 1, der Acting-Katalog, ist fertig.
2. Schritt 2 ist dieser Auftrag: Du stellst je Take nur die **Extrem-Pose** (Phase E) in der Stufe „cartoon“, an FB und an der KayKit-Farmerin mit Hut, als Ausdrucksblatt zur Auswahl durch Georg. Noch keine Clips.
3. Erst nach Georgs Wahl folgen die ganzen Clips (Schritt 3, eigener Auftrag).

**Grundlage:** `assets/private` @12da5db2. Pfade ohne Präfix liegen dort.

| Teil | Bestand (geprüfter Pfad) |
|---|---|
| Acting-Katalog (16 Takes, Phasen A/E/H/Ü/R, Winkel, Gesicht, Stufen) | `replies/AUSDRUCK_R1/ACTING_KATALOG_R1.md` (Register-Repo `georg-doc/kayfabizarro`, Zweig `docs/kfb-decisions-register-2026-10-11`, dort unter dem Register-Ordner `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`) |
| Gesichtswerte im Spiel | Stamm `game/integration-r2` (Repo `georg-doc/KFB-Stunt-Car-Race`): `src/modules/ausdruck.js` (Stufen fein/cartoon/extrem, Ausdrücke), `src/modules/haltung.js` (Haltungen, Gefühle) |
| FB | `50_BLENDER/FB_WEB_KANON_R1/_privat_kauf_asset/FB_WEB_KANON.r1i.glb` (FB im Shirt, Figurendatei `appearance.export.v.web`), Augen-Blick-Knoten und Lid-Morphs wie in `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1d.md`, Mund-Knoten `FB_Mund_<schlüssel>` |
| KayKit-Figur (Rig_Medium) | Farmerin mit Hut `50_BLENDER/B44/_privat_kauf_asset/KFB_Farmer_farmer_hut.r1b.glb` (Figurendatei `src/data/characters/farmer_hut.character.json` im Stamm). Die Datei hat nur die Augenanker `eye_anchor.l/.r`, keine Augen und keine Lid-Morphs, und noch keine gebackene Web-Datei. |
| Augen und Lider der Farmerin | Proof-Stage-Augenschicht `replies/PROOF_STAGE_R1/kfb-proof-eyes.v1.js` (mit `vendor/`, Register-Repo wie oben): EyeRig v6 + E2-Lider auf `eye_anchor.l/.r`, Werte aus der Figurendatei `appearance.augenR2` (Größe 1,15, Schielen 0,45, Pupille 1,0, Blickgrenze 0,5) und `appearance.lids` (E2, Farbe Kopfton dunkler, matt) |
| Brauen und Lider (Regeln) | `replies/AUSDRUCK_R1/MENTALMODELL_BRAUEN_AUGEN_R1.md` §1–§5 und `RECHERCHE_MIMIK_R1.md` (Register-Repo wie oben) |

**Was du baust:**
- Je Take aus dem Katalog die Pose am Höhepunkt der Phase E, Stufe „cartoon“, an beiden Figuren. 16 Takes × 2 Figuren.
- Gesicht dazu nach dem Katalog: FB über Brauen (`FB_Braue_L/R_Pivot`), Lid-Morphs, Augen-Blick und Mund-Knoten; die Farmerin über die aufgesetzten KFB-Augen und E2-Lider (Zeile oben), ihr Mund bleibt wie in der Datei.
- Brauen und Lider nur nach dem Mentalmodell (§2, §3, §5), nie heuristisch geschätzt (Georg q683): Die Braue ist ein Lid über dem Auge mit Innenende, Außenende und Zug zur Mitte; ihre Unterkante liegt auf der Oberlidkante (bei Wut Abstand 0); die Schräge übernimmt das Lid; nie die Braue um ihre Mitte drehen. Werte als Enden-Höhen aus der Tabelle §3.
- Wo der Katalog eine Gesichts-Lücke nennt (Freude, Angst, Verlegenheit, Nachdenken, Frust), nimmst du die Enden-Höhen aus §3 bzw. der Mimik-Recherche und markierst das Gesicht als Vorschlag. Reihenfolge der Einsätze wie Katalog §3: Blick → Brauen/Lider → Kopf → Brust → Hüfte.
- Drei Takes (Jubel, Schreck, Wut) zusätzlich in allen drei Stufen fein/cartoon/extrem an FB, damit Georg die Spannweite sieht. Eye-Pop nur in „extrem“.
- Haltungs-Regeln aus dem Katalog §1: klare Aktionslinie, lesbare Silhouette, kein Twinning. FB trägt Posen über Kopf, Ohren und Rumpf, weil seine Arme kurz sind; die Farmerin bekommt die Winkel etwa ×1,2.
- Kein Strecken oder Stauchen von Gliedern über die Knochen hinaus; wo der Katalog Stretch nennt, höchstens 8 % (V-179).
- Posen nur an den Knochen der Figuren, Proportionen und Netze bleiben (V-574). Keine neuen Teile.

**Bilder:**
- Proof-Bühne in Knete, Licht der Bühne, Kamera von vorn oder dreiviertel vorn auf Augenhöhe, Figur ganz im Bild.
- Je Take eine Zelle „FB | Farmerin“ mit dem Take-Namen. Blätter zu je vier Takes (also vier Blätter für die 16), JPG ≤ 2 MB.
- Ein Blatt „Stufen“ mit Jubel, Schreck, Wut je fein | cartoon | extrem an FB.
- Kanon-Wache auf jedem Bild: FB mit beiden Augen, Lidern im dunkleren Kopfton, Brauen, Nase, Mund, beiden Ohren, Schwanz; die Farmerin mit beiden KFB-Augen, Pupillen, E2-Lidern im dunkleren Hautton und ihrem Mund aus der Datei.

**Rückgabe:**
- Git-Bundle mit Zweig `assets/wsb-ausdrucksblatt-r1` von `assets/private` @12da5db2: Blätter und je Take eine Posen-Datei (Knochenrotationen als JSON je Figur, damit Schritt 3 darauf aufbaut) unter `50_BLENDER/AUSDRUCK_R1/`.
- RETURN `RETURN_ausdrucksblatt_r1.md` in `KFB_HUB/30_DECISIONS/replies/AUSDRUCK_R1/MINI_blatt_r1/`: je Take die gestellten Winkel und wo du vom Katalog abgewichen bist (mit Grund).
- WS0 baut daraus die Hub-Karten für Georg.
