# WS1_STATUS · R3F-Spielrahmen (Branch `ws1/r3f-frame`)

Stand: 14.10.2026, WS1 (Claude Code auf Georgs Mac). Empfänger: WS0. Regeln: Host-Vertrag R1.2, `KFB_WORKING_RULES_R1.md`, V-209, V-212, V-213.
Neueste Einträge oben (§17 ist der neueste). WS0 antwortet im Register-Branch `docs/kfb-decisions-register-2026-10-11`.

## 17 · 14.10. abends · FrizzleBob nach Georgs Export fertig (V-240) · Briefing M1 „Bewegung“ eingegangen · G0 M1 beginnt · gelesen bis V-242

### 17.1 · V-240 umgesetzt (G2)
- **Eintrag 1:1:** `src/data/actors/frizzlebob.georg-2026-10-14.kfb-pets.json` (aus `replies/actors/`, Blob `aab8eeb0`), 134 Felder angewendet, **0 abgelehnt**. Keine eigenen Werte.
- **Figur v5b:** `FB_TEMPLATE_LOOK_v5b.glb` @23615cff (Blob 24134a51). Rezept `frizzlebob-v5b.recipe.json`; v5-Teile (GLB, Rezept, P06-Bauteile) entfernt.
- **Bauteile der P08-Linie** (ToolBox Production-08, Cut 01.10. r1, main @ac9dbaed): face-mount `5424bff3`, clay-lids `d7cea2ae` (aus, `clayLids.on false`), ear-dangle `d7ad94a2`, contact-ao `61e3121f`. Eye-Rig-Lider.
- **Abnahme-Bildpaar ToolBox P08 | Spiel**, gleiche Kamera, **Bindepose** (A1: ToolBox zeigt sonst Idle_A), Augen- und Brauen-Leben für das Bild aus:
  - mittlere Abweichung **vorn 1,4 · ¾ 1,3 · Seite 0,8 /255**;
  - Mund sitzt in ¾ am Kopf (Befund A7 erledigt);
  - Beleg: `ws1/proofs/2026-10-14-fb-v240/fb_georg_pair_front_q_side.png`, Unterschiedskarten `fb_georg_diffmaps.png`, Lidschlag `fb_georg_blink.png`, Bühne mit D1 `fb_stage_d1.png`.
- **Brauen/Nase:** Farben aus dem Export (`brow.color`, `nose.color`), `original.brows.lift` 0,242 wie im Export (A5).
- **Bühne:** `#stage,actors=fb` stellt FrizzleBob in den Darsteller-Slot; D1 läuft unverändert, nur die Rezept-Datei wechselt.
- **Blinder Prüfer 9: PASS MIT AUFLAGEN**, abgearbeitet:
  - Ladeweg = `mountFace` mit Georgs Eintrag (wie P08 nach dem Neuladen), nicht der Einmal-Weg `rigImport`; im Bild ohne Unterschied.
  - Schatten wie P08 Z. 1901–1903: Ohren werfen nicht, Gesicht `shadowOff`, Mund empfängt nicht; Kontaktschatten vor den Haaren angelegt.
  - `loadReport` erst nach erfolgreichem Laden.
  - Bühne nimmt nur bekannte `actors`-Werte (unbekannt → keine Figuren).
  - **Modulstände offengelegt** (`moduleDeviations` im Rezept):
    - Georgs Export stammt aus einer **neueren** ToolBox als jeder Cut im Repo (Knet-Lid-Felder `mech 'skin'`, `skinFrame`, `flap02` …). Ohne Wirkung, weil die Knet-Lider aus sind.
    - Der Export nennt ear-dangle @19088b14; gebaut gegen `d7ad94a2` wie P08, das ohne die neuen Felder bit-gleich rechnet.
    - Kontaktschatten wird in der Bindepose gebacken (P08: in der Pose-Rig-Haltung); sichtbar nur an den Schultern.
  - **Vollständige Befundliste Prüfer 9** (7 Befunde, nachgetragen von der Sitzung, die V-240 gebaut hat):
    1. Modulstände nicht benannt → `moduleDeviations` im Rezept (siehe oben).
    2. Brauen-Leben lief bei den Aufnahmen weiter (Brauen nicht prüfbar, nicht wiederholbar) → Brauen-Leben auf beiden Seiten aus, Referenzen neu.
    3. Kontaktschatten wich ab (Haare als Empfänger, Backen während der Clip anlief) → vor den Haaren angelegt, Clip startet erst nach dem Backen; Rest-Abweichung Bindepose ↔ Pose-Rig benannt.
    4. Schattenwurf fehlte (FrizzleBob warf auf der Bühne keinen Schatten) → wie P08 Z. 1901–1903.
    5. Ladeweg falsch benannt → korrigiert.
    6. Test teils leer → genau 134 Felder, Haare/Lider/Ohren und Lage der Ohr-Basisknochen zahlenmäßig gegen den Spender, Obergrenze stark abweichender Pixel (Mittel < 3/255).
    7. Unbekannter `actors`-Wert lud still die Platzhalter → jetzt keine Figuren.
  - **Hinweis Arbeitsweise:** Am 14.10. abends arbeiteten kurz zwei Claude-Sitzungen in denselben Ordnern. Die zweite (Briefing M1) hat den uncommitteten V-240-Stand übernommen und gepusht. Inhaltlich ist er vollständig (Branch = Stand der bauenden Sitzung, geprüft). Ab jetzt arbeitet die M1-Sitzung nur in einem eigenen Worktree auf Branch `m1/bewegung`; `ws1/r3f-frame` und `WS1_STATUS` führt eine Sitzung.
- **Tests: alle 14 grün.** `s5c` war unter paralleler Last wackelig (zwei Sitzungen testeten gleichzeitig). Die Wahl der eigenen Wörter wird jetzt über das Ereignis abgewartet (bis 15 s, Polling 100 ms) statt fester Zeit; 3 von 3 grün. An der Logik ändert sich nichts.

### 17.2 · Briefing M1 „Bewegung mit FrizzleBob v5b“ (Web-Chat, Ausgang Georg)
- Georg hat das Briefing direkt an WS1 gegeben. Damit er nicht Bote spielen muss (V-213), liegt es jetzt hier: **`ws1/briefs/BRIEF_WS1_M1_BEWEGUNG_R1.md`** (SHA-256 `249858c2…`).
- **Bitte WS0:** V-Nummer vergeben, ins Register übernehmen und den Auftrag bestätigen bzw. korrigieren.
- **Vorlagen-Abgleich gegen `DECISIONS.md` (V-214):** Mir ist kein Widerspruch aufgefallen. Das Briefing hält ein: V-194 (kein Hex), V-206 (ein Ladeweg, derselbe Darsteller-Slot), V-216 (KayKit-Barbar `hero.glb` raus), V-210 (Racetrack ruht), V-230 (Amphitheater Browser-Fassung v1), V-240 (Figur), V-228 (Claude Design nur Bild).
- **WS1 beginnt jetzt mit G0 M1** (nur prüfen, kein Bau): Skelett v5b ↔ LOCO-Clips (Rig_Medium), Fußtest, Flug-Clip, Kinetik. Ergebnis kommt als §18. Ist v5b nicht retargetbar, stoppt WS1 und meldet es hier.
- Das Bauen (Controller, Welt, Kamera) beginnt erst nach eurer Bestätigung oder, wenn ihr bis dahin nichts einwendet, nach G0 PASS.

## 16 · 14.10. spät · Amphitheater spieltauglich (V-230) · Bühne · D1 Dialog-Mechanik (FrizzleBob weiter gestoppt)

### 16.1 · Browser-Fassung des Meshy-Amphitheaters (G2)
- **Datei:** `media/3D_Assets/MeshyModels/browser/kfb-stage-amphitheater-meshy.browser.v1.glb`, **11,7 MB**, SHA-256 `3f79037e…`, Commit `829d551d`.
  - Der Commit trägt den Tag **`asset/amph-browser-v1`**, damit die gepinnte Adresse auch nach einem Rebase erreichbar bleibt.
  - Daneben liegt `…v1.SOURCE.json` mit Herkunft und Rezept.
- **Vorgabe WS0 erfüllt:**
  - **348.738 Dreiecke** (Master 1,62 Mio.);
  - Farbe und Normalen 2048² WebP, Metall/Rau 1024² WebP (`EXT_texture_webp`, vom Browser dekodiert);
  - kein KTX2, keine Meshopt-Kompression.
  - Werkzeug: `@gltf-transform` 4.5.1, meshoptimizer 1.1.1 und sharp 0.35.5, **exakt gepinnte Dev-Abhängigkeiten**, nur im Skript `scripts/amph/build-browser.mjs`.
  - Der Neubau aus dem Master ist **bytegleich** (reproduzierbar).
- **Befund beim Bau:** Die Standard-Vereinfachung wertet nur Positionen. Dabei passten die gebackene Normalen-Textur und die gröberen Flächen nicht mehr zusammen, es entstanden dunkle Schlieren auf den Sitzreihen.
  - Lösung: meshoptimizer `simplifyWithAttributes` mit Normalen und UV (Gewicht 2/2). Die Schlieren sind weg (Nahansicht 4,5 → 2,4/255).
  - Die restliche Weichheit am Boden kommt von der vorgegebenen Farbtextur 2048².
- **Abnahme:** Bildpaar Master | Browser aus den Kameras der Quell-Isolation, 9 Ansichten, mittlere Abweichung **1,3–3,7/255**.
  - **Bildzeit (M4, wie in der Tabelle): 7,5 → 3,6 ms**, Ladezeit 289 → 73 ms.
  - Beleg: `ws1/proofs/2026-10-14-amph/` (`amph_master_vs_browser_v1.jpg`, `pair-report.json`, `build-report.json`).
- **Asset Librarian: eine Kennung** `private:meshy-claymation-amphitheater-master` in `tools/asset_registry/librarian/live/private-asset-live.json`.
  - Erzeugt mit dem eigenen Werkzeug `private_projection.py project`, geprüft mit `validate-live` → OK.
  - Inhalt: Master in Georgs Dropbox (SHA-256 `11846848…`, 73 MB); `delivery.runtimeUrl` zeigt auf die Browser-Fassung, dazu `runtimeVariant`/`runtimeSha256`/`runtimeBytes`/`runtimeTag`.
  - **Bitte WS0 bzw. Librarian-Owner:** Die vier `runtime*`-Felder sind eine Erweiterung des Projektionsformats. Bitte annehmen oder ein anderes Format vorgeben.
  - Hinweis: Das Repo ist öffentlich. Damit ist die Browser-Fassung öffentlich, das Master nicht. Die Lizenzprüfung steht im Eintrag als offen.

### 16.2 · Bühne `#stage` (Vorbereitung G4)
- **Modul `amphitheater`** (create/update/dispose):
  - Es lädt die Browser-Fassung über die gepinnte Adresse und bettet sie nicht in den Einzeldatei-Build ein.
  - **Maßstab 18,92** (Auslegung „Innenkreis“): Die Bühnenfläche ist nicht rund (Strahltest: Rand hinten 7,1 m, rechts 7,6 m, links 8,1 m, vorn offen). 14 m gelten bis zu den Rängen hinten, die Fläche ist damit ≈ 15,7 m breit. **Bitte bestätigen.**
  - Bühnenboden bei y = 0 (Messung ± 1 mm). Theater ≈ 36 × 9,3 × 32 m.
  - **Korrektur zur Quell-Isolation:** Die Unterseite ist nicht offen, sondern eine geschlossene Platte (≈ −0,16 m). Das Knet-Gelände (Relief aus dem Billboard-Spender, Biom-Farbe) liegt bei −0,125 m: Bodenschluss rundum. Die Kameras bleiben über 0,5 m.
- **Szene:** Billboard R2 hinten auf der Bühnenfläche, ruhiger Two-Shot (eine feste Kamera). Figuren nur als **Platzhalter für die Stellprobe** (F1-Figur Rogue_Hooded mit Eye-Rig, V-214), kein Darsteller.
- **Leistung: 60 fps** auf Georgs M4 mit Theater, Billboard und zwei Figuren.
- **Test `stage`, 9 Prüfpunkte:**
  - Prüfsumme der gepinnten Datei = Registry (Master- und Laufzeit-Variante getrennt);
  - Budget;
  - Maßstab und Bodenhöhe;
  - Bodenschluss;
  - Kameras über Grund;
  - Billboard auf der Bühnenfläche;
  - Karte im Two-Shot frei;
  - dispose.
  - Cache nach Prüfsumme, Netzfehler werden zu FAIL.
- **Blinder Prüfer 7: PASS MIT AUFLAGEN**, 10 Befunde, behoben oder offengelegt:
  - Registry-Variante;
  - Tag;
  - Test ohne Ausnahme;
  - Maßstab offen;
  - Unterseite korrigiert;
  - Abhängigkeiten gepinnt;
  - simplify abgesichert;
  - Debug-Name `StageMods` statt `Stage` (der Name war in main.jsx belegt);
  - Schatten bewusst nur empfangend;
  - audit-Hinweis: nur Dev-Abhängigkeiten.

### 16.3 · D1 Dialog als Modul (Mechanik, ohne Look)
- **Modul `dialog`** (create/update/dispose, nur Ports, keine Darstellung). Je Karte:
  1. Billboard zeigt die Karte;
  2. Sprecher A (wechselt je Karte) sagt die **Pool-Zeile** der Karte, sonst den **Kartentitel wörtlich**;
  3. Sprecher B antwortet mit dem **Power-Text wörtlich** (nie Pool: ein Triplet je Karte, V-231);
  4. Spielerwahl (S5c);
  5. nächste Karte.
- **Regeln im Code:**
  - Opener je Dialog höchstens einmal (V-222, `excludeOpeners`; DIRECT zählt nicht).
  - Ein Beat je Dialog nur einmal (`excludeBeats`).
  - Sprechdauer = Mundbild-Spur des Darstellers (mime, V-228). Ohne Mund gilt eine Lesedauer aus der Wortzahl.
  - Der Zuhörer schaut zum Sprecher.
  - Zeitgrenzen für Karte, Zeile und Wahl.
  - Es zählt nur die eigene Wahl.
  - Ports dürfen werfen.
  - Der Start wartet auf Pool, Bühne, Karte und Figuren.
- **Pool-Leser:** neue Optionen `excludeOpeners`, `excludeBeats`, `pool: false`. s5b bleibt grün.
- **Auf der Bühne** (`#stage,actors=rogue,dialog=n`): Blasen an den Ankern der Sprecher, Kartenwechsel auf dem Billboard, Wahl mit Taste 1 → Zuruf-Blase vorn. Beleg: `ws1/proofs/2026-10-14-stage/d1_dialog_sequence.png`.
- **Ehrlicher Stand:** Der Live-Pool r5 hat 0 ACCEPTED-Beats.
  - Auf der Bühne spricht A deshalb immer den Kartentitel.
  - Den POOL-Weg und „Opener einmal“ belegen nur ausdrücklich markierte Test-Kopien (humanApproval TEST FIXTURE, wie s5b).
  - Mit Pool r6 wechselt nur `POOL_PATH`/`POOL_REF`.
- **Tests:** `d1` (17 Prüfpunkte, Node, ohne Netz) und `d1stage` (8, Browser). **Alle 14 Tests grün.**
- **Blinder Prüfer 8: PASS MIT AUFLAGEN**, 12 Befunde, alle behoben:
  - Hängestelle ohne Zeilen-Zeitgrenze;
  - zwei Testlücken;
  - Start vor dem Pool;
  - Seiteneffekt beim Import;
  - fremde Wahl;
  - werfende Ports;
  - Überhang;
  - DIRECT/Beat;
  - Dialog ohne Figuren;
  - Billboard-Flackern.

### 16.4 · Offen / als Nächstes
- **FrizzleBob bleibt gestoppt**, bis die richtige Quelle geklärt ist. Danach tauscht der Darsteller-Slot nur die Rezept-Datei, Bühne und D1 laufen unverändert.
- **Bitte WS0:**
  - Maßstab „Innenkreis“ bestätigen;
  - die Registry-Erweiterung `runtime*` annehmen;
  - Biom/Kartenzone der Bühne festlegen (§14.4);
  - Pool r6 melden.
- **G4** (Vorführung für Georg) erst mit seinem richtigen FrizzleBob.

## 15 · 14.10. abends · Quittung Stopp FrizzleBob (bis V-239) · F1-Lid-Naht umgesetzt · Hinweis B1-Ecken

**Quittung:** `WS0_TO_WS1.md` bis V-239 gelesen.
- **FrizzleBob-Ausbau gestoppt.** WS1 setzt keine eigenen Gesichtswerte, übernimmt nichts aus J17 und testet keine Mundbewegung an FrizzleBob.
- Der Slot-Code (Vertrag R2, `createActor`, Tests) bleibt, ebenso das Rezept-Format für den späteren richtigen Eintrag.
- Georg hat WS1 dasselbe direkt gesagt: Gesicht „total off“, er rekonstruiert das Rigging.

**F1-Lid-Naht (freigegeben):**
- `src/vendor/eyes/eyeoval.v1.js`, eine Stelle in `seatPupils`. Blob **90c5e44b → 55b9dbb9**. Diff: `ws1/asset-intake/eyeoval-seam.r1.diff` (zurück an die Rigging-Quelle).
- `test/f1.mjs` prüft jetzt `pupilHiddenWhenClosed` als PASS: Pupillen-Pixel bei Lid zu **920 → 0**. Gezählt wird nur neutrales Schwarz, Brauen und Schatten nicht.
- Studio-Bild unverändert 2,4/255. Alle 11 Tests grün, keine OFFEN-Zeile mehr.

**Hinweis B1:** Die freigegebene Vorlagen-Zeile sagt „Innenecken ≤ 0,8 × Papierrand, sonst eckig“. Georg hat danach direkt entschieden: **innen immer rund, Karte mit Maske darunter**, Farben aus der Biom-Palette (§14.1). Umgesetzt ist Georgs Fassung. Bitte als V-Nummer eintragen bzw. widersprechen.

## 14 · 14.10. abends · B1 Billboard (R2) fertig (G2) · Georgs Entscheidungen zu Farbe und Ecken · Vorlagen-Zeile

**Vorlagen-Zeile (G1):**
- **1:1 (byte-gleich, Vendor):** `briefd/billboard-clay.js` aus `KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r2/` (Branch `work/billboard-island-integration-01-2026-10-01` @83b34017, 35 Prüfsummen OK). Genutzt werden:
  - `bodyGeometry(W, H, P, 'plain', r)` (Knet-Rahmen, Rückplatte, zwei Kantpfosten, Fußkragen, Querriegel);
  - `faceGeometry(W, H, r)`;
  - `buildPalette` (fest);
  - `makeClayFamily` (Knet-Relief).
- **Material wie Spender:** Die drei Zeilen aus `billboard-stage.js` Z. 58–60 (`makeClayFamily('B', {near 26, far 70, scale 2,6, amt 0,4})`, `std('#ffffff', 0,88, {vertexColors})`). Sonst wird `billboard-stage.js` **nicht** übernommen: keine Insel-Verankerung, kein Scheduler, keine Kaleido-Schnitte.
- **Änderung 1, responsive Fläche:** `fitFace(aspect, maxW, maxH)` aus `CLAUDE_DESIGN_STAGE_LIVE_R1/modules/billboard.module.js` (= `fit_face` aus `build_billboard_b3_v2.py`).
  - Das Seitenverhältnis kommt aus der geladenen Viertelseite (`cardImage().canvas`), nicht aus der festen 2:1-Fläche.
  - Die Leinwand hat das Kartenverhältnis (Breite ≤ 2048). Die Karte füllt sie ganz und wird nicht beschnitten.
  - Rahmen und Pfosten folgen, weil `bodyGeometry` um W × H gebaut wird.
- **Änderung 2, kurze Pfosten:** `STYLES.plain.gb` (Bodenabstand der Fläche, Spender 3,0 m) wird im exportierten Objekt einmal gesetzt; Vorschlag 0,9 m wie in STAGE_LIVE. Die Datei bleibt unverändert. Diff: `STYLES.plain.gb: 3.0 → 0.9`.
  - Pfostenlänge `pTop = gb + H·0,8` ergibt sich daraus, so wie im Spender.
- **Änderung 3, Innenecken (R2 §3):**
  - Der Radius ist 0,8 × der gemessene weiße Papierrand der Viertelseite (kleinste der vier Seiten, in Metern).
  - Ohne messbaren Rand (< 2 px) bleiben die Ecken eckig.
  - Begrenzung durch `cornerOf` des Spenders (≤ 0,3 · min(W, H)).
- **Neu:** Modul-Hülle `src/modules/billboard.js` nach create/update/dispose mit `setCard(card)`, dazu eine Prüfszene.
- **Karte:** Nur SAFE-Decks über `cardImage`. Sonst der Platzhalter mit wörtlichem Kartentext (Name, Power, Lore aus der Kartenquelle), im gleichen Rahmen.
- **Keine Lesefolge, kein Vollbild-Knopf, kein TV** (R2 §4).

### 14.1 · Georgs Entscheidungen (direkt an WS1, 14.10., bitte als V-Nummer eintragen)
1. **Farben:** „Die Farben stammen aus der jeweiligen Cartoon-Farbpalette des Bioms / der Insel / der Kartenzone (ähnlich wie in Joyride).“
   - Umsetzung: `buildPalette(spec, island)` des Spenders mit dem Biom. Die Biome sind die Tabelle `BIOMES` aus `billboard-stage.js` Z. 6–12, als Daten 1:1 übernommen: Senf-Plateau, Moos-Insel, Violett-Mesa, Klinik-Riff, Heroic-Canyon.
   - Ohne Biom gibt es kein Billboard (`BILLBOARD_BIOME_REQUIRED`).
   - Der Prüfstandard ist **Moos-Insel** (Rahmen #d97c3a, Pfosten #6f4e37, Boden #9aab62). Das trifft Georgs Referenzbild.
   - **Bitte WS0:** Welches Biom bzw. welche Kartenzone gilt für die Amphitheater-Bühne (G4), und gibt es eine Zuordnung Kartenzone → Palette (Joyride)? Der Code nimmt jedes Biom-Objekt mit `accent/paper/rock/top`.
2. **Ecken (ersetzt R2 §3):** „Das Claymation-Billboard muss innen runde Ecken haben, der Card Viewer mit Maske darunter.“
   - Umsetzung: Der Radius ist immer `STYLES.plain.corner` des Spenders (0,45 m, begrenzt über `cornerOf`).
   - `faceGeometry(W, H, r)` maskiert die Kartenecken: UV über die volle Box, Bild unverzerrt, nur die Ecken fallen weg.
   - Die Papierrand-Messung ist damit entfallen. Ergebnis der Messung, zur Dokumentation: Keine von 52 messbaren Viertelseiten hat einen weißen Rand, alle tragen Schnittmarken (`ws1/asset-intake/b1_paper_margins_52_decks.txt`).

### 14.2 · Ergebnis (G2): `test/b1.mjs`, 16 Prüfpunkte PASS, alle 11 Tests grün (plus die bekannte F1-Zeile „OFFEN“)
- **Vorlage und Stil:** Spender byte-gleich (Blob 5c9f22e1). Stil plain ohne TV-Teile: Oberkante = Rahmenkante, Breite = Rahmen.
- **Niedrig:** gb 0,9. Die Fläche beginnt 0,9 m über dem Boden, die Oberkante liegt bei 5,34 m (Spender 7,44 m).
- **Responsiv:** W/H = Seitenverhältnis der Viertelseite, contain in 7 × 5 m. Die Grenzfälle von `fitFace` sind geprüft.
- **Karte:**
  - Die Textur ist die Viertelseite aus `cardImage` selbst (1400 × 781 bei res 2800), Pixel für Pixel gleich (Abweichung 0).
  - Kein Füllrand: Die Fläche füllt die Rahmenöffnung.
  - Innen runde Ecken (r 0,45), Kartenecken maskiert.
  - Echte Karte nur aus SAFE-Decks (Prüfkarte forget_utopia #1).
  - Für ein nicht gesichertes Deck (anti_rules_toolkit) kommt der Platzhalter mit dem ganzen wörtlichen Kartentext. Die Schrift wird verkleinert, nie gekürzt.
- **Palette aus dem Biom:** Moos-Insel; ein anderes Biom ergibt eine andere Rahmenfarbe.
- **Two-Shot:** Beide FrizzleBobs stehen seitlich vor der Tafel (x = ±4,2). Bildschirm-Überdeckung Karte ↔ Figuren (mit gespielter Pose): **0**. Die Karte liegt ganz im Bild.
- **Vertrag §6:** dispose gibt Leinwand-Textur und beide Materialien frei. Die Geometrien gehören dem Cache des Spenders, wie dort.
- **Bilder** in `ws1/proofs/2026-10-14-b1/`:
  - `b1_two_shot.png`;
  - `b1_views.png` (Two-Shot, ¾, nah);
  - `b1_ref_pair.png` (Georgs Referenz | Stand ¾);
  - `b1_card_full.png` (rohe Viertelseite | Tafel nah).

### 14.3 · Blinder Prüfer 6: PASS MIT AUFLAGEN, 9 Befunde, alle behoben oder begründet
1. **Rahmen verdeckte in Schrägansicht einen Kartenstreifen.** Die Fläche lag 0,245 m hinter der geraden Innenwand.
   - Jetzt liegt sie bei z = 0,285, vor der Wand und hinter der Fase. Prüfpunkt `faceInFrontOfFrameWall`, Bild ¾.
   - Das ist eine Abweichung vom Spender (dort 0,035) und gehört zur Vorlagen-Zeile.
2. **Tests prüften zu wenig** → geschärft:
   - Lage vor der Wand;
   - Ecke = Scheitel der Spender-Kurve r·√2/4;
   - Platzhalter-Deck nachweislich nicht SAFE, Text vollständig;
   - Überdeckung mit gespielter Pose statt Bindepose.
3. **Speicher:** Die zweite 4-MB-Kopie je Karte ist weg, die Textur zeigt die Quelle direkt.
   - Offen bleibt der Seiten-Cache von `card-art-2d.js` (res 2800 ≈ 17,5 MB je PDF-Seite, Sitzung).
   - Vorschlag an deren Owner: Begrenzung (LRU) oder kein Dauer-Cache bei großer Auflösung. Bis dahin ist der Speicher für eine Bühne mit einer Tafel vertretbar.
4. **Globales `STYLES.plain.gb`:** Wird jetzt einmal beim Laden des Moduls gesetzt, bevor ein Körper gebaut wird. Diff: `3.0 → 0.9`. Andere Nutzer von billboard-clay.js gibt es im Spiel nicht.
5. **Nach Ladefehler blieb der Platzhalter stehen:** `subscribeRetry` wie bei CardArt, beim Abbau abgemeldet.
6. **Überholter `setCard`** meldete die neuere Karte → liefert jetzt `{ stale: true }`.
7. **Platzhalter kürzte Text still** → die Schrift wird verkleinert, bis alles passt.
8. und 9. Papierrand-Messung und Spec-Konformität: Hinweise. Die Messung ist mit 14.1 Punkt 2 entfallen.

### 14.4 · Offen
- **Farbe und Biom der Bühne:** siehe 14.1 Punkt 1.
- **„Die Figuren stehen davor“ (R2 §1):** Die Figuren stehen vor der Tafel, aber seitlich der Karte, damit sie ganz lesbar bleibt. Stehen sie vor der Karte, verdecken sie POWER/LORE (Bild aus dem ersten Lauf). Bitte bestätigen.
- **Weiter:** D1 Dialog (Pool r5 bis zur Meldung von r6), dann G4 im Amphitheater.

## 13 · 14.10. nachmittags · Antwort auf WS0 (§11) · Grundhaltung · Vorschlag F1-Lid-Naht · gelesen bis V-237

**Quittung:** `WS0_TO_WS1.md` (Antwort auf §11) und `DECISIONS.md` bis V-237 gelesen. V-237 (Triplet-Abnahme-UI) betrifft WSA und den Hub, nicht WS1-Code.
**Hinweis zu Georgs Eintrag:** Georg hat WS1 direkt gesagt, er möchte nicht exportieren oder weiterleiten. Er will v5 mit dem angelegten Mund, die Werte werden später getauscht (§12.1). WS1 fragt ihn deshalb nicht danach. Will WS0 den Export, bitte direkt mit Georg klären.

### 13.1 · Grundhaltung: Befund, betroffene Teile, Vorschlag fürs Spiel
- **Befund:**
  - `FB_TEMPLATE_LOOK_v5.glb` (131d7c38) steht in **T-Pose** und hat **keine Clips**.
  - Die ToolBox P06 zeigt FrizzleBob trotzdem mit hängenden Armen, weil `_studioBones` mit `pose-rig.v1` jede Bildfolge eine Haltung schreibt (Studio- und Rigging-Tab).
  - Alle ToolBox-Belege (01, 02, 04 und die Rigging-Bilder) zeigen deshalb die Pose-Rig-Haltung, nicht das Modell.
- **Betroffen:**
  - FrizzleBob v5 und v5b (gleiches Skelett, KayKit Rig_Medium);
  - jedes Bildpaar ToolBox | Spiel;
  - Joyride J17 (eigene Sitzhaltung, nicht geprüft).
- **Im Spiel:** Die Bindepose wäre die T-Pose, also falsch für die Bühne. Das Spiel spielt den Ruhe-Clip **`Idle_A`** aus `Rig_Medium_General.glb` ab. Das ist derselbe Clip, den die ToolBox als `defaultIdle` für diesen Akteur nennt (P06 Z. 1817). Im Rezept steht er als `idle.clip`, im Code als `motion: 'idle'`.
- **Belegbild:** `ws1/proofs/2026-10-14-actor-slot/fb_pose_bind_vs_idle.png` (ToolBox mit pose-rig | Spiel Bindepose | Spiel Idle_A).
- **Vermutung und Vorschlag:**
  - Ein eigener Ruhe-Clip für FrizzleBob fehlt. KayKit-Idle passt vom Skelett her, ist aber nicht für den Birnenkopf abgestimmt (Kopf und Ohren nicken mit).
  - Für Abnahmen sollte die ToolBox einen Schalter „Bindepose“ haben und je Beleg die Haltung nennen (TOOLBOX_FINDINGS A1).
  - Ob auf der Bühne Idle_A gilt oder ein Clip aus der Motion Library, entscheidet WS0 bzw. Georg. Die Prüfbilder des Slots bleiben in Bindepose, damit sie mit der ToolBox vergleichbar sind.

### 13.2 · Vorschlag F1-Lid-Naht (`pupilHiddenWhenClosed`) · Ursache + Diff, bitte freigeben
- **Ursache:**
  - `eyeoval.v1` @2bfbe0d (Blob 90c5e44b, Eye-Rig-Studio cloudflare-live) setzt in `seatPupils()` jede Bildfolge den Pupillen-Drehpunkt um `delta` nach vorn (Rogue_Hooded: 0,0059 = 0,056 R), damit die Pupille auf ovalen Augen nicht „verschluckt“ wird.
  - Die Lidschalen des Eye-Rigs haben den Radius R·1,011 (`lidScale` bei lidFit 0,9), die Pupille R·1,004. Mit dem Vorschub liegt die Pupille vor der geschlossenen Lidschale.
  - Die ältere Fassung @8922d4b1 (397e5174, ToolBox) hat keinen Vorschub. FrizzleBob mit Knet-Lidern hat das Problem nicht (§12).
- **Vorschlag (eine Stelle, in der Spender-Datei, erst nach Freigabe):** den Vorschub mit dem Lidschluss ausblenden.
  ```diff
   export function seatPupils(rig,p) {
     if(!rig||!Array.isArray(rig.eyes)||!rig.eyes.length)return {status:'KEIN_RIG'};
     const q={...DEFAULTS,...(p||{})},R=num(rig._R,0),cap=num(rig._puAng,.35),rows=[];
  +  const shut=rig._blinkK>=0?Math.sin(Math.min(rig._blinkK,1)*Math.PI):0; // Lidschluss 0…1 wie pet-eye-rig.v6 update()
     for(const e of rig.eyes){
       …
  -    e._pivot.position.set(seat.dir[0]*seat.delta,seat.dir[1]*seat.delta,seat.dir[2]*seat.delta);
  +    const dl=seat.delta*(1-shut); // beim Zumachen zurück unter die Lidschale
  +    e._pivot.position.set(seat.dir[0]*dl,seat.dir[1]*dl,seat.dir[2]*dl);
  ```
- **Geprüft ohne Änderung am Spender** (Hülle um `rig.update` in der Prüfsitzung, `scripts/f1/seam-proposal.mjs`):
  - Lid zu: dunkle Pupillen-Pixel **1074 → 139**. Der Rest sind Brauenkanten, keine Pupille.
  - Offen: **1078 → 1078**, unverändert.
  - Bild: `ws1/proofs/2026-10-14-f1/f1_seam_proposal.png`.
- **Grenze:** Lider, die durch einen Ausdruck halb geschlossen sind (müde, wütend), deckt `_blinkK` nicht ab. Dafür bräuchte es die Lidstellung (`e._up.rotation.x`). Das ist ein Folgeschritt, falls gewünscht.
- **Nach Freigabe** wird die Spender-Datei an dieser einen Stelle geändert. Die Kopie bekommt dann einen neuen Blob, `f1` misst `pupilHiddenWhenClosed` als PASS, und der Diff kommt in den Rigging-Ordner zurück.

## 12 · 14.10. nachmittags · Darsteller-Slot fertig (G2) · FrizzleBob v5 im Spiel · Georgs Entscheidung · Befunde zur ToolBox

### 12.1 · Georgs Entscheidung (direkt an WS1, 14.10., hier für WS0 eingetragen)
- **„nimm den v5 FB mit angelegtem Mund – das können wir doch nachher alles austauschen!“**
  - WS1 baut mit FrizzleBob v5 und seinem eigenen Modellmund.
  - Fehlende Feinwerte nimmt WS1 vorläufig aus den Belegen, mit Quelle im Rezept. Austauschen heißt: eine Datei ersetzen.
  - Die Bitte aus §11.2 (Georg exportiert seinen Eintrag) ist damit **kein Blocker** mehr. Sie bleibt eine Option für später.
- **Georg möchte keine „stille Post“ mehr:** keine Weiterleitungen und keine Export-Bitten an ihn. Dropbox und andere Connectoren sind bei ihm durch die Admins gesperrt.
  - Folge: Das Wireface-SDK kommt auf diesem Mac auf absehbare Zeit nicht an. Der Schalter bleibt, gebaut wird ohne SDK.

### 12.2 · Darsteller-Slot (V-227 / V-228 §4): Vorlagen-Zeile und Ergebnis
**Vorlagen-Zeile (G1):**
- **1:1 übernommen (byte-gleich, Blobs im Test geprüft):**
  - Darsteller-Vertrag #355 `wireface-face-driver-contract.mjs` (@bea811c1, Blob 74d03061);
  - aus ToolBox P06 r1 `face-mount.v1`, `clay-lids.v1`, `lipsync-text.v1`, `ear-base.v1`, `hair-tufts.v1`;
  - @8922d4b1 `pet-mouth.v1`, `eyeoval.v1` (397e5174), `headzones.v1`, `partrig.v1`, `brow-rig.v2`, `pet-nose.v2`, `pet-moustache.v1`, `kfb-ink-canon`; `pet-eye-rig.v6` und `facehost.v1` gleich F1;
  - `ear-dangle.v1` + `fb-default.ear-rig.json` @19088b14;
  - Modell `FB_TEMPLATE_LOOK_v5.glb` (131d7c38), 13 Mund-Decals (main @ac9dbaed) und Haar-Spender `FrizzleBob_Yellow.gltf` @eabc8725.
- **Neu:**
  - `src/actors/actorSlot.js`: `createActor()`, genau ein Gesichts-Treiber, Auswahl nach `composition.faceOwners.face`, kein stiller Rückfall;
  - `src/actors/face-driver-contract.r2.mjs`: Vertrag R2;
  - `src/modules/faceMountActor.js`: Modul nach Host-Vertrag, Ablauf wie P06 `_loadActor`/`_mountFaceOn`/`_postRig`/`_frame`/`_lipRun`;
  - Rezepte `src/data/actors/frizzlebob-v5.recipe.json` und `rogue-hooded.recipe.json`;
  - Prüfszene `#actortest` mit Licht und Kamera wie die ToolBox.
- **Die F1-Figur läuft jetzt über denselben Slot** (`EyeTest` → `createActor`). Der F1-Test bleibt grün.

**Vertrags-Diff R2 gegen #355** (ganz in `ws1/asset-intake/frizzlebob-v5/face-driver-contract.r2.diff`, bitte in #355 übernehmen):
1. `composition.modelRef { path, revision, blob }` = **ein** gepinntes Modell statt bodyRef + headRef (FrizzleBob: Ohren am eigenen Skelett, kein Graft).
   - `revision` muss ein Commit sein (40 Hex), `blob` 8–40 Hex, kein Leerraum.
   - modelRef und bodyRef/headRef zugleich = `COMPOSITION_AMBIGUOUS`.
2. `rigFamily: "CUSTOM"` ist nur zusammen mit `modelRef` erlaubt (für Nicht-KayKit-Skelette).
3. Exklusivität in beide Richtungen: `KFB_NATIVE` lehnt einen aktiven Wireface-Besitzer ab (`DOUBLE_FACE_CHANNEL_OWNER`). Bisher war nur die Richtung Wireface → KFB geprüft.
   - Die aktiven Besitzer leitet der Slot aus `composition.faceOwners` des Rezepts ab. Sie kommen nicht nur vom Aufrufer.
   - Ein Wunsch nach Wireface reißt die Szene nie ab: Ein Vertragsfehler ergibt einen Darsteller ohne Figur mit Status `CONTRACT_REJECTED` oder `SOURCE_MISSING`.
- Alles andere bleibt unverändert. **Die 19 #355-Tests laufen unverändert gegen R2 grün.**

**Ergebnis (G2): `test/actors.mjs`, 33 Prüfpunkte PASS, nach dem blinden Prüfer 5 in drei Läufen hintereinander gleich.**
- Alle 10 Tests sind grün, dazu die bekannte F1-Zeile „OFFEN“ (§11.1).
- Für die Aufnahmen werden die Augen eingefroren (Leben aus, Blinzeln aus, Blick geradeaus), in Test und ToolBox-Referenz gleich.
- **Vertrag:** #355-Suite auf R2, Einzelmodell-Rezept, Pin-Pflicht, CUSTOM nur mit Modell, Exklusivität beidseitig, Spender byte-gleich.
- **Gleich wie die ToolBox:**
  - Gleicher Eintrag ergibt die gleiche Augenlage (eyeFrame bis auf die 4. Stelle gleich, links −0,2029 / 0,0936 / 0,3706).
  - **Bild Gesicht gegen die ToolBox: 2,0–2,4/255** in drei Läufen. Referenz `test/ref/fb_donor_face.*`, aufgenommen mit `scripts/fb/donor-pair.mjs` aus derselben Kamera, Bindepose.
- **Augen:** Blick links parallel. **Lid zu: Augenweiß 915 → 0, Pupille 2992 → 0 Pixel**, in jedem Lauf gleich. Die Knet-Lider decken also ganz ab, die F1-Naht gibt es hier nicht.
- **Ein Treiber:** Eye-Rig sichtbar, gemalte Augen aus, Rig-Mund aus (der Modellmund trägt die Laute). Der Blasen-Anker sitzt über dem Kopf.
- **Mund (Mime, ohne Ton):**
  - `say(text)` erzeugt eine Spur aus `lipsync-text`, im Test 22 Schritte über 2,8 s mit 8 verschiedenen Mundbildern.
  - Während der Spur trägt der **Modellmund** das jeweilige Decal, danach wieder seinen eigenen gemalten Mund. Es gibt keinen zweiten Mund.
  - Ende bei „!“ = `smile` wie im Spender.
  - Die Decals kommen nur aus lokalen, gepinnten Kopien (13 Blobs geprüft). Ohne sie bricht create ab (`MOUTH_DECALS_REQUIRED`).
- **Ohren und Haare:**
  - Haare: drei Büschel.
  - Ohren: 3+3 Knochen. Ein Stoß lässt sie schwingen, die Werte bleiben endlich und kommen zur Ruhe.
- **Vertrag §6:** create 1× (auch nach 5 Re-Renders), update mit ctx, dispose 1×, danach kein update.
  - Freigegeben sind 34 Geometrien, 18 Materialien und **25 Texturen**, dazu der Decal-Cache des Munds und seine Zwillinge.
  - Gezählt wird unabhängig von dispose.
- **Wireface:**
  - Das FrizzleBob-Rezept unter Wireface wird abgelehnt (`DOUBLE_FACE_CHANNEL_OWNER`).
  - Ein reines Wireface-Rezept ohne SDK oder ohne Nachweis ergibt `SOURCE_MISSING`, keine Figur und keinen Absturz.
  - Build und Tests laufen ohne SDK.
- **Bilder** in `ws1/proofs/2026-10-14-actor-slot/`:
  - `fb_pair_face_q.png` (ToolBox | Spiel, vorn und ¾);
  - `fb_blink.png`;
  - `fb_mouth_mime.png`;
  - `fb_brow_lift_probe.png`.

**Blinder Prüfer 5: PASS MIT AUFLAGEN**, 12 Befunde. Alle sind behoben oder begründet:
1. Test nicht wiederholbar (Blinzeln/Leben zufällig, einmal FAIL bei 3 Läufen) → Augen eingefroren, Referenz neu aufgenommen, 3 Läufe gleich.
2. Vertrag ließ gemischte Komposition und Revision „main“ zu → abgelehnt.
3. Exklusivität prüfte nur die Angaben des Aufrufers → aktive Besitzer kommen jetzt aus dem Rezept.
4. Wireface ohne Nachweis warf eine Ausnahme in die Szene → Darsteller ohne Figur.
5. Mund-Decals wurden global und still gesetzt → Pflicht über `options`, sonst Abbruch.
6. dispose ließ den Decal-Cache liegen, der Test prüfte keine Texturen → freigegeben und geprüft.
7. Anker-Höhe mischte Welt- und lokale Koordinaten → jetzt im lokalen Raum.
8. Die Figur war vor dem Gesicht sichtbar, ein Clip-Fehler setzte ERROR → erst mit Gesicht sichtbar, Clip-Fehler nur Log.
9. Kommentar zum Takt war falsch, das erste Mundbild kam ein Bild zu spät → Kommentar berichtigt, erstes Mundbild sofort, End-Form geprüft.
10. Ohren hingen bei bewegtem Elternknoten ein Bild nach → `updateWorldMatrix(true, true)`.
11. Einzelne Prüfpunkte behaupteten zu viel → geschärft (ein Treiber, Decal-Blobs, Anzahl 33).
12. Quellen im Rezept fehlten teilweise → `mouth.set`, `hair`, `idle` mit Quelle; `idle` wird gelesen (`motion: 'idle'`).

Restpunkt aus 1: Das Bild schwankt noch 2,0–2,4, weil die Ohrfedern zeitabhängig ausschwingen. Die Schwelle 6 hat Abstand.
Hinweis aus dem Prüfbericht: Die Spender-Datei `pet-mouth.v1` setzt `window.PetMouth`. Das stammt unverändert aus dem Spender und ist kein Debug-Global von WS1.

### 12.3 · Befunde zur ToolBox und Korrekturen
Ganz in `ws1/asset-intake/frizzlebob-v5/TOOLBOX_FINDINGS_R1.md` (A1–A12 an den ToolBox-Owner, B1–B6 Korrekturen bei WS1). Die wichtigsten:
- **A1 Das Posenwerkzeug setzt die Arme anders an:**
  - `pose-rig.v1` schreibt im Studio- und Rigging-Tab jede Bildfolge eine eigene Haltung (Arme ab). Das GLB steht in T-Pose.
  - Die ToolBox-Belege zeigen also nicht die Bindepose. Mit unterschiedlicher Haltung lag das Bildpaar bei 12,1/255, mit gleicher bei 3,0/255, mit zusätzlich eingefrorenen Augen bei 2,0–2,4/255.
  - Vorschlag: die Haltung neben jedem Beleg nennen und einen Schalter „Bindepose“ anbieten.
- **A2:** Die Kennung `frizzlebob-earrig-v5` lädt ab r2 die Figur v5b.
- **A3/A4:** Georgs Einträge liegen nur im Browser, das Abnahme-JSON nennt den Eintrag nicht. Nachlauf ohne Eintrag: 6/7.
- **A5:** Mit Georgs Augenhöhe verdecken die Rig-Augen die Modellbrauen. WS1 setzt vorläufig `original.brows.lift` 0,18, geschätzt nach Beleg 04.
- **A6:** Die Mund-Decals sind ungepinnt (main).
- **A7:** Der gemalte Mund steht in ¾ vor dem Gesicht.
- **A8:** Die Pupille scheint nur mit der neueren `eyeoval` durchs Lid. Mit Knet-Lid ist sie ganz verdeckt. Das ist ein Hinweis für den Rigging-Owner zur F1-Naht.

### 12.4 · Offen / als Nächstes
- **Augen → Kopf → Körper und Blick zum Partner:** Der Slot hat `lookAt(nx, ny)` (Bildschirm-Pointer). Das Weltziel und die Reihenfolge kommen mit D1 und der Vorführung. V-214 ist **noch nicht** als erfüllt gemeldet.
- **Haltung auf der Bühne:** Ruhe-Clip `Idle_A` (Rig_Medium General), keine T-Pose.
- **Weiter:** B1 Billboard nach R2, dann D1, dann die Vorführung im Amphitheater.

## 11 · 14.10. mittags · G0 FrizzleBob v5 (V-236) · F1-Nacharbeiten aus dem WS0-Abgleich · gelesen bis V-236

**Quittung:** `WS0_TO_WS1.md` (Besetzung FrizzleBob v5), `GEORG_CAST_DIRECTION_FRIZZLEBOB_V5_WS0_TO_WS1_2026-10-14.md`, `WS0_WS1_F1_EYERIG_SOURCE_AND_GATE_RECONCILIATION_2026-10-14.md` und `DECISIONS.md` gelesen bis V-236. Rogue_Hooded bleibt nur F1-Prüffigur. V-235 (Triplet = Mini-Story) betrifft den Pool und nicht WS1-Code.

### 11.1 · F1-Nacharbeiten (Abgleich §2, P0)
- **Quelle fest gepinnt:** `scripts/f1/serve-studio.sh` holt das Studio jetzt aus Commit `db823766370df932cc8134f21691036924a7d12c` und den Batch-Export aus main `ac9dbaed`. Den Branch-Namen nutzt es nicht mehr.
  - Commits und Datei-Blobs stehen in der Referenz (`test/ref/f1_studio_rogue_hooded.report.json` → `sourcePins`).
  - Neu aufgenommen: eyeFrame, controls und faceHost sind identisch mit der alten Referenz, im Bild weicht 1 von 810.000 Pixeln ab.
- **Lid-Naht ehrlich ausgewiesen:**
  - `lidsClose` heißt jetzt `lidsCoverSclera`, denn der Punkt prüft nur das Augenweiß.
  - Neu ist die Messung `seams.pupilHiddenWhenClosed`: Bei geschlossenem Lid bleiben **1074 von 1062** dunklen Pupillen-Pixeln sichtbar. Status **TUNE · Rigging-Owner (eyeoval.v1)**, kein PASS. Der Test meldet es als eigene Zeile „OFFEN“.
  - Bild: `ws1/proofs/2026-10-14-f1/f1_lid_pupil_seam.png`. Lokal geändert ist nichts.
- **Profilwerte bleiben wie gespeichert** (kinetics aus, life an). Ein Umschauen im Leerlauf kommt, wenn es gewünscht ist, als eigenes Spiel-Preset im Darsteller-Slot. Georgs Profil wird dafür nicht verändert.
- Es gelten getrennt `EYE_PROFILE_ACCEPTED` und `SOURCE_EYE_CLEANUP_PENDING`.
- Alle 9 Tests sind grün, dazu kommt die eine OFFEN-Zeile.

### 11.2 · G0 FrizzleBob v5: Ergebnis
Bericht: `ws1/asset-intake/frizzlebob-v5/SOURCE_ISOLATION_R1.md`. Bilder liegen in `ws1/proofs/2026-10-14-fb-g0/`.
- **Modell allein:** `FB_TEMPLATE_LOOK_v5.glb`, Blob `131d7c38` bestätigt, three 0.186.1, ohne Rig. Es hat gemalte Augen, Modellbrauen, Modellnase und einen gemalten Mund. Der Mund steht in ¾ vor dem Gesicht, das ist ein bekannter offener Punkt. Die Haarbüschel kommen erst über `hair-tufts.v1`.
- **Spender P06 r1 lokal nachgelaufen:** Ohne Georgs Eintrag besteht die Abnahme 1–7 nur **6/7**.
  - 3 „closed means closed“ ist PASS: Die Ton-Lider decken die Pupille ganz.
  - 6 „Spiegel“ ist FAIL (0,127° bei Grenze 0,1°), weil der Standard-Anker nicht Georgs Anker ist.
  - Der 7/7-Beleg vom 30.09. hängt also an Georgs gespeichertem Eintrag.
- **Mund ist vorhanden:** Modellmund + 13 Laute-Decals (`pet-mouth.v1`) + `lipsync-text.v1` (Text → Mundbild-Spur). Das passt zu „mime, kein TTS“. Kein Platzhalter nötig.
- **`SOURCE_REQUIRED`:** Georgs FrizzleBob-Eintrag (`kfb.pets/1` mit Augen-, Lid-, Brauen-, Mund-, Ohren- und Oberflächenwerten) liegt nur im localStorage seines Browsers in Claude Design. Joyride J17 hat das ebenfalls festgestellt und eigene Werte gesetzt; WS1 übernimmt diese nicht.
- **Falle v5/v5b:** Ab Cut r2 lädt die Kennung `frizzlebob-earrig-v5` die Figur **v5b** (23615cff), so in P06 nach FLOPPY-01, in P08 und in J17. Ein später gespeicherter Eintrag kann deshalb auf v5b eingestellt sein.
- **Bitte (ein Schritt):** Georg exportiert in der ToolBox **Rigging › Import · Export › Export** seinen FrizzleBob-Eintrag. WS0 legt fest, welcher Stand gilt (30.09. auf v5 oder später mit v5-Bestätigung), legt die Datei ins Repo und meldet den Pfad. Erst damit ist eine Abnahme „Georgs FrizzleBob“ möglich.
- **Lider:** Beleg = `hinge`, Georgs Speicherstand laut LIDS-02 = `glide`. Bitte entscheiden, welche Mechanik gilt. Nur die Entscheidung fehlt, die Werte kommen mit dem Export.

### 11.3 · Weiter ohne zu warten (keine erfundenen Werte)
- **Darsteller-Slot:** Darsteller-Vertrag für Nicht-KayKit-Figuren, `faceDriver` exklusiv (`KFB_NATIVE` | `WIREFACE_*`), Diff folgt hier.
- **FrizzleBob-Gesicht:** face-mount mit seinen Modulen 1:1 per Vite-Alias einbinden, wie in F1.
- **Code-Pfad-Parität Spender | R3F:** läuft mit einem ausdrücklich markierten Prüf-Eintrag (Spender-Standard + `eyes: rig` + Abnahmewerte aus MEASURE.json). Nicht Georgs Look, geht nicht an Georg.
- **Wireface-SDK:** nicht auf diesem Mac, weil Dropbox fehlt (G0-Verfügbarkeit). Schalter `VITE_WIREFACE=1` und Build ohne SDK bleiben Pflicht.

## 10 · 14.10. früh · F1 Augen fertig · Registry-Korrektur übernommen · gelesen bis V-234

**Quittung:** `WS0_TO_WS1.md` und `DECISIONS.md` gelesen bis V-234, dazu `ARCHITECTURE_R1.md` und `BILLBOARD_STANDARD_R2.md`.

### 10.1 · Registry-Korrektur (Antwort auf WS0 „bitte Audit gegen a9f5ffa1“)
- **Audit gelaufen:** OCR-Lauf mit `MEDIA=a9f5ffa1… python3 scripts/audit-mapping.py`. Ergebnis **60 von 78 SAFE, 3097 Karten freigegeben** (Vorhersage WS0: 58). Kein vorher sicheres Deck ging verloren, 15 kamen dazu, darunter nibelungen, 1001_kayfabe_nights, suppressed_book_deck und die 2 vorher fehlenden PDFs.
- **`MEDIA_COMMIT` umgestellt** auf `a9f5ffa1`. `src/data/mapping-audit.json` und `deck-blobs.json` sind neu, die Rohdaten liegen in `test/audit/`.
- **Befund zwei Kartenquellen:** Die Korrekturen (Dublette anti_rules_toolkit, Tausch big_bad_brain_wrestling #50/#51, „TRUST LOOP“) stehen nur in den Deck-JSONs unter `media/kfb/`. Die Kartentexte im Spiel (`src/data/cards.json`) stammen aus `registry/assets/v1/decks` @ac9dbae, und dort fehlen sie.
  - Folge: anti_rules_toolkit und unspoken_systems bleiben UNSAFE (Platzhalter), big_bad_brain_wrestling #50/#51 bleiben gesperrt.
  - **Bitte:** Welche Quelle gilt für den Kartentext (Game Core R2 §1: „Karten-JSON ist die einzige Quelle der Wahrheit“)? Entweder `registry/assets/v1/decks` nachziehen, oder WS1 baut `cards.json` aus `media/kfb` am `MEDIA_COMMIT`.
- Die Kartentests hängen nicht mehr am Deck-Turm (Legacy, V-216): feste Karten, unabhängige Referenzen, gesperrte Beispiele aus dem Audit.

### 10.2 · F1 Augen (KFB_NATIVE), Vorlagen-Zeile und Ergebnis
**Vorlagen-Zeile (G1):**
- **Gibt es schon:** Georgs Studio „KFB Batch EyeRig Atlas“, `kfb-hub/stage/toolbox/eye-rig-batch/`.
- **1:1 übernommen (byte-gleich, `src/vendor/eyes/`):**
  - `lib/kaykit-eye-adapter.v1.js` (mountKayKitEyes) mit `facehost.v1.js`, `pet-eye-rig.v6.js` (853bcf5f) und `eyeoval.v1.js`;
  - die Augen-Entfernung `medium-source-eye-cleanup.v1.js`, `source-face-cleanup.v1.js`, `donoreyes.v1.js` und `pet-library.v6.js`;
  - die Hautfarben-Messung `face-color-sampler.v1.js`, dazu der Ausdrucks-Vertrag `kfb-pet-graft-driver.v4.json`.
  - Die jsDelivr-Imports der Spender zeigen per Vite-Alias auf die lokalen Kopien. Kein Spender ist verändert.
- **Neu:** nur die Modul-Hülle `src/modules/eyeActor.js` (create/update/dispose, Ablauf wie Studio `app.js loadActor()`) und die Prüfszene `#eyetest` mit Kamera, Licht und Hintergrund wie die Studio-Frontansicht.

**Abweichungen vom WS0-Wortlaut (fachlich begründet, bitte quittieren):**
1. **Studio-Weg statt `anchored-eyes.v1.js`.**
   - `anchored-eyes` braucht die NoEyes-Anker aus EYE-CLEANUP-01. Es ignoriert Georgs Profilwerte (dx/dy/converge/splay/inset) und kopiert die Anker-Drehung (`e.quaternion.copy(a.q)`), also die Schiel-Ursache aus V-201.
   - „1:1 + ohne Drehung + Studio-Werte“ geht nur über den Studio-Weg. ARCHITECTURE_R1 §5 sagt „KFB_NATIVE 1:1 aus dem Eye-Rig-Studio“.
2. **Studio-Quelle `cloudflare-live` @db823766 statt `work/hub-ux-v2-masterplan` @5c3334bd.**
   - Die von WS0 genannte Fassung (22.09.) hat 27 Figuren ohne die Adventurers. Rogue_Hooded lädt dort nicht.
   - `cloudflare-live` (03.10.) hat 55 Figuren, und dort hat Georg das Profil abgenommen (`eyeProfileVisuallyApproved: true`, front, bind).
   - Geprüft: Augen-Entfernung und Hautfarben-Messung sind in beiden gleich. Der Adapter hat in cloudflare-live nur Zusätze, nämlich deriveSourceAnchorSeed und setRingPreserveCenter. `eyeoval` ist neuer (2bfbe0d statt 5650b6c), mit `pupilSeatDelta` (siehe 10.3 Punkt 2).
3. **Figur Rogue_Hooded.** Sie ist eines von zwei ADJUSTED_APPROVED-Profilen in `eye-rig-medium.batch-1.json` (das andere ist das Mannequin). Die vier V-090-Figuren haben dort kein abgenommenes Medium-Profil. **Einschränkung:** Die Maske verdeckt den Mund, für F2/Vorführung ist die Figur ungeeignet (Cast-Frage 10.3 Punkt 5).

**Ergebnis (G2):** `test/f1.mjs`, 17 Prüfpunkte PASS, alle 9 Tests grün.
- Spender und Assets sind byte-gleich, Georgs Profil ist unverändert.
- **Messwerte (eyeFrame, controls) identisch mit der Studio-Referenz.** Die Referenz kommt aus dem Studio-Quellcode, nach Georgs Batch-Import (`scripts/f1/serve-studio.sh` + `studio-ref.mjs`). Augenlage ±0,2274 / 0,0308 / 0,4402, symmetrisch, keine Anker-Drehung.
- Bild Gesichtsausschnitt gegen das Studio: mittlere Abweichung 2,4/255.
- Blick links: beide Augen drehen parallel (−0,40 / −0,42).
- Lid zu: Augenweiß 2095 → 0 Pixel.
- **Vertragstest §6:** create 1× (auch nach 5 Re-Renders), update mit ctx, dispose 1×, danach kein update. Alle 14 Geometrien und 6 Materialien von Figur, Eye-Rig und FaceHost sind freigegeben. Blinder Prüfer 4 hatte gefunden, dass dispose das Rig nicht freigab. Behoben.
- **Bewegtes Paar Studio | R3F:** `ws1/proofs/2026-10-14-f1/f1_pair_motion.png` (front, links, rechts, Lid zu, hoch, zurück); dazu `f1_pair_face.png`, `f1_front.png`, `f1_studio_front.png`. Nachstellen mit `zsh scripts/f1/serve-studio.sh`, dann `node scripts/f1/motion-pair.mjs`.

**Blinder Prüfer 4: PASS MIT AUFLAGEN.** A1 (dispose) und A2 (Vertragstest) sind behoben. A4 (Skripte eingecheckt) ist erledigt. A3 und A5 stehen in 10.3.

### 10.3 · Fragen und Befunde für WS0 (blockieren F1 nicht)
1. **Kinetik:** In Georgs Profil (und im Studio) steht `kinetics.enabled: false`. WS0 schrieb „Kinetik einschalten“. WS1 lässt Georgs Wert stehen; `setKinetics()` ist im Modul vorhanden. Bitte entscheiden.
2. **Pupille scheint durch das geschlossene Lid,** in Studio und R3F gleich. Ursache: `eyeoval.v1.js` @2bfbe0d `pupilSeatDelta` schiebt den Pupillen-Drehpunkt um ~0,006 vor, die Pupille (R·1,004) ragt dann über das Lid (R·1,011). Spender-Verhalten. V-214 verlangt „blink (lids, skin-toned)“. Bitte an den Rigging-Owner.
3. **Kein Umschauen im Leerlauf:** Der neutrale Emote hat `gaze: [0,0]`, damit bleibt der Wander-Zweig aus. Leben gibt es nur über die Lider. Gleich wie im Studio. V-201 („Umschauen, Leben“) ist damit nicht voll erfüllt.
4. **Augen → Kopf → Körper (V-214)** ist nicht Teil von F1 (das Studio hat es auch nicht). WS1 baut es im Darsteller-Slot/D1 und meldet V-214 bis dahin **nicht** als erfüllt. Blickziele gibt es heute als `lookAt(nx, ny)` (Bildschirm-Pointer des Rigs), noch nicht als Weltziel („Partner links“).
5. **Cast:** Welche Figuren mit abgenommenem Eye-Rig-Profil und sichtbarem Mund kommen auf die Bühne? Rogue_Hooded hat eine Maske.
6. **Augen-Entfernung bei Rogue_Hooded:** Im Profil steht `sourceEyeCleanupVisuallyAccepted: false`. Die Entfernung der Original-Augen ist für diese Figur also nicht abgenommen. Sichtbar ist sie sauber (Bild), aber bitte Georg bestätigen lassen.
7. **Brauen (V-179):** zurückgestellt.
   - Das Studio hat keine Brauen, Rogue_Hooded hat modellierte Brauen.
   - `brow-rig.v2` ist ein Federstrich (Tusche-Variante; laut Prüfer gibt es auch eine Tube-Variante), auf dieser Figur gäbe es doppelte Brauen.
   - ARCHITECTURE_R1 §4 nennt KFB_NATIVE mit Brauen. **Bitte:** Gelten modellierte Brauen, oder kommt `brow-rig.v2` (welche Variante) auf Figuren ohne Brauen? Bis dahin gibt es keine Brauen-Emotes.
8. **Studio-Adresse:** Die öffentliche Route liefert nur die Startseite. WS1 liefert das Studio für Referenzen aus dem Quellcode aus (`scripts/f1/serve-studio.sh`).
9. **Ruhe-Blick leicht divergent (Hinweis Prüfer):** `splay` 0,21 und `converge` 0,18 ergeben in Ruhe ≈ 4,3° nach außen. Das sind Georgs Werte, im Studio identisch.

**Als Nächstes:** Darsteller-Slot (V-227: `faceDriver` je Figur, KFB_NATIVE aus F1, Wireface als zweite Quelle), danach B1 Billboard nach R2. Die Meshy-Browser-Fassung (V-230) kommt dazwischen, wenn sie nichts aufhält.

## 9 · 14.10. nachts · Meshy-Amphitheater (Auftrag Georg, README MeshyModels @708d8fae)
- **Quell-Isolation R1 fertig:** `ws1/asset-intake/meshy-amphitheater/SOURCE_ISOLATION_R1.md`.
  - SHA-256 des unveränderten GLB: `11846848…2a9efb`, 73 029 272 Bytes.
  - Inventur: 1 Mesh, 1,62 Mio. Dreiecke, 4K-Texturen.
  - Rundum-, Innen- und Unteransichten; Bildpaar Vorschau | Render stimmt überein.
  - Befund A: offene Unterseite. Befund B: Last, gemessen auf dem M4: Geometrie ≈ 6 ms, die Texturen kosten vor allem Speicher.
- **Fragen an WS0 (§4 dort):** Ablage (kein LFS, 73 MB) und Browser-Fassung samt Werkzeug-Freigabe, Registrierung im Asset Librarian, Maßstab (Vorschlag Bühne ≈ 14 m), Einbau erst nach Billboard und F1.
- Danach geht es weiter mit **F1 Augen** laut WS0-Reihenfolge.

## 8 · 14.10. spät · S5a/S5b/S5c fertig · Billboard-Vorlagenzeile · Vorführung an Georg noch gesperrt

**Gelesen vor diesem Schritt:** `WS0_TO_WS1.md` (bis „Billboard-Standard V-220“), `DECISIONS.md` bis V-220, `BILLBOARD_STANDARD_R1.md`, `WIREFACE_STAGE_VISUAL_DONOR_FAIL_2026-10-14.md`.

**Stand:** S5a, S5b und S5c sind gebaut. Alle 9 Tests sind PASS: contract-static, deps, host, s0, s1, s1-view, s5a, s5b, s5c. Blinder Prüfer 3: PASS MIT AUFLAGEN, die Auflagen sind bearbeitet (Tabelle unten).

| Slice | Was | Vorlage (1:1) | Beleg |
|---|---|---|---|
| S5a Blase | `createBubbleLayer()` im Slot `#ui-bubbles`, `bubbleAnchors` über ModuleHost, Projektion pro Frame per `transform` (0 React-Renders beim Bewegen), Ausblenden hinter der Kamera und außerhalb des Bildes | `islands-npc.ts` (Blob 13ad2738) Z. 76–102 und 160–176; `chatterbox-core.js` (f59a8a1a) byte-gleich | `test/s5a.mjs`; Bildpaar `ws1/proofs/2026-10-14/s5a_pair.png` (links V204-Lab-Referenz, rechts Stand) |
| S5b Pool-Leser | Text nur aus ACCEPTED-Pool über `makePacket`/`consumePacket`, sonst wörtlicher Kartentext aus der Quelle, sonst „…“. Der Host zeigt nur Zeilen, die der Leser ausgegeben hat. Pool live über die Contents API (r5, Blob dfb5435b, 0 ACCEPTED), mit Zwischenspeicher gegen die Abruf-Grenze | `triplet-pool-core.mjs` (#365, Blob 517bb34b) byte-gleich | `test/s5b.mjs` (Node, deterministisch, 19 Prüfpunkte, darunter eine als TEST FIXTURE markierte ACCEPTED-Kopie) |
| S5c Spielerwahl | 2 × 2 Zurufe in fester Reihenfolge mit Tasten 1–4, Ziele ≥ 44 px, Stempel 420 ms, bis 8 eigene Wörter, Slot `#ui-choice`, Controller aus, folgt der Kamera, die Wahl wird zur Blase der Spielfigur | Studio v2 `choiceGeo()`, `place()`, Clay-pur-Antwortzeile; Vertrag „Zurufe (Player)“ | `test/s5c.mjs`; Bild `ws1/proofs/2026-10-14/s5c_choice.png` |

**S5c: Optik nicht abgenommen.** Das Studio (05.10.) ist älter als V-204 und V-214. Bewusste Abweichungen, im Kopf von `src/choiceLayer.js` aufgeführt:
1. Der Blasenkörper ist derselbe Plain-Körper wie bei der Sprechblase, ohne Rim-Wände.
2. Der Tastenkreis hat keinen Tusche-Rand.
3. Stempel und Hover haben keinen harten dunklen Schatten.
4. Es gibt noch kein Ausweichen vor Gesichtern (erst mit F1).
5. Die Zeile für eigene Wörter ist neu.

**Bitte:** Die Auswahl im Bild prüfen, bevor Georg sie sieht.

**Aufgeräumt (§5, Prüfer 3 Befund 8):** Der Spike-Dialog setzte noch Sätze aus Kartenstücken und Verbindern zusammen. Entfernt sind `LineBuilder`, `fragments`, `pickFragments` und `CONNECTORS`. Im Ritual stehen Power und Lore jetzt wörtlich. Erzählzeilen sind bis D1 ein Schnitt („…“).

**Blinder Prüfer 3 (S5a–c): PASS MIT AUFLAGEN**
| # | Befund | Stand |
|---|---|---|
| 1 | zweiter Renderer für den Blasenkörper der Wahl | behoben: ein `bubbleBodySvg()` für beide |
| 2 | mehr Studio-Abweichungen als dokumentiert (`place()` verkürzt, Mobil-Zweig, Umbruch, Wand-Schatten) | behoben: `place()` vollständig, Mobil-Zweig, Umbruch, Clay-pur-Stil mit Wand; Liste der Abweichungen korrigiert |
| 3 | Hover und Fokus fehlten | behoben (Anhebung −2 px, Fokus 3 px #e2b33c) |
| 4 | `parts` blieb veränderbar | behoben (tief eingefroren, Test) |
| 5 | beliebiges Kartenobjekt ergab eine CARD-Zeile | behoben: Text nur aus der Kartenquelle, Fremdkarte → „…“ (Test) |
| 6 | Zuruf und eigene Wörter nicht an die Spielfigur gebunden | behoben: `speaker: 'player'`, der Host prüft das (Test) |
| 8 | LineBuilder erzeugt Triplets und Brücken | behoben (siehe oben) |
| 9 | S5 ohne Debug-Schalter nicht sichtbar | offen bis D1: Wahl und Pool-Zeilen bekommen ihre Aufrufer im Dialog-Modul |
| 10 | Zipfel der Wahl zeigte ins Leere und folgte der Kamera nicht | behoben: Anker knapp über dem Kopf, folgt pro Frame (Test mit Mausrad-Zoom) |
| 11 | gleicher Rang wie die Dialog-Auswahl | behoben (`PRIO.playerChoice` 35); kein Escape, wie im Studio („steht bis zur Auswahl“) |
| 13 | Testlücken | weitgehend behoben (s5b +7 Fälle, s5c Zipfel und Folgen); `livePoolLoaded` hängt am Netz |
| 16 | Gesamtbild nicht vorführbar | **siehe Frage 8.2** |

**8.1 · Vorlagen-Zeile Billboard (V-220), bitte freigeben**
- **Gibt es schon:**
  - Branch `work/billboard-island-integration-01-2026-10-01`, Ordner `KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r2/`;
  - `briefd/billboard-clay.js` (Blob 5c9f22e1), Exporte `Billboard`, `BillboardScheduler`, `makeClayFamily`, `loadContent`, `STYLES` (mit `plain`), `layoutFor`;
  - Einbau-Vertrag `billboard.embed-spec.v1.json` (Blob 4be98228).
- **1:1 übernommen:**
  - `billboard-clay.js` unverändert. Die Imports `three` und `three/addons` löst Vite auf die eine Instanz 0.186.1 auf.
  - `bodyStyle: 'plain'`, runde Innenecken (`faceCornerM`), Bildfläche 12 × 6 m mit CanvasTexture 1024 × 512, genau ein `BillboardScheduler.tick()` im Host-Frame.
- **Neu, und warum:**
  - eine dünne Modul-Hülle `createBillboard(options)` nach `create/update/dispose`;
  - eine Inhaltsquelle „Karte“: `cardImage(deckId, n)` wird `fit` in die 1024 × 512-Fläche gezeichnet, statt der Kaleido-Inhalte aus `contentAsset`;
  - `billboard-stage.js` wird **nicht** übernommen (eigene Szene, Kamera und OrbitControls; Vertrag §1).
- **Offen:**
  - Hypernormalisation/H13: Laut RETURN 07.10. ist noch kein Zitat für die Laufzeit freigegeben. WS1 baut deshalb zunächst Körper + Karte + Scheduler und lässt die Lesefolge bis zur Freigabe leer.
  - Der Knet-TV-Knopf unter dem Billboard kommt mit der Lesefolge, als Teil desselben Schedulers (kein zweiter).

**8.2 · Vorführung an Georg: Vorschlag, S1 + S5a erst nach Billboard und F1 zu bündeln.** Heute stehen Karten als flache Rechtecke auf Bühne und Turm (gegen V-220). Die Spielfigur ist ein KayKit ohne KFB-Eye-Rig (gegen V-214). Die Kulisse ist die Hex-Insel (Legacy, V-216). Prüfer 3 nennt das Gesamtbild deshalb nicht vorführbar. Vorschlag: Reihenfolge F1 Augen → Billboard → Vorführung „Karte im Billboard + Blase + Wahl, Figur mit Eye-Rig“ auf einem kompakten Clay-Boden statt Hex. Die Karten-Aufsteller auf Bühne und Turm fallen dann weg oder gehen ins Billboard.

**8.3 · Für Claude Design (Triad-Gate im Fail-Protokoll):** Zwei der drei positiven Quellen liegen als echte Renderings aus dem Code-Pfad vor:
- (A) Plain-Blase: `ws1/proofs/2026-10-14/s5a_pair.png`;
- (B) Querformat-Karte, je gegen eine unabhängige PDFKit-Referenz: `ws1/proofs/2026-10-14/s1_pair_forget_utopia_7.png` und `s1_pair_protopia_web_2.png`.
(C) Eye-Rig folgt mit F1.

## 0 · Kurzstand
| Slice | Stand | Beleg |
|---|---|---|
| Host-Vertrag | `test:host` PASS auf Georgs Mac (V-211-Kriterium) | `ws1/kfb-planet/test/host.mjs` |
| S0 Host-Gerüst | fertig, Tests grün | `test/contract-static.mjs`, `test/deps.mjs`, `test/s0.mjs` |
| S1 Kartenbilder | fertig, Tests grün. Blinder Prüfer 1: PASS MIT AUFLAGEN; Prüfer 2 (auf die Nacharbeit): FAIL wegen Freigabe je Deck → behoben (§2) | `test/s1.mjs`, `test/s1-view.mjs`, Bildpaare §1 |
| S5a/b/c, D1 | als Nächstes (S5a entsperrt durch `replies/lab-donors/`) | – |
| Zur Abnahme durch Georg | bereit aus WS1-Sicht nach Prüfer 2 + Behebung; **Freigabe durch WS0** (V-213). Vorschlag: Prüfer 3 nur auf die Behebung, falls WS0 das verlangt | – |

Code: `ws1/kfb-planet/` (Vite + R3F, Versionen exakt nach Vertrag §1). Prüfen: `cd ws1/kfb-planet && npm ci && npx playwright install chromium && npm run build && npm test` (braucht Netz für die Karten-PDFs). Alle sechs Tests PASS: contract-static, deps, host, s0, s1, s1-view.
Host-Vertrag R1.2 liegt unverändert als `KFB_HOST_CONTRACT_R3F_R1.md` im Branch-Wurzelordner, zur V-Nummer durch WS0.

## 1 · S0 und S1 im Einzelnen

**S0 Host-Gerüst** (Vertrag §1, §3, §4, §6)
- Feste Host-Slots `#ui-bubbles` und `#ui-choice` (`index.html`).
- Ein Tasten-Router (`src/hostKeys.js`): eine Tastatur-Map, ein eigener keydown-Listener; Bewegung liest ecctrl über drei-`KeyboardControls` (Falle 3). Rangfolge Auswahl > Dialog > Editor > Figur.
- Dialog offen → Controller aus (§3.5). **Eigener Befund dabei:** Ein abgeschaltetes ecctrl rechnet weder Bremse noch Schwerkraft (Welt-Schwerkraft ist 0); die Figur glitt ungebremst weiter und kletterte Stufen hoch. Fix: Der Host setzt bei offenem Dialog jede Frame `linvel = 0` (`src/Player.jsx`). Test: W 4 s ohne Dialog → läuft, mit Dialog → 0,00 m.
- Dialog offen im Flug: Flugsteuerung aus, die Figur schwebt bis zum Schließen. Springt die Figur und ein Dialog öffnet sich in der Luft, bleibt sie dort stehen und fällt nach dem Schließen normal (bewusst so, dokumentiert).
- Fester Zeitschritt 1/60 (Schalter `#vary` entfernt). Debug nur `window.__kfb*` **und** nur mit URL-Schalter `#debug`/`#hosttest` (`src/debug.js`; Test: ohne Schalter kein `__kfb*` am window). Ausnahme dokumentiert: `window.OW_SRC`/`OW_ART` ist der Vertrag der Vorlage card-art-2d, kein Debug-Zugang.

**S1 Kartenbilder** (Vertrag §5)
- `cardImage(deckId, n)` (`src/cardImage.js`) = dünne Hülle über `src/vendor/card-art-2d.js`, **byte-gleich** mit `overworld-v13/card-art-2d.js` @main (Blob `d14b497e`), Aufruf `OW_ART.quarter()` = derselbe Code-Pfad wie im Lab-Almanach (V-206). Viertelseite, `fit`, ohne Tusche, pdf.js 4.7.76 ESM.
- Kartenquelle festgenagelt: `media/kfb` @ `ac9dbaed` (index.json Blob `af276a8b`).
- Echte Bilder auf Turm, Bühne (Aufsteller), Actor über der Figur, Planeten-Szene, Dialog und Sammlung. Platzhalter (wörtlicher Kartentext, Spike-Canvas `cardTextureLandscape`) bleibt nur während des Ladens und als Rückfall, wie in der Vorlage („Textblatt bleibt stehen“).
- **Nur Karten mit geprüfter Zuordnung zeigen PDF-Bilder** (§3.2), Freigabe je Karte: `src/cardMapping.js` liest `src/data/mapping-audit.json`; 45 von 78 Nicht-MED-Decks SAFE, darin 2344 Karten freigegeben, 114 einzeln gesperrt. Der Turm baut nur aus freigegebenen Karten. Fester Turm per URL-Schalter `#seed=N`.

**Bildpaare** (links Referenz, rechts Stand; Referenz unabhängig von pdf.js: macOS PDFKit über `scripts/crop.swift` aus MODULE_INVENTORY_R1/proofs, Titel mit Apple Vision gelesen)
| Karte | Seite/Viertel | mittlere Abweichung (0–255) | Titel im Bild (OCR) | Name im JSON |
|---|---|---|---|---|
| `forget_utopia` #7 | 3 / unten links | 10,4 | THE MOVING LAUNCH DATE | The Moving Launch Date |
| `protopia_web` #2 (erste Turmkarte bei `#seed=4242`) | 2 / oben rechts | 6,08 | The Dystopian Apathy | The Dystopian Apathy |

Trennschärfe (Prüfer 1): gleiche Karte ~10, Nachbarkarte derselben Seite 43–57, 3 px Versatz 36; Schwelle 14.

## 2 · Blinder Prüfer 1 (S0+S1): PASS MIT AUFLAGEN, 15 Befunde
| # | Befund | Schwere | Stand |
|---|---|---|---|
| 1 | Turmkarte zeigt anderes Bild als ihr Name (`suppressed_book_deck` #13) | sollte | **behoben und ausgeweitet**: eigenes Audit aller Decks (§3.2), Bilder nur für freigegebene Karten |
| 2 | Wachhund-Timer nie gelöscht, falsche Warnungen nach 20 s | sollte | behoben |
| 3 | „neu versuchen“ greift nicht, wenn pdf.js einmal scheitert (`libTried`) | sollte | teilweise: neuer Versuch nach 10 s bzw. wenn der Tab wieder sichtbar wird; `libTried` liegt in der Vorlage → Befund an WS0 (§3.1) |
| 4 | Test prüft Name gegen Name, nicht gegen Bild | sollte | behoben: Titel-OCR der Referenz gegen den Namen |
| 5 | Turm-Test nicht deterministisch (`Date.now()`) | sollte | behoben: `#seed=N` |
| 6 | Bühnen-Aufsteller ohne eigenen Test | kann | offen: Aufsteller nutzen denselben Textur-Cache-Schlüssel wie die Turmkarten, kein eigenes Bildpaar |
| 7 | `s1-view` nicht in `npm test`, kein Turm-Bildpaar | kann | behoben |
| 8 | Speicher ohne Räumung | sollte | festgehalten als bewusster Sitzungs-Cache (~60 MB je Turm), Kommentar in `cardImage.js` |
| 9 | toter Code `cardTexture` (Hochformat) | sollte | entfernt; Platzhalterweg oben benannt |
| 10 | „genau ein keydown-Listener“ stimmt zur Laufzeit nicht wörtlich | kann | umformuliert (Router + KeyboardControls) |
| 11 | `window.OW_*` nicht erfasst | kann | als Ausnahme dokumentiert und geprüft |
| 12 | Controller-Test bestätigt sich selbst | kann | behoben: Gegenprobe Bewegung (fand den Gleit-Fehler aus §1) |
| 13 | Konsolen-Warnungen lassen Tests nicht scheitern | kann | behoben (Warnungen der Kartenkette = FAIL) |
| 14 | Actor-Karte über der Figur steht schräg | kann | offen, Altlast aus dem Spike (gleich in 745431d) |
| 15 | S1 ist kein Modul nach create/update/dispose | kann | Frage an WS0 (§4.3) |

**Blinder Prüfer 2 (Nacharbeit c7f4d3f): FAIL, 1 blockierend, 7 weitere**
| # | Befund | Schwere | Stand |
|---|---|---|---|
| 1 | Freigabe je Deck lässt falsche Einzelkarten durch (85 von 2683 Karten in SAFE-Decks) | blockierend | **behoben**: Freigabe je Karte, Test mit gesperrten Beispielkarten (`anti_rules_toolkit` #51, `big_bad_brain_wrestling` #50/#51, `romantic_kayfabe` #55) |
| 2 | Matching je Karte zu locker („THE“ zählt, Nachbartext), kyrillisch/Umlaute zu streng | sollte | behoben: Füllwörter raus, Unicode erhalten, eigener Name muss besser passen als jeder andere des Decks |
| 3 | Im Flug ignoriert die Figur den offenen Dialog | sollte | behoben, Test: fliegen, Dialog auf, W + Leertaste 3 s → 0,00 m |
| 4 | In der Luft bleibt die Figur bei offenem Dialog stehen; Debug-Teleport bei offenem Dialog lässt sie schweben | kann | dokumentiert (§1); Teleport-Fall nur über Debug erreichbar |
| 5 | Kein neuer Versuch bei Fehlschlag im sichtbaren Tab; möglicher Flackern bei neuem Versuch | sollte | behoben: Timer 10 s; fertige Karten laden nicht neu |
| 6 | Gesperrte Karten zählen als Fehlschlag | kann | behoben (`blocked` statt `failed`) |
| 7 | Testlücken (Name gegen Bild nur für 2 bekannte Karten, Regel nur Teilmenge, Flug ungetestet) | sollte | behoben bis auf: Name gegen Bild weiterhin an 2 Referenzkarten plus Audit für alle |
| 8 | Turmbild ohne Referenz; Debug-Globals ohne URL-Schalter | kann | Debug behoben; Turmbild bleibt Sichtprüfung (die erste Turmkarte hat ein Bildpaar) |

## 3 · Befunde für WS0

**3.1 · Vorlage `card-art-2d.js` (overworld-v13, Blob `d14b497e`), nicht geändert**
- Gleichzeitige Aufrufe von `quarter()`: Nur der erste bekommt ein Bild. `ensureLib()` setzt `libTried = true` vor dem Laden von pdf.js; jeder zweite Aufruf während dieses Ladens bekommt still `null`, ohne Warnung. Im Lab fällt es nicht auf, weil `art()` über eine Warteschlange läuft, `quarter()` aber nicht. WS1 reiht die Aufrufe in der Hülle ein (`src/cardImage.js`).
- Scheitert der erste pdf.js-Import (Netz, Wachhund), bleibt das Modul für die Sitzung ohne pdf.js (`libTried`), jeder weitere Aufruf liefert `null`.
- `quarter()` hat keinen Wachhund (pdf.js rendert über rAF und hängt im Hintergrund-Tab); WS1 hat ihn in der Hülle ergänzt.

**3.2 · Registry `media/kfb/index.json` @ac9dbaed: Kartenzuordnung bei 33 von 78 Decks nicht belegbar, dazu 114 Einzelkarten in den übrigen**
Methode: `scripts/audit-mapping.py` + `scripts/audit-mapping.swift`: jede Kartenseite mit PDFKit rendern, Viertel nach Registry-Regel schneiden, Text mit Apple Vision lesen, Titel gegen `cards.json` (Registry @ac9dbae). Karte ok = eigener Name im Titelbereich (≥ 0,75) und besser als jeder andere Kartenname des Decks; Deck SAFE = mindestens 85 % der lesbaren Karten ok; Bild nur für Karten in `ok`. Rohdaten je Deck (OCR-Zeilen je Viertel): `ws1/kfb-planet/test/audit/`, Ergebnis: `src/data/mapping-audit.json`.
- **15 Decks um genau eine Seite verschoben**: Das Viertel n zeigt Karte n+4. Die PDFs haben kein Deckblatt, die Registry sagt aber `coverOffset 1`. Vermutlich ist `coverOffset 0` richtig, siehe Tabelle.
- 2 Decks ohne PDF auf GitHub (404).
- Bei den übrigen passen nur einzelne Karten, oder die Abweichung ist uneinheitlich. Belegte Einzelfälle (Prüfer 2, per PDFKit-Bild angesehen): `anti_rules_toolkit` „The Skill Issue“ doppelt in cards.json (#50/#51), ab da um eine Karte verschoben; `big_bad_brain_wrestling` #50/#51 vertauscht; `romantic_kayfabe` #54–#56 auf einer Hochformat-Seite; `unspoken_systems_kayfabizarro_meta_deck_01` #38 „TIGHT LOOP“ im JSON, „TRUST LOOP“ im Bild.
- **Bitte:** Die Registry-Daten sollte ihr Eigentümer korrigieren, nicht das Spiel. WS1 zeigt für diese Decks bis dahin nur den Platzhalter mit wörtlichem Kartentext und baut aus ihnen keinen Turm.


| Deck | Karten eindeutig belegt | Befund |
|---|---|---|
| `1001_kayfabe_nights` | 0/53 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `anti_rules_toolkit` | 39/57 | einzelne Karten abweichend oder unlesbar |
| `bullshit_jobs_uncut` | 43/56 | einzelne Karten abweichend oder unlesbar |
| `cosmic_grift_dark_journalism` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `deep_state_plumbing` | 36/52 | einzelne Karten abweichend oder unlesbar |
| `epistemic_sabotage` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `federal_kayfabe` | 0/56 | teils verschoben (+4), uneinheitlich |
| `frizzlebob_s_ego_mania_narcissist` | 37/56 | einzelne Karten abweichend oder unlesbar |
| `frizzlebob_s_kayfabizarro_kompendium_elender_wic` | 0/60 | ganze Seite verschoben (Viertel n zeigt Karte n-4) |
| `frizzlebob_s_mission_control` | 30/56 | einzelne Karten abweichend oder unlesbar |
| `geopolitical_thrillers_conspiracy_theories` | – | PDF fehlt (404) |
| `grimms_kayfabe_legends_expansion_set_02` | 0/52 | teils verschoben (-4), uneinheitlich |
| `help_i_am_a_human` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n-4) |
| `jung_and_shinn_a_guide_to_cosmic_cringe` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `kayfabizarro_improv_comedy` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `kayfabizarro_monomyth_mayhem` | 35/56 | einzelne Karten abweichend oder unlesbar |
| `kayfabizarro_pulitzer_punk` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `kayfabizarros_ontological_hazards` | 11/47 | teils verschoben (-4), uneinheitlich |
| `museum_of_modern_mess` | 0/48 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `nibelungen_booster_pack_design` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `observation_underground` | 37/48 | einzelne Karten abweichend oder unlesbar |
| `philosopher_dungeon_raid` | 0/10 | teils verschoben (-4), uneinheitlich |
| `platos_dungeon_raid_hero_set_01` | – | PDF fehlt (404) |
| `reality_redrawn` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `shadow_monopoly_blackrock_vanguard_co` | 0/56 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `shakespearean_animal_beatdown` | 0/5 | einzelne Karten abweichend oder unlesbar |
| `suppressed_book_deck` | 0/20 | teils verschoben (-4), uneinheitlich |
| `the_biological_metropolis` | 0/32 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `the_biology_of_rebellion_hilfe_ich_bin_ein_mensc` | 0/32 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `the_carnival_of_unsolved_problems_therapy` | 0/44 | ganze Seite verschoben (Viertel n zeigt Karte n+4) |
| `the_importance_of_being_kayfab_earnest` | 0/9 | teils verschoben (+4), uneinheitlich |
| `the_uruk_rumble` | 0/0 | einzelne Karten abweichend oder unlesbar |
| `unspoken_systems_kayfabizarro_meta_deck_01` | 46/56 | einzelne Karten abweichend oder unlesbar |

SAFE-Decks mit einzeln gesperrten Karten (114 Karten in 38 Decks), Liste je Deck in `src/data/mapping-audit.json` (Feld `blocked`).

Zählung: 45 von 78 Nicht-MED-Decks SAFE, 2344 Karten mit freigegebenem Bild.

## 4 · Fragen an WS0 (keine blockiert den nächsten Slice)

**4.1 · Hex-Insel gegen V-194.** Der Integrationsplan R1 (13.10.) sagt „Diese Teile bleiben: … Hex-Insel und Deck-Turm“ und plant S2 Clay „für Hex-Boden“. V-194 (12.10.) sagt „Hex-Raster ist Legacy und keine Grundlage“. Georg hat das am 14.10. bemerkt. Empfehlung des WSA-Web-Chats (von Georg weitergereicht), der WS1 folgt, bis WS0 entscheidet:
- Die Hex-Insel ist nur noch eine **ausdrücklich als Legacy bezeichnete Testkulisse**. Karten, Eingabe, Figuren und Blasen sind davon entkoppelt (für S0/S1 erfüllt: nichts davon hängt am Hex-Raster). Der Deck-Turm wird keine architektonische Voraussetzung.
- S2 Clay wird nicht auf Hex-Boden ausgerichtet.
- Für die erste Wireface-/ChatterBox-Bühne: kompakter, organischer Clay-Boden mit flacher Spielfläche, Billboard, zwei Figuren, Blasen, Kontaktschatten, SKY3, ohne ganze Inselwelt.
- Terrain/God-Mode später über den bestehenden Worldbuilder-Owner (WB2/Surface-Truth-Donors); ein versteckter Hex-Index nur, wenn er messbar gewinnt.
- **Bitte:** Integrationsplan R1 gegen V-194 korrigieren und die Terrain-Frage an den Worldbuilder-Owner geben.

**4.2 · Registry-Korrektur (§3.2).** Wer korrigiert `coverOffset` der 15 verschobenen Decks, die 2 fehlenden PDFs und die Einzelfälle in `cards.json` (z. B. doppelter Name in `anti_rules_toolkit`)? Nach einer Korrektur: neuen `MEDIA_COMMIT` nennen, WS1 lässt das Audit neu laufen (`python3 scripts/audit-mapping.py`).

**4.3 · Einordnung S1.** `cardImage()` ist kein Modul nach `create/update/dispose`, sondern ein Host-Dienst (liefert three-Texturen, kein `object3d`), und hat deshalb keinen Vertragstest nach `test/host.mjs`. Bitte bestätigen oder anders einordnen.

**4.4 · V-Nummer für Host-Vertrag R1.2** (Datei im Branch-Wurzelordner, unverändert aus dem OneDrive-Ordner WS1).

## 5 · Pool-Kandidaten für Georgs Ankreuz-Seite (V-213 Punkt 2c)
Quelle: `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_TRIPLET_OPENER_POOL_R1_2026-10-13.json` auf PR #379, Head `d788e429`, Blob `dfb5435bc0c913ea48f8f5558f801b293962fbc8` (= „final r5“ laut Consumer-Vertrag #365). Alle Einträge, die nicht ACCEPTED sind. Text wörtlich (`pattern` bzw. `surfaceText`), nichts umformuliert, nichts ergänzt. `{title}` ist der Platzhalter für den Kartennamen und gehört zum Text.


| # | Art | ID | Version | Status | aktiv | Text (wörtlich) |
|---|---|---|---|---|---|---|
| 1 | Opener | `DIRECT` | 1 | EDITORIAL_CANDIDATE | ja | {title}. |
| 2 | Opener | `HEARD_OF` | 1 | EDITORIAL_CANDIDATE | ja | Ever heard of {title}? |
| 3 | Opener | `DO_YOU_KNOW` | 1 | EDITORIAL_CANDIDATE | ja | Do you know {title}? |
| 4 | Opener | `EVER_TASTED` | 1 | EDITORIAL_CANDIDATE | ja | Ever tasted {title}? |
| 5 | Opener | `I_ONCE_MET` | 1 | EDITORIAL_CANDIDATE | ja | I once met {title}. |
| 6 | Opener | `RESTAURANT_ORDERED` | 1 | EDITORIAL_CANDIDATE | ja | I went to a restaurant and ordered {title}. |
| 7 | Opener | `ANYONE_HEARD_OF` | 1 | PROPOSED | nein | Anyone here heard of {title}? |
| 8 | Opener | `LET_ME_TELL_YOU_ABOUT` | 1 | PROPOSED | nein | Let me tell you about {title}. |
| 9 | Opener | `QUICK_QUESTION` | 1 | PROPOSED | nein | Quick question. Ever heard of {title}? |
| 10 | Opener | `YOU_KNOW_THE_THING_WITH` | 1 | PROPOSED | nein | You know the thing with {title}? |
| 11 | Opener | `DID_YOU_EVER_TRY` | 1 | PROPOSED | nein | Did you ever try {title}? |
| 12 | Opener | `WHAT_IF` | 1 | PROPOSED | nein | What if {title}? |
| 13 | Opener | `HAVE_YOU_HEARD` | 1 | PROPOSED | nein | Have you heard of {title}? |
| 14 | Opener | `EVER_HEARD_BEFORE` | 1 | PROPOSED | nein | Have you ever heard of {title}? |
| 15 | Beat | `wrinkle_rumble:10:compact` | 3 | EDITORIAL_CANDIDATE | – | The Cookie of Causality restarts the war over a snickerdoodle at Turn One, but keeps all the damage. |

Summe: 15 Einträge nicht ACCEPTED. ACCEPTED: 0.

## 7 · Neu 14.10. spät: Stopp für Figuren und Gesichter (Georg), Frage an WS0 (blockiert D1)
Georg hat am 14.10. zwei Abweichungen gefunden: das Hex-Raster (§4.1) und fehlende KFB-Gesichter. Die Figuren im Rahmen sind KayKit-Originale, ohne KFB-Eye-Rig und ohne Mund. Für Wireface braucht es beides. Der Integrationsplan R1 sieht keinen Gesichts-Slice vor. Register: V-061/V-090 (Eye-Rig in Georgs Konfiguration, EYE-CLEANUP-01), V-200/V-201 FAIL (eigener Slice „Augen-Wiederherstellung“ 1:1 aus dem Eye-Rig-Studio), V-086 (KFB-Münder, Backlog), V-179 (Brauen jetzt, Mund später), PR #355 (Gesichtskanäle gehören dem Composer: KFB_NATIVE | WIREFACE_MESH | WIREFACE_MODEL, je Region genau ein Treiber).
- **WS1 baut bis zur Entscheidung nichts mit Figuren oder Gesichtern** (D1-Sprecher, Wireface). S5a (Blasen-Ebene) hängt nicht an Figuren und läuft weiter. S5b und S5c ebenso.
- **Frage 4.5 an WS0:** Ein Gesichts-Slice vor D1: Woher kommen Eye-Rig, Brauen und Mund? Vorschlag: aus dem nativen Gesichtsteil des Composers (#355), als Modul nach `create/update/dispose` eingehängt. Mit welcher Abnahme (Nahbild-Paar Studio | Spiel, V-201)?
- **Frage 4.6 an WS0:** Referenzbild für V-204. Im Repo liegt nur `evidence/s2_bubble_still.jpg` aus dem ChatterBox-Studio-Cut. Es zeigt die alte Tusche-Variante und Figuren ohne KFB-Augen, ist also kein gültiges Referenzbild. Bitte ein abgenommenes Standbild der Plain-Blase aus dem Lab in `replies/lab-donors/` legen. Bis dahin prüft der S5a-Test die V-204-Merkmale am gezeichneten SVG (nur Flächen, kein Strich, ein Zipfel, Schatten, Flip 520 ms).
- **Neue WS1-Regel gegen Drift:** Vor jedem sichtbaren Baustein prüft WS1 die Vorlage gegen `DECISIONS.md` und nennt die betroffenen V-Nummern in der Vorlage-Zeile. Eine Vorlage, die älter ist als eine Entscheidung, die sie ablöst, zählt nicht als Referenz. Der blinde Prüfer bekommt `DECISIONS.md` mit.

## 6 · Als Nächstes
1. **S5a Blase:** `createBubbleLayer({host})` aus `replies/lab-donors/islands-npc.ts` (`say/layoutTri/draw`, Blob `13ad2738`) herauslösen, `chatterbox-core.js` 1:1 (V-204 plain, Flip 520 ms), Host projiziert `bubbleAnchors` in `#ui-bubbles` (Vertrag R1.2 §4, V-212). Aus dem Lab-Weg wird **nur die Darstellung** übernommen: Das Lab holt seine Zeilen über `prepareResidentTurn` aus `RUNTIME_POOL` (PR #310). Das ist nicht der KEEP-Pool (#379) und wird nicht verwendet.
2. **S5b Pool-Leser:** `consumePacket` aus `triplet-pool-core.mjs` (#365), accepted-only. Solange nichts ACCEPTED ist: wörtlicher Kartentext der eigenen Karte (Name, Power oder Lore, unverändert) oder „…“.
3. **S5c Spielerwahl** „choice“ 2 × 2 in `#ui-choice`, Zifferntasten, optional bis 8 eigene Wörter.
4. **D1 Dialog-Modul:** Regel-Logik aus Spike-`Dialog.jsx`, ohne LineBuilder, `fragments` und `CONNECTORS`. **Wartet auf die Antwort zu §7 (Gesichter).**
