import sys; sys.path.insert(0,'/tmp/hex/work')
exec(open('/tmp/hex/work/scen.py').read())
import importlib, json, copy
sys.path.insert(0,'/tmp/hex/work'); import recipes
which=sys.argv[-1] if len(sys.argv)>1 else 'all'
for rec in recipes.ALL:
    r=copy.deepcopy(rec)
    out,tiles,props=build(r,render_prefix=f'/tmp/hex/work/rend/{rec["id"]}')
    r['_result']=out
    bpy.ops.wm.save_as_mainfile(filepath=f'/tmp/hex/work/{rec["id"]}.blend',compress=True)
    json.dump(r,open(f'/tmp/hex/work/{rec["id"]}_raw.json','w'),indent=1,default=str)
    print('S',rec['id'],[ (s['a'],s['b'],s['classA'],s['classB'],s['maxStep']) for s in out['seams']],[ (o['cell'],o['dir'],o['class'],o['deckY']) for o in out['openEdges']])
    print('P',[(p.get('id') or p.get('key'),p['support']) for p in out['props']])
