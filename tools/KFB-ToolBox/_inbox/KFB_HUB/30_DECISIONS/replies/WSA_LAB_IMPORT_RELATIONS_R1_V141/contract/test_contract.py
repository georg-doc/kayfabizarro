from pathlib import Path
import json,copy
from jsonschema import Draft202012Validator
from validate_relations import validate
p=Path(__file__).parent;s=json.loads((p/'scene-study-v2.schema.json').read_text());Draft202012Validator.check_schema(s)
base=json.loads((p/'existing-editor-relations.example.json').read_text());context=json.loads((p/'source-id-test-context.json').read_text());results=[]
for f in ['existing-editor-relations.example.json','attachment-types.example.json']:
 r=validate(json.loads((p/f).read_text()),s,context);assert r['unresolved'] and not r['geometryOrDrivePass'];results.append({'case':f,'result':'VALID_INTENT_UNRESOLVED'})
def reject(name, change):
 q=copy.deepcopy(base);change(q)
 try:validate(q,s,context)
 except Exception:results.append({'case':name,'result':'REJECTED'});return
 raise AssertionError(name+' wrongly accepted')
reject('geometry not permitted',lambda q:q.update(geometry={'vertices':[]}))
reject('unknown attachment type',lambda q:q['connections'][0]['desiredAttachment']['from'].update(type='custom_bezier'))
reject('missing source object',lambda q:q['places'][0].update(sourceObjectId='absent'))
reject('wrong island source object',lambda q:q['places'][0].update(sourceObjectId=q['places'][1]['sourceObjectId']))
reject('duplicate place ID',lambda q:q['places'].append(copy.deepcopy(q['places'][0])))
reject('missing endpoint',lambda q:q['connections'][0].update(to='absent'))
reject('self connection',lambda q:q['connections'][0].update(to=q['connections'][0]['from']))
reject('blank purpose',lambda q:q['connections'][0].update(reason=' '))
reject('blank activity',lambda q:q['places'][0].update(action=' '))
reject('foreign anchor',lambda q:q['connections'][0]['desiredAttachment']['from'].update(anchorId='foreign'))
reject('duplicate edge',lambda q:q['connections'].append({**copy.deepcopy(q['connections'][0]),'id':'other'}))
q=copy.deepcopy(base);q['connections'][0]['desiredAttachment']['from']['type']='paternoster_platform';assert validate(q,s,context)['deferred'];results.append({'case':'paternoster','result':'DEFERRED_INTENT_ONLY'})
q=copy.deepcopy(base);q['connections'].append({**copy.deepcopy(q['connections'][0]),'id':'return','from':q['connections'][0]['to'],'to':q['connections'][0]['from']});validate(q,s,context);results.append({'case':'directed return cycle','result':'VALID_INTENT'})
(p/'TEST_REPORT.json').write_text(json.dumps({'schemaMetaValidation':'PASS_DRAFT_2020_12','cases':results,'importerRuntime':'NOT_IMPLEMENTED_SCHEMA_PROPOSAL','sourceObjectsAndAnchors':'SCOPED_BY_RECEIVER_ISLAND','tests':'PASS'},indent=2)+'\n');print('PASS',len(results),'cases + Draft2020-12 meta-validation')
