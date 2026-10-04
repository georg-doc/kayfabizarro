// ============================================================================
// lesson-search.js — KFB Travel · Slice S33 · Navi: Suche am Tacho
// ----------------------------------------------------------------------------
// Klick auf den Tacho öffnet ein Eingabefeld; was man tippt, ist eine LIVE-SUCHE
// über alle 31 Lektionen (Kurzwort · Titel · Beispiel-Id · Kapitel · Tag).
// Doppelklick auf einen Treffer → Auto-Pilot fliegt hin. Besuchte Lektionen sind
// leicht ausgegraut und tragen den Platz für ein Notiz-Icon (Post-it, später).
//
// **BEWUSST KISS:** das Feld ist ein DOM-Element an der BILDSCHIRMPOSITION des
// Würfels — nicht per `matrix3d`-Homographie auf die Würfelfläche geklebt. Der
// Homographie-Weg ist in der Cube Academy gebaut und kostet dort echten Aufwand
// (Rotation, Verdeckung, Fokus-Handling); 90 % des Nutzens hängen aber am
// Suchen und Anfliegen. Die echte Fläche kommt mit Voice in S34.
//
// Zwei Fallen, die hier absichtlich adressiert sind:
//  · **Tasten gehören dem Formular.** Solange das Feld offen ist, darf der Runner
//    keine Steuerung aus `keydown` lesen — sonst fliegt man beim Tippen von „part"
//    los (das `a` ist Lenken). Der Runner fragt `isOpen()`, wie beim Overlay.
//  · **Suche ist umlaut- und schreibweisen-tolerant** (`Räumlicher` → `raumlicher`,
//    `webgl_instancing_dynamic` → auch über „instancing" findbar), sonst findet man
//    genau die Lektionen nicht, deren Namen man nur halb erinnert.
//
//   const search = createLessonSearch({ mount, cards: () => academy.cards,
//                                       onFly: (card) => flyToCard(card) });
//   search.toggle();     // Tacho-Klick
// ============================================================================

const PAPER = '#efe6d0', INK = '#1f1a14', CREAM = '#f7f0dd';

// Umlaute falten, Trennzeichen raus: eine Schreibweise für Eingabe UND Feld.
function norm(s) {
  return String(s || '').toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export function createLessonSearch(opts = {}) {
  const mount = opts.mount || document.body;
  const cardsOf = opts.cards || (() => []);
  const onFly = opts.onFly || (() => {});
  const onSelect = opts.onSelect || (() => {});
  const cubeSize = opts.cubeSize || (() => 240);
  let accent = opts.accent || '#b5642a';

  let open = false, sel = 0, hits = [];

  const root = document.createElement('div');
  root.style.cssText = 'position:absolute;z-index:7;display:none;width:min(380px,calc(100vw - 32px));'
    + 'background:' + PAPER + ';color:' + INK + ';border:2px solid ' + INK + ';'
    + "font-family:'Special Elite',monospace;box-shadow:6px 6px 0 rgba(31,26,20,.35);"
    + 'transform:rotate(-0.25deg);';

  const head = document.createElement('div');
  head.style.cssText = 'display:flex;align-items:center;gap:8px;padding:9px 10px 8px;border-bottom:2px solid ' + INK + ';';
  const glass = document.createElement('div');
  glass.textContent = '⌕';
  glass.style.cssText = 'font-size:19px;line-height:1;opacity:.7;';
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Lektion suchen — z. B. part, terrain, klang';
  input.style.cssText = 'flex:1;min-width:0;background:transparent;border:0;outline:0;color:' + INK + ';'
    + "font-family:'Special Elite',monospace;font-size:14px;padding:2px 0;";
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.title = 'Esc';
  closeBtn.style.cssText = 'background:transparent;border:0;cursor:pointer;color:' + INK + ';opacity:.6;font-size:15px;line-height:1;padding:2px 4px;';
  head.append(glass, input, closeBtn);

  const list = document.createElement('div');
  list.style.cssText = 'max-height:min(46vh,340px);overflow:auto;overscroll-behavior:contain;';

  const foot = document.createElement('div');
  foot.style.cssText = 'padding:6px 10px 7px;border-top:1px solid rgba(31,26,20,.25);font-size:10px;letter-spacing:.06em;opacity:.65;';
  foot.textContent = '↑↓ wählen · Enter oder Doppelklick = anfliegen · Esc = zu';

  root.append(head, list, foot);
  mount.appendChild(root);

  function place() {
    const s = cubeSize();
    root.style.right = '16px';
    root.style.bottom = Math.round(s * 0.62 + 26) + 'px';   // über dem Würfel, ohne ihn zu verdecken
  }

  function score(card, tokens) {
    const d = card.data;
    const g = norm(d.glyph), t = norm(d.title), ex = norm(d.example), ch = norm(d.chapterTitle), tg = norm(d.tag);
    let s = 0;
    for (const q of tokens) {
      let best = 0;
      if (g.startsWith(q)) best = 100;
      else if (g.includes(q)) best = 70;
      else if (t.startsWith(q)) best = 60;
      else if (t.includes(q)) best = 45;
      else if (ex.includes(q)) best = 35;
      else if (ch.includes(q)) best = 22;
      else if (tg === q) best = 18;
      if (!best) return -1;            // AND: jedes Wort muss irgendwo treffen
      s += best;
    }
    return s;
  }

  function refresh() {
    const tokens = norm(input.value).split(' ').filter(Boolean);
    const all = cardsOf();
    if (!tokens.length) {
      hits = all.slice().sort((a, b) => a.data.route - b.data.route);
    } else {
      hits = all.map((c) => ({ c, s: score(c, tokens) })).filter((x) => x.s >= 0)
        .sort((a, b) => b.s - a.s || a.c.data.route - b.c.data.route).map((x) => x.c);
    }
    if (sel >= hits.length) sel = Math.max(0, hits.length - 1);
    draw();
  }

  function draw() {
    list.textContent = '';
    if (!hits.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding:14px 12px;font-size:12px;opacity:.6;';
      empty.textContent = 'Nichts gefunden. Kapitel: Bewegung · Masse · Partikel · Interaktion · Klang · Meta';
      list.appendChild(empty);
      return;
    }
    hits.forEach((card, i) => {
      const d = card.data;
      const row = document.createElement('div');
      const on = i === sel;
      row.style.cssText = 'display:flex;align-items:center;gap:9px;padding:7px 10px;cursor:pointer;'
        + 'border-bottom:1px solid rgba(31,26,20,.14);'
        + (on ? 'background:rgba(31,26,20,.09);' : '')
        + (d.visited ? 'opacity:.55;' : '');
      const nr = document.createElement('span');
      nr.textContent = d.nr;
      nr.style.cssText = 'flex:0 0 auto;min-width:26px;text-align:center;font-size:11px;padding:2px 3px;color:' + CREAM
        + ';background:#' + d.ink.toString(16).padStart(6, '0') + ';';
      const word = document.createElement('span');
      word.textContent = d.glyph;
      word.style.cssText = 'flex:0 0 auto;font-size:13px;letter-spacing:.04em;';
      const title = document.createElement('span');
      title.textContent = d.title;
      title.style.cssText = 'flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;opacity:.7;';
      const tag = document.createElement('span');
      tag.textContent = '[' + d.tag + ']';
      tag.style.cssText = 'flex:0 0 auto;font-size:10px;opacity:.55;';
      row.append(nr, word, title, tag);
      // Platz für das Notiz-Icon: heute nur ein Punkt bei besuchten Lektionen — dort hängt
      // später das Post-it mit den Studiennotizen (S34+).
      const note = document.createElement('span');
      note.textContent = d.visited ? '•' : '';
      note.title = d.visited ? 'besucht — Notizen folgen' : '';
      note.style.cssText = 'flex:0 0 auto;width:10px;text-align:center;font-size:13px;opacity:.8;';
      row.appendChild(note);
      row.addEventListener('mouseenter', () => { sel = i; draw(); });
      row.addEventListener('click', () => { sel = i; draw(); onSelect(card); });
      row.addEventListener('dblclick', () => { onFly(card); });
      list.appendChild(row);
    });
    const cur = list.children[sel];
    if (cur && cur.offsetTop < list.scrollTop) list.scrollTop = cur.offsetTop;
    else if (cur && cur.offsetTop + cur.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = cur.offsetTop + cur.offsetHeight - list.clientHeight;
    }
  }

  input.addEventListener('input', () => { sel = 0; refresh(); });
  input.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowDown') { e.preventDefault(); sel = Math.min(hits.length - 1, sel + 1); draw(); }
    else if (e.code === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); draw(); }
    else if (e.code === 'Enter') { e.preventDefault(); if (hits[sel]) onFly(hits[sel]); }
    else if (e.code === 'Escape') { e.preventDefault(); api.close(); }
    e.stopPropagation();   // Tippen ist kein Steuern
  });
  closeBtn.addEventListener('click', () => api.close());
  root.addEventListener('pointerdown', (e) => e.stopPropagation());
  root.addEventListener('wheel', (e) => e.stopPropagation());

  const api = {
    name: 'lesson-search', root,
    isOpen: () => open,
    open() {
      open = true; root.style.display = 'block'; place(); refresh();
      input.focus(); input.select();
    },
    close() { open = false; root.style.display = 'none'; input.blur(); },
    toggle() { open ? api.close() : api.open(); },
    refresh,
    setAccent(hex) { accent = hex; },
    place,
    get selected() { return hits[sel] || null; },
    get count() { return hits.length; },
    dispose() { root.remove(); },
  };
  return api;
}
