# WSA · Szenen-Studie C · Licht R1 · 11.10.2026

**Recherche / Werte-Vorschlag · kein Bau, kein Lab-src.** Auftrag STEERING_REPLY_WSA_R2.md. R2 bleibt abgenommen und unverändert bis auf den geforderten Kopf-Verweis auf V-154. Licht-Vertrag: vorhandener EnvironmentHost/day-night.js, derselbe Lab-Rig; keine neue Lampe je Figur oder zweite Farb-/Lichtverwaltung.

Ergebnis: [light-presets.json](light-presets.json), Schema-Vorschlag `kfb.light-presets/1`. Jede Zahl ist Source-Code, Berechnung aus Source oder ausdrücklich ein **PROPOSED_ESTIMATE_NOT_GEORG_ACCEPTED**. Keine Lux-/GPU-/Live-Render-Messung. [Quellen und Hashes](WSA_LIGHT_STUDY_C_R1/SOURCE_MANIFEST.json); J17/TC1-Pfade und Zeilen referenzieren die bytegleich archivierten R1-Quellen. Quaternius-SOURCE-Dateien/Previews und private Creator-Frames werden nicht veröffentlicht.

## 1 · J17-Tageslicht / tatsächliche Richtung

| Wert | J17-Quelle |
|---|---|
| Sonne #fff4e6 /2,9 | track-look.v5.js:126 |
| Hemi Himmel #eef4fa, Boden #9a8a78 /1,05 | :128 |
| Gegenlicht #ffe6d6 /0,6 | :129 |
| Ausgabe sRGB /ACESFilmicToneMapping | :93 |
| Exposure-Override | in den gelesenen Zeilen nicht explizit gesetzt; kein gemessener Wert behauptet |
| Hintergrund canyon.sky #96bede /linearer Nebel700–1900 Source-m | :49,:473 |
| Sonne absoluteY260, x=ctr.x−160,z=ctr.z+120, Ziel=ctr | :442 |

**Korrektur zur alten Kurzstudie:** ctr ist nicht der Ursprung. track-look:294–295 bildet den Box-Mittelpunkt aller tatsächlichen Stream-p. Der echte J17-Overlay lädt p1b.v2 (J17 HTML:24–27); dessen SHA256 ist2eec607913380419117a9ee56359cc9e478e8a80ce00ce08b2641c22fa7fb309,8786 Proben.

Aus den p-Bounds: ctr.y29,998902932; relative Sonnenhöhe260−ctr.y=230,001097068, horizontale Entfernung200. Damit **Elevation48,991048421°**, Azimut **−53,130102354°** ab+Z. Gemeint ist Richtung **zum Licht**. 52,43° ist nur atan2(260,200) bei ctr.y0 und für diesen p1b-Stream falsch. [Rechenbeleg](WSA_LIGHT_STUDY_C_R1/J17_SUN_MEASUREMENT.json) enthält Bounds, Zentrum, Position und Hash; keine Pixel-Schätzung.

Die Source-Nebelentfernungen ergeben bei Track-m×1,46 die Lab-Vergleichswerte1022/2774. Das ist eine Umrechnung, keine pauschale Empfehlung für heutige Insel-/Organ-Sichtweite. Vorhandene Weltgrößen/Camera-Far und Himmel-Hook bestimmen die Umsetzung.

## 2 · Bestehendes Lab: Roh-Preset ist nicht wirksamer Rig

Source Lab_light (src/world/light.ts): state.world2,4 /ambient1,25 /exposure1 bei kfb-day. SkyRig skaliert bei seiner Erzeugung: Key=rawSun×2,4/5; Hemi=rawHemi×1,25/1,75; Fill=rawFill×(2,4×0,375)/1,75. Sun2/fill2/back/amb sind Sinks: **keine zusätzlichen Lichter**. Der Roh-ambientIntensity-Regler ist hier kein zusätzliches AmbientLight.

| Exterior-Default | Raw Sun /Hemi /Fill | Wirksam Key /Hemi /Fill |
|---|---|---|
| Day |5 /1,75 /1,75|2,4 /1,25 /0,9|
| Evening |3,5 /0,94 /0,875|1,68 /0,671428571 /0,45|

Quelle Lab_sky_presets DAY/EVENING; Formeln Lab_light skyRig. Day-Key-Richtung aus KEY_DIR(−120,180,90):50,194428908° Elevation,−53,130102354° Azimut. Lab ToneMapping nach skyOwned =Neutral, Exposure aus State. Kein automatisches Gleichsetzen mit r160-J17/ACES oder dem Source-Gegenlicht: der Lab-Fill kommt aus anderem Winkel.

Day-night.js:249–260 schreibt Preset-Basisfarben/-stärken in den vorhandenen Adapter; es bleibt der Background-/Fog-Schreiber (:262–273). Aktueller Tunnel-compose moduliert **denselben** Rig nach dem Sky-Schritt, kein zweiter unabhängiger Lichtzustand. Tatsächliche Slider, Hue/Tint, GroundTint und Tunnelanteil sind hier nicht live abgefragt; Tabelle gilt für gelesene Anfangsdefaults.

Nebel: Lab_sky:29–34 skaliert zunächst mitR/5 (R=halbe horizontale Stage-Ausdehnung), nicht fest320/760. Beim aktuellen Organ-Entry gibt Lab_main eine Far-Vorgabe camera.far×0,95; Far wird vom bestehenden Host passend skaliert. Wenn horizonHook aktiv ist, nimmt day-night die tatsächlich gezeigte Horizontfarbe statt Roh-fogColor. Deshalb ein orangefarbenes Roh-Preset nicht als gemessene aktuelle Nebelfarbe ausgeben. Kein neuer Fog-Schreiber im Vorschlag.

Ein **J17-Intensitäts-Vergleich** kann durch diesen Adapter mit rawSun6,041666667,rawHemi1,47,rawFill1,166666667 auf2,9/1,05/0,6 zielen (Source-Stärken /Adapterfaktoren). Diese Zahlen sind DERIVED_RECEIVER_VALUE, kein vollständiger J17-Rig-Port: Richtung, Fill-Ziel, ToneMapping, Fog und heutige Palette bleiben gesonderter Gleichstandsvergleich beim Lab.

## 3 · Abend TUNE (V-050): Zahlen und begrenzter Vorschlag

Aktueller Raw-Abend kombiniert orange Sonne#ffaa40, orange Hemi#ff9944, braunen Boden#554422 und warmbraunen Fill#cc8855. Zugleich fallen Exterior-Stärken gegenüber Day: Key−30%,Hemi−46,285714%,Fill−50%. Dadurch können dunkle Materialseiten und orange Lichtfärbung zusammen auftreten. Das ist eine Berechnung der Quellenwerte, keine gemessene Bildschirmhelligkeit.

### Source-Belege, keine fremden Engine-Werte als Three-Vorgabe
- **J17:** warmweißer Key#fff4e6 mit kühlem/neutralem Hemi#eef4fa und neutralem Boden#9a8a78 statt orange auf jeder Lichtrolle. Die vorhandenen J17-Bilder wurden bereits betrachtet; aus ihnen wird keine neue Intensität geschätzt.
- **KayKit:** vorhandenes tatsächlich gesehenes Creator-Tutorial „Basic Environment and Lighting Setup in Godot“,7:20/actual440,47826s, Inspector Ambient Energy0,75. Hintergrund und Ambient werden getrennt behandelt, Schattenkontakt und Vordergrund bleiben lesbar. Das ist **Godot Energy**, weder Three-Hemi-Wert noch Lux. Die Farmer-Preview wurde erneut betrachtet; sie liefert keine numerische Rig-Konfiguration. Beleg: bestehendes C_VIDEO_FRAME_CAPTURE.json, private Aufnahme video_441.jpg.
- **Quaternius:** bestehende Nature-Preview tatsächlich betrachtet; rig/camera/post der Marketing-JPEG nicht aus Pixeln ableitbar. Separate echte Unity-SOURCE-L_Overview-Szene: Directional weiß mitIntensity2, ColorTemperature5116K enabled (5530–5591), lokale Euler-Hints34,016/−30/0 (5592ff). Source-Profile: postExposure+0,2EV,contrast+7,saturation+10,bloomThreshold0,3/intensity0,8; Tonemapping-Enum2. Warmweiß und helle Schattenebenen sind belegte Quellenrichtung, keine Bestätigung, dass dieses Preset genau die Marketing-JPEG gerendert hat. Die Rock-Albedo enthält bereits gemalte Highlights/Dunklungen (Quater_shader_notes), die nicht als Lampenstärke kopiert werden dürfen.

### Kandidat E50 (Vorschlag, kein angenommenes Abend-Preset)
Ein einmaliger Testpunkt, **kein Reparatur-/Critic-Loop**: bei gleichem Material/Kamera/Exposure1 die Raw-Abend-Stärken halb zum vorhandenen Raw-Day bewegen. **Mix0,5 ist eine deklarierte Schätzung**, nicht ein Source-Sunsetwert. Sonne bleibt warm; Hemi/Boden/Fill übernehmen die bekannten J17-Neutralrollen.

| Eingabe E50 | Wert / Herleitung |
|---|---|
| raw Sun |4,25=(3,5+5)/2 → Key2,04 (+21,428571% gegen Abend)|
| raw Hemi |1,345=(0,94+1,75)/2 → Hemi0,960714286 (+43,085106%)|
| raw Fill |1,3125=(0,875+1,75)/2 → Fill0,675 (+50%)|
| Sun color |#ffd3ae = linear-sRGB-Mittel #ffaa40 /#fff4e6, danach auf sRGB8 gerundet|
| Hemi sky /ground |#eef4fa /#9a8a78 aus J17:128|
| Fill |#ffe6d6 aus J17:129, im Lab anderer Lichtwinkel|
| Exposure |1 aus bestehendem Default, während dieses Lichtvergleichs unverändert|

Das erhöht vorrangig die Füllung und verteilt Wärme auf den Key statt alle Rollen orange zu färben. **Noch kein Render-Beweis.** Sichtbarer Himmel, Nebel-Hook und Zeit bleiben im vorhandenen Owner; hier kein neuer Verlauf/Schreiber.

Quaternius+0,2EV liefert mathematisch2^0,2=1,148698355 als separaten Input-Gain-Vergleich. Unity-PostExposure/ACES und Three-Neutral-Exposure sind nicht identisch kalibriert. Nicht gleichzeitig auf E50 stapeln und nicht Bloom0,8/Saturation+10 ungeprüft übernehmen. Erst Lichtrollen vergleichen, dann bei gelocktem Licht optional die Exposure-Achse. Rückkehr zum bestehenden Abend bleibt möglich.

## 4 · TC1-Innenlicht: creme-rote Röhre

TC1:17–18: race_tube uses band/rim `[strang,cloud]`, rib=pad. J17-canyon:49–50 strang#ef5a22,cloud#f3e6cf. Die creme-rote Lesbarkeit kommt aus tatsächlichem Rollen-/Profilkontrast, gerollter Knetform und Hemi/Fill — keine neue Tunnel-Lackierung.

Lampenmaterial TC1:74: base#fff2c8,emissive#ffc15a,intensity2,2,roughness0,5. Lampen an Innenmodulen (:124–125) bilden rhythmische helle Landmarken. Im geprüften TC1-File kein PointLight-Verbraucher gefunden; Emission lässt den Kopf leuchten, beleuchtet in Standardmaterial allein nicht seine Umgebung. Keine fremde Dauerlampe je Figur.

**Heute im Lab:** TUN in Lab_light ist ein vorhandener neutral-warmer Tunnelmix, nicht ein WSA-Neubau: Hemi Himmel#fff1dc,Boden#e6c49c,hi=1,6×state.ambient; beiDefault1,25 ergibt2,0. Key×0,12,Fill×0,35; aus Day2,4/0,9 werden0,288/0,315. Tunnelpool4 Lampen, nearest Auswahl; Gain=1+2×tunnelWeight, bei1 also **×3, nicht ×2**. Quellen TUN/compose/skyRig/tunAt.

Lab_organ:232–235 übernimmt aktuelle TC1-Punkte alternativ zum O1-Licht:260×0,35×1,46²=193,9756 vor Gain, bei vollem Tunnel581,9268; Reichweite30×1,46=43,8lab bei diesen TC1-Punkten. Das sind vorhandene Code-Ableitungen mitDecay2, **keine Luxmessung oder empfohlenen Universalstärken**. Renderer-/Palette-/Input-Overrides können die tatsächliche Wirkung ändern.

Vorschlag: Source-TC1-Rollen/Emission und bestehenden begrenzten Pool behalten; neutral-warmer Hemi statt grüner Bodenfärbung, Sonne weich gedämpft. Weiße Lampen dürfen Creme/Rot/Fahrbahn nicht zur weißen Fläche überstrahlen. Receiving Lab prüft an derselben Szene Portal→Innen→Ausfahrt, Gesicht/Hand, Straße und dunkle Seite. Keine alte TC1-Bild-PASS-Zeile als neue aktuelle Innenlicht-Abnahme deklarieren.

## Übergabe / ein nächster Gate

[VALIDATION.json](WSA_LIGHT_STUDY_C_R1/VALIDATION.json): Quellenhashes/Zeilen, tatsächlicher p1b-Sonnenwinkel, Receiver-Ableitungen, lineare Farbmischung und ausdrücklich markierte E50-Schätzung geprüft. Keine Bilder generiert/neu veröffentlicht, keine Lab-Datei geschrieben, keine Runtime-/GPU-/Parity-Tests.

Steuerung prüft, ob J17-Day-Referenz und der **einzelne** E50-Comparison-Input ins vorhandene Lab-Profil übernommen werden sollen. Erst dann Receiver-Vorlagen-Zeile, gleicher sichtbarer Vergleich und Parity durch den Lab-Owner. E50 ist bis dahin Daten-Vorschlag, kein Golden oder Merge.
