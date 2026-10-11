// Island recipe kfb.island-config/1 (SPEC_WORLDBUILDER_GODMODE_VISION_R1 §6): the island as a recipe, not as a mesh.
// Archetype, size, seed, outline, palette as roles, terrain, edits, anchors, nodes (empty in the MVP), buildings,
// residents as cards and 0…n decks. Never player state (collection, wallet, reputation, access, encounters).
import type { IslandSpec } from './spec';
import { MACRO } from '../scale';

export const RECIPE_SCHEMA = 'kfb.island-config/1';
const FORBIDDEN = ['collection', 'wallet', 'reputation', 'access', 'encounters', 'player', 'save'];

export interface IslandRecipe {
  schema: typeof RECIPE_SCHEMA;
  worldId: string;
  name: string;
  archetype: string;
  size: string;
  sizeMC: number;
  seed: number;
  pos: [number, number, number];
  outline: [number, number][];
  palette: { roles: string; id: string };
  terrain: IslandSpec['terrain'];
  edits: unknown[];
  anchors: NonNullable<IslandSpec['anchors']>;
  nodes: unknown[];
  buildings: IslandSpec['buildings'];
  residents: NonNullable<IslandSpec['cast']>;
  decks: NonNullable<IslandSpec['decks']>;
  form: NonNullable<IslandSpec['form']> | null;
  layout?: NonNullable<IslandSpec['layout']> | null;
}

export function specToRecipe(s: IslandSpec): IslandRecipe {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const [x, z] of s.outline) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
  return JSON.parse(JSON.stringify({
    schema: RECIPE_SCHEMA, worldId: s.worldId ?? s.id, name: s.name, archetype: s.archetype ?? 'free', size: s.size ?? 'satellite',
    sizeMC: +(Math.max(x1 - x0, z1 - z0) / MACRO).toFixed(1), seed: s.seed, pos: s.pos, outline: s.outline,
    palette: { roles: 'ENV_ROLES.' + s.palette, id: s.palette }, terrain: s.terrain, edits: [], anchors: s.anchors ?? [], nodes: [],
    buildings: s.buildings, residents: s.cast ?? [], decks: s.decks ?? [], form: s.form ?? null, layout: s.layout ?? null,
  }));
}

/** recipe → island spec; throws on a wrong schema, more than one primary deck, or player state in the recipe */
export function recipeToSpec(r: IslandRecipe): IslandSpec {
  if (r.schema !== RECIPE_SCHEMA) throw new Error('recipe: schema ' + r.schema);
  if ((r.decks ?? []).filter((d) => d.role === 'primary').length > 1) throw new Error('recipe: more than one primary deck');
  const bad = Object.keys(r).filter((k) => FORBIDDEN.includes(k));
  if (bad.length) throw new Error('recipe: player state is not part of a recipe: ' + bad.join(', '));
  if ((r.nodes ?? []).length) throw new Error('recipe: nodes[] stays empty in the MVP');
  return JSON.parse(JSON.stringify({
    id: r.worldId, worldId: r.worldId, name: r.name, palette: r.palette.id, seed: r.seed, pos: r.pos, outline: r.outline,
    archetype: r.archetype, size: r.size, terrain: r.terrain,
    nature: { trees: 0, bushes: 0, rocks: 0, towers: 0, treeKind: 'ball' }, buildings: r.buildings, residents: [],
    decks: r.decks, cast: r.residents, anchors: r.anchors, ...(r.form ? { form: r.form } : {}), ...(r.layout ? { layout: r.layout } : {}),
  }));
}
