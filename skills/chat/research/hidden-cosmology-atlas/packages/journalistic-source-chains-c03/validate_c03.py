"""Deterministic source/reference/export checks, not historical adjudication."""
import json,re
from pathlib import Path
p=Path(__file__).resolve().parent
root=p.parents[1]
g=json.loads((p/'atlas-source-chains.json').read_text())
packets=[json.loads((p/x).read_text()) for x in g['sourcePackets']]
sources=[s for q in packets for s in q['sources']];claims=[c for q in packets for c in q['claims']]
def unique(xs):assert len(xs)==len(set(xs)), 'Duplicate identifier'
for xs in [[s['sourceId'] for s in sources],[c['claimId'] for c in claims],[e['entityId'] for e in g['entities']],[e['edgeId'] for e in g['relations']]]:unique(xs)
sids={s['sourceId'] for s in sources};cids={c['claimId'] for c in claims};eids={e['entityId'] for e in g['entities']}
for c in claims:
 assert c['sourceIds'] and set(c['sourceIds'])<=sids
 assert c.get('attributedSpeaker') and c.get('specificPassage') and c.get('nextSourceTest'),c['claimId']
for e in g['relations']:
 assert e['fromEntityId'] in eids and e['toEntityId'] in eids,e['edgeId']
 assert e['causality'] is False
 assert e['sourceIds'] and set(e['sourceIds'])<=sids
 assert e['claimIds'] and set(e['claimIds'])<=cids
 assert e.get('sourceLocator') and e.get('nextFalsifier')
for c in g['chains']:
 assert c['authorId'] in eids and set(c['sourceIds'])<=sids and c['completeHistoricalProof'] is False
 assert (root/'authors'/f"{c['authorId']}.md").exists()
for s in sources:
 assert s['url'].startswith('https://') and ' ' not in s['url']
 assert s.get('readLimitations') and s.get('copyrightNotes')
assert len(sources)==16 and len(claims)==18 and len(g['relations'])==14 and len(g['chains'])==6
urls=(p/'PUBLIC_SOURCE_URLS.txt').read_text().splitlines();assert set(urls)=={s['url'] for s in sources}
reader=(p/'NOTEBOOKLM_READER.md').read_text()
for sid in sids:assert sid in reader
for a in g['chains']:assert a['authorId'] in (root/'authors'/f"{a['authorId']}.md").read_text()
assert 'Nicht in NotebookLM hochgeladen' in reader
prompt=(p/'GEMINI_NOTEBOOK_INVENTORY_PROMPT_DE.md').read_text()
for required in ['complete_account_inventory','membership_evidence','cited_links','metadata_withheld','not_compared','Keine neue Webrecherche','Erfinde keine']:assert required in prompt
empty=json.loads((p/'notebook-inventory.empty.json').read_text());schema=json.loads((p/'notebook-inventory.schema.json').read_text())
assert set(empty)==set(schema['required']);assert empty['notebooks']==[] and empty['sources']==[] and empty['complete_account_inventory'] is False
# Targeted private locator/credential scan across the new package and six masters.
for f in list(p.glob('*'))+[root/'authors'/f"{c['authorId']}.md" for c in g['chains']]:
 if f.suffix not in ['.md','.json','.txt']:continue
 text=f.read_text()
 assert not re.search(r'https://(?:docs\.google\.com/document/d/|app\.notion\.com/p/|www\.dropbox\.com/preview/|notebooklm\.google\.com/notebook/)',text),f.name
 assert not re.search(r'(?:Bearer\s+[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,})',text),f.name
print(json.dumps(dict(status='PASS',sources=len(sources),claims=len(claims),relations=len(g['relations']),resolvedEndpoints=2*len(g['relations']),authorCases=len(g['chains']),notebookImport='NOT_RUN',schemaCheck='template keys/values only; no full JSON Schema engine')))
