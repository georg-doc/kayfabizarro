# Wolken R1 – Recherche: vorbeiziehende Cartoon-Wolken mit Volumen

Stand 20.10.2026 · Auslöser: Georg 21.10. („wie Formen, die wir verschieben, und eingefärbte Flächen“) · Bezug: `probe/gelaende-probe.public.html`, `cloudLayer()` (Kuppel-Malweise)
Kennzeichnung: **[belegt]** = Quelle gelesen oder in Suchauszügen bestätigt · **[Vermutung]** = eigene Ableitung oder keine belastbare Quelle gefunden.

## 1. Kurzfassung

Keines der untersuchten Stil-Spiele baut nahe Wolken als Rauschmuster auf einer Ebene. Nahe Wolken sind dort **Einzelobjekte**: Karten (Billboards) mit eingebackener Licht-Information (Genshin, BotW, Harris-Impostor) oder Meshes mit gefälschter Volumen-Beleuchtung (Sea of Thieves). Der Fake-Eindruck bei uns hat drei Gründe. Erstens kommt der Lichtton aus einem seitlich versetzten 2D-Rauschwert, also aus keiner Form. Zweitens fehlt den Wolken eine Unterkante und eine Silhouette, die sich mit dem Blickwinkel ändert. Drittens bewegt sich alles starr im Gleichtakt. **Empfehlung:** Die Kuppel bleibt der Hintergrund. Davor kommen **20–40 einzelne „Wolkenkarten“ (Stufe 1)**. Jede Karte trägt pro Pixel einen Abstand zum Rand (SDF) und eine Höhe. Daraus entstehen dieselben zwei Töne (`uLit`/`uShade`), dieselbe harte Schnittkante und die dunklere Randlinie wie auf der Kuppel. Wachsen und Zerfasern laufen über die Schwelle der SDF. Der Ansatz ist Genshins Kartenwolke (Kanäle: Licht/Schatten, Randlicht, SDF-Auflösung), ohne Unschärfe-Pass. Mit Alpha-Test, Dither-Fade und Instancing (1 Draw-Call) sollte das auch bei 15–25 fps auf dem Mac tragen **[Vermutung, im Browser zu messen]**. Stufe 2 (Mesh-Wolken mit übertragenen Normalen) ist der Weg, falls man nah um die Wolken herum oder durch sie hindurch fliegen soll. Raymarching (Stufe 3) ist für unser Budget zu teuer.

## 2. Technik × Beispiel

| Technik | Beispiel | Wie es funktioniert | Warum es „echt“ wirkt | Kosten im Browser | Quelle |
|---|---|---|---|---|---|
| **Kartenwolke mit Kanälen** (Billboard, gemalte oder prozedurale Textur) | Genshin Impact, Honkai Impact 3 | Textur pro Wolke: R = Licht-/Schattenzone, G = Randlicht, B = SDF für Auflösen, A = Alpha. Randlicht richtet sich nach `dot(lightDir, normal)` und wird mit dem Sonnenstand per `smoothstep` stärker oder schwächer. Drei Kartenschichten (Horizont, gegenläufig, oben). Auflösen per SDF-Schwelle von außen nach innen | Licht und Form gehören zur selben Wolke; Rand leuchtet gegen die Sonne; die Wolke verschwindet als Form, statt zu verblassen | niedrig: 1 Quad pro Wolke, 1–2 Texturzugriffe; Overdraw ist der Hauptkostenfaktor | [belegt, Sekundärquellen] CSDN/Zhihu (Seiten gesperrt, Inhalt aus Suchauszügen), votizlov/2d_clouds |
| **Animierte Billboards plus Flowmap** | Zelda BotW, TotK | Wolken als Billboards (in Analysen an der Parallaxe nachgewiesen), animiert; weit entfernt eine statische Ersatztextur | Bewegung im Bild statt starrer Verschiebung; Ersatztextur nur dort, wo man keine Parallaxe sieht | niedrig bis mittel | [belegt, Community-Analyse] ResetEra, GamingBolt |
| **Flowmap-Verzerrung** | Apex Legends Storm Point (Himmel), BotW-Effekte | Textur mit Geschwindigkeitsvektoren verschiebt die UVs; zwei Phasen, um 0,5 versetzt und überblendet, ergeben eine nahtlose Schleife | Formen quellen und ziehen sich, statt zu gleiten | sehr niedrig: +1 Texturzugriff | [belegt] Vlachos/Valve 2010, Catlike Coding, Stylized Station |
| **Mesh-Wolke mit Okklusions-Lobe, Blur und Distortion** | Sea of Thieves | Meshes (u. a. per L-System erzeugt), Lichtverhalten pro Vertex vorberechnet; in einen eigenen Puffer gerendert, Viertelauflösung, RGB per Gauß-Blur, Tiefe im Alpha per Box-Blur, Distortion-Map, Rauschmischung nach Abstand; Wolkenfeld um den Spieler gewickelt und vom Wind versetzt | echte 3D-Silhouette, Unterseite dunkel, beliebige Formen (Totenkopf, Schiff) | mittel: Offscreen-Pass plus Blur. Der Blur widerspricht unserer harten Kante; das Wickeln ums Feld lässt sich übernehmen | [belegt] Kozin GDC 2019, Ang et al. SIGGRAPH 2018, maajor-Nachbau |
| **Mesh mit Vertex-Verformung** | Sea of Thieves Sturmwolken | Polygonmesh, verdrillt, dreht sich langsam, Vertex-Displacement läuft mit; Blitze als Vertex-Licht | lebendige Masse ohne Partikel | niedrig | [belegt, Forum] realtimevfx |
| **Impostor aus Partikelwolke** | Flugsimulatoren (Harris/SkyWorks) | Wolke aus vielen Partikeln, Licht vorberechnet; als Billboard-Bild zwischengespeichert, neu erzeugt erst bei zu großem Winkelfehler | hunderte Wolken bei hoher Bildrate, Parallaxe bleibt korrekt | niedrig zur Laufzeit, Neuerzeugung kostet | [belegt] Harris GDC 2002 |
| **Nah-Ausblendung in einer Kugel um die Kamera** | Indie (Godot), allgemein | `alpha *= smoothstep(inner, outer, distance(cam, pos))`, mit Alpha-Hashing als Dither | keine „Wand aus weißen Kästen“ beim Durchfliegen | praktisch kostenlos (gemessen auf Iris Xe) | [belegt] PEH-board #305 |
| **Zwei verformte Ebenen (Ober-/Unterseite)** | Godot „Stylized Cloudy Sky v2“ | zwei unterteilte Ebenen, Höhe per zweifachem Rauschen verschoben, Pixel ober- bzw. unterhalb einer Schwelle verworfen | Wolkendecke mit Dicke; man kann darüber und darunter fliegen | niedrig bis mittel (Vertexzahl) | [belegt] godotshaders |
| **Raymarching, stilisiert** | Horizon, Ghost of Tsushima, Fortnite Ch4 (UE5-Volumenwolken); Stil-Demos | Dichte aus FBM oder SDF, Beer-Lambert, Henyey-Greenstein; Stilisierung über Farbstufen | echtes Volumen, Durchflug | hoch: three.js-Demo 60 fps auf GTX 1060, aber 11–20 fps auf RTX 2080 laut Nutzern; Fortnite rendert die Wolken in niedriger Auflösung und skaliert hoch | [belegt] Maxime Heckel, three.js-Forum, Epic-Blog, gameidea |
| **Wolkenschatten am Boden** | Genshin Impact | große dunkle Rauschtextur in Weltkoordinaten über das Gelände geschoben | Wolken „sind da“, weil das Gelände reagiert | sehr niedrig: 1 Zugriff im Terrain-Shader | [belegt] Stylized Station |

Ohne belastbare Technik-Quelle: Sky: Children of the Light (Wolkenmeer als verformtes Mesh nur in einem Suchauszug; ein Unity-Tool, das von Sky inspiriert ist, nutzt geformte SDF-Raymarch-Wolken), Wind Waker (nur: viele verschiedene gemalte Wolken-Sprites statt einer einzigen), Journey, Tiny Glade, A Short Hike, Firewatch (nur der Himmelsverlauf ist dokumentiert), Mario Odyssey, Ni no Kuni, Pokémon, Fortnite vor Ch4. Hier also **[Vermutung]**: Für Nintendo-Wolken in Odyssey und Kirby liegt Mesh plus Toon-Shading nahe.

## 3. Warum unsere Wolken fake wirken, und was dagegen belegt ist

| Ursache (bei uns) | Gegenmittel | Beleg |
|---|---|---|
| **Licht ohne Form.** Der Schattenton kommt aus `n2` = Rauschen, um `uSunDir.xz` versetzt. Das ist ein 2D-Relief und kennt kein Oben und Unten. Auf der fernen Kuppel fällt das nicht auf, nah schon | Licht aus einer **Form-Größe**: SDF-Gradient als Pseudo-Normale (Karte) oder echte bzw. übertragene Normale (Mesh); Unterseite immer im Schattenton | Genshin R-Kanal, Harris, SoT-Lobe |
| **Keine Silhouette, die sich mit dem Blick ändert.** Ebene oder Kuppel: Die Form verzerrt sich, statt sich zu drehen (daher „verschmiert/gestreckt“) | Einzelobjekte mit eigener Lage im Raum; Billboard nur um die Y-Achse drehen, damit die flache Unterkante waagrecht bleibt | BotW-Parallaxe, SoT-Meshes |
| **Starres Verschieben im Gleichtakt** | Pro Wolke eigene Geschwindigkeit; Formwandel über SDF-Schwelle (Wachsen/Schrumpfen), Flowmap oder Rauschversatz (Zerfasern am Rand); Feld um den Spieler wickeln | Genshin-SDF, Vlachos, SoT-Wind-Wrap |
| **Keine Unterkante, keine Haufenform** | flacher Boden, gewölbte Kuppen; Unterseite dunkler | Harris (Partikelform), SoT-Formen; Ghibli-Lehrstoff **[Vermutung, nur Videos]** |
| **Knet-Puffs „knubbelig“.** Jede Kugel hat ihre eigene Licht-/Schatten-Grenze | Normalen einer umhüllenden Form auf alle Puffs **übertragen** (Foliage-Trick „Normal Transfer“) → eine gemeinsame Grenze | aVersionOfReality (Custom Normals, Halbkugel → Blätter) |
| **Gleiche Kontraste in jeder Entfernung** | Abstand mischt zur Horizontfarbe (`skyColor(d)`), ferne Wolken kleiner und blasser; nah Dither-Fade | Harris, PEH-board #305 |
| **Wolken greifen nicht in die Welt** | Wolken vor und hinter Bergen (Tiefentest an, `depthWrite` an bei Alpha-Test); Wolkenschatten am Boden | Genshin-Schatten |
| **Kein Gegenlicht** | Randlicht (Silberrand), wenn die Sonne hinter der Wolke steht: schmales helles Band in der SDF-Randzone | Genshin G-Kanal, CK42BB („silver linings“) |

## 4. Bauvorschlag in drei Stufen

**Gemeinsam für alle Stufen:** Die Kuppel bleibt unverändert (Ebene 1, `orig`), die Zusatzebenen 2/3 fallen weg. Neue Wolken nutzen exakt `uLit`, `uShade`, `uShade*0.82` für den Rand und die Kantenbreite über `fwidth`. Wie bisher ein harter Schnitt mit `smoothstep(th, th+fw)`, Alpha-Test statt Blending (kein Sortieren, kein Overdraw-Blending), Ausblenden per Dither (geordnetes Bayer-Muster, passt zum Cartoon-Look) oder `alphaToCoverage` mit MSAA. Für r147 und r186 gleich: `InstancedMesh` und `ShaderMaterial` gibt es in beiden Versionen.

### Stufe 1 – Wolkenkarten mit SDF (günstig, empfohlen)
- **Bau:** Beim Start 6–8 Wolkenformen einmal in einen `WebGLRenderTarget`- oder Canvas-Atlas backen (z. B. 4×2 Kacheln à 256²). R = SDF (Vereinigung von 3–6 Kreisen, unten flach abgeschnitten, mit FBM verzerrt), G = Pseudo-Höhe (Wölbung). Zur Laufzeit 20–40 Instanzen auf 1–3 Höhenbändern, als Y-Achsen-Billboards, Feld um den Spieler gewickelt wie bei SoT.
- **Licht:** Pseudo-Normale aus dem Gradienten von G (`dFdx`/`dFdy` oder Nachbar-Samples) plus „nach oben“-Anteil, dann `step(dot(N, sun) …)` → zwei Töne. Unteres Drittel fest im Schattenton. Randzone `th…th+0.03` im Kantenton wie auf der Kuppel. Silberrand: schmales `uLit*1.15`-Band auf der sonnenabgewandten Kartenseite, nur bei Gegenlicht.
- **Leben:** `th` pro Wolke langsam mit Sinus/Rauschen bewegen → wächst und schrumpft; billiger Rauschversatz in UV nur an der Randzone → zerfasert; beim Erscheinen und Verschwinden `th` hochfahren statt Alpha.
- **Tiefe:** Größe und Kontrast nach Abstand staffeln, Mischung zur Horizontfarbe, Dither-Kugel um die Kamera (Radius ~1–2 Wolkenbreiten), Tiefentest gegen Gelände.
- **Was man sieht:** einzelne Haufenwolken mit flachem Boden, Schattenunterseite und Kuppelkante, die beim Vorbeiflug sauber parallaxieren und sich langsam verformen. Grenze: Direkt unter oder über einer Karte sieht man die Kante. Gegenmittel: Blickwinkel-Fade oder Flughöhe meiden.
- **Kosten [Vermutung, messen]:** 1 Draw-Call, 2–3 Texturzugriffe pro Pixel, nur bedeckte Pixel zahlen. Meist günstiger als die bisherigen zwei Zusatzebenen, die je zwei 4-Oktaven-FBMs über den ganzen Himmel rechnen.

### Stufe 2 – Mesh-Wolken mit übertragenen Normalen (mittel)
- **Bau:** pro Formtyp ein zusammengefügtes Mesh aus 4–8 Ikosphären (insgesamt ~1–3 k Dreiecke). Normalen beim Laden von einer umhüllenden, unten abgeflachten Ellipsoid-Form übernehmen. Ränder per Rausch-Alpha-Test im Objektraum ausfransen. Optional: Inverted-Hull-Kontur im Kantenton.
- **Licht und Leben:** Toon-`step` auf `dot(N, sun)` mit denselben Tönen; Vertex-Displacement mit langsamem 3D-Rauschen (Quellen), Schwelle des Rand-Alphas animiert (Zerfasern). Kein SoT-Blur, sonst geht die harte Kante verloren.
- **Was man sieht:** echte Silhouette von allen Seiten, auch beim Umfliegen und Unterfliegen; Knet-Anmutung ohne „Knubbel“.
- **Kosten:** opak und instanziert, Vertexlast moderat; Schattenwurf aufs Gelände nur optional (sonst Wolkenschatten wie Genshin über Rauschen).

### Stufe 3 – Stilisiertes SDF-Raymarching in Begrenzungsboxen (aufwendig)
- **Bau:** Geformte SDF-Wolken (wie das Sky-inspirierte Tool), nur innerhalb der Box marschieren, halbe oder Viertelauflösung, Blue-Noise-Startversatz; Licht in zwei Stufen quantisiert, Kante aus der Dichteschwelle.
- **Was man sieht:** echtes Volumen, Durchflug möglich.
- **Kosten:** hoch. Die three.js-Belege zeigen 11–20 fps schon auf starken GPUs, bei uns am Mac also nur als einzelne „Heldenwolke“ denkbar. **Nicht empfohlen** für den aktuellen Budgetdruck.

**Zusatz (alle Stufen, sehr billig):** Wolkenschatten am Boden über dasselbe Rauschfeld wie die Kuppel, in Weltkoordinaten in den Terrain-Shader projiziert. Das verbindet Himmel und Gelände am stärksten pro Millisekunde **[Vermutung, Genshin-Prinzip belegt]**.

## 5. Quellen

- Kozin, *Sea of Thieves: Tech Art and Shader Development*, GDC 2019 – https://vimeo.com/326413164
- Ang et al., *The Technical Art of Sea of Thieves*, SIGGRAPH 2018 Talks – https://dl.acm.org/doi/pdf/10.1145/3214745.3214820 (PDF 403; Details aus Suchauszügen)
- maajor, Nachbau der SoT-Wolken – https://github.com/maajor/Mesh-Cloud-Rendering
- realtimevfx, SoT-Sturmwolken – https://realtimevfx.com/t/question-about-storm-clouds-in-sea-of-theives/5163
- Stylized Station, Thread „How clouds work in video games“ – https://threadreaderapp.com/thread/1659208008491208704.html
- Genshin-Kartenwolken (Kanäle R/G/B/A, SDF-Auflösen, Randlicht) – https://blog.csdn.net/qq_41835314/article/details/128450567 · https://blog.csdn.net/qq_41835314/article/details/128975630 · https://zhuanlan.zhihu.com/p/637947850 · https://zhuanlan.zhihu.com/p/660806535 (alle gesperrt, Inhalt aus Suchauszügen)
- votizlov, Genshin-Wolken-Nachbau in URP – https://github.com/votizlov/2d_clouds
- Genshin-Renderanalyse – https://habr.com/en/articles/874866
- BotW-Technikanalyse (Community) – https://www.resetera.com/threads/zelda-breath-of-the-wild-the-technical-analysis.8197/
- TotK-Grafikanalyse – https://gamingbolt.com/the-legend-of-zelda-tears-of-the-kingdom-graphics-analysis-how-big-of-a-leap-is-it
- Wind-Waker-Sprites – https://simonschreibt.de/gat/zelda-wind-waker-hyrule-travel-guide/
- Vlachos, *Water Flow in Portal 2*, SIGGRAPH 2010 – https://cdn.akamai.steamstatic.com/apps/valve/2010/siggraph2010_vlachos_waterflow.pdf
- Catlike Coding, Texture Distortion – https://catlikecoding.com/unity/tutorials/flow/texture-distortion/
- Harris, *Real-Time Cloud Rendering for Games*, GDC 2002 – https://markmark.net/PDFs/RTCloudsForGames_HarrisGDC2002.pdf · http://www.markmark.net/clouds/
- Nah-Ausblendung um die Kamera – https://github.com/starfoxcom/PEH-board/issues/305
- Custom-Normals- und Normal-Transfer-Workflow – http://www.aversionofreality.com/blog/2022/4/21/custom-normals-workflow
- Godot Stylized Cloudy Sky v2 – https://godotshaders.com/shader/stylized-cloudy-sky/ · Stylized Spatial Clouds – https://godotshaders.com/shader/realistic-spatial-clouds/
- three.js: CK42BB procedural clouds (Raymarch/Mesh/Billboard, Silberrand) – https://github.com/CK42BB/procedural-clouds-threejs · Maxime Heckel – https://blog.maximeheckel.com/posts/real-time-cloudscapes-with-volumetric-raymarching/ · three.js-Forum „volumetric clouds – game ready“ (fps-Werte) – https://discourse.threejs.org/t/volumetric-clouds-game-ready/86598 · @takram/three-clouds – https://www.npmjs.com/package/@takram/three-clouds · Codrops-Sprite-Wolken – https://tympanus.net/codrops/2020/01/28/how-to-create-procedural-clouds-using-three-js-sprites/ · mrdoob-Wolkendemo (zusammengefügte Billboards) – https://github.com/mrdoob/three.js/issues/2142
- Epic, UE 5.1 in Fortnite Ch4 – https://www.unrealengine.com/blog/battle-testing-unreal-engine-5-1-s-new-features-on-fortnite-battle-royale-chapter-4
- Stilisiertes Raymarching (Godot) – https://gameidea.org/2025/01/22/making-a-stylized-sky-shader-with-volumetric-clouds/
- Sky-inspiriertes SDF-Wolken-Tool – https://discussions.unity.com/t/wip-sdf-raymarching-tool-shaping-clouds/810237 · *Art of Sky*, GDC 2020 – https://gdcvault.com/play/1026903/Art-of-Sky-Children-of
- Firewatch-Himmel – https://blog.camposanto.com/post/112703721804/
- A Short Hike (keine Wolkentechnik dokumentiert) – https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/
