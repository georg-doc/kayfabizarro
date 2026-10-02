import json, math, sys, copy
sys.path.insert(0,'/tmp/hex/work')
W='/tmp/hex/work/'; O='/tmp/hex/out/'
HEAD='f4f3fdbb0925653c8c76d21313416fa49a6ffb3a'
def dump(n,o): json.dump(o,open(O+n,'w'),indent=1,ensure_ascii=False)
s1=json.load(open(W+'s1_facts.json')); ramp=json.load(open(W+'ramp_edges.json')); var=json.load(open(W+'variants.json'))
inv={r['key']:r for r in json.load(open(O+'asset_inventory.json'))['rows']}
pg=json.load(open('/tmp/hex/proc/proc_geoms.json'))
D=['hex|hex_grass','hex|hex_road_B','hex|hex_coast_B','hex|hex_road_A_sloped_high','hex|building_windmill_blue']
donors=[]
for k in D:
    r=inv[k]; donors.append({'key':k,'path':r['path'],'blob':r['blob'],'agreement':r['agreement'],'blender':r['blender'],'topologyKinds':r['topologyKinds'],'topologyStatus':r['topologyStatus'],
      'deckLevels_threeY_topVertexCounts':s1[k]['levels_threeY_top'],**({'waterCentroidDeg':s1[k]['waterCentroidDeg_threeAtan2zx']} if 'waterCentroidDeg_threeAtan2zx' in s1[k] else {}),
      'visualEdgeCheck':'PASS (top render with edge labels 0..5 agrees with catalog kinds)' if 'building' not in k else 'n/a (not a tile)'})
SCALE={'P0B':0.55,'K1':0.40,'T3':0.08,'P2':0.50}
proc=[{'id':k,'module':'environment-family-p1.mjs' if not k.startswith('SOFT') else 'environment-family-p2.mjs','attrs':v['attrs'],'facts':v['facts'],
       'indexed':v['index'] is not None} for k,v in pg.items()]
dump('BLENDER_MEASUREMENTS.json',{'schema':'kfb.hex-blender-measurements/0.1-candidate','handoffHead':HEAD,
 'environment':{'blender':'5.0.1 (bpy, headless, EEVEE)','where':'Coworker cloud workspace, not the local Blender MCP app (see RETURN)','three':'0.160.0 under node for P1/P2 geometry'},
 'browserAgreement':{'S0LoadedRows':230,'matchTrisSizeMin':230,'mismatch':0,'tolerance':0.002,'newlyMeasuredByBlender':217},
 'grid':{'tileFlatToFlat':2.0,'tilePointToPoint':2.3094,'pointyTop':True,'hexagonDeckY':0.0,'builderDeckY':1.0,'note':'Builder hex tiles have body 0..1 and deck +1; Hexagon tiles have deck 0 and body hanging to -1. Mixing needs a -1 offset.'},
 'fiveDonors':donors,
 'slopes':{'method':'downward ray at r = 0.9 toward each edge midpoint and at the centre; unrotated tile','edgeOrder':'0 E, 1 SE, 2 SW, 3 W, 4 NW, 5 NE (hex-grid.js DIRS)','rows':ramp,
   'finding':'Every sloped tile rises from edge 3 (low) to edges 0/1/5 (high); edges 2 and 4 sit at mid height. The browser catalog stores these tiles as gggggg/sggsgg without any level, so a solver cannot place them correctly yet.'},
 'colourVariants':var['colourVariants'],
 'buildingStructure':json.load(open(W+'building_structure.json')),
 'proceduralControls':{'facts':proc,'p1ReportedFactsReproduced':'5/5 exact (vertices, triangles, bounds) vs ENVIRONMENT_FAMILY_P1_TEST_REPORT',
   'nativeUnits':'P0B/K1 ≈ WC1 metres; T3 objects use the historical T3 world (accent rock 9.46 wide); P2 uses KayKit Forest units',
   'k1BoulderNonIndexed':'K1_BOULDER is non-indexed (2,160 vertices = 3 × 720 triangles), so it renders faceted unless vertices are merged; kept as-is in the bench',
   'scaleHypothesesForHexNative':SCALE,'scaleBasis':'P0B tree height matched to KayKit tree_single height (1.20 / 2.18 = 0.55); K1, T3 and P2 factors chosen by eye to sit in the hex size bands (rock tiers below the tree, P2 stump below the KayKit cut stump). Not source-derived; see RETURN.'},
 'hexAtlas':{'image':'hexagons_medieval.png','blob':'14cdc253646e4dba3cb7a267a6f7399b78ba2231','copiesInPack':14,'note':'all 221 Hexagon files reference one image and one material name'}})
# ---------- material bench
mc=json.load(open(W+'material_counts.json'))
dump('MATERIAL_BENCH.json',{'schema':'kfb.hex-blender-material-bench/0.1-candidate','handoffHead':HEAD,
 'comparison':['neutral source material (control)','clay_floor_001 via Global Clay Lite semantics at WC1 cell scale (×8.66)','same at hex-native scale (×1)'],
 'donorMaps':{'diffuse':'d889ddd32d38ef9fac55ea802e47da73cbd77deb','roughness':'4d5b3e7634e532111c7608156f4a49b6b18d2ffb','normalUsed':False,'aoUsed':False,'reason':'Global Clay Lite only reads diffuse + roughness (global-clay-pack.v1.js)'},
 'semanticsSource':{'pack':'tools/KFB-ToolBox/worldbuilder/world-corridor-01/clay-perf/global-clay-pack.v1.js@94443824 (blob df35f5f3…)','shader':'clay-material.v10-partsdiag.js@94443824 uClayLite branch (blob 45bafa1f…)','uniforms':{'uClayLiteScale':0.62,'uClayLiteBump':0.42,'uClayLiteColor':0.22,'uClayLiteRough':0.55},'packSize':512},
 'blenderImplementation':{'packedTexture':'rebuilt in numpy from the pinned maps with the same formula (RG gradient, B roughness, A centred value); resize uses PIL bilinear instead of canvas high-quality smoothing',
   'triplanar':'object-space, weights |n|^4 normalised, same as shader',
   'colour':'base × clamp(1 + (A−0.5)·2·0.22, 0.72, 1.28) — source colour stays authoritative',
   'roughness':'clamp(mix(source, B, 0.55), 0.25, 1)',
   'relief':'APPROXIMATION: Blender Bump node on the A channel (which is linear in donor luminance) with distance set to give the same slope as the shader RG gradient × 0.42; not the shader code itself',
   'worldScale':'the shader multiplies object coordinates by object scale; here coordinates are multiplied by 8.66 (WC1 cell flat-to-flat 17.32 / KayKit 2.0) or 1.0'},
 'counts':mc,
 'findings':[
  'Hexagon pack: all 221 files use one material and one atlas image. With duplicate import materials merged, the whole pack plus Clay Lite is 1 material + 1 atlas + 1 packed 512² texture (2 single-channel PNGs in the Blender approximation).',
  'Procedural P1/P2 props have no material owner; in the bench one shared material with per-object colour covers all 12 families (2 materials total in the scene).',
  'Source identity survives: base colours come from the atlas / object colour; clay only modulates value ±22 % and roughness. Blue roofs, timber frames and road/sand/water boundaries stay readable in both scales (evidence/mat_*).',
  'At WC1 cell scale (×8.66) the clay pattern is fine and subtle at tile distance; at hex-native scale (×1) it reads clearly as clay on the large grass decks and becomes blotchy on small parts (chimney). Pattern density is therefore tied to the world scale decision.',
  'Builder pack would need 4–5 flat materials per object to each receive the same Clay Lite nodes (or a palette merge) — another reason it stays SKIP/OPTIONAL.',
  'No performance statement: Blender cannot measure the browser fragment cost.'],
 'evidence':['evidence/04_material_bench.jpg']})
# ---------- scenelets + sockets
sock={'schema':'kfb.hex-blender-sockets-support/0.1-candidate','handoffHead':HEAD,'frame':'three.js (y up), hex-native units, odd-r cells, edge order 0 E … 5 NE','scenelets':{},
 'tileSupportRules':[
  {'tiles':['hex|hex_grass_sloped_high','hex|hex_road_A_sloped_high'],'rule':'edge 3 low (y≈0.05–0.10), edges 0/1/5 high (y 1.0), edges 2/4 mid (y≈0.54). Needs level-1 neighbours on 0/1/5 or accepts an exposed cliff; side neighbours on 2/4 cannot be flat at either level.'},
  {'tiles':['hex|hex_grass_sloped_low','hex|hex_road_A_sloped_low'],'rule':'same axis, half height (high 0.5, mid ≈0.28, low 0.0–0.05).'},
  {'tiles':['builder|*'],'rule':'deck at +1: subtract 1 to sit next to Hexagon tiles.'},
  {'tiles':['hex|building_*'],'rule':'origin at footprint centre, base y 0, front faces +Z (three) / −Y (Blender); stands on a deck at y = 0 without snapping.'}]}
import recipes
def to3(v): return [round(v[0],3),round(-v[1],3)]
def rotKinds(k,n):
    out=[None]*6
    for i in range(6): out[(i+n)%6]=k[i]
    return ''.join(out)
def rotDeg(n): return ((6-(n%6))%6)*60
M=json.load(open('/tmp/hex/repo/tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/data/HEX_BROWSER_MEASUREMENTS.json'))
TOPO={t['key']:t['topology'] for t in M['hexTiles']['tiles']}
SRCW={'P0B_TREE':'P0B','P0B_PEBBLE':'P0B','K1_BOULDER':'K1','T3_ACCENT_ROCK':'T3','T3_BUSH':'T3'}
for i,rec in enumerate(recipes.ALL,1):
    raw=json.load(open(W+rec['id']+'_raw.json')); res=raw['_result']
    cells=[{'cell':c['cell'],'key':c['key'],'rotTurns':c['rotTurns'],'rotYDegThree':rotDeg(c['rotTurns']),'level':c.get('level',0),'kindsAfterRotation':rotKinds(TOPO[c['key']]['kinds'],c['rotTurns'])} for c in rec['cells']]
    props=[]
    for p,rp in zip(rec['props'],res['props']):
        q={'role':p['role'],'source':p['source'],'cell':p['cell'],'offset_three':to3(p['offset']),'yawDegThree':p.get('yawDeg',0),'tier':p['tier'],
           'required':p['required'],'density':'LOW' if p['required'] else p.get('density')}
        if p['source']=='authored': q['key']=p['key']
        else:
            q['procedural']=p['id']; q['sourceWorld']=SRCW.get(p['id'],'P2'); q['scale']=round(json.load(open(O+'BLENDER_MEASUREMENTS.json'))['proceduralControls']['scaleHypothesesForHexNative'][q['sourceWorld']]*p.get('scaleMul',1.0),4); q['paletteRole']=p['palette']
        q['support']=rp['support']; q['groundFootprint_three']=rp.get('groundFootprint_three'); props.append(q)
    dens={'LOW':[j for j,p in enumerate(props) if p['required']],'TARGET':[j for j,p in enumerate(props) if p['required'] or p['density']=='TARGET'],'MAX':list(range(len(props)))}
    raw_anchors=raw['anchors']
    anchors=[{'id':a['id'],'kind':a['kind'],'cell':a['cell'],'xyz_three':a.get('xyz_three'),'facingYawDegThree':a.get('facingDeg',0)} for a in raw_anchors]
    walk=res['walk']; free={pr:sum(1 for w in walk if not w['blockedAt'][pr] and not w['void']) for pr in ('LOW','TARGET','MAX')}
    out={'schema':'kfb.hex-scenelet-recipe/0.1-candidate','id':rec['id'],'title':rec['title'],'handoffHead':HEAD,'units':'hex-native (tile 2.0 flat-to-flat); WC1 cell would be ×8.66','frame':'three.js, y up; cell centres odd-r: x = col·2 + (row odd ? 1 : 0), z = row·1.732',
      'cells':cells,'props':props,'densityProfiles':{k:{'propIndices':v,'count':len(v)} for k,v in dens.items()},
      'residentAnchors':anchors,'walkRing':{'method':'24 samples per cell on a circle r = 0.72 around the cell centre, deck height by downward ray (tiles only); a sample is blocked when it lies within 0.08 of a prop ground footprint (prop vertices less than 0.25 above its base) of that density profile','samples':walk,'freePerProfile':free,'total':len(walk),'void':sum(w['void'] for w in walk)},
      'seams':res['seams'],'openEdges':res['openEdges'],
      'groupingRules':['one leader + smaller companions (Travel v25: companions 0.62 / 0.44)','T3 Rule of Three where a tree is present: tree anchor, two bushes support, one rock accent','grass as 3–5 blade tufts (P2 tuft already 3–5 blades)','mushrooms as family patch or stump detail','rock size tiers S/M/L'],
      'notBaked':'semantic recipe; rebuild from keys, cells, rotations and offsets. The .blend is only a preview of it.'}
    dump(f'SCENELET_RECIPE_{i}CELL.json',out)
    sock['scenelets'][rec['id']]={'openEdges':res['openEdges'],'seams':res['seams'],'propSupports':[{'prop':p.get('key') or p.get('procedural'),'cell':p['cell'],**p['support']} for p in props],'anchors':anchors}
    print(rec['id'],len(props),{k:len(v) for k,v in dens.items()},'walk free',free,'/',len(walk))
dump('SOCKETS_SUPPORT.json',sock)
