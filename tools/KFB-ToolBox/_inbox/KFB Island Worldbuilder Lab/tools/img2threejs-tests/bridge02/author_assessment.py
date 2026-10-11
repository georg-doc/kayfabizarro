# bridge02: fills the pre-spec assessment + quality contract (paperwork for the img2threejs gate)
import json,sys
p=sys.argv[1]; d=json.load(open(p))
a=d['preSpecAssessment']
a['objectClass'].update(primaryType="single-span stone arch bridge field (KFB game prop, drivable)",primaryDomain="object",
 formLanguage=["architectural","sculptural"],structureKind=["compound object","repeated modules"],
 motionPotential=["static prop"],materialFamilies=["stone","foliage","metal","glass"],
 notes="G4 concept sheet: arch ring + keystone, pillars with lanterns, boulder footing, grass caps, cap stones, slab pavement, ivy. KFB clay re-style, flat deck.")
a['complexity']['scores']=dict(silhouetteComplexity=2,componentCount=3,hierarchyDepth=2,repetitionDensity=3,materialLayerCount=2,localDetailDensity=2,occlusionRisk=1,actionReadinessNeed=0)
a['complexity']['estimatedCounts']=dict(macroComponents=7,mesoComponents=12,microFeatureGroups=8,materialLayers=6,repetitionSystems=6)
a['complexity']['reasoning']=["7 macro assemblies with dense repeated block modules (voussoirs, barrel courses, wall courses, caps, slabs, pillar courses) -> complex tier.",
 "Masonry 4 tones + rock 2 greys + grass + lantern green + emissive glass.","Static drivable prop; action-readiness = deck collider + end sockets."]
a['unknownsToResolveBeforeImplementation']=["back face mirrored from front","abutment interior hidden -> dark masonry core","sheet hump overridden: flat deck gradient 0","K2 scale overrides sheet proportions"]
q=d['qualityContract']
q['definitionOfDone']=[
 "Side by side with sheet panels B and F it reads as the same bridge family: clean wedge voussoir ring with keystone, chunky rounded clay blocks, grey boulder footing, grass caps, 4 pillars with lanterns, cap stones, slab pavement, 2-4 ivy clusters.",
 "Voussoirs are tapered wedges (radial joints), no V-gaps; spandrel blocks are chord-cut to the extrados and never cut into the ring.",
 "Flat drivable deck (gradient 0); span 30, rise 0.35 span, deck width 19.2, parapet ~0.5H, lantern top 1.6H (H=3.64).",
 "Colours only from the role palette; no gradients, speckle or outline rings.",
 "<= 40k triangles, merged geometry per part family, one shared clay material."]
q['featureGroups'] += [
 {"id":"voussoir-ring","name":"Wedge voussoir ring with keystone","required":True,"qualityCriteria":["odd count of tapered voussoirs","radial joints, no V-gaps","keystone proud"],"evidenceRefs":["sheet B/F"],"failureModes":["rubble look","spandrel blocks cut the ring"]},
 {"id":"rock-footing","name":"Grey boulder footing + grass cap with rounded lip","required":True,"qualityCriteria":["rounded grey boulders under both abutments","thick grass cap with overhanging lip, no hard cut"],"evidenceRefs":["sheet A/B/F"],"failureModes":["masonry to the ground","flat grass plate"]},
 {"id":"pillars-lanterns","name":"End pillars with chunky clay lanterns","required":True,"qualityCriteria":["4 pillars rising above the parapet","dark green post + warm glowing box"],"evidenceRefs":["sheet lamp post detail"],"failureModes":["missing lanterns","thin wire lanterns"]},
 {"id":"parapet-caps","name":"Parapet with cap stones","required":True,"qualityCriteria":["cap stones overhang the wall","rounded"],"evidenceRefs":["sheet parapet cap detail"],"failureModes":["flat wall top"]},
 {"id":"slab-pavement","name":"Rounded stone slab pavement, flat","required":True,"qualityCriteria":["rounded slabs of varying length","gradient 0"],"evidenceRefs":["sheet pavement detail"],"failureModes":["asphalt planks","hump"]},
 {"id":"clay-ivy","name":"2-4 chunky clay ivy clusters","required":True,"qualityCriteria":["few big blobby leaves","claymation, stylised"],"evidenceRefs":["sheet ivy detail"],"failureModes":["many tiny single leaves"]}]
q['minimumSpecDepth']['reviewViewpoints']=5
json.dump(d,open(p,'w'),indent=2); print("ok")
