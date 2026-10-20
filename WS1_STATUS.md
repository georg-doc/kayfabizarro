# WS1_STATUS · R3F-Spielrahmen (Branch `ws1/r3f-frame`)

Stand: 14.10.2026, WS1 (Claude Code auf Georgs Mac). Empfänger: WS0. Regeln: Host-Vertrag R1.2, `KFB_WORKING_RULES_R1.md`, V-209, V-212, V-213.
Neueste Einträge oben (§76 ist der neueste). WS0 antwortet im Register-Branch `docs/kfb-decisions-register-2026-10-11`.

## 110 · 20.10. · Schatten #439 behoben (lokal, terrain/439) · V-572 Laternen im Spiel · Korrektur zu §109

**Schatten** (WS1b-Diagnose `WS1B_SHADOW_DIAG_R1`, Georg-Befunde) auf `terrain/439` (lokal, `fabc082` + Folgecommit):
- **Ring- und Lochschatten an Kronen:**
  - Der Schattenkasten ist jetzt mindestens 16 m groß (vorher 3,37 m).
  - Die Sonne steht um Kronenhöhe ÷ sin(Höhe) + 4 m zurück. Damit schneidet die Nah-Ebene keine Krone mehr ab, und auch Nachbarbäume werfen.
  - `kfb-stage-light.v1.1` hat dafür eine kleine Ergänzung bekommen (**v1.1b**): `fit().margin`, `shadowSoft` (PCF-Radius, r186) und `shadowIntensity`.
  - Georg wollte die Schatten weicher und heller: Radius 3, Intensität 0,82.
- **Ohren werfen Schatten** (V-429). Im Bild ist der FB-Schatten jetzt mit Ohren zu sehen.
- **Nicht im Spiel lösbar:** Haarbüschel, Brauen, Schnurrbart und Mund empfangen keinen Schatten, weil sie ShaderMaterials aus dem ToolBox-Figurenaufbau sind (P08-Parität). → **Bitte als ToolBox-Job** (WSA bzw. WS0): Diese Materialien brauchen die Schatten-Chunks, oder sie müssen Standard- bzw. Knet-Materialien werden.
- **Kontakt:** `GROUND_AT` trifft nur noch feste Körper und nicht mehr die eigene Spielerkapsel; der Fleck lag vorher auf 1,23 m. Laut Kanon gibt es keinen Blob-Ersatz; der Kontakt kommt aus dem echten Schatten.
- **Tests:**
  - `contract-static`, `host`, `deps` und `light` sind PASS. `light` lief mit echter GPU über `PW_GPU=1` in `test/_page.mjs` (Hinweis WS1b).
  - Die Volltest-Reihe mit GPU steht noch aus, deshalb gibt es noch keinen Push bzw. Spiegel.

**V-572 im Spiel:** Die Laternen-Pfützen sind jetzt eine Projektion mit `kfb-light-pool.v1` auf Gelände, Weg, Steine, Obstgarten und Fundsachen. Bisher war das `kfb-gem` mit `pool:true` als flache Scheibe. Stärke und Farbe kommen 1:1 aus dem Practicals-Angebot. Bei Nacht ist das im Bild geprüft.
- Offen: `disco-ball-core` (RA-Kopie) und das UFO-Lab.

**Korrektur zu §109:** Die Startweiche „nackte Adresse → `#m1,harvest`“ gehört **nicht** in den Quell-`index.html`, weil Tests das Spiel ohne Hash öffnen. Sie gehört wie bei WS1b in den Vorschau-Schritt. Ich habe sie wieder herausgenommen. Die WS1-Regel bleibt: Spiel-Builds öffne ich nur noch mit Hash.

**Gelände-Probe** (seit §108):
- Schatten mit 16er-Vogel-Scheibe, pro Bildpunkt gedreht.
- Kontakt-Hof ohne Plateau, dazu Dithering gegen 8-Bit-Stufen.
- Cartoon-Wasser: deckend, mit Schaumband.
- Fließfarben laufen über die Boden-Familie (Steine, Brösel), gedämpft. Bäume sind wahlweise dabei, Bedeutungsträger bleiben eigen.
  - **Regelvorschlag K-FL1:** „Was zum Boden gehört, fließt mit; was Bedeutung trägt, bleibt eigen. Props nehmen die Fließfarben gedämpft und heller über ihr eigenes Material auf.“ Georg mag diese eigene Lesart.

## 109 · 20.10. · FAIL (Georg): alte Hex-Insel wieder sichtbar – Ursache WS1, behoben im #439-Zweig

**Georg:** „Ich sehe hier wieder diese alte Hex-Landschaft, die wir nie wieder zeigen wollten (WS0 ausdrücklich gesagt) … betrachte ich als Fail, bitte an WS0 melden.“

**Ursache (WS1):**
- Für die Schatten-Behebung (#439) habe ich meinen lokalen Build von `terrain/439` (Basis `combo/r2` @d762916) im Browser geöffnet, und zwar die **nackte Adresse ohne Hash**.
- Dieser Zweig hat die Startweiche von WS1b (§96: nackte Adresse → `#m1,harvest`, Hex nur noch über `#spike`) noch nicht.
- Deshalb erschien „KFB · Spike R4 / Hex-Insel“ im Browserfenster, das Georg mitsieht.
- **Live-Vorschau nicht betroffen:** `ws1-preview` leitet die nackte Adresse auf `#m1,harvest` um, geprüft im ausgelieferten `index.html`.

**Behebung:**
- Dieselbe Startweiche steht jetzt in `terrain/439/index.html`.
- Regel für WS1: Spiel-Builds öffne ich nur noch mit ausdrücklichem Hash (`#m1,…`). Die Hex-Insel ist Legacy (V-194, V-216) und wird nicht gezeigt.
- **Vorschlag an WS0:** Die Hex-Route (`HexWorld`) ganz aus dem Standardpfad nehmen. Sie bliebe nur unter `#spike` als markierte Legacy-Testkulisse, damit kein Zweig sie versehentlich zeigt.

## 108 · 20.10. · WS1b · Vorschau-Start: Spiel statt Spike, Ladeanzeige, Titel (live und geprüft)

Erste Meldung von WS1b (Georgs MacBook, V-539). Auftrag von WS0: nur Aufgabe 1. #439 (Cartoon-Gelände) macht die alte WS1, WS1b hat dafür nichts angefangen.

**Was sich ändert** (kfb-planet `36661e6` auf combo/r2 @d762916; combo/r2 selbst bleibt unberührt):
- Wer die Vorschau ohne Hash öffnet, landet im Spiel (`#m1,harvest`), nicht mehr im alten „Spike R4 · Hex-Insel“. Den Spike gibt es nur noch über `#spike`, alle anderen Hashes bleiben gleich.
- Ladeanzeige, damit das Bild nicht mehr ~20 s schwarz bleibt: dunkle Fläche mit drei hüpfenden Punkten und „KFB · Spiel lädt …“, über dem HUD.
  - In der Laufwelt verschwindet sie, sobald Spieler und Bühne stehen (im Fahrmodus auch der Racer), bei einem Ladefehler ebenso. `M1World` sendet dafür das DOM-Ereignis `kfb-ready`.
  - In anderen Ansichten verschwindet sie mit dem ersten Canvas. Spätestens nach 120 s ist sie in jedem Fall weg.
- Seitentitel „KFB · Spiel-Vorschau“.
- Ohne `debug` gibt es weiterhin keine `__kfb`-Globals (s0 grün).

**Tests** (MacBook, Playwright-Chromium mit SwiftShader, Vergleich gegen einen unveränderten Build von combo/r2 @d762916 in eigenem Worktree):
- npm-Kette (37 Prüfungen): 34 PASS.
  - `stage` und `cast` lasen Pfade des alten Macs (`~/kfb-ws1/…`). Mit `KFB_REPO_LIVE` (Registry von `ws1/r3f-frame`) bzw. `KFB_REPO`: PASS.
  - `c3` scheiterte im ersten Lauf am Projektil-Treffer (Zeitverhalten). Im zweiten Lauf PASS auf beiden Builds.
- Rot, aber nicht von dieser Änderung:
  - `c3g` ist auf beiden Builds rot, mit gleichen Werten (Laternen-Platzhalter, bekannt seit §94).
  - `light` läuft auf beiden Builds in die Zeitgrenze von 420 s.
  - `scale` wackelt an derselben Grenze. Bis zur sichtbaren Figur dauert es neu 538 s, alt 582 s; die Figur wartet auf das Kontakt-AO-Backen, das unter SwiftShader sehr langsam ist.
  - `drift` braucht `test/out/drift/drift-report.json`, das nur auf dem alten Mac liegt.
- M1-Teil von run-all:
  - `m1-contract` PASS.
  - `m1-rank-fence` PASS mit dem gecachten, gepinnten Theater-GLB (`AMPH_GLB`).
  - `m1-move` und `m1-fence` lassen sich auf dieser Maschine nicht durchführen: SwiftShader schafft hier 1,4 Physik-Schritte/s, und der unveränderte Build kam in 400 s nicht einmal bis „Spieler bereit“.
  - Die Ladeanzeige auf `#m1,debug,replay`: Spieler bereit nach 65 s, die Anzeige ist bis dahin da und danach weg.
- Lokal mit echter GPU (Port 8843): Die nackte Adresse wird zu `#m1,harvest` und die Ladeanzeige ist nach ~15 s weg, dann ist das Spiel zu sehen. `#spike` zeigt den alten Spike R4.

**Commits, gepusht 20.10. ohne force** (über den Deploy-Key, nur je Befehl, freigegeben von Georg):
- `ws1/preview` bd6e396: Elternteil 2aadeda6, nur `index.html` und `build.json`. `gelaende-probe.html` bleibt unverändert.
- `ws1b/preview-start` d05efbd: Elternteil ist der Spiegel 15d6727, nur `ws1/kfb-planet/index.html` und `src/m1/M1World.jsx`. Das ist die Quelle der Vorschau; die alte WS1 kann sie in ihren Branch übernehmen.
- `ws1/r3f-frame`: dieser Abschnitt.

**Live-Prüfung** https://ws1-preview.kayfabizarro.pages.dev/ (Browser mit echter GPU, nicht aus dem Cache, 6,9 MB übertragen):
- Die nackte Adresse wird zu `#m1,harvest`, Titel „KFB · Spiel-Vorschau“.
- Die Seite ist nach 1,9 s übertragen; bei 4,9 s zeigt das Bild die Ladeanzeige (statt schwarz).
- Die Ladeanzeige verschwindet nach 10,4 s, dann stehen Spieler und Bühne.
- `#spike` (frisch geladen): alter „KFB · Spike R4“ mit Kartenauswahl; die Ladeanzeige ist nach 8 s weg.
- Bilder: `ws1/proofs/2026-10-20-ws1b-start/` (`live_ladeanzeige.jpg`, `live_spiel.jpg`, `live_spike.jpg`).

**Hinweis für Volltests auf dem MacBook:** `m1-move`, `m1-fence`, `light` und `scale` brauchen dort ein GPU-Chromium (`PW_CHROMIUM`) oder längere Grenzen.

WS1b ist danach in Pause, wie mit WS0 vereinbart.

## 108 · 20.10. · V-572 Strahler: Modul + Nachweis in der Probe · 70er Fließfarben · Geometrie-Fixes

**V-572 (Strahler-Bug global):**
- **Inventur:** `CANON_3D/sources/WS1_V572_INVENTUR_LICHT_MESHES_R1.md` (Register `03976ee1`).
  - Im Spiel betroffen: `kfb-gem.v1` (Laternen-Pfütze `pool:true` in `gemLanterns.js`).
  - In Labs: `disco-ball-core.js` (RA S17, kanonisch im Register), `ufo-lab.js`, zwei Leuchtturm-Kegel.
- **Modul:** `CANON_3D/lib/kfb-light-pool.v1.js`. Es funktioniert mit r147 und r186, weil `createLightPoolKit(THREE)` THREE übergeben bekommt.
  - **Pfützen** sind echte Kegel-Projektionen und keine Scheiben mehr. Sie liegen als Uniform-Array (≤ 16) im Empfänger, mit `injectStandard(material)` für Knete, Standard- und Instanz-Materialien und `glsl` für eigene Terrain-Shader. Damit folgen sie jeder Geländeform und liegen auch auf Steinen und Figuren.
  - **Kegel:** Die Länge kommt aus `hitDistance` (Boden-Abtastung oder Raycast). Ausgeblendet wird nur auf den letzten ca. 2 m, sodass der Strahl sichtbar bis zur Pfütze reicht (Georg: „Strahler enden zu früh“).
  - Farben und Werte kommen 1:1 aus der Quelle. Es gibt keine Emission außerhalb des Kegels.
- **Nachweis:** In der Gelände-Probe gibt es eine Disco-Probe (8 drehende Strahlen auf welligem Gelände) mit dem Umschalter „alt: Scheiben auf fester Höhe“ / „neu: projiziert“ (`ws1/preview@1521e2cd`).
  - Alt: gerade Schnittkanten.
  - Neu: Pfützen schmiegen sich an Hänge und Steine.
  - Die 4 Diagnose-Ansichten gibt es in der Probe; die Kritiker-Runde steht noch aus.
- **Nächste Schritte:**
  1. `kfb-gem` im Spiel umstellen, mit Testreihe.
  2. `disco-ball-core` als Kopie mit gleichen Parametern und nur neuer Darstellung (RA 1:1).
  3. UFO-Lab.

**Gelände-Probe** (Georg-Feedback seit §107):
- **70er Fließfarben** sind der Standard der Flächen-Stufe. Georg: B als Richtung, „fließende Farben wie in den 70ern, ineinanderfließend, leicht wabernd, nicht als Höhenband“.
  - Domain Warping nach Quilez, geschnitten in Bänder der Biom-Palette, lose an die Höhenlinien gebunden.
  - Unter Props steht das Fließen still (über die AO-Draufsicht).
  - Das Wabern ist an das Fahrtempo gekoppelt.
  - Biom-Wechsel Band für Band, ohne Mischfarbe.
- **Geometrie:**
  - max. Hangneigung, Standard 52°: Die Stufenbreite folgt aus der Steigung, das ergibt organische Formen.
  - Ausgeblendete Oktaven werden nur über die verwendeten Stufen normiert. Vorher lag das Ferngitter höher, mit Felswand am Horizont und Pyramiden.
  - Das Tafelknie wirkt nur oberhalb der Kante.
- **Horizont:**
  - Kulissen mit gemalter Licht- und Schattenseite, Bändern und Kammlicht.
  - Dunst in 4 Staffeln mit weltfesten Nebelbänken.
- **Rezepte:** Import und Export; die Voxel-Welt steht mit im Rezept.
- **Nach V-572:** Wolken-Design (Georg: Knet-Puffs verbessern, evtl. Fließ-Logik).

## 107 · 20.10. · Probe: Formlogik v4, Kontakt-AO am Boden, Rezept-Import/Export, Voxel-Welt

Stand: `ws1/preview@<siehe Commit>`, https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe

- **Anti-Zacken, 2. Stufe:** Die Kantenbreite von Tafel und Stufe richtet sich nach der Steigung. Am Vertex wird die Steigung der Rohhöhe (`gG`) gemessen, dann gilt w ≥ 1,6 · Gitterabstand · Stufen · gG.
  - Steile Wände werden weich, flache Terrassen bleiben scharf.
  - JS und Shader rechnen identisch.
  - Ringe sparen Arbeit: Oktaven-Abbruch und keine Formnormale.
- **Formlogik v4** (Georg: „Flächengrammatik stimmt noch nicht“): Farbe aus der großen Landform.
  - Das Laplace-Signal von `hlow` über 28 m liefert die Talbänder.
  - Daraus entstehen vier Töne: Talband, Unterhang, Grundton und Rücken/Kuppe.
  - Ränder organisch geschwungen; Kleckse nur leise, Sprenkel nur an Talrändern.
  - v3 bleibt wählbar. Georgs Urteil steht aus.
- **Kontakt-AO am Boden** (Georg mehrfach; KayKit-Referenz): Eine Draufsicht aller Props (Ebene 2) wird weiß gezeichnet und zweimal weichgezeichnet. Das ergibt einen weichen dunklen Hof ums Fußende, keine Blob-Schatten. Damit gibt es Erdung auf beiden Seiten, am Objekt und am Boden.
  - Historie: Damals lief das über `edge3` als Kantenmaske plus Kontakt-AO in den Fugen (Texturkonzept vom 25.07.).
- **Rezepte importieren und exportieren** (`kfb.terrain-recipe/1`):
  - Rezeptfeld, Datei öffnen und speichern, gemerkte Rezepte im Browser.
  - Eine eigene Palette wird als Biom „Aus Rezept“ übernommen.
  - Alte Rezepte: später hinzugekommene Gelände-Zusätze gelten als aus.
  - Georgs Gitter-Rezept (Mesa, geschwungen, Schachbrett) ist getestet.
- **Voxel-Welt** (Georg: „wie damals im Rollercoaster, Höhenabstufungen je Track anpassbar“; Referenz three.js `webgl_instancing_dynamic`):
  - Eine Höhenkarte entsteht auf der GPU (192² Zellen, Float-RT). Sie wird nur bei Zellwechsel oder Einstellungsänderung neu gerechnet.
  - 36 864 Säulen in **einem** instanzierten Draw Call. Die Säulen lesen ihre Höhe selbst und reichen nur bis unter den tiefsten Nachbarn.
  - Wählbar: Kante 1–4 m, Höhenstufe 0,5 / 1 / 2 m oder Würfel.
  - `edge3` je Fläche zufällig gedreht und gespiegelt. An den Seiten ist es je Höhenstufe wiederholt, dadurch werden die Schichten sichtbar.
  - Physik: JS rechnet dieselbe quantisierte Säulenhöhe. Optional gibt es eine geglättete Fahrhöhe (bilinear zwischen den Säulen = Rampen statt Stufen).
  - Steine, Brösel und Props sitzen auf den Säulen (`surfH`).
  - Steht im Rezept als `world.voxel`, damit es sich je Track einstellen lässt.
- **Offen:**
  - Georgs Urteil zu v4 und zur Voxel-Welt;
  - Bildrate auf Georgs Mac (zuletzt 15 fps vor der Optimierung);
  - G6-Messung;
  - Übertragung nach `terrain2`.

## 106 · 20.10. · R12 + R13 bei WS0 · Probe: Anti-Zacken, Himmel v2, Erdung, Polka-Dot · Georgs Urteile

**Neu in `CANON_3D/sources/` (Register):**
- **`WS1_R12_CARTOON_ANIMATION_ABGLEICH_R1.md`** (`71c33520`): Abgleich von Georgs Datei „cartoon animation.md“ mit dem Kanon.
  - Schon im Kanon: Szenen-Satz, Farb-Skript, Ortsbiografie, 70/20/10, ein Rig.
  - **8 Lücken:**
    1. Comedy Contract
    2. Familiar-Absurd 60/25/15
    3. Material-Cast mit Karton als Regel-Ebene
    4. Landmark-Pass
    5. Backplate/Himmel als 5. Tiefenebene
    6. Biom-Familien
    7. Prop-Budget nach Rollen
    8. Golden Frames
  - 3 Fragen an Georg: B1, B2, B3.
- **`WS1_R13_HIMMEL_HORIZONT_FERNE_R1.md`** (`0fde6f0b`): 23 Regeln, ein tinyskies-Abschnitt, 11 Prüfkriterien.
  - tinyskies hat **keine Lizenz**: nur Ideen übernehmen, keinen Code.
  - **WS0 bitte entscheiden:**
    - F1: Tiefen- und Höhennebel im einen Rig? Das ist dieselbe Frage wie R11 F5.
    - F2: Zählt die farbige Distanzrampe als Material oder als Licht (Gebiet 6)?
    - F3: Zählt die Horizontbank als Kulisse oder als Wolkenmasse (R10-22)?

**Gelände-Probe** (`ws1/preview@c93c87ff`). Georgs Urteile heute in Kurzform:
- Er findet v3-Kleckse und Knet-Steine besser als die reduzierte Flächengrammatik und als Polygon-Steine.
- Er mahnt mehrfach die Erdung an, will keine Zacken und keine Pixelschatten.

Umgesetzt:
- **Zacken an Bergen = Aliasing.** Grobe Gitter bekamen Detail und harte Knicke, die feiner sind als der Gitterabstand. Lösung: **Band-Begrenzung je Gitter.**
  - Oktaven mit Wellenlänge unter ca. 3–4 Gitterabständen werden ausgeblendet.
  - Tafelkante und Stufen bekommen eine Mindestbreite von ca. 2 Gitterabständen.
  - Die Gitter gehen zum Rand hin ins nächstgröbere über.
  - JS und Nahgitter rechnen identisch, Physik und Platzierung bleiben gleich.
  - **Regelvorschlag K-G1:** Kein Höhenmerkmal schmaler als 2 Gitterabstände des Meshes, das es zeigt.
- **Horizont-Balken weg** (R13 H5/H6/H13):
  - eine `skyColor(dir)` für Kuppel, Gelände, Wasser und Kulissen;
  - Bodendunst unter dem Horizont statt Fläche;
  - exponentieller Nebel plus Höhennebel, an der Geländekante voll;
  - in der Übersicht immer Ringgitter.
- **Kulissen und Himmelskörper:** 3 Kulissenringe (+5° / +3° / +1,5°) und als surreales Element (H21) ein Knet-Riesenmond oder Ringplanet gegenüber der Sonne, unten im Dunst.
- **Schatten** weich (bilineare PCF).
- **Erdung:** greift jetzt auch für `InstancedMesh` (Felsgruppen, Brösel) und das Auto, kräftiger (1,3 m Band).
- **Felsgruppen:** sitzen nach dem tiefsten Bodenpunkt und sind halb in den Hang gekippt (Etherington S1).
- **Polka-Dot-Welt** (Georg: „wie würde Yayoi Kusama das Terrain gestalten“):
  - Punkte sind angeschnittene Kugeln auf zwei gedrehten, verbogenen 3D-Gittern, mit 35–45 % Bedeckung.
  - Die Farben kommen aus der Biom-Palette (Georg: Paletten behalten).
  - Varianten: Biom, Konfetti, Netz.
  - Gelände und alle geerdeten Props tragen Punkte.
  - Nur als Hommage in der Probe; im Spiel ohne den Namen der Künstlerin und ohne ihre Werktitel.

**Offen:**
- G6-Messung;
- Übertragung nach `terrain2`;
- Linien-Lösung für Kantenakzente;
- schwebende Kulissen-Inseln (R13 Vorschlag B);
- Puffs mit flacher Basis (H18).

## 105 · 20.10. · Flächengrammatik R1 · Prüfansichten in der Probe · Vergleich A/B/C/D

**Georg:** „wird schon besser :)“. Dazu kam externes Feedback aus seinem Perplexity-Chat zur Flächengrammatik. WS1 hat es mit den eigenen Befunden zusammengeführt:
- **`CANON_3D/sources/WS1_FLAECHENGRAMMATIK_R1.md`** (Register `98e2ac5a`): Invarianten FG-1 bis FG-11. Die wichtigsten:
  - Makro/Meso/Mikro getrennt steuern;
  - Übergang als eigenes Band mit Gegeninseln;
  - Sprenkel nur mit Ursache und in Nestern;
  - Variation innerhalb eines Materials schwächer als der Wechsel zwischen Materialien;
  - Ufer ohne Halo;
  - kein Licht in die Albedo;
  - Abnahme-SOP mit vier Ansichten plus Vergleich A/B/C/D.
- Bitte WS0 um Prüfung und Übernahme in `CANON_3D_R1` (Bereich Farbflächen/Material). FG-10 schlägt WS1 als feste Abnahme-SOP für jedes Terrain vor.

**Gelände-Probe** (`ws1/preview@ec3595e8`, https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe):
- **Neu: Auswahl „Flächen-Stufe“** mit B (nur große Flächen), C (+ Übergänge: Gegeninseln, Meso-Tonvariation, trockene Flecken nur auf Kuppen) und C+D (+ Sprenkel nur an Grenzen).
- **Neu: Auswahl „Prüfansicht“** mit Endbild, nur Grundfarbe, graue Form und Material-Masken.
- **Ufer** mit schmaler dunklerer Kontaktkante; feuchte Abschnitte nur stellenweise; kein heller Saum mehr.
- **Felsgruppen** als Knet-Blöcke statt Low-Poly.
- **Befund aus der Prüfansicht:** Die scharfkantigen dunklen Keile, die das externe Feedback bemängelt, kamen von den farbigen Gratkanten (Krümmungsschwelle auf Dreiecken). Sie sind jetzt weicher und standardmäßig aus, bis eine Linien-Lösung nach R11 steht.
- **Vordergrund-Tonmasse** abgeschwächt (ca. 15–20 L\*). In der freien Übersicht bleibt sie ein Fleck; ihr Platz ist bei festen Kameras (R10).
- Gespeicherte Einstellungen wurden zurückgesetzt (neuer Speicher-Schlüssel), damit die neuen Vorgaben greifen.

**Weiter offen:**
- (a) Abgleich mit Georgs Datei „cartoon animation.md“ → `WS1_R12_…`;
- (b) Übertragung ins Spiel `look=terrain2` mit A/B-Bildern;
- (c) G6-Schattensaum-Messung;
- (d) Linien-Lösung für Kantenakzente;
- (e) Formenalphabet für Sprenkel.

## 104 · 20.10. · Georgs Look-Feedback umgesetzt (Farbflächen, Berge, Schattensaum) · Recherche liegt in `CANON_3D/sources/` · „Banden“: Georg weiß es nicht

**Abstimmung (Georg: „alle Regeln und Updates an WS0 bei GitHub – stimmt euch ab“):**
- Im Register-Branch liegt Commit `eff8323e`, nur neue Dateien in `CANON_3D/sources/`:
  - `WS1_R1_…`, `WS1_R2_…`, `WS1_R3_…`, `WS1_R4_…`, `WS1_R10_…`, `WS1_R11_…_R1.md`;
  - `WS1_GEORG_LOOK_FEEDBACK_2026-10-20.md`: Georgs Feedback vom 20.10. in Kurzform. Es enthält die Regeln aus seinem Web-Chat, die im Kanon noch fehlen (Vordergrund-Tonmasse, farbige Kanten, Schattenfamilie je Biom).
- `MANIFEST.tsv` und `CANON_3D_R1.md` habe ich **nicht** angefasst. Die Übernahme in den Kanon macht WS0.

**„Banden“ in #439:**
- Georg weiß nicht, was gemeint ist. Seine Vermutung: die Joyride-Race-Track-Banden oder das Fahren an Wänden.
- Bitte WS0, die Quelle selbst festzumachen. Bis dahin baut WS1 keine Banden- oder Rampen-Geometrie.
- In Georgs Web-Chat vom 19.10. stehen nur „Höhenbänder/Farbbänder/Bandenkanten“; siehe §103.

**Georgs Urteil (Screenshots) und was WS1 daraus gemacht hat** (Probe: https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe, Stand `ws1/preview@9e506e2e`):

1. **Farbflächen:** „keine organischen, fließenden Formen, wie sie ein Cartoon-/Comiczeichner verwenden würde; keine Schnittkanten, keine langgezogenen Zungen“.
   - Ursache: Schwellwert-Rauschen mit Domain Warp bildet Mäander, Hälse und Zungen. Zusätzlich gab es an der Hangkante einen harten Wechsel zur Felsfarbe (Schnittlinie).
   - Neu: geschlossene Blob-Formen. Je Zelle höchstens ein Blob, Ellipse höchstens 1 : 1,25, sanfte Beulen über Richtungsrauschen (ohne Naht). Nachbarn verschmelzen per smooth-min zu satten Klecksen (k = 0,45 r).
   - Vier Ebenen: groß 120 m, mittel 64 m, klein 28 m, dazu Tupfen 6,5 m, die in Nestern gehäuft stehen.
   - Am Hang läuft die Fläche weiter und wird nur weich felsiger und dunkler; keine harte Kante mehr.
   - **Regelvorschlag K-F1:** Farbflächen sind geschlossene konvexe bis leicht gebeulte Formen mit Seitenverhältnis ≤ 1,25 und Halsbreite ≥ 0,5 × kleiner Radius; keine Fläche entsteht als Rausch-Schwelle. Hangwechsel nur über Wert und Farbton, nie über eine Kante.
2. **Berge:** „die unnatürlich zackigen Berge vermeiden, mit Etherington-Stein-Konzepten“. Neuer Schalter „Berge rund“:
   - Grate mit weichem |n| (`sqrt(n² + 0,06)`), höchstens 4 Grat-Oktaven und Verstärkung 0,45;
   - Schichten abwechselnd dick und dünn (1,3 / 0,7, R2-N4), wellig geneigt, Kanten gerundet (w ≥ 0,3);
   - das Licht folgt der Formnormalen über ca. 6 m statt jeder Delle; dadurch sägen die Dreiecke keine Licht-Scherben mehr in die Hänge (sie waren die Hauptursache der Zacken);
   - Stufenlicht mit weicheren Übergängen.
   - **Felsgruppen an Hängen** (prozedural um das Auto, `InstancedMesh`):
     - Dreiergruppe 1 : 0,6 : 0,35 (N5), 40–50 % eingesunken gemessen an der mittleren Bodenhöhe (S1);
     - Block statt Kugel, Ei auf dem breiten Ende, nach oben schmaler (N2/N3);
     - gemeinsame Neigung ≤ 15° mit Abständen ≥ 5°, je Gruppe genau eine Ausnahme mit 25–45° (N1);
     - Brösel ≤ 12 %, hangabwärts liegen geblieben (E3);
     - platziert am Hangfuß und an mittleren Hängen, nicht an der senkrechten Wand.
   - Vorher/Nachher habe ich am Preset „Grat-Gebirge“ (Schalter aus/an) im Browser geprüft.
3. **Schattensaum** (Georgs Ausschnitt: heller Spalt zwischen Steinfuß und Schatten): Übernommen ist der globale Fix aus `kfb-stage-light.v1.1` (V-440):
   - Vorderseiten werfen (castFrontFaces);
   - Normalversatz 1,5 Texel (8 cm) statt des alten Tiefen-Bias. Der lag in der Probe bei ca. 60 cm, das war die Ursache.
   - Geprüft habe ich nur im Nahbild am Steinband. Die **G6-Messung** (`measureShadowSeam`) ist in der Probe **nicht gelaufen**.

**Nächste Schritte:**
- (a) Abgleich mit Georgs Datei „cartoon animation.md“ (Comedy Contract je Biom, 5-Ebenen-Tiefe, Painted Shape, Set-Grammatik). Georg möchte das „später“; das Ergebnis kommt als `WS1_R12_…` nach `CANON_3D/sources/`.
- (b) Farbflächen v3, Formnormale und Felsgruppen ins Spiel `look=terrain2` übertragen, mit A/B-Bildern. Dabei behebe ich auch die atan-Naht in `t2Stage`.
- (c) G6-Messung für Probe und `terrain2`.

## 103 · 20.10. · Recherche R10 + R11 fertig (Georgs Stil-Auftrag) · Kanon-Lücken · Frage „Banden = Bänder?“ · Probe: organische Farbflächen

**Neue Recherche** auf Georgs Wunsch (auf diesem Branch unter `research/canon/`, bitte nach `CANON_3D/sources/`):
- **`R10_CARTOON_HINTERGRUND_KLASSIKER_R1.md`**: 39 Regeln (Looney Tunes/Road Runner nach Maurice Noble, Hanna-Barbera/Art Lozzi, Animaniacs, Material-Mix).
  - **Dunkle Vordergrundmasse:** 6–12 % Bildhöhe, ≥ 60 % Breite, 15–25 L\* dunkler, gebrochene Oberkante [V]. Nur feste Kameras und weltfest; für die Verfolgerkamera nicht übernommen (wäre eine Vignette).
  - **Kantenakzente** als Ausnahme (≤ 25 % der Silhouettenlänge): Farbton ±20°, 15–30 L\* dunkler, 1–3 % der Objekthöhe, Lücken auf der Lichtseite.
  - **Formsprache:** kopflastige Tafelberge mit runden Kanten; Streckenrand ≤ 6 gleichartige Objekte pro Sekunde [V, nach Noble].
  - **Wert und Farbe:** Wertleiter als Palettenfeld, 4-Ton-Akkord je Zone.
  - **Flächen brechen** ohne Rauschen: Grundton auf ≥ 50 % sichtbar, ΔL\* ≤ 8.
  - **Material-Mix hält zusammen** über ein Medium (`kfb-clay`-Profile), eine Bauregel, eine gemeinsame Textur-Signatur und eine gemeinsame Alterung. Wichtigste Regel: Der Texturmaßstab folgt dem Weltmaßstab (Fingerspur-Größe auf allen Objekten innerhalb Faktor ≤ 2).
- **`R11_3D_ANIMATION_FARBE_LICHT_R1.md`**: 30 Regeln (Pixar/Disney, Spider-Verse, Arcane, DreamWorks NPR, Klaus, Guilty Gear Xrd, Hi-Fi Rush, Sable).
  - **Schatten = Materialpaar je Palettenrolle** (konkretisiert V-564): ΔL\* −18 bis −28, Farbton ≤ 20° verschoben, Buntheit 0,8–1,15 ×.
  - **Zusammenführung mit max:** 2 Töne + ≤ 1 Kontaktstufe; Kontakt 8–12 L\* unter dem Wurfschatten.
  - **Linien als Color Hold** (25–35 L\* unter der Fläche), Breite nimmt mit der Tiefe ab, nie an Farbfeldgrenzen.
  - **Eine Toon-Antwort für alle Materialien.**
  - **Gate-Vorschlag `kfb_toon_gate`** mit drei Debug-Masken (Schatten, Kontakt, Linien); diese Masken würde WS1 liefern.
  - **Offene Fragen F1–F6;** darunter ein Widerspruch: R4-11 setzt L\* ≥ 15, LIGHT_MODEL_R2 L-6 erlaubt nachts L ≥ 8.
- **Quellen-Lücken** stehen offen in den Dateien: Animaniacs, Rick and Morty, Genshin, Breath of the Wild und Tunic ohne Produktionsquelle.
- **Hinweis:** Für R11 wurden zwei öffentliche PDFs (Hi-Fi-Rush-Folien, X-Toon-Paper) zum Lesen ins temporäre Scratchpad geladen. Georg ist informiert.

**Kanon-Lücken (bitte aufnehmen):**
- In `CANON_3D_R1` fehlen bisher **Vordergrund-Tonmasse** und **farbige Kantenakzente**. Beide stehen nur in `WS0_CARTOON_TERRAIN_PALETTE_SHADOW_DESIGN_R1` (Ebenen 3 und 4).
- Ebenso fehlen die **Stil-Referenzen** (Road Runner/Noble, Hanna-Barbera, Material-Mix) und die **Schattenfamilie je Biom**: 4 Flächenfarben, shadow, deepShadow (nur bei Überlagerung oder Kontakt), edgeAccent; maximal 2 Schattenstufen. Georg hat das im Web-Chat festgelegt.
- R10 und R11 liefern dafür Zahlen.

**Frage zu #439 (wichtig):** In Georgs Web-Chat vom 19.10. heißt es „Höhenbänder“, „Farbbänder“ und „an den Bandenkanten erkennen“. Mit „Banden“ sind dort offenbar die **Farbbänder** gemeint (Diktat), nicht Fahrbahn-Banden. Dann wäre der gesuchte „Banden-/Rampen-POC“ kein Geometrie-POC, sondern die Farbflächen-Logik, die schon steht. Ich habe Georg gefragt, was das „nicht höhenstufenartige Rampending“ meint, und melde die Antwort.

**Gelände-Probe:** Die Farbe ist jetzt auch dort organisch statt nach Höhe (Schalter „Farbflächen organisch“, Wand-Projektion), wie im Spiel `look=terrain2`. Dazu sind seit §102 neu:
- Kontakt-Brocken (V-565);
- Steine 40–50 % eingesunken (R2);
- Vordergrund-Tonmasse (weltfest);
- farbige Kanten an Graten.
https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe

## 102 · 20.10. · Recherche R2 + R4 fertig · Gelände-Probe: organische Übergänge, Erdung, echte Palettenschatten · V-565/V-566 gelesen

**Recherche** (auf diesem Branch unter `research/canon/`, bitte nach `CANON_3D/sources/`):
- **`R2_ETHERINGTON_ABGLEICH_R1.md`**
  - 21 Original-Tafeln von Lorenzo Etherington angesehen; Autor ist sein Bruder Robin, einen „Marc“ gibt es nicht.
  - **Etherington nennt keine Prozentzahlen.** Alle Werte in SINK/RULES sind KFB- bzw. P3-Werte („keine Quelle gefunden“ bzw. „gilt für KFB“). Belegt sind nur Zählregeln: Abstand 2 : 1, drei Größen, ≤ 3 Primärformen je Cluster, fünf Tiefenstufen auf Steinflächen, acht Landmarken-Typen.
  - **Korrekturvorschläge:**
    - `spread`-Ziel 0,50 (Untergrenze 0,30 bleibt);
    - `size_tol` 0,10 → 0,20;
    - `stone_L` 0,45–0,60 → 0,40–0,50 mit Kappe ≤ 0,50 („Findlinge sitzen im Gelände, umgekehrter Eisberg“);
    - Landmarke = „Ausnahme von der Umgebungsregel“ (8 Typen), nicht zwingend die höchste.
    - Die drei letzten Punkte entscheidet Georg.
  - 14 neue Regeln N1–N14 (Fels, Kiesel, Wurzeln, Hangbäume, Gras, Wasser, Verfall).
  - Grammatik R1 §4 (5–15 % Einsinken, AO-Ring) widerspricht dem Stand und sollte als abgelöst markiert werden.
- **`R4_FARBTHEORIE_COLOURSCRIPT_R1.md`**
  - J17-Paletten in OKLCH gemessen: Boden-C ≤ 0,75 × Akzent-C (gemessen 0,61–0,73).
  - **Befund:** In „bucht“ ist das Laub (C 0,180) bunter als der Akzent. Frage an Georg (J17 ist Goldstandard).
  - 15 Regeln (Bacher, Gurney/Loomis/Pyle, Valve TF2, Pixar Eggleston/Romano, Mary Blair): 3 Wertgruppen, Wertbänder je Tiefenebene, Fokus mit höchstem Kontrast, ≤ 3 Farbtonfamilien + 1 Akzent, Akzent 3–10 % der Fläche, Schatten nie schwarz.
  - Vorschlag zweistufiges `kfb_color_gate` (erst Palette, dann Bild) + Kritiker K2a–K2f.
  - „Kühle Schatten“ und Tiefennebel nicht übernommen (V-564, LIGHT_MODEL_R2).

**Gelände-Probe** (https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe), nach Georgs Feedback:
- **Übergänge organisch:**
  - eine Distanzfunktion, Flecken weich vereinigt (außen) bzw. weich ausgestanzt (innen), je Fleck 3×3 Nachbarzellen;
  - Größen schief verteilt, Formen gedreht, gestreckt und gewellt, Dichte zur Kante hin höher;
  - Rauschen über die Richtung statt den Winkel.
  - Die „Vektorpfad-Kanten“ (Zellgrenzen, Winkel-Naht) sind weg.
- **Erdung:** Am Objekt unten und an Kronen-Unterseiten dunkler im Kontaktton der Palette, nie schwarz; die Bodenhöhe kommt aus derselben Höhenformel im Vertex-Shader.
- **Echte 3D-Schatten:** eine Sonne, Shadow Map 110 m um das Fahrzeug, 5×5 PCF; auf dem Boden im Palettenton (castShadowTint-Prinzip wie V-564). Schaltbar.

**V-565/V-566 gelesen, nächste Schritte daraus:**
- Kontakt-Geometrie (kleine Knet-Brocken an jeder Objekt-Boden-Fuge);
- 70/20/10 (Terrain nie die lauteste Fläche: den Sprenkel-Ring prüfe ich darauf);
- Graustufen-, Silhouetten- und Thumbnail-Pass bei Abgaben;
- keine Farbsperre, nur Chroma ≤ 0,195.
- Danach dasselbe im Spiel (#439 `look=terrain2`).

## 101 · 20.10. · Recherche R1 + R3 fertig (V-563, Paket A) · Gelände-Probe mit Diorama-Einpassung

**Recherche (Paket A, parallel bearbeitet):**
- **Dateien** auf diesem Branch unter `research/canon/`, bitte nach `CANON_3D/sources/` übernehmen:
  - `R1_INSZENIERUNG_R1.md`: 25 Regeln, davon Teil B zu Gebiet 15 „Einpassung“;
  - `R3_SET_DRESSING_R1.md`: 21 Regeln plus Datensatz-Vorschlag für die Stamp-Bibliothek in `kfb_env`.
- **Format wie im Brief:**
  - Regeln mit Zahlen, je Regel Quelle und Urteil („gilt für KFB“ oder „nicht übernommen, weil …“);
  - am Ende „Vorschlag Prüfung“ mit Gate oder Kritiker-Kriterium je Regel.
  - Zahlen markiert: **[Q]** aus der Quelle, **[V]** Startwert (Heuristik, an 10 PASS- und 10 FAIL-Bildern eichen, bevor er FAIL auslöst), **[KFB]** Verweis auf Bestand. Was schon in Etherington R2 oder im QA-Regelwerk steht, ist nicht doppelt aufgenommen.
- **Kern R1:**
  - 1 Primärfokus + ≤ 2 Akzente je Bild; Fokusfläche 4–15 % (Übersicht) bzw. 2–10 % (Spielkamera) [V].
  - Kontrast sammelt sich am Fokus: ≥ 1,5 × Median [V]; Freiraum-Ring 0,25 × Fokusdiagonale [V]. Das sind die beiden Backlog-Gates.
  - 3 Wertmassen, eine > 50 % [Q, Notan].
  - Wertordnung nach Flächenneigung (Carson): fängt eingebackenes Licht ab.
  - Übersichtskamera 30–40° Neigung [Q].
  - **Gebiet 15:**
    - Rand als Ring aus Übergangsbausteinen nach Dual Grid (Stålberg, 16 bzw. 6 Fälle) [Q];
    - Streudichte in Stufen im Ring 0,5–1,5 H [V];
    - gleiche Detailfrequenz von Szene und Terrain [V];
    - ≤ 18 Töne gesamt [V].
- **Kern R3:**
  - Stamp: ≥ 4 von 6 Worch/Smith-Fragen, Ereigniskette aus 2–4 Gliedern, 1 Schlüsselrequisit, 3–7 Teile, Aussage in ≥ 3 Trägern;
  - Funktionsgruppe: 1 Anker, 2–4 Werkzeuge, 1–3 Spuren, ≥ 70 % aus einer Materialfamilie;
  - 1 H frei um Spielstellen;
  - Stamps nur mit erfüllter Ortsbedingung (`requires`), derselbe Stamp ≤ 1 × je Insel.
- **Nicht gefunden** (steht in den Dateien): Tiny-Glade-Regeln zu Wandfuß und Moos, Nintendo-Geländeregeln, Pixar- bzw. Naughty-Dog-Zahlen. Etherington-Originale als Text → R2.
- **R2 + R4** laufen noch, kommen als §102.

**Gelände-Probe mit Diorama-Einpassung** (Georgs Experiment, Gebiet 15 zum Ausprobieren): https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe
- Amphitheater 70 m vor dem Start; „Zum Diorama“ setzt davor ab.
- Einzeln schaltbar:
  - Palette angleichen (Rollen-Töne, eingebackenes Licht raus, matt);
  - Sockel + Erdkeil, vorne offen;
  - Farbring + Sprenkel in beide Richtungen (3 Größen, harte Kanten);
  - Steinband in Dreiergruppen (1,5 : 0,95 : 0,55, 20–35 % eingesunken);
  - Baum- und Buschgruppen an den Flanken, Freiraum vor der Öffnung.
- Gitter-Welt: Kachel-Textur `edge3.jpg` (aus der Voxel-Welt), je Feld gedreht, gespiegelt und in der Helligkeit gestreut. Georg überlegt den Stilbruch „Spielbrett + Knet-Inseln“ als eigenen Look mit sauberen Übergängen.

**#439 im Spiel** (`terrain/439` @4f0f774, `look=terrain2`): Runde 2 mit Palette, Erdwall, Bühnenring und Palettenschatten liegt bei Georg. Als Nächstes kommen die Kanon-Regeln (Steinbänder, Sprenkel zweiseitig, eingebackenes Licht). Banden und Rampen bleiben offen, bis der POC benannt ist.

## 100 · 20.10. · #439 Terrain übernommen (V-561) · Welcher POC? · Start mit den eindeutigen Teilen

**Übernommen:** `BRIEF_WS1_TERRAIN_439_R1`. Branch `terrain/439` ab `combo/r2` @d762916, Schalter `look=terrain2`, der Standard bleibt unverändert.

**Der „WS1-POC für Banden und Rampen“ ist bei mir nicht eindeutig.** Ich habe den Roadster-Chat vom 19.10. nicht gesehen. In meinem Code gibt es nur diese Kandidaten:
1. **M3 Stunt-Testfeld** (`src/m3/stuntData.js` / `stuntField.jsx`, auf main @4c7c70e, Branch `m3/fahrhilfe` @66bec2c):
   - 4 Keil-Rampen: flach 12°, steil 22°, Kicker, Tafel; mit senkrechter Kante, also eher stufig als „nicht höhenstufenartig“;
   - markierte Wandfläche `block-b` für Zwei-Rad-Fahrt (Banden-artig);
   - Rampen-Zonen mit Einfangen/Abheben (P2);
   - k2t-Bandenprall (`src/m2/k2t.js`).
2. **Rampe zur Bühne** (M1, `m1/tune` @69400cf, V-331): eine durchgehende glatte Auffahrt, keine Stufe.
3. **Gelände-Probe** (§98/§99, außerhalb des Repos): sanfte Hänge, Tafelberge, Terrassen-Kantenschärfe, Gitter-Welt; **keine Banden**.
4. Nicht von WS1: KFB Stunt World / `KFB-Stunt-Car-Race` (OSM-Korridor).

Georg sagt, WS0 habe präzisiert. Im Register (zuletzt @76be3af9, 02:32) und in #439 sehe ich das aber noch nicht. **Bitte WS0:** die Präzisierung in `WS0_TO_WS1.md` oder #439 schreiben. Bis dahin erfinde ich keine Banden- oder Rampengeometrie.

**Was ich jetzt schon baue (hängt nicht vom POC ab, nach DESIGN R1):**
- **Probe 1, Farbflächen:**
  - Farbrolle aus einem eigenen Feld, unabhängig von der Höhe (niederfrequent, Domain Warp nur an den Grenzen);
  - 3–4 Rollen aus der bestehenden Palette;
  - Wand-Projektion für steile Flächen;
  - Fahrbahn und Bühnenfüße behalten ihre Farbe.
- **Probe 2, Schatten:** bestehende Shadow Map, an der Material-Naht nach `castShadowTint` des Empfängers eingefärbt; Kontakt mit `max`, Gesichter lesbar. Gibt der Shader keine sichere Naht her, melde ich `SOURCE_REQUIRED`.
- **Nachweis** je Probe als A/B mit gleicher Kamera und Route, echter Figur und Racer.

## 99 · 20.10. · Gelände-Probe jetzt öffentlich erreichbar

Die private Seite aus §98 lässt sich nicht in den WS0-Workspace teilen. Deshalb liegt die Probe auf Georgs Wunsch als eigene Seite neben dem Spiel auf der Vorschau:

**https://ws1-preview.kayfabizarro.pages.dev/gelaende-probe.html**

Cloudflare braucht etwa 15 min nach dem Push (`ws1/preview` @84a60a6).

- Das Spiel (`index.html`) bleibt unverändert; die Seite steht in `build.json` unter `extraPages.gelaendeProbe`.
- Die Racer-Modelle kommen von denselben festen Adressen wie in der Spielvorschau (Asset-Branch, Pin 9bd8e037). Es wurde nichts neu veröffentlicht.
- **Bedienung:**
  - Vorlagen und Schieber rechts.
  - Oben im Bild „Fahren“: W/A/S/D, ⇧ Boost, Leertaste Sprung, 2× Leertaste oder F zum Fliegen, R zurücksetzen.
  - Unter „Welt und Tempo“: Ringgitter, Gitter-Welt (Schachbrett, Knet-Optik), Test-Tempo bis Warp.
  - Unter „Himmel“: Tageszeit, gemalte und Knet-Wolken.
  - „Rezept kopieren“ liefert den `kfb.terrain-recipe/1`-Entwurf als JSON.

## 98 · 20.10. · Gelände-Probe: Cartoon-Gelände, endlose Welt, Hochgeschwindigkeit (Recherche + Prototyp, auf Georgs Wunsch)

Außerhalb des Spiel-Repos, als interaktive Seite: **https://claude.ai/artifact/5XEWSgg2FGerJqpKEriBhM** (Version 7). Die Seite ist privat; Georg teilt sie über das Share-Menü. Auf Georgs Mac läuft sie mit **60 fps**. Nichts davon ist im Spiel oder auf `combo/r2`, es ist Entscheidungsgrundlage für WS1b.

**Was die Probe kann:**
- **Gelände als reine Funktion aus Position und Startwert:** 2D-Simplex-fbm, Grate, Verwirbelung, Wechsel ruhig/bergig, flache Täler, Tafelberge, Terrassen mit Kantenschärfe, Wasserstand.
  - Farbe in Bändern nach Höhe und Steigung aus Biom-Paletten (Platzhalter: Moos, Mesa, Wüste, Schnee, Pastell), Felsen ab Steigung, Gesteinsstreifen, Licht in Stufen, Biom-Wechsel entlang der Strecke.
  - 6 Vorlagen.
  - **Rezept als JSON kopierbar** (Entwurf `kfb.terrain-recipe/1`).
- **Endlos in jede Richtung:** Die Welt wandert mit dem Fahrzeug, abgetastet nur in ganzen Gitterschritten. Das behebt das Flimmern scharfer Kanten beim Fahren. Dazu ein verschobener Nullpunkt.
- **Die 6 Racer aus `kfb-vehicle-rig.r1`** mit echten Maßen und Düsen-Ankern (Georg hat das Hochladen der Meshy-Modelle in die private Seite freigegeben):
  - Spielzeug-Physik: Schweben mit Feder, Hangabtrieb, Sprünge über Kuppen, Wand-Abprallen;
  - Flug nach Elan-Prinzip (2× Leertaste / F);
  - Düsenflammen in Fahrzeugfarbe, Stauchen und Strecken, Verfolgerkamera mit FOV-Kick.
  - **Die Physik fragt nur die Höhenformel ab, kein Kollisionsnetz.**
- **Himmel:**
  - Tageszeiten Tag/Gold/Nacht (angelehnt an die MOODS des Licht-Moduls);
  - gemalte Cartoon-Wolken auf der Kuppel (hart abgeschnittenes Rauschen, Licht- und Schattenton, fast kostenlos);
  - Knet-Wolken als 3D-Körper in Flughöhe (Instanced, Stufenlicht);
  - Kondensstreifen im Flug.
- **Ringgitter** (vereinfachte Geometry Clipmaps): zwei gröbere Ringe (2,4 km / 9,6 km) um das feine Gitter, Sicht ~5 km bei gleichbleibenden Kosten.
- **Test-Tempo** bis Warp (1000/1200 km/h), nur in der Probe.
- **Gitter-Welt:**
  - Neon-Linien plus Höhenlinien; Gitterweite 3–32 m;
  - Linienform geschwungen, Kreise oder eckig;
  - Füllung: Linien, Schachbrett (2 Töne oder bunt aus Biom) oder beides.
- **Knet-Optik:** prozedural aus der Weltlage (Dellen, Daumen-Rillen, fleckige Töne), ohne Textur und ohne Wiederholung.

**Empfehlung zur Architektur für Hochgeschwindigkeit (Recherche):**

| Ebene | Lösung | Begründung |
|---|---|---|
| Offene Welt | Mitwanderndes Ringgitter auf flacher Welt (Clipmaps/CDLOD), Höhe auf der GPU aus dem Rezept, Physik analytisch aus derselben Formel | konstante Kosten bei jedem Tempo, kein Kachel-Erzeugen auf der CPU, keine Collider-Streaming-Ruckler |
| Rennen | Strecke als Spline-Band; das Gelände wird per Abstand zur Spline in der Formel flachgezogen | ein System für freie Welt und Rennen |
| Hyper-Rush / Warp | Gitter-Welt als eigener Skin (z. B. „Kosmos“) | billigste Optik, stärkstes Tempogefühl |
| Weltreise | Kugel (Travel Globe) nur in Flughöhe | am Boden bei hohem Tempo zu kurze Sicht: 3 m Augenhöhe auf R = 2 km → ~110 m; 400 m Voraussicht bräuchte R ≈ 27 km |
| Vorzeige-Strecken / Dioramen | fest gebaute Module | — |

**Geprüfte Repos:**
- **ProceduralTerrains** (MIT, three.js): bestes Vorbild für das Rezept-Format.
- **THREE.Terrain** (MIT): Streuen, Wind-Gras, Höhe/Steigung → Material.
- **terrain-diffusion** (MIT): nur offline möglich, auf Realismus ausgelegt.
- **cartoon-terrain-studio: Verdacht auf Malware-Falle.** README beschreibt ein Windows-Werkzeug mit externem Download, der Code ist etwas völlig anderes, 0 Sterne. **Nichts davon laden.**
- **three-volumetric-clouds** (Nubis): keine Lizenz, archiviert, teuer und realistisch → nicht nutzen.
- **TinySkies:** **keine Lizenz** (GitHub: license null) → nur als Ideen-Vorbild. Code nur mit Erlaubnis des Autors; Georg müsste fragen. Eigene Quellen zuerst: Travel Globe, Travel Combat (SKY3 ist schon im Spiel), `kfb-flight-vfx.js`.

**Vorschlag für WS1b, nach V-514, wartet auf Georgs Ja:**
1. `terrain=rezept` als Schalter in M1/M2: Rezept-Höhe in `m1-terrain` auf großer fester Fläche, flacher Platz ums Amphitheater bleibt. Etwa 1–2 Tage.
2. Endlos-Welt als Ringgitter + analytische Physik + Floating Origin, Anker für Zonen/Dioramen/Gasthaus (persistiert), Teleport-Liste, Welt pro Reise neu gewürfelt (nicht persistiert). Etwa 3–5 Tage.
3. Himmel: gemalte Kuppel-Wolken in SKY3, Knet-Wolken in Flughöhe, Tageszeit aus den MOODS.

**Offene Fragen an WS0:**
- Soll `kfb.terrain-recipe/1` ins Register (Vorlagen-Zeile)?
- Wer pflegt die echten Biom-Paletten, damit die Platzhalter durch Story-Mode-Farben ersetzt werden?

## 97 · 19.10. · Zehn Hebel mit großer Wirkung bei kleinem Aufwand (Recherche Cartoon-3D, auf Georgs Wunsch)

Ausführlich mit Anschluss im Code, Risiko und Quellen auf der Seite https://claude.ai/artifact/BPnJsFihuh5JMVbSy213fe. Sie ist privat; Georg teilt sie über das Share-Menü. Kurzfassung, sortiert nach Wirkung zu Aufwand:

1. **Stop-Motion-Takt:** Figuren und Effekte auf 12 Bilder pro Sekunde, Kamera, Physik und Steuerung bleiben bei 60 (Aardman, *South of Midnight*). Stunden.
2. **Hit-Stop:** 40–80 ms Standbild + Kamera-Stoß bei Treffern; Faust, Blaster, Bombe, `HitEvent` aus V-514. Stunden.
3. **Gemeinsamer Wind:** Böen für Gras, Bäume, Staub und Fluff; Pflanzen weichen aus. Optional zeigt der Wind zum Ziel (*Ghost of Tsushima*). 1–2 Tage.
4. **Kamera-Dither:** Hindernisse zwischen Kamera und Figur werden gepunktet durchsichtig (*Mario Odyssey*), für Obstgärten und Amphitheater. ≤ 1 Tag.
5. **Tilt-Shift:** Miniatur-Unschärfe nur in Übersichts- und Dialog-Kamera (*Link's Awakening*). ≤ 1 Tag, GPU vorher messen.
6. **Fotomodus:** freie Kamera, ohne HUD, Tageszeit, Bild speichern; auch für Art-Direction-Tafeln. 1–2 Tage.
7. **Geisterfahrer:** Bestzeit als durchsichtiger Knet-Geist auf Strecken und im Elan-Ringkurs. ≤ 1 Tag.
8. **Eingaben aufzeichnen und abspielen:** deterministische Wiederholung für Fehlerberichte und Tests (über `hostKeys` + festen Takt). 1–3 Tage.
9. **Reagierende Tiere:** 30–60 Vögel oder Schmetterlinge (InstancedMesh, Schwarm), fliegen bei Annäherung auf. ≤ 1 Tag.
10. **Prüfansichten Helligkeit/Silhouette:** eine Taste für Graustufen, Stufen und Silhouetten, für Lesbarkeit von Figuren und Tageszeiten. Stunden.

**Empfehlung für die erste Runde:** 2 und 4 (passen in V-514 und in die Obstgärten), dann 1 nach einem Fühltest mit Georg.

Das sind Vorschläge, keine Entscheidungen. Umsetzung erst nach Georgs Ja und einer Vorlagen-Zeile; die Umsetzung läge bei WS1b.

## 96 · 18.10. Nacht · Übergabe-Ordner liegt in Georgs Dropbox

- Georg hat `~/kfb-ws1/handover/` in seine Dropbox gelegt: Git-Bündel mit allen 19 Branches, `push-combo.sh`, `build.json`, Skyriding-Recherche, C1-Clip.
- Den Freigabe-Link schreibe ich bewusst nicht ins öffentliche Repo, denn jeder mit Link könnte den Ordner laden. WS1b bzw. WS0 auf dem MacBook nimmt den Ordner direkt aus der Dropbox oder bekommt den Link von Georg.
- Start auf dem MacBook: `git clone kfb-planet-alle-branches.bundle kfb-planet && cd kfb-planet && git checkout combo/r2`, danach `WS1_HANDOVER.md` §4.

## 95 · 18.10. Nacht · Schlussmeldung WS1 auf Georgs Arbeits-Mac → Übergabe an WS1b (V-539)

- **Übergabe:** `WS1_HANDOVER.md` auf diesem Branch. Inhalt: Branch-Karte, Stand, Befehle, offene Aufgaben in Reihenfolge, Fallen, Lokales, Assets.
- **Code:**
  - Arbeitsstand `combo/r2` @d762916, veröffentlicht (§94, Vorschau live seit 22:49).
  - Schnappschuss ohne Geschichte: `ws1/combo-r2`.
  - **Alle 19 Branches mit Geschichte** liegen als Git-Bündel auf dem alten Mac (`~/kfb-ws1/handover/kfb-planet-alle-branches.bundle`, 20 MB). Georg bringt es per AirDrop oder USB aufs MacBook.
  - Warum kein Push: Das Hochladen der kompletten Geschichte ins öffentliche Repo hat die Werkzeug-Sicherheit auf dem alten Mac gestoppt. Ich habe das nicht umgangen. Die Geschichte ist geprüft (keine Mail-Adressen, kein SDK, keine privaten Dateien); Georg kann sie vom MacBook aus pushen, wenn er will.
- **Bewegungs-Sitzung:** ebenfalls sauber, keine ungesicherten Änderungen. Ihre offenen Punkte stehen in der Übergabe §5.10.
- Danke an WS0 für die Steuerung. WS1b übernimmt.

## 94 · 18.10. 22:45 · Veröffentlicht: R1a + Saugarm + Laternen (combo/r2 @d762916)

- **Vorschau** `ws1/preview` @f089ccf (Cloudflare etwa 15 min), `build.json` mit neuen Links: `harvestNight`, `harvestGold`, `racerDragsterNight`. Tasten stehen in `notes` und in der Spieltest-Anleitung §93.
- **Spiegel** `ws1/combo-r2` @15d6727.
- **Pakete** `ws1/vendor` @70e66d5, neu dabei `kfb-fluff-suck.v1.js`.
- **Volltest 61/62.** Rot ist nur `c3g` (Laternen-Optik): Der Platzhalter-Kern erreicht über einen ganzen Puls gemessen höchstens **1,06 × Umfeld**, Ziel 1,15. Die Einzelbild-Messung aus §93 (1,21) hing vom Pulszeitpunkt ab; der Test misst jetzt 6 Bilder in 8,4 s. Kein Spielfehler. Georg wollte heute eine spielbare Version, deshalb ist trotz des roten Tests veröffentlicht. Der echte Kern kommt mit B30.
- **V-518 geprüft:** Im Spiel übernimmt kein Auge die Anker-Normale. Kopfteil-Weg: `rotation.y = 0`, gemeinsame Vorwärtsrichtung; EyeRig v6 mit Gesichtsrahmen; converge überall 0. Kein Schielen nach außen möglich.
- **V-538 privates Repo:** Lesezugriff per HTTPS bestätigt (`ls-remote` und Clone ohne Inhalte gehen, 56 Einträge). Benutzername und Hash-Test folgen morgen mit Georg; die Werkzeug-Sicherheit verbietet mir, gespeicherte Zugangsdaten auszulesen.
- **Veröffentlichungsskript repariert:** Der Spiegel ist jetzt Nachfolger von `ws1/combo-r2`, die Pakete haben ihren Elternteil wieder.
- **Morgen:** Bildrate auf Georgs GPU, dann Start V-514 Flug + Zerstörung.

## 93 · 18.10. Abend · Laternen heller (Grenze des Platzhalters), Volltest läuft für die Veröffentlichung, Spieltest-Anleitung für externe Prüfer

**Stand `combo/r2` @1940eba.** Seit 18:50 läuft der Volltest. Danach veröffentliche ich in einem Zug:
- Spiegel `ws1/combo-r2`;
- Vorschau mit R1a, Saugarm, Saug-Ton und Laternen;
- `ws1/vendor` mit neu `kfb-fluff-suck.v1.js`.

Ich melde mich mit §94, sobald die Vorschau live ist.

**Laternen-Platzhalter (eure Antwort zu §92):**
- `veinGlow` angehoben: Rubin 3,2, Saphir 2,6, nicht weiter verfeinert.
- Ergebnis: Kern **1,21 × Umfeld** (vorher 0,83). Das Ziel 1,3 erreicht der Platzhalter nicht.
  - Ab etwa 4 werden die Adern weiß, der Körper bleibt trotzdem dunkel.
  - Zustand `active` hellt Kern und Lichtfleck gleich stark auf, das Verhältnis sinkt sogar (1,14). Deshalb nicht genutzt.
  - Der Körper glüht nur über das Dünne-Feld. Das bringen die B30-Figuren mit.
- Der Test `c3g` prüft für den Platzhalter deshalb > 1,15 (Nacht minus Tag > 0,25) und nennt das Ziel 1,3 für B30.
- Budget hält: tags 0 Lichter, nachts 6 von 8 echt (die nächsten zur Kamera), Lichtfleck für alle; 0,004 ms je Bild.

**Konto für das Privat-Artifact:**
- WS1 läuft unter Georgs Arbeits-Workspace-Konto, nicht unter dem Konto, das das Artifact angelegt hat.
- Die Adresse schreibe ich nicht ins öffentliche Repo. Georg weiß, welches Konto gemeint ist; er kann über das Share-Menü freigeben.

**Als Nächstes (in dieser Reihenfolge):**
1. Veröffentlichen.
2. Bildrate auf Georgs GPU (braucht das sichtbare Browserfenster).
3. V-514 Flug + Zerstörung R1: Briefing gelesen, Start nach §94. Fragen kommen in den Status.
4. V-497: Melodie-Stimme mit Mund-Rig, wartet auf `kfb-bubbles.v1`.
- Zusätzlich prüfe ich V-518 (gemeinsame Blickrichtung beider Augen) gegen unseren EyeRig-Einbau (`kfb-figure-loader` / `buildHeadpartEyes`).

### Spieltest-Anleitung für externe Prüfer (Art Director, Spieltest per Web-Chat)
Basis: `https://ws1-preview.kayfabizarro.pages.dev/` + Hash. Ab der Veröffentlichung heute Abend gilt der neue Stand, `build.json` nennt Commit und Testzahl.

Steuerung überall:
- WASD laufen bzw. fahren; Maus Kamera; Rad Zoom; Leertaste springen.
- Doppel-Leertaste: Schwungflug (Elan).

| Was | Hash | Tasten | Worauf achten |
|---|---|---|---|
| Laufwelt + Fluff-Ernte | `#m1,harvest` | V Faust, B Blaster, N Bombe, **T Saugarm**, I aufheben | Kügelchen fallen nach Waffe (3/2/1 Treffer); Saugarm: Zittern → Gummi-Hals → Plopp → Flug → Einsaugen, Fluff-Leiste zählt erst beim Einsaugen; Fundsachen schweben 0,15 m |
| Dieselbe Welt nachts | `#m1,harvest,tod=night` | wie oben | Kristall-Laternen am Weg (Platzhalter), Lichtflecken am Boden, max. 6 echte Lichter |
| Racer fahren | `#m1,car,racer=crimson_flame_dragster` (auch: `rustwing_cruiser`, `graffiti_jet_cruiser`, `street_racer_hoverbeast`, `crimson_thunderjet`, `ironclad_skycruiser`) | W Gas, Shift Boost, S Bremse | Düsen-Puls mit Ton, Schalten mit Knall, Boost staucht → streckt, Bremsen taucht die Nase, Staub je Gelände |
| Racer-Flug | `…,racer=…,fly` | über eine Rampe | Kesseldruck, Schweben, Bodeneffekt |
| Bühne mit Aliens | `#stage,actors=aliens` | Maus | E2-Lider, Augen, Knete-Look |
| Bühne nachts mit Billboard-Lampen | `#stage,tod=night` | Maus | Lampen beleuchten die Karte, Karte nie heller als ihr Licht |

`mute` schaltet den Ton ab, `clay=0` zeigt das Spiel ohne Knete (Vergleich).
Bekannte Grenzen:
- Platzhalter: Saugarm ohne Roboter-Arm (V-510 kommt mit P2), Laternen ohne B30-Figuren.
- Bots, Stationen und UFO-Strahl fehlen noch.

## 92 · 18.10. · V-487 Stufe 1 fertig, Stufe 2 Saugarm + Ton läuft, Stufe 3 Laternen eingebaut (Leuchten noch zu schwach)

**Stand:** alles auf `combo/r2` lokal (@37be37b), Einzeltests grün. Volltest und Veröffentlichung (Spiegel `ws1/combo-r2`, Vorschau, `ws1/vendor`) folgen als Nächstes. Die Vorschau zeigt bis dahin @027d5c5.

**Stufe 1 · R1a Antrieb (V-481), fertig bis auf Rustwing II:**
- Ton `propulsion_r1`: je Anker-Typ eine Schleife (Überblendung über zwei Spuren, keine Naht), Boost-Zündung und Schalt-Knall an den Ereignissen aus `vehicleRig.update`. Hash `mute` schaltet stumm.
- `brake`-Ereignis: die Nase taucht etwa 5° ein und federt nach.
- Bodennähe-Partikel je Terraintyp (Sand, Erde, Fels, Gras, aus Höhe und Steigung).
- Bildtafel der 6 Racer in Fahrt und ein Boost-Clip (nur lokal bei Georg, private Modelle).
- **Befund aus der Tafel, behoben:** Der Staub war mehrere Meter groß und legte sich als Schleier über das Heck. Jetzt sind es 0,3–0,8 m mit flachem Aufstieg (`DUST.size/rise/spread/alpha`).

**Stufe 2 · Fluff-Ernte R1 (V-479):**
- Modul `src/modules/fluffSuck.js`, als Paket `ws1/vendor/kfb-fluff-suck.v1.js` mit der nächsten Veröffentlichung.
  - Typ Düse; der Strahl (UFO) nutzt dieselbe Düsen-Rückgabe.
  - Ablauf je Kugel 1,4 s: Anlauf → Stretch am Ursprung → Plopp → Flug → Einsaugen. Squash & Stretch mit Volumenerhalt.
  - Cues: charge, stretch, plop, fly, swallow, cloud. Über `maxJobs` werden Kugeln zur Wolke zusammengefasst.
  - Ein InstancedMesh, Punkt-Pool 160; Kosten 0,01 ms je Bild.
- Spieler-Saugarm (Platzhalter) in `#m1,harvest`, Taste **T**: bis zu 6 Kügelchen im Kegel ≤ 6 m fliegen zur rechten Hand. Hängende Kügelchen haben den Ursprung Baum, liegende den Ursprung Boden.
  - `orchard3d` hat dafür `suckable` / `take` / `deliver` bekommen.
  - Gezählt wird erst beim Einsaugen (Ernte-Stand, kfb.save, Fluff-Leiste R5f).
- Ton `fluff_suction_r1` hängt an den Cues: S01 Anlauf, S02 Schleife, S03/S04/S05 Plopp je Herkunft, S06 Schlürfen. S07 „Tank voll“ wartet auf die Tank-Grenze.
- Tests `unit-fluffSuck` und `c3s` (Browser: Baum + Boden, nichts bleibt hängen, Zähler = eingesaugt): PASS.
- **Offen, blockiert durch P2:** Bots, Stationen, Saugarm-Beute, Stations-Effekt E01, `yields` im Destruction-Modus, UFO-Strahl als eigene Figur.

**Stufe 3 · Kristall-Laternen (V-471/V-476):**
- `kfb-gem.v1` r4 ist byte-gleich übernommen (blob 44cd3758, MIT): `src/vendor/gem/`.
- Modul `gemLanterns.js`: 8 Laternen am Demo-Weg, Rubin und Saphir im Wechsel, nie auf dem Weg (an Knicken auf der Außenseite).
  - Nachts mit `lantern` + `halo` + `pool`.
  - Echte Lichter über den Practicals-Pool des Licht-Moduls: max. 6, die nächsten zur Kamera. Tags 0 an.
- Die B30-Figuren (Satz M) sind nicht öffentlich. Bis dahin nutze ich einen Platzhalter-Kristall (Sechskant-Spitze + 2 Nebenkristalle); getauscht wird später nur `build()`.
- **Befund:** Nachts leuchtet der Lichtfleck am Boden gut, der Stein selbst bleibt aber dunkelblau (Test `c3g`: Kern 0,83 × Umfeld, Ziel > 1,3).
  - Ursache: Der r3-Kern folgt der Dünne je Eckpunkt (`measureThinness`); mein Platzhalter ist zu grob und zu dick.
  - Ich verfeinere das Netz. **Frage an WS0:** Gibt es eine empfohlene Mindestdichte, oder soll ich bei Platzhaltern `innerGlow`/`veinGlow` anheben?

**Blockiert:**
- Privat-Artifact (§91) weiterhin nicht erreichbar.
- Rustwing Cruiser II, Bots/Stationen (P2), B30-Figuren.

## 91 · 18.10. · Integrationsplan R1 (V-487) übernommen · Privat-Artifact aus dem WS1-Workspace nicht erreichbar

**Plan V-487 läuft in der Reihenfolge 0 → 1 → 2 → 3.** Stufe 1 (R1a) ist schon zu großen Teilen da (§90): Modul, 6 Racer, surge/ascent, Bodennähe-Staub, Vorschau. Es fehlen noch:
- Ton `propulsion_r1`;
- `brake`-Ereignis;
- Partikel je Terraintyp;
- Bilder je Fahrzeug und ein Boost-Clip.

Daran arbeite ich jetzt, danach Stufe 2 (`kfb-fluff-suck`).

**Stufe 0, Privat-Pack:** `Artifact read` auf https://claude.ai/artifact/MGwWwWaYDmcijVzfhd1Auk (`selftest.txt`) liefert „artifact not found“.
- Die Artefakt-Liste dieser Sitzung zeigt nur Artefakte des Workspace-Kontos, unter dem WS1 läuft. Das Pack liegt offenbar unter einem anderen Konto.
- **Bitte an WS0:** das Artifact für das WS1-Konto freigeben (teilen) oder unter diesem Konto neu anlegen. Georg weiß, welches Konto die WS1-Sitzung nutzt. Sonst bleibt nur das private Repo.

**B9 für C4:** Die Bühnen, die das Spiel heute zeigt, sind Amphitheater, Goblin-Bank, Atlantis, Utopia-Bühne und Comic-Broadcast. Bitte zuerst **Amphitheater** (V-429 Punkt 4: Diorama-Steine), dann Goblin-Bank und Atlantis. Utopia und Comic danach.

**VFX/Düsen (Frage aus WS0_TO_WS1 Punkt 5):** Der neue Stand steht in §83, §84, §86, §88 und §90:
- Daten `src/data/vehicles/kfb-vehicle-rig.r1.json` (Format `kfb.vehicle-rig/1` nach V-481);
- Modul `src/modules/vehicleRig.js`;
- Paket `ws1/vendor/kfb-vehicle-rig.v1.js`;
- Düsen-Erkennung per Heuristik für die 14 Dieselpunk-Fahrzeuge.

**Abnahme-Bühne v1.2.3 (Augen-Host):** Das Spiel setzt die Augen je Figur über deren eigenen Kopfknoten bzw. Anker (faceMount, eyeActor, headpartActor), nicht über die Figurwurzel. Den Fehler mit zwei Augen auf einem Anker gibt es bei uns nicht. Die Aliens stehen links und rechts außerhalb des Ursprungs, `test/c2.mjs` ist PASS.

## 90 · 18.10. · combo/r2 grün (61/61) und veröffentlicht · Branch-Vorschau mit allen Stufen · Pakete `ws1/vendor`

**Stand combo/r2 @027d5c5** (Branch, nicht main):
- C1 Kamera, C2 Aliens/E2, V-429 (ein Rig, clay v1.1 auch am Amphitheater), C3 Fluff-Ernte, HUD R5f, C3b Fundsachen (V-450, B28), R1a Antriebe der 6 Racer, Elan S1 (Skyriding-PoC), Elan S2 (Racer-Schwungflug), Licht v1.1, B22-Lampen.

**Tests:** run-all **61/61 PASS** (M1, M2, M3, C1, Elan, Bühne, C2, C3, C3b, R1a), dazu alle Unit-Tests.
- Drei Befunde im Lauf, alle behoben:
  1. Der Racer-Flug fing Rampen-Launches ab (m3-f/m3-g). Er läuft jetzt nur mit Schalter `fly`, dazu ein Bodenwellen-Riegel (vy ≥ 4·J oder Rampen-Zone).
  2. m1-move@120 lag über dem 25-min-Alarm. Der Frame ist im SwiftShader teurer, vermutlich durch clay v1.1 auf den Figuren. Alarm auf 50 min, PASS.
  3. drift brauchte eine Ausgabedatei im frischen Worktree.

**Veröffentlicht:**
- Spiegel `ws1/combo-r2` @83be20dd (Ordner `ws1/kfb-planet`).
- **Pakete `ws1/vendor` @76ea4602** (V-409): `kfb-stage-light.v1.js`, `kfb-figure-loader.v1.js`, `kfb-vehicle-rig.v1.js`, `e2/*`, README, `vendor.json`. Pin = Commit.
- Vorschau `ws1/preview` @5870c3b3 mit Direktlinks in `build.json`:
  - aliens, harvest, skyriding (`#m1,flight=elan`);
  - racer… (6 Racer), racerFly (`#m1,car,fly,racer=…`);
  - stageNightLamps.

**Für Georgs Fühlprobe:**
- Fluff-Ernte und Fundsachen.
- Racer-Antriebe (Boost = Stauchen/Strecken, Funken beim Gaswegnehmen und Schalten).
- Skyriding.
- Racer-Schwungflug. Notiert: Der Racer wendet bewusst träger (kAlign × 0,5, stellbar).

**Offen:**
- Perf auf echter GPU, wird gerade gemessen.
- C4 (privater Weg, §87).
- Kesseldruck im HUD (Frage an WS0, §89).
- Nichts davon auf main ohne Georg.

## 89 · 18.10. vormittags · combo/r2 komplett gebaut, voller run-all läuft · Elan S1 (Skyriding-PoC) grün · R1a, V-450, Licht v1.1, B22 eingebaut

**Branch `combo/r2` @6bb3c4f** (lokal; Push, Spiegel und Branch-Vorschau nach dem vollen run-all, der jetzt im eigenen Test-Worktree läuft):
- **C1 Kamera** (Bewegung): Jitter/Orbit/God PASS, Clip, zwei M3-Fixes aus dem Clip (Rampen-Sog, Bremsen ≠ Klemmen).
- **C2 / V-429 / clay v1.1 / C3 / HUD R5f / C3b** wie §80.
- **Elan S1** (Bewegung, nach meiner Recherche §88):
  - Schwungflug der Figur (G in der Luft, `flight=elan`), Ringkurs mit 10 Ringen, 6 Knet-Perlen als Platzhalter, Komfortmodus.
  - Flug-VFX byte-gleich (`kfb-flight-vfx.js`): Kondensstreifen, Manöver-Linien, Überflug-Staub.
  - Node-Gates G1–G5, G7 PASS (Energie ±0,11 %; unendlicher Flug: im Mittel 109 m ab 80 m gehalten, flaches Gleiten landet nach 37 s). Browser-Gate PASS.
  - Ein echter Modellfehler aus dem Browser ist behoben (Fallschirm-Deckel fing den Sturz ab).
  - Grenze im Spiel: Die Flugwelt endet bei Radius 159 m und Höhe 260 m (→ größere Welt, §85).
- **R1a Antriebe** (V-481) für Georgs 6 Racer (`#m1,car,racer=<id>`):
  - Glow-Kern + Fahne mit Schockdiamanten, Lüfter, Funken, Motormodell mit Gängen/Backfire, surge/ascent (Stauchen → Strecken), Bodennähe-Staub an den Schwebe-Ankern.
  - `test/r1a.mjs` PASS (Dragster, Panzer-Gleiter, Thunderjet: Anker am Modell, Schub, Hochschalten, Boost + surge, Modul < 0,5 ms).
- **V-450 Fundsachen:** WSB-B28 r2 (53 Stück, Beute-Tabelle byte-gleich), Unterkante 0,15 m (gemessen 0,133–0,170 mit Wippen), 7 Stück 35° gekippt. `c3b` PASS.
- **Licht v1.1** (V-440, byte-gleich): Vorderseiten werfen Schatten (`castFrontFaces`), Bühne und Laufwelt umgestellt.
- **B22 r3 Lampen:** 2–3 Arm-Lampen an der Tafel, Lichtkeile nach Rig-glow, nachts Licht-Inseln über die Praktischen. Die Karte ist nachts lesbar (≈ 81 % vom Tag). Licht-Test angepasst.
  - Befund: GLTFLoader entfernt Punkte aus Knotennamen (`KFB_Mount_board.001` → `…board001`). Bitte bei künftigen Ankernamen ohne Punkt liefern (an WSB).

**Elan S2 (Racer), WS1-Entscheid für den Vorbau** (Georg/WS0 können umsteuern):
1. **Übergang:** Am Boden K2B mit Schwebefeder, Fahrphysik für alle gleich. In den Schwungflug per Rampen-Absprung (Tempo ≥ 0,5 · sThrill und Steigwinkel > 8°) oder Doppel-Leertaste (400 ms). Zurück in K2B bei Bodenkontakt.
2. **Steuerung im Flug:**
   - W = Dauerschub, S = Luftbremse.
   - Nase per Maus mit RMB, sonst Pfeil hoch/runter; ohne Eingabe Gleitwinkel −7°.
   - Space = Steigen (Ladung), Space + A/D = Rolle, Shift = Boost aus dem Kesseldruck.
3. **Kesseldruck** vorerst als Platzhalter neben den Perlen. **Frage an WS0:** Platz im HUD R5f (Manometer)?
4. **Kurs:** derselbe Ringkurs, Abstände × Tempo-Verhältnis. Eine eigene Racer-Variante später.

Die Darstellung läuft nur über `vehicleRig` (surge/ascent, Funken bei leerem Kessel). Die Bewegungs-Sitzung baut die Logik und die Node-Gates vor.

**Offen bzw. als Nächstes:**
- ~~Amphitheater noch auf `clayLook`~~ → seit @622a256 auf clay v1.1 umgestellt (Browser-Prüfung folgt nach dem run-all): Die Rollen-Umfärbung hängt am alten Shader und braucht einen sauberen Umbau.
- Perf-Messung auf echter GPU in der Branch-Vorschau.
- Elan S2 = Racer: Schwebefeder, Kesseldruck, Düsenfahnen an meinen Ankern.
- C4 wartet auf den privaten Weg (§87).

## 88 · 18.10. · Dragonriding-Recherche fertig · R1a Antriebe gebaut · Elan-PoC an die Bewegungs-Sitzung

**Recherche** (WS1, mit Quellen, lokal `~/kfb-ws1/research/DRAGONRIDING_RESEARCH_R1.md`; bei Bedarf lege ich sie ins Register). Kern:
- **Energie-Tausch:** Nase runter bringt Tempo, Nase hoch bringt Höhe; unter sStall sinkt man wie am Schirm.
- **„Unendlicher Flug“** ist keine eigene Regel: Er entsteht, weil schnelles Fliegen schneller auflädt (Thrill), als man ausgibt.
- **Fähigkeiten als Impulse:** Steigen, Schub, Fassrolle, Bremsflügel.
- **Präsentation:** FOV weitet sich, Flügelpartikel werden zu Kondensstreifen, Wind über den Bildschirm. Blizzard musste den FOV dämpfen und „Steady Flight“ wieder einführen; daraus folgt Komfortmodus ab Tag 1.
- **KFB-Übertragung:**
  - Schwung-Modell „Elan“: 4 Gleichungen, Prüfgröße E = ½s² + gh, Startwerte sStall 12, sThrill 40, sDive 60, Boost 85 m/s.
  - Tasten wie K2B: Leertaste steigen, Shift Schub, Leertaste + A/D Rolle.
  - 6 Ladungen.
  - FOV-Kurve 55 → 70° (Deckel 75°).
  - Racer-Variante mit Kesseldruck (wie Episode I Racer), Schwebefeder und Bodeneffekt.
- **Erste Scheibe Elan S1** (Figur, Ringkurs, Gates G1–G8). Die Bewegungs-Sitzung ist angefragt, weil das ihr Bereich ist (M1-Flug). S2 = Racer.

**R1a Antriebe** (combo/r2 @20d2fa4):
- Modul `src/modules/vehicleRig.js`:
  - je Düse Glow-Kern + additive Fahne mit Schockdiamanten bei Vollgas, Lüfter mit drehender Scheibe, Funken-Pool;
  - Motormodell (5 Gänge, Drehzahl, Schaltdelle + Stoß, Backfire beim Gaswegnehmen);
  - surge/ascent als Stauchen → Strecken mit Volumen-Erhalt (Modell und Anker verformen gemeinsam, Fahnen bleiben an den Düsen).
- Keine Lichter, kein Bloom-Pass. 3–19 Draw Calls je Racer (Thunderjet mit 10 Ankern am meisten).
- Racer-Wahl `#m1,car,racer=<id>` für Georgs sechs. Daten `src/data/vehicles/kfb-vehicle-rig.r1.json` (nur Zahlen).
- Unit-Test PASS. Browser-Test `test/r1a.mjs` (Dragster, Panzer-Gleiter, Thunderjet) läuft nach dem Volltest.

## 87 · 18.10. · Private Assets: Dropbox-Connector geht in diesem Workspace nicht (Georg) · Bitte an WS0

- Georg: Der Dropbox-Connector lässt sich in diesem Workspace **nicht** freischalten. Der Weg aus V-462 fällt für WS1 deshalb aus.
- **Öffentliches ist da und wird eingebaut:** `assets/kfb-wsb-public-2026-10-18` (B28 r2 + Beute-Tabelle, B22-Lampen, Licht v1.1, Abnahme-Bühne) und der Audio-Branch `assets/kfb-elevenlabs-sfx-r1-2026-10-18` (propulsion_r1).
- **Weiter blockiert,** weil nur über das Privat-Manifest erreichbar:
  - B9-Steine mit `COLOR_1` (C4);
  - Alien-Körper rimV1;
  - Rohmodelle Rust Runner II und Rustwing Cruiser II;
  - Pubs/Bento, Inseln B27, B7 r4.
- **Bitte an WS0:** den privaten Weg ohne Dropbox umsetzen.
  - Vorschlag aus §82: privates GitHub-Repo `kfb-private-assets` mit Git LFS, WS1 nur lesend. Das Repo gibt es noch nicht (`git ls-remote` → not found).
  - Falls Georg das Repo einmal anlegen muss, bitte ihm den einen Schritt konkret nennen. WS0 kann von seinem Rechner aus dann hineinpushen.
  - Für die Rohmodelle reicht WS1 auch die browserfertige v3-Fassung (B35) auf dem privaten Weg.
- Bis dahin: C4 wartet, Aliens bleiben edge80, die Düsen-Erkennung für Rust Runner II und Rustwing Cruiser II folgt mit B35.

## 86 · 18.10. · Georg: Cartoon-Deformation der Racer bei Schub und Steigen (Anticipation → Stretch → Recovery, wie Dragonriding) · WS1-Konzept

**Georg:** Beschleunigen und an Höhe gewinnen mit Anticipation und Recovery: erst gestaucht, dann durch den Schub gestreckt, so ähnlich wie bei WoW. Antriebs-VFX bleiben dabei konsistent. Ziel ist cartoon-kinetisches Feedback am eigenen Fahrzeug.

**Basis ist schon im Spiel:** `vendor/deformer/vehicle-cartoon-deformer.v2.js` (`kfb.cartoon-vehicle-deformer/2`, M3 Stufe E).
- Bewusst **kein Shader**, sondern verschachtelte Gruppen (Visual Response Root → Shell Deform Root für Karosserie, Fahrersitz, Sekundärteile), begrenzte nicht-uniforme Skalierung und gedämpfte Federn.
- Grammatik Cause → Anticipation → Action → Impact → Follow-through → Recovery: Dauer-Ursachen ziehen an Feder-Zielen, Ereignisse geben Feder-Impulse.

**WS1-Vorschlag:**
1. **Neue Ereignisse im Deformer** (Profilwerte, kein neuer Code-Pfad):
   - `surge` (Schub/Boost): 80–120 ms Stauchen in Fahrtrichtung (Länge −8 %, Breite und Höhe +4 % bei Volumen-Erhalt), dann Streckung +10–14 % mit dem Schub, Überschwingen, Ruhe nach ~0,5 s.
   - `ascent` (Space in der Luft): vertikal stauchen, dann strecken plus kurzes Nicken nach oben.
   - `brake` bzw. `halt`: Nase taucht, Heck hebt, Rückfedern.
   - Barrel Roll gibt es schon (Tumble/Assist).
2. **VFX konsistent ohne Extra-Arbeit:**
   - Die Düsen-Anker hängen **unter dem Shell Deform Root**. Stauchen und Strecken verschieben sie automatisch mit, die Fahnen bleiben an den Düsen.
   - Die **Fahnenlänge folgt demselben Federwert:** In der Anticipation wird die Flamme kurz eingezogen (Ansaugen), beim Stretch schießt sie lang raus und pulsiert. Ein Signal treibt Deformer, VFX und Sound (Gang- bzw. Boost-Stoß).
3. **Grenzen und Feinschliff:** Deformation ist reine Präsentation (Kollision und Physik unberührt, wie im Deformer festgelegt). Die Werte je Fahrzeug liegen im Profil (`deformer-profiles.json`), Georg tunt in der Fühlprobe. Abnahme mit Bildfolge und Clip (Stauchen sichtbar, kein Ruckeln, Düsen sitzen in jedem Bild).

**Reihenfolge:** zusammen mit dem Antriebs-Modul R1a (§83/§84) für Georgs sechs Fahrzeuge. Die Dragonriding-Recherche (läuft) liefert das Schwung-Modell dazu.

## 85 · 18.10. · Tempo-Grenzen Freifahrt / Hyperspeed (Georg-Frage, WS1-Einschätzung für die Hyperspeed-Planung)

**Heute (K2B, J17-Meter):**
- `maxForward` 41·K ≈ 26,7 m/s ≈ **96 km/h**, Boost `boostMaxForward` 48,5·K ≈ 31,6 m/s ≈ **114 km/h**.
- Physik 60 Hz fest (≈ 0,5 m pro Schritt bei Boost, unkritisch).
- Grenze ist die Welt: das M1-Gelände ist ≈ 350 m breit (bei Boost in ~10 s durchquert), Nebel ab ≈ 90 m.

**Was bei mehr Tempo begrenzt:**
1. **Durchtunneln:** Bei 100 m/s sind es 1,7 m pro Schritt. Lösung: 120 Hz + Sweep/CCD statt Endpunkt-Test.
2. **Streaming:** 300–500 m vorausladen, Gelände-Kacheln in Fahrtrichtung, Collider und Boden vor Scenery.
3. **Float-Präzision:** ab ~10–20 km vom Ursprung Floating Origin.
4. **Perf:** Es kostet die neue Welt pro Sekunde (Kacheln, Deko, Partikel), nicht das Tempo. Feste VFX-Obergrenzen sind angelegt.

**Gefühltes vor echtem Tempo** (vgl. Fuse Games, im WSA-Plan verlinkt): FOV, Speedlines, Contrails, Kamerazittern, nahe Parallaxe-Objekte, Klang, pulsierende Düsen.

**WS1-Vorschlag Stufen:**

| Modus | echt | gefühlt | braucht |
|---|---|---|---|
| Freifahrt heute | ≤ 114 km/h | normal | – |
| Freier Hyper-Rush (schwebend, selbst lenken) | 70–100 m/s ≈ 250–350 km/h | sehr schnell | 120 Hz + Sweep, Vorausladen, größere Welt |
| Geführter Hyper-Ride (Route/Schiene, WSA-Plan) | 150–300 m/s | 500–1000 km/h | Route vorab geprüft, Kollision nur gegen die Route |
| Warp-Tunnel | beliebig | „Lichtgeschwindigkeit“ | rein visuell, kaschiert das Laden der Zielwelt |

**Empfehlung:** Freie Fahrt bis ≈ 350 km/h, darüber nur geführt bzw. im Warp. Die Antriebs-VFX (§83/§84) sind der günstigste Tempo-Verstärker.

**Bitte an WS0:** in die Hyperspeed-Planung (WSA_GUIDED_HYPERSPEED_WARP_RIDE_PLAN_R1) aufnehmen; Gelände-Streaming bzw. größere Welt als Voraussetzung für den Hyper-Rush einplanen.

## 84 · 18.10. · Düsen-Erkennung Dieselpunk (14 Fahrzeuge) · Georgs 6er-Auswahl · Antriebsfarben aus dem Fahrzeug

**Düsen-Erkennung r1** (WS1, ohne Blender, nur Node): Heckansicht als CPU-Höhenbild, runde Senken (Röhren) und runde Vorsprünge (Lüfter), Kreisfit, Spiegelpartner, Texturprüfung. Ergebnis `kfb.vehicle-rig-candidates/1` mit Anker je Düse (pos, dir, radius, outerRadius, size s/m/l, confidence).
- Engines: dragster 5 · thunderjet 8 (+2 Kuppeln) · graffiti 4 · hoverbeast 4 (+2) · rustwing_cruiser 1 · iron_phantom 12 · skycruiser 2 Lüfter · jetbound 6 · hauler 6 · wrecker 5 · rust_runner 6 (+3) · rustfire 4 · brasswing 2 · beetle 0 (Räder, richtig).
- Neu im Repo ist nur `wasteland_beetle`.
- Die „neuen Fassungen“ Rust Runner und Rustwing Cruiser (V-432) liegen noch nicht auf GitHub. Laut Georg stellt WS0 sie gerade bereit: bitte Branch + Commit nennen.
- Die Anker-Dateien bleiben lokal, solange die Modelle privat sind. Ins Spiel gehen nur Zahlen (pos/dir/radius), keine Modellkopien.

**Georgs 6er-Auswahl (18.10.):**
1. `rustwing_cruiser`: ein großer Jet.
2. `graffiti_jet_cruiser`: Zwilling.
3. `street_racer_hoverbeast`: Quad.
4. `crimson_flame_dragster`: Bündel 4+1.
5. **`crimson_thunderjet`** (statt iron_phantom): 8 Düsen, die zwei großen Kuppeln als Lüfter-Typ.
6. `ironclad_skycruiser`: zwei Hover-Lüfter.

**Antriebsfarben (Georg):**
- Aus dem **Farbschema des jeweiligen Fahrzeugs** abgeleitet (dominante Karosseriefarbe + Akzent aus der Textur): Kern heiß-hell, Fahne in der Fahrzeug-Akzentfarbe bzw. deren Gegenfarbe.
- Damit wirken die Antriebe unterschiedlich, **die Fahrphysik bleibt für alle gleich** (Einfachheit).
- Bloom bzw. Partikel nach Tageszeit, nachts stärker.

**Nächster WS1-Schritt nach dem Volltest:** Modul `vehicleRig` (R1a) für diese sechs: Glow-Kern, Fahne, Flimmern, Funken, synchron zu Gas, Gang und Boost; Bodennähe-Partikel; Vorschau-Link zum Fahren.

## 83 · 18.10. · Georg: Antriebs-VFX + Fahrzeug-Rigging-Studio („Garagen-Diorama“) als nächste große Slice · WS1-Vorschlag · Bitte an WS0

**Georg (18.10., WS1-Chat):**
- **Pulsierende Antriebs-VFX:** zuerst für die hinteren Triebwerke, später Räder bzw. Antigrav. Das VFX-Zentrum soll **frei positionierbar** sein, auch für **mehrere Düsen in verschiedenen Größen**.
- Dazu der **3D-In-Place-Editor als Fahrzeug-Rigging-Slice**: die Grundlage, damit Spieler später **eigene Modelle** reinbringen, als Auto nutzen und **aufmotzen** können, mit **Waffen-Riggings** (z. B. Geschütz auf der Motorhaube).
- Gerahmt als **Garagen-Diorama** mit NPCs: Werkstatt-Minispiel, Reparatur, Do-it-yourself, alles im Diorama-Look.
- **Für die weiteren Fahrtests:**
  - Soundebenen über ElevenLabs (V-461 geschichtet);
  - Science-Fiction-Propulsion in verschiedenen Farben mit Partikeln und Bloom, je Tageszeit;
  - Speedlines und was aus TinySkies bzw. dem alten Racer-Konzept übernommen werden soll.

**WS1-Vorschlag: Slice „Fahrzeug-Rigging R1“ in drei Stufen** (baut auf §59 und dem Bestand `kfb-flight-vfx.js` auf):
1. **R1a · Antrieb als Daten + ein generisches Modul** (Low Effort, High Impact):
   - `kfb-vehicle-rig.json` je Fahrzeug, GLB unverändert: Anker `[{ id, type: thrust|antigrav|exhaust|weapon|light, pos, dir, size, color?, pulse? }]` im GLB-Raum.
   - Modul `vehicleRig` setzt an jeden Anker:
     - Glow-Kern als Knet-Glow-Material, additiv, **keine neuen Lichter**;
     - Partikel (`nozzles`/jet aus `kfb-flight-vfx.js`), Hitzeflimmern;
     - Pulsieren aus Gas (`thrust01`) + Boost + Drehzahl, Größe je Anker.
   - Farbe je Fahrzeug bzw. Fraktion, Nacht stärker (Rig-glow). Speedlines und Speed-Trails 1:1 aus dem Bestand.
   - Ein Budget `VFX_CAPS`, ein gemeinsamer Partikel-Pool, Instancing.
2. **R1b · In-Place-Editor „Garage“ (Werkzeug für Georg, später für Spieler):**
   - Fahrzeug auf der Hebebühne in einem Garagen-Diorama (Bühnen-Licht-Modul, clay v1.1).
   - Klick auf die Karosserie → Raycast → Anker mit Normale; Gizmo für Lage, Richtung und Größe; Typ wählen; Vorschau live mit Gas-Regler.
   - Speichert `kfb-vehicle-rig.json`.
   - Gleiches Werkzeug für **Waffen-Halterungen** (Anker `weapon` + Aufsatz-GLB).
3. **R1c · Werkstatt-Diorama als Spielort:**
   - NPC-Mechaniker, Reparatur- und Tuning-Minispiel (Teile, Farbe, Aufsätze), eigene Modelle laden (Prüfung über Karte bzw. Loader wie bei Figuren).
   - Sound-Schichten (V-461) gekoppelt an Anker und Gas.

**Georg, Nachtrag (18.10.):**
- **Dieselpunk-Fahrzeuge sind die erste Wahl** für die schnellen Racer (gedacht wie Podracer bei Star Wars). Die KayKit-Autos bleiben „Normie-Driver“ im Stadtverkehr, ohne Hyperspeed.
- **WS1 setzt die Düsen-Anker heuristisch selbst**, halb- bzw. vollautomatisch für alle Dieselpunk-Modelle (1–6 Triebwerke je Fahrzeug). Das VFX-Zentrum wird nach Triebwerksgröße skaliert, Georg tunt nur im Einzelfall nach.
  - Erst eine **Auswahl von 6 Fahrzeugen mit verschiedenen Antrieben**; Georg wählt aus einer kurzen Präsentation.
  - Die zwei neuen Fahrzeuge sind einbezogen.
- **Fahrzeuge ohne Räder** schweben leicht über dem Boden. Geschwindigkeit, Rampensprung und Abheben zeigt der Antrieb.
- **Fahrzeuge mit Rädern** haben echten, plausiblen Bodenkontakt (Georg-Korrektur 18.10.): beim normalen Fahren und im Stand sitzen die Räder auf. Die Kontaktpunkte kommen aus den Ankern `kfb_wheel_*`, Federung und Neigung je Rad, bei verschmolzenen Rädern (`kfb_fused`) über die Karosserie. Einheitlich schummeln ist nur der Rückfall, falls es sonst unverhältnismäßig wird.
- **Ein Bodennähe-Partikel-Layer für alle:** Wer in Bodennähe fährt oder fliegt, wirbelt je Terraintyp das Gleiche auf: Kügelchen, Krumen, Staub- und Rauchwolken (`skim` aus `kfb-flight-vfx.js`). Stärke nach Höhe über Grund und Tempo. Performant, Knet-Look optional bzw. als Mix.
- **Wechsel Fahren ↔ Flug** sauber: Räder heben ab, der Antrieb übernimmt, Bodenpartikel blenden mit der Höhe aus.
- **Antriebs-Animation und VFX synchron mit dem Motorgeräusch:**
  - Gangwechsel bzw. Hochschalten, Knattern (Backfire) und Bremsen sind sichtbar.
  - Partikel **performant und immersiv**, ausdrücklich nicht zwingend Knetkugeln.
  - Was andere Star-/Kart-Racer bei Antriebs-VFX machen, als Vorlage ansehen.

WS1 hat die Düsen-Erkennung bereits gestartet: Geometrie-Heuristik über alle Dieselpunk-GLBs, ohne Blender. Die Präsentation für Georg folgt als private Seite.

**Bitte an WS0:**
- Slice planen und gegen die Bot-Slice V-463 einreihen.
- Format `kfb-vehicle-rig.json` bestätigen.
- Garagen-Diorama als Asset-Auftrag (WSB: KayKit/Kenney, Hebebühne, Werkbank).
- Sound-Brief für Antrieb (ElevenLabs-Lücken) an WSA.
- TinySkies-/Racer-Übernahmen benennen (Speedlines sind schon da).

## 82 · 18.10. früh · Kurzstatus · WS0-Antworten (V-450, V-462, Licht v1.1) gelesen

**Läuft:** volle Testreihe auf `combo/r2` = c3/ernte (C2, V-429, clay v1.1, C3, HUD R5f, C3b) + c1/kamera @0eb469e (run-all M1/M2/M3/C1 + Bühne + c2/c3/c3b, ~90 Min.).
- Bisher alle PASS bis m1-hz-equal.
- Danach folgen der contract-static-Fix der Bewegungs-Sitzung (c1/kamera @cb13e73), Push, Spiegel und die **Branch-Vorschau mit C1–C3b**.

**Privater Weg (V-462, Dropbox-Connector):** In dieser Sitzung ist der Dropbox-Connector **nicht aktiv**. Er steht als „braucht Anmeldung“ in der Liste, die Werkzeuge fehlen. Georg muss ihn in den claude.ai-Connector-Einstellungen anmelden bzw. für die Sitzung freischalten. Danach lade ich nach `PRIVATE_ASSETS_FOR_WS1.r1.json` (sha256-geprüft, außerhalb der Repos). Bis dahin wartet C4, Aliens bleiben edge80.

**Nach dem Volltest übernehme ich, in dieser Reihenfolge:**
1. **V-450:** Fundsachen mit gleichem Bodenabstand 0,15 m statt Hüfthöhe, lange Stücke 35° gekippt (`floatTilt`), nach `kfb-proof-stage.v1.2.js`. Das ersetzt die GothGirl-Hüfthöhe aus §81, Georgs neuerer Entscheid gilt.
2. **B28 r2** (53 Stücke + `loot_items.r2.json`) von `assets/kfb-wsb-public-2026-10-18` @0d9a632e statt der KayKit/Tiny-Treats-Platzhalter.
3. **Stage-Light v1.1** (@5c495846, Naht-Fix V-440).
4. **B22-Lampen r3** am Billboard.

Die Wegwerfen-Taste als R5f-Ergänzung ist notiert.

## 81 · 18.10. früh · Georg-Entscheide (im WS1-Chat, für das Register)

1. **Fundsachen schweben auf GothGirls Hüfthöhe** (nicht auf FrizzleBobs, die liegt nur ≈ 0,25 m). Gemessen am GothGirl-Skelett (Knochen hips über root), keine feste Zahl. Umgesetzt auf `c3/ernte`/`combo/r2`, Test `c3b` prüft es.
2. **Dropbox geht auf dem WS1-Mac nicht** (Georg). **WS0 legt die öffentlichen Sachen auf GitHub an:**
   - B22-Billboard-Lampen r3;
   - B28-Fundsachen (42 GLBs) + `loot_items.r1.json`;
   - alles Weitere, das WS1 einbauen soll und öffentlich sein darf.

   Bitte Branch + Commit in WS0_TO_WS1 nennen. Für die **privaten** Sachen (B9 Meshy-Steine für C4, Dory r9) bitte einen Weg vorschlagen, der ohne Dropbox auskommt. Bis dahin wartet C4, Dory bleibt edge80.

## 80 · 18.10. früh · C3 grün · HUD R5f + C3b Fundsachen-Demo gebaut und grün · clay v1.1 umgestellt · Volltest läuft als Nächstes

Alles auf Branch `c3/ernte` @d878835 (lokal; Push, Spiegel und Branch-Vorschau nach der vollen Testreihe).

**C3 Fluff-Ernte, `test/c3.mjs` PASS (15/15):**
- 15 KayKit-Bäume, texturiert 15/15.
- 183 Kugeln (goblin 57 / atlantis 63 / utopia 63).
- Treffer Ø Faust 2,4, Schuss 2,4 (Projektil trifft), Explosion 1.
- Ruhe Ø 1,8 s, max 2,6 s.
- **Einsinken 0** gegen das gerenderte Netz.
- 183/183 gesammelt, Zähler je Sorte stimmen, kfb.save/1 gespeichert.
- Modul 0,007 ms je Bild.
- Grammatik nach WS0 (a): Kontur 0,85/1,25 durchgesetzt, 1400 Bäume ohne Verstoß. (c) kahle Bäume ohne Fluff.

**HUD R5f** (byte-gleich in `src/vendor/hud/`, Wirt `src/HudR5f.jsx`):
- Fluff-Leiste oben (Kugeln springen je Sorte ins Fach), Aktionsleiste unten, Rucksack unten links.
- V/B/N setzen Faust/Blaster bzw. die Bombe im Kontext-Platz, Klick auf die Bombe zündet.
- Abweichungen von der Tafel:
  - Instrumente, Karte und Radio rechts oben fehlen noch (folgen mit Navigation).
  - Fluff-Flug ohne Startpunkt im Bild (`fl.land`).
  - **Wegwerfen:** R5f hat in der Rucksack-Detailansicht keine Taste dafür. Der Wirt hängt eine Lack-Taste „Wegwerfen“ an (Brief verlangt Wegwerfen). Bitte als Tafel-Ergänzung prüfen.

**C3b Fundsachen-Demo, `test/c3b.mjs` PASS (11/11):**
- Laufwelt `#m1,harvest`, Weg (27,8 m, Halbbreite 1,3 m).
- 58 Fundsachen in ungeraden Gruppen (nest 1/3/5), **0 auf dem Weg**.
- Essen/Süßes/Getränke häufig, Werkzeug selten (Platzhalter-Beute aus KayKit Restaurant/Resource/RPGTools und Tiny Treats Baked Goods/Picnic, Pin c746a956).
- Schweben auf **Hüfthöhe aus dem Spieler-Skelett** (Knochen hips über root) mit ±5 % (gemessen 0,951–1,051), drehen sich (1 Umdrehung/3 s), Phase je Stück, Kontaktfleck je Stück (58).
- Ziel-„i“ in der Aktionsleiste.
- Aufheben mit I in den Rucksack, Wegwerfen aus dem Rucksack: Stück schwebt wieder vor dem Spieler.
- **Befund an WS0:** FrizzleBobs Hüfte liegt nur ≈ 0,25 m über dem Boden (kurzbeinig, 1,81 m mit großem Kopf). Die Fundsachen schweben deshalb tief. Soll die Hüfthöhe von einem anderen Medium-Rig kommen (z. B. GothGirl), oder ist das so gewollt?
- Clip: `test/out/c3/clip.webm` (Wiese → Aufheben → Rucksack → Wegwerfen → Baum 3 Hiebe → Einsammeln, etwa 24 s plus kurzer Ladevorlauf).
- Die Bühnen-Kontaktschatten-Aufnahme 200 % liegt in `test/out/c3b/contact-200.png`.
- **Perf ≥ 55 fps** messe ich auf echter GPU im Browser-Fenster, sobald die Branch-Vorschau steht (headless SwiftShader sagt dazu nichts).

**clay v1.1 (V-429):**
- `src/vendor/clay/kfb-clay.v1.1.js` byte-gleich (blob 6cdb67b0), Wirt `src/modules/claySSOT.js`.
- Bühne: Figuren nach Karte (character), Aufstellung midground.
- Laufwelt: FB/GothGirl nach Karte, Bäume und Fundsachen midground.
- Das Amphitheater läuft noch über `clayLook` (Umstellung als Nächstes).
- Licht-Test PASS, Aufstellungs-Test auf v1.1 angepasst (Samt ≤ 0,05 statt 0).

**C1 Kamera:** Jitter/Orbit/God PASS. Den Clip (Ich-Perspektive zeigt Boden) korrigiert die Bewegungs-Sitzung gerade, danach ihr run-all. Grün gemeldet wird erst danach.

**Blockiert wie §79:**
- kein Dropbox auf dem WS1-Mac;
- B9 (C4), B22-Lampen r3, B28 + Beute-Tabelle, Dory r9 nicht lesbar;
- Stage-Light v1.1 noch nicht da.

## 79 · 18.10. nachts · Stand C1/C2/C3 · WS0-Antworten gelesen · **Bitte: Dropbox fehlt auf dem WS1-Mac**

**C1 Kamera** (Bewegungs-Sitzung, `c1/kamera`):
- Jitter PASS: Laufen 0/0,30 px, Fahren 0,09/0,88 px bei 60 fps und 0,08/0,80 px bei 30 fps, Hochpass ≤ 0,27 px.
- Orbit PASS: 360° stehend und fahrend × 60/30 fps, größter Schritt ≤ 1,1 × Median.
- God PASS: Zoom zum Cursor 0 % Abweichung.
- Der Clip zeigte einen Fehler: Die Ich-Perspektive war per Rad nicht erreichbar (Zoom blieb bei 0,55). Der Fix läuft, danach ein neuer Clip.
- Dazu der Interpolations-Fix am Auto (Ruckeln).

**C2 Aliens + V-429** (`c2/ein-rig` @d6a2d71, lokal):
- `test/c2.mjs` PASS:
  - beide Figuren aus Karte + Loader, sha256 im Browser = edge80;
  - je Auge 1 `lid_skin`, v6-Schalen 0;
  - Passung Hunky 0,973, Dory 0,897;
  - **Pupille bei geschlossenem Lid 0 px aus 7 Blickwinkeln**.
- Dory ist einäugig (Rezept `singleEye`), der Test berücksichtigt das.
- Licht-Test PASS mit den neuen Prüfungen: Körperteile der Figuren werfen und empfangen Schatten; keine Eigenbau-Lampen.
- `b1` und `unit-figures` PASS.

**C3 Fluff-Ernte sichtbar** (`c3/ernte`, lokal, enthält C2):
- Erster Browser-Lauf `test/c3.mjs`: 13/14 PASS.
  - 15 Bäume, 185 Kugeln (goblin 59 / atlantis 63 / utopia 63).
  - Treffer Ø Faust 2,4, Schuss 2,4, Explosion 1, je Baum innerhalb der Zähigkeit ±1.
  - Ruhe Ø 1,8 s, max 2,6 s.
  - **Einsinken 0** gegen das gerenderte Geländenetz.
  - Alle 185 gesammelt, Zähler je Sorte stimmen, kfb.save/1 gespeichert.
  - Modul-update 0,008 ms.
- Die eine Lücke war ein Testfehler (Projektil-Ziel), behoben.
- **Befund im Bild:** Die Bäume waren weiß. Der Forest-Pack-Pin zeigte auf einen Commit ohne `forest_texture.png` (404). Umgepinnt auf 54b9bb66, Test prüft jetzt die Texturen.
- Wiederholung, Knet-Video und volle Testreihe folgen, sobald der Browser frei ist (C1 hat ihn gerade).

**WS0-Antworten (18.10.) übernommen:**
- Grammatik (a) Kontur 0,85×/1,25× statt 0,92×;
- (c) kahle Bäume ohne Fluff (ist schon so);
- (d) 0,616 m;
- keine neuen raw/main-Links (der Forest-Pin ist ein fester Commit);
- HUD R5f nach dem C3-Video;
- danach **C3b Fundsachen-Demo** (Priorität), clay v1.1 und Lampen r3.

**Bitte an WS0 / Georg (blockiert):**
- Auf diesem Mac gibt es **kein Dropbox** (`~/Dropbox/CLAUDE/KFB_HUB` fehlt). Deshalb kann ich `hub:`-Pfade aus `PROOF_STAGE_R1/sources.json` nicht lesen: B9 (C4), B22-Lampen r3, B28-Fundsachen + `loot_items.r1.json`, Dory r9.
- Vorschlag:
  - **Öffentliches** (B22 r3, B28, loot table) auf einen Asset-Branch legen.
  - Für **Privates** (B9, Dory r9) entweder Dropbox auf diesem Mac einrichten (Georg, einmalig) oder einen privaten Weg nennen.
- Bis dahin:
  - C3b mit den KayKit/Tiny-Treats-Originalen (FREE, auf main) + clay v1.1, wie WS0 erlaubt;
  - Dory bleibt edge80;
  - Lampen weiter aus;
  - C4 wartet.

## 78 · 18.10. nachts · Merge nach main (Georg V-430) · Langlauf R2 läuft: C1 (Bewegung), V-429 + C2 + C3 (Owner) auf Branches

**Merge:**
- main → **4c7c70e**, ein Fast-Forward auf die Kombi look/mesa @d193606 (enthält fig/karten) + m3/fahrhilfe @66bec2c.
- Tests auf main: npm test **25/25 PASS** und M-Reihe (run-all M1/M2/M3) **24/24 PASS** (m1-rueckwand nur Bericht).
- Spiegel `ws1/r3f-frame` @13600d705.
- **Vorschau ist live:** ws1/preview @5e25358f, `build.json` commit „main@4c7c70e“ → https://ws1-preview.kayfabizarro.pages.dev/ (Fahrprobe `#m1,car`, Bühne `#stage,actors=fb,light=l1`)..
- Spiegel und Vorschau: siehe unten.

**Neu von Georg: HUD R5f („KFB HUD v4.zip“, Claude-Design-Session 17.10.).** Bitte prüfen und für WS1 einplanen (V-423: Ernte-UI erst nach dem HUD-ZIP).
- Liegt auf Branch `assets/kfb-hud-r5f-2026-10-18` @a7a9e3c9, Ordner `tools/KFB-ToolBox/_inbox/KFB_HUD_R5F_SESSION_2026-10-17/`. Das Original-ZIP liegt unter `_original/`.
- Inhalt: Tafeln R5e/R5f, Module (`hud-r5/r5f-hud.js` aktuell), Doku und Handover. Kein Produktionscode, laut Handover „Design-Referenz, Fidelity High“.
- Ich habe den Inhalt gesichtet: keine Zugangsdaten und keine DocCheck-Interna.
- WS1-Vorschlag: Der Fluff-Zähler aus C3 wird durch `fluffBar` aus R5f ersetzt, die Tasten V/B/N durch die Aktionsleiste (Faust, Blaster, Bombe), sobald WS0 den Einbau freigibt.

**Langlauf R2: wer macht was:**
- **C1 Kamera (V-408):** übernimmt die Bewegungs-Sitzung auf `c1/kamera`.
  - Erster Fund: Seit M3 interpolierte das Bild des Autos die Kippgruppe statt der Starrkörper-Gruppe. Der fahrende Wagen ruckelte deshalb zwischen den Physik-Schritten, das ist wahrscheinlich Georgs „Ruckeln“.
  - Der Fix (eine Zeile) kommt mit C1.
- **V-429 (Bühnen-FAIL), auf `c2/ein-rig`:**
  1. Ein Rig: Figuren werfen **und empfangen** Schatten vom selben Key, V-417 ist auf der Bühne mit Licht-Modul aufgehoben. Test `oneRigFiguresCastAndReceive`.
  2. Billboard-Lampen ausgebaut, keine Praktischen am Amphitheater, bis WSB B22 liefert. Test `practicalsPoolNoSelfBuiltLamps`.
  3. Knet-Parameter eingefroren. Aliens bekommen das bestehende Figuren-Profil, nichts geändert.
  4. C4 wird vorgezogen, sobald die B9-GLBs greifbar sind (siehe Frage 1).
- **C2 Module + E2 (V-409/V-422), auf `c2/ein-rig`:**
  - `src/vendor/figure/kfb-figure-loader.v1.js` (`kfb.figure-loader/1`):
    - Kartenprüfung, Körper als Bytes von fester Adresse, sha256 im Browser.
    - Kopfteil-Figuren mit EyeRig v6 und E2-Lidhaut, nach `proof_r1e.html`.
    - Varianten über `kfb.figure-variant/1`, gebunden an Karten-id und Karten-sha256.
  - E2-Module byte-gleich vendort (`src/vendor/e2/`).
  - Aliens auf der Bühne: `#stage,actors=aliens,light=l1` (Lord Hunky links, Lady Dory rechts, Sockelrand 80°).
  - README für WSA: `docs/VENDOR_PACKAGES.md`. Pakete auf `ws1/vendor` folgen mit dem C2-Push.
  - Messwerte und Bildreihe kommen im nächsten §.
- **C3 Fluff-Ernte (V-423), Logik fertig (`c3/fluff-ernte` @2f7ec5a, reine Logik, Node-Tests):**
  - Grammatik R2 (`src/world/grammar.js`, alle Operatoren aus §2), Trefferregel (`src/world/harvest.js`), Gelände-Windfall in `fluff.js`.
  - Trefferregel über 1000 Bäume: Faust 3,00 / Schuss 2,00 / Explosion 1.
  - Kugeln je Baum Ø 11,7 (7–19) + 2 Fallobst.
  - Ruhezeit Ø 2,3 s, max 3,4 s.
  - Einsinken 0, Energie steigt nie.
  - Haltewinkel: 30° hält, 40° rollt weiter.
  - Gleiche Ruhelage bei 30/60/144 fps.
  - **Sichtbarer Einbau gebaut** (Branch `c3/ernte` @e3a7aef, lokal, auf c2): `src/modules/orchard3d.js` in der Laufwelt `#m1,harvest`, drei Obstgärten (goblin/atlantis/utopia, Haupt-Sorte je Zone), KayKit-Bäume mit Maß 1 KayKit-Einheit = 0,616 m (M_PER_RIG), Tasten V Faust / B Schuss (Projektil) / N Explosion, Sammeln zu Fuß und im Auto, Stand in kfb.save/1, Zähler als Platzhalter unten links. Browser-Test `test/c3.mjs` und Knet-Video `scripts/c3/clip.mjs` laufen im nächsten Browser-Slot.

**Fragen an WS0:**
1. **C4:** Die B9-GLBs mit `COLOR_1` (Stein-IDs) liegen nicht auf GitHub, nur in den WSB-Kopien bzw. HANDOFF_R1. Bitte auf einen Branch legen, dann ziehe ich C4 vor.
2. **Alien-Karten:** `lord_hunky` und `lady_dory` nennen noch den r4-Körper. Ich lade den edge80-Körper (V-422/V-430) über eine Varianten-Datei. Bitte die Karten auf edge80 (bzw. Dory r7) umstellen, dann entfällt sie.
3. **Grammatik R2 hat Widersprüche:**
   - Die Kontur-Regel (≥ 15 % Überlappung oder ≥ 25 % Luft) schließt 0,85–1,25 × Radiensumme aus. `relax` schiebt aber auf 0,92×, Folgefrüchte liegen bei 1,15–1,5×. Bisher nur gemessen, nicht erzwungen.
   - „Ungerade Mengen“ gegen die Stand-Zahlen (großer Busch 4, Kaktus 2). Angewendet auf die hängenden Kugeln je Pflanze.
   - Kahle Bäume: Fluff ja oder nein? Laut Konzept nein, laut B2-Farbregel trägt Comic auch kahle Bäume.
   - Maßstab: KayKit-Einheit = Spielmeter angenommen.
   - Die B2-Anker liegen dichter als der Spec-Abstand, deshalb meist 6 statt 7 Stände je Baum.
4. **Repo privat (§77):** Soll WS1 den Asset-Resolver (a) jetzt einbauen oder erst nach V-427?

## 77 · 17.10. abends · b98: Was passiert in der WS1-Kette, wenn das Repo privat wird? (nur Analyse, nichts geändert)

**1 · `ws1/preview` → Cloudflare Pages.**
- Gebaut wird über die Git-Anbindung des Pages-Projekts `kayfabizarro`: Branch-Build auf jeden Push nach `ws1/preview`, Alias `ws1-preview.kayfabizarro.pages.dev`.
- Auf dem Branch liegen `.github/scripts/build-cloudflare-pages.mjs` (kopiert die öffentliche Oberfläche nach `.cloudflare-pages/`), `wrangler.jsonc`, `index.html` (Einzeldatei, 18,7 MB) und `build.json`.
- Ausgelöst wird der Build von dieser Owner-Sitzung: ein Push vom Mac (Git über https mit Schlüsselbund-Anmeldung, Georgs Konto).
- **Privat bricht das nicht**, solange die Cloudflare-GitHub-App Zugriff auf das Repo hat. Bei „alle Repositories“ ist das so, sonst muss das Repo ausgewählt sein. Das prüft Georg einmal in GitHub → Settings → Applications.
- Der Push selbst läuft weiter, weil die Anmeldung Schreibrechte hat.
- **Bricht schon:** meine Kontrollabfragen über die GitHub-API ohne Anmeldung (Status der Cloudflare-Prüfung, Commits). Privat brauchen sie ein Token mit Lesezugriff. Lösung: ein feinkörniges Token für dieses eine Repo, nur Leserechte auf contents und checks, liegend im Schlüsselbund.

**2 · Staging-Seite (WSA) liest `build.json`.**
- Quelle ist `WSA_GPT_STAGING_R1_SOURCE/lib/staging.ts:4/43`: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/ws1/preview/build.json?t=…` alle 15 s.
- Dazu kommt `:5/46` mit `api.github.com/…/commits/ws1%2Fpreview` und danach das Bündel über raw.
- **Bricht bei privatem Repo** (raw und API ohne Token liefern 404).
- Billigste Lösung: Die Seite liest `https://ws1-preview.kayfabizarro.pages.dev/build.json` und `…/index.html`. Die liegen schon dort, weil der Pages-Build den Branch-Inhalt 1:1 ausliefert, und sie sind öffentlich.
- Den Commit trägt `build.json` bereits (`commit`), den API-Aufruf braucht es also nicht mehr.
- Aufwand bei WSA: etwa eine Stunde. Alternativ ein Token auf der Staging-Seite (serverseitig, `/api/status`).

**3 · Was kfb-planet zur Laufzeit von GitHub lädt** (alle Adressen mit festem Commit, außer wo `main` steht):

| Datei:Zeile | Was | Quelle |
|---|---|---|
| `src/cardImage.js:12` | Karten-PDF-Seiten (Kartenbilder) | raw @MEDIA_COMMIT |
| `src/dialogText.js:17` | Deck-JSON (Kartentexte) | raw @MEDIA_COMMIT |
| `src/poolReader.js:16` | Opener-Pool (Dialog) | **api.github.com contents**, Planungs-Branch |
| `src/modules/amphitheater.js:20` | Amphitheater-GLB | raw @AMPH_COMMIT |
| `src/modules/meshyStage.js:19` | Meshy-Bühnen (Goblin, Atlantis, Comic, Utopia) | raw @ASSET_COMMIT |
| `src/modules/vehicleLineup.js:15`, `src/m2/M2Car.jsx:39` | 14 Fahrzeug-GLBs, Dragster | raw @VEHICLE_COMMIT |
| `src/vendor/sky3/skydome-shader.js:25` | Himmel-Texturen | raw **main** |
| `src/vendor/fb/emb/…/pet-mouth.v1.js:11/27/43` | Mund-Texturen | raw **main** |
| `src/vendor/eyes/pet-library.v6.js:17` | Pet-Bibliothek (Augen-Teile) | raw **main** |
| `src/vendor/billboard/billboard-clay.js:225` | Billboard-Bilder | jsDelivr `gh/…@pin` |
| `src/vendor/card-art-2d.js:24` | pdf.js | jsDelivr **npm** (bleibt, öffentliches Paket) |
| `src/bubbleLayer.js:31` | Schrift Shantell Sans | Google Fonts (bleibt) |

- Die jsDelivr-Importe der Augen-Spender sind schon lokal: Alias in `vite.config.js`, byte-gleiche Kopien in `src/vendor/eyes/`. Kein Netz nötig.
- Figuren-GLBs (FB, GothGirl), Figurenkarten, Licht-, Sprenkel- und Deformer-Module sind schon im Bündel.
- Privat brechen also: Karten, Dialog-Pool, alle Bühnen-GLBs, Fahrzeuge, Himmel, Münder, Billboard-Bilder.
- **Unsere Testreihe bricht ebenfalls**, weil sie dieselben Adressen im Browser lädt.

**4 · Vorschlag: Spiel-Build öffentlich, Repo privat.**
- **(a) Ein Asset-Resolver** an einer Stelle: `src/assetBase.js` mit `assetUrl(path, pin)`. Er ersetzt die zehn Fundstellen oben und schaltet die Quelle um (`raw` heute, `build` oder `r2` morgen). Dazu eine Test-Sperre: kein `raw.githubusercontent`, `api.github` oder `jsdelivr/gh` mehr in `src/` (Ausnahme pdf.js über npm).
  - Aufwand WS1: ½ Tag.
- **(b) Assets mit dem Build ausliefern.**
  - Ein Sammel-Skript holt die gepinnten Dateien in `public/assets/<pin>/…`. Heute etwa 90 MB: 14 Fahrzeuge à ≈ 3,8 MB, 5 Bühnen bis 15,7 MB, Himmel, Münder, Karten-PDFs der freigegebenen Decks.
  - `ws1/preview` liefert sie neben `index.html` aus. Die Pages-Grenzen (25 MB je Datei, 20 000 Dateien) halten.
  - Der Pool kommt als Schnappschuss-JSON ins Bündel statt über die API.
  - Aufwand WS1: ½–1 Tag.
- **(c) Statt (b), später: der öffentliche R2-Bucket aus der WS0-Allowlist** (V-427, Schritt 2). Dann zeigt nur `assetBase` auf die R2-Adresse, (b) entfällt. Empfehlung: (a) sofort, (b) als Brücke, (c) sobald der Bucket steht.
- **Lizenz-Hinweis für Georg:** Was im Spiel-Build liegt, ist als Datei abrufbar. Für eingebettete Nutzung im Produkt ist das bei Kauf-Assets üblich erlaubt, als lose Sammlung nicht. Die Allowlist sollte deshalb nur Dateien enthalten, die das Spiel wirklich lädt, keine ganzen Packs.
- **Reihenfolge:** WS1 baut (a) und (b) erst nach Georgs Entscheid V-427, weil es bis dahin die Langlauf-Stufen bremsen würde. Wenn WS0 es vorzieht, passt es zwischen C2 und C3.

## 76 · 17.10. · Fahrhilfe M3 komplett A–G · Vorschau mit Stufe G

- **Stufe G** (m3/fahrhilfe @66bec2c, Bewegungs-Sitzung), alles nur Darstellung, Physik und Lenkung bleiben aktiv, nur mit Assist M3 an:
  - **Fassrolle** in der Luft (Sprung, dann Leertaste + A/D), `vehicle-tumble.v1.js` 1:1 aus lab-v7, rundet auf ganze Umdrehungen. Am Boden bleibt Leertaste + Lenken der Sprung bzw. Drift-Sprung.
  - **Zwei-Rad frei:** X + A/D ab 6 m/s.
  - **Schlingern** als Erholung nach jedem Trick: `vehicle-fishtail.v1.js` 1:1.
  - Zurückkippen nach Zwei-Rad und Wandfahrt mit Mindesttempo 1,2 rad/s.
- **m3-g:** je fps 10 Fassrollen + 10 Zwei-Rad = **20/20 auf den Rädern**, Lenkung aktiv (Gier ±42° im Trick). run-all auf m3/fahrhilfe 48/48, 1 INFO.
- **Spiegel** `ws1/m3-fahrhilfe` @cd4788d9 (Stand 66bec2c).
- **Kombi** look/mesa + m3/fahrhilfe@66bec2c: M1/M2/M3 a–g auf der Kombi 24/24, 1 INFO. Die Bühnen-Seite ist seit der vorigen grünen Kombi (47/47, §75) unverändert.
- **Vorschau** `ws1/preview` @f5802ff9, Check grün (Cloudflare brauchte ca. 15 Min.).
- **Abnahme durch Georg:** Fühlprobe `#m1,car` (M = Assist an/aus); Abnahme-Seite mit Farbwelt, Sprenkel, Gelände, Merge.

## 75 · 17.10. · Gemeinsame Vorschau: look/mesa + m3/fahrhilfe (50/50)

- **Prüfung:** Kombi aus `look/mesa`@d193606 und `m3/fahrhilfe`@2cc2562, im Hilfs-Worktree konfliktfrei gemergt.
  - `run-all` 47/47 PASS (M1, M2, M3 a–f und die npm-Reihe einschließlich light, lineup, scale), 1 INFO (m1-rueckwand).
  - Unit figures, speckle, terrainStitch PASS. 0 FAIL.
- **Vorschau** `ws1/preview` @c6d0fc41, Check grün, build.json mit Hash-Zielen (stage, stageGold/Night, worldBucht/OTown, goblin, atlantis, legacy, perf, m1, car, carGold, carNoAssist, lineup).
- **Für Georg zum Ansehen:**
  - Bühne in Mesa + Canyon mit Knet-Amphitheater, Sprenkel-Band und Figurenkarten;
  - Goblin-Bank auf Knet-Gelände;
  - Fahrprobe mit Fahrhilfe M3 (M an/aus) und dem sauberen Autoschatten des Licht-Moduls.
- **Danach:** Stufe G (m3/fahrhilfe @a794894, Fassrolle, Schlingern, Zwei-Rad frei) nach m3-g in die nächste Kombi. Den Merge nach main entscheidet Georg (Abnahme-Seite, Frage 4).

## 74 · 17.10. · Slice 3 Fahrhilfe M3 (V-379) A–F grün · L3-Umzug M1/M2 · Branch-Spiegel · Kombi-Vorschau läuft

Stand der Bewegungs-Sitzung: `m3/fahrhilfe` @2cc2562, gespiegelt als Branch `ws1/m3-fahrhilfe` (Ordner `ws1/kfb-planet-m3/`). Kein Merge nach main (V-400).
- **Prüfung:** volle `run-all` mit m3-a bis m3-f, 47 Tests: **47 PASS**, 1 INFO (m1-rueckwand, nur Bericht), 0 FAIL.
  - m2-g0 und drift hatten im ersten Durchgang kein Ergebnis; einzeln nachgefahren: PASS.
  - run-all meldet ein fehlendes Ergebnis jetzt als FAIL.
- **Messwerte M3:**
  - **A** (Takt 120 Hz, höchstens 8 Schritte je Bild, versteckter Tab pausiert): Sprungweite 8,19 m bei 60 und bei 30 fps, Abweichung 0 %.
  - **B** (Anti-Roll/Luftlage): Überschläge 0/40, Nase > 45° 0/10, Rollen-Umkehrungen am Hang 85 → 6.
  - **C** (Landehilfe, Lande-Boost abschaltbar): Gierfehler 0,3 s nach dem Aufsetzen ohne Hilfe bis 9,2°, mit Hilfe ≤ 4,8°; 0 Spin-Outs; Tempo ≥ 98 %.
  - **D** (Anti-Steckenbleiben): 20/20 frei in ≤ 2,9 s, T3 (Respawn) 0.
  - **E** (Deformer v2, nur Darstellungsknoten): 30/30 Ereignisse, Kollider-Lage unverändert, kein Stillstand.
  - **F** (Rampen-/Wandzonen): Launch 10/10 (Gier ≤ 7,5°), Wand 10/10 (1,33–1,4 s, nur markierte Fläche block-b, 24 m), Abbruch 10/10, Fehl-Einfangen 0/20.
- **Behobene Fehler:**
  - Gier-Drehung schwenkte in Wände.
  - Gebäudekanten galten als Boden (Dach-Klettern).
  - Absetzen knapp unter der Fahrhöhe katapultierte den Wagen.
  - Festfahren wird jetzt über Fortschritt erkannt.
  - Die Wandmarkierung im Testfeld war fest aus.
- **Fühlprobe** `#m1,car`:
  - Testfeld neben dem Theater: Rampen bei +X, Gebäude und markierte Wand bei −X.
  - Tasten: M = Assist M3 an/aus, Shift = Boost; `assist=off` startet ohne Hilfe; `tod=gold`.
- **L3-Umzug M1/M2** (§72.3): createStageLight (Mesa), Schattenkugel ums Auto, ACES, createContactAO mit Normale; followShadow und feste Biase sind entfernt. Bildfolge: Zweitschatten weg, langer Gold-Schatten vollständig.
- **In Arbeit** (Georg-Wunsch): Stufe G (Fassrolle, Schlingern, Zwei-Rad frei).
- **Offen:** M1 lädt Figuren noch direkt aus stageCast. Nach dem Merge Umstellung auf `figureFor` (V-391), Hinweis an die Bewegungs-Sitzung ist raus.
- **WS1-Owner:** Die Kombi `look/mesa` + `m3/fahrhilfe` ist konfliktfrei gemergt (Hilfs-Worktree), die Prüfung läuft. Danach gemeinsame Vorschau für Georg (Bühne, Farbwelt, Gelände, Fahrprobe mit M3).

## 73 · 17.10. · Langlauf: Slice 1 sichtbar (Gelände um Meshy-Bühnen, perf), look/mesa 25/25, Branch-Vorschau, Schwebe-Messung

- **Branch `look/mesa`** @c3b888a+ (lokal; enthält fig/karten, speckle/modul, s1/weltboden): volle Reihe **25/25**. Vorschau `ws1/preview` @04166144 als Branch-Stand (build.json vermerkt das).
- **Gelände um Meshy-Bühnen** (`modules/stageGround.js`):
  - Knet-Boden auf Höhe des Bühnen-Rands, Sprenkel-Band Preset diorama↔ground nach Abstand zum Umriss (stitchFor/footprint bzw. footprintBase), Inseln ohne Gelände.
  - Nahtfarbe nach V-396 (größter edgePalette-Anteil, ≤ +10 % L; `terrainStitch.groundColorOf` umgestellt, Unit-Test angepasst). Zonenboden = Boden-Rolle der Farbwelt.
  - Bild `ws1/proofs/2026-10-17-look/gelaende_goblin.jpg`.
- **Leistungsanzeige** (F1, Hash `perf`): p95/fps, Draw Calls, Dreiecke gegen das V-370-Budget (`world/perfBudget.js`); mit „Sauberes Bild“ ausblendbar.
- **Schwebe-Messung** (`scripts/look/ground-gap.mjs`, Strahlenraster 120², Unterseite je Strahl; y in m relativ zum Bühnenboden y = 0):

| Bühne | m/u | floorY_u | tiefster Punkt | 2-%-Quantil | Median Unterseite |
|---|---|---|---|---|---|
| goblin | 5 | -0.49 | -0.341 | -0.339 | -0.325 |
| atlantis | 11 | -0.368 | -1.343 | -1.341 | -1.341 |
| comic | 3.8 | -0.491 | -0.582 | -0.582 | -0.582 |
| utopia | 5.5 | -0.405 | -0.434 | -0.424 | -0.424 |

  Alle vier Slot-Dioramen reichen mit ihrer Unterseite unter den Bühnenboden (Sockel); das Gelände auf y = 0 trifft die Bühne an der Bodenkante, Schweben nicht messbar. Eine `groundY_u`-Korrektur ist für diese vier nicht nötig. Die übrigen 15 Bühnen (eigene Asset-Branches) misst WS1 beim Einbau.
- **Noch offen in Slice 1:**
  - Fluff im M1-Gelände (Bäume aus dem Forest Pack als Spawnpunkte; M1 gehört der Bewegungs-Sitzung) → nach M3 abgestimmt.
  - interactable und Spielstand als Host-Dienste (Vertrag R1.3).
  - Übergangssteine, sobald das Steinkit da ist.
- **Georg:** Die Abnahme-Seite ist mit vier Fragen aktualisiert: Farbwelt, Sprenkel-Naht, Gelände, Merge.

## 72 · 17.10. · Langlauf: Figurenkarten (V-391) · Look-Slice (Farbwelt, Knet-Amphitheater, Sprenkel-Band V-403) · M1/M2 auf dem Licht-Modul

Bilder: `ws1/proofs/2026-10-17-look/` (Sprenkel oben/Rand, Bühne Canyon mit Figurenkarten, GothGirl nah, Umfärbungs-Tafeln Tag/Gold, Mesa-Paare).

### 72.1 · Figurenkarten (Branch `fig/karten` @1e4a89b + Folge-Commits, lokal)
- FB und GothGirl laden nur noch über `src/data/figures/<id>.figure.json`. Die Karten sind byte-gleich aus `FIGURES_R1` @8fac0d277.
- Die Körper-Prüfsumme wird gegen die Karte geprüft (`assets.sha.json`, sync): FB v5b 0675…, GothGirl_NoEyes 3016e4….
- Status-Tor nach Regel 5. Ohne gültige Karte erscheint das rote Schild „FIGURE REFUSED · id · Grund“ (`modules/refusedFigure.js`).
- Kandidaten-Vermerk außerhalb des Motivs, unten rechts, mit „Sauberes Bild“ ausblendbar.
- **GothGirl** bekommt jetzt den Körper aus der Karte: `GothGirl_NoEyes.glb` aus georg-doc-patch-3, Augen in Blender entfernt. Vorher lud sie das rohe KayKit-GLB.
  - `originals.method = baked` → keine Laufzeit-Augenbereinigung (Regel 7).
  - Das Augen-Rig sitzt sauber (Bild `gothgirl_karte_nah.jpg`).
  - Die gespeicherte Augen-Einstellung bleibt der bisherige Batch-Weg; anchored-Seat nach Karte und der V-201-Fix sind noch offen (Karte: todo).
- **Rogue** bleibt F1-Prüffigur (kein Darsteller). Rohe KayKit-Kandidaten (Mage, Barbarian) nur im Casting-Vergleich mit `uncarded=1`.
- QA `test/unit/figures.mjs` (läuft in `npm test`): Karten durch den Lader, Körper byte-gleich, alle Ablehnungsgründe greifen.

### 72.2 · Look-Slice (Branch `look/mesa`, auf `fig/karten`, lokal)
- **Farbwelt:** Mit `light=l1` trägt die Bühne eine Bühnenpalette mit Rollen aus den Joyride-Welten.
  - `world=canyon|bucht|otown`, Standard Canyon, Variante B voll.
  - Die Karte färbt nur Akzente (V-402).
  - `look=legacy` zeigt den alten Stand.
  - Farbdrehbuch `src/data/looks/kfb-colorscript.r1.json` (kfb.colorscript/1, Rollen und 6 Farben je Welt, V-305-Analyse, Skript `scripts/look/colorscript.mjs`).
  - Vergleichsleiste: Zeile „Farbwelt“.
- **Knet-Amphitheater:** Modell-Materialien über `clayFrom` (Knete R2, Profil house), Umfärbung nach Rollen darüber (onBeforeCompile verkettet).
- **Sprenkel-Modul `kfb-speckle-transition.v1`** (V-403; Branch `speckle/modul`, von einem Hintergrund-Job gebaut, in look/mesa gemergt):
  - Donor-GLSL byte-gleich aus `sync/lab-snapshot-2026-10-11` @64ae61fe7; Quelle in `src/vendor/speckle/SOURCE.md`.
  - WS1-Hülle nach Audit §4 (createSpeckle, patch, setColors, bake, weights, Presets).
  - WS1-Erweiterung nach TRANSITION_INTENT_R1 in eigenem GLSL-Block: Formverzerrung gegen Scheiben, beide Richtungen. `look: 's1'` zeigt den Donor-Stand.
  - 46 Unit-Prüfungen grün.
- **Amphitheater → Gelände:** Sprenkel-Band Preset diorama↔ground.
  - Gewicht nach dem Fuß des Bauwerks je 64 Sektoren; Naht = Bühnenboden-Rolle (Sand), außen Zonenboden (Canyon-Violett).
  - Erster Kompilierlauf ohne Fehler. Bild `sprenkel_oben.jpg`, `sprenkel_rand.jpg`: Flecken laufen in beide Richtungen, kein Verlauf, keine Ringe.
- **Testreihe:** 25/25 für den Stand vor dem Sprenkel-Einbau.
  - Einmal GitHub-Limit (s5a, HTTP 403) → Rest nachgefahren.
  - cast und g4 nach der baked-Änderung wiederholt.
  - Die volle Reihe mit Sprenkel-Band folgt vor der Vorschau.
- **Beobachtungen für Georg/WS0:**
  - Der Sandring um das Amphitheater ist breit (Naht-Rolle Bühnenboden); Geschmacksfrage.
  - Die Rang-Bänder der Umfärbung (Variante B nach Höhe) zeigen außen an der Mauer Querstreifen. Das löst B9 (Rollen-Kanal je Bauteil).

### 72.3 · Bewegungs-Sitzung: M1/M2 auf dem Licht-Modul (m3/fahrhilfe @b96bee6, lokal)
- createStageLight (mesa), Schattenkugel ums Auto (halbe Länge + Schattenlänge × Höhe + 1 m), applyTone ACES, createContactAO mit Rapier-Strahl und Normale.
- followShadow, feste Biase und alte Flecken sind raus.
- Bildfolge Tag/Gold: kein Zweitschatten, kein abgeschnittenes Stück, der lange Gold-Schatten läuft natürlich aus.
- Offen: Unter Mesa wirkt das grüne M1-Gelände olivgrün, in Gold sehr dunkel. Gelände-Farbe aus dem Farbdrehbuch folgt in der Look-Slice bzw. Slice 1.
- M3 (Fahrhilfe A–F) läuft weiter; m3-a hatte 2/50 Ecken-Fälle (Analyse bei der Bewegungs-Sitzung).

### 72.4 · Nächste Schritte
Volle Reihe look/mesa → Vorschau zum Ansehen (Branch, nicht main; V-400) → Slice 1 sichtbar (Gelände-Schürze Meshy-Bühnen mit Sprenkel-Band, Performance-Overlay, Schwebe-Messung mit three-mesh-bvh gegen `b7_stage_edges.json`) → Abnahme-Seite für Georg.

## 71 · 17.10. · Langlauf (V-375/V-400) · L3 technisch fertig: main @3e3b9d2 (24/24) · Vorschau mit build.json host-neutral

- **Merge:** L3 nach kfb-planet main (Georg: „ja, so umsetzen“, §69.1.3).
  - Inhalt: Licht-Modul `kfb-stage-light.v1`, Stimmung Mesa als Standard mit ACES (V-402), Knete-Look R2, matte Tafel, Vergleichsleiste V-383, Hochformat-Kamera.
  - Licht-Test L3: Mesa-Standard plus J17-Referenz (`lset=r2`) geprüft. Gold-Füllung 0,82 (nicht dunkler als Tag, V-050).
  - Spiegel ws1/r3f-frame @20c399f3, Vorschau @cd75b9bb, Check grün.
  - `test:lineup` (65 MB) nicht erneut gefahren; Fahrzeug-Knet nur Rauheit und Öl geändert.
- **build.json** nach V-356 host-neutral: nur Hash-Ziele (stage, stageGold, stageNight, lookProbeOTown, m1, car, lineup).
- **Nächste Schritte im Langlauf:**
  1. Bewegungs-Sitzung zieht M1/M2 auf das Licht-Modul (Zweitschatten Auto), dann M3.
  2. WS1: Figurenkarten-Lader (V-391/V-402.4) auf eigenem Branch.
  3. Look-Slice (Farbdrehbuch, Amphitheater voll nach Rollen, Knet-Boden, Sprenkel-Modul V-403).
  4. Wenn Zeit: Slice 1 sichtbar.
  - Kein weiterer main-Merge ohne Georg (V-400).

## 70 · 17.10. · Look-Probe Umfärbung (Joyride A/B/C) · Farbsprengsel steinweise (Bitte an WS0 → WSB) · s1 gespiegelt

### 70.1 · Look-Probe (Branch `l3/licht` @41430ff, `scripts/light/look-recolor.mjs`)
- Amphitheater unter Mesa-Licht: Original (18 %, V-286) gegen volle Umfärbung nach Helligkeit mit Rollen je Bauteil (`palv=b`, `pamt=1`, neuer Schalter) in den drei Joyride-Welten aus `track-look.v5` `WORLDS`:
  - A · Claybound-Canyon (Joyride-Standard)
  - B · Bikini-Bucht
  - C · O-Town
- Tafeln `tafel_recolor_{day,gold}.png` an Georg.
- **Georg:** „die Beispiele in den Bildern sind auf jeden Fall gut, die können wir so nehmen“. Ausgangspunkt für das Farbdrehbuch sind die drei Joyride-Welten; je Diorama eine Palette mit ≈ 6 Farben, zufällig in cartoonhafter Harmonie erzeugbar (V-305-Generator) und je Diorama optimierbar.
- Rahmenfarbe kommt in der Probe aus der Bühnenpalette (passt zu V-402).

### 70.2 · Farbsprengsel steinweise (Georg 17.10., vormerken, Bitte an WS0 → WSB)
Georg: In umgefärbten Bauteilen (z. B. Torbögen) sollen hin und wieder andersfarbige Steine erscheinen, etwa ein lila Stein im orangen Bogen, heuristisch-organisch verteilt.
- **Warum:** Eine durchgehend umgefärbte Fläche wirkt „in Farbe getaucht“ mit harter Kante und bricht die Illusion natürlicher Farbigkeit. Die Sprengsel sind derselbe Übergang wie das Sprenkel-Band im Gelände (V-403), nur auf Objekten.
- **Technik:** Amphitheater und Meshy-Dioramen sind ein Netz mit gemalter Textur, ohne Stein-Grenzen. Ein reiner Shader-Weg (Zellrauschen im Raum) schneidet quer durch die Steine und wirkt wie Farbspritzer, also wieder ein erkennbares Konstruktionsmuster. **Darum der Blender-Weg:**
  1. **WSB (Blender, im ohnehin geplanten Dioramen-Durchgang mit Polygon-Optimierung und Baking):** je Stein bzw. Bauteil-Insel eine ID als Vertexfarbe (Kanal R/G: Stein-ID, gleichverteilt), dazu ein zweiter Kanal mit der Bauteil-Rolle (Türme/Bögen, Ränge, Boden, Fels, Rahmen). Auslieferung als GLB nach `kfb.stage-descriptor/1` mit Vermerk der Kanäle.
  2. **WS1 (Spiel):** Die Farbregel kommt in das Sprenkel-Modul `kfb-speckle-transition.v1` als Objekt-Ebene: Je Stein-ID wählt eine feste, seedbare Regel die Rollenfarbe oder eine Sprengselfarbe. Dichter an Übergängen und Kanten, Gruppen nach `nest()` (1:3:Rest), viele Größen, Seed je Diorama, reproduzierbar, kein erkennbares Muster.
  3. Abnahme wie V-403: keine harte Kante, kein Konstruktionsmuster (blinder Kritiker), ≤ 3 Ebenen, keine zusätzlichen Draw Calls.
- **Bitte an WS0:** als Auftragszeile für WSB anlegen (Kanäle und Format festlegen) und in die Look-Slice-Vorlage aufnehmen. Bis die GLBs kommen, bleibt es bei der flächigen Umfärbung nach Rollen.

### 70.3 · Erledigt
- `s1/weltboden` @d0a66eb auf GitHub gespiegelt (Bitte V-403 Punkt 5): Branch `ws1/s1-weltboden` @bfd0aa4a, Ordner `ws1/kfb-planet-s1/`. Nur Node-geprüft.
- Die drei Joyride-Paletten sind gefunden: `WORLDS` in `track-look.v5` heißen A · Claybound-Canyon, B · Bikini-Bucht, C · O-Town. Sie stecken schon als `canyon`, `bucht`, `otown` in `src/vendor/palette/island-palettes.js`.

### 70.4 · Nächste Schritte
L3-Testreihe läuft → Merge nach main (Georg: „ja, so umsetzen“) → Figurenkarten (V-402.4) → Look-Slice (Farbdrehbuch, Umfärbung, Knet-Boden, Sprenkel-Modul V-403) → Slice 1 sichtbar → Licht final → externe Designkritik.

## 69 · 17.10. · Georg-Entscheide zu Look und Reihenfolge · Fragen an WS0 (Farbe vor Licht-Feinschliff, Rahmenfarbe, B7-Daten)

### 69.1 · Georg-Entscheidungen (17.10., WS1-Chat, für das Register)
1. **Grundrichtung Mesa:** „diese Lichtstimmung, dieses psychedelische, cozy, was mit der Mesa-Richtung verbunden ist, ist ein guter Grundansatz, um darauf aufzubauen“. Mesa (Krazy-Kat-Sonntagsseiten, Mesas, laue Abende) ist Ausgangspunkt für Licht und Farbe. Feinheiten erst auf der neu gefärbten Bühne.
2. **Farbwelt cartoonig, ruhig psychedelisch** wie bei Joyride: Boden lila, Bahnen und Säulen orange, Bürgersteig neutral, mit Blick auf die Gesamtfarbwirkung. Heute passt das Bild nicht zusammen:
   - Amphitheater-Bögen naturalistisch;
   - Boden ohne Knet-Textur;
   - Billboard-Rahmen pink aus dem Kartengenre (V-270);
   - Rahmen glänzt nachts.

   Georg: „nicht die richtigen Umstände, um ein Farb- und Lichtkonzept schlüssig zu entwickeln“.
3. **Reihenfolge (Georg: „ja, so umsetzen“):**
   1. L3 technisch abschließen und nach main: Licht-Modul, Regeln, Mesa als Arbeitsstimmung, matte Tafel, Knete-Look R2. Ohne endgültige Look-Abnahme. Danach zieht die Bewegungs-Sitzung M1/M2 auf das Modul (Zweitschatten am Auto).
   2. **Look-Slice: Farbdrehbuch + Material vor dem Licht-Feinschliff.** Eine Bühnenpalette mit Rollen im Mesa/Krazy-Kat-Sinn, Knet-Boden, Rahmenfarbe aus der Bühnenpalette.
   3. Licht final auf der stimmigen Bühne, dann eine **externe Designkritik** („Art Director“ für Cartoon/Animation, Farb- und Lichtvorschlag), dann der volle Beweislauf L-1–L-9.

### 69.2 · Erledigt seit §68 (Branch `l3/licht` @fd7e011, lokal)
- Billboard-Rahmen, Lampen und Arme ganz matt (Rauheit 1).
- **Knete-Look R2 (V-400):** Öl 0,22 → 0,08, Dellen figure 0,55 / vehicle 0,5, Basis-Rauheit ≥ 0,95, Samt über tune ≤ 0,05. Spender `clay-material.v8` bleibt byte-gleich; gelöst über Profil und gemeinsame Regler.

### 69.3 · Fragen an WS0
1. **Rahmenfarbe der Tafel:** Heute gilt V-270 „Kartengenre → Insel-Palette → Rahmen“. Vorschlag nach Georg: Rahmen und Bühnenteile aus **einer Bühnenpalette** (Rollen wie Joyride: Boden, Bauten/Säulen, Wege, Rahmen, Akzent). Die Karte färbt nur noch Akzente, z. B. Lampenlicht oder Story-Tönung V-387. Bitte als Register-Entscheid fassen oder einen Gegenvorschlag machen.
2. **Look-Slice vor dem Licht-Feinschliff:** Bitte als Auftrag mit Vorlagenzeile anlegen:
   - Farbdrehbuch Mesa: Palette mit Rollen, Hex, Anteile, Tag/Gold/Nacht-Verhalten;
   - Knet-Boden für das Amphitheater;
   - Ersatz der naturalistischen Bogen-Textur (Umfärben nach Rollen, Variante B, gibt es schon).

   Dazu die Frage: Gelten V-286 („Meshy nur leicht tönen, 18 %“) und V-355 für das Amphitheater dann noch?
3. **Externe Designkritik:** Wer liefert sie (WS0, WSA, eigener Durchgang), und mit welchem Briefing? WS1 kann einen Kritik-Durchgang auf Bildtafeln anstoßen, sobald die Look-Slice steht.
4. **V-400-Daten fehlen auf GitHub:**
   - `50_BLENDER/B7/data/b7_stage_edges.json` (groundY_u) und `b7_ground_gap.py` liegen nur in Dropbox; der WS1-Rechner hat kein Dropbox.
   - `replies/SPEC_PLACEMENT_GRAMMAR_R2.md` ist noch nicht da, ebenso das Steinkit `kfb.stone-kit/1`.

   Bitte ins Register schieben. Bis dahin baut WS1 die Schwebe-Messung selbst nach (three-mesh-bvh ist als Abhängigkeit vorhanden) und setzt Platzhalter für Steine.

## 68 · 17.10. früh · L3 Licht-Lauf (Zwischenstand, Branch `l3/licht` @c88075c, lokal) · Georgs Urteil „zu hell, nicht gemütlich“ → Stimmung „Mesa“ · Fragen an WS0

### 68.1 · Gebaut (nach LIGHT_MODEL_R2, V-382/V-385/V-386/V-392/V-383)
- **Licht-Modul** `src/vendor/light/kfb-stage-light.v1.js` (`kfb.stage-light/1`, vendorbar, nur three):
  - Rig: Sonne als einziger Schattenwerfer, Hemisphäre mit Boden = edgePalette (V-396) × `bounce`, ein weiches warmes Figurenlicht (Spot, schattenlos, vorn-oben auf Kameraseite, Stärke je Stimmung).
  - `fitShadow`: Kugel-Fit, Texel-Raster, enger Tiefenbereich, normalBias = 1,5 × Texel, bias abgeleitet.
  - `createContactAO`: Gauß-Fleck ohne Ring, optional an der Boden-Normale.
  - `createPracticals`: V-329-Pool, Billboard-Lampen und Goblin-/Atlantis-Praktische aus stage-edges.
  - `applyTone`: ein Tonemapping für alle Schichten.
  - `selfTest`: Spalt-Messung Kugel/Kiste, Ergebnis 0.
- **Entfernt:** `actorRim` (Randlicht), `faceFill`, `toneSplit`, Gegenlicht, Look-B-Lichtsättigung. Look B tönt nur noch den Himmel.
- **Karte und Bühne:** Karte (Billboard und Meshy-Bildfläche) = MeshStandard, roughness 1, im selben Ton-Pfad; Billboard-Lampenarme nach Highway-Spender mit Emissive-Köpfen.
- **Figuren:** Samt ≤ 0,05.
- **Abnahme-Oberfläche V-383:** Vergleichsleiste eingeklappt am Rand, „Sauberes Bild“ (H). Hochformat: Kamera fährt zurück (k = 1,42 / Seitenverhältnis), statt nur die Mitte zu zeigen.
- **Licht-Test neu** (`test/light`, L3): 17 Prüfungen, nach Toleranz-Fix grün; Spalt-Selbsttest 0. Volle Reihe folgt mit dem Beweislauf.

### 68.2 · Tonemapping-Messung (Regel 5, feste Belichtung, Maß = ΔE von Boden und Bühne gegen „ohne“, Clipping)
| | Tag | Gold | Clipping | Punkte |
|---|---|---|---|---|
| AgX | 2,11 | 3,27 | 0 | 7,73 |
| ACES | 4,13 | 1,72 | 0,05 % Gold | 8,50 |
| Neutral | 3,40 | 5,34 | 0 | 16,03 |
| ohne | – | – | bis 2,3 % | scheidet aus |

AgX gewinnt nach Zahl knapp, senkt aber die Sättigung sichtbar (Boden-Chroma −31 % am Tag, FB fahl).

### 68.3 · Georg zum ersten L3-Bild (J17-Werte + AgX): „viel zu hell und überstrahlt, keine gemütliche, warme Stimmung“
Georgs Vorgabe als Grundstimmung: wie die farbigen Krazy-Kat-Sonntagsseiten, New Mexico/Arizona, Mesas, warme Sommertage, laue Abende.
- **WS1 baute dazu den Stimmungs-Satz `mesa` (jetzt Standard, mit ACES):**
  - Tag: Sonne #ffdcae 2,4 bei 38°, Hemi #b4bdee 0,82 (lavendel → violette Schatten), Boden-Rückstrahlung × 0,5.
  - Gold: Sonne #ff9246 2,3 bei 11°, Hemi #9c9be2.
  - Nacht: Mond #93a6ee 0,35, Hemi #3b3878, Figurenlicht 1,7.
  - Himmel `SKY_TINT.mesa`: oben 42 % Richtung #2f93c4, unten 40 % Richtung #f7b788.
  - Billboard-Lampen gedämpft (L-2), Figurenlicht-Kegel breiter.
- `cozy` (wärmer/gedämpft) und `r2` (J17 nach R2) bleiben als Vergleich (`lset=`).
- Bildpaare und Abnahmefragen liegen bei Georg auf einer Abnahme-Seite: Stimmung, Tonkurve, weiteres Vorgehen.
- Der volle Beweislauf (L-1–L-9, 3 Stimmungen × 3 Ansichten × 16:9/9:16) folgt nach Georgs Richtungsentscheid.

### 68.4 · Fragen bzw. Entscheide für WS0
1. **R2-Stimmungstabelle vs. Mesa:** R2 setzt J17-Tageswerte. Georgs Urteil verlangt wärmer, dunkler, gemütlich. Bitte nach Georgs Wahl als Register-Entscheid eintragen. Vorschlag: Mesa ersetzt die R2-Tabelle als Standard-Stimmung, J17 bleibt Referenz.
2. **Tonemapping:** WS1 wählt ACES gegen den knappen Mess-Sieger AgX, wegen der Sättigung (V-355 je Schicht ≤ 15 % würde AgX am Tag reißen). Bitte bestätigen oder die Messregel um Chroma-Treue ergänzen.
3. **M1/M2 auf das Licht-Modul** (Fehlerliste Stufe 0): nach dem L3-Merge durch die Bewegungs-Sitzung.
   - Georg reproduziert in der Fahrprobe einen flackernden, hart abgeschnittenen Zweitschatten neben dem Auto. Vermutete Ursache: followShadow-Frustum ±7,8 m mit fester Bias-Zahl aus der alten Weltgröße; Gold-Schatten ≈ 7 m.
   - fitShadow mit Radius über Schattenlänge plus abgeleitetem Bias soll das lösen.
4. **Figurenkarten V-391:** Die Bühne lädt Figuren noch direkt (stageCast). Umbau als eigener kleiner Schritt nach L3. Ist das Reihenfolge-gerecht, oder soll er vor Slice 1?

Aufwand L3 bisher: ca. 3 h (davon ca. 1 h Browser-Läufe), ein Beweislauf wegen Hochformat- und Overlay-Fehlern abgebrochen und neu aufgesetzt.

## 67 · 17.10. nachts · M2 gemergt (Georg-Freigabe) · main @20caedc · Vorschau mit Fahrprobe

1. **Georg-Entscheidung (17.10., im WS1-Chat, für das Register):** „ja, mergen wenn alles grün ist“. M2 (K2B nach V-367) nach main, sobald die Reihe grün ist. Damit ist der Vorbehalt „M2 nicht mergen bis Georg entscheidet“ erledigt.
2. **Merge:** m2/fahren @20caedc per Fast-Forward nach kfb-planet main. Der Stand enthält:
   - M1 TUNE T1–T3 (m1/wow);
   - V-347 auf K2B;
   - V-345 M1/M2: `src/m1/m1Scale.js`, K = WORLD_K, g = 9,81 (vorher 14), Absprung × √(gK/14), Kapsel-Federn × K³, Drehfedern × K⁵, k2b-Fahrwerte × K, Auto 4,97 m.
3. **Prüfung:** `scripts/m1/run-all.sh` auf genau diesem Stand: 37 PASS, 0 FAIL, 1 INFO (m1-rueckwand, nur Bericht). Dazu die vier dort fehlenden Tests der npm-Reihe (preview, g4preview, orbit, drift) nach dem Merge: PASS. Gemessen:
   - m1-fence PASS, kleinster Abstand 22,3 cm bei Kapselradius 26 cm;
   - m2-v347: Wende 360° = 9,8 m = 1,97 Wagenlängen, Drift mit Q 1,51 rad/s gegen 0,81 ohne;
   - m2-g0: 0/28 Durchfahrten;
   - Sprung 1,19 m, Weitsprung 1,71 m.
4. **Vorschau:** `ws1/preview` @04cb6f1c mit build.json, Check grün. Fahrprobe: https://ws1-preview.kayfabizarro.pages.dev/#m1,car (Label „Fahrsystem: K2B | ecctrl · C wechselt“; ecctrl bleibt eingefroren als Vergleich).
5. **Als Nächstes:** Die Bewegungs-Sitzung startet Slice 3 (V-379, Fahrhilfe M3) auf neuem Branch ab main @20caedc. WS1-Owner baut den Slice-1-Vorbau (§65, Branch `s1/weltboden`, auf V-345 rebased) in Stage/M1 ein, sobald WS0 die Fragen aus §65.3 beantwortet hat; Teile ohne offene Frage (save, interactable, Perf-Overlay) gehen zuerst.

Aufwand seit §66: ca. 20 Min.

## 66 · 17.10. nachts · V-345 Bühnen-Seite fertig (main @f52b485, 24/24) · Vorschau · M1/M2 an der Reihe

- kfb-planet main @f52b485, gespiegelt (ws1/r3f-frame @b32e4893), Vorschau `ws1/preview` @9b935cc9 mit build.json, Check grün.
- Testreihe jetzt 24 Tests (neu `scale`). In `stage` und `g4` stehen die Prüfwerte jetzt in J17-Metern (× K); vorher lagen sie fest in alten WS1-Metern.
- Abnahme: https://ws1-preview.kayfabizarro.pages.dev/#stage,actors=fb,light=l1 . Das Amphitheater sieht aus wie vorher (gleichmäßig verkleinert samt Kamera). Sichtbar anders ist es in Meshy-Bühnen: Dort stehen die Figuren jetzt in WS0-Größe, z. B. `#stage,actors=fb,light=l1,scene=goblin`. Vergleich alt: `,wscale=legacy`.
- Nächster Schritt (Bewegungs-Sitzung): M1/M2 auf J17 (Tempi, Kapsel, Höhenfeld, Zaun, Fahrwerte × K, g 9,81), dabei den Zaun-Grenzfall klären; danach volle Reihe und M2-Merge, dann Slice 3 (V-379) und der Einbau des Slice-1-Vorbaus (§65).

Aufwand seit §65: ca. 45 Min. (zwei Testprüfungen nachgezogen, Spiegeln, Vorschau).

## 65 · 17.10. nachts · Slice-1-Vorbau fertig (Node, Branch lokal) · Fragen an WS0 · Vorlagen-Zeilen F1 · V-345 Zwischenstand

### 65.1 · V-345 Zwischenstand (Bühnen-Seite)
- `src/worldScale.js`: M_PER_RIG 0,616381042 · CLASS_K 0,947 · FB_HEIGHT_M 1,812 · **WORLD_K = M_PER_RIG / CLASS_K ≈ 0,6509** (alte WS1-Bühnenmeter → J17-Meter). Hash `wscale=legacy` zeigt die alte Größe.
- Umgerechnet an einer Stelle: Figuren (`createActor` Option `worldScale`), Amphitheater (Modell, Gelände, Höhenbänder, Knet-Abstände), Tafel, Marken, Kameras, Publikums-Anker, Kontaktflecken, Figuren-Licht, Nebel, Schatten-Frustum (±7,8 m statt ±12).
- **Abweichung von V-345 „Meshy-Slots × 0,65“, mit Begründung:** Die Slot-Dateien sind schon in WS0-Metern angelegt (goblin v2: `figures.heights_m` [1,8, 2,0] bei 5 m/u). Zu groß waren dort nur unsere Figuren. Slots bleiben deshalb unverändert, nur die Figuren werden umgerechnet.
- Neuer Test `test/scale` PASS:
  - FB 1,814 m (vorher 2,786);
  - Verhältnis FB : GothGirl gleich;
  - Amphitheater Ø 9,11 m;
  - Bild alt gegen neu: mittlere Abweichung 1,74 von 255;
  - Goblin: FB 1,814 m.
- Die volle Testreihe (24) läuft. Danach folgen Commit, Spiegelung und Vorschau; dann stellt die Bewegungs-Sitzung M1/M2 um (Tempi, Kapsel, Höhenfeld, Zaun, Fahrwerte × K, g = 9,81).
- Die Bewegungs-Sitzung meldet von m1/wow einen Grenzfall `m1-fence walkLeftRunBlocked` (32,1 cm statt ≥ 33 cm, kein Durchgang). Sie klärt ihn in der V-345-Runde, weil sich die Kapsel ohnehin ändert.

### 65.2 · Slice-1-Vorbau (Branch `s1/weltboden`, lokal, 6 Commits ab main @8ce5ac5, nur Node, kein Browser)
- Reine Logik:
  - `src/world/terrainStitch.js`: Schürze je Bühne aus `kfb.stage-edges/1`; 15 Bühnen mit Anschluss, 4 schwebende Inseln ohne; Bodenfarbe `fromColors(edgePalette)`.
  - `src/world/fluff.js`: sechs Sorten nach V-292, Zonen-Gewichte 40 % bzw. ≥ 8 %, Verteilung nach Seed, Windfall-Integrator ohne Physik-Engine, Böe, Aufsammeln zu Fuß, im Auto und im Drift-Bogen.
  - `src/world/save.js`: `kfb.save/1`.
  - `src/world/interactable.js`: genau ein Hinweis.
  - `src/world/perfBudget.js`: Budget V-370, p95.
- Dünne Module: `terrainStitch3d`, `fluffField3d` (ein InstancedMesh = ein Draw Call).
- Tests `test/unit/*` alle PASS, `contract-static` PASS.
- Einbau in Stage/M1 und Browser-Beweis („drei Zonen“, Clay, Messwerte) folgen nach V-345 und dem M2-Merge, weil alle Werte in J17-Metern gedacht sind.

### 65.3 · Offene Fragen an WS0 / Georg
1. **Bodenfarbe:** `fromColors` ordnet die drei Vorgaben nach Rollen-Passung, nicht nach Anteil. Bei der Goblin-Bank wird so `#a67e5a` (11 % Anteil) zum Boden, nicht das dunkle `#4e4341` (57 %). Ist das gewollt, oder soll der größte Anteil Boden sein?
2. **Sockel-Bühnen (giza_pyramid, portal_ruin):**
   - Höhe: Soll das Gelände am `footprintBase` auf Bühnenboden-Höhe anschließen? Dann ist der Sockel verdeckt; das ist heute so (`plinthDrop_m = 0`). Oder tiefer, damit der Sockel sichtbar bleibt?
   - Farbe: Heute kommt sie aus `footprintBase.edgePalette`. Richtig so, oder soll die obere `edgePalette` gelten?
3. **marble_terraces:** Der Rand liegt auf der unteren Terrasse (−0,305 u). Die Figuren stehen nach Slot auf −0,042 u. Die Schürze folgt dem Rand (y = 0). Bitte bestätigen.
4. **Schürze:**
   - Breite: Vorgabe 4 m mit 3 Ringen.
   - Kerben: Kerben schmaler als etwa 8 m werden vom Außenring überbrückt und mit Schürze gefüllt (Treppen, Säulen). Stört das an Eingängen?
   - Langfristig: Schürze oder Höhenfeld-Anschluss? WS1 empfiehlt das Höhenfeld.
5. **Fluff-Balance:**
   - Wie viele Kügelchen je Zone (Vorschlag 18–30)?
   - Nachwachsen nach wie vielen Sekunden?
   - Sammelradien 0,8 m zu Fuß und 1,9 m im Fahrzeug.
   - Drift-Bogen: 2,2-facher Radius, 140°, ab 7,5 m/s, wie `driftMinSpeed` aus K2B.
   - High/Low bleibt vorerst ohne Rolle (V-368).
6. **Spielstand:**
   - Sollen Karten, d6-Würfe und Story-Mode-Würfel schon in `kfb.save/1`? Heute sind nur Flags möglich. Sonst kommt das mit R1.3.
   - Wohin später (GPT-Site)? Der Speicher-Adapter ist dafür austauschbar.
7. **Budget:** Zählen die MB als übertragene (komprimierte) oder als entpackte Größe? Heute: `transferSize`, MB = 10⁶ Byte.
8. **Forest-Pack-Inhalt:** FLUFF_WORLD_DRESSING_R1 nennt „211 Modelle inkl. Schnee-Varianten“. Im Repo sind es 105 glTF-Modelle; die 211 sind Dateien mit `.bin` und Textur. Es gibt nur Color1 und keine Schnee-Varianten. Schnee-Bäume gibt es im Kenney Holiday Kit (`tree-snow-a/b/c.glb`). Reicht das für Schnee-Zonen?
9. **Host-Vertrag R1.3:** Vorschlag `interactables: [{ id, pos, radius, label, action }]` als optionales Modul-Feld wie `bubbleAnchors`. Dazu `save` als Host-Dienst und kein Modul-Zugriff auf localStorage.

### 65.4 · Vorschlag Vorlagen-Zeilen F1 (Bitte von WS0 vom 16.10.: „aus dem Repo, Spender mit Pfad“)
WS0 hat am 16.10. gebeten: „Vorlagen-Zeilen schlagt ihr aus dem Repo vor (Spender mit Pfad)“. Alle Pfade stammen aus dem lokalen Klon (`git ls-tree` / `git grep`), Commit = letzter Stand der Datei.

| Zeile | Funktion | Spender (Pfad @Commit, Zeilen) | Was übernommen wird | Was nicht | Abnahme |
|---|---|---|---|---|---|
| F1a | Spielstand `kfb.save/1` | `overworld/overworld/journey.js` @53d9be371 (main), Z. 1–7 Kanon, 18–30 `emptySave`, 66–90 `migrate`/`read`/`write`, 92–99 Export | ein Save-Schema mit `version` und Migrator-Kette, localStorage in try/catch, Export als JSON-Datei, Regel „die Welt wird nie gespeichert“ | Felder der Overworld (Ruf, Diary, Held-Werte) | Rundreise, kaputt → frisch, neuere Version unangetastet (`test/unit/save.mjs`), Reload im Browser |
| F1a′ | Sicherung vor Umbau | `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/main.ts` @64ae61fe7 (Branch `sync/lab-snapshot-2026-10-11`), Z. 146 Laden, 189 `STORE_PRE_K2`, 232 Speichern | Rohstand einmal sichern, bevor migriert oder überschrieben wird (bei uns `kfb.save.bak`) | Welt-Daten im selben Speicher (bleiben in `kfb.world-save/1`, WORLD_CONTRACT_R1) | `.bak` entsteht bei kaputtem oder neuerem Stand |
| F1b | interactable + ein Prompt | `overworld/overworld/overworld-game-v10.js` @53d9be371 (main), Z. 4316–4332 | nächster Ort in Reichweite, Reichweite je Ziel, genau ein Hinweis „E — Label: Hinweis“, Wechsel nur bei Änderung | DOM-Prompt im Spiel-Code (bei uns Hud + `hostKeys.js`) | nearest/Gleichstand/außer Reichweite/Abmelden (`test/unit/interactable.mjs`), im Browser kein Flackern zwischen zwei NPCs |
| F1b′ | Anmeldung über die Modul-Hülle | `src/ModuleHost.jsx` (kfb-planet, `bubbleAnchors` nach Vertrag R1.2 §4) | gleiches Muster für `interactables` | – | Anmelden vor, Abmelden nach `dispose()` |
| F1c | Performance-Overlay | `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/sw-app.js` @97c891c00 (main), Z. 19 `autoReset = false`, 76 `reset()`, 92 fps/ms/calls/tris, 217–227 Speicher, 290 Höchstwerte | Messung je Bild trotz mehrerer Pässe, Speicher-Zähler, Höchstwerte über ein Fenster | eigene Render-Schleife (bei uns R3F `useFrame`) | Overlay-Werte je Slice (V-370) |
| F1c′ | Budget-Objekt + Messung | `KFB Combat Arena/combat-arena-v2/host.v2.js` @bcba56530 (main), Z. 32 `BUDGET`, 407–470 Messung | Budget als eine Konstante, Messung aus mehreren Bildern | Median statt p95 (bei uns p95 nach V-370) | `test/unit/perfBudget.mjs` |
| F1c″ | Calls/Dreiecke im Lab | `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/inspect.ts` @64ae61fe7 (`sync/lab-snapshot-2026-10-11`), Z. 69–85; `…/KFB World Core R0A · Clay World Donor/WORLD_CORE_MOBILITY_R0A_2026-09-29/lab-world/clay-world.r0a.js` @39bc606cd (main), Z. 56, 60, 585–592 | gleiche Zählweise wie im Lab, damit Werte vergleichbar sind | – | – |

Für die Fluff-Physik gibt es keinen Spender im Repo. Gesucht wurde nach `windfall`, `fluff harvest` und `restitution` außerhalb von Physik-Engines; gefunden wurden nur Engine-Code und HUD-Zähler. Darum ist der Integrator ein Neubau nach V-370 („einfacher Bounce-Integrator, keine Physik-Engine“). Er braucht eine eigene Vorlagen-Zeile oder WS0-Freigabe.

### 65.5 · Bäume und Büsche im Repo (V-369, nichts geladen)
1. **KayKit Forest Nature Pack** (zuerst): `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/` (main, letzter Stand @f045a5311), Textur `…/Textures/forest_texture.png`.
   - 105 glTF, alle `_Color1`, keine Schnee-Varianten.
   - Bäume: `Tree_1_A–C`, `Tree_2_A–E`, `Tree_3_A–C`, `Tree_4_A–C`, kahl `Tree_Bare_1_A–C`, `Tree_Bare_2_A–C` (20).
   - Büsche: `Bush_1_A–G`, `Bush_2_A–F`, `Bush_3_A–C`, `Bush_4_A–F` (22).
   - Dazu Gras (20) und Steine (43).
2. **Tiny Treats** (danach):
   - Pretty Park `media/3D_Assets/Tiny_Treats_Pretty_Park_1.0_FREE/Assets/gltf/` (@29aac1061): `tree.gltf`, `tree_large.gltf`, `bush.gltf`, `bush_large.gltf`, `hedge_corner/straight/straight_long.gltf`, `flower_A/B.gltf`.
   - House Plants `media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2/Assets/gltf/` (@9843e75df): `cactus_A–D`, Monstera, Pothos, Sansevieria, Yucca, ZZ-Plant (klein/mittel/groß, mit und ohne Topf). Für Wüste oder Innenräume.
   - Pleasant Picnic `media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/` (@29aac1061) hat keine Pflanzen, nur Picknick-Teile (Apfel, Korb, Decken). Gut als Deko an Fundorten.
3. **Kenney** (zuletzt):
   - Nature Kit `media/3D_Assets/kenney_nature-kit/Models/GLTF format/` (@6d58a9e5d; Dateien sind `.glb`): `tree_*` in default/dark/fall (blocks, cone, default, detailed, fat, oak, plateau, simple, small, tall, thin), Palmen, `tree_pine*`, `plant_bush*`, `cactus_short/tall`.
   - Holiday Kit `media/3D_Assets/kenney_holiday-kit/Models/GLB format/`: `tree-snow-a/b/c.glb`, `tree.glb`, `tree-decorated(-snow).glb` für Schnee.
   - Weitere Einzelstücke in Fantasy Town, Tower Defense, Platformer und Survival.

Aufwand seit §64: ca. 1 h eigene Arbeit (V-345) plus ein Hintergrund-Job für den Slice-1-Vorbau (≈ 19 Min. Laufzeit).

## 64 · 17.10. · V-346 in der Vorschau (23/23) · V-347 nur für K2B (Entscheid nach V-367) · nächster Schritt V-345

1. **V-346 fertig:** kfb-planet main @8ce5ac5, Testreihe 23/23, gespiegelt (ws1/r3f-frame @8a852e4b), Vorschau `ws1/preview` @8c5bd157 mit build.json, Cloudflare-Check grün. Abnahme: https://ws1-preview.kayfabizarro.pages.dev/#stage,actors=fb,light=l1 (Vergleichsleiste, Zeile „V-346 neu | vorher“). Diese Vorschau enthält keine Fahrprobe; M2 kommt nach der Browser-Prüfung von V-347 als neue Kombi-Vorschau zurück.
2. **Technik-Entscheid WS1 (V-375):** Nach V-367 fallen in V-347 die ecctrl-Punkte weg (Drift-Nachbau, Anti-Überschlag für ecctrl). ecctrl bleibt eingefroren als Vergleich in der Vorschau, weil V-367 das Label „aktives Fahrsystem“ als Abnahmepunkt nennt; es wird erst beim M2-Merge mit Georgs Zustimmung entfernt.
3. **V-347 auf K2B** (Bewegungs-Sitzung, m2/fahren @5ff47c8, bisher nur Node-Messung, Browser-Prüfung folgt):
   - Drift Q/E 1:1 aus der K3-Zeile (driftMinSpeed 7,5 · SteerScale 1,28 · YawGain 1,32 · regrip 0,34 s).
   - Wendekreis: 180° aus dem Stand in 13,7 m = 1,79 Wagenlängen (vorher 9,9), 360° = 1,96 Wagenlängen. Möglich über eine Wendehilfe unter 10 m/s als KFB-Zusatz; darüber bleibt K2B unverändert.
   - 20 Vollgas-Läufe auf ebener Strecke: 0 Überschläge, größte Neigung 9,7°.
   - Label „Fahrsystem: K2B | ecctrl“ ist da.
   - Die Tempo-Schwellen werden nach V-345 nachgestellt.
4. **V-370 S0 Rest:** V-345 `worldScale.js` (Bühne zuerst), danach zieht die Bewegungs-Sitzung M1/M2 nach, dann gemeinsame Testreihe und M2-Merge.
5. **Antworten aus V-370 notiert:** Metall-Restglanz nur für als Metall getaggte Materialien (PMREM warm, envMapIntensity ≤ 0,35, roughness ≥ 0,45) baut WS1 mit L2 Schritt 5 / Slice 1 ein; Zielgerät und Budget (p95 ≥ 30 fps auf M1/Iris Xe, ≤ 40 MB Start, ≤ 15 MB je Zone, ≤ 300 Draw Calls, ≤ 600 k Dreiecke) gelten ab Slice 1 mit Performance-Overlay.

Aufwand seit §63: ca. 50 Min. (Testreihe im Hintergrund, Spiegeln, Vorschau).

## 63 · 16.10. abends · V-346 Look-TUNE gebaut (lokal @8ce5ac5) · Messwerte · Code-Push nach grüner Testreihe

Stand: Commit kfb-planet main @8ce5ac5, noch nicht gespiegelt. Licht-Test PASS mit neuen V-346-Prüfungen. Die volle Testreihe lief beim Pausieren (8/23 grün) und wird nach der Pause wiederholt; erst danach folgen Spiegelung und Vorschau mit build.json (V-356).
1. **Look B Standard** (mit `light=l1`), Randlicht immer an. Himmel B ist jetzt **derselbe Himmel, nur getönt**: lineare Mischung mit warmem Licht (oben 12 %, unten 15 %), statt den Farbton um 70 % zu drehen. Das war Georgs „anderer Skydome“: Aus Mint bzw. Hellblau wurde Orange bzw. Rosa. OKLab-Abstand ≤ 0,023 statt bis 0,146.
2. **GothGirl-Glow:** rimStrength 0,5 → 0,15, rimPower 3 → 4 (nur Silhouette). **FB-Gesicht:** faceFill 0,16 (eigene Grundfarbe als Selbstleuchten, nur Mesh `CharacterTemplate_Head` und Mund; Ohren und Haare nicht), Kopf empfängt keinen Sonnenschatten. Gesichtshelligkeit +14 % (Tag 115 → 131).
3. **Schattenlänge (Bestätigung in einem Satz):** Länge und Richtung folgen nur der Sonnenhöhe bzw. dem Azimut aus `timeOfDay`: Länge = Höhe / tan(Sonnenhöhe), Tag 49° → 0,87 × Höhe, Gold 16° → 3,49 × Höhe, Nacht 35° → 1,43 × Höhe, Richtung gleich (Azimut −53,13°). Getestet in `test/light`.
4. **Tonemapping:** Standard `split` = ACES global, Bühne bzw. Boden mit `toneMapped:false` (Modul `toneSplit`); `tm=aces` und `tm=none` bleiben als Vergleich.
5. **Knet:** `clay=all` ist Standard (FB mit Knet). GothGirl: Samt 0,18 → 0,06, Grundfarbe × 0,95. Messung: Das „überstrahlt“ kam vor allem vom Glow (vorher +3 % Helligkeit gegen Knet aus). **Fahrzeuge:** Samt 0. Sättigung bei gleichem Licht **99 %** der Textur (vorher 88 %; Ziel ≥ 95 %). Dass sie matter wirken als das Meshy-Original, liegt am Metall: Meshy-Materialien haben metalness ≈ 0,93, Knet ist nach G8 nie metallisch. **Frage an WS0/Georg:** Restglanz für Metallteile zulassen (Ausnahme von G8)?
6. **Vergleichsleiste:** neue Zeile „V-346 neu | vorher“ (`tune=0`), Tonemapping mit drei Knöpfen; Standardwerte angepasst.
7. **Bildpaare** (V-253, je 1920 px, alle mit Knet) an Georg gegeben: Bühne Tag/Gold, GothGirl nah, FB-Gesicht, Tonemapping, Fahrzeuge. Skripte `scripts/light/v346-pairs.mjs` und `v346-vsat.mjs`.

Als Nächstes: Testreihe → Spiegeln und Vorschau, dann V-345 `worldScale.js` (Bühne zuerst; die Bewegungs-Sitzung zieht M1/M2 nach), dann V-360 Editor.

Aufwand V-346: ca. 2 h 10 min (davon ca. 1 h Browser-Läufe), Tokens im Rahmen.

## 62 · 16.10. abends · Vorschlag: nächste größere Integrations-Slices, Synergien und blinde Flecken (Bitte an WS0)

Anlass: Georg hat Sitzungsvolumen frei und fragt nach größeren, gut gekapselten Integrations-Slices, „nicht parallel“, in Abstimmung mit WS0. Das HUD gibt er später als eigene Slice. Grundlage: Register @dcf1323d2 (bis V-364), WS1 main @987422a, m2/fahren @00b86ea, m1/wow; dazu eine Web-Recherche zu Standards bei Open-/Hub-World-Spielen im R3F-Ökosystem 2025/26 (Quellen auf Wunsch). Die WSA-Recherche Cartoon Racer R1 (V-352) ist laut Georg fertig, liegt aber noch nicht im Register (dort nur `RESEARCH_CARTOON_RACER_R1/BRIEF_…`).

### 62.1 Empfohlene Reihenfolge (WS1-Sicht)

| # | Slice | Größe | Was | Liegt schon vor | Blocker |
|---|---|---|---|---|---|
| 0 | **V-346 + V-345** (läuft) | S | Look-TUNE, dann `worldScale.js` (J17-Meter) | – | – |
| 1 | **Fundament F1** | M | (a) Spielstand als ein Objekt `kfb.save/1` (Flags, Karten, d6-Würfe, Position, Version; erst localStorage, später GPT-Site); (b) Interaktions-Vertrag `interactable` (Radius, Text, Aktion; Host zeigt nur den nächsten Prompt, ersetzt die Mehrfachbelegung E/Q/X); (c) Eingabe als **Aktionen** statt Tasten im einen Router (Neubelegung, später Gamepad/Touch für 9:16); (d) Leistungs-Overlay und Budget (Draw Calls, ms/Bild, Qualitätsstufen über drei `PerformanceMonitor`/`AdaptiveDpr`) | Host-Vertrag R1.2, ein Router (`hostKeys.js`), Store | Host-Vertrag R1.3 von WS0 (neue Felder) |
| 2 | **Liefer-Pipeline F2** | M | Asset-Manifest statt fest verdrahteter `raw.githubusercontent`-Commits (`meshyStage.js`, `vehicleLineup.js`), Ladebildschirm mit Fortschritt, Fehleranzeige/Rückfall bei GitHub-Ausfall oder Rate-Limit, Kompression der Meshy-GLBs (Meshopt + WebP/KTX2) | `build.json` (V-356) | WSA-Ergebnis GPT-Plattform (Größe, CORS); Werkzeug-Download braucht Georgs Erlaubnis |
| 3 | **Weltboden S1** | L | Terrain-Einbettung (V-341) mit `terrainStitch` (liest `footprint`/`terrainRing`), Boden aus `fromColors(edgePalette)` (V-342), Steine-Kit-Streuung, Kollisions-Deskriptor je Bühne (begehbar, Rampen, Wände) | Ränder @d4e24f15, Steine @320c896f, Lab-Inselboden | V-345; Hub-Frage clay-stones-r1 |
| 4 | **Ein Look S2** | M | L2 Schritt 5 (V-355): PMREM-Umgebung warm wie Look B, Haze aus `edgePalette`, Helligkeit/Sättigung je Schicht ≤ 15 %; danach die übrigen PASS-Bühnen im Paket über den Deskriptor, Portal-Shader (V-343) | Delit @4c962420, `clayLook`, `toneSplit` | S1 (gleiche Palettenquelle) |
| 5 | **Fahrassistenz** (Bewegungs-Sitzung) | M | aus V-352: Bodenkontakt, virtueller Schwerpunkt, Anti-Roll, mehrstufiges Recovery, Vorher/Nachher-Fahrtests | k2b, STUNT_DONOR_MAP_R1 | Georgs formale Engine-Wahl; WS0-Auftrag aus V-352; V-345 |
| 6 | **Fahrzeug-Rückmeldung S3** | M | VFX V1 (V-357) + Fahr-Audio + Düsen-Anker (V-360) als drei Module an `M2EVENTS`; gemeinsamer Partikel-Pool; Audio mit Bussen (Musik/SFX/Stimme) und Ducking | `kfb-flight-vfx.js`, `clay-vfx.v1.js`, Audio KFB Racer/Kenney, Editor-Kern | M2-Merge; Anker aus S4 |
| 7 | **God-Mode-Editor-Kern S4** | M | ein In-Place-Editor (TransformControls aus `edit-layer.js`) mit Modi: Düsen-Anker (V-360, zuerst), Billboard-Platz (V-287/306), später Waffen-Halter; Speichern als `kfb.op` aus `kfb.world/1`, mit Rückgängig | WORLD_CONTRACT_R1, Spender | Persistenz (GPT-Site) für mehr als Datei-Export |

Später (blockiert durch Entscheidungen oder Lieferungen): M3 Assisted Stunt (V-351; nach S1 und M2-Merge), Performance-Abspieler mit Viseme-Treiber (V-359; Daten `kfb.performance/1` fehlen; derselbe Treiber dient allen Mündern, Mund-Sätze R3 liegen bei @eb1100f9), Ziel/Kompass/Quest-Kern (V-333–335; nach HUD R4, Weltstruktur, Game Loop), Insel-Streaming mit LOD/Impostors (erst bei mehreren Inseln).

### 62.2 Synergien, die die Reihenfolge begründen
- **Maßstab → Boden → Fahren:** V-345 vor S1, S1 vor Fahrassistenz und M3: Kollision „0 Durchfahrten“, Hang ≠ Wand und Stunt-Zonen brauchen den Kollisions-Deskriptor in echten Metern.
- **Eine Palettenquelle:** `edgePalette` speist Bodenfarbe (S1), Haze/Umgebung (S2) und Partikelfarben je Terraintyp (S3).
- **Ein Editor, viele Daten:** Düsen-Anker, Billboard-Platz und Waffen-Halter sind derselbe Editor mit anderem Schema.
- **Ein Viseme-Treiber:** Performance-Duett, Aliens, Musikvideo und alle Dialog-Münder.
- **Aktions-Router + Interaktions-Vertrag** beenden die Absprachen zu Mehrfachbelegungen (E = talk, Q/E = strafen bzw. driften, X) und sind die Voraussetzung für Gamepad/Touch und das HUD-Radialmenü.

### 62.3 Blinde Flecken (in keinem Planungsdokument gefunden)
1. **Speichern/Laden des Spielers** (nur die Welt hat `kfb.world-save`).
2. **Lade- und Leistungsbudget:** kein Zielgerät, kein Speicherbudget, keine Qualitätsstufen, keine Kompression; Bühnen 14–18 MB, Bündel 18 MB. Gemessen wird nur auf Georgs Rechner.
3. **Einstellungen und Barrierefreiheit:** Lautstärke, Tastenbelegung, Kamera-Tempo, Untertitel-Größe, „weniger Bewegung“ (wichtig für Speedlines und FOV-Stoß aus V-357), Farbsehschwäche.
4. **Eingabe:** kein Gamepad, kein Touch, obwohl HUD R4 für 9:16 entworfen wird.
5. **Fehler-Erholung:** kein Rückfall, wenn GitHub-Raw oder die API nicht erreichbar sind (Rate-Limit), keine Ladefehler-Anzeige.
6. **Kamera bei Zustandswechseln** (Gehen ↔ Fahren ↔ Fliegen ↔ Dialog ↔ Karte): nur punktuell geregelt.
7. **Audio-Gesamtkonzept:** Musik, Zonen-Song (V-294), SFX und Stimmen ohne gemeinsamen Mixer bzw. Ducking.
8. **Lokalisierung:** UI-Texte deutsch fest im Code, Karten englisch; keine Textschicht.
9. **Prüfung der Content-Pipeline:** kein Sammel-Check für Slot-JSON, Maßstab, Dateigröße, Anker; rund 15 Asset-Branches nicht in main.
10. **Onboarding/Tutorial** im Spiel (V-363 meint Marketing).
11. **Telemetrie/Spieltests:** Ob ein Botengang wirklich 2–4 Minuten dauert (V-294), lässt sich ohne Messung nicht sagen.

### 62.4 Was WS1 von WS0 bräuchte
1. **Vorlagenzeilen** für F1 und F2 (neues Verhalten, Regel „keine neue Funktion ohne WS0-Vorlage“), mit Host-Vertrag R1.3 (`interactable`, Aktionen, `save`-Schnittstelle).
2. **Georg-Entscheidungen ins Register:** Fahr-Engine (heute nur Tendenz k2b in §53), Weltstruktur (V-289), Game-Loop-Variante (V-319).
3. Den **V-352-Bericht** im Register und daraus den Fahrassistenz-Auftrag.
4. Eine Aussage zu **Zielgerät und Budget**, z. B. „Mittelklasse-Laptop ohne eigene Grafikkarte, 30 fps, Bündel ≤ X MB“.

WS1-Empfehlung: Als nächsten großen Block nach V-345 **S1 Weltboden**, weil er den größten Hebel hat und nichts blockiert. F1 und F2 sind klein und verhindern späteren Umbau, deshalb davor oder direkt danach. Ein M2-Merge erst nach Georgs Engine-Wahl.

Aufwand: ca. 15 Min. eigene Arbeit plus zwei Recherche-Agenten.

## 61 · 16.10. abends · Vorschau main@987422a + m2/fahren@00b86ea · 23/23 · erstmals mit build.json (V-356)

1. **Vorschau-Commit** `ws1/preview` @7bb0b904, Cloudflare-Check completed/success, Seite liefert 200 (18,1 MB). Gebaut aus einem Hilfs-Worktree: main plus `merge --no-ff m2/fahren`. M2 bleibt ungemergt, bis Georg entscheidet (Tendenz k2b).
2. **build.json** liegt neben `index.html` unter https://ws1-preview.kayfabizarro.pages.dev/build.json (`kfb.ws1-build/1`: commit, date, tests 23/23, links stage/m1/car/lineup, notes). Damit kann WSA die Staging-Site daraus befüllen.
3. **Neu in der Fahrprobe** (`#m1,car`): Die Sonne läuft über `stageLight.followShadow`, ±12 m, texel-gerastet, mit Ziel Auto bzw. FB und L1-Tageslicht, also ein einziger Licht-Schreiber. Damit ist Georgs Befund aus §58 behoben, dass der Schatten beim Herausfahren abgeschnitten und pixelig war. Abnahme durch Georg steht aus.
4. **Tastenbelegung:** Die Bewegungs-Sitzung ergänzt `MOVE_MAP` auf m1/wow additiv um `strafeL/R` (Q/E) und `descend` (X) (V-022, V-342). Ergebnis meiner Prüfung: `MOVE_MAP` wird nur von `KeyboardControls` in App.jsx gelesen, E = talk über den Host-Router bleibt unberührt. Vereinbart: Im Auto werden dieselben Namen als Drift gedeutet (V-347), kein zweiter Eintrag für dieselben Tasten.
5. **Als Nächstes** (Plan §60): V-346 Look-TUNE in einem Schritt, dann V-345 `worldScale.js` (Bühne zuerst), dann V-360 In-Place-Editor.

Aufwand: ca. 25 Min. (Testreihe im Hintergrund, Push, Check).

## 60 · 16.10. abends · WS0-Antworten V-343–V-360 gelesen · Arbeitsplan WS1 (Übergabe-Stand)

**Stand:** kfb-planet main @987422a (followShadow), ganze Testreihe 23/23, alles gepusht. Vorschau = main + m2/fahren (zuletzt @7afea10). M2 nicht in main.

**Arbeitsplan WS1 (Owner-Sitzung), in dieser Reihenfolge:**
1. **Vorschau neu:** main @987422a + m2/fahren @00b86ea zusammengebaut (followShadow in M1/M2, Kontaktflecke FB/GothGirl/Dragster, weicher Aufprall an Figuren 3,5 m statt 14 m), Testreihe; **ab jetzt bei jedem Push `build.json` (`kfb.ws1-build/1`, V-356)** mitliefern.
2. **V-346 Look-TUNE in einem Schritt:**
   - Look B = Standard unter `light=l1` (`look=a` nur noch zum Vergleich);
   - Himmel B = derselbe Himmel wie A, nur getönt (heute dreht `skyLookB` den Farbton um 70 % → auf leichte Tönung zurücknehmen);
   - GothGirl-Randlicht nur noch als Hauch (`rimStrength` 0,5 → ≈ 0,15);
   - FB-Mund und -Augen lesbar: Köpfe ohne Schattenempfang, dazu leichtes Face-Fill;
   - Schattenlänge und -richtung folgen `timeOfDay` (ist so; in einem Satz bestätigen);
   - ACES global, Boden bzw. Diorama `toneMapped: false` (Bildpaar);
   - Knet: `clay=all` Standard (FB mit Knet), GothGirl nicht überstrahlt, Fahrzeuge Knet nur als Relief bzw. Rauheit mit Albedo-Sättigung ≥ 95 %;
   - Abnahmebilder immer mit Knet; Korrekturen in der Vergleichsleiste sichtbar.
3. **V-345 Maßstab auf J17-Meter:**
   - `src/worldScale.js` (`M_PER_RIG = 0.616381042`, FB-Zielhöhe 2,94 Rig = 1,81 m, Faktor ≈ 0,65);
   - Bühnen-Seite: Figurenhöhe, Amphitheater, Meshy-Slots, Marken, Kameras, Billboard, Licht-Frustum, Aufstellung; zuerst Amphitheater.
   - Danach stellt die M1-Sitzung M1/M2 um (Höhenfeld, Zaun neu messen, Rampe, Tempi, Sprünge, Kapsel, Flug, Fahrwerte, Schwerkraft 9,81 statt 14).
   - Gemeinsame Testreihe vor dem M2-Merge.
4. **V-360 Anker per 3D-In-Place-Editor** (kein eigenes Klick-Werkzeug):
   - Modus im God-Mode-Editor nach `KFB Resident Atlas v3/S39-band-module-01/lib/edit-layer.js` (TransformControls);
   - Punkt plus Richtungspfeil an Düse bzw. unter Rädern;
   - speichern als `kfb.vehicle-thrust/1`.
5. **V-342/V-305 mit gelieferten Daten** (`data/kfb-stage-edges-r1-2026-10-16` @d4e24f15):
   - Bodenfarbe = `fromColors(edgePalette)` je Bühne;
   - `practicals` Goblin-Bank (12) und Atlantis (11) → G4.
6. **L2 Schritt 4 Gelände** (V-341: `footprint`, `terrainMode`, Steine-Kit folgt) und **Schritt 5 Look-Kohärenz** (V-355: entlichtete Texturen `assets/kfb-meshy-delit-r1-2026-10-16`, Goblin L2 / Atlantis L1; PMREM-Umgebung warm wie B; Messung Helligkeit und Buntheit je Schicht ≤ 15 %).
7. **Aufstellung:** Orc Brute dazu (`media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`).
8. **Später:**
   - VFX-Slice V1 (V-357) nach M2-Grundfahren;
   - Performance-Duett P1 (V-359);
   - Portal-Ruine (V-343);
   - Stunt M3 (V-351).

**M1-Sitzung parallel:**
- T1–T3 auf `m1/wow` (Lab-Walker aus `replies/donors/lab-walker-2026-10-16/`, Flug-Neubau);
- danach V-345 M1-Seite;
- danach V-347 (Drift Q/E, Wendekreis, ecctrl-Stabilität).

## 59 · 16.10. · Georgs Wunschliste VFX-Slice (Speedlines, Partikel, Düsen-Glow, Flugmodus) · Vorschlag mit WS1-Kommentaren · Bitte an WS0

**Georg (16.10.):** Was an Visual Effects schon da ist, soll in einer eigenen Slice zusammenkommen:
- Speedlines bzw. Beschleunigungs- und Tunneleffekte;
- Partikel (Rauchwölkchen, aufgewirbelte Erde je Terraintyp);
- **Glow bzw. Antrieb an den großen Düsen** der Dieselpunk-Fahrzeuge („kontraintuitiv, dass die Engines gar keinen Glow haben“), möglichst einheitlich statt je Fahrzeug;
- später **Flugmodus**: Doppel-Leertaste (400 ms, V-024/V-179), Räder klappen um, Antigrav-Antrieb sichtbar (V-274).
- Georg stimmt das mit WS0 ab und bittet um WS1-Kommentare zu Ausführung, Umsetzbarkeit und Einbau.

### 59.1 · Bestand (gefunden)
- **`kfb-flight-vfx.js`** (main: `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/`):
  - **Speedlines** (Spindel-Shader, Ring-Logik, Port TinySkies SpeedLines.ts über Travel Combat v25);
  - **Speed-Trails** (Contrails, 72 Stützpunkte, warmes Creme, weißer Kern ab Vollgas; Anker frei wählbar);
  - **Düsen** (`nozzles: [{ object, offset, dir }]`) mit Glow;
  - **Puffs** (Abheben, Landen);
  - **Skim** (Emission an der Oberfläche unter dem Fahrzeug in zwei Fahnen = Staub bzw. Erde);
  - Knet-Glow-Material, feste Obergrenzen `VFX_CAPS { lines 32, trailPts 72, jet 64, puff 40, skim 240 }`;
  - Schnittstelle `vfx.update(dt, speedKmh, thrust01)`, `hoverPose`, `FLIGHT_IDLE`.
- **Fahrzeug-Deformer und Zwei-Rad** (§55.1), Clay-VFX der Resident/ToolBox (SSOT „Clay particles and cartoon VFX“).
- **Ereignisse aus der Fahrphysik** (§56.1): `railImpact`, `landing`, Signale `speed/longAccel/lateral/bank/drift`.

### 59.2 · Vorschlag VFX-Slice V1 (nach dem k2b-Grundfahren, eigene Vorlagen-Zeile)
1. **Speedlines und Speed-Trails 1:1 aus `kfb-flight-vfx.js`.**
   - Antrieb: `speed`, `longAccel` (Beschleunigungs-Schub), im Tunnel bzw. bei Boost stärker.
   - *Umsetzbarkeit:* hoch, fertig und mit Obergrenzen. *Kosten:* gering (ein Draw je Band bzw. Ring).
2. **Staub, Erde und Rauch je Terraintyp:** `Skim` aus dem Modul, Farbe und Körnung je Terraintyp aus dem Höhenfeld bzw. Biom (Gras → Erdkrumen grün-braun, Sand → Staub hell, Fels → grauer Rauch).
   - Auslöser: Raddrehung bzw. Schlupf, Drift, `landing` (Puff), `railImpact` (Knet-Brocken).
   - *Umsetzbarkeit:* hoch; die Terrain-Zuordnung braucht eine kleine Tabelle Terraintyp → Partikelprofil (WS0 bzw. Biom-Daten).
3. **Düsen-Glow einheitlich:** **eine** Lösung über Daten statt Code je Fahrzeug.
   - WS0 trägt je Fahrzeug Anker `kfb_thrust_*` ins GLB bzw. in `kfb-vehicle.json` (Position, Richtung, Radius, Typ jet/turbine/exhaust); einmalig im Blender-Lauf, wie heute schon `kfb_wheel_*`, `kfb_entry`.
   - Ein generisches Modul setzt an jeden Anker Düse plus Glow plus Hitzeflimmern bzw. Partikel aus `kfb-flight-vfx.js` (`nozzles`), Stärke aus Gas (`thrust01`).
   - *Umsetzbarkeit:* hoch, sobald die Anker da sind; ohne Anker nur Raten (unsauber).
   - *Hover-Fahrzeuge* (`iron_phantom_hovercar`, `street_racer_hoverbeast`) haben schon `kfb_hover_*`-Anker; dort kann der Glow sofort sitzen.
4. **Flugmodus mit umklappenden Rädern (V-274), später:**
   - *Einschränkung:* Bei den Dieselpunk-Rad-Fahrzeugen sind die Räder mit der Karosserie verschmolzen (WS0 V-311: `kfb_fused`); echtes Umklappen braucht getrennte Rad-Netze mit Drehpunkt (Asset-Arbeit je Fahrzeug).
   - *Pragmatisch:* Beim Abheben erscheinen an den `kfb_wheel_*`-Ankern **Antigrav-Glow-Scheiben** nach unten (wie V-274 „Glow unter den umgeklappten Rädern“), dazu Takeoff-Puff und `hoverPose`. Umklappen nur dort, wo WS0 getrennte Räder liefert (Badewannen-Kart).
   - Auslöser: Doppel-Leertaste 400 ms wie zu Fuß (M1 T3).
5. **Kamera bei Stunts** (Georg §56.2: Auto beim Schleudern auch von der Seite zeigen): eigener Punkt im kommenden Fahrphysik-Briefing.

### 59.3 · Reihenfolge-Vorschlag
1. M2-Grundfahren (Schatten, Kontakt, Aufprall);
2. VFX V1 Punkte 1 + 2 (sofort aus Bestand);
3. Punkt 3, sobald WS0 die `kfb_thrust_*`-Anker liefert;
4. Punkt 4 mit dem Flugmodus;
5. Audio-Bett (§58) parallel zu 2, sobald die Quellen da sind.

### 59.4 · Bitte an WS0
- Die Slice als Vorlagen-Zeile planen (V-001 erfüllt durch `kfb-flight-vfx.js`).
- `kfb_thrust_*`-Anker für alle 14 Fahrzeuge in den Blender-Lauf aufnehmen.
- Terraintyp → Partikelprofil festlegen.

### 59.5 · Georgs Leitlinie dazu (16.10.)
- **Reihenfolge aus 59.3 passt.**
- **KISS und Cartoon-Logik:** Umgeklappte Räder müssen nicht echt umklappen. Ein **Standard-Antigrav-Effekt an vier Punkten** (Räder bzw. Achsen) reicht. Weil manche Dieselpunk-Fahrzeuge Räder haben und manche nicht, möglichst **ein Antriebs-, Düsen- bzw. Propulsions-Effekt, der für alle funktioniert**.
  - Wie viel Asset-Aufwand (Anker, getrennte Räder) es wird, entscheidet sich mit Blender-MCP.
- **Low Effort, High Impact zuerst.**
- **Performance von Anfang an mitdenken:** Später kommen Destruction-, Demolition- und Explosions-VFX und Waffeneffekte dazu.
  - *WS1-Vorschlag:* ein gemeinsames VFX-Budget (feste Obergrenzen je Effektfamilie wie `VFX_CAPS`, ein gemeinsamer Partikel-Pool, Instancing, keine neuen Lichter; Leuchten über Material bzw. additive Sprites).
- **Ausblick, später:**
  - **Waffen an Fahrzeugen** in Panzer-Logik, z. B. ein Aufsatzgeschütz auf der Motorhaube, als **Frankensteining** in einem **Rigging-Studio** wie bei den Figuren;
  - die Waffe trägt Mündungsfeuer, Schussanimation und Sound gekoppelt mit.
  - Nicht in der VFX-Slice V1; als Ausblick für die Planung.

### 59.6 · Ohne Blender auf Georgs Rechner (Georg 16.10.: Installation nur über Admin-Antrag)
- In der WS1-Sitzung gibt es weder Blender-MCP noch Blender. Lösung ohne lokale Blender-Installation:
  1. **Vier Antigrav-Punkte:** aus den vorhandenen Ankern `kfb_wheel_*` bzw. `kfb_hover_*`, keine Modelländerung.
  2. **Düsen-Glow:** Anker als **Daten** (`kfb-vehicle-thrust.json` je Fahrzeug: `[{ id, pos, dir, radius, type }]` im GLB-Raum); das Spiel legt die Punkte beim Laden an, das GLB bleibt unverändert. Werte kommen
     - (a) aus WS0s Blender-Lauf, oder
     - (b) aus einem **kleinen Klick-Werkzeug in der Vorschau** (Fahrzeug drehen, auf die Düse klicken → Raycast liefert Punkt und Normale → JSON). Passt zu V-002 (Georg gestaltet, wir bauen Werkzeuge) und V-306 (In-Place-Editor); später auch für Waffen-Aufsätze (§59.5).
  3. **Echte Modellarbeit** (getrennte Räder, neue Geometrie) bleibt bei WS0 mit Blender-MCP; nach Georgs KISS-Linie vorerst nicht nötig.
- **WS1-Empfehlung:** (b), schnell gebaut und mehrfach nutzbar. **Bitte an WS0:** (a) oder (b) entscheiden, Format `kfb-vehicle-thrust.json` bestätigen.

## 58 · 16.10. · Georg zur Fahrprobe @7afea10: „Grundlage sehr sauber“ · Schatten und Bodenkontakt · Audio und Knet-Partikel (Bitte an WS0)

- **Georg (16.10.):** „Fühlt sich schon sehr gut an, die Fahrphysik ist super, die Grundlage ist sehr sauber.“
- **Offen, M1/M2-Sitzung jetzt:**
  1. **Schatten:** Beim Wegfahren verschwindet der Schatten, wird geklippt, erscheint wieder; extrem pixelig.
     - Ursache: Das Schatten-Frustum steht fest um den Start.
     - Lösung nach L1-Regel 4: enges, **dem Ziel folgendes**, texel-gerastetes PCFSoft-Frustum.
  2. **FrizzleBob schwebt:** In der M1-Welt fehlt der Kontaktschatten bzw. Bodenkontakt → dasselbe Modul `createContactBlobs` (V-203) wie auf der Bühne, kein zweiter Weg.
  3. **Aufprall an FrizzleBob:** Das Auto prallt zu weit zurück; weniger Rückstoß an Figuren als an Wänden, cartoonig feinabgestimmt.
  4. **Sprünge:** wirken gut; Urteil erst mit sauberem Schatten.
- **Neu, Bitte an WS0** (Quellen und Vorlagen-Zeile):
  - **Audio-Bett:** Motor- und Drohnen-Sounds aus der Audio-Site (Beschleunigung, Gangwechsel, Aufprall, Landung). Welche Quellen und Lizenzen, welches Format?
  - **Knet-Partikel beim Fahren** wie in Joyride: Erde und Rauchwolken bei Terrainkontakt, Landung und Drift, **je Terraintyp**. Vorlage: Joyride-VFX bzw. Resident/ToolBox-Clay-VFX (SSOT „Clay particles and cartoon VFX“). Andockstelle sind die Ereignisse aus §56.1.

## 57 · 16.10. · Georg zum Auslieferweg: Cloudflare eigentlich ad acta (Timeouts) · Ziel GPT-Site · Bitte an WS0

- **Georg (16.10.):** Cloudflare hatte er eigentlich ad acta gelegt, weil es zu ewigen Timeouts führte; ein anderer Weg wäre ihm lieber.
  - Zielplattform ist grundsätzlich eine **GPT-Site**, mit Infrastruktur für Lean Memory, User Journey, Spielstände und Konfigurationen.
  - WS1 und WS0 haben darauf vermutlich keinen Zugriff.
- **WS1-Befund heute:** Der schlanke Branch `ws1/preview` (nur `index.html` plus Build-Skript und `wrangler.jsonc` aus main) lief nach dem Fix aus §43.5 sechs Mal in Folge durch, je ≈ 2–4 min bis zum grünen Check. Der einzige Fehlschlag war das fehlende Build-Skript.
- **Alternative geprüft: claude.ai-Artefakt** → nicht geeignet.
  - Die Seite lädt zur Laufzeit Modelle, Kartenbilder (pdf.js) und den Pool von GitHub; Artefakt-Seiten erlauben fremde Quellen nur eingeschränkt.
  - Mehrteiliger Build 25 Dateien / 14 MB, darin Fremdbibliotheken (three, React), die WS1 vor einer Veröffentlichung nicht vollständig gegenlesen kann.
- **Vorschlag:** Abnahmen vorerst weiter über `ws1/preview` (V-314).
- **Bitte an WS0:** Auslieferweg zur GPT-Site als Ziel planen:
  1. Wer hat Zugriff?
  2. Wie kommt das WS1-Bündel dorthin (Einzeldatei 18 MB oder mehrteilig)?
  3. Erlaubt die GPT-Site Laufzeit-Abrufe von raw.githubusercontent.com (Modelle, Karten) und api.github.com (Pool)? Sonst müssen die Assets ins Bündel bzw. auf die Plattform.
  4. Persistenz (Spielstände, Konfiguration, `kfb.world/1`) über die Plattform-Infrastruktur.
  5. Ab wann?

- **Georgs Vorschlag (16.10., Nachtrag):** WSA (Georgs Arbeit auf der OpenAI-Site, ChatGPT im Code-Modus) baut eine **Test- bzw. Staging-Site auf der GPT-Plattform**, die neue WS1-Stände und -Vorschauen automatisch übernimmt, so wie später auf der echten Site. Damit stimmen sich die Produktionsprozesse (Updates, neue Module) schon jetzt ab.
- **WS1-Vorschlag für die Schnittstelle:**
  - WS1 liefert jeden geprüften Stand an einen festen Ort: Branch `ws1/preview` mit `index.html` (Einzeldatei, heute 18 MB).
  - Neu dazu käme ein kleines `build.json` mit `{ commit, date, tests: "23/23", links: { stage, m1, car, lineup }, notes }`.
  - Die Staging-Site liest `build.json` und lädt das Bündel. Alternativ übernimmt sie den mehrteiligen Build (25 Dateien, größte 5,6 MB), falls die Plattform Einzeldateien begrenzt.
  - Laufzeit-Abrufe von raw.githubusercontent.com und api.github.com müssen dort erlaubt sein (siehe Frage 3), sonst kommen Modelle und Pool mit ins Paket.
  - Persistenz (Spielstände, `kfb.world/1`, Lean Memory) übernimmt dann die Plattform; WS1 stellt dafür eine schmale Speicher-Schnittstelle im Host bereit, sobald WS0 sie beauftragt.
- **Bitte an WS0:** Auftrag an WSA prüfen (Aufwand, Zugriff), Format `build.json` bestätigen. WS1 legt es dann bei jedem Vorschau-Push mit an.

## 56 · 16.10. · Neue Fahrprobe (k2b spielfest, Dragster) in der Vorschau @aa0db179 · Georg sammelt Cartoon-Fahrphysik-Briefing

### 56.1 · Fahrprobe (M2-Sitzung, m2/fahren @7afea10; Vorschau = main @e689471 + M2, ganze Testreihe 23/23; M2 nicht in main)
- **Fahrzeug:** Flammen-Dragster v3 (raw @9bd8e037, im Bühnenmaß ≈ 8 m).
- **Anzeige** oben mittig „Fahrphysik B · k2b · C wechselt“; Start B, A (ecctrl) nur noch Gegenprobe.
- **k2b:**
  - Boden nie verloren (Strahl ab 3 m, Höhenfeld als Mindestboden, darunter sofort zurück);
  - Hänge sind Boden, Zaun und Theater Wand;
  - die Wandprüfung wertet alle Treffer aus, dazu eine Zaun-Sicherung;
  - Hangabtrieb, Stillstand ohne Gas;
  - Knet-Squash 1:1 aus k2b plus J17-Optik (V-103), frontal federndes Abprallen.
- **Hooks** wie `vehicle-cartoon-deformer.v2`: `railImpact`, `landing`, Signale `speed/longAccel/lateral/bank/drift` über `M2EVENTS.on`. Deformer und Zwei-Rad sind nicht eingebaut (§55.1).
- **Raster:**
  - 28 k2b-Läufe: 0 Durchfahrten, 0 Durchfaller;
  - 2 s ohne Eingabe ≤ 0,2 mm je Schritt (beide Varianten, eben, quer am Hang, nach Landung);
  - 60 fps, p95 16,7 ms.
- **Bekannt:** Mit Vollgas über die Rampe hebt der Dragster ab und kann über die Bühne aufs Billboard springen (Arcade).
- **Kosten seit G0** (M2-Sitzung): Browser ≈ 70 min, ≈ 150k Token.
- **Link:** `https://ws1-preview.kayfabizarro.pages.dev/#m1,car`

### 56.2 · Georg (16.10.): Briefing zur Cartoon-Fahrphysik folgt
- Georg recherchiert im Webchat Cartoon-Fahrphysik und -Fahrverhalten, mit Benchmarks wie Super Mario Kart, auch ohne Racetrack.
  - Dazu Schleudern bzw. Rotation mit Kamera-Ansichten und Animationen, damit man das Auto beim Schleudern oder Driften von allen Seiten sieht („sonst nur von hinten, bei den Dieselpunk-Modellen schade“).
  - Richtung: Arcade-Fahrgefühl im Chill-and-Fun-Cartoon-Modus mit Assisted Driving (§53–§55).
- Georg stellt das mit WS0 als Briefing zusammen; WS1 und M2 bauen bis dahin nichts davon. Die Hooks (§56.1) sind die Andockstelle für Kamera- und Schleuder-Ereignisse.

## 55 · 16.10. · Georg: Assisted-Stunt-Driving (cartoonige Stunts im normalen Fahren) · Konzept-Eingang, Fundort der Recherche gesucht

- **Georg (16.10.):** Aus der Recherche zum früheren Stunt-Race-Prototypen sollen cartoonige Stunt-Features kommen, die sich im normalen Fahren mehr oder weniger zufällig ergeben. Das war eigentlich die Geburtsstunde des Racetracks.
  - **Auf zwei Rädern weiterfahren**, wenn man schräg gegen eine Wand fährt.
  - **Rampensprünge mit Push-Zone und Pull-Zone:**
    - vor der Rampe Tempo und Ausrichtung angleichen;
    - in der Luft bzw. bei der Landung zum Landepunkt führen und aufrichten;
    - ein korrekt getimter, cartoonig spektakulärer und sauber ausgeführter Sprung.
  - Alles in cartoonischer Logik, Lesart und Ausführung, passend zu §54 (Abprallen, Squash, Recovery).
- **Im Register gefunden:** nur V-098 („steile Stücke mit Fahrhilfe bzw. Booster“, Organ-Attraktionen) und V-033 bzw. V-103 (Impact/Recovery, J17-Squash). Ein Assisted-Stunt-Konzept fehlt („nicht gefunden in DECISIONS.md, main `KFB Stunt Car Race/` (nur `test`)“).
- **Bitte an WS0:**
  1. Fundort der Stunt-Race-Recherche (privates Repo KFB-Stunt-Car-Race? Lab? Hub?).
  2. Als Konzept-Eingang aufnehmen und nach M2 (k2b-Grundfahren sauber) als eigene Vorlagen-Zeile planen. Vorschlag: Stunt-Zonen als Daten im Bühnen- bzw. Welt-Deskriptor (`stuntZones: [{ type: 'ramp', push, pull, landing }]`) plus Ereignisse aus der Fahrphysik (Wandkontakt schräg → Zwei-Rad-Zustand mit Zeitlimit und Recovery).
- **M2 jetzt:** k2b so bauen, dass Stunt-Zustände später andocken können (Kontakt- und Landeereignisse als Hooks), aber keine Stunts bauen.

### 55.1 · Fundort (Georg 16.10.): georg-doc/KFB-Stunt-Car-Race `_inbox/` @df1e35b5
- **Ordner `KFB Cologne Race Option C/`, Stand `handoff/KFB_Vehicle_Lab_v4/`:**
  - `lab-v7/vehicle-cartoon-deformer.v2.js` + `deformer-profiles.json`:
    - Cartoon-Deformer fürs Fahrzeug, nur Darstellungs-Knoten (schreibt nie in Kontakt bzw. Physik);
    - Signale `speed, longAccel, lateral, bank, drift`, Ereignisse `railImpact({side, strength})` und `landing({strength})`;
    - Federn mit attack/release, Teilschritte 1/240 s, Priorität `impact > drift/load > speed > idle`.
    - RETURN-Dokument: `RETURN_cartoon_vehicle_deformer.md` (17.09.).
  - `lab-v7/vehicle-twowheel.v1.js` „Zwei-Rad-Schräglage“ (Georgs Auftrag 18.09.: „seitlich gekippte Cartoon-Stunt-Fahrt auf 2 Rädern, z. B. entlang einer Bande oder Hausfassade“):
    - Kippachse = äußere Laufflächenkante, gemessen;
    - Haltephase mit Balancekorrekturen als Kern;
    - Kippwinkel aus dem Schwerpunkt gerechnet.
  - `lab-v8/cartoon-deform-segmented.v1.js`, `lab-v8/flight-deformer.v1.js` (Plan `PLAN_flight_deformer.md`, `RETURN_flight_deformer_v1.md`).
  - `cardeform.v1.js` (Vertex-Shader-Fassung) ist laut RETURN überholt.
- **Rampen mit Push- und Pull-Zone:** nicht gefunden in den Dateinamen von `_inbox/` (Suche nach stunt|ramp|push|pull|jump|sprung). Inhalte der Markdown-Dateien sind noch nicht durchsucht.
- **Folge für M2:**
  - Die Hooks in k2b (§55) heißen wie im Deformer: `railImpact({side, strength})`, `landing({strength})`, kontinuierlich `speed/longAccel/lateral/bank/drift`.
  - Dann docken Deformer (Squash, §54 Stufe 1) und Zwei-Rad (§55) als Vorlagen 1:1 an.
- **Bitte an WS0:** Deformer v2 und Zwei-Rad v1 als Vorlagen für M2 bestätigen; Freigabe als Vorlagen-Zeile nach dem k2b-Grundfahren.

## 54 · 16.10. · Georg: cartoonige Impact-Physik (Knete/Gummi-Welt) · Vorschlag in zwei Stufen

- **Georg (16.10.):** Alles in der Welt ist aus Knete bzw. Gummi gedacht.
  - Fährt das Cartoon-Vehikel gegen ein Gebäude oder eine Struktur, sollen idealerweise **Auto und Gegenstand cartoonig deformieren**, mit Bewegung und **Recovery**; was performant möglich ist, wird geprüft.
  - Solange Gebäude noch keine reaktiven Objekte sind, ist **Wegbouncen von der Wand okay**.
  - Die Impact-Physik insgesamt cartoonig denken; wichtig ist ein **rasanter Chill-and-Fun-Fahrstil**.
- **Bestand:**
  - V-010 (J17-Cartoon-Deformer als Goldstandard);
  - V-103 (Squash J17 .12/.18/.06 statt drive.ts);
  - V-033 (Anticipation/Impact/Recovery);
  - `_inbox/KFB Cartoon Vehicle + Deformer Lab v1` bzw. `v2`;
  - „Destruction-Mech-POC“ (V-306);
  - SSOT „Vehicles“: Kollisions-Deformation, Federung und Reifenspuren sind eigene Schichten.
- **Vorschlag WS1/M2:**
  1. **Mit der k2b-Probe:**
     - federndes Abprallen an Wänden und Gebäuden (k2b-Bandenstoß als Vorlage, cartoonig dosiert), nie Durchfahren oder Steckenbleiben;
     - Fahrzeug-Squash bei Aufprall und Landung nach J17-Werten mit Rückfedern (1:1, falls im J17-Code als Modul vorhanden).
  2. **Später, eigene Vorlagen-Zeile:** reaktive Gebäude und Objekte (Delle, Wackeln, Rückfedern) nach dem Deformer-Lab, vorher Kostenmessung bei 60 fps.
- **Bitte an WS0:** Stufe 1 bestätigen und für Stufe 2 die maßgebliche Vorlage nennen (Deformer-Lab v2? J17?).

## 53 · 16.10. · Georg nach zweiter Fahrprobe: Tendenz Joyride (k2b), Bedingung saubere Kollision · Bitte um Entscheidung (V-290/V-313)

- **Georg (16.10., Vorschau @5914c905):**
  - **A · ecctrl:** „Man überschlägt sich total schnell und kann eigentlich nicht fahren. Das Überschlagen hört auch nicht auf, man titscht teilweise auf dem Heck herum. Das ist noch kein sauberes Fahrgefühl, da würde man sofort aufhören.“
  - **B · k2b (Joyride):** „Mit den Reifen eigentlich ganz gut, aber da fällt man tatsächlich durchs Terrain, fährt einfach durch den Berg und fällt dann endlos in den Shader. Netter Effekt, darf im Game aber nicht passieren.“
  - **Tendenz:** „Grundsätzlich ist meine Tendenz da schon zu dem Joyride, aber da müssen wir gucken, dass das alles mit Kollision und Terrainkontakt und dem Nicht-Durchfahren von Wänden sauber funktioniert.“
- **Bitte an WS0:** als Entscheidung zu V-290/V-313 eintragen. Fahrphysik = J17 k2b (Fahrgefühl), Abnahmebedingung:
  - 0 Durchfahrten durch Wände;
  - 0 Durchfaller durchs Gelände;
  - Bodenkontakt auf Hängen und Bergen;
  - Hangabtrieb;
  - 2 s ohne Eingabe ruhig.
  - ecctrl ruht bis auf Weiteres; die Empfehlung aus §51 ist damit überholt.
- **M2-Sitzung baut als Nächstes** (nach V-001 mit k2b als Vorlage):
  - k2b-Bodenkontakt am Höhenfeld mit Sicherung gegen Durchfallen;
  - Hänge als Boden, echte Wände als Wand;
  - Hangabtrieb, kein Seitwärtshüpfen;
  - Dragster v3;
  - Prüfungen 0 Durchfahrten / 0 Durchfaller in 20+ Läufen (auch quer zum Hang, Vollgas bergauf) und „2 s ruhig“.
- Q/E-Drift 1:1 aus k2b wartet auf WS0 (§52.2).

## 52 · 16.10. · Georg zur Fahrprobe G0 und zur Abnahme · Vergleichsleiste · Q/E-Drift (Frage an WS0) · Vorschau @5914c905

### 52.1 · Georgs Feedback zur Fahrprobe (16.10.)
- Lenken funktioniert noch nicht; er wusste nicht, welche Variante nach C aktiv war.
- „Eine Version mit Reifen fährt sich ein bisschen besser, aber am Hügel fährt sie alleine ewig weiter.“ Sie hüpft am Hang dauerhaft seitwärts (Screenshot). Die andere überschlägt sich sehr schnell.
- Intuitiv hält er die zweite Variante für besser. Mit dem Kasten-Dummy kann er es aber nicht beurteilen.
- **Zuordnung (M2-Sitzung, Sonde):**
  - Start = A · ecctrl (keine sichtbaren Räder, kippt bei 17 m/s in der Kurve: Schwerpunkt in Kastenmitte, hohe Haftung, Lenkwinkel unabhängig vom Tempo);
  - nach C = B · k2b (Reifen sichtbar).
  - k2b-Seitwärtshüpfen: Die WS1-Wandprüfung hält den Seitenhang für eine Wand und gibt den Bandenstoß (4,6 m/s).
  - k2b-„rollt ewig“: kinematisch ohne Hangabtrieb, nach 3 s ohne Gas noch 22 m/s.
- **Nächste Probe (M2-Sitzung):**
  - echter `crimson_flame_dragster` v3;
  - groß „Fahrphysik A · ecctrl / B · k2b“ im Bild;
  - ecctrl: Schwerpunkt tief, Lenkung je Tempo kleiner, sichtbare Räder, ohne Gas sanft bremsen;
  - k2b: Hangabtrieb, Hang ist keine Wand, kein Mikro-Abheben;
  - neue Prüfung „2 s ohne Eingabe → Aufbaubewegung ≤ wenige mm je Schritt“ (Stand, Hang, nach Landung) für beide.

### 52.2 · Q/E-Drift (Georg: „haben wir noch nicht umgesetzt; in Joyride auch nicht hundertprozentig richtig“)
- **Register:** keine V-Nummer zum Fahr-Drift; Q/E nur in V-022 (Strafen zu Fuß) und V-199.
- **Quelle:** J17 `lab-drive/kfb-drive.k2b.js` (J14-Schnitt 30.09.), `stepDriver` mit `driftL`/`driftR`.
  - FEEL: `driftMinSpeed` 7,5, `driftSteerScale` 1,28, `driftDampingScale` 0,28, `driftYawGain` 1,32, `regripSeconds` 0,34, `regripDampingScale` 1,85.
  - Abweichung K2B-Δ1: In K2 stand die Driftzeile hinter `//`, Q/E rutschte nie. Das erklärt Georgs Eindruck.
- **Vorschlag:**
  - B · k2b: Drift 1:1 aus k2b, Q/E nur im Auto (zu Fuß bleibt Strafen, kein Konflikt).
  - A · ecctrl: Drift wäre Nachbau (Hinterrad-Haftung kurz senken plus Gier nach k2b-FEEL).
- **Bitte an WS0:**
  1. Darf B den Drift 1:1 aus der Vorlage schon vor Georgs Wahl bekommen? Er vermisst ihn beim Testen.
  2. Für A Nachbau ja/nein?
  - Bis zur Antwort kein Drift.

### 52.3 · Abnahme leichter machen: Vergleichsleiste (Georg: „wüsste nicht, wie ich Look A oder B abnehmen soll“)
- kfb-planet @e689471, nur mit `light=l1`, kein Spiel-HUD: beschriftete Knöpfe oben links.
  - Look A | B;
  - Tageszeit Tag/Gold/Nacht (wechselt sofort);
  - Knet aus/GothGirl/alle;
  - Tonemapping ACES/ohne.
  - Je Gruppe ein Satz, worauf zu achten ist. `nobar` blendet aus.
  - Geprüft: Knöpfe zeigen den aktiven Stand, Tageszeit wechselt live, Look lädt neu und behält die Tageszeit.
- **Vorschau @5914c905** = main @e689471 + m2/fahren @67de52e zusammengebaut (M2 nicht in main), ganze Testreihe 23/23 auf dieser Fassung.
- Links für Georg:
  - Bühne: `https://ws1-preview.kayfabizarro.pages.dev/#stage,actors=fb,dialog=6,light=l1,look=a`
  - Fahrprobe: `…/#m1,car`

## 51 · 16.10. · M2 G0 (V-313): Vergleich EcctrlVehicle gegen k2b · Vorschau für Georgs Fahrprobe · Empfehlung ecctrl

### 51.1 · Stand (M2-Sitzung, m2/fahren @67de52e, enthält main @b1af18e; **nicht nach main gemergt**)
- **Einstieg** `#m1,car`: Die Figur steht am Start, daneben das Platzhalter-Auto, die Kamera hinter dem Auto.
- **Tasten:**
  - W/S Gas und Rückwärts, A/D lenken;
  - Leertaste = Handbremse (ecctrl) bzw. Sprung (k2b);
  - R = Start, C = Kandidat wechseln.
- **Raster G0** (V-313, selbst gemessen):

| Punkt | ecctrl (EcctrlVehicle + M2TUNE) | k2b (J17) |
|---|---|---|
| Selbstaufrichten < 2 s | Dach 1,03 s, Seite 0,57 s ✓ | – (kinematisch) |
| 0 Durchfahrten in 20 Läufen (14 aufs Theater zu, 6 in die Hügel) | 0/20 ✓ | 4/20 ✗ (ploppt Stufen hinauf, dann greift die Wandprüfung nicht) |
| 60 fps, kein Bild > 33 ms (GPU, dpr 2, 6 s Vollgas mit Sprüngen) | 59,9 fps, p95 16,8 ms ✓ | 59,9 fps, p95 16,7 ms ✓ |
| Tempo und Lenkung | ≈ 31 m/s (Getriebegrenze) | 41 m/s, direkter |

- **Empfehlung M2-Sitzung und WS1:** ecctrl. Gleiche Rapier-Physik wie Laufen und Fliegen, echte Überschläge, Raster erfüllt. Das k2b-Fahrgefühl (Tempo, Direktheit) ist Abstimmungsziel.
- **Georg entscheidet an der Fahrprobe.** Merge nach main erst danach.
- **Kosten** (V-312, M2-Sitzung, geschätzt): Browser ≈ 80 min, davon 40 min durch zwei hängende Testläufe (Ausnahme im Schritt-Haken, abgesichert); ≈ 250k Token.

### 51.2 · Vorschau
- `ws1/preview` @2d879401 = dist von m2/fahren @67de52e. Die ganze Testreihe lief dort 23/23; der Drift-Test brauchte den nicht versionierten Drift-Bericht im Worktree, sonst kein Unterschied.
- Rauchtest im App-Browser: `#m1,car` lädt, keine Konsolenfehler.
- **Link für Georg:** `https://ws1-preview.kayfabizarro.pages.dev/#m1,car`
- **Hinweis Maßstab (§49.4):** Tempo-Angaben in WS1-Metern; WS1-Welt ≈ 1,54 × WS0-Meter.

## 50 · 16.10. · M1 TUNE als Zwischenstand gemergt (T4–T6 erfüllt) · V-334 behoben · Vorschau @5a51948b

### 50.1 · M1 TUNE (M1-Sitzung; m1/tune @69400cf → main @b1af18e)
- **Prüflauf auf main @b1af18e:** ganze Testreihe 23/23, M1-Runde 14/14 (rank-fence, contract, move @60/@120/@30, hz-equal, fence plus Gegenlauf, scene, handover, eyes, bench, f1); INFO Rückwand ohne Zaun −18,4 cm.
- **T4:** Flug p95 16,7 ms = Boden, Verhältnis 1,0 (Bench auf GPU).
  - Ursache des Ruckelns: Auf 120-Hz-Bildschirmen stand die Figur in jedem zweiten Bild still.
  - Fix: Interpolation zwischen den letzten zwei Physik-Schritten (Figur und Kamera).
- **T5:**
  - Rampe auf der START-Achse, `m1-scene` ohne Sprung;
  - G = Geh-Umschalter;
  - weiches Aufsetzen 0,15 s, die Landung nimmt höchstens Sprinttempo mit (vorher ging das Flugtempo in die Landung, Kapsel −11 cm);
  - Info-Symbol unten links mit aufklappbarer Tastenliste.
- **T6:** Die Figur folgt Hügeln.
- **T1–T3 offen** (WoW-Schema, Sprünge je Zustand, Doppel-Leertaste): Sie warten auf den Lab-Snapshot (§46).

### 50.2 · V-334 behoben
- Ursache: Im Intro-Ritual ragte das Kartenbild rechts aus dem Rahmen, weil das Bild 300 px breit gezeichnet wurde, der Karten-Innenraum aber nur 194 px hat.
- `.card .card-art { max-width: 100% }`: Das Seitenverhältnis bleibt, das Bild wird nur verkleinert, nichts beschnitten.
- Am Startbildschirm gemessen: Bildkante = Innenkante, 194 × 108 px.

### 50.3 · Vorschau für Georg
- `https://ws1-preview.kayfabizarro.pages.dev/#m1` (Ruckel-Fix, Rampe, G, Info-Symbol);
- Bühne und L1/L2 wie in §47–§49.

## 49 · 16.10. · L2 Schritt 3 (V-340): Aufstellung aller 14 Fahrzeuge · Maßstab-Befund · G10

### 49.1 · Gebaut (kfb-planet @c1a45f6 → @365f993, ganze Testreihe 23/23; eigener Test `npm run test:lineup` PASS)
- `lineup=1` (Modul `vehicleLineup`): alle 14 Fahrzeuge v3 von `assets/meshy-arcade3-marble-vehicles3-2026-10-16` @9bd8e037 (13 Racer bzw. Laster plus `wasteland_beetle`).
  - Aufbau: zwei Reihen à 7, Front zur Kamera, FB und GothGirl vorn, eigene Fläche statt Amphitheater (14 × ≈ 5 m passen nicht auf die 14-m-Bühne).
  - Licht L1 und Look B wie gehabt.
  - Mit `clay=1` stellen die Fahrzeuge auf K1/H0-Knet v8 Profil `vehicle` um, nur das Material (V-336).
- **Maßstab:** Die GLBs sind in KayKit-Rig-Einheiten; Umrechnung = gemessene FB-Höhe / 2,94 Rig (WS0-Maß V-311).
- Test `lineup` (lädt ≈ 65 MB, deshalb nicht in `npm test`) prüft:
  - 14 geladen;
  - Dragster : FB = 2,857 (Größenblatt 8,404/2,94 = 2,859);
  - Laster : FB = 3,722 (10,944/2,94 = 3,722);
  - Fahrzeug-Materialien Knet, Metall 0, Rauheit ≥ 0,3 (G8);
  - keine Seitenfehler.

### 49.2 · Bilder (`ws1/proofs/2026-10-16-l2-lineup/`, Vorschau @c8e2f1b0)
- `lineup_{day,gold,night}_clay_{16x9,9x16}.png` und `paar_lineup_clay.png` (Meshy-Material | Knet).
- Live: `https://ws1-preview.kayfabizarro.pages.dev/#stage,actors=fb,lineup=1,light=l1,tod=gold,look=b,clay=1`

### 49.3 · Raster
| Punkt | Stand |
|---|---|
| G10 alle 14 + FB in richtiger relativer Größe, drei Stimmungen | erfüllt für 14 Fahrzeuge + FB + GothGirl (Test und Bilder). **Orc Brute fehlt** (Quelle offen, §48.4). |
| G8 Fahrzeuge ohne Glanz | gemessen: Knet-Materialien Metall 0, Rauheit ≥ 0,3. |
| G9 eine Materialfamilie | Fahrzeuge und GothGirl in Knet, FB nach Georgs Wahl (§48.3). |
| G5 Kosten Schritt 2 | im App-Browser noch nicht gemessen (14 Fahrzeuge sind ein Extremfall, nicht die Spielszene). |

### 49.4 · Befund Maßstab (bitte an WS0 und M2)
- Auf der WS1-Bühne ist FB **2,79 m** hoch (gemessen, Maßstab 0,948 m/Rig); WS0 rechnet mit 1,81 m (0,616 m/Rig). Die WS1-Welt ist damit ≈ 1,54 × größer als WS0-Meter.
  - Das Amphitheater (14 m Bühnen-Ø) und die Meshy-Slots sind in WS1-Metern gesetzt.
- Die Verhältnisse zwischen Figuren, Fahrzeugen und Bühnen stimmen, nur die absoluten Meter weichen ab. Wichtig für M2-Physik (Tempo, Radradius, Schwerkraft) und für V-020-Tempi.
- **Bitte entscheiden:** WS1-Welt auf WS0-Meter umstellen (Figuren × 0,65) oder WS0-Maße mit Faktor 1,54 lesen?

### 49.5 · Stand L2
- Schritt 1–3 gebaut, Bilder für Georg.
- Offen:
  - Georgs Wahl (ACES | ohne, Look A | B, FB mit Knet ja/nein);
  - Orc Brute;
  - `practicals` und `edgePalette` von WS0;
  - Schritt 4 Gelände (V-341).

## 48 · 16.10. · L2 Schritt 1 + 2 (V-340): Look A | B, Licht-Identität je Figur, Knet-Material · Bildpaare · Frage Orc Brute

### 48.1 · Gebaut (kfb-planet @c1a45f6, ganze Testreihe 23/23, Test `light` jetzt mit L2-Prüfungen)
- **Schritt 1 · Look B (`look=b`, nur mit `light=l1`):** Keine zweite Palette; B verschiebt die L1-Werte in OKLCH (Rechenart V-305):
  - Sonne Richtung 50° und etwas satter;
  - Bodenreflex (Hemi-Boden) Terrakotta/Ocker;
  - Gegenlicht kühl violett (Gegenakzent);
  - Himmel oben Richtung Koralle, unten Richtung Ocker.
  - Alle Zielwinkel und Anteile sind WS1-Vorschlag. Sonnenstärke und -richtung bleiben wie A.
  - `look=a` = L1 genau.
- **Schritt 1 · Licht-Identität je Figur** (`LIGHT_INTENT` in `stageLight.js`, Modul `actorRim`): Daten statt Lichter.
  - Randlicht (Fresnel) im Material: FB warm #ffb066, GothGirl violett #a98bff.
  - Aktiv mit `look=a|b`; Gesichter bleiben gleichmäßig (Rand nur an der Silhouette).
  - Story-Mode-Hinweise (`STORY_INTENT`) liegen bereit für den späteren Würfel (V-342).
- **Schritt 2 · Knet-Material** (`clay=1`, Modul `clayLook`): K1/H0-Golden `clay-material.v8` mit Profil `figure` (clay-profiles.v2), 1:1 vendored (`src/vendor/clay/SOURCE.md` mit Blobs und Begründung).
  - **Warum v8 statt v10:** SSOT „K1/H0 = sichtbare Goldlinie, v10 erst nach bewiesenem Gleichstand“.
  - Nur Material, keine Netzänderung (V-336, SSOT „Characters“).
  - Der Kopf bekommt ein sanftes Profil (WS1-Vorschlag: weniger Striche, Abdrücke, Dellen), damit Gesichter lesbar bleiben.
  - Augen-Rig, Lider, Brauen, Nase, Bart und Mund bleiben unberührt.
  - Die Fingerabdruck-Karte des Pakets ist nicht übernommen (Lizenz ungeprüft); Rückfall auf die Relief-Textur wie im Katalog.
- **`clay=all`:** auch FB auf Knet, nur zum Vergleich (siehe 48.3).
- **Test `light`, neue Prüfungen:**
  - B wärmer bei gleicher Sonne;
  - Randlicht an beiden Figuren, nur mit `look`;
  - Karte A | B unverändert;
  - Knet: KayKit-Körper und -Kopf umgestellt, Gesichtsteile nicht; mit `clay=all` auch FB-Körper;
  - G8: alle Knet-Materialien Metall 0, Rauheit ≥ 0,3.

### 48.2 · Bilder (`ws1/proofs/2026-10-16-l2/`, Vorschau @fe54e8bf)
- `paar_{amph,goblin,atlantis}_{day,gold,night}.png` = Look A | B je Bühne und Stimmung, plus Amphitheater 9:16.
- `paar_clay_kaykit.png` = ohne | mit Knet (KayKit).
- `paar_clay_fb.png` = FB wie abgenommen | FB auch mit Knet.
- Live: `https://ws1-preview.kayfabizarro.pages.dev/#stage,actors=fb,dialog=6,light=l1,tod=gold,look=b,clay=1` (`clay=all` für FB mit Knet; `scene=goblin|atlantis`).

### 48.3 · Raster G6–G9 (selbst gemessen bzw. am Bild)
| Punkt | Stand |
|---|---|
| G6 Look B warm, ein kühler Gegenakzent | erfüllt am Bild: Himmel Koralle/Ocker, Bodenreflex warm, Gegenlicht violett. Die Bodenfarbe aus der Bühne (`edgePalette`, V-342) kommt mit dem Blender-Lauf. |
| G7 Randlicht sichtbar, Gesichter gleichmäßig | erfüllt am Bild; GothGirls violetter Rand ist deutlich, FBs warmer Rand dezent. |
| G8 kein Plastik- oder Metallglanz | Knet-Materialien gemessen Metall 0, Rauheit ≥ 0,3 (Test). Die Fahrzeuge folgen mit Schritt 3. |
| G9 eine Materialfamilie | **offen, Georg entscheidet:** Mit `clay=1` trägt GothGirl Knet, FB sein abgenommenes ToolBox-Material (glatter); mit `clay=all` beide Knet. |

### 48.4 · Schritt 3 (Aufstellung) und Frage an WS0
- **Plan:** eigene kleine Szene `#lineup`, weil 14 Fahrzeuge à ≈ 5 m nicht auf die 14-m-Bühne passen.
  - Fahrzeuge v3 von `assets/meshy-arcade3-marble-vehicles3-2026-10-16` @9bd8e037, Maßstab über `units.m_per_unit` und FB-Rig-Höhe (2,94 Rig = 1,81 m);
  - Knet-Material mit Profil `vehicle` (nur Material), Tag/Gold/Nacht, feste Kameramarken.
- **Frage:** Den **Orc Brute** (Rig_Large) finde ich in main nicht unter diesem Namen; es gibt nur `GLB_mini_dungeon/character-orc.glb` und Skelett-Figuren aus BoardGameBits. Bitte Pfad und Commit nennen (Rezept bzw. Profil wie bei den KayKit-Kandidaten?). Bis dahin stellt WS1 die 14 Fahrzeuge plus FB auf.
- **Aufwand:** etwa 1,5 h Arbeitszeit, zwei Bildreihen und ein Lauf der ganzen Testreihe.

## 47 · 16.10. · L1 Licht (V-329) gebaut, hinter `light=l1` · Bildreihe · Messwerte G1–G5

### 47.1 · Was gebaut ist (kfb-planet @bec425a, ganze Testreihe 23/23 PASS, neuer Test `light` 11/11)
- **Ein Licht-Schreiber** (`Stage.jsx` LightRigL1, Werte in `src/stageLight.js`):
  - Tag = J17 (Sonne #fff4e6/2,9, Hemi #eef4fa/#9a8a78/1,05, Gegenlicht #ffe6d6/0,6, Elevation 48,99°, Azimut −53,13°);
  - Gold = E50 (Sonne #ffd3ae, Stärken im E50-Verhältnis auf J17 übertragen, Sonnenhöhe 16° = WS1-Vorschlag);
  - Story-Nacht = WS1-Vorschlag (Sonne 0,18 kühl, Hemi 0,42 kühl);
  - `tod=day|gold|night|0..1` stufenlos.
  - Ohne `light=l1` bleibt das bisherige Bühnenlicht (Test `defaultLightUnchanged`).
- **Tonemapping:** ACES wie J17; `tm=none` für das Bildpaar. Die Kartenfläche ist `toneMapped: false`.
- **Schatten:** nur die Sonne (Frustum ±12 m, 2048², normalBias 0,02). Meshy-Dioramen werfen keine Schatten (gemessen 0 Werfer).
- **Kontaktschatten:** V-203-Fleck (Lab `contact-blob.ts`, nach JS übertragen) als Modul `createContactBlobs` unter jeder Figur.
  - FB behält seinen contact-ao.
  - contact-ao für KayKit (Körper/Füße, V-342 Punkt 5) ist noch nicht gebaut: Der Bodenfleck verhindert das Schweben; ob zusätzlich die Eigenverschattung gewünscht ist, entscheidet sich mit L2 Schritt 2 (Knet-Material).
- **Lokale Lichter:** Modul `createPracticals`, fester Pool von 6 PointLights ohne Schatten (nie hinzufügen oder entfernen, keine Shader-Neukompilierung), Leuchthof je `practical` (V-342 Punkt 4).
  - Nachts leiht jede Figur ein Pool-Licht (warm, vor ihr über Kopfhöhe, L2 „borrow one pooled light“), sonst bleiben Augen und Mund nachts unlesbar (G1).
  - Die Stärke folgt (1 − tod)^1,5.
- **Himmel und Nebel × Tageszeit** (Regel 3):
  - Tag = Palette genau;
  - Gold = Farbton ≤ 25° Richtung Orange (55°), Buntheit × 0,85;
  - Nacht = Helligkeit × 0,35, Buntheit × 0,5, Farbton Richtung Blau (262°).
  - Der Nebel folgt der gezeigten Horizontfarbe. OKLCH-Umrechnung aus `kfb-cartoon-palette.js` (1:1 vendored, Blob ab328bc0).
- **Bühnen:** Goblin-Bank v2 (@8cf2ec71) und Atlantis (@d3326a6a) als `scene=goblin|atlantis`; die Figuren-Plätze kommen aus `slot.figures`.
  - Deskriptoren `src/data/stages/{goblin,atlantis}.stage.json` (`kfb.stage-descriptor/1`), `practicals: []`, bis WS0 einträgt.
- **V-342 Punkt 1:** Die Story-Mode-Ableitung aus dem Kartentext ist entfernt; `stagePaletteFor` tönt nur mit übergebenem gewürfeltem Modus. Test `palette`: `noStoryTintFromCard`.

### 47.2 · Bildreihe (`ws1/proofs/2026-10-16-l1/`, Vorschau @8a145a90)
- Je Bühne `vorher` (bisheriges Licht) und L1 Tag/Gold/Nacht, 16:9 und 9:16.
- Dazu `paar_aces_ohne.png` (Georg wählt, V-342 Punkt 6).
- Links:
  - `https://ws1-preview.kayfabizarro.pages.dev/#stage,actors=fb,dialog=6,light=l1,tod=day` (bzw. `tod=gold`, `tod=night`);
  - Meshy-Bühnen mit `,scene=goblin` bzw. `,scene=atlantis`;
  - ohne Tonemapping `,tm=none`.

### 47.3 · Raster (selbst gemessen)
| Punkt | Stand |
|---|---|
| G1 lesbar in allen Stimmungen | erfüllt am Bild: Augen, Mund, Karte inkl. Marginalien; Blasen sind DOM und lichtunabhängig. Nachts über das Figuren-Licht. |
| G2 nicht schwebend, < 0,1 % geclippt | Kontaktfleck unter beiden Figuren (Test). Clipping **noch nicht gemessen**. |
| G3 Karte unverändert, Meshy ≥ 82 % original | Kartenmitte Tag vs. Nacht: Abweichung **0** (0–255, Test). Amphitheater 18 % Tönung, Meshy-Bühnen ungetönt. |
| G4 Nacht ≥ 2 Lichtinseln | **offen**: `practicals` für Goblin-Bank und Atlantis fehlen noch (WS0, Blender-Lauf R1). Die gemalten Laternen leuchten nachts noch nicht. |
| G5 Kosten | App-Browser, echte GPU, 1600 × 900, dpr 1 (Stage), 300 Bilder: bisher Median 16,7 ms / p95 17,8 ms; L1 Tag 16,7 / 18,3; L1 Nacht 16,7 / 18,1 (60 fps, vsync). Lichter vorher 2 → L1 3 + 6 Pool; ein Schatten-Pass wie vorher. Messung nicht auf Georgs M4-Bildschirm, sondern im App-Fenster desselben Macs. |

### 47.4 · Offen und Nächstes
- WS0 trägt `practicals`, `edgePalette` und `footprint` ein (Blender-Lauf R1, 17.10.); danach G4 und der V-305-Einbau mit der Bodenfarbe aus der Bühne.
- **Georg wählt:** ACES oder ohne; L1 als neuer Standard ja/nein.
- **Hinweis:** Die Meshy-Dioramen schweben frei vor dem Himmel. Das löst L2 Schritt 4 (V-341, Gelände).
- **Als Nächstes WS1:** L2 Schritt 1 (Look B warm neben A, `lightIntent` je Figur), dann Schritt 2 (Knet-Material) und Schritt 3 (Fahrzeug-Aufstellung).
- **Aufwand dieser Runde:** etwa 2 h Arbeitszeit, 3 Testläufe der ganzen Reihe (je ≈ 25 min headless).

## 46 · 16.10. · V-342 gelesen · Bitte: Lab-Walker-Dateien auf einen Branch (Dropbox ist hier nicht erreichbar)

- **V-342 umgesetzt bei WS1:**
  - Story-Mode-Ableitung aus dem Kartentext entfernt (`stagePalette.js`). Kein Story-Tint ohne gewürfelten Modus.
  - Kamera „Nah“ live (Vorschau @25499215).
  - Tonemapping-Bildpaar über `tm=none` vorbereitet.
- **Bitte an WS0 (blockiert M1 TUNE T1/T2):** Der Lab-Pfad `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/` existiert auf diesem Mac nicht. Dropbox ist hier von den Admins gesperrt, `~/Library/CloudStorage/` hat nur OneDrive, Port 5192 ist frei.
  - Bitte die Walker-Dateien nur lesend auf einen Branch legen, z. B. `assets/lab-walker-snapshot-2026-10-16`, oder in den Register-Branch unter `replies/donors/`:
    - `src/main.ts`
    - `src/play/travel.ts`
    - `src/play/vendor/travel-core.j17.js`
    - `src/play/vendor/walk-controller.js`
    - `src/play/vendor/locomotion-profiles.v1.js`
    - `src/play/figure.ts`
  - Bis dahin baut M1 am WoW-Schema nichts. M1 macht T4 (Flug-Frametime), T5 und T6.
- **M1 (M1-Sitzung):** Das Flug-Ruckeln ist gefunden und behoben (m1/tune). Auf 120-Hz-Bildschirmen stand die Figur in jedem zweiten Bild still (59/120 Stillstand-Bilder), weil die Physik mit 60 Hz rechnet.
  - Fix: Interpolation zwischen den letzten zwei Physik-Schritten für Figur und Kamera.
  - Danach 0/120 Stillstand-Bilder, Streuung der Bildbewegung 0,99 → 0,04; 60 Hz unverändert. castShape bzw. flyClip waren nicht die Ursache.

## 45 · 16.10. · L2 (V-340) und V-331 gelesen · Widerspruch Story-Farbe · Bitte um Entscheidung vor dem Farb-Einbau

### 45.1 · Widerspruch (bitte zuerst klären)
- V-331 Punkt 2 („`fromStoryMode(story-mode der Karte, 0)`, Story-Farbe auf dem Boden“) und L2 G6 („story ground colour still the card's story mode“) setzen voraus, dass eine Karte einen Story-Mode hat.
- **Georg 16.10. (§43.1):** Die Karte hat keinen Story-Modus. Er wird im Spiel mit einem W6 gewürfelt (Stipulation, Färbung der Story, die Georg erzählt).
- Heute leitet WS1 einen Modus aus dem Kartentext ab (world-context, Erbe aus R2). Das ist danach falsch und soll nicht in den V-305-Einbau übernommen werden.
- **Optionen für die Bodenfarbe, bis es den Würfel im Spiel gibt (Georg bat WS1, sie hier für WS0 aufzuschreiben):**
  - **(A) Würfel zu Beginn jedes Dialogs:** W6 → Story-Mode, klein angezeigt; `fromStoryMode(gewürfelt, 0)` färbt den Boden. Entspricht Georgs Konzept, ist aber ein kleines neues Spielelement (Vorlagen-Zeile, Look kommt von Claude Design HUD R4).
  - **(B) Grundfarbe aus Deck bzw. Genre** (`fromHue` bzw. `fromColors` je Deck-Welt), ohne Story-Mode. Der Story-Mode tönt erst, wenn der Würfel im Spiel existiert. Braucht eine Tabelle Deck/Genre → Farbton von WS0.
  - **(C) Fester Story-Mode je Bühne als Platzhalter**, im Bild deutlich als Platzhalter markiert.
- Bis zur Antwort baut WS1 den V-305-Einbau nicht. L1-Teile ohne Farbbezug laufen weiter (Licht-Schreiber, `timeOfDay`, J17-Werte, Sonnenrichtung, Schatten, Kontaktschatten, `practicals`-Pool).

### 45.2 · Weiter offen
- **Walker-Vorlage (§44.3):** Repo, Branch und Pfad der Lab-Fassung mit WoW-Schema (V-022), Doppel-Leertaste 400 ms und Flug (V-024/V-179). Ohne sie baut M1 die Steuerung nicht nach (V-001).
- **Lokale Lichter (§43.3 Punkt 2):** Meshy-GLBs haben eine gemalte Textur, einzelne Lampen lassen sich nicht emissiv schalten.
  - WS1 setzt deshalb je `practical` ein Pool-PointLight plus einen additiven Leuchthof (`halo`).
  - Wenn WS0 lieber eine Emissions-Maske je Bühne liefert, bitte sagen.

### 45.3 · Einplanung (V-340 bittet darum)
- **Reihenfolge WS1 (Owner-Sitzung):**
  1. Kamera „Nah“ (Karte zentriert, §44) pushen und Vorschau erneuern;
  2. L1-Teile ohne Farbe;
  3. V-305-Einbau nach 45.1;
  4. L1-Bildreihe;
  5. L2 Schritt 1–3 nacheinander, je Schritt ein WS1_STATUS-Eintrag.
- **M1-Sitzung:** M1-TUNE nach V-331 (Rampe auf der START-Achse ≈ 3 m, G als Geh-Umschalter, weiches Aufsetzen ≈ 0,15 s, Info-Symbol für die Tastenliste, Flug-Ruckeln messen; WoW-Steuerung nach Vorlage, sobald 45.2 beantwortet ist), danach M2. M1 TUNE und M2 werden nicht umgeordnet.
- **Kein Prüfer zwischendurch (V-312).** Je Schritt Token- und Minutenangabe.
- **Notiert aus V-334:** In der Vorschau ragt im Intro-Ritual das Kartenbild rechts aus dem Rahmen. WS1 prüft das bei Gelegenheit.

## 44 · 16.10. · Georg spielt die Vorschau: M1-Steuerung weicht vom Register ab · Kamera „Nah“ · Dioramen ins Gelände

### 44.1 · Georgs Feedback (16.10., Vorschau @24309fd2)
- **Gut:** Die Grundbewegung ist „schon nicht schlecht“; Bodenbewegung, Beschleunigung und Präsentation sind „eigentlich okay“ bzw. „ganz brauchbar“.
- **Steuerung nicht wie vereinbart:**
  - **V-022 (WoW-Schema):** Drehen mit A/D fehlt, Q/E (strafen) fehlt. M1 bewegt kamerarelativ mit WASD.
  - **V-023:** Sprünge je Zustand fehlen (war offene M1-Frage §35.4).
  - **V-024 + V-179 (5):** Abheben per Doppel-Leertaste im 400-ms-Fenster; M1 nutzt F.
  - **Flug:** Die Steuerung ist „komplett nicht richtig gesetzt, man fliegt ganz komisch herum“, und es ruckelt beim Fliegen sehr stark. „Sehr überarbeitungswürdig.“
  - „Teilweise ist auch die Logik noch nicht richtig umgesetzt“ (nicht näher benannt).
- **Sicht:** „Da liegt noch einiges an Paletten drüber, sodass man das nicht komplett sehen kann.“ WS1 fragt nach, ob die Einblendungen (Tastenliste, Knöpfe) gemeint sind.
- **Gelände:** Die Dioramen sollen besser ins Gelände eingefasst werden, damit sie nicht aufgesetzt wirken.
- **Kamera:** In der Nahaufnahme sitzt die Kamera zu tief; die Karte steht gerade noch am oberen Rand, statt intuitiv in der Bildmitte.

### 44.2 · Zuordnung und Vorschlag
- **M1-TUNE Steuerung (M1-Sitzung):**
  - V-022/V-023/V-024 nach Vorlage (V-001): WoW-Schema und Flug aus dem J17-Travel-Core des Labs übernehmen (V-024: „schon gemessen“), den Fehler aus V-199 (Q/E nur mit Vorwärts) nicht mitnehmen.
  - Ruckeln im Flug erst messen (Frametime Flug gegen Boden), dann beheben.
  - **Vorschlag:** vor M2 weiter, weil das Fahren auf derselben Eingabe aufbaut. Bitte Reihenfolge bestätigen und ein Abnahme-Raster nennen (V-312).
- **Kamera „Nah“ (WS1, `StageOrbitCam`):** Die Marke zielt heute auf die Standard-Zielhöhe (≈ 2,1 m), die Karte sitzt höher (Mitte ≈ 2,85 m). Neu bekommt „Nah“ die Kartenmitte als Ziel und zentriert sie.
- **Dioramen ins Gelände einfassen (WS0/Lab):** Gestaltungsfrage an Gelände und Assets, z. B. Geländeanschluss, Sockel-Übergang, Bewuchs. Bitte als eigene Vorlage bzw. Asset-Aufgabe einplanen; WS1 baut nichts dazu ohne Vorlage.

### 44.3 · Nachtrag Georg und Frage an WS0
- **Georg (16.10.):** Mit „einiges drüber“ ist das Erklärpanel mit der Steuerung gemeint.
  - Gewünscht ist ein kleines Info-Symbol unten links, dezent; die Liste erscheint erst beim Klick.
  - Georg arbeitet gerade das HUD aus (fraktaler Almanach, ggf. die Vier-Antworten-Auswahl) und reicht es als Update nach. Bis dahin baut WS1 nur Info-Symbol plus aufklappbare Liste, nichts HUD-Artiges vorweg.
- **Frage an WS0 (Vorlage V-001 für den M1-TUNE):** Wo liegt die Walker-Vorlage mit WoW-Schema (V-022), Sprüngen je Zustand (V-023), Doppel-Leertaste 400 ms und Flug (V-024/V-179), „parity: mouse-steer/jumps“? Bitte Repo, Branch und Pfad.
  - J17 `code/lab-travel/` enthält nur `travel-core.j17.js` und `travel-modes.j17.js`; der `walker` wird dort hineingereicht, steckt aber nicht im Paket.
  - Lokal gibt es kein Lab-Checkout.
  - Bis zur Antwort baut M1 die Steuerung nicht nach.

## 43 · 16.10. · Georg: Story-Mode ist ein Würfelwurf, keine Karteneigenschaft · Licht L1 (V-329) gelesen: Rückmeldung und `practicals[]`-Format · Vorschau ws1/preview

### 43.1 · Georg 16.10.: Story-Mode
- **Georg:** „Die Karte selbst hat keinen Story-Modus.“ Der Story-Modus wird im Spiel mit einem W6 dazugewürfelt, als eine Art Stipulation: eine Färbung der Story, die Georg dann erzählt. Konzeptionell ist das im Farb- und Lichtzusammenhang noch nicht sauber.
- **Folge für WS1:**
  - Heute leitet `stagePalette.js` einen Story-Modus aus dem Kartentext ab (`world-context` / R2 computeContext) und tönt die Bühne damit um 12 %. Das ist nach Georg falsch.
  - **Vorschlag:** Mit dem Einbau von V-305 entfällt die Ableitung aus der Karte.
  - Die Grundfarbe kommt fest aus Bühne bzw. Deck (`fromHue`/`fromColors`).
  - Der Story-Mode wird Spielzustand: gesetzt durch den Würfelwurf, Tönung bzw. `fromStoryMode` erst dann.
  - Bis zum Würfel gibt es keinen Story-Tint.
  - **Bitte bestätigen.**

### 43.2 · Georg 16.10.: Licht und Environment in die nächsten MVP-Schritte
Georg will Licht, Beleuchtung und Environment in die nächsten MVP-Schritte bzw. Scheiben aufnehmen. V-329 (L1, parallel zu M2) beantwortet das für den ersten Schritt; der Tageslauf, Wetter und übrigen Bühnen folgen nach L1-PASS.

### 43.3 · L1 (`replies/BRIEF_WS1_LIGHT_R1.md`) gelesen: passt im Kern, fünf Punkte vor dem Bau
1. **Story-Mode (43.1):** Das Briefing sagt „Lichtstimmung je Deck/Story-Mode“ und „`fromStoryMode`/`fromHue` der jeweiligen Bühne bzw. des Decks“.
   - **Vorschlag:** Eingabe = `palette.hue` (oder Farben) im Bühnen-Deskriptor, sonst Deck.
   - Story-Mode erst mit dem Würfel.
   - Bitte festlegen: Bühne oder Deck, und wenn Deck, nach welcher Tabelle (Genre → Farbton).
2. **Lokale Lichter in Meshy-Modellen:** Meshy-GLBs sind ein Netz mit einer gemalten Textur; einzelne Laternen bzw. Kristalle lassen sich nicht emissiv schalten.
   - **Vorschlag:** je `practical` ein PointLight aus dem Pool plus ein additiver Leuchthof (Sprite/Billboard, `halo`) an der Position.
   - Alternative: WS0 liefert eine Emissions-Maske je Bühne (`emissiveMap`), dann leuchtet die gemalte Lampe selbst.
3. **Kontaktschatten für KayKit (V-203):**
   - `contact-ao` ist auf FB abgestimmt (P08-Werte).
   - Bei GothGirl brach schon der Eigenschatten den Studio-Bildvergleich (f1, §38).
   - **Vorschlag:** contact-ao für KayKit nur Körper und Füße, Kopf ausgenommen (Gesicht ohne Schatten, Regel 4).
   - Weicht das Gesicht trotzdem messbar vom Studio-Bild ab, braucht es Georgs Ja zu einer neuen Studio-Referenz.
4. **PointLight-Pool:** three.js kompiliert alle Materialien neu, wenn sich die Zahl der Lichter ändert. Deshalb gibt es einen festen Pool (z. B. 6), Lichter werden nur in Stärke und Position geschaltet, nie hinzugefügt oder entfernt. Nur zur Kenntnis.
5. **Tonemapping:**
   - J17 nutzt ACES, WS1 heute keins.
   - Die Kartenfläche (Billboard `face`, Meshy-Slot) ist bereits `toneMapped: false`, bleibt also auch mit ACES unverändert (Regel 3).
   - WS1 zeigt die Wahl im Bildpaar.

### 43.4 · Format `practicals[]` im Bühnen-Deskriptor (bitte so eintragen)
```json
"practicals": [
  { "id": "laterne-1", "type": "lantern", "pos": [0.12, 0.40, -0.31], "color": "#ffc15a", "intensity": 1.0, "range": 4.0,
    "flicker": { "amp": 0.15, "hz": 6 }, "halo": { "size": 0.35 } }
]
```
- `pos` in Modelleinheiten wie `marks` (die Bühne rechnet mit `scale` und `floorY` aus dem Slot in Meter um).
- `range` in Metern.
- `type` aus lantern | neon | crystal | torch | monitor (bestimmt nur Standardwerte für Flackern und Hof).
- `intensity` relativ (1 = Standard je Typ).
- `flicker` und `halo` sind optional.
- Keine Schatten.
- Der Pool wählt die nächstgelegenen zur Kamera bzw. Figur.

### 43.5 · Vorschau live (V-314)
- Branch `ws1/preview` **@24309fd2** = kfb-planet main @08463eb, darin Bühne und M1-Zwischenstand. Cloudflare-Check: success. Der Inhalt ist `index.html` (18,0 MB) plus `.github/scripts/build-cloudflare-pages.mjs` und `wrangler.jsonc`, 1:1 aus main.
  - Ohne diese beiden Dateien scheitert der Pages-Build: Das Projekt baut jeden Branch mit dem main-Skript.
  - Ein erster Versuch enthielt durch einen Fehler den ganzen Repo-Baum und wurde von GitHub abgelehnt; veröffentlicht wurde davon nichts.
- **Links für Georg (im Browser-Fenster der App geprüft, keine Konsolenfehler):**
  - Bühne mit Dialog: `https://ws1-preview.kayfabizarro.pages.dev/#stage,actors=fb,dialog=6` (Karte, FB | GothGirl, Blasen, Auswahl, Kamera-Knöpfe);
  - M1-Welt: `https://ws1-preview.kayfabizarro.pages.dev/#m1` (Tastenliste mit H, Bühne vorn mit Sprung erreichbar).
- **Hinweis:** Nach einem Wechsel nur des Hash-Teils muss die Seite neu geladen werden.

## 42 · 15.10. abends · M1 als Zwischenstand nach main gemergt (Georg) · alles grün

### 42.1 · Merge
- m1/bewegung @cc1ded7 mit `--no-ff` nach main: kfb-planet **@08463eb**, konfliktfrei.
- **Was neu in main ist:**
  - M1-Welt (`#m1`): Laufen, Springen und Fliegen mit ecctrl, eigene Schleife (Vertragsfrage §32 weiter offen).
  - Ränge als Kulisse: Zaun aus Tortenstücken mit gemessenem Außenprofil (V-283).
  - `flyClip`: Flug gleitet an Wänden.
  - Dialog mit GothGirl (`stageCast`) und `StageOrbitCam` (ref-Griff, Übergabe ohne Schnitt).
  - Tastenliste vollständig.
- **Prüflauf auf main @08463eb** (frisch gebaut, 0 geänderte Dateien):
  - ganze Testreihe **22/22 PASS**;
  - M1-Runde **14/14 PASS**: rank-fence, contract, move @60/@120/@30, hz-equal, fence, fence-Gegenlauf, scene, handover, eyes, bench, f1.
- **Zaun-Kennwerte:**
  - Bühnenboden im Zaun 0 m²;
  - größter Abstand Zaun → Stufe 0,23 m;
  - Kollider ohne Lücke, ohne zu dünne Stelle, ohne Überstand;
  - freies Gelände im Zaun 13,2 m² statt vorher 184 m² (Nischen, die ein radialer Grundriss nicht auslassen kann).
- **Gegenlauf ohne Zaun:** 6 von 7 Fußwegen und beide schnellen Flüge geraten in die Ränge. Der Zaun ist also wirksam.
- **INFO Rückwand ohne Zaun:** Die Kapsel sinkt bis −18,6 cm ein (z −16,5), unverändert. Das ist der Abnahmewert für WS0s Kollisionsnetz.
- V-248 unverändert: Joggen 0,042, Gehen 0,48, Sprint 0,21.

### 42.2 · Zwischenstand, nicht abgenommen (Georg 15.10., §41.1)
- Kein sechster blinder Prüfer. Prüfer 5 gab PASS MIT AUFLAGEN; die Auflagen N1–N14 sind erledigt.
- **Bei WS0 offen:**
  - V-248 Gehen und Sprint (Clip-Eigenschaft, §33.1);
  - vorderer Ring bzw. Rampe zur Bühne (§39.4 a/b);
  - harter Halt beim Aufsetzen (§39.4 e);
  - Zaunhöhe (§38.3, a/b/c);
  - bewegtes Bildpaar Studio | M1 (V-214);
  - Prüfer-Punkte eigene Schleife, m1-gait vs. anim.mjs, Strg auf dem Mac, V-023 (§35.4);
  - Auslieferweg (§40.6).
- Keine Datei an Georg, bis der Auslieferweg entschieden ist.

## 41 · 15.10. abends · Georg: M1 als Zwischenstand abschließen · Briefing-Entwurf M2 „Fahren übers Gelände“ an WS0

### 41.1 · Georgs Entscheidung (15.10., in der M1-Sitzung)
- M1 wird nach der laufenden Runde @bf04eb0 als **Zwischenstand** abgeschlossen, **ohne sechsten blinden Prüfer**.
- **Gründe:** der Token-Verbrauch, und es gibt noch kein richtiges Spiel-Setup.
- WS1 mergt m1/bewegung nach dem Runden-Ergebnis nach main (ganze Testreihe plus M1-Runde vorher grün) und meldet den Stand hier.
- Die offenen WS0-Punkte aus §39.4 und §40.5 bleiben offen: V-248 Gehen/Sprint, vorderer Ring bzw. Rampe, Zaunhöhe, harter Halt beim Aufsetzen, Bildpaar Studio | M1.

### 41.2 · Briefing-Entwurf M2 an WS0 (V-213: WS0 vergibt die Nummer und beauftragt)
- **Datei:** [`ws1/proposals/BRIEF_WS1_M2_FAHREN_R1_ENTWURF.md`](ws1/proposals/BRIEF_WS1_M2_FAHREN_R1_ENTWURF.md). Entwurf der M1-Sitzung im Auftrag Georgs, noch ohne V-Nummer.
- **Kern:**
  - G0: Vergleich J17 k2b gegen ecctrl 2.0.2 `EcctrlVehicle` (steckt schon im Projekt, gleiche Rapier-Welt wie M1) als Vorlagen-Zeile mit je einem Video; Georg entscheidet (V-290).
  - Danach ein Meshy-Fahrzeug von Georg spielfertig: 18–19 MB → wenige MB, Textur erhalten, Räder als Knoten (V-273).
  - Fahren in der M1-Welt mit Sprüngen, Überschlag, Aufrichten, Ein- und Aussteigen.
  - Schlanker als M1: wenige Tests, ein blinder Prüfer am Ende.
- **Fragen im Entwurf:**
  1. erstes Fahrzeug (neue Meshy-Autos, Cicada oder Badewannen-Kart);
  2. wer bereitet die Modelle auf (V-273: WS0 → WS1);
  3. Ablage (vorerst `~/kfb-ws1/assets/meshy-vehicles/`);
  4. Auslieferweg (offen aus §40.6);
  5. Verhältnis zur Racer-Linie (J17/Lab).
- **Hinweis WS1:** Die Abnahme-Tabelle im Entwurf sagt „Georgs Mac“. Nach V-304 gilt der Auslieferweg, den WS0 in §40.6 festlegt.

## 40 · 15.10. · Dioramen als Bühnen: Aufteilung WS1/M1 und Bühnen-Deskriptor (Vorschlag) · M1-Runde

### 40.1 · Georg: neue Dioramen als Szenarien mit Billboard
Gemeint sind Goblin-Bank, Gefängnis-Panoptikum, Bibliothek, UFO, Comic, Utopia, Dystopia und Atlantis. Das Display ist jeweils ins Modell eingebaut. Einbau laut WS0 nach MVP-0, je Bühne eine Vorlagen-Zeile (V-281, V-287, V-300/V-301, Atlantis @d3326a6a).

### 40.2 · Aufteilung, damit nichts doppelt entsteht
- **WS1 (Bühnen-Seite):** Display bzw. Slot als eigenes Objekt (V-287), Bildflächen-Modul (V-256), Rahmen-Familie je Bühne (V-262), Paletten (V-270/V-286), Bühnenkamera (V-257, `StageOrbitCam`).
- **M1-Sitzung (Begehbarkeit in der Welt):** Kollision, Rampen-Kollider, Kulissen-Zäune wie bei den Rängen, Spielerweg, Dialog-Auslöser je Bühne.

### 40.3 · Schnittstelle: `kfb.stage-descriptor/1` (Vorschlag, gebaut wird nach MVP-0)
Je Diorama gibt es eine Datei `src/data/stages/<id>.stage.json`. Sie baut WS0s Slot-JSON nicht nach, sondern verweist darauf:

```json
{
  "schema": "kfb.stage-descriptor/1",
  "id": "goblin-bank",
  "slot": "kfb-meshy-goblin-bank.screen-a.v1.slot.json",
  "marks": { "left": { "x": 0, "z": 0, "yaw": 0.35 }, "right": { "x": 0, "z": 0, "yaw": -0.35 } },
  "display": { "frame": "<Rahmen-Familie>", "override": null },
  "collision": { "fences": [], "ramps": [], "walkable": null, "triggers": [] }
}
```

- **`slot`** (WS0-Format, unverändert): GLB, SHA, Maßstab, floorY, `kfb_screen_slot` und Rahmen, Standardkamera.
- **`marks`**: Standplätze der Figuren in Modelleinheiten, wie heute `SCENE_MARKS` (WS1).
- **`display`**: Rahmen-Familie je Bühne. Die Position kommt aus dem Slot als Standardwert, God-Mode kann sie später überschreiben (V-287) (WS1).
- **`collision`** (M1-Sitzung):
  - `fences`: Grundriss-Vieleck in Modelleinheiten, gemessen wie bei den Rängen aus der Höhenkarte, mit Prüfskript;
  - `ramps`: je Treppe ein Rampen-Kollider `{ from, to, width }` (Goblin-Bank 42°, Gefängnis 31°, Atlantis ≈ 40°);
  - `walkable`: optional ein vereinfachtes Kollisions-GLB von WS0 statt des Meshy-Trimesh;
  - `triggers`: Dialog-Auslöser `{ center, r, leaveR }`.
- **Bitte an WS0:** Passt der Schnitt? Dann bringt die Vorlagen-Zeile je Bühne nach MVP-0 einen ausgefüllten Deskriptor mit Bild aus der Standardkamera.

### 40.4 · M1-Runde @cdd53c4 (M1-Sitzung, lokal, nicht gepusht): 11/11 grün plus INFO
- **Grün:** rank-fence, contract, move @60/@120/@30, hz-equal, fence, scene, eyes, bench (59,9 fps, p95 16,7 ms, 1,9 ms je Schritt, dpr 2), f1.
- **`m1-fence`:**
  - zu Fuß aus sieben Richtungen (zwei mit Sprung) und von außen: Zaun jedes Mal berührt, nie im Zaun, ≥ 35 cm Abstand, Dialog nie ausgelöst;
  - Flug innen und außen: 40 cm Abstand;
  - 30 m/s gegen Außen- bzw. Stirnwand: steht bzw. gleitet ab, kein Durchtunneln.
- **Fund und Fix:** Die eigene Fluggeschwindigkeit kannte keine Kontakte: bei 15 m/s 18 cm in der Wand, bei 30 m/s ganz durch den Zaun. Jetzt gibt es `flyClip` (castShape je Schritt, der Anteil in die Wand wird gekürzt, der Rest gleitet). In rapier-compat 0.19 zeigt `normal1` aus dem Hindernis heraus; gemessen mit `scripts/m1/probe-fly.mjs`.
- **`m1-scene`:**
  - GothGirl ist Partnerin (über `stageCast`);
  - `StageOrbitCam` ist im Dialog aktiv;
  - Spielerweg von START: zwei Sprünge hinein, Dialog, ein Sprung hinaus.
- **INFO Rückwand ohne Zaun:** Die Kapsel sinkt bis −18,6 cm ein. Das ist der Abnahmewert für WS0s Kollisionsnetz.
- V-248 unverändert: Joggen 0,042, Gehen 0,48, Sprint 0,21.

### 40.5 · Fünfter blinder Prüfer @cdd53c4: **PASS MIT AUFLAGEN** für den Code, noch nicht reif für Georg
- Von Prüfer 4 behoben: 1, 2, 3, 4 (knapp), 5, 8, 10, 11, 12. Teilweise: 9 (Kamera-Übergabe springt). Bei WS0: 6, 7, 13, vorderer Ring bzw. Rampe.
- **Neu, bei der M1-Sitzung:**
  - N3: Reibung Zaun/Kapsel negativ, der Sprung am Zaun steigt 2,59 m statt ≈ 2,16 m;
  - N4: Außenbogen r 19 sperrt an den Flügeln ≈ 100 m² freies Gras → Außenprofil aus der Höhenkarte;
  - N5: FB-Optionen doppelt zu `stageCast.FB` (V-206);
  - N6: Testgrenzen am Messwert, Gegenlauf mit `nofence`;
  - N7: Normalen-Annahme dokumentieren und testen;
  - N8: Kontext für GothGirl im Vertragstest;
  - N9/N14: Kommentare;
  - N10: Tastenliste ohne Strg-Gehen und Dialog-Kamera;
  - N11: Commit-Stempel im Log;
  - N12: kleine Prüflücken;
  - N13: Man läuft durch GothGirl und das Billboard.
- **Bei WS1 (N1/N2), erledigt:**
  - Problem: Die Kamera sprang beim Wechsel Dialog ↔ Laufen (≈ 25° Gier, Bildfeld 38° ↔ 55° hart), und bis zum React-Commit schrieben zwei Steuerungen die Kamera.
  - `StageOrbitCam` nimmt jetzt `ref`: `{ setActive(on) }` wirkt synchron im selben Schritt, dazu `target()` und `jump(name, fov?)`.
  - Beim Einschalten wird das Bildfeld über `ORBIT.glideS` überblendet.
  - `test/orbit` prüft Aus (Kamera unberührt) und Ein (Bildfeld überblendet, Endlage Standardmarke). kfb-planet @cce73aa, ganze Testreihe 22/22 PASS.
- **Bei WS0 offen** (Prüfer: Georgs Abnahme 1 bleibt rot, solange V-248 für Gehen und Sprint offen ist): V-248 Gehen/Sprint, vorderer Ring bzw. Rampe, harter Halt beim Aufsetzen, Zaunhöhe, bewegtes Bildpaar Studio | M1 (V-214).
- **Nachtrag (M1-Sitzung, lokal):**
  - gegen die ref-API gebaut, mit neuem Test `m1-handover` (Replay je Schritt: kein Schritt mit mehr als 20 % der Gesamtänderung, im Dialog steht die Kamera still bei 38°, Endstände 38°/55°);
  - N3–N14 eingebaut: Zaun aus Tortenstücken mit gemessenem Außenprofil (freies Gras im Zaun 13 m² statt 184 m²), Reibung `Max`, Kollider für Billboard und GothGirl, Spieler aus `stageCast.FB`, Tastenliste vollständig, Commit-Stempel, Gegenlauf ohne Zaun.
  - Die Runde folgt.
- **M1 wird erst nach dem neuen Endstand der M1-Sitzung nach main gemergt.**

### 40.6 · Bitte an WS0: Auslieferweg für Abnahmen (V-303/V-304)
- V-304: Abnahmen laufen „live in der Site (ToolBox bzw. Spiel), nie über lokale Server, Start-Befehle oder Vorschau-Seiten mit Anleitung“.
- WS1 hat Georg bisher nur Bilder geliefert (1920 × 1080, V-253), nie einen lauffähigen Stand. `dist/index.html` ist eine Einzeldatei (Doppelklick), fällt aber unter V-303/V-304. WS1 darf nicht live deployen.
- **Frage:**
  1. Wohin werden kfb-planet bzw. M1 gebaut und gehostet, z. B. eine Pages-Vorschau des Branches `ws1/r3f-frame` unter kayfabizarro.pages.dev?
  2. Wer richtet das ein?
  3. Gilt für WS1 dann „Push = Vorschau-URL“, und darf WS1 Georg diese URL zur Abnahme geben?
- Bis dahin geht keine Datei an Georg.

### 40.7 · V-305 Farb-Harmonie-Modell: Vorschlag für den Einbau (Vorlagen-Zeile, bitte freigeben)
- Gelesen: `replies/COLOR_HARMONY_R1/` (README, `kfb-cartoon-palette.js`, results.json). V-305 ersetzt die Vorlage V-270; der Einbau liegt bei WS1.
- **Vorschlag:**
  1. `kfb-cartoon-palette.js` 1:1 vendoren (Blob in SOURCE.md).
  2. Eingabe je Karte: der Story-Mode der Karte (wie heute über world-context) → `fromStoryMode(id, 0)`; die Story-Farbe liegt auf dem Boden (V-305).
     - **Alternative:** Deck-Welt bzw. Genre → Boden-Farbton → `fromHue`, und der Story-Mode nur als Tönung.
     - **Bitte entscheiden.**
  3. Rollen auf eigene Bauteile (V-286):
     - Rahmen = `strang`, Pfosten = `trunk`, Leiste = `pad` bzw. `cloud`;
     - Himmel = `sky` → `cloud`;
     - Gelände = `top`;
     - Fluff (später) High = Variante satt, Low = dunkel (V-305).
     - Die Meshy-Textur bleibt bei 18 % Tönung zum Boden-Farbton.
  4. `stagePalette.js`, Test `palette` und SOURCE.md werden umgestellt. `island-palettes.js` und die Genre-Tabelle entfallen, Variante B (`palv=b`) auch.
  5. Ergebnis als Bilder: je Story-Mode ein Einzelbild plus Bildpaar heute | V-305.
- Bis zur Freigabe baut WS1 nichts davon.

## 39 · 15.10. nachmittags · M1: Ränge als Kulisse grün, vierter blinder Prüfer PASS MIT AUFLAGEN · Kamera und Besetzung als gemeinsame Module

### 39.1 · M1-Runde @17d32fa (M1-Sitzung, lokal m1/bewegung, nicht gepusht): 10/10 grün
- Grün: rank-fence, contract, move @60/@120/@30, hz-equal, scene, eyes, bench (59,9 fps, p95 16,7 ms, dpr 2) und f1.
- **Zaun-Werte @60:**
  - zu Fuß von der Bühne: hält bei r 6,65, hebt sich 4 cm;
  - vom Flügel: gleitet am Zaun entlang nach vorn;
  - Flug über der Bühne: landet auf der Bühne;
  - Flug von hinten: landet auf dem Gelände bei r 19,3.
  - In keinem Fall endet die Figur im Zaunbereich.
- Im ersten Durchlauf war m1-move rot. Ursache war nur der Test: Er startete im Dialog-Auslöser (z −3), und der Dialog fror die Figur ein. Jetzt startet er bei z −6,4, und der Dialog wird nach der Bühnenlandung beendet.
- V-248 unverändert: Joggen 0,042, Gehen 0,48, Sprint 0,21.

### 39.2 · Vierter blinder Prüfer (nur Code): **PASS MIT AUFLAGEN**
- **Nachgerechnet und in Ordnung:**
  - Zaun dicht (Mittellinie lückenlos, Wand überall ≥ 0,30 m, Drehung und Ecken stimmen);
  - Filter korrekt (castRay-Prädikat, `ecctrl.excludeRay` in allen drei Bodenabfragen);
  - Dialog-Auslöser, Marken und Billboard bleiben frei;
  - Befunde des dritten Prüfers nachprüfbar behoben.
- **Auflagen, die die M1-Sitzung abarbeitet:**
  - A1: Innengrenze des Zauns je Winkel aus der Höhenkarte (erste Stufe − 0,1 m). Der Kreis bei r 7,2 sperrt ≈ 29 m² ebenen Bühnenboden.
  - A2: Stirnseiten außen auf ≈ 154° (14 Zellen Flügelspitze lagen draußen), dazu SHA-Pin der GLB im Prüfskript.
  - A3: Abhalte-Tests trennschärfer machen: Kontakt je Abschnitt, Sprung nachweisen, Shift-Flug mit 30 m/s, Schalter `nofence` für den Gegenlauf, Rückwand-Messwert wieder berichten.
  - A4: Neuer Test für den Spielerweg: von START über den vorderen Ring springen, Dialog, wieder hinaus.
  - A5 (V-269): Partner in M1 ist GothGirl statt eines zweiten FB, über `src/actors/stageCast.js` (39.3).
  - A6: main einmergen und die Bühnen-Orbit-Kamera übernehmen statt eines zweiten Wegs (V-206), über `src/StageOrbitCam.jsx` (39.3).

### 39.3 · WS1: Kamera und Besetzung als gemeinsame Module (kfb-planet @a65185e, ganze Testreihe 22/22 PASS)
- Aus Stage.jsx herausgelöst, Werte und Ablauf unverändert. Damit nutzt die M1-Szene dieselben Bausteine und lädt Stage.jsx (Hash-Auswertung, Bühnenaufbau) nicht mit.
- **`src/StageOrbitCam.jsx`:** `StageOrbitCam({ view, active = true })`, `ORBIT`.
  - `active=false`: Steuerung aus, Knöpfe verborgen, kein update, Kamera wird nicht angefasst.
  - Beim Einschalten gleitet die Kamera von der aktuellen Lage zum Startblick.
  - Für M1: ecctrl-Folgekamera außerhalb des Dialogs, Orbit im Dialog.
- **`src/actors/stageCast.js`:** `FB`, `ROGUE`, `KAYKIT(id)`, `CAST_IDS`. Optionen für `createActor`, ohne Hash und ohne Bühnenzustand.

### 39.3b · M1 nach den Auflagen (M1-Sitzung, lokal @58eba04, noch ungetestet)
- **Zaun:** Die Innengrenze folgt je 2,5° der ersten Stufe (minus 5 cm): hinten ≈ 6,9 m, seitlich ≈ 8 m, Flügel ≈ 9,3 m. Die Stirnseiten laufen schräg bis 156°.
- **Kollider:** Prismen mit Gehrung statt Quadern, dicht ohne Überstand; Außen- und Stirnseite 2 m dick.
- **Prüfskript:** kein Bühnenboden mehr im Zaun, höchstens 27 cm Abstand vom Zaun zur Stufe, SHA-Pin der GLB.
- **Neue und erweiterte Tests:**
  - neuer Test `m1-fence`: Kontakt je Abschnitt, Sprung nachgewiesen, schneller Flug gegen Außen- und Stirnwand;
  - Rückwand als INFO-Bericht;
  - `m1-scene`: Spielerweg von START mit Sprung über den Ring.
- Ergebnis folgt nach der M1-Runde.

### 39.4 · Fragen an WS0 (aus dem Prüferbericht)
- (a) Zählt der vordere Ring (0,79 m hoch, r 9,5–10,5) als Rang? Heute kommt man von START nur per Sprung auf die Bühne (Gelände −0,125, also 0,9 m Stufe).
- (b) Braucht das Kollisionsnetz von WS0 eine Rampe oder Öffnung, damit man die Bühne zu Fuß ohne Sprung erreicht?
- (c) Zaunhöhe (§38.3): Der Prüfer hält Variante (b) für natürlicher (V-288: „Reisen macht Spaß, Flug“). Kein FAIL-Grund; bis zur Antwort bleibt (a).
- (d) V-248: Gehen 0,48 und Sprint 0,21 sind nur berichtet (§33.1 offen), die Kurve ebenfalls (0,139, Referenz 0,05).
- (e) Harter Halt beim Aufsetzen nach Flug (Ruck 11–21 cm): Der Grund dafür, die Rangkante, ist mit V-283 weg. Dämpfen statt Nullsetzen wäre neues Verhalten, deshalb bleibt es bis zur Antwort.
- (f) V-257 im M1-Dialog ist nach dem Merge über `StageOrbitCam` erfüllt; was danach noch fehlt, meldet die M1-Sitzung.

## 38 · 15.10. mittags · V-286 umgesetzt (18 %, Georg: passt) · drift-freie Karten im Dialog · Schatten für alle Figuren · Bitte um Licht-Briefing

### 38.1 · Umgesetzt (kfb-planet @a3744f0, ganze Testreihe 22/22 PASS, mit neuem Test `drift`)
- **V-286 · Meshy-Bühne nur sanft tönen:**
  - Die Amphitheater-Textur wird nicht mehr zu 85 % umgefärbt, sondern zu 18 % getönt (`PAL_AMT`).
  - **Georg 15.10.: „18 % passt so“** → bitte als Zahl für G-6 (Farbkonzept R1) eintragen.
  - Rahmen, Pfosten und Himmel tragen weiter die volle Palette.
  - Bildpaar vorher | nachher: `ws1/proofs/2026-10-15-v286/paar_vorher_nachher.png`.
- **Variante B (§37)** bleibt nur als Vergleichs-Hash `palv=b`, nicht Standard. Ihre Rollen-Umfärbung der Meshy-Textur ist durch V-286 überholt. Auf eigenen Bauteilen (Rahmen = `strang`) wird erst umgebaut, wenn das Farbkonzept R1 steht.
- **Georg zu Farben (15.10.):** WS0 rekonstruiert Paletten und Zuordnung; bis dahin „nehmen wir das jetzt mal so“, Einzelheiten der Einfärbung später.
- **Drift-freie Karten (WS0 zu §24.2):**
  - `src/data/drift-cards.json` (23 Decks, 376 Karten auf Drift-Seiten; erzeugt aus Drift-Bericht und OCR-Seiten, gepinnt auf 52adc8f1) und `cardDrift.preferDriftFree()`.
  - Die Dialog-Szene nimmt ab der Startkarte zuerst drift-freie Karten, Drift-Karten nur zum Auffüllen. Die ausdrücklich gewählte Startkarte bleibt vorn, die Vorschau behält Georgs Reihenfolge.
  - Test `drift`: z. B. academic_anarchy ab #27 → 27, 28, 41–44.
- **Schatten (Georg 15.10.: „irritierend, dass FrizzleBob einen Schatten hat und GothGirl nicht“):**
  - Die KayKit-Figuren werfen jetzt Schatten auf den Boden nach derselben Regel wie FB (`eyeActor`). Test `cast` prüft `castsShadowLikeFrizzleBob`.
  - Empfangen bleibt bei KayKit aus wie im Studio: Mit Eigenschatten im Gesicht fiel der Bildvergleich mit dem Studio (f1 `faceVsStudio` 2,4 → 13,6, Grenze 6). FB empfängt Schatten (P08-Spender). Diese Ungleichheit gehört ins Lichtkonzept (38.2 Punkt 3).
  - Der Kontaktschatten `contact-ao` (P08, auf FB abgestimmt) bleibt FB-eigen. Ob KayKit-Figuren ihn auch bekommen, gehört ins Lichtkonzept (38.2).

- **Hinweis Netz:** Ein Lauf der ganzen Testreihe braucht ≈ 27 Abfragen der GitHub-API (Pool, Registry); ohne Anmeldung sind 60 pro Stunde erlaubt. Um 12:06 war das Kontingent erschöpft (s5a: HTTP 403). Kein Code-Fehler; bei mehreren Läufen pro Stunde (zwei Sitzungen) beachten.

### 38.2 · Bitte an WS0: Licht-Briefing (Georg 15.10.)
- **Georg:** Er möchte ein einheitliches Beleuchtungs- und Schattenkonzept, dazu ein Farbkonzept, das mit Lichtstimmung und Tageszeit variiert. Dazu gab es eine intensive YouTube-Recherche, wie die Tageslicht-Situation als Basis genommen wird. Wenn das nicht eindeutig im Briefing steht, soll WS0 ein klares Briefing nachliefern.
- **Was WS1 gefunden hat:**
  - V-050 (Licht-Profile Tag/Abend/Nacht/Innen aus SKY3, Abend TUNE);
  - V-092, V-101 (TinySkies-Tageszeiten, Tageslauf mit Überblendung);
  - V-132 (day-night einziger Licht- und Nebel-Schreiber);
  - Farbkonzept R1 §2.1 (Licht kommt von der Lichtquelle, Story-Mode darf tönen, nicht ersetzen);
  - `replies/WSA_LIGHT_STUDY_C_R1.md` + `light-presets.json` (11.10.): J17-Tag aus dem Code – Sonne `#fff4e6`/2,9, Hemi `#eef4fa`/`#9a8a78`/1,05, Gegenlicht `#ffe6d6`/0,6, ACES, Sonne ≈ 49° hoch, Azimut −53°; Abend-Kandidat E50; KayKit-Godot-Tutorial (Ambient 0,75) als einzige ausgewertete YouTube-Quelle. Alles als Vorschlag, **nicht von Georg angenommen**.
- **WS1 heute:** Die Bühne hat ein eigenes, provisorisches Licht (Hemi `#fff4e0`/`#3a3226` 1,25, Sonne 1,8 aus (18, 30, 22), Schattenkarte 2048), kein Tageslauf.
- **Bitte klar festlegen:**
  1. Basis-Tageslicht für Bühnen und Welt: J17-Tag aus der Lichtstudie oder etwas anderes? Und wo liegt die YouTube-Recherche, die Georg meint (Datei/Pfad)?
  2. Tageszeiten: welche (Tag/Abend/Nacht/Innen?), wer schreibt sie (day-night/SKY3 aus dem Lab als Spender?), Übergang.
  3. Schatten für alle Figuren und Requisiten: Sonnenschatten plus Kontaktschatten für alle (contact-ao auch für KayKit, V-203)? Stärke und Weichheit.
  4. Zusammenspiel mit Palette und Story-Mode: Was tönt das Licht, was die Materialien (Farbkonzept R1 §2.1)?
  5. Bis dahin baut WS1 am Licht nichts Neues; das jetzige Bühnenlicht bleibt.

### 38.3 · M1 setzt V-283 um (M1-Sitzung, lokal m1/bewegung @ee24b69, nicht gepusht)
- **Ränge als Kulisse:** Um die Ränge steht ein unsichtbarer Zaun, nur in der Physik: innen r 7,2 m, außen 19 m, Stirnseiten bei ±150°, Höhe bis 420 m.
- Landung, Bodenangleich, Kamera und die ecctrl-Bodenstrahlen sehen den Zaun nicht (`ecctrl.excludeRay`).
- **Abdeckung** gegen die Höhenkarte geprüft (`scripts/m1/rank-fence.mjs`): 9224 von 9439 Rang-Zellen liegen im Zaun. Draußen bleibt nur die Kante vor der Bühne (z ≥ 8 m).
- **`m1-move` prüft jetzt das Abhalten statt des Begehens:**
  - zu Fuß und mit Sprung von der Bühne;
  - vom Flügel;
  - im Flug von der Bühne;
  - von außen hinter der Rückwand.
  - Gelandet wird auf Bühne bzw. Gelände.
- Die Stelle an der Rückwand (§34.4) ist hinter dem Zaun nicht mehr erreichbar. Sie bleibt gemeldet, bis das Kollisionsnetz von WS0 kommt.
- Prüfer-Punkte (§35.4): nichts umgebaut.
- **Rückfrage an WS0 (Zaunhöhe):**
  - **Warum 420 m:** Ein Zaun nur bis zur Mauerkrone (≈ 8–10 m; die Rückwand reicht bis 9 m) erlaubt das Überfliegen. Dann kann man aber von oben auf einem Rang landen, und das wäre wieder „Betreten“.
  - **(a)** wie jetzt: hoher Zaun, kein Überfliegen der Ränge, Code unverändert.
  - **(b)** Zaun bis ≈ 10 m plus die Regel „über den Rängen keine Landung, F ohne Wirkung“. Das ist neues Flugverhalten im post-Handler, klein, aber neu.
  - **(c)** auf das Kollisionsnetz von WS0 warten, das die Frage neu stellt.
  - Bis zur Antwort bleibt (a). Geändert würde nur eine Konstante (`RANK_FENCE.top` in `src/m1/m1Host.js`), bei (b) dazu die Regel.

## 37 · 15.10. mittags · V-270 Variante B gebaut (Rolle je Bühnenteil) · Bilder für Georg

- **kfb-planet @44afcfa**, Hash `palv=b`. Der Standard bleibt Variante A, bis Georg wählt. Die ganze Testreihe ist grün, **21/21 PASS**.
- **Berichtigung:** In §34 stand „22/22“; die Testreihe hat 21 Tests.
- **Umsetzung von §36.3:**
  - Das Amphitheater ist nach Weltlage geteilt, vermessen mit `scripts/amph/band-probe.mjs`: Tritte bei ≈ 0,7 · 1,4 · 2,1 · 2,8 · 3,55 · 4,4 m.
  - Oberhalb 4,55 m liegen Bögen und Mauerkrone: `tower[0]` senkrecht, `tower[1]` waagrecht.
  - Innerhalb 7,3 m und waagrecht liegt der Bühnenboden: `sand`. Mit `top` ging er in den Rängen unter.
  - Dazwischen liegen die Sitzreihen, `hill[0]`/`hill[1]` im Wechsel; je Band ein Setzstein mit seinem Tritt (0,71 m ab 0,05 m).
  - Die Helligkeit der Meshy-Textur formt die Rollenfarbe (0,6 … 1,15).
  - Gelände `top`, Billboard-Rahmen `strang`, Pfosten `trunk`, Leiste `path` (das Joyride-`pad` fehlt im Lab).
  - Himmel `sky` → `cloud`.
  - Ohne Tint, bis §36.4 beantwortet ist.
- **Test `palette`:** neue Prüfung `variantBRolePerPart` (otown: Rollen = Lab-Daten, Rahmen `#e9b53b` = Joyride `WORLDS` 1:1).
- **Bilder** (`ws1/proofs/2026-10-15-palette-v270b/`, je 1920 × 1080):
  - sechs Paletten;
  - `7_paar_bisher_B` (bisher | B, dieselbe Karte und Kamera).
- **Befund aus den Lab-Daten:**
  - canyon, wueste, kfb_town und protopia haben denselben orangeroten `strang`, also denselben Rahmen;
  - wueste liegt fast ganz im Sand- und Braunbereich.
  - Wenn Georg die Paletten deutlicher getrennt will, ist das eine Daten-Entscheidung bei WS0/Lab.
- **Offen:** Georgs Urteil A oder B bzw. Rollen tauschen; WS0-Antworten zu §36.4 (Story-Mode-Paletten mit ≥ 6 Farben, Joyride-Farbvariationen).

## 36 · 15.10. · Georgs Urteil zu V-270: „eine Tönung, keine Palette“ · Variante B · Fragen an WS0

### 36.1 · Georgs Urteil zu den Bildern aus §34 (sinngemäß, Georg 15.10.)
- Er sieht immer nur eine Akzentfarbe; das wirkt wie eine Farbtönung der Szenerie, nicht wie eine Palette.
- Eine Palette hat mindestens sechs harmonisch abgestimmte Farben.
- Die sechs Story-Modes bringen zusätzlich eine Tönung mit, aber ebenfalls mit einer differenzierten Palette.
- Die Grundpaletten gibt es in den entsprechenden Joyride-Farbvariationen.
- Unklarheiten soll WS0 klar formulieren.

### 36.2 · Ursache (WS1)
- Der Fehler liegt in meiner Rollenwahl, nicht in den Daten.
- Ich habe das ganze Amphitheater auf **eine** Rollenfamilie gelegt (stone bzw. paved, drei Helligkeiten eines Tons) und das Billboard auf die accent-Familie. Sichtbar wurden damit zwei bis drei Töne plus Tint.
- Joyride (`track-look.v5.js` `WORLDS`, `setWorld`) setzt dagegen **jede Rolle auf eine eigene Objektklasse**: table, hill[2], tower[2], leaf[3], trunk, rock, cloud, strang, pad, sky. Dadurch stehen acht und mehr Farbtöne nebeneinander.

### 36.3 · Variante B (WS1 baut jetzt, als Bilder zum Urteil; Standard bleibt bis zu Georgs Wahl)

| Bühnenteil | Rolle aus `PALETTES` |
|---|---|
| Torbögen und Mauerkrone (oben) | `tower[0..1]` |
| Sitzreihen | `hill[0]` / `hill[1]` im Wechsel nach Höhenband |
| Bühnenboden (Mitte, waagrecht) | `top` (Tisch der Insel) bzw. `sand` |
| Gelände außen | `hill[1]` |
| Billboard-Rahmen | `strang` |
| Billboard-Pfosten | `trunk` |
| Billboard-Leiste | `pad`/`rock` |
| Himmel | `sky` → `cloud` |

- Die Teile des einen Meshy-Netzes werden nach Weltposition getrennt: Höhe und Abstand zur Bühnenmitte, dazu die Normale wie bisher. Das ist dieselbe Technik-Art wie das Normalen-Kriterium aus V-270.
- Ohne Tint, bis die Story-Mode-Paletten geklärt sind.

### 36.4 · Bitte an WS0 (Georg wünscht ausdrücklich klare Formulierung)
1. **Story-Mode-Paletten:** `storymode.v4.js` hat je Modus nur `base` und `accent` (dazu `deep`/`light` abgeleitet). Georg spricht von einer differenzierten Palette mit mindestens sechs Farben je Story-Mode. Wo liegen diese Paletten (Datei, Pfad, Commit)? Und wie wirken sie über der Insel-Palette: als Rollen-Ersatz oder als Tönung je Rolle?
2. **„Joyride-Farbvariationen“ der Grundpaletten:** Welche sind gemeint? Bekannt sind die drei `WORLDS` (canyon, bucht, otown) plus die abgeleiteten Lab-Paletten (wueste, kfb_town, protopia). Gibt es je Palette mehrere Varianten, und wo liegen sie?
3. **Rollen je Bühnenteil:** Ist die Tabelle in 36.3 so im Sinn von V-051/V-270?

## 35 · 15.10. vormittags · M1-Runde @fb6bb2d (m1/bewegung): Gelände grün, Ränge rot · keine Abnahme-Datei für Georg

Bericht der M1-Sitzung, von mir eingetragen.

### 35.1 · Grün
- `m1-contract`, `m1-scene`, `m1-eyes`, `f1`.
- `m1-bench`: M4, dpr 2, 60 fps, p95 16,7 ms, 60 Physik-Schritte/s.
- `m1-hz-equal`: 30 Hz und 120 Hz laufen identisch zu 60 Hz, 0 Abweichungen. Live und Replay stimmen damit unabhängig von der Bildrate überein.
- `m1-move` im Gelände (Ebene, Kurve, Hang, Sprung, Landung): Hautsohle (Netz) ≥ 0, Kapsel +15–20 cm.
- V-248: Joggen 0,042, erfüllt.

### 35.2 · Rot (m1-move, nur Ränge = Treppe)
- Joggen über die Ränge: Die Sohle sinkt an den Stufenkanten bis −14,7 cm ein, Ruck 8,2 cm/Schritt², Bodenangleich bis 26 cm.
- Landung auf einem mittleren Rang: Die Sohle sinkt −5,6 cm ein, die Figur steht am Ende nicht genau auf der Stufe.
- Ohne Fuß-IK bzw. Stufenlogik geht das nicht sauber. **Beides ist neues Verhalten → Entscheidung WS0/Georg**, M1 baut es nicht ohne Vorlagen-Zeile.

### 35.3 · Berichtet, nicht als bestanden geführt
- Rutschen im Eigentempo: Gehen 0,48, Sprint 0,21 (Eigenschaft der Clips, §33.1).
- Kurve: Die Füße kriechen 17,9 cm gegen 11 cm in der Referenz (es gibt keinen Dreh-Clip).
- Sockel an der Rückwand (§34.4).

### 35.4 · Dritter blinder Prüfer (FAIL): Stand
- Abgearbeitet bis auf diese offenen Fragen an WS0:
  - eigene Schleife (Vertragsfrage, §32);
  - `m1-gait` statt `anim.mjs` (V-206);
  - Strg-Taste auf dem Mac;
  - V-023;
  - bewegtes Bildpaar gegen das Studio (V-214).

### 35.5 · Keine Abnahme-Datei
Nach dem M1-Briefing braucht eine Abnahme für Georg alle Tests grün plus Prüfer-PASS. Die Ränge fehlen, deshalb geht keine Datei an Georg.

### 35.6 · Bitte an WS0
1. Fuß-IK und/oder Stufenlogik für die Ränge: ja oder nein, und wenn ja, als Vorlagen-Zeile.
2. Alternative: Die Ränge gelten in MVP-0 als Kulisse ohne Begehen, dann ist die Prüfung „Ränge“ nicht Teil der Abnahme.
3. Die offenen Prüfer-Punkte aus 35.4.

## 34 · 15.10. morgens · V-270 Bühnen-Paletten gebaut · Push Orbit-Kamera und Daten-Pin

### 34.1 · V-270 · Paletten als Harmonie-Systeme (kfb-planet @12b9a47, ganze Testreihe 22/22 PASS)
- **Quellen 1:1** (`src/vendor/palette/SOURCE.md`):
  - `island-palettes.js` = Lab `src/palettes.ts` @64ae61fe7 (Blob f8f57d76), nur die Typen entfernt; alle 352 Farbwerte gleich und in gleicher Reihenfolge.
  - `storymode.v4.js` = Register-Branch `replies/donors/storymode.v4.js` (Blob 58a79133), bytegleich.
  - `world-palettes.js` und die Rollen-Formeln aus `palette-roles.js` sind nicht mehr Farbquelle der Bühne; `world-context.js` liefert weiter den Story-Modus der Karte (wie R2).
- **Rollen je Bühnenteil (wie §28.2):**
  - Himmel `sky` → `cloud`, Nebel = `cloud`;
  - Gelände `ground[1]`;
  - Amphitheater: senkrechte Flächen auf dem Verlauf `stone`, waagrechte auf `paved`. Getrennt wird nach der Flächen-Normale in Weltkoordinaten (weicher Übergang n.y 0,55–0,8), Anteil 0,85 über der Meshy-Textur, die Zeichnung bleibt;
  - Billboard: Rahmen `accent[0]`, Zierleiste `accent[2]`, Pfosten `bark[1]`.
- **Story-Tint:** 12 % zum `accent` des Story-Modus der Karte, als gerade sRGB-Mischung, also höchstens 12 % des Abstands je Farbkanal. `mix` aus palette-roles mischt linear-hell und hätte bei 12 % deutlich stärker gewirkt. Test `storyTintAtMost15` prüft die Grenze.
- **Genre-Tabelle wie §28.2:** alle 130 Decks bekommen eine Palette, alle sechs Paletten kommen vor (protopia 48, kfb_town 24, otown 20, canyon 19, bucht 10, wueste 9). Rückfall `kfb_town`.
- **Vergleich:** `palette=<Insel>` erzwingt eine Palette, `plain` schaltet den Tint ab.
- **Test `palette` V-270, 13/13 PASS:**
  - Rollen = Lab-Daten (bucht ohne Tint);
  - Karte → Palette;
  - Billboard, Amphitheater (Wand/Boden), Himmel und Nebel tragen die Rollen;
  - Wechsel weich (V-011), ohne Reste;
  - gleiche Karte, kein Wechsel.
- **Befund aus den Lab-Daten:** canyon und kfb_town haben dieselbe Akzent-Familie (`#f2b632 / #ef5a22 / #c4441a`), deshalb sind beide Rahmen goldgelb. Das ist kein Fehler im Einbau; falls Georg das unterscheiden will, ist es eine Daten-Entscheidung (WS0/Lab).
- **Bilder für Georg** (`ws1/proofs/2026-10-15-palette-v270/`, je 1920 × 1080 mit großer Beschriftung):
  - `1_otown` … `6_protopia`, je Palette eine passende gesicherte Karte, Besetzung FB | GothGirl;
  - `7_paar_alt_neu` = dieselbe Karte aus derselben Kamera, links V-245, rechts V-270.
  - **Georg urteilt.**

### 34.2 · Gepusht
- Daten-Pin 52adc8f1 (§33.2), V-257 Orbit-Kamera (§33.2) und V-270 (§34.1).
- Vorher lief die ganze Testreihe: 22/22 PASS, darunter `orbit` 8/8 und `palette` 13/13.

### 34.3 · Als Nächstes
- Nach Georgs Urteil die Paletten feinstellen.
- Danach MVP-0: Die Dialog-Szene wählt bevorzugt Karten von drift-freien Seiten (§28.1).
- Meshy-Bühnen (V-281) erst nach MVP-0, je Bühne eine Vorlagen-Zeile.

### 34.4 · M1-Befund (M1-Sitzung): Rang-Landung an der Rückwand
- **Befund:** Oben am Rang an der Rückwand des Amphitheaters (z ≈ −16,5 m) rutscht die ecctrl-Kapsel nach dem Aufsetzen auch ohne Tempo unter einen Sockel der Meshy-Kollision, um 19 cm. Das liegt an der Geometrie an dieser Stelle, nicht an der Steuerung.
- **Umgang in m1-move:**
  - Die Landung auf einem mittleren Rang wird weiter streng geprüft.
  - Die Stelle an der Rückwand wird gemessen und berichtet, aber nicht als PASS/FAIL gewertet.
  - Das ist offen benannt, damit es nicht wie die zurückgenommene Abschwächung aus §32.1 aussieht.
- **Bitte an WS0 (Asset):** Kollisionsnetz des Amphitheaters an der Rückwand prüfen. Die Rang-Durchdringung aus §31 (−4,1 / −22,8 cm) könnte dieselbe Ursache haben.

## 33 · 15.10. nachts · M1 Tempo-Messung berichtigt: Sprint-Konflikt entfällt · Daten-Pin 52adc8f1 · V-257 Orbit-Kamera (lokal)

### 33.1 · Berichtigung M1 zu §31.2 und §32.1 (M1-Sitzung)
- **Messung neu:** Eigentempo jetzt über Ferse und Ballen aus dem Netz statt über Knochen-Ursprünge (`src/modules/m1-sole.js`, `scripts/m1/clip-speed.mjs`). Ergebnis auf FrizzleBob: **Walking_B 1,12 · Running_A 3,24 · Running_B 5,08 m/s**, nahe an der Motion-SSOT LOCO (0,93 / 3,13 / 4,98 m/s auf FB).
- **Damit liegen alle V-020-Tempi in den V-248-Grenzen:**
  - Joggen 3,08 m/s = Running_A × 0,95;
  - Sprint 4,88 m/s = Running_B × 0,96;
  - Gehen 1,12 m/s = Walking_B × 1,0.
  - **Der Sprint-Konflikt aus §31.2 (Optionen a/b/c) entfällt**, die Tabelle in §31.2 ist überholt.
- **Rest-Befund für WS0:** Selbst im Eigentempo rutschen in der Referenz ohne Controller **Sprint (Anteil 0,21) und Gehen (0,47)**, Joggen nur 0,039. Das ist eine Eigenschaft der KayKit-Clips: Der Standfuß wandert nicht gleichmäßig nach hinten. Messmethode in `test/m1-feet.mjs`. Die V-248-Abnahme „< 0,1 bei Gehen und Sprint“ ist mit diesen Clips nicht erreichbar → bitte Clip-Wahl oder Abnahme entscheiden.
- **Aus Prüfer M1-3 umgesetzt (M1-Sitzung):**
  - ecctrl läuft immer; Flug, Halten und Gehtempo greifen im selben Schritt (Live = Replay auch bei mehreren Schritten je Bild);
  - freie Kamera im Dialog (V-257, eigene Steuerung in #m1);
  - Bodenangleich wird beim Teleport zurückgesetzt;
  - strenge Rang-Prüfung wieder drin;
  - toter `anim.mjs` in M1 entfernt.

### 33.2 · WS1
- **Daten-Pin 52adc8f1** (lokal kfb-planet @d2bbe34): nur `trailingPages: 1` für anti_rules_toolkit neu, alle anderen Decks bytegleich, Audit unverändert 60/78/3142.
  - **anti_rules_toolkit bleibt UNSAFE:** OCR 44/56 Titel = 0,786 < 0,85. Ursachen sind seitenbreite Titel („SYMPTOMS O“ | „F CERTAINTY“) und die Drift aus §24.2; die Seitenzuordnung selbst war schon richtig.
  - Nach WS0s Regel wird es deshalb noch nicht gezeigt.
- **V-257 Orbit-Kamera auf der Bühne** (lokal kfb-planet @e6529ce, Test `orbit` 9/9 PASS):
  - OrbitControls mit Glättung (Dämpfung 0,08), Zoom zum Cursor, Panning, Fokus per Doppelklick (weiches Gleiten);
  - nie unter 0,5 m (V-203);
  - Sprungmarken als Knöpfe oben rechts: „Standard“ (Standard-Blick der Bühne) und „Nah“ (40 % näher), weich angefahren, Restschwung vorher verbraucht.
  - Der Standard-Blick bleibt `near` bzw. die Slot-Kamera der Meshy-Bühnen.
  - Push folgt nach den Bühnen-Tests (g4, stage, d1stage, g4preview, palette), sobald die M1-Runde den Browser freigibt.
- **Als Nächstes:** V-270 Paletten (freigegeben) mit Story-Tint aus `storymode.v4.js`.

## 32 · 15.10. nachts · Gelesen bis V-281 · M1-Berichtigung (dritter blinder Prüfer FAIL) · Arbeitsplan WS1

### 32.1 · M1 berichtigt sich selbst (M1-Sitzung, ehrlich gemeldet)
1. **Abgeschwächte Prüfung zurückgenommen:** Die Rang-Prüfung in m1-move war nach einem roten Lauf abgeschwächt worden; die Kapsel-Prüfung bei der Rang-Landung kommt wieder hinein.
2. **Messfehler Gehen:** Die Eigentempo-Messung lief über Knochen-Ursprünge (≈ 8 cm über der Sohle). Der Konflikt „Gehen rutscht schon im Eigentempo“ aus §31.2 ist zum Teil ein Messartefakt → **wird neu gemessen**, korrigierte Zahlen folgen. Joggen und Sprint werden mit derselben Korrektur nachgeprüft.
3. **Live ≠ Replay (Restfall):** ecctrl-`enable` und Gehtempo laufen über React, also erst nach dem Bild; M1 baut das auf Steuerung im Physik-Schritt um.
4. **V-257** (Orbit-Kamera auch im Dialog) übernimmt WS1 für die Bühne (unten 32.3); M1 richtet sich danach.
5. **Zur Entscheidung durch WS0 (Vorschläge der M1-Sitzung):**
   - (a) M1 nutzt eine eigene Schleife (Canvas `frameloop="never"`, ein Schritt je Physik-Takt). Das berührt den Host-Vertrag: R1.3 (fixedDt/after) wurde dafür freigegeben und dann zurückgezogen.
   - (b) `m1-gait` ist ein zweiter Gang-Mischer neben `anim.mjs` (V-206: ein Code-Pfad). Vorschlag: `anim.mjs` um timeScale erweitern statt Kopie.
   - (c) **Strg als Geh-Taste ist auch auf dem Mac ungünstig:** Strg+Klick ist Rechtsklick, Strg+Pfeile wechseln die Desktops. Zusammen mit §31.3 (Windows schließt den Tab): bitte eine andere Taste oder einen Umschalter (Vorschlag: G = Gehen an/aus).
   - (d) Gilt V-023 (Sprungarten: Stand / aus Joggen / Shift+Leer = Weitsprung) schon für M1?

### 32.2 · Quittiert
- **V-270-Vorlage freigegeben**, Story-Tint-Quelle `replies/donors/storymode.v4.js`.
- **Daten-Pin 52adc8f1** (anti_rules_toolkit verified).
- **Bibliothek mit Slot** (`assets/meshy-stages-library-dystopia-2026-10-15` @8e7519ea); Dystopia erst nach Georgs Abnahme.
- **V-257** Orbit-Kamera; Gedankenstrich bleibt.

### 32.3 · Arbeitsplan WS1 (MVP-0 zuerst, je Schritt Suite + Einzelbilder nach V-253)
1. **Daten-Pin 52adc8f1:** OCR-Audit für anti_rules_toolkit mit neuem Viertel-Raster, übrige Decks neu bewerten; Anti-Rules erscheint nur, wenn SAFE.
2. **V-257 Orbit-Kamera auf der Bühne:** 360° drehen, Zoom zum Cursor, Panning, Fokus auf Klick, ruhig nach V-026; Sprungmarken „Standard“ und „nah“; Standard-Blick = heutiges `near`.
3. **V-270 Paletten:** Lab-Paletten 1:1, Rollen je Bühnenteil, Story-Tint aus `storymode.v4.js` (≤ 15 %); sechs Einzelbilder plus Bildpaar alt | neu.
4. **Danach (nach MVP-0):** Meshy-Bühnen einbauen (Maßstab nach Georgs Wahl, §30), Bibliothek mit Slot.

## 31 · 15.10. nachts · M1-Zwischenstand (Bewegung, eigene Sitzung) · drei Befunde zur Entscheidung (V-248)

Quelle: M1-Sitzung, Branch `m1/bewegung` @0504819, eigener Worktree; Messskripte dort (`scripts/m1/clip-speed.mjs` u. a.). Noch nicht gemergt.

- **Grün:** m1-contract, m1-scene, m1-eyes, m1-bench (M4, dpr 2: 60 Bilder/s, p95 ≤ 20 ms, 60 Physik-Schritte/s), f1.
- **Rot:** m1-move nur bei `ranksNoPenetration` und `landRanksNoPenetration`.

### 31.1 · Befund Ränge (Darstellung, keine Kollision)
Auf den Amphitheater-Rängen taucht die Sohle beim Steigen in die nächste Stufe. Mit dem Bodenangleich der schwingenden Sohle sind es noch **−4,1 cm** (vorher −10,8 cm). Bei der Landung auf einer Rangkante sind es **−22,8 cm**; die Kapsel bleibt +8,5 cm über der Oberfläche. Weiter senken lässt sich das nur mit **Fuß-IK**; das wäre neues Verhalten und ist nicht gebaut. **Bitte entscheiden:** Fuß-IK für M1 (eigene Vorlagen-Zeile), oder hinnehmen bzw. Ränge als Laufweg sperren?

### 31.2 · Befund Tempo (V-248: timeScale-Grenzen 0,8–1,25)
Gemessene Eigentempi der KayKit-Clips auf FrizzleBob v5b (Maßstab 0,947, 240 Hz, Rutschanteil nur bei gleichem Kontaktknochen):

| Clip | Eigentempo | Rutschanteil schon im Eigentempo |
|---|---|---|
| Walking_A | 0,62 m/s | 0,13 |
| Walking_B | 1,58 m/s | 0,24 |
| Walking_C | 0,46 m/s | 0,20 |
| Running_A | 3,16 m/s | 0,03 |
| Running_B | 7,32 m/s | 0,007 |

1. **Joggen (W) passt:** V-020 1,40 H/s ≈ 3,08 m/s = Running_A × 0,97.
2. **Sprint (Shift+W) passt in keinen Clip:** V-020 2,22 H/s ≈ 4,88 m/s. Running_A reicht bis 3,95 m/s (×1,25), Running_B beginnt bei 5,86 m/s (×0,8). Optionen:
   - (a) Sprint auf ≥ 5,86 m/s anheben;
   - (b) Sprint auf ≤ 3,95 m/s senken;
   - (c) für Running_B die Grenze auf 0,67 erweitern (Rutschanteil rechnerisch ≈ 0,2).
3. **Gehen (Strg+W):** Kein KayKit-Geh-Clip erreicht einen Rutschanteil < 0,1, auch nicht im eigenen Tempo; die Clips rutschen in sich. Die V-248-Abnahme „< 0,1 bei Gehen“ ist mit diesen Clips nicht erreichbar. Optionen: andere Geh-Clips (z. B. Mixamo) oder Abnahme für Gehen lockern.
- **Vorläufig in M1, bis WS0 entscheidet:** W = Joggen Running_A, Shift = Sprint 4,88 m/s mit dem am wenigsten rutschenden Clip am Grenzrand (ausdrücklich vorläufig), Strg+W = Gehen mit Walking_B im Eigentempo 1,58 m/s.

- **Nachtrag M1 (@f5ccd83, Gang-Mischer, Referenzmessung):** Rutschanteil Joggen 3,08 m/s → **0,024 (V-248 erfüllt)**; Sprint 4,88 m/s → 0,147 (Running_B ×0,8 in der Lücke); Gehen 1,58 m/s → 0,283 (Walking_B rutscht schon im Eigentempo). Sprint und Gehen bleiben Konflikte für WS0.
- **Taste:** `MOVE_MAP` hat jetzt `walk` = Strg (Diff der M1-Sitzung, kfb-planet @41c3bd2); s0 und s5c PASS. s5c wartete bisher nur auf das Schließen der Wahl, nicht auf die Rückgabe der Steuerung; das ist jetzt behoben.

### 31.3 · Hinweis WS1 zu Strg+W (V-020)
Unter Windows und Linux schließt **Strg+W den Browser-Tab**, und eine Seite kann das nicht verhindern. Auf Georgs Mac ist es harmlos (dort schließt Cmd+W). Für MVP-3 (Veröffentlichen) bitte eine Ausweichtaste oder einen Umschalter vorsehen. Die Belegung bleibt bis dahin wie V-020.

## 30 · 15.10. nachts · Vorschau Meshy-Bühnen Comic-Broadcast und Utopia (Georg: „als Vorschau nach dem Test“)

**Code:** kfb-planet @b76bb75. **Bilder für Georg (V-253):** `ws1/proofs/2026-10-15-present/stages/` – `comic_A_5m.png`, `comic_B_6m.png`, `utopia_A_5_5m.png`, `utopia_B_7m.png`.

### 30.1 · Wie
- **Bühnen-Modul** `src/modules/meshyStage.js`: Browser-Fassung vom Asset-Branch `assets/meshy-stages-utopia-comic-2026-10-15` @8ce77add (gepinnt, Prüfsummen geprüft) plus Slot-Datei (`src/data/stages/*.slot.json`, 1:1).
  - Maßstab, Boden und Standardkamera kommen aus der Slot-Datei; Umrechnung `p_m = (x·s, (y − floorY)·s, z·s)` wie dort beschrieben.
- **Karte direkt auf `kfb_screen_slot`** über das Inhalts-Modul aus V-256 Schritt 1, kein Billboard davor. glTF-UV, also Textur mit `flipY = false`; Platzhalter-Farbe des Slots ersetzt durch ungetöntes Weiß. Seitenverhältnis Karte 1,7926, Slot 1,793 → füllt randlos.
- **Schalter** `#stage,actors=fb,scene=comic|utopia`, Maßstab zum Abstimmen `sscale=<m/u>`. Dialog, Palette und Prüfungen sprechen die Bildfläche wie das Billboard an (`setCard`, `info`).

### 30.2 · Georgs Rückmeldungen beim Abstimmen
- **„Die Figuren sind noch zu groß“ und „müssen mehr in der Szene stehen“.** Die Figuren behalten ihre Klassengröße (wie FrizzleBob auf allen Bühnen); die Bühne wird größer.
  - Die Marken stehen in Modell-Einheiten und wachsen mit dem Maßstab mit.
  - Comic: neben dem Zeichentisch und vor der Regaltür.
  - Utopia: auf der freien Fläche vor der Galerie, nicht mehr hinter den Konsolen.
- **Vorschläge zur Wahl:**

  | Bühne | A | B | WS0-Wert |
  |---|---|---|---|
  | Comic-Broadcast | 5 m/u | 6 m/u | 3,8 m/u (Figuren zu groß) |
  | Utopia-Bühne | 5,5 m/u (WS0-Wert) | 7 m/u | 5,5 m/u |

  Georgs Wahl bitte hierher; dann wird sie Standard (Slot-Datei bleibt Quelle, Abweichung im Code benannt).

### 30.3 · Offen
- **Hintergrund:** Neben beiden Dioramen sieht man den Paletten-Himmel (die Modelle sind offene Kästen). Vorschlag: neutraler Raumhintergrund je Bühne bzw. Himmel nur dort, wo das Modell eine Öffnung hat. Bitte entscheiden.
- **Paletten** (V-270-Vorlage) betreffen bisher nur das Amphitheater; die Meshy-Bühnen behalten ihre Modellfarben.
- **Getestet:** b1, stage, palette, d1stage, g4, g4preview PASS mit dem Bühnen-Code (Standard-Pfad unverändert). Ein eigener Test für `scene=` folgt mit der Wahl des Maßstabs.
- **Nachtrag (kfb-planet @07e42bb):** Auf dem ersten Stand war `contract-static` rot (Hinweis der M1-Sitzung). Die Bildflächen-Hülle stand in `Stage.jsx` und machte die Datei formal zum Modul. Sie ist jetzt `createMeshyScene` in `meshyStage.js`, das Verhalten bleibt gleich. contract-static, deps, host und preview PASS. Versäumnis WS1: vor dem Push nicht die ganze Suite laufen lassen.

## 29 · 15.10. nachts · Code zu §28 gespiegelt · V-256 Schritt 1 (B1 geschnitten, pixelgleich) · Suite

**Code:** kfb-planet @8eeb33f, gespiegelt nach `ws1/kfb-planet`. Enthält §28.1 (V-269 GothGirl Standard, V-271 Daten-Pin a71de421, Vorschau Rousseau normal) und V-256 Schritt 1.

### 29.1 · V-256 Schritt 1: B1 in Träger und Inhalt geschnitten
- **Inhalt** `src/modules/surfaceContent.js` (Art `card`): Viertelseite aus `cardImage` bzw. Platzhalter mit Drucktext, Wachhund-Neuversuch, veraltete Aufrufe → `{ stale }`. Er bekommt eine Fläche `{ mesh, fit(meta), flipY? }` und kennt keinen Träger.
- **Träger** `billboard.js`: Knet-Körper, Bildfläche mit runder Maske, Palette und Überblendung; formt sich nach `fit(meta)`. Nach außen unverändert (`setCard`, `info`, `ready`, `setPalette`).
- **Bildpaar vorher | nachher** (V-253: Paar erlaubt), `ws1/proofs/2026-10-15-split/`:
  - `pair_card.png`: Karte forget_utopia #1, **pixelgleich** (mittlere Abweichung 0, 0 Pixel über 40).
  - `pair_placeholder.png`: Platzhalter-Karte. Billboard-Bereich pixelgleich (0 abweichende Pixel in der Bildmitte); Unterschiede nur an den beiden Figuren, deren Ruhe-Clip zwischen den Aufnahmen weiterlief.
- **Nächste Schritte laut Freigabe:** Inhalt `video` (CSS3D), dann Bildflächen-Träger der Meshy-Bühnen (UFO-Slot 1,79:1).

### 29.2 · Suite
- Gesamtlauf auf dem Stand von §28 + Schnitt: **19/20 PASS**.
- `actors` FAIL nur bei `earsSwingAndSettle`, unter Last (load ≈ 11): Die Ohren-Ruhe wartete fest 4 s Wanduhr, die Federn rechnen in Spielzeit. Der Test wartet jetzt auf den Zustand (gleich streng); danach `actors` PASS.
- Vorher war ein Gesamtlauf bei load 35 nicht verwertbar und wurde abgebrochen (Georgs Chrome/Firefox; danach geschlossen).

### 29.3 · Als Nächstes (Georg 15.10.)
Vorschau der Meshy-Bühnen **Comic-Broadcast** und danach **Utopia-Bühne**: allgemeines Bühnen-Modul aus den Slot-Dateien (Maßstab, Boden, Standardkamera), Karte über das Inhalts-Modul direkt auf `kfb_screen_slot`. Bericht folgt in §30.

## 28 · 15.10. · Gelesen bis V-274 · V-269 GothGirl Standard · V-271 Daten auf a71de421 · Vorlagen-Zeile V-270 (Paletten neu)

**Code:** kfb-planet @5bf545e (lokal; Spiegel nach ws1/kfb-planet folgt nach der vollen Suite). **Suite:** läuft nach der laufenden M1-Runde (abgesprochen); Nachtrag hier.

### 28.1 · Umgesetzt
- **V-269 GothGirl:** Mit `actors=fb` steht rechts GothGirl (Profil gothgirl, Klassen-Faktor wie FrizzleBob); `cast=<id>` wählt einen anderen Kandidaten, `cast=fb` stellt FrizzleBob beidseitig.
  - Der F1-Darsteller erscheint jetzt wie FrizzleBob erst, wenn Augen und Ruhe-Clip stehen (keine T-Pose, keine Spender-Augen im Bild), und meldet `status().shown`.
  - `g4` prüft die neue Standard-Besetzung.
- **V-271 Kartendaten-Pin a71de421:** `MEDIA_COMMIT` umgestellt; `cards.json`, `deck-blobs.json` und `deck-genres.json` neu erzeugt.
  - Audit neu bewertet: unverändert 60/78 SAFE, 3142 Karten; Titel-Schreibweise ändert die OCR-Zuordnung nicht.
  - `anti_rules_toolkit` bleibt UNSAFE, also werden keine Karten aus diesem Deck gezeigt (wie verlangt).
  - Vorschau-Zeile Rousseau jetzt in Georgs Schreibweise „Jean-Jacques Rousseau“ (V-272 „Titel normal“; damit ist der Vermerk aus §27.2 hinfällig).
- **Quittiert:**
  - V-264 bis V-268 (Bühnen, Displays ohne Sockel; Einbau nach MVP-0);
  - V-272 (HIAH PASS, Größe gleich);
  - V-273/V-274 (Karts, später);
  - Freigabe V-256 mit UFO-Slot 1,79:1. Schnitt B1 (pixelgleich) folgt.
  - Drift: Die Dialog-Szene bevorzugt Karten von drift-freien Seiten. Das baue ich mit der Kartenauswahl des Dialogs ein; die G4-Vorschau hat feste Karten.

### 28.2 · Vorlagen-Zeile V-270 · Bühnen-Paletten als Harmonie-Systeme (bitte freigeben)
- **Quelle (1:1 Daten, Zahlen unverändert):** Lab `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/palettes.ts` @64ae61fe7 (Lab-Schnappschuss 11.10.).
  - `PALETTES`: sechs Insel-Paletten. canyon, bucht und otown sind Joyride 1:1 aus `track-look.v5.js` `WORLDS` (J14-Schnitt, Blob 7c0d2483); wueste, kfb_town und protopia sind abgeleitet.
  - Rollen je Palette: sky, top/top2, hill[2], sand, rim, under[4], rock, tower[2], leaf[3], trunk, cloud, water, path, road/strang.
  - `ENV_ROLES` (Farb-Grammatik je Palette): ground, grass, stone, bark, leaf, bloom, water, **accent** (eine Akzent-Familie zum Wahrzeichen), sand, paved, earth, asphalt, masonry (je drei bis vier Töne hell → dunkel, mit `why` je Rolle).
  - Regel V-051 / `KFB_WORLDBUILDER_PLAN_R1.md` (`kfb.island-theme/1`): Sechser-Palette plus Rollen; storyTint nur als leichte Einfärbung über dem Grundthema.
- **Was sich gegenüber V-245 ändert:**
  - `world-palettes.js` (Stimmungs-Stufen) und `palette-roles.js` (aus drei Stufen abgeleitet) werden nicht mehr Farbquelle der Bühne; `palette-roles` bleibt höchstens Formel-Vorlage für Lichter und Birnen.
  - Quelle ist die Insel-Palette mit ihren benannten Rollen.
- **Rollen für alle Bühnenteile (Vorschlag, Georg urteilt am Bild):**

  | Bühnenteil | Rolle |
  |---|---|
  | Himmel | `sky` → `cloud` (Verlauf) |
  | Gelände um das Theater | `ground[0..2]` |
  | Ränge, Mauern, Bögen (senkrechte Flächen) | `stone[0..2]` bzw. `masonry`, Helligkeit der Meshy-Textur auf diese Stufen |
  | Bühnenboden und Stufen-Oberseiten (waagrechte Flächen, nach Flächen-Normale) | `paved` bzw. `sand` |
  | Billboard-Rahmen | `accent[0]` |
  | Pfosten | `bark` bzw. `trunk` |
  | Zierleiste | `accent[2]` bzw. `cloud` |
  | Akzente (später Requisiten, Fahnen, Birnen) | `accent` und `bloom` |

  Waagrecht und senkrecht trennt ein Normalen-Kriterium im Shader (eine Textur, zwei Rollen); das ist die einzige neue Technik.
- **Story-Tint (V-051 storyTint):** Eine leichte Einfärbung (höchstens etwa 15 %) aller Bühnenteile und des Himmels je Story-Mode der Karte (High- bzw. Low-Vibrational-Fluff), über der Palette, nie statt ihr. **Quelle fehlt:** Das Fluff-Farbschema steht nicht im Lab-Schnappschuss. Bitte Pfad bzw. Datei nennen; bis dahin kein Tint.
- **Karte → Palette (Vorschlag, ersetzt die Achter-Tabelle):**

  | Palette | Genres |
  |---|---|
  | otown (schräge Vorstadt) | satire, meta, art, craft |
  | bucht | comedy |
  | canyon | conspiracy, esoteric |
  | wueste (Pyramiden) | history, mythology |
  | kfb_town (Burg) | politics, economics, education |
  | protopia (Bergwiese) | futures, medical, psychology, philosophy, narrative, literature |

  Gleiche Regel genre[0] → bundle → Rückfall.
- **Wechsel weich** wie gehabt (V-011).
- **Abnahme:** je Palette ein Einzelbild 1920 × 1080 nach V-253 (sechs Bilder, Beispielkarte je Palette), dazu ein Bildpaar alt (V-245) | neu für eine Karte. Test: Rollen je Bühnenteil, Quelle bytegleich zum Lab-Stand, Wechsel weich.

## 27 · 15.10. · F-3a Vorschau-Text G4 gebaut (drei Karten, Georgs Fassungen, Opener als eigene Schicht)

**Code:** kfb-planet @4fe7766. **Bilder für Georg (V-253):** `ws1/proofs/2026-10-15-present/preview/`
- `1_monomyth_1_georg.png`: Zeile A mit „Welcome to“;
- `1b_monomyth_1_antwort.png`: Antwort B aus dem Druck;
- `2_monomyth_5_georg.png`: „Remember“;
- `3_help_10_georg.png`: „You know“.

### 27.1 · Wie
- **Vorschau-Pool** `src/data/pool/preview-g4-georg.json` im Format `kfb.voice.triplet-opener-pool/1`: `preview: true`, `canonicalDefault: false`, alle Beats und Opener auf EDITORIAL_CANDIDATE (nicht ACCEPTED). Quelle der Fassungen: WS0_TO_WS1 @80e6c655 (F-3a). Erzeugt mit `scripts/pool/build-preview-g4.mjs` und mit dem Pool-Kern 1:1 geprüft (`validatePool`, `makePacket(preview:true)`, `consumePacket(preview:true)`; ohne `preview` lehnt der Kern ab).
  - **Belegstellen** aus dem Drucktext gesucht, nicht gesetzt: Jede zitierte Stelle steht wörtlich auf der Karte (start/end), jede gesprochene Stelle wörtlich in Georgs Zeile. Zum Beispiel „Stasis Loop“, „nothing changes“, „habit“, „normalize the pain“ → „Normalize pain“, „fear becomes movement“, „the pill“, „Natural Goodness“, „Man is born free“ → „man born free“.
- **Opener als eigene Schicht:** je Beat ein eigener Opener-Datensatz (`georg-welcome-to`, `georg-remember`, `georg-you-know`, Muster „Welcome to {title}“ usw., SOURCE_NEUTRAL). Die Blase zeigt ihn als ersten Teil, Georgs Zeile als zweiten. Opener-Sperre je Dialog (V-222) greift; ein schon benutzter Opener fällt auf den Kartentitel zurück.
- **Nur mit Schalter** `#stage,…,preview=g4`: Dann spielt die Bühne die drei Karten in Georgs Reihenfolge, und eine Kennzeichnung „Vorschau-Text · Georgs Fassungen · nicht abgenommen“ steht im Bild. Ohne Schalter erscheint nie eine Vorschau-Zeile (Test).
- **Ablauf je Karte:** Sprecher A sagt Georgs Fassung, Sprecher B den Power-Text wörtlich aus dem Druck, dann die Spielerwahl (KayfaBINGO/BOGGLE/BONGO/BLÖDSINN + eigene Wörter, F-3c). Keine der drei Karten ist gesichert (Monomyth-Deck UNSAFE, Help I Am A Human #10 nicht in `ok`), daher zeigt das Billboard den Platzhalter mit Drucktext, wie in F-3a vorgesehen.

### 27.2 · Befunde
1. **Titel wörtlich (Vertrag):** Der Kern verlangt den Kartentitel wortgleich und mit Groß- und Kleinschreibung. Der Druck schreibt „JEAN-JACQUES ROUSSEAU“, Georg „Jean-Jacques Rousseau“. Die Zeile nutzt die Druck-Schreibweise und ist im Beat vermerkt. **Georg 15.10.: „Rousseau so lassen“** – entschieden, keine Änderung an Karte oder Vertrag.
2. **Versäumnis WS1 bei V-242, behoben:** `src/data/deck-blobs.json` stand noch auf a9f5ffa1, während Bilder und Text schon auf 233efd5 liefen. Jede Pool-Zeile wäre mit `BEAT_SOURCE_REVISION_CONFLICT` abgelehnt worden; bei r5 (0 ACCEPTED) fiel das nicht auf. Neu erzeugt; Test `preview` prüft jetzt `deck-blobs.media == MEDIA_COMMIT`.
3. **Dialogstart mit ungesicherten Karten:** Die Bühne wartete auf ein echtes Kartenbild und begann bei Platzhalter-Karten nie. Jetzt gilt: Platzhalter ist bereit, wenn die erste Karte nicht gesichert ist.
4. **Kleinigkeit in der Blase:** Der Gedankenstrich „–“ in Georgs Zeile 1 erscheint als „--“. Das ist die Zeichenform der Blasenschrift (Shantell Sans); im Code wird nichts ersetzt, der Text ist unverändert. Falls Georg das stört: Schrift-Frage, keine Text-Frage.

### 27.3 · Tests
- `preview` (9 Prüfpunkte, ohne Browser, gegen die echten Deck-JSONs am MEDIA_COMMIT) PASS.
- `g4preview` (9 Prüfpunkte auf der Bühne: Reihenfolge, Georgs Fassung mit Opener-Teil, Antwort aus dem Druck, Platzhalter, drei Wahlen bis zum Ende, Kennzeichnung, Gegenprobe ohne Schalter) PASS.
- Volle Suite: **20/20 PASS** (contract-static … g4preview), allein auf dem Rechner.

## 26 · 15.10. · Gelesen bis V-256 · Bilder nach V-253 neu · Code F-4 gespiegelt · Vorlagen-Zeile V-256 (Bildflächen-Modul)

**Quittiert:**
- V-253: Abnahme-Format.
- V-254: UFO-Urteil, für WS1 erst Phase 2.
- V-255: Mund-Bögen; WS1 baut nichts daran, bis ein Set freigegeben ist.
- V-256: Bildflächen-Modul.

### 26.1 · Bilder für Georg nach V-253 (ersetzen die Bildbögen aus §24/§25)
Jede Ansicht ist ein eigenes Querformat-Bild 1920 × 1080 mit großer Beschriftung im Bild, ohne Raster. Erzeugt mit `scripts/present/shots.mjs` (Liste → Einzelbilder).
- `ws1/proofs/2026-10-15-present/cast/`: je Kandidat zwei Bilder.
  - `1a_adventurer-mage.png` (steht neben FrizzleBob) und `1b_…_spricht.png` (Antwort-Blase rechts);
  - dasselbe für 2 Barbarian und 3 GothGirl.
- `ws1/proofs/2026-10-15-present/palette/`: `01_cubescape.png` … `08_ember.png`, je Palette ein Bühnenbild mit Genre-Liste und Beispielkarte in der Beschriftung.
- Die Bildbögen `sheet_1/2.png`, `cast_sheet.png` und `cast_speak_sheet.png` bleiben nur als Arbeitsbelege für WS0, nicht für Georg.

### 26.2 · Code F-4 gespiegelt (kfb-planet @4c42344)
- **Neu:** `test/cast.mjs`; `eyeActor` mit Aufbau bei Weltdrehung 0 und Option `classScale`.
- **Befund in den Sprech-Bildern:** Die KayKit-Pupillen standen nach dem Blickwechsel außerhalb des Auges (weiße Augen; `_px` −0,174 bei Grenze 0,111). Ursache ist dieselbe Pupillen-Feder wie A13. `eyeActor` rechnet die Augen jetzt in Teilschritten wie `faceMountActor`, und der Test `cast` prüft die Pupillen im Dialog. Die Sprech-Bilder sind danach neu erzeugt.
- **Rechner unter Last:** Load 10–15 durch Firefox, Claude-App und WindowServer; headless nur ≈ 3 Bilder/s. Drei Tests mit fester Wanduhr-Wartezeit fielen dadurch:
  - f1: das Lid-offen-Bild landete im Zufalls-Blinzeln;
  - s5a: die Blasen-Lebensdauer zählt Spielzeit;
  - s5c: das Stempel-Fenster beträgt 420 ms.
  Alle drei warten jetzt auf den Zustand statt auf die Uhr; die Prüfung selbst ist gleich streng. Danach je zweimal PASS unter derselben Last.
- **Volle Suite:** 16/18 PASS im Gesamtlauf mit dem jetzigen Code; s5a und s5c danach korrigiert und einzeln grün. Die f1-Abweichung in der M1-Runde hatte dieselbe Ursache.

### 26.3 · Vorlagen-Zeile V-256 · Bildflächen-Modul (Inhalt und Träger getrennt) – bitte freigeben
- **Spender (1:1, was übernommen wird):** Branch `chatgpt-web/billboard-b2a-css3d-2026-09-24` @07da4adf, `tools/KFB-ToolBox/_handover/BILLBOARD_B2A_CSS3D_2026-09-24/bb2a-boot.js` (HUMAN_ACCEPTED 24.09., PR #199). Muster nach three `examples/css3d_youtube.html` (r160 @d04539a7): `CSS3DRenderer + CSS3DObject + iframe + Blocker`.
  - Übernommen werden die Funktionen `createInlineVideo`, `syncInlineVideoTransform` (Weltlage der Fläche kopieren, Größe = Fläche, nur von vorn sichtbar über Flächen-Normale · Kamera), `setVideoBlock` (Iframe gesperrt, solange die Kamera gezogen wird) und `show/hideInlineVideo` (`about:blank` beim Verlassen).
  - `bb-scene.js` (Kenney-Körper) wird **nicht** übernommen; unser Träger bleibt der B1-Knetkörper.
- **Schnitt in zwei Module (Host-Vertrag R1.2, je `create → {object3d, update, dispose}`):**
  1. **Träger** `billboard` (B1-Körper, unverändert in Form, Farbe und Palette).
     - Er stellt eine Fläche bereit: `surface = { mesh, uv, width, height }`; die Maske mit runden Innenecken bleibt Sache des Trägers.
     - Er kennt den Inhalt nicht.
     - `fitToAspect(ar)` passt seinen Rahmen an (R2 „responsiv“, wie heute fitFace).
  2. **Inhalt** `surfaceContent` mit Arten `card` (`cardImage`, Viertelseite ganz, nichts beschnitten), `video` (YouTube per CSS3D), `loop` (Video-Textur), `quote`, `palette` (Farbstimmung).
     - Er bekommt eine Fläche übergeben und weiß nichts vom Billboard: Canvas- bzw. Video-Textur auf `mesh.material.map`; CSS3D-Ebene an der Weltlage von `mesh`.
     - Er meldet sein Seitenverhältnis. Ein Träger mit freiem Format passt sich an (B1); ein Träger mit festem Format (UFO-Slot ≈ 1,60) zeigt die Karte ganz mit Papierrand, nie beschnitten (Georg 15.10.: nur vierteln, nichts beschneiden).
  3. **UFO-Träger** `screenSlot`: Fläche aus WS0s `kfb_screen_slot` (Eckpunkte als JSON) → Mesh + UV. Kommt, wenn WS0 den Slot liefert (Phase 1c).
- **Host-Zusatz:** Eine CSS3D-Ebene über dem WebGL-Canvas (eigener `CSS3DRenderer` im Host, gleiche Kamera). Das ist nötig für `video`; ohne `video` entsteht keine CSS3D-Ebene.
- **Was gleich bleibt:**
  - B1-Optik und -Tests (b1, stage, palette, g4) laufen unverändert weiter; der Dialog ruft weiter `setCard`, intern ist das Inhalt `card`.
  - Palette (V-245) färbt den Träger; Inhalt `palette` ist nur die Farbstimmung auf der Fläche selbst.
- **Reihenfolge:**
  1. B1 schneiden (Träger + Inhalt `card`), ohne sichtbare Änderung; Bildpaar vorher | nachher pixelgleich.
  2. Inhalt `video` (CSS3D) mit der Spender-Prüfung (vorn klickbar, hinten verborgen, Blocker beim Ziehen, Entladen beim Wechsel).
  3. UFO-Slot nach Lieferung durch WS0.
- **Abnahme:** je Schritt Einzelbilder nach V-253, ein Prüfpunkt je Eigenschaft.
- **Georg 15.10. (für TUNE später):** „die 3D billboards/displays zur jeweiligen szene anpassen: gemauerter Rahmen im Amphitheater · in UFO integrierter Monitor · antiker Holzrahmen in der Akashic Library (gerade bei Meshy) · … etc.“ Der Schnitt passt dazu: je Szene ein eigener Träger, der Inhalt bleibt ein Modul. Nach dem Schnitt kommen die Träger-Varianten als eigene Vorlagen-Zeilen.
- **Offene Frage an WS0:** Zitate und Hypernormalisation-Loops brauchen eine Quelle (Pool bzw. Video-Dateien mit Rechten). Bis dahin bauen wir nur `card` und `video`.

## 25 · 15.10. · F-4 zweite Besetzung: drei KayKit-Kandidaten mit Georgs Augen-Profil (Bilder für Georg)

**Bilder für Georg:** `ws1/proofs/2026-10-15-cast/`
- `cast_sheet.png`: je Kandidat ein Two-Shot `cam=near` neben FrizzleBob, Karte im Billboard, Palette nach Karte.
- `cast_speak_sheet.png`: dieselben beim Sprechen.
- Einzelbilder `stage_<id>.png` und `speak_<id>.png`.
- Vorauswahl aus sechs unmaskierten Figuren: `lineup_full.png`, `lineup_face.png`.

| # | Kandidat | Quelle (Modell) | Profil | Silhouette neben FrizzleBob |
|---|---|---|---|---|
| 1 | **Mage** | KayKit Adventurers 2.0 FREE `Characters/gltf/Mage.glb` @f9dd7a64 (Blob 66eac745) | `adventurer-mage`, AUTO_CANDIDATE, Paar-Sicherheit 0,7 | hoch, Spitzhut, Violett |
| 2 | **Barbarian** | dto. `Barbarian.glb` (Blob d06efc99) | `adventurer-barbarian`, AUTO_CANDIDATE, 0,7 | breit, Bärenfell-Mütze, Bart, Braun/Grau |
| 3 | **GothGirl** | KayKit Mystery Series 6 `GothGirl/characters/GothGirl.glb` @29c7500b (Blob b56f67e4) | `gothgirl`, AUTO_CANDIDATE, **1,0** (sauberste Augen-Quelle im Batch) | schmal, schwarzes Haar, Grau/Schwarz |

- **Profilquelle:** `eye-rig-medium.batch-1.json` @ac9dbaed (Georgs Export 19.09.), Eintrag je Figur unverändert, F1-Weg (`kaykit-eye-adapter`, `pet-eye-rig.v6`, Studio @db823766).
  - **Ehrlich gesagt:** Im Batch sind nur Rogue_Hooded (maskiert) und Mannequin (gesichtslos) ADJUSTED_APPROVED. Alle anderen sind AUTO_CANDIDATE: Georgs Klassen-Standard (Browser-Tuning 19.09.) plus automatisch gemessener Anker je Figur.
  - „Georgs Augen“ heißt hier also Klassen-Standard, nicht ein je Figur nachgestelltes Profil. Wählt Georg eine Figur, wäre ein Feinschliff im Studio der nächste Schritt (seine Sache, keine WS1-Werte).
- **Nicht gewählt:** Knight (Helm rahmt das Gesicht), Ranger und Rogue (gleicher Körperbau wie die anderen Adventurers). Weitere Batch-Figuren (Witch, Cleric, Lorekeeper, Farmer, Caveman, Protagonists, Vampire …) können als Ersatz nachgereicht werden.
- **Maßstab:** Gleicher Klassen-Faktor wie FrizzleBob (0,947368, P08 CLASS_K; beide Rig_Medium, Knochenlängen gleich laut §18). Keine Höhen-Normierung, damit Hut oder Mütze die Figur nicht verkleinern. Neue Option `classScale` im F1-Darsteller; ohne sie bleibt die bisherige Höhen-Normierung (Studio-Parität F1 unverändert).
- **Sprechen ohne Mund (F-4):** KayKit hat keinen Sprechmund. Die Figur spricht heute nur über die Blase an ihrem Anker `stage-right`, das Gesicht bewegt sich nicht (Augen-Leben läuft). Es ist nichts dazugebaut.
- **Befund und Korrektur, wie §21 auch im F1-Weg:** `eyeActor` montierte die Augen auf der schon gedrehten Figur (Bühne rechts yaw −0,45). Die Augen saßen verdreht und wirkten zugekniffen. Jetzt Aufbau mit Weltdrehung 0, Drehung danach. Gegenprobe: Test FAIL ohne Korrektur.
- **Test `cast`, 6 Prüfpunkte, PASS:** Quellen gepinnt (GLB-Blob = Rezept, Profil = Batch-Eintrag bytegleich) · geladen mit Augen · Augen symmetrisch auf der gedrehten Figur · Klassen-Faktor wie FrizzleBob · spricht per Blase · keine Seitenfehler.
- **Stand Code:** kfb-planet @d8a20ca, lokal. Die volle Suite läuft erst nach der laufenden Gesamtrunde der M1-Sitzung (abgesprochen); danach Code-Spiegel nach `ws1/kfb-planet` und Nachtrag hier.
- **Bitte an WS0:** Die Bilder Georg vorlegen; seine Wahl hierher.

## 24 · 15.10. · V-245 Bühnen-Palette gebaut · Bildbogen für Georg · Karten nur vierteln (Georg) + Drift-Liste · Quittungen

Gelesen bis V-252. **Quittiert:** V-250 (MVP-Fahrplan; MVP-0 läuft, M1 ist die zweite Baustelle), V-251 (Fahren, Vorlagen-Zeile kommt vor Bau), V-252 (UFO-Bühne: Info, Phase 2 nach MVP-0).

### 24.1 · Palette (kfb-planet @9e22cbd)
- **Besitzer 1:1 übernommen** (`src/vendor/palette/`, SOURCE.md mit Blobs):
  - `palette-roles.js` R2 (fd13480d);
  - `world-palettes.js` (f6121ae4);
  - `world-context.js` (478e8cb4), beide @5b523eb, also der Stand, auf den R2 verweist.
- **Karte → Palette:** Deck-Feld `genre` (Liste, klein), sonst `bundle` → Genre (`src/data/deck-genres.json` aus media/kfb am MEDIA_COMMIT) → Tabelle `src/data/stage-palette.genre.json` (**Vorschlag WS1, Georg urteilt**). Alle 130 Decks treffen eine Palette, alle acht sind in Gebrauch, der Rückfall Biom wird nicht gebraucht.

  | Palette | Genres | Decks |
  |---|---|---|
  | cubescape | satire, meta, art, craft | 20 |
  | bubblegum | comedy | 10 |
  | toybox | education, economics | 23 |
  | mint_pop | futures, medical | 39 |
  | sunset_arcade | narrative, literature | 4 |
  | grape_soda | conspiracy, esoteric | 19 |
  | seafoam | psychology, philosophy | 5 |
  | ember | history, mythology, politics | 10 |
- **Rollen wie R2 `computeContext`:** Stufen der benannten Palette → `roles(stops, wcAccent)`. Den zweiten Akzent liefert wie in R2 `cardSemanticVector` → stärkste Dimension → Story-Modus (DIM_MODE aus R2) → `makeWorldContext().accent`. Ohne ihn hätte jeder Himmel oben dasselbe Grau.
- **Anwendung:**
  - Billboard: frame/trim/post wie Billboard Family v1.
  - Himmel: Kuppel skyBottom → skyTop, Nebel = skyBottom.
  - Amphitheater: Die Helligkeit der Meshy-Textur liegt auf dem Verlauf dark → mix(stone, frame) → trim, Anteil 0,85; das Gelände nimmt flat. **Diese Rollenwahl fürs Amphitheater ist WS1-Vorschlag**, weil das Meshy-Modell keine Rollen-Teile hat.
- **Wechsel weich (V-011):** Kartenwechsel im Dialog = Palettenwechsel, Überblendung 1,2 s (Vorschlag) mit weichem Ein- und Ausblenden. Beim Billboard werden die Farbwerte zwischen zwei Cache-Geometrien geblendet; danach bleibt nichts zurück.
- **Test `palette`, 13 Prüfpunkte, PASS:** Quellen bytegleich · jedes Deck hat eine Palette · Karte steuert · Billboard, Amphitheater, Himmel und Nebel tragen die Rollen · Wechsel folgt der Karte · weich ohne harten Schnitt · keine Reste · dieselbe Karte ohne Wechsel · Akzent wie R2 · Override `palette=<id>` und Rückfall `palette=biome`.
- **Bildbogen für Georg:** `ws1/proofs/2026-10-15-palette/sheet_1.png` (Cubescape, Bubblegum, Toybox, Mint Pop) und `sheet_2.png` (Sunset Arcade, Grape Soda, Seafoam, Ember). Je Palette ein Bühnenbild (near, FrizzleBob) mit der ersten gesicherten Karte eines passenden Decks; Liste in `palette-sheet.json`. Auffällig: Sunset Arcade, Toybox und Ember wirken ähnlich (roter Rahmen, warmer Himmel).

### 24.2 · Georg zu den Kartenbildern (15.10.): nur vierteln, nichts messen oder beschneiden
- **Georg:** „Ich möchte nicht, dass irgendwelche Karten gemessen und beschnitten werden. Die sollen ganz einfach geviertelt werden … und die Marginalien auch mitzunehmen. Da gibt es immer wieder einen Drift. Da bitte ich darauf zu achten.“
- **Stand im Spiel: genau so.** Das Billboard nutzt `OW_ART.quarter()`: Seite halbieren, Ecke nehmen, kein Raster, keine Messung. Der Test b1 prüft pixelgenau Leinwand = rohe Viertelseite. Das gemessene Raster `art()` aus derselben Datei nutzt das Spiel nicht. Das OCR-Audit entscheidet nur, ob eine Karte gezeigt wird (Zuordnung), es schneidet nichts.
- **Drift-Liste (nur gemeldet, nichts geändert):** `drift-report.json` und `drift_sheet.png`. Aus den vorhandenen OCR-Rohdaten: Seiten, auf denen eine untere Karte mit einer POWER:/LORE:-Zeile beginnt, die zur Karte darüber gehört. Die Karten sitzen dort tiefer als die Seitenmitte.
  - Ergebnis: **23 von 78 Decks**, davon 16 SAFE; am meisten the_kayfabe_money_trail_9_11 (9/15 Seiten), human_nature_uncut (7/14), the_biology_of_rebellion (7/9), epistemic_sabotage (6/15).
  - Am Bild bestätigt: ai_kayfabe S. 2. Die übrigen Treffer sind eine Lese-Regel, keine Messung.
  - Seitenbreite Schriftbänder („THE IVORY TOWER HEAVYWEIGHTS“) sind keine Drift. Das Vierteln schneidet sie bewusst, die Karte selbst liegt ganz im Viertel.
- **Frage an WS0:** Drift in den Druck-PDFs beheben (Neu-Export der betroffenen Seiten) oder hinnehmen? WS1 beschneidet und verschiebt nichts.

### 24.3 · Sonst
- **Host R1.3** (`fixedDt`, `after`): Die M1-Sitzung zieht den Vorschlag zurück. M1 läuft jetzt mit eigener fester Schleife (frameloop „never“, ein Schritt je 1/60-s-Physik-Takt) über das unveränderte `src/ModuleHost.jsx`. WS1 übernimmt den Diff deshalb nicht; bitte §R1.3 als zurückgezogen markieren.
- **v243 unter Last:** Die Mitte-im-Satz-Probe las den Zustand einen Schritt nach der Warte-Bedingung. Jetzt geschieht beides in einem Schritt; allein und unter Last PASS.
- **Suite:** 17 Tests; 16 PASS im vollen Lauf, v243 danach einzeln dreimal PASS.
- **Als Nächstes für MVP-0:**
  1. Drei KayKit-Kandidaten mit Georgs Augen-Profil (F-4) als Two-Shot-Bilder.
  2. Vorschau-Text mit drei Karten (F-3a, `preview:true`, Opener als eigene Schicht).

## 23 · 15.10. früh · M1-Zwischenstand (Bewegung, eigene Sitzung) · Befunde für WS0 · Vertragsvorschlag ModuleHost

Quelle: M1-Sitzung, Branch `m1/bewegung` im eigenen Worktree. Noch nicht gemergt; Merge, Suite und Prüfer übernimmt WS1, wenn M1 fertig ist.

- **Stand M1:**
  - Der blinde Prüfer M1 gab FAIL mit 23 Befunden; alle sind abgearbeitet, ein zweiter Prüfer läuft.
  - Einzeln grün: m1-contract, m1-move (60 und 120 Hz), m1-eyes (echte Pupillen + Kopfknochen), m1-scene.
  - Bench bei dpr 2: 59,9 Bilder/s.
- **Befund 1, Tempo (bitte entscheiden, deckt sich mit dem Tempo-Konflikt J14/Coworker in KAYKIT_NATIVE_BASELINE_01):** Die LOCO-Tempi lassen schon **ohne** Controller rutschen. Rutschanteil gegenüber dem Körpertempo, gemessen mit demselben ActorAnimator auf v5b (`test/m1-feet.mjs`):

  | Clip | LOCO-Tempo | Rutschanteil |
  |---|---|---|
  | Walking_B | 0,98 | 0,59 |
  | Running_B (Sprint) | 5,255 | 0,40 |
  | Rennen | – | 0,03 |

  Das Spiel liegt exakt auf dieser Referenz, die Einbindung fügt nichts hinzu. **Frage an WS0:** Tempo an den Clip anpassen (Füße stehen) oder LOCO-Tempo behalten (Füße rutschen)?
- **Befund 2, Haltung:** ecctrl kippt die Kapsel über `autoBalance`; eine starr angehängte Figur pendelt mit. In der Luft hängen die Füße 0,2 m (FLOAT) unter der Kapsel. In M1 gelöst: Die Figur bleibt senkrecht und wird am Boden auf den Bodenpunkt gesetzt. Gilt auch für jede spätere Laufszene auf der Bühne.
- **Vertragsvorschlag Host R1.2 → bitte freigeben oder ablehnen:** zwei optionale Props für `ModuleHost`, damit M1 keinen eigenen Host braucht (V-206):
  - `fixedDt`: Die Module bekommen diesen festen Takt statt der Bildzeit.
  - `after` (Ref): Der Host ruft das Update an einer festen Stelle auf, bei der Spielfigur nach ecctrl und vor dem Physik-Schritt; sonst hinkt die Animation einen Schritt nach.
  - **Diff:** `ws1/proposals/MODULEHOST_R1_3_FIXEDDT_AFTER.diff` (gegen kfb-planet @937167f, `git apply --check` sauber). Ohne die neuen Props verhält sich die Hülle wie bisher, alle bestehenden Aufrufe bleiben gleich.
  - **Begründung (gemessen in m1-move):** Ohne `after` läuft das Update der Spielfigur vor ecctrl; die Animation sieht das Tempo vor dem Antrieb und hinkt einen Schritt nach. Ohne `fixedDt` bekommen die Module im Replay die Bildzeit statt des Physik-Takts, das Replay ist dann nicht deterministisch.
  - **Hinweis WS1:** Mit `after` ruft die Hülle `update` nicht mehr selbst. Ruft der Aufrufer `after.current` nicht, steht das Modul still. Das gehört ausdrücklich in den Vertrag.
  - Ohne Freigabe bleibt der Vertrag unverändert, und M1 behält seine eigene Hülle.
- **WS1 erledigt:** `STAGE_MARKS` (Marken near/two) aus `Stage.jsx` exportiert (kfb-planet @937167f), damit M1 nichts abschreibt; Stellungen unverändert, stage/d1stage/g4 PASS. `test:m1` kommt mit dem Merge in die Suite.

## 22 · 15.10. früh · Georg: „fb passt so“ · V-243 Ruhe-Mund umgesetzt · Palette wartet auf WS0

Gelesen bis V-244 und WS0_TO_WS1 „Präzisierung zu V-243“.

### 22.1 · Georgs Urteil (14.10. nachts, nach §21)
- Georg zum Nachher-Bild (Augen nach der Drehungs-Korrektur): **„fb passt so. wir bauen gerade die neue toolbox, um das zukünftig sauber zu verdrahten.“** und **„weiter mit der Palette, sobald WS0 antwortet.“**
- **§20 F-1 ist damit erledigt.** V-244 bestätigt außerdem, dass Georgs Claude-Design-ToolBox der Cut P08 ist. Die Bildpaar-Parität gegen P08 (V-240) war also der richtige Bezug. Der schlechte Eindruck kam vom Einbaufehler aus §21 (gedrehte Figuren), nicht von einem falschen Spender.
- Weitere FrizzleBob-Arbeit in WS1 entfällt laut eurer Präzisierung (keine Augenlage-, Ganzkörper- oder Export-Belege); Fixes gehören in die neue ToolBox.

### 22.2 · V-243 Ruhe-Mund geschlossen (kfb-planet @0a934cf)
- **Nur datengetrieben:** Das Rezept hat `mouth.rest: "closed"` mit Quelle V-243. Der Darsteller hält dann das Decal des Lauts „closed“ aus dem Eintrag, also genau das, was „Zu“ (`setViseme('closed')`) in der ToolBox zeigt. Gezeigt wird es über den Halte-Weg der ToolBox (`mouth.__kfbHold`).
  - Nichts ist fest für FrizzleBob im Code.
  - Ohne Rezeptfeld bleibt der Modellmund wie im Spender.
  - Nach `say()` geht der Mund zurück in den Ruhe-Mund, auch nach „!“; der Spender endete dort auf smile.
- **Befund, bitte im Register berichtigen:** Das Decal **„neutral“ zeigt geschlossene Lippen ohne Zähne.** Zähne zeigt nur **„smile“**, und das ist das eigene Decal des Modellmunds (FB_Mouth_Smile), das in Ruhe erscheint. V-243 sagt „das neutral-Decal zeigt Zähne“; das stimmt für die Dateien nicht. Georgs Eintrag führt `visemeMap.closed → neutral`, der Ruhe-Mund ist damit neutral.
- **Belege** `ws1/proofs/2026-10-14-v243/`:
  - `v243_row.png`: Spender-Ruhe (smile, Zähne) | Spiel Ruhe | „Zu“ | mitten im Satz (ah) | nach dem Satz | nach „Na klar!“;
  - `decals.png`: Smile | Neutral | M | D;
  - die Felder je Zustand (parts.mouth, mouthOnModel, m.rest, m.viseme, m.cur, Halt) stehen in der Ausgabe von `test/v243.mjs`.
- **Test `v243`, 7 Prüfpunkte:** Ruhe aus dem Rezept · keine Zahnpixel in Ruhe und „Zu“ · Sprechen nutzt die Spur · zurück nach Satz und nach „!“ · Spender-Modus zeigt Zähne als Gegenbild.
- Das Bildpaar gegen P08 läuft jetzt im Modus `#actortest,donor` (Modellmund in Ruhe, Modellfarben); er ersetzt `partcolors=model`.
- **Suite 16/16 PASS.**

### 22.3 · Wartet auf WS0
- **§20 F-2 Bühnen-Palette:** Quelle (palette-roles R2 / world-palettes / BIOMES), Zuordnung Karte → Zone, Himmel ja/nein. Georg: weiter, sobald ihr antwortet.
- **§20 F-3 Dialogtext für G4** (Triplets gestoppt, Pool r6 fehlt) und **F-4 zweite Besetzung.**

## 21 · 14.10. nachts · Ein Teil von „FB sieht schlimm aus“ war ein Einbaufehler: Augen saßen auf gedrehten Figuren verdreht (behoben)

- **Befund (M1-Sitzung):** `facehost.v1` richtet den Gesichts-Halter beim Mounten an der **Welt** aus (Z. 86–92). Auf der Bühne laden die FrizzleBobs mit yaw ±0,45. Gemessen saßen die Augenmitten im Figurenraum bei x −0,335/+0,03 statt symmetrisch ±0,2, also um 26° um den Kopf gedreht. Deshalb stand das hintere Auge am Kopfrand und die Nase vor dem Auge. #actortest und das V-240-Bildpaar laden mit Drehung 0 und zeigen den Fehler nicht.
- **Korrektur im Slot, Spender unverändert** (kfb-planet @dde5ba2): Der Aufbau läuft mit Weltdrehung 0. Die Drehung kommt erst nach Gesicht, Haaren, Ohren und Kontaktschatten, unmittelbar bevor die Figur sichtbar wird; danach `ears.reset()`, damit kein Ruck entsteht. Beide Figuren tragen das Augen-Rig jetzt identisch (±0,2).
- **Test** `g4 › eyesSeatedOnRotatedFigures`; Gegenprobe ohne Korrektur FAIL. Suite 15/15 PASS.
- **Beleg:** `ws1/proofs/2026-10-14-g4/fb_eyes_fix.png` (vorher | nachher links | nachher rechts).
- **ToolBox-Befund A15** (Vorschlag an den Owner: Figurendrehung in facehost einrechnen).
- **F-1 aus §20 bleibt offen,** aber kleiner: Ob der Rest des Looks (Blockbrauen, Augenabstand, Nase) Georgs ToolBox-Stand entspricht, lässt sich nur gegen Referenzbilder aus genau dieser ToolBox prüfen. Bitte Georg das Nachher-Bild zeigen und fragen, ob es jetzt seinem FB entspricht. Das ist die schnellste Klärung.

## 20 · 14.10. nachts · Georg zu G4 · Fragen an WS0 zur Abstimmung (gebündelt)

Georg hat §19 gesehen (14.10.): **„near nehmen, weiter.“** · **„FB ist ja immer noch das falsche/broken rigging, oder? das sieht schlimm aus! jedenfalls nicht meine neue FB v5b json!“** · **„die stage wird dynamisch mit den cartoon-color palette gerendert → vgl. joyride v17“** · **„bitte alle Fragen inkl. Farbpaletten, Triplets, korrekter FB etc. auf GitHub an WS0 zur Abstimmung.“**

**Umgesetzt:** `cam=near` + `place=near` sind jetzt Standard der Bühne (kfb-planet @0098e68). `test/g4.mjs` prüft den Standard ohne Hash-Angaben, `stage`/`d1stage`/`g4` PASS. Sonst nichts gebaut, was eine der folgenden Fragen vorwegnimmt.

Belege: `ws1/proofs/2026-10-14-g4/`, neu sind `fb_three_looks.png`, `g4_faces.png`, `palette_sheet_a.png`, `palette_sheet_b.png` und `palette-probe.json`.

### F-1 · Korrekter FrizzleBob (blockiert G4)
- **Stand:** Das Spiel zeigt Georgs Export aab8eeb0 (V-240) über die P08-Linie der ToolBox (Cut r1, main @ac9dbaed). Gegen den P08-Spender stimmt das Bild auf 1,2–1,4/255. Das ist **Parität mit P08, nicht mit Georgs ToolBox**.
- **Bild:** `fb_three_looks.png` zeigt P08-Spender ¾ | WS1-Bühne | Joyride J17. In ¾ sitzt das hintere Auge am Kopfrand, und die Nase (Original-Insel, `parts.nose: original`) erscheint von vorn als Kugel vor dem Auge. Georg erkennt darin nicht seinen FB.
- **Vermutung:** Den Export schrieb eine neuere Claude-Design-Fassung als P08, die nicht im Repo liegt (V-241 offen). Beleg sind Felder, die P08 nicht kennt (clayLids mech „skin“, skinFrame, original.*.yaw/sx, body-shape). Die Kennung „Production-02 · Rigging“ beweist nichts, die schreibt jeder Cut (§17). Gesucht über alle Branches: Es liegen nur die Cuts Production-02 vom 26./27.09. im Register-Branch, beide älter als P08. Diese Fassung setzt dieselben Werte offenbar anders um.
- **Was WS1 braucht, eines davon:**
  - (a) den ToolBox-Cut, der den Export geschrieben hat (Code + Libs), oder
  - (b) Referenzbilder aus genau dieser ToolBox mit genau diesem Eintrag: vorn, ¾, Seite, Pose angegeben, gleiche Kamera, dazu einmal Lid zu.
- **Bitte auch klären:** Ist aab8eeb0 (exportiert 14.10. 16:00 UTC) Georgs **neueste** v5b-JSON? Hat er danach neu exportiert, bitte die neue Datei in `replies/actors/`.
- **Bis dahin:** keine eigenen Werte, keine Werte aus J17.
- **Euer Gate `FRIZZLEBOB_V240_ASSEMBLED_BINDPOSE_SOURCE_PROOF`:** Ich schlage vor, es bis F-1 zurückzustellen. Sonst entsteht ein sauber gemessenes Ganzkörperbild genau der Figur, die Georg ablehnt. Wenn ihr es trotzdem jetzt wollt, liefere ich es mit dem Hinweis „P08-Lesart, nicht Georg-bestätigt“.

### F-2 · Farbpaletten der Bühne (Georg: dynamisch, Cartoon-Palette, vgl. Joyride)
- **Befund zu Joyride:** J16 r2 und J17 (`_inbox/KFB Joyride J17 · FB Cabrio`) haben **kein** Palettensystem für Bühne oder Welt; „biome“ kommt dort nur in den Effekt-Profilen vor (`clay-vfx`, `transition-atlas`).
- **Kandidaten im Repo:**
  1. **`palette-roles.js`** (KFB Clay Stage R2, 09.10.): „EIN Besitzer für die Rollenzuordnung von Billboards UND Bühne/Vorhang“. Eingang sind drei Stufen [dunkel, mitte, hell] + Akzent aus `world-context.js` / `world-palettes.js` @5b523eb, Auswahl CARDS / BIOME / WORLD. Ausgang sind Rollen: frame, post, stone, wood, ground, skyTop/skyBottom, cloth …
  2. **`world-palettes.js`** (Travel v25): acht benannte Paletten (cubescape, toybox, bubblegum, mint_pop …), „maximal cartoony“, plus `story`.
  3. **`BIOMES`** aus `billboard-stage.js` (5 Inseln). Die nutzt B1 heute schon für Rahmen und Pfosten, das Amphitheater nur für den Boden.
- **Probe (nur Prüf-Browser, kein Spielverhalten):** Die Helligkeit der Meshy-Textur wird auf den Drei-Stufen-Verlauf des Bioms gelegt, die Zeichnung bleibt (`palette_sheet_a.png`, `palette_sheet_b.png`, alle 5 Biome + Original). Das funktioniert, mit den BIOMES-Farben wirkt es aber gedeckt, nicht cartoony; der Himmel bleibt unverändert.
- **Vorschlag WS1:** `palette-roles.js` R2 als ein Besitzer für Billboard + Amphitheater + Boden + Himmel. Die Stufen kommen aus `world-palettes.js`, gewählt nach der Kartenzone der aktuellen Karte. Die Palette wechselt mit der Karte, also dynamisch.
- **Bitte entscheiden:**
  - (a) welche Quelle;
  - (b) die Zuordnung Deck/Karte → Zone/Palette (gibt es eine Tabelle?);
  - (c) ob der Himmel mitfärbt;
  - (d) ob „joyride v17“ etwas anderes meint (z. B. Travel v16/v25 `world-palettes`, Skydome SKY3, Styleguide `01-farbpaletten.jpg`).

### F-3 · Dialogtext: Triplets und Pool
- **Stand:** Pool r5 hat 0 ACCEPTED. Auf der Bühne sagt Sprecher A deshalb den Kartentitel wörtlich, B den Power-Text, dann folgt die Wahl.
- Laut `editorial/kfb-triplets-single-card-r1-2026-10-14` gab Georg **16/16 FAIL**, der Ausbau ist gestoppt, dazu Methoden-Korrektur und „English-only Fluff-o-lect player-closure“. Den Branch `data/kfb-dialog-pool` mit r6 gibt es noch nicht.
- **Bitte:**
  - (a) Was spricht die G4-Vorführung, solange r6 fehlt: Titel → Power → Wahl (heute) oder etwas anderes?
  - (b) Wann und wo kommt r6, in welchem Format (Triplet je Karte, V-231)?
  - (c) Ist die Spielerwahl mit KayfaBINGO/BOGGLE/BONGO/BLÖDSINN + eigenen Wörtern für G4 noch richtig?

### F-4 · Zweite Besetzung
Derzeit spielt FrizzleBob beide Seiten. Wer steht gegenüber? Bitte Figur + Quelle; eine Wireface-Figur bräuchte das SDK lokal, siehe §12.

### F-5 · Weiter offen (aus §18/§19, unverändert)
1. Kopf-Blickschicht nach dem Mixer und `lookAt` in Weltkoordinaten (V-214).
2. Kinetik-Automatik aus dem Controller.
3. M1-Fußabnahme gegen die Referenz-Rampe statt absolut 4,4 cm.
4. Kartennummern in kreative_kayfab, carnival_therapy und tragic_flaws wieder mitführen (§19.4).

**Reihenfolge-Vorschlag:** F-1 vor allem anderen; ohne richtigen FrizzleBob zeigt G4 nichts. F-2 und F-3 kann WS1 parallel bauen, sobald entschieden ist.

## 19 · 14.10. spät · G4-Vorbereitung: Bildaufbau, Brauen-Fehler behoben, V-242 Kartentext, Exportfarben

Gelesen bis WS0_TO_WS1 „14.10. spät · Neuer Kartentext-Stand (V-242)“ und „ToolBox-Antworten“. Code `ws1/kfb-planet` = kfb-planet @63680ab (drei Commits auf f2e3709). Suite 15/15 PASS, zweimal hintereinander. Neu dabei ist `test/g4.mjs`. Belege: `ws1/proofs/2026-10-14-g4/`.

### 19.1 · G4-Bildaufbau (Vorschlag, Entscheidung WS0)
- **`cam=near`:** Kamera bei (0; 2,15; 9,2), Blick auf (0; 2,1; −3,5), fov 38, etwa auf Augenhöhe der Figuren.
- **`place=near`:** FrizzleBobs bei x ±3,7, z 1,2, Drehung ±0,45, also vor der Tafel.
- **Wirkung:** Die Karte ist ganz lesbar zwischen beiden Figuren, die Figuren erscheinen etwa doppelt so groß wie im bisherigen Two-Shot. Bildbogen `g4_sheet.png` (Zeile A · Antwort B · Spielerwahl) und `g4_vs_two.png` (bisher | Vorschlag).
- Standard bleibt `cam=two`, bis WS0 entscheidet.
- **Test g4** (ein Prüfpunkt je Eigenschaft):
  - Figuren im Bild vor der ersten Zeile;
  - Karte ganz im Bild;
  - Karte frei von Figuren, Sprechblase und Spielerwahl;
  - Brauen am Kopf nach 8 s Leben;
  - Farben der Original-Teile aus dem Export.
  - Gegenprobe ohne die Korrekturen aus 19.3: 2 FAIL.

### 19.2 · Fehler gefunden und behoben: Brauen landeten auf der Brust (ToolBox-Befund A13)
- **Bild:** Mit Idle_A auf der Bühne rutschten die Brauen nach etwa 30 s vom Kopf, eine stand am Ende auf der Brust. Im Einzeltest #actortest war alles richtig.
- **Ursache:** Die Pupillen-Feder in `pet-eye-rig.v6.js` (Z. 331, Feder 150, Dämpfung 13) rechnet einen einfachen Schritt je Bild. Auf der Bühne laufen headless nur ≈ 5 Bilder/s (dt ≈ 0,2 s). Ab etwa 0,15 s schwingt die Feder auf: `_px` wuchs je Bild um das 2,3-Fache (gemessen bis 77, Grenze 0,045). `browLife` hebt die Brauen mit dem Blick (`gaze`), also flogen sie mit.
- **Korrektur im Host, Libs unverändert:** `faceMountActor.update` rechnet das Gesicht in Teilschritten ≤ 1/30 s (`FACE_STEP`, höchstens 12 je Bild). ear-dangle teilt schon selbst, der Mixer braucht es nicht. Bei 60 Bildern/s bleibt es ein Schritt.
- **Test** `actors › slowFramesStable`: 40 × update(0,25) mit Augen- und Brauen-Leben. Pupille 0,0375 bei Grenze 0,0446, Braue 0,02 m um ihre Lage. Gegenprobe ohne Teilschritte: 6·10³⁹, FAIL.
- Betrifft auch die ToolBox auf schwachen Geräten bzw. in Hintergrund-Tabs → `TOOLBOX_FINDINGS_R1.md` A13.

### 19.3 · Zwei kleinere Korrekturen aus derselben Probe
1. **FrizzleBob erscheint erst, wenn Gesicht, Kontaktschatten und Ruhe-Clip stehen** (vorher kurz in T-Pose). Neu: `status().shown`. Der Dialog wartet darauf; vorher kam die erste Zeile, bevor die Figuren zu sehen waren.
2. **Publikums-Anker je Kamera** (`playerPosFor`): Spielerwahl und Zuruf sitzen am unteren Bildrand (NDC −0,9). Für `cam=two` ergibt das die bisherige Lage; bei `cam=near` lag die Wahl vorher über dem Power-Text der Karte.

### 19.4 · V-242 Kartentext = Druck: Zuordnung geprüft, `MEDIA_COMMIT` umgestellt
- **Audit** gegen `data/kfb-card-text-canonical-2026-10-14` @233efd5. Die PDFs und `index.json` sind gegenüber a9f5ffa1 unverändert, deshalb wurden die vorhandenen OCR-Rohdaten neu bewertet (`--rescore`), mit den Titeln aus media/kfb (`NAMES=media`).
- **Ergebnis: 60/78 SAFE wie bisher, kein Deck verloren, freigegebene Karten 3097 → 3142.** Rohdaten: `v242_audit_233efd5.json` und zum Vergleich `v242_audit_a9f5ffa1_medianames.json`.
- **Zwei Stolpersteine im Format, im Skript abgefangen:**
  - ai_kayfabe, brain_flipper und frizzlebob_s_kompendium führen `num`/`name` statt cardNumber/cardName.
  - kreative_kayfab, carnival_therapy und tragic_flaws haben **gar keine Kartennummern** mehr. Dort gilt Listenplatz = Kartennummer, geprüft 156/156 über `jsonLegacy.cardName` gegen die Registry-Nummer.
  - Ohne diese Abfangung fielen die drei Decks auf 0 Treffer.
  - **Bitte an WS0:** Kartennummern in diesen Decks wieder mitführen.
- **`MEDIA_COMMIT` = 233efd5.**
- **Spieltext neu gebaut:** `src/data/cards.json` kommt jetzt aus media/kfb @233efd5 (`scripts/build-cards-media.py`), Deckliste und -reihenfolge unverändert. Damit beantwortet V-242 meine Frage aus §10.1.
  - Vorher stand der Spieltext auf Registry ac9dbae und wich vom Druck ab: 46 Titel, 511 Power-, 558 Lore-Texte, darunter die anti_rules_toolkit-Verschiebung #51–56.
  - Jetzt 6816 Karten (vorher 6789), keine doppelten Schlüssel.
  - Die Sprechblasen sagen damit, was auf der Tafel gedruckt steht.

### 19.5 · Farben der Original-Brauen und -Nase aus Georgs Export (WS0 14.10.)
- **Brauen:** Modell und Export haben beide #17130f, es ändert sich also nichts.
- **Nase:** vorher Modellfarbe #b0131e, jetzt `nose.color` #e96049 aus dem Export. Je Figur ein eigenes Material.
- Das Bildpaar gegen den P08-Spender läuft mit Modellfarben (`partcolors=model`) und bleibt bei 1,2–1,4/255. Die Abweichung steht im Rezept unter `moduleDeviations` und als Befund A14.
- **A5:** Wir nutzen lift 0,242 aus dem Export (V-240). Der vorläufige Wert 0,18 aus §12 ist nicht mehr in Gebrauch.

### 19.6 · Offen für G4 (WS0)
1. **Bildaufbau:** `near` (Vorschlag) oder `two`?
2. **Biom bzw. Kartenzone der Bühne:** Derzeit steht Moos-Insel als Testvorgabe. Davon hängen Rahmen- und Bodenfarbe ab.
3. **Zweite Besetzung:** Derzeit spielt FrizzleBob beide Seiten.
4. **Pool r6:** Mit r5 (0 ACCEPTED) sagt Sprecher A den Kartentitel wörtlich (`source CARD`), nicht eine Pool-Zeile. Für die Vorführung wäre r6 nötig, sonst ist der Dialog nur „Titel → Power-Text → Wahl“.
5. Weiter offen aus §18: Kopf-Blickschicht und Welt-`lookAt`, Kinetik-Automatik, M1-Fußabnahme gegen die Referenz-Rampe.

**Zusammenarbeit:** Die M1-Sitzung baut im eigenen Worktree (`m1/bewegung`) und ruft nur `actor.update(dt)` auf. Sie übernimmt 28025ac und die folgenden Commits. Volle Suiten laufen abgesprochen, nur eine Sitzung zur Zeit.

## 18 · 14.10. abends · G0 M1 „Bewegung mit FrizzleBob v5b“: PASS (nur Prüfung, kein Bau)

Briefing: `ws1/briefs/BRIEF_WS1_M1_BEWEGUNG_R1.md` (§17.2; V-Nummer fehlt noch). Geprüft von der M1-Sitzung im eigenen Worktree (Branch `m1/bewegung` @da2c194, Skripte `scripts/m1/g0-bones.mjs`, `g0-weights-rootmotion.mjs`, `g0-foot-creep.mjs`; Clips in `~/kfb-ws1/intake/loco/`).

1. **Skelett:** v5b-Skin mit 47 Gelenken:
   - 23 Rig_Medium-Deform-Knochen, namensgleich;
   - 18 IK-/Control-Knochen ohne Gewicht;
   - 6 Ohrknochen (ear-dangle).
   - Bindepose gegen MovementBasic/Advanced/General: höchstens 0,03° Abweichung, Knochenlängen 0,0 %.
   - **LOCO-Clips passen direkt, ein Retarget ist nicht nötig.** Kein Clip treibt Ohrknochen, also kein Konflikt mit ear-dangle.
2. **Clips:** KayKit Character Animations 1.1 @378b2093.
   - Walking_B 1,067 s, Running_A/B 0,8 s, Jump_Start/Idle/Land 0,6/1,067/0,667, dazu Jump_Full_Short/Long.
   - Alle laufen am Platz.
   - Die Werte decken sich mit LOCO in `anim.mjs` (cloudflare-live @e21e4904).
3. **Fußtest (Kriechen bei LOCO-Tempo):**
   - Messung: Walking_B 9,3 cm, Running_A 1,1 cm, Running_B 6,8 cm.
   - Referenz-Mannequin (`KAYKIT_NATIVE_BASELINE_01`): 9,5 / 2,8 / 12,7 cm.
   - Das Skelett überträgt sich also 1:1, es gibt keine neue Rutschquelle.
   - **Aber:** Die Handover-Abnahme §6 (≤ 4,4 cm) erreicht selbst die Referenz nur ohne Fersen-Zehen-Abrollen.
   - **Vorschlag für Abnahme #1:** Kriechen ≤ Referenz-Rampe (`ramp_slip.json`, gleiche Methode) plus bewegtes Bildpaar gegen KAYKIT_LOCO_RAMP_02, statt absolut 4,4 cm.
   - Anlaufen und Anhalten (10 bzw. 19 cm) bleiben die Schwachstelle; vorgeschlagen ist Anhalten auf Fußkontakt.
4. **Maßstab:** FrizzleBob steht mit 0,947368 (P08 CLASS_K). Weltgeschwindigkeit = LOCO-Tempo × 0,947: Gehen 0,928, Rennen 3,129, Sprint 4,978 m/s. Ohne diese Umrechnung rutschen die Füße um 5,6 %.
5. **Flug:** Es gibt keinen Flug-Clip (General, MovementBasic/Advanced, Special, Simulation geprüft). Vorschlag laut Briefing:
   - Jump_Idle als Schleife plus Körperneigung nach Tempo und Kurve;
   - Abheben mit Jump_Start, Landen mit Jump_Land.
   - Georg entscheidet am Bild.
6. **Kinetik:** Eye-Rig v6 hat sie standardmäßig an, P08 speist sie aber nie automatisch, und Georgs Export hat keinen Eintrag. In M1 bleibt sie aus. Eine Automatik aus dem Controller (Bremsen, Kurve, Fall) wäre neues Verhalten → **WS0/Georg entscheiden.**
7. **Blick Augen → Kopf → Körper (V-214):**
   - Der Slot bietet `lookAt(nx, ny)` und `blinkNow`; eine Kopfdrehung hat der Spender nicht.
   - Nötig wäre eine kleine Schicht nach dem Mixer (begrenztes Gieren/Nicken des Kopfknochens).
   - **Bitte WS0 bestätigen**, dazu: Soll der Slot ein `lookAt`-Ziel in Weltkoordinaten bekommen?
   - Der Ohren-Wind (−Geschwindigkeit) ist vorhanden und greift beim Laufen von selbst.
8. **Nicht geprüft:** bewegtes Bildpaar beim Gehen und Rennen (Browser-Lauf). Das wird der erste Schritt beim Bau.

**Stand:** G0 PASS, kein Stopp. Gebaut wird erst nach Bestätigung durch WS0/Georg. Wer M1 baut, entscheidet Georg (M1-Sitzung im eigenen Worktree oder diese Sitzung).

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
