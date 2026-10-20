# Himmel R2 · Recherche: stilisierte Himmelskuppeln, lizenzsauber

Stand 20.10.2026 · Auftrag Georg 21.10. („Gute Skydomes recherchieren … lizenzrechtlich sauber. Tiny Skies war bislang das beste Beispiel“) · Bezug: `probe/gelaende-probe.html` (Himmel v2, `GLSL_SKY`/`skyColor`/`applyAir`), R13 (Himmel/Horizont/Ferne), Ferne R1, Wolken R1.
Methode: Ich habe nur Webseiten gelesen (WebFetch/WebSearch). Nichts wurde installiert, heruntergeladen oder in einem Repo verändert. Die Probe habe ich nur gelesen, um die Anschlüsse zu prüfen.
Kennzeichen: **[Q]** steht so in der Quelle · **[V]** Vermutung oder eigener Vorschlag · **[KFB]** aus unserem Code.

---

## 1 · Kurzfassung

Einen fertigen stilisierten Himmel für three.js, der lizenzsauber ist und zu unserer Farbflächen-Logik passt, habe ich nicht gefunden. Die guten freien Himmel sind Godot- und Unity-Shader. Die three.js-Lösungen sind physikalisch (Preetham, Hillaire), und `@pmndrs/sky` läuft nur unter WebGPU. **Empfehlung:** Wir nehmen zwei saubere Quellen als Bauplan und schreiben den Shader selbst in GLSL. Das sind **Harry Alisavakis' Sky-Shader (CC0)** mit Drei-Farben-Verlauf, Sonne, Mond, Sternen hinter Wolken und Silberrand, und **Kelvin van Hoornʼs Skybox-Tutorial (MIT)**: drei Verläufe, gesteuert über Sonnenhöhe, Blickhöhe und Abstand zur Sonne, dazu Mondphase und Sternendrehung. Als three.js-Gegenprobe für die Kosten dient **Nugget8/Three.js-Ocean-Scene (MIT)**, drei Verläufe auf dem Handy bei 120 fps. Selbst bauen wir, was zum Gelände gehört: **weicher Grundverlauf plus harte, leicht gewellte Farbbänder am Horizont**, nur in der Dämmerung. Dazu ein Sonnenhof aus harter Scheibe plus weichem additivem Hof, Tageszeiten als Farbsätze nach Sonnenhöhe und eine Nacht mit harten Cartoon-Sternen und Polarlicht-Bändern. Alles läuft weiter durch **eine** Himmelsfunktion für Kuppel und Nebel. Unser Himmel v2 hat diese Struktur schon [KFB]. R2 ist deshalb ein Umbau, kein Neubau. Shadertoy (CC BY-NC-SA), Veloren (GPL-3.0) und tinyskies (ohne Lizenz) liefern nur Ideen.

**Lizenz-Hinweis zu R13:** R13 enthält ganze Wertetabellen, die aus tinyskies abgeschrieben sind (Verlaufsstopps, Nebel, Wolkenformeln, Strahlen, Mond). Sie dürfen **nicht** in den Code. In der Probe habe ich keine dieser Werte gefunden; die Kommentare sagen „Idee …, selbst gebaut“ [KFB, grep]. Die Startwerte in §4 sind neu.

---

## 2 · Kandidaten

Kosten = grobe Schätzung für einen Vollbild-Pass auf dem Mac **[V]**, außer wo die Quelle misst.

| Kandidat | Art | Lizenz (Beleg) | Look | Kosten Browser | Was wir übernehmen könnten |
|---|---|---|---|---|---|
| **Harry Alisavakis, „Sky shader“** | Tutorial + Code (Unity) | **CC0**: „code in the shader tutorials is under the CC0 license“ ([Seite](https://halisavakis.com/my-take-on-shaders-sky-shader/)) | mittel stilisiert: 3 Farben oben/Mitte/unten, Sonne, Mond mit Phase, Sterne, Horizontwolken mit Silberrand | niedrig | **Basis.** Verlaufsaufbau, Sterne hinter Wolken ausblenden, Silberrand bei Gegenlicht. Code darf frei portiert werden |
| **Alisavakis, Firewatch-Nebel** | Tutorial | CC0 (wie oben, [Seite](https://halisavakis.com/my-take-on-shaders-firewatch-multi-colored-fog/)) | Nebelfarbe aus Verlauf nach Distanz | 1 Texturzugriff | Nebel als Verlauf statt Einzelfarbe (haben wir über `skyColor` schon) |
| **Kelvin van Hoorn, Skybox-Tutorial** (Godot und Unity) | Tutorial + Code | **MIT**: Godot-Repo „MIT License, Copyright (c) 2025 Kelvin van Hoorn“ ([Codeberg](https://codeberg.org/KelvinvanHoorn/skybox-tutorial-godot)); Unity-Repo MIT, „Copyright (c) 2022 Radagasd“ ([Codeberg](https://codeberg.org/KelvinvanHoorn/skybox-tutorial-unity)) | bewusst nicht physikalisch: drei Verlaufstexturen, abgetastet über Sonne–Zenit, Blick–Zenit und Sonne–Blick, additiv | niedrig (3 Zugriffe) | **Basis.** Drei-Verlauf-Prinzip, Mondphase, Sternendrehung. Bei Code-Übernahme den MIT-Vermerk mitliefern ([Tutorial](https://kelvinvanhoorn.com/tutorials/godot_skybox_shader/)) |
| **Nugget8, Three.js-Ocean-Scene** | Code (three.js) | **MIT** ([Repo](https://github.com/Nugget8/Three.js-Ocean-Scene)) | weich: Dichte-, Leucht- und Dämmerungsverlauf, Dämmerung = Produkt der beiden ersten | sehr niedrig, „constant 120 FPS“ auf einem Mittelklasse-Handy von 2021 [Q] | Dämmerung als Produkt zweier Verläufe; Kostenbeleg für three.js |
| godotshaders „Cartoon sky“ | Code (Godot) | **CC0** ([Seite](https://godotshaders.com/shader/cartoon-sky-shader/)) | Zweiton-Zellkante zwischen Himmel und Horizont, weiche Sonne, fbm-Wolken | niedrig | harte Zweitonkante = Vorbild für unser Horizontband |
| godotshaders „Stylized Sky Shader With Clouds“ (axilirate) | Code (Godot) | **CC0** ([Seite](https://godotshaders.com/shader/stylized-sky-shader-with-clouds/)) | Tag/Abend/Nacht-Verlauf, Mondsichel, Rauschtextur-Wolken, Voronoi-Sterne | niedrig–mittel | Steuerung über die Lichtrichtung, Mondsichel |
| godotshaders „Stylized sky with procedural sun and moon“ (krzmig) | Code + Projekt | **MIT** ([Seite](https://godotshaders.com/shader/stylized-sky-with-procedural-sun-and-moon/), [Projekt](https://github.com/krzmig/godot-simple-sky-project)) | Sonnen- und Mondbahn mit Jahreszeit, Mondphase, nicht kachelnde Rauschwolken | mittel (prozedurales Rauschen) | Bahnrechnung Sonne/Mond, Ebenenfolge (Mond vor Sonne, Wolken vor Mond). Laut Autor ein Umbau eines anderen Shaders; welcher, steht nicht da → [V] prüfen, falls wir Code nehmen |
| godotshaders „Stylized Sky“ (Gotibo) | Code (Godot) | **MIT** ([Seite](https://godotshaders.com/shader/stylized-sky/)) | Raymarching-Wolken, Sternschnuppen, Voronoi-Sterne | **hoch** (läuft schon auf halber Auflösung) | nur die Idee mit den Sternschnuppen |
| paddy-exe, GodotStylizedSkyShader | Code (Port MinionsArt) | **widersprüchlich:** README sagt CC BY 4.0 mit Namensnennung ([Repo](https://github.com/paddy-exe/GodotStylizedSkyShader)), godotshaders-Eintrag sagt MIT ([Seite](https://godotshaders.com/shader/stylized-skyshader/)) → CC BY 4.0 annehmen | Tag-/Nachtverläufe, Sonne/Mond, Sterne, Wolken | niedrig–mittel | kommerziell nur mit Namensnennung; lieber nur Ideen |
| MinionsArt, „Making a Stylized Skybox Shader“ | Tutorial (Patreon) | **unklar**: Seite ohne Angabe ([Patreon](https://www.patreon.com/minionsart/posts/making-stylized-27402644)); laut Port CC BY 4.0 | Klassiker des Cartoon-Himmels | niedrig | Ideen |
| Josephy5, Stylized-Skybox (URP) | Code | MIT, enthält aber MinionsArt-Code unter dessen Lizenz ([Repo](https://github.com/Josephy5/Stylized-Skybox)) → **unklar** | Tag/Nacht, Sterne, Horizont, Wolken | niedrig | nichts zusätzlich |
| danielshervheim, unity-stylized-sky | Code (Unity) | **BSD-3-Clause** ([Repo](https://github.com/danielshervheim/unity-stylized-sky)) | Sonnenscheibe, Sonnenhof, Horizontlinie, Verlauf, Presets | niedrig | „Horizontlinie“ als eigener Baustein; Hinweis bei Nutzung nötig |
| three.js `Sky.js` | Code | **MIT** (three.js) | physikalisch (Preetham). r147: nur Streuparameter, keine Wolken [Q, [r147](https://raw.githubusercontent.com/mrdoob/three.js/r147/examples/jsm/objects/Sky.js)]. r186: zusätzlich Wolken mit 4-Oktaven-Rauschen [Q, [Release r186](https://github.com/mrdoob/three.js/releases/tag/r186)] | r147 mittel, r186 hoch | kein Look. Als Messlatte, um echte Sonnenfarben je Höhe abzulesen |
| Babylon.js SkyMaterial | Code | **Apache-2.0** ([Lizenz](https://github.com/BabylonJS/Babylon.js/blob/master/license.md), [Doku](https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/skyMat)) | Preetham wie oben | mittel | nichts über `Sky.js` hinaus |
| PlayCanvas DynamicSkyEffect | Code (Engine) | **MIT** ([Lizenz](https://github.com/playcanvas/engine/blob/main/LICENSE)), gemergt 15.10.2026 ([PR 9765](https://github.com/playcanvas/engine/pull/9765), [PR 9772](https://github.com/playcanvas/engine/pull/9772)) | Preetham-Tag, Nachtverlauf mit Dämmerungsschein, kantengeglättete Sterne, Mond, flache oder volumetrische Wolken | flach: 1 Texturzugriff; volumetrisch teuer [Q] | (V-381) Umgebungslicht nur neu backen, wenn sich die Sonne bewegt; Richtungslicht geht nachts in Mondlicht über. Die Quelle sagt selbst: Nebel bekommt kein Himmelslicht [Q]. Das machen wir anders |
| `@pmndrs/sky` | Code | **MIT** ([README](https://github.com/pmndrs/sky/blob/main/README.md)) | physikalisch (Hillaire 2020), „sky grades“ für künstlerische Tageszeit | **nur WebGPU**, three ≥ 0.186 [Q] | nicht nutzbar unter WebGL2; Idee „Farbstufen über Physik legen“ |
| Sky3D (Godot) | Code | **MIT**, Sternkarten mit Fremd-Credit ([Repo](https://github.com/TokisanGames/Sky3D)) | halbphysikalisch, Tag/Nacht, Nebel, Wolken | mittel | Zeit- und Steuerlogik als Vorbild |
| Tw1ddle, Sky-Shader | Werkzeug | **MIT** ([Repo](https://github.com/Tw1ddle/Sky-Shader)) | Preetham-Editor im Browser | – | zum Farbe-Finden |
| Firewatch (Campo Santo, GDC 2015) | Idee | proprietär ([Blog](https://blog.camposanto.com/post/112703721804/this-blog-post-is-an-in-detail-explanation-of-part), [GDC](https://gdcvault.com/play/1022295/The-Art-of)) | Plakat: Verlauf + Scheibe + Hof + Horizont-Halo, Nebelverlauf je Tageszeit | – | Prinzip, steht schon in R13 |
| EmaceArt, Stylized Procedural Sky | Projekt (gratis) | **unklar** (Seite 403, [itch](https://emaceart.itch.io/stylized-procedural-sky-godot-skybox-shader)) | posterisierte Wolkenstufen 1–8, Schattenseite mit eigener Farbe | niedrig | Idee: Schatten als eigene Farbe statt Abdunkeln |
| SCENE.LOG (adrian-dev.fr) | Tutorial (three.js) | **unklar** ([Seite](https://adrian-dev.fr/en/posts/sky-moon-stars-threejs/)) | 7 Schlüsselbilder über 24 h, Billboard-Sonne und -Mond, Sterne mit Einblendschwelle | niedrig | Idee: jeder Stern hat seine eigene Schwelle |
| Kelvin van Hoorn, Aurora | Blog | **keine Angabe** ([Seite](https://kelvinvanhoorn.com/posts/aurora_polaris/)) | Raymarching zwischen zwei Kugelschalen | „quite performance heavy“ [Q] | nur Idee; zu teuer |
| Shadertoy | Code | Standard **CC BY-NC-SA 3.0** ([Terms](https://www.shadertoy.com/terms)) | – | – | **nicht verwenden**, außer der Autor setzt ausdrücklich MIT/CC0 in den Code |
| Veloren | Spiel | **GPL-3.0** ([LICENSE](https://gitlab.com/veloren/veloren/-/blob/master/LICENSE)) | Voxel | – | **nicht verwenden** (Copyleft würde unseren Code erfassen) |
| tinyskies | Spiel | **keine Lizenz** (GitHub: kein License-Eintrag, [Repo](https://github.com/dannylimanseta/tinyskies)) | Spielzeug-Look | – | nur Ideen (§3) |

godotshaders.com erlaubt je Shader CC0, MIT oder GPL-3.0. Bilder und Videos fallen nie unter die Lizenz ([Lizenzseite](https://godotshaders.com/license/)). Jeden Eintrag also einzeln prüfen.

---

## 3 · Was tinyskies gut macht, und wie wir es selbst erreichen

Die folgenden Punkte stammen aus R13 und aus Georgs Eindruck. Ich beschreibe nur Ideen, keine Werte.

1. **Ein großer, runder Sonnen-Lichthof**, der fast den halben Himmel aufhellt. Er ist weich, rund und warm, und er sitzt *über* dem Verlauf, nicht im Verlauf. → Bei uns: zwei additive Glockenkurven um die Sonne (eng und weit), deren Breite mit sinkender Sonne zunimmt (§4.2).
2. **Mutige Farbtonwanderung** vom Zenit zum Horizont: kühl oben, warm und fast gelb unten. Der Himmel bleibt nie bei „Blau → Weiß“. → Bei uns: Der Horizont jeder Stimmung bekommt einen eigenen Farbton mit Sättigung. R13 hat unseren Tag-Horizont als fast grau gemessen. Eigene Werte in §4.4.
3. **Wenige Stimmungen, sanft überblendet**: Tag, Abend, Nacht als vollständige Farbsätze. Mitgeblendet wird alles, auch Licht, Nebel und Wolkendeckkraft. → Bei uns: Farbsätze nach **Sonnenhöhe** statt nach Uhr, Mischung in OKLab (§4.3).
4. **Nebel aus dem Himmel**: Die Nebelfarbe stammt aus dem Verlauf. → Bei uns schon besser gelöst: Nebel = `skyColor(Blickrichtung)` [KFB].
5. **Signaturen statt Physik**: Sonnenstrahlen, ein bedrohlicher Mond, ein Regenbogen. Jede trägt eine Stimmung. → Bei uns: höchstens ein Signatur-Element je Stimmung (R13 H21).
6. **Was wir nicht übernehmen:** den Bildschirm-Verlauf als `scene.background`. Er kippt bei einer Bodenkamera mit (R13 H23). Und die additiven, halbtransparenten Wolken: Unsere Wolken sind Knete und opak.

---

## 4 · Konzept „Himmel R2“

**Leitsatz:** Der Himmel ist der weiche Teil des Bildes, das Gelände der harte (Georg: „harte Flächen plus weiche Verläufe, additiv“). R2 macht den Himmel deshalb nicht flächig. Er bekommt nur **drei harte Elemente**, die das Gelände spiegeln: die gemalten Wolken (gibt es schon), ein **Horizontband in der Dämmerung** und harte **Scheiben** (Sonne, Mond, Sterne). Alles Leuchten bleibt Verlauf und wird addiert.

### 4.1 Bausteine (Reihenfolge im Shader)
1. **Grundverlauf (weich):** Boden-Dunst → Horizont → Mitte → Zenit, wie `skyColor` heute [KFB]. Neu kommt der Kelvin-Gedanke dazu: Der Horizontdunst wird zur Sonne hin breiter und wärmer, abhängig von der Richtung zur Sonne und nicht nur von der Höhe. Das macht der „Cartoon-Verlauf quer“ in v2 schon im Ansatz [KFB].
2. **Farbflächen-Bänder (hart, nur Dämmerung):** Die Höhe für den Verlauf wird unterhalb von etwa 15° **in Stufen gerundet**. Die Stufenkanten wellen sich leicht (Rauschen nur über den Azimut, also billig). Weil jede Stufe ihre Farbe aus dem Grundverlauf holt, passen die Bänder immer zur Stimmung. Wie stark die Bänder wirken, steuert ein Regler `uBandK` (0 = weich). Das ist der 70er-Poster-Sonnenuntergang, und er spricht dieselbe Sprache wie die Fließfarben-Ränder im Gelände [V].
3. **Venusgürtel (optional, Gold/Blau):** Gegenüber der Sonne liegt ein rosa Band über einem graublauen Erdschatten. Das ist ein echtes Dämmerungsphänomen und als harte Kante sehr cartoontauglich [V].
4. **Sonnen-Baukasten:** harte Scheibe + optional ein harter, flacher „Hofteller“ (+3 L\*) + weicher Hof eng + weicher Hof weit. Alles wird addiert (Fläche plus Verlauf in einem Motiv).
5. **Gemalte Wolken** wie heute (`cloudLayer`, zwei Töne plus Saum) und die Wolkenkarten aus Wolken R1. Neu: Silberrand bei Gegenlicht (Alisavakis-Prinzip, CC0).
6. **Nacht:** harte Cartoon-Sterne in drei Größen; die hellsten 5 % als Vierzack. Jeder Stern hat eine eigene Einblendschwelle über die Sonnenhöhe. Sterne werden von Wolken verdeckt und unter 8° Höhe vom Dunst geschluckt. Der Knet-Mond bleibt [KFB]. **Polarlicht** als zwei flache Farbbänder (grün unten, violett oben) mit harter, welliger Unterkante und weichem additivem Ausklang nach oben. Der heutige Vorhang wird dafür umgestellt [KFB].
7. **Gegenlicht:** Steht die Sonne tiefer als 12° und schaut man in ihre Richtung, bekommt der Nebel einen Hof-Anteil (ferne Formen lösen sich im Licht auf). Wolken zeigen den Silberrand, Kanten im Gelände ein schmales Randlicht.

### 4.2 Eine Himmelsfunktion für Kuppel und Nebel
- Es bleibt bei **einer** GLSL-Funktion `skyColor(d, bandK)` [KFB-Prinzip, R13 H6]. Die Kuppel ruft sie mit `uBandK` auf, `applyAir` mit **0**. So bekommt das Gelände nie harte Nebellinien, und unter dem Horizont bleibt alles weich (Ferne R1). Bänder gibt es nur für `d.y > 0`.
- Der Hof steckt in `skyColor`. Deshalb leuchtet der Nebel vor der Sonne automatisch mit. Das ist der Gegenlicht-Effekt, ohne zweite Rechnung.
- **Option Himmels-LUT [V]:** `skyColor` ohne Scheiben und Wolken in eine kleine Textur backen (z. B. 128 × 64: Azimut zur Sonne × Höhe von −15° bis 90°), und zwar nur, wenn sich Stimmung oder Sonne um mehr als 0,5° ändern (Gedanke aus PlayCanvas: nur bei Änderung backen). Kuppel und Nebel lesen dann einen einzigen Texel. Das lohnt sich erst, wenn die Messung im Browser zeigt, dass `skyColor` im Geländeshader mehr als etwa 0,5 ms kostet. Läuft in r147 und r186 gleich (WebGLRenderTarget + ShaderMaterial).

### 4.3 Tageszeiten
- Farbsätze werden über die **Sonnenhöhe hS** gewählt, nicht über die Uhr: Nacht ≤ −10° · Blaue Stunde −10…−3° · Gold −3…+6° · Warm +6…+20° · Tag ≥ +20°. Dazwischen wird per Smoothstep gemischt, in **OKLab** (JS, einmal pro Bild). So bleiben Übergänge satt und laufen nicht über Grau.
- Ein Farbsatz enthält: Zenit, Mitte, Horizont, Bodendunst, Sonnenfarbe, Hofstärke, `uBandK`, `uLit`/`uShade` für Wolken, Lufttönung, Sterne und Polarlicht. Das Biom verschiebt Horizont und Lufttönung um 25 % zur `sky`-Rolle seiner Palette (R13, Sable).

### 4.4 Startwerte (eigene Vorschläge [V], im Browser abzunehmen)

| Satz | Zenit | Mitte | Horizont | Bodendunst | Sonne/Mond | Hof eng / weit | `uBandK`, Bänder |
|---|---|---|---|---|---|---|---|
| Tag | `#3d7cc9` | `#86bde6` | `#eef0cf` | `#cfd9c8` | `#fff1d6` | 0,30 / 0,10 | 0 |
| Warm | `#4675c0` | `#9cc3e0` | `#f6e2b0` | `#d8d2b8` | `#ffe2b0` | 0,38 / 0,14 | 0,3 · 1 |
| Gold | `#3e4a9a` | `#b56a92` | `#ffb16a` | `#c98a7c` | `#ffc27a` | 0,55 / 0,22 | 1,0 · 3 |
| Blaue Stunde | `#1f2a66` | `#5b4f99` | `#d98a8c` | `#6c5f86` | `#ff9a7a` | 0,40 / 0,18 | 0,7 · 2 |
| Nacht | `#0c1230` | `#1e2558` | `#3d3a7e` | `#252a52` | Mond `#c9d2ff` | 0,15 / 0,05 | 0 |

- **Verlaufshöhen:** Horizont 0°, Mitte 15°, Zenit ab 65°; Bodendunst 0° bis −10° (wie v2).
- **Bänder:** Kanten bei 3°, 7° und 13°. Wellung ±0,6° aus zwei Azimut-Oktaven (5 und 13 Wellen pro Umlauf) mit langsamer Drift. Die Kante ist ein Pixel breit (`fwidth`). Stufenkontrast Gold ≈ 5 L\*, Blau ≈ 3 L\*.
- **Sonne:** Scheibe mit Radius 1,6° (wirkt im Spiel besser als die echten 0,27°). Hofteller 9° hart, nur bei Gold und Warm. Hof eng ist eine Glocke mit σ ≈ 6°, Hof weit eine mit σ ≈ 28°. Beide werden mit `(1 + 0,8·(1 − smoothstep(0°, 25°, hS)))` breiter, je tiefer die Sonne steht.
- **Sterne:** Einblenden von hS = −4° bis −12°. Rasterdichte wie heute, Helligkeit in drei Stufen.
- **Polarlicht:** nur in der Nacht und in kalten Biomen, nur im Sektor gegenüber der Sonne, Unterkante 10–18°, höchstens 2 Bänder.
- **Kostenrahmen [V]:** Grundverlauf + Bänder + Hof + Sterne ≈ 1 Rauschaufruf pro Pixel, deutlich unter 1 ms auf dem Mac. Teuer bleiben nur Wolkenschichten und Polarlicht; beide lassen sich abschalten.

---

## 5 · Offene Fragen (an Georg/WS0)

1. **Bänder:** nur in der Dämmerung (mein Vorschlag) oder auch am Tag als sehr leichte Stufe, damit Himmel und Gelände immer dieselbe Sprache sprechen?
2. **Tageszeit:** echter Zyklus (welche Länge, z. B. 8–12 min) oder feste Stimmung je Level/Biom mit seltenen Wechseln?
3. **Code oder nur Ideen:** Dürfen wir CC0-Code (Alisavakis) und MIT-Code (Kelvin, Nugget8) direkt portieren, mit MIT-Vermerk in einer `THIRD_PARTY.md`? Oder bauen wir alles nur nach Beschreibung? CC BY 4.0 (paddy-exe/MinionsArt) würde ich meiden.
4. **R13-Tabellen:** Sollen die abgeschriebenen tinyskies-Werte aus R13 entfernt oder als „nur Analyse, nicht verwenden“ markiert werden?

---

## Quellen

- Alisavakis, Sky shader (CC0): https://halisavakis.com/my-take-on-shaders-sky-shader/ · Firewatch-Nebel: https://halisavakis.com/my-take-on-shaders-firewatch-multi-colored-fog/
- Kelvin van Hoorn: https://kelvinvanhoorn.com/tutorials/godot_skybox_shader/ · https://kelvinvanhoorn.com/tutorials/unity_skybox_shader/ · https://codeberg.org/KelvinvanHoorn/skybox-tutorial-godot (LICENSE, Zweig master) · https://codeberg.org/KelvinvanHoorn/skybox-tutorial-unity (LICENSE, Zweig main) · Aurora: https://kelvinvanhoorn.com/posts/aurora_polaris/
- Nugget8: https://github.com/Nugget8/Three.js-Ocean-Scene
- godotshaders: https://godotshaders.com/license/ · https://godotshaders.com/shader/cartoon-sky-shader/ · https://godotshaders.com/shader/stylized-sky-shader-with-clouds/ · https://godotshaders.com/shader/stylized-sky-with-procedural-sun-and-moon/ · https://godotshaders.com/shader/stylized-sky/ · https://godotshaders.com/shader/stylized-skyshader/
- krzmig: https://github.com/krzmig/godot-simple-sky-project · paddy-exe: https://github.com/paddy-exe/GodotStylizedSkyShader · Josephy5: https://github.com/Josephy5/Stylized-Skybox · MinionsArt: https://www.patreon.com/minionsart/posts/making-stylized-27402644 · danielshervheim: https://github.com/danielshervheim/unity-stylized-sky
- three.js: https://raw.githubusercontent.com/mrdoob/three.js/r147/examples/jsm/objects/Sky.js · https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/objects/Sky.js · https://github.com/mrdoob/three.js/releases/tag/r186
- Babylon: https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/skyMat · https://github.com/BabylonJS/Babylon.js/blob/master/license.md
- PlayCanvas: https://github.com/playcanvas/engine/pull/9765 · https://github.com/playcanvas/engine/pull/9772 · https://github.com/playcanvas/engine/blob/main/LICENSE
- pmndrs/sky: https://github.com/pmndrs/sky/blob/main/README.md · Sky3D: https://github.com/TokisanGames/Sky3D · Tw1ddle: https://github.com/Tw1ddle/Sky-Shader
- Firewatch: https://blog.camposanto.com/post/112703721804/this-blog-post-is-an-in-detail-explanation-of-part · https://gdcvault.com/play/1022295/The-Art-of
- EmaceArt: https://emaceart.itch.io/stylized-procedural-sky-godot-skybox-shader · SCENE.LOG: https://adrian-dev.fr/en/posts/sky-moon-stars-threejs/ · Ghibli/three.js (Lizenz unklar): https://danieljohnmorris.com/writing/ghibli-shader-parallax-scene/
- Shadertoy-Lizenz: https://www.shadertoy.com/terms (Seite 403; Standardlizenz laut Suchauszug und vispy-Issue https://github.com/vispy/vispy/issues/1672) · Veloren: https://gitlab.com/veloren/veloren/-/blob/master/LICENSE
- tinyskies: https://github.com/dannylimanseta/tinyskies · Art Lozzi (Farbtheorie, große Primärflächen, getrennt durch Neutraltöne): https://johnkstuff.blogspot.com/2006/11/color-theory-art-lozzi-interview-early.html
- Nicht erreichbar oder nicht gelesen: deepwiki zu tinyskies (429), EmaceArt-Seite (403), Shadertoy-Terms (403). Bei Josephy5 war der genaue Text der THIRD-PARTY-Datei nicht abrufbar.

---

## Zusammenfassung

- Ergebnis: `/Users/georgvonwestphalen/kfb-ws1/research/himmel/HIMMEL_R2_RECHERCHE.md`
- Basis: **Alisavakis Sky-Shader (CC0)** und **Kelvin van Hoorn Skybox (MIT)**; dazu **Nugget8 (MIT)** als three.js-Kostenbeleg. Code selbst in GLSL, läuft in r147 und r186.
- Physikalische Himmel (three `Sky.js`, Babylon, PlayCanvas: alle Preetham) passen nicht zum Look. `@pmndrs/sky` gibt es nur für WebGPU.
- Nicht verwenden: Shadertoy (CC BY-NC-SA), Veloren (GPL-3.0), tinyskies (keine Lizenz). paddy-exe/MinionsArt ist CC BY 4.0 bzw. unklar.
- R2-Konzept: weicher Grundverlauf + harte, gewellte Horizontbänder nur in der Dämmerung + Sonne als harte Scheibe mit weichem Doppelhof + Nacht mit Vierzack-Sternen und Polarlicht-Bändern.
- Eine Himmelsfunktion `skyColor(d, bandK)`: Die Kuppel bekommt Bänder, der Nebel nicht. Gegenlicht ergibt sich über den Hof im Nebel. Eine Himmels-LUT ist Option, falls die Messung es verlangt.
- Tageszeiten als 5 Farbsätze nach Sonnenhöhe, gemischt in OKLab; Startwerte sind eigene Werte (§4.4).
- Lizenz-Hinweis: R13 enthält abgeschriebene tinyskies-Werte, die nicht in den Code dürfen. In der Probe habe ich keine gefunden.
- Offen: Bänder auch am Tag? Zykluslänge? Code portieren oder nur nachbauen? Was passiert mit den R13-Tabellen?
