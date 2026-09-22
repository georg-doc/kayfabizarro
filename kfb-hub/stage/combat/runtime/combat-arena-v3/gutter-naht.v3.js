/* KFB Combat Arena v3 · gutter-naht.v3.js — DIE NAHT ZUM ECHTEN SHADER
   ────────────────────────────────────────────────────────────────────────────────────────────────
   `gutter.v5.js` liegt daneben **unverändert** (766 Zeilen, Datei aus dem laufenden Spiel, von Georg
   am 06.09. geliefert). Kein Nachbau mehr: der Shader-Code ist 1:1. Diese Datei ist ausschließlich
   die Naht — und die ist laut Paket-README »vier Namen breit«:

       stage.camera · stage.scene · stage.renderer · stage.panelGroup
       + stage.metrics() → { cardLocal:{w,h,cx,cy}, pxPerUnit, W, H }

   Die Arena hat keine `panelGroup` (sie hat eine LIEGENDE Karte, keine gekippte Panel-Ebene), also
   baut diese Datei sie: eine Ebene als **Kind der Kamera**. Begründung, damit die Abweichung nicht
   als Schlamperei durchgeht:

   · Im Spiel ist die Fläche Kind der Kartengruppe — »aufrecht ist sie der Gutter zwischen den
     Blättern, gekippt ist sie das Spielfeld« (Modulkopf gutter.v5). Beides sind Ansichten EINER
     stehenden Kartenebene.
   · In der Arena liegt die Karte flach und die Kamera umkreist sie bei 37–46° Neigung. Eine Fläche
     in der Kartenebene wäre dort der BODEN: `footprint()` bekäme keine vier Eckentreffer (die
     oberen Bildstrahlen laufen über den Horizont), das Modul fiele auf seinen Rückweg zurück und
     die obere Bildhälfte bliebe leer. Gemessen ist das nicht nötig — es ist Geometrie.
   · Als Kind der Kamera trifft `footprint()` immer alle vier Ecken, die Deckungszahl
     (`stats().deckung`) bleibt also die echte Abnahme und kann durchfallen.

   ZWEI ZAHLEN MÜSSEN AUF DIESE EBENE UMGERECHNET WERDEN, sonst stimmt der Look nicht:
   · `pxPerUnit` — Bildpunkte je Welteinheit **auf der Fläche** (nicht an der Karte). Daraus zieht
     v5 die Rasterweite zurück (`dotPx` ist ein Abstand IM BILD, Z. 545). Falscher Bezug = falsche
     Rasterfeinheit.
   · `cardLocal.w` — daraus macht v5 `uScale = 17.4 / card.w`, also die Wellenlänge im Verhältnis
     zur Karte. Im Spiel ist die Fläche rund 2,56 × so breit wie die Karte (README/Modulkopf:
     Fußabdruck 14,6 bei Kartenbreite 5,7). Damit hier gleich viele Wellen über das Bild laufen,
     wird eine **fiktive Kartenbreite** aus derselben Verhältniszahl gebildet.
   Beide stehen an genau einer Stelle: `metrics()`.                                                */

/* ⚠ DIE FARBEN SIND **LINEARE TRIPEL**, KEINE HEX-CODES — und das ist kein Geschmack.
   Der Shader bekommt seine Vorgabewerte im Original als rohe Zahlen
   (`new THREE.Color(0.29, 0.51, 0.58)`), also als **lineare** Werte. Ein Hex-Code geht durch die
   sRGB-Umrechnung von three und kommt deutlich dunkler heraus: gemessen 06.09. lag der Grundton
   mit `#9ecbd6` bei **80,142,161** gegen 144,192,200 der Referenz — 64 Stufen zu dunkel, obwohl
   der Hex-Wert heller aussieht als das Ziel. Deshalb steht `kfb` hier **wörtlich auf den
   Originalwerten** (0.29|0.51|0.58 → 0.62|0.80|0.84 → Kontur 0.10|0.16|0.18), und die anderen
   Fluids sind auf dieselben Helligkeiten gesetzt, nur mit anderem Ton.
   Merksatz: eine Zahl im Shader ist linear, ein Hex-Code ist es nie. */
const LIN = { kfb: [[0.29, 0.51, 0.58], [0.62, 0.80, 0.84], [0.10, 0.16, 0.18]],
  wasser:    [[0.20, 0.45, 0.58], [0.55, 0.78, 0.86], [0.08, 0.14, 0.18]],
  bubblegum: [[0.58, 0.24, 0.46], [0.88, 0.62, 0.76], [0.20, 0.06, 0.14]],
  oel:       [[0.16, 0.18, 0.22], [0.48, 0.52, 0.58], [0.05, 0.06, 0.07]],
  saeure:    [[0.30, 0.52, 0.18], [0.72, 0.86, 0.52], [0.09, 0.14, 0.06]] };
export const FLUIDE = LIN;

export async function createGutter({ THREE, camera, scene, renderer, params = {} }) {
  const P = Object.assign({ palette: 'kfb', duo: 0.30, dotPx: 9, calm: 1.0, speed: 0.32, dist: 26 }, params);

  /* Ohne die Kamera im Baum wird kein Kind der Kamera gezeichnet (am 06.09. schon einmal bezahlt:
     Palette stand auf bubblegum, im Bildpuffer lag der Grundton des Wirts). */
  if (scene && !camera.parent) scene.add(camera);

  const panelGroup = new THREE.Group();
  panelGroup.name = 'gutter-panel';
  panelGroup.position.z = -P.dist;      // die Fläche selbst liegt nochmal GZ = −1,2 dahinter
  camera.add(panelGroup);

  /* Das Verhältnis Fläche : Karte aus dem Spiel — die eine Zahl, die die Wellenlänge trägt. */
  const K = 2.56;
  const px = () => {
    const el = renderer && renderer.domElement;
    return { W: (el && el.clientWidth) || 1600, H: (el && el.clientHeight) || 900 };
  };
  /* Sichtbare Breite/Höhe auf der Ebene der Fläche (Kamera-Kind, also senkrecht zum Blick). */
  const sicht = () => {
    const d = P.dist + 1.2;
    const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * d;
    return { w: h * camera.aspect, h, d };
  };

  const stage = {
    camera, scene, renderer, panelGroup,
    metrics() {
      const { W, H } = px(), s = sicht();
      return {
        W, H,
        /* Bildpunkte je Welteinheit AUF DER FLÄCHE. */
        pxPerUnit: H / Math.max(1e-3, s.h),
        cardLocal: { w: s.w / K, h: s.h / K, cx: 0, cy: 0 }
      };
    }
  };

  const mod = await import('./gutter.v5.js?v=1to1');
  const g = mod.createGutter({ THREE, stage, params: {
    channel: 'fluid', palette: 'kfb', duo: P.duo, dotPx: P.dotPx, calm: P.calm, speed: P.speed
  } });

  /* Ein `THREE.Color`-Objekt geht durch `new THREE.Color(obj)` unverändert durch — genau so
     kommen die linearen Tripel ohne sRGB-Umrechnung im Uniform an. */
  const C = (t) => new THREE.Color(t[0], t[1], t[2]);
  let name = null;
  const setzeFarben = (nm) => {
    const f = LIN[nm]; if (!f) return name;
    name = nm; g.setFluidColors(C(f[0]), C(f[1]), C(f[2])); return name;
  };
  setzeFarben(FLUIDE[P.palette] ? P.palette : 'kfb');

  const gross = () => { const { W, H } = px(); g.setSize(W, H); g.setContext(stage.metrics()); };
  gross();

  /* ⚠ TONEMAPPING AUS — dieselbe Regel wie beim Kartenblatt und der Tusche (§19: die Tusche lief
     als beleuchtetes Material grau statt schwarz). Der Wirt fährt ACES mit Exposure 1,10; die
     Fläche ist aber ein DRUCK, kein Licht. Ohne diese Zeile liegt der Grundton 64 Stufen unter der
     Referenz. Die 1:1-Datei bleibt unangetastet — die Anpassung an den Wirt gehört in die Naht. */
  const flaeche = panelGroup.children.find((o) => o.isMesh);
  if (flaeche && flaeche.material) { flaeche.material.toneMapped = false; flaeche.material.needsUpdate = true; }

  let lastW = 0, lastH = 0;
  return {
    stage, v5: g, mesh: panelGroup,
    get palette() { return name; },
    setPalette: setzeFarben,
    /* rng ist Pflicht: `Math.random` würde Boden C10 fällen und den Seed entwerten. */
    zufall(rng) {
      const keys = Object.keys(FLUIDE);
      const r = typeof rng === 'function' ? rng() : 0;
      return setzeFarben(keys[Math.min(keys.length - 1, Math.floor(r * keys.length))]);
    },
    setParams(o = {}) { g.setParams(o); },
    /* Ereignisse des Spiels an die Fläche: ein Treffer wirft eine Welle. Koordinaten sind die der
       Fläche, also wird der Weltpunkt hier nur durchgereicht. */
    ripple(x, y, kraft) { return g.ripple(x, y, kraft); },
    on(ev, ctx) { return g.on(ev, ctx); },
    resize: gross,
    update(dt) {
      const { W, H } = px();
      if (W !== lastW || H !== lastH) { lastW = W; lastH = H; gross(); }
      else g.setContext(stage.metrics());     // Neigung/Bildwinkel können sich jederzeit ändern
      g.tick(dt);
    },
    zeile() {
      const s = g.stats();
      const d = s.deckung || {};
      return '[gutter] gutter.v5.js 1:1 · ' + name + ' · duo ' + s.duo + ' dotPx ' + s.dotPx
        + ' calm ' + s.calm + ' speed ' + s.speed
        + ' · Fläche ' + (s.fluid ? s.fluid.w + '×' + s.fluid.h + ' u, uDot ' + s.fluid.uDot : '—')
        + ' · Deckung ' + (d.deckt ? '✓ 0/0/0/0' : (d.oben + '/' + d.unten + '/' + d.links + '/' + d.rechts))
        + ' · Neubauten ' + s.neubauten;
    },
    dispose() { g.dispose(); camera.remove(panelGroup); }
  };
}

export default createGutter;
