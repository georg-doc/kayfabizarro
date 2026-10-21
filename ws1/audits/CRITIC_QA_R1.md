# Critic/QA R1 · Gelände-Probe · 21.10.2026

Rolle B, externer Critic/QA. Gefragt war, was ein fremder Spieler in den ersten 60 Sekunden als kaputt, billig oder unfertig sieht. Die Prüfung lief nur lesend: keine Änderung an der Probe, kein Push.

**Prüfling:** `~/kfb-ws1/probe/gelaende-probe.html` über den Server „gelaende-probe“ (Port 8751). Der Prüfling wurde während der Prüfung mehrfach aktualisiert (02:11 → 02:27 → 02:43 → 02:55 → 03:11 → 03:18). Zeilennummern gelten für den Stand **03:18:14, md5 `d145ad42…`**. Die P1-Messung lief zuletzt auf dem Stand 03:11 (neue Fahrphysik k2t @c2e46b8). Alle P1/P2-Fundstellen sind in 03:18 unverändert vorhanden. Weil sich die Datei laufend verschiebt, steht am Ende eine Tabelle mit eindeutigen Suchtexten je Fundstelle.

**Methode:** Headless Chromium (Playwright aus `kfb-planet-t439/node_modules`, `--use-angle=metal`), 1100 × 700, Pixelverhältnis 1, Debug-Hooks `__probeDrive()`, `__S`, `__hgt`, `__meshH`, `__LIFT`, `__probeCam`. Gemessen wurde pro Bild: Physiklage `P`, sichtbare Lage `carRoot`, LIFT, Kamera-Bodenabstand und Karosserie-Bodenabstand.

**Wertesätze:**
- **Standard:** Vorlage Tafelberge, Seed 7, Sonne 49°, Wasser 0, Fluid Island Kit.
- **Georg:** Sonne 12°, Erdung an, Wasser 0,06, Fluid „Wasser · Island Kit (F2)“.

## Zusammenfassung für Georg

1. **P1: Der Wagen schwebt sichtbar.** Bei normaler Fahrt hebt die Darstellung den Wagen in 19–25 % aller Bilder mehr als 0,5 m über den Boden, in der Spitze 3–5 m, teils mit Sprüngen um 1,3–1,5 m in einem einzigen Bild. Das HUD zeigt dabei „Boden“. Das sieht jeder Fremde in der ersten Minute. **Nach dem Umbau (03:54):** echtes Schweben nur noch in 4,7–6,7 % (Standard) bzw. 1,5 % (Georg) der Bodenbilder, höchstens ~1,4 m, keine Ruck-Sprünge mehr. Rest jetzt P2, siehe Nachprüfung.
2. **Ursache:** Die Physik prüft nur vier Schwebepunkte und die Mitte. Fährt das Heck oder ein Flügel in eine Terrassenwand, merkt sie das nicht, und LIFT hebt dann den ganzen Wagen an. Abhilfe: Ecken als Wand behandeln und LIFT deckeln. Ein Prüfskript liegt bei.
3. **Während der Prüfung behoben:** heller Streifen oben (02:43), Abrollen beim Start mit Standardwerten (bis 02:43), Wolken-Parallaxe hinter `//` (02:27). Regressionsskripte liegen bei und sind gegen v65 gegengeprüft.
4. **P2:**
   - Bei Sonne 12° bleiben die Schatten kurz und kastig, weil die Schattensonne auf 42° geklemmt ist.
   - Dünne Linien in den gemalten Wolken (an jeder Dreieckskante der Himmelskuppel).
   - Speedlines erscheinen als zwei Drahtlinien bis zum Bildrand.
   - „Grat-Gebirge“ startet auf einem 69°-Hang, der Wagen rutscht 17 m ab.
   - Boost bringt nur +18 %, die Auswahl verspricht dagegen „114/165“.
   - Das Panel läuft über, am Handy liegen die Kamera-Knöpfe außerhalb des Bildschirms.
5. **Ohne Befund:** Sprung, Weitsprung, Landung, Drift Q/E, Flug, Steckenbleiben (8 Fahrten, nie), Flackern (Standard 0,4 % der Bildpunkte, nur Wagen-Atmen und Wolken), Ufer und Wasser mit Island Kit, Reglerwechsel ohne Fehler. Bildrate headless: Übersicht 12 fps, Fahren 20 fps.

---

## P0 · keine

Keine Abstürze, keine Seitenfehler und kein Zustand, in dem man nicht weiterkommt. Das gilt für alle Läufe, über 60 Seitenaufrufe.

## P1

### P1-1 · Wagen schwebt bis 3–5 m über dem Boden („LIFT“), mit Sprüngen um über 1 m pro Bild

- **Wo:**
  - `gelaende-probe.html:3198`: `LIFT.y = pen > LIFT.y ? pen : …` (sofort hoch, sanft zurück, kein Deckel)
  - `:2991` `function liftPoints` (Unterseite als 7 × 11-Raster über die ganze Modellbox)
  - `:3004–3014` `DENV.ground` (Physikboden = Ebene durch vier Schwebepunkte, `void tip`: Nase, Heck und Seiten werden berechnet und verworfen)
  - `:3015` `sweep` (Wand nur, wenn der Boden **unter der Mitte** mehr als 1,2 m höher liegt)
- **Was falsch ist:** Die Physik lässt den Wagen so weit an Terrassenwände und Steilhänge heran, dass Heck oder Flügel 1–4 m in den Hang ragen. LIFT gleicht das nur in der Darstellung aus und hebt den ganzen Wagen an. Der Spieler sieht ein Auto, das bei 2 km/h zwei Meter in der Luft hängt, gekippt, mit dem Schatten weit darunter. Das HUD meldet dabei „Boden“.
  - Diagnose an der festen Stelle: Der Boden unter der Mitte liegt bei −3,23 m. 3,7 m dahinter, wo das Heck liegt, ist er bei +1,82 m (Terrassenwand der Tafelberge, Stufen 4). LIFT = 2,31 m.
- **Messung** (`qa-lift-float.mjs`, Stand 03:11):

  | Wertesatz | Bilder mit LIFT > 0,5 m | größter Sprung pro Bild | LIFT max |
  |---|---|---|---|
  | Standard | 25,2 % | 1,30 m | 2,8–4,9 m |
  | Georg | 18,9 % | 1,51 m | 2,9–4,6 m |

  In 8 freien Fahrten à 19 s (`t15`) lag LIFT in 3–29 % der Bilder über 0,5 m, das Maximum war 4,92 m.
- **Reproduktion:**
  1. Standard (Tafelberge, Seed 7) laden, „Fahren“ wählen.
  2. In der Konsole `__probeDrive().placeCar(36.7, -68.2, 1.92)` eingeben.
  3. W drücken. Nach unter einer Sekunde schwebt der Wagen 2,3–2,8 m hoch.

  Mit Georgs Werten: `placeCar(47.2, -87.7, 1.57)`, dann W und ⇧. LIFT springt von 0,38 auf 3,2 m.
- **Bilder:** `img/qa-p1-lift-schwebt-std.jpg` (Fahrkamera), `img/qa-p1-lift-schwebt-std-seite.jpg` (Seitenansicht, Schatten am Boden), `img/qa-p1-lift-schwebt-georg.jpg`.
- **Aufwand:** M. **Risiko:** mittel. Physik und Darstellung müssen zusammen geändert werden, und das alte Pendeln in Mulden darf nicht wiederkommen.
- **Vorschlag:**
  1. In `sweep` die vier Kastenecken an der Zielposition abtasten, die `tip` schon berechnet. Liegt eine Ecke mehr als 1,2 m über `base`, gilt das als Wand (gleiche Regel wie für die Mitte). Nur blocken, nicht anheben: Das alte Pendeln entstand durch das Anheben über Nase und Heck, nicht durch Wände.
  2. LIFT deckeln (z. B. 0,35 m) und den Anstieg pro Bild begrenzen (z. B. 0,08 m). Den Rest über eine Neigung um die Längs- und Querachse abfangen statt über Höhe.
  3. Das HUD zeigt „Boden“ nur, wenn LIFT kleiner als 0,3 m ist.
- **Prüfskript:** `tests/qa-lift-float.mjs [std|georg]`. Teil A prüft die feste Stelle, Teil B macht eine Stichprobe mit festem Seed. Aktuell FAIL in beiden Wertesätzen.

#### Nachprüfung nach Umbau (Stand 03:54, md5 `b9eb8d0c…`)

Die Owner-Sitzung hat P1-1 umgesetzt:
- Bug, Heck und Seiten blockieren wie eine Wand.
- Die Fahrfläche ist über Terrassenstufen geglättet.
- LIFT ist auf höchstens 1 m gedeckelt, steigt mit 6 m/s und richtet sich nach dem viertgrößten Eintauchpunkt.

LIFT > 0,5 m ist seitdem kein Maß für Schweben mehr. `qa-lift-float.mjs` misst deshalb in v2 echtes Schweben: Der tiefste Karosseriepunkt liegt mehr als Schwebehöhe h0 + 0,3 m über dem gezeichneten Boden (bzw. der Wasserfläche), obwohl `P.air = false`. h0 wird zur Laufzeit auf ebenem Boden bestimmt und liegt bei 45–47 cm.

| Stand | Schweben in Bodenbildern | max. Bodenfreiheit | größter sichtbarer Sprung/Bild | feste Stelle A |
|---|---|---|---|---|
| v69 (03:09, vorher), Standard | 14,9 % | 2,75 m | 1,74 m | schwebt 33 von 63 Bildern (2,42 m) |
| 03:54, Standard | 4,7–6,7 % (zwei Läufe) | 1,41–1,49 m | 0,40 m | sauber |
| 03:54, Georg | 1,5 % | 1,13 m | 0,30 m | – |

**Bewertung:** Deutlich besser. Die Ruck-Sprünge sind weg: 0,3–0,4 m pro Bild entsprechen der gewollten Gleitrate bei 20 fps headless. Die feste Stelle ist sauber. Mit Standardwerten bleibt sichtbares Schweben von etwa 1 m über ebenem Boden, immer an denselben Geländestücken, das HUD meldet „Boden“. Rang jetzt P2.
- **Reproduktion:** Tafelberge, `placeCar(141.4, 8.9, 6.2)`, W und ⇧. Nach ~0,7 km bei (141, 12) schwebt der Wagen 1,0 m über ebenem Boden (`img/qa-p1v2-schweben-2.jpg`). Zweite Stelle: um (60.4, 14.7, Gierwinkel 3.70), 1,41 m.
- `img/qa-p1v2-schweben-1.jpg` steht neben einem Stein und ist vermutlich ein Fehlalarm (Steine zählen im Skript nicht als Boden).
- **Vorschlag:** An diesen zwei Stellen prüfen, welcher Eintauchpunkt LIFT ≈ 1 m hält, obwohl die Unterseite frei ist. Vermutlich hält ein Punkt über einer Stufenkante, die die geglättete Fahrfläche nicht mehr kennt, LIFT oben. Das HUD sollte nach P1-1 Punkt 3 „Boden“ nur bei LIFT < 0,3 m zeigen.

### P1 · während der Prüfung behoben (Regressionsskripte liegen bei)

| Befund | Stand gefunden | behoben | Nachweis |
|---|---|---|---|
| **Heller Streifen oben:** harte waagrechte Linie auf Augenhöhe über die ganze Bildbreite, darüber heller Dunst; jedes Fahrbild, beide Wertesätze, auch Gold und Nacht | 02:11–02:27 | 02:43 (`step(rd.y,0.0)` im gemeinsamen Himmels-/Kulissen-Code ersetzt) | `img/qa-behoben-streifen-vorher-0215.jpg` / `…-nachher-0243.png`. **`tests/qa-top-band.mjs`** misst den Anteil der Spalten, die ±4 px um die berechnete Horizontzeile hell nach dunkel kippen. v65: 47–72 % → FAIL, 03:11: höchstens 12 % → PASS. |
| **Start rollt ab:** Standard (Tafelberge) startet auf (0,0) mit 35,3° Hang. Während „Racer lädt …“ rechnet die Physik ohne Schwebepunkte, liegt knapp über `flatNy 0.82` (≈ 34,9°), der Wagen rollt 11,5–14,9 m und pendelt ~8 s mit bis 29 km/h. Danach kroch er 1 cm/s seitlich. | 02:11 | bis 02:43 | **`tests/qa-spawn-rest.mjs`**: v65 FAIL (Tafelberge 14,9 m, 27 km/h), 03:11 Tafelberge 0,15 m → besteht. Grat-Gebirge siehe P2-1. |
| `SKY.uCamXZ.value.set(…)` stand hinter `//` und lief nie: Die gemalten Wolken hatten keine Parallaxe. | 02:11 | 02:27 (Audit C) | Code-Diff |

Hinweis zur ersten Diagnose des Streifens: Er verschwand auch mit „Kulissen aus“. Das lag aber am gemeinsamen Himmels-Code, den die Kulissen benutzen, nicht an deren Radius.

## P2

### P2-1 · „Grat-Gebirge“: Start auf 69°-Hang, Wagen rutscht beim Laden 17 m ab
- **Wo:** `:1623` (Vorlage Grat-Gebirge, Seed 311), `:3026` `let D = KD.createK2t(0, groundAt(0, 0) + RIDE, 0, 0)`. Der Startpunkt ist fest (0,0), es gibt keine Prüfung auf ebenen Boden.
- **Reproduktion:** Vorlage „Grat-Gebirge“ wählen (wird gemerkt) und die Seite neu laden. Der Wagen rutscht 17,3 m mit 22 km/h für 3,6 s, in beiden Wertesätzen. Mit Sanfte Hügel, Terrassen-Insel, Wirbel-Dünen und Biom-Reise steht er.
- **Aufwand:** S. **Risiko:** gering.
- **Vorschlag:** Startpunkt per Spiralsuche ab (0,0) wählen: erste Stelle mit weniger als 15° Neigung (vier Schwebepunkte) und über Wasser. Dasselbe nach `applyPreset` (`:2668`) und bei Seed-Wechsel.
- **Skript:** `tests/qa-spawn-rest.mjs`, aktuell FAIL nur Grat-Gebirge.

### P2-2 · Schatten bei tiefer Sonne: zu kurz, kastig, passt nicht zum Licht
- **Wo:** `:2628` `const es = Math.max(el, 42 * Math.PI / 180)`. Die schattenwerfende Sonne steht nie unter 42°, das Licht (`uSunDir`) folgt dagegen dem Regler bis 4°.
- **Was falsch ist:** Bei Georgs 12° fällt das Licht flach, und der Wagenschatten müsste etwa 7 m lang sein. Er bleibt aber ein kurzes, gleichmäßiges Rechteck dicht hinter dem Wagen, ohne Räder, Flossen oder Düse in der Kontur. Das liest sich als Kasten- oder Decal-Schatten, was V-564/V-568 ausschließen. Auf Wasser wird das Rechteck noch deutlicher.
  - Bild-Differenz Schatten an/aus, gleiche Stelle und Kamera: Der verdunkelte Anteil ändert sich über den ganzen Regler kaum (4°: 11,5 %, 49°: 9,8 %, 70°: 13,7 % der Bildpunkte).
- **Reproduktion:** Wasser 0 und `placeCar(107.7, -113.8, 0.6)` (eben). Übersicht mit `__probeCam(2.3, 0.62, 13)`, Sonne 12° gegen 49° vergleichen. Für Wasser: Wasser 0,06, gleiche Stelle.
- **Bilder:** `img/qa-p2-schatten-sonne12.jpg`, `img/qa-p2-schatten-sonne49.jpg`, `img/qa-p2-schatten-sonne12-wasser.jpg`.
- **Aufwand:** M. **Risiko:** mittel (Schattenkamera-Ausschnitt, Akne).
- **Vorschlag:** Die Schattensonne bis ca. 18–20° mitgehen lassen und dafür den Schattenkamera-Ausschnitt entlang der Sonnenrichtung strecken (statt fest ±55 m). Unter 20° die Schattenstärke weich zurücknehmen statt die Richtung zu klemmen. Die Kontur dann mit der kontakthärtenden Suche (`:2176` ff.) prüfen.

### P2-3 · Dünne Linien in den gemalten Wolken
- **Wo:** Himmelskuppel `:2351` (`SphereGeometry(900, 48, 24)`), Wolken-Shader `cloudLayer` `:2359–2369`.
- **Was falsch ist:** Graue, gerade, haarfeine Linien laufen senkrecht und schräg durch jede gemalte Wolke. Sie fallen auf, sobald der Himmel im Bild ist (Übersicht flach, Fahrt bergab).
  - Mit „Gemalte Wolken“ aus sind sie weg, mit „Wolken zum Vorbeifliegen“ aus bleiben sie.
  - Laufzeit-Test ohne Dateiänderung: Bei einer Kuppel mit 384 × 192 statt 48 × 24 Segmenten werden die Linien zu einem dichten Gitter. Sie sitzen also auf jeder Dreieckskante der Kuppel. Die Ursache liegt im Fragment-Shader (eine Größe, die an den Kanten springt, sehr wahrscheinlich eine `fwidth`-Ableitung des pro Dreieck linear interpolierten `vDir`), nicht in der Netzauflösung.
  - Die Linien waren schon vor der neuen `fwA`-Kantenglättung da (Stand 02:27) und sind es danach weiterhin.
- **Reproduktion:** Standard, `placeCar(-132.4, -52.8, 2.49)`, `__probeCam(0.8, 0.08, 120)`.
- **Bilder:** `img/qa-p2-wolkenlinien-2x.jpg`, `img/qa-p2-wolkenlinien-gesamt.jpg`, `img/qa-p2-wolkenlinien-kuppel-48x24.jpg` gegen `…-384x192-test.png`.
- **Aufwand:** S–M. **Risiko:** gering.
- **Vorschlag:** Die Blickrichtung im Fragment-Shader pro Bildpunkt aus `gl_FragCoord` und der inversen Projektion berechnen statt aus dem interpolierten `vDir`. Alternativ alle `fwidth`-Terme auf den geklemmten Wert `fw` begrenzen und testen, welcher Term die Linie zeichnet.

### P2-4 · Speedlines als zwei Drahtlinien bis zum unteren Bildrand
- **Wo:** `:3096` `const LIFE = 0.38, W = 0.05`, `:3104` Ausblenden nur 3–8 m vor der Kamera.
- **Was falsch ist:** Ab ~55 % Höchsttempo oder mit Boost ziehen sich zwei 5 cm dünne, fast gerade weiße Linien von den Heckecken bis an den unteren Bildrand. Bei 31 m/s × 0,38 s ist die Spur 12 m lang, die Kamera steht nur 11,6 m dahinter. Für einen Fremden wirkt das wie ein Zeichenfehler, nicht wie Fahrtwind.
- **Reproduktion:** Georg, `placeCar(157.1, 240.0, 1.49)`, W und ⇧ für 3,5 s, dann A.
- **Bild:** `img/qa-p2-speedlines.jpg` (auch sichtbar in `qa-p1-lift-schwebt-georg.png`).
- **Aufwand:** S. **Risiko:** gering.
- **Vorschlag:** Die Spurlänge über den Weg begrenzen statt über die Zeit (z. B. höchstens 0,4 × Kameraabstand). Die Breite zur Spitze hin stärker verjüngen und spätestens 2 m vor der Kameraebene ganz ausblenden. Die Effekt-Bildsprache (Audit D) hat die Form vorgegeben.

### P2-5 · Boost kaum spürbar, Tempo-Auswahl verspricht falsche Werte
- **Wo:** `:147` (Option „Spiel: 114 km/h, Boost 165“), `:2953` `TEMPO`, `:2974` `applyTempo`. Für „spiel“ ist der Faktor `k = 1`, also gelten die Spielwerte: `maxForward = 41 K`, `boostMaxForward = 48,5 K` mit `K = 0,651`.
- **Gemessen:** normal 96 km/h, Boost 114 km/h (+18 %). Hyper ergibt rechnerisch 294/348, Warp 842/997 statt 350/500 bzw. 1000/1200.
- **Reproduktion:** Georg, `placeCar(-172.6, -163.6, 1.68)` (ebene Bahn), W 6 s, dann W und ⇧ 6 s.
- **Aufwand:** S. **Risiko:** gering.
- **Vorschlag:** Die Beschriftung auf die echten Werte setzen. Ob +18 % Boost so gewollt ist, gehört ins Spiel (`k2t.js`), weil die Physik dort unverändert bleiben soll.

### P2-6 · Panel läuft über, am Handy sind die Kamera-Knöpfe nicht erreichbar
- **Wo:** `:52` `.recipe .bar { display: flex; … }` ohne Umbruch. Die vier Rezept-Knöpfe (`:198`) erzwingen 478 px Inhaltsbreite im 330-px-Panel.
- **Was falsch ist:**
  - Bei 1100 px Breite sind Regler und Vorlagen-Chips rechts abgeschnitten, und die Seite scrollt seitlich (`scrollWidth` 1249).
  - Bei 390 px liegen „Übersicht/Fahren“ außerhalb des Bildschirms. Das HUD zeigt dort direkt nach dem Laden „13 km/h“ (das alte Abrollen).
- **Bilder:** `img/qa-p2-panel-ueberlauf-1100.jpg`, `img/qa-p2-mobile-390.jpg`.
- **Aufwand:** S. **Risiko:** gering.
- **Vorschlag:** `.recipe .bar { flex-wrap: wrap }` und `.panel { min-width: 0 }`.

### P2-7 · Bildrate
- **Gemessen** (headless, M-Klasse, Pixelverhältnis 1, Georg-Werte; Median der Bildzeit über 150 Bilder):

  | Ansicht | Bildrate | Median Bildzeit |
  |---|---|---|
  | Übersicht | 12 fps | 83 ms |
  | Fahren | 20 fps | 50 ms |
  | Fahren mit Ringgitter | 20 fps | 50 ms |

  Die Übersicht ist die teuerste Ansicht. Georg sieht 9–15 fps. Die Kappung auf Pixelverhältnis 1,25 (Stand 03:11) hilft nur auf Retina und ist headless nicht messbar.
- **Vorschlag:** Kostenaufteilung siehe Audit C. Aus Spielersicht zählt zuerst die Übersicht beim Start, weil das das erste Bild ist.

## P3

| # | Befund | Reproduktion | Wo / Vorschlag | Aufwand |
|---|---|---|---|---|
| P3-1 | Wolkenkörper wirken von oben wie flache weiße Aufkleber auf Wasser und Gelände | Georg, `placeCar(157.1,240.0,1.49)`, Übersicht `__probeCam(0.8,0.45,700)` · `img/qa-p3-wolkenkoerper-von-oben.jpg` | Karten ausblenden, wenn die Kamera über ihrer Höhe ist oder steil darauf blickt | S |
| P3-2 | Nach einem Vorlagenwechsel fällt der Wagen bis zu 63 m (Grat-Gebirge → Terrassen-Insel) | Georg, `placeCar(-132.4,-52.8,2.49)`, Vorlagen der Reihe nach | `applyPreset` `:2668`: danach `placeCar(P.x,P.z,P.yaw)` bzw. Startsuche aus P2-1 | S |
| P3-3 | Tageszeitwechsel hängt bis 233 ms (Tag nach Gold oder Nacht), vermutlich Shader-Neuübersetzung | Regler „Tageszeit“ im Fahrmodus | an Audit C | S–M |
| P3-4 | Kamera kommt bis 0,31 m an den gezeichneten Boden (Soll `minClear 0.8`) | Georg, `placeCar(-150.0,78.7,5.4)`, 18 s Gas mit Zufallslenkung (`t15`) | `:3110` FCAM `collide`/`ground` nutzen `surfAt` (glatte Formel), gezeichnet wird das Dreiecksgitter: `Math.max(surfAt, meshH)` verwenden | S |
| P3-5 | HUD meldet „Boden“ beim Schweben über Wasser und während LIFT | siehe P1-1 | mit P1-1 | S |
| P3-6 | fps-Anzeige springt stark (500-ms-Fenster): HUD 28 bei gemessenem Median 20, HUD 9 bei 12 | jede Ansicht | `:3243` Median über 1 s | S |
| P3-7 | Tastenhilfe uneinheitlich: Panel (`:190`) nennt Q/E-Drift nicht, der Hinweis im Bild nennt X (Kippen) nicht | – | Texte angleichen | S |
| P3-8 | Viel Luftzeit: In freien Fahrten auf Tafelberge ist der Wagen 22–35 % der Zeit in der Luft (Georg bis 60 %), über jede Terrassenkante | `t15`, Seeds im Skript | Beobachtung, kein klarer Fehler; mit Georgs Fahrgefühl abgleichen (`takeoffGap` `:2972`) | – |
| P3-9 | 404 in der Konsole bei jedem Laden (eine Ressource, vermutlich Favicon) | Konsole | Favicon-Link setzen | S |

## Ohne Befund geprüft

| Bereich | Ergebnis |
|---|---|
| Sprung aus dem Stand | 1,85 m hoch, 1,25 s in der Luft; Landung ohne Nachfedern, Kamera weich |
| Weitsprung bei 114 km/h | 30 m weit, 1,5 m hoch (Georg 27,5 m) |
| Drift Q/E | Gierwinkel 160° in 2 s, Quergeschwindigkeit höchstens 1,3 m/s, kein Ausbrechen |
| Flug | Doppel-Leertaste: Flug; F: Landung; kein Sprung im Bild |
| Hangfahrt 25–32° | kommt hoch, keine Wand-Hänger |
| Steckenbleiben | 8 × 19 s Gas mit Zufallslenkung: nie länger als 1,5 s Stillstand |
| Kamera im Stand | ruhig (`rest-cam.mjs`: Kameraspanne höchstens 6 cm) |
| Flackern | Kamera eingefroren, Wabern aus: Standard 0,4 % kippende Bildpunkte (nur Wagen-Atmen und Wolken); Georg 20 %, das ist die Wasseranimation, kein Flimmern |
| Reglerwechsel im Fahrmodus | Seed, Höhe, Biome, Fluids, Vorlagen, Ringgitter, Racer, Tageszeit: keine Seitenfehler; Bildspitzen höchstens 100 ms (Tageszeit siehe P3-3) |
| Ufer und Wasser (Island Kit, Wasser 0,06) | Wagen schwebt sauber über der Fläche, harter nasser Saum, Wasser nimmt Schatten an (ab 02:27) |

## Prüfskripte (`research/audits/tests/`)

Alle Skripte nehmen das Argument `std` oder `georg`. `PROBE_URL=…` überschreibt Port 8751 (für Gegenproben gegen alte Stände). Ausgang 1 bedeutet FAIL.

| Skript | prüft | Stand 03:11 | Gegenprobe v65 (02:11) |
|---|---|---|---|
| `qa-lift-float.mjs` (v2) | P1-1 echtes Schweben + Sprung pro Bild | 03:54: FAIL Standard (4,7 %), Georg besteht beim Schweben (1,5 %) | v69 (03:09): FAIL (14,9 %, Sprung 1,74 m) |
| `qa-top-band.mjs` | heller Streifen (Regression) | PASS | FAIL (72 / 47 / 51 %) |
| `qa-spawn-rest.mjs` | Abrollen beim Start, alle Vorlagen, frischer Kontext | FAIL nur Grat-Gebirge (P2-1) | FAIL Tafelberge + Grat-Gebirge |

Zwei Fehlalarme habe ich beim Bau von `qa-top-band` ausgeschlossen: Bei Wasser 0,06 ist der Wasserhorizont eine echte waagrechte Kante, und ferne Fließfarbenbänder liegen flach zum Horizont (bis ~70 % Kantenanteil). Deshalb misst das Skript nur ±4 px um die berechnete Horizontzeile, und der Georg-Modus läuft mit Wasser 0.

## Fundstellen (Suchtexte, gültig unabhängig von Zeilennummern)

| Befund | Suchtext in `gelaende-probe.html` |
|---|---|
| P1-1 LIFT | `LIFT.y = pen > LIFT.y` · `function liftPoints` · `void tip` · `sweep: (from, delta)` |
| P2-1 Start | `let D = KD.createK2t(0, groundAt(0, 0)` · `'Grat-Gebirge':` |
| P2-2 Schatten | `const es = Math.max(el, 42` |
| P2-3 Wolkenlinien | `new THREE.SphereGeometry(900, 48, 24)` · `vec4 cloudLayer(` |
| P2-4 Speedlines | `const LIFE = 0.38` · `sstep(3, 8, SPL.b.length` |
| P2-5 Boost | `Spiel: 114 km/h` · `FLOW[n] = BASE.f[n] * k` |
| P2-6 Panel | `.recipe .bar {` |
| P3-4 Kamera | `minClear: 0.8` |
| P3-6 fps | `fpsT > 500` |
