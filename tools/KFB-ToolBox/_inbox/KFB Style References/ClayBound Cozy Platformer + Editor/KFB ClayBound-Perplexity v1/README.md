# KFB Clay Lab — Blender + Three.js Lookdev Demo

Eine lokale Three.js-Testszene für einen **matten, handgeformten Knet-/Claymation-Look**: weiche Geometrie, mehrskalige Surface-Variation, dezente Geometrie-Deformation und weiches Licht.

## Start

Diese Demo ist ein ES-Module-Projekt und muss über einen lokalen Webserver laufen (nicht per `file://`).

```bash
cd kfb_clay_demo
python -m http.server 8080
```

Danach `http://localhost:8080` öffnen.

Alternativen: VS Code **Live Server**, `npx vite`, oder jeder andere statische Server.

## Struktur

- `index.html` — UI, Palette und einklappbare Produktionsnotizen.
- `style.css` — das weiche Knetgummi-UI.
- `main.js` — Testszene, PBR-Licht und ein `MeshStandardMaterial` mit Clay-Erweiterung via `onBeforeCompile`.

## Bedienung

- Ziehen: Orbit-Kamera.
- Scrollen: Zoom.
- Palette-Icon: Farb-/Relief-Controls an/aus.
- Gehirn-Knet-Icon: Recherche, Pipeline und LLM-To-dos an/aus.
- Neue Knetmischung: andere Seeds und Objektfarben.

## Design-Entscheidung

Der Shader vermeidet ein wiederholtes, fotorealistisches Fingerabdruck-Decal. Stattdessen kombiniert er:

1. **Breites Vertex-Displacement** für leicht gedrückte Formen.
2. **Mittelfrequente Variation** für organische Unebenheit.
3. **Feines Grain + Roughness-Variation** für eine matte, ungleichmäßig geknetete Oberfläche.
4. **Objektseeds**, damit identische Geometrien nicht dieselbe Musterphase zeigen.

Für Hero-Assets bleibt Modellierung entscheidend: Bevel/Subdivision/Sculpt erzeugen die wichtigen Silhouetten. Der Shader ergänzt die Haptik, ersetzt aber keine gute Form.

## Blender → GLB

1. Modellmaßstab anwenden (`Ctrl+A > Scale`).
2. Harte technische Kanten mit Bevel und ggf. Subdivision entschärfen.
3. Große Druckstellen/Falten in Geometrie sculpten; Details zurückhaltend halten.
4. GLB exportieren; im Loader nach dem Laden `castShadow` / `receiveShadow` aktivieren.
5. Optional pro Hero-Asset gebackene Normal- und Roughness-Maps hinzufügen. Dazu den Clay-Shader nicht ersetzen, sondern Karten im Standardmaterial ergänzen.

## Produktion: nächste Schritte

- Die `clayMaterial()`-Factory in eure Materialbibliothek verschieben.
- `seed`, Farbe, Relief und Mikrostruktur als `userData` oder GLTF-Extras pro Asset speichern.
- Für Performance: Vertex-Displacement nur auf ausreichend dichten Hero-Meshes aktivieren; für Deko/Distanzobjekte ausschalten.
- Für mobile Hardware: Schattenauflösung auf 1024 setzen und Pixel Ratio auf 1.5 begrenzen.
- Referenz-Screenshots als Regression-Tests nutzen: Kamera, Licht und Materialparameter versionieren.

## Referenzen

- Three.js `ShaderMaterial` / Custom Shader API: https://threejs.org/docs/#api/en/materials/ShaderMaterial
- Three.js Materials Manual: https://threejs.org/manual/#en/materials
- Unity ShaderGraph Clay Shader (gut als Layering-Referenz): https://github.com/joebinns/clay
- Clay 001 PBR texture set: https://3dtextures.me/2021/09/01/clay-001/

Claybound ist das visuelle Ziel aus eurem Briefing; diese Demo rekonstruiert keinen fremden Code oder fremde Assets.
