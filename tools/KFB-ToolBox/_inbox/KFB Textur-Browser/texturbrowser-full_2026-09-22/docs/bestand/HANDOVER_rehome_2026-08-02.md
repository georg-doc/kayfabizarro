# HANDOVER — Re-Home & Ausbau · 2026-08-02

Fuer den Coworker und fuer den frischen Chat, der dieses Bundle in ein neues Projekt hebt.
Dieses Dokument ist der Einstieg: was da ist, wie es umzieht, was als naechstes gebaut wird.

---

## 1 Was dieses Bundle ist

Drei lauffaehige Artefakte plus die Vertraege darunter. Es ist **kein** Voll-Projekt-Export —
alles Schwere (PDFs, GLBs, Texturen, Skydomes) laedt zur Laufzeit per RAW-URL aus
`github.com/georg-doc/kayfabizarro`.

| Einstieg | Was es ist |
|---|---|
| `KFB Zonen-Registry.dc.html` | Weltkarte. 168 Karten -> 44 Zonen, sechs Biome, Hex-Cluster, Flows und Fluesse, Lernstand. **Hier anfangen.** |
| `KFB Card Zone Lab v2.dc.html` | Eine Zone in 3D. Deck, Aufdeck-Animation, Card Cube mit sechs Flaechen, Face-Focus, Wasser/Graben/Fluss, Drone. |
| `KFB Cartoon-Verbieger.dc.html` | Prop-Verbieger. Vier Regler, Seed-Reihe, Set-Vergleich, Parameter-Export. |
| `KFB Textur-Browser.dc.html` | 86 Diffuse-Texturen als Kontaktbogen, A/B am Voxel-Cluster, Bewertung mit JSON-Export. |
| `KFB 3D Asset Repo.dc.html` | Cockpit des Asset-Sprints: Slice-Status, Asset-Wahrheit, Textur-Beleg, Blocker. |

## 2 Re-Home in vier Schritten

1. **Ordner-Inhalt in die Wurzel des neuen Projekts legen.** Die Struktur ist flach und relativ:
   `terrain-v10/`, `cardbuilder/`, `docs/` bleiben Unterordner, alles andere liegt daneben.
   Kein Pfad im Code zeigt tiefer als das.
2. **`support.js` muss mit.** Es ist die DC-Runtime, die jede `.dc.html` per `./support.js` laedt.
   Nicht anfassen, nicht ersetzen, nicht umbenennen.
3. **RAW-URLs pruefen, nicht umschreiben.** Alle Assets laufen ueber
   `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/...`
   bzw. `.../media/kfb/...`. Wenn ein frisch gepushter Pfad 404 liefert: `?v=2` anhaengen,
   der CDN haelt bis zu fuenf Minuten alte Antworten.
4. **Clean-Run fahren** (Abschnitt 6). Erst wenn die drei Haken sitzen, weiterbauen.

### Was NICHT umzieht
`uploads/` (Session-Input, Briefings, Referenz-HTML), `media/3D_Assets/CATALOG/` (169-KB-Spiegel,
Kanon ist das Repo), `tex/` (23 lokale Texturen, Upload-Kandidat), `versions/`, `refs/`,
die vier alten `export/`-Staende, die Hex-Artefakte (`Hex-*.dc.html`, `Zonen-Atlas`).

## 3 Die Vertraege — was wo steht

| Datei | Traegt | Regel |
|---|---|---|
| `zone-registry.json` | Ableitung Karte -> Zone: Biome-Zuordnung, Cluster, Flows, Fluesse, `overrides.byZone` | Handkorrekturen NUR in `overrides`, nie in der Ableitung |
| `zone-index.json` | Biome-Kanon: Material, Mood-Tint, Register, Connectors, Props | Kanon, aus dem Hex-Worldbench uebernommen |
| `asset-repo.json` | 986 platzierbare Assets aus 17 Live-Packs, `role`/`biomes`/`storyModes`/`naturalScale`/`ghUrl` + `pending` + `aliases` | Prop-Namen **immer** hier pruefen, nie raten (siehe Fallstrick 4) |
| `kfb-textures.json` | 12 KFB-Material-Sets mit RAW-URL, Map-Rolle, colorSpace | Einzige Adressquelle fuer Texturen |
| `kfb-texture-catalog.json` | 86 Texturen, 11 Familien, §5-Vorbewertung | Zweite Leseart: die `nein`-Liste ist die Collage-Bank der Card Zones |
| `constructs.json` | Blueprint-Format fuer Voxel-Konstrukte | `blueprints: []` noch leer — fuellt Slice 2 |

**Uebergabehaken Registry -> Lab:** `localStorage['kfb-zone-open'] = { packId, n }`.
Das Lab liest ihn beim Boot und **loescht ihn sofort** — ein Reload soll nicht ewig auf derselben
Zone haengen. Lernstand der Registry: `localStorage['kfb-zone-registry-v1']`.

**Karten-Manifest:** Lab und Registry laden `media/kfb/kfb-index.json` (traegt `cardGrid`),
Fallback `index.json`. Uebergabe per `indexUrl`/`localIndex` am Aufruf — **keine Zahl in JS**
(SSOT_KFB_CardBuilder_PDF §4).

## 4 Fuenf Fallstricke, die schon Zeit gekostet haben

1. **Wasser ist ein Level, kein Ring.** Ein Quad pro Zelle, gesetzt nur wo der Wannenboden unter dem
   Wasserstand liegt. Wer den Graben als Rechteck-Ring baut, kann ihn nicht oeffnen — und ein Fluss
   ist genau derselbe Mechanismus mit anderer Zellmenge (`setCarvePath`, Polyline mit Breite).
2. **Anker vor Animation.** Der Bogen des Verbiegers ist am Fuss verankert (t², `y=0` bleibt stehen).
   Wer in der Mitte verankert, hebt Props vom Boden ab.
3. **Ein Rahmen pro Objekt, nicht pro Mesh.** Mehrteilige Props (Baum = Stamm + Krone) muessen in den
   Wurzelraum gebacken werden und **eine** Bounding-Box, **einen** Parametersatz teilen. Sonst biegen
   die Teile um verschiedene Achsen und das Prop fliegt auseinander.
4. **Prop-Namen gegen `asset-repo.json` pruefen.** Geraten heisst: drei von sechs existieren nicht.
5. **Kamera-Fit gegen die naechste Reihenebene, mit Reserve.** Bounding-Boxen kennen die
   Shader-Verformung nicht; Blickwinkel nicht aus der Startposition erben; Orbit-Zentrum in den
   Schwerpunkt, sonst wirft die Autorotation die hintere Reihe aus dem Bild.
   Und: `preserveDrawingBuffer` setzen, sonst zeigen Captures alte Frames.

Muster hinter allen fuenf: **eine Zahl ist leichter zu aendern als ein Modell, also greift man zuerst
zur Zahl.** Die Runden, die etwas gebracht haben, begannen mit einer Messung.

## 5 Sprints von hier

Jeder Sprint hat ein Definition-of-Done, das man **sehen** kann. Reihenfolge ist Abhaengigkeit,
nicht Vorliebe.

### S5 — Verbieger-Grenzen festnageln · *blockiert auf Georg*
Ein Grenzsatz pro Asset-Set als Default in `kfb-cartoon-deform.js`.
**Weg:** an der Bank drehen, bis es fuer jedes der vier Sets sitzt, `Export` druecken, JSON schicken.
Schneller als Referenzbilder.
**DoD:** Bank laedt ohne Reglerdrehen in einem Zustand, den Georg abnimmt; die Werte stehen in der
parametrischen Bank, nicht im DC.

### S6 — Scatter mit Verbieger · *braucht S5*
Deform-Parameter als **Instanced Attributes** statt Uniforms. Dieselbe Mathematik, anderer Traeger.
Props kommen per `getSet({biome, storyMode, role, seed})` aus `asset-index.js`.
**DoD:** 200+ Props in einer Zone, **ein** Draw-Call pro Pack, jedes Prop anders verbogen, fps stabil;
HUD zeigt Instanzen und Draw-Calls.

### S7 — cardGrid skalieren · *Coworker-Entscheidung offen*
Zwei Wege, einer muss gewaehlt werden:
- **(a) `cardGridTemplates`** — ein Grid pro Layout-Vorlage, `gridTemplate: "webH"` am Deck,
  `cardGrid` am Deck nur als Override. Klein, sofort machbar, braucht eine Vorlagen-Inventur.
- **(b) Projektionsprofil** — Seite klein rendern, Zeilen-/Spaltenprofil messen, Gutter sind zwei
  Taeler, daraus fallen alle sechs Zahlen. Kein Handeintrag mehr, aber ein Stueck Bildverarbeitung.
**DoD:** ein neues Deck kommt ohne Handmessung korrekt geschnitten heraus.
Vorgelagert: `kfb-index.json` -> `index.json` deployen, Sonic als **zwei** `packId`s trennen.

### S8 — Zonen bevoelkern · *braucht S6*
Props, Konstrukte (`constructs.json` fuellen, King Tower als Signature), Fluesse zwischen benachbarten
Zonen auf der Weltkarte statt nur im Lab.
**DoD:** eine Zone laeuft umrundbar und lesbar ohne Regler; Fluss verlaesst die Zone sichtbar in
Richtung Nachbarzone.

### S9 — Tusche pro Objekt · *unabhaengig*
Im Lab weiter abgeschaltet. Die Kante gehoert aus dem Ink-Kanon **pro Objekt** abgeleitet
(`kfb-ink-canon.js`), nicht global ueber den Screen gezogen.
**DoD:** Karte, Prop und Voxel-Cluster tragen je ihre eigene Strichstaerke im selben Frame.

### S10 — Lern-Loop schliessen · *braucht S8*
Lernstand faerbt die Welt: gespielte Zonen stromabwaerts, offene stromaufwaerts, `completed` senkt
Wear/Dust. Registry schreibt, Lab liest — beides ueber denselben Vertrag.
**DoD:** eine Zone abschliessen und die Weltkarte sieht danach anders aus, ohne Reload-Trick.

## 6 Clean-Run-Checkliste (Stand 2026-08-02)

1. `KFB Zonen-Registry.dc.html` oeffnen -> Hex-Karte da, 44 Zonen, keine Konsolenfehler in
   **Chrome und Firefox**. Deck filtern -> Flows erscheinen.
2. Zone waehlen -> „Im Card Zone Lab oeffnen" -> das Lab startet auf **derselben** Karte;
   Reload danach startet neutral (Handoff wurde verworfen).
3. Lab: Graben-Breite 2 -> 7 durchziehen — keine Loecher zwischen Zone und Terrain, Wasser auf
   **allen vier** Seiten. `Hub` auf 1 -> Terrain bewegt sich, Plateau und Zonen-Ecken stehen still.
4. Lab: auf dem Wuerfel ziehen dreht den Wuerfel, daneben die Kamera. Flaeche klicken richtet aus,
   zweiter Klick -> Face-Focus (Karten-Zoom, Chat), Esc zurueck.
5. Lab: `Naechste Karte` -> Art-Flaeche zeigt zum Spieler, PDF-Artwork erscheint nach wenigen Sekunden.
6. Verbieger: Set wechseln -> obere Reihe zeigt sieben Seeds desselben Leitprops, untere den Rest des
   Packs; kein Prop faellt auseinander, keine Reihe wird angeschnitten.
7. Textur-Browser: Kontaktbogen laedt alle 86 Kacheln als Bild -> RAW-Pfade stimmen.

## 7 Offene Entscheidungen (nichts davon ist Arbeit, alles ist eine Antwort)

| Sache | Wer | Warum es haengt |
|---|---|---|
| Verbieger-Grenzsatz je Set | Georg | S5, und damit S6, wartet darauf |
| `cardGridTemplates` vs. Projektionsprofil | Coworker | 200+ PDFs von Hand messen skaliert nicht |
| `kfb-index.json` -> `index.json` deployen | Coworker | Consumer schneiden sonst blind; bei zwei Kopfband-Decks faengt der Schnitt die Seitenueberschrift |
| Sonic: zwei PDFs, ein `packId` | Coworker | Zwei gueltige Decks, eines ist unsichtbar |
| `GLB format/` im Repo-Top-Level | Coworker | Identitaet vs. `GLB_hexagon_kit` unklar, deshalb nicht im Index |
| `tex/` (23 Texturen) pushen? | Georg | laufen sonst nur lokal, nicht per RAW |

Details zu den vier Coworker-Punkten: `docs/HANDOVER_coworker_manifest_2026-07-26.md`.
