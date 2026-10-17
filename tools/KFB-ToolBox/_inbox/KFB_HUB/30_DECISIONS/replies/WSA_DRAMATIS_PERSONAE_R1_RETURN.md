# WSA Dramatis Personae R1 Return · V-399 · 17.10.2026

## Ergebnis und kritische Briefprüfung

**Sicherer lesender Anteil vorbereitet; vollständiges R1 mit 3D ist NICHT fertig.** Keine neue Site und kein neues Werkzeug: derselbe Asset-Library-Owner `appgprj_6ac1afef08148191b62b95f184bf845e`, neue Tab-Routingoption `?view=dramatis-personae`, optional `&character=frizzlebob` oder `&character=lord_hunky`.

Native **v16 gespeichert, nicht veröffentlicht** (`deployment_id: null`). Version `appgprj_6ac1afef08148191b62b95f184bf845e~appgver_b9a5aacc19e88191b9cd8a30c5b62f88`, Quelle `b82efaa017e2a5d455ca4e3fd07a3db09f7db273`; Archiv SHA256 `sha256:39dae658893203cc7df2fb7fc09b8313f1ddc89099060ace095670cec41a0ac1`. Ausgangsquelle v15 `db053683305e7f4a176d1f2ebf6d5343c5284f77`. Deshalb wird `https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=dramatis-personae` nur als beabsichtigter Tab-Pfad angegeben, nicht als bereits funktionierender Staging-Abnahmelink. Keine zweite Site als Ausweichlösung.

Georg korrigiert die Bezeichnung: **ToolBox-Studio** meint die vorhandene ToolBox mit Studio-/Animation-/Rigging-/Motion-Tabs. „Figure workshop“ im Brief ist eine Zuständigkeitsbeschreibung, kein neuer Ort und kein weiterer Editor. Der bestehende Tab in der Asset Library ist die lesende Personenübersicht; Aussehen bleibt im bestehenden ToolBox-Studio. Ein gemeinsames schreibendes Dateiprotokoll ist erst R2, nicht bereits implementiert.

R1 bedeutet zuerst read-only. R2 (GEORG-Felder und `characters/edit-<id>-<date>`-Vorschläge ohne Merge) sowie R3 (Webchat-Kontext und Antwortvorschlag, V-376) bleiben folgende Ausbaustufen; keine unsichtbaren Schreibrechte oder simulierten Speichern-Knöpfe. Die flachen aktuellen FIGURES_R1-Pfade sind maßgeblich; das Schema nennt einen zukünftigen Zielpfad, der hier nicht eigenmächtig eingeführt wird.

## STOP der 3D-Seam und WS0-Anmeldung

Unabhängige Production-Guard-Prüfung gegen Register `a95c491f4996bf75428e2083f571abc15dca364d` und `ws1/r3f-frame@78d3805b5cea7a42b36a84fc593785a81193567a`:

- `FIGURES_R1/README.md` dokumentiert ungelöste V-201-Augenwerte, fehlende Clay+EyeRig-Bildbeweise und einen noch nicht gebauten Karten-/Refusal-Loader.
- Im vollständigen WS1-src-Tree (190 Einträge) gibt es keinen `kfb.figure/1`-Consumer und kein vorgeschriebenes `kfb-stage-light.v1.js`.
- `actorSlot.js#createActor`/`stageCast.js` lesen alte Recipes und GLBs. Das vorhandene `stageLight.js`/`Stage.jsx` enthält noch `actorRim`, `toneSplit`, Gegenlicht und festen Bias. LIGHT_MODEL_R2 hebt diese Verfahren ausdrücklich auf. Sie sind kein zulässiger Ersatz.
- Deshalb **STOP nur für die 3D-Seam**, kein Modellabruf, kein eigener Licht-/Figuren-Loader, keine Roh-GLB-Vorschau. Alle 13 Preview-Slots verweigern sichtbar. FrizzleBobs Karte bleibt **approved**, Hunky **candidate**; Rendererbereitschaft ist davon getrennt. „card incomplete“ ist der im Brief verlangte sichtbare Sperrhinweis, keine Statusumschreibung der Datei.

WS0 ist über KFB Production Control angemeldet: Record `52e61fec-48a5-4c25-aa31-78afc7d00c5e` (FAILURE_RECOVERY, V-399), zusätzlich diese GitHub-Rückgabe. Eine Lesebestätigung von WS0 wird nicht behauptet. Auftrag an WS0/WS1: gemeinsamen Karten-Consumer mit Schema-/EyeRig-/SHA256-/Clay-/Sheen-Guard und R2-Lichtmodul mit `fitShadow(box)`, `contactAO(receivers,occluders)` und Seam-Selbsttest liefern, mit exakter Import-API und Pin. WSA integriert anschließend ausschließlich diesen Consumer.

## Was im gespeicherten Tab funktioniert

- Galerie aus neun echten Charakterblättern und 13 Figurenkarten; vier Figuren ohne Charakterblatt werden sichtbar als `todo` geführt, nicht mit erfundenen Blättern gefüllt.
- Live-Suche über Name, Aliasse/Mishearings, Persönlichkeit/Archetyp, Decks und Story-Mode. Browserbeleg: „Hanky“ findet Lord Hunky; reine Quelltests prüfen auch „Anki“, Herald und Comic.
- Sieben Blattabschnitte: Story, Persönlichkeit, Dialog, Karten, Erinnerung/Beziehungen, Performance, Quellen/Konflikte. 703 vorhandene Statuswerte werden unverändert als GEORG/SOURCE/DESIGN/PREFILL/todo gelesen. Offene Konflikte bleiben auch neben dem Blatt sichtbar.
- GitHub als Wahrheit: erst einen Branch-SHA auflösen, dann beide Verzeichnisse und Castingdatei aus genau diesem SHA lesen. Nur ein vollständig gelesener Satz ersetzt den Arbeitssnapshot. Bei Abruffehlern bleibt der klar benannte geprüfte Snapshot sichtbar; keine Browser-Persistenz, keine Quellwertänderung.
- Neun bestehende WAV-Stimmproben aus dem in `voice_casting.r1.json` benannten privaten Dropbox-Ordner bytegleich im privaten Site-Bündel. Keine neue Erzeugung und keine Kreditausgabe. Originaldateien bleiben unberührt. Audioquelle und Castingbezug werden gezeigt; nicht zugeordnete Proben bleiben todo. Eine tatsächliche Audio-Wiedergabe wurde nicht bewiesen, weil der Browser-Shadow-Control-Selektor nicht verfügbar war.
- Rückkehr zum bisherigen Asset-Browser geprüft; vorhandene Suche bleibt verfügbar. Beim Verlassen werden Personen-Audios pausiert. Kein neues AudioContext-/Mixing-System.

## Quellen, Änderungen und Prüfungen

Repo `georg-doc/kayfabizarro`, Register `docs/kfb-decisions-register-2026-10-11`. Alle aktuellen `FIGURES_R1/characters/*.character.json`, `figures/*.figure.json`, Schemata, README/CHARACTER_SOURCES und `voice_casting.r1.json` aus dem genannten Register-Snapshot gelesen. Keine dieser kanonischen Dateien verändert. Source-Dateien in diesem Registerpaket sind nur der prüfbare Site-Quellausschnitt, keine zweite produktive Runtime.

Native Site geändert: `dist/index.html`, `dist/app.js`; neu `dist/dramatis-personae.js`, `.css`, `dist/data/dramatis-personae-cache.json`, neun `dist/personae-audio/*.wav`; Ownernotiz `DRAMATIS_PERSONAE_R1.md`. Originales Layout, Site-ID, audience und bisherige Bereiche bleiben erhalten. Voice-WAVs bleiben im privaten Site-Quellrepo und werden nicht in das öffentliche Register kopiert.

- **26/26** reine Quellen-/Such-/Guard-Checks; neun Charaktere, 13 Figuren, 703 gültige Statusleaves, 13 gesperrte Preview-Slots, neun vorhandene Castingdateien.
- Syntaxchecks von app.js und neuem Modul bestanden.
- Lokaler Browser 1280×720: aktueller GitHub-SHA geladen, Alias-Suche, alle sieben Blattabschnitte, FrizzleBob approved / Hunky candidate getrennt von Preview-Sperre, null model-viewer/canvas im Personen-Tab, Rückkehr Assets geprüft. Keine FPS-/Clay-/Licht-/3D-PASS-Behauptung.
- Unabhängiger Read-only Review: kein P0/P1 für den **save-only**-Anteil. Das ist keine Abnahme der fehlenden 3D-Anforderung.
- Native v16 samt Quellcommit zurückgelesen, `deployment_id` weiterhin null. Keine Veröffentlichung dieses Teilstands.

Sichtbelege (UI, keine Figurenbeweise): `WSA_DRAMATIS_PERSONAE_R1_EVIDENCE/gallery.png`, `frizzlebob.png`, `lord-hunky.png`. JSON-/Test-/Audio-Herkunftsbelege liegen daneben. Der genaue Register-Ergebnishead ist der Commit dieses Returns und wird im Chat/Production Control genannt.

## Figurenkarten und fehlende Bereitschaft

Für **alle 13** fehlt die gemeinsame Runtime. Zusätzlich folgen die offenen Punkte wörtlich aus der jeweiligen Karte. Eine Kartenfreigabe wird nicht mit Preview-Bereitschaft oder Vollständigkeit gleichgesetzt.

| Figur | Kartenstatus unverändert | Offene Punkte laut Karte |
|---|---|---|
| Black Knight | candidate | Blender eye cleanup + anchors; eye setting on anchored seat + Georg save; clay proof |
| Brain-Cyborg | open-design | aliens collar construction PASS first; story; Blender build + clay proofs; everything in this card |
| Demon Lord | candidate | baked cleanup PASS; eye setting on anchored seat + Georg save; clay proof |
| FrizzleBob | approved | clay proof pair front/3/4/side under the R2 stage-light module (V-346.6, V-392) |
| GothGirl | candidate | Georg PASS on GothGirl_NoEyes (EYE-CLEANUP-02 contact sheet row); eye setting A vs B + save; mouth decision; clay proof pair |
| Lady Dory | candidate | Figure Workshop r4 integration report (BRIEF_WSA_ALIENS_TOOLBOX_R4, Hub b61); Georg tunes + saves (V-317); E2 lids in socket (V-348.4); Space Ranger head-turn transfer (V-353.2 / WSB B5); brows (later, V-297); Dory head oval + mouth area Blender job (V-336 BLENDER_MCP_HANDOFF) – status unknown |
| Lord Hunky | candidate | Figure Workshop r4 integration report (BRIEF_WSA_ALIENS_TOOLBOX_R4, Hub b61); Georg tunes + saves (V-317); E2 lids in socket (V-348.4); Space Ranger head-turn transfer (V-353.2 / WSB B5); brows (later, V-297) |
| Monstrosity | candidate | baked cleanup PASS; eye setting on anchored seat + Georg save; clay proof |
| Mummy_A | candidate | close-up pair front + 3/4 with EyeRig v6 on the anchors + clay (WSB re-render per ANTWORT_WS0_2026-10-17); mouth set per voice; Georg confirms which mummy sings which voice; V-201 converge/gaze check |
| Mummy_B | candidate | close-up pair front + 3/4 with EyeRig v6 on the anchors + clay (WSB re-render per ANTWORT_WS0_2026-10-17); mouth set per voice; Georg confirms which mummy sings which voice; V-201 converge/gaze check |
| Norman | open-design | Site proof: Source only → Face candidate with clay (V-380); Georg gate NORMAN_TOOLBOX_SITE_FINE_TUNE_01 (TUNE/APPROVE/REJECT); voice casting; baked texture instead of runtime texclean |
| Orc Brute | candidate | Georg confirms G4 (image ↔ "Orc passt"); animated eyes (life/blink/gaze) + Figure Workshop save (V-353 r4 run) |
| Witch | candidate | close-up pair with eye rig + clay; V-201 check |

Zusätzliche Charakterblatt-Lücke: Black Knight, Demon Lord, Monstrosity und Witch haben Figurenkarten, aber noch keine eigenen character.json-Dateien im aktuellen R1-Ordner. Keine automatische Neuanlage.

## Genau ein nächster Schritt

**WS0 lässt WS1 den gemeinsamen Figurenkarten-Consumer und das R2-Lichtmodul liefern.** Danach ergänzt WSA die echten Vorschauen, prüft FrizzleBob und Lord Hunky sichtbar mit Clay + EyeRig und veröffentlicht erst den zulässigen R1-Stand. R2/R3 starten anschließend. Georg muss keine Dateien oder Zwischenbriefings weiterreichen; die Anmeldung liegt bereits dauerhaft vor.
