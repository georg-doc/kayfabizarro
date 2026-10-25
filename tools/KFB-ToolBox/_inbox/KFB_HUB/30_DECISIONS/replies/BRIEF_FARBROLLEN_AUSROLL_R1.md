# Farb-Logik ausrollen · an WS1, WSA, WSB (V-800, V-801, V-802, V-803)

**Tier 0**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

**Konzeptblatt:** WS0 reicht es je Owner vor dem Bau nach (`replies/FARBROLLEN_KONZEPTBLATT_<WS1|WSA|WSB>.md`); vorher wird nichts gebaut, nur gelesen und die Teile-Liste erstellt.

**Auftrag (V-803):** Die Biom-Palette des Ortes aus dem eingelockten Generator `kfb-cartoon-palette.js` (V-305, V-800) färbt die in V-803 genannten Teile:
- (Teile von) Props wie Baumkrone und Stamm;
- Gebäude, Dioramen, Mindscapes, Billboards;
- VFX wie Rauch und Partikel, abgestimmt auf die Gelände-, Fluid- und Prop-Farben des Ortes.

Welche Rolle welchen Teil färbt, steht nur in `replies/COLOR_CONCEPT_R1.md` → „Nachtrag 25.10. · Ausroll-Rollen“, Ausnahmen inklusive (Fluff, Schach, Karte und Goo-Häuser bleiben; Racer werden auf die Biom-Rollen umgetönt bis auf 1–2 Identitätsfarben, V-662). Surreal heißt: eine andere Rolle derselben Palette, nie eine fremde Farbe.

**Referenz-Bilder:**
- Hub q222 (Georg PASS): Gelände ohne Sprenkel, Biom-Übergang Band für Band.
- Hub q220 (TUNE, mit q222 abgenommen): Bäume zweifarbig, Krone Laub/Blüte, Stamm −105° dunkler.
- Golden Samples: `replies/COLOR_HARMONY_R1/bilder/01_j17_canyon_original_vs_regel.png`, `01_j17_bucht_original_vs_regel.png`, `01_j17_otown_original_vs_regel.png` und `04_szene_1_otown_original.png`.

**Referenz-Code:** Spiel `game/proc-world-ws0` @3512531 im privaten Repo KFB-Stunt-Car-Race:
- `src/look/biomeTerrain.js` `harmonyPalettes(seed)`: Rollen je Biom;
- `src/world/placeVeg.js` `plateTint`/`tintFor`: zweifarbige Props über die Instanzfarbe.

**Je Owner**
- **WS1 (Laufzeit):**
  - Gebäude und OSM-Gebäude: gemalte Meshy-Texturen nur sanft getönt (V-286).
  - Amphitheater: Bögen nach Rollen umgefärbt (V-402), Sprengsel steinweise über die COLOR_1-Stein-IDs (V-406).
  - VFX: Rauch und Dampf nehmen den hellsten `cloud`-Ton, unten getönt mit der Quelle. Staub nimmt `sand`/`under[1]` des Bodens an der Stelle, Spritzer `water`, Blätter die Laubrollen am Ort, Funken `pad`/`strang`, ohne Emissive (V-385). Die Form richtet sich nach `SPEC_CARTOON_VFX_SHAPES_R1`.
  - Fluids, WS1c (V-750): ein Shader, Rezepte je Biom in kfb_place, Säure im Gegenton.
- **WSA:** Mindscapes (Palette aus demselben Generator, V-800) und Billboards (Rahmen `strang`, Pfosten `trunk`, Fläche `cloud`). Die Karte selbst wird nie umgefärbt (V-329).
- **WSB:**
  - Blender-Bauteile tragen Rollen über das bestehende COLOR_1-Format (V-406: R+G Stein-ID, B Rolle, A 255); den Ton setzt die Laufzeit.
  - Steinkit-Teile mit echten Vertex-Farben behalten diese (V-788).
  - Bildpaare mit `kfb_clay_bpy` auf der Proof-Stage.

**Abnahme-Bilder:** je Teil ein Vorher/Nachher im echten Gelände mit der Spielkamera, mit der Canyon-Palette und einer gewürfelten Palette. Konzeptblatt, dann Gate, dann blinder Kritiker, erst danach Georg. WS1 liefert über das private Artefakt KFB Abnahme, alle anderen Sitzungen über den privaten Branch (V-683).

**Rückgabe:** Status mit den Bildpaaren und der Liste der umgestellten Teile. Fragen kommen als Hub-Karte zu Georg.
