import json, collections, math
W='/tmp/hex/work/'; O='/tmp/hex/out/'
R='/tmp/hex/repo/'
M=json.load(open(R+'tools/KFB-ToolBox/_handover/HEX_BLENDER_BENCH_2026-10-02/data/HEX_BROWSER_MEASUREMENTS.json'))
inv=json.load(open(W+'blender_inventory_raw.json'))
s0={r['key']:r for r in M['s0']['rows']}; hinv={r['key']:r for r in M['hexTiles']['inventory']}; topo={t['key']:t['topology'] for t in M['hexTiles']['tiles']}
excl_off=set(M['edgeAtlas']['excluded']['offGrid']); excl_nodeck=set(M['edgeAtlas']['excluded']['noDeckSurface'])
HEAD='f4f3fdbb0925653c8c76d21313416fa49a6ffb3a'
def dump(n,o): json.dump(o,open(O+n,'w'),indent=1,ensure_ascii=False)
# ---------- inventory
rows=[]; agree=collections.Counter()
for r in inv:
    k=r['key']; b=s0[k]; h=hinv[k]
    if b['sourceStatus']=='loaded':
        ok=b['tris']==r['tris'] and all(abs(b['size'][i]-r['size'][i])<=0.002 and abs(b['min'][i]-r['min'][i])<=0.002 for i in range(3))
        st='MATCH_BROWSER_S0' if ok else 'MISMATCH_BROWSER_S0'
    else: st='NEW_BLENDER_ONLY (browser S0 deferred)'
    agree[st]+=1
    t=topo.get(k)
    rows.append({'key':k,'pack':h['pack'],'family':h['family'],'path':h['path'],'blob':h['source']['blobSha'],'sourceCommit':h['source']['commit'],
      'browserRole':b['role'],'browserS0':b['sourceStatus'],'agreement':st,
      'blender':{'tris':r['tris'],'verts':r['verts'],'meshObjects':r['meshObjects'],'meshNames':r['meshNames'],'materials':r['materials'],'images':r['images'],'uvLayers':r['uvLayers'],'vertexColors':r['vertexColors'],
                 'min_three':r['min'],'max_three':r['max'],'size_three':r['size'],'rootOrigin_three':r['roots'][0]['loc'],'empties':r['empties']},
      'topologyKinds':t.get('kinds') if t else None,'topologyStatus':t.get('status') if t else None,
      'edgeAtlasExcluded':'offGrid' if k in excl_off else 'noDeckSurface' if k in excl_nodeck else None})
dump('asset_inventory.json',{'schema':'kfb.hex-blender-inventory/0.1-candidate','handoffHead':HEAD,'coordinateFrame':'glTF/three.js (y up); Blender values converted (x, z, -y)','count':len(rows),'agreementWithBrowserS0':dict(agree),'rows':rows})
print(dict(agree))
