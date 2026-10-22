# KFB Island Placement Grammar R1 · Spec für WSA / MVP

Status: **SPEC · für die MVP-Integration in WB2**
Prüfstand: KFB Island Worldbuilder Lab (lokal, `http://127.0.0.1:5192`), wo Georg jedes Ergebnis direkt sieht.
Frozen-Matrix-Bezug: **F-R22** (authored composition, not random scatter), **F-R23** (grounded placement / no pasted-on props), dazu F-R26 (Wasser/Kante).

## Ziel

Natur, Steine und Requisiten werden nach Regeln **komponiert und geerdet**, nicht auf die Insel geworfen. Die Formen liefert das Claude-Design-Kit (`BRIEF_CLAUDE_DESIGN_NATURE_WATER_LANDMARK_KIT_R1.md`). Diese Spec regelt, **wo und wie** sie stehen.

## 1 · Zonen pro Insel

Jede Insel wird vor jeder Platzierung in Zonen geteilt. Grundlage ist der signierte Abstand zur Kante (`sd`) und die Landmarke.

| Zone | Lage | Inhalt |
| --- | --- | --- |
| Landmarke | Fußabdruck + Vorplatz in Blickrichtung | nichts außer Landmarke und Vorplatz |
| Freifläche | ≥ 30 % der Fläche, vor der Landmarke | höchstens Gras, Kiesel; hält den Blick frei |
| Wege | Bett ± halbe Wegbreite + 1,5 m | nur Weg-Begleiter (Steine, Laternen) |
| Kern | `sd` > 0,35 R, außerhalb der obigen | Hauptgruppen |
| Übergang | 0,12 R < `sd` < 0,35 R | kleinere Gruppen, Büsche, Steine |
| Rand | `sd` < 0,12 R | 2–4 Steine oder Pflanzen auf der Kante, die die Silhouette brechen |
| Wasser | Becken + Ufer | Uferpflanzen; im Becken nur Wasserpflanzen |

## 2 · Biom-Logik

- Jede Insel hat **ein Haupt-Biom** (Palette und Artenliste) und darf ein **Neben-Biom** haben, mit weichem Übergang (Punktübergänge `kfbBlend` / `kfbLayer` wie im Visual-Terrain-Lab).
- Pro Biom eine Artenliste mit Gewichten. Beispiel Pyramiden-Wüste: Palme 0,5, Dattelbusch 0,3, Kaktus 0,2; Steine Sandstein.
- Arten folgen dem Gelände: Palmen und Schilf ans Wasser, Nadelbäume an Hänge, Büsche in Senken.

## 3 · Gruppen

- **Rule of Three** als feste Grammatik: ein Anker (größte Art, Skala 1,2–1,4), zwei bis drei Stützen (0,7–0,9), ein Akzent (Stein oder Blühpflanze).
- 2–4 Gruppen pro Insel. Abstand innerhalb einer Gruppe 2–6 m, zwischen Gruppen mindestens 12 m.
- Keine Einzelgänger im Kern. Einzelne Elemente nur am Rand oder als Weg-Begleiter.
- Größenstaffel über die ganze Insel: wenige große, mehr mittlere, viele kleine Elemente.
- Die Landmarke bleibt das höchste Element: Kein Baum vor ihr ist höher als 60 % ihrer Höhe.

## 4 · Erdung (Etherington)

Drei Techniken, damit nichts aufgeklebt wirkt (Quelle: Etherington Brothers, im KFB-Style-Reference-Pool zu verifizieren):

1. **Eingraben:** Der Fuß jedes Objekts sinkt 5–15 % seiner Höhe ein. Bei Hanglage richtet er sich nach der tiefsten Stelle.
2. **Kontakt:** Kontaktschatten (AO) und ein Ring Bodenfarbe am Fuß, sodass Objekt und Boden farblich ineinander übergehen.
3. **Überlappen:** Kleine Elemente wie Grasbüschel, Kiesel und Schutt überlappen den Fuß, 3–8 Stück je Objekt, kleiner als 15 % seiner Größe.

Gilt für Bäume, Steine, Gebäude, Fahrzeuge und Requisiten. Fahrzeuge und Gebäude stehen auf dem unvertieften Boden, nie im Wegbett.

## 5 · Wasser in der Platzierung

- Wege führen um Becken herum und enden am Ufer, nie im Wasser (im Lab umgesetzt).
- Uferzone: Schilf, Steine, Palmen (Strand). Nichts im Wasser außer Wasserpflanzen und Stegen.
- Fluss bis zur Kante: Am Überlauf bleiben 3 m frei, damit Wasserfall oder Tropfen lesbar sind.

## 6 · Prüfung

Messbar je Insel, im Lab als Funktion `__kfb.measure(id)` erweiterbar:

- Anteil Freifläche ≥ 30 %.
- 2–4 Gruppen erkannt, keine Einzelgänger im Kern.
- Kein Objekt schwebt: Abstand Fuß zu Boden ≤ 0.
- Kein Objekt im Wegbett oder im Wasser, außer erlaubten Typen.
- Landmarke höchstes Element in ihrem Sichtfeld.
- Georg-Blick auf dem Prüfstand: PASS oder FAIL.

## 7 · Integration

- Das Platzierungsergebnis wird pro Insel als **Recipe** gespeichert: Seed + Regeln + manuelle Overrides von Georg. Es wird nicht als festes Objektlager gespeichert. Passt zu Base Recipe → Authoring Override aus der Frozen Matrix.
- Georg kann im Editor jede Gruppe verschieben, löschen oder neu würfeln. Seine Änderungen überleben eine Neugenerierung.
- Für WB2: dieselben Regeln, dieselben Assets aus dem Claude-Design-Kit; der Worldbuilder bleibt die Referenz-Implementierung, an der WSA prüft.
