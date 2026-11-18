# FB Low-Poly R1 · RETURN (WSB, 17.11.2026)

**Auftrag:** Georg über WS0, 17.11.:
- FB leicht bauen; Silhouette und Knete-Anmutung bleiben, deutlich weniger Eckpunkte.
- Ohren mit einem Gewichtsverlauf über alle drei Knochen bis in die Spitze, damit sie biegen statt klappen.
- Unverändert bleiben: Skelett, Namen, Gesichtsanschlüsse, Materialzonen, Sneaker-Bindung und Kanon-Weg.
- Prüfung: Kampfbühne mit Laufleiter und Vorher|Nachher.

**Gültig ist der Stand r1b** (nach dem blinden Kritiker, siehe 5).

## 1 · Was im Spiel FB ist (Befund)
- **Gerüst:** `src/assets/actors/FB_TEMPLATE_LOOK_v5b.glb` liefert Rig, Gesichtsteile, Kopf und rechtes Ohr.
- **Linkes Ohr:** kommt aus dem Kanon `FB_CANON R8 A11` (`50_BLENDER/FB/R5/R8/FB_R8_probe_A11.glb`, sha 91092623…, das Ohr mit Biss). `graftCanonEar` setzt es 1:1 ein.
- Darum sind **beide** Dateien ausgedünnt.
- In A11 bleiben Kopf und rechtes Ohr bitgleich zur Low-Poly-v5b, wie vorher zur v5b.

## 2 · Dateien
| Datei | Eckpunkte vorher → nachher | Größe | sha256 |
|---|---|---|---|
| `glb/FB_TEMPLATE_LOOK_v5b.lowpoly.r1b.glb` | 30.752 → **5.957** | 1,79 MB → 0,39 MB | `f618e72163979cb8e0104b7c2f90fa998fe0cf87b9731ea5dc30d1e090768205` |
| `_privat_kauf_asset/FB_R8_probe_A11.lowpoly.r1b.glb` | linkes Ohr 17.556 → 1.201 (gesamt 71.964 → 40.975) | 4,01 MB | `4b2c224e6607d8fdaa85d506e5200750fb9407c37442cbbcecb126ae49515772` |

- **Je Teil:** Ohren 11.362 → 1.201 (A11-Ohr 17.556 → 1.201), Kopf 6.274 → 1.801.
- **Unverändert** (byte-gleich übernommen): Körper, Arme, Beine, Brauen, Nase, Mund, Augen, Skelett, Knochennamen, Bind-Matrizen, Materialien, Clips (A11).
- **Bauweise:** meshoptimizer-Vereinfachung, die nur Original-Eckpunkte mit ihren Normalen behält (Fehler 0,005, Ränder fest).
  - Attribute werden **getrennt** geschrieben wie in den Originalen.
  - Mit verschachtelten Puffern (Standard von gltf-transform) zerstört `graftCanonEar` das Ohr, weil es `skinIndex.array` umschreibt. Das habe ich im ersten Spieltest gesehen und behoben.
- **Ohrgewichte neu:**
  - Verlauf entlang der Ohrlänge: ear1 → ear2 → ear3 bis in die Spitze, weich überlappend, höchstens 3 Einflüsse.
  - An der Wurzel weich in den Basisknochen (`earlbase` in A11; `head` in v5b, das Spiel setzt die Basis zur Laufzeit ein).
  - Die Biegung selbst macht im Spiel die Ohren-Feder (ear-dangle); im Modell ist nichts gekeyt.
- **Skripte:**
  - `scripts/fb_lowpoly_r1.mjs` (Aufruf `… 1200 1800 0.005`);
  - Spieltest `scripts/_wsb-fb-lowpoly-r1.mjs`;
  - Messungen `gesicht.py`, `vergleich.py`, `biegen.py`.

## 3 · Prüfung im Spiel (Kampfbühne `buehne=r1`, `fb_seite` | `fb_dreiviertel`)
- **Tausch:** Beim Nachher tauscht der Test die beiden Dateien im Browser per Routing; keine Spieldatei wurde geändert.
- **Laufleiter** wie `test/_laufstufen-beleg.mjs` (W+Shift → Sprint → Turbo → Roadrunner → loslassen → Bremse), mit `laufclip=kk_running_b`.
  - Der Schalter ist nötig, weil die WSB-Laufclips raus sind; ohne ihn bleibt die Leiter bei Sprint.
  - Vorher und nachher wurden alle Stufen erreicht, ohne Fehler.
- **Gezeichnete FB-Eckpunkte:** 101.804 → **68.801** (−32 %).
  - Linkes Ohr 19.179 → 1.469, rechtes 11.962 → 1.370, Kopf 6.696 → 1.995.
  - Die Laufzeitwerte liegen etwas über den Dateiwerten, weil der Clay-Bake Kanten verdoppelt.
- **Bildzeit:** vorher und nachher Median 16,7 ms (p95 16,8) im Stand und im Lauf. Der Mac mini hängt an der 60-Hz-Grenze, ein Unterschied ist dort nicht messbar.
- **Gesichtsteile gegen die Kopffläche** (`data/r1b/gesicht_abstand_r1b.txt`): Verschiebung höchstens 0,0007 Modelleinheiten (unter 1 mm), nichts schwebt oder versinkt.
- **Bilder:**
  - `belege_r1b/FB_LOWPOLY_R1B_kampfbuehne_laufleiter.jpg` und `_stand_nah.jpg` (Spiel);
  - `_vorher_nachher_vorn.jpg` und `_ohren_biegen.jpg` (neutral).

## 4 · Proof-Stage
- Die Proof-Stage verweigert jede geänderte FB-Datei (FB_CANON-Sperre V-658). Durchlässe gibt es nur für eingetragene Hashes und Ordner (V-776).
- Ich habe nichts eingetragen und nichts umgangen; das Vorher|Nachher steht deshalb neutral in Blender (gleiche Kamera und Licht) und im Spiel.
- Für einen Proof-Durchlass bitte die beiden Hashes oben bei WS0 eintragen.
- Eine Übernahme als Kanon braucht Georgs neuen Pin (FB_CANON.json).

## 5 · Blinder Kritiker (ein Lauf, nur Bilder, Stand r1 mit 800 Eckpunkten je Ohr)
**Urteil: PASS mit Hinweisen.**
- **Positiv:**
  - Vorher und nachher sind ohne Zoom nicht zu unterscheiden; keine Facetten, keine Nähte, Gesichtsteile sitzen.
  - Der Biss ist im Spiel erhalten.
  - Die neue Biegung ist gleichmäßiger als vorher (vorher S-förmig mit Knick und Beule).
- **Hinweise:**
  - Beim gebogenen Ohr eine kurze gerade Strecke an der Hinterkante.
  - Die Spitze am Biss ist etwas scharf.
  - Die Innenmulde oben ist etwas flacher.
- **In r1b nachgezogen:** Ohren 800 → 1.200 Eckpunkte, Fehlergrenze 0,01 → 0,005. Die Hinterkante ist runder, die Mulde wieder tiefer, der Biss bleibt.

## 6 · Weitere Großposten im Spiel (nicht im Auftrag, zur Entscheidung bei WS0)
Gezählt an der gezeichneten FB-Figur, vorher:
- `lid_skin` 31.364 (E2-Lider, Laufzeit; auch der A11-Export trägt `KFB_LidSkin_L/R` mit je 15.682);
- ein unbenanntes Netz mit 7.404;
- `KFB_Shirt_FB` 7.367;
- Jetpack-Teile `S1_*` mit je 2.322;
- Cartoon-Nase 1.617.

Die Lider sind nach diesem Auftrag der größte Einzelposten (46 % nachher).

## Löschliste
Der Stand r1 (`glb/…lowpoly.r1.glb`, `_privat_kauf_asset/…lowpoly.r1.glb`, `belege/`, `data/bericht_*_r1.json`, `data/kampfbuehne_nachher/`), die Probeläufe und die Test-Zwischenkopien stehen in `BLINDE_KRITIK_R1/LOESCHLISTE.md` und warten auf Georgs Ja.
