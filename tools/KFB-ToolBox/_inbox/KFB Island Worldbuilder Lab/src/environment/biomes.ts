// Environment Kit R1 · biome tables (spec §9, grammar §2): which kit species may fill which Rule-of-Three role.
// A group always draws all its members from ONE kit (spec §1: never two kits in one Rule-of-Three group).
import type { EnvKit, EnvRole } from './kits';

export type BiomeId = 'forest' | 'autumn' | 'snow' | 'desert' | 'beach' | 'beachQ' | 'park';
/** species id with weight */
export type W = [string, number];
export type RoleLists = Partial<Record<EnvRole, W[]>> & { slope?: W[]; shore?: W[] };

export interface Biome {
  id: BiomeId;
  name: string;
  /** kits in use, in group order (groups cycle through them; never mixed inside a group) */
  kits: EnvKit[];
  lists: Partial<Record<EnvKit, RoleLists>>;
  /** leaf palette slots the instances may pick (0 = leaf[0], 1 = leaf[1], 2 = leaf[2] / bloom colour) */
  leafVariants: number[];
  /** anchors prefer the pond shore (palms at the oasis) */
  shoreAnchors?: boolean;
}

const v = (base: string, n: number[], w = 1): W[] => n.map((k) => [`${base}_${k}`, w]);

/** Quaternius Ultimate Nature: main kit for forest, autumn, snow, desert (spec §1). */
const Q_ROCK_RIM: W[] = v('q:Rock', [1, 2, 3, 6, 7]);
const Q_ROCK_SMALL: W[] = v('q:Rock', [4, 5]);

export const BIOMES: Record<BiomeId, Biome> = {
  forest: {
    id: 'forest', name: 'Wald', kits: ['quaternius'], leafVariants: [0, 0, 1],
    lists: {
      quaternius: {
        anchor: v('q:CommonTree', [1, 3, 4]),
        smallTree: v('q:BirchTree', [1, 2, 3]),
        slope: v('q:PineTree', [1, 2, 3]),
        bush: [...v('q:Bush', [1, 2]), ['q:BushBerries_1', 0.6]],
        stone: [...v('q:Rock_Moss', [1, 2, 3]), ['q:TreeStump_Moss', 0.7]],
        flower: [['q:Flowers', 1]],
        rimRock: v('q:Rock_Moss', [4, 6, 7]),
      },
    },
  },
  autumn: {
    id: 'autumn', name: 'Herbst', kits: ['quaternius'], leafVariants: [0, 1, 0],
    lists: {
      quaternius: {
        anchor: v('q:CommonTree_Autumn', [1, 3, 4]),
        smallTree: v('q:BirchTree_Autumn', [1, 2, 3]),
        slope: v('q:PineTree_Autumn', [1, 2, 3]),
        bush: v('q:Bush', [1, 2]),
        stone: [...Q_ROCK_SMALL, ['q:TreeStump', 1]],
        flower: [['q:Flowers', 1]],
        rimRock: Q_ROCK_RIM,
      },
    },
  },
  snow: {
    id: 'snow', name: 'Schnee', kits: ['quaternius'], leafVariants: [0, 1],
    lists: {
      quaternius: {
        anchor: v('q:PineTree_Snow', [1, 2, 3]),
        smallTree: v('q:CommonTree_Snow', [1, 3]),
        slope: v('q:PineTree_Snow', [4, 5]),
        bush: v('q:Bush_Snow', [1, 2]),
        stone: [...v('q:Rock_Snow', [4, 5]), ['q:TreeStump_Snow', 1]],
        rimRock: v('q:Rock_Snow', [1, 2, 3, 6, 7]),
      },
    },
  },
  desert: {
    id: 'desert', name: 'Wüste', kits: ['quaternius'], leafVariants: [0, 1], shoreAnchors: true,
    lists: {
      quaternius: {
        anchor: v('q:PalmTree', [1, 2, 3, 4]),
        smallTree: v('q:Cactus', [1, 2, 3, 4, 5]),
        bush: v('q:Plant', [1, 2, 3]),
        stone: Q_ROCK_SMALL, // no flower: CactusFlower_1 costs 2.1 k triangles for a 0.2 H accent
        rimRock: Q_ROCK_RIM,
      },
    },
  },
  /** Strand (Bikini-Bucht): smooth kits after the E1 verdict; pink crowns (leaf slot 2) = kelp trees with blossoms */
  beach: {
    id: 'beach', name: 'Strand', kits: ['tinytreats', 'kaykit'], leafVariants: [0, 1, 2], shoreAnchors: true,
    lists: {
      tinytreats: {
        anchor: [['tt:tree_large', 1]],
        smallTree: [['tt:tree', 1]],
        bush: [['tt:bush_large', 1], ['tt:bush', 1]],
        flower: [['tt:flower_A', 1], ['tt:flower_B', 1]],
      },
      kaykit: {
        anchor: [['kk:Tree_1_A', 1], ['kk:Tree_1_B', 1]],
        smallTree: [['kk:Tree_2_A', 1], ['kk:Tree_3_A', 1]],
        bush: [['kk:Bush_2_A', 1], ['kk:Bush_3_A', 1], ['kk:Bush_4_A', 1]],
        stone: [['kk:Rock_3_C', 1], ['kk:Rock_2_E', 1]],
        rimRock: [['kk:Rock_3_A', 1]],
      },
    },
  },
  /** Quaternius beach variant (willows + palms), kept for comparison: ?biome=bucht:beachQ */
  beachQ: {
    id: 'beachQ', name: 'Strand (Quaternius)', kits: ['quaternius'], leafVariants: [0, 1, 2], shoreAnchors: true,
    lists: {
      quaternius: {
        anchor: [...v('q:Willow', [1, 2, 3]), ...v('q:PalmTree', [1, 3], 0.7)],
        smallTree: v('q:PalmTree', [2, 4]),
        bush: [...v('q:Plant', [1, 2]), ['q:Bush_1', 1]],
        stone: Q_ROCK_SMALL,
        flower: [['q:Flowers', 1]],
        rimRock: Q_ROCK_RIM,
      },
    },
  },
  /** KayKit Forest + Tiny Treats (smooth kits): city, park, beach islands if the kits do not mix (spec §1). */
  park: {
    id: 'park', name: 'Park', kits: ['tinytreats', 'kaykit'], leafVariants: [0, 1],
    lists: {
      tinytreats: {
        anchor: [['tt:tree_large', 1]],
        smallTree: [['tt:tree', 1]],
        bush: [['tt:bush_large', 1], ['tt:bush', 1]],
        flower: [['tt:flower_A', 1], ['tt:flower_B', 1]],
      },
      kaykit: {
        anchor: [['kk:Tree_1_A', 1], ['kk:Tree_1_B', 1]],
        smallTree: [['kk:Tree_2_A', 1], ['kk:Tree_3_A', 1]],
        slope: [['kk:Tree_4_B', 1]],
        bush: [['kk:Bush_2_A', 1], ['kk:Bush_3_A', 1], ['kk:Bush_4_A', 1]],
        stone: [['kk:Rock_3_C', 1], ['kk:Rock_2_E', 1]],
        rimRock: [['kk:Rock_3_A', 1]],
      },
    },
  },
};

/** Default biome per island after the E1 mixing verdict (kits per biome): Quaternius for forest, desert, autumn, snow;
 *  KayKit Forest + Tiny Treats for city, park and beach. Override with ?biome=otown:autumn,canyon:snow. */
export const ISLAND_BIOME: Record<string, BiomeId> = { pyramide: 'desert', canyon: 'forest', bucht: 'beach', otown: 'park' };
export const PALETTE_BIOME: Record<string, BiomeId> = { wueste: 'desert', canyon: 'forest', bucht: 'beach', otown: 'park' };

/** For the E1 mixing test (?envmix=1): every biome alternates its groups between Quaternius and KayKit. */
export function mixedBiome(b: Biome): Biome {
  if (b.kits.length > 1 || b.kits[0] !== 'quaternius') return b;
  return { ...b, kits: ['quaternius', 'kaykit'], lists: { ...b.lists, kaykit: BIOMES.park.lists.kaykit } };
}

/** All species a biome can use, with their role (for preloading). */
export function biomeSpecies(b: Biome): [string, EnvRole][] {
  const out = new Map<string, EnvRole>();
  for (const k of b.kits) {
    const L = b.lists[k];
    if (!L) continue;
    for (const [role, list] of Object.entries(L)) {
      const r = (role === 'slope' ? 'smallTree' : role === 'shore' ? 'anchor' : role) as EnvRole;
      for (const [id] of list ?? []) if (!out.has(id + '@' + r)) out.set(id + '@' + r, r);
    }
  }
  return [...out.entries()].map(([k, r]) => [k.split('@')[0], r]);
}
