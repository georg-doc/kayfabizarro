import asyncio,json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-angle=swiftshader','--enable-unsafe-swiftshader']); pg=await b.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8772/bind.html'); await pg.wait_for_function('window.__ready===true')
    res={}
    for fid,o,n,r in json.load(open('/tmp/eye2/web/jobs.json')):
      res[fid]=await pg.evaluate('([o,n,r])=>check(o,n,r)',[o,n,r]); print(fid,json.dumps(res[fid]))
    json.dump(res,open('/tmp/eye2/work/bind_check.json','w'),indent=1); print(errs); await b.close()
asyncio.run(main())
