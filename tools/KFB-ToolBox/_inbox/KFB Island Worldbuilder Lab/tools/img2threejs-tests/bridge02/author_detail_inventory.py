import json,sys
W=sys.argv[1]; Z=W+"/detail-inventory/"
def det(i,kind,desc,reg,zone,scale,affects,mtype,ref,conf):
    return dict(id=i,kind=kind,description=desc,region=dict(x=reg[0],y=reg[1],width=reg[2],height=reg[3],units="normalized"),
        scale=scale,affects=affects,mapsTo=dict(type=mtype,ref=ref),evidenceRef=Z+zone+".png",confidence=conf)
D=[
 det("keystone","ridge","crown voussoir, slightly wider and proud of the ring face",(0.3,0.3,0.15,0.15),"zone-r1c0","meso","geometry","component.localFeatures","ring-front/keystone-proud",0.6),
 det("voussoir-joints","groove","tapered voussoirs, radial joints converge on the arch centre",(0.15,0.3,0.35,0.3),"zone-r1c0","meso","geometry","component.localFeatures","ring-front/radial-joints",0.7),
 det("arch-opening","hole","near-semicircular opening through the full width",(0.15,0.35,0.35,0.35),"zone-r1c0","macro","geometry","component.localFeatures","arch/arch-opening",0.95),
 det("cap-stones","bevel","rounded parapet cap stones overhanging the wall",(0.2,0.25,0.6,0.15),"zone-r0c1","meso","geometry","component.localFeatures","caps-front/cap-overhang",0.7),
 det("pavement-joints","groove","rounded slab pavement of varying lengths",(0.35,0.3,0.4,0.25),"zone-r1c1","micro","geometry","component.localFeatures","pavement/slab-joints",0.7),
 det("boulders","bevel","grey rounded boulders under the abutments",(0.45,0.6,0.45,0.35),"zone-r2c1","macro","geometry","component.localFeatures","footing-east/rounded-boulders",0.8),
 det("grass-lip","bevel","thick grass cap with a rounded overhanging lip on the abutment rock",(0.6,0.55,0.35,0.1),"zone-r1c2","meso","geometry","component.localFeatures","grass-east/rounded-lip",0.75),
 det("lantern-glow","stain","warm glowing lantern glass in a dark green frame",(0.5,0.25,0.1,0.15),"zone-r0c1","micro","emission","material.localOverrides","lantern-light/emissive-glow",0.8),
 det("ivy-cluster","ridge","few chunky ivy clusters hanging from pillar and spandrel faces",(0.45,0.45,0.12,0.25),"zone-r1c1","meso","geometry","component.localFeatures","ivy-1/leaf-blobs",0.7),
 det("block-bevel","bevel","every block edge rounded (clay)",(0.0,0.0,1.0,1.0),"zone-r1c1","meso","geometry","component.localFeatures","face-wall-front/block-bevel",0.9),
 det("tone-variation","stain","per-block tone variation across the 4 masonry tones",(0.0,0.0,1.0,1.0),"zone-r1c1","meso","albedo","material.localOverrides","masonry-1/tone-variation",0.8),
 det("soffit-darker","stain","barrel soffit blocks darker than face blocks",(0.2,0.4,0.3,0.25),"zone-r1c0","meso","albedo","material.localOverrides","masonry-4/cavity-darkening",0.6),
]
d=json.load(open(W+"/di.json")); d['detailInventory']['details']=D; d['detailInventory']['targetMinDetails']=10; json.dump(d,open(W+"/di.json",'w'),indent=2)
p=W+"/assessment.json"; d=json.load(open(p)); di=d['preSpecAssessment']['detailInventory']; di['details']=D; di['scanMethod']="grid-3x3"; json.dump(d,open(p,'w'),indent=2)
print(len(D))
