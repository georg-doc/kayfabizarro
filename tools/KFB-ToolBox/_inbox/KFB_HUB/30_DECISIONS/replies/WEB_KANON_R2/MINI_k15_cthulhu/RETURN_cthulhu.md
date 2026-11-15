# MINI_k15_cthulhu · K15-Nachtrag: Cthulhu-Würfel mit KFB-Augen · RETURN (WSB, 15.11.2026, V-1824, Georg q712)

**Bundle:** `wsb-k15-cthulhu.bundle`, sha256 `19f2b46c50ed9bff9679e36a450d95188b674c5dab36831452fe23a62174b43d`
- Zweig `assets/wsb-k15-cthulhu` @148f2d56, ab `assets/private` @72d3701c.
- 22 Dateien, nur additiv. WSB pusht nicht.

**Bogen:** `K15_Cthulhu_kfb_augen.png` (hier und in `50_BLENDER/K15/out/kfb/`). Er zeigt Goo vorn, Goo ¾, Goo zu, geheilt nah, geheilt ¾ und nachts Goo nah, alles auf der Proof-Stage in Knete.

## Lieferung
| Datei | Pfad |
|---|---|
| Figur | `50_BLENDER/K15/cubes_kfb/KFB_Cthulhu_kfbeyes.k11c.glb` (372 KB), Originalgröße, nicht skaliert |
| Karte | `50_BLENDER/K15/data/kfb/q_cthulhu.figure.json`, Format wie `q_crab` (K15 r3), Status `pending-ws0` |
| Quittungen und Messwerte | `50_BLENDER/K15/data/kfb/cthulhu/` |
| Skripte | `50_BLENDER/K15/scripts/cthulhu/`: Kopien der K15-Skripte mit den unten genannten Abweichungen, dazu `cthulhu_eyes.py`, `cthulhu_mouth.py`, `cthulhu_card_base.py`; die Originale sind unverändert |

## Weg (K15, wie die Geschwister)
1. **Quelle unverändert übernommen:**
   - Datei: `georg-doc/kayfabizarro` @c746a9567e, `media/3D_Assets/MonsterPack_Quaternius/MonsterCuteCubes/glTF/Cthulhu.gltf`.
   - Hash: sha256 `94c94cf3…3ad1`, Original-Bytes gleich (Quittung `Cthulhu.raw_receipt.json`).
   - Lizenz: CC0 laut `License.txt` im Paketordner `MonsterPack_Quaternius/`.
   - Gegenprobe: `Crab.gltf` aus demselben Stand ist byte-gleich mit der K15-Quelle, es ist also dasselbe Paket.
   - Clips wie im Kit, unverändert: Bite_Front, Death, Flying, HitRecieve.
2. **Beleuchtet gepackt:** unlit entfernt, der Puffer ist byte-gleich. G5 PASS, die Knete greift.
3. **Wertanhebung:**
   - Die Haut kommt von Stufe 3,86 auf 4,00 (HSV-V × 1,039).
   - Abgedunkelt ist nichts. Mehr dazu unter Abweichungen.
4. **KFB-Augen:**
   - Größe 1,1 × Kit-Auge (R 0,2623 u), Pupille 0,30, converge 0,12.
   - Anker `KFB_Eye_L/R_anchor` am Knochen Head.
   - Lidfarbe ist der gemessene Hautton #3c583d.
   - Die untere Kit-Wimper ist entfernt: 2 Stücke mit 120 Flächen, wie bei den Geschwistern.
   - Zustände `goo` (eye-goo.v1.1) und `healed`.
5. **Größe:** `heightM` 0,96, `heightU` 1,565. Die Spielgröße 0,8 m setzen Spiel bzw. Website über `heightM` (V-616).
6. **Anzahl Augen:** Cthulhu hat genau zwei Augen. Beide bekommen KFB-Augen, es bleiben keine Kit-Augen übrig.

## Abweichungen vom Geschwister-Weg (alle im Code und in der Karte vermerkt)
- **Ruhepose Flying 0 s:** Cthulhu hat keinen Idle-Clip, er fliegt. Alle Messungen, die sonst „Idle 0 s“ nehmen, laufen hier auf Flying 0 s. Das gilt für die Analyse, den Mund und `heightU`.
- **Kit-Augen sind bernsteinfarben, nicht dunkel:**
  - Die K15-Erkennung über dunkle Inseln greift deshalb nicht.
  - Neu ist `cthulhu_eyes.py`: Es nimmt die Bernstein- und Goldflächen am Head und passt je Seite eine Kugel an. Radius 0,2385 u, Abweichung 0,01 mm.
- **Mundanker am Tentakelansatz:**
  - Cthulhu hat kein offenes Maul und keinen Schnabel.
  - Der K15-Rückfall „Schnabelspitze“ trifft auf der Mittellinie eine flache Fläche und wäre damit beliebig.
  - `KFB_Mouth` sitzt deshalb auf der Mittellinie am oberen Ende der beiden inneren Tentakel (Welt y 0,676), vorn auf der Tentakelfläche. Lokal an Head: (0; 0,2036; 0,7328).
- **Wertanhebung ohne Abdunkeln:**
  - Die Regel „Merkmale 2,5 Stufen unter der Haut“ hätte dunkle Stellen auf 0,2 abgedunkelt.
  - Bei Cthulhu sind das aber Körpermaserung und Flügel, keine Augen und kein Maul. Ergebnis wären schwarze Flecken auf dem Körper und schwarze Flügel gewesen; im Bild geprüft und verworfen.
  - Angehoben ist deshalb nur die Haut.

## Gate und Kritiker
- **Proof-Stage** mit Karte, Tag und Nacht:
  - G1 PASS: 2 Augen, 2 E2-Lidhäute.
  - G2, G5 und G6 PASS.
  - G3: Einsinken um 3,49 cm. Wie bei den Geschwistern steht dafür ein fester Lift `groundOffset: 0.035` in der Karte.
  - G4 nur Hinweis: lose Kit-Inseln, wie bei den Geschwistern.
  - G7 gibt es in dieser Stage-Fassung nicht.
- **`kfb_env_bpy.run()`:** nicht anwendbar, weil es eine Einzelfigur ist, keine Umgebung.
- **Blinder Kritiker** (nur Bilder):
  - Er liest die Figur sofort als Mini-Cthulhu (Chibi).
  - Die Augen sitzen vorn in den Höhlen, nichts sticht durch die Lider, und bei „zu“ dringt kein Leuchten durch.
  - Die Tentakel lesen sich als Knete. Keine Löcher, keine kaputten Texturen. Keine Ansicht kommt von hinten.
- **Hinweise des Kritikers, selbst nachgeprüft:**
  - In ¾ setzt die seitliche Kit-Flosse hinter dem Lidrand des nahen Auges an. Sie sticht nicht durch den Augapfel.
  - Das ferne Auge ragt in ¾ leicht über den Kopfumriss, samt Lichthof. Das kommt aus 1,1 × Kit-Auge und eye-goo, so wie bei den Geschwistern.
  - Goo unterscheidet sich von geheilt nur durch die Farbe, nicht durch die Form. Auch das ist bei allen K15-Würfeln so.
  - Die Flügel lesen sich als dunkle flache Platten. Das ist so im Kit angelegt.
