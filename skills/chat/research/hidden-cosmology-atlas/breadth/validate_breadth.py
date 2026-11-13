"""Validate the bounded source corpus without treating source coverage as truth certification."""
import json,pathlib,collections,re
p=pathlib.Path(__file__).parent
packets=[json.loads((p/n).read_text()) for n in ['postwar-profiles-receipts.json','psi-source-receipts.json','institution-coverage.json','solari-intake.json']]
idx=json.loads((p/'ATLAS_BREADTH_READONLY_INDEX_R1_2026-11-01.json').read_text())
sources=sum([d['sources'] for d in packets],[]);claims=sum([d['claims'] for d in packets],[]);edges=sum([d.get('relations',d.get('edges',[])) for d in packets],[])
for seq,key in [(sources,'sourceId'),(claims,'claimId'),(edges,'edgeId'),(idx['entities'],'entityId'),(idx['questions'],'questionId')]:
 ids=[x[key] for x in seq];assert len(ids)==len(set(ids)),key+' collision'
sids={s['sourceId'] for s in sources};cids={c['claimId'] for c in claims};eids={e['entityId'] for e in idx['entities']}
for c in claims:assert set(c['sourceIds'])<=sids
for e in edges:
 assert set(e['sourceIds'])<=sids and set(e['claimIds'])<=cids,e['edgeId']
 assert e['causality'] is False,e['edgeId']
 assert {e['fromEntityId'],e['toEntityId']}<=eids,(e['edgeId'],e['fromEntityId'],e['toEntityId'])
 assert re.fullmatch('[0-9a-f]{40}',e['sourceGitSha']),e['edgeId']
for c in claims:
 for actor in c.get('assertedBy',[]):assert actor in eids
 if c.get('subjectWorkId'):assert c['subjectWorkId'] in eids
for q in idx['questions']:assert set(q['sourceIds'])<=sids
assert len(collections.Counter(q['clusterId'] for q in idx['questions']))==10
assert set(collections.Counter(q['clusterId'] for q in idx['questions']).values())=={3}
assert len(sources)==43 and len(claims)==35 and len(edges)==20
assert idx['readOnly'] is True
assert re.fullmatch('[0-9a-f]{40}',idx['sourceSnapshotGitSha'])
assert all(x['gitSha']==idx['sourceSnapshotGitSha'] for x in idx['sourcePackets'])
sol=packets[-1];se=next(e for e in sol['edges'] if e['edgeId']=='SOL-E02');assert se['eventDate']=='2017-04-27' and se['publicationDate'] is None and se['publicAvailabilityDate']=='2017-06-20'
assert next(c for c in sol['claims'] if c['claimId']=='SOL-C05')['entityId']=='fasab'
for slug in ['annie-jacobsen','linda-hunt','christopher-simpson','peter-dale-scott','andrija-puharich','ingo-swann','thomas-townsend-brown','nikola-tesla']:
 text=(p.parent/'authors'/(slug+'.md')).read_text();assert len(text.split())>=300,(slug,'too short');assert 'SOURCE_LEAD' in text or 'source-lead' in text
for file in list(p.glob('*.json'))+list((p.parent/'authors').glob('*.md')):
 # Existing masters are checked for new additive content separately; historical metadata is not deleted.
 if file.stem in ['catherine-austin-fitts','joseph-farrell','daniel-liszt','README']:continue
 s=file.read_text();assert not re.search(r'/Users/|docs\.google\.com/document/d/|dropbox\.com/s/|sk-[A-Za-z0-9]{20}',s),file
print(json.dumps({'status':'PASS','sourceIds':len(sids),'claimIds':len(cids),'edgeIds':len(edges),'resolvedEdgeEndpoints':40,'questions':30,'clusters':10,'dossiers':8,'sourceSnapshotGitSha':idx['sourceSnapshotGitSha']}))
