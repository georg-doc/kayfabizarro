// Building catalogue K2 (SCALE_CONTRACT_K2 §3/§6, SCALE_AUDIT_R1 table): every set that people walk past gets the
// factor of the door rule (door ≥ 1.15 H). Door heights were read against H lines (± 0.1 H) at the old factor k1;
// at k2 the door is doorK1 × k2 / k1. Scenery buildings are never entered (§6), only sized so the door reads right.
export interface K2Entry { k1: number; k2: number; doorK1: number | null; note?: string }

/** k2 from the rule, rounded UP to 0.1 (the audit's rounded factors left four doors at 1.11–1.14 H) */
const k2Of = (k1: number, door: number) => Math.ceil(((k1 * 1.15) / door) * 10 - 1e-9) / 10;
const E = (k1: number, doorK1: number): K2Entry => ({ k1, k2: k2Of(k1, doorK1), doorK1 });

export const CATALOG_K2: Record<string, K2Entry> = {
  'hex/green/building_windmill_green.gltf': E(6, 0.4),
  'hex/yellow/building_watermill_yellow.gltf': E(4.2, 0.35),
  'hex/blue/building_tavern_blue.gltf': E(4.2, 0.4),
  'hex/red/building_market_red.gltf': E(4.5, 0.35),
  'hex/yellow/building_church_yellow.gltf': E(4.2, 0.35),
  'hex/red/building_castle_red.gltf': E(3.6, 0.3),
  'hex/blue/building_tower_A_blue.gltf': E(4.5, 0.3),
  'hex/green/building_lumbermill_green.gltf': E(4.5, 0.35),
  'hex/yellow/building_mine_yellow.gltf': E(4.5, 0.75),
  'city/building_A.gltf': E(4, 0.85),
  'city/building_C.gltf': E(4, 0.6),
  'city/building_E.gltf': E(4.5, 0.65),
  'snow/castle_snow.gltf.glb': E(3.6, 0.5),
  'snow/watchtower_snow.gltf.glb': E(4.5, 0.5),
  'snow/house_snow.gltf.glb': E(4.5, 0.55),
  'snow/mill_snow.gltf.glb': E(4.5, 0.45),
  // no door: well, stage, fountain, water tower keep their size (audit: passt / no door)
};

/** door height in H at a given scale (null = no door) */
export function doorH(asset: string, scale: number): number | null {
  const e = CATALOG_K2[asset];
  return e && e.doorK1 != null ? +((e.doorK1 * scale) / e.k1).toFixed(2) : null;
}

/** every catalogue door at its K2 factor: the hard rule "Tür ≥ 1,15 H" */
export function k2DoorCheck() {
  const rows = Object.entries(CATALOG_K2).map(([asset, e]) => ({ asset, k2: e.k2, door: doorH(asset, e.k2) }));
  return { rows, min: Math.min(...rows.filter((r) => r.door != null).map((r) => r.door!)), pass: rows.every((r) => r.door == null || r.door >= 1.15 - 1e-9) };
}
