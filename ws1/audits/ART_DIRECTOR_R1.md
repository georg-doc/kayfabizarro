# Art Director R1 · Gelände-Probe und Spiel `#m1,harvest,look=terrain3`

Stand 21.10.2026 · externe AD-Prüfung, nur lesend · nichts geändert, nichts gepusht

## Zusammenfassung für Georg (5 Zeilen)

1. Die Fließfarben mit harten Bandkanten tragen. Nah und mittel liest sich das Gelände als Lozzi-Malerei, und das ist der Kern, auf dem wir aufbauen.
2. Als *ein* Stil liest es sich noch nicht. Gegen die Malerei arbeiten vor allem Polygon-Zacken in der Ferne, eine harte Dunstlinie quer durchs Bild, pixelig zerfranste Wolken und Blendenflecken wie bei einer Fotokamera.
3. Der größte Materialbruch sind die Racer: Rost- und Chrom-Fototexturen neben Knete und Fließfarbe, in der Probe genauso wie im Spiel.
4. Mit deinen Werten (12°, Wasser 0,06, Island Kit; mit Erdung an wie aus) stehen Bäume und Büsche im See. Der Sonnenstand ändert am Gelände fast nichts, und das Wasser übernimmt die Nachtstimmung nicht.
5. Sofort und billig (S) zu beheben sind Dunstlinie, Wolkenkanten, Bäume im Wasser, Blendenflecken und Spiel-Staub. Danach folgen in M die Fern-Zacken, die Racer-Malweise und die Luftperspektive im Spiel.

---

## Prüfaufbau

- **Probe:** `~/kfb-ws1/probe/gelaende-probe.html` (Stand 21.10. 01:59, md5 `ca671b6d…`), ausgeliefert über Server „gelaende-probe“ auf :8751. Vorlage „Tafelberge“, Racer `rustwing_cruiser`.
- **Spiel:** `kfb-planet-t439` @ `eac5cb0`, `npm run build`, `dist/index.html#m1,harvest,look=terrain3`, zusätzlich `#m1,car,harvest,look=terrain3` für das Fahrzeug.
- **Zwei Wertesätze**
  - **Standard:** Sonne 49°, Wasser 0, Fluid Island Kit, Erdung an.
  - **Georg:** Sonne 12°, Wasser 0,06, Fluid „Island Kit (F2)“, Erdung aus (Stand seines Tabs laut Brief).
  - **Georg mit Erdung an** (Nachtrag auf Wunsch der Owner-Sitzung): Sonne 12°, Wasser 0,06, Island Kit, Erdung an. Bilder `georgE-*`, Vergleich `B12`.
- **Technik:** Headless-Chromium mit `--use-angle=metal`, Fenster 1400×900, Bühne ≈ 1024×640. Bei 11–41 fps sind Bewegtbilder (Wabern, Fließen) nur stichprobenhaft beurteilt.
- **Skripte zum Nachstellen** (Muster `probe/tests/*.mjs`), alle in `research/audits/ad-r1-skripte/`:
  - `ad-probe.mjs <out> std|georg|georgE`: 12 Kameras
  - `ad-probe2.mjs <out>`: Ein/Aus-Vergleiche, Sonnenreihe, Stimmungen, VFX
  - `ad-game.mjs <out>`: Spiel
  - `crop.mjs` und `sheet.mjs`: Ausschnitte und Bögen
- **Bilder:** `ws1/audits/img/` (JPEG). Präfixe:
  - `std-*`, `georg-*` und `georgE-*`: Probe mit dem jeweiligen Wertesatz
  - `spiel-*`: Spiel
  - `B01…B12`: Befund-Ausschnitte

### Nachtrag: Georgs Werte mit Erdung an

- Die Erdung ändert den Gesamtlook kaum. Sichtbar wird sie nur als dunklere Kontaktzone an Steinen und Bäumen und an den Kronen-Unterseiten. Alle Top-10-Befunde gelten mit Erdung an genauso.
- **Schatten am Hang** (`georgE-05-ufer-fahrt.jpg`): Der Wagenschatten ist eine harte, dunkle Form, die bergab vom Wagen wegrutscht. Das ist gut lesbar, wirkt aber abgehoben; zu Befund 9.
- **Seeufer** (`georgE-12-ufer-orbit.jpg`): Die Grate über dem See zeigen die Zacken aus Befund 1 am deutlichsten. Wasser und Ufer selbst lesen sich gut.
- **Bäume im See** (Befund 7): Der Fehler hängt nicht an der Erdung, sondern an der Platzierung. Er gilt also auch mit Erdung an.
- Vergleich aus/an: `img/B12-georg-erdung-aus-an.jpg`.

## Gesamturteil: ein Cartoon-Stil?

**Noch nicht.** Im Bild arbeiten drei Bildsprachen gegeneinander:

| Schicht | Wirkt wie | Urteil |
|---|---|---|
| Fließfarben-Gelände nah/mittel, Knet-Amphitheater, KayKit-Bäume, Hase FrizzleBob | Lozzi/Hanna-Barbera, gemalt | **trägt**, das ist KFB |
| Fernringe, Grate, Felskanten, Wolkenfetzen | 3D-Technik ohne Malerhand: Dreiecke, Treppen, Rauschen | Bruch (Georgs „Nein“-Liste) |
| Racer-Texturen, Blendenflecken, Kit-Wasser in der Ferne | Foto, Kamera, Realismus | Bruch (Fremdsprache) |

Die Rangfolge unten richtet sich nach drei Fragen: Wie oft sieht man es, wie stark bricht es den Stil, und widerspricht es einem gültigen Urteil von Georg?

---

## Top 10 Brüche der Bildsprache

### 1 · Polygon-Facetten und Zacken in Fernringen und Felskanten
- **Wo:** `gelaende-probe.html:2162`. `RINGS` sind Ferngitter mit `SIZE*4`/`SIZE*16` und grobem Raster, Flachnormalen sind dort sichtbar. Nah kommen die Felskanten der Tafelberge dazu (Anti-Zacken-Logik `hgt`, Z. 1614–1619).
- **Was:** Ferne Grate zerfallen in senkrecht gestreckte Dreiecke („Vorhang“) und Sägezahn-Silhouetten. Nahe Steilkanten zeigen Keilfacetten. Georgs Urteil „Polygon-Facetten, Zacken = Nein“ ist damit in jedem Horizontblick verletzt.
- **Bilder:**
  - `img/B04-fernzacken.jpg`: Ausschnitt aus `georg-07-boost.jpg`
  - `img/std-03-horizont-gegen.jpg`: Vordergrund-Keile
  - `img/georg-03-horizont-gegen.jpg`
  - `img/vfx-landung.jpg`: oben rechts
  - `img/georgE-12-ufer-orbit.jpg`: Sägezahn-Grate über dem See, mit Georgs Werten am deutlichsten
- **Nachstellen:** `ad-probe.mjs … std`, Kamera `__probeCam(2.6, 0.08, 120)`.
- **Soll (Skizze):**
  - Fernberge als **runde Knet-Kuppen mit einer klaren Silhouettenlinie**, wie die Kulissenringe (K1–K3), die bereits gut funktionieren.
  - Ab ca. 300 m nur große Formen (`hlow`, 2 Oktaven).
  - Die Normale kommt im Fragment-Shader aus der Höhenfunktion statt aus dem Dreieck. Die Silhouette bleibt hart, die Fläche gemalt.
  - Nah gilt: Steilkanten als gerundete Wülste, nie als Keil.
- **Vorschlag:**
  - (a) Ferngitter in Distanz auf `hlow` tiefpassen, damit Höhenamplitude ab Ring 2 nur aus den Makroformen kommt.
  - (b) Shading der Ringe über `dFdx/dFdy` der *glatten* Höhe statt Flat.
  - (c) Max. Hangneigung als harte Obergrenze auch im Ring anwenden.
- **Aufwand und Risiko:** Aufwand M, Risiko mittel. Die Fernform ändert sich, deshalb danach auf Bodenkontakt und Nebelkante prüfen.

### 2 · Harte Dunstlinie quer durchs Bild (Horizontnaht)
- **Wo:** `gelaende-probe.html:1824`:
  ```glsl
  sky=mix(sky, edgeT, max(smoothstep(0.55,0.95,f), step(rd.y,0.0)*0.6));
  ```
- **Was:** `step(rd.y,0.0)` schaltet den Luftton *in Blickrichtung* hart um. Jede Fläche, die in Augenhöhe der Kamera liegt (das sind beim Fahren die nahen Hänge), bekommt eine **waagrechte Bildschirmlinie**. Darüber ist die Fläche heller, darunter dunkler. Das ist vermutlich der offene „helle Streifen oben“ aus dem QA-Brief.
- **Bilder:**
  - `img/B01-horizontnaht.jpg`: aus `std-04-fahrt-start.jpg`, Linie auf Höhe ~y 105
  - `img/georg-05-ufer-fahrt.jpg`
  - `img/georg-07-boost.jpg`
  - `img/vfx-landung.jpg`
- **Nachstellen:** Fahren-Kamera, beliebiger Spawn mit Hang in Augenhöhe.
- **Soll:** Luftton gleitet stetig. Nahe Flächen bekommen keinen Kulissenton, nur ferne.
- **Vorschlag (Diff, nicht angewendet):**
  ```diff
  - sky=mix(sky, edgeT, max(smoothstep(0.55,0.95,f), step(rd.y,0.0)*0.6)); }
  + sky=mix(sky, edgeT, max(smoothstep(0.55,0.95,f), smoothstep(0.03,-0.03,rd.y)*0.6*smoothstep(0.15,0.45,f))); }
  ```
  Der zweite Faktor koppelt den Kulissenton an die Luftmenge `f`. Nahe Hänge (f≈0) bleiben unberührt, die Ferne behält U4 („unter dem Horizont nie heller als K1“).
- **Aufwand und Risiko:** Aufwand S, Risiko niedrig. Danach Kulissen-Übergang am Horizont gegenprüfen (H13/U4).

### 3 · Pixelige, zerfranste Kuppelwolken
- **Wo:** `gelaende-probe.html:2259–2266` (`cloudLayer`):
  - `if(n<th-0.01) return` steigt vor der Kante aus.
  - `fwidth` wird in divergentem Fluss gemessen.
  - `step(n2+0.012,n)` legt eine harte Licht/Schatten-Grenze ohne Kantenglättung.
  - `orig`-Pfad mit fester Kantenbreite `0.012` im Rauschraum: am Horizont, wo `p=d.xz/(d.y+ph)` explodiert, ist sie kleiner als ein Pixel.
- **Was:**
  - Treppenkanten in 2-Pixel-Blöcken.
  - Bläuliche Schattenfetzen und hunderte Kleininseln, also ein **Tarnmuster** statt Wolken.
  - Am Horizont stapeln sich die Fetzen zu Rauschen.
  - Georg hat „pixelig“ bei Schatten bereits als hartes Nein gesetzt, am Himmel wirkt es genauso.
- **Bilder:**
  - `img/B02-wolkentreppen.jpg`: 2× vergrößert
  - `img/std-02-horizont.jpg`
  - `img/tod-gold.jpg`
- **Soll (Skizze): Hanna-Barbera-/TinySkies-Kumulus.**
  - **5–9 große Wolkenkörper** je Blick, jeder aus 3–5 runden Beulen.
  - Flache Unterseite im Schattenton, Oberseite im Lichtton, **eine** saubere Trennlinie.
  - Keine Fetzen unter ~1,5 % Bildbreite. Zum Horizont kleiner und dichter, aber nie Rauschen.
- **Vorschlag:**
  1. `fwidth(n)` *vor* jedem `return` berechnen (uniformer Fluss) und `fw=max(fwidth(n), 0.004)` auch im `orig`-Pfad nutzen.
  2. `step(n2+0.012,n)` ersetzen durch `smoothstep(n2+0.012-fw, n2+0.012+fw, n)`.
  3. Form aus `fbm4` mit nur 2 Oktaven für die Silhouette, die Oktaven 3–4 nur innerhalb der Kante als Licht/Schatten-Beulen.
  4. Kleinflächen-Filter: `n` gegen ein grob gefiltertes `n_low` gaten (`m*=smoothstep(th-0.05, th+0.02, n_low)`).
  5. Ab `d.y<0.08` die Deckung ausdünnen statt verdichten.
- **Aufwand und Risiko:** Aufwand S für 1–2, M für 3–5. Risiko niedrig. Das Spiel übernimmt `sky-r13.js` 1:1 und muss mitgezogen werden (`src/modules/sky-r13.js`, erzeugt von `probe/port/gen_sky.py`).

### 4 · Fotoreale Racer neben Knete und Fließfarbe
- **Wo:**
  - Probe: `gelaende-probe.html:2636` (`RACERS`, GLB aus `probe/racers/*.json`)
  - Spiel: `src/m2/M2Car.jsx:46` (`RACER` aus `VEHICLE_RIG`)
- **Was:**
  - Rost, Kratzer, Chrom-Glanz, Fotoschmutz und entsättigtes Blaugrau bzw. Rostrot. Neben dem flachen Gelände ist das ein anderes Medium.
  - Im Spiel steht der knetige Hase direkt daneben, und der Kontrast ist noch größer.
  - Die Silhouetten selbst (Flossen-Kreuzer, Düsen) passen gut zu Looney-Tunes-Dieselpunk. Nur die **Oberfläche** bricht.
- **Bilder:**
  - `img/std-04-fahrt-start.jpg`
  - `img/georg-07-boost.jpg`
  - `img/vfx-drift.jpg`
  - `img/spiel-car-03-dreh.jpg`
  - `img/spiel-car-04-himmel.jpg`
- **Soll (Skizze):**
  - Karosserie in **3 Palettentönen**: Licht, Schatten, Akzent.
  - Metall nur als gemalter Glanzstreifen (ein harter weißer Strich).
  - Fenster als flaches Dunkelblau mit einem Glanzkeil.
  - Rost nur als 2–3 klare Flecken mit harter Kante.
  - Haptik wie KayKit-Fahrzeuge oder Knet-Spielzeug.
- **Vorschlag:**
  - Zur Laufzeit ein „Paint-over“-Patch im Material (`onBeforeCompile`).
  - Albedo-Luminanz in 3 Stufen quantisieren (`floor(l*3)/3` mit `fwidth`-Kante), dann auf die Racer-Eigenpalette abbilden.
  - `metalness=0`, `roughness=1`, Normal-Map dämpfen (×0,3), Glanzlicht `step(0.9, spec)`.
  - Gleiche Mechanik wie `dpal` („Palette angleichen“) bei den Steinen, nur für Fahrzeuge.
  - Langfristig eigene, gemalte Racer-Texturen.
- **Aufwand und Risiko:** Aufwand M (Shader-Patch) bzw. L (Neutexturierung). Risiko mittel, weil die Lesbarkeit der Fahrzeugteile darunter leiden kann.

### 5 · Spiel: Musterwand in der Ferne, keine Luftperspektive, grauer Himmel
- **Wo:**
  - `src/m1/M1World.jsx:232`: linearer `THREE.Fog(c, 140K, 620K)`. Der Hügelring liegt davor und bleibt voll gesättigt.
  - `src/look/terrain3.js` (`flowBands`): Die Bandfrequenz ist nur über `fwidth` gedämpft, erst ab `aw>0.25` wird gemittelt.
  - `src/modules/sky-r13.js`: Der Himmel übernimmt keinen Palettenhorizont, laut Kopfzeile besitzt der Host Licht und Nebel.
- **Was:**
  - Der Hügelring hinter der Wiese ist eine **psychedelische Tapete** aus feinsten Marmorbändern, so gesättigt wie der Vordergrund. Es entsteht keine Tiefe, das Bild wirkt wie eine Wand.
  - Der Himmel ist fahles Grau-Lila statt warmem Mesa-Pfirsich (`mesa.sky #f6d6b8`).
  - Die Probe löst das mit `applyAir`, Kulissenringen und Luft-Staffeln. Im Spiel fehlt all das.
- **Bilder:**
  - `img/B05-spiel-musterwand.jpg`
  - `img/spiel-car-01-start.jpg`: oben
  - `img/spiel-car-02-lauf.jpg`
- **Nachstellen:** `ad-game.mjs`, nach dem Start Kamera nach oben ziehen.
- **Soll:** Wie in der Probe zwei bis drei Staffeln.
  - Mittelgrund: Bänder halb so dicht, Kontrast –30 %.
  - Ferne: Kulissenton mit maximal 2 Bändern.
  - Horizont: Himmelsfarbe.
  - Himmel unten warm (Palette `sky`), oben kühl.
- **Vorschlag:**
  1. `applyAir` (GLSL_SKY) aus der Probe in `terrain3.js` übernehmen. Es ist eine Funktion und bereits 1:1 im Himmel-Port vorhanden.
  2. In `flowBands` die Bandzahl mit Distanz senken, etwa `uBands*mix(1.0,0.4,smoothstep(40K,200K,dist))`.
  3. `uHorizon` im Spiel aus `CFG.palettes[palette].sky` speisen.
- **Aufwand und Risiko:** Aufwand M, Risiko mittel. Der Host-Vertrag sagt „Nebel gehört dem Host“, deshalb die Änderung im Host-Nebel und nicht im Modul.

### 6 · Blendenflecken (Lens Flare)
- **Wo:** `gelaende-probe.html:2465–2480` (`FLARE`, Zeichnung in Z. 3115), Schalter `#flare` (Standard an).
- **Was:** Additive Scheiben und Ringe auf der Sonnenachse legen sich als **milchige Kreise über Gelände und Racer**. Das ist Kamera-Optik, also Foto- und Filmsprache, und gehört nicht zu Hanna-Barbera oder Lozzi. Gemalte Hintergründe haben kein Objektiv. Bei „Gold“ und „Nacht“ ist es am stärksten.
- **Bilder:**
  - `img/B11-flare-gold-nacht.jpg`
  - `img/georg-03-horizont-gegen.jpg`: Kreise links unten
  - `img/ab-flare-aus.jpg` zum Vergleich ohne
- **Soll:** Sonne als gemalte Scheibe mit 1–2 harten Hof-Ringen *am Himmel* (wie R13 H19). Über dem Gelände liegt nichts.
- **Vorschlag:** `flare` standardmäßig aus und aus den Rezepten nehmen (Liste „sofort entfernen“). Falls TinySkies-Gefühl gewünscht ist, nur einen harten Strahlenkranz *um die Scheibe* im Kuppel-Shader.
- **Aufwand und Risiko:** Aufwand S, Risiko keines.

### 7 · Bäume und Büsche stehen im See (mit Georgs Werten)
- **Wo:** `gelaende-probe.html:2760`. Die Baum-/Buschgruppen um das Amphitheater werden ohne Wasserlinien-Prüfung gesetzt. Die Felsgruppen (Z. 2798) prüfen `wl` dagegen schon.
- **Was:** Bei Wasser 0,06 (Tafelberge: Wasserlinie ≈ 3,9 m) stehen KayKit-Bäume und Büsche bis zur Krone unter Wasser und schimmern durch das Kit-Fluid. Das wirkt sofort kaputt, nicht wie Stil.
- **Bilder:**
  - `img/B03-baum-unter-wasser.jpg`
  - `img/georg-10-mittel.jpg`
  - `img/georg-11-nah.jpg`
  - `img/georg-02-horizont.jpg`: Baum links im Wasser
- **Nachstellen:** `sunel 12, water 0.06, fluid 3`, Übersicht `__probeCam(0.6,0.35,45)`.
- **Soll:** Am Ufer höchstens Büsche mit nassem Fuß. Bäume ab +0,6 m über der Wasserlinie.
- **Vorschlag (Diff):**
  ```diff
  - put(bush ? BUSHES[…] : TREES[…], cx + Math.cos(b) * d, cz + Math.sin(b) * d, …)
  + { const px = cx + Math.cos(b) * d, pz = cz + Math.sin(b) * d; if (S.water > 0.005 && surfH(px, pz) < S.water * S.amp + (bush ? 0.2 : 0.6)) continue
  +   put(bush ? BUSHES[…] : TREES[…], px, pz, …) }
  ```
  Wichtig: `rr()` wird weiterhin gezogen, damit die Saat-Abfolge stabil bleibt (also nach dem Ziehen prüfen).
- **Aufwand und Risiko:** Aufwand S, Risiko niedrig. Die Kontakt-Brocken (`crumbRing` über `propGroup`) folgen automatisch.

### 8 · Felsgruppen als weiße Seifenstücke
- **Wo:**
  - `gelaende-probe.html:2796`: `addFlow(mat,'rock')` auf `ROCKC.mat`
  - `gelaende-probe.html:2737`: KayKit-Steine
  - `gelaende-probe.html:2802`: Farbe `cliff→#863e2c`, im Browser so ausgelesen
- **Was:**
  - Das Material ist dunkles Rotbraun, gerendert werden die Brocken aber **creme-weiß**. Ursache ist nach Lage der Dinge die Fließfarben-Beimischung: `flowBands(vKW.xz, vKW.y/uAmp)` landet bei hoch liegenden Brocken im Band `peak/sand`.
  - Das Ergebnis sind glatte, helle, formlose Brocken, die stärker leuchten als alles im Bild. Sie lesen sich wie Seife oder Marshmallow statt wie Knet-Stein.
- **Bilder:**
  - `img/std-01-uebersicht.jpg`
  - `img/std-02-horizont.jpg`: rechts unten
  - `img/fluid-3.jpg`
  - Vergleich: `img/ab-rockc-an.jpg` gegen `img/ab-rockc-aus.jpg`. Die weißen Brocken verschwinden mit `rockc` aus.
- **Soll:**
  - Knet-Steine im Felston des Bioms (dunkler als der Hang), Oberseite einen Ton heller, Fuß eingesunken.
  - Fließfarbe höchstens als *ein* Band quer über den Stein („was zum Boden gehört, fließt mit“), nie als Grundton.
- **Vorschlag:**
  - `uFlowRock` für `ROCKC` auf ≤ 0,25 begrenzen.
  - Oder in `addFlow` für `cls==='rock'` die Bandpalette auf `{cliff, high, mid}` beschränken (kein `peak/sand`).
  - Helligkeit der Steine ≤ Hangton × 0,9.
- **Aufwand und Risiko:** Aufwand S, Risiko niedrig.

### 9 · Schatten zu weich, nicht kontakthärtend
- **Wo:**
  - Spiel: `src/m1/M1World.jsx:209` (`shadowSoft: 5`) und `:226` (VSM, gleichmäßig weichgezeichnet).
  - `src/look/terrain3.js`: Palettenschatten über `smoothstep(uT3Toon.x=0.3, uT3Toon.y=0.7, t3V)`.
  - Probe: PCSS-Wagenschatten.
- **Was:**
  - Im Spiel ist der Hasenschatten ein langer, überall gleich weicher Fleck, an den Füßen so unscharf wie an den Ohren.
  - In der Probe zieht der Wagen am Hang eine schmierige, weiche Schleppe (`std-11`).
  - Georgs Kanon sagt: „Kanten kontakthärtend, KayKit-artig“. Gemalter Stil heißt hier eine **harte Schattenform**, die nur weit vom Kontakt weich wird.
  - Hinweis: Bei 42°-Klemme (Z. 2525) sind die Probe-Schatten am flachen Boden gut (`drive-ground-an.jpg`). Der Bruch zeigt sich an Hängen und im Spiel.
- **Bilder:**
  - `img/std-11-nah.jpg`
  - `img/spiel-03-dreh.jpg`
  - `img/spiel-04-himmel.jpg`
  - `img/B10-spiel-weg.jpg`
- **Soll:** Schattenkern mit harter Kante im Palettenton. Ein Halbschatten-Saum erst ab ca. 1 m Abstand zum Werfer, schmal (≤ 15 cm), dann weich.
- **Vorschlag:**
  - Spiel: Toon-Fenster enger, `uT3Toon=(0.45,0.55)`. So wird aus dem VSM-Verlauf eine harte Form mit stabiler Kante, ohne Pixeltreppe, weil VSM bereits gefiltert ist.
  - `shadowSoft` 5 → 3.
  - Probe: dasselbe Fenster im Palettenschatten, PCSS-Suchradius am Wagen begrenzen.
- **Aufwand und Risiko:** Aufwand S–M, Risiko mittel. Bei Werten unter 0,1 drohen Streifen; nach V-564/V-568 erneut gegen „pixelig“ prüfen.

### 10 · VFX-Sprache: Speedlines als Schienen, fehlende Stöße; Spiel-Staub grün und weich
- **Wo:**
  - Probe: `gelaende-probe.html:2957–2990` (Speedlines `SPL`)
  - Spiel: `src/m2/M2Car.jsx:132` (`terrainDustColor`), `src/m2/racerRig.js:13–16`
- **Was:**
  - **Probe, Boost:** zwei dünne, gerade, weiße Linien vom Heck zur Bildunterkante. Sie lesen sich als Seile oder Schienen, nicht als Tempo.
  - **Probe, Sprung, Drift, Landung:** sichtbar nichts. Kein Staub, kein Landering, keine Driftspur.
  - **Spiel:** Der Fahrstaub ist **grün und weich verschwommen**. `terrainDustColor` färbt alles über 1,2 K Höhe als „Gras“, obwohl `look=terrain3` Mesa-Sand zeigt. Weiche Sprite-Flecken sind genau das „Partikel-Rauschen“, das die Effekt-Bildsprache verbietet.
- **Bilder:**
  - `img/B08-vfx-reihe.jpg`: Boost, Sprung, Drift, Landung
  - `img/georg-07-boost.jpg`
  - `img/spiel-car-02-lauf.jpg`
  - `img/spiel-car-03-dreh.jpg`
- **Soll (Skizze):**
  - **Speedlines** als 3–5 *kurze*, gebogene Striche seitlich am Bildrand, nicht hinter dem Wagen. Weiß mit harter Kante, die Länge wächst mit dem Tempo.
  - **Staub** als 3–4 Knet-Wölkchen mit harter Silhouette im Palettenton `sand/low`, die aufploppen, wachsen und verblassen.
  - **Landung** als flacher Ring in Bodenfarbe mit 2–3 Brocken.
- **Vorschlag:**
  - Spiel: `dustColorAt` bei `isTerrain3()` aus der Bandpalette nehmen (`CFG.palettes[palette].sand`), Sprite-Material mit Alpha-Schwelle (`alphaTest 0.5` und harter Rand).
  - Probe: Speedline-Ursprung an die Bildkante legen, Länge 0,15 s statt 0,38 s.
  - Restliche Formen siehe Brief D (VFX).
- **Aufwand und Risiko:** Aufwand S (Staubfarbe), M (Formen). Risiko niedrig.

---

## Weitere Befunde (Rang 11–15)

### 11 · Grau-grünes Mischband liest sich wie Teer oder Pfütze
- **Wo:**
  - `src/look/terrain3.js:45–48`: Bandindex 5 = `mix(uA_water,uA_mid,0.35)`
  - gleiche Logik in `GLSL_FLOW` der Probe
- **Was:** Im Mesa-Biom entsteht ein entsättigtes Grau-Petrol, das als einziger Ton nicht aus der Palette kommt. Im Spiel wirkt es wie Asphalt- oder Teerflecken, in der Probe als stumpfes Graugrün in den Ebenen.
- **Bilder:** `img/spiel-01-start.jpg`, `img/spiel-03-dreh.jpg`, `img/std-01-uebersicht.jpg`.
- **Vorschlag:** Bandindex 5 auf eine echte Palettenrolle legen (etwa `high` oder eine neue Rolle `accent` je Biom, z. B. Mesa `#e9b07a`), oder Wasserbeimischung ≤ 0,15.
- **Aufwand und Risiko:** Aufwand S, Risiko niedrig.

### 12 · Sonnenstand ohne Stimmung, Wasser ohne Stimmung
- **Wo:**
  - `gelaende-probe.html:2522–2525`: Schattenlicht ≥ 42°, Geländelicht hängt kaum an `sunel`.
  - `gelaende-probe.html:2197–2201`: Kit-Zweig ohne `uTint/uMoodK`.
- **Was:**
  - 4°, 30° und 70° liefern fast dasselbe Bild (`B06`). Bei Georgs 12° steht die Sonne tief, aber das Gelände bleibt mittagshell und neutral.
  - Bei „Nacht“ bleibt das Kit-Wasser tagestürkis (`B11` rechts).
  - Die 42°-Klemme für Schatten ist richtig (KayKit) und soll bleiben.
- **Vorschlag:**
  - Unterhalb von 25° die Stimmung Richtung `gold` mischen: `tint`, `hemi` und `lit/shade` über `smoothstep(25,8,sunel)`. Rand- bzw. Gegenlicht wärmer.
  - Im Kit-Zweig vor `applyAir` `kc*=mix(vec3(1.0), uTint, uMoodK)`.
- **Aufwand und Risiko:** Aufwand S–M, Risiko niedrig.

### 13 · HUD im Spiel: Fahrsystem-Schild unter der Holzleiste
- **Wo:** `src/m2/M2Car.jsx:162`: `#m2-kind` mit `top:14px`, mittig, `z-index:6`. Es liegt direkt unter der Sammelleiste.
- **Was:** Von „Fahrsystem“ ist nur „Fahrsyste…“ lesbar. Die Leiste verdeckt die Mitte, rechts bleibt „…sist · C wechselt“ stehen.
- **Bild:** `img/B09-hud-ueberlappung.jpg`.
- **Vorschlag:** Schild unter die Leiste (`top:64px`) oder nach links oben neben den Rucksack setzen. Laut Kommentar Z. 77 ist es ein Abnahme-Label, das nach V-367 ohnehin wegfällt.
- **Aufwand und Risiko:** Aufwand S, Risiko keines.
- **Probe-HUD:** Die dunklen Pillen sind auf hellem Himmel und Gelände gut lesbar. Der lange Steuerhinweis unten links überdeckt im Fahrbild den Vordergrund. Vorschlag: nach 5 s ausblenden.

### 14 · Spiel: Weg als glatte Sandplatte
- **Wo:** `src/modules/path3d.js` („matt in Sandton“, Kanten eingesunken).
- **Was:** Vor dem Start liegt eine hellere, trapezförmige Fläche ohne Fließfarbe mit fast geraden Kanten. Sie liest sich als Platzhalter-Brett, nicht als Weg.
- **Bild:** `img/B10-spiel-weg.jpg`.
- **Vorschlag:** Weg mit **dunklerem, hartem Saum** (Palettenschatten, 10–15 cm) und organisch welliger Kante (Rauschen auf dem Rand). Innen ein Band der Fließfarbe, entsättigt, nicht flach.
- **Aufwand und Risiko:** Aufwand S–M, Risiko niedrig.

### 15 · Kit-Wasser in der Ferne rauscht, Ufer ohne Schaumlinie
- **Wo:** `gelaende-probe.html:2194–2201`.
- **Was:**
  - Nah ist F2 gut. Langsames Morphen und die drei Ufer-Töne entsprechen Georgs Urteil.
  - Ab ca. 60 m bleibt die volle Kit-Detailstruktur stehen. Großflächig wirkt das wie realistisches Meerwasser mit Rauschen (`georg-02`, `georg-12`).
  - Es gibt keine helle Schaumlinie am Ufer. Das alte Probe-Wasser hatte eine, und sie liest sich sofort als Cartoon (`B07` rechts).
- **Vorschlag:** F2 bleibt (Urteil Georg). Ergänzen:
  - Kit-Detail mit Distanz auf den Mittelton ausblenden (`mix(kc, flatTone, smoothstep(60.,180.,dist))`).
  - Eine harte, wellige Schaumlinie bei `sdr≈0.35` in Weiß mit 80 % Deckung, übernommen aus `fluid 0`.
- **Aufwand und Risiko:** Aufwand S–M, Risiko niedrig, weil der Kit-Shader unverändert bleibt und nur die Einspeisung angepasst wird.

---

## Was schon gut ist (beibehalten)

- **Fließfarben mit harten Kanten** nah und mittel, besonders in den Ebenen (`std-10-mittel.jpg`, `std-11-nah.jpg`). Das ist Lozzi, und es ist der Kern des Looks.
- **Kulissenringe** am Horizont (K1–K3) geben ruhige, gestaffelte Silhouetten (`std-02-horizont.jpg`). Sie sind das Vorbild für die Fernberge.
- **Amphitheater in Knete** mit Palettenangleich (`std-06-wagen-nah.jpg`) passt.
- **KayKit-Bäume** mit runden Kronen passen als Formsprache. Als Grün auf Mesa sind sie ein guter Komplementärakzent.
- **Island-Kit-Wasser nah:** Uferstufen, dunkler nasser Saum am Gelände.
- **Hase FrizzleBob:** Knete mit KayKit-Haptik, der Selbstschatten ist gedämpft (gut).

---

## Liste „sofort entfernen“

Diese Effekte schaden dem Stil heute mehr, als sie nützen:

1. **Blendenflecken** (`#flare`, Z. 2465 ff.): Standard aus, aus allen Rezepten nehmen.
2. **Kulissenton per `step()` unter dem Horizont** (Z. 1824): Durch die stetige Variante ersetzen, siehe Befund 2.
3. **Wolken-Licht/Schatten per `step()`** und Fetzen unter 1,5 % Bildbreite (Z. 2264): siehe Befund 3.
4. **Grau-grünes Wasser-Mischband** als 6. Fließfarbe (terrain3.js:45–48 und Probe-GLSL_FLOW).
5. **Spiel-Staub als weiche grüne Sprites** (M2Car.jsx:132): Bis die Knet-Wölkchen da sind, lieber gar kein Staub als dieser.
6. **Volle Fließfarbe auf Felsbrocken** (`uFlowRock`, `addFlow(...,'rock')`): Auf ≤ 0,25 begrenzen, siehe Befund 8.
7. Bereits aus, sollen **aus bleiben**:
   - `puffs` (Wolkenschicht)
   - `trails` (Punkt-Kondensstreifen)
   - `edges` („noch fleckig“)
   - `cform=0` „gemischt“ (verstärkt das Fetzen-Problem)

---

## Drei Stimmungen als Regler-Rezepte (Probe)

Für alle drei gilt dieselbe Basis:
- Vorlage „Tafelberge“
- `sky2` an, `kul` an, `painted` an, `cform` 4
- `flare` aus, `org` an, `fstage` 5, `dpal` an, `fluid` 3
- Wasser so, dass Inseln entstehen, aber die Ebene nicht absäuft

Die Werte sind Reglerstände der Probe. Die Rezepte setzen die Befunde 3, 7 und 8 voraus, sonst stören Wolkenfetzen, Bäume im Wasser und weiße Steine.

### S1 · „Mittag in der Mesa“ (Road Runner, hartes Licht, Postkarte)
```json
{ "palA": "mesa", "palB": "wueste", "mix": false, "tod": "tag", "sunel": 52, "sgrad": 0.5,
  "cover": 0.35, "cstretch": 1.0, "water": 0.04, "fluid": "3", "flow": "0.5", "bands": "4",
  "soft": 0.15, "toon": true, "strata": true, "ground": true, "shadows": true, "flare": false, "moon": "0" }
```
- **Wirkung:** Wenige große Wolken, hoher Kontrast, kurze harte Schatten. Wasser nur als schmale Kanäle.
- **Bildidee:** Chuck-Jones-Wüste, also Himmel leer, Gelände trägt das Bild.

### S2 · „Goldene Stunde am See“ (Lozzi-Abend, warm gegen kühl)
```json
{ "palA": "mesa", "palB": "pastell", "mix": true, "tod": "gold", "sunel": 12, "sgrad": 0.85,
  "cover": 0.5, "cstretch": 1.6, "water": 0.08, "fluid": "3", "flow": "0.5", "bands": "2.5",
  "soft": 0.1, "toon": true, "strata": false, "ground": true, "shadows": true, "flare": false, "moon": "1" }
```
- **Wirkung:** Georgs flacher Sonnenstand bekommt endlich seine Stimmung. Breite Bänder halten das Bild ruhig, der Pastell-Wechsel bringt Rosa-Lila in die Ferne, und der Knet-Riesenmond steht gegenüber der Sonne.
- **Voraussetzung:** Befund 12 (Wasser übernimmt `uTint`).

### S3 · „Moos-Insel, blaue Nacht“ (Hanna-Barbera-Nachthintergrund)
```json
{ "palA": "moos", "palB": "schnee", "mix": false, "tod": "nacht", "sunel": 30, "sgrad": 0.4,
  "cover": 0.3, "cstretch": 1.0, "water": 0.12, "fluid": "3", "flow": "0", "bands": "2.5",
  "soft": 0.1, "toon": true, "strata": false, "ground": true, "shadows": true, "flare": false,
  "moon": "2", "aurora": "1" }
```
- **Wirkung:** Nachtlila, Gelände in 2–3 Tönen, Fließen steht still (ruhige Nacht), der Ringplanet als Blickfang, Polarlicht nur nachts.
- **Bildidee:** Flintstones- oder Jetsons-Nachthimmel mit flachen Silhouetten.
- **Voraussetzung:** Befund 12 und Befund 6 (sonst Flare-Kreise vom Mond).

---

## Spiel-Ansicht `#m1,harvest,look=terrain3`: Kurzurteil

- **Nah:** Fließfarben, Knet-Hase und KayKit-Obst passen zusammen. Die Bänder sind blasser als in der Probe (helles Sandbeige dominiert), dadurch fehlt Kraft. Vorschlag: `low/mid` im Spiel nicht aufhellen, `uT3Keep` prüfen.
- **Fern und Himmel:** Bruch Nr. 5 (Musterwand, grauer Himmel). Das ist der erste Eindruck beim Umschauen.
- **Fahrzeug:** Bruch Nr. 4 (Fototextur), dazu der grüne Weichstaub (Nr. 10).
- **HUD:** Holzleiste und Aktionsleiste passen in der Haptik (Holz, Knöpfe) gut. Einziger Fehler ist die Überlappung (Nr. 13).
- **Schatten:** weich und lang (Nr. 9).

---

## Reihenfolge der Umsetzung (Empfehlung)

1. **S-Paket, ein Durchgang:** Befunde 2, 3 (Teil 1–2), 6, 7, 8, 10 (Staubfarbe), 11, 13. Das ergibt den größten Gewinn pro Stunde, und jede Änderung ist einzeln mit `ad-probe.mjs` gegenprüfbar.
2. **M-Paket Ferne:** Befund 1 (Fern-Zacken) und Befund 5 (Spiel-Luftperspektive) gemeinsam, weil beides an der Fern-Staffelung hängt.
3. **M-Paket Material:** Befund 4 (Racer-Malweise), danach 9 (Schattenform), 12 (Stimmung) und 15 (Fernwasser, Schaumlinie).
