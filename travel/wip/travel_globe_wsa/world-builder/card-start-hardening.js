// WB0 Ground-only card-start hardening.
// The accepted B0 Travel runtime stays frozen. This adapter closes one startup regression exposed by
// Ground: the registry catalog now contains ~130 decks, while the frozen host builds the full mixed
// pool serially before assigning one world deck. Geometry therefore appears as white cards for a
// long time. WB0 needs one deck, not the whole pool: catalog -> deterministic deck -> text cards now.
// The existing host remains the artwork/pump owner and may later arrive at the same deck itself.

function waitForRuntime(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      const g = window.__globe, wb0 = window.__wb0;
      if (g?.registry && g?.teppiche && g?.sky && wb0?.ground) return resolve({ g, wb0 });
      if (performance.now() - t0 > timeoutMs) return reject(new Error('Ground card-start hardening timed out'));
      setTimeout(tick, 40);
    };
    tick();
  });
}

async function main() {
  const { g, wb0 } = await waitForRuntime();
  const existing = () => Array.isArray(g.teppiche?.teppiche) ? g.teppiche.teppiche : [];
  const before = {
    count: existing().length,
    assigned: existing().filter((t) => !!t.karte).length,
    textured: existing().filter((t) => !!t.mat?.map).length,
    deckName: g.deckName,
  };
  let status = 'ALREADY_READY', pack = null, cards = 0, fallbackSteps = 0;

  if (!before.assigned) {
    status = 'LOADING_ONE_DECK';
    const manifest = await g.registry.loadRegistry();
    const packs = (manifest.decks || [])
      .filter((d) => d && d.packId && d.data)
      .map((d) => d.packId)
      .sort();
    if (!packs.length) throw new Error('Card registry catalog has no usable deck entries');

    const start = ((Number(g.seed) >>> 5) % packs.length + packs.length) % packs.length;
    for (let i = 0; i < Math.min(7, packs.length); i++) {
      const candidate = packs[(start + i) % packs.length];
      const list = await g.registry.loadDeck(candidate);
      if (!list.length) continue;
      pack = candidate; cards = list.length; fallbackSteps = i;
      g.teppiche.setDeck(list);
      g.teppiche.params.anzahl = Math.max(g.teppiche.params.anzahl, list.length);
      g.teppiche.neubau();
      g.sky.setAnker(g.teppiche.anker());
      wb0.supportSurfaces?.sync?.();
      status = 'TEXT_DECK_READY';
      break;
    }
    if (!pack) throw new Error('No usable deck found in bounded Ground startup fallback');
  }

  const after = {
    count: existing().length,
    assigned: existing().filter((t) => !!t.karte).length,
    textured: existing().filter((t) => !!t.mat?.map).length,
    artwork: existing().filter((t) => t.art === true).length,
    tor: g.teppiche?.tor?.() || null,
  };

  wb0.cardStartHardening = {
    name: 'wb0-card-start-hardening',
    source: 'additive Ground adapter; frozen B0 Travel owner unchanged',
    status, pack, cards, fallbackSteps, before, after,
    report() {
      const list = existing();
      return {
        status, pack, cards, fallbackSteps, before,
        now: {
          count: list.length,
          assigned: list.filter((t) => !!t.karte).length,
          textured: list.filter((t) => !!t.mat?.map).length,
          artwork: list.filter((t) => t.art === true).length,
          pendingArtwork: g.registry.pending,
          hostDeckName: g.deckName,
          tor: g.teppiche?.tor?.() || null,
        },
      };
    },
  };
  console.info('[wb0 card-start]', wb0.cardStartHardening.report());
}

main().catch((error) => {
  console.warn('[wb0 card-start]', error);
  if (window.__wb0) window.__wb0.cardStartHardening = { status: 'FAILED', error: String(error) };
});
