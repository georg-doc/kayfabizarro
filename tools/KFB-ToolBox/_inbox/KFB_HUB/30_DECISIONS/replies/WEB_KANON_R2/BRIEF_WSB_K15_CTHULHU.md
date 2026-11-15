# Für WSB (Mac mini, Blender MCP) · K15-Nachtrag: Cthulhu-Würfel mit KFB-Augen · 15.11. (Georg q712, V-1705, V-1824)

**Tier 0 (CANON_3D §0, wörtlich):**
1. **Kanon lesen:** `CANON_3D/CANON_3D_R1.md` (diese Seite) und die Zeilen deines Fachgebiets. **Vor dem Bau** liegt ein ausgefülltes Konzeptblatt `CANON_3D/KONZEPTBLATT_R1.md` vor; WS0 schreibt es (V-561).
2. **Bauen nur mit den Kanon-Werkzeugen:**
   - Umgebung: `CANON_3D/lib/kfb_env.py` (Blender: `kfb_env_bpy`);
   - Figuren, Material und Licht: Proof-Stage-Module.
   - Eigene Platzierungs-, Licht- oder Knete-Helfer sind verboten.
3. **Abgabe:**
   - mechanisches Gate grün (`kfb_env_bpy.run()` + Proof-Stage G1–G7);
   - dann der blinde Kritiker nach `CANON_3D/CRITIC_3D_R1.md`;
   - Georg sieht nur Bestandenes.

Konzeptblatt für diesen Job: Es ist eine Einzelfigur aus einem fertigen Kit, keine Szene. Das Konzept ist der K15-Weg der 15 Geschwister-Würfel, Vorbild-Bögen `50_BLENDER/K15/out/kfb/K15_kfb_augen_1von2.png` und `…_2von2.png`.

**Kern (3 Zeilen):**
1. Georg wählt für den Website-Hero Würfelmonster als Gegner und vermisst Cthulhu (Hub q712).
2. Cthulhu liegt im selben Quaternius-Paket wie die 15 K15-Würfel, wurde aber nie umgebaut.
3. Lieferung: `KFB_Cthulhu_kfbeyes.k11c.glb` plus Figurenkarte `q_cthulhu.figure.json`, genau nach dem K15-Weg, sonst nichts.

**Grundlage:** `assets/private` @72d3701c. Pfade ohne Präfix liegen dort.

| Teil | Bestand (geprüfter Pfad) |
|---|---|
| Quelle | Repo `georg-doc/kayfabizarro` @c746a9567e, `media/3D_Assets/MonsterPack_Quaternius/MonsterCuteCubes/glTF/Cthulhu.gltf` (CC0, `License.txt` im Paketordner) |
| Vorbild Weg und Skripte | `50_BLENDER/K15/RETURN.md` (r2-Stand: Anker `KFB_Mouth`, Augenanker, untere Kit-Wimper entfernen, Wertanhebung `scripts/k15_value_lift.py` + `scripts/k15_value_check.py`), Quittungsformat `50_BLENDER/K15/_work/raw/Alien.raw_receipt.json` |
| Vergleich fertig | `50_BLENDER/K15/cubes_kfb/KFB_Crab_kfbeyes.k11c.glb` (Clips, Extras `kfb`, `kfb_k15_value_lift`, `kfb_k15_kfbeyes`) mit Karte `50_BLENDER/K15/data/kfb/q_crab.figure.json` |
| Augen und Goo | `50_BLENDER/K15/stage/kfb-proof-eyes.v1.js`, `50_BLENDER/K15/stage/vendor/eye-goo.v1.1.js` |

**Regeln:**
- Quelle unverändert übernehmen, mit Quittung und Hash wie bei den anderen. Clips des Kits as-is (V-574).
- Augen 1,1 × Kit-Auge, Pupille 0,30, untere Kit-Wimper weg, Wertanhebung wie die Geschwister (V-664, V-666, RETURN r2). Hat Cthulhu mehr als zwei Augen, bekommen die beiden Hauptaugen KFB-Augen, die übrigen bleiben Kit (wie Alien groß); im RETURN nennen.
- GLB in Originalgröße, nicht skaliert (V-611). Karte im K15-r3-Format wie `q_crab.figure.json` (V-666, V-1046) mit `size.heightM` und `heightU`, gemessen wie bei den Geschwistern, Status `pending-ws0`. Die Spielgröße 0,8 m (V-616) setzt Spiel bzw. Website über `heightM`.
- Beleg auf der Proof-Stage in Knete (Proof-Stage-README, V-520): Goo vorn, Goo ¾, geheilt nah, wie die Vorbild-Bögen.

**Rückgabe:** Git-Bundle mit Zweig `assets/wsb-k15-cthulhu` von `assets/private` @72d3701c: Figur in `50_BLENDER/K15/cubes_kfb/`, Karte in `50_BLENDER/K15/data/kfb/`. RETURN `RETURN_cthulhu.md` in `KFB_HUB/30_DECISIONS/replies/WEB_KANON_R2/MINI_k15_cthulhu/` mit dem Bogen. WS0 pusht und gibt beides an Claude Design weiter.
