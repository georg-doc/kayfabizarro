# SESSION CUT · RESIDENT_CLAY_AR_01 · Brief A-R · Resident Atlas S14 · 2026-09-30

## S14b · Nachtrag nach Georgs Sichtprüfung (30.09., M1)

Gemeldet: kahle Bäume mit Artefakten · Gruft zu stark verformt, Flächen fließen zusammen, Lücke über der Tür · Goth Girl: Hintergrund grob, Horizont in der Mulde weg · Friedhof im Diorama mit Habitat 10 fps, ohne 20 fps.

- **Kahle Bäume/Äste**: werden nicht mehr verformt (Name `dead|bare|branch|trunk|…` oder dünner als 12 % der Länge), nur K2. 9 Stücke im Friedhof.
- **Gruft/Häuser**: iters 3, lump 0,006, eine Unterteilungsstufe (vorher 6 / 0,014 / zwei). Die Unterkante wird nur noch gehalten, wenn das Netz selbst auf dem Boden des Eintrags steht. Vorher verrutschten Einzelteile gegeneinander, das war die Lücke über der Tür.
- **Laufflächen (Weg, Kacheln)**: bleiben unverformt. Gemessen gegen den S13-Stand: Die gerundeten Steine wuchsen in die Fugen. 107 Stücke, nur K2.
- **Hintergrund** (`lib/diorama.js`, `terrainV: 2`, nur S14): Randhügel wachsen mit der Szene, Fernhügel sind flacher. Dazu ein Fernring bis 1200, der in Horizontfarbe ausläuft (vorher Himmel unter dem Geländerand) und eine feinere Knet-Spur (Maßstab 0,55, weniger Striche und Dellen). S12/S13 sind unverändert.
- **fps, gefundene Ursache**: Die Friedhofs-Bodenhaftung warf je Figur und Bild drei Strahlen auf das ganze Gelände (40–65k Dreiecke). Das kostete 32 ms CPU pro Bild, auch in S13. Senkrechte Strahlen testen jetzt nur die zwei Dreiecke ihrer Rasterzelle, gleiches Ergebnis. **32 → 1,9 ms.** Das gilt für alle Stände, die `lib/diorama.js` laden.
- **AO nach Stufe**: Hoch = volle Auflösung, 16 Proben. Mittel = halbe AO-Auflösung, 8 Proben, MSAA 2. Niedrig = aus.
- Knetform-Budget 160k, Ausgabe indiziert (`mergeVertices`). Gezeichnete Dreiecke im Friedhof: 80k ohne, 123k mit Knetform (davor 338k).
- ⋯ → Leistung → **Kosten je Schicht**: 20 Bilder je Zustand mit gl.finish, Median. Ergibt ms für AO, Schatten, Knetform und K2 einzeln. Die Zahlen aus der Vorschau hier gelten nicht, sie sind Software-Rendering.
- Neuer Prüfblick „Kahler Baum“. Bilder: `screenshots/s14_ab/s14b_*.png`.
- **Offen**: fps auf dem M1 nicht belegt. Zwei Skelette landen jetzt mit einem Fuß auf einem Wegstein (+9–11 cm) statt in der Fuge (−3 cm). Wahrscheinlich hat die Glättung der Skin-Netze die Sohle verschoben. Belegt ist das nicht.

## Nächstes Gate (ersetzt §5)

Georg, M1: Friedhof → Diorama → fps-Chip und „Kosten je Schicht“, jeweils mit und ohne Habitat. PASS ≥ 50 fps bei Mittel. Sonst sagt die Messung, welche Schicht fällt. Danach der Schatten-Gate-Lauf (9/9).

---

Status: **DESIGN CANDIDATE**, kein Schatten-PASS, kein Integrations-PASS.
Datei: `KFB_Resident_Atlas_S14.html`. S13 und alle früheren Stände sind unverändert. Einzige Änderung in einer gemeinsamen Datei: `lib/atlas.js` hat jetzt einen Render-Hook, ohne gesetzten Hook verhält sie sich wie vorher.

## 1 · Fehler zuerst

1. **Der K1/H0-Router fehlt.** `tools/KFB-ToolBox/docs/CLAYMATION_K1_H0_REFERENCE.md` gibt auf `main` und auf `codex/kfb-production-map-2026-09-29` einen 404 zurück. Gearbeitet wurde deshalb direkt mit dem Code-/Bildpaket `tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/` (README, ASSETS, `clay-soften.v1`, `clay-profiles.v2`, `clay-catalog.v5` AO-Stelle). Den Link in START_HERE sollte der Owner reparieren.
2. **Mehr Dreiecke.** Der erste Lauf hatte ein Budget pro Geometrie. Weil sich Instanzen die Geometrie teilen, stiegen die gezeichneten Dreiecke im Friedhof von 107k auf 1,13 Mio. (×10,6). Jetzt gilt das Budget pro gezeichneter Instanz, mit höchstens zwei Unterteilungsstufen, große Stücke zuerst. Ergebnis: **338k statt 107k** (×3,2, mit Schattenpass). 8 kleine Netze bleiben über dem Budget eckig.
3. **fps nicht belegt.** Die Vorschau hier ist gedrosselt (7–19 fps, egal ob mit oder ohne Knetform). Die `gl.finish`-Messung für AO schwankt zwischen +0,7 und +10 ms pro Bild und ist damit nicht verwertbar. Das 50-fps-Urteil fällt auf dem M1 (⋯ → Leistung → AO-Kosten).
4. **Kein globaler Schatten-Fix.** PR #295 hat keinen integrierten Schattennachweis. Die Licht-Schichten sind ein Prüfbild und keine Reparatur.
5. **Profile weichen vom Donor ab.** Mit den Donor-Werten (`house`/`prop` = iters 8, lump 0,018) lasen die Pfeiler im ersten A/B wie geschmolzene Kerzen. Jetzt gilt: prop iters 5 / lump 0,012, house iters 6 / lump 0,014. Zäune laufen jetzt als prop statt als house. Die Werte sind gesetzt, nicht gemessen.
6. **Residents werden nur geglättet.** `clay-soften.v1` fasst Skin-Netze bewusst nicht an. Die Glättung der Residents (3× Taubin, Normalen je Lage) ist meine Ergänzung, nicht der Donor. Sie hat keine Unterteilung und keine Beulen, und Gewichte und UV bleiben gleich. Harte Kanten wie Hutkrempen und Waffen werden dadurch mit weich.
7. **TinySkies fehlt.** Der Himmel hat weiter nur Aus, Basic und Full (travel-v16). Eine TinySkies-Quelle liegt im Projekt nicht vor. Sie steht nur als Inventar im Travel-Repo (`QUELLE_tinyskies-Inventar.md`).
8. **Motion v5 und Sitzpose.** Die Goth Girl sitzt im Rezept auf dem Hocker. Die v5-Clips sind Standposen, sie steht dann im Hocker. Das ist markiert und nicht behoben.
9. **Screenshots nur mit erzwungenem Bild.** Die verdeckte Vorschau zeichnet nicht fortlaufend. Jedes A/B-Bild wurde deshalb mit `V.draw()` direkt vor der Aufnahme gemacht.

## 2 · Gebaut

- **Knetform K1/H0** (`lib/clay-k1.js`): Die Reihenfolge ist wie in K1: echter Donor, dann Form, dann K2-Material (`lib/diorama.js`, unverändert), dann Fußkontakt. Klassen: Boden/Weg/Kachel (`flat`, Oberkante bleibt), Natur, Haus/Gruft, Requisite (Unterkante bleibt). Die Knetform wirkt nur im Diorama, das Studio bleibt neutral.
- **AO**: GTAOPass wie in `clay-catalog.v5`, Radius und Dicke × Figurenmaßstab (2,3 / 1,2). In der Stufe Niedrig ist AO aus.
- **Licht-Schichten** im Inspektor: Schatten+AO · AO · Schatten · keine · AO-Puffer.
- **Prüfblick**: Füße (echte Fußknochen, eine Figur pro Skelett, 8 Richtungen mit freier Sichtlinie) · Requisite · Baum · Überhang (zuerst die Gruft).
- **Vergleich · Stand S13**: gleiche Kamera, Knetform aus, nur Schatten.
- **Ein Inspektor**: Das ⋯-Popover ist aufgelöst, der ⋯-Knopf öffnet den Abschnitt „Ansicht · Knetform · Licht · Leistung“. Das Menü am Objekt (S13 TUNE) bleibt das einzige Werkzeug am Objekt. Doppelte Schalter für Himmel und Schatten sind entfernt.
- **Motion v5**: Acht Szenenclips (Atmen, Fröhlich, Lachen, Winken, Klatschen, Sprechen, Salutieren, Swing), in-place, Loop, beide Rigs. Sie laden bei Bedarf über „Motion v5 · 8 Szenenclips laden …“ im Clip-Menü der Residents. Goth Girl bindet alle mit 69/69. Tracks auf dem Rig-Knoten werden verworfen. Pinned by branch `georg-doc-patch-3`.
- Unverändert: Friedhof / Dancing Skeletons samt Uhr und Clips, Band, Disco, Sci-Fi, Fight Sandbox, 27 Residents und echte Assets.

## 3 · A/B (identische Kamera, Friedhof, Diorama, Tag, Himmel Basic, Stufe Mittel, Takt 1)

`screenshots/s14_ab/00_sheet.png` · Einzelbilder:
- 01/02 Übersicht A (S13) / B (S14)
- 03/04 Füße A/B · 05 nur AO · 06 nur Schatten
- 07/08 Requisite A/B
- 09/10 Baum A/B · 11 nur AO · 12 nur Schatten
- 13/14 Überhang (Gruft) A/B · 15 nur AO · 16 nur Schatten · 17 AO-Puffer
- 18 Motion v5 · Goth Girl · Atmen

Was man sieht: Kanten der Kacheln und Wegsteine sind gerundet, Gruft und Pfeiler gedrückt statt gefräst, Stiefel und Handschuhe der Residents weich. AO setzt Kontaktdunkel unter Stiefel und in Türnische und Vordach. Den Kontakt über den Rand hinaus zeigt nur der Schatten.

## 4 · Offen

- M1-Messung: fps bei 1280×720 mit Schatten+AO gegen S13.
- Prüfung von Pfeilern und Kacheln bei „Nah“ auf Wiederholung: `seed` wechselt pro Geometrie, nicht pro Instanz.
- Schatten- und Grounding-Gate (S12, 9/9) ist mit der Knetform **nicht neu gelaufen**.
- TinySkies-Donor, Router-Link, Sitzpose-Clips.
- Fight: siehe `docs/RESIDENT_FIGHT_SANDBOX_01/REWORK_BRIEF_BLENDER_WSA.md`. Alle Combos gehen zurück.

## 5 · Nächstes Gate

**Georg auf dem M1:** S14 → Friedhof → Diorama → ⋯. Den Gate-Lauf „Schatten-Gate“ mit Knetform an wiederholen (Ziel wie S12: 9/9) und „AO-Kosten“ messen. PASS nur, wenn 9/9 und ≥ 50 fps. Sonst bleibt die Knetform in Stufe Mittel aus und nur Hoch trägt sie. Das ist eine Entscheidung für Georg und keine Fix-Behauptung.
