Maßstabsinvariante prozedurale Knetfarben-Terrainübergänge in Three.js r186: Eine mathematische und architektonische Analyse  
Prozedurale Materialübergänge in stilisierten Echtzeit-3D-Anwendungen stehen vor der Herausforderung, visuelle Kantenstrukturen unabhängig vom Blickwinkel und der Kameraentfernung stabil zu halten \[cite: 1, 2\]. Im Kontext von Terrains für heterogene Untergründe wie Gras, Sand, Erde, Pflaster, Fels und Schnee wird zunehmend eine physisch greifbare, haptische Ästhetik gefordert \[cite: 3, 4\]. Das angestrebte Erscheinungsbild gleicht verkleckster Knetfarbe: Flecken und Punkte in drei diskreten Größenklassen, die bidirektional ineinander tropfen und von einer scharfen, plastisch verdickten Knetkante begrenzt werden \[cite: 3, 5\]. Graduelle Verläufe, Alpha-Transparenzen oder geometrisch gerade Trennlinien widersprechen diesem Design-Paradigma explizit.  
Die bisherige Implementierung über Schwellwertbildungen auf der Differenz zweier Gauß-Ball-Felder je Zelle über vier Zellgrößen (`kfbBlend`/`kfbLayer`) weist eine ausgeprägte Distanzabhängigkeit auf. Aus der makroskopischen Übersichtsperspektive erzeugt dieser Ansatz eine ansprechende Sprenkelverteilung. Wechselt die Perspektive jedoch in die direkte Lauf- oder Fahrhöhe, führt die perspektivische Verzerrung der Weltraum-Koordinaten dazu, dass die feinen Strukturen optisch zu großflächigen, homogenen Monolith-Blöcken verschmelzen \[cite: 2\]. Dieser Effekt, oft als „Shader-Höhenlogik“ bezeichnet, resultiert aus einer starren weltraum-basierten Frequenzberechnung ohne Bildschirmraum-Komensation \[cite: 2, 6\]. Die nachfolgende Untersuchung analysiert mathematische Verfahren zur maßstabsinvarianten Erzeugung stilisierten Terrain-Blends, bewertet bestehende Grafik-Pipelines und stellt drei vollständige TSL-Implementierungen (Three.js Shading Language) für Three.js r186 bereit \[cite: 7, 8, 9\].  
\--------------------------------------------------------------------------------  
1\. Techniken für stilisierte, handgemalte und gesprenkelte Terrain-Übergänge  
Das klassische Terrain-Rendering verwendet mehrkanalige Splatmaps, um Texturschichten linear miteinander zu verblenden \[cite: 10, 11\]. Um die dabei entstehenden unscharfen Übergangszonen zu vermeiden, wurde das höhenbasierte Blending entwickelt \[cite: 4, 11\]. Hierbei wird der Steuerwert der Splatmap mit einer detaillierten Höhenkarte der jeweiligen Textur multipliziert, woraufhin eine Schwellenwert-Operation die Grenzfläche definiert \[cite: 4, 12\]. Für stilisierte Knetfarben-Optiken erweist sich reines Höhen-Blending jedoch als unzureichend, da natürliche Textur-Höhenkarten hochfrequente, organische Gesteins- oder Halmstrukturen erzeugen, anstatt die runden, viskosen Tropfenformen flüssiger Knetmasse zu bilden \[cite: 3, 5\].  
Eine gezieltere Formgebung ermöglichen stochastische Punkt- und Scheibenmuster auf der Basis zellularer Rauschfunktionen \[cite: 13\]. Worley- beziehungsweise Voronoi-Konzepte berechnen den Abstand eines Fragments zu stochastisch verteilten Feature-Punkten innerhalb eines regelmäßigen Gitters \[cite: 13\]. Durch eine radiale Verformung der Abstandsmetrik und das Hinzufügen von anisotropem Domain-Warping lassen sich aus einfachen Kreiszentren unregelmäßige, flüssigkeitsähnliche Tropfenschemata generieren \[cite: 13\]. Poisson-Disk-Verteilungen bieten hierbei den Vorteil, dass sie über garantierte Mindestabstände zwischen den Feature-Punkten verfügen, wodurch ein visuell störendes Ineinanderkrachen benachbarter Flecken verhindert wird. In Echtzeit-Fragment-Shadern lassen sich Poisson-Muster durch gejitterte Zellgitter approximieren, deren Stempelradien prozedural variieren.  
Um das bidirektionale Tropfen in drei diskreten Größenklassen (Mikro, Meso und Makro) mathematisch zu beschreiben, werden drei asynchrone Frequenzen des zellularen Abstandsfeldes miteinander gekoppelt \[cite: 13\]. Die Makro-Ebene bestimmt die fundamentale Materialzuordnung der Terrainregion, während die Meso- und Mikro-Ebenen über invertierte Schwellenwerte feine Spritzer von Material A in Zone B und umgekehrt injizieren \[cite: 12\].  
                                 \+------------------------------------+  
                                  |   Makro-Ebene (Große Farbflecken)  |  
                                  \+-----------------+------------------+  
                                                    |  
                                                    v  
                                  \+-----------------+------------------+  
                                  |   Meso-Ebene (Grenzflächen-Tropfen)|  
                                  \+-----------------+------------------+  
                                                    |  
                                                    v  
                                  \+-----------------+------------------+  
                                  |   Mikro-Ebene (Feine Knetsprenkel) |  
                                  \+------------------------------------+

Anstelle klassischer bilineare Interpolationen können Dithering-Algorithmen und Bayer-Matrizen eingesetzt werden, um harte Quantisierungsgrenzen zu simulieren \[cite: 13, 14\]. Bei Stop-Motion- oder Claymation-Shadern wird zudem die Kantenregion eines Signed Distance Fields (SDF) mathematisch verändert \[cite: 3, 4, 5\]. Indem der Distanzwert kurz vor dem Übergangspunkt exponentiell angehoben wird, entsteht im Fragment-Shader ein plastischer Knetrandwulst, der durch einen leichten Schattenwurf die Illusion einer aufgetragenen Farbschicht verstärkt \[cite: 3, 4, 5\].  
\--------------------------------------------------------------------------------  
2\. Mathematische Grundlagen der Maßstabsinvarianz und Bildschirmraum-Verankerung  
Die Hauptursache für das Verschmelzen prozeduraler Muster bei geringer Kameradistanz liegt in der Diskrepanz zwischen Weltraum-Frequenz und Bildschirmraum-Auflösung \[cite: 2, 6\]. Nähert sich die Kamera der Oberfläche, deckt ein Bildschirm-Pixel einen projizierten Weltraum-Bereich ab, der exponentiell kleiner wird \[cite: 2\]. Wenn das prozedurale Rauschen an starr fixierte Weltkoordinaten gebunden ist, vergrößern sich die verklecksten Punkte auf dem Monitor proportional zur Annäherung, bis sie den gesamten Blickwinkel ausfüllen \[cite: 1, 2\].  
Bildschirmraum-Ableitungen zur Kantenstabilisierung  
Um knackscharfe Knetränder frei von Flimmern oder Treppenstufen (Aliasing) darzustellen, müssen die partiellen Bildschirmraum-Ableitungen des Grafikprozessors herangezogen werden \[cite: 6, 15, 16\]. Die GLSL- und TSL-Funktionen `dFdx` und `dFdy` ermitteln die Änderungsrate eines Signals zwischen benachbarten Fragmenten innerhalb des $2\times 2$\-Fragment-Rasters der GPU \[cite: 6, 10, 15, 16\]. Die Funktion `fwidth(p)` fasst diese Ableitungen zusammen \[cite: 6, 10, 15, 16\]:

$fwidth(p)=|\frac{\partial p}{\partial x}|+|\frac{\partial p}{\partial y}|$  
Wird ein mathematischer Schwellenwert $\tau$ auf ein Distanzfeld $D(uv)$ angewendet, erzeugt eine reine `step(\tau, D)`\-Funktion sichtbare Pixel-Rasterkanten \[cite: 17, 18\]. Durch die Kopplung von `smoothstep` an die lokale Ableitung `fwidth(D)` wird die Übergangszone exakt auf die Breite eines einzelnen Bildschirm-Pixels beschränkt \[cite: 17, 18\]:

$\Delta =fwidth(D)\cdot {w}_{user}$

$Maske=smoothstep(\tau -\Delta ,\tau +\Delta ,D)$  
Diese Operation garantiert, dass der Knetrand unabhängig von Betrachtungsabstand, Winkel und Bildschirmauflösung stets eine konstant scharfe Projektion im Bildschirmraum beibehält \[cite: 14, 17, 18\].  
Logarithmische Mehrskalen-Skalierung („Infinite Zoom“)  
Die Aufrechterhaltung der Punktform über extrem unterschiedliche Höhenstufen (von Übersichtshöhe bis Laufhöhe) erfordert eine dynamische Frequenzanpassung der Rauschfunktion \[cite: 1, 2\]. Eine kontinuierliche Anpassung der Zellgröße an die geometrische Entfernung \$d \= \\|\\mathbf{P}\_{\\text{camera}} \- \\mathbf{P}\_{\\text{world}}\\|\$ verhindert das Vergrößern der Sprenkel \[cite: 1, 2\].  
Um sichtbare Frequenz-Sprünge zu vermeiden, wird ein Oktave-Blending über den Logarithmus der Kameradistanz angewendet \[cite: 2\]. Der kontinuierliche Skalierungsfaktor $\lambda$ berechnet sich wie folgt:

$\lambda ={\log }_{2}\left({\frac{d}{{d}_{ref}}}\right)$  
\$\$\\text{octave}\_0 \= \\lfloor \\lambda \\rfloor, \\quad \\text{octave}\_1 \= \\text{octave}\_0 \+ 1, \\quad w \= \\text{fract}(\\lambda)\$\$  
Durch das Überblenden zweier benachbarter Rauschoktaven $N(p\cdot {2}^{octav{e}_{0}})$ und $N(p\cdot {2}^{octav{e}_{1}})$ mit dem Gewichtungsfaktor $w$ entsteht eine fraktale Struktur, die beim Verringern der Kameradistanz stufenlos neue Unter-Sprenkel generiert, während übergeordnete Flecken schrumpfen und aufgelöst werden \[cite: 1, 2\]. Die scheinbare Fleckengröße auf dem Bildschirm bleibt dadurch im statistischen Mittel konstant.  
\--------------------------------------------------------------------------------  
3\. Analyse bestehender Titel, Shadertoy-Konzepte und Clay-Engines  
Verschiedene kommerzielle Produktionen und Shader-Demos haben spezialisierte Ansätze entwickelt, um nicht-fotorealistische Materialoberflächen und prozedurale Terrains zu rendern \[cite: 3, 19, 20, 21\]. Die nachfolgende Markt- und Technologieübersicht stellt diese Ansätze vergleichend gegenüber.

| Spiel / Demo | Visuals & Stilrichtung | Technische Shader-Architektur | Eignung für Knetfarben-Anforderungen |
| ----- | ----- | ----- | ----- |
| **A Short Hike** | Retro-Pixelated, Toon-Shading \[cite: 18\] | Bildschirmraum-Pixelierung, Custom-Depth-Kanten, reduzierte Farbpalette \[cite: 1, 18\]. | Hohe Bildschirmraum-Stabilität, jedoch fehlende plastische Volumen-Eigenschaften an Übergängen \[cite: 1, 18\]. |
| **Tiny Glade** | Prozedurales Reet, Stein- und Gras-Blending \[cite: 19, 22\] | GPU-driven Rendering, Raymarching auf prozeduralen SDFs, Voronoi-Felder \[cite: 3, 5, 19, 22\]. | Bietet herausragende plastische Übergänge; erfordert jedoch komplexe Fragment-Schleifen \[cite: 3, 19, 22\]. |
| **Townscaper** | Illustratives Reißbrett, stilisierte Farbfelder \[cite: 20, 23\] | Triangular Grid, Wave Function Collapse, Vertexfarben-Blending mit harten Masken \[cite: 20, 23\]. | Sehr performant; Übergänge folgen jedoch den Mesh-Kanten und bieten keine Stochastik \[cite: 20, 23\]. |
| **Sable** | Ligne-Claire, flache Farbfelder, Wüsten-Sprenkel | Bildschirmraum-Dithering, Ink-Lines, Bayer-Matrizen zur Farbstufung. | Zeichnet saubere Grafik-Kanten, lässt aber die charakteristische Knetrand-Verdickung vermissen. |
| **Claybook** | Reines Plastilin, verformbare Welten \[cite: 3, 4, 5\] | 3D-Volumen-SDFs, GPU-Based Position Based Dynamics (PBD), Raymarching \[cite: 3, 4, 5\]. | Maximale visuelle Übereinstimmung; erfordert jedoch vollwertige SDF-Volumendatenbanken \[cite: 3, 4, 5\]. |
| **Shadertoy (Clay John / Fewes)** | Prozedurale Terrain-Erosion und Splatter \[cite: 21, 24\] | Analytische Gradienten, Phacelle-Noise, direkte `fwidth`\-Schwellwertbildung \[cite: 21, 24\]. | Exzellente mathematische Basis zur prozeduralen Generierung von Schwellenwert-Masken \[cite: 21\]. |

\--------------------------------------------------------------------------------  
4\. Performance-Kosten im Fragment-Shader und Hybride Baking-Strategien  
Die prozedurale Evaluierung mehrskaliger Voronoi- oder Worley-Rauschfunktionen innerhalb des Fragment-Shaders erfordert erhebliche Rechenkapazitäten der GPU \[cite: 13, 24, 25\]. Da pro Fragment und pro Oktave mehrere Gitterzellen ausgewertet und Distanzberechnungen durchgeführt werden müssen, skaliert die ALU-Last direkt mit der Bildschrimauflösung \[cite: 13, 24\].  
ALU-Kosten versus Texturbandbreite  
Die Berechnung von drei Worley-Ebenen erfordert pro Fragment mindestens 27 Iterationsschritte zur Auswertung der Zellzentren \[cite: 13, 24\]. Demgegenüber steht das klassische Samplen einer vorgebackenen Splatmap, welches lediglich einen einzelnen Textur-Fetch benötigt, jedoch durch die VRAM-Bandbreite und fixe Texturauflösungen limitiert wird \[cite: 10, 26, 27\].  
Architektonisches Hybrid-Konzept für dynamische Terrains  
Für groflächige Terrains empfiehlt sich eine Aufteilung der Verarbeitungsstufen in ein statisches Basis-Baking und ein dynamisches Fragment-Blending \[cite: 8, 25\]:

1. **Statische Weltraum-Splatmap (Baked Base)**: Die großräumige Makro-Verteilung der Materialien auf dem Terrain wird in einer niederrasterigen $R8$\- oder $RGBA8$\-Splatmap-Textur oder direkt in den Vertexfarben des Meshes hinterlegt \[cite: 8\].  
2. **Dynamische Mischzonen-Aktivierung**: Im Fragment-Shader wird der Splatmap-Wert $S\in [0,1]$ überprüft. Liegt das Mischungsverhältnis in einer reinen Zone ($S<0,02$ oder $S>0,98$), bricht der Shader die prozeduralen Berechnungen vorzeitig ab und gibt direkt die Farbe des Basis-Materials aus.  
3. **Live-Knet-Evaluation an Schnittstellen**: Nur in den tatsächlichen Übergangszonen ($0,02\leq S\leq 0,98$) wird der mehrskalige, bildschirmraum-angepasste Knet-Noise ausgewertet. Bei Bau- oder Zerstörungsaktionen am Terrain muss lediglich die niederaufgelöste Splatmap dynamisch per Render-to-Texture aktualisiert werden, während der Fragment-Shader die Knetsprenkel an den geänderten Kanten automatisch in Echtzeit generiert.

\--------------------------------------------------------------------------------  
5\. Konkrete Shader-Ansätze in Three.js r186 und TSL-Implementierungen  
Die folgenden drei Shader-Ansätze nutzen die **Three.js Shading Language (TSL)** aus Three.js r186 \[cite: 7, 8, 9\]. Sie bieten mathematisch isolierte Lösungen für die gestellten Anforderungen: Drei Fleckengrößen, bidirektionales Tropfen, scharfe Knetränder und Maßstabsinvarianz über alle Betrachtungshöhen.  
\--------------------------------------------------------------------------------  
Ansatz 1: Screen-Space Adaptive Worley-Disk Splatter  
Konzept und Funktionsweise  
Dieser Ansatz nutzt eine stochastische Worley-Disk-Funktion, deren Evaluierungsfrequenz über die euklidische Distanz zwischen Fragment und Kamera dynamically skaliert wird \[cite: 13\]. Um das Flimmern harter Kanten zu unterdrücken, wird der Schwellenwert der Zell-Distanz über `fwidth` bildschirmraum-bewusst geglättet \[cite: 17, 18\].  
TSL / JavaScript Code-Implementierung  
import \* as THREE from 'three';  
import {  
  Fn, vec2, vec3, float, mix, smoothstep, floor, fract, min, clamp,  
  positionWorld, cameraPosition, distance, fwidth, length, sin, dot  
} from 'three/tsl';

// Stochastische Hash-Funktion zur Generierung zufälliger Zellzentren  
const hash22 \= Fn((\[p\]) \=\> {  
  const p3 \= fract(vec3(p.x, p.y, p.x).mul(vec3(0.1031, 0.1030, 0.0973)));  
  const dotP \= dot(p3, p3.yzx.add(float(33.33)));  
  return fract(p3.xx.add(p3.yz)).add(dotP);  
});

// Worley-Disk Evaluierung mit Zell-Jittering  
const worleyDisk \= Fn((\[uv\]) \=\> {  
  const st \= floor(uv);  
  const fr \= fract(uv);  
  const minDist \= float(1.0).toVar();

  // 3x3 Nachbarschaftsabfrage  
  for (let y \= \-1; y \<= 1; y++) {  
    for (let x \= \-1; x \<= 1; x++) {  
      const neighbor \= vec2(float(x), float(y));  
      const point \= hash22(st.add(neighbor));  
      const jitteredPoint \= vec2(  
        sin(point.x.mul(6.28318)).mul(0.3).add(0.5),  
        sin(point.y.mul(6.28318)).mul(0.3).add(0.5)  
      );  
      const diff \= neighbor.add(jitteredPoint).sub(fr);  
      const dist \= length(diff);  
      minDist.assign(min(minDist, dist));  
    }  
  }  
  return minDist;  
});

export const createAdaptiveWorleyMaterial \= (colorA, colorB) \=\> {  
  const materialNode \= Fn(() \=\> {  
    const worldPos \= positionWorld.xz;  
    const camDist \= distance(positionWorld, cameraPosition);

    // Bildschirmraum-Anpassung: Dynamische Reduktion der Frequenz auf Distanz  
    const scaleBias \= clamp(camDist.mul(0.05), float(0.4), float(3.5));  
    const adaptiveUV \= worldPos.div(scaleBias);

    // Drei Frequenz-Oktaven für Mikro-, Meso- und Makro-Sprenkel  
    const makro \= worleyDisk(adaptiveUV.mul(0.3));  
    const meso \= worleyDisk(adaptiveUV.mul(1.0));  
    const mikro \= worleyDisk(adaptiveUV.mul(2.8));

    // Bidirektionales Verschmelzen der Fleckengrößen  
    const combinedSdf \= makro.mul(0.5).add(meso.mul(0.3)).add(mikro.mul(0.2));

    // Bildschirmraum-Anti-Aliasing über Ableitungen  
    const threshold \= float(0.42);  
    const fw \= fwidth(combinedSdf).mul(1.5);  
    const knetMask \= smoothstep(threshold.sub(fw), threshold.add(fw), combinedSdf);

    return mix(vec3(colorA), vec3(colorB), knetMask);  
  });

  const material \= new THREE.MeshStandardNodeMaterial();  
  material.colorNode \= materialNode();  
  return material;  
};

\--------------------------------------------------------------------------------  
Ansatz 2: Infinite-Zoom Continuous Multi-Scale SDF Clay Edge  
Konzept und Funktionsweise  
Dieser Ansatz implementiert ein kontinuierliches Oktaven-Blending basierend auf dem Logarithmus der Kameradistanz \[cite: 2\]. Beim Ändern der Betrachtungshöhe gehen die drei Fleckengrößen stufenlos ineinander über. Zusätzlich wird über eine exponentielle Distanztransformation an den Kanten ein erhabener Knetrandwulst modelliert, der die Schichtdicke visuell hervorhebt \[cite: 3, 4, 5\].  
TSL / JavaScript Code-Implementierung  
import \* as THREE from 'three';  
import {  
  Fn, vec3, float, mix, smoothstep, floor, fract, exp, abs, clamp,  
  positionWorld, cameraPosition, distance, fwidth, length, sin, cos  
} from 'three/tsl';

// Prozedurales Knet-SDF mit Domain-Warping  
const claySdf \= Fn((\[p\]) \=\> {  
  const grid \= floor(p);  
  const f \= fract(p);  
  const warp \= sin(p.x.mul(2.5)).add(cos(p.y.mul(2.5))).mul(0.12);  
  return length(f.sub(0.5)).add(warp);  
});

export const createInfiniteZoomClayMaterial \= (colorA, colorB) \=\> {  
  const materialNode \= Fn(() \=\> {  
    const worldPos \= positionWorld.xz;  
    const camDist \= distance(positionWorld, cameraPosition);

    // Logarithmische Kontinuums-Skalierung ("Infinite Zoom")  
    const logDist \= camDist.mul(0.12).max(0.001).log2();  
    const octaveFrac \= fract(logDist);  
      
    const scale0 \= float(1.0).div(float(2.0).pow(floor(logDist)));  
    const scale1 \= scale0.div(2.0);

    // Auswertung zweier skalen-synchronisierter Oktave-Ebenen  
    const sdf0 \= claySdf(worldPos.mul(scale0.mul(0.8)));  
    const sdf1 \= claySdf(worldPos.mul(scale1.mul(0.8)));

    // Stufenlose Mischung der Fleckengrößen  
    const blendedSdf \= mix(sdf0, sdf1, octaveFrac);

    // Knetrand-Formatierung mit plastischem Wulst  
    const cutoff \= float(0.45);  
    const fw \= fwidth(blendedSdf).mul(1.4);  
    const hardEdge \= smoothstep(cutoff.sub(fw), cutoff.add(fw), blendedSdf);

    // Synthese des plastischen Knetrandes (Verdickung an Schnittkante)  
    const edgeDistance \= abs(blendedSdf.sub(cutoff));  
    const knetWulst \= exp(edgeDistance.mul(-18.0)).mul(0.3);

    // Farbzusammensetzung mit Randverdunkelung  
    const baseColor \= mix(vec3(colorA), vec3(colorB), hardEdge);  
    return baseColor.sub(vec3(knetWulst));  
  });

  const material \= new THREE.MeshStandardNodeMaterial();  
  material.colorNode \= materialNode();  
  return material;  
};

\--------------------------------------------------------------------------------  
Ansatz 3: Hybrid Baking & World-Space Dynamic Layering Architecture  
Konzept und Funktionsweise  
Ansatz 3 richtet sich an großflächige Terrains mit hohen Bildwiederholraten. Eine niederrasterige Splatmap definiert die groben Zonen \[cite: 10, 11\]. Der rechenintensive, mehrskalige Knet-Shader wird über eine Ausblendungsfunktion nur dort aktiviert, wo die Splatmap Übergangswerte aufweist. Auf homogenen Flächen werden prozedurale Berechnungen übersprungen.  
Parametrisierungstabelle

| Parameter Name | TSL / JS Datentyp | Empfohlener Wert | Funktion |
| ----- | ----- | ----- | ----- |
| `uThreshold` | `UniformNode(float)` | $0,48$ | Bestimmt den zentralen Schnittpunkt des Knetfarben-Blends. |
| `uEdgeFwidthScale` | `UniformNode(float)` | $1,5$ | Skalierungsfaktor für das Ableitungs-Anti-Aliasing \[cite: 17, 18\]. |
| `uBulgeStrength` | `UniformNode(float)` | $0,25$ | Intensität der optischen Knetrand-Verdickung \[cite: 3, 4\]. |
| `uMesoFrequency` | `UniformNode(float)` | $1,2$ | Frequenzbasis für die mittlere Fleckengröße \[cite: 13\]. |

TSL / JavaScript Code-Implementierung  
import \* as THREE from 'three';  
import {  
  Fn, vec3, float, mix, smoothstep, texture, uniform, clamp,  
  positionWorld, cameraPosition, distance, fwidth, fract, length  
} from 'three/tsl';

export class HybridKnetTerrainMaterial {  
  constructor(splatMapTexture, grassTex, sandTex) {  
    this.uSplatMap \= uniform(splatMapTexture);  
    this.uGrassTex \= uniform(grassTex);  
    this.uSandTex \= uniform(sandTex);  
    this.uThreshold \= uniform(0.48);  
    this.uEdgeScale \= uniform(1.5);

    this.initMaterial();  
  }

  initMaterial() {  
    const materialNode \= Fn(() \=\> {  
      const worldPos \= positionWorld.xz;  
      const camDist \= distance(positionWorld, cameraPosition);

      // Abfrage der vorgebackenen Splatmap  
      const splatVal \= texture(this.uSplatMap, worldPos.mul(0.005)).r;

      // Bestimmung der aktiven Mischzone (1 \= Kante, 0 \= Homogene Fläche)  
      const blendZoneMask \= smoothstep(0.01, 0.08, splatVal)  
        .mul(smoothstep(0.99, 0.92, splatVal));

      // Dynamische UV-Anpassung an Kameradistanz  
      const distBias \= clamp(camDist.mul(0.04), float(0.5), float(3.0));  
      const noiseUV \= worldPos.div(distBias);

      // Mehrskaliger Zellen-Noise für Knetfarben-Muster  
      const cell \= fract(noiseUV.mul(1.2)).sub(0.5);  
      const cellSdf \= length(cell);

      // Verknüpfung von Splatmap und zellularem Distanzfeld  
      const blendedSdf \= splatVal.add(cellSdf.mul(0.35)).sub(0.17);

      // Ableitungsbasierte Kantenberechnung  
      const fw \= fwidth(blendedSdf).mul(this.uEdgeScale);  
      const knetMask \= smoothstep(  
        this.uThreshold.sub(fw),  
        this.uThreshold.add(fw),  
        blendedSdf  
      );

      // Textur-Samplings für Zielmaterialien  
      const texA \= texture(this.uGrassTex, worldPos.mul(0.1)).rgb;  
      const texB \= texture(this.uSandTex, worldPos.mul(0.1)).rgb;

      // Direkte Mischung vs. Knet-Mischung basierend auf Mischzone  
      const directBlend \= mix(texA, texB, splatVal);  
      const knetBlend \= mix(texA, texB, knetMask);

      return mix(directBlend, knetBlend, blendZoneMask);  
    });

    this.material \= new THREE.MeshStandardNodeMaterial();  
    this.material.colorNode \= materialNode();  
  }

  getMaterial() {  
    return this.material;  
  }  
}

\--------------------------------------------------------------------------------  
6\. Synthese und Handlungsempfehlungen  
Die Beseitigung der „Shader-Höhenlogik“ bei stilisierten Terrain-Materialübergängen erfordert eine Entkopplung des prozeduralen Rauschens von starren Weltraum-Grid-Frequenzen \[cite: 2, 6\]. Durch die Kombination von zellularen Abstandsfeldern mit bildschirmraum-bewussten Ableitungen (`fwidth`) und logarithmischer Kameradistanz-Skalierung lassen sich Übergänge realisieren, die aus jeder Betrachtungshöhe als scharfe, verkleckste Knetsprenkel lesbar bleiben \[cite: 2, 17, 18\].  
Kernerkenntnisse

* **Distanzkompensation**: Die Skalierung der UV-Frequenzen über den Logarithmus der Kameradistanz verhindert das Verschmelzen von Flecken beim Wechsel in die Lauf- oder Fahrperspektive \[cite: 2\].  
* **Kantenstabilität ohne Alpha**: Die Kombination aus `smoothstep` und `fwidth` erzeugt auf der GPU flimmerfreie, knackscharfe Knetkanten, die genau über die Breite eines einzelnen Pixels geglättet werden \[cite: 17, 18\].  
* **Performanz-Optimierung**: Für großflächige Geländestrukturen sichert eine hybride Architektur – bei der prozeduraler Knet-Noise nur an Schnittstellen ausgewertet wird – eine stabile Bildwiederholrate unter Three.js r186 \[cite: 7, 8, 9\].

Für Produktivumgebungen empfiehlt sich die Umsetzung von **Ansatz 2 (Infinite-Zoom Continuous Multi-Scale SDF)** für Haupt-Terrain-Meshes mit dynamischer Kameraführung, da dieser Ansatz die mathematisch nahtloseste Größeninvarianz ohne sichtbare Umschalt-Artefakte garantiert \[cite: 2\].  
\--------------------------------------------------------------------------------

1. Flat Kit (dustyroom/flat-kit-doc) \- Context7, [https\://context7.com/dustyroom/flat-kit-doc](https://context7.com/dustyroom/flat-kit-doc)  
2. Exploring the Iterative Circumcenter Map: GPU Acceleration \- Nick's Blog, [https\://nickmcd.me/2022/05/12/exploring-the-iterative-circumcenter-map-gpu-acceleration/](https://nickmcd.me/2022/05/12/exploring-the-iterative-circumcenter-map-gpu-acceleration/)  
3. GPU Clay Simulation in Claybook | PDF | Texture Mapping | Graphics Processing Unit, [https\://www\.scribd.com/document/752319270/Aaltonen-Sebastian-GPU-Based-Clay](https://www.scribd.com/document/752319270/Aaltonen-Sebastian-GPU-Based-Clay)  
4. Deferred Signed Distance Field rendering \- Interplay of Light \- WordPress.com, [https\://interplayoflight.wordpress.com/2017/12/12/deferred-signed-distance-field-rendering/](https://interplayoflight.wordpress.com/2017/12/12/deferred-signed-distance-field-rendering/)  
5. electricsquare/raymarching-workshop: An Introduction to Raymarching \- GitHub, [https\://github.com/electricsquare/raymarching-workshop](https://github.com/electricsquare/raymarching-workshop)  
6. OpenGL Shading Languag 2nd edition (Orange Book) \- Labomedia Ressources, [https\://ressources.labomedia.org/media/media\_10/orange\_book-\_opengl\_shading\_language\_2nd\_edition.pdf](https://ressources.labomedia.org/_media/media_10/orange_book_-_opengl_shading_language_2nd_edition.pdf)  
7. Introduction to WebGPU and TSL \- Three.js Journey, [https\://threejs-journey.com/lessons/webgpu-tsl/introduction-to-webgpu-tsl](https://threejs-journey.com/lessons/webgpu-tsl/introduction-to-webgpu-tsl)  
8. Three.js Guide: Complete Reference for Builders (2026) \- LearnWithHasan, [https\://learnwithhasan.com/threejs-guide/](https://learnwithhasan.com/threejs-guide/)  
9. OpenMMO/doc/LOADING\_OPTIMIZATION.md at master \- GitHub, [https\://github.com/Julian-adv/OpenMMO/blob/master/doc/LOADING\_OPTIMIZATION.md](https://github.com/Julian-adv/OpenMMO/blob/master/doc/LOADING_OPTIMIZATION.md)  
10. TSL – three.js docs, [https\://threejs.org/docs/pages/TSL.html](https://threejs.org/docs/pages/TSL.html)  
11. Lumen Siggraph 2022 \- Advances in Real-Time Rendering in Games, [https\://advances.realtimerendering.com/s2022/SIGGRAPH2022-Advances-Lumen-Wright%20et%20al.pdf](https://advances.realtimerendering.com/s2022/SIGGRAPH2022-Advances-Lumen-Wright%20et%20al.pdf)  
12. Noise \- The Book of Shaders, [https\://thebookofshaders.com/11/](https://thebookofshaders.com/11/)  
13. 10 Noise Functions for Three.js TSL Shaders, [https\://threejsroadmap.com/blog/10-noise-functions-for-threejs-tsl-shaders](https://threejsroadmap.com/blog/10-noise-functions-for-threejs-tsl-shaders)  
14. Real-Time Rendering Fourth Edition, [http\://mutantstargoat.com/\~nuclear/tmp/realtime\_rendering\_4ed.pdf](http://mutantstargoat.com/~nuclear/tmp/realtime_rendering_4ed.pdf)  
15. The OpenGL Shading Language, [https\://www\.ece.lsu.edu/gp/refs/GLSLangSpec.1.50.09.pdf](https://www.ece.lsu.edu/gp/refs/GLSLangSpec.1.50.09.pdf)  
16. THE OPENGL ® SHADING LANGUAGE \- softpixel, [https\://softpixel.com/\~cwright/papers/tech/ShaderSpecV1.051.pdf](https://softpixel.com/~cwright/papers/tech/ShaderSpecV1.051.pdf)  
17. shadertrixx/README.md at main \- GitHub, [https\://github.com/cnlohr/shadertrixx/blob/main/README.md](https://github.com/cnlohr/shadertrixx/blob/main/README.md)  
18. Anti-Aliasing Basics for Procedural Shapes (GLSL) \- ShaderGif, [https\://shadergif.com/guides/anti-aliasing-basics/](https://shadergif.com/guides/anti-aliasing-basics/)  
19. Rendering Tiny Glades With Entirely Too Much Ray Marching \- YouTube, [https\://www\.youtube.com/watch?v=jusWW2pPnA0](https://www.youtube.com/watch?v=jusWW2pPnA0)  
20. Procedural Island Generation \- Tyler Beaupre \- WordPress.com, [https\://tylerbeaupre.wordpress.com/home/games/procedural-island-generation/](https://tylerbeaupre.wordpress.com/home/games/procedural-island-generation/)  
21. Fast and Gorgeous Erosion Filter \- runevision \- Blog, [https\://blog.runevision.com/2026/03/fast-and-gorgeous-erosion-filter.html](https://blog.runevision.com/2026/03/fast-and-gorgeous-erosion-filter.html)  
22. City building games have a Soul Problem pt.2 \- Hacker News, [https\://news.ycombinator.com/item?id=49945323](https://news.ycombinator.com/item?id=49945323)  
23. News Archive \- TechPowerUp, [https\://www\.techpowerup.com/news-archive?month=0822](https://www.techpowerup.com/news-archive?month=0822)  
24. GitHub \- korbindeman/bevy\_erosion\_filter: A GPU-friendly per-fragment erosion filter for Bevy., [https\://github.com/korbindeman/bevy\_erosion\_filter](https://github.com/korbindeman/bevy_erosion_filter)  
25. Wanna edit shaders with nodes like its R77? \- Showcase \- three.js forum, [https\://discourse.threejs.org/t/wanna-edit-shaders-with-nodes-like-its-r77/91608](https://discourse.threejs.org/t/wanna-edit-shaders-with-nodes-like-its-r77/91608)  
26. Chapter 27\. Advanced High-Quality Filtering \- NVIDIA Developer, [https\://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-27-advanced-high-quality-filtering](https://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-27-advanced-high-quality-filtering)  
27. What Is a Shader? A Practical Explanation for Web Developers \- Three.js Resources, [https\://threejsresources.com/shaders](https://threejsresources.com/shaders)

