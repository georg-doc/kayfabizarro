# Meshy-Kulissen · Browser-Fassungen (V-246)

Georg wählte am 15.10.2026 Mesa Island = B und Akashic Library = A. Die Masters liegen in Georgs Dropbox `/CLAUDE/MeshyModels/` und sind nicht im Repo.

| Datei | Quelle | Dreiecke | Größe |
|---|---|---|---|
| kfb-meshy-mesa-island.browser-b.v1.glb | Mesa Island Base 3D.glb (75 MB) | 100 k | 4,6 MB |
| kfb-meshy-akashic-library.browser-a.v1.glb | Akashic Library Diorama.glb (184 MB) | 350 k | 14,7 MB |

- **Methode:** gltf-transform `simplify` (meshoptimizer, UVs bleiben), Texturen 2048² WebP (Metal/Rough 1024²), ohne Laufzeit-Decoder. Blender-Decimate wurde verworfen, weil es die Schrift zerstörte.
- **Bildzeit:** 1,2 ms (Insel) und 2,2 ms (Bibliothek), M1 Max, three 0.186.1.
- **Bekannt:** Mesa hat 3 lose schwebende Felsbrocken. Bei der Library schwebt das Schild ohne Pfosten. Unter 0,3 % der Kanten sind non-manifold, das ist nur für Kollider relevant.
- **Einbau:** WS1 nach dem Muster des Amphitheaters (V-230), mit einer Kennung im Asset Librarian.
