# WSB_STATUS · Sitzung „WSB“ (Blender, Mac mini)
Empfänger: WS0. Neueste Einträge oben. Neuer Kanal (Georg 28.10.): Die Bridge-Adresse von WS0 (`session_01CuXG4u…`) ist seit 28.10. nachmittags veraltet (HTTP 409), Nachrichten kamen nicht mehr an. Bis eine neue Adresse da ist, schreibt WSB hier.
Für `tools/status_latest.sh`: `check 'wsb/*' WSB_STATUS.md WSB`.

## 1 · 28.10. abends · J-7 r3z, V-891-Stopp erhalten, V-910 Stopp 1, Löschliste

**Erhalten:** `replies/WS0_AN_WSB_V891_STOPP_RING_J7_R1.md` (28.10. 15:11, Georg q293/q296/q297/q298). Reihenfolge wie dort: 3 → 2 → 4, danach V-910, V-945.

**Nicht angekommen bei WS0** (Bridge 409, Inhalt hier nachgetragen):
- V-891 r38B fürs Spiel geliefert (`50_BLENDER/CARTOON_LOCO/out/KFB_Motion_cartoon_r38B.glb`). Durch Georgs FAIL q296/q298 erledigt.
- V-910 Stopp 1, siehe unten. Bericht liegt auch als Datei `50_BLENDER/JETPACK/AN_WS0_V910_STOPP1.md`.

| # | Auftrag | Stand | Beleg |
|---|---|---|---|
| 1 | V-891 Gehen, Sprung, START/STOP | **STOPP** (Georg FAIL q296/q298). Keine Runden, keine Kritiker, warte auf den neuen Auftrag | `CARTOON_LOCO/RETURN.md` |
| 2 | J-7 Fahrer im Dach r3z (q297 KEEP) | fertig. Jetbound 80 % Neigung: Kranz 7,7 cm vor dem Bauch, Griff 0,01 cm, rechte Hand am Kranz, Lenkrad/Säule ≥ 3,6 cm vom Fahrzeug. Crimson Nahbild von vorn oben. Alle 13: Griff ≤ 0,01 cm, Dachhaut 0, Bühne 39 PASS | `J7/out/abnahme_r3z_c/`, `J7/out/landung_r3z/` |
| 3 | J-7 Lieferung fürs Spiel (Auftrag 3) | **nächster Schritt.** Träger `J7/_privat_kauf_asset/r2_traeger/r3z/` (280 MB), Vertrag `J7/data/j7_roof_driver.contract.r3z_b.json` (= r3z + `body_lean_scale` je Fahrzeug, Jetbound 0,8). Auf diesem Mac gibt es weder `~/KFB_GitHub_sync` noch Git-Zugang (kein SSH-Schlüssel, kein gh); GLBs kann WSB deshalb nicht in den privaten Branch pushen | Bitte: Push wie bei r3h durch WS0, oder Weg nennen |
| 4 | V-946 Gummiring (q293 KEEP) | offen (Auftrag 2): Ring in der Lenkrad-Farbe/-Material statt Gelb, auf alle Dachfahrzeuge mit freiem Dach (Ironclad aus), in den Vertrag | – |
| 5 | V-910 Jetpack, Schritt 1 (Gurte weg, Sitz an FB) | **STOPP 1:** Kritik r1b 7,6 → r1g 7,4. Gut: Sitz flach am Rücken, Breite 2,0 × Rumpf, Tanks über den Schultern, Kopf/Ohren frei, Anker `KFB_Jetpack_Anchor_Medium` am Knoten `chest`. Offen: Fransen/gezogene Textur am Hals, Gurt-Stummel hinter dem Arm, unruhige Tank-Kappen. Entscheid: (a) Georg sieht r1b so, (b) Handarbeit an 3 Stellen (braucht Ja), (c) neue Meshy-Fassung (Georg) | `JETPACK/out/V910_Sitz_r1b.png`, `_r1g.png`, `JETPACK/RETURN.md` |
| 6 | V-945 Fahrzeug-Farben | nach V-910 | – |

**Löschliste (Auftrag 4, nichts gelöscht von WSB):**
| Ordner | Größe | Bemerkung |
|---|---|---|
| `J7/out/abnahme_r3d … r3y`, `abnahme_r3z`, `abnahme_r3z_b` | ≈ 1,2 GB | überholt; bleiben: `abnahme_r3h`, `abnahme_r3z_c` |
| `J7/out/landung_r3m … r3y` | ≈ 1,1 GB | überholt; bleibt: `landung_r3z` |
| `J7/_privat_kauf_asset/r2_traeger/v946_wulst_probe` | 384 MB | V-946-Proben r2–r8; nur `ring45` bleibt bis zum Ring-Rollout |
| `CARTOON_LOCO/out/` | 302 MB gesamt | V-891 gestoppt: Sprung-GIFs r22–r38, Motion r7–r38, Abnahmen; WS0 entscheidet, was bleibt |
| `JETPACK/_privat_meshy/r1/jetpack_ohne_gurte_r1, r1b, r1c, r1d, r1f` + Träger `FB_jetpack_r1/r1f` | ≈ 55 MB / 27 MB | Zwischenstände Gurt-Schnitt |

**Hinweis:** In `J7/out` verschwinden gerade (28.10. abends) Abnahme-Ordner: `abnahme_r3a … r3j` sind weg oder leer, `abnahme_r3h` ist noch da. Das kommt nicht von WSB. Falls es Georg bzw. WS0 ist, alles gut; sonst bitte prüfen.

**Nächster Schritt WSB:** Auftrag 3 bereitstellen (Liste der Dateien mit sha256 für den Push), dann V-946 Ring im Lenkrad-Material (Auftrag 2).
