# BRIEF WSB · B47 · Gefängnis-Labyrinth mit Panoptikum (funktional + Umbau-Animation) · R1 · 2026-10-19 · WS0
**Register:** V-554 (baut auf V-105, V-300/V-301, V-302, V-439/V-446). **Reihenfolge:** in der Warteschlange nach B46; Georg kann umsortieren (Hub q119). Erst eigenständig, das Meshy-Diorama wird später angeschlossen.

**Tier 0**
1. **Labyrinth:** funktional aus unserem Mauer-Gizmo bzw. Baukasten B29 r4 (Zelle 4 u, Höhe 3,6 u), eckig **und** rund bzw. polar.
   - Mit animiertem Umbau: Mauern wachsen aus dem Gelände bzw. versinken, das Labyrinth baut sich per Knopfdruck um (V-301: der Chief Warden bzw. Zinnsoldat am Schaltpult).
   - Grundlage: die Generator-Logik aus dem Greybox (Backtracker eckig/polar) bzw. Incompetech-Algorithmen.
2. **Panoptikum in der Mitte:**
   - passende Stein-Turmbasis, darauf der **Blob-Corp-Turm** (B40);
   - hier mit **Panoptikum-Auge** (Orb-Auge, Glühen) und **animiertem Suchscheinwerfer-Strahl**, der über das Labyrinth streicht.
3. **Stimmung:** düster-cartoonig. Steine, Geröll, Schmutz, dunkle Pfützen, kahle dunkle Bäume, schwarze Mini-Geier bzw. Raben, die herumfliegen. Die Vögel gibt es auch als stilisierte Fledermäuse für den Vampirturm.

## Block
**Quellen**
- **Mauer-Baukasten:** `50_BLENDER/B29/kit_r4/` (gerade, Ecke, T, Kreuz, Tor, kaputt, Kurven bzw. Ringe r2/r3 mit Kappen); Skins W1 Lehm-Stein, W2 laut V-302.
- **Generator:** `3D ASSETS/BLENDER MCP/PRISON_MAZE_GREYBOX_2026-10-10/` (Backtracker eckig/polar), Konzept in `30_DECISIONS/replies/GIZMO_MAZE_RECOVERY_R1.md`. Polar-Ringe 2C–5C mit ähnlicher Segmentlänge (V-446). Den Incompetech-Code nur nach Lizenzprüfung, sonst den eigenen Backtracker.
- **Turm:** B40 `KFB_BlobCorp_Tower` (+ Orb-Auge). Die Steinbasis aus Kit bzw. Asset-Suche (CC0), z. B. ein runder Wachturm-Sockel.

**Labyrinth (Daten + Geometrie)**
- **Rasterplan als Daten:** `maze_<id>.json` mit Zellen, Wänden, Toren und Zentrum, zwei Layouts A und B je Form (eckig, polar). Daraus baust du die Mauer-Instanzen aus dem Kit. Die Wand-Knoten heißen eindeutig nach Zelle bzw. Kante (`wall_e_<i>_<j>_N` usw.).
- **Umbau-Animation** A → B:
  - Mauern, die verschwinden, sinken ins Gelände (Staub-Krümel am Fuß);
  - neue Mauern wachsen hoch (leichter Overshoot, Squash);
  - zeitlich gestaffelt wie eine Welle vom Zentrum nach außen, Dauer ≈ 3–4 s.
  - Als Scenelet-Spuren (`timeline.tracks`, Höhe je Wand) + Marken `rebuild_start` / `rebuild_end`, plus eine gebackene Vorschau.
  - Die Laufzeit-Version (neues Layout per Generator) macht später WS1b mit denselben Regeln.
- **Gänge:** lichte Weite ≈ 3 u; eine Medium-Figur sieht nicht über die Mauer, eine Large-Figur darf spähen (V-446).

**Panoptikum**
- **Aufbau:** Steinbasis (rund, massiv, kleine vergitterte Fenster) + Blob-Corp-Turm obenauf. Ein Wachgang mit Brüstung ist optional.
- **Auge:**
  - das Orb-Auge (B40), hier groß und als Panoptikum-Auge;
  - Lider anthrazit, starrt, scannt;
  - Glühen als Material-Emission (Laufzeit-animiert, sonst 0, V-385).
- **Suchscheinwerfer:**
  - Anker `KFB_Searchlight` am Turm, Strahl als weicher Kegel-Mesh (`kfb_beam_soft`) mit Pfad-Spur über dem Labyrinth (Kreis bzw. Acht, Stopps bei Zielen);
  - Lichtpfütze am Boden als Decal.
  - Echte Beleuchtung macht WS1b (ein Spot, V-385).

**Szenerie-Props**
- Steine und Geröll-Nester (Dreier-Regel), Schmutz-Flecken, dunkle Pfützen (glänzend, nicht spiegelnd), kahle dunkle Bäume, Zaunreste.
- Ein Schaltpult für den Warden: KayKit bzw. Sci-Fi-Kit, Anker `KFB_Rebuild_Button`.

**Vögel / Fledermäuse**
- Schwarze Mini-Geier bzw. Raben als Schwarm, kleine Knet-Formen mit Flügelschlag-Clip (Asset-Suche CC0, z. B. Quaternius Animals).
- Dazu eine Fledermaus-Variante (gleiches Rig, andere Flügel bzw. Silhouette) für den Vampirturm (B38).
- Flugbahnen als `procedural` (Kreisen über dem Turm, Aufscheuchen beim Umbau).

**Abnahme / Lieferung**
- **Prüfstand:** Labyrinth eckig + polar (Layout A/B), Panoptikum mit Auge offen / starren / zu, Suchscheinwerfer-Bogen, Vögel und Fledermäuse.
- **Umbau-Streifen** A → B.
- **Als Scenelet:** GLBs + Base64 + `prison_maze_01.scenelet.json` (Maze-Daten, Umbau-Spuren, Strahl-Pfad, Vogel-Schwarm). QA V-520, Lizenzen im RETURN.
