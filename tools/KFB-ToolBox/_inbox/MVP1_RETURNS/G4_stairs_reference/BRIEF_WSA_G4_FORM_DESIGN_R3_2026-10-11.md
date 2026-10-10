# BRIEF · WSA Work · G4 Burgtreppe — FORM-DESIGN R3 (nicht R2-Tuning)
**Ausgabe 2026-10-11 · Georg beauftragt ausdrücklich einen neuen, formorientierten G4-Design-Slice.**

**Auftrag:** Ein neuer, tatsächlich **als handgebaute KFB-Steinarchitektur lesbarer** Treppenentwurf für die Burg in KFB Town. Technische WSA R1/R2-Stufenfunktion erhalten, aber ihre sichtbare Formsprache **bewusst neu gestalten**. Das ist **kein** weiterer Material-, Bevel-, Noise- oder Shader-Pass über die bisherigen monolithischen Wangen.

**Produkt-/Geometrie-Owner:** bisherige WSA-Treppen-Modellierung innerhalb des KFB Island Worldbuilder Lab. Nur **ein** WSA-Builder schreibt einen neuen Designkandidaten; kein neuer WorldBuilder, zweite Runtime oder Asset-Registry.  
**Repo:** `georg-doc/kayfabizarro`. **Execution base:** `wsa/kfb-modelling-test-stairs-2026-10-10@52099710569a98393325ee94becf616f418b35f2` (enthält technische R1 und Tune R2). **Neuer Kandidatenbranch für WSA:** `wsa/kfb-g4-stairs-form-design-r3-2026-10-11`, *erst bei tatsächlichem Work-Start anlegen*; keine Änderungen an R1/R2.  
**Handoff/Referenz-Owner:** `planning/kfb-g4-stairs-reference-2026-10-10` mit `RECOVERY_G4.md` / diesem Brief. Keine ungefragte Aktualisierung zentraler Router, Hub oder Cloudflare. **Stage/Site:** nicht erforderlich für isolierte Blender-GLB-Kandidaten; nicht als Live bezeichnen.  
**Mode:** BOUNDED_SLICE; 1 Kandidat (allenfalls 2 sehr frühe Form-Richtungen, bevor die eine weitergebaut wird), max. 2 *nicht verbessernde* Reparaturpässe je failing seam, dann exportieren, nicht weiterglätten.  
**Human gate:** Georg entscheidet `A / B / FAIL` über die erkennbare **Formensprache** anhand echter Screenshots, nicht anhand von Messwerten. Kein Auto-Golden, kein Auto-Merge/Live.

## 0 · Neuester Quellenstand: R2 existiert und darf nicht übersehen werden

**Technikdonor R1**, unverändert und für andere Kontexte verwendbar:
`WSA_modelling_test/KFB_TOWN_CASTLE_CLAY_STAIRS_R1.glb` · source SHA256 `5dc83f19beb8b8ba6b20b3b7ae1d19c6a39b8b80045cda14376ae462e4729151` · fünf Meshes, 4.568 Dreiecke, 8 Stufen, Breite 10,92 Lab = 3 H, Podest 4 Lab, Y-up.

**Technikdonor R2 (R1 NICHT ersetzen):** `WSA_modelling_test/TUNE_R2/KFB_TOWN_CASTLE_CLAY_STAIRS_R2.glb` · SHA256 `82a20339c39e6e93a71a389dbb39978b7362b562e52999d90539039b131ebb28` · gleicher fünf-Mesh-Aufbau und 4.568 Dreiecke. Die beiden vorderen Körper wurden zu höheren, breiten Endkörpern verändert. Oberkante über angrenzender Wange am Treppenfuß: links +0,84 Lab, rechts +0,72 Lab. R2-Renders nutzen eine **prozedurale Materialprobe**, die laut `TUNE_REPORT_R2.md` **nicht als Textur im GLB gebacken** ist; Runtime-Materialien bleiben Family A. Q1/Q3/Q4/Q5/Q6/Q7/Q9 technische Eigenprüfung PASS, Q2/Q8 N/A. Externer Kritiker und Georgs Formabnahme sind **nicht** als PASS belegt.

**Pflicht-Vergleichsbilder, tatsächlich auf Source-Branch vorhanden:**
- `TUNE_R2/comparisons/02_three_quarter_top_R1-left_R2-right.jpg` — gleicher Kameraausschnitt, echte R1/R2-Formen
- `TUNE_R2/comparisons/01_frontal_R1-left_R2-right.jpg`
- `renders/02_three_quarter_top.jpg`, `renders/05_connection_stair_hill.jpg`
- `TUNE_R2/renders/02_three_quarter_top.jpg` und `01_frontal.jpg`
- vier Donoren in `source_lineup.jpg`; siehe `SOURCE_FIRST.md`.

**Visuelles Ausgangsurteil Georg (2026-10-11):** R1/R2 sind als alternative Gebrauchstreppe eventuell brauchbar; für die Burgtreppe „von unseren Designs keine Spur“, außer den von Georg vorgeschlagenen **Abschluss-Säulen**, die bislang falsch interpretiert wurden. Im sichtbaren R1→R2-Vergleich wurden niedrige Knubbel zu **höheren Knubbeln**; dies erfüllt zwar die R2-Höhenhierarchie, **noch nicht** die architektonische Designidee.

## 1 · Der entscheidende Fehler, den R3 beheben MUSS

R1/R2-Blender-Aufbau erstellt die Treppe als durchgehend extrudiertes Stufenprofil, zwei durchgehend extrudierte Wangenkeile, zwei aus Polygonringen geformte Körper (`organic_buttress`). Variationen kommen weitgehend von Bevel + `clay_warp` (kleine Sinusverschiebungen). Das ergibt `5 Meshes`, aber keine gebaut lesbare Steinarchitektur.

**Verbindliche semantische Korrektur:** „maximal 5–6 große **Formfamilien/Baukasten-Rollen**“ aus Brief §7a ist **NICHT** „maximal 5–6 Mesh-Objekte“ oder „alles monolithisch“. Eine Familie kann mehrfach und differenziert verwendet werden; beim Export kann sie aus mehreren Meshes bestehen, sofern Tri-/Performance-/Collision-Grenzen eingehalten sind. **Nicht** die Formvielfalt künstlich auf fünf extrudierte Blöcke reduzieren. Aber auch keine dutzenden kleinteiligen Raster-Klötzchen generieren.

**Wichtig:** Ein Shader oder Fingerabdruck verändert eine Betonkeil-Silhouette **nicht** in eine gebaute Wangenmauer. R3 muss sichtbare **Architekturanatomie** ändern und das ausdrücklich belegen.

## 2 · Zielbild: wirklich gebaute KFB-Burgtreppe

Behalte **acht breit begehbare Trittfolgen und das obere Zielpodest**. Entwirf sichtbar handgeformte, dicke, ruhige Cartoon-Steine und die Beziehung zueinander. Nicht historisch-fotorealistische mittelalterliche Fugen, sondern ein kompakter DIY/Stop-Motion-Steinbau mit bewusst modellierten Übergängen.

**A. Tritte und Lauf:** breite, einzeln **lesbare** Auftritte mit absichtlich leicht ungleichen, gerundeten Vorderkanten. Die **Lauffläche** bleibt durchgehend begehbar und relativ flach; kein übertriebenes Buckeln, Stolperfallen, diagonale Überhänge oder schwebende Tritte. Acht Stufen *sichtbar abzählbar*; Höhe, Breite und Podest bleiben funktional an R1/R2 orientiert.

**B. Wangenmauern:** nicht zwei homogene dreieckige Platten. Wenige große **handgebaute Segmentvolumen**, klarer Sockel-/Tragebereich, ruhige lesbare Steinbindung und ein **kräftiger gerundeter Abschluss/Kronstein-Verlauf**. Die Silhouette entlang der Treppe darf bewusst rhythmisch und unregelmäßig sein, ohne repetitives Raster. Enden geschlossen, Fugen sinnvoll, kein geisterhaft leerer Hohlraum.

**C. Georgs Abschluss-Säulen/Pfeiler:** *wirkliche, freistehend lesbare architektonische Abschlusskörper* am Treppenfuß links/rechts. In der ersten Silhouettenstudie klar unterscheidbar: **Fuß/Sockel**, **gedrungener Schaft**, **prägnanter gerundeter Deckstein/Kapitell-Abschluss**. Dies sind sichtbare Zonen **einer Pfeiler-Familie**, nicht drei neue zufällige Props. Kein unbearbeiteter Klumpen, keine Laterne, kein Torpfosten mit Logo. R2-Proportion (höher als Wangenkante) als Untergrenze der Lesbarkeit, tatsächliche Gestaltung anhand KFB-Vorlage statt blindem Zahlenzwang. Geringe asymmetrische Handform erlaubt, aber keine zwei unverbundenen Steine.

**D. Obere Anschlüsse:** Wangen bekommen einen **geplanten oberen Abschluss** und berühren das Podest sinnvoll; Podest ist der sichtbare Zielpunkt (Tür/Burg nicht als zusätzlicher Render-Prop erforderlich). Kein freies Rampenende.

**E. Hang-/Terrassenanschluss:** Sichtbarer baulicher Grund für Treppe: Wangen/Fußkörper **im Schollenhang verankert**, Erde/Fels folgt der Konstruktion, Kontaktfuge weich. Als **Kontextbeweis** einen minimalen echten Hang-Donor verwenden, keinen dekorativen Fake-Sockel; Quelle und Modell-Owner dokumentieren. Isoliertes GLB bleibt ohne gekaufte Fremd-Assets.

## 3 · Maximal sechs Formfamilien, nicht sechs sichtbare Meshes

Formfamilienvorschlag — **als Gestaltungsvorschlag, kein neuer globaler Canon**:

| Familie | Lesbarer Zweck | Arten/Varianten |
|---|---|---|
| 1 · Tritt-/Setzstein | Begehbare, dicke Stufe | 8 Instanzen/Abschnitte mit leichten Unterschieden |
| 2 · Wangen-Tragstein | Große, in Boden eingebaute seitliche Steinmasse | 2 Seiten mit wenigen großen Volumenabschnitten |
| 3 · Kron-/Deckstein | Lesbarer weicher Abschluss entlang Wange | große, nicht identische Abschlussstücke |
| 4 · Abschluss-Pfeiler | Sockel–Schaft–Deckstein als sichtbare Anatomie | 2 Abschlusskörper, 1 Typ mit Varianten |
| 5 · Podest-/Endstein | oberer Zugang, Abschlüsse | 1 Podest/Anschlussfamilie |
| 6 · Hanganschlussstein | gebaute Kontakt-/Widerlagerzone | nur dort, wo realer Erd-/Felskontakt |

`PARTS_R3.md`: je Familie Zweck, Form, ungefähre H-Maße oder `UNMEASURED`, Farbrolle, tatsächliche Anzahl, Source-/Donor-Abstammung, Stellen der sichtbaren Kontaktkanten; eine "Familie" ist kein zwingendes GLB-Meshlimit. Optional mit weniger Familien auskommen, wenn sie klar lesbar sind.

**Material:** KFB Family A `#e6d4b5 / #d1ba99 / #b29c7d / #9e856b`; KFB Clay Surface Canon, Golden benchmark und ggf. wenige große Moosstücke nur kontextgerecht. Farbverteilung unterstützt verschiedene Gebauteile; Farbe/Normalmap allein darf **keinen** fehlenden Steinverband simulieren. Kein generisches CAD, glatt gepresstes Rampenprofil, Pixel-/Voxel oder photorealistische Splitter. **Keine ungefragten Laternen, Werbeschilder, Pflanzenflut, Figuren/Fahrzeuge.**

## 4 · Vorlagen-Pflicht und Design-Checkpoints

**Priorität Formquellen:**
1. tatsächlicher WSA R1/R2 Donor isoliert samt beiden R1/R2-Bildvergleichen (Funktion/Proportion, **nicht** Form-Golden);
2. echte originale KayKit `stairs_walled.gltf`, `stairs_wide.gltf`; Kenney `stairs-stone.glb`, `wall-narrow-stairs.glb` (Bereich/Tragverhältnis);
3. echte `G4_stone_bridge_sheet_webchat_r1.webp` **nur STYLE_DIRECTION_ONLY**, niemals Beweis für Treppengeometrie;
4. die zwei bisherigen Webchat-KFB-Treppenbilder **nur Mood/Steinmaterial**, aufgrund Laternen, Branding, zusätzlicher Steine *nicht* geometrisch kopieren;
5. `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` als verbindliche Oberflächenquelle, Style Router und Open World Styleguide als Benchmarks.

**0A Quelle vor Umbau:** zeige die echten Donor-Objekte **einzeln** und die R1/R2-Treppe unverändert in identischen 3/4/Front/Seite-Aufnahmen. Asset-URL allein oder Importmeldung ≠ gesehener Source-Donor.

**0B Silhouetten-Proof VOR KFB-Material:** in neutralem untexturierten Grau/Zweiton **eine konkrete neue R3-Konstruktion** rendern; mind. 3/4, Front, Seite und Nahaufnahme Pfeiler+Wangen-/Stufenkontakt. Ohne Licht-/Marketingeffekte muss man "handgebaute Steinarchitektur" gegen "monolithischer Betonkeil" **sofort** unterscheiden können. Wenn die Silhouette immer noch Rampenkeil + Knubbel ist, **Form-Gate FAIL**: keine Materialablenkung oder Shader-Reparatur.

**0C Erst nach Formenbeleg:** KFB-Farben + gebundene leichte Knetoberfläche und kontrollierter Materialmix; eigenes Vorher/Nachher derselben R3-Geometrie. Kein ImageGen-Marketingblatt als Source-Renderersatz. Wenn Materialerzeugung (z. B. gebackene Textur) an einem optionalen Seam erneut scheitert: einfrieren/exportieren und Form-Slice fortsetzen, sofern Form nachweisbar.

## 5 · Grenzen: Technik erhalten, sichtbare Form ausdrücklich ändern

- **R1/R2 nicht überschreiben**. Als nutzbare alternative technische Basis in Ruhe lassen.
- Zielgröße für R3: weiterhin ca. **3 H lichte Breite**, 1 H = 3,64 Lab; acht begehbare Stufen, oberes Podest. Orientierungswerte R2: Steigung 0,59–0,68 Lab, Mindest-Auftritt 1,6024 Lab, Podesttiefe 4,00 Lab. `≤20k` Dreiecke pro tatsächlichem Bauteil, y-up/GLB, keine Kamera/Lichter ins Export.
- Es ist **ausdrücklich erlaubt und verlangt**, für R3 sichtbare Konstruktionsvolumen **neu zu modellieren und Meshanzahl/Topologie zu ändern**. Der alte `5/5 same mesh identities`-Gate aus R2 gehört **nur zur R2-Reparatur**, nicht zur R3-Neugestaltung. Anzahl Formfamilien ≤6 bleibt. Validierung von Funktion und Kontakt gegen technische R1/R2-Donors vornehmen.
- Keine künstliche "Stufe aus 20 copy-paste Boxen": Differenzierung beabsichtigt, sinnvolle Mauerfolge, kein Raster.
- Eine **optisch isolierte** 3D-Abnahme enthält keine dekorative Burg, Laterne, zufällige Natur, Branding oder zusätzliche Schauspieler. Hanganschluss in getrennter Quelle-gebundener Kontextansicht.
- Wenn eine maßgebende Formreferenz nur als Chat-ZIP vorliegt und Work keinen tatsächlichen Bild-Byte-Zugriff hat, `SOURCE_REQUIRED` dokumentieren und **keinen** donor-exakten visuellen Vergleich vortäuschen. Technische WSA/KayKit/Kenney-Donors sind auf GitHub.
- Keine zweite Integrationsruntime, kein WorldBuilder-Commit/Hub/Cloudflare ohne Routing-Änderung.

## 6 · Liefergegenstände auf neuem WSA-Kandidatenbranch

`tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_modelling_test/FORM_R3/`:
- `REFERENCE_LOCK_R3.md`: exakte Baseline R2 HEAD/SHA + R1, Referenzbilder/Bytes, Style-vs-Form-Kategorien, tatsächliches `SOURCE_ISOLATED`-Bild.
- `FORM_DESIGN_R3.md`: **was geändert wird** (Stufen, Wangen, architektonische Abschluss-Säulen, obere Abschlüsse, Hangkontakt), Variantenentscheid/-verwerfung; sichtbare Form-Gegenüberstellung R2 vs R3 vor Textur.
- `PARTS_R3.md` und `FORM_GRAMMAR_R3.json` (≤6 Familien, Instancecounts, Relation `foot/shaft/cap`, Ober/Unter-Stützen).
- `KFB_TOWN_CASTLE_STAIRS_FORM_R3.glb` **nur falls echter isolierter Form- und technischer Modell-Check vorhanden**, andernfalls Candidate+failure pack, keine Fake-GLB.
- `renders/source/*` echte R1/R2/KayKit/Kenney isolierte Proofs (nur eigene/CC0-Dateien; keine gekauften Fremdassets umverteilen).
- `renders/form_gray/{front,three_quarter,side,pedestal_detail}.jpg`; **dieser Satz vor Clay/Material**.
- `renders/kfb_clay/{front,three_quarter,side,foot_eye,hill_connection}.jpg`, konsistente 1600×1000 oder begründet gleichwertig.
- `comparisons/{R2_vs_R3_gray,R2_vs_R3_KFB,real_source_vs_candidate}.jpg` mit **identischer Kamera**, davor/nachher klar beschriftet (nur QA-Bildlabels erlaubt).
- `qcheck_r3.json` (Q1–Q9 + echte Treppenbegehbarkeit/Anschluss + Formfamilien != Meshes; keine N/A-Flucht für jetzt sichtbaren Steinverband), `export_validation_r3.json`, `TEST_REPORT_R3.md`, `FAILURE_RECOVERY_R3.md` falls fail.
- `RETURN_R3.md` mit tatsächlichen Testzahlen, Head, Quellenpfaden, offenem Georg-Form-Gate.

## 7 · Unabhängige Qualitätsgrenzen (Test ≠ kritisches Urteil)

**Technischer Test:** tatsächliches GLB, Riser/Run, Kollisions-/Begehbarkeit, Wandanschluss, Schwerkraft/Standfestigkeit und GLB clean-scene reimport; Q1–Q9 pro Art, Format und ≤20k-Tris. Mathematik allein kein visueller Form-PASS.

**Form-Kritiker (INDEPENDENT):** mindestens die sieben Kriterien getrennt von Work-Builder scoren:
1. Stufen als gebaute, in KFB-Knetstein verständliche Bauform;
2. sichtbare Wangen **als Architektur**, nicht CAD-Keile;
3. zwei Abschluss-Säulen **mit Fuß/Schaft/Deckstein**, kein Klecks;
4. sinnvolle obere Beendigung/Podest;
5. tatsächlicher Kontakt/Einbettung in Hang/Erde;
6. KFB Cartoon/handgebautes Diorama, bewusst ruhig und nicht repetitiv;
7. Original- und Funktionstreue: acht Stufen, 3 H, begehbar, Quelle klar nachweisbar.

Scoring **0–10 je Kriterium**, Ziel Mittel ≥8, **kein einzelner Wert <6** (aus R1-WSA-Originalbrief). Sowohl *sichtbare unabhängige Kritik* als auch Georgs **A/B/FAIL** bleiben nötig vor `GOLDEN`. Falls das Ergebnis als anderer Kontext geeignet ist, getrennt archivieren und nicht rückwirkend als "G4-Burgtreppe PASS" deklarieren.

**Stop/Repair:** nach zwei nichtverbessernden Reparaturen desselben Formfehlers den kleinsten failing seam einfrieren, sämtliche Render/Model/Tests/Quellen in Failure Recovery exportieren, **nicht** R1/R2 zerstören. Die Production Guard entscheidet anhand Zielrelevanz über QUARANTINE/CONTINUE/STOP; ein formkritischer Mangel darf nicht mit "5 Meshes/Q-PASS" vertuscht werden. Optionaler Material-/PNG-Exportfehler blockiert nicht automatisch erfolgreich bewiesene Form.

## 8 · Conditional learning → bestehendes Plugin (erst NACH R3-Ergebnis)

**Plugin-Owner:** bereits vorhandenes PRIVATES `KFB Asset Scene Composer` v0.1.0, ID `plugins_6acaa1b6b0688191b66448db92767870`; bestehender Release `pluginrel_6acaa1b7ec308191bd98300be692e9d1` nur als ursprünglicher Orientierungspunkt; vor Änderungen den **aktuellen** Release/Dateien live abrufen. Keine zweite Plugin-ID, kein Update des separaten Texture-Queue-Plugins, keine zweite Site.

**Beim tatsächlichen R3 FORM_PASS** (nach unabhängiger Critic Evidence; Georg für Golden separat):
- Update **nur** der relevanten Plugin-Skill/Jobcontract-Anweisungen (ausführliche Resultatquelle im `RETURN_R3`):
  - neues verpflichtendes `formGrammar`-Konzept (≤6 **repeatable design roles**, nicht `meshCount<=6`);
  - `formAnatomy` + `constructionContacts` + `formBeforeMaterials` Evidenz;
  - `architecturalTermination` (Pfeiler: Fuß/Schaft/Deckstein) **nur für solche Bauteilklassen**, keine globale Pflicht für sämtliche Props;
  - vergleichendes `source_model → neutral-form proof → styled-result`, getrennte `geometryScore` und `styleScore`, Human Golden;
  - Erfolg mit **realen R3-Aufnahmen** und exakten Quellenpfaden belegen.
- Plugin semver moderat erhöhen (v0.1.1 oder verifiziert höhere), `update_plugin` guarded mit neuestem `expected_release_id`; Release danach erneut lesen und skill contract PASS prüfen.

**Bei tatsächlichem R3 FORM_FAIL**:
- Nicht das fehlgeschlagene Design als Bauanleitung verankern! Stattdessen failure-mode / routing rules zur Skill ergänzen: `continuous_extrusion_wedge`, `blob_pillar_not_column`, `bevel_noise_not_construction`, fehlender `source_isolation` oder `contact_logic` **nur wenn im Report nachgewiesen**.
- Plugin fordert künftig einen **neutralen sichtbaren Form-Beleg vor jeder Clay-Stilisierung** bei architektonischer Konstruktion und das explizite Fail-Result; keine erdachten Stellschrauben/Kanon-Verbote.
- Plugin mit **FAILURE_RECOVERY_R3.md** als begrenztes Beispiel aktualisieren; keine Style-Golden/Asset-Golden Statusfelder setzen. Auch hier Guarded Plugin-Update+Release-Readback.

**Bei UNDECIDED / nur Builder-Self-PASS / kein unabhängiger Kritiker:** **KEIN Plugin-Update**, `PLUGIN_UPDATE_PENDING_EVIDENCE` protokollieren und warten. Keine Automatik über unbestätigte Formqualität, kein neuer Plugin-Copy.

Vor jedem Plugin-Update: aktuelle Dateien und Release-ID über Plugin Creator lesen, nur additive Skill/Referenz-Änderungen, keine funktionierenden Werkzeuge ersetzen. Work darf die Plugin-Mutation im selben R3-Outcome-Slice nur mit zugänglichem Plugin Creator und Berechtigung durchführen; andernfalls **exakt diff/ZIP + Ziel-Release-ID** in `PLUGIN_UPDATE_HANDOFF_R3.md` persistieren, der nächste Plugin-fähige Executor übernimmt. Nach Mutation Plugin-ID/Version/Release/Dateien-Readback sowie Plugin-Return und ursprüngliches R3-Return aktualisieren. **Keine behauptete erfolgte Plugin-Aktualisierung bevor das Tool erfolgreich meldet.**

## 9 · Rollen und Ablauf

- **Builder/Integrator:** WSA Work — einziger produktiver Writer des neuen Kandidats.
- **Integration Tester:** getrennte technische Tests/Q und referenzbasierte Source-/Render-Evidenz.
- **Independent Critic:** bewertet **sichtbare gebaute Form**, liefert scorecard, darf nicht die Geometrie verändern.
- **Production Guard:** einzig CONTINUE/REPAIR/QUARANTINE/HUMAN_DECISION/STOP (vgl. `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`).
- **Georg:** Gestaltungs-/Golden-Gate `A / B / FAIL`; keine automatische Promotion.

Checkpoints: kohärenter Form-Kandidat, tatsächliche Tech+Bild-Evidenz, **dann** R3 Return/Additive Changelog/conditional Plugin-Delta. Nach jedem GitHub Write exakt Branch-Head und intendierte Dateien erneut holen. Timeout = UNKNOWN, erst Repo-Ref prüfen. Nach zwei nichtverbessernden Korrekturversuchen kleinste Seam einfrieren, Failure-Export, Parent nur bei Guard-Relevanz stoppen. **Keine auto-merge oder Live-Promotion.**

## Genau ein nächster Gate für WSA
**R3-G0: isolierte Quellen und eine unverwechselbare neutrale 3/4-Formsilhouette** (mit architektonisch lesbaren Wangen und zwei richtigen Abschluss-Pfeilern: Sockel/Schaft/Deckstein) auf dem neuen Kandidatenbranch zeigen, bevor Material- oder Shaderarbeit beginnt. Erst dann die restlichen Schritte desselben bounded Slice ausführen.
