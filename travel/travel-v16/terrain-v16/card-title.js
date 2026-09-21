// ============================================================================
// card-title.js — KFB Travel · Slice S46 · lesbarer Kartentitel, extrudiert
// ----------------------------------------------------------------------------
// Ersetzt die Würfel-Glyphen (S32b): die waren aus der Ferne unsichtbar, haben die
// Karten überlagert und die Detailansicht mitspringen lassen. Georgs Vorgabe:
// **Irish Grover, 3D/extrudiert, papierfarben als Default, färbbar nach Kontext,
// schwebend mit Verbindung zur Karte — und einzeilig auch bei langen Deck-Titeln.**
//
// WARUM KEIN `TextGeometry`: das braucht eine Typeface-JSON-Konvertierung der
// Schrift. Irish Grover liegt als Webfont im Dokument — also wird der Titel auf
// einem Canvas gesetzt (dort ist die echte Schrift) und die TIEFE aus gestapelten
// Ebenen gebaut: eine Frontplatte plus N Kopien nach hinten, abgedunkelt. Das ist
// die Comic-Extrusion, die KFB ohnehin zeichnet — und sie kostet einen Draw-Call
// pro Ebene statt einer Geometrie-Konvertierung.
//
// **Die Animation darf die Kartenansicht nicht verändern** (Georgs Bedingung).
// Deshalb reserviert der Titel EINMAL ein festes Band über der Karte (`padTop`),
// und alles, was er danach tut — Schweben, Nicken, später Ticker — bleibt in
// diesem Band. Das Dock rahmt also immer dieselbe Höhe, egal in welcher
// Animationsphase es andockt.
//
// Einzeilig bei langen Titeln: die Schriftgröße wird auf die Kartenbreite
// GEMESSEN (nicht geraten) und notfalls horizontal gestaucht — bis 0,82, darunter
// wird nicht weiter gequetscht, sondern die Platte breiter als die Karte gemacht.
//
//   const title = createCardTitle({ THREE });
//   title.attach(card, { text: 'Skinning + Inverse Kinematics', sub: 'GL · Lektion 12' });
//   title.update(dt);          // im world-Schritt
//   title.detach();
// ============================================================================

const PAPER = '#f3ead2';          // Default: Papier, nicht Weiß
const INK = '#241d16';

export function createCardTitle(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    layers: 7,            // Tiefenebenen; 7 liest als Extrusion, 3 als Schatten
    depth: 0.13,          // Weltabstand pro Ebene
    gap: 0.85,            // Abstand Kartenoberkante → Titelunterkante
    height: 1.5,          // Höhe der Titelplatte in Welt-Einheiten
    subHeight: 0.92,      // Band für bis zu zwei Subline-Zeilen
    float: 0.16,          // Schwebe-Amplitude (bleibt IM reservierten Band)
    floatReserve: 0.4,    // **Reserviert wird das MAXIMUM**, nicht der aktuelle Wert: sonst rahmt
                          // die Detailansicht nach jedem Zug am Schwebe-Regler anders (gemessen
                          // 3,59 → 3,87 u). Nur der INHALT darf das Band ändern, keine Einstellung.
    stemW: 0.055,         // Breite der Verbindung zur Karte
    px: 128,              // Canvas-Pixel pro Welt-Einheit Höhe
  }, opts.params || {});

  const group = new THREE.Group();
  group.visible = false;
  let card = null, T = 0, tex = null, sheets = [], stem = null, plate = null;
  let lastKey = '', wantW = 6, plateH = P.height, _metrics = null;
  // **Das letzte Anhänge-Info wird festgehalten**, nicht aus `lastKey` rekonstruiert. Vorher hat
  // `setParams` erst `lastKey` gelöscht und dann `this.text` daraus gelesen — also '' —, wodurch
  // die Subline ersatzlos verschwand und mit ihr das reservierte Band (3,59 → 2,67). Damit änderte
  // ein Regler die Rahmung der Detailansicht: genau die Zusage, die dieser Slice gibt.
  let lastInfo = null;

  // ---- Canvas: Titel (Irish Grover) + optionale Sublines (Special Elite)
  const cv = document.createElement('canvas');
  const g = cv.getContext('2d');

  function draw(text, sub, paper, ink) {
    const hasSub = !!(sub && sub.length);
    const subLines = hasSub ? String(sub).split('\n').slice(0, 2) : [];
    // **Die Höhe des Subline-Bandes wird GERECHNET, nicht gesetzt.** Der letzte Fix hat die
    // Schrift von 0,34 auf 0,40 vergrößert — und damit die zweite Zeile am Canvas-Rand
    // abgeschnitten (gemessen: Tusche-Pixel bis y = 309 bei 310 px Canvas, Abstand 0).
    // Wer eine Schriftgröße ändert, ändert den Platzbedarf: also hängt der Platz an der Größe,
    // nicht umgekehrt. Grundlinie + Unterlängen + halbe Kontur + 4 px Luft.
    const sfs = Math.round(P.subHeight * P.px * 0.4);
    const slw = Math.max(2.5, sfs * 0.22);
    const needPx = hasSub
      ? sfs * (1.1 + (subLines.length - 1) * 1.2) + sfs * 0.24 + slw * 0.5 + 4
      : 0;
    const subPx = hasSub ? Math.max(P.subHeight * P.px, needPx) : 0;
    const H = P.height + subPx / P.px;
    const W = wantW;
    cv.width = Math.max(64, Math.round(W * P.px));
    cv.height = Math.max(32, Math.round(H * P.px));
    g.clearRect(0, 0, cv.width, cv.height);
    const pad = cv.width * 0.02;

    // Titel: Größe aus der BREITE gerechnet, nicht geraten. Erst kleiner, dann leicht stauchen —
    // und wenn beides nicht reicht, **weiter verkleinern**. Vorher endete der Weg beim Stauch-Boden
    // 0,82 und nahm den Überlauf stillschweigend hin: bei 67 Zeichen berührte die Tusche beide
    // Canvas-Kanten (gemessene Breite = Canvasbreite). Ein Titel, der überläuft, ist kein Titel.
    const titleFont = (px) => '400 ' + px + 'px "Irish Grover", Georgia, serif';
    const fsMin = Math.round(P.height * P.px * 0.42);
    let fs = Math.round(P.height * P.px * 0.74);
    const fit = cv.width - pad * 2;
    let squeeze = 1;
    g.font = titleFont(fs);
    let w = g.measureText(text).width;
    while (w > fit && fs > fsMin) { fs = Math.round(fs * 0.94); g.font = titleFont(fs); w = g.measureText(text).width; }
    if (w > fit) squeeze = Math.min(1, Math.max(0.82, fit / w));
    for (let i = 0; i < 40 && w * squeeze > fit; i++) {
      fs = Math.round(fs * 0.94); g.font = titleFont(fs); w = g.measureText(text).width;
      squeeze = Math.min(1, Math.max(0.82, fit / w));
    }
    // **Die Titelmaße werden HIER festgehalten**, nicht am Ende von `draw`: dort steht `g.font`
    // schon auf der Subline-Schrift, und eine Messung in der falschen Schrift meldet immer „passt“
    // (gemessen: 353 px statt echter 917). Eine Abnahmezahl, die mit der falschen Schrift misst,
    // ist schlimmer als keine.
    const titleW = Math.round(w * squeeze), titleFs = fs;
    g.font = titleFont(fs);
    const titleY = P.height * P.px * 0.7;
    g.save();
    g.translate(cv.width / 2, titleY);
    if (squeeze < 1) g.scale(squeeze, 1);
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    // Tuschekante um die Buchstaben: derselbe Gedanke wie am Kartenrand — die Schrift ist
    // gezeichnet, nicht gesetzt. Zwei Züge, damit die Kante auch bei Verkleinerung trägt.
    g.lineJoin = 'round'; g.strokeStyle = ink; g.lineWidth = Math.max(3, fs * 0.115);
    g.strokeText(text, 0, 0);
    g.fillStyle = paper; g.fillText(text, 0, 0);
    g.restore();

    // Sublines: höchstens zwei Zeilen, Special Elite, in Tusche auf Papierstreifen-Optik
    if (hasSub) {
      g.font = sfs + 'px "Special Elite", monospace';
      g.textAlign = 'center';
      // Sublines dunkler als der Titel: Tusche als Füllung, Papier als Kontur — umgekehrt zum Titel.
      // Pastellfüllung auf hellem Himmel war in der zweiten Zeile kaum lesbar (Review-Befund).
      g.strokeStyle = paper; g.lineWidth = slw; g.lineJoin = 'round';
      g.fillStyle = ink;
      subLines.forEach((l, i) => {
        const y = P.height * P.px + sfs * (1.1 + i * 1.2);
        g.strokeText(l, cv.width / 2, y);
        g.fillText(l, cv.width / 2, y);
      });
    }

    plateH = H;
    _metrics = { fs: titleFs, squeeze: +squeeze.toFixed(3), textW: titleW, fitW: Math.round(fit),
                 lines: subLines.length, subPx: Math.round(subPx), canvasH: cv.height };
    if (tex) tex.dispose();
    tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { W, H };
  }

  function build(W, H, ink) {
    for (const s of sheets) { group.remove(s); s.geometry.dispose(); s.material.dispose(); }
    sheets = [];
    const geo = new THREE.PlaneGeometry(W, H, 1, 1);
    const dark = new THREE.Color(ink);
    for (let i = P.layers - 1; i >= 0; i--) {
      const front = i === 0;
      const m = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, alphaTest: 0.42, depthWrite: true,
        side: THREE.DoubleSide, toneMapped: false,
        color: front ? 0xffffff : dark.clone().multiplyScalar(0.55 + 0.45 * (1 - i / P.layers)),
      });
      const s = new THREE.Mesh(geo, m);
      s.position.z = -i * P.depth;
      s.renderOrder = 3 + (P.layers - i);
      group.add(s);
      sheets.push(s);
      if (front) plate = s;
    }
    // Verbindung zur Karte: ein kurzer Tuschesteg, kein Faden. Er sitzt IM reservierten Band.
    if (!stem) {
      stem = new THREE.Mesh(new THREE.PlaneGeometry(P.stemW, 1, 1, 1),
        new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.85, toneMapped: false, side: THREE.DoubleSide }));
      stem.renderOrder = 3;
      group.add(stem);
    }
    stem.material.color.set(ink);
  }

  function attach(c, info) {
    if (!c) return detach();
    const d = c.data || {};
    const I = info || lastInfo || {};
    const text = String(I.text != null ? I.text : (d.title || '')).trim() || '—';
    const sub = I.sub || '';
    // Papierfarbe als Default, aber pastellig in Richtung Zone getönt: aus der Ferne ist die
    // FARBE die Auskunft, aus der Nähe die Schrift. 0,26 hält es pastellig statt bunt.
    const zone = new THREE.Color(I.tint != null ? I.tint : (d.ink != null ? d.ink : 0x8a5a3a));
    const paper = new THREE.Color(PAPER).lerp(zone, 0.26);
    const ink = new THREE.Color(INK).lerp(zone, 0.35);
    const key = text + '|' + sub + '|' + paper.getHexString() + '|' + Math.round(c.half.w * 100);

    if (card !== c) {
      if (card) card.padTop = 0;
      card = c;
    }
    lastInfo = { text, sub, tint: I.tint != null ? I.tint : d.ink };
    if (key !== lastKey) {
      lastKey = key;
      // Platte ist so breit wie die Karte — der Titel wird hineingerechnet, nicht die Platte
      // hinausgeschoben (Georgs Vorgabe: einzeilig ÜBER die Karte passen).
      wantW = c.half.w * 2;
      const dim = draw(text, sub, '#' + paper.getHexString(), '#' + ink.getHexString());
      build(dim.W, dim.H, '#' + ink.getHexString());
    }
    // **Das Band wird EINMAL reserviert** — die Animation bewegt sich darin, also rahmt das Dock
    // immer dieselbe Höhe. Ohne das springt die Detailansicht mit jedem Schwebe-Frame.
    const band = plateH + P.gap + P.floatReserve * 2;
    group.position.set(0, c.half.h + P.gap + plateH * 0.5, 0.16);
    group.visible = true;
    if (!group.parent || group.parent !== c.holder) c.holder.add(group);
    c.padTop = band;
    return true;
  }

  function detach() {
    if (card) card.padTop = 0;
    card = null; group.visible = false;
    lastInfo = null; lastKey = '';
    if (group.parent) group.parent.remove(group);
  }

  // Neu anhängen mit demselben Inhalt — der EINE Weg für Regler, Sublines und Schrift-Nachladen.
  function rebuild() { if (card) { const c = card, I = lastInfo; lastKey = ''; attach(c, I); } }

  // **Nachzeichnen, sobald die Schrift da ist.** Läuft der Webfont noch, malt der Browser still
  // Georgia — und der Titel bliebe dauerhaft darin, weil ein erneutes `attach` mit gleichem Inhalt
  // durch `lastKey` ein No-Op ist. Der Pfad ist erreichbar, nicht theoretisch: der Hub liegt am
  // Startpunkt, `onFocus` feuert also in den ersten Frames. Dieselbe Lehre wie in `academy-cards.js`
  // und `sky-cards.js` — dort steht der Hook schon, hier fehlte er.
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => rebuild()).catch(() => {});
  }

  function update(dt) {
    if (!card || !group.visible) return;
    T += dt || 0;
    // Schweben + leichtes Nicken. Amplitude ist Teil des reservierten Bandes, also ändert sich
    // die Rahmung nicht — nur der Titel lebt.
    const bob = Math.sin(T * 1.15) * P.float;
    const base = card.half.h + P.gap + plateH * 0.5;
    group.position.y = base + bob;
    group.rotation.x = Math.sin(T * 0.83) * 0.045;
    group.rotation.z = Math.sin(T * 0.61) * 0.022;
    if (stem) {
      // Der Steg wächst mit dem Schweben, statt zu reißen: von der Kartenkante zur Plattenunterkante.
      const top = -plateH * 0.5, len = Math.max(0.05, P.gap + bob);
      stem.scale.y = len;
      stem.position.set(0, top - len * 0.5, -P.depth * 0.5);
    }
  }

  return {
    name: 'card-title', group, attach, detach, update,
    get card() { return card; },
    get text() { return lastInfo ? lastInfo.text : ''; },
    get band() { return plateH + P.gap + P.floatReserve * 2; },
    // Abnahme-Auskunft: passt der Titel EINZEILIG in die Kartenbreite? (Schriftgröße, Stauchung,
    // gemessene Textbreite gegen die verfügbare.)
    get metrics() { return _metrics; },
    // Für später: Ticker-Zeile für längere Texte (Story-Beat, Kayfabulation).
    setSub(sub) { if (lastInfo) { lastInfo.sub = sub; rebuild(); } },
    redraw() { rebuild(); },
    setParams(p) { Object.assign(P, p || {}); rebuild(); },
    get params() { return P; },
    dispose() { detach(); for (const s of sheets) { s.geometry.dispose(); s.material.dispose(); } sheets = []; if (tex) tex.dispose(); },
  };
}
