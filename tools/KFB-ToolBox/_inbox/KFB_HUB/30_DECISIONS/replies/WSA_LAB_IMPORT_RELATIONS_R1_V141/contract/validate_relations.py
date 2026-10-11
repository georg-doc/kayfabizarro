"""Proposal-only validator. No runtime writes, geometry construction or module fallback."""
import json
from pathlib import Path
from jsonschema import Draft202012Validator

def validate(packet, schema, context):
    Draft202012Validator(schema).validate(packet)
    errors=[];unresolved=[];deferred=[]
    islands={i['id']:i for i in context['islands']};places={}
    for p in packet['places']:
        if p['id'] in places:errors.append('duplicate place id: '+p['id'])
        places[p['id']]=p
        for k in ['name','action']:
            if not p[k].strip():errors.append('blank '+k)
        island=islands.get(p['island'])
        if island is None:errors.append('missing island: '+p['island']);continue
        for oid in [p['sourceObjectId']]+p['members']:
            if oid not in island['objects']:errors.append('missing source object in island: '+oid)
        if p['sourceObjectId'] in p['members']:errors.append('focus duplicated as member')
    ids=set();edges=set()
    for c in packet['connections']:
        if c['id'] in ids:errors.append('duplicate connection id')
        ids.add(c['id']);edge=(c['from'],c['to'])
        if edge in edges:errors.append('duplicate directed connection')
        edges.add(edge)
        if c['from']==c['to']:errors.append('self connection')
        if not c['reason'].strip():errors.append('blank reason')
        for side in ['from','to']:
            place=places.get(c[side]);a=c['desiredAttachment'][side]
            if place is None:errors.append('missing endpoint place: '+c[side]);continue
            island=islands.get(place['island'])
            if a['anchorId'] is not None and island is not None and a['anchorId'] not in island['anchors']:errors.append('anchor not in endpoint island')
            if a['type'] is None or a['anchorId'] is None:unresolved.append({'connection':c['id'],'end':side})
            if a['type']=='paternoster_platform':deferred.append({'connection':c['id'],'end':side,'status':'DEFERRED_V099'})
    if errors:raise ValueError('; '.join(errors))
    return {'data':'VALID_INTENT','unresolved':unresolved,'deferred':deferred,'construction':'NOT_AUTHORIZED_BY_PACKET','moduleResolution':'RECEIVER_MODULES_CATALOG_REQUIRED','geometryOrDrivePass':False}

if __name__=='__main__':
    import sys
    p=Path(__file__).parent
    result=validate(json.loads(Path(sys.argv[1]).read_text()),json.loads((p/'scene-study-v2.schema.json').read_text()),json.loads(Path(sys.argv[2]).read_text()))
    print(json.dumps(result,indent=2))
