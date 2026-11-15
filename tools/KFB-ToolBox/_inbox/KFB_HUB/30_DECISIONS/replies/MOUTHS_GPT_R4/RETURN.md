# RETURN · Mund-Bögen R4 · 15.11. (V-1765)

Quelle: `2D Animation Studio/KFB CartoonMouths/` (17 PNG, alle 1402 × 1122). Brief: `BRIEF_CHATGPT_MOUTHS_R4.md`. Werkzeug: `_tools/cut_align_r4.py` (unverändert, R1-Import bleibt).

## 1 · Alle 17 Bögen
Für alle gilt: Raster 5 × 4, 20 Münder, Reihenfolge wie im Brief (Prüfung je Zelle per Auge). Gleicher Maßstab: Breite der Ruheform 243–265 px in allen Bögen, breite Formen 0,91–1,10 davon, oh/oo 0,50–0,63. Keiner hält die Oberlippe auf gleicher Höhe: GPT zentriert jeden Mund in der Zelle. Das Werkzeug richtet das beim Schneiden aus.

| # | Datei | Hintergrund | Typ | Einheitlich? | Befund |
|---|---|---|---|---|---|
| S01 | ChatGPT-Bild 13_24_02-1 | echt transparent | round_clay | ja | Rosé, Lücke vorn; Zähne gerade statt schief |
| S02 | ChatGPT-Bild 13_24_02-2 | transparent | buck_grin | ja | zwei große Hasenzähne; Lippen voll statt schmal |
| S03 | ChatGPT-Bild 13_24_03-3 | transparent | full_soft | ja | Mauve-Braun, Lücke, ein Zahn schief |
| S04 | ChatGPT-Bild 13_24_03-4 | transparent | sausage | ja | Tomatenrot, drei Zähne mit Abstand; Lippen voll, keine Wurst-Linie |
| S05 | ChatGPT-Bild 13_24_04-5 | transparent | crooked_rogue | ja | spitzer Eckzahn rechts in jeder Zelle; Ruheform kaum schief |
| S06 | ChatGPT-Bild 13_24_05-6 | transparent | monster_maw | ja | violett, spitze Zähne oben und unten |
| S07 | ChatGPT-Bild 13_30_38 | transparent | neu: yellow_buck | ja | gelbe Rollen-Lippe, zwei Hasenzähne; surprised knapp über 1,7 |
| S08 | ChatGPT-Bild 13_30_57 | transparent | neu: grey_thin | ja | graue schmale Rollen-Lippe, kleine Zahnreihe; fünf Formen über 1,7 |
| S09 | ChatGPT-Bild 13_31_06 | transparent | neu: teeth_rows | **nein** | closed, mbp und smile_closed zeigen beide Zahnreihen: keine Ruheform → **nicht übernommen** |
| S10 | ChatGPT-Bild 13_32_13 | transparent | neu: olive_thin | ja | olive schmale Lippe, kleiner Spitzzahn; acht Formen über 1,7 |
| S11 | Claymation-Mund-Sprite-Sammlung-1 | transparent | neu: sausage_coral (v2) | teils | Koralle-Wurstlippe, Lückenzähne; ee mit Unterzähnen |
| S12 | Claymation-Mund-Sprite-Sheet-4 | transparent | sausage_coral (v5) | teils | wie S11; zehn Formen über 1,7 |
| S13 | Claymation-Mundausdrücke im Raster-2 | transparent | sausage_coral (v3) | teils | ee nur oben (gut) |
| S14 | Claymation-Mundausdrücke im Raster-3 | transparent | sausage_coral (v4) | teils | ee mit Unterzähnen |
| S15 | Claymations-Mund-Sprite-Sheet in 20 Varianten | **Schachbrett eingebrannt (RGB, kein Alpha)** | sausage_coral, rot | teils | **nicht übernommen**: nicht freistellbar; sad ohne Zähne |
| S16 | …mit 20 Ausdrücken-6 | transparent | sausage_coral (**Wahl**) | teils | ee nur oben, sauberste Reihe |
| S17 | Plastilin-Mund-Visemen-Sprite-Sheet-5 | transparent | sausage_coral (v6) | teils | ee mit Unterzähnen |

S11–S17 sind ein Typ in sieben Läufen: Wurst-Lippe wie Brief-Typ 4, aber Koralle statt Tomatenrot und zwei Lückenzähne statt „wenige große Zähne“. Darum eigener Name `sausage_coral`.

## 2 · Abgelegt und geschnitten
`_src/mouths_r4_<typ>.png` → `<typ>/` (20 Formen + Alias `th_tongue`, `teeth_small`, je 512 × 512, `trim/`, `anchors.json`). 15 Bögen, alle 20 Zellen gefunden, kein Zuschnitt am Rand, kein Grün- oder Farbsaum (Prüfung auf Grün-Bühne), keine Splitter.
- Typen: round_clay, buck_grin, full_soft, sausage, crooked_rogue, monster_maw, yellow_buck, grey_thin, olive_thin, sausage_coral.
- Varianten: sausage_coral_v2 … _v6 (S11, S13, S14, S12, S17).

**Werkzeug-Befund (nicht geändert, Regel):** `CLOSED_FAMILY` enthält `smirk` und `sad`. In allen 15 Bögen sind beide **offen** (Zähne). Die Lippenlinien-Messung landet im Mundinneren, die Form rutscht nach oben: smirk −14 bis −27 px, sad bis −62 px (sausage_coral). Vorschlag, eine Zeile: `CLOSED_FAMILY = ['closed', 'mbp', 'smile_closed']`, dann neu laufen lassen. Die Hub-Bilder setzen sad und smirk schon so (Oberlippe).

**Höhe:** Schmal-Lippen-Typen (grey_thin, olive_thin, sausage_coral) haben eine flache Ruheform. Viele Formen liegen über 1,7; Stauchen auf 0,8 reicht nicht (olive_thin surprised 2,57 → 2,06). Für diese Typen 1,7 gegen die mittlere Öffnung messen oder stärker stauchen; WS0 entscheidet.

## 3 · Wahl je Typ und kaputte Zellen
| Typ | Wahl | Kaputte Zellen |
|---|---|---|
| round_clay | S01 | keine |
| buck_grin | S02 | keine (ganzer Bogen: Lippen voll statt schmal) |
| full_soft | S03 | keine |
| sausage | S04 | keine (ganzer Bogen: keine Wurst-Linie) |
| crooked_rogue | S05 | keine (closed/mbp kaum schief) |
| monster_maw | S06 | keine |
| yellow_buck | S07 | keine; surprised wird gestaucht |
| grey_thin | S08 | keine; fünf Formen gestaucht |
| olive_thin | S10 | keine; acht Formen gestaucht |
| sausage_coral | S16 | **fv**: Zähne sitzen unten, wirkt wie Unterzähne · **disgust**: Zunge raus (Spec R1 verbietet das) |
| sausage_coral_v2–v6 | – | wie S16 (fv, disgust); dazu **ee_wide** mit Unterzähnen in S11, S12, S14, S17 |
| teeth_rows (S09) | nicht übernommen | closed, mbp, smile_closed mit Zähnen |
| S15 | nicht übernommen | eingebranntes Schachbrett |

Ersatz ohne Neumalen: sausage_coral fv → `l_th` oder `small_open`; disgust → `grimace`.

## 4 · Hub-Bilder (`hub/`)
Je Bild zwei Bögen nebeneinander, geschnitten und ausgerichtet, gleicher Maßstab, Typname groß darüber (= Optionswort). Kaputte Zellen rot umrandet.
1. `hub_1_round_clay__full_soft.jpg`
2. `hub_2_buck_grin__yellow_buck.jpg`
3. `hub_3_sausage__sausage_coral.jpg`
4. `hub_4_crooked_rogue__monster_maw.jpg`

grey_thin und olive_thin sind geschnitten, aber nicht im Hub (Höhenproblem, sonst fünftes Bild).

## 5 · Was als Nächstes fehlt
**Spiel (`src/modules/mundSaetze.js`, `headpartMouth.js`, nur WS0/WS1):**
- Die R4-Ausgabe hat das R1-Format. Das Spiel liest das R2-Format (`mouths-gpt-a|b`): Anker y 220 = Lippenlinie mit Kopfraum, `upperLift` 0,35 eingebacken, Kontaktschatten, `*_full.png`, und **`closed_width_px`**. R4-`anchors.json` hat kein `closed_width_px`; `headpartMouth.js` rechnet damit die Decal-Breite und setzt sonst die volle Leinwand an (Mund etwa halb so breit). Nötig: R4-Ausgabe durch den R2-Schritt (`MOUTHS_GPT_R2/_tools/cut_align.py`, Raster/IDs wie R4) oder R4-Werkzeug um diese Felder ergänzen.
- Ablage je Satz: `src/assets/actors/mouths-r4-<typ>/`; in beiden Modulen `ORDNER` um `r4_<typ>: 'mouths-r4-<typ>'` ergänzen.
- `FORM` für R4 neu: `f: 'fv'`, `l: 'l_th'`, `uh: 'mid_open'`, `s: 'grimace'` (statt `th_tongue`/`teeth_small`); Rest bleibt (neutral closed, smile smile_closed, m mbp, d small_open, ee ee_wide, ah ah, oh oh, r small_open, woo oo). Gefühle (laugh, sad, angry, surprised, scared, disgust) als Mimik-Schlüssel.
- `ERSATZ` für sausage_coral: `f → l_th`, Mimik disgust → grimace.
- Danach Sprech-Clip auf einer Figur als Hub-Frage, dann WSB backt neu.

**ToolBox (WSA Work, Patch-Felder):**
- Figurenkarte `mouth`: `owner: "decal-set"`, `set: "r4_<typ>"`, `setLabel` (= Typname wie im Hub), `path`, `rest: "closed"`, `default: "smile_closed"`, `upperLift`, `anchor.node` / `anchor.width`.
- Charakter `appearance.mouth.v.set` = derselbe Satzname; `visemeMap` um die neuen Formen erweitern (fv, l_th, mid_open, laugh, smirk, sad, angry, surprised, scared, disgust).
- Auswahlliste der Mund-Sätze um die gewählten R4-Typen ergänzen.
