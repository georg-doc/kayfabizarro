# WS0 → WSA work (eigener Chat, mit dem Asset Librarian) · Prop-Pool für die prozedurale Open World: alle Natur- und Umgebungs-Assets ins Platzierungsformat (V-920) · 28.10.2026

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

**Für diesen Auftrag:** Er ist reine Asset-Übernahme ohne Szenenbau – kein Konzeptblatt nötig; Zeile 2 gilt für das Messen und Rendern (Messung mit `CANON_3D/lib/kfb_place_bpy.py` wie bei den vorhandenen Kacheln, Knete mit `kfb_clay_bpy.apply`, Asset-Pass mit `kfb_clay_bpy.write_asset_pass()`, Licht nur über `CANON_3D/lib/kfb_light_bpy.py` (mood day) – keine eigenen Lampen oder Skripte dafür); Zeile 3: vor dem Hub ist die Eingangsprüfung grün (`kfb_clay_bpy.apply`, Proof-Stage G2/G5); Georg sieht die Bögen nur als Inventur-Übersicht, die Abnahme im Spielgelände mit Spielkamera (Gate + Kritiker) macht WS0 später. Die Ausnahme vom Konzeptblatt (kein Bau, keine Szene) ist WS0-Entscheid V-921. Weiter gilt: kein Spielcode, keine Modelländerung (V-574), ein Format/ein Kern (V-748), Ablage auf eigenem Branch `catalog/wsa-prop-pool-r1` im Repo georg-doc/kayfabizarro (öffentlich: nur freie Packs wie KayKit-Free/CC0, Quaternius, Kenney); gekaufte Packs (z. B. KayKit Mystery Monthly, V-549/V-587/V-588) mit Einträgen, Bögen und Pässen nur im privaten Repo georg-doc/KFB-Stunt-Car-Race, Branch `catalog/wsa-prop-pool-r1-private`; Modelldateien kommen in keinem Fall neu in ein Repo, kein Löschen ohne Georgs Ja, vor großen Schritten `df -h /` (über 8 GB frei).

**Warum:** Georg 28.10.: Der Prop-Pool der Endlos-Welt ist zu klein. Heute stehen in `kfb_place.r1.json` (Quelle der Zahlen, V-749) 289 Kacheln – Steinkit v4, KayKit Forest Nature Pack, B29, path_A–D, wenige Quaternius/Kenney (V-761); die Spiel-Fassung (slim) trägt davon 257. Alle KayKit- und Tiny-Treats-Assets und das Quaternius Nature MegaKit sollen dazukommen, damit Rezepte, WFC-Slots (nur Slot-Belegung, V-749) und Biom-Regeln prozedural daraus wählen können. Die Assets sind im Asset Librarian schon erfasst.

**Einstieg (lesen):**
- Referenzschema = `CANON_3D/lib/kfb_place.r1.json` im Register-Ordner (Abschnitte `tiles`, `recipes`, `biomes`, `adjacency`, `wfc`, `embed`, `units`, `rules.form_dna`); Spiel-Fassung zum Vergleich: https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/game/proc-world-ws0/src/vendor/place/kfb_place.r1.slim.json
- Register (Branch docs/kfb-decisions-register-2026-10-11, Ordner tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/): V-574, V-748, V-749, V-784, V-797, V-798/V-799, V-902, V-911, V-921.

**Auftrag:**
1. **Bestand aufnehmen:** Aus dem Asset Librarian alle Packs von KayKit (alle Serien inkl. Forest Nature, Mystery Monthly, Dungeon/City/Adventure-Umgebung, soweit Natur, Umgebung oder Requisite), Tiny Treats und Quaternius Nature MegaKit (plus Quaternius Ultimate/Stylized Nature, soweit vorhanden; V-799). Passende Kenney-Modelle vollständig als eigene Liste erfassen (V-799); die Rangfolge „Kenney zuletzt“ (V-369) gilt erst bei der Auswahl in den Rezepten. Je Pack: Name, Pfad im Repo, Anzahl Modelle, Lizenzangabe aus dem Librarian.
2. **Je Modell ein `tiles[]`-Eintrag** mit genau dem Feldsatz der vorhandenen Kacheln in `kfb_place.r1.json` (die folgende Liste ist ein Auszug): `id` (pack:name), `pack`, `path`, `kit`, `kind` (bestehende Arten aus `kfb_place.r1.json` nutzen, u. a. tree, bush, grass, rock, stone_S/M/L, rubble, path_stone, log; neue Arten nur, wenn keine passt, und dann in einer Liste begründen), `role` (Werte wie im Schema: Anker/Stütze/Akzent, V-763/V-793), `size_class`, `h_m`/`h_H`, `hull_r_m`/`hull_r_H` (aus dem Modell gemessen, Einheiten nach `units`), `rest`, `up`, `sink`, `anchors`, `fluff`, `contact_family`, `biomes` (Vorschlag aus Form und Thema für die sechs Biome moos/mesa/wueste/schnee/pastell/canyon), `asset_pass`, `tris`, `variant_note`, `gate_r_m`, bei Bäumen `foot_r_m`/`foot_off_m` (Stammfuß, V-790), bei länglichen Teilen `long_axis` (x|z, V-792). Farbvarianten desselben Modells als `variant_note`, nicht als eigene Art. Modelle, die unter `rules.form_dna` fallen (Würfelkronen, eckige Platten u. ä.; V-676, V-794), als ausgeschlossen markieren statt Biome vorzuschlagen. Je Modell zusätzlich ein Entwurf `<asset>.asset_pass.json` (Gebiet 15 (7)): Ursprung und Lizenz, Maßstab, erlaubte Platzierung aus den Daten; Knet-Profil, Rollenfarbe, Form-DNA und Gebrauchsspuren als Vorschlag – WS0 vervollständigt vor dem Einbau (Gate M5).
3. **Requisiten für NPC-Mikroszenen gesondert markieren** (Zelt, Lagerfeuer, Kessel, Tränke, Werkbank, Pult, Bank, Angel, Bücher, Fässer, Kisten, Laternen; V-918): Feld `kind` passend, dazu eine Liste „Szenen-Requisiten“ mit Pfad.
4. **Inventur-Bögen:** je Pack ein Bogen (mindestens 1600 px breit) mit allen Modellen im gleichen Maßstab, mit KFB-Knete (`kfb_clay_bpy.apply`, nur Material, Geometrie unverändert) und dem einen Licht-Rig, beschriftet mit `id` und klar als Inventur gekennzeichnet (keine Abnahme; Gebiet 8, V-444).
5. **Lückenliste:** fehlende Pfade, kaputte oder doppelte Modelle, Assets ohne klare Lizenz im Librarian, Arten, die für die sechs Biome fehlen.

**Form:** `catalog/PROP_POOL_R1.json` (Array von tiles-Einträgen), `catalog/PROP_POOL_R1.md` (Übersicht je Pack, neue Arten, Szenen-Requisiten, Lücken), Kontaktbögen unter `catalog/sheets/`. Ohne Fachjargon in den Bemerkungen.

**Rückgabe:** Link zum Branch, Anzahl Einträge je Pack, Liste neuer Arten, Lückenliste, offene Fragen an Georg nur dort, wo er entscheiden muss.
