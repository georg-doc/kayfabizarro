# WSA → WS0 · FB_CANON R2 RETURN · 2026-10-22

**Ergebnis: technisch geprüfter Kandidat für Georgs Bild-Abnahme.** Der P08-Import ist repariert, der GLB-Export sitzt im vorhandenen Rigging-Tab. Die tatsächlich gespeicherte Datei wurde neu geladen und auf 1,81 m geprüft. Alle sieben sauberen Stage-Bilder sind im privaten Übergabepaket. Kein Georg-PASS behauptet; nichts live geschaltet.

## Übergabe ohne Kopierauftrag an Georg

Privates Übergabeverzeichnis auf dem gemeinsamen Mac/Dropbox:
`~/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/FB/_wsa_canon_r2_2026-10-22/`

Arbeitskopie:
`work/fb-canon-evidence-r2-2026-10-22/` im lokalen KFB-Hub-Projekt.

- `FB_CANON.glb`
- `FB_CANON.sha256`
- `FB_CANON.export-reimport.receipt.json` — vollständiger GLTFExporter → neuer GLTFLoader-Vergleich
- `FB_CANON.disk-reimport.receipt.json` — separat beobachteter Datei-Neuimport und Bildhashes
- `images/` — sieben PNGs ohne Bedienoberfläche
- `ToolBox-FB_CANON-R2.patch` — nachvollziehbare Änderung des bestehenden Site-Owners
- `WSA_TO_WS0_FB_CANON_R2_RETURN.md`

**WS0 als Nächstes:** Genau diese GLB privat ablegen, ihren untenstehenden Hash in `50_BLENDER/FB/data/FB_CANON.json` übernehmen und Georg das Bildpaket im Hub zeigen. Die Figurenkarte erst nach Georgs PASS umstellen. Kein weiterer Auftrag und keine technische Entscheidung von Georg nötig.

## Eindeutige Dateiidentität

| Feld | Ergebnis |
|---|---|
| Datei | FB_CANON.glb |
| SHA-256 | `ba6bb277f4f6271dda969a4469dde307b2e6e4c67a8243647be5bf12d011106e` |
| Größe | 4,488,744 Bytes |
| Höhe | 1.8099999999999998 m, geprüft gegen 1.81 m ± 0.0001 |
| Einheit | **1 GLB-Einheit = 1 Meter** |
| Status | Kandidat, pending-Georg; keine neue kanonische Freigabe |
| Ohren-Reduktion V-643 | nicht angewendet, separater Folgeschritt |

Die Höhe wird an den sichtbaren, tatsächlich geskinnten Vertices der neutralen Exportfigur gemessen. Transparenter FaceHost und verborgene Originalteile zählen nicht mit. Eine einheitliche Wurzelskalierung setzt das Metermaß, ohne die Geometrie neu zu bauen. **Nicht zusätzlich die alte v5b-/Rig-Units-Skalierung anwenden.** Die alten Zwischenexporte mit anderen Hashes sind keine Kandidaten für Verbraucher.

## Eine P08-Quelle — Import-Guard unverändert

Bestehende P08-Kandidaten-Datei:
`dist/data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-21.p08.json`

SHA-256:
`8b7ac319a0ba9c4b9cdce5fddc738a35d85a8dc517b6f1f40585c378fc843ce9`

Bootstrap lädt und prüft jetzt diese Datei. Der spätere Override in `_mountFaceOn` ist entfernt. Ein frischer Browserimport zeigte „Georg actor imported“, kein Brauen-Mismatch. Vor dem GLB-Export wird die vollständige Importprüfung erneut ausgeführt.

Georgs Werte bleiben:
- `parts.eyes = "rig"`
- `original.brows.depth = -0.08`
- `original.brows.pitch = 8`

Keine Änderung von Georgs sonstigen Gesichtswerten, keine Ohrverkleinerung, keine Ersatzfigur.

## Exportvertrag und Wiederimport

GLTFExporter im bestehenden Rigging → Import · Export, **kein neues Werkzeug**. Isolierte SkeletonUtils-Kopie des vollständigen montierten Actors: Körper, ursprüngliche Gesichtsbauteile mit angewendeten Werten, Haarbüschel, Ohren, Skelett samt Ohrbasen und bestehende EyeRig-Geometrie.

- 93 Knoten, 24 Meshes, 8 Skins, 38 Animationsclips.
- Verborgene Original-Augen `FB_Eye_L/R` sind nicht als Meshes enthalten.
- Bestehende EyeRig-Knoten haben stabile Namen: `KFB_EyeRig_v6`, `KFB_Eye_L/R`, `KFB_Sclera_L/R`, `KFB_PupilPivot_L/R`, `KFB_Pupil_L/R`, `KFB_Lids_L/R`, `KFB_LidUpper_L/R`, `KFB_LidLower_L/R`.
- FaceHost/`body`-Anker, Rezept, Owner-Verweise und Schattenvertrag stehen im GLB.
- Keine externen Buffer-/Bilddateien erforderlich.

**Laufzeit-Shader und Verhalten sind gemäß WS0-Nachtrag nicht gebacken.** Transport-PBR und montierte Geometrie liegen in der GLB; Clay, Gesichts-/Mundverhalten und Ohrdynamik bleiben bei den vorhandenen Modulen. Die Bildprüfung setzt denselben Clay-Owner auf die neu geladene GLB und bindet die Update-API des bestehenden EyeRig v6 an deren Knoten, ohne Augen neu zu bauen. Verbraucher müssen vorhandene EyeRig-Knoten weiterverwenden und dürfen keinen zweiten Rig darüber montieren.

Nach `Skeleton.pose()` werden die vom Ohr-Owner abgestimmten Basis-Transforms und neutralen Chain-Werte wiederhergestellt. Deren Neuimport-Transforms sind explizit verglichen. Das ist kein Bake der dynamischen Ohrbewegung.

## Tatsächliche Prüfungen

| Prüfung | Befund |
|---|---|
| Bootstrap-Pfad und JSON-SHA | PASS |
| Frischer P08-Browserimport | PASS, Guard beibehalten |
| Bestehender JSON-Roundtrip | PASS, 135 angewendet / 0 abgewiesen / keine Felddifferenz |
| Geschriebene GLB-Bytes → neuer GLTFLoader | PASS |
| Knoten-Hierarchie, Skeleton-/Skin-Belegung | PASS |
| Clip-Namen, Dauern, Track-Anzahl | PASS |
| Track-Zielknoten nach Neuimport | PASS, alle an dieselben Canon-Knoten gebunden |
| Alle Track-Zeit-/Wertarrays | PASS, maximale numerische Differenz **0** über 38 Clips |
| Neutrale Ohr-Transforms | PASS |
| Höhe 1.81 m | PASS |
| Separat gespeicherte Datei → HTTP → ToolBox-Datei-Neuimport | PASS, identischer SHA |
| Clay nach asynchroner Initialisierung | ready; gemessener Figure-Sheen maximal **0.05** |
| Unabhängige statische Artefaktprüfung | PASS |
| Unabhängige Sichtprüfung halb / zu / Racer | PASS für Kandidatenübergabe, kein Georg-PASS |

Pflichtclips aus dem bestehenden Owner:
`Idle_A`, `Walking_A`, `Running_A`, `Jump_Start`, `Jump_Idle`, `Jump_Land`, plus tatsächlich aufgelöster `kfb_dance_chicken_a`. Alle 38 geladenen Stock-/Dance-Clips sind enthalten.

Ein zunächst falsch benanntes Augen-PNG wurde von der unabhängigen Prüfung zurückgewiesen. Ursache war die asynchrone Aufnahme mit veränderlichem Dateinamen. Aufnahme korrigiert (Name vor Encoding einfrieren, Speicherung abwarten), alle Bilder neu aufgenommen. Die endgültigen Dateien zeigen die jeweils beschrifteten Zustände.

Browser-Automation konnte den nativen Dateiwähler wegen fehlender Extension-Dateiberechtigung nicht bedienen. Keine Rechte erweitert: stattdessen die identische gespeicherte Datei über den lokalen HTTP-Testserver geladen. Das ist der belegte separate Datei-Neuimport. Optionales game-dev CLI nicht vorhanden; repository-native und Browserprüfungen verwendet.

## Bildpaket

Alle Bilder aus der **neu geladenen endgültigen GLB**, Clay-Owner `body-surface.v2` (figure-fine, Sheen ≤0.05), Licht ausschließlich `kfb-stage-light.v1`. Keine private Zusatz-/Rim-/Back-Light-Quelle. PNGs stammen direkt aus dem Stage-Canvas.

1. `images/FB_CANON_front_offen.png` — vorn, ganze Figur
2. `images/FB_CANON_three_offen.png` — ¾, ganze Figur
3. `images/FB_CANON_side_offen.png` — Seite
4. `images/FB_CANON_face_offen.png` — Gesicht nah, offen
5. `images/FB_CANON_face_halb.png` — Gesicht nah, halb
6. `images/FB_CANON_face_zu.png` — Gesicht nah, geschlossen, keine sichtbaren Pupillen/Augenweiß
7. `images/FB_CANON_scale_offen.png` — orthografischer Größenvergleich mit dem vorhandenen Crimson Flame Dragster v3 (Dieselpunk-Racer, V-321)

Racer-Spender unverändert: `~/Dropbox/CLAUDE/MeshyModels/_browser/dieselpunk_vehicles/crimson_flame_dragster/crimson_flame_dragster_browser.v3.glb`, Maß aus seiner vorhandenen Fahrzeugkarte: 0.616381042 m/Rig-Einheit. Kein Ersatz-Racer gebaut.

## Gesicherter Code, keine Veröffentlichung

Bestehender Site-Owner: KFB ToolBox, Projekt `appgprj_6ac2ba44282881919d1a49287a32054e`.
Managed-Sites-Repository, **kein GitHub-Branch mit diesem Namen**:
- Review-Branch `wsa/fb-canon-r1-2026-10-22`
- verifizierter Head `9b4092ed61cd5434ffa2aa19f3edbe9af7b6b695`
- P08-Basis `20a012324f6d71080ae5927ee2dfe8f633b2410a`
- Push und anschließend Fetch mit exaktem Datei-Blobvergleich bestätigt.

Geänderte Dateien:
`.gitignore`, `dist/index.html`, `dist/START_HERE.md`, `dist/kfb-lib/actor-bootstrap.v1.js`, `dist/kfb-lib/actor-glb-export.v1.js`, `dist/kfb-lib/body-surface.v2.js`.

Der Clay-Owner erhält eine optionale maxSheen-Schranke; bisherige Aufrufer bleiben unverändert. Die private Racer-QA-Datei ist ignoriert und nicht im Source-Push. Kein main-Update, keine Site-Version gespeichert/deployed, kein Live, kein Merge. Die bestehende Site bleibt die bisher veröffentlichte Fassung.

## Genau ein nächster Gate

**WS0 legt die exakt gehashte Datei privat ab und stellt Georg dieses Bildpaket zur visuellen Abnahme im Hub bereit.** Danach erst Figurenkarte/Verbraucher umstellen. Bis Georg PASS bleiben andere FrizzleBob-Jobs gesperrt. V-643 ist danach separat.
