/* KFB Combat Arena v3 · flood.v3.js — S11b: DIE TUSCHE FLIESST (Darstellungsschicht zu M12)
   ─────────────────────────────────────────────────────────────────────────────────────────────
   WAS DIESES MODUL IST: die DARSTELLUNG der Zensur, nicht ihre Wahrheit. Es nimmt die
   Tuscheschicht von `zensur.v3.js` (eine Canvas-Textur, in die jeder Spritzer EINMAL gezeichnet
   wird) als QUELLE und lässt sie über ein Faserfeld ineinanderlaufen — auf zwei Render-Zielen im
   Wechsel (Ping-Pong), ein Fullscreen-Pass je Simulationsschritt.

   ARBEITSTEILUNG, ausdrücklich (Georgs Zuschnitt 07.09.: »Canvas als Quelle, Flood als
   Darstellung, Regler zum Umschalten«):
     Canvas  ein Klecks ist ein Ereignis mit Ort, Zeit und Absender; die Deckung ist eine gelesene
             Zahl. Das trägt C22/C23 und den Seed-Boden. Ohne dieses Modul läuft alles weiter.
     Flood   das Aussehen. Er kann nur DUNKLER werden (jeder Schritt ist ein Maximum), also ist die
             Monotonie hier per Konstruktion wahr und nicht per Messung — und er ist unabhängig von
             der Klecksanzahl, während die Canvas-Kosten mit ihr wachsen.

   HERKUNFT DES VERFAHRENS: der Pixel-Flood mit Blend-Darken auf Ping-Pong-Zielen, wie Yuriy
   Artyukh ihn im Stream zum 14islands-Footer baut (FBM-Noise verschiebt vier Nachbar-Samples, das
   Minimum gewinnt, alles läuft gegen Weiß aus). Zwei Abweichungen, beide begründet:
     · Wir rechnen auf ALPHA und nehmen das MAXIMUM statt Minimum-auf-Farbe. Tusche ist eine
       Deckung, kein Farbton; auf Alpha ist »dunkler« = »mehr«, und `max` ist damit dasselbe
       Werkzeug mit dem richtigen Vorzeichen. Nebenwirkung, die wir wollen: kein Ausbleichen, also
       kein Rückgang — C22 hält ohne Zusatzregel.
     · Kein Sub-Pixel-Versatz, sondern EIN Texel Nachbarschaft mit WÜRFEL und OBERFLÄCHENSPANNUNG.
       Eine Verschiebung von 0,02 Texeln bewegt in einer Max-Dilatation nichts (sie landet im
       selben Texel); die Geschwindigkeit muss also über die WAHRSCHEINLICHKEIT kommen, nicht über
       die Weite. Jede Kachel am Rand der Tusche wächst mit `chance` je Schritt um einen Texel, das
       Faserfeld entscheidet, WO zuerst — und die Spannung entscheidet, WELCHE FORM dabei entsteht.

   ⚠ WARUM ES KEINEN WÜRFEL MEHR GIBT (Georg 08.09.: »immer noch Streifen bzw. pixelige
   Flächenränder« · »die runden Flächen mit klaren Grenzen sahen besser aus«). Zwei Fassungen haben
   an derselben Stelle verloren: eine Kachel entschied je Schritt PER WÜRFEL, ob sie den Alpha-Wert
   ihres Nachbarn übernimmt. Der Übernahme-Wert war 0 oder 1, also lag am Rand immer eine Zeile
   halbfertiger Einzelkacheln — eine Treppe, und über Sekunden gesehen ein Flimmern. Auf einer
   Textur, die über 18 u gespannt ist, ist ein Texel am Bildrand mehrere Bildpunkte groß: genau die
   »pixeligen Flächenränder«. Kein Nachschärfen hilft dagegen, weil die Ursache die BINARITÄT ist.
   Jetzt wächst Alpha STETIG: je Schritt kommt ein kleiner Betrag dazu, proportional dazu, wie voll
   die Nachbarschaft ist. Damit ist der Rand ein Verlauf über zwei, drei Texel (also weich, aber
   schmal), er ist rund, weil die Krümmung ihn treibt, und er flimmert nicht, weil kein Zufall mehr
   je Bild entscheidet. Der Zufall bleibt nur noch als Papierfaser im TEMPO — dort, wo er hingehört.

   ⚠ WARUM DIE OBERFLÄCHENSPANNUNG NICHT VERHANDELBAR IST (Georg 08.09.: »Tusche darf nicht mit den
   Streifen seitlich zerlaufen — so funktioniert keine Brush-Ink!«). Erste Fassung wuchs entlang der
   ACHSEN: die vier geraden Nachbarn bekamen die volle Wahrscheinlichkeit, die vier schrägen 0,45 —
   und das Feld wanderte je Schritt ein Stück in eine Richtung. Beides zusammen ergibt Streifen:
   waagerechte und senkrechte Fasern, die seitlich auslaufen. Das ist ein Dilatationskern, kein
   Pinsel. Drei Änderungen, und die Formen sind rund:
     (a) Die schrägen Nachbarn wiegen 1/√2 statt 0,45 — das ist der GEOMETRISCH richtige Wert
         (ihr Abstand ist √2 Texel), und damit wächst ein Punkt zu einem Kreis statt zu einem Kreuz.
     (b) Eine Kachel wächst nur, wenn ihre Nachbarschaft schon voll ist (`smoothstep` über den
         Belegungsgrad): Buchten füllen sich schnell, einzelne Nadeln fast nicht. Das ist
         Oberflächenspannung, und sie ist der Grund, warum Tinte runde Ränder hat und keine Fransen.
     (c) Das Faserfeld WANDERT NICHT mehr (`drift: 0`). Papierfasern bewegen sich nicht; die
         Wanderung war der eigentliche Streifenmotor.

   ⚠ DREI DINGE, DIE MESSBAR SIND UND DESHALB HIER STEHEN:

   (1) FESTER SIMULATIONSSCHRITT (1/60 s, höchstens 4 Nachholschritte je Bild). Ein Flood, der
       `dt` direkt verrechnet, breitet sich auf einer schnellen Maschine schneller aus — damit wäre
       der Seed-Boden (C10) für alles kaputt, was von der Deckung abhängt. Der Rest bleibt im
       Akkumulator stehen. Die Nachholgrenze ist eine Entscheidung gegen die Todesspirale: nach
       einem Tab-Wechsel wird NICHT aufgeholt, und das steht als Zahl (`verworfen`) im Prüfblatt.

   (2) DER ZUFALL HÄNGT AN DER SCHRITTNUMMER, NICHT AN DER UHR. Gehasht wird `Texelindex +
       Schrittnummer`; dieselbe Anzahl Schritte ergibt dasselbe Bild. `performance.now()` im Shader
       wäre eine hübsche Animation und ein unwiederholbarer Beweis.

   (3) DIE MESSUNG LIEST DAS, WAS MAN SIEHT — UND DIESELBE FLÄCHE WIE DIE QUELLE. Der Deckungsgrad
       wird aus dem FLOOD-Ziel gelesen (64 × 64 Abwärtspass auf der MESSFLÄCHE, also ohne den
       Beschnittstreifen, dann ein `readRenderTargetPixels` über 16 kB, alle 0,5 s) — nicht aus der
       Quelle. Sonst meldet das Prüfblatt eine Karte, die nicht auf dem Schirm steht. Je Zelle
       8 × 8 = 64 linear gefilterte Abtastungen: ein dichtes Boxmittel, und ausdrücklich eine
       Näherung — die Abweichung gegen die Canvas-Lesung steht einmal je Karte im Protokoll.

   RÜCKWEG: `an = false`. Die Canvas-Schicht bleibt liegen und wird wieder direkt gezeigt; dieses
   Modul rechnet nicht mehr. Nichts anderes hängt an ihm.                                        */

export const SPEC = {
  lange: 1024,        // Kantenlänge der langen Seite der Flood-Ziele (px)
  schritt: 1 / 60,    // s · fester Simulationsschritt
  maxSchritte: 4,     // Nachholgrenze je Bild
  noise: 5.2,         // Frequenz des Faserfeldes (Perioden über die Kartenbreite)
  oktaven: 4,         // im Shader festverdrahtet (WebGL1 braucht konstante Schleifen)
  drift: 0,           // Wanderung des Feldes je Schritt — 0: Papierfasern bewegen sich nicht
  chance: 0.02,       // Alpha-Zuwachs je Schritt an einer vollen Kante (≈ Texel/Schritt)
  spannung: [0.14, 0.66],  // Belegungsfenster der Oberflächenspannung (unter/über: kaum/voll wachsen)
  spannungsAusgleich: 2.4, // hebt das Tempo an, das die Spannung kostet — gleiche Durchschnittsgeschwindigkeit
  faser: 0.55,        // wie stark die Papierfaser das TEMPO streut (0 = gleichmäßig, 1 = stark)
  leseRaster: 64,     // Rückleseraster (wie zensur.v3, damit die Zahlen vergleichbar sind)
  leseTakt: 1.0,      // s zwischen zwei Rücklesungen (⚠ halbiert auf 0,5 hieß: doppelt so oft warten)
  schwelle: 0.86      // ab diesem Mittelwert gilt eine Zelle als zensiert (identisch zu zensur.v3)
};

const VERT = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D tSrc;
uniform sampler2D tPrev;
uniform sampler2D tMask;
uniform vec2 uPx;
uniform vec3 uInk;
uniform float uNoise;
uniform float uChance;
uniform vec2 uSpannung;
uniform float uAusgleich;
uniform float uFaser;
uniform float uSchritt;
uniform float uDrift;
uniform float uLoesen;
uniform vec4 uErase[8];
varying vec2 vUv;

float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float ink(vec2 uv){ return texture2D(tPrev, clamp(uv, vec2(0.0), vec2(1.0))).a; }

void main(){
  /* AUFLÖSUNG (S11b·2, Georg 08.09.: »beim Neustart einen Dissolve zeigen, um die Tusche wieder auf
     0 zu setzen«). Während uLoesen über 0 steht, wird die QUELLE ausgeblendet — sonst füllt sie
     jeden Pass wieder auf, und die Auflösung käme nie voran. Die Karte hebt sich dann in Flecken ab:
     Stellen mit niedrigem Faserwert gehen zuerst, so wie Tinte in Papier ungleich trocknet.
     ⚠ Ehrlich gesagt: der Faktor wirkt JE PASS, also verstärkt er sich über die Schritte. Das macht
     die Kante der weichenden Flächen schärfer als eine einmalige Blende, und es sieht besser aus als
     es gerechnet ist — aber es ist nicht linear, und wer daran dreht, soll das wissen.
     (Und ja: KEINE Backticks in diesem Kommentar. Sie beenden das Template-Literal — zweiter Fall
     heute, siehe die Warnung im Messpass-Shader.) */
  float srcAn = 1.0 - step(0.001, uLoesen);
  float a = max(texture2D(tSrc, vUv).a * srcAn, ink(vUv));
  /* Das Faserfeld steht still (uDrift 0): es ist die Papierstruktur, kein Wind. Es bleibt als
     Regler, weil man es sehen muss, um es zu verstehen. */
  float s = mod(uSchritt, 4096.0);
  float feld = fbm(vUv * uNoise + vec2(s * uDrift, -s * uDrift * 0.7));
  /* Die acht Nachbarn, schräge mit 1/sqrt(2) gewichtet: ihr Abstand ist sqrt(2) Texel, also ist das
     der geometrisch richtige Anteil. Gleiche Gewichte hätten ein Quadrat ergeben, 0,45 ein Kreuz —
     beides sind Streifen, und genau das war der Befund. */
  float o  = ink(vUv + vec2(0.0, uPx.y));
  float u2 = ink(vUv - vec2(0.0, uPx.y));
  float l  = ink(vUv - vec2(uPx.x, 0.0));
  float r  = ink(vUv + vec2(uPx.x, 0.0));
  float ol = ink(vUv + vec2(-uPx.x, uPx.y));
  float or2= ink(vUv + uPx);
  float ul = ink(vUv - uPx);
  float ur = ink(vUv + vec2(uPx.x, -uPx.y));
  float belegt = (o + u2 + l + r + 0.7071 * (ol + or2 + ul + ur)) / 6.8284;
  /* ⚠ DER SAUM AM BLATTRAND (Georg 08.09.: »kleine Rest-Lücken in Ink«). Gemessen: ALLE 6024 hellen
     Texel lagen innerhalb von 5 Texeln am Blattrand, 79 % innerhalb von 2 — im Inneren war die Karte
     lückenlos. Ursache ist die Oberflächenspannung selbst: sie mittelt über acht Nachbarn, und am
     Rand liegt die Hälfte davon AUSSERHALB des Blattes und ist damit per Definition leer. Ein
     Randtexel kam also nie über die Wachstumsschwelle, egal wie schwarz seine Umgebung war.
     Also wird die Nachbarschaft an der MASKE gewichtet: gezählt wird nur, was Blatt ist. Ein
     Randtexel, dessen Blatt-Nachbarn voll sind, liest jetzt 1 und läuft zu — und das ist auch die
     ehrlichere Physik, weil sich Tinte an einer Blattkante staut statt zu verdünnen.
     Merksatz: ein Mittelwert über Nachbarn, die es nicht gibt, ist kein Mittelwert. */
  float mo = texture2D(tMask, vUv + vec2(0.0, uPx.y)).a;
  float mu = texture2D(tMask, vUv - vec2(0.0, uPx.y)).a;
  float ml = texture2D(tMask, vUv - vec2(uPx.x, 0.0)).a;
  float mr = texture2D(tMask, vUv + vec2(uPx.x, 0.0)).a;
  float mol = texture2D(tMask, vUv + vec2(-uPx.x, uPx.y)).a;
  float mor = texture2D(tMask, vUv + uPx).a;
  float mul = texture2D(tMask, vUv - uPx).a;
  float mur = texture2D(tMask, vUv + vec2(uPx.x, -uPx.y)).a;
  float wsum = mo + mu + ml + mr + 0.7071 * (mol + mor + mul + mur);
  if (wsum > 0.001) {
    belegt = (mo * o + mu * u2 + ml * l + mr * r
              + 0.7071 * (mol * ol + mor * or2 + mul * ul + mur * ur)) / wsum;
  }
  /* OBERFLÄCHENSPANNUNG: eine Bucht (viele getuschte Nachbarn) läuft voll, eine Nadel (wenige)
     bleibt stehen. Daraus entstehen runde, fließende Ränder statt Fransen und Streifen. */
  float spannung = smoothstep(uSpannung.x, uSpannung.y, belegt);
  /* STETIGER ZUWACHS statt Würfel: kein Sprung von 0 auf 1, also keine halbfertigen Einzelkacheln
     am Rand (die »pixeligen Flächenränder«) und kein Flimmern von Bild zu Bild. Die Faser streut
     nur noch das TEMPO. */
  float tempo = uChance * uAusgleich * spannung * (1.0 - uFaser + 2.0 * uFaser * feld);
  a = min(1.0, max(a, a + tempo * belegt));
  if (uLoesen > 0.0) {
    float lf = fbm(vUv * (uNoise * 2.1) + vec2(11.3, 4.7));
    /* EINE DECKE, KEIN FAKTOR. Erster Wurf war a *= (1 - smoothstep(...)) — das wirkt JE PASS und
       verstärkt sich also über die Schritte: gemessen 08.09. sprang das Mittel zwischen t 0,4 und
       0,6 s von 2,4 auf 0, statt gleichmäßig abzunehmen. Ein MINIMUM ist bei jedem Pass dasselbe
       Ergebnis (idempotent), also fällt die Deckung so linear, wie uLoesen wächst.
       Merksatz: was je Bild neu gerechnet wird, darf keinen Faktor auf das eigene Ergebnis legen. */
    a = min(a, 1.0 - smoothstep(lf, lf + 0.3, uLoesen));
  }
  /* HART GEKLIPPT, NICHT WEICH MULTIPLIZIERT: die Kantenglättung der Maske hätte den frisch
     zugelaufenen Saum gleich wieder unter die Sichtbarkeit gedämpft. Die Kante der Karte macht die
     Tuscheoutline (alphaTest 0,28, siehe SOP §4), nicht diese Maske. */
  a *= step(0.5, texture2D(tMask, vUv).a);
  for(int i=0;i<8;i++){ if(uErase[i].z>0.0) a *= smoothstep(uErase[i].z*.9,uErase[i].z,length((vUv-uErase[i].xy)*vec2(1.0,1.0/uErase[i].w))); }
  gl_FragColor = vec4(uInk, a);
}`;

const FRAG_WISCH = `
precision highp float;
uniform vec3 uInk;
void main(){ gl_FragColor = vec4(uInk, 0.0); }`;

const FRAG_KLEIN = `
precision highp float;
uniform sampler2D tSrc;
uniform vec2 uOrigin;
uniform vec2 uSpan;
varying vec2 vUv;
void main(){
  /* DIESELBE MESSFLÄCHE UND DIESELBE ZELLE WIE DIE CANVAS-LESUNG. Zwei Fehler von 08.09. stecken
     in diesen sechs Zeilen (Kritiker, gleiches Bild):
       (a) gelesen wurde das GANZE Ziel, also auch der Beschnittstreifen (0,35 u je Seite), den
           SPEC.leseEinzug der Zensur bewusst ausschließt — systematisch zu niedrig, 24,0 statt
           27,6 %. Jetzt kommt das Fenster als Uniform, gerechnet aus demselben Einzug.
       (b) 4 x 4 Abtastungen über eine 16 x 9-Texel-Zelle haben die weißen Nadelstiche verfehlt und
           Kantenweichheit eingesammelt: die Flood-Karte war MESSBAR schwärzer als ihre Quelle
           (Mittel 38,8 gegen 36,5 %) und meldete trotzdem weniger Deckung. Damit war das Maximum
           aus beiden Zahlen toter Code. Jetzt 8 x 8 = 64 Abtastungen, gleichmäßig über die Zelle,
           jede linear gefiltert — ein dichtes Boxmittel. Es bleibt eine Näherung (die Zelle ist
           15,4 x 8,6 Texel groß, also nicht ganzzahlig teilbar); die Abweichung gegen die
           Canvas-Lesung wird EINMAL je Karte protokolliert, statt zugesagt zu werden.
     ACHTUNG für künftige Kommentare hier drin: dieser Shader steht in einem Template-Literal.
     Ein Backtick in einem GLSL-Kommentar beendet den String — gemessen 08.09.: das Modul lud
     nicht mehr (»Unexpected identifier«), und der Wirt meldete nur »Flood nicht geladen«. */
  vec2 zelle = uSpan / 64.0;
  vec2 start = uOrigin + uSpan * vUv - zelle * 0.5;
  float s = 0.0;
  for (int y = 0; y < 8; y++) {
    for (int x = 0; x < 8; x++) {
      s += texture2D(tSrc, start + (vec2(float(x), float(y)) + 0.5) / 8.0 * zelle).a;
    }
  }
  gl_FragColor = vec4(vec3(s / 64.0), 1.0);
}`;

export default class Flood {
  static describe() {
    return { name: 'Flood', capabilities: ['three@0.160', 'renderer'], view: '2d', determinism: 'seeded', spec: SPEC };
  }

  constructor(o = {}) {
    this.THREE = o.THREE || o.three;
    this.renderer = o.renderer;
    this.log = (s) => (o.log || console.info)('[flood] ' + s);
    this.an = o.an !== false;
    this.chance = SPEC.chance;
    this.noise = SPEC.noise;
    /* ⚠ JEDES FELD, DAS `probe()` LIEST, MUSS DER KONSTRUKTOR SETZEN. `einzug` entstand nur in
       `binden()` — und zwischen `new Flood(…)` und dem ersten `binden()` liegen im Integrator ein
       paar Zeilen. Der Messtakt (alle 500 ms, bedingungslos) fiel in dieses Fenster und warf
       »Cannot read properties of undefined«, wodurch der GANZE Prüfdurchgang abbrach (gemessen
       08.09., Kritiker). Dauerhaft getroffen hätte es jeden Lauf ohne Renderer, denn dann kehrt
       `binden()` früh zurück und `einzug` blieb für immer leer.
       Merksatz: ein Modul muss ab dem Konstruktor auskunftsfähig sein, nicht erst ab der Bindung. */
    this.einzug = [0, 0];
    this.loesen = 0;   // 0 = normal · > 0 = die Karte hebt sich ab (siehe Shader)
    this.schritte = 0; this.verworfen = 0; this.passes = 0;
    this.deckung = 0; this.mittel = 0; this.messungen = 0; this.rueckgang = 0;
    this._akk = 0; this._leseT = 0; this._vorher = null;
    this._buf = null;
  }

  /** Quelle (Canvas-Textur der Zensur), Maske (Kartenkontur) und das Maß. */
  binden(o = {}) {
    const T = this.THREE;
    if (!T || !this.renderer) { this.log('kein Wirt (THREE/renderer fehlen) — Modul bleibt aus'); return null; }
    const w = o.w || SPEC.lange, h = o.h || SPEC.lange;
    this.quelle = o.quelle || this.quelle;
    this.maske = o.maske || this.maske;
    /* ⚠ DIE TUSCHEFARBE KOMMT ALS sRGB-BYTES (#1f1a14, dieselbe Konstante wie die Canvas-Schicht)
       UND MUSS INS ARBEITSLICHT GERECHNET WERDEN. Erster Wurf hat 31/255 = 0,12 direkt als
       Shader-Wert genommen — das ist 0,12 LINEAR, also #5d5750: die Karte lief grau zu statt
       schwarz (gemessen 08.09. am Bild). `THREE.Color` macht die Umrechnung; dreißig Zeilen
       Farbmanagement gehören nicht in einen Flood. */
    this.inkRoh = o.ink || this.inkRoh || [31, 26, 20];
    /* Das Messfenster gehört der Zensur, nicht diesem Modul: derselbe Einzug, dieselbe Fläche,
       sonst vergleicht das Prüfblatt zwei verschiedene Karten. Als Anteil der Kante, damit die
       Zahl von der Auflösung unabhängig ist. */
    this.einzug = o.einzug || this.einzug || [0, 0];
    if (this.matKlein) {
      this.matKlein.uniforms.uOrigin.value.set(this.einzug[0], this.einzug[1]);
      this.matKlein.uniforms.uSpan.value.set(1 - 2 * this.einzug[0], 1 - 2 * this.einzug[1]);
    }
    const col = new T.Color();
    try { col.setRGB(this.inkRoh[0] / 255, this.inkRoh[1] / 255, this.inkRoh[2] / 255, T.SRGBColorSpace); }
    catch (e) { col.setRGB(this.inkRoh[0] / 255, this.inkRoh[1] / 255, this.inkRoh[2] / 255); }
    this.ink = [col.r, col.g, col.b];
    if (this.mat) this.mat.uniforms.uInk.value.set(col.r, col.g, col.b);
    if (this.matWisch) this.matWisch.uniforms.uInk.value.set(col.r, col.g, col.b);
    if (this.W === w && this.H === h && this.a) { this._uniformsNeu(); this.wischen(); return this.texture(); }
    this.frei();
    this.W = w; this.H = h;
    const opt = { format: T.RGBAFormat, type: T.UnsignedByteType, depthBuffer: false, stencilBuffer: false,
                  minFilter: T.LinearFilter, magFilter: T.LinearFilter, generateMipmaps: false };
    this.a = new T.WebGLRenderTarget(w, h, opt);
    this.b = new T.WebGLRenderTarget(w, h, opt);
    for (const rt of [this.a, this.b]) { rt.texture.colorSpace = T.SRGBColorSpace; rt.texture.wrapS = rt.texture.wrapT = T.ClampToEdgeWrapping; }
    const R = SPEC.leseRaster;
    this.klein = new T.WebGLRenderTarget(R, R, { format: T.RGBAFormat, type: T.UnsignedByteType, depthBuffer: false, stencilBuffer: false, minFilter: T.NearestFilter, magFilter: T.NearestFilter, generateMipmaps: false });
    this._buf = new Uint8Array(R * R * 4);
    this.szene = new T.Scene();
    this.kam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.mat = new T.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false,
      /* ⚠ KEIN BLENDING. Dieses Ziel ist ein ZUSTAND, kein Bild: jeder Pass schreibt den neuen Wert
         hin, er mischt ihn nicht mit dem alten (das alte steht ohnehin als `tPrev` im Shader).
         Mit `transparent: true` und Normal-Blending war die Alpha-Rechnung doppelt — einmal im
         Shader (`max`) und einmal in der Hardware (`src + dst·(1−src)`) — und das Ziel war nach dem
         ersten Bild überall deckend: gemessen 08.09., Flood-Deckung 100 % bei 13 Spritzern. */
      blending: T.NoBlending, transparent: false,
      uniforms: {
        tSrc: { value: this.quelle || null }, tPrev: { value: this.b.texture }, tMask: { value: this.maske || null },
        uPx: { value: new T.Vector2(1 / w, 1 / h) }, uInk: { value: new T.Vector3(this.ink[0], this.ink[1], this.ink[2]) },
        uNoise: { value: this.noise }, uChance: { value: this.chance },
        uSpannung: { value: new T.Vector2(SPEC.spannung[0], SPEC.spannung[1]) },
        uAusgleich: { value: SPEC.spannungsAusgleich },
        uFaser: { value: SPEC.faser },
        uSchritt: { value: 0 }, uDrift: { value: SPEC.drift },
        uErase: { value: Array.from({length:8},()=>new T.Vector4(0,0,0,1)) },
        uLoesen: { value: 0 }
      }
    });
    this.quad = new T.Mesh(new T.PlaneGeometry(2, 2), this.mat);
    this.quad.frustumCulled = false;
    this.szene.add(this.quad);
    this.matKlein = new T.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG_KLEIN, depthTest: false, depthWrite: false, blending: T.NoBlending,
      uniforms: {
        tSrc: { value: this.a.texture },
        uOrigin: { value: new T.Vector2(this.einzug[0], this.einzug[1]) },
        uSpan: { value: new T.Vector2(1 - 2 * this.einzug[0], 1 - 2 * this.einzug[1]) }
      }
    });
    /* Gewischt wird mit einem PASS, nicht mit `clear()`: die Alpha-Null eines `clear` hängt an
       Kontext-Attributen des Wirts (`alpha`, `premultipliedAlpha`), die dieses Modul nicht besitzt
       — gemessen 08.09.: nach `setClearAlpha(0)` stand in der Ecke trotzdem Alpha 255. Ein Pass mit
       `NoBlending` schreibt genau, was dasteht. */
    this.matWisch = new T.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG_WISCH, depthTest: false, depthWrite: false, blending: T.NoBlending,
      uniforms: { uInk: { value: new T.Vector3(this.ink[0], this.ink[1], this.ink[2]) } }
    });
    this.wischen();
    this.log('zwei Ziele ' + w + ' × ' + h + ' · Schritt ' + (SPEC.schritt * 1000).toFixed(1) + ' ms · Chance ' + this.chance
      + ' /Schritt (≈ ' + (this.chance / SPEC.schritt).toFixed(1) + ' Texel/s) · Rücklesung ' + R + ' × ' + R
      + ' auf der Messfläche (Einzug ' + (this.einzug[0] * 100).toFixed(1) + ' / ' + (this.einzug[1] * 100).toFixed(1) + ' % je Seite, 64 Abtastungen je Zelle)');
    return this.texture();
  }

  _uniformsNeu() {
    if (!this.mat) return;
    this.mat.uniforms.tSrc.value = this.quelle || null;
    this.mat.uniforms.tMask.value = this.maske || null;
  }

  /** Beide Ziele leer (neue Karte). Die Quelle ist dann ohnehin auch gewischt. */
  wischen() {
    if (!this.renderer || !this.a || !this.matWisch) return false;
    const r = this.renderer, vor = r.getRenderTarget();
    this.quad.material = this.matWisch;
    for (const rt of [this.a, this.b]) { r.setRenderTarget(rt); r.render(this.szene, this.kam); }
    this.quad.material = this.mat;
    r.setRenderTarget(vor);
    this.schritte = 0; this.deckung = 0; this.mittel = 0; this._vorher = null; this._akk = 0;
    this._angestossen = false;
    this.loesen = 0;
    return true;
  }

  texture() { return this.a ? this.a.texture : null; }

  /* Ein Bild: den Rest aus dem Akkumulator in feste Schritte zerlegen. Kein Schritt, kein Pass —
     bei 144 Hz rechnet dieses Modul in jedem zweiten Bild nichts, und das ist richtig so. */
  schritt(dt) {
    if (!this.an || !this.a || !this.renderer || !this.quelle) return 0;
    this._akk += Math.max(0, dt || 0);
    let n = 0;
    while (this._akk >= SPEC.schritt && n < SPEC.maxSchritte) { this._akk -= SPEC.schritt; this._pass(); n++; }
    if (this._akk >= SPEC.schritt) {
      /* Nicht aufholen, sondern wegwerfen UND zählen. Aufholen nach einem Tab-Wechsel heißt: ein
         Bild rechnet 300 Schritte, das Bild dauert eine Sekunde, und der nächste holt wieder auf. */
      const weg = Math.floor(this._akk / SPEC.schritt);
      this.verworfen += weg; this._akk -= weg * SPEC.schritt;
    }
    this._leseT += Math.max(0, dt || 0);
    if (this._leseT >= SPEC.leseTakt) { this._leseT = 0; this._lesen(); }
    return n;
  }

  radieren(x,y,r,aspect) { if(this.mat){const slots=this.mat.uniforms.uErase.value;const slot=slots.find(v=>v.z===0)||slots.reduce((a,b)=>a.z<b.z?a:b);if(slot.z<r || slot.z===0)slot.set(x,y,r,aspect);this._erasePasses=3;} }

  _pass() {
    const r = this.renderer, u = this.mat.uniforms;
    u.tSrc.value = this.quelle;
    u.tMask.value = this.maske;
    u.tPrev.value = this.a.texture;     // gelesen wird das ALTE Bild …
    u.uNoise.value = this.noise;
    u.uChance.value = this.chance;
    u.uSchritt.value = this.schritte;
    u.uLoesen.value = this.loesen || 0;
    const vor = r.getRenderTarget();
    r.setRenderTarget(this.b);          // … geschrieben das andere
    r.render(this.szene, this.kam);
    r.setRenderTarget(vor);
    const t = this.a; this.a = this.b; this.b = t;   // Tausch: `a` ist immer das JÜNGSTE Bild
    if(this._erasePasses>0 && --this._erasePasses===0)for(const v of u.uErase.value)v.z=0;
    this.schritte++; this.passes++;
  }

  /* Deckungsgrad des GEZEIGTEN Bildes — IN ZWEI HÄLFTEN, UM EINEN TAKT VERSETZT.
     ⚠ GEORGS BEFUND 08.09.: »es gibt regelmäßig kurze Pausen, wo alles stehen bleibt«. Genau das
     ist `readRenderTargetPixels` direkt nach dem Zeichnen: die CPU fragt die GPU nach Pixeln, die
     die GPU noch nicht fertig hat, und wartet — ein Synchronisationspunkt, der die ganze
     Bildschleife anhält. Die Zahl ist winzig (16 kB), das Warten ist es nicht.
     Jetzt wird der Abwärtspass in EINEM Takt gezeichnet und im NÄCHSTEN gelesen. Dann ist die GPU
     mit ihm längst durch, die Abfrage findet ein fertiges Bild und wartet auf nichts. Preis: die
     Deckung ist eine Sekunde alt — bei 1,2 Texel/s Ausbreitung ist das eine Zahl hinter dem Komma.
     Merksatz: eine Rücklesung kostet nicht Bandbreite, sondern Gleichzeitigkeit. */
  _lesen() {
    if (!this.a || !this.klein || !this.renderer) return null;
    const deck = this._leseHolen();
    this._leseAnstoss();
    return deck;
  }

  /** Hälfte 1: den Abwärtspass zeichnen (kein Warten, reines Zeichnen). */
  _leseAnstoss() {
    const r = this.renderer;
    this.matKlein.uniforms.tSrc.value = this.a.texture;
    this.quad.material = this.matKlein;
    const vor = r.getRenderTarget();
    r.setRenderTarget(this.klein);
    r.render(this.szene, this.kam);
    r.setRenderTarget(vor);
    this.quad.material = this.mat;
    this._angestossen = true;
  }

  /** Hälfte 2: das Ergebnis des VORIGEN Anstosses abholen. */
  _leseHolen() {
    if (!this._angestossen) return null;
    const R = SPEC.leseRaster;
    try { this.renderer.readRenderTargetPixels(this.klein, 0, 0, R, R, this._buf); }
    catch (e) { this.log('Rücklesung nicht möglich: ' + ((e && e.message) || e)); return null; }
    const grenze = SPEC.schwelle * 255;
    let sum = 0, ueber = 0;
    for (let i = 0; i < this._buf.length; i += 4) { sum += this._buf[i]; if (this._buf[i] >= grenze) ueber++; }
    const n = R * R;
    const deck = ueber / n;
    /* ⚠ WÄHREND DER AUFLÖSUNG WIRD DER RÜCKGANG NICHT GEZÄHLT. Das Absinken der Deckung ist dort der
       ZWECK, nicht der Fehler — dieselbe Falle wie `_vorher` über einen Kartenwechsel (zensur.v3):
       ein Boden, der einen gewollten Vorgang als Verstoß meldet, wird abgeschaltet statt gelesen. */
    if (this._vorher != null && deck < this._vorher && !this.loesen) this.rueckgang = Math.max(this.rueckgang, this._vorher - deck);
    this._vorher = deck;
    this.deckung = deck;
    this.mittel = sum / 255 / n;
    this.messungen++;
    return deck;
  }

  probe() {
    const e = this.einzug || [0, 0];
    return {
      an: !!this.an, steht: !!this.a,
      deckung: +(this.deckung * 100).toFixed(1),
      mittel: +(this.mittel * 100).toFixed(1),
      rueckgang: +(this.rueckgang * 100).toFixed(2),
      messungen: this.messungen,
      schritte: this.schritte, passes: this.passes, verworfen: this.verworfen,
      chance: this.chance, noise: this.noise,
      texelProS: +(this.chance / SPEC.schritt).toFixed(1),
      einzug: [+(e[0] * 100).toFixed(1), +(e[1] * 100).toFixed(1)],
      ziel: this.a ? this.W + '×' + this.H : '–'
    };
  }

  zeile() {
    if (!this.a) return '[flood] steht nicht' + (this.an ? '' : ' · aus');
    const p = this.probe();
    return '[flood] ' + (p.an ? 'an' : 'AUS') + ' · Deckung ' + p.deckung.toFixed(1) + ' % (Mittel ' + p.mittel.toFixed(1) + ' %)'
      + ' · ' + p.schritte + ' Schritte à ' + (SPEC.schritt * 1000).toFixed(1) + ' ms'
      + ' · ' + p.texelProS + ' Texel/s · Feld ' + p.noise
      + ' · Rückgang ' + p.rueckgang.toFixed(2) + ' %'
      + (p.verworfen ? ' · ' + p.verworfen + ' Schritte verworfen' : '')
      + ' · Ziel ' + p.ziel;
  }

  /* C24: der Flood darf per Konstruktion nicht heller werden (jeder Schritt ist ein Maximum).
     Gemessen wird es trotzdem — eine Konstruktion, die man nicht prüft, ist eine Behauptung. */
  tor() {
    const ok = this.rueckgang <= 0.002;
    return { name: 'flood.v3', bestanden: ok ? 1 : 0, von: 1, pass: ok,
             zeile: 'C24 · Rückgang ' + (this.rueckgang * 100).toFixed(2) + ' % über ' + this.messungen + ' Lesungen (max-Blend)' };
  }

  frei() {
    for (const rt of [this.a, this.b, this.klein]) if (rt) rt.dispose();
    this.a = this.b = this.klein = null;
    if (this.quad) { if (this.quad.geometry) this.quad.geometry.dispose(); }
    for (const m of [this.mat, this.matKlein, this.matWisch]) if (m) m.dispose();
    this.mat = this.matKlein = this.matWisch = null; this.quad = null; this.szene = null;
    return true;
  }

  dispose() { return this.frei(); }
}
