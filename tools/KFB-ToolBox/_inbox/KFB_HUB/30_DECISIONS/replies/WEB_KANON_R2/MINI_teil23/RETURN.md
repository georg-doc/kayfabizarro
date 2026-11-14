# Web-Kanon R2 · Teile 2 bis 4 · RETURN (WSB, Mac mini, 14.11.2026, V-1751/V-1752)

Teil 1 (FB r1d) ist geliefert: `50_BLENDER/FB_WEB_KANON_R1/RETURN_r1d.md`. Dazu kamen R2b (Agent+Twin, Requisiten) und r1e. Hier folgen Teil 2 (Augen-Beleg Hunky/Dory) und Teil 3 (Kopfschatten und Dorys Farben im Spiel). Teil 4 (ML v2 R2) steht in `50_BLENDER/WSB_ML_V2_KK_R2/RETURN.md`.

## Teil 2 · Hunky und Dory: Augen-Beleg nah
Je ein Blatt, nur Augen und Lider, Spiel links und Web rechts, sechs Zustände: offen vorn, offen seitlich, halb, zu, Blick links, Blick rechts.
- `blaetter/A1_hunky_augen.jpg`: zwei Stielaugen, Schielen converge 0,35.
- `blaetter/A2_dory_augen.jpg`: ein Auge, Seite C.

**Aufbau des Belegs:**
- Spielseite: Spielfigur aus dem Stamm @9b18f5acd (Figurendateien `lord_hunky`/`lady_dory`), im Spiel-Rig gestellt.
  - halb = Oberlid auf halbem Weg zu zu, wie der Morph `oben_halb`;
  - zu = beide Lider zu;
  - Blick = `pointTo(∓0,8, 0)` der Augen-Feder, eingeschwungen.
- Webseite: die r1-Dateien, Morph `oben_halb` bzw. `zu` auf 1, Blick mit der Regel der Datei.
- Kamera auf die Augen gerichtet. Der Augen-Kasten ist im Spiel und im Web auf den Zehntelmillimeter gleich, also ist auch die Kamera gleich.

**Ergebnis:**
- Form, Lider, Lidhaut, Pupille und Schielen decken sich in allen sechs Zuständen.
- Mittlere Abweichung je Pixel:
  - Hunky 1,3–3,2;
  - Dory 3,1–5,5 (die größere Abweichung bei Dory kommt von der dunkleren Kopfunterseite im Web, siehe Teil 3).
- **Blickwinkel:**
  - Dory: Spiel und Web drehen das Auge um 0,400 rad.
  - Hunky: Das Spiel kappt den Gesamtwinkel je Auge bei 0,5 rad (`augenR2.js` `kappeBlick`). Bei Blick links steht das äußere Auge also auf −0,500 statt −0,575, das innere auf −0,225.
  - Das Blatt zeigt die Web-Seite mit dieser Kappe, die Werte decken sich dann genau.
  - In der r1-Datei steht die Kappe nicht in der Steuerregel. Der Gesichts-Leerlauf-Clip von Hunky geht beim weitesten Blick 0,025 rad (1,4°) darüber.
  - Beides ziehe ich in der nächsten Hunky/Dory-Fassung nach, zusammen mit dem vollen Mund-Rig wie bei FB r1d.
- Daten in `data/teil2/` (Augen-Kasten, Blick-Knoten je Zustand, Metrik).

## Teil 3 · Kopfschatten und Dorys Farben: Spiel an die Web-Datei angleichen
### Ursache
Gemessen in derselben Szene wie das Bildpaar (gleiche Lichter, gleiche Kamera, Spiel-Materialien im Spiel-Renderer): Jeder Figuren-Anteil am Material wurde einzeln umgeschaltet und gegen die Web-Datei verglichen.
- **Verantwortlich ist der Bodenanteil der Rig-Hemisphäre auf Figuren:** `uFigGround` = 2,5 in `applyFigureShadow` (`terrain3.js`, gesetzt in `M1World.jsx` `FigureShade`, q300).
  - Er hellt jede nach unten gewandte Fläche um das 2,5-Fache auf: Kopfunterseite, Kinn, Bauch, Unterseite der Arme.
  - Dabei kommt der Bodenton ins Material, deshalb wirkt Dorys Orange heller und flacher.
  - Bei den Figurenpixeln liegt das Spiel heute um +3,9 … +7,4 (0–255) heller als die Datei; mit 1,0 sind es nur noch +0,3 … +1,2.
- **Nicht verantwortlich:**
  - `figamb` selbst: bei Tag Faktor 1,0;
  - die Fuß-Abdunklung;
  - die gedämpfte Eigenverschattung (0,55, q300). Volle Eigenverschattung macht den Abstand sogar größer (Dory Gesicht 9,5 → 20,4), sie bleibt also.
- **Werte** (Abweichung der Figurenpixel zur Web-Datei, vorn / seitlich / Gesicht), Gesamttabelle in `data/teil3/bodenlicht_varianten_metrik.json`:

| uFigGround | FB | Hunky | Dory |
|---|---|---|---|
| 2,5 (heute) | 6,1 / 5,1 / 11,0 | 5,7 / 4,7 / 8,8 | 6,0 / 5,8 / 9,5 |
| 1,75 | 4,5 / 3,4 / 8,1 | 3,9 / 3,1 / 6,9 | 4,0 / 4,1 / 6,7 |
| 1,5 | 3,9 / 2,8 / 7,2 | 3,3 / 2,6 / 6,2 | 3,3 / 3,5 / 5,7 |
| 1,25 | 3,4 / 2,2 / 6,3 | 2,7 / 2,1 / 5,6 | 2,6 / 2,9 / 4,7 |
| **1,0** | **3,0 / 1,7 / 5,7** | **2,2 / 1,6 / 5,1** | **2,0 / 2,4 / 3,8** |

### Änderung (`diff/figamb2_gegen_9b18f5acd.r2.diff`, 2 Dateien, +9 −2)
Die Dateien sind von @9b18f5acd bis @5cbd2bd2 unverändert; der Diff passt auf beide.
- **`src/look/figureAmbient.js`**, im vorhandenen Figuren-Weg (figamb, V-692):
  - Kommentarblock: Ursache und Messung, warum 1,0 gewählt ist und was bleibt (Eigenschatten 0,55, Belichtung FIG_AMB).
  - `FIGAMB_V2`: der Schalter `figamb=2` aus dem Hash, nach dem Muster von `FIGAMB_ON`.
  - `FIG_AMB_V2 = { ground: 1.0 }`: der eine Wert, gemessen als bester für FB, Hunky und Dory. Das ist auch der Wert der Web-Datei und von `figschatten=1`.
  - `figurBodenlicht(heute)`: ohne `figamb=2` kommt der heutige Wert unverändert zurück; ein Wert für alle Figuren, kein Figuren-Sonderweg.
- **`src/m1/M1World.jsx`:**
  - Import von `figurBodenlicht` neben den anderen figamb-Teilen.
  - `FigureShade`: `uFigGround` startet mit `figurBodenlicht(FSCH ? FIGSCHATTEN.bodenlicht : FIG_GROUND)`. Das ist dieselbe Uniform auf demselben Schattenweg (V-1729); keine neue Lichtquelle, kein neuer Shader-Teil.
- **Ohne `figamb=2` bleibt alles wie heute.** Im Probe-Build mit Diff gemessen: ohne Schalter `uFigGround` 2,5, mit Schalter 1,0. `figamb=0` schaltet wie bisher den ganzen figamb-Weg ab.

### Beleg
- **`blaetter/L1_figamb2_paare.jpg`:** Spiel heute / Spiel mit `figamb=2` / Web-Datei für FB, Hunky und Dory, vorn, Gesicht und seitlich, gleiche Kamera und Lichter wie das Bildpaar.
  - Abweichung der Figurenpixel heute → mit `figamb=2`:
    - FB 6,1 / 5,1 / 11,0 → 2,7 / 1,7 / 4,6
    - Hunky 5,7 / 4,7 / 8,8 → 2,1 / 1,6 / 4,6
    - Dory 6,0 / 5,8 / 9,5 → 2,1 / 2,4 / 4,4
  - Gebaut aus @9b18f5acd + Diff, nur lokal.
- **`blaetter/L2_figamb2_tageslicht.jpg`:** aus dem laufenden Spiel bei Tageslicht (tod=11), heute gegen `figamb=2`.
  - Oben ganz und Kopf mit Spiel-Szene, -Himmel und -Licht, Kamera vor FB.
  - Unten die Spielansicht, wie gespielt.
  - **Zu sehen:** Mit `figamb=2` bekommt der Kopf unten den Schatten wie in der Datei.
  - In dieser Szene steht die Sonne hinter FB. Dann wird er auch vorn insgesamt deutlich dunkler, weil die Bodenaufhellung bisher die ganze Schattenseite getragen hat.
  - Ob das so gewollt ist oder ein Mittelwert besser passt (1,25 bzw. 1,5, Werte oben), entscheiden Georg bzw. WS0. Der Wert steht an einer Stelle (`FIG_AMB_V2.ground`).

Daten in `data/teil3/`, Skripte in `scripts/` (`licht.mjs`: Licht-Studie mit umschaltbaren Figuren-Uniforms; `tag.mjs`: Tageslicht-Bilder; `augen.mjs`: Augen-Beleg).
