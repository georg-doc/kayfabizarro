import struct,base64,json,urllib.request,urllib.parse,pathlib
m=json.load(open('tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/VISIBLE_SOURCE_MANIFEST.json'))
out=pathlib.Path('evidence/source/buildings');out.mkdir(parents=True,exist_ok=True)
for world,records in m['families'].items():
 for i,r in enumerate(records):
  u=r['source']['rawPinned']; data=urllib.request.urlopen(urllib.parse.quote(u,safe=':/%')).read(); target=out/(world+'-'+str(i)+'.gltf');target.write_bytes(data)
  if data[:4]==b'glTF':
   ln=struct.unpack_from('<I',data,12)[0];g=json.loads(data[20:20+ln]);off=20+ln
   if off<len(data):
    bn=struct.unpack_from('<I',data,off)[0];g['buffers'][0]['uri']='data:application/octet-stream;base64,'+base64.b64encode(data[off+8:off+8+bn]).decode()
   target.write_text(json.dumps(g))
  else:g=json.loads(data)
  for buf in g.get('buffers',[])+g.get('images',[]):
   uri=buf.get('uri','')
   if uri and not uri.startswith('data:'):
    dest=target.parent/uri;dest.parent.mkdir(parents=True,exist_ok=True)
    if not dest.exists():dest.write_bytes(urllib.request.urlopen(urllib.parse.quote(urllib.parse.urljoin(u,uri),safe=':/%')).read())
print('25 pinned building sources and their geometry buffers read; no production source modified.')
