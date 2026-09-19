# Lichtkonzept Dungeon · S13.3

Stand 2026-09-17. Entstanden aus Georgs Einwand, dass die Wände „spiegelglatt“ wirken, Licht durch
die Bodenkanten scheint und die Lichtflecken stärker leuchten als die Fackel selbst — und aus der
Aufforderung, erst zu recherchieren, wie man 3D-Licht in einem Dungeon sauber setzt.

## Was die Praxis sagt (recherchiert, nicht gemeint)

1. **Fackeln sind Akzentlicht, nicht Hauptlicht.** Der klassische Fehler: um die Fackeln allein
   hell genug zu machen, übersteuert man sie — und schiebt damit den Abfall an die Szenenränder.
   Die Lesbarkeit trägt eine schwache Umgebungsschicht plus **ein** gerichtetes Licht.
2. **Specular auf 0** bei Dungeon-Stein. Glanz ist der Grund, warum eine Steinwand wie poliert
   aussieht.
3. **Wenige schattenwerfende Lichter.** Für feste Innenräume ist gebackenes Licht (Lightmap,
   Ambient-Occlusion-Map) der Standard; in Echtzeit bleibt: ein Schattenlicht, der Rest Fill.
4. **Zu helles, flaches Ambient plus „Aussensonne“ wäscht warme Punktlichter aus** — dokumentiert
   als eigener Fehlerfall in einem offenen Dungeon-Projekt.

## Was daraus im Generator steht (alles gemessen)

| Entscheidung | Wert | Grund |
|---|---|---|
| Materialien matt | roughness **0.95**, metalness 0 | das Pack liefert **0.45** — das war der Spiegelglanz |
| Tonemapping | **ACES**, Exposure 1.15 | ohne Tonemapping clippen Lichter hart auf Weiß (die ausgeblasenen Flecken) |
| Abfall | **1/r** (`decay 1`) | bei 1/r² bekommt ein 0,15 vorstehender Mauerstein das Doppelte → einzelne Lichtkegel |
| Fackel/Kerze | **2,4 cd** (Promo) bis 9 cd (Nacht), Reichweite 9–14 | Akzent, nicht Hauptlicht — nicht übersteuern |
| Schattenwurf | **nur Key-Light**, Schattenkamera aus der Szenenbox | in den Promobildern fallen alle Schatten in eine Richtung |
| Lichtempfänger | **Ebenen-Maske je Etage** | ohne Schattenkarten gibt es keine Verdeckung: ein Licht unten schien durch den 0,15 dünnen Boden nach oben (0 Leckagen gemessen) |
| Leuchtkörper | eigene Ebene, **eigenleuchtende Flamme** aus dem Netz gelöst | ein Punktlicht im Bauteil blies seine Flamme auf 255 aus |
| Lichtbudget | fester Pool von 18 | Quellen ohne Licht stehen als dunkle Halter da |

## Was noch offen ist

- **Glut/Glow.** Georgs Idee „das müsste eine leuchtende Sphäre sein“ ist in Echtzeit-3D ein
  **Bloom-Pass** (Postprocessing), keine Kugel im Netz: die Flamme bleibt Pack-Geometrie, und der
  Schein entsteht im Bild. Kosten: eine Renderkette (EffectComposer) statt eines direkten
  Renderings — und die Pixelproben müssen weiter am rohen Bild messen, nicht am Bloom.
- **Gebackenes Licht** (Lightmap/AO) ist der Weg zu „richtig“ aussehendem Kontrast in Ecken. Das
  heißt: Szene exportieren, in Blender backen, Map zurückspielen. Lohnt erst, wenn ein Grundriss
  festgehalten werden soll — ein Generator würfelt ihn ja neu.
- **Kontaktschatten** unter Requisiten kommen aus dem Key-Light; wenn das zu wenig ist, ist der
  nächste ehrliche Schritt ein SSAO-Pass, keine gemalte Scheibe.
