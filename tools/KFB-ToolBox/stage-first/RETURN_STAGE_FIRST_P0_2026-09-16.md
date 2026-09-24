# RETURN · KFB ToolBox · Stage-First v1 · P0 slice (Actor / Face / Motion / Export)

**Datum:** 2026-09-16 · **Auftrag:** »v18 Promotion + Stage-First Integration« (Fresh-Chat-Briefing) · **Stop-Bedingung erreicht:** erster integrierter Actor/Face/Motion/Export-Slice läuft, danach gestoppt (kein Pose-/Stage-Bau).

Status-Vokabular wie im Briefing: `SOURCE` · `DECISION` · `IMPLEMENTATION` · `TESTED RESULT` · `GEORG ACCEPTANCE` · `CANDIDATE CONTRACT DELTA` · `ARCHIVED HISTORY`.

## 0 · Was gebaut wurde — in einem Satz

`stage-first/src/KFB ToolBox Stage-First v1.dc.html` = die **Studio-v18-Logik (Fork) auf dem WS0-Quellbaum** mit **neuer Stage-First-Shell** (eine Kopfzeile, Bühne = ganze Fläche, eine schwebende Kontextpalette, Actor-Popover als Resource-Picker-Naht). Kein Reader, Rig, Mixer oder Exporter wurde nachgebaut — die Shell ordnet die vorhandenen V2CFG-Abschnitte sechs Domänen zu und ruft dieselben Handler.

Start: `stage-first/src/KFB ToolBox Stage-First v1.dc.html` · Prüfstand: `stage-first/qa/Stage-First QA.dc.html` (»Run 13 checks«).

---

## 1 · SOURCE MAP

| Rolle | Pfad | Pin |
|---|---|---|
| **WS0 source baseline** (`SOURCE`, getestet 7/7) | `_inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/` (87 Dateien) | ZIP sha256 `948d1950…3c5b`, je Datei in `_inbox/WS0_2026-09-15/SOURCE_MANIFEST.json` |
| **v18 (7)** (`CURRENT STUDIO WIP / PROMOTION DONOR`) | `_inbox/V18_BIRTHDAY_7_2026-09-16/original/KFB FrankenStein Studio -7-.zip` | 4 994 864 B · sha256 `06bc8afed3d5d1f1731d466d1241d64e0c5933c8beb38d888fe69dbe34c9a117` · geholt vom Repo-Rohpfad @ `79c5799afd185693f245755f19de2abb44d42452` (Blob `4ea1ead8…` laut `_inbox/README.md`, Bytes stimmen) · 101 Einträge, 95 Textdateien entpackt, Inventar `INVENTORY.json` |
| v18 Return | `…/unpacked/export/WSA_2026-09-16_SESSION/V18_BIRTHDAY_CONSUMER_RETURN.md` | 20 312 B · `27bd7bdf…3a8ef` |
| v18 Studio-Blatt (Donor, unverändert kopiert) | `stage-first/src/KFB FrankenStein Studio v18.dc.html` | 637 638 B · `c19ba765…4faa` |
| v18 Module (promoted, byte-gleich) | `stage-first/src/frizzlegraft-v1/goth-biped.v1.js` · `lab-v6/browfit.v1.js` · `lab-v6/inkform.v2.js` | `3a9404b7…c9a0` · `cbfb5750…ef2a` · `1a40582b…afe0` |
| Profile (v18-Export, byte-gleich) | `stage-first/profiles/kfb-pet-gothgirl.json` · `kfb-pet-hihi.json` | `fcce89dd…1c48` (27 939 B) · `1d406be1…574b` (27 260 B) — Hashes = die im v18-Return genannten; die dort genannten Bytezahlen (27 936 / 27 234) weichen um 3 bzw. 26 B ab, der Hash gilt |
| **Stage-First v3** (`PROVISIONAL DESIGN DONOR`) | `_inbox/STAGE_FIRST_V3_2026-09-16/original/KFB ToolBox Stage First v3.zip` | 1 031 580 B · `2430512d…59d33` · enthält Konzeptblatt `3fb9f90d…9da9` + RETURN_CONCEPT + 5 PNG |
| **Neu · Stage-First v1** (`IMPLEMENTATION`) | `stage-first/src/KFB ToolBox Stage-First v1.dc.html` | siehe `SOURCE_MAP.json` (Endstand nach Verifier-Korrektur) |
| **Neu · Prüfstand** | `stage-first/qa/Stage-First QA.dc.html` | siehe `SOURCE_MAP.json` |

**WS0 ↔ v18 Modulbaum, gemessen** (`_inbox/V18_BIRTHDAY_7_2026-09-16/DIFF_WS0_vs_V18.json`): 80 Dateien byte-gleich · 3 nur in v18 (die drei Module oben) · 1 geändert: `KFB FrankenStein Studio v17.dc.html` 615 952 → 618 074 B (**Befund F-3**, v18-Bericht sagt »v17 unberührt«) · nur in WS0: `Vergleich Graft vs Carl`, `podcast-v2/*`, `assets/models/FrizzleBob_Yellow.gltf` (im v18-Export absichtlich ausgelassen).

**Modifizierte Module:** keine. Einzige neue/geänderte Quelle ist das Stage-First-Blatt (Template neu; Logik = v18-Klasse + Adapter-Block `_sf*`, sieben Patchstellen in `_chromeVals`/`renderVals`/`constructor`/`componentDidMount`).

---

## 2 · Produkt-Shell (`IMPLEMENTATION`)

- **Eine Kopfzeile, 44 px:** `KFB ToolBox · [● Actor ▾] · Actor Face Pose Motion Voice Stage · ⟶ · ○ in sync / ● n drafts · Theme · Export ▾ · …`. Unter 980 px: Wortmarke → `KFB`, Save/Theme wandern ins `…`.
- **Bühne = ganze Fläche** (Canvas unter der Kopfzeile, volle Breite). Kamera-Chips unten links `Full · Face · ¾` (weiches Reframe auf die aktuelle Figur; Face-Domäne wechselt automatisch auf Face). Unten rechts je Gruppe ein Chip mit aktivem Wert (`Emotes · neutral ▾`, `Anim ▾`, im Face `Viseme ▾`), Knöpfe im Popover.
- **Eine Kontextpalette** (316 px, schwebend rechts; < 980 px als schmale Lade). Häufige Gruppe offen, Rest als benannte Zeile mit Inhaltsvorschau; `Show all`; leere Abschnitte werden nicht gezeigt.
- **Actor-Popover** = Resource-Picker-Naht `mode = actor`: Suche über alle Gruppen (Figures 11 · Cube-Pets 24), Klick = **Preview** (Figur lädt sofort), Fußzeile **Accept / Revert**, ⊙ pinnt. Population = `this.roster` (bestehender Owner); KayKit-Vollbestand via Registry ist **nicht** Teil dieses Slices (kein zweiter Index angelegt).
- **Diagnostics** nur über `…` → ersetzt den Paletteninhalt (Quellenlage, Vertrags-Abschnitte, Library-Status, GothGirl-Kategorien/`chainReady`). `pet-LIBRARY.json` fehlt (404) → ein Chip »Library missing« in der Kopfzeile, der Diagnostics öffnet; kein Banner.
- **Motion → »Birthday chain«:** Idle · Wave · Cheer · Rest + Sequenz `Idle → Wave → Idle → Cheer → Idle` (Timer nach Clipdauer, ruft `_audPlay`); Zeile nennt geladene Pflichtkategorien; fehlt eine, steht **eine** Zeile (»Wave / Cheer unavailable — category Simulation not loaded«).
- Domänen-Zuordnung (`SF_SECTIONS`): Actor = biped/variant · GothGirl-Zonen · Materialzonen · Kopfzonen · Waffe · Material · Farbe — Face = Original·Overlay · Eyes · Mouth (mit v18 dx/roll) · Brows · Nose · Moustache · Emotes · Visemes · Asymmetry · Life — Pose = Seat pose · Seat probe · Card rider · Kinetics · Roll — Motion = Chain · Clips · Own clips · Transport · State map · Tuning — Voice = Bubble-Abschnitte — Stage = Light · Ground · Pad base · Pad audio — Diagnostics = die alten »Messen«-Abschnitte. Pose/Stage zeigen **vorhandene** Abschnitte, nichts Neues.

---

## 3 · V18 PROMOTION MATRIX

| v18 capability | current source owner | ToolBox state (Stage-First v1) | promotion action | contract impact | test |
|---|---|---|---|---|---|
| Hihi `pet.flatSkin` (Kenney-Material, kein Clay-Shader) | Studio `reskin()` + Roster-Eintrag | übernommen (Logik-Fork) | promote as-is | B (persisted) | QA 8: Body `MeshStandardMaterial` + map 512² |
| Hihi Ladeweg `pet.modelId` (`animal-cat.glb`) | Studio Ladeaufruf | übernommen | promote | B | QA 8/9 |
| Hihi eigener Eintrag (rote Lippen, Wimpern, Augäpfel) | Roster + Profil | Profil geladen, nicht aus Prosa | promote via profile | — | QA 8, `visual-04` |
| Face `pet.orig` je Teil, nur wo Original existiert | `goth-biped.setParts` + `_origPartRows` | übernommen; Abschnitt erscheint nur bei Figur mit Originalteilen | promote | B | QA 3 (4 Toggles, Brauen hin/zurück) |
| Mund als Textur übermalt statt Fake-Geometrie | `goth-biped` + `texclean.paintOverRegion` | übernommen | promote | — | QA 2 (parts.mouth false, 53 Dreiecke laut Modul) |
| Mund-Platzierung: feinere Schritte, Offset X, Roll, Overlay-Offset 0–0,3 | V2CFG `gesicht.mund` | übernommen | promote | A (Regler) | QA 3 (dx 0,05 / rot 5 angewandt + zurück) |
| GothGirl 17 Materialzonen, Klon je Zone, Original-Restore, Material-Array-Gruppen | `goth-biped.zoneList/setZone/applyZoneMap` + `_gothZoneRows` | übernommen; Zonen = häufige Gruppe im Actor bei GothGirl | promote | B (`pet.zoneMap`) | QA 2/3/10 (17 Zonen, head:0 `#130d15`, nach Figurwechsel intakt) |
| Profil-Export Single-Pet (GothGirl, Hihi) | `pet-session.v1.buildExport` | übernommen; Export-Menü »This actor (1)« | promote | — | QA 7/9 (count 1, ids) |
| **Export-Fix `modelId` als Identitätskennzeichen** (`kind==='biped' || module || modelId`) | Studio `_allPets()` | übernommen | promote | **CANDIDATE CONTRACT / EXPORTER DELTA** (D-12 unten) | QA 9: Hihi-Export count 1 statt 0 |
| Brauen-Stellformel `browfit.v1` (gezeichnet + gegraftet), `inkform.v2` | Module | übernommen (Import-Reihenfolge wie v18, Rückweg brow-rig.v2 im catch) | promote | A/B (D-5…8) | Kaltstart-Log `[brow] Stellformel: browfit.v1` |
| `requiredAnimationCategories` + `chainReady` | `goth-biped.v1` | übernommen; sichtbar in Motion + Diagnostics | promote; Feldort bleibt Modul | CANDIDATE (D-12) | QA 4 |
| Sitzungs-Schutz (Entwürfe nur bei Bedienung) | `pet-session.v1` | unverändert | — | — | QA 7/9 nutzen In-Memory-Export ohne Sitzungs-Nebenwirkung |

---

## 4 · CONTRACT DELTA MATRIX (elf v18-Deltas + Export-Fix)

Klassen: **A** implementation-only · **B** persisted-profile field · **C** session/UI only · **D** canonical-library concern · **E** deferred. Aktion: `KEEP LOCAL / IMPLEMENT / VERSIONED CONTRACT CANDIDATE / DEFER`.

| # | Delta | Klasse | Aktion | Begründung |
|---|---|---|---|---|
| 1 | `pet.modelId` (Fallback = id) | **B** | VERSIONED CONTRACT CANDIDATE | ohne Feld nicht ladbar; Reader tolerant (fehlt → alte URL-Regel) |
| 2 | `pet.flatSkin` (Bool, Vorgabe false) | **B** | VERSIONED CONTRACT CANDIDATE | reproduziert Look nach Reload |
| 3 | `pet.orig {eyes,brows,nose,mouth}` | **B** | VERSIONED CONTRACT CANDIDATE | fehlende Schlüssel = Modulvorgabe |
| 4 | `pet.zoneMap {zoneId: hex}` | **B + D** | IMPLEMENT lokal (Reader) · Vereinheitlichung mit Carls `zones[]` = DEFER (separater Migrationsentscheid) | zwei Formen im Umlauf; keine kanonische Datei anfassen |
| 5 | `brow.thickness` 0…10 | **A** | IMPLEMENT (Validator-Obergrenze) | gleiche Bedeutung, größerer Anschlag |
| 6 | `brow.facets` (12) | **B** | VERSIONED CONTRACT CANDIDATE (optional) | — |
| 7 | `brow.graft.thickness` in Augenradien | **B** | VERSIONED CONTRACT CANDIDATE + Einheit dokumentieren | trägt über Figuren |
| 8 | `brow.graft.depthScale` | **B** | VERSIONED CONTRACT CANDIDATE (optional) | — |
| 9 | `eye.anchor` verschachtelt vs. flach | **A** | IMPLEMENT: Reader übersetzt beide, eine Form festschreiben | **stiller Ausfall**, gefährlichste Stelle |
| 10 | Zeichengruppen brauchen Material-FELD | **A** (Regel) | KEEP LOCAL → Embed-Anleitung | Fähigkeit, kein Feld |
| 11 | GothGirl-Zonen = Inseln, nicht Atlas-Felder | **A** (Doku) | KEEP LOCAL → beide Zonenarten benennen | Consumer muss wissen, was er bekommt |
| 12 | `requiredAnimationCategories` / `chainReady` + **Exporter-Fix `modelId` als Identität** | **A** heute (im Modul/Studio) · Feldort kanonisch offen | VERSIONED CONTRACT CANDIDATE (Feldname + Ort gehören der ToolBox) · Exporter-Fix IMPLEMENT | »initialisiert, aber Clips fehlen« darf nicht mehr eintreten; ein neues Cube-Pet ohne Vertragseintrag war bis v18 nicht exportierbar |

**Nicht angefasst:** `media/3D_Assets/pet-LIBRARY.json`, `kfb.pets/1`-Vertragstext, kanonische Kopien. Keine Version hochgezählt.

---

## 5 · TESTED RESULT

Prüfstand `stage-first/qa/Stage-First QA.dc.html` lädt das Blatt im iframe und fährt 13 Prüfungen über `window.__TOOLBOX`; Exporte werden mit **demselben Builder** wie der Export-Knopf gebaut, aber im Speicher (kein Download). Die Bedien-Handler (`mouthSlider`, Import) **schreiben während des Laufs Entwürfe** — genau die v18-F10-Klasse; deshalb sichert der Prüfstand `localStorage` (`kfb-pet-studio-v5`, `kfb-pet-library-v9`) vor dem Lauf, stellt es am Ende (auch bei Fehler) wieder her und **mißt das nach** (Prüfung 13). Geltender Lauf 2026-09-16T00:51:32Z (nach der Paletten-Korrektur unten), Bild `qa/evidence/qa-run-2026-09-16.jpg` (13/13); Lauf 00:45:18Z ebenfalls 13/13. Der erste Lauf 00:32 (12/12, `qa-run-2026-09-16-first.jpg`) hatte diese Sicherung noch nicht und hinterließ Entwürfe `gothgirl · hihi · frizzlebob` + `petVersions` in Georgs Sitzung — vom Verifier gemessen, von mir entfernt (Sitzung steht wieder auf `graft-driver · capsule-carl`, den v17-Seeds).

| # | Prüfung | Ergebnis |
|---|---|---|
| 1 | Cold load | **PASS** · roster 35 (11 Figuren, 24 Cube-Pets) · Library MISSING (404, bekannt) |
| 2 | GothGirl-Profil laden | **PASS** · import took gothgirl · module GothGirl · head:0 `#130d15`, head:1 `#e6cbc3` · parts eyes false / brows true / nose true / mouth false · 12 Inseln |
| 3 | GothGirl Face-Regler | **PASS** · 4 Original/Overlay-Toggles · Brauen Overlay→Original→zurück · Mund dx 0,05 / roll 5 angewandt + zurückgesetzt · zoneList 17 · 18 Zonenzeilen |
| 4 | Simulation-Abhängigkeit | **PASS** · required General · MovementBasic · Simulation · loaded alle drei · chainReady true |
| 5 | GothGirl Idle → Wave → Cheer → Rest | **PASS** · Idle_A 27/27 Spuren gebunden · 23 Knochen · 1,07 s — Waving 27/27 · 23 · 2,13 s — Cheering 27/27 · 23 · 1,67 s — Rest → Idle_A. (27 = Spuren des Clips, wie v18; 69/69 bleibt der historische Rig-Kanal-Nenner) |
| 6 | Ein Mixer | **PASS** · `biped.mixer` root »figure« · kein Cube-Pet-Mixer daneben · 3 Actions |
| 7 | GothGirl Roundtrip | **PASS** · Profil → Export: **0 Felder verloren**, 7 durch Import-Normierung ergänzt · edit mouth.size 0,58 → 0,60 · Export-Diff genau `≠ mouth.size` · Reload-Diff (Autorenfelder) **leer** · unbekanntes Feld (`false/0/null/array`) überlebt · meta count 1, ids [gothgirl], label single |
| 8 | Hihi-Profil laden · flatSkin · modelId | **PASS** · modelId cat · flatSkin true · Body `MeshStandardMaterial` + map 512² · 35 Materialien, davon 2 Shader/Clay (KFB-Overlay-Teile, nicht der Körper) · kein GothGirl-Material geteilt |
| 9 | Hihi Roundtrip + `modelId`-Exportfall | **PASS** · Profil → Export: 0 verloren, 59 ergänzt (F-1) · edit mouth.dy −0,62 → −0,60; erster Regler-Griff ergänzt 11 Mund-Vorgabefelder (F-1) · Reload-Diff (Autorenfelder) leer · **Meßfeld `ground.foot` 0,2595 → 0,2568 schwankt beim Wiederladen (F-6)** · unbekanntes Feld überlebt · **export count 1, ids [hihi], modelId cat, flatSkin true** |
| 10 | Keine Material-Kontamination | **PASS** · Hihi → GothGirl: head:0/head:1 intakt · Hihi-Gruppe versteckt (Studio-Regel: Cube-Pet »tritt ab«, wird nicht entsorgt) · 0 geteilte Materialien |
| 11 | FrizzleBob bestehender Weg | **PASS** · module FrizzleBob · 18 eigene Clips |
| 12 | Shell-Regeln | **PASS** · genau 1 persistente 44-px-Leiste · Palette vorhanden · Roster zeigt 24 Cube-Pet-Zeilen + Figuren · GothGirl-Actor-Palette nach Verifier-Korrektur = `Material zones (17 Zonen)` + `Variant · weapon` — Atlas-Zonen, Graft-Kopfzonen und Spender-Waffe haben bei ihr kein Ziel (eigener Kopf) und sind ausgeblendet; Abschnitte, die nur erklären, warum sie leer sind, erscheinen außerhalb von Diagnostics nicht mehr |
| 13 | Sitzung unberührt | **PASS** · `kfb-pet-studio-v5` und `kfb-pet-library-v9` nach dem Lauf byte-gleich zum Stand davor · Entwürfe `capsule-carl · graft-driver` (Seeds) · die Handler hatten geschrieben und wurden zurückgerollt |

**Nicht geprüft (also nicht behauptet):** Voice/Talk/Bubble im neuen Layout (Abschnitte erscheinen, nicht abgenommen) · Pose-/Stage-Abschnitte (nur durchgereicht) · Export als **Datei-Download** (Builder identisch, Download-Zweig unverändert aus v18) · Split-Screen an einem echten 832-px-Fenster (Evidenz ist eine 832-px-Wurzel bei `narrow:true`).

---

## 6 · VISUAL EVIDENCE (`stage-first/qa/evidence/`)

| Datei | Zeigt |
|---|---|
| `visual-01-desktop-actor-gothgirl.jpg` | Stage-First Desktop, GothGirl, Actor-Palette mit Materialzonen |
| `visual-02-face-gothgirl.jpg` | Face-Domäne, Kamera »Face«, Original·Overlay-Toggles |
| `visual-03-roster-motion-gothgirl.jpg` | Actor-Popover (Figures 11 · Cube-Pets 24), Motion mit Birthday chain |
| `visual-04-hihi-face.jpg` | Hihi, flatSkin, rote Lippen, Wimpern, Face-Palette |
| `visual-05-832-split-motion.jpg` | 832-px-Wurzel, `narrow`, eine Kopfzeile, Palette als Lade |
| `qa-run-2026-09-16.jpg` (+ `qa-run-2026-09-16-table.jpg`) | Prüfstand-Ergebnis 13/13 (00:45:18Z) · `qa-run-2026-09-16-first.jpg` = erster Lauf 12/12 ohne Sitzungsschutz (historisch) |

Aufnahmeweg: DOM-Rerender-Capture; WebGL-Puffer wurde mitgenommen (Figur sichtbar). Schrift im Bild = Fallback (IBM Plex nicht eingebettet).

---

## 7 · Befunde (neu, mit Beleg)

- **F-1 · Import normiert Einträge auf.** GothGirl-Profil 61 → 68 Blattfelder, Hihi 35 → 94 nach `planImport/applyImport` + Studio-Boot-Normierung (Mund-Vorgaben, Augen-Rig-Felder). **Kein Feld verloren, keiner geändert** (gemessen: Diff Profil→Export enthält nur `+`). Roundtrip danach byte-stabil. Klassifikation: bestehendes Owner-Verhalten (`pet-session.v1` union + `_ensureInLib`), kein Stage-First-Effekt. Für den Vertrag relevant: ein Export ist nach dem ersten Laden **reicher** als die Datei davor — gewollt (v5-Regel »der reichere Stand gewinnt«), sollte aber in `kfb.pets/1`-Doku stehen.
- **F-2 · `_pet()` wirft vor dem Boot** (`this.lib` undefiniert). Im Studio unauffällig, weil der Reiter-Renderer `_pet()` erst bei gebautem Zweibeiner ruft; in der Shell führte ein früher Aufruf zum Render-Abbruch (Refs weg → OrbitControls ohne Canvas → Boot tot). Behoben in der Shell durch `_sfPet()` (nullsicher). Empfehlung an den Studio-Owner: `_pet()` nullsicher machen.
- **F-3 · v18-Export trägt ein geändertes v17-Blatt** (+2 122 B) trotz »v17 unberührt daneben«. Nicht untersucht, was; v17 ist für diesen Slice nicht Quelle. Owner WSA.
- **F-4 · `pet-LIBRARY.json` fehlt weiter** (404 in beiden Blättern) → keine Emotes, kein Gesichts-Block; Emote-Chips fallen auf die sieben Brauen-Ausdrücke zurück (v14-Regel). ToolBox-Aufgabe, nicht Studio.
- **F-6 · Meßfelder werden bei jedem Laden neu geschrieben.** `_measureNow(true)` / `ground-contract.v1` schreiben `ground.*`/`body.*` aus der Geometrie in den Eintrag; bei Hihi schwankt `ground.foot` zwischen Ladevorgängen (0,2595 → 0,2568, ~1 %) mit der Animationsphase des Idle-Clips. Kein Autorenwert, aber ein Wert, der bei jedem Export mitwandert und Diffs erzeugt. Empfehlung: Messung an der Ruhepose (Clip auf t = 0) oder als Meßfeld kennzeichnen. Owner Studio v8-Module.
- **F-7 · Bedien-Handler schreiben Entwürfe, auch beim Messen** (`mouthSlider` → `_ensureInLib/_draftTouch`, Import → `petVersions`). Erwartetes Owner-Verhalten; für jeden Prüfstand heißt das: Sitzung sichern, wiederherstellen, nachmessen (Prüfung 13). Erster Lauf hat es versäumt (siehe §5).
- **F-8 · Ein Entwurf `gothgirl` liegt in Georgs Sitzung** (`kfb-pet-studio-v5`), Inhalt = das geladene v18-Profil, kein Edit. Ursache: mein Sichtprüfungs-Griff `selPet(gothgirl)` NACH dem Prüflauf (außerhalb der Sicherung); `loadPet` legt bei einem Zweibeiner einen Entwurf an (v18 F10). Entfernen war mir danach nicht mehr erlaubt (Speicherschutz). Wirkung: das Studio öffnet ggf. auf GothGirl statt Graft·Driver; »Discard drafts« würde auch Georgs Seeds nehmen — also nicht ausgelöst. Bitte Georg entscheiden.
- **F-5 · Bytezahlen der Profile im v18-Return** (27 936 / 27 234) ≠ gemessen (27 939 / 27 260); die SHA-256 stimmen exakt. Vermutlich Zeilenende/Notationsfehler im Bericht.

---

## 8 · Doku-Reconciliation (§11) — Vorschlag, nicht ausgeführt

Kein Schreibrecht auf `main` (bekannt, `PUSH.md`). Für `START_HERE.md` / `MASTERPLAN.md` / `TOOLBOX_MANIFEST.json` / `CHANGELOG.md` nach Georgs Abnahme:

- Manifest: vier Stände trennen — `technicalSourceBaseline` = WS0 `A_QUELLSTAND/src` (ZIP `948d1950…`) · `currentStudioImplementation` = v18 (7) (`06bc8afe…`, CURRENT WIP) · `stageFirstDesignDonor` = Stage First v3 (`2430512d…`) · `testedIntegratedToolBox` = `stage-first/src/KFB ToolBox Stage-First v1.dc.html` (`b196b1d5…`) mit `qa/evidence/qa-run-2026-09-16.jpg`, **Status `P0_SLICE_TESTED · GEORG ACCEPTANCE PENDING`**, nicht »tested integrated ToolBox« als Ganzes.
- CHANGELOG additiv: Eintrag aus `stage-first/CHANGELOG.stage-first.md`.
- START_HERE: Startweg »Stage-First v1« neben den sieben WS0-Blättern; Studio v18 als Donor benennen, nicht als Ersatz.

---

## 9 · RETURN

**PASSED**
- Kaltstart · GothGirl-Profil · Hihi-Profil · GothGirl-Face (Original/Overlay, Mund dx/roll, 17 Zonen) · Hihi flatSkin · Idle/Wave/Cheer/Rest 27/27 · Simulation-Pflicht sichtbar und geschlossen · GothGirl-Roundtrip · Hihi-Roundtrip inkl. `modelId`-Exportfall (Autorenfelder stabil; Meßfeld-Jitter F-6 ausgewiesen) · ein Mixer · keine Material-Kontamination · FrizzleBob-Weg · Shell mit einer Kopfzeile, Bühne dominant, Palette, Roster 24 + 11 · Prüfstand hinterläßt keine Sitzungsänderung.

**PARTIAL**
- Resource-Picker-Naht: `Browse → Preview → Accept/Revert` für **Actors** gebaut; dieselbe Komponente für Donor-Parts/Motions/Props/Stage-Assets noch nicht angeschlossen; Population aus `roster`, nicht aus der Registry.
- Motion-Sequenz `Idle → Wave → Idle → Cheer → Idle`: gebaut und von Hand gespielt (Timer nach Clipdauer), im Prüfstand nur die Einzelzustände + Bindungen gemessen.
- Split-Screen: als 832-px-Wurzel belegt, nicht als echtes Fenster.

**OPEN**
- Voice/Talk/Bubble, Pose, Stage im neuen Layout: Abschnitte erreichbar, nicht abgenommen.
- `pet-LIBRARY.json` 404 (F-4) · `_pet()` vor Boot (F-2, Studio-Owner) · v17-Blatt im v18-Export geändert (F-3, WSA) · Meßfeld-Jitter `ground.foot` (F-6, Studio v8-Module).
- Doku-Reconciliation §8 wartet auf Abnahme + Schreibweg.

**DEFERRED (laut Briefing §10)**
- World/Birthday-Szene, Curtain, World Builder, Terraformer, Performance Suite, IK/Retargeting, Character Builder, Pet-Library-Migration, neue Registry, neuer Animationsvertrag · Delta D-4 (Zonenform-Vereinheitlichung) · Wimpernfarbe (EyeRig v6 ohne Griff) · Kostüm-/Emerald-/Coral-Farben (v18 LATER).

**GEORG ACCEPTANCE: ACCEPTED FOR WORKING BASELINE** (16.09., WSA-Chat) — F-6 / F-7 / F-8 bleiben OFFEN und dokumentiert; nächster Slice `Pose → Props → Stage` **NOT STARTED**.

## 10 · Nachtrag Abschluß (01:20Z)

- **Consumer-Profile laut Abnahme:** `_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json` (27 543 B, sha256 `37301865…7e511b`) und `kfb-pet-hihi.json` (30 190 B, `76b024e2…14d9fc`) = **CURRENT TESTED CONSUMER PROFILE INPUT**. Sie sind **nicht** byte-gleich mit den (7).zip-Profilen (GothGirl: ohne `pad.*`-Meßblock; Hihi: Georgs spätere Werte `eye.anchor.dy −0,03 · pupilSize 0,67 · lashes.width 3 · mouth.size 0,805` + Meßblöcke, 122 statt 30 Blattfelder). Deshalb der Prüfstand **zusätzlich gegen genau diese Dateien** gefahren (Kopie `stage-first/profiles/repo-inbox/`): **13/13 PASS**, 01:19:32Z, `qa/evidence/qa-run-2026-09-16-repo-profiles.jpg`. Erster Lauf dagegen (01:17) zeigte `pad.anchors.*` als Reload-Diff → dieselbe F-6-Klasse (pad-contract mißt beim Laden), als Meßfeld klassifiziert, nicht als Verlust.
- **Commit:** Push von hier **403** (`POST /git/trees`; Contents: Read only). Checkpoint als ZIP, Weg in `stage-first/PUSH.md`; Top-Level-Pointer als Vorschlag in `stage-first/DOC_RECONCILIATION_PROPOSAL.md`. **Commit-SHA: nicht vorhanden**, bis Georg pusht.
