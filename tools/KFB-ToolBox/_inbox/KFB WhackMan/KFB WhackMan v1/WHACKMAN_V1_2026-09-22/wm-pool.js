/* KFB WhackMan v1 · Ladepool
   Vier gleichzeitig. Die Zahl ist nicht gewählt, sondern übernommen: der Dungeon-Owner hat sie
   in S13.2 gemessen — alles sequenziell blockiert minutenlang, alles gleichzeitig sättigt den
   Hauptthread (GLTF-Parse und Texturdekodierung laufen dort) und die Seite bleibt weiss. */
export async function pool(items, fn, width = 4, onTick = null) {
  let next = 0, done = 0;
  const out = new Array(items.length);
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      try { out[i] = { ok: true, value: await fn(items[i], i) }; }
      catch (e) { out[i] = { ok: false, error: e.message || String(e) }; }
      onTick && onTick(++done, items.length, items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(width, items.length) }, worker));
  return out;
}
