import sys; sys.path.insert(0,'/tmp/hex/work')
from bl import *
import os
fam={r['key']:r['family'] for r in M['hexTiles']['inventory']}
keys=[k for k,f in fam.items() if f in ('decoration/nature','decoration/props','buildings/neutral','buildings/blue','objects')]
# plus representative tiles
keys+=['hex|hex_grass_bottom','hex|hex_water','hex|hex_river_A','hex|hex_river_crossing_A','hex|hex_coast_A','hex|hex_coast_C','hex|hex_road_M','hex|hex_river_L_waterless','builder|hex_forest','builder|hex_forest_detail','builder|hex_rock_roadB_detail','builder|hex_sand_waterA','builder|hex_water','builder|hex_forest_transitionA','builder|square_forest']
os.makedirs('rend/th',exist_ok=True)
for k in keys:
    fn=f'rend/th/{k.replace("|","__")}.png'
    if os.path.exists(fn): continue
    reset((260,240)); r,n=place(k); camera(n,az=35,el=28,lens=50,margin=1.1); render(fn)
print(len(keys))
