# KFB 3D Claymation · Diorama & World Building · How-to

Stand 2026-09-27 · Linie Knetwelt (»KlayfaBizarro«) · belegt an D1 Knet-Probe, M0 Knet-Medizin, H0 Hirnwelt.
Diese Anleitung beschreibt das Verfahren. Zahlen stammen aus den laufenden Modulen; wo ein Wert eine
Setzung ist und keine Messung, steht das dabei.

---

## 1 · Der Grundsatz: nicht modellieren, kneten

**Die Häuser sind nicht modelliert und nicht umgebaut.** Es sind unveränderte KayKit-City-Builder-Bits
(`building_A…H.gltf`, CC0). Schiefe Fenster, weiche Türen und die gedrückten Fassaden entstehen aus drei
Schichten, die auf jedes Low-Poly-Modell passen:

| Schicht | Modul | macht | kostet |
|---|---|---|---|
| A · Geometrie-Vorstufe | `lab-clay/clay-soften.v1.js` | unterteilen, nach Lage verschweißen, Taubin-Glättung, Beulen | einmal beim Laden (CPU) |
| B · Knet-Material | `lab-clay/clay-material.v4.js` + `clay-relief.v2.js` | Handspuren, Feinkorn, Druckfacetten, Falten, Fingerabdrücke mit Hautfett-Glanz | je Pixel (GPU) |
| C · Licht und Verdeckung | im Szenenmodul | Sonne + Himmel + Gegenlicht, ACES, GTAO | je Bild |

Warum die Fenster so lesen: KayKit-Fassaden tragen Fenster und Türen als kleine eingelassene Boxen mit
harten Kanten. Die Vorstufe unterteilt sie auf eine maximale Kantenlänge und glättet mit Taubin (λ/μ, ohne
Schrumpfen). Kanten runden sich, die Beulen verschieben die Rahmen unterschiedlich stark, dadurch stehen die
Fenster leicht schief. Das Material legt dann Druckspuren quer über die Fassade, die Farbe bleibt die der
KayKit-Textur. **Muster zum Übernehmen: CC0-Low-Poly kaufen, Vorstufe + Material darüberlegen.** Dasselbe
Verfahren ist für OSM-Blöcke vorgemerkt.

---

## 2 · Schicht A · Vorstufe (`softenGeometry`)

```js
import { softenGeometry } from './lab-clay/clay-soften.v1.js';
const soft = softenGeometry(THREE, mesh.geometry, opt).geometry;
```

Standard: `{ maxEdge: 0.18, maxLevels: 3, iters: 8, lambda: 0.5, mu: -0.53, lump: 0.018, lumpFreq: 1.6, maxTris: 90000 }`.
`maxEdge` ist in Modell-Einheiten (vor der Skalierung), `lump` relativ zur Objektdiagonale.

| Objektklasse | Einstellung | Quelle |
|---|---|---|
| KayKit-Häuser | Standard | D1, H0 |
| Kenney-Fahrbahn | `{ maxEdge: 0.16, iters: 4, lump: 0.01 }` | D1 |
| Kenney-Rennwagen | `{ maxEdge: 0.12, iters: 4, lump: 0.008 }` | D1 |
| KayKit-Autos (City Builder) | `{ maxEdge: 0.03, iters: 4, lump: 0.002 }` | H0, Setzung |
| Kissenziegel (Box) | `{ maxLevels: 0, iters: 14, lambda: 0.55, mu: -0.57, lump: 0.02, lumpFreq: 1.1 }` | D1 |
| Kugeln (Wolke, Masse) | `{ maxLevels: 0, iters: 1, lump: 0.06–0.07 }` | D1 |
| Figuren mit Skin | **nie** — das Modul überspringt Skin-Netze | Regel |

Regeln:
- Ergebnis je Quellgeometrie cachen (`Map` auf `mesh.geometry`). Geklonte Szenen teilen Geometrie.
- Danach **klonen und säen**: `seedGeometry(THREE, soft.clone(), seed)`. Ohne Klon trägt jede Kopie
  dasselbe Muster (Befund D1 v1 → v2).

## 3 · Schicht B · Knet-Material

```js
const rel = makeClayRelief({ size: 1024, seed: 11 });                 // kachelbare Gradientkarte
const tex = new THREE.DataTexture(rel.data, rel.size, rel.size, THREE.RGBAFormat); // Repeat, Mipmaps, Anisotropie
const U = makeClayUniforms(THREE, tex);                               // EINMAL je Szene
U.uClayPrint.value = await makePrintTexture(THREE, 'ref/clay-joebinns/Fingerprints01_3K.png', 2048); U.uClayPrintOn.value = 1;
const m = makeClayMaterial(THREE, U, { src, role, palMap, scale });  // je Quellmaterial
```

- `src`: vorhandenes glTF-Material (Farbe, Karte, Vertexfarben, Normal-Map werden übernommen). Für eigene
  Formen `new THREE.MeshStandardMaterial({ color, vertexColors })` als `src` übergeben — dann läuft der
  Modelle-Weg, den Georg für alles gewählt hat (D1 v5).
- `role`: `world` (Rauheit 0,98, volles Relief) · `soft` (0,9 / 0,7, Figuren und Wolken) · `knetbar` (0,55 / 0,45, glänzende Masse, Wasser).
- `scale` je Material: Kissenziegel 1 · Deckel 1,4 · Würste 0,45 · Masse 0,9 · Wolke 0,75 · Tafelberge 3,2 ·
  Hirn-Gelände 1,1 · Straße 0,5 · Modelle 0,5. Je Objekt ±20 % Streuung aus `claySeed`.
- `palMap: true` zieht Farben auf die Palette (Nächster-Farbe in OKLab); in H0 aus, die KayKit-Farben bleiben.
- Georgs Reglerstand D1 (Standard der Uniforms): Handspuren 0,55 · Feinkorn 0,16 · Druckstellen 0,5 ·
  Kachel 1,6 m · Facetten 0,14 · Falten 0,6 · Facettengröße 0,65 m · Fingerabdrücke 0,35 · Hautfett 0,22.
- Das Relief rechnet in Welteinheiten (Kachel 1,6). Eine Welt im Maßstab von D1 (Figur ≈ 1,2 Einheiten)
  braucht keine Umrechnung. H0 hält diesen Maßstab mit 0,25 Einheiten je mm.

Verworfen (nicht wieder aufgreifen): Höhenlinien eines Rauschfeldes (lesen als Holzmaserung), gleichmäßig
dichte Fingerzüge (lesen als Cord), vollprozedurale große Flächen (Georg: »vorher besser«).

## 4 · Schicht C · Licht

| Teil | D1 | H0 |
|---|---|---|
| Tonemapping | ACES, Belichtung 1 | ACES, Belichtung 1 |
| Sonne | `#fff4e6`, 2,9, Höhe 30°, Azimut −38°, Schatten 2048, PCF soft | 2,8, Höhe 38°, Azimut −30°, Schatten 4096 auf ±34 |
| Himmel/Boden | Hemisphäre `#d6e8f6` / `#d9a27a`, 0,95 | gleich |
| Gegenlicht | – | 22 % der Sonne von gegenüber, ohne Schatten (sonst säuft die Unterseite einer Kugelwelt ab) |
| GTAO | Radius 0,45, Mischung 0,9 | Radius 0,6, Mischung 0,85 |
| Hintergrund | Claybound-Himmel `#96bede`, flach | gleich, kein Verlauf |

Sonnenfarbe warmweiß lassen; gesättigtes Licht färbt Knete um (Befund Cologne: Gelb × Petrol = Grün).

## 5 · Muster »Kugel in Kugel«

Wolken, Baumkronen und das Auge der Sternwarte sind Kugeln, die ineinandergesteckt werden. Mit dem Relief
lesen die Schnittkanten wie zusammengedrückte Knetkugeln.

- **Wolke:** 4–7 `IcosahedronGeometry(r, 4)`, r 0,9–1,9, gestaucht (1 · 0,8 · 0,85), Abstand 0,62 je Kugel,
  `role: 'soft'`, `scale: 0.75`, Farbe `#e2d0bc`. H0: 9 Wolken auf Bahnen mit Radius 30–37 um die Welt.
- **Baum:** Stamm `CylinderGeometry` (0,05/0,08 · h 0,32–0,57), Krone 3–5 `IcosahedronGeometry(r, 2)`,
  r 0,15–0,28, Versatz 0,15. Farbe zwischen `#1f7a3e` und `#cdc666` je Baum, je Kugel ±3 % Helligkeit.
  Alle Bäume einer Zone in EINE Geometrie mergen (Vertexfarben), zwei Draw Calls je Wald.
- **Plinthe:** flacher Knetfladen (`SphereGeometry` gestaucht auf 0,22) unter jedem Haus, 0,22 Einheiten
  größer als der Grundriss. Hält Häuser auf gewölbtem Boden, ohne dass Ecken schweben.

## 6 · Welt auf einer Kugel (H0)

1. **Bake (einmal, offline):** Netze (BodyParts3D-STL) in three-Achsen, Zentrum festlegen. Je Punkt einer
   gleichwinkligen Würfelkugel (6 × 161²) den **äußersten** Strahltreffer vom Zentrum speichern: Dreiecke je
   Würfelseite rastern, Maximum behalten, Region-ID dazu. Lücken aus Nachbarn füllen. Ergebnis 777 kB
   (`Float32` Radius + `Uint8` Region). Funktioniert für sternförmige Körper; Überhänge gehen verloren.
2. **Laufzeit:** Kanten der Würfelseiten nach Richtung verschweißen (153 602 Punkte), Nachbarliste (CSR).
3. **Knetgrad** = Taubin-Schritte auf dem Radius (0 = Messform, Standard 3).
4. **Hüllfläche** `RBAR` = 70 Laplace-Schritte (λ 0,9). Tiefe `RBAR − r` > 0 heißt Furche.
5. **Wasser** = zweites Netz mit Radius `RBAR − Wasserstand` (Standard 2,2 mm). Es taucht nur dort auf, wo
   das Gelände tiefer liegt: Sulci werden Flüsse, ohne dass ein Fluss gezeichnet wird.
6. **Farbe** je Vertex: Lappen-Farbe, je Windung ±4 % Helligkeit, in Furchen Richtung `deep` gezogen.
7. **Anker je Region:** nah am Schwerpunkt, hoch über der Hüllfläche, flach (Winkel ×9, Höhe ×0,35, Flachheit ×2,2).
8. **Platzieren:** Oben = Radialrichtung gemischt mit Geländenormale (`blend` 0,25 Figuren · 0,35 Häuser ·
   0,6 Beete), Fußpunkt der Modelle auf den Ursprung gesetzt (Hülle unten Mitte), 0,1 eingesenkt.
9. **Streuen:** Kandidaten um den Anker, verworfen wenn unter Wasser, näher als Bandbreite + 0,7 an der
   Straße oder zu nah am Nachbarn.

## 7 · Straßenführung

1. **Wegpunkte** = Regions-Anker in fester Folge (H0: 20 Gyri, eine Runde über beide Hälften).
2. **Route** je Abschnitt: A* über das Kugelnetz. Kante kostet
   `L · (1 + 0,8·t + 0,25·t² + 2,5·|Δr|/L)`, `t` = Furchentiefe in mm. Die Straße bleibt auf den Graten.
3. **Glätten** (6 × gleitendes Mittel über 7 Richtungen), **gleichmäßig abtasten** (0,8 mm).
4. **Bandbreite prüfen:** Geländehöhe je Abtastpunkt als Maximum über Mitte und ±½/±1 Bandbreite.
   Ohne das stoßen Buckel durchs Band (Befund H0 v1).
5. **Brücken aus der Hüllkurve:** gleitendes Maximum (±7), zweimal Gauß (±8), dann `max(Hülle, Gelände) + 0,45 mm`.
   Wo die Straße > 1,2 mm über dem Gelände liegt, ist es eine Brücke; ab 1,6 mm alle 9 Punkte ein Pfeiler
   (Kapsel r 0,09).
6. **Rahmen:** oben = Geländenormale 55 % + Radial 45 %, auf Brücken rein radial; vorwärts aus den Nachbarn;
   seitlich = vorwärts × oben.
7. **Profil** (× halbe Breite 0,4 / Höhe in Einheiten): Rand −1/−0,1 · −1/0,05 · Wulst −0,86/0,12 ·
   −0,74/0,03 · Mitte ±0,05/0,03 · spiegelbildlich. Wülste und Mittelstrich `#e2d0bc`, Fahrbahn `#5d6f86`,
   Mittelstrich 4 an / 4 aus.
8. **Verkehr:** Autos rechts (+0,38 Halbbreite), Fußgänger links gegen die Fahrtrichtung (−0,45), Lage
   aus Bogenlänge, Räder drehen um x. KayKit-Autos schauen nach +Z (Vorderräder bei z +0,245).

## 8 · Figuren

- Quelle: Resident Atlas (`tools/resident_atlas_s6/data/cast.js`) sagt je Figur Pfad und Rig.
- **Large ist nicht »Medium, größer«**: eigenes Skelettmaß, Faktor ≈ 2 (Atlas S20). Large-Figuren nur mit
  `Rig_Large_*`-Clips. Alle Figuren mit **einem** Maßstab skalieren (H0: 0,47), dann bleibt das Verhältnis.
- Clips säubern: Skalenspuren raus, Positionsspuren nur an `root|hips|pelvis`.
- Rig_Large hat nur Idle_A, Idle_B, Walking_A, Running_A (und Kampf/Tod). Kein Sitzen, kein Winken.
- Knet-Material ja, Vorstufe nein (Skin).

## 9 · Anatomie als Landschaft (H0)

| Struktur | wird zu | Grund |
|---|---|---|
| Gyri | Hügelrücken, Straßen auf dem Grat | Form |
| Sulci | Flüsse | Wasserschale |
| Fissura longitudinalis | Schlucht mit Balkenbrücke | Corpus callosum liegt am Grund |
| Sulcus centralis | Zentralfurche mit Brücke | trennt Motorik und Tasten |
| Gyrus praecentralis | Motorik-Ring, Start | motorischer Kortex |
| Gyrus frontalis sup./med. | Stirnstadt, Planungsamt | Handlungsplanung |
| Lobulus parietalis sup. | Scheitelfelder | ruhige Fläche |
| Okzipitalpol | Sternwarte mit Auge | Sehrinde |
| Gyrus temporalis sup., hinten links | Hörbühne | Wernicke-Areal |
| Temporalpol | Mandelkern | Amygdala darunter |
| Gyrus parahippocampalis | Gedächtnisarchiv | Hippocampus-Umgebung |
| Cerebellum | Lebensbaum-Wald | Arbor vitae |
| Pons | Brückenlager | pons = Brücke |
| Insula | Insel | insula = Insel |

## 10 · Fallen, gemessen

- **Region ohne Oberfläche:** Insula (FMA72977/8) erreicht die Oberfläche nicht; frei liegt der Gyrus
  brevis accessorius (34/35). Ein leerer Anker ergab NaN und riss die Kamera mit. Anker prüfen, nie annehmen.
- **Quelle lückenhaft:** BodyParts3D 3.0 hat keinen Gyrus frontalis inferior (Broca), keinen Gyrus lingualis
  und keinen Cuneus als Netz.
- **Browser-Cache:** eine überschriebene Moduldatei läuft still alt weiter. Jede Änderung = neue `.vN.js`.
- **Nur Pixel zählen:** WebGL-Bühnen nur mit echter Pixelaufnahme prüfen (`preserveDrawingBuffer: true`).
- **Ladezeit:** H0 ≈ 40 s, Hauptteil ist die Vorstufe der Häuser. Nächster Schritt: Vorstufe offline als `.glb`.

## 11 · Checkliste neue Welt

1. Maßstab festlegen: Figur ≈ 1,2 Einheiten, dann passt das Relief ohne Umrechnung.
2. Gelände als Messform laden oder backen, Knetgrad als Regler.
3. `makeClayUniforms` einmal, Materialien je Rolle, `scale` je Material, `seedGeometry` je Instanz.
4. Modelle: Fußpunkt setzen, Vorstufe (außer Skin), Plinthe unter Bauten.
5. Straßen: Wegpunkte → Kosten mit Tiefe und Steigung → Hüllkurve für Brücken → Profil mit Wülsten.
6. Kugel-in-Kugel für Wolken, Bäume, Sonderbauten.
7. Licht nach Tabelle 4, Gegenlicht bei Kugelwelten.
8. Pixelaufnahme aus Totale, Nah, Mitfahren; Ladezeit und Bildrate notieren.
