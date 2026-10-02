import json, re, collections
W='/tmp/hex/work/'; O='/tmp/hex/out/'
inv=json.load(open(O+'asset_inventory.json'))['rows']
keys=[r['key'] for r in inv]; byk={r['key']:r for r in inv}
def m(pat): return [k for k in keys if re.fullmatch(pat,k)]
def tri(ks): t=[byk[k]['blender']['tris'] for k in ks]; return [min(t),max(t)] if t else None
F=[]
def fam(id,pat,cls,reason,**kw):
    ks=m(pat); F.append({'family':id,'class':cls,'reason':reason,'count':len(ks),'trisRange':tri(ks),'members':ks,**kw})
# --- Hexagon pack: ground
fam('hex.base.grass_water',r'hex\|hex_(grass|water)','USE','The ground and sea cells the coast solver and every scenelet stand on: 36 / 20 tris, one atlas material, deck y = 0 (measured).')
fam('hex.base.sloped',r'hex\|hex_grass_sloped_(high|low)','PREPARE','Only height-changing ground cells, but the browser catalog records them as gggggg with no level: Blender measured low edge 3, high edges 0/1/5 (y 1.0 or 0.5) and mid edges 2/4 (0.535 / 0.275). A level/slope field must be added to the catalog before they can be placed by a solver.')
fam('hex.base.grass_bottom',r'hex\|hex_grass_bottom','OPTIONAL','Under-fill piece for stacked or raised cells (browser edge class ??????, no deck). Only needed once level-1 terrain is used.')
fam('hex.roads',r'hex\|hex_road_[A-M]','USE','Complete set: the 13 shapes are all non-empty edge subsets of a hexagon, 58–264 tris, edge classes 13/13 known and re-measured.')
fam('hex.roads.sloped',r'hex\|hex_road_A_sloped_(high|low)','PREPARE','Same height gap as the sloped grass. Also measured: the low end of _sloped_high sits at y 0.05 while flat road and coast sand sit at 0.00 / -0.05, so the seam to a flat cell has a 4–9 cm step in native units (×8.66 ≈ 35–80 cm at WC1 cell size).')
fam('hex.coast',r'hex\|hex_coast_[A-E]','USE','The island outline: hex-grid solveCoast uses exactly these five; water-centroid check in Blender reproduces the documented 88.7° for coast_B (edges 1,2).')
fam('hex.coast.waterless',r'hex\|hex_coast_[A-E]_waterless','SKIP','Three of five are off-grid in the browser run (excluded) and all need a separate water surface; the watered coast set already covers the role.')
fam('hex.rivers',r'hex\|hex_river_([A-L]|A_curvy|crossing_[AB])','OPTIONAL','Complete river vocabulary (no source tile), 82–384 tris; not needed for a first island ring, useful once inland water is wanted.')
fam('hex.rivers.waterless',r'hex\|hex_river_.*_waterless','SKIP','14 of these 15 are only partially classified in the browser run and hex_river_L_waterless has no deck surface (UNPROVEN/SKIP per brief); the watered versions carry the same role.')
# --- Hexagon pack: buildings
fam('hex.buildings.normal',r'hex\|building_(home_A|home_B|tavern|blacksmith|market|well)_(blue|green|red|yellow)','USE','Ordinary village buildings that fit inside one cell (0.65–1.80 wide). Each type has one geometry in four colourways (vertex-identical, only UVs move on the shared atlas), so one mesh per type plus a palette choice covers 24 files.')
fam('hex.buildings.landmark',r'hex\|building_(church|windmill|watermill|lumbermill|mine)_(blue|green|red|yellow)','USE','Landmark silhouettes for scenelet focus. Windmill, watermill and lumbermill ship moving parts as separate meshes (fan, wheel, saw), so they can animate without re-authoring.')
fam('hex.buildings.military',r'hex\|building_(castle|barracks|archeryrange|tower_A|tower_B|tower_base|tower_catapult)_(blue|green|red|yellow)','OPTIONAL','Strong silhouettes but a military role; the castle is 3.98 tall and 5,659 tris (largest file). Keep for a Burg/King island, not the default village kit.')
fam('hex.buildings.neutral.walls',r'hex\|(wall_.*|fence_.*)','OPTIONAL','Edge/separator pieces sized to the hex side (1.15 or 2.0 long); useful for plazas, but they need edge sockets that the catalog does not record yet.')
fam('hex.buildings.neutral.construction',r'hex\|building_(stage_[ABC]|scaffolding|destroyed|dirt|grain)','OPTIONAL','Construction and ground-overlay states (dirt, grain field); good for a build-up story, not core.')
fam('hex.buildings.neutral.bridges',r'hex\|building_bridge_[AB]','OPTIONAL','Only meaningful with rivers.')
fam('hex.projectile',r'hex\|projectile_catapult','SKIP','Gameplay projectile, no environment role.')
# --- Hexagon pack: nature/props
fam('hex.nature.hills_mountains',r'hex\|(hill_single_[ABC]|hills_[ABC]|mountain_[ABC](_grass)?)','USE','Terrain massing without a procedural equivalent (60–480 tris). They own the island silhouette hierarchy.')
fam('hex.nature.hills_mountains_trees',r'hex\|(hills_[ABC]_trees|mountain_[ABC]_grass_trees)','PREPARE','Same massing with faceted low-poly pines baked in; prefer the bare version plus procedural trees so the forest style stays one language.')
fam('hex.nature.forest_mass',r'hex\|trees_[AB]_(small|medium|large)','OPTIONAL','Whole-cell pine clumps (432–1,540 tris). Cheap far-background mass, but faceted pines contradict the soft P0B tree; keep only as distant filler if Web finds the procedural tree too costly in bulk.')
fam('hex.nature.single_trees',r'hex\|tree_single_[AB]','SKIP','Faceted cone pines (50 / 220 tris). The role is covered by the human-positive P0B soft tree; the Golden extraction rules out faceted low-poly as the target language.')
fam('hex.nature.stumps',r'hex\|(tree_single_[AB]_cut|trees_[AB]_cut)','OPTIONAL','Authored stumps; P2 SOFT_STUMP_ROUND/DETAILED cover the soft version. Keep the cut-forest fields (trees_*_cut) as a lumbermill story beat.')
fam('hex.nature.rocks',r'hex\|rock_single_[A-E]','SKIP','Faceted 18–71 tri rocks; P1 pebble / K1 boulder / T3 accent rock cover small/medium/large with rounded forms.')
fam('hex.nature.water_plants',r'hex\|(waterlily_[AB]|waterplant_[ABC])','OPTIONAL','Small shoreline detail with no procedural equivalent; cheap (66–338 tris).')
fam('hex.nature.clouds',r'hex\|cloud_(big|small)','OPTIONAL','Sky dressing; not a ground role.')
fam('hex.props.resident',r'hex\|(barrel|crate_.*|sack|pallet|resource_lumber|resource_stone|wheelbarrow|tent|bucket_.*)','USE','Small authored props that make resident anchors readable (42–522 tris, one atlas material). No procedural family exists for them.')
fam('hex.props.flags_military',r'hex\|(flag_.*|target|weaponrack|ladder)','OPTIONAL','Faction/military dressing.')
# --- Builder pack
fam('builder.tiles.hex',r'builder\|hex_.*','SKIP','A second ground language: flat-colour multi-material, earth sides, and the deck sits at y = +1 (Hexagon pack: 0), so every mix needs a -1 offset. 3 rows partial and 9 off-grid in the browser run.')
fam('builder.tiles.square',r'builder\|square_.*','SKIP','Square grid; outside the hex topology owner (all excluded off-grid in the browser run).')
fam('builder.objects.buildings',r'builder\|(house|market|mill|watermill|well|lumbermill|mine|farm_plot)','OPTIONAL','Same roles as Hexagon buildings in a different flat-colour style (4–5 materials each). Useful as a comparison seed, not to mix into one island.')
fam('builder.objects.military',r'builder\|(castle|barracks|archeryrange|watchtower|wall_.*|bridge.*)','SKIP','Duplicates Hexagon roles in the other style.')
fam('builder.objects.nature',r'builder\|(detail_.*|forest|mountain)','SKIP','Rounded flat-colour trees and rocks in a third look; procedural P0B/P1 already own rounded nature.')
covered=set(k for f in F for k in f['members'])
missing=[k for k in keys if k not in covered]
dup=[k for k,c in collections.Counter(k for f in F for k in f['members']).items() if c>1]
print('missing',missing); print('dup',dup)
json.dump(F,open(W+'families.json','w'),indent=1)
