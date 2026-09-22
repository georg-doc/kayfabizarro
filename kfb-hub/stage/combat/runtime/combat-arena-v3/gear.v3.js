/* KFB Combat Arena v3 · gear.v3.js — DAS BEDIEN-ZAHNRAD (3D, Kind der Kamera)
   ────────────────────────────────────────────────────────────────────────────────────────────────
   HERKUNFT: die ZAHLEN sind 1:1 aus `KFB Boxel Blitz v4.dc.html` (Aufruf von `createGear`), samt
   Georgs Vorgabe vom 04.09. und der Begründung, die dort im Kommentar steht:

       corner: 'tr' · sizePx: 29 · hitPx: 44 · marginPx: 16
       idleSpin: 0.30 · color: 0xc2b69c · metal: 0.42 · rough: 0.5

       »GRÖSSE UND TREFFERFLÄCHE SIND ZWEI ZAHLEN (Georg 04.09.: 3D gear 1/3 kleiner). Optisch 29
        Bildpunkte = zwei Drittel der bisherigen 44; getroffen wird weiter auf 44, der kleinsten
        Fläche, die auf einem Telefon zuverlässig sitzt. Vorher war das EINE Zahl — kleiner machen
        hätte die Bedienung mit verkleinert.«

   **Das MODELL ist nicht 1:1** — `boxelball-v1/gear.v1.js` ist nicht im Repo (gesucht am 06.09.
   über alle 6 568 Dateien: kein Treffer). Der Körper hier ist aus Ring und Zähnen gebaut; Größe,
   Trefferfläche, Randabstand, Ruhedrehung und Material sind die dokumentierten Werte.
   Sobald die Datei gepusht ist, wird diese ersetzt — die Naht ist `createGear({THREE, camera})`
   und `rect()`.

   WARUM PIXEL UND NICHT WELTEINHEITEN: ein Bedienelement hat eine Größe im BILD. Ein Zahnrad in
   Welteinheiten wird mit dem Abstand größer und kleiner — dann ist es kein Knopf mehr.            */

export function createGear({ THREE, camera, scene, renderer, params = {} }) {
  /* Siehe `gutter.v3.js`: ohne Kamera im Baum ist auch das Zahnrad unsichtbar. */
  if (scene && !camera.parent) scene.add(camera);
  const P = Object.assign({ corner: 'tr', sizePx: 29, hitPx: 44, marginPx: 16, idleSpin: 0.30,
                            color: 0xc2b69c, metal: 0.42, rough: 0.5, dist: 3 }, params);

  const grp = new THREE.Group();
  grp.name = 'gear-3d';
  const mat = new THREE.MeshStandardMaterial({ color: P.color, metalness: P.metal, roughness: P.rough });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.13, 10, 26), mat);
  grp.add(ring);
  /* Acht Zähne. Weniger liest als Mutter, mehr als Kreis — bei 29 Bildpunkten ist die Silhouette
     alles, was ankommt. */
  for (let i = 0; i < 8; i++) {
    const z = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.17, 0.2), mat);
    const a = (i / 8) * Math.PI * 2;
    z.position.set(Math.cos(a) * 0.44, Math.sin(a) * 0.44, 0);
    z.rotation.z = a;
    grp.add(z);
  }
  const nabe = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.05, 8, 18), mat);
  grp.add(nabe);
  camera.add(grp);

  let hover = false, press = 0, spin = 0, lastW = 0, lastH = 0;
  const mitte = new THREE.Vector2();

  /* EINE Rechnung für Ort UND Größe. Bei Entfernung `dist` ist ein Bildpunkt
     `2·dist·tan(fov/2)/Bildhöhe` Welteinheiten groß — daraus folgt beides, und die Trefferfläche
     im DOM bekommt ihre Lage von hier (`rect()`), statt eine zweite Pixelzahl zu führen. */
  function lege() {
    /* CSS-Pixel, nicht Bildpuffer: `sizePx` ist eine Zahl im BILD, und der Bildpuffer trägt bei
       dpr 2 das Doppelte. Und gemessen wird JETZT, nicht beim Bauen — beim Bauen ist die Leinwand
       noch 300 × 150 (Browser-Vorgabe), daraus wurde eine 3,6-fach zu große Kurbel. */
    const el = renderer && renderer.domElement;
    const size = { x: (el && el.clientWidth) || 1600, y: (el && el.clientHeight) || 900 };
    lastW = size.x; lastH = size.y;
    const h = 2 * Math.tan((camera.fov * Math.PI) / 360) * P.dist;
    const pro = h / Math.max(1, size.y);              // Welteinheiten je Bildpunkt
    const halb = (P.sizePx / 2) * pro;
    const x = size.x / 2 - (P.marginPx + P.sizePx / 2);
    const y = size.y / 2 - (P.marginPx + P.sizePx / 2);
    const sx = P.corner.indexOf('l') >= 0 ? -1 : 1;
    grp.position.set(sx * x * pro, y * pro, -P.dist);
    grp.scale.setScalar(halb / 0.57);                 // 0,57 = Außenradius des Körpers (0,44 + 0,17/2 + Ringdicke)
    mitte.set(size.x / 2 + sx * x, size.y / 2 - y);
  }
  lege();

  return {
    group: grp,
    /* Die Trefferfläche folgt dem Zahnrad. `hitPx` ist absichtlich größer als `sizePx`. */
    rect() {
      return { left: mitte.x - P.hitPx / 2, top: mitte.y - P.hitPx / 2, size: P.hitPx };
    },
    hover(on) { hover = !!on; },
    press() { press = 1; },
    resize: lege,
    /* Gibt `true` zurück, wenn neu gelegt wurde — dann rückt der Aufrufer die DOM-Trefferfläche
       nach. Zwei Leser, eine Rechnung. */
    update(dt) {
      const el = renderer && renderer.domElement;
      let neu = false;
      if (el && el.clientWidth > 0 && (el.clientWidth !== lastW || el.clientHeight !== lastH)) { lege(); neu = true; }
      spin += dt * (P.idleSpin + (hover ? 1.1 : 0) + press * 6);
      press = Math.max(0, press - dt * 3.2);
      grp.rotation.z = spin;
      grp.rotation.x = -0.34;                          // leicht gekippt: ein Rad, kein Symbol
      return neu;
    },
    zeile() {
      return '[gear] ' + P.sizePx + ' px optisch / ' + P.hitPx + ' px Treffer · Rand ' + P.marginPx
        + ' px · Ruhedrehung ' + P.idleSpin + ' · Zahlen aus Boxel Blitz v4, Modell nicht gepusht';
    },
    dispose() { camera.remove(grp); grp.traverse((o) => { if (o.geometry) o.geometry.dispose(); }); mat.dispose(); }
  };
}

export default createGear;
