# MOUTHS_R3 – drei neue Mund-Sets für die ToolBox (16.10.)

Quelle: main, `media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/`, Commit `ea603d31d` (Upload 16.10.). Kopien liegen in `_src/`.

**Wichtig:** Von den 6 Bögen im Ordner sind nur 3 neu.
- „Clay-Mundformen als Animations-Sprite-Sheet“ = GPT A
- „Claymation-Mundformen im 4×3-Raster“ = GPT B
- „Claymation-Mund-Sprite-Sammlung“ = GPT C

Diese drei sind byte-gleich mit `MOUTHS_GPT_R2/_src/sheet1–3` und wurden am 15.10. bereits als A, B und C aufbereitet. Hier stehen sie nicht doppelt. C bleibt draußen (V-259: Typ C TUNE).

## Sets

| id | Name | Formen | Raster / Hintergrund | Qualität | Empfohlen für |
|---|---|---|---|---|---|
| `clay_yellow_r3` | Knete gelb (FrizzleBob-Viseme) | 20 | 5×4, weiß, mit Beschriftung | gut | FrizzleBob, gelbe Figuren |
| `clay_neutral_r3` | Knete neutral (lippenlos) | 16 | 4×4 nach V-255, Alpha | sehr gut | Lord Hunky, Lady Dory, alle Figuren mit eigener Hautfarbe |
| `monster_lila_r3` | Monster lila (Reißzähne) | 12 | 4×3, weiß | gut, mit Lücken | Monster, Kreaturen, Bösewichte |

### clay_yellow_r3 (20 Formen)
- **Formen:** closed, smile_teeth, ah, eh, oh, oo, clench, fv, mbp, th, l, d, s_z, ch_j, r, sad, surprised, tongue_out, smirk, angry.
- **Namen:** Die Beschriftung des Bogens steht als `sheet_label` in `anchors.json`. Der Bogen nennt eine Form „E“; sie ist offen mit beiden Zahnreihen und heißt deshalb ehrlich `eh`. Für EE/S stehen `s_z` und `clench`.
- **Qualität:**
  - alle 20 Formen geschnitten, die Beschriftung ist entfernt;
  - kein weißer Rand (Zoom-Kontrolle `review/01_*_rand_zoom.png`);
  - keine Stauchung nötig, die höchste Form ist ah mit 1,68×.
- **Fehlt:** ein geschlossenes Lächeln; happy nutzt `smile_teeth`. `tongue_out` ist nur eine Reaktion und nicht für Sprechen gedacht (V-255).
- **Farbe:** Die Lippen haben die FB-Hautfarbe und sind eingebacken (`tintable: false`). Auf FrizzleBob verschmelzen sie mit der Haut, die Kontur kommt vom Kontaktschatten (siehe Review, gelbe Hälfte).

### clay_neutral_r3 (16 Formen)
- **Formen** (V-255-Reihenfolge): closed, mbp, small_open, mid_open, ah, ee, oh, oo, fv, l_th, smile_closed, smile_teeth, sad, surprised, grumpy, smirk_tongue (Signatur).
- **Aufbau:** Der Mund hat keine Lippen. Er besteht aus einem dunkelbraunen Rand, Zähnen, rotem Rachen und Zunge. Deshalb passt er auf jede Hautfarbe.
- **Färbbar** (`tintable: true`): Färbbar ist nur der Rand. Die Maske liegt in `tintmask/<id>.png` (255 = Rand). Eine Lippenfarbe gibt es nicht, Hautpixel auch nicht.
- **Qualität:** sauberer Alpha-Rand.
  - Höhenregel: closed ist nur ein Zahnstreifen, deshalb gilt das Gesichtsbudget wie bei C (147 px nativ) statt 1,7× closed.
  - ah, oh und surprised sind gestaucht; die Originale liegen als `*_full.png` bei.
- **Zwei Anpassungen**, damit der Rand erhalten bleibt (beide nur für dieses Set):
  - Die R2-Randübermalung ist abgeschaltet. Sie hatte den dünnen Rand mit Zahnfarbe verschmiert.
  - Die Lippenlinie kommt aus der Zahnlücke in der Mundmitte (`centre_gap`). Der dunkle Rand hatte sie bei smile_closed und grumpy falsch gesetzt.

### monster_lila_r3 (12 Formen)
- **Formen:** closed, mbp, small_open, mid_open, ah, smile_teeth, oh, oo, fangs_peek, grumpy, snarl, smirk.
- **Qualität:** sauber freigestellt. ah ist auf 1,7× gestaucht (Original 2,07×), oh auf 1,69× (Original 1,84×); beide Originale liegen als `_full` bei.
- **Fehlt:**
  - F/V; Ersatz ist fangs_peek.
  - L/TH; Ersatz ist small_open.
  - sad; Ersatz ist closed plus Mundwinkel nach unten.

## Ordner
- `<set>/`:
  - `X.png` (512², mit Kontaktschatten), `noshadow/`, `trim/`, `*_full.png`;
  - `anchors.json` (Schema wie `MOUTHS_GPT_R2/A`, plus `grid`, `fringe_*`, `sheet_label`);
  - `set.json` (Manifest-Eintrag des Sets).
- `mouth_sets.manifest.json`: alle 8 Sets für das ToolBox-Dropdown:
  - die 3 Decal-Sets auf main (nur verwiesen);
  - GPT A und B (Branch `assets/kfb-alien-figures-toolbox-2026-10-15`, nach dem Merge `ref` → main);
  - die 3 neuen Sets.
- `review/` je Set:
  - `formen` (1600 px; alle Formen auf Neutralgrau und FB-Gelb, blaue Linie = Oberlippe closed, rote Linie = Anker);
  - `anker_overlay`;
  - `rand_zoom` (4×).
- `_tools/`:
  - `cut_align_r3.py` importiert die Funktionen und Konstanten aus `MOUTHS_GPT_R2/_tools/cut_align.py`. Das ist derselbe Codepfad, nur mit Weiß-Freistellung und variabler Zeilenzahl.
  - Danach laufen `review_r3.py` und `build_manifest_r3.py [Staging-Wurzel]`.

## Manifest erweitern
Für ein neues Set wird **ein** Eintrag in `sets` angehängt: `id, label, format (decal13 | anchored_png), ref, path, shapes, visemeMap, emoteMap, tintable, source`.
- Wörter für `visemeMap`: rest, mbp, small_open, ah, ee, oh, oo, fv, l_th.
- Wörter für `emoteMap`: neutral, happy, angry, sad, surprised, blink.
- `petMouthVisemes` (closed, open, wide, round, smile) passt direkt zu pet-mouth.v1.
- Lücken stehen ehrlich in `gaps`.

Status aller drei neuen Sets: WS0-Vorschlag. Die Freigabe von Georg im Hub steht aus (Bildfolge `review/`).
