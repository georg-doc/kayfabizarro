# SMA1 · Source-backed Map Piece Animator · Gate Notes

Brief: `skills/chat/workflows/KFB_STORYTELLING_MAPS_V1_2026-09-20/CLAUDE_DESIGN_BRIEF_MAP_ANIMATOR_V1.md`
Planning branch: `planning/storytelling-map-animator-v1-2026-09-20` · head `dadf2fa34cc3b64ae7177953387c91e6d3042bb4`
Date: 2026-09-20

## [GATE] before the round

- **Auftrag (verbatim):** "SMA1 only: prove the existing Europe Map Board as a reversible animated
  puzzle-piece stage with flat/table/flyover/stand-up views, one real Grotesque landmark donor and
  one reused ripple effect — all returning cleanly to canonical geography."
- **Vorlagen, die kopiert werden:** see donor pins below.
- **Wo geforkt wird:** `tools/kfb-cartoon-map-board/src/app.js` → `sma1-map-animator.js`.
- **Nicht gebaut:** burn, bomb, hurricane, particle library, cards/PDF, curtain, editor, OSM drilldown.

## Donor pins

### 1 · Europe Cartoon Map Board — the fork base

`tools/kfb-cartoon-map-board/src/app.js` @ `dadf2fa34cc3b64ae7177953387c91e6d3042bb4`

Copied verbatim (not recomputed):

```text
OPENPLANET_API   https://download.openplanetdata.com/files?category=boundaries&subcategory=countries&limit=-1
OPENPLANET_BASE  https://download.openplanetdata.com
fileUrl(f)       BASE + '/' + f.remote_path + '/' + f.remote_version + '/' + f.remote_filename
catalogue filter remote_version==='v2' && extension==='geojson' && !deprecated ; key = f.entity upper
CORE_CODES       40 ISO-alpha2 (IS…UA)
EUROPE_BBOX      minLon -25 maxLon 42 minLat 34 maxLat 72
CENTER           lon 10 lat 51          MAP_SCALE 4.05
project(lon,lat) x=(lon-10)*cos(51°)*4.05 ; z=-(lat-51)*4.05
BOARD_W 188  BOARD_H 166  BOARD_DEPTH 2.35  BOARD_TOP 2.35
PIECE_DEPTH 0.9  BASE_INK_WIDTH 0.25  LABEL_MIN_AREA 18
ring sampling    max 480 points, closed-ring aware (no RDP chord)
polygon keep     area>=0.004 ; then i===0 || area>=max(0.018, largest*0.00035) ; slice(0,24)
extrude          depth 0.9 bevelSize .035 bevelThickness .045 bevelSegments 1 curveSegments 2
ink ribbon       y = PIECE_DEPTH+0.055, width 0.25*inkScale, wobble sin(i*0.47+seed*0.013)*0.55 + sin(i*0.137+seed*0.021)*0.45
lights           Hemi(0xfff5dd,0x413b50,1.9) · Dir(0xfff0d4,4.1)@(-80,120,-95) shadow 2048/±130/±115 · Dir(0x83a8d6,0.8)@(110,60,90)
scene            bg 0x2b2533 · fog(0x2b2533,175,370) · ACESFilmic exposure 1.03
camera           fov 40 · hero [35,128,155]→[0,4,-5] · top [0,225,0.1]→[0,0,0] · low [22,54,160]→[0,7,-8]
explode          spread 5.0 + seeded01(seed,4)*4.2 along centroid direction ; lift seeded01(seed,7)*0.55
easing           piece lerp k = 1-pow(0.0005,dt) · camera tween k = 1-pow(0.0012,dt)
```

Source spec: `tools/kfb-cartoon-map-board/data/europe-p0/SOURCE_SPEC.json`
Attribution: **Map data © OpenStreetMap contributors, ODbL 1.0** (via OpenPlanetData v2 GeoJSON).

### 2 · Grotesque landmark — the img2threejs lane

`tools/img2threejs/` @ `dadf2fa34cc3b64ae7177953387c91e6d3042bb4`, consumed exactly as
`landmarks/pilot-06/viewer.mjs` consumes it:

```text
landmarks/pilot-02/geometry.mjs        buildLandmark(id), MODEL_IDS
landmarks/pilot-03/deform.mjs          shapeAsset(raw, cityStyle, mode), modeSupported
landmarks/pilot-01/three-adapter.mjs   createLandmarkGroup(THREE, asset, palette)
styles/landmark-world-style.mjs        resolveLandmarkColours(...)
styles/landmark-style-profiles.v1.json
styles/travel-visual-snapshot.v1.json
../osm-city-lab/styles/kfb-city-v0.json
default shape mode                     city-grotesque   (Georg's accepted landmark default)
models                                 eiffel · giza · stonehenge · pentagon · spasskaya · kremlin-wall
```

Pilot-06's own `boot()` is NOT used — it is bound to its page's DOM ids. SMA1 imports the same
four modules one level below it. That is the adapter seam.

**Note for the record:** `github_get_tree` does not list `viewer.mjs` in that folder although the
file exists (same blind spot that hid the `.gltf` files). Read the path, do not trust the listing.

### 3 · Ripple — Travel carpet-waver

`travel/terrain-planets-v1/card-carrier.js` @ `8614282aab2ced43bb5dda9fcf7abadf9768100a`
(repo `georg-doc/KFB-Travel-Globe`, **private** — cannot be fetched at runtime, so the maths is
copied into `sma1-map-animator.js`).

Copied verbatim from the `carpet-waver` block:

```js
wavePhase += dt * (2.6 + speed * 0.07) * cq;
const amp   = (0.06 + speed * 0.0016) * cq;
const wave  = Math.sin(wavePhase + z * 3.4 + x * 1.6) * amp * (0.35 + Math.abs(w));
// + computeVertexNormals() every frame
```

**NAHT — one documented line.** The donor ripple is *directional*: its phase argument is
`z*3.4 + x*1.6`, a wave flowing backwards along the carpet. A map ripple has to expand *from a
point*. Only the phase argument is changed to `-dist * K`; amplitude curve, rate, the
`0.35 + |w|` edge weighting and the per-frame normal recompute are the donor's. Everything else
about the effect is the donor's, and that substitution is the entire seam.

## KORREKTUR · KFB Ink Outline (Georg, 2026-09-21)

**Befund:** die geerbte Kante des Map-Board-Donors ist aus eckigen Einzelstrichen gebaut.
Der Kanon sagt dazu wörtlich: *"Eine gestrichene Polylinie mit Punktrauschen kann nie wie ein
Pinselband aussehen — egal, wie man jit und baseW dreht. Wer an einer Kartenkante Parameter
dreht und sie bleibt zackig, hat die falsche Familie erwischt."* Genau das war der Fall.

**Neue SSOT:** `skills/kfb-ink-canon.js` @ main, `INK_CANON_VERSION 2` — zur Laufzeit über
jsDelivr geladen, nicht nachgebaut. Combat Arena ist der aktuellere Konsument dieser Quelle.

Übernommen: Bogenlängen-Parametrisierung, die zwei langwelligen Sinus mit
`a1=(rnd()*3+2)*bow, f1=⌊rnd()*3+3⌋ / a2=(rnd()*1.6+0.8)*bow, f2=⌊rnd()*4+6⌋`,
Punkt-Jitter als Textur, die Feder-Modulation `0.62·sin(k1θ+q1)+0.38·sin(k2θ+q2)` mit
taper/edge/minHalf, die Gehrungs-Offsets aus `inkRibbon2D`, `mulberry` als RNG und
**bow = 1.4 × 0.14 = 0.196** — die Zahl, deren Verwechslung mit der Signatur im Kanon als
"Bend statt ink" dokumentiert ist.

Drei Presets, Default **Ink** für alle Panels, Karten und Schnittkanten:

| Preset | Kanon-Eintrag | was es ist |
|---|---|---|
| Ink | `card` | Band-Familie, bow 0.196 — der Kanon |
| Bend | `academy-2026-07` | bow 1.4, also ×7 — der dokumentierte Fehlstand, als Vergleich |
| Torn | `sky-2026-07` | Strich-Familie mit Punktrauschen |

### Drei Nähte, alle benannt

- **N-A · Kein Corner-Fade.** Der Kanon baut ein Rechteck mit festen Ecken. Eine Landeskontur
  ist ein geschlossener, überall gekrümmter Ring — es gibt keine Ecke, zu der ausgefadet würde.
  `fade = 1` über den ganzen Umfang.
- **N-B · Eine Feder für das ganze Brett.** `hb` ist im Kanon relativ zu min(W,H) *einer* Karte,
  die ihren Rahmen füllt. Bei 40 Stücken gilt die eine Regel — "eine gezeichnete Linie auf Papier
  hat überall dieselbe Feder" —, also wird sie einmal gegen eine Referenzausdehnung von 19 u
  kalibriert. Die *Bauchung* bleibt relativ zur eigenen Ausdehnung des Stücks, denn sie ist eine
  Form-Kennzahl (bowPct).
- **N-C · Feder-Deckel für kleine Länder.** Gemessen am Balkan: Montenegro ist schmaler als zwei
  Federbreiten und ersäuft in der eigenen Kontur. `hb` wird deshalb auf
  `max(minDim × 0.055, 0.035)` gedeckelt — greift nur unterhalb der Referenzausdehnung.

### Drei behobene Artefakte

- **Dreieck-Keile quer durch Norwegen, Dänemark und über die Ostsee (2026-09-21).** Nicht die
  Tusche, sondern die Triangulierung. Der Donor dezimiert jeden Ring per **Index-Schrittweite**
  (`sampleRing`, jeder n-te Punkt, max 480). An einem schmalen Fjord springt diese Schrittweite
  von einem Ufer auf das gegenüberliegende — der Ring schneidet sich selbst, und earcut spannt
  die Fläche über die Selbstüberschneidung. Genau die geraden Keile.
  **Fix:** für die Fläche wird nicht mehr dezimiert. Die echte Kontur zu triangulieren ist
  einmalige Arbeit und kann sich nicht selbst schneiden; nur Ringe über 24 000 Punkten werden
  bogenlängen-gleichmäßig gekürzt, ohne Index-Sprünge. Nebeneffekt: die Fjorde sind jetzt
  tatsächlich Fjorde.

- **Gerade Zacken quer durch Norwegen und Dänemark:** Gehrungs-Explosion an fast antiparallelen
  Segmenten (Fjordspitzen). Der Kanon fängt das mit `max(…, 0.35)` ab; auf einer Küstenlinie
  reicht das nicht. Zusätzlich harte Deckelung auf 2.2 × Feder, plus Entfernen doppelter Punkte
  vor der Abtastung.
- **Panel B blieb auf dem vorigen Land stehen:** `Box3.setFromObject` wurde vor
  `updateMatrixWorld` gemessen, die Kamera bekam die Matrizen von vorher.

### Kante = Tusche (Combat Arena)

Aus `KFB Combat Arena/combat-arena-v1/arena-ring.v1.js` übernommen: die Seitenflächen tragen
`0x1f1a14, roughness 0.92` — nicht die abgedunkelte Fläche. Dort war die beleuchtete Papierkante
der "weiße Blitzer" neben der Kontur. Dazu `polygonOffset -1/-1` auf der Oberseite gegen z-fight.

### UI · Idiom aus Resident Atlas

Donor: `tools/resident_atlas/index.html` @ main. Übernommen statt neu erfunden:

- **Objekt füllt den Rahmen.** Das Brett liegt auf `position:fixed; inset:0`, die Chrome
  schwebt darüber. Vorher war es ein gestapeltes Dokument mit fixer Panel-Höhe.
- **`.box`** — `rgba(25,22,17,.93)`, 1 px `#4f4838`, Radius 12, `backdrop-filter: blur(10px)`.
- **Tokens 1:1** — `--bg #15130f · --panel · --line #4f4838 · --text #f3ead8 · --muted #b8aa90
  · --accent #e8b35f · --ok #8fca8b · --bad #e58b7d`.
- **Kopf** mit `env(safe-area-inset-*)`, Status rechts mit ok/bad-Färbung und `N/M`-Zählung.
- **Werkzeugleiste** unten mittig als scrollbare Pille, `button.active` bekommt die Akzentfarbe.
- **Info-Panel** rechts, fährt mit `transform: translateX(calc(100% + 28px))` weg; unter 820 px
  wandert es nach unten und die Marke verschwindet — genau die `@media(max-width:700px)`-Regel
  des Donors, auf die breitere Leiste dieser Seite angepasst.
- **Toast** mittig, 1,5 s, meldet die ausgelöste Aktion.

Kamera mit `zoomToCursor`, Pan auf rechter Maustaste / Zwei-Finger.

### Kantenmodus · Outline vs Schatten

Georg 2026-09-21: *"wie bauen einen view ohne outline, dafür schatten-kanten und color-coding"*.

- **Outline** — Kanon-Tusche, Seiten in Tuschefarbe (Combat Arena). Default.
- **Schatten** — keine Tusche. Jedes Stück wird um **0,62 u** angehoben, sodass der bestehende
  Schattenwurf zwischen Stück und Brett sowie zwischen benachbarten Stücken die Kante zeichnet;
  die Seitenwand bekommt den eigenen Farbton auf **0,32** abgedunkelt, also eine Eigenschatten-
  Kante statt einer gezeichneten Linie. Die Trennung kommt damit aus Licht und Farbe.

Der Hub sitzt auf `inner.position.y`, **nicht** auf dem Pivot — der kanonische Zustand bleibt
unberührt, die Reset-Abweichung bleibt exakt 0.

### Farbwelt · vom Owner, nicht erfunden

**Korrektur.** Erster Anlauf war ein handgeschriebener Zehner-Satz nach dem Cologne-Race-Track-
Screenshot. Donor-Matrix §6 und das Briefing nennen aber einen Owner und schließen die Tür:
*"Do not invent a new palette owner."*

Owner: `travel/travel-v16/terrain-v16/world-palettes.js` @ main — **im Repo `kayfabizarro`**,
nicht in `KFB-Travel-Globe` (dort liegt der Ripple-Donor; die Matrix nennt nur den Pfad).
`NAMED_PALETTES` ist 1:1 übernommen: acht Farbwelten, je drei Stops, RGB 0..1.

**NAHT.** Der Owner liefert Verlaufs-Stops für einen Terrain-Shader, keinen kategorialen Satz
für 40 aneinandergrenzende Stücke. Die Stückfarben werden deshalb aus seiner Rampe
**abgetastet** — dieselbe Lesart, die der Shader anwendet. Der untere Rampenbereich
(t < 0.22) bleibt außen vor: das dunkle Tal ist als Flächenfarbe eines Landes unlesbar.

Default ist **Ember** (*"Schwarzrot → Glut → Butter, dramatisch warm"*) — die Farbwelt des
Owners, die dem Cologne-Race-Track-Bild am nächsten kommt. Alle acht plus der Pastellsatz des
Map-Board-Donors sind im Panel wählbar. Brettwasser `a6d6d7` → `4fb3ae`.

### Invarianten statt Reihenfolgen — dieselbe Lehre, drei Gegenstände

Dreimal in Folge lag derselbe Bauplan zugrunde: etwas Wichtiges hängte am Ende der
Boot-Sequenz, und die kommt nicht immer an (gedrosselte Timer in einer Hintergrund-Vorschau
reichen schon — gemessen: `Promise.race` mit 45 s Deckel lief nach zwei Minuten noch nicht durch).

- **Färbung.** Lief gegen einen Graphen von 5 statt 17 Grenzen und meldete die 5 als Messung.
- **Auswahl.** `selectPiece` stand hinter derselben Race. Ergebnis: kein Stück gewählt — und
  damit waren RAISE / STAND_UP / SLIDE / ROTATE / FLIP / PULSE / SNAP / Ripple stumme
  Blindgänger, denn alle acht sind auf `if(!selected) return false` gebaut. Also die Kernbedienung
  des Labors, weg, ohne eine einzige Fehlermeldung.
- **Nachladetaste, zwei Runden.** Erst beschriftet aus `expected − pieces` (26), gearbeitet wurde
  aber `failedFiles` (1): der Knopf versprach 26 und meldete nach einem Abruf „vollständig“,
  während 25 Länder fehlten. Die Beschriftung kam daraufhin aus derselben Liste — und damit war
  der Knopf bei hängendem Boot **ganz weg**, weil diese Liste nur der tote Sweep füllt. Aus einem
  lügenden Knopf wurde ein fehlender: rotes „32 fehlen“, keine Wiederherstellung, Sackgasse. Der
  Sweep läuft jetzt selbst im Takt, idempotent (`dropFailed` räumt bei Erfolg auf).

**Die Lehre, spät genug gezogen:** zweimal wurde ein SYMPTOM der toten Stelle in den Takt
verschoben und der dritte Konsument stehen gelassen. Wer eine Ursache findet, soll ihre
Abnehmer zählen, nicht den ersten reparieren. Alle drei hängen jetzt im 500-ms-Takt als **Invariante**, nicht an einer Reihenfolge: gefärbt
wird, wofür noch nicht gefärbt wurde; gewählt wird, solange nichts gewählt ist. Die Notauswahl
merkt sich, dass sie eine war, tritt zurück, sobald das dokumentierte Startland FR ankommt —
und nie gegen eine Wahl, die von Hand getroffen wurde. Und jeder stille `catch` schreibt jetzt
in die Konsole; ein hängender Boot war vorher unsichtbar.

### Dritter Befund · Harmonie rechnet man nicht

Georg, 2026-09-21, zu zwei gerechneten Anläufen nacheinander: *"zu pastellig und funktioniert
nicht mit dem wasser"*, dann *"ist auch visuell nicht ansprechend oder harmonisch"*. Beide
Anläufe waren Verfahren: Töne gleichmäßig auf dem Farbkreis verteilen, Helligkeit und Sättigung
per Formel setzen. Der Denkfehler steckt in beidem — **eine Palette über den ganzen Farbkreis bei
gleicher Sättigung ist rechnerisch optimal getrennt und sieht trotzdem zusammengewürfelt aus.**
Harmonie kommt aus einem geteilten Unterton und einem schmalen Helligkeitsband, und das lässt
sich nicht ableiten, das wählt man. Also kuratierte Sätze, Hex für Hex.

**Das Wasser gehört zur Palette.** Jeder Satz bringt Meer und Meeresgrund mit, statt gegen ein
festes Teal anzurennen — ein Cremeton-Atlas braucht ein helles Meer, ein Spielbrett ein tiefes.
Das war der zweite Teil von Georgs Befund und der Grund, warum keine Landfarbe passen konnte.

**Drei Sätze zur Wahl gestellt, Georg nahm „Spielbrett“ und sagte „sättiger“:**
*"denke an ein buntes, harmonisch designtes Brettspielfeld für ein satirisches Cartoon-Game mit
Underground-Comic-Anmutung"*. Also Druckfarben statt Geologie: sieben flache Tinten wie aus einem
Siebdruck auf getöntes Papier, sechs warme und **ein kühler Gegenpol**, damit die Fläche nicht
zur Soße wird. „Atlas · Papier“ (helles Meer) und „Zine · gedämpft“ bleiben im Menü.

**Die Verteilung war die eigentliche Arbeit — dritter Fehlstand, gleicher Bauplan.** Eine
gewichtete Punktzahl aus ΔE und Verteilung fällt IMMER zugunsten von ΔE aus. Erst überzog Rosa
die Karte, dann Lavendel, dann Pflaume — dreimal derselbe Mechanismus, dreimal an den Strafterm-
Gewichten gedreht statt am Verfahren. Trennung ist aber keine Größe, die man maximiert, sondern
eine **Schwelle**. Jetzt zweistufig: erst filtern (Ton nicht beim Nachbarn belegt UND ΔE ≥ 18),
dann unter den Übriggebliebenen **rein nach Verteilung** wählen — seltenster Ton, seltenste
Stufe, seltenste Farbe, Seed. Bleibt nichts übrig, gewinnt der größte Abstand, und das wird als
Konflikt gezählt statt verschwiegen.

**Gemessen, Satz „Spielbrett“, 40/40:** 67 Grenzen · 7 Haupttöne · 21 Stufen · 0 Ton-Dubletten ·
0 gleiche Farben · ΔE min 19,6.

### Zweiter Befund · die Palette, nicht die Färbung

Georg, 2026-09-21: *"die farbverteilung ist nicht gut gelöst, verglichen mit anderen farbigen
karten- und länder-darstellungen … gebrochene farben und haupt-töne … mehr farbstufen"*.

Richtig, und es trifft nicht die Färbung, sondern die Palette. Eine Terrain-Rampe ist EINE
Farbfamilie — Dunkelrot → Glut → Butter. Zehn Stufen daraus sind zehn Schattierungen derselben
Sache: die Karte liest als Heatmap, also als *"die roten gehören zusammen"*. Keine Graphfärbung
repariert das. Was eine politische Karte trägt, ist **Tontrennung**, nicht Helligkeitstrennung.

**Neu: Atlas · gebrochene Haupttöne (7 × 3), jetzt Default.** Wenige Haupttöne, jeder stark
gebrochen (niedrige Sättigung, hohe Helligkeit), jeder in drei Stufen — wie Atlanten es seit
hundert Jahren machen. Der Ton trennt die Nachbarn, die Bräune hält die Fläche ruhig genug für
Tusche und Beschriftung.

**NAHT · der Owner bleibt, ist aber nicht mehr allein zuständig.** `world-palettes.js` ist der
Owner für TERRAIN — Verlaufs-Stops für einen Höhen-Shader. Einen kategorialen Satz gibt es dort
nicht, und einen zu erfinden verbietet das Briefing. Die Haupttöne kommen deshalb aus der Quelle,
die dieses Projekt für kategoriale Farbe ohnehin besitzt: die `--wash-*`-Modusfarben des
KAYFABIZARRO-Systems plus `--paper-stain`. Nicht erfunden, nur gebrochen. Die acht Rampen des
Owners bleiben wählbar und heißen jetzt, was sie sind: **Terrain-Rampen**.

**Drei Abweichungen vom rohen Wash-Satz, jede aus einem gemessenen Fehlstand:**

- `--wash-tragic-blue` **fällt raus**. Er IST der Ton des Meeres auf diesem Brett; als Landfarbe
  konkurriert er mit dem Wasser, egal wie hell man ihn bricht. Im ersten Atlas-Lauf liefen Türkei
  und Griechenland sichtbar mit der See zusammen. Zusätzlich gilt für jeden Ton in Meeresnähe
  (±0,95 rad) eine eigene, durchweg hellere Stufenleiter.
- `--wash-mystic-violet` wird **0,45 rad zur Blauseite gedreht**. Roh neben
  `--wash-forbidden-magenta` ergab er zweimal Rosa, und die halbe Karte las als eine Familie.
- `--paper-stain` bleibt, aber mit **Sättigung ×0,42** als echter Neutral — ungekappt liegt er
  auf demselben Gelb wie `--wash-rabbit-yellow`, ist also gar kein eigener Ton.

**Harte Regel vor weicher.** Kein Nachbar teilt den Haupt-Ton — das ist die Trennung, die die
Karte trägt. ΔE allein lässt zwei helle Stufen desselben Tons nebeneinander zu, und genau das
liest als *"gehört zusammen"*. Planare Graphen brauchen höchstens vier Farben, sieben Töne sind
reichlich; fällt die Regel trotzdem aus, wird sie in `famConflicts` gezählt statt still gepfuscht.

**„Gut genug“ statt „maximal“ — der Fehler, der zweimal auftrat.** Ungekappt gewinnt immer
derselbe Ton, nämlich der, der am weitesten von allen anderen liegt. Erst überzog Rosa die halbe
Karte, nach der Drehung Lavendel. Oberhalb von **ΔE 32** ist ein Nachbarpaar unterscheidbar;
weiter zu optimieren kauft nichts und kostet die Streuung. Also: kappen, in 4-ΔE-Stufen bündeln,
und unter den gleich guten Kandidaten Ton-, Stufen- und Farbverteilung entscheiden lassen.

**Nachbarfarben · GESCHLOSSEN (2026-09-21).** Bis hierher kam die Stückfarbe aus
`palette[seed % n]`. Ein Seed weiß nichts über Nachbarschaft, also zogen angrenzende Länder
denselben Rampenwert — und auf einer Rampe aus zehn Stufen sehen schon Nachbarstufen gleich aus.

- **Nachbarschaft gemessen, nicht geschätzt — zweiter Anlauf.** Der erste lief über das
  gemeinsame Besitz-Raster und meldete **null Grenzen** auf einem Brett voller Grenzen. Ursache:
  Canvas-Kantenglättung. Das Randpixel zwischen zwei Ländern wird von beiden übermalt, sein
  Rotwert ist eine Mischung, und `owner = rot−1` dekodiert daraus einen DRITTEN, nicht
  existierenden Index — zwischen den echten Nachbarn lag eine Naht aus Unsinn, also berührten
  sie sich nie. Jetzt wird je Land **eine** Maske gerastert und jede Zelle mitgenommen, die das
  Land auch nur anschneidet (`alpha >= 8`); zwei Nachbarn belegen die Grenzzelle dann beide.
  Berührung ist damit eine Überlappung, und die kann Antialiasing nicht kaputtmachen, weil nur
  noch „angeschnitten oder nicht“ gefragt wird. Zellkante **1,0 u ≈ 17 km**, **3 Zellen
  Mindestberührung** — kein Artefakt erfindet eine Grenze, und der Kanal bleibt Wasser.
- **Null Grenzen ist ab jetzt ein Befund, kein Schweigen.** Kopfzeile und Quellen-Feld zeigen
  `KEINE GRENZE GEMESSEN · Färbung ungeprüft` bzw. den Messfehler im Klartext. Eine Messung,
  die still „0“ meldet, ist schlechter als keine — und sie ist genau die Behauptung, die dieser
  Abschnitt aufstellt.
- **DSATUR** über die Rampe: das Land mit den meisten schon gefärbten Nachbarn zuerst.
- **Nicht „verschieden“, sondern „unterscheidbar“.** Unter den Kandidaten gewinnt die Farbe mit
  dem größten **Mindestabstand in Oklab** zu allen Nachbarfarben (Helligkeit ×1,6 gewichtet, weil
  sie auf einer beschatteten Karte weiter trägt als der Ton). Bei Gleichstand — halbes ΔE als
  Raster — gewinnt die bisher seltener benutzte Farbe, sonst läuft die Karte auf drei Tönen
  zusammen.
- **NAHT.** Keine echte Vierfarben-Zuweisung. Die Rampe liefert zehn Werte, und zehn Farben mit
  garantiertem Abstand lesen besser als vier mit minimalem. Vier wäre die sparsamere Mathematik,
  nicht die lesbarere Karte.
- **Messbar statt behauptet:** `api.colorInfo()` gibt Grenzen, gleiche Nachbarpaare und das
  kleinste ΔE über alle Grenzen; das Quellen-Feld zeigt es. Neu gerechnet wird bei Farbwelt-
  Wechsel, Snapshot-Import und Nachladen; `api.recolour()` erzwingt es.
- **Gemessen bei 40/40 Ländern, Farbwelt Ember:** **67 Grenzen**, **0 gleiche Nachbarpaare**,
  **ΔE min 17,4**. Das ist der Stand, auf den sich „geschlossen“ bezieht.

**Nachspringer · der Weg, der die Färbung übersprang.** `loadBoundaries` wartet nur bis
`BOOT_MS`; danach läuft `drain` weiter und schiebt Stücke in `pieces`, lange nachdem einmal
gefärbt wurde. Bei langsamem Katalog — also genau dem Fall, für den es den Knopf
„N nachladen“ gibt — behielten diese Nachspringer ihre provisorische Seed-Farbe, ohne dass
irgendetwas das gesagt hätte. Zwei Konsequenzen:

- Jeder Weg, der `pieces` verändert, meldet sich bei `scheduleRecolour()` (420 ms Bremse, bündelt
  den Ladeschwung). Dazu hängt ein `drain.then` an dem Lauf, den die BOOT_MS-Frist abgeschnitten
  hat. Ein Stück, das eine Minute später landet, färbt das Brett neu.
- `COLOR_FIT.applied` ist bis zum ersten echten Lauf `false`, und dieser Zustand hat seinen
  eigenen Text: **`NICHT GEFÄRBT · Stücke tragen Seed-Farben`** in Kopfzeile und Quellen-Feld.
  Vorher war „nie gelaufen“ von „lädt noch“ nicht zu unterscheiden — und das ist die eine
  Lesart, bei der ein Leser der Karte glaubt, was sie nicht leistet.

**Nebenbefund derselben Runde · OOM im Ladelauf.** `out of memory` flog unbehandelt aus dem
Render-Treiber. Ursache waren drei lebende Renderer mit **je 2048² Schattenkarte** (~150 MB).
Die zwei Nebenblicke zeigen EIN Stück bzw. EIN Modell und brauchen die Brett-Schattenkarte
nicht — sie stehen jetzt auf 512², ein Nebenblick mit zusammengefahrenem Behälter rendert gar
nicht mehr, und ein Renderfehler wird gefangen statt in die Schleife geworfen.

### Bedienung · zwei Pillen statt einer

Die erste Fassung hatte 23 Knöpfe in einer Pille: `scrollWidth 1634` gegen `clientWidth 900` —
alles nach „Ripple" lag hinter einem Scrollbalken ohne Affordanz, also genau die Regler, die in
diesen beiden Runden dazugekommen waren. Der Resident-Atlas-Donor trägt neun in dieser Pille.

Jetzt: drei umbrechende Pillen (Kamera · Aktionen · Bühne), und alle Darstellungsmodi —
Kante, Tuschepreset, Feder, Farbwelt — sitzen im `#info`-Panel, das ohnehin die
Einstellungsfläche ist. Kein horizontaler Scroll mehr.

### Wasser · kfb-fluid-v2, source-locked gegen Card Zone Lab v2 (2026-09-22)

**Korrektur.** Der vorige Donor (`kfb-fluid-v1/kfb-fluid-shader.js`, aus der ToolBox Bench) war
selbst schon eine Schwundform des Card-Zone-v2-Shaders, nicht die Quelle. Ersetzt durch
`kfb-fluid-v2/card-zone-v2-fluid-source.js` — 10/10 gegen den laufenden Donor-Blob
`43eea82f8727d3581e50374d6263e48a28241d3b` geprüft: Vertex-GLSL 13/13, Fragment-GLSL 31/31,
fünf Fluid-Farben 5/5, beide Originaltexturen, Color-Spaces, RepeatWrapping, Anisotropie 8,
Materialflags und `uTime`-Semantik. `kfb-fluid-v1/` ist gelöscht.

Genutzt werden `createCardZoneV2FluidMaterial`, `loadCardZoneV2FluidTextures` (impliziert über
`loadTextures()`) und `setCardZoneV2ConstantFlow`. Die `CARD_ZONE_V2_FLUIDS`-Tabelle liefert
dieselben fünf Füllungen: Wasser · Öl · Säure · Bubblegum · Schlacke.

**NAHT · Geometrie bleibt map-eigen.** Der Donor erzeugt keine See-/Flussform. `buildSeaGeometry()`
(neu, kein Donor-Code) baut ein durchgehendes Quad-Netz aus den nassen Zellen; `aFlow=[0,0]`
für Meer/Seen kommt separat über `setCardZoneV2ConstantFlow`. Flusstangenten wären derselbe
Aufruf mit einem ungleich-Null-Vektor pro Vertex — noch nicht verdrahtet (siehe unten, Flüsse).

**NAHT.** Das Modul war ursprünglich für den Wassergraben EINER Card Zone gebaut. Ein Meer um 40
Landmassen ist keine Wanne — die Nass-Entscheidung kann von dort nicht kommen. Der Vertrag
verlangt dafür genau eines: **eine** Wahrheit über nass. Sie liegt in `waterMask()` und wird von
Netz und Messung gelesen, sonst nirgends.

Die Maske entsteht nicht durch Punkt-in-Polygon über 40 Länder × 12 000 Zellen, sondern durch
Rastern in ein 2D-Canvas: Außenringe füllen (Land), Innenringe ausstanzen. Einmalige Arbeit in
der Größenordnung der Punktzahl statt ihres Produkts.

**Nebeneffekt, der die großen Seen löst:** der Donor wirft Innenringe weg, weil eine Spielkachel
solide sein soll. Für die Maske werden sie behalten — ein Innenring IST ein See. Gemessen:
7 947 nasse Zellen bei Zellkante 1,6.

**Gemessen und korrigiert:** die Fluid-Farbe `#6fadbc` lag fast exakt auf meinem Brettdeckel
`#4fb3ae`, die Schicht war bei alpha 0,78 unsichtbar. Der Deckel ist jetzt Meeresgrund
(`#1d5b60`), damit das Wasser etwas hat, wogegen es steht.

**Noch offen:** Flüsse als Linien. Das Feldmodul kann sie (`riverPath`, `riverField`,
`riverCells`), aber die OpenPlanetData-Grenzdaten enthalten keine Gewässerläufe — die Quelle
fehlt, nicht der Code.

### Voxel-View

**Donor-Lage, geprüft statt angenommen.** `kfb-voxel-world-v1/voxel-terrain.js` ist ein
*prozedurales* Voxelfeld. Seine API ist `setWorldContext / setPalette / setRainbow /
setColorParams / setFog / setCarve / setCarvePath / setZones` — **kein** Setter nimmt ein
externes Höhen- oder Farbfeld; die Höhen entstehen im eigenen Noise-Bake (`rebakeAll`).
Ein Feld, das eine Landkarte trägt, kann von dort nicht kommen. Deshalb baut SMA1 das Feld
selbst und übernimmt vom Donor das, was übertragbar ist:

- das **D6-Höhenraster** `heightStep = cell/6` (README: derselbe Wert, sonst springen
  Übergänge in ganzen Cubes),
- `world-context.js` als Farb-Owner,
- `edge3.jpg` als Kantentextur (liegt bereit, noch nicht aufgelegt).

**Wie die Karte zu Voxeln wird.** Dasselbe Canvas-Raster wie die Wassermaske, nur mit dem
Landbesitz im Rotkanal kodiert (Index+1, 0 bleibt Wasser). Eine Zwei-Pass-Chamfer-
Distanztransformation gibt jeder Landzelle ihren Küstenabstand; daraus werden die Stufen.
Ein InstancedMesh, eine Instanz pro Landzelle, Farbe aus der Palette des Stücks.

**Gemessen und korrigiert:** erste Fassung nahm die Höhe *nur* aus dem Küstenabstand, beginnend
bei einer Stufe — Küstenzellen waren 0,23 u hoch und verschwanden, die Karte las als Bergklumpen
statt als Kontinent. Jede Landzelle bekommt jetzt erst die Kachelstärke als Sockel
(`PIECE_DEPTH`), die Terrassen liegen darauf.

**Offen und benannt:** echte Elevation ist nicht verdrahtet — der Platz dafür ist
`VOX.elevationAt`, aktuell `null`, und die Stufen kommen solange aus dem Küstenabstand.
Das entspricht Georgs Antwort "Mischung: echte Höhe wo verfügbar, sonst Stufen aus Fläche" —
verfügbar ist sie noch nicht. `VOX.base` hält pro Instanz x / Oberkante / z bereit, damit
Dancefloor, Beben und Vulkane später darauf schreiben können, ohne das Feld neu zu bauen.

### Figuren auf dem Brett · KayKit Board Game Bits

Diplomacy-Lesart: **ein** Stück pro Land, nicht ein Haufen. Meeples, Pawns, W20, W6, Fähnchen und
Häuschen verteilen sich über Europa, die Auswahl je Land per Seed, gesetzt auf den Schwerpunkt der
größten Fläche — über 12 Flächeneinheiten trägt ein Land eine Figur.

**Die Namen sind nicht geraten.** Sie kommen aus dem verifizierten Registry-Lauf dieser Sitzung
(`registry/assets/v1/packs/kaykit-boardgamebits-1-0-free.json`) — dieselbe Regel, die der
Domino-Blocker erzwungen hat: Registry ist SSOT, nie Namen probieren.

**Keine eigene Buchführung.** Jede Figur hängt in `inner`. Damit macht sie Explode, Rotate, Höhe und
die Freiraum-Prüfung mit, ohne einen zweiten Zustand zu halten — und Reset bleibt bei Abweichung 0.

**Ein Fehler unterwegs, eine Zeile.** `GLTFLoader` war nie importiert. Das Modul hatte ihn bis dahin
nicht gebraucht, weil die Landmarks über den img2threejs-Adapter kommen und nicht über glTF. Behoben
mit `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'`.

### Nachladen statt neu laden

`SOURCE_SPEC.json` nennt die Live-Katalog-Abhängigkeit selbst als P1-Thema. Solange sie
besteht, fallen sporadisch einzelne Länder aus. Der Katalog wird nicht ersetzt; stattdessen
merkt sich der Lauf die fehlgeschlagenen ISO-Codes und lädt sie über denselben Pfad nach
(`api.retryMissing()`, Taste erscheint nur, wenn etwas fehlt).

## Q&A before code

```text
[Q] Which map is animated?
[A] The existing Europe Cartoon Map Board. No second map runtime.

[Q] May a country piece be re-triangulated for an animation?
[A] No. Canonical geometry is built once; actions only write a presentation transform.

[Q] What is canonical state?
[A] position/rotation/scale/vertex-offsets recorded at build time. RESET restores them exactly,
    and the lab prints the residual error so the claim is checkable.

[Q] Is the landmark allowed to be hand-modelled?
[A] No. It comes from buildLandmark() + shapeAsset() in the img2threejs lane, or the panel
    shows SOURCE ASSET FAILED.

[Q] Is the landmark geographically anchored?
[A] No. It is pinned to a map piece for the proof and marked
    STYLE_INTEGRATION_ONLY_NOT_GEO.

[Q] Is a new particle engine allowed for the ripple?
[A] No. The Travel carpet-waver maths is copied; only its phase argument becomes radial.

[Q] Curtain, burn, bomb, OSM drilldown, cards?
[A] Not in SMA1.
```

## Tooling note carried from VL1

`requestAnimationFrame` fires once in the design preview and then stops. SMA1 needs a real clock,
so the loop driver falls back to `setInterval(16)` when rAF has not fired after 300 ms. Check
`renderer.info.render.frame` first if anything looks frozen.

## Offen für die nächste Sitzung

Bewusst nicht angefangen: mit dem Rest-Budget dieser Sitzung würde beides nur halb, und halb ist
hier schlechter als gar nicht. Donor und Reihenfolge stehen fest.

### 1 · Würfelphysik — eigene Scheibe, zuerst

Donor: **`3d-dice/dice-box-threejs`** — in T1 schon als gepinnter externer Donor bewiesen, also kein
Quellen-Risiko.

Was dazugehört und deshalb nicht nebenbei geht: eine Physikwelt, Kollisionskörper für Brett,
Stücke und ggf. Voxelfeld, Wurf aus der Höhe, natürliches Rollen, Ruhelage-Erkennung. Ein Würfel,
der durch das Brett fällt oder nie zur Ruhe kommt, nimmt der ganzen Bühne die Glaubwürdigkeit —
deshalb ganz oder nicht.

### 2 · Laufender Warband-Orc mit Pencil in der Waffenhand

Donor: **Rig_Legacy** — sechs Knochen, 30 Clips.

Reihenfolge ist bindend: **erst** die Kompatibilitätstabelle Clip × Prop an EINER Figur messen,
**dann** der Orc. Die WSA-Planungsnotiz sagt es ausdrücklich — nicht annehmen, dass jeder Prop alle
30 Clips trägt. Andernfalls entsteht eine Animation, die bei der nächsten Figur auseinanderfällt.

### 3 · Zwei Deformer-Lücken (bekannt, benannt)

- **Küstenbögen in der Ebene.** Der Cartoon-Deformer greift auf der Geometrieklasse der Landmarks;
  auf flache Länderkonturen überträgt er sich nicht, in-plane Bauchung braucht einen eigenen Weg.
- **Voxel als Instanced-Attribute.** Der Deformer schreibt Vertices; ein InstancedMesh braucht die
  Auslenkung pro Instanz als Attribut.

### Einstieg für den frischen Chat

Dieses Dokument plus `github.md`. Dort steht, was diese Sitzung gelernt hat — inklusive der
Werkzeug-Fallen (`github_get_tree` verschweigt `.gltf`/`.mjs`, raw serviert `.mjs` als text/plain,
`requestAnimationFrame` feuert in der Vorschau genau einmal).

## Exactly one next gate

**Georg: does the Europe board read as one coherent physical puzzle through FLAT / TABLE / FLYOVER /
POP-UP CLOSE, do RAISE / STAND_UP / SLIDE / ROTATE / EXPLODE survive as presentation only, and does
RESET land every piece back on its canonical geography?**
