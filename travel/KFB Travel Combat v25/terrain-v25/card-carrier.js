// ============================================================================
// card-carrier.js — KFB Travel · CardRig (the Pet's flying card)
// ----------------------------------------------------------------------------
// Canonical VISUAL embodiment of the vehicle (003_CardRig): the Pet rides ON a
// light 3D card — a subdivided thin plate (PlaneGeometry ~10×14 segments) with
// the card-back texture + ONE ink outline. NOT flat 2D (feet would poke).
//
// Ink outline = KFB Ink Outline Style v1 canon (SSOT: KFB_INK_OUTLINE_STYLE_v1 +
// kfb-ink.js). Style `inked` (default): inkPerimeter (segments ~34px, corners
// FIXED, ±jit on intermediate points) + drawInkOutline uniform (baseW modulated
// by a SMOOTHED low-freq wobble over a 2nd seed). Deterministic (mulberry, one
// seed/card), size-honest (drawn at real px), colour #1f1a14. Drawn on a 2D
// canvas → renderer-independent → used directly as a WebGL texture.
//
// STIL-HOOK (2026-07-25): die Outline wird über `createCardSurface` gemalt und ist
// zur Laufzeit nachstellbar (`rig.setInk({ width, wobble, jitter })`) — das Bild wird
// EINMAL geholt und danach nur noch neu übermalt, ein Regler löst also keinen
// Netzverkehr aus. Die zwei Funktionen `PERIMETER[style]` und `STROKE[style]` sind der
// Platz für Georgs weitere Stile (`torn` = zackig, `bend` = flaggenartig): ein
// Tabelleneintrag, kein Umbau. Bis die Kanon-Dateien vorliegen ist nur `inked` belegt.
//
// Ownership (003): presentation only — seat, visual lean, hover, waver, squash.
// Never moves the vehicle: copies its world transform, adds visual offsets.
//
//   const rig = createCardCarrier({ THREE, assetBase });
//   rig.group → scene;  rig.seat → pet.object3D
//   rig.sync(vehicleState, dt, petChar)   // once per frame, AFTER pet.update
//   rig.kick(a)                            // squash impulse (+ stretch / − duck)
// ============================================================================

const INK = '#1f1a14';

function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// inkPerimeter — walk the 4 rect edges, ~34px segments, jitter intermediate points, corners fixed.
function inkPerimeter(x0, y0, x1, y1, seed, jit) {
  const rnd = mulberry(seed), pts = [];
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  for (let c = 0; c < 4; c++) {
    const a = corners[c], b = corners[(c + 1) % 4];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.max(3, Math.round(len / 34));
    for (let i = 0; i < n; i++) {
      const u = i / n, corner = i === 0;   // corners fixed → closed, no gap
      pts.push([a[0] + (b[0] - a[0]) * u + (corner ? 0 : (rnd() - 0.5) * 2 * jit),
                a[1] + (b[1] - a[1]) * u + (corner ? 0 : (rnd() - 0.5) * 2 * jit)]);
    }
  }
  return pts;
}
function pathOf(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); }
// drawInkOutline inked: uniform baseW modulated by a smoothed low-freq wobble (2nd seed).
function drawInkOutline(g, pts, seed, baseW, wob) {
  const rnd = mulberry((seed ^ 0x9e37) >>> 0), N = pts.length, raw = [];
  for (let i = 0; i < N; i++) raw.push(rnd());
  const sm = (i) => (raw[(i - 1 + N) % N] + 2 * raw[i] + raw[(i + 1) % N]) * 0.25;
  g.lineJoin = 'round'; g.lineCap = 'round'; g.strokeStyle = INK;
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N];
    g.lineWidth = baseW * (1 + wob * (sm(i) - 0.5) * 2);
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
  }
}

// lively spring with slight overshoot: x eased toward target, velocity damped.
function spring(cur, target, stiff, damp, dt) {
  cur.v += (target - cur.x) * stiff * dt;
  cur.v *= Math.pow(damp, dt * 60);
  cur.x += cur.v * dt;
}

// Stil-Tabellen: EIN Eintrag pro Ink-Outline-Stil. `inked` ist der Kanon aus v1;
// `torn` und `bend` warten auf die Kanon-Dateien (dann hier eintragen, sonst nichts).
const PERIMETER = { inked: inkPerimeter };
const STROKE = { inked: drawInkOutline };

// createCardSurface — malt Papier + Kartenbild + Ink-Outline in EIN Canvas und hält das
// geladene Bild fest, damit `setInk()` nur neu übermalt (kein zweiter Netzabruf).
function createCardSurface(THREE, url, seed, opts) {
  const W = 800, H = 447, m = 14;
  const P = Object.assign({ style: 'inked', width: 6, wobble: 0.5, jitter: 4 }, opts || {});
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  let bmp = null;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;

  function repaint() {
    const per = PERIMETER[P.style] || inkPerimeter, stroke = STROKE[P.style] || drawInkOutline;
    const pts = per(m, m, W - m, H - m, seed, P.jitter);
    g.clearRect(0, 0, W, H);
    // **S88 · Das Papier füllt die GANZE Fläche, nicht nur die Innenseite der Tuschelinie.**
    // Georgs wiederkehrendes „hellblaues Gutter statt Black Ink Outline": gemessen hatte die Textur
    // außerhalb des Pfades 9 px mit Alpha 0 (x0–x6 a0, x9 a50, ab x12 die schwarze Tusche a255). Das
    // fällt nur auf, wenn das Material transparent wird — und genau das macht `fadeApply` bei jedem
    // Anflug (`hide` > 0). Dann scheint der Himmel `#9fc7e8` durch den Ring, direkt neben der Tusche:
    // ein hellblaues Gutter, das immer nur AN DER KARTE auftaucht. Der Kommentar darüber sagte schon
    // „blitzt nie transparent" — die Clip-Maske hat es trotzdem getan.
    // Jetzt: Papier deckend über alles, Bild und Tusche darauf. Keine halbdurchsichtigen Pixel mehr,
    // also kann kein Fade mehr etwas dahinter zeigen. Die Tusche bleibt die sichtbare Kartenkante.
    g.fillStyle = '#efe6d0'; g.fillRect(0, 0, W, H);
    if (bmp) { g.save(); pathOf(g, pts); g.clip(); g.drawImage(bmp, 0, 0, W, H); g.restore(); }
    if (P.width > 0.05) stroke(g, pts, seed, P.width, P.wobble);
    tex.needsUpdate = true;
  }
  repaint();
  fetch(url).then((r) => r.blob()).then(createImageBitmap).then((b) => { bmp = b; repaint(); }).catch(() => {});

  return {
    texture: tex, params: P,
    setInk(next) { Object.assign(P, next || {}); repaint(); },
  };
}

export function createCardCarrier(opts = {}) {
  const THREE = opts.THREE;
  // Pfad-Hygiene (session-export §6): Assets laufen über die kanonische RAW-URL.
  const assetBase = opts.assetBase || 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/';
  const CW = opts.width || 3.0, CD = CW * 447 / 800;
  const SEGX = 10, SEGZ = 14;

  const group = new THREE.Group();   // vehicle-driven world transform
  const lean = new THREE.Group();    // CardRig visual lean (springs)
  group.add(lean);

  const topGeo = new THREE.PlaneGeometry(CW, CD, SEGX, SEGZ);
  topGeo.rotateX(-Math.PI / 2);
  const basePos = topGeo.attributes.position.array.slice();
  const topMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0, side: THREE.DoubleSide, emissive: 0x000000 });
  const top = new THREE.Mesh(topGeo, topMat);
  top.castShadow = true; top.receiveShadow = false;   // no self-shadow (that acne was the boost "black flashes")
  lean.add(top);

  // --- SOLID SLAB: thin card with real thickness. Top = lit card face; bottom = SAME card back
  // (unlit MeshBasic so it never renders black from below); skirt = thin dark rim. Bottom + skirt
  // are rebuilt from the top rim EVERY frame → one bending object, no gap, edges curl freely. ---
  const TH = 0.055;                                  // ~1/3 of the old thickness (was a card-stack)
  const nx = SEGX + 1;
  const perim = [];
  for (let ix = 0; ix < SEGX; ix++) perim.push(0 * nx + ix);            // front row
  for (let iy = 0; iy < SEGZ; iy++) perim.push(iy * nx + SEGX);          // right col
  for (let ix = SEGX; ix > 0; ix--) perim.push(SEGZ * nx + ix);          // back row
  for (let iy = SEGZ; iy > 0; iy--) perim.push(iy * nx + 0);            // left col
  const M = perim.length;
  // bottom face: clone of the top grid, unlit card texture, always visible (never black)
  const botGeo = topGeo.clone();
  const botMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const bottom = new THREE.Mesh(botGeo, botMat); bottom.castShadow = false; bottom.receiveShadow = false; lean.add(bottom);
  // skirt: thin dark rim, 2*M verts (top ring + bottom ring), M quads
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.95, metalness: 0, side: THREE.DoubleSide });
  const skirtPos = new Float32Array(2 * M * 3);
  const skirtGeo = new THREE.BufferGeometry();
  skirtGeo.setAttribute('position', new THREE.BufferAttribute(skirtPos, 3));
  { const idx = []; for (let i = 0; i < M; i++) { const a = 2 * i, b = 2 * ((i + 1) % M); idx.push(a, a + 1, b + 1, a, b + 1, b); } skirtGeo.setIndex(idx); }
  const skirt = new THREE.Mesh(skirtGeo, darkMat); skirt.castShadow = true; skirt.receiveShadow = false; lean.add(skirt);

  // **Die verformte Geometrie IST die Wahrheit über die Fläche** — sie wird ABGELESEN, die
  // Wellen-Formel nicht ein zweites Mal geschrieben. Zwei Kopien derselben Rechnung wären genau die
  // Fehlerklasse, die diese Sitzung dreimal aufgeräumt hat (zwei Endzustände, zwei Fade-Schreiber,
  // zwei Pupillen-Verwalter). Bilinear zwischen den vier umliegenden Gitterpunkten, Normale gleich
  // mit — `computeVertexNormals()` läuft jeden Frame sowieso.
  const COLS = SEGX + 1, ROWS = SEGZ + 1;
  const _gx0 = basePos[0], _gx1 = basePos[(COLS - 1) * 3];
  const _gz0 = basePos[2], _gz1 = basePos[((ROWS - 1) * COLS) * 3 + 2];
  function sampleSurface(x, z, outN) {
    const a = topGeo.attributes.position.array, nn = topGeo.attributes.normal;
    const fcol = (x - _gx0) / (_gx1 - _gx0 || 1) * (COLS - 1);
    const frow = (z - _gz0) / (_gz1 - _gz0 || 1) * (ROWS - 1);
    const c0 = Math.max(0, Math.min(COLS - 2, Math.floor(fcol))), r0 = Math.max(0, Math.min(ROWS - 2, Math.floor(frow)));
    const tx = Math.max(0, Math.min(1, fcol - c0)), tz = Math.max(0, Math.min(1, frow - r0));
    const at = (r, cc) => (r * COLS + cc) * 3;
    if (outN && nn) {
      const na = nn.array;
      for (let k = 0; k < 3; k++) {
        const n00 = na[at(r0, c0) + k], n10 = na[at(r0, c0 + 1) + k], n01 = na[at(r0 + 1, c0) + k], n11 = na[at(r0 + 1, c0 + 1) + k];
        outN.setComponent(k, (n00 * (1 - tx) + n10 * tx) * (1 - tz) + (n01 * (1 - tx) + n11 * tx) * tz);
      }
      if (outN.lengthSq() < 1e-8) outN.set(0, 1, 0); else outN.normalize();
    }
    const h00 = a[at(r0, c0) + 1], h10 = a[at(r0, c0 + 1) + 1], h01 = a[at(r0 + 1, c0) + 1], h11 = a[at(r0 + 1, c0 + 1) + 1];
    return (h00 * (1 - tx) + h10 * tx) * (1 - tz) + (h01 * (1 - tx) + h11 * tx) * tz;
  }
  // Der Sitz wird auf die Fläche GESTELLT: Höhe von dort, Aufrichtung entlang der Flächennormale,
  // gedämpft (8/s) — eine Böe wiegt den Erzähler, sie ruckt ihn nicht. Wer darauf sitzt, bringt seinen
  // eigenen Fußabstand mit; das weiß nur, wer das Pet kennt (`pet-facing`, Aufsetz-Korrektur).
  // `seatFoot` = Radius des Fußabdrucks in Kartenmaß. **Gemessen an den vier Beinen** des Pets:
  // x −0,21 … +0,03, z +0,01 … +0,25 → ein Radius von etwa 0,13 um den Sitz. Der erste Wert (0,26)
  // war doppelt so groß und mittelte damit Fläche ein, auf der niemand steht — Spalt 0,031 u am
  // Vorderbein. Rückweg/Feintuning: `setSeatFootprint`.
  let seatPlant = true, seatLift = 0.0, seatFoot = 0.13;
  const _sn = new THREE.Vector3(), _sqTo = new THREE.Quaternion(), _upY0 = new THREE.Vector3(0, 1, 0);
  function plantSeat(dt) {
    if (!seatPlant) return;
    // **Der MITTELWERT über den Fußabdruck ist die Auflagehöhe** — nicht der höchste und nicht der
    // tiefste Punkt. Zwei Anläufe lagen daneben, und beide Messungen sagen warum: nur der Sitzpunkt
    // ließ 0,032 u Spalt (die Füße stehen daneben, wo das gewellte Blatt tiefer liegt), der höchste
    // Punkt machte 0,068 u daraus (er HEBT den ganzen Körper auf die Wellenspitze). Ein starrer Körper
    // auf einer gewellten Fläche liegt auf deren mittlerer Ebene; die Neigung übernimmt die Normale
    // (unten), und Restkrümmung von wenigen Millimetern schneidet die Clip-Ebene weg (`applyClip`,
    // „anything the pet dips BELOW the top" — genau dafür ist sie da).
    const x = seat.position.x, z = seat.position.z, r = seatFoot;
    const h = (sampleSurface(x, z, _sn) + sampleSurface(x - r, z, null) + sampleSurface(x + r, z, null)
             + sampleSurface(x, z - r, null) + sampleSurface(x, z + r, null)) / 5;
    seat.position.y = h + seatLift;
    _sqTo.setFromUnitVectors(_upY0, _sn);
    seat.quaternion.slerp(_sqTo, Math.min(1, dt * 8));
  }

  function rebuildSlab() {
    const a = topGeo.attributes.position.array;
    const bp = botGeo.attributes.position.array;
    for (let i = 0; i < a.length; i += 3) { bp[i] = a[i]; bp[i + 1] = a[i + 1] - TH; bp[i + 2] = a[i + 2]; }   // bottom hugs top, offset down
    botGeo.attributes.position.needsUpdate = true;
    for (let i = 0; i < M; i++) {
      const t = perim[i] * 3, x = a[t], y = a[t + 1], z = a[t + 2];
      skirtPos[6 * i] = x; skirtPos[6 * i + 1] = y; skirtPos[6 * i + 2] = z;                 // top ring
      skirtPos[6 * i + 3] = x; skirtPos[6 * i + 4] = y - TH; skirtPos[6 * i + 5] = z;         // bottom ring
    }
    skirtGeo.attributes.position.needsUpdate = true; skirtGeo.computeVertexNormals();
  }

  const seat = new THREE.Group();
  // **S93f · Die Höhe ist keine Konstante mehr — sie wird jeden Frame von der Fläche GELESEN.**
  // Georg: „das Pet floatet noch sichtbar und leicht schräg über der Karte." Beides folgte aus dieser
  // einen Zeile: 0,055 u war ein Festwert über der FLACHEN Ebene. Das Blatt wellt aber (Reisewelle),
  // kippt (Lesepult 10°), wölbt sich an den Kanten (`cup`/`tail`) und neigt sich mit der Rolle — der
  // Sitz konnte dem nicht folgen. Der Abstand atmete, und das Pet stand senkrecht auf einer schrägen
  // Fläche: genau „schwebend und leicht schräg".
  seat.position.set(0, 0.055, CD * 0.12);
  lean.add(seat);

  // real clipping plane at the card surface: anything the pet dips BELOW the top (e.g. squash on
  // landing after a jump) is clipped instead of poking through the underside. Updated each frame
  // from the card's world transform (renderer.localClippingEnabled must be on).
  const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let clipEnabled = true;
  const _up = new THREE.Vector3(), _qw = new THREE.Quaternion(), _pt = new THREE.Vector3();
  const _qRoll = new THREE.Quaternion(), _zAxisR = new THREE.Vector3(0, 0, 1);
  let barrelRoll = 0;
  function applyClip(obj) {
    obj.traverse((n) => {
      if (!n.isMesh || !n.material) return;
      const mats = Array.isArray(n.material) ? n.material : [n.material];
      for (const m of mats) { m.clippingPlanes = [clipPlane]; m.clipShadows = true; m.needsUpdate = true; }
    });
  }

  const surface = createCardSurface(THREE, assetBase + 'KayfaBizarro_Card_Backside_01_lowrez.png', 4242,
    { width: 6, wobble: 0.5, jitter: 4 });   // baseW 6 = ~25 % dünner als die Durchflug-Karten
  topMat.map = surface.texture; topMat.needsUpdate = true;
  botMat.map = surface.texture; botMat.needsUpdate = true;

  // kinetic springs (flying-carpet feel)
  const roll = { x: 0, v: 0 }, pitch = { x: 0, v: 0 }, yawWhip = { x: 0, v: 0 };
  const cup = { x: 0, v: 0 }, tail = { x: 0, v: 0 };   // edge-curl springs (cup into turns, tail lift on boost)
  const flSq = { x: 1, v: 0 };
  let bob = 0, prevBoost = false, prevClimbSig = 0, wavePhase = 0, windPhase = 0;
  let calm = 0;   // S89 · 0 = Reiseflug, 1 = steht still (siehe `sync`)
  // **S95 · Der RUHEWIND.** Georgs Regie: „wenn die sich ein bisschen im Wind bewegt oder so eine
  // Eigenbewegung hat, die dezent ist und zur Leseposition passt, aber trotzdem dieses im Wind
  // stehende Fluggefühl vermittelt — dann hat man das Gefühl, dass man weiterhin im Flugmodus ist."
  //
  // Das ist NICHT der Fahrtwind, sondern eine eigene Bewegung, und deshalb hat sie eine eigene Uhr
  // und eigene Zahlen. S89 hat den Teppich im Stand richtig stillgestellt (`calm`) — ein Fahrzeug,
  // das steht und weiterwellt, liest sich als „es macht noch irgendwas". Der Ruhewind ist das
  // Gegenteil davon: er lebt AUSSCHLIESSLICH im Stand (Faktor `calm`, nicht `1 − calm`), ist eine
  // Größenordnung kleiner als die Reisewelle (0,028 gegen 0,06 + Tempo) und viel langsamer und
  // breiter (Wellenlänge 1,15 gegen 3,4) — eine Fahne im Wind, kein Kräuseln.
  //
  // Die Uhr läuft IMMER, gegated wird nur die Amplitude. Eine Uhr, die erst mit `calm` anfängt,
  // würde beim Ankommen bei Phase 0 einsetzen — ein sichtbarer Ruck genau im ruhigsten Moment.
  //
  // Prime Directive: das ist das FAHRZEUG, nicht die Figur. Kein Idle-Fidget am Pet; es wird nur
  // mitgetragen, weil sein Sitz in `lean` hängt — genau wie in einem echten stehenden Flug.
  // S95b · Georg: „so gut wie gar nicht zu sehen" — gemessen waren es 0,82° Neigung, 1,51° Querlage
  // und 0,017 u Höhe. Ich hatte die Zahlen gegen die REISEWELLE bemessen (0,06 + Tempo) und dabei
  // übersehen, dass die im Reiseflug von Kurven, Boost und Bodennähe getragen wird — im Stand steht
  // das alles auf 0, es gibt also nichts, wovon sich der Wind abheben muss. Faktor 2,6 auf alle drei
  // Ausschläge: Fahne im Wind bleibt es (die Wellenlänge ist unverändert breit), sichtbar ist es jetzt.
  // **S93d · Das LESEPULT.** Georgs Vorschlag: „Kippung der Karte". Im Stand hebt die Flugkarte ihre
  // hintere Kante, ihre Fläche dreht sich also zum Betrachter — aus dem fliegenden Teppich wird ein
  // Pult, und das Pet darauf kommt mit (sein Sitz hängt in `lean`). Zusammen mit dem Zurücklehnen des
  // Körpers (`pet-facing`, 21,8°) sind das ~32° der gemessenen 44,3° Höhenwinkel.
  //
  // Vorzeichen: +z ist die HINTERE Kante (die Wellen-Rechnung unten nutzt `w = z/halfD`, und der
  // Boost-Term lässt `w > 0` aufsteigen). `R_x(θ)` schickt +z nach (0, −sinθ, cosθ), also hebt ein
  // NEGATIVES θ die hintere Kante — dieselbe Konvention wie das Kopfheben beim Pet.
  //
  // Gegated durch `calm`, genau wie der Ruhewind: im Reiseflug ist ein Pult falsch, da ist es ein
  // Teppich. Rückweg: `setLectern(0)`.
  let lectern = 0.175;   // rad ≈ 10°
  const W = { amp: 0.075, rate: 1.15, wlZ: 1.15, wlX: 0.6, bob: 0.030, bobRate: 1.05, sway: 0.026, swayRate: 1.55, pitchRate: 1.13 };
  const halfW = CW / 2, halfD = CD / 2;

  function sync(st, dt, petChar) {
    // 1) vehicle owns world transform
    group.position.copy(st.position);
    group.quaternion.copy(st.quaternion);
    // S2 · Barrel-Roll: die GANZE Karte rollt um ihre Flugachse (lokales Z). Das Pet sitzt
    // darauf und wird mitgeführt — es dreht also um die Karten-Mitte, nicht um sich selbst.
    // Muss HIER stehen, vor Lean und Clip-Ebene: die Fuß-Clipping-Ebene wird unten aus der
    // Weltdrehung von `lean` gebaut; ein später aufgesetzter Roll würde das Pet anschneiden.
    if (barrelRoll) group.quaternion.multiply(_qRoll.setFromAxisAngle(_zAxisR, barrelRoll));
    // 2) kinetic lean — springs overshoot slightly, so the carpet whips into turns & rears on boost
    const boostKick = st.boosting ? 0.16 : 0;
    spring(roll, Math.max(-0.7, Math.min(0.7, st.bank * 1.15)), 90, 0.80, dt);
    spring(pitch, Math.max(-0.5, Math.min(0.5, st.pitchTilt * 0.9 + boostKick)), 80, 0.82, dt);
    spring(yawWhip, Math.max(-0.35, Math.min(0.35, -st.bank * 0.5)), 70, 0.84, dt);   // tail swings out of the turn
    // S95 · Der Ruhewind neigt die ganze Karte, nicht nur ihre Oberfläche: 0,010 rad = 0,57° in der
    // Neigung, 0,014 rad = 0,80° in der Querlage, zwei inkommensurable Perioden (5,6 s / 4,1 s), damit
    // sich kein Takt heraushören lässt. Additiv auf die Federn — die dürfen im Stand ruhig bei 0 stehen.
    const wind = calm;
    lean.rotation.set(pitch.x + Math.sin(bob * W.pitchRate) * W.sway * wind - lectern * calm,
                      yawWhip.x,
                      roll.x + Math.sin(bob * W.swayRate) * W.sway * 1.4 * wind);

    // impulse kicks (boost edge, climb/dive edge) → squash + a pitch pop
    if (st.boosting && !prevBoost) { flSq.v -= 0.30 * 14; pitch.v += 1.6; }
    if (!st.boosting && prevBoost) { flSq.v += 0.14 * 14; }
    prevBoost = st.boosting;
    const climbSig = st.climbIn > 0.10 ? 1 : st.climbIn < -0.10 ? -1 : 0;
    if (climbSig !== prevClimbSig) { flSq.v += (climbSig > 0 ? 0.18 : -0.16) * 14; }
    prevClimbSig = climbSig;

    // 3) hover bob
    bob += dt;
    // **S89 · `calm` stellt den Teppich still.** Georgs Regie: „in dem Moment, wo das Pad vor der Karte
    // ist, hört es auf, diese rollende Bewegung zu machen, und bleibt einfach stehen." Die Welle des
    // Teppichs hängt aber nicht am Tempo allein — `wavePhase` läuft mit 2,6/s auch im Stand weiter und
    // `amp` hat einen Sockel von 0,06. Ein Fahrzeug, das steht, aber weiterwellt, liest sich als „es
    // macht noch irgendwas". `calm` kommt als Faktor von derselben Ankunfts-Regie, die auch bremst —
    // eine Absicht, ein Wert. 0 = Reiseflug wie bisher.
    const cq = 1 - calm;
    lean.position.y = Math.sin(bob * 2.4) * 0.03 * cq + Math.sin(bob * W.bobRate) * W.bob * wind;

    // edge-curl targets: cup = both side edges lift in a turn (taco); tail = trailing edge rears on boost/climb
    spring(cup, Math.min(0.5, Math.abs(st.bank) * 1.3 + (st.boosting ? 0.14 : 0)) * cq, 70, 0.82, dt);
    spring(tail, Math.max(-0.4, Math.min(0.5, (st.boosting ? 0.42 : 0) + st.climbIn * 3.0 - st.pitchTilt * 0.4)) * cq, 60, 0.84, dt);

    // 4) carpet-waver + edge-curl. Ripple flows backward faster with speed; curl bends the RIM, and the
    // slab (skirt+bottom) is rebuilt from that rim so the edges physically bend as one solid card.
    wavePhase += dt * (2.6 + st.speed * 0.07) * cq;
    windPhase += dt * W.rate;   // S95 · läuft immer, gegated wird die Amplitude (Begründung oben)
    const arr = topGeo.attributes.position.array;
    const amp = (0.06 + st.speed * 0.0016) * cq;          // livelier than before, still lit cleanly
    const windAmp = W.amp * wind;
    for (let i = 0; i < arr.length; i += 3) {
      const x = basePos[i], z = basePos[i + 2];
      const u = x / halfW, w = z / halfD;                 // -1..1 across / along
      const wave = Math.sin(wavePhase + z * 3.4 + x * 1.6) * amp * (0.35 + Math.abs(w));
      // S95 · Der Ruhewind: breiter, langsamer, an den freien Kanten stärker als in der Mitte.
      const gust = windAmp > 0 ? Math.sin(windPhase + z * W.wlZ + x * W.wlX) * windAmp * (0.25 + Math.abs(w) * 0.9) : 0;
      const cupCurl = cup.x * u * u * 0.9;                 // side edges up (into the turn)
      const tailCurl = tail.x * (w > 0 ? w * w : w * w * -0.5) * 0.8;   // back rears up, front dips a little
      const bank = roll.x * x * 0.16;                      // slab tips with the roll spring
      arr[i + 1] = basePos[i + 1] + wave + gust + cupCurl + tailCurl + bank;
    }
    topGeo.attributes.position.needsUpdate = true;
    topGeo.computeVertexNormals();
    rebuildSlab();
    plantSeat(dt);   // S93f · nach der Verformung, vor der Clip-Ebene (die liest die Sitz-Position)

    // update feet clip plane from the card's world surface (with a small tolerance below the top)
    if (clipEnabled) {
      lean.updateWorldMatrix(true, false);
      _up.set(0, 1, 0).applyQuaternion(lean.getWorldQuaternion(_qw)).normalize();
      seat.getWorldPosition(_pt).addScaledVector(_up, -0.05);
      clipPlane.setFromNormalAndCoplanarPoint(_up, _pt);
    } else {
      clipPlane.set(_up.set(0, 1, 0), 1e6);   // disabled: everything on the positive side → no clipping
    }

    // 5) card squash spring settles (kept for rig.kick card impulses; the PET squash is now owned by pet-kinetics.js)
    flSq.v += (1 - flSq.x) * 90 * dt - flSq.v * 12 * dt; flSq.x += flSq.v * dt;
  }

  return {
    name: 'card-carrier', group, seat, lean, sync, clipPlane, applyClip, halfW, halfD,
    // S89i · Die drei Meshes des Teppichs OHNE den Sitz. `group` und `lean` enthalten beide auch das
    // Pet (der Sitz hängt in `lean`) — wer den Teppich allein ein- oder ausblenden will, braucht eine
    // Menge, die das Pet nicht berührt. Zwei Verwalter derselben Materialien war der Fehler aus S89g;
    // zwei DISJUNKTE Mengen sind die Lösung.
    padParts: [top, bottom, skirt],
    // Ink-Outline zur Laufzeit: { width, wobble, jitter, style }
    setInk(next) { surface.setInk(next); },
    // S89 · Die Ankunfts-Regie stellt den Teppich still, wenn das Pad vor der Karte steht.
    setCalm(v) { calm = Math.max(0, Math.min(1, v || 0)); },
    get calm() { return calm; },
    // S95 · Der Ruhewind ist regelbar (`amp` 0 = aus, das ist der Rückweg auf S89-Verhalten).
    setWind(p) { Object.assign(W, p || {}); },
    get wind() { return W; },
    // S93d · Die Lesepult-Kippung in rad (0 = flach wie vor S93d). Gilt nur im Stand (`calm`).
    setLectern(v) { lectern = Math.max(0, Math.min(0.6, v || 0)); },
    get lectern() { return lectern; },
    // S93f · Sitz auf der Fläche. `setSeatPlant(false)` = Rückweg auf den Festwert von vor S93f.
    setSeatPlant(on) { seatPlant = on !== false; if (!seatPlant) { seat.position.y = 0.055; seat.quaternion.identity(); } },
    setSeatLift(v) { seatLift = v || 0; },
    setSeatFootprint(v) { seatFoot = Math.max(0, v || 0); },
    surfaceAt(x, z, outN) { return sampleSurface(x, z, outN); },
    get seatPlanted() { return seatPlant; },
    get ink() { return surface.params; },
    setBarrelRoll(a) { barrelRoll = a || 0; },
    get barrelRollAngle() { return barrelRoll; },
    setClipEnabled(on) {
      clipEnabled = !!on;
      // release immediately — sync() does not run in walk mode, so a stale card plane
      // left over from flight would clip the grounded pet away entirely.
      if (!on) clipPlane.set(_up.set(0, 1, 0), 1e6);
    },
    setVisible(on) { group.visible = !!on; },
    kick(a) { flSq.v += a * 14; },
    dispose() { topGeo.dispose(); topMat.dispose(); skirtGeo.dispose(); botGeo.dispose(); botMat.dispose(); darkMat.dispose(); },
  };
}
