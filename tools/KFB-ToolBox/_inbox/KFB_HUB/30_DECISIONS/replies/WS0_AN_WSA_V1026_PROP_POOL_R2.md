# WS0 → WSA work (Chat mit dem Asset Librarian) · Prop-Pool R2: Nature-Packs, alle KayKit-Packs, Ressourcen und Übergabe als Kachelliste fürs Spiel (V-1026) · 29.10.2026

**Tier 0** (wörtlich aus CANON_3D_R1 §0)
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

**Für diesen Auftrag:** reine Asset-Übernahme ohne Szenenbau, kein Konzeptblatt (V-921). Messen, Knete und Licht wie in R1: `measure()` und `runGates()` unverändert (G2/G5 werten), Bögen mit `kfb_clay_bpy.apply` und `kfb_light_bpy.setup` (Tag), klar als Inventur gekennzeichnet. Keine Abnahme, kein Spielcode.

**Warum:** Der Prop-Pool R1 (`catalog/wsa-prop-pool-r1`, 2001 Einträge, plus privater Katalog) ist gut, aber (a) drei fertige Nature-Packs fehlten, darunter alle Blumen und Pilze; (b) einige KayKit-Packs fehlen, z. B. die Bäume aus den Halloween Bits; (c) der Katalog ist nie im Spiel angekommen: Der Verteiler läuft dort noch mit 257 Kacheln. R2 schließt alle drei Lücken. Georg 29.10.: Ressourcen (Holz, Erz, Werkzeuge) kommen als eigene Klasse dazu und werden später mit dem Fluff-Ressourcen-Konzept zu Spielmechanik.

**Einstieg (lesen):**
- R1-Auftrag `replies/WS0_AN_WSA_V920_PROP_POOL_R1.md` (Feldsatz, Bögen, Form gelten weiter) und deine R1-Rückgabe `catalog/PROP_POOL_R1.md`.
- Referenzschema `CANON_3D/lib/kfb_place.r1.json` (Abschnitte `tiles`, `recipes`, `adjacency`, `wfc`); Spiel-Fassung: https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/game/integration-r2/src/vendor/place/kfb_place.r1.slim.json
- Register (Branch docs/kfb-decisions-register-2026-10-11, Ordner tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/): V-574, V-749, V-799, V-806, V-920, V-921, V-932, V-1004, V-1005, V-1006, V-1007.
- **Neu im Eingang:** Branch `assets/nature-packs-r1` im privaten Repo georg-doc/KFB-Stunt-Car-Race:
  - `kenney_nature_kit/` · 329 GLB (Blumen, Pilze, Gräser, Steine, Pflanzen, Bäume)
  - `quaternius_stylized_nature_megakit/` · 68 glTF mit Texturen
  - `quaternius_ultimate_nature/` · 150 GLB, von WS0 aus den BLEND-Originalen umgewandelt (V-932: das sind dieselben 150 Modelle, die du per BLEND gemessen hast; Messung bleibt gültig, jetzt mit Spielpfad)

**Auftrag:**
1. **Nature-Packs aufnehmen:** alle drei Packs aus `assets/nature-packs-r1` als `tiles[]`-Einträge im Feldsatz von R1, Pfade auf diesen Branch. Schon in R1 gemessene Modelle (Ultimate Nature per BLEND, V-932) bekommen keinen neuen Eintrag, nur den neuen Spielpfad; Fuß- und Längsachsen-Felder bleiben leer.
2. **KayKit vollständig:** jeden KayKit-Pack im Librarian gegen beide Kataloge (öffentlich und privat) abgleichen und fehlende Umgebungs- und Requisiten-Modelle aufnehmen. Ausdrücklich prüfen: Halloween Bits (Bäume, Zäune, Grabsteine, Kürbisse), Medieval Snow Biome, Platformer Pack (FREE/EXTRA, nur Umgebung; Raster-Anschlüsse nach V-1003 noch nicht markieren), Medieval Builder, Festive Mini-Pack, Prototype Bits, Mystery Monthly 4–6 (nur Umgebung und Requisiten; Kaufpacks bleiben privat). Figuren und Animationen bleiben draußen. Kit-Modelle unverändert (V-574).
3. **Klassen und Abdeckung:** je Eintrag eine Klasse aus dieser Liste (bestehende `kind`-Werte weiter nutzen, Klasse als zusätzliches Feld `class`): Stein, Gras, kleiner Busch, Blume, Pilz, Pflanze, Baum, Strunk/Holz am Boden, Weg/Platte, Gebaute Ordnung (Gräber, Zäune, Beete, Mauern; V-749 Nr. 6), Gebäude, Requisite, Ressource. Gebaute Ordnung bekommt eine eigene Zeile in der Abdeckungstabelle. Dazu eine Tabelle „Klasse × Thema“ (die sechs Start-Themen nach V-951; Themen-Etiketten automatisch aus Name bzw. Pack vergeben, keine Handzuordnung) mit der Anzahl je Feld; leere oder dünne Felder rot.
4. **Ressourcen als eigene Klasse** (`class: resource`, Felder `resource_type` und `amount_tier`):
   - **Holz:** Stämme und Stapel aus KayKit Resource Bits in ihren Mengenstufen (1, 2, 3, 4 bzw. so, wie das Pack sie liefert), dazu Holzfäller-Werkzeuge aus RPG Tools Bits (Säge, Axt, Hackklotz u. Ä.).
   - **Erz und Gold:** Erz-, Gold- und Barrenstapel in Mengenstufen, dazu Schaufel, Spitzhacke, Loren, Grubenholz und andere Minen-Requisiten aus Resource Bits, RPG Tools, Dungeon und Mystery-Packs.
   - **Weitere Rohstoffe**, die die Packs hergeben (Stein, Kristalle, Stoff, Nahrung), gleich mit erfassen.
   - Je Ressource eine Gruppe „Rohstoff + passendes Werkzeug + Lager-Requisite“ als Vorschlag für eine Mikroszene, nur als Liste wie die Szenen-Requisiten in R1 (V-918; kein neues Datenformat; Szenen-Format bleibt kfb.scenelet/1 nach V-941, Requisiten-Abschnitt SPEC_SCENELET_R2 §5). Keine Spielregeln erfinden: Mechanik und Fluff-Bezug legt WS0 später fest.
5. **Färbbarkeit je Eintrag:** Feld `tint` mit `flat` (Flächenfarben je Material), `atlas` (eine Textur für viele Teile) oder `vertex` (Vertex-Farben), dazu die Anzahl Materialien. So weiß WS0, wie die Farbrollen (V-803/V-806) greifen.
6. **Übergabe fürs Spiel:** eine zusammengeführte Kachelliste `catalog/KFB_PLACE_TILES_R2.json` im Format der Spiel-Fassung (`kfb_place.r1.slim.json`, Abschnitt `tiles`), die die heutigen 257 Kacheln unverändert enthält und alle neuen ergänzt. Die Felder `class`, `tint`, `resource_type` und `amount_tier` sind Zusatzfelder; das Prüfskript lässt sie zu und prüft sonst das Schema gegen die slim-Fassung. Pfade wie in R1 (Librarian-Pfad `media/3D_Assets/…`); für die Nature-Packs zusätzlich `src: "KFB-Stunt-Car-Race@assets/nature-packs-r1:<pfad>"`. Das Prüfskript löst jeden Pfad auf und meldet Kaufpack-Pfade ohne Repo-Datei als „privat, lokal“, nicht als Fehler. WS0 führt die Liste danach in die eine Kachelquelle `kfb_place.r1.json` zurück (V-748/V-749).
7. **Asset-Pass-Entwürfe** für die neuen Einträge wie in R1 (`kfb_clay_bpy.write_asset_pass()`).

**Form:** Branch `catalog/wsa-prop-pool-r2` (öffentlich, ohne Kaufpack-Einträge) und `catalog/wsa-prop-pool-r2-private` (alles inkl. Kaufpacks). Die zusammengeführte `KFB_PLACE_TILES_R2.json` mit Kaufpacks liegt nur auf dem privaten Branch; der öffentliche bekommt höchstens eine Fassung ohne Kaufpacks (V-587). Dateien wie R1 plus `catalog/KFB_PLACE_TILES_R2.json`, `catalog/COVERAGE_R2.md` (Klasse × Thema), `catalog/RESOURCES_R2.md`, Bögen unter `catalog/sheets/`. Ohne Fachjargon in den Bemerkungen.

**Wie in R1:** keine neuen Modelldateien ins Repo außer Katalog und Bögen, nichts löschen ohne Georgs Ja, vor großen Schritten `df -h` (über 8 GB frei).

**Rückgabe:** Branch-Link, Einträge je Pack, Abdeckungstabelle, Ressourcen-Liste mit Gruppen, Ergebnis des Prüfskripts, Lückenliste. Fragen an Georg nur, wo er entscheiden muss.
