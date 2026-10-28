# WSB_STATUS · Sitzung „WSB“ (Blender, Mac mini)
Empfänger: WS0. Neueste Einträge oben. Kanal: Die WS0-Bridge war am 28.10. nachmittags kurz weg (HTTP 409), ist seit abends wieder erreichbar. Dieser Status ist der zweite Weg (Georg 28.10.).
Für `tools/status_latest.sh`: `check 'wsb/*' WSB_STATUS.md WSB`.

## 5 · 28.10. abends · V-945 Farbkonzept r1: Kritik 5,25, zwei Entscheide offen

**WS0 28.10.:** Flug-Clips nach V-956 nicht selbst bauen (bewährte Clips, WS0); Large-Sitz je Figur in die Figurenkarte nach q299; jetzt V-945.

| Was | Stand | Beleg |
|---|---|---|
| Bogen | 1600 px, links heute, rechts Vorschlag, darunter klein 64 px; Icon-Bühne wie R2 (Kopie icon_stage.py @fcc13ae + Schalter `KFB_ICON_CMAP`), Weg B (`cluster_map`) | `50_BLENDER/V945_FARBEN/out/V945_Farbbogen_r1.png` |
| Vorschlag | Cruiser Himmelblau (bucht.sky) · Skycruiser Türkis (bucht.hill[0]) · Brasswing Racing-Grün (canyon.leaf[0], Messing bleibt) · Phantom Violett (canyon.table) · Wrecker Gelb (canyon.pad) · Jetbound Limette (bucht.leaf[0]) · Rust Runner Orange (canyon.strang) · Hauler Magenta (otown.tower[0]); Original: Graffiti, Straßen-Biest, Flammen-Dragster, Thunderjet, Rostfeuer, Käfer v4 | `V945_FARBEN/RETURN.md` |
| Blinde Kritik r1 | **5,25 REWORK** (Unterscheidbarkeit 6 · keine Pauschal-Tönung 4 · Übergänge 5 · eine Welt 6). Gut: Skycruiser, Cruiser. Pauschal-Tönung auf 7 von 8 (Auspuffe, Triebwerke, Rahmen, Schatten); verwechselbar: Rust Runner/Dragster, Brasswing/Jetbound, Wrecker/Käfer | – |
| Entscheid 1 (Kanon) | 9 von 14 Wagen zu 76–98 % unbunt – Weg B legt alle unbunten Texel auf eine Rolle. Vorschlag r945 für `cluster_map`: `grau_L` (nur Lack-Helligkeitsband, z. B. 0,28–0,80) + `grau_k` (Rollen-Buntheit gedämpft, z. B. 0,7). Nur über WS0 | – |
| Entscheid 2 (Palette) | Sechs feste Wagen (drei rot) lassen keine acht weiteren Rollen-Farbtöne mit ≥ 25° Abstand; Weg B ändert die Helligkeit nicht. (a) weniger umfärben, (b) Akzent-Zonen (braucht Zonen-Methode), (c) Rolle aus weiterer Welt-Palette | – |
| Push | Branch `assets/wsb-vehicle-colors-r1` offen – PNGs kann WSB von diesem Mac nicht pushen | `50_BLENDER/V945_FARBEN/` |

**Nächster Schritt WSB:** Reparaturrunde r2 nach den beiden Entscheiden. Sonst nichts in der Warteschlange.

## 4 · 28.10. abends · V-910 Jetpack Schritt 2: Düsen-Anker, Tank-Maske, Large-Anker

| Was | Stand | Beleg |
|---|---|---|
| Jetpack-GLB | Wurzel `KFB_Jetpack` (Tank-Shader-Vorschlag in den Extras), `KFB_Thrust_L/R` (V-579, Mitte der Düsenöffnung), Tank-Maske (Textur + `_KFB_TANK`), Anker `KFB_Jetpack_Anchor_Medium/_Large` am Knoten `chest` | `JETPACK/_privat_meshy/r2/jetpack_r2d.glb` |
| Blinde Kritik r2d | FrizzleBob 8,0 PASS; Brute 7,6 (Gurt-Stummel → q299, Kragen/Schulterpolster, gewölbter Rücken) → Sitz-Werte je Large-Figur in die Figurenkarte | `JETPACK/out/V910_Schritt2_Anker_r2d.png` |

## 3 · 28.10. abends · V-946 Ring im Lenkrad-Material ausgerollt

Vertrag `j7_roof_driver.contract.r3z_ring.json`: Ring an auf 9 Dachfahrzeugen, aus auf ironclad, crimson_thunderjet, brasswing_roadster, dragster. Push durch WS0 (`assets/private` 16ad7d3). Beleg `J7/out/abnahme_v946_ring/`, `J7/LIEFERUNG_V946_RING.md`.

## 2 · 28.10. abends · J-7 r3z_b fürs Spiel bereit

Push durch WS0 (`assets/private` 16ad7d3, 64 Dateien). Beleg `J7/LIEFERUNG_R3Z_B.md`.

## 1 · 28.10. abends · V-891-Stopp erhalten, V-910 Stopp 1

V-891 Gehen/Sprung/START/STOP: STOPP (Georg FAIL q296/q298), neuer Weg über V-956 bei WS0. V-910 Sitz: Entscheid q299 bei Georg (`JETPACK/AN_WS0_V910_STOPP1.md`).
