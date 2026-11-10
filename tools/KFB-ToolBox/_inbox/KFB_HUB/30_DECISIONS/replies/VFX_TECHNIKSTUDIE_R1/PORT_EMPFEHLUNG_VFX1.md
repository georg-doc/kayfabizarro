# VFX-Technikstudie R1 · Kontakt-Impuls · Port-Empfehlung Blender → WebGL2

WSB, 10.11.2026. Zum Brief `STYLE_AUTHORITY_AND_BRIEF.md` (PR #113). Das ist eine Technikstudie, kein KFB-Endbild. Ein bestehendes KFB-Effekt-Asset wurde nicht verändert, daher gibt es keinen Originalvergleich. Die Gestaltung entscheidet Georg.

## Was gebaut ist
Blender: `KFB_Kontakt_Impuls.vfx1.blend`, gerendert mit Eevee, ohne Blender-MCP-Verbindung im Hintergrundbetrieb (Skript `vfx_studie.py`). Alles ist editierbar.
- **Form:** ein Quad mit einem prozeduralen Material. Der radiale Verlauf ergibt die Alpha-Hülle: Kern als „1 − smoothstep(0, C, r)“, Ring als „1 − smoothstep(0, W, |r − R|)“.
- **Bruch:** ein Voronoi-Muster (Distanz zur Kante) auf Polarkoordinaten. Der Fluss F schiebt das Muster nach außen, die Schwelle B frisst den Ring.
- **Stellgrößen:** sieben Value-Knoten mit Schlüsselbildern, nämlich R, W, C, AK, AR, F und B. Das ist die Methode aus Video 1 (Smeaf): Transparenzverlauf, Muster und animierte Parameter.
- **Timing:** auf Lesbarkeit bei Normaltempo ausgelegt (Fragestellung aus Video 2):
  - Bild 0–1: Kern blitzt auf (Hauptform).
  - Bild 1–9: Ring wächst schnell und bremst ab.
  - ab Bild 6: Bruch setzt ein (Nebenform).
  - Bild 17: aus.
  - Dauer 0,6 s bei 30 fps. Bild 0 liegt auf dem Kontaktzeitpunkt.
- **Masken und Flipbook** (Methode aus Video 3, Le Lu):
  - RGBA-Folge mit geradem Alpha.
  - Atlas `KFB_Kontakt_Impuls.vfx1.atlas.png`: 4 × 5 Zellen à 256 px mit 4 px leerem Innenrand gegen Ausbluten, sRGB, zeilenweise; Angaben in der zugehörigen `.json`.
  - Dazu die Voronoi-Maske als Daten-Textur `maske_voronoi_polar_256.png` (linear), für einen Port mit Textur statt Rechnung.

## Beobachtungen (KEEP, TUNE, REJECT)
- **KEEP:** Timing auf dem Kontakt. Auf der nachgetimten Faust (MB1, Kontakt 0,467 s) sitzt der Blitz im Treffer-Halt; der Ring bleibt am Treffpunkt stehen, während die Faust zurückgeht. Primär- und Sekundärbewegung sind getrennt lesbar.
- **TUNE:** Auf hellem Grund (Belegbühne) liest sich der warmweiße Ring schwach, weil es hell auf hell ist. Abhilfe: dunklerer oder satterer Rand, oder normales statt Screen-Blending. Die Farbe bleibt Georgs Entscheidung.
- **TUNE:** Die Größe in der Kontext-Probe ist zu groß (der Ring läuft über die Nase), etwa 60 % wären richtig. Im Spiel als Billboard am Kontaktpunkt mit Tiefentest löst sich das zum Teil von selbst.
- **REJECT:** Der Bruch-Rand wirkt mit Voronoi „Distanz zur Kante“ schon in Bild 1–3 als dunkle Linien im Kern. Besser: Bruch erst auf den Ring legen (Kern ausnehmen) oder F1 statt Kantendistanz nehmen.
- **Hinweis:** Polar-Voronoi hat in der Mitte einen Knotenpunkt. Unkritisch, weil der Bruch nur auf dem Ring wirkt.

## Zwei Wege ins Spiel
**A · Atlas (Bake).**
- Kosten: eine Textur 1024 × 1280 RGBA8, 5,2 MB VRAM, mit Mips etwa 7 MB. Auf Platte ist die PNG 253 KB, als WebP kleiner. KTX2/UASTC läge bei rund 1,3 MB VRAM, braucht aber toktx und damit Georgs Ja.
- Je Instanz ein Quad, ein Draw-Call (instanziert mehrere je Call). Die Füllrate bei rund 200 × 200 px ist vernachlässigbar.
- Abnehmer: das Muster von `src/modules/explosionSheets.js`, also Bild-UV aus Spalten, Zeilen und fps.
- Vorteil: Das Bild ist exakt wie in Blender.
- Nachteil: Die Parameter sind eingebacken; Größe und Dauer lassen sich nur skalieren.

**B · Shader-Port (Rechnung in WebGL2).**
- Dieselbe Mathematik als kleines Fragment-Programm, mit den sieben Stellgrößen als Uniforms über die Zeit, ohne Textur.
- Kosten je Fragment: etwa zwei smoothstep-Aufrufe, ein sqrt, ein atan und eine 2D-Voronoi-Kantendistanz (3 × 3 plus 5 × 5 Zellen, rund 200–300 Rechenschritte). Bei 40 000 Fragmenten (200 × 200 px) liegt das weit unter 0,1 ms auf M1. Ein Draw-Call je Instanz, 0 MB Textur.
- Vorteil: Farbe, Größe, Dauer und Bruch lassen sich zur Laufzeit stellen, auflösungsunabhängig.
- Nachteil: Der Blender-Node-Baum ist nicht 1:1 exportierbar; Voronoi und Smoothstep werden in GLSL nachgebaut (Skizze unten).

**Empfehlung:** B für diesen Kontakt-Impuls, weil alles parametrisch ist und es nur sieben Kurven sind. A bleibt der Weg für gemalte oder simulierte Effekte wie Rauch und Feuer im bestehenden `explosionSheets`-Pfad. Einbau-Eigentümer wäre WS1, im bestehenden Kampf-FX-Abnehmer hinter Schalter. Kein neues Effekt-Subsystem.

**Ein produktiver nächster Schritt:** WS1 baut den Impuls als kleines ShaderMaterial (Weg B) an `kontakt_mb1.json` (Faust 0,467 s) hinter Schalter und prüft ihn im Spiel bei Normaltempo. Erst danach entscheidet Georg die Gestaltung.

## Kurven (Bild bei 30 fps → Wert, Blender-Bezier; im Port als smoothstep zwischen den Punkten)
- C: 0 → 0,12, 1 → 0,42, 5 → 0
- AK: 0 → 1, 2 → 1, 5 → 0
- R: 0 → 0,05, 3 → 0,45, 8 → 0,72, 17 → 0,86
- W: 0 → 0,20, 5 → 0,12, 17 → 0,04
- AR: 0 → 0, 1 → 1, 9 → 0,9, 17 → 0
- F: 0 → 0, 17 → 1,6
- B: 0 → 0, 6 → 0,04, 12 → 0,30, 17 → 0,45

## GLSL-Skizze (Weg B, Fragment, uv 0..1 auf dem Quad)
```glsl
uniform float R, W, C, AK, AR, F, B; uniform vec3 colKern, colRing;
vec2 h2(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return fract(sin(p)*43758.5453); }
float voronoiKante(vec2 x){            // Kantendistanz (Inigo Quilez, zwei Durchläufe)
  vec2 n = floor(x), f = fract(x), mg, mr; float md = 8.0;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(i,j), r=g+h2(n+g)-f; float d=dot(r,r); if(d<md){md=d;mr=r;mg=g;} }
  md = 8.0;
  for(int j=-2;j<=2;j++) for(int i=-2;i<=2;i++){ vec2 g=mg+vec2(i,j), r=g+h2(n+g)-f; if(dot(mr-r,mr-r)>1e-5) md=min(md, dot(0.5*(mr+r), normalize(r-mr))); }
  return md;
}
void main(){
  vec2 p = vUv*2.0-1.0; float r = length(p), phi = atan(p.y, p.x);
  float kern = 1.0 - smoothstep(0.0, C, r), ring = 1.0 - smoothstep(0.0, W, abs(r - R));
  float bruch = smoothstep(B, B + 0.12, voronoiKante(vec2(phi*1.9, r*4.0 - F) * 2.2));
  float a = clamp(kern*AK + ring*bruch*AR, 0.0, 1.0);
  gl_FragColor = vec4(mix(colKern, colRing, smoothstep(0.0, 0.9, r)) * 1.4, a);   // in WebGL2/three: pc_fragColor, gerades Alpha
}
```
