// ============================================================================
// note-field.js — KFB Travel · Slice S51 · das Post-it wird beschreibbar
// ----------------------------------------------------------------------------
// Geplant in `docs/SPRINT_travel-v10.md` S51. Entschieden in `docs/DECISIONS_v10.md`
// (Frage 3): Notizen sind der eigentliche Ertrag der Reise — nicht der Besuch.
//
// WARUM DOM UND NICHT CANVAS-EINGABE: Text tippt man nicht auf einer Textur. Die
// Eingabe ist ein echtes `<textarea>`, das über der Bildschirmposition des Post-its
// liegt; beim Schließen wandert der Text auf die Textur, wo er hingehört. Das ist
// dieselbe Trennung wie beim Strip: **Text gehört ins DOM, Bild in die Welt.**
//
// DIE REGEL, DIE ZWEIMAL WEHGETAN HAT: solange getippt wird, gehören die Tasten dem
// Feld. `travel-input.js` fragt dafür `isOpen()` — wie beim Suchfeld, sonst lenkt
// „w" das Fahrzeug, während man „Wurfweite" schreibt.
//
// Das Feld POSITIONIERT sich pro Frame neu (die Karte schwebt), aber es SCHREIBT
// nichts in die Welt: es liefert beim Schließen einen Text zurück. Wer ihn speichert,
// ist die Journey; wer ihn zeichnet, ist die Akademie.
//
//   const nf = createNoteField({ mount, onSave });
//   nf.open(card, journey.noteOf(card));
//   nf.follow(camera, renderer);   // pro Frame, solange offen
//   nf.close(true);                // speichern
// ============================================================================

export function createNoteField(opts = {}) {
  const mount = opts.mount || document.body;
  const onSave = opts.onSave || null;
  const P = Object.assign({ maxLen: 320, rows: 4 }, opts.params || {});

  const root = document.createElement('div');
  root.style.cssText = 'position:absolute;left:0;top:0;transform-origin:50% 50%;pointer-events:none;'
    // **`display:none` im Ruhezustand, nicht nur `opacity:0`.** Deckkraft schaltet die
    // Trefferprüfung NICHT ab: der Kasten blieb unsichtbar klickbar, verschluckte Zeiger-Ereignisse
    // („elementFromPoint → TEXTAREA“) und nahm getippte Zeichen in einem Feld entgegen, das niemand
    // sieht. Sichtbarkeit und Bedienbarkeit sind dasselbe Schalterpaar — also EIN Schalter.
    + 'display:none;opacity:0;transition:opacity .18s ease;z-index:7;';
  const box = document.createElement('div');
  // Papier, Tuschekante, leicht schräg — das Post-it, nur bedienbar.
  box.style.cssText = 'background:#f6ecc8;border:2px solid #241d16;box-shadow:3px 4px 0 rgba(31,26,20,.45);'
    + 'padding:9px 10px 7px;pointer-events:auto;';
  const ta = document.createElement('textarea');
  ta.maxLength = P.maxLen;
  ta.rows = P.rows;
  ta.spellcheck = false;
  ta.placeholder = 'Notiz …';
  ta.style.cssText = 'display:block;width:100%;box-sizing:border-box;border:0;outline:none;resize:none;'
    + "background:transparent;color:#241d16;font-family:'Special Elite',monospace;font-size:12px;line-height:1.5;";
  const hint = document.createElement('div');
  hint.textContent = 'Esc = sichern';
  hint.style.cssText = "margin-top:4px;font-family:'Special Elite',monospace;font-size:9px;letter-spacing:.1em;"
    + 'text-transform:uppercase;opacity:.5;color:#241d16;text-align:right;';
  box.appendChild(ta); box.appendChild(hint); root.appendChild(box);
  mount.appendChild(root);

  let card = null, open = false;
  // **Kein `new` im Frame-Pfad.** `place()` läuft pro Frame, solange getippt wird — drei Vektoren je
  // Aufruf wären ~180 Allokationen/Sekunde. Sie werden einmal beim ersten Aufruf aus der Kamera
  // erzeugt (der Konstruktor liegt nur dort) und danach nur noch beschrieben; dasselbe Muster wie
  // `_c4` in `travel-input.js`.
  let _v = null, _a = null, _b = null;

  function place(camera, renderer) {
    if (!card || !camera) return;
    const p = card.postit;
    if (!p) return;
    p.updateWorldMatrix(true, false);
    if (!_v) { const V = camera.position.constructor; _v = new V(); _a = new V(); _b = new V(); }
    _v.setFromMatrixPosition(p.matrixWorld).project(camera);
    const el = renderer && renderer.domElement ? renderer.domElement : null;
    const w = el ? el.clientWidth : window.innerWidth;
    const h = el ? el.clientHeight : window.innerHeight;
    // Breite folgt der Größe des Post-its im Bild: in der Detailansicht groß, im Flug klein.
    // Damit sitzt das Feld AUF dem Blatt und nicht daneben.
    const a = _a, b = _b;
    a.set(-p.geometry.parameters.width / 2, 0, 0).applyMatrix4(p.matrixWorld).project(camera);
    b.set(p.geometry.parameters.width / 2, 0, 0).applyMatrix4(p.matrixWorld).project(camera);
    const px = Math.max(120, Math.abs(b.x - a.x) * 0.5 * w);
    root.style.width = Math.round(px) + 'px';
    root.style.left = Math.round((_v.x * 0.5 + 0.5) * w - px / 2) + 'px';
    root.style.top = Math.round((-_v.y * 0.5 + 0.5) * h - px * 0.4) + 'px';
    root.style.transform = 'rotate(' + (p.rotation.z * 57.3).toFixed(1) + 'deg)';
    root.style.opacity = _v.z > 1 ? '0' : '1';
    ta.style.fontSize = Math.max(10, Math.min(19, px * 0.085)).toFixed(1) + 'px';
  }

  return {
    name: 'note-field',
    // **Der Knoten gehört nach außen.** Die DC-Laufzeit kann `#tv-stage` bei einem Re-Render durch
    // einen NEUEN Knoten ersetzen; `keepAttached()` im Runner hängt seine Kinder dann zurück. Wer
    // seinen Knoten nicht herausgibt, ist nach dem ersten Re-Render weg — und hält sich trotzdem
    // für offen. Genau das hat `hint`/`strip`/`search.root` schon einmal gekostet.
    get root() { return root; },
    isOpen: () => open,
    get card() { return card; },
    open(c, text, camera, renderer) {
      if (!c) return false;
      card = c; open = true;
      ta.value = text || '';
      root.style.display = 'block';
      root.style.opacity = '1';
      place(camera, renderer);
      // Fokus erst im nächsten Frame: sonst frisst der Klick, der das Feld öffnet, den Fokus wieder.
      setTimeout(() => { try { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) {} }, 0);
      return true;
    },
    close(save) {
      if (!open) return null;
      const t = ta.value.trim();
      const c = card;
      open = false; card = null;
      root.style.opacity = '0';
      root.style.display = 'none';
      try { ta.blur(); } catch (e) {}
      if (save && onSave) { try { onSave(c, t); } catch (e) {} }
      return t;
    },
    follow(camera, renderer) { if (open) place(camera, renderer); },
    get text() { return ta.value; },
    dispose() { if (root.parentNode) root.parentNode.removeChild(root); },
  };
}
