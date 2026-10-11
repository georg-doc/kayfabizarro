import json,sys
p=sys.argv[1]; d=json.load(open(p))
a=d['preSpecAssessment']
a['objectClass'].update(primaryType="single-span segmental stone arch bridge (game prop)",primaryDomain="object",
 formLanguage=["architectural","sculptural"],structureKind=["compound object","repeated modules"],
 motionPotential=["static prop"],materialFamilies=["stone"],
 notes="Observed: one-arch masonry bridge with abutments, spandrels, cambered deck, parapets. KFB re-style: claymation rounded blocks.")
a['complexity']['scores']=dict(silhouetteComplexity=2,componentCount=2,hierarchyDepth=2,repetitionDensity=2,materialLayerCount=1,localDetailDensity=2,occlusionRisk=1,actionReadinessNeed=0)
a['complexity']['estimatedCounts']=dict(macroComponents=5,mesoComponents=9,microFeatureGroups=5,materialLayers=3,repetitionSystems=4)
a['complexity']['reasoning']=["Five macro assemblies (arch barrel, 2 spandrel walls, 2 abutments, deck, 2 parapets) with repeated block modules (voussoirs, coping stones, wall blocks, deck slabs) -> complex tier.",
 "Single stone material but 4 albedo tones + road surface -> 3 material layers.",
 "Static prop: no articulation; action-readiness is only explode/click per part."]
a['unknownsToResolveBeforeImplementation']=["far face hidden -> mirrored from near face (bilateral symmetry assumption)",
 "vault intrados only partly visible -> assumed continuous barrel of voussoir rings",
 "reference is a 360px low-poly render; masonry bond pattern unreadable -> replaced by KFB block layout",
 "KFB target dimensions (span 8H, deck 5H, parapet 0.5H; H=3.64u) override reference proportions"]
q=d['qualityContract']
q['definitionOfDone']=[
 "Reads at first glance as a single-arch stone bridge from the reference 3/4 viewpoint: arch opening through full width, humped deck, boxy abutments, parapets.",
 "Claymation look: every stone is a thick rounded block (bevel radius >= 18% of smallest block dimension), no sharp cut faces, no plate thinner than 0.35 H.",
 "Arch ring is radial voussoirs (odd count, wedge-shaped, normal to intrados) with a visibly proud keystone at the crown.",
 "Palette is exactly the 4 stone tones #e6d4b5 #d1ba99 #b29c7d #9e856b distributed per block with seeded randomness, road #545e7a.",
 "Scale contract: span 8H=29.1u, deck width 5H=18.2u, parapet height 0.5H=1.82u above road (H=3.64u)."]
q['featureGroups'] += [
 {"id":"radial-voussoir-arch","name":"Radial voussoir arch ring with keystone","required":True,
  "qualityCriteria":["odd number of wedge voussoirs (13-17) whose joints point to the arch centre","keystone 1.25x deeper and proud of the face by >=0.15H","intrados continuous, no gaps between voussoirs > 0.02u"],
  "evidenceRefs":["reference arch ring on near face"],"failureModes":["voussoirs placed vertically instead of radially","no keystone","arch reads as cut-out hole in a slab"]},
 {"id":"claymation-rounded-blocks","name":"Thick rounded clay stone blocks","required":True,
  "qualityCriteria":["all blocks rounded-box geometry with bevel radius >= 18% of min dimension","slight per-block size/rotation jitter (seeded)","no thin plates"],
  "evidenceRefs":["KFB style constraint"],"failureModes":["sharp box edges","flat textured slabs instead of blocks"]},
 {"id":"parapet-coping","name":"Parapets with rounded copings following the deck camber","required":True,
  "qualityCriteria":["parapet top 0.5H above road","coping stones are rounded (capsule-like) and wider than the wall","follow the cambered deck curve"],
  "evidenceRefs":["reference stepped parapet top"],"failureModes":["parapet flat while deck is cambered","floating copings"]},
 {"id":"abutments-solid","name":"Solid abutments wider than the deck","required":True,
  "qualityCriteria":["abutments project laterally beyond the spandrels","arch springs from abutment inner faces","embedded in ground plane"],
  "evidenceRefs":["reference boxy end blocks"],"failureModes":["arch floats","abutments missing or as thin walls"]},
 {"id":"deck-road","name":"Cambered deck with road surface #545e7a","required":True,
  "qualityCriteria":["road surface runs between parapets along the camber","deck edge stones visible"],
  "evidenceRefs":["reference humped walkway"],"failureModes":["flat deck","road colour wrong"]}]
q['visualDeltaChecks'] += ["voussoir radiality (joint lines converge on arch centre)","edge roundness: no visible hard silhouette corners at review distance"]
q['minimumSpecDepth']['reviewViewpoints']=4
json.dump(d,open(p,'w'),indent=2)
print("ok")
