// ============================================================================
// narrator-llm.js — KFB Travel v12 · S80 · Die LLM-Ebene über dem Mund
// ----------------------------------------------------------------------------
// S70 hat den Mund gebaut (`narrator.js` + `frizzlebob-voice.js`, ohne Netz). Diese
// Ebene liegt DARÜBER, nie darunter — Handover §1. Sie erfindet den Satz; wenn sie
// schweigt, scheitert oder zu langsam ist, spricht die eingebaute Zeile. Der Spieler
// merkt den Unterschied nur an der Qualität, nie an einer Lücke.
//
// DIE ENTSCHEIDUNG, die alles andere trägt: **wir warten nie auf das Modell.**
// Ein Beat, der auf eine Antwort wartet, ist ein Beat, der zu spät kommt (und die
// Ankunft redet dann über die Ankunft hinweg). Also wird VORGEZOGEN: der weite Beat
// (Ki, ~190 u) stellt die Frage, der Punch-Beat (Shō, ~95 u) holt die Antwort aus
// dem Fach. Kommt sie nicht rechtzeitig, ist das Fach leer und die Karte spricht
// ihren eigenen Text — kein Warten, kein Füller, keine zweite Uhr.
//
// Fehlerklassen, gegen die hier gebaut ist:
//  · *jeder Auftrag braucht einen Rückweg* — `cancel()` verwirft laufende Anfragen
//    (Generationszähler), ein Moduswechsel oder Abbruch macht sie ungültig.
//  · *auf „läuft" gaten, nie auf „existiert"* — ohne `window.claude` bleibt die
//    Ebene aus und meldet den Grund, statt still zu scheitern.
//  · *eine Zahl, ein Ort* — Tempo, Modus und Entfernung kommen von den Besitzern
//    (heat, dice, autopilot), nicht aus einer eigenen Messung.
//
//   const llm = createNarratorLLM({ prompts, onLine: (t) => narrator.line(t, 2) });
//   llm.setEnabled(true); await llm.setPersona('bunny_carny');
//   llm.cue(card, 'punch', { v, mode });     // vorziehen
//   llm.take(card, 'punch');                 // synchron: Text oder null
// ============================================================================

export function createNarratorLLM(opts = {}) {
  const P = Object.assign({
    minGap: 4500,        // Mindestabstand zweier Anfragen (die Rate ist begrenzt, 15/min)
    perMinute: 8,        // eigenes Dach, deutlich unter der Grenze — der Rest gehört anderen
    timeout: 7000,       // eine Antwort, die später kommt, ist kein Beat mehr
    maxChars: 240,       // gesprochen, nicht gelesen: zwei Sätze sind das Maß
    maxTokens: 120,
    keep: 6,             // wie viele gesagte Zeilen als `story` mitgehen
    ttl: 90000,          // wie lange eine vorgezogene Zeile im Fach gültig bleibt
  }, opts.params || {});

  const prompts = opts.prompts;
  const cache = new Map();               // key → { text, at }
  const story = [];
  const calls = [];                      // Zeitstempel der letzten Minute
  const stat = { gefragt: 0, geliefert: 0, still: 0, leer: 0, fehler: 0, verworfen: 0, ms: 0, msMax: 0, letzte: '', grund: '' };
  let enabled = false, role = 'narrator', personaId = null, sys = null, source = '—';
  let gen = 0, inflight = 0, lastAt = 0;

  const has = () => typeof window !== 'undefined' && window.claude && typeof window.claude.complete === 'function';
  const key = (card, kind) => (card && (card.id || (card.data && card.data.title) || '?')) + '|' + kind;

  // Gesprochen, nicht gelesen: Markup, Klammern und Gedankenstriche würden vorgelesen.
  // „silence" ist eine ANTWORT, kein Fehler — dann bleibt das Fach leer und die Karte spricht selbst.
  function clean(t) {
    let s = String(t || '').replace(/```[\s\S]*?```/g, ' ').replace(/[*_`#>\[\]{}|]/g, ' ');
    s = s.replace(/\s+[-–—]+\s+/g, '. ').replace(/[–—]/g, '. ');
    s = s.replace(/^\s*(sure|okay|of course|here (is|are)|let me)\b[^.]*\.\s*/i, '');
    s = s.replace(/^["'“”]+|["'“”]+$/g, '').replace(/\s{2,}/g, ' ').trim();
    if (!s || /^silence[.!]?$/i.test(s)) return '';
    if (s.length > P.maxChars) s = s.slice(0, P.maxChars).replace(/\s+\S*$/, '') + '.';
    return s;
  }

  function allowed() {
    const now = performance.now();
    while (calls.length && now - calls[0] > 60000) calls.shift();
    return enabled && has() && sys && inflight === 0 && calls.length < P.perMinute && now - lastAt >= P.minGap;
  }

  function payload(card, kind, live) {
    const d = (card && (card.data || card)) || {};
    const v = live && live.v != null ? live.v : 0.4;
    return [
      'card:  ' + [d.title || 'unnamed', d.power ? 'power: ' + d.power : '', d.lore ? 'lore: ' + d.lore : ''].filter(Boolean).join(' | '),
      'mode:  ' + String((live && live.mode) || 'absurd').toLowerCase(),
      'speed: ' + (v > 0.66 ? 'fast' : v > 0.3 ? 'cruising' : 'slow'),
      'story: ' + (story.length ? story.join(' / ') : 'nothing yet'),
      'cue:   ' + kind,
    ].join('\n');
  }

  async function complete(system, user) {
    const t0 = performance.now();
    const race = [window.claude.complete({ system, max_tokens: P.maxTokens, messages: [{ role: 'user', content: user }] })];
    race.push(new Promise((_, rej) => setTimeout(() => rej(new Error('Zeit')), P.timeout)));
    const out = await Promise.race(race);
    const ms = performance.now() - t0;
    stat.ms = Math.round(ms); stat.msMax = Math.max(stat.msMax, Math.round(ms));
    return out;
  }

  return {
    name: 'narrator-llm',
    get enabled() { return enabled; },
    get persona() { return personaId; },
    get role() { return role; },
    get source() { return source; },

    setEnabled(on) {
      enabled = !!on && has();
      stat.grund = !on ? '' : (has() ? '' : 'kein LLM in diesem Fenster');
      if (!enabled) { gen++; cache.clear(); }
      return enabled;
    },
    /** Persönlichkeit laden (Repo, sonst Code). Erst danach fragt die Ebene etwas. */
    async setPersona(id) {
      personaId = id || (prompts ? prompts.defaultId() : null);
      const p = prompts ? await prompts.load(role, personaId) : null;
      sys = p ? p.system : null; source = p ? p.source : '—';
      cache.clear();
      return { id: personaId, source };
    },
    async setRole(r) {
      role = r || 'narrator';
      return this.setPersona(role === 'narrator' ? personaId : null);
    },

    /** Vorziehen: fragt für einen Beat, der noch kommt. Antwort landet im Fach. */
    cue(card, kind, live) {
      if (!card || !allowed()) return false;
      const k = key(card, kind), have = cache.get(k);
      if (have && performance.now() - have.at < P.ttl) return false;
      const myGen = gen; inflight++; lastAt = performance.now(); calls.push(lastAt); stat.gefragt++;
      complete(sys, payload(card, kind, live))
        .then((txt) => {
          inflight--;
          if (myGen !== gen) { stat.verworfen++; return; }         // Rückweg: abgebrochen
          const s = clean(txt);
          if (!s) { stat.still++; return; }
          cache.set(k, { text: s, at: performance.now() });
          stat.geliefert++;
        })
        .catch((e) => { inflight--; stat.fehler++; stat.grund = String(e && e.message || e).slice(0, 60); });
      return true;
    },

    /** Synchron: Text aus dem Fach (einmalig), sonst null → die Karte spricht selbst. */
    take(card, kind) {
      if (!enabled || !card) return null;
      const k = key(card, kind), hit = cache.get(k);
      if (!hit) { stat.leer++; return null; }
      cache.delete(k);
      if (performance.now() - hit.at > P.ttl) return null;
      stat.letzte = hit.text.slice(0, 80);
      return hit.text;
    },

    /** Direkte Frage (Tutor / QA). Spricht selbst über `onLine`, wenn etwas kommt. */
    async ask(question, live) {
      if (!allowed()) return null;
      const myGen = gen; inflight++; lastAt = performance.now(); calls.push(lastAt); stat.gefragt++;
      try {
        const txt = await complete(sys, (question ? 'question: ' + question + '\n' : '') + payload(live && live.card, role, live));
        inflight--;
        if (myGen !== gen) { stat.verworfen++; return null; }
        const s = clean(txt);
        if (!s) { stat.still++; return null; }
        stat.geliefert++; stat.letzte = s.slice(0, 80);
        if (opts.onLine) { try { opts.onLine(s); } catch (e) {} }
        return s;
      } catch (e) { inflight--; stat.fehler++; stat.grund = String(e && e.message || e).slice(0, 60); return null; }
    },

    /** Was gesagt wurde, geht als `story` mit — der Erzähler fängt nicht bei jeder Karte neu an. */
    noteSpoken(text) {
      const s = String(text || '').trim(); if (!s) return;
      story.push(s.slice(0, 90)); while (story.length > P.keep) story.shift();
    },
    cancel() { gen++; cache.clear(); },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    report() {
      return {
        an: enabled, rolle: role, person: personaId, quelle: source,
        gefragt: stat.gefragt, geliefert: stat.geliefert, still: stat.still, leerImFach: stat.leer,
        fehler: stat.fehler, verworfen: stat.verworfen, ms: stat.ms, msMax: stat.msMax,
        grund: stat.grund, letzte: stat.letzte, story: story.length,
      };
    },
  };
}
