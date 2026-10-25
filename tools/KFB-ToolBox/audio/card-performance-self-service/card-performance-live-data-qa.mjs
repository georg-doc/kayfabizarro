import assert from 'node:assert/strict';
import { validateFeed, validateDeck, parsePerformanceText, normalizeBridges, createDraft, buildSegments } from './card-performance-core.mjs';

const repo = 'georg-doc/kayfabizarro';
const ref = 'planning/kfb-chatterbox-voice-layer-v1-2026-10-08';
const feedPath = 'skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_AUDIO_SITE_CARD_PERFORMANCE_FEED_R1_2026-10-12.json';
const apiUrl = path => `https://api.github.com/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`;
const decode = value => new TextDecoder().decode(Uint8Array.from(Buffer.from(String(value).replace(/\s/g, ''), 'base64')));
const get = async path => {
  const response = await fetch(apiUrl(path), { headers: { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' } });
  if (!response.ok) throw new Error(`${response.status} ${path}`);
  const payload = await response.json();
  return { path, sha: payload.sha, text: decode(payload.content), etag: response.headers.get('etag') };
};

const feedEntry = await get(feedPath);
const feed = validateFeed(JSON.parse(feedEntry.text));
const [deckEntry, performanceEntry, bridgesEntry, cuesEntry] = await Promise.all([
  get(feed.source.deckPath), get(feed.source.performancePath), get(feed.source.bridgesPath), get(feed.source.timedCuesPath)
]);
assert.equal(deckEntry.sha, feed.source.deckRevision);
assert.equal(performanceEntry.sha, feed.source.performanceRevision);
assert.equal(bridgesEntry.sha, feed.source.bridgesRevision);
assert.equal(cuesEntry.sha, feed.source.timedCuesRevision);
const deck = validateDeck(JSON.parse(deckEntry.text));
const script = parsePerformanceText(performanceEntry.text);
const bridges = normalizeBridges(JSON.parse(bridgesEntry.text), deckEntry.sha);
const cues = JSON.parse(cuesEntry.text);
assert.equal(Object.keys(cues.profiles).length, 3);
assert.ok(Object.values(cues.profiles).every(profile => profile.cuesMs.length === 50));
const draft = createDraft({ feed, performance: feed.performances[0], deck, script, bridges, contentSha: feedEntry.sha });
const segments = buildSegments(draft);
assert.equal(segments.filter(segment => segment.kind === 'card').length, feed.performances[0].selectedCardNumbers.length);
assert.equal(segments.at(-1).text, 'Stay Fluffy!');
assert.ok(feedEntry.etag);

console.log(JSON.stringify({
  status: 'PASS',
  checks: 12,
  feedSha: feedEntry.sha,
  contentRevision: feed.contentRevision,
  sourceCards: deck.cards.length,
  selectedCards: draft.selectedCardNumbers,
  spokenSegments: segments.length,
  typedEdges: bridges.length,
  renditionProfiles: Object.keys(cues.profiles).length,
  cuesPerRendition: Object.values(cues.profiles).map(profile => profile.cuesMs.length),
  etag: feedEntry.etag
}, null, 2));
