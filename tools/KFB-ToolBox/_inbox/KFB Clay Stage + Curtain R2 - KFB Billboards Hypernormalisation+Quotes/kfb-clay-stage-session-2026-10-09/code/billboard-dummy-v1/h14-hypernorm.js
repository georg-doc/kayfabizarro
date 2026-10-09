// KFB Billboard · H14 HYPERNORMALISATION-Quelle für den Proof (01.10.2026)
// Liest integration-set.json und lädt nur Slots mit use = true als gebackene PNG.
// Nicht freigegebene Slots werden im Proof übersprungen. Der Rückfall auf den H5/H4-Pool gehört zum Billboard-Scheduler (WSA).
export async function loadH14Set(url = 'export/kfb-h14-static-bake-2026-09-30/integration-set.json') {
  const setUrl = new URL(url, location.href);
  const set = await (await fetch(setUrl, { cache: 'no-store' })).json();
  const items = [];
  for (const s of set.slots) {
    if (!s.use) continue;
    const img = new Image();
    img.src = new URL(s.file, setUrl).href;
    await img.decode();
    items.push({ ...s, img });
  }
  return { set, items, skipped: set.slots.filter((s) => !s.use).map((s) => s.index) };
}
