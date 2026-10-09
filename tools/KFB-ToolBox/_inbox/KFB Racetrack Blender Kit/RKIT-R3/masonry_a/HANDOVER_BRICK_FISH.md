# Übergabe-Notiz Brick-Fish · Blender-Coworker (Mac mini) · Mauerwerk-Familie A

**Was:** Der Brick-Fish wird aus der KFB-Mauerwerk-Familie A gebaut. Das sind dieselben Knetsteine wie Bordsteine, Mauern und Brücken.

**Quelle:**
- `kfb_masonry_a.blend` (Collection `KFB_MASONRY_A`) oder die einzelnen `glb/<ID>.glb`.
- Maße und Rundungen stehen in `manifest.json` bzw. `README.md`.

**Bauregeln:**
- **Körper:**
  - aus `MAUER_14` / `MAUER_18` im Verband (versetzte Lagen, Fuge ≈ 0,06–0,08);
  - Kopf aus `KOPFSTEIN` oder `ABSCHLUSS_WAND` (gerundete Kuppe).
- **Flossenspitzen:** Immer gerundet (Georg). Dafür nimmst du `KOPFSTEIN`, `ABSCHLUSS_WAND` oder `DECKSTEIN_RUND`, nie eine scharfe Ecke (§01).
- **Schwanz / Bogenform:** `BOGENSTEIN_R12` bzw. `SCHLUSSSTEIN_R12`. Mit `voussoir(R, n, t)` im Skript gehen andere Radien.
- **Rubbel:** `RUBBEL_KIESEL_*` als „abgebröckelte“ Steinchen an Fugen und Flossenansätzen, nie als Reihe.

**Maße:** Lab-Einheiten (K2). MC = 6,4; ¼ MC = 1,6; Lagenhöhe Mauer 0,72 (+ Fuge). Rundungsradien: Mauer 0,15, Kopf 0,36, Deckstein 0,26, Platte 0,07, Bordstein 0,08.

**Farbe:**
- Eigene Rolle `creature` mit eigenem Tontripel im Brick-Fish-Manifest. Optional `inheritStone: true` übernimmt `ENV_ROLES[insel].stone` (Tarnvariante).
- Die Steine sind farbneutral: Rollenattribut `_ROLE_TONE` 0/1/2.
- **Die endgültige Brick-Fish-Farbe ist offen; Georg entscheidet mit dem Design.**

**Sockets:** `<MODUL>_SOCKET_a/b` an den Stirnseiten. Dort können Steine Stoß an Stoß gesetzt werden.
