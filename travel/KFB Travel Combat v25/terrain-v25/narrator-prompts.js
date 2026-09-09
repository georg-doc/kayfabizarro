// ============================================================================
// narrator-prompts.js — KFB Travel v12 · S80 · Die Prompts kommen aus dem Repo
// ----------------------------------------------------------------------------
// Georgs Bedingung aus dem Handover (§2): **eine Persönlichkeit ändern, ohne die
// Anwendung anzufassen.** Also liegen die Prompts dort, wo Decks, Manifest und
// Texturen schon liegen — `georg-doc/kayfabizarro`, und sie sind schon geschrieben:
//
//     media/prompts/narrator/<id>.md      12 Persönlichkeiten (bunny_carny …)
//
// Die zweite Hälfte derselben Bedingung: **ein Prompt braucht einen Fallback im
// Code.** Ohne Netz, mit kaputtem Blatt oder bei einer 404-HTML-Seite statt Text
// muss das Pet einen eingebauten Auftrag haben und weiterreden. Deshalb wird auf
// „LÄUFT" gegatet, nicht auf „existiert": ein geholtes Blatt gilt erst als Prompt,
// wenn es lang genug ist (`minLen`) und nicht nach HTML aussieht.
//
// Rollen sind eine TABELLE, kein Sonderfall (Handover §1: Erzähler · Tutor · QA).
// Für `narrator` liegen die Blätter im Repo; `tutor` und `qa` haben heute nur den
// Code-Fallback — sie gehören ins Repo, sobald sie geschrieben sind, und dieses
// Modul findet sie dann ohne Änderung (`ROLE_DIR`).
//
//   const reg = createPromptRegistry();
//   await reg.load('narrator', 'bunny_carny');   → { system, source: 'repo'|'code' }
//   reg.personas() / reg.report()
// ============================================================================

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/prompts/';
const ROLE_DIR = { narrator: 'narrator/', tutor: 'tutor/', qa: 'qa/' };

// Die zwölf Blätter, die im Repo liegen (Stand 26.7.2026). Die Liste steht hier, weil das Repo
// KEINE `index.json` hat — sobald es eine gibt, gewinnt sie (`loadIndex`), und diese Liste ist nur
// noch das Netz darunter. Namen, die ich im Blatt gelesen habe, stehen als Name da; für die
// anderen bildet `pretty()` das Label aus der Datei — geraten wird nichts.
const PERSONAS = [
  { id: 'bunny_carny', pet: 'bunny', name: 'Uncle FrizzleBob', isDefault: true },
  { id: 'cat_skeptic', pet: 'cat', name: 'Doc H.A.I.ner' },
  { id: 'fox_trickster', pet: 'fox' },
  { id: 'tiger_brawler', pet: 'tiger' },
  { id: 'panda_sage', pet: 'panda' },
  { id: 'lion_tolstoy', pet: 'lion' },
  { id: 'monkey_panchatantra', pet: 'monkey' },
  { id: 'crab_wabisabi', pet: 'crab' },
  { id: 'deer_mononoaware', pet: 'deer' },
  { id: 'giraffe_yugen', pet: 'giraffe' },
  { id: 'koala_dreamer', pet: 'koala' },
  { id: 'polar_polyphony', pet: 'polar' },
];

const pretty = (id) => String(id).split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' · ');

// ---------------------------------------------------------------- Code-Fallbacks
// Der eingebaute Auftrag ist die KURZFASSUNG des Repo-Vertrags, nicht eine zweite Erfindung:
// englisch, Klartext, keine Gedankenstriche, höchstens drei kurze Zeilen, „silence" wenn nichts
// passiert ist. Wer hier etwas anderes schreibt, hat zwei Wahrheiten.
const CODE = {
  narrator: [
    'You are a cartoon animal riding along with the player through a comic. You comment on the card they are passing.',
    'Everything you write is spoken out loud by a text to speech engine, in English, immediately. Nobody reads it.',
    'Rules: English only. Plain text only, no markup, no asterisks, no brackets, no stage directions.',
    'No dashes of any kind; a period is your only timing tool. Short main clauses. Three lines maximum, usually one.',
    'Never mention the screen, the deck, the game or the ride mechanics. You are inside this.',
    'Every sentence names a mechanism, names a cost, or delivers an image. Otherwise it does not get said.',
    'Do not sound like an assistant. No "here is", no "let me", no enthusiasm. Do not explain the card, comment on it.',
    'If nothing happened, answer with one word: silence.',
  ].join('\n'),
  tutor: [
    'You explain what is running on the card sheet in front of the player: a small three.js demo or a KFB card.',
    'Everything you write is spoken out loud by a text to speech engine, in English. Plain text only, no markup, no dashes.',
    'Explain what is happening on THIS sheet, not the topic in general. Two short sentences maximum.',
    'Name the mechanism, then what it costs or buys. No lists, no numbers, no headings.',
    'If the sheet gives you nothing to work with, answer with one word: silence.',
  ].join('\n'),
  qa: [
    'You are the measurement referee for a build session. The question is whether a claim is measured or asserted.',
    'Answer in plain text, spoken out loud, two short sentences maximum, no markup and no dashes.',
    'If a number and its source are given, name both. If they are missing, say that it is asserted and name what would have to be measured.',
    'Never guess a number. Never praise. If you have nothing, answer with one word: silence.',
  ].join('\n'),
};

export function createPromptRegistry(opts = {}) {
  const P = Object.assign({ base: RAW, minLen: 400, timeout: 6000 }, opts.params || {});
  const cache = new Map();                 // 'role/id' → { system, source }
  const list = PERSONAS.slice();
  const stat = { repo: 0, code: 0, fehler: 0, letzter: '', index: false };

  const looksLikePrompt = (t) => typeof t === 'string' && t.length >= P.minLen && !/^\s*<(!doctype|html)/i.test(t);

  async function fetchText(url) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const to = setTimeout(() => { if (ctl) ctl.abort(); }, P.timeout);
    try {
      const r = await fetch(url, ctl ? { signal: ctl.signal } : undefined);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.text();
    } finally { clearTimeout(to); }
  }

  return {
    name: 'narrator-prompts',
    personas() { return list.map((p) => ({ id: p.id, pet: p.pet, label: p.name ? p.name + ' (' + p.pet + ')' : pretty(p.id), isDefault: !!p.isDefault })); },
    defaultId() { return (list.find((p) => p.isDefault) || list[0]).id; },
    petOf(id) { const p = list.find((x) => x.id === id); return p ? p.pet : null; },

    // Optional und still: gibt es irgendwann `media/prompts/index.json`, gewinnt sie über die
    // eingebaute Liste. Scheitert sie, bleibt alles wie es ist — kein Fehler nach außen.
    async loadIndex() {
      try {
        const j = JSON.parse(await fetchText(P.base + 'index.json'));
        const arr = Array.isArray(j) ? j : (j.narrator || j.personas || []);
        if (arr.length) {
          list.length = 0;
          arr.forEach((e) => list.push({ id: e.id || e.file, pet: e.pet, name: e.name, isDefault: !!e.isDefault }));
          stat.index = true;
        }
      } catch (e) { stat.index = false; }
      return stat.index;
    },

    /** Prompt für Rolle + Persönlichkeit. Repo zuerst, Code als Netz. Nie ein Wurf. */
    async load(role, id) {
      const key = (role || 'narrator') + '/' + (id || '');
      if (cache.has(key)) return cache.get(key);
      let out = null;
      if (id && ROLE_DIR[role || 'narrator']) {
        try {
          const t = await fetchText(P.base + ROLE_DIR[role] + id + '.md');
          if (looksLikePrompt(t)) { out = { system: t, source: 'repo', id, role }; stat.repo++; }
          else throw new Error('kein Prompt (' + (t ? t.length : 0) + ' Zeichen)');
        } catch (e) { stat.fehler++; stat.letzter = String(e && e.message || e).slice(0, 90); }
      }
      if (!out) { out = { system: CODE[role] || CODE.narrator, source: 'code', id, role }; stat.code++; }
      cache.set(key, out);
      return out;
    },

    report() {
      return { ausRepo: stat.repo, ausCode: stat.code, fehler: stat.fehler, letzterFehler: stat.letzter, index: stat.index, blätter: cache.size };
    },
  };
}
