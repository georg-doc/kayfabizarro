"""Check source graph/reference integrity; not a historical truth test."""
import json,pathlib,re
p=pathlib.Path(__file__).resolve().parent
root=p.parents[1]
idx=json.loads((root/'breadth/ATLAS_BREADTH_READONLY_INDEX_R1_2026-11-01.json').read_text())
ds=[json.loads((p/f).read_text()) for f in ['jwg-source-receipts.json','context-receipts.json']]
sources=sum([d['sources'] for d in ds],[]);claims=sum([d['claims'] for d in ds],[]);edges=sum([d.get('relations',d.get('edges',[])) for d in ds],[])
for seq,key in [(sources,'sourceId'),(claims,'claimId'),(edges,'edgeId'),(idx['entities'],'entityId')]:
 ids=[r[key] for r in seq];assert len(ids)==len(set(ids)),key
sid={s['sourceId'] for s in sources};cid={c['claimId'] for c in claims};eid={e['entityId'] for e in idx['entities']}
assert len(sid)==9 and len(cid)==13 and len(edges)==11
assert not sid.intersection(s['sourceId'] for s in idx['sources'])
assert not cid.intersection(c['claimId'] for c in idx['claimRefs'])
for c in claims:assert set(c['sourceIds'])<=sid
for e in edges:
 assert e['causality'] is False,e['edgeId']
 assert e['claimIds'] and set(e['claimIds'])<=cid and set(e['sourceIds'])<=sid
 assert {e['fromEntityId'],e['toEntityId']}<=eid,e['edgeId']
 assert e['sourceLocator'] and e['ownerPath'] and e['nextFalsifier']
 assert re.fullmatch('[0-9a-f]{40}',e['sourceGitSha'])
assert sum(e['layer']=='A_DOCUMENTARY' for e in edges)==7
assert sum(e['layer']=='B_AUTHOR_ASSERTION' for e in edges)==1
assert sum(e['layer']=='C_CONCEPTUAL_NONCAUSAL' for e in edges)==3
extension=idx['extensions'][0]
assert len(extension['questions'])==4 and len(extension['sourceRefs'])==9
assert all(r['gitSha']==extension['sourceSnapshotGitSha'] for r in extension['sourcePackets']+extension['sourceRefs']+extension['claimRefs'])
assert re.fullmatch('[0-9a-f]{40}',extension['sourceSnapshotGitSha'])
assert len(idx['registeredResearchCollections'])==4
for r in idx['registeredResearchCollections']:assert r['registrationOnly'] is True and re.fullmatch('[0-9a-f]{40}',r['gitSha'])
assert idx['metrics']['sourceRecords']==43 and idx['metrics']['newAuthorMasters']==8
assert idx['reusedExternalRecords']['ownerPath'].endswith('jorjani-michels-trilogy-2025-2026/')
assert next(s for s in sources if s['sourceId']=='JWC-S02')['publicationDate']=='2024-08-28'
assert next(s for s in sources if s['sourceId']=='JWC-S02')['originalPublicationDate']=='2024-08-20'
assert next(s for s in sources if s['sourceId']=='JWG-S04')['publicationDate'] is None
assert 'SEARCH_INDEX_ONLY' in next(s for s in sources if s['sourceId']=='JWG-S05')['accessScope']
assert next(e for e in edges if e['edgeId']=='JWG-E02')['ownerPath'].endswith('authors/mark-goodwin.md')
for slug in ['whitney-webb','mark-goodwin']:
 text=(root/'authors'/(slug+'.md')).read_text();assert 'entityId: '+slug in text and 'SOURCE_LEAD_DOSSIER' in text
for f in list(p.glob('*.json'))+[root/'authors/whitney-webb.md',root/'authors/mark-goodwin.md']:
 assert not re.search(r'/Users/|docs\.google\.com/document/d/|dropbox\.com/s/|sk-[A-Za-z0-9]{20}',f.read_text()),f
print(json.dumps(dict(status='PASS',sources=9,claims=13,edges=11,resolvedEdgeEndpoints=22,questions=4,registeredCollections=4,sourceSnapshot=extension['sourceSnapshotGitSha'])))
