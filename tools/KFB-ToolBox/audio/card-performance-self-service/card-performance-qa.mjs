import assert from 'node:assert/strict';
import {
  CARD_PERFORMANCE_SCHEMA,
  DRAFT_SCHEMA,
  validateDeck,
  parsePerformanceText,
  normalizeBridges,
  validateFeed,
  createDraft,
  buildSegments,
  csvForDraft,
  lyricsForDraft
} from './card-performance-core.mjs';

let passed = 0;
const check = (name, fn) => { fn(); passed += 1; };
const cards = Array.from({ length: 48 }, (_, index) => ({ cardNumber: index + 1, cardName: `Card ${index + 1}`, power: `Power ${index + 1}`, lore: `Lore ${index + 1}`, artworkPrompt: `Visual ${index + 1}` }));
const deck = { cards };
const scriptText = ['[Spoken Word]', 'Welcome, dear Fluffheads.', ...cards.map(card => `${card.cardName} uses ${card.power}; ${card.lore}.`), 'Stay Fluffy!', '[End]'].join('\n');
const source = {
  deckPath: 'deck.json', deckRevision: 'deck-sha', performancePath: 'performance.txt', performanceRevision: 'performance-sha', bridgesPath: 'bridges.json', bridgesRevision: 'bridges-sha', timedCuesPath: 'cues.json', timedCuesRevision: 'cues-sha'
};
const feed = {
  schema: CARD_PERFORMANCE_SCHEMA, status: 'EDITORIAL_CANDIDATE', sourceRepo: 'georg-doc/kayfabizarro', sourceRef: 'preview/ref', contentRevision: 'r1', source,
  performances: [{ id: 'first-three', status: 'EDITORIAL_CANDIDATE', selectedCardNumbers: [1, 2, 3], speaker: { id: 'lorekeeper', label: 'Lorekeeper' }, storyMode: 'comic', bed: 'D', seed: 'stable' }]
};
const bridges = normalizeBridges({ editorialEdges: [{ from: 1, to: 2, relation: 'consequence', bridgeText: 'Because of that,', humanApproval: false }] }, source.deckRevision);

check('valid deck', () => assert.equal(validateDeck(deck).cards.length, 48));
check('source Lore may be explicit silence', () => assert.equal(validateDeck({ cards: cards.map(card => card.cardNumber === 28 ? { ...card, lore: '' } : card) }).cards[27].lore, ''));
check('missing source Lore remains silence', () => assert.equal(validateDeck({ cards: cards.map(card => card.cardNumber === 28 ? { cardNumber: card.cardNumber, cardName: card.cardName, power: card.power } : card) }).cards[27].lore, undefined));
check('deck rejects 47', () => assert.throws(() => validateDeck({ cards: cards.slice(0, 47) }), /48 Cards/));
check('performance parses 50 cues', () => assert.equal(Object.keys(parsePerformanceText(scriptText).cardLines).length, 48));
check('outro is binding', () => assert.throws(() => parsePerformanceText(scriptText.replace('Stay Fluffy!', 'Bye')), /Stay Fluffy/));
check('feed validates', () => assert.equal(validateFeed(feed).contentRevision, 'r1'));
check('feed rejects missing provenance', () => assert.throws(() => validateFeed({ ...feed, sourceRepo: '' }), /sourceRepo/));
check('bridge normalized', () => assert.deepEqual([bridges[0].fromCardId, bridges[0].toCardId, bridges[0].editorialStatus], [1, 2, 'EDITORIAL_CANDIDATE']));
const script = parsePerformanceText(scriptText);
const draft = createDraft({ feed, performance: feed.performances[0], deck, script, bridges, contentSha: 'feed-sha' });
check('draft schema', () => assert.equal(draft.schema, DRAFT_SCHEMA));
check('source revision retained', () => assert.equal(draft.sourceRevision, 'deck-sha'));
check('three Cards selected', () => assert.deepEqual(draft.selectedCardNumbers, [1, 2, 3]));
check('known bridge retained', () => assert.equal(draft.bridgeDrafts['1>2'].relation, 'consequence'));
check('unknown bridge stays silent', () => assert.deepEqual([draft.bridgeDrafts['2>3'].relation, draft.bridgeDrafts['2>3'].text], ['NO_EDGE', '']));
const segments = buildSegments(draft);
check('one spoken segment per Card', () => assert.equal(segments.filter(segment => segment.kind === 'card').length, 3));
check('outro remains exact', () => assert.equal(segments.at(-1).text, 'Stay Fluffy!'));
check('CSV contains provenance', () => assert.match(csvForDraft(draft), /sourceRevision.*contentRevision/));
check('lyrics preserve format', () => assert.ok(lyricsForDraft(draft).startsWith('[Spoken Word]') && lyricsForDraft(draft).endsWith('[End]')));

console.log(JSON.stringify({ status: 'PASS', checks: passed, cards: cards.length, segments: segments.length, bridgeKinds: [...new Set(Object.values(draft.bridgeDrafts).map(edge => edge.relation))] }, null, 2));
