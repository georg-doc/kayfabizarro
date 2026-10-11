import json,sys,math,random,copy
W=sys.argv[1]; p=W+"/object-sculpt-spec.json"
S=json.load(open(p))
rnd=random.Random(1701)
H=3.64
SPAN=8*H; HALF=SPAN/2          # 14.56
RISE=10.9; SPRING=2.0
R=(HALF**2+RISE**2)/(2*RISE)    # intrados radius
CY=SPRING+RISE-R                # arch centre y
TH=math.asin(HALF/R)            # half-angle from vertical
VD=3.4                          # voussoir radial depth
DECKW=5*H; ZF=DECKW/2           # 18.2, face at 9.1
ABL=6.0; ABTOP=13.0; ABZ=ZF+1.5
XEND=HALF+ABL                   # 23.56
ROAD0=15.4; CAMBER=2.2
def road(x): return ROAD0+CAMBER*math.cos(0.5*math.pi*x/XEND)  # top of road
def slope(x): return -CAMBER*math.sin(0.5*math.pi*x/XEND)*0.5*math.pi/XEND
PAR_T=1.5; COP_W=2.1; COP_H=0.75; PAR_TOTAL=0.5*H
HEX={"stone-1":"#e6d4b5","stone-2":"#d1ba99","stone-3":"#b29c7d","stone-4":"#9e856b","stone-core":"#9e856b","road-surface":"#545e7a"}
TONES=["stone-1","stone-2","stone-3","stone-4"]
def tone(): return rnd.choice(TONES)
template=copy.deepcopy(S["componentTree"][0])
comps=[]; world={}
def comp(cid,name,level,parent,pos,dims,rot=(0,0,0),mat=None,prim="box",subdiv=2,topo="assembled-solid",feat=None,role="structure",rationale=None):
    c=copy.deepcopy(template)
    world[cid]=pos
    lp=pos if parent is None else [pos[i]-world[parent][i] for i in range(3)]
    c.update(id=cid,name=name,level=level,role=role,parent=parent,primitive=prim,topologyClass=topo,
      topologyRationale=rationale or "Discrete masonry block with countable faces (decision-tree step 4); claymation roundness from Catmull-Clark subdivision of a unit box.",
      confidence=0.7,importance=0.8 if level!="micro" else 0.4,material=mat or tone(),
      dimensions=dict(width=round(dims[0],3),height=round(dims[1],3),depth=round(dims[2],3),units="world",confidence=0.7),
      transform=dict(position=[round(v,3) for v in lp],rotation=[round(v,4) for v in rot]),
      fidelityTier="form")
    c["materialLayers"]=[c["material"]]
    hexc=HEX.get(c["material"],"#9e856b"); rgb=tuple(int(hexc[i:i+2],16) for i in (1,3,5))
    c["colorMaterialRecipe"]=dict(dominantAlbedo="rgba(%d, %d, %d, 1.0)"%rgb,secondaryAlbedo="rgba(%d, %d, %d, 1.0)"%tuple(max(0,v-20) for v in rgb),
        materialClass="stone",materialClassConfidence=0.9,evidenceRefs=["full-object"],notes="KFB palette tone")
    c["geometryDescriptor"]=dict(topologyIntent="rounded clay block",edgeTreatment=dict(type="fillet",bevelRadius=0.2,segments=4),
      deformationStack=[],uvStrategy="generated procedural coordinates",normalStrategy="vertex normals from generated geometry")
    if subdiv: c["geometryDescriptor"]["subdivide"]={"iterations":subdiv}
    ap=c["actionProfile"]; ap["animationRole"]="static-part"; ap["destruction"]["fractureGroup"]=parent or "root"; ap["destruction"]["debrisMaterial"]=c["material"]
    ap["collider"]["scale"]=[round(d,3) for d in dims]
    c["localFeatures"]=feat or []
    if parent is not None:
        c["attachment"]=dict(parentSocket=parent,contactType="embed",localStart=[0,0,0],localEnd=[0,-dims[1]/2,0],embedDepth=0.05,overlap=0.05,gapTolerance=0.02)
    c["evidenceRefs"]=["full-object"]
    comps.append(c); return c
def feature(fid,kind,desc):
    return dict(id=fid,kind=kind,description=desc,geometryEffect=kind,evidenceRef="full-object",confidence=0.6)
# root pivot
comp("root","KFB Cartoon Stone Arch Bridge","macro",None,[0,0,0],[0.02,0.02,0.02],mat="stone-core",subdiv=0,role="body",
     rationale="Root pivot node only (near-zero carrier); all geometry lives in children.")
# --- abutments (macro) ---
for side,sx in (("west",-1),("east",1)):
    aid=f"abutment-{side}"; cx=sx*(HALF+ABL/2)
    comp(aid,f"Abutment {side}","macro","root",[cx,ABTOP/2-0.3,0],[ABL-1.0,ABTOP-1.2,ABZ*2-1.4],mat="stone-core",subdiv=2,
         feat=[feature("block-joints","groove","course joints between rounded abutment blocks")],rationale="Solid pier core (assembled-solid), hidden behind block courses; rounded by subdivision.")
    courses=3; ch=ABTOP/courses
    for k in range(courses):
        nx=2; nz=3; off=(k%2)*0.5
        for i in range(nx):
            for j in range(nz):
                bx=cx+(-ABL/2+(i+0.5)*ABL/nx)
                zw=2*ABZ/nz; bz=-ABZ+(j+0.5)*zw + (off-0.25)*0.0
                comp(f"{aid}-b{k}{i}{j}",f"{aid} block","micro",aid,[bx+rnd.uniform(-.15,.15),k*ch+ch/2,bz],
                     [ABL/nx+0.35+rnd.uniform(-.2,.2),ch+0.3,zw+0.35+rnd.uniform(-.2,.2)],rot=(0,rnd.uniform(-.03,.03),rnd.uniform(-.02,.02)))
# --- arch barrel ---
comp("arch-barrel","Arch barrel","macro","root",[0,CY,0],[0.02,0.02,0.02],mat="stone-core",subdiv=0,
     feat=[feature("arch-opening","hole","full-width segmental opening formed by voussoir rings")],rationale="Pivot for the voussoir rings; the barrel itself is the ring assembly.")
RINGS=4; RD=DECKW/RINGS
for r in range(RINGS):
    z=-ZF+(r+0.5)*RD
    face = r in (0,RINGS-1)
    rid={0:"arch-ring-back",RINGS-1:"arch-ring-front"}.get(r,f"arch-ring-inner{r}")
    comp(rid,rid.replace("-"," "),"meso","arch-barrel",[0,CY,z],[0.02,0.02,0.02],mat="stone-core",subdiv=0,
         feat=[feature("keystone-proud","ridge","keystone 1.3x deeper and proud of face"),feature("voussoir-joints","groove","radial joints converge on arch centre")] if face else [],
         rationale="Pivot of one voussoir course (radial array).")
    N=15 if face else 14
    for i in range(N):
        t=-TH+(i+0.5)*(2*TH/N)       # angle from vertical
        key = face and i==N//2
        d=VD*(1.3 if key else 1.0)
        rr=R+d/2
        x=rr*math.sin(t); y=CY+rr*math.cos(t)
        arc=2*TH/N*(R+d/2)
        dz=RD+(0.9 if key else 0.25)
        zz=z+(0.45 if (key and r==RINGS-1) else (-0.45 if key else 0))
        comp(f"{rid}-v{i:02d}",("keystone" if key else "voussoir"),"micro",rid,[x,y,zz],[arc*1.02,d,dz],rot=(0,0,-t),
             mat=("stone-1" if key else tone()),rationale="Wedge-like voussoir approximated as a rounded box rotated normal to the intrados (radial).")
# --- spandrels ---
EXT=R+VD
for side,sz in (("front",1),("back",-1)):
    sid=f"spandrel-{side}"
    comp(sid,f"Spandrel wall {side}","macro","root",[0,0,sz*(ZF-0.9)],[0.02,0.02,0.02],mat="stone-core",subdiv=0,
         feat=[feature("block-bevel","bevel","all spandrel blocks rounded (claymation)")],rationale="Pivot of the spandrel block courses.")
    bh=1.9; y=SPRING
    row=0
    while y<ROAD0+CAMBER:
        bw=2.9; off=(row%2)*bw/2
        x=-XEND-off
        while x<XEND+bw:
            cxb=x+bw/2; cyb=y+bh/2
            top=road(cxb)-1.3
            dist=math.hypot(cxb,cyb-CY)
            inside_ab = abs(cxb)>HALF+0.3 and cyb<ABTOP
            if abs(cxb)<XEND-0.3 and cyb+bh/2<top+0.9 and dist>EXT-0.5 and not inside_ab and cyb>SPRING:
                comp(f"{sid}-b{row:02d}-{len(comps)}","spandrel block","micro",sid,[cxb,cyb,sz*(ZF-0.9)],[bw+0.3,bh+0.25,1.9],
                     rot=(0,0,rnd.uniform(-.03,.03)))
            x+=bw
        y+=bh; row+=1
    # interior fill (hidden core above haunches) so no see-through from oblique views
# --- deck ---
comp("deck","Deck","macro","root",[0,ROAD0,0],[0.02,0.02,0.02],mat="stone-core",subdiv=0,
     feat=[feature("deck-slab-joints","groove","transverse slab joints"),feature("deck-edge-course","ridge","string course at deck edge")],rationale="Pivot of road slabs and edge course.")
NS=14; sl=2*XEND/NS
comp("deck-road","Road surface course","meso","deck",[0,ROAD0,0],[0.02,0.02,0.02],mat="road-surface",subdiv=0,rationale="Pivot of the road slab course.")
for sd in ("front","back"):
    comp(f"deck-edge-{sd}",f"Deck edge course {sd}","meso","deck",[0,ROAD0,(1 if sd=="front" else -1)*(ZF-1.0)],[0.02,0.02,0.02],mat="stone-core",subdiv=0,rationale="Pivot of the deck edge string course.")
for i in range(NS):
    x=-XEND+(i+0.5)*sl; a=math.atan(slope(x))
    comp(f"road-slab-{i:02d}","road slab","micro","deck-road",[x,road(x)-0.7,0],[sl+0.25,1.4,2*(ZF-PAR_T)+0.6],rot=(0,0,a),mat="road-surface",
         rationale="Thick rounded road slab (no thin plate), follows the camber.")
    # fill under road between spandrels (hidden, closes the top)
    endtrim = 1.4 if i in (0,NS-1) else 0.0
    xf = x + (endtrim/2 if i==0 else (-endtrim/2 if i==NS-1 else 0))
    comp(f"deck-fill-{i:02d}","deck fill","micro","deck",[xf,road(x)-2.9,0],[sl+0.2-endtrim,2.6,2*(ZF-2.2)],rot=(0,0,a),mat="stone-core",subdiv=0,
         rationale="Hidden infill under the road slabs (assembled-solid).")
for side,sz in (("front",1),("back",-1)):
    for i in range(NS):
        x=-XEND+(i+0.5)*sl; a=math.atan(slope(x))
        comp(f"edge-course-{side}-{i:02d}","deck edge stone","micro",f"deck-edge-{side}",[x,road(x)-0.75,sz*(ZF-1.0)],[sl+0.2,1.5,2.4],rot=(0,0,a))
# --- parapets ---
for side,sz in (("front",1),("back",-1)):
    pid=f"parapet-{side}"
    comp(pid,f"Parapet {side}","macro","root",[0,ROAD0,sz*(ZF-PAR_T/2)],[0.02,0.02,0.02],mat="stone-core",subdiv=0,
         feat=[feature("coping-rounded","bevel","rounded coping stones overhanging the wall"),feature("coping-joints","groove","joints between coping stones")],rationale="Pivot of parapet wall + coping courses.")
    wall_h=PAR_TOTAL-COP_H+0.4
    comp(f"{pid}-copings",f"{pid} coping course","meso",pid,[0,ROAD0+PAR_TOTAL,sz*(ZF-PAR_T/2)],[0.02,0.02,0.02],mat="stone-core",subdiv=0,rationale="Pivot of coping stones.")
    for i in range(NS):
        x=-XEND+(i+0.5)*sl; a=math.atan(slope(x))
        comp(f"{pid}-wall-{i:02d}","parapet wall block","micro",pid,[x,road(x)+wall_h/2-0.4,sz*(ZF-PAR_T/2)],[sl+0.25,wall_h,PAR_T],rot=(0,0,a))
        comp(f"{pid}-coping-{i:02d}","coping stone","micro",f"{pid}-copings",[x,road(x)+PAR_TOTAL-COP_H/2,sz*(ZF-PAR_T/2)],[sl+0.1,COP_H+0.25,COP_W],rot=(0,0,a))
S["componentTree"]=comps
# --- materials ---
base=copy.deepcopy(S["materials"][0])
def mat(mid,name,col,rough=0.9,notes=""):
    m=copy.deepcopy(base); m.update(id=mid,name=name,baseColor=col,color=col,textureResolution=256,notes=notes)
    m["albedo"]=dict(dominant=col,secondary=[],samplingNotes="KFB palette tone (style override, not reference-sampled).")
    m["colorVariation"]=dict(palette=[col],pattern="per-block tone assignment",amplitude=0.0,heightCorrelation=0.0)
    m["roughness"]=dict(base=rough,variation=0.05,map="independent-procedural-field",localResponse="uniform clay matte")
    for k in ("normal","bump","displacement","surfaceFrequencyBands","textureProjection","textureResolution"): m.pop(k,None)
    m["textureless"]=dict(declared=True,evidence=["reference view full-object (reference.jpg) measured via material-evidence/stone-reference_albedo.png: low value range, warnings 'low value range weakens height/roughness inference'; KFB claymation style brief mandates flat matte albedo per block, tone variation carried by per-block material assignment."])
    return m
S["materials"]=[mat("stone-1","Stone tone 1 (lightest)","#e6d4b5"),mat("stone-2","Stone tone 2","#d1ba99"),
  mat("stone-3","Stone tone 3","#b29c7d"),mat("stone-4","Stone tone 4 (darkest)","#9e856b"),
  mat("stone-core","Hidden core / mortar backing","#9e856b"),mat("road-surface","Road surface","#545e7a",0.95)]
S["materials"][0]["localOverrides"]=[dict(id="tone-variation",kind="stain",region="all blocks",effect="seeded per-block choice among 4 tones",evidenceRef="full-object")]
S["materials"][3]["localOverrides"]=[dict(id="cavity-darkening",kind="stain",region="vault intrados",effect="darker tone + AO under arch",cavityBias=0.8,evidenceRef="full-object")]
S["materials"][5]["localOverrides"]=[dict(id="road-tone",kind="decal",region="deck top",effect="road colour #545e7a",evidenceRef="full-object")]
# stone-warm alias ids used in detail inventory
for d in S["preSpecAssessment"]["detailInventory"]["details"]:
    ref=d["mapsTo"]["ref"]
    ref=ref.replace("stone-warm.tone-variation","stone-1.tone-variation").replace("stone-warm.cavity-darkening","stone-4.cavity-darkening")
    ref=ref.replace("spandrel-front.block-bevel","spandrel-front.block-bevel")
    ref=ref.replace(".","/",1) if "/" not in ref else ref
    d["mapsTo"]["ref"]=ref
S["repetitionSystems"]=[
 dict(id="voussoir-rings",level="micro",parent="arch-barrel",count=58,primitive="box",material="stone-2",elementComponentIds=[c["id"] for c in comps if "-v" in c["id"] and c["id"].startswith("arch-ring")],
      placement=dict(mode="radial-arc",note="authored individually: 15 per face ring (keystone at crown), 14 per inner ring staggered half a step"),distribution="radial about arch centre"),
 dict(id="spandrel-courses",level="micro",parent="spandrel-front",count=len([c for c in comps if c["id"].startswith("spandrel-") and "-b" in c["id"]]),primitive="box",material="stone-2",
      elementComponentIds=[c["id"] for c in comps if c["id"].startswith("spandrel-") and "-b" in c["id"]],placement=dict(mode="running-bond",note="half-block stagger per course, clipped by extrados and deck line"),distribution="running bond"),
 dict(id="parapet-copings",level="micro",parent="parapet-front",count=2*NS,primitive="box",material="stone-1",elementComponentIds=[c["id"] for c in comps if "-coping-" in c["id"]],placement=dict(mode="along-curve",note="follows deck camber"),distribution="linear along camber"),
 dict(id="road-slabs",level="micro",parent="deck",count=NS,primitive="box",material="road-surface",elementComponentIds=[c["id"] for c in comps if c["id"].startswith("road-slab")],placement=dict(mode="along-curve"),distribution="linear along camber"),
]
S["silhouette"]=dict(boundingShape="elongated cuboid with full-width arch opening",aspectRatios=[{"lengthToWidth":round(2*XEND/(2*ABZ),2)},{"heightToWidth":round((ROAD0+CAMBER+PAR_TOTAL)/(2*ABZ),2)}],
  symmetry="bilateral (longitudinal and transverse)",dominantCurves=["segmental arch intrados","cambered deck line"],negativeSpaces=["arch opening"],landmarks=["keystone","abutment ledges","parapet copings"])
S["coordinateFrame"]=dict(front="+Z face (arch face visible in reference)",up="+Y",lengthAxis="X along span",scaleReference=f"KayKit figure H={H} units; span 8H={SPAN:.2f}, deck width 5H={DECKW:.2f}, parapet 0.5H={PAR_TOTAL:.2f}")
S["assumptions"]=["far face mirrors near face","intrados is a continuous barrel","KFB proportions override reference proportions"]
S["risks"]=["generator ignores edgeTreatment.bevelRadius; roundness comes only from Catmull-Clark subdivision","no wedge primitive: voussoirs are rotated rounded boxes"]
S["performanceBudget"]["targetTriangles"]=60000
S["featureReviewTargets"]=[
 dict(id="overall-silhouette",name="Arch bridge silhouette: humped deck, full-width arch opening, boxy abutments",tier="critical",passIds=["blockout"],minimumScore=0.75,mustPass=True,componentRefs=["arch-barrel","deck","abutment-west","abutment-east"],evidenceRefs=["full-object"]),
 dict(id="radial-voussoir-arch",name="Radial voussoir ring with proud keystone",tier="critical",passIds=["structural-pass","form-refinement"],minimumScore=0.75,mustPass=True,componentRefs=["arch-ring-front"],evidenceRefs=["full-object"]),
 dict(id="claymation-rounded-blocks",name="Thick rounded clay blocks, no sharp faces",tier="critical",passIds=["form-refinement","material-pass"],minimumScore=0.75,mustPass=True,componentRefs=["spandrel-front","parapet-front"],evidenceRefs=["full-object"]),
 dict(id="parapet-coping",name="Parapets with rounded copings following camber",tier="important",passIds=["structural-pass","form-refinement"],minimumScore=0.7,mustPass=False,componentRefs=["parapet-front","parapet-back"],evidenceRefs=["full-object"]),
 dict(id="reference-material-system",name="KFB 4-tone stone palette + road #545e7a",tier="critical",passIds=["material-pass","surface-pass"],minimumScore=0.75,mustPass=True,componentRefs=["deck","spandrel-front"],evidenceRefs=["full-object"]),
]
for bp in S["buildPasses"]:
    bp["componentRefs"]=[c["id"] for c in comps]
S["referenceCamera"].update(note="Reference is a near-orthographic 3/4 view from upper front-left of the arch face; matched manually in the test page (no solve).")
S["suitability"]="conditional"
S["scores"]=dict(object_isolation=3,silhouette_readability=3,depth_inference=2,primitive_decomposition=3,material_procedurality=3,occlusion_risk=1,interaction_fit=2)
S["viewEvidence"][0]["observations"]=["single arch through full width","cambered deck","abutments wider than deck","stepped parapet coping"]
S["assumptions"]+= ["RESOLVED unknown: "+u for u in S["preSpecAssessment"]["unknownsToResolveBeforeImplementation"]]
S["preSpecAssessment"]["unknownsToResolveBeforeImplementation"]=[]
S["lightingFromPhoto"]=[
 dict(id="key",type="directional",color="#fff4e0",intensity=2.6,direction=[-0.5,-1.0,-0.6],castShadow=True,evidence="reference: lit top faces bright, shadow cast under arch to the right"),
 dict(id="fill",type="hemisphere",skyColor="#dfe8ff",groundColor="#8a7a5f",intensity=1.0,evidence="soft shadow side faces stay readable",groundShadow="contact shadow on a ground plane under the arch (shadow-receiving ground), ACES filmic tone mapping, exposure 1.0"),
 dict(id="rim",type="directional",color="#ffffff",intensity=0.6,direction=[0.6,-0.3,0.8],castShadow=False,evidence="edge separation on parapets")]
json.dump(S,open(p,"w"),indent=1)
print("components",len(comps),"R",round(R,2),"CY",round(CY,2),"TH deg",round(math.degrees(TH),1))
