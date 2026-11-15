# Recherche Hero V7 R1: Hase schneidet Comicseite in Karten (three.js, WebGL2)

Stand 15.11.2026. Kurz, nur Umsetzbares. Markierung "(Wissen)" = aus Fachwissen, in dieser Runde nicht per Quelle gegengeprüft.

## 1. Steifes Papier und Karton

- Steifes Papier ist unausdehnbar, es biegt sich nur. Nimm PBD/XPBD mit harten Distanzconstraints (Compliance nahe 0) und weichen Biegeconstraints. Biegung nur an gewählten Kanten ist der Trick: Faltlinien weich, Rest steif.
  [Müller et al., PBD (2007)](https://matthias-research.github.io/pages/publications/posBasedDyn.pdf) | [XPBD, Macklin 2016](https://mmacklin.com/xpbd.pdf) | [Phys-Sim-Book: Cloth Stretching and Bending](https://phys-sim-book.github.io/lec32.1-pbd_cloth_constraints.html)
- Für die Biegung ist das Dreiecks-Modell (virtuelle Dreiecke) stabiler und gleich billig wie Distanzconstraints, mit besserer Konvergenz als Dihedralwinkel.
  [Kelager et al., Triangle Bending Constraint (VRIPHYS 2010)](https://diglib.eg.org/items/d4ab8f97-3d23-4869-914e-d881b36c403c)
- Knicklinien: Dihedral-Constraint mit Zielwinkel pro Kante (Falz = 0 Steifheit um den Zielwinkel, Rest hoher Wert). Der Origami Simulator macht genau das und läuft in three.js (WebGL, MIT, Amanda Ghassaei). Quelltext direkt lesen, Constraint-Teil portieren.
  [Origami Simulator Paper (Demaine/Ghassaei)](https://erikdemaine.org/papers/OrigamiSimulator_Origami7/paper.pdf) | [GitHub amandaghassaei/OrigamiSimulator](https://github.com/amandaghassaei/OrigamiSimulator)
- Praktisch für den Hero: keine Vollsimulation der Seite. Seite als 6–12 starre Streifen/Quads mit Scharnieren (Hinge) und Federwinkel, 4–8 Solver-Iterationen. Das reicht für Knick, Zurückfedern, Kartenkante. Cloth-Grid nur für den hängenden Rest (three.js-Beispiel `webgl_animation_cloth`, Verlet).
  [three.js Cloth-Beispiel](https://threejs.org/examples/#webgl_animation_cloth)
- Rissrand: Alphamaske aus 2 Rauschoktaven (Grobkante + feines Franzen) mit Schwelle; zusätzlich eine hellere Faserzone knapp hinter der Kante (weiße Papierschicht, 2–6 px breit). Harte Alphakante wirkt wie Schere. Einzelne Fasern als dünne Quads/Linien, ca. 0,3–0,7 px, 30–75 % Alpha (Angabe aus Guide, nicht Primärquelle).
  [3D-Paper-Material-Guide](https://www.ui-skills.com/skills/mengto/3d-paper-material) | [Codrops: Dissolve in three.js](https://tympanus.net/codrops/2025/02/17/implementing-a-dissolve-effect-with-shaders-and-particles-in-three-js/) | [Tearing-Gallery-Demo (Noise-Schwelle)](https://freefrontend.com/code/tearing-paper-photo-gallery-2026-01-28/)

## 2. Kleber und Honig ohne WebGPU

- Fäden und Tropfen zuerst als Verlet-Seil: 12–24 Punkte pro Faden, 4–10 Iterationen, Dämpfung 0,98–0,995. Jakobsen ist die Standardquelle. Als Röhre rendern (TubeGeometry/eigene Ring-Vertices um die Knoten), nicht als Line.
  [Jakobsen, Advanced Character Physics (GDC 2001)](https://www.cs.cmu.edu/afs/cs/academic/class/15462-s13/www/lec_slides/Jakobsen.pdf) | [Verlet Rope, J. Whiting](https://jonathanwhiting.com/writing/blog/verlet_rope) | [Rope-Rendering als Tube](https://blog.devgenius.io/verlet-integration-rendering-the-rope-97dae2832dce)
- Ausdünnen: Radius pro Segment = r0 * clamp(sqrt(L0/L), 0.08, 1) (Volumenerhalt, eigene Ableitung). Abriss, wenn Radius < ca. 0,1·r0 oder Länge > 4–6× Ruhelänge; dann zwei Stümpfe, die zurückschnellen und einen Tropfen am Ende bilden. Zähigkeit über starke Geschwindigkeitsdämpfung (0,9–0,97/Frame), nicht über Masse.
- Klumpen/Tropfen: Partikel mit Dichte-/Viskositätsgrenzen, "SPH-lite" mit Spatial Hash (Zellgröße = Kernelradius). 1–5k Partikel in JS sind machbar bei 2–3 Nachbarschaftsdurchläufen pro Frame und Float32Arrays, grob 2–6 ms. Ohne Druckiteration, nur Abstoßung plus XSPH-Viskosität. Das ist Faustwert, vor Einbau messen.
  [Müller et al., Particle-Based Fluid Simulation (2003)](https://matthias-research.github.io/pages/publications/sca03.pdf) (Wissen)
- Darstellung günstig: Screen-Space-Fluid. Partikel als Kugel-Sprites, Tiefe rendern, Tiefe glätten, Normale rekonstruieren, Dicke-Pass für Tönung/Refraktion. Der Narrow-Range-Filter erhält Ränder besser als Bilateral bei geringen Kosten (Auflösung halbieren, 1 Pass 7–15 Taps reicht für Stop-Motion-Look).
  [Truong & Yuksel, Narrow-Range Filter](https://www.cemyuksel.com/research/papers/narrowrangefilter.pdf) | [Narrow-Band SSFR (CGF 2022, 2,4× schneller)](https://diglib.eg.org/items/dfec37ea-41d7-47e7-93da-6a6ea079c155/full) | [van der Laan et al., I3D 2009](https://dl.acm.org/doi/10.1145/1507149.1507164) (Wissen)
- Für den Handmade-Look: Kleber als Röhren und Tropfen mit Phong-Glanz und Ton-/Plastilin-Material statt Wasser-Refraktion. Seilröhren plus ein paar Kugeln (Metaball nur als Smooth-Union in einem kleinen Raymarch-Quad, 1 Tropfen-Gruppe) sind billiger und lesbarer als echte Flüssigkeit.

## 3. Stop-Motion-Handwerk

- Aardman animiert überwiegend auf Zweien (24 fps Aufnahme, ca. 12 Posen/s). Laika gilt als Studio, das auf Einsen geht und Ersatzgesichter pro Bild tauscht; Quellen dazu sind Sekundärartikel, vor Behauptung in Texten prüfen.
  [Laika: Frame by Frame (Film Stories)](https://filmstories.co.uk/?p=85484) | [Little White Lies zur BFI-Ausstellung](https://lwlies.com/articles/laika-frame-by-frame-bfi) | [Chicken Run: Dawn of the Nugget (Yahoo)](https://uk.news.yahoo.com/chicken-run-dawn-nugget-boldly-223000602.html)
- Frameraten mischen: Spider-Verse animiert Figuren meist auf Zweien (ca. 12 Posen/s, "eine fließende Skala"), Haar und Cloth bleiben auf Einsen; Peter auf Einsen, Miles auf Zweien. Teil 2 hat variable Raten 1er bis 6er pro Element. Übertrag: Hase auf Zweien, Papierseite auf Zweien, Kamera auf Einsen oder Dreien; Partikel/Kleber auf Einsen.
  [fxguide zu Spider-Verse](https://www.fxguide.com/?p=244678) | [Cartoon Brew](https://www.cartoonbrew.com/?p=167321) | [Befores & Afters](https://beforesandafters.com/2023/06/28/this-was-the-first-cg-animated-movie-ive-ever-heard-of-that-actually-had-a-dedicated-inking-team/)
- Lego Movie: Animatoren hielten Posen auf Zweien, bei schnellen Aktionen auf Dreien/Vieren, ohne Motion Blur; Fingerabdrücke, Kratzer und echte Brick-Fertigung der Sets. Motion Blur aus lassen ist der billigste Tell.
  [MPA: How The Lego Movie Got Its Stop-Motion Look](https://www.motionpictures.org/2014/02/how-the-lego-movie-got-its-stop-motion-look/) | [Solidsmack zu Animal Logic](https://www.solidsmack.com/uncategorized/how-animal-logic-studios-attention-to-detail-makes-lego-movie-cgi-feel-like-stop-motion)
- Tells zum Einbauen (Richtwerte, Wissen): Boiling = Textur-/Kantenrauschen wechselt mit 8–12 Hz, Seed pro Haltebild, Amplitude 0,3–1 px. Pose-Jitter = zufälliger Versatz/Drehung 0,1–0,4° und 0,2–0,5 % Bildbreite pro neue Pose. Licht-Flackern = Intensität ±2–4 % pro Haltebild, leicht verschobene Lichtposition. Szene auf feste Bildzeit quantisieren (t = floor(t*12)/12), nie Interpolation innerhalb des Haltebilds. Keine Bewegungsunschärfe, nur selten Smear-Frames.

## 4. Slow-Mo-Audio

- Standardrezept: Zeitskala als einzelner Parameter (RTPC/Variable), gekoppelt an Pitch und Tiefpass. Für Ambiente nur Pitch runter plus Tiefpass; für Schlüsselgeräusche (Schuss, Riss) ein eigens vorbereitetes Slow-Mo-Sample per Crossfade dazu.
  [CRIWARE: Bullet Time](https://blog.criware.com/index.php/2024/06/03/bullet-time/) | [CRIWARE: Time Dilation in UE4](https://blog.criware.com/?p=3012) | [Audiokinetic Q&A: Time scale audio](https://www.audiokinetic.com/qa/2394/time-scale-audio-in-unreal)
- Pitch folgt nicht 1:1 der Zeitskala. Der Pitch-Bereich ist oft nach unten begrenzt (ca. 0,4 berichtet), tiefe Werte klingen zu extrem. Eigene, sanftere Kurve: Zeitskala 0,3 -> Pitch ca. 0,6–0,75.
  [Unreal-Forum zu Time Dilation und Ton](https://forums.unrealengine.com/t/time-dilation-with-sound/336770) | [CRIWARE Post 2991](https://blog.criware.com/index.php/wp-json/wp/v2/posts/2991)
- Reines Time-Stretch ohne Pitch (Phase Vocoder) macht bei Faktor >2 Artefakte; Granular-Stretch ist für Papierrascheln und Rauschen gut, für tonale Teile schlecht. Für Papier-Riss: Granular auf der Rauschschicht, Pitch-Absenkung auf dem Körper.
  [Audiokinetic Q&A: Time stretch with pitch](https://www.audiokinetic.com/qa/3071/how-can-i-time-stretch-with-pitch-change) | [Soundseed Grain](https://www.audiokinetic.com/ko/blog/temporal-flexibility-with-soundseed-grain)
- Timing (Wissen, Richtwerte): Einstieg 60–150 ms mit kurzem Tiefpass-Sweep 12 kHz -> 2–4 kHz (macht die Absicht lesbar), Ausstieg 250–600 ms langsamer, leichter "Whoosh" beim Einsetzen. Musik und Ambiente im Slow-Mo um 3–6 dB senken (Ducking), das betonte Geräusch bleibt oben. Web Audio: `playbackRate` plus `BiquadFilterNode` mit `setTargetAtTime`.
  [MDN: AudioParam.setTargetAtTime](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime)
- Keine GDC-Quelle zu Max Payne gefunden. Wenn nötig, auf der GDC Vault nach "time dilation audio" suchen.

## Für uns zuerst

1. Papier: Seite als 8–12 Streifen mit Federscharnieren (XPBD-Dihedral) plus Alpha-Rissrand mit Faserzone; Origami-Simulator-Constraints als Vorlage.
2. Kleber: Verlet-Faden mit Radius-Ausdünnung und Abriss bei 4–6× Länge, als Röhre; Tropfen als Kugel-Sprites, noch kein Fluid-Pass.
3. Stop-Motion: Alles auf feste 12-Hz-Haltebilder quantisieren, Seed-Boiling an der Kante, kein Motion Blur; Partikel auf Einsen.
4. Audio: eine Zeitskala-Variable koppelt Tiefpass-Sweep (12 -> 3 kHz in ca. 100 ms) und gedämpften Pitch (0,3 -> ca. 0,7); Rissgeräusch als Granular-Schicht.
5. Prüfen: eine Messung der Partikel-Kosten (1k/3k/5k) im Zielbrowser, bevor ein Fluid-Pass entschieden wird.
