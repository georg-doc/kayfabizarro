# UFO-Cockpit · Browser-Fassung mit Bildfläche (V-252, V-256, V-259)

Georg wählte am 15.10.2026 die Fassung „Monitor nach oben, 1,79:1“ (randlos, Monitor nicht verkleinert). Der Master liegt in Georgs Dropbox `/CLAUDE/MeshyModels/` und ist nicht im Repo.

| Datei | Inhalt |
|---|---|
| kfb-meshy-ufo-cockpit.screen-up179.v1.glb | Cockpit ohne Steuerknüppel, Monitor nach oben auf 1,79:1 verlängert, 14,1 MB |
| kfb-meshy-ufo-cockpit.screen-up179.v1.slot.json | Bildfläche `kfb_screen_slot`: Ecken, gewölbte Fläche, UV, sichtbare Öffnung, Bühnenmaß s = 8 m/u |

- **Bildfläche:** eigenes Mesh `kfb_screen_slot` (48×12, unlit Platzhalter). Inhalte kommen über das Bildflächen-Modul (V-256) als Textur oder CSS3D darauf, nie als dickes Billboard davor.
- **Seitenverhältnis:** Embedding-Standard 1,79:1 (V-259). Karten passen das Embedding an ihr Format an, ohne schwarze Ränder.
- **Einbau:** WS1 nach der Dialog-Szene (MVP-0), Muster wie Amphitheater (V-230).
