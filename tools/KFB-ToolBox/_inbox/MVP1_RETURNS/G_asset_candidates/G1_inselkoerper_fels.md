# G1 · Asset-Kandidaten MVP-1 · Inselkörper und Fels (Runde 1)
Stand: 2026-10-10 · **Quelleninventur, noch keine visuelle Freigabe** · `kfb.asset-candidates/1`

## Ergebnis
**Town-Plateau:** StreakByte Port-Land `Floting Base.fbx` ist derzeit A-Kandidat **nur für eine isolierte Sichtprüfung**, keine produktive Freigabe. Vier weitere vorhandene Basiskörper sind aufgelistet. **Protopia-Berginsel:** keine einzige der fünf nachgewiesenen Quellen hat bisher eine bestätigte, schmale hohe Gesamt-Silhouette bei gleichzeitig begehbarer Oberseite. Die Höhe lässt sich evtl. durch vorhandene StreakByte-Basis plus `Mountain.fbx` erzielen, aber das ist noch **unbewiesen**.

**Quelle/Qualität:** StreakByte wurde im privaten Dropbox-Original lokalisiert (nur Namen/Referenzen hier, keine Dateien veröffentlicht). Für Port, River, Backyard, Forest, Pond, Cave und Ice existieren historische Messungen, auf W=60 normiert, inklusive Dreieckzahl; dies ist **keine** K2-H-Boundingbox-Messung. Kenney/KayKit/Quaternius/Platformer wurden in der vorhandenen Repo-Registry auf dem benannten Sync-Branch nachgewiesen. Einzelmodelle **nicht** in 3D isoliert gezeigt; die Scores sind beschaffungsorientierte Vorbewertungen, keine §00/§01- oder Q1–Q9-PASS.

**Wichtig:** Die älteren Messdaten sagen für manche StreakByte-Basen 5–34 Zapfenspitzen. Das ist Anatomie-Evidenz, aber **kein** Freibrief für lange angehängte „Würste“; die aktuelle G1-Vorgabe verlangt einen massiven, alternden Erdkörper mit gerundeter Bruchkante und einem lesbaren Plateau. Diese Diskrepanz gehört in den visuellen A/B-Vergleich.

## Maßstab / Klassifikation
1 H = KayKit-Medium-Figur; 1 MC = 1,76 H. Town-Ziel **40 MC = 70,4 H Breite**; Protopia **20–28 MC = 35,2–49,3 H**. Native FBX/GLB-Boundingbox-Werte wurden nicht gemessen. Ein konkreter Faktor `targetWidthH/sourceWidthH` kann erst nach dem Import angegeben werden; bis dahin wäre eine Zahl erfunden. Bei anderen Teilen gelten die im Blatt genannten **Ziel-Höhen**, keine behaupteten Asset-Maße. Polygonangaben für gemessene StreakByte-Basen zählen *Dreiecke*, für die anderen Kandidaten `null`.

Ranks: **A** = zuerst isoliert prüfen, **B** = alternative Quelle, **C** = derzeit eher Form-/Materialvorlage. Keiner dieser Ranks ist Georgs `picked`.

## Kandidaten nach Element

### KFB Town · breites ruhiges Plateau (`town_plateau_island_body`)
**K2-Ziel:** 40 × 40 MC ≈ 70,4 × 70,4 H; Inselunterseite soll Volumen zeigen, Breite nach Lab-Norm W=60, tatsächliche H-Skalierung offen.

| Rang | Modell | Format / Dreiecke | Einschätzung / Hauptrisiko |
|---|---|---|---|
| A | Floting Base · StreakByte (gekauft, privat) | fbx / 1585 | §00 Schollen-Diorama als fertiger Körper plausibel; §01 dicke Unterseite laut Originalmessung (Tiefe 0,43 W), Kanten/Material noch nicht isoliert; Maßstab/Umfärbung offen. **Risiko:** Hafen-Topologie/6 Tiefpunkte; kein Town-Layout übernehmen, darf nicht nach Hafen aussehen. |
| B | Backyard Base · StreakByte (gekauft, privat) | fbx / 700 | §00 ruhiger Garten-Erdkörper als Donor; §01 Untertiefe 0,51 W, Platte 0,037 W; Material und Rand-Krempe noch visuell zu prüfen. **Risiko:** 22 Unterseiten-Spitzen; für Town ggf. zu kleinteilig. |
| B | Floting Base_1 · StreakByte (gekauft, privat) | fbx / 1156 | §00 breiter Erdschollen-Donor, §01 Untertiefe 0,44 W bei nur 2 Spitzen; durchgehende Plattformform prüfen. **Risiko:** River enthält zweite flache Basis; Zuordnung des gemessenen river1 zum FBX 1 noch im Lab verifizieren. |
| C | Base · StreakByte (gekauft, privat) | fbx / 576 | §00 organische Scholle; §01 Untertiefe 0,51 W, 34 Tiefpunkte; Struktur als Anatomie-Vorlage. **Risiko:** 34 Zapfen widersprechen gewünschter ruhiger Town-Unterseite; nur Referenz bis Isolationsprüfung. |
| C | Pond Base · StreakByte (gekauft, privat) | fbx / 2402 | §00 Rundplateau mit deutlicher Schollenmasse; §01 Untertiefe 0,52 W, fast keine Plattenstärke. **Risiko:** Teich-Einsenkung/27 Zapfen möglicherweise nicht Town-kompatibel; keine Bebauung im Donor. |
**Georgs Wahl:** noch offen (`picked: null`).

### Protopia · schmale hohe Berg-Scholle (`protopia_steep_island_body`)
**K2-Ziel:** 20–28 MC Inselbreite ≈ 35,2–49,3 H; klar höheres Relief als Town, trotzdem begehbares Farm/Workshop-Plateau.

| Rang | Modell | Format / Dreiecke | Einschätzung / Hauptrisiko |
|---|---|---|---|
| B | Snow Base · StreakByte (gekauft, privat) | fbx / 9991 | §00 echter schwebender Vollkörper; §01 Untertiefe 0,46 W; ausgerechnet Höhenprofil/steile Oberseite ungeprüft. **Risiko:** 13 Unterseiten-Spitzen; Eis/Snow-Farben ersetzen; 9.991 Tris liegen im Teilbudget, aber kein Nachweis schmaler Silhouette. |
| B | Cave Land base · StreakByte (gekauft, privat) | fbx / 1615 | §00 Höhlen-/Felsinsel könnte Schollenbruch sichtbar machen; §01 Untertiefe 0,43 W. **Risiko:** Topologie möglicherweise breites Plateau; 5 Unterseiten-Spitzen und Dungeon-Assoziation prüfen. |
| C | Mountain · StreakByte (gekauft, privat) | fbx / offen | §00 markanter Berg als AUFSATZ auf eine Inselbasis, kein eigener Schwebekörper; §01 Höhenkontur zu isolieren. **Risiko:** Keine tragende Unterseite: nur kombinierter Entwurfsdonor mit vorhandener Basis, nicht direkte vollständige Insel. |
| C | [mountain_B_grass](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/mountain_B_grass.gltf) | gltf / offen | §00 gestufter Berg als Formenreferenz; §01 wahrscheinlich Raster-/Hex-Logik zu hart, Recolor-Atlas hilfreich. **Risiko:** Nicht als komplette Insel benutzen; Hex-Schnittflächen, Stiladaption. |
| C | [RockPlatform_Tall](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/Platformer%20Game%20Kit%20-%20Dec%202021/Nature/glTF/RockPlatform_Tall.gltf) | gltf / offen | §00 schmale hohe Felsplattform als Proportionsreferenz; §01 keine belegte schwebende Erd-Unterseite. **Risiko:** Asset ist isolierter Platformer-Fels, kein Farm-Berg mit zusammenhängendem Grundkörper. |
**Georgs Wahl:** noch offen (`picked: null`).

### Kleine Brocken / Brückenpfeiler (`small_bridge_pier_rocks`)
**K2-Ziel:** Einzelbrocken nach Funktion grob 1–4 H; Sockel/Brückenauflager vor Ort bemessen.

| Rang | Modell | Format / Dreiecke | Einschätzung / Hauptrisiko |
|---|---|---|---|
| B | Rock_1 · StreakByte (gekauft, privat) | fbx / offen | §00 Felsbrocken aus derselben Erdschollen-Familie; §01 Rand, Tiefe und Material noch isolieren. **Risiko:** Geometrie/Polyzahlen für einzelnes Rock_1 nicht gemessen, FBX-Import. |
| B | Big Rock · StreakByte (gekauft, privat) | fbx / offen | §00 größerer Brückenanker; stilistischer Anschluss an StreakByte-Base denkbar. **Risiko:** Kontaktfläche/Bodenauflage unbekannt; keine schwebende Stütze ohne tatsächlichen Kontakt. |
| B | [rock_largeA](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/rock_largeA.glb) | glb / offen | §00 neutraler breiter Stein als erdiger Fuß; §01 voraussichtlich grobe stilisierte Facetten, K2-Faktor offen. **Risiko:** Form kann zu facettiert gegenüber Clay wirken. |
| C | [rock_single_B](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/rock_single_B.gltf) | gltf / offen | §00 kleine Steineinlage; §01 Kanten/Atlas kompatibel zum KayKit-Umfeld. **Risiko:** Zu klein für tragendes Brückenfundament; Vergrößerung muss visuell bestehen. |
**Georgs Wahl:** noch offen (`picked: null`).

### Felswand / Schollenabbruch (`cliff_rupture_wall`)
**K2-Ziel:** Felswand je Segment 2–8 H; Übergang oben nahtlos an Plateau, unten an Erdmasse.

| Rang | Modell | Format / Dreiecke | Einschätzung / Hauptrisiko |
|---|---|---|---|
| B | [cliff_large_rock](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/cliff_large_rock.glb) | glb / offen | §00 natürliche Felswand; §01 vorhandenes Einzelmodul für Bruchkante; Farben voraussichtlich direkt materialseitig. **Risiko:** Gerasterte Wiederholung und sichtbare Segmentnähte bei großen Strecken. |
| B | [cliff_diagonal_rock](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/cliff_diagonal_rock.glb) | glb / offen | §00 diagonaler Flankenbruch zur Silhouettenvariation; §01 exaktes Mesh noch isolieren. **Risiko:** Sichtbare gerade Anschlusskante, Kontaktflächen prüfen. |
| C | [cliff_top_rock](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/cliff_top_rock.glb) | glb / offen | §00 Kantenabschluss; §01 an Schollenkörper erst nach Source-Isolation anpassen. **Risiko:** Schmale Platte/Krempe droht, keine generische Bordkante erzeugen. |
| C | Cave Land base · StreakByte (gekauft, privat) | fbx / 1615 | §00 kompletter Cave-Körper als anschauliche Bruchflächen-Vorlage; §01 Querschnitt und Kanten prüfen. **Risiko:** Kein separates Segment; ohne Bearbeitung keine modulare Felswand. |
| C | [cliff_blockSlope_rock](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/cliff_blockSlope_rock.glb) | glb / offen | §00 Hang-/Abrissform als Segment; §01 Stil und Skalierung in Diorama prüfen. **Risiko:** Block-/Raster-Anmutung; nur mit Unregelmäßigkeit und Seam-Blending. |
**Georgs Wahl:** noch offen (`picked: null`).

### Große Felsen (`large_boulders`)
**K2-Ziel:** Zielgröße 1–3 H je Solitär; Quelle vorher als Einzelobjekt isolieren.

| Rang | Modell | Format / Dreiecke | Einschätzung / Hauptrisiko |
|---|---|---|---|
| A | [rock_largeA](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/rock_largeA.glb) | glb / offen | §00 glaubhafter großer Fels als isolierter Natur-Prop; §01 wenig Formdetails, wohl leicht umfärbbar. **Risiko:** Erst nach Isolationsansicht und bbox/triangle check final A. |
| B | [rock_largeC](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/rock_largeC.glb) | glb / offen | §00 zweite Silhouette ohne Kopiermuster; §01 Material/Schatten und H-Skalierung zu prüfen. **Risiko:** Gleiche Familie darf nicht in gleicher Rotation wiederholt werden. |
| B | [Rock_1_A_Color1](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_1_A_Color1.gltf) | gltf / offen | §00 KayKit-kompatible zweite Stilfamilie; §01 Atlas-Farbrollen gut anschlussfähig. **Risiko:** KayKit-Varianten können repetitiv und zu idealisiert erscheinen. |
| B | Rock_4 · StreakByte (gekauft, privat) | fbx / offen | §00 Fels aus gleicher handmodellierter Insel-Familie; §01 Farb- und Kantenprüfung offen. **Risiko:** FBX statt GLB; Polygonzahl/Einzelmaß unbekannt. |
| B | [Rock_1](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/Ultimate%20Nature%20Pack%20by%20Quaternius(1)/FBX/Rock_1.fbx) | fbx / offen | §00 handgefertigter Naturfels; §01 simpler Rock-Donor, offene Materialzuordnung. **Risiko:** Quaternius-Stil muss gegen KayKit/K2 und Recolor geprüft werden. |
**Georgs Wahl:** noch offen (`picked: null`).

### Felsgrate / markante Bergsporne (`rock_ridges`)
**K2-Ziel:** Relief 5–12 H relativ zur Figur; als Silhouette erkennbar, unten mit bestehendem Schollenkörper verschmelzen.

| Rang | Modell | Format / Dreiecke | Einschätzung / Hauptrisiko |
|---|---|---|---|
| B | Mountain · StreakByte (gekauft, privat) | fbx / offen | §00 markante Höhenform aus StreakByte-Original; §01 gerundete Modellierung noch nicht isoliert. **Risiko:** Eisfarbe und winterliche Form; als Relief, nicht selbsttragende Insel. |
| C | [mountain_A](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/mountain_A.gltf) | gltf / offen | §00 kompakter Bergsporn; §01 KayKit-Kanten/Atlas als Formsprache-Donor. **Risiko:** Hex-Basis/rasterartige Böschung; keine fertige Schollenkante. |
| C | [mountain_C](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/nature/mountain_C.gltf) | gltf / offen | §00 alternative Gratkontur für Silhouetten-Mix; §01 Material vereinheitlichbar. **Risiko:** Als repetitive Mountain-Tile-Familie deutlich sichtbar. |
| C | [RockPlatforms_Large](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/Platformer%20Game%20Kit%20-%20Dec%202021/Nature/glTF/RockPlatforms_Large.gltf) | gltf / offen | §00 zerklüftete Plattform als Felsschulter; §01 Tragflächen-/Proportionstest nötig. **Risiko:** Platformer-Stufen statt organischer Grat; nur als Formvorlage. |
| C | [cliff_blockSlopeWalls_rock](https://github.com/georg-doc/kayfabizarro/blob/sync/lab-rkit-2026-10-09/media/3D_Assets/kenney_nature-kit/Models/GLTF%20format/cliff_blockSlopeWalls_rock.glb) | glb / offen | §00 Hang-/Grat-Teilstück mit hoher Kante; §01 einfachen Mesh-Baukasten ggf. retopologisieren. **Risiko:** CAD-/Block-Look, Nahtbildung und Repeat-Gefahr. |
**Georgs Wahl:** noch offen (`picked: null`).

## Quellen und fehlende Nachweise
- [G1-Datenblatt JSON](G1_inselkoerper_fels.json). Enthält **30** quellengelistete Kandidaten aus sechs Elementgruppen; private Paid-Pack-Dateien werden nicht verteilt.
- Private StreakByte-Dateinamen: `Low Poly Floating Islands / Models/{LPFI_PortLand,LPFL_BackyardLand,LPFL_ForestLand,LPFL_RiverLand,LPFL_PondLand,LPFL_PirateCave,LPFL_Iceland}`. Historische Messung: `KFB Island Worldbuilder Lab/docs/ISLAND_ANATOMY_RULES.md`, `tools/out/measure.json`. Die FBX-Namen in der Dropbox-Struktur wurden geprüft; Dreieckzahlen der Teilmeshes und skalierte Proportionsfaktoren nicht.
- Offizielle Lizenzbelege: [Kenney Nature Kit](https://kenney.nl/assets/nature-kit), [KayKit Medieval Hexagon](https://kaylousberg.itch.io/kaykit-medieval-hexagon), [Quaternius Ultimate Nature](https://quaternius.com/packs/ultimatenature.html). StreakByte-Lizenz ist privat/gekauft, Weitergabe nicht freigegeben.
- **Noch nicht vorhanden:** Einzelobjekt-Render aus 3/4, Front, Seite, Unterseite; überprüfte Preview-URLs; FBX-Konvertierung; Asset-bbox in H; unabhängiger 20k-Triangle-Test für Einzelteile; farbrollentreue Materialprobe; neue Bildgenerierung/GoldenRef.
- Weder der komplette StreakByte-Demoschauplatz noch ein synthetisch zusammengerechneter 3D-Körper ist schon als Island-MVP-Bauelement akzeptiert.

## Nächster genau ein Schritt
**Town-Basisobjekt `LPFI_PortLand/Floting Base.fbx` isoliert als Quellobjekt präsentieren** (Front, 3/4, Seite, Unterseite) und gegen `Backyard Base.fbx` abgleichen; dabei die native bbox/H-Skalierung, Schollenrand, Unterseiten-Spitzen und Farbflächen prüfen. Erst danach ggf. Referenzbilder/Golden bauen und Georg eine belastbare Auswahl vorlegen.
