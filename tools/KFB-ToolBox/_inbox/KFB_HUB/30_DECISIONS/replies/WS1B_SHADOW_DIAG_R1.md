# WS1B_SHADOW_DIAG_R1 · Schatten in der Laufwelt (`#m1,harvest`) · 20.10.2026 · WS1b → WS0 → WS1

Georg hat die Live-Vorschau gemeldet (Bild im Chat, 20.10.):
1. Ring- und Fleckschatten am Baum, Clipping, schlimmer in Bewegung.
2. Helle Flächen auf dem Kopf von FB.
3. Kontaktschatten (AO) fehlen.

Auftrag von WS0: **nur Diagnose, nichts geändert.** Owner der Behebung ist WS1 (#439, Schatten-Probe).

## Reproduktion

- **Stand:**
  - Code: `combo/r2` @d762916 (Vorschau `ws1/preview` bd6e396; der Vorschau-Start ändert am Rendern nichts).
  - Ansicht: Laufwelt `#m1,harvest`, Stimmung Mesa Tag, Sonnenhöhe 38°, Richtung zur Sonne (−0,63 / 0,62 / 0,47).
  - Baum: `atlantis:t2` bei (11,93 / −0,14 / 26,61).
- **Messweg:** unsichtbares Playwright-Chromium mit echter GPU (`channel: 'chromium'`, `--use-angle=metal`, Renderer „ANGLE Metal, Apple M1 Max“), `dist/index.html#m1,harvest,debug`.
  - FB wird per `player().teleport` gesetzt, dann wird mit eigener Kamera gerendert.
  - Jede Gegenprobe ändert den Zustand nur für genau ein Bild und setzt ihn sofort zurück.
- **Skripte** liegen hier im Ordner `WS1B_SHADOW_DIAG_R1/` (`shadow-diag2.mjs`, `fbshadow-diag.mjs`, `undertree.mjs`, `head-diag.mjs`). Aufruf aus dem kfb-planet-Worktree nach `npx vite build`: Skript nach `test/` kopieren, `node test/<skript> <ausgabeordner>`.

## Befund 1 · Ring- und Lochschatten am Baum, schlimmer in Bewegung: Der Schattenkasten ist zu flach und zu schmal und wandert mit FB

**Ursache** (`src/m1/M1World.jsx:180-184` und `fitShadow` in `src/vendor/light/kfb-stage-light.v1.1.js:84-99`):
- Der Schattenkasten ist eine Kugel um FB, Radius `0,6K + Schattenlänge × 2,79K + 1K`, gemessen **r = 3,37 m**.
- Die Sonne sitzt nur `r + 1 m` vom Mittelpunkt, gemessen **2,8 m über dem Boden**. Die Nah-Ebene liegt 0,05 m davor.
- Folge: Alles, was im Lichtraum vor dieser Ebene liegt, fehlt in der Schattenkarte. Das sind vor allem Baumkronen (Höhe 2,6–4,3 m).
  - Gemessen: Baum `atlantis:t1` mit minDepth −2,01; Baum `utopia:t3` mit −10,55.
  - Der Deckel der Krone wird abgeschnitten, übrig bleibt der Mantel, also ein **Ring**. Die Fluff-Kugeln am Rand der Krone werfen weiter, daher die **Flecken am Ring**.
- Seitlich wirft alles außerhalb von ±3,37 m (Lichtraum) gar nicht.
  - Gemessen: Alle sechs nächsten Bäume ragen seitlich hinaus (maxLat 4,0–13,7 m), auch der Baum 2 m neben FB.
- **Bewegung:** Der Kasten folgt FB. Je weiter FB vom Baum weg ist, desto tiefer schneidet die Nah-Ebene in die Krone, und die Schattenränder springen.

**Beleg** `F_baumschatten_naehe.png`: FB in 1,5 / 3 / 4,5 / 6 m Abstand vom Baum, jeweils drei Spalten:
- **ist:** bei 4,5 m Loch, bei 6 m **Ring wie auf Georgs Bild**;
- **Nah-Ebene −60 m:** Kronenschatten vollständig;
- **dazu Kasten 3× breit:** auch Schatten weiter entfernter Bäume erscheinen.

**Hinweise für die Behebung** (Entscheidung bei WS1/WS0):
- Die Nah-Ebene bzw. die Lichtposition muss die höchsten Werfer einschließen, mindestens Kronenhöhe ÷ sin(Höhe) plus Rand. Der Tiefenbereich wird dadurch größer, Bias und Texel leitet `fitShadow` schon daraus ab.
- Seitlich reicht ein Kasten um FB nicht für Bäume im Bild. Möglich sind ein größerer Kasten, ein Kasten um den sichtbaren Bereich oder Kaskaden.
  - Bei Kaskaden ist mit V-385/V-429 (ein Rig, keine Zusatzlampen) zu klären, ob mehrere Schattenkarten einer Sonne zulässig sind.

## Befund 2 · Helle Flächen auf FBs Kopf: Teile des Kopfes empfangen keinen Schatten, die Ohren werfen keinen

Flags der FB-Meshes (gelesen im Spiel):
- `kfb-hair-tuft#1–3`: castShadow **ja**, receiveShadow **nein**.
- Brauen (`KFB single-curve eyebrow`), `KFB moustache`, `FB_Mouth_Smile`: receiveShadow **nein**.
- `FB_Ear_L_v5`, `FB_Ear_R_v5`: castShadow **nein** (receive ja).
- Körper, Kopf, Arme, Beine: DoubleSide (side 2). `castFrontFaces` lässt DoubleSide bewusst aus.

**Wirkung:**
- Steht FBs Kopf im Schatten, bleiben die Haarbüschel (und Brauen) hell, das sind die **hellen Flächen auf dem Kopf**.
- Im Bodenschatten fehlen die Ohren ganz: Der Schatten zeigt einen runden Kopf ohne Ohren.

**Beleg:**
- `K_kopf_im_kronenschatten.png`: links ist, rechts Gegenprobe „alle FB-Teile empfangen Schatten“; die Büschel werden dunkel.
- `T_fb_schatten_und_ao.png`, obere Reihe: FB-Schatten von oben, ohne Ohren in allen Varianten.
- `normalBias 0`, „Rückseiten werfen“ und „Kasten breit“ ändern am Kopf nichts. Akne bzw. Bias ist es also nicht.

**Hinweis:** Die Flags setzt vermutlich der Figuren-Aufbau (Haarbüschel aus `HairMod.mountTufts`, Ohren v5, Gesichtsteile). Die Stelle für die Behebung ist dort oder in einem Abschluss-Durchlauf im Spiel. Nicht geprüft habe ich, ob die Ohren absichtlich nicht werfen (z. B. gegen einen Selbstschatten auf dem Gesicht).

## Befund 3 · Kontakt-AO fehlt: Der Fleck sitzt auf FBs eigener Kollisionskapsel, 1,3 m über dem Boden

**Ursache** (`src/m1/M1World.jsx:205-207`):
- `GROUND_AT.fn` wirft einen Strahl von oben auf die Kollider.
- Der Filter schließt nur das Auto (`m2Car`) und markierte Kollider (`tag`) aus, **nicht die Spielerkapsel**. Der Strahl trifft also die Kapsel-Oberseite (Normale nach oben, wird angenommen).
- `createContactAO` legt den Fleck dorthin.

**Gemessen:**
- Am Start: Füße y = −0,081, Gelände −0,081, **AO-Fleck y = 1,230** (im Körper versteckt).
- Neben dem Baum: Füße −0,081, Fleck 1,23.
- Der Fleck der Partnerin auf der Bühne (y 1,31) wurde nicht weiter geprüft.

**Beleg:** `T_fb_schatten_und_ao.png`, untere Reihe:
- **AO ist:** kein Kontaktschatten.
- **Gegenprobe Fleck auf Fußhöhe:** Selbst richtig gesetzt ist der Fleck auf dem Weg kaum zu sehen.
  - Opazität 0,42 und Größe 1,25 × 1,0 (FB-Box × 1,08) liegen unter dem Sonnenschatten.
  - Für die Behebung also zwei Schritte: zuerst den Strahl die eigene Kapsel ausschließen lassen, dann Stärke und Form gegen Georgs Erwartung prüfen.

## Nicht Teil dieser Diagnose

- Fluff-Animation beim Drüberlaufen: baut WS1b auf `ws1b/fluff-pickup` (WS0-Auftrag).
- Der Volltest auf dem MacBook kann mit demselben GPU-Chromium laufen. Statt `--use-gl=swiftshader` in `test/_page.mjs` den Kanal `chromium` und Metal setzen. Damit wären `m1-move`, `m1-fence`, `light` und `scale` voraussichtlich in normaler Zeit machbar; nicht gemessen.
