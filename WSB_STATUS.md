# WSB_STATUS · Sitzung „WSB“ (Blender, Mac mini)
Empfänger: WS0. Neueste Einträge oben. Kanal: Die WS0-Bridge war am 28.10. nachmittags kurz weg (HTTP 409), ist seit abends wieder erreichbar. Dieser Status ist der zweite Weg (Georg 28.10.).
Für `tools/status_latest.sh`: `check 'wsb/*' WSB_STATUS.md WSB`.

## 7 · 28.10. abends · J-7 rustwing auf dem Spielmodell (r4a_ring)

**WS0 28.10.:** r3z_ring im Spiel (12 Racer); rustwing hing im Vertrag an der B39-Dachfassung (2,57 u), das Spiel lädt rustwing_cruiser_browser.v3.glb (2,06 u) – FB schwebte 0,3 u, rustwing vorerst aus. V-945 → (a): r2 als Richtung an Georg (q301).

| Was | Stand | Beleg |
|---|---|---|
| rustwing neu | Quelle Spiel-GLB über Schalter `J7_R2_QUELLE=rustwing:rustwing_cruiser` (R2-Weg, Fahrzeug unverändert, Schlüssel bleibt), Sitz = Mitte der flachen Dachfläche z −0,08 (Dach y 2,059). Griff 0,00 cm, Kranz 4,75 cm vor dem Bauch, Dachhaut 0, Beine 0; Ring an (freies Dach) | `J7/out/abnahme_r4a_ring/13_rustwing.png` |
| Übrige 12 | Clip-Daten 48/48 byte-gleich zu r3z, Anker im Vertrag gleich; Träger neu (gemeinsame Clip-Bibliothek in jedem Träger), alle 9 Ring-Träger neu aus r4a | `J7/_privat_kauf_asset/r2_traeger/r4a`, `r4a_ring` |
| Vertrag | `j7_roof_driver.contract.r4a_ring.json` (ID `j7_roof_driver.r3`), ersetzt r3z_ring | `J7/data/` |
| Lieferliste | 44 Verweise, sha256 = Vertrag; Zeilen für `private_assets_list.txt`; Bühne 39 PASS | `J7/LIEFERUNG_R4A_RING.md` |
| Blinde Kritik rustwing | 7,4 (8/8/7/7/7): Kranz-Unterkante auf Ring-Höhe (dunkel auf dunkel), Vorneigung nicht ablesbar, Fahrzeug PBR. Gleiche Lenkrad-Geometrie wie die übrigen (Graffiti 8,0) → gemeinsamer Standard (q297 KEEP); falls gewünscht: Lenkrad/Säule für alle etwas höher, eigene Runde | – |

**Nächster Schritt WSB:** Push durch WS0. Sonst warten auf q299 (Jetpack) / q301 (Farben).

## 6 · 28.10. abends · V-945: r945 im Kanon, r2 bester Stand (6,75), Stopp

Kanon-Modul r945 (`cluster_map` optional `grau_L`/`grau_kante`/`grau_k`, ohne die Schlüssel byte-gleich, Goldens unverändert). r2 6,75 bester Stand, r3 6,25 → Stopp; WS0: (a) r2 als Richtung an Georg (q301), Teile-Trennung vorerst nein. Beleg `V945_FARBEN/out/V945_Farbbogen_r2.png`.

## 5 · 28.10. abends · V-945 Farbkonzept r1: Kritik 5,25

Beleg `V945_FARBEN/out/V945_Farbbogen_r1.png`.

## 4 · 28.10. abends · V-910 Jetpack Schritt 2: Düsen-Anker, Tank-Maske, Large-Anker

`KFB_Thrust_L/R` (V-579), Tank-Maske, Anker Medium/Large am Knoten `chest`; FrizzleBob 8,0 PASS, Brute 7,6. Beleg `JETPACK/out/V910_Schritt2_Anker_r2d.png`.

## 3 · 28.10. abends · V-946 Ring im Lenkrad-Material ausgerollt

Vertrag r3z_ring: Ring an auf 9, aus auf 4. Push durch WS0 (`assets/private` 16ad7d3). Ersetzt durch r4a_ring (§7).

## 2 · 28.10. abends · J-7 r3z_b fürs Spiel bereit

Push durch WS0 (`assets/private` 16ad7d3, 64 Dateien).

## 1 · 28.10. abends · V-891-Stopp erhalten, V-910 Stopp 1

V-891 STOPP (Georg FAIL q296/q298), neuer Weg über V-956 bei WS0. V-910 Sitz: Entscheid q299 bei Georg.
