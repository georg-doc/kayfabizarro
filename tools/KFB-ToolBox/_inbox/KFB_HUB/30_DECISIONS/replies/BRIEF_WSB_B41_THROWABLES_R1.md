# BRIEF WSB · B41 · Wurfwaffen + Brick-Fish-Choreografie · R1 · 2026-10-18 · WS0
**Reihenfolge:** nach V-536 (Halterung) und B40. Register: V-537. Auf die Platte achten, Läufe klein halten.

**Tier 0**
1. Drei Wurfkörper, alle mit `KFB_Grip` in der Faustkugel (V-536):
   - Cartoon-Bombe (Clown-Set);
   - Granate;
   - Fluff-Bombe.
2. Cartoonige Wurf-Clips aus Georgs Mixamo-Downloads auf Medium und Large retargeten. Dazu die Brick-Fish-Choreografie optimieren: Wurf, Flug, Treffer, Ausweichen.
3. Abnahme über den Prüfstand mit Clay und QA V-520. Die Choreografie zeigst du als Streifen.

## Block
**Wurfkörper**
- **Cartoon-Bombe:**
  - Quelle: `clown_bomb` aus KayKit Mystery Series 6 / 11 Clown (Kauf-Asset, privat). Ablage `_privat_kauf_asset`.
  - Anker `KFB_Fuse` (Zündschnur-Spitze für den Funken-VFX).
- **Granate:**
  - Cartoon-Granate aus der 3D-Asset-Suche (CC0 bevorzugt, Lizenz im RETURN), kein Eigenbau.
  - Anker `KFB_Pin` (Splint).
- **Fluff-Bombe:**
  - Frankensteining aus Bomben-Körper + Fluff-Kugel-Look (Knet, Fluff-Akzentfarbe als Material `kfb_role_fluff_<farbe>`, umschaltbar).
  - Sie platzt in eine Fluff-Wolke und wäscht Black Goo frei (V-532).
- **Alle:** Knet-Material, `KFB_Grip` in der Faust (Achse wie V-536), Größe passend zur Faust von Medium und Large.

**Wurf-Clips** (Mixamo, privat, `~/Dropbox/Mac/Downloads/`)
- Grenade Throw, Run And Throw Grenade, Throw, Throwing, Goalie Throw, Goalkeeper Overhand Throw, Frisbee Throw.
- Dazu KayKit `Throw` (Katalog: „Augen zuerst zum Ziel“).
- Retargeten auf Rig_Medium und Rig_Large.
- Marke `release` (Bild, an dem der Körper die Hand verlässt), dazu `windup_start` und `follow_through_end`.
- Cartoon-Timing: Antizipation deutlich, Ausholen mit Stretch, Nachschwung.

**Brick-Fish-Choreografie (V-181)**
- **Ablauf:** Wurf (Throw), Flug (Fisch wackelt und flattert, Drehung), Treffer (Hit_A/Hit_B mit Squash, Kopf-Wackler), Ausweichen (Dodge_*).
- Der Root-Versatz der Dodges wird nicht still angewendet (Katalog §5).
- **Optimieren:**
  - Lesbare Bögen;
  - der Treffer sitzt im Bild des Aufpralls;
  - Kamera-Halt 2–3 Bilder beim Treffer (Hit-Stop) als Marke für WS1;
  - Ausweich-Timing passend zur Flugzeit.
- Zeitplan `B41/data/timelines/<choreo>.json` mit Marken: `windup`, `release`, `apex`, `impact`, `dodge`, `recover`.

**Abnahme**
- Prüfstand: die 3 Wurfkörper einzeln + in der Faust (Achsenlinie).
- Streifen: Wurf Medium + Large je Clip; Brick-Fish-Duell (Wurf → Treffer bzw. Ausweichen) mit 2 Figuren.

**Für WS1 / WSV (nicht WSB)**
- **WS1:** Flugbahn, Aufprall und Explosion als Zusatz zum Zerstörungs-Modus (V-514), dieselbe Partikel- und Auflösungs-Logik (V-533/V-535). Fluff-Bombe = Goo-Freiwaschen in einem Radius.
- **WSV:** Das Brick-Fish-Duell ist ein Kandidat für ein Comic-Motion-Video.
- **SFX:** `40_AUDIO/elevenlabs_r1/throwables_r1` macht WS0.
