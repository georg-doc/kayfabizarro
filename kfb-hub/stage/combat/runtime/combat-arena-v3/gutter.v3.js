/* ⚠ HAUSREGEL FÜR DIESE DATEI: **kein Backtick in irgendeinem Kommentar dieses Shaders.** Der
   Fragment-Shader liegt in einem JS-Template-Literal; ein Zitatzeichen in einem GLSL-Kommentar
   beendet den Shader-Text mitten im Code. Zweimal am 06.09. bezahlt (»Unexpected identifier
   'calm'«, »Unexpected identifier 'rad'«) — beide Male stand der Vorhang für immer.

   KFB Combat Arena v3 · gutter.v3.js — DER HINTERGRUND: WABERFLÄCHE + DUO-TONE-RASTER
   ────────────────────────────────────────────────────────────────────────────────────────────────
   HERKUNFT, EHRLICH AUFGESCHRIEBEN (Georg 06.09.: »den BG shader mit duo-tone-layer würde ich 1:1
   importieren«):

   · **1:1 übernommen sind die ZAHLEN und die PALETTEN**, weil sie im Repo liegen:
       – die Aufrufwerte aus `KFB Boxel Blitz v4.dc.html` (dort wörtlich):
         `channel: 'fluid' · palette: 'kfb' · duo: 0.42 · calm: 0.85 · speed: 0.26 · dotPx: 8`
         samt Begründung: »Kräftiger als in der Sendung … Ruhiger als das Original-Spielfeldtempo,
         damit er nicht mit dem Feld konkurriert (Prime Directive: Reaktion ja, Leerlauf nein).«
       – die Fluid-Paletten aus `overworld/overworld/gutter-2d.js` (`NOTFARBE`, zwei Töne je Fluid:
         wasser · bubblegum · oel · saeure) — DAS ist das Duo im Duo-Tone.
   · **NICHT 1:1 ist der Shader selbst — er ist nicht im Repo.** `boxelblitz-v2/gutter.v5.js`,
     `boxelball-v1/stage.v1.js` und `OW_SHADE` sind nicht gepusht (gesucht am 06.09. über den
     ganzen Baum: 1 Treffer, und das war `themes/kfb-med.css`). Was hier steht, ist nach den
     dokumentierten Zahlen gebaut, nicht kopiert. **Sobald die Datei im Repo liegt, wird diese
     hier ersetzt** — die Naht ist genau eine: `createGutter({ THREE, camera, params })`.
   · **Ein Unterschied ist bewusst:** dort liest der Gutter `stage.panelGroup` (er ist der RAND
     eines Spielfelds). Hier gibt es keine Panel-Gruppe; der Grund ist die ganze Bühne hinter der
     Karte. Also hängt die Fläche als **Kind der Kamera** in großer Entfernung, ohne Tiefentest —
     kein zweiter Render-Durchgang, keine Änderung am Wirt.

   FARBE JE KARTE (Georg): »die farben ändern ja nach deck/karte → bzw. erstmal zufällig beim
   start & kartenwechsel«. `zufall(rng)` zieht aus dem GESEEDETEN Zufall des Wirts — kein
   `Math.random`, sonst fällt Boden C10 und derselbe Seed zeigte zwei verschiedene Bühnen.        */

/* 1:1 aus `overworld/overworld/gutter-2d.js` (dort `NOTFARBE`): tief und flach je Fluid. */
export const FLUIDE = {
  wasser:    ['#0d4a5e', '#2e9ab0'],
  bubblegum: ['#8a2a6a', '#e86ab0'],
  oel:       ['#080a0c', '#2a323c'],
  saeure:    ['#1d3a12', '#5fbf28'],
  /* `palette: 'kfb'` steht im Boxel-Aufruf, ihre WERTE liegen in der nicht gepushten Datei. Diese
     zwei kommen aus dem UI-Kit (`themes/kfb-med.css`, Quelle der Wahrheit): Bühnengrund und
     KFB-Gold. Abgeleitet, nicht kopiert — der Unterschied gehört benannt. */
  /* AM REFERENZBILD GEMESSEN (Georg: »shader EXAKT so wie Boxel Blitz«, sein Screenshot →
     `captures/REF-boxel-bg.png`, 1594 × 1244; Fenster 260 × 160, 41 600 Bildpunkte):
       häufigster Grundton 144,192,200 · dunkelster Punkt 64,97,107 · Periode 15,7 px bei dpr 2. */
  kfb:       ['#40616b', '#9ec6ce']
};

const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

/* Der Kanal `fluid`: eine Waberfläche mit Domain-Warping (EINE Bewegung, nicht drei — die Lehre
   aus `color-worlds.js`: »Morphen + Wabern + Pulsieren gleichzeitig liest man als Ruckeln«).
   Darüber das Duo-Tone-Raster: harte Schwelle statt Verlauf, plus Punktraster in BILDSCHIRM-
   koordinaten (`dotPx` ist eine Pixelzahl, also darf sie nicht mit der Fläche skalieren). */
/* ⚠ KORREKTUR 06.09. nach Georgs Referenzbild aus Boxel Blitz v4 (»BG shader ist a) falsch
   skaliert und b) fehlt das animierte duo-tone layer«). Beides stimmte, und beides ist derselbe
   Fehler: ich hatte die Waberfläche zur Hauptsache gemacht und das RASTER auf 18 % Gewicht
   gestellt — im Bild blieben drei riesige Wolken und kein Halbton.

   Am Referenzbild abgelesen: ein **Comic-Halbton** über der ganzen Fläche, Punkte im DUNKLEN Ton
   auf hellerem Grund, Punktgröße folgt dem Ton (dunkle Zone = fette Punkte, helle = feine), Raster
   in BILDSCHIRMkoordinaten und damit unabhängig von der Kameraentfernung. Die Wolke darunter ist
   nur die Modulation, keine Zeichnung für sich.

   Zwei Zahlen zur Skalierung, beide am Bild geprüft:
     – Wolkenfrequenz 3,2 → **5,4** (aus »zwei Wolken« werden weiche Bänder wie in der Referenz)
     – `dotPx` ist eine CSS-Zahl, `gl_FragCoord` liegt in GERÄTE-Pixeln: bei dpr 2 war das Raster
       halb so groß wie bestellt. Die Uniform trägt jetzt `dotPx × dpr`. */
const FS = `
precision highp float;
uniform float uTime, uDuo, uCalm, uSpeed, uDotPx;
uniform vec3 uA, uB;
uniform vec2 uRes;
varying vec2 vUv;
float w2(vec2 p){ return sin(p.x) * sin(p.y); }
float fluid(vec2 p, float t){
  vec2 q = p + 0.48 * vec2(w2(p * 1.9 + vec2(t * 0.70, 0.0)), w2(p * 1.5 - vec2(0.0, t * 0.60)));
  float v = w2(q * 1.15 + t * 0.35) * 0.52 + w2(q * 2.3 - t * 0.22) * 0.30 + w2(q * 4.7 + t * 0.14) * 0.18;
  return v * 0.5 + 0.5;
}
void main(){
  vec2 p = (vUv - 0.5) * vec2(max(uRes.x / max(uRes.y, 1.0), 0.2), 1.0) * 5.4;
  float v = fluid(p, uTime * uSpeed);
  v = mix(0.5, v, uCalm);
  /* Grund: EINE Farbfamilie, weiche Bänder — der Kontrast kommt aus dem Raster, nicht hier. */
  /* Der Grund bleibt in der HELLEN Hälfte der Familie — der Kontrast kommt aus dem Raster,
     nicht aus dem Grund. Vorher 0,42…0,98: die dunkle Hälfte lag schon im Grund, und die Punkte
     kamen zusätzlich obendrauf (Georgs »immer noch falsch gebaut/skaliert«). */
  /* Die Bänder sind FLACH: im Referenzbild schwankt der Grund nur zwischen ~128 und ~152. */
  vec3 grund = mix(uA, uB, mix(0.78, 1.0, v));
  /* Halbton: Punktradius folgt dem Ton. \duo\ ist das Gewicht des Rasters (0,42 = Referenz). */
  vec2 zelle = fract(gl_FragCoord.xy / max(uDotPx, 2.0)) - 0.5;
  /* Punktradius: 0,44 war fast Berührung (die Zellhälfte ist 0,5) — daraus wurde eine Fläche mit
     Löchern statt eines Rasters. Gemessen am Referenzbild: die fetten Punkte füllen etwa die Hälfte
     der Zelle, die feinen ein Fünftel. */
  /* ⚠ DIE RAMPE WAR BREITER ALS DER PUNKT. Gemessen: dunkelster Punkt 106,155,173 gegen Referenz
     64,97,107 — **37 Lum Kontrast statt 92**. Bei rad 0,09 und Kante ±0,07 läuft der smoothstep
     von 0,02 bis 0,16: punkt erreicht 1,0 nur unter 0,02, das sind bei 16 Gerätepixeln
     Zellweite **0,3 Pixel**. Die Tinte wurde also nie angewandt, jeder Punkt war eine Delle mit
     2-px-Boden. Jetzt Radius unten angehoben und die Kante verengt — der Punkt bekommt einen KERN.
     Merksatz: ein Punkt ohne Kern ist kein Raster, sondern ein Schatten. */
  float rad = mix(0.18, 0.34, 1.0 - v);
  float punkt = 1.0 - smoothstep(rad - 0.025, rad + 0.025, length(zelle));
  /* Und die Tinte ist eine TÖNUNG, kein Austausch: bei duo 0,42 liegt sie auf 0,41, nicht auf 1,0.
     Schwarze Punkte auf Magenta waren nicht »duo-tone«, sondern zwei Bilder übereinander. */
  /* Volle Tinte im Kern: 0,30 + 1,65 · 0,42 = 0,99, also praktisch uA — genau der gemessene
     Referenzpunkt. Weniger ist wieder eine Delle, mehr gibt es nicht. */
  vec3 col = mix(grund, uA, punkt * (0.30 + 1.65 * uDuo));
  gl_FragColor = vec4(col, 1.0);
}`;

export function createGutter({ THREE, camera, scene, renderer, params = {} }) {
  /* ⚠ DIE KAMERA MUSS IM SZENENGRAPHEN HÄNGEN, sonst wird KEIN Kind der Kamera gezeichnet.
     Gemessen 06.09. in genau diesem Wirt: Palette stand auf `bubblegum` (#8a2a6a→#e86ab0), im
     Bildpuffer lagen an allen vier Ecken 94,158,179 — also weiter der Halbton-Hintergrund des
     Wirts. three rendert die Kinder einer Kamera nur, wenn die Kamera selbst Teil der Szene ist;
     host.v2 hängt sie nicht ein (sie braucht das für sich nicht).
     Merksatz: ein Kind der Kamera ist erst im Bild, wenn die Kamera im Baum ist. */
  if (scene && !camera.parent) scene.add(camera);
  const P = Object.assign({ palette: 'kfb', duo: 0.42, calm: 0.85, speed: 0.26, dotPx: 8, dist: 60 }, params);
  const pal = FLUIDE[P.palette] || FLUIDE.kfb;
  const uni = {
    uTime: { value: 0 }, uDuo: { value: P.duo }, uCalm: { value: P.calm },
    uSpeed: { value: P.speed }, uDotPx: { value: P.dotPx },
    uA: { value: new THREE.Color(pal[0]).convertLinearToSRGB() }, uB: { value: new THREE.Color(pal[1]).convertLinearToSRGB() },
    uRes: { value: new THREE.Vector2(1, 1) }
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: FS, uniforms: uni, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  mesh.name = 'gutter-duo';
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  mesh.position.z = -P.dist;
  camera.add(mesh);

  let name = P.palette, lastW = 0, lastH = 0;

  /* Die Fläche muss den Bildkegel FÜLLEN, und zwar bei jeder Größe. Höhe aus fov und Entfernung,
     Breite aus dem Seitenverhältnis — plus 6 % Luft, damit an keiner Kante Grund durchsieht.
     (Das ist derselbe Befund, den `gutter.v5.js` im Repo-Kommentar für sich reklamiert: bei
     Georgs Kippung fehlten oben 29 Bildpunkte SCHWARZ, weil die Größe geraten war.) */
  function passe() {
    const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * P.dist;
    const w = h * camera.aspect;
    mesh.scale.set(w * 1.06, h * 1.06, 1);
    const el = renderer && renderer.domElement;
    lastW = (el && el.clientWidth) || 1600; lastH = (el && el.clientHeight) || 900;
    uni.uRes.value.set(lastW, lastH);
    const dpr = renderer && renderer.getPixelRatio ? renderer.getPixelRatio() : 1;
    uni.uDotPx.value = P.dotPx * dpr;
  }
  passe();

  return {
    mesh, uniforms: uni,
    get palette() { return name; },
    /* Farbwechsel je Karte. Zwei Wege, ein Ort: mit Namen (Deck bringt später seinen mit) oder
       aus dem geseedeten Zufall. */
    setPalette(n) {
      const p = FLUIDE[n]; if (!p) return name;
      name = n;
      uni.uA.value.set(p[0]).convertLinearToSRGB();
      uni.uB.value.set(p[1]).convertLinearToSRGB();
      return name;
    },
    /* rng ist PFLICHT: `Math.random` würde Boden C10 fällen und den Seed entwerten. */
    zufall(rng) {
      const keys = Object.keys(FLUIDE);
      const r = typeof rng === 'function' ? rng() : 0;
      return this.setPalette(keys[Math.min(keys.length - 1, Math.floor(r * keys.length))]);
    },
    setParams(o = {}) {
      if (o.duo != null) uni.uDuo.value = +o.duo;
      if (o.calm != null) uni.uCalm.value = +o.calm;
      if (o.speed != null) uni.uSpeed.value = +o.speed;
      if (o.dotPx != null) { P.dotPx = +o.dotPx; passe(); }
    },
    resize: passe,
    /* EINE Zahl, EIN Besitzer: die Größe wird im Takt geprüft, nicht beim Bauen geglaubt.
       Ein Bildkegel, der einmal gemessen wurde, ist nach dem ersten Layout falsch. */
    update(dt) {
      uni.uTime.value += dt;
      const el = renderer && renderer.domElement;
      if (el && (el.clientWidth !== lastW || el.clientHeight !== lastH) && el.clientWidth > 0) passe();
    },
    zeile() {
      return '[gutter] ' + name + ' ' + FLUIDE[name][0] + '→' + FLUIDE[name][1]
        + ' · duo ' + uni.uDuo.value + ' calm ' + uni.uCalm.value + ' speed ' + uni.uSpeed.value
        + ' dot ' + uni.uDotPx.value + ' px · nach den Zahlen aus Boxel Blitz v4, Shader nicht gepusht';
    },
    dispose() { camera.remove(mesh); mesh.geometry.dispose(); mat.dispose(); }
  };
}

export default createGutter;
