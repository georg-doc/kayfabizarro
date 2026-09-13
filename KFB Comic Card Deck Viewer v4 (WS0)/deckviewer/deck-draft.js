// deck-draft.js — Entwuerfe fuer die Deck-Texte, im FrizzleBob-Ton.
//
// Der Vorschlag geht NIE ungesehen in die Datei: er landet als Entwurf im Formular, Georg liest,
// nimmt an oder verwirft. Sonst wandert erfundener Text ins Repo und von dort zu Gumroad.
//
// Anti-Clone ohne Ledger: der Korpus kennt seine eigenen Texte. Wir zeigen dem Modell die
// Anfaenge dreier fremder Decks und verbieten deren Haken — das ersetzt die Liste, die im
// Scheduler von Hand gepflegt werden musste.

(function () {
  'use strict';

  // Aus Georgs Marketing-Prompt destilliert. Was hier steht, ist die eigentliche Arbeit —
  // die Warteschlange drumherum war nur Buchhaltung.
  var LAYER_ZERO = [
    'No em-dashes anywhere in the body. The only allowed em-dash is the one in the sign-off attribution.',
    'No emojis. No headers with decorative symbols.',
    'Native English. No German.',
    'Never read as AI-generated marketing. Never mention AI as a feature.',
    'Every line pays rent. Cut anything that is scaffolding rather than content.',
    'Card and character names verbatim, including the edgy ones. No cutesy truncations.',
    'Cards are evidence, never powers: no hit points, no stat values, no scores in the copy.'
  ];

  var HOOKS = [
    'a cold-open vignette that drops the reader mid-scene',
    'a flat factual claim that turns out to be uncomfortable',
    'a direct question the reader cannot answer cleanly',
    'a historical anchor that reframes the present',
    'a refusal list: what this deck will not do for you'
  ];

  var MOVES = [
    'debunk (you were told the tidy version)',
    'vignette (one concrete scene, no abstraction)',
    'historical anchor (this is older than you think)',
    'mechanism cold-open (here is how the machine actually turns)',
    'refusal-list (the things nobody will say out loud)',
    'direct provocation (address the reader and do not let go)'
  ];

  var KFB_SHAPE = [
    'Voice: Uncle FrizzleBob. Sardonic, warm underneath, never cute.',
    'Open with the hook. Then one agitation paragraph that does the rhetorical work.',
    'Say what it is: Social Story Wrestling, used as the anchor phrase, never as a fixed sentence.',
    'A WHAT IS INSIDE block: the card count, the Freestyle rules (the complete Anti-Rulebook), two or three real card names with a one-line reason each, CC BY-NC-SA 4.0, print-and-play PDF.',
    'How it works at the table: read a card aloud, the room rules on it, every card can claim anything until someone calls the bluff.',
    'Close with a fresh theme-specific aphorism, then: Choose your reality. Become an Epistemic Outlaw.',
    'Sign off exactly: Stay fluffy. — Uncle FrizzleBob'
  ];

  var MED_SHAPE = [
    'Voice: Doc FrizzleBob. Clinical, dry, never flippant about patients.',
    'Open with a vivid clinical scenario, then reframe it.',
    'A YOU WILL GET block: card count, Freestyle rules, two or three real character names with one-line personas, CC BY-NC-SA 4.0, print PDF.',
    'How it works: Character, Visual, Stat Block, Lore, Quest, and the Mechanism Flash.',
    'An honest note on cognitive load: who this is for, and what it pairs with.',
    'Mandatory disclaimer: this is a teaching aid, not clinical guidance.',
    'Sign off exactly: Stay fluffy. — Doc FrizzleBob'
  ];

  var FIELD_BRIEF = {
    marketingText: 'the full Gumroad listing copy, roughly 350 to 550 words',
    blurb: 'a single buyer-facing paragraph, maximum 40 words, no FrizzleBob voice, plain and useful: who it is for and why',
    deckType: 'a subline of two to four words that names what kind of deck this is',
    deckTitle: 'the deck title',
    exhibitionRole: 'the exhibition role, one short phrase'
  };

  function pick(list, seed, n) {
    var out = [], used = {};
    for (var i = 0; out.length < n && i < list.length * 3; i++) {
      var k = Math.abs(Math.sin(seed + i * 7.13) * 10000 | 0) % list.length;
      if (used[k]) continue;
      used[k] = 1; out.push(list[k]);
    }
    return out;
  }

  // Fakten aus dem Deck-JSON. Keine Erfindung: was hier nicht steht, darf im Text nicht auftauchen.
  function facts(deck, idx) {
    var L = [];
    if (deck.title) L.push('Title: ' + deck.title);
    if (idx && idx.deckType) L.push('Deck type: ' + idx.deckType);
    if (idx && idx.marketingEdition) L.push('Edition: ' + idx.marketingEdition);
    if (idx && idx.exhibitionRole) L.push('Exhibition role: ' + idx.exhibitionRole);
    if (idx && idx.deckFunction && idx.deckFunction.length) L.push('Function tags: ' + idx.deckFunction.join(', '));
    if (deck.cardCount) L.push('Card count: ' + deck.cardCount);
    if (deck.pages) L.push('Story pages: ' + (deck.pages - 1) + ' plus cover, four cards per page');
    if (idx && idx.genre) L.push('Genre: ' + idx.genre);
    if (idx && idx.blurb) L.push('Existing blurb: ' + idx.blurb);
    if (idx && idx.verdict) L.push('QA verdict: ' + idx.verdict);
    if (idx && idx.notes) L.push('Notes: ' + idx.notes);
    if (idx && idx.topCards && idx.topCards.length) L.push('Strongest cards: ' + idx.topCards.join(' | '));
    if (idx && idx.cards && idx.cards.length) {
      var names = idx.cards.map(function (c) { return c.name || c.cardName; }).filter(Boolean);
      L.push('All card names (' + names.length + ', verbatim): ' + names.join(' | '));
    }
    return L.join('\n');
  }

  function build(o) {
    var med = (o.idx && o.idx.marketingEdition === 'MED')
      || /^medkayfab/.test(o.deck.packId || '');
    var shape = med ? MED_SHAPE : KFB_SHAPE;
    var seed = (o.deck.packId || '').length * 31 + (o.deck.cardCount || 0);
    var brief = FIELD_BRIEF[o.field] || 'the field text';

    var sys = [
      'You write product copy for KayfaBizarro, a print-and-play comic card game by Georg von Westphalen.',
      'Players print a comic, cut it into cards, and build a story out loud. One to six people. Nobody wins.',
      '',
      'HARD RULES (Layer Zero):',
      LAYER_ZERO.map(function (r) { return '- ' + r; }).join('\n'),
      '',
      'SHAPE for this edition:',
      shape.map(function (r) { return '- ' + r; }).join('\n'),
      '',
      'Always include: Pay What You Want, and the CC BY-NC-SA 4.0 licence.',
      '',
      'Output the text only. No preamble, no explanation, no markdown code fences, no title line saying what you did.'
    ].join('\n');

    var parts = [];
    parts.push('DECK FACTS (the only source of truth; invent nothing beyond this):\n' + facts(o.deck, o.idx));

    if (o.samples && o.samples.length) {
      parts.push('\nOTHER DECKS IN THIS SHOP ALREADY OPEN LIKE THIS. Do not reuse these hooks or their rhetorical move:\n'
        + o.samples.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n'));
    }

    if (o.mode === 'new') {
      var hook = pick(HOOKS, seed, 1)[0];
      var move = pick(MOVES, seed + 3, 1)[0];
      parts.push('\nTASK: write ' + brief + ' for this deck.');
      parts.push('Use this hook archetype: ' + hook);
      parts.push('Use this rhetorical move for the agitation paragraph: ' + move);
    } else {
      parts.push('\nCURRENT TEXT:\n' + (o.current || '(empty)'));
      parts.push('\nTASK: rewrite ' + brief + '. Keep what works, fix what does not. Same deck, same facts.');
    }

    if (o.instruction) parts.push('\nGEORG SAYS: ' + o.instruction);

    return { system: sys, prompt: parts.join('\n') };
  }

  // Drei fremde Haken aus dem geladenen Korpus — das ist der Anti-Clone-Blick, ohne Ledger.
  function samplesFrom(cardIdx, skipPack, n) {
    var out = [];
    Object.keys(cardIdx || {}).forEach(function (k) {
      if (k === skipPack || out.length >= (n || 3)) return;
      var t = cardIdx[k] && cardIdx[k].marketingText;
      if (!t) return;
      var blocks = t.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
      var hook = blocks[1] || blocks[0];
      if (hook) out.push(hook.slice(0, 200));
    });
    return out;
  }

  function run(o) {
    if (!window.claude || !window.claude.complete) {
      return Promise.reject(new Error('no model available in this view'));
    }
    var b = build(o);
    var body = {
      system: b.system,
      max_tokens: o.field === 'marketingText' ? 4000 : 1000,
      messages: [{ role: 'user', content: b.prompt }]
    };
    return window.claude.complete(Object.assign({ model: 'claude-sonnet-4-5' }, body))
      .catch(function () { return window.claude.complete(body); })
      .then(function (t) {
        // Der Em-Dash ist die haeufigste Verfehlung gegen Layer Zero — hier faellt er.
        return String(t || '').trim()
          .replace(/```[a-z]*\n?/g, '')
          .replace(/([^\n])\s+\u2014\s+(?!Uncle FrizzleBob|Doc FrizzleBob)/g, '$1, ')
          .trim();
      });
  }

  window.KFBDeckDraft = { run: run, build: build, samplesFrom: samplesFrom, HOOKS: HOOKS, MOVES: MOVES };
})();
