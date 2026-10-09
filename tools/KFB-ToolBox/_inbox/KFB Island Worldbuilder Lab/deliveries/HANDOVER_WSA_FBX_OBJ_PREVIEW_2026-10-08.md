# KURZAUFTRAG · WSA-Work · Asset Library: 3D-Vorschau auch für FBX und OBJ · 2026-10-08

**Ziel:** Modelle, die nur als FBX oder OBJ+MTL vorliegen, sind in der Asset Library genauso drehbar zu sehen wie GLB und glTF. Anlass ist das Quaternius Ultimate Nature Pack (150 FBX, 150 OBJ, kein GLB). Viele Kenney- und Quaternius-Pakete im Repo haben dasselbe Problem.

**Weg:** keine Konvertierung im Repo. Die Library lädt die Dateien im Browser mit den three.js-Loadern `FBXLoader`, `OBJLoader` und `MTLLoader`, über dieselbe Vorschau wie bei GLB (`preview3d.js`, `thumb3d.js`, `framing3d.js`).

**Drei Stolperfallen, schon gemessen:**
1. **Einheiten:** Quaternius-FBX sind in Zentimetern (Laubbaum 248 hoch). Die Vorschau rahmt nach Bounding-Box. Bitte zusätzlich die echte Höhe in Quell-Einheiten anzeigen und nicht stillschweigend normieren.
2. **Farben zu dunkel:** Quaternius-FBX speichern Blenders *lineare* Diffusfarbe, `FBXLoader` liest sie als sRGB und dunkelt sie ein zweites Mal ab. Die Bäume wirken dann fast schwarz.
   - Korrektur: einmal `material.color.convertLinearToSRGB()`, wenn die Datei aus Blender stammt (FBX-Header „Blender“ oder Quaternius-Pfad).
   - Gegenprobe ist die `Preview.jpg` im Paket.
3. **OBJ-Begleitdateien:** Die `.mtl` liegt neben der `.obj`, gleicher Name. Texturpfade in der MTL relativ zur MTL auflösen. Fehlt die MTL, wird grau angezeigt, ohne Fehler.

**Weiter beachten:**
- Mehrere Formate desselben Modells (FBX, OBJ, BLEND) als *ein* Eintrag mit Formatwahl anzeigen, wenn die Registry das hergibt. Sonst bleiben es drei Einträge, aber gruppiert.
- `.blend` bleibt ohne Vorschau (Hinweis „nur in Blender“).
- Große FBX (> 20 MB) erst nach Klick laden, nicht in der Übersicht.

**Abnahme (Georg):** In der Library „CommonTree_Autumn_1“ suchen. Die FBX-Vorschau zeigt einen orange-braunen Herbstbaum in den Farben der `Preview.jpg`, drehbar, mit Höhenangabe. Dasselbe mit einer OBJ und einem Kenney-FBX. GLB-Vorschauen funktionieren unverändert.

**Nicht machen:** keine konvertierten Kopien ins Repo schreiben, keine zweite Vorschau-Engine, Registry-Schema nur ergänzen.
