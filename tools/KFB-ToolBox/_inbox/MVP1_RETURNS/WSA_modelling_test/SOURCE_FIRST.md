# WSA Treppe R1 · Vorlage-zuerst-Notiz

Stand: 2026-10-10  
Basis: `georg-doc/kayfabizarro@3c42bf76364f8875cf1a63768fadfb570b6c3ff5`  
Zielbranch: `wsa/kfb-modelling-test-stairs-2026-10-10`

## Vorhandene Vorlagen

1. **KayKit `stairs_walled.gltf`**
   - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/stairs_walled.gltf`
   - Priorität: primär.
   - Übernahme: klare begehbare Treppenlesbarkeit, beidseitige Wangen, geschlossene Enden.
   - Nicht übernommen: starres Raster, identische Stufen, Materiallook.
2. **KayKit `stairs_wide.gltf`**
   - Pfad: `media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/stairs_wide.gltf`
   - Priorität: primär für Breite und Laufkomfort.
   - Übernahme: großzügige Laufbreite und eindeutiger Antritt.
3. **Kenney `stairs-stone.glb`**
   - Pfad: `media/3D_Assets/kenney_castle-kit/Models/GLB format/stairs-stone.glb`
   - Priorität: sekundär.
   - Übernahme: kompakte Silhouette und klare Trittfolge.
4. **Kenney `wall-narrow-stairs.glb`**
   - Pfad: `media/3D_Assets/kenney_castle-kit/Models/GLB format/wall-narrow-stairs.glb`
   - Priorität: sekundär.
   - Übernahme: Verhältnis Treppe zu flankierender Mauer.

Alle vier Quellen werden lokal als unveränderte Originalbytes untersucht. Keine Quelle wird überschrieben oder in die Lieferung kopiert.

## Stilrichtungen

- `G4_stone_bridge_sheet_webchat_r1.webp`: weiche Deckkanten, große ruhige Steinmassen, lesbare Enden; Variante „V2 with stairs“ nur als Richtung.
- `G1_rock_largeA_concept_sheet_1_webchat.png`: wenige große, handgeformte Volumen und sanfte Facetten.
- `G1_Town_Island_R2_cartoon_clay.png`: quellende, weiche Anschlusskante statt hartem Schnitt.

Die Bilder sind Stilrichtungen, keine Geometrievorlagen.

## Neu zu bauen

Ein eigenständiges Treppenbauteil ist in Familie A nicht vorhanden. Neu gebaut werden deshalb:

- eine zusammenhängende, unregelmäßige Treppen-/Podestform;
- zwei zusammenhängende Wangenmauern;
- zwei weich geformte End-/Antrittskörper.

Damit bleibt das Bauteil bei fünf großen Knetformen. Es werden keine Kugel-/Box-Cluster und keine wiederholten Einzelsteine erzeugt.

## Festgelegte Maße

- `H = 3,64 lab`;
- lichte Treppenbreite ungefähr `3 H = 10,92 lab`;
- Stufensteigung je Stufe `0,55–0,73 lab`;
- Auftritt je Stufe mindestens `1,46 lab`;
- Podesttiefe mindestens `3,64 lab`;
- Wangenoberkante ungefähr `1,82 lab` über der jeweiligen Stufenkante;
- Export: y-up, island-local, höchstens 20.000 Dreiecke.

## Bauentscheidung

KayKit bestimmt Lesbarkeit und Begehbarkeit. Kenney bleibt sekundärer Proportionscheck. Die KFB-Stilbilder bestimmen weiche, leicht unregelmäßige Oberflächen und gebaute Enden. Der Neubau ist nötig, weil keine bestehende Vorlage zugleich Lab-Maß, Familie-A-Farbe, Bauarmut und den KFB-Clay-Look erfüllt.
