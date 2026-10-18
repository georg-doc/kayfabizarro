# SPEC_CARTOON_VFX_SHAPES_R1 — Rauch, Dampf, Blasen, Wolken, Gedankenblasen

Stand 18.10.2026 · Anlass: Georgs Urteil „kein mentales Modell, wie Rauch & Blasen im Cartoon designt werden – immer dieselbe Fehlerklasse". Ist-Zustand: 2–3 gestapelte weiße Kugeln über dem Kessel = „Schneebälle".
Gilt für: Blender-Assets (statisch, Knete-Look) und three.js-Runtime. Ergänzt `LIGHT_MODEL_R2`, `TRANSITION_INTENT_R1` (Speckle), Proof-Stage. Markierung: **[Qn]** = belegt (§5), **[H]** = FX-Handwerksregel/Erfahrungswert (Startwert, im Proof tunen).

**Warum die Schneebälle scheitern (Diagnose):** gleiche Größen · senkrecht gestapelt · Kugeln berühren sich nur tangential · jede Kugel hat ihren eigenen Terminator (wird als Einzelball schattiert) · reinweiß · statisch bzw. Alpha-Fade. Jeder dieser sechs Punkte allein reicht zum FAIL.

---

## §1 Das mentale Modell — 8 Kernregeln

1. **Eine Masse, nicht viele Kugeln.** Ein Puff ist EIN Volumen, dessen *Silhouette* Beulen (Lobes) hat. Lobes überlappen sich 30–60 % ihres Radius, nie tangential. Innen gibt es keine Kugelgrenzen; Schattierung läuft über die ganze Masse (gemeinsame Normalen, §3.1/§3.2) [Q12][Q13][H].
2. **Größenhierarchie Groß–Mittel–Klein (BMS).** Pro Puff 1 großer : 2–3 mittlere : 3–6 kleine Lobes. Nachbar-Lobes im Verhältnis 1 : 0,4–0,7. Nie zwei gleich große (±15 %) nebeneinander, nie Symmetrie. BMS gilt auch für Lücken/Negativformen [Q7][Q8].
3. **Gerichtete Tropfengestalt.** Schwerer, runder „Kopf" in Bewegungsrichtung, schmaler werdender Schweif zur Quelle, abgeflachte bzw. eingeschnürte Basis am Ursprung. Die Achse ist geschwungen (C- oder S-Kurve, Neigung 10–25° in Driftrichtung), nie lotrecht gestapelt [H][Q4].
4. **Lebenszyklus statt Zustand.** Geburt (klein, dicht, Squash) → Steigen + Wachsen → Einrollen (Curl) → Zerfall in kleinere Puffs → Vergehen durch Schrumpfen + Erosion. Kein reines Alpha-Fade. Faustregel Zeitanteile: Geburt 10–15 % · Steigen/Wachsen 35–45 % · Zerfall/Erosion 40–50 %. „Burst into existence, dissipate away" [Q7][Q3][Q5].
5. **Dichtegefälle.** An der Quelle dicht, zusammenhängend, große Lobes, kaum Lücken; nach oben luftiger, kleinere Fetzen, mehr Negativraum. Das Gefälle *ist* die Lesbarkeit von „steigt auf und verdünnt sich" [Q7][H].
6. **Schattierung folgt der Masse, eine Lichtquelle.** 2–3 Tonwerte: Licht · Körperschatten · Occlusion in den Lobe-Falten. Die dunkelste Stelle liegt in den Kontaktfalten zwischen Lobes, nicht am Rand jeder Kugel. Szenenlicht wird konsumiert (Ein-Rig-Regel), kein Fresnel-Rim, kein Emissive. Nie reinweiß [Q6][Q9][Q13].
7. **Nicht-Wiederholung.** Jede Instanz hat eigenen Seed, Rotation, Größe (±25–40 %), Lebensdauer (±20 %), Emissionstakt (±30–50 %). Mehrere Perioden mit teilerfremden Längen, kein sichtbarer Loop unter 10 s [Q5][H].
8. **Andocken an die Quelle.** Der Effekt wächst aus der Oberfläche/dem Rand heraus (Kontaktform folgt dem Kesselrand), schwebt nie abgelöst darüber. Ausnahme: Dampf mit bewusster Kondensationslücke (§2.1) [H].

---

## §2 Pro Effekt

### 2.1 Rauch & Dampf (Hexenkessel)

**Form.** Säule = Kette aus 4–7 Puffs, nach oben wachsend (oberster Puff 2,5–4× Breite des untersten). Jeder Puff folgt Regel 2+3. Die Gesamtsilhouette ist ein umgedrehter, gekrümmter Kegel mit eingerollter Krone: Lobes an der Vorderkante rollen nach außen-unten über (Pilz-/Blumenkohlkante). Basis: breit wie 60–80 % des Kesseldurchmessers, flach auf der Flüssigkeit, an den Rand angeschmiegt. Oben lösen sich 2–4 kleine Fetzen (0,2–0,4× Puffgröße) ab [H][Q7].
**Rauch vs. Dampf.** *Rauch* = schwer, rund, langlebig (3–6 s), opak. *Dampf* = leicht, schneller weg (1,5–3 s), schmaler, darf als 2–3 sich windende Bänder (S-Kurven, Phasenversatz) statt Puffs gebaut werden. Dampf startet mit Lücke 0,2–0,5× Puffgröße über der Oberfläche (Kondensation) [H]. „Wisps verhalten sich wie Feuer, Billows wie Wolken" [Q7].
**Bewegung.** Steigen mit Ease-out (schnell aus dem Kessel, oben langsamer). Skalierung Ease-out auf 2,5–4×. Geburt: Squash Y 0,6 → 1,1 → 1,0 in 0,15–0,25 s. Lobe-Eigenrotation 5–20 °/s, Nachbarn gegenläufig (Rollen). Seitliche Drift 0,1–0,3× Steiggeschwindigkeit, mit langsamer Sinus-Wanderung (Periode 3–7 s). Ab 50–60 % Lebenszeit: Puff zerfällt in 2–3 Kinder (je 0,4–0,6× Größe), dann Erosion. Emission: ein Puff alle 0,25–0,6 s, gejittert ±40 %; gelegentlich Doppelstoß. Live gleichzeitig: 8–14 Puffs pro Kessel [H][Q4][Q5].
**Farbe/Shading.** Hellster Wert 75–90 % (nie 100 %). Unten mit Sudfarbe getönt (z. B. Grünstich 15–30 % Sättigung), nach oben entsättigt Richtung Szenen-Grau. 2–3 Bänder aus dem Toon-Profil des gemeinsamen Materialmoduls; Falten dunkler (−15…−25 % Wert). Kanten weich-aber-definiert: Knete-Silhouette, kein Glow, keine Halos [Q6][H].
**Nie:** gleich große Kugeln · senkrechter Stapel · tangentiale Kontakte · pro-Kugel-Terminator · reinweiß · Alpha-Fade als einziges Vergehen · synchron pulsierende Puffs · Puffs, die aus dem Nichts über dem Kessel aufpoppen · Gradient/Linie als Auflösung (Speckle-Regel V-403 gilt auch hier).

### 2.2 Blasen

**Aufsteigende Blasen (Tank, Flüssigkeit im Glas/Kessel).**
- *Größenverteilung:* ca. 60 % klein · 30 % mittel · 10 % groß; Spanne 1 : 4–6. Nie gleiche Größen in Reihe [H].
- *Form/Weg:* klein = kugelig, steigt gerade; mittel/groß = leicht abgeplattet (Breite : Höhe 1 : 0,75–0,85), wackelt im Zickzack/Spiral (Amplitude 0,5–1× Durchmesser, 2–4 Wechsel/s). Große Blasen steigen schneller als kleine [Q14][Q15].
- *Emission:* in Strängen aus 2–4 Keimstellen plus gelegentlichen Clustern (3–5 Blasen dicht hintereinander), nicht als gleichmäßiger Regen. Intervalle gejittert ±50 % [H].
- *Look:* transparent bzw. getönt durchscheinend, kein opakes Weiß. Ein Haupt-Glanzlicht (Oval/Sichel, 20–30 % Durchmesser) auf der Lichtseite oben, ein kleiner Gegenpunkt (5–10 %) unten gegenüber, Rand etwas dichter/dunkler als die Mitte (Fresnel-*Form*, kein Rim-Licht-Trick). Glanzlicht folgt der einen Szenenlichtrichtung [Q16][Q17].
- *Oben:* Blase erreicht die Oberfläche → wird zur Oberflächenblase (s. u.) oder platzt sofort mit Ring.

**Oberflächenblasen (Kesselbrühe).**
- *Form:* Kuppel ≤ Halbkugel, Basis sitzt in der Flüssigkeit mit kleinem Wulst/Meniskus-Kragen (5–10 % Radius). Dicke Brühe: größer, träger, Kuppel bis 0,6× Kugel [H].
- *Zyklus:* Wachsen 0,3–0,6 s (Ease-out) → Halten mit Wackeln 0,2–1,0 s → Vorspannung 2–3 Frames (Kuppel streckt sich nach oben, Spitze wird dünn) → Platzen 2–4 Frames: Kuppel weg, 3–6 Spritztropfen + ein Ringwellchen, das sich auf 1,5–2× Radius ausdehnt und in 0,3–0,5 s abflacht. 20–30 % der Pops hinterlassen 1–2 Mini-Blasen [H].
- *Timing:* zufällige Intervalle, gehäuft im „heißen" Zentrum (60–70 % der Blasen im inneren Kesseldrittel), maximal 1–2 Pops im selben Frame, nie Takt erkennbar.
- *Nie:* Kugeln, die auf der Oberfläche liegen · gleich große Blasen im Raster · Pop als bloßes Ausblenden · Glanzlicht in verschiedene Richtungen pro Blase.

### 2.3 Wolken (Himmel, Dioramen-Wolken)

**Form.** Flacher, etwas dunklerer Boden (Kondensationsniveau), Blumenkohl-Oberseite. Breite : Höhe 1,8–3 : 1. Größte Lobes oben leicht außermittig, zu den Rändern kleinere (BMS); Lobes nur an der Oberseite und den Flanken, Boden glatt bis leicht gewellt. In Gruppen: unterschiedliche Größen (1 : 0,3–0,7), ungleiche Abstände, nie Reihe [H][Q12].
**Bewegung.** Langsam (Drift, keine Eigenrotation). Formwandel über 20–60 s durch langsames Ein-/Ausbeulen einzelner Lobes (±5–10 % Radius) [H].
**Shading.** Eine Normale für die ganze Wolke (Zentroid-Feld mit Lobe-Normalen gemischt [Q12]); 2–3 Bänder; Boden im Schattenband; Licht-Seite Wert ≤ 92 %.
**Nie:** kugelige Rundum-Lobes (Wolke als Kugelhaufen) · Lobes am Boden · gleiche Wolken kopiert · Scallop-Rand mit gleichen Bögen.

### 2.4 Gedanken- und Sprechblasen

**Gedankenwolke.**
- *Körper:* Ellipse Breite : Höhe 1,4–1,7 : 1, eng um den Text (Innenabstand ≈ 1 Versalhöhe). Kontur aus 7–12 Lobes (kleine Blasen weniger: 6–8). Kleine Blase ≠ verkleinerte große Blase — neu bauen mit weniger Lobes und mehr „Bloat" [Q10].
- *Lobe-Rhythmus:* Bogenlängen unregelmäßig im Muster groß–klein–groß–klein–klein (gelegentlich Doppel-Klein) [Q10]; Verhältnis groß : klein 1 : 0,5–0,75. Lobes sind *nach außen gewölbte Bögen mit spitzen Einkerbungen* (Täler zeigen nach innen), keine Halbkreise auf einem Kreis. Ganze Kontur leicht aufgebläht („Pucker & Bloat"), damit sie weich, nicht gestanzt wirkt.
- *Schweif:* 3–4 Kreise, jeweils 0,6–0,7× des vorigen, kleinster am Kopf; leicht gekrümmte Linie zum Kopf, Abstand zwischen den Kreisen ≈ 0,3–0,6× Kreisdurchmesser. Der erste Kreis sitzt am nächstgelegenen *kleinen* Lobe [Q10][Q11]. Schweif ist getrennt vom Körper (Sprechblase dagegen: angesetzter Keil).
- *Linie:* konstante Strichstärke ≈ 2–3 % der Blasenhöhe, alle Blasen im Bild gleiche absolute Stärke; Füllung leicht warmweiß (Wert ≈ 95 %), nie neonweiß.
**Sprechblase.** Glatte Ellipse/abgerundetes Rechteck („diamond"-Zeilenumbruch: Mittelzeilen länger [Q11]); Keil-Schweif zeigt auf den Mund, Spitze endet 0,5–1 Kopfbreite davor. Keine Lobes — Lobes = Gedanke.
**3D/Runtime.** Gedankenblasen sind *flache* Kissen (extrudierte 2D-Kontur, Tiefe 8–15 % der Höhe, weicher Bevel), immer zur Kamera gedreht, nie Kugelhaufen.
**Nie:** gleichmäßige Scallops (Briefmarkenrand) · mehr als 4 Schweifkreise · gleich große Schweifkreise · Schweif zeigt ins Leere · Lobes auch bei Sprechblasen.

---

## §3 Implementierungsrezepte

### 3.1 Blender — statischer „eingefrorener" Puff (Knete)

1. **Blockout aus Metaballs** (oder Kugeln): 1 groß + 2–3 mittel + 3–6 klein, Überlappung 30–60 %, entlang einer gekrümmten Achse (10–25° geneigt). Unterster Lobe in Z auf 0,6–0,75 gestaucht = flache Basis. Kopf größer als Schweif.
2. **Eingefrorener Moment:** Das statische Asset zeigt einen Zyklusmoment — Neigung in Driftrichtung, Krone eingerollt, 1–3 kleine Fetzen gerade abgelöst (Abstand 0,1–0,3× Fetzengröße).
3. **Zu Mesh → Voxel Remesh** (Voxelgröße ≈ Puffhöhe / 50, Bereich /40–/60) → Corrective Smooth. Falten bleiben lesbar: Faltenradius 5–10 % des kleinen Lobe-Radius (Fingerdruck, kein CG-Messerschnitt).
4. **Sculpt:** Inflate auf Lobes, Pinch leicht in die Täler, Clay Strips für Knete-Fläche. Dann KFB-Clay-Material/Textur — kein glattes CG.
5. **Displace** (Clouds, Größe 0,3–0,6× kleiner Lobe-Radius, Stärke 2–4 % der Höhe) — subtil; mehr = Kartoffel.
6. **Normalen = eine Masse:** Data-Transfer-Modifier, Custom Normals von einer stark geglätteten Kopie (Shrinkwrap-Hülle / Smooth ×30), Mix 0,5–0,8 [Q13][Q12]. Ohne diesen Schritt schattiert jeder Lobe als Einzelkugel.
7. **Runtime-Export:** 1,5–4 k Tris pro Puff, glTF mit Custom Normals; Vertex-Color R = Erosionsmaske (Höhe/Hohlraum), damit Dissolve zur Form passt [Q9].
8. **Set statt Einzelstück:** ≥ 5 Puffs (S/M/L, verschiedene Achsen), ≥ 3 Abriss-Fetzen, 1 Säulen-Kompositum, 3 Oberflächenblasen-Kuppeln, 2 Wolkenkörper. Gleiche Asset-Instanzen im Bild nur mit ≥ 60° Rotationsunterschied + Spiegelung.

### 3.2 three.js — Runtime (Default: Mesh-Puffs, opak)

- **Geometrie:** IcosahedronGeometry(1, 3–4) oder die Blender-Puffs aus 3.1 — keine UV-Sphere (Pol-Artefakte bei Displacement) [Q2].
- **Instancing:** ein `InstancedMesh` pro Effekttyp; Instanz-Attribute `seed`, `birth`, `life`, `scale0/1`, `axisTilt`. Pro Kessel 8–14 Puffs à 3–7 Lobes (30–60 Lobe-Instanzen) [Q18].
- **Vertex-Shader:** Displacement entlang Normale mit 3D-Noise, Amplitude 0,08–0,2× Radius, Frequenz 1,5–3 pro Radius, 2 Oktaven; Noise-Offset driftet langsam (0,05–0,15/s) für Brodeln [Q2].
- **Masse-Normalen im Shader:** `N = normalize(mix(lobeNormal, normalize(pos - puffCenter), 0,6–0,8))` [Q12].
- **Shading:** 2–3-stufige Toon-Rampe (NearestFilter-Gradient) als *Profil `vfx-puff` des gemeinsamen Licht-/Clay-Moduls* — kein privater Shader, kein Emissive, kein Fresnel-Rim (V-385). Occlusion in Falten: AO-Vertex-Color aus Blender oder Abstand-zu-Nachbarlobe.
- **Dissolve (Pflicht statt Fade):** opak + `discard` wenn `noise(worldPos*f + seed) < threshold(t)`; f so, dass 2–4 Löcher pro Lobe-Durchmesser entstehen; threshold 0 → 1 in den letzten 35–45 % der Lebenszeit, gleichzeitig Scale × 1 → 0,6. Erosionsrand 0,03–0,06 breit, einen Ton *dunkler* (kein Glow). Erosion in Speckle-Charakter (V-403), nicht als Linie/Gradient. Opak = keine Sortierprobleme [Q2][Q3][Q9].
- **Zerfall:** bei 50–60 % Lebenszeit 2–3 Kinder spawnen (Größe 0,4–0,6×, Startposition an Mutter-Lobes, Geschwindigkeit + 10–30 % seitlich).
- **Billboards nur als Fern-LOD:** handgezeichnete Puff-Flipbooks mit RG-Normalmap + Erosionsmaske, die *zur Normalmap passt* (sonst bricht das Volumen beim Auflösen) [Q9]. Flowmap/rotiertes Erosions-Noise wie im Zelda-Look [Q4].
- **Blasen:** InstancedMesh, MeshPhysical-ähnliches Clay-Profil mit Transmission oder geschichtetes Glanzlicht-Decal; Zickzack per `sin(t*ω+seed)*amp`, Abplattung nach Größe. Pop: Kuppel-Scale-Y 1 → 1,15 (2 Frames) → weg; Ring = flache Torus-/Ring-Instanz, scale 1 → 2, Dicke → 0.
- **Gedankenblase:** Kontur prozedural (Lobe-Bögen mit Rhythmus aus §2.4, seed-basiert) → `Shape` → `ExtrudeGeometry` (depth 0,08–0,15 h, bevelSize 0,02–0,04 h); Kontur per Inverted Hull (+1,5–2 % Skalierung) oder Line2 in konstanter Bildschirmstärke; Billboard-Ausrichtung; Schweifkreise als separate flache Scheiben.
- **Budget:** pro Kessel ≤ 1 Drawcall pro Effekttyp, ≤ 25 k Tris, Lobe-Update im Shader (kein CPU-Vertex-Update).

---

## §4 Abnahme-Checkliste (Proof-Stage, Clay, Szenenlicht)

**Still (Vollbild + 64-px-Thumbnail + Silhouette schwarz gefüllt):**
1. Silhouette-Test: schwarz gefüllt bei 64 px liest sich als Rauch/Wolke/Gedanke — nicht als Kugeln/Traube.
2. ≥ 3 Lobe-Größenklassen; keine zwei Nachbarn gleich groß (±15 %); Gesamtform asymmetrisch.
3. Keine tangentialen Kontakte; keine Einzelkugel-Terminatoren (Schatten läuft über die Masse, dunkelste Stelle in Falten).
4. Achse geneigt/geschwungen; Kopf > Schweif; Basis angedockt und abgeflacht.
5. Dichtegefälle sichtbar: unten dicht, oben Lücken und Fetzen.
6. Wert: max. Helligkeit ≤ 92 %, Tönung vom Ursprung, eine Lichtrichtung wie Szene, Clay-Textur sichtbar, kein Glow/Rim.
7. Blasen: Größen-Mix, ein konsistentes Glanzlicht, Kuppeln mit Kragen statt aufliegender Kugeln.
8. Gedankenblase: unregelmäßiger Lobe-Rhythmus, 3–4 abnehmende Schweifkreise Richtung Kopf, gleiche Strichstärke wie Nachbarblasen.

**Clip (≥ 12 s, einmal normal + einmal 25 % Tempo, Einzelbild-Step an Geburt und Tod):**
9. Geburt aus der Quelle mit Squash, kein Aufpoppen.
10. Wachstum ≥ 2,5×, Ease-out im Steigen; Lobes rollen.
11. Zerfall in kleinere Puffs passiert sichtbar.
12. Vergehen = Schrumpfen + Speckle-Erosion; kein reines Ausblenden, kein Gradient, keine Linie.
13. Keine Synchronität, kein erkennbarer Loop < 10 s.
14. Blasen: Zickzack bei großen, Pops mit Vorspannung + Ring + Tropfen, ≤ 2 Pops pro Frame.
15. Blinder Kritiker (V-411): „Siehst du Kugeln, Schneebälle oder ein Bauprinzip?" → muss „nein" sein. Ein Ja = FAIL, ohne Diskussion.

---

## §5 Quellen

Öffentliche Primärquellen zu Nintendo-/Blizzard-Rauch existieren kaum; die Regeln sind aus Riot/VFX-Apprentice-Prinzipien, Tech-Art-Breakdowns und Lettering-Praxis abgeleitet und mit FX-Handwerk [H] ergänzt. Elemental Magic (Gilland) behandelt Rauch im Kapitel „Fire, Smoke & Explosions" — Buch nicht online verifiziert, daher nicht zitiert.

- [Q1] Keyser/Chamberlain, „Visual Effects Bootcamp: Artistic Principles", GDC 2017 — https://gdcvault.com/play/1023943/Visual-Effects-Bootcamp-Artistic-Principles
- [Q2] Quirkbit, „Creating Stylised Explosions" (Kugel-Mesh, Noise-Displacement, Clip-Dissolve) — https://quirkbit.itch.io/adrift-arena/devlog/122433/creating-stylised-explosions
- [Q3] VFX Apprentice, „The Soul of Effects: What is Timing in VFX?" — https://www.vfxapprentice.com/blog/the-soul-of-effects-what-is-timing-in-vfx
- [Q4] 80.lv, „Creating Stylized Combat VFX in the Zelda Style" (Flowmap, Erosion, Rotation) — https://80.lv/articles/creating-stylized-combat-vfx-in-the-zelda-style/
- [Q5] VFX Apprentice, „10 Design Tips from the League of Legends VFX Style Guide" — https://www.vfxapprentice.com/blog/10-league-of-legends-vfx-design-tips · Riot Style Guide PDF: https://nexus.leagueoflegends.com/wp-content/uploads/2017/10/VFX_Styleguide_final_public_hidpjqwx7lqyx0pjj3ss.pdf
- [Q6] McGuire et al., „Real-Time Cartoon Rendering of Smoke", SIGGRAPH 2004 Poster (Zwei-Ton, Silhouette, Selbstschatten) — https://history.siggraph.org/wp-content/uploads/2023/01/2004-Poster-026-Mcguire_Real-Time-Cartoon-Rendering-of-Smoke.pdf
- [Q7] VFX Apprentice, „Elemental Foundations" (BMS, Smoke wisps vs. billows, Creation & Dissipation) — https://www.vfxapprentice.com/courses/elemental-foundation
- [Q8] Toon Boom, Keyser & Graf über 2D-FX-Design — https://www.toonboom.com/?p=13788
- [Q9] Simon Trümpler, „Stylized VFX in RiME" (lit particles, Erosionsmaske passend zur Normalmap) — https://simonschreibt.de/gat/stylized-vfx-in-rime/ · Talk: https://www.unrealengine.com/events/unreal-fest-europe-2018/stylized-vfx-in-rime
- [Q10] Balloon Tales, Gedankenblasen-Konstruktion (Lobe-Rhythmus, Bloat, 3–4 Schweifkreise) — https://balloontales.com/?p=384
- [Q11] Comics Kingdom, „Do You Speak Comics? Balloons and Bubbles" — https://comicskingdom.com/trending/blog/2024/07/22/do-you-speak-comics-part-2-balloons-and-bubbles · Clip Studio, Webtoon-Lettering — https://tips.clip-studio.com/en-us/articles/3751
- [Q12] Luis Antonio, „The Art of The Witness — Clouds" (Clumps, Zentroid-Normalenfeld) — https://www.artofluis.com/3d-work/the-art-of-the-witness/clouds/
- [Q13] BNPR, „Normal Spherizing using Abnormal" (Normalen-Transfer für Toon) — https://bnpr.gitbook.io/bnpr/shaders/toon-shading-nbpr-abnormal-normal-sphering
- [Q14] Wu & Gharib, „Path instabilities of air bubbles rising in clean water" — https://arxiv.org/pdf/patt-sol/9804002
- [Q15] IntechOpen, Übersicht Blasenform-Regime — https://www.intechopen.com/chapters/40686
- [Q16] Cut Out + Keep, „Jake Draws Bubbles" (Sichel, Haupt-/Gegenglanz) — https://www.cutoutandkeep.net/projects/jake-draws-bubbles
- [Q17] Art Projects for Kids, „How to Draw Bubbles" — https://artprojectsforkids.org/how-to-draw-bubbles/
- [Q18] three.js Forum, „Smoke Effect – InstancedMesh2" — https://discourse.threejs.org/t/smoke-effect-instancedmesh2/80341
- Ergänzend: SIBGRAPI 2023 „Real-Time Cartoon Shaded Smoke… (Three.js)" — https://sol.sbc.org.br/index.php/sibgrapi/article/view/27342 · GDC 2017 „Art Directing VFX for Stylized Games" — https://www.youtube.com/watch?v=x30j-PUN1G4 · Rare, „The Technical Art of Sea of Thieves" (SIGGRAPH 2018) — https://history.siggraph.org/wp-content/uploads/2022/09/2018-Talks-Ang_The-Technical-Art-of-Sea-of-Thieves.pdf · Gilland, *Elemental Magic* Vol. I — https://www.oreilly.com/library/view/elemental-magic/9780240811635/
