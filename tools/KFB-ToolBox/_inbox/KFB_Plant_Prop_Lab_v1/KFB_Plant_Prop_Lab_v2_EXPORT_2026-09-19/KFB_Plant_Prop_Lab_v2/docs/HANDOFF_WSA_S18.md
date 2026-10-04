# Übergabe an WSA Lead · S18 Crazy-Cat Plant Prop Lab

Stand **2026-09-19**, Revision `2026-09-19-r1`. Vorgänger: `2026-09-18-r1` (S18), überholt
durch die Sichtungsrunde S18.1.

Dieses Dokument ist die Prüfvorlage. Es behauptet nichts, was nicht in `CHANGELOG.md`,
`github.md` oder in einer Messsonde unter `tools/` belegt ist.

---

## 1 · Was zur Abnahme steht

| Gegenstand | Ort | Zustand |
|---|---|---|
| Werkbank | `KFB_Plant_Prop_Lab_S18.html` | AKTIV, drei Ansichten: Erstbeweis · Werkbank · Farbtafel |
| Module | `lib/plant-{inventory,recipe,pattern,rig,eyes,light}.js` | AKTIV |
| geteilter Szenenbauer | `lib/kit-lab.js` | AKTIV · GETEILT von 19 Seiten — Änderungen daran sind projektweit |
| Export | `export/KFB_Plant_Prop_Lab_v1_EXPORT_2026-09-19/` | eigenständig lauffähig, ohne kopierte Modelle |
| Repo-Slot | `tools/plant-prop-lab/` in `georg-doc/kayfabizarro` | war „NO RUNTIME YET" — dieser Check-in füllt ihn |

**Nicht Teil der Abnahme:** Travel-Terrain, Resident-Identität, Game Dev Studio, Asset Registry,
Combat. Der Slot besitzt Pflanzenrequisiten, sonst nichts.

---

## 2 · Der Vertrag in fünf Sätzen

1. **Quellen bleiben unberührt.** Materialien werden vor jedem Eingriff geklont — `instance()`
   klont die Szene, three teilt die Materialien; ohne `clone()` färbt ein Topfmuster jeden Topf
   jeder Szene, inklusive Cache.
2. **Jede Lage ist gemessen**, nicht konstant: Untersetzer-Innenboden, Topfkante, Erdhöhe,
   Kronenbox, Einsetztiefe (0,800 von 1,00 Topfhöhe = 0,20 als Anteil), Alien-Maßstab.
3. **Das Rezept ist die Wahrheit.** Gleicher Seed + gleiches Rezept = gleiche Komposition,
   Rundlauf byte-identisch geprüft (Seed 5150 zweimal deckungsgleich).
4. **Das Rig bewegt Pivots, keine Vertices**, und besitzt keine Weltbewegung.
5. **Leben ist eine Schicht, kein Charakter:** `STATIC | AMBIENT | AWARE`.

---

## 3 · Die vier Entscheidungen, die ein Reviewer kennen muss

**Muster ist Projektion, nicht Atlas.** Korrelation der Topf-UVs mit dem Umfangswinkel:
r = 0,010 / 0,024 (zylindrisch abgewickelt wäre ≈ 1); u-Spanne 0,076–0,670 ist ein
Atlasfenster. Quaternius-UVs sind entartet (`Plant_1`: v 0,105…0,106 = ein Texel). Deshalb
analytische Zylinderprojektion im Shader; der UV-Weg bleibt nur als Vergleichsbild an Bord.

**Erde ist Radius, nicht Höhe.** An `pot_D_large`: Erdkappe flach bei v = 0,85, Radius ≤ 0,55;
Randkranz 0,61…0,73. Eine Höhenschwelle trennt beides nicht, ein Radius schon —
`innerRadius()` = grösster Radius mit nach innen zeigender Normale (0,53) + 12 % = **0,597**.

**Augen sitzen im Netz, nicht davor.** Wirtsradius aus dem 90-%-Quantil der Radien im
Höhenband (108 Vertices bei `pot_D_large`), nicht aus der Boxbreite — die liefert auf einem
konischen Topf den Kranz. `ring` 0,50 · Augenradius 0,23 · `inset` 0,10.

**Kein zweites Augensystem.** `pet-eye-rig.v6.js` per jsDelivr, Mienen aus
`kfb-pet-graft-driver.v4.json`. Der Wirt darf nicht `visible = false` sein (das Rig hängt in
ihm) und hängt in der **unverdrehten** Elternschaft — `PotRoot` trägt die Zufallsdrehung des
Rezepts, ein Gesicht darin blickte 137,5° vom Betrachter weg.

---

## 4 · Clean-Run · 6 Schritte, ca. 4 Minuten

1. `KFB_Plant_Prop_Lab_S18.html` öffnen. Kaltstart baut den Erstbeweis: sechs Kompositionen,
   Nummernmarken, Legende. Konsole: **nur** die `THREE.Clock`-Deprecation-Warnung.
2. Leiste „☰" → **Prüfungen**: Fehlschläge 0 · Musterweg zylindrisch · „UV zylindrisch? nein"
   mit Zahl · Seed-Rundlauf beide Zeilen grün.
3. **AWARE** schalten: Augen sitzen in der Topfwand (nicht davor, nicht schwebend) und folgen
   dem Zeiger. `#eyeReport` meldet `mounted: true` und sechs Mienen aus dem Vertrag.
4. **Erde innen** aus/ein: die Topföffnung wechselt zwischen Muster und Erdfläche. Aus ist der
   Beleg, dass die Erkennung am Radius hängt und nicht am Zufall.
5. **Kontur** von 0 auf 1: jedes Motiv bekommt seine Linie aus derselben Feldrechnung. Keine
   Haarlinien, keine doppelten Kanten.
6. **Rezept** → lesen · bauen · lesen: derselbe Text. **Farbtafel**: vier Kacheln
   (Tag/Abend/Interieur/Nacht), Reihe vollständig im Bild.

Bricht einer dieser Schritte, ist das ein Abnahmefehler und kein Geschmacksthema.

---

## 5 · Was gemessen wurde, in Zahlen

| Messung | Wert | Sonde |
|---|---|---|
| Quellteile geladen und vermessen | 72 / 72, 0 Fehlschläge | `tools/measure-plant-parts.html` |
| Dateiwahrheit | Contents-API (Tree-API listet diese `.gltf` nicht) | `tools/probe-plant-packs.html` |
| UV ↔ Umfang, Töpfe | r = 0,010 / 0,024 | `probeUV()` in `plant-pattern.js` |
| Einsetztiefe | 3,680 − 2,880 = 0,800 = 0,20 der Topfhöhe | Pack-Zwilling |
| Topfkante radial | `pot_C_large` 0,625 vs. `pot_A_large` 0,687 bei Aussenbreite 1,50 | `probeContainer()` |
| Serie | 10 Regenerationen × 10 Seeds, 1–5 Töpfe, 5 Maßstabsklassen: 0 Fehlschläge | Werkbank |
| Rezept-Rundlauf | byte-identisch, Seed 5150 zweimal deckungsgleich | Werkbank |

---

## 6 · Risiken, die der Lead entscheiden muss

1. **Revisionsbindung.** Jedes `PlantRecipe` trägt `revision: "main"`. Ein Rezept ist damit
   gegen einen **Branch** reproduzierbar, nicht gegen einen Stand. Behebung ist eine Zeile in
   `SRC()`; offen ist, **wer den SHA pflegt**. Gleiche Stelle projektweit (`HOUSEKEEPING.md`,
   „Pfad-Hygiene").
2. **`kit-lab.js` ist geteilt.** Wer hier für Pflanzen etwas ändert, ändert 18 andere Seiten.
   Der Sprint-19-Deformer darf daher nichts in `kit-lab.js` schreiben (siehe
   `docs/SPRINT_19_CARTOON_DEFORMER.md`, §Grenzen).
3. **Netzabhängigkeit.** Kein Build, kein Paketmanager — dafür three über unpkg, Modelle über
   `raw.githubusercontent.com`, EyeRig über jsDelivr. Offline läuft nichts.
4. **Lichtkalibrierungen sind visuell beurteilt**, nicht luminanzgeprüft wie in S13.3.

Die vollständige, ungeschönte Liste steht in `docs/BACKLOG_PLANT_PROP.md`.

---

## 7 · Der nächste Sprint, in einem Satz

S19 macht aus der Requisite einen Darsteller: Cartoon-Deformer nach
`skills/kfb-cartoon-animation_v2.md`, Vertrag und Abnahmetore in
`docs/SPRINT_19_CARTOON_DEFORMER.md`. Der Lead entscheidet vor Baubeginn über drei Punkte:
Revisionsbindung (oben, 1), Quellen für Mushrooms/Flowers/Fruits (dort §6) und ob
Charakter-Interaktion („konspirieren") Teil von S19 ist oder S20.
