# KFB Pet Studio v4 — Talking Puppet (Check-in)

**Stand:** 2026-08-04 · **Datei:** `KFB Pet Studio v4.dc.html` (Fork von v3, Motor-Module weiter in
`studio-v3/`) · **Auftrag:** `uploads/HANDOVER_PetStudio_v3_to_v4_TalkingPuppet.md`

Gebaut: **§2a Visem-Mund** (§1/§2), **§Auflage** als Nachtrag (§2b) und nach deiner Look-Abnahme **§2b Treiber-Vertrag** (§2c). Dazu **§Blase** (§2d), **§Ausgabe + §Ruhemund** (§2e), die Kamera-Korrekturen und **§Rote Lippen + §Knick-Bremse** (§8/§9).

**v4 ist geschlossen.** Jeder Slice ist gemessen, dokumentiert und hat einen Rückweg; nichts ist halb
gebaut. Was aussteht, sind **Look-Entscheidungen** (Zahlen im Vertrag) und der **Folge-Slice §2c** —
beides in §7 als v5-Backlog geführt.

> **Sitzung pausiert hier.** Nächster Scope: KFB Travel v14. Wiederaufnahme Pet Studio → v5 über §7.
> Handover an den Coworker + Upload-Kandidaten: **§10**.

### Wegweiser

| § | Inhalt |
|---|---|
| §1–§2e | die gebauten Slices mit ihren Messwerten |
| §5 | was bewusst NICHT passiert ist |
| §6 | die drei `pet-mouth.v1.js`-Fassungen (WS0-Naht) |
| **§7** | **v5-Backlog** — A Look-Zahlen · B Folge-Slices · C WS0 |
| §8/§9 | Rote Lippen: Bestandsaufnahme und Einbau |
| **§10** | **Check-in / Handover an den Coworker** |

---

## 1. Was gebaut ist

### Modul: `studio-v3/pet-mouth.v1.js` (additiv, reversibel)

Fünf benannte Sprech-Formen als **umschaltbare Zustände der bestehenden 13 Decals** — kein neuer
Mund, keine neue Geometrie, kein zweites Material.

```js
VISEMES            // [['closed','Zu'],['open','Offen'],['wide','Breit'],['round','Rund'],['smile','Lächeln']]
VISEME_MAP_DEFAULT // { closed:'m', open:'ah', wide:'ee', round:'oh', smile:'smile' }

mouth.setViseme(id, { pop:false, rest:true })   // -> benutzter Decal-Key oder null
mouth.setVisemeMap({ round:'woo' })             // Teil-Map erlaubt; laufendes Visem zieht mit
mouth.viseme                                    // aktuelles Visem oder null
mouth.visemeKey                                 // das Decal dahinter
```

Kanal-Eigentum bleibt sauber: ein Visem-Wechsel rührt **nur** `mesh.material.map` an. Augen (EyeRig
über PetFace) und Körper (PetMotion) merken nichts.

Was sonst noch angefasst wurde — und warum es rückwärtskompatibel ist:

| Änderung | Warum | Rückwärtskompatibel |
|---|---|---|
| `setTex(name, pop = true)` | gezielte Visem-Wechsel sollen die **Form** zeigen, nicht die Skala | Default = altes Verhalten; alle bestehenden Aufrufer unverändert |
| `talk(true)` setzt `viseme = null` | der Sprech-Shuffle übernimmt den Mund, zwei Besitzer wären ein Fehler | `talk(false)` verhält sich wie vorher |
| `setRest(emote)` setzt `viseme = null` | das Mienenspiel gewinnt gegen ein stehendes Visem | unverändert im Verhalten |
| `MOUTH_DEFAULTS.visemeMap` | Contract-Feld für den Look | wird wie `restMap` **ergänzend** gemerged, nie ersetzt |

### Bench: `KFB Pet Studio v4.dc.html`

- **Gesicht → „Viseme (5 Formen)"** (offen bei Start, das ist die Abnahme dieser Runde):
  1. *Visem zeigen* — fünf Knöpfe, zeigt live welches Visem steht und welches Decal es trägt.
  2. *Form für »…«* — die 13 Decals als Knöpfe. Klick weist die Form dem gewählten Visem zu. **Das
     ist der Look-Griff: Georg entscheidet, nicht der Code.**
  3. *Abnahme* — „▶ 5 durchspielen" (620 ms je Form) und „↺ Standard-Look" als Rückweg.
- **Untere Leiste:** neue Pad-Gruppe „Viseme" neben Emotes/Anim — fünf Klicks ohne Panel.
- Ein Visem-Klick schaltet den Sprech-Shuffle (`Talk`) aus, damit nicht zwei Besitzer am Mund ziehen.
- Zuordnung wird in `pets[].mouth.visemeMap` geschrieben, `dirty` gesetzt, der Pet über `_touchPet()`
  als berührt registriert — und geht damit über die bestehende Export-Schicht in `kfb-pets.json` mit.
  (Die Bank hängt nicht am generischen `row()`-Builder, also auch nicht an dessen `mark()`-Haken; ohne
  `_touchPet()` ließ `_buildContract(useTouches)` den Pet weg und der abgenommene Look verschwand
  still. Befund der Abnahme 29.7., behoben und gemessen.) `_mouthParams()` merged `visemeMap` **tief**
  (flaches `Object.assign` hätte bei einem einzelnen getunten Visem die anderen vier auf `undefined`
  gekippt).
- Session-Key bleibt `kfb-pet-library-v9` — Georgs in v3 getunte Mund-Platzierungen (bunny:
  `size 0.47 · dy −0.69 · sx 1.54`) tragen ohne Nacharbeit nach v4 durch.

---

## 2. Messung (Bedingungen aus §2a)

Am laufenden Studio geprobt, FrizzleBob, Set `male`:

| Bedingung | Messung |
|---|---|
| 5 benannte Zustände erreichbar | `setViseme` liefert für alle fünf den Decal-Key: m · ah · ee · oh · smile |
| Wechsel < 1 Frame | reiner `material.map`-Tausch + `needsUpdate`; kein Rebuild, kein `refit()`, alle 13 Texturen sind beim `build()` vorgewärmt (`tex` = 13 Einträge) |
| kein Geometrie-Pop | Vertex-Zahl **52 konstant**, `mesh.scale` über alle fünf Wechsel unverändert (1,0730 / 0,4298 / 1,0000), `_pop` bleibt **1,000** (der Snap-Plopp ist für gezielte Wechsel aus) |
| nur der Mund ändert sich | Visem-Pfad berührt ausschließlich `mesh.material.map`; kein Zugriff auf `rig`, `face`, `motion` |
| reversibel | „Standard-Look" löscht `pet.mouth.visemeMap` → Modul-Default |
| pro Pet / pro Set | `visemeMap` liegt neben `size/dy/sx/set` in `pets[].mouth`, gilt für beide Decal-Sätze (gleiche 13 Keys) |
| Look landet im Export | frisches `_touchedPets`, Panel-Griff „Zu → woo": `_touchedPets = ['bunny']`, `_buildContract(useTouches)` liefert `mouth.visemeMap = {closed:'woo', …}`; „Standard-Look" registriert den Pet ebenfalls und stellt die Default-Map live wieder her |

Abnahme-Frames: `captures/studio-v4/01-closed-m.png` … `05-smile-smile.png` (Nahaufnahme des
Gesichts, ein Frame je Visem) + `06-restore-rest.png`.

---

## 2b. Slice §Auflage — „der Mund liegt vor dem Modell" (2026-07-29, Nachtrag)

Dein altes Issue. Zwei Ursachen, beide behoben, eine bleibt bei dir.

**Ursache 1 — die Mundfläche war EINE flache Ebene, tangential an EINEM Punkt.** Bei einer gerundeten
Wange steht so eine Ebene an den Rändern über die Silhouette hinaus: der Mund schwebt sichtbar vor dem
Körper. Fix: **Anschmiegen (Shrinkwrap)** — beim `refit()` wird jeder der **52 Eckpunkte** einzeln per
Raycast auf die Körperfläche abgetastet (entlang derselben Achse wie der Fit) und um `lift` davor
gesetzt. Kein `DecalGeometry`, kein neues Material, keine neue Geometrie — dieselben 52 Punkte,
andere Z-Werte.

**Ursache 2 — `depthTest: false`.** Der Mund wurde grundsätzlich über ALLES gezeichnet, auch über
Schnauze, Ohr oder Arm, die davor liegen. Jetzt `depthTest: true` + `polygonOffset −2/−2` (hält ihn
trotz Tiefentest über der Fläche, kein Z-Fighting bei kleinem Abstand). Rückweg: Schalter **„Immer
obenauf (alter Zustand)"**.

**Neue Regler im Mund-Abschnitt:** *Abstand (Auflage)* `lift` 0…0,12 U (war hart verdrahtet auf 0,03),
*Anschmiegen* `wrap` 0…1 (0 = flache Ebene wie vor v4), *Breite ×* `sx` (war nur im alten Panel),
plus der Obenauf-Schalter. Alles pro Pet im Vertrag.

### Messung (FrizzleBob, `male`, `size 0.47 · dy −0.69 · sx 1.54`)

| Größe | vorher (flache Ebene) | nachher (angeschmiegt) |
|---|---|---|
| Wölbungstiefe über die Mundfläche | **0,000 U** (perfekt flach) | **0,284 U** |
| lokale Z-Spanne der 52 Eckpunkte | 0,0274 … 0,0274 (uniform) | −0,163 … +0,097 |
| `depthTest` | `false` (immer obenauf) | `true` |
| Eckpunkte, die den Körper verfehlen | — | **4 / 52** bei `sx 1.54`, **0 / 52** bei `sx 1.00` |

Frames: `captures/studio-v4/101-auflage-vorher-flach-obenauf.png` (Überstand über die Wange, harte
Kante über dem Hintergrund) → `102-auflage-nachher-angeschmiegt.png` (folgt der Wange, wird von der
Schnauze beschnitten statt darüber zu liegen) → `103-auflage-nachher-sx100.png`.

### Was BEI DIR bleibt

**`sx 1.54`** ist der Rest des Überstands. Der Mund ist 54 % breiter gezogen als seine Textur — an der
gerundeten Wange läuft er damit über den Umriss hinaus, und Anschmiegen kann keinen Körper erfinden,
der nicht da ist (4 von 52 Eckpunkten treffen nichts; sie erben die Tiefe ihres inneren Nachbarn, die
Fläche flacht nach hinten ab statt vorzustehen). Ab 25 % Fehlschüssen warnt das Modul in der Konsole.
Bei `sx 1.00` trifft jeder Punkt. Deine Entscheidung: breiter Mund mit Rest-Überstand an schrägen
Winkeln, oder schmaler und überall sauber auf dem Körper.

Der View-Facing-Fade (Mund blendet aus, wenn seine Normale ~72° von der Kamera wegdreht) ist
**unverändert** — er war der Notnagel gegen genau diesen Überstand und darf jetzt nach der Abnahme
kleiner werden, das ist der nächste Slice, nicht dieser.

---

## 2c. Slice §2b — Treiber-Vertrag (2026-07-30)

Look der fünf Formen von dir abgenommen (`closed → m` bleibt, `round → oh` bleibt Standard, `woo`
ist die engere Variante für Rufe/Gesang) → damit ist das Gate aus Handover §8 offen und §2b gebaut.

**Neues Modul: `studio-v3/pet-puppet.v1.js`** — eine **Fassade**, keine zweite Wahrheit. Sie besitzt
genau drei Dinge: die **Uhr** der Sprech-Timeline, die **Namens-Zuordnung** der Vertrags-Begriffe auf
die Library-Namen, und die **Kamera-/Hintergrund-Presets**. Alles andere ruft sie über die öffentliche
API ihrer Eigentümer (Mund, Rig, Emote-Tabelle, Clips des Hosts). Kein Zugriff auf Interna — genau
die `(gx,gy)`-Falle aus dem Travel-Cut.

```
setViseme(id,{pop,rest}) · setExpression(name) · playState(name)
speak(timeline,{rate,tail,onDone}) · setCamera(preset) · setBackground(mode)
+ update(dt) · onEmphasis(cb) · stop()
```

**Bank im Studio:** Motion-Tab → „Treiber-Vertrag (§2b)". Jeder Knopf ruft **genau eine**
Vertrags-Methode, damit am Bild prüfbar ist, dass der Vertrag *trägt* und nicht nur *existiert*;
„▶ Testsatz sprechen" fährt eine echte 11-Ereignis-Timeline und zeigt danach die Messzahlen.

### Messung (dt = 1/60, deterministisch durchgeschoben)

| Bedingung | Messung |
|---|---|
| alle sechs Methoden vorhanden **und wirksam** | `setExpression('thinking')` → Studio-Emote steht auf `thinking`; `playState('lookL')` → Rig-Blick links; `setViseme('round')` → Decal `oh` |
| `speak()` trifft die Timeline | **11/11** Ereignisse gefeuert, Sequenz identisch zur Vorlage, **größter Zeitfehler 17 ms** (= ein Frame, der Boden) |
| Betonungs-Marker | **3/3** empfangen, auf t = 0,00 / 0,84 / 1,28 s mit Stärke 1 / 1 / 0,6 |
| löst sich in Ruhe auf | nach der Fahrt `mouth.viseme = null`, Ruhe-Mund gesetzt, `speaking = false` |
| Kamerafahrten **settlen** | Zieldistanz auf ±0,002 × Radius; `close` 114 Frames, `wide` 137, `presentation` 144, `zoom` 184 — danach gibt der Puppet die Kamera frei (kein Nachregeln gegen die Maus) |
| `orbit` ist die Ausnahme | läuft weiter, gemessen 8,36 °/s (Ziel 9) |
| `static` fasst nichts an | `_cTarget = null`, Kamera unverändert |
| `setBackground` | `transparent` → `scene.background = null`, Clear-Alpha **0**; `world` → Stimmung/Skydome des Studios zurück |
| ein Eigentümer je Kanal | `speak()` schaltet den Silbentakt-Shuffle aus; die Studio-Stimme (`_speak`) wird vor dem Testsatz gestoppt |

Frame: `captures/studio-v4/201-treiber-bank.png`.

### Zwei Entscheidungen, die im Modul stecken (und warum)

1. **`dist` ist ein Vielfaches des Pet-Radius**, kein Weltmaß — ein Krebs ist 0,91 hoch, ein Hase 1,33;
   ein festes „2 Meter zurück" rahmt beide falsch.
2. **`az` zählt relativ zur Blickrichtung**, und die Blickrichtung wird **gemessen** (Frontnormale der
   gefitteten Mundfläche), nicht aus einer Achsen-Annahme abgeleitet. Der Travel-Cut hat genau daran
   eine Sitzung verloren („Gesicht ist −Z" war falsch). Höhenwinkel flach (0–10°), weil jeder größere
   Winkel dem knapp kniehohen Pet auf den Kopf schaut.

### Was §2b NICHT tut

Betonungen werden **gemeldet, nicht ausgeführt** — der Körper gehört `PetMotion`, und `PetMotion` ist
in diesem Studio nicht eingehängt. `onEmphasis` ist ein funktionierender Kanal ohne Körper-Konsument;
das ist §2c und der nächste Slice. Kein Audio, kein Phonem-Alignment, kein Export (§4).

**`EMBED_CUBE_PET_FULL_v2.md` ist jetzt v2.1**: neuer §16 „Puppeting / External Drive" mit den fünf
Visemen, den sechs Methoden gegen die echten Signaturen, dem `timeline`-Format, der Preset-Tabelle und
der §2c-Naht. §2–§15 unverändert, bestehende Einbauten laufen weiter.

---

## 2d. Slice §Blase — Pfeil, Magnet, Totzone (2026-07-30)

Dein Befund an drei Bildern: der Zipfel war eine **Kerbe** statt eines Pfeils, er zeigte bei naher
Kamera als **Spike in den Header**, und die Blase **sprang** bei „Dance".

### Ursache 1 — der Anker hing an der falschen Stelle

Der Zipfel zielte auf die **Bbox-Oberkante** des Pets. Bei naher Kamera liegt die *außerhalb* des
Bildes: der Anker wanderte über die Blase hinaus, die Blase klemmte am oberen Rand, und der Pfeil
zeigte folgerichtig nach oben — in die Tab-Leiste.

Jetzt gibt es **eine** Größe, die die Anker-Position besitzt: den geglätteten Bildpunkt des
**Pet-Zentrums** (`_petPoints` + `_anchorTick`), auf den Bühnenkasten geklemmt. Die Blase sitzt
weiter über dem *Kopf* (Abstand Zentrum→Oberkante aus dem laufenden Frame), gedämpft wird nur das
Zentrum. Dazu zwei **Randregeln**: eine oben geklemmte Blase zeigt **immer nach unten**, eine unten
geklemmte immer nach oben. Damit kann der Pfeil nicht mehr in die Leiste zielen, egal wie nah die
Kamera steht.

### Ursache 2 — die Kerbe war zu kurz und ungetapert

Der Zipfel war ein Dreieck aus drei Punkten (Fuß 16 px, Länge ≤ 24). Jetzt: Fuß 18, zwei
**Schulterpunkte bei 55 %** der Länge → der Zug verjüngt sich, das liest sich als Spitze. Länge
14…`arrow` px (Standard 34, Regler bis 80). **Luftballon an Schnur:** die Spitze *zielt* aufs
Zentrum, aber die Schnur ist kurz — ein Gummiband quer durchs Bild liest sich nicht als Sprechblase.
Der Zug bleibt EIN geschlossener Pfad mit reinen L-Segmenten (Tusche-Regel).

### Ursache 3 — zwei Schwellen statt einer Totzone

Vorher: ein 26-px-Commit für die Position *und* eine eingefrorene Zipfel-Richtung — bei „Dance"
committete das ständig neu, also sprang beides. Jetzt **eine Totzone auf einer Größe**: innerhalb
`dead` (44 px) steht der Anker **still**, außerhalb folgt er weich mit `lazy` (0,10) und einem
**Tempo-Deckel von 18 px/Frame**.

### Messung

| Bedingung | Messung |
|---|---|
| kein Pendeln im Idle | Pet 180 Frames mit Atem-Amplitude bewegt (±0,03 / ±0,02 Welt) → Anker-Drift **0,00 px** |
| träge, kein Sprung | 286 px Weg: **0,22 s** bis in die Totzone, größter Schritt **18,00 px/Frame** (der Deckel; vorher 54,68) |
| kurzer Weg bleibt flüssig | 72 px Weg: in der Totzone nach 4 Frames, größter Schritt 6,96 px |
| Pfeil zeigt nie in den Header | nahe Kamera (`close`/`zoom`): Anker in Blasen-Koordinaten `ay = 221…240` (> Blasen-Unterkante) → Pfeil nach unten |
| Rand-Fälle | Pet am rechten Bühnenrand → Blase geklemmt, Pfeil abgewinkelt zum Pet; Denkblase komplett im Kasten |
| on/off | Voice-Tab → „Blase zeigen"; Klick auf die Blase schließt sie weiter (Stimme läuft) |

Frames: `captures/studio-v4/301-blase-standard-pfeil.png` · `302-…-randfall-rechts-geklemmt.png` ·
`303-…-denkblase.png` · `304-…-nahe-kamera-zeigt-nach-unten.png`.

### Neue Regler (Voice → Sprechblase, pro Pet über den Vertrag)

`arrow` Pfeil-Länge 16…80 · `dead` Totzone 0…140 · `lazy` Trägheit 0,03…0,40.
`dead: 0` = klebt starr am Zentrum (alter Eindruck), `lazy: 0.4` = schnappt — beides der Rückweg.

### Kamera nachgezogen

`close` 1,75 → **2,55** × Radius, `zoom` 1,30 → **2,05**. Beides war zu nah (dein Befund).

---

## 2e. Slice §Ausgabe + §Ruhemund (2026-07-30)

### A · Transparenter Hintergrund MIT bewegtem 3D-Schatten

Zwei Befunde, einer davon peinlich: der Renderer war **ohne `alpha: true`** gebaut, also war
`setClearAlpha(0)` wirkungslos und „transparent" lieferte schwarz statt frei. Behoben. Und die
Schatten-Ebene lag in einer lokalen Variablen — nicht schaltbar.

Der Kontaktschatten liegt auf einer eigenen `ShadowMaterial`-Ebene, die **nur den Schatten zeigt**
und sonst nichts. Deshalb kann sie stehen bleiben, wenn Hintergrund und Podest weggeräumt sind: das
Ergebnis ist ein freigestelltes Pet plus halbtransparenter Schatten — genau das, was du brauchst, um
das Talking-Pet später pseudo-räumlich auf Karten und Illus zu setzen.

Der Schatten hängt **nicht** am Hintergrund-Modus. Er ist eine eigene Entscheidung (Schalter +
Deckkraft-Regler in der Treiber-Bank), sonst hätte `setBackground` heimlich zwei Dinge besessen.

| Bedingung | Messung |
|---|---|
| Hintergrund wirklich frei | Ecken-Pixel `rgba(0,0,0,0)` — Alpha **0** (vorher deckend schwarz) |
| Schatten trägt Alpha, halbtransparent | Differenz Schatten AN/AUS: max Alpha **82/255 = 32,2 %** bei Deckkraft 0,32 · **153/255 = 60,0 %** bei 0,60 → der Regler bildet 1:1 ab |
| nur der Schatten, kein Boden | ~**7.140** Pixel Differenz, außerhalb davon Alpha unverändert |
| schaltbar | Schatten AUS → dieselben Pixel wieder Alpha 0 |

Frames: `captures/studio-v4/401-ausgabe-transparent-mit-schatten.png` · `402-…-ohne-schatten.png`.

**Für den späteren PNG-Export** ist damit alles vorbereitet: `preserveDrawingBuffer` war schon an,
`alpha` ist jetzt an, der Schatten ist eine Ebene, die man mitnehmen oder weglassen kann.

### B · Ausdruck prägt den Ruhe-Mund

Deine Frage war richtig: **ja**, bis jetzt trugen `happy`/`sad`/`angry` nur Lider und Pupillen — der
Mund blieb die neutrale Kerbe. Der Hook (`PetMouth.setRest`) existierte im Modul seit v9, war im
Studio aber **nie verdrahtet**; das war der offene Backlog-Punkt „happy-Emote ↔ Mund-Verdrahtung".

Jetzt ruft `_applyEmote` den Ruhe-Mund mit, und die `restMap` trägt nicht mehr nur ein Decal, sondern
eine **Form**: Decal **plus Mundwinkel** (`bend`, dein „sad = Mundwinkel leicht nach unten") und
optional eine Kippung. Strings bleiben erlaubt — rückwärtskompatibel für die Flug-Engine.

| Ausdruck | Decal | Mundwinkel | Kippung |
|---|---|---|---|
| neutral | `neutral` | 0 | 0 |
| happy | `smile` | **+0,35** | 0 |
| sad | `m` | **−0,55** | 0 |
| angry | `s` | **−0,45** | 0 |
| surprised | `oh` | 0 | 0 |
| thinking | `woo` | −0,15 | −3° |

Gemessen: alle sechs Ausdrücke setzen Decal **und** Winkel (Soll = Ist über alle sechs); beim Sprechen
fällt die Ruhe-Form weg (`bend` zurück auf 0), weil dann die **Viseme** die Form tragen — sonst
kämpfen zwei Besitzer um denselben Bogen. Nach dem Satz greift die Ruhe-Form wieder.

Frames: `411-ruhemund-neutral` · `412-…-happy` · `413-…-surprised` · `414-…-thinking`.

**Look ist deiner:** die sechs Winkel sind Vorschläge. `sad` bei −0,55 ist deutlich; wenn dir das zu
tragisch ist, sind −0,3 die zurückhaltende Variante. Und `angry → s` (gepresste Zähne) könnte auch
`m` mit stärkerem Frown sein — zwei Werte in `restMap`, kein Code.

---

## 3. Look-Vorschlag → deine Entscheidung

Die Standard-Zuordnung ist ein **Vorschlag**, kein Setzstein. Zwei Stellen, an denen ich unsicher bin:

1. **Zu → `m`** liest sich in der Nahaufnahme fast wie „kein Mund" (nur eine feine Kerbe). Als
   Rede-Closer ist das richtig; wenn du sichtbaren Lippendruck willst, ist **`f`** der Kandidat.
2. **Rund → `oh`** ist ein weites O mit Zunge. **`woo`** wäre das engere, gespitztere Rund — eine
   andere Figur (Staunen vs. Pfeifen).

Beide sind zwei Klicks in der Bank (Visem wählen → Form klicken) und landen im Vertrag.
`Breit → ee`, `Offen → ah`, `Lächeln → smile` halte ich für gesetzt.

---

## 4. Widerspruch, den du auflösen musst

`docs/ONBOARDING_pet_studio_v4.md` (2026-07-22) definiert v4 als **„Krone & Glattziehen"** (Accessory-
Slot + Mund-Decal + Zipfel-Fix). Der neue Handover (2026-07-29) definiert v4 als **Talking Puppet**.
Ich bin dem neuen Handover gefolgt — er ist jünger und du hast ihn angehängt. Die Krone ist damit
**nicht** verschwunden, sondern unverplant: entweder Folge-Sprint oder v5.

---

## 5. Was NICHT passiert ist (bewusst)

*(Stand 2026-07-30 — §2b **ist** gebaut, siehe §2c; dieser Abschnitt war bis zum Schnitt stale und
ist hier richtiggestellt.)*

- **Kein Betonungs-Ausschlag über PetMotion (§2c).** `onEmphasis` ist ein funktionierender Kanal,
  aber `PetMotion` ist in diesem Studio nicht eingehängt — der Kanal steht, der Konsument fehlt.
- **Kein Audio, kein Lip-Sync-Alignment, kein Video-Export** (§4 — separates „Cube Puppet Studio").
- **Der View-Facing-Fade ist unverändert** (Mund blendet ab ~72°). Er war der Notnagel gegen den
  Überstand aus §Auflage und ist nach dem Shrinkwrap überdimensioniert — verkleinern ist ein eigener
  Slice, kein Nebenbei-Griff.
- **Krone / Accessory-Slot** aus `docs/ONBOARDING_pet_studio_v4.md` — unverplant, siehe §4.
- Root-`pet-mouth.v1.js` und die kanonische `build/`-Fassung wurden **nicht** angefasst (siehe §6).

**Erledigt, entgegen der ursprünglichen Fassung dieses Abschnitts:** `speak(timeline)`,
`setExpression`, `playState`, `setCamera`, `setBackground` sind gebaut und gemessen (§2c), und
`EMBED_CUBE_PET_FULL_v2.md` steht auf **v2.1** mit §16 „Puppeting / External Drive" gegen die echten
Signaturen.

---

## 6. Vorbestehende Divergenz — Aufgabe für WS0

Es gibt drei Fassungen von `pet-mouth.v1.js`:

| Pfad | Größe | Stand |
|---|---|---|
| `studio-v3/pet-mouth.v1.js` | 12,8 kB → **13,9 kB** | die lebende Fassung (Studio + Motion-Editor lesen sie); **hat die Visem-Schicht** |
| `pet-mouth.v1.js` (Root) | 9,3 kB | älter: kein `MOUTH_SETS` (male/female), kein `tilt`/`bend`/`express`; von `kfb-pets.js` importiert; **ohne Visem-Schicht** |
| kanonisch `media/3D_Assets/build/pet-mouth.v1.js` | — | trägt laut Housekeeping noch die falschen PNG-Namen (fehlendes `_0001s`-Segment) |

Das ist **nicht** von v4 verursacht — es steht seit 2026-07-22 so im Housekeeping. Aber es heißt: die
Visem-Schicht wirkt heute nur im Studio, nicht im Embed/Travel-Pfad. Sauberer Weg: WS0 führt die drei
Fassungen auf den studio-v3-Stand zusammen (Namen-Fix + Sets + Visem), dann zieht `kfb-pets.js` den
Import wieder auf die kanonische URL.

---

## 7. Backlog v5 — der Stand beim Schnitt (2026-07-30)

Sortiert nach Aufwand. Nichts davon blockiert etwas anderes; v4 läuft ohne jeden dieser Punkte.

### A · Look-Entscheidungen — Zahlen im Vertrag, kein Code

Jeder Punkt ist ein Griff im Panel und landet über `_touchPet()` im `kfb-pets.json`-Export.

| Frage | Ist | Alternative | Wo |
|---|---|---|---|
| `sad` zu tragisch? | `bend −0,55` | `−0,3` (zurückhaltend) | `restMap.sad` |
| `angry` = gepresste Zähne? | Decal `s`, `bend −0,45` | `m` mit stärkerem Frown | `restMap.angry` |
| Kamera-Entfernungen | `close 2,55` · `zoom 2,05` × Radius | am Bild nachziehen | Treiber-Bank |
| Mundbreite | `sx 1,54` (4/52 Punkte ohne Körper) | `sx 1,00` (überall sauber) | Mund → *Breite ×* |
| `closed` / `round` | `m` / `oh` | `f` (Lippendruck) / `woo` (enger) — siehe §3 | Gesicht → Viseme |
| Mund-Set FrizzleBob | `male` (beige, kaum sichtbar) | **`red`** (§9, eingehängt) | Mund → Mund-Set |
| `red` braucht `smile`-PNG? | Fallback `neutral` + `bend +0.35` | 13. PNG exportieren | §9 |

### B · Folge-Slices

0. ~~Drittes Mund-Set „RedLips" prüfen und einhängen~~ — **erledigt 2026-08-04, siehe §9.**
   Nachfolger: **Lippenstift-Register** (rot + Wimpern = clownesk/Drag) — braucht Mund **und**
   EyeRig, also ein Slice mit zwei Eigentümern; sinnvoll zusammen mit B3 Accessory-Slot.
1. **§2c „der ganze Körper spricht"** — `onEmphasis` an einen Körper hängen. **Vorfrage, die vor dem
   Bauen beantwortet gehört:** kommt `PetMotion` ins Studio, oder wird die Betonung im
   Motion-Editor autorisiert und das Studio konsumiert nur? Zwei Eigentümer für denselben Körper
   wäre derselbe Fehler wie zwei Besitzer am Mund.
2. **View-Facing-Fade verkleinern** — nach §Auflage ist der 72°-Notnagel zu grob. Messung: ab welchem
   Winkel steht überhaupt noch etwas über?
3. **Krone / Accessory-Slot** — der ursprüngliche v4-Auftrag aus `ONBOARDING_pet_studio_v4.md`,
   siehe §4. Entweder v5 oder bewusst fallenlassen.
4. **§4 Audio / Lip-Sync / PNG- und Video-Export** — eigenes „Cube Puppet Studio". Die Ausgabe-Seite
   ist in §2e bereits vorbereitet (`alpha`, `preserveDrawingBuffer`, schaltbare Schattenebene).

### C · WS0 — die einzige Naht nach außen

Die **drei Fassungen von `pet-mouth.v1.js`** (§6). Die Visem-Schicht lebt heute **nur in
`studio-v3/`**; die kanonische Fassung ist Version 1 und kennt nicht einmal `surface` (Befund S94 im
Travel-Scope). Konsequenz: **ein sprechendes Pet im Embed- oder Travel-Pfad gibt es heute nicht.**

Das ist die einzige offene Stelle mit Wirkung außerhalb dieses Studios — relevant, sobald **Travel
v14** ein sprechendes Pet auf der Flug-Karte will. Wenn nicht, bleibt sie sauber offen.

Sauberer Weg (unverändert): WS0 führt die drei Fassungen auf den `studio-v3`-Stand zusammen
(PNG-Namen-Fix + `MOUTH_SETS` + Visem-Schicht), danach zieht `kfb-pets.js` den Import zurück auf die
kanonische URL.

---

## 8. Drittes Mund-Set „RedLips" — Bestandsaufnahme (2026-07-30, für v5)

Georgs neuer Satz: `media/3D_Assets/Textures/FrizzleBob-RedMouth_01/` (Repo `georg-doc/kayfabizarro`,
Branch `main`). **12 PNG, alle laden, alle 274 × 169 mit Alpha** — also **exakt dieselbe Leinwand wie
die bestehenden Sets.** Kontaktbogen gegen das male-Set:
`captures/studio-v4/501-redmouth-kontaktbogen.png`.

### Was gut ist

- **Gleiche Maße = kein Fit-Problem.** `size/dy/sx/lift/wrap` von FrizzleBob tragen unverändert
  durch; kein `refit()`-Sonderweg, kein neuer Shrinkwrap-Test.
- **Sichtbarkeit.** Das male-Set ist beige auf gelbem Körper — der `neutral`-Mund ist im Bild fast
  nicht da (siehe Kontaktbogen). Die roten Lippen lesen sich auf jede Entfernung. Für ein *sprechendes*
  Pet ist das der eigentliche Gewinn.
- **Die Sprech-Formen sitzen.** `oh` ist ein sattes rundes O mit dunklem Innenraum, `ee` zeigt die
  Zahnreihe, `ah` (Datei `Aa`) ist weit offen mit Zunge, `m` ist ein geschlossener Lippenstrich.
  Alle vier Visem-Rollen sind sauber besetzt und deutlich stärker kontrastiert als im male-Set.
- **`neutral` ist ein echter Ruhemund**, keine unsichtbare Kerbe — der Ausdrucks-Ruhemund (§2e)
  gewinnt dadurch spürbar.

### Drei Befunde, die vor dem Einhängen entschieden werden müssen

**1 · `smile` fehlt.** Der Satz hat 12 Dateien, die bestehenden Sets 13. Fehlend ist ausgerechnet
`smile` — und der trägt zwei Rollen: Visem **`smile`** und `restMap.happy`. Drei Wege:

| Weg | Aufwand | Bewertung |
|---|---|---|
| Georg exportiert ein 13. PNG `…_0012_Smile.png` | Asset-Arbeit | sauberste Lösung |
| `ee` als Ersatz mappen (`visemeMap.smile = 'ee'`) | 0 Code | Zähne statt Lächeln — geht, ist aber ein Grinsen |
| `neutral` + `bend +0.35` (der Mundwinkel aus §2e biegt die Fläche) | 0 Code | **mein Favorit für den Test** — die Ruhe-Form kann das Lächeln selbst erzeugen |

Der dritte Weg ist die interessante Frage: wenn `bend` das Lächeln trägt, braucht **kein** Set mehr
ein `smile`-PNG. Das ist eine Messung, keine Meinung — Slice B0 probiert sie.

**2 · Namensschema weicht dreifach ab.** Das Modul mappt pro Set explizit Datei für Datei, also ist
das kein Blocker — aber es muss von Hand eingetragen werden, raten geht schief:

| | male | female | **red** |
|---|---|---|---|
| Prefix | `FrizzleBobMouth_01` | `FrizzleFemaleMouth_01` | `FrizzleBob_RedLips_Mouth_01` |
| Mittelsegment | `_0000s_0001s_` | `_0000s_0000s_` | `_0000s_0000s_` |
| „offen" heißt | `Ah` | `Ah` | **`Aa`** |
| gerundet heißt | `W-oo` | `W-oo` | **`W-Oo`** |
| Reihenfolge | Smile…L | Smile…L | **umgekehrt: L…Neutral** |

Die Index-Reihenfolge ist egal (es wird nach Schlüssel gemappt, nicht nach Nummer). `Aa` und das
große `O` sind die zwei Stellen, an denen ein Copy-Paste aus dem male-Block still 404t.

**3 · Rot ist eine Charakter-Entscheidung, keine Neutralität.** Rote Lippen lesen sich als
Lippenstift. Für FrizzleBob als MC trägt das; auf Pinguin, Kuh oder Schwein ist es eine Aussage. Das
Set gehört deshalb **pro Pet** gewählt (`mouth.set` liegt schon pro Pet im Vertrag) — nicht global
umgestellt.

### Aufwand

`MOUTH_SETS` hat den Platz für einen dritten Eintrag schon (`base` + `files` je Set), `mouth.set`
liegt pro Pet im Vertrag, die Set-Umschaltung (`setSet()` mit Cache-Leeren und Neu-Warmladen) läuft
seit dem female-Set. Realistisch: **~20 Zeilen Modul + eine dritte Option im Set-Umschalter** plus
die Entscheidung zu `smile`. Der einzige Code-Eingriff mit Substanz ist ein **Fallback für fehlende
Schlüssel** — heute würde `this._files.smile === undefined` zu einem `base + "undefined"`-Ladeversuch
führen. Das gehört sauber abgefangen, bevor ein unvollständiges Set eingehängt wird.

---

## 9. §Rote Lippen — EINGEHÄNGT (2026-08-04)

Der Slice aus §8 ist gebaut. Drei Eingriffe, alle additiv; `male`/`female` sind nicht angefasst.

**1 · Set-Registry (`studio-v3/pet-mouth.v1.js`).** Neu `RED_MOUTH_BASE` + `RED_MOUTH_FILES`
(12 Einträge) und `MOUTH_SETS.red = { base, files, fallback: 'neutral' }`. Die drei
Namens-Abweichungen aus §8 stehen als Kommentar über dem Block, damit der nächste Chat nicht aus dem
male-Block kopiert: eigener Prefix, **`Aa`** statt `Ah`, großes **`W-Oo`**. Die umgekehrte
Index-Reihenfolge ist folgenlos — gemappt wird nach Schlüssel, nicht nach Nummer.

**2 · Fallback für fehlende Formen — der eigentliche Eingriff.** Neu `_key(name)` (löst auf den
Schlüssel auf, der im aktuellen Set wirklich eine Datei hat → sonst `fallback` → sonst `null`) und
`has(name)` als ehrliche Auskunft. Alle sechs Stellen, die vorher `this._files[x]` direkt prüften
(`_loadTex`, `setViseme`, `setSet`, `setTex`, `setRest` ×2), laufen jetzt darüber. Damit kann **kein
Set mehr einen Ladeversuch auf `base + "undefined"`** auslösen — die Bedingung, unter der ein
unvollständiger Satz überhaupt einhängbar ist. `setViseme` meldet den Ersatz als `console.info` mit
Set- und Schlüsselnamen (nicht als Warnung: es ist erwartetes Verhalten, kein Fehler).

`smile` ist damit **nicht** auf `ee` gemappt — kein Grinsen mit Zähnen. Das Lächeln trägt der
Mundwinkel (`restMap.happy` `bend +0.35`, §2e) auf der `neutral`-Form. Das ist Weg 3 aus §8; ob er
reicht, ist eine Look-Abnahme am Bild.

**3 · Umschalter (`KFB Pet Studio v4.dc.html`).** Dritte Option „rote Lippen" im Mund-Tab. Die
Platzierung wird wie gehabt pro Set gemerkt (`_male`/`_female`/`_red`); beim ersten Wechsel **erbt
`red` die male-Lage** (`p.mouth._male`), weil die Leinwand identisch ist — nicht die engere
female-Lage. Rückweg: eine Umschaltung zurück, die alte Platzierung steht noch.

### Gemessen (über den echten Bedienweg, nicht im Modul-Vakuum)

| | Wert |
|---|---|
| Registry | `male · female · red` |
| PNG geladen | **12/12**, `fails: []` |
| Maße | **einheitlich 274×169** = male-Leinwand ✅ |
| `_key('smile')` | `neutral` (Fallback greift) |
| `_key('ah')` / `_key('zzz')` | `ah` / `neutral` |
| `has('smile')` | `false` (ehrlich) |
| Visem-Auflösung | `closed→m · open→ah · wide→ee · round→oh · smile→neutral` |

Die vier **Sprech**-Viseme sitzen also direkt auf echten Dateien; nur die Ruhe-Freude läuft über den
Fallback. Der Sprech-Shuffle (`TALK_POOL` + `CLOSERS`) braucht `ah·ee·oh·uh·d·s·l·r·m·f·woo` — **alle
elf sind im roten Set vorhanden**, das Sprechen ist vollständig, ohne einen einzigen Ersatz.

### Nachtrag · §Knick-Bremse (Bug bei großen Lippen, 2026-08-04)

Georgs Befund am Bild: bei `size 0.710 · sx 1.540 · dy −0.690` bekam die Oberlippe eine harte,
rechteckige **Stufe** — sah aus wie ein Render-Fehler.

**Ursache** (nicht die roten Lippen, die machen es nur sichtbar): ein Eckpunkt, der um die
Wangenkante herum eine **zurückweichende** Fläche traf — oder die Tiefe seines inneren Nachbarn
erbte, weil er den Körper ganz verfehlte — sprang in **einem** Spaltenschritt nach hinten. Bei
kleinen Mündern liegt das im Rauschen, bei einem breiten Mund ist es eine Falte.

**Fix:** die Tiefe darf von Spalte zu Spalte nur um `slope` wandern (Anteil von U, Default `0.05`),
gemessen von der Mitte nach außen in beide Richtungen. Aus der Stufe wird ein Auslauf.
Rückweg: `slope <= 0` schaltet die Bremse aus (Verhalten wie vor v4.1).

Gemessen am laufenden Studio bei genau Georgs Werten (größter Tiefensprung zwischen zwei
Nachbarspalten, in U):

| | größter Sprung | Ø Sprung | Wölbungstiefe | Fehlschüsse |
|---|---|---|---|---|
| ohne Bremse (`slope 0`) | **0,1352** | 0,0228 | 0,290 | 27/52 |
| **mit Bremse (`0.05`)** | **0,0500** | 0,0226 | **0,287** | 27/52 |
| `slope 0.03` (zu viel) | 0,0300 | 0,0148 | 0,207 | 27/52 |

Die entscheidende Zahle ist die dritte Spalte: der Sprung fällt um **63 %**, die Wölbungstiefe
verliert nur **1 %** (0,290 → 0,287). Die Bremse glättet also den Knick, ohne das Anschmiegen
flachzudrücken — `0.03` täte das (−29 % Tiefe) und ist deshalb nicht der Default.

**Was der Fix NICHT kann:** `27/52` Eckpunkte treffen bei diesen Werten den Körper gar nicht — der
Mund ist breiter als FrizzleBobs Kopf, das linke Lippenende steht über die Silhouette hinaus. Kein
Anschmiegen erfindet einen Körper, der nicht da ist; die Konsole meldet es jetzt mitsamt
`slope`-Wert. **Look-Entscheidung, kein Bug:** `sx` runter (≈ 1,2 bei `size 0.71`) oder überbreite
Lippen als Stil akzeptieren — auf einem Clown wäre das sogar richtig.

Zum Messen ist `window.__petStudio` neu (Handle auf die Komponente) — ohne ihn ist am laufenden
Studio nichts nachprüfbar.

### Offen (Look, nicht Code)
- **Lippenstift-Register.** Georgs Hinweis: rot liest sich je nach Pet und Kontext als Glamour,
  als Drag oder — mit Wimpern — **clownesk**. Das ist kein Bug, das ist ein Register. Nur: die
  Wimpern gehören dem **EyeRig**, nicht dem Mund; „clownesk" ist also eine Kombination aus zwei
  Eigentümern und damit ein eigener Slice (Kandidat für v5, zusammen mit dem Accessory-Slot §7 B3).
- **Braucht `red` ein `smile`-PNG?** Erst die `bend`-Variante am Bild ansehen. Wenn sie trägt, ist
  die Antwort *nein* — und dann braucht **kein** Set mehr eines.
- Pro Pet wählen, nicht global (§8, Befund 3). `mouth.set` liegt schon pro Pet im Vertrag.

---

## 10. Check-in v4 → Handover an den Coworker (2026-08-04)

Der Scope ist geschlossen. Was der Coworker braucht, und was er **entscheiden** muss.

### 10.1 Upload-Kandidaten (Georg lädt hoch, ins Repo `georg-doc/kayfabizarro`)

| Datei hier | Ziel im Repo | Warum |
|---|---|---|
| `uploads/EMBED_CUBE_PET_FULL_v2.md` **v2.2** | `media/3D_Assets/GLB_cube-pets/` | löst v1 ab; §6 war **falsch** (siehe 10.2) |
| `studio-v3/pet-puppet.v1.js` | `media/3D_Assets/build/` | §16 der Bauanleitung verweist darauf, die Datei fehlt dort noch |
| `studio-v3/pet-mouth.v1.js` | `media/3D_Assets/build/` | **nur über WS0** — es gibt drei divergente Fassungen (§6/§7 C) |

Nichts davon ist schwer (alles < 50 kB). Die Texturen liegen schon im Repo.

### 10.2 Was in der Bauanleitung falsch war — v2.2 richtet es

Die v2.1-Fassung hat Einbauer an drei Stellen in die Irre geführt. Das ist der wichtigste Teil des
Handovers, weil externe Apps danach bauen:

1. **„Der Mund ist eine flache Ebene mit View-Facing-Fade."** Überholt seit §Auflage. Er ist per
   Raycast an die Körperfläche angeschmiegt (52 Punkte, Wölbung 0,284 U), **tiefengetestet**, und
   wird von Geometrie davor korrekt verdeckt. Der Fade ist nur noch Restsicherung. → neu §6.4
2. **„Zwei Mund-Sets, gleiche 13 Keys."** Es sind drei, und `red` hat **12** Formen. Ein Set darf
   Formen fehlen; `_key()` löst auf, `has()` gibt Auskunft. → neu §6.1
3. **Die `setParams`-Liste war unvollständig** — `lift`, `wrap`, `onTop`, `slope`, `set`, `visemeMap`
   fehlten komplett. Ohne `wrap`/`onTop` kennt ein Einbauer den Rückweg nicht. → neu §6.3

Dazu nachgezogen: Fallback-Hinweis in §16.1, und §13 Backlog stimmt wieder (Sprechblasen-Zipfel ist
erledigt, DecalGeometry nur noch teilweise offen).

### 10.3 Drei Fragen an den Coworker (Contract-nah, nicht Look)

1. **Gehört `slope` in den Contract?** Heute ist es ein Modul-Default (0.05) und wird pro Pet über
   `mouth.slope` überschreibbar mitgeschrieben. Ist das richtig, oder ist es eine globale
   Motor-Konstante, die kein Pet einzeln braucht? *Meine Meinung: pro Pet, weil die Wangenkante
   von Pet zu Pet anders steht.*
2. **Bekommt `MOUTH_SETS` einen `fallback`-Eintrag im JSON-Contract?** Er lebt heute im Modul
   (`red.fallback = 'neutral'`). Sobald ein weiteres unvollständiges Set kommt, ist das eine
   Datenfrage, keine Code-Frage.
3. **WS0-Reihenfolge.** Die drei `pet-mouth.v1.js`-Fassungen müssen zusammen, **bevor** ein
   sprechendes Pet im Embed- oder Travel-Pfad möglich ist (§6). Die kanonische Fassung kennt nicht
   einmal `surface` (Befund S94). Braucht der Travel-v14-Sprint das? Wenn nein, bleibt es liegen.

### 10.4 Wo v5 anfängt

`§7` ist die Liste. Der kleinste sinnvolle Einstieg ist **§7 A** (Look-Zahlen abnehmen, kein Code),
der größte Hebel **§7 B1** (§2c „der ganze Körper spricht") — und dessen Vorfrage gehört vor den
ersten Handgriff: *Studio oder Motion-Editor besitzt die Betonung?*
