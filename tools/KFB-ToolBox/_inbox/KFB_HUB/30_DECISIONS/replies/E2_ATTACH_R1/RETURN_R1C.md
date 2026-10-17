# RETURN · E2_ATTACH_R1 · R1c · Sockel unverändert, nur zurückgezogen · 2026-10-17

Auftrag (Georg nach FAIL R1b): „DER SOCKEL SOLL BLEIBEN WIE ZUVOR, NUR WEITER ZURÜCKGEZOGEN“.

Status: gebaut, gemessen, Bilder selbst gegen die E2-Referenz verglichen. **Georgs Urteil fehlt noch.**
- R1- und R1b-Dateien sind unverändert (sha256 geprüft: `proof.html` 65ef5ec6…, `clay-skin-attach.v1.js` 9a22279a…, `proof_r1b.html` 40e97036…, `clay-skin-attach.v2.js` cd974f41…).
- `RETURN.md` ist ebenfalls unangetastet.
- Kein Push. Verwendet wurde der laufende Server http://localhost:8765/; kein eigener gestartet.

## Was R1c ändert (und was nicht)
- `proof_r1c.html` ist eine Kopie von `proof.html` (R1) mit genau **einer** neuen Knopfreihe „Sockel zurück“: 0 · 0,10 · 0,20 · 0,30 · 0,40 R. Alle R1-Knöpfe bleiben, wie sie waren. Keine Schilder, keine weiteren Modi.
- **Sockel:** die eingebackene Sockel-Teilfläche aus der r4-GLB, in Form, Radius, 58°-Öffnung und Rollrand unverändert.
  - Sie wird starr um −d·R entlang der Blickachse des Auges verschoben. Jeder Vertex wandert um denselben Vektor.
  - Der Versatz wird über die Skin-Transformation jedes Vertex in die Bind-Raum-Positionen der Sockel-Primitive geschrieben. Er hängt damit am Stielknochen und geht mit, wenn der Stiel schwingt.
  - Kein Clipping, kein Neubacken, kein anderer Winkel.
- **Auge:** Mitte, Größe und Passung exakt wie R1. `clay-skin-attach.v1.js`, kein eyeForward. Passung nach Rezept: Hunky s 0,97337, Dory s 0,89676.
- **Stiel:** nicht angefasst. Aber: Bei Hunky gehören 1 301 Vertices des Stielansatzes (Loft) zur Sockel-Teilfläche und wandern mit (siehe Befund 3).
- Messung: `proof_r1c.html?measure=r1c` → `evidence/measure_r1c.json`.

## Werte je d
R = Augenradius des Wirts. Hunky: beide Augen gemessen, Werte identisch. Sichtbar = Fläche mit Sockel ÷ Fläche ohne Sockel, Pixel aus WebGL, Kamera 8 R vor dem Auge. Augapfel bei Lid c = 0, Lid bei 50 %.

| d (R) | Sockel-Vorderkante vor dem Augenäquator: Hunky / Dory | Augapfel sichtbar vorn / ¾ (Hunky; Dory ±0,02) | Lid 50 % sichtbar vorn / ¾ (Hunky; Dory ±0,02) | Lidhaut durch die Schale | Augapfel durch die Schale |
|---|---|---|---|---|---|
| 0 (= R1) | 0,658 / 0,627 | 92 % / 70 % | 55 % / 39 % | nein | nein |
| 0,10 | 0,558 / 0,527 | 90 % / 73 % | 72 % / 69 % | **ja**, bis 0,043 R, bei 59–88° | nein |
| 0,20 | 0,458 / 0,427 | 91 % / 77 % | 92 % / 88 % | ja, bis 0,086 R, bei 63–93° | nein |
| 0,30 | 0,358 / 0,327 | 95 % / 83 % | 95 % / 93 % | ja, bis 0,12 R, bei 69–97° | Dory ja (0,01 R, 74–76°); Hunky nein |
| 0,40 | 0,258 / 0,227 | 99 % / 88 % | 97 % / 96 % | ja, bis 0,14 R, bei 75–100° | ja: Hunky 0,023 R (75–82°), Dory 0,033 R (75–85°) |

Lesehilfe:
- Pupillenscheitel des Auges: Hunky 0,977 R, Dory 0,900 R vor der Augenmitte; ändert sich nicht mit d.
- Die Winkel zählen von der Blickachse (0° = vorn, 90° = seitlich am Auge).
- Pupille bei Lid zu: 0 px in 8 Ansichten, bei jedem d.

## Befunde
1. **Durchstoß beginnt schon bei d = 0,10, und zwar vorn-seitlich, nicht hinten.**
   - Die Schale ist eine Kugel um die Augenmitte. Zieht man sie zurück, kommt ihr vorderer Teil näher an das Auge, ihr hinterer Teil weiter weg. Hinten stößt deshalb nichts durch.
   - Die Lidhaut (außen 1,094 R) steht ab d = 0,10 am vorderen Teil der Schale heraus, 59–100° von der Blickachse.
   - Sichtbar ist das in der Seitenansicht als Stufe bzw. zweiter Kugelbogen vor der Schale (`compare_d0_vs_d0.4_side_threeq_r1c.png`, `r1c_views_r1c/d0.2_half_side_r1c.png`). Von vorn und ¾ fällt es kaum auf, weil Lid- und Sockelfarbe gleich sind.
   - Der Augapfel selbst stößt ab d = 0,30 (Dory) bzw. 0,40 (Hunky) seitlich durch, bei 75–85°.
2. **Der Rollrand schneidet die Haut.** Der eingerollte Rand schneidet schon bei d = 0 die Lidhaut (Hunky bis 0,06 R, wie in R1). Mit d wird das tiefer: Hunky bei d = 0,40 bis 0,22 R in der Haut und 0,10 R im Augapfel. Von vorn wirkt der Ring dadurch dünner, weil er zum Teil hinter Auge und Haut verschwindet.
   - Dorys Zahlen dazu sind nicht belastbar. Ihre Sockel-Teilfläche hat schon bei d = 0 innen liegende Vertices bis 90°, die die Zellmessung mitzählt.
3. **Hunkys Stielansatz:** Der Loft vom Stiel zur Schale (1 301 Vertices) ist Teil der Sockel-Primitive und wandert starr mit.
   - Ab d ≈ 0,20 entsteht hinten oben am Übergang zum Stiel eine sichtbare Beule bzw. Stufe (Seitenansicht).
   - Der Stiel selbst ist unverändert.
   - Bei Dory liegen alle Sockel-Vertices innerhalb 1,6 R. Dort sehe ich keinen Ansatzfehler; ihre Antennenkugel verdeckt die Stelle in der Seitenansicht allerdings teilweise.
4. **Lid bei zu, von vorn:** Ab d = 0,20 ist der Rollrand von vorn nicht mehr zu sehen. Das geschlossene Auge liest als eine Kugel mit Lidspalt (`sheet_closed_r1c.png`).

## Vergleich mit der Referenz (E2_approved_closed_lid_skin.png)
Geprüft in Ruhe, 50 % und zu, jeweils vorn, ¾ und seitlich, für jedes d (`sheet_{rest,half,closed}_r1c.png`, Einzelbilder in `evidence/r1c_views_r1c/`).
- Das Lid ist bei jedem d die E2-Haut: dünne geschlossene Haut, Lidspalt als einzige Öffnung, runde Lippe, Spalt bei zu als feine Naht.
- Es gibt keine v6-Schale, genau eine `lid_skin` je Auge. Ab d = 0,20 sieht man von vorn und ¾ deutlich mehr Lid (50 %: 92 % statt 55 %).
- Abweichung von der Referenz: Seitlich steht ab d = 0,10 die Lidhaut vor der Sockelschale heraus. In der Referenz gibt es keine Sockelschale, deshalb ist das ein Sockelproblem, kein Problem der Lidform.
- Nicht behoben, wie verlangt. Die Abwägung (Sichtbarkeit gegen Durchstoß seitlich) entscheidet Georg.

## Dateien
- `proof_r1c.html` (neu, sha256 9a9a3b9a…)
- `RETURN_R1C.md` (neu)
- Evidenz `evidence/*_r1c*`:
  - `measure_r1c.json`
  - `sheet_rest_r1c.png`, `sheet_half_r1c.png`, `sheet_closed_r1c.png` (Zeilen d = 0…0,40; Spalten vorn / ¾ / seitlich, je Hunky | Dory)
  - `r1c_views_r1c/d{d}_{rest|half|closed}_{front|threeq|side}_r1c.png` (45 Einzelbilder)
  - `compare_d0_vs_d0.4_side_threeq_r1c.png`
  - `test_clay-skin-attach_r1c.txt` (89/89, v1 unverändert), `test_clay-eyelid-skin_r1c.txt` (103/103)

Proof: http://localhost:8765/proof_r1c.html (Startwert z. B. `?back=0.2`).

## Nicht geprüft
- Georgs Urteil.
- Stielschwingen (Dangle) und Clips: Der Versatz liegt im Bind-Raum und folgt den Skin-Gewichten, ist aber nur in der Bindungspose gerendert.
