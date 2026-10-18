# BRIEF WSB · B41 · Wurfwaffen + Brick-Fish-Choreografie · R1 · 2026-10-18 · WS0
**Reihenfolge:** freigegeben von Georg 19.10. (nach B40/B42/B43). Register: V-537. Auf die Platte achten, Läufe klein halten.

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

**Humbug-Detonator (V-546, Georg-Nachtrag)**
- Eine Flächen-Granate im Stil eines „Thermal-Detonators“, aber eigenes KFB-Design ohne Film-Vorbild (IP): Knet-Kugel mit Band, blinkendem Lämpchen und Schalter bzw. Kappe.
- Für Hunky & Dory und die Men in Black. **Große Variante** für den Large-Türsteher AGL, passend zu seiner Faust.
- Anker: `KFB_Grip` (V-536), `KFB_Blink` (Lämpchen für Blink-VFX), `KFB_Arm` (Schalter bzw. Kappe für die Scharf-Geste).
- **Explosions-Formen** als Knet-Meshes nach `SPEC_CARTOON_VFX_SHAPES_R1`, keine gestapelten Kugeln:
  - Cartoon-Pilzwolke bzw. Puffwolke;
  - flacher Schockwellen-Ring;
  - Stern-Blitz.
  - Je 3 Stufen (Aufblähen, Höhepunkt, Zerfasern) als Shape Keys oder Einzel-Meshes. Die Animation macht WS1b.
- **Großer Krater-Stempel** (temporär, wie oben) plus Schmauch-Stern groß.
- **Wirkung (WS1b):**
  - Flächenwirkung im Radius;
  - alle NPCs und der Spieler im Umkreis bekommen automatisch den „Humbug!“-Blitzdings-Effekt (Comic-Wort, Opfer-Kette fallen → liegen → aufrappeln → benommen, V-530);
  - dieselbe saftige Explosion nutzen Destruction-Mech-POC (V-514) und Combat Arena.

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

**Spuren nach Explosion (Georg-Nachtrag)**
- Krater bzw. Delle im Terrain: 3 Größen (Granate, Bombe, Fluff-Bombe nur flache Mulde).
  - Als Knet-Mulde mit aufgeworfenem Rand.
  - Lieferung als Höhen-Stempel (Graustufen-Heightmap 512²) + kleines Rand-Mesh, damit WS1 den Boden verformen kann.
- Schmauch- und Explosionsspur: schwarzer Stern um das Aufprall-Zentrum, klassisch Comic.
  - Als Decal-Textur (Alpha, 3 Varianten, gezackte Strahlen, Knet-Körnung, nicht digital-glatt).
  - Bei der Fluff-Bombe stattdessen ein bunter Fluff-Stern.
- Aus dem Krater ploppen Fluff-Kugeln heraus (Beute); Anker `KFB_Loot_Origin` im Kraterzentrum.
- Alles temporär: Krater und Stern bilden sich zurück (Knet glättet sich, Spur verblasst). Die Stempel bitte so liefern, dass WS1 sie über die Zeit ausblenden kann (Höhe × Faktor 1→0).

**Für WS1 / WSV (nicht WSB)**
- **WS1:** Flugbahn, Aufprall und Explosion als Zusatz zum Zerstörungs-Modus (V-514), dieselbe Partikel- und Auflösungs-Logik (V-533/V-535). Fluff-Bombe = Goo-Freiwaschen in einem Radius. Krater: Terrain-Delle per Höhen-Stempel + Stern-Decal, Fluff ploppt aus dem Krater (Ernte-Logik V-484). Temporär mit Rückbildung. Das ist eine abgeleitete Form der God-Mode-Terrainverformung: ein Terrain-Verformungs-Modul (dauerhaft für Terraforming, temporär mit Rückbildung für Einschläge und Fahrspuren; Joyride hat dafür nichts, nur haftende Knetkrümel in clay-vfx.v1.js).
- **WSV:** Das Brick-Fish-Duell ist ein Kandidat für ein Comic-Motion-Video.
- **SFX:** `40_AUDIO/elevenlabs_r1/throwables_r1` macht WS0.
