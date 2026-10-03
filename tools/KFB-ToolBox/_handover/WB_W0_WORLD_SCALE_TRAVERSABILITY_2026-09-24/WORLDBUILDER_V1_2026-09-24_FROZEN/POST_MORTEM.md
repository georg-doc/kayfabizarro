# POST MORTEM · KFB WorldBuilder v1 · Slice 1 · 2026-09-24

**Status: `HUMAN_REJECTED_FOUNDATION` · DO NOT PATCH**
Urteil Georg, 24.09.: Der Stand ist kein Tuning-Fall, sondern eine falsche Grundlage. Er wird eingefroren und nur als Failure-Evidence exportiert. Keine weitere Claude-Design-Zeit in diesen Stand.

Dieses Dokument ist additiv. Es ersetzt nichts in RETURN.md, CHANGELOG.md oder SOURCE.json, es ordnet sie ein.

---

## 1 · Was verlangt war, was gebaut wurde

**Briefing:** `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_CLAUDE_DESIGN_WORLDBUILDER_V1.md` (Claude-Coworker-Briefing, als Upload in dieses Projekt gegeben).
Acht „done when“-Ziele gleichzeitig: Planet von aussen · durchgehender Kameraflug · Sculpt · Objekte platzieren · Himmel/Wetter/Stimmung · vier Gebäude-Looks · Figur gehen lassen · Speichern/Laden. Racetrack und OSM-Zonen ausdrücklich „später“.

**Gebaut:** eine Planet-/Editor-Demo, die alle acht Punkte technisch bedient: `KFB WorldBuilder v1.dc.html` + `wb1-boot.js` · `wb1-planet.js` · `wb1-sky.js` · `wb1-buildings.js` · `wb1-actor.js`. Alle Donor-Zeilen erschienen im Protokoll, jede Funktion war auslösbar.

**Warum das trotzdem FAIL ist:** Keines der acht Ziele fragt, ob die Welt *an einer Stelle* glaubwürdig, messbar und begehbar ist. Eine Demo, die alle Knöpfe hat, aber keinen Ort, an dem man stehen, gehen und fahren kann, ist keine Grundlage für eine spielbare Welt.

---

## 2 · Root Cause (eine Zeile)

**Es wurde eine Planet-/Editor-Demo gebaut, bevor Massstab, Traversierbarkeit, Routennetz und lokale Weltregion verbindlich definiert waren.**

Folgen im Bild: willkürliche Gebäudegrössen, blockierte Laufbereiche, zackige Landmassen/Küsten, ungefilterte Objektverteilung, eine zu grobe schwarze Outline.

---

## 3 · Ursachen im Briefing (Claude-Coworker)

| # | Befund | Wirkung |
|---|---|---|
| B-1 | **Zu breit.** Acht Features in einem Slice, jedes mit eigenem Donor. | Arbeit wurde auf Donor-Integration verteilt statt auf einen belastbaren Ort. „Stop when all eight work“ belohnt Funktionsbreite, nicht Qualität. |
| B-2 | **Racetrack und OSM auf „später“ verschoben.** | Genau die räumliche Ordnung (Route, Korridor, Belegung), die eine spielbare Welt braucht, fehlte im ersten Beweis. Ohne Route gibt es nichts, woran Gelände, Spawn und Gebäude sich ausrichten. |
| B-3 | **Terrain-First-Linie nicht übertragen.** `TERRAIN_FIRST_RESET_2026-09-23.md` (Biome-Blending, Erosion, Hang-/Höhenregeln) steht im Repo, wurde aber nicht verbindlich ins Briefing übernommen. | Gelände entstand aus Rauschen + Landmaske, ohne Hang-, Höhen- oder Erosionsregel. Keine Garantie für Begehbarkeit. |
| B-4 | **Eingefrorene Hürth/Elastic-Grundlage als Donor verlangt.** Das Briefing nennt V2 @0c59e92d als „Basis“ und R2 als „nur Palette“ — die Grundlage ist aber nach zwei Reparaturdurchläufen offiziell eingefroren ([PR #194](https://github.com/georg-doc/kayfabizarro/pull/194)). | Die dort verworfenen Probleme (Dächer als Deckel, Bordstein-Keile, Schattenbänder, Farbe) wanderten unbemerkt in den WorldBuilder. |
| B-5 | **Look-Ziel statt Messziel.** „clean, smooth, hand-made-looking cartoon planet“ ist ein Bildwort, kein prüfbares Tor. | Glätte wurde als „keine Facetten von aussen“ gelesen und erfüllt — Küstenzacken und Silhouette am Boden blieben ungeprüft. |
| B-6 | **Keine Massquellen genannt.** Weder Figurhöhe, noch Türhöhe, noch Spurbreite als Referenz. | Die Skalierung wurde vom Umsetzer „nach Gefühl“ gewählt (siehe 4). |

---

## 4 · Ursachen in der Umsetzung (Claude Design, dieser Chat)

Ehrlich und vollständig, auch wo das Briefing es nicht verursacht hat.

### 4.1 Massstab — dreimal umgebaut, nie abgeleitet
1. **Erster Wurf R = 5** (Begründung: TinySkies GLOBE_RADIUS 5, damit die Himmelskonstanten „ungerechnet gelten“). Die Figur wurde auf **0,16** eingepasst, Objekte per `fit` auf Wunschhöhen gezwungen (Haus 0,5 · Baum 0,46 · Fels 0,12 · Lampe 0,3), Hürth-Gebäude mit **0,05 → 0,03 Einheiten/m** verkleinert. → Drei verschiedene Massstäbe in einer Szene. Georg: *„die skalierung ist schon völlig falsch!“*
2. **Zweiter Wurf R = 60 m**, alles nativ in Metern — nie gerendert, sofort überholt.
3. **Dritter Wurf R = 400 m, stilisierte Erde** (Georg: *„nimm eine stilisierte Erde als Vorlage“*). Einheit jetzt Meter, aber der **Radius selbst war frei gewählt**. Folge: 1° ≈ 7 m, der Hürth-Block (≈150 m) bedeckt Benelux/Westdeutschland, Europa ist ≈250 m breit. Das habe ich im RETURN als „bewusster Spielzeugmassstab“ benannt — es war keine Ableitung, sondern eine Setzung.

**Fehlerklasse:** *Einheit ≠ Massstab.* „Alles in Metern“ ist nur dann richtig, wenn die Welt, auf der die Meter liegen, selbst aus einer Quelle abgeleitet ist. Eine Kugel mit erfundenem Radius macht jede Meterangabe darauf beliebig.

### 4.2 Traversierbarkeit — nie getestet
- **Spawn im Meer:** Figur 70 m „südlich“ von Hürth gesetzt — bei R 400 sind das ≈10° Breite, also Mittelmeer zwischen Sardinien und Spanien. Gemessen `heightAt = −6,0` (Meeresgrund). Korrigiert per Versatz „40 m Ost“ (≈ Böhmen) — wieder eine Setzung, kein Test.
- **Keine Hang-, Wasser- oder Kollisionsprüfung** auf einem Laufweg. Es gab keinen Laufweg.
- **Testhügel per Skript** (12 Tupfer × 0,5 m Stärke, Radius 6 m) ergab einen steilen Kegel — als „Sculpt funktioniert“ gewertet, obwohl er unbegehbar ist.

### 4.3 Gebäude — eingefrorene Grundlage auf ungeeignetes Gelände gestellt
- Elastic-V2-Gebäude wurden mit ihrer Basis auf die **niedrigste** Geländehöhe unter dem Grundriss gesetzt (`hmin − 0,15`) → bergseitig im Hang vergraben, talseitig ohne Sockel.
- Flache Gebäudegeometrie auf gekrümmter Kugel ohne Anpassung.
- Keine Strassen, keine Grundstücke, kein Bezug der Gebäude zueinander ausser dem OSM-Versatz.
- In der Bodenansicht erscheint ein Gebäude als **flache Wandscheibe hinter einem Baum** (Evidenz B3).

### 4.4 Objekte — ungefilterte Platzierung
- Standardobjekte per festem Versatz um den Spawn gestreut, **ohne Belegungs- oder Abstandstest**, mit Zufallsdrehung beim Platzieren.
- Registry-Muster griffen blind: `/^Rock/i` traf zuerst eine **0,10 m flache Wegplatte** als „Rock“; `/lamp|light/` fand im Park-Paket nichts (`street_lantern`). Erst nach Fehlschlag nachgesehen und korrigiert.
- Objekte behalten ihre Lage, wenn Gelände darunter verändert wird (schweben/versinken).

### 4.5 Küste, Silhouette, LOD
- Landmaske aus Natural Earth 50m, gerastert 2048×1024, **Weichzeichnung 3 px** — am Boden ist ein Pixel ≈1,2 m: die Küste bleibt **treppig/zackig**.
- Meer als separate Kugel auf Meereshöhe → harte Schnittlinie Land/Wasser, keine Uferzone.
- LOD als zwei überlagerte Netze (global ≈4,9 m Raster + Nahfeld 0,82 m) mit `polygonOffset` statt nahtlosem Übergang.

### 4.6 Outline
- `wd-ink.js` als bildschirmweiter Sobel mit fester Pixelbreite (dünn im Licht / dick im Schatten) über alles, einschliesslich Küste und Terrainknicke → **grobe schwarze Linien**, die Terrain- und Küstenzacken zusätzlich betonen. Keine Entfernungsabhängigkeit.

### 4.7 Look
- Erste Ground-Look-Fassung übernahm `colour 0.34` aus `TERRAIN · COMBINED REF` → die Derek-RGB-Maskenkachel färbte den Boden **pastell-regenbogenbunt** (Evidenz B2). Danach `colour 0`, aber der Look blieb ein Nachjustieren am falschen Objekt.
- Gottesstrahlen dominierten das Orbitbild; Faktor von 0,06 auf 0,025 gesenkt — Symptombehandlung.

### 4.8 Prozess
- **Selbstprüfung per Screenshot statt per Messung.** „Sieht gut aus“ wurde als Beleg gelesen. Keine Zahl für Hangneigung, Wegbreite, Türhöhe, Abstand.
- **Schnelle Kurskorrekturen ohne Neuplanung.** Nach „Skalierung falsch“ und „stilisierte Erde“ wurde der bestehende Aufbau umgebaut statt die Frage „welche Stelle muss zuerst stimmen?“ zu stellen.
- **Übergabetext klang nach Lösung.** „Everything in metres“, „no facets“, „Walk works“ — richtig als Einzelsätze, irreführend als Gesamtaussage.

---

## 5 · Was ein Tor vorher gefangen hätte

| Tor | Messung | Hätte gefangen |
|---|---|---|
| Massstabsvertrag | Figurhöhe (GothGirl 2,21 m gemessen), KayKit-Türhöhe, Racer-Spurbreite, OSM-Grundriss — alle aus Quelle, dokumentiert | 4.1, 4.3 |
| Route zuerst | semantische Route mit freiem Korridor; Gelände wird um sie geformt | B-2, 4.2, 4.3 |
| Begehbarkeit | max. Hangneigung, kein Wasser, keine Kollision entlang der Route; Spawn-Prüfung | 4.2 |
| Belegung | Sperrzonen (Spawn, Route, Interaktionsflächen); Abstandstest für jedes Objekt | 4.4 |
| Silhouette | Küste/Terrainkante in Orbit UND Boden ohne Treppen/Zacken | 4.5 |
| Outline | entfernungs- und bildschirmbezogen; keine dicken Hüllen | 4.6 |

---

## 6 · Regeln für die nächsten Slices

1. **Ein Ort vor einer Welt.** Zuerst eine glaubwürdige, messbare, begehbare Stelle — dann Globus, Zonen, Editor.
2. **Kein Mass ohne Quelle.** Figur, Tür, Spur, Grundriss. Keine erfundenen Meter, kein Einpassen nach Gefühl, kein frei gewählter Planetradius.
3. **Route vor Gelände vor Inhalt vor Licht.** Reihenfolge: Planet-/Zonenübersicht → semantische Route/OSM-Strecke → lokaler kontinuierlicher Terrain-Korridor → Gebäude/Landmarks/Residents/Props → Licht/Farbe/Wetter/Outline.
4. **Eingefrorene Grundlagen bleiben eingefroren.** PR #194 (Hürth/Elastic) ist nicht Donor, solange Georg sie nicht wieder freigibt.
5. **Messung schlägt Screenshot.** Jedes PASS braucht eine Zahl.
6. **Ein Briefing mit mehr als einem Beweisziel wird vor Arbeitsbeginn zurückgefragt.**

---

## 7 · Was als Wissen (nicht als Grundlage) weiterverwendbar ist

Nur als Lesekopie/Erfahrung — **nicht** als Code-Basis für WB-W0:

- Ladeweg WB2-Sculpt-Kern und `edit-layer.js` @8922d4b1 per Import; `edit-layer` `onMenu('floor')` lässt dem Host das Absetzen (radial auf Kugel möglich, ohne zweiten Picker).
- EyeRig-v6-Montagefolge des Batch-Tools (cleanup → mountKayKitEyes → sampleActorFaceColor → setBaseColor) lief fehlerfrei auf GothGirl.
- TinySkies-Module lassen sich mit einem Längenfaktor K betreiben; `day-night` prüft `setOceanColors` auf Existenz; relative `sky-presets.js`-Imports lösen auf dieselbe URL.
- Messwerte: GothGirl 2,21 m · Tiny-Treats `house` 5,90 × 6,50 × 6,54 m · KayKit `Tree_1_A_Color1` 3,18 × 4,16 × 3,25 m · Quaternius-Paket enthält keinen Fels, nur Kiesel und Wegplatten · Park-Laterne heisst `street_lantern`.
- `wd-look` liest die Quellfarbe vor `<color_fragment>` — bei Vertexfarben muss die Reihenfolge getauscht werden.

---

## 8 · Evidenz (evidence/)

| Datei | Zeigt |
|---|---|
| A1_orbit_R5_toy-scale.jpg | R 5, Gebäude als Riesenklötze gegen Planet und Figur (erster Massstab) |
| A2_ground_R400_spawn-in-sea.jpg | Figur steht im Meer (Spawn 70 m „südlich“ = Mittelmeer) |
| B1_approach_buildings-vs-coast.jpg | Annäherung: Gebäudeklötze, treppige Küste, dicke Outline |
| B2_ground_pastel-look.jpg | Boden pastell-bunt (colour 0.34 aus COMBINED REF) |
| B3_ground_building-slab-behind-tree.jpg | Gebäude als Wandscheibe am Horizont |
| C1_ground_scripted-hill.jpg | Skript-Hügel: steiler, unbegehbarer Kegel |
| C2_evening.jpg / C3_night-rain.jpg | Himmel funktionsfähig — ohne begehbaren Ort wertlos |

Georgs eigener Ablehnungs-Screenshot liegt in seinem Chat mit dem WSA-Lead und ist nicht in diesem Projekt.

---

## 9 · Nächster Schritt

Siehe `NEXT_GATE_WB-W0.md` in diesem Ordner: **WB-W0 · WORLD SCALE + TRAVERSABILITY PROOF** — genau eine kleine spielbare Region. Nicht in diesem Chat begonnen.
