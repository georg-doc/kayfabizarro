import json,sys
W=sys.argv[1]
Z=W+"/detail-inventory/"
def det(i,kind,desc,reg,zone,scale,affects,mtype,ref,conf):
    return dict(id=i,kind=kind,description=desc,region=dict(x=reg[0],y=reg[1],width=reg[2],height=reg[3],units="normalized"),
        scale=scale,affects=affects,mapsTo=dict(type=mtype,ref=ref),evidenceRef=Z+zone+".png",confidence=conf)
D=[
 det("keystone","ridge","crown voussoir proud of arch face, larger than neighbours",(0.33,0.4,0.2,0.2),"zone-r1c1","meso","geometry","component.localFeatures","arch-ring-front.keystone-proud",0.6),
 det("voussoir-joints","groove","radial joints of arch ring converge on arch centre",(0.15,0.45,0.4,0.35),"zone-r1c0","meso","geometry","component.localFeatures","arch-ring-front.voussoir-joints",0.55),
 det("arch-opening","hole","full-width segmental arch opening through the bridge",(0.18,0.5,0.4,0.35),"zone-r1c0","macro","geometry","component.localFeatures","arch-barrel.arch-opening",0.95),
 det("coping-rounded","bevel","parapet coping stones overhang wall; KFB: rounded capsule-like tops",(0.35,0.15,0.6,0.4),"zone-r0c1","meso","geometry","component.localFeatures","parapet-front.coping-rounded",0.7),
 det("coping-joints","groove","stepped joints between coping stones along the parapet",(0.6,0.2,0.35,0.35),"zone-r0c2","micro","geometry","component.localFeatures","parapet-front.coping-joints",0.7),
 det("deck-slab-joints","groove","transverse slab/plank joints across the deck near end",(0.55,0.4,0.35,0.2),"zone-r1c2","micro","geometry","component.localFeatures","deck.deck-slab-joints",0.7),
 det("abutment-block-joints","groove","block masonry courses on abutment faces",(0.6,0.6,0.35,0.3),"zone-r2c2","micro","geometry","component.localFeatures","abutment-east.block-joints",0.5),
 det("block-bevel","bevel","every stone block edge rounded (KFB claymation constraint)",(0.0,0.0,1.0,1.0),"zone-r1c1","meso","geometry","component.localFeatures","spandrel-front.block-bevel",0.9),
 det("tone-variation","stain","per-block albedo variation across 4 warm stone tones",(0.0,0.0,1.0,1.0),"zone-r1c1","meso","albedo","material.localOverrides","stone-warm.tone-variation",0.8),
 det("cavity-darkening","stain","darker value inside the vault / under the arch (AO, cavityBias)",(0.2,0.5,0.35,0.35),"zone-r2c0","meso","ao","material.localOverrides","stone-warm.cavity-darkening",0.6),
 det("road-tone","decal","road surface strip on deck, KFB colour #545e7a",(0.3,0.2,0.5,0.4),"zone-r0c1","macro","albedo","material.localOverrides","road-surface.road-tone",0.9),
 det("deck-edge-course","ridge","string course of stones marking the deck edge above the arch",(0.15,0.3,0.7,0.2),"zone-r1c1","meso","geometry","component.localFeatures","deck.deck-edge-course",0.6),
]
for p in [W+"/di.json"]:
    d=json.load(open(p)); d['detailInventory']['details']=D; d['detailInventory']['targetMinDetails']=10; json.dump(d,open(p,'w'),indent=2)
p=W+"/assessment.json"; d=json.load(open(p)); di=d['preSpecAssessment']['detailInventory']; di['details']=D; di['scanMethod']="grid-3x3"; json.dump(d,open(p,'w'),indent=2)
print(len(D))
