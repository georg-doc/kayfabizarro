# PROJEKTE · Übersicht aller Linien im Workspace

Hohe Ebene, ein Absatz je Linie. **Wozu:** damit ein frischer Chat in einer Minute weiß, welche Linie
lebt, wo ihr Code liegt und woraus man schöpfen kann. Details stehen jeweils in der Linie selbst.

**Status:** **AKTIV** = wird bearbeitet · **FROZEN** = läuft, wird nicht angefasst, ist Vergleichsmaßstab
· **SUPERSEDED** = abgelöst · **RUHT** = kein Abbruch, nur kein aktueller Auftrag.

---

## Die Wortmarke: was hier eigentlich gebaut wird

Ein Cartoon-Universum um **Kayfabizarro** und **Uncle FrizzleBob** — Kartendecks (56 Karten je Deck,
130 Decks in der Registry), Pets, und mehrere Spiel-Prototypen, die alle aus demselben Vorrat schöpfen:
dieselbe Tuschekante, dieselben Pets, dieselbe Asset-Bibliothek, dieselben Karten.

**Die Linien sind keine Konkurrenten, sondern Antworten auf verschiedene Fragen.** Deshalb existieren
mehrere Reise-Modi parallel, und deshalb ist keiner „der falsche".

---

## 1 · Travel (Kachelwelt) — `terrain-v10` … `terrain-v25`

**Die Hauptlinie.** Ein Pet/Mech reist durch Voxel-Terrain, am Boden und im Flug, und kämpft gegen
Sky-Mobs. Höhenfeld aus instanzierten Würfeln, Skydome-Shader, Karten als Landschaftselemente.

| | |
|---|---|
| **AKTIV** | **`KFB Travel Combat v25.dc.html`** + `terrain-v25/` (69 Dateien, ~600 kB) |
| FROZEN | `v24` (Vergleichsmaßstab, Kampf-Slice, 20 Gegner-Arten, gemessenes Lichtbudget) |
| Reihe dahinter | `KFB Travel v13` … `v23` (v23 in drei Schnittkanten-Varianten a/b/c) |
| Doku | `docs/travel-v25/` — **`IST_v25.md`** ist das living document, `SPRINT_v26.md` die Planung |
| Standalone | `export/travel-combat-v25_2026-09-10/` · 1629 kB · geprüft |
| Nächstes | v26. Erste Frage: Sky-Karten-Deck pro Zone oder durchmischt (`SPRINT_v26.md` §0) |

**Woraus man hier schöpft:** Voxel-Terrain, Skydome, Farbwelten, Kampf-Wirt, Pet-Kinetik,
Boden-Schatten, Zonen-Ring. Siehe `MODULE.md`.

---

## 2 · Travel Globe (Kugelwelt) — `globe-v1` … `globe-v13`

**Der andere Ansatz zur selben Frage.** Keine Kachelwelt, sondern eine **geschlossene Kugel mit
gekrümmtem Horizont**. Vorbild und Messlatte ist `dannylimanseta/tinyskies`; übernommen werden dort
**Raten und Verhältnisse, nie Absolutwerte** (tinyskies rechnet auf Weltradius 5), und jede Abweichung
ist im Code deklariert.

| | |
|---|---|
| **AKTIV** | **`KFB Travel Globe v13.dc.html`** + `globe-v13/` (90 Dateien, 1725 kB) |
| FROZEN | `v12` (Vegetation, Münzen, Schweben, Sperrzonen) · `v7`, `v8` |
| Neu in v13 | Contrails als Comic-Speedlines, Cartoon-Trägheit, Standbild vor dem Anflug |
| Doku | `docs/LIVING_KFB-Travel-Globe.md` · `docs/CHANGELOG_v13.md` · **`docs/TS-DELTA-v12.md`** (der Lesebericht zur Quelle) |
| Standalone | `export/kfb-travel-globe-v13_2026-09-10/` · 2698 kB · geprüft |
| Größte Dateien | `globe-poc.js` (366 kB), `portal.js` (73), `globe.js` (71) |

**Besonderheit:** die Globe-Linie hat das **robustere Bündel-Verfahren** (Quellen als base64 im
JS-String statt JSON im Script-Block). Wenn eine andere Linie bündelt, ist das die Vorlage.

---

## 3 · Travel Planets v1 — `terrain-planets-v1`

Seitenzweig aus Travel v20: **der Planet**. Kleiner Umfang, eigener Befund. **RUHT.**

---

## 4 · Overworld — `overworld-v1` … `overworld-v15`

**Die 2D-Linie.** Freie Bewegung (walk + flight), Aggro-Gegner, KISS-Kampf, HUD mit Statblatt,
Mini-Map im KFB-Kartenformat mit Tuschekante, Quest-Karten, dreißig spielbare Einheiten.
Entstand als Pivot aus Grand Theft Tax.

| | |
|---|---|
| Letzter Fork | **`KFB Overworld v15.dc.html`** + `overworld-v15/` (72 Dateien) — **RUHT** |
| FROZEN | `v14` (seit 2026-08-14, nach Prüflauf C0/C1/C2) |
| Nebenzweige | `v4_B` (2D-Re-Home + HUD v7) · `v8` (Terrain-Floor-Art) · `v9-B` (rechte Spalte als Kartenspiel) · `v10 HUD` |
| Eigenes | **`overworld/ui-kit-ts.js`** — der Tiny-Swords-Baukasten, 96 Teile (aus 19 gewachsen) |

**Woraus man hier schöpft:** der UI-Baukasten, das Statblatt, die Kartenformat-Mini-Map, die
Avatar-Zuordnung.

---

## 5 · Rollercoaster — `build/rollercoaster-v8` … `-v11`

**Die Fahrt.** Achterbahn mit Pet als Fahrgast, Start-Screen mit **Pet-Auswahl-Karussell**, FrizzleBob
als Stimme, Dancefloor-Welt, Fraktal-Skydome.

| | |
|---|---|
| Neueste | **`Rollercoaster Ride v11.dc.html`** + `build/rollercoaster-v11/` |
| Davor | `v10` (trägt die Modulsammlung), `v9`, `v8` |
| Doku | `build/rollercoaster-v11/BOOTSTRAP_v11.md` · `HOUSEKEEPING.md` je Ordner |

**Hier liegt der größte wiederverwendbare Vorrat des Workspace** — Pet-Select, Pet-Library,
Augen-Rig, Stimme, Motion. Die Importmap in der v11-DC ist die Landkarte dazu. Siehe `MODULE.md`.

---

## 6 · PetFlight — `build/petflight-v1`, `-v2`

Pet im Flug, eigener Wirt. **v2 ist die neuere Fassung**; sie hat einen Coworker-Report und eine
Lichtanalyse dabei. Die Projektbezeichnung nennt PetFlight und Rollercoaster zusammen — hier liegt
gerade der Schwerpunkt.

Bekannt und bewusst so: ein toter „Disco"-Knopf im Ansicht-Panel von v2 bleibt stehen, damit der
Export byte-gleich bleibt.

---

## 7 · Pet Studio — `studio-v3`, `KFB Pet Studio v4.dc.html`

**Die Werkstatt für die Pets selbst**, nicht ein Spiel. Im Repo gepflegt unter
`skills/KFB PetStudio/` (bis v9-2) mit eigener Übergabe. **Quelle der Wahrheit für Pet-Aufbau,
Augen-Rig und Gesicht.**

---

## 8 · Grand Theft Tax — `gtt-v1`, `gtt-v2`

Treadmill-Konzept. **FROZEN seit 2026-08-05**, Pivot zu Overworld v1 — die wiederkehrenden Defekte
waren Symptome eines zweiten Problems, nicht Einzelfehler. Der Befund steht in
**`LESSONS_GrandTheftTax.md`**, und der ist der eigentliche Wert dieser Linie.

---

## 9 · Kleinere Linien

| Linie | Was | Status |
|---|---|---|
| **Gutter-Hop v1** | `gutterhop-v1/` · Sprung-Prototyp | RUHT |
| **SpinBallPop v5/v6** | `spinballpop/` · Feldform-Spike, als reines HTML | RUHT |
| **Dancefloor** | `build/dancefloor/` · Tanzflächen-POC, in Rollercoaster verbaut | Baustein |
| **Fractal Skydome POC** | Fraktal-Himmel, in Rollercoaster v11 verbaut | Baustein |

---

## 10 · Karten und Tusche (querliegend, keine Spiel-Linie)

Die Kartenmaschine, die **alle** Linien benutzen: `cardbuilder/`, `kfb-ink-outline.js`,
`kfb-box-material.js`, `kfb-texture-catalog.json`, und im Repo `skills/kfb-ink-canon.js` +
`skills/kfb-embed-bundle v3/`.

**Regel:** die Kanon-Feder wird **importiert, nie nachgebaut.** Es gibt genau eine Tuschekante.

---

## 11 · Werkbänke und Prüfstände (Belege, keine Module)

Rund dreißig DCs, deren Produkt ein **Befund** ist, kein Code: `KFB Boden-Werkstatt`,
`KFB Effekt-Labor`, `KFB Flora-Prüfstand v11`, `KFB Textur-Pool`, `KFB SpriteLab v1`,
`KFB Blasen-Formen v1`, `KFB Cartoon-Verbieger`, `KFB Ink-Normierung`, `KFB Card Zone Lab v2`,
`KFB Zonen-Registry`, `KFB Weltbau-Werkbank`, `KFB UI-Baukasten TS`, `KFB Asset-Audit v10`,
`KFB Mob Übersicht`, `KFB Kartenschau`, `KFB Portal-Vergleich`, `KFB Mech Recon/Slice`,
`KFB System Übersicht`, `KFB Entscheidungen v1` und weitere.

**Wichtig im Umgang mit ihnen:** ihr Wert ist die Zahl, die drinsteht — nicht der Code. Sie sind
**nicht** dafür gebaut, zusammengesetzt zu werden. Wer daraus ein Produkt bauen will, baut wieder
zwölf Einzelbeweise. Genau das war die Gründungsdiagnose.

---

## 12 · Geteilte Wurzel

| Ort | Inhalt |
|---|---|
| `build/module/` | **Der richtige Ort für geteilte Module.** Pets, Augen-Rig, Gesicht, Mund, Motion, FX. |
| `modules/` | Kampf-Module: Cues, Definitionen, SFX, Trefferreaktion, Mech-Kampf, Waffen (Würfel, Augapfel), Schrittmaß-Messung |
| `media/` | Bilder, Töne, Modelle — **im Repo**, nie schwer im Projekt |
| `kfb-asset-library.json` | 11 859 Einträge mit fertiger `url` |
| `zone-index.json` · `zone-registry.json` · `constructs.json` · `schrittmass.json` | Daten |
| `themes/`, `refs/`, `assets-lab/` | Vorlagen und Referenzen |
| `support.js` | Laufzeit der Design-Komponenten. **Nie selbst schreiben.** |

---

## 13 · Wenn du eine neue Linie anfängst

1. **`MODULE.md` zuerst** — sehr wahrscheinlich existiert die Hälfte schon.
2. **Wirt-Vertrag aus `START_HIER.md` §2** als Erstes hinschreiben, vor dem ersten Modul.
3. **Eine Linie, ein Ordner, ein living document.** Nicht drei Ordner für einen Gedanken.
4. **Beim Fork:** der Runner wird beim Fork **nicht** angefasst. Erst kopieren, dann ändern — sonst
   ist nicht mehr unterscheidbar, was der Fork und was die Änderung war.
