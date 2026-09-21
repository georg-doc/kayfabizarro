# Übergabe an den frischen Chat · KFB FrizzleGraft / FrankenStein
*Stand 12.09.2026, 18:10 — Ende der Sitzung »Rover, Wanne, Material«. Alles Gemessene steht im LIVING.*

## In einem Satz
Drei Blätter sind arbeitsfähig: das **Studio v15** (Figur, Look, Anim), **Rig v1** (Oberkörper auf
Sockel mit Cockpit) und **Rig v2** mit drei Reitern — Sockel · **Rover** · **Wanne** — dazu
Farbzonen und Repo-Texturen. Offen sind **zwei benannte Aufgaben**: die Wortmarke (Rezept liegt
daneben) und der Hals als Knopf.

## Womit du anfängst
1. `CLAUDE.md` lesen — besonders die **Messregeln**.
2. `LIVING_frizzlegraft.md` von oben, mindestens S29c bis S32. Dort steht jeder Fehler dieser
   Sitzung mit Ursache. Die meisten sind **eine Klasse**: *etwas ist berechnet, aber nicht
   angeschlossen* — der letzte Fall (S32) ist der lehrreichste: `measureTub` liefert `water` als
   **Objekt** `{topY}`, ich hatte eine Zahl gelesen, und der Bericht behauptete »kein Wassernetz«,
   während das Netz geladen war.
3. `HOUSEKEEPING.md` — was AKTIV, SUPERSEDED, geteilt ist, und die Aufräumkandidaten.
4. `github.md` — alle Modelle kommen zur Laufzeit aus dem Repo, nichts liegt kopiert im Projekt
   (Ausnahme: der eine lokale Spender `FrizzleBob_Yellow.gltf`).

## Zuerst lesen
**`OFFEN_nach_v16.md`** — vier offene Punkte nach der v16-Runde (Kartenmotiv um 90° drehen,
Kippung greift im Bild nicht, Vollexport + Standalone + WSA, Briefing für den Sonnet-Chat).
Jeder Punkt mit Befund, Fundstelle und dem, was noch NICHT gemessen ist.

## Die Blätter
- **`KFB FrankenStein Studio v16.dc.html`** (Wurzel) ⚠ **WIRD ERZEUGT** aus
  `petstudio-v9/KFB FrankenStein Studio v16.dc.html` (dieselbe Zeile `__KFB_MODBASE` wie bei v15).
  Neu gegenüber v15: **Materialzonen** (Abschnitt »Material zones« im Körper-Reiter — Farbwähler und
  Oberfläche je Atlasfeld, `pet.graft.mat`), **ovale Augen** (vier Regler im Gesicht-Reiter,
  `pet.eye.oval`) und die **Surfpose** (Preset + Regler »Stance«, Griff »out to the sides«).
  v15 bleibt unberührt als Rückweg.
- **`KFB Mech & Vehicle Rig v2.dc.html`** — das aktuelle Arbeitsblatt.
  - Reiter **Sockel**: 1:1 der Inhalt von v1 (Hüftschnitt · Sockel · Cockpit von Hand · Arm-Posing).
  - Reiter **Rover**: `Rover_Round.gltf`, Schüssel und Mast geschnitten, Rig als **ein Stück**
    aufgesetzt (Größe · X/Y/Z · Drehung).
  - Reiter **Wanne**: `bath.gltf` + vier Kenney-Räder + Space-engine-Düse, ganze Figur ohne Cockpit,
    Sitz nach dem Rezept aus dem Rennen.
  - Abschnitt **Material**: fünf plus drei Farbzonen, Hauspalette, Repo-Texturen mit Box-Projektion.
  - Konfiguration raus und rein (JSON, Messung fährt mit). Zwei Stände liegen in `fixtures/`.
- **`KFB Mech & Vehicle Rig v1.dc.html`** — Referenz; bekommt Fixes mit, wenn sie Reiter 1 betreffen.
- **`KFB FrankenStein Studio v15.dc.html`** (Wurzel) ⚠ **WIRD ERZEUGT** aus
  `petstudio-v9/KFB FrankenStein Studio v15.dc.html`. Unterschied: ein `<script>` im Helmet, das
  `window.__KFB_MODBASE` setzt. **Immer die Quelle bearbeiten**, dann neu erzeugen:
  ```js
  let h = await readFile('petstudio-v9/KFB FrankenStein Studio v15.dc.html');
  h = h.replace('<helmet>', `<helmet>\n<script>window.__KFB_MODBASE = new URL('petstudio-v9/', location.href).href;</script>`);
  await saveFile('KFB FrankenStein Studio v15.dc.html', h);
  ```
- `KFB FrizzleDummy Lab v1.dc.html` — Meßbank, unberührt.

## Ladeweg (alles zur Laufzeit)
`frizzlegraft-v1/`: `graft-biped.v1.js` (Bewohner) · `facehost.v1.js` · `headgraft.v1.js` ·
`matzones.v1.js` (v16: Materialzonen aus dem Farbfeld-Atlas) · `eyeoval.v1.js` (v16: ovale Augen) ·
`torsobase.v1.js` (Hüftschnitt + Sockel) · `look.v1.js` · `seat-lab.v1.js` (Wanne messen, `RACE`) ·
`ears.v2.js` · `anim-audit.v1.js` · `anim-map.v1.js`
`petstudio-v9/studio-v12/`: `frizzlebob.v4a.js` · `pet-eye-rig.v6.js` · `brow-rig.v2.js` ·
`pet-nose.v2.js` · `pet-moustache.v1.js` · `studio-v13/pose-rig.v1.js` · `studio-v3/pet-mouth.v1.js`

## Wie Georg arbeitet
Splitscreen, **832 px breit**. »Jeder Buchstabe muß Miete zahlen.« Regler oben, Messdaten hinter dem
Reiter »Messen«. Er antwortet in Diktat-Prosa; darin stecken oft drei Aufgaben — sauber trennen und
die Reihenfolge bestätigen lassen.

## Bericht an Georg
Ein Satz, ein Beleg, drei Schritte, klare Frage mit markierter Empfehlung. Kein Jargon, kein
Denglisch, keine Zahlenketten. Fehler zuerst benennen, dann die Ursache, dann die Zahl.

---

# Die zwei offenen Aufgaben

## 1 · Wortmarke als Rückenlogo → **Studio v15**
Vollständiges Rezept in **`TODO_WORTMARKE_STUDIO_V15.md`**: in die Textur malen (nicht aufsetzen),
`driver_texture` 1024 × 1024 mit `flipY = false`, die beiden `GO GO GO`-Stellen erst **messen**, dann
übermalen, Rücken »Kayfa« über »Bizarro« auf rotem Kasten, T-Shirt-Logo fällt weg, Abnahme am Pixel.

## 2 · Hals als Knopf mit Regler
**Gemessen, bevor du baust:** Schädelunterkante **0,511**, Körperoberkante **0,551** — die beiden
**überlappen um 0,040**, es gibt heute keine Lücke. Der Wirt hat **keinen Halsknochen**, eine
Animation könnte den Hals also nicht bewegen. Nötig wird er erst, wenn Georg den Kopf über
`neck > 0,04` hebt: dann ein **Zylinder in FrizzleBobs Grundgelb**, Knopf »Hals an/aus« plus Regler
für Höhe und Radius, am selben Ort wie `neck`/`size` (`_bipedBodyRows`, Graft-Zweig). Der Zylinder
hängt an `B._graft.group` oder am Hüftknoten — **nicht** am skalierten Figurenknoten (dieser Fehler
hat eine Runde gekostet: die Wanne erbte die Skalierung und war fünfmal zu klein).

## Dazu offen bei WSA, nicht bei uns
`WSA_UEBERGABE_ROVER_MATERIAL_ANTRIEB_2026-09-12.md`: Materialzonen statt Tint im Garage Lab
(Reifen nie mitfärben) und der fehlende Mount-Typ »Antrieb«.

---

# Fallen, die schon bezahlt sind
- **»Läuft« ist kein Beweis, daß etwas SCHREIBT.** Die Ruhe-Aktion `Idle_A` läuft mit **Gewicht 0**
  und `mixer.time = 0` — sie schreibt keinen Knochen. Ein Nullpunkt, der daraus kommt, ist die
  Skelett-T-Haltung. Bezüge deshalb **direkt aus der Clipspur** (erster Schlüsselwert), nicht aus
  dem Mixer. Dritter Fall dieser Art; die beiden Vorgänger waren `mx.time > 0` und `isRunning()`.
- **Die Bounding-Box ist nicht die Silhouette.** Beim Rover endet sie an der **Antenne** (5,168),
  das Dach liegt bei **3,563** (25 Strahlen, Median). Und: `setIndex()` entfernt Dreiecke, nicht
  Punkte — `computeBoundingBox()` liefert danach weiter die alte Box.
- **Durchschüsse gehören nicht in einen Median.** Ein Loch im Dach zog die gemessene Sitzhöhe in den
  Rover hinein; Treffer unter 60 % der Höhe werden verworfen und gezählt.
- **`clone(true)` teilt Material UND Geometrie** mit dem Spender im Cache — vor dem Ändern klonen.
- **Atlas-UV**: eine Kacheltextur auf Kenney-/Quaternius-Netzen gibt pro Fläche einen Farbwert.
  Box-Projektion ist die Vorgabe, Original-UV der Rückweg.
- **Verhältnis statt geliehener Absolutzahl:** `RACE.lift = −0,28` gilt für einen 1,55 hohen Fahrer;
  übernommen wird der Anteil (−0,181 der Figurenhöhe).
- **Verborgenes Vorschaufenster:** `document.hidden` parkt die Bildschleife. **Vor jedem Standbild
  selbst rendern**, sonst sieht ein gesunder Bau tot aus.
- **WebGL-Standbild:** `html-to-image` liest den Canvas nicht — ein leeres Bühnenfeld im Screenshot
  ist ein Artefakt, kein Fehler. Am DOM messen.
- **Einheiten:** `pose.a`/Knochenlängen in **Wurzeleinheiten**, `Box3` in **Weltmaßen**.
- **Die Box des TEILS, nie die des ganzen Spenders.**
- **Eine Abnahmezahl, die vom Spielzustand abhängt, muß ein Verhältnis sein.**
- **Eine Messung darf nichts speichern** — nicht über Bedien-Handler messen.
