<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# hi! recherchere bitte für eine umfassende übersicht an cartoon animation physics (classic disney, nickelodeon etc to modern 3D/2.5D cartoon style animation games und videos:

-> best practices, techniken, guidelines, howtos, tipps\&tricks, SOPs, konzepte und methoden, die wir für 3D cartoon animations mit kenney-assets wie den pet cubes nutzen könne. ziel ist der aufbau einer umfassenden cartoon motion library (jump, bounce, stretch\&squash, gummiball, etc). schwierigkeit: wir haben runde cartoon-augen über die flachen statischen eyeball-ebenen der original pets gelegt.
[https://kenney.nl/assets/cube-pets](https://kenney.nl/assets/cube-pets)
unsere modelle liegen hier, screenshot claude design anbei.
[https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/pet-LIBRARY.json](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/pet-LIBRARY.json)
[https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets/GLB_cube-pets](https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets/GLB_cube-pets)

Ja — für **MVP-Bildung** der Cartoon-Motion-Library würde ich das in drei Ebenen aufteilen: **Research/Reference**, **Core Motion Set**, und **Rig/Implementation Rules**. Für eure Kenney Cube Pets mit den zusätzlichen runden Augen ist der wichtigste Punkt, dass ihr nicht nur „bewegte Meshes“ baut, sondern eine **regelbasierte Bewegungsgrammatik**: Körper, Kopf, Augen, Ohren, Anticipation, Follow-through, Recovery.[^1][^2][^3]

## Was ihr recherchieren solltet

Für eine belastbare Basis würde ich drei Referenzstränge sammeln:

- **Classic Disney / Warner / Fleischer** für Prinzipien wie squash \& stretch, arcs, timing, anticipation, exaggeration.
- **Nickelodeon / Cartoon Network / modern TV-cartoon** für reduzierte, harte Posen, boingy timing, snappy offsets, smear-art friendliness.
- **Modern 3D/2.5D game animation** für Echtzeit-Constraints, additive animation, layered rigs, state blending, and gameplay readability.[^2][^3][^4]

Dazu kommen technische Referenzen zu **scene graph**, `Object3D.traverse`, und Material-/Mesh-Organisation, weil ihr bei Cube Pets wahrscheinlich pro Tier mit Hierarchien aus Root, Body, Eyes, Ears, Tail, Accessory arbeiten werdet.[^3][^5][^2]

## Die Motion-Foundation

Für eine umfassende Motion Library würde ich diese Grundprinzipien als SOP festschreiben:

1. **Pose first.** Jede Motion muss als klare Start-, Extreme- und End-Pose lesbar sein.
2. **Anticipation first.** Vor jedem Jump, Bounce oder Turn braucht es eine kurze Gegenbewegung.
3. **Squash before impact.** Die stärkste Deformation kommt kurz vor oder im Moment des Kontakts.
4. **Follow-through after action.** Ohren, Augen, Körper und Zubehör laufen leicht nach.
5. **Recovery is part of the motion.** Ohne Rückkehr zur Ruhe wirkt die Animation abgehackt.
6. **Motion priority.** Augen reagieren vor dem Kopf, Kopf vor dem Körper, Körper vor dem Root.[^4][^3]

## Für eure Cube Pets

Bei den Cube Pets sind die Augen heikel, weil ihr **runde Cartoon-Augen über flache statische Eyeball-Ebenen** gelegt habt. Das heißt: Die Augen sollten nicht nur „mittransformieren“, sondern ihre eigene kleine Physik bekommen, sonst wirkt der Look tot oder wie aufgeklebte Sticker.[^1]

### Empfohlene Augen-Regeln

- Augen als eigene Nodes behandeln, nicht als reine Texture-Elemente.
- Separate `eyeTarget` oder `gazeTarget` Logik für Look-at.
- Micro-delay zwischen Kopfbewegung und Blickbewegung.
- Bei Squash/Stretch: Augen nur minimal skalieren, meist entgegen der Körperdeformation.
- Bei Jump/Bounce: Augen bleiben stabiler als Körper, aber mit leichtem settle.[^2][^3][^1]


## Motion Library für MVP 1

Für das erste Paket würde ich nur die **essentiellen, wiederverwendbaren** Bewegungen bauen. Diese sollten später als Baukasten für komplexere Aktionen dienen.

### Kernbewegungen

- `idle_breathe`
- `look_at`
- `blink`
- `hop`
- `jump`
- `land`
- `bounce`
- `turn_90`
- `turn_180`
- `celebrate`
- `hit_react`
- `sleep`
- `emote_yes`
- `emote_no`[^3][^4]


### Warum genau diese

Diese Menge deckt fast alle Gameplay-Situationen ab: ruhen, reagieren, orientieren, bewegen, feiern, verneinen und getroffen werden. Alles Weitere kann als Variation oder Layer daraus entstehen.[^4][^3]

## Motion Library für MVP 2

Im zweiten Schritt würde ich die Library um **spezifische Cartoon-Physics-Patterns** ergänzen.

### Zusätzliche Bewegungen

- `spring_up`
- `rubber_band_return`
- `gumball_roll`
- `float_hover`
- `stagger`
- `stomp`
- `spin_stop`
- `pose_hold`
- `tiptoe`
- `peek`
- `double_take`
- `fear_shiver`[^3][^4]

Hier wird der Stil wichtiger als reine Funktion. Das sind Bewegungen, die stark von Timing, Ease curves und Pose contrast leben.[^4][^3]

## Motion Library für MVP 3

Wenn MVP 1 und 2 sauber stehen, könnt ihr die Library in Richtung **performance animation** erweitern.

### Fortgeschrittene Moves

- `launch`
- `air_drift`
- `midair_flip`
- `impact_crash`
- `slide_stop`
- `panic_run`
- `victory_loop`
- `taunt`
- `complain`
- `shrug`
- `heavy_fall`
- `soft_fall`[^3][^4]

Diese Bewegungen brauchen meist mehrere Layer und klare Prioritäten zwischen Root Motion, Körperdeformation und Accessory Follow-through.[^2][^3]

## Best Practices für 3D-Cartoon-Physics

Für euren Style würde ich die folgenden Cartoon-Physics-Praktiken als verbindlich definieren:

- **Squash \& stretch** immer proportional zur Handlung, nie gleichmäßig überall.
- **Overlaps** zwischen Körperteilen sind wichtiger als perfekte Symmetrie.
- **Arcs** statt Linearbewegung, besonders bei Sprüngen und Turns.
- **Timing contrast**: langsame Vorbereitung, schnelle Ausführung.
- **Stiff-to-soft contrast**: harte Grundform, weiche Bewegungsreaktion.
- **Pose readability**: jede Pose muss aus mittlerer Kameradistanz verstanden werden.
- **Held moments**: einige Frames/States bewusst länger halten, wenn Emotion wichtig ist.[^4][^3]


## Richtige technische Struktur

Ich würde die Animationen als **State Machine + Additive Layers + Procedural Micro Motion** aufbauen.

### Layer 1: Base state

- idle, move, jump, fall, land, turn.


### Layer 2: Expression layer

- blink, eye dart, smile, worry, anger, surprise.


### Layer 3: Physics layer

- bounce, wobble, squash, secondary jiggle, ear follow-through.


### Layer 4: Gameplay layer

- selected, selected_loop, hit, victory, loss, prompt_response.[^2][^3][^4]

Das ist besonders wichtig, weil ihr so Motion-Library-Elemente kombinieren könnt, ohne für jede Kombi eine eigene Animation zu brauchen.[^2][^3]

## SOP für eure Animationsproduktion

Ich würde die Produktion als feste SOP aufsetzen:

1. **Motion brief** schreiben: Ziel, Emotion, Spielzustand, Dauer.
2. **Reference clips** sammeln: klassische Cartoon-Referenz + modernes Game-Referenzvideo.
3. **Pose thumbnails** zeichnen: 3–5 Schlüsselposen.
4. **Blockout animieren**: nur Root + Major Parts.
5. **Add overlap and offsets**: Eyes, ears, tail, secondary squash.
6. **Polish timing**: Ease, hold, accent frames.
7. **Gameplay test**: aus Spielkamera prüfen.
8. **Library taggen**: Dauer, loopable, one-shot, intensity, state.[^3][^4][^2]

## Für Augen über flachen Eyeballs

Das ist euer spezielles Problem, und ich würde es so lösen:

- Augen nicht mit der Haut verschmelzen lassen, sondern als **visuelles System** behandeln.
- Augenbewegung von Kopfbewegung entkoppeln, aber weich folgen lassen.
- Bei Jump/Impact: Augen minimal später, aber stärker als Kopf.
- Bei Speak/React: Eyes lead, head follows.
- Eyeballs dürfen leicht „floaten“, aber nie so stark, dass sie von der Form abfallen.
- Bei Squash sollte der Körper die Form verlieren, die Augen aber die Lesbarkeit halten.[^1]


## Welche Referenzen ihr braucht

Für den Research-Ordner würde ich diese Kategorien sammeln:

- **Classic 2D cartoon physics**: jumps, stretches, impact holds, smear inspiration.
- **Modern 3D cartoon game animation**: creature idles, playful bounces, reaction sets.
- **Face/eye behavior references**: eye dart, blink timing, head follow delay.
- **Motion shape references**: rubber, elastic, gelatin, toy, plush, paper, spring.
- **Gameplay readability references**: turn-based select, idle loops, win/loss states.[^4][^3]


## Empfehlung für die Library-Struktur

Ich würde eure Motion Library in Tags organisieren:

- `locomotion`
- `idle`
- `reaction`
- `celebration`
- `hurt`
- `expressive`
- `gag`
- `rubber_physics`
- `eye_system`
- `transition`
- `loopable`
- `one_shot`[^2][^3]

Wenn du willst, kann ich dir als Nächstes daraus eine **konkrete Motion-Library-Matrix als Tabelle** bauen: mit **Animation-Namen, Zweck, Dauer, Loop ja/nein, Layer, Augenverhalten, Implementations-Notiz und Referenztyp**.
<span style="display:none">[^6]</span>

<div align="center">⁂</div>

[^1]: Bildschirmfoto-2026-07-16-um-00.21.56.jpg

[^2]: https://threejs.org/manual/en/scenegraph.html

[^3]: https://threejs.org/docs/api/ko/core/Object3D.html

[^4]: https://eng.libretexts.org/Bookshelves/Computer_Science/Applied_Programming/Introduction_to_Computer_Graphics_(Eck)/05:_Three.js-_A_3D_Scene_Graph_API/5.01:_Three.js_Basics

[^5]: https://fossies.org/linux/three.js/docs/pages/Object3D.html

[^6]: kayfabizarro-archive-1.json

