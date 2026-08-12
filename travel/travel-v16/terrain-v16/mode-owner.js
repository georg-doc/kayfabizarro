// ============================================================================
// mode-owner.js — KFB Travel · Slice S42 (V9-B) · wer den Modus besitzt
// ----------------------------------------------------------------------------
// Auftrag aus `docs/INTERMISSION_reviews_v8.md` §V9-B. Vorher war der Modus eine
// freie Variable im Runner, und jede Aufrufstelle trug ihre eigene Bedingung:
//
//     if (autoMode && modeLockT <= 0 && st.landed && !auto.active && !dock.owns) switchMode('walk');
//
// Diese Kette ist nicht falsch — sie ist nur an der falschen Stelle. Sie entstand
// aus einem echten Fehler (ein Anflug auf eine tief hängende Karte über steigendem
// Terrain landete mitten im Flug im Boden-Modus), und die nächste Bedingung hätte
// sie weiter verlängert, bis niemand sie mehr liest.
//
// **Ein Modus-Wechsel ist ein ANTRAG mit Begründung.** Der Eigentümer entscheidet
// anhand benannter Regeln:
//
//     owner.request('walk', 'altitude')   → { ok: false, why: 'anflug-läuft' }
//     owner.request('walk', 'hand')       → { ok: true,  from: 'fly' }
//
// **Vorsicht bei der Antwort:** das Ergebnis eines ABGELEHNTEN Antrags ist ein wiederverwendetes
// Objekt (der Antrag steht im Frame-Pfad, siehe unten) — lies `ok`/`why` sofort, halte es nicht.
//
// Die Begründung ist keine Doku, sie ist Teil der Entscheidung: „die Höhe schlägt
// vor" darf abgelehnt werden, „die Hand will" nicht.
//
// Dazu die zweite Hälfte des Audit-Punkts: **Verträge statt Zusicherungen.**
// `assertController` prüft zur Laufzeit, was ein Controller wirklich kann, und
// meldet Abweichungen — ein TS-`interface` gibt es in diesem Projekt nicht, eine
// Prüfung schon.
//
//   const owner = createModeOwner({ initial: 'fly', modes: { fly: {enter, exit}, walk: {…} } });
//   owner.addRule('anflug-läuft', ({ to, reason }) => reason === 'altitude' && auto.active);
//   owner.request('walk', 'altitude');
// ============================================================================

export function createModeOwner(opts = {}) {
  const modes = opts.modes || {};
  const onChange = opts.onChange || null;
  let mode = opts.initial || Object.keys(modes)[0];
  let lockT = 0, lockWhy = '';
  const rules = [];                 // { name, fn }  → fn(ctx) truthy = ABLEHNEN
  const log = [];                   // letzte Entscheidungen, für Messung und Fehlersuche
  const denials = {};               // Name → Zähler: welche Regel greift wie oft?

  // **Der Antrag steht im Frame-Pfad — also darf er dort nichts kosten und nichts fluten.**
  // Die Aufrufstelle fragt bedingungslos jeden Frame („die Höhe schlägt vor"); das ist gewollt,
  // die Bedingungen sind hier. Daraus folgen zwei Dinge, die das Modul selbst tragen muss:
  //  1) **Kein Objekt pro Frame.** Der abgelehnte Pfad (der häufige!) bedient sich aus zwei
  //     wiederverwendeten Kratz-Objekten. Nur ein ANGENOMMENER Antrag ist ein Ereignis und darf
  //     ein frisches Objekt bekommen — der passiert höchstens ein paar Mal pro Minute.
  //  2) **Aufeinanderfolgende gleiche Entscheidungen werden gezählt, nicht gestapelt** (`n`).
  //     Sonst schiebt genau der Zustand, in dem man das Log braucht, die Vorgeschichte hinaus:
  //     gemessen 40 von 40 identischen Einträgen nach 60 Frames Anflug. Und `denials` zählte
  //     Frames statt Ereignisse — eine Zahl, die niemand deuten kann.
  const _ctx = { to: null, from: null, reason: '', opt: null, locked: false };
  const _deny = { ok: false, why: '', ctx: _ctx };

  // Gleiche Entscheidung wie zuletzt? Dann nur den Zähler des vorhandenen Eintrags hochsetzen.
  function note(ok, why, to, reason) {
    const last = log[log.length - 1];
    if (last && last.ok === ok && last.why === why && last.to === to && last.reason === reason) {
      last.n++; return false;
    }
    log.push({ ok, why, to, reason, n: 1 });
    if (log.length > 40) log.shift();
    return true;   // NEUE Entscheidung — nur die zählt als Ereignis
  }

  function deny(why, to, reason) {
    if (note(false, why, to, reason) && why !== 'schon-da' && why !== 'unbekannter-modus') {
      denials[why] = (denials[why] || 0) + 1;
    }
    _deny.why = why;
    return _deny;
  }

  function request(to, reason, opt) {
    const rs = reason || 'unspecified';
    _ctx.to = to; _ctx.from = mode; _ctx.reason = rs; _ctx.opt = opt || null; _ctx.locked = lockT > 0;
    if (!modes[to]) return deny('unbekannter-modus', to, rs);
    if (to === mode) return deny('schon-da', to, rs);
    for (const rule of rules) {
      let hit = false;
      try { hit = !!rule.fn(_ctx); } catch (e) { hit = false; }
      if (hit) return deny(rule.name, to, rs);
    }
    const from = mode;
    try { if (modes[from] && modes[from].exit) modes[from].exit(to, opt); } catch (e) { console.warn('[mode-owner] exit', from, e); }
    mode = to;
    try { if (modes[to].enter) modes[to].enter(opt, from); } catch (e) { console.warn('[mode-owner] enter', to, e); }
    if (onChange) { try { onChange(to, from, opt); } catch (e) {} }
    note(true, '', to, rs);
    return { ok: true, from, to, reason: rs };   // ein Wechsel ist selten — hier ist ein Objekt richtig
  }

  return {
    name: 'mode-owner',
    get mode() { return mode; },
    is(m) { return mode === m; },
    request,
    // Regeln sind BENANNT: eine abgelehnte Anfrage sagt, welche Regel gegriffen hat.
    addRule(name, fn) { rules.push({ name, fn }); return this; },
    // Sperrfrist nach einem Wechsel: sonst pendelt der Modus am Boden. Sie ist selbst eine Regel,
    // damit sie in derselben Statistik auftaucht wie alles andere.
    lock(seconds, why) { lockT = Math.max(lockT, seconds || 0); lockWhy = why || ''; },
    tick(dt) { lockT = Math.max(0, lockT - (dt || 0)); },
    get locked() { return lockT > 0; },
    get lockLeft() { return lockT; },
    get lockWhy() { return lockWhy; },
    get rules() { return rules.map((r) => r.name); },
    get denials() { return denials; },
    get log() { return log.slice(); },
    get last() { return log[log.length - 1] || null; },
  };
}

// ---------------------------------------------------------------- Vertragsprüfung
// Was ein Travel-Controller können muss. `enter`/`exit` besitzt der Modus-Eigentümer
// (die Controller selbst kennen keinen Lebenszyklus) — geprüft wird also, was WIR aufrufen.
const CONTRACT = {
  update: 'function',      // update(dt, input, world) — bewegt, malt nicht
  state: 'object',         // Lesezustand, jeden Frame gültig
  reset: 'function',       // an eine Position setzen
  setParams: 'function',   // Regler
};

export function assertController(name, c, extra) {
  const missing = [], wrong = [];
  const want = Object.assign({}, CONTRACT, extra || {});
  for (const k of Object.keys(want)) {
    const v = c ? c[k] : undefined;
    if (v == null) { missing.push(k); continue; }
    const t = typeof v;
    if (want[k] === 'object' ? (t !== 'object') : (t !== want[k])) wrong.push(k + ':' + t);
  }
  const ok = !missing.length && !wrong.length;
  if (!ok) console.warn('[contract] ' + name + ' verletzt den Controller-Vertrag', { missing, wrong });
  return { name, ok, missing, wrong, has: Object.keys(want).filter((k) => c && c[k] != null) };
}
