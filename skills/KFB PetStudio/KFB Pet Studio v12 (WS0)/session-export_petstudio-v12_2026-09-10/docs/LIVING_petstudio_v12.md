# LIVING · Pet Studio v12 — FrizzleBob als Bewohner

**Stand (ein Satz):** v12 ist der Fork von v11; FrizzleBob ist Bewohner (S1–S2), Kenney-Augen weg + splay (S3, v6a abgetastet),
Braue am öffentlichen Anker (S4), Body-Tab für den Zweibeiner (S5), Nase mit Glanz (S6), Probewerte aus den Entwürfen (S6b),
**Braue und Nase auf Georgs Ausdrucks-Bestellung erweitert (S7, 10.09.)**.
**Als Nächstes (frischer Chat, Sprintplanung v12→v13):** S9b Ankerpunkte für armlose Cube-Pets · S10 Brillen-Layer ·
Mündungsrichtung der Waffen-Mods messen · danach Oberfläche/Actions/Export — Upload-Liste in
`UPLOAD_v12_github.md`, Einbau-Anleitung in `HANDOVER_v12_WSA.md`;
EMBED-Nachtrag in `EMBED_CUBE_PET_FULL_v2.3_NACHTRAG.md` (beide hier im Ordner).
**Zuletzt:** 2026-09-10 · **S8 Schnurrbärte und S9 Waffen-Mods gebaut, Versionsprüfung grün** · Gebaut wird an
`petstudio-v9/KFB Pet Studio v12.dc.html` + `petstudio-v9/studio-v12/`.
Wurzel-Starter `KFB Pet Studio v12.dc.html` leitet dorthin weiter (Hauptmenü zeigt nur die Wurzel).

---

## S7 · BRAUE UND NASE KÖNNEN JETZT SPIELEN (10.09.2026)

Georgs Bestellung, fünf Punkte, in zwei Forks gebaut: `studio-v12/brow-rig.v2.js` und
`studio-v12/pet-nose.v2.js`. **v1 bleibt beides daneben und ist der Rückweg** (eine Zeile im DC,
Z. 1042/1044). Die Kurve, die Feder (`kfb-ink-canon.js`), der Shader, die Presets, der Anker
`rig.eyeFrame()`, der `gen`-Lebenszyklus und der Fehlervertrag sind **unverändert** übernommen.

### Was geändert wurde (je Punkt EINE Stelle)

1. **Nase → Knolle.** v1 war die Extrusion eines abgerundeten Rechtecks — im Profil ein Brett. v2 ist ein
   **Superellipsoid**: die Einheitskugel radial auf |x|ⁿ+|y|ⁿ+|z|ⁿ = 1 abgebildet, EIN Regler `bulb`
   (1 → n = 2, runde Knolle · 0 → n = 8, fast die v1-Silhouette). Dazu `droop` (Kartoffel: untere Hälfte
   bis +30 % geweitet, Spitze bis +12 % vorgezogen, Mitte −6 %). Proportionen runder: **1,35 × 1,15 × 1,30 R**
   statt 1,6 × 1,0 × 0,9 — sie steht weiter heraus als sie breit ist. Vorgabe `bulb .85 · droop .45`.
2. **Kopfrundung.** v1 legte die Braue auf eine GERADE zwischen den Augentiefen + konstant 0,92 R. v2 tastet
   die Kopffläche mit **13 Strahlen** ab — dieselbe Abtastung, mit der die Nase ihre Tiefe holt (Referenz statt
   Schätzung) —, interpoliert dazwischen und mischt per `follow` Gerade → Fläche; `lift` hebt die ganze Kurve
   davor ab: cartoonig schwebend, aber mit der Rundung. Lücken (Braue breiter als die Silhouette) werden mit
   dem nächsten Treffer gefüllt, sonst schnappte das Ende auf Augentiefe zurück.
3. **Dreifache Dicke.** Kennlinie `hbAt(t) = t ≤ 1 ? .014 + .02·t : .034·t`, Regler jetzt 0…3. Bei t = 1 auf die
   Ziffer der v1-Wert (0,034) — **gespeicherte Pets sehen unverändert aus** —, bei t = 3 genau das Dreifache.
4. **Einzelne Biegung.** `bendLeft` / `bendRight` −1…1, je Hälfte ein Bogen mit dem Fenster **sin²(π u)**: null an
   BEIDEN Enden der Hälfte, also kein Knick in der Mitte, auch als Monobraue (Maske 0). Negativ = konkav,
   positiv = konvex. Wirkt VOR der Feder, also biegt sich die Tusche mit.
5. **Echter Balken bei `taper` 0.** In v1 blieben bei 0 die Feder-Eigenschaft `taper: .45`, die Licht-Spreizung
   `edge: 2.10` und die Bauchung `1 + .18·sin` stehen — es wurde nie ein Balken. Alle drei hängen jetzt an
   `p.taper` (edge nur bis 0,3 herunter, sonst verliert der Strich die Handschrift). Bei `taper` 1 ist die
   Rechnung **Ziffer für Ziffer** die von v1.

### Abnahme (gemessen im SICHTBAREN Fenster, Bilder in `captures/v12s7/`)

| Prüfung | Zweibeiner (frizzlebob) | Cube-Pet (bunny) |
|---|---|---|
| Strahlen auf die Kopffläche | **13 von 13** | **11 von 13** (2 Lücken gefüllt, kein Rückschnappen) |
| abgetastete Tiefe über die Braue | z 0,518 … 0,769 (**0,251 Rundung**) | z 0,501 … 0,557 |
| Federbreite bei `thickness` 1 | **0,0340** = v1 auf die Ziffer | — |
| Federbreite bei 2,4 / 3,0 | 0,0816 / **0,1020 = 3 ×** | 0,1020 |
| Nase: Exponent bei `bulb` .85 / 1 | **n 2,9 / 2,0** | n 2,0 |
| Nase: Tiefe abgetastet (`hit`) | **true** | **true** |
| Zustand beider Bauteile | `OK` / `OK` | `OK` / `OK` |

`taper` 0 + `thickness` 3 liest im Bild als **zwei massive Balken** (Georgs »blockige eyebrows«),
`bendLeft −0,7 / bendRight +0,7` als ein konkaves und ein konvexes Brauenende in EINEM Gesicht.

### Wortdisziplin

»Knolle« ist der Körper der Nase, »bulb« ihr Regler; »Balken« ist die Braue bei `taper` 0.
Die Braue bleibt **eine Kurve mit einer Maske** — auch mit zwei Biegungen sind es nie zwei Brauen.

---

## S8–S10 · GEORGS PLAN VOM 10.09. (bestellt, nicht gebaut)

1. **Schnurrbärte (S8, als Nächstes).** Moustache-Varianten (Dalí · Nietzsche · Biker · …) mit **derselben
   Tusche-und-Strich-Logik wie die Braue**, **Presets frei wählbar** (Georg 10.09., nicht an die Brauen-Ausdrücke
   gekoppelt): ein Modul `studio-v12/pet-moustache.v1.js`, Anker wieder
   `rig.eyeFrame()` **plus** die Nasenlage (`nose.frame.center`), damit er unter der Knolle sitzt und nicht
   im Mund. Presets als Punktfolgen wie `PRESETS` der Braue; Dicke/Auslauf/Biegung erben die Kennlinien aus
   `brow-rig.v2.js` (eine Feder, ein Eigentümer). Bärte danach (Kinn, Backen) auf demselben Weg.
2. **Blaster-Mods für den Arena-Hasen (S9).** Kenney Blaster Kit 2.1 im Repo:
   `media/3D_Assets/kenney_blaster-kit_2.1/`. **Gemessen, nicht vermutet** (10.09., HTTP-Kopfabfrage aus dem
   laufenden Fenster): `Models/GLB format/blaster-a.glb` → **206**, `Previews/blaster-a.png` → **206**,
   `Models/blaster-a.glb` → 404. Die Baumansicht des Werkzeugs listet `.glb` NICHT — das ist ein Filter,
   kein Fehlbestand; der Katalog steht in den **40 Vorschaubildern**: 18 Blaster (a–r), 2 Magazine, 3 Zielfernrohre,
   2 Schalldämpfer, 2 Granaten, 4 Geschosse (Schaum/Spitze), 3 Kisten, 5 Ziele + Splitter, Rauch;
   Textur `Models/GLB format/Textures/colormap.png`, `License.txt` liegt daneben.
   Einbau: ein Dropdown **im Body-Tab des Zweibeiners** (kontextuell, wie `V2CFG_BIPED` in S5), das die
   Default-Waffe des `gun`-Körpers ersetzt; Farbe/Look weiter über `gun-look.js` (`pet.gun`), Auswahl in
   `pet.gun.model`. Power-ups/Skins = dieselbe Liste mit anderer Palette, keine zweite Mechanik.
3. **Cube-Pets ohne Arme (S9b).** Sie können keine Waffe halten → **Ankerpunkte im Netz** statt Hand:
   ein gemessener Punkt je Zustand (idle · shoot/aim · upgrade/mods), abgetastet wie die Augen (Strahl auf die
   Körperfläche), damit die Waffe daneben schwebt/aufsitzt. Erst messen, dann bauen.
4. **3D-Brillen als Frankenstein-Layer (S10).** Eigene Modelle über dem Augen-Rig, Anker `rig.eyeFrame()`
   (left/right/radius geben Pupillenabstand und Größe her) — dasselbe Muster wie Braue und Nase, also
   kein Eingriff ins Rig. Reihenfolge nach den Bärten, weil Modelle beschafft werden müssen.

**Offene Frage an Georg (S8):** — **entschieden 10.09.: Schnurrbart-Presets sind FREI wählbar**, unabhängig von
den Brauen-Ausdrücken; ein Knopf »an die Braue koppeln« kann später dazukommen, ist aber nicht Teil von S8.

---

## S9 · DIE KENNEY-BLASTER SIND WAFFEN-MODS (10.09.2026)

`studio-v12/weapon-mods.v1.js` (neu) + vier Eingriffe im Wirt (Modul laden · `_applyWeaponMod` · Wähler im
Body-Tab des Zweibeigers · drei Bedienwege). Georgs Bestellung: das Kit »statt der default gun … als dropdown
kontextuell anbieten«.

**Das Modul baut keine Waffe, es tauscht eine.** Das Standardgewehr ist der EIGENTÜMER der Zahlen: seine Lage,
seine Lauflänge und sein Knochen sind das Maß, der Mod wird darauf gebracht. Gefragt wird zuerst nach dem
NAMEN, den der Wirt selbst benutzt (`figure.getObjectByName('Gun')`) — gesucht wird nur, wenn es den Knoten
nicht gibt (dann: plain Netze unter einem Knochen mit Hand/Faust/Handgelenk im Namen, Pet-Overlays
ausgeschlossen, sonst wäre der Face-Host am Kopfknochen das »Gewehr«). Gemessen wird in **Knochen-Koordinate**,
nicht in der Welt — die Figur wird skaliert, gedreht, animiert; eine Weltkiste wäre eine Momentaufnahme.

**Abnahme (gemessen an FrizzleBob, Variante `gun`, Bilder in `captures/v12s9/`):**

| Prüfung | Messwert |
|---|---|
| Gun-Knoten gefunden | **4 Netze am Knochen `FistR`** (deckt sich mit der Quelle: »vier PLAIN Meshes `Cube003*`«) |
| Referenzmaß | Lauf **2,2181** entlang **y** in Knochen-Koordinate, Mitte [0,0644 · 0,5538 · 0,2962] |
| Mod `blaster-h` | eigene Länge 0,648 entlang z → **ein** Faktor ×3,4229, Weltkiste 0,879 × 1,036 × 0,895 |
| Standardgewehr | **4 von 4 ausgeblendet**, sichtbar 0 |
| Zurück auf `none` | **4 von 4 wieder sichtbar**, Mod aus dem Baum, `OK` |
| Skin `kfb` | 2 Materialien, **2 texturiert** (die Kenney-Colormap bleibt), Farbe #e96049 — auf **Kopien**, nicht am gecachten Original |
| Fehlervertrag | `{status:'UNSUPPORTED', field:'model', reason:'Unknown model id'}` |
| Variante `plain` | kein Gewehr → kein Maß → UNSUPPORTED, Zeile **grau statt versteckt** |

**Katalog gemessen, nicht geraten** (40 Vorschaubilder gelesen): 18 Blaster a–r (Stufe 1/2/3 nach Buchstabe) ·
2 Granaten — das sind die **20 Handstücke**, die der Wähler anbietet; dazu Magazine, Zielfernrohre,
Schalldämpfer, 4 Geschosse, 3 Kisten, 5 Ziele, Rauch: im Katalog mit `slot`, aber **nicht als Waffe**, weil
sie keine sind. GLB-Adresse mit kodiertem Leerzeichen (`Models/GLB%20format/`), je Sitzung einmal geladen.

**⚠ Benannte Grenze, nicht versteckt: die Richtung des Laufs ist NICHT gemessen.** Eine Hüllkiste kennt die
längste Achse, aber nicht vorn und hinten — ein Blaster kann darum rückwärts in der Faust liegen. Dafür gibt es
`yaw` / `roll` / `along` / `up` als **Handgriffe** in der Oberfläche, keine stillen Konstanten. Die ehrliche
Lösung wäre, die Mündung des Standardgewehrs zu messen (das vorderste Netz entlang der Laufachse) — eigene
Scheibe, sobald Georg sagt, welche Blaster im Spiel bleiben.

**Georgs zweite Hälfte (S9b, geplant, nicht gebaut):** Cube-Pets haben keine Arme → **Ankerpunkte im Netz**
statt Faust, je Zustand einer (idle · shoot/aim · upgrade/mods), abgetastet wie die Augen. Der Vertrag steht
schon: das Modul verlangt nur einen Knochen-ähnlichen Wirt und eine Referenzkiste — ein gemessener Ankerpunkt
kann beides liefern.

---

## S8 · DER SCHNURRBART TRÄGT DIESELBE FEDER (10.09.2026)

`studio-v12/pet-moustache.v1.js` (neu) + fünf Eingriffe im Wirt (Abschnitt, Zustand, Modul, `_mountMoust`,
Bedienwege). **Frei wählbare Formen** (Georgs Entscheidung 10.09.), acht Stück: `walrus` · `nietzsche` · `dali` ·
`biker` · `chaplin` · `pencil` · `horseshoe` · `handlebar`.

**Ein Zeichner, nicht zwei:** die Dick-Dünn-Kennlinie wird aus `brow-rig.v2.js` IMPORTIERT (`hbAt`) — gemessen
trägt »Dicke 1« an Braue und Bart **dieselbe Zahl 0,0340** (`gleich true`). Auch die Kurve, die Maske, der
Shader, die 13-Strahlen-Abtastung der Kopffläche und der `gen`-Lebenszyklus sind das Verfahren der Braue.
Eigener Startwert der Feder (**2002** gegen 1001), damit zwei Striche derselben Hand entstehen und nicht die
Kopie eines Strichs.

**Drei sachliche Unterschiede:** Anker **unter der Nase** (`nose.frame`, gleiche lokale Koordinaten; ohne Nase
Augenmitte − 1,55 R, die Oberfläche sagt welcher Fall gilt) · **Hängen** (`sag`, Bogen über die ganze Spanne,
Mitte bleibt) · **Locke** (`curlLeft`/`curlRight`, nur im äußeren Drittel, Fenster ((|x|−0,55)/0,45)², damit die
Mitte gerade bleibt).

**Eine Form setzt ALLE ihre Regler** (Dicke, Spanne, Hängen, Locke, Maske) — sonst trägt ein Dalí die Dicke
eines Walrosses und heißt trotzdem Dalí; Lage, Kopfrundung und Farbe bleiben stehen, die gehören zum Kopf.
Gespeichert wird der ganze Satz nach `pet.moustache` (gemessen: `{style:'walrus', th:2.6, sag:0.75, curl:−0.25}`).

**Abnahme (Bilder in `captures/v12s8/`):** alle acht Formen `OK` mit unterscheidbarem Fußabdruck — Bildpunkte
**dali 740** · pencil 1558 · chaplin 2178 · biker 3081 · handlebar 3217 · horseshoe 5829 · walrus 7127 ·
**nietzsche 9392** (die dünnste Form ist die kleinste — das Kriterium, das eine Form fängt, die heimlich wie die
vorige aussieht) · Federbreite von 0,0230 bis 0,1020 · Anker beim Hasen **nose** (9/13 Strahlen), beim Cube-Pet
**eye-line** (9/13, 1181 Bildpunkte) · Schema `kfb.moustache/0.1` · falscher Wert → `UNSUPPORTED`.

**⚠ Eine eigene Abnahmezahl war zuerst sinnlos:** der erste Bildpunkt-Vergleich meldete **0** — nicht weil der
Bart fehlte, sondern weil er per Vorgabe **AUS** ist (ein Bart ist eine Entscheidung, kein Grundzustand) und ich
ein unsichtbares Netz mit sich selbst verglichen habe. **Eine Messung an einem abgeschalteten Bauteil misst den
Schalter, nicht das Bauteil.**

---

## VERSIONSPRÜFUNG (10.09.2026, nach S8/S9)

Alle Ladewege des Wirts und der Module maschinell aufgelöst: **25 von 25 Verweisen vorhanden**, keine Leiche,
keine doppelte Fassung im Lauf. Der Wirt lädt aus `studio-v12/`: `ground-plane.v2.js` · `pet-eye-rig.v6.js` ·
**`brow-rig.v2.js`** · **`pet-nose.v2.js`** · **`pet-moustache.v1.js`** · `frizzlebob.v4a.js` · `gun-look.v4a.js` ·
**`weapon-mods.v1.js`**. Modul-Importe: `pet-moustache.v1` → `../kfb-ink-canon.js` + `./brow-rig.v2.js` (beide da),
`brow-rig.v2` → `../kfb-ink-canon.js`, `frizzlebob.v4a` → `./gun-look.v4a.js`; Nase und Waffen-Mods importieren
nichts. **Rückwege liegen unangetastet daneben:** `brow-rig.v1.js` (8,3 kB) und `pet-nose.v1.js` (6,2 kB) — eine
Zeile im Wirt genügt.

**⚠ Das Prüfwerkzeug selbst war zuerst falsch** und meldete vier fehlende Dateien
(`pet-LIBRARY.js`, `kfb-pets.js`, `bubble-shapes.js`, `kfb-pinball-sfx.js`). Es gibt sie nicht — es sind
**`.json`-Bänke**, und mein Muster `\.(js|json)` hat bei `pet-LIBRARY.json` das kürzere `js` zuerst gegriffen
und den Namen mitten im Wort abgeschnitten. Alle vier liegen als JSON an ihrem Platz (20,4 / 35,6 / 3,1 /
17,6 kB). **Ein Prüfwerkzeug, das rot meldet, muss zuerst selbst geprüft werden** — dritte Wiederholung dieser
Klasse in diesem Projekt (V2-S7: eine Abnahmezahl, die vom Spielzustand abhing).

---

## S7b · STANDALONE NEU GEBAUT (10.09.2026)

`export/KFB Pet Studio v12 standalone.html`, **1,3 MB**, aus `export/src/KFB Pet Studio v12 standalone-src.dc.html`
(die Quelle wurde aus dem aktuellen DC neu erzeugt, mit denselben drei Eingriffen wie am 09.09.: Modul-Anker
nach `<helmet>`, lokale `@font-face` raus — gemessen **0** übrig —, Vorschaubild fürs Bündel).

**Abnahme am MATERIAL, nicht am Blick** (Lehre aus S6d), gemessen im Bündel:
`browSchema` **kfb.brow-experiment/0.2** · `noseSchema` **kfb.nose/0.2** (also wirklich die v2-Bausteine) ·
Strahlen **13/13** · Federbreite **0,0816** bei `thickness` 2,4 (= 2,4 × 0,034) · Superellipsoid **n 2,0** bei `bulb` 1 ·
Nasentiefe abgetastet (`hit` true) · beide Bauteile `OK` · `libPets` **27** · Mund gebaut ·
**23 Zeichenaufrufe, 21 568 Dreiecke**, Bild = Projekt (`captures/v12s7/handles.png`).

**⚠ Zum vierten Mal dieselbe Falle:** die ersten zwei Aufnahmen des Bündels zeigten eine LEERE Bühne — das war
der Bildabgriff (WebGL-Puffer nicht lesbar), nicht die Szene; im nächsten Versuch stand der Hase da.
Eine leere Aufnahme ist kein leeres Bild. Und: der Kamera-Griff heißt `cam`, nicht `camera` —
`render(scene, undefined)` wirft in three eine Meldung über `parent`, die nach einem Szenenfehler aussieht.

**Grenze, unverändert benannt:** der Anker zeigt weiter auf die Projekt-Serve-URL — die Datei hängt am Projekt.
Unabhängig wird sie mit dem Repo-Upload der **zwölf** Dateien (Liste, Zielpfade und die drei relativen Fallen in
`UPLOAD_v12_github.md`) und einer Zeile auf jsdelivr.

**Nachtrag 10.09. (nach S8/S9):** neu gebündelt, wieder **1,3 MB**. Abnahme am Material im Bündel:
`kfb.brow-experiment/0.2` · `kfb.nose/0.2` · **`kfb.moustache/0.1`** · Bart `nietzsche` mit Feder **0,1020** am
Anker **nose** (9/13 Strahlen) · Waffen-Mod **`blaster-c` aus dem Repo geladen**, Knochen `FistR`, Referenz
2,2181/y, Faktor ×4,6662, **4 Standardnetze ausgeblendet**, Textur 1/1, `status OK`.

## 0 · Georgs Auftrag (09.09., Diktat, geordnet)

1. Combat Arena v1 war ein Testballon, wird hier nicht weitergeführt; der echte Kampf entsteht in WS-A.
2. **v11 ist die Grundlage.** Erste Scheibe: der Arena-Hase als Bewohner — dieselben Tabs, dasselbe
   Augen-Rig, dieselben Trigger wie die Cube-Pets, plus seine 19 eigenen Clips. Beide Körper (mit und
   ohne Waffe) austauschbar.
3. Danach Oberfläche aufräumen (Zwei-Drittel-Bildschirm, Paletten ein/aus, Tab-Leiste prüfen).
4. Später ein Tab für figurnahe Kampf-Effekte (Schuss, Schlag, Treffer, Ton), mit Vertrag, damit WS-A
   sie importiert. Grenze: **was an der Figur hängt, gehört ins Studio** (Gesicht, Clips, Pad mit
   Schatten, figurnahe Effekte); Partikelwolken und Arena-Ebene nicht.
5. Ziel: Export + Bauanleitung für den kompletten Hasen aus v12.
6. Brauen als eigene Reise danach.
7. Reihenfolge (a): Hase zuerst, Oberfläche danach — Georg 09.09.

## 1 · Vorbild zuerst (Schritt 0)

- **Klo-Rolli in v11** (`_loadHanging`, Z. 1502–1597): fremder Körper als Bewohner über EIN Feld
  `kind: 'hanging'` im Roster; `loadPet` verzweigt; das Modul bringt die Gesichts-FLÄCHEN
  (`eyeCtx()`, `mouthCtx()`), das Studio baut Augen und Mund mit SEINEN Bauwegen (`_buildEyeRig`,
  `_mountMouth`) — »ein Regler-Satz, kein zweites Panel«. `_petBox()` liest den Wurzelknoten des
  Bewohners. Genau das wird kopiert.
- **Arena-FrizzleBob** (`combat-arena-v1/frizzlebob.v1.js`): lädt `Character.gltf` /
  `Character_Gun.gltf` vom RAW, misst Kopfbox aus den Knochen (Ohren ausgeschlossen), hängt einen
  unsichtbaren ELLIPSOID-Host (`body`, opacity 0) an den Kopfknochen mit Weltachsen der Bindepose,
  blendet die Original-Augen (`EyeColor`) aus, tönt `Main`/`Main_Light` gelb, spielt 19 eigene Clips,
  hält den Boden per `_groundKeep`. Baut Augen/Mund SELBST über `faceCtx()`.
- **Post Mortems Boden** (podcast-v3, spinballcast-v6): der Studio-Boden funktioniert, jeder Ersatz
  war der Fehler. Der Hase bekommt den Studio-Boden (`ground-plane` + `plant`), keinen eigenen.
- **Post Mortem Ersatzkörper/Rolli**: kein eigener Wirt, kein Nachbau; Gesichtsteile auf Kopfform.
  Der Hase HAT eine Kopfform (Ellipsoid gemessen) — die Rolli-Falle stellt sich nicht.

## 2 · Gemessen (09.09., an den Dateien)

- v11 `loadPet` Cube-Zweig: `ch.load` → `scale 1.6` → `_buildLidSampler` → `reskin` → `_buildEyeRig(ch, p)`
  → `_mountMouth()` → `_measureNow` → `_applyStage` → `_padMeasure`. Alles setzt `this.ch` (Cube-Pet)
  voraus. Hängender Zweig überspringt Stage/Measure/Pad bewusst.
- `_buildEyeRig(ctx, p)` erwartet ein `ctx` mit `THREE`, `inner`, `o`, `_squash`, `getFaceShells()` —
  genau, was `frizzlebob.faceCtx()` liefert.
- `_mountMouth(ctx)` nimmt optional einen Ctx (Rolli-Weg) und liest `p.mouth`.
- Motion-Tab: `ANIMS`/`CLIP8` sind Cube-Pet-Kennungen (`idle`, `enter`, `run`…) → `this.ch.play(t)`.
  Für den Hasen braucht es eine ZWEITE Quelle: seine eigenen Clip-Namen (Idle, Walk, Run, Punch,
  HitReact, Death, Duck, Jump…). Der Motion-Tab bekommt eine `custom`-Zeile, die die Clips des
  aktiven Bewohners listet — kein zweiter Tab.
- Tick: `animate()` ruft `ch.update`, `rolli.update`, `rig.update`, `mouth.update`. Der Hase braucht
  `update(dt, cam)` an derselben Stelle wie Rolli.
- `frizzlebob.v1` braucht im `ctx`: `three`, `assets.raw(path)`, `gltfLoader`, `eyeRigModule`,
  `mouthModule`, `rng`, `clock`, `pointer` (optional), `camera`, `prepare` (optional), `log`.
- Größe: Hase 3,600 hoch (Bindepose). Cube-Pet steht mit Skala 1,6 bei ~1,2 Welt. Eigentümer der
  Bühnengröße im Studio ist `_applyStage` (Grundform × Füllung). Für einen Zweibeiner ohne Grundform
  gilt wie bei Rolli: EIN Maß, hier die **Körperhöhe auf Pet-Größe** (Faktor aus Cube-Pet-Höhe).

## 3 · Modell (halbe Seite)

| Größe | Eigentümer | Leser |
|---|---|---|
| Körperhöhe im Bild | `_loadBiped` (Skala aus Zielhöhe / gemessener Höhe) | Kamera (`_petBox`), Boden |
| Bodenhöhe | `ground-plane` (`_gnd.state.groundY`) | Hase: Wurzel auf groundY; `_groundKeep` bleibt aus (Studio pflanzt) |
| Kopfform (Ellipsoid) | Modul (aus Knochen gemessen) | EyeRig, PetMouth über `faceCtx()` |
| Augen-/Mundwerte | Roster-Eintrag `p.eye`/`p.mouth` (Vorgabe aus SPEC des Moduls) | `_buildEyeRig`, `_mountMouth` — dieselben Regler wie bei Pets |
| Gelb | Modul `tint` (Kanon 0xf2c93c) | Lidfarbe = `p.color` |
| Clips | Modul (19 eigene) | Motion-Tab, `custom: _bipedClipRows` |
| Körper-Variante | Roster (zwei Einträge: `frizzlebob`, `frizzlebob-gun`) ODER Umschalter im Body-Tab | `setVariant` |

**Entscheidung E-1:** zwei Roster-Einträge statt Umschalter — »beide Modelle austauschbar« heißt in
der Pet-Liste wählbar wie jedes Pet, und der Export je Eintrag bleibt eindeutig.
**Entscheidung E-2:** `frizzlebob.v1.js` wird **kopiert** nach `studio-v12/frizzlebob.v1.js`
(byteidentisch) — die Arena bleibt eingefroren, v12 hat einen eigenen Ladeweg. Änderungen am Modul
nur additiv, in einer v2 daneben.
**Entscheidung E-3:** kein `_groundKeep` im Studio — der Studio-Boden pflanzt (Post Mortem II).

## 4 · Grenzfälle

- Start mit dem Hasen in der Sitzung → wie Rolli: Startzustand ist ein Cube-Pet, Hase über die Liste.
- Kein Netz (RAW nicht erreichbar) → Fehler landet in `loadErr`, sichtbarer Ausfall.
- Wechsel Hase → Cube-Pet → `_disposeBiped` blendet ein, `ch.group.visible = true`.
- Wechsel Hase → Rolli → beide Dispose-Wege laufen vor dem Bau.
- Schmales Fenster → Tabs wie bisher, keine neue Fläche.

## 5 · Abnahme dieser Scheibe

- Bild: Hase gelb, Augen + Mund sitzen am Kopf, Idle läuft, steht auf der Platte mit Schatten.
- Face-Tab: dx/dy/ring/inset verschieben die Rig-Augen des Hasen (dieselben Regler).
- Motion-Tab: 19 Clips als Knöpfe, jeder spielt (Konsole: Clipname).
- Zweiter Eintrag »FrizzleBob · Gun« lädt das andere GLB, Gesicht sitzt gleich.
- Rückweg: Cube-Pet wählen → Hase weg, Pet sichtbar, Boden unverändert.
- Konsole: `[frizzlebob]`-Zeilen wie in der Arena, kein Fehler.

## 6 · Changelog (additiv, neu oben)

**V12-S6d · 2026-09-09 · DER »TEXTUR-BUG« IM STANDALONE WAR EIN 404** (Georgs Bild: Bunny als goldener Knetklumpen,
im Projekt Papier). Gemessen am Material, nicht am Bild: Standalone `texture 'proc'`, `uHasTex 0`, `uTex 1×1`,
`surf.texScale 0,9 / knet 0,22` (= Startwerte), aber `uLook 2` + `uPaper 0,32` — Pfad »Colormap + Papier + Gelb«
ohne Papier, also Prozedur-Rauschen als Papier. Projekt: `texture Paper004`, `uHasTex 1`, `uTex 1024²`, texScale 0,3,
relief 1,2, knet 0 — aus `koerper.material.live` des Vertrags. **Ursache:** `LIB_URL = './studio-v3/PET_EDITOR/
pet-LIBRARY.json'` wurde relativ zur SEITE geholt → im Bündel 404 → `lib = {pets:[], face:{}, emotes:[]}` → kein
`material.live`, kein `_applyLive`, keine Emotes. Kein Shader-Fehler; **ein relativer Datenpfad, der in der Vorschau
geht und im Export bricht** (Pfad-Hygiene §6 session-export, drittes Vorkommen im Haus). Behoben: `LIB_URL`, der
lokale Vertrags-Rückweg und der Audio-Import lösen über `__KFB_MODBASE`. **Gemessen danach im Bündel:** libPets 27,
emotes 6, `Paper004`, `uHasTex 1`, `uTex 1024×1024`, Regler-Werte = Vertrag. Bild = Projekt.
**Lehre:** Ein Standalone wird am MATERIAL abgenommen (uLook/uHasTex/uTex), nicht am Blick — »sieht texturiert
aus« war beim Klumpen wahr und trotzdem falsch.

**V12-S6c · 2026-09-09 · STANDALONE 1,3 MB, LÄUFT** — erster Versuch 5,0 MB mit leerer Bühne (dieselbe Wand wie Boxel
Blitz v4/v5: 13 dynamische `import(abs('./…'))` lösen relativ zur Seite auf, das Bündel trägt sie nicht mit; 17
lokale @font-face machten die Größe). Zwei Eingriffe: (1) **Modul-Anker** — alle drei `abs()`-Helfer und der
`bubble-shapes`-Fetch lösen gegen `window.__KFB_MODBASE || location.href` auf; im Projekt ungesetzt = wie bisher.
(2) Standalone-Quelle `export/src/` = Kopie des DC ohne @font-face (Georg: »kann weg«) + Anker-Zeile.
**Gemessen im Bündel:** Bunny mit Braue · Hase `yellow-asset`, 18 Clips, Braue/Nose `OK`, Mundset `male` (Repo-RAW,
war schon immer per Link) · Schrift `Special Elite` aus dem Google-Link. **Grenze, benannt:** der Anker zeigt auf die
Projekt-Serve-URL — die Datei hängt noch am Projekt. Unabhängig wird sie mit dem Repo-Upload der Bausteine
(HANDOVER Frage 3) und einer Zeile auf jsdelivr.

**V12-S6b · 2026-09-09 · PROBE-WERTE STANDEN IM ENTWURF** (Prüferbefund, zwei Runden): meine Messreihen (Nase 1,3/Glanz 1,
Braue critical-angry/Maske 0, splay 0,5; Bunny skeptical/Maske 0) liefen über die echten Regler-Handler und
landeten damit als ENTWÜRFE im Sitzungsspeicher **`kfb-pet-studio-v5`** (dort wohnen die Entwürfe; `kfb-pet-library-v9`
ist der Bibliotheksschlüssel — erste Fassung dieses Eintrags nannte den falschen) — Georg hätte sie beim Öffnen als
Vorgabe gesehen. Zurückgesetzt über dieselben Handler (Bunny: neutral/0,35 · Hase: neutral/0,35, Nase 0,9/0,55,
splay 0), Entwurf gesichert, **kein localStorage gelöscht**. **Zweite Runde:** der Entwurf `frizzlebob-gun` trug die
Probe-Braue weiter, weil die Gun-Variante in der Reset-Sitzung nie geladen war — die geteilte Referenz greift erst
beim Laden, und Laden allein markiert den Eintrag nicht als berührt (`_flushDrafts` → 0). Gun geladen, ein Regler
berührt, geflusht (→ 1); danach im Speicher **0 Treffer** für `critical-angry` / `mask 0` / `size 1.3` / `splay 0.5`,
Gun-Entwurf trägt neutral/0,35, Nase 0,9/0,55, splay 0.
**Lehre:** eine Messung über die Regler-Handler ist eine SCHREIBENDE Messung — vor dem Bericht die Werte
zurückdrehen oder gleich am Modul (`rig.setEye`, `brow.set`) messen, das den Vertrag nicht anfasst. Und: ein
geteiltes Objekt teilt sich im SPEICHER nicht von selbst — jeder Roster-Eintrag hat seinen eigenen Entwurf.
**Nicht von mir, aber im Entwurf:** Bunny `eye.anchor.dx` 0,4 gegen Repo 0,34 (Guard-Meldung seit Sitzungsstart) —
stehen gelassen, Georg entscheidet.

**V12-S6 · 2026-09-09 · DIE NASE** — `studio-v12/pet-nose.v1.js` (neu, Georgs Nachlieferung C + »KFB rot mit
glanzlicht-regler«): quergestelltes abgerundetes Rechteck (ExtrudeGeometry mit Fase, Eckradius als Regler
»Knubbel«), Farbe `#e96049` (= `dice.shell` aus gun-look), MeshPhysical mit Clearcoat; **gloss 0…1** fährt
Rauheit 0,75→0,15 und Clearcoat 0,15→1,0 (gemessen bei 1: rough 0,15 / cc 1,0, Glanzlicht sichtbar). Anker:
derselbe öffentliche `rig.eyeFrame()` wie die Braue, `sync()` je Bild; Tiefe per Strahl auf die Kopffläche
(`hit true`, skinZ 0,718 beim Hasen), Größe in Einheiten des Augenradius (0,9 → 0,42 × 0,26 × 0,24). Werte in
**`pet.nose`**, geteilt plain/gun (gemessen `shared true`). Vorgabe AN beim Zweibeiner, AUS beim Cube-Pet (die
Kenney-Tiere haben eine Schnauze im Netz). Face-Tab »Nose · cartoon knob«: Schalter, 6 Regler, 6 Farben.
**Eine Zahl nach dem Bild korrigiert:** Höhe 0,75 R → 0,55 R, weil die Nase bei 0,75 auf dem Mund (dy −0,60) saß.

**V12-S5 · 2026-09-09 · BODY-TAB FÜR DEN ZWEIBEINER (c1)** — steht ein Biped auf der Bühne, tauscht der Body-Tab
seine Abschnittsliste (`V2CFG_BIPED`): Material/Farbe/Body contract/Ground contract fallen weg (Surface, Reskin,
byCube greifen beim Hasen nicht — der S1-Rest), stattdessen EIN Abschnitt »Biped · variant · weapon«: Variante
(lädt das Roster-Geschwister über `loadPet`, kein zweiter Lader) · Munitions-Look aus `GUN_PALETTES`
(gun-look.v4a: nur `dice` ist `implemented`, die drei anderen stehen GRAU mit »soon«, weil das Modul sie per
Vertrag verweigert) · Hülsenfarbe (6 Swatches, KFB-Rot vorn; schreibt `pet.gun.shell`, geteilt plain/gun) ·
Messzeile (Datei, Quelle, Bindehöhe, Bühnenmaßstab, Waffenknoten). Licht und Bodenfläche bleiben — sie gehören
dem Wirt. **Abnahme:** Gun-Materialien nach Swatch `#2b3440`: Gun_Grey umgefärbt, Black/Main/White (Griff/
Akzent/Licht) unverändert = dieselbe Zuordnung wie `applyGunPalette`; `pet.gun` geteilt; Palette+Hülse werden
beim Neuladen wieder angelegt.
**⚠ Zwei Stunden Messung, ein Befund, und der war Hausregel 8 zum DRITTEN Mal:** im Bild fehlten Augen und Mund
des Gun-Hasen — Geometrie sagte »da« (sichtbar, richtige Lage, Skin 0,083 vor dem Zentrum bei R 0,132), das
Pixel sagte »Haut«. Ursache: **`document.hidden` im Vorschaufenster** — die Bildschleife steht, `rig.update()`
läuft nie, die Lider bleiben in der Bau-Pose (Rotation 0 = **geschlossen**, gelb auf gelb), und meine
Zwangs-Render zeigten genau diesen Stand. Ein manueller `rig.update()` → Lider −1,22, Augen offen. **Nichts
war kaputt.** Neue Prüfroutine: im Standbild 30× `rig.update/brow.sync/nose.sync/mouth.update` von Hand,
DANN rendern.
**Ein echter Fund nebenbei (v6a in `pet-eye-rig.v6.js`):** der Splay-Vorschub 0,35 R / 0,6 R war laut S3 eine
Schätzung — jetzt wird die Kopffläche ENTLANG DER GEDREHTEN ACHSE abgetastet und dieselbe Formel wie geradeaus
angewandt (Treffer − R·(0,24 + inset·1,15)); Schätzwert nur noch Rückweg ohne Treffer. Gemessen am Gun-Hasen:
splay 0 z 0,488 · 0,5 z 0,369 (x 0,40 → 0,55) · 0,9 z 0,269 — die Kugel wandert außen um den Ellipsoid,
Skin 0,083 vor dem Zentrum in JEDER Stellung. Importzeile trägt `?v6a`.

**V12-S4 · 2026-09-09 · DIE BRAUE HÄNGT AM AUGE** — `studio-v12/brow-rig.v1.js`, Port von Astras jüngster Fassung
(`Studies/Acting-Lab-v0.2/brow-rig.js`, 106 Zeilen: D04 fast schwarz `#17130f`, Dicke 1,0, Auslauf 0,85, runde
Innenkappen). Kurve, Feder (`inkHalfWidth` aus `petstudio-v9/kfb-ink-canon.js`, dieselbe Datei wie sein vendor/),
Shader, sieben Presets und `validate()` WÖRTLICH übernommen; vier Änderungen am Rand: (1) Anker NUR über den
öffentlichen `rig.eyeFrame()` (kein `rig.eyes`/`_R`) · (2) `sync()` je Bild bindet nach jedem Rig-Neubau neu
(`gen`-Zähler + Elternvergleich; ein Vergleich, solange nichts passiert) · (3) fehlender Anker = ausgeblendet +
`{status:'UNSUPPORTED'}` in `brow.last`, kein Wurf · (4) Netz trägt `petOverlay` UND `noMeasure`. Im Studio:
`_mountBrow(p)` läuft in `_buildEyeRig` — derselbe Bauweg für Cube-Pet, Rolli und Hase, keine Zeile je Bewohner.
Eigentümer der Werte ist **`pet.brow`** (Entscheidung gegen `face.brow`: `eye`/`mouth` liegen auch direkt am Pet);
gespeichert werden **Punktfolge + Maske**, `expr` ist nur das Etikett; beim Hasen teilen plain/gun EIN Objekt
(gemessen `browShared true`). Face-Tab: Abschnitt »Brows · one curve, one mask« — Schalter, 7 Ausdrücke, 9 Regler,
drei Tuschen (D04 · Kanon-Figur `#2b1d14` · aus dem Körper), Statuszeile mit `gen`.
**Abnahme am Bild + Zahlen:** Bunny: Braue über beiden Augen, Mitte maskiert, 258 Punkte, `parentIsEyeParent true`,
status OK · Hase: Braue sitzt auf dem Ellipsoid-Kopf, Elternknoten `body` (der Host) · **critical-angry liest sich
als EIN Gesicht** (links hoch, rechts runter) · **splay 0 → 0,5 baut das Rig neu (gen 1 → 2), die Braue folgt ohne
Zeile** (das Kriterium aus dem Handover: kein alter Elternverweis) · **Maske 0 = Monobraue**, gleiche Geometrie ·
`pet.brow` nach dem Klick: 5 Punkte + `expr`. Konsole: keine Fehler.
**Vorher, ohne Eintrag (S3b):** `eyeFrame()` in `pet-eye-rig.v6.js` — `{left, right, radius, parent, rig, gen, unit}`
im System des Elternknotens; `gen` zählt in `build()`. Das war die Vorbedingung 1 aus Astras Handover.
**Offen/Backlog (aus Handover, gilt weiter):** Braue hängt am Auge, nicht an der Fläche — bei 35° Gier schweben
die Spitzen (Tiefenpolitik: grafisches Overlay vs. Flächenanpassung, Georgs Entscheidung) · Lesbarkeit bei 96/48 px
am Bild noch nicht bewertet (D06) · »brows only«-Isolation (Wimpern stumm) nicht gebaut · Körperfarbe-Wechsel
(Swatch) frischt `autoColor` erst beim nächsten Neubau auf · Body-Tab für Zweibeiner (S1-Rest) ist die nächste
Scheibe (Georg: a → c → b), danach die Nase (`pet-nose.v1.js`, derselbe Anker).

**V12-S3 · 2026-09-09 · AUGEN NACH AUSSEN, KENNEY-AUGEN WEG** — (a) `studio-v12/pet-eye-rig.v6.js`, Fork von
`studio-v3/pet-eye-rig.v5.js` mit EINEM Eingriff: `splay` 0…1 dreht beide Augen spiegelgleich um die Hochachse
nach außen (× 45°) und rückt sie entlang der neuen Blickrichtung nach vorn; Standard 0 = v5-Bild (Bunny gemessen
rot 0,000/0,000). Regler im Face-Tab (»splay · nach außen drehen«), Wert geht in `pet.eye.splay` — beim Hasen
also geteilt zwischen plain/gun. v5 bleibt Ladeweg von v9/v10/v11/Arena/SpinballCast. (b) Kenneys aufgemalte
Augen sind DREI eigene Netze am Kopf (gemessen: Iris `EyeColor` 60 Dreiecke · Sklera `White` 20 · schwarze
Ringe `Black` 112) — alle drei ausgeblendet + `noMeasure`. Ausblenden IST hier der Schnitt (eigene Netze, keine
Schalen im Kopfnetz wie bei den Cube-Pets). **Abnahme am Bild:** Hase von vorn ohne schwarze Ringe, Rig-Augen
frei; splay 0,5 → rot.y −0,393/+0,393, x −0,436/+0,436; ¾-Ansicht: Augen liegen außen am runden Kopf.
**Backlog:** splay oben/unten (zweiter Regler) · Kanten-Umbruch: die gedrehte Kugel taucht bei splay > 0,7 in die
Kopfwölbung — der Vorschub (0,35 R / 0,6 R) ist eine Schätzung, kein Abtastwert.

**V12-S2 · 2026-09-09 · DER 4A-HASE IST DIE REFERENZ** (Georgs Bild aus der Arena 4A + »der Bauch hat die
Gesicht/Hand/Fuß-Farbe«). Ladeweg auf `studio-v12/frizzlebob.v4a.js` + `gun-look.v4a.js` (aus Astras Paket
`KFB Combat Arena 4A/`, zwei Pfad-Zeilen geändert: Nachbarimport, Modelle relativ zum Modul) und die
**gepatchten Modelldateien** `petstudio-v9/assets/models/FrizzleBob_Yellow*.gltf` (608/676 kB, Puffer
eingebettet). Farben GEMESSEN an der Datei: Körper `#f2c83c` · Gesicht/Hand/Fuß UND Bauch `#e6b671` ·
Waffe über Würfel-Palette rot `#e96049`/teal. **Das ersetzt den Tönungsweg** (RAW+Tint nur noch Rückweg bei
404, Quelle steht in der Statuszeile: `yellow-asset`). Dazu Georgs Punkt »nicht zweimal einstellen«: beide
Roster-Einträge zeigen auf DASSELBE `eye`/`mouth`-Objekt (Eigentümer = Eintrag ohne Waffe), gemessen
`shared eye obj=true`. Das 4A-Modul misst den Boden nur an GESKINNTEM (Waffe = Zubehör) — die
`noMeasure`-Marke aus S1b bleibt für den Studio-Stempel zusätzlich drin.
**Abnahme:** beide Varianten Skala 0,450 · Fuß auf 0,004 · Waffe rot · Bauch = Gesichtszone · Rig-Augen 2,
Mund da · `frizzlebob.v1.js` bleibt liegen als Rückweg (eine Zeile).
**Aus Georgs Kommentar ins Backlog:** (1) aufgemalte Kenney-Augen (Material `EyeColor`, Sklera `White`)
auch aus der GEOMETRIE schneiden statt nur ausblenden — mehr Spielraum für die Rig-Augen; (2) **Augen
gemeinsam nach außen drehen** (ein Regler, beide Augen spiegelgleich um die Hochachse — für runde Köpfe;
oben/unten später prüfen); (3) Waffenfarben (Schwarz/Grau/Hell) im Studio einfärbbar — nicht im Fokus;
(4) Arena-Licht ist wärmer/satter als das Studio-Licht — Look-Vergleich am Bild, Licht gehört dem Wirt.

**V12-S1b · 2026-09-09 · DIE WAFFE IST ZUBEHÖR, KEIN KÖRPER** (Prüferbefund an der Gun-Variante: Hüllkiste
4,294 statt 3,600, Skala 0,377 statt 0,450 → Hase 16 % kleiner; tiefster Punkt war die MÜNDUNG, die Füße
hingen 0,27 über dem Stempel). Zwei Stellen: (1) `studio-v12/ground-plane.v2.js`, Fork von
`studio-v7/ground-plane.v1.js` mit EINER Änderung — die Messkiste (Pflanzen UND Stempelgröße) überspringt
Netze mit `userData.noMeasure` (Hausregel 7). v1 bleibt unangetastet, weil Rolli/v9/v10/v11 daran hängen;
Rückweg: eine Zeile im DC. (2) `_loadBiped` markiert die Waffennetze und misst die Körperhöhe ohne sie.
**⚠ Erste Fassung falsch:** ich habe am MATERIALNAMEN `Gun_*` gefiltert — gemessen ist die Waffe ein KNOTEN
`Gun` mit VIER Netzen (Black · Gun_Grey · White · Main), nur eins heißt `Gun_Grey`; 1 von 4 markiert, der
Hase stand weiter auf dem Lauf. **Grenze eines Zubehörs ist sein Knoten, nicht seine Farbe.**
**Abnahme:** Gun-Variante Skala **0,450 = plain** · Körper y 0,004…1,624 (H 1,620, identisch zu plain) ·
Fußknochen y 0,015 · Waffe reicht bis −0,31 (unter den Boden — sie ist nicht sein Maß) · Stempel w 1,219 in
beiden Varianten · `noMeasure` 4 · `gnd-v2.0` geladen. Plain unverändert. Offen (klein): mit offener Palette
schneidet der Kamerarahmen die Ohrspitzen (Ziel fest bei y 0,5).

**V12-S1 · 2026-09-09 · FRIZZLEBOB IST BEWOHNER** — `KFB Pet Studio v12.dc.html` (Fork von v11) +
`studio-v12/frizzlebob.v1.js` (byteidentische Kopie aus `combat-arena-v1/`). Zwei Roster-Einträge
(`frizzlebob`, `frizzlebob-gun`, `kind: 'biped'`), `_loadBiped` nach dem Rolli-Weg: Modul baut Körper +
Kopf-Host, **Studio baut Augen und Mund** (`_buildEyeRig(faceCtx)`, `_mountMouth(faceCtx)`) — Face-Tab
greift ohne Zeile Extra. Motion-Tab: neuer Abschnitt »Own clips · biped« (18 Clips als Knöpfe) +
Abbildung der acht Studio-Kennungen (Idle/Walk/Run/Duck/Wave/Yes/No). Tick: `biped.mixer.update`.
**Zwei Fehler auf dem Weg, beide gemessen:** (1) `cubeH` im Bodenvertrag ist schon die Welthöhe 1,20 —
mein Faktor 1,6 war doppelt, Hase stand 2,59 statt 1,62; jetzt Ziel = 1,35 × Pet-Höhe, **gemessen
1,620**. (2) `castShadow` auf 11 Netzen änderte am Boden **0 Pixel** — der Studio-Schatten ist ein
**STEMPEL** (Kamera von oben auf `target`), kein Lichtschatten; Mechanismus geprüft, dann
`_gnd.setTarget(bipedRoot)`, Rückweg `setTarget(ch.group)` in `_disposeBiped`. Abnahme am Bild:
Hase gelb, Rig-Augen und Mund am Kopf, Idle läuft, Stempel unter den Füßen (wandert mit Punch-Pose),
Dropdown zeigt »Frizzlebob«, Rückweg Bunny mit Stempel 0,99. Konsole: `EyeRig module missing` /
`Mouth module missing` aus dem Modul sind **gewollt** (das Studio baut sie).
**Offen aus S1:** Body-Tab zeigt für den Hasen noch Cube-Pet-Regler (Surface/Reskin greifen nicht);
Gun-Variante ungetestet am Bild; `report.ownClips` zählt 18 (Wunschliste nennt 18 + `Walk_Shoot`).

## 7 · Nachlieferungen 09.09. (gelesen, eingeplant, NICHT gebaut)

**C · Georgs Nase (09.09., nach S3):** eine knubbelige, QUERGESTELLTE 3D-Cartoon-Nase für den Arena-Hasen —
**kein Oval, sondern die Kopfform zitiert** (abgerundetes Rechteck, quer), skalierbar, im Rot der Waffe
(`#e96049`), mitten ins Gesicht zwischen Rig-Augen und Mund. Eigenes kleines Rig wie Mund/Brauen (Anker am
Kopf-Host, Regler Größe/Höhe/Tiefe/Farbe), Bauteil `studio-v12/pet-nose.v1.js`. Reihenfolge: nach dem
Brauen-Anschluss, weil beide denselben Augen-Anker brauchen.

**A · WSA-Wunschliste** (`uploads/WUNSCHLISTE_PetStudio_v12-v13_Arena.md`): v12 = kleine
Figuren-Schnittstelle (Brauen optional, Blick-Ziel, Schussausdruck mit Peak am Release, Hit/Stun getrennt,
heilbare Gegner je Instanz, additive Balance, Talk-Cycles) + **Actions-Tab** (Figur → Fähigkeiten →
semantische Aktion auf echten Clip, Play/Scrub/Slow, Mündungsanker, versioniertes Mapping-Export).
v13 = Pose/VFX/SFX in einem Tab mit Solo/Mute, Rezepte als Daten. **Ein Besitzer je Kanal** (Root =
Arena, Körper = Mixer-Eigentümer, Gesicht = Face-Adapter mit Prioritäten). Mindest-Export: `actorId`,
Schema-Version, Gesichtsteile, echte Clipnamen, Root-Motion, Attachments. Rückgabe nach
`KFB Combat Arena/PetStudio-Uebergabe/`.

**B · Briefing-Paket WSA** (`KFB-PetStudio-v12-briefing-v1/`, lokal): `brow-lab/brow-rig.js` ist ein
**lauffähiger Brauen-Prototyp** (87 Zeilen: Catmull-Rom über 5 Punkte, Kanon-Nib `inkHalfWidth`
importiert, Maske im Shader, 7 Presets, `validate()` mit UNSUPPORTED). Liest aber private Rig-Felder
(`rig.eyes`, `_R`) — Voraussetzung fürs Studio ist ein **öffentlicher Eye-Anchor-Provider** am EyeRig.
Entscheidungen dort, die gelten: D04 Brauen **fast schwarz, Dicke 1,0**, innen rund, außen spütz (ersetzt
das Briefing »Farbe aus der Figur, 0,5«) · D05 Brauen **mit** den vier Lidern choreografiert · D06 Lesen
bei **96/48 px**, nicht 24 · D07 gleiche Kern-Größe (Ohren schrumpfen den Körper nicht; Detektor findet
18/24 Würfel — Fox/Tiger/Lion/Deer/Cow/Crab offen) · D08 Arena-FB ist der Portabilitätstest.
Bekannte Grenze: Braue hängt am Auge, nicht an der Fläche — bei 35° Gier schweben die Spitzen.

**Reihenfolge daraus (Vorschlag):** S2 Gun-Variante + Body-Tab für Zweibeiner (Tint/Variante statt
Surface) · S3 **Eye-Anchor-Provider** additiv in `pet-eye-rig.v5` (öffentlich: beide Augen, Radius,
Basis, Rebuild-Ereignis) · S4 `studio-v12/brow-rig.v1.js` aus dem Prototyp, an Bunny UND Hase, Face-Tab
· S5 Actions-Tab-Minimum (Clip-Mapping als Daten, Export) · danach Face-Director/Schussausdruck.
