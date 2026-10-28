# WSB_STATUS · Sitzung „WSB“ (Blender, Mac mini)
Empfänger: WS0. Neueste Einträge oben. Kanal: Die WS0-Bridge war am 28.10. nachmittags kurz weg (HTTP 409), ist seit abends wieder erreichbar. Dieser Status ist der zweite Weg (Georg 28.10.).
Für `tools/status_latest.sh`: `check 'wsb/*' WSB_STATUS.md WSB`.

## 4 · 28.10. abends · V-910 Jetpack Schritt 2: Düsen-Anker, Tank-Maske, Large-Anker

**WS0 28.10.:** r3z_b + r3z_ring auf `assets/private` (16ad7d3), Ring-Sichtbarkeit nach WSB-Regel; V-910 Stopp 1 als Hub-Karte q299 bei Georg; bis dahin Schritt 2, dann V-945.

| Was | Stand | Beleg |
|---|---|---|
| Jetpack-GLB | Geometrie/Textur = r1e (Sitz wartet auf q299). Wurzel `KFB_Jetpack` mit Extras: Tank-Shader-Vorschlag (flow_speed 0,35 · wobble 0,6 · glow 1,2; Farbrollen tank_deep=primary, tank_glow=accent, sparkle=highlight) | `JETPACK/_privat_meshy/r2/jetpack_r2d.glb` |
| `KFB_Thrust_L/R` | V-579: lokal +Z = Schubrichtung, Ursprung in der Mitte der Düsenöffnung; Achse aus der Tank-Achse (nach unten, leicht vom Rücken weg); L/R in Figur-Richtung (getragen um 180° gedreht → Figur-links = Jetpack-lokal −X) | `scripts/jp_anker.py` |
| Tank-Maske | Textur `KFB_Jetpack_TankMask` (Material-Extras `tank_mask_texture`) + Vertex-Attribut `_KFB_TANK`; Laufzeit: Tankglas = Maske × `_KFB_TANK` (der Meshy-Atlas nutzt UV-Flächen mehrfach) | – |
| Anker | `KFB_Jetpack_Anchor_Medium` / `_Large` als Kind des Knotens `chest`. Träger Medium unter `J7/_privat_kauf_asset/r2_traeger/v910_jetpack_probe/FB_jetpack_r2d.glb` (FB_CANON-Sperre), Large `JETPACK/_privat_meshy/r2/traeger/Brute_jetpack_r2d.glb` (Orc-Brute B51) | – |
| Blinde Kritik r2d | **FrizzleBob 8,0 PASS** (Sitz, Anker mittig in den Düsen). **Brute 7,6** (von 6,75): Gurt-Stummel an der Hüfte (Schnitt, hängt an q299), Kragen läuft ins linke Schulterpolster, Unterkante steht vom gewölbten Rücken ab. Weitere Runde r2e schlechter → Stopp für Large | `JETPACK/out/V910_Schritt2_Anker_r2d.png` |
| Vorschlag | Sitz-Werte (Breite, Höhe, Neigung) je Large-Figur in die Figurenkarte statt einer Formel | – |

**Nächster Schritt WSB:** V-945 Fahrzeug-Farben. V-910 Schritt 3 (Flug-Clips) wartet auf q299 und den neuen Animations-Weg nach dem V-891-Stopp.

## 3 · 28.10. abends · V-946 Ring im Lenkrad-Material ausgerollt (Auftrag 2)

| Was | Stand | Beleg |
|---|---|---|
| Vertrag `j7_roof_driver.contract.r3z_ring.json` (ID `j7_roof_driver.r3`, sha256 `a4560f5a0f8a…`) | = r3z_b + `hip_clay_roll` on/off + `hip_clay_roll_style` (Torus, Rohr 0,045 u, Material `kfb_steering_rim_metal`, Knoten `KFB_hip_clay_roll` als Kind von `Rig`) | `50_BLENDER/J7/data/` |
| Ring an (9) | graffiti_jet_cruiser, street_racer_hoverbeast, iron_phantom_hovercar, ironclad_wrecker, jetbound_roadster, rust_runner, rustfire_interceptor, rustwing_hauler, rustwing. Prüfung „freies Dach“: 0 Fahrzeug-Punkte im Ring | `scripts/j7_ring_pruefung.py` |
| Ring aus (4) | ironclad (WS0); crimson_thunderjet (offenes Cockpit, kein Dach um die Hüfte); brasswing_roadster und dragster (Dachteil hinten ragt in den Ring, 3–4 % der Punkte bis 6 cm; Kritik 6,75 / 7,25) | – |
| Blinde Kritik | Graffiti 8,0 PASS: Ring geschlossen, gleich dick, an der Hüfte, Kranz-Farbe | `J7/out/abnahme_v946_ring/` |
| Vorschlag Laufzeit | Ring nur sichtbar, solange die Hüfte im Dach ist (WS0 übernommen) | – |
| Push | erledigt durch WS0 (`assets/private` 16ad7d3) | `50_BLENDER/J7/LIEFERUNG_V946_RING.md` |

## 2 · 28.10. abends · J-7 r3z_b fürs Spiel bereit (Auftrag 3), Aufräumen bestätigt

| # | Auftrag | Stand | Beleg |
|---|---|---|---|
| 3 | J-7 r3z_b fürs Spiel | Push erledigt durch WS0 (`assets/private` 16ad7d3, 64 Dateien) | `50_BLENDER/J7/LIEFERUNG_R3Z_B.md` |

Aufräumen durch WS0 mit Georgs Ja (Dropbox-Papierkorb, 30 Tage); für WSB fehlt nichts.

## 1 · 28.10. abends · J-7 r3z, V-891-Stopp erhalten, V-910 Stopp 1, Löschliste

**Erhalten:** `replies/WS0_AN_WSB_V891_STOPP_RING_J7_R1.md` (28.10. 15:11, Georg q293/q296/q297/q298).

| # | Auftrag | Stand | Beleg |
|---|---|---|---|
| 1 | V-891 Gehen, Sprung, START/STOP | **STOPP** (Georg FAIL q296/q298). Keine Runden, keine Kritiker, warte auf den neuen Auftrag | `CARTOON_LOCO/RETURN.md` |
| 2 | J-7 Fahrer im Dach r3z (q297 KEEP) | fertig, siehe §2 | `J7/out/abnahme_r3z_c/` |
| 5 | V-910 Jetpack, Schritt 1 (Gurte weg, Sitz an FB) | **STOPP 1**, Entscheid bei Georg (q299): (a) r1b so, (b) Handarbeit an 3 Stellen, (c) neue Meshy-Fassung | `JETPACK/out/V910_Sitz_r1b.png`, `JETPACK/AN_WS0_V910_STOPP1.md` |
| 6 | V-945 Fahrzeug-Farben | als Nächstes | – |
