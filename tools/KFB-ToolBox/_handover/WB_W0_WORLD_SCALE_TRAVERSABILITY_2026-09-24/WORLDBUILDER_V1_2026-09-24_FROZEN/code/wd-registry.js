/* KFB WorldDesign Lab v1 · Registry-Zugang (GATE WD0)
   Pack- und Assetlisten kommen aus den Shards des Asset-Registry-Owners
   (`registry/assets/v1/packs/<slug>.json`, schema `kfb.asset-pack.v1`). Hier steht KEIN zweiter
   Katalog: nur die Familienauswahl aus Brief §7/§8, ein Lazy-Fetch und die Pfad/Revision-Auflösung.
   Jeder Eintrag bringt seine eigene gepinnte Revision mit (`source.commit`) — Belege, keine Annahme. */

export const REGISTRY = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/registry/assets/v1';

/* Brief §7 · die 18 indexierten 3D-KayKit-Paketfamilien, in der Reihenfolge des Briefings.
   Character Animations ist Animationsquelle, keine Requisitenfamilie — als solche markiert. */
export const KAYKIT = [
  ['kaykit-adventurers-2-0-free', 'Adventurers 2.0'],
  ['kaykit-blockbits-1-0-free', 'BlockBits'],
  ['kaykit-boardgamebits-1-0-free', 'BoardGameBits'],
  ['kaykit-city-builder-bits-1-0-free', 'City Builder Bits'],
  ['kaykit-dungeon-pack-1-1-free-2', 'Dungeon Pack 1.1'],
  ['kaykit-fantasyweaponsbits-1-0-free', 'Fantasy Weapons Bits'],
  ['kaykit-forest-nature-pack-1-0-free', 'Forest Nature Pack'],
  ['kaykit-furniture-bits-1-0-free', 'Furniture Bits'],
  ['kaykit-halloweenbits', 'Halloween Bits'],
  ['kaykit-legacy', 'Legacy'],
  ['kaykit-medieval-builder-pack-1-0', 'Medieval Builder Pack'],
  ['kaykit-medieval-hexagon-pack-1-0-free', 'Medieval Hexagon Pack'],
  ['kaykit-mixed-bag-1-free', 'Mixed Bag 1'],
  ['kaykit-restaurant-bits-1-0-free', 'Restaurant Bits'],
  ['kaykit-rpgtoolsbits-1-0-free', 'RPG Tools Bits'],
  ['kaykit-skeletons', 'Skeletons'],
  ['kaykit-space-base-bits-1-0-free', 'Space Base Bits'],
  ['kaykit-character-animations-1-1', 'Character Animations 1.1 · ANIMATIONSQUELLE']
];

/* Brief §8 · 3D Tiny Treats. Keine 2D-Tiny-Swords-Pakete — die gehören nicht ins Materiallabor. */
export const TREATS = [
  ['bubbly-bathroom-tiny-treats-1-1', 'Bubbly Bathroom 1.1'],
  ['tiny-treats-baked-goods-1-0-free', 'Baked Goods 1.0'],
  ['tiny-treats-bakery-interior-1-1-free', 'Bakery Interior 1.1'],
  ['tiny-treats-charming-kitchen-1-1-free', 'Charming Kitchen 1.1'],
  ['tiny-treats-homely-house-1-0-free', 'Homely House 1.0'],
  ['tiny-treats-house-plants-1-0-free-2', 'House Plants 1.0'],
  ['tiny-treats-pleasant-picnic-1-0-free', 'Pleasant Picnic 1.0'],
  ['tiny-treats-pretty-park-1-0-free', 'Pretty Park 1.0']
];

const shards = new Map();

export async function shard(slug) {
  if (!shards.has(slug)) {
    shards.set(slug, fetch(REGISTRY + '/packs/' + slug + '.json').then((r) => {
      if (!r.ok) throw new Error('REGISTRY ' + r.status + ' · packs/' + slug + '.json');
      return r.json();
    }).catch((e) => { shards.delete(slug); throw e; }));
  }
  return shards.get(slug);
}

/* Nur ladbare 3D-Modelle. Texturen, Quelldateien (.blend/.fbx) und Bilder bleiben aussen vor. */
export async function models(slug) {
  const s = await shard(slug);
  return (s.assets || [])
    .filter((a) => a.kind === 'model-3d' && /\.(glb|gltf)$/i.test(a.path))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

export async function packFacts(slug) {
  const s = await shard(slug);
  return { displayName: s.displayName, root: s.root, assetCount: s.assetCount, formats: s.formats, provenance: s.provenance };
}

/* Auswahl über Namensmuster, in der Reihenfolge der Muster. Gibt null zurück, wenn nichts passt —
   Brief §20: ein fehlender Spender bleibt eine benannte Lücke, kein Ersatzkörper. */
export async function pick(slug, ...patterns) {
  const list = await models(slug);
  for (const re of patterns) {
    const hit = list.find((a) => re.test(a.name));
    if (hit) return hit;
  }
  return null;
}

export const revOf = (a) => (a && a.source && a.source.commit) || 'main';
