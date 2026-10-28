# WSB_STATUS · Sitzung „WSB“ (Blender, Mac mini)
Empfänger: WS0. Neueste Einträge oben. Kanal: Die WS0-Bridge war am 28.10. nachmittags kurz weg (HTTP 409), ist seit abends wieder erreichbar. Dieser Status ist der zweite Weg (Georg 28.10.).
Für `tools/status_latest.sh`: `check 'wsb/*' WSB_STATUS.md WSB`.

## 8 · 28.10. abends · Jetpack r1 geliefert, V-945 Schritt 2 nach r2 gebacken

**WS0 28.10.:** rustwing r4a_ring wird gepusht (q297 KEEP, keine Extra-Runde Lenkrad/Neigung); q299 KEEP → Jetpack mit r1b abschließen; q301 „Richtung so“ → V-945 Schritt 2 genau nach r2.

| Was | Stand | Beleg |
|---|---|---|
| V-910 Jetpack r1 | Vertrag `kfb_jetpack.v910.r1`: GLB r2d (Geometrie r1e = Sitz r1b), `KFB_Thrust_L/R` (V-579), Tank-Maske (Textur + `_KFB_TANK`), Shader-Vorschlag, Sitz je Figur als Matrix im Raum von `chest` (FrizzleBob Medium: Breite 2,0, Oberkante +4 %; Brute Large: Breite 1,6, Neigung −15,7°). Vorschlag `props.jetpack.seat` für die Figurenkarten (WS0). Flug-Clips nach V-956 bei WS0 | `JETPACK/data/v910_jetpack.contract.r1.json`, `JETPACK/LIEFERUNG_V910_R1.md` (7 Dateien) |
| V-945 Schritt 2 | 8 Kopien `<id>_browser.v3.v945r2.glb`: nur Grundfarb-Bild neu (Kanon `cluster_image`, r945 grau_L 0,28–0,80, grau_k 0,75, WebP wie im Original); Geometrie, Knoten, Material, Normal-/MR-Bild byte-gleich (geprüft); Abbildung in den Extras `kfb_v945`. 6 Originale bleiben ohne neue GLB | `V945_FARBEN/out/glb_r2/` |
| Icons | alle 14 `out/icons_v945_r2/<id>.png`; die 8 aus den gebackenen Modellen, Abweichung zu r2 0,5–1,3/255 (WebP) | `V945_FARBEN/out/icons_v945_r2/` |
| Lieferliste | 25 Dateien, Branch laut Brief `assets/wsb-vehicle-colors-r1` (Push WS0) | `V945_FARBEN/LIEFERUNG_V945_R2.md` |

**Nächster Schritt WSB:** keiner in der Warteschlange.

## 7 · 28.10. abends · J-7 rustwing auf dem Spielmodell (r4a_ring)

rustwing über `J7_R2_QUELLE=rustwing:rustwing_cruiser` (R2-Weg, Spiel-GLB, Sitz z −0,08), Griff 0,00 cm, Ring an; übrige 12 Clips/Anker gleich. Vertrag `j7_roof_driver.contract.r4a_ring.json`, Lieferliste `J7/LIEFERUNG_R4A_RING.md`; WS0 pusht (q297 KEEP).

## 6 · 28.10. abends · V-945: r945 im Kanon, r2 bester Stand (6,75)

Kanon-Modul r945 (`cluster_map` optional `grau_L`/`grau_kante`/`grau_k`, ohne die Schlüssel byte-gleich, Goldens unverändert). r2 6,75 → Georg q301 „Richtung so“ (§8).

## 5 · 28.10. abends · V-945 Farbkonzept r1: Kritik 5,25

Beleg `V945_FARBEN/out/V945_Farbbogen_r1.png`.

## 4 · 28.10. abends · V-910 Jetpack Schritt 2: Düsen-Anker, Tank-Maske, Large-Anker

FrizzleBob 8,0 PASS, Brute 7,6; abgeschlossen als r1 (§8).

## 3 · 28.10. abends · V-946 Ring im Lenkrad-Material ausgerollt

Vertrag r3z_ring, ersetzt durch r4a_ring (§7).

## 2 · 28.10. abends · J-7 r3z_b fürs Spiel bereit

Push durch WS0 (`assets/private` 16ad7d3).

## 1 · 28.10. abends · V-891-Stopp erhalten, V-910 Stopp 1

V-891 STOPP (Georg FAIL q296/q298), neuer Weg über V-956 bei WS0. V-910 Sitz: q299 KEEP (§8).
