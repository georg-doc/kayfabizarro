# Feldabdeckung · positiv · WS0-Quellstand
*15.09.2026 · WSA · Spalten: **gespeichertes Feld → Consumer/Reader → angewandtes Feld → Status → Beleg**.
Quellen: `src/petstudio-v9/kfb-pet-capsule-carl.json` (166 Blätter) · `src/fixtures/kfb-pet-graft-driver.v4.json` (591 Blätter)
gegen die beiden Leser `lab-v6/carlrig-mount.v1.js#mountCarl` und `frizzlegraft-v1/graft-mount.v1.js#mountGraft`.
Maschinenlesbar: `qa-wsa/field-coverage-wsa.json`. **Positiv geführt:** jede Zeile nennt das angewandte Ziel oder den Grund, warum nicht.*

## Statuswerte

| Wert | Bedeutung |
|---|---|
`APPLIED_MEASURED` | am laufenden Blatt gesehen oder in der Konsole belegt
`APPLIED_SOURCE` | Codeweg am Quelltext verifiziert, kein eigener Sichtbeleg
`OVERRIDDEN_BY_MODE` | gespeicherter Wert wird absichtlich vom `mod`-Feld überstimmt
`APPLIED_THEN_DISABLED` | angewandt, danach vom Modus stillgelegt — gewollt, kein Verlust
`INTENTIONAL_IGNORED` | Leser filtert bewußt heraus, im Quelltext begründet
`REJECTED_REPORTED` | Leser weist ab **und** meldet es in `report.rejected`
`SILENT_DROP` | Leser läßt fallen **ohne** Meldung — Befund, siehe §4
`NOT_STORED` | Feld existiert im Vertrag, ist in dieser Datei aber nicht belegt

## 1 · Kanal CapsuleCarl · Leser `mountCarl`

Verträge: `kfb-pet-capsule-carl.json` · Übersetzer `lab-v6/carl-contract.v1.js#toPets1` · Regler-Wächter `lab-v6/partrig.v1.js`

| gespeichertes Feld | Wert in der Datei | Consumer / Reader | angewandtes Feld | Status | Beleg |
|---|---|---|---|---|---|
| `eye.dx` | 0,226 | `mountCarl` → `buildFace` | `eyeAnchor.dx` | **APPLIED_MEASURED** | Regler »Spacing 0.226« · `coldstart-rigging-wsa.png` |
| `eye.dy` | 0,308 | `mountCarl` → `buildFace` + `eyeY` | `eyeAnchor.dy` | **APPLIED_MEASURED** | Regler »Height 0.308« · ebd. |
| `eye.ring` | 0,14 | `mountCarl` → `buildFace` | `eyeAnchor.ring` | **APPLIED_MEASURED** | Regler »Eye size 0.140« · ebd. |
| `eye.track` | 0,04 | `mountCarl` → `buildFace` | `eyeAnchor.track` | **APPLIED_MEASURED** | Regler »Tracking 0.040« · ebd. |
| `eye.pupilSize` | 0,40 | `mountCarl` → `buildFace` | `opts.pupilSize` | **APPLIED_MEASURED** | Regler »Pupil 0.40« · ebd. |
| `eye.lidFit` | 0,92 | `mountCarl` → `buildFace` | `opts.lidFit` | **APPLIED_MEASURED** | Regler »Lid fit 0.92« · ebd. |
| `eye.gloss` | 0,90 | `mountCarl` → `buildFace` | `opts.gloss` | **APPLIED_MEASURED** | Regler »Gloss 0.90« · ebd. |
| `eye.lashes.length / density / width` | 0,45 · 7 · 1 | `mountCarl` (verschachtelt gewinnt über flach) | `opts.lashes.{length,density,width}` | **APPLIED_MEASURED** | Regler »Lash length 0.45 · count 7 · width 1.00« · ebd. |
| `eye.colors.lid` | `null` | `face.eyeRig.setBaseColor` | Grund-/Lidfarbe | **NOT_STORED** (Weg vorhanden: `if (… && ec.lid)`) | `carlrig-mount.v1.js` Z. »eye.colors.lid → setBaseColor« |
| `eye.colors.ball / lash / pupil` | `null` | — | kein Griff in EyeRig v6 | **REJECTED_REPORTED** (sobald belegt) | `report.rejected`: »NICHT ANGEWANDT — EyeRig v6 hat keinen Griff dafür« |
| `mouth.size / dy / sx / lift / wrap / rate` | 0,56 · −0,01 · 1 · 0,03 · 1 · 1 | `face.mouth.setParams(pet.mouth)`, Status geprüft | PetMouth-Regler | **APPLIED_SOURCE** | Rückgabe landet in `applied`/`rejected` |
| `mouth.set` | `"red"` | `buildFace` `opts.mouthSet` | drittes Mundset | **APPLIED_MEASURED** | roter Mund im Bild · ebd. |
| `moustache.enabled` | `false` | `put(face.moustache, …, enabled: !!st.enabled)` | Bart aus | **APPLIED_MEASURED** | kein Bart im Bild |
| `moustache.form` | `"tube"` | `if (st.form && face.moustache.style) style(st.form)` | Bartform | **APPLIED_THEN_DISABLED** — Form gesetzt, Bart aus | `carlrig-mount.v1.js` Bartzeile |
| `moustache.color` | `null` | `only(st, mods.stache.DEFAULTS)` | Bartfarbe | **NOT_STORED** | ebd. |
| `brow.mod` | `"block"` | `mountCarl` Sichtbarkeitsschalter | `origBrow.enabled = true`, `browRig.enabled = false` | **APPLIED_MEASURED** | Original-Brauen sichtbar, keine gezeichnete · ebd. |
| `brow.original.{scale,spread,lift,depth,tilt}` | 1 · 0 · 0 · 0 · 0 | `only(brow.original, PART_FIELDS)` → `PartRig.set` | PartRig-Regler der Insel-Gruppe | **APPLIED_SOURCE** | `report.applied`: »origBrow: scale,spread,lift,depth,tilt,enabled« |
| `brow.original.enabled` | `false` | `enabled: brow.mod === 'block'` | Sichtbarkeit | **OVERRIDDEN_BY_MODE** (gewollt) | Kommentar »der Mode entscheidet, nicht `original.enabled`« |
| `brow.original.islands` | 2 Einträge mit `size`/`centre` | `findFaceParts` **mißt** die Inseln neu | Inselnummern aus der Messung | **INTENTIONAL_IGNORED** | `only()` läßt nur die sechs `DEFAULTS`-Felder durch; »auch das nackte Entpacken von `original` reicht nicht, weil dort `islands` mitliegt« |
| `nose.mod` | `"original"` | Sichtbarkeitsschalter | `origNose.enabled = true`, `noseRig` aus | **APPLIED_MEASURED** | Original-Nase sichtbar · ebd. |
| `nose.original.scale / lift / depth` | 1,34 · −0,02 · −0,066 | `only(… , PART_FIELDS)` → `PartRig.set` | PartRig-Regler | **APPLIED_SOURCE** — genau die Werte, die vor dem R1-Fix verloren gingen | `report.applied`: »origNose: …« |
| `nose.original.enabled` | `false` | `enabled: nose.mod === 'original'` | Sichtbarkeit | **OVERRIDDEN_BY_MODE** (gewollt) | ebd. |
| `brow.*` flach (BrowRig-Regler) | nicht belegt | `only(brow, mods.brow.DEFAULTS)` | BrowRig | **NOT_STORED** (Weg vorhanden, R2-Fix) | ebd. |
| `brow.graft.*` | nicht belegt | mountCarl hat keinen Graft-Weg | — | **NOT_STORED** | `carl-contract` FIELD_MAP führt das Feld, `mountCarl` liest es nicht |
| `zones[].island` + `.hidden` | 21 Zonen, 5 verborgen | `parts.forEach` → `setZoneStyle` | Sichtbarkeit je Insel | **APPLIED_MEASURED** | Mundhöhlenteile und Carls Pupillen unsichtbar · ebd. |
| `zones[].color` | Insel 1 und 6 = `#c03` | `setZoneStyle(p, {color})` | Inselfarbe | **APPLIED_MEASURED** | Körper **und** Nase DocCheck-Rot im Bild · ebd. |
| `zones[].name` | durchgehend `null` | `nameIslands` **mißt** die Namen | Zonennamen im Bericht | **INTENTIONAL_IGNORED** | `zonenames.v4`; die Datei trägt keine Namen, der Leser erzeugt sie |
| `color` (Wirtsfeld) | `"#d99a4e"` (sandfarben) | `mountCarl` liest es **nicht** | — | **INTENTIONAL_IGNORED** | genau hier entsteht »sandfarbener Carl«: die Zonenfarbe gewinnt, das Wirtsfeld bleibt ungenutzt |
| `id / name / kind / module / variant / skin / source / notes` | s. Datei | Studio-Roster (`pet-session`, `_loadHanging`/`_loadBiped`-Auswahl) | Auswahl und Bauweg | **APPLIED_MEASURED** | Startbericht des Studios listet `capsule-carl` |

## 2 · Kanal Graft · Driver · Leser `mountGraft`

Vertrag: `kfb-pet-graft-driver.v4.json` · `g` = `pet.graft`

| gespeichertes Feld | Wert | Consumer / Reader | angewandtes Feld | Status | Beleg |
|---|---|---|---|---|---|
| `color` | `"#f2c93c"` | `const color = p.color \|\| '#f2c93c'` | `baseColor` des Augen-Rigs | **APPLIED_MEASURED** | gelbe Figur · `coldstart-vergleich-wsa.png` |
| `eye.anchor.{dx,dy,ring,track}` | 0,345 · −0,1 · 0,3 · 0,1 | Spread über `SPEC.eyes` | `rig.anchor` | **APPLIED_SOURCE** | `report.eye.anchor` |
| `eye.lashes` | nicht belegt | `eye.lashes \|\| face.eye.lashes \|\| {0,6,1}` | Wimpern | **NOT_STORED** (Weg vorhanden) | `graft-mount.v1.js` `const lashes = …` |
| `eye.oval` | nicht belegt | `M.Oval.attach(rig, …)` | ovale Augen | **NOT_STORED** (Weg vorhanden) | ebd. Z. `M.Oval` |
| `eye.sclera` / `eye.pupil` | nicht belegt | `M.Head.attach` | Kopfzonen-Farben | **NOT_STORED** (Weg vorhanden) | ebd. Z. `M.Head` |
| `eye.colors.*` | nicht belegt | **kein Griff in `mountGraft`** | — | **SILENT_DROP** (§4.1) | `graft-mount.v1.js` enthält `.colors` nicht |
| `mouth.*` (13 Felder + `visemeMap` + `src`) | s. Datei | `{ ...MOUTH_DEF, ...SPEC.mouth, ...lib.mouth, ...p.mouth }` — **Vollspread, ungefiltert** | PetMouth-Regler | **APPLIED_SOURCE** | ebd. Mundabschnitt; unbekannte Felder laufen ungeprüft durch (§4.2) |
| `brow.mod` | `"carl-original"` | `if (bp.mod === 'carl-original')` | BrowGraft an, gezeichnete Braue aus | **APPLIED_SOURCE** | `report.brow = 'carl-original'` |
| `brow.{y,x,height,thickness,bendLeft,bendRight}` | −0,52 · 0 · 0,33 · 2,42 · 0,52 · 0,28 | `M.Brow.DEFAULTS`-Positivfilter | BrowRig-Regler | **APPLIED_THEN_DISABLED** — gesetzt, dann `brow.set({enabled:false})` durch den Modus | ebd. Z. `if (brow) brow.set(…)` |
| `brow.graft.*` | nicht belegt | `FaceGraft.BROW_DEFAULTS`-Positivfilter | Carls Braue auf fremdem Kopf | **NOT_STORED** (Weg vorhanden) | ebd. |
| `brow.points` | nicht belegt | `Array.isArray(bp.points) ? … : pointsFor(expr)` | Kurvenpunkte | **NOT_STORED** (Weg vorhanden) | ebd. |
| `nose.{enabled,tall,wide,bulb,droop,height,color,depth}` | s. Datei | `M.Nose.DEFAULTS`-Positivfilter | NoseRig | **APPLIED_SOURCE** | ebd. Nasenabschnitt |
| `graft.weapon.on` + Waffenblock | `true` | `mountWeapon` | Waffe an der Hand | **APPLIED_MEASURED** | Waffe in der Hand · `coldstart-animlab-wsa.png` |
| `graft.zones` / `graft.tone` | s. Datei · `tone: null` | `b.applyZones` | Haut-/Körpertöne | **APPLIED_SOURCE** | `report.zones` |
| `graft.roles.cloth` | `null` | `b.setRoles({cloth, accent})` | Kleidungs-/Akzentfarbe | **NOT_STORED** (Weg vorhanden) | `report.roles` |
| `graft.hands` | `"skin"` | `b.handsAre = g.hands` **vor** dem ersten Färben | Handton | **APPLIED_SOURCE** | ebd. Z. `if (g.hands)` |
| `graft.skin` / `graft.neck` / `graft.mat` | s. Datei | `graft-biped` · `matzones` | Wirtshaut, Hals, Materialzonen | **APPLIED_SOURCE** | `report.mat` |
| `pose.*` (22 Felder) | `preset`, `on`, Winkel | `pose-rig.v1` über `mountGraft` | Sitz- und Armwinkel | **APPLIED_SOURCE** | `report.pose` |
| `pad.{kind,anchors,base,audio}` | s. Datei | **anderer Leser**: Studio `_PAD` (`studio-v9/pad-contract.v1.js`) | Pad, Anker, Klang | **APPLIED_SOURCE** | nicht `mountGraft` |
| `seat.{profile,widthK}` | s. Datei | **anderer Leser**: `frizzlegraft-v1/seat-lab.v1.js` (Mech Rig v2) | Sitzprofil | **NOT_MEASURED** | Kaltstart Mech Rig grün, Feld nicht einzeln geprüft |
| `cardRider.{on,state,scale,…}` | `on: true`, `state: "cruise"` | **anderer Leser**: `cardrider.v1` im Studio | Figur auf der Karte | **NOT_MEASURED** | Studio-Kaltstart zeigt den Bewohner ohne Karte im Bildausschnitt |
| `anim.{rig,mode,clipMap,params}` | `"Medium"` · `"chain"` · `{}` · `{}` | **anderer Leser**: `anim-contract` / `anim-map` (Animation Lab v3, Studio-Reiter Anim) | Clip-Auswahl und Kette | **APPLIED_MEASURED** | Clip `Jump_Full_Long` 2 333 ms spielt · `coldstart-animlab-wsa.png` |
| `id / name / kind / module / variant / skin / notes` | s. Datei | Roster und Bauwegwahl | Auswahl | **APPLIED_MEASURED** | »Graft · Driver« im Roster |

## 3 · Die zwei bekannten Unterschiede — eingeordnet, nicht wegkorrigiert

**3.1 · 24 Pets / 0 Entwürfe (WSA) gegen 25 Pets / 1 Entwurf (WS0).**
`src/petstudio-v9/studio-v3/kfb-pets.json` trägt **24** Einträge (nachgezählt, `qa-wsa/fields-wsa.json`).
Der Startbericht liest Repo-Datei **plus** Sitzungsentwürfe (`studio-v8/contract-guard.v1.js`,
Reihenfolge »Repo → lokale Datei → Entwürfe der Sitzung«). Unsere Umgebung hat keinen
Sitzungsspeicher dieses Werkzeugs, WS0s Umgebung hat Georgs.
**Einordnung:** `24 + 0` ist der **Dateistand**, `25 + 1` ist Dateistand **plus ein Sitzungsentwurf**.
Beide Zahlen sind richtig für ihre Umgebung. **Kein Feld fehlt, keine Korrektur.** Der Entwurf wird
nicht angeglichen — eine Entscheidung löscht keinen Entwurf.

**3.2 · Height 0,308 (WSA) gegen 0,312 (WS0).** In `RETURN_WSA.md` stand »nicht erklärt«. Die Matrix erklärt es:
`kfb-pet-capsule-carl.json` speichert `eye.dy = **0.308**`. Genau dieser Wert erscheint im Kaltstart.
Der Leser wendet also den **Vertragswert** an, richtig und vollständig. 0,312 ist der Wert der
Werkbanksitzung `kfb.carl.rig.v6.3`, die im Authoring den Vertrag überstimmen **darf** (und nur dort).
**Einordnung:** 0,308 = angewandter Vertrag · 0,312 = lokaler Entwurf. Dieselbe Mechanik wie 3.1 und
wie der sandfarbene Carl. **Kein Fehler, kein Rundungsproblem, keine Korrektur.**
Die Gegenprobe steht in derselben Zeile der Matrix: `dx`, `ring`, `track`, `lidFit`, `lashes` sind in
Vertrag **und** beiden Messungen gleich — abweichend ist genau das eine Feld, das die Sitzung hält.

## 4 · Was die Matrix neu aufgedeckt hat

**4.1 · Die zwei Leser berichten nicht gleich.** `mountCarl` führt `report.applied[]` und
`report.rejected[]` und begründet jede Abweisung. `mountGraft` berichtet **je Teilsystem**
(`report.brow = 'drawn'|'carl-original'|'none'`, `report.zones`, `report.roles`, `report.mat`,
`report.weapon`, `notes[]`), aber **nicht je Feld**: der Positivfilter
`for (const k of Object.keys(D)) if (src[k] !== undefined) …` läßt unbekannte Felder **ohne Meldung**
fallen. Für `eye.colors.*` heißt das: auf einem Graft-Pet verschwindet das Feld still, während
`mountCarl` es begründet abweist.
**Kein Source-/Contract-Blocker:** im ausgelieferten Driver-Vertrag ist keines der betroffenen Felder
belegt, es geht heute nichts verloren. Es ist eine **Berichtslücke**, kein Datenverlust.
Empfehlung an WS0: `applied[]`/`rejected[]` in `mountGraft` nachziehen, gleiche Form wie in `mountCarl`.

**4.2 · Der Mund ist der einzige Vollspread.** `{ ...MOUTH_DEF, ...SPEC.mouth, ...lib.mouth, ...p.mouth }`
filtert nicht. Unbekannte Mundfelder landen ungeprüft in den PetMouth-Reglern — die andere Richtung
desselben Problems wie R1 (dort brach ein strenger Setter ab, hier prüft niemand).
Heute unkritisch: die belegten Mundfelder sind alle bekannt. Ebenfalls **kein Blocker**.

**4.3 · Ein Feldname divergiert zwischen den Lesern.** Bart: `mountCarl` liest `moustache.form`,
`mountGraft` liest `mp0.style`. Ein als `form` gespeicherter Bart fiele auf einem Graft-Pet auf
`'walrus'` zurück. **Heute ohne Wirkung:** der Driver-Vertrag trägt **kein** `moustache`-Feld
(nachgeprüft), betroffen ist nur Carl, und dort ist der Name richtig. Als Inkonsistenz geführt,
Owner WS0 — **kein Blocker**, weil kein gespeichertes Feld betroffen ist.

## 5 · Was die Matrix **nicht** leistet

Sie ist aus Vertrag und Quelltext gebaut, plus den Sichtbelegen des Kaltstarts vom 15.09.
**Nicht enthalten:** ein Laufzeitmitschnitt von `report.applied[]`/`rejected[]` aus einem
tatsächlichen `mountCarl`-Aufruf (die Prüfseite, die WS0 als nächsten Schritt nennt), Visemes unter
Sprache, Rundlauf Export→Import, und die Kanäle `seat` und `cardRider`. Diese Zeilen stehen als
`NOT_MEASURED` und sind nicht als grün gezählt.
