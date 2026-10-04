<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# [https://github.com/georg-doc/kayfabizarro/tree/main/skills/chat](https://github.com/georg-doc/kayfabizarro/tree/main/skills/chat)

[https://claybound-56949.web.app/](https://claybound-56949.web.app/)

[https://www.reddit.com/r/playmygame/comments/1whbinx/claybound_cozy_platformer_where_everything_is/?tl=de](https://www.reddit.com/r/playmygame/comments/1whbinx/claybound_cozy_platformer_where_everything_is/?tl=de)

[https://www.reddit.com/r/DestroyMyGame/comments/1whblap/be_brutal_destroy_my_trailer_for_claybound_a_cozy/?tl=de](https://www.reddit.com/r/DestroyMyGame/comments/1whblap/be_brutal_destroy_my_trailer_for_claybound_a_cozy/?tl=de)

[https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/\_inbox/KFB%20Style%20References/ClayBound%20Cozy%20Platformer%20%2B%20Editor](https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB%20Style%20References/ClayBound%20Cozy%20Platformer%20%2B%20Editor)

hi ich habe jetzt endlich eine perfekte Vorlage gefunden für den clamation Style den ich die ganze Zeit schon Versuche für unsere KFB Games also sowohl den race track als auch den World Bilder und auch die Kid carac das in dieser Weise abzubilden ich habe dir mal Referenzbilder angehangen und auch die redet Posts und auch das Game selber was auch ein sehr coolen Editor enthält der Gag dabei ist es halt diese ganzen spielte Teile so knetbar sind und das auch da drüber vielen Interaktionen laufen das finde ich grundsätzlich auch ein schönes Prinzip da kann man auch mal drüber nachdenken weil dann auch haben und so weiter dann auch raus Knetgummi geformt werden könnten wenn es uns gelingt der entsprechende Texturierung und Objektgestaltung so hinzubekommen wie wir das in dem Beispiel sehen und das wäre dann aus meiner Sicht der erste Auftrag dass du ein Design Konzept entwickelst und recherchierst wie wir möglichst exakt den Look hinbekommen also können viel von dem playbound den ich jetzt eigentlich als visuelles Bett mag sehen würde für uns auch was die abgerundeten Form angeht und diese Art von Spielzeug knetgummiwelt das ist eigentlich das wo ich am Anfang an gerne hin wollte und vielleicht kannst du ja erstmal ein Konzept recherchieren und dann würden wir in der Folge von mir aus sehr gerne entsprechende Demos mal versuchen irgendwie wird man das mit unseren Modellen so abbilden kann oder ob es tatsächlich notwendig ist diese ganzen knetgummiartigen Erhöhungen und Vertiefungen die aus meiner Sicht aber durch Beleuchtung und Textur zu lösen sein müssen aber ich kenne mich da so wenig aus auch mit den Materialien die wir dann auch gerne noch recherchieren können weil diese play Texturen die ich eben habe die sind eigentlich nicht deutlich genug also und sind ja auch nicht Sachen nicht diese Haptik und diese diese Anmutung die wir in den Beispiel Screenshots finden und auf der Redezeit ist jetzt leider kein Repo oder weitere Infos zu finden aber vielleicht findest du da noch was mit deiner entsprechenden Recherche und der konzeptionellen Ausarbeitung.

Das war jetzt das Briefing zur Umsetzung für Claude Design von. Dir. Bräuchte ich bitte eine Recherche und How-Tos, und auch, ähm, die Knettexturen; da müssen wir auf jeden Fall etwas haben, was dann das prozedurale, was jetzt versucht wird, ersetzt durch entsprechende Texturen oder eine. Prozedurale Logik, die nicht so repetitiv ist und mit den, sage ich mal, üblichen— Klischees wie irgendwelche Fake-Fingerabdrücke oder so—als Standard. Claimation-Merkmal. Das missversteht. Sondern da wie "Claybound" das dann elegant löst und auch. Wie in den Screenshots in solchen Look dann halt erzeugt und wie du das technisch umsetzen würdest.

Perfekt – das ist ein sehr klares und spannendes visuelles Ziel. Ich habe mir die verfügbaren Infos zu Claybound, vergleichbaren Claymation-Shadern und technischen Umsetzungen angesehen und daraus ein erstes Designkonzept plus konkrete How‑Tos und Texturvorschläge abgeleitet.[^1_1][^1_2][^1_3][^1_4][^1_5][^1_6][^1_7][^1_8][^1_9][^1_10][^1_11][^1_12][^1_13]

## Visuelles Zielbild (Kurzbrief)

Ihr Look soll:

- **Soft, rund, „knetbar“** wirken: stark abgerundete Kanten, keine harten Silhouetten.[^1_6][^1_14]
- **Matte, leicht unebene Oberflächen** haben: keine plastisch-glänzenden PBR-Looks, sondern ein warmes, diffuses „Knetgummi“-Gefühl.[^1_4][^1_5][^1_1][^1_6]
- **Organische Mikrostrukturen** zeigen: Fingerabdrücke, leichte Falten, flache „gestrichene“ Bereiche, kleine Dellen – aber **nicht klischeehaft repetitiv**.[^1_2][^1_5][^1_7][^1_8][^1_15][^1_1][^1_4]
- **Beleuchtung weich und global** einsetzen: weiche Schatten, leichte AO in Vertiefungen, dezente Rim‑Light‑Akzente, um die Form plastisch zu machen.[^1_14][^1_1][^1_6]

Das entspricht ziemlich genau dem, was Claybound visuell ausstrahlt: eine Spielzeug‑/Knetwelt, in der alles wie geformt und leicht verformbar wirkt.[^1_6][^1_14]

______________________________________________________________________

## Technische Strategie: Wie wir den Look exakt treffen

Ich unterscheide drei Ebenen, die zusammen den Look erzeugen:

1. **Form / Modellierung** (Makro)
2. **Material / Shader** (Mikro + optisches Verhalten)
3. **Beleuchtung \& Post** (Atmosphäre)

### 1) Form: abgerundete, „geknetete“ Silhouetten

Auch mit perfekten Texturen wirkt es nicht nach Knete, wenn die Grundformen zu technisch/eckig sind.

**Prinzipien:**

- **Alle Kanten stark beveln / subdivide**: Keine harten 90°-Kanten an Gebäuden, Tracks, Props.[^1_14][^1_6]
- **Leichte „Handgeformt“-Deformationen**: Minimal unregelmäßige Rundungen, kleine Dellen/Buckel, als wäre das Teil in der Hand geformt worden.[^1_4][^1_6]
- **Proportionen „toyhaft“**: Eher chunky, nicht zu dünn oder filigran; Knete hat Masse.[^1_6][^1_14]

**Umsetzungsideen:**

- In Blender:
    - Subdivision Surface + Bevel Modifier
    - Displacement mit weichem Noise, um leichte „gewellte“ Oberflächen zu erzeugen (geringe Stärke).[^1_16][^1_17][^1_1]
- In Three.js / eurer Pipeline:
    - Modelle idealerweise bereits in DCC (Blender etc.) so vorbereiten.
    - Optional: leichte Vertex‑Displacement im Shader für zusätzliche „Unruhe“ (siehe unten).[^1_9][^1_11]

______________________________________________________________________

### 2) Material / Shader: der eigentliche „Claymation“-Look

Hier liegt der größte Hebel. Aus der Recherche gibt es zwei komplementäre Ansätze:

- **Prozedurale Clay‑Shader** (Unity ShaderGraph, Blender Nodes, Three.js ShaderMaterial)[^1_7][^1_11][^1_2][^1_9][^1_4]
- **PBR‑basierte Clay‑Texturen** mit Normal/Displacement/Bump + angepasstem Roughness/Metalness[^1_10][^1_12][^1_13][^1_17][^1_1][^1_16]

Für KFB schlage ich eine **Hybridlösung** vor:

- **Basis**: PBR‑ähnliches Material (Standard/Physical) mit:
    - `roughness ≈ 0.8–1.0`
    - `metalness = 0`
    - diffuser, matter Farbwert (keine hohen Sättigungen).[^1_11][^1_6]
- **Overlay**: Spezielle **Clay‑Normal‑ + Height/Displacement‑Maps**, die:
    - Fingerabdrücke
    - flache „gestrichene“ Zonen
    - Falten / Knitter
    - subtile Bumps\
abbilden – aber **variiert und nicht zu repetitiv**.[^1_5][^1_15][^1_1][^1_2][^1_7][^1_4]


#### a) Was macht gute Clay‑Texturen aus? (ohne Klischee‑Fingerabdruck‑Raster)

Aus Papers und Shader‑Beispielen:

- **Fingerprints** als feine Normal‑Details, kombiniert mit leichten Farbvariationen (dunklere Rillen, etwas hellere „geölte“ Stellen).[^1_15][^1_1][^1_2][^1_5][^1_7]
- **Flattenings**: großflächige, leicht abgeflachte Bereiche, die entstehen, wenn man mit der Hand drückt – oft via **Voronoi‑Noise** im Shader simuliert, der die Normalen lokal „platt macht“.[^1_2][^1_7]
- **Folds / Falten**: längliche Mulden, z.B. via modifiziertes Perlin‑Noise, das AO abdunkelt und Normalen in eine Richtung zieht.[^1_1][^1_7][^1_2]
- **Bumps**: kleine, unregelmäßige Erhebungen, oft via **tilebarem Perlin‑Noise** oder Displacement‑Map.[^1_9][^1_1][^1_2]
- **Impurities**: winzige Farb‑/Struktur‑Fleckchen, die wie kleine Verunreinigungen im Knetmaterial wirken.[^1_2]

Wichtig: **Skalen mischen** – grobe Form (Falten), mittlere Struktur (Flächen, Bumps), feine Details (Fingerprints). So entsteht Tiefe ohne offensichtliches Tiling.[^1_7][^1_1][^1_4]

#### b) Konkreter Material‑Stack (konzeptionell)

Für ein Mesh im Renderer (Three.js / Unity / Blender Eevee o.ä.):

- **Base Color**:
    - Einheitliche, leicht variierende Farbe pro Objekt/Typ (z.B. Track, Kid‑Car, Welt‑Elemente).
    - Leichte Farbvariation über eine sehr grobe Noise‑Map, um „Charge‑Farbmischung“ wie bei Knete zu simulieren.[^1_8][^1_5]
- **Roughness**: hoch (0.8–1.0), keine Glanzlichter wie bei Plastik.[^1_11][^1_6]
- **Metalness**: 0.
- **Normal Map**:
    - Haupt‑Clay‑Normal‑Map mit Fingerprints + Folds + Flattenings.
    - Optional zweite, kleinere Normal‑Map für feinere Bumps, additiv gemischt.[^1_17][^1_16][^1_1][^1_7][^1_2]
- **Displacement / Height**:
    - Entweder echte Vertex‑Displacement (wenn Mesh‑Dichte passt) oder Parallax/Relief‑Trick im Shader.
    - Stärke gering halten, aber sichtbar genug für echte 3D‑Wirkung an Silhouetten.[^1_16][^1_17][^1_1][^1_9][^1_11]
- **AO / Cavity**:
    - Entweder gebaked oder im Shader via Curvature‑/Thickness‑Trick, um Vertiefungen (Falten, Rillen) etwas abzudunkeln.[^1_5][^1_8]

In Three.js könnt ihr das z.B. mit `MeshStandardMaterial` + `normalMap` + `displacementMap` umsetzen und bei Bedarf in einen `ShaderMaterial` übergehen, um prozedurale Noise‑Layer direkt im GLSL zu mischen.[^1_18][^1_19][^1_20][^1_11]

______________________________________________________________________

### 3) Beleuchtung \& Post: den „Cozy Clay“-Look vollenden

Claybound und andere Claymation‑Looks leben stark von der Lichtsetzung:

- **Weiche, große Lichtquellen**: HDRI oder große Area‑Lights, keine harten Punktlicht‑Schatten.[^1_14][^1_6]
- **Warmes Licht**: leicht gelblich/orange Key‑Light, kühleres Fill‑Light für Kontrast, aber insgesamt freundlich.[^1_6][^1_14]
- **Rim‑Light**: dezente Kantenbeleuchtung, um die runden Formen zu betonen, ohne sie hart zu machen.[^1_1][^1_14]
- **AO / globale Abdunklung in Ecken**: entweder gebaked oder über Screen‑Space‑AO, damit Vertiefungen und Falten plastisch wirken.[^1_5][^1_1]
- **Framerate‑Styling (optional)**:
    - Für echten Stop‑Motion‑Vibe kann man Animationen mit niedrigerer Pose‑Rate fahren (z.B. 12–15 fps bei 60 fps Render), oder im Shader die Noise‑Offsets nur alle N Frames updaten.[^1_8][^1_9][^1_1]

______________________________________________________________________

## Konkrete How‑Tos (Engine‑übergreifend)

Ich skizziere hier konkrete Wege für Blender, Unity und Three.js – je nachdem, wo ihr die Assets vorbereitet und wo sie laufen.

### A) Blender: Clay‑Material erstellen \& Texturen backen

**Ziel:** Ein prozedurales Clay‑Material bauen, das ihr dann als Textur‑Set (Base/Normal/Height) exportieren könnt, um es in Three.js / Unity zu nutzen.

**Schritte (Eevee / Cycles):**

1. **Neues Material → Shader Editor.**
2. **Basis‑Setup:**
    - Principled BSDF:
        - `Base Color`: gewünschte Knetfarbe.
        - `Roughness`: ~0.9
        - `Metallic`: 0
3. **Normal‑Details aufbauen:**
    - **Fingerprints**:
        - Noise/Texture + Mapping → ColorRamp (feine Struktur) → Normal Map Node.
        - Oder eine fertige Fingerprint‑Alpha/Normal‑Map einlesen und mit Normal‑Node kombinieren.[^1_15][^1_17][^1_16][^1_5]
    - **Flattenings (Voronoi):**
        - Voronoi Texture (Distance) → ColorRamp (große Zellen) → Mix mit Normal, um flache Bereiche zu erzeugen.[^1_7][^1_2]
    - **Folds (Perlin/Noise):**
        - Musgrave/Noise Texture (große Skala, anisotrop gestreckt) → ColorRamp → Normal.[^1_1][^1_2][^1_7]
    - Alle Normal‑Inputs über **Normal‑Mix** (Add/Overlay) kombinieren.[^1_17][^1_16]
4. **Displacement / Bumps:**
    - Separate Noise‑Layer → Height‑Output → Displacement‑Node (oder direkt in Principled, wenn Subdivision aktiv).
    - Stärke gering halten, damit es wie leichte Knet‑Unregelmäßigkeiten wirkt.[^1_9][^1_16][^1_17][^1_1]
5. **Farbvariation:**
    - Sehr grobes Noise → ColorRamp → leicht in Base Color mischen, um „durchgeknetete“ Farbverläufe zu erzeugen.[^1_8][^1_5]
6. **Testen \& Anpassen:**
    - Verschiedene Objekte mit gleichem Material, aber unterschiedlichen Mapping‑Scales, um Tiling zu brechen.[^1_4][^1_11]
7. **Texturen backen (optional, für Three.js / Unity):**
    - Hi‑Poly (mit Subdivision + Displacement) → Low‑Poly.
    - Bake:
        - Normal Map
        - Height/Displacement
        - AO (optional)
        - Base Color (mit leichter Noise‑Variation)
    - Export als PNG‑Set (sRGB für Color, Non‑Color für Normal/Height/AO).[^1_12][^1_13][^1_10][^1_16][^1_17]

Damit habt ihr ein **wiederverwendbares Clay‑Textur‑Set**, das ihr auf viele Objekte anwenden könnt, ohne jedes Mal prozedural rechnen zu müssen.

______________________________________________________________________

### B) Unity: Clay‑ShaderGraph (prozedural)

Falls ihr Unity für Prototypen nutzt (oder als Referenz für euren eigenen Shader):

- Es gibt fertige **Clay‑ShaderGraph‑Projekte**, die genau die beschriebenen Effekte umsetzen:
    - Fingerprints als Normal‑Detail
    - Voronoi‑Flattenings
    - Perlin‑Folds
    - tilebare Bumps via Displacement.[^1_3][^1_2][^1_7]

**Typischer Graph‑Aufbau:**

- **Base Color**: Color‑Property + optional Noise‑Variation.
- **Normal**:
    - Fingerprint‑Texture → Normal From Height.
    - Voronoi → Normal (Flattenings).
    - Perlin/Musgrave → Normal (Folds).
    - Alles über **Normal Blend** zusammenführen.[^1_2][^1_7]
- **Displacement**:
    - Tileable Perlin → Vertex Displacement (geringe Amplitude).[^1_9][^1_2]
- **Roughness/Metallic**:
    - Roughness hoch, Metallic 0.[^1_11][^1_6]

Ihr könnt solche Graphen als Referenz nehmen und die Logik dann in euren Three.js‑Shader portieren.[^1_3][^1_7][^1_2]

______________________________________________________________________

### C) Three.js: Clay‑Material / ShaderMaterial

Für eure KFB‑Games in Three.js sehe ich zwei Stufen:

#### Stufe 1: Schnell mit Standard‑Material + Texturen

```js
const clayMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4a574,           // Beispiel: warme Knetfarbe
  roughness: 0.95,
  metalness: 0.0,

  map: colorTexture,         // Base Color (ggf. mit leichter Noise‑Variation)
  normalMap: clayNormalMap,  // Fingerprints + Folds + Flattenings
  displacementMap: clayHeightMap,
  displacementScale: 0.02,   // fein justieren

  // optional:
  // aoMap: clayAoMap,
});
```

- `colorTexture`, `clayNormalMap`, `clayHeightMap` können aus dem **Blender‑Bake** kommen.[^1_13][^1_10][^1_12][^1_11]
- Durch unterschiedliche `texture.repeat` und `offset` pro Objekt lasst ihr das Muster weniger repetitiv wirken.[^1_11]


#### Stufe 2: Eigener ShaderMaterial für prozedurale Clay‑Effekte

Wenn ihr mehr Kontrolle wollt (z.B. animierte Fingerabdrücke, variierende Noise‑Skalen pro Objekt), baut ihr einen **ShaderMaterial** mit GLSL, der:

- Mehrere Noise‑Funktionen (Perlin/Voronoi‑ähnlich) kombiniert.
- Daraus Normal‑ und Displacement‑Offsets berechnet.
- Optional die Noise‑Offsets über die Zeit leicht animiert, um ein „nachgeformt“-Gefühl zu geben.[^1_21][^1_18][^1_1][^1_9]

Grundgerüst (konzeptionell):

```glsl
// Vertex Shader
uniform float uTime;
uniform float uDisplacementScale;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normal;
  vec3 pos = position;

  // Beispiel: sanftes Noise-basiertes Displacement
  float noise = snoise(vec3(pos * 3.0 + uTime * 0.1));
  pos += normal * noise * uDisplacementScale;

  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

// Fragment Shader
uniform vec3 uColor;
uniform float uRoughness;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Hier könntet ihr prozedurale Normal-Details aus Noise berechnen
  // und mit vNormal mischen, dann Standard-PBR-Beleuchtung nachbauen
  // oder vereinfachte diffuse + AO + Rim-Light Logik implementieren.
}
```

Detaillierte GLSL‑Umsetzung (mit konkreten Noise‑Funktionen, Normal‑Mixing, AO, Rim‑Light) kann ich euch im nächsten Schritt als vollständiges File schreiben, sobald wir uns für eine Engine‑Variante entschieden haben.[^1_19][^1_20][^1_18][^1_11]

______________________________________________________________________

## Textur‑Ressourcen \& Vorlagen (konkret nutzbar)

Hier ein paar konkrete Quellen, die ihr direkt als Basis nehmen und dann anpassen könnt:

- **3DTextures.me – Clay 001**
    - Seamless PBR‑Set: Diffuse, Normal, Displacement, Roughness, AO.
    - Gut als Basis‑Clay‑Look, den ihr dann mit eigenen Fingerprint/Fold‑Layer überlagert.[^1_13]
- **proctexture.com – Cracked Clay**
    - Prozedurale, tilebare Clay‑Textur mit allen PBR‑Maps.
    - Könnt ihr im Studio anpassen (Scale, Colors, Seed) und als PNG‑Set exportieren.[^1_10]
- **aitextured.com – Natural Clay / Ambient Clay**
    - Mehrere matte, natürliche Clay‑Varianten, teilweise mit Normal/Height.[^1_22][^1_23][^1_12]
- **Texturize – Adobe Clay Plaster**
    - Warme, erdige Clay‑Oberfläche, tilebar, mit Normal‑Map‑Generator.[^1_24]

**Empfohlener Workflow:**

1. Eine dieser **Basis‑Clay‑Texturen** als Base Color + Roughness + grobe Height nehmen.[^1_12][^1_24][^1_10][^1_13]
2. In Blender oder Substance/Filter Forge **zusätzliche Normal‑Layer** (Fingerprints, Folds, Flattenings) draufmischen.[^1_25][^1_26][^1_16][^1_17]
3. Das kombinierte Set als **KFB‑Master‑Clay‑Material** speichern und für verschiedene Farbtöne per Color‑Tint variieren.

______________________________________________________________________

## Vermeidung von Klischees (Fake‑Fingerabdrücke etc.)

Aus den Quellen und dem, was bei Claybound gut aussieht, lassen sich ein paar Regeln ableiten:

- **Nicht nur ein Fingerprint‑Pattern**:
    - Mischt mehrere Skalen und Typen (Finger, Handflächen, Werkzeugspuren, Falten).[^1_4][^1_7][^1_1][^1_2]
- **Nicht zu scharf / kontrastreich**:
    - Fingerabdrücke sollten subtil sein, eher als Normal‑Detail denn als krasser Farbunterschied.[^1_15][^1_5][^1_1]
- **Varianz über Objekte**:
    - Gleiche Grundtextur, aber unterschiedliche Rotation/Scale/Offset pro Objekt, um Tiling zu brechen.[^1_4][^1_11]
- **Kombination mit Form**:
    - Echte „Knet‑Optik“ entsteht erst, wenn die Form selbst leicht unregelmäßig ist; dann dürfen die Texturen sogar zurückhaltender sein.[^1_8][^1_14][^1_6]

______________________________________________________________________

## Nächste konkrete Schritte (Vorschlag)

1. **Look‑Dev in Blender:**
    - Ein einfaches Test‑Objekt (z.B. ein abgerundeter Block + ein „Track‑Segment“ + ein simples Kid‑Car‑Mockup).
    - Darauf das prozedurale Clay‑Material nach obigem Rezept bauen.
    - Verschiedene Beleuchtungs‑Setups testen (weiche Area‑Lights, HDRI, Rim‑Light).[^1_14][^1_1][^1_6][^1_4]
2. **Textur‑Set exportieren:**
    - Ein Master‑Clay‑Set (Color, Normal, Height, AO) backen.
    - In Three.js als `MeshStandardMaterial` testen, mit verschiedenen Farben für Track, Welt, Cars.[^1_10][^1_12][^1_13][^1_11]
3. **Shader‑Verfeinerung:**
    - Wenn das Basis‑Look sitzt, einen **drei‑Layer‑Clay‑Shader** (Fingerprints + Folds + Bumps) in GLSL für Three.js schreiben, damit ihr prozedural variieren und ggf. animieren könnt.[^1_18][^1_21][^1_9]
4. **Stil‑Guide dokumentieren:**
    - Ein kleines internes Doc mit:
        - Farbpaletten (4–6 gedämpfte Töne).[^1_6]
        - Beleuchtungs‑Presets.
        - Do’s/Don’ts für Modellierung (Bevel‑Stärke, Max‑Kantenschärfe etc.).

______________________________________________________________________

Wenn du magst, kann ich im nächsten Schritt:

- Ein **konkretes Blender‑Node‑Setup** (als Schritt‑für‑Schritt‑Liste mit Node‑Namen) ausformulieren.
- Oder direkt ein **vollständiges Three.js‑ShaderMaterial‑Beispiel** (Vertex + Fragment GLSL + JS‑Bootstrap) schreiben, das Fingerprints, Folds und Bumps prozedural mischt und sich an den Claybound‑Look anlehnt.[^1_18][^1_7][^1_2][^1_11]

Sag mir kurz, ob ihr primär in **Blender + Three.js** arbeitet oder auch Unity im Spiel habt – dann passe ich das nächste How‑To exakt auf eure Pipeline an.

<span style="display:none">[^1_27][^1_28][^1_29][^1_30]</span>

<div align="center">⁂</div>

[^1_1]: https://www.diva-portal.org/smash/get/diva2:1878365/FULLTEXT01.pdf

[^1_2]: https://github.com/joebinns/clay

[^1_3]: http://slamatron.com/blog/2020/04/16/Claymation-Style-in-3D/

[^1_4]: https://www.reddit.com/r/blender/comments/drys0b/mycellion_a_selfmade_procedural_clay_shader_test/

[^1_5]: https://zar67.github.io/Portfolio/assets/ClayRendering/ClayRendering-Report.pdf

[^1_6]: https://designmd.app/library/claymation-3d

[^1_7]: https://www.reddit.com/r/Unity3D/comments/fegjro/ive_finished_a_procedural_clay_shader_using/

[^1_8]: https://www.reddit.com/r/blender/comments/15e4684/how_can_i_achieve_a_character_stylized_like_its/

[^1_9]: https://www.reddit.com/r/Unity3D/comments/p3v7wt/clay_material_low_update_rate_claymation_vfx/

[^1_10]: https://proctexture.com/textures/ground/soil/cracked-clay

[^1_11]: https://learnwithhasan.com/threejs-guide/

[^1_12]: https://aitextured.com/textures/ambient/clay/clay_seamless_pbr_texture_earthy_matte_natural_tileable_brown_smooth.html

[^1_13]: https://3dtextures.me/2021/09/01/clay-001/

[^1_14]: https://designmd.app/library/claymation-3d-illustration/

[^1_15]: https://www.blenderkit.com/asset-gallery-detail/8f2aaab5-279f-4ccc-b06b-a33a3d103c37/

[^1_16]: https://www.webgl.brown37.net/11_surface_properties/10_bump_maps.html

[^1_17]: https://docs.otoy.com/standaloneSE/DiffuseLayer.html

[^1_18]: https://threejs.org/docs/pages/ShaderMaterial.html

[^1_19]: https://threejs.org/docs/

[^1_20]: https://threejs.org/manual/en/materials.html

[^1_21]: https://stemkoski.github.io/Three.js/

[^1_22]: https://aitextured.com/textures/ambient/clay/clay_seamless_pbr_texture_earth_natural_matte_fine_smooth_tileable.html

[^1_23]: https://aitextured.com/textures/basic-materials/natural-clay-seamless-texture.html

[^1_24]: https://texturize.app/texture/plaster-adobe-clay

[^1_25]: https://www.filterforge.com/filters/10069-normal.html

[^1_26]: https://filterforge.com/filters/839-normal.html

[^1_27]: https://www.cgchannel.com/tag/claymation/

[^1_28]: https://docs.otoy.com/houdini/DiffuseLayer.html

[^1_29]: https://3dtextures.me/tag/clay/

[^1_30]: https://cgaxis.com/product/red-clay-tiles-pbr-texture/


---

# Wir arbeiten primär mit Blender und Three.js für das Projekt

Perfekt – dann konzentrieren wir uns auf eine **Blender + Three.js‑Pipeline**, die exakt auf den Claybound‑Look abzielt. Ich skizziere dir jetzt:

1. Ein **konkretes Blender‑Node‑Setup** für ein prozedurales Clay‑Material (mit Fingerprints, Folds, Flattenings, Bumps).
2. Wie du daraus ein **wiederverwendbares Textur‑Set** backst.
3. Wie du das in **Three.js** mit `MeshStandardMaterial` und optional einem eigenen `ShaderMaterial` nutzt.

______________________________________________________________________

## 1) Blender: Prozedurales Clay‑Material (Eevee / Cycles)

Ziel: Ein Material, das ihr auf Test‑Objekten (Track‑Segment, Kid‑Car, Welt‑Props) ausprobiert und später als Textur‑Set backt.

### Grundsetup im Shader Editor

**Neues Material → Shader Editor.** Wir bauen schrittweise auf.

### A) Basis‑PBR‑Einstellungen

- **Principled BSDF**:
    - `Base Color`: z.B. `#d4a574` (warmer Knetton) – später per Color‑Ramp variieren.
    - `Roughness`: `0.9–1.0`
    - `Metallic`: `0.0`
    - `Subsurface`: optional `0.1–0.2` für leichtes „durchscheinendes Knete“-Gefühl (vorsichtig dosieren).[^2_1][^2_2]


### B) Fingerprints (feine Normal‑Details)

**Idee:** Feine, unregelmäßige Linien/Wirbel, die wie Fingerabdrücke wirken, aber nicht zu offensichtlich repetitiv.

**Node‑Kette:**

1. **Noise Texture**
    - `Scale`: hoch (z.B. 200–400)
    - `Detail`: 4–6
    - `Distortion`: leicht (>0), um wellige Linien zu erzeugen
2. **ColorRamp** (Fingerprints schärfen)
    - Modus: `Constant` oder `Linear`
    - Schwarze/weiße Stops eng zusammenziehen, um feine Linien zu erzeugen.
3. **Bump Node** oder **Normal Map Node**
    - Eingang `Height` ← ColorRamp
    - `Strength`: sehr niedrig (z.B. 0.05–0.15), damit es nur als feines Relief wirkt.[^2_3][^2_4][^2_5][^2_6][^2_7][^2_1]

Diesen Ausgang nennen wir intern **N_fingerprint**.

### C) Flattenings (Voronoi: „flach gedrückte“ Zellen)

**Idee:** Große, leicht abgeflachte Bereiche, als wäre die Knete mit der Handfläche angedrückt worden.[^2_8][^2_3]

**Node‑Kette:**

1. **Voronoi Texture**
    - Modus: `Distance`
    - `Scale`: niedrig (z.B. 3–8)
    - `Randomness`: ~1.0
2. **ColorRamp**
    - Schwarz → Weiß so einstellen, dass ihr große, weiche Zellen bekommt.
3. **Bump Node**
    - `Height` ← ColorRamp
    - `Strength`: sehr niedrig (z.B. 0.02–0.08), eher als subtile Abflachung denn als tiefe Rille.

Das nennen wir **N_flatten**.

### D) Folds / Falten (anisotropes Noise)

**Idee:** Längliche Mulden/Falten, wie wenn man Knete zusammendrückt und sie sich wellt.[^2_1][^2_3][^2_8]

**Node‑Kette:**

1. **Musgrave Texture** oder **Noise Texture**
    - `Scale`: mittel (z.B. 8–20)
    - Bei Musgrave: `Dimension` und `Lacunarity` spielen, bis ihr längliche Strukturen bekommt.
2. **Mapping Node** davor:
    - `Scale` in einer Achse (z.B. X) stark erhöhen (z.B. 3–5), um das Noise in eine Richtung zu strecken → Faltenrichtung.
3. **ColorRamp**
    - Kontrast erhöhen, aber weich lassen.
4. **Bump Node**
    - `Strength`: moderat (z.B. 0.1–0.25), je nach gewünschtem Falten‑Relief.

Das nennen wir **N_folds**.

### E) Bumps (kleine, unregelmäßige Erhebungen)

**Idee:** Kleine, zufällige Bumps, die die Oberfläche lebendig machen.[^2_9][^2_3][^2_1]

**Node‑Kette:**

1. **Noise Texture**
    - `Scale`: mittel bis hoch (z.B. 40–100)
    - `Detail`: 4–6
2. **ColorRamp**
    - Leicht kontrastieren.
3. **Bump Node**
    - `Strength`: niedrig bis moderat (z.B. 0.05–0.15).

Das nennen wir **N_bumps**.

### F) Alle Normal‑Layer mischen

Jetzt kombinieren wir die vier Normal‑Outputs:

- Verwende **Normal Map Nodes** mit `Space: Tangent` und mische sie über **Normal Mix** (Add/Overlay) oder mehrere **Mix Shader**‑ähnliche Setups für Normalen.

Grob:

```text
N_total = normalize(
  mix(N_fingerprint, N_flatten, 0.5) +
  N_folds * 0.7 +
  N_bumps * 0.5
)
```

In Blender:

- **Normal Mix Node** (oder mehrere hintereinander):
    - Erst N_fingerprint + N_flatten mischen (Blend-Type: Add oder Overlay).
    - Ergebnis mit N_folds mischen (Strength ~0.7).
    - Ergebnis mit N_bumps mischen (Strength ~0.5).
- Ausgang von N_total → Eingang `Normal` des Principled BSDF.[^2_4][^2_5][^2_8]

Wichtig: Alle `Strength`‑Werte im Auge behalten; ihr wollt subtile Details, keine übertriebene Relief‑Orgie.

### G) Displacement / Height (echte Geometrie‑Unruhe)

Wenn ihr mit **Subdivision Surface** arbeitet:

1. Objekt: **Subdivision Surface Modifier** (Viewport 2–3, Render 3–4).
2. Material → Settings:
    - `Displacement`: `Displacement and Bump` (Cycles) bzw. in Eevee mit experimentellen Features / oder später gebaked.
3. **Displacement Node**:
    - Eingang `Height`: eine Kombination aus:
        - Musgrave/Noise (große Skala, für sanfte Wellen)
        - ggf. leichtem Fingerprint‑Signal (sehr schwach).
    - `Scale`: sehr niedrig (z.B. 0.005–0.02), je nach Objektgröße.
    - → Eingang `Displacement` des Material Output.[^2_5][^2_4][^2_9][^2_1]

Das erzeugt echte, leichte Verformungen der Oberfläche, die besonders an Silhouetten gut wirken.

### H) Farbvariation (durchgeknetete Farben)

Für den „Knete wurde mit verschiedenen Chargen gemischt“-Look:[^2_6][^2_10]

1. **Noise Texture** (große Skala, z.B. 2–6).
2. **ColorRamp**:
    - Zwei nahe Farbtöne eures Basis‑Knettons (z.B. leicht heller/dunkler).
3. **MixRGB** mit dem Base Color des Principled BSDF:
    - Fac: ~0.1–0.3, damit die Variation subtil bleibt.

______________________________________________________________________

## 2) Textur‑Set backen (für Three.js)

Sobald das Material auf einem hoch aufgelösten Test‑Objekt gut aussieht:

### Vorbereitung

- **High‑Poly**: Objekt mit Subdivision + Displacement aktiv.
- **Low‑Poly**: Duplikat mit weniger Subdivision (oder Original ohne Subdivision).
- Beide Objekte übereinanderlegen (exakt gleiche UVs).


### Bake‑Setup (Cycles)

Im **Render Properties**:

- Render Engine: **Cycles**
- Unter **Bake**:
    - `Bake Type`:
        - Erst **Normal**
        - Dann **Displacement/Height** (über einen eigenen Bake‑Pass oder via Plugin)
        - Optional **AO**
        - Optional **Base Color** (wenn ihr die prozedurale Farbvariation festbacken wollt).

**Schritte:**

1. Low‑Poly auswählen → im Shader Editor ein **neues Material** mit leeren Image‑Textures anlegen:
    - `Image Texture`‑Nodes für:
        - `clay_baseColor.png`
        - `clay_normal.png`
        - `clay_height.png`
        - `clay_ao.png` (optional)
    - Diese Nodes **nicht** mit dem Principled verbinden, nur offen im Graph lassen.
2. Jeweils ein Bild anlegen (z.B. 2k oder 4k, je nach Bedarf).
3. Im Bake‑Panel:
    - `Selected to Active` aktivieren.
    - High‑Poly als Selected, Low‑Poly als Active.
    - `Margin`: 8–16 px.
4. Bake‑Typen nacheinander backen:
    - **Normal** → speichert in `clay_normal.png`
    - **AO** → `clay_ao.png`
    - Für **Height**:
        - Entweder über ein Custom‑Bake‑Setup (Z‑Depth / Position‑Differenz) oder ihr nutzt die gleiche Noise‑Kombination wie im Displacement‑Node und backt sie direkt als Graustufen‑Bild in eine Image Texture.[^2_11][^2_12][^2_13][^2_4][^2_5]

Exportiert diese Bilder als PNG (sRGB für Base Color, Non‑Color für Normal/Height/AO).

______________________________________________________________________

## 3) Three.js: Clay‑Material nutzen

Jetzt habt ihr ein **KFB‑Master‑Clay‑Textur‑Set**, das ihr auf allen Objekten verwenden könnt.

### A) Schnellvariante: MeshStandardMaterial

```js
import * as THREE from 'three';

const loader = new THREE.TextureLoader();

const clayBaseColor = loader.load('textures/clay_baseColor.png');
const clayNormal    = loader.load('textures/clay_normal.png');
const clayHeight    = loader.load('textures/clay_height.png');
const clayAo        = loader.load('textures/clay_ao.png'); // optional

clayNormal.colorSpace = THREE.NoColorSpace;
clayHeight.colorSpace = THREE.NoColorSpace;
if (clayAo) clayAo.colorSpace = THREE.NoColorSpace;

const clayMaterial = new THREE.MeshStandardMaterial({
  map: clayBaseColor,
  normalMap: clayNormal,
  displacementMap: clayHeight,
  displacementScale: 0.02, // fein justieren

  aoMap: clayAo,           // optional
  aoMapIntensity: 0.6,

  roughness: 0.95,
  metalness: 0.0,

  color: 0xffffff,         // Multiplikator auf Base Color
});
```

- Für verschiedene Objekttypen (Track, Welt, Cars) könnt ihr:
    - `color` unterschiedlich setzen (z.B. 0xd4a574, 0x9b7b5a, 0xc28f7a …).
    - `displacementScale` leicht variieren.
    - `normalMap.repeat` und `offset` pro Objekt anders einstellen, um Tiling zu brechen.[^2_14]

Beispiel:

```js
const trackMat = clayMaterial.clone();
trackMat.color.set(0xd4a574);
trackMat.normalMap.repeat.set(2, 2);
trackMat.normalMap.offset.set(0.13, 0.37);

const worldMat = clayMaterial.clone();
worldMat.color.set(0x9b7b5a);
worldMat.normalMap.repeat.set(1.5, 1.5);
worldMat.normalMap.offset.set(0.71, 0.22);
```


### B) Erweiterte Variante: Eigener ShaderMaterial (prozedurale Clay‑Details)

Wenn ihr später mehr Kontrolle wollt (z.B. animierte Fingerabdrücke, objektspezifische Noise‑Seeds), könnt ihr einen **ShaderMaterial** bauen, der:

- Die gebackene Base‑Color nutzt.
- Prozedurale Noise‑Layers im GLSL für zusätzliche Normal‑ und Displacement‑Details berechnet.
- Einfache PBR‑ähnliche Beleuchtung (diffuse + AO + Rim‑Light) implementiert.[^2_15][^2_16][^2_9][^2_14]

Grundgerüst (vereinfacht):

```js
const clayShaderMat = new THREE.ShaderMaterial({
  uniforms: {
    uBaseMap: { value: clayBaseColor },
    uNormalMap: { value: clayNormal },
    uHeightMap: { value: clayHeight },

    uColor: { value: new THREE.Color(0xd4a574) },
    uTime: { value: 0 },

    uDisplacementScale: { value: 0.02 },
    uNormalStrength: { value: 1.0 },
  },

  vertexShader: `
    uniform float uTime;
    uniform float uDisplacementScale;
    uniform sampler2D uHeightMap;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // Einfaches Noise (z.B. aus einer Bibliothek) hier einfügen
    float snoise(vec3 v);

    void main() {
      vUv = uv;
      vNormal = normal;

      // Texture-basiertes Displacement
      float h = texture2D(uHeightMap, uv).r;
      vec3 newPos = position + normal * h * uDisplacementScale;

      // Optional: leichtes prozedurales Wobbeln über die Zeit
      float wob = snoise(vec3(position * 3.0 + uTime * 0.2));
      newPos += normal * wob * (uDisplacementScale * 0.3);

      vPosition = newPos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,

  fragmentShader: `
    uniform vec3 uColor;
    uniform sampler2D uBaseMap;
    uniform sampler2D uNormalMap;
    uniform float uNormalStrength;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vec4 base = texture2D(uBaseMap, vUv);
      vec3 col = base.rgb * uColor;

      // Normal Mapping (vereinfacht)
      vec3 n = normalize(vNormal); // hier könnt ihr noch Normal-Map-Decoding einbauen

      // Einfache diffuse Beleuchtung
      vec3 lightDir = normalize(vec3(0.5, 0.8, 0.3));
      float diff = max(dot(n, lightDir), 0.0);
      vec3 ambient = vec3(0.4);
      vec3 finalCol = col * (ambient + diff * 0.7);

      gl_FragColor = vec4(finalCol, 1.0);
    }
  `,

  side: THREE.FrontSide,
});
```

Das ist nur ein Skelett; ich kann euch beim nächsten Mal eine vollständige Version mit:

- korrektem Normal‑Map‑Decoding,
- AO aus einer Map,
- Rim‑Light,
- und optional animierten prozeduralen Details

schreiben, sobald ihr mit dem Basis‑Look zufrieden seid.[^2_17][^2_18][^2_14][^2_15]

______________________________________________________________________

## 4) Beleuchtung in Three.js (Cozy Clay‑Look)

Um den Claybound‑Vibe zu treffen:

- **HDRI** als Umgebungslicht (weiche, globale Ausleuchtung).
- Zusätzlich:
    - 1–2 **AreaLights** oder große **PointLights** mit weichen Schatten.
    - Eine dezente **Rim‑Light** (seitlich/hinten), um die runden Formen zu betonen.[^2_2][^2_19][^2_1]

Beispiel (sehr grob):

```js
const hemiLight = new THREE.HemisphereLight(0xfff5e1, 0x2b2b2b, 0.6);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xffeedd, 0.8);
keyLight.position.set(5, 8, 4);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xcce0ff, 0.4);
rimLight.position.set(-6, 4, -5);
scene.add(rimLight);
```


______________________________________________________________________

## Konkreter nächster Schritt (empfohlen)

1. **Blender‑Look‑Dev‑Session:**
    - Ein einfaches Objekt (z.B. abgerundeter Block) mit dem oben beschriebenen Node‑Setup versehen.
    - Parameter für N_fingerprint, N_flatten, N_folds, N_bumps spielen, bis es sich nach „Knete“ anfühlt.
    - Beleuchtung mit weichen Lights + HDRI testen.
2. **Ein erstes Textur‑Set backen** (2k reicht für den Anfang).
3. **In Three.js importieren** und auf euren bestehenden Modellen (Race‑Track‑Segment, Kid‑Car‑Mockup, ein paar Welt‑Props) testen.

Wenn du möchtest, kann ich dir im nächsten Schritt:

- Das **Blender‑Node‑Setup als detaillierte Schritt‑für‑Schritt‑Liste** mit konkreten Node‑Namen und Standardwerten schreiben.
- Oder direkt ein **komplettes Three.js‑Beispielprojekt** (HTML + JS) mit dem Clay‑Material und einer kleinen Testszene (Boden + ein paar Objekte) erstellen, das du lokal laufen lassen kannst.

Sag mir, womit du lieber starten willst: **Blender‑Nodes im Detail** oder **Three.js‑Demo‑Code**.[^2_12][^2_13][^2_3][^2_4][^2_5][^2_8][^2_11][^2_14][^2_15][^2_1]

<div align="center">⁂</div>

[^2_1]: https://www.diva-portal.org/smash/get/diva2:1878365/FULLTEXT01.pdf

[^2_2]: https://designmd.app/library/claymation-3d

[^2_3]: https://github.com/joebinns/clay

[^2_4]: https://www.webgl.brown37.net/11_surface_properties/10_bump_maps.html

[^2_5]: https://docs.otoy.com/standaloneSE/DiffuseLayer.html

[^2_6]: https://zar67.github.io/Portfolio/assets/ClayRendering/ClayRendering-Report.pdf

[^2_7]: https://www.blenderkit.com/asset-gallery-detail/8f2aaab5-279f-4ccc-b06b-a33a3d103c37/

[^2_8]: https://www.reddit.com/r/Unity3D/comments/fegjro/ive_finished_a_procedural_clay_shader_using/

[^2_9]: https://www.reddit.com/r/Unity3D/comments/p3v7wt/clay_material_low_update_rate_claymation_vfx/

[^2_10]: https://www.reddit.com/r/blender/comments/15e4684/how_can_i_achieve_a_character_stylized_like_its/

[^2_11]: https://proctexture.com/textures/ground/soil/cracked-clay

[^2_12]: https://aitextured.com/textures/ambient/clay/clay_seamless_pbr_texture_earthy_matte_natural_tileable_brown_smooth.html

[^2_13]: https://3dtextures.me/2021/09/01/clay-001/

[^2_14]: https://learnwithhasan.com/threejs-guide/

[^2_15]: https://threejs.org/docs/pages/ShaderMaterial.html

[^2_16]: https://stemkoski.github.io/Three.js/

[^2_17]: https://threejs.org/docs/

[^2_18]: https://threejs.org/manual/en/materials.html

[^2_19]: https://designmd.app/library/claymation-3d-illustration/


---

# top! sehr gerne ein komplettes Three.js‑Beispielprojekt (HTML + JS) mit dem Clay‑Material und einer kleinen Testszene (Boden + ein paar Objekte) erstellen, das du lokal laufen lassen kannst. -> bitte packe auch deine recherche, how-to, referenzen und tipps/to-dos für claude/LLMs mit dazu - versteckt hinter einer kleinen knetgummi-icon; ebenfalls knet-icon für palette/info ein/ausblenden

Hier ist dein **komplettes KFB Clay Lab** als lokales Three.js‑Projekt. Ich habe die Recherche, How‑Tos und LLM‑To‑Dos direkt in die Seite eingebaut – versteckt hinter dem **Knet‑Gehirn‑Icon** (🧠) rechts oben; die Farbpalette (🎨) blendet die Material‑Controls ein/aus.[^3_1][^3_2][^3_3][^3_4][^3_5][^3_6][^3_7][^3_8][^3_9][^3_10][^3_11][^3_12]

______________________________________________________________________

## So startest du die Demo lokal

1. **Ordner herunterladen / erzeugen**
    - Im Chat‑Interface solltest du jetzt einen Ordner `kfb_clay_demo` mit vier Dateien sehen:
        - `index.html`
        - `style.css`
        - `main.js`
        - `README.md`
2. **Lokalen Webserver starten** (ES‑Modules laufen nicht per `file://`):

```bash
cd kfb_clay_demo
python -m http.server 8080
```

oder mit VS Code **Live Server**, `npx vite`, etc.
3. **Browser öffnen:**
    - `http://localhost:8080`
4. **Interaktion:**
    - **Ziehen** → Kamera drehen
    - **Scrollen** → Zoom
    - **🎨 Button** → Farbpalette ein/ausblenden (Farbe, Relief, Mikrostruktur, „Neue Knetmischung“)
    - **🧠 Button** → Recherche, Pipeline und LLM‑To‑Dos ein/ausblenden.

______________________________________________________________________

## Was die Demo technisch macht (kurz)

- **Material:** Ein `MeshStandardMaterial` bleibt Basis, damit Three.js‑PBR, Schatten und Tonemapping erhalten bleiben.[^3_7][^3_8][^3_10]
- **Clay‑Erweiterung:** Per `onBeforeCompile` wird der Shader kurz vor der Standard‑Beleuchtung modifiziert:
    - **Vertex:** Dreiskaliges Noise (breit / mittel / fein) erzeugt sanftes Displacement entlang der Normalen → handgeformte, leicht gedrückte Silhouetten.[^3_2][^3_6][^3_13][^3_1]
    - **Fragment:** Gleiche Noise‑Idee für subtile Farb‑ und Roughness‑Variation, damit die Oberfläche nicht wie glattes Plastik wirkt.[^3_10][^3_14][^3_1]
- **Seeds pro Objekt:** Jedes Mesh hat einen eigenen `uClaySeed`, sodass identische Geometrien nicht synchron „kneten“ und das Muster weniger als Tiling wahrgenommen wird.[^3_5][^3_15][^3_10]
- **Licht:** Weiche Hemisphere + große Directional‑Key‑Light + kühle Rim‑Light → warmer, „cozy“ Claybound‑Vibe.[^3_14][^3_16][^3_1]

______________________________________________________________________

## Wie du von hier zum Production‑Look kommst

### 1) Blender‑Lookdev zuerst

- Nimm ein **repräsentatives Objekt** (z.B. ein Track‑Segment oder ein Kid‑Car) und baue in Blender das prozedurale Clay‑Material nach dem Rezept aus der vorigen Nachricht:
    - Fingerprints (fein), Flattenings (Voronoi), Folds (anisotropes Noise), Bumps (mittel).[^3_3][^3_4][^3_1][^3_2][^3_5]
- Passe **Licht und Kamera** so an, wie sie im Spiel typisch sein werden (HDRI + 1–2 große Lights).
- Mache **Referenz‑Renders** (Front, 3/4, Nahansicht).

Diese Renders dienen als **visuelle Zielvorgabe** für den Three.js‑Shader: Du vergleichst später, ob die Browser‑Szene ähnlich „knetig“ aussieht.

### 2) Textur‑Set für Hero‑Assets

Für wichtige Objekte:

1. In Blender:
    - High‑Poly mit Subdivision + Displacement.
    - Low‑Poly für Runtime.
    - **Normal**, **Height**, **AO**, ggf. **Base Color** backen.[^3_4][^3_9][^3_11][^3_12][^3_3]
2. In Three.js:
    - Diese Maps zusätzlich zum Clay‑Shader in das `MeshStandardMaterial` laden:
        - `normalMap`, `displacementMap`, `aoMap`, `map`.
    - Den prozeduralen Teil dann eher als **Feinjustage** nutzen, nicht als Hauptstruktur.

### 3) Performance \& Plattform

- **Desktop:**
    - Schattenmap 2048×2048, PixelRatio bis 2, Displacement aktiv auf Hero‑Meshes.
- **Mobile:**
    - Schattenmap 1024×1024, PixelRatio auf 1.5 begrenzen, Displacement nur auf wenigen Objekten oder ganz abschalten.
- **Distanzobjekte:**
    - Weniger Vertices, keine Displacement‑Layer, evtl. vereinfachtes Material ohne Fragment‑Noise.

______________________________________________________________________

## Recherche \& How‑To (in der Demo hinter 🧠)

In der Seite selbst (unter dem Gehirn‑Button) findest du kompakt:

- **Look‑Rezept** (Makro / Meso / Mikro, Material, Licht).
- **Three.js‑Umsetzung** (Warum `onBeforeCompile`, wie Seeds genutzt werden).
- **Blender → Three.js Pipeline** (Modellierung, UVs, Backen, GLB‑Export).
- **To‑dos für Claude / LLMs** (Lookdev‑Briefing, keine generischen Fingerabdrücke, schichtweiser Shader‑Aufbau, vollständige Dateien, Asset‑Prompt‑Regeln).
- **Abnahmekriterien** (Silhouette, Tiling, Gameplay‑Lesbarkeit).
- **Referenzen** (Three.js Docs, Unity Clay ShaderGraph, Clay‑PBR‑Texturen).[^3_6][^3_8][^3_11][^3_12][^3_2][^3_7][^3_10]

Du kannst diesen Block direkt als **Prompt‑Basis** für weitere LLM‑Runden nutzen, z.B.:

> „Erweitere den Clay‑Shader aus `main.js` um eine optionale, gebackene Normal‑Map für Hero‑Assets, ohne die prozedurale Variation zu zerstören. Ziel: Desktop + Mobile, Three.js 0.181, PBR‑Lighting erhalten.“

______________________________________________________________________

## Nächste konkrete Schritte (Vorschlag)

1. **Demo lokal laufen lassen**, ein paar Farben/Relief‑Stufen durchprobieren.
2. **Ein KFB‑Referenzobjekt** (z.B. ein kurzes Track‑Stück) in Blender mit dem prozeduralen Clay‑Material bauen und rendern.
3. **Screenshots vergleichen**: Browser‑Demo vs. Blender‑Render.
4. Wenn der Grob‑Look sitzt:
    - Den Clay‑Shader aus `main.js` in eure Materialbibliothek verschieben.
    - Für 1–2 Hero‑Assets ein gebackenes Normal/Height‑Set erzeugen und in Three.js integrieren.

Wenn du magst, kann ich im nächsten Schritt:

- Den **Blender‑Node‑Graphen als detaillierte Schritt‑für‑Schritt‑Liste** ausformulieren (mit Node‑Namen, Werten und Screenshot‑Skizze im Text).
- Oder eine **zweite Demo‑Variante** bauen, die eine gebackene Normal‑ und Height‑Map zusätzlich zum prozeduralen Layer nutzt, damit du den Hybrid‑Look direkt testen kannst.[^3_9][^3_11][^3_12][^3_1][^3_2][^3_3][^3_4][^3_5]

<div align="center">⁂</div>

[^3_1]: https://www.diva-portal.org/smash/get/diva2:1878365/FULLTEXT01.pdf

[^3_2]: https://github.com/joebinns/clay

[^3_3]: https://www.webgl.brown37.net/11_surface_properties/10_bump_maps.html

[^3_4]: https://docs.otoy.com/standaloneSE/DiffuseLayer.html

[^3_5]: https://www.reddit.com/r/Unity3D/comments/fegjro/ive_finished_a_procedural_clay_shader_using/

[^3_6]: https://threejs.org/docs/pages/ShaderMaterial.html

[^3_7]: https://threejs.org/docs/

[^3_8]: https://threejs.org/manual/en/materials.html

[^3_9]: https://proctexture.com/textures/ground/soil/cracked-clay

[^3_10]: https://learnwithhasan.com/threejs-guide/

[^3_11]: https://aitextured.com/textures/ambient/clay/clay_seamless_pbr_texture_earthy_matte_natural_tileable_brown_smooth.html

[^3_12]: https://3dtextures.me/2021/09/01/clay-001/

[^3_13]: https://www.reddit.com/r/Unity3D/comments/p3v7wt/clay_material_low_update_rate_claymation_vfx/

[^3_14]: https://designmd.app/library/claymation-3d

[^3_15]: https://www.reddit.com/r/blender/comments/drys0b/mycellion_a_selfmade_procedural_clay_shader_test/

[^3_16]: https://designmd.app/library/claymation-3d-illustration/

