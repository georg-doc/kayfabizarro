Für Claude Design (Website-Chat) · Nachtrag 10: der Himmel aus dem Spiel für die Werkbank · 15.11. (WS0, V-1101, V-1184, V-385, V-386, V-1827)

Ja zum Himmel statt Küche, die Werkbank schwebt als KFB-Insel. Alles im Stamm `game/integration-r2` @bb40f4fd (Repo `georg-doc/KFB-Stunt-Car-Race`).

**1 · Was Kanon ist** (Schalter `sky=r1` und `stars=1`, beide für alle an):
- `src/modules/sky-r1.js`: die Kuppel, reines three.js nach dem Modulvertrag `create(options) → { object3d, update(dt, ctx), horizonColor(), dispose() }`. Sie baut auf `src/modules/sky-drive.js` auf (generiert, nicht von Hand ändern) und nutzt dieselben Uniforms.
- `src/world/skyDirector.js`: Plan je Thema und Saat, Farbsatz, Körper und Wolken. Dazu `src/world/skySet.js` (Farbsatz aus der Bandpalette) und `src/world/skyBake.js` (Wolken- und Körper-Atlanten, ohne three).
- `src/world/skyStars.js`: echte Sterne (Yale-Katalog), nur mit `sky=r1`.
- `src/world/cloudField.js`: nur Wolkenschatten auf dem Boden. Die Wolken selbst sind in die Kuppel gemalt (Georg: Wolkenobjekte verworfen, V-1184).
- **Altstand, nicht nutzen:** `src/Planets.jsx` (begehbare Planeten-Inseln mit Physik, kein Himmel), `src/modules/sky-r13.js`, `src/modules/m1-sky.js`, `src/vendor/sky3/`. `src/stageLight.js` und `src/stagePalette.js` gehören zur Proof-Bühne, nicht zum Spielhimmel.

**2 · Abgenommene Einstellungen:**
- Kuppel, Bänder, Wolken und Einfügen der Körper: `src/data/looks/kfb-sky-r1.json`.
- Licht: `src/world/driveAtmos.js` mit `src/data/looks/kfb-drive-moods.r1.json` (Grundkurve Morgen/Mittag/Abend/Nacht je Biom, sechs benannte Stimmungen). Die Uhr steht über `hour`, die Stimmungen heißen im Rig `day`, `gold`, `night`.
- Noch nicht abgenommen: Himmelsgefährte (Inseln, Luftschiffe, Bücher, Schalter `luftschiffe=1`, Liste `src/data/looks/sky-props.r1.json`) sind in Prüfung, ihr Atlas liegt noch nicht im Repo. Lass sie vorerst weg; WS0 liefert den Atlas nach, wenn Georg sie freigibt.

**3 · Bilder:** Planeten und Monde sind gemalte Zellen, `src/assets/world/sky-planets-r1/runtime/cells/*.webp` mit `index.json` (Art, Größe, Datei). Sie werden eingefügt, nicht beleuchtet (`src/look/kfbInsert.js`). Wolken entstehen im Code (`skyBake.js`). Alles ist für die Website frei.

**4 · Ohne React:** `sky-r1.js`, `skyDirector.js`, `skySet.js`, `skyBake.js` und `skyStars.js` sind reines JS bzw. three.js, du brauchst `Planets.jsx` nicht. Sie ziehen `src/look/terrain3.js`, `src/look/kfbInsert.js`, `src/vendor/palette/kfb-cartoon-palette.js` und den Platzierungs-Löser nach und laden Bilder über Vites `import.meta.glob`; das musst du in deiner Bühne ersetzen. Wo du etwas aus einem React-Teil brauchst, darfst du den Kern herauslösen. Das Muster zum Einbinden steht in `src/world/EndlessDrive.jsx`, vier Bausteine zusammen: das Licht-Rig `src/vendor/light/kfb-stage-light.v1.1.js` (`createStageLight`, Stimmungen `night`, `gold`, `day`, unverändert importieren), `createSkyR1`, `installAir` und `createDriveAtmos` (schreibt den Stimmungs-Satz des Rigs). Das Rig selbst wird in `src/m1/M1World.jsx` mit `createStageLight` angelegt und an `EndlessDrive.jsx` als `mods.light` übergeben.

**5 · Takt:** `src/world/skyPulse.js` hört denselben Musik-Puls wie FBs Tänze (`musicPulse()` aus `src/audio/kfbAudio.js`, Format `kfb.audio-presentation-pulse/1`). Puls sowie Auf- und Untergang der großen Körper sind standardmäßig an (`skyDirector.js`, abschaltbar mit `skymove=0`), aber noch nicht von Georg abgenommen; nimm sie als Probe.

**Licht mit Lampe:** Es bleibt das eine Licht-Rig `kfb-stage-light.v1.1.js` (V-385, V-392): Sonne bzw. Mond, Himmelslicht, Figurenlicht. Die Lampe darf die Sonne dieses Rigs sein (gleiche Richtung und Farbe), aber kein zweites Licht daneben. Der Himmel liefert über dasselbe Rig das Umgebungslicht in den Stimmungen `day`, `gold`, `night`. FB bekommt das Figurenlicht des Rigs (abgenommen `figamb=2`, V-1761), kein Extralicht je Figur (V-692); keine eigenen Shader.
