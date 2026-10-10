# RECOVERY · G1 Inselkörper und Fels · Webchat G1 · 2026-10-10

Status: **R5 · G1 Concept Previews VERIFIED · full-size PNG GH upload OPEN · G4 bridge visual seam QUARANTINED (2 failed attempts)**  
Owner: KFB Island Worldbuilder Lab, bounded G1 only  
Repo: `georg-doc/kayfabizarro`  
Arbeitsbranch: `planning/kfb-mvp1-asset-candidates-2026-10-10`  
Quellbrief: `sync/lab-rkit-2026-10-09`, `BRIEF_WEBCHAT_ASSET_CANDIDATES_R1.md`  
R2-Vergleich/Runbook/Testbericht-Head vor Abschluss: `6a967018bb748d28a33cfdf296eb4e40952962a7`. **Aktuellen Branch-Head immer live erneut lesen.**

## R6 · GitHub-Original-PNG-Upload geprüft; G1 Rock source-isolated · 2026-10-10
- Vorhandene ZIP-PNGs: alle drei 1448×1086-Originale sind in `KFB_MVP1_G1_Concept_Images_2026-10-10.zip` lokal vorhanden, ZIP-Test OK. **GitHub-Upload Originale weiterhin 0/3**: Verbundener GitHub-Connector benötigt vollständige Base64-Bytes als Textargument und kann vorhandene Conversation-/Containerdateien nicht direkt konsumieren; lokale Umgebung hat weder GitHub-Credentials noch erreichbare GitHub-Netzverbindung. Bestehende **3/3 WebP-Vorschauen** bleiben auf GitHub. Keine falschen Original-PNG-Links.
- Für den nächsten G1-Motivkandidaten `large_boulders` **tatsächliches Kenney `rock_largeA.glb` aus GitHub-Sync-Branch geladen und binär dekodiert**: 146 Vertices, 80 Dreiecke (71 dirt / 9 grass), native Ausdehnung 0,78491×0,25978×1,01546 GLB-Einheiten (K2-Faktor offen). [Quellenbericht](G1_ROCK_LARGEA_SOURCE_EVIDENCE_R1.md) und [vier geometrisch abgeleitete Quellansichten](refs/source-isolation/G1_kenney_rock_largeA_source_4view.svg) geschrieben, nach GitHub Write gelesen. [Quelle/Status-Test](TEST_REPORT_G1_ROCK_SOURCE_R1.md) **11/11 statisch PASS**, kein menschlicher Golden-/Visual-Critic-PASS.
- Bildgenerierung erzeugte trotz explizitem G1-Rockauftrag erneut ein **beschriftetes G4-Brücken-Mehrfachblatt**. Nicht als G1- oder G4-Asset übernommen; [Fehler-Recovery R2](G1_IMAGEGEN_DRIFT_RECOVERY_R2.md) geschrieben. Vollständiger Chat-Failure-Export `KFB_G4_BRIDGE_GENERATOR_DRIFT_RECOVERY_2026-10-10_r2.zip`, SHA-256 `6032029fd97748f18443d6f00cddefb1278002527c645cf80c5c9b62c37bb556`. Keine weitere Bildkorrektur dieser Seam.
- [G1-Kandidaten-JSON](G1_inselkoerper_fels.json) ergänzt exakte GLB-Evidenz, [Gesamt-Worklist](G1_SCENE_ASSET_WORKLIST_R1.md) aktualisiert, `picked=null`, GoldenRefs 0; keine zweite Runtime, kein G4-Owner-Eingriff.

## R5 · G4 Bridge Bildversuche gescheitert und exportiert · 2026-10-10
- Fortsetzung aus der freigegebenen 40-Motive-Arbeitsliste: [G4-Brückenvergleich und echter img2threejs-Test](G1_G4_BRIDGE_VISUAL_FAILURE_RECOVERY_R1.md) gelesen. Originale donor-Form und der nicht produktionsreife Render blieben getrennte Quellen.
- Zwei neue Bilder erzeugt (A1, A2) – beide **FAIL**: beschriftete mehrteilige Präsentationsblätter mit externen Requisiten/Marken statt **einer einzelnen freigestellten** Steinbogenbrücke. Keine visuelle Verbesserung nach der expliziten A2-Reparaturanweisung; deshalb **keine dritte Reparaturrunde**.
- [Vollständige Fail-Recovery](G1_G4_BRIDGE_VISUAL_FAILURE_RECOVERY_R1.md) und [QA](TEST_REPORT_G1_G4_FAIL_R1.md) erstellt. Originale beider fehlgeschlagenen Bilder (1536×1024 PNG) im Chat-Export `KFB_G4_BRIDGE_FAILURE_RECOVERY_2026-10-10_r1.zip` einschließlich Manifest/Hashes/Report/Previews. ZIP **nicht** auf GitHub, belegte Prüfsumme `4cdf6cbf812650baf62982d17a4402c00d519f8706de6c7d661884b224435735`.
- **10/10 Paket-/Datei-Checks PASS**, **0/2 G4 Visual-PASS**. Die alten **3/3** tatsächlichen WebP-G1-Vorschauen auf GitHub bleiben unverändert; die drei vollständigen G1-PNGs weiterhin **0/3 GitHub**, trotz intaktem ZIP und **3/3** SHA256-Vergleich.
- [40-Motive-Editorial-Liste](G1_SCENE_ASSET_WORKLIST_R1.md) und [JSON](G1_SCENE_ASSET_WORKLIST_R1.json) markieren nur G4-Steinbogen als `visual_attempt_failed_quarantined`. Andere Owner, WorldBuilder-Runtime und der übrige Bildserien-Plan bleiben unangetastet.
- Georgs neue Nachricht: „top! weiter..“. Keine neue `picked`- oder `goldenRef`-Entscheidung zum Steinbogen.

## R4 · Bildserie im Webchat und Szenen-/Assetliste · 2026-10-10
- Georgs positive Richtungsrückmeldungen: „sieht cool aus! aber der look könnte noch cartooniger, stilisiert und weniger realistisch sein, denke ich….“ → nach KFB Clay-Tuning: „super!“ → nach Protopia-Variante: „super!“ (nur optische Richtung, **kein** Pick/Golden).
- **3 echte KI-Konzeptbilder erzeugt**: Town R1 (naturalistischer), Town R2 (cartooniger KFB Clay-Look), Protopia R1 (höhere Berg-Scholle). Bilder sind nicht originäre StreakByte-FBX-Renderings, keine tatsächliche source-isolated donor parity. Kein PNG wurde als originale Vorlage ausgegeben.
- **3/3 binäre 256×192 WebP-Vorschauen** unter `refs/_concepts/` auf diesem G1-Branch überprüft; Einzeldateien/Quellhashes im [Bildregister](G1_RENDERED_CONCEPTS_R1.md) bzw. [JSON](G1_RENDERED_CONCEPTS_R1.json). **Full-Res PNGs noch nicht auf GitHub** (0/3).
- Full-Res-Originale (3× 1448×1086 PNG) sind in der generierten Chat-Anlage `KFB_MVP1_G1_Concept_Images_2026-10-10.zip` mit Checksums und idempotentem GitHub-Uploadhelfer gesichert. Cloud-Container hat keinen Netzwerk-DNS/GitHub-Tokentransport für Upload der 5,7 MB Original-PNGs; kein fiktiver Full-Res-Link.
- [Abarbeitbare Gesamtliste](G1_SCENE_ASSET_WORKLIST_R1.md) und [maschinenlesbare Liste](G1_SCENE_ASSET_WORKLIST_R1.json): **7 Szenenkontexte**, **40 Einzelmotive**, **6 Gruppen**. G2–G6 bleiben bei ihren eigenen Arbeitschats; G1 führt nur redaktionell die Gesamtliste.
- [Galerie-Testbericht](TEST_REPORT_G1_GALLERY_R1.md): **15/15** statische Prüfpunkte PASS, 3/3 Blob-SHA-Readbacks, ZIP geprüft; 0 neue Original-FBX-Screenshots, 0 native bbox, 0 GoldenRefs, 0 Produkt-PASS.

## R3 · Dropbox KFB Style References für Bildserie gefunden · 2026-10-10
- Original-Ordner: `KFB Style References` in `KFB Card Zone Lab v2`; **8/8 Bilddateien** über Dropbox-Liste nachgewiesen, alle mit Preview-Verweisen. Entsprechender GitHub-Spiegel unter `tools/KFB-ToolBox/_inbox/KFB Style References/` enthält sieben gleichnamige Bilder; ROCKOS bisher nur in Dropbox zugeordnet.
- Neue [Style/Source-Routing- und Webchat-Bildserienanweisung](G1_IMAGE_SERIES_STYLE_INPUTS_R1.md). KFB-Style-Router `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md` gelesen: Dropbox-Referenzen sind MOOD/STYLE; tatsächliches StreakByte PortLand/Backyard bleibt FORM SOURCE, aktueller Clay/K2-SSOT bindend.
- **Bisher keine inhaltliche Pixelprüfung durch diesen Chat und kein erzeugtes Bild**. Dropbox Preview-Metadaten sind verfügbar, aber keine Bildgen-Konditionierung mit echten Quelldateien nachgewiesen. Kein `picked`, kein `goldenRef`.
- Georg: „@Dropbox da liegen in kfb style referenzen alle vorlagen“ (wörtliche Quellenanweisung).

## R2 · Quellenvergleich / 2026-10-10
- Native Dropbox-Metadaten der bezahlten Originaldateien geprüft: Port `Floting Base.fbx` 300.044 Byte, Backyard `Backyard Base.fbx` 47.996 Byte. Keine Assets ins Repo übertragen.
- [Quantitative R2-Vergleichsdaten](G1_TOWN_SOURCE_COMPARISON_R2.json): Port 1.585 Dreiecke / 6 Unterseiten-Tiefpunkte / Tiefe 0,434 W; Backyard 700 / 22 / 0,506 W. Historische Messung, **keine** neuen isolierten 3D-Renders und keine native K2-BBox.
- [R2-Runbook für vorhandenen lokalen Lab-Viewer](G1_TOWN_SOURCE_ISOLATION_RUNBOOK_R2.md): temporäre Sichtbarkeits-/Kamera-Diagnose am bestehenden `originals.ts`, acht Ansichten über bestehendes `shoot.mjs`. Nicht ausgeführt, keine zweite Runtime.
- [R2 Testbericht](TEST_REPORT_G1_R2.md): **13/13 statische Quellenprüfungen PASS**; ursprüngliche **18/18** G1-Inventurprüfungen bleiben PASS. Visuelle Source-Isolation **0/8**, native K2 bbox **0/2**; kompletter Bildbeweis OFFEN.
- Historischer `orig.json` im lokalen Lab belegt einen früheren Ladevorgang, aber keinen Port/Backyard-Vieransichten-Vergleich. Ursprünglicher Viewer legt dieselbe Port-Textur auf alle Basen: Farbvergleich damit nicht belegt.
- Container-Grenze: verfügbare private Original-FBX-Binärdateien konnten ohne externes DNS nicht in die aktuelle Render-Umgebung geladen werden; kein fingierter Visual-PASS.
- **Georg:** bisher keine G1-Auswahl, keine GoldenRef, kein neues Gate für Georg ohne echte Voransichten.

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

## Prüfprotokoll
- [G1 Testbericht · 18/18 statische Checks PASS](https://github.com/georg-doc/kayfabizarro/blob/planning/kfb-mvp1-asset-candidates-2026-10-10/tools/KFB-ToolBox/_inbox/MVP1_RETURNS/G_asset_candidates/TEST_REPORT_G1.md); 16/16 Repo-Registry-Pfade mit Shard gegengeprüft; 13 Kandidaten nur als gekaufte Privat-Quellen benannt.
- Quell-Einzelansichten: **0**, native H-BBox-Messungen: **0**, GoldenRefs: **0**. Kein Visual- oder Product-PASS.
- Quelleninventur und Testbericht wurden vom G1-Schreiber erstellt; unabhängige visuelle Abnahme steht aus.

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
**G1-Full-Res-Originale tatsächlich bei GitHub archivieren:** Die drei PNGs aus `KFB_MVP1_G1_Concept_Images_2026-10-10.zip` über eine berechtigte GUI-/Work-Binär-Upload-Umgebung auf `planning/kfb-mvp1-asset-candidates-2026-10-10` an die im [Bildregister](G1_RENDERED_CONCEPTS_R1.json) benannten Pfade übernehmen. Danach exakten Branch-Head und alle drei SHA256 gegen das ZIP prüfen und [Bildregister](G1_RENDERED_CONCEPTS_R1.json), Recovery, Return, Changelog aktualisieren. Bis dahin Upload `BLOCKED`, vorhandene WebP 3/3 `PUSHED`. G1-Rock-Source-Evidence ist gesichert; Bildgenerator-Brücke bleibt in Quarantäne. Kein GitHub-PR-Merge, keine Site-/Stage-Promotion.
