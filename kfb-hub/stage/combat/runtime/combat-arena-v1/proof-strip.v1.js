/**
 * proof-strip.v1.js — der Beweisstreifen (Sitzungsvorlage 1.2, Abschnitt 5).
 *
 * Ein Bild ohne seine Bedingungen ist eine Behauptung. Dieses Werkzeug rendert N Ansichten
 * derselben Szene AUS DEM RENDERER (Bedingung 6), setzt eine Kontrollprobe ins selbe Bild
 * (Bedingung 5), brennt Frage, Datei, Clip, Zeit und Pixelmaß in die Kopfzeile (Bedingung 1)
 * und gibt eine 2D-Leinwand zurück, die jede Seitenaufnahme lesen kann.
 *
 * Technik: der Renderer wird kurz auf Zellengröße gesetzt, rendert, und die Leinwand wird
 * SYNCHRON kopiert (drawImage vom WebGL-Canvas, bevor der Browser komponiert). Kein
 * RenderTarget — dort greifen Tone Mapping und Farbraum des Bildschirms nicht, das Bild wäre
 * ein anderes als das, was Georg sieht.
 */
export function renderProofStrip(o) {
  const { THREE, renderer, scene, camera, target, radius } = o;
  const views = o.views || defaultViews();
  const cw = o.cellW || 380, ch = o.cellH || 300, head = o.headH || 118, pad = 6;
  const cols = o.cols || 3, rows = Math.ceil(views.length / cols);
  const out = document.createElement('canvas');
  out.width = cols * cw + (cols + 1) * pad;
  out.height = head + rows * (ch + pad) + pad;
  const g = out.getContext('2d');
  g.fillStyle = '#f3ead3'; g.fillRect(0, 0, out.width, out.height);

  // Kopfzeile: die Frage zuerst, dann die Umgebung
  g.fillStyle = '#1f1a14';
  g.font = '700 22px "Space Grotesk", system-ui, sans-serif';
  g.fillText(o.question || 'question missing', pad + 8, 30);
  g.font = '500 13px "Space Grotesk", system-ui, sans-serif';
  const dpr = renderer.getPixelRatio();
  const size = renderer.getSize(new THREE.Vector2());
  const lines = [].concat(o.lines || [], [
    'Renderer ' + Math.round(size.x * dpr) + '×' + Math.round(size.y * dpr) + ' px · dpr ' + dpr + ' · cell ' + cw + '×' + ch + ' · fov ' + camera.fov + '° · orbit radius ' + radius.toFixed(2),
    'Time ' + new Date().toISOString().replace('T', ' ').slice(0, 19) + ' · page visible: ' + (document.visibilityState === 'visible' ? 'yes' : 'NO') + ' · camera per cell: azimuth/elevation as labelled · red frame = control cell',
  ]);
  lines.forEach((l, i) => g.fillText(l, pad + 8, 52 + i * 17));

  // Renderer auf Zellenmaß, dann jede Ansicht rendern und synchron kopieren
  const prevPR = dpr, prevSize = size.clone();
  const prevAspect = camera.aspect, prevPos = camera.position.clone(), prevQuat = camera.quaternion.clone();
  renderer.setPixelRatio(1);
  renderer.setSize(cw, ch, false);
  const cam = new THREE.PerspectiveCamera(camera.fov, cw / ch, camera.near, camera.far);
  const results = [];
  views.forEach((v, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = pad + col * (cw + pad), y = head + pad + row * (ch + pad);
    let restore = null;
    if (v.before) { try { restore = v.before(); } catch (e) { console.warn('[proof] before', e); } }
    const az = (v.az || 0) * Math.PI / 180, el = (v.el || 0) * Math.PI / 180;
    const r = radius * (v.zoom || 1);
    cam.position.set(target.x + r * Math.cos(el) * Math.sin(az), target.y + r * Math.sin(el), target.z + r * Math.cos(el) * Math.cos(az));
    cam.lookAt(target);
    cam.updateProjectionMatrix();
    renderer.render(scene, cam);
    g.drawImage(renderer.domElement, x, y, cw, ch);
    if (typeof restore === 'function') { try { restore(); } catch (e) { console.warn('[proof] restore', e); } }
    else if (v.after) { try { v.after(); } catch (e) {} }
    // Stempel je Zelle: Name, Winkel — eingebrannt, nicht daneben
    g.fillStyle = 'rgba(31,26,20,0.82)'; g.fillRect(x, y + ch - 26, cw, 26);
    g.fillStyle = '#f7f0da'; g.font = '700 13px "Space Grotesk", system-ui, sans-serif';
    g.fillText((i + 1) + ' · ' + v.label + ' · az ' + (v.az || 0) + '° el ' + (v.el || 0) + '°' + (v.note ? ' · ' + v.note : ''), x + 8, y + ch - 8);
    g.strokeStyle = v.control ? '#b8361f' : '#1f1a14'; g.lineWidth = v.control ? 4 : 2;
    g.strokeRect(x + 1, y + 1, cw - 2, ch - 2);
    results.push({ label: v.label, az: v.az, el: v.el, control: !!v.control });
  });
  renderer.setPixelRatio(prevPR);
  renderer.setSize(prevSize.x, prevSize.y, false);
  camera.aspect = prevAspect; camera.position.copy(prevPos); camera.quaternion.copy(prevQuat); camera.updateProjectionMatrix();
  return { canvas: out, results, dataUrl: () => out.toDataURL('image/png') };
}

export function defaultViews() {
  return [
    { label: 'Front', az: 0, el: 8 },
    { label: 'Three-quarter left', az: -42, el: 14 },
    { label: 'Profile left', az: -90, el: 6 },
    { label: 'Back right', az: 150, el: 12 },
    { label: 'From above', az: 20, el: 58 },
    { label: 'Close · face', az: -18, el: 10, zoom: 0.45 },
  ];
}
