import json, math, sys
sys.path.insert(0,'/tmp/hex/work')
W='/tmp/hex/work/'; O='/tmp/hex/out/'
HEAD='f4f3fdbb0925653c8c76d21313416fa49a6ffb3a'
def dump(n,o): json.dump(o,open(O+n,'w'),indent=1,ensure_ascii=False)
F=json.load(open(W+'families.json'))
bs=json.load(open(W+'building_structure.json'))
roles=[
 {'role':'ground cell / coast ring / roads','path':'authored asset','sources':['hex.base.grass_water','hex.coast','hex.roads'],'why':'Topology lives in these tiles (edge classes measured 15/15 in browser); no procedural ground exists.'},
 {'role':'height change','path':'authored asset, PREPARE','sources':['hex.base.sloped','hex.roads.sloped'],'why':'Only authored slope exists; needs a level field in the catalog first (see BLENDER_MEASUREMENTS slopes).'},
 {'role':'hills / mountains','path':'authored asset','sources':['hex.nature.hills_mountains'],'why':'Massing silhouette with no procedural equivalent; cheap (60–480 tris).'},
 {'role':'tree','path':'procedural family (P0B soft tree); authored forest clumps only as optional far filler','sources':['P0B_TREE','hex.nature.forest_mass'],'why':'Golden extraction: P0B tree is human-positive; KayKit pines are faceted cones. Cost check for bulk procedural trees is a browser question.'},
 {'role':'bush','path':'procedural family (T3 2–3 lobe bush)','sources':['T3_BUSH'],'why':'Hexagon pack has no bush.'},
 {'role':'rocks small / medium / large','path':'procedural family (P0B pebble · K1 boulder · T3 accent rock)','sources':['P0B_PEBBLE','K1_BOULDER','T3_ACCENT_ROCK'],'why':'KayKit rocks are faceted 18–71 tri shards; the rounded rock family is source-proven in P1.'},
 {'role':'logs / stumps','path':'authored hero + procedural background siblings','sources':['hex|resource_lumber','hex.nature.stumps','SOFT_LOG_SEPARATOR','SOFT_LOG_STACK3','SOFT_STUMP_ROUND','SOFT_STUMP_DETAILED'],'why':'resource_lumber and cut-forest fields tell the lumbermill story; P2 soft logs/stumps are the scattered siblings.'},
 {'role':'mushrooms','path':'procedural family','sources':['SOFT_MUSHROOM_NORMAL','SOFT_MUSHROOM_GROUP3'],'why':'Not in the Hexagon pack.'},
 {'role':'grass tufts','path':'procedural family','sources':['SOFT_GRASS_TUFT'],'why':'Not in the Hexagon pack; 3–5 blade cluster rule already built in.'},
 {'role':'shore plants','path':'authored asset, optional','sources':['hex.nature.water_plants'],'why':'Cheap, no procedural equivalent.'},
 {'role':'resident props (barrels, crates, sacks, lumber, tent)','path':'authored asset','sources':['hex.props.resident'],'why':'Readable small props, one shared material.'},
 {'role':'buildings','path':'authored asset now; selected seeds feed the later procedural building family','sources':['hex.buildings.normal','hex.buildings.landmark'],'why':'B0 procedural buildings are not implemented; authored buildings stay the placeable truth.'},
 {'role':'clouds','path':'optional / deferred','sources':['hex.nature.clouds'],'why':'Sky dressing, no ground role.'}]
def seedinfo(k):
    b=bs[k]; return {'meshes':b['meshes'],'looseParts':b['looseParts'],'distinctVertexHeights':b['distinctVertexHeights'],'faceClass':b['faceClass'],'materials':b['materials']}
seeds=[
 {'key':'hex|building_home_A_blue','colourways':['blue','green','red','yellow'],'why':'Plainest normal house: one storey, gable roof, chimney, door, two side windows; 1,011 tris; 0.79 × 0.93 × 0.85.','structure':seedinfo('hex|building_home_A_blue'),
  'lineageFit':'Clean body-under-roof split gives the Elastic Grotesque body field and the roof-inherits-top-ring rule a clear target. But the body is kit-bashed from 281 loose parts with few vertical rings: per Cartoon-Verbieger it must use one object-normalised frame for all parts, and with < 4 meaningful Y rings it falls back to lean/taper unless walls are re-meshed. FACADE_RULE has nothing to read (windows are separate boxes, not wall regions).'},
 {'key':'hex|building_home_B_blue','colourways':['blue','green','red','yellow'],'why':'Two-storey timber-frame townhouse on a stone plinth with a dormer; 1,393 tris; 0.88 × 1.28 × 1.10. The height makes LOOK-TORSION (height-dependent) meaningful.','structure':seedinfo('hex|building_home_B_blue'),
  'lineageFit':'Plinth / body / roof are three readable bands, matching the anchored-base + torsion-over-height rule. Same kit-bash caveat (475 loose parts).'},
 {'key':'hex|building_tavern_blue','colourways':['blue','green','red','yellow'],'why':'Larger social building with stairs and a big barrel sign; 2,992 tris; 1.17 × 1.40 × 1.33. Seed for a "hero normal building" where a sub-part (the barrel sign) can carry stronger deformation than the body (LandmarkElastic principle).','structure':seedinfo('hex|building_tavern_blue'),
  'lineageFit':'Multi-volume massing; 973 loose parts. Good for the role-dependent magnitude rule, hardest to deform as one shell.'}]
seed_rejects=[{'key':'builder|house','why':'Same role as home_A in the flat-colour Builder style (5 materials, earth plinth); comparison only, mixing two styles.'},
 {'key':'hex|building_church_blue','why':'Landmark, not a normal building.'},{'key':'hex|building_well_blue','why':'Too small to carry building deformation; stays an authored social prop.'}]
dump('asset_classification.json',{'schema':'kfb.hex-blender-classification/0.1-candidate','handoffHead':HEAD,'classes':['USE','PREPARE','OPTIONAL','SKIP'],
 'summary':{c:sum(f['count'] for f in F if f['class']==c) for c in ['USE','PREPARE','OPTIONAL','SKIP']},
 'families':F,'environmentRoles':roles,'buildingSeeds':seeds,'buildingSeedRejects':seed_rejects,
 'note':'No numerical quality score. Classes are for a first island/village kit; OPTIONAL means kept, not loaded by default.'})
print({c:sum(f['count'] for f in F if f['class']==c) for c in ['USE','PREPARE','OPTIONAL','SKIP']})
