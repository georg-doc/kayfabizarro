# WSB_JETPACK_TWIN_R1 · Jetpack Twin R1 (Georg 14.11., V-1734) · RETURN

WSB (Mac mini), 14.11.2026. Brief `30_DECISIONS/replies/WSB_JETPACK_TWIN_R1/BRIEF_WSB_JETPACK_TWIN_R1.md`.
- Vorlage: `MeshyModels/KFB JetpackTwin/` (Konzeptblatt und HUD-Icon).
- Spielcode unverändert, nichts gepusht.
- Vertrag: **`jetpack.contract.twin.r1.json`** (Stand r1b, Format wie rocket03.r7).

## Ergebnis
**Bau** (`scripts/twin_bau.r1b.py`; Raum und Bausteine wie Rocket, jp_lib/form_lib):
- Zwei Tanks: Sand-Knete, Kuppel mit runder Schulter, Kragen, Hals und Düsenglocke, innen dunkel.
- Rote Bänder mit Messingnieten, je zwei Nieten oben auf dem Tank.
- Zwei gerippte Schlauchbögen vom inneren Tankkopf über die Schulter nach hinten, mit Messingmuffen.
- Manometer mit Messingrand, Zifferblatt, rotem Feld, Zeiger und Glasring, Messing-Verbinder zu den Tankköpfen.
- Rückenplatte geskinnt; Längs- und Quergurt, Messingschnalle.
- Zwei Düsen-Anker `KFB_Thrust_L` und `KFB_Thrust_R` (lokal +Z = Schub).
- Materialzonen getrennt (11 Materialien). 37 Knoten, rund 25 500 Dreiecke.

**Lieferung:**
- `glb/KFB_Jetpack_Twin.r1b.glb`: starr, Wurzel `KFB_Jetpack_Twin` ohne Eigenlage, Q-080 0 mm.
- `glb/KFB_Jetpack_Twin_Platte_FB.r1b.glb`: Platte geskinnt, spine 0,67 / chest 0,27 / hips 0,05.
- Teileliste `data/teile_twin.r1b.json`.

**Sitz wie Rocket R7:**
- spine, z 0,95, Größe 1,8125, Neigung 5,74°.
- `seat_gross['fb-broad']` ist identisch mit der R7-Matrix (Abweichung 0).
- Kein Gelenk, keine neue Mechanik.

## Prüfung
39 FB-Clips, die im Spiel laufen (`data/messung_twin.r1b_g95.json`):
- Ruhe-Pool, Gehen, Laufen, Springen, Schleichen, Ducken, Tänze
- Pistolenhaltung und Schuss, Gatling-Haltung
- alle 9 Jetpack-Flug-Clips
- haltung=r1 (gebackene Clips aus assets/wsb-haltung-r1 @4ced9ade)

| | R7-Lage (Lieferung) | Toleranz z 0,82 |
|---|---|---|
| Ruhe | Kopf, Ohren und Arme 0, Spalt p90 0,39/0,26 cm | 0 · 0,48/0,39 cm |
| Gehen, Springen, Idles | frei (drunk-Idle 0,4) | frei |
| Laufen | 0,15 cm | frei |
| Schleichen | 1,4 cm (Platte; Georg: erlaubt) | frei |
| Flug Schweben, Landen | 0,1 cm | frei |
| Flug cruise, bank, climb, brake | 3,4–4,7 cm (Schlauch) | frei |
| Flug boost, dive | 6,7 / 7,3 cm | 1,8 / 2,4 cm |
| Ohren | in keinem Clip | in keinem Clip |
| Spalt Platte–Rücken p90 max | 0,50 / 1,08 cm (R7: 0,56/1,24) | 0,66 / 0,69 |
| Schwanz sichtbar Ruhe / Gehen min | 63–67 % / 50 % | 39–46 % / ~25 % |
| Arme | Laufen 0,6–1,0 cm, Samba 3,8 | Samba 3,8 |

**Referenz Rocket R7 in denselben Flug-Clips:** cruise 7,7, boost 10,2, dive 10,8 cm (`data/messung_rocket_r7_flug_referenz.json`; im R7-Vertrag nie gemessen).

## Widerspruch und Toleranz (an Georg über WS0, V-1528)
**Widerspruch:** Bei R7-Lage senkt FB in den Flug-Clips den Hinterkopf bis auf die Oberkante jedes Packs. Auch Rocket R7 steckt dort tief im Kopf.

**Beim Twin geprüft:**
- Schlauchhöhe 0,078 / 0,05 / 0,035 / 0,022: Auch ganz flach treffen im dive noch Schlauch, Manometer und Tankköpfe.
- Sitzhöhen 0,88 / 0,82 / 0,76.

**Vorschlag ohne Mechanik:**
- (A) R7-Lage wie geliefert. Die Flug-Überdeckung ist kleiner als bei Rocket R7, Sitz und Schwanz entsprechen dem Konzeptblatt.
- (B) Sitz z 0,82. Der Flug ist frei bis auf boost/dive; der Schwanz ist schlechter sichtbar, das Pack sitzt tiefer als auf dem Konzeptblatt.
- (B) liegt fertig bei: `glb/*.r1b_z082.glb`, im Vertrag unter `toleranz_vorschlag.twin_z082`.
- **Empfehlung WSB: (A).**

## Abweichungen vom Konzeptblatt (bewusst, mit Grund)
- **Schlauchbögen niedriger** (≈ 0,05 statt ≈ 0,07 über dem Tankkopf) und auf die hintere Tankschulter geführt.
  - Grund: Höhere Bögen stecken im Flug tiefer im Kopf; außen an der Platte streiften sie die Arme.
- **Manometer zwischen den Tankschultern** statt darüber.
  - Grund: Oben mittig traf der Messingrand im Flug den Kopf bis 8 cm.
- **Glas als glänzender Ring:** Die Knete deckt eine volle Glasscheibe weiß zu.
- **Platte 0,13 breit:** Sie ist nur zwischen den Tanks sichtbar; breiter streifte sie beim Laufen die Arme.

## Belege
Bühne v1.3, Knete, KFB-Licht, FB A11 mit Hasenschwanz. Kanon geprüft: beide Ohren, links A11, Schwanz.
- `blaetter/T1_twin_r1b_r7lage.jpg`: Konzeptblatt; Ruhe, Gehen, Springen, Laufen, Flug cruise und dive, je hinten, seitlich und schräg vorn.
- `blaetter/T2_twin_r1b_toleranz_z082.jpg`: z 0,82 Ruhe, Gehen, Flug.
- `blaetter/T3_twin_r1b_kanon_ganze_figur.jpg`: ganze Figur.
- Im dive meldet das Bodengate FAIL nur wegen Schweben; die Bilder sind gespeichert.

## Kritiker (blind, Befundliste)
**Nach dem Kritiker behoben (r1b):**
- Tankfarbe Sand statt Elfenbein; Braun heller (Schokobraun)
- Kragen Tank–Düse (vorher dunkle Fuge)
- Quergurt unter das Manometer (war verdeckt)
- Nachweis für Gehen, Springen und Ohren ergänzt

**Offen:**
- Flug: Kopf über dem Pack (siehe Toleranz).
- Schlauchbögen kleiner, Manometer tiefer als im Konzept (Grund oben); das Icon bleibt an Tanks, Bändern, Manometer und Schnalle erkennbar.
- Platte relativ dick, der Pack steht vom Rücken ab (Plattenverfahren aus R7: JP_TMAX 1,6, Abrücken vom Rumpf).
- Knete auf den Tanks glatter als die Figur.
- Schwanz in Ruhe zwischen den Düsenglocken teilweise verdeckt.

## Dateien
`jetpack.contract.twin.r1.json` · `glb/` · `data/` · `blaetter/` · `scripts/` (twin_bau, bau_twin = bau_r4_r6 + JP_MAIN_ALL, messe_twin = messe_r4 + Ohren/Arme/Teile, kette.sh, vertrag_twin.py, blatt.mjs) · `stage/` (Kopie, unverändert gegenüber WSB_HALTUNG_R1/stage).
Proof-Träger in `50_BLENDER/J7/_privat_kauf_asset/r2_traeger/jetpack_twin_r1/` (V-776/V-890, wie die Rocket-Runden).
