// BILLBOARD-CONTEXT-CONSUMER-01
// Non-owning adapter: current Travel v25 card/world context -> proven R11 context router.
// No second registry, palette engine, audio clock, card renderer or Billboard runtime.

const SOURCE = Object.freeze({
  travelSprintBlob: '776390f62e5e291948b6fb37a28789ee95b04133',
  worldContextBlob: '478e8cb4a53ea15e5c51833fa30554224e581815',
  zoneRingBlob: '881b33ca76a375d43e5c6630464904d4dbf935ba',
  deckRegistryBlob: 'af276a8b941a84a6b1856b9897dca196d1b7760a',
  forgetCardJsonBlob: '362fe54ddb0a945a5a8006a585ead75cf4bec37a',
  upstreamR11TestedHead: '3f55466dfc34157241774cabd9d56c67189a2469',
  upstreamR11ClosureHead: '57119fc46948bdfe21e56a67020e3e1f8fcf87d2'
});

const params = new URLSearchParams(location.search);
const input = {
  packId: params.get('packId') || 'forget_utopia',
  cardNumber: Number(params.get('card') || 7),
  storyMode: params.get('storyMode') || 'heroic',
  islandId: params.get('islandId') || null,
  residentId: params.get('residentId') || null
};

const report = {
  slice: 'BILLBOARD_CONTEXT_CONSUMER_01_2026-10-02',
  owner: 'Travel v25 WorldContext consumer -> Billboard Media Residency R11',
  source: SOURCE,
  input,
  ready: false,
  zone: null,
  deck: null,
  card: null,
  semanticVector: null,
  cardPalette: null,
  worldContext: null,
  r11Context: null,
  physicalBillboardTint: {
    status: 'NOT_IMPLEMENTED',
    reason: 'World/Look owner material seam not supplied to this isolated consumer proof.'
  },
  errors: []
};
window.__CONSUMER01_REPORT__ = report;

function asCard(raw, role) {
  return {
    cardNumber: raw.cardNumber,
    cardName: raw.cardName || raw.title || '',
    power: raw.power || '',
    lore: raw.lore || '',
    grade: raw.grade || 2,
    gradeReason: raw.gradeReason || '',
    artworkPrompt: raw.artworkPrompt || '',
    _role: role || null
  };
}

async function waitForR11(timeoutMs = 120000) {
  const started = performance.now();
  while (performance.now() - started < timeoutMs) {
    if (window.__r11 && typeof window.__r11.setContext === 'function') return window.__r11;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('R11 context router unavailable');
}

async function loadJson(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(url + ' -> HTTP ' + r.status);
  return r.json();
}

async function bindTravelContext() {
  try {
    const [r11, registry, WC] = await Promise.all([
      waitForR11(),
      loadJson('/media/kfb/index.json'),
      import('/travel/KFB%20Travel%20Combat%20v25/terrain-v25/world-context.js')
    ]);

    const deck = (registry.decks || []).find(d => d.packId === input.packId);
    if (!deck || !deck.data) throw new Error('deck not found in canonical registry: ' + input.packId);

    const deckData = await loadJson('/media/kfb/' + encodeURIComponent(deck.data));
    const rawCard = (deckData.cards || []).find(c => Number(c.cardNumber) === input.cardNumber);
    if (!rawCard) throw new Error('card not found: ' + input.packId + '#' + input.cardNumber);

    const card = asCard(rawCard, deck.role || deck.deckRole || null);
    const zoneKey = input.packId + '#' + input.cardNumber;
    const zoneSeed = WC.joinSeeds(String(input.packId), String(input.cardNumber), 'kfb-zone');
    const semanticVector = WC.cardSemanticVector(card, deck.role || deck.deckRole);
    const cardPalette = WC.paletteFromVector(semanticVector, zoneSeed);
    const worldContext = WC.makeWorldContext({
      cardTriplet: { current: card },
      storyMode: input.storyMode,
      seeds: [input.packId, String(input.cardNumber), 'billboard-context-consumer-01']
    });

    const r11Context = r11.setContext({
      packId: input.packId,
      selectedCard: input.cardNumber,
      islandId: input.islandId,
      residentId: input.residentId,
      paletteSource: 'CARDS',
      kfbShare: 0.65
    });

    report.zone = {
      key: zoneKey,
      seed: zoneSeed,
      identityOwner: 'travel/KFB Travel Combat v25/terrain-v25/zone-ring.js',
      formula: "packId + '#' + cardNumber; joinSeeds(packId, n, 'kfb-zone')"
    };
    report.deck = {
      packId: deck.packId,
      title: deck.title,
      role: deck.role || null,
      data: deck.data,
      pdf: deck.pdf
    };
    report.card = card;
    report.semanticVector = semanticVector;
    report.cardPalette = cardPalette;
    report.worldContext = {
      storyMode: worldContext.storyMode,
      storyModeName: worldContext.storyModeName,
      biome: worldContext.biome,
      accent: worldContext.accent,
      palette: worldContext.palette,
      params: worldContext.params,
      audio: worldContext.audio,
      vector: worldContext.vector,
      seed: worldContext.seed
    };
    report.r11Context = r11Context;
    report.ready = true;
    document.documentElement.dataset.consumer01Ready = '1';
    return report;
  } catch (e) {
    report.errors.push(String(e && e.stack || e));
    document.documentElement.dataset.consumer01Ready = '0';
    throw e;
  }
}

window.__consumer01 = {
  report,
  input,
  source: SOURCE,
  bind: bindTravelContext,
  snapshot() { return structuredClone(report); }
};

bindTravelContext().catch(e => console.error('[consumer01]', e));
