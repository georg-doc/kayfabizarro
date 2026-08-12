// ============================================================================
// travel-input.js — KFB Travel · Slice S44c (V9-C, Teil 3) · die Eingabe-Schicht
// ----------------------------------------------------------------------------
// Tasten, Zeiger, Rad, Doppelklick und die Umrechnung in die vier Fahrzeugwerte
// (`yawIn` · `climbIn` · `thrust` · `brake`/`warp`/`pivot`). Sie war die letzte große
// Nachbarschaft im Runner, die nichts mit Verdrahtung zu tun hat.
//
// **Die Schicht ENTSCHEIDET NICHTS über den Zustand.** Sie liest Tasten und liefert
// Werte; wer daraus einen Modus-Wechsel macht, ist der Eigentümer (`requestMode`),
// und wer die Kamera bewegt, ist das Rig. Genau deshalb steht hier kein `mode = …`
// und kein `camera.…` — nur Anträge und Zahlen.
//
// Zwei Regeln, die aus Fehlern stammen und hier bleiben müssen:
//  · **Offenes Overlay oder offenes Suchfeld nehmen die Tasten.** Sonst lenkt „part"
//    beim Tippen das Fahrzeug (a = links).
//  · **Der Einfachklick gehört der Demo, der Doppelklick dem Anflug** — aber nur auf
//    dem Fenster der Karte, die gerade läuft. Sonst verschluckt die Demo den Anflug.
//
// Abhängigkeiten kommen über `ctx.x` (Getter im Runner), nicht destrukturiert: die
// Schicht wird gebaut, während einige Bezüge noch nicht deklariert sind.
//
//   const input = createTravelInput(ctx);
//   input.keys · input.read(dt)
// ============================================================================

// Treffertest fürs Post-it. Kein Raycaster: das Blatt ist ein kleines Quad, seine vier Ecken im
// Bild ergeben ein Rechteck, das für einen Klick genau genug ist — und die Vektoren werden
// wiederverwendet, also kostet es keine Allokation pro Zeiger-Ereignis.
const _c4 = [];
let _hitCam = null, _hitEl = null;
function hitsPostit(card, cx, cy) {
  const p = card.postit, cam = _hitCam, el = _hitEl;
  if (!p || !cam || !el) return false;
  const V = cam.position.constructor;
  if (!_c4.length) for (let i = 0; i < 4; i++) _c4.push(new V());
  p.updateWorldMatrix(true, false);
  const w = p.geometry.parameters.width / 2, h = p.geometry.parameters.height / 2;
  const r = el.getBoundingClientRect();
  const corners = [[-w, -h], [w, -h], [w, h], [-w, h]];
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i < 4; i++) {
    _c4[i].set(corners[i][0], corners[i][1], 0).applyMatrix4(p.matrixWorld).project(cam);
    if (_c4[i].z > 1) return false;
    const sx = (_c4[i].x * 0.5 + 0.5) * r.width + r.left;
    const sy = (-_c4[i].y * 0.5 + 0.5) * r.height + r.top;
    if (sx < x0) x0 = sx; if (sx > x1) x1 = sx;
    if (sy < y0) y0 = sy; if (sy > y1) y1 = sy;
  }
  // S61 · Eingeklappt ist das Blatt ein Streifen von ~13 % Höhe — auf dem Schirm können das zehn
  // Pixel sein. Ein Ziel, das man nicht trifft, ist kein Ziel: der Trefferbereich wird deshalb auf
  // mindestens 22 px aufgefüttert (die Karte darunter gehört der Demo, also nur so viel wie nötig).
  const padY = Math.max(0, (22 - (y1 - y0)) / 2), padX = Math.max(0, (22 - (x1 - x0)) / 2);
  return cx >= x0 - padX && cx <= x1 + padX && cy >= y0 - padY && cy <= y1 + padY;
}

export function createTravelInput(ctx) {
  const keys = new Set();
  let lastSpaceAt = 0, lastZoomAt = 0;
addEventListener('keydown', (e) => {
  if (ctx.settings.isOpen()) return;            // Overlay offen: Tasten gehören dem Formular
  // … und das gilt genauso für das Suchfeld: sonst lenkt „part" beim Tippen (a = links).
  if (ctx.search.isOpen()) {
    if (e.code === 'Escape') ctx.search.close();
    return;
  }
  // S51 · … und für das Notizfeld: sonst lenkt „w" das Fahrzeug, während man „Wurfweite" schreibt.
  // Esc sichert und schließt — Schreiben soll man nicht bestätigen müssen.
  if (ctx.noteField.isOpen()) {
    if (e.code === 'Escape') { e.preventDefault(); ctx.noteField.close(true); }
    return;
  }
  ctx.armAudio();
  keys.add(e.code);
  // Steuern bricht den Anflug ab — der Nutzer gewinnt immer, und zwar ohne Sonderfall.
  if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'KeyX', 'Space', 'KeyF', 'Escape'].includes(e.code)) {
    // **S89 · Eine GEHALTENE Taste ist kein Entschluss.** Georgs Befund „Abflug startet automatisch
    // bei manueller Reise": wer mit gedrücktem W ankommt, bekommt vom Browser Auto-Repeat —
    // `keydown` feuert weiter, und die Detailansicht löste sich in dem Moment, in dem sie entstand.
    // Nur ein FRISCHER Druck ist eine Absicht; `e.repeat` ist die Tastatur, die nachplappert.
    if (!e.repeat) {
      if (ctx.dock.owns) { ctx.dock.release(); ctx.note('Detailansicht verlassen.', 2.5); }
      if (ctx.auto.active && e.code !== 'Escape') { ctx.auto.cancel(); ctx.note('Steuerung zurück bei dir.', 2.5); }
    }
  }
  if (e.code === 'KeyR' && !e.repeat && ctx.academyOn) {
    // Nur ein LAUFENDER Anflug wird gestoppt. Kreisen oder Detailansicht sind kein Grund,
    // die Route zu verweigern — vorher schluckte `R` in der Detailansicht nur die Warteschleife.
    if (ctx.auto.flying) { ctx.auto.cancel(); ctx.note('Route gestoppt.'); } else ctx.flyRoute();
  }
  if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();
  if (e.code === 'KeyF' && !e.repeat) ctx.requestMode(ctx.isWalk() ? 'fly' : 'walk', 'hand');
  if (e.code === 'KeyJ' && !e.repeat && !ctx.isWalk()) ctx.petKin.jump();
  if (e.code === 'Space' && !e.repeat) {
    // Kontext entscheidet, nicht ein Sonderfall: am Boden Sprung, doppelt = abheben.
    // In der Luft bleibt die Leertaste der Boost — die Doppel-Erkennung läuft dort ins Leere.
    const t = performance.now(), dbl = t - lastSpaceAt < 280;
    lastSpaceAt = t;
    if (ctx.isWalk()) { if (dbl && ctx.autoMode) ctx.takeOff(); else ctx.walk.jump(); }
  }
  if (e.code === 'Tab' && !e.repeat) { e.preventDefault(); ctx.settings.toggle('travel'); }
});
addEventListener('keyup', (e) => keys.delete(e.code));
let steer = false, grabX = 0, grabY = 0, sx = 0, sy = 0, lastInputAt = performance.now(), lastPX = 0, lastPY = 0;
let demoPtr = null;   // S31: dieser Zeiger gehört der Demo auf dem Blatt, nicht der Steuerung
let swallowPtr = null;   // S92: dieser Zeiger liegt auf der angedockten Karte — er tut NICHTS, aber er
                         // löst auch nichts. Eigener Merker, damit das Loslassen nicht der Demo ein
                         // erfundenes `up` schickt (der alte Code benutzte dafür `demoPtr`).
const ptrs = new Map(); let pinch0 = 0, zoom0 = 0;
const el = ctx.renderer.domElement;
_hitCam = ctx.camera; _hitEl = el;
el.addEventListener('pointerdown', (e) => {
  if (e.__hudClaimed) return;   // S7: der HUD-Würfel hat diesen Zeiger
  ctx.armAudio();
  // S31 · Klick-Kollision, hier entschieden und nicht später: der Einfachklick gehört der
  // Demo — aber NUR auf dem Fenster der Karte, die gerade läuft. Sonst verschluckt die
  // Demo den Anflug-Klick.
  if (ctx.academyOn && ctx.shownLive && ctx.live.live) {
    const hit = ctx.pickAcademy(e.clientX, e.clientY);
    if (hit && hit.card === ctx.shownLive && hit.onScreen && hit.uv) {
      demoPtr = e.pointerId;
      ctx.live.pointer(hit.uv.x, hit.uv.y, 'down');
      try { el.setPointerCapture(e.pointerId); } catch (e2) {}
      return;
    }
  }
  // S51 · Post-it in der Detailansicht: Klick öffnet die Notiz. Zuerst geprüft, weil das Blatt
  // darunter sonst den Klick nimmt (der Einfachklick gehört dort der Demo).
  if (ctx.academyOn && ctx.dock.docked && ctx.dock.card) {
    const c = ctx.dock.card;
    if (c.postit && c.postit.visible && hitsPostit(c, e.clientX, e.clientY)) {
      e.preventDefault();
      // S61 · Ein Klick, zwei Dinge: das Blatt klappt auf UND das Schreibfeld öffnet. Zwei Klicks
      // wären eine Erklärung, die niemand liest.
      ctx.academy.setFold(c, true);
      ctx.noteField.open(c, ctx.journey.noteOf(c), ctx.camera, ctx.renderer);
      return;
    }
  }
  // S92 · Gedockt und OHNE Demo: der Zeiger wird auf der Karte GESCHLUCKT, nicht zum Auswurf.
  // Sonst ist die Detailansicht mit der Maus nicht berührbar, ohne sie zu verlassen — und eine
  // Vorschau-Karte hat nun mal nichts zu bedienen. Raus geht über Esc/X/Steuern oder einen Zug in
  // den leeren Himmel.
  //
  // **Hier stand der Fehler.** Gefragt wurde `pickAcademy(...)` und dann `hit.card === dock.card` —
  // eine Bedingung, die seit S89g nie wahr werden kann, weil `pickAcademy` genau diese Karte aus dem
  // Treffertest nimmt (sie ist der Bildschirm, kein Ziel). Der Zweig war toter Code, also fiel jeder
  // Klick in der Detailansicht in den Steuerzweig darunter und löste das Dock: das Gegenteil des
  // Versprechens im Kommentar. Jetzt fragt `pickDocked` — die Bedienfläche statt des Ziels.
  if (ctx.academyOn && ctx.dock.docked && ctx.pickDocked(e.clientX, e.clientY)) {
    swallowPtr = e.pointerId;
    try { el.setPointerCapture(e.pointerId); } catch (e2) {}
    return;
  }
  if (ctx.auto.active) ctx.auto.cancel();
  if (ctx.dock.owns) ctx.dock.release();   // Ziehen im leeren Himmel = umsehen = raus aus der Detailansicht
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); lastInputAt = performance.now(); lastPX = e.clientX; lastPY = e.clientY;
  try { el.setPointerCapture(e.pointerId); } catch (e2) {}
  if (ptrs.size === 1) { steer = true; grabX = e.clientX; grabY = e.clientY; sx = 0; sy = 0; }
  if (ptrs.size === 2) { const p = [...ptrs.values()]; pinch0 = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); zoom0 = ctx.camRig.zoomTarget; }
});
el.addEventListener('pointermove', (e) => {
  if (e.__hudClaimed) return;
  if (swallowPtr === e.pointerId) return;   // S92: liegt auf der angedockten Karte — lenkt nicht
  if (demoPtr === e.pointerId) {
    const hit = ctx.pickAcademy(e.clientX, e.clientY);
    if (hit && hit.card === ctx.shownLive && hit.uv) ctx.live.pointer(hit.uv.x, hit.uv.y, 'move');
    return;
  }
  if (!ptrs.has(e.pointerId)) return;
  const dxi = e.clientX - lastPX, dyi = e.clientY - lastPY; lastPX = e.clientX; lastPY = e.clientY;
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); lastInputAt = performance.now();
  if (ptrs.size >= 2) { const p = [...ptrs.values()], d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); if (pinch0 > 0) { ctx.camRig.setZoom(zoom0 * (pinch0 / Math.max(d, 1))); lastZoomAt = performance.now(); } }
  else if (ctx.isWalk()) { ctx.walk.orbit(dxi, dyi); ctx.camRig.markLookAt(); }
  else { sx = e.clientX - grabX; sy = e.clientY - grabY; }
});
const endPtr = (e) => { if (swallowPtr === e.pointerId) { swallowPtr = null; return; } if (demoPtr === e.pointerId) { demoPtr = null; ctx.live.pointer(0.5, 0.5, 'up'); return; } ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = 0; if (ptrs.size === 1) { const p = [...ptrs.values()][0]; grabX = p.x; grabY = p.y; sx = 0; sy = 0; steer = true; } if (ptrs.size === 0) { steer = false; sx = 0; sy = 0; } };
el.addEventListener('pointerup', endPtr); el.addEventListener('pointercancel', endPtr);
el.addEventListener('contextmenu', (e) => e.preventDefault());
// S22d · Doppelklick fliegt an. Einfachklick gehört der Demo (siehe pointerdown) — zwei
// Ereignisse, eine Regel: nah + Fenster = bedienen, sonst = Ziel.
el.addEventListener('dblclick', (e) => {
  if (e.__hudClaimed) return;
  const hit = ctx.pickAcademy(e.clientX, e.clientY);
  if (hit) { e.preventDefault(); ctx.flyToCard(hit.card); }
});
el.addEventListener('wheel', (e) => { e.preventDefault(); if (ctx.isWalk()) { const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; ctx.walk.zoom(Math.max(-1.6, Math.min(1.6, px * 0.02))); return; } if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.2) { ctx.camRig.nudgeYaw(e.deltaX * 0.004); } else { ctx.camRig.zoomWheel(e.deltaY, e.deltaMode); lastZoomAt = performance.now(); } }, { passive: false });
addEventListener('resize', () => { ctx.resize(); });

function read(dt) {
  let yawIn = 0, climbIn = 0, thrust = 0;
  if (steer) {
    // S86 · **Der Zug ist ein Steuerknochen, kein Schieber.** Georgs Befund: „träge, man kann nicht
    // genau nach rechts/links steuern". Drei Ursachen, drei Zahlen:
    //
    //  1. Der WEG war zu lang: voller Ausschlag erst nach 12 + 170 = 182 px. Ein 40-px-Zug ergab
    //     0,16 Ausschlag = 0,3 rad/s = 18 °/s — gemessen 5,9 s für eine Vierteldrehung. Jetzt 84 px.
    //  2. Die KENNLINIE war linear, und linear ist an beiden Enden falsch: unten zu stumpf für eine
    //     Korrektur, oben ohne Reserve. Der erste Versuch `t^1.55` war zu STEIL und hat den kurzen
    //     Weg untenrum wieder aufgefressen — nachgemessen bei 20 px: 4,9 °/s neu gegen 5,1 °/s alt,
    //     also null Verbesserung genau dort, wo man Trägheit merkt (und die Verbesserung setzte erst
    //     ab ~50 px ein). Jetzt `t^1.2` auf 78 px: nur leicht progressiv, damit der kurze Weg
    //     untenrum wirklich ankommt und die Feinheit trotzdem bleibt.
    //  3. Beide Achsen liefen IMMER gleichzeitig: ein waagerechter Zug lief nie waagerecht, weil der
    //     Daumen 20 px mit nach unten nahm und die Karte dabei sank. Jetzt schwächt die dominante
    //     Achse die andere (`dom`), also bleibt „nach rechts" auch nach rechts.
    const dz = 6, spanX = 78, spanY = 100;
    const ax = Math.max(0, (Math.abs(sx) - dz) / spanX), ay = Math.max(0, (Math.abs(sy) - dz) / spanY);
    const curve = (t) => Math.pow(Math.min(1, t), 1.2);
    // Querachsen-Dämpfung: die kleinere Achse wird um bis zu 70 % zurückgenommen, wenn die andere
    // klar führt. Bei einem diagonalen Zug (beide gleich) bleibt alles wie vorher.
    const dom = (a, b) => 1 - 0.7 * Math.min(1, Math.max(0, (b - a) / Math.max(b, 0.001)));
    const nx = Math.sign(sx) * curve(ax) * dom(ay, ax);
    const ny = Math.sign(sy) * curve(ay) * dom(ax, ay);
    yawIn += -nx * 1.9 * dt; climbIn += -ny * 16 * dt;
    if (nx || ny) lastInputAt = performance.now();
  }
  if (keys.has('KeyA')) yawIn += 1.4 * dt;
  if (keys.has('KeyD')) yawIn -= 1.4 * dt;
  if (keys.has('ArrowUp')) climbIn += 16 * dt;
  if (keys.has('ArrowDown')) climbIn -= 16 * dt;
  // S86 · **X ist der Landebefehl: sinken UND bremsen.** Georgs Befund: „X sollte sinken &
  // Übergang walk ermöglichen (geht bisher nur über Pfeil-Tasten)". Bisher war X nur die Bremse und
  // der Landewille hörte nur auf Pfeil-Ab — wer landen wollte, musste ZWEI Tasten finden. Ein Griff
  // für eine Absicht: runterkommen. Pfeil-Ab bleibt als feines Sinken ohne Bremse.
  // Die Sinkrate ist bewusst kleiner als die der Pfeiltaste (11 gegen 16 u/s): X bremst gleichzeitig,
  // und beides voll wäre ein Absturz statt einer Landung.
  const brake = keys.has('KeyX') ? 1 : 0;
  if (brake) climbIn -= 11 * dt;
  if (keys.has('KeyW')) thrust = 1;
  if (keys.has('KeyS')) thrust = -1;
  if (keys.has('KeyW') || keys.has('KeyS') || keys.has('KeyA') || keys.has('KeyD')) lastInputAt = performance.now();    const idle = performance.now() - lastInputAt > 1600;
  // Warp mit der Hand: Shift+Leertaste. Es ist der Boost über der Grenze — dieselbe Taste,
  // eine Stufe weiter, statt eines neuen Griffs.
  const warp = (keys.has('Space') && (keys.has('ShiftLeft') || keys.has('ShiftRight'))) ? 1 : 0;
  // Q/E waren im Flug unbelegt (am Boden sind sie Seitwärtsschritt). Im Flug: Standdrehung um die
  // eigene Achse — Q links, E rechts, gleiche Seiten wie A/D.
  const pivot = (keys.has('KeyQ') ? 1 : 0) - (keys.has('KeyE') ? 1 : 0);
  return { yawIn, climbIn, thrust, brake, warp, pivot, boost: keys.has('Space'), idle };
}

  return { name: 'travel-input', keys, read,
    get lastZoomAt() { return lastZoomAt; },
    get steering() { return steer; } };
}
