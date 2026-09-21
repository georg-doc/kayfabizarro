// ============================================================================
// settings-overlay.js — KFB Travel · Slice S8 · Einstellungen + Steuerung
// ----------------------------------------------------------------------------
// Fast flächendeckendes Overlay, das der HUD-Würfel öffnet. Regeln (Sprintplan):
//  · Das Spiel läuft WEITER hinter dem Overlay (halbtransparent + Blur) — ein
//    Modal, das die Welt anhält, fühlt sich wie Rauswerfen an.
//  · Cluster nach Häufigkeit, nicht nach Entstehungsreihenfolge; Seltenes und
//    Riskantes (Seed, Qualität, Reset) sitzt unten.
//  · Jeder Regler zeigt seinen Wert, Änderungen gelten SOFORT (kein „Anwenden").
//  · Esc und Klick daneben schließen. Keine Emoji, KFB-Typografie.
//  · Die Steuerungs-Legende aller Travel-Modi lebt hier — nicht mehr im HUD.
//
// Sektionen kommen als DATEN vom Runner (er weiß, was echt regelbar ist):
//   createSettingsOverlay({ mount, accent, onOpen, onClose, sections: [
//     { id:'cards', title:'Karten', hint:'…', controls:[
//       { kind:'select', label:'Story-Modus', options:[{v,l}], get, set },
//       { kind:'slider', label:'Rauheit', min:0, max:1, step:0.01, get, set, fmt },
//       { kind:'toggle', label:'Spirale', get, set },
//       { kind:'button', label:'Neu würfeln', onClick },
//       { kind:'text',   label:'Seed', get, set },
//       { kind:'info',   label:'Tempo', get },
//       { kind:'keys',   rows:[['W / S','Schub · langsam'], …] },
//     ]}, …] })
//   ov.open('music') · ov.close() · ov.isOpen() · ov.setAccent(hex) · ov.refresh()
// ============================================================================

const PAPER = '#f4efe4', CARD = '#efe9dd', LINE = '#e0d8c8', INK = '#1f1a14', MUTED = '#6a6252';
const MONO = "'Special Elite', ui-monospace, monospace";
const SANS = "'Baloo 2', system-ui, sans-serif";

export function createSettingsOverlay(opts = {}) {
  const mount = opts.mount || document.body;
  const sections = opts.sections || [];
  let accent = opts.accent || '#b5442a';
  let open = false, current = null;
  const refreshers = [];

  const el = (tag, css, text) => {
    const n = document.createElement(tag);
    if (css) n.style.cssText = css;
    if (text != null) n.textContent = text;
    return n;
  };

  // ---------------------------------------------------------------- Gerüst
  const root = el('div', 'position:absolute;inset:0;z-index:20;display:none;opacity:0;'
    + 'transition:opacity .18s ease;background:rgba(18,14,10,.5);backdrop-filter:blur(9px);'
    + '-webkit-backdrop-filter:blur(9px);pointer-events:auto;');
  // Akzent als Custom-Property am Root: EIN Zuweisen zieht Rand, Slider-Thumbs und
  // Live-Werte gemeinsam nach. Inline eingebackene Farben taten das nicht (Story-Wechsel
  // hinterließ orange Regler in einem weinroten Panel).
  root.style.setProperty('--kfb-accent', accent);
  const AC = 'var(--kfb-accent)';
  const panel = el('div', 'position:absolute;inset:3vh 2.6vw;background:' + PAPER + ';border:1px solid ' + LINE + ';'
    + 'border-radius:3px;box-shadow:0 24px 70px rgba(0,0,0,.45);overflow:auto;'
    + 'padding:20px 22px 24px;display:grid;gap:14px;align-content:start;'
    + 'grid-template-columns:repeat(auto-fit,minmax(248px,1fr));');
  root.appendChild(panel);
  mount.appendChild(root);

  const head = el('div', 'grid-column:1/-1;display:flex;align-items:flex-end;justify-content:space-between;'
    + 'gap:16px;border-bottom:2px solid ' + INK + ';padding-bottom:10px;');
  const headL = el('div');
  const eyebrow = el('div', 'font-family:' + MONO + ';font-size:10px;letter-spacing:.24em;'
    + 'text-transform:uppercase;color:' + AC + ';margin-bottom:3px;', opts.eyebrow || 'KFB Travel');
  headL.appendChild(eyebrow);
  headL.appendChild(el('div', 'font-family:' + SANS + ';font-weight:800;font-size:26px;line-height:1;color:' + INK + ';', 'Einstellungen'));
  const closeBtn = el('button', 'font-family:' + MONO + ';font-size:11px;letter-spacing:.12em;text-transform:uppercase;'
    + 'color:' + INK + ';background:' + CARD + ';border:1px solid ' + LINE + ';border-radius:2px;'
    + 'padding:8px 14px;cursor:pointer;min-height:36px;', 'Schließen · Esc');
  closeBtn.addEventListener('click', () => close());
  head.appendChild(headL); head.appendChild(closeBtn);
  panel.appendChild(head);

  // ---------------------------------------------------------------- Controls
  function labelRow(text) {
    return el('div', 'font-family:' + MONO + ';font-size:11px;letter-spacing:.04em;color:' + INK + ';'
      + 'display:flex;justify-content:space-between;gap:10px;align-items:baseline;', text);
  }
  function ctrlSlider(c, box) {
    const row = labelRow(c.label);
    const val = el('span', 'font-family:' + MONO + ';font-size:11px;color:' + MUTED + ';');
    row.appendChild(val);
    const inp = el('input', 'width:100%;accent-color:' + AC + ';margin:4px 0 2px;height:22px;');
    inp.type = 'range'; inp.min = c.min; inp.max = c.max; inp.step = c.step != null ? c.step : 0.01;
    const show = () => {
      const v = c.get();
      inp.value = v;
      val.textContent = c.fmt ? c.fmt(v) : (Math.round(v * 100) / 100);
    };
    inp.addEventListener('input', () => { c.set(parseFloat(inp.value)); show(); });
    box.appendChild(row); box.appendChild(inp);
    refreshers.push(show); show();
  }
  function ctrlSelect(c, box) {
    box.appendChild(labelRow(c.label));
    const sel = el('select', 'width:100%;font-family:' + MONO + ';font-size:11.5px;color:' + INK + ';'
      + 'background:#fff;border:1px solid ' + LINE + ';border-radius:2px;padding:8px 8px;margin:4px 0 2px;'
      + 'min-height:36px;cursor:pointer;');
    // options darf eine Funktion sein: Listen, die erst später laden (24 Pets aus dem Vertrag)
    const list = () => (typeof c.options === 'function' ? (c.options() || []) : c.options);
    let built = -1;
    const fill = () => {
      const o = list();
      if (o.length === built) return;
      built = o.length; sel.textContent = '';
      for (const it of o) { const op = el('option', '', it.l); op.value = it.v; sel.appendChild(op); }
    };
    const show = () => { fill(); sel.value = String(c.get()); };
    sel.addEventListener('change', () => { c.set(sel.value); });
    box.appendChild(sel); refreshers.push(show); show();
  }
  function ctrlToggle(c, box) {
    const btn = el('button', 'width:100%;text-align:left;font-family:' + MONO + ';font-size:11px;'
      + 'letter-spacing:.04em;color:' + INK + ';background:' + CARD + ';border:1px solid ' + LINE + ';'
      + 'border-radius:2px;padding:9px 11px;cursor:pointer;display:flex;justify-content:space-between;'
      + 'align-items:center;gap:10px;min-height:38px;');
    const state = el('span', 'font-family:' + MONO + ';font-size:10.5px;letter-spacing:.1em;');
    btn.appendChild(el('span', '', c.label)); btn.appendChild(state);
    const show = () => {
      const on = !!c.get();
      state.textContent = on ? 'AN' : 'AUS';
      state.style.color = on ? AC : MUTED;
      btn.style.borderColor = on ? AC : LINE;
    };
    btn.addEventListener('click', () => { c.set(!c.get()); show(); });
    box.appendChild(btn); refreshers.push(show); show();
  }
  function ctrlButton(c, box) {
    const btn = el('button', 'width:100%;font-family:' + MONO + ';font-size:11px;letter-spacing:.08em;'
      + 'text-transform:uppercase;color:' + INK + ';background:transparent;border:1px dashed ' + LINE + ';'
      + 'border-radius:2px;padding:9px 11px;cursor:pointer;min-height:38px;', c.label);
    btn.addEventListener('click', () => { c.onClick(); refresh(); });
    box.appendChild(btn);
  }
  function ctrlText(c, box) {
    box.appendChild(labelRow(c.label));
    const inp = el('input', 'width:100%;font-family:' + MONO + ';font-size:11.5px;color:' + INK + ';'
      + 'background:#fff;border:1px solid ' + LINE + ';border-radius:2px;padding:8px;margin:4px 0 2px;'
      + 'min-height:36px;box-sizing:border-box;');
    inp.type = 'text';
    const show = () => { if (document.activeElement !== inp) inp.value = c.get(); };
    inp.addEventListener('change', () => c.set(inp.value));
    box.appendChild(inp); refreshers.push(show); show();
  }
  function ctrlInfo(c, box) {
    const row = labelRow(c.label);
    const val = el('span', 'font-family:' + MONO + ';font-size:11px;color:' + AC + ';');
    row.appendChild(val);
    const show = () => { val.textContent = c.get(); };
    box.appendChild(row); refreshers.push(show); show();
  }
  function ctrlKeys(c, box) {
    const grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:4px 22px;');
    for (const [k, v] of c.rows) {
      const r = el('div', 'display:flex;gap:10px;align-items:baseline;border-bottom:1px solid ' + LINE + ';padding:5px 0;');
      r.appendChild(el('span', 'font-family:' + MONO + ';font-size:11px;color:' + INK + ';min-width:104px;', k));
      r.appendChild(el('span', 'font-family:' + SANS + ';font-size:13px;color:' + MUTED + ';', v));
      grid.appendChild(r);
    }
    box.appendChild(grid);
  }
  const BUILD = { slider: ctrlSlider, select: ctrlSelect, toggle: ctrlToggle, button: ctrlButton, text: ctrlText, info: ctrlInfo, keys: ctrlKeys };

  // ---------------------------------------------------------------- Sektionen
  const cards = {};
  for (const s of sections) {
    const wide = s.wide ? 'grid-column:1/-1;' : '';
    const card = el('div', wide + 'background:' + CARD + ';border:1px solid ' + LINE + ';border-left:3px solid ' + LINE + ';'
      + 'border-radius:2px;padding:13px 15px 15px;display:flex;flex-direction:column;gap:9px;transition:border-color .2s;');
    const t = el('div', 'font-family:' + MONO + ';font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:' + INK + ';');
    t.textContent = s.title;
    card.appendChild(t);
    if (s.hint) card.appendChild(el('div', 'font-family:' + SANS + ';font-size:12.5px;line-height:1.45;color:' + MUTED + ';margin-top:-3px;', s.hint));
    for (const c of (s.controls || [])) (BUILD[c.kind] || (() => {}))(c, card);
    panel.appendChild(card);
    cards[s.id] = card;
  }

  function highlight(id) {
    for (const k in cards) {
      const on = k === id;
      cards[k].style.borderLeftColor = on ? AC : LINE;
      cards[k].style.borderColor = on ? AC : LINE;
      cards[k].style.borderLeftWidth = '3px';
    }
    // kein scrollIntoView: direkt setzen, das Overlay ist der Scroll-Container
    if (cards[id]) panel.scrollTop = Math.max(0, cards[id].offsetTop - panel.offsetTop - 16);
  }

  function refresh() { for (const f of refreshers) { try { f(); } catch (e) {} } }

  let raf = 0;
  function tick() {
    if (!open) return;
    refresh();
    raf = setTimeout(tick, 260);   // Live-Werte (Tempo, Modus) ohne Frame-Kosten
  }

  function doOpen(id) {
    current = id || sections[0] && sections[0].id;
    root.style.display = 'block';
    requestAnimationFrame(() => { root.style.opacity = '1'; });
    open = true;
    refresh(); highlight(current);
    clearTimeout(raf); tick();
    if (opts.onOpen) opts.onOpen(current);
  }
  function close() {
    if (!open) return;
    open = false; clearTimeout(raf);
    root.style.opacity = '0';
    setTimeout(() => { if (!open) root.style.display = 'none'; }, 200);
    if (opts.onClose) opts.onClose();
  }

  root.addEventListener('pointerdown', (e) => { if (e.target === root) close(); });
  // Tasten dürfen NICHT ins Spiel durchfallen, solange das Overlay offen ist
  const onKey = (e) => {
    if (!open) return;
    if (e.code === 'Escape') { close(); e.preventDefault(); }
    e.stopPropagation();
  };
  addEventListener('keydown', onKey, true);
  addEventListener('keyup', (e) => { if (open) e.stopPropagation(); }, true);

  return {
    name: 'settings-overlay', root, panel,
    open: doOpen, close, refresh,
    isOpen() { return open; },
    toggle(id) { if (open && (!id || id === current)) close(); else doOpen(id); },
    setAccent(hex) {
      accent = hex;
      root.style.setProperty('--kfb-accent', hex);   // ein Zuweisen → alles zieht nach
      if (current) highlight(current);
      refresh();
    },
    dispose() {
      removeEventListener('keydown', onKey, true);
      root.remove();
    },
  };
}
