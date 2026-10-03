import asyncio, json, base64, sys, numpy as np
from playwright.async_api import async_playwright
STEPS=sys.argv[1].split(',')
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=await b.new_page(viewport={'width':1300,'height':920}); logs=[]
    pg.on('console',lambda m: logs.append(m.type+': '+m.text[:300])); pg.on('pageerror',lambda e: logs.append('PAGEERR '+str(e)[:500]))
    await pg.goto('http://localhost:8770/p0a.html'); await pg.wait_for_function('window.__ready===true',timeout=60000)
    pg.set_default_timeout(900000)
    r=await pg.evaluate('H.init()'); print('init',r)
    r=await pg.evaluate('H.soften()'); print('soften',json.dumps(r))
    if 'ref' in STEPS: print('ref',await pg.evaluate('H.compareRef()'))
    if 'export' in STEPS:
      s=await pg.evaluate('H.exportSoft()'); open('/tmp/p0a/work/building_A__soft.glb','wb').write(base64.b64decode(s)); print('exported', await pg.evaluate('H.getMerge()'))
    if 'bake' in STEPS:
      for seed in (101,102,103,104):
        r=await pg.evaluate(f'H.bake({seed},1024,"midfar")')
        for k in ('normal','rough','tint'):
          a=np.frombuffer(base64.b64decode(r[k]),dtype=np.float32).reshape(r['N'],r['N'],4); np.save(f'/tmp/p0a/work/bake_{seed}_{k}.npy',a)
        print('baked',seed)
    if 'render' in STEPS:
      jobs=json.load(open('/tmp/p0a/work/render_jobs.json'))
      out={}
      for j in jobs:
        r=await pg.evaluate('([v,k,o])=>H.render(v,k,o)',[j['v'],j['k'],j.get('o',{})])
        open(j['file'],'wb').write(base64.b64decode(r['url'].split(',')[1])); out[j['file']]=r['info']
      json.dump(out,open('/tmp/p0a/work/render_info.json','w'),indent=1); print('rendered',len(jobs))
    print('\n'.join(logs[-10:])); await b.close()
asyncio.run(main())
