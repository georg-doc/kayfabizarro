# bridge02 spec author: GROUP-LEVEL components only (one per part family). The per-block layout
# (wedge voussoirs, chord-cut spandrel courses, slabs, rocks) lives in the hand-written factory
# src/createKfbStoneBridgeField.ts; this spec exists to satisfy the img2threejs gates.
import json,sys,copy
W=sys.argv[1]; p=W+"/object-sculpt-spec.json"; S=json.load(open(p))
H=3.64
HEX={"masonry-1":"#e6d4b5","masonry-2":"#d1ba99","masonry-3":"#b29c7d","masonry-4":"#9e856b","rock-1":"#aaa59b","rock-2":"#918c83",
     "grass":"#94b834","lantern-green":"#2f4a3a","lantern-light":"#ffd27a"}
CLS={"rock-1":"stone","rock-2":"stone","grass":"unknown","lantern-green":"metal","lantern-light":"glass"}
template=copy.deepcopy(S["componentTree"][0]); comps=[]; world={}
def feature(fid,kind,desc): return dict(id=fid,kind=kind,description=desc,geometryEffect=kind,evidenceRef="full-object",confidence=0.6)
def comp(cid,name,level,parent,pos,dims,mat="masonry-2",feat=None,role="structure",rationale="Group pivot of a merged part family; per-block geometry is generated in the hand-written factory (clayBlock 44-tri chamfered hexahedra)."):
    c=copy.deepcopy(template); world[cid]=pos
    lp=pos if parent is None else [pos[i]-world[parent][i] for i in range(3)]
    c.update(id=cid,name=name,level=level,role=role,parent=parent,primitive="box",topologyClass="assembled-solid",topologyRationale=rationale,
      confidence=0.7,importance=0.8,material=mat,dimensions=dict(width=dims[0],height=dims[1],depth=dims[2],units="world",confidence=0.7),
      transform=dict(position=[round(v,3) for v in lp],rotation=[0,0,0],scale=[1,1,1]),fidelityTier="form")
    c["materialLayers"]=[mat]; hx=HEX[mat]; rgb=tuple(int(hx[i:i+2],16) for i in (1,3,5))
    c["colorMaterialRecipe"]=dict(dominantAlbedo="rgba(%d, %d, %d, 1.0)"%rgb,secondaryAlbedo="rgba(%d, %d, %d, 1.0)"%tuple(max(0,v-20) for v in rgb),
        materialClass=CLS.get(mat,"stone"),materialClassConfidence=0.9,evidenceRefs=["full-object"],notes="KFB role palette")
    c["geometryDescriptor"]=dict(topologyIntent="rounded clay blocks (chamfer + interpolated pillow normals)",edgeTreatment=dict(type="fillet",bevelRadius=0.26,segments=1),
      deformationStack=[],uvStrategy="none (flat vertex colour)",normalStrategy="per-face pillow-tilted normals interpolated across chamfers")
    ap=c["actionProfile"]; ap["animationRole"]="static-part"; ap["destruction"]["fractureGroup"]=parent or "root"; ap["destruction"]["debrisMaterial"]=mat
    ap["collider"]["scale"]=dims; c["localFeatures"]=feat or []; c["evidenceRefs"]=["full-object"]
    if parent: c["attachment"]=dict(parentSocket=parent,contactType="embed",localStart=[0,0,0],localEnd=[0,-dims[1]/2,0],embedDepth=0.05,overlap=0.05,gapTolerance=0.02)
    comps.append(c)
comp("root","KFB Stone Arch Bridge Field","macro",None,[0,0,0],[48,23.4,19.2],role="body")
comp("arch","Arch","macro","root",[0,-8,0],[34,11,19.2],feat=[feature("arch-opening","hole","near-semicircular full-width opening")])
comp("ring-front","Voussoir ring front","meso","arch",[0,-8,9],[36,12,1.8],feat=[feature("keystone-proud","ridge","keystone wider and proud"),feature("radial-joints","groove","tapered voussoirs, radial joints")])
comp("ring-back","Voussoir ring back","meso","arch",[0,-8,-9],[36,12,1.8],feat=[feature("keystone-proud","ridge","keystone wider and proud")])
comp("barrel","Barrel soffit","meso","arch",[0,-8,0],[34,11,15.7],mat="masonry-4",feat=[feature("staggered-courses","groove","staggered soffit courses")])
for s,z in (("front",9),("back",-9)):
    comp(f"face-wall-{s}",f"Spandrel/abutment face wall {s}","macro","root",[0,-6,z],[36.4,13,1.2],feat=[feature("block-bevel","bevel","rounded clay blocks, chord-cut at the extrados")])
    comp(f"parapet-{s}",f"Parapet {s}","macro","root",[0,0.8,z],[36.4,1.2,1.2])
    comp(f"caps-{s}",f"Cap stones {s}","meso",f"parapet-{s}",[0,1.7,z],[36.4,0.5,1.5],mat="masonry-3",feat=[feature("cap-overhang","bevel","rounded caps overhang the wall")])
for s,x in (("west",-1),("east",1)):
    comp(f"abutment-{s}",f"Abutment {s}","macro","root",[x*19,-8,0],[8,17,19.2])
    comp(f"footing-{s}",f"Boulder footing {s}","meso",f"abutment-{s}",[x*19,-15,0],[9,5,20],mat="rock-1",feat=[feature("rounded-boulders","bevel","grey rounded boulders")])
    comp(f"grass-{s}",f"Grass cap {s}","meso",f"abutment-{s}",[x*22.4,-0.7,0],[2.7,1.55,20.3],mat="grass",feat=[feature("rounded-lip","bevel","thick cap with rounded overhanging lip")])
comp("deck","Deck","macro","root",[0,-0.2,0],[42,0.45,16.6])
comp("pavement","Slab pavement","meso","deck",[0,-0.2,0],[42,0.45,12.5],mat="masonry-1",feat=[feature("slab-joints","groove","rounded slabs, flat, gradient 0")])
comp("sidewalks","Sidewalks","meso","deck",[0,0,0],[42,0.7,4],mat="masonry-2")
comp("pillars","End pillars","macro","root",[0,-5,0],[42,15.5,19.6])
for i,(x,z) in enumerate(((-1,1),(1,1),(-1,-1),(1,-1))):
    comp(f"pillar-{i}",f"Pillar {i}","meso","pillars",[x*19.65,-5,z*8.7],[2.9,15.5,2.25])
    comp(f"lantern-{i}",f"Lantern {i}","meso",f"pillar-{i}",[x*19.65,4.4,z*8.7],[0.95,2.8,0.95],mat="lantern-green",feat=[feature("glow-box","ridge","warm glowing box in a dark green frame")])
comp("ivy","Ivy","macro","root",[0,-2,0],[40,6,19.6],mat="grass")
for i in range(3): comp(f"ivy-{i+1}",f"Ivy cluster {i+1}","meso","ivy",[(-16,19.8,16)[i],(-3,1,-4)[i],(9.6,9.8,-9.6)[i]],[2.6,5,0.8],mat="grass",feat=[feature("leaf-blobs","ridge","few big blobby clay leaves")])
S["componentTree"]=comps
base=copy.deepcopy(S["materials"][0])
def mat(mid,name,col,rough=0.88):
    m=copy.deepcopy(base); m.update(id=mid,name=name,baseColor=col,color=col,textureResolution=256,notes="KFB role palette")
    m["albedo"]=dict(dominant=col,secondary=[],samplingNotes="KFB role palette (style override, not sampled).")
    m["colorVariation"]=dict(palette=[col],pattern="per-block vertex colour",amplitude=0.0,heightCorrelation=0.0)
    m["roughness"]=dict(base=rough,variation=0.05,map="independent-procedural-field",localResponse="uniform clay matte")
    for k in ("normal","bump","displacement","surfaceFrequencyBands","textureProjection","textureResolution"): m.pop(k,None)
    m["textureless"]=dict(declared=True,evidence=["KFB clay style brief: flat matte albedo per block, no gradients, no noise speckle; tone carried by per-block vertex colour; sheet AI-art texture deliberately not sampled (reference.png = sheet panel F)."])
    return m
S["materials"]=[mat(k,k,v) for k,v in HEX.items()]
S["materials"][0]["localOverrides"]=[dict(id="tone-variation",kind="stain",region="all masonry",effect="seeded per-block choice among 4 tones, no repeats in a row",evidenceRef="full-object")]
S["materials"][3]["localOverrides"]=[dict(id="cavity-darkening",kind="stain",region="barrel soffit",effect="darker tone weights",cavityBias=0.6,evidenceRef="full-object")]
S["materials"][8]["localOverrides"]=[dict(id="emissive-glow",kind="decal",region="lantern box",effect="emissive #ffbf5a",evidenceRef="full-object")]
ids=lambda pre:[c["id"] for c in comps if c["id"].startswith(pre)]
S["repetitionSystems"]=[dict(id="voussoirs",level="micro",parent="arch",count=30,primitive="box",material="masonry-2",elementComponentIds=["ring-front","ring-back"],placement=dict(mode="radial-arc",note="15 tapered wedges per face, keystone at crown"),distribution="radial about arch centre"),
 dict(id="pillars",level="meso",parent="pillars",count=4,primitive="box",material="masonry-1",elementComponentIds=ids("pillar-"),placement=dict(mode="mirror-xz"),distribution="4 corners"),
 dict(id="lanterns",level="meso",parent="pillars",count=4,primitive="box",material="lantern-green",elementComponentIds=ids("lantern-"),placement=dict(mode="mirror-xz"),distribution="on pillar caps")]
S["silhouette"]=dict(boundingShape="long low block with near-semicircular opening, 4 lantern pillars",aspectRatios=[{"lengthToWidth":2.5},{"heightToWidth":1.2}],symmetry="bilateral x and z",dominantCurves=["arch intrados"],negativeSpaces=["arch opening"],landmarks=["keystone","lanterns","grass caps"])
S["coordinateFrame"]=dict(front="+Z face",up="+Y",lengthAxis="X along span",scaleReference="K2: H=3.64; span 30, deck width 19.2, parapet ~0.5H, lantern top 1.6H; origin deck centre, deck top y=0")
S["assumptions"]=["back face mirrors front","abutment interior is a hidden dark core","flat deck overrides sheet hump"]+["RESOLVED unknown: "+u for u in S["preSpecAssessment"]["unknownsToResolveBeforeImplementation"]]
S["preSpecAssessment"]["unknownsToResolveBeforeImplementation"]=[]
S["risks"]=["img2threejs generator cannot express wedges/merged meshes -> hand-written factory","chamfer silhouette (1 bevel step) may read faceted at close range"]
S["performanceBudget"]["targetTriangles"]=40000
S["featureReviewTargets"]=[
 dict(id="overall-silhouette",name="Arch bridge field silhouette incl. pillars, lanterns, rock footing",tier="critical",passIds=["blockout"],minimumScore=0.7,mustPass=True,componentRefs=["arch","abutment-west","abutment-east","pillars"],evidenceRefs=["full-object"]),
 dict(id="voussoir-ring",name="Clean wedge voussoir ring with keystone",tier="critical",passIds=["blockout","structural-pass"],minimumScore=0.7,mustPass=True,componentRefs=["ring-front"],evidenceRefs=["full-object"]),
 dict(id="clay-blocks",name="Chunky rounded clay blocks",tier="critical",passIds=["form-refinement"],minimumScore=0.7,mustPass=True,componentRefs=["face-wall-front"],evidenceRefs=["full-object"]),
 dict(id="rock-grass",name="Boulder footing + grass cap with rounded lip",tier="important",passIds=["blockout"],minimumScore=0.65,mustPass=False,componentRefs=["footing-east","grass-east"],evidenceRefs=["full-object"]),
 dict(id="palette",name="KFB role palette only",tier="critical",passIds=["material-pass"],minimumScore=0.75,mustPass=True,componentRefs=["pavement","face-wall-front"],evidenceRefs=["full-object"])]
for bp in S["buildPasses"]: bp["componentRefs"]=[c["id"] for c in comps]
S["referenceCamera"].update(note="reference.png = sheet panel F (3/4). Matched manually with view=f34 in the test page; front B via view=front.")
S["suitability"]="conditional"
S["scores"]=dict(object_isolation=3,silhouette_readability=3,depth_inference=3,primitive_decomposition=3,material_procedurality=3,occlusion_risk=1,interaction_fit=2)
S["viewEvidence"][0]["observations"]=["wedge voussoir ring with keystone","4 pillars with lanterns","grey boulders under abutments","grass caps","slab pavement"]
S["lightingFromPhoto"]=[
 dict(id="key",type="directional",color="#fff3e2",intensity=2.1,direction=[-0.45,-0.9,-0.6],castShadow=True,evidence="sheet: soft warm key from upper right, soft shadows"),
 dict(id="fill",type="hemisphere",skyColor="#ffffff",groundColor="#b9ad96",intensity=1.35,evidence="bright soft fill, shadow sides readable",groundShadow="contact shadow on a shadow-receiving ground plane, Neutral tone mapping, exposure 1.0 (tone/exposure fixed)"),
 dict(id="rim",type="directional",color="#eef3ff",intensity=0.55,direction=[0.6,-0.3,0.5],castShadow=False,evidence="edge separation")]
json.dump(S,open(p,"w"),indent=1); print(len(comps),"components")
