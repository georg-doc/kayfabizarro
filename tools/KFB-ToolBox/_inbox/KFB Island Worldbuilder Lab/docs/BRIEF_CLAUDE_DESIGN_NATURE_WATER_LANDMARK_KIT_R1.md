# Claude Design · KFB Island Kit R1 · Natur, Wasser, Landmarke, Unterseite

> **Update 2026-10-08:** Teil A (Vegetation und Steine) entfällt. Natur kommt aus fertigen CC0-Kits, siehe `SPEC_ENVIRONMENT_KIT_R1.md`. Es bleiben B (Pyramide), C (Wasser), D (Unterseite).

Du baust **Formen und Look**, keine Spielsysteme. Ergebnis sind three.js-Module, die der KFB Island Worldbuilder (`~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/`, three.js r186) direkt lädt. Platzierung, Bewohner, Wege und Editor gibt es dort schon.

## Warum

Der Worldbuilder steht: Umriss-Editor, Paletten, Clay-Material, gemessene Unterseiten-Regel, Wege, Bewohner mit KFB Eye-Rig, Speichern. Was nicht stimmt, ist die **Formqualität**:

- Bäume, Palmen und Steine sind aus Kugeln und Röhren gebastelt.
- Die Pyramide ist ein Stapel weicher Platten statt eines gebauten Bauwerks.
- Wasser ist eine flache Folie auf dem Gelände.
- Die Unterseite der Inseln ist entweder rund ohne Zapfen oder zapfig ohne Clay-Look.

## Referenzen (anhängen)

- **DioramaScenes A–I + Übersicht** (`KFB Claymation Reference/`): acht schwebende Inseln, die Formreferenz für Insel, Unterseite, Strand und Wasser.
- **FLOATING ISLANDS DESIGN** (gleicher Ordner): Stimmung, Wasserfälle über die Kante, Inselvielfalt.
- **Joyride** `track-look.v5.js`: Paletten Canyon, Bikini-Bucht, O-Town; Naturgrammatik (krumme Stämme, Kugel-in-Kugel-Kronen, Kissentürme, Rule of Three).
- **KFB Clay K2** `clay-material v10` + Fingerabdruck-Scan + `clay-soften v1`.
- **Gemessene Unterseiten-Regel:** `docs/ISLAND_ANATOMY_RULES.md` im Lab.
- **Fertige Asset-Sets** (KayKit Forest Nature, KayKit Medieval Snow Biome, Quaternius Stylized Nature MegaKit, Kenney Nature Kit, StreakByte Floating Islands, inklusive der Palmen der Strandinsel). Georg: Die Palmen aus diesen Sets sind deutlich besser als die selbstgebauten.

## A · Vegetation und Steine pro Biom

Biome: Canyon, Bikini-Bucht (Strand), O-Town, Pyramiden-Wüste, Schnee, Herbstwald, Kirschblüten-Teich, Wiese.

- Pro Biom **2–3 Baumarten**, dazu Büsche, Steine, Grasbüschel, bei Strand und Wüste Palmen.
- Formsprache einheitlich, im Clay- und Joyride-Look. Fertige Set-Modelle dürfen verwendet werden, wenn sie mit Clay-Material und Palette in dieselbe Welt passen. Sonst sauber nachbauen, nicht aus Grundkörpern zusammenstecken.
- Je Art mehrere Größen und Varianten, damit Gruppen nicht geklont wirken.
- **Gruppen-Bausteine** nach Rule of Three: Anker, Stütze, Akzent, als fertige Kleingruppen.
- Jedes Element bringt seinen eigenen **Fuß** mit: eingegraben, Kontaktschatten, kleine Überlappungen (Gras, Kiesel) am Boden. Nichts darf schweben oder aufgeklebt wirken.

## B · Landmarke Pyramide

- Stufenpyramide als **gebautes Bauwerk**: sichtbare Blöcke, klare Höhenstufen in guten Proportionen, eine eingeschnittene Treppe, ein Eingang, leichte Abnutzung.
- Flache oberste Plattform als **Sockel für das große KFB-Cartoon-Auge** mit Clay-Lidern, das allsehende Auge wie auf dem Dollarschein. Das Auge selbst kommt später, der Sockel muss es aufnehmen können.
- Größe: Landmarke einer Insel von etwa 90 m Durchmesser, also rund 55–60 m Basis.
- Wüstenpalette „D · Pyramiden-Wüste“ aus dem Lab (`src/palettes.ts`).

## C · Wasser

Wasser ist bisher eine Folie. Es braucht ein schlüssiges Darstellungskonzept:

1. **Seen, Teiche, Bäche und Flüsse mit Tiefe.** Echtes Becken im Gelände, Ufer, eine Farbabstufung von flach zu tief. Eine Figur kann hineingehen und versinken. Der Look muss eine Tiefe zeigen, die Schwimm- oder Versink-Physik baut später das Spiel.
2. **Fließendes Wasser an der Inselkante.** Ein Fluss läuft bis zum Rand und über die Kante hinunter: Wasserfall, oder als charmante Variante tropfend, in Clay- und Cartoon-Sprache. Bisher ist die Kante dort ungelöst.
3. **Küstenlandschaft.** Eine Strandinsel mit einer **größeren Meeresfläche** auf der Insel: Lagune oder Bucht, Strandlinie, Schaumrand, Palmen aus den Sets. Wie das Meer an der Inselkante endet (Lippe, Überlauf, Tropfen), ist Teil des Entwurfs.
4. Ein **Wasser-Material** im Clay- und Cartoon-Stil, das zur Palette jeder Insel passt.

## D · Unterseite: rund und trotzdem Tropfstein

Die gemessene Regel bleibt:
- Grasnarbe 2–4 % der Breite.
- Tiefe 0,43–0,52 der Breite.
- Verjüngung von 100 % oben über 67 % bei 40 % Tiefe auf 17 % ganz unten.
- 5–35 Zapfen in unterschiedlichen Tiefen, der tiefste außermittig.

Gesucht ist der **Clay-Cartoon-Look darauf**: weiche, gedrückte Knetklumpen, abgerundete hängende Zapfen wie Tropfsteine aus Knete, keine harten Facetten, keine Streifen. Ein geschlossenes Mesh.

## Lieferung

Module mit diesen Schnittstellen. Das Lab passt sich an, wenn du bessere vorschlägst:

```js
buildVegetation({ biome, palette, seed, kind, size }) → THREE.Object3D        // eine Art, mit Fuß
buildCluster({ biome, palette, seed, role: 'anchor'|'support'|'accent' }) → THREE.Object3D
buildPyramid({ palette, size, seed }) → { object, topSocket: { position, width } }
buildWater({ outline, heightAt, bodies: [{ type: 'lake'|'river'|'sea', shape, depth, toEdge }] }) → THREE.Object3D
buildUnderside({ outline, palette, seed, depth }) → THREE.BufferGeometry       // nach der gemessenen Regel
```

Dazu Screenshots je Biom (Insel von oben, von der Seite, von unten), die Pyramide, Wasser mit Tiefe, Fluss über die Kante und die Strandinsel mit Meer.

## Nicht machen

- Keine Grundkörper-Bastelei, keine gleichförmige Streuung, keine Fremdästhetik ohne Clay und Palette.
- Kein Wasser als flache Folie, kein spitzer Kegel als Unterseite.
- Keine Bewohner, Wege oder Editor-Funktionen: Die gibt es schon.
