# RECOVERY · G1 Inselkörper und Fels · Webchat G1 · 2026-10-10

Status: **Runde 1 Quelleninventur PERSISTIERT, noch keine Source-Isolation/Georg-Abnahme**  
Owner: KFB Island Worldbuilder Lab, bounded G1 only  
Repo: `georg-doc/kayfabizarro`  
Arbeitsbranch: `planning/kfb-mvp1-asset-candidates-2026-10-10`  
Quellbrief: `sync/lab-rkit-2026-10-09`, `BRIEF_WEBCHAT_ASSET_CANDIDATES_R1.md`  
Bekannter geprüfter G1-Meilenstein-Head vor Recovery: `6ed366abff3072102c5fd79b84594d204ac4d664`. **Aktuellen Branch-Head immer live erneut lesen.**

## Erledigte Elemente / Evidenz
- **KFB Town Plateau** (`town_plateau_island_body`): 5 Kandidaten (StreakByte Port, Backyard, River, Forest, Pond); Port als A **zur Sichtprüfung**.
- **Protopia Berg-Scholle** (`protopia_steep_island_body`): 5 Kandidaten; **kein** durch Bild/BBox bestätigter hoher schmaler Komplettkörper.
- **Kleine Brückenpfeiler-Brocken** (`small_bridge_pier_rocks`): 4 Kandidaten.
- **Felswände / Schollenabbruch** (`cliff_rupture_wall`): 5 Kandidaten.
- **Große Felsen** (`large_boulders`): 5 Kandidaten.
- **Felsgrate** (`rock_ridges`): 5 Kandidaten.
- Alle sechs Gruppen haben je 3–5 Quellenkandidaten, **29 gesamt**. Werthaltige Einzeldaten: Pack/Source, echter Dateiname/Repo-Pfad, vorläufiger Rank, Risiken, Lizenzstatus, Format, vorhandene Tri-Messung oder `null`, K2-H Zielmaß. `picked=null`, `goldenRef=false`, `referenceViews=[]`.
- [G1 Kandidatenblatt](https://github.com/georg-doc/kayfabizarro/blob/planning/kfb-mvp1-asset-candidates-2026-10-10/tools/KFB-ToolBox/_inbox/MVP1_RETURNS/G_asset_candidates/G1_inselkoerper_fels.md)
- [G1 JSON](https://github.com/georg-doc/kayfabizarro/blob/planning/kfb-mvp1-asset-candidates-2026-10-10/tools/KFB-ToolBox/_inbox/MVP1_RETURNS/G_asset_candidates/G1_inselkoerper_fels.json)
- **Bilder:** keine generierten Referenzbilder, keine Source-Objekt-Screenshots; das ist offen, nicht simuliert.
- Vorhandene Messquelle (privat im lokalen Lab): `/CLAUDE/KFB Island Worldbuilder Lab/docs/ISLAND_ANATOMY_RULES.md` und `tools/out/measure.json`. Original StreakByte Modelle in Dropbox als FBX nachgewiesen. Dropbox FBX file_preview lieferte **keine Thumbnails** (2026-10-10). Keine Paid-Pack-Datei in GitHub kopiert.

## Nicht freigegeben / unbekannt
Native bbox und tatsächliche Skalierung in H; Quellmodell in vier isolierten Ansichten; §00/§01 visuell; Materialien/Atlas/Umfärbbarkeit, Schatten und Kollisionsfläche; Quelle zu Polygonmetrik für Einzelrocks, Quaternius/Platformer/GLTF; Vertragsbedingungen gekaufter StreakByte-Lizenz. Das 'W=60' der alten Messung ist eine **Normalisierung**, kein Figurenmaßstab. Keine Quellansicht darf als Akzeptanz einer zusammengesetzten Szene ausgegeben werden.

## Letzte Georg-Entscheidungen und offene Fragen
- **In diesem G1-Webchat noch keine Auswahl (`picked`) / kein GoldenRef**. Briefingvorgaben: zuerst vorhandene menschengebaute Assets; Town breites Plateau, Protopia schmale hohe Berginsel; Dioramenknete mit Materialmix und ohne CAD-Raster / Krempen.
- **Georg muss derzeit nichts auswählen**, bis isolierte Quellansichten vorliegen.
- Offener Produktentscheid danach: pro Element `picked` oder `weiter suchen` mit Grund. Nicht vorwegnehmen.

## Suchbegriffe / angewandte Abfragen
- GitHub: `registry/assets/v1/packs/{kenney-nature-kit,kaykit-medieval-hexagon-pack-1-0-free,kaykit-forest-nature-pack-1-0-free,ultimate-nature-pack-by-quaternius-1,platformer-game-kit-dec-2021}.json`, exact files for `cliff*`, `rock*`, `mountain*`, `RockPlatform*`.
- Dropbox: `StreakByte`; `originals.html`; `measure.json`; `public/assets/streakbyte/Models`; acht Unterordner; `LPFI_PortLand/Floting Base.fbx`; `LPFL_BackyardLand/Backyard Base.fbx`.
- Externe Lizenzverifikation: `StreakByte Low Poly Floating Islands`, `Kenney Nature Kit CC0`, `KayKit Medieval Hexagon Pack CC0`, `Quaternius Ultimate Nature Pack CC0`.
- Kein externer Ersatz für ein vorhandenes Repo-Asset wurde übernommen.

## Genau ein nächster Schritt
**Source-Isolation G1-Town:** Das originale private StreakByte `LPFI_PortLand/Floting Base.fbx` und die Alternative `LPFL_BackyardLand/Backyard Base.fbx` im bestehenden Island Lab isoliert (nicht Demo-Szene) rendern: gleiche Kamera/Licht für Front, 3/4 von oben, Seite und von unten; native bbox, grobe H-Skalierung nach `40 MC = 70,4 H`, Kanten-/Unterseiten-/Materialprüfung. PNGs als referenzierbare Proofs in das G1-Blatt aufnehmen, ohne bezahlte FBX zu veröffentlichen. Danach G1 Recovery + Changelog aktualisieren und nur die konkrete Formwahl Georg vorlegen. **Kein Runtime-Bau/Stage/Live/Auto-Merge.**
