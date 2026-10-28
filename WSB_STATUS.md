# WSB_STATUS · Sitzung „WSB“ (Blender, Mac mini)
Empfänger: WS0. Neueste Einträge oben. Kanal: Die WS0-Bridge war am 28.10. nachmittags kurz weg (HTTP 409), ist seit abends wieder erreichbar. Dieser Status ist der zweite Weg (Georg 28.10.).
Für `tools/status_latest.sh`: `check 'wsb/*' WSB_STATUS.md WSB`.

## 2 · 28.10. abends · J-7 r3z_b fürs Spiel bereit (Auftrag 3), Aufräumen bestätigt

**WS0 28.10. (Bridge):** Aufräumen mit Georgs Ja erledigt (Dropbox-Papierkorb, 30 Tage). Der Hinweis unten in §1 zu verschwindenden Ordnern ist damit geklärt. Für WSB fehlt nichts.

| # | Auftrag | Stand | Beleg |
|---|---|---|---|
| 3 | J-7 r3z_b fürs Spiel | **bereit, Push durch WS0.** Lieferliste mit 45 Zeilen im Format von `tools/private_assets_list.txt`. Alle 44 Dateien, auf die der Vertrag verweist, sind vorhanden, sha256 = Vertragseintrag, zusammen 407,5 MB. Vertrag `j7_roof_driver.contract.r3z_b.json`, ID `j7_roof_driver.r3`, sha256 `6a6d9590b118…0d803` | `50_BLENDER/J7/LIEFERUNG_R3Z_B.md` |
| – | Befund | Auf `assets/private` (KFB-Stunt-Car-Race) liegt bisher nur J7 R1, in `private_assets_list.txt` stehen keine r3h-Zeilen. Lag r3h woanders, bitte Ort nennen, dann liefert WSB r3z genauso | – |
| 2 | V-946 Ring im Lenkrad-Material | **in Arbeit** (als Nächstes) | – |

Spielstand bleibt r3h, bis WS0 umschaltet.

## 1 · 28.10. abends · J-7 r3z, V-891-Stopp erhalten, V-910 Stopp 1, Löschliste

**Erhalten:** `replies/WS0_AN_WSB_V891_STOPP_RING_J7_R1.md` (28.10. 15:11, Georg q293/q296/q297/q298). Reihenfolge wie dort: 3 → 2 → 4, danach V-910, V-945.

**Nicht angekommen bei WS0** (Bridge 409, Inhalt hier nachgetragen):
- V-891 r38B fürs Spiel geliefert (`50_BLENDER/CARTOON_LOCO/out/KFB_Motion_cartoon_r38B.glb`). Durch Georgs FAIL q296/q298 erledigt.
- V-910 Stopp 1, siehe unten. Bericht liegt auch als Datei `50_BLENDER/JETPACK/AN_WS0_V910_STOPP1.md`.

| # | Auftrag | Stand | Beleg |
|---|---|---|---|
| 1 | V-891 Gehen, Sprung, START/STOP | **STOPP** (Georg FAIL q296/q298). Keine Runden, keine Kritiker, warte auf den neuen Auftrag | `CARTOON_LOCO/RETURN.md` |
| 2 | J-7 Fahrer im Dach r3z (q297 KEEP) | fertig. Jetbound 80 % Neigung: Kranz 7,7 cm vor dem Bauch, Griff 0,01 cm, rechte Hand am Kranz, Lenkrad/Säule ≥ 3,6 cm vom Fahrzeug. Crimson Nahbild von vorn oben. Alle 13: Griff ≤ 0,01 cm, Dachhaut 0, Bühne 39 PASS | `J7/out/abnahme_r3z_c/`, `J7/out/landung_r3z/` |
| 3 | J-7 Lieferung fürs Spiel (Auftrag 3) | siehe §2 | – |
| 4 | V-946 Gummiring (q293 KEEP) | offen (Auftrag 2): Ring in der Lenkrad-Farbe/-Material statt Gelb, auf alle Dachfahrzeuge mit freiem Dach (Ironclad aus), in den Vertrag | – |
| 5 | V-910 Jetpack, Schritt 1 (Gurte weg, Sitz an FB) | **STOPP 1:** Kritik r1b 7,6 → r1g 7,4. Gut: Sitz flach am Rücken, Breite 2,0 × Rumpf, Tanks über den Schultern, Kopf/Ohren frei, Anker `KFB_Jetpack_Anchor_Medium` am Knoten `chest`. Offen: Fransen/gezogene Textur am Hals, Gurt-Stummel hinter dem Arm, unruhige Tank-Kappen. Entscheid: (a) Georg sieht r1b so, (b) Handarbeit an 3 Stellen (braucht Ja), (c) neue Meshy-Fassung (Georg) | `JETPACK/out/V910_Sitz_r1b.png`, `_r1g.png`, `JETPACK/RETURN.md` |
| 6 | V-945 Fahrzeug-Farben | nach V-910 | – |

**Löschliste (Auftrag 4):** durch WS0 erledigt (siehe §2).
