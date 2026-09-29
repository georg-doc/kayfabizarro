# KFB Clay-Partikelgrammatik v1

## Prinzip

VFX sehen aus, als würden kleine Stücke derselben lebenden Knetwelt abgeschabt, gequetscht oder hochgeschleudert. Sie sind keine fremden Rauchkarten, Neonfunken oder generischen Glitzer-Sprites.

## Grundformen

- Kugel/Knubbel: 55–75 %
- gestauchter Tropfen: 15–30 %
- kurzer Knetspan: 5–15 %
- Staub darf als sehr kleine matte Kügelchen erscheinen; kein flächiges Alpha-Wölkchen als Standard

Alle wiederkehrenden Formen werden instanziert. Rotation, Maßstab und Farbe variieren deterministisch über Seed.

Die VFX-Materialien leiten Farbe, Rauheit und Reliefmaß aus den K2-Rollen ab, verwenden aber **nicht** den vollständigen `clay-material.v10`-Werkzeugpfad pro Partikel. Ein reduzierter, schattenloser Clay-Shader erhält die Oberfläche, ohne die bis zu sechs Werkzeuglagen je Pixel zu vervielfachen.

## Ereignisfamilien

| Ereignis | Bewegung | Materialreaktion |
|---|---|---|
| Rollen | wenige niedrige Krümel nach hinten | Bodenfarbe ± kleine Helligkeitsstreuung |
| Drift/Bremsen | seitlicher Fächer, einzelne gequetschte Perlen rollen aus | dunkler Asphaltgummi, Gras-/Sandfarbe im Offroad |
| Streifen/Kollision | kurzer gerichteter Stoß plus 1–3 größere weiche Knubbel | Farbe der Bande/Zaunsockel; keine Metallfunken ohne Metallquelle |
| Landung | ringförmiger, flacher Impuls am Kontaktpunkt | Biomfarbe; Größe proportional zur tatsächlichen Landungsenergie |
| Boost | rhythmische Perlenkette/kurze Stränge, nicht Laser | Track-Akzentfarbe, nach hinten gestaffelt |
| Biomwechsel | kurze gemischte Phase beider Profile | kein harter Emitter-Wechsel an einer Linie |

## Biome

- **City:** matte graue/rosige Asphaltkrümel, wenige helle Bordsteinperlen; sparsam.
- **Wiese:** grüne Knetkügelchen und kurze Halme/Späne; weichere Flugkurve.
- **Canyon:** ocker/orange Kugeln, kleine trockene Brocken, etwas längere Ausrollzeit.
- **Küste/nass:** dunklere gequetschte Tropfen und wenige helle Schaumkügelchen; nur visuell, solange kein Water-Owner angebunden ist.
- **weird/fraktal:** dieselbe Formfamilie mit gezieltem Palette-Shift; keine zusätzliche Partikelarchitektur.

Biome, Licht/Mood, Trackrand und VFX lesen denselben Zonen-Seed. Ein Biomwechsel mischt kurz beide Partikelprofile, während Geometrie, Markierungen, Props und Licht jeweils eigene versetzte Fenster besitzen.

## Qualitätsstufen

Startwerte, in der echten Runtime zu messen:

- `LOW/mobile`: maximal ca. 60 gleichzeitig sichtbare Partikel, kurze Lebensdauer, 1–2 Grundmeshes.
- `MEDIUM`: maximal ca. 120, 3 Grundmeshes, begrenzte Bodenabpraller.
- `HIGH/desktop`: maximal ca. 200, 3–4 Grundmeshes, wenige klebende/rollende Nachläufer.

Emitter verwenden Pools; keine Objektanlage pro Frame. Entfernte VFX werden reduziert oder ganz ausgelassen. Partikel werfen standardmäßig keine dynamischen Schatten.

Der T4-Beweis misst drei Zustände in derselben Kamera: K2 ohne VFX, LOW-VFX und HIGH-VFX. Bei Unterschreitung des Performanceziels werden zuerst MaxAlive, Lebensdauer und Bodenabpraller reduziert; die Fahrbarkeit und K2-Großform bleiben unangetastet.

## Datenprofil

`clay-particle-profiles.v1.json` enthält pro Profil mindestens:

- `id`, `biome`, `event`
- `meshSet`, `materialRole`, `palette`
- `spawnMin`, `spawnMax`, `maxAlive`
- `sizeRange`, `speedRange`, `spread`
- `lifetimeRange`, `gravityScale`, `bounce`, `stickChance`
- `qualityOverrides`
- `sourceRef` und `notes`

Gameplay liefert Ereignis, Kontaktpunkt, Normalenrichtung, Geschwindigkeit/Energie und Biom. Das VFX-Modul liest diese Werte; es schreibt keine Fahrzeugphysik und entscheidet keinen Schaden.
