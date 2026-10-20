# BRIEF WSB · 3D-Kanon in Blender · R1 · 2026-10-20 · WS0
**Register:** V-563 (Kanon ist Pflicht), V-564. **Owner:** WSB (Mac mini, alle Blender-Jobs). Läuft nach dem Augen-Fix Spielzeugsoldat (V-562).

**Tier 0**
1. **Ab sofort** gilt für jeden Blender-Job `30_DECISIONS/CANON_3D/CANON_3D_R1.md`:
   - Umgebung nur über `CANON_3D/lib/kfb_env_bpy.py` (Platzieren mit `kfb_env.nest_ok`, am Ende `kfb_env_bpy.run()`);
   - jedes Objekt mit den Eigenschaften `kfb_kind`, `kfb_role`, `kfb_layer`, `kfb_story`, `kfb_group`;
   - keine eigenen `place()`-, Licht- oder Knete-Helfer mehr.
2. **Neue Szenen** nur mit dem Konzeptblatt von WS0 (`CANON_3D/KONZEPTBLATT_R1.md`). Ohne Blatt kein Bau. RA-Settings 1:1, nie „verbessern“.
3. **Abgabe:**
   - Gate grün (`env_gate.json` liegt bei);
   - Proof Stage G1–G7;
   - dann prüft der blinde Kritiker (`CANON_3D/CRITIC_3D_R1.md`, Phase 1: alles);
   - erst dann an WS0.

## Block
**Aufträge in dieser Reihenfolge:**

1. **K1 Knete und Palette in Blender** (`CANON_3D/lib/kfb_clay_bpy.py`):
   - ein Material-Baustein mit den Profilen aus `replies/CLAY_SSOT_R1/kfb-clay.v1.1.js` (Werte 1:1 übernehmen, Quellzeile);
   - Rollenfarben aus `replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js` bzw. der Insel-Palette. Eine Funktion `apply(ob, role, palette)`; Meshy nur leicht tönen (V-286).
   - **Test:** Knet-Kugel und ein KayKit-Teil im Proof-Stage-Licht neben der Web-Fassung, Bildpaar.
2. **K2 Bestandsaufnahme (nur lesen, nichts neu bauen):**
   - die Szenen B44, B47, B48, Clown, Disco, Sci-Fi und Friedhof durch `kfb_env_bpy.run(raise_on_fail=False)` schicken (Eigenschaften dafür nachtragen);
   - das Ergebnis als Tabelle in `50_BLENDER/CANON_BASELINE_R1.md`.

   Das ist die Messlatte, wie weit die FAILs vom Kanon entfernt waren.
3. **K3 Werkzeug-Umzug:**
   - `glbedit`/`gltfio` aus `MeshyModels/_blender_run_r2/scripts/` nach `CANON_3D/lib/` (eine Fassung, keine festen `/Users/georg`-Pfade);
   - die 16 Skripte mit eigenem `place()` laufen künftig über `kfb_env`.

   Alte Builds nur anfassen, wenn sie neu gebaut werden.
4. **K4 erste Szene nach Kanon:** sobald WS0 das erste Konzeptblatt liefert.

**Einpassung (Kanon Gebiet 15, Georg 20.10.):** Dioramen und Scenelet-Sets haben **keinen eigenen Boden und keine Platte**.
- **Lieferung:** Teile + Set-Liste (`role`, `layer`, Band, Signatur) zum Einpassen ins Spielterrain.
- **Material:** Knete aus K1, Farben nur aus Rollen.
- **Licht:** keine eingebackenen Licht- oder AO-Texturen.
- **Proofs** auf Knet-Terrain mit derselben Palette wie das Biom, nie auf neutralem Teller.

**Regeln:**
- Schwere Läufe headless.
- Downloads und Installationen nur mit Georgs direktem OK.
- Gekaufte bzw. private Assets nie in öffentliche Dateien.
- Zwischenstände in `_work/`.
- Meldet das Gate etwas, das gegen eine Quelle 1:1 steht (z. B. RA-Original), dann melden statt anpassen.
