# Doppel-Review KFB World Lab · Lauf 2026-10-11_review01

> Hinweis 12.10.: Dieser Bericht prüfte die Dropbox-Kopie des Mac mini (Code 08. bis 10.10., ohne r2d, HUD, Audio). Einordnung gegen den Schnappschuss 11.10. steht in `../FABLE_REVIEW_R1_2026-10-12.md` §0. Der Lizenz-Befund A-01 bleibt als Protokoll stehen, wird nach V-184 aber nicht weiter berichtet.

Prüfgegenstand: `KFB Island Worldbuilder Lab`, Stand der Dateien vom 2026-10-10 (letzte Änderung `_inbox` 2026-10-11). Dev-Server Vite 8.3.3 auf `127.0.0.1:5192`, three.js 0.186.1.

Browserfassung im Protokoll: Headless Google Chrome 155.0.8059.39 über Playwright 1.63 (`tools/shoot.mjs`, Metal, Apple M4, deviceScaleFactor 1, 1600 × 1000) für alle Standbilder; Claude Desktop Browser pane (Chromium, devicePixelRatio 2) für die interaktiven Messungen (Panel, Materialwechsel, Mobil 375 × 812, Bodenkontakt). Keine Zahl in diesem Bericht stammt aus einer Annahme; Messwerte liegen in `measurements.json`, die Bilder in `shots/`, die Protokolle der Shoot-Läufe als `shots/*.json`.

Grenzen des Prüfstands, vorab: Es gibt kein Telefon im Prüfstand, also sind Mobil-Zahlen Geometrie- und Speicherzahlen, keine Bildraten. Es gibt im Build keine Tageszeiten (`__kfb.setTime` liefert `null`), also gibt es genau eine Lichtsituation. Der kopflose Chrome liefert 60 fps am VSync, also sind Bildraten aus dem Shoot-Werkzeug keine Messung.

---

## 0 · Kalibrierszene (vor jeder Note)

`shots/00_kalibrierung.png`, Quelle `refs/kalibrierszene.html`: rotes Rechteck bei (100, 100) mit 400 × 200 px, Grün, Blau, Grau 128, Text 24 px, Zähler 4711, Lineal 100 px.

| Sollwert | Gemessen |
|---|---|
| Rot (255, 0, 0) bei (300, 200) | (255, 0, 0) |
| Grün, Blau, Grau 128, Weiß | exakt |
| Rechteck-Ecke innen (101, 100) und (499, 299) | rot; (500, 300) außen weiß |
| Lineal schwarz/weiß bei (150, 810) / (250, 810) | (0, 0, 0) / (255, 255, 255) |
| Text 24 px, Zähler 4711 | lesbar, korrekt |

**Der Kanal ist zuverlässig.** Farben und Positionen sind pixelgenau, also sind die folgenden Bilder belastbar.

---

## 1 · Bestandsaufnahme: was tatsächlich im Slice ist

**Läuft (beobachtet, nicht aus Dokumenten):**

| Modul | Nachweis | allein | im Verbund |
|---|---|---|---|
| Worldbuilder `index.html`: 4 Inseln (Pyramide, Canyon, Bucht, O-Town), Editor-Panel, Orbit-Kamera | `A1_*`, `B1_*`, Panel-Screenshot | `?solo=<id>` blendet die anderen aus (`C_solo_*`) | Standard: alle vier werden immer zusammen gebaut |
| Gelände (Delaunay-Oberseite, Scholle-Unterseite, Grasband, Wege, Teich) | `measure('canyon')`: W 70,26, 5 330 Dreiecke, 56 Zapfen | ja | ja |
| Alte prozedurale Natur (`NatureBuilder`, Standard) | 25 Calls Hauptpass, 145 k Dreiecke | ja | ja |
| Environment Kit R1 (`?env=kit`, BatchedMesh, Quaternius/KayKit/Tiny Treats) | 8 Calls Hauptpass, 51 k Dreiecke, `envCheck` je Insel | eigene Probe-Seiten `probe.html`, `probe2.html` | ja |
| Bewohner (2 Mumien, Eye-Rig v6, Sitzplatz, Handrequisite) | `G_nah_kit__orbit_12_4_136…` | nein (nur auf der Pyramideninsel) | ja |
| Gebäude-Katalog (KayKit Hex, City, Mummy, Retro Cars) | `sizes()`: 12 Einträge | nein | ja |
| RKIT-Testinsel und Straßenbett-Naht (`?hub=1`) | T1 = 0 über Fahrbahn, T2 = 244/244 Nahtpunkte, Höhenfehler 0 | ja (eigene Insel) | ja, 122 Calls bei 5 Inseln |
| Inspector (`?inspect=1`, three-inspect gepatcht) | Showcase-Prüfung, siehe §1b | ja | ja |
| Originale-Reihe (StreakByte-Basen, `?originals=1`) | Code `originals-layer.ts`, nicht in dieser Prüfung gerendert | ja | ja |

**Attrappe oder Stummel (im Code als solche belegt):** `__kfb.setTime` gibt `null` zurück (keine Tageszeit); `__kfb.player` gibt `null` zurück (kein Spieler, kein Fahren); `__kfb.waitIdle` ist ein fester 300-ms-Schlaf, keine Leerlauf-Erkennung; kein HUD, kein Ton, kein Spielstand, keine Story-Modi, kein Deckwechsel. Das ist ein Autoren-Werkzeug mit Messfunktionen, kein Spiel-Slice.

**Zuletzt gemessen, und wann:** `PROJECT_STATE.md` nennt für Environment Kit R1 (2026-10-08) „120 Calls, 261 k Dreiecke je Frame“. Heute reproduziert: 120 Calls, 260 769 Dreiecke. Die dokumentierten Zahlen stimmen.

### 1b · Showcase-Seiten allein (Tor 1 für die Nebenmodule)

Siehe Nachtrag am Ende von §3 (Lauf `H_showcase_*`).

---

## 2 · Tor 1 und Tor 2

**Tor 1, Modul allein** (`C_solo_*`, Wolken aus): Canyon 26 Calls / 90 k, Bucht 24 / 99 k, O-Town 41 / 129 k, Pyramide 66 / 140 k Dreiecke je Frame. Jede Insel allein bleibt in Dutzenden Calls.

**Tor 2, im Verbund** (`A1_*` alte Natur, `B1_*` Kit): 158 Calls / 483 k Dreiecke (alt) gegen 120 Calls / 261 k (Kit). Der Schattenpass verdoppelt: Hauptpass 60 Calls, Schattenpass 60 Calls (Kit). **Dieses Tor wurde bisher übersprungen, heute ist es gelaufen.** Zwei Befunde entstehen nur im Verbund (Kamera-Verdeckungen, siehe A-05) und sind allein unsichtbar.

---

## 3 · Prüfer A · Technik, Architektur, Planung

### Harte Böden (Register BLOCK), gemessen

| Boden | Wert | Ergebnis |
|---|---|---|
| Konsolenfehler null | 1 je Lauf: `GET /favicon.ico 404` | **verletzt** (trivial), dazu A-03: fehlende Assets erzeugen gar keinen Fehler |
| Determinismus | Gelände, Natur, Gebäude: 0 abweichende Pixel in zwei Läufen (`D_diff_A1_A2__overview.png`, `…canyon.png`). Bewohner: 789 abweichende Pixel, nur die Mumien (`D_diff_A1_A2__pyramide-ref.png`); `sizes()` schwankt bei `r-mummyA`/`r-mummyB` | **verletzt** durch `Math.random` in `src/residents/resident.ts:74` (Animationsphase) und `pet-eye-rig.v6.js` (Blinzeln, Blick). Welt ist deterministisch, Zierschicht nicht |
| Draw Calls in Dutzenden | Verbund 120 (Kit) bzw. 158 (alt); allein 24–66 | **grenzwertig**: 120 ist das Achtfache von „fünfzehn für eine Kartenlandschaft“, aber das Projektbudget (MacBook 30–60 fps) wird am M4 gehalten |
| Mobil als Qualitätsboden | 375 × 812 bei dpr 2: Canvas 750 × 1624, Schattenkarte 4096², Panel deckt 74 % des Bildschirms, keine Touch-Behandlung im Code | **verletzt** (A-04) |
| Sprites (Farbanzahl, Saum, Leinwand) | keine Sprites im Slice | entfällt |
| Fußpunkt an genau einem Ort | vier Definitionen: `Island.placeBuilding` (`max(height, base + 0.07)`), `place.ts put()` (tiefster Boden im Fußring minus Einsinken), `NatureBuilder` (Stamm `y0 − 0.6`, Fels `y0 + 0.15 r`), `syncResidents` (`field.height`) | **verletzt** (A-02) |
| Lizenz je Asset belegt | Lizenzdatei fehlt im Ordner bei KayKit Hex, City, Park, Snow, Anims, Figures; bei den Retro Cars (RCC Design, Unity Asset Store); beim bezahlten StreakByte-Paket (Unity Standard EULA), das unter `public/assets/streakbyte/` ausgeliefert wird; bei `clay/Fingerprints01_3K.png` (cgbookcase) | **verletzt** (A-01) |

### Architekturfragen, beantwortet

- **Wirt:** Es gibt keinen. `main.ts`, `probe.ts`, `probe2.ts`, `demo-scenes.ts`, `speckle.ts`, `lineup.ts` bauen je eigenen Renderer, Farbraum, Lichtsatz und Zeitbasis. Das Lab-Licht (Sonne −120/180/90, Hemi, Fülllicht von unten) ist in `main.ts` fest verdrahtet und in den Probe-Seiten jeweils anders (`demo-scenes.ts`: Sonne −30/50/25, normalBias 0,02).
- **Fähigkeiten anmelden:** Module melden nichts an. `__kfb` ist eine flache Sammlung von Funktionen, die stillschweigend `null` zurückgeben, wenn etwas fehlt (`setTime`, `player`).
- **Parameter deklarieren, Feld `rebuild`:** Nicht vorhanden. Der Editor unterscheidet ad hoc über ein Boolean `nature` in `live()`, ob ein Regler die Natur mit neu baut; eine Deklaration je Parameter gibt es nicht.
- **Verschiebt das Panel die Bühne?** Nein. Kamera (10, 110, 200) und Canvas 1344 × 1324 vor und nach `togglePanel` identisch. Das Panel liegt als `position: fixed` über dem Canvas.
- **Zwei Transformationen?** Ja, sauber: `OrbitControls` federt (damping 0,25) nur die Kamera, schreibt nie in die Welt-Spec. Insel-Position und Umriss werden logisch gesetzt.
- **Shader aufgewärmt?** Nein, kein `renderer.compile`. Erster Palettenwechsel: schlechtester Frame 83,5 ms gegen 18,7 ms Grundlinie, Neubau 95 ms. Der Ruckler kommt aus dem synchronen Geometrie-Neubau (Delaunay, Scholle, Taubin), nicht aus dem Shader; nach dem Wechsel gibt es 11 Programme.
- **Setzt oder transformiert?** Es gibt nur Setzen. Zwei Farbquellen setzen nebeneinander: `PALETTES` (Joyride) und `ENV_ROLES`; das Gelände mischt beide (Bergfels aus `ENV_ROLES.stone`, alles andere aus `pal`). Deck, Modus und Biom als Transformations-Schichten existieren noch nicht.

### Typische Fallen, gezielt gesucht

- **Eigenschaften aus Dateinamen:** `kits.ts parseId` leitet Dateiendung und Kit aus dem Präfix ab, misst aber Höhe, Fuß und Krone zur Laufzeit. Kein Treffer.
- **Konstante behauptet statt gemessen:** `placeBuilding` hebt jedes Gebäude um die Konstante 0,07 über sein Pad, ohne Messung (A-02, Zahl belegt).
- **Externe Texturen:** Die drei Retro-Car-FBX verweisen auf `*_3072.psd`. Die Dateien fehlen. **Der Vite-Dev-Server antwortet auf jede fehlende Datei mit 200 und der SPA-Seite** (`/assets/nix/gibtsnicht.png` → 200 `text/html`, 1 976 B). Das Auto lädt, die Textur-Anfrage „gelingt“, es gibt keinen 404 und keinen Konsolenfehler (A-03). StreakByte hält Modelle und Textur getrennt (`Textures/…PortTexture.png`), im Code explizit geladen, also kein Fehler, aber die Falle ist scharf.
- **Einzeltexturen statt Atlas:** Kit-Environment liest Atlanten je Vertex ein und fasst je Insel in zwei BatchedMeshes zusammen. Kein Treffer.
- **Herkunft mit Technik verwechselt:** `.claude/launch.json` im Lab zeigt auf `/Users/georgv.westphalen/…`, der Startknopf scheitert auf dieser Maschine; die funktionierende Konfiguration liegt eine Ebene höher (`CLAUDE/.claude/launch.json`) und auch sie scheiterte im App-Sandbox (`Operation not permitted` auf `tools/env.sh`). Gestartet wurde per Shell. Das ist Herkunft, nicht Verfahren (A-10).

### Deliverable A · Mängelliste nach Priorität

| Prio | Register | Befund | Beleg (Bild/Zahl) | Vorschlag | Aufwand |
|---|---|---|---|---|---|
| **P0** | BLOCK | **A-01 Lizenzlücke mit Auslieferungsrisiko.** Das bezahlte StreakByte-Paket (Unity Standard EULA, laut `EXTERNAL_ASSET_SOURCES.md` „nicht in ein öffentliches Repo“) liegt unter `public/assets/streakbyte/` und wird vom Server ausgeliefert; Retro Cars (RCC Design) ohne Lizenznachweis; KayKit Hex/City/Park/Snow/Anims/Figures ohne Lizenzdatei im Ordner; Fingerabdruck-Textur ohne Quellvermerk | `find public -iname '*licen*'`: 10 Treffer, keiner in den genannten Ordnern; Netzwerkprotokoll: `GET /assets/cars/Cicada/CICADA_LOW.fbx 200` | StreakByte und Cars aus `public/` nach `donors/` (nicht ausgeliefert) oder Lizenz belegen; je Ordner eine `License.txt` mit Quelle, Datum, Lizenz; Lizenz-Linter als Test (Ordner ohne `License*` = Fehler) | S |
| **P1** | BLOCK | **A-02 Bodenkontakt.** Jedes Gebäude steht konstruktiv 0,07 Einheiten über dem Pad; Autos (6 Einheiten lang, Pad 3) hängen auf Gefälle bis 0,31 Einheiten in der Luft. Fußpunkt an vier Orten definiert | `measurements.json ground_contact`: 10 Gebäude, alle `gapCentre 0.07`; `b-car1`, `b-car2` `gapLowestNearby 0.31`; Bild `G_nah_kit__orbit_-12_3.5_142_1.5_0.1_10.png` (Luft unter den Rädern, Schatten versetzt) | Eine Fußpunkt-Funktion im Feld (`field.foot(footprint)` = tiefster Boden unter der Standfläche minus Einsinken), von Gebäuden, Bewohnern, alter und neuer Natur gleich benutzt; Pad-Radius aus der Standfläche, nicht aus einer Konstante | M |
| **P1** | BLOCK | **A-03 Fehlende Assets sind unsichtbar.** Der Dev-Server beantwortet fehlende Dateien mit 200 + HTML; die drei PSD-Texturen der Autos fehlen, ohne 404. Der Boden „Konsolenfehler null“ beweist unter diesem Server nichts | `curl /assets/nix/gibtsnicht.png` → `200 text/html 1976B`; Netzwerk: `CICADA_3072.psd 200` | Vite `appType: 'mpa'` oder ein Middleware-404 für `/assets/*`, `/roadbeds/*`; danach den Lauf wiederholen und erst dann „null Fehler“ zählen; PSD-Verweise aus den FBX entfernen oder die JPG-Texturen als Ersatz eintragen | S |
| **P1** | BLOCK | **A-04 Mobil ist nicht gebaut.** Bei 375 × 812 deckt das Panel 74 % des Bildschirms, der Canvas rendert 750 × 1624 bei dpr 2 mit 4096²-Schattenkarte; keine Touch-Gesten (Drag-Handles, Shift+Ziehen, Tasten 1/2/3 existieren nur für Maus und Tastatur) | `measurements.json mobile`; Panel-Screenshot 375 × 812 (Browser pane); `grep touch src` → 0 Treffer | Mobil-Profil im Wirt: pixelRatio ≤ 1,5, Schattenkarte 2048², Panel einklappbar als Leiste; Touch-Orbit prüfen (OrbitControls kann es, der Editor nicht) | M |
| **P1** | BLOCK/warn | **A-05 Kamerasatz im Verbund kaputt.** `under` steht innerhalb der Pyramideninsel (Bild zeigt nur Unterseiten-Fläche), `canyon-ref` ist von einer Palme der Pyramideninsel verdeckt. Die Presets stammen aus der Zeit vor der Pyramideninsel; jede Messung aus diesen Kameras ist wertlos | `B1_verbund_kit__under.png`, `B1_verbund_kit__canyon-ref.png` | Presets je Insel aus Position und Radius rechnen (wie `-ref` es schon tut) und gegen die anderen Inseln auf Verdeckung prüfen (Raycast vom Standpunkt zum Ziel); `under` auf die Scholle einer gewählten Insel richten | S |
| **P1** | warn | **A-06 Kein Wirt, kein Modulvertrag.** Sechs Einstiege mit je eigenem Renderer, Licht, Farbraum, Zeitbasis; keine Fähigkeits-Anmeldung, keine Parameter-Deklaration mit `rebuild` | `grep -l "new THREE.WebGLRenderer" src/*.ts` → 6 Dateien; `__kfb.setTime = () => null` | Nicht neu bauen: `main.ts` in einen Wirt (Renderer, Licht, Zeit, Quellenkette) und ein Lab-Modul trennen; Probe-Seiten laden den Wirt; `__kfb` bekommt eine `capabilities`-Liste, Parameter eine Tabelle `{id, min, max, step, rebuild: 'none'|'ground'|'all'}`, die der Editor rendert | M |
| **P1** | warn | **A-07 Tusche-Kanon fehlt ganz.** Kein Konturpass, `kfb-ink-canon.js` weder importiert noch nachgebaut. Der blinde Paarvergleich sagt zweimal „Nein“ zum gemeinsamen Universum, erster Grund jeweils die fehlende Linie | `grep -rn "ink-canon\|OutlinePass\|EdgesGeometry" src` → 0; `blindtests.md` §B | Den Kanon importieren (nicht nachbauen) und als Post-Pass oder als Rückseiten-Hülle (Inverted-Hull) an den Wirt hängen; vorher ein Bildpaar mit und ohne Linie gegen eine Karte blind prüfen | M |
| **P2** | warn | **A-08 Zierschicht nicht deterministisch.** Animationsphase und Blinzeln aus `Math.random` | `D_diff_A1_A2__pyramide-ref.png`: 789 Pixel, nur die Mumien; `resident.ts:74`, `pet-eye-rig.v6.js:58,59,66,285,286,311` | `rng(seed)` aus `noise.ts` mit Bewohner-ID als Saat; dazu ein Lint-Regel `no-restricted-properties` für `Math.random` und `Date.now` außerhalb des Editors | S |
| **P2** | warn | **A-09 Erster Materialwechsel ruckelt.** 83,5 ms schlechtester Frame beim ersten Palettenwechsel; Ursache synchroner Geometrie-Neubau; kein Shader-Aufwärmen | `measurements.json first_material_change` | `renderer.compile(scene, camera)` nach dem Boot; Paletten-Wechsel ohne Geometrie-Neubau (Vertexfarben neu schreiben statt Delaunay neu rechnen, die Spec trennt beides schon) | S/M |
| **P2** | warn | **A-10 Startkonfiguration zeigt auf fremden Rechner.** `.claude/launch.json` im Lab verweist auf `/Users/georgv.westphalen/…`; `tools/env.sh` löst korrekt über `$HOME` | `ls /Users/georgv.westphalen` → nicht vorhanden | Pfad über `$HOME` oder relativ; die übergeordnete Konfiguration ist die richtige, die Lab-Kopie löschen oder angleichen | S |
| **P2** | warn | **A-11 Glanz und Glas gegen den Knet-Kanon.** Autos: Chrom `metalness 0.8, roughness 0.25`, Glas transparent, Scheinwerfer emissiv; Wasser `roughness 0.35` | `island.ts:35–38`; Bild `G_nah_kit__orbit_-12_3.5_142…` (Fensterrelief auf Glas) | Chrom und Glas auf die Knet-Profile (`clayMaterial('model')`) wie die Karosserie; Wasser als matte Knete mit heller Kante | S |
| **P2** | warn | **A-12 Zwei Farbquellen.** `PALETTES` und `ENV_ROLES` setzen nebeneinander; das Gelände mischt (Bergfels aus `ENV_ROLES`, Rest aus `pal`) | `terrain.ts:426`, `palettes.ts` | `ENV_ROLES` als einzige Quelle (im Masterplan schon beschlossen), `PALETTES` nur noch als Ableitung | M |
| **P2** | warn | **A-13 Draw Calls im Verbund.** 120 (Kit) bzw. 158 (alt) je Frame, davon die Hälfte Schattenpass; Gebäude und Bewohner mit je eigenem Material (12 Gebäude-Einträge, 29 Bewohner-Calls laut Inspector-Proof) | `measurements.json gate2` | Alte Natur abschalten (Kit ist PASS); Schattenwerfer auf Anker und Gebäude begrenzen; Bewohner-Materialien teilen | M |
| **P2** | warn | **A-14 Keine Tageszeit, keine zweite Lichtsituation.** Prüfer B kann nur eine Lichtlage prüfen; Blindspot „Licht und Himmel“ aus `KFB_PAINPOINTS` bestätigt | `__kfb.setTime` → `null` | Tageszeit als Parameter des Wirts (Sonnenwinkel, Farbtemperatur, Nebel), zwei Presets reichen für den Kritiker | M |
| **P3** | info | **A-15 Veraltete Zeitbasis.** `THREE.Clock` ist in r186 deprecated (Warnung in jedem Lauf) | Konsolen-Warnung | `THREE.Timer` | S |
| **P3** | info | **A-16 Kanonfragen ohne Prüfgegenstand.** Zahlen im Bild (nur Autoren-Panel: Seed, Regler), Fortschrittsleiste (keine), Closure (kein Spielzug im Build), Zeitdruck (keiner), Setzen gegen Transformieren (keine Modus-Schicht) | Bestandsaufnahme §1 | Beim nächsten Slice mitprüfen; heute nicht bewertbar | – |
| **P3** | Idee | **A-17 Straßenbett-Naht ist der beste Prüfvertrag im Projekt** (T1/T2 mit Nullfehlern, hash-gebunden). Dasselbe Muster (Hash des Umrisses, Messfunktion, Stale-Warnung) für Gebäude-Pads und Natur-Rezepte | `F_hub.json`: T1 0, T2 244/244 | Vorschlag für den Modulvertrag aus A-06 | – |

**Drei Dinge aus Sicht A, die nicht angefasst werden dürfen:**
1. Die Messschnittstelle `__kfb` (`stats`, `passes`, `envCheck`, `envSizes`, `measure`, `measureRoadBed`, `sizes`) und `tools/shoot.mjs`. Ohne sie wäre dieser Review nicht in einem Tag möglich gewesen.
2. Der Determinismus des Geländes und der Natur: null abweichende Pixel in zwei getrennten Läufen.
3. Die Straßenbett-Naht `kfb.road-bed/1` mit T1/T2 (0 Dreiecke über der Fahrbahn, 244/244 Nahtpunkte im Netz, Höhenfehler 0).

### Nachtrag Showcase-Seiten (Tor 1 für Nebenmodule)

Jede Seite allein in frischem Kontext geladen, 8 s gewartet, Bild `shots/H_showcase_<seite>.png`:

| Seite | lädt | `__kfb.ready` | Calls | Konsolenfehler | Warnungen |
|---|---|---|---|---|---|
| `probe.html` (Etherington-Probe) | ja | ja | 67 | 1 (404 ohne URL im Protokoll, Quelle offen) | 0 |
| `probe2.html` (Etherington-Probe v2) | ja | ja | 177 | 0 | 0 |
| `speckle.html` (Sprenkel-Vergleich) | ja | **nein** (kein `ready`-Signal, nicht messbar über das Shoot-Werkzeug) | – | 0 | 0 |
| `lineup.html` (Maßstab-Aufreihung) | ja | ja | – | 0 | Clock deprecated |
| `originals.html` (StreakByte-Originale) | ja | ja | – | 0 | 0 |
| `demo-scenes.html?scene=01` (StreakByte-Szene) | ja | ja | 259 | 0 | 0 |
| `/?inspect=1` (three-inspect) | ja | ja | 160 | 0 | Clock deprecated |

Befund: alle Nebenmodule laufen allein; `speckle.html` meldet sich nicht beim Messkanal an (A-06 gilt auch hier); `probe2.html` liegt mit 177 Calls über dem Verbund; `demo-scenes` mit 259 Calls ist Referenzmaterial, kein Produktcode.

---

## 4 · Prüfer B · Art Direction

Eigene Instanz ohne Code, ohne Gesprächsverlauf, nur Bilder, Raster und Referenzen. Wortlaut unverändert; Blindlese-Test und Paarvergleich in `blindtests.md`.

Geprüft: 25 Bildschirmfotos (die 21 geforderten plus F_hub__rkit_hub, C_solo_pyramide__pyramide, G_nah_old__orbit_-58 zum Vergleich, E_mobile canyon), dazu Kartenbild und Wallace-und-Gromit-Referenz.

### 4.1 Noten je Achse

**Claymation: 7,0** (Anker 7: Indie mit sichtbarer Sorgfalt, aber sichtbaren Lücken)
Das Inselmaterial ist das Beste im Build: Deckfläche, Rand und Sockel tragen eine durchgehende, gedrückte Knetstruktur, die Kante ist weich und leicht wulstig (G_nah_kit__orbit_-58_1_6_0.3_0.06_40, Canyon flach, Inselkante quer durchs Bild; B1_verbund_kit__bucht-ref, Sockel). Mumien, Pyramidenplatten und Tonkrug haben Dellen im richtigen Maßstab (G_nah_kit__orbit_12_4_136_0.3_0.08_12). Die Lücken sind aber groß: Die neue Kit-Vegetation im Canyon ist facettiertes Low-Poly mit harten Polygonkanten und ohne jede Delle, das Mühlrad ebenso (G_nah_kit__orbit_-58, Büsche Mitte und rechts; G_nah_kit__orbit_-46_1_-5_0.8_0.12_14, Rad). Die alte Natur an derselben Kamera (G_nah_old__orbit_-58) hat runde Kronen mit Kraterdellen und sieht deutlich mehr nach Knete aus. Fahrzeuge glänzen (Chromleisten, spiegelnde Scheiben, Scheinwerfer) und die Dellen auf Stadthausfassade und Bus sind so groß wie auf kleinen Büschen, also stimmt der Werkzeugmaßstab nicht. Die Inselunterseite zeigt parallele Wellenstreifen statt Daumenspuren (B1_verbund_kit__under, Bildmitte). Mehrere Instanzen sind identisch in Größe und Drehung.

**Diorama: 6,0** (zwischen 5 und 7: handwerklich angelegt, aber die Miniatursignale fehlen)
Die Welt hat keinen Rand, keinen Horizont, keinen Nebel und keine Tiefenschärfe. Der Himmel ist eine flache Farbfläche und füllt in der Übersicht zwei Drittel des Bildes (B1_verbund_kit__overview). Es gibt genau ein warmes Hauptlicht von links oben mit Schlagschatten, aber kein kühles Fülllicht, also sind Schattenseiten nur dunkler, nicht anders gefärbt. Bodenkontakt ist mehrfach gebrochen: Das rote Auto schwebt mit sichtbarer Lücke zwischen Reifen und Sand über seinem eigenen Schatten (G_nah_kit__orbit_-12_3.5_142_1.5_0.1_10, Vorderrad). Die hintere Mumie steckt bis zur Brust in der Pyramidenstufe (G_nah_kit__orbit_12_4_136, hinter dem Altar). Die orangen Blockfelsen am Canyonrand hängen über die Inselkante hinaus (B1_verbund_kit__canyon, links unten und rechts). Auf der Hub-Insel liegt eine Straße als flaches Band über die Insel hinaus in die Leere (F_hub__rkit_hub). Positiv: Die Pyramideninsel in C_solo_pyramide__pyramide liest als Diorama, weil Grundfläche und Sockel sichtbar sind und die Figuren einen Maßstab geben.

**Farbe und Licht: 7,0** (Anker 7)
Die Farbrollen sind erkennbar: Weg in Creme, Wasser in Cyan oder Graublau, Sockel je Insel eigen, Akzent Rot (Hydrant, Auto, Bus). O-Town ist die konsequenteste Palette im Build, Teal, Aubergine, Orange, Pink und lila Stämme bilden eine Stimmung, keinen Themenwechsel (C_solo_otown__otown). Canyon mit Lila auf Orange ist mutig und hält. Aber Bucht und Pyramide teilen dieselbe Sand-Ocker-Braun-Palette und lesen in der Übersicht als dieselbe Insel (B1_verbund_kit__overview, oben Mitte gegen unten; B1_verbund_kit__pyramide-ref, Bucht verschmilzt hinter der Pyramide). Es gibt zwei Wassermaterialien: Canyon graublau mit Reflexion und Uferfuge, Bucht und Pyramide flache Cyan-Scheibe ohne Übergang (B1_verbund_kit__canyon gegen C_solo_bucht__bucht-ref). Die orangen Blockfelsen mit grüner Kappe brechen die Canyon-Palette. Schattenkanten sind gezackt (G_nah_kit__orbit_52_-3_18_-2.2_0.05_45, Schatten der orangen Büsche).

**Tusche und Lesbarkeit: 6,5** (knapp unter 7)
Es gibt keine Tuschelinie, nirgends. Die Farbe trägt allein. Silhouetten funktionieren bei Pyramide, Mühle, Stadthaus, Palmen, Mumien und Fahrzeugen auch klein (E_mobile_390x844_kit__overview, Bucht mit Mühle lesbar). Büsche und Felsen sind Blobs, was bei Knete zulässig ist. Weil das Kartenbild komplett von Linie und Kritzel lebt, ist die fehlende Kontur hier kein Detail, sondern die größte Lücke zur eigenen Referenz. Zahlen und Text im Bild: Kennzeichen "CICADA" (G_nah Auto) und "911" am Polizeiwagen (G_nah_kit__orbit_48_-3_7_-0.5_0.1_22, rechts).

**Kamera und Timing: 5,5** (Anker 5: Teile passen nicht zusammen)
Die Kamerahaltung wandert zwischen Übersicht, Schräge, Referenz und Orbit ohne gemeinsame Sprache. Die Referenzkamera Canyon ist durch eine Palme der Pyramideninsel zu 40 Prozent verdeckt (B1_verbund_kit__canyon-ref, rechte Bildhälfte). Die Referenzkamera Bucht hat einen O-Town-Baum und eine Canyon-Inselecke im Vordergrund (B1_verbund_kit__bucht-ref, unten rechts und unten Mitte). Die Untersicht zeigt nur Sockelfläche ohne Information (B1_verbund_kit__under). Die Übersicht schneidet die Pyramideninsel unten an und lässt den oberen Bildteil leer (A1 und B1 overview). Das Hochformat schneidet Canyon und O-Town halb an (E_mobile_390x844_kit__overview). Es gibt eine saubere Kamera: B1_verbund_kit__pyramide-ref mit Pyramide zentriert und den drei anderen Inseln als Kulisse. Posen: Die Mumien haben eine lesbare Haltung mit Ankh in der Hand, die einzige Spur von Timing im Build.

**Hebel nach 9,5:** Keine Achse erreicht 8,5, also entfällt der Hebel. Die Achse, die am nächsten dran ist, ist Claymation über das Inselmaterial. Der Weg dahin ist, alle Kit-Objekte auf dieselbe Dellen-Normalmap wie Insel und Mumien zu ziehen, mit Objektgröße skaliert.

### 4.2 Mängelliste (Deliverable B)

| Prio | Register | Befund | Beleg (Dateiname, Stelle im Bild) | Vorschlag (arbeitet mit dem, was da ist) | Aufwand |
|---|---|---|---|---|---|
| P0 | Kamera | Referenzkamera Canyon durch Palme der Pyramideninsel verdeckt | B1_verbund_kit__canyon-ref.png, rechte Bildhälfte, Palmwedel über Insel und Mühle | Referenzkameras von der Außenseite des Verbunds her setzen oder Near-Clip so wählen, dass Fremdobjekte unter 3 Einheiten vor der Kamera wegfallen | S |
| P0 | Diorama | Auto schwebt über dem Sand, Reifen ohne Bodenkontakt, Schatten liegt unter dem Chassis | G_nah_kit__orbit_-12_3.5_142_1.5_0.1_10.png, Vorderrad links, Lücke zum Boden | Fahrzeug um Reifenradius absenken, Reifen zwei Prozent in den Boden eindrücken, so wirkt es wie in Knete gesetzt | S |
| P0 | Claymation | Orange Blockfelsen mit grüner Kappe am Canyonrand, untexturiert, hängen über die Inselkante | B1_verbund_kit__canyon.png, links unten und rechts am Rand; B1_verbund_kit__canyon-ref.png, linker Rand | Durch die braunen Bucht-Felsbrocken mit Dellen ersetzen, in Canyon-Sockelorange einfärben, 1 Einheit nach innen rücken | S |
| P1 | Claymation | Kit-Vegetation Canyon ist facettiertes Low-Poly ohne Dellen, Mühlrad ebenso | G_nah_kit__orbit_-58_1_6_0.3_0.06_40.png, Büsche Mitte und rechts; G_nah_kit__orbit_-46_1_-5_0.8_0.12_14.png, Rad; Vergleich G_nah_old__orbit_-58 | Canyon-Büsche auf die Bucht- und O-Town-Buschvariante mit Kraterdellen umstellen, Mühlrad bekommt dieselbe Dellen-Normalmap wie das Mühlenhaus | M |
| P1 | Diorama | Kein Rand, kein Horizont, kein Nebel, kein Fülllicht, Himmel flach | B1_verbund_kit__overview.png, oberer Bildteil; B1_verbund_kit__under.png | Vertikaler Verlauf im vorhandenen Himmelblau plus Distanznebel in Himmelfarbe, Fülllicht kühl im Himmelton, so rücken hintere Inseln nach hinten | M |
| P1 | Kamera | Übersicht schneidet Pyramideninsel unten an, zwei Drittel Himmel leer | A1_verbund_old__overview.png und B1_verbund_kit__overview.png, untere Bildkante | Kamera höher und weiter zurück, Pyramide ganz ins Bild, Inseln ins untere Drittel setzen | S |
| P1 | Diorama | Hintere Mumie steckt bis zur Brust in der Pyramidenstufe | G_nah_kit__orbit_12_4_136_0.3_0.08_12.png, Figur hinter dem Altar | Platzierung an den Altar versetzen, Bodentest gegen Pyramidenmesh statt gegen Inselboden | S |
| P1 | Kamera | Referenzkamera Bucht mit Fremdobjekten im Vordergrund | B1_verbund_kit__bucht-ref.png, O-Town-Baum unten rechts, Canyon-Ecke unten Mitte | Wie P0 Kamera | S |
| P1 | Farbe | Bucht und Pyramide fast gleiche Palette, lesen als eine Insel | B1_verbund_kit__overview.png, Bucht oben Mitte gegen Pyramide unten; B1_verbund_kit__pyramide-ref.png, Bucht hinter Pyramide | Bucht-Deckfläche Richtung Hellsand mit Türkisstich kippen (Wasserfarbe ist schon da), Bucht-Sockel rötlicher als Pyramidensockel | S |
| P1 | Claymation | Spiegelnde Scheiben, Chrom und Spekular auf Fahrzeugen, Knete glänzt nicht | G_nah_kit__orbit_48_-3_7_-0.5_0.1_22.png, Busfenster und Chromleisten; G_nah_kit__orbit_-12_3.5_142_1.5_0.1_10.png, Scheinwerfer und Windschutzscheibe | Roughness auf Fahrzeugen hoch, Fenster matt mit der Dellenstruktur, die auf dem Bus schon angelegt ist | S |
| P2 | Tusche | Keine Kontur im gesamten Build, Kartenbild lebt von Linie | alle Bilder; Vergleich refs/deck_1001nights_manifesto_card.png | Dünne Außenkontur in der jeweiligen Sockelfarbe der Insel, nur Silhouette, keine Innenlinien, damit Knete bleibt und trotzdem Tusche entsteht | M |
| P2 | Claymation | Identische Instanzen ohne Streuung | G_nah_kit__orbit_52_-3_18_-2.2_0.05_45.png, drei orange Pilzbäume rechts in Reihe; B1_verbund_kit__canyon.png, gestufte Büsche | Skalierungs- und Drehstreuung von etwa 15 Prozent, drei Formvarianten je Busch | S |
| P2 | Claymation | Dellenmaßstab falsch: Fassade und Bus mit Buschdellen, Inselunterseite mit Wellenstreifen | G_nah_kit__orbit_48_-3_7_-0.5_0.1_22.png, Stadthauswand links; B1_verbund_kit__under.png, Bildmitte | Dellen-Normalmap je Objektklasse skalieren, Gebäude kleiner, Insel größer, Unterseite auf dieselbe Textur wie Deckfläche | M |
| P2 | Farbe | Zwei Wassermaterialien, Bucht- und Pyramidensee als Scheibe ohne Ufer | B1_verbund_kit__canyon.png, See mit Uferfuge; C_solo_bucht__bucht-ref.png, See ohne Rand | Ein Wasser, das Cyan behalten, die Sandfuge vom Canyon-See auf alle Seen übernehmen | S |
| P2 | Diorama | Hub-Straße als flaches Grauband über die Insel hinaus in die Leere | F_hub__rkit_hub.png, Straße links und rechts über den Rand | Straße in der Wegfarbe Creme der anderen Inseln, am Inselrand enden lassen | S |
| P2 | Licht | Gezackte Schattenkanten und Streifen am Hang | G_nah_kit__orbit_52_-3_18_-2.2_0.05_45.png, Schatten der orangen Büsche; G_nah_old__orbit_-58, Schatten unter Baum | Schatten weicher filtern, Bias anheben | S |
| P2 | Kamera | Hochformat schneidet Canyon und O-Town an | E_mobile_390x844_kit__overview.png, linker und rechter Rand | Eigene Portrait-Übersicht, höher und mit Inseln vertikal gestaffelt | S |
| P3 | Lesbarkeit | Text und Zahl im Bild: "CICADA", "911" | G_nah_kit__orbit_-12_3.5_142_1.5_0.1_10.png, Kennzeichen; G_nah_kit__orbit_48_-3_7_-0.5_0.1_22.png, Polizeiwagen | Info. Bei Kayfabe-Welt entscheiden, ob Text bewusst gesetzt ist | S |
| P3 | Diorama | Knetwolken nur in Nahansichten sichtbar, in der Übersicht fehlt jedes Maßstabssignal | G_nah_kit__orbit_-58_1_6_0.3_0.06_40.png, Wolken oben; B1_verbund_kit__overview.png ohne Wolken | Idee: Wolken als Maßstabssignal auch in die Übersicht holen | S |

### 4.3 Drei Dinge, die bereits gut sind und nicht angefasst werden dürfen

1. **Das Inselmaterial.** Deckfläche, Wulstkante und Sockel mit durchgehender Knetstruktur, weich, matt, mit Daumenspur in richtiger Größe. Beleg: G_nah_kit__orbit_-58_1_6_0.3_0.06_40.png (Inselkante quer durchs Bild) und B1_verbund_kit__bucht-ref.png (Sockel).
2. **Die Mumien.** Bandagen als gedrückte Knetstreifen, Dellen im Figurenmaßstab, Kulleraugen, Ankh als Requisit, Haltung lesbar. Das ist die Figur, die der Wallace-und-Gromit-Referenz am nächsten kommt. Beleg: G_nah_kit__orbit_12_4_136_0.3_0.08_12.png, vordere Mumie.
3. **Die Pyramide als Plattenstapel.** Abgerundete Knetplatten, Stufen leicht versetzt, Treppenriegel als Knetwürste, Deckplatte heller. Dazu die Referenzkamera Pyramide als einzige Kamera, bei der Vorder- und Hintergrund zusammenarbeiten. Beleg: B1_verbund_kit__pyramide-ref.png.
Als Ergänzung ohne eigenen Platz: Die O-Town-Palette (C_solo_otown__otown.png) ist die konsequenteste Farbstimmung im Build.

### 4.4 Gehört diese Welt in dasselbe Universum wie das Kartenbild?

Nein. Die Karte lebt von Tuschelinie, Kritzel, Graffiti, Staub und ockerfarbenem Straßendreck, die Welt dagegen ist saubere Bonbonknete ohne eine einzige Linie und ohne Abnutzung. Nur die Mumien und der rostige Bus (G_nah_kit__orbit_48) tragen einen Hauch von der Verwitterung der Karte, der Rest sieht nach Spielzeugladen aus, nicht nach Kayfabe-Gasse.

### 4.5 Gesamturteil B

Nicht bestanden: Mittel 6,4 (Claymation 7,0, Diorama 6,0, Farbe und Licht 7,0, Tusche 6,5, Kamera 5,5), und die Achse Kamera liegt mit 5,5 unter 7.

### 4.6 Anmerkungen des Prüfers A zu B (keine Änderung an B)

- Bs P0 „Auto schwebt“ und As A-02 belegen denselben Fehler aus zwei Richtungen: Bild (Luft unter dem Vorderrad) und Zahl (0,31 Einheiten über dem tiefsten Bodenpunkt). Das ist der Fall „Bild und Zahl zusammen“ aus der Beweisregel.
- Bs P0 „Blockfelsen mit grüner Kappe“ sind die Quaternius-Randsteine `Rock_Moss_4/6` des Kit-Environments; `PROJECT_STATE.md` nennt sie seit 2026-10-08 als offen („lesen als geschichtete Blöcke“). Der blinde Prüfer bestätigt den offenen Punkt ohne ihn zu kennen.
- Bs P0 und P1 „Kamera verdeckt“ ist As A-05. Beide Prüfer stufen es unabhängig voneinander als P0/P1 ein.
- Bs „hintere Mumie steckt in der Pyramidenstufe“: Sie sitzt laut Spec auf dem Sarkophag (`r-mummyA`, `seat`), gemessen 0,78 über dem Boden. Aus der Kamera 12,4,136 liest die Sitzpose als Einsinken, weil die Hüfte hinter der Altarkante liegt. Der Befund ist also eine Kamera- und Posen-Frage, kein Kollisionsfehler, bleibt aber als Lesbarkeitsmangel stehen.
- Bs „Zahl im Bild 911“: das Kennzeichen stammt aus der Textur des Retro-Car-Pakets (Unity), nicht aus dem Lab, und fällt mit A-01 (Lizenz) und A-03 (fehlende PSD) in denselben Ordner.

---

## 6 · Synthese: was zuerst

Beide Prüfer kommen unabhängig auf dieselben drei Blöcke. Reihenfolge nach Hebelwirkung je Aufwand:

1. **Kamerasatz reparieren (A-05, B P0/P1, Aufwand S).** Ohne ihn ist jeder weitere Kritiker-Lauf im Verbund wertlos.
2. **Bodenkontakt auf eine Fußpunkt-Funktion (A-02, B P0, Aufwand M)** und die 0,07-Konstante streichen; Autos mit Standfläche statt Pad-Konstante.
3. **Lizenz und Auslieferung (A-01, Aufwand S):** StreakByte und Cars aus `public/`, Lizenzdateien je Ordner, Lizenz-Linter. Dazu der 404-Fix am Dev-Server (A-03), sonst bleibt der Konsolen-Boden blind.
4. **Knet-Konsequenz auf Kit-Objekten (B P1, A-11, A-12):** Glanz raus, Dellenmaßstab je Klasse, eine Farbquelle. Das ist der einzige Weg, auf dem Bs Claymation-Achse Richtung 8,5 geht.
5. **Wirt und Modulvertrag (A-06), Tageszeit (A-14), Tusche-Kanon (A-07, B P2):** gehören in den Stufe-1-Umbau, der laut `STAGE1_R2D_PORT_PLAN.md` ohnehin ansteht; nicht vorziehen, aber im Plan als Pflicht eintragen.

Was nicht angefasst wird (Schnittmenge A und B): Inselmaterial und Scholle, Mumien, Pyramide, Messschnittstelle `__kfb`, Straßenbett-Naht, Determinismus des Geländes.

---

## 5 · Abnahme des Reviews selbst

- [x] Kalibrierszene aufgenommen, bevor benotet wurde (`shots/00_kalibrierung.png`).
- [x] Bestandsaufnahme vorhanden (§1).
- [x] Jeder Befund hat Beleg, bei Geometrie Bild und Zahl (A-02).
- [x] Beide Tore geprüft (§2).
- [x] Blindlese-Test bei 24 px durch Instanz ohne Auftragskenntnis (`blindtests.md` §A).
- [x] Noten mit Anker begründet (Prüfer B, §4.1).
- [x] Blinder Paarvergleich gegen ein Kartenbild, Reihenfolge gemischt (`blindtests.md` §B, bestätigt durch B §4.4).
- [x] Drei gute Dinge benannt (A §3, B §4.3).
- [x] Mängelliste nach Priorität mit Aufwand (Deliverable A).
- [x] Browserfassung im Protokoll (Kopf dieses Berichts).

**Eingriffe des Prüfers in das Projekt:** keine Codeänderung. Angelegt wurden nur `docs/critic/lab-mvp-slice/2026-10-11_review01/` (Bilder, Messwerte, Berichte). Eine testweise Ergänzung an `.claude/launch.json` wurde innerhalb derselben Sitzung wieder auf den Originalstand zurückgesetzt. Die Werkzeuge des Prüfers (Kalibrierseite, Pixel-Diff, Verkleinerung, Deck-Screenshot) liegen außerhalb des Projekts.
