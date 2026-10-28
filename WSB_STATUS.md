# WSB_STATUS · Sitzung „WSB“ (Blender, Mac mini)
Empfänger: WS0. Neueste Einträge oben. Kanal: Die WS0-Bridge war am 28.10. nachmittags kurz weg (HTTP 409), ist seit abends wieder erreichbar. Dieser Status ist der zweite Weg (Georg 28.10.).
Für `tools/status_latest.sh`: `check 'wsb/*' WSB_STATUS.md WSB`.

## 6 · 28.10. abends · V-945: r945 im Kanon, r2 bester Stand (6,75), Stopp

**WS0 28.10.:** (1) r945 ins Kanon-Modul, Standard aus, Golden-Prüfung; (2) Rollen aus allen Welt-Paletten in COLOR_HARMONY_R1, verwechselbare Paare bewusst trennen.

| Was | Stand | Beleg |
|---|---|---|
| Kanon-Modul r945 | `cluster_map` optional `grau_L`/`grau_kante`/`grau_k`; Sicherung `kfb_clay_bpy.vor_V945.py`. Ohne die neuen Schlüssel byte-gleich: 12 Fälle Fahrzeug-Texturen + Goldens Theater/Utopia r816 (7 Texturen, eigene `kfb_r816`-Cluster) | `30_DECISIONS/CANON_3D/lib/kfb_clay_bpy.py` |
| r2 (bester Stand) | **Kritik 6,75** (7/6/7/7). Cruiser Aqua (j17.bucht.water) · Skycruiser Türkis (j17.otown.top) · Brasswing Grün (j17.canyon.leaf[0]) · Rust Runner Oliv (storyModes.comic.top) · Jetbound Blauviolett (storyModes.heroic.tower[0]) · Wrecker Violett (j17.bucht.tower[0]) · Phantom Orchidee (storyModes.comic.leaf[2]) · Hauler Gold (storyModes.forbidden.strang); grau_L 0,28–0,80, grau_k 0,75 | `V945_FARBEN/out/V945_Farbbogen_r2.png`, `_work/cmap_v945_r2.json` |
| r3 | **6,25** (7/5/6/7): grau_k 0,6, Hauler Oliv, Rust Runner Gold, Phantom Altrosa – ohne Gewinn → Stopp | `V945_FARBEN/out/V945_Farbbogen_r3.png` |
| Gut | Brasswing, Skycruiser; Scheiben überall dunkel (r1 5,25 → r2 6,75) | – |
| Grenze von Weg B | Chrom, Auspuffe, Kran, Gitter, Düsen haben bei den grauen Wagen die Helligkeit des Lacks – auch `grau_L` trennt sie nicht; alte Lackreste/helle Stellen wirken auf neuem Lack wie Flecken; Violett-Dreiergruppe und Grün-Gruppe bleiben eng (sechs feste Wagen, drei rot) | – |
| Entscheid | (a) r2 als Richtung an Georg mit Kritiker-Hinweis, (b) Teile-Trennung je Fahrzeug (Lack/Metall über Mesh-Teile oder Maske je Wagen) als neue Methode für Schritt 2, (c) weniger umfärben (z. B. nur Brasswing, Skycruiser, Cruiser) | – |
| Push | fertig bis zur Stopp-Regel – bereit für `assets/wsb-vehicle-colors-r1` (WS0) | `50_BLENDER/V945_FARBEN/` |

**Nächster Schritt WSB:** nach Entscheid. Sonst nichts in der Warteschlange.

## 5 · 28.10. abends · V-945 Farbkonzept r1: Kritik 5,25

r1 (Weg B ohne Band): 5,25 – Pauschal-Tönung, verwechselbare Paare. Beleg `V945_FARBEN/out/V945_Farbbogen_r1.png`. Entscheide von WS0 siehe §6.

## 4 · 28.10. abends · V-910 Jetpack Schritt 2: Düsen-Anker, Tank-Maske, Large-Anker

Wurzel `KFB_Jetpack`, `KFB_Thrust_L/R` (V-579), Tank-Maske (Textur + `_KFB_TANK`), Anker Medium/Large am Knoten `chest`; Kritik FrizzleBob 8,0 PASS, Brute 7,6 → Sitz-Werte je Large-Figur in die Figurenkarte. Beleg `JETPACK/_privat_meshy/r2/jetpack_r2d.glb`, `JETPACK/out/V910_Schritt2_Anker_r2d.png`.

## 3 · 28.10. abends · V-946 Ring im Lenkrad-Material ausgerollt

Vertrag `j7_roof_driver.contract.r3z_ring.json`: Ring an auf 9, aus auf 4. Push durch WS0 (`assets/private` 16ad7d3).

## 2 · 28.10. abends · J-7 r3z_b fürs Spiel bereit

Push durch WS0 (`assets/private` 16ad7d3, 64 Dateien).

## 1 · 28.10. abends · V-891-Stopp erhalten, V-910 Stopp 1

V-891 STOPP (Georg FAIL q296/q298), neuer Weg über V-956 bei WS0. V-910 Sitz: Entscheid q299 bei Georg.
