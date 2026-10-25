# KFB prozedurale Welt · konsolidierte SSOT R2 (Terrain, Cartoon-Environment, Platzierung/WFC, Endlos-Welt)

Stand 25.10.2026 abends, Register bis V-815, Spiel-Code `game/proc-world-ws0` @39a88fa. Diese Fassung fasst zusammen, was gilt und was gebaut ist. Bei Widerspruch gelten die Kanon-Quellen im Wortlaut (Teil 3) und Georgs Entscheidungen (V-Nummern). Neu gegenüber R1: §1 (Zeilen ab V-801), §3 (Bänder, Übergang), §3b, §4 (Stand), §5, §5b, §5c, §7, §8.

## 0 · Projekt in einem Absatz

KFB (Kayfabizarro) ist ein Browser-Spiel mit Fahren, Laufen, Fluff sammeln und Kampf, in einem Cartoon-Knet-Look („Claymation“).
- **Laufzeit:** three.js r186 und WebGL2, React; die Spielwelt ist eine endlose Fahrwelt aus 64-m-Zellen mit sechs Biomen.
  - *Stand R2:* Die endlose Welt läuft über den Schalter `world=endless`. Standard ist noch die Insel-Probe mit Nebelrand. Endlos als Standard ist geplant (V-815).
- **Assets:** Kit-Assets (KayKit, Quaternius, Tiny Treats, Kenney) und eigene Meshy-Modelle, alle mit einem Knet-Shader (`kfb-clay.v1.1`) überzogen.
- **Blender-Kette:** Parallel erzeugt eine Kette Abnahmebilder und Style-Frames aus demselben Löser-Rezept (`kfb_place_bpy`, Gate `kfb_env.py`, Kritiker CRITIC_3D_R1).
- **Owner:** Georg (Art Direction, Abnahme im Bild). WS0 (Steuerung, Kanon, Löser; baut die prozedurale Welt im Spiel selbst, V-746). WS1 (Spiel-Laufzeit, Shader). WSB (Blender). WSA (Mindscapes, Billboards).

## 1 · Bindende Entscheidungen (Auszug, V-Nummern im Register)

| Thema | Regel | Quelle |
|---|---|---|
| Gesamtlook | Joyride J17 ist Goldstandard (Strecke, Banden, Deformer, Kamera, Paletten) | V-010, V-102 |
| Paletten | Insel-/Biomthemen aus den Joyride-Paletten (canyon, bucht, otown und Ableitungen) mit Rollen für alle Teile. OKLCH-Harmonie-Regel: Boden trägt den Grundton, Blickfang gegenüber, Laub natürlich bzw. herbstlich. Prozedurale Biom-Platten (paletteGen) nur innerhalb dieser Harmonie | V-051, V-270, V-305, V-619 |
| Biom-Paletten | Je Biom eine zufällige, harmonische Palette aus dem V-305-Generator mit sechs Leitfarben (Boden, Strang, Wahrzeichen, Laub, Himmel, Rinde) plus Leitern, Anmutung wie die drei Golden Samples. Die Farben gelten für alles (Terrain, Fluids, Bewuchs, Steine, Gras, Gebäude, OSM, Dioramen, Mindscapes, Billboards), auch surreal (R8). Keine Dämpfung (calm 0) | V-800 |
| Farbfreiheit | Jede Farbe ist erlaubt, auch surreal (lila Gras), wenn der Materialcode die Logik trägt. Einzige Grenze: Chroma ≤ 0,195 | V-565 |
| Terrain-Malerei | terrain3-Fließfarben (organische Bänder, Domain Warping, lose an der Höhe) sind das Konzept und bleiben. Nicht dämpfen, nicht verflachen (Georg 25.10. nach Rücknahme). Terrain-Look-Stack: Form → 4 gebrochene Farbflächen als runde Blobs (nie Schwellwert-fbm) → Kantenakzente nur an Formbrüchen → Vordergrund-Tonmasse → echte Schatten | #439, V-570, V-797 |
| Übergänge | Zwischen Biomen bzw. Zonen nur Sprenkel in beide Richtungen. Nie Verlauf, Linie oder Alpha. **Für das Gelände ersetzt durch V-802** (Zeile „Biom-Übergang Gelände“) | V-403, V-011 |
| Ortsbiografie | Jede Szene erzählt Entstehen → Nutzen → Vergehen → Bewachsen. Verteilung von der Quelle weg. Größe wächst mit Zeit und Abstand: Moos in Fugen, Gras 0–2 m, Büsche 2–6 m, Bäume ab 6 m, rahmend | KONZEPT_ORTSBIOGRAFIE §2, V-341 |
| Materialcodes | Ein Materialcode je Schicht und Ort (z. B. Kalkstein + Moos + Lianenholz). Alles Dazugestellte trägt einen dieser Codes und eine Rolle (Boden, Stein, Rinde, Laub/Gras, Fluff) in den Rollentönen der Palette | KONZEPT_ORTSBIOGRAFIE §3, V-565 |
| Komposition | 70/20/10 (Ruhe/Struktur/Bedeutung); ungerade Gruppen; 1 : 0,6 : 0,35 : 0,15; Abstände ≥ 30 % verschieden; ≤ 2 auf einer Geraden; Konturen ≥ 15 % überlappt oder ≥ 25 % Luft; Negativraum ≥ 30 %; Landmarke am höchsten; ein Kit je Gruppe | ETHERINGTON_REGELN, V-566 |
| Erdung | Eingraben (Einsinken je Art), Kontakt (echter Schatten plus Kontaktton 8–12 L* unter dem Wurfschatten, auf der Lichtseite die halbe Stufe), Überlappen mit Ursache. Seit 25.10.: keine Kontaktsteinchen, Fußsteinchen oder Moosfugen als Objekte (Clutter); Kontakt ist Materialcode | V-565, V-570, V-797 |
| Licht | Ein Rig, ein Tonweg, eine Materialantwort. Keine privaten Lichter, keine Blob-Schatten | V-385, V-392, LIGHT_MODEL_R2 |
| Assets | Kit-Teile wie geliefert, nur gleichmäßig skaliert. Erst vorhandene Quellen bzw. Werkzeuge („use what works“), dann Eigenbau | V-574, V-506 |
| Abnahme | Visual first: Georg nimmt Bilder ab. Das Gate ist Untergrenze, nicht Beweis | V-561, V-740 |
| Benchmark | KayKit-Promos und Kays eigene Szenen; Cartoon-Hintergrundkunst (Herriman, Noble, Lozzi, Watterson) | V-797, V-799 (q217) |
| Varianz | Alle passenden Nature-/Environment-Assets (KayKit, Tiny Treats, Quaternius, Kenney) stehen für WFC bzw. Platzierung zur Verfügung | Georg 25.10. |
| **Neu in R2** | | |
| Bewuchs-Modell R2 | Materialzonen im Boden, Waldmassen mit Saum (eine Baumfamilie je Masse), Wiese fast leer, Fels nur als Formation bei Hang > 0,5; kein Kies, kein Kontakt, kein Streugras. KayKit = Zonen, nicht Clutter | V-797, V-798 |
| Gelände nach J17 | Sechs Fließbänder aus dem Biom-Schema mit Gegenfarbe in der Erde (wie die Inselseiten der Golden Samples; Canyon: Lila, Orange, Creme). Georg PASS q222 | V-801 |
| Props zweifarbig | Krone = Laub, Laub dunkel oder Blüte (leaf[0..2]); Stamm = Laub-Farbton −105° und dunkler (J17-Regel). Instanzfarbe über USE_COLOR ins Fragment | V-801 |
| Biom-Übergang Gelände | An der Biomgrenze wechselt jedes Band als Ganzes die Palette, je näher am Nachbarbiom desto mehr Bänder. Keine Sprenkel, keine Tropfen, kein dunkler Saum, keine zweite Schicht. Sprenkel nur noch zum Vergleich (`biot=speckle`). Georg PASS q222 | V-802 |
| Farb-Logik ausrollen | Dieselbe Biom-Palette färbt Props (Krone, Stamm), Gebäude, Dioramen, Mindscapes, Billboards, passend und surreal. VFX (Rauch, Partikel) nehmen die Gelände-, Fluid- und Prop-Farben des Ortes, keine Fremdfarben | V-803 |
| Fluids | Wasser, Kaugummi, Säure folgen derselben Farbharmonie; ein Fluid-Shader mit Art als Parameter; Rezepte je Biom in kfb_place | V-750 |
| Meshy-Bühnen | Rollen-Code je Bauteil im Kanal COLOR_1; Rollen-Teile „voll“ (Zug 1,0 auf Farbton und Sättigung, Helligkeit und Zeichnung bleiben); braun-graue Teile (C* < 15) über `gradient_map`; genau ein Fokus-Teil mit `pad`; nicht sauber Einfärbbares bleibt vorerst aus dem Spiel. Details §5b | V-806, V-808, V-809, V-812, V-814 |
| Abnahme durch Georg | Nur Bild-Auswahl, keine Höhen-, Zahlen- oder Messfragen | V-804 |
| Fahrplan | Fahrphysik → Gameplay-Critic → Wasser → Amphitheater → Karten-Gelände → Endlos-Welt komplett → Splat-Probe; jede Stufe endet mit Bildern bzw. Video | V-805, V-815 |

## 2 · Das Modell (R3, freigegeben 25.10., q217)

Aus Kanon plus Bildstudie (Herriman, Noble, Lozzi, KayKit):

1. **Ebenen statt Streuung.**
   - Wenige Bodenebenen: Vordergrund-Bank, Hügel im Mittelgrund, Grat/Berge, Himmel.
   - Jede Ebene hat eine Rollenfarbe und eine flache Schattenform.
   - Dinge sitzen an den Kanten der Ebenen (Bankkante, Grat, Ufer, Wegrand). Das Flächeninnere bleibt ruhig, mit sparsamem Bodenzeichen.
2. **Materialcode = festes Zeichen je Material, überall gleich.**
   - Fels: Facetten in 2–3 Tönen plus Schichtlinien (Noble); Spitzen tragen Streifen, Mesas Punkte (Herriman).
   - Rinde: Tupfen. Busch: dunkle Masse mit Kritzel. Boden: Punkte oder Striche.
   - Gras: Büschel-Zeichen nur am Fuß von Dingen.
   - In Knete: Formsprache plus drei Rollentöne.
3. **Wenig und groß.**
   - Je Blick 1 Hauptformation, 1–2 Nebenformationen, 0–3 Kleinteile.
   - ≥ 50 % Ruhe, Größensprünge ~1 : 0,4 : 0,1.
4. **Verfall hat einen Ort.** Bruchstücke nur am Fuß der Formation, hangab, 1–3, nach außen kleiner und seltener (Dichte ~e^(−λd)).
5. **Bewuchs ist Zeichen, nicht Masse.**
   - Vorn: Solitäre oder Dreiergruppen mit Größenfolge. Ein Haupt-Asset erhöht die Wahrscheinlichkeit kleiner Ableger um sich (Eltern-Kind).
   - Ferne: Silhouettenreihen auf Graten.
6. **Signatur-Motiv:** 1 Hero plus 2 Echos je Zone.
7. **Farbe trägt die Ebenen.** Komplementär-Spannung zwischen Formation und Grund; vorn warm und satt, hinten kühl und blass. Alle Töne aus den Joyride-Rollen.
8. **Surreal bleibt lesbar.** Horizont, Weg und Anker bleiben fest, Formationen und Palette wechseln.

Georgs Technik-Hinweise (q217):
- Rauschen durch Stufenfunktionen (smoothstep bzw. floor) für klare Zonen.
- Poisson-Disc für Mindestabstände (kein Clipping).
- Kompaktierung: Ein Haupt-Asset erhöht die Spawn-Wahrscheinlichkeit kleiner Ableger in den Nachbarradien.

*Stand R2:* Modell gilt unverändert. Im Spiel umgesetzt als Stilbild `veg=cartoon`, nicht abgenommen (Wiese zu gleichmäßig gefüllt).

## 3 · Terrain (gebaut, Spiel)

- **Höhenfeld:** `createEndlessHeight` (Sinus-/Rausch-Komposition je Biom, breite Höhengewichte gegen Stufen).
- **Netz:** Quadtree-Blätter (64 m fein, gröber in der Ferne), zeitgeteilt gebaut, Nähte genäht.
- **Biome:** sechs (moos, mesa, wueste, schnee, pastell, canyon).
  - Voronoi-Regionen mit verbogenen Rändern.
  - Je Punkt sechs Gewichte.
  - Übergänge über das Sprenkel-Modul (`kfb-speckle-transition.v1`). **Seit V-802 im Gelände über die Fließbänder** (Band für Band); Sprenkel nur mit `biot=speckle`.
- **Shader:**
  - `kfb-clay` (Knete) + terrain3 (Fließbänder: Domain Warping, 6 Bandrollen aus der Biom-Palette) + biomeTerrain (zwei stärkste Biome, Sprenkel-Auswahl, Palettenschatten V-564).
  - Kontaktton (contactDepthTint) ist im Terrain-Shader noch offen (WS1). WSB hat für Blender Werte je Material gemessen.
- **Maßstab:**
  - Hügel 10–40 m, Fahrgefühl mit Sprüngen.
  - KayKit-Bäume 3–6 m, Figur FrizzleBob 1,81 m.
  - Kritiker: Bäume 1/20–1/30 der Hügelhöhe. Offen, Georgs Frage q210.

**Farben im Gelände (Stand Code, `src/look/biomeTerrain.js`, V-800 bis V-802):**
- Biom-Paletten: `harmonyPalettes(seed)` aus `kfb-cartoon-palette.js` (`fromHue`). Boden-Farbtöne aus den Familien der Golden Samples und ihren Nachbarn: 299° (Canyon), 182° (O-Town), 88° (Bucht), 240°, 330°, 150°. Je Welt-Seed gemischt, ohne Wiederholung, je Biom ±10°.
- Bandrollen heute (@85c3bc1, „Bänder zeigen das ganze Schema“): `low` = Boden (`top`), `mid` = Hügel (`hill[1]`), `high` = Wahrzeichen (`tower[0]`), `peak` = Sand, `sand` = Erde (`under[1]`), Band 6 = Laub (`leaf[1]`); Schatten aus `cliff` (`under[3]`). Hinweis: Der Wortlaut von V-801 nennt noch Boden hell, Hügel dunkel, Hügel-Mitte, Erde 1, Sand; der Code ist danach weitergegangen.
- Prop-Rollen: Laub `leaf[1]`, Laub dunkel `leaf[0]`, Blüte `leaf[2]`, Stamm `trunk`, Stein `rock`, Gras `leaf[0]`.
- Übergang je Bildpunkt: zwei stärkste Biome (feste Reihenfolge), Anteil `wB` des zweiten; Auswahl `clamp(wB·1,3 − 0,15 + 0,12·snoise(xz/47), 0, 1)`; je Band harte Wahl (`step`) statt Verlauf. Dadurch kippen die Bänder einzeln.
- Die Bänder treiben mit dem geteilten Wind (Versatz, keine Scherung).
- Vergleichsschalter: `biot=speckle` (alter Sprenkel-Übergang), `ground=tone` (Ruhefläche aus V-788, zurückgenommen), `pal=gen`, `pal=island`, `palgen=0`, `palseed=<Zahl>`.

## 3b · Endlos-Welt-Architektur (Stand Code, belegt aus Teil 4)

**Module und Schalter**
- `src/world/EndlessDrive.jsx` hängt das Endlos-Gelände in die Laufwelt, nur mit Hash `world=endless`.
- Bewuchs: `veg=core|mass|cartoon` → `placeVeg.js`; ohne Schalter der alte Rasterbewuchs `endlessVeg.js`.
- Karte: `cardRelief.js`, Standard an, aus mit `cards=0`.

**Höhe** (`createEndlessHeight`, ohne three, auch in Node-Tests)
- Form aus der Gelände-Probe (`probeHeight.js`, Rezept „Sanfte Hügel“) mit `waterLevel: 0`, also **ohne Wasser und Flüsse**.
- Platz-Anker im Ursprung: Das Amphitheater steht fest, der Platz bleibt auf Bodenhöhe.
- Je Biom ein Höhenfaktor (moos 1,0 · mesa 1,2 · wueste 0,7 · schnee 1,45 · pastell 0,85 · canyon 1,3). Er streckt nur den Abstand zur Platzhöhe, über ein breites Höhengewicht (220 m), damit keine Stufen entstehen.
- Danach die Stempel (Karten-Gelände, unten).

**Biom-Feld** (`biomeField.js`, Daten `kfb-biome-drive.r1.json`)
- Voronoi-Zellen 460 m, Mittelpunkt je Zelle gewürfelt.
- Ränder verbogen (Warp 70 m auf 320 m).
- Nachbarzellen möglichst verschiedene Biome.
- Übergangsbreite 30–80 m, je Grenzstelle anders.
- Start-Biom mesa im Radius 150–240 m um den Platz. Seed 20261021.

**Kacheln** (`createEndlessTerrain`, Konstanten `ENDLESS`)
- Quadtree aus 512-m-Wurzeln im Sichtradius 820 m. Eine Kachel wird geteilt, solange ihr Abstand zum Fokus unter 0,85 × Kachelgröße liegt.
- Blätter 64–512 m mit je 32 × 32 Zellen (2–16 m).
- Bau als Generator, gibt nach jeder Zeile ab; Zeitscheibe 2,5 ms je Bild; neue Planung nach 6 m Fokusweg.
- Ein neuer Kachelsatz erscheint erst, wenn alle seine Kacheln fertig sind (keine Löcher).
- Normalen aus dem Höhenfeld mit einer Randreihe Überstand.
- Nähte: Kanten und Ecken zu gröberen Nachbarn werden auf deren Kante gelegt (Höhe und Normale linear wie das grobe Dreieck); Neuschreiben nur bei geänderter Nachbar-Signatur.
- Je Eckpunkt sechs Biom-Gewichte als Attribute (`aBioA`, `aBioB`).
- Cache: über 420 Blätter werden die ältesten unsichtbaren freigegeben, bis 360 bleiben.
- Kollider: Rapier-Trimesh aus genau den gezeigten Dreiecken der 64-m-Kacheln im Umkreis 70 m. Als Diff (`add`/`remove`); neu, wenn eine Kante neu angelegt wurde.
- `surfaceAt` liefert die Höhe der gezeigten Dreiecke.
- Fokus = Wagen bzw. Figur (`setFocus`), sonst die Kamera.
- **Kein Randwall:** Die Welt endet nie.
- **Kein mitwandernder Ursprung:** Alle Koordinaten sind absolute Weltkoordinaten.

**Karten-Stempel** (`CARD_STAMP = { halfW: 18, amp: 6, skirt: 7, ring: [70, 260], avoid: 48 }`)
- `cardSites`: sucht im Ring 70–260 m um den Start (Schritt 19 m, 24 Winkel) die ruhigste Fläche. Maß: Höhen-Spannweite über 5 × 5 Proben, dazu ein kleiner Abstandszuschlag. Abstand zum Platz mindestens 48 + 18 m.
- Ergebnis heute: **genau eine Karte** (`card_r3`), 36 m breit, Tiefe nach Seitenverhältnis.
- `stampHeight`: Die Höhenkarte der Karte (bilinear) wird als Plateau aufgetragen. Basis = höchster Punkt der Fläche, Amplitude 6 m, Saum 7 m (smoothstep). **Nur auftragen**, nie abtragen (V-716).
- Bewuchs, Kollider und Kugeln lesen dieselbe Höhe.

**Karten-Relief** (`cardRelief.js`, q226)
- 256 × 256 = 65 536 Knetkugeln auf dem Plateau.
- GPU-Physik (`GPUComputationRenderer`): Schwerkraft, Abprallen 0,45, Federrückkehr in die Ruhelage.
- Figur bzw. Auto stoßen die Kugeln weg (Radius 0,9 m plus Geschwindigkeit; `kick` für Stöße).
- Gerechnet wird nur in der Nähe (3 × halbe Breite) und 6 s danach.
- Farben: Helligkeit der Kartenpunkte über Quantile auf die sechs Bandrollen des Bioms am Ort. Dunkle Linien und Kartenrand in KFB-Tusche `#1f1a14`.
- Licht aus der Sonnenrichtung des einen Rigs. Freifläche für den Bewuchs: `KEEPOUT`-Rechteck mit 2,5 m Saum.

**Freiflächen** (`keepout.js`)
- Liste von Rechtecken `{ x, z, hw, hd, pad }`. Der Bewuchs filtert Instanzen darin heraus.

**Bewuchs-Zellen** (`placeVeg.js` + `placeWorker.js`)
- Je 64-m-Zelle ein Höhenraster mit 2 m Schritt (33 × 33), zeitgeteilt abgefragt.
- Danach rechnet der Worker das Rezept (Modi `place`, `mass`, `cartoon`; Löser `kfb-place-core.v1.mjs`). Instanzen landen in BatchedMesh je Materialgruppe: KayKit bis 14 000, Gras 9 000, Steinkit 12 000, Fluff als InstancedMesh bis 6 000.
- Nur auf den 64-m-Kacheln (Stufe 0); weiter draußen kein Bewuchs.
- Einblenden zeitgeteilt (je 40 Instanzen eine Pause), Budget 1,5 ms; nächste Zelle zuerst.
- Seed fest (`kfb-endless-r1`).
- Der Worker bekommt heute für jede Zelle `biome: 'moos'`. Die Farbe kommt aus der Palette des Bioms am Zellmittelpunkt.
- Fuß auf der tiefsten Stelle unter der Hülle, nie schwebend.
- Farbe:
  - Krone aus der Instanzfarbe;
  - Stamm aus der Atlas-Erkennung (rötlich = Holz) nach J17-Regel;
  - Steinkit über die Vertexfarbe;
  - Gras einfarbig in drei Stufen.
- Bei Palettenwechsel werden alle Zellen neu eingeblendet.

**Was für „Endlos-Welt komplett“ fehlt** (V-815, §8): Wasser im Endlos-Gelände; Orte, Bühnen, Dioramen und Karten je Zone (heute: ein Platz im Ursprung, eine Karte im Ring); Bewohner und Gedächtnis je Zelle; mitwandernder Ursprung; Orientierung; Bewuchs in der Ferne; Bewuchs je Biom.

## 4 · Platzierung (gebaut): Löser `kfb-place-core.v1.mjs` + Regeln `kfb_place.r1.json`

**Eine Wahrheit für Spiel und Blender:** Der Löser ist ein reines JS-Modul. Er läuft im Spiel-Worker je 64-m-Zelle bzw. 32-m-Zone und im CLI für Blender-Rezepte (golden hash).

Ablauf `placeChunk({cfg, seed, chunk, terrain, biome, masks, stamps, recipeList, cardTriplet})`:

1. **Stamps** (feste Landmarken, z. B. Stumpf): einbetten, Gebrauchsspuren, Holz-Echos (Goldwinkel, nie überkreuzt), Kontakt.
2. **Zonen-Keime:** 2–4 Gruppen je Zone (`rules.zone`), Mindestabstand, Negativraum. Seit V-788 gibt es eine Hain-Ebene (`grovePlan`): Hain- oder Wiesen-Zone aus Wertrauschen. **Laut Georg falsch als Ursache.**
3. **Gruppen je Rezept:**
   - `tree_group` (Anker-Baum mit Fluff-Ankern + 3 Stützen Baum/Baum/Busch + Akzent);
   - `bush_nest`;
   - `stone_nest_slope`.
   - Ablauf je Gruppe:
     - **`solveLocal` (WFC-artig):** Slot-Belegung aus Kachel-Domänen mit Größenleiter, `repeat_max`, Ü3 (Höhen), Ü4 (Stammdicken in Dicken-Reihenfolge), Radien-Leiter.
     - **`nestPositions`:** Überlappung ≤ 0,85 oder Luft ≥ 1,25 × Radiensumme, nie kollinear.
     - **`ruleReport`:** Prüfer wie das Gate.
4. **Fluff-Nester** (Spiel-Sammelobjekte): an gemessenen B2-Ankern der Krone (nur Lichtseite), Fokus/Echo, Fallobst hangab.
5. **Kontakt-Bögen** (Staffel L/M/S, 40–50 % Umfang). **Seit V-797 als Objekte gestrichen.**
6. **Steinspur** (path_trace): heiler Kern am Ziel, zum Rand Verfall nach SPEC_EDGE_RUBBLE (A „freies Ende“).
7. **Gras:**
   - Fuß-Büschel 3/5/7 auf einem Bogen (Licht- bzw. Hangfußseite, ≤ 50 %);
   - Felder als Fibonacci-Flecken auf Vogel-Spiralen;
   - Wind-Gruppen.
   - **Laut Georg: kein Streugras.**
8. **Oddity:** ein bewusster Regelbruch je Zelle mit Wahrscheinlichkeit nach Karten-Surrealismus.
9. **Nachlauf:** Ü3/Ü4 mit G1-Wache, Moos-Fugen (gestrichen), Kontakt unter Holz entfernt.

Weitere Teile:
- **Hüllen-Wahrheit:** 289 Kacheln tragen gemessene Gate-Hüllen (`gate_r_m`, `foot_r_m`).
- **Form-DNA-Ausschluss** (`rules.form_dna`): keine Prismen- und Würfelkronen, keine eckigen Platten.
- **Gate `kfb_env.py` r6** (Blender): G1 Gruppenregeln, Ü3/Ü4/Ü5 Lehne, Kontaktfenster, FLUFF-HALT, Palette, Einsinken.
- **Kritiker `CRITIC_3D_R1`:** K1–K10, Stopp-Regel nach zwei Reparaturen ohne Gewinn.

### Spiel-Stilbilder (Hash-Modi, Worker)

| Modus | Inhalt | Status |
|---|---|---|
| `veg=core` | Löser-Gruppen + Hain-Ebene | FAIL (q210/q211) |
| `veg=mass` | Waldmassen aus Zonenfeld, Waldboden-Zone im Shader (V-798: Raster 2,35 m, Krone an Krone, eine Baumfamilie je Masse, Saum mit runden Büschen) | Georg: Verteilungslogik und Materialcodes nicht verstanden |
| `veg=cartoon` | Modell R3: Grate tragen Baumreihen, Formationen an Hangbrüchen mit Bruchstücken hangab, Bewuchs nach außen, Solitäre mit Ablegern, Poisson-Abstände, Etherington-Gruppen | Wiese noch zu gleichmäßig voll. Rollenfarben greifen seit V-801. Nicht abgenommen; im Hub als Stilbild-Standard genutzt (Hash) |
| Standard (MVP) | `endlessVeg`: Rastersstreuung mit Palettenplatten (`plateTint`) | alter Stand; im Code weiter der Standard ohne Schalter |

## 5 · Farbe an Props (Soll und Ist)

- **Soll:** Die Kit-Textur gibt nur Hell/Dunkel, der Farbton kommt aus der Rollenfarbe der Palette: Bäume `low`, Büsche `mid`, Stein `sand`, Gras `low`. So macht es der MVP-Bewuchs (`plateTint`).
- **Ist im Löser-Bewuchs (R1):**
  - Der Knet-Shader zieht Farben mit `kfbPull` auf seine Grüntöne zurück.
  - Die Batch-Farbtextur entsteht erst beim ersten `setColorAt`, das Programm fehlt danach ohne Neubau.
  - Beides ist gefixt, die Wirkung im Bild ist aber noch nicht bestätigt.
- **Ist (R2, V-801, Georg PASS q222):**
  - Die Platte wird vor dem Knet-Block berechnet und danach wieder gesetzt, der Pull wirkt nicht mehr auf die Rolle.
  - KayKit und Gras bekommen ein weißes Vertex-Farb-Attribut, damit USE_COLOR im Fragment steht (die Batch-Instanzfarbe läuft in three r186 nur über `vColor`).
  - Rollen: Krone Laub, Laub dunkel oder Blüte (je Instanz gewürfelt); Busch Blüte oder `leaf[0]`; Stamm Laub −105°, Helligkeit × 0,62; Stein Rolle `rock`; Gras `leaf[0]` in drei Stufen.

## 5b · Farbe auf Meshy-Bühnen (V-806 bis V-814)

**Ausgangslage:** Die Bühnen und Dioramen sind Meshy-Modelle mit fertig gemalter Textur. V-286 sah dafür nur sanfte Tönung vor. V-803 verlangt, dass sie zur Biom-Palette des Ortes gehören. Rollen werden je Teil als Code im Vertex-Kanal COLOR_1 gespeichert (§5c); die Laufzeit färbt nach der Palette des Ortes.

**Geltende Regeln (Stand V-814):**
- **Tönung:** Meshy-Rollen-Teile Zug 1,0 auf Farbton und Sättigung; Helligkeit und gemalte Zeichnung bleiben (V-809). Kit-Teile 0,85 mit Deckel ΔE00 ≤ 18. Teile ohne Rolle (255) 0,18. Nur das Fokus-Teil zieht auch die Helligkeit (V-806).
- **Braun-graue Teile:** mittlere Albedo-Buntheit C* < 15 → `gradient_map` (Helligkeit der Textur → Farbton und Sättigung der Rolle), Option im Kanon-Modul `kfb_clay_bpy`, nicht in Textur oder COLOR_0 gebacken (V-809, V-812).
- **Code-Einheit:** je Bauteil des Spiel-Meshes. Verschweißt, Knickkanten über 40°, Bauteile über 15 % der Bühne nach Richtung geteilt, an Stein-IDs gerastet (V-406, R+G byte-gleich). Code aus der Geometrie: Oberseite `top`, steil `hill[0]`, steil und schlank `tower`. B9-Mehrheit nur als Rest (V-812, ersetzt die 35°-Flächenregel aus V-808).
- **Fokus:** genau ein Teil je Bühne trägt `pad`: ganzer Rahmen samt Bildschirmkante, ohne Rahmen das zentrale Wahrzeichen. Bildfläche ohne Rolle (V-808, V-329).
- **Ausnahmen (V-806):** Amphitheater-Bögen voll nach Rolle; schlanke Türme `tower`; grüner Bewuchs Laub; Steinkit-Teile in Dioramen behalten ihre Farbe in COLOR_0; Kayfabrick-Steine und Fluff ohne Rolle.
- **Neue Richtung in Probe (V-814):** Code je Bauteil nur aus Geometrie und Textur-Grundfarbe. Graue bzw. dunkle Teile `hill[0]` mit `gradient_map`, kein `rock`; Laub nur für Pflanzen. Fokus von WS0 benannt. Probe auf Theater, Utopia Stage, Nature Island. Gewinn, wenn das K2-Mittel der drei über 6,7 liegt; Mesa erst nach einem Kandidaten-Blatt.
- **Nicht sauber einfärbbar, vorerst nicht im Spiel (V-814):** Akasha-Bibliothek, Comic-Sender, Dystopie-Gasse, Goblin-Bank, Kayfabrick-Baustelle, Abenteuer-Lager, Retro-Spielhalle, UFO-Cockpit. Das Gefängnis darf dunkel-violett ins Spiel (q232). Giza liegt wieder beim Konzeptblatt (WS0).

**Chronik der Kritiker-Runden** (blinder Kritiker, nur K2 Farbe, PASS ab 8):

| Runde | Stand | Ergebnis | Kernbefund |
|---|---|---|---|
| 1 | V-803, sanft (Zug 0,18) | REWORK 21/21, bestes 7 | Tönung nicht ablesbar; kein `pad` am Fokus; Mauern in `rock`/`tower`; Bewuchs grün |
| 2 | V-806: Zug 0,8, Kit 0,5, Deckel ΔE00 ≤ 18 | REWORK 23/24, Atlantis PASS, meist 6,5–7 | Wand-Regel griff nur für Fels; Kit-Zug zu schwach |
| 3 | Wand-Regel auch für Türme, Kit 0,85 mit Deckel, Fokus mit Helligkeit | REWORK 23/24, Mittel 5,5, kein Gewinn | Codes folgen Texturflecken; „sanft“ und „erkennbar“ widersprechen sich |
| – | V-808 Flächen (35°), V-809 „voll“ + `gradient_map`, V-812 Bauteile (Proben ohne Kritiker) | Flächen: kaum Wirkung; voll: Palette lesbar; Bauteile: ruhiger | Rest-Flecken kommen aus den B9-Codes |
| 4 | V-812 gebaut (19 Meshy-Bühnen + 3 Kit-Dioramen), Gate 19/19 grün | REWORK 22/22, K2 4,5–7, Mittel 5,8 | Stopp-Regel; neue Richtung V-814 |

Quellen im Wortlaut: `FARBROLLEN_KONZEPTBLATT_WSB.md`, `VORSCHLAG_BAUTEILE_R1.md`, `kritik_runde4_farbe.md`, `COLOR_CONCEPT_R1.md` (Teil 3).

## 5c · Rollen-Codes im Kanal COLOR_1 (aus COLOR_CONCEPT_R1)

COLOR_1 RGBA8: R+G = Stein-ID (16 Bit), B = Rollen-Code, A = 255; COLOR_0 weiß. Die Laufzeit liest den Code flach bzw. als nächsten Code, nie interpoliert.

| Code | Rolle | Code | Rolle |
|---|---|---|---|
| 0 | Boden `top` | 9 | Stamm `trunk` |
| 1 | Türme/Bögen `tower` | 10 | Sand `sand` |
| 2 | Ränge/Stufen/Wand `hill[0]` | 11 | Erde/Sockel `under[1]` |
| 3 | Fels `rock` | 12 | Wolke/Fläche `cloud` |
| 4 | Rahmen `strang` | 13 | Wasser/Fluid `water` |
| 5 | Akzent `pad` (nur Fokus) | 14 | Weg `path` |
| 6 | Laub `leaf[0]` | 15 | Boden hell `top2` |
| 7 | Laub `leaf[1]` | 16 | Hügel dunkel `hill[1]` |
| 8 | Blüte `leaf[2]` | 255 | keine Rolle |

Farbskript für Dioramen (Konzeptblatt): 60 % Boden- und Wandrollen, 30 % Fels, Holz und Rahmen, 10 % Akzent nur am Fokus.

## 6 · Asset-Inventar (lokal vorhanden)

| Paket | Modelle (Dateien) | Heute im Löser |
|---|---|---|
| KayKit Forest Nature Pack 1.0 | 84 (Bäume 20, Büsche 22, Gras 20, Felsen 17, Steine L 5) | ja |
| KayKit Medieval Hexagon Pack 1.0 | ~926 Dateien (Kacheln, Natur, Gebäude) | nein |
| KayKit Medieval Builder Pack 1.0 | ~226 | nein |
| KayKit Medieval Snow Biome | ~78 | nein |
| Tiny Treats Pretty Park / Pleasant Picnic / Homely House | 28 / 41 / 27 | nein |
| Quaternius Ultimate Nature Pack | ~300 | Stumpf und Holz in Blender lokal |
| Quaternius Stylized Nature MegaKit | ~115 (Common/Birch/Pine/GiantPine/Twisted/Dead/CherryBlossom ×5, Busch, Farn, Klee, Blüten, Felsen, Pfadsteine) | nein |
| Kenney Nature Kit | ~987 Dateien | 3 Platzhalter |
| Steinkit v4 (KFB) | 170 Kacheln | ja |

**Anforderung:**
- Alle passenden Teile werden mit Rolle (Boden, Stein, Rinde, Laub, Akzent), Form-DNA-Klasse, Skalen-Normierung und Gate-Hülle registriert und stehen WFC und Platzierung zur Verfügung.
- Familien je Ort halten die Formensprache zusammen.

*Stand R2:* Register noch nicht gebaut. Dazu kommen die Meshy-Bühnen und Dioramen (22 im Farbdurchgang, davon 13 einfärbbar plus Gefängnis) als Orte für die Zonen-Verteilung (V-815).

## 7 · Werkzeuge und Pfade (für Rückfragen)

- **Kanon:** `KFB_HUB/30_DECISIONS/CANON_3D/` (CANON_3D_R1.md, EINARBEITUNG_WS1_R1/R2, CRITIC_3D_R1, lib/, sources/).
- **Löser:** `CANON_3D/lib/kfb-place-core.v1.mjs`, `kfb_place.r1.json`, CLI `kfb-place.mjs` (`--golden`).
- **Spiel:** Repo `KFB-Stunt-Car-Race`, Branch `game/proc-world-ws0`:
  - `src/world/placeWorker.js` (Modi place/mass/cartoon), `placeVeg.js`, `zoneField.js`, `endlessTerrain.js`, `biomeField.js`;
  - `src/look/terrain3.js`, `biomeTerrain.js`.
  - Neu: `src/world/cardRelief.js` (Karten-Relief), `keepout.js` (Freiflächen), `EndlessDrive.jsx` (Anschluss, Schalter), `src/assets/cards/card_r3.*` (Kartenpunkte und Höhenkarte), `src/data/worlds/kfb-biome-drive.r1.json` (Biom-Feld).
- **Blender:** `KFB_HUB/50_BLENDER/N40/` (lib: `kfb_env.py`, `kfb_place_bpy.py`, `kfb_erdkeil_bpy.py`, `kfb_contact_tint_bpy.py`).
  - Neu: `KFB_HUB/50_BLENDER/V803_FARBROLLEN/` (RETURN.md, Kritiken Runde 1–4, Skripte `b9_r812.py`, `v812_bauteile.py`, Bildpaare).
- **Farbe:** `30_DECISIONS/replies/COLOR_CONCEPT_R1.md` (Ausroll-Rollen, Rollen-Codes), `FARBROLLEN_KONZEPTBLATT_WSB.md`, Generator `kfb-cartoon-palette.js`.
- **Plan:** `30_DECISIONS/WS0_STATE.md` → „Fahrplan“; Register `decisions.json`.

## 8 · Fahrplan und Endlos-Welt komplett (V-805, V-815)

| # | Stufe | Inhalt | Stand 25.10. abends |
|---|---|---|---|
| 1 | Fahrphysik S1 (V-783) | Landestoß, Festfahren, Kippen, Drehrate, Sprungbogen, Stand am Hang; Kameras; Fassrolle | erledigt; offen: Tricks als HUD-Knöpfe, Dieselpunk-Flug, Mech, Drehung beim Gehen |
| 2 | Gameplay-Critic | blinder externer Prüf-Agent nach den Fixes | offen |
| 3 | Wasser | Seen und Ufer (`kfbWater`), Flüsse (`kfb-hydro`) in der endlosen Welt, Fluid-Farben aus dem Biom-Schema (V-750) | offen |
| 4 | Amphitheater | einpassen und farblich ins Biom integrieren (q225) | offen |
| 5 | Karten-Gelände | eine Karte je Zone, Ortsbezug, nach Modell R3; Auto stößt Kugeln (q226) | eine Karte im Ring gebaut |
| 5b | Endlos-Welt komplett (V-815) | `world=endless` als Standard; Wasser im Endlos-Gelände; Orte, Bühnen, Dioramen, Karten je Zone prozedural und reproduzierbar; Bewohner, Fluffer, Obstgärten, Fluff je Zelle mit festem Seed; Gedächtnis je Zelle (eingesammelt, gesprengt, erledigt); mitwandernder Weltursprung; Orientierung (Kompass/Minikarte, POI-Hinweise, Fahrzeug-Seele) | geplant; Abschluss: Video einer langen Fahrt ohne Rand, mit Orten und Bewohnern |
| 6 | Splat-Probe | kleinster Test (V-733) | offen |
| danach | Combat, Destruction | V-782, V-767 | |

**Kontext außerhalb des Prüfgegenstands:** Fahrgefühl-SFX (V-807), Fahrzeug-Seele KnuckleBob als seltene Vignette (V-810), Mindscape-Klangbetten für Fahrt und Flug (V-811), Genius Loci für Orte als spätere Idee (V-813).
